var dataSourceList = [];

var cantonName = null;
monitorSiteCount = null;

$.page.pageLoad = function () {
    cantonName = $.page.params.cantonName;
    monitorSiteCount = $.page.params.monitorSiteCount;

    datagrid1JQ = $.page.idM.datagrid1;
    var btnSearchJQ = $("#buttonSearch");
    var keywordJQ = $("#txtKeyword");

    btnSearchJQ.bind("click", function () {
        onSearch();
    }).click();

};
function onSearch() {
    if ($.pageCustomer.hasValue(monitorSiteCount))
        var maxCount = monitorSiteCount > 20 ? 20 : monitorSiteCount;
    for (var i = 0; i <= maxCount; i++) {
        var item = { 
        monitorSiteName: "设施排放口" + i + 1, runRate: fw.fwNumber.FWNumberHelper.randomNumber(1.01, 99)
            , runRate: fw.fwNumber.FWNumberHelper.randomNumber(1.01, 99.99)
            , standardRate: fw.fwNumber.FWNumberHelper.randomNumber(1.01, 99.99)
            , maintainCount: fw.fwNumber.FWNumberHelper.randomNumber(1, 10.99)
        };
        item.cantonName = cantonName;
        dataSourceList.push(item);
    };
    datagrid1_Load(0);
};

function datagrid1_BeforeLoad(e) {
    //取消datagrid的miniui自动加载
    e.cancel = true;
    //miniui的页数与实际相差1页
    var pageIndex = e.data.pageIndex;
    var pageSize = e.data.pageSize;
    //datagrid加载数据
    datagrid1_Load(pageIndex, pageSize);
};

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
    $.page.idM.datagrid1.loading();

    $.page.idM.datagrid1.set({
        pageIndex: pageIndex
        , pageSize: pageSize
        , totalCount: monitorSiteCount
        , data: dataSourceList
    });
};

function datagrid1_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "option":
            html = "<a href=\"javascript:openInfo()\" style=\"color:blue;\">详细</a>"
            break;
        default:
            break;
    };
    return html;
};

function openInfo() {
    var entity = datagrid1JQ.getSelected();
    var data = { ticket: $.page.ticket };
    data.cantonName = entity.cantonName;
    data.monitorSiteName = entity.monitorSiteName;
    data.maintainCount = entity.maintainCount;
    var pageParams = { url: "web/report/regionRunMonitorInfo.htm", width: 800, height: 600, title: "区域运行情况统计设施明细" };
    $.pageCustomer.miniOpen(data, pageParams);
};
