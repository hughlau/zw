
var conditionData = {};

var ChartDataSource = null;
var monitorSiteCode = null;
var monitorFactorCode = null;
var equipmentCode = null;

var divGridViewChartJQ = undefined;

var monitorDate = null; //日期

var ShowType = null;
var series = [];
var startTime = undefined;
var endTime = undefined;
//页面初始化
$.page.pageInit = function () {
};

$.page.pageLoad = function () {

    //    $.page.params.monitorSiteCode = "45EEBCDC-5769-4319-8A81-684853E68E2A";
    //    $.page.params.monitorFactorCode = "000008";
    //    $.page.params.startTime = '2016-5-30';
    //    $.page.params.endTime = '2016-5-30';

    monitorSiteCode = $.page.params.monitorSiteCode;
    monitorFactorCode = $.page.params.monitorFactorCode;
    equipmentCode = $.page.params.equipmentCode;
    divGridViewChartJQ = $("#divGridViewChart");
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.monitorTime)) {
        endTime = fw.fwString.FWStringHelper.toDateTime($.page.params.monitorTime.replace('+', ' '));
        startTime = fw.fwDateTime.FWDateTimeHelper.addHours(endTime, -12);
        $.page.idM.dEnd.setValue(moment(endTime).format('YYYY-MM-DD HH:mm:ss'));
        $.page.idM.dStart.setValue(moment(startTime).format('YYYY-MM-DD HH:mm:ss'));
    };
    conditionData.monitorSiteCode = monitorSiteCode;
    conditionData.monitorFactorList = [monitorFactorCode];
    conditionData.equipmentCode = equipmentCode;

    onSearch();
};


function onSearch() {
    conditionData.dStart = $.page.idM.dStart.getValue()
    conditionData.dEnd = $.page.idM.dEnd.getValue()
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "autoMonitor"
        , methodName: "queryMonitorSiteLatestData"
        , data: {
            ticket: $.page.ticket
            , pageParams: {
                pageSize: 10000
                , pageIndex: 1
            }, queryParams: conditionData
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {

                ChartDataSource = resultData.data.entityList;
                GridViewChartBind();

            } else {
                var erroInfo = resultData.infoList.join("<br>");
                $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
            };
        }
    }));
};


var UnitName = "";
function GridViewChartBind() {
    var PollutionFactorName = "";
    var X_DataFieldList = [];
    var Y_DataFieldList = [];
    var StandFieldList = [];
    // var igCode = cblFactorListJQ.getValue();
    var igCodeList = [monitorFactorCode];

    series = [];

    if (igCodeList != null && igCodeList.length > 0) {
        for (var j = 0; j < igCodeList.length; j++) {
            if (ChartDataSource != null && ChartDataSource.length > 0) {

                var StandardLowerLimit = null;
                var StandardUpperLimit = null;
                var igName = "";
                var AxisMaximum = null;
                UnitName = null;

                UnitName = ($.pageCustomer.hasValue(ChartDataSource[0].unitName)) ? ChartDataSource[0].unitName : "";
                var dataList = [];
                for (var i = 0; i < ChartDataSource.length; i++) {
                    if (igCodeList[j] == ChartDataSource[i].monitorFactorCode) {
                        if (!$.pageCustomer.hasValue(igName)) {

                            igName = ChartDataSource[i].monitorFactorName;
                        };
                        var _monitorDate = moment(ChartDataSource[i].monitorDate); //.format('YYYY-MM-DD HH:mm:ss');
                        var UTCVal = Date.UTC(_monitorDate.year(), _monitorDate.month(), _monitorDate.date(), _monitorDate.hour(), _monitorDate.minute(), _monitorDate.second());
                        dataList.push([UTCVal, ChartDataSource[i].monitorValue]);
                    };
                };
                series.push({ name: igName, data: dataList });
            };
        };

        InitChartOptions(series);
        return;
        divGridViewChartJQ.highcharts({
            chart: {
                type: 'line'
            }
        , credits: { enabled: false }, title: {
            text: '',
            x: -20 //center
        },
            xAxis: {
                categories: X_DataFieldList
            },
            yAxis: {
                title: {
                    text: '监测值'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: UnitName
            , formatter: function () {
                //return '<b>' + this.series.name + '</b><br>' + this.x + ' ' + this.y + UnitName;
                return fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(this.x), $.pageCustomer.dateTimeHour) + '<br>监测值 ' + this.y + UnitName;
            }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: series
        });
    };
};
function InitChartOptions(seriesData, siteName) {
    $('#divGridViewChart').highcharts({
        chart: {
            type: 'spline'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        credits: {
            enabled: false
        },
        legend: {
            align: 'center',
            verticalAlign: 'top'
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                day: '%y/%m/%e',
                month: '%y/%m/%e',
                year: '%Y-%m'
            },
            title: {
                text: ''
            }
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        tooltip: {
            headerFormat: '<b> {series.siteName}</b><b>{series.name}</b><br>',
            pointFormat: '{point.x:%Y-%m-%e %H:%M:%S}: <b>{point.y:.2f}</b> '
        },
        plotOptions: {
            spline: {
                marker: {
                    enabled: true
                }
            }
        },
        series: seriesData
    });
};