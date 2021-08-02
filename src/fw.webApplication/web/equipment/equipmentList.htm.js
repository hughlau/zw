//页面初始化
$.page.pageInit = function () {
    checkIsProjectSelected();
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
        "equipmentTypeCode": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BLL_EquipmentType" }
        },
        "equipmentStatusCode": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BLL_EquipmentStatus" }
        },
        "cantonCode": {
            dataSourceName: "sysBasicManage.getCantonDicData"
            , dataSourceParams: {pCode: window.top['cantonCodeCache']}
        }
    };
};

//查询条件
var conditionData = {};
//页面加载

$.page.pageLoad = function () {



    
    //var run_exe="<OBJECT ID=RUNIT WIDTH=0 HEIGHT=0 TYPE=application/x-oleobject";
    //run_exe += "CODEBASE=Citytech_General_CMS_V3.1.0.4.T.20160218.exe>";
    //run_exe+="</OBJECT>";
    //run_exe += "<HTML><H1>网页在下载安装支持的文件，可能需要几分钟，请耐心等待。<br>手动下载地址为：<a href='Citytech_General_CMS_V3.1.0.4.T.20160218.exe'>点击下载控件</a><br></H1></HTML>";
    //            
    //document.open();
    //document.clear();
    //document.writeln(run_exe);
    //document.close(); 


//    var entity = { "ltuMac": "1000000015",
//                "wKqbCurValue": "200",
//                "createDatetime": "/Date(1481091494628+0800)/",                
//                "byDI1": "1",
//                "byDI2": "0",
//                "byModeType":"1",                                      
//                "byDI3": "1",
//                 "byDI4":"1"
    //            };

//    var entity = { "operationMaintenanceTaskCode": "0078d360-93bd-474a-b7f3-f20e7ae076e4",
//                   "description": "aaaa200",
//                   "photoAddress": "ssss",
//                   "status": "1",
//                    "GPS": "0",
//                   
//                };

//            $.page.ajax($.page.getAjaxSettings({
//                serviceType: "crossDomainCall"
//                            , serviceName: "operationMaintenance"
//                            , methodName: "insertOrUpdateDailyMaintenanceRecord"
//                            , data: {
//                                ticket: $.page.ticket
//                               , mEntity: entity
//                            }
//                            , success: function (resultData) {
//                                //判断加载数据成功
//                                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
//                                    mini.alert("生成任务成功", "提示", function () {
//                                        onSearch();
//                                    });
//                                } else {
//                                    if (resultData.infoList != null && resultData.infoList.length > 0) {
//                                        mini.alert(resultData.infoList[0]);
//                                    };
//                                };
//                            }
//            }));

//    var entity = {

//        "operationMaintenanceTaskCode": "6f45fb62-39a7-4abd-899b-5bd5631e822d",
//        "monitorSiteCode": "07f19648-48f7-4cdb-aebb-6b7df7d91fd7",
//        "opinion": "3",
//        "rem": "3"

//    }


    //   var  staffCodeList = [];

    //   staffCodeList.push("0046F467-F5C5-4F34-B710-6AD7F804C671");
    //   staffCodeList.push("0084209B-4B7E-44B7-9167-16C58E0BA756");
    //   
    //    var siteCodeList = "[{\"operationMaintenanceTaskCode\":\"0046F467-F5C5-4F34-B710-6AD7F804C671\"},{\"operationMaintenanceTaskCode\":\"0084209B-4B7E-44B7-9167-16C58E0BA756\"}]"
//    var siteCodeList = "[{\"operationMaintenanceTaskCode\":\"31F726AA-73CF-4F51-A2D3-399290B5A1BE\"},{\"operationMaintenanceTaskCode\":\"09BBB239-D9B9-4C6D-A200-63438E89B706\"}]";
    var queryParams = {};
    queryParams.operationMaintenanceRecordCode = "10229896-2976-469f-ae76-3aaf2714a746";
//    queryParams.statusCode = "9";

    $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "operationMaintenance"
            , methodName: "queryMaintenanceRecord"
            , data: {
                ticket: $.page.ticket
                  , queryParams:queryParams

                }
            , success: function (resultdata) {
            }
    }
      ));
    //判断选择类型有值
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.selectType)) {
        if ($.page.params.selectType == fw.fwData.FWSelectType.Multi) {
            //多选
            $.page.idM.datagrid1.multiSelect = true;
        } else {
            //单选
            $.page.idM.datagrid1.multiSelect = false;
        };
        //判断选择回调有值
        if (fw.fwObject.FWObjectHelper.hasValue($.page.params.selectCallback)) {
            //显示选择按钮
            $.page.idM.select.show();
        };
        //判断选择清除有值
        if (fw.fwObject.FWObjectHelper.hasValue($.page.params.selectClearCallback)) {
            //显示清空按钮
            $.page.idM.selectClear.show();
        };
        //隐藏功能按钮
        $.page.idJQ.functionList.hide();
        $.page.idJQ.export.hide();
    };


    //开始查询
    onSearch();
    roleViewInit();
};
//用户角色页面视图处理
function roleViewInit() {
    if (!$.page.isNullOrEmpty($.page.userInfo)) {
        var roleList = $.page.userInfo.roleCodeList || [];
        if ($.page.isNullOrEmpty(roleList)) return;

        var isAdmin = $.Enumerable.From(roleList).Where("$=='sysAdminRole'").Count();
        var isManage = $.Enumerable.From(roleList).Where("$=='managerRole'").Count();
        if (isAdmin > 0) {
            //判断是否为系统管理员

        }
        else if (isManage > 0) {
            //判断是否为管理者  只查看
            $.page.idJQ.functionList.hide();
        };
    };
};
//行选择改变时
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
        $.page.idM.datagrid1.lastSelectedRowIndex = $.page.idM.datagrid1.indexOf(e.selected);
    };
};
//查询
function onSearch(cSettings) {
    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();
    conditionData.projectNo = window.top['_projectCache'];
    //datagrid加载数据
    datagrid1_Load(1, undefined, cSettings);
};

