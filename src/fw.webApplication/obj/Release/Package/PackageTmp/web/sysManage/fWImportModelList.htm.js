//页面初始化
var isInit = true;
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
        "mSysObject": {
            dataSourceName: "sysManage.getMSysObjectList"
            , dataSourceParams: { isAssociation: true }
        }
    };
};

//查询条件
var conditionData = undefined;
var methodName = undefined;

//页面加载
$.page.pageLoad = function () {
    //开始查询
    onSearch();
};

//插入或者更新
function insert() {
    //表单验证
    $.page.idM.editform.validate();
    //判断表单验证不成功
    if ($.page.idM.editform.isValid() == false) { return; };
    //获取表单数据
    var data = fw.fwObject.FWObjectHelper.emptyToNull($.page.idM.editform.getData());
    data.mTableName = data.mSysObject;
    //插入或者更新
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall",
        serviceName: "sysManage",
        methodName: "insertOrUpdateMFWImportModelByMDataID",
        data: {
            ticket: $.page.ticket,
            mEntity: data
        },
        success: function (resultData) {
            //判断插入或者更新成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                //mini.alert("保存成功！");
                //
                dgTableObjectList_Load();
                mini.alert("保存成功！");
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


//插入或者更新
function update() {
    $.page.idM.dgTableObjectList.validate();
    if ($.page.idM.dgTableObjectList.isValid() == false) {
        //alert("请校验输入单元格内容");
        var error = $.page.idM.dgTableObjectList.getCellErrors()[0];
        $.page.idM.dgTableObjectList.beginEditCell(error.record, error.column);
        return;
    };
    var mEntityList = $.page.idM.dgTableObjectList.getChanges();
    mEntityList = fw.fwObject.FWObjectHelper.emptyToNull(mEntityList);
    if (mEntityList.length < 1) { 
        return;
    }
    if (fw.fwObject.FWObjectHelper.hasValue(mEntityList)) {
        $.page.idM.dgTableObjectList.loading("保存中，请稍后......");
        //插入或者更新
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "sysManage"
            , methodName: "insertOrUpdateMFWImportModelListByMDataID"
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
                    dgTableObjectList_Load();
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


//行选择改变时
function dgTableObjectList_SelectionChanged(e) {
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
        $.page.idM.dgTableObjectList.lastSelectedRowIndex = $.page.idM.dgTableObjectList.indexOf(e.selected);
    };
};


//查询 
function onSearch() {
    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();
    //datagrid加载数据
    dgTableObjectList_Load(1);
};

//数据加载前包括（页数发生变化时）
function dgTableObjectList_BeforeLoad(e) {
    //取消datagrid的miniui自动加载
    e.cancel = true;
    //miniui的页数与实际相差1页
    var pageIndex = e.data.pageIndex + 1;
    var pageSize = e.data.pageSize;
    //datagrid加载数据
    dgTableObjectList_Load(pageIndex, pageSize);
};

 
//datagrid数据加载
function dgTableObjectList_Load(pageIndex, pageSize) {
    //如果没传入页数
    if (!fw.fwObject.FWObjectHelper.hasValue(pageIndex)) {
        //将页数设置为datagrid的页数
        pageIndex = $.page.idM.dgTableObjectList.pageIndex;
    };
    //如果没传入分页大小
    if (!fw.fwObject.FWObjectHelper.hasValue(pageSize)) {
        //将分页大小设置为datagrid的分页大小
        pageSize = $.page.idM.dgTableObjectList.pageSize;
    };
    //排序字段
    var sortFieldList = null;
    //如果datagrid设置有排序字段
    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.dgTableObjectList.sortField)) {
        //将排序字段设置为datagrid的排序字段
        sortFieldList = [{
            fieldName: $.page.idM.dgTableObjectList.getSortField()
            , sortType: fw.fwData.FWSortType[$.page.idM.dgTableObjectList.getSortOrder()]
        }];
    };
    //开启datagrid数据加载锁屏
    $.page.idM.dgTableObjectList.loading();
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "queryPageMFWImportModel"
        , data: {
            ticket: $.page.ticket
            , pageParams: {
                pageSize: pageSize
                , pageIndex: pageIndex
                , sortFieldList: sortFieldList
            }
            , queryParams: conditionData
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                //设置datagrid数据
                $.page.idM.dgTableObjectList.set({
                    pageIndex: resultData.data.pageIndex - 1
                    , pageSize: resultData.data.pageSize
                    , totalCount: resultData.data.recordCount
                    , data: resultData.data.entityList
                });
                //默认选中第一行
                if ($.page.idM.dgTableObjectList.data.length > 0) {
                    if (!$.page.idM.dgTableObjectList.lastSelectedRowIndex) {
                        $.page.idM.dgTableObjectList.lastSelectedRowIndex = -1;
                    };
                    if ($.page.idM.dgTableObjectList.lastSelectedRowIndex > $.page.idM.dgTableObjectList.data.length - 1) {
                        $.page.idM.dgTableObjectList.lastSelectedRowIndex = $.page.idM.dgTableObjectList.data.length - 1;
                    } else if ($.page.idM.dgTableObjectList.lastSelectedRowIndex < 0) {
                        $.page.idM.dgTableObjectList.lastSelectedRowIndex = 0;
                    };
                    $.page.idM.dgTableObjectList.select($.page.idM.dgTableObjectList.getRow($.page.idM.dgTableObjectList.lastSelectedRowIndex));
                } else {
                    dgTableObjectList_SelectionChanged({ selected: undefined, selecteds: [] });
                };
            };
        }
    }));
};


