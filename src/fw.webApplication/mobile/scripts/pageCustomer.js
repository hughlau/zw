$.pageCustomer = {
    publicTicket: null
    , serviceSiteRootUrl: null
    , receiveNotificationCallback: function (data) {

    }
    , pagePreInit: function () {
        if ($.page.idJQ.aBack != undefined && fw.fwObject.FWObjectHelper.hasValue($.page.params.referrerURL)) {
            $.page.idJQ.aBack.attr("href", $.page.params.referrerURL);
        };
        if ($.page.idJQ.aHome != undefined) {
            var data = {
                ticket: $.page.ticket
            };
            var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("mobile/operationMaintenance/main.htm", $.page.webSiteRootUrl), data);
            $.page.idJQ.aHome.attr("href", url);
        };

        //注册推送事件
        window.receiveNotificationCallback = function (data) {
            //alert("page.js监听到协议：" + fw.fwJson.FWJsonHelper.serializeObject(data));
            //data = { fwMessage: { u: "用户名", p: "协议", d: {}} };
            //d表示数据
            if ($.isPlainObject(data)) {
                if (fw.fwObject.FWObjectHelper.hasValue(data.fwMessage)) {
                    data.fwMessage = fw.fwJson.FWJsonHelper.deserializeObject(data.fwMessage);
                    if ($.isPlainObject(data.fwMessage)) {
                        if (!fw.fwObject.FWObjectHelper.hasValue(data.fwMessage.u)) {
                            data.fwMessage.u = "";
                        };
                        if ($.isFunction($.page.receiveNotificationCallback)) {
                            $.page.receiveNotificationCallback(data)
                        };
                        switch (data.fwMessage.p) {
                            case "alert":
                                //data = { fwMessage: { "t": "", "c": "", "u": "用户名", "p": "alert", "d": "http://www.shencai.cc"} };
                                //alert("(page.js监听到data为alert协议)" + data.fwMessage.d);
                                alert(data.fwMessage.d);
                                break;
                            case "newVersion":
                                //data = { fwMessage: { "t": "", "c": "", "u": "用户名", "p": "newVersion", "d": { "versionNumber": "1.3.1", "iosUrl": "http://www.shencai.cc", "androidUrl": "http://www.shencai.cc"}} };
                                //alert("(page.js监听到data为newVersion协议)" + data.fwMessage.d.versionNumber);
                                //获取设备信息
                                var newVersionConfirm = confirm("有新版本更新，版本号：" + data.fwMessage.d.versionNumber);
                                if (newVersionConfirm == true) {
                                    //是
                                    //获取设备信息
                                    fw.fwShell.FWShellHelper.DeviceHelper.getDeviceInfo({
                                        success: function (deviceInfo) {
                                            alert(data.fwMessage.d[deviceInfo.deviceOperatingSystemCode + "Url"])
                                            fw.fwShell.FWShellHelper.WebViewHelper.openWithSystemBrowser({
                                                success: function (result) {
                                                    //alert("success");
                                                },
                                                error: function (res) {
                                                    //alert("error" + res);
                                                },
                                                complete: function (c) {
                                                    //alert("complete");
                                                },
                                                url: data.fwMessage.d[deviceInfo.deviceOperatingSystemCode + "Url"]
                                            });
                                        },
                                        error: function () {
                                            //alert("获取设备信息失败！");
                                        }
                                    });
                                } else {
                                    //否
                                };
                                break;
                            default:
                                alert("(page.js监听到data为" + data.fwMessage.p + "协议)" + data.fwMessage.d);
                                break;
                        };
                    } else {
                        alert("page.js监听到data属性fwMessage非json对象" + data);
                    };
                } else {
                    alert("page.js监听到data属性fwMessage为空" + data);
                };
            } else {
                alert("page.js监听到data非json对象" + data);
            };
        };
    }
    , pageLoadComplete: function () {
        setTimeout(function () {
            fw.fwShell.FWShellHelper.PushNotificationHelper.setAutoNotificationOpen({
                success: function (result) { },
                error: function () { },
                complete: function () {
                    //setTimeout(function () {
                    //window.receiveNotificationCallback(fw.fwJson.FWJsonHelper.serializeObject({ u: "18505127807@omPerson", p: "personTask-1", d: {} }));
                    //window.receiveNotificationCallback(fw.fwJson.FWJsonHelper.serializeObject({ u: "18505127807@omPerson", p: "alert", d: "测试" }));}
                    //}, 1000);
                }
            });
        }, 2000);
    }
    , cantonSelect: function (properties) {
        if (!fw.fwObject.FWObjectHelper.hasValue(properties)) { properties = {}; };
        var settings = {
            selectCantonList: null
            , clearCallback: undefined
            , backCallback: undefined
            , selectCallback: undefined
        };
        $.extend(settings, properties);

        var divCantonSelectPageJQ = $("#divCantonSelectPage");
        var controlData = null;
        if (divCantonSelectPageJQ.length < 1) {
            controlData = {
                controlJQs: {
                    divCantonSelectPageJQ: $()
                    , olParentCantonJQ: $()
                    , olChildCantonJQ: $()
                    , isInit: true
                }
            };

            var html = "";
            html += '<div id="divCantonSelectPage" data-role="page">';
            html += '    <div class="divHeader" data-role="header" data-position="fixed" data-theme="a" class="statusBar">';
            html += '        <h1>厂区选择</h1>';
            //html += '        <a class="aBackCallback" data-icon="back" data-iconpos="notext"></a>';
            html += '        <a class="aClearCallback ui-btn ui-shadow ui-corner-all ui-icon-delete ui-btn-icon-notext ui-btn-inline">清空</a>';
            html += '        <a class="aSelectCallback ui-btn ui-shadow ui-corner-all ui-icon-check ui-btn-icon-notext ui-btn-inline">确定</a>';
            html += '        <ol class="olParentCanton" data-role="listview">';
            html += '        </ol>';
            html += '    </div>';
            html += '    <div role="main" class="ui-content">';
            html += '        <ol class="olChildCanton" data-role="listview" data-inset="true">';
            html += '        </ol>';
            html += '    </div>';
            html += '</div>';

            $(html).appendTo($.page.bodyJQ);

            divCantonSelectPageJQ = $("#divCantonSelectPage").data("controlData", controlData);

            controlData.controlJQs.divCantonSelectPageJQ = divCantonSelectPageJQ;
            controlData.controlJQs.divHeaderJQ = $(".divHeader", controlData.controlJQs.aSelectCallbackJQ);
            controlData.controlJQs.aBackCallbackJQ = $(".aBackCallback", controlData.controlJQs.aSelectCallbackJQ);
            controlData.controlJQs.aClearCallbackJQ = $(".aClearCallback", controlData.controlJQs.aSelectCallbackJQ);
            controlData.controlJQs.aSelectCallbackJQ = $(".aSelectCallback", controlData.controlJQs.aSelectCallbackJQ);
            controlData.controlJQs.olParentCantonJQ = $(".olParentCanton", controlData.controlJQs.divCantonSelectPageJQ);
            controlData.controlJQs.olChildCantonJQ = $(".olChildCanton", controlData.controlJQs.divCantonSelectPageJQ);

            controlData.controlJQs.aBackCallbackJQ.bind("click", function () {
                if ($.isFunction(settings.backCallback)) {
                    settings.backCallback();
                };
            });

            controlData.controlJQs.aClearCallbackJQ.bind("click", function () {
                if ($.isFunction(settings.clearCallback)) {
                    settings.clearCallback();
                };
                if ($.isFunction(settings.backCallback)) {
                    settings.backCallback();
                };
            });

            controlData.controlJQs.aSelectCallbackJQ.bind("click", function () {
                if ($.isFunction(settings.selectCallback)) {
                    var entityList = [];
                    $(">li", controlData.controlJQs.olParentCantonJQ).each(function () {
                        entityList.push($(this).data("entity"));
                    });
                    settings.selectCallback(entityList);
                };
                if ($.isFunction(settings.backCallback)) {
                    settings.backCallback();
                };
            });
        } else {
            controlData = divCantonSelectPageJQ.data("controlData");
        };

        if ($.isFunction(settings.clearCallback)) {
            controlData.controlJQs.aClearCallbackJQ.show();
        } else {
            controlData.controlJQs.aClearCallbackJQ.hide();
        };

        if ($.isFunction(settings.selectCallback)) {
            controlData.controlJQs.aSelectCallbackJQ.show();
        } else {
            controlData.controlJQs.aSelectCallbackJQ.hide();
        };

        var loadChildCantonFunction = function (pCode) {
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall"
                , serviceName: "sysManage"
                , methodName: "getTreeChildNodes"
                , data: {
                    ticket: $.page.ticket
                    , dictionaryTypeCode: "BLLCanton"
                    , pCode: pCode
                }
                , beforeSend: function () {
                    $.mobile.loading('show');
                }
                , success: function (resultData) {
                    //判断加载数据成功
                    if (resultData.status == fw.fwData.FWResultStatus.Success && fw.fwObject.FWObjectHelper.hasValue(resultData.data)) {
                        controlData.controlJQs.olParentCantonJQ.hide();
                        controlData.controlJQs.olChildCantonJQ.empty();
                        var entityList = fw.fwObject.FWObjectHelper.hasValue(resultData.data.columns) ? fw.fwDataTable.FWDataTableHelper.toEntityList(resultData.data) : resultData.data;
                        for (var i = 0; i < entityList.length; i++) {
                            entity = entityList[i];
                            $('<li><a>' + entity.name + '</a></li>').appendTo(controlData.controlJQs.olChildCantonJQ).data("entity", entity).bind("click", function () {
                                entity = $(this).data("entity");
                                $('<li><a>' + entity.name + '</a></li>').appendTo(controlData.controlJQs.olParentCantonJQ).data("entity", entity).bind("click", function () {
                                    entity = $(this).data("entity");
                                    $(this).nextAll().remove();
                                    loadChildCantonFunction(entity.code);
                                });
                                loadChildCantonFunction(entity.code);
                            });
                        };
                        controlData.controlJQs.olParentCantonJQ.show().listview("refresh");
                        controlData.controlJQs.olChildCantonJQ.listview("refresh");
                        if (entityList.length < 2) {
                            $(">li:first", controlData.controlJQs.olChildCantonJQ).click();
                        };
                    };
                }
                , complete: function () {
                    $.mobile.loading('hide');
                }
            }));
        };

        controlData.controlJQs.olParentCantonJQ.empty();
        if (fw.fwObject.FWObjectHelper.hasValue(settings.selectCantonList)) {
            var entityList = settings.selectCantonList;
            var entity = null;
            for (var i = 0; i < entityList.length; i++) {
                entity = entityList[i];
                $('<li><a>' + entity.name + '</a></li>').appendTo(controlData.controlJQs.olParentCantonJQ).data("entity", entity).bind("click", function () {
                    entity = $(this).data("entity");
                    $(this).nextAll().remove();
                    loadChildCantonFunction(entity.code);
                });
            };
            $(">li:last", controlData.controlJQs.olParentCantonJQ).click();
        } else {
            loadChildCantonFunction("BLLCanton");
        };

        $.mobile.changePage("#divCantonSelectPage", "slideup");

        controlData.controlJQs.divHeaderJQ.addClass("statusBar").toolbar().css("position", "fixed");
        controlData.controlJQs.olParentCantonJQ.listview("refresh");
    }
};

