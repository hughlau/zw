
var divFormJQ = null;
var buttonSaveJQ = null;
var buttonCancelJQ = null;

var action = null;
var methodName = null;
var projectCode = null;

$.page.pageInit = function () {
    $.page.dataSourceSettingsDictionary = {
        "cmbCanton": {
            dataSourceName: "sysBasicManage.getCantonDicData"
            , dataSourceParams: {  }
        }
    };
};

$.page.pageLoad = function () {
    action = $.page.params.action;
    projectCode = $.page.params.projectCode;

    divFormJQ = $.page.idM.divForm;
    buttonSaveJQ = $("#buttonSave");
    buttonCancelJQ = $("#buttonConcel");

    if (action == $.pageCustomer.enumOperate.add || action == $.pageCustomer.enumOperate.edit) {
        methodName = "insertBLLProject";
        if ($.pageCustomer.hasValue(projectCode)) {
            methodName = "updateBLLProject";
            queryProject();
        };
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

        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "basicInfo"
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
    });
};

function queryProject() {
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "basicInfo"
        , methodName: "queryProject"
        , data: {
            ticket: $.page.ticket
           , queryParams: { projectCode: projectCode }
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                var entity = resultData.data[0];
                divFormJQ.setData(entity);
            }
            else
            {
                var erroInfo = resultData.infoList.join("<br>");
                $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
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

 