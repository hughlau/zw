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
var reportUrl = "http://101.201.82.103:8083/ticerm/jjfineReportTest.htm?data={0}&flag={1}";;
var bootPATH = __CreateJSPath("boot.js");
window.webSiteRootUrl = bootPATH.replace("resources/scripts/", "");

//debugger
mini_debugger = true;

//font-awesome 4.2 IE7+
document.write('<meta http-equiv="X-UA-Compatible" content="IE=edge"/>'); 
document.write('<link href="' + bootPATH + 'font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />');
document.write('<!--[if IE 7]><link href="' + bootPATH + 'font-awesome/css/font-awesome-ie7.min.css" rel="stylesheet" type="text/css" /><![endif]-->');
//miniui 3.4
//document.write('<link href="' + bootPATH + 'miniui-3.4/themes/icons.css" rel="stylesheet" type="text/css" />');
//document.write('<link href="' + bootPATH + 'miniui-3.4/themes/default/miniui.css" rel="stylesheet" type="text/css" />');
//document.write('<link href="' + bootPATH + 'fw/themes/default/fw.css" rel="stylesheet" type="text/css" />');
if (window.location.href.indexOf("system/index")<1) {
    document.write('<link href="' + bootPATH + 'miniui-3.4/themes/icons.css" rel="stylesheet" type="text/css" />');
    document.write('<link href="' + bootPATH + 'miniui-3.4/themes/default/miniui.css" rel="stylesheet" type="text/css" />');
    document.write('<link href="' + bootPATH + 'fw/themes/default/fw.css" rel="stylesheet" type="text/css" />');
}
document.write('<link href="' + bootPATH + 'layer/skin/layer.css" rel="stylesheet" type="text/css" />');
document.write('<script src="' + bootPATH + 'jquery.min.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'jquery-migrate-1.2.1.min.js" type="text/javascript"></sc' + 'ript>');

//layer 1.9.3
document.write('<script src="' + bootPATH + 'layer/layer.js" type="text/javascript" ></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'miniui-3.4/miniui.js" type="text/javascript" ></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'fw/fw.js" type="text/javascript" ></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'linqjs/jquery.linq.min.js" type="text/javascript" ></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'moment/moment.js" type="text/javascript" ></sc' + 'ript>'); 

//extension
document.write('<script src="../maps/Scripts/jQueryExtension/jQueryExtension.js" type="text/javascript"></sc' + 'ript>')



//skin
var skin = getCookie("miniuiSkin");
//skin = "jqueryui-cupertino";
skin = 'mlsc';
if (skin) {
    document.write('<link href="' + bootPATH + 'miniui-3.4/themes/' + skin + '/skin.css" rel="stylesheet" type="text/css" />');  
}
////////////////////////////////////////////////////////////////////////////////////////
function getCookie(sName) {
    var aCookie = document.cookie.split("; ");
    var lastMatch = null;
    for (var i = 0; i < aCookie.length; i++) {
        var aCrumb = aCookie[i].split("=");
        if (sName == aCrumb[0]) {
            lastMatch = aCrumb;
        }
    }
    if (lastMatch) {
        var v = lastMatch[1];
        if (v === undefined) return v;
        return unescape(v);
    }
    return null;
}
function closeWindow(action) {
    if (window.CloseOwnerWindow) {
        return window.CloseOwnerWindow(action)
    }
    else { window.close() };
};

function checkIsProjectSelected() {

    if (window.top['_projectCache']=="init") {
        alert("请打开项目列表，选择具体项目！");
        closeWindow();
        //return null;
    };
}


















