var divFormJQ = undefined;
var monitorSiteCode = undefined;
var monitorFactorCode = undefined;
var entity = {};
$.page.pageInit = function () {
    $.page.dataSourceSettingsDictionary = {
        "monitorFactorCode": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BLLMonitorFactor" }
        } 
    };
};

$.page.pageLoad = function () {
    action = $.page.params.action;
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.monitorSiteCode)) {
        monitorSiteCode = $.page.params.monitorSiteCode;
    } else {
        $.page.showTips({ content: "monitorSiteCode参数不能为空!<br>" + erroInfo, state: "danger" });
    };
    divFormJQ = $.page.idM.divForm;
    buttonSaveJQ = $("#buttonSave");
    buttonCancelJQ = $("#buttonConcel");

    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.monitorFactorCode)) {
        monitorFactorCode = $.page.params.monitorFactorCode;
        queryMBasSiteFactor();
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
        var entity = divFormJQ.getData();
        entity.monitorSiteCode = monitorSiteCode;
        entity.preMonitorFactorCode = monitorFactorCode;
        entity.action = action;

        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "basicInfo"
            , methodName: "inserOrUpdateMBasSiteFactor"
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
    });
};

 function queryMBasSiteFactor() {

     $.page.ajax($.page.getAjaxSettings({
         serviceType: "crossDomainCall"
        , serviceName: "basicInfo"
        , methodName: "queryMBasSiteFactor"
        , data: {
            ticket: $.page.ticket
           , monitorSiteCode: monitorSiteCode
           , monitorFactorCode: monitorFactorCode
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                var entity = resultData.data;
                $.page.idM.divForm.setData(entity);
                //$.page.idM.monitorFactorCode.setValue(entity.monitorFactorCode);
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