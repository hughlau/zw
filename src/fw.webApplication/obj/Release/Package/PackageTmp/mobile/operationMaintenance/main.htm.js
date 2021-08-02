
//页面初始化
$.page.pageInit = function () {
    //window.location.replace("operationMaintenanceTemplate/operationMaintenanceTemplate.htm");
    //        $.page.dataSourceSettingsDictionary = {
    //            "mDeviceTypeCode": {
    //                dataSourceName: "sysManage.getDictionaryMFWDeviceType"
    //            , dataSourceParams: {}
    //            }
    //        };
};

//页面加载
$.page.pageLoad = function () {

    $.page.idJQ.divHeader.toolbar();
    $.page.idJQ.ulListView.listview();

    var entityList = [];
    entityList.push({
        menuCode: "taskStatus1"
        , menuName: "待接收任务"
        , iconUrl: "mobile/scripts/themes/images/demo.png"
        , url: "mobile/operationMaintenance/operationMaintenancePersonTaskList.htm?taskStatus=1"
    });
    entityList.push({
        menuCode: "taskStatus2"
        , menuName: "已接收任务"
        , iconUrl: "mobile/scripts/themes/images/demo.png"
        , url: "mobile/operationMaintenance/operationMaintenancePersonTaskList.htm?taskStatus=2"
    });
    entityList.push({
        menuCode: "taskStatus4"
        , menuName: "已完成任务"
        , iconUrl: "mobile/scripts/themes/images/demo.png"
        , url: "mobile/operationMaintenance/operationMaintenancePersonTaskList.htm?taskStatus=4"
    });
    entityList.push({
        menuCode: "taskStatus2"
        , menuName: "我的运维点"
        , iconUrl: "mobile/scripts/themes/images/demo.png"
        , url: "mobile/operationMaintenance/operationMaintenancePersonMonitorSiteList.htm"
    });
    entityList.push({
        menuCode: "monitorSiteStatus2"
        , menuName: "待运维点"
        , iconUrl: "mobile/scripts/themes/images/demo.png"
        , url: "mobile/operationMaintenance/operationMaintenancePersonMonitorSiteList.htm?taskStatus=2"
    });

    //    queryMaintenanceTaskStatistics

    //    for (var i = 0; i < entityList.length; i++) {
    //        var entity = entityList[i];
    //        var html = "";
    //        html += '<a href="' + entity.url + '" data-ajax="false">';
    //        html += '<li class="liSystem">';
    //        html += '    <div class="divSystemInfo">';
    //        html += '        <ul>';
    //        html += '            <li class="liSystemImage">';
    //        html += '                <img src="' + entity.iconUrl + '" style="width: 48px; height: 48px;" /></li>';
    //        //html += '            <li class="liSystemDo"><span>20</span> </li>';
    //        html += '            <li class="liSystemName"><span>' + entity.menuName + '</span></li>';
    //        html += '        </ul>';
    //        html += '    </div>';
    //        html += '</li>';
    //        html += '</a>';
    //        $(html).appendTo($.page.idJQ.ulSystemList);
    //    };

    var entity = null;
    for (var i = 0; i < entityList.length; i++) {
        entity = entityList[i];
        var data = {
            ticket: $.page.ticket
        };
        var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl(entity.url, $.page.webSiteRootUrl), data);
        $('<li><a href="' + url + '" data-ajax="false"><img class="ui-li-icon ui-corner-none" src="' + fw.fwUrl.FWUrlHelper.getAbsoluteUrl(entity.iconUrl, $.page.webSiteRootUrl) + '">' + entity.menuName + '<span id="spanCount_' + entity.menuCode + '" style="display:none;" class="ui-li-count"></span></a></li>').appendTo($.page.idJQ.ulListView);
    };
    $.page.idJQ.ulListView.listview("refresh");


    //查询信息
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "operationMaintenance"
        , methodName: "queryMaintenanceTaskStatistics"
        , data: {
            ticket: $.page.ticket
        }
        , beforeSend: function () {
            $.mobile.loading('show');
        }
        , success: function (resultData) {
            //判断查询信息成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && fw.fwObject.FWObjectHelper.hasValue(resultData.data)) {
                $("#spanCount_taskStatus1").html(resultData.data.waitReceive).show();
                $("#spanCount_taskStatus2").html(resultData.data.alreadyReceive).show();
                $("#spanCount_taskStatus4").html(resultData.data.finishReceive).show();
                $("#spanCount_monitorSiteStatus2").html(resultData.data.alreadyReceive).show();
            };
        }
        , complete: function () {
            $.mobile.loading('hide');
        }
    }));

    $.page.idJQ.aScan.bind("click", function () {
        fw.fwShell.FWShellHelper.ScannerHelper.scan({
            success: function (result) {
                //alert("获取缓存成功！");
                var data = null;
                var dataString = result.text;
                if (fw.fwObject.FWObjectHelper.hasValue(dataString)) {
                    if (dataString.indexOf("fw:") == 0) {
                        dataString = dataString.substr(3);
                        if (dataString.indexOf("call:") == 0) {
                            dataString = dataString.substr(5);
                            data = fw.fwJson.FWJsonHelper.deserializeObject(dataString);
                            if (fw.fwObject.FWObjectHelper.hasValue(data.methodName)) {
                                if (data.serviceName == "userLogin" && data.methodName == "bindQuickResponseCode") {
                                    var settings = {
                                        data: data
                                        , backCallback: function () { $.mobile.changePage("#divPage", "slideup"); }
                                        , loginCallback: function () {
                                            var controlData = $("#divScanningLoginPage").data("controlData");
                                            var data = fw.fwJson.FWJsonHelper.deserializeObject(controlData.settings.data.paramsJson);
                                            data.ticket = $.page.ticket;
                                            data.isCanLogin = 1;
                                            $.page.ajax($.page.getAjaxSettings({
                                                serviceType: "crossDomainCall"
                                                , serviceName: "userLogin"
                                                , methodName: "bindQuickResponseCode"
                                                , data: data
                                                , success: function (resultData) {
                                                    //判断查询信息成功
                                                    if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                                                        $.mobile.changePage("#divPage", "slideup");
                                                    } else {
                                                        var info = "";
                                                        for (var i = 0; i < resultData.infoList.length; i++) {
                                                            info += resultData.infoList[i] + "\n\r";
                                                        };
                                                        alert(info);
                                                    };
                                                }
                                            }));
                                        }
                                    };

                                    var divScanningLoginPageJQ = $("#divScanningLoginPage");
                                    var controlData = null;
                                    if (divScanningLoginPageJQ.length < 1) {
                                        controlData = {
                                            controlJQs: {
                                                divScanningLoginPageJQ: $()
                                                , divHeaderJQ: $()
                                                , aBackCallbackJQ: $()
                                                , aLoginCallback: $()
                                                , isInit: true
                                            }
                                        };

                                        var html = "";
                                        html += '<div id="divScanningLoginPage" data-role="page">';
                                        html += '    <div class="divHeader" data-role="header" data-position="fixed" data-theme="a" class="statusBar">';
                                        html += '        <h1>扫描登录</h1>';
                                        html += '        <a class="aBackCallback" data-icon="back" data-iconpos="notext"></a>';
                                        html += '    </div>';
                                        html += '    <div role="main" class="ui-content">';
                                        html += '        <div style="padding:64px 24px 24px 12px; text-align:center;"><img alt="computer" style="width:128px;height:128px;" src="' + $.page.webSiteRootUrl + 'mobile/userLogin/scripts/themes/images/computer.png' + '" /></div>';
                                        html += '        <div style="text-align:center;">Windows 登录确认</div>';
                                        html += '    </div>';
                                        html += '    <div class="ui-grid-b" style="margin-top:24px;">';
                                        html += '        <div class="ui-block-a"></div>';
                                        html += '        <div class="ui-block-b">';
                                        html += '            <a data-ajax="false" class="aLoginCallback ui-shadow ui-btn ui-corner-all"> 登 录 </a>';
                                        html += '        </div>';
                                        html += '        <div class="ui-block-c"></div>';
                                        html += '        <div class="ui-block-a"></div>';
                                        html += '        <div class="ui-block-b">';
                                        html += '            <a data-ajax="false" class="aBackCallback ui-shadow1 ui-btn ui-corner-all" style="border-width:0px;color:#BCBDBD"> 取消登录 </a>';
                                        html += '        </div>';
                                        html += '        <div class="ui-block-c"></div>';
                                        html += '    </div>';
                                        html += '</div>';
                                        $(html).appendTo($.page.bodyJQ);

                                        divScanningLoginPageJQ = $("#divScanningLoginPage").data("controlData", controlData);

                                        controlData.controlJQs.divScanningLoginPageJQ = divScanningLoginPageJQ;
                                        controlData.controlJQs.divHeaderJQ = $(".divHeader", controlData.controlJQs.aSelectCallbackJQ);
                                        controlData.controlJQs.aBackCallbackJQ = $(".aBackCallback", controlData.controlJQs.aSelectCallbackJQ);
                                        controlData.controlJQs.aLoginCallbackJQ = $(".aLoginCallback", controlData.controlJQs.aSelectCallbackJQ);

                                        controlData.controlJQs.aBackCallbackJQ.bind("click", function () {
                                            if ($.isFunction(settings.backCallback)) {
                                                settings.backCallback();
                                            };
                                        });

                                        controlData.controlJQs.aLoginCallbackJQ.bind("click", function () {
                                            if ($.isFunction(settings.loginCallback)) {
                                                settings.loginCallback();
                                            };
                                            //if ($.isFunction(settings.backCallback)) {
                                            //    settings.backCallback();
                                            //};
                                        });
                                    } else {
                                        controlData = divScanningLoginPageJQ.data("controlData");
                                    };
                                    controlData.settings = settings;

                                    if ($.isFunction(settings.backCallback)) {
                                        controlData.controlJQs.aBackCallbackJQ.show();
                                    } else {
                                        controlData.controlJQs.aBackCallbackJQ.hide();
                                    };

                                    if ($.isFunction(settings.loginCallback)) {
                                        controlData.controlJQs.aLoginCallbackJQ.show();
                                    } else {
                                        controlData.controlJQs.aLoginCallbackJQ.hide();
                                    };

                                    $.mobile.changePage("#divScanningLoginPage", "slideup");

                                    controlData.controlJQs.divHeaderJQ.addClass("statusBar").toolbar().css("position", "fixed");
                                };
                            };
                        };
                    } else {
                        data = fw.fwJson.FWJsonHelper.deserializeObject(dataString);
                        if ($.isPlainObject(data)) {
                            if (data.p) {
                                switch (data.p) {
                                    case "msInfo":
                                        var params = {
                                            ticket: $.page.ticket
                                            , referrerURL: window.location.href
                                            , monitorSiteCode: data.d.monitorSiteCode
                                        };
                                        var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("mobile/basicInfo/monitorSite.htm", $.page.webSiteRootUrl), params);
                                        window.location.replace(url);
                                        break;
                                };
                            };
                        } else {
                            alert(dataString);
                        };
                    };
                };
            }
            , error: function () {
                //alert("获取缓存失败！");
            }
        });
    });

    //切换账号
    $.page.idJQ.aSwitchAccount.bind("click", function () {
        window.location.replace(fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("mobile/userLogin/login.htm", $.page.webSiteRootUrl), { loginTypeCode: 1 }));
    });

    //注销账号
    //    $.page.idJQ.aLogout.bind("click", function () {
    //        fw.fwShell.FWShellHelper.CacheHelper.get({
    //            success: function (v) {
    //                //alert("获取缓存成功！");
    //                userLoginInfoList = fw.fwJson.FWJsonHelper.deserializeObject(v);
    //                var userLoginInfoNewList = [];
    //                if (fw.fwObject.FWObjectHelper.hasValue(userLoginInfoList)) {
    //                    for (i = 0; i < userLoginInfoList.length; i++) {
    //                        if (userLoginInfoList[i].userName != userName) {
    //                            userLoginInfoNewList.push(userLoginInfoList[i]);
    //                        };
    //                    };
    //                } else {
    //                    userLoginInfoList = [];
    //                };
    //            }
    //            , error: function () {
    //                //alert("获取缓存失败！");
    //            }
    //            , data: {
    //                cachePoolName: "userLogin"
    //                , key: "userLoginInfoList"
    //            }
    //        });
    //    });

    //    fw.fwShell.FWShellHelper.GeoLocationHelper.getCurrentPosition({
    fw.fwShell.FWShellHelper.BaiDuLocationHelper.getCurrentPosition({
        success: function (result) {
            //            alert("获取经纬度成功！");
            //            alert("We got a location\n" + fw.fwJson.FWJsonHelper.serializeObject(result) +
            //                	        "latitude: " + result.coords.latitude + "\n" +
            //                	        "longitude: " + result.coords.longitude + "\n");
            //更新用户位置
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall"
                , serviceName: "operationMaintenance"
                , methodName: "updateMBLLOperationMaintenancePersonLocation"
                , data: {
                    ticket: $.page.ticket
                    , longitude: result.coords.longitude
                    , latitude: result.coords.latitude
                }
                , success: function (resultData) {
                    //判断查询信息成功
                    if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                        var dd = "";
                    };
                }
            }));
        }
        , error: function () {
            //alert("获取经纬度失败！");
        }
        , opinion: {
            timeout: 60 * 1000
        }
    });
    
    //获取设备信息
    fw.fwShell.FWShellHelper.DeviceHelper.getDeviceInfo({
        success: function (data) {
            //alert(fw.fwJson.FWJsonHelper.serializeObject(data));
            //注册设备
            fw.fwShell.FWShellHelper.PushNotificationHelper.setAlias({
                success: function () {
                    //更新用户别名
                    $.page.ajax($.page.getAjaxSettings({
                        serviceType: "crossDomainCall"
                        , serviceName: "sysBasicManage"
                        , methodName: "insertOrUpdateMFWUserInfoByMUserID"
                        , data: {
                            ticket: $.page.ticket
                            , mEntity: {
                                mUserID: $.page.userInfo.userID
                                , mUserName: $.page.userInfo.userName
                                , mDeviceOperatingSystemCode: data.deviceOperatingSystemCode
                                , mDeviceAlias: $.page.userInfo.deviceAlias
                            }
                        }
                        , success: function (resultData) {
                            //判断查询信息成功
                            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                                var dd = "";
                            };
                        }
                    }));
                },
                error: function () {
                    //alert("设置设备别名失败！");
                },
                alias: $.page.userInfo.deviceAlias
            });
        },
        error: function () {
            //alert("获取设备信息失败！");
        }
    });



};
