ArcGIS_webSiteRootUrl = '';                                    //站点根路径  例如http://www.google.com/ArcGIS/
var ArcGIS_MapWindow = window;                                     //ArcGIS地图窗口
var ArcGIS_Map = null;                                             //操作地球
var ArcGIS_Token = null; //用户权限
var ArcGIS_MapJS = null; //没用
var ArcGIS_MapJQ = null; //没用
var ArcGIS_DivLayersJQ = null; //没用
var ArcGIS_Toolbars = null;                                        //地图工具
var ArcGIS_Geometry = null;                                        //地图几何对象
var ArcGIS_Draw = null;                                            //画图对象
var ArcGIS_MapDivID = "map";                                       //地图标签ID
var ArcGIS_MapFullExtent = undefined;                              //地图全图Position
var ArcGIS_MapScale = 999999999;                                   //地图比例尺
var ArcGIS_MapCoordinateTypeCode = "10";                           //地图坐标类型编码
var ArcGIS_PointCoordinateTypeCode = "10";                         //地图坐标类型编码

var ArcGIS_BusinessTypeArray = undefined;                          //业务对象数组
var ArcGIS_DynamicElementLoadFinished = function () { };           //动态元素加载成功事件
var ArcGIS_DynamicElementLayer = {};                               //动态元素图层对象
var ArcGIS_DynamicElementLocation = {};                            //动态元素中导航对象

var ArcGIS_FlashNodeArray = null;                                  //闪烁节点数组
var ArcGIS_FlashNodeFunction = null;                               //节点的闪烁事件

var ArcGIS_Left = null;
var ArcGIS_Top = null;
var ArcGIS_Right = null;
var ArcGIS_Bottom = null;
var ArcGIS_X = null;
var ArcGIS_Y = null;

var ArcGIS_Action = '00';                                         //01-沿路径飞行(0100-纯粹飞行 0101-带搜索周边信息的飞行)
var ArcGIS_LastPosition = null;                                   //是否停止地图上所有动作 （闪烁,飞行）
var ArcGIS_LastActionDateTime = new Date();                       //最后一次操作时间
var ArcGIS_LastSynchronizationDateTime = new Date();              //是否停止地图上所有动作 （闪烁,飞行）
var ArcGIS_SecondsBetweenSynchronization = 2;                     //是否停止地图上所有动作 （闪烁,飞行）
var ArcGIS_IsPause = false;                                       //是否停止地图上所有动作 （闪烁,飞行）

var ArcGIS_Plane_SearchDistance = 1000;                           //飞行搜索范围
var ArcGIS_Plane_DynamicNode = null;                              //当前飞行的路径对象
var ArcGIS_Plane_DynamicNodeCopy = null;                          //当前飞行的路径对象
var ArcGIS_Plane_StopWaypoint = 0;                                //飞机停在的路径点
var ArcGIS_Plane_CurrentWaypoint = 0;                             //飞机最后一次经过的点
var ArcGIS_Plane_StopCount = 0;                                   //飞机暂停次数
var ArcGIS_Plane_SettingWindow = null;                            //当前飞行的路径对象
var ArcGIS_Plane_ArriveWaypointFunction = null;                            //当前飞行的路径对象

var ArcGIS_Route_VideoStatus = 0;                                 //0-Stop 1-Play 2-Pause
var ArcGIS_Route_VideoObject = null;                              //当前飞行的路径对象

var ArcGIS_PI = Math.PI;                                          //圆周率
var ArcGIS_EARTH_RADIUS = 6378137.0;                              //取WGS84标准参考椭球中的地球长半径(单位:m)
var ArcGIS_LatitudeDistance = 110.94;                             //纬度没度之间相距110.94公里;

var m_FalshLayer = null;   //闪烁图层
var m_DrawLayer = null;     //画图图层
var m_DrawCloseLayer = null; //没用
var m_RasterLayer = null;
var m_NavToolbar = null;
var m_GeometryService = null;
var m_ChangeExtent = null;
var DrawByGeometryLayer = null;
var CFExtentHandle = null;
var IsExtentChange = false;
var ExtentChangeSizeHandle = null;
var ArrowCurveLayer = null;
var ArrowToPointLayer = null;
var ArrowPolygonLayer = null;
var CantonLayer = null;
var BufferLayer = null;
var ZoomToLayer = null;
var mapInfoWindowResize = null;
var TextLayer = null;
var LocatePointLayer = null;
var addPointAndzoomToLayer = null;
var isValited = true, isValited2 = true;
//没用
var TreeViewSettings = {
    NodeEvent: false,
    NodeUnique: false,
    IsCloseAll: false,
    IsShowFile: false
};
var cL = null; //聚类图层
var distpatcher = null;
var resizeTimer = null; //改变大小时间变量

var ArcGISAPI = {
    // ArcGIS是否加载完成
    IsArcGISLoaded: false
    // ArcGIS所在的窗口
    ,
    ArcGISWindow: ArcGIS_MapWindow
    //ArcGIS地图对象
    ,
    ArcGISMap: ArcGIS_Map,
    //ArcGIS地图初始范围和坐标系
    DefaultData: {
        Extent_JS_1984: {
            XMin: 71.5869140625,
            YMin: 17.578125,
            XMax: 141.7236328125,
            YMax: 52.7783203125,
            wkid: GWkid
        },
        Renderer_XZQ: {
            "type": "simple",
            "symbol":
            {
                "type": "esriSFS",
                "style": "esriSFSNull",
                "color": [
                    235,
                    208,
                    247,
                    255
                ],
                "outline":
                {
                    "type": "esriSLS",
                    "style": "esriSLSSolid",
                    "color": [
                        255,
                        255,
                        0,
                        255
                    ],
                    "width": 3
                }
            },
            "label": "",
            "description": ""
        },
        MapService_JS: "http://58.210.204.106:10053/arcgis/rest/services/%E5%9B%BA%E5%BA%9F/JSCanton/MapServer/0",
        MapService_JS_City: "http://58.210.204.106:10053/arcgis/rest/services/%E5%9B%BA%E5%BA%9F/JSCanton/MapServer/0",
        MapService_JS_Area: "http://58.210.204.106:10053/arcgis/rest/services/%E5%9B%BA%E5%BA%9F/JSCanton/MapServer/0"
    }
    ,
    MapLevel: 0
    ,
    //空间查询类别
    SpatialRel: {
        //        CONTAINS: esri.tasks.Query.SPATIAL_REL_CONTAINS, //几何对象 A 空间包含几何对象 B
        //        INTERSECTS: esri.tasks.Query.SPATIAL_REL_INTERSECTS //几何对象 A的部分位于几何对象 B之中
    },
    //初始化地图容器
    initMap: function (Properties) {
        var Settings = {
            displayGraphicsOnPan: true//地图拖动时图形是否移动
            , DefaultExtent: {//初始化范围
                XMin: 0,
                YMin: 0,
                XMax: 0,
                YMax: 0,
                wkid: 0
            }
            , logo: false//是否显示Esri Logo
            , slider: false//是否显示水平级别
            , onLoaded: function (evt) {//完成加载后触发事件
            }
            , GeometryServiceUrl: ""//几何服务地址

        };
        $.extend(Settings, Properties);
        var options = {};

        if (fw.fwObject.FWObjectHelper.hasValue(Settings.DefaultExtent)) {
            if (Settings.DefaultExtent.XMin != 0 && Settings.DefaultExtent.YMin != 0 && Settings.DefaultExtent.XMax != 0
                && Settings.DefaultExtent.YMax != 0 && Settings.DefaultExtent.wkid != 0) {
                options.extent = new esri.geometry.Extent(Settings.DefaultExtent.XMin, Settings.DefaultExtent.YMin, Settings.DefaultExtent.XMax, Settings.DefaultExtent.YMax, esri.SpatialReference({ wkid: Settings.DefaultExtent.wkid }));
                ArcGIS_MapFullExtent = options.extent;
            }
        }
        options.logo = Settings.logo;
        options.slider = Settings.slider;
        ArcGIS_Map = new esri.Map(ArcGIS_MapDivID, options);
        ArcGIS_Map.enableScrollWheelZoom();
        if (fw.fwObject.FWObjectHelper.hasValue(Settings.GeometryServiceUrl)) {
            //esri.config.defaults.io.proxyUrl = "../FrameWork/proxy.ashx";
            esri.config.defaults.io.proxyUrl = $.page.webSiteRootUrl + "resources/Maps/ArcGIS/FrameWork/proxy.ashx";
            esri.config.defaults.io.alwaysUseProxy = false;
            esri.config.defaults.io.corsDetection = false;
            /// <reference path="../FrameWork/proxy.ashx" />
            m_GeometryService = new esri.tasks.GeometryService(Settings.GeometryServiceUrl);
            //This service is for development and testing purposes only. We recommend that you create your own geometry service for use within your applications
            esri.config.defaults.geometryService = m_GeometryService;
            //dojo.connect(gsvc, "onLengthsComplete", outputDistance);
            //dojo.connect(gsvc, "onAreasAndLengthsComplete", outputAreaAndLength);
        };

        dojo.connect(ArcGIS_Map, "onExtentChange", function (extent) {
            //                var divJQ = $("<input id='txtExtent' style='z-index:88;bottom:0px;position:absolute;' />").appendTo("body");
            //                divJQ.val(ArcGIS_Map.getLevel()+"||"+extent.xmin + "," + extent.ymin + "," + extent.xmax + "," + extent.ymax);
            // alert(extent.xmin + "," + extent.ymin + "," + extent.xmax + "," + extent.ymax);
            ArcGISAPI.refreshDivLayers();
        });
        dojo.connect(ArcGIS_Map, "onLoad", function () {
            Settings.onLoaded(Settings.e);
        });
    },
    //定义监听事件对象
    arcGISDistpatcher: function () {
        if (!fw.fwObject.FWObjectHelper.hasValue(distpatcher)) {
            distpatcher = new EventDispatcher();
        }
        return distpatcher;
    }
    ,
    /**************************************************************************
    //基本操作
    ***************************************************************************/
    //==========坐标==========
    //获取点位屏幕坐标
    getPointAnchor: function (graphic) {
        var graphicCenterSP = esri.geometry.toScreenGeometry(ArcGIS_Map.extent, ArcGIS_Map.width, ArcGIS_Map.height, graphic.geometry);
        var vAnchar = ArcGIS_Map.getInfoWindowAnchor(graphicCenterSP);
        return {
            left: graphicCenterSP.x
            , top: graphicCenterSP.y
            , Anchar: vAnchar
        };
    }
    ,
    //获取线面的中心点位置
    getPolygonCenter: function (geometry) {
        var ext = geometry.getExtent();
        return ext.getCenter();
        //        var p0 = new esri.geometry.Point(ext.xmin, ext.ymin);
        //        var momentX = 0;
        //        var momentY = 0;
        //        var weight = 0;
        //        for (var i = 0; i < polygon.rings.length; i++) {
        //            var pts = polygon.rings[i];
        //            for (var j = 0; j < pts.length; j++) {
        //                var p1 = polygon.getPoint(i, j);
        //                var p2 = null;
        //                if (j == pts.length - 1) {
        //                    p2 = polygon.getPoint(i, 0);
        //                }
        //                else {
        //                    p2 = polygon.getPoint(i, j + 1);
        //                }
        //                var dWeight = (p1.x - p0.x) * (p2.y - p1.y)
        //                        - (p1.x - p0.x) * (p0.y - p1.y) / 2
        //                        - (p2.x - p0.x) * (p2.y - p0.y) / 2
        //                        - (p1.x - p2.x) * (p2.y - p1.y) / 2;
        //                weight += dWeight;
        //                var pTmp = new esri.geometry.Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
        //                var gravityX = p0.x + (pTmp.x - p0.x) * 2 / 3;
        //                var gravityY = p0.y + (pTmp.y - p0.y) * 2 / 3;
        //                momentX += gravityX * dWeight;
        //                momentY += gravityY * dWeight;
        //            }   
        //        }
        //        return new esri.geometry.Point(momentX / weight, momentY / weight); 
    }
    ,
    //获取线面的范围
    getPolygonExtent: function (geometry) {
        return geometry.getExtent();
    },
    //将坐标转换为JSON格式
    getLastDrawGeometryJson: function () {
        if (fw.fwObject.FWObjectHelper.hasValue(m_DrawLastGeometry)) {
            return m_DrawLastGeometry.toJson();
        } else {
            return null;
        };
    }
    ,
    //经纬度转墨卡托
    lonLat2Mercator: function (lonLat) {
        var mercator = new esri.geometry.Point();
        var x = lonLat.x * 20037508.34 / 180;
        var y = Math.log(Math.tan((90 + lonLat.y) * Math.PI / 360)) / (Math.PI / 180);
        y = y * 20037508.34 / 180;
        mercator.x = x;
        mercator.y = y;
        return mercator;
    },
    //墨卡托转经纬度
    mercator2lonLat: function (mercator) {
        var lonLat = new esri.geometry.Point();
        var x = mercator.x / 20037508.34 * 180;
        var y = mercator.y / 20037508.34 * 180;
        y = 180 / Math.PI * (2 * Math.atan(Math.exp(y * Math.PI / 180)) - Math.PI / 2);
        lonLat.x = x;
        lonLat.y = y;
        return lonLat;
    },
    //地图点位坐标转换 
    pointConvert: function (Properties) {
        var Settings = {
            MapCoordinateTypeCode: ArcGIS_MapCoordinateTypeCode,
            PointCoordinateTypeCode: ArcGIS_PointCoordinateTypeCode,
            Point: null,
            IsConvertBack: false
        };
        $.extend(Settings, Properties);

        var ReturnPoint = new esri.geometry.Point();

        if (!Settings.IsConvertBack) {
            switch (Settings.PointCoordinateTypeCode) {
                case "10":
                    switch (Settings.MapCoordinateTypeCode) {
                        //经纬度坐标                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                        case "10":
                            ReturnPoint = Settings.Point;
                            break;
                        //本地坐标                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                        case "11":
                            ReturnPoint.x = 64040.32998544183 + (Settings.Point.x - 120.72752) * 93738.28271471915;
                            ReturnPoint.y = 44977.098364279154 + (Settings.Point.y - 31.31432) * 110688.2947713095;
                            break;
                        //天地图坐标                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                        case "12":
                            ReturnPoint.x = -29.6177 + (Settings.Point.x - 120.76443) / 2;
                            ReturnPoint.y = 60.6311 + (Settings.Point.y - 31.26213) / 2;
                            break;
                    };
                    break;
                case "11":
                    switch (Settings.MapCoordinateTypeCode) {
                        //经纬度坐标                                                                                                                                                                                                                                                                                                                                                            
                        case "10":
                            ReturnPoint = Settings.Point;
                            break;
                        //本地坐标                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
                        case "11":
                            ReturnPoint = Settings.Point;
                            break;
                        //天地图坐标                                                                                                                                                                                                                                                                                                                                                              
                        case "12":
                            ReturnPoint = Settings.Point;
                            break;
                    };
                    break;
            };
        } else {
            switch (Settings.PointCoordinateTypeCode) {
                case "10":
                    switch (Settings.MapCoordinateTypeCode) {
                        //经纬度坐标                                                                                                                                                                                                                                                                                                                                                              
                        case "10":
                            ReturnPoint = Settings.Point;
                            break;
                        //本地坐标                                                                                                                                                                                                                                                                                                                                                      
                        case "11":
                            ReturnPoint.x = 120.72752 + (Settings.Point.x - 64040.32998544183) / 93738.28271471915;
                            ReturnPoint.y = 31.31432 + (Settings.Point.y - 44977.098364279154) / 110688.2947713095;
                            break;
                        //天地图坐标                                                                                                                                                                                                                                                                                                                                                             
                        case "12":
                            ReturnPoint.x = 120.76443 + (Settings.Point.x + 29.6177) * 2;
                            ReturnPoint.y = 31.26213 + (Settings.Point.y - 60.6311) * 2;
                            break;
                    };
                    break;
                case "11":
                    switch (Settings.MapCoordinateTypeCode) {
                        //经纬度坐标                                                                                                                                                                                                                                                                                                                                                       
                        case "10":
                            ReturnPoint = Settings.Point;
                            break;
                        //本地坐标                                                                                                                                                                                                                                                                                                                                                         
                        case "11":
                            ReturnPoint = Settings.Point;
                            break;
                        //天地图坐标                                                                                                                                                                                                                                                                                                                                                            
                        case "12":
                            ReturnPoint = Settings.Point;
                            break;
                    };
                    break;
            };
        };
        return ReturnPoint;
    },
    //ArcGIS地图范围坐标转换
    extentConvert: function (Properties) {
        var Settings = {
            MapCoordinateTypeCode: ArcGIS_MapCoordinateTypeCode//地理坐标代码
            , PointCoordinateTypeCode: ArcGIS_PointCoordinateTypeCode//平面坐标代码
            , Extent: null//范围
            , IsConvertBack: false//是否转换
        };
        $.extend(Settings, Properties); //没用

        var ReturnExtent = new esri.geometry.Extent();
        var PointMin = new esri.geometry.Point(Settings.Extent.xmin, Settings.Extent.ymin);
        var PointMax = new esri.geometry.Point(Settings.Extent.xmax, Settings.Extent.ymax);
        PointMin = ArcGISAPI.pointConvert({
            MapCoordinateTypeCode: Settings.MapCoordinateTypeCode,
            PointCoordinateTypeCode: Settings.PointCoordinateTypeCode,
            Point: PointMin,
            IsConvertBack: Settings.IsConvertBack
        });
        PointMax = ArcGISAPI.pointConvert({
            MapCoordinateTypeCode: Settings.MapCoordinateTypeCode,
            PointCoordinateTypeCode: Settings.PointCoordinateTypeCode,
            Point: PointMax,
            IsConvertBack: Settings.IsConvertBack
        });
        ReturnExtent.xmin = PointMin.x;
        ReturnExtent.ymin = PointMin.y;
        ReturnExtent.xmax = PointMax.x;
        ReturnExtent.ymax = PointMax.y;
        return ReturnExtent;
    }
    ,
    //获取当前屏幕地图范围


    getMapExtent: function (properties) {
        var settings = {
            onChangeEvent: function () {//地图范围改变触发事件
            }
        };
        $.extend(settings, properties);
        if ($.isFunction(settings.onChangeEvent)) {
            if (fw.fwObject.FWObjectHelper.hasValue(ArcGIS_Map.extentChangeHandler)) {
                dojo.disconnect(ArcGIS_Map.extentChangeHandler);
                ArcGIS_Map.extentChangeHandler = null;
            }
            var extentChangeHandler = dojo.connect(ArcGIS_Map, "onExtentChange", function () {
                var data = ArcGIS_Map.extent;
                settings.onChangeEvent(data);
            });
            ArcGIS_Map.extentChangeHandler = extentChangeHandler;
        };
    }
    //==========缩放与平移(定位)==========
    , addPointAndzoomToPoint: function (Properties) {
        var Settings = {
            attr: {}
            , posX: 0
            , posY: 0
            , LayerName: ""
            , zoomLevel: 10
            , reorderIndex: 2
            , symbolstate: ""
            , imageWidth: 36
            , imageHeight: 36
            , callback: function () { }
            , onMouseOverEvent: function (evt) {
                if (evt.graphic.geometry.type == "point" && fw.fwObject.FWObjectHelper.hasValue(evt.graphic.symbol) && fw.fwObject.FWObjectHelper.hasValue(evt.graphic.symbol.url)) {
                    var sys = new esri.symbol.PictureMarkerSymbol(evt.graphic.symbol.url, evt.graphic.symbol.width + 4, evt.graphic.symbol.height + 4);
                    evt.graphic.setSymbol(sys);
                };
                ArcGIS_Map.setMapCursor("pointer");
            }
            , onMouseOutEvent: function (evt) {
                if (evt.graphic.geometry.type == "point" && fw.fwObject.FWObjectHelper.hasValue(evt.graphic.symbol) && fw.fwObject.FWObjectHelper.hasValue(evt.graphic.symbol.url)) {
                    var sys = new esri.symbol.PictureMarkerSymbol(evt.graphic.symbol.url, evt.graphic.symbol.width - 4, evt.graphic.symbol.height - 4);
                    evt.graphic.setSymbol(sys);
                };
                ArcGIS_Map.setMapCursor("default");
            }
        };
        $.extend(Settings, Properties);
        var mapPoint = null, graphic = null;
        var symbol = new esri.symbol.PictureMarkerSymbol($.page.webSiteRootUrl + 'web/style/maps/images/pointImage/' + Settings.symbolstate + ".png", Settings.imageWidth, Settings.imageHeight);
        if (addPointAndzoomToLayer == null) {
            addPointAndzoomToLayer = ArcGISAPI.getOrCreateLayer({ LayerName: "Business_addPointAndzoomToLayer" });
        };
        ArcGIS_Map.reorderLayer("Business_addPointAndzoomToLayer", Settings.reorderIndex);
        addPointAndzoomToLayer.clear();
        addPointAndzoomToLayer.show();
        if (fw.fwObject.FWObjectHelper.hasValue(Settings.posX)
            && fw.fwObject.FWObjectHelper.hasValue(Settings.posY)
            && Settings.posX > 0 && Settings.posY > 0) {
            mapPoint = new esri.geometry.Point(Settings.posX, Settings.posY);
            graphic = new esri.Graphic(mapPoint, symbol, Settings.attr)
            addPointAndzoomToLayer.add(graphic);
        };

        if (fw.fwObject.FWObjectHelper.hasValue(Settings.zoomLevel)
            && Settings.zoomLevel > 0) {
            ArcGIS_Map.centerAndZoom(mapPoint, Settings.zoomLevel);
        };
        if ($.isFunction(Settings.callback)) {
            dojo.connect(addPointAndzoomToLayer, "onClick", Settings.callback)
        };
        if ($.isFunction(Settings.onMouseOverEvent)) {
            if (fw.fwObject.FWObjectHelper.hasValue(addPointAndzoomToLayer.mouseOverHandler)) {
                dojo.disconnect(addPointAndzoomToLayer.mouseOverHandler);
                addPointAndzoomToLayer.mouseOverHandler = null;
            };
            var mouseOverHandler = dojo.connect(addPointAndzoomToLayer, "onMouseOver", Settings.onMouseOverEvent);
            addPointAndzoomToLayer.mouseOverHandler = mouseOverHandler;
        }
        ;
        if ($.isFunction(Settings.onMouseOutEvent)) {
            if (fw.fwObject.FWObjectHelper.hasValue(addPointAndzoomToLayer.mouseOutHandler)) {
                dojo.disconnect(addPointAndzoomToLayer.mouseOutHandler);
                addPointAndzoomToLayer.mouseOutHandler = null;
            };
            var mouseOutHandler = dojo.connect(addPointAndzoomToLayer, "onMouseOut", Settings.onMouseOutEvent);
            addPointAndzoomToLayer.mouseOutHandler = mouseOutHandler;
        }
        ;
        addPointAndzoomToLayer.onClick({ graphic: graphic, preventDefault: function () { }, stopPropagation: function () { } });
    }



    //定位到某一个点
    ,zoomToPoint: function (Properties) {
        var Settings = {
            PosX: 0//经度X值，默认0，可选参数
            , PosY: 0//纬度Y值，默认0，可选参数
            , Geometry: null//图形地理位置对象
            , LayerName: ""//业务图层名称
            , LayerKeyFieldName: ""//图层关键字段名称
            , BusinessCode: ""//业务编码
            , ZoomScale: 0//缩放比例，默认0，可选参数
            , ZoomLevel: 13//缩放级别，默认0，可选参数
            , FlashTime: ""//动画时间，默认10000毫秒
            , bFlash: true//是否显示闪烁
            , flashSize: 40//闪烁图片大小
            , reorderIndex: 2//闪烁图层显示顺序
        };
$.extend(Settings, Properties);
var mapPoint = null;
var BusinessLayer = ArcGISAPI.getOrCreateLayer({ LayerName: "Business_" + Settings.LayerName });
if (!BusinessLayer.visible) {
    BusinessLayer.show();
};
var symbol = null;
if (Settings.bFlash) {
    if (m_FalshLayer == null) {
        m_FalshLayer = ArcGISAPI.getOrCreateLayer({ LayerName: "FalshLayer" });
        ArcGIS_Map.reorderLayer("FalshLayer", Settings.reorderIndex);
    }
    m_FalshLayer.clear();
    symbol = new esri.symbol.PictureMarkerSymbol($.page.webSiteRootUrl + 'resources/scripts/fw.map/themes/default/images/Location.gif', Settings.flashSize, Settings.flashSize);
    symbol.setOffset(-4, -10);
}
if (fw.fwObject.FWObjectHelper.hasValue(Settings.PosX)
    && fw.fwObject.FWObjectHelper.hasValue(Settings.PosY)) {
    mapPoint = new esri.geometry.Point(Settings.PosX, Settings.PosY);
    mapPoint.spatialReference = ArcGIS_Map.spatialReference;
    if (Settings.bFlash) {
        m_FalshLayer.add(new esri.Graphic(mapPoint, symbol));
    }
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.ZoomScale)
        && Settings.ZoomScale > 0) {
        ArcGIS_Map.setScale(Settings.ZoomScale);
        ArcGIS_Map.centerAt(mapPoint);
    }
    else {
        if (fw.fwObject.FWObjectHelper.hasValue(Settings.ZoomLevel)
            && Settings.ZoomLevel > 0) {
            setTimeout(function () { ArcGIS_Map.centerAndZoom(mapPoint, Settings.ZoomLevel); }, 300);
        }
        else {
            ArcGIS_Map.centerAt(mapPoint);
        }
        //ArcGIS_Map.setLevel(map_ZoomInitScale);
    }
    //ArcGIS_Map.centerAt(mapPoint);
}
else if (fw.fwObject.FWObjectHelper.hasValue(Settings.Geometry)) {
    var mapPoint = Settings.Geometry;
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.ZoomScale)
        && Settings.ZoomScale > 0) {
        ArcGIS_Map.setScale(Settings.ZoomScale);
        ArcGIS_Map.centerAt(mapPoint);
    }
    else {
        if (fw.fwObject.FWObjectHelper.hasValue(Settings.ZoomLevel)
            && Settings.ZoomLevel > 0) {
            setTimeout(function () { ArcGIS_Map.centerAndZoom(mapPoint, Settings.ZoomLevel); }, 300);
        }
        else {
            ArcGIS_Map.centerAt(mapPoint);
        }
    };
} else {
    if (!fw.fwObject.FWObjectHelper.hasValue(Settings.BusinessCode)) {
        return;
    }

    if (BusinessLayer.declaredClass == "esri.layers.FeatureLayer") {
        var graphics = BusinessLayer.graphics;
        var bFrist = true;

        for (var i = 0; i < graphics.length; i++) {
            //查找关注点
            if (graphics[i].attributes[Settings.LayerKeyFieldName] == Settings.BusinessCode) {
                mapPoint = new esri.geometry.Point(graphics[i].geometry.x, graphics[i].geometry.y);
                mapPoint.spatialReference = ArcGIS_Map.spatialReference;
                var ClickScreenPoint = ArcGIS_Map.toScreen(mapPoint);
                var ClickGraphic = graphics[i];
                var evt = {
                    graphic: ClickGraphic,
                    screenPoint: ClickScreenPoint
                };
                BusinessLayer.onClick(evt);
                if (fw.fwObject.FWObjectHelper.hasValue(Settings.ZoomScale)
                    && Settings.ZoomScale > 0) {
                    ArcGIS_Map.centerAndZoom(mapPoint, Settings.ZoomScale);
                    break;
                } else {
                    if (fw.fwObject.FWObjectHelper.hasValue(Settings.ZoomLevel)) {
                        ArcGIS_Map.centerAndZoom(mapPoint, Settings.ZoomLevel);
                        break;
                    };
                }
                break;
            }

        }
    } else {
        var graphics = BusinessLayer.graphics;
        var bFrist = true;

        for (var i = 0; i < graphics.length; i++) {
            //查找关注点
            if (graphics[i].attributes[Settings.LayerKeyFieldName] == Settings.BusinessCode) {
                mapPoint = new esri.geometry.Point(graphics[i].geometry.x, graphics[i].geometry.y);
                mapPoint.spatialReference = ArcGIS_Map.spatialReference;
                var ClickScreenPoint = ArcGIS_Map.toScreen(mapPoint);
                var ClickGraphic = graphics[i];
                var evt = {
                    graphic: ClickGraphic,
                    screenPoint: ClickScreenPoint
                };
                BusinessLayer.onClick(evt);
                if (fw.fwObject.FWObjectHelper.hasValue(Settings.ZoomScale)
                    && Settings.ZoomScale > 0) {
                    ArcGIS_Map.centerAndZoom(mapPoint, Settings.ZoomScale);
                    break;
                } else {
                    if (fw.fwObject.FWObjectHelper.hasValue(Settings.ZoomLevel)) {
                        ArcGIS_Map.centerAndZoom(mapPoint, Settings.ZoomLevel);
                        break;
                    }
                    ;
                }
                //ArcGIS_Map.centerAt(graphics[i].geometry);
                break;
            }

        }
    }
}
if (fw.fwObject.FWObjectHelper.hasValue(Settings.FlashTime) && fw.fwObject.FWObjectHelper.hasValue(m_FalshLayer)) {
    setTimeout(function () { m_FalshLayer.clear() }, Settings.FlashTime);
}
    }
    ,
