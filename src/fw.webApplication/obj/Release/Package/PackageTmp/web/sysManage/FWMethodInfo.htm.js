
var mEntity = null;

//#region 页面初始化
$.page.pageInit = function () {
    $.page.dataSourceSettingsDictionary = {
        "mObjType": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "FWObjType" }
        }
    };
};
//#endregion

//页面加载
$.page.pageLoad = function () {
    //    $.page.params.mMetadataToken = "04bac8bb6658ea65e3f932727acf0324";


    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mMetadataToken)) {
        //查询信息
        query($.page.params.mMetadataToken);
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
            , methodName: "queryMFWMethodInfoByMMetadataToken"
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

                    onSearchMFWParameterInfo();
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
    //data.mCreaterID = $.page.ticket;
    //插入或者更新
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall",
        serviceName: "sysManage",
        methodName: "insertOrUpdateMFWMethodInfoByMMetadataToken",
        data: {
            ticket: $.page.ticket,
            mEntity: data
        },
        success: function (resultData) {
            //判断插入或者更新成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                //关闭窗口
                CloseWindow("insertOrUpdate");
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








function onSearchMFWParameterInfo() {
    //搜集查询条件
    conditionDataMFWParameterInfo = $.page.idM.conditionFormMFWParameterInfo.getData();
    //datagrid加载数据
    datagridMFWParameterInfo_Load(1);
};

function datagridMFWParameterInfo_Load(pageIndex, pageSize) {
    //如果没传入页数
    if (!fw.fwObject.FWObjectHelper.hasValue(pageIndex)) {
        //将页数设置为datagrid的页数
        pageIndex = $.page.idM.datagridMFWParameterInfo.pageIndex;
    };
    //如果没传入分页大小
    if (!fw.fwObject.FWObjectHelper.hasValue(pageSize)) {
        //将分页大小设置为datagrid的分页大小
        pageSize = $.page.idM.datagridMFWParameterInfo.pageSize;
    };
    pageSize = fw.fwNumber.intMaxValue;
    //排序字段
    var sortFieldList = null;
    //如果datagrid设置有排序字段
    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.datagridMFWParameterInfo.sortField)) {
        //将排序字段设置为datagrid的排序字段
        sortFieldList = [{
            fieldName: $.page.idM.datagridMFWParameterInfo.getSortField()
            , sortType: fw.fwData.FWSortType[$.page.idM.datagridMFWParameterInfo.getSortOrder()]
        }];
    };
    //开启datagrid数据加载锁屏
    $.page.idM.datagridMFWParameterInfo.loading();
    conditionDataMFWParameterInfo.mMethodMetadataToken = mEntity.mMetadataToken;
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "queryPageMFWParameterInfo"
        , data: {
            ticket: $.page.ticket
            , pageParams: {
                pageSize: pageSize
                , pageIndex: pageIndex
                , sortFieldList: sortFieldList
            }
            , queryParams: conditionDataMFWParameterInfo
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                //设置datagrid数据
                $.page.idM.datagridMFWParameterInfo.set({
                    pageIndex: resultData.data.pageIndex - 1
                    , pageSize: resultData.data.pageSize
                    , totalCount: resultData.data.recordCount
                    , data: resultData.data.entityList
                });

                //默认选中第一行
                if ($.page.idM.datagridMFWParameterInfo.data.length > 0) {
                    if (!$.page.idM.datagridMFWParameterInfo.lastSelectedRowIndex) {
                        $.page.idM.datagridMFWParameterInfo.lastSelectedRowIndex = -1;
                    };
                    if ($.page.idM.datagridMFWParameterInfo.lastSelectedRowIndex > $.page.idM.datagridMFWParameterInfo.data.length - 1) {
                        $.page.idM.datagridMFWParameterInfo.lastSelectedRowIndex = $.page.idM.datagridMFWParameterInfo.data.length - 1;
                    } else if ($.page.idM.datagridMFWParameterInfo.lastSelectedRowIndex < 0) {
                        $.page.idM.datagridMFWParameterInfo.lastSelectedRowIndex = 0;
                    };
                    $.page.idM.datagridMFWParameterInfo.select($.page.idM.datagridMFWParameterInfo.getRow($.page.idM.datagridMFWParameterInfo.lastSelectedRowIndex));
                } else {
                    datagridMFWParameterInfo_SelectionChanged({ selected: undefined, selecteds: [] });
                };
            };
        }
    }));
};

