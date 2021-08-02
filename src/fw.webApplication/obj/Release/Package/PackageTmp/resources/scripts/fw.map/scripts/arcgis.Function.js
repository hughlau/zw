var m_CaclDistancegeometry = null;
var Skyline_BusinessTypeArray = null;
var m_DrawLastGeometry = null;

//添加动态点位
function LoadDynamicLayer(LayerType, LayerServicesUrl, BusinessTypeCode, showLayeAttribution, Settings) {
    var query = new esri.tasks.Query();
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.where))
    { query.where = Settings.where; }
    else
    { query.where = "1=1"; }
    query.outFields = ["*"];

    var featureLayer = new esri.layers.FeatureLayer(LayerServicesUrl, {
        //MODE_SNAPSHOT MODE_ONDEMAND MODE_SELECTION
        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
        showAttribution: showLayeAttribution,
        outFields: ["*"]
    });
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.where)) {
        featureLayer.setDefinitionExpression(Settings.where);
    }

    if (fw.fwObject.FWObjectHelper.hasValue(Settings.opacity))
    { featureLayer.opacity = Settings.opacity; }
    else
    { featureLayer.opacity = 0.8; }
    featureLayer.id = "Business_" + BusinessTypeCode;
    var FillColor = "";
    var BorderColor = "";
    var BorderWidth = 1;
    var FillStyle = esri.symbol.SimpleFillSymbol.STYLE_NULL;
    var LineStyle = esri.symbol.SimpleLineSymbol.STYLE_NULL;
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.SymbolFillColor) && Settings.SymbolFillColor != "") {
        FillColor = Settings.SymbolFillColor;
        FillStyle = esri.symbol.SimpleFillSymbol.STYLE_SOLID;
    }
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.SymbolBorderColor) && Settings.SymbolBorderColor != "") {
        BorderColor = Settings.SymbolBorderColor;
        LineStyle = esri.symbol.SimpleLineSymbol.STYLE_SOLID;
    }
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.SymbolBorderWidth) && Settings.SymbolBorderWidth > 0) {
        BorderWidth = Settings.SymbolBorderWidth;
    }
    //面
    if (Settings.LayerType == Code__MapLayerTypeCode.Polygon) {
        var renderer = null;
        if (FillColor != "" && BorderColor != "") {
            renderer = new esri.renderer.SimpleRenderer(new esri.symbol.SimpleFillSymbol(FillStyle,
                    new esri.symbol.SimpleLineSymbol(LineStyle, new dojo.Color(BorderColor), BorderWidth), new dojo.Color(FillColor)));
        }
        //按照参数的渲染样式渲染
        else if (fw.fwObject.FWObjectHelper.hasValue(Settings.symbol)) {
            renderer = new esri.renderer.SimpleRenderer(Settings.symbol);
        };
        featureLayer.setRenderer(renderer);
    }
    //线
    else if (Settings.LayerType == Code__MapLayerTypeCode.Line) {
        if (BorderColor != "") {
            var renderer = new esri.renderer.SimpleRenderer(new esri.symbol.SimpleLineSymbol(LineStyle, new dojo.Color(BorderColor), BorderWidth));
            featureLayer.setRenderer(renderer);
        }
    }
    //点
    else {
        if (fw.fwObject.FWObjectHelper.hasValue(Settings.SymbolWidth) && fw.fwObject.FWObjectHelper.hasValue(Settings.SymbolHeight)) {
            var picSymbolUrl = null;
            if (fw.fwObject.FWObjectHelper.hasValue(Settings.SymbolUrl)) {
                picSymbolUrl = window.webSiteRootUrl + Settings.SymbolUrl;
                var renderer = new esri.renderer.SimpleRenderer(new esri.symbol.PictureMarkerSymbol(picSymbolUrl, Settings.SymbolWidth, Settings.SymbolHeight));
                featureLayer.setRenderer(renderer);

                var BusinessLayer = ArcGISAPI.getOrCreateLayer({
                    LayerName: "Business_" + BusinessTypeCode
                , addLayer: featureLayer
                });
            }
            else if (fw.fwObject.FWObjectHelper.hasValue(Settings.SymbolArray) && Settings.SymbolArray.attrValue.length > 0) {
                //通过条件进行唯一值渲染
                var attrKey = Settings.SymbolArray.attrKey;
                var renderer = new esri.renderer.UniqueValueRenderer(null, attrKey);
                for (var i = 0; i < Settings.SymbolArray.attrValue.length; i++) {
                    var item = Settings.SymbolArray.attrValue[i];
                    picSymbolUrl = window.webSiteRootUrl + item.symbolUrl;
                    var symbol = new esri.symbol.PictureMarkerSymbol(picSymbolUrl, Settings.SymbolWidth, Settings.SymbolHeight);
                    renderer.addValue(item.value, symbol);
                }
                featureLayer.setRenderer(renderer);
            };
        };
    };
    ArcGISAPI.getOrCreateLayer({
        LayerName: "Business_" + BusinessTypeCode
                            , addLayer: featureLayer
    });

    //    BusinessLayer.queryFeatures(query, function (featureSet) {
    //    }, function (err) {
    //    });
    //    if ($.isFunction(Settings.Callback)) {
    //        if (fw.fwObject.FWObjectHelper.hasValue(Settings.data))
    //            Settings.Callback(Settings.e, Settings.data);
    //        else
    //            Settings.Callback();
    //    }
};


