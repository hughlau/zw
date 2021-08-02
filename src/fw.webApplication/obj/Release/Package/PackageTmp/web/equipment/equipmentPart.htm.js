var divFormJQ = undefined;
var partCode = undefined;
$.page.pageInit = function () {
    $.page.dataSourceSettingsDictionary = {
        "partType": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BIZEQPartType" }
        },
        "recoverType": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BIZEQPartRecover" }
        }
    };
};

$.page.pageLoad = function () {
    action = $.page.params.action; 
    divFormJQ = $.page.idM.divForm;
    buttonSaveJQ = $("#buttonSave");
    buttonCancelJQ = $("#buttonConcel");

    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.partCode)) {
        partCode = $.page.params.partCode;
        queryEquipmentPart();
    };

    buttonCancelJQ.bind("click", function () {
        CloseWindow("cancel");
    });

    buttonSaveJQ.bind("click", function () {
        //表单验证
        divFormJQ.validate();
        //判断表单验证不成功
        if (divFormJQ.isValid() == false) { return; };
        var isValid = true;
        var Entity = divFormJQ.getData();
        Entity.partCode = $.page.params.partCode;

        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "basicInfo"
            , methodName: "inserOrUpdateMBLLEquipmentPart"
            , data: {
                ticket: $.page.ticket
               , mEntity: Entity
            }
             , success: function (resultData) {
                 //判断加载数据成功
                 if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data == true) {
                     CloseWindow("ok");
                 } else {
                     var erroInfo = resultData.infoList.join("<br>");
                     $.page.showTips({
                         content: "操作失败!<br>" + erroInfo,
                         state: "danger",  //""  success info warning danger
                         x: "center",  //left center right 
                         y: "top",  //top center bottom 
                         timeout: 3000
                     });
                 }
             }
        }));
    });
};

function queryEquipmentPart() {

    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "basicInfo"
        , methodName: "queryEquipmentPart"
        , data: {
            ticket: $.page.ticket
           , partCode: partCode
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