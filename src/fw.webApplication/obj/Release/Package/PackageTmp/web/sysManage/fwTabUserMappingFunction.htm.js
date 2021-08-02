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
        methodName = "queryFunctionTreeListByUserID";
        queryData = { ticket: $.page.ticket, userID: userID, isAllocation: 1 }
    } else if (fw.fwObject.FWObjectHelper.hasValue(mRoleCode)) {
        methodName = "queryFunctionTreeListByRoleCode";
        queryData = { ticket: $.page.ticket, roleCode: mRoleCode, isAllocation: 1 };
    }
    query(queryData);
};
function onSearch() {
    if (fw.fwObject.FWObjectHelper.hasValue(userID)) {
        query(queryData);
    };
}
//查询展示
var data = [];
function query(queryData) {
    $.page.idM.treegrid1.loading();
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall",
        serviceName: "sysManage",
        methodName: methodName,
        data: queryData,
        success: function (resultData) {
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                for (var i = 0; i < resultData.data.length; i++) {
                    data.push({ mCode: resultData.data[i].mCode, children: resultData.data[i].children });
                }
                //设置datagrid数据
                treegridJQ.loadList(resultData.data, "dictionaryCode", "parentDictionaryCode");



            }
        }
    }));
};

//单元格渲染事件
function dataGrid_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "children":
            for (var i = 0; i < data.length; i++) {
                if (data[i].mCode == e.record.mCode) {
                    if (data[i].children.length > 0) {
                        for (var j = 0; j < data[i].children.length; j++) {
                            html += data[i].children[j].mName + "; ";
                        }
                    }

                }
            };
            break;
        default:
            break;
    };
    return html;
};
