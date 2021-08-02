//跳转点位
var homeCantonCode = null;
var setIntervalFunction = null;

function getCantonPts() {
    var cantonDataList = [];
    if (!fw.fwObject.FWObjectHelper.hasValue(cantonDataList)) {
        var queryParams = { cantonCode: "" };
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "basicInfo"
            , methodName: "queryProject"
            , data: {
                ticket: $.page.ticket
                , pageParams: {
                    pageSize: 100
                    , pageIndex: 1
                }
                , queryParams: queryParams
            }
            , success: function (resultData) {
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                    for (var i = 0; i < resultData.data.length; i++) {
                        var entity = resultData.data[i];
                        entity.posX = entity.longitude;
                        entity.posY = entity.latitude;
                        cantonDataList.push(entity);
                    };
                    getCantonPtsFuc(cantonDataList);
                };
            }
        }));
    } else {
        getCantonPtsFuc(cantonDataList);
    };
};
function getCantonPtsFuc(cantonDataList) {
    if (cantonDataList.length > 1) {

        //政府管理者角色登录后，首页只显示地图底图，其它信息全部隐藏  songshasha 2016-11-9
        //        if (fw.fwCookie.FWCookieHelper("login_role") == "govAdminRole") {
        //            return;
        //        }
        //结束
        divHomeInitJQ.show();
        var Settings = {
            LayerName: "cantonPts"
            , ShowmaxScale: 0 //图层显示最大Scale
            , ShowminScale: 0//图层显示最小Scale
            , IsCallback: true
            , IsReCallback: true
            , isFromDB: false
            , GraphicList: cantonDataList
            , Symbol: $.page.webSiteRootUrl + 'web/style/maps/images/pointImage/1.png'
            , Symbol_W: 36
            , Symbol_H: 36
            , onClickEvent: function (evt) {
                infoCantonPts(evt);
            }
            , Callback: function (BusinessLayer) {
                var dataList = BusinessLayer.graphics;
                for (var i = 0; i < dataList.length; i++) {
                    var ImagePlayHelper = {
                        graphic: dataList[i],
                        index: 0,
                        url: dataList[i].symbol.url,
                        imageCount: 21,
                        play: function () {
                            var imagePlayHelper = this;
                            if (imagePlayHelper.index < 1) {
                                setIntervalFunction = setInterval(function () {
                                    imagePlayHelper.index++;
                                    if (imagePlayHelper.index <= imagePlayHelper.imageCount) {
                                        imagePlayHelper.graphic.symbol.setUrl(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/style/maps/images/pointImage/" + (imagePlayHelper.index % imagePlayHelper.imageCount + 1) + ".png", $.page.webSiteRootUrl))
                                    } else {
                                        // clearInterval(setIntervalFunction);
                                        imagePlayHelper.index = 0;
                                        imagePlayHelper.graphic.symbol.setUrl(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/style/maps/images/pointImage/1.png", $.page.webSiteRootUrl))
                                    };
                                    imagePlayHelper.graphic.getLayer().refresh();
                                }, 200);
                            };
                        }
                    }
                    ImagePlayHelper.play();
                };
            }
        };
        //modify by songshasha 2017-11-8 取消首页加载时，地图上显示项目定位图标的显示
        //API.ArcGISAPI.businessLayerShow(Settings);

        //显示列表
        var settings = {
            ArcGISWindow: API.ArcGISAPI.ArcGISWindow,
            ArcGISMap: API.ArcGISAPI.ArcGISMap,
            Title: "项目列表",
            Width: 800,
            Height: 300,
            Url: "../basicInfo/projectList.htm",
            Data: { callType: "map", callBackHanlder: " zoomtoCantonPts", action: "view" },
            Position: { "left": 5, "bottom": 5 }
        };
        divPopUpFrameBoxJQ.PopUpFrameBoxShow(settings);

        zoomtoCantonPts = function (cantonCode, PosX, PosY) {
            var Settings = {
                //                LayerName: "cantonPts"
                //                , LayerKeyFieldName: "cantonCode"
                //                , BusinessCode: cantonCode
                bFlash: false
                , ZoomLevel: 9
                , PosX: parseFloat(PosX)
                , PosY: parseFloat(PosY)
            };
            API.ArcGISAPI.zoomToPoint(Settings);
        };
    } else if (cantonDataList.length == 1) {
        homeCantonCode = cantonDataList[0].cantonCode;
        getInitMapParameter(homeCantonCode);
        //add by songshasha 2017-11-8 当只有一个项目时，默认设置选中的项目为此项目
        window.top['_projectCache'] = cantonDataList[0].projectNo;

    };
}
//弹框信息


var infoCantonPts = function (evt) {
    var SelPointfeature = evt.graphic;
    if (SelPointfeature.attributes == undefined || SelPointfeature.attributes == null) {
        return;
    };
    var divJQ = null;
    var Width = 220;
    var divJQ = $("<div class=\"divMapInfoWindowContent\" style='z-index:99;'></div>").width(Width).appendTo("body");
    var divInfoJQ = $("<div class=\"divInfo\"></div>").appendTo(divJQ);
    var BodyHtml = "";
    BodyHtml += "<table><tr><td>行政区：" + (fw.fwObject.FWObjectHelper.hasValue(SelPointfeature.attributes.cantonName) ? SelPointfeature.attributes.cantonName : "--") + "</td></tr>";
    //BodyHtml += "<td>设备数：" + (fw.fwObject.FWObjectHelper.hasValue(SelPointfeature.attributes.equipmentAmount) ? SelPointfeature.attributes.equipmentAmount : "--") + "台</td></tr>";
    BodyHtml += "<tr><td>运营时间：" + (fw.fwObject.FWObjectHelper.hasValue(SelPointfeature.attributes.operateTime) ? fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(SelPointfeature.attributes.operateTime), $.pageCustomer.dateDay) : "--") + "</td></tr>";
    BodyHtml += "<tr style='float:right;'><td><div id='divDetailTaskInfo' class=\"divDetailTaskInfo\" style='margin:5px;float:left;'><span style=\"float:left;margin-top:2px;margin-left:7px;\">工程浏览</span></div></td></tr>";
    BodyHtml += "</table>";
    $(BodyHtml).appendTo(divInfoJQ);
    var divDetailTaskInfoJQ = $(".divDetailTaskInfo");
    divDetailTaskInfoJQ.click(function () {
        homeCantonCode = SelPointfeature.attributes.cantonCode;
        var isInCantonCode = false;
        for (var i = 0; i < CantonCodeList.length; i++) {
            if (homeCantonCode == CantonCodeList[i]) {
                isInCantonCode = true;
            };
        };

        if (isInCantonCode) {
            mapInit();
            getInitMapParameter(homeCantonCode);
        } else {
            alert("此工程功能暂未实现，请联系系统管理员！");
        };
    });
    var Settings2 = {
        Title: SelPointfeature.attributes.projectName,
        domNode: divJQ[0],
        Width: divJQ.outerWidth() + 20,
        Height: divJQ.outerHeight() + 20,
        evt: evt
    };
    API.ArcGISAPI.mapInfoWindowShow(Settings2);
};
//add by songshasha 2017-11-8  新增选择项目后，直接点击浏览，打开选中的项目
var openSelectedCantonInfo = function (cantonCode) {
    homeCantonCode = cantonCode;
    getInitMapParameter(cantonCode);
    mapInit();

}


//设施概况(new)
function CLSS_Show() {

    $('#divArcGISMap_DivLayers').empty()
    if (!fw.fwObject.FWObjectHelper.hasValue(homeCantonCode)) {
        alert("请打开工程列表，选择具体工程！");
        return;
    };
    //当前行政区编码
    var currentCantonCode = "";
    $("#process").show();
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "basicInfo"
        , methodName: "queryRealMonitorSiteStatisByLoginUser"
        , data: {
            ticket: $.page.ticket
            , cantonCode: homeCantonCode
            , projectNo: window.top['_projectCache']  //modify by songshasha 2017-11-8  将选中的项目名称作为查询参数
        }
        , success: function (resultData) {
            $("#process").hide();
            // add by wangyang 20171018 显示饼图所在dom
            $('#divArcGISMap_DivLayers').show()

            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {

                //数据源
                var monitorSiteRealTimeStatisDataList = resultData.data;
                //加载行政区图层
                var MapSettings = {
                    IsVisible: true,
                    LayerName: "CSCanton",
                    MapServiceUrl: CantonLayerUrl,
                    Opacity: 0.7,
                    MapServiceLayerType: Code__MapServiceLayerType.TiledMapService,
                    onClickEvent: function (evt) { //点击事件
                        if (!fw.fwObject.FWObjectHelper.hasValue(layerIds)) {
                            return;
                        };
                        var geometry = new esri.geometry.Point(evt.mapPoint.x, evt.mapPoint.y);
                        var settings = {
                            layerUrl: CantonLayerUrl,
                            geometry: geometry,
                            layerIds: layerIds,
                            returnGeometry: false,
                            onCompletedEvent: function (result) {
                                if (result.length > 0) {
                                    var g = result[0].feature;
                                    var cantonCode = g.attributes[searchFields];
                                    for (var i = 0; i < $("#sltTown")[0].length; i++) {
                                        if ($("#sltTown")[0][i].value == cantonCode) {
                                            $("#sltTown")[0][i].selected = true;
                                            bindCun(cantonCode, true);
                                            bindStatus(cantonCode);
                                            break;
                                        };
                                    };

                                };
                            }
                        };
                        API.ArcGISAPI.taskIdentify(settings);
                    }
                };
                API.ArcGISAPI.addMSLayerByLayerId(MapSettings);
                //加载左下角列表
                var Settings = {
                    TextFieldName: "cantonName",
                    ColorFieldName: "Color",
                    DataSource: monitorSiteRealTimeStatisDataList,
                    TemplateFunction: function (Entity) { return Entity[this.TextFieldName]; },
                    BusinessEvent: BindCanton,
                    RowOnClick: function (cantonCode, cboValue, IsWithMap, IsStatusList, Entity) {
                        //console.log(IsWithMap)  //false
                        if (IsWithMap) {
                            if (currentCantonCode != cantonCode) {
                                currentCantonCode = cantonCode;
                                API.ArcGISAPI.mapInfoWindowHide();
                                if (fw.fwObject.FWObjectHelper.hasValue(cantonCode)) {
                                    if (cantonCode == homeCantonCode) {
                                        var layer = ArcGIS_Map.getLayer("Business_GL");
                                        if (fw.fwObject.FWObjectHelper.hasValue(layer)) {
                                            layer.clear();
                                            return;
                                        };
                                    };
                                    var Settings = {
                                        statusCode: ""
                                        , cantonCode: cantonCode
                                    };
                                    AddBusinessLayer(Settings);
                                    var arr = $("#divArcGISMap_DivLayers").children();
                                    arr.show();

                                    var mapSettings2 = {
                                        layerName: "WG",
                                        searchFields: searchFields,
                                        searchText: cantonCode,
                                        layerIds: layerIds,
                                        layerUrl: CantonLayerUrl,
                                        onCompletedEvent: function (result) {
                                            if (result.length > 0) {
                                                var g = result[0].feature;
                                                var cantonName = g.attributes[attrName];
                                                var checkDivLayers = setInterval(function () {
                                                    if ($("[divlayername='divArcGISMap_DivLayers_" + cantonName + "']").length > 0) {
                                                        $("[divlayername='divArcGISMap_DivLayers_" + cantonName + "']").hide();
                                                        clearInterval(checkDivLayers);
                                                    };
                                                }, 300);
                                                //高亮显示网格
                                                var graphicSetting = {
                                                    LayerName: "GL",
                                                    ReorderLayerIndex: 0,
                                                    GeometryList: [{ Geometry: g.geometry, Symbol: GetDefaultSymbolByName(SymbolNames.Polygon_Highlighte), Attributes: g.attributes }]
                                                    , Callback: function (GLayer) {
                                                        var zoomLevel = ZoomLevel + 1;
                                                        setTimeout(function () { API.ArcGISAPI.zoomToPolygon(g.geometry, zoomLevel); }, 300);
                                                    }
                                                };
                                                API.ArcGISAPI.addGraphicToLayer(graphicSetting);
                                            };
                                        }
                                    };
                                    API.ArcGISAPI.taskFind(mapSettings2);
                                };
                            };
                        }
                        else {
                            if (!IsStatusList) {
                                //定位到具体的处理设施点位
                                var Settings = {
                                    cantonCode: cantonCode
                                    , statusCode: cboValue
                                    , viewCode: 1
                                    , callBackHanlder: "ZoomToCLSSPoint"
                                    , title: "污水处理净化槽列表"
                                    , url: "web/autoMonitor/monitorSiteByStatusList.htm"
                                };
                                PopUpFrameBoxShow_MiniOpen(Settings); //打开窗口净化槽




                            }
                            else {
                                var level = ArcGIS_Map.getLevel();
                                if (level > ZoomLevel) {
                                    var Settings = {
                                        statusCode: cboValue
                                        , cantonCode: cantonCode
                                    };
                                    AddBusinessLayer(Settings);
                                };
                            }
                        }
                    }
                };
                API.SliderControlListBind(Settings);
                API.SliderControlAdd(Settings);
                // edit by wangyang 20171018  显示左下方侧边栏
                API.SliderControlSlideDown();
                //  $(".divCantonStatisticsToggle").click();

                //饼图数据源  
                var siteDataForPieData = $.Enumerable.From(monitorSiteRealTimeStatisDataList).Where("$.monitorSiteAmount>0").Select(function (p) {
                    var pieData = [
                        { name: "正常", statusCode: 1, color: "#009933", y: p.realtimeStatusStatis.status_1, cantonCode: p.cantonCode },
                        { name: "设备漏气", statusCode: 4, color: "#ff9900", y: p.realtimeStatusStatis.status_4, cantonCode: p.cantonCode },
                        { name: "设备堵塞", statusCode: 5, color: "#ea42ec", y: p.realtimeStatusStatis.status_5, cantonCode: p.cantonCode },
                        { name: "通讯故障", statusCode: 9, color: "#3399ff", y: p.realtimeStatusStatis.status_9, cantonCode: p.cantonCode },
                        { name: "供电故障", statusCode: 3, color: "#ff6666", y: p.realtimeStatusStatis.status_3, cantonCode: p.cantonCode },
                        { name: "调试中", statusCode: 10, color: "#9400D3", y: p.realtimeStatusStatis.status_10, cantonCode: p.cantonCode },
                        { name: "报停设备", statusCode: 13, color: "#CC0033", y: p.realtimeStatusStatis.status_13, cantonCode: p.cantonCode }
                    ];
                    p.EntityList = [];
                    for (var i = 0; i < pieData.length; i++) {
                        if (pieData[i].y > 0) {
                            p.EntityList.push(pieData[i]);
                        };
                    };
                    return p;
                }).ToArray();
                // console.log(siteDataForPieData)
                var list = siteDataForPieData;
                var list2 = [];
                for (var i = 0; i < monitorSiteRealTimeStatisDataList[0].childDataList.length; i++) {
                    var entity = monitorSiteRealTimeStatisDataList[0].childDataList[i];
                    if (entity.monitorSiteAmount > 0) {
                        var pieData = [
                            { name: "正常", statusCode: 1, color: "#009933", y: entity.realtimeStatusStatis.status_1, cantonCode: entity.cantonCode },
                            { name: "设备漏气", statusCode: 4, color: "#ff9900", y: entity.realtimeStatusStatis.status_4, cantonCode: entity.cantonCode },
                            { name: "设备堵塞", statusCode: 5, color: "#ea42ec", y: entity.realtimeStatusStatis.status_5, cantonCode: entity.cantonCode },
                            { name: "通讯故障", statusCode: 9, color: "#3399ff", y: entity.realtimeStatusStatis.status_9, cantonCode: entity.cantonCode },
                            { name: "供电故障", statusCode: 3, color: "#ff6666", y: entity.realtimeStatusStatis.status_3, cantonCode: entity.cantonCode },
                            { name: "调试中", statusCode: 10, color: "#9400D3", y: entity.realtimeStatusStatis.status_10, cantonCode: entity.cantonCode },
                            { name: "报停设备", statusCode: 13, color: "#CC0033", y: entity.realtimeStatusStatis.status_13, cantonCode: entity.cantonCode }
                        ];
                        entity.EntityList = [];
                        for (var j = 0; j < pieData.length; j++) {
                            if (pieData[j].y > 0) {
                                entity.EntityList.push(pieData[j]);
                            };
                        };
                        list2.push(entity);
                    };
                };

                //生成饼图
                var showChart = function (attr, size) {
                    var arrDivs = $("#divArcGISMap_DivLayers").children();
                    for (var i = 0; i < arrDivs.length; i++) {
                        var isExit = false;
                        for (var j = 0; j < attr.length; j++) {
                            var cantonName = attr[j].cantonName;
                            if (arrDivs[i].children[0].id == cantonName) {
                                isExit = true;
                                break;
                            }
                        }
                        if (!isExit) {
                            $("[divlayername='divArcGISMap_DivLayers_" + arrDivs[i].children[0].id + "']").remove();
                        }
                    };
                    var cantonDiv = [];
                    for (var i = 0; i < attr.length; i++) {
                        var cantonName = attr[i].cantonName;
                        var isExit = false;
                        for (var j = 0; j < arrDivs.length; j++) {
                            if (arrDivs[j].children[0].id == cantonName) {
                                isExit = true;
                                break;
                            };
                        };
                        if (!isExit) {
                            cantonDiv.push(attr[i]);
                        };
                    }
                    ;
                    for (var i = 0; i < cantonDiv.length; i++) {
                        API.ArcGISAPI.addDivLayer({
                            DivLayerName: cantonDiv[i].cantonName,
                            EntityList: cantonDiv[i].EntityList,
                            HideLevel: 5,
                            TemplateFunction: function (Entity, SymbolJQ) {
                                Entity.X = cantonDiv[i].posX;
                                Entity.Y = cantonDiv[i].posY;
                                var renderTo = cantonDiv[i].cantonName;
                                SymbolJQ.attr("id", renderTo).width(size).height(size);
                                var chartSetting = {
                                    RenderTo: renderTo,
                                    cantonName: cantonDiv[i].cantonName + "(台)",
                                    cantonCode: cantonDiv[i].cantonCode,
                                    EntityList: cantonDiv[i].EntityList,
                                    onClickEvent: function (data) {
                                        var cantonCode = data.cantonCode;
                                        var statusCode = data.statusCode;
                                        var Settings = {
                                            cantonCode: cantonCode
                                            , statusCode: statusCode
                                            , viewCode: 1
                                            , callBackHanlder: "ZoomToCLSSPoint"
                                            , title: "污水处理净化槽列表"
                                            , url: "web/autoMonitor/monitorSiteByStatusList.htm"
                                        };
                                        PopUpFrameBoxShow_MiniOpen(Settings);
                                    },
                                    onAllClickEvent: function (cantonCode) {
                                        var Settings = {
                                            cantonCode: cantonCode
                                            , statusCode: ""
                                            , viewCode: 1
                                            , callBackHanlder: "ZoomToCLSSPoint"
                                            , title: "污水处理净化槽列表"
                                            , url: "web/autoMonitor/monitorSiteByStatusList.htm"
                                        };
                                        PopUpFrameBoxShow_MiniOpen(Settings);
                                    }
                                };
                                HighChatTools.loadMapChart(chartSetting);
                                // $('.divSymbol').show()
                            },
                            XFieldName: "X",
                            YFieldName: "Y"

                        });
                    }
                };

                //饼图动态加载
                var changeFun = function (evt) {
                    // $("#divArcGISMap_DivLayers").empty();
                    var level = ArcGIS_Map.getLevel();
                    // console.log(level)   ===10
                    // console.log(ChartDivZoomLevel) ===11
                    var EntityList = [];
                    var pieSize = "";
                    var DataList = [];
                    if (fw.fwObject.FWObjectHelper.hasValue(evt)) {
                        if (level > 8 && level < ChartDivZoomLevel) {
                            DataList = list;
                            pieSize = 150;
                        } else if (level >= ChartDivZoomLevel) {
                            DataList = list2;
                            pieSize = 120;
                        };
                        for (var i = 0; i < DataList.length; i++) {
                            //songshasha  增加注释，首页饼状图显示必备的前提条件：行政区的经纬度必须介于maplayer中设置的地图范围区间内，FWDictionary_BLLCanton中必须增加各个行政区的经纬度信息
                            if (evt.xmin < DataList[i].posX && evt.xmax > DataList[i].posX && evt.ymin < DataList[i].posY && evt.ymax > DataList[i].posY) {
                                EntityList.push(DataList[i]);
                            };
                        };
                        //显示并加载饼图
                        showChart(EntityList, pieSize);
                    }
                    // add by wangyang 20171018 下一次刷新 重新加载数据  清空饼图数据源                      
                    EntityList = [];
                    pieSize = '';
                    // siteDataForPieData = [];
                };
                var initEvt = { xmin: GXMin, ymin: GYMin, xmax: GXMax, ymax: GYMax };
                changeFun(initEvt);
                ArcGIS_Map.panEndEvent = dojo.connect(ArcGIS_Map, "onExtentChange", function (evt) {
                    changeFun(evt);
                });
            }
            else //Roger 2016/6/1 13:00:02 增加管辖区域
            {
                var erroInfo = resultData.infoList.join("<br>");
                $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
            };
        }
    }));

    //搜索功能
    //    API.SearchAndConcernUnbind();
    //    API.SearchAndConcernBind({
    //        SearchButtonOnClick: function (e, Keyword) {
    //            if (Keyword == "请输入净化槽编码") {
    //                Keyword = "";
    //            };
    //            $.page.ajax($.page.getAjaxSettings({
    //                serviceType: "crossDomainCall"
    //                            , serviceName: "basicInfo"
    //                            , methodName: "queryMonitorSiteEasy"
    //                            , data: {
    //                                ticket: $.page.ticket
    //                                       , Keyword: Keyword
    //                                       , topNum: 10
    //                                       , cantonCode: homeCantonCode
    //                            }
    //                            , success: function (resultData) {
    //                                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
    //                                    var newEntityList = [];
    //                                    for (var i = 0; i < resultData.data.length; i++) {
    //                                        if (resultData.data[i].monitorSiteName.indexOf(Keyword) > -1) {
    //                                            newEntityList.push(resultData.data[i]);
    //                                        };
    //                                    };
    //                                    API.SearchAndConcernContentBind({
    //                                        TextFieldName: "monitorSiteName"
    //                                        , IconUrlFieldName: "IconUrl"
    //                                        , DataSource: newEntityList
    //                                        , TemplateFunction: function (Entity, Index) {
    //                                            return Entity[this.TextFieldName];
    //                                        }
    //                                        , RowOnClick: function (Entity) {
    //                                            ZoomToCLSSPoint(Entity);
    //                                        }
    //                                    });
    //                                }
    //                                else //Roger 2016/6/1 13:00:02 增加管辖区域
    //                                {
    //                                    var erroInfo = resultData.infoList.join("<br>");
    //                                    $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
    //                                };
    //                            }
    //            }));
    //        }
    //      , HintValue: "请输入净化槽编码"
    //    });
    $("#divSearchAllPoints").show();
    //autocompleteArcgisSearchInit();
    aysncAutocompleteArcgisSearchInit();
    //添加图例
    var settings = {
        ArcGISWindow: API.ArcGISAPI.ArcGISWindow,
        ArcGISMap: API.ArcGISAPI.ArcGISMap,
        legend: [{ name: "正常", image: $.page.webSiteRootUrl + 'web/style/maps/images/pointImage/正常.png' },
        { name: "设备漏气", image: $.page.webSiteRootUrl + 'web/style/maps/images/pointImage/设备漏气.png' },
        { name: "设备堵塞", image: $.page.webSiteRootUrl + 'web/style/maps/images/pointImage/设备堵塞.png' },
        { name: "通讯故障", image: $.page.webSiteRootUrl + 'web/style/maps/images/pointImage/通讯故障.png' },
        { name: "供电故障", image: $.page.webSiteRootUrl + 'web/style/maps/images/pointImage/供电故障.png' },
        { name: "调试中", image: $.page.webSiteRootUrl + 'web/style/maps/images/pointImage/调试中.png' },
        { name: "报停设备", image: $.page.webSiteRootUrl + 'web/style/maps/images/pointImage/报停设备.png' }
        ]
    };
    AddLegendControl(settings);
};
//加载图例
var AddLegendControl = function (Properties) {
    var Settings = {
        ArcGISWindow: API.ArcGISAPI.ArcGISWindow,
        ArcGISMap: API.ArcGISAPI.ArcGISMap,
        legend: []
    };
    $.extend(Settings, Properties);
    // divArcGISLegendJQ.LegendControl(Settings);
}
//加载处理设施点位图层
//
var AddBusinessLayer = function (Properties) {
    if (fw.fwObject.FWObjectHelper.hasValue(addPointAndzoomToLayer)) {
        addPointAndzoomToLayer.clear();
    };
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "basicInfo"
        , methodName: "queryMonitorSiteRealtimeStatusList"
        , data: {
            ticket: $.page.ticket
            , cantonCode: Properties.cantonCode
            , statusCode: Properties.statusCode
        }
        , success: function (resultData) {
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                var GraphicList = [];
                for (var i = 0; i < resultData.data.length; i++) {
                    //console.log(GetSiteStatus(resultData.data[i].statusCode));
                    GraphicList.push(resultData.data[i]);
                    GraphicList[i].posX = resultData.data[i].longitude;
                    GraphicList[i].posY = resultData.data[i].latitude;
                    //GraphicList[i].Image = $.page.webSiteRootUrl + 'web/style/maps/images/pointImage/' + GetSiteStatus(resultData.data[i].statusCode) + '.png';
                    if (resultData.data[i].moduleTypeCode == 2) {
                        GraphicList[i].Image = $.page.webSiteRootUrl + 'web/style/maps/images/pointImage/jizhan.png';
                    } else {
                        GraphicList[i].Image = $.page.webSiteRootUrl + 'web/style/maps/images/pointImage/' + resultData.data[i].statusCode + '.png';
                    }
                };

                var Settings = {
                    LayerName: "CLSSLayer"
                    , LayerServiceUrl: ""
                    , LayerType: Code__MapLayerTypeCode.Point //图层类型
                    , ShowmaxScale: 0 //图层显示最大Scale
                    , ShowminScale: minScale//图层显示最小Scale
                    , where: ""
                    , name: ""
                    , IsCallback: false
                    , IsReCallback: true
                    , isFromDB: false
                    , GraphicList: GraphicList
                    , Callback: function (BusinessLayer) {
                        BusinessLayer.setMinScale(minScale);
                        var GSettings = {
                            GraphicList: GraphicList//坐标数组列表
                            , LayerName: "CLSSLayer"//图层名称
                            , Layer: null//图层对象
                            , IsCallback: false//是否有返回值
                        };
                        API.ArcGISAPI.addGraphicToLayer(GSettings);
                    }
                    , onClickEvent: function (evt) {
                        API.ArcGISAPI.stopBaseEvent(evt);
                        infoEvent(evt);
                    }
                };
                $.extend(Settings, Properties);
                API.ArcGISAPI.businessLayerShow(Settings);
            }
            else //Roger 2016/6/1 13:00:02 增加管辖区域
            {
                var layer = ArcGIS_Map.getLayer("Business_CLSSLayer");
                if (fw.fwObject.FWObjectHelper.hasValue(layer)) {
                    layer.clear();
                };
                //                var erroInfo = resultData.infoList.join("<br>");
                //                $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
            };
        }
    }));
};

