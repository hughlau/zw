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
var monitorSiteCode = ''
//保存传入的
var imgNames = '';
//rem 供电情况
var rem = '';
var operationMaintenanceTaskCode = '';

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
    
};


/* 页面加载 */
$.page.pageLoad = function () {

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
                        monitorSiteCode = entity.monitorSiteCode;
                        divFormJQ.setData(entity);

                        if (entity.monitorSiteName != null && "" != entity.monitorSiteName) {
                            $("#monitorSiteName").html(entity.monitorSiteName);
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
 

    //点击保存按钮        
    $.page.idJQ.aSave.on("click", function () {

        //净化槽编码存在
        if (monitorSiteCode) {
            if ($.page.params.action === 'edit') {
                operationMaintenanceTaskCode = operationMaintenanceTaskCode ? operationMaintenanceTaskCode : '';
            }
            
            //保存数据
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall",
                serviceName: "operationMaintenance",
                methodName: "insertOrUpdateWaterQuality",
                data: {
                    ticket: $.page.ticket,
                    mEntity: {
                        operationMaintenanceTaskCode: operationMaintenanceTaskCode,
                        water_COD: mini.get("water_COD").getValue(),
                        water_BOD: mini.get("water_BOD").getValue(),
                        water_TP: mini.get("water_TP").getValue(),
                        water_TN: mini.get("water_TN").getValue(),
                        water_SS: mini.get("water_SS").getValue(),
                        water_NH34: mini.get("water_NH34").getValue()
                    }
                },
                beforeSend: function () {
                },
                success: function (resultData) {
                    //判断查询信息成功
                    if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                        mini.alert("保存成功！");
                        CloseWindow("ok");
                    }
                },
                complete: function () {
                }
            }));
        } else {
            mini.alert('请选择净化槽编号')
        }
    })
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