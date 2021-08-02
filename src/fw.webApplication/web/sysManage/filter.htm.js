//页面初始化
$.page.pageInit = function () {
    //        $.page.dataSourceSettingsDictionary = {
    //            "mDeviceTypeCode": {
    //                dataSourceName: "sysManage.getDictionaryMFWDeviceType"
    //            , dataSourceParams: {}
    //            }
    //        };
    $.page._dataSourceDictionary["FWNumberConditionType"] = [
        { "code": "1", "pCode": "FWNumberConditionType", "name": "等于", "ix": "1" }
        , { "code": "2", "pCode": "FWNumberConditionType", "name": "不等于", "ix": "2" }
        , { "code": "3", "pCode": "FWNumberConditionType", "name": "大于", "ix": "3" }
        , { "code": "4", "pCode": "FWNumberConditionType", "name": "大于或等于", "ix": "4" }
        , { "code": "5", "pCode": "FWNumberConditionType", "name": "小于", "ix": "5" }
        , { "code": "6", "pCode": "FWNumberConditionType", "name": "小于或等于", "ix": "6" }
    ];
    $.page._dataSourceDictionary["FWStringConditionType"] = [
        { "code": "1", "pCode": "FWStringConditionType", "name": "等于", "ix": "1" }
        , { "code": "2", "pCode": "FWStringConditionType", "name": "不等于", "ix": "2" }
        , { "code": "3", "pCode": "FWStringConditionType", "name": "开头是", "ix": "3" }
        , { "code": "4", "pCode": "FWStringConditionType", "name": "结尾是", "ix": "4" }
        , { "code": "5", "pCode": "FWStringConditionType", "name": "包含", "ix": "5" }
        , { "code": "6", "pCode": "FWStringConditionType", "name": "不包含", "ix": "6" }
    ];
    $.page._dataSourceDictionary["FWConditionRelationType"] = [
        { "code": "0", "pCode": "FWConditionRelationType", "name": "与", "ix": "1" }
        , { "code": "1", "pCode": "FWConditionRelationType", "name": "或", "ix": "2" }
    ];
};

//页面加载
$.page.pageLoad = function () {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.dataType)) {
        $.page.params.filterData = fw.fwJson.FWJsonHelper.deserializeObject($.page.params.filterDataJson);
        if (!fw.fwObject.FWObjectHelper.hasValue($.page.params.filterData)) {
            $.page.params.filterData = {
                conditionRelationTypeCode: 0
            };
        };
        switch ($.page.params.dataType) {
            case "number":
                $.page.idM.numberCondition0TypeCode.setData($.page._dataSourceDictionary["FWNumberConditionType"]);
                $.page.idM.numberConditionRelationTypeCode.setData($.page._dataSourceDictionary["FWConditionRelationType"]);
                $.page.idM.numberCondition1TypeCode.setData($.page._dataSourceDictionary["FWNumberConditionType"]);
                if (fw.fwObject.FWObjectHelper.hasValue($.page.params.format)) {
                    $.page.idM.numberCondition0Value.setFormat($.page.params.format);
                    $.page.idM.numberCondition1Value.setFormat($.page.params.format);
                };
                if (fw.fwObject.FWObjectHelper.hasValue($.page.params.minValue)) {
                    $.page.idM.numberCondition0Value.setMinValue($.page.params.minValue);
                    $.page.idM.numberCondition1Value.setMinValue($.page.params.minValue);
                };
                if (fw.fwObject.FWObjectHelper.hasValue($.page.params.maxValue)) {
                    $.page.idM.numberCondition0Value.setMaxValue($.page.params.maxValue);
                    $.page.idM.numberCondition1Value.setMaxValue($.page.params.maxValue);
                };
                if (fw.fwObject.FWObjectHelper.hasValue($.page.params.increment)) {
                    $.page.idM.numberCondition0Value.setIncrement($.page.params.increment);
                    $.page.idM.numberCondition1Value.setIncrement($.page.params.increment);
                };
                $.page.idM.numberEditform.setData($.page.params.filterData);
                $.page.idJQ.fieldsetNumber.show();
                break;
            case "date":
                $.page.idM.dateCondition0TypeCode.setData($.page._dataSourceDictionary["FWNumberConditionType"]);
                $.page.idM.dateConditionRelationTypeCode.setData($.page._dataSourceDictionary["FWConditionRelationType"]);
                $.page.idM.dateCondition1TypeCode.setData($.page._dataSourceDictionary["FWNumberConditionType"]);
                if (fw.fwObject.FWObjectHelper.hasValue($.page.params.format)) {
                    $.page.idM.dateCondition0Value.setFormat($.page.params.format);
                    $.page.idM.dateCondition1Value.setFormat($.page.params.format);
                };
                if (fw.fwObject.FWObjectHelper.hasValue($.page.params.showTime)) {
                    $.page.idM.dateCondition0Value.setShowTime($.page.params.showTime);
                    $.page.idM.dateCondition1Value.setShowTime($.page.params.showTime);
                };
                if (fw.fwObject.FWObjectHelper.hasValue($.page.params.timeFormat)) {
                    $.page.idM.dateCondition0Value.setTimeFormat($.page.params.timeFormat);
                    $.page.idM.dateCondition1Value.setTimeFormat($.page.params.timeFormat);
                };
                $.page.idM.dateEditform.setData($.page.params.filterData);
                $.page.idJQ.fieldsetDate.show();
                break;
            default:
                $.page.idM.stringCondition0TypeCode.setData($.page._dataSourceDictionary["FWStringConditionType"]);
                $.page.idM.stringConditionRelationTypeCode.setData($.page._dataSourceDictionary["FWConditionRelationType"]);
                $.page.idM.stringCondition1TypeCode.setData($.page._dataSourceDictionary["FWStringConditionType"]);
                $.page.idM.stringEditform.setData($.page.params.filterData);
                $.page.idJQ.fieldsetString.show();
                break;
        };
    };
};

//插入或者更新
function enter() {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.enterCallback) && fw.fwObject.FWObjectHelper.hasValue($.page.params.dataType)) {
        var filterData = null;
        switch ($.page.params.dataType) {
            case "number":
                //表单验证
                $.page.idM.numberEditform.validate();
                //判断表单验证不成功
                if ($.page.idM.numberEditform.isValid() == false) { return; };
                //获取表单数据
                filterData = fw.fwObject.FWObjectHelper.emptyToNull($.page.idM.numberEditform.getData());
                break;
            case "date":
                //表单验证
                $.page.idM.dateEditform.validate();
                //判断表单验证不成功
                if ($.page.idM.dateEditform.isValid() == false) { return; };
                filterData = fw.fwObject.FWObjectHelper.emptyToNull($.page.idM.dateEditform.getData());
                break;
            default:
                //表单验证
                $.page.idM.stringEditform.validate();
                //判断表单验证不成功
                if ($.page.idM.stringEditform.isValid() == false) { return; };
                filterData = fw.fwObject.FWObjectHelper.emptyToNull($.page.idM.stringEditform.getData());
                break;
        };
        //判断选中项对象有值
        if (fw.fwObject.FWObjectHelper.hasValue(filterData)) {
            //调用回调方法
            fw.callFunction(fw.openWindow(), $.page.params.enterCallback, [filterData]);
            //关闭窗口
            fw.closeWindow();
        };
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