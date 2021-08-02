
var thirdLogins = null;
var userLoginInfoList = [];
var loginTypeCode = 2;
//loginTypeCode 1用户登录（用户自己点击登录按钮），2自动登录（系统根据上次登录的用户名密码自动登录），3推送登录

//页面初始化
$.page.pageInit = function () {
    $.page.appSettings = {
        "thirdLogins": thirdLogins
    };
};

/* 页面加载 */
$.page.pageLoad = function () {
    loginTypeCode = fw.fwObject.FWObjectHelper.toNumber($.page.params.loginTypeCode);
    if (!fw.fwObject.FWObjectHelper.hasValue(loginTypeCode)) {
        loginTypeCode = 2;
    };

    thirdLogins = $.page.appSettings.thirdLogins;
    if (fw.fwObject.FWObjectHelper.hasValue(thirdLogins)) {
        var thirdLoginArray = [];
        var sAA = thirdLogins.split(";");
        for (var i = 0; i < sAA.length; i++) {
            if (fw.fwObject.FWObjectHelper.hasValue(sAA[i])) {
                var sA = sAA[i].split(",");
                if (sA.length > 0) {
                    if (fw.fwObject.FWObjectHelper.hasValue(sA[0])) {
                        thirdLoginArray.push({
                            value: sA[0]
                                    , text: !!sA[1] ? sA[1] : sA[0]
                        });
                    };
                };
            };
        };

        if (thirdLoginArray.length > 0) {
            var html = '';
            var thirdLogin;
            var templateHtmlFunction = function (thirdLogin, inputType, inputIndex) {
                var templateHtml = '';
                templateHtml += '<input type="checkbox" name="checkboxThirdLogin" id="checkboxThirdLogin_' + thirdLogin.value + '" value="' + thirdLogin.value + '"/>';
                templateHtml += '<label for="checkboxThirdLogin_' + thirdLogin.value + '">' + thirdLogin.text + '</label>';
                return templateHtml;
            };
            if (thirdLoginArray.length > 1) {
                for (var i = 0; i < thirdLoginArray.length; i++) {
                    thirdLogin = thirdLoginArray[i];
                    html += templateHtmlFunction(thirdLogin, "checkbox", i);
                };
            } else {
                thirdLogin = thirdLoginArray[0];
                html += templateHtmlFunction(thirdLogin, "checkbox", 0);
            };
            $.page.idJQ.divThirdLogin.html(html).show();
            var checkboxJQ = $("input[type='checkbox']", $.page.idJQ.divThirdLogin).checkboxradio().checkboxradio('refresh');
            checkboxJQ.bind("click", function () {
                checkboxJQ.not(this).removeAttr('checked').checkboxradio('refresh');
            }).last().prev().addClass("ui-last-child");
        };
    };

    var loginFormJQ = $.page.idJQ.divUserLoginForm;
    var inputJQ = $("input", loginFormJQ);
    var valueChangeFunction = function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (event.type == "keydown" && keycode == '13') {
            $.page.idJQ.aLogin.click();
        };
    };
    inputJQ.bind("keydown", valueChangeFunction).bind("keyup", valueChangeFunction).bind("keypress", valueChangeFunction).bind("change", valueChangeFunction).bind("focus", valueChangeFunction).bind("blur", valueChangeFunction).blur();

    $.page.idJQ.aLogin.bind("click", loginFunction);

    fw.fwShell.FWShellHelper.CacheHelper.get({
        success: function (v) {
            //alert("获取缓存成功！");
            userLoginInfoList = fw.fwJson.FWJsonHelper.deserializeObject(v);
            if (fw.fwObject.FWObjectHelper.hasValue(userLoginInfoList)) {
                //alert(userLoginInfoList.length);
                $.page.idJQ.textUserName.val(userLoginInfoList[0].userName);
                $.page.idJQ.textPassword.val(userLoginInfoList[0].password);
                $("input[type='checkbox'][id='checkboxThirdLogin_" + userLoginInfoList[0].thirdCode + "']", $.page.idJQ.divThirdLogin).attr('checked', 'checked').checkboxradio('refresh');
                for (var i = 0; i < userLoginInfoList.length; i++) {
                    var entity = userLoginInfoList[i];
                    var html = '';
                    html += '<li>';
                    html += '    <a clickAction="select">' + entity.userName + '</a>';
                    html += '    <a data-icon="delete" clickAction="delete"></a>';
                    html += '</li>';
                    $(html).appendTo($.page.idJQ.ulLoginUser).data("entity", entity);
                };
                $.page.idJQ.ulLoginUser.listview("refresh").find("a").bind("click", function () {
                    var clickAction = $(this).attr("clickAction");
                    if (fw.fwObject.FWObjectHelper.hasValue(clickAction)) {
                        var parentJQ = $(this).parent();
                        var entity = parentJQ.data("entity");
                        switch (clickAction) {
                            case "select":
                                $.page.idJQ.textUserName.val(entity.userName);
                                $.page.idJQ.textPassword.val(entity.password);
                                $.page.idJQ.divLoginUser.popup("close");
                                break;
                            case "delete":
                                fw.fwShell.FWShellHelper.CacheHelper.get({
                                    success: function (v) {
                                        //alert("获取缓存成功！");
                                        var userLoginInfoList = fw.fwJson.FWJsonHelper.deserializeObject(v);
                                        if (fw.fwObject.FWObjectHelper.hasValue(userLoginInfoList)) {
                                            var userLoginInfoNewList = [];
                                            for (var i = 0; i < userLoginInfoList.length; i++) {
                                                var oldEntity = userLoginInfoList[i];
                                                if (oldEntity.userName != entity.userName) {
                                                    userLoginInfoNewList.push(oldEntity);
                                                };
                                            };
                                            fw.fwShell.FWShellHelper.CacheHelper.set({
                                                success: function () {
                                                    //alert("设置缓存成功！");
                                                    if (entity.userName == $.page.idJQ.textUserName.val()) {
                                                        $.page.idJQ.textUserName.val("");
                                                        $.page.idJQ.textPassword.val("");
                                                    };
                                                    parentJQ.remove();
                                                    $.page.idJQ.ulLoginUser.listview("refresh");
                                                    if (fw.fwObject.FWObjectHelper.hasValue(userLoginInfoNewList)) {
                                                        //$.page.idJQ.aPopupLoginUser.show();
                                                        $.page.idJQ.aPopupLoginUser.attr("href", "#divLoginUser");
                                                    } else {
                                                        //$.page.idJQ.aPopupLoginUser.hide();
                                                        $.page.idJQ.aPopupLoginUser.removeAttr("href");
                                                        $.page.idJQ.divLoginUser.popup("close");
                                                    };
                                                }
                                                , error: function () {
                                                    //alert("设置缓存失败！");
                                                }
                                                , params: {
                                                    cachePoolName: "userLogin"
                                                    , key: "userLoginInfoList"
                                                    , value: fw.fwJson.FWJsonHelper.serializeObject(userLoginInfoNewList)
                                                }
                                            });
                                        } else {
                                            userLoginInfoList = [];
                                        };
                                        $.page.idJQ.ulUserName.listview("refresh");
                                    }
                                    , error: function () {
                                        //alert("获取缓存失败！");
                                    }
                                    , params: {
                                        cachePoolName: "userLogin"
                                        , key: "userLoginInfoList"
                                    }
                                });
                                break;
                        };
                    };
                });
                $.page.idJQ.aPopupLoginUser.attr("href", "#divLoginUser");
                //$.page.idJQ.aPopupLoginUser.show();
            } else {
                userLoginInfoList = [];
            };
            $.page.idJQ.ulUserName.listview("refresh");
        }
        , error: function () {
            //alert("获取缓存失败！");
        }
        , complete: function (ex) {
            fw.fwShell.FWShellHelper.PushNotificationHelper.setAutoNotificationOpen({
                success: function (result) { },
                error: function () { },
                complete: function () {
                    setTimeout(function () {
                        if (loginTypeCode != 1) {
                            loginTypeCode = 2;
                            loginFunction();
                        } else {
                            $.mobile.loading('hide');
                            $.page.idJQ.divPage.show();
                        };
                    }, 300);
                }
            });
        }
        , params: {
            cachePoolName: "userLogin"
            , key: "userLoginInfoList"
        }
    });
    $.mobile.loading('show');
};

