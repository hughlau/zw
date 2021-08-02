var operationMaintenanceRecordCode = undefined;
//保存传入的
var imgNames = '';
var entity = {};
var divFormJQ = null;
var beforeReviewerImg = '';
$.page.pageInit = function () {
    $.page.dataSourceSettingsDictionary = {
        "equipmentTypeCode": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BLL_EquipmentType" }
        },
        "cantonCode": {
            dataSourceName: "sysBasicManage.getCantonDicData"
            , dataSourceParams: {}
        },
        "moduleTypeCode": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BLLModuleType" }
        },
        "partsChangedList": {
            dataSourceName: "basicInfo.queryEquipmentPartAll"
            , dataSourceParams: {}
        }
    };
};
var monitorSiteCode = null;
$.page.pageLoad = function () {

    divFormJQ = $.page.idM.divForm;
    buttonSaveJQ = $("#buttonSave");
    initReviewer();

    if ($.page.params.action === 'edit') {
        if (fw.fwObject.FWObjectHelper.hasValue($.page.params.operationMaintenanceRecordCode)) {
            operationMaintenanceRecordCode = $.page.params.operationMaintenanceRecordCode;
            //查询信息
            //判断传入编码
            var queryParams = { operationMaintenanceRecordCode: $.page.params.operationMaintenanceRecordCode };
            //查询信息
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall"
                , serviceName: "operationMaintenance"
                , methodName: "queryMaintenanceRecord"
                , data: {
                    ticket: $.page.ticket
                    , queryParams: queryParams
                }
                , beforeSend: function () {
                }
                , success: function (resultData) {
                    //判断查询信息成功
                    if (resultData.status == fw.fwData.FWResultStatus.Success && fw.fwObject.FWObjectHelper.hasValue(resultData.data)) {
                        var entity = resultData.data[0];
                        beforeReviewerImg = entity.reviewer_imgName;
                        divFormJQ.setData(entity);
                        if (fw.fwObject.FWObjectHelper.hasValue(entity.monitorSiteCode)) {
                            monitorSiteCode = entity.monitorSiteCode;
                        };
                        if (fw.fwObject.FWObjectHelper.hasValue(entity.monitorSiteName)) {
                            // $("#monitorSiteCode").setValue(entity.monitorSiteName);
                            var t = mini.get("monitorSiteCode");

                            t.setValue(entity.monitorSiteCode);
                            t.setText(entity.monitorSiteName);
                        };
                        if (fw.fwObject.FWObjectHelper.hasValue(entity.weather)) {
                            var t = mini.get("weather");
                            t.setValue(entity.weather);
                        };
                        if (fw.fwObject.FWObjectHelper.hasValue(entity.omTime)) {
                            $("#tromtime").show();
                            var t = mini.get("omTime");
                            t.setText(entity.omTime);
                        };
                        $.page.idM.partsChangedList.setValue(entity.partsChangedList);

                        var reviewerImg = entity.reviewer_imgName;
                        var entityIsNull = typeof reviewerImg == "undefined" || reviewerImg == null || reviewerImg == "";
                        if (!entityIsNull) {
                            reviewerImg = fw.fwUrl.FWUrlHelper.getAbsoluteUrl(reviewerImg, 'upload/');
                            var src = fw.fwUrl.FWUrlHelper.getAbsoluteUrl(reviewerImg, $.page.webSiteRootUrl);
                            var rimg = new Image();
                            rimg.src = src;
                            $("#fsImg").html($(rimg));
                        }
                    }
                }
                , complete: function () {
                    //  $.mobile.loading('hide');
                }
            }));
        }
    };

    buttonSaveJQ.bind("click", function () {
        save();
    });
};

function onValueChanged() {
    if (mini.get("solveReasult").getValue() == "1") {
        $("#tromtime").show();
    } else {
        $("#tromtime").hide();
    }
}

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

function onMonitorSiteselectCallback(callbackData) {
    if ($.page.hasValue(callbackData)) {
        var t = mini.get("monitorSiteCode");
        t.setText(callbackData.monitorSiteName);
        t.setValue(callbackData.monitorSiteCode);

    };
};
function onButtonChooseMonitorSite(e) {
    var textMonitor = this;
    //var data = { ticket: $.page.ticket};
    var data = { ticket: $.page.ticket, selectType: fw.fwData.FWSelectType.Single, selectCallback: "onMonitorSiteselectCallback" };
    var pageParams = { url: "web/OPTask/selectMonitorSite.htm", width: 800, height: 600, title: "设施点位" };
    var pageParams = { url: "web/OPTask/selectMonitorSite.htm", width: 800, height: 600, title: "设施点位" };
    $.page.openPage(data, pageParams);
};

function guid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}


