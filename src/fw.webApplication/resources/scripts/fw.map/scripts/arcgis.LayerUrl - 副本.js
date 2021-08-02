var ST_ImgLayerUrl = "http://10.32.200.51/ArcGIS/rest/services/jsyxdt/MapServer";
var ST_DXLayerUrl = "http://10.32.200.51/ArcGIS/rest/services/jsdem/MapServer";
var ST_DMLayerUrl = "http://10.32.200.51/ArcGIS/rest/services/JSYXZJ/MapServer";
var STGeometryUrl = "http://10.32.200.51/ArcGIS/rest/services/Geometry/GeometryServer";
var JSBjLayerUrl = "http://10.32.200.143/ArcGIS/rest/services/region/MapServer";
var GeometryUrl = "http://58.210.204.106:10052/arcgis/rest/services/Geometry/GeometryServer";



//地图范围
var GXMin = null; //120.35694778515625;
var GYMin = null; //31.401126699218754;
var GXMax = null; //121.34571731640625;
var GYMax = null; //31.93259032226563;
var GWkid = 4326;
var ZoomLevel = 10;
var CantonLayerUrl = "";
var BJLayerUrl = "";
var BJMapServiceLayerType = "";
var newFullExtent = "";
var layerIds = "0";
var searchFields = "";
var attrName = "";
var ChartDivZoomLevel = "";
var minScale = "";
var CantonCodeList = ["321282"];//已经有图层的行政区
function getInitMapParameter(cantonCode) {
    if (!fw.fwObject.FWObjectHelper.hasValue(cantonCode)) {
        return;
    };
    switch (cantonCode) {
        case CantonCodeList[0]:
            CantonLayerUrl = "http://101.201.47.137:6080/arcgis/rest/services/jjqh/MapServer?f=jsapi";
            //CantonLayerUrl = "http://101.201.47.137:6080/arcgis/rest/services/%E5%B8%B8%E7%86%9F%E8%A1%8C%E6%94%BF%E5%8C%BA1/MapServer?f=jsapi";
            BJLayerUrl = 'http://101.201.47.137:6080/arcgis/rest/services/jjbj/MapServer';

            GXMin = 119.76435778515625;
            GYMin = 31.772308699218754;
            GXMax = 120.76548831640625;
            GYMax = 32.19694432226563;

            BJMapServiceLayerType = "esri.layers.ArcGISDynamicMapServiceLayer"; //ArcGISTiledMapServiceLayer //ArcGISDynamicMapServiceLayer奇了怪了，明明发布的是切片服务，反而此处设置为动态地图服务可以加载
            ZoomLevel = 10;
            layerIds = "0"; //"0,1";
            searchFields = "FK_CTCode";
            attrName = "TownName";
            ChartDivZoomLevel = 11;
            minScale = 144285.93411071779;
            break;
        case CantonCodeList[1]:

            CantonLayerUrl = "https://101.201.47.137:6443/arcgis/rest/services/%E5%B8%B8%E7%86%9F%E8%A1%8C%E6%94%BF%E5%8C%BA111/MapServer";
            BJLayerUrl = "https://101.201.47.137:6443/arcgis/rest/services/%E5%86%9C%E6%9D%91%E6%B1%A1%E6%B0%B4%E5%A4%84%E7%90%86%E7%9B%91%E6%8E%A7%E5%B8%B8%E7%86%9F%E8%BE%B9%E7%95%8C11/MapServer";

            //上海崇明市extend范围
            GXMin = 120.88978469921875;
            GYMin = 31.48455412841797;
            GXMax = 121.87855423046875;
            GYMax = 32.029750661621094;

            BJMapServiceLayerType = "esri.layers.ArcGISDynamicMapServiceLayer"; //ArcGISTiledMapServiceLayer //ArcGISDynamicMapServiceLayer奇了怪了，明明发布的是切片服务，反而此处设置为动态地图服务可以加载
            ZoomLevel = 10;
            layerIds = "0"; //"0,1";
            searchFields = "FK_CTCode";
            attrName = "TownName";
            ChartDivZoomLevel = 11;
            minScale = 144285.93411071779;
            break;
        case CantonCodeList[2]:
            CantonLayerUrl = "http://101.201.47.137:6080/arcgis/rest/services/%E5%B8%B8%E7%86%9F%E8%A1%8C%E6%94%BF%E5%8C%BA1/MapServer?f=jsapi";
            BJLayerUrl = "http://101.201.47.137:6080/arcgis/rest/services/%E5%86%9C%E6%9D%91%E6%B1%A1%E6%B0%B4%E5%A4%84%E7%90%86%E7%9B%91%E6%8E%A7%E5%B8%B8%E7%86%9F%E8%BE%B9%E7%95%8C1/MapServer";

            //济南市extend范围
            GXMin = 116.56529129101563;
            GYMin = 36.44556792236328;
            GXMax = 117.5032490546875;
            GYMax = 36.90356047607422;

            BJMapServiceLayerType = "esri.layers.ArcGISDynamicMapServiceLayer"; //ArcGISTiledMapServiceLayer //ArcGISDynamicMapServiceLayer奇了怪了，明明发布的是切片服务，反而此处设置为动态地图服务可以加载
            ZoomLevel = 10;
            layerIds = "0"; //"0,1";
            searchFields = "FK_CTCode";
            attrName = "TownName";
            ChartDivZoomLevel = 11;
            minScale = 144285.93411071779;
            break;

        case CantonCodeList[3]:
            CantonLayerUrl = "http://101.201.47.137:6080/arcgis/rest/services/%E5%B8%B8%E7%86%9F%E8%A1%8C%E6%94%BF%E5%8C%BA1xxx/MapServer?f=jsapi";
            BJLayerUrl = "http://101.201.47.137:6080/arcgis/rest/services/%E5%86%9C%E6%9D%91%E6%B1%A1%E6%B0%B4%E5%A4%84%E7%90%86%E7%9B%91%E6%8E%A7%E5%B8%B8%E7%86%9F%E8%BE%B9%E7%95%8C1/MapServer";
            //无锡市
            GXMin = 119.2171162421875;
            GYMin = 31.0138586328125;
            GXMax = 121.3264912421875;
            GYMax = 32.02185423828125;
            BJMapServiceLayerType = "esri.layers.ArcGISDynamicMapServiceLayer"; //ArcGISTiledMapServiceLayer //ArcGISDynamicMapServiceLayer奇了怪了，明明发布的是切片服务，反而此处设置为动态地图服务可以加载
            ZoomLevel = 10;
            layerIds = "0"; //"0,1";
            searchFields = "FK_CTCode";
            attrName = "TownName";
            ChartDivZoomLevel = 11;
            minScale = 144285.93411071779;
            break;

        default:
            CantonLayerUrl = "https://101.201.47.137:6443/arcgis/rest/services/%E5%B8%B8%E7%86%9F%E8%A1%8C%E6%94%BF%E5%8C%BA111/MapServer";
            BJLayerUrl = "https://101.201.47.137:6443/arcgis/rest/services/%E5%86%9C%E6%9D%91%E6%B1%A1%E6%B0%B4%E5%A4%84%E7%90%86%E7%9B%91%E6%8E%A7%E5%B8%B8%E7%86%9F%E8%BE%B9%E7%95%8C11/MapServer";

            //上海崇明市extend范围
            GXMin = 120.88978469921875;
            GYMin = 31.48455412841797;
            GXMax = 121.87855423046875;
            GYMax = 32.029750661621094;
            BJMapServiceLayerType = "esri.layers.ArcGISDynamicMapServiceLayer"; //ArcGISTiledMapServiceLayer //ArcGISDynamicMapServiceLayer奇了怪了，明明发布的是切片服务，反而此处设置为动态地图服务可以加载
            ZoomLevel = 11;
            layerIds = "0"; //"0,1";
            searchFields = "FK_CTCode";
            attrName = "TownName";
            ChartDivZoomLevel = 12;
            minScale = 144285.93411071779;
            break;

    }
    ;
    if (fw.fwObject.FWObjectHelper.hasValue(BJMapServiceLayerType) && fw.fwObject.FWObjectHelper.hasValue(BJLayerUrl)) {
        var settings = {
            MapServiceLayerType: BJMapServiceLayerType
             , ServiceUrl: BJLayerUrl
             , LayerName: "BJ"
        }
        API.ArcGISAPI.addMapService(settings);

    } else {

        return;
    };
    if (fw.fwObject.FWObjectHelper.hasValue(GXMin) && fw.fwObject.FWObjectHelper.hasValue(GYMin) && fw.fwObject.FWObjectHelper.hasValue(GXMax) && fw.fwObject.FWObjectHelper.hasValue(GYMax)) {
        setTimeout(function () {
            newFullExtent = new esri.geometry.Extent(GXMin, GYMin, GXMax, GYMax, esri.SpatialReference({ wkid: GWkid }))
            API.ArcGISAPI.mapChangeExtent(newFullExtent);
        }, 300);
    } else { return; };

    setTimeout(function () {
        CLSS_Show();
    }, 1500);
    //    var liModuleJQ = $("#divMenuSystem")[0].getElementsByTagName('span');
    //    if (liModuleJQ.length == 0) {
    //        var setliModuleFuc = setInterval(function () {
    //            liModuleJQ = $("#divMenuSystem")[0].getElementsByTagName('span');
    //            if (liModuleJQ.length > 0) {
    //                clearInterval(setliModuleFuc);
    //                $(liModuleJQ).each(function () {
    //                    if ($(this).attr("name") == "实时监控") {
    //                        $(this).click();
    //                        var setIntervalDivModuleJQ = setInterval(
    //                        function () {
    //                        var liMenuJQ = $("#divMenuSystem_1")[0].getElementsByTagName('span');
    //                         if ($(liMenuJQ).length > 0) {
    //                         $(liMenuJQ).each(function () {
    //                        if ($(this).attr("name") == "设施概况") {
    //                            $(this).click();
    //                        };
    //                    });
    //                    clearInterval(setIntervalDivModuleJQ);
    //                }
    //            }, 1000
    //            );
    //                    };
    //                });
    //            };
    //        }, 1000);
    //    } else {
    //        $(liModuleJQ).each(function () {
    //            if ($(this).attr("name") == "实时监控") {
    //                $(this).click();
    //                var setIntervalDivModuleJQ = setInterval(
    //            function () {
    //                var liMenuJQ = $("#divMenuSystem_1")[0].getElementsByTagName('span');
    //                if ($(liMenuJQ).length > 0) {
    //                    $(liMenuJQ).each(function () {
    //                        if ($(this).attr("name") == "设施概况") {
    //                            $(this).click();
    //                        };
    //                    });
    //                    clearInterval(setIntervalDivModuleJQ);
    //                }
    //            }, 1000
    //            );
    //            };
    //        });
    //    }

    //divDataSynchronizationStatusJQ.show();
    getAlarmFuc();
    // &("#divDataSynchronizationStatus").dis
};
var vInterval = null, setLoadStatus = null;
function getAlarmFuc() {
    //右下角报警
    CheckValue = 0;
    // $.Speaker.ClearDataSource({ Selector: "#divDataSynchronizationStatus" });
    divDataSynchronizationStatusJQ.empty();
    divSpeaker = null;
    LoadStatus();
    setLoadStatus = setInterval(LoadStatus, 600000);
    divDataSynchronizationStatusJQ.click();
    //sss   $("#divDataSynchronizationStatus div.jQueryExtension_UI_Speaker_divOpen").click();
    //sss    ControlData.ControlJQs.Speaker_divCloseJQ.show();
    //    vInterval = setInterval(function () {
    //        $("#divDataSynchronizationStatus div.jQueryExtension_UI_Speaker_divOpen").click();
    //        CheckValue = 0;
    //        clearInterval(vInterval);
    //    }, 1000);

}
//var CLSSLayerUrl = "http://58.210.204.106:10052/arcgis/rest/services/%E5%86%9C%E6%9D%91%E6%B1%A1%E6%B0%B4%E5%A4%84%E7%90%86%E7%9B%91%E6%8E%A7%E5%B8%B8%E7%86%9F/Point/MapServer/0";
//var WSPointLayerUrl = "http://58.210.204.106:10053/arcgis/rest/services/%E5%B8%B8%E7%86%9F%E6%B1%A1%E6%B0%B4/CSPolluteWater/MapServer";
//var DuanLayerUrl = "http://58.210.204.106:10052/arcgis/rest/services/%E5%86%9C%E6%9D%91%E6%B1%A1%E6%B0%B4%E5%A4%84%E7%90%86%E7%9B%91%E6%8E%A7%E5%B8%B8%E7%86%9F/Point/MapServer/1";
//var CunCantonLayerUrl = "http://58.210.204.106:10052/arcgis/rest/services/%E5%86%9C%E6%9D%91%E6%B1%A1%E6%B0%B4%E5%A4%84%E7%90%86%E7%9B%91%E6%8E%A7%E5%B8%B8%E7%86%9F/DBCanton/MapServer/0";
//var CantonLayerUrl = "http://58.210.204.106:10052/arcgis/rest/services/%E5%86%9C%E6%9D%91%E6%B1%A1%E6%B0%B4%E5%A4%84%E7%90%86%E7%9B%91%E6%8E%A7%E5%B8%B8%E7%86%9F/DBCanton/MapServer";
//var TownCantonLayerUrl = "http://58.210.204.106:10052/arcgis/rest/services/%E5%86%9C%E6%9D%91%E6%B1%A1%E6%B0%B4%E5%A4%84%E7%90%86%E7%9B%91%E6%8E%A7%E5%B8%B8%E7%86%9F/DBCanton/MapServer/1";




