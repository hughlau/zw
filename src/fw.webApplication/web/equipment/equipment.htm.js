var equipmentCode = undefined;
var entity = {};
$.page.pageInit = function () {
    $.page.dataSourceSettingsDictionary = {
        "equipmentTypeCode": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BLL_EquipmentType" }
        },
        "cantonCode": {
            dataSourceName: "sysBasicManage.getCantonDicData"
            , dataSourceParams: {  }
        },
        "moduleTypeCode": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BLLModuleType" }
        }
    };
};

$.page.pageLoad = function () {
    
    buttonSaveJQ = $("#buttonSave");
    buttonCancelJQ = $("#buttonConcel");

    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.equipmentCode)) {
        equipmentCode = $.page.params.equipmentCode;
        queryEquipment();
    };

    buttonCancelJQ.bind("click", function () {
        CloseWindow("cancel");
    });

    buttonSaveJQ.bind("click", function () {
        save();
    });
};

function queryEquipment() {

    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "basicInfo"
        , methodName: "queryEquipment"
        , data: {
            ticket: $.page.ticket
           , equipmentCode: equipmentCode
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                var entity = resultData.data;
                $.page.idM.divForm.setData(entity);
            } else {
                var erroInfo = resultData.infoList.join("<br>");
                $.page.showTips({
                    content: "数据获取失败!<br>" + erroInfo,
                    state: "danger"
                });
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


function save() {
    var divFormJQ = $.page.idM.divForm;
    //表单验证
    divFormJQ.validate();
    //判断表单验证不成功
    if (divFormJQ.isValid() == false) { return; };
    var isValid = true;

    var Entity = divFormJQ.getData();
    $.extend(entity, Entity);
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
            , serviceName: "basicInfo"
            , methodName: "inserOrUpdateMBLLEquipment"
            , data: {
                ticket: $.page.ticket
               , mEntity: entity
            }
             , success: function (resultData) {
                 //判断加载数据成功
                 if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data == true) {
                     CloseWindow("ok");
                 } else {
                     var erroInfo = resultData.infoList.join("<br>");
                     $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
                 }
             }
    }));
};

 

function onEqNOChanged() {
    var cantonName = $.page.idM.cantonCode.getText();
    $.page.idM.equipmentName.setValue(cantonName + '_' + $.page.idM.equipmentNo.getValue());
};