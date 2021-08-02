var dataSourceList = [];
var infectTitleJq = null;
var infectTitleContentJq = null;
var btnColorMenuJQ = null;
var btnSearchJQ = null;
var datagrid1JQ = null;
var tempMonitorSiteLatestData = null;
var statusColorMapping = [];
var statusCode = null;
var conditionData = {};
$.page.pageInit = function () {
    checkIsProjectSelected();
    $.page.dataSourceSettingsDictionary = {
        "cantonCode": {
            dataSourceName: "sysBasicManage.getCantonDicData"
            , dataSourceParams: { ticket: $.page.ticket, pCode: "BLLCanton" }
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
    $.page.idM.datagrid1.hideColumn("hid1");
    $.page.idM.datagrid1.hideColumn("hid2");
};
function onSearch(cSettings) {
    conditionData = $.page.idM.conditionForm.getData();
    if ($.pageCustomer.hasValue(statusCode)) {
        conditionData.statusCode = statusCode;
    };
    datagrid1_Load(0, undefined, undefined, cSettings);
};


//数据导出
function dataExport() {
    onSearch({ isExport: true, pageSize: fw.fwNumber.intMaxValue, pageIndex: 1 });
    //$.page.idM.datagrid1.dataSourceSettings.methodName = "exportAutoMonitorStatics";
    $.page.exportFile({ idM: $.page.idM.datagrid1, reportName: '提升泵状态列表' });
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
//    //排序字段
//    var sortFieldList = null;
//    //如果datagrid设置有排序字段
//    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.datagrid1.sortField)) {
//        //将排序字段设置为datagrid的排序字段
//        sortFieldList = [{
//            fieldName: $.page.idM.datagrid1.getSortField()
//            , sortType: fw.fwData.FWSortType[$.page.idM.datagrid1.getSortOrder()]
//        }];
//    };
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
    fw.fwObject.FWObjectHelper.emptyToNull($.page.idM.conditionForm.getData());
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "autoMonitor"
        , methodName: "queryMonitorWaterPumpStatus"
        , data: {


            ticket: $.page.ticket
           , pageParams: {
               pageSize: fw.fwObject.FWObjectHelper.hasValue(cSettings.pageSize) ? cSettings.pageSize : pageSize
                , pageIndex: fw.fwObject.FWObjectHelper.hasValue(cSettings.pageIndex) ? cSettings.pageIndex : pageIndex,
               sortFieldList: sortFieldList
           }
           , queryParams: conditionData
        }
     , success: function (resultData) {
         //判断加载数据成功
         if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
             //设置datagrid数据
             $.page.idM.datagrid1.set({
                 pageIndex: resultData.data.pageIndex - 1
                    , pageSize: resultData.data.pageSize
                    , totalCount: resultData.data.recordCount
                    , data: resultData.data.entityList
             });
         } else {
             var erroInfo = resultData.infoList.join("<br>");
             $.page.showTips({ content: "查询失败!<br>", state: "danger" });
         };

     }
   }, cSettings));
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
        case "waterPumpState":
            {


                if (e.value == "正常") {
                    html = '<span style="color: #009933;" >' + e.value + '</span>';
                }
                else if (e.value == "通讯故障") {
                    html = '<span style="color: #3399ff;">' + e.value + '</span>';
                }
                else {
                    html = '<span style="color:red;" >' + e.value + '</span>';
                }

            }
            break;
        case "windPumpState":
            {
                if (e.value == "正常") {
                    html = '<span style="color: #009933;" >' + e.value + '</span>';
                }
                else if (e.value == "通讯故障") {
                    html = '<span style="color: #3399ff;">' + e.value + '</span>';
                }
                else {
                    html = '<span style="color:red;" >' + e.value + '</span>';
                }

            }
            break;  
        case "drugState":
            {
                if (e.value == "正常") {
                    html = '<span style="color: #009933;" >' + e.value + '</span>';
                }
                else if (e.value == "通讯故障") {
                    html = '<span style="color: #3399ff;">' + e.value + '</span>';
                }
                else {
                    html = '<span style="color:red;" >' + e.value + '</span>';
                }

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


function openWindow__MonitorSiteData(monitorSiteCode) {
    var data = { ticket: $.page.ticket, pageTabs: "info,waterhis" };
    data.monitorSiteCode = monitorSiteCode;
    var pageParams = { url: "web/monitorSite/monitorSiteViewMain.htm", width: 960, height: 600, title: "设施信息" };
    $.page.openPage(data, pageParams, function () {
        onSearch();
    });
};


