var monitorSiteCode = null;

$.page.pageInit = function () {

    $.page.dataSourceSettingsDictionary = {
    };
};

$.page.pageLoad = function () {
    //$.page.params.monitorSiteCode = '06c14661-7664-4bbe-93de-d5774cfb6735';
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.monitorSiteCode)) {
        monitorSiteCode = $.page.params.monitorSiteCode;
        queryMonitorSite();
    };
};

function mouseOut() {
    $("#divImage").hide();
}
function mouseOver(obj) {
    //获取标签id
    $("#divImage").show();
    $("#imgbig").remove();
    var image = $('<img id="imgbig">');
    image.attr("src", $(obj).attr("src"));
    $("#divImage").append(image);
    //alert(image.width() + '/' + image.height());
    var rate;
    var rateW = 500 / image.width();
    var rateH = 500 / image.height();
    rate = rateW < rateH ? rateW : rateH;
    //$("#image1")[0].height = image.height() * rate;
    //$("#image1")[0].width = image.width() * rate;
    // $("#imgbig").hide();
    //alert(image.height()*rate);
    $("#imgbig").attr({ width: image.width() * rate, height: image.height() * rate });

};

function queryMonitorSite() {
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "basicInfo"
        , methodName: "queryMonitorSiteInfo"
        , data: {
            ticket: $.page.ticket
           , monitorSiteCode: monitorSiteCode
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                var entity = resultData.data;
                $.page.idM.tableEnterprise.setData(entity);

                //报警项目
                    var monitorSiteAlarmList = resultData.data.monitorSiteAlarmList;
                    if ($.page.hasValue(monitorSiteAlarmList)) {
                        var alarmItemString = $.Enumerable.From(monitorSiteAlarmList).Select("$.alarmTypeName").ToArray().join('、');
                        $.page.idJQ.alarmList.html(alarmItemString);
                    }

                var equipmentList = resultData.data.equipmentList;
                if ($.page.hasValue(equipmentList)) {
                    $.page.idM.tableEquipment.setData(equipmentList[0]);
                }

                //政府管理者角色登录后，隐藏监测因子  songshasha 2017-04-24
                if (fw.fwCookie.FWCookieHelper("login_role") == "govAdminRole") {

                    // return;
                }
                else {
                    $("#factor").show();
                    var factorList = resultData.data.monitorBasFactorList;
                    if ($.page.hasValue(factorList)) {
                        $.page.idM.tableEquipment.setData(equipmentList[0]);
                        for (var i = 0; i < factorList.length; i++) {
                            var template = $.templates("#theTmpl");
                            var htmlOutput = template.render(factorList[i]);
                            $("#factorContent").append(htmlOutput);
                        };
                    };
                }
             

                if (entity.photoAddress != null && entity.photoAddress.length > 0) {
                    var monitorImgList = [];
                    // alert("sssss"+entity.photoAddress);

                    monitorImgList = entity.photoAddress.split("_");
                    // monitorImgList = fw.fwJson.FWJsonHelper.deserializeObject("ddd");
                    var html = '<tr><td align="right">净化槽图片</td><td class="tdRight" colspan="3">';
                    if (fw.fwObject.FWObjectHelper.hasValue(monitorImgList)) {
                        for (var i = 0; i < monitorImgList.length; i++) {
                            var entity = monitorImgList[i];
                            entity = fw.fwUrl.FWUrlHelper.getAbsoluteUrl(entity, 'upload/')
                            var src = fw.fwUrl.FWUrlHelper.getAbsoluteUrl(entity, $.page.webSiteRootUrl);

                            html += '<img class="hoverCls"  style="width: 100px; height: 100px" src=' + src + ' id=' + monitorImgList[i] + ' onmouseover="mouseOver(this)" onmouseout="mouseOut()"></img>';


                        };
                    }

                    html += '</td></tr>';
                    $(html).appendTo($("#tableEnterprise"));
                }
            }
            else //Roger 2016/6/1 13:00:02 增加管辖区域
            {
                var erroInfo = resultData.infoList.join("<br>");
                $.page.showTips({ content: "净化槽信息获取失败!<br>" + erroInfo, state: "danger" });
            };
        }
    }));
};