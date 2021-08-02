//var dataSource = { OperAndMaintenanceName: "中国中车股份有限公司", OMDate: fw.fwDateTime.FWDateTimeHelper.toString(new Date(), $.pageCustomer.dateDay), MonitorSiteName: "虞山镇污水处理设施-01" };

var divFormJQ = null;
var btnEditFileJQ = null;
var ID = null;
$.page.pageLoad = function () {
    ID = $.page.params.ID;
    divFormJQ = $("#divForm");
    btnEditFileJQ = $.page.idM.btnEditFile;
    var dataSourceList = $.OperationMaintenancePage.OperationMaintenceList;

    if ($.pageCustomer.hasValue(ID)) {
        var Entity = null;
        for (var i = 0; i < dataSourceList.length; i++) {
            if (dataSourceList[i].ID == ID) {
                Entity = dataSourceList[i];
                break;
            };
        };
        $.OperationMaintenancePage.ShowFunction("View", $("#divForm"));
        $.pageCustomer.SetJsonData("ViewClass", Entity, divFormJQ);
    };

    $("#buttonCancel").bind("click", function () {
        CloseWindow("cancel");
    });

    $("#buttonSave").bind("click", function () {

        $.page.idM.divForm.validate();
        //判断表单验证不成功
        if ($.page.idM.divForm.isValid() == false) { return; };
        var isValid = true;

        var data = $.pageCustomer.GetJsonData("ViewClass", divFormJQ);
        var data2 = $.page.idM.divForm.getData();
        mini.alert("保存成功。");
        $.page.idM.divForm.reset();
    });
};

function onButtonEdit(e) {
    var btnEdit = this;
    mini.open({
        url: $.page.webSiteRootUrl + "web/operationMaintenance/SelectWindow.htm",
        title: "选择列表",
        width: 650,
        height: 380,
        ondestroy: function (action) {
            //if (action == "close") return false;
            if (action == "ok") {
                var iframe = this.getIFrameEl();
                var data = iframe.contentWindow.GetData();
                data = mini.clone(data);
                $("#txtHidden").data("dataList", data);
                var html = "";
                if (data != null && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        html += data[i].name + ",";
                    };
                };
                btnEdit.setText(html.substr(0, html.length - 1));
            };

        }
    });
};

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