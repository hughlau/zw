//页面初始化
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
    };
};

//页面加载
$.page.pageLoad = function () {

    $.page.idM.loginWindow.show();

    $.page.idJQ.imgValidateCode.bind('click', function () {
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "userLogin"
            , methodName: "getValidateCode"
            , data: {
                validateCodeImageFullName: $.page.idJQ.imgValidateCode.data("validateCodeImageFullName")
            }
            , success: function (resultData) {
                //判断获取验证码成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                    $.page.idJQ.imgValidateCode.attr("src", resultData.data.imageUrl).data("validateCodeImageFullName", resultData.data.imageFullName);
                };
            }
        }));
    }).click();
};

function onLoginClick(e) {
    $.page.idM.loginForm.validate();
    if ($.page.idM.loginForm.isValid() == false) {
        return;
    };
    //获取表单数据
    var data = fw.fwObject.FWObjectHelper.emptyToNull($.page.idM.loginForm.getData());
    data.validateCodeImageFullName = $.page.idJQ.imgValidateCode.data("validateCodeImageFullName");
    data.password = FWRSAHelper.encrypt(data.password);
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "userLogin"
        , methodName: "loginByValidateCode"
        , data: data
        , beforeSend: function () {
            fw.fwButton.fwButtonHelper.addWait($.page.idM.login);
            fw.fwButton.fwButtonHelper.addWait($.page.idM.reset);
        }
        , success: function (resultData) {
            //判断登录成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null && resultData.data.isLogin) {
                fw.fwCookie.FWCookieHelper("fwSSO", "ticket=" + resultData.data.ticket + "&userName=" + data.userName, { expires: 0.5 });
                fw.fwCookie.FWCookieHelper("ticket", resultData.data.ticket);
                $.page.idM.loginWindow.hide();
                mini.loading("登录成功，马上转到系统...", "登录成功");
                setTimeout(function () {
                    window.location.replace("main.htm");
                }, 500);
            } else {
                var html = "";
                for (var i = 0; i < resultData.infoList.length; i++) {
                    html += ("<li>" + resultData.infoList[i] + "</li>");
                };
                $.page.idJQ.imgValidateCode.click();
                mini.alert(html);
            };
        }
        , complete: function () {
            fw.fwButton.fwButtonHelper.removeWait($.page.idM.login);
            fw.fwButton.fwButtonHelper.removeWait($.page.idM.reset);
        }
    }));
};

function onResetClick(e) {
    $.page.idM.loginForm.clear();
};