//添加动态点位
function LoadDynamicElement(PageNow, nodeType, WhereString, BusinessTypeCode, Settings) {
    var Layerbegin = "Business_";
    if (!Settings.isBusinessLayer)
    { Layerbegin = ""; }
    var Data = {
        Ticket: $.page.ticket
        , PageSize: 20
        , PageNow: PageNow
        , SortFieldList: null
        , nodeType: nodeType
        , WhereString: WhereString
    }
    var BusinessLayer = ArcGISAPI.getOrCreateLayer({ LayerName: Layerbegin + BusinessTypeCode });
    BusinessLayer.hide();
    $.ajax($.Page.GetAjaxSettings({
        ServiceTypeCode: "Skyline"
                    , MethodName: "Page__SGNode_Where"
                    , data: jExtension.JsonToSubmitString(Data)
                    , success: function (ResultData) {
                        if (ResultData.Status == 1) {

                            var PageData = ResultData.Data;
                            var EntityList = PageData.EntityList == null ? [] : PageData.EntityList;

                            for (var i = 0; i < EntityList.length; i++) {
                                var Entity = EntityList[i];
                                if (Entity.msgData == null || Entity.msgData == "") continue;
                                var MessageJson = jExtension.JsonStringToJson(Entity.msgData);
                                MessageJson.BusinessCode = Entity.BusinessCode;
                                var BusinessTypeEntity = GetBusinessType(MessageJson.BusinessTypeCode);
                                switch (nodeType) {

                                    case 2:
                                        //ArcGIS_MapWindow.ShowCanton(Entity);
                                        break;
                                    case 18:
                                        var mapPoint = new esri.geometry.Point(Entity.position.x, Entity.position.y);
                                        var pointSym = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE, 10);
                                        if (BusinessTypeEntity.ImageFileName_24x24 != null && BusinessTypeEntity.ImageFileName_24x24 != "") {
                                            pointSym = new esri.symbol.PictureMarkerSymbol('../Images/' + BusinessTypeEntity.ImageFileName_24x24, 24, 24);
                                        };
                                        var graphic = new esri.Graphic(mapPoint, pointSym);
                                        $.extend(MessageJson, eval("(" + MessageJson.BusinessData + ")"));
                                        graphic.setAttributes(MessageJson);
                                        //graphic.visible = true;
                                        BusinessLayer.add(graphic);
                                        break;
                                    //sgNodeTypeLocation = 19,                                                                                                                                                                                                                                                                                                                                                                                 
                                    case 19:
                                        break;
                                };
                            };

                            if (BusinessLayer.graphics.length < PageData.RecordCount) {
                                LoadDynamicElement((PageData.PageNow + 1), nodeType, WhereString, BusinessTypeCode, Settings);
                            } else {
                                if ($.isFunction(Settings.Callback)) {
                                    if (fw.fwObject.FWObjectHelper.hasValue(Settings.data))
                                    { Settings.Callback(Settings.e, Settings.data); }
                                    else
                                    { Settings.Callback(); }
                                }
                            };
                        } else {
                            alert("error");
                        };
                    }

    }));


};



