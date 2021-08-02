function MouseFollowInit(Properties) {
    if (typeof (Properties) == "undefined") {
        Properties = {};
    };
    var Settings = {
        Selector: null
        , Top: 100
        , Right: 210
        , Width: 180
        , API: null
    };
    $.extend(Settings, Properties);

    $(Settings.Selector).each(function () {
        var MouseFollowJQ = $(this);
        var ControlData = MouseFollowJQ.data("ControlData");

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
            MouseFollowJQ.addClass("divMouseFollow").data("ControlData", ControlData).empty();
            if (MouseFollowJQ.css("position").toLowerCase() != "absolute") {
                MouseFollowJQ.css("position", "relative");
            };

            var Html = "";
            Html += "<div class=\"divMouseFollowContent\" style=\"height:300px;\"></div>";
            $(Html).appendTo(MouseFollowJQ);

            ControlData.ControlJQs.MouseFollowJQ = MouseFollowJQ;
            ControlData.ControlJQs.SelectorJQ = MouseFollowJQ;
            ControlData.ControlJQs.MouseFollowContentJQ = $(">div.divMouseFollowContent", ControlData.ControlJQs.SelectorJQ);

            jQueryExtension.UI.Layout({
                Selector: ControlData.ControlJQs.MouseFollowJQ
                , HorizontalAlignment: jQueryExtension.Data.HorizontalAlignment.Right
                , VerticalAlignment: jQueryExtension.Data.VerticalAlignment.Top
                , Top: Settings.Top
                , Right: Settings.Right
                , Bottom: 0
                , Left: 0
                , Width: Settings.Width
                , MinWidth: -1
                , Height: 0
                , MinHeight: -1
                , IsEventResize: true
                , CallBack: function () { }
                , IsForeverLayout: true
            });


            ControlData.ControlJQs.MouseFollowContentJQ.TouchScroll_Init();
            var MouseFollowContentTouchScrollControlData = ControlData.ControlJQs.MouseFollowContentJQ.data("ControlData");
            ControlData.ControlJQs.MouseFollowContentContentJQ = MouseFollowContentTouchScrollControlData.ControlJQs.ContentJQ;


            Settings.API.MouseFollowShow = function () {
                ControlData.ControlJQs.MouseFollowJQ.show();
            };
            Settings.API.MouseFollowHide = function () {
                ControlData.ControlJQs.MouseFollowJQ.hide();
            };
            Settings.API.MouseFollowToggle = function () {
                if (ControlData.ControlJQs.MouseFollowJQ.is(":hidden")) {
                    Settings.API.MouseFollowShow();
                } else {
                    Settings.API.MouseFollowHide();
                };
            };


            /// <summary>
            ///  绑定右击弹出菜单
            /// </summary>
            Settings.API.MouseFollowContentBind = function (Properties) {
                var Settings = {
                    EventX: 0
                    , EventY: 0
                    , TextFieldName: "Text"
                    , IconUrlFieldName: "IconUrl"
                    , DataSource: []
                    , TemplateFunction: function (Entity, Index) { return Entity[this.TextFieldName]; }
                    , RowOnClick: function (Entity) { }
                };
                $.extend(Settings, Properties);
                var ControlData = API._divMouseFollowJQ.data("ControlData");
                if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                    ControlData.ControlJQs.MouseFollowJQ.css({ top: Settings.EventY, left: Settings.EventX });

                    ControlData.ControlJQs.MouseFollowContentJQ.TouchScroll({
                        DataSourceFunction: function (MouseFollowContentTouchScrollControlData) {
                            MouseFollowContentTouchScrollControlData.ControlJQs.ContentJQ.empty();
                            var ulMouseFollowContentJQ = $("<ul class=\"ulMouseFollowContent\"></ul>").appendTo(MouseFollowContentTouchScrollControlData.ControlJQs.ContentJQ);
                            for (var i = 0; i < Settings.DataSource.length; i++) {
                                var Entity = Settings.DataSource[i];
                                var Text = Settings.TemplateFunction(Entity, i);
                                var IconUrl = Entity[Settings.IconUrlFieldName];
                                var liJQ = $("<li><div><img alt=\"" + Text + "\" src=\"" + IconUrl + "\" onerror=\"this.src='" + API.webSiteRootUrl + "resources/scripts/fw.map/themes/" + skin + "/images/imgModuleMenuDefaultImage.png'\" />" + Text + "</div></li>").data("Entity", Entity).appendTo(ulMouseFollowContentJQ).bind("click", function () {
                                    var thisJQ = $(this);
                                    Settings.RowOnClick(thisJQ.data("Entity"));
                                });
                            };
                        }
                    });
                    API.MouseFollowShow();
                };

            };

        };
        ControlData.Settings = Settings;

        // ControlData.Settings.API.MouseFollowContentHide();
        ControlData.Settings.API.MouseFollowHide();
    });
    return this;
};