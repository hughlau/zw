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

    var buttonDeleteJQ = $("#buttonDelete");

    buttonDeleteJQ.bind("click", function () {
        var Entity = getSelectedEntityList();
        if (!Entity) {
            return;
        };
        deleteInfos();
    });

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
        //$.page.idJQ.functionList.hide();
        //$.page.idM.datagrid1.setAllowCellEdit(false);
        //$.page.idM.datagrid1.setAllowCellSelect(false);
    };

    //开始查询
    onSearch();
};
//#region 自定义校验
/*自定义vtype*/
mini.VTypes["englishErrorText"] = "请输入英文";
mini.VTypes["english"] = function (v) {
    var re = new RegExp("^[a-zA-Z\_]+$");
    if (re.test(v)) return true;
    return false;
};
//#endregion


function deleteInfos() {
    var entity = getSelectedEntityList();
    mini.confirm("删除分类同时删除收藏数据？", "确定？",
        function (action) {
            if (action == "ok") {
                $.page.ajax($.page.getAjaxSettings({
                    serviceType: "crossDomainCall"
                    , serviceName: "basicInfo"
                    , methodName: "deleteCollectionCate"
                    , data: {
                        ticket: $.page.ticket
                        , mEntity: entity
                    }
                    , success: function (resultData) {
                        //判断加载数据成功
                        if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                            mini.alert("删除成功", "提示", function () {
                                onSearch();
                            });
                        } else {
                            if (resultData.infoList != null && resultData.infoList.length > 0) {
                                mini.alert(resultData.infoList[0]);
                            };
                        };
                    }
                }));
            };
        }
    );
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

var lastSelectedRowIndex = -1;
//行选择改变时
function datagrid1_SelectionChanged(e) {
    if (e.selected) {


        lastSelectedRowIndex = $.page.idM.datagrid1.indexOf(e.selected);
        //判断回调参数有值
        if (fw.fwObject.FWObjectHelper.hasValue($.page.params.onSelectionChangedCallback)) {
            //调用回调方法
            if ($.page.idM.datagrid1.getSelecteds().length > 1) {
                var a = [];
                a.selected = [];
                a.selected.mDictionaryTypeCode = "";
                a.selected.mDictionaryTypeName = "";
                fw.callFunction(fw.openWindow(), $.page.params.onSelectionChangedCallback, [a.selected]);
            } else {
                fw.callFunction(fw.openWindow(), $.page.params.onSelectionChangedCallback, [e.selected]);
            }
        };
    };
};

//单元格渲染事件
function datagrid1_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "mIsDis":
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
        , serviceName: "basicInfo"
        , methodName: "queryPageCollectionCate"
        , data: {
            ticket: $.page.ticket
            , pageParams: {
                pageSize: pageSize
                , pageIndex: pageIndex
            }
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
                if (fw.fwObject.FWObjectHelper.hasValue($.page.params.onSelectionChangedCallback)) {
                    if ($.page.idM.datagrid1.data.length > 0) {
                        if (lastSelectedRowIndex > $.page.idM.datagrid1.data.length - 1) {
                            lastSelectedRowIndex = $.page.idM.datagrid1.data.length - 1;
                        } else if (lastSelectedRowIndex < 0) {
                            lastSelectedRowIndex = 0;
                        };
                        $.page.idM.datagrid1.select($.page.idM.datagrid1.getRow(lastSelectedRowIndex));
                    } else {
                        datagrid1_SelectionChanged({ selected: {} });
                    };
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
    $.page.idM.datagrid1.addRow(newRow, 0);
    $.page.idM.datagrid1.beginEditCell(newRow, "mDictionaryTypeCode");
};

function insertOrUpdate() {
    $.page.idM.datagrid1.validate();
    if ($.page.idM.datagrid1.isValid() == false) {
        //alert("请校验输入单元格内容");
        var error = $.page.idM.datagrid1.getCellErrors()[0];
        $.page.idM.datagrid1.beginEditCell(error.record, error.column);
        return;
    };
    var mEntityList = $.page.idM.datagrid1.getChanges();
    var mEntityList = fw.fwObject.FWObjectHelper.emptyToNull(mEntityList);
    var sendList = new Array();
    if (mEntityList.length < 1) {

        return;
    } else {
        for (var i = 0; i < mEntityList.length; i++) {
            sendList.push();
        }
    }
    
    if (fw.fwObject.FWObjectHelper.hasValue(mEntityList)) {
        $.page.idM.datagrid1.loading("保存中，请稍后......");
        //插入或者更新
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "basicInfo"
            , methodName: "insertOrUpdateByCateCode"
            , data: {
                ticket: $.page.ticket
                , mEntityList: mEntityList
            }
            , beforeSend: function () {
                fw.fwButton.fwButtonHelper.addWait($.page.idM.insertOrUpdate);
            }
            , success: function (resultData) {
                //判断插入或者更新成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                    //datagrid加载数据
                    datagrid1_Load();
                } else {
                    mini.alert("保存失败！");
                };
            }
            , complete: function () {
                fw.fwButton.fwButtonHelper.removeWait($.page.idM.insertOrUpdate);
            }
        }));
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
                    $.page.idM.datagrid1.removeRows([rows[i]], true);
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
                        , methodName: "deleteMFWDictionaryTypeByMDataIDList"
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

//选择选中项(提供给父页面调用)
function select() {
    //判断选择类型以及选择回调方法有值
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.selectType) && fw.fwObject.FWObjectHelper.hasValue($.page.params.selectCallback)) {
        //判断是单选
        if ($.page.params.selectType == fw.fwData.FWSelectType.Single) {
            //获取选中项对象
            var entity = getSelectedEntity();
            //判断选中项对象有值
            if (fw.fwObject.FWObjectHelper.hasValue(entity)) {
                //调用回调方法
                fw.callFunction(fw.openWindow(), $.page.params.selectCallback, [entity]);
                //关闭窗口
                fw.closeWindow();
            };
        } else if ($.page.params.selectType == fw.fwData.FWSelectType.Multi) {
            //获取选中项对象集合
            var entityList = getSelectedEntityList();
            //判断选中项对象集合有值
            if (fw.fwObject.FWObjectHelper.hasValue(entityList)) {
                //调用回调方法
                fw.callFunction(fw.openWindow(), $.page.params.selectCallback, [entityList]);
                //关闭窗口
                fw.closeWindow();
            };
        };
    };
};
function selectClear() {
    //判断选择类型以及选择回调方法有值
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.selectType) && fw.fwObject.FWObjectHelper.hasValue($.page.params.selectClearCallback)) {
        //调用选择清除回调方法
        fw.callFunction(fw.openWindow(), $.page.params.selectClearCallback, []);
        //关闭窗口
        fw.closeWindow();
    };
};


function openInfo() {
    var data = { ticket: $.page.ticket};
    var pageParams = { url: "web/mytask/collectionCateAdd.htm", width: 800, height: 200, title: "增加分类" };
    $.pageCustomer.openPage(data, pageParams, function () {
        onSearch();
    });
}