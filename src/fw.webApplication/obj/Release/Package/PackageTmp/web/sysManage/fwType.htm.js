
var mEntity = null;

//#region 页面初始化
$.page.pageInit = function () {
    $.page.dataSourceSettingsDictionary = {
        "mObjType": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "FWObjType" }
        },
        "mObjType111": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "FWObjType" }
        }
    };
};
//#endregion

//页面加载
$.page.pageLoad = function () {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mMetadataToken)) {
        //查询信息
        query($.page.params.mMetadataToken);
    };


};

function mObjType_onvaluechanged() {
    var mObjType = $.page.idM.mObjType.getValue();
    if (mObjType == fw.fwData.FWObjType.T || mObjType == fw.fwData.FWObjType.V) {
        $(".dbPropertys").hide();
        $.page.idJQ.fieldsetMethod.appendTo($.page.idJQ.editform);
        $.page.idM.datagridMFWPropertyInfo.showColumn("mMapName");
        $.page.idM.datagridMFWPropertyInfo.showColumn("mDataLen");
        $.page.idM.datagridMFWPropertyInfo.showColumn("mIsPK");
        $.page.idM.datagridMFWPropertyInfo.showColumn("mIsUpdateResetDefaultValue");
        $.page.idM.datagridMFWPropertyInfo.hideColumn("mTestValue");
    } else if (mObjType == fw.fwData.FWObjType.M) {
        $(".dbPropertys").show();
        $.page.idJQ.fieldsetMethod.appendTo($.page.idJQ.editform);
        $.page.idM.datagridMFWPropertyInfo.hideColumn("mMapName");
        $.page.idM.datagridMFWPropertyInfo.hideColumn("mDataLen");
        $.page.idM.datagridMFWPropertyInfo.hideColumn("mIsPK");
        $.page.idM.datagridMFWPropertyInfo.hideColumn("mIsUpdateResetDefaultValue");
        $.page.idM.datagridMFWPropertyInfo.hideColumn("mTestValue");
    } else {
        $(".dbPropertys").hide();
        $.page.idJQ.fieldsetProperty.appendTo($.page.idJQ.editform);
        $.page.idM.datagridMFWPropertyInfo.hideColumn("mMapName");
        $.page.idM.datagridMFWPropertyInfo.hideColumn("mDataLen");
        $.page.idM.datagridMFWPropertyInfo.hideColumn("mIsPK");
        $.page.idM.datagridMFWPropertyInfo.hideColumn("mIsUpdateResetDefaultValue");
        $.page.idM.datagridMFWPropertyInfo.hideColumn("mTestValue");
    };
};

function mPropertyType_ondrawcell(e) {
    e.cellHtml = fw.fwString.FWStringHelper.toHtml(e.value, ["<", ">"]);
};
function mPropertyType_onkeyup(e) {
    if (e.htmlEvent.keyCode != 38 && e.htmlEvent.keyCode != 40) {
        var lastText = e.sender.lastText;
        var nowText = e.sender.getText();
        if (nowText != lastText) {
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall"
                , serviceName: "sysManage"
                , methodName: "queryPageMFWType"
                , data: {
                    ticket: $.page.ticket
                    , pageParams: {
                        pageSize: 20
                        , pageIndex: 1
                        , sortFieldList: null
                    }
                    , keyword: nowText
                }
                , success: function (resultData) {
                    //判断加载数据成功
                    if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                        e.sender.lastText = nowText;
                        //设置datagrid数据
                        //e.sender.setData(resultData.data.entityList);
                        e.sender.setData(resultData.data.entityList);
                    };
                }
            }));
        };
    };
};


//关闭窗口
function CloseWindow(action) {
    //判断数据被修改
    if (action == "close" && $.page.idM.editform.isChanged()) {
        if (confirm("数据被修改了，是否先保存？")) {
            return false;
        };
    };
    if (window.CloseOwnerWindow) {
        return window.CloseOwnerWindow(action);
    } else {
        window.close();
    };
};

