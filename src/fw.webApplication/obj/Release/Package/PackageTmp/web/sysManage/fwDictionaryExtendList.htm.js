﻿//页面初始化
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
        "mDictionaryTypeCode": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: {}
        }
    };
};

//查询条件
var conditionData = undefined;
//排除的选项选项集合（行对象）
var exceptNodes;

//页面加载
$.page.pageLoad = function () {

    //判断选择类型有值
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.selectType)) {
        //判断是单选
        if ($.page.params.selectType == fw.fwData.FWSelectType.Single) {
            $.page.idM.treegrid1.setMultiSelect(false);
        } else {
            $.page.idM.treegrid1.setMultiSelect(true);
        };
        //判断选择回调有值
        if (fw.fwObject.FWObjectHelper.hasValue($.page.params.selectCallback)) {
            //显示选择按钮
            $.page.idM.select.show();
        };
        //判断选择根节点回调有值
        if (fw.fwObject.FWObjectHelper.hasValue($.page.params.selectRootNodeCallback)) {
            //显示选择根节点按钮
            $.page.idM.selectRootNode.show();
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
    var mDictionaryTypeCode;
    var mDictionaryTypeName;
    //判断传入了字典类型编码
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mDictionaryTypeCode)) {
        //设置字典类型编码控件的值
        $.page.idM.mDictionaryTypeCode.setValue($.page.params.mDictionaryTypeCode);
    };
    //获取字典类型编码控件的名称
    mDictionaryTypeName = $.page.idM.mDictionaryTypeCode.getText();
    //没有值，说明字典类型编码不在给定的范围内
    if (!fw.fwObject.FWObjectHelper.hasValue(mDictionaryTypeName)) {
        //让字典类型编码控件选中第一个
        $.page.idM.mDictionaryTypeCode.select(0);
    };
    //获取字典类型编码控件的值
    mDictionaryTypeCode = $.page.idM.mDictionaryTypeCode.getValue();
    //获取字典类型编码控件的名称
    mDictionaryTypeName = $.page.idM.mDictionaryTypeCode.getText();
    //是否满足查询条件
    var isSearch = false;
    //判断有值
    if (fw.fwObject.FWObjectHelper.hasValue(mDictionaryTypeName)) {
        //判断没有传入了字典类型编码
        if (!fw.fwObject.FWObjectHelper.hasValue($.page.params.mDictionaryTypeCode)) {
            isSearch = true;
        } else {
            //传入了字典类型编码并且传入的编码在给定的范围内
            if (mDictionaryTypeCode == $.page.params.mDictionaryTypeCode) {
                isSearch = true;
                $.page.idJQ.mDictionaryTypeCodeLabel.hide();
                $.page.idM.mDictionaryTypeCode.hide();
            };
        };
    };

    //开始查询
    if (isSearch) {
        onSearch();
    } else {
        window.location.replace($.page.getAboutUrl());
    };
};

//查询
function onSearch() {
    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();
    //treegrid加载数据
    treegrid1_Load(1);
};

//单元格重绘
function treegrid1_DrawCell(e) {
    if (e.column.type == "checkcolumn") {
        if (fw.fwObject.FWObjectHelper.hasValue($.page.params.exceptMDataID) && fw.fwObject.FWObjectHelper.hasValue(exceptNodes)) {
            if (exceptNodes.indexOf(e.record) > -1) {
                e.cellHtml = ""
            };
        };
    };
};

//选中行前事件
function treegrid1_BeforeSelect(e) {
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.exceptMDataID) && e.record.mDataID == $.page.params.exceptMDataID) {
        if (exceptNodes.indexOf(e.record) > -1) {
            e.cancel = true;
        };
    };
};

var lastSelectedNode = null;

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
        $.page.idM.treegrid1.lastSelectedRowIndex = $.page.idM.treegrid1.indexOf(e.selected);
    };


};

//单元格渲染事件
function treegrid1_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "mName":
            html = "<a href=\"javascript:openInfo('query','" + e.record.mDataID + "')\" style=\"color:blue;\">" + e.value + "</a>";
            break;
        case "mIsDis":
            html = (fw.fwObject.FWObjectHelper.hasValue(e.value) && e.value == 1) ? "<label style=\"color:Red\">已停用</label>" : "<label style=\"color:Green\">已启用</label>";
            break;
        default:
            break;
    };
    return html;
};

