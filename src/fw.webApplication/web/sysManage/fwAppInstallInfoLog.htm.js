//页面初始化
$.page.pageInit = function () {
};

//页面加载
$.page.pageLoad = function () {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mAppInstallInfoLogCode)) {
        //查询信息
        query($.page.params.mAppInstallInfoLogCode);
    };
};

//查询信息
function query(mAppInstallInfoLogCode) {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue(mAppInstallInfoLogCode)) {
        //查询信息
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "sysManage"
            , methodName: "queryMFWAppInstallInfoLogByMAppInstallInfoLogCode"
            , data: {
                ticket: $.page.ticket
                , mAppInstallInfoLogCode: mAppInstallInfoLogCode
            }
            , success: function (resultData) {
                //判断查询信息成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                    var entity = resultData.data;
                    //设置表单值
                    $("#labmCallTime").text((fw.fwObject.FWObjectHelper.hasValue(entity.mCallTime)) ? fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(entity.mCallTime)) : "--");
                    $("#labmStatus").text(entity.mStatus == "0" ? "调用失败" : "调用成功");
                    $("#labmAppName").text(entity.mAppName);
                    $("#labmAppRootDirectory").text(entity.mAppRootDirectory);
                    var html = "";
                    switch (entity.mAppInstallStatus) {
                        case "-1":
                            html = "未检查";
                            break;
                        case "0":
                            html = "<label style=\"color:Red\">安装失败</label>";
                            break;
                        case "1":
                            html = "<label style=\"color:Green\">安装成功</label>";
                            break;
                        case "2":
                            html = "<label style=\"color:Blue\">安装未启用</label>";
                            break;
                        default:
                            html = "--";
                            break;
                    }
                    $("#labmAppInstallStatus").html(html);
                    $("#divMAppInstallInfo").html(entity.mAppInstallInfo);
                    $("#divmInfos").html(entity.mInfos);
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