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
var operationMaintenanceTaskCode = '';
var beforeReviewerImg='';

//修改界面加载的待删除的图片
var imgDelNamearr = [];

$.page.pageInit = function () {
    $.page.dataSourceSettingsDictionary = {
        "isNeedClean": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BLLIsNeedClean" }
        },
        "isInocation": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BLLIsNeedClean" }
        },
        "isBackflow": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BIZYesOrNo" }
        },
        "operation":{
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BllOperationList" }
        },
        "status":{
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BLLInspectionResult" }
        }
    };
};

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
    initReviewer();
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.isNeedClean)) {
        $.page.idM.isNeedClean.setValue($.page.params.isNeedClean);
    };
    var normalIds = ["isFacilityNormal", "isFenceNormal", "isRoofNormal", "isElectricCabinetBaseNormal", "isElectricControlBoxNormal"
    , "isElectricControlBoxNormal2", "IsCableNormal", "isBlowerNormal", "isManholeCoverNormal", "isInPipeNormal", "isOutPipeNormal", "isTankNormal"
    , "isCarrierNormal", "isManholeCoverNormal2", "isBucketHeightNormal", "isReturnLineNormal", "isAerationTubeLineNormal"
    , "isDisinfectGrooveNormal", "isLiftEqNormal"];
    var arrOtherIds = [["pileUpDebris", "facilityOccupied", "facilityBuried", "facilityGouged"],
                ["fenceDamage", "fenceBaseTilt"]
                , ["roofDestroyed", "cracksink"]
                , ["electricCabinetBaseTilt", "electricCabinetBaseDestroyed"]
                , ["leakageProtectionTrip", "wireNotStrong", "moduleFailure", "wireBurnout", "surfaceCorrosion", "boxDamage", "antennaDamage", "lockDamage"]
                , ["leakageProtectionTrip2", "wireBurnout2", "wireNotStrong2", "meterDamage2", "surfaceCorrosion2", "boxDamage2", "lockDamage2"]
                , ["lineDamage", "wireTubeBare"]
                , ["jointLeak", "pipeLeak", "blowerLost", "blowerDamage", "wrongSocket"]
                , ["manholeCoverDamage", "manholeCoverLost", "manholeDamage", "manholeBlock"]
                , ["pipeBare", "pipeBlockage", "pipeDamage"]
                , ["pipeBare2", "pipeBlockage2", "pipeDamage2"]
                , ["tankDamage"]
                , ["carrierOverflow"]
                , ["manholeCoverLost2", "manholeCoverDamage2", "lockCapLost2"]
                , ["bucketHeightLeak", "bucketHeightDeform", "bucketHeightDamage"]
                , ["pipeBlockage3", "pipeDamage3", "valveLost3"]
                , ["pipeBlockage4", "pipeDamage4", "valveLost4"]
                , ["noDisinfectant", "disinfectPailLost", "disinfectPailDamage", "disinfectGrooveDamage"]
                , ["lineFault", "pumpBlockage", "pumpDamage", "floatDamage"]];
    bindCheck(normalIds, arrOtherIds);
    if ($.page.params.action === 'edit') {
        if (fw.fwObject.FWObjectHelper.hasValue($.page.params.operationMaintenanceTaskCode)) {
            operationMaintenanceTaskCode = $.page.params.operationMaintenanceTaskCode;
            //查询信息  
            //判断传入编码
            var queryParams = { operationMaintenanceTaskCode: $.page.params.operationMaintenanceTaskCode };
            //查询信息
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall"
                , serviceName: "operationMaintenance"
                , methodName: "queryDailyMaintenanceTask"
                , data: {
                    ticket: $.page.ticket
                    , queryParams: queryParams
                }
                , beforeSend: function () {
                    //$.mobile.loading('show');
                }
                , success: function (resultData) {
                    //判断查询信息成功
                    if (resultData.status == fw.fwData.FWResultStatus.Success && fw.fwObject.FWObjectHelper.hasValue(resultData.data)) {
                        var entity = resultData.data[0];
                        beforeReviewerImg = entity.reviewer_imgName;
                        monitorSiteCode = entity.monitorSiteCode;
                        divFormJQ.setData(entity);
                        //                        if (fw.fwObject.FWObjectHelper.hasValue(entity.operationMaintenanceFormData)) {
                        //                            fw.fwControl.FWControlHelper.setData($.page.idJQ.divForm, fw.fwJson.FWJsonHelper.deserializeObject(entity.operationMaintenanceFormData));
                        //                        };
                        if (entity.monitorSiteName != null && "" != entity.monitorSiteName) {
                            $("#btnChooseMonitor").html(entity.monitorSiteName);
                        }
                        if (entity.meterNo != null && "" != entity.meterNo) {
                            $("#meterNo").html(entity.meterNo);
                        }
                        var reviewerImg = entity.reviewer_imgName;
                        var entityIsNull = typeof reviewerImg == "undefined" || reviewerImg == null || reviewerImg == "";
                        if (!entityIsNull) {
                            reviewerImg = fw.fwUrl.FWUrlHelper.getAbsoluteUrl(reviewerImg, 'upload/');
                            var src = fw.fwUrl.FWUrlHelper.getAbsoluteUrl(reviewerImg, $.page.webSiteRootUrl);
                            var rimg = new Image();
                            rimg.src = src;
                            $("#fsImg").html($(rimg));
                        }
                        //现场操作
                        if (entity.operationContentID != null && "" != entity.operationContentID) {
                            var opreationId = entity.operationContentID.replace(/、/g, ",");
                            mini.get("operation").setValue(opreationId);
                        }
                        if (entity.xDoc != null && entity.xDoc != "") {
                            var x2js = new X2JS();
                            var jsonObj = x2js.xml_str2json(entity.xDoc);
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.isFacilityNormal)) {
                                mini.get("isFacilityNormal").setValue(jsonObj.property.isFacilityNormal);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.pileUpDebris)) {
                                mini.get("pileUpDebris").setValue(jsonObj.property.pileUpDebris);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.facilityOccupied)) {
                                mini.get("facilityOccupied").setValue(jsonObj.property.facilityOccupied);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.facilityBuried)) {
                                mini.get("facilityBuried").setValue(jsonObj.property.facilityBuried);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.facilityGouged)) {
                                mini.get("facilityGouged").setValue(jsonObj.property.facilityGouged);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.isFenceNormal)) {
                                mini.get("isFenceNormal").setValue(jsonObj.property.isFenceNormal);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.fenceDamage)) {
                                mini.get("fenceDamage").setValue(jsonObj.property.fenceDamage);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.fenceBaseTilt)) {
                                mini.get("fenceBaseTilt").setValue(jsonObj.property.fenceBaseTilt);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.isRoofNormal)) {
                                mini.get("isRoofNormal").setValue(jsonObj.property.isRoofNormal);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.roofDestroyed)) {
                                mini.get("roofDestroyed").setValue(jsonObj.property.roofDestroyed);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.cracksink)) {
                                mini.get("cracksink").setValue(jsonObj.property.cracksink);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.isElectricCabinetBaseNormal)) {
                                mini.get("isElectricCabinetBaseNormal").setValue(jsonObj.property.isElectricCabinetBaseNormal);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.electricCabinetBaseTilt)) {
                                mini.get("electricCabinetBaseTilt").setValue(jsonObj.property.electricCabinetBaseTilt);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.electricCabinetBaseDestroyed)) {
                                mini.get("electricCabinetBaseDestroyed").setValue(jsonObj.property.electricCabinetBaseDestroyed);
                            };
                            //电控箱
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.isElectricControlBoxNormal)) {
                                mini.get("isElectricControlBoxNormal").setValue(jsonObj.property.isElectricControlBoxNormal);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.leakageProtectionTrip)) {
                                mini.get("leakageProtectionTrip").setValue(jsonObj.property.leakageProtectionTrip);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.wireNotStrong)) {
                                mini.get("wireNotStrong").setValue(jsonObj.property.wireNotStrong);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.moduleFailure)) {
                                mini.get("moduleFailure").setValue(jsonObj.property.moduleFailure);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.wireBurnout)) {
                                mini.get("wireBurnout").setValue(jsonObj.property.wireBurnout);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.surfaceCorrosion)) {
                                mini.get("surfaceCorrosion").setValue(jsonObj.property.surfaceCorrosion);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.boxDamage)) {
                                mini.get("boxDamage").setValue(jsonObj.property.boxDamage);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.antennaDamage)) {
                                mini.get("antennaDamage").setValue(jsonObj.property.antennaDamage);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.lockDamage)) {
                                mini.get("lockDamage").setValue(jsonObj.property.lockDamage);
                            };

                            //电表箱
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.isElectricControlBoxNormal2)) {
                                mini.get("isElectricControlBoxNormal2").setValue(jsonObj.property.isElectricControlBoxNormal2);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.leakageProtectionTrip2)) {
                                mini.get("leakageProtectionTrip2").setValue(jsonObj.property.leakageProtectionTrip2);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.wireBurnout2)) {
                                mini.get("wireBurnout2").setValue(jsonObj.property.wireBurnout2);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.wireNotStrong2)) {
                                mini.get("wireNotStrong2").setValue(jsonObj.property.wireNotStrong2);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.meterDamage2)) {
                                mini.get("meterDamage2").setValue(jsonObj.property.meterDamage2);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.surfaceCorrosion2)) {
                                mini.get("surfaceCorrosion2").setValue(jsonObj.property.surfaceCorrosion2);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.boxDamage2)) {
                                mini.get("boxDamage2").setValue(jsonObj.property.boxDamage2);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.lockDamage2)) {
                                mini.get("lockDamage2").setValue(jsonObj.property.lockDamage2);
                            };
                            //电缆线
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.IsCableNormal)) {
                                mini.get("IsCableNormal").setValue(jsonObj.property.IsCableNormal);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.lineDamage)) {
                                mini.get("lineDamage").setValue(jsonObj.property.lineDamage);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.wireTubeBare)) {
                                mini.get("wireTubeBare").setValue(jsonObj.property.wireTubeBare);
                            };
                            //风机
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.isBlowerNormal)) {
                                mini.get("isBlowerNormal").setValue(jsonObj.property.isBlowerNormal);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.jointLeak)) {
                                mini.get("jointLeak").setValue(jsonObj.property.jointLeak);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.pipeLeak)) {
                                mini.get("pipeLeak").setValue(jsonObj.property.pipeLeak);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.blowerLost)) {
                                mini.get("blowerLost").setValue(jsonObj.property.blowerLost);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.blowerDamage)) {
                                mini.get("blowerDamage").setValue(jsonObj.property.blowerDamage);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.wrongSocket)) {
                                mini.get("wrongSocket").setValue(jsonObj.property.wrongSocket);
                            };
                            //检查井
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.isManholeCoverNormal)) {
                                mini.get("isManholeCoverNormal").setValue(jsonObj.property.isManholeCoverNormal);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.manholeCoverDamage)) {
                                mini.get("manholeCoverDamage").setValue(jsonObj.property.manholeCoverDamage);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.manholeCoverLost)) {
                                mini.get("manholeCoverLost").setValue(jsonObj.property.manholeCoverLost);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.manholeDamage)) {
                                mini.get("manholeDamage").setValue(jsonObj.property.manholeDamage);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.manholeBlock)) {
                                mini.get("manholeBlock").setValue(jsonObj.property.manholeBlock);
                            };
                            //进水管网
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.isInPipeNormal)) {
                                mini.get("isInPipeNormal").setValue(jsonObj.property.isInPipeNormal);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.pipeBare)) {
                                mini.get("pipeBare").setValue(jsonObj.property.pipeBare);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.pipeBlockage)) {
                                mini.get("pipeBlockage").setValue(jsonObj.property.pipeBlockage);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.pipeDamage)) {
                                mini.get("pipeDamage").setValue(jsonObj.property.pipeDamage);
                            };
                            //出水管网
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.isOutPipeNormal)) {
                                mini.get("isOutPipeNormal").setValue(jsonObj.property.isOutPipeNormal);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.pipeBare2)) {
                                mini.get("pipeBare2").setValue(jsonObj.property.pipeBare2);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.pipeBlockage2)) {
                                mini.get("pipeBlockage2").setValue(jsonObj.property.pipeBlockage2);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.pipeDamage2)) {
                                mini.get("pipeDamage2").setValue(jsonObj.property.pipeDamage2);
                            };
                            //槽体
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.isTankNormal)) {
                                mini.get("isTankNormal").setValue(jsonObj.property.isTankNormal);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.tankDamage)) {
                                mini.get("tankDamage").setValue(jsonObj.property.tankDamage);
                            };
                            //载体
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.isCarrierNormal)) {
                                mini.get("isCarrierNormal").setValue(jsonObj.property.isCarrierNormal);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.carrierOverflow)) {
                                mini.get("carrierOverflow").setValue(jsonObj.property.carrierOverflow);
                            };
                            //人孔盖
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.isManholeCoverNormal2)) {
                                mini.get("isManholeCoverNormal2").setValue(jsonObj.property.isManholeCoverNormal2);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.manholeCoverLost2)) {
                                mini.get("manholeCoverLost2").setValue(jsonObj.property.manholeCoverLost2);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.manholeCoverDamage2)) {
                                mini.get("manholeCoverDamage2").setValue(jsonObj.property.manholeCoverDamage2);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.lockCapLost2)) {
                                mini.get("lockCapLost2").setValue(jsonObj.property.lockCapLost2);
                            };
                            //加高筒
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.isBucketHeightNormal)) {
                                mini.get("isBucketHeightNormal").setValue(jsonObj.property.isBucketHeightNormal);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.bucketHeightLeak)) {
                                mini.get("bucketHeightLeak").setValue(jsonObj.property.bucketHeightLeak);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.bucketHeightDeform)) {
                                mini.get("bucketHeightDeform").setValue(jsonObj.property.bucketHeightDeform);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.bucketHeightDamage)) {
                                mini.get("bucketHeightDamage").setValue(jsonObj.property.bucketHeightDamage);
                            };
                            //回流管
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.isReturnLineNormal)) {
                                mini.get("isReturnLineNormal").setValue(jsonObj.property.isReturnLineNormal);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.pipeBlockage3)) {
                                mini.get("pipeBlockage3").setValue(jsonObj.property.pipeBlockage3);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.pipeDamage3)) {
                                mini.get("pipeDamage3").setValue(jsonObj.property.pipeDamage3);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.valveLost3)) {
                                mini.get("valveLost3").setValue(jsonObj.property.valveLost3);
                            };
                            //曝气管
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.isAerationTubeLineNormal)) {
                                mini.get("isAerationTubeLineNormal").setValue(jsonObj.property.isAerationTubeLineNormal);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.pipeBlockage4)) {
                                mini.get("pipeBlockage4").setValue(jsonObj.property.pipeBlockage4);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.pipeDamage4)) {
                                mini.get("pipeDamage4").setValue(jsonObj.property.pipeDamage4);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.valveLost4)) {
                                mini.get("valveLost4").setValue(jsonObj.property.valveLost4);
                            };
                            //消毒槽
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.isDisinfectGrooveNormal)) {
                                mini.get("isDisinfectGrooveNormal").setValue(jsonObj.property.isDisinfectGrooveNormal);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.noDisinfectant)) {
                                mini.get("noDisinfectant").setValue(jsonObj.property.noDisinfectant);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.disinfectPailLost)) {
                                mini.get("disinfectPailLost").setValue(jsonObj.property.disinfectPailLost);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.disinfectPailDamage)) {
                                mini.get("disinfectPailDamage").setValue(jsonObj.property.disinfectPailDamage);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.disinfectGrooveDamage)) {
                                mini.get("disinfectGrooveDamage").setValue(jsonObj.property.disinfectGrooveDamage);
                            };
                            //提升井若有
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.isLiftEqNormal)) {
                                mini.get("isLiftEqNormal").setValue(jsonObj.property.isLiftEqNormal);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.lineFault)) {
                                mini.get("lineFault").setValue(jsonObj.property.lineFault);
                            }
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.pumpBlockage)) {
                                mini.get("pumpBlockage").setValue(jsonObj.property.pumpBlockage);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.pumpDamage)) {
                                mini.get("pumpDamage").setValue(jsonObj.property.pumpDamage);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.floatDamage)) {
                                mini.get("floatDamage").setValue(jsonObj.property.floatDamage);
                            };
                            //备注
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.PurificateTankNote)) {
                                mini.get("PurificateTankNote").setValue(jsonObj.property.PurificateTankNote);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.waterPipeNote)) {
                                mini.get("waterPipeNote").setValue(jsonObj.property.waterPipeNote);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.eControlSystemNote)) {
                                mini.get("eControlSystemNote").setValue(jsonObj.property.eControlSystemNote);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.structureNote)) {
                                mini.get("structureNote").setValue(jsonObj.property.structureNote);
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(jsonObj.property.liftEqNote)) {
                                mini.get("liftEqNote").setValue(jsonObj.property.liftEqNote);
                            };

                        }

                    }
                }

            }));
        }
    } else {
        for (var i = 0; i < normalIds.length; i++) {
            mini.get(normalIds[i]).setValue("true");
        }
    }
    divFormJQ = $.page.idM.divForm;

    $.page.idJQ.aSave.show();
    //上传图        

    //点击保存按钮        
    $.page.idJQ.aSave.on("click", function () {

        //现场设备编码存在
        if (monitorSiteCode) {
            if ($.page.params.action === 'edit') {
                operationMaintenanceTaskCode = operationMaintenanceTaskCode ? operationMaintenanceTaskCode : '';
            }
            var xDocJson = new Object();


            xDocJson.IsCableNormal = mini.get("IsCableNormal").getValue();
            xDocJson.isAerationTubeLineNormal = mini.get("isAerationTubeLineNormal").getValue();
            xDocJson.isBlowerNormal = mini.get("isAerationTubeLineNormal").getValue();
            xDocJson.isBucketHeightNormal = mini.get("isBucketHeightNormal").getValue();
            xDocJson.isCarrierNormal = mini.get("isCarrierNormal").getValue();
            xDocJson.isDisinfectGrooveNormal = mini.get("isDisinfectGrooveNormal").getValue();
            xDocJson.isElectricCabinetBaseNormal = mini.get("isElectricCabinetBaseNormal").getValue();
            xDocJson.isElectricControlBoxNormal = mini.get("isElectricControlBoxNormal").getValue();
            xDocJson.isElectricControlBoxNormal2 = mini.get("isElectricControlBoxNormal2").getValue();
            xDocJson.isFacilityNormal = mini.get("isFacilityNormal").getValue();
            xDocJson.isFenceNormal = mini.get("isFenceNormal").getValue();
            xDocJson.isInPipeNormal = mini.get("isInPipeNormal").getValue();
            xDocJson.isLiftEqNormal = mini.get("isLiftEqNormal").getValue();
            xDocJson.isManholeCoverNormal = mini.get("isManholeCoverNormal").getValue();
            xDocJson.isManholeCoverNormal2 = mini.get("isManholeCoverNormal2").getValue();
            xDocJson.isOutPipeNormal = mini.get("isOutPipeNormal").getValue();
            xDocJson.isReturnLineNormal = mini.get("isReturnLineNormal").getValue();
            xDocJson.isRoofNormal = mini.get("isRoofNormal").getValue();
            xDocJson.isTankNormal = mini.get("isTankNormal").getValue();
            xDocJson.PurificateTankNote = mini.get("PurificateTankNote").getValue();
            xDocJson.antennaDamage = mini.get("antennaDamage").getValue();
            xDocJson.blowerDamage = mini.get("blowerDamage").getValue();
            xDocJson.blowerLost = mini.get("blowerLost").getValue();
            xDocJson.boxDamage = mini.get("boxDamage").getValue();
            xDocJson.boxDamage2 = mini.get("boxDamage2").getValue();
            xDocJson.bucketHeightDamage = mini.get("bucketHeightDamage").getValue();
            xDocJson.bucketHeightDeform = mini.get("bucketHeightDeform").getValue();
            xDocJson.bucketHeightLeak = mini.get("bucketHeightLeak").getValue();
            xDocJson.carrierOverflow = mini.get("carrierOverflow").getValue();
            xDocJson.cracksink = mini.get("cracksink").getValue();
            xDocJson.disinfectGrooveDamage = mini.get("disinfectGrooveDamage").getValue();
            xDocJson.disinfectPailDamage = mini.get("disinfectPailDamage").getValue();
            xDocJson.disinfectPailLost = mini.get("disinfectPailLost").getValue();
            xDocJson.eControlSystemNote = mini.get("eControlSystemNote").getValue();
            xDocJson.electricCabinetBaseDestroyed = mini.get("electricCabinetBaseDestroyed").getValue();
            xDocJson.electricCabinetBaseTilt = mini.get("electricCabinetBaseTilt").getValue();
            xDocJson.facilityBuried = mini.get("facilityBuried").getValue();
            xDocJson.facilityGouged = mini.get("facilityGouged").getValue();
            xDocJson.facilityOccupied = mini.get("facilityOccupied").getValue();
            xDocJson.fenceBaseTilt = mini.get("fenceBaseTilt").getValue();
            xDocJson.fenceDamage = mini.get("fenceDamage").getValue();
            xDocJson.floatDamage = mini.get("floatDamage").getValue();
            xDocJson.jointLeak = mini.get("jointLeak").getValue();
            xDocJson.leakageProtectionTrip = mini.get("leakageProtectionTrip").getValue();
            xDocJson.leakageProtectionTrip2 = mini.get("leakageProtectionTrip2").getValue();
            xDocJson.liftEqNote = mini.get("liftEqNote").getValue();
            xDocJson.lineDamage = mini.get("lineDamage").getValue();
            xDocJson.lineFault = mini.get("lineFault").getValue();
            xDocJson.lockCapLost2 = mini.get("lockCapLost2").getValue();
            xDocJson.lockDamage = mini.get("lockDamage").getValue();
            xDocJson.lockDamage2 = mini.get("lockDamage2").getValue();
            xDocJson.manholeBlock = mini.get("manholeBlock").getValue();
            xDocJson.manholeCoverDamage = mini.get("manholeCoverDamage").getValue();
            xDocJson.manholeCoverDamage2 = mini.get("manholeCoverDamage2").getValue();
            xDocJson.manholeCoverLost = mini.get("manholeCoverLost").getValue();
            xDocJson.manholeCoverLost2 = mini.get("manholeCoverLost2").getValue();
            xDocJson.manholeDamage = mini.get("manholeDamage").getValue();
            xDocJson.meterDamage2 = mini.get("meterDamage2").getValue();
            xDocJson.moduleFailure = mini.get("moduleFailure").getValue();
            xDocJson.noDisinfectant = mini.get("noDisinfectant").getValue();
            xDocJson.pileUpDebris = mini.get("pileUpDebris").getValue();
            xDocJson.pipeBare = mini.get("pipeBare").getValue();
            xDocJson.pipeBare2 = mini.get("pipeBare2").getValue();
            xDocJson.pipeBlockage = mini.get("pipeBlockage").getValue();
            xDocJson.pipeBlockage2 = mini.get("pipeBlockage2").getValue();
            xDocJson.pipeBlockage3 = mini.get("pipeBlockage3").getValue();
            xDocJson.pipeBlockage4 = mini.get("pipeBlockage4").getValue();
            xDocJson.pipeDamage = mini.get("pipeDamage").getValue();
            xDocJson.pipeDamage2 = mini.get("pipeDamage2").getValue();
            xDocJson.pipeDamage3 = mini.get("pipeDamage3").getValue();
            xDocJson.pipeDamage4 = mini.get("pipeDamage4").getValue();
            xDocJson.pipeLeak = mini.get("pipeLeak").getValue();
            xDocJson.pumpBlockage = mini.get("pumpBlockage").getValue();
            xDocJson.pumpDamage = mini.get("pumpDamage").getValue();
            xDocJson.roofDestroyed = mini.get("roofDestroyed").getValue();
            xDocJson.structureNote = mini.get("structureNote").getValue();
            xDocJson.surfaceCorrosion = mini.get("surfaceCorrosion").getValue();
            xDocJson.surfaceCorrosion2 = mini.get("surfaceCorrosion2").getValue();
            xDocJson.tankDamage = mini.get("tankDamage").getValue();
            xDocJson.valveLost3 = mini.get("valveLost3").getValue();
            xDocJson.valveLost4 = mini.get("valveLost4").getValue();
            xDocJson.waterPipeNote = mini.get("waterPipeNote").getValue();
            xDocJson.wireBurnout = mini.get("wireBurnout").getValue();
            xDocJson.wireBurnout2 = mini.get("wireBurnout2").getValue();
            xDocJson.wireNotStrong = mini.get("wireNotStrong").getValue();
            xDocJson.wireNotStrong2 = mini.get("wireNotStrong2").getValue();
            xDocJson.wireTubeBare = mini.get("wireTubeBare").getValue();
            xDocJson.wrongSocket = mini.get("wrongSocket").getValue();


            var x2js = new X2JS();
            var xmlStr = x2js.json2xml_str(xDocJson);
            xmlStr = "<property>" + xmlStr + "</property>";
            var opContent="";
            if (""!=mini.get("operation").getValue()) {
                var opIds=mini.get("operation").getValue().split(',');
                for (var i = 0; i < opIds.length; i++) {
                    opContent += $.trim(mini.get("operation").getItem(opIds[i]).name)+"、";
                }
                if (opContent!="") {
                    opContent=opContent.substring(0,opContent.length-1);
                }
            }
            var reviewerImg=$("#fsImg img:first");
            if (undefined != reviewerImg && null != reviewerImg
                && undefined != reviewerImg.attr("src") && "" != reviewerImg.attr("src")) {
                if (reviewerImg.attr("src").indexOf('base64')>0) {
                    ImgArr=reviewerImg.attr("src").split(',');
                }
            }
            var newimgname;
            if (ImgArr==null || ImgArr.length<2) {
                newimgname=beforeReviewerImg;
            }else {
                newimgname=new Date().getTime()+".png";
                reviewerImgSend(newimgname,ImgArr);
            }
            
            //保存数据
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall",
                serviceName: "operationMaintenance",
                methodName: "insertOrUpdateDailyMaintenanceTask",
                data: {
                    ticket: $.page.ticket,
                    mEntity: {
                        operationMaintenanceTaskCode: operationMaintenanceTaskCode,
                        operationMaintenanceTaskName: operationMaintenanceTaskName,
                        xDoc: xmlStr,
                        //operationMaintenanceFormData: fw.fwJson.FWJsonHelper.serializeObject(fw.fwControl.FWControlHelper.getData($.page.idJQ.divForm)),
                        opinion: opinion,
                        remark: mini.get("remark").getValue(),
                        GPS: mini.get("GPS").getValue(),
                        //imgName: imgNames,
                        monitorSiteCode: monitorSiteCode,
                        meterNum:mini.get("meterNum").getValue(),
                        equipmentCode: '',
                        isNeedClean: mini.get("isNeedClean").getValue(),
                        isBackflow: mini.get("isBackflow").getValue(),
                        inclusionRemoval_F: mini.get("inclusionRemoval_F").getValue(),
                        anaerobicFilter_F: mini.get("anaerobicFilter_F").getValue(),
                        settlingChamber_F: mini.get("settlingChamber_F").getValue(),
                        inclusionRemoval_D: mini.get("inclusionRemoval_D").getValue(),
                        anaerobicFilter_D: mini.get("anaerobicFilter_D").getValue(),
                        settlingChamber_D: mini.get("settlingChamber_D").getValue(),
                        operationContentID:mini.get("operation").getValue(),
                        operationContent:opContent,
                        maintainers:mini.get("maintainers").getValue(),
                        recorder:mini.get("recorder").getValue(),
                        status:mini.get("status").getValue(),
                        reviewer_imgName:newimgname,
                        reviewer:mini.get("reviewer").getValue(),
                        others: mini.get("others").getValue(),
                        water_COD: mini.get("water_COD").getValue(),
                        water_BOD: mini.get("water_BOD").getValue(),
                        water_TP: mini.get("water_TP").getValue(),
                        water_TN: mini.get("water_TN").getValue(),
                        water_SS: mini.get("water_SS").getValue(),
                        water_NH34: mini.get("water_NH34").getValue(),
                        isInocation: mini.get("isInocation").getValue()

                    }
                },
                beforeSend: function () {
                    // $.mobile.loading('show');
                },
                success: function (resultData) {
                    //判断查询信息成功
                    if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                        mini.alert("保存成功！");
                        CloseWindow("ok");
                    }
                },
                complete: function () {
                    // $.mobile.loading('hide');
                }
            }));
        } else {
            mini.alert('请选择现场设备编号')
        }
    })
}

