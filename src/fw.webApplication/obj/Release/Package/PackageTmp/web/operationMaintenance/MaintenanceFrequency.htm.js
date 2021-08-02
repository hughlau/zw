var buttonSearchJQ = null;
var bttonSettingJQ = null;

$.page.pageLoad = function () {
    buttonSearchJQ = $("#buttonSearch");
    bttonSettingJQ = $("#bttonSetting");

    buttonSearchJQ.bind("click", function () { onSearch(); }).click();

    bttonSettingJQ.bind("click", function () {
        openInfo();
    });

};

function onSearch() {
    datagrid1_Load(0);
};

function datagrid1_BeforeLoad(e) {
    //取消datagrid的miniui自动加载
    e.cancel = true;
    //miniui的页数与实际相差1页
    var pageIndex = e.data.pageIndex + 1
    var pageSize = e.data.pageSize;
    //datagrid加载数据
    datagrid1_Load(pageIndex, pageSize);
};

function datagrid1_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "OperAndMaintenanceContacterName":
            html = "<a href=\"javascript:openInfo('" + $.pageCustomer.enumOperate.view + "','" + e.record.ID + "')\" style=\"color:blue;\">" + e.value + "</a>"
            break;
        case "Gender":
            html = "<span>" + (e.value == 1 ? "男" : "女") + "</span>";
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
    //加载数据
    var queryParams = $.page.idM.conditionForm.getData();
    var searchList = [];
    if ($.pageCustomer.hasValue(queryParams.keyword)) {
        for (var i = 0; i < $.OperationMaintenancePage.MaintenanceFrequency.length; i++) {
            if ($.OperationMaintenancePage.MaintenanceFrequency[i].projectName.indexOf(queryParams.keyword) > -1 && $.OperationMaintenancePage.MaintenanceFrequency[i].OperAndMaintenanceCode.indexOf(OperAndMaintenanceCode) > -1) {
                searchList.push($.OperationMaintenancePage.MaintenanceFrequency[i]);
            };
        };
    } else {
        searchList = $.OperationMaintenancePage.MaintenanceFrequency;
    };
    $.page.idM.datagrid1.set({
        pageIndex: pageIndex
        , pageSize: $.page.idM.datagrid1.pageSize
        , totalCount: searchList.length
        , data: searchList
    });
};

function openInfo() {
    var entity = getSelectedEntity();

    var data = { ticket: $.page.ticket };
    data.ID = entity.ID;
    var pageParams = { url: "web/operationMaintenance/MaintenanceFrequencySetting.htm", width: 800, height: 600, title: "设置频率" };
    $.pageCustomer.miniOpen(data, pageParams, function (e) {
        buttonSearchJQ.click();
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
