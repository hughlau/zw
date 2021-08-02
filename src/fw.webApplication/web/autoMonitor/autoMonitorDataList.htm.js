$.page.pageInit = function () {
    $.page.dataSourceSettingsDictionary = {
        "monitorFactorCode": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BLLMonitorFactor" }
        }
    };
};

$.page.pageLoad = function () {
    roleViewInit();
    onSearch();

};
//用户角色页面视图处理
function roleViewInit() {
    if (!$.page.isNullOrEmpty($.page.userInfo)) {
        var roleList = $.page.userInfo.roleCodeList || [];
        if ($.page.isNullOrEmpty(roleList)) return;
        
        var isAdmin = $.Enumerable.From(roleList).Where("$=='sysAdminRole'").Count();
        var isManage = $.Enumerable.From(roleList).Where("$=='managerRole'").Count();
        if (isAdmin>0) {
            //判断是否为系统管理员

        } 
        else if (isManage > 0) {
            //判断是否为管理者  只查看
            $.page.idJQ.btn_import.hide();
        }; 
    }; 
};
function onSearch() {
    datagrid1_Load(0);
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


function datagrid1_Load(pageIndex, pageSize) {
    $.page.idM.datagrid1.hideColumn("equipmentCode");
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
    var conditionData = $.page.idM.conditionForm.getData() || {};
    conditionData.dataSource = 3;
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "autoMonitor"
        , methodName: "queryPageFactorHisData"
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
            }
            else //Roger 2016/6/1 13:00:02 增加管辖区域
            {
                var erroInfo = resultData.infoList.join("<br>");
                $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
            };

        }
    }));

};

function dataGrid_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "monitorSiteName":
            html = "<a href=\"javascript:openInfo('" + $.pageCustomer.enumOperate.view + "','" + e.record.monitorSiteCode + "')\" style=\"color:blue;\">" + e.value + "</a>"
            break;
        case "monitorTime":
            html = (fw.fwObject.FWObjectHelper.hasValue(e.value)) ? fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(e.value), $.pageCustomer.dateDayTime) : "--";
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
function openInfo(action, monitorSiteCode) {
    var data = { ticket: $.page.ticket, action: action,pageTabs:"info,ws" };
    data.monitorSiteCode = monitorSiteCode;
    var pageParams = { url: "web/monitorSite/monitorSiteViewMain.htm", width: 800, height: 600, title: "点位信息" };
    $.page.openPage(data, pageParams);
}; 

function onImportInfo() { 
    var data = { ticket: $.page.ticket }; 
    var pageParams = { url: "web/autoMonitor/autoMonitorDataImport.htm", width: 600, height: 400, title: "监测数据导入" };
    $.page.openPage(data, pageParams, function (action) { 
        if (action == "ok") {
            $.page.showTips({ content: "导入成功！", state: "success" });
            onSearch();
        };
    });
};


function onButtonEdit(e) {
    var textMonitor = this;
    var data = { ticket: $.page.ticket };

    var pageParams = { url: "web/autoMonitor/selectMonitorSite.htm", width: 800, height: 600, title: "设施点位 " };
    $.page.openPage(data, pageParams, function (select) {
        if (select != null) {
            textMonitor.setText(select.monitorSiteName);
            textMonitor.setValue(select.monitorSiteCode);
            //
            initFactor(select.monitorSiteCode);
        };
    });
};

function initFactor(monitorSiteCode) {
    if ($.pageCustomer.hasValue(monitorSiteCode)) {
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
                       , serviceName: "autoMonitor"
                        , methodName: "queryFactorList"
                        , data: { ticket: $.page.ticket
                        , queryParams: { monitorSiteCode: monitorSiteCode, FactorType: 0 }
                        }
                        , success: function (resultData) {
                            //判断加载数据成功
                            if (resultData.status == fw.fwData.FWResultStatus.Success) {
                                if (resultData.data != null && resultData.data.length > 0) {
                                    $.page.idM.mFactor.setData(resultData.data);
                                    $.page.idM.mFactor.setValue(resultData.data[0]);
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
};

function onSave()
{   $.page.idM.datagrid1.commitEdit()
    $.page.idM.datagrid1.validate();
    if ($.page.idM.datagrid1.isValid() == false) {
        mini.alert("数据输入格式不符合要求，不允许保存");
        return;
    };
    var entity = [];
    var data =  $.page.idM.datagrid1.getChanges();
    $(data).each(function(index){
        entity.push(JSON.stringify(data[index]));
       // $.extend(entity, data[index]);
    });

    //var Entity = divFormJQ.getData();
   // $.extend(entity, Entity);
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "basicInfo"
        , methodName: "updateMBLLMonitorSiteHisFactorData"
        , data: {
            ticket: $.page.ticket
            , mEntity:entity
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data == true) {
                //window.location.reload();
                datagrid1_Load(0);
                $.page.showTips({ content: "操作成功.", state: "success" });
            } else {
                var erroInfo = resultData.infoList.join("<br>");
                $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
            }
        }
    }));
};
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