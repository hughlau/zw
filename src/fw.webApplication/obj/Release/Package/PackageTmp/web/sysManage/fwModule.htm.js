$.page.pageLoad = function () {

};

function closeWindow(action) {
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

function insertOrUpdate() {
    $.page.idM.editform.validate();
    if ($.page.idM.editform.isValid() == false) return;

    var data = $.page.idM.editform.getData();
    data.moduleVersionId = fw.guid();
    data.isDel = 0;
    data.createrID = fw.guid();
    data.createTime = "2008-08-08";
    data.updaterID = fw.guid();
    data.updateTime = "2008-09-09";

    var fwdtbl = fw.jsonToFWDataTable(data)
    fwdtbl.tableName = "FWModule";
    $.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall",
        serviceName: "sysManage",
        methodName: "saveOrUpdate",
        data: {
            ticket: $.page.ticket,
            fwdtbl: fwdtbl
        },
        success: function(resultData) {
            closeWindow("save");
        },
        beforeSend: function() {
            fw.fwButton.fwButtonHelper.addWait($.page.idM.insertOrUpdate);
        },
        complete: function() {
            fw.fwButton.fwButtonHelper.removeWait($.page.idM.insertOrUpdate);
        }
    }));
};

function cancel_onclick() {
    closeWindow("cancel");
};
