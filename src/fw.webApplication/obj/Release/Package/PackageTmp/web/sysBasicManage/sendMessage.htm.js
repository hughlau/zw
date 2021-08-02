//页面初始化
$.page.pageInit = function () {
    $.page.dataSourceSettingsDictionary = {
        "mMessageSendTypeCodes": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "FWMessageSendType" }
        }
    };
};

//页面加载
$.page.pageLoad = function () {
    $.page.params.mUserIDList = fw.fwJson.FWJsonHelper.deserializeObject($.page.params.mUserIDList);

    var messageTemplateDataSource = [{
        name: "[推送]：消息弹框"
        , codes: fw.m.sysManage.data.FWMessageSendTypeCode.Push
        , templateData: {
            title: "标题"
            , protocol: "alert"
            , data: "需要弹出的消息"
        }
    }, {
        name: "[推送]：新版本更新"
        , codes: fw.m.sysManage.data.FWMessageSendTypeCode.Push
        , templateData: {
            title: "标题"
            , protocol: "newVersion"
            , data: {
                "versionNumber": "1.3.1"
                , "iosUrl": "http://192.168.252.11:60001/AppManage/AppConfig/ipa/kpisystem/kpisystem.html"
                , "androidUrl": "http://58.210.204.106:60001/8006/web/uploadfile/phonegap_shencaijf/Android/jfxt.apk"
            }
        }
    }, {
        name: "[所有]：消息"
        , codes: fw.m.sysManage.data.FWMessageSendTypeCode.SMS + "," + fw.m.sysManage.data.FWMessageSendTypeCode.Push + "," + fw.m.sysManage.data.FWMessageSendTypeCode.EMail
        , templateData: {
            title: "标题"
            , content: "内容"
            , protocol: ""
            , data: ""
        }
    }];
    $.page.idM.messageTemplate.setData(messageTemplateDataSource);

    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mUserIDList)) {
        //查询信息
        //query($.page.params.mUserIDList);
    };
};

function messageTemplate_onvaluechanged(e) {
    var entity = $.page.idM.messageTemplate.getSelected();
    entity.templateData.mMessageSendTypeCodes = entity.codes;
    entity.templateData.dataJson = fw.fwJson.FWJsonHelper.serializeObject(entity.templateData.data, false, fw.fwJson.FWJsonHelper.JsonFormatMode.ToFormatString);
    $.page.idM.editform.setData(entity.templateData);
};

//查询信息
function query(mUserIDList) {
    //判断传入编码
    if (!fw.fwObject.FWObjectHelper.hasValue(mUserIDList)) {

    };
};

//插入或者更新
function onSendMessage() {
    //表单验证
    $.page.idM.editform.validate();
    //判断表单验证不成功
    if ($.page.idM.editform.isValid() == false) { return; };
    //获取表单数据
    var data = fw.fwObject.FWObjectHelper.emptyToNull($.page.idM.editform.getData());

    //插入或者更新
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysBasicManage"
        , methodName: "sendMessage"
        , data: {
            ticket: $.page.ticket
            , mUserIDList: $.page.params.mUserIDList
            , mMessageSendTypeCodeList: fw.fwString.FWStringHelper.toArray(data.mMessageSendTypeCodes, ",")
            , entity: data
        }
        , success: function (resultData) {
            //判断插入或者更新成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                //关闭窗口
                CloseWindow("insertOrUpdate");
            } else {
                mini.alert("发送失败！");
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