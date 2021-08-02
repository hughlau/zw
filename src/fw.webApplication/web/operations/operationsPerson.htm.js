var operationMaintenancePersonCode = undefined;
var operationMaintenanceUnitCode = undefined;
var action = undefined;
//页面初始化
$.page.pageInit = function () {
    $.page.dataSourceSettingsDictionary = {
        "operationMaintenanceUnitCode": {
            dataSourceName: "operationMaintenance.queryMaintenanceUnitDictionaryList"
	        , dataSourceParams: { ticket: $.page.ticket }
        }
    };
};

//页面加载
$.page.pageLoad = function () {

    //测试数据 
    action = $.page.params.action;
    if (action == "view") {
        $.page.labelModel($.page.idM.editform);
        $.page.idJQ.btnsave.hide();
    }
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.operationMaintenanceUnitCode)) {
        operationMaintenanceUnitCode = $.page.params.operationMaintenanceUnitCode;
        //运维单位 禁用
    };
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.operationMaintenancePersonCode)) {
        operationMaintenancePersonCode = $.page.params.operationMaintenancePersonCode;
        //查询信息
        query(operationMaintenancePersonCode);
    };

    //    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.action) && $.page.params.action == $.pageCustomer.enumOperate.view) {
    //        labelModel();
    //        $.page.idM.operationMaintenanceUnitCode.setEnabled(false);
    //        $.page.idJQ.insertOrUpdate.hide();
    //    };
};



//查看模式
function labelModel() {
    var fields = $.page.idM.editform.getFields();
    for (var i = 0, l = fields.length; i < l; i++) {
        var c = fields[i];
        if (c.setReadOnly) c.setReadOnly(true);     //只读
        if (c.setIsValid) c.setIsValid(true);       //去除错误提示
        if (c.addCls) c.addCls("asLabel");          //增加asLabel外观
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

//查询信息
function query(operationMaintenancePersonCode) {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue(operationMaintenancePersonCode)) {
        //查询信息
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "operationMaintenance"
            , methodName: "queryMOperationMaintenancePersonByPersonCode"
            , data: {
                ticket: $.page.ticket
                , mOperationMaintenancePersonCode: operationMaintenancePersonCode
            }
            , success: function (resultData) {
                //判断查询信息成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                    var entity = resultData.data;
                    //设置表单值
                    $.page.idM.editform.setData(entity); 
                    operationMaintenancePersonCode = entity.operationMaintenancePersonCode; 

                } else {
                    //Roger 2016/6/1 13:00:02 增加管辖区域
                    mini.alert("该数据不存在！(" + resultData.infoList[0] + ")", undefined, function () {
                        CloseWindow("cancel");
                    });
                };
            }
        }));
    };
};

//查询用户信息
function queryUserInfo(mUserID) {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue(mUserID)) {
        //查询信息
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "sysBasicManage"
            , methodName: "queryMFWUserInfoByMUserID"
            , data: {
                ticket: $.page.ticket
                , mUserID: mUserID
            }
            , success: function (resultData) {
                //判断查询信息成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                    userInfo = resultData.data;
                    //设置表单值
                    $.page.idM.mUserName.setValue(resultData.data.mUserName);
                    $.page.idM.mUserTypeCode.setValue(resultData.data.mUserTypeCode);
                    $.page.idM.mCanBindDeviceCount.setValue(resultData.data.mCanBindDeviceCount);
                    $.page.idM.mIsDis.setValue(resultData.data.mIsDis);
                } else {
                    //Roger 2016/6/1 13:00:02 增加管辖区域
                    mini.alert("该数据不存在！(" + resultData.infoList[0] + ")", undefined, function () {
                        CloseWindow("cancel");
                    });
                };
            }
        }));
    };
};

//插入或者更新
function insertOrUpdate() {
    //表单验证
    $.page.idM.editform.validate();
    //判断表单验证不成功
    if ($.page.idM.editform.isValid() == false) { return; };
    //获取表单数据
    var data = fw.fwObject.FWObjectHelper.emptyToNull($.page.idM.editform.getData());
    //报警接收类型默认为系统消息  界面将不再显示配置内容 直接硬编码
    //1系统消息  2短信  3邮件
    var alarmReceiveTypeCode = "1"; //$.page.idM.alarmReceiveTypeCode.getValue();
    data.alarmReceiveTypeCodeList = fw.fwObject.FWObjectHelper.hasValue(alarmReceiveTypeCode) ? alarmReceiveTypeCode.split(",") : null;
    data.operationMaintenancePersonCode = operationMaintenancePersonCode;
    data.isDis = 0;

    //插入或者更新
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall",
        serviceName: "operationMaintenance",
        methodName: "inserOrUpdateMOperationMaintenancePersonByPersonCode",
        data: {
            ticket: $.page.ticket,
            mEntity: data 
        },
        success: function (resultData) {
            //判断插入或者更新成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                mini.alert("保存成功。", "提示", function () {
                    //关闭窗口
                    CloseWindow("insertOrUpdate");
                });
            } else if (resultData.status == fw.fwData.FWResultStatus.Failure && resultData.infoList.length > 0) {
                var html_warning = '<b>操作失败</b> ';
                html_warning += '<br/>' + resultData.infoList.join(';');
                mini.showTips({
                    content: html_warning,
                    state: 'warning' 
                });
            };
        },
        beforeSend: function () {
            fw.fwButton.fwButtonHelper.addWait($.page.idM.insertOrUpdate);
        },
        complete: function () {
            fw.fwButton.fwButtonHelper.removeWait($.page.idM.insertOrUpdate);
        }
    }));
};


//-----------手机号码验证--------------//
function onMobilePhoneValidation(e) {
    if (e.isValid) {
        if (isMobilePhone(e.value) == false) {
            e.errorText = "必须输入正确的手机号码";
            e.isValid = false;
        };
    };
};
//-----------邮政编码验证--------------//
function onPostCodeValidation(e) {
    if (e.isValid && fw.fwObject.FWObjectHelper.hasValue(e.value)) {
        if (isPostCode(e.value) == false) {
            e.errorText = "必须输入正确的邮政编码";
            e.isValid = false;
        };
    };
};

function isMobilePhone(v) {
    var re = new RegExp("^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$");
    if (re.test(v)) return true;
    return false;
};

function isPostCode(v) {
    var re = new RegExp("^[1-9][0-9]{5}$");
    if (re.test(v)) return true;
    return false;
};　

 
 
