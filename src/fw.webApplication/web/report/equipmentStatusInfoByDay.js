//查询条件
var conditionData = {};
var datagrid1JQ = null;
var buttonSearchJQ = null;
var buttonGenerateTaskJQ = null;
var buttonIsSolveJQ = null;
var buttonAddJQ = null;
var buttonFeedbackJQ = null;
var dataInformation = null;
var dataPageIndex = null;
var dataPageSize =  null;
var dataTotalCount = null;
//页面结构加载完成后
$.page.pageInit = function () {
    checkIsProjectSelected();
    $.page.dataSourceSettingsDictionary = {
        "cantonCode": {
            dataSourceName: "sysBasicManage.getCantonDicData"
            , dataSourceParams: { ticket: $.page.ticket, pCode: window.top['cantonCodeCache'] }
        }
    };
    $.page.idM.mCallTimeFrom.setValue(moment().subtract(7, 'days').format('YYYY-MM-DD'));
    $.page.idM.mCallTimeTo.setValue(moment().format('YYYY-MM-DD'));
};
/* 页面加载 */
$.page.pageLoad = function () {     
    datagrid1JQ = $.page.idM.datagrid1;
    var buttonChartForm = $.page.idJQ.chart_form;
    var buttonChartLine = $.page.idJQ.chart_line;
    var buttonChartPilar = $.page.idJQ.chart_pilar;
    buttonSearchJQ = $.page.idJQ.btnSearch;
    buttonFeedbackJQ = $.page.idJQ.buttonFeedback;
    buttonSearchJQ.bind("click", function () {
        onSearch();
    }).click();
    //点击切换数据
    buttonChartForm.on("click", function () {
        $(this).addClass('checkedButton').siblings().removeClass('checkedButton')
       $.page.idJQ.eChartMain.hide();
       $.page.idJQ.datagrid1.show()

   });
    //点击切换折线图
     buttonChartLine.on("click", function () {
        $(this).addClass('checkedButton').siblings().removeClass('checkedButton')

        $.page.idJQ.datagrid1.hide()
        $.page.idJQ.eChartMain.show()
        getEChartsInformation('统计折线图',dataInformation,'line',false);
        
    });
     //点击切换柱状图
     buttonChartPilar.on("click", function () {
        $(this).addClass('checkedButton').siblings().removeClass('checkedButton')

        $.page.idJQ.datagrid1.hide()
        $.page.idJQ.eChartMain.show()
        getEChartsInformation('统计饼状图',dataInformation,'bar',true);;
    });
};

//查询
function onSearch(cSettings) {
    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();
    //datagrid加载数据
    datagrid1_Load(1, undefined, cSettings);
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


//datagrID数据加载
function datagrid1_Load(pageIndex, pageSize, cSettings) {
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
    if (!fw.fwObject.FWObjectHelper.hasValue(cSettings)) {
        //将分页大小设置为datagrid的分页大小
        cSettings = {
            idM: $.page.idM.datagrid1,
            isExport: false
        };
    }
    else {
        cSettings.idM = $.page.idM.datagrid1;
    };
    //排序字段
    var sortFieldList = null;
    //如果datagrid设置有排序字段
    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.datagrid1.sortField)) {
        //将排序字段设置为datagrid的排序字段
        sortFieldList = [{
            fieldName: $.page.idM.datagrid1.getSortField()
            , sortType: fw.fwData.FWSortType[$.page.idM.datagrid1.getSortOrder()]
        }];
    };
    //开启datagrid数据加载锁屏
    $.page.idM.datagrid1.loading();
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "operationMaintenance"
        , methodName: "queryPageEquipmentStatusInfoByDay"        
        , data: {
            ticket: $.page.ticket
            , pageParams: {
                pageSize: fw.fwObject.FWObjectHelper.hasValue(cSettings.pageSize) ? cSettings.pageSize : pageSize
                , pageIndex: fw.fwObject.FWObjectHelper.hasValue(cSettings.pageIndex) ? cSettings.pageIndex : pageIndex
                , sortFieldList: sortFieldList 
            }
            , queryParams: conditionData
        }
        , success: function (resultData) {
            
            
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
             //处理接收到的数据 add by wangyang 20171024      
            dataInformation = resultData.data.entityList;
            dataPageIndex =resultData.data.pageIndex - 1
            dataPageSize = resultData.data.pageSize
            dataTotalCount = resultData.data.recordCount



            //getResultDataList(resultData.data.entityList); 
           
                //设置datagrid数据 
                $.page.idM.datagrid1.set({
                    pageIndex: resultData.data.pageIndex - 1
                    , pageSize: resultData.data.pageSize
                    , totalCount: resultData.data.recordCount
                    , data: resultData.data.entityList
                });
               
                    $.page.idM.datagrid1.mergeColumns(["createTimeFormat"]);
              
               

            }
            else //Roger 2016/6/1 13:00:02 增加管辖区域
            {
                var erroInfo = resultData.infoList.join("<br>");
                $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
            };

        }
    }, cSettings));
};
//单元格渲染事件
function dataGrid_Renderer(e) {

    var html = "";
    switch (e.field) {
        case "op":
            html = "<a href=\"javascript:openListInfo( '" +
                e.record.monitorSiteCode +
                "')\" style=\"color:blue;\">明细</a>";
            break;
        case "detail":
            if ($.pageCustomer.hasValue(e.record.operationMaintenanceFormData)) {

              
                    html = " <a style=\"color:blue;cursor:pointer;\" onclick=\"dailyMaintenanceTemplate()\">详细</a>";
               
            }
            break;
    };
    return html;
};

