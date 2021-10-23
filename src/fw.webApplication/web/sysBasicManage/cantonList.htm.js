var datagrid1JQ = null;
var code = "320000";

/* 页面加载 */
$.page.pageLoad = function () {
    datagrid1JQ = $.page.idM.treegrid1;
    var btnSearchJQ = $("#btnSearch"); //查询
    var btnAddJQ = $("#btnAdd"); //增加
    var btnAddParentJQ = $("#btnAddParent"); //增加根节点
    var btnUpdateJQ = $("#btnUpdate"); //修改
    var btnDeleteJQ = $("#btnDelete"); //删除

    btnSearchJQ.bind("click", function () {
        datagrid1DataGrid_Load(code);
    })
    btnSearchJQ.click();

    btnAddJQ.bind("click", function () {
        var entity = $.sysBasicManagePage.getSelectedEntity(datagrid1JQ);
        var data = { ticket: $.page.ticket, cantonLevel: "" + entity.cantonLevel + "", parentCode: entity.cantonCode }
        mini.open({
            url: $.page.webSiteRootUrl + fw.fwUrl.FWUrlHelper.addParams("web/sysBasicManage/canton.htm", data)//"?"
            , title: "厂区信息"
            , width: 640
            , height: 512
            , onload: function () {
                //var iframe = this.getIFrameEl();
                //iframe.contentWindow;
            }
            , ondestroy: function (action) {
                //判断非（关闭和取消）窗口
                if (action != "close" && action != "cancel") {
                    //datagrid加载数据
                    datagrid1DataGrid_Load(code);
                };
            }
        });
    });

    btnAddParentJQ.bind("click", function () {
        var data = { ticket: $.page.ticket, parentCode: code, cantonLevel: "0" };
        mini.open({
            url: $.page.webSiteRootUrl + fw.fwUrl.FWUrlHelper.addParams("web/sysBasicManage/canton.htm", data)//"?"
            , title: "厂区信息"
            , width: 640
            , height: 512
            , onload: function () {
                //var iframe = this.getIFrameEl();
                //iframe.contentWindow;
            }
            , ondestroy: function (action) {
                //判断非（关闭和取消）窗口
                if (action != "close" && action != "cancel") {
                    //datagrid加载数据
                    datagrid1DataGrid_Load(code);
                };
            }
        });
    });

    btnUpdateJQ.bind("click", function () {
        var entity = $.sysBasicManagePage.getSelectedEntity(datagrid1JQ);
        var data = { ticket: $.page.ticket, cantonCode: entity.cantonCode }
        mini.open({
            url: $.page.webSiteRootUrl + fw.fwUrl.FWUrlHelper.addParams("web/sysBasicManage/canton.htm", data)//"?"
            , title: "异常信息反馈"
            , width: 640
            , height: 512
            , onload: function () {
                //var iframe = this.getIFrameEl();
                //iframe.contentWindow;
            }
            , ondestroy: function (action) {
                //判断非（关闭和取消）窗口
                if (action != "close" && action != "cancel") {
                    //datagrid加载数据
                    datagrid1DataGrid_Load(code);
                };
            }
        });
    });

    btnDeleteJQ.bind("click", function () {
        var mCantonCodeList = $.sysBasicManagePage.getSelectedEntityCodeList(datagrid1JQ, "cantonCode");
        //获得选中项编码集合
        if (!fw.fwObject.FWObjectHelper.hasValue(mCantonCodeList)) {
            mini.alert("请选择一项！");
        } else {
            mini.confirm("确定删除记录？", "确定？",
            function (action) {
                if (action == "ok") {
                    //删除
                    $.page.ajax($.page.getAjaxSettings({
                        serviceType: "crossDomainCall"
                        , serviceName: "sysBasicManage"
                        , methodName: "deleteMCantonByMCantonCode"
                        , data: {
                            ticket: $.page.ticket
                            , mCantonCodeList: mCantonCodeList
                        }
                        , beforeSend: function () {
                            fw.fwButton.fwButtonHelper.addWait($.page.idM.del);
                        }
                        , success: function (resultData) {
                            //判断删除成功
                            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                                //datagrid加载数据
                                datagrid1DataGrid_Load(code);
                            } else {
                                mini.alert(resultData.infoList[0]);
                            }
                        }
                        , complete: function () {
                            fw.fwButton.fwButtonHelper.removeWait($.page.idM.del);
                        }
                    }));
                };
            }
        );
        };
    });
};
//重新加载
function onBeforeTreeLoad(e) {
    var tree = e.sender;    //树控件
    var node = e.node;      //当前节点
    var params = e.params;  //参数对象

    //可以传递自定义的属性
    params.ticket = $.page.ticket;
    params.queryParams = { parentCode: e.node.cantonCode };
    e.data = params;
};

//datagrid数据加载
function datagrid1DataGrid_Load(parentCode) {
    //开启datagrid数据加载锁屏
    datagrid1JQ.loading();
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysBasicManage"
        , methodName: "queryCanton"
        , data: {
            ticket: $.page.ticket
            , queryParams: {
               // parentCode: parentCode
            }
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                //设置datagrid数据
                datagrid1JQ.loadList(resultData.data, "cantonCode", "parentCantonCode");
            };
        }
    }));
};