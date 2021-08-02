var userNameJq = null;
var orgNameJq = null;
var imgUserPhotoJq = null;

var divPersonalSetJq = null;
var divHomeJq = null;
var divFunMapJq = null;
var divMessageJq = null;
var divOutJq = null;


var divMenuJq = null;
var divModuleJq = null;
var btnSearchJq = null;
var keyWordJq = null;
var lbKeyTypeJq = null;
var btnSelectKeyTypeJq = null;

var isClose = true;

$.page.pageLoad = function () {

    userNameJq = $("#userName");
    orgNameJq = $("#orgName");
    imgUserPhotoJq = $("#imgUserPhoto");

    //divModuleJq = $("#divModule");
    divMenuJq = $("#divMenu");


    divPersonalSetJq = $("#divPersonalSet").bind("click", function () {
        var data = { ticket: $.page.ticket, mUrl: "", mOpenTypeCode: fw.fwData.FWOpenType.Tab.toString(), mMenuCode: "个人中心", mMenuName: "个人中心" };
        /*打开菜单*/
        //TODO
    }).css("cursor", "pointer").attr("title", "个人中心");
    /*用户名*/
    var userName = fw.fwObject.FWObjectHelper.hasValue($.page.userInfo.userChineseName) ? $.page.userInfo.userChineseName : $.page.userInfo.userName;
    //userName = "用户名用"
    userNameJq.html(userName).attr("title", userName);
    /*组织机构*/
    var orgName = "";
    orgNameJq.html(orgName).attr("title", orgName);

    defaultpageLoad($.page.userInfo.userRoleNameList);

    $("#logout").bind("click", function () {

        mini.confirm("确定注销系统？", "确定？",
            function (action) {
                if (action == "ok") {
                    fw.fwCookie.FWCookieHelper("fwSSO", null);
                    fw.fwCookie.FWCookieHelper("ticket", null);
                    $.page.goLogin();
                };
            }
        );
    }).css("cursor", "pointer").attr("title", "注销");

    /* 加载菜单 */
    initMenu("mainMenu");

};
/// <reference path="../report/staffUtilization.htm" />

function defaultpageLoad(userRoleNameList) { 
    if (fw.fwObject.FWObjectHelper.hasValue(userRoleNameList)) {
        var url = "";
        if ($.inArray('sysAdminRole', userRoleNameList) > -1) {
            url = "web/report/staffUtilization.htm";
        } else if ($.inArray('adminRole', userRoleNameList) > -1) {
            url = "web/report/staffUtilization.htm";
        } else if ($.inArray('schedulingRole', userRoleNameList) > -1) {
            url = "web/task/taskList.htm";
        } else if ($.inArray('samplingRole', userRoleNameList) > -1) {
            url = "web/task/taskList.htm";
        } else {
            url = "web/task/taskList.htm";
        };
        var data = {
            ticket: $.page.ticket 
        };
        //参数序列化   
        var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl(url, $.page.webSiteRootUrl), data);
        var homePageTab = $.page.idM.mainTabs.getTab("homePage");
        if (homePageTab) {
            $.page.idM.mainTabs.updateTab(homePageTab, { url: pageUrl });
            $.page.idM.mainTabs.activeTab(homePageTab);
        }

    };
};

