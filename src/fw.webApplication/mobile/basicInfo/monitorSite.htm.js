
//页面初始化
$.page.pageInit = function () {

};

/* 页面加载 */
$.page.pageLoad = function () {
    $.page.idJQ.divHeader.toolbar();

    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.monitorSiteCode)) {
        //查询信息
        query($.page.params.monitorSiteCode);
    };

    //更换设备
    $.page.idJQ.aReplacementEquipment.bind("click", function () {
        fw.fwShell.FWShellHelper.ScannerHelper.scan({
            success: function (result) {
                //alert("获取缓存成功！");
                var data = null;
                var dataString = result.text;
                if (fw.fwObject.FWObjectHelper.hasValue(dataString)) {
                    alert("更换设备！");
                };
            }
            , error: function () {
                //alert("获取缓存失败！");
            }
        });
    });

    //位置校准
    $.page.idJQ.aUpdateLocation.bind("click", function () {
        $.mobile.loading('show', {
            text: '正在获取位置信息...', //加载器中显示的文字  
            textVisible: true, //是否显示文字  
            theme: 'b'        //加载器主题样式a-e  
        });
        fw.fwShell.FWShellHelper.GeoLocationHelper.getCurrentPosition({
            success: function (result) {
                //            alert("获取经纬度成功！");
                //            alert("We got a location\n" + fw.fwJson.FWJsonHelper.serializeObject(result) +
                //                	        "latitude: " + result.coords.latitude + "\n" +
                //                	        "longitude: " + result.coords.longitude + "\n");
                $.page.ajax($.page.getAjaxSettings({
                    serviceType: "crossDomainCall"
                    , serviceName: "basicInfo"
                    , methodName: "updateBLLMonitorSite"
                    , data: {
                        ticket: $.page.ticket
                       , mEntity: {
                           monitorSiteCode: $.page.params.monitorSiteCode
                           , longitude: result.coords.longitude
                           , latitude: result.coords.latitude
                       }
                    }
                    , beforeSend: function () {
                        $.mobile.loading('show', {
                            text: '正在更新位置信息...', //加载器中显示的文字  
                            textVisible: true, //是否显示文字  
                            theme: 'b'        //加载器主题样式a-e  
                        });
                    }
                    , success: function (resultData) {
                        //判断查询信息成功
                        if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                            alert("位置更新成功！");
                        };
                    }
                    , complete: function () {
                        $.mobile.loading('hide');
                    }
                }));
            }
            , error: function () {
                //alert("获取经纬度失败！");
                $.mobile.loading('hide');
            }
            , opinion: {
                timeout: 60 * 1000
            }
        });
    });
};

