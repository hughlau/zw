
var buttonSaveJQ = null;
var buttonCancelJQ = null;
var callbackData = null;
var action = null;
var operationMaintenanceTaskCode = null;
var monitorSiteAlarmCode = null; //监测点报警编码
var methodName = null;
var entityList = null;

//页面初始化
$.page.pageInit = function () {
    $.page.dataSourceSettingsDictionary = {
        "cmbOpMa": {
            dataSourceName: "operationMaintenance.queryOperationMaintenanceUnit"
            , dataSourceParams: { ticket: $.page.ticket, mOperationMaintenanceUnitCode: "" }
        }
    };
};

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
$.page.pageLoad = function () {
    var treeRootData = [{ code: "321282", pCode: "-fw-", name: "靖江市", "folder": 1, dataLvl: 0, "isLeaf": false, "expanded": true, "asyncLoad": false}];
    $.page.idM.treeSelectSite.loadData(treeRootData);
    load_Tree();
};

//
function load_Tree() {
    $.page.idM.treeSelectSite.loading();
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "basicInfo"
        , methodName: "queryCantonListForLazyTree"
        , data: {
            ticket: $.page.ticket
            , queryParams: {}
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                entityList = resultData.data;
                var selectNode = $.page.idM.treeSelectSite.getChildNodes($.page.idM.treeSelectSite.getRootNode())[0];
                //
                for (var i = 0; i < entityList.length; i++) {
                    var entity = entityList[i];
                    if (entity.dataLvl == 1) {
                        var newNode = { code: entity.code, pCode: entity.pCode, name: entity.name, dataLvl: entity.dataLvl, "folder": 1, "isLeaf": false, "expanded": false, "asyncLoad": false };
                        $.page.idM.treeSelectSite.addNode(newNode, "add", selectNode);
                    };
                };
                $.page.idM.treeSelectSite.expandNode(selectNode);
            };
        }
        , complete: function () {
            $.page.idM.treeSelectSite.unmask();
        }
    }));
}

//
function onBeforeexpand(sender, node) {
    var selectedNode = sender.node;
    if (fw.fwObject.FWObjectHelper.hasValue(selectedNode)) {
        var childNodes = $.page.idM.treeSelectSite.getChildNodes(selectedNode);
        if (!$.page.idM.treeSelectSite.isLeaf(sender.node) && (!fw.fwObject.FWObjectHelper.hasValue(childNodes) || childNodes.length <= 0)) {
            //  不是叶子节点  而且没有数据 则加载数据
            if (selectedNode.dataLvl == '2') {
                //加载点位列表
                site_expand(selectedNode);
            } else {
                //展开
                for (var i = 0; i < entityList.length; i++) {
                    var entity = entityList[i];
                    if (entity.pCode == selectedNode.code) {
                        var newNode = { code: entity.code, pCode: entity.pCode, name: entity.name, dataLvl: entity.dataLvl, "folder": 1, "isLeaf": false, "expanded": false, "asyncLoad": false };
                        $.page.idM.treeSelectSite.addNode(newNode, "add", selectedNode);
                    };
                };
            };
        };
    };
};

//
function site_expand(e) {
    $.page.idM.treeSelectSite.loading();
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "basicInfo"
        , methodName: "queryMonitorSiteListForLazyTree"
        , data: {
            ticket: $.page.ticket
              , queryParams: { cantonCode: e.code }
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {

                for (var i = 0; i < resultData.data.length; i++) {
                    var entity = resultData.data[i];
                    if (entity.cantonCode == e.code) {
                        var newNode = { code: entity.monitorSiteCode
                        , pCode: e.code
                        , name: entity.monitorSiteName
                        , cantonName: entity.cantonName
                        , fullCantonName: entity.fullCantonName
                        , address: entity.address
                        , operationMaintenancePersonCode: entity.operationMaintenancePersonCode
                        , operationMaintenancePersonName: entity.operationMaintenancePersonName
                        , dataLvl: 3, "folder": 0, "isLeaf": true, "asyncLoad": false
                        };
                        $.page.idM.treeSelectSite.addNode(newNode, "add", e);
                    };
                };
            };

        }
        , complete: function () {
            $.page.idM.treeSelectSite.unmask();
        }
    }));
};

