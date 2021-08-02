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
//#endregion

//查询条件
var conditionData = undefined;

//#region 行选择改变时
function datagrid1_SelectionChanged(e) {
    var childControls = mini.getChildControls($.page.idJQ.functionList[0]);
    for (var i = 0; i < childControls.length; i++) {
        var isEnabled = true;
        if (fw.fwObject.FWObjectHelper.hasValue(childControls[i].minSelectedCount)) {
            if (isEnabled && childControls[i].minSelectedCount <= e.selecteds.length) {
                isEnabled = true;
            } else {
                isEnabled = false;
            };
        };
        if (fw.fwObject.FWObjectHelper.hasValue(childControls[i].maxSelectedCount)) {
            if (isEnabled && e.selecteds.length <= childControls[i].minSelectedCount) {
                isEnabled = true;
            } else {
                isEnabled = false;
            };
        };
        childControls[i].set({ enabled: isEnabled });
    };
    if (e.selected) {
        $.page.idM.timeTaskGrid.lastSelectedRowIndex = $.page.idM.timeTaskGrid.indexOf(e.selected);
    };
};
//#endregion

//#region 页面加载
$.page.pageLoad = function () {
    //设置默认查询参数
    $.page.idM.keyword.setValue($.page.params.keyword);
    //开始查询
    onSearch();
};
//#endregion

//#region 如果选择的数量大于2时，不能修改
function timeTaskChange() {
    var row = $.page.idM.timeTaskGrid.getSelecteds();
    if (row.length > 1) {
        $.page.idM.buttonEidt.disable();
    } else {
        $.page.idM.buttonEidt.enable();
    }
}
//#endregion

//#region 查询事务
function onSearch() {
    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();
    conditionData.mTimingTypeCode == "null" ? conditionData.mTimingTypeCode = "" : "";
    conditionData.mTaskTypeCode == "null" ? conditionData.mTaskTypeCode = "" : "";

    //datagrid加载数据
    timeTaskGrid_Load(1);
};
//#endregion

//#region 数据加载前包括（页数发生变化时）
function timeTaskGrid_BeforeLoad(e) {
    //取消datagrid的miniui自动加载
    e.cancel = true;
    //miniui的页数与实际相差1页
    var pageIndex = e.data.pageIndex + 1;
    var pageSize = e.data.pageSize;
    //datagrid加载数据
    timeTaskGrid_Load(pageIndex, pageSize);
};
//#endregion

//#region 单元格渲染事件
function timeTaskGrid_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "mTimingTypeCode":
            if (fw.fwObject.FWObjectHelper.hasValue(e.value)) {
                switch (e.value) {
                    case fw.fwData.FWTimingType.Timing.toString(): html = "定时执行"; break;
                    case fw.fwData.FWTimingType.Interval.toString(): html = "间隔执行"; break;
                    case fw.fwData.FWTimingType.Week.toString(): html = "每周一次"; break;
                    case fw.fwData.FWTimingType.Year.toString(): html = "每年一次"; break;
                    case fw.fwData.FWTimingType.Month.toString(): html = "每月一次"; break;
                    case fw.fwData.FWTimingType.Day.toString(): html = "每日一次"; break;
                    case fw.fwData.FWTimingType.Hour.toString(): html = "每小时一次"; break;
                }
            }
            break;
        case "mTaskTypeCode":
            if (fw.fwObject.FWObjectHelper.hasValue(e.value)) {
                switch (e.value) {
                    case fw.fwData.FWTaskType.Dll.toString(): html = "执行DLL动态方法"; break;
                    case fw.fwData.FWTaskType.Url.toString(): html = "执行调用URL"; break;
                    case fw.fwData.FWTaskType.Sql.toString(): html = "执行SQL语句"; break;
                }
            }
            break; ;
        case "mLastSuccessExecuteTime":
            html = (fw.fwObject.FWObjectHelper.hasValue(e.value)) ? fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(e.value)) : "--";
            break;
        case "mTimingTime":
            html = (fw.fwObject.FWObjectHelper.hasValue(e.value)) ? fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(e.value)) : "--";
            break;
        case "mIsDis":
            html = (fw.fwObject.FWObjectHelper.hasValue(e.value) && e.value == 1) ? "<label style=\"color:Red\">已停用</label>" : "<label style=\"color:Green\">已启用</label>";
            break;
        case "mTimingTaskName":
            html = "<a href=\"javascript:openInfo('query','" + e.record.mTimingTaskCode + "')\" >" + e.cellHtml + "</a>";
            break;
        default:
            break;
    };
    return html;
};
//#endregion

