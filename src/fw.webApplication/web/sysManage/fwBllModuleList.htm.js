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
        //$.page.idJQ.functionList.hide();
        //$.page.idM.treegrid1.setAllowCellEdit(false);
        //$.page.idM.treegrid1.setAllowCellSelect(false);
    };

    //设置默认查询参数
    $.page.idM.keyword.setValue($.page.params.keyword);

    //开始查询
    onSearch();
    $.page.idM.treegrid1.on("dragstart", function (e) {
        e.dragText = e.nodes[0].mBllModuleName;
    });
};

//查询
function onSearch() {
    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();
    //treegrid加载数据
    treegrid1_Load(1);
};

function treegrid1_Drop(e) {
    if (!fw.fwObject.FWObjectHelper.hasValue($.page.params.selectType)) {
        if (e.dragAction == "add") {
            mini.mask({
                el: document.body,
                cls: 'mini-mask-loading',
                html: '移动中...'
            });
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall"
                    , serviceName: "sysManage"
                    , methodName: "updateMFWBllModuleByMDataIDList"
                    , data: {
                        ticket: $.page.ticket
                        , mEntity: {
                            mPBllModuleCode: e.dropNode.mBllModuleCode
                        }
                        , mDataIDList: [e.dragNode.mDataID]
                    }
                    , success: function (resultData) {
                        //判断移动节点成功
                        if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                            mini.unmask(document.body);
                            //treegrid加载数据
                            treegrid1_Load();
                        };
                    }
            }));
        } else if (e.dragAction == "before" || e.dragAction == "after") {
            //获取父节点
            var parentNode = $.page.idM.treegrid1.getParentNode(e.dropNode);
            //获取子节点
            var children = $.page.idM.treegrid1.getChildNodes(parentNode);
            if (fw.fwObject.FWObjectHelper.hasValue(children) && children.length > 0) {
                var mEntityList = [];
                for (var i = 0; i < children.length; i++) {
                    if (children[i]._state != "added") {
                        mEntityList.push({
                            mDataID: children[i].mDataID
                            //强制设置父节点，是为了弥补MINIUI节点移动的缺陷（移动到统计最后一个节点时，认为是添加节点）
                            , mPBllModuleCode: e.dropNode.mPBllModuleCode
                            , mIx: i + 1
                        });
                    };
                };
                mini.mask({
                    el: document.body,
                    cls: 'mini-mask-loading',
                    html: '移动中...'
                });
                //插入或者更新排序
                $.page.ajax($.page.getAjaxSettings({
                    serviceType: "crossDomainCall"
                    , serviceName: "sysManage"
                    , methodName: "insertOrUpdateMFWBllModuleListByMDataID"
                    , data: {
                        ticket: $.page.ticket
                        , mEntityList: mEntityList
                    }
                    , success: function (resultData) {
                        if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                            mini.unmask(document.body);
                            //treegrid加载数据
                            treegrid1_Load();
                        };
                    }
                }));
            };
        };
    };
};

//数据加载前包括（页数发生变化时）
function treegrid1_BeforeLoad(e) {
    //取消treegrid的miniui自动加载
    e.cancel = true;
    //miniui的页数与实际相差1页
    var pageIndex = e.data.pageIndex + 1
    var pageSize = e.data.pageSize;
    //treegrid加载数据
    treegrid1_Load(pageIndex, pageSize);
};

var lastSelectedRowIndex = -1;
//行选择改变时
function treegrid1_SelectionChanged(e) {
    if (e.selected) {
        lastSelectedRowIndex = $.page.idM.treegrid1.indexOf(e.selected);
        //判断回调参数有值
        if (fw.fwObject.FWObjectHelper.hasValue($.page.params.onSelectionChangedCallback)) {
            //调用回调方法
            fw.callFunction(fw.openWindow(), $.page.params.onSelectionChangedCallback, [e.selected]);
        };
    };
};