//弹框信息
var infoEvent = function (evt) {
    var SelPointfeature = evt.graphic;
    if (SelPointfeature.attributes == undefined || SelPointfeature.attributes == null) {
        return;
    };
    var Entity = SelPointfeature.attributes;
    var divJQ = null;
    var Width = 320;
    var divJQ = $("<div class=\"divMapInfoWindowContent\" style='z-index:99;'></div>").width(Width).appendTo("body");
    var divInfoJQ = $("<div class=\"divInfo\"></div>").appendTo(divJQ);
    var BodyHtml = "", TableHtml = "";
    BodyHtml += "<table><tr><td style='width:50%;'>净化槽编码:" + getValueStatus(Entity.monitorSiteName) + "</td><td>设备编码：" + getValueStatus(Entity.equipmentNo) + "</td></tr>";
    BodyHtml += "<tr><td>户主名：" + getValueStatus(Entity.householdName) + "</td><td>行政区：" + getValueStatus(Entity.cantonName) + "</td></tr>";
    //BodyHtml += "<tr><td>设备状态：" + GetSiteStatus(Entity.statusCode) + "</td><td><div id='divDetailInfo' class=\"divDetailInfo\" style='margin-top:0px;float:right'></div></td></tr></table>";
    
    if (Entity.moduleTypeCode==1) {
        BodyHtml += "<tr><td>设备状态：" + Entity.statusCode + "</td><td><div id='divDetailInfo' class=\"divDetailInfo\" style='margin-top:0px;float:right'></div></td></tr></table>";
    } else {
        var gatewayStatus = "未监测";
        if (Entity.statusCode==1) {
            gatewayStatus = "超0.5h无数据";
        } else if(Entity.statusCode == 2){
            gatewayStatus = "超1h无数据";
        } else if (Entity.statusCode == 0){
            gatewayStatus = "正常";  
        }
        BodyHtml += "<tr><td>设备状态：" + gatewayStatus + "</td><td></td></tr></table>";
    }
    $(BodyHtml).appendTo(divInfoJQ);
    var divDetailInfoJQ = $(".divDetailInfo");
    var data = {
        ticket: $.page.ticket
        , action: "view"
        , monitorSiteCode: Entity.monitorSiteCode
        , pageTabs: "info,ws"
    };
    var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/monitorSite/monitorSiteViewMain.htm", $.page.webSiteRootUrl), data);
    divDetailInfoJQ.click(function () {
        mini.open({
            ticket: $.page.ticket,
            url: url,
            title: ("设施点位详情信息"),
            width: 1000,
            height: 500,
            showMaxButton: true,     //显示最大化按钮
            showModal: false      //显示遮罩
        });
    });

    var Settings2 = {
        Title: Entity.cantonName.substring(4) + "_" + Entity.equipmentNo,
        domNode: divJQ[0],
        Width: divJQ.outerWidth() + 20,
        Height: divJQ.outerHeight() + 20,
        evt: evt
    };
    API.ArcGISAPI.mapInfoWindowShow(Settings2);
};


