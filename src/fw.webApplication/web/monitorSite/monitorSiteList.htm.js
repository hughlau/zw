var dataSourceList = [];
var buttonAddJQ = null;
var buttonEditJQ = null;
var buttonDeleteJQ = null;
var buttonSearchJQ = null;
var buttonAddInfoJQ = null;
$.page.pageInit = function () {
   //add by songshasha in 2007-11-09 校验是否选中了项目
    checkIsProjectSelected();
    $.page.dataSourceSettingsDictionary = {
        "cmbCanton": {
            dataSourceName: "sysBasicManage.getCantonDicData"
            , dataSourceParams: {pCode: window.top['cantonCodeCache']}
        }
    };
};
$.page.pageLoad = function () {
    buttonAddJQ = $("#buttonAdd");
    buttonEditJQ = $("#buttonEdit");
    buttonDeleteJQ = $("#buttonDelete");
    buttonSearchJQ = $("#buttonSearch");
    buttonAddInfoJQ = $("#buttonAddInfo");


    buttonAddJQ.bind("click", function () {
        openInfo($.pageCustomer.enumOperate.add);
    });

    buttonEditJQ.bind("click", function () {
        var entity = getSelectedEntity();
        if (!entity) {
            return;
        };
        openInfo($.pageCustomer.enumOperate.edit, entity.monitorSiteCode);
    });

    buttonDeleteJQ.bind("click", function () {
        del();
    });

    buttonSearchJQ.bind("click", function () { onSearch(); }).click();

    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.isList)) {
        $.page.idJQ.conditionForm.hide();
    };
    roleViewInit();
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
            $.page.idJQ.functionList.hide();
        };
    };
};
function onSearch(cSettings) {
    //datagrid1_Load(0);

    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();
    conditionData.projectNo = window.top['_projectCache'];
    //datagrid加载数据
    datagrid1_Load(1, undefined, cSettings);
};

//数据导出
function dataExport() {
    onSearch({ isExport: true, pageSize: fw.fwNumber.intMaxValue, pageIndex: 1 });
    $.page.exportFile({ idM: $.page.idM.datagrid1, reportName: '净化槽列表' });
};

function closeWindow(action) {
    if (window.CloseOwnerWindow) {
        return window.CloseOwnerWindow(action)
    }
    else { window.close() };
};
function datagrid1_BeforeLoad(e) {
    //取消datagrid的miniui自动加载
    e.cancel = true;
    //miniui的页数与实际相差1页
    var pageIndex = e.data.pageIndex + 1;
    var pageSize = e.data.pageSize;
    //datagrid加载数据
    datagrid1_Load(pageIndex, pageSize);
};

function datagrid1_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "monitorSiteName":
            html = "<a href=\"javascript:openInfo('" + $.pageCustomer.enumOperate.view + "','" + e.record.monitorSiteCode + "')\" style=\"color:blue;\">" + e.value + "</a>"
            break;
        case "operateTime":
            html = html = $.page.hasValue(e.value) ? $.page.DTToString(e.value, $.page.dateDay) : '--';
            break;
        default:
            break;
    };
    return html;
};

function datagrid1_Load(pageIndex, pageSize,cSettings) {
    //如果没传入页数
    if (!$.pageCustomer.hasValue(pageIndex)) {
        //将页数设置为datagrid的页数
        pageIndex = $.page.idM.datagrid1.pageIndex;
    };
    //如果没传入分页大小
    if (!$.pageCustomer.hasValue(pageSize)) {
        //将分页大小设置为datagrid的分页大小
        pageSize = $.page.idM.datagrid1.pageSize;
    };

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
//    var conditionData = $.page.idM.conditionForm.getData();
//    conditionData.projectName = window.top['_projectCache'];
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "basicInfo"
        , methodName: "queryPageMonitorSiteByWeb"
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
            } else {
                var erroInfo = resultData.infoList.join("<br>");
                $.page.showTips({ content: "查询失败!<br>", state: "danger" });
            };

        }
    },cSettings));

};

function openInfo(action, monitorSiteCode) {
    var data = { ticket: $.page.ticket, action: action };
    var pageParams = {};
    if (action != $.pageCustomer.enumOperate.add) {
        data.monitorSiteCode = monitorSiteCode;
    };

    pageParams = { url: "", width: 800, height: 600, title: "监测点位信息" };
    var url = "";
    if (action == $.pageCustomer.enumOperate.add) {
        url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/monitorSite/monitorSite.htm", $.page.webSiteRootUrl), data);
    }
    else {
        url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/monitorSite/monitorSiteMain.htm", $.page.webSiteRootUrl), data);
    };

    //打开窗口
    mini.open({
        url: url
        , title: "净化槽信息"
        , width: 900
        , height: 640
        , onload: function () {
        }
        , ondestroy: function (action) {
            //判断非（关闭和取消）窗口
            if (action != "close" && action != "cancel") {
                datagrid1_Load($.page.idM.datagrid1.pageIndex + 1);
                //onSearch();
            };
        }
    });
};

function del(monitorSiteCodeList) {
    //获得选中项编码集合
    if (!fw.fwObject.FWObjectHelper.hasValue(monitorSiteCodeList)) {
        monitorSiteCodeList = getMonitorSiteCodeList();
    };
    mini.confirm("确定删除记录？", "确定？",
        function (action) {
            if (action == "ok") {
                //启用停用
                $.page.ajax($.page.getAjaxSettings({
                    serviceType: "crossDomainCall"
                    , serviceName: "basicInfo"
                    , methodName: "delMonitorSiteAndEquipmentByCascade"
                    , data: {
                        ticket: $.page.ticket
                        , monitorSiteCodeList: monitorSiteCodeList
                    }
                    , success: function (resultData) {
                        //判断启用停用成功
                        if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null && resultData.data == true) {
                            //datagrid加载数据
                            datagrid1_Load($.page.idM.datagrid1.pageIndex+1);
                            $.page.showTips({ content: "删除操作成功.", state: "success" });
                        } else {
                            var erroInfo = resultData.infoList.join("<br>");
                            $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
                        };
                    }
                }));
            };
        }
    );
};

function getSelectedEntity() {
    //获取选中项对象
    var entity = $.page.idM.datagrid1.getSelected();
    //判断对象没有值
    if (!$.pageCustomer.hasValue(entity)) {
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
//获得选中项编码集合
function getMonitorSiteCodeList() {
    var monitorSiteCodeList = undefined;
    //获取选中项对象集合
    var entityList = getSelectedEntityList();
    //判断对象集合有值
    if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
        monitorSiteCodeList = [];
        for (var i = 0; i < entityList.length; i++) {
            monitorSiteCodeList.push(entityList[i].monitorSiteCode);
        };
    };
    return monitorSiteCodeList;
};
//结束时间设置
function onDrawDateBegin(e) {
    var date = e.date;
    var d = new Date();

    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.mCallTimeTo.value)) {
        if (date.getTime() > $.page.idM.mCallTimeTo.value) {
            e.allowSelect = false;
        };
    };
};

//开始时间设置
function onDrawDateEnd(e) {
    var date = e.date;
    var d = new Date();

    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.mCallTimeFrom.value)) {
        if (date.getTime() < $.page.idM.mCallTimeFrom.value) {
            e.allowSelect = false;
        };
    };
};

