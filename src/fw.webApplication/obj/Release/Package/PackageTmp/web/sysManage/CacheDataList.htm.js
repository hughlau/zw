//页面初始化
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
        "cacheTypeKey": {
            dataSourceName: "sysManage.queryListCacheType"
            , dataSourceParams: {}
        }
    };
};

//查询条件
var conditionData = undefined;
//排除的选项选项集合（行对象）
var intervalFunctionList = [];

//页面加载
$.page.pageLoad = function () {

    //设置默认查询参数
    var cacheTypeKey;
    var cacheTypeDescription;
    //判断传入了缓存类型编码
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.cacheTypeKey)) {
        //设置缓存类型编码控件的值
        $.page.idM.cacheTypeKey.setValue($.page.params.cacheTypeKey);
    };
    //获取缓存类型编码控件的名称
    cacheTypeDescription = $.page.idM.cacheTypeKey.getText();
    //没有值，说明缓存类型编码不在给定的范围内
    if (!fw.fwObject.FWObjectHelper.hasValue(cacheTypeDescription)) {
        //让缓存类型编码控件选中第一个
        $.page.idM.cacheTypeKey.select(0);
    };
    //获取缓存类型编码控件的值
    cacheTypeKey = $.page.idM.cacheTypeKey.getValue();
    //获取缓存类型编码控件的名称
    cacheTypeDescription = $.page.idM.cacheTypeKey.getText();
    //是否满足查询条件
    var isSearch = false;
    //判断有值
    if (fw.fwObject.FWObjectHelper.hasValue(cacheTypeDescription)) {
        //判断没有传入了缓存类型编码
        if (!fw.fwObject.FWObjectHelper.hasValue($.page.params.cacheTypeKey)) {
            isSearch = true;
        } else {
            //传入了缓存类型编码并且传入的编码在给定的范围内
            if (cacheTypeKey == $.page.params.cacheTypeKey) {
                isSearch = true;
                $.page.idJQ.cacheTypeKeyLabel.hide();
                $.page.idM.cacheTypeKey.hide();
            };
        };
    };

    //开始查询
    if (isSearch) {
        onSearch();
    } else {
        //        window.location.replace($.page.getAboutUrl());
    };
};

//查询
function onSearch() {
    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();
    //datagrid加载数据
    datagrid1_Load(1);
};

//单元格渲染事件
function datagrid1_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "lastActionTime":
            e.record["lastActionTime"] = (fw.fwObject.FWObjectHelper.hasValue(e.value)) ? fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(e.value)) : "--";
            html = e.record["lastActionTime"];
            break;
        case "cacheTimeout":
            var id = "cacheTimeout" + e.rowIndex;
            html = "<a id=\"" + id + "\"></a>";
            intervalFunctionList.push({
                lastActionTime: e.record["lastActionTime"]
                , timeout: e.record.timeout
                , id: id
            })
            break;
        default:
            break;
    };
    return html;
};

