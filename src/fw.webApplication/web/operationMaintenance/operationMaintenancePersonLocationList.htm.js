var callBackHanlder = undefined; //map回调函数
//页面初始化
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
    };
};

//查询条件
var conditionData = undefined;
var callBackHanlder = undefined; //map回调函数
//页面加载
$.page.pageLoad = function () {
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.callBackHanlder)) {
        callBackHanlder = $.page.params.callBackHanlder;
    };
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.callBackHanlder)) {
        callBackHanlder = $.page.params.callBackHanlder;
    };
    //开始查询
    onSearch();

};

//查询
function onSearch() {
    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();
    //datagrid加载数据
    datagrid1_Load(0);
};

//数据加载前包括（页数发生变化时）
function datagrid1_BeforeLoad(e) {
    //取消datagrid的miniui自动加载
    e.cancel = true;
    //miniui的页数与实际相差1页
    var pageIndex = e.data.pageIndex + 1;
    var pageSize = e.data.pageSize;
    //datagrid加载数据
    datagrid1_Load(pageIndex, pageSize);
};

//单元格渲染事件
function datagrid1_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "operationMaintenanceUnitName":
            html = "<a href=\"javascript:openInfo('query','" + e.record.operationMaintenanceUnitCode + "')\" style=\"color:blue;\">" + e.value + "</a>";
            break;
        case "latitude":
        case "longitude": 
            html = $.pageCustomer.toFixed(e.value,6);
            break;
        case "op":
            html = "<a href=\"javascript:personlocation(" + e.rowIndex + ")\" style=\"color:blue;\">定位</a>";
            break;
        default:
            break;
    };
    return html;
};

function personlocation(rowIndex) {
    var row = $.page.idM.datagrid1.getRow(rowIndex);
    if (fw.fwObject.FWObjectHelper.hasValue(row)) {
        //触发操作
        fw.callFunction(window.parent, callBackHanlder, [row]);

    };

};

//datagrid数据加载
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
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "operationMaintenance"
        , methodName: "getMBLLOperationMaintenancePersonLocationList"
        , data: {
            ticket: $.page.ticket
            , keyWord: conditionData.keyWord
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                //设置datagrid数据
                $.page.idM.datagrid1.set({
                    data: resultData.data
                });
            }
            else //Roger 2016/6/1 13:00:02 增加管辖区域
            {
                var erroInfo = resultData.infoList.join("<br>");
                $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
            };
        }
    }));
};


//打开信息窗口
function openInfo(action, operationMaintenanceUnitCode) {
    //是否满足条件打开窗口
    var isOpen = true;
    //打开窗口传入的数据
    var data = {
        ticket: $.page.ticket
        , action: action
    };
    //判断传入了记录编码
    if (fw.fwObject.FWObjectHelper.hasValue(operationMaintenanceUnitCode)) {
        data.operationMaintenanceUnitCode = operationMaintenanceUnitCode;
    } else {
        //判断是修改或者是查看信息
        if (action == "update" || action == "query") {
            //获取选中项编码
            operationMaintenanceUnitCode = getOperationMaintenanceUnitCode();
            //判断选中了项
            if (fw.fwObject.FWObjectHelper.hasValue(operationMaintenanceUnitCode)) {
                data.operationMaintenanceUnitCode = operationMaintenanceUnitCode;
            } else {
                isOpen = false;
            };
        } else {
            //判断不是新增
            if (action != "insert") {
                isOpen = false;
            };
        };
    };

    //判断满足条件打开窗口

    if (isOpen) {
        //获得传入的参数字符串
        var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/operationMaintenance/operationMaintenanceUnit.htm", $.page.webSiteRootUrl), data);
        //打开窗口
        mini.open({
            url: url
            , title: "运维单位"
            , width: 860
            , height: 620
            , onload: function () {
                //var iframe = this.getIFrameEl();
                //iframe.contentWindow;
            }
            , ondestroy: function (action) {
                //判断非（关闭和取消）窗口
                if (action != "close" && action != "cancel") {
                    //datagrid加载数据
                    datagrid1_Load();
                };
            }
        });
    };
}; 

 