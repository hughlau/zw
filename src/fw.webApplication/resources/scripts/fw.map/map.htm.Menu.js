//加载菜单
function LoadMenu() {
    //MenuListBind({ Selector: $("#divMenuSystem"), DataSelector: $("#divMenuSystem_1"), DataSource: MenuData, ModuleSelector: divModuleJQ, TopHeight: divLogoJQ.height(), BottomHeight: divFootJQ.height(), API: API });
    //动态菜单
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall",
        serviceName: "sysBasicManage",
        methodName: "getUserMenuBasicManage",
        data: {
            ticket: $.page.ticket,
            menuTypeCode: fw.m.sysManage.data.FWMenuTypeCode.WebMainMenu,
            isTreeData: 1
        },
        success: function (resultData) {

            if (resultData != null && resultData.status == 1 && resultData.data != null) {

                ModuleListBind({ Selector: divModuleListJQ, DataSource: resultData.data, ModuleSelector: divModuleJQ, TopHeight: divLogoJQ.height(), BottomHeight: divFootJQ.height(), API: API });
            };
        }
    }));
};

function ModuleListBind(Properties) {
    if (typeof (Properties) == "undefined") {
        Properties = {};
    };
    var Settings = {
        Selector: null
        , DataSource: []                                    //各个Item的属性
        , TopHeight: 80
        , BottomHeight: 60
        , ModuleSelector: null
        , API: null
    };
    $.extend(Settings, Properties);

    $(Settings.Selector).each(function () {
    //    var IsFirstIn = 1;
        var ModuleListJQ = $(this);
        var ControlData = ModuleListJQ.data("ControlData");

        //判断Scroll有没缓存数据，有表示已经加载控件，无表示控件第一次加载
        if (!fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
            ControlData = {
                IsTouch: jQueryExtension.IsTouch()
                , IsTouchModel: (fw.fwObject.FWObjectHelper.hasValue(fw.fwCookie.FWCookieHelper("IsTouchModel"))&&(fw.fwCookie.FWCookieHelper("IsTouchModel").toLowerCase() == "true" || fw.fwCookie.FWCookieHelper("IsTouchModel").toLowerCase() == "1"))
                , ControlJQs: {}
            };
            if (ControlData.IsTouch) {
                ControlData.IsTouchModel = true;
            };
            ModuleListJQ.addClass("divModuleList").data("ControlData", ControlData).empty();
            if (ModuleListJQ.css("position").toLowerCase() != "absolute") {
                ModuleListJQ.css("position", "relative");
            };

            var Html = "";
            Html += "<div class=\"jQE_Container_Absolute\">";
            Html += "    <div class=\"jQE_Container_Background\"></div>";
            Html += "    <div class=\"jQE_Container_Compatible\"></div>";
            Html += "    <div class=\"jQE_Container_Content\">";
            Html += "    </div>";
            Html += "</div>";
            $(Html).appendTo(ModuleListJQ);

            //ControlData.IsTouch = true;
            ControlData.ControlJQs.ModuleListJQ = ModuleListJQ;
            ControlData.ControlJQs.SelectorJQ = ModuleListJQ;
            ControlData.ControlJQs.AbsoluteJQ = $(">div.jQE_Container_Absolute", ControlData.ControlJQs.SelectorJQ);
            ControlData.ControlJQs.ContentJQ = $(">div.jQE_Container_Content", ControlData.ControlJQs.AbsoluteJQ);
            ControlData.ControlJQs.ModuleJQ = $(Settings.ModuleSelector);

            ModuleBind({ Selector: ControlData.ControlJQs.ModuleJQ, API: Settings.API });
            ControlData.ControlJQs.ContentJQ.TouchScroll_Init();

            ControlData.ControlJQs.ModuleListJQ.bind("jQueryExtension_Event_Resize", function () {
                var Width = ControlData.ControlJQs.ModuleListJQ.width();
                var Height = ControlData.ControlJQs.ModuleListJQ.height();
                ControlData.ControlJQs.ContentJQ.css({ "top": Settings.TopHeight + "px" }).height(Height - Settings.TopHeight - Settings.BottomHeight).triggerHandler("jQueryExtension_Event_Resize");
            });

            jQueryExtension.UI.Layout({
                Selector: ControlData.ControlJQs.ModuleListJQ
                , HorizontalAlignment: jQueryExtension.Data.HorizontalAlignment.Stretch
                , VerticalAlignment: jQueryExtension.Data.VerticalAlignment.Stretch
                , Top: 0
                , Right: 0
                , Bottom: 0
                , Left: 0
                , Width: -1
                , MinWidth: -1
                , Height: -1
                , MinHeight: -1
                , IsEventResize: true
                , CallBack: function () { }
                , IsForeverLayout: true
            });
        };
        ControlData.Settings = Settings;

        if (ControlData.Settings.DataSource == undefined || ControlData.Settings.DataSource == null) {
            ControlData.Settings.DataSource = [];
        };
        ControlData.ControlJQs.ContentJQ.TouchScroll({
            DataSourceFunction: function (ModuleListTouchScrollControlData) {
                ModuleListTouchScrollControlData.ControlJQs.ContentJQ.empty();
                var ulModuleListJQ = $("<ul class=\"ulModuleList\"></ul>").appendTo(ModuleListTouchScrollControlData.ControlJQs.ContentJQ);
                for (var i = 0; i < ControlData.Settings.DataSource.length; i++) {
                    var Entity = ControlData.Settings.DataSource[i];
                    Entity.OnFocusIn = jExtension.ToFunction(Entity.mOnFocusInScriptCode);
                    Entity.OnFocusOut = jExtension.ToFunction(Entity.mOnFocusOutScriptCode);
                    var InfoNumberHtml = "";
                    if (fw.fwObject.FWObjectHelper.hasValue(Entity.InfoNumber)) {
                        InfoNumberHtml = "<div class=\"ModuleInfoNumber\">" + Entity.InfoNumber + "</div>";
                    };
                    $("<li mTitle=\"" + Entity.mTitle + "\"><div class=\"ModuleImage\"><img alt=\"" + Entity.mTitle + "\" src=\"" + API.GetAbsoluteUrl(Entity.mIconUrl, ControlData.Settings.API.webSiteRootUrl) + "\"  /></div><div class=\"ModuleName\">" + Entity.mTitle + "</div>" + InfoNumberHtml + "</li>").data("Entity", Entity).data("ParentEntity", null).appendTo(ulModuleListJQ);
                };
                var liModuleJQ = $("li", ulModuleListJQ);
                liModuleJQ.bind("click", function (e) {
                    if (!fw.fwObject.FWObjectHelper.hasValue(ModuleListTouchScrollControlData) || ModuleListTouchScrollControlData.IsScroll) {
                        return false;
                    };
                    var thisJQ = $(this);
                    var ParentEntity = thisJQ.data("Entity");
                    var IsChangeMenu = !(ControlData.ControlJQs.ModuleJQ.data("Entity") == ParentEntity);
                    if (IsChangeMenu) {
                        //子级菜单离开触发器
                        var ModuleControlData = ControlData.ControlJQs.ModuleJQ.data("ControlData");
                        if (fw.fwObject.FWObjectHelper.hasValue(ModuleControlData)) {
                            $(">ul>li.Selected", ModuleControlData.ControlJQs.ModuleMenuListContentJQ).each(function () {
                                var Entity = $(this).data("Entity");
                                if ($.isFunction(Entity.OnFocusOut)) {
                                    Entity.OnFocusOut({ currentTarget: this });
                                };
                            });
                        };
                        //菜单离开触发器
                        $(">li.Selected", ulModuleListJQ).each(function () {
                            var Entity = $(this).data("Entity");
                            if ($.isFunction(Entity.OnFocusOut)) {
                                Entity.OnFocusOut({ currentTarget: this });
                            };
                        });
                        liModuleJQ.removeClass("Selected");
                        thisJQ.addClass("Selected");
                        //菜单进入触发器
                        if ($.isFunction(ParentEntity.OnFocusIn)) {
                            ParentEntity.OnFocusIn(e);
                        } else if (fw.fwObject.FWObjectHelper.hasValue(ParentEntity.mUrl)) {
                            var Data = jExtension.JsonStringToJson(ParentEntity.mUrlParamsJson, {});
                            Data.Ticket = $.page.ticket;
                            API.Open({
                                mTitle: ParentEntity.mTitle
                                , mUrl: API.GetAbsoluteUrl(ParentEntity.mUrl, API.webSiteRootUrl)
                                , Data: Data
                            });
                        };

                        ControlData.ControlJQs.ModuleJQ.data("Entity", ParentEntity);
                        ModuleControlData.ControlJQs.ModuleNameJQ.html(ParentEntity.mTitle);
                        ModuleControlData.ControlJQs.ModuleImageJQ.attr("src", API.GetAbsoluteUrl(ParentEntity.mIconUrl, ControlData.Settings.API.webSiteRootUrl)).attr("alt", ParentEntity.mTitle);
                        if (ParentEntity.mFWMenuList == undefined || ParentEntity.mFWMenuList == null) {
                            ParentEntity.mFWMenuList = [];
                        };
                        //ModuleControlData.ControlJQs.ModuleMenuListJQ.data("Entity", ParentEntity).TouchScroll_Loading().TouchScroll({
                        ModuleControlData.ControlJQs.ModuleMenuListJQ.data("Entity", ParentEntity).TouchScroll({
                            DataSourceFunction: function (ModuleMenuListTouchScrollControlData) {
                                ModuleMenuListTouchScrollControlData.ControlJQs.ContentJQ.empty();
                                var ulModuleMenuListJQ = $("<ul class=\"ulModuleMenuList\"></ul>").appendTo(ModuleMenuListTouchScrollControlData.ControlJQs.ContentJQ);
                                for (var i = 0; i < ParentEntity.mFWMenuList.length; i++) {
                                    var Entity = ParentEntity.mFWMenuList[i];
                                    Entity.OnFocusIn = jExtension.ToFunction(Entity.mOnFocusInScriptCode);
                                    Entity.OnFocusOut = jExtension.ToFunction(Entity.mOnFocusOutScriptCode);
                                    var liJQ = $("<li mTitle=\"" + Entity.mTitle + "\"><div><img alt=\"" + Entity.mTitle + "\" src=\"" + API.GetAbsoluteUrl(Entity.mIconUrl, ControlData.Settings.API.webSiteRootUrl) + "\" onerror=\"this.src='" + API.GetAbsoluteUrl("resources/scripts/fw.map/themes/" + skin + "/images/imgModuleMenuDefaultImage.png", ControlData.Settings.API.webSiteRootUrl) + "'\" />" + Entity.mTitle + "</div></li>").data("Entity", Entity).data("ParentEntity", ParentEntity).appendTo(ulModuleMenuListJQ);
                                };
                                var liMenuJQ = $("li", ulModuleMenuListJQ);
                                liMenuJQ.bind("click", function (e) {
                                    //如果滑动菜单则不会触发菜单点击事件
                                    if (!fw.fwObject.FWObjectHelper.hasValue(ModuleMenuListTouchScrollControlData) || ModuleMenuListTouchScrollControlData.IsScroll) {
                                        return false;
                                    };
                                    //菜单离开触发器
                                    $(">li.Selected", ulModuleMenuListJQ).each(function () {
                                        var Entity = $(this).data("Entity");
                                        if ($.isFunction(Entity.OnFocusOut)) {
                                            Entity.OnFocusOut({ currentTarget: this });
                                        };
                                    });
                                    var thisJQ = $(this);
                                    liMenuJQ.removeClass("Selected");
                                    thisJQ.addClass("Selected");
                                    var Entity = thisJQ.data("Entity");
                                    //菜单进入触发器
                                    if ($.isFunction(Entity.OnFocusIn)) {
                                        Entity.OnFocusIn(e);
                                    } else if (fw.fwObject.FWObjectHelper.hasValue(Entity.mUrl)) {
                                        var Data = jExtension.JsonStringToJson(Entity.mUrlParamsJson, {});
                                        Data.Ticket = $.page.ticket;
                                        var OpenSettings = {
                                            mTitle: Entity.mTitle
                                            , Url: API.GetAbsoluteUrl(Entity.mUrl, API.webSiteRootUrl)
                                            , Data: Data
                                        };
                                        if (fw.fwObject.FWObjectHelper.hasValue(Entity.mLayoutHorizontalAlignment)) {
                                            OpenSettings.HorizontalAlignment = Entity.mLayoutHorizontalAlignment;
                                        };
                                        if (fw.fwObject.FWObjectHelper.hasValue(Entity.mLayoutLeft)) {
                                            OpenSettings.Left = Entity.mLayoutLeft;
                                        };
                                        if (fw.fwObject.FWObjectHelper.hasValue(Entity.mLayoutRight)) {
                                            OpenSettings.Right = Entity.mLayoutRight;
                                        };
                                        if (fw.fwObject.FWObjectHelper.hasValue(Entity.mLayoutWidth)) {
                                            OpenSettings.Width = Entity.mLayoutWidth;
                                        };
                                        if (fw.fwObject.FWObjectHelper.hasValue(Entity.mLayoutVerticalAlignment)) {
                                            OpenSettings.VerticalAlignment = Entity.mLayoutVerticalAlignment;
                                        };
                                        if (fw.fwObject.FWObjectHelper.hasValue(Entity.mLayoutTop)) {
                                            OpenSettings.Top = Entity.mLayoutTop;
                                        };
                                        if (fw.fwObject.FWObjectHelper.hasValue(Entity.mLayoutBottom)) {
                                            OpenSettings.Bottom = Entity.mLayoutBottom;
                                        };
                                        if (fw.fwObject.FWObjectHelper.hasValue(Entity.mLayoutHeight)) {
                                            OpenSettings.Height = Entity.mLayoutHeight;
                                        };
                                        if (fw.fwObject.FWObjectHelper.hasValue(OpenSettings.Width)) {
                                            if (OpenSettings.Width > jQueryExtension.ScreenWidth()) {
                                                OpenSettings.Width = jQueryExtension.ScreenWidth() - 22;
                                            };
                                        };
                                        if (fw.fwObject.FWObjectHelper.hasValue(OpenSettings.Height)) {
                                            if (OpenSettings.Height > jQueryExtension.ScreenHeight()) {
                                                OpenSettings.Height = jQueryExtension.ScreenHeight() - 22;
                                            };
                                        };
                                        if (Entity.mOpenTypeCode == "10") {
                                            API.Open(OpenSettings);
                                        } else {
                                            jQueryExtension.Window.Open(OpenSettings);
                                        };
                                    };
                                });
//                                if (IsFirstIn == 1) {
//                                    IsFirstIn = 0;
//                                    liMenuJQ.each(function () {
//                                        if ($(this).attr("mTitle") == "设施概况") {
//                                            $(this).click();
//                                        };
//                                    });
//                                };
                            }
                        });
                    };
                    ControlData.Settings.API.ModuleShow();
                    if (ParentEntity.mFWMenuList.length > 0) {
                        ControlData.Settings.API.ModuleSlideDown();
                    } else {
                        ControlData.Settings.API.ModuleSlideUp();
                    };
                    ControlData.Settings.API.ModuleListHide();
                });

//                if (IsFirstIn == 1) {
//                    liModuleJQ.each(function () {
//                        if ($(this).attr("mTitle") == "实时监控") {
//                            $(this).click();
//                            var Entity = $(this).data("Entity");
//                            if (Entity != null && Entity.mFWMenuList != null && Entity.mFWMenuList.length > 0) {
//                                IsFirstIn = 1;
//                            }
//                            else {
//                                IsFirstIn = 0;
//                            };
//                        };
//                    });
//                };
               
            }

        });

    });
    return this;
};