//数据加载前包括（页数发生变化时）
function datagrid1_BeforeLoad(e) {
    //取消datagrid的miniui自动加载
    e.cancel = true;
    //miniui的页数与实际相差1页
    var pageIndex = e.data.pageIndex + 1;
    var pageSize = e.data.pageSize;
    //datagrid加载数据
    datagrid1_Load(pageIndex, pageSize);
};

//单元格渲染事件
function datagrid1_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "equipmentStatusName":
            {
                var color = "black";
                switch (e.record.equipmentStatusCode) {
                    case -1: color = "red"; break;
                    case 1: color = "green"; break;
                    case 0: color = "black"; break;
                };
                html = "<label style=\"color:" + color + "\">" + e.value + "</label>";
            };
            break;
        case "createTime":
            html = $.page.hasValue(e.value) ? $.page.DTToString(e.value, $.page.dateDay) : '--';
            break;
        default:
            break;
    };
    return html;
};
//datagrid数据加载
function datagrid1_Load(pageIndex, pageSize, cSettings) {
    //如果没传入页数
    if (!fw.fwObject.FWObjectHelper.hasValue(pageIndex)) {
        //将页数设置为datagrid的页数
        pageIndex = $.page.idM.datagrid1.pageIndex;
    };
    //如果没传入分页大小
    if (!fw.fwObject.FWObjectHelper.hasValue(pageSize)) {
        //将分页大小设置为datagrid的分页大小
        pageSize = $.page.idM.datagrid1.pageSize;
    };
    if (!fw.fwObject.FWObjectHelper.hasValue(cSettings)) {
        //将分页大小设置为datagrid的分页大小
        cSettings = {
            idM: $.page.idM.datagrid1,
            isExport: false
        };
    }
    else {
        cSettings.idM = $.page.idM.datagrid1;
    };
    //排序字段
    var sortFieldList = null;
    //如果datagrid设置有排序字段
    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.datagrid1.sortField)) {
        //将排序字段设置为datagrid的排序字段
        sortFieldList = [{
            fieldName: $.page.idM.datagrid1.getSortField()
            , sortType: fw.fwData.FWSortType[$.page.idM.datagrid1.getSortOrder()]
        }];
    };
    //开启datagrid数据加载锁屏
    $.page.idM.datagrid1.loading();
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "basicInfo"
        , methodName: "queryPageEquipment"
        , data: {
            ticket: $.page.ticket
            , pageParams: {
                pageSize: fw.fwObject.FWObjectHelper.hasValue(cSettings.pageSize) ? cSettings.pageSize : pageSize
                , pageIndex: fw.fwObject.FWObjectHelper.hasValue(cSettings.pageIndex) ? cSettings.pageIndex : pageIndex
                , sortFieldList: sortFieldList
            }
            , queryParams: conditionData
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                //设置datagrid数据
                $.page.idM.datagrid1.set({
                    pageIndex: resultData.data.pageIndex - 1
                    , pageSize: resultData.data.pageSize
                    , totalCount: resultData.data.recordCount
                    , data: resultData.data.entityList
                });
                if (resultData.data.entityList == null || resultData.data.entityList.length <= 0) {
                    $.page.idJQ.export.hide();
                } else {
                    $.page.idJQ.export.show();
                };
                //默认选中第一行
                if ($.page.idM.datagrid1.data.length > 0) {
                    if (!$.page.idM.datagrid1.lastSelectedRowIndex) {
                        $.page.idM.datagrid1.lastSelectedRowIndex = -1;
                    };
                    if ($.page.idM.datagrid1.lastSelectedRowIndex > $.page.idM.datagrid1.data.length - 1) {
                        $.page.idM.datagrid1.lastSelectedRowIndex = $.page.idM.datagrid1.data.length - 1;
                    } else if ($.page.idM.datagrid1.lastSelectedRowIndex < 0) {
                        $.page.idM.datagrid1.lastSelectedRowIndex = 0;
                    };
                    $.page.idM.datagrid1.select($.page.idM.datagrid1.getRow($.page.idM.datagrid1.lastSelectedRowIndex));
                } else {
                    datagrid1_SelectionChanged({ selected: undefined, selecteds: [] });
                };
            }
            else //Roger 2016/6/1 13:00:02 增加管辖区域
            {
                var erroInfo = resultData.infoList.join("<br>");
                $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
            };
        }
    }, cSettings));
};
function onSelectionChanged() {
    var row = $.page.getSelecteds($.page.idM.datagrid1);
    if (row.length > 1) {
        $.page.idM.buttonEdit.disable();
    } else {
        $.page.idM.buttonEdit.enable();
    }
}
//打开信息窗口
function openInfo(action, equipmentCode) {
    //是否满足条件打开窗口
    var isOpen = true;
    //打开窗口传入的数据
    var data = {
        ticket: $.page.ticket
        , action: action
    };
    //判断传入了记录编码
    if (fw.fwObject.FWObjectHelper.hasValue(equipmentCode)) {
        data.equipmentCode = equipmentCode;
    } else {
        //判断是修改或者是查看信息
        if (action == "edit" || action == "query") {
            //获取选中项编码
            equipmentCode = $.page.getSelectedCode($.page.idM.datagrid1, "equipmentCode");
            //判断选中了项
            if (fw.fwObject.FWObjectHelper.hasValue(equipmentCode)) {
                data.equipmentCode = equipmentCode;
            } else {
                isOpen = false;
            };
        } else {
            //判断不是新增
            if (action != "add") {
                isOpen = false;
            };
        };
    };
    if (isOpen) {
        //获得传入的参数字符串
        var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/equipment/equipment.htm", $.page.webSiteRootUrl), data);
        //打开窗口
        mini.open({
            url: url
            , title: "设备详情"
            , width: 860
            , height: 260
            , onload: function () {
            }
            , ondestroy: function (action) {
                //判断非（关闭和取消）窗口
                if (action != "close" && action != "cancel") {
                    //datagrid加载数据
                    datagrid1_Load();
                    $.page.showTips({ content: "操作成功.", state: "success" });
                };
            }
        });
    };
};

