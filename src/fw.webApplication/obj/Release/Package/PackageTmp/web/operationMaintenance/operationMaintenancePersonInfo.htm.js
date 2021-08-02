var operationMaintenancePersonCode = undefined;
var operationMaintenanceUnitCode = undefined;
var action = null;
var callbackData = null;
var siteList = [];
var siteList_insert = [];
var siteList_del = [];
var conditionData = undefined;
var userInfo = {}; //用户信息 
var arrayModelList = [];

var arrayOldCodeList = [];

var entityList = null;
var divEditformJQ = null;


//页面初始化
$.page.pageInit = function () {
    $.page.dataSourceSettingsDictionary = {
        "mUserTypeCode": {
            dataSourceName: "sysManage.getDictionaryMFWUserType"
            , dataSourceParams: {}
        }
        , "alarmReceiveTypeCode": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BIZAlarmReceiveType" }
        }
    };
};

//页面加载
$.page.pageLoad = function () {

    //获取用户信息
    var userInfo = $.page.userInfo;

    divEditformJQ = $.page.idM.editform;
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.operationMaintenancePersonCode)) {
        operationMaintenancePersonCode = $.page.params.operationMaintenancePersonCode;
    } else {
        //判断运维单位 则跳转地址
        if (userInfo != null && userInfo.userTypeCode == 'omPerson'
    && userInfo.roleCodeList != null && userInfo.roleCodeList.length > 0) {
            for (var i = 0; i < userInfo.roleCodeList.length; i++) {
                if (userInfo.roleCodeList[i] == "omPersonRole") {
                    if (fw.fwObject.FWObjectHelper.hasValue(userInfo.operationMaintenancePersonCode)) {
                        operationMaintenancePersonCode = userInfo.operationMaintenancePersonCode;
                    };
                };
            }; 
        };
    };



    action = $.page.params.action;

    action = $.pageCustomer.hasValue(action) ? action : $.pageCustomer.enumOperate.view;
    //operationMaintenancePersonCode = "027f302a-10c4-45fd-b05f-8a9a1b2145a3";

    if ($.pageCustomer.hasValue($.page.params.operationMaintenanceUnitCode)) {
        operationMaintenanceUnitCode = $.page.params.operationMaintenanceUnitCode;
    } else {
        //显示运维单位选择
        $(".OPUnitCls").show();
    };



    $.page.idM.tree1.loadData($.OperationMaintenancePage.treeRootData);
    if (action == $.pageCustomer.enumOperate.view) {
        $.pageCustomer.labelModel(divEditformJQ);
        $.page.idM.operationMaintenanceUnitCode.setEnabled(false);
        $.page.idJQ.insertOrUpdate.hide();
        query(operationMaintenancePersonCode);
        dgMonitorSite_LoadData();
    };
};

function eidtInfo() {
    $.pageCustomer.inputModel(divEditformJQ);
    $.page.idM.operationMaintenanceUnitCode.setEnabled(false);
    $.page.idJQ.insertOrUpdate.show();
    $.page.idM.buttonEditCancel.show();
    $.page.idM.insertOrUpdate.show();
    $.page.idM.buttonEdit.hide();
};

function cancelEdit() {
    $.pageCustomer.labelModel(divEditformJQ);
    $.page.idM.buttonEdit.show();
    $.page.idM.buttonEditCancel.hide();
    $.page.idM.insertOrUpdate.hide();
};

//关闭窗口
function CloseWindow(action) {
    //判断数据被修改
    if (action == "close" && $.page.idM.editform.isChanged()) {
        if (confirm("数据被修改了，是否先保存？")) {
            return false;
        };
    };
    if (window.CloseOwnerWindow) {

        return window.CloseOwnerWindow(action);
    } else {
        window.close();
    };
};

//取消
function onCancel() {
    //关闭窗口
    CloseWindow("cancel");
};

