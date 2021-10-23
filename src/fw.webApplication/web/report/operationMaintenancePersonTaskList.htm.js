var datagrid1JQ = null;
var buttonBackJQ = null;
var buttonReceiveJQ = null;
var buttonFeedbackJQ = null;
var operationMaintenancePersonCode = null;
var isSolve = null;
var isView = null;
var statusCode = null;

//页面初始化
$.page.pageInit = function () {
   
   

    $.page.dataSourceSettingsDictionary = {
        "cmbFaultType": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BIZFaultType" }
        }
        , "cmbTaskStatus": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BIZTaskStatus" }
        }
        , "cmbIsAlarm": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BIZYesOrNo" }
        }, "cmbisSolve": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BIZYesOrNo" }
        }
        , "cantonCode": {
            dataSourceName: "sysBasicManage.getCantonDicData"
            , dataSourceParams: {  }
        }
        , "taskType": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BIZTaskType" }
        }
    };

    isSolve = $.page.params.isSolve;
    isView = $.page.params.isView;
    statusCode = $.page.params.statusCode;

    $.page.idM.cmbisSolve.setValue(isSolve);
    $.page.idM.cmbTaskStatus.setValue(statusCode);
   

//    $.page.idM.mCallTimeFrom.setValue(fw.fwDateTime.FWDateTimeHelper.addDays(new Date(), -7));
//    $.page.idM.mCallTimeTo.setValue(new Date());
};
var buttonSearchJQ = null;
/* 页面加载 */
$.page.pageLoad = function () {
    $("#btnExSearch").click(function () {
        $(".exSearch").toggle();
    });
    operationMaintenancePersonCode = $.page.params.operationMaintenancePersonCode;
    if ($.page.hasValue($.page.params.startTime)) {
        $.page.idM.mCallTimeFrom.setValue($.page.DTToString($.page.params.startTime, "yyyy-MM-dd"));
    }
    if ($.page.hasValue($.page.params.endTime)) {
        $.page.idM.mCallTimeTo.setValue($.page.DTToString($.page.params.endTime, "yyyy-MM-dd"));
    } 

    datagrid1JQ = $.page.idM.datagrid1;
    buttonSearchJQ = $("#btnSearch");
    buttonBackJQ = $("#buttonBack");
    buttonReceiveJQ = $("#buttonReceive");
    buttonFeedbackJQ = $("#buttonFeedback");

    buttonBackJQ.bind("click", function () {
        backInfo();
    });

    buttonReceiveJQ.bind("click", function () {
        receiveInfo();
    });
    buttonFeedbackJQ.bind("click", function () {
        var Entity = getSelectedEntity();
        if (!Entity) {
            return;
        };
        if (Entity.isSolve == 1) {
            mini.alert("任务已经解决,不可反馈。");
        } else {
            feedbackInfo(Entity.operationMaintenanceTaskCode);
        };
    });
    buttonSearchJQ.bind("click", function () {
        onSearch();
    }).click();

};
function onSearch(cSettings) {
    //datagrid1_Load(0);

    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();
    //datagrid加载数据
    datagrid1_Load(1, undefined, cSettings);
};

