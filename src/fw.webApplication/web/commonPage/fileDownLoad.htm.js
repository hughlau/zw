//页面初始化
$.page.pageInit = function () { };

//页面加载
$.page.pageLoad = function () {

    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.filePath)) {
        if (navigator.userAgent.indexOf("Chrome") > -1) {
            var fileUrl = fw.fwUrl.FWUrlHelper.getParams($.page.params.filePath).fileUrl;
            var fileName = fw.fwUrl.FWUrlHelper.getParams($.page.params.filePath).fileName;
            $("#filepath").attr("href", fileUrl);
            $("#filepath").attr("download", fileName);
        } else {
            $("#filepath").attr("href", $.page.params.filePath);
        }
    }

};

function closeWindow(action) {
    if (window.CloseOwnerWindow) {
        return window.CloseOwnerWindow(action)
    }
    else { window.close() };
};

function onOk() {
    closeWindow("ok");
}; 










