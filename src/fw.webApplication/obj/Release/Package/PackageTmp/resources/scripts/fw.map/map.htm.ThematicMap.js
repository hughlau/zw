function ThematicMapInit(Properties) {
    if (typeof (Properties) == "undefined") {
        Properties = {};
    };
    var Settings = {
        Selector: null
        , Top: 100
        , Right: 420
        , Width: 256
        , API: null
    };
    $.extend(Settings, Properties);

    var ThematicMapJQ = Settings.API._divThematicMapJQ;
    if (!fw.fwObject.FWObjectHelper.hasValue(ThematicMapJQ)) {
        ThematicMapJQ = $("<div id=\"divThematicMap\" class=\"divThematicMap\"></div").appendTo("body");
        Settings.API._divThematicMapJQ = ThematicMapJQ;
    };
    var ControlData = ThematicMapJQ.data("ControlData");

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
        ThematicMapJQ.addClass("divThematicMap").data("ControlData", ControlData).empty();
        if (ThematicMapJQ.css("position").toLowerCase() != "absolute") {
            ThematicMapJQ.css("position", "relative");
        };

        var Html = "";
        Html += "<div class=\"divThematicMapTitle\">";
        Html += "</div>";
        Html += "<div class=\"divThematicMapFunction\">";
        Html += "    <ul class=\"ulThematicMapFunction\">";
        Html += "        <li class=\"liThematicMapData\">数据</li>";
        Html += "        <li class=\"liThematicMap3D\">三维专题图</li>";
        Html += "    </ul>";
        Html += "</div>";
        $(Html).appendTo(ThematicMapJQ);

        //ControlData.IsTouch = true;
        ControlData.ControlJQs.ThematicMapJQ = ThematicMapJQ;
        ControlData.ControlJQs.SelectorJQ = ThematicMapJQ;
        ControlData.ControlJQs.ThematicMapTitleJQ = $(">div.divThematicMapTitle", ControlData.ControlJQs.SelectorJQ);
        ControlData.ControlJQs.ThematicMapFunctionJQ = $(">div.divThematicMapFunction>ul.ulThematicMapFunction", ControlData.ControlJQs.SelectorJQ);
        ControlData.ControlJQs.ThematicMap3DJQ = $(">li.liThematicMap3D", ControlData.ControlJQs.ThematicMapFunctionJQ);
        ControlData.ControlJQs.ThematicMapDataJQ = $(">li.liThematicMapData", ControlData.ControlJQs.ThematicMapFunctionJQ);

        jQueryExtension.UI.Layout({
            Selector: ControlData.ControlJQs.ThematicMapJQ
                , HorizontalAlignment: jQueryExtension.Data.HorizontalAlignment.Right
                , VerticalAlignment: jQueryExtension.Data.VerticalAlignment.Top
                , Top: Settings.Top
                , Right: Settings.Right
                , Bottom: 0
                , Left: 0
                , Width: Settings.Width
                , MinWidth: -1
                , Height: ControlData.ControlJQs.ThematicMapJQ.height()
                , MinHeight: -1
                , IsEventResize: true
                , CallBack: function () { }
                , IsForeverLayout: true
        });

        Settings.API.ThematicMapShow = function () {
            ControlData.ControlJQs.ThematicMapJQ.show();
        };
        Settings.API.ThematicMapHide = function () {
            ControlData.ControlJQs.ThematicMapJQ.hide();
        };
        Settings.API.ThematicMapToggle = function () {
            if (divThematicMapListJQ.is(":hidden")) {
                Settings.API.ThematicMapShow();
            } else {
                Settings.API.ThematicMapHide();
            };
        };

        /// <summary>
        ///     搜索和关注取消绑定（关闭）
        /// </summary>
        Settings.API.ThematicMapUnbind = function () {
            var ControlData = API._divThematicMapJQ.data("ControlData");
            if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                ControlData.ControlJQs.ThematicMap3DJQ.unbind("click");
                ControlData.ControlJQs.ThematicMapDataJQ.unbind("click");
                API.ThematicMapHide();
            };
        };
        /// <summary>
        ///     搜索和关注取消绑定（打开）
        /// </summary>
        Settings.API.ThematicMapBind = function (Properties) {
            var Settings = {
                ThematicMapTitle: ""
                , ThematicMap3DButtonOnClick: null
                , ThematicMapDataButtonOnClick: null
            };
            $.extend(Settings, Properties);

            var ControlData = API._divThematicMapJQ.data("ControlData");
            if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                API.ThematicMapUnbind();

                if (fw.fwObject.FWObjectHelper.hasValue(Settings.ThematicMapTitle)) {
                    ControlData.ControlJQs.ThematicMapTitleJQ.html(Settings.ThematicMapTitle).show();
                } else {
                    ControlData.ControlJQs.ThematicMapTitleJQ.hide();
                };

                if ($.isFunction(Settings.ThematicMap3DButtonOnClick)) {
                    ControlData.ControlJQs.ThematicMap3DJQ.unbind("click").bind("click", function (e) {
                        Settings.ThematicMap3DButtonOnClick(e);
                    });
                    ControlData.ControlJQs.ThematicMap3DJQ.show();
                } else {
                    ControlData.ControlJQs.ThematicMap3DJQ.hide();
                };

                if ($.isFunction(Settings.ThematicMapDataButtonOnClick)) {
                    ControlData.ControlJQs.ThematicMapDataJQ.unbind("click").bind("click", function (e) {
                        Settings.ThematicMapDataButtonOnClick(e);
                    });
                    ControlData.ControlJQs.ThematicMapDataJQ.show();
                } else {
                    ControlData.ControlJQs.ThematicMapDataJQ.hide();
                };

                API.ThematicMapShow();
            };
        };

    };
    ControlData.Settings = Settings;

    ControlData.Settings.API.ThematicMapHide();
};