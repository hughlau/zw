//页面初始化
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
        "mStatus": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "FWResultAppLoginLogStatus" }
        }
    };

    //
    var mCallTimeFrom = $.page.params.mCallTimeFrom;
    var mCallTimeTo = $.page.params.mCallTimeTo;
    if (mCallTimeFrom && fw.fwObject.FWObjectHelper.hasValue(mCallTimeFrom)) {
        $.page.idM.mCallTimeFrom.setValue(mCallTimeFrom);
    };
    if (mCallTimeTo && fw.fwObject.FWObjectHelper.hasValue(mCallTimeTo)) {
        $.page.idM.mCallTimeTo.setValue(mCallTimeTo);
    };
};

//查询条件
var conditionData = undefined;

//页面加载
$.page.pageLoad = function () {
    //开始查询
    onSearch();
};

function isShowIpInfo_onValueChanged(e) {
    showIpInfo();
};

//打开选择用户窗口
function onMUserIDSelect() {
    //参数
    var data = {
        ticket: $.page.ticket
        , selectType: fw.fwData.FWSelectType.Single
        , selectCallback: "onMUserIDSelectCallback"
        , selectClearCallback: "onMUserIDSelectClearCallback"
    };

    //参数序列化 
    var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwUserLoginList.htm", $.page.webSiteRootUrl), data); 
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
//选择用户完成后回调
function onMUserIDSelectCallback(entity) {
    if (fw.fwObject.FWObjectHelper.hasValue(entity)) {
        $.page.idM.mUserID.setValue(entity.mUserID);
        $.page.idM.mUserID.setText(entity.mUserName);
    };
};
//选择清除用户后回调
function onMUserIDSelectClearCallback() {
    $.page.idM.mUserID.setValue("");
    $.page.idM.mUserID.setText("");
};

//查询
function onSearch() {
    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();
    conditionData.mAppCode = $.page.params.mAppCode;
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

//单元格渲染事件
function datagrid1_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "mUseTime":
            html = (fw.fwObject.FWObjectHelper.hasValue(e.value)) ? fw.fwObject.FWObjectHelper.toString(e.value, "#.00") : "--";
            break;
        case "mCallTime":
            html = (fw.fwObject.FWObjectHelper.hasValue(e.value)) ? fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(e.value)) : "--";
            break;
        case "mStatus":
            switch (e.value) {
                case "-9":
                    html = "App 未注册";
                    break;
                case "-3":
                    html = "出错";
                    break;
                case "-2":
                    html = "用户名失效";
                    break;
                case "-1":
                    html = "凭证失效";
                    break;
                case "0":
                    html = "未登入";
                    break;
                case "1":
                    html = "已登录";
                    break;
                default:
                    html = "--";
                    break;
            }
            break;
        default:
            break;
    };
    return html;
};

function onDrawDateBegin(e) {
    var date = e.date;
    var d = new Date();

    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.mCallTimeTo.value)) {
        if (date.getTime() > $.page.idM.mCallTimeTo.value) {
            e.allowSelect = false;
        }
    }
}
function onDrawDateEnd(e) {
    var date = e.date;
    var d = new Date();

    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.mCallTimeFrom.value)) {
        if (date.getTime() < $.page.idM.mCallTimeFrom.value) {
            e.allowSelect = false;
        }
    }
}

//行选择改变事件
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
        , methodName: "queryPageMFWAppLoginLogList"
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
            };

            showIpInfo();

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
        mini.alert("请至少选择一项！");
        entityList = undefined;
    };
    return entityList;
};

//获得选中项编码，只能选择一项
function getMAppLoginLogCode() {
    var mAppLoginLogCode = undefined, isSelectOne = false;
    //获取选中项对象集合
    var entityList = $.page.idM.datagrid1.getSelecteds();
    //判断对象有值
    if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
        if (entityList.length == 1) {
            isSelectOne = true;
            mAppLoginLogCode = entityList[0].mAppLoginLogCode;
        };
    };
    if (!isSelectOne) {
        mini.alert("请选择一项！");
        mAppLoginLogCode = undefined;
    };
    return mAppLoginLogCode;
};

//获得选中项编码集合
function getMAppLoginLogCodeList() {
    var mAppLoginLogCodeList = undefined;
    //获取选中项对象集合
    var entityList = getSelectedEntityList();
    //判断对象集合有值
    if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
        mAppLoginLogCodeList = [];
        for (var i = 0; i < entityList.length; i++) {
            mAppLoginLogCodeList.push(entityList[i].mAppLoginLogCode);
        };
    };
    return mAppLoginLogCodeList;
};

function showIpInfo() {
    var checked = $.page.idM.isShowIpInfo.getChecked();
    if (checked) {
        if ($.page.idM.datagrid1.data.length > 0) {
            var ipInfoDictionary = {};
            for (var i = 0; i < $.page.idM.datagrid1.data.length; i++) {
                ipInfoDictionary[$.page.idM.datagrid1.data[i].mIp] = null;
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
                    }
                    , success: function (resultData) {
                        //判断删除成功
                        if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                            //datagrid加载数据
                            for (var i = 0; i < resultData.data.length; i++) {
                                ipInfoDictionary[resultData.data[i].ip] = resultData.data[i];
                            };
                            for (var i = 0; i < $.page.idM.datagrid1.data.length; i++) {
                                $.page.idM.datagrid1.data[i].mLocation = ipInfoDictionary[$.page.idM.datagrid1.data[i].mIp].location;
                            };
                            $.page.idM.datagrid1.set({
                                data: $.page.idM.datagrid1.data
                            });
                        };
                    }
                }));
            };
        };
        $.page.idM.datagrid1.showColumn("mLocation");
    } else {
        $.page.idM.datagrid1.hideColumn("mLocation");
    };
};