//打开信息窗口
function openInfo(action, mDataID) {
    //是否满足条件打开窗口
    var isOpen = true;
    //打开窗口传入的数据
    var data = {
        ticket: $.page.ticket
        , action: action
    };
    //判断不是新增
    if (action != "insert") {
        isOpen = false;
    };
    //判断满足条件打开窗口
    if (isOpen) {  

        //打开窗口
        mini.open({
            url: fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fWImportModel.htm", $.page.webSiteRootUrl), data)
            , title: "表对象信息"
            , width: 384
            , height: 150
            , onload: function () {
                //var iframe = this.getIFrameEl();
                //iframe.contentWindow;
            }
            , ondestroy: function (action) {
                //判断非（关闭和取消）窗口
                if (action != "close" && action != "cancel") {
                    //datagrid加载数据
                    dgTableObjectList_Load();
                };
            }
        });
    };
};

//删除选中项
function del(mDataIDList) {
    //获得选中项编码集合
    if (!fw.fwObject.FWObjectHelper.hasValue(mDataIDList)) {
        var rows = $.page.idM.dgTableObjectList.getSelecteds();
        if (rows.length > 0) {
            mDataIDList = [];
            var entity;
            for (var i = 0; i < rows.length; i++) {
                entity = rows[i];
                if (fw.fwObject.FWObjectHelper.hasValue(entity.mDataID)) {
                    mDataIDList.push(entity.mDataID);
                } else {
                    $.page.idM.dgTableObjectList.removeRows([rows[i]], true);
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
                        , methodName: "deleteMFWImportModelByMDataIDList"
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
                                dgTableObjectList_Load();
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


function onEditMemberInfo() {
    //是否满足条件打开窗口
    var isOpen = true;
    //打开窗口传入的数据
    var data = {
        ticket: $.page.ticket
    };
    var modeID = undefined; 
    var entity = $.page.idM.dgTableObjectList.getSelected(); 
    if (entity && fw.fwObject.FWObjectHelper.hasValue(entity)) {
        modeID = fw.fwObject.FWObjectHelper.hasValue(entity.mDataID) ? entity.mDataID : undefined;
    };
    if (fw.fwObject.FWObjectHelper.hasValue(modeID)) {
        data.modelID = modeID;
        //打开窗口
        var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwImportMemberInfoList.htm", $.page.webSiteRootUrl), data); 
        
        mini.open({
            url: pageUrl
            , title: "表对象成员信息"
            , width: 800
            , height: 600 
            , showCloseButton: true    //显示关闭按钮
             , showMaxButton: true 
            , onload: function () { 
            }
            , ondestroy: function (action) { 
            }
        });
    } else {
        mini.alert("获取主键失败！");
    };
    
    
};