//行选择改变时
function datagrid1_SelectionChanged(e) {
    //不可修改
    if($.page.idJQ.functionList){
        var childControls = mini.getChildControls($.page.idJQ.functionList[0]);
            for (var i = 0; i < childControls.length; i++) {
                var isEnabled = true;
                if (fw.fwObject.FWObjectHelper.hasValue(childControls[i].minSelectedCount)) {
                    if (isEnabled && childControls[i].minSelectedCount <= e.selecteds.length) {
                        isEnabled = true;
                    } else {
                        isEnabled = false;
                    };
                };
                if (fw.fwObject.FWObjectHelper.hasValue(childControls[i].maxSelectedCount)) {
                    if (isEnabled && e.selecteds.length <= childControls[i].minSelectedCount) {
                        isEnabled = true;
                    } else {
                        isEnabled = false;
                    };
                };
                childControls[i].set({ enabled: isEnabled });
            };
            if (e.selected) {
                $.page.idM.datagrid1.lastSelectedRowIndex = $.page.idM.datagrid1.indexOf(e.selected);
            };
    }
    
};


//时间选择限制 开始时间 暂存申请信息 OK
function onDrawStartDate(e) {
    var date = e.date;
    var d = new Date();
    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.mCallTimeTo.value)) {
        if (date.getTime() > $.page.idM.mCallTimeTo.value) {
            e.allowSelect = false;
        };
    };
};
//时间选择限制 结束时间 暂存申请信息 OK
function onDrawEndDate(e) {
    var date = e.date;
    var d = new Date();

    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.mCallTimeFrom.value)) {
        if (date.getTime() < $.page.idM.mCallTimeFrom.value) {
            e.allowSelect = false;
        };
    };
};
function onCloseClick(e) {
    var obj = e.sender;
    obj.setText("");
    obj.setValue("");
};


 

function openListInfo(  monitorSiteCode) {
    var data = { ticket: $.page.ticket, monitorSiteCode: monitorSiteCode, startTime: $.page.DTToString($.page.idM.mCallTimeFrom.getValue(), "yyyy-MM-dd"), endTime:$.page.DTToString($.page.idM.mCallTimeTo.getValue(), "yyyy-MM-dd")   }; 
    var pageParams = {};
    pageParams = { url: "web/report/dailyMaintenanceTaskList.htm", width: 900, height: 900, title: "运维统计明细",showMaxButton:true };
    $.page.openPage(data, pageParams);
};


//获取选中项对象
function getSelectedEntity() {
    //获取选中项对象
    var entity = $.page.idM.datagrid1.getSelected();
    //判断对象没有值
    if (!fw.fwObject.FWObjectHelper.hasValue(entity)) {
        mini.alert("请选择一项！");
        entity = undefined;
    };
    return entity;
};



//数据导出
function dataExport() {
    
    onSearch({ isExport: true, pageSize: fw.fwNumber.intMaxValue, pageIndex: 1 });
    $.page.exportFile({ idM: $.page.idM.datagrid1, reportName: '设备运行情况日统计报表' });
};

//详情
function dailyMaintenanceTemplate() {
    var data = { ticket: $.page.ticket };
    var entity = getSelectedEntity();   
    data.operationMaintenanceTaskCode = entity.operationMaintenanceTaskCode;
    data.action = $.pageCustomer.enumOperate.view;   
    //
    var pageUrl = 'dailyMaintenanceList.htm';
    var pageParams = { url: "mobile/operationMaintenance/operationMaintenanceView/" + pageUrl, width: 800, height: 600, title: "日常运维列表" };   
    $.pageCustomer.openPage(data, pageParams);
};

function feedbackInfo(operationMaintenanceTaskCode, action) {
    var data = { ticket: $.page.ticket, operationMaintenanceTaskCode: operationMaintenanceTaskCode, action: action };
    var pageParams = { url: "web/OPTask/operationsTaskFinish.htm", width: 800, height: 600, title: "任务反馈情况" };
    $.pageCustomer.openPage(data, pageParams, function (e) {
        if (e != "cancel") {
            onSearch();
        };
    });
};

/**
 * 这是点击增加按钮的函数
 * @param  {[type]} action               [表示传入的一个参数，传到下一个页面]
 * @param  {[type]} dailyMaintenanceTask [作为一个判断条件]
 * @return {[type]}                      [description]
 */
