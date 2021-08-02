var monitorSiteCode = null;
var viewType = null;

var pageTabsConfig = [
    {
        name: "info", config: {
            _id: "001"
            , mMenuName: "基础信息"
            , mUrl: "web/monitorSite/monitorSiteView.htm"
        }
    },
    {
        name: "his", config: {
            _id: "002"
            , mMenuName: "历史监测数据"
            , mUrl: "web/autoMonitor/monitorSiteHisDataList.htm"
        }
    },
    {
        name: "ws", config: {
            _id: '003',
            mMenuName: '工况图',
            mUrl: 'web/monitorSite/monitorSiteWorkingStatus.htm'
        }
    },    
    {
        name: "waterhis", config: {
            _id: "004"
            , mMenuName: "历史监测数据"
            , mUrl: "web/autoMonitor/monitorSiteWaterHisDataList.htm"
        }
    },
    {
        name: "drughis", config: {
            _id: "004"
            , mMenuName: "历史监测数据"
            , mUrl: "web/autoMonitor/drugHisDataList.htm"
        }
    }
];
//页面初始化
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
    };
};
//页面加载
$.page.pageLoad = function () {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.monitorSiteCode)) {
        monitorSiteCode = $.page.params.monitorSiteCode;
        loadTab();
    } else {
        $.page.showTips({ content: "参数monitorSiteCode不能为空！ " + erroInfo, state: "danger" });
    };


};
 

function loadTab() {
    //tab选项顺序
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.pageTabs)) {
        pageTabs = $.page.params.pageTabs.split(',');

    } else {
        pageTabs = ["info", "his","ws"];
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
    //$.page.idM.mainTabs.addTab(tab);

    //政府管理者角色登录后，隐藏历史监测数据和工况图  songshasha 2017-04-24
    if (fw.fwCookie.FWCookieHelper("login_role") == "govAdminRole") {
        if (node._id == "002" || node._id == "003")
    {
    }
    else
    {
        $.page.idM.mainTabs.addTab(tab);
    }
    }
    else
    {
        $.page.idM.mainTabs.addTab(tab);
    }

        //$.page.idM.mainTabs.activeTab(tab);
};