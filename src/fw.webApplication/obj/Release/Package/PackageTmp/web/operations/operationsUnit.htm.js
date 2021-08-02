var photourl = "";
//页面初始化
$.page.pageInit = function () {
    $.page.dataSourceSettingsDictionary = {
        "cantonCode": {
            dataSourceName: "sysBasicManage.getCantonDicData"
            , dataSourceParams: {  }
        } 
    };
};
var operationMaintenanceUnitCode = undefined;
var conditionData = undefined;
var userInfo = {}; //用户信息 
//页面加载
$.page.pageLoad = function () {
    //operationMaintenanceUnitCode = '88f68bb6-572a-471f-b6c6-d737fd74675d';
    
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.operationMaintenanceUnitCode)) {
        operationMaintenanceUnitCode = $.page.params.operationMaintenanceUnitCode;
        //查询信息
        query(operationMaintenanceUnitCode);

    };
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.action) && $.page.params.action == 'query') {
        labelModel();
        $.page.idJQ.insertOrUpdate.hide();
    };

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
function query(operationMaintenanceUnitCode) {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue(operationMaintenanceUnitCode)) {
        //查询信息
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "operationMaintenance"
            , methodName: "queryByMOperationMaintenanceUnitCode"
            , data: {
                ticket: $.page.ticket
                , mOperationMaintenanceUnitCode: operationMaintenanceUnitCode
            }
            , success: function (resultData) {
                //判断查询信息成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                    var entity = resultData.data;
                    //设置表单值
                    $.page.idM.editform.setData(entity);
                    operationMaintenanceUnitCode = entity.operationMaintenanceUnitCode; 
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
    data.operationMaintenanceUnitCode = operationMaintenanceUnitCode;

    $.extend(userInfo, {
        mUserName: data.mUserName,
        mUserTypeCode: data.mUserTypeCode,
        mCanBindDeviceCount: data.mCanBindDeviceCount,
        mIsDis: data.mIsDis
    });
    data.mFWUserInfo = userInfo; //帐户信息
    data.photoUrl = photourl;

    //插入或者更新
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall",
        serviceName: "operationMaintenance",
        methodName: "inserOrUpdateByMOperationMaintenanceUnitCode",
        data: {
            ticket: $.page.ticket,
            mEntity: data
        },
        success: function (resultData) {
            //判断插入或者更新成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                //关闭窗口
                CloseWindow("insertOrUpdate");

            } else {
                var html_warning = '<b>操作失败</b>';
                if (resultData.status == fw.fwData.FWResultStatus.Failure && resultData.infoList.length > 0) {

                    //获取warning信息
                    var subData='';
                    subData = $.Enumerable.From(resultData.infoList).Where("$.indexOf('warning')>-1").ToArray().forEach(function (i) {
                        html_warning += '<br/>' + i.substr(i.indexOf('warning') + 8);
                    });
                    //html_warning+='<br/>原因 '+html_warning;
                }
                mini.showTips({
                    content: html_warning,
                    state: 'warning', 
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

 