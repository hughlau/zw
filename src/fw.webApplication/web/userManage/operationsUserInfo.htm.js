var userID = undefined;
var userRoleCode = 'omPersonRole';
//页面初始化
$.page.pageInit = function () {
    $.page.dataSourceSettingsDictionary = {
        "cantonCode": {
            dataSourceName: "sysBasicManage.getCantonDicData"
            , dataSourceParams: {  }
        } 
    };
};

//页面加载
$.page.pageLoad = function () {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mUserID)) {
        //查询信息
        query($.page.params.mUserID);
        userID = $.page.params.mUserID;
        cantonSelected_Render();
    };
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
function query(mUserID) {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue(mUserID)) {
        //查询信息
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "sysBasicManage"
            , methodName: "queryMFWUserInfoByMUserID"
            , data: {
                ticket: $.page.ticket
                , mUserID: mUserID
            }
            , success: function (resultData) {
                //判断查询信息成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) { 
                    //设置表单值
                    $.page.idM.editform.setData(resultData.data); 
                } else {
                    mini.alert("该数据不存在！", undefined, function () {
                        CloseWindow("cancel");
                    });
                };
            }
        }));
    };
};

 

//插入或者更新
function onInsertOrUpdate() {
    //表单验证
    $.page.idM.editform.validate();
    //判断表单验证不成功
    if ($.page.idM.editform.isValid() == false) { return; };
    //获取表单数据
    var data = fw.fwObject.FWObjectHelper.emptyToNull($.page.idM.editform.getData());
    //设置编码
    data.mUserID = $.page.params.mUserID;
    data.mUserTypeCode = "omPerson"; //本页面默认添加 运维人员 
    //插入或者更新
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysBasicManage"
        , methodName: "insertOrUpdateMFWUserInfoByMUserID"
        , data: {
            ticket: $.page.ticket
            , mEntity: data
        }
        , beforeSend: function () {
            fw.fwButton.fwButtonHelper.addWait($.page.idM.insertOrUpdate);
        }
        , success: function (resultData) {
            //判断插入或者更新成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                //关闭窗口
                CloseWindow("insertOrUpdate");
            } else {
                mini.alert("保存失败！");
            };
        }
        , complete: function () {
            fw.fwButton.fwButtonHelper.removeWait($.page.idM.insertOrUpdate);
        }
    }));
};


//打开行政区分配功能窗口
function openSetCanton() {
    var userCantonCode = $.page.idM.cantonCode.getValue();
    // if (fw.fwObject.FWObjectHelper.hasValue(userCantonCode)) {

    var data = {
        ticket: $.page.ticket
            , selectType: fw.fwData.FWSelectType.Multi
            , selectCallback: "openSetCantonCallback"
            , userID: $.page.params.mUserID
            , cantonCode: userCantonCode
    };
    var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysBasicManage/cantonSelect.htm", $.page.webSiteRootUrl), data);
    //打开窗口
    mini.open({
        url: url
            , title: "选择行政区"
            , width: 768
            , height: 512
            , onload: function () {
            }
            , ondestroy: function (action) {
                //判断非（关闭和取消）窗口
                if (action != "close" && action != "cancel") {
                };
            }
    });
    //    } else {
    //        mini.alert("请选择用户所属行政区！"); 
    //    };
};

//分配行政区
function openSetCantonCallback(entityList) {
    var mUserIDList = [$.page.params.mUserID];
    if (mUserIDList) {
        var insertMDataIDList = [];
        var deleteMDataIDList = [];
        if (entityList != null && entityList.length > 0) {
            for (var i = 0; i < entityList.length; i++) {
                insertMDataIDList.push(entityList[i].dataID);
            };
        };

        //分配功能
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "sysBasicManage"
            , methodName: "updateFWUserMappingCantonCodeListByMUserID"
            , data: {
                ticket: $.page.ticket
                , userID: userID
                , insertMDictionaryDataIDList: insertMDataIDList
            }
            , beforeSend: function () {
                fw.fwButton.fwButtonHelper.addWait($.page.idM.openSetMenu);
            }
            , success: function (resultData) {
                //判断启用停用成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                    //datagrid加载数据
                    mini.alert("分配行政区成功！");
                    cantonSelected_Render();
                };
            }
            , complete: function () {
                fw.fwButton.fwButtonHelper.removeWait($.page.idM.openSetMenu);
            }
        }));
    };
};

//获取已分配行政区权限
function cantonSelected_Render() {
    if (fw.fwObject.FWObjectHelper.hasValue(userID)) {
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall"
            , serviceName: "sysBasicManage"
            , methodName: "queryCantonListFilter"
            , data: {
                ticket: $.page.ticket
                , userID: userID
            }
            , success: function (resultData) {
                //判断加载数据成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                    var cantonJQ = $("#cantonSelectedList");
                    cantonJQ.empty();
                    for (var i = 0; i < resultData.data.length; i++) {
                        $('<a class="select" href="#">' + resultData.data[i].name + '</a>').appendTo(cantonJQ);
                    };
                };
            }
        }));
    };
};

function cantonChanged() {
    $("#cantonSelectedList").html("");
};