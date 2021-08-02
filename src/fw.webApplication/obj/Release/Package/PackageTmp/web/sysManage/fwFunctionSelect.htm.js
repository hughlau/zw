//页面初始化
var isInit = true;
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
    };
};

//查询条件
var conditionData = undefined;
var methodName = undefined;

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
        //隐藏功能按钮
        $.page.idJQ.functionList.hide();
    };

    
    //开始查询
    onSearch();
};

//查询
function onSearch() {
    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mRoleCodeList)) {
        conditionData.mRoleCodeList = fw.fwJson.FWJsonHelper.deserializeObject($.page.params.mRoleCodeList);
        methodName = 'queryListMFWRoleMappingFunction';
    };
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mUserIDList)) {
        conditionData.mUserIDList = fw.fwJson.FWJsonHelper.deserializeObject($.page.params.mUserIDList);
        methodName = 'queryListMFWUserMappingFunction';
    };

    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mMenuCodeList)) {
        conditionData.mMenuCodeList = fw.fwJson.FWJsonHelper.deserializeObject($.page.params.mMenuCodeList);
        methodName = 'queryListFWMenuMappingFunction';
    };
     

    //treegrid加载数据
    treegrid1_Load(1);
};

//单元格渲染事件
function treegrid1_Renderer(e) {
    var html = "";
    switch (e.field) {
        default:
            break;
    };
    return html;
};

function checkFunction(mBllModuleCode, mFunctionCode, checked) {
    var record = $.page.idM.treegrid1.getRecord(mBllModuleCode);
    if (fw.fwObject.FWObjectHelper.hasValue(record)) {
        var mFWFunctionList = record.mFWFunctionList;
        if (fw.fwObject.FWObjectHelper.hasValue(mFWFunctionList)) {
            function getMFWFunction(mFunctionCode) {
                for (var i = 0; i < mFWFunctionList.length; i++) {
                    var mFWFunction = mFWFunctionList[i];
                    if (mFWFunction.mFunctionCode == mFunctionCode) {
                        return mFWFunction;
                    };
                };
            };
            var mFWFunction = getMFWFunction(mFunctionCode);
            if (mFWFunction) {
                mFWFunction.checked = checked;
            };
        };
    };
};

function checkAllFunction(mBllModuleCode, btn) {
    var record = $.page.idM.treegrid1.getRecord(mBllModuleCode);
    if (fw.fwObject.FWObjectHelper.hasValue(record)) {
        var mFWFunctionList = record.mFWFunctionList;
        if (fw.fwObject.FWObjectHelper.hasValue(mFWFunctionList)) {
            var checked = record.checkAll !== false;
            for (var i = 0; i < mFWFunctionList.length; i++) {
                var mFWFunction = mFWFunctionList[i];
                mFWFunction.checked = checked;
            };
            record.checkAll = !checked;
            $.page.idM.treegrid1.updateRow(record);
        };
    };
};