/**
* [加载图片以及保存功能 ]
* @param {[number]} i [imgarr的索引值]
* @param {[string]} operationMaintenanceTaskCode [判断添加时为‘’，编辑时传入唯一编码]
*/
function ReadUploadingResult(imgName,arrimg) {
        
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall",
        serviceName: "basicInfo",
        methodName: "UploadImg",
        data: {
            ticket: $.page.ticket,
            imgName: imgName,
            photoAddress: arrimg[1]
        },
        success: function (resultData) {
            if (resultData.status == !!fw.fwData.FWResultStatus.Success && resultData.data) {
                           
            }

        },
        error: function () {
            // 因ajax 发送已封装的json 请求 后台返回的‘true’ 所以 走了error

        },
        complete: function () {
            //$.mobile.loading('hide');
        }
    }));        
}


function reviewerImgSend(imgName,arrimg){
    
    if (beforeReviewerImg!=null && ""!=beforeReviewerImg) {
        $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall",
        serviceName: "basicInfo",
        methodName: "deleteImg",
        data: {
            ticket: $.page.ticket,
            imgName: beforeReviewerImg
        },
        beforeSend: function () {
            //$.mobile.loading('show');
        },
        success: function (resultData) {
            //判断查询信息成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                // mini.alert("保存成功！");
                // $.page.idJQ.aSave.hide();
                
            }
        },
        complete: function () {
            //$.mobile.loading('hide');
        }
    }));
    }
    ReadUploadingResult(imgName,arrimg);
}

