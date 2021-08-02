//页面加载
$.page.pageLoad = function () {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mAppLoginLogCode)) {
        //查询信息
        query($.page.params.mAppLoginLogCode);
    };
};

//查询信息
function query(mAppLoginLogCode) {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue(mAppLoginLogCode)) {
        //查询信息
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "sysManage"
            , methodName: "queryMFWAppLoginLogByMAppLoginLogCode"
            , data: {
                ticket: $.page.ticket
                , mAppLoginLogCode: mAppLoginLogCode
            }
            , success: function (resultData) {
                //判断查询信息成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                    var entity = resultData.data;
                    //设置表单值
                    $.page.idM.editform.setData(entity);
                    var html = "";
                    switch (entity.mStatus) {
                        case "-9":
                            html = "App 未注册";
                            break;
                        case "-3":
                            html = "出错";
                            break;
                        case "-2":
                            html = "用户名失效";
                            break;
                        case "-1":
                            html = "凭证失效";
                            break;
                        case "0":
                            html = "未登入";
                            break;
                        case "1":
                            html = "已登录";
                            break;
                        default:
                            html = "--";
                            break;
                    }
                    $("#mStatus").text(html);
                    $("#mUserName").text(entity.mUserName);
                    $("#mCallTime").text(fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(entity.mCallTime), "yyyy-MM-dd HH:mm:ss"));
                    $("#mUseTime").text(entity.mUseTime);
                    $("#mAppCode").text(entity.mAppCode);
                    $("#mAppName").text(entity.mAppName);
                    $("#mIPAddress").text(entity.mIPAddress);
                    $("#mPort").text(entity.mPort);
                }
                /*else {
                mini.alert("该数据不存在！", undefined, function () {
                CloseWindow("cancel");
                });
                };*/
            }
        }));
    };
};