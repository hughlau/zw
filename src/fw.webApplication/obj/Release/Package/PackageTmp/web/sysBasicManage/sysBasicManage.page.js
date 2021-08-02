$.sysBasicManagePage = {
    getSelectedEntity: function (datagridJQ) {
        //获取选中项对象
        var entity = datagridJQ.getSelected();
        //判断对象没有值
        if (!fw.fwObject.FWObjectHelper.hasValue(entity)) {
            mini.alert("请选择一项！");
            entity = undefined;
        };
        return entity;
    }
    , getSelectedEntityList: function (datagridJQ) {
        //获取选中项对象集合
        var entityList = datagridJQ.getSelecteds();
        //判断对象集合没有值
        if (!fw.fwObject.FWObjectHelper.hasValue(entityList) || entityList.length < 1) {
            mini.alert("请选择需要操作项！");
            entityList = undefined;
        };
        return entityList;
    }
    , getSelectedEntityCodeList: function (datagridJQ, codeName) {
        var mCodeList = undefined;
        //获取选中项对象集合
        var entityList = $.sysBasicManagePage.getSelectedEntityList(datagridJQ);
        //判断对象集合有值
        if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
            mCodeList = [];
            for (var i = 0; i < entityList.length; i++) {
                mCodeList.push(entityList[i]["" + codeName + ""]);
            };
        };
        return mCodeList;
    }
    , enumOperate: {
        view: 'view',
        add: 'add',
        edit: 'edit',
        del:"delete"
    }
};