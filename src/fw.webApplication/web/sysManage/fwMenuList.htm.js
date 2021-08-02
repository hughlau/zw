//页面初始化
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
        "mMenuTypeCode": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "FWMenuType" }
        }
    };
};

//查询条件
var conditionData = undefined;
//排除的选项选项集合（行对象）
var exceptNodes;
var isFirst = true;
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
    $.page.idM.mMenuTypeCode.setValue($.page.params.mMenuTypeCode);
    if (!$.page.idM.mMenuTypeCode.getValue()) {
        $.page.idM.mMenuTypeCode.select(0);
    };
    if (!$.page.idM.mMenuTypeCode.getValue()) {
        mini.alert("请先添加菜单类型！菜单类型编码为\"FWMenuType\"", undefined, function () {
            window.location.replace($.page.getAboutUrl());
        });
    };

    //开始查询
    onSearch();
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
        if (fw.fwObject.FWObjectHelper.hasValue($.page.params.exceptMMenuCode) && fw.fwObject.FWObjectHelper.hasValue(exceptNodes)) {
            if (exceptNodes.indexOf(e.record) > -1) {
                e.cellHtml = ""
            };
        };
    };
};

//选中行前事件
function treegrid1_BeforeSelect(e) {
    //被排除的行不能选中
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.exceptMMenuCode) && fw.fwObject.FWObjectHelper.hasValue(exceptNodes)) {
        if (exceptNodes.indexOf(e.record) > -1) {
            e.cancel = true;
        };
    };
};

