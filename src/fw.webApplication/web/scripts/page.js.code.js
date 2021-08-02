$.page = {
    webSiteRootUrl: null
    , serviceSiteRootUrl: null
    , isSSO: false
    , ssoRootDirectory: null
    , goLogin: function (isLogout) {
        var loginUrl;
        if ($.page.isSSO) {
            fw.fwCookie.FWCookieHelper("fwSSO", null);
            fw.fwCookie.FWCookieHelper("ticket", null);
            fw.fwCookie.FWCookieHelper("login_isRememberUserName", null);
            fw.fwCookie.FWCookieHelper("login_isRememberUserNamePassword", null);
            fw.fwCookie.FWCookieHelper("login_isAutoLogin", null);
            fw.fwCookie.FWCookieHelper("login_userName", null);
            fw.fwCookie.FWCookieHelper("login_password", null);
            loginUrl = $.page.webSiteRootUrl + "fwSSO/Logout.aspx";
            loginUrl = fw.fwUrl.FWUrlHelper.addParams(loginUrl, { referrerURL: window.top.location.href });
        } else {
            fw.fwCookie.FWCookieHelper("login_isRememberUserName", null);
            fw.fwCookie.FWCookieHelper("login_isRememberUserNamePassword", null);
            fw.fwCookie.FWCookieHelper("login_isAutoLogin", null);
            fw.fwCookie.FWCookieHelper("login_userName", null);
            fw.fwCookie.FWCookieHelper("login_password", null);
            loginUrl = $.page.webSiteRootUrl + (fw.fwShell ? "mobile" : "web") + "/userLogin/login.htm";
            //loginUrl = fw.fwUrl.FWUrlHelper.addParams(loginUrl, { referrerURL: window.top.location.href });
        };
        window.top.location.replace(loginUrl);
    }
    , getAboutUrl: function () {
        var data = {
            ticket: $.page.ticket
        };
        var params = fw.fwUrl.FWUrlHelper.param(data);
        return $.page.webSiteRootUrl + "web/about.htm?" + params;
    }
    , miniOpen: function (properties) {
        var settings = {
            url: "",
            title: "",
            width: 640,
            height: 512,
            onload: function () { },
            ondestroy: function (action) {

            }
        };
        $.extend(settings, properties);
        mini.open(settings);
    }
    , getAjaxSettings: function (properties, cSettings) {
        var settings = {
            serviceType: ""
            , serviceName: ""
            , methodName: ""
            , data: null
            , success: function () { }
        };
        $.extend(settings, properties);
        switch (settings.serviceType) {
            case "crossDomainCall":
                settings.serviceSiteRootUrl = $.page.serviceSiteRootUrl;
                settings.dynamicDirectory = fw.fwConfig.FWConfigHelper.dynamicDirectory;
                settings.dataPublicKey = fw.fwConfig.FWConfigHelper.dataPublicKey;
                if (fw.fwObject.FWObjectHelper.hasValue(settings.dynamicDirectory)) {
                    settings.url = $.page.serviceSiteRootUrl + settings.dynamicDirectory + "/" + fw.fwSafe.FWSafeHelper.encrypt("service/json/call", settings.dynamicDirectory);
                } else {
                    settings.url = $.page.serviceSiteRootUrl + "service/json/call";
                };
                settings.type = settings.type ? settings.type : "GET";
                settings.dataType = settings.dataType ? settings.dataType : "jsonp";
                settings.jsonp = settings.jsonp ? settings.jsonp : "jsoncallback";
                settings.data = {
                    serviceName: settings.serviceName
                    , methodName: settings.methodName
                    , paramsJson: fw.fwJson.FWJsonHelper.serializeObject(settings.data)
                };
                if (fw.fwObject.FWObjectHelper.hasValue(cSettings) && cSettings.isExport) {
                    cSettings.idM.dataSourceSettings = settings.data;
                    settings.isExport = cSettings.isExport;
                } else {
                    settings.data = fw.fwSafe.FWSafeHelper.encrypt(settings.data, settings.dataPublicKey);
                };
                if (fw.fwUrl.FWUrlHelper.getDomain($.page.serviceSiteRootUrl) == fw.fwUrl.FWUrlHelper.getDomain($.page.webSiteRootUrl)) {
                    settings.type = "POST";
                    delete settings.dataType;
                };
                break;
        };
        return settings;
    }
    , ajax: function (ajaxSettings) {
        if (fw.fwObject.FWObjectHelper.hasValue(ajaxSettings.isExport)
         && fw.fwObject.FWObjectHelper.toBoolean(ajaxSettings.isExport)) { return; };
        if ($.isFunction(ajaxSettings.beforeSend)) {
            ajaxSettings.uiBeforeSend = ajaxSettings.beforeSend;
            delete ajaxSettings.beforeSend;
        };
        if ($.isFunction(ajaxSettings.success)) {
            ajaxSettings.uiSuccess = ajaxSettings.success;
            delete ajaxSettings.success;
        };
        if ($.isFunction(ajaxSettings.error)) {
            ajaxSettings.uiError = ajaxSettings.error;
            delete ajaxSettings.error;
        };
        if ($.isFunction(ajaxSettings.complete)) {
            ajaxSettings.uiComplete = ajaxSettings.complete;
            delete ajaxSettings.complete;
        };
        switch (ajaxSettings.type.toLowerCase()) {
            case "post":
                //$.ajax(ajaxSettings);
                var uifunc = ajaxSettings.uiSuccess;
                delete ajaxSettings.uiSuccess;
                $.ajax(ajaxSettings).success(function (resultData) {
                    uifunc(resultData);
                    if (resultData.data == false && resultData.infoList != null && resultData.infoList[0] === "relogin") {
                        if (window.parent != window) {
                            window.parent.location.href = "http://cerm.thit.con.cn:8055/web/login.htm";
                        }
                    }
                });
                break;
            default:
                var getUrlMaxLength = 1536;
                var getUrl = fw.fwUrl.FWUrlHelper.addParams(ajaxSettings.url, ajaxSettings.data);
                if (ajaxSettings.serviceType == "crossDomainCall" && fw.fwObject.FWObjectHelper.hasValue(getUrl) && getUrl.length > getUrlMaxLength) {
                    var bigDataKey = fw.guid();
                    var data = {
                        serviceName: "basePage"
                        , methodName: "uploadBigData"
                        , paramsJson: null
                    };
                    data[fw.fwSafe.FWSafeHelper.encrypt("serviceName")] = fw.fwSafe.FWSafeHelper.encrypt(data.serviceName);
                    data[fw.fwSafe.FWSafeHelper.encrypt("methodName")] = fw.fwSafe.FWSafeHelper.encrypt(data.methodName);
                    data[fw.fwSafe.FWSafeHelper.encrypt("paramsJson")] = fw.fwSafe.FWSafeHelper.encrypt(data.paramsJson);
                    if (fw.fwObject.FWObjectHelper.hasValue(fw.fwConfig.FWConfigHelper.dataPublicKey)) {
                        delete data.serviceName;
                        delete data.methodName;
                        delete data.paramsJson;
                    };
                    var paragraphLength = getUrlMaxLength - fw.fwUrl.FWUrlHelper.addParams(ajaxSettings.url, data).length;
                    var paramsJsonEncodeString = fw.fwUrl.FWUrlHelper.encode(ajaxSettings.data[fw.fwSafe.FWSafeHelper.encrypt("paramsJson")]);
                    var paramsJsonEncodeIndex = 0;
                    var paragraphEncodeString = "";
                    var everyUploadFunction = function () {
                        var paragraphValue = "";
                        var getParagraphValueFunction = function (thisParagraphLength) {
                            try {
                                var paragraphEncodeString = paramsJsonEncodeString.substr(paramsJsonEncodeIndex, thisParagraphLength);
                                paragraphValue = fw.fwUrl.FWUrlHelper.decode(paragraphEncodeString);
                                paramsJsonEncodeIndex += thisParagraphLength;
                            } catch (ex) {
                                getParagraphValueFunction(--thisParagraphLength);
                            };
                        };
                        getParagraphValueFunction(paragraphLength);
                        data[fw.fwSafe.FWSafeHelper.encrypt("paramsJson")] = fw.fwSafe.FWSafeHelper.encrypt(fw.fwJson.FWJsonHelper.serializeObject({
                            bigDataKey: bigDataKey,
                            bigDataParagraphValue: paragraphValue
                        }));
                        if (fw.fwObject.FWObjectHelper.hasValue(fw.fwConfig.FWConfigHelper.dataPublicKey)) {
                            delete data.paramsJson;
                        };
                        $.ajax({
                            type: ajaxSettings.type
                            , dataType: ajaxSettings.dataType
                            , jsonp: ajaxSettings.jsonp
                            , url: ajaxSettings.url
                            , data: data
                            , "success": function (resultData) {
                                if (paramsJsonEncodeIndex >= paramsJsonEncodeString.length) {
                                    ajaxSettings.data.bigDataKey = bigDataKey;
                                    ajaxSettings.data.paramsJson = null;
                                    ajaxSettings.data[fw.fwSafe.FWSafeHelper.encrypt("bigDataKey")] = fw.fwSafe.FWSafeHelper.encrypt(ajaxSettings.data.bigDataKey);
                                    ajaxSettings.data[fw.fwSafe.FWSafeHelper.encrypt("paramsJson")] = fw.fwSafe.FWSafeHelper.encrypt(ajaxSettings.data.paramsJson);
                                    if (fw.fwObject.FWObjectHelper.hasValue(fw.fwConfig.FWConfigHelper.dataPublicKey)) {
                                        delete ajaxSettings.data.bigDataKey;
                                        delete ajaxSettings.data.paramsJson;
                                    };
                                    $.ajax(ajaxSettings);
                                } else {
                                    everyUploadFunction();
                                };
                            }
                        });
                    };
                    everyUploadFunction();
                } else {
                    $.ajax(ajaxSettings);
                };
                break;
        };
    }
    , exportFile: function (exportSettings) {
        var settings = {
            url: fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/commonPage/chooseDownLoadExtension.htm", $.page.webSiteRootUrl),
            title: "导出类型选择",
            width: 350,
            height: 150,
            ondestroy: function (action) {
                if (action == "ok") {
                    var iframe = this.getIFrameEl();
                    var excelExtension = iframe.contentWindow.getData();
                    if (exportSettings.idM.type == 'datagrid') {
                        exportSettings.idM.unmask();
                        exportSettings.idM.mask("正在导出数据中...");
                    };
                    var columnsObj = {
                        columnName: '',
                        columnNameDesc: '',
                        columnWidth: '',
                        headAlignment: 'left',
                        bodyAlignment: 'left',
                        index: 0,
                        columns: new Array()
                    };
                    var getColumns = function (grid, columnsObj) {
                        var grid_columnModel = grid.columns;
                        if (grid && grid_columnModel && grid_columnModel.length > 0) {
                            for (var i = 0; i < grid_columnModel.length > 0; i++) {
                                var obj = {
                                    columnName: '',
                                    columnNameDesc: '',
                                    columnWidth: '100',
                                    headAlignment: 'left',
                                    bodyAlignment: 'left',
                                    index: 0,
                                    columns: new Array()
                                };
                                var c = grid_columnModel[i];
                                if (c && c.columns && c.columns.length > 0 && c.visible) {
                                    obj.columns = new Array();
                                    var columnsArrays = new Array();
                                    for (var j = 0; j < c.columns.length > 0; j++) {
                                        if (c.columns[j].visible) {
                                            var obj1 = {
                                                columnName: '',
                                                columnNameDesc: '',
                                                columnWidth: '100',
                                                headAlignment: 'left',
                                                bodyAlignment: 'left',
                                                index: 0,
                                                columns: new Array()
                                            };
                                            if (c.columns[j].headerAlign) {
                                                obj1.headAlignment = c.columns[j].headerAlign;
                                            };
                                            if (c.columns[j].align) {
                                                obj1.bodyAlignment = c.columns[j].align;
                                            };
                                            obj1.index = c.columns[j]._index;
                                            /* liww 解决datagrid含有中文field造成无法显示 */
                                            obj1.columnName = decodeURIComponent(c.columns[j].field);
                                            obj1.columnNameDesc = fw.fwString.FWStringHelper.trim(c.columns[j].header);
                                            getColumns(c.columns[j], obj1);
                                            columnsArrays.push(obj1);
                                        };
                                    };
                                    obj.columns = columnsArrays;
                                    if (c.headerAlign) {
                                        obj.headAlignment = c.headerAlign;
                                    };
                                    if (c.align) {
                                        obj.bodyAlignment = c.align;
                                    };
                                    obj.columnNameDesc = fw.fwString.FWStringHelper.trim(c.header);
                                    columnsObj.columns.push(obj);
                                } else {
                                    if (c.visible && c.header && c.field) {
                                        var obj = {
                                            columnName: '',
                                            columnNameDesc: '',
                                            headAlignment: 'left',
                                            bodyAlignment: 'left',
                                            colspan: 0,
                                            rowspan: 0,
                                            index: 0,
                                            columnWidth: '100'
                                        };
                                        if (c.headerAlign) {
                                            obj.headAlignment = c.headerAlign;
                                        };
                                        if (c.align) {
                                            obj.bodyAlignment = c.align;
                                        };
                                        obj.index = c._index;
                                        /* liww 解决datagrid含有中文field造成无法显示 */
                                        obj.columnName = decodeURIComponent(c.field);
                                        obj.columnWidth = fw.fwString.FWStringHelper.replaceAll(c.width, "px", "");
                                        obj.columnNameDesc = fw.fwString.FWStringHelper.trim(c.header);
                                        columnsObj.columns.push(obj);
                                    };
                                };
                            };
                        };
                    };
                    getColumns(exportSettings.idM, columnsObj);
                    $.page.ajax($.page.getAjaxSettings({
                        serviceType: "crossDomainCall",
                        serviceName: "common",
                        methodName: "export",
                        data: {
                            dataSourceSettings: exportSettings.idM.dataSourceSettings,
                            tableSettings: { columns: columnsObj.columns, tableDesc: exportSettings.reportName, excelExtension: excelExtension }
                        },
                        success: function (resultData) {
                            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                                if (fw.fwObject.FWObjectHelper.hasValue(exportSettings.reportName)) {
                                    var param = fw.fwUrl.FWUrlHelper.param({ fileUrl: resultData.data.url, fileName: exportSettings.reportName + resultData.data.extension });
                                    if (fw.fwObject.FWObjectHelper.hasValue(window.appSettings.dynamicDirectory)) {
                                        resultData.data.fileUrl = $.page.serviceSiteRootUrl + window.appSettings.dynamicDirectory + "/" + fw.fwSafe.FWSafeHelper.encrypt("service/file", window.appSettings.dynamicDirectory) + "?" + param;
                                    } else {
                                        resultData.data.fileUrl = $.page.serviceSiteRootUrl + "service/file?" + param;
                                    };
                                };
                                var iTop = (window.screen.availHeight - 100) / 2;
                                var iLeft = (window.screen.availWidth - 100) / 2;
                                //打开公共下载弹窗页面
                                var urlParams = { filePath: resultData.data.fileUrl };
                                var downLoadSettings = {
                                    url: fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/commonPage/fileDownLoad.htm", $.page.webSiteRootUrl), urlParams),
                                    title: "Excel下载页面",
                                    width: 400,
                                    height: 200
                                };
                                $.page.miniOpen(downLoadSettings);
                                //弹出页面
                                window.open(resultData.data.fileUrl, "导出窗口", 'height=100,innerHeight=100,width=100,innerWidth=100,top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no');
                            };
                        }
                    }));
                    exportSettings.idM.unmask();
                };
            }
        };
        $.page.miniOpen(settings);
        exportSettings.idM.unmask();
    }
    //url GET方式跟随的对象
    , params: {}
    //所有设置了id的标签的miniui对象
    , idM: {}
    , pagePreInit: function () { return true; }
    , pageInit: function () { return true; }
    , pageIsInit: false
    , appSettings: {}
    , dataSourceSettingsDictionary: {}
    , pageInitSettings: {}
    , pageLoad: function () { }
    , pageLoadComplete: function () { }
    , windowResize: function () { }
    , _dataSourceDictionary: { "Demo()": [] }
    , getDataSource: function (dataSourceSettings) {
        var settings = {
            controlID: null
            , dataSourceName: null
            , dataSourceParamsJson: null
            , callBackFunction: null
            , isCache: true
        };
        if (!fw.fwObject.FWObjectHelper.hasValue(dataSourceSettings)) {
            dataSourceSettings = {};
        };
        $.extend(settings, dataSourceSettings);
        var dataSource = null;
        var dataSourceKey = null;
        if (fw.fwObject.FWObjectHelper.hasValue(settings)) {
            if (fw.fwObject.FWObjectHelper.hasValue(settings.dataSourceName)) {
                if (fw.fwObject.FWObjectHelper.hasValue(settings.dataSourceParams)) {
                    settings.dataSourceParamsJson = fw.fwJson.FWJsonHelper.serializeObject(settings.dataSourceParams);
                };
                dataSourceKey = settings.dataSourceName + "(" + (!fw.fwObject.FWObjectHelper.hasValue(settings.dataSourceParamsJson) ? "" : settings.dataSourceParamsJson) + ")";
                if ($.page._dataSourceDictionary != undefined) {
                    if (!settings.isCache) {
                        $.page._dataSourceDictionary[dataSourceKey] = undefined;
                    };
                    dataSource = $.page._dataSourceDictionary[dataSourceKey];
                };
            };
        };
        if (fw.fwObject.FWObjectHelper.hasValue(dataSourceKey)) {
            var callBackFunction = function (dataSource) {
                if ($.isFunction(settings.callBackFunction)) {
                    var resultData = dataSource;
                    resultData.data = fw.fwObject.FWObjectHelper.hasValue(resultData.data.columns) ? fw.fwDataTable.FWDataTableHelper.toEntityList(resultData.data) : resultData.data;
                    settings.callBackFunction(settings.controlID, resultData);
                };
            };
            if (dataSource == undefined) {
                var Data = {
                    ticket: $.page.ticket
                    , dataSourceSettings: {
                        dataSourceName: settings.dataSourceName
                        , dataSourceParamsJson: settings.dataSourceParamsJson
                    }
                };
                $.page.ajax($.page.getAjaxSettings({
                    serviceType: "crossDomainCall"
                    , serviceName: "basePage"
                    , methodName: "getDataSource"
                    , data: Data
                    , success: function (resultData) {
                        if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                            dataSource = resultData;
                            if (settings.isCache) {
                                $.page._dataSourceDictionary[dataSourceKey] = dataSource;
                            };
                            callBackFunction(dataSource);
                        };
                    }
                }));
            } else {
                callBackFunction(dataSource);
            };
        };
        return dataSource;
    }
};
//#endregion

