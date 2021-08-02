//#region 页面初始化
$.page.pageInit = function () {
    $.page.dataSourceSettingsDictionary = {
        "mTimingTypeCode": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "FWTimingType" }
        }
        , "mTaskTypeCode": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "FWTaskType" }
        }
    };
};

var timingTypeCode = "";
$.page.pageLoad = function () {
    fw.fwSelect.fwSelectHelper.bindMonth($.page.idM.selectMonth);
    fw.fwSelect.fwSelectHelper.bindWeek($.page.idM.selectWeek);
    fw.fwSelect.fwSelectHelper.bindDay($.page.idM.selectDay);
    fw.fwSelect.fwSelectHelper.bindHour($.page.idM.selectHour);
    fw.fwSelect.fwSelectHelper.bindMinute($.page.idM.selectMinute);
    fw.fwSelect.fwSelectHelper.bindSecond($.page.idM.selectSecond);

    timingTypeSelectAllDisplay();

    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mTimingTaskCode)) {
        //查询信息
        query($.page.params.mTimingTaskCode);
    } else {
        $.page.idM.mTaskTypeCode.setValue(fw.fwData.FWTaskType.Dll.toString());
        $.page.idM.mTaskTypeCode.doValueChanged();
        $.page.idM.mTimingTypeCode.setValue(fw.fwData.FWTimingType.Year.toString());
        $.page.idM.mTimingTypeCode.doValueChanged();
    };
};
//#endregion 

//#region 测试方法
function test() {
    $.page.idM.editform.validate();
    //判断表单验证不成功
    if ($.page.idM.editform.isValid() == false) {
        return;
    };

    //获取表单数据
    var data = fw.fwObject.FWObjectHelper.emptyToNull($.page.idM.editform.getData());

    if (data.mTaskTypeCode == fw.fwData.FWTaskType.Dll.toString()) {
        data.mTimingTaskSettings = fw.fwJson.FWJsonHelper.deserializeObject(data.mTimingTaskSettings);
        data.mTimingTaskSettings.paramsJson = fw.fwJson.FWJsonHelper.serializeObject(data.mTimingTaskSettings.params);
        delete data.mTimingTaskSettings.params;
        data.mTimingTaskSettings = fw.fwJson.FWJsonHelper.serializeObject(data.mTimingTaskSettings);
    };

    //#region 插入或者更新定时任务
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall",
        serviceName: "sysManage",
        methodName: "testMFWTimingTask",
        data: {
            ticket: $.page.ticket,
            mEntity: data
        },
        success: function (resultData) {
            //判断插入或者更新成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                mini.alert("测试成功!");
            } else {
                mini.alert("测试失败!");
            };
        },
        beforeSend: function () {
            fw.fwButton.fwButtonHelper.addWait($.page.idM.test);
        },
        complete: function () {
            fw.fwButton.fwButtonHelper.removeWait($.page.idM.test);
        }
    }));
    //#endregion
};
//#endregion

