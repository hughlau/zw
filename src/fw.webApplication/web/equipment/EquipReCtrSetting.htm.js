var pageParams = {};

//页面初始化
$.page.pageInit = function () {
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.equipmentNoList)) {
        pageParams.equipmentNoList = $.page.params.equipmentNoList.split(',');
        pageParams.equipmentTypeCode = $.page.params.equipmentTypeCode.split(',');
    };
    $.page.idM.reCtrType.setValue(0);

};
//页面加载
$.page.pageLoad = function () {

};

function reCtrTypeChange() {
    var reCtrTypeValue = $.page.idM.reCtrType.getValue();
    var IrrAreaState = $.page.idM.IrrAreaState.getValue();
    if (reCtrTypeValue == 0) {
        $(".ReCtrSampTime").hide();
    } else {
        $(".ReCtrSampTime").show();
    };
    if (IrrAreaState == 0) {
        $(".isFert").hide();
        $(".FormulaNo").hide();
    } else {
        $(".isFert").show();
        $(".FormulaNo").show();
    };
};

function FertChange() {
    var isFertValue = $.page.idM.isFert.getValue();
    if (isFertValue == 0) {
        $(".FormulaNo").hide();
    } else {
        $(".FormulaNo").show();
    };
};

function settingClick() {
    // $.page.idM.IrrAreaState.setValue(0);
    var settingParams = {
        ReCtrSampTime: $.page.idM.reCtrType.getValue() == "0" ? null : $.page.idM.ReCtrSampTime.getValue(),
        Action: $.page.idM.IrrAreaState.getValue()
    };
    var mEntityList = $.map(pageParams.equipmentNoList, function (value, i) {
        return {
            equipmentNo: value,
            equipmentType: pageParams.equipmentTypeCode[i],
            ReCtrSampTime: settingParams.ReCtrSampTime,
            Action: settingParams.Action,
            // ActTime: 1,
            ActResult: null
        };
    });
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
            , serviceName: "basicInfo"
            , methodName: "InsertOrUpdateEquipReCtrList"
            , data: {
                ticket: $.page.ticket,
                mEntityList: mEntityList
            }
            , success: function (resultData) {
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                    var result = "";
                    for (var i = 0; i < resultData.infoList.length; i++) {
                        result += resultData.infoList[i].toString() + "<br>";
                    }
                   // mini.alert(result);
                   // mini.alert("反控成功！");
                    $.page.showTips({ content: "操作成功!<br>" , state: "success" });
                }
                else //Roger 2016/6/1 13:00:02 增加管辖区域
                {
                    var erroInfo = resultData.infoList.join("<br>");
                    $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
                };
            }
    })); ;
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

//取消
function onCancel() {
    //关闭窗口
    CloseWindow("cancel");
};