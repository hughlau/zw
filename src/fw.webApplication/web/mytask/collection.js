
//页面初始化
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
    };
};

//页面加载
$.page.pageLoad = function () {
    var data = {
        ticket: $.page.ticket
        , onSelectionChangedCallback: "mDictionaryTypeCodeChangedCallback"
    }; 
    var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/mytask/collectionCate.htm", $.page.webSiteRootUrl), data); 
    window.open(pageUrl, "iframeFWDictionaryTypeList");
};

//单选回调
function mDictionaryTypeCodeChangedCallback(entity) {
    var url;
    if (fw.fwObject.FWObjectHelper.hasValue(entity) && fw.fwObject.FWObjectHelper.hasValue(entity.cateCode)) {
        var data = {
            ticket: $.page.ticket
            , cateCode: entity.cateCode
        }; 
        url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/mytask/collectionData.htm", $.page.webSiteRootUrl), data);
    } else {
        url = $.page.getAboutUrl();
    };
    window.open(url, "iframeFWDictionaryList");
};


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