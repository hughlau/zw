﻿//页面初始化
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
        "mBllModuleCode": {
            dataSourceName: "sysManage.getDictionaryMFWBllModule"
            , dataSourceParams: { ticket: $.page.ticket }
        }
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

    //设置默认查询参数
    $.page.idM.mBllModuleCode.setValue($.page.params.mBllModuleCode);
    $.page.idM.keyword.setValue($.page.params.keyword);

    //开始查询
    onSearch();

    mini.layout();
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
        $.page.idM.datagrid1.lastSelectedRowIndex = $.page.idM.datagrid1.indexOf(e.selected);
    };
};

//单元格渲染事件
function datagrid1_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "mIsVerifyRight":
            html = (fw.fwObject.FWObjectHelper.hasValue(e.value) && e.value == 1) ? "是" : "否";
            break;
        case "mIsWriteLog":
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
        , methodName: "queryPageMFWFunction"
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
                $.page.idM.datagrid1.set({
                    pageIndex: resultData.data.pageIndex - 1
                    , pageSize: resultData.data.pageSize
                    , totalCount: resultData.data.recordCount
                    , data: resultData.data.entityList
                });
                //默认选中第一行
                if ($.page.idM.datagrid1.data.length > 0) {
                    if (!$.page.idM.datagrid1.lastSelectedRowIndex) {
                        $.page.idM.datagrid1.lastSelectedRowIndex = -1;
                    };
                    if ($.page.idM.datagrid1.lastSelectedRowIndex > $.page.idM.datagrid1.data.length - 1) {
                        $.page.idM.datagrid1.lastSelectedRowIndex = $.page.idM.datagrid1.data.length - 1;
                    } else if ($.page.idM.datagrid1.lastSelectedRowIndex < 0) {
                        $.page.idM.datagrid1.lastSelectedRowIndex = 0;
                    };
                    $.page.idM.datagrid1.select($.page.idM.datagrid1.getRow($.page.idM.datagrid1.lastSelectedRowIndex));
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
function getMFunctionCode() {
    var mFunctionCode = undefined;
    //获取选中项对象
    var entity = getSelectedEntity();
    //判断对象有值
    if (entity && fw.fwObject.FWObjectHelper.hasValue(entity)) {
        mFunctionCode = entity.mFunctionCode;
    };
    return mFunctionCode;
};

//获得选中项编码集合
function getMFunctionCodeList() {
    var mFunctionCodeList = undefined;
    //获取选中项对象集合
    var entityList = getSelectedEntityList();
    //判断对象集合有值
    if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
        mFunctionCodeList = [];
        for (var i = 0; i < entityList.length; i++) {
            mFunctionCodeList.push(entityList[i].mFunctionCode);
        };
    };
    return mFunctionCodeList;
};

//打开信息窗口
function openInfo(action, mFunctionCode) {
    //是否满足条件打开窗口
    var isOpen = true;
    //打开窗口传入的数据
    var data = {
        ticket: $.page.ticket
        , action: action
    };
    //判断传入了记录编码
    if (fw.fwObject.FWObjectHelper.hasValue(mFunctionCode)) {
        data.mFunctionCode = mFunctionCode;
    } else {
        //判断是修改或者是查看信息
        if (action == "update" || action == "query") {
            //获取选中项编码
            mFunctionCode = getMFunctionCode();
            //判断选中了项
            if (mFunctionCode && fw.fwObject.FWObjectHelper.hasValue(mFunctionCode)) {
                data.mFunctionCode = mFunctionCode;
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
        var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwFunction.htm", $.page.webSiteRootUrl), data); 

        //打开窗口
        mini.open({
            url: pageUrl
            , title: "功能信息"
            , width: 512
            , height: 448
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

//启用停用选中项
function able(mIsDis, mFunctionCodeList) {
    //获得选中项编码集合
    if (!fw.fwObject.FWObjectHelper.hasValue(mFunctionCodeList)) {
        mFunctionCodeList = getMFunctionCodeList();
    };
    //判断选中了项
    if (mFunctionCodeList) {
        mini.confirm("确定" + (mIsDis == 1 ? "停用" : "启用") + "记录？", "确定？",
            function (action) {
                if (action == "ok") {
                    //启用停用
                    $.page.ajax($.page.getAjaxSettings({
                        serviceType: "crossDomainCall"
                        , serviceName: "sysManage"
                        , methodName: "updateMFWFunctionByMFunctionCodeList"
                        , data: {
                            ticket: $.page.ticket
                            , mEntity: {
                                mIsDis: mIsDis
                            }
                            , mFunctionCodeList: mFunctionCodeList
                        }
                        , success: function (resultData) {
                            //判断启用停用成功
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