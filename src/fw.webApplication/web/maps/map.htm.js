//配置参数
window.MapFrom = 0; //0-天地图
//window.MapFrom = 1; //1-江苏省环保厅或者专网
window.IsLoadLayerData = 0;
window.IsLoadLayerData = 1;
window.IsDevelop = 1; //测试用
window.IsDevelop = 0; //正式用
window.width=$(document).width


//引用esri的文件
dojo.require("esri.map");
dojo.require("esri.layers.FeatureLayer");
dojo.require("esri.tasks.geometry");
dojo.require("esri.toolbars.draw");
dojo.require("dojo.number");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.TooltipDialog");
dojo.require("dojo.number");
dojo.require("esri.dijit.InfoWindow");
dojo.require("esri.dijit.TimeSlider");
dojo.require("esri.dijit.Legend");
dojo.require("dijit.Dialog");
dojo.require("esri.tasks.query");
dojo.require("dojo._base.event");


$.page.pageInit = function () {
    showTips();
    $.page.dataSourceSettingsDictionary = {
        "cantonCode": {
            dataSourceName: "sysBasicManage.queryCantonList",
            dataSourceParams: { ticket: $.page.ticket }
        },
        "mBIZEQStatus": {
            dataSourceName: "sysManage.getDictionary"
          , dataSourceParams: { pCode: "BIZEQStatus" }
        }
    };
    //window.IsLoadLayerData = fw.fwString.FWStringHelper.trim(fw.fwCookie.FWCookieHelper("IsLoadLayerData")).toLowerCase();
    if (!fw.fwObject.FWObjectHelper.hasValue(window.IsLoadLayerData)) {
        window.IsLoadLayerData = 1;
    }
    else if (window.IsLoadLayerData != "true" && window.IsLoadLayerData != "1") {
        window.IsLoadLayerData = 0;
    } else {
        window.IsLoadLayerData = 1;
    };


    GetMap_Div();

    jQueryExtension.UI.Layout({
        Selector: divDataSynchronizationStatusIframeJQ
                , HorizontalAlignment: jQueryExtension.Data.HorizontalAlignment.Stretch
                , VerticalAlignment: jQueryExtension.Data.VerticalAlignment.Stretch
                , Top: 0
                , Right: 0
                , Bottom: 0
                , Left: 0
                , Width: -1
                , MinWidth: -1
                , Height: -1
                , MinHeight: -1
                , IsEventResize: true
                , CallBack: function () {
                    jQueryExtension.ResizeWidthHeight({
                        Selector: iframeDataSynchronizationStatusJQ
                        , Width: null
                        , Height: divDataSynchronizationStatusIframeJQ.height()
                    });
                }
                , IsForeverLayout: true
    });

    jQueryExtension.UI.Layout({
        Selector: divFootJQ
                , HorizontalAlignment: jQueryExtension.Data.HorizontalAlignment.Stretch
                , VerticalAlignment: jQueryExtension.Data.VerticalAlignment.Bottom
                , Top: 0
                , Right: 0
                , Bottom: 0
                , Left: 0
                , Width: -1
                , MinWidth: -1
                , Height: divFootJQ.height()
                , MinHeight: -1
                , IsEventResize: true
                , CallBack: function () { }
                , IsForeverLayout: true
    });
    API.webSiteRootUrl = $.page.webSiteRootUrl;
    API._divSliderControlJQ = divSliderControlJQ;
    API._divSearchAndConcernJQ = divSearchAndConcernJQ;
    API._divMouseFollowJQ = divMouseFollowJQ;
    API._divCantonStatisticsJQ = divCantonStatisticsJQ;
    jQueryExtension.targetMoveHandle(divSliderControlJQ, divSliderControlJQ);
    API.UserInfo = $.page.UserInfo;

};
$.page.pageLoad = function () {
    API.LogoShow = function () {
        divLogoJQ.hide().show(1);
    };

    API.GetAbsoluteUrl = function (Url, webSiteRootUrl) {
        if (Url != undefined && Url != null) {
            if (Url.toString().toLowerCase().indexOf("http") > -1) {
            } else {
                Url = webSiteRootUrl + Url;
            };
        };
        return Url;
    };
    API.Copy = function (meintext) {
        if (window.clipboardData) {
            window.clipboardData.setData("Text", meintext)
        } else {
            var flashcopier = 'flashcopier';
            if (!document.getElementById(flashcopier)) {
                var divholder = document.createElement('div');
                divholder.id = flashcopier;
                document.body.appendChild(divholder);
            };
            document.getElementById(flashcopier).innerHTML = '';
            var divinfo = '<embed src="http://files.jb51.net/demoimg/200910/_clipboard.swf" FlashVars="clipboard=' + encodeURIComponent(meintext) + '" width="0" height="0" type="application/x-shockwave-flash"></embed>';
            document.getElementById(flashcopier).innerHTML = divinfo;
        };
    };
    API.Open = function (Properties) {
        mini.open({
            url: Properties.Url,
            title: Properties.mTitle, //标题
            showMaxButton: true, //最大化 
            allowResize: true, //是否允许调整尺寸
            width: Properties.Width, //宽度
            height: Properties.Height, //长度
            onload: function () {
            },
            ondestroy: function () {
            }
        });
        //API.LogoShow();
    };

    API.Lock = function (Properties) {
        var Settings = {
            IsLock: true
                    , IsAddLoadingFlash: true
                    , Opacity: 0.6
                    , Selector: null
        };
        $.extend(Settings, Properties);
        jQueryExtension.UI.Lock(Settings);
    };
    API.Unlock = function (Properties) {
        var Settings = {
            Selector: null
        };
        $.extend(Settings, Properties);
        jQueryExtension.UI.Unlock(Settings);
    };
    API.ModuleListShow = function () {
        divArcGISExtentControlJQ.hide();
        divArcGISToolsControlJQ.hide();
        divArcGISLayersControlJQ.hide();
        //divSliderControlJQ.hide();
        divModuleListJQ.show();
        divModuleJQ.hide();
        divFootJQ.show();

    };
    API.ModuleListHide = function () {
        divFootJQ.hide();
        divModuleListJQ.hide();
        divArcGISExtentControlJQ.show();
        divArcGISToolsControlJQ.show();
        divArcGISLayersControlJQ.show();
        //divSliderControlJQ.show();
        //  divModuleJQ.show();
    };
    API.ModuleListToggle = function () {
        if (divModuleListJQ.is(":hidden")) {
            API.ModuleListShow();
        } else {
            API.ModuleListHide();
        };
    };
    API.ArcGISShow = function () {
        divArcGISJQ.show(100);
    };
    if (!fw.fwObject.FWObjectHelper.hasValue(window.boot.frames)) {
        API.ModuleListHide();
    };
    SearchAndConcernInit({ Selector: divSearchAndConcernJQ, API: API });
    MouseFollowInit({ Selector: divMouseFollowJQ, API: API });
    SlideControlBind({ Selector: divSliderControlJQ, API: API });

    ArcGISMapInit();
    MenuFunctionModeInit();
    MenuFunctionDevelopBind({ Selector: divMenuFunctionDevelopWindowJQ, API: API });
    ThematicMapInit({ API: API });
    ResizeFunction(true);
    if (window.IsDevelop == 0) {
        LoadMenu();
    }
    else if (window.IsDevelop == 1) {
        ModuleListBind({ Selector: divModuleListJQ, DataSelector: divModuleList2JQ, DataSource: MenuData, ModuleSelector: divModuleJQ, TopHeight: divLogoJQ.height(), BottomHeight: divFootJQ.height(), API: API });
    };
    $("#fullExtent").bind("click", function () {
        //   ArcGISAPI.zoomToFullExtent();
       
        //add by wangyang 2017-10-18 点击主页图标 饼图及左下角数据重新刷新
        $('#divArcGISMap_DivLayers').hide()
        API.SliderControlSlideUp()
         if(!$('#divArcGISMap_DivLayers').is(":hidden")||$('#divArcGISMap_DivLayers').children().length==0){
             $('#divArcGISMap_DivLayers').hide()
        }


         CLSS_Show();

         if (newFullExtent) {
             API.ArcGISAPI.mapChangeExtent(newFullExtent);
         } else {
             ArcGISAPI.zoomToFullExtent();
         };

    });
    $(".esriSimpleSliderIncrementButton").attr("title", "地图放大").html('');
    $(".esriSimpleSliderDecrementButton").attr("title", "地图缩小").html('');

};




