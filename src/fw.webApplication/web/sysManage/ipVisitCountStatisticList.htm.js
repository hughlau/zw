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
    var pageIndex = e.data.pageIndex + 1;
    var pageSize = e.data.pageSize;
    //datagrid加载数据
    datagrid1_Load(pageIndex, pageSize);
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

//单元格渲染事件
function datagrid1_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "mIp":
            html = e.value;
            html = "<a href=\"javascript:openInfo('query','" + e.record.mIp + "')\" style=\"color:blue;\">" + html + "</a>";
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
        , methodName: "queryPageMFWSystemLogVisitCountStatisticList"
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
    }));
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
function getMIp() {
    var mIp = undefined, isSelectOne = false;
    //获取选中项对象集合
    var entityList = $.page.idM.datagrid1.getSelecteds();
    //判断对象有值
    if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
        if (entityList.length == 1) {
            isSelectOne = true;
            mIp = entityList[0].mIp;
        };
    };
    if (!isSelectOne) {
        mini.alert("请选择一项！");
        mIp = undefined;
    };
    return mIp;
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

//获得选中项编码集合
function getMIpList() {
    var mIpList = undefined;
    //获取选中项对象集合
    var entityList = getSelectedEntityList();
    //判断对象集合有值
    if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
        mIpList = [];
        for (var i = 0; i < entityList.length; i++) {
            mIpList.push(entityList[i].mIp);
        };
    };
    return mIpList;
};

//打开信息窗口
function openInfo(action, mIp) {
    //是否满足条件打开窗口
    var isOpen = true;
    //打开窗口传入的数据
    var data = {
        ticket: $.page.ticket
        , action: action
        , mCallTimeFrom: $.page.idM.mCallTimeFrom.value
        , mCallTimeTo: $.page.idM.mCallTimeTo.value
    };
    //判断传入了记录编码
    if (fw.fwObject.FWObjectHelper.hasValue(mIp)) {
        data.mIp = mIp;
    } else {
        //判断是修改或者是查看信息
        if (action == "update" || action == "query") {
            //获取选中项编码
            mIp = getMIp();
            //判断选中了项
            if (mIp && fw.fwObject.FWObjectHelper.hasValue(mIp)) {
                data.mIp = mIp;
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
        var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/ipVisitCountStatistic.htm", $.page.webSiteRootUrl), data); 
        //打开窗口
        mini.open({
            url: pageUrl
            , title: "IP访问详细信息"
            , width: 800
            , height: 450
            , allowResize: false
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