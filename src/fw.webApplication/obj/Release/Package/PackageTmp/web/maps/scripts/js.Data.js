
//时间类型（污染源中查询企业数据时间时用这个）
var Code__DataType = {
    Year: "900"
    , Season: "803"
    , Month: "800"
    , Week: "707"
    , Date: "700"
    , Hour: "600"
    , TenMinute: "501"
    , Minute: "500"
    , Second: "400"
    , Real: "100"
};

var Code__SetType = {
    Union: "11"          //并集   
    , Inner: "12"        //交集 
};

var Code__WaterMonitorFactor = {
    WaterQuality: "WaterQuality"        //水质 
};

var NullWaterLevelCode = "-32768";  //水质等级是null时的Code

var Dictionary__WaterQualityType = {   //各水质类别
    "1": "Ⅰ类",
    "2": "Ⅱ类",
    "3": "Ⅲ类",
    "4": "Ⅳ类",
    "5": "Ⅴ类",
    "6": "劣Ⅴ类"
};
Dictionary__WaterQualityType[NullWaterLevelCode] = "未联网";
var Array__WaterQualityTypeCode = ["1", "2", "3", "4", "5", "6", NullWaterLevelCode];

//断面图层编码
var Code_SectionCoverageType = {
    "Statecontrolledsections": "1",
    "Provincescontrolledsections": "2"
};


var UserBelongCantonNameBehindWord = "其它";         //加在UserBelongCantonName后面的字段，如苏州市其它

var Dictionary__WaterLevelType = {   //水质类别
    "1": { WaterQualityTypeCode: '1', WaterQualityTypeName: 'Ⅰ类', Color: "#00FF00" },
    "2": { WaterQualityTypeCode: '2', WaterQualityTypeName: 'Ⅱ类', Color: "#FFFF00" },
    "3": { WaterQualityTypeCode: '3', WaterQualityTypeName: 'Ⅲ类', Color: "#FF7E00" },
    "4": { WaterQualityTypeCode: '4', WaterQualityTypeName: 'Ⅳ类', Color: "#FF0000" },
    "5": { WaterQualityTypeCode: '5', WaterQualityTypeName: 'Ⅴ类', Color: "#99004C" },
    "6": { WaterQualityTypeCode: '6', WaterQualityTypeName: '劣Ⅴ类', Color: "#99004C" }
};
Dictionary__WaterLevelType[NullWaterLevelCode] = { WaterQualityTypeCode: NullWaterLevelCode, WaterQualityTypeName: '未联网', Color: "#CBC3C1" };

//断面控制类型编码（国控、省控、其它）
var Code_SectionControlType = {
    "1": "国控",
    "2": "省控"
};
Code_SectionControlType[NullWaterLevelCode] = "其它";

var WaterQualityType_Select = "3"; //默认选择的水质类别
var Const__WaterQualityInterval = 0.5;   //各水质类别间隔
var Array__DrinkWaterNoWaterQualityDataTypeCode = ["400", "500"];   //饮用水源地无水质类别的数据类型
var Array__WaterSiteNoWaterQualityDataTypeCode = ["400", "500"];   //水质自动站无水质类别的数据类型
var EnterpriseMonitorSiteLiquidFactor_Select = "011"; //默认选择的COD
var EnterpriseMonitorSiteGasFactor_Select = "002"; //默认选择的SO2

var Code__AirMonitorFactor = {
    AirLevel: "AirLevel"        //空气质量 
};
var Dictionary__AirLevelType = {   //空气质量指数类别
    "1": { AirLevelName: '一级', AirLevel: "优", Color: "#00FF00" },
    "2": { AirLevelName: '二级', AirLevel: "良", Color: "#FFFF00" },
    "3": { AirLevelName: '三级', AirLevel: "轻度污染", Color: "#FF7E00" },
    "4": { AirLevelName: '四级', AirLevel: "中度污染", Color: "#FF0000" },
    "5": { AirLevelName: '五级', AirLevel: "重度污染", Color: "#99004C" },
    "6": { AirLevelName: '六级', AirLevel: "严重污染", Color: "#7E0023" }
};
Dictionary__AirLevelType[NullWaterLevelCode] = { AirLevelName: '未联网', AirLevel: "未知", Color: "#CBC3C1" };

var AirLevelType_Select = "3"; //默认选择的水质类别
var Const__AirLevelInterval = 0.5;
var Array__AirNoAirLevelDataTypeCode = ["400", "500"];

