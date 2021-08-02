//页面初始化
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
        "equipmentTypeCode": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BLL_EquipmentType" }
        },
        "equipmentStatus": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BIZEquipmentStatus" }
        },
        "cantonCode": {
            dataSourceName: "sysBasicManage.getCantonDicData"
            , dataSourceParams: {  }
        }
    };
};

//查询条件
var conditionData = {};
var noBelongSite = null;
var monitorSiteCode = null;
//页面加载
$.page.pageLoad = function () {
    //
    noBelongSite = $.page.params.noBelongSite;
    monitorSiteCode = $.page.params.monitorSiteCode;
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
    };


    //开始查询
    onSearch();

};
//查询
function onSearch(cSettings) {
    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();
    // conditionData.noBelongSite = noBelongSite;
    conditionData.equipmentStatusCode = 0; //未启用
    conditionData.monitorSiteCode = monitorSiteCode;
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
        case "partName":
            html = "<a href=\"javascript:openInfo('" + $.pageCustomer.enumOperate.view + "','" + e.record.operationMaintenancePersonCode + "')\" style=\"color:blue;\">" + e.value + "</a>";
            break;
        case "isDis":
            html = (fw.fwObject.FWObjectHelper.hasValue(e.value) && e.value == 1) ? "<label style=\"color:Red\">已停用</label>" : "<label style=\"color:Green\">已启用</label>";
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
            }
            else //Roger 2016/6/1 13:00:02 增加管辖区域
            {
                var erroInfo = resultData.infoList.join("<br>");
                $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
            };
        }
    }, cSettings));
};

//获取选中项对象
function getSelectedEntity() {
    //获取选中项对象
    var entity = $.page.idM.datagrid1.getSelected();
    //判断对象没有值
    if (!fw.fwObject.FWObjectHelper.hasValue(entity)) {
        mini.alert("请选择一项！");
        entity = undefined;
    };
    return entity;
};

//获取选中项对象集合
function getSelectedEntityList() {
    //获取选中项对象集合
    var entityList = $.page.idM.datagrid1.getSelecteds();
    //判断对象集合没有值
    if (!fw.fwObject.FWObjectHelper.hasValue(entityList) || entityList.length < 1) {
        mini.alert("请选择需要操作项！");
        entityList = undefined;
    };
    return entityList;
};

//获得选中项编码
function getEquipmentCode() {
    var equipmentCode = undefined;
    //获取选中项对象
    var entity = getSelectedEntity();
    //判断对象有值
    if (entity && fw.fwObject.FWObjectHelper.hasValue(entity)) {
        equipmentCode = entity.equipmentCode;
    };
    return equipmentCode;
};

//获得选中项编码集合
function getEquipmentCodeList() {
    var mCodeList = undefined;
    //获取选中项对象集合
    var entityList = getSelectedEntityList();
    //判断对象集合有值
    if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
        mCodeList = [];
        for (var i = 0; i < entityList.length; i++) {
            mCodeList.push(entityList[i].equipmentCode);
        };
    };
    return mCodeList;
};


function onSelectionChanged() {
    var row = $.page.idM.datagrid1.getSelecteds();
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
            equipmentCode = getEquipmentCode();
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
            , height: 300
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
//选择选中项(提供给父页面调用)
function select() {
    //判断选择类型以及选择回调方法有值
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.selectType) && fw.fwObject.FWObjectHelper.hasValue($.page.params.selectCallback)) {
        //判断是单选
        if ($.page.params.selectType == fw.fwData.FWSelectType.Single) {
            //获取选中项对象
            var entity = getSelectedEntity();
            //判断选中项对象有值
            if (fw.fwObject.FWObjectHelper.hasValue(entity)) {
                //调用回调方法
                fw.callFunction(fw.openWindow(), $.page.params.selectCallback, [entity]);
                //关闭窗口
                fw.closeWindow();
            };
        } else if ($.page.params.selectType == fw.fwData.FWSelectType.Multi) {
            //获取选中项对象集合
            var entityList = getSelectedEntityList();
            //判断选中项对象集合有值
            if (fw.fwObject.FWObjectHelper.hasValue(entityList)) {
                //调用回调方法
                fw.callFunction(fw.openWindow(), $.page.params.selectCallback, [entityList]);
                //关闭窗口
                fw.closeWindow();
            };
        };
    };
};
function selectClear() {
    //判断选择类型以及选择回调方法有值
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.selectType) && fw.fwObject.FWObjectHelper.hasValue($.page.params.selectClearCallback)) {
        //调用选择清除回调方法
        fw.callFunction(fw.openWindow(), $.page.params.selectClearCallback, []);
        //关闭窗口
        fw.closeWindow();
    };
};
function dataExport() {
    onSearch({ isExport: true, pageSize: fw.fwNumber.intMaxValue, pageIndex: 1 });
    $.page.exportFile({ idM: $.page.idM.datagrid1, reportName: '设备列表' });
};
function del() {
    var entity = $.page.idM.datagrid1.getSelected();
    if (entity.equipmentStatus == 1) {
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
    var entity = $.page.idM.datagrid1.getSelected();
    if (entity.equipmentStatus == 1) {
        $.page.showTips({ content: "启用设备不能执行此操作！", state: "warning" });
        return;
    };
    mini.confirm("确定" + (mIsDis == -1 ? "报废" : "未启用") + "该设备？", "确定？",
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
                                equipmentStatus: mIsDis
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