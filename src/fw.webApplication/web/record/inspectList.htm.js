//查询条件
var conditionData = {};
var datagrid1JQ = null;
var buttonSearchJQ = null;
var buttonGenerateTaskJQ = null;
var buttonIsSolveJQ = null;
var buttonAddJQ = null;
var buttonFeedbackJQ = null;
$.page.pageInit = function () {
    checkIsProjectSelected();
    $.page.dataSourceSettingsDictionary = {
        "cantonCode": {
            dataSourceName: "sysBasicManage.getCantonDicData"
            , dataSourceParams: { ticket: $.page.ticket, pCode: window.top['cantonCodeCache'] }
        }
        , "cmbresponsiblePartyId": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BLLresponsibleParty" }
        }
        , "cmbdamagedContentId": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BLLdamagedContent" }
        }
        , "cmbrecoveryPeopleId": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BLLrecoveryPeople" }
        }
        , "cmInspectionStatus": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BLLInspectionResult" }
        }
    };
    $.page.idM.mCallTimeFrom.setValue(moment().subtract(7, 'days').format('YYYY-MM-DD'));
    $.page.idM.mCallTimeTo.setValue(moment().format('YYYY-MM-DD'));
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.keyword)) {
        $.page.idM.keyword.setValue($.page.params.keyword);
        $.page.idM.mCallTimeFrom.setValue(moment().subtract(365, 'days').format('YYYY-MM-DD'));
    };
};
/* 页面加载 */
$.page.pageLoad = function () {
    //政府管理员角色隐藏电流读数两列
    if (fw.fwCookie.FWCookieHelper("login_role") == 'govAdminRole') {
        mini.get("datagrid1").hideColumn("meterNum");
        mini.get("datagrid1").hideColumn("lastMeterNum");
    }
    datagrid1JQ = $.page.idM.datagrid1;
    buttonSearchJQ = $.page.idJQ.btnSearch;
    buttonAddJQ = $.page.idJQ.buttonAdd;
    var buttonEditJQ = $.page.idJQ.buttonEdit;
    var buttonDeleteJQ = $.page.idJQ.buttonDelete;
    buttonFeedbackJQ = $.page.idJQ.buttonFeedback;

    $("#btnExSearch").click(function () {
        $(".exSearch").toggle();
    });
    //'添加'点击事件
    buttonAddJQ.on("click", function () {
        // var data = { ticket: $.page.ticket, action: $.pageCustomer.enumOperate.add };

        openInfo($.pageCustomer.enumOperate.add);//'add'
    });
    // 修改  某一条列表
    buttonEditJQ.on("click", function () {
        var entity = getSelectedEntity();
        if (!entity) {
            return;
        };
        if (entity.status == 2) {
            mini.alert("任务已经接收,不可修改。");
            return;
        }
        if (entity.status == 4) {
            mini.alert("任务已经完成,不可修改。");
            return;
        }
        if (entity.isSolve == 1) {
            mini.alert("任务已经解决,不可修改。");
            return;
        }
        openInfo($.pageCustomer.enumOperate.edit, entity.operationMaintenanceTaskCode);
    });


    //点击删除按钮/删除事件
    buttonDeleteJQ.on('click', function () {

        var Entity = getSelectedEntity();
        if (!Entity) {
            return;
        };
        if (Entity.isSolve == 1) {
            mini.alert("任务已经解决,不可删除。");
        } else {
            deleteInfo();
        };

    })
    buttonSearchJQ.bind("click", function () {
        onSearch();
    }).click();
};

//查询
function onSearch(cSettings) {
    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();
    conditionData.projectNo = window.top['_projectCache'];
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

function onTypeChange() {
    var chkVal = mini.get("IrrAreaState").value;
    $(window.parent.document).contents().find("#recordFrame").attr('src', chkVal+'.htm');
}

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
        , methodName: "queryPageDailyMaintenanceTaskByWeb"
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
                //处理接收到的数据       

                //getResultDataList(resultData.data.entityList); 

                //设置datagrid数据 
                $.page.idM.datagrid1.set({
                    pageIndex: resultData.data.pageIndex - 1
                    , pageSize: resultData.data.pageSize
                    , totalCount: resultData.data.recordCount
                    , data: resultData.data.entityList
                });
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

    var html = '';
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
        case "imgName":
            if ($.pageCustomer.hasValue(e.record.imgName)) {
                html = "<div>" + $.OperationMaintenancePage.showImg(e.record.imgName) + "</div>";
            }
            break;
    };
    return html;
};


