var monitorSiteCode = null;

$.page.pageInit = function () {

    $.page.dataSourceSettingsDictionary = {
    };
};

$.page.pageLoad = function () {
    queryMonitorSite();
    $.views.converters({
        cdate: function (value) {
            return fw.fwObject.FWObjectHelper.hasValue(value) ? moment(value).format("YYYY年MM月DD日") : value;;
        }
    })
};


function queryMonitorSite() {
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "basicInfo"
        , methodName: "queryAllReleaseNote"
        , data: {
            ticket: $.page.ticket
            ,type:"0"
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                var factorList = resultData.data;
                if ($.page.hasValue(factorList)) {
                    for (var i = 0; i < factorList.length; i++) {
                        var template = $.templates("#theTmpl");
                        var htmlOutput = template.render(factorList[i]);
                        $("#factorContent").append(htmlOutput);
                    };
                };
            }
            else //Roger 2016/6/1 13:00:02 增加管辖区域
            {
                var erroInfo = resultData.infoList.join("<br>");
                $.page.showTips({ content: "现场设备信息获取失败!<br>" + erroInfo, state: "danger" });
            };
        }
    }));
};