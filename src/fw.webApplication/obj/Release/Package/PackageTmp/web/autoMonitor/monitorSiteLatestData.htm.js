var dataSourceList = [];
var infectTitleJq = null;
var infectTitleContentJq = null;
var btnColorMenuJQ = null;
var btnSearchJQ = null;
var datagrid1JQ = null;
var tempMonitorSiteLatestData = null;
var statusColorMapping = [];
var statusCode = "";
var conditionData = {};
var statusCodeSelect = "";
$.page.pageInit = function () {
    checkIsProjectSelected();
    $.page.dataSourceSettingsDictionary = {
        "cantonCode": {
            dataSourceName: "sysBasicManage.getCantonDicData"
            , dataSourceParams: { ticket: $.page.ticket, pCode: window.top['cantonCodeCache'] }
        }
    };
};
$.page.pageLoad = function () {

    infectTitleJq = $("#infectTitle");
    infectTitleContentJq = $("#infectTitleContent");
    btnColorMenuJQ = $("#btnColorMenu");
    btnSearchJQ = $("#btnSearch");
    datagrid1JQ = $.page.idM.datagrid1;

    btnSearchJQ.bind("click", function () { onSearch(); });

    btnSearchJQ.click();
};
function onSearch(cSettings) {
    conditionData = $.page.idM.conditionForm.getData();
    conditionData.projectNo = window.top['_projectCache'];
    //alert(statusCodeSelect);
    /*if ($.pageCustomer.hasValue(statusCode)) {
        conditionData.statusCode = statusCode;
    };*/
    datagrid1_Load(0, undefined, statusCodeSelect, cSettings);
};


//数据导出
function dataExport() {
    onSearch({ isExport: true, pageSize: fw.fwNumber.intMaxValue, pageIndex: 1 });
    $.page.idM.datagrid1.dataSourceSettings.methodName = "exportAutoMonitorStatics";
    $.page.exportFile({ idM: $.page.idM.datagrid1, reportName: '在线监测数据列表' });
};
function datagrid1_BeforeLoad(e) {
    //取消datagrid的miniui自动加载
    e.cancel = true;
    //miniui的页数与实际相差1页
    var pageIndex = e.data.pageIndex + 1;
    var pageSize = e.data.pageSize;
    //datagrid加载数据
    datagrid1_Load(pageIndex, pageSize);
};


function datagrid1_Load(pageIndex, pageSize, statusCode, cSettings) {
    //如果没传入页数
    if (!$.pageCustomer.hasValue(pageIndex)) {
        //将页数设置为datagrid的页数
        pageIndex = $.page.idM.datagrid1.pageIndex;
    };
    //如果没传入分页大小
    if (!$.pageCustomer.hasValue(pageSize)) {
        //将分页大小设置为datagrid的分页大小
        pageSize = $.page.idM.datagrid1.pageSize;
    };
    if (!fw.fwObject.FWObjectHelper.hasValue(cSettings)) {
        //将分页大小设置为datagrid的分页大小
        cSettings = {
            idM: $.page.idM.datagrid1,
            isExport: false
        };
    }
    else {
        cSettings.idM = $.page.idM.datagrid1;
    };
    //alert(statusCodeSelect);
    statusCodeSelect = statusCode;
    //排序字段
    var sortFieldList = null;
    //如果datagrid设置有排序字段
    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.datagrid1.sortField)) {
        //将排序字段设置为datagrid的排序字段
        sortFieldList = [{
            fieldName: $.page.idM.datagrid1.getSortField()
            , sortType: fw.fwData.FWSortType[$.page.idM.datagrid1.getSortOrder()]
        }];
    };
    //状态过滤
    if ($.pageCustomer.hasValue(statusCode)) {
        //将分页大小设置为datagrid的分页大小
        conditionData.statusCode = statusCode;
    };

    conditionData.projectNo = window.top['_projectCache'];

    //开启datagrid数据加载锁屏
    $.page.idM.datagrid1.loading();

    queryMonitorSiteStatics(statusCode, pageSize, pageIndex, cSettings);
};