//取消
function onCancel() {
    //关闭窗口
    CloseWindow("cancel");
};

//查询信息
function query(mMetadataToken) {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue(mMetadataToken)) {
        //查询信息
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "sysManage"
            , methodName: "queryMFWTypeByMMetadataToken"
            , data: {
                ticket: $.page.ticket
                , mMetadataToken: mMetadataToken
            }
            , success: function (resultData) {
                //判断查询信息成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                    mEntity = resultData.data;
                    //设置表单值
                    $.page.idM.editform.setData(mEntity);

                    onSearchMFWPropertyInfo();

                    onSearchMFWMethodInfo();

                    $.page.idM.mObjType.doValueChanged();
                } else {
                    mini.alert("该数据不存在！", undefined, function () {
                        CloseWindow("cancel");
                    });
                };
            }
        }));
    };
};
//插入或者更新
function insertOrUpdate() {
    //表单验证
    $.page.idM.editform.validate();
    //判断表单验证不成功
    if ($.page.idM.editform.isValid() == false) { return; };
    //获取表单数据
    var data = fw.fwObject.FWObjectHelper.emptyToNull($.page.idM.editform.getData());
    data.mMetadataToken = mEntity.mMetadataToken;
    //插入或者更新
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall",
        serviceName: "sysManage",
        methodName: "insertOrUpdateMFWTypeByMMetadataToken",
        data: {
            ticket: $.page.ticket,
            mEntity: data
        },
        success: function (resultData) {
            //判断插入或者更新成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                //关闭窗口
                if (data.mName != mEntity.mName) {
                    fw.openWindow().onRefreshType($.page.params.mMetadataToken, data.mName);
                    CloseWindow("insertOrUpdate");
                };
            } else {
                mini.alert("保存失败！");
            };
        },
        beforeSend: function () {
            fw.fwButton.fwButtonHelper.addWait($.page.idM.insertOrUpdate);
        },
        complete: function () {
            fw.fwButton.fwButtonHelper.removeWait($.page.idM.insertOrUpdate);
        }
    }));
};


