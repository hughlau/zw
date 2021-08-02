
var datagrid1JQ = null;
var buttonSearchJQ = null;
var buttonGenerateTaskJQ = null;
var buttonIsSolveJQ = null;

$.page.pageInit = function () {
    checkIsProjectSelected();
    $.page.dataSourceSettingsDictionary = {
        "cantonCode": {
            dataSourceName: "sysBasicManage.getCantonDicData"
            , dataSourceParams: { pCode: window.top['cantonCodeCache'] }
        }
         , "cmbFaultType": {
             dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BLL_AlarmType" }
         }
        , "cmbIsSolve": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BIZIsSolve" }
        }
        , "cmbIsGenerateTask": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BIZIsGenerateTask" }
        }
    };

    $.page.idM.mCallTimeFrom.setValue(moment().subtract(7, 'days').format('YYYY-MM-DD'));
    $.page.idM.mCallTimeTo.setValue(moment().format('YYYY-MM-DD'));
};
/* 页面加载 */
$.page.pageLoad = function () {
    roleViewInit();
    $.page.idM.buttonGenerateTask.setEnabled(false);
    $.page.idM.buttonIsSolve.setEnabled(false);
    //获取用户信息
    var userInfo = $.page.userInfo;
    //判断运维单位 则跳转地址
    if (userInfo != null && userInfo.userTypeCode == 'omPerson') {
        for (var i = 0; i < userInfo.roleCodeList.length; i++) {
            if (userInfo.roleCodeList[i] == "omPersonRole") {
                $.page.idJQ.functionList.hide();
            };
        };
    };



    datagrid1JQ = $.page.idM.datagrid1;
    buttonSearchJQ = $("#btnSearch");
    buttonGenerateTaskJQ = $("#buttonGenerateTask");
    buttonIsSolveJQ = $("#buttonIsSolve");

    buttonSearchJQ.bind("click", function () {
        onSearch();
    }).click();

    buttonGenerateTaskJQ.bind("click", function () {
        openTaskInfo("editView");
    });

    buttonIsSolveJQ.bind("click", function () {
        feedbackInfo($.pageCustomer.enumOperate.edit);
    });
};

