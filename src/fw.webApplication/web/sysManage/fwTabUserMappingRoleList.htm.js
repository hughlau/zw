var txtkeywordJQ = undefined;
var treegridJQ = undefined;
var userID = undefined;
$.page.pageLoad = function () {
    txtkeywordJQ = $.page.idM.keyword;
    treegridJQ = $.page.idM.treegrid1;
    userID = $.page.params.mUserID;
    if (fw.fwObject.FWObjectHelper.hasValue(userID)) {
        query();
    };
};
function onSearch() {
    if (fw.fwObject.FWObjectHelper.hasValue(userID)) {
        query();
    };
}
//查询展示
function query() {
    $.page.idM.treegrid1.loading();
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall",
        serviceName: "sysManage",
        methodName: "queryListByUserIDOrRoleCode",
        data: {
            ticket: $.page.ticket,
            mUserID: userID
        },
        success: function (resultData) {
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                //设置datagrid数据
                treegridJQ.loadList(resultData.data, "dictionaryCode", "parentDictionaryCode");
            }
        }
    }));
};
