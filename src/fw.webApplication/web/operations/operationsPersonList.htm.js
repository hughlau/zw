var action = undefined;
var monitorSiteCode = undefined; //运维任务选择人员过滤
var checkUserId;
var isAdminRole, isManagerRole;

//页面初始化
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
    };
};

//查询条件
var conditionData = {};
//运维单位编码
var operationMaintenanceUnitCode = undefined;
var operationMaintenancePersonCode = undefined;
var pageType = undefined;
//页面加载
$.page.pageLoad = function () {
    roleViewInit();
    //获取用户信息
    //获取用户信息
    var userInfo = $.page.userInfo;
    //判断运维单位 则跳转地址
    if (userInfo != null &&  userInfo.roleCodeList != null && userInfo.roleCodeList.length > 0) {
        for (var i = 0; i < userInfo.roleCodeList.length; i++) {
            if (userInfo.roleCodeList[i] == "managerRole") {
                if (fw.fwObject.FWObjectHelper.hasValue(userInfo.operationMaintenanceUnitCode)) {
                    $.page.params.operationMaintenanceUnitCode = userInfo.operationMaintenanceUnitCode;
                    mini.get("operationMaintenanceUnitCode").setValue($.page.params.operationMaintenanceUnitCode);
                    if (!isAdminRole) {
                        mini.get("operationMaintenanceUnitCode").disable();
                    }
                };
            };
        };

    };
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.pageType)) {
        pageType = $.page.params.pageType;
    };

    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.action)) {
        action = $.page.params.action;
    } else {
        action = $.page.enumOperate.edit;
    };
    monitorSiteCode = $.page.params.monitorSiteCode;

    //运维单位默认 
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.operationMaintenanceUnitCode)) {
        //多选
        operationMaintenanceUnitCode = $.page.params.operationMaintenanceUnitCode;
        $.page.idM.operationMaintenanceUnitCode.hide();
    } else {
        $.page.idM.operationMaintenanceUnitCode.show();
    };


    //判断选择类型有值
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.selectType)) {
        if ($.page.params.selectType == fw.fwData.FWSelectType.Multi) {
            //多选
            $.page.idM.datagrid_Person.multiSelect = true;
        } else {
            //单选
            $.page.idM.datagrid_Person.multiSelect = false;
        };
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
    $.page.idM.keyword.setValue($.page.params.keyword);

    //开始查询
    onSearch();

};
//用户角色页面视图处理
function roleViewInit() {
    if (!$.page.isNullOrEmpty($.page.userInfo)) {
        var roleList = $.page.userInfo.roleCodeList || [];
        if ($.page.isNullOrEmpty(roleList)) return;

        var isAdmin = $.Enumerable.From(roleList).Where("$=='sysAdminRole'").Count();
        var isManage = $.Enumerable.From(roleList).Where("$=='managerRole'").Count();
        if (isAdmin > 0) {
            //判断是否为系统管理员
            isAdminRole = true;
        }
        else if (isManage > 0) {
            //判断是否为管理者  只查看
            $.page.idJQ.functionList.hide();
            isManagerRole = true;
        };
    };
};
//行选择改变时
function datagrid_Person_SelectionChanged(e) {
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
        $.page.idM.datagrid_Person.lastSelectedRowIndex = $.page.idM.datagrid_Person.indexOf(e.selected);
    };
};
//查询
function onSearch() {
    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();

    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.operationMaintenanceUnitCode)) {
        conditionData.operationMaintenanceUnitCode = $.page.params.operationMaintenanceUnitCode;
    }
    if (fw.fwObject.FWObjectHelper.hasValue(pageType)) {
        conditionData.pageType = pageType;
    }
    if (fw.fwObject.FWObjectHelper.hasValue(operationMaintenanceUnitCode)) {
        conditionData.operationMaintenanceUnitCode = operationMaintenanceUnitCode;
    }
    if (fw.fwObject.FWObjectHelper.hasValue(monitorSiteCode)) {
        conditionData.monitorSiteCode = monitorSiteCode;
    };
    //datagrid加载数据
    datagrid_Person_Load(1);
};

//数据加载前包括（页数发生变化时）
function datagrid_Person_BeforeLoad(e) {
    //取消datagrid的miniui自动加载
    e.cancel = true;
    //miniui的页数与实际相差1页
    var pageIndex = e.data.pageIndex + 1;
    var pageSize = e.data.pageSize;
    //datagrid加载数据
    datagrid_Person_Load(pageIndex, pageSize);
};

