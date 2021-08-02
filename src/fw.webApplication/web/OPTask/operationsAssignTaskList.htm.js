
var datagrid1JQ = null;
var buttonAddJQ = null;
var buttonFeedbackJQ = null;
var bttonBackJQ = null;
var buttonAssignJQ = null;
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

    $.page.idM.mCallTimeFrom.setValue(fw.fwDateTime.FWDateTimeHelper.addDays(new Date(), -1));
    $.page.idM.mCallTimeTo.setValue(new Date());
};
var buttonSearchJQ = null;
/* 页面加载 */
$.page.pageLoad = function () {
    roleViewInit();
    datagrid1JQ = $.page.idM.datagrid1;
    buttonSearchJQ = $("#btnSearch");
    buttonAddJQ = $("#buttonAdd");
    var buttonEditJQ = $("#buttonEdit");
    var buttonDeleteJQ = $("#buttonDelete");
    buttonFeedbackJQ = $("#buttonFeedback");
    buttonAssignJQ = $("#buttonAssign");
    //加载功能描述
    menuCodeUrl = $.page.params.menuCode;

    buttonAddJQ.bind("click", function () {
        // var data = { ticket: $.page.ticket, action: $.pageCustomer.enumOperate.add };
        openInfo($.pageCustomer.enumOperate.add);
    });

    $("#btnExSearch").click(function () {
        $(".exSearch").toggle();
    });
    buttonEditJQ.bind("click", function () {
        var entity = getSelectedEntity();
        if (!entity) {
            return;
        };
        if (entity.status == 2) {
            mini.alert("任务已经接收,不可修改。");
            return;
        }
        if (entity.status == 4) {
            mini.alert("任务已经完成,不可修改。");
            return;
        }
        if (entity.isSolve == 1) {
            mini.alert("任务已经解决,不可修改。");
            return;
        }
        openInfo($.pageCustomer.enumOperate.edit, entity.operationMaintenanceTaskCode);
    });

    buttonDeleteJQ.bind("click", function () {
        var Entity = getSelectedEntity();
        if (!Entity) {
            return;
        };
        if (Entity.isSolve == 1) {
            mini.alert("任务已经解决,不可删除。");
        } else {
            deleteInfo();
        };
    });

    buttonSearchJQ.bind("click", function () {
        onSearch();
    }).click();

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

};
//用户角色页面视图处理
function roleViewInit() {
    if (!$.page.isNullOrEmpty($.page.userInfo)) {
        var roleList = $.page.userInfo.roleCodeList || [];
        if ($.page.isNullOrEmpty(roleList)) return;

        var isAdmin = $.Enumerable.From(roleList).Where("$=='sysAdminRole'").Count();
        var isManage = $.Enumerable.From(roleList).Where("$=='managerRole'").Count();
        if (isAdmin > 0) {
            //判断是否为系统管理员

        }
        else if (isManage > 0) {
            //判断是否为管理者  只查看
            $.page.idJQ.functionList.hide();
        };
    };
};
function openPage(id) {
    var data = {
        ticket: $.page.ticket
        , operationMaintenanceTaskCode: id
    };
    //获得传入的参数字符串
    var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/operationMaintenance/operationMaintenanceTask.htm", $.page.webSiteRootUrl), data);
    //打开窗口
    mini.open({
        url: url
            , title: "详情页面"
            , width: 860
            , height: 640
            , onload: function () {
            }
            , ondestroy: function (action) {
            }
    });
};




function onSearch(cSettings) {
    //datagrid1_Load(0, undefined, cSettings);
    //datagrid1_Load(0);
};

//数据导出
function dataExport() {
    onSearch({ isExport: true, pageSize: fw.fwNumber.intMaxValue, pageIndex: 1 });
    $.page.exportFile({ idM: $.page.idM.datagrid1, reportName: '运维任务' });
};
function datagrid1_BeforeLoad(e) {
    //取消datagrid的miniui自动加载
    e.cancel = true;
    //miniui的页数与实际相差1页
    var pageIndex = e.data.pageIndex + 1;
    var pageSize =  e.data.pageSize;
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

    var conditionData = fw.fwObject.FWObjectHelper.emptyToNull($.page.idM.conditionForm.getData());
    //conditionData.operationMaintenanceUnitCode=$.page.userInfo.operationMaintenanceUnitCode;
    //加载数据 
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "operationMaintenance"
        , methodName: "queryPageMaintenanceTask"
        , data: {
            ticket: $.page.ticket
            , pageParams: {
                pageSize: fw.fwObject.FWObjectHelper.hasValue(cSettings.pageSize) ? cSettings.pageSize : pageSize
                , pageIndex: fw.fwObject.FWObjectHelper.hasValue(cSettings.pageIndex) ? cSettings.pageIndex : pageIndex
                , sortFieldList: sortFieldList
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
    },cSettings));
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

function deleteInfo() {
    var entity = getSelectedEntity();
    entity.isDis = 1;
    mini.confirm("确定删除记录？", "确定？",
            function (action) {
                if (action == "ok") {
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
                                mini.alert("删除成功", "提示", function () {
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
    pageParams = { url: "web/monitorSite/monitorSiteViewMain.htm", width: 800, height: 600, title: "净化槽信息" };
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
 
function onButtonChoosePerson(e) {
    var textMonitor = this;
    var data = { ticket: $.page.ticket, selectType: fw.fwData.FWSelectType.Single, selectCallback: "onPersonSelectCallback", selectClearCallback: "onPersonSelectClearCallback" };
    var pageParams = { url: "web/operations/operationsPersonList.htm", width: 800, height: 600, title: "运维人员" };
    $.page.openPage(data, pageParams);
};

function onPersonSelectCallback(callbackData) {
    if ($.page.hasValue(callbackData)) {  
        $.page.idM.operationMaintenancePersonCode.setText(callbackData.operationMaintenancePersonName);
        $.page.idM.operationMaintenancePersonCode.setValue(callbackData.operationMaintenancePersonCode);  
    };
};

function onPersonSelectClearCallback() {

    $.page.idM.operationMaintenancePersonCode.setText('运维人员..');
    $.page.idM.operationMaintenancePersonCode.setValue('');  
};