//treegrid数据加载
function treegrid1_Load(pageIndex, pageSize) {
    exceptNodes = null;
    //开启treegrid数据加载锁屏
    $.page.idM.treegrid1.loading();
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "queryListMFWDictionary"
        , data: {
            ticket: $.page.ticket
            , mDictionaryTypeCode: conditionData.mDictionaryTypeCode
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                //设置treegrid数据
                $.page.idM.treegrid1.loadList(resultData.data);

                //当需要排除节点时，搜集节点
                if (fw.fwObject.FWObjectHelper.hasValue($.page.params.exceptMDataID)) {
                    //获取排除的选项
                    var exceptNode = $.page.idM.treegrid1.findRow(function (node) {
                        if (node.mDataID == $.page.params.exceptMDataID) {
                            return true;
                        };
                    });
                    //判断排除的选线不为空
                    if (exceptNode) {
                        //判断是根节点
                        if (exceptNode.mPCode == $.page.params.mDictionaryTypeCode) {
                            //隐藏选择根节点按钮
                            $.page.idM.selectRootNode.hide();
                        };
                        //获取所有子节点
                        var children = $.page.idM.treegrid1.getAllChildNodes(exceptNode);
                        //子节点作为排除项
                        exceptNodes = children;
                        //本身也作为排除项
                        exceptNodes.push(exceptNode);
                        //获取父节点
                        var parentNode = $.page.idM.treegrid1.getParentNode(exceptNode);
                        //父节点也作为排除项
                        exceptNodes.push(parentNode);
                    };
                };

                //选中最后选择的节点
                $.page.idM.treegrid1.selectNode(lastSelectedNode);
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
                changefirst($.page.idM.treegrid1);
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


//打开信息窗口
function openInfo(action, mPCode, mDataID) {
    //是否满足条件打开窗口
    var isOpen = true;
    //打开窗口传入的数据
    var data = {
        ticket: $.page.ticket
        , action: action
        , mDictionaryTypeCode: conditionData.mDictionaryTypeCode
    };
    if (fw.fwObject.FWObjectHelper.hasValue(mPCode) && mPCode == "-fw-") {
        mPCode = data.mDictionaryTypeCode;
    };
    //判断传入了记录编码
    if (fw.fwObject.FWObjectHelper.hasValue(mDataID)) {
        data.mDataID = mDataID;
    } else {
        //判断是修改或者是查看信息
        if (action == "update" || action == "query") {
            //获取选中项编码
            mDataID = getMDataID();
            //判断选中了项
            if (mDataID && fw.fwObject.FWObjectHelper.hasValue(mDataID)) {
                data.mDataID = mDataID;
            } else {
                isOpen = false;
            };
        } else {
            //判断不是新增
            if (action != "insert") {
                isOpen = false;
            } else {
                if (!fw.fwObject.FWObjectHelper.hasValue(mPCode)) {
                    var entity = getSelectedEntity();
                    if (entity && fw.fwObject.FWObjectHelper.hasValue(entity)) {
                        mPCode = entity.mCode;
                    } else {
                        isOpen = false;
                    };
                };
                data.mPCode = mPCode;
            };
        };
    };
    //判断满足条件打开窗口
    if (isOpen) {
        //获得传入的参数字符串 
        var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwDictionary.htm", $.page.webSiteRootUrl), data); 

        //打开窗口
        mini.open({
            url: pageUrl
            , title: "字典信息"
            , width: 384
            , height: 256
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
    };
};

//移动节点
function moveNode(action, mDataID) {
    if (action == "up" || action == "down") {
        var node, parentNode, children, index, targetNode;
        if (action == "up") {
            //获取当前选中节点
            node = getSelectedEntity();
            if (node) {
                //获取父节点
                parentNode = $.page.idM.treegrid1.getParentNode(node);
                //获取子节点
                children = $.page.idM.treegrid1.getChildNodes(parentNode);
                //选中节点在子节点里的位置
                index = children.indexOf(node);
                if (index > 0) {
                    //获取目标节点
                    targetNode = children[index - 1];
                    //移到目标节点上面
                    $.page.idM.treegrid1.moveNode(node, targetNode, "before");
                };
            };
        } else if (action == "down") {
            node = getSelectedEntity();
            //获取当前选中节点
            if (node) {
                //获取父节点
                parentNode = $.page.idM.treegrid1.getParentNode(node);
                //获取子节点
                children = $.page.idM.treegrid1.getChildNodes(parentNode);
                //选中节点在子节点里的位置
                index = children.indexOf(node);
                if (index < children.length - 1) {
                    //获取目标节点
                    targetNode = children[index + 1];
                    //移到目标节点下面
                    $.page.idM.treegrid1.moveNode(node, targetNode, "after");
                };
            };
        };
        if (fw.fwObject.FWObjectHelper.hasValue(children) && children.length > 0) {
            var mEntityList = [];
            for (var i = 0; i < children.length; i++) {
                mEntityList.push({
                    mDataID: children[i].mDataID
                    , mDictionaryTypeCode: children[i].mDictionaryTypeCode
                    , mIx: i + 1
                });
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
                , methodName: "insertOrUpdateMFWDictionaryListByMDataID"
                , data: {
                    ticket: $.page.ticket
                    , mEntityList: mEntityList
                }
                , beforeSend: function () {
                    fw.fwButton.fwButtonHelper.addWait($.page.idM.moveNodeUp);
                    fw.fwButton.fwButtonHelper.addWait($.page.idM.moveNodeDown);
                }
                , success: function (resultData) {
                    if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                        mini.unmask(document.body);
                        //treegrid加载数据
                        treegrid1_Load();
                    };
                }
                , complete: function () {
                    fw.fwButton.fwButtonHelper.removeWait($.page.idM.moveNodeUp);
                    fw.fwButton.fwButtonHelper.removeWait($.page.idM.moveNodeDown);
                }
            }));
        };
    } else if (action = "out") {
        //是否满足条件打开窗口
        var isOpen = true;
        //参数
        var data = {
            ticket: $.page.ticket
            , selectType: fw.fwData.FWSelectType.Single
            , selectCallback: "moveNodeSelectCallback"
            , selectRootNodeCallback: "moveNodeSelectCallback"
            , mDictionaryTypeCode: conditionData.mDictionaryTypeCode
        };
        if (!fw.fwObject.FWObjectHelper.hasValue(mDataID)) {
            mDataID = getMDataID();
            if (mDataID && fw.fwObject.FWObjectHelper.hasValue(mDataID)) {
                data.exceptMDataID = mDataID;
            } else {
                isOpen = false;
            };
        };
        //判断满足条件打开窗口
        if (isOpen) {
            //参数序列化 
            var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwDictionaryList.htm", $.page.webSiteRootUrl), data); 

            //打开选择节点窗口
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
    };
};
//选择节点完成后回调
function moveNodeSelectCallback(moveToEntity) {
    if (fw.fwObject.FWObjectHelper.hasValue(moveToEntity)) {
        //获取选中项对象
        var entity = getSelectedEntity();
        //判断对象有值
        if (entity && fw.fwObject.FWObjectHelper.hasValue(entity)) {
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall"
                , serviceName: "sysManage"
                , methodName: "updateMFWDictionaryByMDataIDList"
                , data: {
                    ticket: $.page.ticket
                    , mEntity: {
                        mDictionaryTypeCode: moveToEntity.mDictionaryTypeCode
                        , mPCode: moveToEntity.mCode
                    }
                    , mDataIDList: [entity.mDataID]
                }
                , beforeSend: function () {
                    fw.fwButton.fwButtonHelper.addWait($.page.idM.moveNodeOut);
                }
                , success: function (resultData) {
                    //判断移动节点成功
                    if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                        //treegrid加载数据
                        treegrid1_Load();
                    };
                }
                , complete: function () {
                    fw.fwButton.fwButtonHelper.removeWait($.page.idM.moveNodeOut);
                }
            }));
        };
    };
};