//单元格渲染事件
function datagrid_Person_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "operationMaintenancePersonName":
            html = "<a href=\"javascript:openInfo('" + $.pageCustomer.enumOperate.view + "','" + e.record.operationMaintenancePersonCode + "')\" style=\"color:blue;\">" + e.value + "</a>";
            break;
        case "isDis":
            html = (fw.fwObject.FWObjectHelper.hasValue(e.value) && e.value == 1) ? "<label style=\"color:Red\">已停用</label>" : "<label style=\"color:Green\">已启用</label>";
            break;
        case "op":
            html = "<a href=\"javascript:personSiteInfo('" + e.record.operationMaintenancePersonCode + "')\" style=\"color:blue;\"><img src=\"../style/images/monitor32.png\" style=\"width:24px;height:24px;box-sizing: content-box;\" /></a></a>"
            break;
        case "opCanton":
            html = "<a href=\"javascript:openSetCanton('" + e.record.userID + "')\" style=\"color:blue;\"><img src=\"../style/images/monitor32.png\" style=\"width:24px;height:24px;box-sizing: content-box;\" /></a></a>"
            break;
        default:
            break;
    };
    return html;
};

function personSiteInfo(operationMaintenancePersonCode) {

    var data = { ticket: $.page.ticket, action: action, operationMaintenancePersonCode: operationMaintenancePersonCode };
    var pageParams = { url: "web/operations/personMonitorAllocator.htm", width: 960, height: 600, title: "项目设施" };
    $.page.openPage(data, pageParams, function (e) {

    });
};

//打开行政区分配功能窗口
function openSetCanton(cuserID) {
    if (cuserID == "null") {
        mini.alert("该人员未分配运维账号！");
        return;
    }
    checkUserId = cuserID;
    var userCantonCode = "";
    var data = {
        ticket: $.page.ticket
        , selectType: fw.fwData.FWSelectType.Multi
        , selectCallback: "openSetCantonCallback"
        , userID: cuserID
        , cantonCode: userCantonCode
    };
    var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysBasicManage/cunSelect.htm", $.page.webSiteRootUrl), data);
    //打开窗口
    mini.open({
        url: url
        , title: "选择行政区"
        , width: 768
        , height: 600
        , onload: function () {
        }
        , ondestroy: function (action) {
            //判断非（关闭和取消）窗口
            if (action != "close" && action != "cancel") {
            };
        }
    });
};

//分配行政区
function openSetCantonCallback(entityList) {
    var mUserIDList = [$.page.params.mUserID];
    if (mUserIDList) {
        var insertMDataIDList = [];
        if (entityList != null && entityList.length > 0) {
            var savelist = [];
            for (var i = 0; i < entityList.length; i++) {
                var isSave = true;
                for (var j = 0; j < savelist.length; j++) {
                    var t1 = entityList[i].code;
                    var t2 = savelist[j].code;
                    if (t1.indexOf(t2) > -1 || t2.indexOf(t1) > -1) {
                        isSave = false;
                        break;
                    }
                }
                if (isSave) {
                    savelist.push(entityList[i]);
                }
            };
        };
        if (savelist != null && savelist.length > 0) {
            for (var i = 0; i < savelist.length; i++) {
                insertMDataIDList.push(savelist[i].dataID);
            };
        };
        //分配功能
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "sysBasicManage"
            , methodName: "updateFWUserMappingCantonCodeListByMUserID"
            , data: {
                ticket: $.page.ticket
                , userID: checkUserId
                , insertMDictionaryDataIDList: insertMDataIDList
            }
            , beforeSend: function () {
                fw.fwButton.fwButtonHelper.addWait($.page.idM.openSetMenu);
            }
            , success: function (resultData) {
                //判断启用停用成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                    //datagrid加载数据
                    mini.alert("分配行政区成功！");
                };
            }
            , complete: function () {
                fw.fwButton.fwButtonHelper.removeWait($.page.idM.openSetMenu);
            }
        }));
    };
};

