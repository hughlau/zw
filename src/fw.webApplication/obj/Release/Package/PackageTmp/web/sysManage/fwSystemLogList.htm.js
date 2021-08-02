//页面初始化
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
        "mStatus1": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "FWResultStatus" }
        },
        "mStatus": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "FWResultStatus" }
        },
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
        //, keyword: $.page.idM.mUserID1.getText()
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
        $.page.idM.mUserID1.setValue(entity.mUserID);
        $.page.idM.mUserID1.setText(entity.mUserName);
        $.page.idM.mUserID.setValue(entity.mUserID);
        $.page.idM.mUserID.setText(entity.mUserName);
    };
};
//选择清除用户后回调
function onMUserIDSelectClearCallback() {
    $.page.idM.mUserID1.setValue("");
    $.page.idM.mUserID1.setText("");
    $.page.idM.mUserID.setValue("");
    $.page.idM.mUserID.setText("");
};
//打开选择功能窗口
function onMFunctionCodeSelect() {
    //参数
    var data = {
        ticket: $.page.ticket
        , selectType: fw.fwData.FWSelectType.Single
        , selectCallback: "onMFunctionCodeSelectCallback"
        , selectClearCallback: "onMFunctionCodeSelectClearCallback"
        , keyword: $.page.idM.mFunctionCode.getText()
    };
    //参数序列化 
    var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwFunctionList.htm", $.page.webSiteRootUrl), data); 
        
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
//选择功能完成后回调
function onMFunctionCodeSelectCallback(entity) {
    if (fw.fwObject.FWObjectHelper.hasValue(entity)) {
        $.page.idM.mBllModuleCode.setValue(entity.mBllModuleCode);
        $.page.idM.mFunctionCode.setValue(entity.mFunctionCode);
        $.page.idM.mFunctionCode.setText(entity.mFunctionName);
    };
};
//选择清除功能后回调
function onMFunctionCodeSelectClearCallback() {
    $.page.idM.mBllModuleCode.setValue("");
    $.page.idM.mFunctionCode.setValue("");
    $.page.idM.mFunctionCode.setText("");
};
//查询
function onSearch(cSettings) {
    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();
    //datagrid加载数据
    datagrid1_Load(1, undefined, cSettings);
};

//高级查询
function onAdvancedSearch(cSettings) {
    //搜集高级查询条件
    conditionData = $.page.idM.advancedConditionForm.getData();
    //将高级查询条件设置到一般查询条件
    $.page.idM.conditionForm.setData(conditionData);
    //datagrid加载数据
    datagrid1_Load(1, undefined, cSettings);
    //关闭高级查询窗口
    $.page.idM.advancedConditionWindow.hide();
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
        case "mUseTime":
            html = (fw.fwObject.FWObjectHelper.hasValue(e.value)) ? fw.fwObject.FWObjectHelper.toString(e.value, "#.00") : "--";
            break;
        case "mCallTime":
            html = (fw.fwObject.FWObjectHelper.hasValue(e.value)) ? fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(e.value)) : "--";
            html = "<a href=\"javascript:openInfo('query','" + e.record.mSystemLogCode + "')\" style=\"color:blue;\">" + html + "</a>";
            break;
        case "mStatus":
            // html = (fw.fwObject.FWObjectHelper.hasValue(e.value)) ? fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(e.value)) : "--";

            break;
        default:
            break;
    };
    return html;
};

//结束时间设置
function onDrawDateBegin(e) {
    var date = e.date;
    var d = new Date();

    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.mCallTimeTo.value)) {
        if (date.getTime() > $.page.idM.mCallTimeTo.value) {
            e.allowSelect = false;
        }
    }
}

//开始时间设置
function onDrawDateEnd(e) {
    var date = e.date;
    var d = new Date();

    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.mCallTimeFrom.value)) {
        if (date.getTime() < $.page.idM.mCallTimeFrom.value) {
            e.allowSelect = false;
        }
    }
}

//datagrid数据加载
function datagrid1_Load(pageIndex, pageSize, cSettings) {
    //如果没传入页数
    if (!fw.fwObject.FWObjectHelper.hasValue(pageIndex)) {
        //将页数设置为datagrid的页数
        pageIndex = $.page.idM.datagrid1.pageIndex;
    };
    //如果没传入分页大小
    if (!fw.fwObject.FWObjectHelper.hasValue(pageSize)) {
        //将分页大小设置为datagrid的分页大小
        pageSize = $.page.idM.datagrid1.pageSize;
    }; //如果没传入分页大小

    if (!fw.fwObject.FWObjectHelper.hasValue(cSettings)) {
        //将分页大小设置为datagrid的分页大小
        cSettings = {
            idM: $.page.idM.datagrid1,
            isExport: false
        };
    }
    else {
        cSettings.idM = $.page.idM.datagrid1;
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
        , methodName: "queryPageMFWSystemLog"
        , data: {
            ticket: $.page.ticket
            , pageParams: {
                pageSize: fw.fwObject.FWObjectHelper.hasValue(cSettings.pageSize) ? cSettings.pageSize : pageSize
                , pageIndex: fw.fwObject.FWObjectHelper.hasValue(cSettings.pageIndex) ? cSettings.pageIndex : pageIndex
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
            };
        }
    }, cSettings));
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
function getMSystemLogCode() {
    var mSystemLogCode = undefined;
    //获取选中项对象
    var entity = getSelectedEntity();
    //判断对象有值
    if (entity && fw.fwObject.FWObjectHelper.hasValue(entity)) {
        mSystemLogCode = entity.mSystemLogCode;
    };
    return mSystemLogCode;
};

