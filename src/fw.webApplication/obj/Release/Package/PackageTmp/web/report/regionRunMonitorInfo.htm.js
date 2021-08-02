var cantonName = null;
var maintainCount = null;
var monitorSiteName = null;

var dataSourceList = [];

$.page.pageLoad = function () {
    cantonName = $.page.params.cantonName;
    monitorSiteName = $.page.params.monitorSiteName;
    maintainCount = $.page.params.maintainCount;

    datagrid1JQ = $.page.idM.datagrid1;
    var btnSearchJQ = $("#buttonSearch");
    var keywordJQ = $("#txtKeyword");

    btnSearchJQ.bind("click", function () {
        onSearch();
    }).click();

};
function onSearch() {
    if ($.pageCustomer.hasValue(maintainCount))
        var maxCount = maintainCount > 20 ? 20 : maintainCount;
    for (var i = 0; i < maxCount; i++) {
        var item = {};
        item.monitorSiteName = monitorSiteName
        item.cantonName = cantonName;
        item.maintainDate = getRandomDateBetween(fw.fwDateTime.FWDateTimeHelper.addMonths(new Date(), -8), new Date());
        item.maintainReason = "设施故障现场维护";
        dataSourceList.push(item);
    };
    datagrid1_Load(0);
};
function getRandomDateBetween(a, b) { // 要求a, b 都是Date类型, 且a < b
    var date = new Date(),
         a = a.getTime(),
         b = b.getTime();

    date.setTime(Math.random(b - a) + a);

    return date;

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
        , totalCount: maintainCount
        , data: dataSourceList
    });
};

function datagrid1_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "maintainDate":
            html = fw.fwDateTime.FWDateTimeHelper.toString(e.value, $.pageCustomer.dateDayHour);
            break;
        default:
            break;
    };
    return html;
};