//定义监听事件
function EventDispatcher() {
    var This = ArcGISAPI;
    This.registeredData = {};
    EventDispatcher.prototype.addCustomEventHandler = function (type, handler) {
        if ((typeof type != "string")) {
            throw new Error("error event!!!");
        }
        if (!(typeof handler == "function")) {
            throw new Error("error method!!!");
        }
        if (This.registeredData[type] == null) {
            This.registeredData[type] = new Array();
        }
        try {
            if (This.registeredData[type].indexOf(handler) == -1) {
                This.registeredData[type].push(handler);
                This.registeredData[type].handler = handler;
            }
        } catch (e) { //IE8及以下的版本不支持indexOf方法
            var len = This.registeredData[type].length;
            if (len == 0) {
                This.registeredData[type].push(handler);
            }
            for (var i = 0; i < len; i++) {
                if (This.registeredData[type][i] === handler) {
                    This.registeredData[type].push(handler);
                    This.registeredData[type].handler = handler;
                    break;
                }
            };
        }
    };
    EventDispatcher.prototype.removeCustomEventHandler = function (type, handler) {
        if ((typeof type != "string")) {
            throw new Error("error event!!!");
        }
        //        if (!(typeof handler == "function")) {
        //            throw new Error("error method!!!");
        //        }
        var handlers = This.registeredData[type];
        var index;
        try {
            if ((index = handlers.indexOf(handlers.handler)) != -1) {
                handlers.splice(index, 1);
            }
        } catch (e) { //IE8及以下的版本不支持indexOf方法
            for (var i = 0,
            len = handlers.length; i < len; i++) {
                if (handlers[i] === handler) {
                    handlers.splice(i, 1);
                }
            };
        }
        if (This.registeredData[type].length == 0) This.registeredData[type] = null;
    };
    EventDispatcher.prototype.dispatchCustomEvent = function (evt) {
        if (!(evt instanceof BaseEvent)) {
            throw new Error("error event!!!");
        }
        if (This.registeredData[evt.type] != null) {
            for (var i = 0,
            len = This.registeredData[evt.type].length; i < len; i++) {
                This.registeredData[evt.type][i](evt);
            };
        }
    };
    EventDispatcher.prototype.dispose = function () {
        for (var arr in registeredData) {
            while (arr.length != 0) {
                arr.shift();
            }
        };
        registeredData = null;
    };
}
//监听事件基类
function BaseEvent(type, data) {
    var This = this;
    This.type = type; //String
    This.data = data; //Object
    function Constructor() {
    }
    Constructor();
}


