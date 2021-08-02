
var buttonSaveJQ = null;
var buttonCancelJQ = null;
var callbackData = null;
var action = null;
var operationMaintenanceTaskCode = null;
var monitorSiteAlarmCode = null; //监测点报警编码
var methodName = null;
var querryEntity = null;

$.page.pageInit = function () {
    //获取设置值
    $.page.appSettings = {
        defaultFaultItem: "1"
    };

    $.page.dataSourceSettingsDictionary = {
        "rbFaultType": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BIZFaultType" }
        }
        , "rbTaskType": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BIZTaskType" }
        }
    };

    $.page.idM.startDate.setValue(new Date());
    $.page.idM.endDate.setValue(fw.fwDateTime.FWDateTimeHelper.addDays(new Date(), 1));

    //   $.page.idM.rbFaultType.setValue($.page.appSettings.defaultFaultItem);
};


$.page.pageLoad = function () {
    action = $.page.params.action;
    operationMaintenanceTaskCode = $.page.params.operationMaintenanceTaskCode;
    monitorSiteAlarmCode = $.page.params.monitorSiteAlarmCode;

    divFormJQ = $.page.idM.divForm;
    buttonSaveJQ = $("#buttonSave");
    buttonCancelJQ = $("#buttonConcel");

    buttonSaveJQ.bind("click", function () {
        SaveOperationTask();
    });

    buttonCancelJQ.bind("click", function () {
        CloseWindow("cancel");
    });

    if (!$.pageCustomer.hasValue(operationMaintenanceTaskCode) && !$.pageCustomer.hasValue(monitorSiteAlarmCode)) {
        action = $.pageCustomer.enumOperate.add;
    };

    if (action == "editView") {
        $.page.idM.rbFaultType.setEnabled(false);
        methodName = "insertMaintenanceTask";
        queryOperationAlarm();
        //        monitorSiteCode = $.page.params.monitorSiteCode;
        //        faultTypeCode = $.page.params.alarmTypeCode;
        //        faultTime = $.page.params.alarmTime;

    } else if (action == "editView_v") {
        $.pageCustomer.labelModel(divFormJQ);
        buttonSaveJQ.hide();
        queryOperationAlarm();
    } else if (action == $.pageCustomer.enumOperate.add || action == $.pageCustomer.enumOperate.edit) {
        methodName = "insertMaintenanceTask";
        if ($.pageCustomer.hasValue(operationMaintenanceTaskCode)) {
            methodName = "updateMaintenanceTask";
            queryOperationTask();
        };
        $.OperationMaintenancePage.ShowFunction("Add", $("#divForm"));
    } else {
        queryOperationTask();
    };
    $.page.idM.rbTaskType.on("valuechanged", function (e) {
        if ($.page.idM.rbTaskType.getValue() == 2) {
            $("#trFaultType").show();
            $("#trEquipment").show();
            showEquipment();
        } else {
            $("#trFaultType").hide();
            $("#trEquipment").hide();
        };
    });
};

//加载对应的设备
function showEquipment() {
    var Entity = fw.fwObject.FWObjectHelper.emptyToNull(divFormJQ.getData());
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "basicInfo"
        , methodName: "queryEquipmentByMonitorSite"
        , data: {
            ticket: $.page.ticket
           , monitorSiteCode: Entity.monitorSiteCode
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                var entity = resultData.data;
                $.page.idM.cmbEquipment.setData(entity);
                //修改查看
                if (action == $.pageCustomer.enumOperate.view || action == $.pageCustomer.enumOperate.edit || action == "editView") {
                    $.page.idM.cmbEquipment.setValue(querryEntity.equipmentCode);
                }
                if (action == $.pageCustomer.enumOperate.view || action == "editView") {
                    $.page.idM.cmbEquipment.setEnabled(false);
                }

            } else {
                if (resultData.infoList != null && resultData.infoList.length > 0) {
                    mini.alert(resultData.infoList[0]);
                };
            };
        }
    }));
}

function queryOperationTask() {

    var queryParams = {};
    if ($.pageCustomer.hasValue(monitorSiteAlarmCode)) {
        queryParams.monitorSiteAlarmCode = monitorSiteAlarmCode;
    };
    if ($.pageCustomer.hasValue(operationMaintenanceTaskCode)) {
        queryParams.operationMaintenanceTaskCode = operationMaintenanceTaskCode;
    };

    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "operationMaintenance"
        , methodName: "queryMaintenanceTask"
        , data: {
            ticket: $.page.ticket
           , queryParams: queryParams
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                var entity = resultData.data[0];
                querryEntity = entity;
                if (action == $.pageCustomer.enumOperate.view) {
                    $.pageCustomer.labelModel(divFormJQ);
                    buttonSaveJQ.hide();
                    divFormJQ.setData(entity);
                    $.page.idM.btnChooseMonitor.setText(entity.monitorSiteName);
                    $.page.idM.btnChooseMonitor.setValue(entity.monitorSiteCode);
                    $.page.idM.btnChooseMonitor.setEnabled(false);
                    $.page.idM.btnChoosePeople.setText(entity.operationMaintenancePersonName);
                    $.page.idM.btnChoosePeople.setValue(entity.operationMaintenancePersonCode);
                    $.page.idM.btnChoosePeople.setEnabled(false);
                }
                else {
                    divFormJQ.setData(entity);
                    $.page.idM.btnChooseMonitor.setText(entity.monitorSiteName);
                    $.page.idM.btnChooseMonitor.setValue(entity.monitorSiteCode);
                    $.page.idM.btnChoosePeople.setText(entity.operationMaintenancePersonName);
                    $.page.idM.btnChoosePeople.setValue(entity.operationMaintenancePersonCode);
                };
                if (entity.taskTypeCode == 1) {
                    $("#trFaultType").css("display", "none");
                    $("#trEquipment").css("display", "none");
                } else {
                    showEquipment();
                }
            } else {
                if (resultData.infoList != null && resultData.infoList.length > 0) {
                    mini.alert(resultData.infoList[0]);
                };
            };
        }
    }));
};

