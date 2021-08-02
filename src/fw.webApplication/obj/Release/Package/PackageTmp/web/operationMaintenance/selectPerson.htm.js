var grid = null;
var callbackData = null;
var enumSelect = null;
var unitCode = null;
$.page.pageInit = function () {

    $.page.dataSourceSettingsDictionary = {
        "cmbCanton": {
            dataSourceName: "sysBasicManage.getCantonDicData"
            , dataSourceParams: {  }
        }
    };
};

$.page.pageLoad = function () { 
    enumSelect = $.page.params.enumSelect;
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
    conditionData.monitorSiteCode = $.page.params.monitorSiteCode;
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "operationMaintenance"
        , methodName: "queryMaintenancePersonDictionaryList"
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
                //设置datagrid数据
                grid.set({
                    data: resultData.data
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
    if (window.CloseOwnerWindow) return window.CloseOwnerWindow(action);
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