//用户DrawEnd操作后
function DrawAddToMap(geometry) {
    ArcGIS_Toolbars.deactivate();
    isValited = true;
    ArcGIS_Map.showZoomSlider();
    switch (geometry.type) {
        case "point":
            var symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE, 10, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 1), new dojo.Color([0, 255, 0, 0.25]));
            break;
        case "polyline":
            var symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 0, 0]), 2);
            break;
        case "polygon":
            var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 0, 0.25]));
            break;
        case "extent":
            var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 0, 0.25]));
            break;
        case "multipoint":
            var symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_DIAMOND, 20, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0]), 1), new dojo.Color([255, 255, 0, 0.5]));
            break;
    };
    geometry.GUID = fw.guid();
    var graphic = new esri.Graphic(geometry, symbol);
    m_DrawLastGeometry = geometry;
    m_DrawLayer.add(graphic);
    m_CaclDistancegeometry = geometry;

    //lengths(lengthsParameter, callback?, errback?)

    if (!fw.fwObject.FWObjectHelper.hasValue(ArcGIS_Toolbars.DrawSettings)) {
        return;
    };
    var Settings = ArcGIS_Toolbars.DrawSettings;
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.CalcLength)
        && Settings.CalcLength == "1") {

        if (!fw.fwObject.FWObjectHelper.hasValue(m_GeometryService))
            return;
        switch (geometry.type) {
            case "point":
                if ($.isFunction(Settings.onCompletedEvent)) {
                    var data = {};
                    data.geometry = geometry;
                    data.ToolName = Settings.ToolName;
                    data.ResultText = "经度:" + dojo.number.format(geometry.x, { places: 6 }) + "\n纬度:" + dojo.number.format(geometry.y, { places: 6 }); // GetMeasureTextResult(geometry, distance);

                    if (fw.fwObject.FWObjectHelper.hasValue(Settings.ShowText) && Settings.ShowText) {
                        ShowTextMap(geometry, data.ResultText);
                    }
                    Settings.onCompletedEvent(data, graphic);
                }
                break;
            case "polyline":
                var lengthParams = new esri.tasks.LengthsParameters();
                lengthParams.polylines = [geometry];
                lengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_KILOMETER;
                lengthParams.geodesic = true;
                m_GeometryService.lengths(lengthParams, function (distance) {
                    // GetLastPoint(geometry, distance);
                    if ($.isFunction(Settings.onCompletedEvent)) {
                        var data = {};
                        data.geometry = geometry;
                        data.ToolName = Settings.ToolName;
                        data.ResultText = GetMeasureTextResult(geometry, distance);
                        if (fw.fwObject.FWObjectHelper.hasValue(Settings.ShowText) && Settings.ShowText) {
                            var iindex = geometry.paths[geometry.paths.length - 1].length / 2;
                            var mappoint = geometry.getPoint(0, iindex - 1);
                            ShowTextMap(mappoint, data.ResultText);
                        }
                        Settings.onCompletedEvent(data);
                    };
                });
                break;
            case "polygon":
                var areasAndLengthParams = new esri.tasks.AreasAndLengthsParameters();
                areasAndLengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_KILOMETER;
                areasAndLengthParams.areaUnit = esri.tasks.GeometryService.UNIT_SQUARE_KILOMETERS;
                //   areasAndLengthParams.calculationType = "planar";

                var outSR = new esri.SpatialReference({ wkid: 102113 });
                m_GeometryService.project([geometry], outSR, function (outgeometry) {

                    m_GeometryService.simplify(outgeometry, function (simplifiedGeometries) {
                        areasAndLengthParams.polygons = simplifiedGeometries;
                        m_GeometryService.areasAndLengths(areasAndLengthParams, function (result) {
                            if ($.isFunction(Settings.onCompletedEvent)) {
                                var data = {};
                                data.geometry = geometry;
                                data.ToolName = Settings.ToolName;
                                data.ResultText = GetMeasureTextResult(geometry, result);
                                if (fw.fwObject.FWObjectHelper.hasValue(Settings.ShowText) && Settings.ShowText) {
                                    var mappoint = API.ArcGISAPI.getPolygonCenter(geometry);
                                    ShowTextMap(mappoint, data.ResultText);
                                }
                                Settings.onCompletedEvent(data);

                            };
                        });

                    });
                }, function (err) {
                });
                break;
        };
        return;

    };
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.CalcLength)
        && Settings.CalcLength == "2") {
        if ($.isFunction(Settings.onCompletedEvent)) {
            var data = {};
            data.ResultText = [];
            data.geometry = geometry;
            for (var i = 0; i < geometry.paths[0].length; i++) {
                data.ResultText.push(dojo.number.format(geometry.paths[0][i][0], { places: 6 }) + "," + dojo.number.format(geometry.paths[0][i][1], { places: 6 }));
            }
            //ShowTextMap(geometry, data.ResultText);
            Settings.onCompletedEvent(data);
        }
        return;

    }
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.ReturnGeometry)
    && Settings.ReturnGeometry == "1") {
        if ($.isFunction(Settings.onCompletedEvent)) {
            var data = {};
            data.geometry = geometry;
            data.ToolName = Settings.ToolName;
            Settings.onCompletedEvent(data);
        };
        return;
    };
    var BusinessLayer = null;
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.LayerServicesUrl)) {
        BusinessLayer = new esri.layers.FeatureLayer(LayerServicesUrl, {
            mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
            showAttribution: showLayeAttribution,
            opacity: 0.8,
            outFields: ["*"]
        });
    } else {
        if (!fw.fwObject.FWObjectHelper.hasValue(Settings.BusinessLayerTypeCode)) {
            return;
        };
        BusinessLayer = ArcGISAPI.getOrCreateLayer({ LayerName: "Business_" + Settings.BusinessLayerTypeCode });
    };

    dojo.connect(BusinessLayer, "onSelectionComplete", function (features) {
        if ($.isFunction(ArcGIS_Toolbars.DrawSettings.onCompletedEvent)) {
            ArcGIS_Toolbars.DrawSettings.onCompletedEvent(features);
        };
    });

    if (BusinessLayer.declaredClass == "esri.layers.FeatureLayer") {
        var selectQuery = new esri.tasks.Query();
        selectQuery.geometry = geometry;
        BusinessLayer.selectFeatures(selectQuery, esri.layers.FeatureLayer.SELECTION_NEW);


    } else {
        var graphics = BusinessLayer.graphics;
        var bFrist = true;
        var features = [];
        for (var i = 0; i < graphics.length; i++) {
            if (geometry.contains(graphics[i].geometry)) {
                features.push(graphics[i]);
            };
        };
        if ($.isFunction(ArcGIS_Toolbars.DrawSettings.onCompletedEvent)) {
            ArcGIS_Toolbars.DrawSettings.onCompletedEvent(features);
        };
    };
    /*
    dojo.connect(selectionToolbar, "onDrawEnd", function (geometry) {
    selectionToolbar.deactivate();
    selectQuery.geometry = geometry;
    featureLayer.selectFeatures(selectQuery, esri.layers.FeatureLayer.SELECTION_NEW);
    }); */
    isValited = true;
};
function ShowTextMap(mapPoint, ShowText) {
    var TextJosn = {
        "type": "esriTS",
        "color": [0, 0, 0, 255],
        "backgroundColor": [246, 255, 197, 255],
        "borderLineColor": null,
        "verticalAlignment": "center",
        "horizontalAlignment": "left",
        "rightToLeft": false,
        "angle": 0,
        "xoffset": 0,
        "yoffset": 15,
        "text": ShowText,
        "font": {
          //  "family": "黑体",
            "size": "12pt",
            "style": "normal",
            "weight": "bold",
            "decoration": "none"
        }
    };
    var graphic = new esri.Graphic(mapPoint, new esri.symbol.TextSymbol(TextJosn));
    m_DrawLayer.add(graphic);
};
function GetMeasureTextResult(geometry, result) {

    var sResText = "";
    switch (geometry.type) {
        case "polyline":
            var iLength = geometry.paths.length;
            if (iLength > 0) {
                var iCount = geometry.paths[iLength - 1].length;
                // mapPoint = new esri.geometry.Point(geometry.paths[iLength - 1][iCount - 1][0], geometry.paths[iLength - 1][iCount - 1][1]);
                sResText = "总长:" + dojo.number.format(result.lengths[0], { places: 2 }) + "千米";
            };
            break;
        case "polygon":
            //dojo.byId("area").innerHTML = result.areas[0].toFixed(3) + " acres";
            //dojo.byId("length").innerHTML = result.lengths[0].toFixed(3) + " feet";
            //geometry.rings[0][22][1]
            var iLength = geometry.rings.length;
            if (iLength > 0) {

                // sResText = "周长:" + dojo.number.format(result.lengths[0], { places: 2 }) + "千米";
                // sResText += "\n面积：" + dojo.number.format(result.areas[0], { places: 2 }) + "平方千米";
                sResText = "周长:" + result.lengths[0].ToString("0.00") + "千米";
                sResText += "\n面积：" + result.areas[0].ToString("0.00") + "平方千米";
            };
            break;

    };
    return sResText;
};
function GetLastPoint(geometry, result) {

    var mapPoint = null;
    var sShowText = "";
    var iWidth = 60;
    var iHeight = 30;
    switch (geometry.type) {
        case "polyline":
            var iLength = geometry.paths.length;
            if (iLength > 0) {
                var iCount = geometry.paths[iLength - 1].length;
                mapPoint = new esri.geometry.Point(geometry.paths[iLength - 1][iCount - 1][0], geometry.paths[iLength - 1][iCount - 1][1]);
                sShowText = "总长:" + dojo.number.format(result.lengths[0], { places: 2 }) + "千米";
            };
            break;
        case "polygon":
            //dojo.byId("area").innerHTML = result.areas[0].toFixed(3) + " acres";
            //dojo.byId("length").innerHTML = result.lengths[0].toFixed(3) + " feet";
            //geometry.rings[0][22][1]
            var iLength = geometry.rings.length;
            if (iLength > 0) {
                var iCount = geometry.rings[iLength - 1].length;
                mapPoint = new esri.geometry.Point(geometry.rings[iLength - 1][iCount - 1][0], geometry.rings[iLength - 1][iCount - 1][1]);
                sShowText = "长度:" + dojo.number.format(result.lengths[0], { places: 2 }) + "千米";
                sShowText += "\n面积：" + dojo.number.format(result.areas[0], { places: 2 }) + "平方千米";
                iHeight = 50;
            };
            break;

    };
    //    if (mapPoint != null) {
    //        mapPoint.GUID = geometry.GUID;

    //        var sUrl = "../../Styles/Images/ColorNumberImage.ashx?Color=" + encodeURIComponent("#008000")
    //                + "&Text=" + encodeURIComponent(sShowText);
    //        m_DrawLayer.add(new esri.Graphic(mapPoint, new esri.symbol.PictureMarkerSymbol({
    //            "url": sUrl,
    //            "height": iHeight,
    //            "width": iWidth
    //        }).setOffset(0, 0)));
    //        //        m_DrawLayer.add(new esri.Graphic(mapPoint, new esri.symbol.TextSymbol(sShowText).setOffset(0, 5).setColor(
    //        //        new dojo.Color([255, 255, 255])).setFont(new esri.symbol.Font("12px"))));
    //        /// <reference path="../../../Maps/Images/3D1.png" />


    //        m_DrawCloseLayer.add(new esri.Graphic(mapPoint, new esri.symbol.PictureMarkerSymbol({
    //            "url": "../Images/nav_decline.png",
    //            "height": 16,
    //            "width": 16,
    //            "type": "esriPMS"
    //        }).setOffset(0, -iHeight)));
    //    }
    //    var textSymbol = new esri.symbol.TextSymbol("距离").setColor(
    //    new dojo.Color([128, 0, 0])).setAlign(esri.symbol.Font.ALIGN_START).setAngle(45).setFont(
    //    new esri.symbol.Font("12pt").setWeight(esri.symbol.Font.WEIGHT_BOLD));
};
function m_DrawCloseLayer_onClick(evt) {
    if (!fw.fwObject.FWObjectHelper.hasValue(evt.graphic.geometry.GUID)) {
        m_DrawCloseLayer.remove(evt.graphic);
        return;
    };
    var sGUID = evt.graphic.geometry.GUID;
    var graphics = m_DrawLayer.graphics;

    for (var i = graphics.length - 1; i >= 0; i--) {
        if (fw.fwObject.FWObjectHelper.hasValue(graphics[i].geometry.GUID)
        && graphics[i].geometry.GUID == sGUID) {
            m_DrawLayer.remove(graphics[i]);
        };
    };
    m_DrawCloseLayer.remove(evt.graphic);
};


