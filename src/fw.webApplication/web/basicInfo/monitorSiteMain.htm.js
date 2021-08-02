var monitorSiteCode = undefined;
var tabIndex = 0;
var pageTabs = [];
var pageTabsConfig = [
    {
        name: "ws", config: {
            _id: '1',
            mMenuName: '工况图',
            mUrl: 'web/basicInfo/monitorSiteWorkingStatus.htm'
        }
    },
    {
        name: "bi", config: {
            _id: '2',
            //monitorSiteCode: monitorSiteCode,
            mMenuName: '基础信息',
            mUrl: 'web/basicInfo/monitorSite.htm'
        }
    }
];

$.page.pageInit = function () {
};
$.page.pageLoad = function () {

    //monitorSiteCode = "00EDDEA9-8B85-41AE-B69F-0924DD6EC4E8";
    //点位信息
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.monitorSiteCode)) {
        monitorSiteCode = $.page.params.monitorSiteCode;
    };

    //tab选项顺序
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.pageTabs)) {
        pageTabs = $.page.params.pageTabs.split(',');
        
    } else {
        pageTabs = ["ws", "bi"];
    };
    //工况图

    for (var i = 0; i < pageTabs.length; i++) {
        for (var j = 0; j < pageTabsConfig.length; j++) {
            if (pageTabsConfig[j].name == pageTabs[i]) {
                showTab(pageTabsConfig[j].config);
            };
        };
    }; 
    $.page.idM.mainTabs.activeTab($.page.idM.mainTabs.getTab(0));
};

//显示Tab
function showTab(node) {
    //定义tab的id
    var id = "tab$" + node._id;
    //获取tab
    var tab = $.page.idM.mainTabs.getTab(id);
    tab = {};
    tab._nodeid = node._id;
    tab.name = id;
    tab.title = node.mMenuName;
    tab.showCloseButton = false;
    //参数
    var data = {
        ticket: $.page.ticket,
        monitorSiteCode: monitorSiteCode
    };
    tab.url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl(node.mUrl, $.page.webSiteRootUrl), data);

    $.page.idM.mainTabs.addTab(tab);
    //$.page.idM.mainTabs.activeTab(tab);
};