//查询信息
function query(operationMaintenancePersonCode) {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue(operationMaintenancePersonCode)) {
        //查询信息
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "operationMaintenance"
            , methodName: "queryMOperationMaintenancePersonByPersonCode"
            , data: {
                ticket: $.page.ticket
                , mOperationMaintenancePersonCode: operationMaintenancePersonCode
            }
            , success: function (resultData) {
                //判断查询信息成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                    var entity = resultData.data;
                    //设置表单值
                    $.page.idM.editform.setData(entity);
                    $.page.idM.operationMaintenanceUnitCode.setText(entity.operationMaintenanceUnitName);
                    $.page.idM.operationMaintenanceUnitCode.setValue(entity.operationMaintenanceUnitCode);
                    //接警项 
                    if (fw.fwObject.FWObjectHelper.hasValue(resultData.data.alarmReceiveTypeCodeList)) {
                        $.page.idM.alarmReceiveTypeCode.setValue(resultData.data.alarmReceiveTypeCodeList.join(','));
                    };
                } else {
                    //Roger 2016/6/1 13:00:02 增加管辖区域
                    mini.alert("该数据不存在！(" + resultData.infoList[0] + ")", undefined, function () {
                        CloseWindow("cancel");
                    });
                };
            }
        }));
    };
};


//插入或者更新
function insertOrUpdate() {
    //表单验证
    $.page.idM.editform.validate();
    //判断表单验证不成功
    if ($.page.idM.editform.isValid() == false) { return; };
    var alarmReceiveTypeCode = $.page.idM.alarmReceiveTypeCode.getValue();
    //获取表单数据
    var data = fw.fwObject.FWObjectHelper.emptyToNull($.page.idM.editform.getData());
    data.operationMaintenancePersonCode = operationMaintenancePersonCode;
    data.alarmReceiveTypeCodeList = fw.fwObject.FWObjectHelper.hasValue(alarmReceiveTypeCode) ? alarmReceiveTypeCode.split(",") : null;
    data.isDis = 0;
    $.extend(userInfo, {
        mUserName: data.mUserName,
        mUserTypeCode: data.mUserTypeCode,
        mCanBindDeviceCount: data.mCanBindDeviceCount,
        mIsDis: data.mIsDis
    });
    data.mFWUserInfo = userInfo;
    //插入或者更新
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall",
        serviceName: "operationMaintenance",
        methodName: "inserOrUpdateMOperationMaintenancePersonByPersonCode",
        data: {
            ticket: $.page.ticket,
            mEntity: data
        },
        success: function (resultData) {
            //判断插入或者更新成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                mini.alert("保存成功。", "提示", function () {
                    cancelEdit();
                });
            } else if (resultData.status == fw.fwData.FWResultStatus.Failure && resultData.infoList.length > 0) {
                var html_warning = '<b>操作失败</b><br/>原因 ';
                //获取warning信息
                var subData = $.Enumerable.From(resultData.infoList).Where("$.indexOf('warning')>-1").ToArray().forEach(function (i) {
                    html_warning += '<br/>' + i.substr(i.indexOf('warning') + 8);
                }); ;
                mini.showTips({
                    content: html_warning,
                    state: 'warning',
                    x: 'center',
                    y: 'top',
                    timeout: 3000
                });
            } else {
                mini.alert("保存失败！");
            };
        },
        beforeSend: function () {
            fw.fwButton.fwButtonHelper.addWait($.page.idM.insertOrUpdate);
        },
        complete: function () {
            fw.fwButton.fwButtonHelper.removeWait($.page.idM.insertOrUpdate);
        }
    }));
};


//-----------手机号码验证--------------//
function onMobilePhoneValidation(e) {
    if (e.isValid) {
        if (isMobilePhone(e.value) == false) {
            e.errorText = "必须输入正确的手机号码";
            e.isValid = false;
        };
    };
};
//-----------邮政编码验证--------------//
function onPostCodeValidation(e) {
    if (e.isValid && fw.fwObject.FWObjectHelper.hasValue(e.value)) {
        if (isPostCode(e.value) == false) {
            e.errorText = "必须输入正确的邮政编码";
            e.isValid = false;
        };
    };
};

function isMobilePhone(v) {
    var re = new RegExp("^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$");
    if (re.test(v)) return true;
    return false;
};

function isPostCode(v) {
    var re = new RegExp("^[1-9][0-9]{5}$");
    if (re.test(v)) return true;
    return false;
};

