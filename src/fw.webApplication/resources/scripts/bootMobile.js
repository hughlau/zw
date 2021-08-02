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
var bootPATH = __CreateJSPath("bootMobile.js");

window.webSiteRootUrl = bootPATH.replace("resources/scripts/", "");

//bootstrap
document.write('<link href="' + bootPATH + 'jquery.mobile-1.4.5/jquery.mobile-1.4.5.min.css" rel="stylesheet" type="text/css" />');

document.write('<link href="' + bootPATH + 'fw/themes/default/fwMobile.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPATH + 'miniui-3.4/themes/icons.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPATH + 'miniui-3.4/themes/default/miniui.css" rel="stylesheet" type="text/css" />');
document.write('<script src="' + bootPATH + 'jquery-1.11.3.min.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'jquery.mobile-1.4.5/jquery.mobile-1.4.5.min.js" type="text/javascript" ></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'miniui-3.4/miniui.js" type="text/javascript" ></sc' + 'ript>');

document.write('<script src="' + bootPATH + 'fw/fw.js" type="text/javascript" ></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'fw/fwMobile.js" type="text/javascript" ></sc' + 'ript>');
// document.write('<script src="' + bootPATH + 'phonegap/cordova_mobile.js" type="text/javascript" ></sc' + 'ript>');

