__CreateJSPath = function (js) {
    var scripts = document.getElementsByTagName("script");
    var path = "";
    for (var i = 0, l = scripts.length; i < l; i++) {
        var src = scripts[i].src;
        if (src.indexOf(js) != -1) {
            var ss = src.split(js);
            path = ss[0];
            break;
        };
    };
    var href = location.href;
    href = href.split("#")[0];
    href = href.split("?")[0];
    var ss = href.split("/");
    ss.length = ss.length - 1;
    href = ss.join("/");
    if (path.indexOf("https:") == -1 && path.indexOf("http:") == -1 && path.indexOf("file:") == -1 && path.indexOf("\/") != 0) {
        path = href + "/" + path;
    };
    return path;
};

var bootPATH = __CreateJSPath("bootBootstrap.js");

window.webSiteRootUrl = bootPATH.replace("resources/scripts/", "");

//debugger
mini_debugger = true;

document.write('<link href="' + bootPATH + 'miniui-3.4/themes/icons.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPATH + 'miniui-3.4/themes/default/miniui.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPATH + 'fw/themes/default/fw.css" rel="stylesheet" type="text/css" />');

 
document.write('<script src="' + bootPATH + 'jquery-1.11.3.min.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'jquery-migrate-1.2.1.min.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'miniui-3.4/miniui.js" type="text/javascript" ></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'fw/fw.js" type="text/javascript" ></sc' + 'ript>');

// HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries  
// WARNING: Respond.js doesn't work if you view the page via file://  
/// <reference path="" />
document.write('<!--[if lt IE 9]>');
document.write('<script src="' + bootPATH + 'responsiveJS/html5shiv.js" type="text/javascript" ></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'responsiveJS/respond.js" type="text/javascript" ></sc' + 'ript>');
document.write('<![endif]-->');

//第三方JS
document.write('<script src="' + bootPATH + 'linqjs/jquery.linq.min.js" type="text/javascript" ></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'moment/moment.js" type="text/javascript" ></sc' + 'ript>');


//skin
var skin = getCookie("miniuiSkin");
skin = "mlsc";

if (skin) {
    document.write('<link href="' + bootPATH + 'miniui-3.4/themes/' + skin + '/skin.css" rel="stylesheet" type="text/css" />');
};




////////////////////////////////////////////////////////////////////////////////////////
function getCookie(sName) {
    var aCookie = document.cookie.split("; ");
    var lastMatch = null;
    for (var i = 0; i < aCookie.length; i++) {
        var aCrumb = aCookie[i].split("=");
        if (sName == aCrumb[0]) {
            lastMatch = aCrumb;
        };
    };
    if (lastMatch) {
        var v = lastMatch[1];
        if (v === undefined) return v;
        return unescape(v);
    };
    return null;
};