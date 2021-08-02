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
//净化槽编码
var monitorSiteCode =''
//保存传入的
var imgNames = '';
//rem 供电情况
var rem = '';
var operationMaintenanceTaskCode=''
// 数组删除元素的方法+1
Array.prototype.remove = function(val) {
    var index = this.indexOf(val)
    if (index > -1) {
        this.splice(index, 1)
    }
}
//修改界面加载的待删除的图片
var imgDelNamearr = [];
/* 页面加载 */
$.page.pageLoad = function () {
    if ($.page.params.action === 'edit') {
        if (fw.fwObject.FWObjectHelper.hasValue($.page.params.operationMaintenanceTaskCode)) {
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
                    $.mobile.loading('show');
                }
                , success: function (resultData) {
                    //判断查询信息成功
                    if (resultData.status == fw.fwData.FWResultStatus.Success && fw.fwObject.FWObjectHelper.hasValue(resultData.data)) {
                        var entity = resultData.data[0];
                        if (fw.fwObject.FWObjectHelper.hasValue(entity.operationMaintenanceFormData)) {
                            fw.fwControl.FWControlHelper.setData($.page.idJQ.divForm, fw.fwJson.FWJsonHelper.deserializeObject(entity.operationMaintenanceFormData));
                        };

                        if (fw.fwObject.FWObjectHelper.hasValue(entity.GPS)) {
                            $("#GPS").val(entity.GPS);
                        };
                        if (fw.fwObject.FWObjectHelper.hasValue(entity.remark)) {
                            $("#remark").val(entity.remark);
                        };
                        if (fw.fwObject.FWObjectHelper.hasValue(entity.monitorSiteName)) {
                            $('.mini-buttonedit-input').val(entity.monitorSiteName).attr("disabled", "disabled")

                        };
                       // debugger;
                        if (fw.fwObject.FWObjectHelper.hasValue(entity.meterNum)) {
                            $("#meterNum").val(entity.meterNum);
                        };
                        if (fw.fwObject.FWObjectHelper.hasValue(entity.monitorSiteCode)) {
                            monitorSiteCode = entity.monitorSiteCode;
                        };
                        if (fw.fwObject.FWObjectHelper.hasValue(entity.operationMaintenanceTaskCode)) {
                            operationMaintenanceTaskCode = entity.operationMaintenanceTaskCode;
                        };
                        if (entity.imgName != null && entity.imgName.length > 0) {
                            // 图片数组存储
                            var monitorImgList = [];
                            monitorImgList = entity.imgName.split("_");
                            var html = '';
                            if (fw.fwObject.FWObjectHelper.hasValue(monitorImgList)) {
                                for (var i = 0; i < monitorImgList.length; i++) {
                                    var entity = monitorImgList[i];
                                    entity = fw.fwUrl.FWUrlHelper.getAbsoluteUrl(entity, 'upload/')
                                    var src = fw.fwUrl.FWUrlHelper.getAbsoluteUrl(entity, $.page.webSiteRootUrl);
                                    html += '<div class="oldImgParent"><img src="' + src + '"><span class="OldeDelete"></span></div>'
                                };
                            };
                            $('#uploadFileParent').append($(html));
                            var OldeDeletes = $('.OldeDelete');
                            // var photoAddressarr = []

                            //每一组图片都保存到数组中   
                            OldeDeletes.each(function (index, ele) {
                                ele.index = index;
                                //删除图片
                                $(ele).click(function () {
                                    var imgDelName = $(this).parent().children($('img')).attr('src').split('/')
                                    imgDelName = imgDelName[imgDelName.length - 1]
                                    //所有被删掉的图片的名字
                                    imgDelNamearr.push(imgDelName)
                                    ImgArr[this.index] = null;
                                    var ImgNewArr = []
                                    ImgArr.remove(this.index)
                                    for (var i = 0; i < ImgArr.length; i++) {
                                        if (ImgArr[i]) {
                                            ImgNewArr.push(ImgArr[i])
                                        }
                                    }
                                    ImgArr = ImgNewArr
                                    $(this).parent().remove();
                                });
                            });
                        }
                    }
                }
                , complete: function () {
                    $.mobile.loading('hide');
                }
            }));
        }
    };
    divFormJQ = $.page.idM.divForm;

    $.page.idJQ.aSave.show();
    //上传图        
    uploadImg($.page.idJQ.uploadFileParent)
    //点击保存按钮        
    $.page.idJQ.aSave.on("click", function () {


        appearance = $.page.idJQ.isEnclosureNormal.val() * 1 && $.page.idJQ.isManholecoverNormal.val() * 1 && $.page.idJQ.isManholecoverNormal.val() * 1;
        // 供电情况
        supply = $.page.idJQ.isPowerSupplyBoxNormal.val() * 1 && !($.page.idJQ.isLeakageProtectorNormal.val() * 1) && $.page.idJQ.isLeakageProtectorSwitchNormal.val() * 1 && $.page.idJQ.isPowerSupplyLineNormal.val() * 1;
        // 运行情况
        operation = !($.page.idJQ.isDeviceFlowBackward.val() * 1) && !($.page.idJQ.isCarrierOverflow.val() * 1) && !($.page.idJQ.isTapDefect.val() * 1) && $.page.idJQ.isAerationNormal.val() * 1 && $.page.idJQ.isLiftDeviceNormal.val() * 1 && $.page.idJQ.isWaterLineNormal.val() * 1;
        equipmentStatus = $.page.idJQ.isMonitorNormal.val() * 1

        // 以下为参数设置赋值        
        operationMaintenanceTaskName += appearance ? operationMaintenanceTaskName : '外观有损坏';
        operationMaintenanceTaskName += supply ? '' : '_供电情况异常';
        operationMaintenanceTaskName += operation ? '' : '_设备运行情况异常';
        operationMaintenanceTaskName += equipmentStatus ? '' : '_监控模块运行情况异常';
        operationMaintenanceTaskName = operationMaintenanceTaskName.substr(0, 1) == '_' ? operationMaintenanceTaskName.substr(1) : operationMaintenanceTaskName;
        opinion += appearance ? opinion : 2;
        opinion += supply ? 0 : 3;
        opinion += operation ? 0 : 4;
        opinion += equipmentStatus ? 0 : 5;
        rem = supply ? 0 : 3;
        // 获取图片加载回来 部分删除后 剩余图片的名字       
        if ($.page.params.action === 'edit') {
            var surplusImgNames = []
            $('.oldImgParent>img').each(function (index, ele) {
                var surplusImgName = ele.src.split('/')
                surplusImgName = surplusImgName[surplusImgName.length - 1]
                imgNames += '_' + surplusImgName
            })
            imgDelNamearr.forEach(function (ele, index) {
                $.page.ajax($.page.getAjaxSettings({
                    serviceType: "crossDomainCall",
                    serviceName: "basicInfo",
                    methodName: "deleteImg",
                    data: {
                        ticket: $.page.ticket,
                        imgName: ele
                    },
                    beforeSend: function () {
                        $.mobile.loading('show');
                    },
                    success: function (resultData) {
                        //判断查询信息成功
                        if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                            // mini.alert("保存成功！");
                            // $.page.idJQ.aSave.hide();
                        }
                    },
                    complete: function () {
                        $.mobile.loading('hide');
                    }
                }));
            })
        };
        //净化槽编码存在
        if (monitorSiteCode) {
            //有图片时
            if (ImgArr.length) {
                for (var i = 0; i < ImgArr.length; i++) {
                    //闭包 都能读取文件每一次的
                    ReadUploading(i, operationMaintenanceTaskCode)
                }
            } else {
                if ($.page.params.action === 'edit') {
                    imgNames = imgNames.substr(1)
                }
                //无上传图片时
                $.page.ajax($.page.getAjaxSettings({
                    serviceType: "crossDomainCall",
                    serviceName: "operationMaintenance",
                    methodName: "insertOrUpdateDailyMaintenanceTask",
                    data: {
                        //ticket: $.page.ticket,
                        ticket: "451a9846-058b-4944-86c6-fccafdb7d8d0",
                        //                        mEntity: {
                        //                            operationMaintenanceTaskCode: operationMaintenanceTaskCode,
                        //                            operationMaintenanceTaskName: operationMaintenanceTaskName,
                        //                            operationMaintenanceFormData: fw.fwJson.FWJsonHelper.serializeObject(fw.fwControl.FWControlHelper.getData($.page.idJQ.divForm)),
                        //                            opinion: opinion,
                        //                            remark: $.page.idJQ.remark.val(),
                        //                            GPS: $.page.idJQ.GPS.val(),
                        //                            imgName: imgNames,
                        //                            monitorSiteCode: monitorSiteCode,
                        //                            equipmentCode: '',
                        //                            rem :rem,
                        //                            meterNum: $.page.idJQ.meterNum.val()
                        //                            ,
                        //                            inclusionRemoval_D:'15'
                        //                            //operationCleanRecordCode: 'cdda23ff-8d2d-47cc-a7fc-cb65c99a514a'
                        //                           , operationMaintenanceTaskCode: "6995ebe7-9272-44c0-bc44-7aa5e3ee8b39"
                        //                           , maintainers: "李末利，李建国"
                        //                           , operationContent: "清洗风机过滤网、添加消毒药片、净化槽内部清扫 、调节回流阀、调节曝气阀"
                        //                           , operationContentID: "3、4、5、7、8"
                        //                           , anaerobicFilter_D: "10"
                        //                           , anaerobicFilter_F: "2"
                        //                           , imgName: "1515634013400.jpg"
                        //                           , inclusionRemoval_F: "18"
                        //                           , settlingChamber_D: "5"
                        //                           , settlingChamber_F: "0"
                        //                           ,status:"1"
                        //                           
                        //                        }

                        mEntity: { "GPS": "江苏省苏州市常熟市G15(沈海高速)", "anaerobicFilter_D": "10", "anaerobicFilter_F": "2", "imgName": "1515634013400.jpg", "inclusionRemoval_D": "15", "inclusionRemoval_F": "18", "isDis": "0", "maintainers": "李末利，李建国", "meterNum": "413.3", "monitorSiteCode": "5e662607-90a6-477c-8f20-008f413e2a3b", "operationContent": "添加消毒药片、净化槽内部清扫 、清洗阀门、调节回流阀、调节曝气阀  、修复围栏、清洗井盖  ", "operationContentID": "4、5、6、7、8、9、10", "operationMaintenanceFormData": "{\"isElectricBoxNormal\":1,\"isEnclosureNormal\":1,\"isLeakageProtectorNormal\":0,\"isLeakageProtectorSwitchNormal\":1,\"isLiftDeviceNormal\":1,\"isManholecoverNormal\":1,\"isMonitorNormal\":1,\"isPowerSupplyBoxNormal\":1,\"isPowerSupplyLineNormal\":1,\"isTapDefect\":0,\"isWaterLineNormal\":1,\"isDeviceFlowBackward\":0,\"isCarrierOverflow\":0,\"isAerationNormal\":1}", "operationMaintenanceTaskCode": "6995ebe7-9272-44c0-bc44-7aa5e3ee8b39", "operationMaintenanceTaskName": "", "opinion": "", "others": "", "recorder": "", "rem": "0", "remark": "", "settlingChamber_D": "5", "settlingChamber_F": "0", "status": "1" }

                    },
                    beforeSend: function () {
                        $.mobile.loading('show');
                    },
                    success: function (resultData) {
                        //判断查询信息成功
                        if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                            mini.alert("保存成功！");
                            $.page.idJQ.aSave.hide();
                        }
                    },
                    complete: function () {
                        $.mobile.loading('hide');
                    }
                }));
            }
        } else {
            mini.alert('请选择净化槽编号')
        }
    })
}

