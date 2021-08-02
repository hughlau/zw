var buttonSearchJQ = null;
var datagrid1JQ = null;
var buttonAddJQ = null;
var buttonFeedbackJQ = null;
var bttonBackJQ = null;
var buttonAssignJQ = null;

//页面初始化
$.page.pageInit = function () {
    $.page.dataSourceSettingsDictionary = {
        "cmbOpMa": {
            dataSourceName: "operationMaintenance.queryOperationMaintenanceUnit"
            , dataSourceParams: { ticket: $.page.ticket, mOperationMaintenanceUnitCode: "" }
        }
    };
};

/* 页面加载 */
$.page.pageLoad = function () {
    roleViewInit();
    datagrid1JQ = $.page.idM.datagrid1;
    //
    buttonSearchJQ = $("#btnSearch");
    buttonAddJQ = $("#buttonAdd");
    var buttonEditJQ = $("#buttonEdit");
    var buttonDeleteJQ = $("#buttonDelete");
    //加载功能描述
    menuCodeUrl = $.page.params.menuCode;
    //
    buttonAddJQ.bind("click", function () {
        openInfo($.pageCustomer.enumOperate.add);
    });
    //
    buttonEditJQ.bind("click", function () {
        var entity = $.OperationMaintenancePage.getSelectedEntity();
        if (!entity) {
            return;
        };
        openInfo($.pageCustomer.enumOperate.edit, entity.operationMaintenanceTaskPlanId);
    });
    //
    buttonDeleteJQ.bind("click", function () {
        deleteInfo();
    });
    //
    buttonSearchJQ.bind("click", function () {
        onSearch();
    }).click();
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

//查询
function onSearch(cSettings) {
    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();
    //datagrid加载数据
    datagrid1_Load(1, undefined, cSettings);
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

    var conditionData = fw.fwObject.FWObjectHelper.emptyToNull($.page.idM.conditionForm.getData());

    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "operationMaintenance"
        , methodName: "queryPageMaintenanceTaskPlan"
        , data: {
            ticket: $.page.ticket
            , pageParams: {
                pageSize: pageSize
                , pageIndex: pageIndex
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


function onCloseClick(e) {
    var obj = e.sender;
    obj.setText("");
    obj.setValue("");
};

function openInfo(action, operationMaintenanceTaskPlanId) {

    var data = { ticket: $.page.ticket, action: action };
    if ($.pageCustomer.hasValue(operationMaintenanceTaskPlanId)) {
        data.operationMaintenanceTaskPlanId = operationMaintenanceTaskPlanId;
    };
    var pageParams = { url: "web/operationMaintenance/operationMaintenanceTaskPlan.htm", width: 800, height: 600, title: "任务计划信息" };
    $.pageCustomer.openPage(data, pageParams, function (e) {
        if (e != "cancel") {
            onSearch();
        };
    });
};

//数据导出
function dataExport() {
    onSearch({ isExport: true, pageSize: fw.fwNumber.intMaxValue, pageIndex: 1 });
    $.page.exportFile({ idM: $.page.idM.datagrid1, reportName: '任务计划' });
};

function deleteInfo() {
    var entity = $.OperationMaintenancePage.getSelectedEntity();
    //
    mini.confirm("确定删除记录？", "确定？",
            function (action) {
                if (action == "ok") {
                    $.page.ajax($.page.getAjaxSettings({
                        serviceType: "crossDomainCall"
                        , serviceName: "operationMaintenance"
                        , methodName: "deleteTaskPlan"
                        , data: {
                            ticket: $.page.ticket
                           , pTaskPlanId: entity.operationMaintenanceTaskPlanId
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
