var datagrid1JQ = null;

$.page.pageInit = function () {
    $.page.dataSourceSettingsDictionary = {
        "project": {
            dataSourceName: "basicInfo.queryProject"
            , dataSourceParams: { ticket: $.page.ticket }
        }
    };
};

$.page.pageLoad = function () {

    var excelpath = fw.fwUrl.FWUrlHelper.getAbsoluteUrl("resources/office/monitorInfoImportTemplate.xlsx", $.page.webSiteRootUrl)
    $.page.idJQ.excel.attr('href', excelpath); 
};

//数据导入
function upload() {
    var miniOpenSettings = {
        url: fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/fileUpload/fileUpload.htm", $.page.webSiteRootUrl),
        title: "选择附件",
        width: 500,
        height: 325
    };
    $.pageCustomer.openMiniUIPage(miniOpenSettings, {
        enterCallback: "enterCallback",
        uploadCount: 1,
        extensions: "xls,xlsx",
        maxLength: 1024 * 1024 * 20
    });
};
//文件上传回调函数
function enterCallback(e) {
    //跨页面对象必须先克隆后在使用
    e = mini.clone(e); 
    $.page.idM.filePath.setValue(e.filePath);
    $.page.idM.fileName.setValue(e.md5);
    $.page.idM.fileDisplayName.setValue(e.name);
    $.page.idM.fileExtension.setValue(e.extension);
    $.page.idJQ.uploadFile.html(e.name); 
};


function onRead() {
    if ($.page.isNullOrEmpty($.page.idM.filePath.getValue())) {
        $.page.showTips({ content: "请上传文件!<br>", state: "warning" });
        return;
    }
    var isupdate="false";
//    mini.confirm("如果存在相同时间的监测数据，是否覆盖？", "是？",
//        function (action) {
//            if (action == "ok") {
//                isupdate="true";
//            }
    //            });
    //importDataByExcel
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall",
        serviceName: "basicInfo",
        methodName: "importMonitorSiteDataByExcel",
        data: {
            ticket: $.page.ticket, filePath: $.page.idM.filePath.getValue()
            , projectNo: $.page.idM.project.getValue(), isupdate: isupdate
        },
        success: function (resultData) {
            if (resultData.status == fw.fwData.FWResultStatus.Success) {
                $.page.showTips({ content: "导入成功!<br>", state: "success", timeout: 200000 });
                //CloseWindow('ok');
            }
            else //Roger 2016/6/1 13:00:02 增加管辖区域
            {
                var erroInfo = resultData.infoList;
               // mini.alert(erroInfo);
                $.page.showTips({ content: "错误信息!<br>" + erroInfo, state: "danger",timeout:200000 });
            };
        }
    }));
};

//function onDownloadTemplate() {
//    var data = { ticket: $.page.ticket, enterCallback: "enterCallback" };
//    var pageParam = { url: "web/sysBasicManage/downLoad/templateFile/templateFiles.htm", showMaxButton: false, showMinButton: false, width: "600", height: "300", allowResize: false, title: "模板下载" };
//    $.page.openPage(data, pageParam);
//}; 

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

 