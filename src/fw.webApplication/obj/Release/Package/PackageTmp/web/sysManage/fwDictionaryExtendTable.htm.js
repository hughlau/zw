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

    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "getDictionaryMFWDictionaryExtendTableColumnByMDictionaryTypeCode"
        , data: {
            ticket: $.page.ticket
            , mDictionaryTypeCode: mDictionaryTypeCode
        }
        , success: function (resultData) {
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                for (var i = 0; i < resultData.data.length; i++) {
                    var entity = resultData.data[i];
                    var html = '';
                    html += '<tr>';
                    html += '    <td>' + entity.mColumnChineseName + '</td>';
                    html += '    <td>';
                    var classValue = "";
                    var attrHtml = "";
                    var requiredValue = fw.fwNumber.FWNumberHelper.toBoolean(entity.mIsNull) ? "true" : "false";

                    //                    if (entity.mColumnType == fw.fwData.FWDataType.Int16) {
                    //                        classValue = "mini-spinner";
                    //                        attrHtml = 'minValue="-32768" maxValue="32768"';
                    //                    } else if (entity.mColumnType == fw.fwData.FWDataType.Int32) {
                    //                        classValue = "mini-spinner";
                    //                        attrHtml = 'minValue="-2147483648" maxValue="2147483648"';
                    //                    } else if (entity.mColumnType == fw.fwData.FWDataType.Int64) {
                    //                        classValue = "mini-spinner";
                    //                        attrHtml = 'minValue="-9223372036854775808" maxValue="9223372036854775808"';
                    //                    } else if (entity.mColumnType == fw.fwData.FWDataType.Double) {
                    //                        classValue = "mini-spinner";
                    //                        attrHtml = 'minValue="-9223372036854775808" maxValue="9223372036854775808"';
                    //                    } else if (entity.mColumnType == fw.fwData.FWDataType.Decimal) {
                    //                        classValue = "mini-spinner";
                    //                        attrHtml = 'minValue="-9223372036854775808" maxValue="9223372036854775808"';
                    //                    } else if (entity.mColumnType == fw.fwData.FWDataType.Boolean) {
                    //                        classValue = "mini-checkbox";
                    //                    } else if (entity.mColumnType == fw.fwData.FWDataType.DateTime) {
                    //                        classValue = "mini-datepicker";
                    //                    } else if (entity.mColumnType == fw.fwData.FWDataType.String) {
                    //                        classValue = "mini-textbox";
                    //                    };

                    switch (entity.mColumnType) {
                        case fw.fwData.FWDataType.Int16:
                            classValue = "mini-spinner";
                            attrHtml = 'minValue="-32768" maxValue="32768"';
                            break;
                        case fw.fwData.FWDataType.Int32:
                            classValue = "mini-spinner";
                            attrHtml = 'minValue="-2147483648" maxValue="2147483648"';
                            break;
                        case fw.fwData.FWDataType.Int64:
                            classValue = "mini-spinner";
                            attrHtml = 'minValue="-9223372036854775808" maxValue="9223372036854775808"';
                            break;
                        case fw.fwData.FWDataType.Boolean:
                            classValue = "mini-checkbox";
                            break;
                        case fw.fwData.FWDataType.DateTime:
                            classValue = "mini-datepicker";
                            break;
                        default:
                            classValue = "mini-textbox";
                            break;
                    };

                    html += '        <input name="' + entity.mColumnName + '" class="' + classValue + '" ' + attrHtml + ' selectonfocus="true" required="' + requiredValue + '" style="width: 90%;" />';
                    html += '    </td>';
                    html += '</tr>';
                    $.page.idJQ.trAppendTo = $(html).insertAfter($.page.idJQ.trAppendTo);
                };
                mini.parse();
                //判断传入编码
                if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mDataID)) {
                    //查询信息
                    query($.page.params.mDataID);
                };
            };
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

//查询信息
function query(mDataID) {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue(mDataID)) {
        //查询信息
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "sysManage"
            , methodName: "queryMFWDictionaryExtendTableByMDataID"
            , data: {
                ticket: $.page.ticket
                , mDataID: mDataID
            }
            , success: function (resultData) {
                //判断查询信息成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                    resultData.data = fw.fwDataTable.FWDataTableHelper.toEntityList(resultData.data);
                    if (resultData.data != null && resultData.data.length > 0) {
                        var entity = resultData.data[0];
                        //设置表单值
                        $.page.idM.editform.setData(entity);
                        mDictionaryTypeCode = entity.mDictionaryTypeCode;
                        mPCode = entity.mPCode;
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
function insertOrUpdate() {
    //表单验证
    $.page.idM.editform.validate();
    //判断表单验证不成功
    if ($.page.idM.editform.isValid() == false) { return; };
    //获取表单数据
    var data = fw.fwObject.FWObjectHelper.emptyToNull($.page.idM.editform.getData());
    //设置编码
    data.mDictionaryTypeCode = mDictionaryTypeCode;
    data.mPCode = mPCode;
    data.mDataID = $.page.params.mDataID;
    //插入或者更新
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
            , serviceName: "sysManage"
            , methodName: "insertOrUpdateMFWDictionaryExtendTableByMDataID"
            , data: {
                ticket: $.page.ticket
                , fwDataTable: fw.fwDataTable.FWDataTableHelper.toFWDataTable(data)
            }
            , beforeSend: function () {
                fw.fwButton.fwButtonHelper.addWait($.page.idM.insertOrUpdate);
            }
            , success: function (resultData) {
                //判断插入或者更新成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                    //关闭窗口
                    CloseWindow("insertOrUpdate");
                } else {
                    mini.alert("保存失败！");
                };
            }
            , complete: function () {
                fw.fwButton.fwButtonHelper.removeWait($.page.idM.insertOrUpdate);
            }
    }));
};
