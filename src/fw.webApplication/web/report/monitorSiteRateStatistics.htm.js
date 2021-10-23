//页面初始化
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
        "cantonCode": {
            dataSourceName: "sysBasicManage.getCantonDicData"
            , dataSourceParams: {  }
        }
    };
};

//查询条件
var conditionData = undefined;
var treeCantonData = undefined;
var startTime = undefined;
var endTime = undefined;
var searchTypeCode = undefined;   //ZCYXL设备正常   DBPFL达标排放  
var spName = undefined;
var searchTypeName = undefined;
//页面加载
$.page.pageLoad = function () {

    //设置默认查询参数
    $.page.idM.keyword.setValue($.page.params.keyword);
 
    startTime = moment(moment().get('year') + "-01-01", "YYYY-MM-DD").format("YYYY-MM-DD");
    endTime = moment().format("YYYY-MM-DD");
    $.page.idM.timeFrom.setValue(startTime);
    $.page.idM.timeTo.setValue(endTime);

    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.searchTypeCode)) {
        searchTypeCode = $.page.params.searchTypeCode;
    }; 
    switch (searchTypeCode) {
    case "DBPFL":
        {
            spName = "rpt_StatDBPFL";
            searchTypeName = "达标排放率";
        } ;
        break;
    case "ZCYXL":
        {
            spName = "rpt_StatZCYXL";
            searchTypeName = "设备正运行率"; 
        } ;
        break;
        default:{
                spName = "rpt_StatZCYXL";
                searchTypeName = "设备正运行率"; 
        }  

    }
    //开始查询
    onSearch();
};

//moment(timeFiled, "YYYY-MM-DD")
function setColumns() {
    var beginData = moment($.page.idM.timeFrom.getValue()); //.format("YYYY-MM-DD");  
    var endData = moment($.page.idM.timeTo.getValue()); //.format("YYYY-MM-DD");  
    var beginyear = beginData.get('year'); //getFullYear();
    var endyear = endData.get('year'); //getFullYear();
    var beginMonth = beginData.get('month') + 1; //getMonth() + 1;
    var endMonth = endData.get('month') + 1; //.getMonth() + 1;
    var isOverYear = (beginyear != endyear);  //是否跨年
    var colIndex = 1;
    var monthRange = isOverYear ? 12 : endMonth;
    var columns_data = [
    { type: "indexcolumn", header: "序号", width: 30, headerAlign: "center" },
    { header: "厂区名称", field: "name", name: "cantonNameT", width: 100, headerAlign: "center", align: "left" }
    ];
    for (var i = beginMonth; i <= monthRange; i++) {
        var timestr = moment(new Date(beginyear, i - 1, 1)).format("YYYY-MM-DD");
        var col_obj = {
            header: i != beginMonth ? i + "月" : beginyear + "<br>" + i + "月",
            field: timestr,
            width: 60,
            headerAlign: "center",
            align: "right",
            allowSort: "true",
            renderer: "perdata_Renderer"
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
                var timestr_e = moment(new Date(endyear, j - 1, 1)).format("YYYY-MM-DD");
                var col_obj_n = {
                    header: j != 1 ? j + "月" : endyear + "<br>" + j + "月",
                    field: timestr_e,
                    width: 60,
                    headerAlign: "center",
                    align: "right",
                    allowSort: "true",
                    renderer: "perdata_Renderer"
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
    
     
    var beginData = $.page.idM.timeFrom.getValue();
    var endData = $.page.idM.timeTo.getValue();
    var cantonCode_check = fw.fwObject.FWObjectHelper.hasValue($.page.idM.cantonCode.getValue()) ? $.page.idM.cantonCode.getValue() : "321282";

    beginData = fw.fwObject.FWObjectHelper.hasValue(beginData) ? moment(beginData).format("YYYY-MM-DD") : startTime;
    endData = fw.fwObject.FWObjectHelper.hasValue(endData) ? moment(endData).format("YYYY-MM-DD") : endTime;
    $.page.idM.datagrid1.loading();
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "operationMaintenance"
        , methodName: "queryMonitorSiteRateStatistics"//"queryRealTimeMonitorSiteStatis"
        , data: {
            ticket: $.page.ticket,  
            cantonCode: cantonCode_check,
            beginTime: beginData,
            endTime: endData,
            storedProcedureName:spName
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                var dataSource = fw.fwObject.FWObjectHelper.hasValue(resultData.data.columns) ? fw.fwDataTable.FWDataTableHelper.toEntityList(resultData.data) : resultData.data;
                treeCantonData = dataSource;
                setColumns();
                $.page.idM.datagrid1.loadList(dataSource, "code", "pCantonCode");
            };
        },
        complete: function () {
            $.page.idM.datagrid1.unmask();
        }
    }));

};


