var dataSourceList = [];

var buttonAddJQ = null;
var buttonEditJQ = null;
var buttonDeleteJQ = null;
var action = null;
var buttonSearchJQ = null;
var buttonAddInfoJQ = null;
var callBackHanlder = undefined; //map回调函数
window.top['_projectCache'] = "init";  //标识系统登录后，尚未选择项目
$.page.pageInit = function () {
    $.page.dataSourceSettingsDictionary = {
        "cmbCanton": {
            dataSourceName: "sysBasicManage.getCantonDicData"
            , dataSourceParams: {  }
        }
    };
};
$.page.pageLoad = function () {
    buttonAddJQ = $("#buttonAdd");
    buttonEditJQ = $("#buttonEdit");
    buttonDeleteJQ = $("#buttonDelete");
    buttonSearchJQ = $("#buttonSearch");
    buttonAddInfoJQ = $("#buttonAddInfo");
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.callBackHanlder)) {
        callBackHanlder = $.page.params.callBackHanlder;
    };
    action = $.page.params.action;
    if (action == 'view') {
        $.page.idJQ.functionList.hide();
    } else {
        $.page.idM.datagrid1.hideColumn("op");
    };
    buttonAddJQ.bind("click", function () {
        openInfo($.pageCustomer.enumOperate.add);
    });

    buttonEditJQ.bind("click", function () {
        var entity = getSelectedEntity();
        if (!entity) {
            return;
        };
        openInfo($.pageCustomer.enumOperate.edit, entity.projectCode);
    });

    buttonDeleteJQ.bind("click", function () {
        deleteInfo();
    });

    buttonSearchJQ.bind("click", function () { onSearch(); }).click();

    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.isList)) {
        $.page.idJQ.conditionForm.hide();
    };
};

//行点击事件
function zoomtoCantonPts(cantonCode,PosX, PosY) {
    window.parent.eval("" + callBackHanlder + "")(cantonCode, PosX, PosY);
};

//行点击事件
//add by songshasha 2017-11-08 新增方法，直接点击项目列表行，进入项目预览，省略了之前先定位，再预览的步骤。
function zoomtoCantonPtsNew(cantonCode, projectNo) {
    window.top['_projectCache'] = projectNo;
    window.top['cantonCodeCache'] = cantonCode;
    var functionName = 'openSelectedCantonInfo';
    window.parent.eval("" + functionName + "")(cantonCode);

};


function onSearch() {
    datagrid1_Load(0);
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

function datagrid1_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "projectName":
            if (action == 'view') {
                html = e.value;
            } else {
                html = "<a style=\"text-decoration:none\" href=\"javascript:openInfo('" + $.pageCustomer.enumOperate.edit + "','" + e.record.projectCode + "')\" style=\"color:blue;\">" + e.value + "</a>";
            };
            break;
        case "operateTime":
            html = (fw.fwObject.FWObjectHelper.hasValue(e.value)) ? fw.fwObject.FWObjectHelper.toString(fw.fwObject.FWObjectHelper.toDateTime(e.value), $.pageCustomer.dateDay) : "--";
            break;
        case "dingwei":
            html = "<a style=\"text-decoration:none\" href=\"javascript:zoomtoCantonPtsNew('" + e.record.cantonCode + "','" + e.record.projectNo + "');\" style=\"color:blue;\"><span style=\"color:blue;\">浏览</span></a>";
       // ,'" + e.record.longitude + "','" + e.record.latitude + "'
        default:
            break;
    };
    return html;
};

function datagrid1_Load(pageIndex, pageSize) {
    //如果没传入页数
    if (!$.pageCustomer.hasValue(pageIndex)) {
        //将页数设置为datagrid的页数
        pageIndex = $.page.idM.datagrid1.pageIndex;
    };
    //如果没传入分页大小
    if (!$.pageCustomer.hasValue(pageSize)) {
        //将分页大小设置为datagrid的分页大小
        pageSize = $.page.idM.datagrid1.pageSize;
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
    var conditionData = $.page.idM.conditionForm.getData();

    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "basicInfo"
        , methodName: "queryPageProject"
        , data: {
            ticket: $.page.ticket
            , pageParams: {
                pageSize: pageSize
                , pageIndex: pageIndex
                //, sortFieldList: sortFieldList
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
            } else {
                var erroInfo = resultData.infoList.join("<br>");
                $.page.showTips({ content: "查询失败!<br>", state: "danger" });
            };

        }
    }));

};

function openInfo(action, projectCode) {
    var data = { ticket: $.page.ticket, action: action };
    var pageParams = {};
    if (action != $.pageCustomer.enumOperate.add) {
        data.projectCode = projectCode;
    };
    var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/basicInfo/project.htm", $.page.webSiteRootUrl), data);
    //打开窗口
    mini.open({
        url: url
        , title: "项目信息"
        , width: 860
        , height: 500
        , onload: function () {
        }
        , ondestroy: function (action) {
            //判断非（关闭和取消）窗口
            if (action != "close" && action != "cancel") {
                //datagrid加载数据
                onSearch();
            };
        }
    });
};

function deleteInfo() {
    var entity = getSelectedEntity();
    entity.isDel = 1;
    mini.confirm("确定删除记录？", "确定？", function (action) {
        if (action == "ok") {
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall"
                , serviceName: "basicInfo"
                , methodName: "updateBLLProject"
                , data: { ticket: $.page.ticket
                , mEntity: entity
                }
                , success: function (resultData) {
                    //判断加载数据成功
                    if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                        mini.alert("删除成功", "提示", function () {
                            onSearch();
                        });
                    }
                    else {
                        var erroInfo = resultData.infoList.join("<br>");
                        $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
                    };
                }
            }));
        };
    });
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

//结束时间设置
function onDrawDateBegin(e) {
    var date = e.date;
    var d = new Date();

    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.mCallTimeTo.value)) {
        if (date.getTime() > $.page.idM.mCallTimeTo.value) {
            e.allowSelect = false;
        };
    };
};

//开始时间设置
function onDrawDateEnd(e) {
    var date = e.date;
    var d = new Date();

    if (fw.fwObject.FWObjectHelper.hasValue($.page.idM.mCallTimeFrom.value)) {
        if (date.getTime() < $.page.idM.mCallTimeFrom.value) {
            e.allowSelect = false;
        };
    };
};
