//页面初始化
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
    };
};

//查询条件
var conditionData = undefined;
//导入表对象ID
var modelID = null;

//页面加载
$.page.pageLoad = function () {

    //modelID = "4fd3bb8d-15a8-4ff2-a64e-833a07776c70";
    //判断选择回调有值
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.modelID)) {
        //显示选择按钮
        modelID = $.page.params.modelID;
        //设置默认查询参数
        $.page.idM.keyword.setValue($.page.params.keyword);

        //开始查询
        onSearch();
        //锁定列
        $.page.idM.datagrid1.frozenColumns(0, 1);
    };
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
    var pageIndex = e.data.pageIndex + 1;
    var pageSize = e.data.pageSize;
    //datagrid加载数据
    datagrid1_Load(pageIndex, pageSize);
};

//单元格渲染事件
function datagrid1_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "mDataFlag":
            {
                if (fw.fwObject.FWObjectHelper.hasValue(e.value)) {
                    switch (e.value.toLowerCase()) {
                        case 'c': html = "<label style=\"color:Green\">新记录,请编辑新增</label>"; break;
                        case 'd': html = "<label style=\"color:red\">关联数据字段不存在，请删除该条记录。</label>"; break;
                        case 'u': html = "<label style=\"color:black\">数据更新</label>"; break;
                        default: html = "--"; break;
                    };
                };
            };
            break;
        case "mIsNull":
            html = (fw.fwObject.FWObjectHelper.hasValue(e.value) && e.value == 1) ? "是" : "否";
            break;
        case "mAutoCheck":
            html = (fw.fwObject.FWObjectHelper.hasValue(e.value) && e.value == 1) ? "是" : "否";
            break;
        case "mIsPK":
            html = (fw.fwObject.FWObjectHelper.hasValue(e.value) && e.value == 1) ? "是" : "否";
            break;
        case "mIsUnique":
            html = (fw.fwObject.FWObjectHelper.hasValue(e.value) && e.value == 1) ? "是" : "否";
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
        , methodName: "queryPageMFWImportMemberInfo"
        , data: {
            ticket: $.page.ticket
            , pageParams: {
                pageSize: pageSize
                , pageIndex: pageIndex
                , sortFieldList: sortFieldList
            }
            , mModelID: modelID
            //, keyword: conditionData.keyword
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
        mini.alert("请选择需要操作项！");
        entityList = undefined;
    };
    return entityList;
};

//获得选中项编码
function getMDataID() {
    var mDataID = undefined;
    //获取选中项对象
    var entity = getSelectedEntity();
    //判断对象有值
    if (entity && fw.fwObject.FWObjectHelper.hasValue(entity)) {
        mDataID = entity.mDataID;
    };
    return mDataID;
};

//获得选中项编码集合
function getMUserIDList() {
    var mUserIDList = undefined;
    //获取选中项对象集合
    var entityList = getSelectedEntityList();
    //判断对象集合有值
    if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
        mUserIDList = [];
        for (var i = 0; i < entityList.length; i++) {
            mUserIDList.push(entityList[i].mUserID);
        };
    };
    return mUserIDList;
};

//
function onSelectionChanged() {
    var row = $.page.idM.datagrid1.getSelecteds();
    if (row.length > 1) {
        $.page.idM.buttonEdit.disable();
    } else {
        $.page.idM.buttonEdit.enable();
    }
}

//打开信息窗口
function openInfo(mDataID) {

    //是否满足条件打开窗口
    var isOpen = true;
    //打开窗口传入的数据
    var data = {
        ticket: $.page.ticket
    };
    var entity = $.page.idM.datagrid1.getSelected();

    $.extend(data, entity);
    //判断对象有值
    if (entity && fw.fwObject.FWObjectHelper.hasValue(entity)) {
        mDataID = fw.fwObject.FWObjectHelper.hasValue(entity.mDataID) ? entity.mDataID : undefined;
    };
    if (mDataID && fw.fwObject.FWObjectHelper.hasValue(mDataID)) {
        data.action = "update";
    } else {
        data.action = "insert";
    };

    //判断满足条件打开窗口
    if (isOpen) {
        //打开窗口
        var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwImportMemberInfo.htm", $.page.webSiteRootUrl), data); 
        
        mini.open({
            url: pageUrl
            , title: "导入表成员信息"
            , width: 600
            , height: 380
            , onload: function () {
                //var iframe = this.getIFrameEl();
                //iframe.contentWindow;
            }
            , ondestroy: function (action) {
                //判断非（关闭和取消）窗口
                if (action != "close" && action != "cancel") {
                    //datagrid加载数据
                    datagrid1_Load(1);
                };
            }
        });
    };
};

//删除选中项
function del(mDataIDList) {
    //获得选中项编码集合
    if (!fw.fwObject.FWObjectHelper.hasValue(mDataIDList)) {
        var rows = $.page.idM.datagrid1.getSelecteds();
        if (rows.length > 0) {
            mDataIDList = [];
            var entity;
            for (var i = 0; i < rows.length; i++) {
                entity = rows[i];
                if (fw.fwObject.FWObjectHelper.hasValue(entity.mDataID)) {
                    mDataIDList.push(entity.mDataID);
                } else {
                    //$.page.idM.datagrid1.removeRows([rows[i]], true);
                };
            };
            if (mDataIDList.length < 1) {
                mDataIDList = undefined;
            };
        } else {
            mini.alert("请选择一项！");
        };
    };
    //判断选中了项
    if (mDataIDList) {
        mini.confirm("确定删除记录？", "确定？",
            function (action) {
                if (action == "ok") {
                    //删除
                    $.page.ajax($.page.getAjaxSettings({
                        serviceType: "crossDomainCall"
                        , serviceName: "sysManage"
                        , methodName: "deleteMFWImportMemberInfoByMDataIDList"
                        , data: {
                            ticket: $.page.ticket
                            , mDataIDList: mDataIDList
                        }
                        , beforeSend: function () {
                            fw.fwButton.fwButtonHelper.addWait($.page.idM.del);
                        }
                        , success: function (resultData) {
                            //判断删除成功
                            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                                //datagrid加载数据
                                datagrid1_Load();
                            };
                        }
                        , complete: function () {
                            fw.fwButton.fwButtonHelper.removeWait($.page.idM.del);
                        }
                    }));
                };
            }
        );
    };
};