//定位到某一个点坐标
zoomToPointGeo: function (geometry) {
    ArcGIS_Map.centerAt(geometry);
}
    ,
//定位到某一个线或面（中心点）
zoomToPolygon: function (geometry, zoomLevel, onCompletedEvent) {
    var mapPoint = this.getPolygonCenter(geometry);
    if (fw.fwObject.FWObjectHelper.hasValue(zoomLevel)
        && zoomLevel > 0) {
        ArcGIS_Map.centerAndZoom(mapPoint, zoomLevel);
    }
    else {
        ArcGIS_Map.centerAt(mapPoint);
    }
    if ($.isFunction(onCompletedEvent)) {
        var ExtentChangeEvent = dojo.connect(ArcGIS_Map, "onExtentChange", onCompletedEvent);
        ArcGIS_Map.ExtentChangeEvent = ExtentChangeEvent;
    }
}
    ,
//根据传的像素值返回点的区域
pointToExtent: function (map, point, toleranceInPixel) {
    var pixelWidth = map.extent.getWidth() / map.width;
    var toleraceInMapCoords = toleranceInPixel * pixelWidth;
    return new esri.geometry.Extent(point.x - toleraceInMapCoords,
        point.y - toleraceInMapCoords,
        point.x + toleraceInMapCoords,
        point.y + toleraceInMapCoords,
        map.spatialReference);
}
    ,
//设置地图切换到某一个区域
mapChangeExtent: function (newExtent) {
    if (fw.fwObject.FWObjectHelper.hasValue(newExtent)) {
        ArcGIS_Map.setExtent(newExtent);
    };
}
    ,
//根据坐标定位到某个区域
zoomToPosition: function (xmin, ymin, xmax, ymax) {
    var newExtent = new esri.geometry.Extent(xmin, ymin, xmax, ymax);
    ArcGISAPI.mapChangeExtent(newExtent);
}
    ,
//地图偏移一定的像素
mapMovePixel: function (Properties) {
    var Settings = {
        xPixels: 0
        , yPixels: 0
        , byDefaultExtend: false
    };
    $.extend(Settings, Properties);


    if (!fw.fwObject.FWObjectHelper.hasValue(ArcGIS_Map.extent)) {
        return;
    }
    var oextend = ArcGIS_Map.extent;
    if (Settings.byDefaultExtend)
        oextend = ArcGIS_MapFullExtent;

    var iPerHeight = oextend.getHeight() / ArcGIS_Map.height;
    var iPerWidht = oextend.getWidth() / ArcGIS_Map.width;
    var dx = 0;
    var dy = 0;
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.xPixels)) {
        dx = Settings.xPixels * iPerWidht;
    }
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.yPixels)) {
        dy = Settings.yPixels * iPerHeight;
    }

    ArcGISAPI.mapChangeExtent(oextend.offset(dx, dy));
},
//回到地图初始范围
zoomToFullExtent: function () {
    ArcGISAPI.mapChangeExtent(ArcGIS_MapFullExtent);
}
    ,
//返回地图初始范围值
getFullExtent: function () {
    return ArcGIS_MapFullExtent;
}
    ,
//缩放到厂区 
zoomToCanton: function (Properties) {
    var Settings = {
        CantonCode: ""
        , CantonMapServiceUrl: ""
        , JosnSimpleRenderer: ""
        , Expression: ""
        , ShowmaxScale: 0 //图层显示最大Scale
        , ShowminScale: 0  //图层显示最小Scale
        , setx: 0
        , sety: 0
    };

    $.extend(Settings, Properties);
    // alert(Settings.setx);
    var featureLayer_Canton = ArcGISAPI.getOrCreateLayer({ LayerName: "Business_LocateCantonLayer" });
    if (!fw.fwObject.FWObjectHelper.hasValue(Settings.CantonMapServiceUrl)) {
        featureLayer_Canton.clear();
        return;
    }

    //var featureLayer_Canton = ArcGISAPI.getOrCreateLayer({ LayerName: "LocateCantonLayer" });
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.ShowmaxScale)
        && Settings.ShowmaxScale > 0) {
        featureLayer_Canton.maxScale = Settings.ShowmaxScale;
    }

    if (fw.fwObject.FWObjectHelper.hasValue(Settings.ShowminScale)
        && Settings.ShowminScale > 0) {
        featureLayer_Canton.minScale = Settings.ShowminScale;
    }

    if (Settings.CantonCode == "320000")
        Settings.CantonCode = "32";
    if (fw.fwObject.FWObjectHelper.hasValue(featureLayer_Canton.Code)
        && featureLayer_Canton.Code == Settings.CantonCode) {
        if (featureLayer_Canton.Code == "32") {
            ArcGISAPI.zoomToFullExtent();
            return;
        }
        else {
            if (featureLayer_Canton.graphics.length > 0) {
                var extend = featureLayer_Canton.graphics[0].geometry.getExtent();
                this.zoomToExtent(extend);
                return;
            }
        }
    }
    if (featureLayer_Canton != null && featureLayer_Canton.graphics.length <= 0) {
        ;
    }
    else {
        featureLayer_Canton.clear();
    }

    var renderer = null;
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.JosnSimpleRenderer))
        renderer = new esri.renderer.SimpleRenderer(Settings.JosnSimpleRenderer);
    else
        renderer = new esri.renderer.SimpleRenderer(GetDefaultSymbolByName(SymbolNames.Polygon_Canton));

    featureLayer_Canton.setRenderer(renderer);
    featureLayer_Canton.Code = Settings.CantonCode;

    var ZoomFullExtent = null;
    if (Settings.CantonCode == "32") {
        ZoomFullExtent = function () {
            ArcGISAPI.zoomToFullExtent();
        };
    };
    zoomAndQueryToPolygon(featureLayer_Canton, Settings.CantonMapServiceUrl, Settings.Expression, ZoomFullExtent, Settings.setx, Settings.sety);
}
    ,
//放大到一定区域
zoomToExtent: function (extend, xPixels, yPixels) {
    //    var newExtend = extend;//.offset(1, 0);
    //    ArcGIS_Map.setExtent(newExtend);
    console.log(list)
    var iPerHeight = ArcGIS_Map.extent.getHeight() / ArcGIS_Map.height;
    var iPerWidht = ArcGIS_Map.extent.getWidth() / ArcGIS_Map.width;
    var dx = xPixels * iPerWidht;
    var dy = yPixels * iPerHeight;
    //    var dx =0;
    //    var dy =0;
    ArcGISAPI.mapChangeExtent(extend.expand(1.3).offset(dx, dy));
    //ArcGISAPI.mapChangeExtent(extend.expand(1.3));
    return;

    // ArcGIS_Map.setExtent(extend);
    var mapPoint = extend.getCenter();
    var screenPoint = ArcGIS_Map.toScreen(mapPoint);

    var newpoint = screenPoint;
    var d = ArcGIS_Map.extent.getWidth() / extend.getWidth();

    newpoint = screenPoint.offset(100 / d, 0);
    mapPoint = ArcGIS_Map.toMap(newpoint);

    ArcGIS_Map.centerAt(mapPoint);

    //ArcGIS_Map.setExtent(newExtend.expand(1.2));
}
    ,
//放大到区域
zoomAndQueryToPolygon: function (Layer, sUrl, sWhere, callback, setx, sety) {
    var sys = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_NULL, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 255]), 3), new dojo.Color([255, 255, 0, 1]));;
    var query = new esri.tasks.Query();
    query.returnGeometry = true;
    query.outFields = ["*"];
    if (fw.fwObject.FWObjectHelper.hasValue(sWhere)) {
        query.where = sWhere;
    } else {
        query.where = "1=1";
    };
    query.outSpatialReference = ArcGIS_Map.spatialReference; // { wkid: 102100 };  
    var queryTask = new esri.tasks.QueryTask(sUrl);
    queryTask.execute(query, function (results) {
        if (results.features.length > 0) {
            for (var i = 0; i < results.features.length; i++) {
                var polygon1 = new esri.geometry.Polygon(ArcGIS_Map.spatialReference);
                var feature = results.features[i];
                for (var z = 0; z < feature.geometry.rings.length; z++) {
                    polygon1.addRing(feature.geometry.rings[z]);
                };
                var polygonGraphic = new esri.Graphic(polygon1, sys);
                polygonGraphic.setAttributes(feature.attributes);
                Layer.add(polygonGraphic);

            };
            if (!Layer.visible) {

                Layer.show();

            }
            if ($.isFunction(callback)) {
                callback();
            }
            else {
                this.zoomToExtent(polygon1.getExtent(), setx, sety);
            }
        };
    }, function (error) {
        // alert(error);
    });
}
    ,
//获取地图范围信息,主要要于返回切片图层的切片信息
getMapExtentSetting: function () {
    var ScaleInfo = "";
    for (var i = 0; i < ArcGIS_Map.__tileInfo.lods.length; i++) {
        if (ScaleInfo != "")
            ScaleInfo += ",";
        ScaleInfo += "\"" + ArcGIS_Map.__tileInfo.lods[i].level + "\":" + "\"" + ArcGIS_Map.__tileInfo.lods[i].scale + "\"";
    }
    ScaleInfo = "{" + ScaleInfo + "}";

    return {
        ArcGISMap: ArcGIS_Map
        , FullExtent: ArcGIS_MapFullExtent
        , ScaleDescriptionDictionary: {}
        , ScaleInfoDictionary: ScaleInfo
    };
}
    ,
//设置地图缩放到第几级别
setZoom: function (level) {
    ArcGIS_Map.setZoom(level);
}
    ,