//
function onBeforeTreeLoad(e) {
    e.cancel = true;
    var tree = e.sender;    //树控件
    var node = e.node;      //当前节点
    var params = e.params;  //参数对象 
    //可以传递自定义的属性
    params.myField = "123"; //后台：request对象获取"myField"
    //$.page.idM.tree1.loadList(init_data_2);
    //$.page.idM.tree1.loadNode(node);
    //console.log(params.myField);
};

//
function beforenodeselect(e) {
    //禁止选中父节点
    if (e.isLeaf == false) e.cancel = true;
};

//function queryOperationTask() {

//    var queryParams = {};
//    if ($.pageCustomer.hasValue(monitorSiteAlarmCode)) {
//        queryParams.monitorSiteAlarmCode = monitorSiteAlarmCode;
//    };
//    if ($.pageCustomer.hasValue(operationMaintenanceTaskCode)) {
//        queryParams.operationMaintenanceTaskCode = operationMaintenanceTaskCode;
//    };

//    $.page.ajax($.page.getAjaxSettings({
//        serviceType: "crossDomainCall"
//        , serviceName: "operationMaintenance"
//        , methodName: "queryMaintenanceTask"
//        , data: {
//            ticket: $.page.ticket
//           , queryParams: queryParams
//        }
//        , success: function (resultData) {
//            //判断加载数据成功
//            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
//                var entity = resultData.data[0];
//                if (action == $.pageCustomer.enumOperate.view) {
//                    $.pageCustomer.labelModel(divFormJQ);
//                    buttonSaveJQ.hide();
//                    divFormJQ.setData(entity);
//                    $.page.idM.btnChooseMonitor.setText(entity.monitorSiteName);
//                    $.page.idM.btnChooseMonitor.setValue(entity.monitorSiteCode);
//                    $.page.idM.btnChooseMonitor.setEnabled(false);
//                    $.page.idM.btnChoosePeople.setText(entity.operationMaintenancePersonName);
//                    $.page.idM.btnChoosePeople.setValue(entity.operationMaintenancePersonCode);
//                    $.page.idM.btnChoosePeople.setEnabled(false);
//                }
//                else {
//                    divFormJQ.setData(entity);
//                    $.page.idM.btnChooseMonitor.setText(entity.monitorSiteName);
//                    $.page.idM.btnChooseMonitor.setValue(entity.monitorSiteCode);
//                    $.page.idM.btnChoosePeople.setText(entity.operationMaintenancePersonName);
//                    $.page.idM.btnChoosePeople.setValue(entity.operationMaintenancePersonCode);
//                };
//            } else {
//                if (resultData.infoList != null && resultData.infoList.length > 0) {
//                    mini.alert(resultData.infoList[0]);
//                };
//            };
//        }
//    }));
//};

//function queryOperationAlarm() {
//    $.page.ajax($.page.getAjaxSettings({
//        serviceType: "crossDomainCall"
//        , serviceName: "operationMaintenance"
//        , methodName: "queryMaintenanceTaskByAlarmCode"
//        , data: {
//            ticket: $.page.ticket
//           , queryParams: { monitorSiteAlarmCode: monitorSiteAlarmCode }
//        }
//        , success: function (resultData) {
//            //判断加载数据成功
//            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
//                var entity = resultData.data;
//                entity.taskTypeCode = 2;
//                divFormJQ.setData(entity);
//                $.page.idM.rbTaskType.setValue(entity.taskTypeCode);
//                $.page.idM.rbTaskType.setEnabled(false);
//                $.page.idM.endDate.setValue(fw.fwDateTime.FWDateTimeHelper.addDays(fw.fwString.FWStringHelper.toDateTime(entity.faultTime), 1));
//                if ($.pageCustomer.hasValue(entity.monitorSiteCode)) {
//                    $.page.idM.btnChooseMonitor.setText(entity.monitorSiteName);
//                    $.page.idM.btnChooseMonitor.setValue(entity.monitorSiteCode);
//                    $.page.idM.btnChooseMonitor.setEnabled(false);
//                };
//                if ($.pageCustomer.hasValue(entity.operationMaintenancePersonCode)) {
//                    $.page.idM.btnChoosePeople.setText(entity.operationMaintenancePersonName);
//                    $.page.idM.btnChoosePeople.setValue(entity.operationMaintenancePersonCode);
//                    $.page.idM.btnChoosePeople.setEnabled(false);
//                };
//            } else {
//                if (resultData.infoList != null && resultData.infoList.length > 0) {
//                    mini.alert(resultData.infoList[0]);
//                };
//            };
//        }
//    }));
//};