/**
 五日时间到，青钰经常出去，说是找线索，最终也没有发现。
各门派，朝廷，商盟，消息，参加。
展示极品玄剑。
展示高品玄器。
比武报名，青钰报名，门派首领面面相觑，这等级的玄器虽说精妙，但也不至于让掌门参加比武，青钰不好意思，说是替卫恒，
挨个战斗，卫恒排名靠前
让卫恒参加，依情告诉卫恒师父这是在让他锻炼。
快意恩仇的侠侣出现，女的并不会武技，青钰佩服。
第三日晚上，卫恒进入8强，最后一天了，青钰决定庆祝，三人酒菜吃到很晚，青钰大醉。

青钰交待好二人，便出去了，说这几日要去附近查看一下匪徒的信息，没有多说什么，告诉依情好好看着卫恒，不要闯祸。
这几日各门各派的人渐渐来了，卫恒看着对面的小楼也渐渐住满，和人打听之下得之，原来那个小楼里面的不是高官显贵，就是
大宗弟子。
    卫恒依情二人在庄内游览，大部分地方都被看守拦住，不得入内，卫恒郁闷的很，几次偷着想出去，被依情死死拦住。
    说道一个酒鬼已经够了，不能再多一个。卫恒无奈，只得。
    偌大的山庄里宾客齐聚，大部分是江湖门派，还有少量嗜武的高官富贵之人。
    
    转眼五日之期到了，青钰头天晚上就回来了，没有查到那两个通缉之人的消息。
    第二日，百炼山庄金水楼内满满全是人，一楼大厅，众人喧哗之声。青钰三人被安排靠近外侧。
    青钰看向二楼，愤愤不满。
    “想当年我们枫月也是一流大派，如今让人瞧不起。”青钰看着二楼的人。
    “他们是什么人”依情问道。
    “肯定是四大派和高官显贵”卫恒说道。
    “二楼正中的夏国的百生宗，那个靠着椅背的绛红衣女人叫宁红，别看年龄不大，却已经是百生宗两大护法之一了。”，
    “这个女人穿着干练，很师父到挺像啊”卫恒说道。
    “呸，这个女人心狠手辣，果断无情，我可是个柔弱的小女子。”青钰说道。

    此时大厅正中的太上出现了一位中年人，外表俊朗，“欢迎大家来到我们百炼山庄，这几日招待不周，还请恕罪。”
    “大家此次来我百炼山庄的目的无非就是来得到玄器，我也不多说，接下来给大家展示一下高品玄器。”
    接着仆人们把整个楼的窗户都用黑布遮住了。众人桌子上点燃了蜡烛。
    “第一件，玄铁鞭”
    “第二件，重剑”
    “第三件，刀”
    十件玄器介绍完，每件玄器都放出微弱光芒，绿，蓝，不等。
    介绍了很多件，一楼众人眼中兴奋异常，卫恒看二楼没有什么动静，果然是看过市面之人，这些武器都看不上。
    “这批高品玄器和以往不同，以往都是直接购买，这次我们能者得之，更加公平。”
    “这雷家越来越会做生意了。”青钰说道。
    “一来可以赚更多钱，二来加大自己江湖地位，名利聚得。”卫恒说道。
    “就你聪明”
    台上的武器都撤了下去，雷庄主继续说道。
    “接下来，也是最重要的，极品玄器，我们山庄也是第二次炼制出来，上一次炼制出事百生宗厉掌门的银焰。”
    “我各个雷大痴迷炼器，这件极品玄剑乃是我哥哥亲手炼制而成的，名曰紫雾。不输于银焰”
    接着雷庄主双手一拍，台上一个干练的小伙子，正是接待宾客的雷庄主儿子，双手拖着一柄剑进入。
    剑鞘极薄，通体碧绿似水，没有半点杂色，竟是由玉石打造。
    “啧啧，竟用翠水玉当剑鞘，”台上众人发出感叹之声。
    卫恒看到也不禁，卫家金玉生意，他虽然不参与，但是对于一些极品玉石还是了解的，这翠水玉只产于宛国南部，
    宛国南部多湖，只有深度超过几十米以下的湖沙之下才有可能发现。并且个头都不大。
    巴掌一块大小的都很少见，且是天价，足有上百万两。
    出了产量稀少，光泽润美，此玉材质异常坚硬，导致寻常方法根本不能打磨，加工难度
    如今出现如此大的一块，还被加工成了剑鞘。真不知道价格几何。
    二楼的众人看到剑鞘后也不禁发出了惊叹声，显然也对这剑产生了极大的兴趣。
    雷庄主结果剑，“请大家看好”说着嗖的一声，迅速的拔出剑，众人只看见一道紫光从刀鞘中喷出。
    在看雷庄主手上，一柄长剑，细窄轻薄，银光闪闪，剑体之中又发出紫色微光，好像笼罩在一层紫色雾气之中。
    及时在白天都能显现出如此光芒。
    二楼上的人看到剑，都不进站起身来，细细打量。
    青钰看到剑中的玄气如此强大，眼中献出几分嫉妒神色。
    “神剑啊”，“此生能见到如此剑，真实无憾了”，台下传来阵阵夸赞之声。
    “炼制此剑耗费了我们百炼山庄几乎所有的玄材，此剑只换不卖，需要至少炼制此剑的五倍玄材。”雷庄主看向二楼。
    “如果哪位有意此剑，我们会后在来商讨细节”


 * */
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
            $.page.idJQ.functionList.hide(); 
        };
    };
};
function onSearch(cSettings) {
    datagrid1_Load(0, undefined, cSettings);
};
//数据导出
function dataExport() {
    onSearch({ isExport: true, pageSize: fw.fwNumber.intMaxValue, pageIndex: 1 });
    $.page.exportFile({ idM: $.page.idM.datagrid1, reportName: '报警信息列表' });
};
function datagrid1_BeforeLoad(e) {
    //取消datagrid的miniui自动加载
    e.cancel = true;
    //miniui的页数与实际相差1页
    var pageIndex = e.data.pageIndex + 1;
    var pageSize = e.data.pageSize;
    //datagrid加载数据
    datagrid1_Load(pageIndex, pageSize);
};


//datagrID数据加载
function datagrid1_Load(pageIndex, pageSize,cSettings) {
    //如果没传入页数
    if (!fw.fwObject.FWObjectHelper.hasValue(pageIndex)) {
        //将页数设置为datagrID的页数
        pageIndex = datagrid1JQ.pageIndex;
    };
    //如果没传入分页大小
    if (!fw.fwObject.FWObjectHelper.hasValue(pageSize)) {
        //将分页大小设置为datagrID的分页大小
        pageSize = datagrid1JQ.pageSize;
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
    if (fw.fwObject.FWObjectHelper.hasValue(datagrid1JQ.sortField)) {
        //将排序字段设置为datagrid的排序字段
        sortFieldList = [{
            fieldName: datagrid1JQ.getSortField()
            , sortType: fw.fwData.FWSortType[datagrid1JQ.getSortOrder()]
        }];
    };
    //开启datagrID数据加载锁屏
    $.page.idM.datagrid1.loading();

    var conditionData = $.page.idM.conditionForm.getData();

    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "operationMaintenance"
        , methodName: "queryPageMonitorSiteAlarm"
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
    },cSettings));
};
//单元格渲染事件
function dataGrid_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "monitorSiteAlarmName":
            html = "<a href=\"javascript:feedbackInfo('" + $.pageCustomer.enumOperate.view + "','" + e.record.operationMaintenanceTaskCode + "')\" style=\"color:blue;\">" + e.value + "</a>"
            break;
        case "monitorSiteName":
            html = "<a href=\"javascript:openMonitorSiteInfo('" + $.pageCustomer.enumOperate.view + "','" + e.record.monitorSiteCode + "')\" style=\"color:blue;\">" + e.value + "</a>"
            break;
        case "alarmTime":
            html = e.value;
            break;
        case "isSolve":
            if (e.value == 1) {
                html = " <a style=\"color:blue;\" onclick=\"feedbackInfo('" + $.pageCustomer.enumOperate.view + "')\">已解决</a>";
            } else {
                html = " <a style=\"color:red;\">未解决</a>";
            };
            break;
        case "isGenerateTask":
            if (e.value == 1) {
                html = " <a style=\"color:blue;\" onclick=\"openTaskInfo('editView_v')\">已生成</a>";
            } else {
                html = " <a style=\"color:red;\">未生成</a>";
            };
            break;
    };
    return html;
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