//获得选中项编码集合
function getMSystemLogCodeList() {
    var mSystemLogCodeList = undefined;
    //获取选中项对象集合
    var entityList = getSelectedEntityList();
    //判断对象集合有值
    if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
        mSystemLogCodeList = [];
        for (var i = 0; i < entityList.length; i++) {
            mSystemLogCodeList.push(entityList[i].mSystemLogCode);
        };
    };
    return mSystemLogCodeList;
};

//打开信息窗口
function openInfo(action, mSystemLogCode) {
    //是否满足条件打开窗口
    var isOpen = true;
    //打开窗口传入的数据
    var data = {
        ticket: $.page.ticket
        , action: action
    };
    //判断传入了记录编码
    if (fw.fwObject.FWObjectHelper.hasValue(mSystemLogCode)) {
        data.mSystemLogCode = mSystemLogCode;
    } else {
        //判断是修改或者是查看信息
        if (action == "update" || action == "query") {
            var entityList = getSelectedEntityList();
            if (entityList.length > 1) {
                isOpen = false;
                mini.alert("该操作只能选择一项！");
                $.page.idM.datagrid1.deselectAll();
            } else {
                //获取选中项编码
                mSystemLogCode = getMSystemLogCode();
                //判断选中了项
                if (mSystemLogCode && fw.fwObject.FWObjectHelper.hasValue(mSystemLogCode)) {
                    data.mSystemLogCode = mSystemLogCode;
                } else {
                    isOpen = false;
                };
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
        var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwSystemLog.htm", $.page.webSiteRootUrl), data); 
        
        //打开窗口
        mini.open({
            url: pageUrl
            , title: "日志信息"
            , width: 832
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
                    mini.alert("保存成功");
                };
            }
        });
    };
};

//删除选中项
function del(mSystemLogCodeList) {
    //获得选中项编码集合
    if (!fw.fwObject.FWObjectHelper.hasValue(mSystemLogCodeList)) {
        mSystemLogCodeList = getMSystemLogCodeList();
    };
    //判断选中了项
    if (mSystemLogCodeList) {
        mini.confirm("确定删除记录？", "确定？",
            function (action) {
                if (action == "ok") {
                    //删除
                    $.page.ajax($.page.getAjaxSettings({
                        serviceType: "crossDomainCall"
                        , serviceName: "sysManage"
                        , methodName: "deleteMFWSystemLogByMSystemLogCodeList"
                        , data: {
                            ticket: $.page.ticket
                            , mSystemLogCodeList: mSystemLogCodeList
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

//启用停用选中项
function ableIp(mIsDis, mDisableIp) {
    //获得选中项编码集合
    if (!fw.fwObject.FWObjectHelper.hasValue(mDisableIp)) {
        var entity = getSelectedEntity();
        if (entity) {
            mDisableIp = entity.mIp;
        };
    };
    //判断选中了项
    if (mDisableIp) {
        mini.confirm("确定" + (mIsDis == 1 ? "禁止" : "允许") + " " + mDisableIp + " 访问？", "确定？",
            function (action) {
                if (action == "ok") {
                    //启用停用
                    $.page.ajax($.page.getAjaxSettings({
                        serviceType: "crossDomainCall"
                        , serviceName: "sysManage"
                        , methodName: "insertOrUpdateMFWDisableIpByMDisableIp"
                        , data: {
                            ticket: $.page.ticket
                            , mEntity: {
                                mDisableIp: mDisableIp
                                , mIsDis: mIsDis
                            }
                        }
                        , beforeSend: function () {
                            fw.fwButton.fwButtonHelper.addWait($.page.idM.disableIp);
                        }
                        , success: function (resultData) {
                            //判断启用停用成功
                            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                                //treegrid加载数据
                                mini.alert((mIsDis == 1 ? "禁止" : "允许") + " " + mDisableIp + " 成功！");
                            };
                        }
                        , complete: function () {
                            fw.fwButton.fwButtonHelper.removeWait($.page.idM.disableIp);
                        }
                    }));
                };
            }
        );
    };
};

//function excel() {
//    var a = "";
//    var columns = $.page.idM.datagrid1.getBottomColumns();
//    for (i = 0; i < columns.length; i++) {
//        if (columns[i].visible) {
//            if (columns[i].field) {
//                a += columns[i].field + ",";
//            }
//        }
//    }
//    alert(a);
//};

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