//单元格渲染事件
function treegrid1_Renderer(e) {
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


//treegrid数据加载
function treegrid1_Load(pageIndex, pageSize) {
    //如果没传入页数
    if (!fw.fwObject.FWObjectHelper.hasValue(pageIndex)) {
        //将页数设置为treegrid的页数
        pageIndex = $.page.idM.treegrid1.pageIndex;
    };
    //如果没传入分页大小
    if (!fw.fwObject.FWObjectHelper.hasValue(pageSize)) {
        //将分页大小设置为treegrid的分页大小
        pageSize = $.page.idM.treegrid1.pageSize;
    };
    //排序字段
    var sortFieldList = null;
    //如果treegrid设置有排序字段
    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.treegrid1.sortField)) {
        //将排序字段设置为treegrid的排序字段
        sortFieldList = [{
            fieldName: $.page.idM.treegrid1.getSortField()
            , sortType: fw.fwData.FWSortType[$.page.idM.treegrid1.getSortOrder()]
        }];
    };
    //开启treegrid数据加载锁屏
    $.page.idM.treegrid1.loading();
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "queryPageMFWBllModule"
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
                //设置treegrid数据
                $.page.idM.treegrid1.set({
                    pageIndex: resultData.data.pageIndex - 1
                    , pageSize: resultData.data.pageSize
                    , totalCount: resultData.data.recordCount
                    //                    , data: resultData.data.entityList
                });

                //设置treegrid数据
                $.page.idM.treegrid1.loadList(resultData.data.entityList);

                //                if (fw.fwObject.FWObjectHelper.hasValue($.page.params.onSelectionChangedCallback)) {
                //                    if ($.page.idM.treegrid1.data.length > 0) {
                //                        if (lastSelectedRowIndex > $.page.idM.treegrid1.data.length - 1) {
                //                            lastSelectedRowIndex = $.page.idM.treegrid1.data.length - 1;
                //                        } else if (lastSelectedRowIndex < 0) {
                //                            lastSelectedRowIndex = 0;
                //                        };
                //                        $.page.idM.treegrid1.select($.page.idM.treegrid1.getRow(lastSelectedRowIndex));
                //                    } else {
                //                        treegrid1_SelectionChanged({ selected: {} });
                //                    };
                //                };
                //默认选中第一行
                if ($.page.idM.treegrid1.data.length > 0) {
                    if (!$.page.idM.treegrid1.lastSelectedRowIndex) {
                        $.page.idM.treegrid1.lastSelectedRowIndex = -1;
                    };
                    if ($.page.idM.treegrid1.lastSelectedRowIndex > $.page.idM.treegrid1.data.length - 1) {
                        $.page.idM.treegrid1.lastSelectedRowIndex = $.page.idM.treegrid1.data.length - 1;
                    } else if ($.page.idM.treegrid1.lastSelectedRowIndex < 0) {
                        $.page.idM.treegrid1.lastSelectedRowIndex = 0;
                    };
                    $.page.idM.treegrid1.select($.page.idM.treegrid1.getRow($.page.idM.treegrid1.lastSelectedRowIndex));
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
    var entity = $.page.idM.treegrid1.getSelected();
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
    var entityList = $.page.idM.treegrid1.getSelecteds();
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
function insertRow(action, mPBllModuleCode) {
    //是否满足条件插入行    
    var isInsertRow = true;
    var node;
    if (fw.fwObject.FWObjectHelper.hasValue(mPBllModuleCode) && mPBllModuleCode == "-fw-") {
        node = $.page.idM.treegrid1.getRootNode();
        node.mBllModuleCode = "-fw-";
    } else {
        node = $.page.idM.treegrid1.getSelectedNode();
        if (!node) {
            isInsertRow = false;
            mini.alert("请选择一项！");
        };
    };
    //判断满足条件打开窗口
    if (isInsertRow && node) {
        var newNode = { name: "New Node" };
        if (fw.fwObject.FWObjectHelper.hasValue(node.children) && node.children.length > 0) {
            $.page.idM.treegrid1.addNode(newNode, "before", node.children[0]);
        } else {
            $.page.idM.treegrid1.addNode(newNode, "add", node);
        };
        $.page.idM.treegrid1.beginEditCell(newNode, "mBllModuleCode");
    };
};

//================保存，修改methodName值，与表名一致=========================
function insertOrUpdate() {



    $.page.idM.treegrid1.validate();
    if ($.page.idM.treegrid1.isValid() == false) {
        //alert("请校验输入单元格内容");
        var error = $.page.idM.treegrid1.getCellErrors()[0];
        $.page.idM.treegrid1.beginEditCell(error.record, error.column);
        return;
    };

    var mEntityList = $.page.idM.treegrid1.getChanges();
    var mEntityList = fw.fwObject.FWObjectHelper.emptyToNull(mEntityList);
    if (mEntityList.length == 0) {
        return;
    }

    $.page.idM.treegrid1.loading("保存中，请稍后......");
    //插入或者更新
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "insertOrUpdateMFWBllModuleListByMDataID"
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
                //treegrid加载数据
                treegrid1_Load();

            } else {
                mini.alert("保存失败！");

            };
        }
        , complete: function () {
            fw.fwButton.fwButtonHelper.removeWait($.page.idM.insertOrUpdate);
        }
    }));


};
//=========================================================




