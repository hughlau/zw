var mPRoleCode = null;

//页面加载
$.page.pageLoad = function () {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mDataID)) {
        //查询信息
        query($.page.params.mDataID);
    };
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
                    //1是0否
                    var mIsDis = (resultData.data.mIsDis == 1 ? "是" : "否");
                    $("#spanIsDis").html(mIsDis);
                } else {
                    mini.alert("该数据不存在！", undefined, function () {
                        CloseWindow("cancel");
                    });
                };
            }
        }));
    };
};