//查询定位到具体设施点位
var ZoomToCLSSPoint = function (Entity) {
    API.ArcGISAPI.mapInfoWindowHide();
    var SearchCallback = function (evt) {
        ArcGISAPI.stopBaseEvent(evt);
        var divJQ = null;
        var Width = 320;
        var divJQ = $("<div class=\"divMapInfoWindowContent\" style='z-index:99;'></div>").width(Width).appendTo("body");
        var divInfoJQ = $("<div class=\"divInfo\"></div>").appendTo(divJQ);
        var BodyHtml = "", TableHtml = "";
        BodyHtml += "<table><tr><td style='width:50%;'>净化槽编码:" + getValueStatus(Entity.monitorSiteName) + "</td><td>设备编码：" + getValueStatus(Entity.equipmentNo) + "</td></tr>";
        BodyHtml += "<tr><td>户主名：" + getValueStatus(Entity.householdName) + "</td><td>行政区：" + getValueStatus(Entity.cantonName) + "</td></tr>";

        //政府管理者角色登录后，隐藏设备运行状态  songshasha 2016-11-9
        if (fw.fwCookie.FWCookieHelper("login_role") == "govAdminRole") {

            BodyHtml += "<tr><td >             </td><td><div id='divDetailInfo' class=\"divDetailInfo\" style='margin-top:0px;float:right'></div></td></tr></table>";
        }
        else {
            //BodyHtml += "<tr><td>设备状态：" +
            //    GetSiteStatus(Entity.statusCode) +
            //    "</td><td><div id='divDetailInfo' class=\"divDetailInfo\" style='margin-top:0px;float:right'></div></td></tr></table>";
            BodyHtml += "<tr><td>设备状态：" + Entity.statusCode + "</td><td><div id='divDetailInfo' class=\"divDetailInfo\" style='margin-top:0px;float:right'></div></td></tr></table>";
        }

        $(BodyHtml).appendTo(divInfoJQ);
        var divDetailInfoJQ = $(".divDetailInfo");
        var data = {
            ticket: $.page.ticket
            , action: "view"
            , monitorSiteCode: Entity.monitorSiteCode
            , pageTabs: "info,ws"
        };
        var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/monitorSite/monitorSiteViewMain.htm", $.page.webSiteRootUrl), data);
        divDetailInfoJQ.click(function () {
            mini.open({
                ticket: $.page.ticket,
                url: url,
                title: ("设施点位详情信息"),
                width: 1000,
                height: 500,
                showMaxButton: true,     //显示最大化按钮
                showModal: false      //显示遮罩
            });
        });
        var Settings2 = {
            Title: Entity.cantonName + "_" + Entity.equipmentNo,
            domNode: divJQ[0],
            Width: divJQ.outerWidth() + 20,
            Height: divJQ.outerHeight() + 20,
            evt: evt
        };
        API.ArcGISAPI.mapInfoWindowShow(Settings2);
    };
    //API.ArcGISAPI.addPointAndzoomToPoint({ attr: Entity, posX: Entity.longitude, posY: Entity.latitude, zoomLevel: ZoomLevel + 5, callback: SearchCallback, symbolstate: GetSiteStatus(Entity.statusCode), reorderIndex: 99 });
    API.ArcGISAPI.addPointAndzoomToPoint({ attr: Entity, posX: Entity.longitude, posY: Entity.latitude, zoomLevel: ZoomLevel + 5, callback: SearchCallback, symbolstate: Entity.statusCode, reorderIndex: 99 });
};