/*查询监测点位因子列表汇总数据（包括汇总）*/
function queryMonitorSiteStatics(statusCode, pageSize, pageIndex, cSettings) {

    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "autoMonitor"
        , methodName: "queryAutoMonitorStatics"
        , data: {
            ticket: $.page.ticket
           , pageParams: {
               pageSize: fw.fwObject.FWObjectHelper.hasValue(cSettings.pageSize) ? cSettings.pageSize : pageSize
                , pageIndex: fw.fwObject.FWObjectHelper.hasValue(cSettings.pageIndex) ? cSettings.pageIndex : pageIndex
           }
           , queryParams: conditionData
        }
        , success: function (resultData) {
            //debugger;
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                var monitorStatics = resultData.data;
                var i;
                if (!$.pageCustomer.hasValue(statusCode) || statusCode == 00) {
                    btnColorMenuJQ.empty();
                    for (i = 0; i < monitorStatics.length; i++) {
                        if (monitorStatics[i].statusName == "未上线") {
                            continue;
                        }
                        statusColorMapping.add({
                            statusName: monitorStatics[i].statusName,
                            statusCode: monitorStatics[i].statusCode,
                            color: monitorStatics[i].color
                        });
                        var ul = $("<ul></ul>").appendTo(btnColorMenuJQ);
                        var liOne = $("<div style='color: " +
                            monitorStatics[i].color +
                            "; margin-top: 3px; margin-left: 5px; float:left;'>" +
                            monitorStatics[i].statusName +
                            ":</div>").appendTo(ul);
                        var labelId = monitorStatics[i].statusName + monitorStatics[i].statusCode;//给label添加一个Id
                        var liTwo = $("<li title='" +
                            monitorStatics[i].statusName +
                            "' tag='liBackground' color='" +
                            monitorStatics[i].color +
                            "' style=' float:left; width: auto;height: auto;border: 1px solid " +
                            monitorStatics[i].color +
                            ";color: " +
                            monitorStatics[i].color +
                            ";text-align: center;padding-left: 8px;padding-right: 8px;'><label id='" + labelId + "'> " +
                            monitorStatics[i].monitorSiteCount +
                            "</label>").data("Entity", monitorStatics[i]).bind("click",
                            function() {
                                var data = $(this).data("Entity");
                                $("*[tag='liBackground']").each(function() {
                                    var color = $(this).attr("color");
                                    $(this).css({
                                        "background-color": "white",
                                        "color": color
                                    });
                                });
                                $(this).css({
                                    "background-color": data.color,
                                    "color": "white"
                                });
                                datagrid1_Load(null, null, data.statusCode);

                            }).appendTo(ul);
                    };
                } else {
                    for (i = 0; i < monitorStatics.length; i++) {
                        var id = monitorStatics[i].statusName + monitorStatics[i].statusCode;
                        if (monitorStatics[i].statusCode == statusCode) {
                            document.getElementById(id).innerHTML = monitorStatics[i].monitorSiteCount;
                            continue;
                        }
                        document.getElementById(id).innerHTML = "#";
                    }
                }
                queryMonitorSiteFactorList(monitorStatics[0].monitorSiteFactorList, monitorStatics[0].monitorSiteLatestDataList, monitorStatics[0].recordCount, pageSize, pageIndex);
            } else {
                if (resultData.infoList != null && resultData.infoList.length > 0) {
                    mini.alert(resultData.infoList[0]);
                };
            };
        }, complete: function () {
            $.page.idM.datagrid1.unmask();
        }, error: function () {
            alert(statusCode);
        }
    }, cSettings));
};

function queryMonitorSiteFactorList(monitorSiteFactorList, monitorSiteLatestDataList, recordCount, pageSize, pageIndex) {
    pageIndex = pageIndex > 0 ? pageIndex - 1 : pageIndex;
    setColumns(monitorSiteFactorList, monitorSiteLatestDataList);
    if (monitorSiteLatestDataList != null) {
        monitorSiteLatestDataList = fw.fwObject.FWObjectHelper.hasValue(monitorSiteLatestDataList.columns) ? fw.fwDataTable.FWDataTableHelper.toEntityList(monitorSiteLatestDataList) : monitorSiteLatestDataList;
        tempMonitorSiteLatestData = monitorSiteLatestDataList;

        datagrid1JQ.set({
            pageIndex: pageIndex
                    , pageSize: pageSize
                    , totalCount: recordCount
                    , data: monitorSiteLatestDataList
        });
    } else {
        datagrid1JQ.set({
            pageIndex: pageIndex
                    , pageSize: pageSize
                    , totalCount: recordCount
                    , data: []
        });
    };
};

function setColumns(monitorSiteFactorList) {
    var columns_data = [
    { type: "indexcolumn", header: "序号", width: 60, headerAlign: "center" },
    { header: "行政区名称", field: "cantonName", name: "cantonName", width: 160, headerAlign: "center", align: "left" }
    , { header: "净化槽编码", field: "monitorSiteName", name: "monitorSiteName", width: 120, headerAlign: "center", align: "left", renderer: "datagrid1_Renderer" }
     , { header: "设备编码", field: "equipmentNo", name: "equipmentNo", width: 120, headerAlign: "center", align: "left" }
      //, { header: "集中器编码", field: "dtumac", name: "dtumac", width: 120, headerAlign: "center", align: "left" }

    ];
    if (monitorSiteFactorList != null && monitorSiteFactorList.length > 0) {
        for (var i = 0; i < monitorSiteFactorList.length; i++) {
            var col_obj = {
                header: monitorSiteFactorList[i].monitorFactorName,
                field: monitorSiteFactorList[i].monitorFactorName,
                name: monitorSiteFactorList[i].monitorFactorCode,
                width: 180,
                headerAlign: "center",
                align: "right",
                allowSort: "true",
                renderer: "datagrid1_Renderer"
            };
            columns_data.push(col_obj);
        };
    };
    datagrid1JQ.set({
        columns: columns_data
    });
};


