
var monitorSiteCodeList = [];
var entityList = null;
//页面初始化
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {

    };
};


//页面加载
$.page.pageLoad = function () {

    //测试数据
    $.page.params.monitorSiteCode = '0001F692-F9DD-40BB-A124-B75CD92A62C8,07F651E0-9C9D-4FFF-9AEA-9876204A7CAF,18468BE0-FCC3-45D9-BFB4-8B38A166B519,1B494A0E-B6FE-4C23-B588-2E4C702555C8,343AF100-F796-4EFD-B59F-AC588BA20FB2,62af5d37-4e7f-448a-8bdd-5022db2ae721,725274BF-45E6-42D8-BD32-359A683A1672,94F837CB-7EF2-4027-B724-F77DF6A1E6CE,C154C551-EA5D-49A2-B238-19F0CA79A3CB';
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.monitorSiteCode)) {
        monitorSiteCodeList = $.page.params.monitorSiteCode.split(',');
        getMonitorSiteQRCode(monitorSiteCodeList);
    } else {
        mini.alert("monitorSiteCode参数为空！");
    };

};

function getMonitorSiteQRCode(monitorSiteCodeList) {
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "basicInfo"
        , methodName: "queryMonitorQRcodeList"
        , data: {
            ticket: $.page.ticket,
            monitorSiteCodeList: monitorSiteCodeList
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null && resultData.data.length > 0) {
                var htmlContent = "";
                $(htmlContent).appendTo($('#qrcodeList'));
                var monitorSiteList = resultData.data;
                for (var i = 0; i < monitorSiteList.length; i++) {
                    var qrcodeInfo = monitorSiteList[i].quickResponseCodeInfo;
                    htmlContent += '<div class="monitorSite_qrcode">';
                    htmlContent += '<a href="javascript:void(0);" class="qrcode">';
                    htmlContent += '<img src="' + qrcodeInfo.imageUrl + '" node-type="qrcode_src" height="180" width="180" alt="">';
                    htmlContent += '</a><p class="tips_info monitorSite_address">';
                    htmlContent += monitorSiteList[i].address;
                    htmlContent += '</p></div>';

                };
                $(htmlContent).appendTo($('#qrcodeList'));
            }
            else //Roger 2016/6/1 13:00:02 增加管辖区域
            {
                var erroInfo = resultData.infoList.join("<br>");
                $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
            };
        }
    }));
}; 