/**************************************************************************
//图层
***************************************************************************/
//==========底图服务==========
//加载底图，一般加载切片图、动态地图等
addMapService: function (Properties) {

    //添加地图
    var Settings = {
        MapServiceLayerType: "esri.layers.ArcGISDynamicMapServiceLayer" //地图服务类型
        , ServiceUrl: "" //地图服务地址
        , opacity: 1 //透明度
        , LayerName: ""//地图名称
        , ChildLayerId: null//显示的子图层编号
        , showAttribution: false//是否显示属性
        , DefaultVisible: true//是否显示图层
        , InfoWindowSettings: { DetailUrl: "" }//消息窗对象
        , Callback: function () {
            //加载完成后回调函数
        },
        Legend: null//图例数组
        , IsSymbolHLClear: true//是否清除高亮显示的图形
    };
    $.extend(Settings, Properties);
    //如果有图例的则显示
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.Legend)) {
        //图例
        var settings = {
            ArcGISWindow: API.ArcGISAPI.ArcGISWindow,
            ArcGISMap: API.ArcGISAPI.ArcGISMap,
            width: 150,
            legend: Settings.Legend
        };
        divArcGISLegendJQ.LegendControl(settings);
        divArcGISLegendJQ.show();
    }
    ;
    var LayerIndex = this.getLayerIndex(Settings.id);
    if (LayerIndex >= 0) {
        //            var oldLayer = ArcGIS_Map.getLayer(Settings.id);
        //            ArcGIS_Map.removeLayer(oldLayer);
        return;
    }
    LayerIndex = this.getLayerIndex(Settings.LayerName);
    var Layer = null;

    if (LayerIndex >= 0) {
        Layer = ArcGIS_Map.getLayer(Settings.LayerName);
    } else {
        Layer = this.createLayer(Settings.MapServiceLayerType, Settings.ServiceUrl);

    }
    ;
    if (Layer != null) {
        Layer.MapServiceLayerType = Settings.MapServiceLayerType;
        Layer.opacity = Settings.opacity;
        Layer.visible = Settings.DefaultVisible;
        if (fw.fwObject.FWObjectHelper.hasValue(Settings.id)) {
            Layer.id = Settings.id;
        } else {
            if (fw.fwObject.FWObjectHelper.hasValue(Settings.LayerName)) {
                Layer.id = Settings.LayerName;
            }
        }
        //控制显示的子图层编号
        if (fw.fwObject.FWObjectHelper.hasValue(Settings.ChildLayerId)) {
            Layer.setVisibleLayers([Settings.ChildLayerId]);
        };
        var IsShowInfoWindow = false;
        var layerOnMouseClick = null;
        IsShowInfoWindow = fw.fwObject.FWObjectHelper.hasValue(Settings.InfoWindowSettings.DetailUrl);
        if (!IsShowInfoWindow && fw.fwObject.FWObjectHelper.hasValue(Settings.InfoWindowSettings)
            && fw.fwObject.FWObjectHelper.hasValue(Settings.InfoWindowSettings.FieldArray)) {
            for (var i = 0; i < Settings.InfoWindowSettings.FieldArray.length; i++) {
                var Entity = Settings.InfoWindowSettings.FieldArray[i];
                if (fw.fwObject.FWObjectHelper.hasValue(Entity.IsTitle) && Entity.IsTitle) {
                    IsShowInfoWindow = true;
                }
                ;
                if (fw.fwObject.FWObjectHelper.hasValue(Entity.IsShow) && Entity.IsShow) {
                    IsShowInfoWindow = true;
                }
                ;
                if (IsShowInfoWindow) {
                    break;
                }
                ;
            }
            ;
        }
        ;

        if (IsShowInfoWindow || fw.fwObject.FWObjectHelper.hasValue(Settings.SymbolHLColor)) {
            layerOnMouseClick = function (evt) {
                var geometry = new esri.geometry.Point(evt.mapPoint.x, evt.mapPoint.y);
                var settings = {
                    layerUrl: Settings.ServiceUrl,
                    geometry: geometry,
                    layerIds: Settings.ChildLayerId,
                    onCompletedEvent: function (result) {
                        if (result.length > 0) {
                            var g = result[0].feature;

                            //如果需要高亮显示的
                            if (fw.fwObject.FWObjectHelper.hasValue(Settings.SymbolHLColor)) {
                                //清空高亮显示的网格  
                                if (Settings.IsSymbolHLClear) {
                                    API.ArcGISAPI.clearGraphicsLayer({ LayerName: "GL" });
                                }
                                ;
                                symbol = { lineColor: Settings.SymbolHLColor, borderWidth: Settings.SymbolBorderWidth, fillColor: Settings.SymbolHLFillColor };
                                var graphicSetting = {
                                    LayerName: "GL",
                                    ReorderLayerIndex: 10,
                                    GeometryList: [{ Geometry: g.geometry, Symbol: GetDefaultSymbolByName(SymbolNames.Polygon, symbol), Attributes: g.attributes }]
                                };
                                API.ArcGISAPI.addGraphicToLayer(graphicSetting);
                            }
                            ;
                            if (IsShowInfoWindow) {
                                infoEvent(g, geometry);
                            }
                            ;
                        }
                        ;
                    }
                };
                API.ArcGISAPI.taskIdentify(settings);

                var infoEvent = function (g, geometry) {
                    var TitleHtml = "";
                    var ContentHtml = "";
                    var iRowCount = 0;
                    if (fw.fwObject.FWObjectHelper.hasValue(Settings.InfoWindowSettings)
                        && fw.fwObject.FWObjectHelper.hasValue(Settings.InfoWindowSettings.FieldArray)) {
                        var Width = 350;
                        var Height = 140;
                        if (fw.fwObject.FWObjectHelper.hasValue(Settings.InfoWindowSettings.Width)) {
                            Width = Settings.InfoWindowSettings.Width;
                        }
                        ;
                        if (fw.fwObject.FWObjectHelper.hasValue(Settings.InfoWindowSettings.Height)) {
                            Height = Settings.InfoWindowSettings.Height;
                        }
                        ;
                        var divJQ = $("<div class=\"divMapInfoWindowContent\"></div>").width(Width).appendTo("body");
                        var divInfoJQ = $("<div class=\"divInfo\"></div>").appendTo(divJQ);
                        var data = { Ticket: $.page.ticket }; //跳转页面传参
                        for (var i = 0; i < Settings.InfoWindowSettings.FieldArray.length; i++) {
                            var Entity = Settings.InfoWindowSettings.FieldArray[i];
                            if (fw.fwObject.FWObjectHelper.hasValue(Entity.IsTitle) && Entity.IsTitle) {
                                TitleHtml = g.attributes[Entity.FieldName];
                            }
                            ;
                            if (fw.fwObject.FWObjectHelper.hasValue(Entity.IsShow) && Entity.IsShow) {
                                if (!fw.fwObject.FWObjectHelper.hasValue(Entity.ShowName)) {
                                    Entity.ShowName = Entity.FieldName;
                                }
                                ;
                                if (fw.fwObject.FWObjectHelper.hasValue(g.attributes[Entity.FieldName]) && jQuery.trim(g.attributes[Entity.FieldName]) != "") {
                                    ContentHtml += "    <tr><td>" + Entity.ShowName + ":</td><td>" + g.attributes[Entity.FieldName] + "</td></tr>";
                                }
                                ;
                            }
                            ;
                            if (fw.fwObject.FWObjectHelper.hasValue(Entity.IsParameter) && Entity.IsParameter) {
                                if (!fw.fwObject.FWObjectHelper.hasValue(Entity.ParameterName)) {
                                    Entity.ParameterName = Entity.FieldName;
                                }
                                ;
                                data[Entity.ParameterName] = g.attributes[Entity.FieldName];
                            }
                            ;
                        }
                        ;
                        if (fw.fwObject.FWObjectHelper.hasValue(ContentHtml)) {
                            ContentHtml = "<table style=\"width:auto;\">" + ContentHtml + "</table>";
                            $(ContentHtml).appendTo(divInfoJQ);
                        }
                        ;

                        if (fw.fwObject.FWObjectHelper.hasValue(Settings.InfoWindowSettings.DetailUrl)) {
                            var divDetailInfoJQ = $("<div class=\"divDetailInfo\"></div>").appendTo(divJQ).bind("click", data[0], function (e) {
                                var OpenSettings = {
                                    TitleHtml: TitleHtml,
                                    IsHtmlPage: true,
                                    Url: GetAbsoluteUrl(Settings.InfoWindowSettings.DetailUrl, $.page.webSiteRootUrl),
                                    Data: data,
                                    Width: divJQ.outerWidth() + 20,
                                    Height: divJQ.outerHeight() + 10
                                };
                                fw.topWindow().jQueryExtension.UI.Open(OpenSettings);
                            });
                        }
                        ;
                        ArcGISAPI.mapInfoWindowShow({
                            Title: TitleHtml,
                            domNode: divJQ[0],
                            evt: geometry,
                            Width: 200,
                            Height: 100
                        });
                        divJQ.parent().css("overflow", "hidden");
                    }
                };


            };
            var clickHandler = dojo.connect(ArcGIS_Map, "onClick", layerOnMouseClick);
            ArcGIS_Map.clickHandler = clickHandler;
        }
        ;
    }

    if (LayerIndex < 0) {
        ArcGIS_Map.addLayer(Layer);
    }
    ;
    if ($.isFunction(Settings.callback)) {
        Settings.callback(Layer);
    };
}
    ,
//删除底图服务
removeMapService: function (Properties) {
    var Settings = {
        LayerName: ""
    };
    $.extend(Settings, Properties);
    var LayerIndex = -1;
    if (!fw.fwObject.FWObjectHelper.hasValue(Settings.id)
        && fw.fwObject.FWObjectHelper.hasValue(Settings.LayerName)) {
        Settings.id = Settings.LayerName;
    }
    for (var i = 0; i < ArcGIS_Map.layerIds.length; i++) {
        if (ArcGIS_Map.layerIds[i] == Settings.id) {
            LayerIndex = i;
            break;
        }

    }
    if (LayerIndex < 0) return;

    var oldLayer = ArcGIS_Map.getLayer(Settings.id);
    ArcGIS_Map.removeLayer(oldLayer);
    //点击事件
    //如果原来有点击事件的先清空
    if (fw.fwObject.FWObjectHelper.hasValue(ArcGIS_Map.clickHandler)) {
        dojo.disconnect(ArcGIS_Map.clickHandler);
        ArcGIS_Map.clickHandler = null;
    }
}
    ,
//切换底图服务
modiMapService: function (Properties) { //修改地图服务地址
    //添加地图
    var Settings = {
        MapServiceLayerType: "esri.layers.ArcGISDynamicMapServiceLayer" //地图服务类型
        , MapServiceUrl: ""//地图服务地址
        , LayerName: ""//图层名称
    };
    $.extend(Settings, Properties);
    var LayerIndex = -1;
    for (var i = 0; i < ArcGIS_Map.layerIds.length; i++) {
        if (ArcGIS_Map.layerIds[i] == Settings.LayerName) {
            LayerIndex = i;
            break;
        }

    }
    if (LayerIndex < 0) return;

    var oldLayer = ArcGIS_Map.getLayer(Settings.LayerName);
    ArcGIS_Map.removeLayer(oldLayer);
    var newLayer = this.createLayer(Settings.MapServiceLayerType, Settings.MapServiceUrl);
    if (newLayer != null) {
        newLayer.MapServiceLayerType = Settings.MapServiceLayerType;
        newLayer.opacity = oldLayer.opacity;
        newLayer.visible = oldLayer.visible;
        newLayer.id = oldLayer.id;

        ArcGIS_Map.addLayer(newLayer, LayerIndex);
    }
}
    ,
//创建地图服务图层
createLayer: function (MapServiceLayerType, MapServiceUrl, Options) {
    var Layer = null;
    switch (MapServiceLayerType) {
        case Code__MapServiceLayerType.ImageService:
            Layer = new esri.layers.ArcGISImageServiceLayer(MapServiceUrl);
            break;
        case Code__MapServiceLayerType.TiledMapService:
            Layer = new esri.layers.ArcGISTiledMapServiceLayer(MapServiceUrl, Options);
            break;
        case Code__MapServiceLayerType.DynamicMapService:
            Layer = new esri.layers.ArcGISDynamicMapServiceLayer(MapServiceUrl, Options);
            break;
        case Code__MapServiceLayerType.TianDiTuImageService:
            Layer = new esri.layers.TianDiTuTiledMapServiceLayer_Image(MapServiceUrl);
            break;
        case Code__MapServiceLayerType.TianDiTuPlaceService:
            Layer = new esri.layers.TianDiTuTiledMapServiceLayer_PlaceName(MapServiceUrl);
            break;
        case Code__MapServiceLayerType.TianDiTuVectorService:
            Layer = new esri.layers.TianDiTuTiledMapServiceLayer_Vector(MapServiceUrl);
            break;
        case Code__MapServiceLayerType.GoogleImageService:
            Layer = new esri.layers.GoogleTiledMapServiceLayer_Image(MapServiceUrl);
            break;
        case Code__MapServiceLayerType.GoogleVectorService:
            Layer = new esri.layers.GoogleTiledMapServiceLayer_Vector(MapServiceUrl);
            break;
        case Code__MapServiceLayerType.GoogleTerrainService:
            Layer = new esri.layers.GoogleTiledMapServiceLayer_Terrain(MapServiceUrl);
            break;
        case Code__MapServiceLayerType.BaiDuImageService:
            Layer = new esri.layers.BaiDuTiledMapServiceLayer_Image(MapServiceUrl);
            break;
        case Code__MapServiceLayerType.BaiDuVectorService:
            Layer = new esri.layers.BaiDuTiledMapServiceLayer_Vector(MapServiceUrl);
            break;
        case Code__MapServiceLayerType.TianDiTuService_img_c:
            Layer = new esri.layers.TianDiTuTiledMapServiceLayer_img_c(MapServiceUrl);
            break;
        case Code__MapServiceLayerType.TianDiTuService_cia_c:
            Layer = new esri.layers.TianDiTuTiledMapServiceLayer_cia_c(MapServiceUrl);
            break;
        case Code__MapServiceLayerType.TianDiTuService_vec_c:
            Layer = new esri.layers.TianDiTuTiledMapServiceLayer_vec_c(MapServiceUrl);
            break;
        case Code__MapServiceLayerType.TianDiTuService_cva_c:
            Layer = new esri.layers.TianDiTuTiledMapServiceLayer_cva_c(MapServiceUrl);
            break;
        case Code__MapServiceLayerType.TianDiTuService_ter_c:
            Layer = new esri.layers.TianDiTuTiledMapServiceLayer_ter_c(MapServiceUrl);
            break;
        case Code__MapServiceLayerType.TianDiTuService_cta_c:
            Layer = new esri.layers.TianDiTuTiledMapServiceLayer_cta_c(MapServiceUrl);
            break;
        case Code__MapServiceLayerType.TianDiTuService_NJDLG_DT_18_20N:
            Layer = new esri.layers.TianDiTuTiledMapServiceLayer_NJDLG_DT_18_20N(MapServiceUrl);
            break;
        case Code__MapServiceLayerType.TianDiTuService_NJDLG_ZJ_18_20N:
            Layer = new esri.layers.TianDiTuTiledMapServiceLayer_NJDLG_ZJ_18_20N(MapServiceUrl);
            break;
        case Code__MapServiceLayerType.TianDiTuService_NJDOM_ZJ_18_19_N:
            Layer = new esri.layers.TianDiTuTiledMapServiceLayer_NJDOM_ZJ_18_19_N(MapServiceUrl);
            break;
        case Code__MapServiceLayerType.TianDiTuService_NJDOM_DT_18_19_N:
            Layer = new esri.layers.TianDiTuTiledMapServiceLayer_NJDOM_DT_18_19_N(MapServiceUrl);
            break;
    }
    ;
    return Layer;
},
//验证矢量图层是否存在
checkExistMSLayer: function (layerName) {
    var LayerIndex = this.getLayerIndex(layerName);
    return LayerIndex == -1 ? false : true;
},
//==========动态2D地图服务==========
//根据图层编号加载地图服务
addMSLayerByLayerId: function (properties) {
    var Settings = {
        IsVisible: true//图层是否可见
        , LayerName: ""//图层名称
        , ChildLayerId: ""//子图层编号
        , MapServiceLayerType: Code__MapServiceLayerType.DynamicMapService//地图服务类型
        , MapServiceUrl: ""//地图服务地址
        , ReorderLayerIndex: ""//排序
        , Opacity: 0.8//图层透明度
        , onClickEvent: function () {
            //图层点击事件
        }
    };
    $.extend(Settings, properties);
    var BusinessLayer = null;

    if (this.checkExistMSLayer(Settings.LayerName)) {
        BusinessLayer = ArcGIS_Map.getLayer(Settings.LayerName);
    } else {
        BusinessLayer = this.createLayer(Settings.MapServiceLayerType, Settings.MapServiceUrl, { "id": Settings.LayerName });
        ArcGIS_Map.addLayer(BusinessLayer);
    };
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.ReorderLayerIndex)) {
        ArcGIS_Map.reorderLayer(BusinessLayer, Settings.ReorderLayerIndex);
    };
    BusinessLayer.setVisibility(Settings.IsVisible);
    //如果子图层不为空，则控制子图层显示
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.ChildLayerId)) {
        //后期再考虑如果有多个的情况
        //        for (var i = 0; i < Settings.ChildLayerName.length; i++) {
        //        };
        //var index = GetQueryLayerIndex(Settings.ChildLayerName);
        // BusinessLayer.setVisibleLayers([index]);
        BusinessLayer.setVisibleLayers([Settings.ChildLayerId]);
    };

    if (fw.fwObject.FWObjectHelper.hasValue(Settings.Opacity)) {
        BusinessLayer.opacity = Settings.Opacity;
    } else {
        BusinessLayer.opacity = 0.8;
    };
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.minScale)) {
        BusinessLayer.minScale = Settings.minScale;
    };
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.maxScale)) {
        BusinessLayer.maxScale = Settings.maxScale;
    }
    if (fw.fwObject.FWObjectHelper.hasValue(BusinessLayer.updateEndHandle)) {
        dojo.disconnect(BusinessLayer.updateEndHandle);
        BusinessLayer.updateEndHandle = null;
    }
    ;
    if ($.isFunction(Settings.onCompletedEvent)) {
        var updateEndHandle = dojo.connect(BusinessLayer, "onUpdateEnd", Settings.onCompletedEvent);
        BusinessLayer.updateEndHandle = updateEndHandle;
    };

    //图例部分_目前显示时变成无图例 
    //            var legend = new esri.dijit.Legend({
    //                map: ArcGIS_Map,
    //                layerInfos: BusinessLayer,
    //                arrangment: esri.dijit.Legend.ALIGN_RIGHT,
    //                 autoUpdate: true
    //            }, "divLegend");
    //            legend.startup();

    //点击事件
    //如果原来有点击事件的先清空
    if (fw.fwObject.FWObjectHelper.hasValue(ArcGIS_Map.clickHandler)) {
        dojo.disconnect(ArcGIS_Map.clickHandler);
        ArcGIS_Map.clickHandler = null;
    }
    if ($.isFunction(Settings.onClickEvent)) {
        var clickHandler = dojo.connect(ArcGIS_Map, "onClick", Settings.onClickEvent);
        ArcGIS_Map.clickHandler = clickHandler;
    };
}
    ,
