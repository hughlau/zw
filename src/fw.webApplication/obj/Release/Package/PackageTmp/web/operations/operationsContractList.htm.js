var buttonSearchJQ = null;
var buttonAddJQ = null;
var buttonEditJQ = null;
var buttonDeleteJQ = null;
var buttonMonitorSiteJQ = null;
var btnChooseMonitorSiteJQ = null;
var action = null;
//页面初始化
$.page.pageInit = function () {
    checkIsProjectSelected();
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
        "cantonCode": {
            dataSourceName: "sysBasicManage.getCantonDicData"
            , dataSourceParams: { pCode: window.top['cantonCodeCache'] }
        }
    };
};

$.page.pageLoad = function () {
    roleViewInit();
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.action)) {
        action = $.page.params.action;
    } else {
        action = $.page.enumOperate.edit;
    };
    buttonAddJQ = $("#buttonAdd");
    buttonEditJQ = $("#buttonEdit");
    buttonDeleteJQ = $("#buttonDelete");
    buttonSearchJQ = $("#buttonSearch");
    buttonMonitorSiteJQ = $("#buttonMonitorSite");
    btnChooseMonitorSiteJQ = $("#btnChooseMonitorSite");
    var userInfo = $.page.userInfo;
    if (userInfo != null &&$.page.userInfo.userTypeCode == "omUnit") {
        $.page.idJQ.functionList.hide();
    };
    buttonAddJQ.bind("click", function () {
        openInfo($.pageCustomer.enumOperate.add);
    });

    buttonEditJQ.bind("click", function () {
        var entity = getSelectedEntity();
        if (!entity) {
            return;
        };
        openInfo($.pageCustomer.enumOperate.edit, entity.operationMaintenanceContractCode);
    });

    buttonDeleteJQ.bind("click", function () {
        deleteInfo();
    });

    buttonSearchJQ.bind("click", function () { onSearch(); }).click();

    buttonMonitorSiteJQ.bind("click", function () {
        openMonitorSiteInfo();
    });
    $("#buttonAddDate").bind("click", function () {
        if ($.page.userInfo.userTypeCode == "omUnit") {
            mini.alert("没有权限操作此功能！");
            return;
        }
        var entity = getSelectedEntity();
        if (!entity) {
            return;
        };
        openInfo("addDate", entity.operationMaintenanceContractCode);
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
function onSearch() {
    datagrid1_Load(0);
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

function datagrid1_Renderer(e) {
    var html = "";
    switch (e.field) { 
        case "effectiveTime":
        case "failTime":
            html = (fw.fwObject.FWObjectHelper.hasValue(e.value)) ? fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(e.value), $.pageCustomer.dateDay) : "--";
            break;
        case "MonitorSiteDetail":
            html = "<a href=\"javascript:openMonitorSiteInfo()\" style=\"color:blue;\">设施详细</a>";
            break;
        case "op":
            html = "<a href=\"javascript:contractSiteInfo('" + e.record.operationMaintenanceContractCode + "')\" style=\"color:blue;\"><img src=\"../style/images/monitor32.png\" style=\"width:24px;height:24px;box-sizing: content-box;\" /></a></a>"
            break;
        case "contractNo":
            html = "<a href=\"javascript:openInfo('" + $.pageCustomer.enumOperate.view + "','" + e.record.operationMaintenanceContractCode + "')\" style=\"color:blue;\">" + e.value + "</a>"
            break;
        default:
            break;
    };
    return html;
};  


function datagrid1_Load(pageIndex, pageSize) {
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

    //开启datagrid数据加载锁屏
    $.page.idM.datagrid1.loading();
    var conditionData = $.page.idM.conditionForm.getData();

    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "operationMaintenance"
        , methodName: "queryPageOperationMaintenanceContract"
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
    }));
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
                        , methodName: "deleteMContractByCodeList"
                        , data: { 
                            ticket: $.page.ticket
                            , contractCodeList: [entity.operationMaintenanceContractCode]
                        }
                        , success: function (resultData) {
                            //判断加载数据成功
                            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                                onSearch();
                                $.page.showTips({ content: "删除成功！" , state: "success" });
                            }
                            else //Roger 2016/6/1 13:00:02 增加管辖区域
                            {
                                var erroInfo = resultData.infoList.join("<br>");
                                $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
                            };
                        }
                    }));
                };
            });
};

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

function openInfo(action, operationMaintenanceContractCode) {

    var data = { ticket: $.page.ticket, action: action };
    if (action != $.pageCustomer.enumOperate.add) {
        data.operationMaintenanceContractCode = operationMaintenanceContractCode;
    };

    var pageParams = { url: "web/operations/operationsContract.htm", width: 800, height: 400, title: "运维项目" };
    $.pageCustomer.openPage(data, pageParams, function (e) {
        onSearch();
        $.page.showTips({ content: "操作成功！" , state: "success" });
    });
};
function contractSiteInfo(  operationMaintenanceContractCode) {

    var data = { ticket: $.page.ticket, action: action, operationMaintenanceContractCode: operationMaintenanceContractCode };
    var pageParams = { url: "web/operations/contractMonitorAllocator.htm", width: 960, height: 600, title: "项目设施" };
    $.page.openPage(data, pageParams, function (e) {
         
    });
};
function openMonitorSiteInfo() {
    var entity = getSelectedEntity();
    var data = { ticket: $.page.ticket };
    data.operationMaintenanceContractCode = entity.operationMaintenanceContractCode;
    data.ProjectName = entity.ProjectName;

    var pageParams = { url: "web/operationMaintenance/ProjectMonitorSite.htm", width: 800, height: 600, title: "设施详细" };
    $.pageCustomer.openPage(data, pageParams);
};

//结束时间设置
function onDrawDateBegin(e) {
    var date = e.date;
    var d = new Date();

    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.mCallTimeTo.value)) {
        if (date.getTime() > $.page.idM.mCallTimeTo.value) {
            e.allowSelect = false;
        };
    };
};

//开始时间设置
function onDrawDateEnd(e) {
    var date = e.date;
    var d = new Date();

    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.mCallTimeFrom.value)) {
        if (date.getTime() < $.page.idM.mCallTimeFrom.value) {
            e.allowSelect = false;
        };
    };
};
