//页面初始化
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
    };
};

//查询条件
var conditionData = undefined;

//页面加载
$.page.pageLoad = function () {
    //开始查询
    onSearch();

};
//行选择改变时
function datagrid1_SelectionChanged(e) {
    if (e.selected) {
        $.page.idM.datagrid1.lastSelectedRowIndex = $.page.idM.datagrid1.indexOf(e.selected);
    };
};

//打开选择用户窗口
function onMUserIDSelect() {
    //参数
    var data = {
        ticket: $.page.ticket
        , selectType: fw.fwData.FWSelectType.Single
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
function onMUserIDSelectCallback(entity) {
    if (fw.fwObject.FWObjectHelper.hasValue(entity)) {
        $.page.idM.mUserID.setValue(entity.mUserID);
        $.page.idM.mUserID.setText(entity.mUserName);
    };
};
//选择清除用户后回调
function onMUserIDSelectClearCallback() {
    $.page.idM.mUserID.setValue("");
    $.page.idM.mUserID.setText("");
};

//打开选择用户窗口
function onMAppCodeSelect() {
    //参数
    var data = {
        ticket: $.page.ticket
        , selectType: fw.fwData.FWSelectType.Single
        , selectCallback: "onMAppCodeSelectCallback"
        , selectClearCallback: "onMAppCodeSelectClearCallback"
    };

    //参数序列化 
    var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwAppList.htm", $.page.webSiteRootUrl), data); 
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
function onMAppCodeSelectCallback(entity) {
    if (fw.fwObject.FWObjectHelper.hasValue(entity)) {
        $.page.idM.mAppCode.setValue(entity.mAppCode);
        $.page.idM.mAppCode.setText(entity.mAppName);
    };
};
//选择清除用户后回调
function onMAppCodeSelectClearCallback() {
    $.page.idM.mAppCode.setValue("");
    $.page.idM.mAppCode.setText("");
};

//查询
function onSearch() {
    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();
    //datagrid加载数据
    datagrid1_Load(1);
};

//数据加载前包括（页数发生变化时）
function datagrid1_BeforeLoad(e) {
    //取消datagrid的miniui自动加载
    e.cancel = true;
    //miniui的页数与实际相差1页
    var pageIndex = e.data.pageIndex + 1
    var pageSize = e.data.pageSize;
    //datagrid加载数据
    datagrid1_Load(pageIndex, pageSize);
};

//单元格渲染事件
function datagrid1_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "mIsAdd":
            switch (e.value) {
                case "0":
                    html = "<label style=\"color:Red\">下发失败</label>";
                    break;
                case "1":
                    html = "<label style=\"color:Green\">下发成功</label>";
                    break;
                default:
                    html = "--";
                    break;
            }
            break;
        case "mUserStatus":
            switch (e.value) {
                case "-1":
                    html = "<label style=\"color:Red\">停用</label>";
                    break;
                case "0":
                    html = "<label style=\"color:Blue\">不存在</label>";
                    break;
                case "1":
                    html = "<label style=\"color:Green\">存在</label>";
                    break;
                default:
                    html = "--";
                    break;
            }
            break;
        case "mIsDis":
            switch (e.value) {
                case "0":
                    html = "<label style=\"color:Green\">启用</label>";
                    break;
                case "1":
                    html = "<label style=\"color:Red\">停用</label>";
                    break;
                default:
                    html = "--";
                    break;
            }
            break;
        case "mIsDel":
            switch (e.value) {
                case "0":
                    html = "<label style=\"color:Green\">未删除</label>";
                    break;
                case "1":
                    html = "<label style=\"color:Red\">已删除</label>";
                    break;
                default:
                    html = "--";
                    break;
            }
            break;
        default:
            break;
    };
    return html;
};

//datagrid数据加载
function datagrid1_Load(pageIndex, pageSize) {
    //如果没传入页数
    if (!fw.fwObject.FWObjectHelper.hasValue(pageIndex)) {
        //将页数设置为datagrid的页数
        pageIndex = $.page.idM.datagrid1.pageIndex;
    };
    //如果没传入分页大小
    if (!fw.fwObject.FWObjectHelper.hasValue(pageSize)) {
        //将分页大小设置为datagrid的分页大小
        pageSize = $.page.idM.datagrid1.pageSize;
    };
    //排序字段
    var sortFieldList = null;
    //如果datagrid设置有排序字段
    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.datagrid1.sortField)) {
        //将排序字段设置为datagrid的排序字段
        sortFieldList = [{
            fieldName: $.page.idM.datagrid1.getSortField()
            , sortType: fw.fwData.FWSortType[$.page.idM.datagrid1.getSortOrder()]
        }];
    };
    //开启datagrid数据加载锁屏
    $.page.idM.datagrid1.loading();
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "queryPageMFWAppUserList"
        , data: {
            ticket: $.page.ticket
            , pageParams: {
                pageSize: pageSize
                , pageIndex: pageIndex
                , sortFieldList: sortFieldList
            }
            , queryParams: conditionData
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                //设置datagrid数据
                $.page.idM.datagrid1.set({
                    pageIndex: resultData.data.pageIndex - 1
                    , pageSize: resultData.data.pageSize
                    , totalCount: resultData.data.recordCount
                    , data: resultData.data.entityList
                });
                //默认选中第一行
                if ($.page.idM.datagrid1.data.length > 0) {
                    if (!$.page.idM.datagrid1.lastSelectedRowIndex) {
                        $.page.idM.datagrid1.lastSelectedRowIndex = -1;
                    };
                    if ($.page.idM.datagrid1.lastSelectedRowIndex > $.page.idM.datagrid1.data.length - 1) {
                        $.page.idM.datagrid1.lastSelectedRowIndex = $.page.idM.datagrid1.data.length - 1;
                    } else if ($.page.idM.datagrid1.lastSelectedRowIndex < 0) {
                        $.page.idM.datagrid1.lastSelectedRowIndex = 0;
                    };
                    $.page.idM.datagrid1.select($.page.idM.datagrid1.getRow($.page.idM.datagrid1.lastSelectedRowIndex));
                } else {
                    datagrid1_SelectionChanged({ selected: undefined, selecteds: [] });
                };
            };
        }
    }));
};