//隐藏上述地图服务
hideMSLayer: function (properties) {
    var Settings = {
        IsVisible: false//是否可见
        , LayerName: ""//图层名称
    };
    $.extend(Settings, properties);
    var BusinessLayer = null;
    if (this.checkExistMSLayer(Settings.LayerName)) {
        BusinessLayer = ArcGIS_Map.getLayer(Settings.LayerName);
        BusinessLayer.setVisibility(Settings.IsVisible);
    };
    //点击事件
    //如果原来有点击事件的先清空
    if (fw.fwObject.FWObjectHelper.hasValue(ArcGIS_Map.clickHandler)) {
        dojo.disconnect(ArcGIS_Map.clickHandler);
        ArcGIS_Map.clickHandler = null;
    }
}
    ,
//创建聚类函数
createClusterLayer: function (properties) {
    var Settings = {
        ServiceUrl: ""//图层服务地址
        , LayerName: ""//图层编号
        , IsBusinessLayer: true//是否业务图层
        , LayerTitle: ""//图层名称
        , where: ""//查询条件
        , FlareLimit: 50//有限个数
        , FlareDistanceFromCenter: 50//限制距离
        , InfoWindowSettings: {//消息窗对象
            FieldArray: []
        },
        ClusterItemList: []//聚合条件图形
    };
    $.extend(Settings, properties);
    if (!fw.fwObject.FWObjectHelper.hasValue(Settings.where) && ArcGISAPI.checkExistDynamicLayer({ LayerName: Settings.LayerName })) {
        ArcGIS_DynamicElementLayer[Settings.LayerName].show();
    } else {
        var queryTask = new esri.tasks.QueryTask(Settings.ServiceUrl);
        var query = new esri.tasks.Query();
        query.returnGeometry = true;
        if (fw.fwObject.FWObjectHelper.hasValue(Settings.where)) {
            query.where = Settings.where;
        } else {
            query.where = '1=1';
        };
        query.outFields = ["*"];
        query.outSpatialReference = ArcGIS_Map.extent.spatialReference;
        var TitleHtml = "";
        var BodyHtml = "";
        var iRowCount = 0;
        if (fw.fwObject.FWObjectHelper.hasValue(Settings.InfoWindowSettings)
            && fw.fwObject.FWObjectHelper.hasValue(Settings.InfoWindowSettings.FieldArray)) {
            var bShowDetail = false;
            if (fw.fwObject.FWObjectHelper.hasValue(Settings.InfoWindowSettings.DetailUrl)
                && Settings.InfoWindowSettings.DetailUrl != "") {
                bShowDetail = true;
            }
            var ParameterS = "";
            for (var i = 0; i < Settings.InfoWindowSettings.FieldArray.length; i++) {
                var Entity = Settings.InfoWindowSettings.FieldArray[i];
                if (fw.fwObject.FWObjectHelper.hasValue(Entity.IsTitle) && Entity.IsTitle) {
                    TitleHtml += "<b>${" + Entity.FieldName + "}</b>";
                }
                if (fw.fwObject.FWObjectHelper.hasValue(Entity.IsShow) && Entity.IsShow) {
                    var sTitle = Entity.FieldName;
                    if (fw.fwObject.FWObjectHelper.hasValue(Entity.ShowName) && Entity.ShowName != "") {
                        sTitle = Entity.ShowName;
                    }
                    BodyHtml += "<tr><td>" + sTitle + ":  </td><td>${" + Entity.FieldName + "}</td></tr><br>";
                    iRowCount++;
                }
                if (bShowDetail) {
                    if (fw.fwObject.FWObjectHelper.hasValue(Entity.IsParameter) && Entity.IsParameter) {
                        var sTitle = Entity.FieldName;
                        if (fw.fwObject.FWObjectHelper.hasValue(Entity.ParameterName) && Entity.ParameterName != "") {
                            sTitle = Entity.ParameterName;
                        }
                        if (ParameterS == "") {
                            ParameterS = "?" + sTitle + "=${" + Entity.FieldName + "}";
                        } else {
                            ParameterS += "&" + sTitle + "=${" + Entity.FieldName + "}";
                        }
                    }
                }
            }

            if (bShowDetail) {
                var sUrl = GetAbsoluteUrl(Settings.InfoWindowSettings.DetailUrl, $.Page.WebSiteRootUrl) + ParameterS;
                BodyHtml += "<tr><td>&nbsp;</td><td></td></tr><div onclick='ArcGISAPI.MapPopWindow({ IsHtmlPage: true, Url: \"" + sUrl + "\"})' style='background:url(" + $.Page.WebSiteRootUrl + "web/styles/images/title.gif) 3 0 no-repeat'  class='MapPopWindow'><a href='#'>详 细</a></div>";
            }
            if (TitleHtml != "") {
                var template1 = new esri.InfoTemplate();
                template1.setTitle(TitleHtml);
                template1.setContent(BodyHtml);
            }
        }

        dojo.connect(queryTask, "onComplete", function (featureSet) {


            if (ArcGISAPI.checkExistDynamicLayer({ LayerName: Settings.LayerName })) {
                cL = ArcGIS_DynamicElementLayer[Settings.LayerName];
                ArcGIS_Map.removeLayer(cL);
            }
            cL = new esri.ux.layers.ClusterLayer({
                displayOnPan: true,
                map: ArcGIS_Map,
                features: featureSet.features,
                LayerService: Settings,
                infoWindow: {
                    template: template1,
                    width: "",
                    height: ""
                },
                flareLimit: Settings.flareLimit, //限制聚类展开显示，聚类超过flareLimit个的点就不显示
                flareDistanceFromCenter: Settings.flareDistanceFromCenter
            });
            cL.id = "Business_" + Settings.LayerName;
            cL.name = Settings.LayerTitle;


            ArcGIS_Map.addLayer(cL);
            ArcGIS_DynamicElementLayer["Business_" + Settings.LayerName] = cL;
            ArcGIS_DynamicElementLayer["Business_" + Settings.LayerName].id = cL.id;


        });

        dojo.connect(queryTask, "onError", function (err) {
            alert("函数CreateClusterLayer出错" + err.details);
        });

        queryTask.execute(query);
    }
},
//移除图层
//非业务图层，目前包括Draw图层、聚类图层
removeElementLayer: function (properties) {
    var settings = {
        LayerName: ""
    };
    $.extend(settings, properties);
    if (ArcGISAPI.checkExistDynamicLayer({ LayerName: settings.LayerName })) {
        ArcGIS_Map.removeLayer(ArcGIS_DynamicElementLayer[settings.LayerName]);
        ArcGIS_DynamicElementLayer[settings.layerName] = null;
    };
},
//==========要素服务==========
//添加业务图层
businessLayerShow: function (Properties) {
    var Settings = {
        LayerName: ""//业务图层名称LayerName
        , LayerNameArray: null//业务图层名称数组
        , LayerServiceUrl: ""//地图服务地址
        , LayerServiceUrlArray: null//地图服务地址数组
        , LayerType: Code__MapLayerTypeCode.Point //图层类型，一般有点图层、线图层和面图层，默认Code__MapLayerTypeCode.Point
        , Symbol: null//图层渲染样式
        , GraphicList: null //自定义graphics列表
        , showLayeAttribution: false//是否显示图层属性
        , ShowmaxScale: 0 //图层显示最大Scale
        , ShowminScale: 0 //图层显示最小Scale
        , displayOnPan: true//图形在移动期间是否显示
        , isBusinessLayer: true//是否为业务图层
        , isRendererByType: false //是否根据特殊渲染器渲染
        , isFromDB: false //是否是从数据库获取点
        , symbolArray: null//渲染器参数
        , Where: ""//渲染过滤条件
        , BindInfoTemplate: false//绑定InfoTemplate
        , InfoTemplate: {//提示框
            TitleHtml: ""
            , ContentHtml: ""
            , ContentFunction: function () {
            }
        }
        , IsCallback: false//是否回调
        , IsReCallback: true//再加载时是否回调
        , Callback: function () {
            //回调函数，返回图层对象
        }
        , onClickEvent: function () {//点击事件
        }
        , onMouseOverEvent: function (evt) {
            if (evt.graphic.geometry.type == "point" && fw.fwObject.FWObjectHelper.hasValue(evt.graphic.symbol) && fw.fwObject.FWObjectHelper.hasValue(evt.graphic.symbol.url)) {
                var sys = new esri.symbol.PictureMarkerSymbol(evt.graphic.symbol.url, evt.graphic.symbol.width + 4, evt.graphic.symbol.height + 4);
                evt.graphic.setSymbol(sys);
            };
            ArcGIS_Map.setMapCursor("pointer");
        }
        , onMouseOutEvent: function (evt) {
            if (evt.graphic.geometry.type == "point" && fw.fwObject.FWObjectHelper.hasValue(evt.graphic.symbol) && fw.fwObject.FWObjectHelper.hasValue(evt.graphic.symbol.url)) {
                var sys = new esri.symbol.PictureMarkerSymbol(evt.graphic.symbol.url, evt.graphic.symbol.width - 4, evt.graphic.symbol.height - 4);
                evt.graphic.setSymbol(sys);
            };
            ArcGIS_Map.setMapCursor("default");
        }
    };
    $.extend(Settings, Properties);

    if (!fw.fwObject.FWObjectHelper.hasValue(Settings.LayerNameArray)) {
        Settings.LayerNameArray = [];
    };
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.LayerName)) {
        Settings.LayerNameArray.push(Settings.LayerName);
        Settings.LayerName = "";
    };
    var Layerbegin = "Business_";
    if (!Settings.isBusinessLayer)
        Layerbegin = "";
    if (Settings.LayerNameArray.length > 0) {
        for (var i = 0; i < Settings.LayerNameArray.length; i++) {
            var LayerName = Settings.LayerNameArray[i];
            if (Settings.isRendererByType) {
                Settings.LayerName = LayerName;
                this.rendererLayerByType(Settings);
            } else {
                if (!ArcGISAPI.checkExistDynamicLayer({ LayerName: Layerbegin + LayerName })) {
                    if (fw.fwObject.FWObjectHelper.hasValue(Settings.LayerServiceUrl)) {
                        LoadDynamicLayer(Settings.LayerType, Settings.LayerServiceUrl, LayerName, Settings.showLayeAttribution, Settings);
                    } else {
                        if (Settings.isFromDB) {
                            var WhereString = " BusinessTypeCode='" + LayerName + "'";
                            var Settings1 = {
                                Callback: function () {
                                    ArcGISAPI.businessLayerShow(Settings);
                                }
                            };
                            LoadDynamicElement(1, 18, WhereString, LayerName, Settings1);
                            return;
                            var BusinessLayer = ArcGISAPI.getOrCreateLayer({ LayerName: Layerbegin + LayerName });
                            BusinessLayer.show();
                        } else {
                            Settings.LayerName = LayerName;
                            this.addGraphicToLayer(Settings);
                        }
                        ;
                    }
                    ;
                } else {
                    var BusinessLayer = ArcGISAPI.getOrCreateLayer({ LayerName: Layerbegin + LayerName });
                    BusinessLayer.show();
                    if (Settings.IsReCallback) {
                        Settings.Callback(BusinessLayer);
                    }
                    ;
                    return;
                }
                ;
            }
            ;
            var BusinessLayer = ArcGISAPI.getOrCreateLayer({ LayerName: Layerbegin + LayerName });
            BusinessLayer.displayOnPan = Settings.displayOnPan;
            if (fw.fwObject.FWObjectHelper.hasValue(Settings.ShowmaxScale) && Settings.ShowmaxScale > 0) {
                BusinessLayer.maxScale = Settings.ShowmaxScale;
            }
            ;
            if (fw.fwObject.FWObjectHelper.hasValue(Settings.ShowminScale) && Settings.ShowminScale > 0) {
                BusinessLayer.minScale = Settings.ShowminScale;
            }
            ;


            if ($.isFunction(Settings.onMouseOverEvent)) {
                if (fw.fwObject.FWObjectHelper.hasValue(BusinessLayer.mouseOverHandler)) {
                    dojo.disconnect(BusinessLayer.mouseOverHandler);
                    BusinessLayer.mouseOverHandler = null;
                }
                var mouseOverHandler = dojo.connect(BusinessLayer, "onMouseOver", Settings.onMouseOverEvent);
                BusinessLayer.mouseOverHandler = mouseOverHandler;
            }
            ;
            if ($.isFunction(Settings.onMouseOutEvent)) {
                if (fw.fwObject.FWObjectHelper.hasValue(BusinessLayer.mouseOutHandler)) {
                    dojo.disconnect(BusinessLayer.mouseOutHandler);
                    BusinessLayer.mouseOutHandler = null;
                };
                var onMouseOutEvent = dojo.connect(BusinessLayer, "onMouseOut", Settings.onMouseOutEvent);
                BusinessLayer.mouseOutHandler = onMouseOutEvent;
            }
            ;


            if (fw.fwObject.FWObjectHelper.hasValue(Settings.BindInfoTemplate) && Settings.BindInfoTemplate) {
                var template = new esri.InfoTemplate();
                if (fw.fwObject.FWObjectHelper.hasValue(Settings.InfoTemplate)) {
                    template.setTitle(Settings.InfoTemplate.TitleHtml);
                    if (fw.fwObject.FWObjectHelper.hasValue(Settings.InfoTemplate.ContentFunction)) {
                        template.setContent(Settings.InfoTemplate.ContentFunction);
                    } else {
                        template.setContent(Settings.InfoTemplate.ContentHtml);
                    }
                    ;
                }
                ;
                BusinessLayer.infoTemplate = template;
            } else {
                BusinessLayer.infoTemplate = null;
            }
            ;

            //显示默认弹出框
            var IsShowInfoWindow = false;
            var layerOnMouseClick = null;
            //IsShowInfoWindow = fw.fwObject.FWObjectHelper.hasValue(Settings.InfoWindowSettings.DetailUrl);
            if (!IsShowInfoWindow && fw.fwObject.FWObjectHelper.hasValue(Settings.InfoWindowSettings)
                && fw.fwObject.FWObjectHelper.hasValue(Settings.InfoWindowSettings.FieldArray)) {
                for (var i = 0; i < Settings.InfoWindowSettings.FieldArray.length; i++) {
                    var Entity = Settings.InfoWindowSettings.FieldArray[i];
                    if (fw.fwObject.FWObjectHelper.hasValue(Entity.IsTitle) && Entity.IsTitle) {
                        IsShowInfoWindow = true;
                    }
                    ;
                    if (fw.fwObject.FWObjectHelper.hasValue(Entity.IsShow) && Entity.IsShow) {
                        IsShowInfoWindow = true;
                    }
                    ;
                    if (IsShowInfoWindow) {
                        break;
                    }
                    ;
                }
                ;
            }
            ;
            if (IsShowInfoWindow) {
                // 点击显示
                layerOnMouseClick = function (evt) {
                    var TitleHtml = "";
                    var ContentHtml = "";
                    var iRowCount = 0;
                    if (fw.fwObject.FWObjectHelper.hasValue(Settings.InfoWindowSettings)
                        && fw.fwObject.FWObjectHelper.hasValue(Settings.InfoWindowSettings.FieldArray)) {
                        var Width = 350;
                        var divJQ = $("<div class=\"divMapInfoWindowContent\"></div>").width(Width).appendTo("body");
                        var divInfoJQ = $("<div class=\"divInfo\"></div>").appendTo(divJQ);
                        var data = { Ticket: $.page.ticket }; //跳转页面传参
                        for (var i = 0; i < Settings.InfoWindowSettings.FieldArray.length; i++) {
                            var Entity = Settings.InfoWindowSettings.FieldArray[i];
                            if (fw.fwObject.FWObjectHelper.hasValue(Entity.IsTitle) && Entity.IsTitle) {
                                TitleHtml = evt.graphic.attributes[Entity.FieldName];
                            }
                            ;
                            if (fw.fwObject.FWObjectHelper.hasValue(Entity.IsShow) && Entity.IsShow) {
                                if (!fw.fwObject.FWObjectHelper.hasValue(Entity.ShowName)) {
                                    Entity.ShowName = Entity.FieldName;
                                }
                                ;

                                if (fw.fwObject.FWObjectHelper.hasValue(evt.graphic.attributes[Entity.FieldName]) && jQuery.trim(evt.graphic.attributes[Entity.FieldName]) != "") {
                                    ContentHtml += "    <tr><td>" + Entity.ShowName + ":</td><td>" + evt.graphic.attributes[Entity.FieldName] + "</td></tr>";
                                }
                                ;
                            }
                            ;
                            if (fw.fwObject.FWObjectHelper.hasValue(Entity.IsParameter) && Entity.IsParameter) {
                                if (!fw.fwObject.FWObjectHelper.hasValue(Entity.ParameterName)) {
                                    Entity.ParameterName = Entity.FieldName;
                                }
                                ;
                                data[Entity.ParameterName] = evt.graphic.attributes[Entity.FieldName];
                            }
                            ;
                        }
                        ;
                        if (fw.fwObject.FWObjectHelper.hasValue(ContentHtml)) {
                            ContentHtml = "<table style=\"width:auto;\">" + ContentHtml + "</table>";
                            $(ContentHtml).appendTo(divInfoJQ);
                        }
                        ;

                        if (fw.fwObject.FWObjectHelper.hasValue(Settings.InfoWindowSettings.DetailUrl)) {
                            var divDetailInfoJQ = $("<div class=\"divDetailInfo\"></div>").appendTo(divJQ).bind("click", data[0], function (e) {
                                var OpenSettings = {
                                    TitleHtml: TitleHtml,
                                    IsHtmlPage: true,
                                    Url: GetAbsoluteUrl(Settings.InfoWindowSettings.DetailUrl, $.Page.WebSiteRootUrl),
                                    Data: data,
                                    Width: 900,
                                    Height: 600
                                };
                                fw.topWindow().jQueryExtension.UI.Open(OpenSettings);
                            });
                        }
                        ;
                        ArcGISAPI.mapInfoWindowShow({
                            Title: TitleHtml,
                            domNode: divJQ[0],
                            evt: evt,
                            Width: divJQ.outerWidth(),
                            Height: divJQ.outerHeight()
                        });
                        divJQ.parent().css("overflow", "hidden");
                    }

                };
            }
            ;


            //点击事件
            if ($.isFunction(Settings.onClickEvent)) {
                if (fw.fwObject.FWObjectHelper.hasValue(BusinessLayer.clickHandler)) {
                    dojo.disconnect(BusinessLayer.clickHandler);
                    BusinessLayer.clickHandler = null;
                }
                var clickHandler = dojo.connect(BusinessLayer, "onClick", Settings.onClickEvent);
                BusinessLayer.clickHandler = clickHandler;
            } else if (IsShowInfoWindow) {
                var clickHandler = dojo.connect(BusinessLayer, "onClick", layerOnMouseClick);
                BusinessLayer.clickHandler = clickHandler;
            }
            ;

            //渲染完成回调事件
            if (fw.fwObject.FWObjectHelper.hasValue(BusinessLayer.updateEndHandle)) {
                dojo.disconnect(BusinessLayer.updateEndHandle);
                BusinessLayer.updateEndHandle = null;
            }
            var updateEndHandle = dojo.connect(BusinessLayer, "onUpdateEnd", function () {
                // businessLayer = ArcGISAPI.getOrCreateLayer({ LayerName: "Business_" + Settings.LayerName });
                if (Settings.IsCallback) {
                    if ($.isFunction(Settings.Callback)) {
                        if (fw.fwObject.FWObjectHelper.hasValue(Settings.data)) {
                            Settings.Callback(Settings.e, Settings.data);
                        } else {
                            Settings.Callback(BusinessLayer);
                        }
                        ;
                    }
                    ;
                    Settings.IsCallback = false;
                }
                ;

            });
            BusinessLayer.updateEndHandle = updateEndHandle;

        }
        ;
    };
}
    ,
