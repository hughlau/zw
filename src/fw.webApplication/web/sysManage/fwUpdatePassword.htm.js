$.page.pageLoad = function () {
    var initLoginForm = function () {
        var loginFormJQ = $.page.idJQ.loginForm;
        var inputJQ = $("input", loginFormJQ);
        inputJQ.bind("focus", function () {
            $(this).parent().addClass("inputFocus").prev().addClass("inputFocus");
        }).bind("blur", function () {
            $(this).parent().removeClass("inputFocus").prev().removeClass("inputFocus");
        });
        var valueChangeFunction = function (event) {
            var v = $(this).val();
            if (v == "") {
                $(this).parent().prev().show();
            } else {
                $(this).parent().prev().hide();
            };
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (event.type == "keydown" && keycode == '13') {
                $.page.idJQ.btnOK.click();
            };
        };
        inputJQ.bind("keydown", valueChangeFunction).bind("keyup", valueChangeFunction).bind("keypress", valueChangeFunction).bind("change", valueChangeFunction).bind("focus", valueChangeFunction).bind("blur", valueChangeFunction).blur();
    };
    initLoginForm();
    $.page.idJQ.txtOldPassword.focus();

    $.page.idJQ.btnOK.bind("click", function () {
        var oldPassword = $.page.idJQ.txtOldPassword.val();
        var newPassword = $.page.idJQ.txtNewPassword.val();
        var affirmPassword = $.page.idJQ.txtAffirmPassword.val();
        var infoList = [];
        if (!fw.fwObject.FWObjectHelper.hasValue(oldPassword)) {
            infoList.push("原始密码不能为空！");
            showLoginFailureInfo(infoList);
            $.page.idJQ.txtOldPassword.focus();
            return false;
        };
        if (!fw.fwObject.FWObjectHelper.hasValue(newPassword)) {
            infoList.push("新密码不能为空！");
            showLoginFailureInfo(infoList);
            $.page.idJQ.txtNewPassword.focus();
            return false;
        }
        else if (newPassword != affirmPassword) {
            infoList.push("两次输入的密码不一致！");
            showLoginFailureInfo(infoList);
            $.page.idJQ.txtAffirmPassword.focus();
            return false;
        };
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
                        , serviceName: "userLogin"
                        , methodName: "updatePassword"
                        , data: {
                            ticket: $.page.ticket,
                            oldPassword: FWRSAHelper.encrypt(oldPassword),
                            newPassword: FWRSAHelper.encrypt(newPassword)
                        }
                        , success: function (resultData) {
                            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                                var Seconds = 3;
                                var setIntervalFunction = setInterval(function () {
                                    if (Seconds > 0) {
                                        $.page.idJQ.divUpdateResultInfo.html("密码修改成功， " + (Seconds--) + " 秒后自动进入登录界面");
                                    } else {
                                        clearInterval(setIntervalFunction);
                                        fw.fwCookie.FWCookieHelper("fwSSO", null);
                                        fw.fwCookie.FWCookieHelper("ticket", null);
                                        $.page.goLogin();
                                    };
                                }, 1000);
                                $("#txtOldPassword,#txtNewPassword,#txtAffirmPassword").val("");
                            } else {
                                showLoginFailureInfo(resultData.infoList);
                            };
                        }
        }));
    });
};

var showLoginFailureInfo = function (infoList) {
    var html = "<ol>";
    for (var i = 0; i < infoList.length; i++) {
        html += ("<li>" + infoList[i] + "</li>");
    };
    html += "</ol>";
    $.page.idJQ.loginFailureInfo.html(html).show();
    clearTimeout(window.showLoginFailureInfoTimeout);
    window.showLoginFailureInfoTimeout = setTimeout(function () {
        $.page.idJQ.loginFailureInfo.fadeOut(200);
    }, 5000);
};