var treeCantonData = [];
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

//页面加载
$.page.pageLoad = function () {

    //设置默认查询参数
    //$.page.idM.keyword.setValue($.page.params.keyword);

    //开始查询
    onSearch();
    //$.page.idM.datagrid1.loadList(treeCantonData_1, "cantonCode", "pCantonCode"); 


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
        , methodName: "queryOperatingConditionStatistics"//"queryRealTimeMonitorSiteStatis"
        , data: {
            ticket: $.page.ticket,
            cantonCode: cantonCode_check,
            beginTime: beginData,
            endTime: endData 
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) { 
                treeCantonData = resultData.data;
                $.page.idM.datagrid1.loadList(treeCantonData, "cantonCode", "parentCantonCode");
            };
        },
        complete: function () {
            $.page.idM.datagrid1.unmask();
        }
    }));
};
//单元格渲染事件
function datagrid1_Renderer(e) {
    var html = "";
    switch (e.field) {

        case "omCount_SUM":
            html = fw.fwObject.FWObjectHelper.hasValue(e.value) ? e.value : 0;
            break;
        case "deviceAmount":
            html = fw.fwObject.FWObjectHelper.hasValue(e.value) ? e.value : 0;
            break;
        case "errCount_SUM":
            if (!fw.fwObject.FWObjectHelper.hasValue(e.value) || e.value == 0) {
                html = 0;
            } else {
                if (!fw.fwObject.FWObjectHelper.hasValue(e.record.khDay_SUM) || e.record.khDay_SUM == 0) {
                    html = 0;
                } else {
                    html = $.publicMethod.toFixed(e.value * 100.0 / e.record.khDay_SUM, 2) + '%';
                };
            };
            break;
        case "actDay_SUM":
            if (!fw.fwObject.FWObjectHelper.hasValue(e.value)||e.value==0) {
                html = 0;
            } else {
                if (!fw.fwObject.FWObjectHelper.hasValue(e.record.khDay_SUM) || e.record.khDay_SUM==0) {
                    html = 0;
                } else {
                    html = $.publicMethod.toFixed(e.value * 100.0 / e.record.khDay_SUM, 2) + '%';
                };
            }; 
            break;
        case "overCount_SUM":
            if (!fw.fwObject.FWObjectHelper.hasValue(e.value) || e.value == 0) {
                html = 0;
            } else {
                if (!fw.fwObject.FWObjectHelper.hasValue(e.record.actCount_SUM) || e.record.actCount_SUM == 0) {
                    html = 0;
                } else {
                    html = $.publicMethod.toFixed(e.value * 100.0 / e.record.actCount_SUM, 2) + '%';
                };
            };
            break;
        case "normalOpRate":
            html = $.publicMethod.toFixed(e.value, 2) + '%';
            break;
        case "standardDischargeRate":
            html = $.publicMethod.toFixed(e.value, 2) + '%';
            break;
        case "op":
            html = "<a href=\"javascript:openInfo('" + e.record.cantonName + "'," + e.record.deviceAmount + ")\" style=\"color:blue;\">详细</a>";
            break;
        default:
            break;
    };
    return html;
};

function openInfo(cantonName, num) {
    var data = { ticket: $.page.ticket };
    data.cantonName = cantonName;
    data.monitorSiteCount = num;
    var pageParams = { url: "web/report/regionRunInfoDeatil.htm", width: 800, height: 600, title: "区域运行情况统计明细" };
    $.pageCustomer.miniOpen(data, pageParams);
};