/**
 * [加载图片以及保存功能 ]
 * @param {[number]} i [imgarr的索引值]
 * @param {[string]} operationMaintenanceTaskCode [判断添加时为‘’，编辑时传入唯一编码]
 */
function ReadUploading(i,operationMaintenanceTaskCode) {
    //函数内保存调用函数 用于保存中间变量i
            function ReadUploadingResult(i,operationMaintenanceTaskCode) {
                //读取文件
                var reader = new FileReader()                       
                        var imgName = ImgArr[i][0].name
                        imgNames += "_" + imgName
                        reader.readAsDataURL(ImgArr[i][0]);
                        //开始加载
                        reader.onloadstart = function() {
                            $.mobile.loading('show');
                            isLoading = false;
                        }
                        //图片加载完成
                        reader.onload = function() {
                            $.mobile.loading('hide');                            
                            photoAddress = this.result.split(',')[1];
                            isLoading = true;
                            //确保文档加载完成后实现
                            if (isLoading) {                                
                                $.page.ajax($.page.getAjaxSettings({
                                    serviceType: "crossDomainCall",
                                    serviceName: "basicInfo",
                                    methodName: "UploadImg",
                                    data: {
                                        ticket: $.page.ticket,
                                        imgName: imgName,
                                        photoAddress: photoAddress
                                    },
                                    success: function(resultData) {
                                        if (resultData.status == !!fw.fwData.FWResultStatus.Success && resultData.data) {
                                             ImgNum++
                                            if ($.page.params.action && ImgNum == ImgArr.length&&monitorSiteCode) {                                                
                                                    imgNames = imgNames.substr(1)
                                                    if($.page.params.action==='edit'){
                                                    operationMaintenanceTaskCode = operationMaintenanceTaskCode ? operationMaintenanceTaskCode :'';
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
                                                            operationMaintenanceFormData: fw.fwJson.FWJsonHelper.serializeObject(fw.fwControl.FWControlHelper.getData($.page.idJQ.divForm)),
                                                            opinion: opinion,
                                                            remark: $.page.idJQ.remark.val(),
                                                            GPS: $.page.idJQ.GPS.val(),
                                                            imgName: imgNames,
                                                            monitorSiteCode: monitorSiteCode,
                                                            equipmentCode: '',
                                                            rem : rem
                                                        }
                                                    },
                                                    beforeSend: function() {
                                                        $.mobile.loading('show');
                                                    },
                                                    success: function(resultData) {
                                                        //判断查询信息成功
                                                        if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                                                            mini.alert("保存成功！");
                                                            $.page.idJQ.aSave.hide();  
                                                        } 
                                                    },
                                                    complete: function() {
                                                        $.mobile.loading('hide');
                                                    }
                                                }));
                                            } 
                                        }   

                                    },
                                    error: function() {
                                        // 因ajax 发送已封装的json 请求 后台返回的‘true’ 所以 走了error
                                       
                                    },
                                    complete: function() {
                                        $.mobile.loading('hide');
                                    }
                                }));
                    }
                }
            }
            //
            return ReadUploadingResult(i,operationMaintenanceTaskCode)
}

