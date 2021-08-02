__CreateJSPath = function (js) {
    var scripts = document.getElementsByTagName("script");
    var path = "";
    for (var i = 0, l = scripts.length; i < l; i++) {
        var src = scripts[i].src;
        if (src.indexOf(js) != -1) {
            var ss = src.split(js);
            path = ss[0];
            break;
        }
    }
    var href = location.href;
    href = href.split("#")[0];
    href = href.split("?")[0];
    var ss = href.split("/");
    ss.length = ss.length - 1;
    href = ss.join("/");
    if (path.indexOf("https:") == -1 && path.indexOf("http:") == -1 && path.indexOf("file:") == -1 && path.indexOf("\/") != 0) {
        path = href + "/" + path;
    }
    return path;
}

var bootPATH = __CreateJSPath("bootMap.js");

window.webSiteRootUrl = bootPATH.replace("resources/scripts/", "");

//debugger
mini_debugger = true;

//ArcGis地图资源信息添加
//document.write('<link href="' + bootPATH + '../../web/scripts/firtstyle.css" rel="stylesheet" type="text/css" />'); 
//document.write('<script src="' + bootPATH + 'jquery-1.6.2.min.js" type="text/javascript"></sc' + 'ript>');
var skin = "blue";
if (!skin) {
    skin = "default";
};
var boot = { frames: "_Top" }; //_Top
window.boot = boot;
//css
document.write('<link href="' + bootPATH + 'fw.map/themes/' + skin + '/arcgis.Home.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPATH + 'fw.map/themes/' + skin + '/arcgis.Home_Menu' + window.boot.frames + '.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPATH + 'fw.map/themes/' + skin + '/arcgis.CarRoute.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPATH + 'fw.map/themes/' + skin + '/arcgis.DrawControl.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPATH + 'fw.map/themes/' + skin + '/arcgis.ExtentControl.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPATH + 'fw.map/themes/' + skin + '/arcgis.LayersControl.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPATH + 'fw.map/themes/' + skin + '/arcgis.ToolsControl.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPATH + 'fw.map/themes/' + skin + '/arcgis.LocateControl.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPATH + 'fw.map/themes/' + skin + '/arcgis.Speaker.css" rel="stylesheet" type="text/css" />');
//arcgis.css
document.write('<link href="' + bootPATH + '../Maps/ArcGIS/FrameWork/ags33/jsapi/arcgis/3.3/js/dojo/dijit/themes/tundra/tundra.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPATH + '../Maps/ArcGIS/FrameWork/ags33/jsapi/arcgis/3.3/js/dojo/dijit/themes/claro/claro.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPATH + '../Maps/ArcGIS/FrameWork/ags33/jsapi/arcgis/3.3/js/esri/css/esri.css" rel="stylesheet" type="text/css" />');


//js
document.write('<script src="' + bootPATH + '../Maps/ArcGIS/FrameWork/ags33/jsapi/index.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'fw.map/map.Div.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'fw.map/map.Load.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'fw.map/map.htm.API.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'fw.map/map.htm.DataSource.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'fw.map/map.htm.Menu' + window.boot.frames + '.js" type="text/javascript"></sc' + 'ript>');

document.write('<script src="' + bootPATH + 'fw.map/map.htm.MenuFunctionDevelop.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'fw.map/map.htm.MouseFollow.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'fw.map/map.htm.SearchAndConcern.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'fw.map/map.htm.ThematicMap.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'fw.map/map.htm.ToolTip.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'fw.map/map.htm.SliderControl.js" type="text/javascript"></sc' + 'ript>');
// document.write('<script src="' + bootPATH + 'fw.map/map.htm.LegendControl.js" type="text/javascript"></sc' + 'ript>');//右下角图例，目前不用



//arcgis.js
document.write('<script src="' + bootPATH + 'fw.map/scripts/arcgis.LayerUrl.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'fw.map/scripts/arcgis.PublicData.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'fw.map/scripts/arcgis.API.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'fw.map/scripts/arcgis.Charts.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'fw.map/scripts/arcgis.ClusterLayer.debug.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'fw.map/scripts/arcgis.DrawControl.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'fw.map/scripts/arcgis.ExtentControl.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'fw.map/scripts/arcgis.Function.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'fw.map/scripts/arcgis.LayersControl.DataSource.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'fw.map/scripts/arcgis.LayersControl.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'fw.map/scripts/arcgis.LocateControl.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'fw.map/scripts/arcgis.TDTLayer.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'fw.map/scripts/arcgis.ToolsControl.js" type="text/javascript"></sc' + 'ript>');



 



