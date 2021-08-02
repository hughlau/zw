var txtkeywordJQ = undefined;
var treegridJQ = undefined;
var userID = undefined;
var mRoleCode = undefined;
var methodName = "";
$.page.pageLoad = function () {
    txtkeywordJQ = $.page.idM.keyword;
    treegridJQ = $.page.idM.treegrid1;
    userID = $.page.params.mUserID;
    mRoleCode = $.page.params.mRoleCode;
    var queryData = {};
    if (fw.fwObject.FWObjectHelper.hasValue(userID)) {
        methodName = "queryListMFWUserMappingMenu";
        queryData = { ticket: $.page.ticket, queryParams: { mUserIDList: [userID]} }
    } else if (fw.fwObject.FWObjectHelper.hasValue(mRoleCode)) {
        methodName = "queryListMFWRoleMappingMenu";
        queryData = { ticket: $.page.ticket, queryParams: { mRoleCodeList: [mRoleCode]} }
    }
    query(queryData);
};
function onSearch() {
    if (fw.fwObject.FWObjectHelper.hasValue(userID)) {
        query(queryData);
    };
}
//查询展示
function query(queryData) {
    exceptNodes = null;
    //开启treegrid数据加载锁屏
    $.page.idM.treegrid1.loading();
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "queryListMFWMenu"
        , data: {
            ticket: $.page.ticket
            , mMenuTypeCode: "mainMenu"
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                var entityList = resultData.data;
                //加载数据
                $.page.ajax($.page.getAjaxSettings({
                    serviceType: "crossDomainCall"
                    , serviceName: "sysManage"
                    , methodName: methodName
                    , data: queryData
                    , success: function (resultData) {
                        //判断加载数据成功
                        if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                            function recursiveMenu(obj) {
                                if (obj.length > 0) {
                                    for (var i = 0; i < obj.length; i++) {
                                        obj[i].mIsHas = 0;
                                        recursiveMenu(obj[i]);
                                    };
                                } else if (obj.mMenuCode) {
                                    for (var j = 0; j < resultData.data.length; j++) {
                                        if (obj.mMenuCode == resultData.data[j].mMenuCode) {
                                            obj.mIsHas = 1;
                                            obj.checked = true;
                                            break;
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