//启用停用选中项
function able(mIsDis, mDataIDList) {
    //获得选中项编码集合
    if (!fw.fwObject.FWObjectHelper.hasValue(mDataIDList)) {
        mDataIDList = getMDataIDList();
    };
    //判断选中了项
    if (mDataIDList) {
        mini.confirm("确定" + (mIsDis == 1 ? "停用" : "启用") + "记录？", "确定？",
            function (action) {
                if (action == "ok") {
                    //启用停用
                    $.page.ajax($.page.getAjaxSettings({
                        serviceType: "crossDomainCall"
                        , serviceName: "sysManage"
                        , methodName: "updateMFWDictionaryByMDataIDList"
                        , data: {
                            ticket: $.page.ticket
                            , mEntity: {
                                mIsDis: mIsDis
                            }
                            , mDataIDList: mDataIDList
                        }
                        , beforeSend: function () {
                            fw.fwButton.fwButtonHelper.addWait($.page.idM.enable);
                            fw.fwButton.fwButtonHelper.addWait($.page.idM.disable);
                        }
                        , success: function (resultData) {
                            //判断启用停用成功
                            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                                //treegrid加载数据
                                treegrid1_Load();
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
                        , methodName: "deleteMFWDictionaryByMDataIDList"
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
                                treegrid1_Load();
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
//选择根节点
function selectRootNode() {
    //判断选择类型以及选择回调方法有值
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.selectType) && fw.fwObject.FWObjectHelper.hasValue($.page.params.selectRootNodeCallback)) {
        //调用选择清除回调方法
        fw.callFunction(fw.openWindow(), $.page.params.selectRootNodeCallback, [{ mDictionaryTypeCode: conditionData.mDictionaryTypeCode, mCode: conditionData.mDictionaryTypeCode}]);
        //关闭窗口
        fw.closeWindow();
    };
};
//选择清除
function selectClear() {
    //判断选择类型以及选择回调方法有值
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.selectType) && fw.fwObject.FWObjectHelper.hasValue($.page.params.selectClearCallback)) {
        //调用选择清除回调方法
        fw.callFunction(fw.openWindow(), $.page.params.selectClearCallback, []);
        //关闭窗口
        fw.closeWindow();
    };
};