//#region 插入或者更新
function insertOrUpdate(e) {
    $.page.idM.editform.validate();
    //判断表单验证不成功
    if ($.page.idM.editform.isValid() == false) {
        return;
    };

    //获取表单数据
    var data = fw.fwObject.FWObjectHelper.emptyToNull($.page.idM.editform.getData());

    if (data.mTaskTypeCode == fw.fwData.FWTaskType.Dll.toString()) {
        data.mTimingTaskSettings = fw.fwJson.FWJsonHelper.deserializeObject(data.mTimingTaskSettings);
        data.mTimingTaskSettings.paramsJson = fw.fwJson.FWJsonHelper.serializeObject(data.mTimingTaskSettings.params);
        delete data.mTimingTaskSettings.params;
        data.mTimingTaskSettings = fw.fwJson.FWJsonHelper.serializeObject(data.mTimingTaskSettings);
    };

    //#region 判断执行时间的类型，然后排列成数据传给数据库,因为要把周的数放在日期的位置，所以需要判断是否是周，如果不是周，就直接取下拉框中的日数据，如果是周，就取周下拉框的数据
    var dataDay = "", IsDefault = true;
    switch ($.page.idM.mTimingTypeCode.value) {
        case fw.fwData.FWTimingType.Year.toString():
            break;
        case fw.fwData.FWTimingType.Month.toString():
            break;
        case fw.fwData.FWTimingType.Day.toString():
            break;
        case fw.fwData.FWTimingType.Hour.toString():
            break;
        case fw.fwData.FWTimingType.Timing.toString():
            IsDefault = false;
            break;
        case fw.fwData.FWTimingType.Week.toString():
            $.page.idM.mTimingTypeCode.value != fw.fwData.FWTimingType.Week.toString() ? (dataDay = $.page.idM.selectDay.value) : (dataDay = $.page.idM.selectWeek.value);
            data.mTimingTime = "2014-"
                             + $.page.idM.selectMonth.value + "-"
                             + dataDay + " "
                             + $.page.idM.selectHour.value + ":"
                             + $.page.idM.selectMinute.value + ":"
                             + $.page.idM.selectSecond.value;
            IsDefault = false;
            break;
        default:
            break;
    }

    if (IsDefault) {
        data.mTimingTime = fw.fwObject.FWObjectHelper.toDateTime("2014-" + data.selectMonth + "-" + data.selectDay + " " + data.selectHour + ":" + data.selectMinute + ":" + data.selectSecond);
    };
    //#endregion

    data.mTimingTaskCode = $.page.params.mTimingTaskCode;
    data.mIsDis = parseInt(data.mIsDis);
    data.mLastSuccessExecuteTime = mini.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss");

    //#region 插入或者更新定时任务
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall",
        serviceName: "sysManage",
        methodName: "insertOrUpdateMFWTimingTaskByMTimingTaskCode",
        data: {
            ticket: $.page.ticket,
            mEntity: data
        },
        success: function (resultData) {
            //判断插入或者更新成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                //关闭窗口

                // $.page.idM.btnSave.enable();
                // $.page.idM.btnCancel.enable();
                //关闭窗口
                CloseWindow("insertOrUpdate");

            } else {
                mini.alert("保存失败!");
                CloseWindow("close");
            };
        },
        beforeSend: function () {
            fw.fwButton.fwButtonHelper.addWait($.page.idM.insertOrUpdate);
        },
        complete: function () {
            fw.fwButton.fwButtonHelper.removeWait($.page.idM.insertOrUpdate);
        }
    }));
    //#endregion
};
//#endregion

//#region divTimingType1，divTimingType2，divTimingType3中的所有控件不显示
function timingTypeSelectAllDisplay() {
    $.page.idJQ.divTimingType1.hide();
    $.page.idJQ.divTimingType2.hide();
    $.page.idJQ.divTimingType3.hide();
};
//#endregion

//#region 任务类型变化时
function mTaskTypeCode_onvaluechanged(e) {
    var taskEntry = "";
    var timingTaskSettingsString = "";
    switch (e.value) {
        case fw.fwData.FWTaskType.Dll.toString():
            taskEntry = "程序集名称";
            timingTaskSettingsString = fw.fwJson.FWJsonHelper.serializeObject({
                serviceName: "",
                methodName: "",
                params: {
                    "参数1": "null",
                    "参数2": "null"
                }
            }, false, fw.fwJson.FWJsonHelper.JsonFormatMode.ToFormatString);
            break;
        case fw.fwData.FWTaskType.Url.toString():
            timingTaskSettingsString = fw.fwJson.FWJsonHelper.serializeObject({
                "参数1": "null",
                "参数2": "null"
            }, false, fw.fwJson.FWJsonHelper.JsonFormatMode.ToFormatString);
            break;
        case fw.fwData.FWTaskType.Sql.toString():
            taskEntry = "Data Source=;Database=;User ID=;Password=";
            break;
        default:
            break;
    }
    //如果为空才会赋值，赋值只是初始化而已，如果有值就不用赋值了
    $.page.idM.timingTaskEntry.setValue(taskEntry);
    $.page.idM.taskEntryDeploy.setValue(timingTaskSettingsString);
};
//#endregion

