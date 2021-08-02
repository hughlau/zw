
var action = null;
var monitorSiteAlarmCode = null;

var buttonSaveJQ = null;
var buttonCancelJQ = null;
var divFormJQ = null;

$.page.pageLoad = function () {
    action = $.page.params.action;
    monitorSiteAlarmCode = $.page.params.monitorSiteAlarmCode;

    divFormJQ = $.page.idM.divForm;
    buttonSaveJQ = $("#buttonSave");
    buttonCancelJQ = $("#buttonConcel");
//    if ($.pageCustomer.hasValue(monitorSiteAlarmCode)) {
//        action = $.pageCustomer.enumOperate.add;
//    };
    if (action == $.pageCustomer.enumOperate.view) {
        buttonSaveJQ.hide();
        labelModel();
    } else {
        inputModel();
    };

    buttonCancelJQ.bind("click", function () {
        CloseWindow("cancel");
    });

    buttonSaveJQ.bind("click", function () {
        SaveOperationAlarm();
    });
    queryAlarm();
};

function labelModel() {
    var fields = divFormJQ.getFields();
    for (var i = 0, l = fields.length; i < l; i++) {
        var c = fields[i];
        if (c.setReadOnly) c.setReadOnly(true);     //只读
        if (c.setIsValid) c.setIsValid(true);      //去除错误提示
        if (c.addCls) c.addCls("asLabel");          //增加asLabel外观
    };
};
function inputModel() {
    var fields = divFormJQ.getFields();
    for (var i = 0, l = fields.length; i < l; i++) {
        var c = fields[i];
        if (c.setReadOnly) c.setReadOnly(false);
        if (c.removeCls) c.removeCls("asLabel");
    };
    mini.repaint(document.body);
};

function queryAlarm() {
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "operationMaintenance"
        , methodName: "queryMonitorSiteAlarm"
        , data: {
            ticket: $.page.ticket
           , queryParams: { monitorSiteAlarmCode: monitorSiteAlarmCode }
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                var entity = resultData.data[0];
                $.pageCustomer.SetJsonData("ViewClass", entity, $("#divForm"));
                divFormJQ.setData(entity);
                if ($.pageCustomer.hasValue(entity.isSolve)) {
                    $.page.idM.ckisSolve.setValue(entity.isSolve);
                };
                if ($.pageCustomer.hasValue(entity.opinion)) {
                    $.page.idM.txtopinion.setValue(entity.opinion);
                };
            } else {
                if (resultData.infoList != null && resultData.infoList.length > 0) {
                    mini.alert(resultData.infoList[0]);
                };
            };
        }
    }));
};

function SaveOperationAlarm() {
    var entity = fw.fwObject.FWObjectHelper.emptyToNull(divFormJQ.getData());
    entity.isSolve = $.page.idM.ckisSolve.getValue();
    entity.opinion = $.page.idM.txtopinion.getValue();
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "operationMaintenance"
        , methodName: "updateMonitorSiteAlarm"
        , data: {
            ticket: $.page.ticket
           , mEntity: entity
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                mini.alert("保存成功", "提示", function () {
                    CloseWindow("ok");
                });
            } else {
                if (resultData.infoList != null && resultData.infoList.length > 0) {
                    mini.alert(resultData.infoList[0]);
                };
            };
        }
    }));
};

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
