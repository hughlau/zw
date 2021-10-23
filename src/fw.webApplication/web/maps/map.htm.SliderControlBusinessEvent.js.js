//绑定处理设施厂区
function BindCanton(properties) {
    var Settings = {
        titleJQ: null, //标题栏控件图层
        contentJQ: null  //存放业务的控件图层
    };
    $.extend(Settings, properties);
    var list = Settings.DataSource;
    //绑定标题
    $("<span>厂区</span>").appendTo(Settings.titleJQ);

    //绑定内容
    Settings.contentJQ.html("");
    var statusJQ = $("<ul class=\"ulCantonStatisticsList\" ></ul>").appendTo(Settings.contentJQ);

    //绑定状态
    bindStatus = function (cantonCode) {
        var statusList = [];
        // var cantonCode = $("#sltTown").val();
        var Data = GetDataFromDataList(list, "cantonCode", cantonCode);
        statusList = GetStatus(Data);
        statusJQ.empty();
        var Html = "";
        if (!fw.fwObject.FWObjectHelper.hasValue(statusList)) {
            return;
        };
        for (var i = 0; i < statusList.length; i++) {
            var Entity = statusList[i];
            var Text = Settings.TemplateFunction(Entity, i);
            var IconUrl = Entity[Settings.IconUrlFieldName];
            var Color = Entity[Settings.ColorFieldName];
            var Image = Entity["Image"];           
            var Code = Entity["Code"];
            var Name = Entity["cantonName"];
            var liJQ = $("<li></li>").data("Entity", Entity).appendTo(statusJQ).bind("click", function () {
                var thisJQ = $(this);
                var spanIconJQ = thisJQ.find(".Icon");
                var spanIconHtml = spanIconJQ.prop('outerHTML');
                if (fw.fwObject.FWObjectHelper.hasValue(spanIconHtml)) {
                    var objSpanE = document.createElement("span");
                    objSpanE.innerHTML = spanIconHtml;
                    var spanIconJS = objSpanE.childNodes;
                    var spanIconJSAttr = spanIconJS[0].attributes["checked"];

                    var spanIconAttr = null;
                    if (fw.fwObject.FWObjectHelper.hasValue(spanIconJSAttr)) {
                        spanIconAttr = spanIconJSAttr.value;
                    };
                    // statusJQ.find(".Icon").removeAttr("checked").html("");
                    statusJQ.find('.checkedA').removeClass('checkedA').end().find(".Icon").removeAttr("checked");
                    // spanIconJQ.attr("checked", "checked").html("√");
                    spanIconJQ.attr("checked", "checked").parent().parent().parent().addClass('checkedA');

                } else {
                    var parentsJQ = thisJQ.parents(".ulCantonStatisticsList");
                    parentsJQ.find("li").each(function (i, data) {
                        var spanIconJQ = $(data).find(".Icon");
                        if (spanIconJQ.length > 0) {
                            spanIconJQ.attr("checked", "checked").html("√");
                        };
                    });
                };
                var code = thisJQ.data("Entity").Code;
                bindCunCount(code);
                $("#cun span span span:first").html("<span>" + thisJQ.data("Entity").cantonName + "</span>");
                RowOnClick(thisJQ, false, false, true);
            });
            var aJQ = $("<a></a>").appendTo(liJQ);
            var spanJQ = $("<span></span>").appendTo(aJQ);
            var spanJQ = $("<span></span>").appendTo(spanJQ);
            if (fw.fwObject.FWObjectHelper.hasValue(IconUrl) || fw.fwObject.FWObjectHelper.hasValue(Color)) {
                var spanIconJQ = "";
                // if (Text.indexOf("全部") != -1) {
                //     spanIconJQ = $("<span class=\"Icon\" style=\"background: " + Color + "\" checked='checked'>√</span>").appendTo(spanJQ);
                // } else {
                //     spanIconJQ = $("<span class=\"Icon\" ><img src="+Image+" width='100%' h='100%'></span>").appendTo(spanJQ);
                // }
                if (Text.indexOf("全部") != -1) {
                    aJQ.addClass('checkedA')
                } 
                spanIconJQ = $("<span class=\"Icon\" ><img src="+Image+" width='100%' h='100%'></span>").appendTo(spanJQ);
                // ;style=\"background: url(" + Image + ")\" 
            };
            if (i == 0) {
                var total = 0;
                for (var m = 1; m < statusList.length; m++) {
                    total += statusList[m].count;
                };
                $("<span>" + Text + "</span><span class='statusCount'>(" + total + ")</span>").appendTo(spanJQ);
            } else {
                var count = fw.fwObject.FWObjectHelper.hasValue(statusList[i].count) ? statusList[i].count : 0;
                $("<span>" + Text + "</span><span class='statusCount'>(" + count + ")</span>").appendTo(spanJQ);
            };
        };
        $(Html).appendTo(statusJQ);
    };

   

    //绑定行政村数目
    var bindCunCount = function (type, site_town) {
        var villageAttr = $(".count");
        var cantonCode = $("#sltTown").val();
        if (!fw.fwObject.FWObjectHelper.hasValue(site_town)) {
            for (var m = 0; m < list.length; m++) {
                if (list[m].cantonCode == cantonCode) {
                    if (list[m].childDataList.length > 0) {
                        site_town = list[m].childDataList;                               
                        break;
                    } else {
                        site_town = list[m];
                        break;
                    };
                } else if (list[m].childDataList.length > 0) {
                    for (var n = 0; n < list[m].childDataList.length; n++) {
                        if (list[m].childDataList[n].cantonCode == cantonCode) {
                            if (list[m].childDataList[n].childDataList.length > 0) {
                                site_town = list[m].childDataList[n].childDataList;                                
                                break;
                            } else {
                                site_town = list[m].childDataList[n];
                                break;
                            };
                        }
                    };
                }
            };
        };
        if (!fw.fwObject.FWObjectHelper.hasValue(site_town)) {
            return;
        };
        if (!fw.fwObject.FWObjectHelper.hasValue(type)) {
            //不传具体状态时
            var sum = 0;
            if (site_town.length > 0) {
                for (var n = 0; n < site_town.length; n++) {
                    var total = site_town[n].monitorSiteAmount;
                    sum += total;
                    villageAttr[n + 1].innerHTML = "(" + total + ")";
                };
                villageAttr[0].innerHTML = "(" + sum + ")";
            } else {
                villageAttr[0].innerHTML = "(" + site_town.monitorSiteAmount + ")";
            };
        } else {
            var sum = 0;
            var total = 0;
            if (site_town.length > 0) {
                for (var n = 0; n < site_town.length; n++) {
                    //modify by lxg 20180319
                    var code = "status_" + type;
                    total = fw.fwObject.FWObjectHelper.hasValue(site_town[n].realtimeStatusStatis[code]) ? site_town[n].realtimeStatusStatis[code] : 0;
                    villageAttr[n + 1].innerHTML = "(" + total + ")";
                    sum += total;
                };
                villageAttr[0].innerHTML = "(" + sum + ")";
            } else {
                //modify by lxg 20180319
                var statusCode = "status_" + type;
                total = fw.fwObject.FWObjectHelper.hasValue(site_town.realtimeStatusStatis[statusCode]) ? site_town.realtimeStatusStatis[statusCode] : 0;
                villageAttr[0].innerHTML = "(" + total + ")";
            };
        }
    };
    var RowOnClick = function (thisJQ, isNoIcon, IsWithMap, IsStatusList) {
        cboValue = "";
        var EntityList = [];
        statusJQ.find("li").each(function (i, data) {
            var spanIconJQ = $(data).find(".Icon");
            if (spanIconJQ.length > 0) {
                var spanIconHtml = spanIconJQ.prop('outerHTML');
                var objSpanE = document.createElement("span");
                objSpanE.innerHTML = spanIconHtml;
                var spanIconJS = objSpanE.childNodes;
                var spanIconJSAttr = spanIconJS[0].attributes["checked"];
                var spanIconAttr = null;
                if (fw.fwObject.FWObjectHelper.hasValue(spanIconJSAttr)) {
                    spanIconAttr = spanIconJSAttr.value;
                };
                if (spanIconAttr == "checked") {
                    var Entity = $(data).data("Entity");
                    cboValue += Entity.Code + ",";
                };
            };
        });

        cboValue = jQueryExtension.ToStringWithOutEndChar(cboValue, ',');
        if (!isNoIcon) {
            // var code = $("#sltTown").val();
            Settings.RowOnClick(thisJQ.data("Entity").cantonCode, cboValue, IsWithMap, IsStatusList, thisJQ.data("Entity"));
        } else {
            //高亮样式
            Settings.contentJQ.find("a").removeClass("active");
            thisJQ.find("a").addClass("active");
            IsStatusList = false;
            Settings.RowOnClick(thisJQ.data("Entity").cantonCode, cboValue, IsWithMap, IsStatusList, thisJQ.data("Entity"));
        };
    };


    //绑定厂区
    var townJQ = $("<select id='sltTown' style='margin-left:5px;width:230px;height:28px;padding:5px;'></select>").appendTo(Settings.titleJQ);
    for (var i = 0; i < list.length; i++) {
        $("<option name='" + list[i].cantonName + "' value='" + list[i].cantonCode + "'>" + list[i].cantonName + "</option>").appendTo(townJQ);
        if (fw.fwObject.FWObjectHelper.hasValue(list[i].childDataList) && list[i].childDataList.length > 0) {
            for (var j = 0; j < list[i].childDataList.length; j++) {
                $("<option  value='" + list[i].childDataList[j].cantonCode + "'>&nbsp;&nbsp;&nbsp;--" + list[i].childDataList[j].cantonName + "</option>").appendTo(townJQ);
            };
        };
    };
    //绑定厂区change事件
    var cboValue = "";
    var contentJQ = $("<ul id='cun' class=\"ulCantonStatisticsList\"  style='width:950px;height:auto;'></ul>").appendTo(Settings.contentJQ);
    $("#sltTown").change(function () {
        var value = $(this).val();
        var IsWithMap = true;
        bindCun(value, IsWithMap);
        bindStatus(value);
        if (value == homeCantonCode) {
            var layer = ArcGIS_Map.getLayer("Business_CLSSLayer");
            if (fw.fwObject.FWObjectHelper.hasValue(layer)) {
                layer.clear();
            };            
            API.ArcGISAPI.mapChangeExtent(newFullExtent);
        }
        ;
    });

    //绑定村
    bindCun = function (cantonCode, IsWithMap, IsStatusList) {
        contentJQ.html("");
        var AllDataList = [];
        var Entity = {};
        var Data = GetDataFromDataList(list, "cantonCode", cantonCode);
        Entity.count = Data.monitorSiteAmount;
        Entity.cantonName = "全部";
        Entity.cantonCode = Data.cantonCode;
        Entity.level = Data.level;
        AllDataList.push(Entity);
    
        if (fw.fwObject.FWObjectHelper.hasValue(Data.childDataList) && (Data.childDataList.length > 0)) {
            for (var i = 0; i < Data.childDataList.length; i++) {
                AllDataList.push(Data.childDataList[i]);
            };
        };
        for (var i = 0; i < AllDataList.length; i++) {
            var Entity = AllDataList[i];
            var Text = Settings.TemplateFunction(Entity);
            var IconUrl = Entity[Settings.IconUrlFieldName];
            // var Color = Entity[Settings.ColorFieldName];
            var liJQ = $("<li></li>").data("Entity", Entity).appendTo(contentJQ).bind("click", function () {
                var thisJQ = $(this);
                cboValue = "";
                RowOnClick(thisJQ, cboValue, IsWithMap, IsStatusList);
                IsWithMap = false;
                IsStatusList = false;
                //判断页面未完全加载时操作现场设备 add by wangyang 20171018
                if($("#divPopUpFrameBoxSearch")[0].style.display=='none'){
                   $('.smallToolsControls').width('322px'); 
                }                
                $('body .divPopUpFrameBox').css("top",'10px');
            });
            var aJQ = $("<a></a>").appendTo(liJQ);
            var spanJQ = $("<span></span>").appendTo(aJQ);
            var spanJQ = $("<span></span>").appendTo(spanJQ);

            $("<span>" + Text + "</span><span class='count'>(" + Entity.count + ")</span>").appendTo(spanJQ);
            if (i == 0) {
                liJQ.click();  
            };
        }
        ;
        bindCunCount("", Data.childDataList);
    };
    bindStatus(homeCantonCode);
    bindCun(homeCantonCode, false, true);
};
var bindStatus = function () { };
var bindCun = function () { };