//移除业务图层
businessLayerRemove: function (Properties) {
    //移除业务图层
    var Settings = {
        LayerName: ""//业务图层名称LayerName
        , LayerNameArray: null//业务图层名称数组
        , Callback: function () {//加载完成后触发事件
        }
    };
    $.extend(Settings, Properties);
    if (!fw.fwObject.FWObjectHelper.hasValue(Settings.LayerNameArray)) {
        Settings.LayerNameArray = [];
    };
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.LayerName)) {
        Settings.LayerNameArray.push(Settings.LayerName);
    };
    if (Settings.LayerNameArray.length > 0) {
        for (var i = 0; i < Settings.LayerNameArray.length; i++) {
            if (ArcGISAPI.checkExistDynamicLayer({ LayerName: "Business_" + Settings.LayerNameArray[i] })) {
                var BusinessLayer = ArcGISAPI.getOrCreateLayer({ LayerName: "Business_" + Settings.LayerNameArray[i] });
                ArcGIS_Map.removeLayer(BusinessLayer);
                ArcGIS_DynamicElementLayer["Business_" + Settings.LayerNameArray[i]] = null;
                BusinessLayer = null;
            }
            else if (ArcGISAPI.checkExistDynamicLayer({ LayerName: Settings.LayerNameArray[i] })) {
                var BusinessLayer = ArcGIS_DynamicElementLayer[Settings.LayerNameArray[i]];
                ArcGIS_Map.removeLayer(BusinessLayer);
                ArcGIS_DynamicElementLayer[Settings.LayerNameArray[i]] = null;
            }
        };
    } else {
        for (var Layername in ArcGIS_DynamicElementLayer) {
            if (Layername.substring(0, 8) == "Business") {
                if (ArcGISAPI.checkExistDynamicLayer({ LayerName: Layername })) {
                    var BusinessLayer = ArcGIS_DynamicElementLayer[Layername];
                    ArcGIS_Map.removeLayer(BusinessLayer);
                    ArcGIS_DynamicElementLayer[Layername] = null;
                }
            };

        };
    };
    if ($.isFunction(Settings.Callback)) {
        Settings.Callback();
    };

}
    ,
//隐藏关闭业务图层
businessLayerHide: function (Properties) {
    //隐藏关闭业务图层
    var Settings = {
        LayerName: ""//业务图层名称LayerName
        , LayerNameArray: null//业务图层名称数组
    };
    $.extend(Settings, Properties);
    if (!fw.fwObject.FWObjectHelper.hasValue(Settings.LayerNameArray)) {
        Settings.LayerNameArray = [];
    };
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.LayerName)) {
        Settings.LayerNameArray.push(Settings.LayerName);
    };
    if (Settings.LayerNameArray.length <= 0
        && fw.fwObject.FWObjectHelper.hasValue(Settings.LayerName)) {
        Settings.LayerNameArray.push(Settings.LayerName);
    }

    if (Settings.LayerNameArray.length > 0) {
        for (var i = 0; i < Settings.LayerNameArray.length; i++) {
            if (ArcGISAPI.checkExistDynamicLayer({ LayerName: "Business_" + Settings.LayerNameArray[i] })) {
                var BusinessLayer = ArcGISAPI.getOrCreateLayer({ LayerName: "Business_" + Settings.LayerNameArray[i] });
                BusinessLayer.hide();
            }
            //              if (fw.fwObject.FWObjectHelper.hasValue($.LayersControl)) {
            //                  $.LayersControl.SetLayerChecked({ Selector: divArcGISLayersControlJQ, LayerName: Settings.LayerNameArray[i], IsChecked: false });
            //              };
        };
    } else {
        for (var Layername in ArcGIS_DynamicElementLayer) {
            if (Layername.substring(0, 8) == "Business") {
                if (ArcGISAPI.checkExistDynamicLayer({ LayerName: Layername })) {
                    var BusinessLayer = ArcGIS_DynamicElementLayer[Layername];
                    BusinessLayer.hide();
                }
                //                  if (fw.fwObject.FWObjectHelper.hasValue($.LayersControl)) {
                //                      $.LayersControl.SetLayerChecked({ Selector: divArcGISLayersControlJQ, LayerName: Layername.substring(9), IsChecked: false });
                //                  };
                // SetLayerTreeChecked("hb", Layername.substring(9), "");
            };
        };
    };
    if ($.isFunction(Settings.Callback)) {
        Settings.Callback();
    };
}
    ,
//给要素图层添加过滤条件
setFeatureLayerDefinition: function (properties) {
    var settings = {
        Layer: null,
        LayerName: "",
        Where: ""//过滤条件
    };
    $.extend(settings, properties);
    if (!fw.fwObject.FWObjectHelper.hasValue(settings.Layer)) {
        settings.Layer = ArcGISAPI.getOrCreateLayer({ LayerName: "Business_" + settings.LayerName });
    }
    settings.Layer.setDefinitionExpression(settings.Where);
}
    ,
//加载业务图层，统一加载模板(树结构用)
showDynamicLayer: function (Properties) {
    var Settings = {
        "LayerName": "Enterprise_FS"
        , "LayerTitle": ""
        , "LayerType": Code__MapLayerTypeCode.Point
        , "ServiceUrl": ""
        , "showLayeAttribution": false
        , "ShowmaxScale": 0   //图层显示最大Scale 72142.967055358895
        , "ShowminScale": 0//图层显示最小Scale 288571.86822143558
        , "displayOnPan": true
        , "RendererTypeCode": Code__RendererTypeCode.SimpleRenderer
        , "JosnRenderer": ""
        , "SymbolUrl": ""
        , "SymbolUrlArray": null//根据条件来显示Symbol
        , "SymbolColor": "#F70909"
        , "SymbolBorderColor": ""
        , "SymbolBorderWidth": ""
        , "SymbolFillColor": ""
        , "SymbolWidth": 20
        , "SymbolHeight": 20
        , "InfoWindowSettings": null
        , "IsSymbolHLClear": true
    };


    $.extend(Settings, Properties);
    API.Lock();

    if (!ArcGISAPI.checkExistDynamicLayer({ LayerName: "Business_" + Settings.LayerName })) {
        //图层不存在
        if (!fw.fwObject.FWObjectHelper.hasValue(Settings.ServiceUrl)) {
            return;
        }
        LoadDynamicLayer(Settings.LayerType, Settings.ServiceUrl, Settings.LayerName, Settings.showLayeAttribution, Settings);


    }
    else {
        var BusinessLayer = ArcGISAPI.getOrCreateLayer({ LayerName: "Business_" + Settings.LayerName });
        BusinessLayer.show();
        return;
    }
    var BusinessLayer = ArcGISAPI.getOrCreateLayer({ LayerName: "Business_" + Settings.LayerName });
    //      if (BusinessLayer.loaded) {
    //          buildLayerList(layer);
    //      }
    //      else {
    //          dojo.connect(BusinessLayer, "onLoad", buildLayerList);
    //      }


    BusinessLayer.displayOnPan = Settings.displayOnPan;
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.ShowmaxScale) && Settings.ShowmaxScale > 0) {
        BusinessLayer.maxScale = Settings.ShowmaxScale;
    };
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.ShowminScale) && Settings.ShowminScale > 0) {
        BusinessLayer.minScale = Settings.ShowminScale;
    };
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.JosnRenderer) && Settings.JosnRenderer != "") {
        ArcGISAPI.setLayerRenderer({
            BusinessLayerTypeCode: Settings.LayerName
            , RendererTypeCode: Settings.RendererTypeCode
            , JosnRenderer: Settings.JosnRenderer
        });
    };

    var IsShowInfoWindow = false;
    var layerOnMouseClick = null;
    IsShowInfoWindow = fw.fwObject.FWObjectHelper.hasValue(Settings.InfoWindowSettings.DetailUrl);
    if (!IsShowInfoWindow && fw.fwObject.FWObjectHelper.hasValue(Settings.InfoWindowSettings)
        && fw.fwObject.FWObjectHelper.hasValue(Settings.InfoWindowSettings.FieldArray)) {
        for (var i = 0; i < Settings.InfoWindowSettings.FieldArray.length; i++) {
            var Entity = Settings.InfoWindowSettings.FieldArray[i];
            if (fw.fwObject.FWObjectHelper.hasValue(Entity.IsTitle) && Entity.IsTitle) {
                IsShowInfoWindow = true;
            };
            if (fw.fwObject.FWObjectHelper.hasValue(Entity.IsShow) && Entity.IsShow) {
                IsShowInfoWindow = true;
            };
            if (IsShowInfoWindow) {
                break;
            };
        };
    };

    if (IsShowInfoWindow) {
        // 点击显示
        //            var template = new esri.InfoTemplate();
        //            BusinessLayer.infoTemplate = template;
        layerOnMouseClick = function (evt) {
            //如果需要高亮显示的
            if (fw.fwObject.FWObjectHelper.hasValue(Settings.SymbolHLColor)) {
                //清空高亮显示的网格  
                if (Settings.IsSymbolHLClear) {
                    API.ArcGISAPI.clearGraphicsLayer({ LayerName: "GL" });
                }
                ;
                var g = evt.graphic;
                switch (Settings.LayerType) {
                    case Code__MapLayerTypeCode.Polygon:
                        symbol = { lineColor: Settings.SymbolHLColor, borderWidth: Settings.SymbolBorderWidth, fillColor: Settings.SymbolHLFillColor };
                        var graphicSetting = {
                            LayerName: "GL",
                            ReorderLayerIndex: 10,
                            GeometryList: [{ Geometry: g.geometry, Symbol: GetDefaultSymbolByName(SymbolNames.Polygon, symbol), Attributes: g.attributes }]
                        };
                        API.ArcGISAPI.addGraphicToLayer(graphicSetting);
                        break;
                    case Code__MapLayerTypeCode.Line:
                        symbol = { lineColor: Settings.SymbolHLColor, borderWidth: Settings.SymbolBorderWidth };
                        var graphicSetting = {
                            LayerName: "GL",
                            ReorderLayerIndex: 10,
                            GeometryList: [{ Geometry: g.geometry, Symbol: GetDefaultSymbolByName(SymbolNames.Polyline, symbol), Attributes: g.attributes }]
                        };
                        API.ArcGISAPI.addGraphicToLayer(graphicSetting);
                        break;
                    default:
                        break;
                }
                ;
            }
            ;

            var TitleHtml = "";
            var ContentHtml = "";
            var iRowCount = 0;
            if (fw.fwObject.FWObjectHelper.hasValue(Settings.InfoWindowSettings)
                && fw.fwObject.FWObjectHelper.hasValue(Settings.InfoWindowSettings.FieldArray)) {
                var Width = 350;
                if (fw.fwObject.FWObjectHelper.hasValue(Settings.InfoWindowSettings.Width)) {
                    Width = Settings.InfoWindowSettings.Width;
                }
                ;
                var Height = 100;
                if (fw.fwObject.FWObjectHelper.hasValue(Settings.InfoWindowSettings.Height)) {
                    Height = Settings.InfoWindowSettings.Height;
                }
                ;
                var divJQ = $("<div class=\"divMapInfoWindowContent\"></div>").width(Width).appendTo("body");
                var divInfoJQ = $("<div class=\"divInfo\"></div>").appendTo(divJQ);
                var data = { Ticket: $.page.ticket };                       //跳转页面传参
                for (var i = 0; i < Settings.InfoWindowSettings.FieldArray.length; i++) {
                    var Entity = Settings.InfoWindowSettings.FieldArray[i];
                    if (fw.fwObject.FWObjectHelper.hasValue(Entity.IsTitle) && Entity.IsTitle) {
                        TitleHtml = evt.graphic.attributes[Entity.FieldName];
                    };
                    if (fw.fwObject.FWObjectHelper.hasValue(Entity.IsShow) && Entity.IsShow) {
                        if (!fw.fwObject.FWObjectHelper.hasValue(Entity.ShowName)) {
                            Entity.ShowName = Entity.FieldName;
                        };
                        //                            ContentHtml += "    <tr><td>" + Entity.ShowName + ":</td><td>" + (!fw.fwObject.FWObjectHelper.hasValue(evt.graphic.attributes[Entity.FieldName]) ? "" : evt.graphic.attributes[Entity.FieldName]) + "</td></tr>";
                        //                        };
                        if (fw.fwObject.FWObjectHelper.hasValue(evt.graphic.attributes[Entity.FieldName]) && jQuery.trim(evt.graphic.attributes[Entity.FieldName]) != "") {
                            ContentHtml += "    <tr><td>" + Entity.ShowName + ":</td><td>" + evt.graphic.attributes[Entity.FieldName] + "</td></tr>";
                        };
                    };
                    if (fw.fwObject.FWObjectHelper.hasValue(Entity.IsParameter) && Entity.IsParameter) {
                        if (!fw.fwObject.FWObjectHelper.hasValue(Entity.ParameterName)) {
                            Entity.ParameterName = Entity.FieldName;
                        };
                        data[Entity.ParameterName] = evt.graphic.attributes[Entity.FieldName];
                    };
                };
                if (fw.fwObject.FWObjectHelper.hasValue(ContentHtml)) {
                    ContentHtml = "<table style=\"width:auto;\">" + ContentHtml + "</table>";
                    $(ContentHtml).appendTo(divInfoJQ);
                };

                if (fw.fwObject.FWObjectHelper.hasValue(Settings.InfoWindowSettings.DetailUrl)) {
                    var divDetailInfoJQ = $("<div class=\"divDetailInfo\"></div>").appendTo(divJQ).bind("click", data[0], function (e) {
                        var OpenSettings = {
                            TitleHtml: TitleHtml
                            , IsHtmlPage: true
                            , Url: GetAbsoluteUrl(Settings.InfoWindowSettings.DetailUrl, $.Page.WebSiteRootUrl)
                            , Data: data
                            , Width: 900
                            , Height: 600
                        };
                        fw.topWindow().jQueryExtension.UI.Open(OpenSettings);
                    });
                };
                //是否以屏幕点击位置显示弹框
                var g = evt;
                if (Settings.InfoWindowSettings.IsScreenPoint) {

                    g = new esri.geometry.Point(evt.mapPoint.x, evt.mapPoint.y);
                }
                ArcGISAPI.mapInfoWindowShow({
                    Title: TitleHtml
                    , domNode: divJQ[0]
                    , evt: g
                    , Width: divJQ.outerWidth()
                    , Height: divJQ.outerHeight()
                });
                divJQ.parent().css("overflow", "hidden");
                //                    ArcGIS_Map.infoWindow.show(evt.screenPoint, ArcGIS_Map.getInfoWindowAnchor(evt.screenPoint));
                //ArcGISAPI.showPopupdialog(BodyHtml, evt.graphic, TitleHtml, 300, 30 * iRowCount);
                //                  ArcGISAPI.mapInfoWindowShow({
                //                      Title: TitleHtml
                //         , Html: BodyHtml
                //         , Width: 300
                //         , Height: 30 * iRowCount
                //         , evt: evt
                //                  }); ;

            }

        };
        var mouseoverHandler = dojo.connect(BusinessLayer, "onClick", layerOnMouseClick);
        BusinessLayer.mouseoverHandler = mouseoverHandler;
    };

    //加载完成时触发
    if (fw.fwObject.FWObjectHelper.hasValue(BusinessLayer.updateEndHandle)) {
        dojo.disconnect(BusinessLayer.updateEndHandle);
        BusinessLayer.updateEndHandle = null;
    }
    ;
    //        if ($.isFunction(Settings.onCompletedEvent)) {
    var updateEndHandle = dojo.connect(BusinessLayer, "onUpdateEnd", function () {
        API.Unlock();
        //如果有图例的则显示
        if (fw.fwObject.FWObjectHelper.hasValue(Settings.Legend)) {
            //图例
            var settings = {
                ArcGISWindow: API.ArcGISAPI.ArcGISWindow,
                ArcGISMap: API.ArcGISAPI.ArcGISMap,
                width: 150,
                legend: Settings.Legend
            };
            divArcGISLegendJQ.LegendControl(settings);
        }
        ;
    });
    BusinessLayer.updateEndHandle = updateEndHandle;
    //        };

    BusinessLayer.show();
    if (fw.fwObject.FWObjectHelper.hasValue($.LayersControl)) {
        $.LayersControl.SetLayerChecked({ Selector: divArcGISLayersControlJQ, LayerName: Settings.LayerName, IsChecked: true, IsTriggerHandler: false });
    };
}
    ,
//检查某个图层是否在数组ArcGIS_DynamicElementLayer中
checkExistDynamicLayer: function (Properties) {
    var Settings = {
        LayerName: ""//图层名称
    };
    $.extend(Settings, Properties);
    if (ArcGIS_DynamicElementLayer[Settings.LayerName] == undefined && ArcGIS_DynamicElementLayer[Settings.LayerName] == null)
        return false;
    else
        return true;
},
getOrCreateLayer: function (Properties) {
    var Settings = {
        LayerName: null,
        addLayer: null,
        ShowmaxScale: 0,
        ShowminScale: 0
    };
    $.extend(Settings, Properties);

    if (ArcGIS_DynamicElementLayer[Settings.LayerName] == undefined) {
        if (!jQueryExtension.IsUndefinedOrNullOrEmpty(Settings.addLayer)) {
            ArcGIS_DynamicElementLayer[Settings.LayerName] = Settings.addLayer;
        } else {
            ArcGIS_DynamicElementLayer[Settings.LayerName] = new esri.layers.GraphicsLayer();
        }
        ArcGIS_DynamicElementLayer[Settings.LayerName].id = Settings.LayerName;
        if (!jQueryExtension.IsUndefinedOrNullOrEmpty(Settings.ShowmaxScale) && Settings.ShowmaxScale > 0) {
            ArcGIS_DynamicElementLayer[Settings.LayerName].setMaxScale(Settings.ShowmaxScale);
        }
        ;
        if (!jQueryExtension.IsUndefinedOrNullOrEmpty(Settings.ShowminScale) && Settings.ShowminScale > 0) {
            ArcGIS_DynamicElementLayer[Settings.LayerName].setMinScale(Settings.ShowminScale);
        }
        ;
        ArcGIS_Map.addLayer(ArcGIS_DynamicElementLayer[Settings.LayerName]);
    };

    return ArcGIS_DynamicElementLayer[Settings.LayerName];
},
//移除某个图层的graphic
removeGraphic: function (properties) {
    var Settings = {
        LayerName: ""//图层名称
        , LayerNameArray: []//图层名称数组
        , Graphic: null//图形对象
        , Callback: function () {//回调函数
        }
    };
    $.extend(Settings, properties);
    if (!fw.fwObject.FWObjectHelper.hasValue(Settings.LayerTypeCodeArray)) {
        Settings.LayerTypeCodeArray = [];
    };
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.LayerName)) {
        Settings.LayerTypeCodeArray.push(Settings.LayerName);
    };
    if (Settings.LayerTypeCodeArray.length > 0) {
        for (var i = 0; i < Settings.LayerTypeCodeArray.length; i++) {
            if (ArcGISAPI.checkExistDynamicLayer({ LayerName: "Business_" + Settings.LayerTypeCodeArray[i] })) {
                var BusinessLayer = ArcGISAPI.getOrCreateLayer({ LayerName: "Business_" + Settings.LayerTypeCodeArray[i] });
                BusinessLayer.remove(Settings.Graphic);
            }
            else if (ArcGISAPI.checkExistDynamicLayer({ LayerName: Settings.LayerTypeCodeArray[i] })) {
                var BusinessLayer = ArcGISAPI.getOrCreateLayer({ LayerName: Settings.LayerTypeCodeArray[i] });
                BusinessLayer.remove(Settings.Graphic);
            };
        };
    }
    if ($.isFunction(Settings.Callback)) {
        Settings.Callback();
    };
},
//图层重新渲染(旧版本) 
setLayerRenderer: function (Properties) {//设置图层Renderer
    var Settings = {
        BusinessLayerTypeCode: ""
        , RendererTypeCode: Code__RendererTypeCode.SimpleRenderer
        , JosnRenderer: ""
        , MoveFirst: false
        , isBusinessLayer: true
    };

    $.extend(Settings, Properties);
    var Layerbegin = "Business_";
    if (!Settings.isBusinessLayer) { Layerbegin = ""; }
    var BusinessLayer = ArcGISAPI.getOrCreateLayer({ LayerName: Layerbegin + Settings.BusinessLayerTypeCode });
    if (!fw.fwObject.FWObjectHelper.hasValue(Settings.JosnRenderer)) { return; }
    var renderer = null;
    if (Settings.RendererTypeCode == Code__RendererTypeCode.SimpleRenderer) { renderer = new esri.renderer.SimpleRenderer(Settings.JosnRenderer); }
    else if (Settings.RendererTypeCode == Code__RendererTypeCode.UniqueValueRenderer) { renderer = new esri.renderer.UniqueValueRenderer(Settings.JosnRenderer); }
    else if (Settings.RendererTypeCode == Code__RendererTypeCode.ClassBreaksRenderer) { renderer = new esri.renderer.ClassBreaksRenderer(Settings.JosnRenderer); }
    BusinessLayer.show();
    ArcGIS_Map.reorderLayer(BusinessLayer.id, 0);
    BusinessLayer.setRenderer(renderer);
    BusinessLayer.refresh();
}
    ,