function initMenu(pMenuCode) {
    divMenuJq.empty();

    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "getUserMenu"
        , data: {
            ticket: $.page.ticket,
            menuTypeCode: "webOPMenu",
            isTreeData: 1
        },
        success: function (resultData) {
            if (resultData.status == fw.fwData.FWResultStatus.Success) {
                if (fw.fwObject.FWObjectHelper.hasValue(resultData.data)) {
                    for (var i = 0; i < resultData.data.length; i++) {

                        /* 加载模块 */

                        var currentMenu = resultData.data[i]; ;
                        var menuBoxJQ = $("<div class='divMenuBox'></div>").appendTo(divMenuJq);
                        var levelOneJQ = $("<div class='divIndexBottom_levelOne'></div>").appendTo(menuBoxJQ);

                        /*如果有子集，显示下拉图标*/
                        var currentChildEntity = currentMenu.mFWMenuList;
                        if (fw.fwObject.FWObjectHelper.hasValue(currentChildEntity) && currentChildEntity.length > 0) {
                            $("<div class='divIndexBottom_levelOne_xiala'></div>").data("data", currentChildEntity).toggle(
                                            function () {
                                                var thisJQ = $(this);
                                                $("div.divIndexBottom_levelTwo", $(this).parent().parent()).slideDown(500, function () {
                                                    /*下拉结束，回调函数：更改箭头状态*/
                                                    thisJQ.removeClass("divIndexBottom_levelOne_xiala").addClass("divIndexBottom_levelOne_xialaSelect");
                                                });
                                            }, function () {
                                                var thisJQ = $(this);
                                                $("div.divIndexBottom_levelTwo", $(this).parent().parent()).slideUp(500, function () {
                                                    /*下拉结束，回调函数：更改箭头状态*/
                                                    thisJQ.removeClass("divIndexBottom_levelOne_xialaSelect").addClass("divIndexBottom_levelOne_xiala");
                                                });
                                            }).appendTo(levelOneJQ);
                        };
                        /* 一级菜单 */
                        var oneMenuJQ = $("<div class='divIndexBottom_levelOne_Word divIndexBottom_levelOneIcon'>" + currentMenu.mMenuName + "</div>").data("data", currentMenu).bind("click", function () {
                            var data = $(this).data("data");
                            if (fw.fwObject.FWObjectHelper.hasValue(data.mFWMenuList) && data.mFWMenuList.length > 0) {
                                /* 如果有子集 就触发展开 */
                                $("div.divIndexBottom_levelOne_xiala", $(this).parent()).click();
                            } else if (fw.fwObject.FWObjectHelper.hasValue(data.mUrl)) {
                                /*打开菜单*/
                                showTab(data);
                            };
                        }).attr("title", currentMenu.mMenuName).appendTo(levelOneJQ);

                        /*一级菜单 结束*/

                        /*如果有菜单图标地址，显示图标*/
                        if (fw.fwObject.FWObjectHelper.hasValue(currentMenu.mIconUrl)) {
                            oneMenuJQ.css("backgroundImage", "url(" + fw.fwUrl.FWUrlHelper.getAbsoluteUrl(currentMenu.mIconUrl, $.page.webSiteRootUrl) + ")");
                        };

                        /*二级菜单*/
                        var levelTwoJQ = $("<div class='divIndexBottom_levelTwo'></div>").appendTo(menuBoxJQ).slideUp();
                        for (var k = 0; k < currentChildEntity.length; k++) {
                            var p = currentChildEntity[k];
                            $("<div class='divIndexBottom_levelTwo_Word' title='" + p.mMenuName + "'>" + p.mMenuName + "</div>").data("data", p).bind("click", function () {
                                $("div.divIndexBottom_levelTwo_WordSelect", divMenuJq).removeClass("divIndexBottom_levelTwo_WordSelect");
                                $(this).addClass("divIndexBottom_levelTwo_WordSelect");
                                var data = $(this).data("data");
                                /*打开菜单*/
                                showTab(data);
                            }).attr("title", p.mMenuName).appendTo(levelTwoJQ);
                        };
                        /*二级菜单 结束*/
                    };
                };
            };
        }
    }));
};


//注销
function logout() {
    fw.fwCookie.FWCookieHelper("fwSSO", null);
    fw.fwCookie.FWCookieHelper("ticket", null);
    $.page.goLogin();
};

//显示Tab
function showTab(node) {
    //定义tab的id
    var id = "tab$" + node.mMenuCode;
    //获取tab
    var tab = $.page.idM.mainTabs.getTab(id);
    //当tab不存在
    if (!tab) {
        tab = {};
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
    };
    $.page.idM.mainTabs.activeTab(tab);
};

 