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
var operationCleanRecordCode = '';
var beforeReviewerImg='';
// 数组删除元素的方法+1
Array.prototype.remove = function (val) {
    var index = this.indexOf(val)
    if (index > -1) {
        this.splice(index, 1)
    }
}
//修改界面加载的待删除的图片
var imgDelNamearr = [];

var cateCode = '';





/* 页面加载 */
$.page.pageLoad = function () {
    
    
    divFormJQ = $.page.idM.divForm;

    $.page.idJQ.aSave.show();

    //点击保存按钮        
    $.page.idJQ.aSave.on("click", function () {

        //净化槽编码存在
        if (monitorSiteCode) {

            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall",
                serviceName: "basicInfo",
                methodName: "insertCateData",
                data: {
                    ticket: $.page.ticket,
                    mEntity: {
                        monitorSiteCode: monitorSiteCode,
                        cateCode: $.page.params.cateCode
                    }
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
                    } else if (resultData.infoList != null && resultData.infoList.length >0) {
                        mini.alert(resultData.infoList[0]);
                    }
                },
                complete: function () {
                    // $.mobile.loading('hide');
                }
            }));
            
        } else {
            mini.alert('请选择净化槽编号')
        }
    })
}



/**
* [点击提示框 弹出选择页面]
* @param  {[object]} e [函数对象]
* @return {[type]}   [没有返回值]
*/
function onButtonChooseMonitorSite(e) {
    var textMonitor = this;
    var data = { ticket: $.page.ticket, selectType: fw.fwData.FWSelectType.Single, selectCallback: "onMonitorSiteselectCallback" };
    var pageParams = { url: "web/OPTask/selectMonitorSite.htm", width: 800, height: 600, title: "设施点位" };
    $.page.openPage(data, pageParams);
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
        $("#btnChooseMonitor .mini-buttonedit-input").val(callbackData.monitorSiteName)
        $("#btnChooseMonitor .mini-buttonedit-input").attr('disabled', 'disabled');
        $.page.idM.btnChooseMonitor.validate();  //首次选择后 净化槽编码显示不能为空
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


