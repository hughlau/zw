//2017年10月06日 by 王洋wangyang
var taskTypeCode = null;
var faultTypeCode = null;
var imgNameArr = [];
var photoAddress = '';
var ImgNum = 0;
// 外观情况
var appearance = '';
// 供电情况
var supply = '';
// 设备运行情况
var operation = '';
// 监测模块运行情况
var equipmentStatus = '';
// 参数设置赋值
var opinion = 0;
var operationMaintenanceTaskName = '';
// 过度变量
var isLoading = false;
// 存储上传图片信息
var ImgArr = [];
//现场设备编码
var monitorSiteCode = ''
//保存传入的
var imgNames = '';
//rem 供电情况
var rem = '';
var code = '';
var beforeReviewerImg = '';
var entity = {};
// 数组删除元素的方法+1
Array.prototype.remove = function (val) {
    var index = this.indexOf(val)
    if (index > -1) {
        this.splice(index, 1)
    }
}
//修改界面加载的待删除的图片
var imgDelNamearr = [];

$.page.pageInit = function () {
    $.page.dataSourceSettingsDictionary = {
 
    };
};

//打开厂区分配功能窗口
function openSetCanton() {

    var data = {
        ticket: $.page.ticket
        , selectType: fw.fwData.FWSelectType.Multi
        , selectCallback: "openSetCantonCallback"
        , userID: $.page.params.mUserID
        , cantonCode: ""
    };
    var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysBasicManage/cantonSelect.htm", $.page.webSiteRootUrl), data);
    //打开窗口
    mini.open({
        url: url
        , title: "选择厂区"
        , width: 768
        , height: 512
        , onload: function () {
        }
        , ondestroy: function (action) {
            //判断非（关闭和取消）窗口
            if (action != "close" && action != "cancel") {
            };
        }
    });
    //    } else {
    //        mini.alert("请选择用户所属厂区！"); 
    //    };
};

function openSetMonitor() {
    var textMonitor = this;
    var data = { ticket: $.page.ticket, selectType: fw.fwData.FWSelectType.Single, selectCallback: "onMonitorSiteselectCallback" };
    var pageParams = { url: "web/control/selectMonitorSite.htm", width: 800, height: 600, title: "设施点位" };
    $.page.openPage(data, pageParams);
}

function openSetCantonCallback(callbackData) {
    if ($.page.hasValue(callbackData)) {
        var strCodes = "";
        for (var i = 0; i < callbackData.length; i++) {
            strCodes += callbackData[i].code + ",";
        }
        if (strCodes != "") {
            strCodes = strCodes.substring(0, strCodes.length - 1);
        }
        $("#hidCandon").val(strCodes);
        var cantonJQ = $("#cantonSelectedList");
        cantonJQ.empty();
        for (var i = 0; i < callbackData.length; i++) {
            $('<a class="select" style="margin-right:5px" href="#">' + callbackData[i].name + '</a>').appendTo(cantonJQ);
        };
    }
}


function bindCheck(normalIds,otherIds){
   for (var j = 0; j < normalIds.length; j++) {
        (function(j){
            mini.get(normalIds[j]).on("valuechanged", function (e) {
                if (mini.get(normalIds[j]).getValue() == "true") {
                    for (var i = 0; i < otherIds[j].length; i++) {
                        mini.get(otherIds[j][i]).setValue("false");
                    } 
                }
            });
            for (var i = 0; i < otherIds[j].length; i++) {
                (function(i){
                    mini.get(otherIds[j][i]).on("valuechanged",function(e){
                        if (mini.get(otherIds[j][i]).getValue() == "true") {
                            mini.get(normalIds[j]).setValue("false");
                        }
                    });
                })(i);
            }
        })(j);
        
   }
}
/* 页面加载 */
$.page.pageLoad = function () {


    
    divFormJQ = $.page.idM.divForm;

    $.page.idJQ.aSave.show();
      
    $.page.idJQ.aSave.on("click", function () {
        if (!checkPlan()) {
            return;
        };
        var Entity = divFormJQ.getData();
        $.extend(entity, Entity);
        
        if ($.page.params.action != 'edit') {
            //保存数据
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall",
                serviceName: "basicInfo",
                methodName: "controlTest",
                data: {
                    ticket: $.page.ticket,
                    monitorSiteCode: entity.monitorSiteCode,
                    equipmentType: entity.equipmentType,
                    controlCommand: entity.controlCommand
                },
                beforeSend: function () {
                    // $.mobile.loading('show');
                },
                success: function (resultData) {
                    $("#divResult").html(resultData.data);
                },
                complete: function () {
                    // $.mobile.loading('hide');
                }
            }));
        } else {
            entity.planCode = code;
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall",
                serviceName: "basicInfo",
                methodName: "updateControlPlan",
                data: {
                    ticket: $.page.ticket,
                    mEntity: entity
                },
                success: function (resultData) {
                    //判断查询信息成功
                    if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                        mini.alert("保存成功", "提示", function () {
                            CloseWindow("ok");
                        });
                    }
                }
            }));
        }
    })
}

function checkPlan() {
    if ($.page.idM.monitorSiteCode.getValue() == "") {
        mini.alert('请选择现场设备！');
        return false;
    }

    if ($.page.idM.equipmentType.getValue() == "") {
        mini.alert('请选择控制设备！');
        return false;
    }
    if ($.page.idM.controlCommand.getValue() == "") {
        mini.alert('请选择控制命令！');
        return false;
    }
    return true;
}

/**
* 设置框内现场设备编码功能
* @param  {[函数]} callbackData [判断条件]
* @return {[type]}              [description]
*/


function onMonitorSiteselectCallback(callbackData) {
    if ($.page.hasValue(callbackData)) {
        var t = mini.get("monitorSiteCode");
        t.setText(callbackData.monitorSiteName);
        t.setValue(callbackData.monitorSiteCode);

    };
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
}; 


/**
 * [获取传入的文件的路径]
 * @param  {[string]} file [传入的具体文件]
 * @return {[string]}      [获取到的路径]
 */
function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}    


function onButtonChooseMonitorSite(e) {
    var textMonitor = this;
    //var data = { ticket: $.page.ticket};
    var data = { ticket: $.page.ticket, selectType: fw.fwData.FWSelectType.Single, selectCallback: "onMonitorSiteselectCallback" };
    var pageParams = { url: "web/OPTask/selectMonitorSite.htm", width: 800, height: 600, title: "设施点位" };
    $.page.openPage(data, pageParams);
};