//处理设施查询显示
function CLSS_Search() {
    //添加列表 
    var settings = {
        ArcGISWindow: API.ArcGISAPI.ArcGISWindow,
        ArcGISMap: API.ArcGISAPI.ArcGISMap,
        Title: "污水处理净化槽列表",
        Width: 960,
        Height: 600,
        Url: "../autoMonitor/monitorSiteByStatusList.htm",
        Data: { callType: "map", callBackHanlder: "ZoomToCLSSPoint", cantonCode: "", statusCode: "", viewCode: 2 },
        Position: { "left": 200, "bottom": 30 }
    };
    divPopUpFrameBoxJQ.PopUpFrameBoxShow(settings);
};


//获取处理设施点位状态
function GetSiteStatus(siteStatus) {
    var siteStatusText = "";
    switch (siteStatus) {
        case "1":
            siteStatusText = "正常";
            break;
        case "4":
            siteStatusText = "设备漏气";
            break;
        case "5":
            siteStatusText = "设备堵塞";
            break;
        case "9":
            siteStatusText = "通讯故障";
            break;
        case "3":
            siteStatusText = "供电故障";
            break;
        case "10":
            siteStatusText = "调试中";
            break;
        case "13":
            siteStatusText = "报停设备";
            break;
        default:
            siteStatusText = "正常";
            break;
    };
    return siteStatusText;
};


