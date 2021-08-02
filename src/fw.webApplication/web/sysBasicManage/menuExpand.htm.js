var mMenuCode = "";
//var instructionsEditor = undefined;
//var questionsEditor = undefined;
//var attachmentURL = null;
//var uploadFolderPath = "file://192.168.2.230/业务协同/";
//var attachmentName = "";
$.page.pageInit = function () {
//    //获取设置值
//    $.page.appSettings = {
//        "uploadFolderPath": uploadFolderPath
//    };
};
$.page.pageLoad = function () {
//    instructionsEditor = UE.getEditor('instructionsEditor');
//    questionsEditor = UE.getEditor('questionsEditor');
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mMenuCode)) {
        mMenuCode = $.page.params.mMenuCode;
    }
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysBasicManage"
        , methodName: "queryMMenuEx"
        , data: {
            ticket: $.page.ticket
            , mMenuCode: mMenuCode
        }
        , success: function (resultData) {
            //判断成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                $.page.idM.editform.setData(resultData.data);
//                instructionsEditor.setContent(resultData.data.instructions);
//                questionsEditor.setContent(resultData.data.questions);
//                if (fw.fwObject.FWObjectHelper.hasValue(resultData.data.attachmentURL)) {
//                    $("#attachmentName").text(resultData.data.attachmentName);
//                    $("#uploadFileHas").show();

//                }
            };
        }
    }));
};
function insertOrUpdate() {
//    var instructionsEditorContent = instructionsEditor.getContent();
//    var questionsEditorContent = questionsEditor.getContent();
    var data = $.page.idM.editform.getData();
//    data.funDescription = $.page.idM.funDescription.value;
//    data.instructions = instructionsEditorContent;
//    data.questions = questionsEditorContent;
//    data.attachmentName = attachmentName;
//    data.attachmentURL = attachmentURL;
    data.menuCode = mMenuCode;
    data.pageID = "";
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysBasicManage"
        , methodName: "insertOrUpdateMMenuExByMenuCode"
        , data: {
            ticket: $.page.ticket
            , mEntity: data
        }
        , success: function (resultData) {
            //判断成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                mini.alert("添加成功！");
                CloseWindow("insertOrUpdate");
            };
        }
    }));

}
//取消
function onCancel() {
    //关闭窗口
    CloseWindow("cancel");
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
 
function startUpload() {
    var data = { ticket: $.page.ticket, enterCallback: "enterCallback" };
    var pageParam = { url: "web/licenseInfo/fileUpload.htm", showMaxButton: false, showMinButton: false, width: "420", height: "241", allowResize: false, title: "文件上传" };
    $.publicMethod.openPage(data, pageParam);
}
//回调函数
function enterCallback(s) {
    $("#msg").show();
    attachmentURL = $.page.webSiteRootUrl + s[0].filePath;
    attachmentName = s[0].name;
}