//获得选中项用户名，只能选择一项
function getMUserName() {
    var mUserName = undefined, isSelectOne = false;
    //获取选中项对象集合
    var entityList = $.page.idM.datagrid1.getSelecteds();
    //判断对象有值
    if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
        if (entityList.length == 1) {
            isSelectOne = true;
            mUserName = entityList[0].mUserName;
        };
    };
    if (!isSelectOne) {
        mini.alert("请选择一项！");
        mUserName = undefined;
    };
    return mUserName;
};

//用户批量下发
function appUserBatchAdd() {
    mini.confirm("确定要为所有子系统批量下发用户？", "确定？",
    function (action) {
        if (action == "ok") {
            var messageId;
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "appUserBatchAdd"
        , data: {
            ticket: $.page.ticket
        }
        , beforeSend: function () {
            messageId = mini.loading("正在批量下发用户，请稍等...", "提醒");
            fw.fwButton.fwButtonHelper.addWait($.page.idM.btnAppUserBatchAdd);
        }
        , success: function (resultData) {
            //判断下发是否成功
            if (resultData.status == fw.fwData.FWResultStatus.Success) {
                //提示信息
                mini.alert("下发成功");
                datagrid1_Load();
            };
        }
        , complete: function () {
            mini.hideMessageBox(messageId);
            fw.fwButton.fwButtonHelper.removeWait($.page.idM.btnAppUserBatchAdd);
        }
            }));
        }
    });
};

//未下发用户批量下发
function appUserBatchAddByNoDistributeUser() {
    mini.confirm("确定要为所有子系统批量比对下发用户？", "确定？",
    function (action) {
        if (action == "ok") {
            var messageId;
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "appUserBatchAddByNoDistributeUser"
        , data: {
            ticket: $.page.ticket
        }
        , beforeSend: function () {
            messageId = mini.loading("正在批量比对下发用户，请稍等...", "提醒");
            fw.fwButton.fwButtonHelper.addWait($.page.idM.btnAppUserBatchAddByNoDistributeUser);
        }
        , success: function (resultData) {
            //判断下发是否成功
            if (resultData.status == fw.fwData.FWResultStatus.Success) {
                //提示信息
                mini.alert("下发成功");
                datagrid1_Load();
            };
        }
        , complete: function () {
            mini.hideMessageBox(messageId);
            fw.fwButton.fwButtonHelper.removeWait($.page.idM.btnAppUserBatchAddByNoDistributeUser);
        }
            }));
        }
    });
};

//检查下发情况
function checkUserStatus() {
    mini.confirm("确定检查用户下发情况吗？", "确定？",
    function (action) {
        if (action == "ok") {
            var messageId;
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "checkUserStatus"
        , data: {
            ticket: $.page.ticket
        }
        , beforeSend: function () {
            messageId = mini.loading("正在检查用户下发情况，请稍等...", "提醒");
            fw.fwButton.fwButtonHelper.addWait($.page.idM.btnCheckUserStatus);
        }
        , success: function (resultData) {
            if (resultData.status == fw.fwData.FWResultStatus.Success) {
                //提示信息
                mini.alert("检查成功");
                datagrid1_Load();
            };
        }
        , complete: function () {
            mini.hideMessageBox(messageId);
            fw.fwButton.fwButtonHelper.removeWait($.page.idM.btnCheckUserStatus);
        }
            }));
        }
    });
}; 