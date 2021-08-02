//页面初始化
$.page.pageInit = function () {
    $.page.dataSourceSettingsDictionary = {
        "mStatus": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "FWResultStatus" }
        }
        , "mBllModuleCode": {
            dataSourceName: "sysManage.getDictionaryMFWBllModule"
            , dataSourceParams: { ticket: $.page.ticket }
        }
    };
};

//页面加载
$.page.pageLoad = function () {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mSystemLogCode)) {
        //查询信息
        query($.page.params.mSystemLogCode);
    };
};

//打开选择用户窗口
function onMUserIDSelect() {
    //参数
    var data = {
        ticket: $.page.ticket
        , selectType: fw.fwData.FWSelectType.Single
        , selectCallback: "onMUserIDSelectCallback"
        , selectClearCallback: "onMUserIDSelectClearCallback"
        //, keyword: $.page.idM.mUserID.getText()
    };
    //参数序列化 
    var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwUserLoginList.htm", $.page.webSiteRootUrl), data); 
        
    //打开选择用户窗口
    mini.open({
        url: pageUrl
        , title: "选择列表"
        , width: 650
        , height: 380
        , onload: function () {
            //var iframe = this.getIFrameEl();
            //iframe.contentWindow;
        }
        , ondestroy: function (action) {
        }
    });
};
//选择用户完成后回调
function onMUserIDSelectCallback(entity) {
    if (fw.fwObject.FWObjectHelper.hasValue(entity)) {
        $.page.idM.mUserID.setValue(entity.mUserID);
        $.page.idM.mUserID.setText(entity.mUserName);
    };
};
//选择清除用户后回调
function onMUserIDSelectClearCallback() {
    $.page.idM.mUserID.setValue("");
    $.page.idM.mUserID.setText("");
};
//打开选择功能窗口
function onMFunctionCodeSelect() {
    //参数
    var data = {
        ticket: $.page.ticket
        , selectType: fw.fwData.FWSelectType.Single
        , selectCallback: "onMFunctionCodeSelectCallback"
        , selectClearCallback: "onMFunctionCodeSelectClearCallback"
        , mBllModuleCode: $.page.idM.mBllModuleCode.getValue()
        , keyword: $.page.idM.mFunctionCode.getText()
    };
    //参数序列化 
    var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwFunctionList.htm", $.page.webSiteRootUrl), data); 
        
    //打开选择用户窗口
    mini.open({
        url: pageUrl
        , title: "选择列表"
        , width: 650
        , height: 380
        , onload: function () {
            //var iframe = this.getIFrameEl();
            //iframe.contentWindow;
        }
        , ondestroy: function (action) {
        }
    });
};
//选择功能完成后回调
function onMFunctionCodeSelectCallback(entity) {
    if (fw.fwObject.FWObjectHelper.hasValue(entity)) {
        $.page.idM.mBllModuleCode.setValue(entity.mBllModuleCode);
        $.page.idM.mFunctionCode.setValue(entity.mFunctionCode);
        $.page.idM.mFunctionCode.setText(entity.mFunctionName);
    };
};
//选择清除功能后回调
function onMFunctionCodeSelectClearCallback() {
    $.page.idM.mBllModuleCode.setValue("");
    $.page.idM.mFunctionCode.setValue("");
    $.page.idM.mFunctionCode.setText("");
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
function query(mSystemLogCode) {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue(mSystemLogCode)) {
        //查询信息
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "sysManage"
            , methodName: "queryMFWSystemLogByMSystemLogCode"
            , data: {
                ticket: $.page.ticket
                , mSystemLogCode: mSystemLogCode
            }
            , success: function (resultData) {
                //判断查询信息成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                    var entity = resultData.data;
                    //转化时间格式
                    entity.mCallTime = fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(entity.mCallTime));
                    //设置表单值
                    $.page.idM.editform.setData(entity);
                    $.page.idM.mUserID.setText(entity.mUserName);
                    $.page.idM.mFunctionCode.setText(entity.mFunctionName);
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
function insertOrUpdate() {
    //表单验证
    $.page.idM.editform.validate();
    //判断表单验证不成功
    if ($.page.idM.editform.isValid() == false) { return; };
    //获取表单数据
    var data = fw.fwObject.FWObjectHelper.emptyToNull($.page.idM.editform.getData());
    //设置编码
    data.mSystemLogCode = $.page.params.mSystemLogCode;
    //插入或者更新
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "insertOrUpdateMFWSystemLogByMSystemLogCode"
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