function GetBusinessType(BusinessTypeCode) {
    var Entity = null;
    if (BusinessTypeCode != undefined && BusinessTypeCode != null) {
        if (Skyline_BusinessTypeArray == undefined) {
            var Data = {
                Ticket: $.page.ticket
            };
            $.ajax({
                async: false
                    , url: $.page.webSiteRootUrl + "Service/Skyline/JsonService__Skyline.svc/Json/Search__BusinessTypeAllList"
                    , data: jExtension.JsonToSubmitString(Data)
                    , success: function (ResultData) {
                        if (ResultData.Status == 1) {
                            Skyline_BusinessTypeArray = ResultData.Data == null ? [] : ResultData.Data;
                            if (Skyline_BusinessTypeArray != null) {
                                for (var i = 0; i < Skyline_BusinessTypeArray.length; i++) {
                                    Skyline_DynamicElementLocation[Skyline_BusinessTypeArray[i].BusinessTypeCode + "Location"] = [];
                                };
                            };
                        } else {
                            Skyline_BusinessTypeArray = null;
                        };
                    }
            });
        };
        if (Skyline_BusinessTypeArray != null) {
            for (var i = 0; i < Skyline_BusinessTypeArray.length; i++) {
                if (Skyline_BusinessTypeArray[i].BusinessTypeCode == BusinessTypeCode) {
                    Entity = Skyline_BusinessTypeArray[i];
                    break;
                };
            };
        };
    };
    return Entity;
};






