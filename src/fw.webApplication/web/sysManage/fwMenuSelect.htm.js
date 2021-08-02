//页面初始化
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
        "mMenuTypeCode": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "FWMenuType" }
        }
    };
};

//查询条件
var conditionData = undefined;

//页面加载
$.page.pageLoad = function () {

    //判断选择类型有值
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.selectType)) {
        //判断是单选
        if ($.page.params.selectType == fw.fwData.FWSelectType.Single) {
            $.page.idM.treegrid1.setMultiSelect(false);
        } else {
            $.page.idM.treegrid1.setMultiSelect(true);
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

    //设置默认查询参数
    $.page.idM.mMenuTypeCode.setValue($.page.params.mMenuTypeCode);
    if (!$.page.idM.mMenuTypeCode.getValue()) {
        $.page.idM.mMenuTypeCode.select(0);
    };
    if (!$.page.idM.mMenuTypeCode.getValue()) {
        mini.alert("请先添加菜单类型！菜单类型编码为\"FWMenuType\"", undefined, function () {
            window.location.replace($.page.getAboutUrl());
        });
    };

    //开始查询
    onSearch();

    mini.layout();
};

//查询
function onSearch() {
    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mRoleCodeList)) {
        conditionData.mRoleCodeList = fw.fwJson.FWJsonHelper.deserializeObject($.page.params.mRoleCodeList)
    };
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mUserIDList)) {
        conditionData.mUserIDList = fw.fwJson.FWJsonHelper.deserializeObject($.page.params.mUserIDList)
    };

    //treegrid加载数据
    treegrid1_Load(1);
};

//单元格渲染事件
function treegrid1_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "mMenuName":
            html = "<a>" + e.value + "</a>";
            break;
        default:
            break;
    };
    return html;
};

//treegrid数据加载
function treegrid1_Load(pageIndex, pageSize) {
    exceptNodes = null;
    //开启treegrid数据加载锁屏
    $.page.idM.treegrid1.loading();
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "queryListMFWMenu"
        , data: {
            ticket: $.page.ticket
            , mMenuTypeCode: conditionData.mMenuTypeCode
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                var entityList = resultData.data;

                //加载数据
                $.page.ajax($.page.getAjaxSettings({
                    serviceType: "crossDomainCall"
                    , serviceName: "sysManage"
                    , methodName: fw.fwObject.FWObjectHelper.hasValue(conditionData.mRoleCodeList) ? "queryListMFWRoleMappingMenu" : "queryListMFWUserMappingMenu"
                    , data: {
                        ticket: $.page.ticket
                        , queryParams: conditionData
                    }
                    , success: function (resultData) {
                        //判断加载数据成功
                        if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                            function recursiveMenu(obj) {
                                if (obj.length > 0) {
                                    for (var i = 0; i < obj.length; i++) {
                                        obj[i].mIsHas = 0;
                                        recursiveMenu(obj[i]);
                                    };
                                } else if (obj.mMenuCode) {
                                    for (var j = 0; j < resultData.data.length; j++) {
                                        if (obj.mMenuCode == resultData.data[j].mMenuCode) {
                                            obj.mIsHas = 1;
                                            obj.checked = true;
                                            break;
                                        };
                                    };
                                };
                            };
                            recursiveMenu(entityList);

                            //设置treegrid数据
                            $.page.idM.treegrid1.loadList(entityList);
                        };
                    }
                }));
            };
        }
    }));
};

//获取选中项对象
function getSelectedEntity() {
    //获取选中项对象
    var entity = $.page.idM.treegrid1.getSelected();
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
    var entityList = $.page.idM.treegrid1.getSelecteds();
    //判断对象集合没有值
    if (!fw.fwObject.FWObjectHelper.hasValue(entityList) || entityList.length < 1) {
        mini.alert("请选择需要操作项！");
        entityList = undefined;
    };
    return entityList;
};

//获得选中项编码
function getMMenuCode() {
    var mMenuCode = undefined;
    //获取选中项对象
    var entity = getSelectedEntity();
    //判断对象有值
    if (entity && fw.fwObject.FWObjectHelper.hasValue(entity)) {
        mMenuCode = entity.mMenuCode;
    };
    return mMenuCode;
};

//获得选中项编码集合
function getMMenuCodeList() {
    var mMenuCodeList = undefined;
    //获取选中项对象集合
    var entityList = getSelectedEntityList();
    //判断对象集合有值
    if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
        mMenuCodeList = [];
        for (var i = 0; i < entityList.length; i++) {
            mMenuCodeList.push(entityList[i].mMenuCode);
        };
    };
    return mMenuCodeList;
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
        } else if ($.page.params.selectType == fw.fwData.FWSelectType.All) {
            var entityList = $.page.idM.treegrid1.findRows();
            for (var i = 0; i < entityList.length; i++) {
                if ($.page.idM.treegrid1.isSelected(entityList[i])) {
                    entityList[i].checked = true;
                };
            };
            //调用回调方法
            fw.callFunction(fw.openWindow(), $.page.params.selectCallback, [entityList]);
            //关闭窗口
            fw.closeWindow();
        };
    };
};
//选择清除
function selectClear() {
    //判断选择类型以及选择回调方法有值
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.selectType) && fw.fwObject.FWObjectHelper.hasValue($.page.params.selectClearCallback)) {
        //调用选择清除回调方法
        fw.callFunction(fw.openWindow(), $.page.params.selectClearCallback, []);
        //关闭窗口
        fw.closeWindow();
    };
};