//用mini加载列表
function PopUpFrameBoxShow_MiniOpen(Properties) {
    var Settings = {
        cantonCode: ""
        , statusCode: ""
        , viewCode: ""
        , callBackHanlder: ""
        , title: ""
        , url: ""
        , monitorSiteCode: ""
        , action: ""
    };
    $.extend(Settings, Properties);
    var data = {
        ticket: $.page.ticket
        , cantonCode: Settings.cantonCode
        , statusCode: Settings.statusCode
        , viewCode: Settings.viewCode
        , callBackHanlder: Settings.callBackHanlder
        , monitorSiteCode: Settings.monitorSiteCode
        , action: Settings.action
    };

    var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl(Settings.url, $.page.webSiteRootUrl), data);
    //    mini.open({
    //        url: url,
    //        title: (Settings.title),
    //        width: 800,
    //        height: 600,
    //        showMaxButton: true,     //显示最大化按钮
    //        showModal: false      //显示遮罩
    //    });

    $("#divPopUpFrameBoxSearch").hide();
    // ControlData.ControlJQs.SmallToolsControls.width('280px')
    // $('.SmallToolsControls').width('280px')
    // $('.smallToolsControls').width('280px')
    var settings = {
        ArcGISWindow: API.ArcGISAPI.ArcGISWindow,
        ArcGISMap: API.ArcGISAPI.ArcGISMap,
        Title: (Settings.title),
        Width: 960,
        Height: 600,
        Url: url,
        Data: data,
        Position: { "left": 210, "bottom": 80 }
    };
    divPopUpFrameBoxJQ.PopUpFrameBoxShow(settings);

};

//运维监控
function OMControl_Show() {
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "operationMaintenance"
        , methodName: "getMBLLOperationMaintenancePersonLocationList"//"queryRealTimeMonitorSiteStatis"
        , data: {
            ticket: $.page.ticket //"fbb44844-d6ee-454c-a9d7-51808424e64f", //$.page.ticket,
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                var EntityList = [];
                for (var i = 0; i < resultData.data.length; i++) {
                    EntityList[i] = resultData.data[i];
                    EntityList[i].posX = resultData.data[i].longitude;
                    EntityList[i].posY = resultData.data[i].latitude;
                    EntityList[i].Image = $.page.webSiteRootUrl + 'web/style/maps/images/pointImage/' + GetOMControlStatus(resultData.data[i].timespan) + '.png';
                };

                var Settings = {
                    LayerName: "OMControlLayer"
                    , IsCallback: false
                    , IsReCallback: true
                    , isFromDB: false
                    , GraphicList: EntityList
                    , Symbol_W: 36
                    , Symbol_H: 36
                    , Callback: function (BusinessLayer) {

                    }
                    , onClickEvent: function (evt) {
                        infoOMControlEvent(evt);
                    }
                };
                API.ArcGISAPI.businessLayerShow(Settings);

                //加载图例
                var settings = {
                    ArcGISWindow: API.ArcGISAPI.ArcGISWindow,
                    ArcGISMap: API.ArcGISAPI.ArcGISMap,
                    legend: [{ name: "运维中", image: $.page.webSiteRootUrl + 'web/style/maps/images/pointImage/运维.png' },
                    { name: "离线", image: $.page.webSiteRootUrl + 'web/style/maps/images/pointImage/未运行.png' }
                    ]
                };
                AddLegendControl(settings);

                //搜索功能
                API.SearchAndConcernUnbind();
                API.SearchAndConcernBind({
                    SearchButtonOnClick: function (e, Keyword) {
                        if (Keyword == "请输入运维人员名称") {
                            Keyword = "";
                        };
                        $.page.ajax($.page.getAjaxSettings({
                            serviceType: "crossDomainCall"
                            , serviceName: "operationMaintenance"
                            , methodName: "getMBLLOperationMaintenancePersonLocationList"
                            , data: {
                                ticket: $.page.ticket
                                , Keyword: Keyword
                                , topNum: 10
                            }
                            , success: function (resultData) {
                                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                                    var newEntityList = [];
                                    for (var i = 0; i < resultData.data.length; i++) {
                                        if (resultData.data[i].operationMaintenancePersonName.indexOf(Keyword) > -1) {
                                            newEntityList.push(resultData.data[i]);
                                        };
                                    };
                                    API.SearchAndConcernContentBind({
                                        TextFieldName: "operationMaintenancePersonName"
                                        , IconUrlFieldName: "IconUrl"
                                        , DataSource: newEntityList
                                        , TemplateFunction: function (Entity, Index) {
                                            return Entity[this.TextFieldName];
                                        }
                                        , RowOnClick: function (Entity) {
                                            ZoomToOMPoint(Entity);
                                        }
                                    });
                                };
                            }
                        }));
                    }
                    , HintValue: "请输入运维人员名称"
                });
            }
            else //Roger 2016/6/1 13:00:02 增加管辖区域
            {
                var erroInfo = resultData.infoList.join("<br>");
                $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
            };
        }
    }));

};


//获取运维监控点位状态
var GetOMControlStatus = function (timespan) {
    var OMControlImage = null;
    if (timespan < 10) {
        OMControlImage = "运维";
    }
    else {
        OMControlImage = "未运行";
    }
    return OMControlImage;

};

//弹框信息
var infoOMControlEvent = function (evt) {
    var SelPointfeature = evt.graphic;
    if (SelPointfeature.attributes == undefined || SelPointfeature.attributes == null) {
        return;
    };
    var divJQ = null;
    var Width = 320;
    var divJQ = $("<div class=\"divMapInfoWindowContent\" style='z-index:99;'></div>").width(Width).appendTo("body");
    var divInfoJQ = $("<div class=\"divInfo\"></div>").appendTo(divJQ);
    var BodyHtml = "", TableHtml = "";
    BodyHtml += "<table><tr><td>运维公司：" + SelPointfeature.attributes.operationMaintenanceUnitName + "</td><td><div id='divDetailOMInfo' class=\"divDetailOMInfo\" style='margin:5px;'>&nbsp&nbsp运维信息</div></td></tr>";
    BodyHtml += "<tr><td>最新定位时间：" + SelPointfeature.attributes.lastActionTime + "</td><td><div id='divDetailTaskInfo' class=\"divDetailTaskInfo\" style='margin:5px;'>&nbsp&nbsp任务信息</div></td></tr></table>";
    $(BodyHtml).appendTo(divInfoJQ);

    var divDetailOMInfoJQ = $(".divDetailOMInfo");
    var data = {
        ticket: $.page.ticket
        , operationMaintenancePersonCode: SelPointfeature.attributes.operationMaintenancePersonCode
        , isSolve: 0   //0未完成  1已完成
        , isView: 1
        , statusCode: 2
        , action: "view"
    };
    var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/operations/operationsPerson.htm", $.page.webSiteRootUrl), data);
    divDetailOMInfoJQ.click(function () {
        mini.open({
            ticket: $.page.ticket,
            url: url,
            title: ("运维信息"),
            width: 680,
            height: 300,
            showMaxButton: true,     //显示最大化按钮
            showModal: false      //显示遮罩
        });
    });

    var divDetailTaskInfoJQ = $(".divDetailTaskInfo");

    var url2 = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/operationMaintenance/operationMaintenancePersonTaskList.htm", $.page.webSiteRootUrl), data);
    divDetailTaskInfoJQ.click(function () {
        mini.open({
            ticket: $.page.ticket,
            url: url2,
            title: ("任务信息"),
            width: 1000,
            height: 500,
            showMaxButton: true,     //显示最大化按钮
            showModal: false      //显示遮罩
        });
    });

    var Settings2 = {
        Title: SelPointfeature.attributes.operationMaintenancePersonName,
        domNode: divJQ[0],
        Width: divJQ.outerWidth() + 20,
        Height: divJQ.outerHeight() + 20,
        evt: evt
    };
    API.ArcGISAPI.mapInfoWindowShow(Settings2);
};

//查询定位到具体运维定位点位
var ZoomToOMPoint = function (Entity) {
    API.ArcGISAPI.mapInfoWindowHide();
    var Settings = {
        bFlash: false//是否显示闪烁
        , LayerName: "OMControlLayer"//业务图层名称
        , LayerKeyFieldName: "operationMaintenancePersonCode"//图层关键字段名称
        , BusinessCode: Entity.operationMaintenancePersonCode//业务编码
        , ZoomScale: ZoomLevel + 4//缩放比例，默认0，可选参数
        , reorderIndex: 99//闪烁图层显示顺序
    };
    API.ArcGISAPI.zoomToPoint(Settings);
};


