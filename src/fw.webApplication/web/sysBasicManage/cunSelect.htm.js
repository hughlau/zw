//页面初始化
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = { 
    };
};

//查询条件
var conditionData = undefined;
var cantonCode = undefined;
var userID = undefined;
//页面加载
$.page.pageLoad = function () {

//    $.page.params.selectType = fw.fwData.FWSelectType.All;
//    $.page.params.selectCallback = 'test';
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
    //行政区编码
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.cantonCode)) { 
        cantonCode = $.page.params.cantonCode;
    };
    //用户主键
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.userID)) {
        userID = $.page.params.userID;
    };
    //开始查询
    onSearch();
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
    //开启treegrid数据加载锁屏
    $.page.idM.treegrid1.loading();
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysBasicManage"
        , methodName: "queryCantonListByThreeLvl"
        , data: {
            ticket: $.page.ticket
            //, cantonCode: cantonCode
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                var entityList = fw.fwObject.FWObjectHelper.hasValue(resultData.data.columns) ? fw.fwDataTable.FWDataTableHelper.toEntityList(resultData.data) : resultData.data;
                $.page.idM.treegrid1.loadList(entityList);

                //加载数据
                $.page.ajax($.page.getAjaxSettings({
                    serviceType: "crossDomainCall"
                    , serviceName: "sysBasicManage"
                    , methodName: "queryFWUserMappingCantonCodeList"
                    , data: {
                        ticket: $.page.ticket
                        , userID: userID
                    }
                    , success: function (resultData) {
                        //判断加载数据成功
                        if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                            function recursiveMenu(obj) { 
                                if (obj.length > 0) {
                                    for (var i = 0; i < resultData.data.length; i++) {
                                        for (var j = 0; j < obj.length; j++) {
                                            if (obj[j].dataID == resultData.data[i].mDictionaryDataID) {
                                                obj[j].checked = true;

                                                break;
                                            };
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
    var entityList = $.page.idM.treegrid1.getCheckedNodes();
    //判断对象集合没有值
    if (!fw.fwObject.FWObjectHelper.hasValue(entityList) || entityList.length < 1) {
        mini.alert("请选择需要操作项！");
        entityList = undefined;
    };
    return entityList;
};

//获得选中项编码
function getMDataID() {
    var mDataID = undefined;
    //获取选中项对象
    var entity = getSelectedEntity();
    //判断对象有值
    if (entity && fw.fwObject.FWObjectHelper.hasValue(entity)) {
        mDataID = entity.mDataID;
    };
    return mDataID;
};

//获得选中项编码集合
function getMDataIDList() {
    var mDataIDList = undefined;
    //获取选中项对象集合
    var entityList = getSelectedEntityList();
    //判断对象集合有值
    if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
        mDataIDList = [];
        for (var i = 0; i < entityList.length; i++) {
            mDataIDList.push(entityList[i].mDataID);
        };
    };
    return mDataIDList;
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