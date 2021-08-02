//页面初始化
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {
    };
};

//查询条件
var conditionData = undefined;

//页面加载
$.page.pageLoad = function () {
    //开始查询
    onSearch();
};

//查询
function onSearch() {
    //搜集查询条件
    conditionData = $.page.idM.conditionForm.getData();
    //datagrid加载数据
    datagrid1_Load(1);
};

//数据加载前包括（页数发生变化时）
function datagrid1_BeforeLoad(e) {
    //取消datagrid的miniui自动加载
    e.cancel = true;
    //miniui的页数与实际相差1页
    var pageIndex = e.data.pageIndex + 1
    var pageSize = e.data.pageSize;
    //datagrid加载数据
    datagrid1_Load(pageIndex, pageSize);
};

//单元格渲染事件
function datagrid1_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "mIsAdd":
            switch (e.value) {
                case "0":
                    html = "<label style=\"color:Red\">下发失败</label>";
                    break;
                case "1":
                    html = "<label style=\"color:Green\">下发成功</label>";
                    break;
                default:
                    html = "--";
                    break;
            }
            break;
        case "mUserStatus":
            switch (e.value) {
                case "-1":
                    html = "<label style=\"color:Red\">停用</label>";
                    break;
                case "0":
                    html = "<label style=\"color:Blue\">不存在</label>";
                    break;
                case "1":
                    html = "<label style=\"color:Green\">存在</label>";
                    break;
                default:
                    html = "--";
                    break;
            }
            break;
        case "mIsDis":
            switch (e.value) {
                case "0":
                    html = "<label style=\"color:Green\">启用</label>";
                    break;
                case "1":
                    html = "<label style=\"color:Red\">停用</label>";
                    break;
                default:
                    html = "--";
                    break;
            }
            break;
        case "mIsDel":
            switch (e.value) {
                case "0":
                    html = "<label style=\"color:Green\">未删除</label>";
                    break;
                case "1":
                    html = "<label style=\"color:Red\">已删除</label>";
                    break;
                default:
                    html = "--";
                    break;
            }
            break;
        default:
            break;
    };
    return html;
};

//datagrid数据加载
function datagrid1_Load(pageIndex, pageSize) {
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
    conditionData.mUserID = $.page.params.mUserID;
    //开启datagrid数据加载锁屏
    $.page.idM.datagrid1.loading();
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "queryPageMFWAppUserList"
        , data: {
            ticket: $.page.ticket
            , pageParams: {
                pageSize: pageSize
                , pageIndex: pageIndex
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
            };
        }
    }));
};
