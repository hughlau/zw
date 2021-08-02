var ID = null;
var dataSourceList = [];

var buttonSaveJQ = null;
var buttonCancelJQ = null;

$.page.pageInit = function () {

    $.page.idM.cblFrequency.setData($.OperationMaintenancePage.FrequencyList);

};

$.page.pageLoad = function () {

    buttonSaveJQ = $("#buttonSave");
    buttonCancelJQ = $("#buttonConcel");

    dataSourceList = $.OperationMaintenancePage.MaintenanceFrequency;
    ID = $.page.params.ID;

    buttonSaveJQ.bind("click", function () {
        mini.alert("保存成功。", "提示", function () {
            CloseWindow("ok");
        });
    });

    buttonCancelJQ.bind("click", function () {
        CloseWindow("cancel");
    });

    function CloseWindow(action) {
        //判断数据被修改
        if (action == "close" && $.page.idM.editform.isChanged()) {
            if (confirm("数据被修改了，是否先保存？")) {
                return false;
            };
        };
        if (window.CloseOwnerWindow) {
            return window.CloseOwnerWindow(action);
        } else {
            window.close();
        };
    };
};