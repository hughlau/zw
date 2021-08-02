//页面加载
$.page.pageLoad = function () {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mUserID)) {
        //查询信息
        query($.page.params.mUserID);
    };
};

//查询信息
function query(mUserID) {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue(mUserID)) {
        //查询信息
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "sysManage"
            , methodName: "queryMFWUserLoginByMUserID"
            , data: {
                ticket: $.page.ticket
                , mUserID: mUserID
            }
            , success: function (resultData) {
                //判断查询信息成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                    //转化时间格式
                    resultData.data.mCallTime = fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(resultData.data.mCallTime));
                    //1是0否
                    var mIsDis = (resultData.data.mIsDis == 1 ? "是" : "否");
                    $("#spanIsDis").html(mIsDis);
                    //设置表单值
                    $.page.idM.editform.setData(resultData.data);
                };
            }
        }));
    };
};