//获取当前Url绝对路径
function GetAbsoluteUrl(Url, webSiteRootUrl) {
    if (Url != undefined && Url != null) {
        if (Url.toString().toLowerCase().indexOf("http") > -1) {
        } else {
            Url = webSiteRootUrl + Url;
        };
    };
    return Url;
};
function ExtentChangeShow(Properties) {
    var Settings = {
        BusinessLayer: "",
        WhereArray: [],
        IsExtentChange: false
    };
    $.extend(Settings, Properties);
    if (CFExtentHandle)
    { dojo.disconnect(CFExtentHandle); }
    if (Settings.IsExtentChange) {
        CFExtentHandle = dojo.connect(ArcGIS_Map, "onExtentChange", function (evt) {
            if (ArcGIS_Map.getLevel() > 5 && ArcGIS_Map.getLevel() < 8) {
                Settings.BusinessLayer.setDefinitionExpression(Settings.WhereArray[0]);
            }
            else if (ArcGIS_Map.getLevel() > 7 && ArcGIS_Map.getLevel() < 9) {
                Settings.BusinessLayer.setDefinitionExpression(Settings.WhereArray[1]);
            }
            else if (ArcGIS_Map.getLevel() > 8 && ArcGIS_Map.getLevel() < 10) {
                Settings.BusinessLayer.setDefinitionExpression(Settings.WhereArray[2]);
            }
            else if (ArcGIS_Map.getLevel() > 9 && ArcGIS_Map.getLevel() < 11) {
                Settings.BusinessLayer.setDefinitionExpression(Settings.WhereArray[3]);
            }
            else if (ArcGIS_Map.getLevel() > 10 && ArcGIS_Map.getLevel() < 12) {
                Settings.BusinessLayer.setDefinitionExpression(Settings.WhereArray[4]);
            }
            else if (ArcGIS_Map.getLevel() > 11 && ArcGIS_Map.getLevel() < 13) {
                Settings.BusinessLayer.setDefinitionExpression(Settings.WhereArray[5]);
            }
            else if (ArcGIS_Map.getLevel() > 12) {
                Settings.BusinessLayer.setDefinitionExpression(Settings.WhereArray[6]);
            }
        });
    }
    else {
        Settings.BusinessLayer.setDefinitionExpression(Settings.WhereArray[0]);
    }
}



