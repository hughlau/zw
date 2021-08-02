//页面初始化
$.page.pageInit = function () {
    $.page.dataSourceSettingsDictionary = {

    };
};

var cacheData = null;

//页面加载
$.page.pageLoad = function () {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.cacheTypeKey) && fw.fwObject.FWObjectHelper.hasValue($.page.params.cacheKey)) {
        //查询信息
        query($.page.params.cacheTypeKey, $.page.params.cacheKey);
    } else {
        mini.alert("该数据不存在！", undefined, function () {
            CloseWindow("cancel");
        });
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
function query(cacheTypeKey, cacheKey) {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue(cacheTypeKey) && fw.fwObject.FWObjectHelper.hasValue(cacheKey)) {
        //查询信息
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "sysManage"
            , methodName: "queryCacheData"
            , data: {
                ticket: $.page.ticket
                , cacheTypeKey: cacheTypeKey
                , cacheKey: cacheKey
            }
            , success: function (resultData) {
                //判断查询信息成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                    cacheData = fw.fwJson.FWJsonHelper.deserializeObject(resultData.data);
                    $.page.idJQ.cacheDataJsonString.val(fw.fwJson.FWJsonHelper.serializeObject(cacheData.data, false, fw.fwJson.FWJsonHelper.JsonFormatMode.ToFormatString));
                } else {
                    mini.alert("该数据不存在！", undefined, function () {
                        CloseWindow("cancel");
                    });
                };
            }
        }));
    };
};

//更新
function onUpdate() {
    //表单验证
    $.page.idM.editform.validate();
    //判断表单验证不成功
    if ($.page.idM.editform.isValid() == false) { return; };
    //获取表单数据
    var data = fw.fwObject.FWObjectHelper.emptyToNull($.page.idM.editform.getData());
    //设置编码
    var cacheDataJsonString = $.page.idJQ.cacheDataJsonString.val();
    if (cacheData != null) {
        cacheData.data = fw.fwJson.FWJsonHelper.deserializeObject(cacheDataJsonString);
    };
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.cacheTypeKey) && fw.fwObject.FWObjectHelper.hasValue($.page.params.cacheKey)) {
        //更新
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "sysManage"
            , methodName: "updateCacheDataByCacheTypeKeyCacheKey"
            , data: {
                ticket: $.page.ticket
                , cacheTypeKey: $.page.params.cacheTypeKey
                , cacheKey: $.page.params.cacheKey
                , cacheDataJsonString: fw.fwJson.FWJsonHelper.serializeObject(cacheData)
            }
            , beforeSend: function () {
                fw.fwButton.fwButtonHelper.addWait($.page.idM.update);
            }
            , success: function (resultData) {
                //判断插入或者更新成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                    //关闭窗口
                    CloseWindow("update");
                } else {
                    mini.alert("保存失败！");
                };
            }
            , complete: function () {
                fw.fwButton.fwButtonHelper.removeWait($.page.idM.update);
            }
        }));
    };
};
