$.fn.extend({
    ExtentControl: function (Properties) {
        var Settings = {
            ArcGISWindow: null
            , ArcGISMap: null
            , FullExtent: null
            , ScaleDescriptionDictionary: { "1": "Global", "4": "Country", "7": "Province", "10": "City", "15": "Street" }
            , ScaleInfoDictionary: { "1": "1:1", "2": "1:2", "3": "1:3", "4": "1:4", "5": "1:5", "6": "1:6", "7": "1:7", "8": "1:8", "9": "1:9", "10": "1:10", "11": "1:11", "12": "1:12", "13": "1:13", "14": "1:14", "15": "1:15", "16": "1:16", "17": "1:17" }
        };
        $.extend(Settings, Properties);

        var SelectorJQ = $(this); //divArcGISExtentControl
        if (fw.fwObject.FWObjectHelper.hasValue(Settings.ArcGISWindow) && fw.fwObject.FWObjectHelper.hasValue(Settings.ArcGISMap)) {
            var LayerChangedFunction = function () {
                SelectorJQ.each(function () {
                    //滑动过程中使用的全局对象
                    var eSlide = {
                        IsMouseDown: false             //鼠标是否按下
                        , MarginTop: 0                 //滑动DIV 的MarginTop值
                        , MarginLeft: 0                //滑动DIV MarginLeft
                        , LevelHeight: 0               //等级滑动区域高度
                        , CurrentLevelHeigh: 0         //滑动DIV 的高度
                        , ZoomInHeight: 0              //放大DIV 的高度
                        , MinMarginTop: 0              //滑动DIV 的MarginTop最小值
                        , MaxMarginTop: 0              //滑动DIV 的MarginTop最大值
                    };

                    var LevelToTop = function (Level, ElementHeight) {
                        var Top = eSlide.ZoomInHeight + (eSlide.MaxLevel - Level) * eSlide.CurrentLevelHeight;
                        if (ElementHeight != undefined) {
                            Top -= (ElementHeight - eSlide.CurrentLevelHeight) / 2;
                        };
                        return Top;
                    };

                    var ExtentControlJQ = $(this); //divArcGISExtentControl
                    var ControlData = ExtentControlJQ.data("ControlData");
                    //判断ExtentControl有没缓存数据，有表示已经加载控件，无表示控件第一次加载
                    if (!fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                        ControlData = {
                            IsTouch: jQueryExtension.IsTouch()
                            , IsTouchModel: (fw.fwObject.FWObjectHelper.hasValue(fw.fwCookie.FWCookieHelper("IsTouchModel")) && (fw.fwCookie.FWCookieHelper("IsTouchModel").toLowerCase() == "true" || fw.fwCookie.FWCookieHelper("IsTouchModel").toLowerCase() == "1"))
                            , ScrollLeft: 0
                            , ScrollTop: 0
                            , ControlJQs: {
                                IsInit: true
                            }
                            , IsResize: false
                            , MapCurrentLevel: -1
                        };
                        if (ControlData.IsTouch) {
                            ControlData.IsTouchModel = true;
                        };
                        ExtentControlJQ.empty().data("ControlData", ControlData);
                        if (ExtentControlJQ.css("position").toLowerCase() != "absolute") {
                            ExtentControlJQ.css("position", "relative");
                        };
                        var Html = "";
                        Html += "<div class=\"jQE_Container_Absolute\">";
                        Html += "    <div class=\"divMove\">";
                        Html += "        <div class=\"divFullExtent\"></div>";
                        Html += "        <div class=\"divPanLeft\"></div>";
                        Html += "        <div class=\"divPanRight\"></div>";
                        Html += "        <div class=\"divPanUp\"></div>";
                        Html += "        <div class=\"divPanDown\"></div>";
                        Html += "    </div>";
                        Html += "    <div class=\"divScaleDescription\"></div>";
                        Html += "    <div class=\"divScaleInfo\">";
                        Html += "        <div class=\"divScaleInfoContent\"></div>";
                        Html += "    </div>";
                        Html += "    <div class=\"divZoom\">";
                        Html += "        <div class=\"divZoomIn\"></div>";
                        Html += "        <div class=\"divLevelSelect\">";
                        Html += "            <div class=\"divLevel\"></div>";
                        Html += "            <div class=\"divCurrentLevel\"></div>";
                        Html += "        </div>";
                        Html += "        <div class=\"divZoomOut\"></div>";
                        Html += "    </div>";
                        Html += "</div>";
                        $(Html).appendTo(ExtentControlJQ);

                        ControlData.ControlJQs.ExtentControlJQ = ExtentControlJQ.addClass('divArcGISExtentControl');
                        ControlData.ControlJQs.FullExtentJQ = $("div.divFullExtent", ControlData.ControlJQs.ExtentControlJQ);
                        ControlData.ControlJQs.PanLeftJQ = $("div.divPanLeft", ControlData.ControlJQs.ExtentControlJQ);
                        ControlData.ControlJQs.PanRightJQ = $("div.divPanRight", ControlData.ControlJQs.ExtentControlJQ);
                        ControlData.ControlJQs.PanUpJQ = $("div.divPanUp", ControlData.ControlJQs.ExtentControlJQ);
                        ControlData.ControlJQs.PanDownJQ = $("div.divPanDown", ControlData.ControlJQs.ExtentControlJQ);

                        ControlData.ControlJQs.ScaleDescriptionJQ = $("div.divScaleDescription", ControlData.ControlJQs.ExtentControlJQ);

                        ControlData.ControlJQs.ScaleInfoJQ = $("div.divScaleInfo", ControlData.ControlJQs.ExtentControlJQ);
                        ControlData.ControlJQs.ScaleInfoContentJQ = $("div.divScaleInfoContent", ControlData.ControlJQs.ScaleInfoJQ);
                        ControlData.ControlJQs.ZoomJQ = $("div.divZoom", ControlData.ControlJQs.ExtentControlJQ);
                        ControlData.ControlJQs.ZoomInJQ = $("div.divZoomIn", ControlData.ControlJQs.ZoomJQ);
                        ControlData.ControlJQs.ZoomOutJQ = $("div.divZoomOut", ControlData.ControlJQs.ZoomJQ);

                        ControlData.ControlJQs.LevelSelectJQ = $("div.divLevelSelect", ControlData.ControlJQs.ExtentControlJQ);
                        ControlData.ControlJQs.LevelJQ = $("div.divLevel", ControlData.ControlJQs.LevelSelectJQ);
                        ControlData.ControlJQs.CurrentLevelJQ = $("div.divCurrentLevel", ControlData.ControlJQs.LevelSelectJQ);
                        ControlData.ControlJQs.CurrentLevelJS = ControlData.ControlJQs.CurrentLevelJQ[0];



                        var LevelToMarginTop = function (Level) {
                            return 0 - (Level + 1) * eSlide.CurrentLevelHeight;
                        };

                        var MarginTopToLevel = function (MarginTop) {
                            return (0 - MarginTop) / eSlide.CurrentLevelHeight - 1;
                        };

                        if (fw.fwObject.FWObjectHelper.hasValue(Settings.ArcGISMap)) {
                            Settings.ArcGISWindow.dojo.connect(Settings.ArcGISMap, "onExtentChange", function (extent) {

                                if (ControlData.MapCurrentLevel != Settings.ArcGISMap.getLevel()) {
                                    SetLevel(Settings.ArcGISMap.getLevel(), true);
                                };
                            });
                        };

                        var SetLevel = function (Level, isSetLevel) {
                            ControlData.ControlJQs.CurrentLevelJQ.css("margin-top", LevelToMarginTop(Level) + "px").data("Level", Level);
                            try {
                                if (!isSetLevel) {
                                    Settings.ArcGISMap.setLevel(Level);
                                };
                            } catch (ex) { };
                            ControlData.MapCurrentLevel = Level;
                        };

                        var GetScaleInfoContent = function (Level) {
                            var ScaleInfoContent = Settings.ScaleInfoDictionary[Level];
                            if (ScaleInfoContent == undefined) {
                                ScaleInfoContent = "";
                            };
                            return ScaleInfoContent;
                        };

                        //调整当前地图等级
                        var AdjustCurrentLevel = function (IsChangeLevel) {
                            var MarginTop = Math.abs(parseInt(ControlData.ControlJQs.CurrentLevelJQ.css("margin-top")));
                            var Remainder = MarginTop % eSlide.CurrentLevelHeight;
                            if (Remainder > 0 && Remainder > eSlide.CurrentLevelHeight / 2) {
                                Remainder = eSlide.CurrentLevelHeight - Remainder;
                            } else {
                                Remainder = 0 - Remainder;
                            };
                            MarginTop += Remainder;
                            MarginTop = 0 - MarginTop;
                            var Level = MarginTopToLevel(MarginTop);
                            ControlData.ControlJQs.CurrentLevelJQ.css("margin-top", MarginTop + "px").data("Level", Level);
                            ControlData.ControlJQs.ScaleInfoContentJQ.css("top", LevelToTop(Level, ControlData.ControlJQs.ScaleInfoContentJQ.height()) + "px");
                            ControlData.ControlJQs.ScaleInfoContentJQ.html(GetScaleInfoContent(Level));
                            if (IsChangeLevel) {
                                SetLevel(Level);
                            };
                        };

                        ControlData.ControlJQs.PanLeftJQ.bind("click", function () {
                            if (Settings.ArcGISMap.isPan)
                                Settings.ArcGISMap.panLeft();
                        });
                        ControlData.ControlJQs.PanRightJQ.bind("click", function () {
                            if (Settings.ArcGISMap.isPan)
                                Settings.ArcGISMap.panRight();
                        });
                        ControlData.ControlJQs.PanUpJQ.bind("click", function () {
                            if (Settings.ArcGISMap.isPan)
                                Settings.ArcGISMap.panUp();
                        });
                        ControlData.ControlJQs.PanDownJQ.bind("click", function () {
                            if (Settings.ArcGISMap.isPan)
                                Settings.ArcGISMap.panDown();
                        });
                        ControlData.ControlJQs.FullExtentJQ.bind("click", function () {
                            if (fw.fwObject.FWObjectHelper.hasValue(Settings.FullExtent) && !fw.fwObject.FWObjectHelper.hasValue(homeCantonCode)) {
                                Settings.ArcGISMap.setExtent(Settings.FullExtent);
                            } else if (fw.fwObject.FWObjectHelper.hasValue(newFullExtent)) {
                                Settings.ArcGISMap.setExtent(newFullExtent);
                            };
                        });
                        ControlData.ControlJQs.ZoomInJQ.bind("click", function () {
                            var iLeve = Settings.ArcGISMap.getLevel();
                            if (iLeve < Settings.ArcGISMap.__tileInfo.lods.length - 1) {
                                SetLevel(iLeve + 1);
                            };
                        });
                        ControlData.ControlJQs.ZoomOutJQ.bind("click", function () {
                            var iLeve = Settings.ArcGISMap.getLevel();
                            if (iLeve > 0) {
                                SetLevel(iLeve - 1);
                            };
                        });
                        ControlData.ControlJQs.ZoomJQ.hover(
                          function () {
                              ControlData.ControlJQs.ScaleDescriptionJQ.show();
                              ControlData.ControlJQs.ScaleInfoJQ.show();
                          },
                          function () {
                              ControlData.ControlJQs.ScaleDescriptionJQ.hide();
                              ControlData.ControlJQs.ScaleInfoJQ.hide();
                          }
                        ).bind("click", function (e) {
                            var targetJQ = $(e.target);
                            var Level = parseInt(targetJQ.data("Level"));
                            if (!isNaN(Level)) {
                                SetLevel(Level);
                            };
                        });
                        var divZoomMouseMoveFunction = function (e) {
                            var targetJQ = $(e.target);
                            var Level = parseInt(targetJQ.data("Level"));
                            if (!isNaN(Level)) {
                                ControlData.ControlJQs.ScaleInfoContentJQ.css("top", LevelToTop(Level, ControlData.ControlJQs.ScaleInfoContentJQ.height()) + "px");
                                ControlData.ControlJQs.ScaleInfoContentJQ.html(GetScaleInfoContent(Level));
                            };
                        };
                        if (ControlData.IsTouch) {
                            ControlData.ControlJQs.ZoomJQ.bind("touchmove", divZoomMouseMoveFunction);
                        } else {
                            ControlData.ControlJQs.ZoomJQ.bind("mousemove", divZoomMouseMoveFunction);
                        };

                        var eStart, eLastMove, eEnd;
                        var mousedownFunction = function (e) {
                            //开启Capture监控
                            if (window.captureEvents) {
                                window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                            } else if (ControlData.ControlJQs.CurrentLevelJS.setCapture) {
                                ControlData.ControlJQs.CurrentLevelJS.setCapture();
                            };

                            ControlData.IsMouseDown = eSlide.IsMouseDown;
                            eSlide.IsMouseDown = true;
                            eSlide.MarginTop = parseInt(ControlData.ControlJQs.CurrentLevelJQ.css("margin-top")); if (isNaN(eSlide.MarginTop)) { eSlide.MarginTop = 0; };

                            eStart = {
                                ClientX: null
                                , ClientY: null
                                , Time: null
                            };
                            eLastMove = {
                                ClientX: null
                                , ClientY: null
                                , Time: null
                            };
                            eEnd = {
                                ClientX: null
                                , ClientY: null
                                , Time: null
                            };

                            if (ControlData.IsTouch) {
                                eStart.ClientX = event.changedTouches[0].clientX;
                                eStart.ClientY = event.changedTouches[0].clientY;
                            } else {
                                eStart.ClientX = e.clientX;
                                eStart.ClientY = e.clientY;
                            };
                            eStart.Time = new Date();

                            //停止事件传播（防止冒泡）
                            e.cancelBubble = false;
                            e.stopPropagation();
                        };
                        if (ControlData.IsTouch) {
                            ControlData.ControlJQs.CurrentLevelJQ.bind("touchstart", mousedownFunction);
                        } else {
                            ControlData.ControlJQs.CurrentLevelJQ.bind("mousedown", mousedownFunction);
                        };

                        var mousemoveFunction = function (e) {
                            if (eSlide.IsMouseDown) {
                                if (!eSlide.IsMouseDownMove) {
                                    eLastMove.ClientX = eStart.ClientX;
                                    eLastMove.ClientY = eStart.ClientY;
                                    eLastMove.Time = eStart.Time;
                                };
                                eLastMove.ClientX = eEnd.ClientX;
                                eLastMove.ClientY = eEnd.ClientY;
                                eLastMove.Time = eEnd.Time;
                                if (ControlData.IsTouch) {
                                    eEnd.ClientX = event.changedTouches[0].clientX;
                                    eEnd.ClientY = event.changedTouches[0].clientY;
                                } else {
                                    eEnd.ClientX = e.clientX;
                                    eEnd.ClientY = e.clientY;
                                };
                                eEnd.Time = new Date();

                                //鼠标按下拖动过
                                if (eSlide.IsMouseDownMove) {
                                } else {
                                    //阻止默认动作 (这样就不会带动上级滚动条滚动)
                                    e.preventDefault();
                                };

                                if (!ControlData.IsTouch) {
                                    var MoveY = eEnd.ClientY - eStart.ClientY;
                                    var MarginTop = eSlide.MarginTop + MoveY;
                                    if (MarginTop < eSlide.MinMarginTop) {
                                        MarginTop = eSlide.MinMarginTop;
                                    } else if (MarginTop > eSlide.MaxMarginTop) {
                                        MarginTop = eSlide.MaxMarginTop;
                                    };
                                    ControlData.ControlJQs.CurrentLevelJQ.css("margin-top", MarginTop + "px");
                                    AdjustCurrentLevel(false);
                                };

                                eSlide.IsMouseDownMove = true;

                                //停止事件传播（防止冒泡）
                                e.cancelBubble = false;
                                e.stopPropagation();
                            };
                        };
                        if (ControlData.IsTouch) {
                            ControlData.ControlJQs.CurrentLevelJQ.bind("touchmove", mousemoveFunction);
                        } else {
                            ControlData.ControlJQs.CurrentLevelJQ.bind("mousemove", mousemoveFunction);
                        };

                        var mouseupFunction = function (e) {
                            if (eSlide.IsMouseDown) {

                                //关闭Capture监控
                                if (window.captureEvents) {
                                    window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                                } else if (ControlData.ControlJQs.CurrentLevelJS.setCapture) {
                                    ControlData.ControlJQs.CurrentLevelJS.releaseCapture();
                                };

                                eSlide.IsMouseDown = false;
                                ControlData.IsMouseDown = eSlide.IsMouseDown;
                                eEnd.Time = new Date();

                                AdjustCurrentLevel(true);

                                //鼠标按下拖动过
                                if (eSlide.IsMouseDownMove) {
                                    //拖动过程中防止触发操作，比如内部有链接<a href="http://www.baidu.com">百度</a>，就是防止拖动中打开页面
                                    ControlData.ControlJQs.CurrentLevelJQ.unbind("click").bind('click', function () {
                                        //阻止默认动作
                                        e.preventDefault();
                                        //停止事件传播（防止冒泡）
                                        e.cancelBubble = false;
                                        e.stopPropagation();
                                    });
                                } else {
                                    ControlData.ControlJQs.CurrentLevelJQ.unbind("click");
                                };

                            } else {
                                ControlData.ControlJQs.CurrentLevelJQ.unbind("click");
                            };
                        };
                        if (ControlData.IsTouch) {
                            ControlData.ControlJQs.CurrentLevelJQ.bind("touchend", mouseupFunction);
                        } else {
                            ControlData.ControlJQs.CurrentLevelJQ.bind("mouseup", mouseupFunction);
                        };
                    } else {
                        ControlData.ControlJQs.IsInit = false;
                    };

                    //初始化滑动过程中使用的全局对象
                    eSlide.IsMouseDown = false;
                    eSlide.CurrentLevelHeight = ControlData.ControlJQs.CurrentLevelJQ.height();
                    eSlide.MarginTop = parseInt(ControlData.ControlJQs.CurrentLevelJQ.css("margin-top")); if (isNaN(eSlide.MarginTop)) { eSlide.MarginTop = 0; };
                    if (eSlide.MarginTop > (0 - eSlide.CurrentLevelHeight)) {
                        eSlide.MarginTop = 0 - eSlide.CurrentLevelHeight;
                        ControlData.ControlJQs.CurrentLevelJQ.css("margin-top", eSlide.MarginTop + "px").data("Level", MarginTopToLevel(eSlide.MarginTop));
                    };
                    eSlide.MarginLeft = parseInt(ControlData.ControlJQs.CurrentLevelJQ.css("margin-left")); if (isNaN(eSlide.MarginLeft)) { eSlide.MarginLeft = 0; };
                    eSlide.ZoomInHeight = ControlData.ControlJQs.ZoomInJQ.height();

                    var MaxLevel = 0;
                    ControlData.ControlJQs.LevelJQ.empty();
                    //地图级别
                    if (fw.fwObject.FWObjectHelper.hasValue(Settings.ArcGISMap) && fw.fwObject.FWObjectHelper.hasValue(Settings.ArcGISMap.__tileInfo)) {
                        MaxLevel = Settings.ArcGISMap.__tileInfo.lods.length;
                        Settings.ScaleDescriptionDictionary = {};
                        Settings.ScaleInfoDictionary = {};
                        for (var i = 0; i < Settings.ArcGISMap.__tileInfo.lods.length; i++) {
                            var lod = Settings.ArcGISMap.__tileInfo.lods[i];
                            var scale = parseInt(lod.scale, 10);
                            switch (scale) {
                                case 295497593:
                                    Settings.ScaleDescriptionDictionary[i] = "Global";
                                    break;
                                case 36937199:
                                    Settings.ScaleDescriptionDictionary[i] = "Country";
                                    break;
                                case 4617149:
                                    Settings.ScaleDescriptionDictionary[i] = "Province";
                                    break;
                                case 577143:
                                    Settings.ScaleDescriptionDictionary[i] = "City";
                                    break;
                                case 18035:
                                    Settings.ScaleDescriptionDictionary[i] = "Street";
                                    break;
                            };
                            var ScaleInfo = "";
                            var ScaleValue = scale / 2;
                            if (ScaleValue > 100000) {
                                ScaleInfo = "1:" + parseInt(ScaleValue / 10000, 10) + "万";
                            } else if (ScaleValue > 10000) {
                                ScaleInfo = "1:" + (ScaleValue / 10000).ToString("#.0") + "万";
                            } else {
                                ScaleInfo = "1:" + parseInt(ScaleValue, 10);
                            };
                            Settings.ScaleInfoDictionary[i] = ScaleInfo;
                        };
                        for (var i = MaxLevel - 1; i > -1; i--) {
                            $("<div class=\"divEveryLevel\" style=\"height:" + eSlide.CurrentLevelHeight + "px\"></div>").data("Level", i).appendTo(ControlData.ControlJQs.LevelJQ);
                        };
                    }
                    //初始化滑动过程中使用的全局对象
                    if (MaxLevel > 0) {
                        eSlide.LevelHeight = ControlData.ControlJQs.LevelJQ.height();
                        ControlData.ControlJQs.CurrentLevelJQ.show();
                    } else {
                        eSlide.LevelHeight = 0;
                        ControlData.ControlJQs.CurrentLevelJQ.hide();
                    };
                    ControlData.ControlJQs.LevelSelectJQ.height(eSlide.LevelHeight);
                    eSlide.MinMarginTop = 0 - eSlide.LevelHeight;
                    eSlide.MaxMarginTop = 0 - eSlide.CurrentLevelHeight;
                    eSlide.MaxLevel = eSlide.LevelHeight / eSlide.CurrentLevelHeight - 1;

                    ControlData.ControlJQs.ScaleDescriptionJQ.empty();
                    //地图级别说明
                    for (var Level in Settings.ScaleDescriptionDictionary) {
                        Level = parseInt(Level);
                        if (!isNaN(Level) && 0 <= Level && Level < eSlide.MaxLevel) {
                            var divJQ = $("<div class=\"divDescriptionContent " + Settings.ScaleDescriptionDictionary[Level] + "\">&nbsp;</div>").appendTo(ControlData.ControlJQs.ScaleDescriptionJQ);
                            divJQ.css("top", LevelToTop(Level, divJQ.height()) + "px");
                        };
                    };

                    Settings.ArcGISMap.setExtent(Settings.ArcGISMap.extent);

                });
            };

            Settings.ArcGISWindow.dojo.connect(Settings.ArcGISMap, "onLayerAdd", function () {
                LayerChangedFunction();
            });

            Settings.ArcGISWindow.dojo.connect(Settings.ArcGISMap, "onLayerRemove", function () {
                LayerChangedFunction();
            });

        };
        return SelectorJQ;
    }
});