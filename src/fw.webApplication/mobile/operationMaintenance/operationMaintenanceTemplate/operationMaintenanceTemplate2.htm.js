
//页面初始化
$.page.pageInit = function () {


};

/* 页面加载 */
$.page.pageLoad = function () {

    $.page.idJQ.divHeader.toolbar();

    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.operationMaintenanceTaskCode)) {
        //查询信息
        query($.page.params.operationMaintenanceTaskCode);
    } else {
        if ($.page.params.action == "operationMaintenance") {
            $.page.idJQ.aSave.show();
        };
    };

    //    var data = {
    //        ticket: $.page.ticket
    //        , taskStatus: $.page.params.taskStatus
    //    };
    //    var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("mobile/operationMaintenance/operationMaintenancePersonTaskList.htm", $.page.webSiteRootUrl), data);
    //    $.page.idJQ.aBack.attr("href", url);

    $.page.idJQ.aSave.bind("click", function () {
        //判断传入编码
        if (fw.fwObject.FWObjectHelper.hasValue($.page.params.operationMaintenanceTaskCode)) {
            //查询信息
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall"
                , serviceName: "operationMaintenance"
                , methodName: "updateMaintenanceTask"
                , data: {
                    ticket: $.page.ticket
                    , mEntity: {
                        operationMaintenanceTaskCode: $.page.params.operationMaintenanceTaskCode
                        , operationMaintenanceFormData: fw.fwJson.FWJsonHelper.serializeObject(fw.fwControl.FWControlHelper.getData($.page.idJQ.divForm))
                        , status: 4
                    }
                }
                , beforeSend: function () {
                    $.mobile.loading('show');
                }
                , success: function (resultData) {
                    //判断查询信息成功
                    if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                        alert("保存成功！");
                        window.location.href = $.page.idJQ.aHome.attr("href");
                    } else {
                        //                    mini.alert("该数据不存在！", undefined, function () {
                        //                        CloseWindow("cancel");
                        //                    });
                    };
                }
                , complete: function () {
                    $.mobile.loading('hide');
                }
            }));
        } else if (fw.fwObject.FWObjectHelper.hasValue($.page.params.monitorSiteCode) && fw.fwObject.FWObjectHelper.hasValue($.page.params.taskTypeCode) && fw.fwObject.FWObjectHelper.hasValue($.page.params.operationMaintenanceFormFileName)) {
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall"
                , serviceName: "operationMaintenance"
                , methodName: "insertPatrolMaintenanceTask"
                , data: {
                    ticket: $.page.ticket
                    , mEntity: {
                        monitorSiteCode: $.page.params.monitorSiteCode
                        , taskTypeCode: $.page.params.taskTypeCode
                        , operationMaintenanceFormFileName: $.page.params.operationMaintenanceFormFileName
                        , operationMaintenanceFormData: fw.fwJson.FWJsonHelper.serializeObject(fw.fwControl.FWControlHelper.getData($.page.idJQ.divForm))
                        , status: 4
                    }
                }
                , beforeSend: function () {
                    $.mobile.loading('show');
                }
                , success: function (resultData) {
                    //判断查询信息成功
                    if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                        alert("保存成功！");
                        window.location.href = $.page.idJQ.aHome.attr("href");
                    } else {
                        //                    mini.alert("该数据不存在！", undefined, function () {
                        //                        CloseWindow("cancel");
                        //                    });
                    };
                }
                , complete: function () {
                    $.mobile.loading('hide');
                }
            }));
        };
    });

};

//查询信息
function query(operationMaintenanceTaskCode) {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue(operationMaintenanceTaskCode)) {
        var queryParams = { operationMaintenanceTaskCode: operationMaintenanceTaskCode };
        //查询信息
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "operationMaintenance"
            , methodName: "queryMaintenanceTask"
            , data: {
                ticket: $.page.ticket
                , queryParams: queryParams
            }
            , beforeSend: function () {
                $.mobile.loading('show');
            }
            , success: function (resultData) {
                //判断查询信息成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && fw.fwObject.FWObjectHelper.hasValue(resultData.data)) {
                    var entity = resultData.data[0];
                    if (fw.fwObject.FWObjectHelper.hasValue(entity.operationMaintenanceFormData)) {
                        fw.fwControl.FWControlHelper.setData($.page.idJQ.divForm, fw.fwJson.FWJsonHelper.deserializeObject(entity.operationMaintenanceFormData));
                    };
                    if ($.page.params.action == "operationMaintenance") {
                        $.page.idJQ.aSave.show();
                    };
                    //                    var data = {
                    //                        ticket: $.page.ticket
                    //                        , referrerURL: window.location.href
                    //                        , monitorSiteCode: entity.monitorSiteCode
                    //                    };
                    //                    var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("mobile/basicInfo/monitorSite.htm", $.page.webSiteRootUrl), data);
                    //                    $.page.idJQ.aMonitorSiteInfo.attr("href", url);
                } else {
                    //                    mini.alert("该数据不存在！", undefined, function () {
                    //                        CloseWindow("cancel");
                    //                    });
                };
            }
            , complete: function () {
                $.mobile.loading('hide');
            }
        }));
    };
};