//根据图层级别更改统计图大小
function ExtentChangeSize(IsChangeSize) {
    var divSize = { width: 128,
        height: 128
    };
    if (IsChangeSize) {
        ExtentChangeSizeHandle = dojo.connect(ArcGIS_Map, "onExtentChange", function (evt) {
            if (ArcGIS_Map.getLevel() > 5 && ArcGIS_Map.getLevel() < 8) {
                divSize.width = 128;
                divSize.height = 128;
                AddPieChart(divSize);
            }
            else if (ArcGIS_Map.getLevel() > 7 && ArcGIS_Map.getLevel() < 9) {
                divSize.width = 148;
                divSize.height = 148;
                AddPieChart(divSize);
            }
            else if (ArcGIS_Map.getLevel() > 8 && ArcGIS_Map.getLevel() < 10) {
                divSize.width = 168;
                divSize.height = 168;
                AddPieChart(divSize);
            }
            else if (ArcGIS_Map.getLevel() > 9 && ArcGIS_Map.getLevel() < 11) {
                divSize.width = 188;
                divSize.height = 188;
                AddPieChart(divSize);
            }
            else if (ArcGIS_Map.getLevel() > 10 && ArcGIS_Map.getLevel() < 12) {
                divSize.width = 208;
                divSize.height = 208;
                AddPieChart(divSize);
            }
            else if (ArcGIS_Map.getLevel() > 11 && ArcGIS_Map.getLevel() < 13) {
                divSize.width = 228;
                divSize.height = 228;
                AddPieChart(divSize);
            }
            else if (ArcGIS_Map.getLevel() > 12) {
                divSize.width = 248;
                divSize.height = 248;
                AddPieChart(divSize);
            }
        });
    }
}
function AddPieChart(divSize) {
    $(".divSymbol").width(divSize.width).height(divSize.height);
}


function ShowTextLayerSys(ShowText) {
    var pointsys = null;


    var pointsys = new esri.symbol.TextSymbol(TextJosn);
    return pointsys;
};


