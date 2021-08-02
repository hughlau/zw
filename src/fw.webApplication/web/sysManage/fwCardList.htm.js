//页面初始化
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
        "mBllModuleCode": {
            dataSourceName: "sysManage.getDictionaryMFWBllModule"
            , dataSourceParams: {}
        },
        "mCardTypeCode": {
            dataSourceName: "sysManage.getDictionaryMFWCardType"
            , dataSourceParams: {}
        }
    };
};

//查询条件
var conditionData = undefined;

//页面加载
$.page.pageLoad = function () {

    //开始查询
    onSearch();
};
//查询
function onSearch() {
    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();
    //datagrid加载数据
    dataGridCardList_Load(1);
};


//数据加载前包括（页数发生变化时）
function dataGridCardList_BeforeLoad(e) {
    //取消datagrid的miniui自动加载
    e.cancel = true;
    //miniui的页数与实际相差1页
    var pageIndex = e.data.pageIndex + 1;
    var pageSize = e.data.pageSize;
    //datagrid加载数据
    dataGridCardList_Load(pageIndex, pageSize);
};

//单元格渲染事件
function dataGridCardList_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "mIsDis":
            html = (fw.fwObject.FWObjectHelper.hasValue(e.value) && e.value == 1) ? "是" : "否";
            break;
        case "mCardName":
            html = "<a href=\"javascript:openInfo('query','" + e.record.mCardCode + "')\" >" + e.record.mCardName + "</a>";
            break;
        case "mBllModuleName":
            var dataBllModuleCode = $.page.idM.mBllModuleCode.data; //[e.record.mBllModuleCode];
            for (var i = 1; i < dataBllModuleCode.length; i++) {
                if (dataBllModuleCode[i].mBllModuleCode == e.record.mBllModuleCode) {
                    html = dataBllModuleCode[i].mBllModuleName;
                    break;
                }
            }
            break;
    };
    return html;
};



//datagrid数据加载
function dataGridCardList_Load(pageIndex, pageSize) {
    //如果没传入页数
    if (!fw.fwObject.FWObjectHelper.hasValue(pageIndex)) {
        //将页数设置为datagrid的页数
        pageIndex = $.page.idM.dataGridCardList.pageIndex;
    };
    //如果没传入分页大小
    if (!fw.fwObject.FWObjectHelper.hasValue(pageSize)) {
        //将分页大小设置为datagrid的分页大小
        pageSize = $.page.idM.dataGridCardList.pageSize;
    };
    //排序字段
    var sortFieldList = null;
    //如果datagrid设置有排序字段
    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.dataGridCardList.sortField)) {
        //将排序字段设置为datagrid的排序字段
        sortFieldList = [{
            fieldName: $.page.idM.dataGridCardList.getSortField()
            , sortType: fw.fwData.FWSortType[$.page.idM.dataGridCardList.getSortOrder()]
        }];
    };
    //开启datagrid数据加载锁屏
    $.page.idM.dataGridCardList.loading();
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "queryPageMFWCard"
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
                $.page.idM.dataGridCardList.set({
                    pageIndex: resultData.data.pageIndex - 1
                    , pageSize: resultData.data.pageSize
                    , totalCount: resultData.data.recordCount
                    , data: resultData.data.entityList
                });
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
                changefirst($.page.idM.dataGridCardList);
            };
        }
    }));
};

//获取选中项对象
function getSelectedEntity() {
    //获取选中项对象
    var entity = $.page.idM.dataGridCardList.getSelected();
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
    var entityList = $.page.idM.dataGridCardList.getSelecteds();
    //判断对象集合没有值
    if (!fw.fwObject.FWObjectHelper.hasValue(entityList) || entityList.length < 1) {
        mini.alert("请选择一项！");
        entityList = undefined;
    };
    return entityList;
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
        $.page.idM.dataGridCardList.lastSelectedRowIndex = $.page.idM.dataGridCardList.indexOf(e.selected);
    };
};

//获得选中项编码
function getMCardCode() {
    var mCardCode = undefined;
    //获取选中项对象
    var entity = getSelectedEntity();
    //判断对象有值
    if (entity && fw.fwObject.FWObjectHelper.hasValue(entity)) {
        mCardCode = entity.mCardCode;
    };
    return mCardCode;
};