//数据导出
function dataExport() {
    onSearch({ isExport: true, pageSize: fw.fwNumber.intMaxValue, pageIndex: 1 });
    $.page.exportFile({ idM: $.page.idM.datagrid1, reportName: '设备列表' });
};

function del() {
    var entity = $.page.getSelectedEntity($.page.idM.datagrid1);
    if (entity.equipmentStatusCode == 1) {
        $.page.showTips({ content: "启用设备不能删除！", state: "warning" });
        return;
    };
    mini.confirm("确定删除记录？", "确定？",
        function (action) {
            if (action == "ok") {
                //启用停用
                $.page.ajax($.page.getAjaxSettings({
                    serviceType: "crossDomainCall"
                    , serviceName: "basicInfo"
                    , methodName: "deleteMEquipmentByCodeList"
                    , data: {
                        ticket: $.page.ticket
                        , equipmentCodeList: [entity.equipmentCode]
                    }
                    , success: function (resultData) {
                        //判断启用停用成功
                        if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null && resultData.data == true) {
                            //datagrid加载数据
                            datagrid1_Load($.page.idM.datagrid1.pageIndex + 1);
                            $.page.showTips({ content: "删除操作成功.", state: "success" });
                        } else {
                            var erroInfo = resultData.infoList.join("<br>");
                            $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
                        };
                    }
                }));
            };
        }
    );
};
//启用停用选中项
function able(mIsDis) {
    var entity = $.page.getSelectedEntity($.page.idM.datagrid1);
    if (entity.equipmentStatusCode == 1) {
        $.page.showTips({ content: "启用设备不能执行此操作！", state: "warning" });
        return;
    };
    if (mIsDis != 1 && entity.equipmentStatusCode == 0) {
        $.page.showTips({ content: "当前设备状态已为“未启用”,操作取消！", state: "warning" });
        return;
    };
    mini.confirm("确定" + (mIsDis == 1 ? "报废" : "解除报废") + "该设备？", "确定？",
            function (action) {
                if (action == "ok") {
                    //启用停用
                    $.page.ajax($.page.getAjaxSettings({
                        serviceType: "crossDomainCall"
                        , serviceName: "basicInfo"
                        , methodName: "updateMBLLEquipmentByEquipmentCodeList"
                        , data: {
                            ticket: $.page.ticket
                            , entity: {
                                isScrap: mIsDis
                            }
                            , equipmentCodeList: [entity.equipmentCode]
                        }
                        , beforeSend: function () {
                            fw.fwButton.fwButtonHelper.addWait($.page.idM.enable);
                            fw.fwButton.fwButtonHelper.addWait($.page.idM.disable);
                        }
                        , success: function (resultData) {
                            //判断启用停用成功
                            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null && resultData.data == true) {
                                //datagrid加载数据
                                datagrid1_Load($.page.idM.datagrid1.pageIndex + 1);
                                $.page.showTips({ content: "操作成功.", state: "success" });
                            } else {
                                var erroInfo = resultData.infoList.join("<br>");
                                $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
                            };
                        }
                        , complete: function () {
                            fw.fwButton.fwButtonHelper.removeWait($.page.idM.enable);
                            fw.fwButton.fwButtonHelper.removeWait($.page.idM.disable);
                        }
                    }));
                };
            }
        );
        };

//选择选中项(提供给父页面调用)
function select() {
    $.page.select($.page.idM.datagrid1);
};
function selectClear() {
    $.page.selectClear();
};