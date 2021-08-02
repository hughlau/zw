
var datagrid1JQ = null;
var buttonSearchJQ = null;
var buttonGenerateTaskJQ = null;
var buttonIsSolveJQ = null;

$.page.pageInit = function () {
    checkIsProjectSelected();
    $.page.dataSourceSettingsDictionary = {
        "cantonCode": {
            dataSourceName: "sysBasicManage.getCantonDicData"
            , dataSourceParams: { pCode: window.top['cantonCodeCache'] }
        }
         , "cmbFaultType": {
             dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BLL_AlarmType" }
         }
        , "cmbIsSolve": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BIZIsSolve" }
        }
        , "cmbIsGenerateTask": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BIZIsGenerateTask" }
        }
    };

    $.page.idM.mCallTimeFrom.setValue(moment().subtract(7, 'days').format('YYYY-MM-DD'));
    $.page.idM.mCallTimeTo.setValue(moment().format('YYYY-MM-DD'));
};
/* 页面加载 */
$.page.pageLoad = function () {
    roleViewInit();
    $.page.idM.buttonGenerateTask.setEnabled(false);
    $.page.idM.buttonIsSolve.setEnabled(false);
    //获取用户信息
    var userInfo = $.page.userInfo;
    //判断运维单位 则跳转地址
    if (userInfo != null && userInfo.userTypeCode == 'omPerson') {
        for (var i = 0; i < userInfo.roleCodeList.length; i++) {
            if (userInfo.roleCodeList[i] == "omPersonRole") {
                $.page.idJQ.functionList.hide();
            };
        };
    };



    datagrid1JQ = $.page.idM.datagrid1;
    buttonSearchJQ = $("#btnSearch");
    buttonGenerateTaskJQ = $("#buttonGenerateTask");
    buttonIsSolveJQ = $("#buttonIsSolve");

    buttonSearchJQ.bind("click", function () {
        onSearch();
    }).click();

    buttonGenerateTaskJQ.bind("click", function () {
        openTaskInfo("editView");
    });

    buttonIsSolveJQ.bind("click", function () {
        feedbackInfo($.pageCustomer.enumOperate.edit);
    });
};

/**
 * */
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
function onSearch(cSettings) {
    datagrid1_Load(0, undefined, cSettings);
};
//数据导出
function dataExport() {
    onSearch({ isExport: true, pageSize: fw.fwNumber.intMaxValue, pageIndex: 1 });
    $.page.exportFile({ idM: $.page.idM.datagrid1, reportName: '报警信息列表' });
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

    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "operationMaintenance"
        , methodName: "queryPageMonitorSiteAlarm"
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
        case "monitorSiteAlarmName":
            html = "<a href=\"javascript:feedbackInfo('" + $.pageCustomer.enumOperate.view + "','" + e.record.operationMaintenanceTaskCode + "')\" style=\"color:blue;\">" + e.value + "</a>"
            break;
        case "monitorSiteName":
            html = "<a href=\"javascript:openMonitorSiteInfo('" + $.pageCustomer.enumOperate.view + "','" + e.record.monitorSiteCode + "')\" style=\"color:blue;\">" + e.value + "</a>"
            break;
        case "alarmTime":
            html = e.value;
            break;
        case "isSolve":
            if (e.value == 1) {
                html = " <a style=\"color:blue;\" onclick=\"feedbackInfo('" + $.pageCustomer.enumOperate.view + "')\">已解决</a>";
            } else {
                html = " <a style=\"color:red;\">未解决</a>";
            };
            break;
        case "isGenerateTask":
            if (e.value == 1) {
                html = " <a style=\"color:blue;\" onclick=\"openTaskInfo('editView_v')\">已生成</a>";
            } else {
                html = " <a style=\"color:red;\">未生成</a>";
            };
            break;
    };
    return html;
};
 