//$.pageCustomer.publicTicket = "b5b9c034-baec-4e63-8b99-e9fba54e4006";
//$.pageCustomer.publicTicket = "fbb44844-d6ee-454c-a9d7-51808424e64f";
//$.pageCustomer.publicTicket = "fcb44844-d6ee-454c-a9d7-51808424e64f";
//$.pageCustomer.serviceSiteRootUrl = "http://localhost:30011/";
//$.pageCustomer.serviceSiteRootUrl = "http://192.168.252.31:8000/fwSSO/";
$.extend($.page, $.pageCustomer);


fw.m.sysBasicManage = {
    data: {
        FWDictionaryTypeCode: {
            FWEthnic: "FWEthnic",
            FWGender: "FWGender",
            FWDateType: "FWDateType",
            FWOrganization: "FWOrganization",
            FWCanton: "FWCanton"
        }
        , FWEthnicCode: {
            Han: "01",
            Zhuang: "02",
            Manchu: "03",
            Hui: "04"
        }
        , FWGenderCode: {
            //男
            Male: "01",
            //女
            Female: "02"
        }
        , FWDateTypeCode: {
            //阳历
            Solar: "01",
            //阴历
            Lunar: "02"
        }
        //组织机构
        , FWOrganizationCode: {

        }
        //厂区
        , FWCantonCode: {

        }
        //用户类型
        , FWUserTypeCode: {
            //管理员用户
            Admin: "10",
            //普通用户
            Plain: "11",
            //域用户
            Domain: "mlsctec.com"
        }
    }
};