//#region timeTaskGrid数据加载
function timeTaskGrid_Load(pageIndex, pageSize) {
    //如果没传入页数
    if (!fw.fwObject.FWObjectHelper.hasValue(pageIndex)) {
        //将页数设置为datagrid的页数
        pageIndex = $.page.idM.timeTaskGrid.pageIndex;
    };
    //如果没传入分页大小
    if (!fw.fwObject.FWObjectHelper.hasValue(pageSize)) {
        //将分页大小设置为datagrid的分页大小
        pageSize = $.page.idM.timeTaskGrid.pageSize;
    };
    //排序字段
    var sortFieldList = null;
    //如果datagrid设置有排序字段
    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.timeTaskGrid.sortField)) {
        //将排序字段设置为datagrid的排序字段
        sortFieldList = [{
            fieldName: $.page.idM.timeTaskGrid.getSortField()
            , sortType: fw.fwData.FWSortType[$.page.idM.timeTaskGrid.getSortOrder()]
        }];
    };
    //开启datagrid数据加载锁屏
    //  $.page.idM.timeTaskGrid.loading();
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
            , serviceName: "sysManage"
            , methodName: "queryPageMFWTimingTask"
            , data: {
                ticket: $.page.ticket
                , pageParams: {
                    pageSize: pageSize
                    , pageIndex: pageIndex
                    , sortFieldList: sortFieldList
                }
                , queryParams: conditionData
            }
            , success: function (resultData) {
                //判断加载数据成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                    //显示执行时间
                    for (var i = 0; i < resultData.data.entityList.length; i++) {
                        var dataRows = resultData.data.entityList[i];
                        var thisdate = "";
                        var mTimingTime = mini.parseDate(dataRows.mTimingTime); //转时间对象
                        switch (dataRows.mTimingTypeCode) {
                            case fw.fwData.FWTimingType.Year.toString():
                                thisdate += "每年 "; //
                                thisdate += mini.formatDate(mTimingTime, "MM月dd日 HH时mm分ss秒");
                                break;
                            case fw.fwData.FWTimingType.Month.toString():
                                thisdate += "每月 "; //
                                thisdate += mini.formatDate(mTimingTime, "dd日 HH时mm分ss秒");
                                break;
                            case fw.fwData.FWTimingType.Week.toString():
                                thisdate += "每周 "; //
                                switch (mini.formatDate(mTimingTime, "dd")) {
                                    case "01":
                                        thisdate += "星期一 ";
                                        break;
                                    case "02":
                                        thisdate += "星期二 ";
                                        break;
                                    case "03":
                                        thisdate += "星期三 ";
                                        break;
                                    case "04":
                                        thisdate += "星期四 ";
                                        break;
                                    case "05":
                                        thisdate += "星期五 ";
                                        break;
                                    case "06":
                                        thisdate += "星期六 ";
                                        break;
                                    case "07":
                                        thisdate += "星期日 ";
                                        break;
                                    default:
                                        break;
                                }
                                thisdate += mini.formatDate(mTimingTime, "HH时mm分ss秒");
                                break;
                            case fw.fwData.FWTimingType.Day.toString():
                                thisdate += "每日 "; //
                                thisdate += mini.formatDate(mTimingTime, "HH时mm分ss秒");
                                break;
                            case fw.fwData.FWTimingType.Hour.toString():
                                thisdate += "每小时 "; //
                                thisdate += mini.formatDate(mTimingTime, "mm分ss秒");
                                break;
                            case fw.fwData.FWTimingType.Timing.toString():
                                thisdate += "将在 "; //
                                thisdate += mini.formatDate(mTimingTime, "yyyy年MM月dd日 HH时mm分ss秒");
                                break;
                            case fw.fwData.FWTimingType.Interval.toString():
                                var mTiming = dataRows.mTimingSeconds;
                                thisdate += "每 "; //
                                if (mTiming < 60) {
                                    thisdate += mTiming + " 秒"
                                }
                                if (mTiming >= 60 && mTiming < 3600) {
                                    thisdate += mTiming / 60 + " 分钟"
                                }
                                if (mTiming >= 3600 && mTiming < 86400) {
                                    thisdate += mTiming / 3600 + " 小时"
                                }
                                if (mTiming >= 86400 && mTiming < 2678400) {
                                    thisdate += mTiming / 86400 + " 天"
                                }
                                if (mTiming >= 2678400) {
                                    thisdate += mTiming / 2678400 + " 月"
                                }
                                break;
                            default:
                                thisdate = "无此类型:" + dataRows.mTimingTypeCode;
                                break;
                        }
                        thisdate += " 执行一次"; //
                        resultData.data.entityList[i].mTimingTime = thisdate;
                    }

                    //设置datagrid数据
                    $.page.idM.timeTaskGrid.set({
                        pageIndex: resultData.data.pageIndex - 1
                        , pageSize: resultData.data.pageSize
                        , totalCount: resultData.data.recordCount
                        , data: resultData.data.entityList
                    });
                    //默认选中第一行
                    if ($.page.idM.timeTaskGrid.data.length > 0) {
                        if (!$.page.idM.timeTaskGrid.lastSelectedRowIndex) {
                            $.page.idM.timeTaskGrid.lastSelectedRowIndex = -1;
                        };
                        if ($.page.idM.timeTaskGrid.lastSelectedRowIndex > $.page.idM.timeTaskGrid.data.length - 1) {
                            $.page.idM.timeTaskGrid.lastSelectedRowIndex = $.page.idM.timeTaskGrid.data.length - 1;
                        } else if ($.page.idM.timeTaskGrid.lastSelectedRowIndex < 0) {
                            $.page.idM.timeTaskGrid.lastSelectedRowIndex = 0;
                        };
                        $.page.idM.timeTaskGrid.select($.page.idM.timeTaskGrid.getRow($.page.idM.timeTaskGrid.lastSelectedRowIndex));
                    } else {
                        datagrid1_SelectionChanged({ selected: undefined, selecteds: [] });
                    };
                };
            }
    }));
};
//#endregion

