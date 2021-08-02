$.ToolsControl = {
    Settings: {}
    , _DefaultShowToolNameArray: [
                "MeasureClearAll", "MeasureDistance", "MeasureArea", "MeasurePoint","DrawControl", "AddPoint"
                , "RangeClearAll", "PointRange", "MultipointRange", "LineRange", "PolylineRange", "PolygonRange", "FreehandPolylineRange", "FreehandPolygonRange", "ArrowRange", "TriangleRange", "CircleRange", "EllipseRange"
            ]
            , _DefaultToolTypes: [
                {
                    ToolTypeName: "Measure"
                    , ToolTypeTitle: "测量"
                    , Width: null
                    , Tools: [
                        {
                            ToolName: "MeasureClearAll"
                            , ToolTitle: "清空"
                            , ClassName: "ClearAll"
                            , OnClick: function (e, data, OnComplete) {

                                if (fw.fwObject.FWObjectHelper.hasValue(data.ArcGISWindow)) {
                                    data.ArcGISWindow.ArcGISAPI.clearMapDrawGraphics();
                                    if ($.isFunction(OnComplete)) {
                                        OnComplete(e, data);
                                    };
                                }
                            }
                            , OnComplete: function (e, data) {
                                // alert(data.ArcGISMap);
                            }
                        }
                        , {
                            ToolName: "MeasureDistance"
                            , ToolTitle: "测量距离"
                            , ClassName: "MeasureDistance"
                            , OnClick: function (e, data, OnComplete) {
                                var Settings = {
                                    MapDrawToolCode: "LINE"
                                    , ToolName: $(e.currentTarget).attr("toolname")
                                    , CalcLength: "1"
                                    , ShowText: true
                                    , onCompletedEvent: OnComplete
                                };
                                if (fw.fwObject.FWObjectHelper.hasValue(data.ArcGISWindow))
                                    data.ArcGISWindow.ArcGISAPI.setMapDrawTool(Settings);
                                //                                if ($.isFunction(OnComplete)) {
                                //                                    OnComplete(e, data);
                                //                                };

                            }
                            , OnComplete: function (data) {

                            }
                        }
                        , {
                            ToolName: "MeasureArea"
                            , ToolTitle: "测量面积"
                            , ClassName: "MeasureArea"
                            , OnClick: function (e, data, OnComplete) {
                                var Settings = {
                                    MapDrawToolCode: "FREEHAND_POLYGON"
                                    , CalcLength: "1"
                                    , ShowText: true
                                    , onCompletedEvent: OnComplete
                                };
                                if (fw.fwObject.FWObjectHelper.hasValue(data.ArcGISWindow))
                                    data.ArcGISWindow.ArcGISAPI.setMapDrawTool(Settings);

                                //                                if ($.isFunction(OnComplete)) {
                                //                                    OnComplete(e, data);
                                //                                };
                                
                            }
                            , OnComplete: function (data) {
                                
                                                               
                            }
                        }
                        , {
                            ToolName: "MeasurePoint"
                            , ToolTitle: "经纬度"
                            , ClassName: "MeasurePoint"
                            , OnClick: function (e, data, OnComplete) {
                                var Settings = {
                                    MapDrawToolCode: "POINT"
                                    , CalcLength: "1"
                                    , ShowText: true
                                    , onCompletedEvent: OnComplete
                                };
                                if (fw.fwObject.FWObjectHelper.hasValue(data.ArcGISWindow))
                                    data.ArcGISWindow.ArcGISAPI.setMapDrawTool(Settings);
                            }
                            , OnComplete: function (data) {
                                // alert(data.ArcGISMap);
                            }
                        }, {
                            ToolName: "DrawControl"
                            , ToolTitle: "画图取点位"
                            , ClassName: "DrawControl"
                            , OnClick: function (e, data, OnComplete) {
                                divArcGISDrawControlJQ.DrawControl({
                                    ArcGISWindow: API.ArcGISAPI.ArcGISWindow
                                  , ArcGISMap: API.ArcGISAPI.ArcGISMap
                                });
                            }
                            , OnComplete: function (data) {

                            }
                        }, {
                            ToolName: "AddPoint"
                            , ToolTitle: "定位"
                            , ClassName: "AddPoint"
                            , OnClick: function (e, data, OnComplete) {
                                divArcGISLocateControlJQ.LocatePointControl({
                                    ArcGISWindow: API.ArcGISAPI.ArcGISWindow
                                  , ArcGISMap: API.ArcGISAPI.ArcGISMap
                                });

                            }
                            , OnComplete: function (data) {
                                // alert(data.ArcGISMap);

                            }
                        }, {
                            ToolName: "AddMark"
                            , ToolTitle: "标记"
                            , ClassName: "AddPoint"
                            , OnClick: function (e, data, OnComplete) {
                                var Settings = {
                                    MapDrawToolCode: "POINT"
                                    , CalcLength: "1"
                                    , ShowText: false
                                    , onCompletedEvent: OnComplete
                                };
                                if (fw.fwObject.FWObjectHelper.hasValue(data.ArcGISWindow))
                                    data.ArcGISWindow.ArcGISAPI.setMapDrawTool(Settings);

                            }
                            , OnComplete: function (data) {
                                API.ArcGISAPI.arcGISDistpatcher().dispatchCustomEvent(new BaseEvent(CustomEvent.OnMarkEndEvent, data.geometry));
                            }
                        }
                    ]
                }
                , {
                    ToolTypeName: "RangeSelect"
                    , ToolTypeTitle: "范围"
                    , Width: null
                    , Tools: [
                        {
                            ToolName: "RangeClearAll"
                            , ToolTitle: "清空"
                            , ClassName: "ClearAll"
                            , OnClick: function (e, data, OnComplete) {

                                if (fw.fwObject.FWObjectHelper.hasValue(data.ArcGISWindow)) {
                                    data.ArcGISWindow.ArcGISAPI.clearMapDrawGraphics();
                                    if ($.isFunction(OnComplete)) {
                                        OnComplete(e, data);
                                    };
                                }
                            }
                            , OnComplete: function (e, data) {
                                //alert(data.ArcGISMap);
                            }
                        }
                        , {
                            ToolName: "PointRange"
                            , ToolTitle: "点"
                            , ClassName: "PointRange"
                            , OnClick: function (e, data, OnComplete) {

                                var Settings = {
                                    MapDrawToolCode: "POINT"
                                    , ToolName: $(e.currentTarget).attr("toolname")
                                    , ReturnGeometry: 1
                                    , onCompletedEvent: OnComplete
                                };
                                if (fw.fwObject.FWObjectHelper.hasValue(data.ArcGISWindow))
                                    data.ArcGISWindow.ArcGISAPI.setMapDrawTool(Settings);

                                //                                if ($.isFunction(OnComplete)) {
                                //                                    OnComplete(e, data);
                                //                                };
                            }
                            , OnComplete: function (e, data) {
                                // alert(data.ArcGISMap);
                            }
                        }
                        , {
                            ToolName: "MultipointRange"
                            , ToolTitle: "多点"
                            , ClassName: "MultipointRange"
                            , OnClick: function (e, data, OnComplete) {
                                var Settings = {
                                    MapDrawToolCode: "MULTI_POINT"
                                    , ToolName: $(e.currentTarget).attr("toolname")
                                    , ReturnGeometry: 1
                                    , onCompletedEvent: OnComplete
                                };
                                if (fw.fwObject.FWObjectHelper.hasValue(data.ArcGISWindow))
                                    data.ArcGISWindow.ArcGISAPI.setMapDrawTool(Settings);
                            }
                            , OnComplete: function (e, data) {
                                // alert(data.ArcGISMap);
                            }
                        }
                        , {
                            ToolName: "LineRange"
                            , ToolTitle: "线"
                            , ClassName: "LineRange"
                            , OnClick: function (e, data, OnComplete) {
                                var Settings = {
                                    MapDrawToolCode: "LINE"
                                    , ToolName: $(e.currentTarget).attr("toolname")
                                    , ReturnGeometry: 1
                                    , onCompletedEvent: OnComplete
                                };
                                if (fw.fwObject.FWObjectHelper.hasValue(data.ArcGISWindow))
                                    data.ArcGISWindow.ArcGISAPI.setMapDrawTool(Settings);
                            }
                            , OnComplete: function (e, data) {
                                // alert(data.ArcGISMap);
                            }
                        }
                        , {
                            ToolName: "PolylineRange"
                            , ToolTitle: "折线"
                            , ClassName: "PolylineRange"
                            , OnClick: function (e, data, OnComplete) {
                                var Settings = {
                                    MapDrawToolCode: "POLYLINE"
                                    , ToolName: $(e.currentTarget).attr("toolname")
                                    , ReturnGeometry: 1
                                    , onCompletedEvent: OnComplete
                                };
                                if (fw.fwObject.FWObjectHelper.hasValue(data.ArcGISWindow))
                                    data.ArcGISWindow.ArcGISAPI.setMapDrawTool(Settings);
                            }
                            , OnComplete: function (e, data) {
                                var ffff = "";
                                ffff += "X,Y" + "\r\n";
                                for (var i = 0; i < e.geometry.paths[0].length; i++) {
                                    ffff += e.geometry.paths[0][i] + "\r\n";
                                };
                                API.Copy(ffff);
                                var d = jExtension.JsonToString(e.geometry.rings);
                                // alert(data.ArcGISMap);
                            }
                        }
                        , {
                            ToolName: "FreehandPolylineRange"
                            , ToolTitle: "画折线"
                            , ClassName: "FreehandPolylineRange"
                            , OnClick: function (e, data, OnComplete) {
                                var Settings = {
                                    MapDrawToolCode: "FREEHAND_POLYLINE"
                                    , ToolName: $(e.currentTarget).attr("toolname")
                                    , ReturnGeometry: 1
                                    , onCompletedEvent: OnComplete
                                };
                                if (fw.fwObject.FWObjectHelper.hasValue(data.ArcGISWindow))
                                    data.ArcGISWindow.ArcGISAPI.setMapDrawTool(Settings);
                            }
                            , OnComplete: function (e, data) {
                                //alert(data.ArcGISMap);
                            }
                        }
                        , {
                            ToolName: "CircleRange"
                            , ToolTitle: "圆"
                            , ClassName: "CircleRange"
                            , OnClick: function (e, data, OnComplete) {
                                var Settings = {
                                    MapDrawToolCode: "CIRCLE"
                                    , ToolName: $(e.currentTarget).attr("toolname")
                                    , ReturnGeometry: 1
                                    , onCompletedEvent: OnComplete
                                };
                                if (fw.fwObject.FWObjectHelper.hasValue(data.ArcGISWindow))
                                    data.ArcGISWindow.ArcGISAPI.setMapDrawTool(Settings);
                            }
                            , OnComplete: function (e, data) {
                                //alert(data.ArcGISMap);
                            }
                        }
                        , {
                            ToolName: "EllipseRange"
                            , ToolTitle: "椭圆"
                            , ClassName: "EllipseRange"
                            , OnClick: function (e, data, OnComplete) {
                                var Settings = {
                                    MapDrawToolCode: "ELLIPSE"
                                    , ToolName: $(e.currentTarget).attr("toolname")
                                    , ReturnGeometry: 1
                                    , onCompletedEvent: OnComplete

                                };
                                if (fw.fwObject.FWObjectHelper.hasValue(data.ArcGISWindow))
                                    data.ArcGISWindow.ArcGISAPI.setMapDrawTool(Settings);
                            }
                            , OnComplete: function (e, data) {
                                //alert(data.ArcGISMap);
                            }
                        }
                        , {
                            ToolName: "TriangleRange"
                            , ToolTitle: "三角"
                            , ClassName: "TriangleRange"
                            , OnClick: function (e, data, OnComplete) {
                                var Settings = {
                                    MapDrawToolCode: "TRIANGLE"
                                    , ToolName: $(e.currentTarget).attr("toolname")
                                    , ReturnGeometry: 1
                                    , onCompletedEvent: OnComplete
                                };
                                if (fw.fwObject.FWObjectHelper.hasValue(data.ArcGISWindow))
                                    data.ArcGISWindow.ArcGISAPI.setMapDrawTool(Settings);
                            }
                            , OnComplete: function (e, data) {
                                //alert(data.ArcGISMap);
                            }
                        }
                        , {
                            ToolName: "PolygonRange"
                            , ToolTitle: "面"
                            , ClassName: "PolygonRange"
                            , OnClick: function (e, data, OnComplete) {
                                var Settings = {
                                    MapDrawToolCode: "POLYGON"
                                    , ToolName: $(e.currentTarget).attr("toolname")
                                    , ReturnGeometry: 1
                                    , onCompletedEvent: OnComplete
                                };
                                if (fw.fwObject.FWObjectHelper.hasValue(data.ArcGISWindow))
                                    data.ArcGISWindow.ArcGISAPI.setMapDrawTool(Settings);
                            }
                            , OnComplete: function (e, data) {
                                var ffff = "";
                                ffff += "X,Y" + "\r\n";
                                for (var i = 0; i < e.geometry.rings[0].length; i++) {
                                    ffff += e.geometry.rings[0][i] + "\r\n";
                                };
                                API.Copy(ffff);
                                var d = jExtension.JsonToString(e.geometry.rings);
                                // alert(data.ArcGISMap);
                            }
                        }
                        , {
                            ToolName: "FreehandPolygonRange"
                            , ToolTitle: "画面"
                            , ClassName: "FreehandPolygonRange"
                            , OnClick: function (e, data, OnComplete) {
                                var Settings = {
                                    MapDrawToolCode: "FREEHAND_POLYGON"
                                    , ToolName: $(e.currentTarget).attr("toolname")
                                    , ReturnGeometry: 1
                                    , onCompletedEvent: OnComplete
                                };
                                if (fw.fwObject.FWObjectHelper.hasValue(data.ArcGISWindow))
                                    data.ArcGISWindow.ArcGISAPI.setMapDrawTool(Settings);
                            }
                            , OnComplete: function (e, data) {
                                //alert(data.ArcGISMap);
                            }
                        }
                        , {
                            ToolName: "ArrowRange"
                            , ToolTitle: "箭头"
                            , ClassName: "ArrowRange"
                            , OnClick: function (e, data, OnComplete) {
                                var Settings = {
                                    MapDrawToolCode: "ARROW"
                                    , ToolName: $(e.currentTarget).attr("toolname")
                                    , ReturnGeometry: 1
                                    , onCompletedEvent: OnComplete
                                };
                                if (fw.fwObject.FWObjectHelper.hasValue(data.ArcGISWindow))
                                    data.ArcGISWindow.ArcGISAPI.setMapDrawTool(Settings);
                            }
                            , OnComplete: function (e, data) {
                                //alert(data.ArcGISMap);
                            }
                        }
                    ]
                }
            ]
            , ToolSettings: function () {
                return {
                    ToolName: null
                    , ToolTitle: null
                    , ClassName: null
                    , ImageUrl: null
                    , OnClick: null
                    , OnComplete: null
                };
            }
            , ToolTypeSettings: function () {
                return {
                    ToolTypeName: null
                    , ToolTypeTitle: null
                    , Width: 100
                    , Tools: []
                };
            }
            , AddToolTypes: function (Properties) {
                var Settings = {
                    Selector: null
                    , ToolType: null
                    , ToolTypes: []
                };
                $.extend(Settings, Properties);

                if (!fw.fwObject.FWObjectHelper.hasValue(Settings.ToolTypes)) {
                    Settings.ToolTypes = [];
                };
                if (fw.fwObject.FWObjectHelper.hasValue(Settings.ToolType)) {
                    Settings.ToolTypes.push(Settings.ToolType);
                };

                for (var i = 0; i < Settings.ToolTypes.length; i++) {
                    var ToolTypeSettings = $.ToolsControl.ToolTypeSettings();
                    $.extend(ToolTypeSettings, Settings.ToolTypes[i]);
                    if (!fw.fwObject.FWObjectHelper.hasValue(ToolTypeSettings.ToolTypeName)) {
                        ToolTypeSettings.ToolTypeName = ToolTypeSettings.ToolTypeTitle;
                    };
                    Settings.ToolTypes[i] = ToolTypeSettings;
                };

                var SelectorJQ = $(Settings.Selector);
                SelectorJQ.each(function () {
                    var ControlData = $(this).data("ControlData");
                    if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                        for (var i = 0; i < Settings.ToolTypes.length; i++) {
                            var ToolType = Settings.ToolTypes[i];
                            var liJQ = ControlData.ControlJQs.LiToolsTypeJQ.filter("[tooltypename='" + ToolType.ToolTypeName + "']");
                            if (liJQ.length < 1) {
                                liJQ = $("<li tooltypename=" + ToolType.ToolTypeName + ">" + ToolType.ToolTypeTitle + "</li>").appendTo(ControlData.ControlJQs.UlToolsTypeJQ);
                                var ulJQ = $("<ul tooltypename=" + ToolType.ToolTypeName + "></ul>").addClass("ulToolsContent").width(ToolType.Width).data("ControlData", ControlData).appendTo(ControlData.ControlJQs.DivToolsContentJQ);
                                if (fw.fwObject.FWObjectHelper.hasValue(ToolType.Width)) {
                                    ulJQ.width(ToolType.Width);
                                };

                                ControlData.ControlJQs.LiToolsTypeJQ = $(">li", ControlData.ControlJQs.UlToolsTypeJQ);
                                ControlData.ControlJQs.UlToolsContentJQ = $("ul.ulToolsContent", ControlData.ControlJQs.DivToolsContentJQ);
                                ControlData.ControlJQs.LiToolsTypeJQ.unbind("click").bind("click", function () {
                                    ControlData.ControlJQs.UlToolsContentJQ.hide();
                                    var thisJQ = $(this);
                                    var Index = ControlData.ControlJQs.LiToolsTypeJQ.removeClass("Selected").index(thisJQ);
                                    thisJQ.addClass("Selected");
                                    ControlData.ControlJQs.UlToolsContentJQ.eq(Index).show();
                                });

                                var SelectedIndex = $.ToolsControl.GetSelectedIndex({ Selector: this });
                                if (ControlData.ControlJQs.LiToolsTypeJQ.length > 0) {
                                    if (SelectedIndex < 0) {
                                        SelectedIndex = 0;
                                    }; if ((ControlData.ControlJQs.LiToolsTypeJQ.length - 1) < SelectedIndex) {
                                        SelectedIndex = ControlData.ControlJQs.LiToolsTypeJQ.length - 1;
                                    };
                                } else {
                                    SelectedIndex = -1;
                                };
                                ControlData.ControlJQs.LiToolsTypeJQ.eq(SelectedIndex).click();
                            };

                            $.ToolsControl.AddTools({
                                Selector: this
                                , ToolTypeName: ToolType.ToolTypeName
                                , Tools: ToolType.Tools
                            });
                        };
                    };
                });
                return SelectorJQ;
            }
            , AddTools: function (Properties) {
                var Settings = {
                    Selector: null
                    , ToolTypeName: null
                    , ToolTypeTitle: null
                    , Tool: null
                    , Tools: []
                };
                $.extend(Settings, Properties);

                if (!fw.fwObject.FWObjectHelper.hasValue(Settings.Tools)) {
                    Settings.Tools = [];
                };
                if (fw.fwObject.FWObjectHelper.hasValue(Settings.Tool)) {
                    Settings.Tools.push(Settings.Tool);
                };

                for (var i = 0; i < Settings.Tools.length; i++) {
                    var ToolSettings = $.ToolsControl.ToolSettings();
                    $.extend(ToolSettings, Settings.Tools[i]);
                    if (!fw.fwObject.FWObjectHelper.hasValue(ToolSettings.ToolName)) {
                        ToolSettings.ToolName = ToolSettings.ToolTitle;
                    };
                    Settings.Tools[i] = ToolSettings;
                };

                var ToolsContentJQ = $.ToolsControl.GetToolsContentJQ(Settings);
                if (ToolsContentJQ.length < 1) {
                    $.ToolsControl.AddToolTypes({ Selector: Settings.Selector, ToolType: { ToolTypeName: Settings.ToolTypeName, ToolTypeTitle: Settings.ToolTypeTitle} });
                    ToolsContentJQ = $.ToolsControl.GetToolsContentJQ(Settings);
                };
                if (ToolsContentJQ.length > 0) {
                    for (var i = 0; i < Settings.Tools.length; i++) {
                        var Tool = Settings.Tools[i];
                        var liJQ = $(">li[toolname='" + Tool.ToolName + "']", ToolsContentJQ);
                        if (liJQ.length < 1) {
                            liJQ = $("<li toolname=" + Tool.ToolName + " title=" + Tool.ToolTitle + "></li>").appendTo(ToolsContentJQ);
                            if (fw.fwObject.FWObjectHelper.hasValue(Tool.ClassName)) {
                                liJQ.addClass(Tool.ClassName);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(Tool.ImageUrl)) {
                                liJQ.css("background", "url(" + Tool.ImageUrl + ") no-repeat scroll center center transparent;");
                            };
                        };
                        if ($.isFunction(Tool.OnClick)) {
                            liJQ.unbind("click").bind("click", function (e) {
                                var thisJQ = $(this);
                                var ControlData = thisJQ.parent().data("ControlData");
                               // console.dir( ControlData.Settings.ArcGISWindow,ControlData.Settings.ArcGISMap)
                                thisJQ.data("OnClick")(e, {ArcGISWindow: ControlData.Settings.ArcGISWindow, ArcGISMap: ControlData.Settings.ArcGISMap  }, thisJQ.data("OnComplete"));
                            }).data("OnClick", Tool.OnClick).data("OnComplete", Tool.OnComplete);
                        };
                    };
                };
            }
            , GetSelectedIndex: function (Properties) {
                var Settings = {
                    Selector: null
                };
                $.extend(Settings, Properties);
                var SelectedIndex = -1;
                var ControlData = $(Settings.Selector).data("ControlData");
                if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                    var LiToolsTypeJQ = ControlData.ControlJQs.LiToolsTypeJQ.filter(".Selected");
                    SelectedIndex = ControlData.ControlJQs.LiToolsTypeJQ.index(LiToolsTypeJQ);
                };
                return SelectedIndex;
            }
            , GetToolsContentJQ: function (Properties) {
                var Settings = {
                    Selector: null
                    , ToolTypeName: null
                };
                $.extend(Settings, Properties);

                return $("ul[tooltypename='" + Settings.ToolTypeName + "']", Settings.Selector);
            }
            , Empty: function (Properties) {
                var Settings = {
                    Selector: null
                };
                $.extend(Settings, Properties);

                $(Settings.Selector).removeData("ControlData").empty().ToolsControl();
            }
            , SetToolEvent: function (Properties) {
                var Settings = {
                    Selector: null
                    , ToolName: null
                    , ToolNameArray: null
                    , OnClick: null
                    , OnComplete: null
                };
                $.extend(Settings, Properties);

                if (!fw.fwObject.FWObjectHelper.hasValue(Settings.ToolNameArray)) {
                    Settings.ToolNameArray = [];
                };
                if (fw.fwObject.FWObjectHelper.hasValue(Settings.ToolName)) {
                    Settings.ToolNameArray.push(Settings.ToolName);
                };
                var EventBind = function (liJQ) {
                    if ($.isFunction(Settings.OnComplete)) {
                        liJQ.data("OnComplete", Settings.OnComplete);
                    };
                    if ($.isFunction(Settings.OnClick)) {
                        liJQ.unbind("click").bind("click", function (e) {
                            var thisJQ = $(this);
                            var ControlData = thisJQ.parent().data("ControlData");
                            thisJQ.data("OnClick")(e, { ArcGISWindow: ControlData.Settings.ArcGISWindow, ArcGISMap: ControlData.Settings.ArcGISMap }, thisJQ.data("OnComplete"));
                        }).data("OnClick", Settings.OnClick);
                    };
                };

                if (Settings.ToolNameArray.length > 0) {
                    for (var i = 0; i < Settings.ToolNameArray.length; i++) {
                        var ToolName = Settings.ToolNameArray[i];
                        EventBind($("li[toolname='" + ToolName + "']", Settings.Selector));
                    };
                } else {
                    EventBind($("li[toolname]", Settings.Selector));
                };
            }
            , RemoveTools: function (Properties) {
                var Settings = {
                    Selector: null
                    , ToolNameArray: null
                };
                $.extend(Settings, Properties);

                if (fw.fwObject.FWObjectHelper.hasValue(Settings.ToolNameArray)) {
                    $(Settings.Selector).each(function () {
                        var ControlData = $(this).data("ControlData");
                        if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                            $(">li", ControlData.ControlJQs.UlToolsContentJQ).each(function () {
                                var liJQ = $(this);
                                if (Settings.ToolNameArray.Contains(liJQ.attr("toolname"))) {
                                    liJQ.remove();
                                };
                            });
                            ControlData.ControlJQs.UlToolsContentJQ.each(function (i) {
                                var ulJQ = $(this);
                                var liJQ = $(">li:first", ulJQ);
                                if (liJQ.length < 1) {
                                    ControlData.ControlJQs.LiToolsTypeJQ.eq(i).remove();
                                    ulJQ.remove();
                                };
                            });
                            ControlData.ControlJQs.LiToolsTypeJQ = $(">li", ControlData.ControlJQs.UlToolsTypeJQ);
                            ControlData.ControlJQs.UlToolsContentJQ = $("ul.ulToolsContent", ControlData.ControlJQs.DivToolsContentJQ);

                            var SelectedIndex = $.ToolsControl.GetSelectedIndex({ Selector: this });
                            if (ControlData.ControlJQs.LiToolsTypeJQ.length > 0) {
                                if (SelectedIndex < 0) {
                                    SelectedIndex = 0;
                                }; if ((ControlData.ControlJQs.LiToolsTypeJQ.length - 1) < SelectedIndex) {
                                    SelectedIndex = ControlData.ControlJQs.LiToolsTypeJQ.length - 1;
                                };
                            } else {
                                SelectedIndex = -1;
                            };
                            ControlData.ControlJQs.LiToolsTypeJQ.eq(SelectedIndex).click();
                        };
                    });
                };
            }
            , RemoveOtherTools: function (Properties) {
                var Settings = {
                    Selector: null
                    , ToolNameArray: null
                };
                $.extend(Settings, Properties);

                if (fw.fwObject.FWObjectHelper.hasValue(Settings.ToolNameArray)) {
                    $(Settings.Selector).each(function () {
                        var ControlData = $(this).data("ControlData");
                        if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                            $(">li", ControlData.ControlJQs.UlToolsContentJQ).each(function () {
                                var liJQ = $(this);
                                if (!Settings.ToolNameArray.Contains(liJQ.attr("toolname"))) {
                                    liJQ.remove();
                                };
                            });
                            ControlData.ControlJQs.UlToolsContentJQ.each(function (i) {
                                var ulJQ = $(this);
                                var liJQ = $(">li:first", ulJQ);
                                if (liJQ.length < 1) {
                                    ControlData.ControlJQs.LiToolsTypeJQ.eq(i).remove();
                                    ulJQ.remove();
                                };
                            });
                            ControlData.ControlJQs.LiToolsTypeJQ = $(">li", ControlData.ControlJQs.UlToolsTypeJQ);
                            ControlData.ControlJQs.UlToolsContentJQ = $("ul.ulToolsContent", ControlData.ControlJQs.DivToolsContentJQ);

                            var SelectedIndex = $.ToolsControl.GetSelectedIndex({ Selector: this });
                            if (ControlData.ControlJQs.LiToolsTypeJQ.length > 0) {
                                if (SelectedIndex < 0) {
                                    SelectedIndex = 0;
                                }; if ((ControlData.ControlJQs.LiToolsTypeJQ.length - 1) < SelectedIndex) {
                                    SelectedIndex = ControlData.ControlJQs.LiToolsTypeJQ.length - 1;
                                };
                            } else {
                                SelectedIndex = -1;
                            };
                            ControlData.ControlJQs.LiToolsTypeJQ.eq(SelectedIndex).click();
                        };
                    });
                };
            }
};
$.fn.extend({
    ToolsControl: function (Properties) {
        var Settings = {
            ArcGISWindow: null
            , ArcGISMap: null
            , ToolTypes: $.ToolsControl._DefaultToolTypes
            , ShowToolNameArray: null
        };
        $.extend(Settings, Properties);
        //这里面的值是从$.ToolsControl._DefaultToolTypes这边进去的
        if (!fw.fwObject.FWObjectHelper.hasValue(Settings.ShowToolNameArray)) {
            Settings.ShowToolNameArray = $.ToolsControl._DefaultShowToolNameArray;
        };

        this.each(function () {
            var ToolsControlJQ = $(this);
            var ControlData = ToolsControlJQ.data("ControlData");

            //判断ToolsControl有没缓存数据，有表示已经加载控件，无表示控件第一次加载
            if (!fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                ControlData = {
                    IsTouch: jQueryExtension.IsTouch()
                            , IsTouchModel: (fw.fwObject.FWObjectHelper.hasValue(fw.fwCookie.FWCookieHelper("IsTouchModel"))&&(fw.fwCookie.FWCookieHelper("IsTouchModel").toLowerCase() == "true" || fw.fwCookie.FWCookieHelper("IsTouchModel").toLowerCase() == "1"))
                            , ControlJQs: {
                                IsInit: true
                            }
                            , IsResize: false
                };
                if (ControlData.IsTouch) {
                    ControlData.IsTouchModel = true;
                };
                ToolsControlJQ.data("ControlData", ControlData).empty();
                if (ToolsControlJQ.css("position").toLowerCase() != "absolute") {
                    ToolsControlJQ.css("position", "relative");
                };

                var WindowGuid = fw.guid();
                var Html = "";
                Html += "<div class=\"jQE_Container_Absolute\">";
                Html += "    <div class=\"divTools\">";
                Html += "        <div class=\"divToolsImage\" title='工具'></div>";
                Html += "    </div>";
                Html += "    <div class=\"divToolsMenu divArcGISControl\">";
                Html += "        <table class=\"tableToolsMenu\">";
                Html += "            <tr>";
                Html += "                <td style=\"vertical-align: top;\">";
                Html += "                    <div class=\"divToolsType\">";
                Html += "                        <ul class=\"ulToolsType\"></ul>";
                Html += "                    </div>";
                Html += "                </td>";
                Html += "                <td class=\"tdCenter\"></td>";
                Html += "                <td style=\"vertical-align: top;\">";
                Html += "                    <div class=\"divToolsContent\"></div>";
                Html += "                </td>";
                Html += "            </tr>";
                Html += "        </table>";
                Html += "    </div>";
                Html += "</div>";
                $(Html).appendTo(ToolsControlJQ);

                ControlData.ControlJQs.ToolsControlJQ = ToolsControlJQ.addClass('divArcGISToolsControl');
                ControlData.ControlJQs.ToolsJQ = $("div.divTools", ControlData.ControlJQs.ToolsControlJQ);
                ControlData.ControlJQs.ToolsImageJQ = $("div.divToolsImage", ControlData.ControlJQs.ToolsJQ);

                ControlData.ControlJQs.ToolsMenuJQ = $("div.divToolsMenu", ControlData.ControlJQs.ToolsControlJQ);
                ControlData.ControlJQs.DivToolsTypeJQ = $("div.divToolsType", ControlData.ControlJQs.ToolsMenuJQ);
                ControlData.ControlJQs.UlToolsTypeJQ = $("ul.ulToolsType", ControlData.ControlJQs.DivToolsTypeJQ);
                ControlData.ControlJQs.LiToolsTypeJQ = $(">li", ControlData.ControlJQs.UlToolsTypeJQ);
                ControlData.ControlJQs.DivToolsContentJQ = $("div.divToolsContent", ControlData.ControlJQs.ToolsMenuJQ);
                ControlData.ControlJQs.UlToolsContentJQ = $("ul.ulToolsContent", ControlData.ControlJQs.DivToolsContentJQ);

                ControlData.ControlJQs.ToolsImageJQ.bind("click", function () {
                    if (ControlData.ControlJQs.ToolsMenuJQ.is(":hidden")) {
                        $("div.divArcGISControl").hide();
                        ControlData.ControlJQs.ToolsMenuJQ.show();
                    } else {
                        ControlData.ControlJQs.ToolsMenuJQ.hide();
                    };
                });
            } else {
                ControlData.ControlJQs.IsInit = false;
            };

            ControlData.Settings = Settings;
            $.ToolsControl.Settings = Settings;
            $.ToolsControl.AddToolTypes({
                Selector: this
                        , ToolTypes: Settings.ToolTypes
            });

            $.ToolsControl.RemoveOtherTools({
                Selector: this
                        , ToolNameArray: Settings.ShowToolNameArray
            });

        });
        return this;
    }
});