//#region 添加用户自定义扩展
$.ajax({
    dataType: "script"
    , async: false
    , url: __CreateJSPath("page.js") + "pageCustomer.js"
});
//#endregion

//#region 设置全局 AJAX 默认选项
$.ajaxSetup({
    type: "POST"
    , dataType: "json"
    , contentType: "application/json;charset=utf-8"
    /* java项目使用 contentType : "application/x-www-form-urlencoded" */
    , cache: false
    , async: true
    , timeout: 300000
    , error: function (jqXHR, textStatus, errorThrown) {
        if ($.isFunction(this.uiError)) {
            this.uiError(jqXHR, textStatus, errorThrown);
        };
        //请求服务器失败        
        var ResultData;
        try {
            eval("ResultData=" + jqXHR.responseText);
            if (ResultData.Message != undefined && ResultData.Message == "身份验证失败。") {
                $.page.GoLogin();
            } else {
                alert(jqXHR.responseText);
            };
        }
        catch (ex) {
            alert(jqXHR.responseText);
        };
    }
    , beforeSend: function (jqXHR, settings) {
        //发送请求之前
        if ($.isFunction(this.uiBeforeSend)) {
            this.uiBeforeSend(jqXHR, settings);
        };
    }
    , success: function (data, textStatus, jqXHR) {
        //请求成功
        switch (this.serviceType) {
            case "crossDomainCall":
                if (fw.fwObject.FWObjectHelper.hasValue(this.dataPublicKey)) {
                    data = fw.fwJson.FWJsonHelper.deserializeObject(fw.fwSafe.FWSafeHelper.decrypt(data, this.dataPublicKey));
                };
                break;
        };
        if ($.isFunction(this.uiSuccess)) {
            this.uiSuccess(data, textStatus, jqXHR);
        };
        try {
            if (data.sqlInfoList) {
                $.each(data.sqlInfoList, function (i, data) {
                    var objData = JSON.parse(data);
                    if (objData) {
                        console.group("请求SQL语句信息(" + objData.requestDate + ")");
                        console.group("文本命令(CommandText)");
                        console.info(objData.commandText);
                        console.groupEnd();
                        var paramData = objData.parameters;
                        if (fw.fwObject.FWObjectHelper.hasValue(paramData)) {
                            console.group("参数(Parameters)");
                            $.each(paramData, function (paramName, paramValue) {
                                console.info(paramName + ":" + paramValue);
                            });
                            console.groupEnd();
                        };
                        console.groupEnd();
                    };
                });
            };

            var info = "";
            for (var i = 0; i < data.infoList.length; i++) {
                info += data.infoList[i] + "\n\r";
            };
            switch (data.status) {
                //-3 出错                                                                                                                                                                                                                                                                                                                                                                                  
                case fw.fwData.FWResultStatus.Error:
                    info = "出错：" + "\n\r" + info;
                    console.error(info);
                    break;
                // -2 没有权限                                                                                                                                                                                                                                                                                                                                                                                            
                case fw.fwData.FWResultStatus.NoRight:
                    info = "没有权限：" + "\n\r" + info;
                    console.warn(info);
                    break;
                // -1 未登入                                                                                                                                                                                                                                                                                                                                                                                        
                case fw.fwData.FWResultStatus.LoginOut:
                    info = "未登入：" + "\n\r" + info;
                    console.warn(info);
                    if (window.top != window.self) {
                        $.page.goLogin();
                    };
                    break;
                // 0  失败                                                                                                                                                                                                                                                                                                                                                                                       
                case fw.fwData.FWResultStatus.Failure:
                    info = "失败：" + "\n\r" + info;
                    console.error(info);
                    break;
                // 0  频繁操作                                                                                                                                                                                                                                                                                                                                                                                         
                case fw.fwData.FWResultStatus.Frequently:
                    info = "频繁操作：" + "\n\r" + info;
                    console.warn(info);
                    break;
                // 1  成功                                                                                                                                                                                                                                                                                                                                                                                        
                default:
                    break;
            };
        }
        catch (e) {
        };
    }
    , complete: function (jqXHR, textStatus) {
        //完成请求
        if ($.isFunction(this.uiComplete)) {
            this.uiComplete(jqXHR, textStatus);
        };
    }
});
//#endregion

