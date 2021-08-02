//页面初始化
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
};
};

//页面加载
$.page.pageLoad = function () {
    if ($.page.userInfo) {
        $.page.idJQ.aUserInfo.html($.page.userInfo.userChineseName);
    };

    //数加载
    tree1_Load();
};

//tree数据加载
function tree1_Load() {
 $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "getUserMenu"
        , data: {
            ticket: $.page.ticket,
            menuTypeCode:"sysBasicManage",
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                
                $.page.idM.tree1.loadList(resultData.data);
            }

        }
    }));
};

//节点点击事件 onnodeclick="onNodeClick"
function onNodeClick(e) {
    var node = e.node;
    var isLeaf = e.isLeaf;
    if (isLeaf) {
        showTab(node);
    };
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
        tab.showCloseButton = true;

        //参数
        var data = {
            ticket: $.page.ticket
        };
        if (fw.fwObject.FWObjectHelper.hasValue(node.mUrl)) {
            //这里拼接了url，实际项目，应该从后台直接获得完整的url地址
            tab.url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl(node.mUrl, $.page.webSiteRootUrl), data);
            switch (node.mOpenTypeCode) {
                case fw.fwData.FWOpenType.Tab.toString():
                    $.page.idM.mainTabs.addTab(tab);
                    break;
                case fw.fwData.FWOpenType.UIOpen.toString():
                    //打开窗口
                    mini.open({
                        url: tab.url
                        , name: tab.name
                        , title: node.mMenuName
                        //                        , width: 384
                        //                        , height: 384
                        , onload: function () {
                            //var iframe = this.getIFrameEl();
                            //iframe.contentWindow;
                        }
                        , ondestroy: function (action) {
                            //判断非（关闭和取消）窗口
                            if (action != "close" && action != "cancel") {
                                //treegrid加载数据
                                treegrid1_Load();
                            };
                        }
                    });
                    break;
                case fw.fwData.FWOpenType.WindowOpen.toString():
                    window.open(tab.url, fw.fwString.FWStringHelper.serializeWindowName(tab.name));
                    break;
                default:
                    $.page.idM.mainTabs.addTab(tab);
                    break;
            };
        };

        if (!fw.fwObject.FWObjectHelper.hasValue(node.mOnFocusInScriptCode)) {

        } else {

        };
    };
    $.page.idM.mainTabs.activeTab(tab);
};

var currentTab = null, tabs = null;
function onBeforeOpen(e) {
    tabs = mini.get("mainTabs");
    currentTab = tabs.getTabByEvent(e.htmlEvent);
    if (!currentTab) {
        e.cancel = true;
    } else {
        tabs.activeTab(currentTab);
    };
};

function onItemClick(e) {
    var item = e.sender, name = item.name, status = 0;
    var SeclctedTabIndex = tabs.activeIndex;
    switch (name) {
        case "Refresh":
            tabs.reloadTab(currentTab);
            break;
        case "Close":
            if (currentTab.name != "homePage") {
                tabs.removeTab(currentTab);
            };
            break;
        case "CloseAll":
            var but = tabs.getTab("homePage");
            tabs.removeAll(but);
            break;
        case "CloseAllWithoutCurrent":
            var but = [currentTab];
            but.push(tabs.getTab("homePage"));
            tabs.removeAll(but);
            break;
        case "CloseLeftWithoutCurrent":
            status = 1;
            break;
        case "CloseRightWithoutCurrent":
            status = 2;
            break;
        default:
            break;
    };
    var tabCount = tabs.tabs.length;
    for (var i = tabCount - 1; i >= 1; i--) {//保留首页
        if ((status == 1 && i < SeclctedTabIndex) || (status == 2 && i > SeclctedTabIndex)) {
            tabs.removeTab(tabs.tabs[i]);
        };
    };
};

function logout() {
    fw.fwCookie.FWCookieHelper("fwSSO", null);
    fw.fwCookie.FWCookieHelper("ticket", null);
    $.page.goLogin();
};

function GetParams(url, c) {
    if (!url) url = location.href;
    if (!c) c = "?";
    url = url.split(c)[1];
    var params = {};
    if (url) {
        var us = url.split("&");
        for (var i = 0, l = us.length; i < l; i++) {
            var ps = us[i].split("=");
            params[ps[0]] = decodeURIComponent(ps[1]);
        }
    }
    return params;
}

function onIFrameLoad() {
    if (!CanSet) return;
    var mainTabs = mini.get("mainTabs");
    if (mainTabs) {
        mainTabs.setActiveIndex(0);
    }
    //url#src=...html
    var iframe = document.getElementById("mainframe");
    var src = "";
    try {
        var url = iframe.contentWindow.location.href;
        var ss = url.split("/");
        var s1 = ss[ss.length - 2];
        if (s1 != "demo") {
            src = s1 + "/" + ss[ss.length - 1];
        } else {
            src = ss[ss.length - 1];
        }
    } catch (e) {
    }
    if (src && src != "overview.html") {

        window.location.hash = "src=" + src;

    }
}
function onTabsActiveChanged(e) {
    //    var tabs = e.sender;
    //    var tab = tabs.getActiveTab();
    //    if (tab && tab._nodeid) {

    //        var node = tree.getNode(tab._nodeid);
    //        if (node && !tree.isSelectedNode(node)) {
    //            tree.selectNode(node);
    //        }
    //    }
}

function onSkinChange(skin) {
    mini.Cookie.set('miniuiSkin', skin);
    //mini.Cookie.set('miniuiSkin', skin, 100);//100天过期的话，可以保持皮肤切换
    window.location.reload()
}
function AddCSSLink(id, url, doc) {
    doc = doc || document;
    var link = doc.createElement("link");
    link.id = id;
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute("href", url);

    var heads = doc.getElementsByTagName("head");
    if (heads.length)
        heads[0].appendChild(link);
    else
        doc.documentElement.appendChild(link);
}

var CanSet = false;
$(function () {
    var skin = mini.Cookie.get("miniuiSkin");
    if (skin) {
        var selectSkin = document.getElementById("selectSkin");
        selectSkin.value = skin;
    }

    var frame = document.getElementById("mainframe");
    var demoTree = mini.get("demoTree");

    setTimeout(function () {
        var url = window.location.href;

        var params = GetParams(location.href, "#");
        if (params.ui) {
            var url = URLS[params.ui];
            if (url) {
                frame.src = url;
            }
        } else if (params.app) {

            var node = demoTree.getNode(params.app);
            if (node) {
                demoTree.expandNode(node);
                demoTree.selectNode(node);

                var url = URLS[params.app];
                if (url) {
                    frame.src = url;
                }
            }

        } else if (params.src) {
            document.title = params.src;
            frame.src = params.src;
            //            setTimeout(function () {
            //                if (frame.src != params.src) {
            //                    frame.src = params.src;
            //                }
            //            }, 100);
        }
        CanSet = true;
    }, 10);
});
var URLS = {
    crud: "datagrid/rowedit.html",
    "master-detail": "datagrid/detailform.html",
    validator: "form/validation.html",
    layout: "layout/sysLayout1.html",
    tree: "tree/tree.html"
};