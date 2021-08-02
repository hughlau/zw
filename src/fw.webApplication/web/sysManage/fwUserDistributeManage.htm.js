//页面加载
$.page.pageLoad = function () {
    var tabs = $.page.idM.tabs1;
    var data = {
        ticket: $.page.ticket
    };

    var menuData = [{ "title": "APP用户下发", "url": "web/sysManage/fwUserDistributeByApp.htm" }
                   , { "title": "用户下发", "url": "web/sysManage/fwUserDistributeByUser.htm" }
                   , { "title": "高级功能", "url": "web/sysManage/fwUserDistributeByAdvanced.htm"}];

    $.each(menuData, function (i, n) {
        var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl(n.url, $.page.webSiteRootUrl), data);
        var tab = { title: n.title, url: url };
        tabs.addTab(tab);
        if (i == 0) {
            tabs.activeTab(tab);
        };
    });
};