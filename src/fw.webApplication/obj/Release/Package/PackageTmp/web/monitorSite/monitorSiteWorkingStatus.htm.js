var monitorSiteCode = undefined;
var statusColorMapping = [];
$.page.pageInit = function () {
};
$.page.pageLoad = function () { 
    //点位信息
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.monitorSiteCode)) {
        monitorSiteCode = $.page.params.monitorSiteCode;
        queryMonitorSiteStatics(monitorSiteCode);
    };
};

/*查询监测点位因子列表汇总数据（包括汇总）*/
function queryMonitorSiteStatics(monitorSiteCode) {
    var conditionData = {};
    if (fw.fwObject.FWObjectHelper.hasValue(monitorSiteCode)) {
        conditionData.monitorSiteCode = monitorSiteCode;
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "autoMonitor"
            , methodName: "queryAutoMonitorStatics"
            , data: {
                ticket: $.page.ticket
                , pageParams: {
                    pageSize: 100,
                    pageIndex: 1
                }
                , queryParams: conditionData
            }
            , success: function (resultData) {
                //判断加载数据成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                    var monitorStatics = resultData.data;
                    for (var i = 0; i < monitorStatics.length; i++) {
                        statusColorMapping.add({ statusName: monitorStatics[i].statusName, statusCode: monitorStatics[i].statusCode, color: monitorStatics[i].color });
                    };
                    // monitorStatics. 
                    var monitorSiteFactorList = monitorStatics[0].monitorSiteFactorList;
                    if (fw.fwObject.FWObjectHelper.hasValue(monitorStatics[0].monitorSiteLatestDataList)) {
                        var monitorSiteLatestDataList = fw.fwObject.FWObjectHelper.hasValue(monitorStatics[0].monitorSiteLatestDataList.columns) ? fw.fwDataTable.FWDataTableHelper.toEntityList(monitorStatics[0].monitorSiteLatestDataList) : monitorStatics[0].monitorSiteLatestDataList;
                        monitorSiteLatestData = monitorSiteLatestDataList[0];
                        //加载工况情况
                        load_WorkingStatus(monitorSiteFactorList, monitorSiteLatestData);
                    };
                }
                else //Roger 2016/6/1 13:00:02 增加管辖区域
                {
                    var erroInfo = resultData.infoList.join("<br>");
                    $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
                };
            }
        }));
    };
};


function load_WorkingStatus(monitorSiteFactorList, monitorSiteLatestData) {
    //状态
    var statusCode = monitorSiteLatestData.statusCode;
    var imgPath = fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/scripts/themes/default/basicInfo/images/", $.page.webSiteRootUrl);


    //监测因子内容
    var siteFactorDataList = [];
    for (var i = 0; i < monitorSiteFactorList.length; i++) {
        var factorCode = monitorSiteFactorList[i].monitorFactorCode;
        var fileName = monitorSiteFactorList[i].monitorFactorName;
        var valueFiled = monitorSiteLatestData["Value_" + factorCode];
        var timeFiled = monitorSiteLatestData["DateTime_" + factorCode];
        var statusFiled = monitorSiteLatestData["statusCode_" + factorCode];
        var statusNameFiled = monitorSiteLatestData["statusName_" + factorCode];
        var unitName = monitorSiteLatestData["Unit_" + factorCode];
        var color = $.Enumerable.From(statusColorMapping).Where("$.statusCode==" + statusFiled).Select("$.color").First();
        siteFactorDataList.push({
            valueFiled: valueFiled,
            timeFiled: timeFiled,
            statusFiled: statusFiled,
            statusNameFiled: statusNameFiled,
            unitName: unitName,
            fileName: fileName,
            monitorFactorCode: factorCode,
            color: color
        });
        //气泵电流(mA) 
        if (factorCode == '000009') {
            //通讯故障
            if (statusFiled == "9") {
                $("#divPump").css("background-image", "url(" + imgPath + "sb_0.gif)").attr("title", statusNameFiled);
                $("#divPressureIns").css("background-image", "url(" + imgPath + "yb_0.gif)").attr("title", fileName);
                $("#pumpVal").html("");
            } else {
                $("#divPump").css("background-image", "url(" + imgPath + "sb_1.gif)").attr("title", statusNameFiled);
                $("#divPressureIns").css("background-image", "url(" + imgPath + "yb_1.gif)").attr("title", fileName);
                $("#pumpVal").html(valueFiled);
            };
        };
        //水泵电流(mA)
        if (factorCode == '000008') {
            //通讯故障
            if (statusFiled == "9") {
                $("#divFJ").css("background-image", "url(" + imgPath + "fj_0.gif)").attr("title", statusNameFiled);
                $("#divFJValue").css("background-image", "url(" + imgPath + "yb_0.gif)").attr("title", fileName);
                $("#fjValue").html("");
            } else {
                $("#divFJ").css("background-image", "url(" + imgPath + "fj_1.gif)").attr("title", statusNameFiled);
                $("#divFJValue").css("background-image", "url(" + imgPath + "yb_1.gif)").attr("title", fileName);
                $("#fjValue").html(valueFiled);
            };
        };
    };
    //最新时间
    var lastDate = $.Enumerable.From(siteFactorDataList).Select("$.timeFiled").OrderByDescending("$.timeFiled").First();
    $("#sampTime").html(isSameDay(lastDate));
    var html = "";
    for (var j = 0; j < siteFactorDataList.length; j++) {
        var entity=siteFactorDataList[j];
        html += "<div class='divfactors' ><span >" + entity.fileName + "：</span> <span  style='width:40px;color:" + entity.color + "'>" + entity.valueFiled + "</span><span  style='float:right;' >" + isSameDay(entity.timeFiled) + "</span></div>";
    };
    $("#divYZ").html(html);
};

function isSameDay(sampdate) {
    var result = "";
    var issameday = moment(sampdate).isSame(moment().format(), 'day');
    if (issameday) {
        result = moment(sampdate).format("HH:mm:ss");
    } else {
        result = moment(sampdate).format("YYYY-MM-DD");
    };
    return result;
};