//以不同方式对图层进行渲染
rendererLayerByType: function (properties) {
    var Settings = {
        LayerName: ""//图层名称
        , LayerServiceUrl: ""//图层服务地址
        , RenderType: ""//渲染方式
        , Where: ""//渲染条件
        , Symbol: null//符号对象
        , SymbolArray: null//符号对象集合
    };
    $.extend(Settings, properties);

    var businessLayer = null;
    if (!ArcGISAPI.checkExistDynamicLayer({ LayerName: "Business_" + Settings.LayerName })) {
        //创建图层
        businessLayer = new esri.layers.FeatureLayer(Settings.LayerServiceUrl, {
            //MODE_SNAPSHOT MODE_ONDEMAND MODE_SELECTION
            mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
            showAttribution: Settings.showLayeAttribution,
            outFields: ["*"]
        });

        //添加图层
        ArcGISAPI.getOrCreateLayer({
            LayerName: "Business_" + Settings.LayerName,
            addLayer: businessLayer
        });
    } else {
        businessLayer = ArcGISAPI.getOrCreateLayer({ LayerName: "Business_" + Settings.LayerName });
    }
    businessLayer.show();
    //如果有渲染条件
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.Where)) {
        API.ArcGISAPI.setFeatureLayerDefinition({ Layer: businessLayer, Where: Settings.Where });
    }
    ;

    //添加渲染条件
    var renderer = null;
    switch (Settings.RenderType) {
        case RenderType.SimpleRenderer:
            renderer = new esri.renderer.SimpleRenderer(Settings.Symbol);
            break;
        case RenderType.UniqueValueRenderer:
            var attrKey = Settings.SymbolArray.attrKey;
            var renderer = new esri.renderer.UniqueValueRenderer(null, attrKey);
            for (var i = 0; i < Settings.SymbolArray.attrValue.length; i++) {
                var item = Settings.SymbolArray.attrValue[i];
                var symbol = null;
                if (!jQueryExtension.IsUndefinedOrNullOrEmpty(item.symbolUrl)) {
                    picSymbolUrl = window.webSiteRootUrl + item.symbolUrl;
                    symbol = new esri.symbol.PictureMarkerSymbol(picSymbolUrl, Settings.SymbolArray.SymbolWidth, Settings.SymbolArray.SymbolHeight);
                } else if (!jQueryExtension.IsUndefinedOrNullOrEmpty(item.symbol)) {
                    symbol = item.symbol;
                }
                renderer.addValue(item.value, symbol);
            }
            break;
        case RenderType.ClassBreaksRenderer:
            var attrKey = Settings.SymbolArray.attrKey;
            renderer = new esri.renderer.ClassBreaksRenderer(null, attrKey);
            for (var i = 0; i < Settings.SymbolArray.attrValue.length; i++) {
                var item = Settings.SymbolArray.attrValue[i];
                renderer.addBreak(item.begin, item.end, item.symbol);
            }
            ;
            break;
    }
    ;
    if (fw.fwObject.FWObjectHelper.hasValue(renderer)) {
        businessLayer.setRenderer(renderer);
    };
    businessLayer.refresh();
},
//添加单个或列表图形到某个图层
addGraphicToLayer: function (Properties) {
    var Settings = {
        GraphicList: []//坐标数组列表
        , GeometryList: []//图形数组列表
        , LayerName: ""//图层名称
        , Layer: null//图层对象
        , Symbol: null//图形对象
        , Symbol_W: 28//图片宽度
        , Symbol_H: 28//图片高度
        , IsCallback: true//是否有返回值
        , ReorderLayerIndex: null//排序
        , Callback: function () {
            //回调函数
        }
    };
    $.extend(Settings, Properties);
    if (jQueryExtension.IsUndefinedOrNullOrEmpty(Settings.Layer)) {
        Settings.Layer = ArcGISAPI.getOrCreateLayer({ LayerName: "Business_" + Settings.LayerName, ShowmaxScale: Settings.ShowmaxScale, ShowminScale: Settings.ShowmaxScale });
    };
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.ReorderLayerIndex)) {
        this.ArcGISMap.reorderLayer(Settings.Layer, Settings.ReorderLayerIndex);
    };
    Settings.Layer.clear();
    if (!jQueryExtension.IsUndefinedOrNullOrEmpty(Settings.GraphicList)) {
        for (var i = 0; i < Settings.GraphicList.length; i++) {
            var item = Settings.GraphicList[i];
            if (!jQueryExtension.IsUndefinedOrNullOrEmpty(item) && !jQueryExtension.IsUndefinedOrNullOrEmpty(item.posX) && !jQueryExtension.IsUndefinedOrNullOrEmpty(item.posY)) {
                var mapPoint = new esri.geometry.Point(item.posX, item.posY);
                var Symbol = null;
                if (!jQueryExtension.IsUndefinedOrNullOrEmpty(item.Image)) {
                    Symbol = new esri.symbol.PictureMarkerSymbol(item.Image, Settings.Symbol_W, Settings.Symbol_H);
                }
                else if (!jQueryExtension.IsUndefinedOrNullOrEmpty(Settings.Symbol)) {
                    Symbol = new esri.symbol.PictureMarkerSymbol(Settings.Symbol, Settings.Symbol_W, Settings.Symbol_H);
                }
                else {
                    Symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE, 10, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 1), new dojo.Color([0, 255, 0, 0.25]));
                };
                var graphic = new esri.Graphic(mapPoint, Symbol, item);
                Settings.Layer.add(graphic);
            };
        };
    } //图形列表
    else if (fw.fwObject.FWObjectHelper.hasValue(Settings.GeometryList)) {
        for (var i = 0; i < Settings.GeometryList.length; i++) {
            var item = Settings.GeometryList[i];
            var graphic = new esri.Graphic(item.Geometry, item.Symbol, item.Attributes);
            Settings.Layer.add(graphic);
        }
        ;
    }
    ;
    if (!Settings.Layer.visible) {
        Settings.Layer.show();
    };
    if (Settings.IsCallback) {
        if ($.isFunction(Settings.Callback)) {
            Settings.Callback(Settings.Layer);
        };
    }
}
    ,
// 清空某个图层
clearGraphicsLayer: function (Properties) {
    var Settings = {
        LayerName: ""//图层名称
    };
    $.extend(Settings, Properties);
    var ClearGLayer = null;
    if (ArcGISAPI.checkExistDynamicLayer({ LayerName: "Business_" + Settings.LayerName })) {
        ClearGLayer = ArcGIS_Map.getLayer("Business_" + Settings.LayerName);
    } else {
        ClearGLayer = ArcGIS_Map.getLayer(Settings.LayerName);
    }
    if (fw.fwObject.FWObjectHelper.hasValue(ClearGLayer)) {
        ClearGLayer.clear();
    };
}
    ,
//添加文本图层
addDivLabelLayer: function (properties) {
    var Settings = {
        DivLayerName: null,
        EntityList: [],
        Type: Code_LabelPattern.Text, //文本模式，div还是Graphic
        TemplateFunction: function (Entity, SymbolJQ) {

        },
        TextSetting: {//文本字体样式
            id: "",
            style: {
                fontSize: "10px",
                color: "#fff",
                background: "#780320", //$.page.webSiteRootUrl + "web/Maps/Images/symbols/TextSymbolBg/bg.png"
                padding: "3px",
                radius: "3px"
            },
            text: "",
            offset: { x: 15, y: -15 }
        },
        XFieldName: "X",
        YFieldName: "Y",
        HideLevel: 8 //当地图级别等于或低于该数值时隐藏
    };
    $.extend(Settings, properties);
    if (Settings.Type == Code_LabelPattern.Text) {
        var ArcGIS_DivLayersID = ArcGIS_MapDivID + "_DivLayers";
        ArcGIS_DivLayersJQ = $("#" + ArcGIS_DivLayersID);
        if (ArcGIS_DivLayersJQ.length < 1) {
            var rootJQ = $("#divArcGISMap_root");
            ArcGIS_DivLayersJQ = $("<div id=\"" + ArcGIS_DivLayersID + "\" style=\"position: absolute; top: 0px; left: 0px;z-index:1\"></div>").appendTo(rootJQ);
            //ArcGIS_DivLayersJQ = $("<div id=\"" + ArcGIS_DivLayersID + "\" style=\"position: absolute; top: 0px; left: 0px;\"></div>").appendTo(ArcGIS_MapJQ);
        }
        ;
        if (ArcGIS_DivLayersJQ.length > 0) {
            var DivLayerJQ = ArcGISAPI.getDivLayerJQ(Settings);
            if (DivLayerJQ.length < 1) {
                DivLayerJQ = $("<div DivLayerName=\"" + ArcGIS_DivLayersID + "_" + Settings.DivLayerName + "\" style=\"position: absolute; top: 0px; left: 0px;\"></div>").appendTo(ArcGIS_DivLayersJQ);
            }
            ;
            if (DivLayerJQ.length > 0 && Settings.EntityList.length > 0) {

                var Entity = null;
                for (var i = 0; i < Settings.EntityList.length; i++) {
                    Entity = Settings.EntityList[i];
                    Entity.SymbolJQ = $("<div class=\"divSymbol\" style=\"position: absolute; top: 0px; left: 0px;text-align:center;vertical-align:middle; \"></div>").appendTo(DivLayerJQ);
                    Settings.TemplateFunction(Entity, Entity.SymbolJQ, Settings.TextSetting);

                    Entity.SymbolJQ.data("X", Entity[Settings.XFieldName]).data("Y", Entity[Settings.YFieldName]);

                    Entity.SymbolJQ.attr("id", Settings.TextSetting.id); //.width(Settings.TextSetting.width).height(Settings.TextSetting.height);
                    var defaultStyle = Settings.TextSetting.style;
                    Entity.textJQ = $("<span style=' white-space:nowrap; font-size:" + defaultStyle.fontSize + ";color:" + defaultStyle.color + ";background:" + defaultStyle.background + ";padding:" + defaultStyle.padding + ";-moz-border-radius: " + defaultStyle.radius + ";-webkit-border-radius: " + defaultStyle.radius + ";border-radius:" + defaultStyle.radius + ";'>" + Settings.TextSetting.text + "</span>").appendTo(Entity.SymbolJQ);
                    //                        Entity.textJQ.offset(function (n, c) {
                    //                            var newPos = new Object();
                    //                            newPos.left = c.left + Settings.TextSetting.offset.x;
                    //                            newPos.top = c.top + Settings.TextSetting.offset.y;
                    //                            return newPos;
                    //                        });

                    //Entity.textJQ.data("offsetX", Settings.TextSetting.offset.x).data("offsetY", Settings.TextSetting.offset.y);


                    jQueryExtension.mapTargetMoveHandle(ArcGIS_MapJQ, Entity.SymbolJQ);
                }
                ;
                ArcGISAPI.refreshDivLayers();

                var divSymbolJQ = $("div.divSymbol", ArcGIS_DivLayersJQ);
                if (divSymbolJQ.length > 0) {
                    divSymbolJQ.each(function () {
                        var thisJQ = $(this);
                        thisJQ.offset(function (n, c) {
                            var extent = ArcGIS_Map.extent;
                            var width = ArcGIS_MapJQ.width();
                            var height = ArcGIS_MapJQ.height();

                            var X = thisJQ.data("X");
                            var Y = thisJQ.data("Y");
                            var point = esri.geometry.toScreenPoint(extent, width, height, new esri.geometry.Point(X, Y));
                            var newPos = new Object();
                            //                                newPos.left = point.x + Settings.TextSetting.offset.x;
                            //                                newPos.top = point.y + Settings.TextSetting.offset.y;
                            newPos.left = point.x + Settings.TextSetting.offset.x;
                            newPos.top = point.y + Settings.TextSetting.offset.y;
                            return newPos;
                        });
                    });
                }
                ;


                if (!jQueryExtension.IsUndefinedOrNullOrEmpty(ArcGIS_Map.zoomStartHandle)) {
                    dojo.disconnect(ArcGIS_Map.zoomStartHandle);
                    ArcGIS_Map.zoomStartHandle = null;
                }
                ;
                ArcGIS_Map.zoomStartHandle = dojo.connect(ArcGIS_Map, "onZoomStart", function () {
                    ArcGIS_DivLayersJQ.hide();
                });
                if (!jQueryExtension.IsUndefinedOrNullOrEmpty(ArcGIS_Map.zoomEndHandle)) {
                    dojo.disconnect(ArcGIS_Map.zoomEndHandle);
                    ArcGIS_Map.zoomEndHandle = null;
                }
                ;
                ArcGIS_Map.zoomEndHandle = dojo.connect(ArcGIS_Map, "onZoomEnd", function () {

                    var divSymbolJQ = $("div.divSymbol", ArcGIS_DivLayersJQ);
                    if (divSymbolJQ.length > 0) {
                        divSymbolJQ.each(function () {
                            var thisJQ = $(this);
                            var extent = ArcGIS_Map.extent;
                            var width = ArcGIS_MapJQ.width();
                            var height = ArcGIS_MapJQ.height();

                            var X = thisJQ.data("X");
                            var Y = thisJQ.data("Y");


                            var point = esri.geometry.toScreenPoint(extent, width, height, new esri.geometry.Point(X, Y));

                            //                                var Left = point.x - thisJQ.width() / 2;
                            //                                var Top = point.y - thisJQ.height() / 2;
                            var Left = point.x + Settings.TextSetting.offset.x;
                            var Top = point.y + Settings.TextSetting.offset.y;

                            thisJQ.css({
                                left: Left + "px",
                                top: Top + "px"
                            });

                            //                                var textJQ = $(">span", thisJQ);
                            //                                textJQ.offset(function (n, c) {
                            //                                    var _this = $(this);
                            //                                    var newPos = new Object();
                            //                                    newPos.left = Left + _this.data("offsetX");
                            //                                    newPos.top = Top + _this.data("offsetY");
                            //                                    return newPos;
                            //                                });
                        });
                    }
                    ;
                    if (parseInt(ArcGIS_Map.getLevel()) >= Settings.HideLevel) {
                        ArcGIS_DivLayersJQ.show();
                    }
                    ;
                });

                ArcGIS_Map.panEndHandle = dojo.connect(ArcGIS_Map, "onPanEnd", function () {
                    ArcGISAPI.refreshDivLayers();
                    var divSymbolJQ = $("div.divSymbol", ArcGIS_DivLayersJQ);
                    if (divSymbolJQ.length > 0) {
                        divSymbolJQ.each(function () {
                            var thisJQ = $(this);
                            var extent = ArcGIS_Map.extent;
                            var width = ArcGIS_MapJQ.width();
                            var height = ArcGIS_MapJQ.height();

                            var X = thisJQ.data("X");
                            var Y = thisJQ.data("Y");


                            var point = esri.geometry.toScreenPoint(extent, width, height, new esri.geometry.Point(X, Y));

                            //                                var Left = point.x - thisJQ.width() / 2;
                            //                                var Top = point.y - thisJQ.height() / 2;

                            var Left = point.x + Settings.TextSetting.offset.x;
                            var Top = point.y + Settings.TextSetting.offset.y;

                            thisJQ.css({
                                left: Left + "px",
                                top: Top + "px"
                            });

                            //                                var textJQ = $(">span", thisJQ);
                            //                                textJQ.offset(function (n, c) {
                            //                                    var _this = $(this);
                            //                                    var newPos = new Object();
                            //                                    //                                    newPos.left = Left + _this.data("offsetX");
                            //                                    //                                    newPos.top = Top + _this.data("offsetY");
                            //                                    newPos.left = Left;
                            //                                    newPos.top = Top;
                            //                                    thisJQ.css({
                            //                                        left: Left + _this.data("offsetX") + "px",
                            //                                        top: Top + _this.data("offsetY") + "px"
                            //                                    });
                            //                                    return newPos;
                            //                                });
                        });
                    }
                    ;
                });
            }
            ;
        }
        ;
    } else {
        var bussinessLayer = this.getOrCreateLayer({ LayerName: "MyPointTextLayer" });
        for (var i = 0; i < Settings.EntityList.length; i++) {
            Entity = Settings.EntityList[i];

            Settings.TemplateFunction(Entity, null, Settings.TextSetting);
            var point = new esri.geometry.Point(Entity.X, Entity.Y);
            var PoiName = Settings.TextSetting.text;
            var textSymbol = new esri.symbol.TextSymbol(PoiName);
            textSymbol.setColor(new dojo.Color(Settings.TextSetting.style.color));

            var font = new esri.symbol.Font();
            font.setSize(Settings.TextSetting.style.fontSize);
            font.setFamily("微软雅黑");
            textSymbol.setFont(font);
            textSymbol.setOffset((PoiName.length * 10 / 2 + PoiName.length + 5), 15);
            var graphicText = new esri.Graphic(point, textSymbol);

            var symbolBg = new esri.symbol.PictureMarkerSymbol(Settings.TextSetting.style.background, (PoiName.length * 15), 25);
            var graphicBg = new esri.Graphic(point, symbolBg);
            symbolBg.setOffset((PoiName.length * 10 / 2 + PoiName.length + 5), 20);


            bussinessLayer.add(graphicBg);
            bussinessLayer.add(graphicText);
        }
        ;

        if (!fw.fwObject.FWObjectHelper.hasValue(ArcGIS_Map.zoomStartHandle)) {
            dojo.disconnect(ArcGIS_Map.zoomStartHandle);
            ArcGIS_Map.zoomStartHandle = null;
        }
        ;
        ArcGIS_Map.zoomStartHandle = dojo.connect(ArcGIS_Map, "onZoomStart", function () {
            bussinessLayer.hide();
        });
        if (!fw.fwObject.FWObjectHelper.hasValue(ArcGIS_Map.zoomEndHandle)) {
            dojo.disconnect(ArcGIS_Map.zoomEndHandle);
            ArcGIS_Map.zoomEndHandle = null;
        }
        ;
        ArcGIS_Map.zoomEndHandle = dojo.connect(ArcGIS_Map, "onZoomEnd", function () {
            if (parseInt(ArcGIS_Map.getLevel()) >= Settings.HideLevel) {
                bussinessLayer.show();
            }
            ;
        });
    }
    ;
},
//删除文本图层
removeDivLabelLayer: function (properties) {
    var setting = { Type: Code_LabelPattern.Text };
    $.extend(setting, properties);
    if (setting.Type == Code_LabelPattern.Text) {
        this.removeDivLayer({ DivLayerName: setting.DivLayerName });
    } else {
        this.businessLayerRemove({ LayerName: "MyPointTextLayer" });
    };
},
//==========统计图服务==========
//添加统计图
addDivLayer: function (Properties) {
    var Settings = {
        DivLayerName: "" //图层名称
        , EntityList: null//数据源
        , TemplateFunction: function (Entity, SymbolJQ) {
            //加载完成后执行
        }
        , XFieldName: "X" //"X"
        , YFieldName: "Y"//"Y"
        , HideLevel: 0//当地图级别等于或低于该数值时隐藏
    };
    $.extend(Settings, Properties);

    var ArcGIS_DivLayersID = ArcGIS_MapDivID + "_DivLayers";
    ArcGIS_DivLayersJQ = $("#" + ArcGIS_DivLayersID);
    if (ArcGIS_DivLayersJQ.length < 1) {
        var rootJQ = $("#divArcGISMap_root");
        ArcGIS_DivLayersJQ = $("<div id=\"" + ArcGIS_DivLayersID + "\" style=\"position: absolute; top: 0px; left: 0px;z-index:1\"></div>").appendTo(rootJQ);
    }
    ;
    if (ArcGIS_DivLayersJQ.length > 0) {
        var DivLayerJQ = ArcGISAPI.getDivLayerJQ(Settings);
        if (DivLayerJQ.length < 1) {
            DivLayerJQ = $("<div DivLayerName=\"" + ArcGIS_DivLayersID + "_" + Settings.DivLayerName + "\" style=\"position: absolute; top: 0px; left: 0px;\"></div>").appendTo(ArcGIS_DivLayersJQ);
        }
        ;
        if (DivLayerJQ.length > 0 && Settings.EntityList.length > 0) {

            var Entity = null;
            //                for (var i = 0; i < Settings.EntityList.length; i++) {
            //                    Entity = Settings.EntityList[i];
            //                    Entity.SymbolJQ = $("<div class=\"divSymbol\" style=\"position: absolute; top: 0px; left: 0px; \"></div>").appendTo(DivLayerJQ);
            //                    Settings.TemplateFunction(Entity, Entity.SymbolJQ);
            //                    Entity.SymbolJQ.data("X", Entity[Settings.XFieldName]).data("Y", Entity[Settings.YFieldName]);
            //                };
            Entity = Settings.EntityList[0];
            Entity.SymbolJQ = $("<div class=\"divSymbol\" style=\"position: absolute; top: 0px; left: 0px; \"></div>").appendTo(DivLayerJQ);
            Settings.TemplateFunction(Entity, Entity.SymbolJQ);
            Entity.SymbolJQ.data("X", Entity[Settings.XFieldName]).data("Y", Entity[Settings.YFieldName]);
            ArcGISAPI.refreshDivLayers();

            var mapJQ = $("#divArcGIS");
            jQueryExtension.mapTargetMoveHandle(ArcGIS_MapJQ, Entity.SymbolJQ);

            if (fw.fwObject.FWObjectHelper.hasValue(ArcGIS_Map.zoomStartHandle)) {
                dojo.disconnect(ArcGIS_Map.zoomStartHandle);
                ArcGIS_Map.zoomStartHandle = null;
            }
            ;
            ArcGIS_Map.zoomStartHandle = dojo.connect(ArcGIS_Map, "onZoomStart", function () {
                ArcGIS_DivLayersJQ.hide();
            });
            if (fw.fwObject.FWObjectHelper.hasValue(ArcGIS_Map.zoomEndHandle)) {
                dojo.disconnect(ArcGIS_Map.zoomEndHandle);
                ArcGIS_Map.zoomEndHandle = null;
            }
            ;
            ArcGIS_Map.zoomEndHandle = dojo.connect(ArcGIS_Map, "onZoom", function () {
                if (parseInt(ArcGIS_Map.getLevel()) >= Settings.HideLevel) {
                    ArcGIS_DivLayersJQ.show();
                }
                //放大时，隐藏遮罩
                if (parseInt(ArcGIS_Map.getLevel())>=14) {
                    ArcGIS_Map._layers.Business_GL.clear();
                }

                var divSymbolJQ = $("div.divSymbol", ArcGIS_DivLayersJQ);
                if (divSymbolJQ.length > 0) {
                    divSymbolJQ.each(function () {
                        var thisJQ = $(this);
                        var extent = ArcGIS_Map.extent;
                        var width = ArcGIS_MapJQ.width();
                        var height = ArcGIS_MapJQ.height();

                        var X = thisJQ.data("X");
                        var Y = thisJQ.data("Y");


                        var point = esri.geometry.toScreenPoint(extent, width, height, new esri.geometry.Point(X, Y));

                        var Left = point.x - thisJQ.width() / 2;
                        var Top = point.y - thisJQ.height() / 2;
                        thisJQ.css({
                            left: Left + "px",
                            top: Top + "px"
                        });
                    });
                }
                ;
            });
        }
        ;
    }
    ;
},
//获取统计图
getDivLayerJQ: function (Properties) {
    var Settings = {
        DivLayerName: null
    };
    $.extend(Settings, Properties);
    var ArcGIS_DivLayersID = ArcGIS_MapDivID + "_DivLayers";
    return $(">div[DivLayerName='" + ArcGIS_DivLayersID + "_" + Settings.DivLayerName + "']", ArcGIS_DivLayersJQ);
},
//更新统计图
refreshDivLayers: function () {

    var extent = ArcGIS_Map.extent;
    var divSymbolJQ = $("div.divSymbol", ArcGIS_DivLayersJQ);
    if (divSymbolJQ.length > 0) {
        divSymbolJQ.each(function () {
            var thisJQ = $(this);
            var X = thisJQ.data("X");
            var Y = thisJQ.data("Y");
            var Left = ArcGIS_Map.width * (X - extent.xmin) / (extent.xmax - extent.xmin) - thisJQ.width() / 2;
            var Top = ArcGIS_Map.height * ((extent.ymax - extent.ymin) - (Y - extent.ymin)) / (extent.ymax - extent.ymin) - thisJQ.height() / 2;
            thisJQ.css({
                left: Left + "px",
                top: Top + "px"
                //                        , width: Width + "px"
                //                        , height: Height + "px"
            });
        });
    };
},
//移除统计图 
removeDivLayer: function (Properties) {
    var Settings = {
        DivLayerName: null
    };
    $.extend(Settings, Properties);
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.DivLayerName)) {
        var DivLayerJQ = ArcGISAPI.getDivLayerJQ(Settings);
        DivLayerJQ.remove();
        if (fw.fwObject.FWObjectHelper.hasValue(ArcGIS_Map.zoomStartHandle)) {
            dojo.disconnect(ArcGIS_Map.zoomStartHandle);
            ArcGIS_Map.zoomStartHandle = null;
        }
        ;
        if (fw.fwObject.FWObjectHelper.hasValue(ArcGIS_Map.zoomEndHandle)) {
            dojo.disconnect(ArcGIS_Map.zoomEndHandle);
            ArcGIS_Map.zoomEndHandle = null;
        }
        ;
    } else {
        $("#divArcGISMap_DivLayers").empty();
    };
}
    ,
