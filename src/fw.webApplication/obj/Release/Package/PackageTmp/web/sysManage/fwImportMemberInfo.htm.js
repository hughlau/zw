//页面初始化
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
        "mMapTableName": {
            dataSourceName: "sysManage.queryMFWImportModelList"
            , dataSourceParams: {}
        }
    };
};

//查询条件
var conditionData = undefined;
var modelID = undefined;
var mDataID = undefined;
//页面加载
$.page.pageLoad = function () {
    //新增 
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mDataID)) {
        mDataID = $.page.params.mDataID;
    }
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.action)) {
        if ($.page.params.action == "insert") {
            //数据加载 URL
            var entity = {
                mFieldName: $.page.params.mFieldName,
                mMapFieldType: $.page.params.mMapFieldType,
                mNumbers: $.page.params.mNumbers,
                mIsNull: $.page.params.mIsNull
            };
            modelID = $.page.params.mModelID;
            $.page.idM.editform.setData(entity);
        } else if ($.page.params.action == "update") {
            if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mDataID)) {
                //查询信息
                query($.page.params.mDataID);
            };
        };
    };
};

function onTableChanged() {
    var tableName = $.page.idM.mMapTableName.getText();
    $.page.idM.mMapFiledName.setValue("");
    if (!fw.fwObject.FWObjectHelper.hasValue(tableName)) {
        //无表名 字段不加载
        $.page.idM.mMapFiledName.setData();
        return;
    };
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "getMSysColumnList"
        , data: {
            ticket: $.page.ticket
            , mTableName: tableName
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                $.page.idM.mMapFiledName.setData(resultData.data);
                //$.page.idM.mMapFiledName.select(0);

            };
        }
    }));

};

//查询实体信息
function query(mDataID) {
    if (fw.fwObject.FWObjectHelper.hasValue(mDataID)) {
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall",
            serviceName: "sysManage",
            methodName: "queryMFWImportMemberInfo",
            data: {
                ticket: $.page.ticket,
                mDataID: mDataID
            },
            success: function (resultData) {
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {


                    modelID = resultData.data.mModelID;
                    //设置表单值
                    $.page.idM.editform.setData(resultData.data);
                    //下拉列表联动 
                    if (fw.fwObject.FWObjectHelper.hasValue(resultData.data.mMapTableName)) {
                        $.page.ajax($.page.getAjaxSettings({
                            serviceType: "crossDomainCall"
                            , serviceName: "sysManage"
                            , methodName: "getMSysColumnList"
                            , data: {
                                ticket: $.page.ticket
                                , mTableName: resultData.data.mMapTableName
                            }
                            , success: function (resultData) {
                                //判断加载数据成功
                                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                                    $.page.idM.mMapFiledName.setData(resultData.data); 

                                };
                            }
                        }));
                    };

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
function onInsertOrUpdate() {
    if (fw.fwObject.FWObjectHelper.hasValue(modelID)) {
        //表单验证
        $.page.idM.editform.validate();
        //判断表单验证不成功
        if ($.page.idM.editform.isValid() == false) { return; };
        //获取表单数据
        var data = fw.fwObject.FWObjectHelper.emptyToNull($.page.idM.editform.getData());
        data.mDataID = mDataID;
        data.mModelID = modelID;
        data.mAutoCheck = fw.fwObject.FWObjectHelper.hasValue($.page.params.action) ? data.mAutoCheck : "0";
        //插入或者更新
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall",
            serviceName: "sysManage",
            methodName: "insertOrUpdateMFWImportMemberInfoByMDataID",
            data: {
                ticket: $.page.ticket,
                mEntity: data
            },
            success: function (resultData) {
                //判断插入或者更新成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                    CloseWindow("insert");
                } else {
                    mini.alert("保存失败！");
                };
            },
            beforeSend: function () {
                fw.fwButton.fwButtonHelper.addWait($.page.idM.insertOrUpdate);
            },
            complete: function () {
                fw.fwButton.fwButtonHelper.removeWait($.page.idM.insertOrUpdate);
            }
        }));
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