function onButtonChooseOPUnitSelectCallback(entity) {
    if (fw.fwObject.FWObjectHelper.hasValue(entity)) {
        $.page.idM.operationMaintenanceUnitCode.setText(entity.operationMaintenanceUnitName);
        $.page.idM.operationMaintenanceUnitCode.setValue(entity.operationMaintenanceUnitCode);
    };
};

function onButtonChooseOPUnit(e) {
    var textMonitor = this;
    //参数
    var data = {
        ticket: $.page.ticket
        , selectType: fw.fwData.FWSelectType.Single
        , selectCallback: "onButtonChooseOPUnitSelectCallback"
        , operationMaintenanceUnitCode: operationMaintenanceUnitCode
        //, selectClearCallback: "onMUserIDSelectClearCallback"
        //, keyword: $.page.idM.mUserID1.getText()
    };

    var pageParams = { url: "web/operationMaintenance/operationMaintenanceUnitList.htm", width: 800, height: 600, title: "运维单位" };
    pageParams.url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl(pageParams.url, $.page.webSiteRootUrl), data);
    //打开选择用户窗口
    mini.open({
        url: pageParams.url
        , title: pageParams.title
        , width: pageParams.width
        , height: pageParams.height
        , onload: function () {
            //var iframe = this.getIFrameEl();
            //iframe.contentWindow;
        }
        , ondestroy: function (action) {

        }
    });
};


//********************列表查询*****************************//
//行选择改变时


function dgMonitorSite_LoadData() {
    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();
    //datagrid加载数据
    conditionData.operationMaintenancePersonCode = operationMaintenancePersonCode;
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "operationMaintenance"
        , methodName: "queryPagePersonMappingMonitorSiteByPersonOrUnitCode"
        , data: {
            ticket: $.page.ticket
            , queryParams: conditionData
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                for (var i = 0; i < resultData.data.length; i++) {
                    arrayModelList.push({ monitorSiteCode: resultData.data[i].monitorSiteCode });
                };
                load_cantonTree();
            }
            else //Roger 2016/6/1 13:00:02 增加管辖区域
            {
                var erroInfo = resultData.infoList.join("<br>");
                $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
            };
        }
    }));
};

//查询
function onSearch() {

    //$.page.idM.dgMonitorSite.set({ data: siteList });

};


//单元格渲染事件
function dgMonitorSite_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "operationMaintenancePersonName":
            html = "<a href=\"javascript:openInfo('query','" + e.record.operationMaintenancePersonCode + "')\" style=\"color:blue;\">" + e.value + "</a>";
            break;
        case "op":
            html = "删除";
            break;
        default:
            break;
    };
    return html;
};


function select() {
    var data = {
        ticket: $.page.ticket,
        operationMaintenancePersonCode: operationMaintenancePersonCode,
        operationMaintenanceUnitCode: operationMaintenanceUnitCode
    };

    //    if (codeList != null && codeList.length > 0) {
    //        data.codeList = mini.encode(codeList);
    //    };
    var pageParams = { url: "web/operationMaintenance/selectMonitorSiteForPerson.htm", width: 800, height: 600, title: "设施点位" };
    $.pageCustomer.miniOpen(data, pageParams, function (selectList) {
        if (selectList != null && selectList.length > 0) {
            for (var i = 0; i < selectList.length; i++) {
                siteList.push({ monitorSiteCode: selectList[i].monitorSiteCode, cantonCode: selectList[i].cantonCode, cantonName: selectList[i].cantonName, monitorSiteName: selectList[i].monitorSiteName });
                siteList_insert.push(selectList[i].monitorSiteCode);
                onSearch();
                //刷新
            };
        };
    });
};


function onBeforeTreeLoad(e) {
    e.cancel = true;
    var tree = e.sender;    //树控件
    var node = e.node;      //当前节点
    var params = e.params;  //参数对象 
    //可以传递自定义的属性
    params.myField = "123"; //后台：request对象获取"myField"
    //$.page.idM.tree1.loadList(init_data_2);
    //$.page.idM.tree1.loadNode(node);
    //console.log(params.myField);
};

