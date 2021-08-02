$.ImageMap = {
    Point: function () {
        return {
            X: null
            , Y: null
            , ImageUrl: null
            , ImageWidth: 11
            , ImageHeight: 11
            , Text: ""
            , Tip: ""
            , IsShowTip: true
            , Click: null
        };
    }
    , PointToTipSpacing: 4
    , AddPoint: function (Properties) {
        if (!fw.fwObject.FWObjectHelper.hasValue(Properties)) {
            Properties = {}
        };
        var Settings = {
            Selector: null                                                        //Card控件选择器
            , Point: null                                                           //添加Card
            , PointArray: []                                                            //添加多个Card
        };
        $.extend(Settings, Properties);

        if (Settings.Point != null) {
            Settings.PointArray.push(Settings.Point);
        };

        if (Settings.PointArray.length > 0) {
            var SelectorJQ = $(Settings.Selector);
            SelectorJQ.each(function () {
                var ControlData = $(this).data("ControlData");
                for (var i = 0; i < Settings.PointArray.length; i++) {
                    var Point = $.ImageMap.Point();
                    $.extend(Point, Settings.PointArray[i]);
                    Point.IsShowTip = Point.IsShowTip.ToBoolean(false);

                    if (ControlData.Settings.ImageMinLongitude <= Point.X
                     && Point.X <= ControlData.Settings.ImageMaxLongitude
                     && ControlData.Settings.ImageMinLatitude <= Point.Y
                     && Point.Y <= ControlData.Settings.ImageMaxLatitude) {
                        var X = ControlData.Settings.ImageWidth * (Point.X - ControlData.Settings.ImageMinLongitude) / (ControlData.Settings.ImageMaxLongitude - ControlData.Settings.ImageMinLongitude);
                        var Y = ControlData.Settings.ImageHeight * (Point.Y - ControlData.Settings.ImageMinLatitude) / (ControlData.Settings.ImageMaxLatitude - ControlData.Settings.ImageMinLatitude);
                        var PointJQ = $("<div class=\"jQueryExtension_UI_ImageMap_PointArray_Point\"></div>").css({
                            "left": X + "px"
                           , "top": Y + "px"
                        }).appendTo(ControlData.ControlJQs.ImageMap_PointArrayJQ);

                        var Html;
                        var JQ;

                        Html = "";
                        Html += "<div class=\"jQueryExtension_UI_ImageMap_PointArray_Point_Container\">";
                        Html += "   <div class=\"jQueryExtension_UI_ImageMap_PointArray_Point_Container_Image\"></div>";
                        Html += "</div>";

                        var PointImageContainerJQ = $(Html).appendTo(PointJQ);
                        var divPointImageJQ = $("div.jQueryExtension_UI_ImageMap_PointArray_Point_Container_Image", PointImageContainerJQ);
                        if (fw.fwObject.FWObjectHelper.hasValue(Point.ImageUrl)) {
                            var MarginLeft = parseInt(Point.ImageWidth / 2, 10) + (Point.ImageWidth % 2 == 0 ? -1 : 1);
                            var MarginTop = parseInt(Point.ImageHeight / 2, 10) + (Point.ImageHeight % 2 == 0 ? -1 : 1);
                            divPointImageJQ.css({
                                "background-image": "url(" + Point.ImageUrl + ")"
                                , "width": Point.ImageWidth + "px"
                                , "height": Point.ImageHeight + "px"
                                , "margin-left": (0 - MarginLeft) + "px"
                                , "margin-top": (0 - MarginTop) + "px"
                                , "text-indent": (2 * MarginLeft + 2) + "px"
                            });
                        };
                        JQ = ($.isFunction(Point.Text) ? Point.Tip(Point) : Point.Text);
                        if (!(JQ instanceof jQuery)) {
                            JQ = $("<a>" + JQ.toString() + "</a>");
                        };
                        JQ.appendTo(divPointImageJQ);

                        var Html = "";
                        Html += "<div class=\"jQueryExtension_UI_ImageMap_PointArray_Point_Container\">";
                        Html += "   <div class=\"jQueryExtension_UI_ImageMap_PointArray_Point_Container_Tip\">";
                        Html += "      <div>";
                        Html += "          <div class=\"jQueryExtension_UI_ImageMap_PointArray_Point_Container_Tip_Arrow Top\"></div>";
                        Html += "      </div>";
                        Html += "      <table cellspacing=\"0\" cellpadding=\"0\" border=\"0\">";
                        Html += "         <tr>";
                        Html += "             <td class=\"jQueryExtension_UI_ImageMap_PointArray_Point_Container_Tip_Content\"></td>";
                        Html += "         </tr>";
                        Html += "      </table>";
                        Html += "      <div>";
                        Html += "          <div class=\"jQueryExtension_UI_ImageMap_PointArray_Point_Container_Tip_Arrow Bottom\"></div>";
                        Html += "      </div>";
                        Html += "   </div>";
                        Html += "</div>";
                        var PointTipContainerJQ = $(Html).appendTo(PointJQ);
                        var TipJQ = $("div.jQueryExtension_UI_ImageMap_PointArray_Point_Container_Tip", PointTipContainerJQ);
                        var TipContentJQ = $("td.jQueryExtension_UI_ImageMap_PointArray_Point_Container_Tip_Content", TipJQ);
                        JQ = ($.isFunction(Point.Tip) ? Point.Tip(Point) : Point.Tip);
                        if (!(JQ instanceof jQuery)) {
                            JQ = $("<a>" + JQ.toString() + "</a>");
                        };
                        JQ.appendTo(TipContentJQ);
                        var ArrowTopJQ = $("div.jQueryExtension_UI_ImageMap_PointArray_Point_Container_Tip_Arrow.Top", TipJQ);
                        var ArrowBottomJQ = $("div.jQueryExtension_UI_ImageMap_PointArray_Point_Container_Tip_Arrow.Bottom", TipJQ);
                        var tableJQ = $(">table:first", TipJQ);
                        var TipWidth = tableJQ.width();
                        var TipHeight = TipJQ.height();
                        var TipHalfOfWidth = TipWidth / 2;
                        var ArrowWidth = ArrowBottomJQ.width();
                        var ArrowHeight = ArrowBottomJQ.height();
                        var PointImageHeight = divPointImageJQ.height();
                        if (X < TipHalfOfWidth) {
                            var Top = TipHeight - ArrowHeight + PointImageHeight / 2 + $.ImageMap.PointToTipSpacing;
                            if (Top < Y) {
                                ArrowTopJQ.hide();
                                ArrowBottomJQ.addClass("Left").css("left", X + "px");
                                TipJQ.css({
                                    "position": "relative"
                                    , "left": (0 - X) + "px"
                                    , "top": (0 - Top) + "px"
                                });
                            } else {
                                Top = PointImageHeight / 2 + $.ImageMap.PointToTipSpacing - 4;
                                ArrowBottomJQ.hide();
                                ArrowTopJQ.addClass("Left").css("left", X + "px");
                                TipJQ.css({
                                    "position": "relative"
                                    , "left": (0 - X) + "px"
                                    , "top": Top + "px"
                                });
                            };
                        } else if ((ControlData.Settings.ImageWidth - X) < TipHalfOfWidth) {
                            var Top = TipHeight - ArrowHeight + PointImageHeight / 2 + $.ImageMap.PointToTipSpacing;
                            if (Top < Y) {
                                ArrowTopJQ.hide();
                                ArrowBottomJQ.addClass("Right").css("left", (TipWidth - (ControlData.Settings.ImageWidth - X) - ArrowWidth) + "px");
                                TipJQ.css({
                                    "position": "relative"
                                    , "left": (0 - (TipWidth - (ControlData.Settings.ImageWidth - X))) + "px"
                                    , "top": (0 - Top) + "px"
                                });
                            } else {
                                Top = PointImageHeight / 2 + $.ImageMap.PointToTipSpacing - 4;
                                ArrowBottomJQ.hide();
                                ArrowTopJQ.addClass("Right").css("left", (TipWidth - (ControlData.Settings.ImageWidth - X) - ArrowWidth) + "px");
                                TipJQ.css({
                                    "position": "relative"
                                    , "left": (0 - (TipWidth - (ControlData.Settings.ImageWidth - X))) + "px"
                                    , "top": Top + "px"
                                });
                            };
                        } else {
                            var Top = TipHeight - ArrowHeight + PointImageHeight / 2 + $.ImageMap.PointToTipSpacing;
                            if (Top < Y) {
                                ArrowTopJQ.hide();
                                ArrowBottomJQ.css("left", (TipHalfOfWidth - ArrowWidth / 2) + "px");
                                TipJQ.css({
                                    "position": "relative"
                                    , "left": (0 - TipHalfOfWidth) + "px"
                                    , "top": (0 - Top) + "px"
                                });
                            } else {
                                Top = PointImageHeight / 2 + $.ImageMap.PointToTipSpacing - 4;
                                ArrowBottomJQ.hide();
                                ArrowTopJQ.css("left", (TipHalfOfWidth - ArrowWidth / 2) + "px");
                                TipJQ.css({
                                    "position": "relative"
                                    , "left": (0 - TipHalfOfWidth) + "px"
                                    , "top": Top + "px"
                                });
                            };
                        };
                        if (!Point.IsShowTip) {
                            PointTipContainerJQ.hide();
                        };
                        PointJQ.data("Entity", Point).data("TipContainerJQ", PointTipContainerJQ);
                        divPointImageJQ.bind("click", function () {
                            var PointJQ = $(this).parent().parent();
                            var TipContainerJQ = PointJQ.data("TipContainerJQ");
                            var Display = TipContainerJQ.css("display");
                            if (Display == "none") {
                                TipContainerJQ.show();
                            } else {
                                TipContainerJQ.hide();
                            };

                            var Point = PointJQ.data("Entity");
                            if ($.isFunction(Point.Click)) {
                                Point.Click(Point);
                            };
                        });

                    };
                };
            });
        };
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
    ImageMap_Init: function (Properties) {
        if (!fw.fwObject.FWObjectHelper.hasValue(Properties)) {
            Properties = {}
        };
        var Settings = {};
        $.extend(Settings, Properties);

        if (fw.fwObject.FWObjectHelper.hasValue(Settings.ImageUrl)
        && fw.fwObject.FWObjectHelper.hasValue(Settings.ImageWidth)
        && fw.fwObject.FWObjectHelper.hasValue(Settings.ImageHeight)
        && fw.fwObject.FWObjectHelper.hasValue(Settings.ImageMinLongitude)
        && fw.fwObject.FWObjectHelper.hasValue(Settings.ImageMinLatitude)
        && fw.fwObject.FWObjectHelper.hasValue(Settings.ImageMaxLongitude)
        && fw.fwObject.FWObjectHelper.hasValue(Settings.ImageMaxLatitude)) {
            var SelectorJQ = this;
            SelectorJQ.each(function () {
                var ControlData;
                var ImageMapJQ = $(this);
                var WindowGuid = ImageMapJQ.data("WindowGuid");
                if (!fw.fwObject.FWObjectHelper.hasValue(WindowGuid)) {
                    WindowGuid = fw.guid();

                    $("<div id=\"ImageMap_Map__" + WindowGuid + "\" class=\"jQueryExtension_UI_ImageMap_Map\"></div>").appendTo(ImageMapJQ);
                    $("<div id=\"ImageMap_PointArray__" + WindowGuid + "\" class=\"jQueryExtension_UI_ImageMap_PointArray\"></div>").appendTo(ImageMapJQ);

                    ControlData = {
                        ControlJQs: {
                            IsInit: true
                            , ImageMapJQ: ImageMapJQ.data("WindowGuid", WindowGuid).addClass('jQueryExtension_UI_ImageMap').data('SelectedIndex', -1)
                            , ImageMap_MapJQ: $("#ImageMap_Map__" + WindowGuid)
                            , ImageMap_PointArrayJQ: $("#ImageMap_PointArray__" + WindowGuid)
                        }
                        , Settings: Settings
                    };

                    ControlData.ControlJQs.ImageMapJQ.css({
                        "width": parseInt(Settings.ImageWidth, 10) + "px"
                        , "height": parseInt(Settings.ImageHeight, 10) + "px"
                    });
                    ControlData.ControlJQs.ImageMap_MapJQ.css({
                        "width": parseInt(Settings.ImageWidth, 10) + "px"
                        , "height": parseInt(Settings.ImageHeight, 10) + "px"
                        , "background-image": "url(" + Settings.ImageUrl + ")"
                    });
                    $("<img alt=\"\" src=\"" + Settings.ImageUrl + "\" style=\"width: 100%; height: 100%;\" />").appendTo(ControlData.ControlJQs.ImageMap_MapJQ);
                    ControlData.ControlJQs.ImageMap_PointArrayJQ.css({
                        "margin-top": (0 - parseInt(Settings.ImageHeight, 10)) + "px"
                        , "height": parseInt(Settings.ImageHeight, 10) + "px"
                    });

                    ImageMapJQ.data("ControlData", ControlData);
                } else {
                    ControlJQs = ImageMapJQ.data("ControlData");
                    ControlJQs.IsInit = false;
                };
            });
        }
    }
    , ImageMap: function (properties) {
        if (typeof (properties) == "undefined") {
            properties = {};
        };
        var Settings = {
            IsFlash: jQueryExtension.IsFlash()
            , Speed: jQueryExtension.Data.Settings.Speed
            , Frequency: jQueryExtension.Data.Settings.Frequency
            , ImageUrl: null
            , ImageWidth: null
            , ImageHeight: null
            , ImageMinLongitude: null
            , ImageMinLatitude: null
            , ImageMaxLongitude: null
            , ImageMaxLatitude: null
            , PointArray: []
        };
        $.extend(Settings, properties);

        if (this.length > 0) {

            if (!Settings.IsFlash) {
                Settings.Speed = 0;
            };

            this.ImageMap_Init(Settings);
            this.each(function () {
                var ControlData = $(this).data("ControlData");

                if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                    $.ImageMap.AddPoint({
                        Selector: ControlData.ControlJQs.ImageMapJQ
                        , PointArray: ControlData.Settings.PointArray
                    });
                };
            });
        };

        if ($.isFunction(Settings.CallBack)) { Settings.CallBack({}); };

    }
});