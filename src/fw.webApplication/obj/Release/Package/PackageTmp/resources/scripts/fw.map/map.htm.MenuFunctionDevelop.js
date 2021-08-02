function MenuFunctionDevelopBind(Properties) {
    if (typeof (Properties) == "undefined") {
        Properties = {};
    };
    var Settings = {
        Selector: null
        , API: null
    };
    $.extend(Settings, Properties);

    $(Settings.Selector).each(function () {
        var MenuFunctionDevelopJQ = $(this);
        var ControlData = MenuFunctionDevelopJQ.data("ControlData");

        //判断Scroll有没缓存数据，有表示已经加载控件，无表示控件第一次加载
        if (!fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
            ControlData = {
                IsTouch: jQueryExtension.IsTouch()
                , IsTouchModel: (fw.fwObject.FWObjectHelper.hasValue(fw.fwCookie.FWCookieHelper("IsTouchModel"))&&(fw.fwCookie.FWCookieHelper("IsTouchModel").toLowerCase() == "true" || fw.fwCookie.FWCookieHelper("IsTouchModel").toLowerCase() == "1"))
                , ControlJQs: {}
            };
            if (ControlData.IsTouch) {
                ControlData.IsTouchModel = true;
            };
            MenuFunctionDevelopJQ.data("ControlData", ControlData).empty();

            var Html = "";
            Html += "<table class=\"tableMenuFunctionDevelopWindow\">";
            Html += "    <tbody>";
            Html += "        <tr>";
            Html += "            <td style=\"border-right: 0px solid #d5d5d5;\">";
            Html += "                <table class=\"tableFunction\">";
            Html += "                    <tr>";
            Html += "                        <td class=\"tdFunction_Run\">运行</td>";
            Html += "                    </tr>";
            Html += "                </table>";
            Html += "            </td>";
            Html += "            <td style=\"text-align: right; border-left: 0px solid #d5d5d5;\">";
            Html += "                <table class=\"tableFunction\">";
            Html += "                    <tr>";
            Html += "                        <td class=\"tdFunction_API\">API</td>";
            Html += "                        <td class=\"tdFunction_Close\">关闭</td>";
            Html += "                    </tr>";
            Html += "                </table>";
            Html += "            </td>";
            Html += "        </tr>";
            Html += "        <tr>";
            Html += "            <td colspan=\"2\">";
            Html += "                <textarea class=\"textareaJAVAScriptCode\" cols1=\"20\" rows1=\"2\" style=\"width: 100%; height: 480px; border-width: 0px; font-size:12px; line-height:16px;\"></textarea>";
            Html += "            </td>";
            Html += "        </tr>";
            Html += "    </tbody>";
            Html += "</table>";
            $(Html).appendTo(MenuFunctionDevelopJQ);

            //ControlData.IsTouch = true;
            ControlData.ControlJQs.MenuFunctionDevelopJQ = MenuFunctionDevelopJQ;
            ControlData.ControlJQs.SelectorJQ = MenuFunctionDevelopJQ;
            ControlData.ControlJQs.TableFunctionJQ = $("table.tableFunction", ControlData.ControlJQs.SelectorJQ);
            ControlData.ControlJQs.Function_APIJQ = $("td.tdFunction_API", ControlData.ControlJQs.TableFunctionJQ);
            ControlData.ControlJQs.Function_RunJQ = $("td.tdFunction_Run", ControlData.ControlJQs.TableFunctionJQ);
            ControlData.ControlJQs.Function_CloseJQ = $("td.tdFunction_Close", ControlData.ControlJQs.TableFunctionJQ);
            ControlData.ControlJQs.JAVAScriptCodeJQ = $("textarea.textareaJAVAScriptCode", ControlData.ControlJQs.SelectorJQ);

            ControlData.ControlJQs.Function_APIJQ.bind("click", function () {
                window.open(API.webSiteRootUrl + "web/API/API.htm", "_blank");
            });
            ControlData.ControlJQs.Function_RunJQ.bind("click", function () {
                ControlData.ControlJQs.MenuFunctionDevelopJQ.hide();
                try {
                    eval(ControlData.ControlJQs.JAVAScriptCodeJQ.val());
                } catch (ex) {
                    alert("脚本报错！");
                };
                API.LogoShow();
            });
            ControlData.ControlJQs.Function_CloseJQ.bind("click", function () {
                ControlData.ControlJQs.MenuFunctionDevelopJQ.hide();
            });
            ControlData.ControlJQs.JAVAScriptCodeJQ.val("/*\r\n以下可编写javascript脚本 本系统提供了操作主窗口的一些接口 直接使用对象API\r\n例如：API.ModuleListToggle();\r\n*/\r\n");

        };
    });
    return this;
};