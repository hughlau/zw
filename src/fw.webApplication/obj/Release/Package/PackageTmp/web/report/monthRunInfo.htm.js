//页面初始化
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
        "cantonCode": {
            dataSourceName: "sysBasicManage.queryCantonList",
            dataSourceParams: { ticket: $.page.ticket }
        }
    };
};

//查询条件
var conditionData = undefined;

//页面加载
$.page.pageLoad = function () {

    //设置默认查询参数
    $.page.idM.keyword.setValue($.page.params.keyword);
    //开始查询
    onSearch();


};


function setColumns() {
    var beginData = $.page.idM.timeFrom.getValue();
    var endData = $.page.idM.timeTo.getValue();
    var beginyear = beginData.getFullYear();
    var endyear = endData.getFullYear();
    var beginMonth = beginData.getMonth() + 1;
    var endMonth = endData.getMonth() + 1;
    var isOverYear = (beginyear != endyear);  //是否跨年
    var colIndex = 1;
    var monthRange = isOverYear ? 12 : endMonth;
    var columns_data = [
    { type: "indexcolumn", header: "序号", width: 30, headerAlign: "center" },
    { header: "行政区名称", field: "cantonName", name: "cantonNameT", width: 100, headerAlign: "center", align: "left" }
    ];
    for (var i = beginMonth; i <= monthRange; i++) {
        var col_obj = {
            header: i != beginMonth ? i + "月" : beginyear + "<br>" + i + "月",
            field: "col_" + colIndex,
            width: 60,
            headerAlign: "center",
            align: "right",
//            sortField: "col_" + colIndex,
//            dataType:'float',
            renderer: "datagrid1_Renderer"
        };
        colIndex++;
        if (colIndex % 12 > 0) {
            colIndex = colIndex % 12;
        } else {
            colIndex = 12;
        };
        columns_data.push(col_obj);
        if (isOverYear && i == monthRange) {
            for (var j = 1; j <= endMonth; j++) {
                var col_obj_n = {
                    header: j != 1 ? j + "月" : endyear + "<br>" + j + "月",
                    field: "col_" + colIndex,
                    width: 60,
                    headerAlign: "center",
                    align: "right",
//                    sortField: "col_" + colIndex,
//                    dataType: 'float',
                    renderer: "datagrid1_Renderer"
                };
                colIndex++;
                if (colIndex % 12 > 0) {
                    colIndex = colIndex % 12;
                } else {
                    colIndex = 12;
                };
                columns_data.push(col_obj_n);
            };

        };
    };
    $.page.idM.datagrid1.set({
        columns: columns_data
    });
};

function onSearch() {
    setColumns();
    $.page.idM.datagrid1.loadList(treeCantonData_2, "cantonCode", "pCantonCode");
};
//单元格渲染事件
function datagrid1_Renderer(e) {
    var html = "";
    switch (e.field) {
        case 'col_1':
        case 'col_2':
        case 'col_3':
        case 'col_4':
        case 'col_5':
        case 'col_6':
        case 'col_7':
        case 'col_8':
        case 'col_9':
        case 'col_10':
        case 'col_11':
        case 'col_12':
            html = $.publicMethod.toFixed(e.value, 2) + '%';
            break;
        default:
            break;
    };
    return html;
};


//单元格点击事件
function datagrid1_Rowclick(e) {
    var cantonName = e.row.cantonName;
    var cantonCode = e.row.cantonCode;
    var subData = $.Enumerable.From(treeCantonData_2).Where("$.cantonCode==" + cantonCode).ToArray();
    if (fw.fwObject.FWObjectHelper.hasValue(subData) && subData.length == 1) {


        //遍历月份
        var beginData = $.page.idM.timeFrom.getValue();
        var endData = $.page.idM.timeTo.getValue();
        var beginyear = beginData.getFullYear();
        var endyear = endData.getFullYear();
        var beginMonth = beginData.getMonth() + 1;
        var endMonth = endData.getMonth() + 1;
        var isOverYear = (beginyear != endyear);  //是否跨年
        var colIndex = 1;
        var beginMonthRange = isOverYear ? 12 : endMonth;
        var monthRange = isOverYear ? (endMonth + 12 - beginMonth + 1) : (endMonth - beginMonth);
        //x轴内容
        var x_categories = [];
        for (var i = beginMonth; i <= beginMonthRange; i++) {

            x_categories.push($.publicMethod.toString(new Date(beginyear, i, 1), 'yyyy-MM'));
            if (isOverYear && i == beginMonthRange) {
                for (var j = 1; j <= endMonth; j++) {
                    x_categories.push($.publicMethod.toString(new Date(endyear, j, 1), 'yyyy-MM'));
                };

            };
        };
        //数据
        var chartData = [];
        var chartDataObj = {
            name: cantonName
        , data: []
        };
        for (var i = 1; i <= monthRange; i++) {
            var colIndex = i;
            if (i % 12 > 0) {
                colIndex = colIndex % 12;
            } else {
                colIndex = 12;
            };
            chartDataObj.data.push(subData[0]['col_' + colIndex]);

        };
        chartData.push(chartDataObj);
        var chartsSetting = {
            title: cantonName + "设施正常运行率",
            subtitle: "统计时间:" + $.publicMethod.toString(beginData, 'yyyy-MM') + "~" + $.publicMethod.toString(endData, 'yyyy-MM'),
            yAxisTitle: "",
            categories: x_categories,
            data: chartData,
            container: $("#container"),
            pointFormat: '正常运行率:<b>{point.y:2f} %</b>',
            format_plotOptions: '{point.y:2f} %'
        };
        charts_Columnload(chartsSetting);
    };
};

function onmonthUp(parameters) {

};
function onmonthDown(parameters) {

};

//结束时间设置
function onDrawDateBegin(e) {
    var date = e.date;
    var d = new Date();

    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.timeFrom.value)) {
        if (date.getTime() > $.page.idM.timeTo.value) {
            e.allowSelect = false;
        };
    };
};

//开始时间设置
function onDrawDateEnd(e) {
    var date = e.date;
    var d = new Date();

    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.timeTo.value)) {
        if (date.getTime() < $.page.idM.timeFrom.value) {
            e.allowSelect = false;
        };
    };
};

function charts_Columnload(chartsSetting) {
    // Create the chart
    chartsSetting.container.show();
    chartsSetting.container.highcharts({
        chart: {
            //type: 'column'
        },
        title: {
            text: chartsSetting.title
        },
        subtitle: {
            text: chartsSetting.subtitle
        },
        credits: {
            enabled: false
        },
        xAxis: {
            categories: chartsSetting.categories
        },
        yAxis: {
            min: 0,
            title: {
                text: chartsSetting.yAxisTitle
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: chartsSetting.format_plotOptions
                }
            }
        },
        tooltip: {
            pointFormat: chartsSetting.pointFormat
        },
        series:
         chartsSetting.data
    });
};