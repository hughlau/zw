$.Speaker = {
    SetDataSource: function (Properties) {
        if (typeof (Properties) == "undefined") {
            Properties = {};
        };
        var Settings = {
            Selector: null
                    , TemplateFunction: null
                    , DataSource: []
        };
        $.extend(Settings, Properties);

        var SelectorJQ = $(Settings.Selector);

        SelectorJQ.each(function () {
            var SpeakerJQ = $(this);
            var ControlData = SpeakerJQ.data("ControlData");

            if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                if (!$.isFunction(Settings.TemplateFunction)) {
                    Settings.TemplateFunction = ControlData.Settings.TemplateFunction;
                };
                if ($.isFunction(Settings.TemplateFunction)) {
                    ControlData.ControlJQs.Speaker_ulContentJQ.empty();
                    if (Settings.DataSource != null && Settings.DataSource.length > 0) {
                        for (var i = 0; i < Settings.DataSource.length; i++) {
                            var Entity = Settings.DataSource[i];
                            var liJQ = $("<li></li>").appendTo(ControlData.ControlJQs.Speaker_ulContentJQ);
                            var html = Settings.TemplateFunction(Entity, i, liJQ);
                            if (fw.fwObject.FWObjectHelper.hasValue(html)) {
                                liJQ.html(html);
                            };
                            //$(Settings.TemplateFunction(Entity, i)).appendTo(liJQ);
                        };
                        $(">li:first", ControlData.ControlJQs.Speaker_ulContentJQ).clone().appendTo(ControlData.ControlJQs.Speaker_ulContentJQ);
                        $.Speaker.Start({ Selector: SpeakerJQ });
                    } else {
                        $.Speaker.Stop({ Selector: SpeakerJQ });
                    };
                };
            };
        });
    }
    , AddDataSource: function (Properties) {
        if (typeof (Properties) == "undefined") {
            Properties = {};
        };
        var Settings = {
            Selector: null
            , TemplateFunction: null
            , DataSource: []
        };
        $.extend(Settings, Properties);

        var SelectorJQ = $(Settings.Selector);
        SelectorJQ.each(function () {
            var SpeakerJQ = $(this);
            var ControlData = SpeakerJQ.data("ControlData");
            if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                if (!$.isFunction(Settings.TemplateFunction)) {
                    Settings.TemplateFunction = ControlData.Settings.TemplateFunction;
                };
                if ($.isFunction(Settings.TemplateFunction)) {
                    if (Settings.DataSource != null && Settings.DataSource.length > 0) {
                        var liLastJQ = $(">li:last", ControlData.ControlJQs.Speaker_ulContentJQ);
                        for (var i = 0; i < Settings.DataSource.length; i++) {
                            var Entity = Settings.DataSource[i];
                            var liJQ = $("<li></li>").appendTo(ControlData.ControlJQs.Speaker_ulContentJQ);
                            $(Settings.TemplateFunction(Entity, i)).appendTo(liJQ);
                        };
                        liLastJQ.appendTo(ControlData.ControlJQs.Speaker_ulContentJQ);
                        $.Speaker.Start({ Selector: SpeakerJQ });
                    };
                };
            };
        });
    }
    , ClearDataSource: function (Properties) {
        if (typeof (Properties) == "undefined") {
            Properties = {};
        };
        var Settings = {
            Selector: null
        };
        $.extend(Settings, Properties);

        var SelectorJQ = $(Settings.Selector);
        SelectorJQ.each(function () {
            var SpeakerJQ = $(this);
            var ControlData = SpeakerJQ.data("ControlData");
            if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                ControlData.ControlJQs.Speaker_ulContentJQ.empty();
                $.Speaker.Stop({ Selector: SpeakerJQ });
            };
        });
    }
    , Stop: function (Properties) {
        if (typeof (Properties) == "undefined") {
            Properties = {};
        };
        var Settings = {
            Selector: null
        };
        $.extend(Settings, Properties);

        var SelectorJQ = $(Settings.Selector);
        SelectorJQ.each(function () {
            var SpeakerJQ = $(this);
            var ControlData = SpeakerJQ.data("ControlData");
            if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                clearInterval(ControlData.IntervalID);
                $.ImagePlayer.Stop({ Selector: ControlData.ControlJQs.Speaker_divOpenJQ });
            };
        });
    }
    , Start: function (Properties) {
        if (typeof (Properties) == "undefined") {
            Properties = {};
        };
        var Settings = {
            Selector: null
        };
        $.extend(Settings, Properties);

        var SelectorJQ = $(Settings.Selector);
        SelectorJQ.each(function () {
            var SpeakerJQ = $(this);
            var ControlData = SpeakerJQ.data("ControlData");
            if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                clearInterval(ControlData.IntervalID);
                ControlData.IntervalID = setInterval(function () {
                    var LineHeight = 37;
                    var MarginTop = parseInt(ControlData.ControlJQs.Speaker_ulContentJQ.css("margin-top"), 10);
                    if ((MarginTop + ControlData.ControlJQs.Speaker_ulContentJQ.height()) <= LineHeight) {
                        ControlData.ControlJQs.Speaker_ulContentJQ.css("margin-top", 0);
                        MarginTop = parseInt(ControlData.ControlJQs.Speaker_ulContentJQ.css("margin-top"), 10);
                    };
                    ControlData.ControlJQs.Speaker_ulContentJQ.animate({
                        "margin-top": (MarginTop - LineHeight) + "px"
                    }, ControlData.Settings.RollingTime, function () {
                    });
                }, ControlData.Settings.RollingTime + ControlData.Settings.ResidenceTime);
                $.ImagePlayer.Start({ Selector: ControlData.ControlJQs.Speaker_divOpenJQ });
            };
        });
    }
};