//==========栅格图层服务==========
// 添加栅格图层服务
showRasterLayer: function (Properties) {
    var Settings = {
        MapServicesUrl: ""
        , LayerIndex: 0
        , opacity: 1
    };
    $.extend(Settings, Properties);

    if (m_RasterLayer == null) {
        if (!fw.fwObject.FWObjectHelper.hasValue(Settings.MapServicesUrl)) {
            Settings.MapServicesUrl = "";
        }
        if (Settings.MapServicesUrl != "") {
            m_RasterLayer = new esri.layers.ArcGISDynamicMapServiceLayer(Settings.MapServicesUrl);
            m_RasterLayer.id = "RasterLayer";
            m_RasterLayer.opacity = Settings.opacity;
            ArcGIS_Map.addLayer(m_RasterLayer);
        }
    }


    m_RasterLayer.setVisibleLayers([Settings.LayerIndex], true);
    if (ArcGIS_Map.layerIds[ArcGIS_Map.layerIds.length - 1] != "RasterLayer") {
        ArcGIS_Map.reorderLayer("RasterLayer", ArcGIS_Map.layerIds.length - 1);
    }
    else {
        this.mapResize();
    }
}
    ,
//移除栅格图层
rasterLayerClear: function () {
    if (m_RasterLayer != null) {
        ArcGIS_Map.removeLayer(m_RasterLayer);
        m_RasterLayer = null;
    }
}
    ,
/**************************************************************************
//弹出窗
***************************************************************************/
//修改弹框大小
mapInfoWindowResize: function (Properties) {
    var Settings = {
        Width: 0
        , Height: 0
    };
    $.extend(Settings, Properties);
    if (!fw.fwObject.FWObjectHelper.hasValue(Settings.Width) || Settings.Width <= 0) {
        Settings.Width = ArcGIS_Map.infoWindow.width;
    }
    if (!fw.fwObject.FWObjectHelper.hasValue(Settings.Height) || Settings.Height <= 0) {
        Settings.Height = ArcGIS_Map.infoWindow.height;
    }
    ArcGIS_Map.infoWindow.resize(Settings.Width + 7, Settings.Height + 28 + 9);
}
    ,
// 显示地图弹框
mapInfoWindowShow: function (Properties) {
    var Settings = {
        Title: ""
        , domNode: null
        , Html: ""
        , Width: 0
        , Height: 0
        , evt: null
    };
    $.extend(Settings, Properties);

    if (fw.fwObject.FWObjectHelper.hasValue(Settings.Width) && Settings.Width > 0
        && fw.fwObject.FWObjectHelper.hasValue(Settings.Height) && Settings.Height > 0) {
        ArcGIS_Map.infoWindow.resize(Settings.Width + 7, Settings.Height + 28 + 9);
    }
    ArcGIS_Map.infoWindow.setTitle(Settings.Title);
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.domNode)) {
        ArcGIS_Map.infoWindow.setContent(Settings.domNode);
    }
    else {
        var cp2 = new dijit.layout.ContentPane({
            title: "MapTip"
        }, dojo.create('div'));
        cp2.set('content', Settings.Html);

        ArcGIS_Map.infoWindow.setContent(cp2.domNode);
    }

    var g;
    if (!fw.fwObject.FWObjectHelper.hasValue(Settings.evt)) {
        return;
    }
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.evt) && Settings.evt.declaredClass == "esri.Graphic") {
        g = Settings.evt;
    }
    else if (fw.fwObject.FWObjectHelper.hasValue(Settings.evt) && Settings.evt.declaredClass == "esri.geometry.Point") {
        ArcGIS_Map.infoWindow.show(Settings.evt);
        return;
    } else {
        g = Settings.evt.graphic;
    }
    ;
    if (!fw.fwObject.FWObjectHelper.hasValue(g)) {
        return;
    }
    if (g.geometry.type == Code__MapGeometryType.point) {
        ArcGIS_Map.infoWindow.show(g.geometry);
    }
    else if (g.geometry.type == Code__MapGeometryType.polygon || g.geometry.type == Code__MapGeometryType.polyline) {
        ArcGIS_Map.infoWindow.show(API.ArcGISAPI.getPolygonCenter(g.geometry));
    }
    else {
        ArcGIS_Map.infoWindow.show(Settings.evt.screenPoint, ArcGIS_Map.getInfoWindowAnchor(Settings.evt.screenPoint));
    }
    ;

}
    ,
//隐藏地图弹框
mapInfoWindowHide: function (Properties) {
    ArcGIS_Map.infoWindow.hide();
}
    ,
/**************************************************************************
//符号
***************************************************************************/
//修改symbol样式
customSetSymbol: function (Properties) {
    var Settings = {
        Layer: null//图层对象
        , LayerName: ""//图层名称，不为空将修改整个图层
        , Graphic: null//单个图形对象
        , Symbol: null//图形样式
    };
    $.extend(Settings, Properties);
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.LayerName)) {
        if (ArcGISAPI.checkExistDynamicLayer({ LayerName: Settings.LayerName })) {
            Settings.Layer = ArcGIS_DynamicElementLayer[Settings.LayerName];
        }
        else if (ArcGISAPI.checkExistDynamicLayer({ LayerName: "Business_" + Settings.LayerName })) {
            Settings.Layer = ArcGIS_DynamicElementLayer["Business_" + Settings.LayerName];
        };
    }

    if (fw.fwObject.FWObjectHelper.hasValue(Settings.Layer)) {
        for (var i = 0; i < Settings.Layer.graphics.length; i++) {
            Settings.Layer.graphics[i].setSymbol(Settings.Symbol);
        }
        if (!Settings.Layer.visible)
            Settings.Layer.show();
    }
    else if (fw.fwObject.FWObjectHelper.hasValue(Settings.Graphic)) {
        Settings.Graphic.setSymbol(Settings.Symbol);
    }
    ;
}
    ,
//设置业务点位显示图标
setBusinessLayerSymbol: function (Properties) {//设置业务点位显示图标
    var Settings = {
        GraphicList: []
        , LayerKeyFieldName: "CODE"
        , KeyFieldName: "CODE"
        , BusinessLayerTypeCode: ""
        , CantonCode: ""
    };
    $.extend(Settings, Properties);

    var ShowList = jExtension.EntityListToDictionary(Settings.GraphicList, Settings.KeyFieldName); //此处决定了显示指定区域的点

    var BusinessLayer = ArcGISAPI.getOrCreateLayer({ LayerName: "Business_" + Settings.BusinessLayerTypeCode });

    //        if (BusinessLayer.declaredClass == "esri.layers.FeatureLayer") {

    //        }
    //        else {
    var graphics = BusinessLayer.graphics;
    var bFrist = true;

    for (var i = 0; i < graphics.length; i++) {

        var attributes = graphics[i].attributes;
        var symbolSet = ShowList[graphics[i].attributes[Settings.LayerKeyFieldName]]; //判断graphics[i].attributes[Settings.LayerKeyFieldName]中的值是否在ShowList 中，如果有就赋值给symbolSet
        if (fw.fwObject.FWObjectHelper.hasValue(symbolSet)) {
            var iWidth = 20;
            if (fw.fwObject.FWObjectHelper.hasValue(Settings.Symbol_W))
                iWidth = Settings.Symbol_W;
            var iHeight = 20;
            if (fw.fwObject.FWObjectHelper.hasValue(Settings.Symbol_H))
                iHeight = Settings.Symbol_H;
            if (fw.fwObject.FWObjectHelper.hasValue(symbolSet.Width))
                iWidth = symbolSet.Width;
            if (fw.fwObject.FWObjectHelper.hasValue(symbolSet.Height))
                iHeight = symbolSet.Height;
            var pointsymbol = null;

            if (fw.fwObject.FWObjectHelper.hasValue(graphics[i].symbolKey)
                && fw.fwObject.FWObjectHelper.hasValue(symbolSet.symbolKey)
                && graphics[i].symbolKey == symbolSet.symbolKey
            ) {
                graphics[i].visible = true;
            }
            else {
                if (fw.fwObject.FWObjectHelper.hasValue(symbolSet.Image)) {
                    pointsymbol = new esri.symbol.PictureMarkerSymbol(symbolSet.Image, iWidth, iHeight);
                    graphics[i].symbol = pointsymbol;
                }
                else if (fw.fwObject.FWObjectHelper.hasValue(symbolSet.Color)) {
                    pointsymbol = new esri.symbol.SimpleMarkerSymbol(
                        esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
                        iWidth,
                        new esri.symbol.SimpleLineSymbol(
                            esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                            new dojo.Color([255, 255, 255, 1]),
                            1
                        ),
                        new dojo.Color(symbolSet.Color));
                    graphics[i].symbol = pointsymbol;

                }
            };
            graphics[i].symbolKey = symbolSet.symbolKey;

            graphics[i].visible = true;
        } else {
            graphics[i].visible = false;
        };
        //        var ssymbol = GetWaterStationPicsymbol(attributes[0].WaterLevel, attributes[0].WaterState);
        //        graphics[i].symbol = ssymbol;
        //        graphics[i].visible = true;
    }

    if (!BusinessLayer.visible) {

        BusinessLayer.show();

    }
    if (fw.fwObject.FWObjectHelper.hasValue($.LayersControl)) {
        $.LayersControl.SetLayerChecked({ Selector: divArcGISLayersControlJQ, LayerName: Settings.BusinessLayerTypeCode, IsChecked: true, IsTriggerHandler: false });
    };
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.CantonCode)) {

        return;
    }
    else {
        this.mapResize();
    };
    // };
}
    ,
/**************************************************************************
//其它
***************************************************************************/
//清除闪烁图层
clearflashLayer: function () {
    if (m_FalshLayer != null)
        m_FalshLayer.clear();
}
    ,
//多点闪烁，动点是个gif图片
flashPointList: function (Properties) {
    var Settings = {
        LayerName: ""//图层名称
        , BusinessCodeList: []//数据源关键字列表
        , AttrKey: ""//属性列名
        , FlashTime: 10000 //动画时间，默认10000毫秒，可选 
        , OffsetX: 0//偏移X
        , OffsetY: 0//偏移Y
    };
    /*var Settings = {
    BusinessLayerTypeCode: "WaterStation"
    , BusinessCodeList: ["000001","000002"]
    , FlashTime: 10000
  
    };
    API.ArcGISAPI.flashPointList(Settings);*/
    $.extend(Settings, Properties);

    if (m_FalshLayer == null) {
        m_FalshLayer = ArcGISAPI.getOrCreateLayer({ LayerName: "FalshLayer" });
        // ArcGIS_Map.reorderLayer("FalshLayer", ArcGIS_Map.graphicsLayerIds.length - 1);
        ArcGIS_Map.reorderLayer("FalshLayer", 0);
    }
    m_FalshLayer.clear();
    var BusinessLayer = ArcGISAPI.getOrCreateLayer({ LayerName: "Business_" + Settings.BusinessLayerTypeCode });
    //  if (BusinessLayer.declaredClass == "esri.layers.FeatureLayer") {
    //  }
    //   else {
    var graphics = BusinessLayer.graphics;
    //            var point = new esri.geometry.Point(120, 30);
    var symbol = new esri.symbol.PictureMarkerSymbol($.page.webSiteRootUrl + 'Web/Maps/Images/Location.gif', 40, 40);
    //            var graphics = new esri.Graphic(point, symbol);
    //            m_FalshLayer.add(graphics);

    var bFrist = true;

    for (var i = 0; i < graphics.length; i++) {
        if (Settings.BusinessCodeList.Contains(graphics[i].attributes.点位编码)) {
            m_FalshLayer.add(new esri.Graphic(graphics[i].geometry, symbol));

            //break;
        }
        //                if (fw.fwObject.FWObjectHelper.hasValue(Settings.BusinessCodeList[graphics[i].attributes.点位编码])) {
        //                    m_FalshLayer.add(new esri.Graphic(graphics[i].geometry, symbol));

        //                    break;
        //                }
    }
    //  }
    setTimeout(ArcGISAPI.clearflashLayer, Settings.FlashTime);
}
    ,