function HomeInit() {
    if (setIntervalFunction != null) {
        clearInterval(setIntervalFunction);
        setIntervalFunction = null;
        API.ArcGISAPI.businessLayerRemove({ LayerName: "Business_cantonPts" });
    };
    homeCantonCode = null;
    divModuleJQ.hide();
    divArcGISLegendJQ.hide();
    API.ArcGISAPI.removeDivLayer();
    dojo.disconnect(ArcGIS_Map.panEndEvent);
    ArcGIS_Map.panEndEvent = null;
    API.SearchAndConcernUnbind();
    API.SliderControlUnbind();
    API.ArcGISAPI.mapInfoWindowHide();
    API.ArcGISAPI.businessLayerHide();
    divPopUpFrameBoxJQ.hide();
    // $('.smallToolsControls').width('280px')
    divPopUpFrameBoxSearchJQ.hide();
    var settings = { LayerName: "BJ" };
    API.ArcGISAPI.removeMapService(settings);
    var settings = { LayerName: "CSCanton" };
    API.ArcGISAPI.removeMapService(settings);
    newFullExtent = "";
    setTimeout(function () { API.ArcGISAPI.zoomToFullExtent(); }, 300);
};
function mapInit() {
    API.ArcGISAPI.mapInfoWindowHide();
    API.ArcGISAPI.businessLayerHide();
    divPopUpFrameBoxJQ.hide();
    isHomeInitShow = true;
    //API.ArcGISAPI.zoomToFullExtent();
    //$("div.title_min", divPopUpFrameBoxJQ).click();
};
//处理设施隐藏
function CLSS_Hide() {
    API.ArcGISAPI.mapInfoWindowHide();
    API.ArcGISAPI.businessLayerHide();
    API.SearchAndConcernUnbind();
    divArcGISLegendJQ.hide();
    divPopUpFrameBoxJQ.hide();
    // ControlData.ControlJQs.SmallToolsControls.width('280px')
    // $('.SmallToolsControls').width('280px')
    divPopUpFrameBoxSearchJQ.hide();
    API.SliderControlUnbind();
    API.ArcGISAPI.removeDivLayer();
    dojo.disconnect(ArcGIS_Map.panEndEvent);
    ArcGIS_Map.panEndEvent = null;
    $("#divSearchAllPoints").hide();
    API.ArcGISAPI.businessLayerRemove({ LayerName: "处理设施" });
    API.ArcGISAPI.mapChangeExtent(newFullExtent);
};
//设施查询隐藏
function CLSS_Search_Hide() {
    API.ArcGISAPI.mapInfoWindowHide();
    API.ArcGISAPI.businessLayerHide();
    divPopUpFrameBoxJQ.hide();
    divPopUpFrameBoxSearchJQ.hide();
    // ControlData.ControlJQs.SmallToolsControls.width('280px')
    // $('.SmallToolsControls').width('280px')
    dojo.disconnect(ArcGIS_Map.panEndEvent);
    ArcGIS_Map.panEndEvent = null;
    API.ArcGISAPI.businessLayerRemove({ LayerName: "处理设施" });
    API.ArcGISAPI.mapChangeExtent(newFullExtent);
};

function getValueStatus(value) {
    var status = null;
    if (fw.fwObject.FWObjectHelper.hasValue(value)) {
        status = value;
    } else {
        status = "--";
    };
    return status;
};