//datagrid数据加载
function datagrid_Person_Load(pageIndex, pageSize) {
    //如果没传入页数
    if (!fw.fwObject.FWObjectHelper.hasValue(pageIndex)) {
        //将页数设置为datagrid的页数
        pageIndex = $.page.idM.datagrid_Person.pageIndex;
    };
    //如果没传入分页大小
    if (!fw.fwObject.FWObjectHelper.hasValue(pageSize)) {
        //将分页大小设置为datagrid的分页大小
        pageSize = $.page.idM.datagrid_Person.pageSize;
    };
    //排序字段
    var sortFieldList = null;
    //如果datagrid设置有排序字段
    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.datagrid_Person.sortField)) {
        //将排序字段设置为datagrid的排序字段
        sortFieldList = [{
            fieldName: $.page.idM.datagrid_Person.getSortField()
            , sortType: fw.fwData.FWSortType[$.page.idM.datagrid_Person.getSortOrder()]
        }];
    };
    //开启datagrid数据加载锁屏
    $.page.idM.datagrid_Person.loading();
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "operationMaintenance"
        , methodName: "queryPageMOperationMaintenancePerson"
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
                $.page.idM.datagrid_Person.set({
                    pageIndex: resultData.data.pageIndex - 1
                    , pageSize: resultData.data.pageSize
                    , totalCount: resultData.data.recordCount
                    , data: resultData.data.entityList
                });
                //默认选中第一行
                if ($.page.idM.datagrid_Person.data.length > 0) {
                    if (!$.page.idM.datagrid_Person.lastSelectedRowIndex) {
                        $.page.idM.datagrid_Person.lastSelectedRowIndex = -1;
                    };
                    if ($.page.idM.datagrid_Person.lastSelectedRowIndex > $.page.idM.datagrid_Person.data.length - 1) {
                        $.page.idM.datagrid_Person.lastSelectedRowIndex = $.page.idM.datagrid_Person.data.length - 1;
                    } else if ($.page.idM.datagrid_Person.lastSelectedRowIndex < 0) {
                        $.page.idM.datagrid_Person.lastSelectedRowIndex = 0;
                    };
                    $.page.idM.datagrid_Person.select($.page.idM.datagrid_Person.getRow($.page.idM.datagrid_Person.lastSelectedRowIndex));
                } else {
                    datagrid_Person_SelectionChanged({ selected: undefined, selecteds: [] });
                };
            }
            else //Roger 2016/6/1 13:00:02 增加管辖区域
            {
                var erroInfo = resultData.infoList.join("<br>");
                $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
            };
        }
    }));
};

//获取选中项对象
function getSelectedEntity() {
    //获取选中项对象
    var entity = $.page.idM.datagrid_Person.getSelected();
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
    var entityList = $.page.idM.datagrid_Person.getSelecteds();
    //判断对象集合没有值
    if (!fw.fwObject.FWObjectHelper.hasValue(entityList) || entityList.length < 1) {
        mini.alert("请选择需要操作项！");
        entityList = undefined;
    };
    return entityList;
};

//获得选中项编码
function getOperationMaintenancePersonCode() {
    var operationMaintenancePersonCode = undefined;
    //获取选中项对象
    var entity = getSelectedEntity();
    //判断对象有值
    if (entity && fw.fwObject.FWObjectHelper.hasValue(entity)) {
        operationMaintenancePersonCode = entity.operationMaintenancePersonCode;
    };
    return operationMaintenancePersonCode;
};

//获得选中项编码集合
function getOperationMaintenancePersonCodeList() {
    var mCodeList = undefined;
    //获取选中项对象集合
    var entityList = getSelectedEntityList();
    //判断对象集合有值
    if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
        mCodeList = [];
        for (var i = 0; i < entityList.length; i++) {
            mCodeList.push(entityList[i].operationMaintenancePersonCode);
        };
    };
    return mCodeList;
};

//
function onSelectionChanged() {
    var row = $.page.idM.datagrid_Person.getSelecteds();
    if (row.length > 1) {
        $.page.idM.buttonEdit.disable();
    } else {
        $.page.idM.buttonEdit.enable();
    }
}

//打开信息窗口
function openInfo(action, personCode) {
    //是否满足条件打开窗口
    var isOpen = true;
    //打开窗口传入的数据
    var data = {
        ticket: $.page.ticket
        , action: action
        , operationMaintenanceUnitCode: operationMaintenanceUnitCode
    };
    //判断传入了记录编码
    if (fw.fwObject.FWObjectHelper.hasValue(personCode)) {
        data.operationMaintenancePersonCode = personCode;
    } else {
        //判断是修改或者是查看信息
        if (action == "edit" || action == "query") {
            //获取选中项编码
            operationMaintenancePersonCode = getOperationMaintenancePersonCode();
            //判断选中了项
            if (fw.fwObject.FWObjectHelper.hasValue(operationMaintenancePersonCode)) {
                data.operationMaintenancePersonCode = operationMaintenancePersonCode;
            } else {
                isOpen = false;
            };
        } else {
            //判断不是新增
            if (action != "add") {
                isOpen = false;
            };
        };
    };

    //判断满足条件打开窗口

    if (isOpen) {
        //获得传入的参数字符串
        var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/operations/operationsPerson.htm", $.page.webSiteRootUrl), data);
        //打开窗口
        mini.open({
            url: url
            , title: "运维人员"
            , width: 780
            , height: 300
            , onload: function () {
                //var iframe = this.getIFrameEl();
                //iframe.contentWindow;
            }
            , ondestroy: function (action) {
                //判断非（关闭和取消）窗口
                if (action != "close" && action != "cancel") {
                    //datagrid加载数据
                    datagrid_Person_Load();
                };
            }
        });
    };
};

