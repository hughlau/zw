var monitorSiteCode = null;
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
        tabs_Load();
    } else {
        $.page.showTips({ content: "参数monitorSiteCode不能为空！ " + erroInfo, state: "danger" });
    };

};
function tabs_Load(ix) {
    $.page.idM.mainTabs.removeAll();
    //测试数据  
    var node1 = {
        _id: "001"
            , mMenuName: "基础信息"
            , mUrl: "web/monitorSite/monitorSite.htm"
    };
    var node2 = {
        _id: "002"
            , mMenuName: "监测因子"
            , mUrl: "web/monitorSite/monitorSiteFactorList.htm"
    };
    var node3 = {
        _id: "003"
            , mMenuName: "监测设备"
            , mUrl: "web/monitorSite/equipmentList.htm"
    };
    showTab(node1);

    if (fw.fwCookie.FWCookieHelper("login_role") == "govAdminRole")
    {
       // alert(fw.fwCookie.FWCookieHelper("login_role"));
    }
    else
    {
      
        showTab(node2);
    }

 
    showTab(node3); 
    var tab = $.page.idM.mainTabs.getTab(0);
    $.page.idM.mainTabs.activeTab(tab);
};

//显示Tab
function showTab(node) {
    //定义tab的id
    var id = "tab$" + node._id;
    //获取tab
    var tab = $.page.idM.mainTabs.getTab(id);
    //当tab不存在
    if (!tab) {
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
       
        if (fw.fwObject.FWObjectHelper.hasValue(node.mUrl)) {
            //这里拼接了url，实际项目，应该从后台直接获得完整的url地址
            tab.url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl(node.mUrl, $.page.webSiteRootUrl), data);
            $.page.idM.mainTabs.addTab(tab);
        };
       
    } else {
        $.page.idM.mainTabs.reloadTab(tab);
    };
};