//====================删========================================
//删除选中项
function del(mBllModuleCodeList) {
    //获得选中项编码集合
    if (!fw.fwObject.FWObjectHelper.hasValue(mBllModuleCodeList)) {
        var rows = $.page.idM.treegrid1.getSelecteds();
        if (rows.length > 0) {
            mBllModuleCodeList = [];
            var entity;
            for (var i = 0; i < rows.length; i++) {
                entity = rows[i];
                if (fw.fwObject.FWObjectHelper.hasValue(entity.mBllModuleCode)) {
                    mBllModuleCodeList.push(entity.mBllModuleCode);
                } else {
                    $.page.idM.treegrid1.removeRows([rows[i]], true);
                };
            };
            if (mBllModuleCodeList.length < 1) {
                mBllModuleCodeList = undefined;
            };
        } else {
            mini.alert("请选择一项！");
        };
    };
    //判断选中了项
    if (mBllModuleCodeList) {
        mini.confirm("确定删除记录？", "确定？",
            function (action) {
                if (action == "ok") {
                    //删除
                    $.page.ajax($.page.getAjaxSettings({
                        serviceType: "crossDomainCall"
                        , serviceName: "sysManage"
                        , methodName: "deleteMFWBllModuleByMBllModuleCodeList"
                        , data: {
                            ticket: $.page.ticket
                            , mBllModuleCodeList: mBllModuleCodeList
                        }, beforeSend: function () {
                            fw.fwButton.fwButtonHelper.addWait($.page.idM.del);
                        }
                        , success: function (resultData) {
                            //判断删除成功
                            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                                //treegrid加载数据
                                treegrid1_Load();
                            };
                        }, complete: function () {
                            fw.fwButton.fwButtonHelper.removeWait($.page.idM.del);
                        }
                    }));
                };
            }
        );
    };
};
//================================================================================


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


//**********************同步数据*******************************
//同步模块
function syncModule() {
    var messageId;
    var msg = "确定要同步系统模块？";
    mini.confirm(msg, "确定？",
       function (action) {
           if (action == "ok") {
               $.page.ajax($.page.getAjaxSettings({
                   serviceType: "crossDomainCall"
                   , serviceName: "sysManage"
                   , methodName: "syncModuleMFWBllModule"
                   , data: {
                       ticket: $.page.ticket
                   }
                   , beforeSend: function () {
                       messageId = mini.loading("正在同步模块信息，请稍等...", "提醒");
                       fw.fwButton.fwButtonHelper.addWait($.page.idM.btnSyncModule);
                   }
                   , success: function (resultData) {
                       //判断启用停用成功
                       if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                           //datagrid加载数据
                           treegrid1_Load();
                           mini.alert("同步模块信息成功！");
                       };
                   }
                   , complete: function () {
                       mini.hideMessageBox(messageId);
                       fw.fwButton.fwButtonHelper.removeWait($.page.idM.btnSyncModule);
                   }
               }));
           };
       });
};


//同步功能
function syncFunction() {
    var messageId;
    var paramsData = {};
    paramsData.ticket= $.page.ticket;
    var mBllModuleName = '';
    //获取选中项对象
    var entity = $.page.idM.treegrid1.getSelected();
    //判断对象有值
    if (entity && fw.fwObject.FWObjectHelper.hasValue(entity)) {
        paramsData.mBllModuleCode = entity.mBllModuleCode;
        mBllModuleName = entity.mBllModuleName;
    };
    var msg = "确定要同步【" + mBllModuleName + "】节点的功能信息吗？";
    if (!fw.fwObject.FWObjectHelper.hasValue(mBllModuleName)) {
        msg = "您尚未选择节点，确定同步所有功能信息吗？";
    };
    mini.confirm(msg, "确定？",
       function (action) {
           if (action == "ok") {
               $.page.ajax($.page.getAjaxSettings({
                   serviceType: "crossDomainCall"
                , serviceName: "sysManage"
                , methodName: "syncModuleFunction"
                , data: paramsData
                , beforeSend: function () {
                    messageId = mini.loading("正在同步功能信息，请稍等...", "提醒");
                    fw.fwButton.fwButtonHelper.addWait($.page.idM.btnAync);
                }
                , success: function (resultData) {
                    //判断启用停用成功
                    if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                        //datagrid加载数据
                        treegrid1_Load();
                        mini.alert("同步功能成功！");
                    };
                }
                , complete: function () {
                    mini.hideMessageBox(messageId);
                    fw.fwButton.fwButtonHelper.removeWait($.page.idM.btnAync);
                }
               }));
           };
       });
};

