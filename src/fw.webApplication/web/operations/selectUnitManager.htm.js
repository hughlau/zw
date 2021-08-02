//页面初始化
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
    };
};

//查询条件
var conditionData = undefined;

//页面加载
$.page.pageLoad = function () {


    //开始查询
    onSearch();

    $.page.idM.treegrid1.on("dragstart", function (e) {
        e.dragText = e.nodes[0].mRoleName;
    });

    mini.layout();
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
        $.page.idM.treegrid1.lastSelectedRowIndex = $.page.idM.treegrid1.indexOf(e.selected);
    };
};
//查询
function onSearch() {
    //treegrid加载数据
    treegrid1_Load(1);
};



//单元格渲染事件
function treegrid1_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "userName":
            html = "<a href=\"javascript:openDetailInfo('query','" + e.record.userID + "')\" style=\"color:blue;\">" + e.record.userName + "</a>";
            break;
            break;
    };
    return html;
};

//treegrid数据加载
function treegrid1_Load() {
    //开启treegrid数据加载锁屏
    $.page.idM.treegrid1.loading();
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysBasicManage"
        , methodName: "queryUnitManager"
        , data: {
            ticket: $.page.ticket
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                //设置treegrid数据
                $.page.idM.treegrid1.loadList(resultData.data);

                for (var i = 0; i < resultData.data.length; i++) {
                    if (resultData.data[i].isDis == 1) {
                        $.page.idM.treegrid1.selectNode(resultData.data[i]);
                    };
                };


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

//获得选中项编码集合
function getMRoleCodeList() {
    var mRoleCodeList = undefined;
    //获取选中项对象集合
    var entityList = getSelectedEntityList();
    //判断对象集合有值
    if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
        mRoleCodeList = [];
        for (var i = 0; i < entityList.length; i++) {
            mRoleCodeList.push(entityList[i].mRoleCode);
        };
    };
    return mRoleCodeList;
};

//#region 如果选择的数量大于2时，不能修改
function onSelectionChanged() {
    var row = $.page.idM.treegrid1.getSelecteds();
    if (row.length > 1) {
        $.page.idM.buttonEdit.disable();
    } else {
        $.page.idM.buttonEdit.enable();
    }
}
//#endregion

//打开用户扩展信息窗口
function openDetailInfo(action, mUserID) {
    //是否满足条件打开窗口
    var isOpen = true;
    //打开窗口传入的数据
    var data = {
        ticket: $.page.ticket
        , action: action
    };
    //判断传入了记录编码
    if (fw.fwObject.FWObjectHelper.hasValue(mUserID)) {
        data.mUserID = mUserID;
    } else {
        //获取选中项编码
        mUserID = getMDataID();
        //判断选中了项
        if (mUserID && fw.fwObject.FWObjectHelper.hasValue(mUserID)) {
            data.mUserID = mUserID;
        } else {
            isOpen = false;
        };
    };
    //判断满足条件打开窗口
    if (isOpen) {
        //获得传入的参数字符串 
        var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysBasicManage/fwUserInfo.htm", $.page.webSiteRootUrl), data);
        //打开窗口
        mini.open({
            url: pageUrl
            , title: "用户详细信息"
            , width: 780
            , height: 556
            , onload: function () {
                //var iframe = this.getIFrameEl();
                //iframe.contentWindow;
            }
            , ondestroy: function (action) {
                //判断非（关闭和取消）窗口
                if (action != "close" && action != "cancel") {
                    //datagrid加载数据
                    datagrid1_Load();
                };
            }
        });
    };
};




//选择选中项(提供给父页面调用)
function select() {
    //判断选择类型以及选择回调方法有值
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.selectCallback)) {
        //获取选中项对象
        var entity = getSelectedEntity();
        //判断选中项对象有值
        if (fw.fwObject.FWObjectHelper.hasValue(entity)) {
            //调用回调方法
            fw.callFunction(fw.openWindow(), $.page.params.selectCallback, [entity]);
            //关闭窗口
            fw.closeWindow();
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

