//页面加载
$.page.pageLoad = function () {
	bindData();
};
//绑定模块下拉数据
function bindData() {
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall",
        serviceName: "sysManage",
        methodName: "queryPageMFWBllModule",
        data: {
            ticket: $.page.ticket,
            pageParams: {
                pageSize: 1000,
                pageIndex: 1,
                sortFieldList: null
            },
            keyword: null
        },
        success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                //设置treegrid数据
                $.page.idM.bllModule.loadList(resultData.data.entityList, 'mBllModuleCode', 'mPBllModuleCode');
            }
             else { 
                
            };
        }
    }));
};

//模块数据改变联动改变数据对象
function onModuleChanged() {
    var module = $.page.idM.bllModule.getValue();
    if (fw.fwObject.FWObjectHelper.hasValue(module)) {
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall",
            serviceName: "sysManage",
            methodName: "queryModelByModule",
            data: {
                ticket: $.page.ticket,
                module: module
            },
            success: function (resultData) {
                //判断加载数据成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                    //设置treegrid数据
                    $.page.idM.mFWBllModel.load(resultData.data);
                };
            }
        }));
    }
    else {
        mini.alert("请选择业务模块!");
    };
};

//动态显示grid
function showGrid() {
    var fullClassName =  $.page.idM.mFWBllModel.getValue();
    if (fw.fwObject.FWObjectHelper.hasValue(fullClassName)) {
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall",
            serviceName: "sysManage",
            methodName: "queryPropertyInfoByModel",
            data: {
                ticket: $.page.ticket,
                module: $.page.idM.bllModule.getValue(),
                fullClassName: fullClassName
            },
            success: function (resultData) {
                //判断加载数据成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                    //设置Grid显示
                    var columns = new Array();
                    var obj = null;
                    for (i = 0; i < resultData.data.length; i++) {
                        obj = resultData.data[i];
                        if (obj.mPropertyType === "System.DateTime") {
                            columns.push({ field: obj.mPropertyTypeName, dateFormat: "yyyy-MM-dd H:mm:ss", width: 100, header: obj.mChineseName })
                        }
                        else {
                            columns.push({ field: obj.mPropertyTypeName, width: 100, header: obj.mChineseName })
                        }
                    };
                    $.page.idM.modelDataGrid.set({
                        columns: columns
                    });
                };
            }
        }));
    }
    else {
        mini.alert("请选择业务对象!");
    };
};

//下载模版
function onDownload() {
    var columnsData = $.page.idM.modelDataGrid.getBottomColumns();
    var sheetTitle = $.page.idM.mFWBllModel.text;
    if (fw.fwObject.FWObjectHelper.hasValue(columnsData) && fw.fwObject.FWObjectHelper.hasValue(sheetTitle)) {
        var columns = new Array();
        for (i = 0; i < columnsData.length; i++) {
            columns.push(columnsData[i].header);
        };
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall",
                serviceName: "sysManage",
                methodName: "downLoadTemplteExcel",
                data: {
                    ticket: $.page.ticket,
                    columns: columns,
                    sheetTitle: sheetTitle
                },
                success: function (resultData) {
                    if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                        resultData.data.fileUrl = $.page.serviceSiteRootUrl + fw.fwSafe.FWSafeHelper.getServiceDynamicPath(fw.fwConfig.FWConfigHelper.serviceDynamicKey) + "service/file?" + fw.fwUrl.FWUrlHelper.param({ fileUrl: resultData.data.url, fileName: resultData.data.name }, fw.fwString.FWStringHelper.empty);
                        var iTop = (window.screen.availHeight - 100) / 2;
                        var iLeft = (window.screen.availWidth - 100) / 2;
                        window.open(resultData.data.fileUrl, "导出窗口", 'height=100,,innerHeight=100,width=100,innerWidth=100,top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no');
                    };
                }
            }));

    }
    else {
        mini.alert("请选择业务对象,或者当前选择的业务对象没有任何属性不存在!");
    };
};

//上传Excel文件
function onUpload() {
    //参数
    var data = {
        ticket: $.page.ticket
        , extensionType: fw.fwData.FWFileExtensionType.Image
        , uploadCount: 1
        , maxLength: 1024 * 1024 * 4
        , enterCallback: "onUploadCallback"
    };
    //参数序列化
    var params = fw.fwUrl.FWUrlHelper.param(data);
    var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fileUpload.htm", $.page.webSiteRootUrl), data); 
    //打开选择用户窗口
    mini.open({
        url: pageUrl
        , title: "选择文件"
        , width: 512
        , height: 256
        , onload: function () {}
        , ondestroy: function (action) {}
    });
};
//回调函数  后天解析数据
function onUploadCallback(entity) {
    if (fw.fwObject.FWObjectHelper.hasValue(entity)) {
        //entity.filePath
        $.page.ajax($.page.getAjaxSettings({
            serviceType: "crossDomainCall",
            serviceName: "sysManage",
            methodName: "analysisExcel",
            data: {
                ticket: $.page.ticket,
                relativePath: entity.filePath
            },
            success: function (resultData) {
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                   
                };
            }
        }));
    };
};


