var Code__MapServiceLayerType = {
    "ImageService": "esri.layers.ArcGISImageServiceLayer"
    , "TiledMapService": "esri.layers.ArcGISTiledMapServiceLayer"
    , "DynamicMapService": "esri.layers.ArcGISDynamicMapServiceLayer"
    , "TianDiTuImageService": "esri.layers.TianDiTuTiledMapServiceLayer_Image"
    , "TianDiTuPlaceService": "esri.layers.TianDiTuTiledMapServiceLayer_PlaceName"
    , "TianDiTuVectorService": "esri.layers.TianDiTuTiledMapServiceLayer_Vector"
    , "GoogleImageService": "esri.layers.GoogleTiledMapServiceLayer_Image"
    , "GoogleVectorService": "esri.layers.GoogleTiledMapServiceLayer_Vector"
    , "GoogleTerrainService": "esri.layers.GoogleTiledMapServiceLayer_Terrain"
    , "BaiDuImageService": "esri.layers.BaiDuTiledMapServiceLayer_Image"
    , "BaiDuVectorService": "esri.layers.BaiDuTiledMapServiceLayer_Vector"


    , "TianDiTuService_img_c": "esri.layers.TianDiTuTiledMapServiceLayer_img_c"
    , "TianDiTuService_cia_c": "esri.layers.TianDiTuTiledMapServiceLayer_cia_c"
    , "TianDiTuService_vec_c": "esri.layers.TianDiTuTiledMapServiceLayer_vec_c"
    , "TianDiTuService_cva_c": "esri.layers.TianDiTuTiledMapServiceLayer_cva_c"
    , "TianDiTuService_ter_c": "esri.layers.TianDiTuTiledMapServiceLayer_ter_c"
    , "TianDiTuService_cta_c": "esri.layers.TianDiTuTiledMapServiceLayer_cta_c"
    , "TianDiTuService_NJDLG_DT_18_20N": "esri.layers.TianDiTuTiledMapServiceLayer_NJDLG_DT_18_20N"
    , "TianDiTuService_NJDLG_ZJ_18_20N": "esri.layers.TianDiTuTiledMapServiceLayer_NJDLG_ZJ_18_20N"
    , "TianDiTuService_NJDOM_ZJ_18_19_N": "esri.layers.TianDiTuTiledMapServiceLayer_NJDOM_ZJ_18_19_N"
    , "TianDiTuService_NJDOM_DT_18_19_N": "esri.layers.TianDiTuTiledMapServiceLayer_NJDOM_DT_18_19_N"
};

//下拉菜单显示名
var Code__MapServiceLayerTypeChinese = {
    "esri.layers.ArcGISImageServiceLayer": "图片服务"
    , "esri.layers.ArcGISTiledMapServiceLayer": "平铺地图服务"
    , "esri.layers.ArcGISDynamicMapServiceLayer": "动态地图服务"
    , "esri.layers.TianDiTuTiledMapServiceLayer_Image": "添地图图片服务"
    , "esri.layers.TianDiTuTiledMapServiceLayer_PlaceName": "添地图地方服务"
    , "esri.layers.TianDiTuTiledMapServiceLayer_Vector": "添地图矢量服务"
    , "esri.layers.GoogleTiledMapServiceLayer_Image": "谷歌图片地图服务"
    , "esri.layers.GoogleTiledMapServiceLayer_Vector": "谷歌矢量地图服务"
    , "esri.layers.GoogleTiledMapServiceLayer_Terrain": "谷歌地形地图服务"
    , "esri.layers.BaiDuTiledMapServiceLayer_Image": "百度图片地图服务"
    , "esri.layers.BaiDuTiledMapServiceLayer_Vector": "百度矢量地图服务"


    , "TianDiTuService_img_c": "esri.layers.TianDiTuTiledMapServiceLayer_img_c"
    , "TianDiTuService_cia_c": "esri.layers.TianDiTuTiledMapServiceLayer_cia_c"
    , "TianDiTuService_vec_c": "esri.layers.TianDiTuTiledMapServiceLayer_vec_c"
    , "TianDiTuService_cva_c": "esri.layers.TianDiTuTiledMapServiceLayer_cva_c"
    , "TianDiTuService_ter_c": "esri.layers.TianDiTuTiledMapServiceLayer_ter_c"
    , "TianDiTuService_cta_c": "esri.layers.TianDiTuTiledMapServiceLayer_cta_c"
};

var Code__MapLayerTypeCode = {
    Map: "Map"//地图
    , Point: "Point" //点图层
    , Line: "Line" //线图层
    , Polygon: "Polygon" //面图层
};


var Code__MapGeometryType = {
    point: "point" //点图层
    , polyline: "polyline" //线图层
    , polygon: "polygon" //面图层
    , extent: "extent"
    , multipoint: "multipoint"
};

var Code__RendererTypeCode = {
    "ClassBreaksRenderer": "ClassBreaksRenderer"
    , "SimpleRenderer": "SimpleRenderer"
    , "UniqueValueRenderer": "UniqueValueRenderer"
};

var Code__MapDrawToolCode = {
    "Arrow": "ARROW"
    , "Circle": "CIRCLE"
    , "Ellipse": "ELLIPSE"
    , "Freehandpolygon": "FREEHAND_POLYGON"
    , "Freehandpolyline": "FREEHAND_POLYLINE"
    , "Polygon": "POLYGON"
    , "Polyline": "POLYLINE"
    , "line": "LINE"
    , "Extent": "EXTENT"
    , "Triangle": "TRIANGLE"
};

//图形名称列表
var SymbolNames = {
    Point: "Point",
    Point_Picture: "Point_Picture", //图片
    Point_Text: "Point_Text", //文字
    Point_Size: "Point_Size", //重点企业污染源点
    Point_Size_Highlighte: "Point_Size_Highlighte", //重点企业污染源点高亮
    Point_CheckPoint: "Point_CheckPoint", //调查点样式
    Polyline: "Polyline",
    Polyline_WG: "Polyline_WG",
    Polyline_Highlighte: "Polyline_Highlighte", //高亮显示线
    Polygon: "Polygon",
    Polygon_Highlighte: "Polygon_Highlighte",
    Polygon_SJKFQ: "Polygon_SJKFQ", //省级以上开发区样式
    Polygon_Canton: "Polygon_Canton"//默认厂区域
};

//渲染方式
var RenderType = {
    UniqueValueRenderer: "UniqueValueRenderer", //唯一值渲染
    ClassBreaksRenderer: "ClassBreaksRenderer", //分级渲染
    SimpleRenderer: "SimpleRenderer"
};
//Arcgis自定义监听事件
var CustomEvent = {
    OnMarkEndEvent: "onMarkEndEvent", //标注结束后触发
    OnWGLoadedEvent: "onWGLoadedEvent"//网格加载完成后触发
};

//文本模式
var Code_LabelPattern = {
    Graphic: "Graphic",
    Text: "Text"
};