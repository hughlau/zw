
var cantonCode = undefined;
var statusTypeList = undefined;
var statusCode = undefined;
//查询条件
var conditionData = undefined;
var callBackHanlder = undefined; //map回调函数
$.page.pageInit = function () {
    checkIsProjectSelected();
    $.page.dataSourceSettingsDictionary = {
        "cantonCode": {
            dataSourceName: "sysBasicManage.getCantonDicData"
            , dataSourceParams: { ticket: $.page.ticket, pCode: window.top['cantonCodeCache'] }
        }, "statusCode": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "631" }
        }
    };
};
$.page.pageLoad = function () {

    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.cantonCode)) {
        cantonCode = $.page.params.cantonCode;
        $.page.idM.cantonCode.setValue(cantonCode);
    };
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.statusCode)) {
        statusCode = $.page.params.statusCode;
        $.page.idM.statusCode.setValue(statusCode);
    };
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.callBackHanlder)) {
        callBackHanlder = $.page.params.callBackHanlder;
    };
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.isList)) {
        $.page.idJQ.conditionForm.hide();
    };
    onSearch();
    //政府管理者角色登录后，隐藏设备运行状态  songshasha 2016-11-9
    //    if (fw.fwCookie.FWCookieHelper("login_role") == "govAdminRole") {

    //        $.page.idM.datagrid1.hideColumn("status");
    //        $("#statusSpan").hide();
    //        $("#statusCode").hide();
    //    }
    //    else {
    //        $.page.idM.datagrid1.showColumn("status");
    //    }
};
 

function onSearch(cSettings) {
    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();  
    //datagrid加载数据
    datagrid1_Load(1, undefined, cSettings);
    //加载统计数据  
    //loadSiteStatisByStatus();
};

//数据导出
function dataExport() {
    onSearch({ isExport: true, pageSize: fw.fwNumber.intMaxValue, pageIndex: 1 });
    $.page.exportFile({ idM: $.page.idM.datagrid1, reportName: '设施状态列表' });
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


function datagrid1_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "address":
            if (e.record.longitude != 0 && e.record.latitude != 0) {
                html = "<a href=\"javascript:sitelocation(" + e.rowIndex + ")\" style=\"color:blue;\"><img src=\"../style/images/location.png\" style=\"width:18px;height:18px;box-sizing: content-box;\" /></a>" + "  <a href=\"javascript:openInfo('" + $.pageCustomer.enumOperate.view + "','" + e.record.monitorSiteCode + "')\" style=\"color:blue;\"></a>";
            } else {
                //html = "<a href=\"javascript:openInfo('" + $.pageCustomer.enumOperate.view + "','" + e.record.monitorSiteCode + "')\" style=\"color:blue;\">" + e.value + "</a>";
            }; 
            break;
        case "monitorSiteName":
            html = "<a href=\"javascript:openInfo('" + $.pageCustomer.enumOperate.view + "','" + e.record.monitorSiteCode + "')\" style=\"color:blue;\">" + e.value + "</a>";
            break;          
        case "operateTime":
            html = (fw.fwObject.FWObjectHelper.hasValue(e.value)) ? fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(e.value), $.pageCustomer.dateDay) : "--";
            break;
        case "statusCode":
            html = "<span style='color: " + e.record.color + ";' >●" + e.value + "</span>";
            break;  
        default:
            break;
    };
    return html;
};


function sitelocation(rowIndex) {
    var row = $.page.idM.datagrid1.getRow(rowIndex);
    if (fw.fwObject.FWObjectHelper.hasValue(row)) {
        //触发操作
        window.parent.$("div.title_min", window.parent.divPopUpFrameBoxJQ).click();
        fw.callFunction(window.parent, callBackHanlder, [row]);

    };

};

function datagrid1_Load(pageIndex, pageSize,cSettings) {
    //如果没传入页数
    if (!$.pageCustomer.hasValue(pageIndex)) {
        //将页数设置为datagrid的页数
        pageIndex = $.page.idM.datagrid1.pageIndex;
    };
    //如果没传入分页大小
    if (!$.pageCustomer.hasValue(pageSize)) {
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

    //conditionData.monitorSiteStatusList = statusTypeList;
    conditionData.equipmentType = 'dtu';
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "basicInfo"
        , methodName: "queryPageMonitorSiteStatus"
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
            if (resultData.status == fw.fwData.FWResultStatus.Success) {
                if (resultData.data != null) {
                    //设置datagrid数据
                    $.page.idM.datagrid1.set({
                        pageIndex: resultData.data.pageIndex - 1
                        , pageSize: resultData.data.pageSize
                        , totalCount: resultData.data.recordCount
                        , data: resultData.data.entityList
                    });
                } else {
                    $.page.idM.datagrid1.set({
                        pageIndex: 0
                        , pageSize:  $.page.idM.datagrid1.pageSize
                        , totalCount: 0
                        , data: []
                    });
                };
            }
            else //Roger 2016/6/1 13:00:02 增加管辖区域
            {
                var erroInfo = resultData.infoList.join("<br>");
                $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
            };

        }, complete: function () {
            $.page.idM.datagrid1.unmask();
        }
    },cSettings));

};

function openInfo(action, monitorSiteCode) {
    var data = { ticket: $.page.ticket,   pageTabs: "info,his,ws" };
    var pageParams = {};
    if (action != $.pageCustomer.enumOperate.add) {
        data.monitorSiteCode = monitorSiteCode;
    };

    pageParams = { url: "web/monitorSite/monitorSiteViewMain.htm", width: 800, height: 600, title: "净化槽信息" };
    $.pageCustomer.openPage(data, pageParams, function () {
        onSearch();
    });
};

function deleteInfo() {
    var entity = getSelectedEntity();
    entity.isDis = 1;
    mini.confirm("确定删除记录？", "确定？",
            function (action) {
                if (action == "ok") {
                    $.page.ajax($.page.getAjaxSettings({
                        serviceType: "crossDomainCall"
                        , serviceName: "basicInfo"
                        , methodName: "updateBLLMonitorSite"
                        , data: { ticket: $.page.ticket
                        , mEntity: entity
                        }
                        , success: function (resultData) {
                            //判断加载数据成功
                            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                                mini.alert("删除成功", "提示", function () {
                                    onSearch();
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
            });
};

function getSelectedEntity() {
    //获取选中项对象
    var entity = $.page.idM.datagrid1.getSelected();
    //判断对象没有值
    if (!$.pageCustomer.hasValue(entity)) {
        mini.alert("请选择一项！");
        entity = undefined;
    };
    return entity;
}; 