//打开信息窗口
function openInfoType(action, mMetadataToken, name) {
    //是否满足条件打开窗口
    var isOpen = true;
    //打开窗口传入的数据
    var data = {
        ticket: $.page.ticket
        , action: action
    };
    //判断传入了记录编码
    if (fw.fwObject.FWObjectHelper.hasValue(mMetadataToken)) {
        data.mMetadataToken = mMetadataToken;
    } else {
        //判断是修改或者是查看信息
        if (action == "update" || action == "query") {
            //获取选中项编码
            mMetadataToken = getMethodMMetadataToken();
            //判断选中了项
            if (mMetadataToken && fw.fwObject.FWObjectHelper.hasValue(mMetadataToken)) {
                data.mMetadataToken = mMetadataToken;
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
        if ($.isFunction(fw.openWindow().showTab)) {
            fw.openWindow().showTab({
                _id: data.mMetadataToken
                , name: fw.fwString.FWStringHelper.toHtml(name, ["<", ">"])
                , mMetadataToken: data.mMetadataToken
                , mObjType: "O"
            });
        } else {
            //获得传入的参数字符串 
            var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwType.htm", $.page.webSiteRootUrl), data); 
            //打开窗口
            mini.open({
                url: pageUrl
                , title: "登录用户信息"
                , width: 640
                , height: 512
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
};


//打开信息窗口
function openInfoMethod(action, mMetadataToken) {
    //是否满足条件打开窗口
    var isOpen = true;
    //打开窗口传入的数据
    var data = {
        ticket: $.page.ticket
        , action: action
    };
    //判断传入了记录编码
    if (fw.fwObject.FWObjectHelper.hasValue(mMetadataToken)) {
        data.mMetadataToken = mMetadataToken;
    } else {
        //判断是修改或者是查看信息
        if (action == "update" || action == "query") {
            //获取选中项编码
            mMetadataToken = getMethodMMetadataToken();
            //判断选中了项
            if (mMetadataToken && fw.fwObject.FWObjectHelper.hasValue(mMetadataToken)) {
                data.mMetadataToken = mMetadataToken;
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
        var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwMethodInfo.htm", $.page.webSiteRootUrl), data); 
        //打开窗口
        mini.open({
            url: pageUrl
            , title: "登录用户信息"
            , width: 640
            , height: 512
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


//$(window).load(function () {

//    view($.page.params.mapName);

//});

//function view(mapName) {
//    $.page.idM.editform.setData({});
//    $.page.idM.editform.setChanged(false);
//};

function openMethodInfo(action, objID) {
    var data = {
        ticket: $.page.ticket
        , action: action
    };
    if (action == "update") {
        data.objID = objID;
    }; 
    var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwMethodInfo.htm", $.page.webSiteRootUrl), data); 
    mini.open({
        url: pageUrl
        , title: "方法信息"
        , width: 768
        , height: 512
        , onload: function () {
            //var iframe = this.getIFrameEl();
            //iframe.contentWindow;
        }
        , ondestroy: function (action) {
            datagridMethod_Load();
        }
    });

};


















function onSearchMFWPropertyInfo() {
    //搜集查询条件
    conditionDataMFWPropertyInfo = $.page.idM.conditionFormMFWPropertyInfo.getData();
    //datagrid加载数据
    datagridMFWPropertyInfo_Load(1);
};

function datagridMFWPropertyInfo_Load(pageIndex, pageSize) {
    //如果没传入页数
    if (!fw.fwObject.FWObjectHelper.hasValue(pageIndex)) {
        //将页数设置为datagrid的页数
        pageIndex = $.page.idM.datagridMFWPropertyInfo.pageIndex;
    };
    //如果没传入分页大小
    if (!fw.fwObject.FWObjectHelper.hasValue(pageSize)) {
        //将分页大小设置为datagrid的分页大小
        pageSize = $.page.idM.datagridMFWPropertyInfo.pageSize;
    };
    pageSize = fw.fwNumber.intMaxValue;
    //排序字段
    var sortFieldList = null;
    //如果datagrid设置有排序字段
    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.datagridMFWPropertyInfo.sortField)) {
        //将排序字段设置为datagrid的排序字段
        sortFieldList = [{
            fieldName: $.page.idM.datagridMFWPropertyInfo.getSortField()
            , sortType: fw.fwData.FWSortType[$.page.idM.datagridMFWPropertyInfo.getSortOrder()]
        }];
    };
    //开启datagrid数据加载锁屏
    $.page.idM.datagridMFWPropertyInfo.loading();
    conditionDataMFWPropertyInfo.mTypeMetadataToken = mEntity.mMetadataToken;
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "queryPageMFWPropertyInfo"
        , data: {
            ticket: $.page.ticket
            , pageParams: {
                pageSize: pageSize
                , pageIndex: pageIndex
                , sortFieldList: sortFieldList
            }
            , queryParams: conditionDataMFWPropertyInfo
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                //设置datagrid数据
                $.page.idM.datagridMFWPropertyInfo.set({
                    pageIndex: resultData.data.pageIndex - 1
                    , pageSize: resultData.data.pageSize
                    , totalCount: resultData.data.recordCount
                    , data: resultData.data.entityList
                });

                //默认选中第一行
                if ($.page.idM.datagridMFWPropertyInfo.data.length > 0) {
                    if (!$.page.idM.datagridMFWPropertyInfo.lastSelectedRowIndex) {
                        $.page.idM.datagridMFWPropertyInfo.lastSelectedRowIndex = -1;
                    };
                    if ($.page.idM.datagridMFWPropertyInfo.lastSelectedRowIndex > $.page.idM.datagridMFWPropertyInfo.data.length - 1) {
                        $.page.idM.datagridMFWPropertyInfo.lastSelectedRowIndex = $.page.idM.datagridMFWPropertyInfo.data.length - 1;
                    } else if ($.page.idM.datagridMFWPropertyInfo.lastSelectedRowIndex < 0) {
                        $.page.idM.datagridMFWPropertyInfo.lastSelectedRowIndex = 0;
                    };
                    $.page.idM.datagridMFWPropertyInfo.select($.page.idM.datagridMFWPropertyInfo.getRow($.page.idM.datagridMFWPropertyInfo.lastSelectedRowIndex));
                } else {
                    datagridMFWPropertyInfo_SelectionChanged({ selected: undefined, selecteds: [] });
                };
            };
        }
    }));
};

//单元格渲染事件
function datagridMFWPropertyInfo_renderer(e) {
    var html = "";
    switch (e.field) {
        case "mPropertyType":
            html = fw.fwString.FWStringHelper.toHtml(e.record.mPropertyTypeName, ["<", ">"]);
            break;
        case "mPropertyTypeName":
            html = "<a href=\"javascript:openInfoType('query','" + e.record.mPropertyType + "','" + e.record.mPropertyTypeName + "')\" style=\"color:blue;\">查看</a>";
            break;
        default:
            var d = "";
            break;
    };
    return html;
};

//#region 如果选择的数量大于2时，不能修改
function datagridMFWPropertyInfo_SelectionChanged(e) {
    var childControls = mini.getChildControls($.page.idJQ.functionListMFWPropertyInfo[0]);
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
        $.page.idM.datagridMFWPropertyInfo.lastSelectedRowIndex = $.page.idM.datagridMFWPropertyInfo.indexOf(e.selected);
    };
}
//#endregion

//插入新增行
function insertRowMFWPropertyInfo() {
    var newRow = { name: "New Row" };
    $.page.idM.datagridMFWPropertyInfo.addRow(newRow, 0);
    $.page.idM.datagridMFWPropertyInfo.beginEditCell(newRow, "mName");
};

function insertOrUpdateMFWPropertyInfo() {
    $.page.idM.datagridMFWPropertyInfo.validate();
    if ($.page.idM.datagridMFWPropertyInfo.isValid() == false) {
        //alert("请校验输入单元格内容");
        var error = $.page.idM.datagridMFWPropertyInfo.getCellErrors()[0];
        $.page.idM.datagridMFWPropertyInfo.beginEditCell(error.record, error.column);
        return;
    };
    var mEntityList = $.page.idM.datagridMFWPropertyInfo.getChanges();
    var mEntityList = fw.fwObject.FWObjectHelper.emptyToNull(mEntityList);
    if (mEntityList.length < 1) {

        return;
    } else {
        for (var i = 0; i < mEntityList.length; i++) {
            mEntityList[i].mTypeMetadataToken = mEntity.mMetadataToken;
        };
    };
    if (fw.fwObject.FWObjectHelper.hasValue(mEntityList)) {
        $.page.idM.datagridMFWPropertyInfo.loading("保存中，请稍后......");
        //插入或者更新
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "sysManage"
            , methodName: "insertOrUpdateMFWPropertyInfoListByMMetadataToken"
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
                    datagridMFWPropertyInfo_Load();
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
function delMFWPropertyInfo(mMetadataTokenList) {
    //获得选中项编码集合
    if (!fw.fwObject.FWObjectHelper.hasValue(mMetadataTokenList)) {
        var rows = $.page.idM.datagridMFWPropertyInfo.getSelecteds();
        if (rows.length > 0) {
            mMetadataTokenList = [];
            var entity;
            for (var i = 0; i < rows.length; i++) {
                entity = rows[i];
                if (fw.fwObject.FWObjectHelper.hasValue(entity.mMetadataToken)) {
                    mMetadataTokenList.push(entity.mMetadataToken);
                } else {
                    $.page.idM.datagridMFWPropertyInfo.removeRows([rows[i]], true);
                };
            };
            if (mMetadataTokenList.length < 1) {
                mMetadataTokenList = undefined;
            };
        } else {
            mini.alert("请选择一项！");
        };
    };
    //判断选中了项
    if (mMetadataTokenList) {
        mini.confirm("确定删除记录？", "确定？",
            function (action) {
                if (action == "ok") {
                    //删除
                    $.page.ajax($.page.getAjaxSettings({
                        serviceType: "crossDomainCall"
                        , serviceName: "sysManage"
                        , methodName: "deleteMFWPropertyInfoByMMetadataTokenList"
                        , data: {
                            ticket: $.page.ticket
                            , mMetadataTokenList: mMetadataTokenList
                        }
                        , beforeSend: function () {
                            fw.fwButton.fwButtonHelper.addWait($.page.idM.del);
                        }
                        , success: function (resultData) {
                            //判断删除成功
                            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                                //datagrid加载数据
                                datagridMFWPropertyInfo_Load();
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

//移动节点
function moveItemMFWPropertyInfo(action, mDataID) {
    if (action == "up" || action == "down") {
        var items = $.page.idM.datagridMFWPropertyInfo.getSelecteds();
        if (action == "up") {
            $.page.idM.datagridMFWPropertyInfo.moveUp(items);
            $.page.idM.datagridMFWPropertyInfo.lastSelectedRowIndex--;
        } else if (action == "down") {
            $.page.idM.datagridMFWPropertyInfo.moveDown(items);
            $.page.idM.datagridMFWPropertyInfo.lastSelectedRowIndex++;
        };
        var data = $.page.idM.datagridMFWPropertyInfo.getData();
        if (fw.fwObject.FWObjectHelper.hasValue(data) && data.length > 0) {
            var mEntityList = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].mIx != i) {
                    mEntityList.push({
                        mMetadataToken: data[i].mMetadataToken
                        , mIx: i
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
                , methodName: "insertOrUpdateMFWPropertyInfoListByMMetadataToken"
                , data: {
                    ticket: $.page.ticket
                    , mEntityList: mEntityList
                }
                , beforeSend: function () {
                    fw.fwButton.fwButtonHelper.addWait($.page.idM.moveItemUp);
                    fw.fwButton.fwButtonHelper.addWait($.page.idM.moveItemDown);
                }
                , success: function (resultData) {
                    if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                        mini.unmask(document.body);
                        //treegrid加载数据
                        datagridMFWPropertyInfo_Load();
                    };
                }
                , complete: function () {
                    fw.fwButton.fwButtonHelper.removeWait($.page.idM.moveItemUp);
                    fw.fwButton.fwButtonHelper.removeWait($.page.idM.moveItemDown);
                }
            }));
        };
    }
};


















function onSearchMFWMethodInfo() {
    //搜集查询条件
    conditionDataMFWMethodInfo = $.page.idM.conditionFormMFWMethodInfo.getData();
    //datagrid加载数据
    datagridMFWMethodInfo_Load(1);
};

function datagridMFWMethodInfo_Load(pageIndex, pageSize) {
    //如果没传入页数
    if (!fw.fwObject.FWObjectHelper.hasValue(pageIndex)) {
        //将页数设置为datagrid的页数
        pageIndex = $.page.idM.datagridMFWMethodInfo.pageIndex;
    };
    //如果没传入分页大小
    if (!fw.fwObject.FWObjectHelper.hasValue(pageSize)) {
        //将分页大小设置为datagrid的分页大小
        pageSize = $.page.idM.datagridMFWMethodInfo.pageSize;
    };
    pageSize = fw.fwNumber.intMaxValue;
    //排序字段
    var sortFieldList = null;
    //如果datagrid设置有排序字段
    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.datagridMFWMethodInfo.sortField)) {
        //将排序字段设置为datagrid的排序字段
        sortFieldList = [{
            fieldName: $.page.idM.datagridMFWMethodInfo.getSortField()
            , sortType: fw.fwData.FWSortType[$.page.idM.datagridMFWMethodInfo.getSortOrder()]
        }];
    };
    //开启datagrid数据加载锁屏
    $.page.idM.datagridMFWMethodInfo.loading();
    conditionDataMFWMethodInfo.mTypeMetadataToken = mEntity.mMetadataToken;
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "queryPageMFWMethodInfo"
        , data: {
            ticket: $.page.ticket
            , pageParams: {
                pageSize: pageSize
                , pageIndex: pageIndex
                , sortFieldList: sortFieldList
            }
            , queryParams: conditionDataMFWMethodInfo
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                //设置datagrid数据
                $.page.idM.datagridMFWMethodInfo.set({
                    pageIndex: resultData.data.pageIndex - 1
                    , pageSize: resultData.data.pageSize
                    , totalCount: resultData.data.recordCount
                    , data: resultData.data.entityList
                });

                //默认选中第一行
                if ($.page.idM.datagridMFWMethodInfo.data.length > 0) {
                    if (!$.page.idM.datagridMFWMethodInfo.lastSelectedRowIndex) {
                        $.page.idM.datagridMFWMethodInfo.lastSelectedRowIndex = -1;
                    };
                    if ($.page.idM.datagridMFWMethodInfo.lastSelectedRowIndex > $.page.idM.datagridMFWMethodInfo.data.length - 1) {
                        $.page.idM.datagridMFWMethodInfo.lastSelectedRowIndex = $.page.idM.datagridMFWMethodInfo.data.length - 1;
                    } else if ($.page.idM.datagridMFWMethodInfo.lastSelectedRowIndex < 0) {
                        $.page.idM.datagridMFWMethodInfo.lastSelectedRowIndex = 0;
                    };
                    $.page.idM.datagridMFWMethodInfo.select($.page.idM.datagridMFWMethodInfo.getRow($.page.idM.datagridMFWMethodInfo.lastSelectedRowIndex));
                } else {
                    datagridMFWMethodInfo_SelectionChanged({ selected: undefined, selecteds: [] });
                };
            };
        }
    }));
};

//单元格渲染事件
function datagridMFWMethodInfo_renderer(e) {
    var html = "";
    switch (e.field) {
        case "mReturnType":
            html = fw.fwString.FWStringHelper.toHtml(e.record.mReturnTypeName, ["<", ">"]);
            break;
        case "mReturnTypeName":
            html = "<a href=\"javascript:openInfoType('query','" + e.record.mReturnType + "','" + e.record.mReturnTypeName + "')\" style=\"color:blue;\">查看</a>";
            break;
        case "mFWParameterInfoList":
            html = "<a href=\"javascript:openInfoMethod('query','" + e.record.mMetadataToken + "')\" style=\"color:blue;\">查看</a>";
            break;
        default:
            break;
    };
    return html;
};

//#region 如果选择的数量大于2时，不能修改
function datagridMFWMethodInfo_SelectionChanged(e) {
    var childControls = mini.getChildControls($.page.idJQ.functionListMFWMethodInfo[0]);
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
        $.page.idM.datagridMFWMethodInfo.lastSelectedRowIndex = $.page.idM.datagridMFWMethodInfo.indexOf(e.selected);
    };
}
//#endregion

//插入新增行
function insertRowMFWMethodInfo() {
    var newRow = { name: "New Row" };
    $.page.idM.datagridMFWMethodInfo.addRow(newRow, 0);
    $.page.idM.datagridMFWMethodInfo.beginEditCell(newRow, "mName");
};

function insertOrUpdateMFWMethodInfo() {
    $.page.idM.datagridMFWMethodInfo.validate();
    if ($.page.idM.datagridMFWMethodInfo.isValid() == false) {
        //alert("请校验输入单元格内容");
        var error = $.page.idM.datagridMFWMethodInfo.getCellErrors()[0];
        $.page.idM.datagridMFWMethodInfo.beginEditCell(error.record, error.column);
        return;
    };
    var mEntityList = $.page.idM.datagridMFWMethodInfo.getChanges();
    var mEntityList = fw.fwObject.FWObjectHelper.emptyToNull(mEntityList);
    if (mEntityList.length < 1) {

        return;
    } else {
        for (var i = 0; i < mEntityList.length; i++) {
            mEntityList[i].mTypeMetadataToken = mEntity.mMetadataToken;
        };
    };
    if (fw.fwObject.FWObjectHelper.hasValue(mEntityList)) {
        $.page.idM.datagridMFWMethodInfo.loading("保存中，请稍后......");
        //插入或者更新
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "sysManage"
            , methodName: "insertOrUpdateMFWMethodInfoListByMMetadataToken"
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
                    datagridMFWMethodInfo_Load();
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
function delMFWMethodInfo(mMetadataTokenList) {
    //获得选中项编码集合
    if (!fw.fwObject.FWObjectHelper.hasValue(mMetadataTokenList)) {
        var rows = $.page.idM.datagridMFWMethodInfo.getSelecteds();
        if (rows.length > 0) {
            mMetadataTokenList = [];
            var entity;
            for (var i = 0; i < rows.length; i++) {
                entity = rows[i];
                if (fw.fwObject.FWObjectHelper.hasValue(entity.mMetadataToken)) {
                    mMetadataTokenList.push(entity.mMetadataToken);
                } else {
                    $.page.idM.datagridMFWMethodInfo.removeRows([rows[i]], true);
                };
            };
            if (mMetadataTokenList.length < 1) {
                mMetadataTokenList = undefined;
            };
        } else {
            mini.alert("请选择一项！");
        };
    };
    //判断选中了项
    if (mMetadataTokenList) {
        mini.confirm("确定删除记录？", "确定？",
            function (action) {
                if (action == "ok") {
                    //删除
                    $.page.ajax($.page.getAjaxSettings({
                        serviceType: "crossDomainCall"
                        , serviceName: "sysManage"
                        , methodName: "deleteMFWMethodInfoByMMetadataTokenList"
                        , data: {
                            ticket: $.page.ticket
                            , mMetadataTokenList: mMetadataTokenList
                        }
                        , beforeSend: function () {
                            fw.fwButton.fwButtonHelper.addWait($.page.idM.del);
                        }
                        , success: function (resultData) {
                            //判断删除成功
                            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                                //datagrid加载数据
                                datagridMFWMethodInfo_Load();
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

//移动节点
function moveItemMFWMethodInfo(action, mDataID) {
    if (action == "up" || action == "down") {
        var items = $.page.idM.datagridMFWMethodInfo.getSelecteds();
        if (action == "up") {
            $.page.idM.datagridMFWMethodInfo.moveUp(items);
            $.page.idM.datagridMFWMethodInfo.lastSelectedRowIndex--;
        } else if (action == "down") {
            $.page.idM.datagridMFWMethodInfo.moveDown(items);
            $.page.idM.datagridMFWMethodInfo.lastSelectedRowIndex++;
        };
        var data = $.page.idM.datagridMFWMethodInfo.getData();
        if (fw.fwObject.FWObjectHelper.hasValue(data) && data.length > 0) {
            var mEntityList = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].mIx != i) {
                    mEntityList.push({
                        mMetadataToken: data[i].mMetadataToken
                        , mIx: i
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
                , methodName: "insertOrUpdateMFWMethodInfoListByMMetadataToken"
                , data: {
                    ticket: $.page.ticket
                    , mEntityList: mEntityList
                }
                , beforeSend: function () {
                    fw.fwButton.fwButtonHelper.addWait($.page.idM.moveItemUp);
                    fw.fwButton.fwButtonHelper.addWait($.page.idM.moveItemDown);
                }
                , success: function (resultData) {
                    if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                        mini.unmask(document.body);
                        //treegrid加载数据
                        datagridMFWMethodInfo_Load();
                    };
                }
                , complete: function () {
                    fw.fwButton.fwButtonHelper.removeWait($.page.idM.moveItemUp);
                    fw.fwButton.fwButtonHelper.removeWait($.page.idM.moveItemDown);
                }
            }));
        };
    }
};