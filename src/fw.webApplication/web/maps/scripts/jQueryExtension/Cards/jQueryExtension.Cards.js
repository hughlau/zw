$.Cards = {
    Card: function () {
        return {
            Title: null                                                            //Card标题
            , TitleImageUrl: null                                                  //Card标题的图片            
            , IsCanClose: true                                                     //是否支持关闭标签
            , IsHtmlPage: true
            , Url: null
            , Name: null
            , Data: {}
            , Scrolling: jQueryExtension.Data.IframeScrolling.No
            , Selector: null                                                       //对应标签内容的选择器
            , ContentHtml: null                                                    //对应标签内容的Html
            , TitleHeight: 28
            , Spacing: 0
            , IsShowBorder: false
            , Width: 320
            , Height: 240
            , DataSource: null
            , LoadDelay: 100
        };
    }
    , OpenCard: function (Properties) {
        if (!fw.fwObject.FWObjectHelper.hasValue(Properties)) {
            Properties = {}
        };
        var Settings = {
            Selector: null                                                        //Card控件选择器
        };
        $.extend(Settings, Properties);

        var CardJQ = $(Settings.Selector);
        if (CardJQ.length > 0) {
            var ControlData = CardJQ.data("ControlData");
            ControlData.ControlJQs.Card_Content_IframeLoadingJQ.show();
            setTimeout(function () {
                jQueryExtension.Window.Submit({
                    IsHtmlPage: ControlData.Settings.IsHtmlPage
                    , Url: ControlData.Settings.Url
                    , Name: "jQueryExtension_UI_Card_Content_Iframe__" + CardJQ.data("WindowGuid")
                    , Data: ControlData.Settings.Data
                });
                if (ControlData.ControlJQs.Card_Content_IframeJQ.length > 0 && ControlData.ControlJQs.Card_Content_IframeJQ.data("ControlData") == undefined) {
                    var onloadFunction = function (IframeJS) {
                        return function () {
                            var ControlData = $(IframeJS).data("ControlData");
                            if (ControlData != undefined) {
                                ControlData.ControlJQs.Card_Content_IframeLoadingJQ.hide();
                            };
                        };
                    };
                    ControlData.ControlJQs.Card_Content_IframeJQ.data("ControlData", ControlData);
                    var IframeJS = ControlData.ControlJQs.Card_Content_IframeJQ[0];
                    if (IframeJS.attachEvent) {
                        IframeJS.attachEvent("onload", onloadFunction(IframeJS));
                    } else {
                        IframeJS.onload = function () {
                            var ControlData = $(this).data("ControlData");
                            if (ControlData != undefined) {
                                ControlData.ControlJQs.Card_Content_IframeLoadingJQ.hide();
                            };
                        };
                    };
                };
            }, ControlData.Settings.LoadDelay);
        };
    }
    , AddCards: function (Properties) {
        if (!fw.fwObject.FWObjectHelper.hasValue(Properties)) {
            Properties = {}
        };
        var Settings = {
            Selector: null                                                        //Card控件选择器
            , Card: null                                                           //添加Card
            , Cards: []                                                            //添加多个Card
            , IsSelected: true                                                    //是否选中
        };
        $.extend(Settings, Properties);

        if (Settings.Card != null) {
            Settings.Cards.push(Settings.Card);
        };

        for (var i = 0; i < Settings.Cards.length; i++) {
            var CardSettings = $.Cards.Card();
            $.extend(CardSettings, Settings.Cards[i]);
            Settings.Cards[i] = CardSettings;
        };

        if (Settings.Cards.length > 0) {
            var SelectorJQ = $(Settings.Selector);
            SelectorJQ.each(function () {
                var ControlJQs = $(this).data("ControlJQs");
                var CardsJQ = ControlJQs.CardsJQ;
                for (var i = 0; i < Settings.Cards.length; i++) {
                    var CardSettings = Settings.Cards[i];
                    var CardWindowGuid = fw.guid();
                    var Html = "";
                    Html += "<div id=\"Card__" + CardWindowGuid + "\" class=\"jQueryExtension_UI_Card\">";
                    Html += "    <div id=\"Card_Background__" + CardWindowGuid + "\" class=\"jQueryExtension_UI_Card_Background\"></div>";
                    Html += "    <div id=\"Card_Front__" + CardWindowGuid + "\" class=\"jQueryExtension_UI_Card_Front\">";
                    Html += "        <div id=\"Card_Title__" + CardWindowGuid + "\" class=\"jQueryExtension_UI_Card_Title\"></div>";
                    Html += "        <div id=\"Card_Content__" + CardWindowGuid + "\" class=\"jQueryExtension_UI_Card_Content\">";
                    Html += "            <iframe id=\"Card_Content_Iframe__" + CardWindowGuid + "\" name=\"jQueryExtension_UI_Card_Content_Iframe__" + CardWindowGuid + "\" frameborder=\"0\" scrolling=\"" + CardSettings.Scrolling + "\" style=\"width: 100%; height: 100%; height: 500px;\"></iframe>";
                    Html += "            <div id=\"Card_Content_IframeLoading__" + CardWindowGuid + "\" class=\"jQueryExtension_UI_Card_Content_IframeLoading\"></div>";
                    Html += "        </div>";
                    Html += "    </div>";
                    Html += "</div>";
                    var CardJQ = $(Html).appendTo(CardsJQ);

                    var ControlData = {
                        ControlJQs: {
                            IsInit: true
                            , CardJQ: CardJQ.data("WindowGuid", CardWindowGuid)
                            , Card_BackgroundJQ: $("#Card_Background__" + CardWindowGuid)
                            , Card_FrontJQ: $("#Card_Front__" + CardWindowGuid)
                            , Card_TitleJQ: $("#Card_Title__" + CardWindowGuid)
                            , Card_ContentJQ: $("#Card_Content__" + CardWindowGuid)
                            , Card_Content_IframeJQ: $("#Card_Content_Iframe__" + CardWindowGuid)
                            , Card_Content_IframeLoadingJQ: $("#Card_Content_IframeLoading__" + CardWindowGuid)
                        }
                        , Settings: CardSettings
                    }

                    ControlData.ControlJQs.CardJQ.width(CardSettings.Width).height(CardSettings.Height);
                    ControlData.ControlJQs.Card_BackgroundJQ.css("width", "100%").height(CardSettings.Height);
                    if (CardSettings.Width == 320) { ControlData.ControlJQs.Card_BackgroundJQ.addClass("SmallCard"); } else if (CardSettings.Width == 650) { ControlData.ControlJQs.Card_BackgroundJQ.addClass("LargeCard"); };
                    ControlData.ControlJQs.Card_FrontJQ.css("width", "100%").height(CardSettings.Height).css("margin-top", (0 - CardSettings.Height) + "px");
                    ControlData.ControlJQs.Card_TitleJQ.css("width", "100%").height(CardSettings.TitleHeight);
                    var Card_ContentBox = jQueryExtension.Box(ControlData.ControlJQs.Card_ContentJQ);
                    var ContentWidth = CardSettings.Width - CardSettings.Spacing * 2 - Card_ContentBox.BorderLeft - Card_ContentBox.BorderRight;
                    var ContentHeight = CardSettings.Height - CardSettings.TitleHeight - CardSettings.Spacing - Card_ContentBox.BorderTop - Card_ContentBox.BorderBottom;
                    ControlData.ControlJQs.Card_ContentJQ.width(ContentWidth).height(ContentHeight);
                    ControlData.ControlJQs.Card_Content_IframeJQ.width(ContentWidth).height(ContentHeight);
                    ControlData.ControlJQs.Card_Content_IframeLoadingJQ.width(ContentWidth).height(ContentHeight).css("margin-top", (0 - ContentHeight) + "px");
                    ControlData.ControlJQs.Card_TitleJQ.html(CardSettings.Title);

                    ControlData.ControlJQs.CardJQ.data("ControlData", ControlData);

                    $.Cards.OpenCard({ Selector: ControlData.ControlJQs.CardJQ });
                };
            });
        };
    }
    , CardClose: function (Properties) {
        var Settings = {
            Selector: null                                       //Card控件选择器
            , Cards_Title_TrCards_CardCloseJS: null
            , SelectedIndex: -1                                   //默认打开的菜单索引，支持多菜单打开，格式（0,1,2,3）
        };
        $.extend(Settings, Properties);
        var ControlJQs = $(Settings.Selector).data("ControlJQs");
        if (fw.fwObject.FWObjectHelper.hasValue(Settings.Cards_Title_TrCards_CardCloseJS)) {
            var Cards_Title_TrCards_CardJQ = $(Settings.Cards_Title_TrCards_CardCloseJS).parent().parent().parent().parent().parent();
            var Cards_Title_TrCards_CardJQs = $(">td.jQueryExtension_UI_Cards_Title_TrCards_Card", ControlJQs.Cards_Title_TrCardsJQ);
            Settings.SelectedIndex = Cards_Title_TrCards_CardJQs.index(Cards_Title_TrCards_CardJQ);
        };
        if (Settings.SelectedIndex > -1) {
            var Cards_Title_TrCards_CardJQ = $(">td.jQueryExtension_UI_Cards_Title_TrCards_Card", ControlJQs.Cards_Title_TrCardsJQ).eq(Settings.SelectedIndex);
            Cards_Title_TrCards_CardJQ.next().remove();
            Cards_Title_TrCards_CardJQ.remove();
            $('>div.jQueryExtension_UI_Cards_Content_Outer', ControlJQs.Cards_ContentJQ).eq(Settings.SelectedIndex).remove();

            var Cards_Title_TrCards_CardJQs = $(">td.jQueryExtension_UI_Cards_Title_TrCards_Card", ControlJQs.Cards_Title_TrCardsJQ);
            var SelectedIndex = ControlJQs.CardsJQ.data('SelectedIndex');
            SelectedIndex = SelectedIndex >= Cards_Title_TrCards_CardJQs.length ? (Cards_Title_TrCards_CardJQs.length - 1) : SelectedIndex;
            $.Cards.Select({ Selector: Settings.Selector, SelectedIndex: SelectedIndex });
        };
    }
    , Select: function (properties) {
        var Settings = {
            Selector: null                                       //Card控件选择器
            , SelectedIndex: -1                                   //默认打开的菜单索引，支持多菜单打开，格式（0,1,2,3）
        };
        $.extend(Settings, properties);

        var ControlJQs = $(Settings.Selector).data("ControlJQs");
        var Cards_Title_TrCards_CardJQs = $(">td.jQueryExtension_UI_Cards_Title_TrCards_Card", ControlJQs.Cards_Title_TrCardsJQ);
        if (Cards_Title_TrCards_CardJQs.length > 0) {
            Cards_Title_TrCards_CardJQs.eq(Settings.SelectedIndex).click();
        } else {
            $(">td:first", ControlJQs.Cards_Title_TrCardsJQ).hide();
        };
        ControlJQs.CardsJQ.Cards_Init();
    }
    , GetSelectedIndex: function (Properties) {
        var Settings = {
            Selector: null                                       //Card控件选择器
        };
        $.extend(Settings, Properties);

        return $(Settings.Selector).data("SelectedIndex");
    }
    , ResizeWidthHeight: function (Properties) {
        /// <summary>
        ///     改变控件宽度高度，并触发大小改变事件
        /// </summary>
        /// <param name="Properties" type="Options">
        ///     一组用于默认配置的键/值对。
        ///      1: IsFlash: jQueryExtension.IsFlash() - 是否以flash效果展示。
        ///      2: Speed: jQueryExtension.Data.Settings.Speed - 动画完成的速度（毫秒）。
        ///      3: Frequency: jQueryExtension.Data.Settings.Frequency - 动画帧的频率（毫秒）。
        ///      4: Selector: null - （选择器）需要改变宽度高度的元素
        ///      5: Width: null - 宽度值
        ///      6: Height: null - 高度值
        /// </param>
        var Settings = {
            IsFlash: jQueryExtension.IsFlash()
            , Speed: jQueryExtension.Data.Settings.Speed
            , Frequency: jQueryExtension.Data.Settings.Frequency
            , Selector: null
            , Width: null
            , Height: null
        };
        $.extend(Settings, Properties);

        jQueryExtension.ResizeWidthHeight(Settings);
    }
};