//#region 页面完全就绪之后执行
$(window).load(function () {
    if (!fw.fwObject.FWObjectHelper.hasValue($.page.webSiteRootUrl)) {
        $.page.webSiteRootUrl = window.webSiteRootUrl;
    };

    if (!fw.fwObject.FWObjectHelper.hasValue($.page.serviceSiteRootUrl)) {
        $.page.serviceSiteRootUrl = $.page.webSiteRootUrl;
    };
    $.ajax({
        type: "GET",
        dataType: "script",
        url: $.page.serviceSiteRootUrl + "appsettings/javascript",
        error: function (XMLHttpRequest, textStatus, errorThrown) { },
        success: function (data, textStatus, jqXHR) {
            if (!fw.fwObject.FWObjectHelper.hasValue(fw.fwConfig.FWConfigHelper.dynamicDirectory)) {
                fw.fwConfig.FWConfigHelper.dynamicDirectory = window.appSettings.dynamicDirectory;
            };
            if (!fw.fwObject.FWObjectHelper.hasValue(fw.fwConfig.FWConfigHelper.dataPublicKey)) {
                fw.fwConfig.FWConfigHelper.dataPublicKey = window.appSettings.dataPublicKey;
            };
        },
        complete: function (XMLHttpRequest, textStatus) {

            $.page.params = fw.fwUrl.FWUrlHelper.getParams();

            var fwSSO = fw.fwUrl.FWUrlHelper.getParams(fw.fwCookie.FWCookieHelper("fwSSO"));
            if (fw.fwObject.FWObjectHelper.hasValue(fwSSO)) {
                $.page.ticket = fwSSO.ticket;
            };
            if (fw.fwObject.FWObjectHelper.hasValue($.page.params.ticket) && !fw.fwObject.FWObjectHelper.hasValue($.page.ticket)) {
                $.page.ticket = $.page.params.ticket;
            };
            if (!fw.fwObject.FWObjectHelper.hasValue($.page.ticket)) {
                $.page.ticket = $.page.publicTicket;
            };

            $.page.bodyJQ = $("body");
            $.page.isNeedLogin = fw.fwObject.FWObjectHelper.hasValue($.page.bodyJQ.attr("isneedlogin")) ? fw.fwObject.FWObjectHelper.toBoolean($.page.bodyJQ.attr("isneedlogin")) : true;
            $.page.isLoadUserInfo = fw.fwObject.FWObjectHelper.toBoolean($.page.bodyJQ.attr("isloaduserinfo"));
            $.page.isNeedLogin = $.page.isLoadUserInfo ? true : $.page.isNeedLogin;

            if ($.page.isNeedLogin && !fw.fwObject.FWObjectHelper.hasValue($.page.ticket)) {
                $.page.goLogin();
                return false;
            };

            var pageInitSettings = {
                isLoadUserInfo: $.page.isLoadUserInfo
                , appSettings: null
                , dataSourceSettingsList: []
                , functionCodeList: []
            };

            $.page.idJQ = $();
            $("[id]", $.page.bodyJQ).each(function () {
                var thisJQ = $(this);
                if (thisJQ.attr("id") != undefined) {
                    $.page.idJQ = $.page.idJQ.add(thisJQ);
                };
            });
            $.page.idJQ.each(function () {
                var thisJQ = $(this);
                var id = thisJQ.attr("id");
                if (thisJQ.hasClass("form") || this.tagName == "form") {
                    $.page.idM[id] = new mini.Form(this);
                } else {
                    if (!fw.fwShell) { $.page.idM[id] = mini.get(this); };
                };
                $.page.idJQ[id] = thisJQ;
            });

            var pagePreInitReturn = $.page.pagePreInit();
            if (pagePreInitReturn != undefined && !pagePreInitReturn) {
                return false;
            };

            var pageInitReturn = $.page.pageInit();
            if (pageInitReturn != undefined && !pageInitReturn) {
                return false;
            };
            $.page.pageIsInit = true;

            pageInitSettings.appSettings = $.page.appSettings;

            for (var i in $.page.dataSourceSettingsDictionary) {
                var obj = $.page.dataSourceSettingsDictionary[i];
                var dataSourceSettings = {
                    dataSourceName: obj.dataSourceName
                , dataSourceParamsJson: fw.fwJson.FWJsonHelper.serializeObject(obj.dataSourceParams)
                };
                pageInitSettings.dataSourceSettingsList.push(dataSourceSettings);
            };

            $.page.functionControl = {};
            if (!fw.fwObject.FWObjectHelper.hasValue(pageInitSettings.functionCodeList)) {
                pageInitSettings.functionCodeList = [];
            };
            if (!fw.fwShell) {
                mini.findControls(function (control) {
                    if (fw.fwObject.FWObjectHelper.hasValue(control.functionCode)) {
                        var functionCodes = control.functionCode.split(",");
                        var functionCode;
                        for (var i = 0; i < functionCodes.length; i++) {
                            functionCode = functionCodes[i];
                            if (fw.fwObject.FWObjectHelper.hasValue(functionCode)) {
                                pageInitSettings.functionCodeList.push(functionCode);
                                $.page.functionControl[functionCode] = control;
                            };
                        };
                    };
                });
            };

            var controlInit = function () {
                for (var i in $.page.dataSourceSettingsDictionary) {
                    var obj = $.page.dataSourceSettingsDictionary[i];
                    var dataSourceSettings = {
                        controlID: i
                        , dataSourceName: obj.dataSourceName
                        , dataSourceParamsJson: fw.fwJson.FWJsonHelper.serializeObject(obj.dataSourceParams)
                        , callBackFunction: function (controlID, resultData) {
                            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                                var dataSource = resultData.data;
                                if (!fw.fwShell) {
                                    var thisM = mini.get(controlID);
                                    if (thisM) {
                                        if (thisM.type == "treeselect") {
                                            var emptyText = thisM.getEmptyText();
                                            if (fw.fwObject.FWObjectHelper.hasValue(emptyText)) {
                                                var data = {};
                                                data[thisM.valueField] = "";
                                                data[thisM.textField] = emptyText;
                                                dataSource.unshift(data);
                                            };
                                            if (thisM.allowInput && fw.fwString.FWStringHelper.toPinyin != undefined) {
                                                thisM.pinyinField = thisM.textField + "PinYin";
                                                for (var i = 0; i < dataSource.length; i++) {
                                                    dataSource[i][thisM.pinyinField] = fw.fwString.FWStringHelper.toPinyin(dataSource[i][thisM.textField]);
                                                };
                                            };
                                            thisM.loadList(dataSource);
                                            if (!fw.fwObject.FWObjectHelper.hasValue(thisM.getValue())) {
                                                dataSource = thisM.getData();
                                                if (fw.fwObject.FWObjectHelper.hasValue(dataSource)) {
                                                    thisM.setValue(dataSource[0][thisM.valueField]);
                                                };
                                            };
                                        } else if (thisM.type == "radiobuttonlist" || thisM.type == "checkboxlist") {
                                            thisM.setData(dataSource);
                                        } else {
                                            var emptyText = thisM.getEmptyText();
                                            if (fw.fwObject.FWObjectHelper.hasValue(emptyText)) {
                                                if (thisM.setNullItemText) {
                                                    thisM.setNullItemText(emptyText);
                                                };
                                                thisM.setShowNullItem(true);
                                            };
                                            if (thisM.allowInput && fw.fwString.FWStringHelper.toPinyin != undefined) {
                                                thisM.pinyinField = thisM.textField + "PinYin";
                                                for (var i = 0; i < dataSource.length; i++) {
                                                    dataSource[i][thisM.pinyinField] = fw.fwString.FWStringHelper.toPinyin(dataSource[i][thisM.textField]);
                                                };
                                            };
                                            thisM.setData(dataSource);
                                            if (!fw.fwObject.FWObjectHelper.hasValue(thisM.getValue())) {
                                                thisM.select(0);
                                            };
                                        };
                                    };
                                } else {
                                    var thisJQ = $("#" + controlID);
                                    if (thisJQ.length > 0) {
                                        var thisJS = thisJQ[0];
                                        switch (thisJS.tagName) {
                                            case "SELECT":
                                                var valueField = thisJQ.attr("valuefield");
                                                var textField = thisJQ.attr("textfield");
                                                for (var i = 0; i < dataSource.length; i++) {
                                                    $('<option value="' + dataSource[i][valueField] + '">' + dataSource[i][textField] + '</option>').appendTo(thisJQ);
                                                };
                                                thisJQ.selectmenu('refresh');
                                                break;
                                        };
                                    };
                                };
                            };
                        }
                    };
                    $.page.getDataSource(dataSourceSettings);
                };
            };

            var insertLabel = function () {
                setTimeout(function () {
                    var labelCount = fw.fwNumber.FWNumberHelper.randomNumber(1, 3);
                    $("*[id]").each(function () {
                        for (var i = 0; i < labelCount; i++) {
                            if ($(">*", this).length > 0) {
                                $("<div id=\"divInsertLabel_" + fw.fwString.FWStringHelper.replaceAll(fw.guid(), "-", "") + "\" style=\"display:none;\"></div>").prependTo(this);
                            };
                        };
                    });
                }, 100);
            };

            var pageLoad = function () {
                var isLoadAppSettings = false;
                if (pageInitSettings.appSettings != null && pageInitSettings.appSettings != undefined) {
                    for (var key in pageInitSettings.appSettings) {
                        isLoadAppSettings = true;
                        break;
                    };
                };
                if (pageInitSettings.isLoadUserInfo || isLoadAppSettings || pageInitSettings.dataSourceSettingsList.length > 0 || (fw.fwObject.FWObjectHelper.hasValue(pageInitSettings.PageID) && pageInitSettings.IsLoadPagesettings)) {
                    $.page.ajax($.page.getAjaxSettings({
                        serviceType: "crossDomainCall"
                        , serviceName: "basePage"
                        , methodName: "pageInit"
                        , data: {
                            ticket: $.page.ticket
                            , pageInitSettings: pageInitSettings
                        }
                        , success: function (resultData) {
                            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                                if (fw.fwObject.FWObjectHelper.hasValue(resultData.data.appSettings)) {
                                    $.page.appSettings = resultData.data.appSettings;
                                    if ($.page.appSettings.serverTime != undefined) {
                                        $.page.appSettings.serverTime = fw.fwObject.FWObjectHelper.toDateTime($.page.appSettings.serverTime);
                                    };
                                };

                                if (fw.fwObject.FWObjectHelper.hasValue(resultData.data.userInfo)) {
                                    $.page.userInfo = resultData.data.userInfo;
                                };

                                if (fw.fwObject.FWObjectHelper.hasValue(resultData.data.functionRightDictionary)) {
                                    for (var functionCode in $.page.functionControl) {
                                        functionCode = functionCode.toString();
                                        if (resultData.data.functionRightDictionary[functionCode]) {
                                            $.page.functionControl[functionCode].show();
                                        } else {
                                            $.page.functionControl[functionCode].hide();
                                        };
                                    };
                                };
                                if (fw.fwObject.FWObjectHelper.hasValue(resultData.data.dataSourceDictionary)) {
                                    $.page._dataSourceDictionary = resultData.data.dataSourceDictionary;
                                };

                                controlInit();
                                $.page.pageLoad();
                                insertLabel();
                            };
                        }
                    }));
                } else {
                    $.page.appSettings.serverTime = window.appSettings.serverTime;
                    $.page.pageLoad();
                    insertLabel();
                };
                if (window.appSettings && window.appSettings.serverTime) {
                    $.page.appSettings.serverTime = window.appSettings.serverTime;
                } else {
                    $.page.appSettings.serverTime = new Date();
                };
            };

            setTimeout(function () {
                pageLoad();
                $.page.pageLoadComplete();

                var windowResize = function () {
                    $.page.windowResize();
                };
                $(window).bind("resize", windowResize);
                windowResize();
            }, 100);
        }
    });
});