function queryOperationAlarm() {
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "operationMaintenance"
        , methodName: "queryMaintenanceTaskByAlarmCode"
        , data: {
            ticket: $.page.ticket
           , queryParams: { monitorSiteAlarmCode: monitorSiteAlarmCode }
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                var entity = resultData.data;
                querryEntity = entity;
                entity.taskTypeCode = 2;
                divFormJQ.setData(entity);
                $.page.idM.rbTaskType.setValue(entity.taskTypeCode);
                $.page.idM.rbTaskType.setEnabled(false);
                $.page.idM.endDate.setValue(fw.fwDateTime.FWDateTimeHelper.addDays(fw.fwString.FWStringHelper.toDateTime(entity.faultTime), 1));
                if ($.pageCustomer.hasValue(entity.monitorSiteCode)) {
                    $.page.idM.btnChooseMonitor.setText(entity.monitorSiteName);
                    $.page.idM.btnChooseMonitor.setValue(entity.monitorSiteCode);
                    $.page.idM.btnChooseMonitor.setEnabled(false);
                };
                if ($.pageCustomer.hasValue(entity.operationMaintenancePersonCode)) {
                    $.page.idM.btnChoosePeople.setText(entity.operationMaintenancePersonName);
                    $.page.idM.btnChoosePeople.setValue(entity.operationMaintenancePersonCode);
                    $.page.idM.btnChoosePeople.setEnabled(false);
                };
                if (entity.taskTypeCode == 1) {
                    $("#trFaultType").css("display", "none");
                    $("#trEquipment").css("display", "none");
                } else {
                    showEquipment();
                }

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

//时间选择限制 开始时间 暂存申请信息 OK
function onDrawStartDate(e) {
    var date = e.date;
    var d = new Date();
    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.endDate.value)) {
        if (date.getTime() > $.page.idM.endDate.value) {
            e.allowSelect = false;
        }
    }
    if (date.getTime() > d.getTime()) {
        e.allowSelect = false;
    };
}
//时间选择限制 结束时间 暂存申请信息 OK
function onDrawEndDate(e) {
    var date = e.date;
    var d = new Date();

    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.startDate.value)) {
        if (date.getTime() < $.page.idM.startDate.value) {
            e.allowSelect = false;
        }
    } 
};

function onButtonChooseMonitorSite(e) {
    var textMonitor = this;
    var data = { ticket: $.page.ticket, enumSelect: $.OperationMaintenancePage.enumSelect.singleSelect };

    var pageParams = { url: "web/operationMaintenance/selectMonitorSite.htm", width: 800, height: 600, title: "设施点位" };
    $.page.openPage(data, pageParams, function (selectList) {
        if (selectList != null) {
            textMonitor.setText(selectList.name);
            textMonitor.setValue(selectList.code);
            $.page.idM.txtTaskName.setValue("监测点-" + selectList.name + " 运维任务"); 
            showEquipment();
        };
    });
};

function onButtonChoosePerson(e) {
    if (!fw.fwObject.FWObjectHelper.hasValue($.page.idM.btnChooseMonitor.getValue())) {
        mini.showTips({
            content: "请选择点位！",
            state: 'warning',
            x: 'center',
            y: 'top',
            timeout: 3000
        }); 
        return;
    }; 
    var textMonitor = this;
    var data = { ticket: $.page.ticket, enumSelect: $.OperationMaintenancePage.enumSelect.singleSelect, monitorSiteCode: $.page.idM.btnChooseMonitor.getValue() };

    var pageParams = { url: "web/operationMaintenance/selectPerson.htm", width: 800, height: 600, title: "运维人员" };
    $.pageCustomer.openPage(data, pageParams, function (selectList) {
        if (selectList != null && selectList.length > 0) {
            textMonitor.setText(selectList[0].operationMaintenancePersonName);
            textMonitor.setValue(selectList[0].operationMaintenancePersonCode);
        };
    });
};

function SaveOperationTask() {
    //表单验证
    divFormJQ.validate();
    //判断表单验证不成功
    if (divFormJQ.isValid() == false) { return; };
    var isValid = true;

    var Entity = fw.fwObject.FWObjectHelper.emptyToNull(divFormJQ.getData());
    Entity.monitorSiteAlarmCode = monitorSiteAlarmCode;
    if (action == "editView") {
        Entity.status = "2";
    };
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
