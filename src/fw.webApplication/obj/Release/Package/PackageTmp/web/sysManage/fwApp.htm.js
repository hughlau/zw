//页面初始化
$.page.pageInit = function () {
    //        $.page.dataSourceSettingsDictionary = {
    //            "mDeviceTypeCode": {
    //                dataSourceName: "sysManage.getDictionaryMFWDeviceType"
    //            , dataSourceParams: {}
    //            }
    //        };
};

//页面加载
$.page.pageLoad = function () {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mDataID)) {
        //查询信息
        query($.page.params.mDataID);
    };
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.action)) {
        var action = $.page.params.action;
        if (action == "query") {
            $(".mini-textbox,.mini-checkbox").hide();
            $("#labmAppCode,#labmAppName,#labmAppRootDirectory,#labmIsDis,#labmRemark").show();
            $("#divButton").hide();
        } else if (action == "insert" || action == "update") {
            $("#trInstallStatus,#trInstallInfo").hide();
        };
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
            , methodName: "queryMFWAppByMDataID"
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
                    $("#labmAppCode").text(entity.mAppCode);
                    $("#labmAppName").text(entity.mAppName);
                    $("#labmAppRootDirectory").text(entity.mAppRootDirectory);
                    $("#labmIsDis").text(entity.mIsDis == "0" ? "启用" : "停用");
                    $("#labmRemark").text(entity.mRemark);
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
                    $("#labMAppInstallStatus").html(html);
                    $("#divMAppInstallInfo").html(entity.mAppInstallInfo);
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

//插入或者更新
function buttonSave() {
    //表单验证
    $.page.idM.editform.validate();
    //判断表单验证不成功
    if ($.page.idM.editform.isValid() == false) { return; };
    //获取表单数据
    var data = fw.fwObject.FWObjectHelper.emptyToNull($.page.idM.editform.getData());
    //设置编码
    data.mDataID = $.page.params.mDataID;
    //插入或者更新
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
                , serviceName: "sysManage"
                , methodName: "insertOrUpdateMFWAppByMDataID"
                , data: {
                    ticket: $.page.ticket
                    , mEntity: data
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
    }));
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