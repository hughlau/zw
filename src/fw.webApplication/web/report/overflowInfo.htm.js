var dataSource = [{ cantonName: "梅李镇", monitorSiteName: "梅李镇污水处理设施-01", overflowDate: "2015-07-10 18:36", overflowCount: "20" }
, { cantonName: "梅李镇", monitorSiteName: "海虞镇污水处理设施-01", overflowDate: "2015-7-10 17:36", overflowCount: "20" }
, { cantonName: "梅李镇", monitorSiteName: "新港镇污水处理设施-01", overflowDate: "2015-6-10  12:36", overflowCount: "18" }
, { cantonName: "梅李镇", monitorSiteName: "梅李镇污水处理设施-01", overflowDate: "2015-3-15  10:00", overflowCount: "13" }
, { cantonName: "梅李镇", monitorSiteName: "梅李镇污水处理设施-01", overflowDate: "2015-3-14 18:00", overflowCount: "12" }
, { cantonName: "梅李镇", monitorSiteName: "新港镇污水处理设施-01", overflowDate: "2015-3-14 18:00", overflowCount: "11" }
, { cantonName: "梅李镇", monitorSiteName: "新港镇污水处理设施-02", overflowDate: "2015-3-14 13:00", overflowCount: "10" }
, { cantonName: "梅李镇", monitorSiteName: "新港镇污水处理设施-02", overflowDate: "2015-3-14 08:00", overflowCount: "9" }
, { cantonName: "梅李镇", monitorSiteName: "梅李镇污水处理设施-01", overflowDate: "2015-3-14 08:00", overflowCount: "8" }
];
var buttonSearchJQ = null;
var datagrid1JQ = null;
$.page.pageLoad = function () {
    buttonSearchJQ = $("#buttonSearch");
    datagrid1JQ = $.page.idM.datagrid1;

    buttonSearchJQ.bind("click", function () {
        onSearch();
    }).click();
};

function onSearch() {
    $.page.idM.datagrid1.setData(dataSource);
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
    data.overflowCount = entity.overflowCount;
    var pageParams = { url: "web/report/overflowDetail.htm", width: 800, height: 600, title: "设施故障明细" };
    $.page.openPage(data, pageParams);
};
