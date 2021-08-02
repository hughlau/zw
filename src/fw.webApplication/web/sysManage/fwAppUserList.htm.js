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

    //判断选择类型有值
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.selectType)) {
        //判断选择回调有值
        if (fw.fwObject.FWObjectHelper.hasValue($.page.params.selectCallback)) {
            //显示选择按钮
            $.page.idM.select.show();
        };
        //判断选择清除有值
        if (fw.fwObject.FWObjectHelper.hasValue($.page.params.selectClearCallback)) {
            //显示清空按钮
            $.page.idM.selectClear.show();
        };
        //隐藏功能按钮
        $.page.idJQ.functionList.hide();
    };

    //设置默认查询参数
    $.page.idM.keyword.setValue($.page.params.keyword);

    //开始查询
    onSearch();

};
//行选择改变时
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
        case "mUserName":
            html = "<a href=\"javascript:openInfo('query','" + e.record.mUseID + "')\" style=\"color:blue;\">" + e.value + "</a>";
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
        , methodName: "queryPageMFWUserLoginDistribute"
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

//用户下发
function appUserAdd(mUserName) {
    mUserName = getMUserName();
    mini.confirm("确定要为所有子系统下发用户？", "确定？",
    function (action) {
        if (action == "ok") {
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "appUserAdd"
        , data: {
            ticket: $.page.ticket
            , userName: mUserName
        }
        , beforeSend: function () {
            fw.fwButton.fwButtonHelper.addWait($.page.idM.enable);
            fw.fwButton.fwButtonHelper.addWait($.page.idM.disable);
        }
        , success: function (resultData) {
            //判断下发是否成功
            if (resultData.status == fw.fwData.FWResultStatus.Success) {
                //提示信息
                //mini.alert(resultData.data);
                mini.alert("下发成功");
            };
        }
         , complete: function () {
             fw.fwButton.fwButtonHelper.removeWait($.page.idM.enable);
             fw.fwButton.fwButtonHelper.removeWait($.page.idM.disable);
         }
            }));
        }
    });
};

//用户删除
function appUserDelete(mUserName) {
    mUserName = getMUserName();
    mini.confirm("确定删除所选用户？", "确定？",
    function (action) {
        if (action == "ok") {
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall"
                , serviceName: "sysManage"
                , methodName: "appUserDelete"
                , data: {
                    ticket: $.page.ticket
                    , userName: mUserName
                }
                , beforeSend: function () {
                    fw.fwButton.fwButtonHelper.addWait($.page.idM.enable);
                    fw.fwButton.fwButtonHelper.addWait($.page.idM.disable);
                }
                , success: function (resultData) {
                    //判断删除是否成功
                    if (resultData.status == fw.fwData.FWResultStatus.Success) {
                        //提示信息
                        //mini.alert(resultData.data);
                        mini.alert("删除成功");
                    };
                }
                 , complete: function () {
                     fw.fwButton.fwButtonHelper.removeWait($.page.idM.enable);
                     fw.fwButton.fwButtonHelper.removeWait($.page.idM.disable);
                 }
            }));
        };
    });
};

//用户停用启用
function able(mIsDis, mUserName) {
    mUserName = getMUserName();
    mini.confirm("确定" + (mIsDis == 1 ? "停用" : "启用") + "用户？", "确定？",
            function (action) {
                if (action == "ok") {
                    //启用停用
                    $.page.ajax($.page.getAjaxSettings({
                        serviceType: "crossDomainCall"
                        , serviceName: "sysManage"
                        , methodName: "appUserEnableOrDisable"
                        , data: {
                            ticket: $.page.ticket
                            , userName: mUserName
                            , mEntity: {
                                mIsDis: mIsDis
                            }
                        }
                        , beforeSend: function () {
                            fw.fwButton.fwButtonHelper.addWait($.page.idM.enable);
                            fw.fwButton.fwButtonHelper.addWait($.page.idM.disable);
                        }
                        , success: function (resultData) {
                            //判断启用停用成功
                            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                                mini.alert("操作成功");
                            };
                        }
                        , complete: function () {
                            fw.fwButton.fwButtonHelper.removeWait($.page.idM.enable);
                            fw.fwButton.fwButtonHelper.removeWait($.page.idM.disable);
                        }
                    }));
                };
            }
        );
};

//用户批量下发
function appUserBatchAdd() {
    mini.confirm("确定要为所有子系统批量下发用户？", "确定？",
    function (action) {
        if (action == "ok") {
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "appUserBatchAdd"
        , data: {
            ticket: $.page.ticket
        }
        , beforeSend: function () {
            fw.fwButton.fwButtonHelper.addWait($.page.idM.enable);
            fw.fwButton.fwButtonHelper.addWait($.page.idM.disable);
        }
        , success: function (resultData) {
            //判断下发是否成功
            if (resultData.status == fw.fwData.FWResultStatus.Success) {
                //提示信息
                //mini.alert(resultData.data);
                mini.alert("批量下发成功");
            };
        }
            }));
        }
    });
};