/**
 * [表示点击上传图片，添加图片时，附带删除图片]
 * @return {[object]} uploadFileParent [jq对象 上传图片的时候将图片插在内]
 */
function uploadImg (uploadFileParent) {
    $.page.idJQ.thumbnail.on('change', function() {
        // 上传有文件时
        if (this.files[0]) {
            var files = this.files;;
            var thumbnallJQ = $(this);
            ImgArr.push(files);
            var eImgs = [];
            var eDiv = $(document.createElement('div'));
            var eImg = $(document.createElement('img'));
            var eDelete = $(document.createElement('span'));
            eDelete.addClass('eDelete');
            eDiv.addClass('imgParent');
            eDiv.append(eImg);
            eDiv.append(eDelete);
            eImg.attr('src', getObjectURL(files[0]));
            uploadFileParent.append(eDiv);
            isLoading = true;
            var eDeletes = $('.eDelete');
            var photoAddressarr = [];
            var imgNamearr = [];
            //每一组图片都保存到数组中   
            eDeletes.each(function(index, ele) {
                ele.index = index;
                //删除图片
                $(ele).click(function() {
                    ImgArr[this.index] = null;                        
                    var ImgNewArr = [];
                    ImgArr.remove(this.index);
                    for (var i = 0; i < ImgArr.length; i++) {
                        if (ImgArr[i]) {
                            ImgNewArr.push(ImgArr[i]);
                        }
                    }
                    ImgArr = ImgNewArr;
                    $(this).parent().remove();
                });
            });
        }
    })  
}

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
/**
 * [点击提示框 弹出选择页面]
 * @param  {[object]} e [函数对象]
 * @return {[type]}   [没有返回值]
 */
