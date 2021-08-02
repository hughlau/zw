var dataList = [{ cantonName: "海虞镇", monitorSiteName: "海虞镇污水处理设施-01", monitorSiteCode: "3205810202", ProjectCode: "1a02f64f-9e00-4f61-a428-803ba4aaca5b" }
, { cantonName: "新港镇", monitorSiteName: "新港镇污水处理设施-01", monitorSiteCode: "3205810301", ProjectCode: "1a02f64f-9e00-4f61-a428-803ba4aaca5b" }
, { cantonName: "海虞镇", monitorSiteName: "海虞镇污水处理设施-01", monitorSiteCode: "3205810202", ProjectCode: "6021231a-ac94-40f4-b54a-c083fb3ab293" }
, { cantonName: "新港镇", monitorSiteName: "新港镇污水处理设施-01", monitorSiteCode: "3205810301", ProjectCode: "6021231a-ac94-40f4-b54a-c083fb3ab293" }
]

var buttonDeleteJQ = null;
var buttonAddJQ = null;
var buttonSearchJQ = null;

var ProjectCode = null;
var ProjectName = null;
$.page.pageLoad = function () {
    ProjectCode = $.page.params.ProjectCode;
    ProjectName = $.page.params.ProjectName;

    buttonDeleteJQ = $("#buttonDelete");
    buttonAddJQ = $("#buttonAdd");
    buttonSearchJQ = $("#buttonSearch");

    buttonDeleteJQ.bind("click", function () {
        deleteProjectMonitorSiteInfo();
    });
    buttonSearchJQ.bind("click", function () { onSearch(); }).click();

    buttonAddJQ.bind("click", function () { addProjectMonitorSiteInfo(); });
};

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

function onSearch() {

    var newList = [];
    for (var i = 0; i < dataList.length; i++) {
        if (dataList[i].ProjectCode.indexOf(ProjectCode) > -1) {
            newList.push(dataList[i]);
        };
    };

    $.page.idM.datagrid1.setData(newList);
};

function addProjectMonitorSiteInfo() {
    mini.open({
        url: $.page.webSiteRootUrl + "web/common/monitorSiteSelect.htm",
        title: "选择列表",
        width: 650,
        height: 380,
        ondestroy: function (action) {
            if (action == "ok") {
                var iframe = this.getIFrameEl();
                var data = iframe.contentWindow.GetData();
                data = mini.clone(data);
                var newItem = {};
                if (data) {
                    var isHas = false;
                    for (var i = 0; i < dataList.length; i++) {
                        if (dataList[i].monitorSiteCode.indexOf(data.monitorSiteCode) > -1) {
                            isHas = true;
                            break;
                        };
                    };
                    if (!isHas) {
                        newItem.ProjectCode = ProjectCode;
                        newItem.monitorSiteName = data.monitorSiteName;
                        newItem.monitorSiteCode = data.monitorSiteCode;
                        dataList.push(newItem);
                        buttonSearchJQ.click();
                    } else {
                        mini.alert("该设施已经分配给");
                    };
                };
            };
        }
    });
};

function deleteProjectMonitorSiteInfo() {
    var entity = getSelectedEntity();

    mini.confirm("确定删除记录？", "确定？",
            function (action) {
                if (action == "ok") {
                    for (var i = 0; i < dataList.length; i++) {
                        if (dataList[i].monitorSiteCode.indexOf(entity.monitorSiteCode) > -1) {
                            dataList.splice(i, 1);
                        };
                    };
                    buttonSearchJQ.click();
                };
            });
};