$.page.pageInit = function () {
    $.page.dataSourceSettingsDictionary = {
        "objType": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "objType" }
        },
        "Text1": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "codeType" }
        }
    };
};

$.page.pageLoad = function () {

    $.page.idM.objType.doValueChanged();


};

function objType_onvaluechanged() {
    var v = $.page.idM.objType.getValue();
    if (v == "T") {
        $.page.idM.schemaL.show();
        $.page.idM.schema.show();
    } else {
        $.page.idM.schemaL.hide();
        $.page.idM.schema.hide();
    };
};

function closeWindow(action) {
    if (action == "close" && $.page.editformM.isChanged()) {
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
    $.page.editformM.validate();
    if ($.page.editformM.isValid() == false) return;

    var data = $.page.editformM.getData();
    data.objectID = fw.guid();
    data.isDelete = 0;
    data.createrID = fw.guid();
    data.createTime = "2008-08-08";
    data.updaterID = fw.guid();
    data.updateTime = "2008-09-09";

    var datas = [];
    for (var i = 0; i < 2; i++) {
        data.objectID = fw.guid();
        datas.push(mini.decode(mini.encode(data)));
    };
    data = datas;

    var fwdtbl = fw.jsonToFWDataTable(data);
    fwdtbl.tableName = "ObjectInfo";
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "insertOrUpdate"
        , data: {
            ticket: $.page.ticket
            , fwdtbl: fwdtbl
        }
        , success: function (resultData) {
            closeWindow("save");
        },
        beforeSend: function () {
            fw.fwButton.fwButtonHelper.addWait($.page.idM.insertOrUpdate);
        },
        complete: function () {
            fw.fwButton.fwButtonHelper.removeWait($.page.idM.insertOrUpdate);
        }
    }));
};

function cancel_onclick() {
    closeWindow("cancel");
};