//页面大小发生变化后重布局 已注释 现在功能没有了 只有滚动条
var LastClientWidth = -1;
var LastClientHeight = -1;
// var ResizeFunction = function (IsMustResize) {
//     if (!fw.fwObject.FWObjectHelper.hasValue(IsMustResize)) {
//         IsMustResize = false;
//     };
//     var ClientWidth = fw.clientWidth();
//     var ClientHeight = fw.clientHeight();
//     if (IsMustResize || ClientWidth != LastClientWidth || ClientHeight != LastClientHeight) {
//         LastClientWidth = ClientWidth;
//         LastClientHeight = ClientHeight;
//         var BodyMenuClientHeight = fw.clientHeight() - 185;
//         var BodyMenuHeight = Math.round(parseFloat($(".BodyContentBlock").length / 2)) * $(".BodyContentHeight").height() + 10;
//         if (BodyMenuClientHeight >= BodyMenuHeight) {
//             console.log($(".BodyContentBlock").length,BodyMenuHeight)
//             $("#divBodyMenu").height(BodyMenuHeight);
//             $("#divBodyMenu").css("overflow-y", "hidden");
//         } else {
//             console.log($(".BodyContentBlock").length,BodyMenuHeight)
//             $("#divBodyMenu").height(BodyMenuClientHeight);
//             $("#divBodyMenu").css("overflow-y", "scroll");
//         };
//         // $("#divMenuSystem").height($(".TitleMenu", $("#divMenuSystem")).height() + $("#divBodyMenu").height());
//         var BodyMenuContentHeight = $(".BodyMenuContent").height();
//         var CountHeihgt = $(".BodyMenuContentLi").length * 44;
//         if (CountHeihgt > BodyMenuContentHeight) {
//             BodyMenuContentHeight = CountHeihgt;
//         };
//         var BodyMenuContentClientHeight = ClientHeight - 230;
//         if (BodyMenuContentHeight != null) {
//             if (BodyMenuContentClientHeight >= BodyMenuContentHeight) {
//                 $(".BodyMenuContent").height(BodyMenuContentHeight);
//                 $(".BodyMenuContent").css("overflow-y", "hidden");
//             }
//             else {
//                 $(".BodyMenuContent").height(BodyMenuContentClientHeight);
//                 $(".BodyMenuContent").css("overflow-y", "scroll");
//             };
//             $("#divMenuSystem_1").height($(".TitleMenu_1", $("#divMenuSystem_1")).height() + $(".BodyMenuTitle", $("#divMenuSystem_1")).height() + $(".BodyMenuContent", ("#divMenuSystem_1")).height());
//         };
//     };