//datagrid数据加载
function datagrid1_Load(pageIndex, pageSize) {
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
        , serviceName: "sysManage"
        , methodName: "queryPageCacheData"
        , data: {
            ticket: $.page.ticket
            , pageParams: {
                pageSize: pageSize
                , pageIndex: pageIndex
                , sortFieldList: sortFieldList
            }
            , cacheTypeKey: conditionData.cacheTypeKey
            , keyword: conditionData.keyword
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                intervalFunctionList = [];

                for (var i = 0; i < resultData.data.entityList.length; i++) {
                    resultData.data.entityList[i] = fw.fwJson.FWJsonHelper.deserializeObject(resultData.data.entityList[i]);
                };

                //设置datagrid数据
                $.page.idM.datagrid1.set({
                    pageIndex: resultData.data.pageIndex - 1
                    , pageSize: resultData.data.pageSize
                    , totalCount: resultData.data.recordCount
                    , data: resultData.data.entityList
                });

                if (resultData.data.entityList.length > 0) {
                    setInterval(intervalFunction, 30000);
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
function getCacheKey() {
    var cacheKey = undefined;
    //获取选中项对象
    var entity = getSelectedEntity();
    //判断对象有值
    if (entity && fw.fwObject.FWObjectHelper.hasValue(entity)) {
        cacheKey = entity.key;
    };
    return cacheKey;
};

//获得选中项编码集合
function getCacheKeyList() {
    var cacheKeyList = undefined;
    //获取选中项对象集合
    var entityList = getSelectedEntityList();
    //判断对象集合有值
    if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
        cacheKeyList = [];
        for (var i = 0; i < entityList.length; i++) {
            cacheKeyList.push(entityList[i].key);
        };
    };
    return cacheKeyList;
};

//打开信息窗口
function openInfo(action, cacheTypeKey, cacheKey) {
    //是否满足条件打开窗口
    var isOpen = true;
    //打开窗口传入的数据
    var data = {
        ticket: $.page.ticket
        , action: action
        , cacheTypeKey: conditionData.cacheTypeKey
    };
    //判断传入了记录编码
    if (fw.fwObject.FWObjectHelper.hasValue(cacheKey)) {
        data.cacheKey = cacheKey;
    } else {
        //判断是修改或者是查看信息
        if (action == "update" || action == "query") {
            //获取选中项编码
            cacheKey = getCacheKey();
            //判断选中了项
            if (cacheKey && fw.fwObject.FWObjectHelper.hasValue(cacheKey)) {
                data.cacheKey = cacheKey;
            } else {
                isOpen = false;
            };
        } else {
            //判断不是新增
            if (action != "insert") {
                isOpen = false;
            };
        };
    };
    //判断满足条件打开窗口
    if (isOpen) {
        //获得传入的参数字符串
        var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/cacheData.htm", $.page.webSiteRootUrl), data); 
        //打开窗口
        var setting = {
            url: pageUrl,
            title: "缓存信息",
            width: 640,
            height: 512,
            onload: function () { },
            ondestroy: function (action) {
                //判断非（关闭和取消）窗口
                if (action != "close" && action != "cancel") {
                    //datagrid加载数据
                    datagrid1_Load();
                };
            }
        };
        $.page.open(setting);
    };
};

//删除选中项
function del(cacheKeyList) {
    //获得选中项编码集合
    if (!fw.fwObject.FWObjectHelper.hasValue(cacheKeyList)) {
        cacheKeyList = getCacheKeyList();
    };
    //判断选中了项
    if (cacheKeyList) {
        mini.confirm("确定删除记录？", "确定？",
            function (action) {
                if (action == "ok") {
                    //删除
                    $.page.ajax($.page.getAjaxSettings({
                        serviceType: "crossDomainCall"
                        , serviceName: "sysManage"
                        , methodName: "deleteCacheDataByCacheTypeKeyCacheKeyList"
                        , data: {
                            ticket: $.page.ticket
                            , cacheTypeKey: conditionData.cacheTypeKey
                            , cacheKeyList: cacheKeyList
                        }
                        , beforeSend: function () {
                            fw.fwButton.fwButtonHelper.addWait($.page.idM.del);
                        }
                        , success: function (resultData) {
                            //判断删除成功
                            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                                //datagrid加载数据
                                datagrid1_Load();
                            };
                        }
                        , complete: function () {
                            fw.fwButton.fwButtonHelper.removeWait($.page.idM.del);
                        }
                    }));
                };
            }
        );
    };
};


function intervalFunction() {
    if (intervalFunctionList.length > 0) {
        for (var i = 0; i < intervalFunctionList.length; i++) {
            var entity = intervalFunctionList[i];
            var seconds = parseInt((new Date() - fw.fwObject.FWObjectHelper.toDateTime(entity.lastActionTime)) / 1000, 10);
            var cacheTimeoutSeconds = entity.timeout * 60 - seconds + 60;
            var mm = parseInt(cacheTimeoutSeconds / 60);
            var ss = cacheTimeoutSeconds - mm * 60;
            mm = mm < 10 ? ("0" + mm) : mm;
            ss = ss < 10 ? ("0" + ss) : ss;
            $("#" + entity.id).html(mm + ":" + ss);
            if (cacheTimeoutSeconds < 1) {
                clearInterval(intervalFunction);
                onSearch();
            };
        };
    } else {
        clearInterval(intervalFunction);
    };
};