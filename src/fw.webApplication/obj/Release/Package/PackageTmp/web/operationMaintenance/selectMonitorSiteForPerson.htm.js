var grid = null;
var callbackData = null;
var enumSelect = null;
var codeList = null;
var operationMaintenancePersonCode = undefined;
var operationMaintenanceUnitCode = undefined;

$.page.pageInit = function () {

    $.page.dataSourceSettingsDictionary = {
        "cmbCanton": {
            dataSourceName: "sysBasicManage.getCantonDicData"
            , dataSourceParams: {  }
        }
    };
};

$.page.pageLoad = function () {
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.operationMaintenancePersonCode)) {
        operationMaintenancePersonCode = $.page.params.operationMaintenancePersonCode;
    };
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.operationMaintenanceUnitCode)) {
        operationMaintenanceUnitCode = $.page.params.operationMaintenanceUnitCode;
    };
    enumSelect = $.page.params.enumSelect;
    codeList = mini.decode($.page.params.codeList);
    grid = $.page.idM.datagrid1;
    onSearch();
};

function GetData() {
    var row = $.page.idM.datagrid1.getSelecteds(); ;
    return row;
};
function onSearch() {
    datagrid1_Load(1);
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

    //开启datagrid数据加载锁屏
    $.page.idM.datagrid1.loading();
    var conditionData = $.page.idM.conditionForm.getData();
    conditionData.operationMaintenancePersonCode = operationMaintenancePersonCode;
    conditionData.operationMaintenanceUnitCode = operationMaintenanceUnitCode;
    conditionData.personSelectType = 1;
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "basicInfo"
        , methodName: "queryPagePersonMappingMonitorSiteByPersonOrUnitCode"
        , data: {
            ticket: $.page.ticket
            , pageParams: {
                pageSize: pageSize
                , pageIndex: pageIndex
            }
            , queryParams: conditionData
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {

                if (enumSelect == $.OperationMaintenancePage.enumSelect.singleSelect) {
                    grid.hideColumn("checkcolumn");
                } else {
                    grid.showColumn("checkcolumn");
                };
                grid.on("drawcell", function (e) {
                    var field = e.field;
                    if ($.pageCustomer.hasValue(codeList)) {
                        if (codeList.length > 0) {
                            for (index in codeList) {
                                if (field == "checkcolumn" && codeList[index].monitorSiteCode == e.record.monitorSiteCode) {
                                    e.cellHtml = "已选";
                                    e.record.allowSelect = 0;
                                };
                            };
                        };
                    };
                });
                //设置datagrid数据
                grid.set({
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

function onKeyEnter(e) {
    onSearch();
};
function onRowDblClick(e) {
    onOk();
};
//////////////////////////////////
function CloseWindow(action) {
    callbackData = GetData();
    if (window.CloseOwnerWindow) return window.CloseOwnerWindow(callbackData);
    else window.close();
};

function onOk() {
    CloseWindow("ok");
};
function onCancel() {
    CloseWindow("cancel");
};
function onRowDblClick(e) {
    onOk();
};