function perdata_Renderer(e) {
    //var html = "N/A";
    var html = "--";
    if (fw.fwObject.FWObjectHelper.hasValue(e.value)) {
        if (e.value == '1') {
            html = "100%";
        } else {
            html = (Number(e.value) * 100).toFixed(2) + '%';
        };
    };
    return html;
};


//单元格点击事件
function datagrid1_Rowclick(e) {
    var cantonName = e.row.name;
    var cantonCode = e.row.code;
    var subData = $.Enumerable.From(treeCantonData).Where("$.code==" + cantonCode).ToArray();
    if (fw.fwObject.FWObjectHelper.hasValue(subData) && subData.length == 1) {
        //遍历月份
        var beginData = moment($.page.idM.timeFrom.getValue()); //.format("YYYY-MM-DD");  
        var endData = moment($.page.idM.timeTo.getValue()); //.format("YYYY-MM-DD");  
        var beginyear = beginData.get('year'); //getFullYear();
        var endyear = endData.get('year'); //getFullYear();
        var beginMonth = beginData.get('month') + 1; //getMonth() + 1;
        var endMonth = endData.get('month') + 1; //.getMonth() + 1;
        var isOverYear = (beginyear != endyear);  //是否跨年
        var colIndex = 1;
        var monthRange = isOverYear ? 12 : endMonth;


        //数据
        var chartData = [];
        var chartDataObj = {
            name: cantonName
        , data: []
        };
        //x轴内容
        var x_categories = [];
        for (var i = beginMonth; i <= monthRange; i++) {
            x_categories.push(moment(new Date(beginyear, i - 1, 1)).format("YYYY-MM"));

            var monthData = subData[0][moment(new Date(beginyear, i - 1, 1)).format("YYYY-MM-DD")];
            if (fw.fwObject.FWObjectHelper.hasValue(monthData)) {
                chartDataObj.data.push(Number((monthData * 100).toFixed(2)));
            } else {
                chartDataObj.data.push(null);
            };

            if (isOverYear && i == monthRange) {
                for (var j = 1; j <= endMonth; j++) {
                    x_categories.push(moment(new Date(endyear, j - 1, 1)).format("YYYY-MM"));
                    var monthData_e = subData[0][moment(new Date(endyear, j - 1, 1)).format("YYYY-MM-DD")];
                    if (fw.fwObject.FWObjectHelper.hasValue(monthData_e)) {
                        chartDataObj.data.push(Number((monthData_e * 100).toFixed(2)));
                    } else {
                        chartDataObj.data.push(null);
                    };
                };
            };
        };
        chartData.push(chartDataObj);
        var chartsSetting = {
            title: cantonName + searchTypeName,
            subtitle: "统计时间:" + beginData.format("YYYY-MM") + "~" + endData.format("YYYY-MM"),
            yAxisTitle: "",
            categories: x_categories,
            data: chartData,
            container: $("#container"),
            pointFormat: searchTypeName+':<b>{point.y:2f} %</b>',
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