var monitorSiteCode = null;
var conditionData = {};
$.page.pageInit = function () {
    //$.page.dataSourceSettingsDictionary = {
    //    "monitorFactorCode": {
    //        dataSourceName: "sysManage.getDictionary"
    //        , dataSourceParams: { pCode: "BLLMonitorFactor" }
    //    }
    //};
};

$.page.pageLoad = function () {

    //$.page.params.monitorSiteCode='06c14661-7664-4bbe-93de-d5774cfb6735';
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.monitorSiteCode)) {
        monitorSiteCode = $.page.params.monitorSiteCode;
    };
    //mini.get('monitorFactorCode').setValue('000009'); 
    onSearch();
};

function onSearch() {
    conditionData = $.page.idM.conditionForm.getData() || {};
    conditionData.monitorSiteCode = monitorSiteCode;
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
    
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "autoMonitor"
        , methodName: "queryMonitorWaterPumpHisStatus"
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
    var data = { ticket: $.page.ticket, action: action, pageTabs: "bi,ws" };
    data.monitorSiteCode = monitorSiteCode;
    var pageParams = { url: "web/basicInfo/monitorSiteMain.htm", width: 800, height: 600, title: "点位信息" };
    $.page.openPage(data, pageParams);
};

function onImportInfo() {
    var data = { ticket: $.page.ticket };
    var pageParams = { url: "web/autoMonitor/autoMonitorDataImport.htm", width: 600, height: 400, title: "自动监测数据导入" };
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