function ModuleBind(Properties) {
    if (typeof (Properties) == "undefined") {
        Properties = {};
    };
    var Settings = {
        Selector: null
        , DataSource: []                                    //各个Item的属性
        , Top: 100
        , Right: 20
        , Width: 180
        , API: null
    };
    $.extend(Settings, Properties);

    $(Settings.Selector).each(function () {
        var ModuleJQ = $(this);
        var ControlData = ModuleJQ.data("ControlData");

        //判断Scroll有没缓存数据，有表示已经加载控件，无表示控件第一次加载
        if (!fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
            ControlData = {
                IsTouch: jQueryExtension.IsTouch()
                , IsTouchModel: (fw.fwObject.FWObjectHelper.hasValue(fw.fwCookie.FWCookieHelper("IsTouchModel"))&&(fw.fwCookie.FWCookieHelper("IsTouchModel").toLowerCase() == "true" || fw.fwCookie.FWCookieHelper("IsTouchModel").toLowerCase() == "1"))
                , ControlJQs: {}
            };
            if (ControlData.IsTouch) {
                ControlData.IsTouchModel = true;
            };
            ModuleJQ.addClass("divModule").data("ControlData", ControlData).empty();
            if (ModuleJQ.css("position").toLowerCase() != "absolute") {
                ModuleJQ.css("position", "relative");
            };

            var Html = "";
            Html += "<div class=\"divModuleTitle\">";
            Html += "    <div class=\"divModuleName\"></div>";
            Html += "    <div class=\"divModuleTitleSlideImage\"></div>";
            Html += "    <div class=\"divModuleImage\"><img alt=\"\" src=\"\"  /></div>";
            Html += "</div>";
            Html += "<div class=\"divModuleMenuList\" style=\"height:300px;\"></div>";
            $(Html).appendTo(ModuleJQ);

            //ControlData.IsTouch = true;
            ControlData.ControlJQs.ModuleJQ = ModuleJQ;
            ControlData.ControlJQs.SelectorJQ = ModuleJQ;
            ControlData.ControlJQs.ModuleTitleJQ = $(">div.divModuleTitle", ControlData.ControlJQs.SelectorJQ);
            ControlData.ControlJQs.ModuleNameJQ = $(">div.divModuleName", ControlData.ControlJQs.ModuleTitleJQ);
            ControlData.ControlJQs.ModuleTitleSlideImageJQ = $(">div.divModuleTitleSlideImage", ControlData.ControlJQs.ModuleTitleJQ);
            ControlData.ControlJQs.ModuleImageContainerJQ = $(">div.divModuleImage", ControlData.ControlJQs.ModuleTitleJQ);
            ControlData.ControlJQs.ModuleImageJQ = $(">img", ControlData.ControlJQs.ModuleImageContainerJQ);
            ControlData.ControlJQs.ModuleMenuListJQ = $(">div.divModuleMenuList", ControlData.ControlJQs.SelectorJQ);

            var MarginTop = ControlData.ControlJQs.ModuleImageContainerJQ.height() / 2;
            var Height = ControlData.ControlJQs.ModuleNameJQ.height() + MarginTop;
            jQueryExtension.UI.Layout({
                Selector: ControlData.ControlJQs.ModuleJQ
                , HorizontalAlignment: jQueryExtension.Data.HorizontalAlignment.Right
                , VerticalAlignment: jQueryExtension.Data.VerticalAlignment.Top
                , Top: Settings.Top - MarginTop
                , Right: Settings.Right
                , Bottom: 0
                , Left: 0
                , Width: Settings.Width
                , MinWidth: -1
                , Height: Height
                , MinHeight: -1
                , IsEventResize: true
                , CallBack: function () { }
                , IsForeverLayout: true
            });
            ControlData.ControlJQs.ModuleTitleJQ.height(Height);
            ControlData.ControlJQs.ModuleNameJQ.css("margin-top", MarginTop + "px");
            ControlData.ControlJQs.ModuleImageContainerJQ.css({ "margin-top": (0 - Height) + "px", "margin-right": (MarginTop / 2) + "px" });

            ControlData.ControlJQs.ModuleMenuListJQ.TouchScroll_Init();
            var ModuleMenuListTouchScrollControlData = ControlData.ControlJQs.ModuleMenuListJQ.data("ControlData");
            ControlData.ControlJQs.ModuleMenuListContentJQ = ModuleMenuListTouchScrollControlData.ControlJQs.ContentJQ;

            Settings.API.ModuleSlideDown = function () {
                ControlData.ControlJQs.ModuleMenuListJQ.slideDown(function () {
                    ControlData.ControlJQs.ModuleTitleSlideImageJQ.removeClass("SlideDown");
                });
            };
            Settings.API.ModuleSlideUp = function () {
                ControlData.ControlJQs.ModuleMenuListJQ.slideUp(function () {
                    ControlData.ControlJQs.ModuleTitleSlideImageJQ.addClass("SlideDown");
                });
            };
            Settings.API.ModuleSlideToggle = function () {
                if (ControlData.ControlJQs.ModuleMenuListJQ.is(":hidden")) {
                    Settings.API.ModuleSlideDown();
                } else {
                    Settings.API.ModuleSlideUp();
                };
            };
            ControlData.ControlJQs.ModuleTitleJQ.bind("click", function () {
                Settings.API.ModuleSlideToggle();
            });
            Settings.API.ModuleShow = function () {
                ControlData.ControlJQs.ModuleJQ.show();
            };
            Settings.API.ModuleHide = function () {
                ControlData.ControlJQs.ModuleJQ.hide();
            };
            Settings.API.ModuleToggle = function () {
                if (divModuleListJQ.is(":hidden")) {
                    Settings.API.ModuleShow();
                } else {
                    Settings.API.ModuleHide();
                };
            };
            Settings.API.ModuleHide();
        };
        ControlData.Settings = Settings;
    });
    return this;
};