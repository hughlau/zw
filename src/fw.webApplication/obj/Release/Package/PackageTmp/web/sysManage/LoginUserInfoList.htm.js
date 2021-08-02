//页面初始化
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
    };
};

//查询条件
var conditionData = undefined;
var sessionTimeout = undefined;
var intervalFunctionList = [];

//页面加载
$.page.pageLoad = function () {

    //设置默认查询参数
    $.page.idM.keyword.setValue($.page.params.keyword);

    //获取session过期时间
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "queryAppSettingsValue"
        , data: {
            ticket: $.page.ticket
            , key: "sessionTimeout"
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                sessionTimeout = resultData.data;
                $.page.idM.sessionTimeout.setValue(sessionTimeout);

                onSearch();
            };
        }
    }));

    //开始查询
    //onSearch();
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
function onSearch() {
    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();

    $.page.idM.sessionTimeout.setValue(sessionTimeout);

    //datagrid加载数据
    datagrid1_Load(1);
};

//数据加载前包括（页数发生变化时）
function datagrid1_BeforeLoad(e) {
    //取消datagrid的miniui自动加载
    e.cancel = true;
    //miniui的页数与实际相差1页
    var pageIndex = e.data.pageIndex + 1
    var pageSize = e.data.pageSize;
    //datagrid加载数据
    datagrid1_Load(pageIndex, pageSize);
};