////左下角状态数据
//var statusEntity = [{ cantonName: "全部", Code: "", count: 0, Color: "#5797D5",Image:"/web/style/maps/images/pointImage/全部.png" },// add by wangyang 20171018
//                    { cantonName: "正常", Code: 1, count: 0, Color: "#00b050",Image: "/web/style/maps/images/pointImage/正常.png"},
//                    { cantonName: "设备漏气", Code: 4, count: 0, Color: "#DF6624",Image: "/web/style/maps/images/pointImage/设备漏气.png"},
//                    { cantonName: "设备堵塞", Code: 5, count: 0, Color: "#DFA724",Image: "/web/style/maps/images/pointImage/设备堵塞.png"},
//                    { cantonName: "通讯故障", Code: 9, count: 0, Color: "#5a5a5a",Image: "/web/style/maps/images/pointImage/通讯故障.png"},
//                    { cantonName: "供电故障", Code: 3, count: 0, Color: "#FF7F50", Image: "/web/style/maps/images/pointImage/供电故障.png" },
//                    { cantonName: "调试中", Code: 10, count: 0, Color: "#9400D3", Image: "/web/style/maps/images/pointImage/调试中.png" },
//                    { cantonName: "报停设备", Code: 13, count: 0, Color: "#CC0033", Image: "/web/style/maps/images/pointImage/报停设备.png" }
//                  ];


