
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
    var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwDictionaryTypeSelect.htm", $.page.webSiteRootUrl), data);
    window.open(pageUrl, "iframeFWDictionaryTypeSelect");
};

//单选回调
function mDictionaryTypeCodeChangedCallback(entity) {
    var url;
    if (fw.fwObject.FWObjectHelper.hasValue(entity) && fw.fwObject.FWObjectHelper.hasValue(entity.mDictionaryTypeCode)) {
        var data = {
            ticket: $.page.ticket
            , mDictionaryTypeCode: entity.mDictionaryTypeCode
        };
         url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwDictionaryListSelect.htm", $.page.webSiteRootUrl), data);  
    } else {
        url = $.page.getAboutUrl();
    };
    window.open(url, "iframeFWDictionaryListSelect");
};