//单元格渲染事件
function datagrid1_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "userName":
            html = "<a href=\"javascript:openInfo('query','" + e.record.ticket + "')\" style=\"color:blue;\">" + e.value + "</a>";
            break;
        case "lastActionTime":
            e.record["lastActionTime"] = (fw.fwObject.FWObjectHelper.hasValue(e.value)) ? fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(e.value)) : "--";
            html = e.record["lastActionTime"];
            break;
        case "sessionTimeout":
            var id = "sessionTimeout" + e.rowIndex;
            html = "<a id=\"" + id + "\"></a>";
            intervalFunctionList.push({
                lastActionTime: e.record["lastActionTime"]
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
        , methodName: "queryPageLoginUserInfo"
        , data: {
            ticket: $.page.ticket
            , pageParams: {
                pageSize: pageSize
                , pageIndex: pageIndex
                , sortFieldList: sortFieldList
            }
            , keyword: conditionData.keyword
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                intervalFunctionList = [];
                //设置datagrid数据
                $.page.idM.datagrid1.set({
                    pageIndex: resultData.data.pageIndex - 1
                    , pageSize: resultData.data.pageSize
                    , totalCount: resultData.data.recordCount
                    , data: resultData.data.entityList
                });

                if (resultData.data.entityList.length > 0) {
                    setInterval(intervalFunction, 1000);
                };
                //默认选中第一行
                function changefirst(datagrid1) {
                    if (datagrid1.data.length > 0) {
                        if (!datagrid1.lastSelectedRowIndex) {
                            datagrid1.lastSelectedRowIndex = -1;
                        };
                        if (datagrid1.lastSelectedRowIndex > datagrid1.data.length - 1) {
                            datagrid1.lastSelectedRowIndex = datagrid1.data.length - 1;
                        } else if (datagrid1.lastSelectedRowIndex < 0) {
                            datagrid1.lastSelectedRowIndex = 0;
                        };
                        datagrid1.select(datagrid1.getRow(datagrid1.lastSelectedRowIndex));
                    } else {
                        datagrid1_SelectionChanged({ selected: undefined, selecteds: [] });
                    };
                }
                changefirst($.page.idM.datagrid1);		
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
function getUserTicket() {
    var userTicket = undefined;
    //获取选中项对象
    var entity = getSelectedEntity();
    //判断对象有值
    if (entity && fw.fwObject.FWObjectHelper.hasValue(entity)) {
        userTicket = entity.ticket;
    };
    return userTicket;
};

//获得选中项编码集合
function getUserTicketList() {
    var userTicketList = undefined;
    //获取选中项对象集合
    var entityList = getSelectedEntityList();
    //判断对象集合有值
    if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
        userTicketList = [];
        for (var i = 0; i < entityList.length; i++) {
            userTicketList.push(entityList[i].ticket);
        };
    };
    return userTicketList;
};

//打开信息窗口
function openInfo(action, userTicket) {
    //是否满足条件打开窗口
    var isOpen = true;
    //打开窗口传入的数据
    var data = {
        ticket: $.page.ticket
        , action: action
    };
    //判断传入了记录编码
    if (fw.fwObject.FWObjectHelper.hasValue(userTicket)) {
        data.userTicket = userTicket;
    } else {
        //判断是修改或者是查看信息
        if (action == "update" || action == "query") {
            //获取选中项编码
            userTicket = getUserTicket();
            //判断选中了项
            if (userTicket && fw.fwObject.FWObjectHelper.hasValue(userTicket)) {
                data.userTicket = userTicket;
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
        var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/loginUserInfo.htm", $.page.webSiteRootUrl), data); 
        //打开窗口
        mini.open({
            url: pageUrl
            , title: "登录用户信息"
            , width: 640
            , height: 512
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

//删除选中项
function del(userTicketList) {
    //获得选中项编码集合
    if (!fw.fwObject.FWObjectHelper.hasValue(userTicketList)) {
        userTicketList = getUserTicketList();
    };
    //判断选中了项
    if (userTicketList) {
        mini.confirm("确定删除记录？", "确定？",
            function (action) {
                if (action == "ok") {
                    //删除
                    $.page.ajax($.page.getAjaxSettings({
                        serviceType: "crossDomainCall"
                        , serviceName: "sysManage"
                        , methodName: "deleteLoginUserInfoByUserTicketList"
                        , data: {
                            ticket: $.page.ticket
                            , userTicketList: userTicketList
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

//更新
function updateSessionTimeout() {
    //表单验证
    $.page.idM.conditionForm.validate();
    //判断表单验证不成功
    if ($.page.idM.conditionForm.isValid() == false) { return; };
    //获取表单数据
    var data = fw.fwObject.FWObjectHelper.emptyToNull($.page.idM.conditionForm.getData());
    //更新
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "updateAppSettingsValue"
        , data: {
            ticket: $.page.ticket
            , key: "sessionTimeout"
            , value: data.sessionTimeout
        }
        , beforeSend: function () {
            fw.fwButton.fwButtonHelper.addWait($.page.idM.buttonUpdateSessionTimeout);
        }
        , success: function (resultData) {
            //判断更新成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                sessionTimeout = data.sessionTimeout;
                $.page.idM.sessionTimeout.setValue(sessionTimeout);
                mini.alert("更新成功！");
                onSearch();
            };
        }
        , complete: function () {
            fw.fwButton.fwButtonHelper.removeWait($.page.idM.buttonUpdateSessionTimeout);
        }
    }));
};

function intervalFunction() {
    if (intervalFunctionList.length > 0) {
        for (var i = 0; i < intervalFunctionList.length; i++) {
            var entity = intervalFunctionList[i];
            var seconds = parseInt((new Date() - fw.fwObject.FWObjectHelper.toDateTime(entity.lastActionTime)) / 1000, 10);
            var sessionTimeoutSeconds = sessionTimeout * 60 - seconds + 60;
            var mm = parseInt(sessionTimeoutSeconds / 60);
            var ss = sessionTimeoutSeconds - mm * 60;
            mm = mm < 10 ? ("0" + mm) : mm;
            ss = ss < 10 ? ("0" + ss) : ss;
            $("#" + entity.id).html(mm + ":" + ss);
            if (sessionTimeoutSeconds < 1) {
                clearInterval(intervalFunction);
                onSearch();
            };
        };
    } else {
        clearInterval(intervalFunction);
    };
};