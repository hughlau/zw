var operationMaintenanceTaskCode = null;
var action = null;

var buttonCancelJQ = null;
var buttonSaveJQ = null;
var divFormJQ = null;

$.page.pageInit = function () {
    $.page.idM.txtRepairTime.setValue(new Date());
};

$.page.pageLoad = function () {

    operationMaintenanceTaskCode = $.page.params.operationMaintenanceTaskCode;
    action = $.page.params.action;

    buttonCancelJQ = $("#buttonConcel");
    buttonSaveJQ = $("#buttonSave");
    divFormJQ = $.page.idM.divForm;

    buttonCancelJQ.bind("click", function () {
        CloseWindow("cancel");
    });

    buttonSaveJQ.bind("click", function () {
        SaveOperationTask();
    });
    queryOperationTask();
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

function queryOperationTask() {
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "operationMaintenance"
        , methodName: "queryMaintenanceTask"
        , data: {
            ticket: $.page.ticket
           , queryParams: { operationMaintenanceTaskCode: operationMaintenanceTaskCode }
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                var entity = resultData.data[0];
                if (action == $.pageCustomer.enumOperate.view) {
                    $.pageCustomer.labelModel(divFormJQ);
                }
                $.page.idM.infoForm.setData(entity);
                divFormJQ.setData(entity); 
                var t = mini.get("isSolve");
                t.setChecked(true);
                t.disable();
            } else {
                if (resultData.infoList != null && resultData.infoList.length > 0) {
                    mini.alert(resultData.infoList[0]);
                };
            };
        }
    }));
};

function SaveOperationTask() {
    //表单验证
    divFormJQ.validate();
    //判断表单验证不成功
    if (divFormJQ.isValid() == false) { return; };
    var isValid = true;

    var tempEntity = divFormJQ.getData();
    var entity = $.pageCustomer.GetJsonData("ViewClass", $("#divForm"));
    entity.operationMaintenanceTaskCode = operationMaintenanceTaskCode;
    entity.isGoSite = tempEntity.isGoSite;
    entity.repairTime = tempEntity.repairTime;
    entity.prescribeRepairTime = tempEntity.prescribeRepairTime;
    entity.opinion = tempEntity.opinion;
    entity.isSolve = 1;
    if (tempEntity.repairTime != null) {
        if (tempEntity.repairTime < tempEntity.faultTime) {
            mini.alert("反馈时间必须大于故障时间。");
            return;
        }
    }
    //
    if (tempEntity.prescribeRepairTime < tempEntity.faultTime) {
        mini.alert("规定修复时间必须大于故障时间。");
        return;
    }
    //
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "operationMaintenance"
        , methodName: "updateMaintenanceTask"
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