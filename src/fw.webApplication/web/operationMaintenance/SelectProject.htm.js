var grid = null;
var codeList = [{ ProjectCode: "88cd39f6-c6ff-455e-ac1f-ecf3e0fd7de7", OperAndMaintenanceCod: "73494670-001"}];
$.page.pageLoad = function () {
    grid = $.page.idM.datagrid1;

    $.page.idM.datagrid1.setData($.OperationMaintenancePage.ProjectList);
    $.page.idM.datagrid1.on("drawcell", function (e) {
        var field = e.field;
        if ($.pageCustomer.hasValue(codeList)) {
            if (codeList.length > 0) {
                for (index in codeList) {
                    if (field == "checkcolumn" && codeList[index].ProjectCode == e.record.ProjectCode) {
                        e.cellHtml = "已选";
                        e.record.allowSelect = 0;
                    };
                };
            };
        };
    });
};
//ProjectCode
function GetData() {
    var row = grid.getSelecteds();
    return row;
};
function search() {
    var key = mini.get("key").getValue();
    grid.load({ key: key });
};
function onKeyEnter(e) {
    search();
};
function onRowDblClick(e) {
    onOk();
};
//////////////////////////////////
function CloseWindow(action) {
    if (window.CloseOwnerWindow) return window.CloseOwnerWindow(action);
    else window.close();
};

function onOk() {
    CloseWindow("ok");
};
function onCancel() {
    CloseWindow("cancel");
};