//单元格点击事件
function datagrid1_Cellclick(e) {
    //    {
    //    sender: Object, //表格对象
    //    record: Object, //行对象
    //    column: Object //列对象
    //} 
    switch (e.field) {
        case "deviceAmount":
            {
                var cantonName = e.row.cantonName;
                var cantonCode = e.row.cantonCode;
                //获取单元格内容  市/镇 获取子集数据
                if (e.row.CTLvl == 2) {
                    //村级数据不出现图表
                    $("#container").hide();
                } else {
                    var subData = $.Enumerable.From(treeCantonData).Where("$.parentCantonCode==" + cantonCode).OrderByDescending("$.deviceAmount").ToArray();
                    //对象输出 调试
                    //.forEach(function (i) {
                    //                            console.log(i.cantonName + ";" + i.cantonCode + ";" + i.deviceAmount + ";" + i.pCantonCode + "<br/>");
                    //                        });
                    if (!fw.fwObject.FWObjectHelper.hasValue(subData) || subData.length < 1) {
                        //无数据 div显示
                        $("#container").hide();
                        return;
                    };
                    var chartData = [];
                    var chartDataObj = {
                        name: ""
                        , data: []
                    };
                    for (var i = 0; i < subData.length; i++) {
                        var data_s = [];
                        data_s.push(subData[i].cantonName);
                        data_s.push(subData[i].deviceAmount);
                        chartDataObj.data.push(data_s);
                    };
                    chartData.push(chartDataObj);
                    var chartsSetting = {
                        title: cantonName + "设施安装数量",
                        subtitle: "统计时间:" + $.publicMethod.toString($.page.idM.timeFrom.value, 'yyyy-MM-dd HH:mm:ss') + "~" + $.publicMethod.toString($.page.idM.timeTo.value, 'yyyy-MM-dd HH:mm:ss'),
                        yAxisTitle: "",
                        data: chartData,
                        container: $("#container"),
                        pointFormat: '安装数量:<b>{point.y} 台</b>',
                        format_plotOptions: '{point.y}'
                    };
                    charts_Columnload(chartsSetting);
                };
            };
            break;
        case "actDay_SUM":
            {
                var cantonName = e.row.cantonName;
                var cantonCode = e.row.cantonCode;
                //获取单元格内容  市/镇 获取子集数据
                if (e.row.CTLvl == 2) {
                    //村级数据不出现图表
                    $("#container").hide();
                } else {
                    var subData = $.Enumerable.From(treeCantonData).Where("$.parentCantonCode==" + cantonCode).OrderByDescending("$.actDay_SUM").ToArray();
                    if (!fw.fwObject.FWObjectHelper.hasValue(subData) || subData.length < 1) {
                        $("#container").hide();
                        return;
                    };
                    var chartData = [];
                    var chartDataObj = {
                        name: ""
                        , data: []
                    };
                    for (var i = 0; i < subData.length; i++) {
                        var data_s = [];
                        data_s.push(subData[i].cantonName);
                        data_s.push(subData[i].normalOpRate);
                        chartDataObj.data.push(data_s);
                    };
                    chartData.push(chartDataObj);
                    var chartsSetting = {
                        title: cantonName + "设施正常运行率",
                        subtitle: "统计时间:" + $.publicMethod.toString($.page.idM.timeFrom.value, 'yyyy-MM-dd HH:mm:ss') + "~" + $.publicMethod.toString($.page.idM.timeTo.value, 'yyyy-MM-dd HH:mm:ss'),
                        yAxisTitle: "",
                        data: chartData,
                        container: $("#container"),
                        pointFormat: '正常运行率:<b>{point.y:.2f}% </b>',
                        format_plotOptions: '{point.y:.2f}%'
                    };
                    charts_Columnload(chartsSetting);
                };
            };
            break;
        case "standardDischargeRate":
            {
                var cantonName = e.row.cantonName;
                var cantonCode = e.row.cantonCode;
                //获取单元格内容  市/镇 获取子集数据
                if (e.row.CTLvl == 2) {
                    //村级数据不出现图表
                    $("#container").hide();
                } else {
                    var subData = $.Enumerable.From(treeCantonData).Where("$.parentCantonCode==" + cantonCode).OrderByDescending("$.standardDischargeRate").ToArray();
                    if (!fw.fwObject.FWObjectHelper.hasValue(subData) || subData.length < 1) {
                        //无数据 div显示
                        $("#container").hide();
                        return;
                    };
                    var chartData = [];
                    var chartDataObj = {
                        name: "设备个数"
                        , data: []
                    };
                    for (var i = 0; i < subData.length; i++) {
                        var data_s = [];
                        data_s.push(subData[i].cantonName);
                        data_s.push(subData[i].standardDischargeRate);
                        chartDataObj.data.push(data_s);
                    };
                    chartData.push(chartDataObj);
                    var chartsSetting = {
                        title: cantonName + "设施达标排放率",
                        subtitle: "统计时间:" + $.publicMethod.toString($.page.idM.timeFrom.value, 'yyyy-MM-dd HH:mm:ss') + "~" + $.publicMethod.toString($.page.idM.timeTo.value, 'yyyy-MM-dd HH:mm:ss'),
                        yAxisTitle: "",
                        data: chartData,
                        container: $("#container"),
                        pointFormat: '达标排放率:<b>{point.y:.2f}% </b>',
                        format_plotOptions: '{point.y:.2f}%'
                    };
                    charts_Columnload(chartsSetting);
                };
            };
            break;
        case "maintainNumber":
            {
                var cantonName = e.row.cantonName;
                var cantonCode = e.row.cantonCode;
                //获取单元格内容  市/镇 获取子集数据
                if (e.row.CTLvl == 2) {
                    //村级数据不出现图表
                    $("#container").hide();
                } else {
                    var subData = $.Enumerable.From(treeCantonData).Where("$.parentCantonCode==" + cantonCode).OrderByDescending("$.maintainNumber").ToArray();
                    if (!fw.fwObject.FWObjectHelper.hasValue(subData) || subData.length < 1) {
                        //无数据 div显示
                        $("#container").hide();
                        return;
                    };
                    var chartData = [];
                    var chartDataObj = {
                        name: "设备个数"
                        , data: []
                    };
                    for (var i = 0; i < subData.length; i++) {
                        var data_s = [];
                        data_s.push(subData[i].cantonName);
                        data_s.push(subData[i].maintainNumber);
                        chartDataObj.data.push(data_s);
                    };
                    chartData.push(chartDataObj);
                    var chartsSetting = {
                        title: cantonName + "设施维护次数",
                        subtitle: "统计时间:" + $.publicMethod.toString($.page.idM.timeFrom.value, 'yyyy-MM-dd HH:mm:ss') + "~" + $.publicMethod.toString($.page.idM.timeTo.value, 'yyyy-MM-dd HH:mm:ss'),
                        yAxisTitle: "",
                        data: chartData,
                        container: $("#container"),
                        pointFormat: '维护次数:<b>{point.y} </b>',
                        format_plotOptions: '{point.y}'
                    };
                    charts_Columnload(chartsSetting);
                };
            };
            break;
        default:
            break;
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
            type: 'column'
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
            type: 'category'
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