var Dictionary__MonitorDataTimeSpan = {
    Year: -5                //年
    , Month: -1               //年
    , Date: -1               //月
    , Hour: -1              //日
    , TenMinute: -1          //十分钟AddHour(-0.25)
    , Real: -1             //实时
};

var Code__BusinessLayerType = {
    "DrinkWaterLayer": "DrinkWater"//饮用水源地
    , "DrinkWaterProtection": "DrinkProtection"//饮用水源地保护区
            , "FSLayer": "Enterprise_FS"//废水
            , "FQLayer": "Enterprise_FQ"
            , "WSCLayer": "Enterprise_WSC"
            , "AirLayer": "AirStation"//空气子站
            , "NoiseLayer": "Noise"//噪声
            , "WaterStationLayer": "WaterStation"//水质自动站
            , "GKSectionsLayer": "Statecontrolledsections"//国控断面
            , "SKSectionsLayer": "Provincescontrolledsections"//省控断面
};



//污染源排口类型
var Code__MonitorSiteType = {
    Liquid: 'Liquid', //废水
    Gas: 'Gas', //废气
    LiquidTreatment: 'LiquidTreatment'//污水处理厂
};

//污染源排口类型编码
var Code__MonitorSiteTypeCode = {
    Liquid: '1',
    Gas: '2',
    Input_Liquid: '3'
};

var Code__EnterpriseMonitorFactor = {
    Quantity: "Quantity"        //流量
};

//污染源企业状态
var Dictionary__MonitorDataStatus = {
    "01": { DataStatusName: "正常", Color: "#009900" },
    "02": { DataStatusName: "超标", Color: "#FF0000" },
    "03": { DataStatusName: "中断", Color: "#FFCC00" },
    "04": { DataStatusName: "故障", Color: "#CC6600" },
    "05": { DataStatusName: "停产", Color: "#787878" }
};

//固废分类颜色
var Code__SolidTypeColor = {
    "Deal": "#009900",
    "Produce": "#FFCC00"
};

//与污染源系统对应的时间类型
var Code__MonitorDataTypeWry =
{
    RealTime: 0,
    TenMinute: 1,
    Hour: 2,
    Day: 3,
    Month: 4,
    Year: 5
};

//固废企业类别
var Code__UnitType =
{
    Produce: 1,
    Deal: 2,
    Storage: 3
};

//固废企业类别编码
var Code__UnitTypeCode =
{
    Produce: "Produce",
    Deal: "Deal"
};

//辐射源类别
var Code__RaditionType =
{
    RaditionAll: "0",
    RaditionWater: "1",
    RaditionAir: "2",
    RaditionSoil: "3",
    RaditionElectromagnetic: "4"
};

//辐射源图层名称
var Code__RadiationName =
{
    "1": "Radiation_Water", //水辐射
    "2": "Radiation_Air", //气辐射
    "3": "Radiation_Soil", //固废辐射
    "4": "Radiation_Electromagnetic"//电辐射
};

var Dictionary__RadiationControlType = {   //辐射源控制类型对应颜色
    "1": { ControlTypeCode: '1', ControlTypeName: '国控', Color: "#0000FF" },
    "2": { ControlTypeCode: '2', ControlTypeName: '省控', Color: "#33FFFF" },
    "3": { ControlTypeCode: '3', ControlTypeName: '市控', Color: "#AA7700" },
    "4": { ControlTypeCode: '4', ControlTypeName: '县（区）控', Color: "#7700BB" },
    "5": { ControlTypeCode: '5', ControlTypeName: '其它', Color: "#0000FF" }
};

