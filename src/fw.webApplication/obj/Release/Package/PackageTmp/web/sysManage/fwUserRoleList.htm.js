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

    //开始查询
    onSearch();

    $.page.idM.treegrid1.on("dragstart", function (e) {
        e.dragText = e.nodes[0].mRoleName;
    });

    mini.layout();
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
        $.page.idM.treegrid1.lastSelectedRowIndex = $.page.idM.treegrid1.indexOf(e.selected);
    };
};
//查询
function onSearch() {
    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mUserIDList)) {
        conditionData.mUserIDList = fw.fwJson.FWJsonHelper.deserializeObject($.page.params.mUserIDList)
    };
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
                    , methodName: "updateMFWUserRoleByMDataIDList"
                    , data: {
                        ticket: $.page.ticket
                        , mEntity: {
                            mPRoleCode: e.dropNode.mRoleCode
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
                            , mPRoleCode: e.dropNode.mPRoleCode
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
                    , methodName: "insertOrUpdateMFWUserRoleListByMDataID"
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

//单元格渲染事件
function treegrid1_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "mRoleName":
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
    //开启treegrid数据加载锁屏
    $.page.idM.treegrid1.loading();
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "queryListMFWUserRole"
        , data: {
            ticket: $.page.ticket
            , queryParams: conditionData
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                //设置treegrid数据
                $.page.idM.treegrid1.loadList(resultData.data);

                for (var i = 0; i < resultData.data.length; i++) {
                    if (resultData.data[i].mIsHas == 1) {
                        $.page.idM.treegrid1.selectNode(resultData.data[i]);
                    };
                };
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

//获得选中项编码集合
function getMRoleCodeList() {
    var mRoleCodeList = undefined;
    //获取选中项对象集合
    var entityList = getSelectedEntityList();
    //判断对象集合有值
    if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
        mRoleCodeList = [];
        for (var i = 0; i < entityList.length; i++) {
            mRoleCodeList.push(entityList[i].mRoleCode);
        };
    };
    return mRoleCodeList;
};

//#region 如果选择的数量大于2时，不能修改
function onSelectionChanged() {
    var row = $.page.idM.treegrid1.getSelecteds();
    if (row.length > 1) {
        $.page.idM.buttonEdit.disable();
    } else {
        $.page.idM.buttonEdit.enable();
    }
}
//#endregion

//打开信息窗口
function openInfo(action, mPRoleCode, mDataID) {
    //是否满足条件打开窗口
    var isOpen = true;
    //打开窗口传入的数据
    var data = {
        ticket: $.page.ticket
        , action: action
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
                if (!fw.fwObject.FWObjectHelper.hasValue(mPRoleCode)) {
                    var entity = getSelectedEntity();
                    if (entity && fw.fwObject.FWObjectHelper.hasValue(entity)) {
                        mPRoleCode = entity.mRoleCode;
                    } else {
                        isOpen = false;
                    };
                };
                data.mPRoleCode = mPRoleCode;
            };
        };
    };
    //判断满足条件打开窗口
    if (isOpen) {
        //获得传入的参数字符串 
        var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwUserRole.htm", $.page.webSiteRootUrl), data); 
        //打开窗口
        mini.open({
            url: pageUrl
            , title: "角色信息"
            , width: 600
            , height: 460
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
                        , methodName: "updateMFWUserRoleByMDataIDList"
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
                        , methodName: "deleteMFWUserRoleByMDataIDList"
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


//打开分配功能窗口
function openSetFunction(mRoleCodeList) {
    //获得选中项编码集合
    if (!fw.fwObject.FWObjectHelper.hasValue(mRoleCodeList)) {
        mRoleCodeList = getMRoleCodeList();
    };
    //判断选中了项
    if (mRoleCodeList) {
        var data = {
            ticket: $.page.ticket
            , selectType: fw.fwData.FWSelectType.All
            , selectCallback: "openSetFunctionCallback"
            , mRoleCodeList: fw.fwJson.FWJsonHelper.serializeObject(mRoleCodeList)
        };
        //获得传入的参数字符串 
        var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwFunctionSelect.htm", $.page.webSiteRootUrl), data); 
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
    var mRoleCodeList = getMRoleCodeList();
    if (mRoleCodeList) {
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
            , methodName: "updateMFWRoleMappingFunctionByMRoleCodeListInsertMFunctionCodeListDeleteMFunctionCodeList"
            , data: {
                ticket: $.page.ticket
                , mRoleCodeList: mRoleCodeList
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

//打开分配菜单窗口
function openSetMenu(mRoleCodeList) {
    //获得选中项编码集合
    if (!fw.fwObject.FWObjectHelper.hasValue(mRoleCodeList)) {
        mRoleCodeList = getMRoleCodeList();
    };
    //判断选中了项
    if (mRoleCodeList) {
        var data = {
            ticket: $.page.ticket
            , selectType: fw.fwData.FWSelectType.All
            , selectCallback: "openSetMenuCallback"
            , mRoleCodeList: fw.fwJson.FWJsonHelper.serializeObject(mRoleCodeList)
        };
        //获得传入的参数字符串 
        var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwMenuSelect.htm", $.page.webSiteRootUrl), data); 
        //打开窗口
        mini.open({
            url: pageUrl
            , title: "选择列表"
            , width: 384
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
//分配菜单
function openSetMenuCallback(entityList) {
    var mRoleCodeList = getMRoleCodeList();
    if (mRoleCodeList) {
        var insertMMenuCodeList = [];
        var deleteMMenuCodeList = [];
        if (entityList != null && entityList.length > 0) {
            for (var i = 0; i < entityList.length; i++) {
                entityList[i].isChecked = entityList[i].checked ? 1 : 0;
                if (entityList[i].isChecked != entityList[i].mIsHas) {
                    if (entityList[i].isChecked == 1) {
                        insertMMenuCodeList.push(entityList[i].mMenuCode);
                    } else {
                        deleteMMenuCodeList.push(entityList[i].mMenuCode);
                    };
                };
            };
        };
        //分配菜单
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "sysManage"
            , methodName: "updateMFWRoleMappingMenuByMRoleCodeListInsertMMenuCodeListDeleteMMenuCodeList"
            , data: {
                ticket: $.page.ticket
                , mRoleCodeList: mRoleCodeList
                , insertMMenuCodeList: insertMMenuCodeList
                , deleteMMenuCodeList: deleteMMenuCodeList
            }
            , beforeSend: function () {
                fw.fwButton.fwButtonHelper.addWait($.page.idM.openSetMenu);
            }
            , success: function (resultData) {
                //判断启用停用成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                    //datagrid加载数据
                    mini.alert("分配菜单成功！");
                };
            }
            , complete: function () {
                fw.fwButton.fwButtonHelper.removeWait($.page.idM.openSetMenu);
            }
        }));
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
        } else if ($.page.params.selectType == fw.fwData.FWSelectType.All) {
            var entityList = $.page.idM.treegrid1.findRows();
            for (var i = 0; i < entityList.length; i++) {
                if ($.page.idM.treegrid1.isSelected(entityList[i])) {
                    entityList[i].checked = true;
                };
            };
            //调用回调方法
            fw.callFunction(fw.openWindow(), $.page.params.selectCallback, [entityList]);
            //关闭窗口
            fw.closeWindow();
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

//同步组织机构
function syncOrganization(mRoleCode) {
    var messageId;
    var mRoleName = "";
    //获取选中项对象
    var entity = $.page.idM.treegrid1.getSelected();
    //判断对象有值
    if (entity && fw.fwObject.FWObjectHelper.hasValue(entity)) {
        mRoleCode = entity.mRoleCode;
        mRoleName = entity.mRoleName;
    };
    var msg = "确定要同步组织机构到【" + mRoleName + "】节点下吗？";
    if (!fw.fwObject.FWObjectHelper.hasValue(mRoleCode)) {
        msg = "您尚未选择节点，确定同步到根节点吗？";
    };
    mini.confirm(msg, "确定？",
       function (action) {
           if (action == "ok") {
               $.page.ajax($.page.getAjaxSettings({
                   serviceType: "crossDomainCall"
                   , serviceName: "sysManage"
                   , methodName: "syncOrganizationMFWUserRoleByMRoleCode"
                   , data: {
                       ticket: $.page.ticket
                       , mRoleCode: mRoleCode
                   }
                   , beforeSend: function () {
                       messageId = mini.loading("正在同步组织机构，请稍等...", "提醒");
                       fw.fwButton.fwButtonHelper.addWait($.page.idM.btnAync);
                   }
                   , success: function (resultData) {
                       //判断启用停用成功
                       if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                           //datagrid加载数据
                           treegrid1_Load();
                           mini.alert("同步组织机构成功！");
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

//打开分配字典窗口
function openSetDictionary(mRoleCodeList) {
    //获得选中项编码集合
    if (!fw.fwObject.FWObjectHelper.hasValue(mRoleCodeList)) {
        mRoleCodeList = getMRoleCodeList();
    };
    //判断选中了项
    if (mRoleCodeList) {
        var data = {
            ticket: $.page.ticket
            , selectType: fw.fwData.FWSelectType.All
            , selectCallback: "openSetMenuCallback"
            , mRoleCodeList: fw.fwJson.FWJsonHelper.serializeObject(mRoleCodeList)
        };
        //获得传入的参数字符串 
        var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwDictionarySelect.htm", $.page.webSiteRootUrl), data); 
        //打开窗口
        mini.open({
            url: pageUrl
            , title: "选择列表"
            , width: 820
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