//改变地图容器大小后，地图刷新
mapResize: function () {
    if (fw.fwObject.FWObjectHelper.hasValue(resizeTimer)) {
        clearTimeout(resizeTimer);
    }
    ;
    resizeTimer = setTimeout(function () {
        this.ArcGIS_Map.resize();
        this.ArcGIS_Map.reposition();
    }, 500);
}
    ,
//改变图层的显示顺序
reOrderLayer: function (Properties) {
    var Settings = {
        LayerName: ""//图层名称
        , Layer: null//图层对象
        , ReorderLayerIndex: null//排序  
    };
    $.extend(Settings, Properties);

    //如果没有图层对象则查找
    if (!fw.fwObject.FWObjectHelper.hasValue(Settings.Layer)) {
        Settings.Layer = ArcGISAPI.getOrCreateLayer({ LayerName: "Business_" + Settings.LayerName });
    };
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.ReorderLayerIndex)) {
        this.ArcGISMap.reorderLayer(Settings.Layer, Settings.ReorderLayerIndex);
    };
}
    ,
//根据图层编号获取矢量图层索引
getLayerIndex: function (mapId) {
    var LayerIndex = -1;
    for (var i = 0; i < ArcGIS_Map.layerIds.length; i++) {
        if (ArcGIS_Map.layerIds[i] == mapId) {
            LayerIndex = i;
            break;
        };
    };
    return LayerIndex;
}
    ,
/*************************************************************************
//查询
**************************************************************************/
//QueryTask从已有的Geometry中搜索,并创建图层
taskQueryByGeometry: function (properties) {
    var settings = {
        geometry: null
        , layerName: ""
        , layerServicesUrl: ""
        , onCompletedEvent: function (evt) {
            //evt返回featureList
        }
    };
    $.extend(settings, properties);
    var BusinessLayer = null;
    if (!fw.fwObject.FWObjectHelper.hasValue(settings.geometry)) {
        return;
    };
    if (fw.fwObject.FWObjectHelper.hasValue(settings.layerServicesUrl)) {
        BusinessLayer = new esri.layers.FeatureLayer(settings.layerServicesUrl, {
            mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
            showAttribution: true,
            opacity: 0.8,
            outFields: ["*"]
        });
    } else {
        if (!fw.fwObject.FWObjectHelper.hasValue(settings.layerName)) {
            return;
        };
        BusinessLayer = ArcGISAPI.getOrCreateLayer({ LayerName: "Business_" + settings.layerName });
    };
    if (BusinessLayer.declaredClass == "esri.layers.FeatureLayer") {
        dojo.connect(BusinessLayer, "onSelectionComplete", function (features) {
            if ($.isFunction(settings.onCompletedEvent)) {
                settings.onCompletedEvent(features);
            };
        });
        var selectQuery = new esri.tasks.Query();
        selectQuery.geometry = settings.geometry;
        BusinessLayer.selectFeatures(selectQuery, esri.layers.FeatureLayer.SELECTION_NEW);
    } else {
        var graphics = BusinessLayer.graphics;
        var bFrist = true;
        var features = [];
        for (var i = 0; i < graphics.length; i++) {
            if (graphics[i].visible && settings.Geometry.contains(graphics[i].geometry)) {
                features.push(graphics[i]);
            };
        };
        if ($.isFunction(ArcGIS_Toolbars.DrawSettings.onCompletedEvent)) {
            settings.onCompletedEvent(features);
        };
    };
}
    ,
//QueryTask查询，不创建图层，返回features对象
taskQueryReturnFeatures: function (properties) {
    var settings = {
        layerUrl: ""//图层服务地址
        , where: ""//查询条件
        , geometry: null//空间查询图形
        , spatialRelationship: this.SpatialRel.CONTAINS//空间查询类别
        , onCompletedEvent: function () {
            //完成回调事件
        }
    };
    $.extend(settings, properties);

    var queryTask = new esri.tasks.QueryTask(settings.layerUrl);
    var query = new esri.tasks.Query();
    query.returnGeometry = true;
    query.outSpatialReference = ArcGIS_Map.spatialReference;
    query.outFields = ["*"];
    if (fw.fwObject.FWObjectHelper.hasValue(settings.where)) {
        query.where = settings.where;
    } else {
        if (fw.fwObject.FWObjectHelper.hasValue(settings.geometry)) {
            query.geometry = settings.geometry;
        } else {
            query.where = "1=1";
        }
        ;
    }
    ;
    if (fw.fwObject.FWObjectHelper.hasValue(settings.geometry)) {
        query.geometry = settings.geometry;
    };
    if (fw.fwObject.FWObjectHelper.hasValue(settings.spatialRelationship)) {
        query.spatialRelationship = settings.spatialRelationship;
    };

    dojo.connect(queryTask, "onComplete", function (featureSet) {
        settings.onCompletedEvent(featureSet);
    });
    dojo.connect(queryTask, "onError", function (err) {
        //alert("函数taskQueryReturnFeatures出错：" + err.details);
    });
    queryTask.execute(query);
}
    ,
//IdentifyQuery空间查询
taskIdentify: function (properties) {
    var settings = {
        geometry: null//空间查询对象
        , layerUrl: ""//图层服务地址
        , layerIds: ""//查询子图层编号
        , tolerance: 1//允许像素容差
        , returnGeometry: true
        , onCompletedEvent: function () {
            //查询完成回调函数
        }
    };
    $.extend(settings, properties);

    //        var pGeometryService = new esri.tasks.GeometryService(STGeometryUrl);
    //        var params = new esri.tasks.BufferParameters();
    //        params.distances = [2];
    //        params.outSpatialReference = ArcGIS_Map.spatialReference;
    //        params.bufferSpatialReference = new esri.SpatialReference(4326);
    //        params.geometries = [settings.geometry];
    //        pGeometryService.buffer(params, function (geometries) {

    var IdentifyTask = new esri.tasks.IdentifyTask(settings.layerUrl);
    var params = new esri.tasks.IdentifyParameters();
    params.tolerance = settings.tolerance;
    params.returnGeometry = settings.returnGeometry;
    if (fw.fwObject.FWObjectHelper.hasValue(settings.layerIds)) {
        params.layerIds = [settings.layerIds];
    };
    params.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
    params.width = ArcGIS_Map.width;
    params.height = ArcGIS_Map.height;
    params.mapExtent = ArcGIS_Map.extent;
    params.geometry = settings.geometry;
    IdentifyTask.execute(params, function (idResults) {
        settings.onCompletedEvent(idResults);
    });
    //        }, function () { alert("错误！") });


}
    ,
//FindTask属性查询
taskFind: function (properties) {
    var settings = {
        layerUrl: ""//图层服务地址
        , layerIds: ""//查询子图层编号
        , searchFields: ""//查询属性列名
        , searchText: ""//查询关键字
        , onCompletedEvent: function () {
            //完成回调事件
        }
    };
    $.extend(settings, properties);

    FindTask = new esri.tasks.FindTask(settings.layerUrl);
    findParams = new esri.tasks.FindParameters();
    findParams.returnGeometry = true;
    if (fw.fwObject.FWObjectHelper.hasValue(settings.layerIds)) {
        findParams.layerIds = [settings.layerIds];
    }
    findParams.searchFields = [settings.searchFields];
    findParams.searchText = settings.searchText;
    FindTask.execute(findParams, function (idResults) {
        settings.onCompletedEvent(idResults);
    }, function (err) {
        //alert("FindTask出错!");
    });
}
    ,
//获取图层上所有图像信息（属性、图形）
getLayerFields: function (Properties) {
    var Settings = {
        MapServicesUrl: ""
        , Callback: function (e) {

        }
    };
    $.extend(Settings, Properties);
    var queryTask = new esri.tasks.QueryTask(Settings.MapServicesUrl);
    var query = new esri.tasks.Query();
    query.returnGeometry = true;
    query.where = '1=1';
    query.outFields = ["*"];
    // query.outSpatialReference = ArcGIS_Map.spatialReference;
    dojo.connect(queryTask, "onComplete", function (featureSet) {

        var oRes = {
            fieldAliases: featureSet.fieldAliases,
            fields: featureSet.fields,
            features: featureSet.features,
            geometryType: featureSet.geometryType
        };
        if ($.isFunction(Settings.Callback)) {
            Settings.Callback(oRes);
        }
    });

    dojo.connect(queryTask, "onError", function (err) {
        if ($.isFunction(Settings.Callback)) {
            Settings.Callback(null);
        }
    });
    queryTask.execute(query);
}
    ,
//生成缓冲区
geometryBuffer: function (Properties) {
    var Settings = {
        geometry: null//几何图形的经纬度值
        , wkid: 4326//生成缓冲区的坐标系代码102100
        , distances: [1]//缓冲区距离
        , unit: esri.tasks.GeometryService.UNIT_KILOMETER//缓冲区单位
        , symbol: ""//样式
        , callback: function () {
            //加载完成后触发
        }
    };
    $.extend(Settings, Properties);
    if (!fw.fwObject.FWObjectHelper.hasValue(BufferLayer)) {
        BufferLayer = ArcGISAPI.getOrCreateLayer({ LayerName: "BufferLayer", isBusinessLayer: false });
    };
    BufferLayer.clear();
    BufferLayer.show();
    var params = new esri.tasks.BufferParameters();
    params.distances = Settings.distances;
    params.bufferSpatialReference = new esri.SpatialReference({ wkid: Settings.wkid });
    params.outSpatialReference = ArcGIS_Map.spatialReference;
    params.unit = Settings.unit;
    var symbol = "";
    if (!fw.fwObject.FWObjectHelper.hasValue(Settings.symbol)) {
        symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                new dojo.Color([255, 255, 255]), 1), new dojo.Color([255, 0, 0, 0.25]));
    } else {
        symbol = Settings.symbol;
    };
    showBuffer = function (evt) {
        for (var i = evt.length - 1; i >= 0; i--) {
            for (var z = 0; z < evt[i].rings.length; z++) {
                var polygon = new esri.geometry.Polygon();
                polygon.addRing(evt[i].rings[z]);
                var polygonGraphic = new esri.Graphic(polygon, symbol);
                BufferLayer.add(polygonGraphic);
                if ($.isFunction(Settings.callback)) {
                    Settings.callback(polygon);
                };
            };
        };
    };
    showErr = function (err) {
        alert(err.message);
    };
    if (Settings.geometry.type == "polygon") {
        var outSR = new esri.SpatialReference({ wkid: Settings.wkid });
        m_GeometryService.project([Settings.geometry], outSR, function (outgeometry) {
            m_GeometryService.simplify(outgeometry, function (simplifiedGeometries) {
                params.geometries = simplifiedGeometries;
                m_GeometryService.buffer(params, showBuffer, showErr);
            }, showErr);
        }, showErr);
    }
    else {
        params.geometries = [Settings.geometry];
        m_GeometryService.buffer(params, showBuffer, showErr);
    };
}
    ,
/*************************************************************************
//绘图
**************************************************************************/
//画图工具
setMapDrawTool: function (Properties) {
    isValited = false;
    if (ArcGIS_Toolbars == null) {
        ArcGIS_Toolbars = new esri.toolbars.Draw(ArcGIS_Map);
        dojo.connect(ArcGIS_Toolbars, "onDrawEnd", DrawAddToMap);
    }

    if (m_DrawCloseLayer == null) {
        m_DrawCloseLayer = ArcGISAPI.getOrCreateLayer({ LayerName: "DrawCloseLayer" });
        dojo.connect(m_DrawCloseLayer, "onClick", function (evt) {
            m_DrawCloseLayer_onClick(evt);
        });
        ArcGIS_Map.reorderLayer("DrawCloseLayer", ArcGIS_Map.layerIds.length - 1);
    }
    if (m_DrawLayer == null)
        m_DrawLayer = ArcGISAPI.getOrCreateLayer({ LayerName: "DrawLayer" });
    var Settings = {
        MapDrawToolCode: Code__MapDrawToolCode.Circle,
        onCompletedEvent: function (evt) {
            //evt返回BusinessLayerTypeCodeList
        }
    };
    $.extend(Settings, Properties);
    if (fw.fwObject.FWObjectHelper.hasValue(Settings.onClickEvent) && $.isFunction(Settings.onClickEvent)) {
        if (fw.fwObject.FWObjectHelper.hasValue(m_DrawLayer.clickHandler)) {
            dojo.disconnect(m_DrawLayer.clickHandler);
            m_DrawLayer.clickHandler = null;
        }
        var clickHandler = dojo.connect(m_DrawLayer, "onClick", function (evt) {
            Settings.onClickEvent(evt);
        });
        m_DrawLayer.clickHandler = clickHandler;
    }
    //        dojo.connect(m_DrawLayer, "onMouseDown", graphicsOnMouseDown);
    //        dojo.connect(m_DrawLayer, "onMouseUp", graphicsOnMouseUp);
    //esri.toolbars.Draw.CIRCLE
    ArcGIS_Toolbars.activate(esri.toolbars.Draw[Settings.MapDrawToolCode]);


    ArcGIS_Toolbars.DrawSettings = Settings;
    ArcGIS_Map.hideZoomSlider();


    var mouseDragEvent = null;
    var oldLoc = null;
    var paraLoc = null;
    function graphicsOnMouseDown(evt) {
        ArcGIS_Map.disableMapNavigation();
        if (mouseDragEvent != null) {
            dojo.disconnect(mouseDragEvent);
        }
        oldLoc = evt.mapPoint;
        paraLoc = evt.mapPoint;
        mouseDragEvent = dojo.connect(m_DrawLayer, "onMouseDrag", graphicsOnMouseDrag);
    }


    function graphicsOnMouseUp(evt) {
        if (mouseDragEvent != null) {
            dojo.disconnect(mouseDragEvent);
            ArcGIS_Map.enableMapNavigation();
            var moveLoc = evt.mapPoint;
            moveLoc.setSpatialReference(ArcGIS_Map.spatialReference);
            evt.graphic.setGeometry(moveLoc);
            //结束时返回对象
            Settings.onDragEndEvent(evt);
        }
    }

    function graphicsOnMouseDrag(evt) {
        if (mouseDragEvent != null) {
            var moveLoc = evt.mapPoint;
            var geoPt = esri.geometry.webMercatorToGeographic(evt.mapPoint);
            moveLoc.setSpatialReference(ArcGIS_Map.spatialReference);
            evt.graphic.setGeometry(moveLoc);
        }
    }
}
    ,
//画指定的几何图形
drawByGeometry: function (Properties) {
    var Settings = {
        GeometryType: ""
        , GeometryJson: null
        , symbolJson: null
        , ShowText: ""
        , TextSymbolJson: null
        , LayerName: ""
    };
    $.extend(Settings, Properties);
    var symbol = null;
    var geometry = null;
    if (!fw.fwObject.FWObjectHelper.hasValue(Settings.GeometryJson)) {
        return;
    }
    //new esri.symbol.SimpleMarkerSymbol(json)
    var TextPoint = null;
    switch (Settings.GeometryType) {
        case "point":
            geometry = new esri.geometry.Point(Settings.GeometryJson);
            if (fw.fwObject.FWObjectHelper.hasValue(Settings.symbolJson)
                && fw.fwObject.FWObjectHelper.hasValue(Settings.TextSymbolJson)) {
                if (fw.fwObject.FWObjectHelper.hasValue(Settings.ShowText)
                    && fw.fwObject.FWObjectHelper.hasValue(Settings.TextSymbolJson)) {
                    symbol = new esri.symbol.TextSymbol(Settings.TextSymbolJson);
                }
                else {
                    symbol = new esri.symbol.SimpleMarkerSymbol(Settings.symbolJson);
                }
            }
            else {
                symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE, 10, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 1), new dojo.Color([0, 255, 0, 0.25]));
            }
            break;
        case "polyline":
            if (fw.fwObject.FWObjectHelper.hasValue(Settings.symbolJson)) {
                symbol = new esri.symbol.SimpleLineSymbol(Settings.symbolJson);
            }
            else {
                symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 0, 0]), 2);
            }
            geometry = new esri.geometry.Polyline(Settings.GeometryJson);
            if (fw.fwObject.FWObjectHelper.hasValue(Settings.ShowText)) {
                var iindex = geometry.paths[geometry.paths.length - 1].length / 2;
                TextPoint = geometry.getPoint(0, iindex);

            }

            break;
        case "polygon":
            if (fw.fwObject.FWObjectHelper.hasValue(Settings.symbolJson)) {
                symbol = new esri.symbol.SimpleFillSymbol(Settings.symbolJson);
            }
            else {
                symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 0, 0.25]));
            }
            geometry = new esri.geometry.Polygon(Settings.GeometryJson);
            if (fw.fwObject.FWObjectHelper.hasValue(Settings.ShowText)) {
                TextPoint = this.getPolygonCenter(geometry);

            }
            break;
        case "extent":
            if (fw.fwObject.FWObjectHelper.hasValue(Settings.symbolJson)) {
                symbol = new esri.symbol.SimpleFillSymbol(Settings.symbolJson);
            }
            else {
                symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 0, 0.25]));
            }
            geometry = new esri.geometry.Extent(Settings.GeometryJson);
            if (fw.fwObject.FWObjectHelper.hasValue(Settings.ShowText)) {
                TextPoint = this.getPolygonCenter(geometry);

            }
            break;
        case "multipoint":
            if (fw.fwObject.FWObjectHelper.hasValue(Settings.symbolJson)) {
                symbol = new esri.symbol.SimpleMarkerSymbol(Settings.symbolJson);
            }
            else {
                symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_DIAMOND, 20, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0]), 1), new dojo.Color([255, 255, 0, 0.5]));
            }
            geometry = new esri.geometry.Multipoint(Settings.GeometryJson);
            break;
    };

    var graphic = new esri.Graphic(geometry, symbol);
    DrawByGeometryLayer = ArcGISAPI.getOrCreateLayer({ LayerName: "Business_" + Settings.LayerName });
    DrawByGeometryLayer.add(graphic);

    if (fw.fwObject.FWObjectHelper.hasValue(TextPoint)) {
        var TextJosn = {
            "type": "esriTS",
            "color": [0, 0, 0, 255],
            "backgroundColor": [246, 255, 197, 255],
            "borderLineColor": null,
            "verticalAlignment": "bottom",
            "horizontalAlignment": "left",
            "rightToLeft": false,
            "angle": 0,
            "xoffset": 0,
            "yoffset": 0,
            "text": Settings.ShowText,
            "font": {
                "family": "Arial",
                "size": 14,
                "style": "normal",
                "weight": "",
                "decoration": "none"
            }
        };
        if (fw.fwObject.FWObjectHelper.hasValue(Settings.TextSymbolJson))
            TextJosn = Settings.TextSymbolJson;
        var testgraphic = new esri.Graphic(TextPoint, new esri.symbol.TextSymbol(TextJosn));
        DrawByGeometryLayer.add(testgraphic);
    }
    if (!DrawByGeometryLayer.visible)
        DrawByGeometryLayer.show();
}
    ,
//清除指定画的几何图形
clearDrawByGeometryLayer: function () {
    if (DrawByGeometryLayer != null)
        DrawByGeometryLayer.clear();
}
    ,
//清除地图绘制图形
clearMapDrawGraphics: function () {
    if (m_DrawLayer != null)
        m_DrawLayer.clear();
}
    , stopBaseEvent: function (event) {
    dojo._base.event.stop(event);
}
};
