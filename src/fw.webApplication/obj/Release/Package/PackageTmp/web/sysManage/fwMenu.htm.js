//页面初始化
$.page.pageInit = function () {
    $.page.dataSourceSettingsDictionary = {
        "mOpenTypeCode": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "FWOpenType" }
        }
        , "mLayoutHorizontalAlignment": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "FWHorizontalAlignment" }
        }
        , "mLayoutVerticalAlignment": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "FWVerticalAlignment" }
        }
    };
};

var mMenuTypeCode = null;
var mPMenuCode = null;

//页面加载
$.page.pageLoad = function () {
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mMenuTypeCode)) {
        mMenuTypeCode = $.page.params.mMenuTypeCode;
    };
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mPMenuCode)) {
        mPMenuCode = $.page.params.mPMenuCode;
    };

    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mMenuCode)) {
        //查询信息
        query($.page.params.mMenuCode);
    };

    var data, params;
    data = {
        ticket: $.page.ticket
        , selectFileText: "添加图片"
        , enterCallback: "onMIconEnterCallback"
        , enterClearCallback: "onMIconEnterClearCallback"
        , uploadInfoSelector: "#mIconUploadInfo"
        , maxLength: 1024 * 1024 * 4
        , extensionType: fw.fwData.FWFileExtensionType.Image
        , pluginType: 1
    }; 
    var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fileUpload.htm", $.page.webSiteRootUrl), data);

    window.open(pageUrl, "mIconUploadIframe");
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
function onMMenuCodeSelect() {
    //参数
    var data = {
        ticket: $.page.ticket
        , selectType: fw.fwData.FWSelectType.Single
        , selectCallback: "onMMenuCodeSelectCallback"
        , selectClearCallback: "onMMenuCodeSelectClearCallback"
        , mBllModuleCode: $.page.idM.mBllModuleCode.getValue()
        , keyword: $.page.idM.mMenuCode.getText()
    };
    //参数序列化 
    var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwMenuList.htm", $.page.webSiteRootUrl), data); 

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
function onMMenuCodeSelectCallback(entity) {
    if (fw.fwObject.FWObjectHelper.hasValue(entity)) {
        $.page.idM.mBllModuleCode.setValue(entity.mBllModuleCode);
        $.page.idM.mMenuCode.setValue(entity.mMenuCode);
        $.page.idM.mMenuCode.setText(entity.mMenuName);
    };
};
//选择清除功能后回调
function onMMenuCodeSelectClearCallback() {
    $.page.idM.mBllModuleCode.setValue("");
    $.page.idM.mMenuCode.setValue("");
    $.page.idM.mMenuCode.setText("");
};

//打开选择图片窗口
function mIconUrl_onbuttonclick() {
    //参数
    var data = {
        ticket: $.page.ticket
        , extensionType: fw.fwData.FWFileExtensionType.Image
        , uploadCount: 1
        , maxLength: 1024 * 1024 * 4
        , enterCallback: "mIconUrlEnterCallback"
    };
    //参数序列化 
    var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fileUpload.htm", $.page.webSiteRootUrl), data); 

    //打开选择用户窗口
    mini.open({
        url: pageUrl
        , title: "选择图片"
        , width: 512
        , height: 256
        , onload: function () {
            //var iframe = this.getIFrameEl();
            //iframe.contentWindow;
        }
        , ondestroy: function (action) {
        }
    });
};
function mIconUrlEnterCallback(entity) {
    if (fw.fwObject.FWObjectHelper.hasValue(entity)) {
        $.page.idM.mIconUrl.setValue(entity.filePath);
        $.page.idM.mIconUrl.setText(entity.filePath);
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
function query(mMenuCode) {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue(mMenuCode)) {
        //查询信息
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "sysManage"
            , methodName: "queryMFWMenuByMMenuCode"
            , data: {
                ticket: $.page.ticket
                , mMenuCode: mMenuCode
            }
            , success: function (resultData) {
                //判断查询信息成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                    var entity = resultData.data;
                    //设置表单值
                    $.page.idM.editform.setData(entity);
                    mMenuTypeCode = entity.mMenuTypeCode;
                    mPMenuCode = entity.mPMenuCode;
                    fw.fwFileUpload.fwFileUploadHelper.insertFileInfo($.page.idJQ.mIconUploadInfo, { extension: ".png", fileUrl: resultData.data.mIconUrl + "&newGuid=" + fw.guid() }, onMIconEnterClearCallback);
                } else {
                    mini.alert("该数据不存在！", undefined, function () {
                        CloseWindow("cancel");
                    });
                };
            }
        }));
    };
};

function onMIconEnterCallback(entity) {
    $.page.idM.mIconFileFingerprint.setValue(entity.fileFingerprint);
    $.page.idM.mIconRelativePath.setValue(entity.filePath);
    $.page.idM.mIconAction.setValue(fw.fwData.FWDBAction.Update);
};

function onMIconEnterClearCallback() {
    $.page.idM.mIconFileFingerprint.setValue("");
    $.page.idM.mIconRelativePath.setValue("");
    $.page.idM.mIconAction.setValue(fw.fwData.FWDBAction.Delete);
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
    data.mMenuTypeCode = mMenuTypeCode;
    data.mPMenuCode = mPMenuCode;
    data.mMenuCode = $.page.params.mMenuCode;
    //插入或者更新
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "insertOrUpdateMFWMenuByMMenuCode"
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
