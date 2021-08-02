//页面初始化
$.page.pageInit = function () {
    $.page.dataSourceSettingsDictionary = {

    };
};

var mDictionaryTypeCode = null;
var mPCode = null;

//页面加载
$.page.pageLoad = function () {
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mDictionaryTypeCode)) {
        mDictionaryTypeCode = $.page.params.mDictionaryTypeCode;
    };
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mPCode)) {
        mPCode = $.page.params.mPCode;
    };

    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mDataID)) {
        //查询信息
        query($.page.params.mDataID);
    };
};

//关闭窗口
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

//取消
function onCancel() {
    //关闭窗口
    CloseWindow("cancel");
};



//插入或者更新
function insertOrUpdate() {
    //表单验证
    $.page.idM.editform.validate();
    //判断表单验证不成功
    if ($.page.idM.editform.isValid() == false) { return; };
    //获取表单数据
    var data = fw.fwObject.FWObjectHelper.emptyToNull($.page.idM.editform.getData());
    //设置编码
    //插入或者更新
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "basicInfo"
        , methodName: "insertOrUpdateByCateCode"
        , data: {
            ticket: $.page.ticket
            , mEntity: data
        }
        , success: function (resultData) {
            //判断插入或者更新成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                mini.alert("保存成功！");
                CloseWindow("ok");
            } else {
                mini.alert("保存失败！");
            };
        }
    }));
};

