//页面初始化
$.page.pageInit = function () {
    $.page.dataSourceSettingsDictionary = {
    }
};

//页面加载
$.page.pageLoad = function () {
    //开始查询
    onSearch();
};

//查询
function onSearch() {
    //datagrid加载数据
    datagrid1_Load();
};

//datagrid数据加载
function datagrid1_Load() {
    //开启datagrid数据加载锁屏
    $.page.idM.datagrid1.loading();
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "getSysConfigInfo"
        , data: {
            ticket: $.page.ticket
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                //设置datagrid1数据
                var entityList = resultData.data;
                if (entityList) {
                    $.page.idM.datagrid1.set({
                        data: entityList
                    });
                } else {
                    $.page.idM.datagrid1.unmask();
                };
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
function getmDataID() {
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

//插入新增行
function insertRow() {
    var newRow = { name: "New Row" };
    $.page.idM.datagrid1.addRow(newRow, 0);
    $.page.idM.datagrid1.beginEditCell(newRow, "key");
};

//保存
function insertOrUpdate() {
    $.page.idM.datagrid1.validate();
    if ($.page.idM.datagrid1.isValid() == false) {
        var error = $.page.idM.datagrid1.getCellErrors()[0];
        $.page.idM.datagrid1.beginEditCell(error.record, error.column);
        return;
    };
    var mEntityList = $.page.idM.datagrid1.getChanges();
    mEntityList = fw.fwObject.FWObjectHelper.emptyToNull(mEntityList);

    $.page.idM.datagrid1.loading("保存中，请稍后......");
    //插入或者更新
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "insertOrUpdateSysConfigInfo"
        , data: {
            ticket: $.page.ticket
            , mEntityList: mEntityList
        }
        , beforeSend: function () {
            fw.fwButton.fwButtonHelper.addWait($.page.idM.insertOrUpdate);
        }
        , success: function (resultData) {
            //判断插入或者更新成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                //datagrid加载数据
                datagrid1_Load();
            } else {
                mini.alert("保存失败！");
            };
        }
        , complete: function () {
            fw.fwButton.fwButtonHelper.removeWait($.page.idM.insertOrUpdate);
        }
    }));
};

//删除选中项
function deleteRow() {
    //获得选中项编码集合
    var rows = $.page.idM.datagrid1.getSelecteds();
    if (rows.length > 0) {
        for (var i = 0; i < rows.length; i++) {
            $.page.idM.datagrid1.removeRows([rows[i]], true);
        };
    } else {
        mini.alert("请选择一项！");
    };
};