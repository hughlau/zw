var entity = {};



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
    $.page.idM.monitorType.on("valuechanged", function (e) {
        if ($.page.idM.monitorType.getValue() == 2) {
            $("#trMonitor").show();
            $("#trArea").hide();
        } else {
            $("#trMonitor").hide();
            $("#trArea").show();
        };
    });

    $.page.idM.executeType.on("valuechanged", function (e) {
        if ($.page.idM.executeType.getValue() == 1) {
            $("#trDelay").hide();
            $("#trOn").hide();
        } else if ($.page.idM.executeType.getValue() == 2) {
            $("#trDelay").show();
            $("#trOn").hide();
        } else if ($.page.idM.executeType.getValue() == 3){
            $("#trDelay").hide();
            $("#trOn").show();
        } else {
            $("#trDelay").hide();
            $("#trOn").hide();
        };
    });

    if ($.page.params.action === 'edit') {
       
        if (fw.fwObject.FWObjectHelper.hasValue($.page.params.code)) {
            code = $.page.params.code;
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall",
                serviceName: "basicInfo",
                methodName: "queryControlPlanDetail",
                data: {
                    ticket: $.page.ticket,
                    code: code
                },
                success: function (resultData) {
                    if (resultData.status == fw.fwData.FWResultStatus.Success && fw.fwObject.FWObjectHelper.hasValue(resultData.data)) {
                        var entity = resultData.data;
                        divFormJQ.setData(entity);
                        var mtentityList = entity.monitorTypeContentNames.split(',');
                        if (entity.monitorType == "1") {
                            $("#trArea").show();
                            $("#hidCandon").val(entity.monitorTypeContent);
                            var cantonJQ = $("#cantonSelectedList");
                            cantonJQ.empty();
                            for (var i = 0; i < mtentityList.length; i++) {
                                $('<a class="select" style="margin-right:5px" href="#">' + mtentityList[i] + '</a>').appendTo(cantonJQ);
                            };
                            
                        } else {
                            $("#trMonitor").show();
                            $("#hidMonitors").val(entity.monitorTypeContent);
                            var cantonJQ = $("#monitorSelectedList");
                            cantonJQ.empty();
                            for (var i = 0; i < mtentityList.length; i++) {
                                $('<a class="select" style="margin-right:5px" href="#">' + mtentityList[i] + '</a>').appendTo(cantonJQ);
                            };
                            
                        }

                        if (entity.executeType == 1) {
                            $("#trDelay").hide();
                            $("#trOn").hide();
                        } else if (entity.executeType == 2) {
                            $("#trDelay").show();
                            $("#trOn").hide();
                        } else if (entity.executeType == 3) {
                            $("#trDelay").hide();
                            $("#trOn").show();
                        } else {
                            $("#trDelay").hide();
                            $("#trOn").hide();
                        }
                    }
                }
            }));
        }
    };
    divFormJQ = $.page.idM.divForm;

    $.page.idJQ.aSave.show();
      
    $.page.idJQ.aSave.on("click", function () {
        checkPlan();
        var Entity = divFormJQ.getData();
        $.extend(entity, Entity);
        
        if (entity.monitorType=="1") {
            entity.monitorTypeContent = $("#hidCandon").val();
        } else {
            entity.monitorTypeContent = $("#hidMonitors").val();
        }
        if ($.page.params.action != 'edit') {
            //保存数据
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall",
                serviceName: "basicInfo",
                methodName: "insertControlPlan",
                data: {
                    ticket: $.page.ticket,
                    mEntity: entity
                },
                beforeSend: function () {
                    // $.mobile.loading('show');
                },
                success: function (resultData) {
                    //判断查询信息成功
                    if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                        mini.alert("保存成功", "提示", function () {
                            CloseWindow("ok");
                        });
                    }
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
    if ($.page.idM.name.getValue() == "") {
        mini.alert('方案名称不能为空');
        return false;
    }
    if ($.page.idM.monitorType.getValue()=="") {
        mini.alert('控制范围不能为空');
        return false;
    } else if ($.page.idM.monitorType.getValue() == "1" && $("#cantonSelectedList").html()=="") {
        mini.alert('厂区范围不能为空');
        return false;
    } else if ($.page.idM.monitorType.getValue() == "2" && $("#monitorSelectedList").html() == "") {
        mini.alert('现场设备范围不能为空');
        return false;
    }
    if ($.page.idM.equipmentType.getValue() == "") {
        mini.alert('控制设备不能为空');
        return false;
    }
    if ($.page.idM.controlCommand.getValue() == "") {
        mini.alert('控制命令不能为空');
        return false;
    }
    if ($.page.idM.executeType.getValue() == "2"
        && ($.page.idM.executeDelayHour.getValue() == "0" || $.trim($.page.idM.executeDelayHour.getValue()) == "")
        && ($.page.idM.executeDelayMin.getValue() == "0" || $.trim($.page.idM.executeDelayMin.getValue()) == "")
        && ($.page.idM.executeDelaySec.getValue() == "0" || $.trim($.page.idM.executeDelaySec.getValue()) == "")
        ) {
        mini.alert('延时时间不能为空');
        return false;
    } else if ($.page.idM.executeType.getValue() == "3"
        && ($.page.idM.executeTime.getValue() == "" || $.page.idM.executeTime.getValue() == null )) {
        mini.alert('执行时间不能为空');
        return false;
    }
}

/**
* 设置框内现场设备编码功能
* @param  {[函数]} callbackData [判断条件]
* @return {[type]}              [description]
*/
function onMonitorSiteselectCallback(callbackData) {
    if ($.page.hasValue(callbackData)) {
        var strCodes = "";
        for (var i = 0; i < callbackData.length; i++) {
            strCodes += callbackData[i].code+",";
        }
        if (strCodes != "") {
            strCodes = strCodes.substring(0, strCodes.length-1);
        }
        $("#hidMonitors").val(strCodes);
        var cantonJQ = $("#monitorSelectedList");
        cantonJQ.empty();
        for (var i = 0; i < callbackData.length; i++) {
            $('<a class="select" style="margin-right:5px" href="#">' + callbackData[i].name + '</a>').appendTo(cantonJQ);
        };
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