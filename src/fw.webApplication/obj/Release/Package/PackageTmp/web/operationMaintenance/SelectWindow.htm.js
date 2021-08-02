var grid = null;
$.page.pageLoad = function () {
    grid = $.page.idM.datagrid1;
    $.page.idM.datagrid1.setData($.OperationMaintenancePage.SelectGridSource);

};

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