var pushData = null;
$.page.receiveNotificationCallback = function (data) {
    //alert("当前页监听到协议：" + fw.fwJson.FWJsonHelper.serializeObject(data));
    pushData = data;
    if (pushData != null) {
        if (fw.fwObject.FWObjectHelper.hasValue(userLoginInfoList)) {
            for (var i = 0; i < userLoginInfoList.length; i++) {
                var entity = userLoginInfoList[i];
                if (entity.userName == pushData.fwMessage.u) {
                    $.page.idJQ.textUserName.val(entity.userName);
                    $.page.idJQ.textPassword.val(entity.password);
                    loginTypeCode = 3;
                    loginFunction();
                    break;
                };
            };
        };
    };
};

var loginFunction = function () {
    userName = $.page.idJQ.textUserName.val();
    password = $.page.idJQ.textPassword.val();
    var infoList = [];
    if (!fw.fwObject.FWObjectHelper.hasValue(userName)) {
        infoList.push("用户名不能为空！");
    };
    if (!fw.fwObject.FWObjectHelper.hasValue(password)) {
        infoList.push("密码不能为空！");
    };

    if (infoList.length > 0) {
        if (loginTypeCode == 1) {
            showLoginFailureInfo(infoList);
        } else {
            $.mobile.loading('hide');
            $.page.idJQ.divPage.show();
        };
        return;
    };
    data = {
        userName: userName
        , password: (password.length > 36) ? password : FWRSAHelper.encrypt(password)
    };
    data.thirdCode = $("input[type='checkbox'][name='checkboxThirdLogin']:checked", $.page.idJQ.divThirdLogin).val();
    //登陆
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall",
        serviceName: "userLogin",
        methodName: "thirdLogin",
        data: data,
        beforeSend: function () {
            $.page.idJQ.aLogin.attr("disabled", "disabled");
        },
        success: function (resultData) {
            //判断登录成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null && resultData.data.isLogin) {
                var userLoginInfoNewList = [{
                    userName: userName
                    , password: password
                    , thirdCode: data.thirdCode
                    , ticket: resultData.data.ticket
                }];
                for (i = 0; i < userLoginInfoList.length; i++) {
                    if (userLoginInfoList[i].userName != userName) {
                        userLoginInfoNewList.push(userLoginInfoList[i]);
                    };
                };

                fw.fwShell.FWShellHelper.CacheHelper.set({
                    success: function () {
                        //alert("设置缓存成功！");

                    }
                    , error: function () {
                        //alert("设置缓存失败！");
                    }
                    , complete: function (properties) {
                        //页面跳转
                        var datainfo = {
                            ticket: resultData.data.ticket
                        };
                        var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("mobile/operationMaintenance/main.htm", $.page.webSiteRootUrl), datainfo);
                        if (pushData != null) {
                            switch (pushData.fwMessage.p) {
                                case "personTask-1":
                                    datainfo.referrerURL = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("mobile/operationMaintenance/main.htm", $.page.webSiteRootUrl), datainfo);
                                    datainfo.taskStatus = 1;
                                    url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("mobile/operationMaintenance/operationMaintenancePersonTaskList.htm", $.page.webSiteRootUrl), datainfo);
                                    break;
                                case "personTask-2":
                                    datainfo.referrerURL = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("mobile/operationMaintenance/main.htm", $.page.webSiteRootUrl), datainfo);
                                    datainfo.taskStatus = 2;
                                    url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("mobile/operationMaintenance/operationMaintenancePersonTaskList.htm", $.page.webSiteRootUrl), datainfo);
                                    break;
                            };
                        };
                        window.location.replace(url);
                    }
                    , params: {
                        cachePoolName: "userLogin"
                        , key: "userLoginInfoList"
                        , value: fw.fwJson.FWJsonHelper.serializeObject(userLoginInfoNewList)
                    }
                });
            } else {
                if (loginTypeCode != 1) {
                    loginTypeCode = 1;
                    infoList.push("用户登录状态已过期！");
                    showLoginFailureInfo(infoList);
                } else {
                    infoList.push("用户密码不正确！");
                    showLoginFailureInfo(infoList);
                };
            };
        },
        complete: function () {
            $.page.idJQ.aLogin.removeAttr("disabled");
        }
    }));
};

var showLoginFailureInfo = function (infoList) {
    if (fw.fwObject.FWObjectHelper.hasValue(infoList)) {
        var alertString = "";
        //var html = "<ol>";
        for (var i = 0; i < infoList.length; i++) {
            alertString += infoList[i] + "\r\n";
            //html += ("<li>" + infoList[i] + "</li>");
        };
        //html += "</ol>";
        alert(alertString);
    };
    $.mobile.loading('hide');
    $.page.idJQ.divPage.show();
};