// };
//
var ResizeFunction = function (IsMustResize) {
    if (!fw.fwObject.FWObjectHelper.hasValue(IsMustResize)) {
        IsMustResize = false;
    };
    var ClientWidthCha=($(document).width()-window.width)*15/100
   
    //页面的宽度
    var ClientWidth = fw.clientWidth();

    //页面的高度
    var ClientHeight = fw.clientHeight();
    // console.log(IsMustResize,ClientWidth,LastClientWidth)
    if (IsMustResize || ClientWidth != LastClientWidth || ClientHeight != LastClientHeight) {
        LastClientWidth = ClientWidth;
        LastClientHeight = ClientHeight;
      
      var BodyMenuMinWidth=120;
      var BodyMenuMaxWidth=parseFloat($('#divBodyMenu').width()*15/100)
     $('#divMenuSystem_1').width(BodyMenuMaxWidth)
     var NowMarginLEft=parseFloat($('#divMenuSystem_1').css("marginLeft"))
     $('#divMenuSystem_1').css("marginLeft",NowMarginLEft+ClientWidthCha)


     //页面大小发生变化时 地图外边缘随之变大
    $('.divMiddleDown').height($(window).height()-$(".divMiddleDown").position().top)
    $('.divMiddleDown').width($(window).width())
    $('.divMiddleDownContent').height($('.divMiddleDown').height()-2*$('.divMiddleDownContent').position().top)
    $('.divMiddleDownContent').width($('.divMiddleDown').width()-2*$('.divMiddleDownContent').position().left)
    $('.divMiddleDownBorder').height($('.divMiddleDownContent').height()-2*$('.divMiddleDownBorder').position().top)
    $('.divMiddleDownBorder').width($('.divMiddleDownContent').width()-2*$('.divMiddleDownBorder').position().left)
     // console.log(NowMarginLEft+ClientWidthCha)
     // window.width=$(document).width()
     //    if (BodyMenuMaxWidth <= BodyMenuMinWidth) {
         
     //       $('.BodyContentHeight').width(BodyMenuMinWidth).hide()
     //       $('#divMenuSystem_1').hide()
     //    }else{      
     //        $('.BodyContentHeight').width(BodyMenuMaxWidth).show()
     //        $('#divMenuSystem_1').show()


     //    }
        // $("#divMenuSystem").height($(".TitleMenu", $("#divMenuSystem")).height() + $("#divBodyMenu").height());
        // var BodyMenuContentHeight = $(".BodyMenuContent").height();
        // var CountHeihgt = $(".BodyMenuContentLi").length * 44;
        // if (CountHeihgt > BodyMenuContentHeight) {
        //     BodyMenuContentHeight = CountHeihgt;
        // };
        // var BodyMenuContentClientHeight = ClientHeight - 230;
        // if (BodyMenuContentHeight != null) {
        //     if (BodyMenuContentClientHeight >= BodyMenuContentHeight) {
        //         $(".BodyMenuContent").height(BodyMenuContentHeight);
        //         $(".BodyMenuContent").css("overflow-y", "hidden");
        //     }
        //     else {
        //         $(".BodyMenuContent").height(BodyMenuContentClientHeight);
        //         $(".BodyMenuContent").css("overflow-y", "scroll");
        //     };
        //     $("#divMenuSystem_1").height($(".TitleMenu_1", $("#divMenuSystem_1")).height() + $(".BodyMenuTitle", $("#divMenuSystem_1")).height() + $(".BodyMenuContent", ("#divMenuSystem_1")).height());
        // };
    };

};
$(window).bind("resize", function () { ResizeFunction(false); });