//单元格重绘
function treegrid1_DrawCell(e) {
    var tree = e.sender;
    var record = e.record;
    var column = e.column;
    var field = e.field;
    var mBllModuleCode = record[tree.getIdField()];
    var mFWFunctionList = record.mFWFunctionList;

    if (field == 'checkAll') {
        function createCheckboxAll(mFWFunctionList) {
            var html = "";
            if (fw.fwObject.FWObjectHelper.hasValue(mFWFunctionList)) {
                var value = record.checkAll !== false ? "全选" : "取消";
                var checkAllFunction = 'checkAllFunction(\'' + mBllModuleCode + '\', this)';
                html += '<input onclick="' + checkAllFunction + '" type="button" value="' + value + '" style="border: solid 1px #aaa;"/>';
            };
            return html;
        };
        e.cellHtml = createCheckboxAll(mFWFunctionList);
    };

    if (field == 'mFWFunctionList') {
        function createCheckboxList(mFWFunctionList) {
            var html = "";
            if (fw.fwObject.FWObjectHelper.hasValue(mFWFunctionList)) {
                for (var i = 0; i < mFWFunctionList.length; i++) {
                    var mFWFunction = mFWFunctionList[i];
                    var checkFunction = 'checkFunction(\'' + mBllModuleCode + '\',\'' + mFWFunction.mFunctionCode + '\', this.checked)';
                    //var checked = (mFWFunction.mIsHas == 1 || mFWFunction.checked) ? 'checked' : ''; 李香智注释-----------判断不完全。
                    ///////////////////////////////////////
                    //************李香智修改*************//
                    //***********************************//
                    ///////////////////////////////////////
                    var checked = "";
                    if (mFWFunction.mIsHas == 1) {//如果这个判断是真，就说明，获取到数据库的数据时，该选项本书就是checked。
                        if (isInit) {//如果本身是checked，判断是否是初始化状态，如果是，就初始化，如果不是就不初始化，跳过这个阶段。
                            checked = 'checked';
                            isInit = false;
                        } else if (mFWFunction.checked) {//如果不是初始化状态，就进行判断是否是选择了checked，然后赋值
                            checked = "checked";
                        } else {
                            checked = "";
                        }
                    } else {
                        if (isInit) {//类似同上，如果获取的数据时，不是checked的状态
                            checked = '';
                            isInit = false;
                        } else if (mFWFunction.checked) {
                            checked = "checked";
                        } else {
                            checked = "";
                        }
                    }
                    //*************修改结束*****************//
                    html += '<label style="margin: 0px 5px 0px 5px;display: inline-block;"><input onclick="' + checkFunction + '" type="checkbox" ' + checked + ' name="' + mFWFunction.mFunctionCode + '" hideFocus style="vertical-align: bottom;"/>' + mFWFunction.mFunctionName + '</label>';
                    if (isInit) mFWFunction.mIsHas = 0;
                };
            };

            return html;
        };
        e.cellHtml = createCheckboxList(mFWFunctionList);
    };
};

//treegrid数据加载
function treegrid1_Load(pageIndex, pageSize) {
    //开启treegrid数据加载锁屏
    $.page.idM.treegrid1.loading();
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "queryListMFWBllModule"
        , data: {
            ticket: $.page.ticket
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                var entityList = resultData.data;

                //加载数据
                $.page.ajax($.page.getAjaxSettings({
                    serviceType: "crossDomainCall"
                    , serviceName: "sysManage"
                    , methodName: fw.fwObject.FWObjectHelper.hasValue(methodName) ? methodName : "queryListMFWRoleMappingFunction"
                    , data: {
                        ticket: $.page.ticket
                        , queryParams: conditionData
                    }
                    , success: function (resultData) {
                        //判断加载数据成功
                        if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                            function recursiveFunction(obj) {
                                if (obj.length > 0) {
                                    for (var i = 0; i < obj.length; i++) {
                                        recursiveFunction(obj[i]);
                                    };
                                } else if (obj.mFWFunctionList && obj.mFWFunctionList.length > 0) {
                                    for (var i = 0; i < obj.mFWFunctionList.length; i++) {
                                        obj.mFWFunctionList[i].mIsHas = 0;
                                        recursiveFunction(obj.mFWFunctionList[i]);
                                    };
                                } else if (obj.mFunctionCode) {
                                    for (var j = 0; j < resultData.data.length; j++) {
                                        if (obj.mFunctionCode == resultData.data[j].mFunctionCode) {
                                            obj.mIsHas = 1;
                                            obj.checked = true;
                                            break;
                                        };
                                    };
                                };
                            };
                            recursiveFunction(entityList);

                            //设置treegrid数据
                            $.page.idM.treegrid1.loadList(entityList);
                        };
                    }
                }));

            };
        }
    }));
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
            var data = $.page.idM.treegrid1.getData();
            var entityList = [];
            function recursiveFunction(obj) {
                if (obj.length > 0) {
                    for (var i = 0; i < obj.length; i++) {
                        recursiveFunction(obj[i]);
                    };
                } else if (obj.mFWFunctionList && obj.mFWFunctionList.length > 0) {
                    for (var i = 0; i < obj.mFWFunctionList.length; i++) {
                        recursiveFunction(obj.mFWFunctionList[i]);
                    };
                } else if (obj.mFunctionCode) {
                    entityList.push(obj);
                };
            };
            recursiveFunction(data);
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