var lastSelectedNode = null;
//行选择改变时
function datagrid1_SelectionChanged(e) {
    lastSelectedNode = e.selected;
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
        case "mMenuName":
            html = "<a href=\"javascript:openInfo('query','" + e.record.mMenuCode + "')\" style=\"color:blue;\">" + e.value + "</a>";
            break;
        case "mIsHtmlPage":
            html = (fw.fwObject.FWObjectHelper.hasValue(e.value) && e.value == 1) ? "是" : "否";
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
        , methodName: "queryListMFWMenu"
        , data: {
            ticket: $.page.ticket
            , mMenuTypeCode: conditionData.mMenuTypeCode
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                //设置treegrid数据
                $.page.idM.treegrid1.loadList(resultData.data);

                //当需要排除节点时，搜集节点
                if (fw.fwObject.FWObjectHelper.hasValue($.page.params.exceptMMenuCode)) {
                    //获取排除的选项
                    var exceptNode = $.page.idM.treegrid1.findRow(function (node) {
                        if (node.mMenuCode == $.page.params.exceptMMenuCode) {
                            return true;
                        };
                    });
                    //判断排除的选线不为空
                    if (exceptNode) {
                        //判断是根节点
                        if (exceptNode.mPMenuCode == "-fw-") {
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
                if(isFirst){
                    changefirst($.page.idM.treegrid1);
                    isFirst = false;
                }	
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
function getMMenuCode() {
    var mMenuCode = undefined;
    //获取选中项对象
    var entity = getSelectedEntity();
    //判断对象有值
    if (entity && fw.fwObject.FWObjectHelper.hasValue(entity)) {
        mMenuCode = entity.mMenuCode;
    };
    return mMenuCode;
};

//获得选中项编码集合
function getMMenuCodeList() {
    var mMenuCodeList = undefined;
    //获取选中项对象集合
    var entityList = getSelectedEntityList();
    //判断对象集合有值
    if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
        mMenuCodeList = [];
        for (var i = 0; i < entityList.length; i++) {
            mMenuCodeList.push(entityList[i].mMenuCode);
        };
    };
    return mMenuCodeList;
};

//打开信息窗口
function openInfo(action, mPMenuCode, mMenuCode) {
    //是否满足条件打开窗口
    var isOpen = true;
    //打开窗口传入的数据
    var data = {
        ticket: $.page.ticket
        , action: action
        , mMenuTypeCode: conditionData.mMenuTypeCode
    };
    //判断传入了记录编码
    if (fw.fwObject.FWObjectHelper.hasValue(mMenuCode)) {
        data.mMenuCode = mMenuCode;
    } else {
        //判断是修改或者是查看信息
        if (action == "update" || action == "query") {
            //获取选中项编码
            mMenuCode = getMMenuCode();
            //判断选中了项
            if (mMenuCode && fw.fwObject.FWObjectHelper.hasValue(mMenuCode)) {
                data.mMenuCode = mMenuCode;
            } else {
                isOpen = false;
            };
        } else {
            //判断不是新增
            if (action != "insert") {
                isOpen = false;
            } else {
                if (!fw.fwObject.FWObjectHelper.hasValue(mPMenuCode)) {
                    var entity = getSelectedEntity();
                    if (entity && fw.fwObject.FWObjectHelper.hasValue(entity)) {
                        mPMenuCode = entity.mMenuCode;
                    } else {
                        isOpen = false;
                    };
                };
                data.mPMenuCode = mPMenuCode;
            };
        };
    };
    //判断满足条件打开窗口
    if (isOpen) {
        //获得传入的参数字符串 
        var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwMenu.htm", $.page.webSiteRootUrl), data); 

        //打开窗口
        mini.open({
            url: pageUrl
            , title: "菜单信息"
            , width: 870
            , height: 612
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
function moveNode(action, mMenuCode) {
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
                    mMenuCode: children[i].mMenuCode
                    , mMenuTypeCode: children[i].mMenuTypeCode
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
                , methodName: "insertOrUpdateMFWMenuListByMMenuCode"
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
            , mMenuTypeCode: conditionData.mMenuTypeCode
        };
        if (!fw.fwObject.FWObjectHelper.hasValue(mMenuCode)) {
            mMenuCode = getMMenuCode();
            if (mMenuCode && fw.fwObject.FWObjectHelper.hasValue(mMenuCode)) {
                data.exceptMMenuCode = mMenuCode;
            } else {
                isOpen = false;
            };
        };
        //判断满足条件打开窗口
        if (isOpen) {
            //参数序列化 
            var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwMenuList.htm", $.page.webSiteRootUrl), data); 

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
                , methodName: "updateMFWMenuByMMenuCodeList"
                , data: {
                    ticket: $.page.ticket
                    , mEntity: {
                        mMenuTypeCode: moveToEntity.mMenuTypeCode
                        , mPMenuCode: moveToEntity.mMenuCode
                    }
                    , mMenuCodeList: [entity.mMenuCode]
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
function able(mIsDis, mMenuCodeList) {
    //获得选中项编码集合
    if (!fw.fwObject.FWObjectHelper.hasValue(mMenuCodeList)) {
        mMenuCodeList = getMMenuCodeList();
    };
    //判断选中了项
    if (mMenuCodeList) {
        mini.confirm("确定" + (mIsDis == 1 ? "停用" : "启用") + "记录？", "确定？",
            function (action) {
                if (action == "ok") {
                    //启用停用
                    $.page.ajax($.page.getAjaxSettings({
                        serviceType: "crossDomainCall"
                        , serviceName: "sysManage"
                        , methodName: "updateMFWMenuByMMenuCodeList"
                        , data: {
                            ticket: $.page.ticket
                            , mEntity: {
                                mIsDis: mIsDis
                            }
                            , mMenuCodeList: mMenuCodeList
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
function del(mMenuCodeList) {
    //获得选中项编码集合
    if (!fw.fwObject.FWObjectHelper.hasValue(mMenuCodeList)) {
        mMenuCodeList = getMMenuCodeList();
    };
    //判断选中了项
    if (mMenuCodeList) {
        mini.confirm("确定删除记录？", "确定？",
            function (action) {
                if (action == "ok") {
                    //删除
                    $.page.ajax($.page.getAjaxSettings({
                        serviceType: "crossDomainCall"
                        , serviceName: "sysManage"
                        , methodName: "deleteMFWMenuByMMenuCodeList"
                        , data: {
                            ticket: $.page.ticket
                            , mMenuCodeList: mMenuCodeList
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
        fw.callFunction(fw.openWindow(), $.page.params.selectRootNodeCallback, [{ mMenuTypeCode: conditionData.mMenuTypeCode, mMenuCode: "-fw-"}]);
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


//打开分配功能窗口
function openSetFunction(mMenuCodeList) {
    //获得选中项编码集合
    if (!fw.fwObject.FWObjectHelper.hasValue(mMenuCodeList)) {
        mMenuCodeList = getMMenuCodeList();
    };
    //判断选中了项
    if (mMenuCodeList) {
        var data = {
            ticket: $.page.ticket
            , selectType: fw.fwData.FWSelectType.All
            , selectCallback: "openSetFunctionCallback"
            , mMenuCodeList: fw.fwJson.FWJsonHelper.serializeObject(mMenuCodeList)
        };
        //获得传入的参数字符串 
        var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwUpdatePassword.htm", $.page.webSiteRootUrl), data); 

        //打开窗口
        mini.open({
            url: pageUrl
            , title: "选择列表"
            , width: 768
            , height: 512
            , onload: function () {
                //var iframe = this.getIFrameEl();
                //iframe.contentWindow;
            }
            , ondestroy: function (action) {
                //判断非（关闭和取消）窗口
                if (action != "close" && action != "cancel") {
                    //datagrid加载数据
                    treegrid1_Load(1);
                };
            }
        });
    };
};
//分配功能
function openSetFunctionCallback(entityList) {
    var mMenuCodeList = getMMenuCodeList();
    if (mMenuCodeList) {
        var insertMFunctionCodeList = [];
        var deleteMFunctionCodeList = [];
        if (entityList != null && entityList.length > 0) {
            for (var i = 0; i < entityList.length; i++) {
                entityList[i].isChecked = entityList[i].checked ? 1 : 0;
                if (entityList[i].isChecked != entityList[i].mIsHas) {
                    if (entityList[i].isChecked == 1) {
                        insertMFunctionCodeList.push(entityList[i].mFunctionCode);
                    } else {
                        deleteMFunctionCodeList.push(entityList[i].mFunctionCode);
                    };
                };
            };
        };
        //分配功能
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "sysManage"
            , methodName: "updateMFWMenuMappingFunctionByMenuCodeListInsertMFunctionCodeListDeleteMFunctionCodeList"
            , data: {
                ticket: $.page.ticket
                , mMenuCodeList: mMenuCodeList
                , insertMFunctionCodeList: insertMFunctionCodeList
                , deleteMFunctionCodeList: deleteMFunctionCodeList
            }
            , beforeSend: function () {
                fw.fwButton.fwButtonHelper.addWait($.page.idM.openSetFunction);
            }
            , success: function (resultData) {
                //判断启用停用成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                    //datagrid加载数据
                    mini.alert("分配功能成功！");
                };
            }
            , complete: function () {
                fw.fwButton.fwButtonHelper.removeWait($.page.idM.openSetFunction);
            }
        }));
    };
};