function onButtonChooseMonitorSite(e) {
    if($.page.params.action==='add'){
        var textMonitor = this;
        var data = { ticket: $.page.ticket, selectType: fw.fwData.FWSelectType.Single, selectCallback: "onMonitorSiteselectCallback" };
        var pageParams = { url: "web/OPTask/selectMonitorSite.htm", width: 800, height: 600, title: "设施点位" };
        $.page.openPage(data, pageParams);
    }
    if($.page.params.action==='edit'){
        return false
    }
};
/**
 * 设置框内净化槽编码功能
 * @param  {[函数]} callbackData [判断条件]
 * @return {[type]}              [description]
 */
function onMonitorSiteselectCallback(callbackData) {
    if ($.page.hasValue(callbackData)) {
        equipmentCode = callbackData.equipmentCode;
        monitorSiteCode = callbackData.monitorSiteCode;
        $.page.idM.btnChooseMonitor = new mini.Form("#btnChooseMonitor")         
        // $.page.idM.btnChooseMonitor.setText(callbackData.monitorSiteName );        
        $('.mini-buttonedit-input').val(callbackData.monitorSiteName) 
             $('.mini-buttonedit-input').attr('disabled','disabled') 
       $.page.idM.btnChooseMonitor.validate();  //首次选择后 净化槽编码显示不能为空
    };
};

