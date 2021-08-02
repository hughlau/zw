//页面初始化
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
        "mCTLevel": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "2" }
        }
    };

    //判断是查询还是修改
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.action) && $.page.params.action == $.enterpriseInfo.enumOperate.view) {
        insertOrUpdateJQ.destroy();
    };
};

var divFormJQ = undefined;
var mCTLevelJQ = undefined;
//页面加载
$.page.pageLoad = function () {
    divFormJQ = $.page.idM.divForm;
    var txtParentCodeJQ = $.page.idM.txtParentCode;
    var mCTLevelJQ = $.page.idM.mCTLevel;
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.parentCode)) {
        txtParentCodeJQ.setValue($.page.params.parentCode);
        mCTLevelJQ.setValue(parseInt($.page.params.cantonLevel) + 1);
    }
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.cantonCode)) {
        //查询信息
        query($.page.params.cantonCode);
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

//查询信息
function query(cantonCode) {
    //  
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue(cantonCode)) {
        //查询信息
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "sysBasicManage"
            , methodName: "query_CantonList"
            , data: {
                ticket: $.page.ticket
                , queryParams: { code: cantonCode }
            }
            , success: function (resultData) {
                //判断查询信息成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                    var entity = resultData.data[0];
                    $.page.idM.mCTLevel.setValue(entity.cantonLevel);
                    //设置表单值
                    divFormJQ.setData(entity);
                } else {
                    mini.alert("该数据不存在！", undefined, function () {
                        CloseWindow("cancel");
                    });
                };
            }
        }));
    };
};

//插入或者更新
function insertOrUpdate() {
    //表单验证
    divFormJQ.validate();
    //判断表单验证不成功
    if (divFormJQ.isValid() == false) { return; };
    //获取表单数据
    var data = fw.fwObject.FWObjectHelper.emptyToNull(divFormJQ.getData());
    //data.mCreaterID = $.page.ticket;
    //插入或者更新
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall",
        serviceName: "sysBasicManage",
        methodName: "insertOrUpdateMCantonByMCantonCode",
        data: {
            ticket: $.page.ticket,
            mEntity: data
        },
        success: function (resultData) {
            //判断插入或者更新成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                //关闭窗口
                CloseWindow("insertOrUpdate");
            } else {
                mini.alert("保存失败！");
                fw.fwButton.fwButtonHelper.removeWait($.page.idM.insertOrUpdate);
            };
        },
        beforeSend: function () {
            fw.fwButton.fwButtonHelper.addWait($.page.idM.insertOrUpdate);
        }
    }));
};