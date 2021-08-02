var appDataResult = [], userDataResult = [];

//****************选择APP开始****************
//打开选择APP窗口
function onMAppCodeSelect() {
    //参数
    var data = {
        ticket: $.page.ticket
        , selectType: fw.fwData.FWSelectType.Multi
        , selectCallback: "onMAppCodeSelectCallback"
        , selectClearCallback: "onMAppCodeSelectClearCallback"
    };

    //参数序列化 
    var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwAppList.htm", $.page.webSiteRootUrl), data); 
    //打开选择APP窗口
    mini.open({
        url: pageUrl
        , title: "选择列表"
        , width: 650
        , height: 380
        , onload: function () {
            //var iframe = this.getIFrameEl();
            //iframe.contentWindow;
        }
        , ondestroy: function (action) {
        }
    });
};

//选择APP完成后回调
function onMAppCodeSelectCallback(entityList) {
    if (fw.fwObject.FWObjectHelper.hasValue(entityList)) {
        var newEntityList = mini.clone(entityList); //克隆数据 解决 不能执行已释放 Script 的代码 错误
        var arr = [];
        $.each(newEntityList, function (i, n) {
            var mDataID = n.mDataID, IsContains = false;
            $.each(appDataResult, function (j, k) {
                if (k.mDataID == mDataID) {
                    IsContains = true;
                    return false;
                };
            });

            if (!IsContains) {
                var appData = {};
                appData.mDataID = n.mDataID;
                appData.mAppCode = n.mAppCode;
                appData.mAppName = n.mAppName;
                appData.mAppRootDirectory = n.mAppRootDirectory;
                arr.push(appData);
            };
        });

        appDataResult = $.merge(appDataResult, arr);
        var appGrid = $.page.idM.dgAppList;
        fillData(0, appGrid.getPageSize(), appDataResult, appGrid);
    };
};

//选择清除APP后回调
function onMAppCodeSelectClearCallback() {
    appDataResult = [];
    var appGrid = $.page.idM.dgAppList;
    fillData(0, appGrid.getPageSize(), appDataResult, appGrid);
};

//数据加载前包括（页数发生变化时）
function dgAppList_BeforeLoad(e) {
    //取消datagrid的miniui自动加载
    e.cancel = true;
    var pageIndex = e.data.pageIndex, pageSize = e.data.pageSize;
    var appGrid = $.page.idM.dgAppList;
    fillData(pageIndex, pageSize, appDataResult, appGrid);
};


//App列表双击事件
function dgAppList_Rowdblclick(e) {
    var row = e.row;
    var appGrid = $.page.idM.dgAppList;
    var mDataID = row.mDataID;
    $.each(appDataResult, function (i, n) {
        if (n.mDataID == mDataID) {
            appDataResult.splice($.inArray(n, appDataResult), 1);
            return false;
        };
    });
    fillData(0, appGrid.getPageSize(), appDataResult, appGrid);
};
//****************选择APP结束****************


//****************选择用户开始****************
//打开选择用户窗口
function onMUserIDSelect() {
    //参数
    var data = {
        ticket: $.page.ticket
        , selectType: fw.fwData.FWSelectType.Multi
        , selectCallback: "onMUserIDSelectCallback"
        , selectClearCallback: "onMUserIDSelectClearCallback"
    };

    //参数序列化 
    var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwUserLoginList.htm", $.page.webSiteRootUrl), data); 
    //打开选择用户窗口
    mini.open({
        url: pageUrl
        , title: "选择列表"
        , width: 650
        , height: 380
        , onload: function () {
            //var iframe = this.getIFrameEl();
            //iframe.contentWindow;
        }
        , ondestroy: function (action) {
        }
    });
};

//选择用户完成后回调
function onMUserIDSelectCallback(entityList) {
    if (fw.fwObject.FWObjectHelper.hasValue(entityList)) {
        var newEntityList = mini.clone(entityList); //克隆数据 解决 不能执行已释放 Script 的代码 错误
        var arr = [];
        $.each(newEntityList, function (i, n) {
            var mUserID = n.mUserID, IsContains = false;
            $.each(userDataResult, function (j, k) {
                if (k.mUserID == mUserID) {
                    IsContains = true;
                    return false;
                };
            });

            if (!IsContains) {
                var userData = {};
                userData.mUserID = n.mUserID;
                userData.mUserName = n.mUserName;
                userData.mUserTypeName = n.mUserTypeName;
                arr.push(userData);
            };
        });

        userDataResult = $.merge(userDataResult, arr);
        var userGrid = $.page.idM.dgUserList;
        fillData(0, userGrid.getPageSize(), userDataResult, userGrid);
    };
};

//选择清除用户后回调
function onMUserIDSelectClearCallback() {
    userDataResult = [];
    var userGrid = $.page.idM.dgUserList;
    fillData(0, userGrid.getPageSize(), userDataResult, userGrid);
};

//数据加载前包括（页数发生变化时）
function dgUserList_BeforeLoad(e) {
    //取消datagrid的miniui自动加载
    e.cancel = true;
    var pageIndex = e.data.pageIndex, pageSize = e.data.pageSize;
    var userGrid = $.page.idM.dgUserList;
    fillData(pageIndex, pageSize, userDataResult, userGrid);
};

//用户列表双击事件
function dgUserList_Rowdblclick(e) {
    var row = e.row;
    var userGrid = $.page.idM.dgUserList;
    var mUserID = row.mUserID;
    $.each(userDataResult, function (i, n) {
        if (n.mUserID == mUserID) {
            userDataResult.splice($.inArray(n, userDataResult), 1);
            return false;
        };
    });
    fillData(0, userGrid.getPageSize(), userDataResult, userGrid);
};
//****************选择用户结束****************

// 本地数据分页处理
function fillData(pageIndex, pageSize, dataResult, grid) {
    var data = dataResult, totalCount = dataResult.length;
    var arr = [];
    var start = pageIndex * pageSize, end = start + pageSize;
    for (var i = start, l = end; i < l; i++) {
        var record = data[i];
        if (!record) continue;
        arr.push(record);
    }
    grid.setTotalCount(totalCount);
    grid.setPageIndex(pageIndex);
    grid.setPageSize(pageSize);
    grid.setData(arr);
};

function appSelectDistributeByAppCodeAndUserID() {
    if (appDataResult.length == 0) {
        mini.alert("请至少选择一个APP");
        return false;
    };
    if (userDataResult.length == 0) {
        mini.alert("请至少选择一个用户");
        return false;
    };
    mini.confirm("确定要为所选系统下发用户？", "确定？",
    function (action) {
        if (action == "ok") {
            var messageId;
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall"
                , serviceName: "sysManage"
                , methodName: "appUserSelectDistributeByAppCodeAndUserID"
                , data: {
                    ticket: $.page.ticket
                    , mFWAppEntityList: appDataResult
                    , mFWUserLoginEntityList: userDataResult
                }
                , beforeSend: function () {
                    messageId = mini.loading("正在下发用户，请稍等...", "提醒");
                    fw.fwButton.fwButtonHelper.addWait($.page.idM.btnSelect);
                }
                , success: function (resultData) {
                    //判断下发是否成功
                    if (resultData.status == fw.fwData.FWResultStatus.Success) {
                        //提示信息
                        mini.alert("下发成功");
                        //datagrid1_Load();
                    } else {
                        mini.alert("下发成功，但未全部下发");
                    };
                }
                , complete: function () {
                    mini.hideMessageBox(messageId);
                    fw.fwButton.fwButtonHelper.removeWait($.page.idM.btnSelect);
                }
            }));
        };
    });
};