//function CloseWindow(action) {
//    //判断数据被修改
//    if (action == "close" && $.page.idM.editform.isChanged()) {
//        if (confirm("数据被修改了，是否先保存？")) {
//            return false;
//        };
//    };
//    if (window.CloseOwnerWindow) {
//        return window.CloseOwnerWindow(action);
//    } else {
//        window.close();
//    };
//};

////时间选择限制 开始时间 暂存申请信息 OK
//function onDrawStartDate(e) {
//    var date = e.date;
//    var d = new Date();
//    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.endDate.value)) {
//        if (date.getTime() > $.page.idM.endDate.value) {
//            e.allowSelect = false;
//        }
//    }
//    if (date.getTime() > d.getTime()) {
//        e.allowSelect = false;
//    };
//}
////时间选择限制 结束时间 暂存申请信息 OK
//function onDrawEndDate(e) {
//    var date = e.date;
//    var d = new Date();

//    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.startDate.value)) {
//        if (date.getTime() < $.page.idM.startDate.value) {
//            e.allowSelect = false;
//        }
//    }
//    //    if (date.getTime() > d.getTime()) {
//    //        e.allowSelect = false;
//    //    }
//};

//function onButtonChooseMonitorSite(e) {
//    var textMonitor = this;
//    var data = { ticket: $.page.ticket, enumSelect: $.OperationMaintenancePage.enumSelect.singleSelect };

//    var pageParams = { url: "web/operationMaintenance/selectMonitorSite.htm", width: 800, height: 600, title: "设施点位" };
//    $.pageCustomer.openPage(data, pageParams, function (selectList) {
//        if (selectList != null) {
//            textMonitor.setText(selectList.name);
//            textMonitor.setValue(selectList.code);
//            $.page.idM.txtCantonName.setValue(selectList.fullCantonName);
//            $.page.idM.txtAddress.setValue(selectList.address);
//            if (!$.pageCustomer.hasValue($.page.idM.txtTaskName.getValue())) {
//                $.page.idM.txtTaskName.setValue(selectList.fullCantonName + selectList.name);
//            };
//            if ($.pageCustomer.hasValue(selectList.operationMaintenancePersonCode) && $.pageCustomer.hasValue(selectList.operationMaintenancePersonName)) {
//                $.page.idM.btnChoosePeople.setText(selectList.operationMaintenancePersonName);
//                $.page.idM.btnChoosePeople.setValue(selectList.operationMaintenancePersonCode);
//            }
//        };
//    });
//};

//function onButtonChoosePerson(e) {
//    var textMonitor = this;
//    var data = { ticket: $.page.ticket, enumSelect: $.OperationMaintenancePage.enumSelect.singleSelect };

//    var pageParams = { url: "web/operationMaintenance/selectPerson.htm", width: 800, height: 600, title: "运维人员" };
//    $.pageCustomer.openPage(data, pageParams, function (selectList) {
//        if (selectList != null && selectList.length > 0) {
//            textMonitor.setText(selectList[0].operationMaintenancePersonName);
//            textMonitor.setValue(selectList[0].operationMaintenancePersonCode);
//        };
//    });
//};

//function SaveOperationTask() {
//    //表单验证
//    divFormJQ.validate();
//    //判断表单验证不成功
//    if (divFormJQ.isValid() == false) { return; };
//    var isValid = true;

//    var Entity = fw.fwObject.FWObjectHelper.emptyToNull(divFormJQ.getData());
//    if (action == "editView") {
//        Entity.status = "2";
//    };
//    $.page.ajax($.page.getAjaxSettings({
//        serviceType: "crossDomainCall"
//        , serviceName: "operationMaintenance"
//        , methodName: methodName
//        , data: {
//            ticket: $.page.ticket
//           , mEntity: Entity
//        }
//        , success: function (resultData) {
//            //判断加载数据成功
//            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
//                mini.alert("保存成功", "提示", function () {
//                    CloseWindow("ok");
//                });
//            } else {
//                if (resultData.infoList != null && resultData.infoList.length > 0) {
//                    mini.alert(resultData.infoList[0]);
//                };
//            };
//        }
//    }));
//};
