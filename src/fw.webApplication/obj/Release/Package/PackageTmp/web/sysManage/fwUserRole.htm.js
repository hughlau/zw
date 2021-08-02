//页面初始化
$.page.pageInit = function () {
    $.page.dataSourceSettingsDictionary = {

    };
};

var mPRoleCode = null;

//页面加载
$.page.pageLoad = function () {
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mPRoleCode)) {
        mPRoleCode = $.page.params.mPRoleCode;
    };

    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mDataID)) {
        //查询信息
        query($.page.params.mDataID);
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
function query(mDataID) {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue(mDataID)) {
        //查询信息
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "sysManage"
            , methodName: "queryMFWUserRoleByMDataID"
            , data: {
                ticket: $.page.ticket
                , mDataID: mDataID
            }
            , success: function (resultData) {
                //判断查询信息成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                    var entity = resultData.data;
                    //设置表单值
                    $.page.idM.editform.setData(entity);
                    mPRoleCode = entity.mPRoleCode;
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
    data.mPRoleCode = mPRoleCode;
    data.mDataID = $.page.params.mDataID;
    //插入或者更新
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "insertOrUpdateMFWUserRoleByMDataID"
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
