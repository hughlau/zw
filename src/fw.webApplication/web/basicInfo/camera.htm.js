//查询条件
var conditionData = {};
var buttonAddJQ = null;
var buttonEditJQ = null;
var buttonDeleteJQ = null;
var buttonSearchJQ = null;

$.page.pageInit = function () {
};
/* 页面加载 */
$.page.pageLoad = function () {
    buttonAddJQ = $("#buttonAdd");
    buttonEditJQ = $("#buttonEdit");
    buttonDeleteJQ = $("#buttonDelete");
    buttonSearchJQ = $("#buttonSearch");

    buttonSearchJQ.bind("click", function () {
        onSearch();
    }).click();

    buttonAddJQ.bind("click", function () {
        openInfo("add",undefined,"新增摄像机");
    });

    buttonEditJQ.bind("click", function () {
        var entity = getSelectedEntity();
        if (!entity) {
            return;
        };
        openInfo("edit", entity.id, "修改摄像机信息");
    });

    buttonDeleteJQ.bind("click", function () {
        del();
    });
};

//查看摄像
function onLook() {
    conditionData = $.page.idM.conditionForm.getData();
    var href = window.location.protocol + "//" + window.location.host + "/web/basicInfo/cameraList.htm?cameraName=" + conditionData.cameraName + "&IPAddress=" + conditionData.IPAddress + "&addressName=" + conditionData.addressName;
    var a = document.createElement("a");
    a.setAttribute("href", href);
    a.setAttribute("target", "_blank");
    document.body.appendChild(a);
    a.click();
}

//查询
function onSearch(cSettings) {
    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();
    //datagrid加载数据
    datagrid1_Load(1, undefined, cSettings);
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
function datagrid1_Load(pageIndex, pageSize, cSettings) {
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
    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.datagrid1.sortField)) {
        //将排序字段设置为datagrid的排序字段
        sortFieldList = [{
            fieldName: $.page.idM.datagrid1.getSortField()
            , sortType: fw.fwData.FWSortType[$.page.idM.datagrid1.getSortOrder()]
        }];
    };
    //开启datagrid数据加载锁屏
    $.page.idM.datagrid1.loading();

    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "basicInfo"
        , methodName: "queryPageCamera"
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
            else {
                var erroInfo = resultData.infoList.join("<br>");
                $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
            };

        }
    }, cSettings));
};

function datagrid1_Renderer(e) {
    var html = "";
    var url = window.location.protocol + "//" + window.location.host;
    switch (e.field) {
        case "cameraName":
            html = "<a href='"+url+"/web/basicInfo/cameraList.htm?id=" + e.row.id + "' style=\"color:blue;\" target='_blank'>" + e.value + "</a>"
        break;
    default:
        break;
    };
    return html;
};

//数据导出
function dataExport() {
    onSearch({ isExport: true, pageSize: fw.fwNumber.intMaxValue, pageIndex: 1 });
    $.page.exportFile({ idM: $.page.idM.datagrid1, reportName: '摄像机列表' });
};

//del
function del(cameraIdList) {
    //获得选中的摄像机id集合
    if (!fw.fwObject.FWObjectHelper.hasValue(cameraIdList)) {
        cameraIdList = getCameraId();
    };

    mini.confirm("确定删除记录？", "确定？",
        function (action) {
            if (action == "ok") {
                //启用停用
                $.page.ajax($.page.getAjaxSettings({
                    serviceType: "crossDomainCall"
                    , serviceName: "basicInfo"
                    , methodName: "delCameraByIdCascade"
                    , data: {
                        ticket: $.page.ticket
                        , cameraIdList: cameraIdList
                    }
                    , success: function (resultData) {
                        //判断启用停用成功
                        if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null && resultData.data == true) {
                            //datagrid加载数据
                            datagrid1_Load($.page.idM.datagrid1.pageIndex + 1);
                            $.page.showTips({ content: "删除操作成功.", state: "success" });
                        } else {
                            var erroInfo = resultData.infoList.join("<br>");
                            $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
                        };
                    }
                }));
            };
        }
    );
};

//add or edit
function openInfo(action, id, title) {
    var data = { ticket: $.page.ticket, action: action };
    if (action == "edit") {
        data.id = id;
    }

    //判断满足条件打开窗口
    if (action == "add" || action == "edit") {
     
        //获得传入的参数字符串 
        var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/basicInfo/addOrUpdateCarema.htm", $.page.webSiteRootUrl), data);
        //打开窗口
        mini.open({
            url: pageUrl
            , title: title
            , width: 500
            , height: 370
            , onload: function () {
                
            }
            , ondestroy: function (action) {
                //判断非（关闭和取消）窗口
                if (action != "close" && action != "cancel") {
                    //datagrid1加载数据
                    datagrid1_Load();
                };
            }
        });
    };

};

function getSelectedEntity() {
    //获取选中项对象
    var entity = $.page.idM.datagrid1.getSelected();
    //判断对象没有值
    if (!$.pageCustomer.hasValue(entity)) {
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

//获得选中的摄像机id集合
function getCameraId() {
    var cameraIdList = undefined;
    //获取选中项对象集合
    var entityList = getSelectedEntityList();
    //判断对象集合有值
    if (fw.fwObject.FWObjectHelper.hasValue(entityList) && entityList.length > 0) {
        cameraIdList = [];
        for (var i = 0; i < entityList.length; i++) {
            cameraIdList.push(entityList[i].id);
        };
    };
    return cameraIdList;
};
