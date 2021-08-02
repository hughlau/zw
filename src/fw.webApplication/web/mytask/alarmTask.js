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
    
    divFormJQ = $.page.idM.divForm;

    $.page.idJQ.aSave.show();
    //上传图        
    uploadImg($.page.idJQ.uploadFileParent)
    //点击保存按钮        
    $.page.idJQ.aSave.on("click", function () {
        imgnames = '';
        // 获取图片加载回来 部分删除后 剩余图片的名字       
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
        if (ImgArr.length) {
            for (var i = 0; i < ImgArr.length; i++) {
                //闭包 都能读取文件每一次的
                ReadUploading(i, operationMaintenanceTaskCode)
            }
        } else {
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall"
                , serviceName: "operationMaintenance"
                , methodName: "updateMaintenanceTask"
                , data: {
                    ticket: $.page.ticket
                    , mEntity: {
                        operationMaintenanceTaskCode: $.page.params.operationMaintenanceTaskCode
                        , operationMaintenanceFormData: fw.fwJson.FWJsonHelper.serializeObject(fw.fwControl.FWControlHelper.getData($.page.idJQ.divForm))
                        , status: 4
                        , imgName: ""
                    }
                }
                , beforeSend: function () {
                    $.mobile.loading('show');
                }
                , success: function (resultData) {
                    //判断查询信息成功
                    if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                        alert("保存成功！");
                        $.page.idJQ.aSave.hide();
                        //                        $("li div").attr("class", "ui-slider ui-slider-switch ui-slider-track ui-shadow-inset ui-bar-inherit ui-corner-all ui-state-disabled");
                        //                        $("li select").attr("class", "ui-slider-switch ui-state-disabled mobile-slider-disabled");
                    } else {
                        //                    mini.alert("该数据不存在！", undefined, function () {
                        //                        CloseWindow("cancel");
                        //                    });
                    };
                }
                , complete: function () {
                    $.mobile.loading('hide');
                }
            }));
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
        var imgName = ImgArr[i][0].name;
        imgName = new Date().getTime() + imgName.substr(imgName.lastIndexOf('.'));
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
                            if ($.page.params.action && ImgNum == ImgArr.length) {                                                
                                imgNames = imgNames.substr(1);
                                                    
                                $.page.ajax($.page.getAjaxSettings({
                                    serviceType: "crossDomainCall"
                                    , serviceName: "operationMaintenance"
                                    , methodName: "updateMaintenanceTask"
                                    , data: {
                                        ticket: $.page.ticket
                                        , mEntity: {
                                            operationMaintenanceTaskCode: $.page.params.operationMaintenanceTaskCode
                                            , operationMaintenanceFormData: fw.fwJson.FWJsonHelper.serializeObject(fw.fwControl.FWControlHelper.getData($.page.idJQ.divForm))
                                            , status: 4
                                            , imgName: imgNames
                                        }
                                    }
                                    , beforeSend: function () {
                                        $.mobile.loading('show');
                                    }
                                    , success: function (resultData) {
                                        //判断查询信息成功
                                        if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                                            alert("保存成功！");
                                            $.page.idJQ.aSave.hide();
                                            //                        $("li div").attr("class", "ui-slider ui-slider-switch ui-slider-track ui-shadow-inset ui-bar-inherit ui-corner-all ui-state-disabled");
                                            //                        $("li select").attr("class", "ui-slider-switch ui-state-disabled mobile-slider-disabled");
                                        } else {
                                            //                    mini.alert("该数据不存在！", undefined, function () {
                                            //                        CloseWindow("cancel");
                                            //                    });
                                        };
                                    }
                                    , complete: function () {
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



