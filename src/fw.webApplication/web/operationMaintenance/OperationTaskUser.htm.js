var grid = null;
$.page.pageLoad = function () {
    grid = $.page.idM.datagrid1;
    var id = fw.fwNumber.FWNumberHelper.randomNumber(1, 6);
    $.page.idM.datagrid1.setData($.OperationMaintenancePage.taskUserList);
};

function search() {
    grid.load();
};