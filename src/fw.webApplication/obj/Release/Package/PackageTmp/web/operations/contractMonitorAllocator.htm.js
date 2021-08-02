//页面初始化
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
        "cantonCode": {
            dataSourceName: "sysBasicManage.getCantonDicData"
            , dataSourceParams: {  }
        }
    };
};

//查询条件
var conditionData = undefined;
var contractCode = undefined;
var projSchedulingDate = undefined;
var dayPartTypeCode = undefined;
var projectField = undefined;

//页面加载
$.page.pageLoad = function () {
    roleViewInit();
    //参数接收
    //项目主键

    //$.page.params.operationMaintenanceContractCode = "d06fe563-1b63-450d-b2b4-edd2e66c3ab6";
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.operationMaintenanceContractCode)) {
        contractCode = $.page.params.operationMaintenanceContractCode;
    };
    $.page.idM.allocatorStatusCode.load([{ code: "0", name: "未分配" }, { code: "1", name: "已分配"}]);
    $.page.idM.datagrid1.on("drawcell", function (e) {
        var record = e.record,
        column = e.column,
        field = e.field,
        value = e.value;
        if (field == "checkcolumn") {
            if (fw.fwObject.FWObjectHelper.hasValue(record.operationMaintenanceContractCode)) {
              //  e.cellHtml = '<span class="icon-No"></span>';
              //  e.record.allowSelect = 0;
            };
        };
    });
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

        }
        else if (isManage > 0) {
            //判断是否为管理者  只查看
            $.page.idJQ.select.hide();
            //操作列 隐藏
            $.page.idM.datagrid1.hideColumn("op");
        };
    };
};
//查询
function onSearch() {

    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();
    conditionData.operationMaintenanceContractCode = contractCode; 

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
        , serviceName: "basicInfo"
        , methodName: "queryPageMonitorSiteAllocator"
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
            } else {
                var erroInfo = resultData.infoList.join("<br>");
                $.page.showTips({ content: "查询失败!<br>", state: "danger" });
            };

        }
    }));
};


//单元格渲染事件
function datagrid1_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "siteStatus":
            {
                var record = e.record;
                if (fw.fwObject.FWObjectHelper.hasValue(record.operationMaintenanceContractCode)) {
                    html = "<span style='color:green;'>已分配</span>";
                } else {
                    html = "<span style='color:orange;'>未分配</span>";
                };
            };
            break;
        case "op":
            {
                var record = e.record;
                if (fw.fwObject.FWObjectHelper.hasValue(record.operationMaintenanceContractCode)) {
                    html = '<a href="javascript:del(' + e.rowIndex + ')">删除</a>&nbsp; ';
                } else {
                    html = '<a href="javascript:assigned(' + e.rowIndex + ')">分配</a>&nbsp; ';
                };
            };
            break;
        default:
            break;
    };
    return html;
};

//人员分配
function assigned(rowIndex) {
    if (fw.fwObject.FWObjectHelper.hasValue(rowIndex)) {
        var rowEntity = $.page.idM.datagrid1.getRow(rowIndex);
        if (fw.fwObject.FWObjectHelper.hasValue(rowEntity.monitorSiteCode)) {
            inserPlan([rowEntity.monitorSiteCode]);
        };
    };
};

function inserPlan(codeList) {
    if (fw.fwObject.FWObjectHelper.hasValue(codeList)) {
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "operationMaintenance"
            , methodName: "contractMonitorAddAllocator"
            , data: {
                ticket: $.page.ticket,
                operationMaintenanceContractCode: contractCode,
                siteCodeList: codeList
            }
            , success: function (resultData) {
                //判断启用停用成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                    $.page.showTips({ content: "操作成功", state: "success" });
                    //datagrid加载数据
                    datagrid1_Load();
                } else {
                    var html = "操作失败！<br/>";
                    for (var i = 0; i < resultData.infoList.length; i++) {
                        html += (resultData.infoList[i] + "<br/>");
                    };
                    $.page.showTips({ content: html, state: "danger" });
                };
            }
        }));
    };

};

//删除安排计划
function del(rowIndex) {
    if (fw.fwObject.FWObjectHelper.hasValue(rowIndex)) {
        var rowEntity = $.page.idM.datagrid1.getRow(rowIndex);
        if (fw.fwObject.FWObjectHelper.hasValue(rowEntity.operationMaintenanceContractCode)) {
            var data = {
                operationMaintenanceContractCode: rowEntity.operationMaintenanceContractCode,
                monitorSiteCode: rowEntity.monitorSiteCode
            };
            mini.confirm("确定取消设施分配？", "确定？",
                function (action) {
                    if (action == "ok") {
                        //启用停用
                        $.page.ajax($.page.getAjaxSettings({
                            serviceType: "crossDomainCall"
                            , serviceName: "operationMaintenance"
                            , methodName: "contractMonitorDelAllocator"
                            , data: {
                                ticket: $.page.ticket
                                , entity: data
                            }
                            , success: function (resultData) {
                                //判断启用停用成功
                                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                                    $.page.showTips({
                                        content: "操作成功", state: "success"
                                    });
                                    //datagrid加载数据
                                    datagrid1_Load();
                                } else {
                                    var html = "操作失败！<br/>";
                                    for (var i = 0; i < resultData.infoList.length; i++) {
                                        html += (resultData.infoList[i] + "<br/>");
                                    };
                                    $.page.showTips({
                                        content: html,  state: "danger" 
                                    });
                                };
                            }
                        }));
                    };
                }
            );
        };
    };
};

//删除安排计划
function moredel() {

    //获取选中项对象集合
    var siteCodeList = getSiteCodeList();
    delMonitorList(siteCodeList);


};


function delMonitorList(codeList) {

    if (fw.fwObject.FWObjectHelper.hasValue(codeList)) {
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "operationMaintenance"
            , methodName: "contractMonitorDelAllocatorList"
            , data: {
                ticket: $.page.ticket,
                operationMaintenanceContractCode: contractCode,
                delCodeList: codeList
            }
            , success: function (resultData) {
                //判断启用停用成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                    $.page.showTips({ content: " 删除成功", state: "success" });
                    //datagrid加载数据
                    datagrid1_Load();
                } else {
                    var html = "删除失败！<br/>";
                    for (var i = 0; i < resultData.infoList.length; i++) {
                        html += (resultData.infoList[i] + "<br/>");
                    };
                    $.page.showTips({ content: html, state: "danger" });
                };
            }
        }));
    };



}

function onrowclick(e) {
    if (e.record.allowSelect == 0) {
        $.page.idM.datagrid1.deselect(e.row, true);
    };
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

//获得选中项编码集合
function getSiteCodeList() {
    var staffCodeList = undefined;
    //获取选中项对象集合
    var entityList = getSelectedEntityList();
    //判断对象集合有值
    if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
        staffCodeList = [];
        for (var i = 0; i < entityList.length; i++) {
            staffCodeList.push(entityList[i].monitorSiteCode);
        };
    };
    return staffCodeList;
};
//选择选中项
function select() {
    //获取选中项对象集合
    var siteCodeList = getSiteCodeList();
    inserPlan(siteCodeList);

};

function onCloseClick(e) {
    var obj = e.sender;
    obj.setText("所属地域...");
    obj.setValue("");
};

function onValueChanged(e) {
    var obj = e.sender;
    if (!fw.fwObject.FWObjectHelper.hasValue(obj.value)) {
        obj.setText("所属地域...");
    };
};