//设施概况(old)
//function CLSS_Show() {
//    if (!fw.fwObject.FWObjectHelper.hasValue(homeCantonCode)) {
//        alert("请点击信息列表，选择行政区！");
//        return;
//    };
//    //当前行政区编码
//    var currentCantonCode = "";
//    $.page.ajax($.page.getAjaxSettings({
//        serviceType: "crossDomainCall"
//        , serviceName: "basicInfo"
//        , methodName: "queryRealMonitorSiteStatis"//"queryRealTimeMonitorSiteStatis"
//        , data: {
//            ticket: $.page.ticket
//            , cantonCode: homeCantonCode
//        }
//        , success: function (resultData) {
//            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
//                //数据源
//                //                var monitorSiteStatisDataList = $.Enumerable.From(resultData.data).Select("{cantonCode:$.cantonCode,cantonName:$.cantonName,parentCantonCode:$.parentCantonCode,parentCantonName:$.parentCantonName,count:$.monitorSiteAmount,posX:$.posX,posY:$.posY,level:$.level,status_9:$.realtimeStatusStatis.status_9,status_1:$.realtimeStatusStatis.status_1,status_4:$.realtimeStatusStatis.status_4,status_5:$.realtimeStatusStatis.status_5,childItemList:[] }").ToArray();
//                //                var monitorSiteRealTimeStatisDataList = $.Enumerable.From(monitorSiteStatisDataList).Select(function (p) {
//                //                    p.childItemList = $.Enumerable.From(monitorSiteStatisDataList).Where("$.parentCantonCode==" + p.cantonCode).OrderByDescending("$.count").ThenBy("$.cantonCode").ToArray();
//                //                    return p;
//                //                }).ToArray();
//                var monitorSiteRealTimeStatisDataList = resultData.data;
//                //加载行政区图层
//                var MapSettings = {
//                    IsVisible: true,
//                    LayerName: "CSCanton",
//                    MapServiceUrl: CantonLayerUrl,
//                    MapServiceLayerType: Code__MapServiceLayerType.TiledMapService
//                                       , onClickEvent: function (evt) { //点击事件
//                                           var level = ArcGIS_Map.getLevel();
//                                           var attrName = ""; //行政区名称
//                                           if (level > ZoomLevel && (level < ZoomLevel + 3)) {
//                                               attrName = "TownName";
//                                           }
//                                           else if (level >= (ZoomLevel + 3)) {
//                                               attrName = "Name";
//                                           };
//                                           if (!fw.fwObject.FWObjectHelper.hasValue(layerIds)) {
//                                               return;
//                                           };
//                                           var geometry = new esri.geometry.Point(evt.mapPoint.x, evt.mapPoint.y);
//                                           var settings = {
//                                               layerUrl: CantonLayerUrl,
//                                               geometry: geometry,
//                                               layerIds: layerIds,
//                                               onCompletedEvent: function (result) {
//                                                   if (result.length > 0) {
//                                                       var g = result[0].feature;
//                                                       var cantonCode = g.attributes[searchFields];
//                                                       var cantonName = g.attributes[attrName];
//                                                       if (currentCantonCode != cantonCode) {
//                                                           currentCantonCode = cantonCode;
//                                                           API.ArcGISAPI.mapInfoWindowHide();
//                                                           for (var i = 0; i < $("#sltTown")[0].length; i++) {
//                                                               if ($("#sltTown")[0][i].value == cantonCode) {
//                                                                   $("#sltTown")[0][i].selected = true;
//                                                                   bindCun(cantonCode, true);
//                                                                   bindStatus(cantonCode);
//                                                                   break;
//                                                               };
//                                                           };
//                                                           //高亮显示网格
//                                                           var graphicSetting = {
//                                                               LayerName: "GL",
//                                                               ReorderLayerIndex: 0,
//                                                               GeometryList: [{ Geometry: g.geometry, Symbol: GetDefaultSymbolByName(SymbolNames.Polygon_Highlighte), Attributes: g.attributes}]
//                                                                , Callback: function () {
//                                                                    if (level >= (ZoomLevel + 3)) {
//                                                                        var arr = $("#divArcGISMap_DivLayers").children();
//                                                                        arr.show();
//                                                                        $("[divlayername='divArcGISMap_DivLayers_" + cantonName + "']").hide();
//                                                                        var Settings = {
//                                                                            statusCode: ""
//                                                                          , cantonCode: cantonCode
//                                                                        };
//                                                                        AddBusinessLayer(Settings);
//                                                                    }
//                                                                }
//                                                           };
//                                                           if (level > ZoomLevel) {
//                                                               API.ArcGISAPI.addGraphicToLayer(graphicSetting);
//                                                           };
//                                                       };
//                                                   };
//                                               }
//                                           };
//                                           API.ArcGISAPI.taskIdentify(settings);
//                                       }
//                };
//                API.ArcGISAPI.addMSLayerByLayerId(MapSettings);
//                //加载左下角列表
//                var Settings = {
//                    TextFieldName: "cantonName",
//                    IconUrlFieldName: "Color",
//                    DataSource: monitorSiteRealTimeStatisDataList,
//                    TemplateFunction: function (Entity) { return Entity[this.TextFieldName]; },
//                    BusinessEvent: BindCanton,
//                    RowOnClick: function (cantonCode, cboValue, IsWithMap, IsStatusList, Entity) {
//                        if (IsWithMap) {
//                            if (currentCantonCode != cantonCode) {
//                                currentCantonCode = cantonCode;
//                                API.ArcGISAPI.mapInfoWindowHide();
//                                if (fw.fwObject.FWObjectHelper.hasValue(cantonCode)) {
//                                    if (cantonCode == homeCantonCode) {
//                                        var layer = ArcGIS_Map.getLayer("Business_GL");
//                                        if (fw.fwObject.FWObjectHelper.hasValue(layer)) {
//                                            layer.clear();
//                                            return;
//                                        };
//                                    };
//                                    var mapSettings2 = {
//                                        layerName: "WG",
//                                        searchFields: searchFields,
//                                        searchText: cantonCode,
//                                        layerIds: layerIds,
//                                        layerUrl: CantonLayerUrl,
//                                        onCompletedEvent: function (result) {
//                                            if (result.length > 0) {
//                                                var g = result[0].feature;
//                                                //高亮显示网格
//                                                var graphicSetting = {
//                                                    LayerName: "GL",
//                                                    ReorderLayerIndex: 0,
//                                                    GeometryList: [{ Geometry: g.geometry, Symbol: GetDefaultSymbolByName(SymbolNames.Polygon_Highlighte), Attributes: g.attributes}]
//                                                        , Callback: function (GLayer) {
//                                                            var zoomLevel = ZoomLevel + 2;
//                                                            if (Entity.level == 3) {
//                                                                zoomLevel = zoomLevel + 2;
//                                                                var onCompletedEvt = function () {
//                                                                    var arr = $("#divArcGISMap_DivLayers").children();
//                                                                    arr.show();
//                                                                    var cantonName = g.attributes.cantonname;
//                                                                    $("[divlayername='divArcGISMap_DivLayers_" + cantonName + "']").hide();
//                                                                    var Settings = {
//                                                                        statusCode: ""
//                                                                                                                                  , cantonCode: cantonCode
//                                                                    };
//                                                                    AddBusinessLayer(Settings);
//                                                                    dojo.disconnect(ArcGIS_Map.ExtentChangeEvent);
//                                                                    ArcGIS_Map.ExtentChangeEvent = null;
//                                                                };
//                                                                API.ArcGISAPI.zoomToPolygon(g.geometry, zoomLevel, onCompletedEvt);
//                                                            }
//                                                            else {
//                                                                API.ArcGISAPI.zoomToPolygon(g.geometry, zoomLevel);
//                                                            };
//                                                        }
//                                                };
//                                                API.ArcGISAPI.addGraphicToLayer(graphicSetting);
//                                            };
//                                        }
//                                    };
//                                    API.ArcGISAPI.taskFind(mapSettings2);
//                                };
//                            };
//                        }
//                        else {
//                            if (!IsStatusList) {
//                                //显示列表
//                                //                                var settings = {
//                                //                                    ArcGISWindow: API.ArcGISAPI.ArcGISWindow,
//                                //                                    ArcGISMap: API.ArcGISAPI.ArcGISMap,
//                                //                                    Title: "污水处理设施列表",
//                                //                                    Width: 690,
//                                //                                    Height: 300,
//                                //                                    Url: "../basicInfo/monitorSiteByStatusList.htm",
//                                //                                    Data: { ticket: $.page.ticket, cantonCode: cantonCode, statusCode: cboValue, viewCode: 1, callBackHanlder: "ZoomToCLSSPoint" },
//                                //                                    Position: { "left": 5, "bottom": 180 }
//                                //                                };
//                                // divPopUpFrameBoxJQ.PopUpFrameBoxShow(settings);
//                                //定位到具体的处理设施点位
//                                var Settings = {
//                                    cantonCode: cantonCode
//                                    , statusCode: cboValue
//                                    , viewCode: 1
//                                    , callBackHanlder: "ZoomToCLSSPoint"
//                                    , title: "污水处理设施列表"
//                                    , url: "web/basicInfo/monitorSiteByStatusList.htm"
//                                };
//                                PopUpFrameBoxShow_MiniOpen(Settings);
//                            }
//                            else {
//                                  var level = ArcGIS_Map.getLevel();
//                                  if (level > (ZoomLevel + 2)) {
//                                var layerIds = "";
//                                var Settings = {
//                                    statusCode: cboValue
//                                    , cantonCode: cantonCode
//                                };
//                                AddBusinessLayer(Settings);
//                                  }
//                            }
//                        }
//                    }
//                };
//                API.SliderControlListBind(Settings);
//                API.SliderControlAdd(Settings);
//                API.SliderControlSlideToggle();
//                $(".divCantonStatisticsToggle").click();
//                //饼图数据源  
//                var siteDataForPieData = $.Enumerable.From(monitorSiteRealTimeStatisDataList).Where("$.count>0").Select(function (p) {
//                    var pieData = [
//                        { name: "正常", statusCode: 1, color: "#009933", y: p.status_1, cantonCode: p.cantonCode },
//                        { name: "设备漏气", statusCode: 4, color: "#ff9900", y: p.status_4, cantonCode: p.cantonCode },
//                        { name: "设备堵塞", statusCode: 5, color: "#DFA724", y: p.status_5, cantonCode: p.cantonCode },
//                        { name: "通讯故障", statusCode: 9, color: "#5a5a5a", y: p.status_9, cantonCode: p.cantonCode }
//                        ];
//                    p.EntityList = [];
//                    p.EntityList = pieData;
//                    return p;
//                }).ToArray();
//                var list = $.Enumerable.From(siteDataForPieData).Where("$.level==1").ToArray();
//                var list2 = $.Enumerable.From(siteDataForPieData).Where("$.level==2").ToArray();
//                var list3 = $.Enumerable.From(siteDataForPieData).Where("$.level==3").ToArray();
//                //生成饼图
//                var showChart = function (attr, size) {
//                    var arrDivs = $("#divArcGISMap_DivLayers").children();
//                    for (var i = 0; i < arrDivs.length; i++) {
//                        var isExit = false;
//                        for (var j = 0; j < attr.length; j++) {
//                            var cantonName = attr[j].cantonName;
//                            if (arrDivs[i].children[0].id == cantonName) {
//                                isExit = true;
//                                break;
//                            }
//                        }
//                        if (!isExit) {
//                            $("[divlayername='divArcGISMap_DivLayers_" + arrDivs[i].children[0].id + "']").remove();
//                        }
//                    };
//                    var cantonDiv = [];
//                    for (var i = 0; i < attr.length; i++) {
//                        var cantonName = attr[i].cantonName;
//                        var isExit = false;
//                        for (var j = 0; j < arrDivs.length; j++) {
//                            if (arrDivs[j].children[0].id == cantonName) {
//                                isExit = true;
//                                break;
//                            };
//                        };
//                        if (!isExit) {
//                            cantonDiv.push(attr[i]);
//                        };
//                    }
//                    ;
//                    for (var i = 0; i < cantonDiv.length; i++) {
//                        API.ArcGISAPI.addDivLayer({
//                            DivLayerName: cantonDiv[i].cantonName,
//                            EntityList: cantonDiv[i].EntityList,
//                            HideLevel: 5,
//                            TemplateFunction: function (Entity, SymbolJQ) {
//                                Entity.X = cantonDiv[i].posX;
//                                Entity.Y = cantonDiv[i].posY;
//                                var renderTo = cantonDiv[i].cantonName;
//                                SymbolJQ.attr("id", renderTo).width(size).height(size);
//                                var chartSetting = {
//                                    RenderTo: renderTo,
//                                    cantonName: cantonDiv[i].cantonName,
//                                    cantonCode: cantonDiv[i].cantonCode,
//                                    EntityList: cantonDiv[i].EntityList,
//                                    onClickEvent: function (data) {
//                                        var cantonCode = data.cantonCode;
//                                        var statusCode = data.statusCode;
//                                        //显示列表
//                                        //                                        var settings = {
//                                        //                                            ArcGISWindow: API.ArcGISAPI.ArcGISWindow,
//                                        //                                            ArcGISMap: API.ArcGISAPI.ArcGISMap,
//                                        //                                            Title: "污水处理设施列表",
//                                        //                                            Width: 690,
//                                        //                                            Height: 300,
//                                        //                                            Url: "../basicInfo/monitorSiteByStatusList.htm",
//                                        //                                            Data: { ticket: $.page.ticket, cantonCode: cantonCode, statusCode: statusCode, viewCode: 1, callBackHanlder: "ZoomToCLSSPoint" },
//                                        //                                            Position: { "left": 5, "bottom": 5 }
//                                        //                                        };
//                                        // divPopUpFrameBoxJQ.PopUpFrameBoxShow(settings);
//                                        var Settings = {
//                                            cantonCode: cantonCode
//                                           , statusCode: statusCode
//                                           , viewCode: 1
//                                           , callBackHanlder: "ZoomToCLSSPoint"
//                                           , title: "污水处理设施列表"
//                                           , url: "web/basicInfo/monitorSiteByStatusList.htm"
//                                        };
//                                        PopUpFrameBoxShow_MiniOpen(Settings);
//                                    },
//                                    onAllClickEvent: function (cantonCode) {
//                                        //显示列表
//                                        //                                        var settings = {
//                                        //                                            ArcGISWindow: API.ArcGISAPI.ArcGISWindow,
//                                        //                                            ArcGISMap: API.ArcGISAPI.ArcGISMap,
//                                        //                                            Title: "污水处理设施列表",
//                                        //                                            Width: 690,
//                                        //                                            Height: 300,
//                                        //                                            Url: "../basicInfo/monitorSiteByStatusList.htm",
//                                        //                                            Data: { ticket: $.page.ticket, cantonCode: cantonCode, statusCode: "", viewCode: 1, callBackHanlder: "ZoomToCLSSPoint" },
//                                        //                                            Position: { "left": 5, "bottom": 5 }
//                                        //                                        };
//                                        // divPopUpFrameBoxJQ.PopUpFrameBoxShow(settings);
//                                        var Settings = {
//                                            cantonCode: cantonCode
//                                           , statusCode: ""
//                                           , viewCode: 1
//                                           , callBackHanlder: "ZoomToCLSSPoint"
//                                           , title: "污水处理设施列表"
//                                           , url: "web/basicInfo/monitorSiteByStatusList.htm"
//                                        };
//                                        PopUpFrameBoxShow_MiniOpen(Settings);
//                                    }
//                                };
//                                HighChatTools.loadMapChart(chartSetting);
//                            },
//                            XFieldName: "X",
//                            YFieldName: "Y"
//                        });
//                    }
//                };
//                //饼图动态加载
//                var changeFun = function (evt) {
//                    // $("#divArcGISMap_DivLayers").empty();
//                    var level = ArcGIS_Map.getLevel();
//                    var EntityList = [];
//                    var pieSize = "";
//                    var DataList = [];
//                    if (fw.fwObject.FWObjectHelper.hasValue(evt)) {
//                        if (level > 8 && level < 11) {
//                            DataList = list;
//                            pieSize = 180;
//                        } else if (level >= 11 && level < 13) {
//                            DataList = list2;
//                            pieSize = 160;
//                        } else if (level >= 13) {
//                            DataList = list3;
//                            pieSize = 120;
//                        };
//                        for (var i = 0; i < DataList.length; i++) {
//                            if (evt.xmin < DataList[i].posX && evt.xmax > DataList[i].posX && evt.ymin < DataList[i].posY && evt.ymax > DataList[i].posY) {
//                                EntityList.push(DataList[i]);
//                            };
//                        };
//                        showChart(EntityList, pieSize);
//                    }
//                };
//                var initEvt = { xmin: GXMin, ymin: GYMin, xmax: GXMax, ymax: GYMax };
//                changeFun(initEvt);
//                ArcGIS_Map.panEndEvent = dojo.connect(ArcGIS_Map, "onPanEnd", function (evt) {
//                    changeFun(evt);
//                });
//            }
//            else //Roger 2016/6/1 13:00:02 增加管辖区域
//            {
//                var erroInfo = resultData.infoList.join("<br>");
//                $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
//            };
//        }
//    }));
//    //搜索功能
//    API.SearchAndConcernUnbind();
//    API.SearchAndConcernBind({
//        SearchButtonOnClick: function (e, Keyword) {
//            if (Keyword == "请输入设施名称") {
//                Keyword = "";
//            };
//            $.page.ajax($.page.getAjaxSettings({
//                serviceType: "crossDomainCall"
//                            , serviceName: "basicInfo"
//                            , methodName: "queryMonitorSiteEasy"
//                            , data: {
//                                ticket: $.page.ticket
//                                       , Keyword: Keyword
//                                       , topNum: 10
//                            }
//                            , success: function (resultData) {
//                                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
//                                    var newEntityList = [];
//                                    for (var i = 0; i < resultData.data.length; i++) {
//                                        if (resultData.data[i].monitorSiteName.indexOf(Keyword) > -1) {
//                                            newEntityList.push(resultData.data[i]);
//                                        };
//                                    };
//                                    API.SearchAndConcernContentBind({
//                                        TextFieldName: "monitorSiteName"
//                                        , IconUrlFieldName: "IconUrl"
//                                        , DataSource: newEntityList
//                                        , TemplateFunction: function (Entity, Index) {
//                                            return Entity[this.TextFieldName];
//                                        }
//                                        , RowOnClick: function (Entity) {
//                                            ZoomToCLSSPoint(Entity);
//                                        }
//                                    });
//                                }
//                                else //Roger 2016/6/1 13:00:02 增加管辖区域
//                                {
//                                    var erroInfo = resultData.infoList.join("<br>");
//                                    $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
//                                };
//                            }
//            }));
//        }
//      , HintValue: "请输入设施名称"
//    });
//    //添加图例
//    var settings = {
//        ArcGISWindow: API.ArcGISAPI.ArcGISWindow,
//        ArcGISMap: API.ArcGISAPI.ArcGISMap,
//        legend: [{ name: "正常", image: $.page.webSiteRootUrl + 'web/style/maps/images/pointImage/正常.png' },
//                 { name: "设备漏气", image: $.page.webSiteRootUrl + 'web/style/maps/images/pointImage/设备漏气.png' },
//                 { name: "设备堵塞", image: $.page.webSiteRootUrl + 'web/style/maps/images/pointImage/设备堵塞.png' },
//                 { name: "通讯故障", image: $.page.webSiteRootUrl + 'web/style/maps/images/pointImage/通讯故障.png' }
//                ]
//    };
//    AddLegendControl(settings);
//};


