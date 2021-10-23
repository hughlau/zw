//现场设备编码
var monitorSiteCode = ''
var operationMaintenanceTaskCode = '';


$.page.pageInit = function () {
    
};

/* 页面加载 */
$.page.pageLoad = function () {
    if ($.page.params.action === 'edit') {
        if (fw.fwObject.FWObjectHelper.hasValue($.page.params.operationMaintenanceTaskCode)) {
            operationMaintenanceTaskCode = $.page.params.operationMaintenanceTaskCode;
            var queryParams = { operationMaintenanceTaskCode: $.page.params.operationMaintenanceTaskCode };
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall"
                , serviceName: "operationMaintenance"
                , methodName: "queryDailyMaintenanceTask"
                , data: {
                    ticket: $.page.ticket
                    , queryParams: queryParams
                }
                , beforeSend: function () {
                }
                , success: function (resultData) {
                    if (resultData.status == fw.fwData.FWResultStatus.Success && fw.fwObject.FWObjectHelper.hasValue(resultData.data)) {
                        var entity = resultData.data[0];
                        monitorSiteCode = entity.monitorSiteCode;
                        divFormJQ.setData(entity);
                        if (entity.monitorSiteName != null && "" != entity.monitorSiteName) {
                            $("#monitorSiteName").html(entity.monitorSiteName);
                        }
                    }
                }
            }));
        }
    } else {
        for (var i = 0; i < normalIds.length; i++) {
            mini.get(normalIds[i]).setValue("true");
        }
    }
    divFormJQ = $.page.idM.divForm;
    //点击保存按钮        
    $.page.idJQ.aSave.on("click", function () {
        if (monitorSiteCode) {
            if ($.page.params.action === 'edit') {
                operationMaintenanceTaskCode = operationMaintenanceTaskCode ? operationMaintenanceTaskCode : '';
            }
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall",
                serviceName: "operationMaintenance",
                methodName: "insertOrUpdateWaterQuality",
                data: {
                    ticket: $.page.ticket,
                    mEntity: {
                        operationMaintenanceTaskCode: operationMaintenanceTaskCode,
                        water_COD: mini.get("water_COD").getValue(),
                        water_BOD: mini.get("water_BOD").getValue(),
                        water_TP: mini.get("water_TP").getValue(),
                        water_TN: mini.get("water_TN").getValue(),
                        water_SS: mini.get("water_SS").getValue(),
                        water_NH34: mini.get("water_NH34").getValue()
                    }
                },
                beforeSend: function () {
                },
                success: function (resultData) {
                    //判断查询信息成功
                    if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                        mini.alert("保存成功！");
                        CloseWindow("ok");
                    }
                },
                complete: function () {
                }
            }));
        } else {
            mini.alert('请选择现场设备编号')
        }
    })
}



function CloseWindow(action) {
    if (action == "close" && $.page.idM.editform.isChanged()) {
        if (confirm("数据被修改了，是否先保存？")) {
            return false;
        };
    };
    if (window.CloseOwnerWindow) {
        return window.CloseOwnerWindow(action);
    } else {
        window.close();
    };
}; 