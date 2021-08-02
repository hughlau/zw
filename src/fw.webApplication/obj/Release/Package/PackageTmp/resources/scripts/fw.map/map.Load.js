function MapLoaded(MapTypeCode) {
    if (MapTypeCode == "ArcGIS") {
        API.ArcGISAPI.IsArcGISLoaded = true;
        API.ArcGISAPI = ArcGIS_MapWindow.ArcGISAPI;
        var Settings = {
            displayGraphicsOnPan: true,
            DefaultExtent: API.ArcGISAPI.DefaultData.Extent_JS_1984,
            logo: false,
            slider: true,
            onLoaded: function (evt) {
            },
            GeometryServiceUrl: null
        };
        switch (window.MapFrom) {
            case 0:
                Settings.GeometryServiceUrl = GeometryUrl;
                break;
            case 1:
                Settings.GeometryServiceUrl = STGeometryUrl;
                break;
        };
        ArcGIS_MapWindow.ArcGISAPI.initMap(Settings);
        API.ArcGISAPI.ArcGISWindow = ArcGIS_MapWindow;
        API.ArcGISAPI.ArcGISMap = ArcGIS_MapWindow.ArcGIS_Map;
        divArcGISExtentControlJQ.ExtentControl({
            ArcGISWindow: API.ArcGISAPI.ArcGISWindow
                    , ArcGISMap: API.ArcGISAPI.ArcGISMap
                    , FullExtent: API.ArcGISAPI.getFullExtent()
        });

        divArcGISLayersControlJQ.LayersControl({
            ArcGISWindow: API.ArcGISAPI.ArcGISWindow
                    , ArcGISMap: API.ArcGISAPI.ArcGISMap
        });
        divArcGISToolsControlJQ.ToolsControl({
            ArcGISWindow: API.ArcGISAPI.ArcGISWindow
                    , ArcGISMap: API.ArcGISAPI.ArcGISMap
        });
        setDefaultLayerChecked(); //加载图层
      
    };
};


function ArcGISMapInit() {
    ArcGIS_MapDivID = "divArcGISMap";
    ArcGIS_MapJS = document.getElementById(ArcGIS_MapDivID);
    ArcGIS_MapJQ = $(ArcGIS_MapJS);
    jQueryExtension.UI.Layout({
        IsFlash: jQueryExtension.IsFlash()
                , Speed: jQueryExtension.Data.Settings.Speed
                , Frequency: jQueryExtension.Data.Settings.Frequency
                , Selector: ArcGIS_MapJQ
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
                , IsForeverLayout: true
                , CallBack: function () {
                    if (API.ArcGISAPI.ArcGISMap != undefined) {
                        API.ArcGISAPI.ArcGISMap.resize();
                        API.ArcGISAPI.ArcGISMap.reposition();
                    };
                }
    });
    try {
        ArcGIS_MapWindow = window;
        MapLoaded("ArcGIS");
    }
    catch (ex) {
    };
};

//默认加载图层
var isHomeInitShow = true;
function setDefaultLayerChecked() {
    switch (window.MapFrom) {
        case 0:
            $.LayersControl.SetLayerChecked({ Selector: divArcGISLayersControlJQ, LayerName: "TDT_DZ" });
            $.LayersControl.SetLayerChecked({ Selector: divArcGISLayersControlJQ, LayerName: "TDT_PlaceName" });
            //$.LayersControl.SetLayerChecked({ Selector: divArcGISLayersControlJQ, LayerName: "ST_DZ" });
            //     $.LayersControl.SetLayerChecked({ Selector: divArcGISLayersControlJQ, LayerName: "BJ" });
            break;
        case 1:
            $.LayersControl.SetLayerChecked({ Selector: divArcGISLayersControlJQ, LayerName: "ST_DZ" });
            //     $.LayersControl.SetLayerChecked({ Selector: divArcGISLayersControlJQ, LayerName: "BJ" });
            break;
    };

    divHomeInitJQ.bind("click", function () {
        //add by wangyang 20171020 
        // $('.smallToolsControls').width('322px')

           HomeInit();//关闭 

        if (isHomeInitShow) {
            getCantonPts();
            isHomeInitShow = false;
        } else {
            isHomeInitShow = true;
        };
        $.Speaker.ClearDataSource({ Selector: "#divDataSynchronizationStatus" });
        divDataSynchronizationStatusJQ.empty();
        divSpeaker = null;
        clearInterval(setLoadStatus);
        clearInterval(vInterval);

    });
    //政府管理者角色登录后，首页只显示地图底图，其它信息全部隐藏  songshasha 2016-11-9
    if (fw.fwCookie.FWCookieHelper("login_role") == "govAdminRole") {
        // var extent = new esri.geometry.Extent(120.35694778515625, 31.401126699218754, 121.34571731640625, 31.93259032226563);
         //ArcGIS_MapWindow.ArcGIS_Map.setExtent(extent);
         return;
    }
    //结束
    divHomeInitJQ.click();
    divQuitJQ.bind("click", function () {
        $.page.goLogin();
    });
};


