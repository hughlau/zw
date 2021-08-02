//页面初始化
$.page.pageInit = function () {
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
            , dataSourceParams: {  }
        }
    };
};

//查询条件
var conditionData = {};
var monitorSiteCode = null;
//页面加载
$.page.pageLoad = function () {
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.monitorSiteCode)) {
        monitorSiteCode = $.page.params.monitorSiteCode;
        //开始查询
        onSearch();
    } else {
        $.page.showTips({ content: "参数monitorSiteCode不能为空！ " + erroInfo, state: "danger" });
    };
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
    //datagrid加载数据
    datagrid1_Load(1);
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
    //开启datagrid数据加载锁屏
    $.page.idM.datagrid1.loading();
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "basicInfo"
        , methodName: "queryEquipmentByMonitorSite"
        , data: {
            ticket: $.page.ticket
            , monitorSiteCode: monitorSiteCode
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                //设置datagrid数据
                $.page.idM.datagrid1.set({
                    data: resultData.data
                });
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
    }));
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
            , height: 400
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
function del() {
    var entity = $.page.idM.datagrid1.getSelected(); 
    mini.confirm("确定解除关系？", "确定？",
        function (action) {
            if (action == "ok") {
                //启用停用
                $.page.ajax($.page.getAjaxSettings({
                    serviceType: "crossDomainCall"
                    , serviceName: "basicInfo"
                    , methodName: "RemoveEquipmentMonitorSiteRelation"
                    , data: {
                        ticket: $.page.ticket
                        , equipmentCode: entity.equipmentCode
                        , monitorSiteCode: monitorSiteCode
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
                }));
            };
        }
    );
}; 

//添加设备
function insert() {
    var data = {
        ticket: $.page.ticket
        , selectType: fw.fwData.FWSelectType.Single
        , selectCallback: "onChooseEquipmentSelectCallback"
        , filterType: "1"
        , noBelongSite: "0"
        , monitorSiteCode: monitorSiteCode
    };

    //默认只能添加一台设备
   
//    if ($.page.hasValue($.page.idM.datagrid1.data) && $.page.idM.datagrid1.data.length>0) {
//        $.page.showTips({ content: "净化槽只能关联一台设备！" , state: "danger" });
//    } else {
//        var pageParams = { url: "web/commonPage/equipmentSelect.htm", width: 800, height: 600, title: "设备选择" };
//        $.page.openPage(data, pageParams);
//    };
    var pageParams = { url: "web/commonPage/equipmentSelect.htm", width: 800, height: 600, title: "设备选择" }
            $.page.openPage(data, pageParams);
    
};

function onChooseEquipmentSelectCallback(entity) {
    if (fw.fwObject.FWObjectHelper.hasValue(entity)) {
        //启用停用
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "basicInfo"
            , methodName: "AddEquipmentMonitorSiteRelation"
            , data: {
                ticket: $.page.ticket
                , equipmentCode: entity.equipmentCode
                , monitorSiteCode: monitorSiteCode
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
        }));
    };
};