//行选择改变时
function datagrid1_SelectionChanged(e) {
    var childControls = mini.getChildControls($.page.idJQ.functionList[0]);
    for (var i = 0; i < childControls.length; i++) {
        var isEnabled = true;
        if (fw.fwObject.FWObjectHelper.hasValue(childControls[i].minSelectedCount)) {
            if (isEnabled && childControls[i].minSelectedCount <= e.selecteds.length) {
                isEnabled = true;
            } else {
                isEnabled = false;
            };
        };
        if (fw.fwObject.FWObjectHelper.hasValue(childControls[i].maxSelectedCount)) {
            if (isEnabled && e.selecteds.length <= childControls[i].minSelectedCount) {
                isEnabled = true;
            } else {
                isEnabled = false;
            };
        };
        childControls[i].set({ enabled: isEnabled });
    };
    if (e.selected) {
        $.page.idM.datagrid1.lastSelectedRowIndex = $.page.idM.datagrid1.indexOf(e.selected);
    };
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

function feedbackInfo(action) {
    var entity = $.OperationMaintenancePage.getSelectedEntity();
    if (!entity) {
        return;
    };
    if (action != $.pageCustomer.enumOperate.view) {
        if (entity.isSolve == 1) {
            mini.alert("该报警信息已经解决。");
            return;
        };
        if (entity.isGenerateTask == 1) {
            mini.alert("该报警信息已经生成任务。");
            return;
        };
    };
    var data = { ticket: $.page.ticket, monitorSiteAlarmCode: entity.monitorSiteAlarmCode, action: action };
    var pageParams = { url: "web/monitorAlarm/monitorSiteAlarm.htm", width: 800, height: 448, title: "报警信息" };
    $.page.openPage(data, pageParams, function (e) {
        if (e != "cancel") {
            buttonSearchJQ.click();
        };
    });
}; 
function deleteInfo() {
    var entity = $.OperationMaintenancePage.getSelectedEntity();
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

function openTaskInfo(action) {
    var entity = $.OperationMaintenancePage.getSelectedEntity();
//    entity.ltuMac = "sss";
//    entity.wKqbCurValue = "12";
//    entity.createDateTime = "2017-04-13";
    if (!entity) {
        return;
    };
    var data = { ticket: $.page.ticket, action: action };
    data.monitorSiteAlarmCode = entity.monitorSiteAlarmCode;
    if (action == "editView") {
        if (entity.isSolve == 1) {
            mini.alert("该报警信息已经解决。");
            return;
        };
        if (entity.isGenerateTask == 1) {
            mini.alert("报警记录已经生成任务,不可重复生成。");
            return;
        };
      
//        $.page.ajax($.page.getAjaxSettings({
//            serviceType: "crossDomainCall"
//                        , serviceName: "operationMaintenance"
//                        , methodName: "receiveLtuData"
//                        , data: {
//                            ticket: $.page.ticket
//                           , mEntity: entity
//                        }
//                        , success: function (resultData) {
//                            //判断加载数据成功
//                            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
//                                mini.alert("生成任务成功", "提示", function () {
//                                    onSearch();
//                                });
//                            } else {
//                                if (resultData.infoList != null && resultData.infoList.length > 0) {
//                                    mini.alert(resultData.infoList[0]);
//                                };
//                            };
//                        }
//        }));
    }
    var pageParams = { url: "web/operationMaintenance/operationMaintenanceTask.htm?monitorSiteAlarmCode=" + entity.monitorSiteAlarmCode, width: 800, height: 600, title: "任务信息" };
    $.page.openPage(data, pageParams, function (e) {
        if (e != "cancel") {
            buttonSearchJQ.click();
        };
    });
};

function openMonitorSiteInfo(action, monitorSiteCode) {
    var data = { ticket: $.page.ticket, action: action, pageTabs: "ws,info" };
    data.monitorSiteCode = monitorSiteCode;
    var pageParams = {};
    pageParams = { url: "web/monitorSite/monitorSiteViewMain.htm", width: 800, height: 600, title: "净化槽信息" };
    $.page.openPage(data, pageParams);
};


//获取选中项对象
function getSelectedEntity() {
    //获取选中项对象
    var entity = $.page.idM.datagrid1.getSelected();
    //判断对象没有值
    if (!fw.fwObject.FWObjectHelper.hasValue(entity)) {
        mini.alert("请选择一项！");
        entity = undefined;
    };
    return entity;
};