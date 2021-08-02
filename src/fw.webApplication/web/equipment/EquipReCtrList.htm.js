//页面初始化
$.page.pageInit = function () {
    checkIsProjectSelected();
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
        "equipmentTypeCode": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BLL_EquipmentType" }
        }, 
        "cantonCode": {
            dataSourceName: "sysBasicManage.getCantonDicData"
            , dataSourceParams: { pCode: window.top['cantonCodeCache'] }
        }
    };
};

//查询条件
var conditionData = {};
//页面加载
$.page.pageLoad = function () {
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
            $.page.idJQ.ReCtrK.hide();
        };
    };
};
//查询
function onSearch(cSettings) {
    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();
    conditionData.equipmentStatusCode = "1"; //只显示启用设备
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
    conditionData.equipmentTypeCode = '01';
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
 

 
function onReCtrK() {
    var entityList = getSelectedEntityList();
    //判断对象集合有值
    if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
        var equipmentNoList = [];
        for (var i = 0; i < entityList.length; i++) { 
            equipmentNoList.push(entityList[i].equipmentNo);
        }
        equipmentNo = equipmentNoList.join(',');
        var Action = $("#ReCtrK").text() == "开始反控" ? 1 : 0;
        var data = {
            ticket: $.page.ticket,
            equipmentNoList: equipmentNo
        };
        var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/equipment/enterEquipReCtrList.htm", $.page.webSiteRootUrl), data);
        //打开窗口
        //        window.open(url);
        mini.open({
            url: url
            , title: name
            , width: 1000
            , height: 600
            , showMaxButton: true
            , onload: function () {
            }
            , ondestroy: function (action) { 
            }
        }); 
    };
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


 