//#region 改变定时类型触发的函数 onTimeTypeChanged(e)
function mTimingTypeCode_onvaluechanged(e) {
    timingTypeSelectAllDisplay();
    switch (e.value) {
        case fw.fwData.FWTimingType.Year.toString():
            $.page.idJQ.divTimingType1.show();
            $.page.idM.selectMonth.show();
            $.page.idM.selectWeek.hide();
            $.page.idM.selectDay.show();
            $.page.idM.selectHour.show();
            $.page.idM.selectMinute.show();
            $.page.idM.selectSecond.show();
            break;
        case fw.fwData.FWTimingType.Month.toString():
            $.page.idJQ.divTimingType1.show();
            $.page.idM.selectMonth.hide();
            $.page.idM.selectWeek.hide();
            $.page.idM.selectDay.show();
            $.page.idM.selectHour.show();
            $.page.idM.selectMinute.show();
            $.page.idM.selectSecond.show();
            break;
        case fw.fwData.FWTimingType.Day.toString():
            $.page.idJQ.divTimingType1.show();
            $.page.idM.selectMonth.hide();
            $.page.idM.selectWeek.hide();
            $.page.idM.selectDay.hide();
            $.page.idM.selectHour.show();
            $.page.idM.selectMinute.show();
            $.page.idM.selectSecond.show();
            break;
        case fw.fwData.FWTimingType.Hour.toString():
            $.page.idJQ.divTimingType1.show();
            $.page.idM.selectMonth.hide();
            $.page.idM.selectWeek.hide();
            $.page.idM.selectDay.hide();
            $.page.idM.selectHour.hide();
            $.page.idM.selectMinute.show();
            $.page.idM.selectSecond.show();
            break;
        case fw.fwData.FWTimingType.Interval.toString():
            $.page.idJQ.divTimingType2.show();
            break;
        case fw.fwData.FWTimingType.Timing.toString():
            $.page.idJQ.divTimingType3.show();
            break;
        case fw.fwData.FWTimingType.Week.toString():
            $.page.idM.selectMonth.hide();
            $.page.idM.selectDay.hide();
            $.page.idJQ.divTimingType1.show();
            $.page.idM.selectWeek.show();
            $.page.idM.selectHour.show();
            $.page.idM.selectMinute.show();
            $.page.idM.selectSecond.show();
            break;
    };
};
//#endregion

//#region $.page.idM.textInterval.setValue
function Interval_Minute() {
    $.page.idM.textInterval.setValue(60);
}
function Interval_Hour() {
    $.page.idM.textInterval.setValue(60 * 60);
}
function Interval_Day() {
    $.page.idM.textInterval.setValue(60 * 24 * 60);
}
function Interval_Month() {
    $.page.idM.textInterval.setValue(60 * 24 * 60 * 31);
}
//#endregion

//#region 获取数据
function query(mTimingTaskCode) {
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
            , serviceName: "sysManage"
            , methodName: "queryMFWTimingTaskByMTimingTaskCode"
            , data: {
                ticket: $.page.ticket
                , mTimingTaskCode: mTimingTaskCode
            }
            , success: function (resultData) {
                //判断加载数据成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                    var entity = resultData.data;

                    entity.selectMonth = fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(entity.mTimingTime), "MM");
                    entity.selectWeek = fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(entity.mTimingTime), "dd");
                    entity.selectDay = fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(entity.mTimingTime), "dd");
                    entity.selectHour = fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(entity.mTimingTime), "HH");
                    entity.selectMinute = fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(entity.mTimingTime), "mm");
                    entity.selectSecond = fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(entity.mTimingTime), "ss");
                    entity.mTimingTime = fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(entity.mTimingTime), "yyyy-MM-dd HH:mm:ss");

                    if (entity.mTaskTypeCode == fw.fwData.FWTaskType.Dll.toString()) {
                        entity.mTimingTaskSettings = fw.fwJson.FWJsonHelper.deserializeObject(entity.mTimingTaskSettings);
                        if (fw.fwObject.FWObjectHelper.isObject(entity.mTimingTaskSettings.paramsJson)) {
                            entity.mTimingTaskSettings.params = entity.mTimingTaskSettings.paramsJson;
                        } else {
                            entity.mTimingTaskSettings.params = fw.fwJson.FWJsonHelper.deserializeObject(entity.mTimingTaskSettings.paramsJson);
                        };
                        delete entity.mTimingTaskSettings.paramsJson;
                        entity.mTimingTaskSettings = fw.fwJson.FWJsonHelper.serializeObject(entity.mTimingTaskSettings, false, fw.fwJson.FWJsonHelper.JsonFormatMode.ToFormatString);
                    };

                    $.page.idM.editform.setData(entity);
                    if (!fw.fwObject.FWObjectHelper.hasValue(entity.mTaskTypeCode)) {
                        $.page.idM.mTaskTypeCode.doValueChanged();
                    };
                    $.page.idM.mTimingTypeCode.doValueChanged();



                };
            }
    }));
}
//#endregion

//#region 关闭窗口
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
//#endregion