var dataSourceList =
[{ 'siteNo': '3205810001', 'siteName': '董浜镇污水处理设施-01', 'timeFrom': '2015-08-02 12:10', 'maintainContent': '易耗品更换', 'maintainUser': '王合金' },
{ 'siteNo': '3205810001', 'siteName': '董浜镇污水处理设施-01', 'timeFrom': '2015-08-13 12:10', 'maintainContent': '设施定期维护', 'maintainUser': '刘尉' },
{ 'siteNo': '3205810001', 'siteName': '董浜镇污水处理设施-01', 'timeFrom': '2015-08-16 12:10', 'maintainContent': '设施风机故障', 'maintainUser': '王合金' },
{ 'siteNo': '3205810001', 'siteName': '董浜镇污水处理设施-01', 'timeFrom': '2015-08-22 12:10', 'maintainContent': '设施断电', 'maintainUser': '刘尉' },
{ 'siteNo': '3205810001', 'siteName': '董浜镇污水处理设施-01', 'timeFrom': '2015-08-30 12:10', 'maintainContent': '设施无法联网', 'maintainUser': '王合金' } ];

//页面初始化
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {

        "cantonCode": {
            dataSourceName: "sysBasicManage.queryCantonList",
            dataSourceParams: { ticket: $.page.ticket }
        },
        "mBIZEQStatus": {
            dataSourceName: "sysManage.getDictionary"
            , dataSourceParams: { pCode: "BIZEQStatus" }
        }
    };
};

var buttonAddJQ = null;
var buttonEditJQ = null;
var buttonDeleteJQ = null;
var buttonSearchJQ = null;

var callBackHanlder = undefined; //map回调函数

$.page.pageLoad = function () {
    buttonAddJQ = $("#buttonAdd");
    buttonEditJQ = $("#buttonEdit");
    buttonDeleteJQ = $("#buttonDelete");
    buttonSearchJQ = $("#buttonSearch");

//    $.page.idM.mBIZEQStatus.setText("请选择...");
//    $.page.idM.mBIZEQStatus.setValue("");

    buttonAddJQ.bind("click", function () {
        var data = { ticket: $.page.ticket, action: $.pageCustomer.enumOperate.add };
        openInfo(data);
    });

    buttonEditJQ.bind("click", function () {
        var entity = getSelectedEntity();
        openInfo($.pageCustomer.enumOperate.edit, entity.monitorSiteCode);
    });

    buttonDeleteJQ.bind("click", function () {
        deleteInfo();
    });

    buttonSearchJQ.bind("click", function () { onSearch(); }).click();

 
    $.page.idM.mUserID.setText('董浜镇污水处理设施-01'); 

    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.callBackHanlder)) {
        callBackHanlder = $.page.params.callBackHanlder;
    };
};

function onCloseClick(e) {
    var obj = e.sender;
    obj.setText("请选择...");
    obj.setValue("");
};

function onValueChanged(e) {
    var obj = e.sender;
    if (!fw.fwObject.FWObjectHelper.hasValue(obj.value)) {
        obj.setText("请选择...");
    };
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
        case "monitorSiteName":
            html = "<a href=\"javascript:openInfo('" + $.pageCustomer.enumOperate.view + "','" + e.record.monitorSiteCode + "')\" style=\"color:blue;\">" + e.value + "</a>";
            html = e.value;
            break;
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

    //开启datagrid数据加载锁屏
    $.page.idM.datagrid1.loading();
    //加载数据
    var queryParams = $.page.idM.conditionForm.getData();
    var searchList = [];
    if ($.pageCustomer.hasValue(queryParams.keyword)) {
        for (var i = 0; i < dataSourceList.length; i++) {
            if (dataSourceList[i].monitorSiteName.indexOf(queryParams.keyword) > 0) {
                searchList.push(dataSourceList[i]);
            };
        };
    } else {
        searchList = dataSourceList;
    };
    $.page.idM.datagrid1.set({
        pageIndex: pageIndex
        , pageSize: $.page.idM.datagrid1.pageSize
        , totalCount: searchList.length
        , data: searchList
    });
};

function openInfo(action, monitorSiteCode) {
    var data = { ticket: $.page.ticket, action: action };
    if (action != $.pageCustomer.enumOperate.add) {
        data.monitorSiteCode = monitorSiteCode;
    };
    var pageParams = { url: "web/basicInfo/monitorSite.htm", width: 800, height: 600, title: "监测点位" };
    $.pageCustomer.miniOpen(data, pageParams);

};

function deleteInfo() {
    var entity = getSelectedEntity();
    mini.confirm("确定删除记录？", "确定？",
            function (action) {
                if (action == "ok") {
                    for (var i = 0; i < dataSourceList.length; i++) {
                        if (entity.monitorSiteCode == dataSourceList[i].monitorSiteCode) {
                            mini.alert("删除成功。");
                            dataSourceList.splice(i, 1);
                            buttonSearchJQ.click();
                            continue;
                        };
                    };
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


//行点击事件
function dataGrid_Rowclick(e) {
    //window.parent.eval("" + callBackHanlder + "")(e.row.posX, e.row.posY);
};

//打开选择用户窗口
function onMUserIDSelect() {
    //参数
    var data = {
        ticket: $.page.ticket
        , selectType: fw.fwData.FWSelectType.Single
        , selectCallback: "onMUserIDSelectCallback"
        , selectClearCallback: "onMUserIDSelectClearCallback"
        //, keyword: $.page.idM.mUserID1.getText()
    };  

    //参数序列化
    var pageurl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/common/monitorSiteSelect.htm", $.page.webSiteRootUrl), data); 
    //打开选择用户窗口
    mini.open({
        url: pageurl
        , title: "设施选择"
        , width: 400
        , height: 380
        , onload: function () {
            //var iframe = this.getIFrameEl();
            //iframe.contentWindow;
        }
        , ondestroy: function (action) {
            
        }
    });
     
};

//选择用户完成后回调
function onMUserIDSelectCallback(entity) {
    if (fw.fwObject.FWObjectHelper.hasValue(entity)) {
        $.page.idM.mUserID1.setValue('董浜镇污水处理设施-01'); 
    };
};
//选择清除用户后回调
function onMUserIDSelectClearCallback() {
    $.page.idM.mUserID1.setValue(""); 
};