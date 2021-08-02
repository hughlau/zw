//查询条件
var conditionData = undefined;

//页面加载
$.page.pageLoad = function () {
    //开始查询
    onSearch();
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
    var pageIndex = e.data.pageIndex + 1;
    var pageSize = e.data.pageSize;
    //datagrid加载数据
    datagrid1_Load(pageIndex, pageSize);
};

//单元格渲染事件
function datagrid1_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "mIsDis":
            html = (fw.fwObject.FWObjectHelper.hasValue(e.value) && e.value == 1) ? "<label style=\"color:Red\">已停用</label>" : "<label style=\"color:Green\">已启用</label>";
            break;
        case "mAppCode":
            html = "<a href=\"javascript:openInfo('query','" + e.record.mUseID + "')\" style=\"color:blue;\">" + e.value + "</a>";
            break;
        case "mAppInstallStatus":
            switch (e.value) {
                case "-1":
                    html = "未检查";
                    break;
                case "0":
                    html = "<label style=\"color:Red\">安装失败</label>";
                    break;
                case "1":
                    html = "<label style=\"color:Green\">安装成功</label>";
                    break;
                case "2":
                    html = "<label style=\"color:Blue\">安装未启用</label>";
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

//行选择改变事件
function datagrid1_SelectionChanged(e) {
    var childControls = mini.getChildControls($.page.idJQ.functionList[0]);
    for (var i = 0; i < childControls.length; i++) {
        var isEnabled = true;
        if (fw.fwObject.FWObjectHelper.hasValue(childControls[i].minSelectedCount)) {
            if (isEnabled && childControls[i].minSelectedCount <= e.selecteds.length) {
                isEnabled = true;
            } else {
                isEnabled = false;
            };
        };
        if (fw.fwObject.FWObjectHelper.hasValue(childControls[i].maxSelectedCount)) {
            if (isEnabled && e.selecteds.length <= childControls[i].minSelectedCount) {
                isEnabled = true;
            } else {
                isEnabled = false;
            };
        };
        childControls[i].set({ enabled: isEnabled });
    };
    if (e.selected) {
        $.page.idM.datagrid1.lastSelectedRowIndex = $.page.idM.datagrid1.indexOf(e.selected);
    };
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
        , methodName: "queryPageMFWAppList"
        , data: {
            ticket: $.page.ticket
            , pageParams: {
                pageSize: pageSize
                , pageIndex: pageIndex
                , sortFieldList: sortFieldList
            }
            , keyword: conditionData.keyword
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

//获取选中项对象
function getSelectedEntity() {
    //获取选中项对象
    var entity = $.page.idM.datagrid1.getSelected();
    //判断对象没有值
    if (!fw.fwObject.FWObjectHelper.hasValue(entity)) {
        mini.alert("请选择一项！");
        entity = undefined;
    };
    return entity;
};

//获取选中项对象集合
function getSelectedEntityList() {
    //获取选中项对象集合
    var entityList = $.page.idM.datagrid1.getSelecteds();
    //判断对象集合没有值
    if (!fw.fwObject.FWObjectHelper.hasValue(entityList) || entityList.length < 1) {
        mini.alert("请至少选择一项！");
        entityList = undefined;
    };
    return entityList;
};

//获得选中项编码
//function getMDataID() {
//    var mDataID = undefined;
//    //获取选中项对象
//    var entity = getSelectedEntity();
//    //判断对象有值
//    if (entity && fw.fwObject.FWObjectHelper.hasValue(entity)) {
//        mDataID = entity.mDataID;
//    };
//    return mDataID;
//};

//获得选中项编码，只能选择一项
function getMDataID() {
    var mDataID = undefined, isSelectOne = false;
    //获取选中项对象集合
    var entityList = $.page.idM.datagrid1.getSelecteds();
    //判断对象有值
    if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
        if (entityList.length == 1) {
            isSelectOne = true;
            mDataID = entityList[0].mDataID;
        };
    };
    if (!isSelectOne) {
        mini.alert("请选择一项！");
        mDataID = undefined;
    };
    return mDataID;
};

function getMAppCode() {
    var mAppCode = undefined, isSelectOne = false;
    //获取选中项对象集合
    var entityList = $.page.idM.datagrid1.getSelecteds();
    //判断对象有值
    if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
        if (entityList.length == 1) {
            isSelectOne = true;
            mAppCode = entityList[0].mAppCode;
        };
    };
    if (!isSelectOne) {
        mini.alert("请选择一项！");
        mAppCode = undefined;
    };
    return mAppCode;
};

//获得选中项编码集合
function getMDataIDList() {
    var mDataIDList = undefined;
    //获取选中项对象集合
    var entityList = getSelectedEntityList();
    //判断对象集合有值
    if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
        mDataIDList = [];
        for (var i = 0; i < entityList.length; i++) {
            mDataIDList.push(entityList[i].mDataID);
        };
    };
    return mDataIDList;
};

