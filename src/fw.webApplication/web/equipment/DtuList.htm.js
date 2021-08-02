//页面初始化
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
        "equipmentType": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BIZEQType" }
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
    $.page.idM.IrrAreaState.setValue(1);
};

//查询条件
var conditionData = {}; 
//页面加载
$.page.pageLoad = function () {

   // onSelectChange();
    //开始查询
    onSearch();

};
//行选择改变时
function datagrid1_SelectionChanged(e) {
}


//查询
function onSearch(cSettings) {
    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();
    conditionData.equipmentStatus = 1;
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
        , methodName: "queryPageDtuData"
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
                //设置datagrid数据
                $.page.idM.datagrid1.set({
                    pageIndex: resultData.data.pageIndex - 1
                    , pageSize: resultData.data.pageSize
                    , totalCount: resultData.data.recordCount
                    , data: resultData.data.entityList
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
    }, cSettings));
};
function onReCtrK() {
    var entityList = getSelectedEntityList();
    //判断对象集合有值
    if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
        var equipmentNoList = [];
        for (var i = 0; i < entityList.length; i++) {
            //var List=entityList[i].IrrSerial.ToString();
            equipmentNoList.push(entityList[i].dtuMac);
        }
        dtuMac=equipmentNoList.toString();
        var Action = $("#ReCtrK").text() == "参数设置" ? 1 : 0;
        var data = {
            ticket: $.page.ticket,
            dtuMacList: dtuMac
        };
        var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/equipment/setDtuParam.htm", $.page.webSiteRootUrl), data);
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
               // 判断非（关闭和取消）窗口
                                if (action != "close" && action != "cancel") {
                                };
                datagrid1_Load();
            }
        });
//        var reCtrEntity = $.map(entityList, function (value, index) {
//            return { IrrAreaNo: value.IrrSerial, Action: Action, ReCtrSampTime: pageParams.ReCtrSampTime == "" ? null : pageParams.ReCtrSampTime, FertActive: 1, ActResult: null };
//        });
//        $.page.ajax($.page.getAjaxSettings({
//            serviceType: "crossDomainCall"
//            , serviceName: "wdf"
//            , methodName: "InsertOrUpdateWDFDatIrrReCtrList"
//            , data: {
//                ticket: $.page.ticket,
//                mEntityList: reCtrEntity
//            }
//            , success: function (resultData) {
//                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
//                    mini.alert("反控命令发送成功！");
//                    onSelectChange();
//                };
//            }
//        }));
    } else {
        mini.alert("请选择反控项！");
    };
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