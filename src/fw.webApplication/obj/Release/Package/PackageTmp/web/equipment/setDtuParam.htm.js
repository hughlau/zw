var pageParams = {};

//页面初始化
$.page.pageInit = function () {
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.dtuMacList)) {
        pageParams.dtuMacList = $.page.params.dtuMacList.split(',');
    };


};
//页面加载
$.page.pageLoad = function () {

};


function settingClick() {
    //表单验证
    $.page.idM.editform.validate();
    //判断表单验证不成功
    if ($.page.idM.editform.isValid() == false) { return; };
    // $.page.idM.IrrAreaState.setValue(0);
    var settingParams = {
       // ReCtrSampTime: $.page.idM.reCtrType.getValue() == "0" ? null : $.page.idM.ReCtrSampTime.getValue(),
        realDataReportPeriod: $.page.idM.timeSpan.getValue()
    };

    if ($.page.idM.timeSpan.getValue() == "") {
        return;
    }
    var mEntityList = $.map(pageParams.dtuMacList, function (value, i) {
        return {
            dtuMac: value,
            realDataReportPeriod: settingParams.realDataReportPeriod,
            // ActTime: 1,
            ActResult: null
        };
    });
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
            , serviceName: "basicInfo"
            , methodName: "SetDtuParamList"
            , data: {
                ticket: $.page.ticket,
                mEntityList: mEntityList
            }
            , success: function (resultData) {
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                    var result="";
                    for (var i = 0; i < resultData.infoList.length; i++) {
                        result += resultData.infoList[i].toString()+"<br>";
                    }
                    if (result == "") {
                        mini.alert("设置成功");
                    }
                    else {
                        mini.alert(result);
                    }
                   
                }
                else //Roger 2016/6/1 13:00:02 增加管辖区域
                {
                    var erroInfo = resultData.infoList.join("<br>");
                    $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
                };
            }
    }));    ;
};
//关闭窗口
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

function onTimeSpanValidation(e) {
    if (e.isValid) {
        if (isNumber(e.value) == false) {
            e.errorText = "必须输入数字";
            e.isValid = false;
        };

    };
};

function isNumber(v) {
    var re = new RegExp("^[0-9]*$");
    if (re.test(v)) return true;
    return false;
};
//取消
function onCancel() {
    //关闭窗口
    CloseWindow("cancel");
};