//打开信息窗口
function openInfo(action, mAppCode) {
    //是否满足条件打开窗口
    var isOpen = true;
    //打开窗口传入的数据
    var data = {
        ticket: $.page.ticket
        , action: action
    };
    //判断传入了记录编码
    if (fw.fwObject.FWObjectHelper.hasValue(mAppCode)) {
        data.mAppCode = mAppCode;
    } else {
        //判断是修改或者是查看信息
        if (action == "update" || action == "query") {
            //获取选中项编码
            mAppCode = getMAppCode();
            //判断选中了项
            if (mAppCode && fw.fwObject.FWObjectHelper.hasValue(mAppCode)) {
                data.mAppCode = mAppCode;
            } else {
                isOpen = false;
            };
        } else {
            //判断不是新增
            if (action != "insert") {
                isOpen = false;
            };
        };
    };
    //判断满足条件打开窗口
    if (isOpen) {
        //获得传入的参数字符串 
        var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwUserDistributeByAppDetail.htm", $.page.webSiteRootUrl), data); 
        //打开窗口
        mini.open({
            url: pageUrl
            , title: "用户下发详细信息"
            , width: 860
            , height: 540
            , allowResize: false
            , onload: function () {
                //var iframe = this.getIFrameEl();
                //iframe.contentWindow;
            }
            , ondestroy: function (action) {
                //判断非（关闭和取消）窗口
                if (action != "close" && action != "cancel") {
                    //datagrid加载数据
                    datagrid1_Load();
                };
            }
        });
    };
};

//全部下发
function appUserAllDistributeByAppCode(appCode) {
    mini.confirm("确定要为所选系统下发全部用户？", "确定？",
    function (action) {
        if (action == "ok") {
            var messageId;
            appCode = getMAppCode();
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall"
                , serviceName: "sysManage"
                , methodName: "appUserAllDistributeByAppCode"
                , data: {
                    ticket: $.page.ticket
                    , appCode: appCode
                }
                , beforeSend: function () {
                    messageId = mini.loading("正在下发用户，请稍等...", "提醒");
                    fw.fwButton.fwButtonHelper.addWait($.page.idM.btnAll);

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
                    fw.fwButton.fwButtonHelper.removeWait($.page.idM.btnAll);
                }
            }));
        }
    });
};

//比对下发
function appUserPartDistributeByAppCode(appCode) {
    mini.confirm("确定要为所选系统比对下发用户？", "确定？",
    function (action) {
        if (action == "ok") {
            var messageId;
            appCode = getMAppCode();
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall"
                , serviceName: "sysManage"
                , methodName: "appUserPartDistributeByAppCode"
                , data: {
                    ticket: $.page.ticket
                    , appCode: appCode
                }
                , beforeSend: function () {
                    messageId = mini.loading("正在下发用户，请稍等...", "提醒");
                    fw.fwButton.fwButtonHelper.addWait($.page.idM.btnPart);
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
                    fw.fwButton.fwButtonHelper.removeWait($.page.idM.btnPart);
                }
            }));
        };
    });
};

//选择下发
function appUserSelectDistributeByAppCode() {
    var data = {
        ticket: $.page.ticket
    };

    //获得传入的参数字符串 
    var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwUserDistributeBySelect.htm", $.page.webSiteRootUrl), data); 
    //打开窗口
    mini.open({
        url: pageUrl 
        , title: "选择下发"
        , width: 540
        , height: 540
        , allowResize: false
        , enableDragProxy: false
        , onload: function () {
            //var iframe = this.getIFrameEl();
            //iframe.contentWindow;
        }
        , ondestroy: function (action) {
            //判断非（关闭和取消）窗口
            if (action != "close" && action != "cancel") {
                //datagrid加载数据
                datagrid1_Load();
            };
        }
    });
};