//by MHQ
//获取基本注记符号
function GetDefaultSymbolByName(name, settings) {
    var symbol = null;
    switch (name) {
        case SymbolNames.Point:
            symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE, 10, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color("#000000"), 1), new dojo.Color([0, 255, 0, 1]));
            break;
        case SymbolNames.Point_Picture:
            if (fw.fwObject.FWObjectHelper.hasValue(settings)) {
                symbol = new esri.symbol.PictureMarkerSymbol(settings.image, settings.width, settings.height);
            }
            ;
            break;
        case SymbolNames.Point_Text:
            if (fw.fwObject.FWObjectHelper.hasValue(settings)) {
                var TextJosn = {
                    "type": "esriTS",
                    "color": [0, 0, 0, 255],
                    "backgroundColor": [246, 255, 197, 255],
                    "borderLineColor": null,
                    "verticalAlignment": "center",
                    "horizontalAlignment": "left",
                    "rightToLeft": false,
                    "angle": 0,
                    "xoffset": 0,
                    "yoffset": 15,
                    "text": "",
                    "font": {
                        "family": "宋体",
                        "size": "12pt",
                        "style": "normal",
                        "weight": "bold",
                        "decoration": "none"
                    }
                };
                $.extend(TextJosn, settings);
                symbol = new esri.symbol.TextSymbol(TextJosn);
            }
            ;
            break;
        case SymbolNames.Point_CheckPoint:
            if (fw.fwObject.FWObjectHelper.hasValue(settings)) {
                symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE, 12, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color("#000000"), 1), new dojo.Color(settings.fillColor));
            };
            break;
        case SymbolNames.Point_Size: //重点企业污染源点
            if (fw.fwObject.FWObjectHelper.hasValue(settings)) {
                symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, settings.size, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 255, 0, 0.5]), 1), new dojo.Color(settings.fillColor));
            };
            break;
        case SymbolNames.Point_Size_Highlighte: //重点企业污染源点高亮
            if (fw.fwObject.FWObjectHelper.hasValue(settings)) {
                symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, settings.size, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 255, 0, 0.5]), 1), new dojo.Color([255, 244, 91, 1]));
            }
            break;
        case SymbolNames.Polyline:
            if (fw.fwObject.FWObjectHelper.hasValue(settings)) {
                symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color(settings.lineColor), settings.borderWidth);
            } else {
                symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 255, 90]), 2);
            }
            ;
            break;
        //网格             
        case SymbolNames.Polyline_WG:
            symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 1);
            break;
        case SymbolNames.Polyline_Highlighte:
            symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color("#ffff00"), 3), new dojo.Color([255, 244, 91, 0]));
            break;
        case SymbolNames.Polygon:
            //STYLE_DASHDOT----虚线
            if (fw.fwObject.FWObjectHelper.hasValue(settings)) {
                symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color(settings.lineColor), settings.borderWidth), new dojo.Color(settings.fillColor));
            } else {
                symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color("#6b6d6b"), 1), new dojo.Color([255, 255, 0, 0]));
            }
            ;
            break;
        case SymbolNames.Polygon_Highlighte:
            symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color("#6BDEFC"), 3), new dojo.Color([255, 244, 91, 0.5]));
            break;
        case SymbolNames.Polygon_SJKFQ:
            symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color("#FFFF00"), 1), new dojo.Color([213, 243, 4, 0.8]));
            break;
        case SymbolNames.Polygon_Canton:
            symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_NULL,
                    new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                        new dojo.Color([255, 255, 0, 0.9]), 3));
            break;
    };
    return symbol;
};



//function AddGraphic(id) {
//    ClearGraphic();
//    var _x = 120.742156;
//    var _y = 31.636646;
//    var DataList = [
//                    { X: _x + 0.005 * id, Y: _y + 0.005 * id, Name: "污水处理设施", Status: "通讯故障",
//                        Image: $.page.webSiteRootUrl + 'Web/maps/Images/symbols/污水处理设施' + (id - 1) + '.png'
//                    }];
//    var graphicSetting = {
//        LayerName: "处理设施",
//        GraphicList: DataList,
//        Symbol_W: 30,
//        Symbol_H: 30,
//        onClickEvent: function (evt) {
//            infoEvent2(evt.graphic);
//        }
//    };
//    API.ArcGISAPI.businessLayerShow(graphicSetting);
//    var infoEvent2 = function (graphic) {
//        var divJQ = null;
//        var Width = 300;
//        var divJQ = $("<div class=\"divMapInfoWindowContent\"></div>").width(Width).appendTo("body");
//        var divInfoJQ = $("<div class=\"divInfo\"></div>").appendTo(divJQ);
//        var BodyHtml = "", TableHtml = "";
//        BodyHtml += "<table><tr><td>设施编号:  32058101400</td><td>状态：正常</td></tr>";
//        BodyHtml += "<tr><td>安装地点：董浜镇 新民村</td><td><div id='divDetailInfo' class=\"divDetailInfo\" style='margin:5px;'></div></td></tr></table>";
//        $(BodyHtml).appendTo(divInfoJQ);
//        var divDetailInfoJQ = $(".divDetailInfo");
//        divDetailInfoJQ.click(function () {
//            mini.open({
//                url: window.webSiteRootUrl + "web/basicInfo/monitorSiteDetail.htm",
//                title: ("设施点位详情信息"), width: 1000, height: 500,
//                showMaxButton: true,     //显示最大化按钮
//                showModal: false       //显示遮罩
//            });
//        });
//        var Settings2 = {
//            Title: "梅李镇污水处理设施-" + id,
//            domNode: divJQ[0],
//            Width: divJQ.outerWidth() + 20,
//            Height: divJQ.outerHeight() + 10,
//            evt: graphic
//        };
//        API.ArcGISAPI.mapInfoWindowShow(Settings2);
//    };
//    var layer = API.ArcGISAPI.getOrCreateLayer({ LayerName: "Business_处理设施" });
//    var g = layer.graphics[0];
//    infoEvent2(g);
//};
//function ClearGraphic() {
//    API.ArcGISAPI.mapInfoWindowHide();
//    API.ArcGISAPI.businessLayerRemove({ LayerName: "处理设施" });
//}