//获得选中项编码集合
function getMCardCodeList() {
    var mCardCodeList = undefined;
    //获取选中项对象集合
    var entityList = getSelectedEntityList();
    //判断对象集合有值
    if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
        mCardCodeList = [];
        for (var i = 0; i < entityList.length; i++) {
            mCardCodeList.push(entityList[i].mCardCode);
        };
    };
    return mCardCodeList;
};



//打开信息窗口
function openInfo(action, mCardCode) {
    //是否满足条件打开窗口
    var isOpen = true;
    //打开窗口传入的数据
    var data = {
        ticket: $.page.ticket
        , action: action
    };
    //判断传入了记录编码
    if (fw.fwObject.FWObjectHelper.hasValue(mCardCode)) {
        data.mCardCode = mCardCode;
    } else {
        //判断是修改或者是查看信息
        if (action == "update" || action == "query") {
            //获取选中项编码
            mCardCode = getMCardCode();
            //判断选中了项
            if (mCardCode && fw.fwObject.FWObjectHelper.hasValue(mCardCode)) {
                data.mCardCode = mCardCode;
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
        var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwCard.htm", $.page.webSiteRootUrl), data); 

        //打开窗口
        mini.open({
            url: pageUrl
            , title: "卡片信息"
            , width: 650
            , height: 530
            , allowResize: false
            , onload: function () {
                //var iframe = this.getIFrameEl();
                //iframe.contentWindow;
            }
            , ondestroy: function (action) {
                //判断非（关闭和取消）窗口
                if (action != "close" && action != "cancel") {
                    //datagrid加载数据
                    dataGridCardList_Load();
                };
            }
        });
    };
};

//删除选中项
function del(mCardCodeList) {
    //获得选中项编码集合
    if (!fw.fwObject.FWObjectHelper.hasValue(mCardCodeList)) {
        mCardCodeList = getMCardCodeList();
    };
    //判断选中了项
    if (mCardCodeList) {
        mini.confirm("确定删除记录？", "确定？",
            function (action) {
                if (action == "ok") {
                    //删除
                    $.page.ajax($.page.getAjaxSettings({
                        serviceType: "crossDomainCall"
                        , serviceName: "sysManage"
                        , methodName: "deleteMFWCardByMCardCodeList"
                        , data: {
                            ticket: $.page.ticket
                            , mCardCodeList: mCardCodeList
                        }
                        , success: function (resultData) {
                            //判断删除成功
                            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                                //datagrid加载数据
                                dataGridCardList_Load();
                            };
                        }
                    }));
                };
            }
        );
    };
};

//#region 启用停用选中项
function able(mIsDis, mCardCodeList) {
    //获得选中项编码集合
    if (!fw.fwObject.FWObjectHelper.hasValue(mCardCodeList)) {
        mCardCodeList = getMCardCodeList();
    };
    //判断选中了项
    if (mCardCodeList) {
        mini.confirm("确定" + (mIsDis == 1 ? "停用" : "启用") + "记录？", "确定？",
            function (action) {
                if (action == "ok") {
                    //启用停用
                    $.page.ajax($.page.getAjaxSettings({
                        serviceType: "crossDomainCall"
                        , serviceName: "sysManage"
                        , methodName: "updateMFWCardByMCardCodeList"
                        , data: {
                            ticket: $.page.ticket
                            , mEntity: {
                                mIsDis: mIsDis
                            }
                            , mUserIDList: mCardCodeList
                        }
                        , beforeSend: function () {
                            fw.fwButton.fwButtonHelper.addWait($.page.idM.enable);
                            fw.fwButton.fwButtonHelper.addWait($.page.idM.disable);
                        }
                        , success: function (resultData) {
                            //判断启用停用成功
                            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                                //datagrid加载数据
                                dataGridCardList_Load();
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
//#endregion

//数据加载前包括（页数发生变化时）
function datagrid1_BeforeLoad(e) {
    //取消datagrid的miniui自动加载
    e.cancel = true;
    //miniui的页数与实际相差1页
    var pageIndex = e.data.pageIndex + 1;
    var pageSize = e.data.pageSize;
    //datagrid加载数据
    dataGridCardList_Load(pageIndex, pageSize);
};