var categoriesPointDictionary__Canton = {
"江苏省":{X: 118.829248, Y: 31.92155, Code: "320000"}
    ,"南京市": { X: 118.829248, Y: 31.92155, Code: "320100" }
    , "无锡市": { X: 120.065877, Y: 31.518741, Code: "320200" }
    , "徐州市": { X: 117.500764, Y: 34.338931, Code: "320300" }
    , "常州市": { X: 119.616213, Y: 31.626046, Code: "320400" }
     , "苏州市": { X: 120.618594, Y: 31.349737, Code: "320500" }
    , "南通市": { X: 120.974479, Y: 32.202799, Code: "320600" }
    , "连云港市": { X: 119.101914, Y: 34.52696, Code: "320700" }
    , "淮安市": { X: 118.979263, Y: 33.365799, Code: "320800" }
    , "盐城市": { X: 120.14462, Y: 33.524863, Code: "320900" }
    , "扬州市": { X: 119.466693, Y: 32.730653, Code: "321000" }
    , "镇江市": { X: 119.447246, Y: 32.009742, Code: "321100" }
    , "泰州市": { X: 120.040831, Y: 32.571517, Code: "321200" }
    , "宿迁市": { X: 118.491508, Y: 33.731915, Code: "321300" }
    , "常熟市": { X: 120.75, Y: 31.65, Code: "" }
    , "昆山市": { X: 120.48, Y: 31.06, Code: "" }
    , "吴中区": { X: 120.45, Y: 31.27, Code: "" }
    , "吴江市": { X: 120.38, Y: 30.88, Code: "" }
    , "太仓市": { X: 121.10, Y: 31.45, Code: "" }
    , "张家港市": { X: 120.50, Y: 31.75, Code: "" }
    , "相城区": { X: 120.62, Y: 31.41, Code: "" }
    , "虎丘区": { X: 121.04, Y: 31.65, Code: "" }
    , "高新区": { X: 120.92, Y: 31.21, Code: "" }
    , "沧浪区": { X: 120.60, Y: 31.65, Code: "" }
    , "苏州市市本级": { X: 120.62, Y: 31.32, Code: "" }
    , "平江区": { X: 120.72, Y: 31.42 }
    , "320100": { X: 118.829248, Y: 31.92155 }
    , "320200": { X: 120.065877, Y: 31.518741 }
    , "320300": { X: 117.500764, Y: 34.338931 }
    , "320400": { X: 119.616213, Y: 31.626046 }
    , "320500": { X: 120.618594, Y: 31.349737 }
    , "320600": { X: 120.974479, Y: 32.202799 }
    , "320700": { X: 119.101914, Y: 34.52696 }
    , "320800": { X: 118.979263, Y: 33.365799 }
    , "320900": { X: 120.14462, Y: 33.524863 }
    , "321000": { X: 119.466693, Y: 32.730653 }
    , "321100": { X: 119.447246, Y: 32.009742 }
    , "321200": { X: 120.040831, Y: 32.571517 }
    , "321300": { X: 118.491508, Y: 33.731915 }
};

//日数据时PM2.5和PM10的一小时平均无分指数
var Array__NotContainIndex = ["a34002", "a34004"];

//打开页面新增参数
var Code__jQueryExtensionOpenSettingAdd = {
    Top: 80
    , Right: 20
    , Bottom: 20
    , Left: 20
    , Width: 1024
};

//移动执法 执法颜色
var Dictionary__CantonColor = {
    0: { Color: [252, 38, 00]}//"#FC2600" }
    , 1: { Color: [222, 89, 27]}//"#DE591B" }
    , 2: { Color: [253, 118, 00]}//"#FD7600" }
    , 3: { Color: [252, 153, 00]}//"#FC9900" }
    , 4: { Color: [251, 186, 00]}//"#FBBA00" }
    , 5: { Color: [251, 254, 00]}//"#FBFE00" }
    , 6: { Color: [252, 38, 00]}//"#FDDB00" }
    , 7: { Color: [253, 219, 00]}//"#016100" }
    , 8: { Color: [45, 119, 01]}//"#2D7701" }
    , 9: { Color: [80, 140, 00]}//"#508C00" }
    , 10: { Color: [123, 169, 00]}//"#7BA900" }
    , 11: { Color: [161, 195, 00]}//"#A1C300" }
    , 12: { Color: [204, 222, 00]}//"#CCDE00" }
    , 13: { Color: [252, 252, 252]}//"#FCFCFC" }
    , 99: { Color: [204, 222, 00]}//"#CCDE00" }
};

//移动执法发布的基目录,用于取移动执法的服务和页面
var YDZF__webSiteRootUrl = "http://10.32.200.70:8001/ydzf/"; // "http://192.168.253.31:9000/ydzf_web/";

//测试
// YDZF__webSiteRootUrl = "http://localhost:7732/"; 

