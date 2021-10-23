
var deleteFactorList = [];
var factorDictionaryList = [];

var divFormJQ = null;
var buttonSaveJQ = null;
var buttonCancelJQ = null;

var action = null;
var monitorSiteCode = null;

$.page.pageInit = function () {
    //获取设置值
    $.page.appSettings = {
        defaultMonitorSiteAlarmItem: "1,2,3,4,6"
    };

    $.page.dataSourceSettingsDictionary = {
        "cmbCanton": {
            dataSourceName: "sysBasicManage.getCantonDicData"
            , dataSourceParams: {  }
        }
        , "cblAlarmInfo": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BIZFaultType" }
        }
        , "moduleType": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BLLModuleType" }
        }
        , "pumpTypeCode": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BLL_PumpType" }
        }
        , "monitorSiteTypeCode": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BLL_SiteType" }
        }
    };
    $.page.idM.cblAlarmInfo.setValue($.page.appSettings.defaultMonitorSiteAlarmItem);
};
$.page.pageLoad = function () {
    action = $.page.params.action;
    monitorSiteCode = $.page.params.monitorSiteCode;

    divFormJQ = $.page.idM.divForm;
    buttonSaveJQ = $("#buttonSave");
    buttonCancelJQ = $("#buttonConcel");


    if (fw.fwObject.FWObjectHelper.hasValue(monitorSiteCode)) {
        queryMonitorSite();
    }

    buttonCancelJQ.bind("click", function () {
        if (action == $.pageCustomer.enumOperate.add) {
            CloseWindow("cancel");
        };
    });

    buttonSaveJQ.bind("click", function () {
        save();
    });
    roleViewInit();
};
//用户角色页面视图处理
function roleViewInit() {
    if (!$.page.isNullOrEmpty($.page.userInfo)) {
        var roleList = $.page.userInfo.roleCodeList || [];
        if ($.page.isNullOrEmpty(roleList)) return;

        var isAdmin = $.Enumerable.From(roleList).Where("$=='sysAdminRole'").Count();
        var isManage = $.Enumerable.From(roleList).Where("$=='managerRole'").Count();
        if (isAdmin > 0) {
            //判断是否为系统管理员

        }
        else if (isManage > 0) {
            //判断是否为管理者  只查看
            $.page.miniFormReadOnly('divForm');
            buttonSaveJQ.hide();
        };
    };
};
/**


 * 
 * 
 * */

function save() {
    //表单验证
    divFormJQ.validate();
    //判断表单验证不成功
    if (divFormJQ.isValid() == false) { return; };
    var isValid = true;
    var Entity = divFormJQ.getData();
    var alarmInfo = $.page.idM.cblAlarmInfo.getValue();
    alarmInfoList = alarmInfo.split(",");

    var monitorSiteAlarmList = [];

    for (var i = 0; i < alarmInfoList.length; i++) {
        var monitorSiteAlarm = {};
        monitorSiteAlarm.alarmTypeCode = alarmInfoList[i];
        monitorSiteAlarm.isDis = 0;
        monitorSiteAlarmList.push(monitorSiteAlarm);
    };
    Entity.monitorSiteAlarmList = monitorSiteAlarmList;

    if (window.top['_projectCache'] != undefined && null != window.top['_projectCache']) {
        Entity.projectNo = window.top['_projectCache'];
    }
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "basicInfo"
        , methodName: "insertUpdateBLLMonitorSite"
        , data: {
            ticket: $.page.ticket
           , mEntity: Entity
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                mini.alert("保存成功", "提示", function () {
                    if (action == $.pageCustomer.enumOperate.add) {
                        CloseWindow("ok");
                    };
                   
                });
            } else {
                if (resultData.infoList != null && resultData.infoList.length > 0) {
                    mini.alert(resultData.infoList[0]);
                };
            };
        }
    }));
};

function queryMonitorSite() {
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "basicInfo"
        , methodName: "queryMonitorSite"
        , data: {
            ticket: $.page.ticket
           , queryParams: { monitorSiteCode: monitorSiteCode }
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                var entity = resultData.data[0];
                divFormJQ.setData(entity);
                $.page.idM.cmbCanton.setValue(entity.cantonCode);
                var alarmCode = "";
                if (entity.monitorSiteAlarmList != null && entity.monitorSiteAlarmList.length > 0) {
                    for (var i = 0; i < entity.monitorSiteAlarmList.length; i++) {
                        alarmCode += entity.monitorSiteAlarmList[i].alarmTypeCode + ",";
                    };
                    alarmCode = alarmCode.substr(0, alarmCode.length - 1);
                };

                $.page.idM.cblAlarmInfo.setValue(alarmCode);
                if (entity.photoAddress != null && entity.photoAddress.length > 0) {
                    var monitorImgList = [];
                    // alert("sssss"+entity.photoAddress);

                    monitorImgList = entity.photoAddress.split("_");
                    // monitorImgList = fw.fwJson.FWJsonHelper.deserializeObject("ddd");
                    var html = '<tr><th>现场设备图片：</th><td colspan="3">';
                    if (fw.fwObject.FWObjectHelper.hasValue(monitorImgList)) {
                        for (var i = 0; i < monitorImgList.length; i++) {
                            var entity = monitorImgList[i];
                            entity = fw.fwUrl.FWUrlHelper.getAbsoluteUrl(entity, 'upload/')
                            var src = fw.fwUrl.FWUrlHelper.getAbsoluteUrl(entity, $.page.webSiteRootUrl);

                            html += '<img class="hoverCls"  style="width: 100px; height: 100px" src=' + src + ' id=' + monitorImgList[i] + ' onmouseover="mouseOver(this)" onmouseout="mouseOut()" ></img>';


                        };
                    }

                    html += '</td></tr>';
                    $(html).appendTo($("#table1"));
                }
                /*
                $(".hoverCls").hover(function()
                {
                var _this=$(this);
                //imgbig.src = _this.src;
                $("#divImage").show();
                $("#imgbig").src=_this.src;

                });
                */
                //entity.photoAddress
            }
            else //Roger 2016/6/1 13:00:02 增加管辖区域
            {
                var erroInfo = resultData.infoList.join("<br>");
                $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
            };
        }
    }));
};



function CloseWindow(action) {
    //判断数据被修改
    if (action == "close" && $.page.idM.editform.isChanged()) {
        if (confirm("数据被修改了，是否先保存？")) {
            return false;
        };
    };
    if (window.CloseOwnerWindow) {
        return window.CloseOwnerWindow(action);
    } else {
        window.close();
    };
}

function beforenodeselect(e) {
    //禁止选中父节点
    if (e.isLeaf == false) e.cancel = true;
};

//function over(imgid, obj, imgbig) {
//    //大图显示的最大尺寸  4比3的大小  400 300
//    maxwidth = 400;
//    maxheight = 300;
//    //显示
//    obj.style.display = "";
//    imgbig.src = imgid.src;
//};
function mouseOut(){
    $("#divImage").hide();
}
function mouseOver(obj){
    //获取标签id
    $("#divImage").show();
    $("#imgbig").remove();
    var image = $('<img id="imgbig">');
    image.attr("src", $(obj).attr("src"));
    $("#divImage").append(image);
    var rate;
    var rateW =500 / image.width();
    var rateH = 500 / image.height();
    rate = rateW < rateH ? rateW : rateH;
    //$("#image1")[0].height = image.height() * rate;
    //$("#image1")[0].width = image.width() * rate;
   // $("#imgbig").hide();
    //alert(image.height()*rate);
    $("#imgbig").attr({ width: image.width() * rate, height: image.height() * rate });

};



 