//搜索敏感点位
function autocompleteArcgisSearchInit() {
    var EntityList = [];
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "basicInfo"
        , methodName: "queryMonitorSiteEasy"
        , data: {
            ticket: $.page.ticket
            , Keyword: ""
            , topNum: 999
            , cantonCode: homeCantonCode
        }
        , success: function (resultData) {
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                EntityList = resultData.data;
                for (var i = 0; i < EntityList.length; i++) {
                    //EntityList[i].Image = "web/style/maps/images/pointImage/" + GetSiteStatus(EntityList[i].statusCode) + ".png";
                    EntityList[i].Image = "web/style/maps/images/pointImage/" + EntityList[i].statusCode + ".png";
                };
                mini.parse();
                mini.get("autocompleteArcgisSearch").set({
                    onfocus1: function (e) {
                        e.sender.setWidth(256);
                    }
                    , onblur1: function (e) {
                        e.sender.setWidth(128);
                    }
                    , onvaluechanged: function (e) {
                        e.sender.focus(e);
                        //e.value;
                        var entity = e.selected;
                        ZoomToCLSSPoint(entity);

                    }
                    , onbeforeload: function (e) {
                        var v = e.sender.getText();
                        var data = [];
                        for (var i = 0; i < EntityList.length; i++) {
                            var entity = EntityList[i];
                            if (entity.monitorSiteName.indexOf(v) > -1) {
                                data.push(entity);
                                if (data.length > 10) {
                                    break;
                                };
                            };
                        };
                        e.result = data;
                        e.cancel = true;


                    }
                    , ondrawcell: function (e) {
                        var item = e.record, field = e.field, value = e.value;
                        //组织HTML设置给cellHtml
                        e.cellHtml = '<table><tr><td><img style="width:18px;height:18px;" src="' + $.page.webSiteRootUrl + item.Image + '"/></td><td>' + item.monitorSiteName + '</td></tr></table>';
                    }
                });
                var lineHeight = mini.get("autocompleteArcgisSearch").getHeight() - 2;
                $(".mini-placeholder-label", mini.get("autocompleteArcgisSearch").el).css("line-height", lineHeight + "px");
                $(mini.get("autocompleteArcgisSearch")._textEl).css("line-height", lineHeight + "px");
                //mini.setOpacity($.page.idM.autocompleteArcgisSearch._textEl, 0.3);
                mini.get("autocompleteArcgisSearch").show();
            }
            //                                    else {
            //                                        var erroInfo = resultData.infoList.join("<br>");
            //                                        $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
            //                                    }
        }
    }));

};


//搜索敏感点位
function aysncAutocompleteArcgisSearchInit() {

    mini.get("autocompleteArcgisSearch").set({
        onfocus1: function (e) {
            e.sender.setWidth(256);
        }
        , onblur1: function (e) {
            e.sender.setWidth(128);
        }
        , onvaluechanged: function (e) {
            e.sender.focus(e);
            //e.value;
            var entity = e.selected;
            ZoomToCLSSPoint(entity);

        }
        , ondrawcell: function (e) {
            var item = e.record, field = e.field, value = e.value;
            //组织HTML设置给cellHtml
            var imgPath = "web/style/maps/images/pointImage/" + item.statusCode + ".png";
            e.cellHtml = '<table><tr><td><img style="width:18px;height:18px;" src="' + $.page.webSiteRootUrl + imgPath + '"/></td><td>' + item.monitorSiteName + '</td></tr></table>';
        }
        , onbeforeload: function (e) {
            e.url = $.page.webSiteRootUrl+"service/json/call";
            e.params = {
                serviceName: "basicInfo",
                methodName: "queryMonitorSiteEasy",
                paramsJson: "{ ticket: \"" + $.page.ticket + "\", keyWord: \"" + e.sender.getText()+"\", topNum: 999, cantonCode:\"" + homeCantonCode+"\" }"

            };
            e.data = e.params;
        }

    });


    

};
