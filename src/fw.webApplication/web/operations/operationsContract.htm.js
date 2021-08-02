
var buttonSaveJQ = null;
var buttonCancelJQ = null; 

var action = null;
var methodName = null;
var operationMaintenanceContractCode = null;
var arrayModelList = [];
var arrayOldCodeList = [];
var entityList = null;

var insertList = [];
var deleteList = [];
var cantonData = [];

$.page.pageInit = function () { 
    $.page.dataSourceSettingsDictionary = {
	    "cantonCode": {
	            dataSourceName: "sysBasicManage.getCantonDicData"
	            , dataSourceParams: {  }
	    }
	    ,"operationMaintenanceUnitCode": {
	        dataSourceName: "operationMaintenance.queryMaintenanceUnitDictionaryList"
	        , dataSourceParams: { ticket:$.page.ticket}
	    } 
    } 
};

$.page.pageLoad = function () {
    action = $.page.params.action;
    if (!$.page.isNullOrEmpty($.page.params.operationMaintenanceContractCode)) {
        operationMaintenanceContractCode = $.page.params.operationMaintenanceContractCode;
        queryContract();
    };

    divFormJQ = $.page.idM.divForm;
    buttonSaveJQ = $("#buttonSave");
    buttonCancelJQ = $("#buttonConcel"); 
     
    buttonCancelJQ.bind("click", function () {
        CloseWindow("cancel");
    });
    if (action == $.pageCustomer.enumOperate.view) {
        buttonSaveJQ.hide();
        $("#buttonConcel").hide();
    };
    buttonSaveJQ.bind("click", function () {
        if ($.page.userInfo.userTypeCode == "omUnit") {
            mini.alert("没有权限操作此功能！");
            return;
        }
        Save();
    }); 
};

function queryContract() { 
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "operationMaintenance"
        , methodName: "queryOperationMaintenanceContract"
        , data: {
            ticket: $.page.ticket
           , queryParams: { operationMaintenanceContractCode: operationMaintenanceContractCode }
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                var entity = resultData.data[0];
                divFormJQ.setData(entity); 
                if (action == $.pageCustomer.enumOperate.view) {
                    $.pageCustomer.labelModel(divFormJQ);  
                } ; 
            } else {
                if (resultData.infoList != null && resultData.infoList.length > 0) {
                    mini.alert(resultData.infoList[0]);
                };
            };
        }
    }));
};

function Save() {

    //表单验证
    divFormJQ.validate();
    //判断表单验证不成功
    if (divFormJQ.isValid() == false) { return; };
    var isValid = true; 
    var Entity = divFormJQ.getData();   
   Entity.operationMaintenanceContractCode = operationMaintenanceContractCode;
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "operationMaintenance"
        , methodName: "inserOrUpdateMOperationMaintenanceContract"
        , data: {
            ticket: $.page.ticket
           , mEntity: Entity 
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                CloseWindow("ok");
            } else {
                if (resultData.infoList != null && resultData.infoList.length > 0) {
                     var html_warning = '<b>操作失败</b>';
                    if (resultData.status == fw.fwData.FWResultStatus.Failure && resultData.infoList.length > 0) {

                        //获取warning信息
                        var subData = $.Enumerable.From(resultData.infoList).Where("$.indexOf('warning')>-1").ToArray().forEach(function (i) {
                            html_warning += '<br/>' + i.substr(i.indexOf('warning') + 8);
                        });
                        html_warning+='<br/>原因 '+subData;
                    }
                    mini.showTips({
                        content: html_warning,
                        state: 'warning', 
                    }); 
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

function onButtonEdit(e) {
    var btnEdit = this;

    var data = { ticket: $.page.ticket, action: action };
    if (action != $.pageCustomer.enumOperate.add) {
        data.operationMaintenanceContractCode = operationMaintenanceContractCode;
    };

    var pageParams = { url: "web/operationMaintenance/selectOrganization.htm", width: 800, height: 600, title: "运维企业" };
    $.pageCustomer.openPage(data, pageParams, function (e) {
        btnEdit.setText(e.operationMaintenanceUnitName);
        btnEdit.setValue(e.operationMaintenanceUnitCode);
    });
};

function onDrawDateBegin(e) {
    var date = e.date;
    var d = new Date();

    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.txtEffectiveEnd.value)) {
        if (date.getTime() > $.page.idM.txtEffectiveEnd.value) {
            e.allowSelect = false;
        };
    };
};

function onDrawDateEnd(e) {
    var date = e.date;
    var d = new Date();

    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.txtEffectiveStart.value)) {
        if (date.getTime() < $.page.idM.txtEffectiveStart.value) {
            e.allowSelect = false;
        };
    };
};

function onCancel() {
    CloseWindow("cancel");
}; 