//图片播放器
$.fn.extend({
    Speaker_Init: function (Settings) {
        this.empty().addClass("jQueryExtension_UI_Speaker");

        this.each(function () {
            var SpeakerJQ = $(this);
            var ControlData = SpeakerJQ.data("ControlData");
            if (!fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                ControlData = {
                    Settings: Settings
                };
                SpeakerJQ.data("ControlData", ControlData);

                var WindowGuid = fw.guid();
                var Html = "";
                Html += "<div class=\"jQueryExtension_UI_Speaker_Container_Background\"></div>";
                Html += "<div class=\"jQueryExtension_UI_Speaker_Container_Content\">";
                Html += "    <div class=\"jQueryExtension_UI_Speaker_divContent\">";
                Html += "        <ul class=\"jQueryExtension_UI_Speaker_ulContent\">";
                //Html += "            <li><a>饮用水源地 成功接收最新数据237条</a></li>";
                Html += "        </ul>";
                Html += "    </div>";
                Html += "    <div class=\"jQueryExtension_UI_Speaker_divClose\"></div>";
                Html += "    <div class=\"jQueryExtension_UI_Speaker_divMore\"></div>";
                Html += "    <div class=\"jQueryExtension_UI_Speaker_divOpen\"></div>";
                Html += "</div>";
                $(Html).appendTo(SpeakerJQ);

                ControlData.ControlJQs = {
                    IsInit: true
                    , WindowGuid: WindowGuid
                    , SpeakerJQ: SpeakerJQ
                };
                ControlData.ControlJQs.Container_ContentJQ = $(">div.jQueryExtension_UI_Speaker_Container_Content", ControlData.ControlJQs.SpeakerJQ);
                ControlData.ControlJQs.Speaker_divContentJQ = $(">div.jQueryExtension_UI_Speaker_divContent", ControlData.ControlJQs.Container_ContentJQ);
                ControlData.ControlJQs.Speaker_ulContentJQ = $(">ul.jQueryExtension_UI_Speaker_ulContent", ControlData.ControlJQs.Speaker_divContentJQ);
                ControlData.ControlJQs.Speaker_divOpenJQ = $(">div.jQueryExtension_UI_Speaker_divOpen", ControlData.ControlJQs.Container_ContentJQ);
                ControlData.ControlJQs.Speaker_divCloseJQ = $(">div.jQueryExtension_UI_Speaker_divClose", ControlData.ControlJQs.Container_ContentJQ);
                ControlData.ControlJQs.Speaker_divMoreJQ = $(">div.jQueryExtension_UI_Speaker_divMore", ControlData.ControlJQs.Container_ContentJQ);

                ControlData.ControlJQs.Speaker_divOpenJQ.bind("click", function () {
                    if (ControlData.ControlJQs.SpeakerJQ.hasClass("Open")) {
                        ControlData.ControlJQs.Speaker_divCloseJQ.click();
                    } else {
                        ControlData.ControlJQs.SpeakerJQ.addClass("Open").width(ControlData.Settings.Width);
                        //
                        $("div#divWeather").css("left", "400px");
                    };
                }).ImagePlayer({
                    ImageUrl: null                  //图片的地址
                    , Total: 6                   //动画的图片总数
                    , Width: 31                   //单张图片宽度
                    , Height: 31                  //单张图片高度
                    , PerLineTotal: null            //每行图片的个数
                    , ColumnSpacing: 0              //图片之间水平间距（列距）
                    , LineSpacing: 0                //图片之间垂直间距（行距）
                    , PlaySpeed: 200                //图片播放速度(毫秒)
                    , IsStart: false                //是否开始动画
                }).click();
                ControlData.ControlJQs.Speaker_divCloseJQ.bind("click", function () {
                    ControlData.ControlJQs.SpeakerJQ.removeClass("Open").width(ControlData.Settings.MinWidth);
                    //
                    $("div#divWeather").css("left", "50px");
                }).click();
                ControlData.ControlJQs.Speaker_divMoreJQ.bind("click", function () {
                    if ($.isFunction(ControlData.Settings.MoreFunction)) {
                        ControlData.Settings.MoreFunction();
                    };
                });
                if (ControlData.Settings.IsHasMore) {
                    ControlData.ControlJQs.Speaker_divMoreJQ.show();
                } else {
                    ControlData.ControlJQs.Speaker_divCloseJQ.show();
                };

                ControlData.DefaultZIndex = parseInt(ControlData.ControlJQs.SpeakerJQ.css("z-index"));
            } else {
                ControlData.ControlJQs.IsInit = false;
            };
        });
    }
    , Speaker: function (Properties) {
        if (typeof (Properties) == "undefined") {
            Properties = {};
        };
        var Settings = {
            Selector: null
            , Width: 37
            , TemplateFunction: null
            , DataSource: []
            , RollingTime: 800
            , ResidenceTime: 4000
            , IsHasMore: false
            , MoreFunction: function () { }
        };
        $.extend(Settings, Properties);
        Settings.MinWidth = 37;
        if (Settings.Width < Settings.MinWidth) { Settings.Width = Settings.MinWidth; };

        var SelectorJQ = this;
        SelectorJQ.data("ControlData", null);
        if (SelectorJQ.length > 0) {
            SelectorJQ.Speaker_Init(Settings);

            SelectorJQ.each(function () {
                var SpeakerJQ = $(this);
                var ControlData = SpeakerJQ.data("ControlData");

                $.Speaker.SetDataSource({
                    Selector: ControlData.ControlJQs.SpeakerJQ
                    , DataSource: Settings.DataSource
                });
            });

        };
        return this;

    }
});