function load_cantonTree() {

    $.page.idM.tree1.loading();
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "basicInfo"
        , methodName: "queryCantonListForPersonLazyTree"
        , data: {
            ticket: $.page.ticket
            , queryParams: { action: action, operationMaintenanceUnitCode: operationMaintenanceUnitCode, operationMaintenancePersonCode: operationMaintenancePersonCode }
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success) {
                entityList = resultData.data;
                if (entityList != null && entityList.length > 0) {
                    var selectNode = $.page.idM.tree1.getChildNodes($.page.idM.tree1.getRootNode())[0];

                    for (var i = 0; i < entityList.length; i++) {
                        var entity = entityList[i];
                        if (entity.dataLvl == 1) {
                            var newNode = { code: entity.code, pCode: entity.pCode, name: entity.name, dataLvl: entity.dataLvl, "folder": 1, "isLeaf": false, "expanded": false, "asyncLoad": false };
                            $.page.idM.tree1.addNode(newNode, "add", selectNode);
                        };
                    };
                };
                //$.page.idM.tree1.collapseNode(selectNode);
            }
            else //Roger 2016/6/1 13:00:02 增加管辖区域
            {
                var erroInfo = resultData.infoList.join("<br>");
                $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
            };
        }
        , complete: function () {
            $.page.idM.tree1.unmask();
        }
    }));
};

function onBeforeexpand(sender, node) {
    var selectedNode = sender.node;
    if (fw.fwObject.FWObjectHelper.hasValue(selectedNode)) {
        var childNodes = $.page.idM.tree1.getChildNodes(selectedNode);
        if (!$.page.idM.tree1.isLeaf(sender.node) && (!fw.fwObject.FWObjectHelper.hasValue(childNodes) || childNodes.length <= 0)) {
            //  不是叶子节点  而且没有数据 则加载数据
            if (selectedNode.dataLvl == '2') {
                //加载点位列表
                site_expand(selectedNode);
            } else {
                //展开
                if (entityList != null && entityList.length > 0) {
                    for (var i = 0; i < entityList.length; i++) {
                        var entity = entityList[i];
                        if (entity.pCode == selectedNode.code) {
                            var newNode = { code: entity.code, pCode: entity.pCode, name: entity.name, dataLvl: entity.dataLvl, "folder": 1, "isLeaf": false, "expanded": false, "asyncLoad": false };
                            $.page.idM.tree1.addNode(newNode, "add", selectedNode);
                        };
                    };
                };
            };
        };
    };
};

function site_expand(e) {
    $.page.idM.tree1.loading();
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "basicInfo"
        , methodName: "queryMonitorSitePersonForLazyTree"
        , data: {
            ticket: $.page.ticket
           , queryParams: { action: action, operationMaintenanceUnitCode: operationMaintenanceUnitCode, operationMaintenancePersonCode: operationMaintenancePersonCode
           , cantonCode: e.code
           }
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {

                for (var i = 0; i < resultData.data.length; i++) {
                    var entity = resultData.data[i];
                    if (entity.cantonCode == e.code) {
                        var newNode = { code: entity.monitorSiteCode, pCode: e.code, name: entity.monitorSiteName, dataLvl: 3, "folder": 0, "isLeaf": true, "asyncLoad": false };
                        for (var j = 0; j < arrayModelList.length; j++) {
                            if (entity.monitorSiteCode == arrayModelList[j].monitorSiteCode) {
                                newNode.checked = true;
                                arrayOldCodeList.push(entity.monitorSiteCode);
                                break;
                            };
                        };
                        $.page.idM.tree1.addNode(newNode, "add", e);
                    };
                };
            }
            else //Roger 2016/6/1 13:00:02 增加管辖区域
            {
                var erroInfo = resultData.infoList.join("<br>");
                $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
            };
        }
        , complete: function () {
            $.page.idM.tree1.unmask();
        }
    }));
};


function beforenodeselect(e) {
    //禁止选中父节点
    if (e.isLeaf == false) e.cancel = true;
};

//手机值改变时 帐号跟着改变  
function onMobilePhoneValuechanged(e) {
    var userTypeCode = $.page.idM.mUserTypeCode.getValue();
    var userName = "";
    if (fw.fwObject.FWObjectHelper.hasValue(e.value)) {
        userName = e.value + "@" + userTypeCode;
    } else {
        userName = "";
    };
    $.page.idM.mUserName.setValue(userName);
};