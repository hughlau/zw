
$.page.pageLoad = function () {

    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.selectType) && fw.fwObject.FWObjectHelper.hasValue($.page.params.selectCallback)) {
        if ($.page.params.selectType == fw.fwData.FWSelectType.Single) {
            $.page.idM.select.show();
        } else {
            $.page.idM.select.show();
        };
    };

    onSearch();
};

function onSearch() {
    datagrid1_Load(1);
};

function datagrid1_BeforeLoad(e) {
    e.cancel = true;
    var pageIndex = e.data.pageIndex + 1
    var pageSize = e.data.pageSize;
    datagrid1_Load(pageIndex, pageSize);
};
function datagrid1_RawCell(e) {
    if (e.column.type == "checkcolumn") {
        if (fw.fwObject.FWObjectHelper.hasValue(e.record.isImport) && e.record.isImport == 1) {
            e.cellHtml = ""
        };
    };
};
function datagrid1_BeforeSelect(e) {
    if (fw.fwObject.FWObjectHelper.hasValue(e.record.isImport) && e.record.isImport == 1) {
        e.cancel = true;
    };
};
function datagrid1_Renderer(e) {
    switch (e.field) {
        case "isImport":
            return (fw.fwObject.FWObjectHelper.hasValue(e.value) && e.value == 1) ? "是" : "否";
            break;
        default:
            return "";
            break;
    };
};
function datagrid1_Load(pageIndex, pageSize) {
    if (!fw.fwObject.FWObjectHelper.hasValue(pageIndex)) {
        pageIndex = $.page.idM.datagrid1.pageIndex;
    };
    if (!fw.fwObject.FWObjectHelper.hasValue(pageSize)) {
        pageSize = $.page.idM.datagrid1.pageSize;
    };
    var formData = $.page.idM.conditionForm.getData();
    var sortFieldList = null;
    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.datagrid1.sortField)) {
        sortFieldList = [{
            fieldName: $.page.idM.datagrid1.getSortField()
            , sortType: fw.fwData.FWSortType[$.page.idM.datagrid1.getSortOrder()]
        }];
    };
    $.page.idM.datagrid1.loading();
    $.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "pageTable__FWTable"
        , data: {
            ticket: $.page.ticket
            , pageParams: {
                pageSize: pageSize
                , pageIndex: pageIndex
                , sortFieldList: sortFieldList
            }
            , keyword: formData.keyword
        }
        , success: function (resultData) {
            resultData.data.data = fw.fwDataTableToJson(resultData.data.fwDataTable);

            $.page.idM.datagrid1.set({
                pageIndex: resultData.data.pageIndex - 1
                , pageSize: resultData.data.pageSize
                , totalCount: resultData.data.recordCount
                , data: resultData.data.data
            });
        }
    }));
};

function select() {
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.selectType) && fw.fwObject.FWObjectHelper.hasValue($.page.params.selectCallback)) {
        if ($.page.params.selectType == fw.fwData.FWSelectType.Single) {
            var objArray = $.page.idM.datagrid1.getSelecteds()
            if (fw.fwObject.FWObjectHelper.hasValue(objArray) && objArray.length > 0) {
                fw.callFunction(fw.openWindow(), $.page.params.selectCallback, [entityList]);
                fw.closeWindow();
            } else {
                mini.alert("最少选择一条记录！");
            };
        } else if ($.page.params.selectType == fw.fwData.FWSelectType.Multi) {
            var obj = $.page.idM.datagrid1.getSelecteds();
            if (fw.fwObject.FWObjectHelper.hasValue(obj)) {
                fw.callFunction(fw.openWindow(), $.page.params.selectCallback, [obj]);
                fw.closeWindow();
            } else {
                mini.alert("请选择一条记录！");
            };
        };
    };
};