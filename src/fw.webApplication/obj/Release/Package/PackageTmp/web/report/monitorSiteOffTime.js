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
    buttonSearchJQ = $.page.idJQ.btnSearch;
    buttonFeedbackJQ = $.page.idJQ.buttonFeedback;
    buttonSearchJQ.bind("click", function () {
        onSearch();
    }).click();
  
};

//查询
function onSearch(cSettings) {
    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();
    conditionData.projectNo = window.top['_projectCache'];
   //conditionData.dStart = conditionData.dStart.format('YYYY-MM-DD hh:mm:ss');
    //conditionData.dEnd = moment().format('YYYY-MM-DD HH:mm:ss');
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
        , serviceName: "basicInfo"
        , methodName: "queryMonitorSiteOffTime"        
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
//             //处理接收到的数据 add by wangyang 20171024      
//            dataInformation = resultData.data.entityList;
//            dataPageIndex =resultData.data.pageIndex - 1
//            dataPageSize = resultData.data.pageSize
//            dataTotalCount = resultData.data.recordCount



            //getResultDataList(resultData.data.entityList); 
           
                //设置datagrid数据 
                $.page.idM.datagrid1.set({
                    pageIndex: resultData.data.pageIndex - 1
                    , pageSize: resultData.data.pageSize
                    , totalCount: resultData.data.recordCount
                    , data: resultData.data.entityList
                });
               
                   $.page.idM.datagrid1.mergeColumns(["zirancun"]);
              
               

            }
            else //Roger 2016/6/1 13:00:02 增加管辖区域
            {
                var erroInfo = resultData.infoList.join("<br>");
                $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
            };

        }
    }, cSettings));
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



//数据导出
function dataExport() {
    
    onSearch({ isExport: true, pageSize: fw.fwNumber.intMaxValue, pageIndex: 1 });
    $.page.exportFile({ idM: $.page.idM.datagrid1, reportName: '设备掉线情况统计报表' });
};