//数据导出
function dataExport() {
    onSearch({ isExport: true, pageSize: fw.fwNumber.intMaxValue, pageIndex: 1 });
    $.page.exportFile({ idM: $.page.idM.datagrid1, reportName: '运维人员任务' });
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

//datagrID数据加载
function datagrid1_Load(pageIndex, pageSize,cSettings) {
    //如果没传入页数
    if (!fw.fwObject.FWObjectHelper.hasValue(pageIndex)) {
        //将页数设置为datagrID的页数
        pageIndex = datagrid1JQ.pageIndex;
    };
    //如果没传入分页大小
    if (!fw.fwObject.FWObjectHelper.hasValue(pageSize)) {
        //将分页大小设置为datagrID的分页大小
        pageSize = datagrid1JQ.pageSize;
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
    //排序字段
    var sortFieldList = null;
    //如果datagrid设置有排序字段
    if (fw.fwObject.FWObjectHelper.hasValue(datagrid1JQ.sortField)) {
        //将排序字段设置为datagrid的排序字段
        sortFieldList = [{
            fieldName: datagrid1JQ.getSortField()
            , sortType: fw.fwData.FWSortType[datagrid1JQ.getSortOrder()]
        }];
    };
    //开启datagrID数据加载锁屏
    $.page.idM.datagrid1.loading();

    var conditionData = $.page.idM.conditionForm.getData();
    if ($.pageCustomer.hasValue(operationMaintenancePersonCode)) {
        conditionData.operationMaintenancePersonCode = operationMaintenancePersonCode;
    };
    //conditionData.operationMaintenancePersonCode = $.page.userInfo.userID;

    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "operationMaintenance"
        , methodName: "queryPagePersonMaintenanceTask"
        , data: {
            ticket: $.page.ticket
            , pageParams: {
                pageSize: fw.fwObject.FWObjectHelper.hasValue(cSettings.pageSize) ? cSettings.pageSize : pageSize
                , pageIndex: fw.fwObject.FWObjectHelper.hasValue(cSettings.pageIndex) ? cSettings.pageIndex : pageIndex
                //, sortFieldList: sortFieldList
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
            }
            else //Roger 2016/6/1 13:00:02 增加管辖区域
            {
                var erroInfo = resultData.infoList.join("<br>");
                $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
            };
        }
    }, cSettings));
};
//单元格渲染事件
function dataGrid_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "operationMaintenanceTaskName":
            html = "<a href=\"javascript:openInfo('" + $.pageCustomer.enumOperate.view + "','" + e.record.operationMaintenanceTaskCode + "')\" style=\"color:blue;cursor:pointer;\">" + e.value + "</a>"
            break;
        case "monitorSiteName":
            html = "<a href=\"javascript:openMonitorSiteInfo('" + $.pageCustomer.enumOperate.view + "','" + e.record.monitorSiteCode + "')\" style=\"color:blue;cursor:pointer;\">" + e.value + "</a>"
            break;
        case "faultTime":
            html = e.value;
            break;
        case "prescribeRepairTime":
            html = e.value;
            break;
        case "isSolve":
            if (e.value == 1) {
                html = " <a style=\"color:blue;cursor:pointer;\" onclick=\"feedbackInfo('" + e.record.operationMaintenanceTaskCode + "','" + $.pageCustomer.enumOperate.view + "')\">已解决</a>";
            } else {
                html = " <a style=\"color:red;\">未解决</a>";
            };
            break;
        case "monitorSiteAlarmCode":
            if ($.pageCustomer.hasValue(e.value)) {
                html = " <a style=\"color:blue;cursor:pointer;\" onclick=\"openAlarmInfo()\">是</a>";
            } else {
                html = "否";
            };
            break;
        case "detail":
            if ($.pageCustomer.hasValue(e.record.operationMaintenanceFormData)) {
                if ($.pageCustomer.hasValue(e.record.operationMaintenanceFormFileName)) {
                    html = " <a style=\"color:blue;cursor:pointer;\" onclick=\"openMaintenanceTemplate()\">详细</a>";
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
function onCloseClick(e) {
    var obj = e.sender;
    obj.setText("");
    obj.setValue("");
};

 

function backInfo() {
    var entity = $.OperationMaintenancePage.getSelectedEntity();
    if (!entity) {
        return;
    };
    if (entity.isSolve == 1) {
        mini.alert("任务已经解决,不可以退回。");
        return;
    };
    if (entity.status == 1) {
        mini.alert("任务未接收,不可以退回。");
        return;
    };
    if (entity.status == 3) {
        mini.alert("任务已退回,不可以再次退回。");
        return;
    };
    entity.status = 3;
    mini.confirm("确定退回【" + entity.operationMaintenanceTaskName + "】？", "确定？",
            function (action) {
                if (action == "ok") {
                    execOrder(entity, "退回成功。");
                };
            });
};

function receiveInfo() {
    var entity = $.OperationMaintenancePage.getSelectedEntity();
    if (!entity) {
        return;
    };
    if (entity.status == 2) {
        mini.alert("【" + entity.operationMaintenanceTaskName + "】已接收,不能再进行接收。");
        return;
    };
    if (entity.status == 4) {
        mini.alert("【" + entity.operationMaintenanceTaskName + "】已接收,不能再进行接收。");
        return;
    };
    entity.status = 2;
    mini.confirm("确定接收【" + entity.operationMaintenanceTaskName + "】？", "确定？",
            function (action) {
                if (action == "ok") {
                    execOrder(entity, "接收成功。");
                };
            });
};

function execOrder(entity, tipHtml) {
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
                        , serviceName: "operationMaintenance"
                        , methodName: "updateMaintenanceTask"
                        , data: {
                            ticket: $.page.ticket
                           , mEntity: entity
                        }
                        , success: function (resultData) {
                            //判断加载数据成功
                            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                                mini.alert(tipHtml, "提示", function () {
                                    onSearch();
                                });
                            } else {
                                if (resultData.infoList != null && resultData.infoList.length > 0) {
                                    mini.alert(resultData.infoList[0]);
                                };
                            };
                        }
    }));
};

 