//#region 打开新增、编辑窗口
function openInfo(action, mTimingTaskCode) {
    var isOpen = true;
    var data = {
        ticket: $.page.ticket
        , action: action
    };

    if (fw.fwObject.FWObjectHelper.hasValue(mTimingTaskCode)) {
        data.mTimingTaskCode = mTimingTaskCode;
    } else {
        //判断是修改或者是查看信息
        if (action == "update" || action == "query") {
            //获取选中项编码
            mTimingTaskCode = getMTimingTaskCode();
            //判断选中了项
            if (mTimingTaskCode && fw.fwObject.FWObjectHelper.hasValue(mTimingTaskCode)) {
                data.mTimingTaskCode = mTimingTaskCode;
            } else {
                isOpen = false;
            };
        } else {
            //判断不是新增
            if (action != "insert") {
                isOpen = false;
            };
        };
    };

    //判断满足条件打开窗口
    if (isOpen) {
        //获得传入的参数字符串 
        var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwTimingTask.htm", $.page.webSiteRootUrl), data); 
        //打开窗口
        mini.open({
            url: pageUrl
            , title: "任务信息"
            , width: 704
            , height: 600
            , allowResize: false
            , onload: function () {
                //var iframe = this.getIFrameEl();
                //iframe.contentWindow;
            }
            , ondestroy: function (action) {
                //判断非（关闭和取消）窗口
                if (action != "close" && action != "cancel") {
                    //datagrid加载数据
                    timeTaskGrid_Load();
                };
            }
        });
    };
}
//#endregion

//#region 删除定时任务的代码
function deleteMTimingTaskCode() {
    //获得选中项编码集合
    var mTimingTaskCodeList = [];
    if (!fw.fwObject.FWObjectHelper.hasValue(mTimingTaskCodeList)) {
        mTimingTaskCodeList = getMTimingTaskCodeList();
    };
    mini.confirm("确定删除任务？", "确定？",
            function (action) {
                if (action == "ok") {
                    //删除
                    $.page.ajax($.page.getAjaxSettings({
                        serviceType: "crossDomainCall"
                        , serviceName: "sysManage"
                        , methodName: "deleteMFWTimingTaskByMTimingTaskCodeList"
                        , data: {
                            ticket: $.page.ticket
                            , mTimingTaskCodeList: mTimingTaskCodeList
                        }
                        , success: function (resultData) {
                            //判断删除成功
                            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                                //datagrid加载数据
                                timeTaskGrid_Load(1);
                            };
                        }
                    }));
                };
            }
        );
}

//#endregion

//#region 获取选中项编码
function getMTimingTaskCode() {
    var mTimingTaskCode = undefined;
    var entityList = $.page.idM.timeTaskGrid.getSelecteds();
    if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
        if (entityList.length == 1) {
            mTimingTaskCode = entityList[0].mTimingTaskCode;
        } else {
            mini.alert("请选择一项进行操作！");
        };
    };
    return mTimingTaskCode;
};
//#endregion

//#region 获得选中项编码集合
function getMTimingTaskCodeList() {
    var mTimingTaskCodeList = undefined;
    //获取选中项对象集合
    var entityList = $.page.idM.timeTaskGrid.getSelecteds();
    //判断对象集合有值
    if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
        mTimingTaskCodeList = [];
        for (var i = 0; i < entityList.length; i++) {
            mTimingTaskCodeList.push(entityList[i].mTimingTaskCode);
        };
    };
    return mTimingTaskCodeList;
};
//#endregion