function datagrid1_Renderer(e) {
    var html = '';

    switch (e.field) {
        case "monitorSiteName":
            {
                var numColor = "green";
                var statusName = "";
                for (var i = 0; i < statusColorMapping.length; i++) {
                    if (statusColorMapping[i].statusCode == e.record.statusCode) {
                        numColor = statusColorMapping[i].color;
                        statusName = statusColorMapping[i].statusName;
                    };
                };
                html = '<span class="spanEnterpriseDataStatus" style="cursor: default; color:' + numColor + '" title="' + statusName + '">●</span> <a href="javascript:openWindow__MonitorSiteData(\'' + e.record.monitorSiteCode + '\');" style="color:blue;">' + e.value + '</a>';
            }
            break;

        default:
            {
                var fileName = e.column.name;
                var record = e.record;
                var valueFiled = record["Value_" + fileName];
                var timeFiled = record["DateTime_" + fileName];
                var statusFiled = record["statusCode_" + fileName];
                var statusNameFiled = record["statusName_" + fileName];
                var unitName = record["Unit_" + fileName];
                if (fw.fwObject.FWObjectHelper.hasValue(valueFiled)) {
                    //状态获取值statusNameFiled
                    var today = moment().format("YYYY-MM-DD");
                    var monitorTime = moment(timeFiled, "YYYY-MM-DD"); //YYYY-MM-DD H:mm:ss

                    var timecss = "";
                    var monitorTimeFormat = "";
                    if (monitorTime.isSame(moment(today))) {
                        //今日之后的日期  
                        timecss = 'div0Days';
                        monitorTimeFormat = moment(timeFiled).format("H:mm:ss");
                    } else if (monitorTime.isSame(moment(today).subtract(1, 'days'))) {
                        //昨日
                        timecss = 'div-1Days';
                        monitorTimeFormat = moment(timeFiled).format("H:mm:ss");
                    } else if (monitorTime.isSame(moment(today).subtract(2, 'days'))) {
                        //前日
                        timecss = 'div-2Days';
                        monitorTimeFormat = moment(timeFiled).format("H:mm:ss");
                    } else {
                        monitorTimeFormat = moment(timeFiled).format("YYYY-MM-DD");
                    };
                    var numColor = "black";
                    //判断时间 然后样式和格式
                    for (var i = 0; i < statusColorMapping.length; i++) {
                        if (statusColorMapping[i].statusCode == statusFiled) {
                            numColor = statusColorMapping[i].color;
                        };
                    };
                    var dateV = moment(timeFiled).format('YYYY-MM-DD HH:mm:ss');
                    html = '<div><A class="classNumber" style="FONT-SIZE: 13px; COLOR: ' + numColor + '" href="javascript:openWindow__MonitorSiteHistoryData({monitorSiteCode:\'' + e.record.monitorSiteCode + '\',monitorFactorCode:\'' + e.column.name + '\',equipmentCode:\'' + e.record.equipmentCode + '\',monitorTime:\'' + dateV + '\'});">' + valueFiled + '</A></div><DIV class="classNumber divMonitorTime ' + timecss + '">' + monitorTimeFormat + '</DIV>';
                } else {
                    html = "";
                };
            }
            break;
    };
    return html;

};

//时间选择限制 开始时间 暂存申请信息 OK
function onDrawStartDate(e) {
    var date = e.date;
    var d = new Date();
    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.mCallTimeTo.value)) {
        if (date.getTime() > $.page.idM.mCallTimeTo.value) {
            e.allowSelect = false;
        };
    };
};
//时间选择限制 结束时间 暂存申请信息 OK
function onDrawEndDate(e) {
    var date = e.date;
    var d = new Date();

    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.mCallTimeFrom.value)) {
        if (date.getTime() < $.page.idM.mCallTimeFrom.value) {
            e.allowSelect = false;
        };
    };
};


function openWindow__MonitorSiteHistoryData(params) {
    //参数
    var data = {
        ticket: $.page.ticket
    };
    $.extend(data, params);
    var pageParams = { url: "web/autoMonitor/onlineMonitorDataSearch.htm", width: 1024, height: 768, title: "监测历史数据" };
    pageParams.url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl(pageParams.url, $.page.webSiteRootUrl), data);
    //打开选择用户窗口
    mini.open({
        url: pageParams.url
        , title: pageParams.title
        , width: pageParams.width
        , height: pageParams.height
        , onload: function () {
        }
        , ondestroy: function (action) {
        }
    });
};

function openWindow__MonitorSiteData(monitorSiteCode) {
    var data = { ticket: $.page.ticket, pageTabs: "info,his" };
    data.monitorSiteCode = monitorSiteCode;
    var pageParams = { url: "web/monitorSite/monitorSiteViewMain.htm", width: 800, height: 600, title: "设施信息" };
    $.page.openPage(data, pageParams, function () {
        onSearch();
    });
};
