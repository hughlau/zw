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

var lastSelectedRowIndex = -1;
//行选择改变时
function datagrid1_SelectionChanged(e) {
    if (e.selected) {
        lastSelectedRowIndex = $.page.idM.datagrid1.indexOf(e.selected);
        //判断回调参数有值
        if (fw.fwObject.FWObjectHelper.hasValue($.page.params.onSelectionChangedCallback)) {
            //调用回调方法
            fw.callFunction(fw.openWindow(), $.page.params.onSelectionChangedCallback, [e.selected]);
        };
    };
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

//单元格渲染事件
function datagrid1_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "mDisTime":
            e.record["mDisTime"] = (fw.fwObject.FWObjectHelper.hasValue(e.value)) ? fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(e.value)) : "--";
            html = e.record["mDisTime"];
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
        , methodName: "queryPageMFWDisableIp"
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
                function changefirst(datagrid1) {
                    if (datagrid1.data.length > 0) {
                        if (!datagrid1.lastSelectedRowIndex) {
                            datagrid1.lastSelectedRowIndex = -1;
                        };
                        if (datagrid1.lastSelectedRowIndex > datagrid1.data.length - 1) {
                            datagrid1.lastSelectedRowIndex = datagrid1.data.length - 1;
                        } else if (datagrid1.lastSelectedRowIndex < 0) {
                            datagrid1.lastSelectedRowIndex = 0;
                        };
                        datagrid1.select(datagrid1.getRow(datagrid1.lastSelectedRowIndex));
                    } else {
                        datagrid1_SelectionChanged({ selected: undefined, selecteds: [] });
                    };
                }
                changefirst($.page.idM.datagrid1);	
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
    $.page.idM.datagrid1.beginEditCell(newRow, "mDisableIpCode");
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
    if (mEntityList.length == 0) {
        datagrid1_Load();
        return;
    }

    $.page.idM.datagrid1.loading("保存中，请稍后......");
    //插入或者更新
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "insertOrUpdateMFWDisableIpListByMDataID"
        , data: {
            ticket: $.page.ticket
            , mEntityList: mEntityList
        }, beforeSend: function () {
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
        }, complete: function () {
            fw.fwButton.fwButtonHelper.removeWait($.page.idM.insertOrUpdate);
        }
    }));
};

//删除选中项
function del(mDataIDList) {
    //获得选中项编码集合
    if (!fw.fwObject.FWObjectHelper.hasValue(mDataIDList)) {
        mDataIDList = getMDataIDList();
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
                        , methodName: "deleteMFWDisableIpByMDataIDList"
                        , data: {
                            ticket: $.page.ticket
                            , mDataIDList: mDataIDList
                        }
                        , success: function (resultData) {
                            //判断删除成功
                            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                                //datagrid加载数据
                                datagrid1_Load();
                            };
                        }
                    }));
                };
            }
        );
    };
};

function updateIpInfo() {
    //获得选中项编码集合
    var entityList = getSelectedEntityList();
    //判断选中了项
    if (entityList) {
        var ipInfoDictionary = {};
        for (var i = 0; i < entityList.length; i++) {
            ipInfoDictionary[entityList[i].mDisableIp] = null;
        };
        var ipList = [];
        for (var ip in ipInfoDictionary) {
            ipList.push(ip);
        };
        if (ipList.length > 0) {
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall"
                , serviceName: "sysManage"
                , methodName: "getIpInfoList"
                , data: {
                    ticket: $.page.ticket
                    , ipList: ipList
                }, beforeSend: function () {
                    fw.fwButton.fwButtonHelper.addWait($.page.idM.updateIpInfo);
                }
                , success: function (resultData) {
                    //判断删除成功
                    if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                        //datagrid加载数据
                        for (var i = 0; i < resultData.data.length; i++) {
                            ipInfoDictionary[resultData.data[i].ip] = resultData.data[i];
                        };
                        var mEntityList = [];
                        for (var i = 0; i < entityList.length; i++) {
                            mEntityList.push({
                                mDataID: entityList[i].mDataID
                                , mLocation: ipInfoDictionary[entityList[i].mDisableIp].location
                            });
                        };
                        if (mEntityList.length == 0) {
                            return;
                        };
                        $.page.idM.datagrid1.loading("保存中，请稍后......");
                        //插入或者更新
                        $.page.ajax($.page.getAjaxSettings({
                            serviceType: "crossDomainCall"
                            , serviceName: "sysManage"
                            , methodName: "insertOrUpdateMFWDisableIpListByMDataID"
                            , data: {
                                ticket: $.page.ticket
                                , mEntityList: mEntityList
                            }, beforeSend: function () {
                                fw.fwButton.fwButtonHelper.addWait($.page.idM.buttonSave);
                            }
                            , success: function (resultData) {
                                //判断插入或者更新成功
                                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                                    //datagrid加载数据
                                    datagrid1_Load();
                                } else {
                                    mini.alert("保存失败！");
                                };
                            }, complete: function () {
                                fw.fwButton.fwButtonHelper.removeWait($.page.idM.buttonSave);
                            }
                        }));
                    };
                }, complete: function () {
                    fw.fwButton.fwButtonHelper.removeWait($.page.idM.updateIpInfo);
                }
            }));
        };
    };

    if ($.page.idM.datagrid1.data.length > 0) {

    };
};