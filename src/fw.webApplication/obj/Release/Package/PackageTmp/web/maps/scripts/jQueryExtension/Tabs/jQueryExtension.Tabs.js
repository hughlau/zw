$.Tabs = {
    Tab: function () {
        return {
            Title: null                                                            //Tab标题
                , TitleImageUrl: null                                                  //Tab标题的图片
                , IsCanClose: true                                                     //是否支持关闭标签
                , IsHtmlPage: false
                , Url: null
                , Name: null
                , Data: {}
                , Scrolling: jQueryExtension.Data.IframeScrolling.Yes
                , Selector: null                                                //对应标签内容的选择器
                , ContentHtml: null                                                    //对应标签内容的Html
        };
    }
    , AddTabs: function (Properties) {
        if (!fw.fwObject.FWObjectHelper.hasValue(Properties)) {
            Properties = {}
        };
        var Settings = {
            Selector: null                                                        //Tab控件选择器
            , Tab: null                                                           //添加Tab
            , Tabs: []                                                            //添加多个Tab
            , IsSelected: true                                                    //是否选中
        };
        $.extend(Settings, Properties);

        if (Settings.Tab != null) {
            Settings.Tabs.push(Settings.Tab);
        };

        for (var i = 0; i < Settings.Tabs.length; i++) {
            var TabSettings = $.Tabs.Tab();
            $.extend(TabSettings, Settings.Tabs[i]);
            Settings.Tabs[i] = TabSettings;
        };

        if (Settings.Tabs.length > 0) {
            var SelectorJQ = $(Settings.Selector);
            SelectorJQ.each(function () {
                var ControlJQs = $(this).data("ControlJQs");
                for (var i = 0; i < Settings.Tabs.length; i++) {
                    var TabWindowGuid = fw.guid();
                    var MustSelectedIndex;
                    var IsHasTab = false;
                    var Tabs_Content_OuterJQ;
                    var InnerSelectorJQ;
                    if (fw.fwObject.FWObjectHelper.hasValue(Settings.Tabs[i].Url) && fw.fwObject.FWObjectHelper.hasValue(Settings.Tabs[i].Name) && $("#Tabs_Content_Iframe__" + Settings.Tabs[i].Name).length > 0) {
                        InnerSelectorJQ = $("#Tabs_Content_Iframe__" + Settings.Tabs[i].Name);
                        Tabs_Content_OuterJQ = InnerSelectorJQ.parent();
                        MustSelectedIndex = $(">div.jQueryExtension_UI_Tabs_Content_Outer", ControlJQs.Tabs_ContentJQ).index(Tabs_Content_OuterJQ);
                        IsHasTab = true;
                    } else {
                        var TitleHtml = "";
                        TitleHtml += "                    <td class=\"jQueryExtension_UI_Tabs_Title_TrTabs_Tab\">";
                        TitleHtml += "                        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">";
                        TitleHtml += "                            <tr>";
                        if (fw.fwObject.FWObjectHelper.hasValue(Settings.Tabs[i].Url)) {
                            TitleHtml += "                                <td style=\"white-space: nowrap;\"><div class=\"jQueryExtension_UI_Tabs_Title_TrTabs_TabBrowser\" title=\"" + Settings.Tabs[i].Title + "\" ></div></td>";
                        } else if (fw.fwObject.FWObjectHelper.hasValue(Settings.Tabs[i].TitleImageUrl)) {
                            TitleHtml += "                                <td style=\"white-space: nowrap;\"><img class=\"jQueryExtension_UI_Tabs_Title_TrTabs_TabImage\" src=\"" + Settings.Tabs[i].TitleImageUrl + "\" alt=\"" + Settings.Tabs[i].Title + "\" /></td>";
                        };
                        TitleHtml += "                                <td style=\"white-space: nowrap;\" class=\"\">" + Settings.Tabs[i].Title + "</td>";
                        if (Settings.Tabs[i].IsCanClose) {
                            TitleHtml += "                                <td style=\"white-space: nowrap;\"><div id=\"Tabs_Title_TrTabs_TabClose__" + TabWindowGuid + "\" class=\"jQueryExtension_UI_Tabs_Title_TrTabs_TabClose\" title=\"关闭\" ></div></td>";
                        } else {
                            TitleHtml += "                                <td style=\"white-space: nowrap;\"><div id=\"Tabs_Title_TrTabs_NoTabClose__" + TabWindowGuid + "\" class=\"jQueryExtension_UI_Tabs_Title_TrTabs_NoTabClose\"></div></td>";
                        };
                        TitleHtml += "                            </tr>";
                        TitleHtml += "                        </table>";
                        TitleHtml += "                    </td>";
                        TitleHtml += "                    <td class=\"jQueryExtension_UI_Tabs_Title_TrTabs_TabEmpty\">";
                        TitleHtml += "                        <div class=\"jQueryExtension_UI_Tabs_Title_TrTabs_TabEmptyInner\">";
                        TitleHtml += "                        </div>";
                        TitleHtml += "                    </td>";
                        $(TitleHtml).appendTo(ControlJQs.Tabs_Title_TrTabsJQ);
                        $("#Tabs_Title_TrTabs_TabClose__" + TabWindowGuid).bind("click", function () {
                            $.Tabs.TabClose({ Selector: ControlJQs.TabsJQ, Tabs_Title_TrTabs_TabCloseJS: this });
                        });
                    };

                    if (!IsHasTab) {
                        Tabs_Content_OuterJQ = $("<div id=\"Tabs_Content_Outer__" + TabWindowGuid + "\" class=\"jQueryExtension_UI_Tabs_Content_Outer\"></div>").appendTo(ControlJQs.Tabs_ContentJQ).height(ControlJQs.Tabs_ContentJQ.height());
                    };
                    if (fw.fwObject.FWObjectHelper.hasValue(Settings.Tabs[i].Url)) {
                        TabWindowGuid = !fw.fwObject.FWObjectHelper.hasValue(Settings.Tabs[i].Name) ? TabWindowGuid : Settings.Tabs[i].Name;
                        if (!IsHasTab) {
                            InnerSelectorJQ = $("<iframe id=\"Tabs_Content_Iframe__" + TabWindowGuid + "\" name=\"jQueryExtension_UI_Tabs_Content_Iframe__" + TabWindowGuid + "\" frameborder=\"0\" scrolling=\"" + Settings.Tabs[i].Scrolling + "\"></iframe>").appendTo(Tabs_Content_OuterJQ);
                        };
                        InnerSelectorJQ.data("SubmitData", {
                            IsHtmlPage: Settings.Tabs[i].IsHtmlPage
                            , Url: Settings.Tabs[i].Url
                            , Name: "jQueryExtension_UI_Tabs_Content_Iframe__" + TabWindowGuid
                            , Data: Settings.Tabs[i].Data
                        });
                        //                        jQueryExtension.Window.Submit({
                        //                            IsHtmlPage: Settings.Tabs[i].IsHtmlPage
                        //                            , Url: Settings.Tabs[i].Url
                        //                            , Name: "jQueryExtension_UI_Tabs_Content_Iframe__" + TabWindowGuid
                        //                            , Data: Settings.Tabs[i].Data
                        //                        });
                    } else if (fw.fwObject.FWObjectHelper.hasValue(Settings.Tabs[i].Selector)) {
                        InnerSelectorJQ = $(Settings.Tabs[i].Selector);
                        InnerSelectorJQ.appendTo(Tabs_Content_OuterJQ).show();
                    } else if (fw.fwObject.FWObjectHelper.hasValue(Settings.Tabs[i].ContentHtml)) {
                        Tabs_Content_OuterJQ.append(Settings.Tabs[i].ContentHtml);
                    };

                    if (!IsHasTab) {
                        Tabs_Content_OuterJQ.unbind('jQueryExtension_Event_Resize').bind("jQueryExtension_Event_Resize", function () {
                            Tabs_Content_OuterJQ = $(this);
                            InnerSelectorJQ = $(">*:first", Tabs_Content_OuterJQ);
                            if (fw.fwObject.FWObjectHelper.hasValue(InnerSelectorJQ)) {
                                if (InnerSelectorJQ[0].tagName.toUpperCase() == "IFRAME") {
                                    InnerSelectorJQ.width("100%");
                                    jQueryExtension.ResizeWidthHeight({
                                        Selector: InnerSelectorJQ
                                    , Height: Tabs_Content_OuterJQ.height()
                                    });
                                    if (($.browser.msie && ($.browser.version == "6.0" || $.browser.version == "7.0"))) {
                                        var IframeWindow = InnerSelectorJQ[0].contentWindow;
                                        try {
                                            if (fw.fwObject.FWObjectHelper.hasValue(IframeWindow) && $.isFunction(IframeWindow.WindowResize)) {
                                                IframeWindow.WindowResize();
                                            };
                                        } catch (ex) {
                                            //跨域会报错
                                        };
                                    };
                                } else {
                                    jQueryExtension.ResizeWidthHeight({
                                        Selector: InnerSelectorJQ
                                    , Height: Tabs_Content_OuterJQ.height() - 2
                                    });
                                };
                            };
                        });
                    };
                };

                if (!IsHasTab) {
                    $('>td.jQueryExtension_UI_Tabs_Title_TrTabs_Tab', ControlJQs.Tabs_Title_TrTabsJQ).unbind('click').bind('click', function (e) {
                        var Tabs_Title_TrTabs_TabJQ = $(this);
                        var Tabs_Title_TrTabs_AllTdJQs = $('>td', ControlJQs.Tabs_Title_TrTabsJQ);
                        var Tabs_Title_TrTabs_TabJQs = Tabs_Title_TrTabs_AllTdJQs.filter('.jQueryExtension_UI_Tabs_Title_TrTabs_Tab');
                        var Tabs_Title_TrTabs_TabEmptyJQs = Tabs_Title_TrTabs_AllTdJQs.filter('.jQueryExtension_UI_Tabs_Title_TrTabs_TabEmpty');

                        Tabs_Title_TrTabs_AllTdJQs.removeAttr('class');
                        Tabs_Title_TrTabs_TabJQs.addClass('jQueryExtension_UI_Tabs_Title_TrTabs_Tab');
                        Tabs_Title_TrTabs_TabEmptyJQs.addClass('jQueryExtension_UI_Tabs_Title_TrTabs_TabEmpty');

                        if (Tabs_Title_TrTabs_TabEmptyJQs.length > 0) {
                            Tabs_Title_TrTabs_TabEmptyJQs.eq(0).addClass('jQueryExtension_UI_Tabs_Title_TrTabs_TabLeft');
                            Tabs_Title_TrTabs_TabEmptyJQs.eq(Tabs_Title_TrTabs_TabEmptyJQs.length - 1).addClass('jQueryExtension_UI_Tabs_Title_TrTabs_TabRight');

                            var tdPrevJQ = Tabs_Title_TrTabs_TabJQ.prev();
                            if (tdPrevJQ.prev().length > 0) {
                                tdPrevJQ.addClass('jQueryExtension_UI_Tabs_Title_TrTabs_TabEmptyLeftSelected');
                            } else {
                                tdPrevJQ.addClass('jQueryExtension_UI_Tabs_Title_TrTabs_TabLeftSelected');
                            };
                            Tabs_Title_TrTabs_TabJQ.addClass('jQueryExtension_UI_Tabs_Title_TrTabs_TabSelected');
                            var tdNextJQ = Tabs_Title_TrTabs_TabJQ.next();
                            if (tdNextJQ.next().length > 0) {
                                tdNextJQ.addClass('jQueryExtension_UI_Tabs_Title_TrTabs_TabEmptyRightSelected');
                            } else {
                                tdNextJQ.addClass('jQueryExtension_UI_Tabs_Title_TrTabs_TabRightSelected');
                            };

                            var Index = Tabs_Title_TrTabs_TabJQs.index(Tabs_Title_TrTabs_TabJQ);
                            //                        $(">div", ControlJQs.Tabs_ContentJQ).hide().eq(Index).show();
                            var Tabs_Content_OuterJQs = $(">div.jQueryExtension_UI_Tabs_Content_Outer", ControlJQs.Tabs_ContentJQ).height(0);
                            var Tabs_Content_OuterJQ = Tabs_Content_OuterJQs.eq(Index);
                            var InnerSelectorJQ = $(">*:first", Tabs_Content_OuterJQ);
                            var SubmitData = InnerSelectorJQ.data("SubmitData");
                            if (SubmitData != undefined) {
                                InnerSelectorJQ.removeData("SubmitData");
                                jQueryExtension.Window.Submit(SubmitData);
                            };
                            jQueryExtension.ResizeWidthHeight({
                                Selector: Tabs_Content_OuterJQ
                                , Height: Tabs_Content_OuterJQ.parent().height()
                            });
                            ControlJQs.TabsJQ.data('SelectedIndex', Index);
                        };
                    });
                };

                var Tabs_Title_TrTabs_AllTdJQs = $('>td', ControlJQs.Tabs_Title_TrTabsJQ);
                var Tabs_Title_TrTabs_TabJQs = Tabs_Title_TrTabs_AllTdJQs.filter('.jQueryExtension_UI_Tabs_Title_TrTabs_Tab');
                var Tabs_Title_TrTabs_TabEmptyJQs = Tabs_Title_TrTabs_AllTdJQs.filter('.jQueryExtension_UI_Tabs_Title_TrTabs_TabEmpty');

                var SelectedIndex = ControlJQs.TabsJQ.data('SelectedIndex');
                if (Tabs_Title_TrTabs_TabJQs.length > 0) {
                    if (SelectedIndex == undefined) {
                        SelectedIndex = Tabs_Title_TrTabs_TabJQs.length;
                    };
                    Tabs_Title_TrTabs_AllTdJQs.eq(0).show();
                    if (!fw.fwObject.FWObjectHelper.hasValue(MustSelectedIndex)) {
                        if (Settings.IsSelected) {
                            SelectedIndex = Tabs_Title_TrTabs_TabJQs.length - 1;
                        } else {
                            SelectedIndex = SelectedIndex >= Tabs_Title_TrTabs_TabJQs.length ? (Tabs_Title_TrTabs_TabJQs.length - 1) : (SelectedIndex - 1);
                        };
                    } else {
                        SelectedIndex = MustSelectedIndex;
                    };
                    Tabs_Title_TrTabs_TabJQs.eq(SelectedIndex).click();
                    ControlJQs.TabsJQ.data('SelectedIndex', SelectedIndex);
                } else {
                    Tabs_Title_TrTabs_AllTdJQs.eq(0).hide();
                };


                ControlJQs.TabsJQ.Tabs_Init();
                jQueryExtension.ScrollLeft(ControlJQs.Tabs_Title_DivTabsJQ, 999999999);
            });
        };
    }
    , TabClose: function (Properties) {
        var Settings = {
            Selector: null                                       //Tab控件选择器
            , Tabs_Title_TrTabs_TabCloseJS: null
            , SelectedIndex: -1                                   //默认打开的菜单索引，支持多菜单打开，格式（0,1,2,3）
        };
        $.extend(Settings, Properties);
        var ControlJQs = $(Settings.Selector).data("ControlJQs");
        if (fw.fwObject.FWObjectHelper.hasValue(Settings.Tabs_Title_TrTabs_TabCloseJS)) {
            var Tabs_Title_TrTabs_TabJQ = $(Settings.Tabs_Title_TrTabs_TabCloseJS).parent().parent().parent().parent().parent();
            var Tabs_Title_TrTabs_TabJQs = $(">td.jQueryExtension_UI_Tabs_Title_TrTabs_Tab", ControlJQs.Tabs_Title_TrTabsJQ);
            Settings.SelectedIndex = Tabs_Title_TrTabs_TabJQs.index(Tabs_Title_TrTabs_TabJQ);
        };
        if (Settings.SelectedIndex > -1) {
            var Tabs_Title_TrTabs_TabJQ = $(">td.jQueryExtension_UI_Tabs_Title_TrTabs_Tab", ControlJQs.Tabs_Title_TrTabsJQ).eq(Settings.SelectedIndex);
            Tabs_Title_TrTabs_TabJQ.next().remove();
            Tabs_Title_TrTabs_TabJQ.remove();
            $('>div.jQueryExtension_UI_Tabs_Content_Outer', ControlJQs.Tabs_ContentJQ).eq(Settings.SelectedIndex).remove();

            var Tabs_Title_TrTabs_TabJQs = $(">td.jQueryExtension_UI_Tabs_Title_TrTabs_Tab", ControlJQs.Tabs_Title_TrTabsJQ);
            var SelectedIndex = ControlJQs.TabsJQ.data('SelectedIndex');
            SelectedIndex = SelectedIndex >= Tabs_Title_TrTabs_TabJQs.length ? (Tabs_Title_TrTabs_TabJQs.length - 1) : SelectedIndex;
            $.Tabs.Select({ Selector: Settings.Selector, SelectedIndex: SelectedIndex });
        };
    }
    , Select: function (properties) {
        var Settings = {
            Selector: null                                       //Tab控件选择器
            , SelectedIndex: -1                                   //默认打开的菜单索引，支持多菜单打开，格式（0,1,2,3）
        };
        $.extend(Settings, properties);

        var ControlJQs = $(Settings.Selector).data("ControlJQs");
        var Tabs_Title_TrTabs_TabJQs = $(">td.jQueryExtension_UI_Tabs_Title_TrTabs_Tab", ControlJQs.Tabs_Title_TrTabsJQ);
        if (Tabs_Title_TrTabs_TabJQs.length > 0) {
            Tabs_Title_TrTabs_TabJQs.eq(Settings.SelectedIndex).click();
            var SelectedTabTotalWidth = 0;
            for (var i = 0; i <= Settings.SelectedIndex; i++) {
                SelectedTabTotalWidth += Tabs_Title_TrTabs_TabJQs.eq(i).width();
            };
            jQueryExtension.ScrollLeft(ControlJQs.Tabs_Title_DivTabsJQ, SelectedTabTotalWidth - ControlJQs.Tabs_Title_TableTabsJQ.width() / 2);
        } else {
            $(">td:first", ControlJQs.Tabs_Title_TrTabsJQ).hide();
        };
        ControlJQs.TabsJQ.Tabs_Init();
    }
    , GetSelectedIndex: function (Properties) {
        var Settings = {
            Selector: null                                       //Tab控件选择器
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
    Tabs_Init: function (Properties) {
        if (!fw.fwObject.FWObjectHelper.hasValue(Properties)) {
            Properties = {}
        };
        var Settings = {};
        $.extend(Settings, Properties);

        var SelectorJQ = this;
        SelectorJQ.each(function () {
            var ControlJQs;
            var TabsJQ = $(this);
            var WindowGuid = TabsJQ.data("WindowGuid");
            if (!fw.fwObject.FWObjectHelper.hasValue(WindowGuid)) {
                WindowGuid = fw.guid();

                var Html = "";
                Html += "    <div id=\"Tabs_Title__" + WindowGuid + "\" class=\"jQueryExtension_UI_Tabs_Title\">";
                Html += "        <div id=\"Tabs_Title_DivTabs__" + WindowGuid + "\" class=\"jQueryExtension_UI_Tabs_Title_DivTabs\">";
                Html += "            <table id=\"Tabs_Title_TableTabs__" + WindowGuid + "\" class=\"jQueryExtension_UI_Tabs_Title_TableTabs\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">";
                Html += "                <tr id=\"Tabs_Title_TrTabs__" + WindowGuid + "\" class=\"jQueryExtension_UI_Tabs_Title_TrTabs\">";
                Html += "                    <td class=\"jQueryExtension_UI_Tabs_Title_TrTabs_TabEmpty\" style=\"display:none;\">";
                Html += "                        <div class=\"jQueryExtension_UI_Tabs_Title_TrTabs_TabEmptyInner\">";
                Html += "                        </div>";
                Html += "                    </td>";
                Html += "                </tr>";
                Html += "            </table>";
                Html += "        </div>";
                Html += "        <div id=\"Tabs_Title_Tabs_ToLeft__" + WindowGuid + "\" class=\"jQueryExtension_UI_Tabs_Title_Tabs_ToLeft\"></div>";
                Html += "        <div id=\"Tabs_Title_Tabs_ToRight__" + WindowGuid + "\" class=\"jQueryExtension_UI_Tabs_Title_Tabs_ToRight\"></div>";
                Html += "    </div>";
                Html += "    <div id=\"Tabs_Content__" + WindowGuid + "\" class=\"jQueryExtension_UI_Tabs_Content\">";
                Html += "    </div>";
                $(Html).appendTo(TabsJQ);

                ControlJQs = {
                    IsInit: true
                    , TabsJQ: TabsJQ.data("WindowGuid", WindowGuid).addClass('jQueryExtension_UI_Tabs').data('SelectedIndex', -1)
                    , Tabs_TitleJQ: $("#Tabs_Title__" + WindowGuid)
                    , Tabs_Title_DivTabsJQ: $("#Tabs_Title_DivTabs__" + WindowGuid)
                    , Tabs_Title_TableTabsJQ: $("#Tabs_Title_TableTabs__" + WindowGuid)
                    , Tabs_Title_TrTabsJQ: $("#Tabs_Title_TrTabs__" + WindowGuid)
                    , Tabs_Title_Tabs_ToLeftJQ: $("#Tabs_Title_Tabs_ToLeft__" + WindowGuid).data("Direction", -1)
                    , Tabs_Title_Tabs_ToRightJQ: $("#Tabs_Title_Tabs_ToRight__" + WindowGuid).data("Direction", 1)
                    , Tabs_ContentJQ: $("#Tabs_Content__" + WindowGuid)
                };

                ControlJQs.Tabs_Title_Tabs_ToLeftJQ.add(ControlJQs.Tabs_Title_Tabs_ToRightJQ).hide();

                ControlJQs.Tabs_ContentJQ.bind("jQueryExtension_Event_Resize", function () {
                    var Tabs_Content_OuterJQ = $(">div.jQueryExtension_UI_Tabs_Content_Outer", ControlJQs.Tabs_ContentJQ).eq(ControlJQs.TabsJQ.data('SelectedIndex'));
                    var Height = ControlJQs.Tabs_ContentJQ.height();
                    jQueryExtension.ResizeWidthHeight({
                        Selector: Tabs_Content_OuterJQ
                        , Height: Height
                    });
                });

                ControlJQs.TabsJQ.bind("jQueryExtension_Event_Resize", function () {
                    ControlJQs.Tabs_Title_DivTabsJQ.width(ControlJQs.TabsJQ.width() - 48);
                    if (ControlJQs.Tabs_Title_TableTabsJQ.width() > ControlJQs.Tabs_Title_DivTabsJQ.width()) {
                        ControlJQs.Tabs_Title_Tabs_ToLeftJQ.add(ControlJQs.Tabs_Title_Tabs_ToRightJQ).show();
                    } else {
                        ControlJQs.Tabs_Title_Tabs_ToLeftJQ.add(ControlJQs.Tabs_Title_Tabs_ToRightJQ).hide();
                    };

                    $("div.jQueryExtension_UI_Tabs", ControlJQs.Tabs_ContentJQ).each(function () {
                        var ChildControlJQs = $(this).data("ControlJQs");
                        ChildControlJQs.Tabs_Title_DivTabsJQ.width(ChildControlJQs.TabsJQ.width() - 48);
                        if (ChildControlJQs.Tabs_Title_TableTabsJQ.width() > ChildControlJQs.Tabs_Title_DivTabsJQ.width()) {
                            ChildControlJQs.Tabs_Title_Tabs_ToLeftJQ.add(ChildControlJQs.Tabs_Title_Tabs_ToRightJQ).show();
                        } else {
                            ChildControlJQs.Tabs_Title_Tabs_ToLeftJQ.add(ChildControlJQs.Tabs_Title_Tabs_ToRightJQ).hide();
                        };
                    });

                    var Tabs_TitleBox = jQueryExtension.Box(ControlJQs.Tabs_TitleJQ);
                    var Height = ControlJQs.TabsJQ.height() - ControlJQs.Tabs_TitleJQ.height() - Tabs_TitleBox.PaddingTop;
                    if (($.browser.msie && $.browser.version == "6.0")) {
                        Height -= 1;
                    };
                    jQueryExtension.ResizeWidthHeight({
                        Selector: ControlJQs.Tabs_ContentJQ
                        , Height: Height
                    });
                });

                TabsJQ.data("ControlJQs", ControlJQs);
            } else {
                ControlJQs = TabsJQ.data("ControlJQs");
                ControlJQs.IsInit = false;
            };
            TabsJQ.triggerHandler("jQueryExtension_Event_Resize");
        });
    }
    , Tabs: function (properties) {
        if (typeof (properties) == "undefined") {
            properties = {};
        };
        var Settings = {
            IsFlash: jQueryExtension.IsFlash()
            , Speed: jQueryExtension.Data.Settings.Speed
            , Frequency: jQueryExtension.Data.Settings.Frequency
            , SelectedIndex: -1                                 //默认打开的菜单索引 1
            , Height: null
            , Tabs: []                                         //各个Tab的属性
        };
        $.extend(Settings, properties);

        if (this.length > 0) {
            for (var i = 0; i < Settings.Tabs.length; i++) {
                var TabSettings = $.Tabs.Tab();
                $.extend(TabSettings, Settings.Tabs[i]);
                Settings.Tabs[i] = TabSettings;
            };

            if (!Settings.IsFlash) {
                Settings.Speed = 0;
            };

            this.Tabs_Init(Settings);
            this.each(function () {
                var ControlJQs = $(this).data("ControlJQs");

                if (fw.fwObject.FWObjectHelper.hasValue(ControlJQs)) {
                    $.Tabs.AddTabs({
                        Selector: ControlJQs.TabsJQ
                        , Tabs: Settings.Tabs
                    });

                    ControlJQs.Tabs_Title_Tabs_ToLeftJQ.add(ControlJQs.Tabs_Title_Tabs_ToRightJQ).unbind('click').bind('click', function (e) {
                        var Direction = $(e.target).data("Direction");
                        var Tabs_Title_DivTabsJS = ControlJQs.Tabs_Title_DivTabsJQ[0];
                        Tabs_Title_DivTabsJS.scrollLeft = Tabs_Title_DivTabsJS.scrollLeft + Direction * ControlJQs.Tabs_Title_DivTabsJQ.width();
                    });

                    if (Settings.SelectedIndex > -1) {
                        $.Tabs.Select({ Selector: ControlJQs.TabsJQ, SelectedIndex: Settings.SelectedIndex });
                    };

                    if (fw.fwObject.FWObjectHelper.hasValue(Settings.Height)) {
                        $.Tabs.ResizeWidthHeight({
                            Selector: ControlJQs.TabsJQ
                            , Height: Settings.Height
                        });
                    };
                };
            });
        };


    }
});