//function mouseOut() {
//    $("#divImage").hide();
//}
//function mouseOver(obj) {
//    //获取标签id
//    $("#divImage").show();
//    $("#imgbig").remove();
//    var image = $('<img id="imgbig">');
//    image.attr("src", $(obj).attr("src"));
//    $("#divImage").append(image);
//    var rate;
//    var rateW = 500 / image.width();
//    var rateH = 500 / image.height();

//    rate = rateW < rateH ? rateW : rateH;
//    //$("#image1")[0].height = image.height() * rate;
//    //$("#image1")[0].width = image.width() * rate;
//    // $("#imgbig").hide();
//    //alert(image.height()*rate);
//    $("#imgbig").attr({ width: image.width() * rate, height: image.height() * rate });

//};


//function showImg(imgName) {
//    var html = '';
//    if (imgName != null && imgName.length > 0) {
//        var monitorImgList = [];

//        monitorImgList = imgName.split("_");
//        // monitorImgList = fw.fwJson.FWJsonHelper.deserializeObject("ddd");
//         html = '<table><tr>';
//        if (fw.fwObject.FWObjectHelper.hasValue(monitorImgList)) {
//            for (var i = 0; i < monitorImgList.length; i++) {
//                var entity = monitorImgList[i];
//                entity = fw.fwUrl.FWUrlHelper.getAbsoluteUrl(entity, 'upload/')
//                var src = fw.fwUrl.FWUrlHelper.getAbsoluteUrl(entity, $.page.webSiteRootUrl);

//                html += '<td><img class="hoverCls"  style="width: 60px; height: 60px" src=' + src + ' id=' + monitorImgList[i] + ' onmouseover="mouseOver(this)" ></img></td>';


//            };
//        }

//        html += '</tr></table>';

//    }
//    return html;
//}

//行选择改变时
function datagrid1_SelectionChanged(e) {
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




function openListInfo(monitorSiteCode) {
    var data = { ticket: $.page.ticket, monitorSiteCode: monitorSiteCode, startTime: $.page.DTToString($.page.idM.mCallTimeFrom.getValue(), "yyyy-MM-dd"), endTime: $.page.DTToString($.page.idM.mCallTimeTo.getValue(), "yyyy-MM-dd") };
    var pageParams = {};
    pageParams = { url: "web/report/dailyMaintenanceTaskList.htm", width: 900, height: 900, title: "运维统计明细", showMaxButton: true };
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
    $.page.exportFile({ idM: $.page.idM.datagrid1, reportName: '日常运维列表' });
};

//数据导出
function dataPrint() {
    var operatioRecordCodeList = undefined;
    var entityList = $.page.idM.datagrid1.getSelecteds();
    //判断对象集合没有值
    if (!fw.fwObject.FWObjectHelper.hasValue(entityList) || entityList.length < 1) {
        mini.alert("请选择需要操作项！");
        entityList = undefined;
    };
    if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
        operatioRecordCodeList = [];
        for (var i = 0; i < entityList.length; i++) {
            operatioRecordCodeList.push(entityList[i].operationMaintenanceTaskCode);
        };
    };

    var url = reportUrl.format(operatioRecordCodeList.join(','), "dailyRecord");

    //打开窗口
    mini.open({
        url: url
        , title: "巡检记录打印"
        , width: 350
        , height: 150
        , onload: function () {
        }
        , ondestroy: function (action) {
            //判断非（关闭和取消）窗口
            if (action != "close" && action != "cancel") {
                datagrid1_Load($.page.idM.datagrid1.pageIndex + 1);
                //onSearch();
            };
        }
    });

};
// 分离市镇村、自然村
function getResultDataList(resultDataList) {

    for (var i = 0; i < resultDataList.length; i++) {
        //市镇村、自然村分离
        var resultDataArr = resultDataList[i].cantonName.split('.');
        //市镇村、自然村分别添加到每一组数据中
        //镇
        resultDataList[i].townName = resultDataArr[1];
        //村
        resultDataList[i].villageName = resultDataArr[2];
        //自然村
        resultDataList[i].cantonName = resultDataArr[3];
        //中间加的连接符 
        var connector = resultDataList[i].remark ? '_' : '';

        resultDataList[i].remark = resultDataList[i].operationMaintenanceTaskName + connector + resultDataList[i].remark;
        resultDataList[i].createTime = resultDataList[i].createTime.split(' ')[0];


    }

}
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
    //var pageParams = { url: "mobile/operationMaintenance/operationMaintenanceView/dailyMaintenanceAdd.htm", width: 800, height: 600, title: "任务信息" };
    var pageParams = { url: "web/report/dailyMaintenanceTaskAdd.htm", width: 800, height: 600, title: "任务信息" };
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