function MenuFunctionModeInit() {
    var IsMenuFunctionDevelopModel = fw.fwCookie.FWCookieHelper("IsMenuFunctionDevelopModel");
    // IsMenuFunctionDevelopModel = 1;
    if (!fw.fwObject.FWObjectHelper.hasValue(IsMenuFunctionDevelopModel)) { IsMenuFunctionDevelopModel = 0; } else if (IsMenuFunctionDevelopModel != "true" && IsMenuFunctionDevelopModel != "1") { IsMenuFunctionDevelopModel = 0; } else { IsMenuFunctionDevelopModel = 1; };

    if (IsMenuFunctionDevelopModel == "1") {
        divOpenMenuFunctionDevelopJQ.show();
    } else {
        divMenuFunctionDevelopWindowJQ.hide();
        divOpenMenuFunctionDevelopJQ.hide();
    };
};

var lastMenuID = null;
function ragionMenuFunction(id, _inf, _outf) {
    if (window.MenuFunction == undefined) {
        window.MenuFunction = { Out: {}, In: {} };
    };
    if (window.MenuFunction.In[id] == undefined) {
        eval("window.MenuFunction.In[" + id + "] = " + _inf.toString());
    };
    if (window.MenuFunction.Out[id] == undefined) {
        eval("window.MenuFunction.Out[" + id + "] = " + _outf.toString());
    };
};


function callMenuFunction(id) {
    if (lastMenuID != null) {
        if (window.MenuFunction.Out[lastMenuID] != undefined) {
            window.MenuFunction.Out[lastMenuID]();
        };
    };
    if (window.MenuFunction.In[id] != undefined) {
        lastMenuID = id;
        window.MenuFunction.In[id]();
    };
};

function outMenuFunction() {
    if (lastMenuID != null) {
        if (window.MenuFunction.Out[lastMenuID] == undefined) {
            window.MenuFunction.Out[lastMenuID]();
        };
    };
};

function showTips() {
    mini.showTips({
        content: "F11全屏浏览",
        state: "success",
        x: "center",
        y: "top",
        timeout: 2000
    });
}