//分页Menu
$.fn.extend({
    Cards_Init: function (Properties) {
        if (!fw.fwObject.FWObjectHelper.hasValue(Properties)) {
            Properties = {}
        };
        var Settings = {};
        $.extend(Settings, Properties);

        var SelectorJQ = this;
        SelectorJQ.each(function () {
            var ControlJQs;
            var CardsJQ = $(this);
            var WindowGuid = CardsJQ.data("WindowGuid");
            if (!fw.fwObject.FWObjectHelper.hasValue(WindowGuid)) {
                WindowGuid = fw.guid();

                ControlJQs = {
                    IsInit: true
                    , CardsJQ: CardsJQ.data("WindowGuid", WindowGuid).addClass('jQueryExtension_UI_Cards').data('SelectedIndex', -1)
                };

                CardsJQ.data("ControlJQs", ControlJQs);
            } else {
                ControlJQs = CardsJQ.data("ControlJQs");
                ControlJQs.IsInit = false;
            };
        });
    }
    , Cards: function (properties) {
        if (typeof (properties) == "undefined") {
            properties = {};
        };
        var Settings = {
            IsFlash: jQueryExtension.IsFlash()
            , Speed: jQueryExtension.Data.Settings.Speed
            , Frequency: jQueryExtension.Data.Settings.Frequency
            , SelectedIndex: -1                                 //默认打开的菜单索引 1
            , Height: null
            , Cards: []                                         //各个Card的属性
            , CallBack: function () { }
        };
        $.extend(Settings, properties);

        if (this.length > 0) {
            for (var i = 0; i < Settings.Cards.length; i++) {
                var CardSettings = $.Cards.Card();
                $.extend(CardSettings, Settings.Cards[i]);
                Settings.Cards[i] = CardSettings;
            };

            if (!Settings.IsFlash) {
                Settings.Speed = 0;
            };

            this.Cards_Init(Settings);
            this.each(function () {
                var ControlJQs = $(this).data("ControlJQs");

                if (fw.fwObject.FWObjectHelper.hasValue(ControlJQs)) {
                    $.Cards.AddCards({
                        Selector: ControlJQs.CardsJQ
                        , Cards: Settings.Cards
                    });
                };
            });
        };

        if ($.isFunction(Settings.CallBack)) { Settings.CallBack({}); };

    }
});