function openInfo(action, dailyMaintenanceTask) {

    var data = { ticket: $.page.ticket, action: action };
    if ($.pageCustomer.hasValue(dailyMaintenanceTask)) {
        data.operationMaintenanceTaskCode = dailyMaintenanceTask;
    };
    var pageParams = { url: "mobile/operationMaintenance/operationMaintenanceView/dailyMaintenanceAdd.htm", width: 800, height: 600, title: "任务信息" };
    // var pageParams = { url: "mobile/operationMaintenance/operationMaintenanceView/dailyMaintenanceAdd.htm", width: 800, height: 600, title: "任务信息" };
    $.pageCustomer.openPage(data, pageParams, function (e) {
        
        if (e != "cancel") {
            onSearch();
        };
    });
};
/**
 * 删除功能功能
 * 
 */
function deleteInfo() {
    var entity = getSelectedEntity();
    entity.isDis = 1;
    mini.confirm("确定删除记录？", "确定？",
            function (action) {
                if (action == "ok") {
                    $.page.ajax($.page.getAjaxSettings({
                        serviceType: "crossDomainCall"
                        , serviceName: "operationMaintenance"
                        , methodName: "insertOrUpdateDailyMaintenanceTask"
                        , data: {
                            ticket: $.page.ticket
                           , mEntity: entity
                        }
                        , success: function (resultData) {
                            //判断加载数据成功                           
                            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                                mini.alert("删除成功", "提示", function () {
                                    onSearch();
                                });
                            } else {
                                if (resultData.infoList != null && resultData.infoList.length > 0) {
                                    mini.alert(resultData.infoList[0]);
                                };
                            };
                        }
                    }));
                };
            });

};
/** add by wangyang 20171024 
 * 加载图表函数
 * @param  {[string]} text         [题目/名称]
 * @param  {[arr]} arr         [ajax请求回来的数据]
 * @param  {[string]} type        [类型 ：为折线 line/柱状图 bar ]
 * @param  {[ Boolean]} boundaryGap [ false 表示x轴为起点 ]
 * @return {[type]}             [没有返回值]
 */
function getEChartsInformation(text,arr,type,boundaryGap) {
    //获取表格内容数据
     var eChartMainJQ=$.page.idJQ.eChartMain

     var myChart = echarts.init(eChartMain);
    var option = {
      title : {
          x: 'center',           
          y: 'top',                  
        text: text,
        subtext: '',
        textStyle: {
            fontSize: 24,
            fontWeight: 'bolder',
            color: '#333'          // 主标题文字颜色
        }
      },
      tooltip : {
        trigger: 'axis'
      },
      legend: {
        y: 'bottom',  
        data:['正常','设备阻塞','设备漏气','供电故障','通讯故障','调试中'],
        textStyle: {
            fontSize: 16
        }
      },
        calculable : true,
        xAxis : [
        {
          type : 'category',
          boundaryGap : boundaryGap,
          data : []
        }
        ],
        yAxis : [
        {
          type : 'value',
          axisLabel : {
            formatter: '{value}台'
          }
        }
        ],
        series : [        
        {
          name:'正常',
          type:type,

          barGap:'8%',
          itemStyle: {
            normal: {
              color: '#009933',
            }
          },
          data:[]
        },
        {
          name:'设备阻塞',
          type:type,

          barGap:'8%',
           itemStyle: {
            normal: {
              color: '#ea42ec',
            }
          },
          data:[]         
        },
        {
          name:'设备漏气',
          type:type,

          barGap:'8%',
           itemStyle: {
            normal: {
              color: '#ff9900',
            }
          },
          data:[]
        },
        {
          name:'供电故障',
          type:type,

          barGap:'8%',
           itemStyle: {
            normal: {
              color: '#ff6666',
            }
          },
          data:[]
      },
          {
            name:'通讯故障',
            type:type,
            // barCategoryGap:'1%',
          barGap:'8%',
             itemStyle: {
            normal: {
              color: '#3399ff',
            }
          },
            data:[]
        },
            {
                name:'调试中',
                type:type,

                barGap:'8%',
                itemStyle: {
                    normal: {
                        color: '#9400D3',
                    }
                },
                data:[]
            },
            ]
          }
for (var j = 0; j < arr.length; j++) {
for (var i = 0; i <  option.series.length; i++) {

  switch(option.series[i].name)
     {
        case '设备阻塞':
        option.series[i].data.push(arr[j].blockNum);
      break;
         case '设备漏气': 
         option.series[i].data.push(arr[j].blowByNum);
      break;
         case '供电故障': 
         option.series[i].data.push(arr[j].electricFault);
      break;
         case '正常': 
         option.series[i].data.push(arr[j].normalNum);
        
         break;
         case '通讯故障':
         option.series[i].data.push(arr[j].offLineNum);

         break;
      case '调试中':
          option.series[i].data.push(arr[j].testNum);

          break;
      default:
         putchar('?');
     }
 }
  option.xAxis[0].data.push(arr[j].createTimeFormat)
}
myChart.setOption(option);
}
