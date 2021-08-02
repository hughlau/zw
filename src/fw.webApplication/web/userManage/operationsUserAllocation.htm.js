var userID = undefined;

//页面初始化
$.page.pageInit = function () { 
};

//页面加载
$.page.pageLoad = function () {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.userID)) { 
        userID = $.page.params.userID;
        $.page.idM.editform.setData({ mUserName: $.page.params.userName }); 
    };
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

 

 

//插入或者更新
function onInsertOrUpdate() {
    //表单验证
    $.page.idM.editform.validate();
    //判断表单验证不成功
    if ($.page.idM.editform.isValid() == false) { return; };
    //获取表单数据
    var data = fw.fwObject.FWObjectHelper.emptyToNull($.page.idM.editform.getData()); 
    //插入或者更新
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "operationMaintenance"
        , methodName: "operationsUserAllocation"
        , data: {
            ticket: $.page.ticket
            , userID: userID
            , operationMaintenancePersonCode: $.page.idM.operationMaintenancePersonCode.getValue()
        }
        , beforeSend: function () {
            fw.fwButton.fwButtonHelper.addWait($.page.idM.insertOrUpdate);
        }
        , success: function (resultData) {
            //判断插入或者更新成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                //关闭窗口
                CloseWindow("insertOrUpdate");
            } else {
                var erroInfo = resultData.infoList.join("<br>");
                $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
            };
        }
        , complete: function () {
            fw.fwButton.fwButtonHelper.removeWait($.page.idM.insertOrUpdate);
        }
    }));
};

 
 
 
function onButtonChoosePerson(e) {
    var textMonitor = this;
    var data = { ticket: $.page.ticket, selectType: fw.fwData.FWSelectType.Single, selectCallback: "onPersonSelectCallback", selectClearCallback: "onPersonSelectClearCallback", pageType: "userAllocation" };
    var pageParams = { url: "web/operations/operationsPersonList.htm", width: 800, height: 600, title: "运维人员" };
    $.page.openPage(data, pageParams);
};

function onPersonSelectCallback(callbackData) {
    if ($.page.hasValue(callbackData)) {
        $.page.idM.operationMaintenancePersonCode.setText(callbackData.operationMaintenancePersonName);
        $.page.idM.operationMaintenancePersonCode.setValue(callbackData.operationMaintenancePersonCode);
    };
};