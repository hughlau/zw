var CheckValue = 0;
var divDataSynchronizationStatusJQ = null;
var divDataSynchronizationStatusIframeJQ = null;
var iframeDataSynchronizationStatusJQ = null;

function showAlarmList() {
    mini.open({
        url: window.webSiteRootUrl + "web/system/AlarmList.htm?callType=map",
        title: ("运维任务查询"), width: 1000, height: 500,
        showMaxButton: true,
        showModal: false
    });
};


function LoadStatus() {
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall",
        serviceName: "operationMaintenance",
        methodName: "queryMonitorSiteAlarm",
        data: {
            ticket: $.page.ticket, 
            queryParams: { 
                isHome:true
            }
        },
        success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {

                // divDataSynchronizationStatusJQ.data("EntityList", resultData.data);
                //speaker 功能加载
                ShowStatus(resultData.data);
            }
            else //Roger 2016/6/1 13:00:02 增加管辖区域
            { 
                $.page.showTips({ content: "报警信息获取失败!", state: "danger" });
            };

        }
    }));
};
function ShowStatus(SpeakDataSource) {
    //滚动条

    if (divSpeaker == null) {
        divDataSynchronizationStatusJQ.Speaker({
            Width: 500
            ,Height:500
            , TemplateFunction: function (Entity, Index, liJQ) {
                var LiJQ = $(liJQ);
                var url = window.webSiteRootUrl;
                var Data = {
                    Ticket: $.page.ticket,
                    IsHideLogo: 1
                };
                var typeName = "";
                if (fw.fwObject.FWObjectHelper.hasValue(Entity.TypeName)) {
                    typeName = Entity.TypeName + "：";
                }

                //$(" <span class=\"classLink\" style=\"color:red;\">定位</span>").appendTo(LiJQ);
                $(" <span class=\"classLink\" style=\"color:red;\" ></span>").html(" 故障原因："+ Entity.alarmTypeName+"--净化槽编码["+Entity.monitorSiteName+"]").appendTo(LiJQ).bind("click", function () {
                    var data = { ticket: $.page.ticket, monitorSiteAlarmCode: Entity.monitorSiteAlarmCode, action: "view" };
                    var pageParams = { url: "web/monitorAlarm/monitorSiteAlarm.htm", width: 800, height: 448, title: "报警信息" };
                    $.page.openPage(data, pageParams);
                });

               
            }
            , DataSource: SpeakDataSource
            , IsHasMore: false
            , MoreFunction: function () { alert("更多"); }
        });
    } else {
        $.Speaker.ClearDataSource({ Selector: "#divDataSynchronizationStatus" });
        $.Speaker.SetDataSource({
            Selector: "#divDataSynchronizationStatus"
            , TemplateFunction: null
            , DataSource: SpeakDataSource
        });
    };
    CheckValue++;
    divDataSynchronizationStatusJQ.show();
};

function HideStatus() {
    if (divSpeaker != null) {
        $.Speaker.ClearDataSource({ Selector: "#divDataSynchronizationStatus" });
    }
    divDataSynchronizationStatusJQ.hide();
};
