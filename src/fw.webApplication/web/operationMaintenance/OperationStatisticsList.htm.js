$.page.pageInit = function () {
    $.page.idM.treeselectCanton.loadList($.OperationMaintenancePage.cantonCodeList, "CantanCode", "ParentCantanCode");
};

$.page.pageLoad = function () {
    $.page.idM.datagrid1.setData($.OperationMaintenancePage.OperationMaintenceList);


};

function datagrid1_Renderer(e) {
    var html = "";
    switch (e.field) {

        case "Operate":
            html = "<a href=\"javascript:openDetailInfo()\" style=\"color:blue;\">详细</a>";
            break;
        default:
            break;
    };
    return html;
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

function openDetailInfo() {
    var entity = $.OperationMaintenancePage.getSelectedEntity();
    var data = { ticket: $.page.ticket };
    data.ID = entity.ID ;

    var pageParams = { url: "web/operationMaintenance/OperationStatistics.htm", width: 800, height: 600, title: "运维表单详细" };
    $.pageCustomer.miniOpen(data, pageParams);
};