/**
* [加载图片以及保存功能 ]
* @param {[number]} i [imgarr的索引值]
* @param {[string]} operationMaintenanceTaskCode [判断添加时为‘’，编辑时传入唯一编码]
*/
function ReadUploading(i, operationMaintenanceTaskCode) {
    //函数内保存调用函数 用于保存中间变量i
    function ReadUploadingResult(i, operationMaintenanceTaskCode) {
        //读取文件
        var reader = new FileReader()
        var imgName = ImgArr[i][0].name
        imgNames += "_" + imgName
        reader.readAsDataURL(ImgArr[i][0]);
        //开始加载
        reader.onloadstart = function () {
            // $.mobile.loading('show');
            isLoading = false;
        }
        //图片加载完成
        reader.onload = function () {
            //            $.mobile.loading('hide');
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
                            if ($.page.params.action && ImgNum == ImgArr.length && monitorSiteCode) {
                                imgNames = imgNames.substr(1)
                                if ($.page.params.action === 'edit') {
                                    operationMaintenanceTaskCode = operationMaintenanceTaskCode ? operationMaintenanceTaskCode : '';
                                }
                                var Entity = divFormJQ.getData();

                                $.extend(entity, Entity);
                                // var operationMaintenanceTaskCode = guid();
                                //entity.operationMaintenanceTaskCode = operationMaintenanceTaskCode
                                entity.oprType = 1;
                                entity.photoAddress = imgName;
                                entity.partsChangedList = mini.get("partsChangedList").getValue();
                                $.page.ajax($.page.getAjaxSettings({
                                    serviceType: "crossDomainCall"
                                    , serviceName: "operationMaintenance"
                                    , methodName: "insertOrUpdateMaintenanceRecord"
                                    , data: {
                                        ticket: $.page.ticket
                                        , mEntity: entity
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
                        }

                    },
                    error: function () {
                        // 因ajax 发送已封装的json 请求 后台返回的‘true’ 所以 走了error

                    },
                    complete: function () {
                        $.mobile.loading('hide');
                    }
                }));
            }
        }
    }
    //
    return ReadUploadingResult(i, operationMaintenanceTaskCode)
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
// 存储上传图片信息
var ImgArr = [];
/**
* [表示点击上传图片，添加图片时，附带删除图片]
* @return {[object]} uploadFileParent [jq对象 上传图片的时候将图片插在内]



 * 
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

var imgAdrress = [];
var imgNames = [];
var imgName = "";
function getImgInfo() {
    var fileInput = document.getElementById('test-image-file'),
        info = document.getElementById('test-file-info'),
        preview = document.getElementById('test-image-preview');
    // 监听change事件:
    fileInput.addEventListener('change', function () {
        // 清除背景图片:
        preview.style.backgroundImage = '';
        // 检查文件是否选择:
        if (!fileInput.value) {
            info.innerHTML = '没有选择文件';
            return;
        }

        // 获取File引用:
        var file = fileInput.files[0];

        imgName += "_" + file.name;
        imgNames.push(file.name);

        // 获取File信息:
        // info.innerHTML += ', ' + file.name + '<br>' ;
        /*  +
          '大小: ' + file.size + '<br>' +
          '修改: ' + file.lastModifiedDate;*/
        if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
            alert('不是有效的图片文件!');
            return;
        }
        // 读取文件:
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            preview.style.backgroundImage = 'url(' + data + ')';
        };
        // 以DataURL的形式读取文件:
        reader.readAsDataURL(file);
        console.log(file);
        imgAdrress.push(reader.result.split(',')[1]);

    }
    );
}


function save() {


    for (var i = 0; i < imgNames.length; i++) {
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall",
            serviceName: "basicInfo",
            methodName: "UploadImg",
            data: {
                ticket: $.page.ticket,
                imgName: imgNames[i],
                photoAddress: imgAdrress[i]
            },
            success: function (resultData) {
            }
        })
        );
    }
    var t = mini.get("monitorSiteCode");
    if (t.getValue() == "") {
        $.page.showTips({ content: "净化槽编码不能为空!", state: "danger" });
        return;
    }

    //表单验证
    divFormJQ.validate();
    //判断表单验证不成功
    if (divFormJQ.isValid() == false) { return; };
    var isValid = true;

    var Entity = divFormJQ.getData();

    $.extend(entity, Entity);
    if (entity.solveReasult == "0") {
        entity.omTime = "";
    }
    entity.partsChangedList = mini.get("partsChangedList").getValue();
    if (operationMaintenanceRecordCode) {
        entity.operationMaintenanceRecordCode = operationMaintenanceRecordCode;

    }
    else {
        var operationMaintenanceTaskCode = guid();
        entity.operationMaintenanceTaskCode = operationMaintenanceTaskCode
        entity.photoAddress = imgName;
        // entity.oprType=0;
    }

    ////有图片时
    //if (ImgArr.length) {
    //    for (var i = 0; i < ImgArr.length; i++) {
    //        //闭包 都能读取文件每一次的
    //        ReadUploading(i, operationMaintenanceTaskCode)
    //    }
    //}

    var reviewerImg = $("#fsImg img:first");
    if (undefined != reviewerImg && null != reviewerImg
        && undefined != reviewerImg.attr("src") && "" != reviewerImg.attr("src")) {
        if (reviewerImg.attr("src").indexOf('base64') > 0) {
            ImgArr = reviewerImg.attr("src").split(',');
        }
    }
    var newimgname;
    if (ImgArr == null || ImgArr.length < 2) {
        newimgname = beforeReviewerImg;
    } else {
        newimgname = new Date().getTime() + ".png";
        reviewerImgSend(newimgname, ImgArr);
    }
    entity.reviewer_imgName = newimgname;

    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "operationMaintenance"
        , methodName: "insertOrUpdateMaintenanceRecord"
        , data: {
            ticket: $.page.ticket
            , mEntity: entity
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data == true) {
                CloseWindow("ok");
            } else {
                var erroInfo = resultData.infoList.join("<br>");
                $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
            }
        },
        error: function () {
            $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
        }
    }));
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

function reviewerImgSend(imgName, arrimg) {

    if (beforeReviewerImg != null && "" != beforeReviewerImg) {
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
    ReadUploadingResult(imgName, arrimg);
}

///**
//* [加载图片以及保存功能 ]
//* @param {[number]} i [imgarr的索引值]
//* @param {[string]} operationCleanRecordCode [判断添加时为‘’，编辑时传入唯一编码]
//*/
function ReadUploadingResult(imgName, arrimg) {

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
