//页面加载
$.page.pageLoad = function () {

    //判断传入ip地址
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.id)) {
        //查询信息
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "basicInfo"
            , methodName: "queryPageCamera"
            , data: {
                ticket: $.page.ticket
                , pageParams: {
                    pageSize: fw.fwNumber.intMaxValue
                    , pageIndex: 1
                    , sortFieldList: null
                }
                , queryParams: { id: $.page.params.id }
            }
            , success: function (resultData) {
                //判断查询信息成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                    var entity = resultData.data.entityList[0];
                    //设置表单值
                    $.page.idM.editform.setData(entity);
                } else {
                    mini.alert("该数据不存在！");
                };
            }
        }));
    };
};


//插入或者更新
function onInsertOrUpdate() {
    //表单验证
    $.page.idM.editform.validate();
    //判断表单验证不成功
    if ($.page.idM.editform.isValid() == false) { return; };
    //获取表单数据
    var data = fw.fwObject.FWObjectHelper.emptyToNull($.page.idM.editform.getData());
    //设置编码
    if ($.page.params.id == undefined) {
        data.id = -1;
    } else {
        data.id = $.page.params.id;
    }

    //插入或者更新
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "basicInfo"
        , methodName: "insertOrUpdateCaremaById"
        , data: {
            ticket: $.page.ticket
            , mEntity: data
        }
        , beforeSend: function () {
            fw.fwButton.fwButtonHelper.addWait($.page.idM.insertOrUpdate);
        }
        , success: function (resultData) {
            //判断插入或者更新成功
            if (resultData.status == fw.fwData.FWResultStatus.Success) {
                mini.alert("保存成功！", undefined, function () {
                    CloseWindow("insertOrUpdate"); //关闭窗口
                });
            } else {
                mini.alert("保存失败！");
            };
        }
        , complete: function () {
            fw.fwButton.fwButtonHelper.removeWait($.page.idM.insertOrUpdate);
        }
    }));
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
