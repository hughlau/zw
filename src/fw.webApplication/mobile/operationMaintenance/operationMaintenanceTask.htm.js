
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
    };

    var data = {
        ticket: $.page.ticket
        , taskStatus: $.page.params.taskStatus
    };
    var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("mobile/operationMaintenance/operationMaintenancePersonTaskList.htm", $.page.webSiteRootUrl), data);
    $.page.idJQ.aBack.attr("href", url);

    $.page.idJQ.aReturn.bind("click", function () {
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
                        , status: 3
                    }
                }
                , beforeSend: function () {
                    $.mobile.loading('show');
                }
                , success: function (resultData) {
                    //判断查询信息成功
                    if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                        window.location.href = $.page.idJQ.aBack.attr("href");
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

    $.page.idJQ.aReceive.bind("click", function () {
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
                        , status: 2
                    }
                }
                , beforeSend: function () {
                    $.mobile.loading('show');
                }
                , success: function (resultData) {
                    //判断查询信息成功
                    if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                        window.location.href = $.page.idJQ.aBack.attr("href");
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
                    fw.fwControl.FWControlHelper.setData($.page.idJQ.divForm, entity);
                    var data = {
                        ticket: $.page.ticket
                        , referrerURL: window.location.href
                        , monitorSiteCode: entity.monitorSiteCode
                    };
                    var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("mobile/basicInfo/monitorSite.htm", $.page.webSiteRootUrl), data);
                    $.page.idJQ.aMonitorSiteInfo.attr("href", url);

                    switch ($.page.params.taskStatus) {
                        case "1":
                            $.page.idJQ.aReceive.show();
                            break;
                        case "2":
                            $.page.idJQ.aReturn.show();
                            var data = {
                                ticket: $.page.ticket
                                , referrerURL: window.location.href
                                , action: "operationMaintenance"
                                , operationMaintenanceTaskCode: entity.operationMaintenanceTaskCode
                            };
                            var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("mobile/operationMaintenance/operationMaintenanceTemplate/" + entity.operationMaintenanceFormFileName, $.page.webSiteRootUrl), data);
                            $.page.idJQ.aOperationMaintenance.attr("href", url).show();
                            break;
                        case "4":
                            var data = {
                                ticket: $.page.ticket
                                , referrerURL: window.location.href
                                , operationMaintenanceTaskCode: entity.operationMaintenanceTaskCode
                            };
                            var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("mobile/operationMaintenance/operationMaintenanceTemplate/" + entity.operationMaintenanceFormFileName, $.page.webSiteRootUrl), data);
                            $.page.idJQ.aOperationMaintenanceFormView.attr("href", url).show();
                            break;
                        default:
                            break;
                    };


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