//返回状态值    modify by lxg 20180402
function GetStatus(Entity) {
    var statusEntity = [];
    for (var i = 0; i < Entity.siteStatusData.length; i++) {
        var cantonname = Entity.siteStatusData[i].statusName;
        var scode = "status_" + Entity.siteStatusData[i].statusCode;
        var image = "/web/style/maps/images/pointImage/" + cantonname + ".png";
        statusEntity[i] = {
            cantonName: cantonname,
            Code: Entity.siteStatusData[i].statusCode,
            count: Entity.realtimeStatusStatis[scode],
            Color: Entity.siteStatusData[i].color,
            Image: image,
            cantonCode: Entity.cantonCode
        };
        if (cantonname === "全部") {
            statusEntity[i].count = "";
            statusEntity[i].Code = "";
        }
    }
    //console.log(statusEntity);
    return statusEntity;
}
//返回状态值
//function GetStatus(Entity) {
//    console.log(Entity);
//    console.log("======");
//    for (var i = 0; i < statusEntity.length; i++) {
//        switch (i) {
//            case 0:
//                statusEntity[i].count = "";
//            case 1:
//                statusEntity[i].count = Entity.realtimeStatusStatis.status_1;

//                break;
//            case 2:
//                statusEntity[i].count = Entity.realtimeStatusStatis.status_4;
//                break;
//            case 3:
//                statusEntity[i].count = Entity.realtimeStatusStatis.status_5;
//                break;
//            case 4:
//                statusEntity[i].count = Entity.realtimeStatusStatis.status_9;
//                break;
//            case 5:
//                statusEntity[i].count = Entity.realtimeStatusStatis.status_3;
//                break;
//            case 6:
//                statusEntity[i].count = Entity.realtimeStatusStatis.status_10;
//                break;
//            case 7:
//                statusEntity[i].count = Entity.realtimeStatusStatis.status_13;
//                break;
//        };
//        statusEntity[i].cantonCode = Entity.cantonCode;
//    };
//    return statusEntity;
//}

var GetDataFromDataList = function (DataList, KeyFieldName, Key) {
    var Data = [];
    for (var i = 0; i < DataList.length; i++) {
        if (DataList[i][KeyFieldName] == Key) {
            Data = DataList[i];
            break;
        } else if (fw.fwObject.FWObjectHelper.hasValue(DataList[i].childDataList) && DataList[i].childDataList.length) {
            for (var j = 0; j < DataList[i].childDataList.length; j++) {
                if (DataList[i].childDataList[j][KeyFieldName] == Key) {
                    Data = DataList[i].childDataList[j];
                    break;
                };
            }
        };
    };
    return Data;
};