//启用停用选中项
function able(mIsDis, mOperationMaintenancePersonCodeList) {
    //获得选中项编码集合
    if (!fw.fwObject.FWObjectHelper.hasValue(mOperationMaintenancePersonCodeList)) {
        mOperationMaintenancePersonCodeList = getOperationMaintenancePersonCodeList();
    };
    //判断选中了项
    if (mOperationMaintenancePersonCodeList) {
        mini.confirm("确定删除记录？", "确定？",
            function (action) {
                if (action == "ok") {
                    //启用停用
                    $.page.ajax($.page.getAjaxSettings({
                        serviceType: "crossDomainCall"
                        , serviceName: "operationMaintenance"
                        , methodName: "updateMBLLOperationMaintenancePersonByMCodeList"
                        , data: {
                            ticket: $.page.ticket
                            , mEntity: {
                                isDis: mIsDis
                            }
                            , mOperationMaintenancePersonCodeList: mOperationMaintenancePersonCodeList
                        }
                        , beforeSend: function () {
                            fw.fwButton.fwButtonHelper.addWait($.page.idM.enable);
                            fw.fwButton.fwButtonHelper.addWait($.page.idM.disable);
                        }
                        , success: function (resultData) {
                            //判断启用停用成功
                            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                                //datagrid加载数据
                                datagrid_Person_Load();
                                $.page.showTips({ content: "删除成功!<br>", state: "success" });
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

function del(mOperationMaintenancePersonCodeList) {
    //获得选中项编码集合
    if (!fw.fwObject.FWObjectHelper.hasValue(mOperationMaintenancePersonCodeList)) {
        mOperationMaintenancePersonCodeList = getOperationMaintenancePersonCodeList();
    };
    //判断选中了项
    if (mOperationMaintenancePersonCodeList) {
        mini.confirm("确定删除记录？", "确定？",
            function (action) {
                if (action == "ok") {
                    //启用停用
                    $.page.ajax($.page.getAjaxSettings({
                        serviceType: "crossDomainCall"
                        , serviceName: "operationMaintenance"
                        , methodName: "deleteMBLLOperationMaintenancePersonByMCodeList"
                        , data: {
                            ticket: $.page.ticket
                            , mOperationMaintenancePersonCodeList: mOperationMaintenancePersonCodeList
                        }
                        , beforeSend: function () {
                            fw.fwButton.fwButtonHelper.addWait($.page.idM.enable);
                            fw.fwButton.fwButtonHelper.addWait($.page.idM.disable);
                        }
                        , success: function (resultData) {
                            //判断启用停用成功
                            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                                //datagrid加载数据
                                datagrid_Person_Load();
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


function onButtonChooseOPUnitSelectCallback(entity) {
    if (fw.fwObject.FWObjectHelper.hasValue(entity)) {
        $.page.idM.operationMaintenanceUnitCode.setText(entity.operationMaintenanceUnitName);
        $.page.idM.operationMaintenanceUnitCode.setValue(entity.operationMaintenanceUnitCode);
    };
};

function onButtonChooseOPUnit(e) {
    var textMonitor = this;
    //参数
    var data = {
        ticket: $.page.ticket
        , selectType: fw.fwData.FWSelectType.Single
        , selectCallback: "onButtonChooseOPUnitSelectCallback"
        , operationMaintenanceUnitCode: operationMaintenanceUnitCode
        //, selectClearCallback: "onMUserIDSelectClearCallback"
        //, keyword: $.page.idM.mUserID1.getText()
    };

    var pageParams = { url: "web/operations/operationsUnitList.htm", width: 800, height: 600, title: "运维单位" };
    pageParams.url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl(pageParams.url, $.page.webSiteRootUrl), data);
    //打开选择用户窗口
    mini.open({
        url: pageParams.url
        , title: pageParams.title
        , width: pageParams.width
        , height: pageParams.height
        , onload: function () {
            //var iframe = this.getIFrameEl();
            //iframe.contentWindow;
        }
        , ondestroy: function (action) {

        }
    });

};