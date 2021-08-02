
var datagrid1JQ = null;
var buttonAssignJQ = null;
var start=null;
var end = null;
//页面初始化
$.page.pageInit = function () {

    $.page.dataSourceSettingsDictionary = {

    };

    $.page.idM.mCallTimeFrom.setValue(fw.fwDateTime.FWDateTimeHelper.addDays(new Date(), -7));
    $.page.idM.mCallTimeTo.setValue(new Date());
};
var buttonSearchJQ = null;
/* 页面加载 
 

 */
$.page.pageLoad = function () {
    //roleViewInit();
    datagrid1JQ = $.page.idM.datagrid1;
    buttonSearchJQ = $("#btnSearch");
    buttonAssignJQ = $("#buttonAssign");
    //加载功能描述
    menuCodeUrl = $.page.params.menuCode;

    buttonSearchJQ.bind("click", function () {
        onSearch();
    }).click();

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
    datagrid1_Load(0, undefined, cSettings);
    //datagrid1_Load(0);
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
function datagrid1_Load(pageIndex, pageSize, cSettings) {
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
        , methodName: "queryPagePersonTaskAssessment"
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
    }, cSettings));
};
//单元格渲染事件
function dataGrid_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "operationMaintenancePersonName":
            html = "<a href=\"javascript:openInfo('" + $.pageCustomer.enumOperate.view + "','" + e.record.operationMaintenancePersonCode + "')\" style=\"color:blue;cursor:pointer;\">" + e.value + "</a>"
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

function openInfo(action, operationMaintenancePersonCode) {

    var data = { ticket: $.page.ticket, action: action };
    if ($.pageCustomer.hasValue(operationMaintenancePersonCode)) {
        data.operationMaintenancePersonCode = operationMaintenancePersonCode;
    };
    var conditionData = fw.fwObject.FWObjectHelper.emptyToNull($.page.idM.conditionForm.getData());
    data.start = conditionData.dStart;
    data.end = conditionData.dEnd;
    var pageParams = { url: "web/OPTask/operatorTaskList.htm", width: 800, height: 600, title: "任务信息" };
    $.pageCustomer.openPage(data, pageParams, function (e) {
        if (e != "cancel") {
            onSearch();
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