//时间选择限制 开始时间 暂存申请信息 OK
function onDrawStartDate(e) {
    var date = e.date;
    var d = new Date();
    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.mCallTimeTo.value)) {
        if (date.getTime() > $.page.idM.mCallTimeTo.value) {
            e.allowSelect = false;
        };
    };
};
//时间选择限制 结束时间 暂存申请信息 OK
function onDrawEndDate(e) {
    var date = e.date;
    var d = new Date();

    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.mCallTimeFrom.value)) {
        if (date.getTime() < $.page.idM.mCallTimeFrom.value) {
            e.allowSelect = false;
        };
    };
};
function onCloseClick(e) {
    var obj = e.sender;
    obj.setText("");
    obj.setValue("");
};

function feedbackInfo(action) {
    var entity = $.OperationMaintenancePage.getSelectedEntity();
    if (!entity) {
        return;
    };
    if (action != $.pageCustomer.enumOperate.view) {
        if (entity.isSolve == 1) {
            mini.alert("该报警信息已经解决。");
            return;
        };
        if (entity.isGenerateTask == 1) {
            mini.alert("该报警信息已经生成任务。");
            return;
        };
    };
    var data = { ticket: $.page.ticket, monitorSiteAlarmCode: entity.monitorSiteAlarmCode, action: action };
    var pageParams = { url: "web/monitorAlarm/monitorSiteAlarm.htm", width: 800, height: 448, title: "报警信息" };
    $.page.openPage(data, pageParams, function (e) {
        if (e != "cancel") {
            buttonSearchJQ.click();
        };
    });
}; 
function deleteInfo() {
    var entity = $.OperationMaintenancePage.getSelectedEntity();
    entity.isDis = 1;
    mini.confirm("确定删除记录？", "确定？",
            function (action) {
                if (action == "ok") {
                    $.page.ajax($.page.getAjaxSettings({
                        serviceType: "crossDomainCall"
                        , serviceName: "operationMaintenance"
                        , methodName: "updateMaintenanceTask"
                        , data: {
                            ticket: $.page.ticket
                           , mEntity: entity
                        }
                        , success: function (resultData) {
                            //判断加载数据成功
                            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                                mini.alert("删除成功", "提示", function () {
                                    onSearch();
                                });
                            } else {
                                if (resultData.infoList != null && resultData.infoList.length > 0) {
                                    mini.alert(resultData.infoList[0]);
                                };
                            };
                        }
                    }));
                };
            });
};

function openTaskInfo(action) {
    var entity = $.OperationMaintenancePage.getSelectedEntity();
//    entity.ltuMac = "sss";
//    entity.wKqbCurValue = "12";
//    entity.createDateTime = "2017-04-13";
    if (!entity) {
        return;
    };
    var data = { ticket: $.page.ticket, action: action };
    data.monitorSiteAlarmCode = entity.monitorSiteAlarmCode;
    if (action == "editView") {
        if (entity.isSolve == 1) {
            mini.alert("该报警信息已经解决。");
            return;
        };
        if (entity.isGenerateTask == 1) {
            mini.alert("报警记录已经生成任务,不可重复生成。");
            return;
        };
      
//        $.page.ajax($.page.getAjaxSettings({
//            serviceType: "crossDomainCall"
//                        , serviceName: "operationMaintenance"
//                        , methodName: "receiveLtuData"
//                        , data: {
//                            ticket: $.page.ticket
//                           , mEntity: entity
//                        }
//                        , success: function (resultData) {
//                            //判断加载数据成功
//                            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
//                                mini.alert("生成任务成功", "提示", function () {
//                                    onSearch();
//                                });
//                            } else {
//                                if (resultData.infoList != null && resultData.infoList.length > 0) {
//                                    mini.alert(resultData.infoList[0]);
//                                };
//                            };
//                        }
//        }));
    }
    var pageParams = { url: "web/operationMaintenance/operationMaintenanceTask.htm?monitorSiteAlarmCode=" + entity.monitorSiteAlarmCode, width: 800, height: 600, title: "任务信息" };
    $.page.openPage(data, pageParams, function (e) {
        if (e != "cancel") {
            buttonSearchJQ.click();
        };
    });
};

function openMonitorSiteInfo(action, monitorSiteCode) {
    var data = { ticket: $.page.ticket, action: action, pageTabs: "ws,info" };
    data.monitorSiteCode = monitorSiteCode;
    var pageParams = {};
    pageParams = { url: "web/monitorSite/monitorSiteViewMain.htm", width: 800, height: 600, title: "净化槽信息" };
    $.page.openPage(data, pageParams);
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