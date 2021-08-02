var buttonSaveJQ = null;
var buttonCancelJQ = null;
var callbackData = null;
var action = null;
var operationMaintenanceTaskPlanId = null;
var monitorSiteAlarmCode = null; //监测点报警编码
var methodName = null;
var entityList = null;
var divFormJQ = null;

//页面初始化
$.page.pageInit = function () {
    $.page.dataSourceSettingsDictionary = {
        "cmbOpMa": {
            dataSourceName: "operationMaintenance.queryOperationMaintenanceUnit"
            , dataSourceParams: { ticket: $.page.ticket }
        }
    };
};



//
$.page.pageLoad = function () {
    //
    action = $.page.params.action;
    operationMaintenanceTaskPlanId = $.page.params.operationMaintenanceTaskPlanId;
    //
    divFormJQ = $.page.idM.divTaskPlan;
    buttonSaveJQ = $("#buttonSave");
    buttonCancelJQ = $("#buttonConcel");
    //
    $.page.idM.cmbOpMa.setValue($.page.userInfo.operationMaintenanceUnitCode); 
    onPersonSearch();

    //
    buttonSaveJQ.bind("click", function () {
        SaveOperationTask();
    });

    //
    buttonCancelJQ.bind("click", function () {
        CloseWindow("cancel");
    });
    //
    methodName = "saveTaskPlan";
    //
    if ($.pageCustomer.enumOperate.edit == action) {
        onPersonSearch(); //加载人员
        loadPlanInfo();
        methodName = "updateTaskPlan";
    }
};

//加载数据
function loadPlanInfo() {
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "operationMaintenance"
        , methodName: "queryTaskPlan"
        , data: {
            ticket: $.page.ticket
           , taskPlanCode: operationMaintenanceTaskPlanId
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                var entity = resultData.data;
                $.page.idM.divTaskPlan.setData(entity);
                //
                onFrequencyShow(); //显示问题 
            } else {
                if (resultData.infoList != null && resultData.infoList.length > 0) {
                    mini.alert(resultData.infoList[0]);
                };
            };
        }
    }));
}
//筛选运维人员
function onPersonSearch() {
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "operationMaintenance"
        , methodName: "queryMaintenancePersonDictionaryList"
        , data: {
            ticket: $.page.ticket
           , queryParams: { operationMaintenanceUnitCode: $.page.idM.cmbOpMa.value }
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                var entity = resultData.data;
                $.page.idM.cmbOMPerson.setData(entity); 
            } else {
                if (resultData.infoList != null && resultData.infoList.length > 0) {
                    mini.alert(resultData.infoList[0]);
                };
            };
        }
    }));
}

//
function onFrequencyShow() {
    var frequencyType = $.page.idM.rbFrequencyType.value;
    switch (frequencyType) {
        case "0":
            $("#divMonth").css("display", "block");
            $("#divYear").css("display", "none");
            break;
        case "1":
            $("#divMonth").css("display", "none");
            $("#divYear").css("display", "block");
            break;
        default:
    }
}
//
function CloseWindow(action) {
    //判断数据被修改
    if (action == "close" && $.page.idM.editform.isChanged()) {
        if (confirm("数据被修改了，是否先保存？")) {
            return false;
        }
    }
    if (window.CloseOwnerWindow) {
        return window.CloseOwnerWindow(action);
    } else {
        window.close();
    }
}

//
function SaveOperationTask() {
    //表单验证
    divFormJQ.validate();
    //判断表单验证不成功
    if (divFormJQ.isValid() == false) { return; };
    //
    var Entity = fw.fwObject.FWObjectHelper.emptyToNull(divFormJQ.getData());
    switch (Entity.frequencyType) {
        case "0":
            Entity.startDay = Entity.startDay1;
            Entity.endDay = Entity.endDay1;
            break;
        case "1":
            Entity.startDay = Entity.startDay2;
            Entity.endDay = Entity.endDay2;
            break;
    }
    Entity.isValid = 1;
    //
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "operationMaintenance"
        , methodName: methodName
        , data: {
            ticket: $.page.ticket
           , mEntity: Entity
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                mini.alert(resultData.infoList[0], "提示", function () {
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