function openInfo(action, operationMaintenanceTaskCode) {

    var data = { ticket: $.page.ticket, action: action };
    if ($.pageCustomer.hasValue(operationMaintenanceTaskCode)) {
        data.operationMaintenanceTaskCode = operationMaintenanceTaskCode;
    };
    var pageParams = { url: "web/OPTask/operationsTask.htm", width: 800, height: 600, title: "任务信息" };
    $.pageCustomer.openPage(data, pageParams, function (e) {
        if (e != "cancel") {
            onSearch();
        };
    });
};
function feedbackInfo(operationMaintenanceTaskCode, action) {
    var data = { ticket: $.page.ticket, operationMaintenanceTaskCode: operationMaintenanceTaskCode, action: action };
    var pageParams = { url: "web/OPTask/operationsTaskFinish.htm", width: 800, height: 600, title: "任务反馈情况" };
    $.pageCustomer.openPage(data, pageParams, function (e) {
        if (e != "cancel") {
            onSearch();
        };
    });
};


function openDetail() {
    var entity = getSelectedEntity();
    var data = { ticket: $.page.ticket };

    var pageParams = { url: "web/operationMaintenance/OperationTaskUser.htm", width: 800, height: 600, title: "任务分配情况" };
    $.pageCustomer.openPage(data, pageParams);
};

function openAlarmInfo() {
    var entity = getSelectedEntity();
    if (!entity) {
        return;
    };
    var data = { ticket: $.page.ticket, action: $.pageCustomer.enumOperate.view };
    data.monitorSiteAlarmCode = entity.monitorSiteAlarmCode;
    var pageParams = { url: "web/monitorAlarm/monitorSiteAlarm.htm", width: 800, height: 600, title: "报警信息" };
    $.pageCustomer.openPage(data, pageParams, function (e) {

    });
};

function openMonitorSiteInfo(action, monitorSiteCode) {
    var data = { ticket: $.page.ticket, action: action, pageTabs: "info,ws" };
    data.monitorSiteCode = monitorSiteCode;
    var pageParams = {};
    pageParams = { url: "web/monitorSite/monitorSiteViewMain.htm", width: 800, height: 600, title: "现场设备信息" };
    $.pageCustomer.openPage(data, pageParams, function (e) {
    });
};

//详情
function openMaintenanceTemplate() {
    var data = { ticket: $.page.ticket };
    var entity = getSelectedEntity();
    data.operationMaintenanceTaskCode = entity.operationMaintenanceTaskCode;
    data.action = $.pageCustomer.enumOperate.view;
    //
    var pageUrl = entity.operationMaintenanceFormFileName;
    var pageParams = { url: "mobile/operationMaintenance/operationMaintenanceView/" + pageUrl, width: 800, height: 600, title: "监测点位" };
    $.pageCustomer.openPage(data, pageParams);
};

function getSelectedEntity() {
    //获取选中项对象
    var entity = $.page.idM.datagrid1.getSelected();
    //判断对象没有值
    if (!fw.fwObject.FWObjectHelper.hasValue(entity)) {
        mini.alert("请选择一项！");
        entity = undefined;
        return;
    };
    return entity;
}
function getSelectedEntityList() {
    //获取选中项对象
    var entity = $.page.idM.datagrid1.getSelecteds();
    //判断对象没有值
    if (!fw.fwObject.FWObjectHelper.hasValue(entity)) {
        mini.alert("请选择一项！");
        entity = undefined;
        return;
    };
    return entity;
}