//图形名称列表
var SymbolNames = {
    Point: "Point",
    Point_Picture: "Point_Picture", //图片
    Point_Text: "Point_Text", //文字
    Point_Size: "Point_Size", //重点企业污染源点
    Point_Size_Highlighte: "Point_Size_Highlighte", //重点企业污染源点高亮
    Point_CheckPoint:"Point_CheckPoint",//调查点样式
    Polyline: "Polyline",
    Polyline_WG:"Polyline_WG",
    Polyline_Highlighte:"Polyline_Highlighte",//高亮显示线
    Polygon: "Polygon",
    Polygon_Highlighte: "Polygon_Highlighte",
    Polygon_SJKFQ: "Polygon_SJKFQ",//省级以上开发区样式
    Polygon_Canton:"Polygon_Canton"//默认行政区域
};

//渲染方式
var RenderType = {
    UniqueValueRenderer: "UniqueValueRenderer",//唯一值渲染
    ClassBreaksRenderer: "ClassBreaksRenderer",//分级渲染
    SimpleRenderer: "SimpleRenderer"
};

//Arcgis自定义监听事件
var CustomEvent = {
    OnMarkEndEvent: "onMarkEndEvent",//标注结束后触发
    OnWGLoadedEvent: "onWGLoadedEvent"//网格加载完成后触发
};


//var cantonListAll = [{ "code": "320581", "parentCode": null, "name": "常熟市", "childTreeDataList": [], "level": 0 }, { "code": "320581101000", "parentCode": "320581", "name": "梅李镇", "childTreeDataList": [], "level": 1 }, { "code": "320581102000", "parentCode": "320581", "name": "海虞镇", "childTreeDataList": [], "level": 1 }, { "code": "320581104000", "parentCode": "320581", "name": "古里镇", "childTreeDataList": [], "level": 1 }, { "code": "320581105000", "parentCode": "320581", "name": "沙家浜镇", "childTreeDataList": [], "level": 1 }, { "code": "320581106000", "parentCode": "320581", "name": "支塘镇", "childTreeDataList": [], "level": 1 }, { "code": "320581107000", "parentCode": "320581", "name": "董浜镇", "childTreeDataList": [], "level": 1 }, { "code": "320581110000", "parentCode": "320581", "name": "辛庄镇", "childTreeDataList": [], "level": 1 }, { "code": "320581111000", "parentCode": "320581", "name": "尚湖镇", "childTreeDataList": [], "level": 1 }, { "code": "320581400000", "parentCode": "320581", "name": "虞山镇", "childTreeDataList": [], "level": 1 }, { "code": "320581405000", "parentCode": "320581", "name": "碧溪镇", "childTreeDataList": [], "level": 1 }, { "code": "320581107001", "parentCode": "320581107000", "name": "观智村", "childTreeDataList": [], "level": 2 }, { "code": "320581107002", "parentCode": "320581107000", "name": "红沙村", "childTreeDataList": [], "level": 2 }, { "code": "320581107003", "parentCode": "320581107000", "name": "天星村", "childTreeDataList": [], "level": 2 }, { "code": "320581107004", "parentCode": "320581107000", "name": "永安村", "childTreeDataList": [], "level": 2 }, { "code": "320581107005", "parentCode": "320581107000", "name": "里睦村", "childTreeDataList": [], "level": 2 }, { "code": "320581107006", "parentCode": "320581107000", "name": "旗杆村", "childTreeDataList": [], "level": 2 }, { "code": "320581107007", "parentCode": "320581107000", "name": "新民村", "childTreeDataList": [], "level": 2 }, { "code": "320581107008", "parentCode": "320581107000", "name": "陆市村", "childTreeDataList": [], "level": 2 }, { "code": "320581107009", "parentCode": "320581107000", "name": "杨塘村", "childTreeDataList": [], "level": 2 }, { "code": "320581107010", "parentCode": "320581107000", "name": "智林村", "childTreeDataList": [], "level": 2 }, { "code": "320581107011", "parentCode": "320581107000", "name": "黄石村", "childTreeDataList": [], "level": 2 }, { "code": "320581107012", "parentCode": "320581107000", "name": "东盾村", "childTreeDataList": [], "level": 2 }, { "code": "320581107013", "parentCode": "320581107000", "name": "北港村", "childTreeDataList": [], "level": 2 }, { "code": "320581107014", "parentCode": "320581107000", "name": "杜桥村", "childTreeDataList": [], "level": 2 }, { "code": "320581107015", "parentCode": "320581107000", "name": "董浜镇镇区", "childTreeDataList": [], "level": 2 }, { "code": "320581107016", "parentCode": "320581107000", "name": "徐市集镇区", "childTreeDataList": [], "level": 2}];