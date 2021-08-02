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
    //设置默认查询参数
    $.page.idM.keyword.setValue($.page.params.keyword);

    //开始查询
    onSearch();
};

//查询
function onSearch() {
    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();
    //datagrid加载数据
    dataGridTypeList_Load(1);
};

//数据加载前包括（页数发生变化时）
function dataGridTypeList_BeforeLoad(e) {
    //取消datagrid的miniui自动加载
    e.cancel = true;
    //miniui的页数与实际相差1页
    var pageIndex = e.data.pageIndex + 1;
    var pageSize = e.data.pageSize;
    //datagrid加载数据
    dataGridTypeList_Load(pageIndex, pageSize);
};

var lastSelectedRowIndex = -1;
//行选择改变时
function dataGridTypeList_SelectionChanged(e) {
    if (e.selected) {
        lastSelectedRowIndex = $.page.idM.dataGridTypeList.indexOf(e.selected);
        //判断回调参数有值
        if (fw.fwObject.FWObjectHelper.hasValue($.page.params.onSelectionChangedCallback)) {
            //调用回调方法
            fw.callFunction(fw.openWindow(), $.page.params.onSelectionChangedCallback, [e.selected]);
        };
    };
};

//datagrid数据加载
function dataGridTypeList_Load(pageIndex, pageSize) {
    //如果没传入页数
    if (!fw.fwObject.FWObjectHelper.hasValue(pageIndex)) {
        //将页数设置为datagrid的页数
        pageIndex = $.page.idM.dataGridTypeList.pageIndex;
    };
    //如果没传入分页大小
    if (!fw.fwObject.FWObjectHelper.hasValue(pageSize)) {
        //将分页大小设置为datagrid的分页大小
        pageSize = $.page.idM.dataGridTypeList.pageSize;
    };
    //排序字段
    var sortFieldList = null;
    //如果datagrid设置有排序字段
    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.dataGridTypeList.sortField)) {
        //将排序字段设置为datagrid的排序字段
        sortFieldList = [{
            fieldName: $.page.idM.dataGridTypeList.getSortField()
            , sortType: fw.fwData.FWSortType[$.page.idM.dataGridTypeList.getSortOrder()]
        }];
    };
    //开启datagrid数据加载锁屏
    $.page.idM.dataGridTypeList.loading();
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "queryPageMFWCardType"
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
                $.page.idM.dataGridTypeList.set({
                    pageIndex: resultData.data.pageIndex - 1
                    , pageSize: resultData.data.pageSize
                    , totalCount: resultData.data.recordCount
                    , data: resultData.data.entityList
                });
            };
        }
    }));
};

//获取选中项对象
function getSelectedEntity() {
    //获取选中项对象
    var entity = $.page.idM.dataGridTypeList.getSelected();
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
    var entityList = $.page.idM.dataGridTypeList.getSelecteds();
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

//插入新增行
function insertRow() {
    var newRow = { name: "New Row" };
    $.page.idM.dataGridTypeList.addRow(newRow, 0);
    $.page.idM.dataGridTypeList.beginEditCell(newRow, "mCardTypeCode");
};

function insertOrUpdate() {
    $.page.idM.dataGridTypeList.validate();
    if ($.page.idM.dataGridTypeList.isValid() == false) {
        //alert("请校验输入单元格内容");
        var error = $.page.idM.dataGridTypeList.getCellErrors()[0];
        $.page.idM.dataGridTypeList.beginEditCell(error.record, error.column);
        return;
    };
    var mEntityList = $.page.idM.dataGridTypeList.getChanges();
    var mEntityList = fw.fwObject.FWObjectHelper.emptyToNull(mEntityList);
    if (mEntityList.length < 1) {
        return;
    }
    $.page.idM.dataGridTypeList.loading("保存中，请稍后......");
    //插入或者更新
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "insertOrUpdateMFWCardTypeListByMDataID"
        , data: {
            ticket: $.page.ticket
            , mEntityList: mEntityList
        }
        , success: function (resultData) {
            //判断插入或者更新成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                //datagrid加载数据
                dataGridTypeList_Load();
            } else {
                mini.alert("保存失败！");
            };
        }
    }));
};

//删除选中项
function del(mDataIDList) {
    //获得选中项编码集合
    if (!fw.fwObject.FWObjectHelper.hasValue(mDataIDList)) {
        var rows = $.page.idM.dataGridTypeList.getSelecteds();
        if (rows.length > 0) {
            mDataIDList = [];
            var entity;
            for (var i = 0; i < rows.length; i++) {
                entity = rows[i];
                if (fw.fwObject.FWObjectHelper.hasValue(entity.mDataID)) {
                    mDataIDList.push(entity.mDataID);
                } else {
                    $.page.idM.dataGridTypeList.removeRows([rows[i]], true);
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
                        , methodName: "deleteMFWCardTypeByMDataIDList"
                        , data: {
                            ticket: $.page.ticket
                            , mDataIDList: mDataIDList
                        }
                        , success: function (resultData) {
                            //判断删除成功
                            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                                //datagrid加载数据
                                dataGridTypeList_Load();
                            };

                        }
                    }));
                };
            }
        );
    };
};