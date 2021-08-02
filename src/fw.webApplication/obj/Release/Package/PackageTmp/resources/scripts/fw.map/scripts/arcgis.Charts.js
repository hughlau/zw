

//加载饼图
var HighChatTools = {
    loadChart: function (properties) {
        var Settings = {
            type: 'pie',
            RenderTo: "", //编号
            EntityList: null
        };
        $.extend(Settings, properties);
        var chatJQ = $("#" + Settings.RenderTo);
        chatJQ.highcharts({
            chart: {
                type: Settings.type
            },
            title: {
                text: Settings.text,
                x: -20 //center
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: Settings.xAxis
            },
            yAxis: {
                title: {
                    text: Settings.yAxis_title
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: Settings.data
        });
    }
    ,
    //加载地图图表
    loadMapChart: function (properties) {
        var Settings = {
            type: 'pie',
            RenderTo: "", //编号
            EntityList: null,
            onClickEvent: null
        };
        $.extend(Settings, properties);
        var chatJQ = $("#" + Settings.RenderTo);
        openPage = function (cantonCode) {
            if (fw.fwObject.FWObjectHelper.hasValue(Settings.onAllClickEvent) && fw.fwObject.FWObjectHelper.hasValue(cantonCode)) {
                Settings.onAllClickEvent(cantonCode);
            }
        };
        chatJQ.highcharts({
            chart: {
                type: Settings.type,
                margin: [0, -20, 0, -20],
                backgroundColor: 'rgba(255, 255, 255, 0)'
            },
            credits: {
                enabled: false
            },
            title: {
                align: 'center',
                verticalAlign: 'bottom',
                x: 0,
                y: 10,
                useHTML: true,
                style: { color: 'black' },
                text: "<span   onclick='javascript:openPage(" + Settings.cantonCode + ")' class='highchartTitle'>" + Settings.cantonName + "</span>"

            },

            tooltip: {
                formatter: function () {
                    return this.key + ":" + this.y;
                }
            },
            //                                credits:
            //                                {
            //                                    enabled: false,
            //                                    href: ""
            //                                },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: 'black',
                        distance: -20,
                        format: '{y}'
                    },
                    events: {
                        click: function (event) {
                            if (fw.fwObject.FWObjectHelper.hasValue(Settings.onClickEvent)) {
                                Settings.onClickEvent(event.point);
                            }
                            ;

                        }
                    },
                    formatter: function (index) {
                        return '<span style="color:#00008B;font-weight:bold">' + this.point.y + '</span>';
                    }
                },
                column: {
                    events: {
                        click: function (event) {
                            alert(event.point.name);
                        }
                    }
                }
            },
            series: [{
                data: Settings.EntityList
            }]
        });
    }
};




