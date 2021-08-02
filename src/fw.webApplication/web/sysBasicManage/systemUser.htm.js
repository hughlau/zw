//查询条件
var conditionData = undefined;
$.page.pageInit = function() {
   
};
$.page.pageLoad = function() {
    onSearch();
};
function onSearch() {
    //搜集查询条件
    conditionData = $.page.idM.conditionData.getData(); //获得搜索表单数据
    //datagrid加载数据
    datagGidList_Load(1);
};
//数据加载前包括（页数发生变化时）
function datagGidList_BeforeLoad(e) {
    //取消datagrid的miniui自动加载
    e.cancel = true;
    //miniui的页数与实际相差1页
    var pageIndex = e.data.pageIndex + 1;
    var pageSize = e.data.pageSize;
    datagGidList_Load(pageIndex, pageSize);
};
//缓存列表数据加载
function datagGidList_Load(pageIndex, pageSize) {
    //如果没传入页数
    if (!fw.fwObject.FWObjectHelper.hasValue(pageIndex)) {
        //将页数设置为datagrid的页数
        pageIndex = $.page.idM.datagGidList.pageIndex;
    };
    //如果没传入分页大小
    if (!fw.fwObject.FWObjectHelper.hasValue(pageSize)) {
        //将分页大小设置为datagrid的分页大小
        pageSize = $.page.idM.datagGidList.pageSize;
    };
    //开启datagrid数据加载锁屏
    $.page.idM.datagGidList.loading();
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall",
        serviceName: "sysBasicManage",
        methodName: "queryPageUserLogin",
        data: {
            ticket: $.page.ticket,
            pageParams: {
                pageSize: pageSize,
                pageIndex: pageIndex
            },
            queryParams: conditionData
        },
        success: function (resultData) {
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                $.page.idM.datagGidList.set({
                    pageIndex: resultData.data.pageIndex - 1
                    , pageSize: resultData.data.pageSize
                    , totalCount: resultData.data.recordCount
                    , data: resultData.data.entityList
                });
            }
        }
    }));
} 
function GetData() {
    var row = $.page.idM.datagGidList.getSelected();
    return row;
}
function onKeyEnter(e) {
    search();
}
function CloseWindow(action) {
    if (window.CloseOwnerWindow) return window.CloseOwnerWindow(action);
    else window.close();
}
function onOk() {
    CloseWindow("ok");
}
function onCancel() {
    CloseWindow("cancel");
}