/**
* [点击提示框 弹出选择页面]
* @param  {[object]} e [函数对象]
* @return {[type]}   [没有返回值]
*/
function onButtonChooseMonitorSite(e) {
    if ($.page.params.action === 'add') {
        var textMonitor = this;
        var data = { ticket: $.page.ticket, selectType: fw.fwData.FWSelectType.Single, selectCallback: "onMonitorSiteselectCallback" };
        var pageParams = { url: "web/OPTask/selectMonitorSite.htm", width: 800, height: 600, title: "设施点位" };
        $.page.openPage(data, pageParams);
    }
    if ($.page.params.action === 'edit') {
        return false
    }
};
/**
* 设置框内现场设备编码功能
* @param  {[函数]} callbackData [判断条件]
* @return {[type]}              [description]
*/
function onMonitorSiteselectCallback(callbackData) {
    if ($.page.hasValue(callbackData)) {
        equipmentCode = callbackData.equipmentCode;
        monitorSiteCode = callbackData.monitorSiteCode;
        $.page.idM.btnChooseMonitor = new mini.Form("#btnChooseMonitor")
        // $.page.idM.btnChooseMonitor.setText(callbackData.monitorSiteName );        
        $("#btnChooseMonitor .mini-buttonedit-input").val(callbackData.monitorSiteName)
        $("#btnChooseMonitor .mini-buttonedit-input").attr('disabled', 'disabled');
        $("#meterNo").html(callbackData.meterNo);
        $.page.idM.btnChooseMonitor.validate();  //首次选择后 现场设备编码显示不能为空
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

function initReviewer() {
    var $sigdiv = $("#signature");
    var curLayer = null;
    $sigdiv.jSignature({
        width: 500,
        height: 200,
    });
    $("#btnReview").click(function () {
        curLayer = layer.open({
            type: 1,
            title: "审核人签字",
            area: '500px',
            closeBtn: 1,
            shadeClose: true,
            content: $('#panelReview')
        });
    });
    $("#saveSig").click(function () {
        if ($sigdiv.jSignature("isModified")) {
            var datapair = $sigdiv.jSignature("getData", "image");
            if (undefined != datapair && null != datapair) {
                var i = new Image();
                i.src = "data:" + datapair[0] + "," + datapair[1];
                $("#fsImg").html($(i));
            }
        } else {
            $("#fsImg").empty();
        }
        if (null != curLayer) {
            layer.close(curLayer);
        }
    });
    $("#resetSig").click(function () {
        $sigdiv.jSignature("reset");
    });
}