//#region 如果选择的数量大于2时，不能修改
function datagridMFWParameterInfo_SelectionChanged(e) {
    var childControls = mini.getChildControls($.page.idJQ.functionListMFWParameterInfo[0]);
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
        $.page.idM.datagridMFWParameterInfo.lastSelectedRowIndex = $.page.idM.datagridMFWParameterInfo.indexOf(e.selected);
    };
}
//#endregion

//插入新增行
function insertRowMFWParameterInfo() {
    var newRow = { name: "New Row" };
    $.page.idM.datagridMFWParameterInfo.addRow(newRow, 0);
    $.page.idM.datagridMFWParameterInfo.beginEditCell(newRow, "mName");
};

function insertOrUpdateMFWParameterInfo() {
    $.page.idM.datagridMFWParameterInfo.validate();
    if ($.page.idM.datagridMFWParameterInfo.isValid() == false) {
        //alert("请校验输入单元格内容");
        var error = $.page.idM.datagridMFWParameterInfo.getCellErrors()[0];
        $.page.idM.datagridMFWParameterInfo.beginEditCell(error.record, error.column);
        return;
    };
    var mEntityList = $.page.idM.datagridMFWParameterInfo.getChanges();
    var mEntityList = fw.fwObject.FWObjectHelper.emptyToNull(mEntityList);
    if (mEntityList.length < 1) {

        return;
    } else {
        for (var i = 0; i < mEntityList.length; i++) {
            mEntityList[i].mMethodMetadataToken = mEntity.mMetadataToken;
        };
    };
    if (fw.fwObject.FWObjectHelper.hasValue(mEntityList)) {
        $.page.idM.datagridMFWParameterInfo.loading("保存中，请稍后......");
        //插入或者更新
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "sysManage"
            , methodName: "insertOrUpdateMFWParameterInfoListByMMetadataToken"
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
                    datagridMFWParameterInfo_Load();
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
function del(mMetadataTokenList) {
    //获得选中项编码集合
    if (!fw.fwObject.FWObjectHelper.hasValue(mMetadataTokenList)) {
        var rows = $.page.idM.datagridMFWParameterInfo.getSelecteds();
        if (rows.length > 0) {
            mMetadataTokenList = [];
            var entity;
            for (var i = 0; i < rows.length; i++) {
                entity = rows[i];
                if (fw.fwObject.FWObjectHelper.hasValue(entity.mMetadataToken)) {
                    mMetadataTokenList.push(entity.mMetadataToken);
                } else {
                    $.page.idM.datagridMFWParameterInfo.removeRows([rows[i]], true);
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
                        , methodName: "deleteMFWDictionaryTypeByMMetadataTokenList"
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

//移动节点
function moveItemMFWParameterInfo(action, mDataID) {
    if (action == "up" || action == "down") {
        var items = $.page.idM.datagridMFWParameterInfo.getSelecteds();
        if (action == "up") {
            $.page.idM.datagridMFWParameterInfo.moveUp(items);
            $.page.idM.datagridMFWParameterInfo.lastSelectedRowIndex--;
        } else if (action == "down") {
            $.page.idM.datagridMFWParameterInfo.moveDown(items);
            $.page.idM.datagridMFWParameterInfo.lastSelectedRowIndex++;
        };
        var data = $.page.idM.datagridMFWParameterInfo.getData();
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
                , methodName: "insertOrUpdateMFWParameterInfoListByMMetadataToken"
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
                        datagridMFWParameterInfo_Load();
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
