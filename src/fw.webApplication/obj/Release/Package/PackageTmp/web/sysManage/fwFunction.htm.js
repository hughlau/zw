//页面初始化
$.page.pageInit = function () {
    $.page.dataSourceSettingsDictionary = {
        "mBllModuleCode": {
            dataSourceName: "sysManage.getDictionaryMFWBllModule"
            , dataSourceParams: { ticket: $.page.ticket }
        }
    };
};

//页面加载
$.page.pageLoad = function () {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mFunctionCode)) {
        //查询信息
        query($.page.params.mFunctionCode);
    };
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.action)) {
        var actionName = $.page.params.action;
        if (actionName != 'insert') {
            $.page.idM.mMethodName.enabled = false;
        }
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
function query(mFunctionCode) {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue(mFunctionCode)) {
        //查询信息
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "sysManage"
            , methodName: "queryMFWFunctionByMFunctionCode"
            , data: {
                ticket: $.page.ticket
                , mFunctionCode: mFunctionCode
            }
            , success: function (resultData) {
                //判断查询信息成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                    //转化时间格式
                    resultData.data.mCallTime = fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(resultData.data.mCallTime));
                    //从备注中获取方法名
                    resultData.data.mMethodName = resultData.data.mRem;
                    //设置表单值
                    $.page.idM.editform.setData(resultData.data);
                } else {
                    mini.alert("该数据不存在！", undefined, function () {
                        CloseWindow("cancel");
                    });
                };
            }
        }));
    };
};

//插入或者更新
function onInsertOrUpdate() {
    //表单验证
    $.page.idM.editform.validate();
    //判断表单验证不成功
    if ($.page.idM.editform.isValid() == false) { return; };
    //获取表单数据
    var data = fw.fwObject.FWObjectHelper.emptyToNull($.page.idM.editform.getData());
    //设置编码
    data.mFunctionCode = $.page.params.mFunctionCode;
    //插入或者更新
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "insertOrUpdateMFWFunctionByMFunctionCode"
        , data: {
            ticket: $.page.ticket
            , mEntity: data
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
                mini.alert("保存失败！");
            };
        }
        , complete: function () {
            fw.fwButton.fwButtonHelper.removeWait($.page.idM.insertOrUpdate);
        }
    }));
};
