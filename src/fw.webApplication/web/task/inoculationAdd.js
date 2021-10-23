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
var operationCleanRecordCode = '';
var beforeReviewerImg = '';
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
        "typeId": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BLLInoculationType" }
        }
    };
};
/*

 */
function bindCheck(normalIds, otherIds) {
    for (var j = 0; j < normalIds.length; j++) {
        (function (j) {
            mini.get(normalIds[j]).on("valuechanged", function (e) {
                if (mini.get(normalIds[j]).getValue() == "true") {
                    for (var i = 0; i < otherIds[j].length; i++) {
                        mini.get(otherIds[j][i]).setValue("false");
                    }
                }
            });
            for (var i = 0; i < otherIds[j].length; i++) {
                (function (i) {
                    mini.get(otherIds[j][i]).on("valuechanged", function (e) {
                        if (mini.get(otherIds[j][i]).getValue() == "true") {
                            mini.get(normalIds[j]).setValue("false");
                        }
                    });
                })(i);
            }
        })(j);

    }
}
/* 页面加载 


 */
$.page.pageLoad = function () {

    if ($.page.params.action === 'edit') {
        
        $("#tr_type").show();
        $("#tr_time").show();
        $("#tr_preson").show();
        
        if (fw.fwObject.FWObjectHelper.hasValue($.page.params.code)) {
            //查询信息
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall"
                , serviceName: "operationMaintenance"
                , methodName: "queryInoculationByCode"
                , data: {
                    ticket: $.page.ticket
                    , code: $.page.params.code
                }
                , beforeSend: function () {
                    //$.mobile.loading('show');
                }
                , success: function (resultData) {
                    //判断查询信息成功
                    if (resultData.status == fw.fwData.FWResultStatus.Success && fw.fwObject.FWObjectHelper.hasValue(resultData.data)) {
                        var entity = resultData.data;
                        divFormJQ.setData(entity);
                        if (entity.monitorSiteName != null && "" != entity.monitorSiteName) {
                            $("#btnChooseMonitor").html(entity.monitorSiteName);
                        }
                        
                    }
                }

            }));
        }
    };
    divFormJQ = $.page.idM.divForm;

    $.page.idJQ.aSave.show();

    //点击保存按钮        
    $.page.idJQ.aSave.on("click", function () {
        if ($.page.params.action === 'edit' &&
            (mini.get("maintainers").getValue() == "" || mini.get("inoculationTime").getValue()=="")) {
            mini.alert('运维信息不能为空')
            return;
        }
        

        if ($.page.params.action != 'edit') {
                //现场设备编码存在
                if (!monitorSiteCode) {
                    mini.alert('请选择现场设备编号');
                    return;
                }
                //保存数据
                $.page.ajax($.page.getAjaxSettings({
                    serviceType: "crossDomainCall",
                    serviceName: "operationMaintenance",
                    methodName: "insertOrUpdateInoculationRecord",
                    data: {
                        ticket: $.page.ticket,
                        mEntity: {
                            monitorSiteCode: monitorSiteCode,
                            typeId: mini.get("typeId").getValue()
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

                $.page.ajax($.page.getAjaxSettings({
                    serviceType: "crossDomainCall",
                    serviceName: "operationMaintenance",
                    methodName: "insertOrUpdateInoculationRecord",
                    data: {
                        ticket: $.page.ticket,
                        mEntity: {
                            code: $.page.params.code,
                            inoculationTime: mini.get("inoculationTime").getValue(),
                            maintainers: mini.get("maintainers").getValue(),
                            stats: 1,
                            typeId: mini.get("typeId").getValue()
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

            }




        
    })
}

///**
//* [加载图片以及保存功能 ]
//* @param {[number]} i [imgarr的索引值]
//* @param {[string]} operationCleanRecordCode [判断添加时为‘’，编辑时传入唯一编码]
//*/
//function ReadUploadingResult(imgName,arrimg) {

//    $.page.ajax($.page.getAjaxSettings({
//        serviceType: "crossDomainCall",
//        serviceName: "basicInfo",
//        methodName: "UploadImg",
//        data: {
//            ticket: $.page.ticket,
//            imgName: imgName,
//            photoAddress: arrimg[1]
//        },
//        success: function (resultData) {
//            if (resultData.status == !!fw.fwData.FWResultStatus.Success && resultData.data) {

//            }

//        },
//        error: function () {
//            // 因ajax 发送已封装的json 请求 后台返回的‘true’ 所以 走了error

//        },
//        complete: function () {
//            //$.mobile.loading('hide');
//        }
//    }));        
//}


//function reviewerImgSend(imgName,arrimg){

//    if (beforeReviewerImg!=null && ""!=beforeReviewerImg) {
//        $.page.ajax($.page.getAjaxSettings({
//        serviceType: "crossDomainCall",
//        serviceName: "basicInfo",
//        methodName: "deleteImg",
//        data: {
//            ticket: $.page.ticket,
//            imgName: beforeReviewerImg
//        },
//        beforeSend: function () {
//            //$.mobile.loading('show');
//        },
//        success: function (resultData) {
//            //判断查询信息成功
//            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
//                // mini.alert("保存成功！");
//                // $.page.idJQ.aSave.hide();

//            }
//        },
//        complete: function () {
//            //$.mobile.loading('hide');
//        }
//    }));
//    }
//    ReadUploadingResult(imgName,arrimg);
//}

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


/**
 * [加载图片以及保存功能 ]
 * @param {[number]} i [imgarr的索引值]
 * @param {[string]} operationMaintenanceTaskCode [判断添加时为‘’，编辑时传入唯一编码]
 */
function ReadUploading(i) {
    //函数内保存调用函数 用于保存中间变量i
    function ReadUploadingResult(i) {
        //读取文件
        var reader = new FileReader()
        var imgName = ImgArr[i][0].name;
        imgName = new Date().getTime() + imgName.substr(imgName.lastIndexOf('.'));
        imgNames += "_" + imgName
        reader.readAsDataURL(ImgArr[i][0]);
        //开始加载
        reader.onloadstart = function () {
            //$.mobile.loading('show');
            isLoading = false;
        }
        //图片加载完成
        reader.onload = function () {
            //$.mobile.loading('hide');
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
                    success: function (resultData) {
                        if (resultData.status == !!fw.fwData.FWResultStatus.Success && resultData.data) {
                            ImgNum++
                            if ($.page.params.action && ImgNum == ImgArr.length) {
                                imgNames = imgNames.substr(1);

                                if ($.page.params.action === 'edit') {
                                    operationCleanRecordCode = operationCleanRecordCode ? operationCleanRecordCode : '';
                                }
                                //保存数据
                                $.page.ajax($.page.getAjaxSettings({
                                    serviceType: "crossDomainCall",
                                    serviceName: "operationMaintenance",
                                    methodName: "insertOrUpdateMaintenanceCleanRecord",
                                    data: {
                                        ticket: $.page.ticket,
                                        mEntity: {
                                            operationCleanRecordCode: operationCleanRecordCode,
                                            monitorSiteCode: monitorSiteCode,
                                            inclusionRemoval_F: mini.get("inclusionRemoval_F").getValue(),
                                            anaerobicFilter_F: mini.get("anaerobicFilter_F").getValue(),
                                            settlingChamber_F: mini.get("settlingChamber_F").getValue(),
                                            inclusionIsClean_F: mini.get("inclusionIsClean_F").getValue(),
                                            filterIsClean_F: mini.get("filterIsClean_F").getValue(),
                                            chamberIsClean_F: mini.get("chamberIsClean_F").getValue(),
                                            remark_F: mini.get("remark_F").getValue(),
                                            inclusionRemoval_D: mini.get("inclusionRemoval_D").getValue(),
                                            anaerobicFilter_D: mini.get("anaerobicFilter_D").getValue(),
                                            settlingChamber_D: mini.get("settlingChamber_D").getValue(),
                                            inclusionIsClean_D: mini.get("inclusionIsClean_D").getValue(),
                                            filterIsClean_D: mini.get("filterIsClean_D").getValue(),
                                            chamberIsClean_D: mini.get("chamberIsClean_D").getValue(),
                                            remark_D: mini.get("remark_D").getValue(),
                                            imgName: imgNames,
                                            recorder: mini.get("recorder").getValue(),
                                            maintainers: mini.get("maintainers").getValue()
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
                            }
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
        }
    }
    //
    return ReadUploadingResult(i)
}

/**
 * [表示点击上传图片，添加图片时，附带删除图片]
 * @return {[object]} uploadFileParent [jq对象 上传图片的时候将图片插在内]
 */
function uploadImg(uploadFileParent) {
    $.page.idJQ.thumbnail.on('change', function () {
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
            eDeletes.each(function (index, ele) {
                ele.index = index;
                //删除图片
                $(ele).click(function () {
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