//查询信息
function query(monitorSiteCode) {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue(monitorSiteCode)) {
        var queryParams = { monitorSiteCode: monitorSiteCode };
        //查询信息
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "basicInfo"
            , methodName: "queryMonitorSite"
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
                    var data = resultData.data[0];
                    fw.fwControl.FWControlHelper.setData($.page.idJQ.divForm, data);

                    if (fw.fwObject.FWObjectHelper.hasValue(data.monitorSiteAlarmList)) {
                        var entityList = data.monitorSiteAlarmList;
                        var entity = null;
                        for (var i = 0; i < entityList.length; i++) {
                            entity = entityList[i];
                            $('<li>' + entity.alarmTypeName + '</li>').appendTo($.page.idJQ.ulAlarmTypeListView);
                        };
                        $.page.idJQ.ulAlarmTypeListView.listview("refresh").show();
                    };

                    if (fw.fwObject.FWObjectHelper.hasValue(data.monitorFactorList)) {
                        var conditionData = {
                            monitorSiteCode: monitorSiteCode
                        };
                        $.page.ajax($.page.getAjaxSettings({
                            serviceType: "crossDomainCall"
                            , serviceName: "autoMonitor"
                            , methodName: "queryAutoMonitorStatics"
                            , data: {
                                ticket: $.page.ticket
                                , pageParams: {
                                    pageSize: 1
                                    , pageIndex: 1
                                    , sortFieldList: null
                                }
                                , queryParams: conditionData
                            }
                            , beforeSend: function () {
                                $.mobile.loading('show');
                            }
                            , success: function (resultData) {
                                //判断加载数据成功
                                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                                    resultData.data.entityList = fw.fwObject.FWObjectHelper.hasValue(resultData.data[0].monitorSiteLatestDataList != null && resultData.data[0].monitorSiteLatestDataList.columns) ? fw.fwDataTable.FWDataTableHelper.toEntityList(resultData.data[0].monitorSiteLatestDataList) : resultData.data[0].monitorSiteLatestDataList;
                                    if (fw.fwObject.FWObjectHelper.hasValue(resultData.data.entityList)) {
                                        var entityList = resultData.data.entityList;
                                        var entity = entityList[0];
                                        var monitorFactorList = data.monitorFactorList;
                                        var monitorFactor = null;
                                        for (var i = 0; i < monitorFactorList.length; i++) {
                                            monitorFactor = monitorFactorList[i];
                                            //                            $('<div class="ui-block-a"><div class="ui-bar ui-bar-c" style="height: 22px">' + monitorFactor.monitorFactorName + '</div></div>').appendTo($.page.idJQ.divMonitorFactorGrid);
                                            //                            $('<div class="ui-block-b"><div class="ui-bar ui-bar-c" style="height: 22px">' + monitorFactor.standardLowerLimit + '</div></div>').appendTo($.page.idJQ.divMonitorFactorGrid);
                                            //                            $('<div class="ui-block-c"><div class="ui-bar ui-bar-c" style="height: 22px">' + monitorFactor.standardUpperLimit + '</div></div>').appendTo($.page.idJQ.divMonitorFactorGrid);
                                            var html = '';
                                            html += '<li>';
                                            //html += '    <a>'
                                            html += '        <h3>' + monitorFactor.monitorFactorName + '</h3>';
                                            if (fw.fwObject.FWObjectHelper.hasValue(entity["DateTime_" + monitorFactor.monitorFactorCode])) {
                                                html += '        <p>';
                                                html += '最新数据：' + fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(entity["DateTime_" + monitorFactor.monitorFactorCode]), "MM-dd HH:mm:ss") + '&nbsp;&nbsp;&nbsp;&nbsp;';
                                                if (fw.fwObject.FWObjectHelper.hasValue(entity["Value_" + monitorFactor.monitorFactorCode])) {
                                                    html += entity["Value_" + monitorFactor.monitorFactorCode] + '&nbsp;&nbsp;&nbsp;&nbsp;';
                                                };
                                                if (fw.fwObject.FWObjectHelper.hasValue(entity["Unit_" + monitorFactor.monitorFactorCode])) {
                                                    html += entity["Unit_" + monitorFactor.monitorFactorCode] + '&nbsp;&nbsp;&nbsp;&nbsp;';
                                                };
                                                if (fw.fwObject.FWObjectHelper.hasValue(entity["statusName_" + monitorFactor.monitorFactorCode])) {
                                                    html += entity["statusName_" + monitorFactor.monitorFactorCode] + '&nbsp;&nbsp;&nbsp;&nbsp;';
                                                };
                                                html += '        </p>';
                                            } else {
                                                html += '        <p>';
                                                html += '最新数据：无&nbsp;&nbsp;&nbsp;&nbsp;';
                                                html += '        </p>';
                                            };
                                            if (fw.fwObject.FWObjectHelper.hasValue(monitorFactor.standardLowerLimit) || fw.fwObject.FWObjectHelper.hasValue(monitorFactor.standardUpperLimit)) {
                                                html += '        <p>';
                                                if (fw.fwObject.FWObjectHelper.hasValue(monitorFactor.standardLowerLimit)) {
                                                    html += '下限：' + monitorFactor.standardLowerLimit + '&nbsp;&nbsp;&nbsp;&nbsp;';
                                                };
                                                if (fw.fwObject.FWObjectHelper.hasValue(monitorFactor.standardUpperLimit)) {
                                                    html += '上限：' + monitorFactor.standardUpperLimit + '&nbsp;&nbsp;&nbsp;&nbsp;';
                                                };
                                                html += '        </p>';
                                            };
                                            if (fw.fwObject.FWObjectHelper.hasValue(monitorFactor.alarmLowerLimit) || fw.fwObject.FWObjectHelper.hasValue(monitorFactor.alarmUpLimit)) {
                                                html += '        <p>';
                                                if (fw.fwObject.FWObjectHelper.hasValue(monitorFactor.alarmLowerLimit)) {
                                                    html += '阀值下限：' + monitorFactor.alarmLowerLimit + '&nbsp;&nbsp;&nbsp;&nbsp;';
                                                };
                                                if (fw.fwObject.FWObjectHelper.hasValue(monitorFactor.alarmUpLimit)) {
                                                    上限 += '阀值上限：' + monitorFactor.alarmUpLimit + '&nbsp;&nbsp;&nbsp;&nbsp;';
                                                };
                                                html += '        </p>';
                                            };
                                            //html += '    </a>';
                                            html += '</li>';
                                            $(html).appendTo($.page.idJQ.ulMonitorFactorListView);
                                        };
                                        $.page.idJQ.ulMonitorFactorListView.listview("refresh").show();
                                    };

                                };
                            }
                            , complete: function () {
                                $.mobile.loading('hide');
                            }
                        }));

                        $.page.idJQ.ulMonitorFactorListView.listview("refresh").show();
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

function operationMaintenance(entity) {
    var data = {
        ticket: $.page.ticket
        , referrerURL: window.location.href
        , action: "operationMaintenance"
        , monitorSiteCode: $.page.params.monitorSiteCode
        , taskTypeCode: entity.taskTypeCode
        , operationMaintenanceFormFileName: entity.operationMaintenanceFormFileName
    };
    var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("mobile/operationMaintenance/operationMaintenanceTemplate/" + entity.operationMaintenanceFormFileName, $.page.webSiteRootUrl), data);
    window.location.replace(url);
};