
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
        , onSelectionChangedCallback: "cacheTypeKeyChangedCallback"
    }; 
    var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/cacheTypeList.htm", $.page.webSiteRootUrl), data);
    window.open(pageUrl, "iframeCacheTypeList");
};

//单选回调
function cacheTypeKeyChangedCallback(entity) {
    var url;
    if (fw.fwObject.FWObjectHelper.hasValue(entity) && fw.fwObject.FWObjectHelper.hasValue(entity.key)) {
        var data = {
            ticket: $.page.ticket
            , cacheTypeKey: entity.key
        };
        url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/cacheDataList.htm", $.page.webSiteRootUrl), data); 
    } else {
        url = $.page.getAboutUrl();
    };
    window.open(url, "iframeCacheDataList");
};


//删除选中项
function del(cacheTypeKeyList) {
    mini.confirm("确定删除记录？", "确定？",
        function (action) {
            if (action == "ok") {
                //删除
                $.page.ajax($.page.getAjaxSettings({
                    serviceType: "crossDomainCall"
                    , serviceName: "sysManage"
                    , methodName: "deleteCache"
                    , data: {
                        ticket: $.page.ticket
                    }
                    , beforeSend: function () {
                        fw.fwButton.fwButtonHelper.addWait($.page.idM.del);
                    }
                    , success: function (resultData) {
                        //判断删除成功
                        if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                            //datagrid加载数据
                            window.location.reload();
                        };
                    }
                    , complete: function () {
                        fw.fwButton.fwButtonHelper.removeWait($.page.idM.del);
                    }
                }));
            };
        }
    );
};