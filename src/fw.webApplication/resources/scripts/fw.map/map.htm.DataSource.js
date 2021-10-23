window.Module = {
    Code_RequestType: {
        jQuery: "jQuery"
        , Ext: "Ext"
    }
    , RequestTypeCode: "jQuery"
    , Enterprise: {
        Search__Enterprise_MonitorSiteStatisticsInfo: {
            getData: function (properties) {
                //var settings = {
                //    dataTypeCode: ""
                //    , dateTime: new Date()
                //    , callBack: function (data) { }
                //};
                var dataThis = this;

                var dataKey = "";
                switch (properties.dataTypeCode.toString()) {
                    case Code__DataType.Month:
                        dataKey = properties.dateTime.ToString("yyyy-MM-01");
                        break;
                    case Code__DataType.Real:
                        dataKey = "Real";
                        break;
                };
                dataKey = "_Data_" + dataKey;
                if (dataThis[dataKey] == undefined) {

                    var successFunction = function (ResultData) {
                        if (ResultData != null && ResultData.Status == 1) {
                            dataThis[dataKey] = ResultData.Data;
                            if ($.isFunction(properties.callBack)) {
                                properties.callBack(dataThis[dataKey]);
                            };
                        };
                    };
                    var datetimelist = properties.dateTime;
                    if (properties.dateTime == undefined) {
                        datetimelist = null;
                    }
                    else {
                        datetimelist = properties.dateTime == null ? null : [properties.dateTime.ToString("UTCDateTime")];
                    }

                    switch (window.Module.RequestTypeCode) {
                        case window.Module.Code_RequestType.jQuery:
                            $.ajax($.Page.GetAjaxSettings({
                                ServiceTypeCode: "Enterprise"
                                    , MethodName: "Search__Enterprise_MonitorSiteStatisticsInfo_Map"
                                    , data: jExtension.JsonToSubmitString({
                                        Ticket: $.page.ticket
                                        , ParameterData: {
                                            DataTypeCode: properties.dataTypeCode
                                            , DateTimeList: datetimelist
                                        }
                                    })
                                    , type: "post"
                                    , success: successFunction
                            }));
                            break;
                        case window.Module.Code_RequestType.Ext:
                            Ext.data.JsonP.request($.Page.GetJsonpSettings({
                                params: {
                                    ServiceName: "Enterprise",
                                    MethodName: 'Search__Enterprise_MonitorSiteStatisticsInfo_Map',
                                    ParameterDataJsonString: Ext.JSON.encode(
                                    {
                                        Ticket: $.page.ticket
                                        , ParameterData: {
                                            DataTypeCode: properties.dataTypeCode
                                            , DateTimeList: properties.dateTimeList
                                        }
                                    })
                                }, success: successFunction
                                    , failure: window.Module.Enterprise.Search__Enterprise_MonitorSiteStatisticsInfo.getDataFailure
                            }));
                            break;
                    };
                } else {
                    if ($.isFunction(properties.callBack)) {
                        properties.callBack(dataThis[dataKey]);
                    };
                };
                return dataThis[dataKey];
            }
                , getDataFailure: function () {

                }
                , getCantonMonitorSiteList: function (properties) {
                    //var settings = {
                    //    dataTypeCode: ""
                    //    , dateTime: new Date()
                    //    , cantonCode:""
                    //    , callBack: function (data) { }
                    //};
                    if (properties.cantonCode == undefined || properties.cantonCode == null) {
                        properties.cantonCode = "";
                    };
                    if (properties.IsBelongCantonOthers == undefined) {
                        properties.IsBelongCantonOthers = false;
                    };
                    var dataThis = this;
                    var dataKey = "";
                    switch (properties.dataTypeCode.toString()) {
                        case Code__DataType.Month:
                            dataKey = properties.dateTime.ToString("yyyy-MM-01");
                            break;
                        case Code__DataType.Real:
                            dataKey = "Real";
                            break;
                    };
                    dataKey = "_Data_" + dataKey + "_CantonCode_" + properties.cantonCode + "_EnterpriseCode_" + properties.EnterpriseCode + "_IsBelongCantonOthers_" + properties.IsBelongCantonOthers;
                    if (fw.fwObject.FWObjectHelper.hasValue(properties.MonitorSiteTypeCodeArray)) {
                        dataKey += properties.MonitorSiteTypeCodeArray.join(',');
                    }

                    if (dataThis[dataKey] == undefined) {                         //
                        this.getData({
                            dataTypeCode: properties.dataTypeCode
                            , dateTime: properties.dateTime
                            , callBack: function (data) {
                                var MonitorSiteList = {};
                                var ListMonitorFS = [];
                                var ListMonitorFQ = [];
                                var ListMonitorWSC = [];
                                var CantonCode = String.prototype.Remove00(properties.cantonCode);
                                if (fw.fwObject.FWObjectHelper.hasValue(properties.MonitorSiteTypeCodeArray)) {
                                    for (var i = 0; i < properties.MonitorSiteTypeCodeArray.length; i++) {
                                        var checkvalue = properties.MonitorSiteTypeCodeArray[i];
                                        if (checkvalue == "Enterprise_FS") {
                                            if (data.ListMonitorFS != null && data.ListMonitorFS.length > 0) {

                                                for (var j = 0; j < data.ListMonitorFS.length; j++) {
                                                    var EntCantonCode = data.ListMonitorFS[j].CantonCode;

                                                    if (properties.EnterpriseCode == undefined) {
                                                        if ((properties.cantonCode == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || CantonCode == data.ListMonitorFS[j].CantonCode.substr(0, CantonCode.length)) {
                                                            if (EntCantonCode.substr(0, CantonCode.length) == CantonCode) {
                                                                ListMonitorFS.push(data.ListMonitorFS[j]);
                                                            };
                                                        }
                                                        else if (properties.cantonCode == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.cantonCode == data.ListMonitorFS[j].CantonCode) {
                                                            ListMonitorFS.push(data.ListMonitorFS[j]);
                                                        };
                                                    }
                                                    else {
                                                        if (properties.EnterpriseCode == data.ListMonitorFS[j].BusinessCode) {
                                                            ListMonitorFS.push(data.ListMonitorFS[j]);
                                                        }
                                                    }
                                                };
                                            }
                                        }
                                        else if (checkvalue == "Enterprise_FQ") {
                                            if (data.ListMonitorFQ != null && data.ListMonitorFQ.length > 0) {

                                                for (var j = 0; j < data.ListMonitorFQ.length; j++) {
                                                    var EntCantonCode = data.ListMonitorFQ[j].CantonCode;
                                                    if (properties.EnterpriseCode == undefined) {
                                                        if ((properties.cantonCode == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || CantonCode == data.ListMonitorFQ[j].CantonCode.substr(0, CantonCode.length)) {
                                                            if (EntCantonCode.substr(0, CantonCode.length) == CantonCode) {
                                                                ListMonitorFQ.push(data.ListMonitorFQ[j]);
                                                            };
                                                        }
                                                        else if (properties.cantonCode == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.cantonCode == data.ListMonitorFQ[j].CantonCode) {
                                                            ListMonitorFQ.push(data.ListMonitorFQ[j]);
                                                        };
                                                    }
                                                    else {
                                                        if (properties.EnterpriseCode == data.ListMonitorFQ[j].BusinessCode) {
                                                            ListMonitorFQ.push(data.ListMonitorFQ[j]);
                                                        }
                                                    }
                                                };
                                            }
                                        }
                                        else if (checkvalue == "Enterprise_WSC") {
                                            if (data.ListMonitorWSC != null && data.ListMonitorWSC.length > 0) {
                                                for (var j = 0; j < data.ListMonitorWSC.length; j++) {
                                                    var EntCantonCode = data.ListMonitorWSC[j].CantonCode;
                                                    if (properties.EnterpriseCode == undefined) {
                                                        if ((properties.cantonCode == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || CantonCode == data.ListMonitorWSC[j].CantonCode.substr(0, CantonCode.length)) {
                                                            if (EntCantonCode.substr(0, CantonCode.length) == CantonCode) {
                                                                ListMonitorWSC.push(data.ListMonitorWSC[j]);
                                                            };
                                                        }
                                                        else if (properties.cantonCode == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.cantonCode == data.ListMonitorWSC[j].CantonCode) {
                                                            ListMonitorWSC.push(data.ListMonitorWSC[j]);
                                                        };
                                                    }
                                                    else {
                                                        if (properties.EnterpriseCode == data.ListMonitorWSC[j].BusinessCode) {
                                                            ListMonitorWSC.push(data.ListMonitorWSC[j]);
                                                        }
                                                    }
                                                };
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (data.ListMonitorFS != null && data.ListMonitorFS.length > 0) {
                                        for (var m = 0; m < data.ListMonitorFS.length; m++) {
                                            if (properties.EnterpriseCode == data.ListMonitorFS[m].BusinessCode) {
                                                ListMonitorFS.push(data.ListMonitorFS[m]);
                                            };
                                        };
                                    };
                                    if (data.ListMonitorFQ != null && data.ListMonitorFQ.length > 0) {
                                        for (var n = 0; n < data.ListMonitorFQ.length; n++) {
                                            if (properties.EnterpriseCode == data.ListMonitorFQ[n].BusinessCode) {
                                                ListMonitorFQ.push(data.ListMonitorFQ[n]);
                                            };
                                        };
                                    };
                                    if (data.ListMonitorWSC != null && data.ListMonitorWSC.length > 0) {
                                        for (var k = 0; k < data.ListMonitorWSC.length; k++) {
                                            if (properties.EnterpriseCode == data.ListMonitorWSC[k].BusinessCode) {
                                                ListMonitorWSC.push(data.ListMonitorWSC[k]);
                                            };
                                        };
                                    };
                                };
                                MonitorSiteList.ListMonitorWSC = ListMonitorWSC;
                                MonitorSiteList.ListMonitorFS = ListMonitorFS;
                                MonitorSiteList.ListMonitorFQ = ListMonitorFQ;
                                dataThis[dataKey] = MonitorSiteList;
                                if ($.isFunction(properties.callBack)) {
                                    properties.callBack(dataThis[dataKey]);
                                };
                            }
                        });
                    } else {
                        if ($.isFunction(properties.callBack)) {
                            properties.callBack(dataThis[dataKey]);
                        };
                    };
                    return dataThis[dataKey];
                }
                , getEnterpriseStateMonitorSiteList: function (properties) {
                    //var settings = {
                    //    dataTypeCode: ""
                    //    , dateTime: new Date()
                    //    , cantonCode:
                    //    , waterQualityTypeCode:""
                    //    , callBack: function (data) { }
                    //};
                    if (properties.cantonCode == undefined || properties.cantonCode == null) {
                        properties.cantonCode = "";
                    };
                    if (properties.qualifiedCode == undefined || properties.qualifiedCode == null) {
                        properties.qualifiedCode = "";
                    };
                    var dataThis = this;
                    var dataKey = "";
                    switch (properties.dataTypeCode.toString()) {
                        case Code__DataType.Month:
                            dataKey = properties.dateTime.ToString("yyyy-MM-01");
                            break;
                        case Code__DataType.Real:
                            dataKey = "Real";
                            break;
                    };
                    dataKey = "_Data_" + dataKey + "_qualifiedCode_" + properties.qualifiedCode + "_" + properties.cantonCode;
                    if (fw.fwObject.FWObjectHelper.hasValue(properties.MonitorSiteTypeCodeArray)) {
                        dataKey += properties.MonitorSiteTypeCodeArray;
                    }
                    if (dataThis[dataKey] == undefined) {
                        this.getData({
                            dataTypeCode: properties.dataTypeCode
                            , dateTime: properties.dateTime
                            , callBack: function (data) {
                                var MonitorSiteList = {};
                                var ListMonitorFS = [];
                                var ListMonitorFQ = [];
                                var ListMonitorWSC = [];
                                var CantonCode = String.prototype.Remove00(properties.cantonCode);
                                for (var i = 0; i < properties.MonitorSiteTypeCodeArray.length; i++) {
                                    var checkvalue = properties.MonitorSiteTypeCodeArray[i];
                                    if (checkvalue == "Enterprise_FS") {
                                        if (data.ListMonitorFS != null && data.ListMonitorFS.length > 0) {
                                            for (var j = 0; j < data.ListMonitorFS.length; j++) {
                                                var EntCantonCode = data.ListMonitorFS[j].CantonCode;
                                                if (EntCantonCode.substr(0, CantonCode.length) == CantonCode) {
                                                    if (properties.qualifiedCode == "" || properties.qualifiedCode == data.ListMonitorFS[j].Code) {
                                                        ListMonitorFS.push(data.ListMonitorFS[j]);
                                                    };
                                                }
                                            };
                                        }
                                    }
                                    else if (checkvalue == "Enterprise_FQ") {
                                        if (data.ListMonitorFQ != null && data.ListMonitorFQ.length > 0) {
                                            for (var j = 0; j < data.ListMonitorFQ.length; j++) {
                                                var EntCantonCode = data.ListMonitorFQ[j].CantonCode;
                                                if (EntCantonCode.substr(0, CantonCode.length) == CantonCode) {
                                                    if (properties.qualifiedCode == "" || properties.qualifiedCode == data.ListMonitorFS[j].Code) {
                                                        ListMonitorFQ.push(data.ListMonitorFQ[j]);
                                                    };
                                                }
                                            };
                                        }
                                    }
                                    else if (checkvalue == "Enterprise_WSC") {
                                        if (data.ListMonitorWSC != null && data.ListMonitorWSC.length > 0) {

                                            for (var j = 0; j < data.ListMonitorWSC.length; j++) {
                                                var EntCantonCode = data.ListMonitorWSC[j].CantonCode;
                                                if (EntCantonCode.substr(0, CantonCode.length) == CantonCode) {
                                                    if (properties.qualifiedCode == "" || properties.qualifiedCode == data.ListMonitorFS[j].Code) {
                                                        ListMonitorWSC.push(data.ListMonitorWSC[j]);
                                                    };
                                                }
                                            };
                                        }
                                    }
                                }
                                MonitorSiteList.ListMonitorWSC = ListMonitorWSC;
                                MonitorSiteList.ListMonitorFS = ListMonitorFS;
                                MonitorSiteList.ListMonitorFQ = ListMonitorFQ;
                                dataThis[dataKey] = MonitorSiteList;
                                if ($.isFunction(properties.callBack)) {
                                    properties.callBack(dataThis[dataKey]);
                                };
                            }
                        });
                    } else {
                        if ($.isFunction(properties.callBack)) {
                            properties.callBack(dataThis[dataKey]);
                        };
                    };
                    return dataThis[dataKey];
                }
                , getQualifiedMonitorSiteList: function (properties) {

                    if (properties.cantonCode == undefined || properties.cantonCode == null) {
                        properties.cantonCode = "";
                    };
                    if (properties.qualifiedCode == undefined || properties.qualifiedCode == null) {
                        properties.qualifiedCode = "";
                    };
                    var dataThis = this;
                    var dataKey = "";
                    switch (properties.dataTypeCode.toString()) {
                        case Code__DataType.Month:
                            dataKey = properties.dateTime.ToString("yyyy-MM-01");
                            break;
                        case Code__DataType.Real:
                            dataKey = "Real";
                            break;
                    };
                    dataKey = "_Data_" + dataKey + "_QualifiedCode_" + properties.qualifiedCode + "_" + properties.cantonCode;

                    if (fw.fwObject.FWObjectHelper.hasValue(properties.MonitorSiteTypeCodeArray)) {
                        dataKey += properties.MonitorSiteTypeCodeArray;
                    }

                    if (dataThis[dataKey] == undefined) {
                        this.getData({
                            dataTypeCode: properties.dataTypeCode
                            , dateTime: properties.dateTime
                            , callBack: function (data) {
                                var MonitorSiteList = {};
                                var ListMonitorFS = [];
                                var ListMonitorFQ = [];
                                var ListMonitorWSC = [];
                                var CantonCode = String.prototype.Remove00(properties.cantonCode);
                                if (fw.fwObject.FWObjectHelper.hasValue(properties.MonitorSiteTypeCodeArray)) {
                                    var checkvalue = properties.MonitorSiteTypeCodeArray[i];
                                    if (checkvalue == "Enterprise_FS") {
                                        if (data.ListMonitorFS != null && data.ListMonitorFS.length > 0) {
                                            for (var j = 0; j < data.ListMonitorFS.length; j++) {

                                                var EntCantonCode = data.ListMonitorFS[j].CantonCode;
                                                if (EntCantonCode.substr(0, CantonCode.length) == CantonCode) {
                                                    if (properties.qualifiedCode == "" || properties.qualifiedCode == data.ListMonitorFS[j].DataStatusCode) {
                                                        ListMonitorFS.push(data.ListMonitorFS[j]);
                                                    }
                                                }

                                            };
                                        }
                                    }
                                    else if (checkvalue == "Enterprise_FQ") {
                                        if (data.ListMonitorFQ != null && data.ListMonitorFQ.length > 0) {
                                            for (var j = 0; j < data.ListMonitorFQ.length; j++) {


                                                var EntCantonCode = data.ListMonitorFQ[j].CantonCode;
                                                if (EntCantonCode.substr(0, CantonCode.length) == CantonCode) {
                                                    if (properties.qualifiedCode == "" || properties.qualifiedCode == data.ListMonitorFQ[j].DataStatusCode) {
                                                        ListMonitorFQ.push(data.ListMonitorFQ[j]);
                                                    }
                                                }
                                            };
                                        }
                                    }
                                    else if (checkvalue == "Enterprise_WSC") {
                                        if (data.ListMonitorWSC != null && data.ListMonitorWSC.length > 0) {
                                            for (var j = 0; j < data.ListMonitorWSC.length; j++) {

                                                var EntCantonCode = data.ListMonitorWSC[j].CantonCode;
                                                if (EntCantonCode.substr(0, CantonCode.length) == CantonCode) {
                                                    if (properties.qualifiedCode == "" || properties.qualifiedCode == data.ListMonitorWSC[j].DataStatusCode) {
                                                        ListMonitorWSC.push(data.ListMonitorWSC[j]);
                                                    }
                                                }
                                            };
                                        }
                                    }
                                }
                                else {
                                    if (data.ListMonitorFS != null && data.ListMonitorFS.length > 0) {
                                        for (var j = 0; j < data.ListMonitorFS.length; j++) {

                                            var EntCantonCode = data.ListMonitorFS[j].CantonCode;
                                            if (EntCantonCode.substr(0, CantonCode.length) == CantonCode) {
                                                if (properties.qualifiedCode == "" || properties.qualifiedCode == data.ListMonitorFS[j].DataStatusCode) {
                                                    ListMonitorFS.push(data.ListMonitorFS[j]);
                                                }
                                            }

                                        };
                                    }
                                    if (data.ListMonitorFQ != null && data.ListMonitorFQ.length > 0) {
                                        for (var j = 0; j < data.ListMonitorFQ.length; j++) {


                                            var EntCantonCode = data.ListMonitorFQ[j].CantonCode;
                                            if (EntCantonCode.substr(0, CantonCode.length) == CantonCode) {
                                                if (properties.qualifiedCode == "" || properties.qualifiedCode == data.ListMonitorFQ[j].DataStatusCode) {
                                                    ListMonitorFQ.push(data.ListMonitorFQ[j]);
                                                }
                                            }
                                        };
                                    }
                                    if (data.ListMonitorWSC != null && data.ListMonitorWSC.length > 0) {
                                        for (var j = 0; j < data.ListMonitorWSC.length; j++) {

                                            var EntCantonCode = data.ListMonitorWSC[j].CantonCode;
                                            if (EntCantonCode.substr(0, CantonCode.length) == CantonCode) {
                                                if (properties.qualifiedCode == "" || properties.qualifiedCode == data.ListMonitorWSC[j].DataStatusCode) {
                                                    ListMonitorWSC.push(data.ListMonitorWSC[j]);
                                                }
                                            }
                                        };
                                    }
                                }
                                MonitorSiteList.ListMonitorWSC = ListMonitorWSC;
                                MonitorSiteList.ListMonitorFS = ListMonitorFS;
                                MonitorSiteList.ListMonitorFQ = ListMonitorFQ;
                                dataThis[dataKey] = MonitorSiteList;
                                if ($.isFunction(properties.callBack)) {
                                    properties.callBack(dataThis[dataKey]);
                                };
                            }
                        });
                    } else {
                        if ($.isFunction(properties.callBack)) {
                            properties.callBack(dataThis[dataKey]);
                        };
                    };
                    return dataThis[dataKey];
                }
                , getBussessCodeMonitorSiteList: function (properties) {
                    //var settings = {
                    //    dataTypeCode: ""
                    //    , dateTime: new Date()
                    //    , businessCode:""
                    //    , callBack: function (data) { }
                    //};

                    if (properties.businessCode == undefined || properties.businessCode == null) {
                        properties.businessCode = "";
                    };
                    var dataThis = this;
                    var dataKey = "";
                    switch (properties.dataTypeCode.toString()) {
                        case Code__DataType.Month:
                            dataKey = properties.dateTime.ToString("yyyy-MM-01");
                            break;
                        case Code__DataType.Real:
                            dataKey = "Real";
                            break;
                    };
                    dataKey = "_Data_" + dataKey + "_BussessCode_" + properties.businessCode;
                    if (fw.fwObject.FWObjectHelper.hasValue(properties.MonitorSiteTypeCodeArray)) {
                        dataKey += properties.MonitorSiteTypeCodeArray;
                    }
                    if (dataThis[dataKey] == undefined) {
                        this.getData({
                            dataTypeCode: properties.dataTypeCode
                            , dateTime: properties.dateTime
                            , callBack: function (data) {
                                var MonitorSiteList = [];

                                if (fw.fwObject.FWObjectHelper.hasValue(properties.MonitorSiteTypeCodeArray)) {
                                    for (var i = 0; i < properties.MonitorSiteTypeCodeArray.length; i++) {
                                        var sLayerTypeCode = properties.MonitorSiteTypeCodeArray[i]; // "Enterprise_WSC";
                                        if (sLayerTypeCode == "Enterprise_WSC") {
                                            if (properties.BusinessLayerTypeCode == "Enterprise_WSC" && data.ListMonitorWSC != null && data.ListMonitorWSC.length > 0) {
                                                for (var j = 0; j < data.ListMonitorWSC.length; j++) {
                                                    if (properties.businessCode == data.ListMonitorWSC[j].BusinessCode) {
                                                        MonitorSiteList.push(data.ListMonitorWSC[j]);
                                                    };
                                                };
                                            }
                                        }
                                        else if (sLayerTypeCode == "Enterprise_FS") {
                                            if (properties.BusinessLayerTypeCode == "Enterprise_FS" && data.ListMonitorFS != null && data.ListMonitorFS.length > 0) {
                                                for (var j = 0; j < data.ListMonitorFS.length; j++) {
                                                    if (properties.businessCode == data.ListMonitorFS[j].BusinessCode) {
                                                        MonitorSiteList.push(data.ListMonitorFS[j]);
                                                    };
                                                };
                                            }
                                        }
                                        else if (sLayerTypeCode == "Enterprise_FQ") {
                                            if (properties.BusinessLayerTypeCode == "Enterprise_FQ" && data.ListMonitorFQ != null && data.ListMonitorFQ.length > 0) {
                                                for (var j = 0; j < data.ListMonitorFQ.length; j++) {
                                                    if (properties.businessCode == data.ListMonitorFQ[j].BusinessCode) {
                                                        MonitorSiteList.push(data.ListMonitorFQ[j]);
                                                    };
                                                };
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (properties.BusinessLayerTypeCode == "Enterprise_FS" && data.ListMonitorFS != null && data.ListMonitorFS.length > 0) {
                                        for (var j = 0; j < data.ListMonitorFS.length; j++) {
                                            if (properties.businessCode == data.ListMonitorFS[j].BusinessCode) {
                                                MonitorSiteList.push(data.ListMonitorFS[j]);
                                            };
                                        };
                                    }
                                    if (properties.BusinessLayerTypeCode == "Enterprise_FQ" && data.ListMonitorFQ != null && data.ListMonitorFQ.length > 0) {
                                        for (var j = 0; j < data.ListMonitorFQ.length; j++) {
                                            if (properties.businessCode == data.ListMonitorFQ[j].BusinessCode) {
                                                MonitorSiteList.push(data.ListMonitorFQ[j]);
                                            };
                                        };
                                    }
                                    if (properties.BusinessLayerTypeCode == "Enterprise_WSC" && data.ListMonitorWSC != null && data.ListMonitorWSC.length > 0) {
                                        for (var j = 0; j < data.ListMonitorWSC.length; j++) {
                                            if (properties.businessCode == data.ListMonitorWSC[j].BusinessCode) {
                                                MonitorSiteList.push(data.ListMonitorWSC[j]);
                                            };
                                        };
                                    }
                                }

                                dataThis[dataKey] = MonitorSiteList;
                                if ($.isFunction(properties.callBack)) {
                                    properties.callBack(dataThis[dataKey]);
                                };
                            }
                        });
                    } else {
                        if ($.isFunction(properties.callBack)) {
                            properties.callBack(dataThis[dataKey]);
                        };
                    };
                    return dataThis[dataKey];
                }
                , getStatisticsMonitorSiteList: function (properties) {
                    //var settings = {
                    //    dataTypeCode: ""
                    //    ,dateTime: new Date()
                    //    ,selectCanton:""  
                    //    , callBack: function (data) { }
                    //};
                    if (properties.selectCanton == undefined || properties.selectCanton == null) {
                        properties.selectCanton = "";
                    };
                    if (properties.IsBelongCantonOthers == undefined) {
                        properties.IsBelongCantonOthers = false;
                    };
                    var dataThis = this;
                    var dataKey = "";
                    switch (properties.dataTypeCode.toString()) {
                        case Code__DataType.Month:
                            dataKey = properties.dateTime.ToString("yyyy-MM-01");
                            break;
                        case Code__DataType.Real:
                            dataKey = "Real";
                            break;
                    };
                    dataKey = "_Data_" + dataKey + "_StatisticsCode_" + properties.selectCanton + "_IsBelongCantonOthers_" + properties.IsBelongCantonOthers;
                    if (fw.fwObject.FWObjectHelper.hasValue(properties.MonitorSiteTypeCodeArray)) {
                        dataKey += properties.MonitorSiteTypeCodeArray;
                    }
                    if (dataThis[dataKey] == undefined) {                       //                  
                        this.getData({
                            dataTypeCode: properties.dataTypeCode
                            , dateTime: properties.dateTime
                            , MonitorSiteTypeCodeArray: properties.MonitorSiteTypeCodeArray
                            , callBack: function (data) {
                                var newdata = jQuery.extend(true, {}, data); //拷贝对象
                                for (var o = 0; o < newdata.ListEnterpriseStation.length; o++) {
                                    newdata.ListEnterpriseStation[o].QualitativeValue = 0;
                                };
                                var CantonEntityCount = 0;      //按厂区统计，污染源个数
                                var TypeEntityCout = 0;         //按污染源类别统计，污染源个数
                                var ListMonitorWSC = [];
                                var ListMonitorFQ = [];
                                var ListMonitorFS = [];
                                TypeEntityCout = (properties.MonitorSiteTypeCodeArray.Contains("Enterprise_FQ") ? newdata.ListMonitorFQ.length : 0) + (properties.MonitorSiteTypeCodeArray.Contains("Enterprise_FS") ? newdata.ListMonitorFS.length : 0) + (properties.MonitorSiteTypeCodeArray.Contains("Enterprise_WSC") ? newdata.ListMonitorWSC.length : 0);
                                if (fw.fwObject.FWObjectHelper.hasValue(properties.MonitorSiteTypeCodeArray)) {
                                    var CantonCode = String.prototype.Remove00(properties.selectCanton);
                                    for (var i = 0; i < properties.MonitorSiteTypeCodeArray.length; i++) {
                                        var sLayerTypeCode = properties.MonitorSiteTypeCodeArray[i]; // "Enterprise_WSC";
                                        if (sLayerTypeCode == "Enterprise_WSC") {

                                            for (var m = 0; m < newdata.ListMonitorWSC.length; m++) {
                                                //状态
                                                for (var j = 0; j < newdata.ListEnterpriseStation.length; j++) {
                                                    if (newdata.ListEnterpriseStation[j].Code == newdata.ListMonitorWSC[m].DataStatusCode) {
                                                        if ((properties.selectCanton == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || CantonCode == newdata.ListMonitorWSC[m].CantonCode.substr(0, CantonCode.length)) {
                                                            newdata.ListEnterpriseStation[j].QualitativeValue++;
                                                        }
                                                        else if (properties.selectCanton == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.selectCanton == newdata.ListMonitorWSC[m].CantonCode) {
                                                            newdata.ListEnterpriseStation[j].QualitativeValue++;
                                                        };
                                                    };
                                                };

                                                //数据
                                                if ((properties.selectCanton == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || CantonCode == newdata.ListMonitorWSC[m].CantonCode.substr(0, CantonCode.length)) {
                                                    ListMonitorWSC.push(newdata.ListMonitorWSC[m]);
                                                }
                                                else if (properties.selectCanton == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.selectCanton == newdata.ListMonitorWSC[m].CantonCode) {
                                                    ListMonitorWSC.push(newdata.ListMonitorWSC[m]);
                                                };
                                            };
                                        }
                                        else if (sLayerTypeCode == "Enterprise_FS") {
                                            for (var m = 0; m < newdata.ListMonitorFS.length; m++) {
                                                for (var j = 0; j < newdata.ListEnterpriseStation.length; j++) {
                                                    if (newdata.ListEnterpriseStation[j].Code == newdata.ListMonitorFS[m].DataStatusCode) {
                                                        if ((properties.selectCanton == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || CantonCode == newdata.ListMonitorFS[m].CantonCode.substr(0, CantonCode.length)) {
                                                            newdata.ListEnterpriseStation[j].QualitativeValue++;
                                                        }
                                                        else if (properties.selectCanton == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.selectCanton == newdata.ListMonitorFS[m].CantonCode) {
                                                            newdata.ListEnterpriseStation[j].QualitativeValue++;
                                                        };
                                                    };
                                                };
                                                //数据
                                                if ((properties.selectCanton == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || CantonCode == newdata.ListMonitorFS[m].CantonCode.substr(0, CantonCode.length)) {
                                                    ListMonitorFS.push(newdata.ListMonitorFS[m]);
                                                }
                                                else if (properties.selectCanton == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.selectCanton == newdata.ListMonitorFS[m].CantonCode) {
                                                    ListMonitorFS.push(newdata.ListMonitorFS[m]);
                                                };
                                                //  newdata.ListEnterpriseStation[j].QualitativeValue += newdata.ListEnterpriseStation_FS[j].QualitativeValue;
                                            };
                                        }
                                        else if (sLayerTypeCode == "Enterprise_FQ") {
                                            //                                                    for (var j = 0; j < newdata.ListEnterpriseStation_FQ.length; j++) {
                                            //                                                        newdata.ListEnterpriseStation[j].QualitativeValue += newdata.ListEnterpriseStation_FQ[j].QualitativeValue;
                                            //                                                    };
                                            for (var m = 0; m < newdata.ListMonitorFQ.length; m++) {
                                                for (var j = 0; j < newdata.ListEnterpriseStation.length; j++) {
                                                    if (newdata.ListEnterpriseStation[j].Code == newdata.ListMonitorFQ[m].DataStatusCode) {
                                                        if ((properties.selectCanton == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || CantonCode == newdata.ListMonitorFQ[m].CantonCode.substr(0, CantonCode.length)) {
                                                            newdata.ListEnterpriseStation[j].QualitativeValue++;
                                                        }
                                                        else if (properties.selectCanton == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.selectCanton == newdata.ListMonitorFQ[m].CantonCode) {
                                                            newdata.ListEnterpriseStation[j].QualitativeValue++;
                                                        };
                                                    };
                                                };
                                                //数据
                                                if ((properties.selectCanton == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || CantonCode == newdata.ListMonitorFQ[m].CantonCode.substr(0, CantonCode.length)) {
                                                    ListMonitorFQ.push(newdata.ListMonitorFQ[m]);
                                                }
                                                else if (properties.selectCanton == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.selectCanton == newdata.ListMonitorFQ[m].CantonCode) {
                                                    ListMonitorFQ.push(newdata.ListMonitorFQ[m]);
                                                };
                                            };
                                        }
                                    }
                                }
                                for (var a = 0; a < newdata.ListCantonCount.length; a++) {
                                    newdata.ListCantonCount[a].QualitativeValueFS.QualitativeValueAll = properties.MonitorSiteTypeCodeArray.Contains("Enterprise_FS") ? newdata.ListCantonCount[a].QualitativeValueFS.QualitativeValueAll : 0;
                                    newdata.ListCantonCount[a].QualitativeValueFQ.QualitativeValueAll = properties.MonitorSiteTypeCodeArray.Contains("Enterprise_FQ") ? newdata.ListCantonCount[a].QualitativeValueFQ.QualitativeValueAll : 0;
                                    newdata.ListCantonCount[a].QualitativeValueWSC.QualitativeValueAll = properties.MonitorSiteTypeCodeArray.Contains("Enterprise_WSC") ? newdata.ListCantonCount[a].QualitativeValueWSC.QualitativeValueAll : 0;
                                    CantonEntityCount += newdata.ListCantonCount[a].QualitativeValueFS.QualitativeValueAll + newdata.ListCantonCount[a].QualitativeValueFQ.QualitativeValueAll + newdata.ListCantonCount[a].QualitativeValueWSC.QualitativeValueAll;
                                    newdata.ListCantonCount[a].QualitativeValue = newdata.ListCantonCount[a].QualitativeValueFS.QualitativeValueAll + newdata.ListCantonCount[a].QualitativeValueFQ.QualitativeValueAll + newdata.ListCantonCount[a].QualitativeValueWSC.QualitativeValueAll;
                                };
                                //厂区     
                                if (API.UserInfo.IsBelongManageCantonSame && CantonEntityCount < TypeEntityCout) {
                                    newdata.ListCantonCount.push({ Code: API.UserInfo.UserBelongCantonCode, IsBelongCantonOthers: true, Name: API.UserInfo.UserBelongCantonName + UserBelongCantonNameBehindWord, QualitativeValue: TypeEntityCout - CantonEntityCount });
                                };
                                newdata.ListMonitorFQ = ListMonitorFQ;
                                newdata.ListMonitorFS = ListMonitorFS;
                                newdata.ListMonitorWSC = ListMonitorWSC;
                                newdata.EntityCount = TypeEntityCout;
                                newdata.ListCantonCount = newdata.ListCantonCount.sort(ArrayDesc);
                                dataThis[dataKey] = newdata;
                                if ($.isFunction(properties.callBack)) {
                                    properties.callBack(dataThis[dataKey]);
                                };
                            }
                        });
                    } else {
                        if ($.isFunction(properties.callBack)) {
                            properties.callBack(dataThis[dataKey]);
                        };
                    };
                    return dataThis[dataKey];
                }
        }
    }

    , Radiation: {
        Search__Radiation_MonitorSiteStatisticsInfo: {
            getData: function (properties) {
                var dataThis = this;
                var dataKey = "";
                if (properties.RadType == undefined || properties.RadType == null || properties.RadType == "") {
                    properties.RadType = Code__RaditionType.RaditionAll;
                }
                dataKey = properties.RadType;
                dataKey = "_Data_" + dataKey;
                if (dataThis[dataKey] == undefined) {
                    var successFunction = function (ResultData) {
                        if (ResultData != null && ResultData.Status == 1) {
                            dataThis[dataKey] = ResultData.Data;
                            if ($.isFunction(properties.callBack)) {
                                properties.callBack(dataThis[dataKey]);
                            };
                        };
                    };
                    var datetimelist = properties.dateTime;
                    if (properties.dateTime == undefined) {
                        datetimelist = null;
                    }
                    else {
                        datetimelist = properties.dateTime == null ? null : [properties.dateTime.ToString("UTCDateTime")];
                    }
                    switch (window.Module.RequestTypeCode) {
                        case window.Module.Code_RequestType.jQuery:
                            $.ajax($.Page.GetAjaxSettings({
                                ServiceTypeCode: "Radiation"
                                    , MethodName: "Search__Radiation_MonitorSiteStatisticsInfo"
                                    , data: jExtension.JsonToSubmitString({
                                        Ticket: $.page.ticket
                                    })
                                    , type: "post"
                                    , success: successFunction
                            }));
                            break;
                        case window.Module.Code_RequestType.Ext:
                            Ext.data.JsonP.request($.Page.GetJsonpSettings({
                                params: {
                                    ServiceName: "Enterprise",
                                    MethodName: 'Search__Enterprise_MonitorSiteStatisticsInfo',
                                    ParameterDataJsonString: Ext.JSON.encode(
                                    {
                                        Ticket: $.page.ticket
                                    })
                                }, success: successFunction
                                    , failure: window.Module.Enterprise.Search__Enterprise_MonitorSiteStatisticsInfo.getDataFailure
                            }));
                            break;
                    };
                } else {
                    if ($.isFunction(properties.callBack)) {
                        properties.callBack(dataThis[dataKey]);
                    };
                };
                return dataThis[dataKey];
            }
    , getDataFailure: function () {

    }
    , getCantonMonitorSiteList: function (properties) {
        if (properties.cantonCode == undefined || properties.cantonCode == null) {
            properties.cantonCode = "";
        };

        var dataThis = this;
        var dataKey = "";
        if (properties.RadType == undefined || properties.RadType == null || properties.RadType == "") {
            properties.RadType = Code__RaditionType.RaditionAll;
        }
        dataKey = properties.RadType;
        dataKey = "_Data_" + dataKey + "_CantonCode_" + properties.cantonCode;
        if (dataThis[dataKey] == undefined) {
            this.getData({
                dataTypeCode: properties.dataTypeCode
            , dateTime: properties.dateTime
            , callBack: function (data) {
                dataThis[dataKey] = data;
                if ($.isFunction(properties.callBack)) {
                    properties.callBack(dataThis[dataKey]);
                };
            }
            });
        } else {
            if ($.isFunction(properties.callBack)) {
                properties.callBack(dataThis[dataKey]);
            };
        };
        return dataThis[dataKey];
    }
        , getMonitorSiteList: function (properties) {
            if (properties.businessCode == undefined || properties.businessCode == null) {
                properties.businessCode = "";
            };
            var dataThis = this;
            var dataKey = "";
            switch (properties.dataTypeCode.toString()) {
                case Code__DataType.Month:
                    dataKey = properties.dateTime.ToString("yyyy-MM-01");
                    break;
                case Code__DataType.Real:
                    dataKey = "Real";
                    break;
            };
            dataKey = "_Data_" + dataKey + "_MonitorSiteCode_" + properties.MonitorSiteCode;
            if (dataThis[dataKey] == undefined) {
                this.getData({
                    dataTypeCode: properties.dataTypeCode
                , dateTime: properties.dateTime
                , callBack: function (data) {
                    var MonitorSiteList = [];
                    for (var i = 0; i < data.ListMonitor.ListMonitorAll.length; i++) {
                        if (data.ListMonitor.ListMonitorAll[i].MonitorSiteCode == properties.MonitorSiteCode) {
                            MonitorSiteList.push(data.ListMonitor.ListMonitorAll[i]);
                        }
                    }
                    dataThis[dataKey] = MonitorSiteList;
                    if ($.isFunction(properties.callBack)) {
                        properties.callBack(dataThis[dataKey]);
                    };
                }
                });
            } else {
                if ($.isFunction(properties.callBack)) {
                    properties.callBack(dataThis[dataKey]);
                };
            };
            return dataThis[dataKey];
        }
        , getBussessCodeMonitorSiteList: function (properties) {

            if (properties.businessCode == undefined || properties.businessCode == null) {
                properties.businessCode = "";
            };
            var dataThis = this;
            var dataKey = "";
            switch (properties.dataTypeCode.toString()) {
                case Code__DataType.Month:
                    dataKey = properties.dateTime.ToString("yyyy-MM-01");
                    break;
                case Code__DataType.Real:
                    dataKey = "Real";
                    break;
            };
            dataKey = "_Data_" + dataKey + "_BussessCode_" + properties.businessCode;
            if (dataThis[dataKey] == undefined) {
                this.getData({
                    dataTypeCode: properties.dataTypeCode
                , dateTime: properties.dateTime
                , callBack: function (data) {
                    var MonitorSiteList = [];
                    for (var i = 0; i < data.ListMonitor.ListMonitorAll.length; i++) {
                        if (data.ListMonitor.ListMonitorAll[i].BusinessCode == properties.businessCode) {
                            MonitorSiteList.push(data.ListMonitor.ListMonitorAll[i]);
                        }
                    }
                    dataThis[dataKey] = MonitorSiteList;
                    if ($.isFunction(properties.callBack)) {
                        properties.callBack(dataThis[dataKey]);
                    };
                }
                });
            } else {
                if ($.isFunction(properties.callBack)) {
                    properties.callBack(dataThis[dataKey]);
                };
            };
            return dataThis[dataKey];
        }
        , getStatisticsMonitorSiteList: function (properties) {

            if (properties.cantonCode == undefined || properties.cantonCode == null) {
                properties.cantonCode = "";
            };
            if (properties.RadType == undefined || properties.RadType == null) {
                properties.RadType = [0, 0, 0, 0];
            };
            if (properties.ControlType == undefined || properties.ControlType == null) {
                properties.ControlType = "";
            }
            if (properties.IsBelongCantonOthers == undefined) {
                properties.IsBelongCantonOthers = false;
            };
            var dataThis = this;
            var dataKey = "";
            var RadType = properties.RadType;
            dataKey = "_DataType_" + properties.RadType.toString() + "_StatisticsCode_" + properties.cantonCode + "_ControlType_" + properties.ControlType + "_IsBelongCantonOthers_" + properties.IsBelongCantonOthers;
            if (dataThis[dataKey] == undefined) {
                this.getData({
                    dataTypeCode: properties.dataTypeCode
                , dateTime: properties.dateTime
                , callBack: function (data) {
                    var newdata = jQuery.extend(true, {}, data); //拷贝对象
                    if (properties.RadType == undefined || properties.RadType == null || properties.RadType == "") {
                        properties.RadType = Code__RaditionType.RaditionAll;
                    }
                    var MonitorSiteList = {};
                    var ListMonitorWater = [];
                    for (var i = 0; i < newdata.ListMonitor.ListMonitorWater.length; i++) {
                        ListMonitorWater.push(newdata.ListMonitor.ListMonitorWater[i]);
                    }

                    var ListMonitorAir = [];
                    for (var i = 0; i < newdata.ListMonitor.ListMonitorAir.length; i++) {
                        ListMonitorAir.push(newdata.ListMonitor.ListMonitorAir[i]);
                    }
                    var ListMonitorSoil = [];
                    for (var i = 0; i < newdata.ListMonitor.ListMonitorSoil.length; i++) {
                        ListMonitorSoil.push(newdata.ListMonitor.ListMonitorSoil[i]);
                    }
                    var ListMonitorElectromagnetic = [];
                    for (var i = 0; i < newdata.ListMonitor.ListMonitorElectromagnetic.length; i++) {
                        ListMonitorElectromagnetic.push(newdata.ListMonitor.ListMonitorElectromagnetic[i]);
                    }
                    var ListMonitorAll = [];
                    for (var i = 0; i < newdata.ListMonitor.ListMonitorAll.length; i++) {
                        ListMonitorAll.push(newdata.ListMonitor.ListMonitorAll[i]);
                    }
                    newdata.ListControlType = newdata.ListControlType.slice(0, 2);  //留下国控和省控就是这行代码    如果去掉.slice(0, 2)就是全部
                    var EntityCount = 0;
                    //先加上其它的（如江苏省其它），QualitativeValue=0时再去掉
                    if (API.UserInfo.IsBelongManageCantonSame) {
                        newdata.ListCanton.push({ Code: API.UserInfo.UserBelongCantonCode, Name: API.UserInfo.UserBelongCantonName + UserBelongCantonNameBehindWord, QualitativeValue: 0 });
                    };
                    if (RadType.Contains("1")) {
                        EntityCount += ListMonitorWater.length;
                        MonitorSiteList.ListMonitorWater = [];
                        for (var i = 0; i < ListMonitorWater.length; i++) {
                            //类别
                            for (var j = 0; j < newdata.ListRadiationType.length; j++) {
                                if ((properties.cantonCode == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.cantonCode == ListMonitorWater[i].ParentCantonCode || properties.cantonCode == ListMonitorWater[i].MaxParentCantonCode || properties.cantonCode == ListMonitorWater[i].CantonCode) {
                                    if (newdata.ListRadiationType[j].Code == ListMonitorWater[i].RCode) {
                                        newdata.ListRadiationType[j].QualitativeValue += 1;
                                    };
                                }
                                else if (properties.cantonCode == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.cantonCode == data.ListMonitorWater[i].CantonCode) {
                                    if (newdata.ListRadiationType[j].Code == ListMonitorWater[i].RCode) {
                                        newdata.ListRadiationType[j].QualitativeValue += 1;
                                    };
                                };
                            };
                            //数据

                            if ((properties.cantonCode == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.cantonCode == ListMonitorWater[i].ParentCantonCode || properties.cantonCode == ListMonitorWater[i].MaxParentCantonCode || properties.cantonCode == ListMonitorWater[i].CantonCode) {
                                if (properties.ControlType == "") {
                                    MonitorSiteList.ListMonitorWater.push(ListMonitorWater[i]);
                                }
                                else {
                                    if (properties.ControlType == ListMonitorWater[i].AttLevelCode) {
                                        MonitorSiteList.ListMonitorWater.push(ListMonitorWater[i]);
                                    };
                                };
                                //关注类型
                                for (var l = 0; l < newdata.ListControlType.length; l++) {
                                    if (newdata.ListControlType[l].Code == ListMonitorWater[i].AttLevelCode) {
                                        newdata.ListControlType[l].QualitativeValue += 1;
                                    };
                                };
                            }
                            else if (properties.cantonCode == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.cantonCode == ListMonitorWater[i].CantonCode) {
                                if (properties.ControlType == "") {
                                    MonitorSiteList.ListMonitorWater.push(ListMonitorWater[i]);
                                }
                                else {
                                    if (properties.ControlType == ListMonitorWater[i].AttLevelCode) {
                                        MonitorSiteList.ListMonitorWater.push(ListMonitorWater[i]);
                                    };
                                };
                                //关注类型
                                for (var l = 0; l < newdata.ListControlType.length; l++) {
                                    if (newdata.ListControlType[l].Code == ListMonitorWater[i].AttLevelCode) {
                                        newdata.ListControlType[l].QualitativeValue += 1;
                                    };
                                };
                            };
                            //厂区     
                            if (API.UserInfo.IsBelongManageCantonSame) {
                                for (var k = 0; k < newdata.ListCanton.length; k++) {
                                    if (newdata.ListCanton[k].Code == ListMonitorWater[i].ParentCantonCode || newdata.ListCanton[k].Code == ListMonitorWater[i].MaxParentCantonCode || newdata.ListCanton[k].Code == ListMonitorWater[i].CantonCode) {
                                        if (API.UserInfo.UserBelongCantonCode == ListMonitorWater[i].CantonCode) {
                                            newdata.ListCanton[newdata.ListCanton.length - 1].QualitativeValue += 1;
                                        }
                                        else {
                                            if (k < newdata.ListCanton.length - 1) {
                                                newdata.ListCanton[k].QualitativeValue += 1;
                                            };
                                        };
                                    };
                                };
                            }
                            else {
                                for (var k = 0; k < newdata.ListCanton.length; k++) {
                                    if (newdata.ListCanton[k].Code == ListMonitorWater[i].ParentCantonCode || newdata.ListCanton[k].Code == ListMonitorWater[i].MaxParentCantonCode || newdata.ListCanton[k].Code == ListMonitorWater[i].CantonCode) {
                                        newdata.ListCanton[k].QualitativeValue += 1;
                                    };
                                };
                            };
                        };
                    }
                    else {
                        MonitorSiteList.ListMonitorWater = [];
                    };

                    if (RadType.Contains("2")) {
                        EntityCount += ListMonitorAir.length;
                        MonitorSiteList.ListMonitorAir = [];
                        for (var i = 0; i < ListMonitorAir.length; i++) {
                            //类别
                            for (var j = 0; j < newdata.ListRadiationType.length; j++) {
                                if ((properties.cantonCode == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.cantonCode == ListMonitorAir[i].ParentCantonCode || properties.cantonCode == ListMonitorAir[i].MaxParentCantonCode || properties.cantonCode == ListMonitorAir[i].CantonCode) {
                                    if (newdata.ListRadiationType[j].Code == ListMonitorAir[i].RCode) {
                                        newdata.ListRadiationType[j].QualitativeValue += 1;
                                    };
                                }
                                else if (properties.cantonCode == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.cantonCode == ListMonitorAir[i].CantonCode) {
                                    if (newdata.ListRadiationType[j].Code == ListMonitorAir[i].RCode) {
                                        newdata.ListRadiationType[j].QualitativeValue += 1;
                                    };
                                };
                            }

                            if ((properties.cantonCode == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.cantonCode == ListMonitorAir[i].ParentCantonCode || properties.cantonCode == ListMonitorAir[i].MaxParentCantonCode || properties.cantonCode == ListMonitorAir[i].CantonCode) {
                                if (properties.ControlType == "") {
                                    MonitorSiteList.ListMonitorAir.push(ListMonitorAir[i]);
                                }
                                else {
                                    if (properties.ControlType == ListMonitorAir[i].AttLevelCode) {
                                        MonitorSiteList.ListMonitorAir.push(ListMonitorAir[i]);
                                    }
                                }
                                //关注类型
                                for (var l = 0; l < newdata.ListControlType.length; l++) {
                                    if (newdata.ListControlType[l].Code == ListMonitorAir[i].AttLevelCode) {
                                        newdata.ListControlType[l].QualitativeValue += 1;
                                    }
                                }
                            }
                            else if (properties.cantonCode == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.cantonCode == ListMonitorAir[i].CantonCode) {
                                if (properties.ControlType == "") {
                                    MonitorSiteList.ListMonitorAir.push(ListMonitorAir[i]);
                                }
                                else {
                                    if (properties.ControlType == ListMonitorAir[i].AttLevelCode) {
                                        MonitorSiteList.ListMonitorAir.push(ListMonitorAir[i]);
                                    }
                                }
                                //关注类型
                                for (var l = 0; l < newdata.ListControlType.length; l++) {
                                    if (newdata.ListControlType[l].Code == ListMonitorAir[i].AttLevelCode) {
                                        newdata.ListControlType[l].QualitativeValue += 1;
                                    }
                                }
                            }
                            //厂区           
                            if (API.UserInfo.IsBelongManageCantonSame) {
                                for (var k = 0; k < newdata.ListCanton.length; k++) {
                                    if (newdata.ListCanton[k].Code == ListMonitorAir[i].ParentCantonCode || newdata.ListCanton[k].Code == ListMonitorAir[i].MaxParentCantonCode || newdata.ListCanton[k].Code == ListMonitorAir[i].CantonCode) {
                                        if (API.UserInfo.UserBelongCantonCode == ListMonitorAir[i].CantonCode) {
                                            newdata.ListCanton[newdata.ListCanton.length - 1].QualitativeValue += 1;
                                        }
                                        else {
                                            if (k < newdata.ListCanton.length - 1) {
                                                newdata.ListCanton[k].QualitativeValue += 1;
                                            };
                                        };
                                    };
                                };
                            }
                            else {
                                for (var k = 0; k < newdata.ListCanton.length; k++) {
                                    if (newdata.ListCanton[k].Code == ListMonitorAir[i].ParentCantonCode || newdata.ListCanton[k].Code == ListMonitorAir[i].MaxParentCantonCode || newdata.ListCanton[k].Code == ListMonitorAir[i].CantonCode) {
                                        newdata.ListCanton[k].QualitativeValue += 1;
                                    };
                                };
                            };
                        };
                    }
                    else
                    { MonitorSiteList.ListMonitorAir = []; };
                    if (RadType.Contains("3")) {
                        EntityCount += ListMonitorSoil.length;
                        MonitorSiteList.ListMonitorSoil = [];
                        for (var i = 0; i < ListMonitorSoil.length; i++) {
                            //类别
                            for (var j = 0; j < newdata.ListRadiationType.length; j++) {
                                if ((properties.cantonCode == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.cantonCode == ListMonitorSoil[i].ParentCantonCode || properties.cantonCode == ListMonitorSoil[i].MaxParentCantonCode || properties.cantonCode == ListMonitorSoil[i].CantonCode) {
                                    if (newdata.ListRadiationType[j].Code == ListMonitorSoil[i].RCode) {
                                        newdata.ListRadiationType[j].QualitativeValue += 1;
                                    };
                                }
                                else if (properties.cantonCode == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.cantonCode == ListMonitorSoil[i].CantonCode) {
                                    if (newdata.ListRadiationType[j].Code == ListMonitorSoil[i].RCode) {
                                        newdata.ListRadiationType[j].QualitativeValue += 1;
                                    };
                                };
                            };

                            if ((properties.cantonCode == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.cantonCode == ListMonitorSoil[i].ParentCantonCode || properties.cantonCode == ListMonitorSoil[i].MaxParentCantonCode || properties.cantonCode == ListMonitorSoil[i].CantonCode) {
                                if (properties.ControlType == "") {
                                    MonitorSiteList.ListMonitorSoil.push(ListMonitorSoil[i]);
                                }
                                else {
                                    if (properties.ControlType == ListMonitorSoil[i].AttLevelCode) {
                                        MonitorSiteList.ListMonitorSoil.push(ListMonitorSoil[i]);
                                    };
                                };
                                //关注类型
                                for (var l = 0; l < newdata.ListControlType.length; l++) {
                                    if (newdata.ListControlType[l].Code == ListMonitorSoil[i].AttLevelCode) {
                                        newdata.ListControlType[l].QualitativeValue += 1;
                                    };
                                };
                            }
                            else if (properties.cantonCode == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.cantonCode == ListMonitorSoil[i].CantonCode) {
                                if (properties.ControlType == "") {
                                    MonitorSiteList.ListMonitorSoil.push(ListMonitorSoil[i]);
                                }
                                else {
                                    if (properties.ControlType == ListMonitorSoil[i].AttLevelCode) {
                                        MonitorSiteList.ListMonitorSoil.push(ListMonitorSoil[i]);
                                    };
                                };
                                //关注类型
                                for (var l = 0; l < newdata.ListControlType.length; l++) {
                                    if (newdata.ListControlType[l].Code == ListMonitorSoil[i].AttLevelCode) {
                                        newdata.ListControlType[l].QualitativeValue += 1;
                                    };
                                };
                            };

                            //厂区
                            if (API.UserInfo.IsBelongManageCantonSame) {
                                for (var k = 0; k < newdata.ListCanton.length; k++) {
                                    if (newdata.ListCanton[k].Code == ListMonitorSoil[i].ParentCantonCode || newdata.ListCanton[k].Code == ListMonitorSoil[i].MaxParentCantonCode || newdata.ListCanton[k].Code == ListMonitorSoil[i].CantonCode) {
                                        if (API.UserInfo.UserBelongCantonCode == ListMonitorSoil[i].CantonCode) {
                                            newdata.ListCanton[newdata.ListCanton.length - 1].QualitativeValue += 1;
                                        }
                                        else {
                                            if (k < newdata.ListCanton.length - 1) {
                                                newdata.ListCanton[k].QualitativeValue += 1;
                                            };
                                        };
                                    };
                                };
                            }
                            else {
                                for (var k = 0; k < newdata.ListCanton.length; k++) {
                                    if (newdata.ListCanton[k].Code == ListMonitorSoil[i].ParentCantonCode || newdata.ListCanton[k].Code == ListMonitorSoil[i].MaxParentCantonCode || newdata.ListCanton[k].Code == ListMonitorSoil[i].CantonCode) {
                                        newdata.ListCanton[k].QualitativeValue += 1;
                                    };
                                };
                            };
                        };
                    }
                    else {
                        MonitorSiteList.ListMonitorSoil = [];
                    };
                    if (RadType.Contains("4")) {
                        EntityCount += ListMonitorElectromagnetic.length;
                        MonitorSiteList.ListMonitorElectromagnetic = [];
                        for (var i = 0; i < ListMonitorElectromagnetic.length; i++) {
                            //类别
                            for (var j = 0; j < newdata.ListRadiationType.length; j++) {
                                if ((properties.cantonCode == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.cantonCode == ListMonitorElectromagnetic[i].ParentCantonCode || properties.cantonCode == ListMonitorElectromagnetic[i].MaxParentCantonCode || properties.cantonCode == ListMonitorElectromagnetic[i].CantonCode) {
                                    if (newdata.ListRadiationType[j].Code == ListMonitorElectromagnetic[i].RCode) {
                                        newdata.ListRadiationType[j].QualitativeValue += 1;
                                    };
                                }
                                else if (properties.cantonCode == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.cantonCode == ListMonitorElectromagnetic[i].CantonCode) {
                                    if (newdata.ListRadiationType[j].Code == ListMonitorElectromagnetic[i].RCode) {
                                        newdata.ListRadiationType[j].QualitativeValue += 1;
                                    };
                                };
                            };
                            // 国控、省控
                            if ((properties.cantonCode == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.cantonCode == ListMonitorElectromagnetic[i].ParentCantonCode || properties.cantonCode == ListMonitorElectromagnetic[i].MaxParentCantonCode || properties.cantonCode == ListMonitorElectromagnetic[i].CantonCode) {
                                if (properties.ControlType == "") {
                                    MonitorSiteList.ListMonitorElectromagnetic.push(ListMonitorElectromagnetic[i]);
                                }
                                else {
                                    if (properties.ControlType == ListMonitorElectromagnetic[i].AttLevelCode) {
                                        MonitorSiteList.ListMonitorElectromagnetic.push(ListMonitorElectromagnetic[i]);
                                    };
                                };
                                for (var l = 0; l < newdata.ListControlType.length; l++) {
                                    if (newdata.ListControlType[l].Code == ListMonitorElectromagnetic[i].AttLevelCode) {
                                        newdata.ListControlType[l].QualitativeValue += 1;
                                    };
                                };
                            }
                            else if (properties.cantonCode == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.cantonCode == ListMonitorElectromagnetic[i].CantonCode) {
                                if (properties.ControlType == "") {
                                    MonitorSiteList.ListMonitorElectromagnetic.push(ListMonitorElectromagnetic[i]);
                                }
                                else {
                                    if (properties.ControlType == ListMonitorElectromagnetic[i].AttLevelCode) {
                                        MonitorSiteList.ListMonitorElectromagnetic.push(ListMonitorElectromagnetic[i]);
                                    };
                                };
                                for (var l = 0; l < newdata.ListControlType.length; l++) {
                                    if (newdata.ListControlType[l].Code == ListMonitorElectromagnetic[i].AttLevelCode) {
                                        newdata.ListControlType[l].QualitativeValue += 1;
                                    };
                                };
                            };
                            //厂区
                            if (API.UserInfo.IsBelongManageCantonSame) {
                                for (var k = 0; k < newdata.ListCanton.length; k++) {
                                    if (newdata.ListCanton[k].Code == ListMonitorElectromagnetic[i].ParentCantonCode || newdata.ListCanton[k].Code == ListMonitorElectromagnetic[i].MaxParentCantonCode || newdata.ListCanton[k].Code == ListMonitorElectromagnetic[i].CantonCode) {
                                        if (API.UserInfo.UserBelongCantonCode == ListMonitorElectromagnetic[i].CantonCode) {
                                            newdata.ListCanton[newdata.ListCanton.length - 1].QualitativeValue += 1;
                                        }
                                        else {
                                            if (k < newdata.ListCanton.length - 1) {
                                                newdata.ListCanton[k].QualitativeValue += 1;
                                            };
                                        };
                                    };
                                };
                            }
                            else {
                                for (var k = 0; k < newdata.ListCanton.length; k++) {
                                    if (newdata.ListCanton[k].Code == ListMonitorElectromagnetic[i].ParentCantonCode || newdata.ListCanton[k].Code == ListMonitorElectromagnetic[i].MaxParentCantonCode || newdata.ListCanton[k].Code == ListMonitorElectromagnetic[i].CantonCode) {
                                        newdata.ListCanton[k].QualitativeValue += 1;
                                    };
                                };
                            };
                        };
                    }
                    else {
                        MonitorSiteList.ListMonitorElectromagnetic = [];
                    }
                    if (newdata.ListCanton[newdata.ListCanton.length - 1].QualitativeValue == 0) {
                        newdata.ListCanton.pop();
                    };
                    newdata.EntityCount = EntityCount;
                    newdata.ListCanton = newdata.ListCanton.sort(ArrayDesc);
                    newdata.ListMonitor = MonitorSiteList;
                    dataThis[dataKey] = newdata;
                    if ($.isFunction(properties.callBack)) {
                        properties.callBack(dataThis[dataKey]);
                    };
                }
                });
            } else {
                if ($.isFunction(properties.callBack)) {
                    properties.callBack(dataThis[dataKey]);
                };
            };
            return dataThis[dataKey];
        }
        }
    }
    , Water: {
        DrinkWater: {
            Search__DrinkWater_MonitorSiteStatisticsInfo: {
                getData: function (properties) {
                    //var settings = {
                    //    dataTypeCode: ""
                    //    , dateTime: new Date()
                    //    , callBack: function (data) { }
                    //};
                    var dataThis = this;
                    var dataKey = "";
                    switch (properties.dataTypeCode.toString()) {
                        case Code__DataType.Month:
                            dataKey = "Month";
                            //dataKey = properties.dateTime.ToString("yyyy-MM-01");
                            break;
                        case Code__DataType.Hour:
                            dataKey = "Hour";
                            break;
                    };
                    dataKey = "_Data_" + dataKey;
                    if (dataThis[dataKey] == undefined) {
                        var successFunction = function (ResultData) {
                            if (ResultData != null && ResultData.Status == 1) {
                                dataThis[dataKey] = ResultData.Data;
                                if ($.isFunction(properties.callBack)) {
                                    properties.callBack(dataThis[dataKey]);
                                };
                            };
                        };
                        switch (window.Module.RequestTypeCode) {
                            case window.Module.Code_RequestType.jQuery:
                                $.ajax($.Page.GetAjaxSettings({
                                    ServiceTypeCode: "Water"
                                    , MethodName: "Search__DrinkWater_MonitorSiteStatisticsInfo"
                                    , data: jExtension.JsonToSubmitString({
                                        Ticket: $.page.ticket
                                        , ParameterData: {
                                            DataTypeCode: properties.dataTypeCode
                                            , DateTimeList: properties.dateTime == null ? null : [properties.dateTime.ToString("UTCDateTime")]
                                        }
                                    })
                                    , type: "post"
                                    , success: successFunction
                                }));
                                break;
                            case window.Module.Code_RequestType.Ext:
                                Ext.data.JsonP.request($.Page.GetJsonpSettings({
                                    params: {
                                        ServiceName: "Water",
                                        MethodName: 'Search__DrinkWater_MonitorSiteStatisticsInfo',
                                        ParameterDataJsonString: Ext.JSON.encode(
                                    {
                                        Ticket: $.page.ticket
                                        , ParameterData: {
                                            DataTypeCode: properties.dataTypeCode
                                            , DateTimeList: properties.dateTimeList
                                        }
                                    })
                                    }, success: successFunction
                                    , failure: window.Module.Water.DrinkWater.Search__DrinkWater_MonitorSiteStatisticsInfo.getDataFailure
                                }));
                                break;
                        };
                    } else {
                        if ($.isFunction(properties.callBack)) {
                            properties.callBack(dataThis[dataKey]);
                        };
                    };
                    return dataThis[dataKey];
                }
                , getDataFailure: function () {

                }
                , getCantonMonitorSiteList: function (properties) {
                    //var settings = {
                    //    dataTypeCode: ""
                    //    , dateTime: new Date()
                    //    , cantonCode:""
                    //    , callBack: function (data) { }
                    //};
                    if (properties.cantonCode == undefined || properties.cantonCode == null) {
                        properties.cantonCode = "";
                    };
                    if (properties.IsBelongCantonOthers == undefined) {
                        properties.IsBelongCantonOthers = false;
                    };
                    var dataThis = this;
                    var dataKey = "";
                    switch (properties.dataTypeCode.toString()) {
                        case Code__DataType.Month:
                            dataKey = "Month";
                            //dataKey = properties.dateTime.ToString("yyyy-MM-01");
                            break;
                        case Code__DataType.Hour:
                            dataKey = "Hour";
                            break;
                    };
                    dataKey = "_Data_" + dataKey + "_CantonCode_" + properties.cantonCode + "_IsBelongCantonOthers_" + properties.IsBelongCantonOthers;
                    if (dataThis[dataKey] == undefined) {
                        this.getData({
                            dataTypeCode: properties.dataTypeCode
                            , dateTime: properties.dateTime
                            , callBack: function (data) {
                                var MonitorSiteList = [];
                                for (var j = 0; j < data.ListMonitor.length; j++) {
                                    if (properties.MonitorSiteCode == undefined) {
                                        if ((properties.cantonCode == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.cantonCode == data.ListMonitor[j].ParentCantonCode || properties.cantonCode == data.ListMonitor[j].MaxParentCantonCode || properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                            MonitorSiteList.push(data.ListMonitor[j]);
                                        }
                                        else if (properties.cantonCode == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                            MonitorSiteList.push(data.ListMonitor[j]);
                                        };
                                    }
                                    else {
                                        if (properties.MonitorSiteCode = data.ListMonitor[j].MonitorSiteCode) {
                                            MonitorSiteList.push(data.ListMonitor[j]);
                                        };
                                    };
                                };
                                dataThis[dataKey] = MonitorSiteList;
                                if ($.isFunction(properties.callBack)) {
                                    properties.callBack(dataThis[dataKey]);
                                };
                            }
                        });
                    } else {
                        if ($.isFunction(properties.callBack)) {
                            properties.callBack(dataThis[dataKey]);
                        };
                    };
                    return dataThis[dataKey];
                }
                , getWaterQualityTypeMonitorSiteList: function (properties) {
                    //var settings = {
                    //    dataTypeCode: ""
                    //    , dateTime: new Date()
                    //    , cantonCode:
                    //    , waterQualityTypeCode:""
                    //    , callBack: function (data) { }
                    //};
                    if (properties.cantonCode == undefined || properties.cantonCode == null) {
                        properties.cantonCode = "";
                    };
                    if (properties.IsBelongCantonOthers == undefined) {
                        properties.IsBelongCantonOthers = false;
                    };
                    if (properties.waterQualityTypeCode == undefined || properties.waterQualityTypeCode == null) {
                        properties.waterQualityTypeCode = "";
                    };
                    var dataThis = this;
                    var dataKey = "";
                    switch (properties.dataTypeCode.toString()) {
                        case Code__DataType.Month:
                            dataKey = "Month";
                            //dataKey = properties.dateTime.ToString("yyyy-MM-01");
                            break;
                        case Code__DataType.Hour:
                            dataKey = "Hour";
                            break;
                    };
                    dataKey = "_Data_" + dataKey + "_WaterQualityTypeCode_" + properties.waterQualityTypeCode + "_" + properties.cantonCode + "_IsBelongCantonOthers_" + properties.IsBelongCantonOthers;
                    if (dataThis[dataKey] == undefined) {
                        this.getData({
                            dataTypeCode: properties.dataTypeCode
                            , dateTime: properties.dateTime
                            , callBack: function (data) {
                                var MonitorSiteList = [];
                                for (var j = 0; j < data.ListMonitor.length; j++) {
                                    if ((properties.cantonCode == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.cantonCode == data.ListMonitor[j].ParentCantonCode || properties.cantonCode == data.ListMonitor[j].MaxParentCantonCode || properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                        if (properties.waterQualityTypeCode == "" || properties.waterQualityTypeCode == data.ListMonitor[j].WaterQualityTypeCode) {
                                            MonitorSiteList.push(data.ListMonitor[j]);
                                        };
                                    }
                                    else if (properties.cantonCode == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                        if (properties.waterQualityTypeCode == "" || properties.waterQualityTypeCode == data.ListMonitor[j].WaterQualityTypeCode) {
                                            MonitorSiteList.push(data.ListMonitor[j]);
                                        };
                                    };
                                };
                                dataThis[dataKey] = MonitorSiteList;
                                if ($.isFunction(properties.callBack)) {
                                    properties.callBack(dataThis[dataKey]);
                                };
                            }
                        });
                    } else {
                        if ($.isFunction(properties.callBack)) {
                            properties.callBack(dataThis[dataKey]);
                        };
                    };
                    return dataThis[dataKey];
                }
                , getQualifiedMonitorSiteList: function (properties) {
                    //var settings = {
                    //    dataTypeCode: ""
                    //    , dateTime: new Date()
                    //    , cantonCode:
                    //    , qualifiedCode:""
                    //    , callBack: function (data) { }
                    //};
                    if (properties.cantonCode == undefined || properties.cantonCode == null) {
                        properties.cantonCode = "";
                    };
                    if (properties.qualifiedCode == undefined || properties.qualifiedCode == null) {
                        properties.qualifiedCode = "";
                    };
                    if (properties.IsBelongCantonOthers == undefined) {
                        properties.IsBelongCantonOthers = false;
                    };
                    var dataThis = this;
                    var dataKey = "";
                    switch (properties.dataTypeCode.toString()) {
                        case Code__DataType.Month:
                            dataKey = "Month";
                            //dataKey = properties.dateTime.ToString("yyyy-MM-01");
                            break;
                        case Code__DataType.Hour:
                            dataKey = "Hour";
                            break;
                    };
                    dataKey = "_Data_" + dataKey + "_QualifiedCode_" + properties.qualifiedCode + "_" + properties.cantonCode + "_IsBelongCantonOthers_" + properties.IsBelongCantonOthers;
                    if (dataThis[dataKey] == undefined) {
                        this.getData({
                            dataTypeCode: properties.dataTypeCode
                            , dateTime: properties.dateTime
                            , callBack: function (data) {
                                var MonitorSiteList = [];
                                for (var j = 0; j < data.ListMonitor.length; j++) {
                                    if ((properties.cantonCode == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.cantonCode == data.ListMonitor[j].ParentCantonCode || properties.cantonCode == data.ListMonitor[j].MaxParentCantonCode || properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                        if (properties.qualifiedCode == "" || properties.qualifiedCode == data.ListMonitor[j].IsExcessive) {
                                            MonitorSiteList.push(data.ListMonitor[j]);
                                        };
                                    }
                                    else if (properties.cantonCode == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                        if (properties.qualifiedCode == "" || properties.qualifiedCode == data.ListMonitor[j].IsExcessive) {
                                            MonitorSiteList.push(data.ListMonitor[j]);
                                        };
                                    };
                                };
                                dataThis[dataKey] = MonitorSiteList;
                                if ($.isFunction(properties.callBack)) {
                                    properties.callBack(dataThis[dataKey]);
                                };
                            }
                        });
                    } else {
                        if ($.isFunction(properties.callBack)) {
                            properties.callBack(dataThis[dataKey]);
                        };
                    };
                    return dataThis[dataKey];
                }
                , getBussessCodeMonitorSiteList: function (properties) {
                    //var settings = {
                    //    dataTypeCode: ""
                    //    , dateTime: new Date()
                    //    , businessCode:""
                    //    , callBack: function (data) { }
                    //};

                    if (properties.businessCode == undefined || properties.businessCode == null) {
                        properties.businessCode = "";
                    };
                    var dataThis = this;
                    var dataKey = "";
                    switch (properties.dataTypeCode.toString()) {
                        case Code__DataType.Month:
                            dataKey = "Month";
                            //dataKey = properties.dateTime.ToString("yyyy-MM-01");
                            break;
                        case Code__DataType.Hour:
                            dataKey = "Hour";
                            break;
                    };
                    dataKey = "_Data_" + dataKey + "_BussessCode_" + properties.businessCode;
                    if (dataThis[dataKey] == undefined) {
                        this.getData({
                            dataTypeCode: properties.dataTypeCode
                            , dateTime: properties.dateTime
                            , callBack: function (data) {
                                var MonitorSiteList = [];
                                for (var j = 0; j < data.ListMonitor.length; j++) {
                                    if (properties.businessCode == data.ListMonitor[j].BusinessCode) {
                                        MonitorSiteList.push(data.ListMonitor[j]);
                                    };
                                };
                                dataThis[dataKey] = MonitorSiteList;
                                if ($.isFunction(properties.callBack)) {
                                    properties.callBack(dataThis[dataKey]);
                                };
                            }
                        });
                    } else {
                        if ($.isFunction(properties.callBack)) {
                            properties.callBack(dataThis[dataKey]);
                        };
                    };
                    return dataThis[dataKey];
                }
                , getStatisticsMonitorSiteList: function (properties) {
                    //var settings = {
                    //    dataTypeCode: ""
                    //    ,dateTime: new Date()
                    //    ,selectCanton:""  
                    //    , callBack: function (data) { }
                    //};
                    if (properties.selectCanton == undefined || properties.selectCanton == null) {
                        properties.selectCanton = "";
                    };
                    if (properties.IsBelongCantonOthers == undefined) {
                        properties.IsBelongCantonOthers = false;
                    };
                    var dataThis = this;
                    var dataKey = "";
                    switch (properties.dataTypeCode.toString()) {
                        case Code__DataType.Month:
                            dataKey = "Month"
                            //dataKey = properties.dateTime.ToString("yyyy-MM-01");
                            break;
                        case Code__DataType.Hour:
                            dataKey = "Hour";
                            break;
                    };
                    dataKey = "_Data_" + dataKey + "_StatisticsCode_" + properties.selectCanton + "_IsBelongCantonOthers_" + properties.IsBelongCantonOthers;
                    if (dataThis[dataKey] == undefined) {
                        this.getData({
                            dataTypeCode: properties.dataTypeCode
                            , dateTime: properties.dateTime
                            , callBack: function (data) {
                                var newdata = jQuery.extend(true, {}, data); //拷贝对象
                                newdata.EntityCount = newdata.ListMonitor.length;
                                var IsHaveBenji = 0; //是否含有其它 默认不含
                                //先加上其它的（如江苏省其它），QualitativeValue=0时再去掉
                                if (API.UserInfo.IsBelongManageCantonSame) {
                                    newdata.ListCanton.push({ Code: API.UserInfo.UserBelongCantonCode, Name: API.UserInfo.UserBelongCantonName + UserBelongCantonNameBehindWord, QualitativeValue: 0 });
                                };
                                for (var i = 0; i < newdata.ListMonitor.length; i++) {
                                    //是否达标 
                                    for (var j = 0; j < newdata.ListIsExcessive.length; j++) {
                                        if (newdata.ListMonitor[i].IsExcessive == newdata.ListIsExcessive[j].Code) {
                                            if ((properties.selectCanton == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.selectCanton == newdata.ListMonitor[i].ParentCantonCode || properties.selectCanton == newdata.ListMonitor[i].MaxParentCantonCode || properties.selectCanton == newdata.ListMonitor[i].CantonCode) {
                                                newdata.ListIsExcessive[j].QualitativeValue += 1;
                                            }
                                            else if (properties.selectCanton == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.selectCanton == newdata.ListMonitor[i].CantonCode) {
                                                newdata.ListIsExcessive[j].QualitativeValue++;
                                            };
                                        };
                                    };
                                    //类别
                                    for (var j = 0; j < newdata.ListWaterQualityType.length; j++) {
                                        if (newdata.ListMonitor[i].WaterQualityTypeCode == newdata.ListWaterQualityType[j].Code) {
                                            if ((properties.selectCanton == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.selectCanton == newdata.ListMonitor[i].ParentCantonCode || properties.selectCanton == newdata.ListMonitor[i].MaxParentCantonCode || properties.selectCanton == newdata.ListMonitor[i].CantonCode) {
                                                newdata.ListWaterQualityType[j].QualitativeValue += 1;
                                            }
                                            else if (properties.selectCanton == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.selectCanton == newdata.ListMonitor[i].CantonCode) {
                                                newdata.ListWaterQualityType[j].QualitativeValue++;
                                            };
                                        };
                                    };
                                    //厂区

                                    if (API.UserInfo.IsBelongManageCantonSame) {
                                        for (var j = 0; j < newdata.ListCanton.length; j++) {
                                            if (newdata.ListCanton[j].Code == "" || newdata.ListCanton[j].Code == newdata.ListMonitor[i].ParentCantonCode || newdata.ListCanton[j].Code == newdata.ListMonitor[i].MaxParentCantonCode || newdata.ListCanton[j].Code == newdata.ListMonitor[i].CantonCode) {
                                                if (API.UserInfo.UserBelongCantonCode == newdata.ListMonitor[i].CantonCode) {
                                                    newdata.ListCanton[newdata.ListCanton.length - 1].QualitativeValue++;
                                                }
                                                else {
                                                    if (j < newdata.ListCanton.length - 1) {
                                                        newdata.ListCanton[j].QualitativeValue += 1;
                                                    };
                                                };
                                            };
                                        };
                                    }
                                    else {
                                        for (var j = 0; j < newdata.ListCanton.length; j++) {
                                            if (newdata.ListCanton[j].Code == "" || newdata.ListCanton[j].Code == newdata.ListMonitor[i].ParentCantonCode || newdata.ListCanton[j].Code == newdata.ListMonitor[i].MaxParentCantonCode || newdata.ListCanton[j].Code == newdata.ListMonitor[i].CantonCode) {
                                                newdata.ListCanton[j].QualitativeValue += 1;
                                            };
                                        };
                                    };
                                };
                                if (newdata.ListCanton[newdata.ListCanton.length - 1].QualitativeValue == 0) {
                                    newdata.ListCanton.pop();
                                }
                                newdata.ListCanton = newdata.ListCanton.sort(ArrayDesc);
                                dataThis[dataKey] = newdata;
                                if ($.isFunction(properties.callBack)) {
                                    properties.callBack(dataThis[dataKey]);
                                };
                            }
                        });
                    } else {
                        if ($.isFunction(properties.callBack)) {
                            properties.callBack(dataThis[dataKey]);
                        };
                    };
                    return dataThis[dataKey];
                }
            }
        }
        , WaterSite: {
            Search__WaterSite_MonitorSiteStatisticsInfo: {
                getData: function (properties) {
                    //var settings = {
                    //    dataTypeCode: ""
                    //    , dateTime: new Date()
                    //    , callBack: function (data) { }
                    //};
                    var dataThis = this;
                    var dataKey = "";
                    switch (properties.dataTypeCode.toString()) {
                        case Code__DataType.Month:
                            dataKey = properties.dateTime.ToString("yyyy-MM-01");
                            break;
                        case Code__DataType.Real:
                            dataKey = "Real";
                            break;
                    };
                    dataKey = "_Data_" + dataKey;
                    if (dataThis[dataKey] == undefined) {
                        var successFunction = function (ResultData) {
                            if (ResultData != null && ResultData.Status == 1) {
                                dataThis[dataKey] = ResultData.Data;
                                if ($.isFunction(properties.callBack)) {
                                    properties.callBack(dataThis[dataKey]);
                                };
                            };
                        };
                        switch (window.Module.RequestTypeCode) {
                            case window.Module.Code_RequestType.jQuery:
                                $.ajax($.Page.GetAjaxSettings({
                                    ServiceTypeCode: "Water"
                                    , MethodName: "Search__WaterSite_MonitorSiteStatisticsInfo"
                                    , data: jExtension.JsonToSubmitString({
                                        Ticket: $.page.ticket
                                        , ParameterData: {
                                            DataTypeCode: properties.dataTypeCode
                                            , DateTimeList: properties.dateTime == null ? null : [properties.dateTime.ToString("UTCDateTime")]
                                        }
                                    })
                                    , type: "post"
                                    , success: successFunction
                                }));
                                break;
                            case window.Module.Code_RequestType.Ext:
                                Ext.data.JsonP.request($.Page.GetJsonpSettings({
                                    params: {
                                        ServiceName: "Water",
                                        MethodName: 'Search__WaterSite_MonitorSiteStatisticsInfo',
                                        ParameterDataJsonString: Ext.JSON.encode(
                                    {
                                        Ticket: $.page.ticket
                                        , ParameterData: {
                                            DataTypeCode: properties.dataTypeCode
                                            , DateTimeList: properties.dateTimeList
                                        }
                                    })
                                    }, success: successFunction
                                    , failure: window.Module.Water.WaterSite.Search__WaterSite_MonitorSiteStatisticsInfo.getDataFailure
                                }));
                                break;
                        };
                    } else {
                        if ($.isFunction(properties.callBack)) {
                            properties.callBack(dataThis[dataKey]);
                        };
                    };
                    return dataThis[dataKey];
                }
                , getDataFailure: function () {

                }
                , getCantonMonitorSiteList: function (properties) {
                    //var settings = {
                    //    dataTypeCode: ""
                    //    , dateTime: new Date()
                    //    , cantonCode:""
                    //    , callBack: function (data) { }
                    //};
                    if (properties.cantonCode == undefined || properties.cantonCode == null) {
                        properties.cantonCode = "";
                    };
                    if (properties.IsBelongCantonOthers == undefined) {
                        properties.IsBelongCantonOthers = false;
                    };
                    var dataThis = this;
                    var dataKey = "";
                    switch (properties.dataTypeCode.toString()) {
                        case Code__DataType.Month:
                            dataKey = properties.dateTime.ToString("yyyy-MM-01");
                            break;
                        case Code__DataType.Real:
                            dataKey = "Real";
                            break;
                    };
                    dataKey = "_Data_" + dataKey + "_CantonCode_" + properties.cantonCode + "_IsBelongCantonOthers_" + properties.IsBelongCantonOthers;
                    if (dataThis[dataKey] == undefined) {
                        this.getData({
                            dataTypeCode: properties.dataTypeCode
                            , dateTime: properties.dateTime
                            , callBack: function (data) {
                                var MonitorSiteList = [];
                                for (var j = 0; j < data.ListMonitor.length; j++) {
                                    if (properties.MonitorSiteCode == undefined) {
                                        if ((properties.cantonCode == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.cantonCode == data.ListMonitor[j].ParentCantonCode || properties.cantonCode == data.ListMonitor[j].MaxParentCantonCode || properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                            MonitorSiteList.push(data.ListMonitor[j]);
                                        }
                                        else if (properties.cantonCode == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                            MonitorSiteList.push(data.ListMonitor[j]);
                                        };
                                    }
                                    else {
                                        if (properties.MonitorSiteCode = data.ListMonitor[j].MonitorSiteCode) {
                                            MonitorSiteList.push(data.ListMonitor[j]);
                                        }
                                    }
                                };
                                dataThis[dataKey] = MonitorSiteList;
                                if ($.isFunction(properties.callBack)) {
                                    properties.callBack(dataThis[dataKey]);
                                };
                            }
                        });
                    } else {
                        if ($.isFunction(properties.callBack)) {
                            properties.callBack(dataThis[dataKey]);
                        };
                    };
                    return dataThis[dataKey];
                }
                , getWaterQualityTypeMonitorSiteList: function (properties) {
                    //var settings = {
                    //    dataTypeCode: ""
                    //    , dateTime: new Date()
                    //    , cantonCode:
                    //    , waterQualityTypeCode:""
                    //    , callBack: function (data) { }
                    //};
                    if (properties.cantonCode == undefined || properties.cantonCode == null) {
                        properties.cantonCode = "";
                    };
                    if (properties.IsBelongCantonOthers == undefined) {
                        properties.IsBelongCantonOthers = false;
                    };
                    if (properties.waterQualityTypeCode == undefined || properties.waterQualityTypeCode == null) {
                        properties.waterQualityTypeCode = "";
                    };
                    var dataThis = this;
                    var dataKey = "";
                    switch (properties.dataTypeCode.toString()) {
                        case Code__DataType.Month:
                            dataKey = properties.dateTime.ToString("yyyy-MM-01");
                            break;
                        case Code__DataType.Real:
                            dataKey = "Real";
                            break;
                    };
                    dataKey = "_Data_" + dataKey + "_WaterQualityTypeCode_" + properties.waterQualityTypeCode + "_" + properties.cantonCode + "_IsBelongCantonOthers_" + properties.IsBelongCantonOthers;
                    if (dataThis[dataKey] == undefined) {
                        this.getData({
                            dataTypeCode: properties.dataTypeCode
                            , dateTime: properties.dateTime
                            , callBack: function (data) {
                                var MonitorSiteList = [];
                                for (var j = 0; j < data.ListMonitor.length; j++) {
                                    if ((properties.cantonCode == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.cantonCode == data.ListMonitor[j].ParentCantonCode || properties.cantonCode == data.ListMonitor[j].MaxParentCantonCode || properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                        if (properties.waterQualityTypeCode == "" || properties.waterQualityTypeCode == data.ListMonitor[j].WaterQualityTypeCode) {
                                            MonitorSiteList.push(data.ListMonitor[j]);
                                        };
                                    }
                                    else if (properties.cantonCode == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                        if (properties.waterQualityTypeCode == "" || properties.waterQualityTypeCode == data.ListMonitor[j].WaterQualityTypeCode) {
                                            MonitorSiteList.push(data.ListMonitor[j]);
                                        };
                                    };
                                };
                                dataThis[dataKey] = MonitorSiteList;
                                if ($.isFunction(properties.callBack)) {
                                    properties.callBack(dataThis[dataKey]);
                                };
                            }
                        });
                    } else {
                        if ($.isFunction(properties.callBack)) {
                            properties.callBack(dataThis[dataKey]);
                        };
                    };
                    return dataThis[dataKey];
                }
                , getQualifiedMonitorSiteList: function (properties) {
                    //var settings = {
                    //    dataTypeCode: ""
                    //    , dateTime: new Date()
                    //    , cantonCode:
                    //    , qualifiedCode:""
                    //    , callBack: function (data) { }
                    //};
                    if (properties.cantonCode == undefined || properties.cantonCode == null) {
                        properties.cantonCode = "";
                    };
                    if (properties.IsBelongCantonOthers == undefined) {
                        properties.IsBelongCantonOthers = false;
                    };
                    if (properties.qualifiedCode == undefined || properties.qualifiedCode == null) {
                        properties.qualifiedCode = "";
                    };
                    var dataThis = this;
                    var dataKey = "";
                    switch (properties.dataTypeCode.toString()) {
                        case Code__DataType.Month:
                            dataKey = properties.dateTime.ToString("yyyy-MM-01");
                            break;
                        case Code__DataType.Real:
                            dataKey = "Real";
                            break;
                    };
                    dataKey = "_Data_" + dataKey + "_QualifiedCode_" + properties.qualifiedCode + "_" + properties.cantonCode + "_IsBelongCantonOthers_" + properties.IsBelongCantonOthers;
                    if (dataThis[dataKey] == undefined) {
                        this.getData({
                            dataTypeCode: properties.dataTypeCode
                            , dateTime: properties.dateTime
                            , callBack: function (data) {
                                var MonitorSiteList = [];
                                for (var j = 0; j < data.ListMonitor.length; j++) {
                                    if ((properties.cantonCode == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.cantonCode == data.ListMonitor[j].ParentCantonCode || properties.cantonCode == data.ListMonitor[j].MaxParentCantonCode || properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                        if (properties.qualifiedCode == "" || properties.qualifiedCode == data.ListMonitor[j].IsExcessive) {
                                            MonitorSiteList.push(data.ListMonitor[j]);
                                        };
                                    }
                                    else if (properties.cantonCode == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                        if (properties.qualifiedCode == "" || properties.qualifiedCode == data.ListMonitor[j].IsExcessive) {
                                            MonitorSiteList.push(data.ListMonitor[j]);
                                        };
                                    };
                                };
                                dataThis[dataKey] = MonitorSiteList;
                                if ($.isFunction(properties.callBack)) {
                                    properties.callBack(dataThis[dataKey]);
                                };
                            }
                        });
                    } else {
                        if ($.isFunction(properties.callBack)) {
                            properties.callBack(dataThis[dataKey]);
                        };
                    };
                    return dataThis[dataKey];
                }
                , getBussessCodeMonitorSiteList: function (properties) {
                    //var settings = {
                    //    dataTypeCode: ""
                    //    , dateTime: new Date()
                    //    , businessCode:""
                    //    , callBack: function (data) { }
                    //};

                    if (properties.businessCode == undefined || properties.businessCode == null) {
                        properties.businessCode = "";
                    };
                    var dataThis = this;
                    var dataKey = "";
                    switch (properties.dataTypeCode.toString()) {
                        case Code__DataType.Month:
                            dataKey = properties.dateTime.ToString("yyyy-MM-01");
                            break;
                        case Code__DataType.Real:
                            dataKey = "Real";
                            break;
                    };
                    dataKey = "_Data_" + dataKey + "_BussessCode_" + properties.businessCode;
                    if (dataThis[dataKey] == undefined) {
                        this.getData({
                            dataTypeCode: properties.dataTypeCode
                            , dateTime: properties.dateTime
                            , callBack: function (data) {
                                var MonitorSiteList = [];
                                for (var j = 0; j < data.ListMonitor.length; j++) {
                                    if (properties.businessCode == data.ListMonitor[j].BusinessCode) {
                                        MonitorSiteList.push(data.ListMonitor[j]);
                                    };
                                };
                                dataThis[dataKey] = MonitorSiteList;
                                if ($.isFunction(properties.callBack)) {
                                    properties.callBack(dataThis[dataKey]);
                                };
                            }
                        });
                    } else {
                        if ($.isFunction(properties.callBack)) {
                            properties.callBack(dataThis[dataKey]);
                        };
                    };
                    return dataThis[dataKey];
                }
                , getStatisticsMonitorSiteList: function (properties) {
                    //var settings = {
                    //    dataTypeCode: ""
                    //    ,dateTime: new Date()
                    //    ,selectCanton:""  
                    //    , callBack: function (data) { }
                    //};
                    if (properties.selectCanton == undefined || properties.selectCanton == null) {
                        properties.selectCanton = "";
                    };
                    if (properties.IsBelongCantonOthers == undefined) {
                        properties.IsBelongCantonOthers = false;
                    };
                    var dataThis = this;
                    var dataKey = "";
                    switch (properties.dataTypeCode.toString()) {
                        case Code__DataType.Month:
                            dataKey = properties.dateTime.ToString("yyyy-MM-01");
                            break;
                        case Code__DataType.Real:
                            dataKey = "Real";
                            break;
                    };

                    dataKey = "_Data_" + dataKey + "_StatisticsCode_" + properties.selectCanton + "_IsBelongCantonOthers_" + properties.IsBelongCantonOthers;
                    if (dataThis[dataKey] == undefined) {
                        this.getData({
                            dataTypeCode: properties.dataTypeCode
                            , dateTime: properties.dateTime
                            , callBack: function (data) {
                                var newdata = jQuery.extend(true, {}, data); //拷贝对象
                                newdata.EntityCount = newdata.ListMonitor.length;
                                //先加上其它的（如江苏省其它），QualitativeValue=0时再去掉
                                if (API.UserInfo.IsBelongManageCantonSame) {
                                    newdata.ListCanton.push({ Code: API.UserInfo.UserBelongCantonCode, IsBelongCantonOthers: true, Name: API.UserInfo.UserBelongCantonName + UserBelongCantonNameBehindWord, QualitativeValue: 0 });
                                };
                                for (var i = 0; i < newdata.ListMonitor.length; i++) {
                                    //是否达标 
                                    for (var j = 0; j < newdata.ListIsExcessive.length; j++) {
                                        if (newdata.ListMonitor[i].IsExcessive == newdata.ListIsExcessive[j].Code) {
                                            if ((properties.selectCanton == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.selectCanton == newdata.ListMonitor[i].ParentCantonCode || properties.selectCanton == newdata.ListMonitor[i].MaxParentCantonCode || properties.selectCanton == newdata.ListMonitor[i].CantonCode) {
                                                newdata.ListIsExcessive[j].QualitativeValue += 1;
                                            }
                                            else if (properties.selectCanton == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.selectCanton == newdata.ListMonitor[i].CantonCode) {
                                                newdata.ListIsExcessive[j].QualitativeValue++;
                                            };
                                        };
                                    };
                                    //类别
                                    for (var j = 0; j < newdata.ListWaterQualityType.length; j++) {
                                        if (newdata.ListMonitor[i].WaterQualityTypeCode == newdata.ListWaterQualityType[j].Code) {
                                            if ((properties.selectCanton == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.selectCanton == newdata.ListMonitor[i].ParentCantonCode || properties.selectCanton == newdata.ListMonitor[i].MaxParentCantonCode || properties.selectCanton == newdata.ListMonitor[i].CantonCode) {
                                                newdata.ListWaterQualityType[j].QualitativeValue += 1;
                                            }
                                            else if (properties.selectCanton == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.selectCanton == newdata.ListMonitor[i].CantonCode) {
                                                newdata.ListWaterQualityType[j].QualitativeValue++;
                                            };
                                        };
                                    };

                                    //厂区
                                    if (API.UserInfo.IsBelongManageCantonSame) {
                                        for (var j = 0; j < newdata.ListCanton.length; j++) {
                                            if (newdata.ListCanton[j].Code == "" || newdata.ListCanton[j].Code == newdata.ListMonitor[i].ParentCantonCode || newdata.ListCanton[j].Code == newdata.ListMonitor[i].MaxParentCantonCode || newdata.ListCanton[j].Code == newdata.ListMonitor[i].CantonCode) {
                                                if (API.UserInfo.UserBelongCantonCode != newdata.ListMonitor[i].CantonCode) {
                                                    if (j < newdata.ListCanton.length - 1) {
                                                        newdata.ListCanton[j].QualitativeValue += 1;
                                                    };
                                                }
                                                else {
                                                    newdata.ListCanton[newdata.ListCanton.length - 1].QualitativeValue++;
                                                };
                                            };
                                        };
                                    }
                                    else {
                                        for (var j = 0; j < newdata.ListCanton.length; j++) {
                                            if (newdata.ListCanton[j].Code == "" || newdata.ListCanton[j].Code == newdata.ListMonitor[i].ParentCantonCode || newdata.ListCanton[j].Code == newdata.ListMonitor[i].MaxParentCantonCode || newdata.ListCanton[j].Code == newdata.ListMonitor[i].CantonCode) {
                                                newdata.ListCanton[j].QualitativeValue += 1;
                                            };
                                        };
                                    };
                                };
                                if (newdata.ListCanton[newdata.ListCanton.length - 1].QualitativeValue == 0) {
                                    newdata.ListCanton.pop();
                                }
                                newdata.ListCanton = newdata.ListCanton.sort(ArrayDesc);
                                dataThis[dataKey] = newdata;
                                if ($.isFunction(properties.callBack)) {
                                    properties.callBack(dataThis[dataKey]);
                                };
                            }
                        });
                    } else {
                        if ($.isFunction(properties.callBack)) {
                            properties.callBack(dataThis[dataKey]);
                        };
                    };
                    return dataThis[dataKey];
                }
            }
        }
        ,
        Section: {
            Search__Section_MonitorSiteStatisticsInfo: {
                getData: function (properties) {
                    //var settings = {
                    //    dataTypeCode: ""
                    //    , dateTime: new Date()
                    //    , callBack: function (data) { }
                    //};
                    var dataThis = this;
                    var dataKey = "";
                    switch (properties.dataTypeCode.toString()) {
                        case Code__DataType.Month:
                            dataKey = properties.dateTime.ToString("yyyy-MM-01");
                            break;
                        case Code__DataType.Real:
                            dataKey = "Real";
                            break;
                    };
                    dataKey = "_Data_" + dataKey;
                    if (dataThis[dataKey] == undefined) {
                        var successFunction = function (ResultData) {
                            if (ResultData != null && ResultData.Status == 1) {
                                var NewEntity = ResultData.Data;
                                var listStateSection = [];
                                var listProvinceSection = [];
                                var listOthersSection = [];
                                if (ResultData.Data.ListMonitor.length > 0) {
                                    for (var i = 0; i < ResultData.Data.ListMonitor.length; i++) {
                                        if (ResultData.Data.ListMonitor[i].ControlType == "1")//国控
                                        {
                                            listStateSection.push(ResultData.Data.ListMonitor[i]);
                                        }
                                        else if (ResultData.Data.ListMonitor[i].ControlType == "2") {
                                            listProvinceSection.push(ResultData.Data.ListMonitor[i]);
                                        }
                                        else {
                                            listOthersSection.push(ResultData.Data.ListMonitor[i]);
                                        }
                                    }
                                }
                                NewEntity.listStateSection = listStateSection;
                                NewEntity.listProvinceSection = listProvinceSection;
                                NewEntity.listOthersSection = listOthersSection;
                                dataThis[dataKey] = NewEntity;
                                if ($.isFunction(properties.callBack)) {
                                    properties.callBack(dataThis[dataKey]);
                                };
                            };
                        };
                        if (properties.dateTime == undefined) {
                            properties.dateTime = null;
                        }
                        switch (window.Module.RequestTypeCode) {
                            case window.Module.Code_RequestType.jQuery:
                                $.ajax($.Page.GetAjaxSettings({
                                    ServiceTypeCode: "Water"
                                    , MethodName: "Search__Section_MonitorSiteStatisticsInfo"
                                    , data: jExtension.JsonToSubmitString({
                                        Ticket: $.page.ticket
                                        , ParameterData: {
                                            DataTypeCode: properties.dataTypeCode
                                            , DateTimeList: properties.dateTime == null ? null : [properties.dateTime.ToString("UTCDateTime")]
                                        }
                                    })
                                    , type: "post"
                                    , success: successFunction
                                }));

                                break;
                            case window.Module.Code_RequestType.Ext:
                                Ext.data.JsonP.request($.Page.GetJsonpSettings({
                                    params: {
                                        ServiceName: "Water",
                                        MethodName: 'Search__Section_MonitorSiteStatisticsInfo',
                                        ParameterDataJsonString: Ext.JSON.encode(
                                    {
                                        Ticket: $.page.ticket
                                        , ParameterData: {
                                            DataTypeCode: properties.dataTypeCode
                                            , DateTimeList: properties.dateTimeList
                                        }
                                    })
                                    }, success: successFunction
                                    , failure: window.Module.Water.Section.Search__Section_MonitorSiteStatisticsInfo.getDataFailure
                                }));
                                break;
                        };
                    } else {
                        if ($.isFunction(properties.callBack)) {
                            properties.callBack(dataThis[dataKey]);
                        };
                    };
                    return dataThis[dataKey];
                }
                , getDataFailure: function () {

                }
                , getCantonMonitorSiteList: function (properties) {
                    //var settings = {
                    //    dataTypeCode: ""
                    //    , dateTime: new Date()
                    //    , cantonCode:""
                    //    , callBack: function (data) { }
                    //};
                    if (properties.cantonCode == undefined || properties.cantonCode == null) {
                        properties.cantonCode = "";
                    };
                    if (properties.IsBelongCantonOthers == undefined) {
                        properties.IsBelongCantonOthers = false;
                    };
                    var dataThis = this;
                    var dataKey = "";
                    switch (properties.dataTypeCode.toString()) {
                        case Code__DataType.Month:
                            dataKey = properties.dateTime.ToString("yyyy-MM-01");
                            break;
                        case Code__DataType.Real:
                            dataKey = "Real";
                            break;
                    };
                    if (properties.MonitorSiteTypeCodeArray == undefined) {
                        properties.MonitorSiteTypeCodeArray = ["Statecontrolledsections", "Provincescontrolledsections"];
                    }
                    dataKey = "_Data_" + dataKey + "_CantonCode_" + properties.cantonCode + "_MonitorSiteType_" + properties.MonitorSiteTypeCodeArray.join(',') + "_MonitorSiteCode_" + properties.MonitorSiteCode + "_IsBelongCantonOthers_" + properties.IsBelongCantonOthers;
                    if (dataThis[dataKey] == undefined) {   //       1==1
                        this.getData({
                            dataTypeCode: properties.dataTypeCode
                            , dateTime: properties.dateTime
                            , callBack: function (data) {
                                var MonitorSiteList = {};
                                var listStateSection = [];
                                var listProvinceSection = [];
                                //var listOthersSection = [];
                                for (var j = 0; j < data.ListMonitor.length; j++) {
                                    if (properties.MonitorSiteCode == undefined) {
                                        if ((properties.cantonCode == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.cantonCode == data.ListMonitor[j].ParentCantonCode || properties.cantonCode == data.ListMonitor[j].MaxParentCantonCode || properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                            if (data.ListMonitor[j].ControlType == Code_SectionCoverageType.Statecontrolledsections && properties.MonitorSiteTypeCodeArray.Contains("Statecontrolledsections"))//国控
                                            {
                                                listStateSection.push(data.ListMonitor[j]);
                                            }
                                            else if (data.ListMonitor[j].ControlType == Code_SectionCoverageType.Provincescontrolledsections && properties.MonitorSiteTypeCodeArray.Contains("Provincescontrolledsections")) {
                                                listProvinceSection.push(data.ListMonitor[j]);
                                            };
                                        }
                                        else if (properties.cantonCode == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                            if (data.ListMonitor[j].ControlType == Code_SectionCoverageType.Statecontrolledsections && properties.MonitorSiteTypeCodeArray.Contains("Statecontrolledsections"))//国控
                                            {
                                                listStateSection.push(data.ListMonitor[j]);
                                            }
                                            else if (data.ListMonitor[j].ControlType == Code_SectionCoverageType.Provincescontrolledsections && properties.MonitorSiteTypeCodeArray.Contains("Provincescontrolledsections")) {
                                                listProvinceSection.push(data.ListMonitor[j]);
                                            };
                                        };
                                    }
                                    else {
                                        if (properties.MonitorSiteCode == data.ListMonitor[j].MonitorSiteCode) {
                                            if (data.ListMonitor[j].ControlType == Code_SectionCoverageType.Statecontrolledsections && properties.MonitorSiteTypeCodeArray.Contains("Statecontrolledsections"))//国控
                                            {
                                                listStateSection.push(data.ListMonitor[j]);
                                            }
                                            else if (data.ListMonitor[j].ControlType == Code_SectionCoverageType.Provincescontrolledsections && properties.MonitorSiteTypeCodeArray.Contains("Provincescontrolledsections")) {
                                                listProvinceSection.push(data.ListMonitor[j]);
                                            };
                                        };
                                    };
                                };
                                MonitorSiteList.listStateSection = listStateSection;
                                MonitorSiteList.listProvinceSection = listProvinceSection;
                                //MonitorSiteList.listOthersSection = listOthersSection;
                                dataThis[dataKey] = MonitorSiteList;
                                if ($.isFunction(properties.callBack)) {
                                    properties.callBack(dataThis[dataKey]);
                                };
                            }
                        });

                    } else {
                        if ($.isFunction(properties.callBack)) {
                            properties.callBack(dataThis[dataKey]);
                        };
                    };

                    return dataThis[dataKey];
                }
                , getWaterQualityTypeMonitorSiteList: function (properties) {
                    //var settings = {
                    //    dataTypeCode: ""
                    //    , dateTime: new Date()
                    //    , cantonCode:
                    //    , waterQualityTypeCode:""
                    //    , callBack: function (data) { }
                    //};
                    if (properties.cantonCode == undefined || properties.cantonCode == null) {
                        properties.cantonCode = "";
                    };
                    if (properties.waterQualityTypeCode == undefined || properties.waterQualityTypeCode == null) {
                        properties.waterQualityTypeCode = "";
                    };
                    if (properties.IsBelongCantonOthers == undefined) {
                        properties.IsBelongCantonOthers = false;
                    };
                    var dataThis = this;
                    var dataKey = "";
                    switch (properties.dataTypeCode.toString()) {
                        case Code__DataType.Month:
                            dataKey = properties.dateTime.ToString("yyyy-MM-01");
                            break;
                        case Code__DataType.Real:
                            dataKey = "Real";
                            break;
                    };

                    if (properties.MonitorSiteTypeCodeArray == undefined) {
                        properties.MonitorSiteTypeCodeArray = ["Statecontrolledsections", "Provincescontrolledsections"];
                    }
                    dataKey = "_Data_" + dataKey + "_WaterQualityTypeCode_" + properties.waterQualityTypeCode + "_" + properties.cantonCode + "_MonitorSiteType_" + properties.MonitorSiteTypeCodeArray.join(",") + "IsBelongCantonOthers" + properties.IsBelongCantonOthers;
                    if (dataThis[dataKey] == undefined) {
                        this.getData({
                            dataTypeCode: properties.dataTypeCode
                            , dateTime: properties.dateTime
                            , callBack: function (data) {
                                var MonitorSiteList = {};
                                var listStateSection = [];
                                var listProvinceSection = [];
                                for (var j = 0; j < data.ListMonitor.length; j++) {
                                    if ((properties.cantonCode == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.cantonCode == data.ListMonitor[j].ParentCantonCode || properties.cantonCode == data.ListMonitor[j].MaxParentCantonCode || properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                        if (properties.waterQualityTypeCode == "" || properties.waterQualityTypeCode == data.ListMonitor[j].WaterQualityTypeCode) {
                                            if (data.ListMonitor[j].ControlType == "1" && properties.MonitorSiteTypeCodeArray.Contains("Statecontrolledsections"))//国控
                                            {
                                                listStateSection.push(data.ListMonitor[j]);
                                            }
                                            else if (data.ListMonitor[j].ControlType == "2" && properties.MonitorSiteTypeCodeArray.Contains("Provincescontrolledsections")) {
                                                listProvinceSection.push(data.ListMonitor[j]);
                                            };
                                        };
                                    }
                                    else if (properties.cantonCode == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                        if (properties.waterQualityTypeCode == "" || properties.waterQualityTypeCode == data.ListMonitor[j].WaterQualityTypeCode) {
                                            if (data.ListMonitor[j].ControlType == "1" && properties.MonitorSiteTypeCodeArray.Contains("Statecontrolledsections"))//国控
                                            {
                                                listStateSection.push(data.ListMonitor[j]);
                                            }
                                            else if (data.ListMonitor[j].ControlType == "2" && properties.MonitorSiteTypeCodeArray.Contains("Provincescontrolledsections")) {
                                                listProvinceSection.push(data.ListMonitor[j]);
                                            };
                                        };
                                    };
                                };
                                MonitorSiteList.listStateSection = listStateSection;
                                MonitorSiteList.listProvinceSection = listProvinceSection;
                                dataThis[dataKey] = MonitorSiteList;
                                if ($.isFunction(properties.callBack)) {
                                    properties.callBack(dataThis[dataKey]);
                                };
                            }
                        });
                    } else {
                        if ($.isFunction(properties.callBack)) {
                            properties.callBack(dataThis[dataKey]);
                        };
                    };
                    return dataThis[dataKey];
                }
                , getQualifiedMonitorSiteList: function (properties) {
                    //var settings = {
                    //    dataTypeCode: ""
                    //    , dateTime: new Date()
                    //    , cantonCode:
                    //    , qualifiedCode:""
                    //    , callBack: function (data) { }
                    //};
                    if (properties.cantonCode == undefined || properties.cantonCode == null) {
                        properties.cantonCode = "";
                    };
                    if (properties.qualifiedCode == undefined || properties.qualifiedCode == null) {
                        properties.qualifiedCode = "";
                    };
                    if (properties.IsBelongCantonOthers == undefined) {
                        properties.IsBelongCantonOthers = false;
                    };
                    var dataThis = this;
                    var dataKey = "";
                    switch (properties.dataTypeCode.toString()) {
                        case Code__DataType.Month:
                            dataKey = properties.dateTime.ToString("yyyy-MM-01");
                            break;
                        case Code__DataType.Real:
                            dataKey = "Real";
                            break;
                    };
                    if (properties.MonitorSiteTypeCodeArray == undefined) {
                        properties.MonitorSiteTypeCodeArray = ["Statecontrolledsections", "Provincescontrolledsections"];
                    }
                    dataKey = "_Data_" + dataKey + "_QualifiedCode_" + properties.qualifiedCode + "_" + properties.cantonCode + "_MonitorSiteType_" + properties.MonitorSiteTypeCodeArray.join(",") + "_IsBelongCantonOthers_" + properties.IsBelongCantonOthers;
                    if (dataThis[dataKey] == undefined) {
                        this.getData({
                            dataTypeCode: properties.dataTypeCode
                            , dateTime: properties.dateTime
                            , callBack: function (data) {
                                var MonitorSiteList = {};
                                var listStateSection = [];
                                var listProvinceSection = [];
                                for (var j = 0; j < data.ListMonitor.length; j++) {
                                    if ((properties.cantonCode == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.cantonCode == data.ListMonitor[j].ParentCantonCode || properties.cantonCode == data.ListMonitor[j].MaxParentCantonCode || properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                        if (properties.qualifiedCode == "" || properties.qualifiedCode == data.ListMonitor[j].IsExcessive) {
                                            if (data.ListMonitor[j].ControlType == "1" && properties.MonitorSiteTypeCodeArray.Contains("Statecontrolledsections"))//国控
                                            {
                                                listStateSection.push(data.ListMonitor[j]);
                                            }
                                            else if (data.ListMonitor[j].ControlType == "2" && properties.MonitorSiteTypeCodeArray.Contains("Provincescontrolledsections")) {
                                                listProvinceSection.push(data.ListMonitor[j]);
                                            }
                                        };
                                    }
                                    else if (properties.cantonCode == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                        if (properties.qualifiedCode == "" || properties.qualifiedCode == data.ListMonitor[j].IsExcessive) {
                                            if (data.ListMonitor[j].ControlType == "1" && properties.MonitorSiteTypeCodeArray.Contains("Statecontrolledsections"))//国控
                                            {
                                                listStateSection.push(data.ListMonitor[j]);
                                            }
                                            else if (data.ListMonitor[j].ControlType == "2" && properties.MonitorSiteTypeCodeArray.Contains("Provincescontrolledsections")) {
                                                listProvinceSection.push(data.ListMonitor[j]);
                                            }
                                        };
                                    };
                                };
                                MonitorSiteList.listStateSection = listStateSection;
                                MonitorSiteList.listProvinceSection = listProvinceSection;
                                dataThis[dataKey] = MonitorSiteList;
                                if ($.isFunction(properties.callBack)) {
                                    properties.callBack(dataThis[dataKey]);
                                };
                            }
                        });
                    } else {
                        if ($.isFunction(properties.callBack)) {
                            properties.callBack(dataThis[dataKey]);
                        };
                    };
                    return dataThis[dataKey];
                }
                , getMonitorSiteCodeList: function (properties) {
                    //var settings = {
                    //    dataTypeCode: ""
                    //    , dateTime: new Date()
                    //    , cantonCode:
                    //    , qualifiedCode:""
                    //    , callBack: function (data) { }
                    //};
                    if (properties.cantonCode == undefined || properties.cantonCode == null) {
                        properties.cantonCode = "";
                    };
                    if (properties.MonitorSiteCode == undefined || properties.MonitorSiteCode == null) {
                        properties.MonitorSiteCode = "";
                    };
                    var dataThis = this;
                    var dataKey = "";
                    switch (properties.dataTypeCode.toString()) {
                        case Code__DataType.Month:
                            dataKey = properties.dateTime.ToString("yyyy-MM-01");
                            break;
                        case Code__DataType.Real:
                            dataKey = "Real";
                            break;
                    };
                    if (properties.MonitorSiteTypeCodeArray == undefined) {
                        properties.MonitorSiteTypeCodeArray = ["Statecontrolledsections", "Provincescontrolledsections"];
                    }
                    dataKey = "_Data_" + dataKey + "_MonitorSiteCode_" + properties.MonitorSiteCode + "_" + properties.cantonCode + "_MonitorSiteType_" + properties.MonitorSiteTypeCodeArray.join(",");
                    if (dataThis[dataKey] == undefined) {
                        this.getData({
                            dataTypeCode: properties.dataTypeCode
                            , dateTime: properties.dateTime
                            , callBack: function (data) {
                                var MonitorSiteList = {};
                                var listStateSection = [];
                                var listProvinceSection = [];
                                for (var j = 0; j < data.ListMonitor.length; j++) {
                                    if (properties.cantonCode == "" || properties.cantonCode == data.ListMonitor[j].ParentCantonCode || properties.cantonCode == data.ListMonitor[j].MaxParentCantonCode || properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                        if (properties.MonitorSiteCode == data.ListMonitor[j].MonitorSiteCode) {
                                            //MonitorSiteList.push(data.ListMonitor[j]);
                                            if (data.ListMonitor[j].ControlType == "1" && properties.MonitorSiteTypeCodeArray.Contains("Statecontrolledsections"))//国控
                                            {
                                                listStateSection.push(data.ListMonitor[j]);
                                            }
                                            else if (data.ListMonitor[j].ControlType == "2" && properties.MonitorSiteTypeCodeArray.Contains("Provincescontrolledsections")) {
                                                listProvinceSection.push(data.ListMonitor[j]);
                                            }
                                        };
                                    };
                                };
                                MonitorSiteList.listStateSection = listStateSection;
                                MonitorSiteList.listProvinceSection = listProvinceSection;
                                dataThis[dataKey] = MonitorSiteList;
                                if ($.isFunction(properties.callBack)) {
                                    properties.callBack(dataThis[dataKey]);
                                };
                            }
                        });
                    } else {
                        if ($.isFunction(properties.callBack)) {
                            properties.callBack(dataThis[dataKey]);
                        };
                    };
                    return dataThis[dataKey];
                }
                , getBussessCodeMonitorSiteList: function (properties) {
                    //var settings = {
                    //    dataTypeCode: ""
                    //    , dateTime: new Date()
                    //    , businessCode:""
                    //    , callBack: function (data) { }
                    //};

                    if (properties.businessCode == undefined || properties.businessCode == null) {
                        properties.businessCode = "";
                    };
                    var dataThis = this;
                    var dataKey = "";
                    switch (properties.dataTypeCode.toString()) {
                        case Code__DataType.Month:
                            dataKey = properties.dateTime.ToString("yyyy-MM-01");
                            break;
                        case Code__DataType.Real:
                            dataKey = "Real";
                            break;
                    };
                    dataKey = "_Data_" + dataKey + "_BussessCode_" + properties.businessCode;
                    if (dataThis[dataKey] == undefined) {
                        this.getData({
                            dataTypeCode: properties.dataTypeCode
                            , dateTime: properties.dateTime
                            , callBack: function (data) {
                                var MonitorSiteList = [];
                                for (var j = 0; j < data.ListMonitor.length; j++) {
                                    if (properties.businessCode == data.ListMonitor[j].BusinessCode) {
                                        MonitorSiteList.push(data.ListMonitor[j]);
                                    };
                                };
                                dataThis[dataKey] = MonitorSiteList;
                                if ($.isFunction(properties.callBack)) {
                                    properties.callBack(dataThis[dataKey]);
                                };
                            }
                        });
                    } else {
                        if ($.isFunction(properties.callBack)) {
                            properties.callBack(dataThis[dataKey]);
                        };
                    };
                    return dataThis[dataKey];
                }
                , getStatisticsMonitorSiteList: function (properties) {
                    //var settings = {
                    //    dataTypeCode: ""
                    //    ,dateTime: new Date()
                    //    ,selectCanton:""  
                    //    , callBack: function (data) { }
                    //};
                    if (properties.selectCanton == undefined || properties.selectCanton == null) {
                        properties.selectCanton = "";
                    };
                    if (properties.MonitorSiteTypeCodeArray == undefined || properties.MonitorSiteTypeCodeArray == null) {
                        properties.MonitorSiteTypeCodeArray = [];
                    };
                    if (properties.IsBelongCantonOthers == undefined) {
                        properties.IsBelongCantonOthers = false;
                    };
                    var dataThis = this;
                    var dataKey = "";
                    switch (properties.dataTypeCode.toString()) {
                        case Code__DataType.Month:
                            dataKey = properties.dateTime.ToString("yyyy-MM-01");
                            break;
                        case Code__DataType.Real:
                            dataKey = "Real";
                            break;
                    };
                    dataKey = "_Data_" + dataKey + "_StatisticsCode_" + properties.selectCanton + "_Control_" + properties.MonitorSiteTypeCodeArray.join(',') + "_IsBelongCantonOthers_" + properties.IsBelongCantonOthers;
                    if (dataThis[dataKey] == undefined) {//
                        this.getData({
                            dataTypeCode: properties.dataTypeCode
                            , dateTime: properties.dateTime
                            , callBack: function (data) {
                                var newdata = jQuery.extend(true, {}, data); //拷贝对象
                                var ListAllEntityCount = 0;        //所有有数据企业个数
                                //先加上其它的（如江苏省其它），QualitativeValue=0时再去掉     
                                if (API.UserInfo.IsBelongManageCantonSame) {
                                    newdata.ListCanton.push({ Code: API.UserInfo.UserBelongCantonCode, IsBelongCantonOthers: true, Name: API.UserInfo.UserBelongCantonName + UserBelongCantonNameBehindWord, QualitativeValue: 0 });
                                };
                                if (properties.MonitorSiteTypeCodeArray.Contains("Statecontrolledsections")) {
                                    ListAllEntityCount += newdata.listStateSection.length;
                                    for (var i = 0; i < newdata.listStateSection.length; i++) {
                                        //是否达标 
                                        for (var j = 0; j < newdata.ListIsExcessive.length; j++) {
                                            if (newdata.listStateSection[i].IsExcessive == newdata.ListIsExcessive[j].Code) {
                                                if ((properties.selectCanton == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.selectCanton == newdata.listStateSection[i].ParentCantonCode || properties.selectCanton == newdata.listStateSection[i].MaxParentCantonCode || properties.selectCanton == newdata.listStateSection[i].CantonCode) {
                                                    newdata.ListIsExcessive[j].QualitativeValue++;
                                                }
                                                else if (properties.selectCanton == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.selectCanton == newdata.listStateSection[i].CantonCode) {
                                                    newdata.ListIsExcessive[j].QualitativeValue++;
                                                };
                                            };

                                        };
                                        //类别
                                        for (var j = 0; j < newdata.ListWaterQualityType.length; j++) {
                                            if (newdata.listStateSection[i].WaterQualityTypeCode == newdata.ListWaterQualityType[j].Code) {
                                                if ((properties.selectCanton == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.selectCanton == newdata.listStateSection[i].ParentCantonCode || properties.selectCanton == newdata.listStateSection[i].MaxParentCantonCode || properties.selectCanton == newdata.listStateSection[i].CantonCode) {
                                                    newdata.ListWaterQualityType[j].QualitativeValue++;
                                                }
                                                else if (properties.selectCanton == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.selectCanton == newdata.listStateSection[i].CantonCode) {
                                                    newdata.ListWaterQualityType[j].QualitativeValue++;
                                                };
                                            };
                                        };
                                        //厂区                                                
                                        if (API.UserInfo.IsBelongManageCantonSame) {
                                            for (var j = 0; j < newdata.ListCanton.length; j++) {
                                                if (newdata.ListCanton[j].Code == newdata.listStateSection[i].ParentCantonCode || newdata.ListCanton[j].Code == newdata.listStateSection[i].MaxParentCantonCode || newdata.ListCanton[j].Code == newdata.listStateSection[i].CantonCode) {
                                                    if (API.UserInfo.UserBelongCantonCode != newdata.listStateSection[i].CantonCode) {
                                                        if (j < newdata.ListCanton.length - 1) {
                                                            newdata.ListCanton[j].QualitativeValue += 1;
                                                        };
                                                    }
                                                    else {
                                                        newdata.ListCanton[newdata.ListCanton.length - 1].QualitativeValue++;
                                                    };
                                                };
                                            };
                                        }
                                        else {
                                            for (var j = 0; j < newdata.ListCanton.length; j++) {
                                                if (newdata.ListCanton[j].Code == "" || newdata.ListCanton[j].Code == newdata.listStateSection[i].ParentCantonCode || newdata.ListCanton[j].Code == newdata.listStateSection[i].MaxParentCantonCode || newdata.ListCanton[j].Code == newdata.listStateSection[i].CantonCode) {
                                                    newdata.ListCanton[j].QualitativeValue += 1;
                                                };
                                            };
                                        };
                                    };
                                };
                                if (properties.MonitorSiteTypeCodeArray.Contains("Provincescontrolledsections")) {
                                    ListAllEntityCount += newdata.listProvinceSection.length;
                                    for (var i = 0; i < newdata.listProvinceSection.length; i++) {
                                        //是否达标 
                                        for (var j = 0; j < newdata.ListIsExcessive.length; j++) {
                                            if (newdata.listProvinceSection[i].IsExcessive == newdata.ListIsExcessive[j].Code) {
                                                if ((properties.selectCanton == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.selectCanton == newdata.listProvinceSection[i].ParentCantonCode || properties.selectCanton == newdata.listProvinceSection[i].MaxParentCantonCode || properties.selectCanton == newdata.listProvinceSection[i].CantonCode) {
                                                    newdata.ListIsExcessive[j].QualitativeValue++;
                                                }
                                                else if (properties.selectCanton == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.selectCanton == newdata.listProvinceSection[i].CantonCode) {
                                                    newdata.ListIsExcessive[j].QualitativeValue++;
                                                };
                                            };
                                        };
                                        //类别
                                        for (var j = 0; j < newdata.ListWaterQualityType.length; j++) {
                                            if (newdata.listProvinceSection[i].WaterQualityTypeCode == newdata.ListWaterQualityType[j].Code) {
                                                if ((properties.selectCanton == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.selectCanton == newdata.listProvinceSection[i].ParentCantonCode || properties.selectCanton == newdata.listProvinceSection[i].MaxParentCantonCode || properties.selectCanton == newdata.listProvinceSection[i].CantonCode) {
                                                    newdata.ListWaterQualityType[j].QualitativeValue++;
                                                }
                                                else if (properties.selectCanton == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.selectCanton == newdata.listProvinceSection[i].CantonCode) {
                                                    newdata.ListWaterQualityType[j].QualitativeValue++;
                                                };
                                            };
                                        };
                                        //厂区
                                        if (API.UserInfo.IsBelongManageCantonSame) {
                                            for (var j = 0; j < newdata.ListCanton.length; j++) {
                                                if (newdata.ListCanton[j].Code == newdata.listProvinceSection[i].ParentCantonCode || newdata.ListCanton[j].Code == newdata.listProvinceSection[i].MaxParentCantonCode || newdata.ListCanton[j].Code == newdata.listProvinceSection[i].CantonCode && API.UserInfo.UserBelongCantonCode != newdata.listProvinceSection[i].CantonCode) {
                                                    if (API.UserInfo.UserBelongCantonCode == newdata.listProvinceSection[i].CantonCode) {
                                                        newdata.ListCanton[newdata.ListCanton.length - 1].QualitativeValue++;
                                                    }
                                                    else {
                                                        if (j < newdata.ListCanton.length - 1) {
                                                            newdata.ListCanton[j].QualitativeValue += 1;
                                                        };
                                                    };
                                                };
                                            };
                                        }
                                        else {
                                            for (var j = 0; j < newdata.ListCanton.length; j++) {
                                                if (newdata.ListCanton[j].Code == "" || newdata.ListCanton[j].Code == newdata.listProvinceSection[i].ParentCantonCode || newdata.ListCanton[j].Code == newdata.listProvinceSection[i].MaxParentCantonCode || newdata.ListCanton[j].Code == newdata.listProvinceSection[i].CantonCode) {
                                                    newdata.ListCanton[j].QualitativeValue += 1;
                                                };
                                            };
                                        };
                                    };
                                };
                                if (properties.MonitorSiteTypeCodeArray.Contains("Othersections")) {
                                    ListAllEntityCount += newdata.listOthersSection.length;
                                    for (var i = 0; i < newdata.listOthersSection.length; i++) {
                                        //是否达标 
                                        for (var j = 0; j < newdata.ListIsExcessive.length; j++) {
                                            if (newdata.listOthersSection[i].IsExcessive == newdata.ListIsExcessive[j].Code) {
                                                if ((properties.selectCanton == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.selectCanton == newdata.listOthersSection[i].ParentCantonCode || properties.selectCanton == newdata.listOthersSection[i].MaxParentCantonCode || properties.selectCanton == newdata.listOthersSection[i].CantonCode) {
                                                    newdata.ListIsExcessive[j].QualitativeValue++;
                                                }
                                                else if (properties.selectCanton == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.selectCanton == newdata.listOthersSection[i].CantonCode) {
                                                    newdata.ListIsExcessive[j].QualitativeValue++;
                                                };
                                            };
                                        };
                                        //类别
                                        for (var j = 0; j < newdata.ListWaterQualityType.length; j++) {
                                            if (newdata.listOthersSection[i].WaterQualityTypeCode == newdata.ListWaterQualityType[j].Code) {
                                                if ((properties.selectCanton == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.selectCanton == newdata.listOthersSection[i].ParentCantonCode || properties.selectCanton == newdata.listOthersSection[i].MaxParentCantonCode || properties.selectCanton == newdata.listOthersSection[i].CantonCode) {
                                                    newdata.ListWaterQualityType[j].QualitativeValue++;
                                                }
                                                else if (properties.selectCanton == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.selectCanton == newdata.listOthersSection[i].CantonCode) {
                                                    newdata.ListWaterQualityType[j].QualitativeValue++;
                                                };
                                            };
                                        };
                                        //厂区
                                        if (API.UserInfo.IsBelongManageCantonSame) {
                                            for (var j = 0; j < newdata.ListCanton.length; j++) {
                                                if (newdata.ListCanton[j].Code == newdata.listOthersSection[i].ParentCantonCode || newdata.ListCanton[j].Code == newdata.listOthersSection[i].MaxParentCantonCode || newdata.ListCanton[j].Code == newdata.listOthersSection[i].CantonCode && API.UserInfo.UserBelongCantonCode != newdata.listOthersSection[i].CantonCode) {
                                                    if (API.UserInfo.UserBelongCantonCode == newdata.listOthersSection[i].CantonCode) {
                                                        newdata.ListCanton[newdata.ListCanton.length - 1].QualitativeValue++;
                                                    }
                                                    else {
                                                        if (j < newdata.ListCanton.length - 1) {
                                                            newdata.ListCanton[j].QualitativeValue += 1;
                                                        };
                                                    };
                                                };
                                            };
                                        }
                                        else {
                                            for (var j = 0; j < newdata.ListCanton.length; j++) {
                                                if (newdata.ListCanton[j].Code == "" || newdata.ListCanton[j].Code == newdata.listOthersSection[i].ParentCantonCode || newdata.ListCanton[j].Code == newdata.listOthersSection[i].MaxParentCantonCode || newdata.ListCanton[j].Code == newdata.listOthersSection[i].CantonCode) {
                                                    newdata.ListCanton[j].QualitativeValue += 1;
                                                };
                                            };
                                        };
                                    };
                                };
                                //算出来的其它数据为0，则去掉其它
                                if (newdata.ListCanton[newdata.ListCanton.length - 1].QualitativeValue == 0) {
                                    newdata.ListCanton.pop();
                                };
                                newdata.ListCanton = newdata.ListCanton.sort(ArrayDesc);
                                newdata.EntityCount = ListAllEntityCount;
                                dataThis[dataKey] = newdata;
                                if ($.isFunction(properties.callBack)) {
                                    properties.callBack(dataThis[dataKey]);
                                };
                            }
                        });
                    } else {
                        if ($.isFunction(properties.callBack)) {
                            properties.callBack(dataThis[dataKey]);
                        };
                    };
                    return dataThis[dataKey];
                }
            }
        }
    }
    , Air: {
        Search__AirSite_MonitorSiteStatisticsInfo: {
            getData: function (properties) {
                //var settings = {
                //    dataTypeCode: ""
                //    , dateTime: new Date()
                //    , callBack: function (data) { }
                //};
                var dataThis = this;
                var dataKey = "";
                switch (properties.dataTypeCode.toString()) {
                    case Code__DataType.Month:
                        dataKey = properties.dateTime.ToString("yyyy-MM-01");
                        break;
                    case Code__DataType.Hour:
                        dataKey = "Hour";
                        break;
                };
                dataKey = "_Data_" + dataKey;
                if (dataThis[dataKey] == undefined) {
                    var successFunction = function (ResultData) {
                        if (ResultData != null && ResultData.Status == 1) {
                            dataThis[dataKey] = ResultData.Data;
                            if ($.isFunction(properties.callBack)) {
                                properties.callBack(dataThis[dataKey]);
                            };
                        };
                    };
                    switch (window.Module.RequestTypeCode) {
                        case window.Module.Code_RequestType.jQuery:
                            $.ajax($.Page.GetAjaxSettings({
                                ServiceTypeCode: "Air"
                                    , MethodName: "Search__AirSite_MonitorSiteStatisticsInfo"
                                    , data: jExtension.JsonToSubmitString({
                                        Ticket: $.page.ticket
                                        , ParameterData: {
                                            DataTypeCode: properties.dataTypeCode
                                            , DateTimeList: properties.dateTime == null ? null : [properties.dateTime.ToString("UTCDateTime")]
                                        }
                                    })
                                    , type: "post"
                                    , success: successFunction
                            }));
                            break;
                        case window.Module.Code_RequestType.Ext:
                            Ext.data.JsonP.request($.Page.GetJsonpSettings({
                                params: {
                                    ServiceName: "Air",
                                    MethodName: 'Search__AirSite_MonitorSiteStatisticsInfo',
                                    ParameterDataJsonString: Ext.JSON.encode(
                                    {
                                        Ticket: $.page.ticket
                                        , ParameterData: {
                                            DataTypeCode: properties.dataTypeCode
                                            , DateTimeList: properties.dateTimeList
                                        }
                                    })
                                }, success: successFunction
                                    , failure: window.Module.Air.Search__AirSite_MonitorSiteStatisticsInfo.getDataFailure
                            }));
                            break;
                    };
                } else {
                    if ($.isFunction(properties.callBack)) {
                        properties.callBack(dataThis[dataKey]);
                    };
                };
                return dataThis[dataKey];
            }
                , getDataFailure: function () {

                }
                , getCantonMonitorSiteList: function (properties) {
                    //var settings = {
                    //    dataTypeCode: ""
                    //    , dateTime: new Date()
                    //    , cantonCode:""
                    //    , callBack: function (data) { }
                    //};
                    if (properties.cantonCode == undefined || properties.cantonCode == null) {
                        properties.cantonCode = "";
                    };
                    if (properties.IsBelongCantonOthers == undefined) {
                        properties.IsBelongCantonOthers = false;
                    };
                    var dataThis = this;
                    var dataKey = "";
                    switch (properties.dataTypeCode.toString()) {
                        case Code__DataType.Month:
                            dataKey = properties.dateTime.ToString("yyyy-MM-01");
                            break;
                        case Code__DataType.Hour:
                            dataKey = "Hour";
                            break;
                    };
                    dataKey = "_Data_" + dataKey + "_CantonCode_" + properties.cantonCode + "_IsBelongCantonOthers_" + properties.IsBelongCantonOthers;
                    if (dataThis[dataKey] == undefined) {
                        this.getData({
                            dataTypeCode: properties.dataTypeCode
                            , dateTime: properties.dateTime
                            , callBack: function (data) {
                                var MonitorSiteList = [];
                                for (var j = 0; j < data.ListMonitor.length; j++) {
                                    if ((properties.cantonCode == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.cantonCode == data.ListMonitor[j].ParentCantonCode || properties.cantonCode == data.ListMonitor[j].MaxParentCantonCode || properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                        MonitorSiteList.push(data.ListMonitor[j]);
                                    }
                                    else if (properties.cantonCode == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                        MonitorSiteList.push(data.ListMonitor[j]);
                                    };
                                };
                                dataThis[dataKey] = MonitorSiteList;
                                if ($.isFunction(properties.callBack)) {
                                    properties.callBack(dataThis[dataKey]);
                                };
                            }
                        });
                    } else {
                        if ($.isFunction(properties.callBack)) {
                            properties.callBack(dataThis[dataKey]);
                        };
                    };
                    return dataThis[dataKey];
                }
                , getAirLevelMonitorSiteList: function (properties) {
                    //var settings = {
                    //    dataTypeCode: ""
                    //    , dateTime: new Date()
                    //    , cantonCode:
                    //    , AirLevelCode:""
                    //    , callBack: function (data) { }
                    //};
                    if (properties.cantonCode == undefined || properties.cantonCode == null) {
                        properties.cantonCode = "";
                    };
                    if (properties.AirLevelCode == undefined || properties.AirLevelCode == null) {
                        properties.AirLevelCode = "";
                    };
                    if (properties.IsBelongCantonOthers == undefined) {
                        properties.IsBelongCantonOthers = false;
                    };
                    var dataThis = this;
                    var dataKey = "";
                    switch (properties.dataTypeCode.toString()) {
                        case Code__DataType.Month:
                            dataKey = properties.dateTime.ToString("yyyy-MM-01");
                            break;
                        case Code__DataType.Hour:
                            dataKey = "Hour";
                            break;
                    };
                    dataKey = "_Data_" + dataKey + "_AirLevelCode_" + properties.AirLevelCode + "_" + properties.cantonCode + "_IsBelongCantonOthers_" + properties.IsBelongCantonOthers;
                    if (dataThis[dataKey] == undefined) {
                        this.getData({
                            dataTypeCode: properties.dataTypeCode
                            , dateTime: properties.dateTime
                            , callBack: function (data) {
                                var MonitorSiteList = [];
                                for (var j = 0; j < data.ListMonitor.length; j++) {
                                    if ((properties.cantonCode == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.cantonCode == data.ListMonitor[j].ParentCantonCode || properties.cantonCode == data.ListMonitor[j].MaxParentCantonCode || properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                        if (properties.AirLevelCode == "" || properties.AirLevelCode == data.ListMonitor[j].AirLevelCode) {
                                            MonitorSiteList.push(data.ListMonitor[j]);
                                        };
                                    }
                                    else if (properties.cantonCode == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                        if (properties.AirLevelCode == "" || properties.AirLevelCode == data.ListMonitor[j].AirLevelCode) {
                                            MonitorSiteList.push(data.ListMonitor[j]);
                                        };
                                    };
                                };
                                dataThis[dataKey] = MonitorSiteList;
                                if ($.isFunction(properties.callBack)) {
                                    properties.callBack(dataThis[dataKey]);
                                };
                            }
                        });
                    } else {
                        if ($.isFunction(properties.callBack)) {
                            properties.callBack(dataThis[dataKey]);
                        };
                    };
                    return dataThis[dataKey];
                }
                , getQualifiedMonitorSiteList: function (properties) {
                    //var settings = {
                    //    dataTypeCode: ""
                    //    , dateTime: new Date()
                    //    , cantonCode:
                    //    , qualifiedCode:""
                    //    , callBack: function (data) { }
                    //};
                    if (properties.cantonCode == undefined || properties.cantonCode == null) {
                        properties.cantonCode = "";
                    };
                    if (properties.qualifiedCode == undefined || properties.qualifiedCode == null) {
                        properties.qualifiedCode = "";
                    };
                    if (properties.IsBelongCantonOthers == undefined) {
                        properties.IsBelongCantonOthers = false;
                    };
                    var dataThis = this;
                    var dataKey = "";
                    switch (properties.dataTypeCode.toString()) {
                        case Code__DataType.Month:
                            dataKey = properties.dateTime.ToString("yyyy-MM-01");
                            break;
                        case Code__DataType.Hour:
                            dataKey = "Hour";
                            break;
                    };
                    dataKey = "_Data_" + dataKey + "_QualifiedCode_" + properties.qualifiedCode + "_" + properties.cantonCode + "_IsBelongCantonOthers_" + properties.IsBelongCantonOthers;
                    if (dataThis[dataKey] == undefined) {
                        this.getData({
                            dataTypeCode: properties.dataTypeCode
                            , dateTime: properties.dateTime
                            , callBack: function (data) {
                                var MonitorSiteList = [];
                                for (var j = 0; j < data.ListMonitor.length; j++) {
                                    if ((properties.cantonCode == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.cantonCode == data.ListMonitor[j].ParentCantonCode || properties.cantonCode == data.ListMonitor[j].MaxParentCantonCode || properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                        if (properties.qualifiedCode == "" || properties.qualifiedCode == data.ListMonitor[j].IsExcessive) {
                                            MonitorSiteList.push(data.ListMonitor[j]);
                                        };
                                    }
                                    else if (properties.cantonCode == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                        if (properties.qualifiedCode == "" || properties.qualifiedCode == data.ListMonitor[j].IsExcessive) {
                                            MonitorSiteList.push(data.ListMonitor[j]);
                                        };
                                    };
                                };
                                dataThis[dataKey] = MonitorSiteList;
                                if ($.isFunction(properties.callBack)) {
                                    properties.callBack(dataThis[dataKey]);
                                };
                            }
                        });
                    } else {
                        if ($.isFunction(properties.callBack)) {
                            properties.callBack(dataThis[dataKey]);
                        };
                    };
                    return dataThis[dataKey];
                }
                , getBussessCodeMonitorSiteList: function (properties) {
                    //var settings = {
                    //    dataTypeCode: ""
                    //    , dateTime: new Date()
                    //    , businessCode:""
                    //    , callBack: function (data) { }
                    //};

                    if (properties.businessCode == undefined || properties.businessCode == null) {
                        properties.businessCode = "";
                    };
                    var dataThis = this;
                    var dataKey = "";
                    switch (properties.dataTypeCode.toString()) {
                        case Code__DataType.Month:
                            dataKey = properties.dateTime.ToString("yyyy-MM-01");
                            break;
                        case Code__DataType.Hour:
                            dataKey = "Hour";
                            break;
                    };
                    dataKey = "_Data_" + dataKey + "_BussessCode_" + properties.businessCode;
                    if (dataThis[dataKey] == undefined) {
                        this.getData({
                            dataTypeCode: properties.dataTypeCode
                            , dateTime: properties.dateTime
                            , callBack: function (data) {
                                var MonitorSiteList = [];
                                for (var j = 0; j < data.ListMonitor.length; j++) {
                                    if (properties.businessCode == data.ListMonitor[j].BusinessCode) {
                                        MonitorSiteList.push(data.ListMonitor[j]);
                                    };
                                };
                                dataThis[dataKey] = MonitorSiteList;
                                if ($.isFunction(properties.callBack)) {
                                    properties.callBack(dataThis[dataKey]);
                                };
                            }
                        });
                    } else {
                        if ($.isFunction(properties.callBack)) {
                            properties.callBack(dataThis[dataKey]);
                        };
                    };
                    return dataThis[dataKey];
                }
                , getStatisticsMonitorSiteList: function (properties) {
                    //var settings = {
                    //    dataTypeCode: ""
                    //    ,dateTime: new Date()
                    //    ,selectCanton:""  
                    //    , callBack: function (data) { }
                    //};
                    if (properties.selectCanton == undefined || properties.selectCanton == null) {
                        properties.selectCanton = "";
                    };
                    if (properties.IsBelongCantonOthers == undefined) {
                        properties.IsBelongCantonOthers = false;
                    };
                    var dataThis = this;
                    var dataKey = "";
                    switch (properties.dataTypeCode.toString()) {
                        case Code__DataType.Month:
                            dataKey = properties.dateTime.ToString("yyyy-MM-01");
                            break;
                        case Code__DataType.Hour:
                            dataKey = "Hour";
                            break;
                    };
                    dataKey = "_Data_" + dataKey + "_StatisticsCode_" + properties.selectCanton + "_IsBelongCantonOthers_" + properties.IsBelongCantonOthers;
                    if (dataThis[dataKey] == undefined) {
                        this.getData({
                            dataTypeCode: properties.dataTypeCode
                            , dateTime: properties.dateTime
                            , callBack: function (data) {
                                var newdata = jQuery.extend(true, {}, data); //拷贝对象
                                newdata.EntityCount = newdata.ListMonitor.length;
                                //先加上其它的（如江苏省其它），QualitativeValue=0时再去掉
                                if (API.UserInfo.IsBelongManageCantonSame) {
                                    newdata.ListCanton.push({ Code: API.UserInfo.UserBelongCantonCode, Name: API.UserInfo.UserBelongCantonName + UserBelongCantonNameBehindWord, QualitativeValue: 0 });
                                };
                                for (var i = 0; i < newdata.ListMonitor.length; i++) {
                                    //是否优良 
                                    for (var j = 0; j < newdata.ListIsExcessive.length; j++) {
                                        if (newdata.ListMonitor[i].IsExcessive == newdata.ListIsExcessive[j].Code) {
                                            if ((properties.selectCanton == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.selectCanton == newdata.ListMonitor[i].ParentCantonCode || properties.selectCanton == newdata.ListMonitor[i].MaxParentCantonCode || properties.selectCanton == newdata.ListMonitor[i].CantonCode) {
                                                newdata.ListIsExcessive[j].QualitativeValue += 1;
                                            }
                                            else if (properties.selectCanton == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.selectCanton == newdata.ListMonitor[i].CantonCode) {
                                                newdata.ListIsExcessive[j].QualitativeValue++;
                                            };
                                        };
                                    };

                                    //类别
                                    for (var j = 0; j < newdata.ListAirLevel.length; j++) {
                                        if (newdata.ListMonitor[i].AirLevelCode == newdata.ListAirLevel[j].Code) {
                                            if ((properties.selectCanton == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.selectCanton == newdata.ListMonitor[i].ParentCantonCode || properties.selectCanton == newdata.ListMonitor[i].MaxParentCantonCode || properties.selectCanton == newdata.ListMonitor[i].CantonCode) {
                                                newdata.ListAirLevel[j].QualitativeValue += 1;
                                            }
                                            else if (properties.selectCanton == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.selectCanton == newdata.ListMonitor[i].CantonCode) {
                                                newdata.ListAirLevel[j].QualitativeValue++;
                                            };
                                        };
                                    };

                                    //厂区
                                    if (API.UserInfo.IsBelongManageCantonSame) {
                                        for (var j = 0; j < newdata.ListCanton.length; j++) {
                                            if (newdata.ListCanton[j].Code == "" || newdata.ListCanton[j].Code == newdata.ListMonitor[i].ParentCantonCode || newdata.ListCanton[j].Code == newdata.ListMonitor[i].MaxParentCantonCode || newdata.ListCanton[j].Code == newdata.ListMonitor[i].CantonCode) {
                                                if (API.UserInfo.UserBelongCantonCode == newdata.ListMonitor[i].CantonCode) {
                                                    newdata.ListCanton[newdata.ListCanton.length - 1].QualitativeValue += 1;
                                                }
                                                else {
                                                    if (j < newdata.ListCanton.length - 1) {
                                                        newdata.ListCanton[j].QualitativeValue += 1;
                                                    };
                                                };
                                            };
                                        };
                                    }
                                    else {
                                        for (var j = 0; j < newdata.ListCanton.length; j++) {
                                            if (newdata.ListCanton[j].Code == "" || newdata.ListCanton[j].Code == newdata.ListMonitor[i].ParentCantonCode || newdata.ListCanton[j].Code == newdata.ListMonitor[i].MaxParentCantonCode || newdata.ListCanton[j].Code == newdata.ListMonitor[i].CantonCode) {
                                                newdata.ListCanton[j].QualitativeValue += 1;
                                            };
                                        };
                                    };
                                };
                                if (newdata.ListCanton[newdata.ListCanton.length - 1].QualitativeValue == 0) {
                                    newdata.ListCanton.pop();
                                }
                                newdata.ListCanton = newdata.ListCanton.sort(ArrayDesc);
                                dataThis[dataKey] = newdata;
                                if ($.isFunction(properties.callBack)) {
                                    properties.callBack(dataThis[dataKey]);
                                };
                            }
                        });
                    } else {
                        if ($.isFunction(properties.callBack)) {
                            properties.callBack(dataThis[dataKey]);
                        };
                    };
                    return dataThis[dataKey];
                }
        }
    }
    , Solid: {
        Search__Solid_MonitorSiteStatisticsInfo: {
            getData: function (properties) {
                var dataThis = this;
                var dataKey = "";
                switch (properties.dataTypeCode.toString()) {
                    case Code__DataType.Month:
                        dataKey = properties.dateTime.ToString("yyyy-MM-01");
                        break;
                    case Code__DataType.Real:
                        dataKey = "Real";
                        break;
                };
                dataKey = "_Data_" + dataKey;
                if (dataThis[dataKey] == undefined) {
                    var successFunction = function (ResultData) {
                        if (ResultData != null && ResultData.Status == 1) {
                            dataThis[dataKey] = ResultData.Data;
                            if ($.isFunction(properties.callBack)) {
                                properties.callBack(dataThis[dataKey]);
                            };
                        };
                    };
                    switch (window.Module.RequestTypeCode) {
                        case window.Module.Code_RequestType.jQuery:
                            $.ajax($.Page.GetAjaxSettings({
                                ServiceTypeCode: "Solid"
                                                , MethodName: "Search__Solid_MonitorSiteStatisticsInfo"
                                                , data: jExtension.JsonToSubmitString({
                                                    Ticket: $.page.ticket
                                                    , ParameterData: {
                                                        DataTypeCode: properties.dataTypeCode
                                                        , DateTimeList: properties.dateTime == null ? null : [properties.dateTime.ToString("UTCDateTime")]
                                                    }
                                                })
                                                , type: "post"
                                                , success: successFunction
                            }));
                            break;
                        case window.Module.Code_RequestType.Ext:
                            Ext.data.JsonP.request($.Page.GetJsonpSettings({
                                params: {
                                    ServiceName: "Solid",
                                    MethodName: 'Search__Solid_MonitorSiteStatisticsInfo',
                                    ParameterDataJsonString: Ext.JSON.encode(
                                                {
                                                    Ticket: $.page.ticket
                                                    , ParameterData: {
                                                        DataTypeCode: properties.dataTypeCode
                                                        , DateTimeList: properties.dateTimeList
                                                    }
                                                })
                                }, success: successFunction
                                                , failure: window.Module.Solid.Solid.Search__Solid_MonitorSiteStatisticsInfo.getDataFailure
                            }));
                            break;
                    };
                } else {
                    if ($.isFunction(properties.callBack)) {
                        properties.callBack(dataThis[dataKey]);
                    };
                };
                return dataThis[dataKey];
            }
            , getDataFailure: function (e) {

            }
            , getCantonMonitorSiteList: function (properties) {
                //var settings = {
                //    dataTypeCode: ""
                //    , dateTime: new Date()
                //    , cantonCode:""
                //    , callBack: function (data) { }
                //};
                if (properties.cantonCode == undefined || properties.cantonCode == null) {
                    properties.cantonCode = "";
                };
                if (properties.IsBelongCantonOthers == undefined) {
                    properties.IsBelongCantonOthers = false;
                };
                var dataThis = this;
                var dataKey = "";
                switch (properties.dataTypeCode.toString()) {
                    case Code__DataType.Month:
                        dataKey = properties.dateTime.ToString("yyyy-MM-01");
                        break;
                    case Code__DataType.Real:
                        dataKey = "Real";
                        break;
                };
                dataKey = "_Data_" + dataKey + "_CantonCode_" + properties.cantonCode + "_IsBelongCantonOthers_" + properties.IsBelongCantonOthers;
                if (dataThis[dataKey] == undefined) {
                    this.getData({
                        dataTypeCode: properties.dataTypeCode
                        , dateTime: properties.dateTime
                        , callBack: function (data) {
                            var MonitorSiteList = [];
                            for (var j = 0; j < data.ListMonitor.length; j++) {
                                if (properties.MonitorSiteCode == undefined) {
                                    if ((properties.cantonCode == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.cantonCode == data.ListMonitor[j].ParentCantonCode || properties.cantonCode == data.ListMonitor[j].MaxParentCantonCode || properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                        MonitorSiteList.push(data.ListMonitor[j]);
                                    }
                                    else if (properties.cantonCode == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                        MonitorSiteList.push(data.ListMonitor[j]);
                                    };
                                }
                                else {
                                    if (properties.MonitorSiteCode = data.ListMonitor[j].MonitorSiteCode) {
                                        MonitorSiteList.push(data.ListMonitor[j]);
                                    };
                                };
                            };
                            dataThis[dataKey] = MonitorSiteList;
                            if ($.isFunction(properties.callBack)) {
                                properties.callBack(dataThis[dataKey]);
                            };
                        }
                    });
                } else {
                    if ($.isFunction(properties.callBack)) {
                        properties.callBack(dataThis[dataKey]);
                    };
                };
                return dataThis[dataKey];
            }
            , getSolidQualityTypeMonitorSiteList: function (properties) {
                if (properties.cantonCode == undefined || properties.cantonCode == null) {
                    properties.cantonCode = "";
                };
                if (properties.EnterpriseTypeCode == undefined || properties.EnterpriseTypeCode == null) {
                    properties.EnterpriseTypeCode = "";
                };
                if (properties.IsBelongCantonOthers == undefined) {
                    properties.IsBelongCantonOthers = false;
                };
                var dataThis = this;
                var dataKey = "";
                dataKey = properties.EnterpriseTypeCode;
                dataKey = "_Data_" + dataKey + "_EnterpriseTypeCode_" + properties.EnterpriseTypeCode + "_" + properties.cantonCode + "_IsBelongCantonOthers_" + properties.IsBelongCantonOthers;
                if (dataThis[dataKey] == undefined) {
                    this.getData({
                        dataTypeCode: properties.dataTypeCode
                        , dateTime: properties.dateTime
                        , callBack: function (data) {
                            var MonitorSiteList = [];
                            for (var j = 0; j < data.ListMonitor.length; j++) {
                                if ((properties.cantonCode == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.cantonCode == data.ListMonitor[j].ParentCantonCode || properties.cantonCode == data.ListMonitor[j].MaxParentCantonCode || properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                    if (properties.EnterpriseTypeCode == "" || properties.EnterpriseTypeCode == data.ListMonitor[j].EnterpriseType) {
                                        MonitorSiteList.push(data.ListMonitor[j]);
                                    };
                                }
                                else if (properties.cantonCode == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                    if (properties.EnterpriseTypeCode == "" || properties.EnterpriseTypeCode == data.ListMonitor[j].EnterpriseType) {
                                        MonitorSiteList.push(data.ListMonitor[j]);
                                    };
                                };
                            };
                            dataThis[dataKey] = MonitorSiteList;
                            if ($.isFunction(properties.callBack)) {
                                properties.callBack(dataThis[dataKey]);
                            };
                        }
                    });
                } else {
                    if ($.isFunction(properties.callBack)) {
                        properties.callBack(dataThis[dataKey]);
                    };
                };
                return dataThis[dataKey];
            }
            , getQualifiedMonitorSiteList: function (properties) {
                if (properties.cantonCode == undefined || properties.cantonCode == null) {
                    properties.cantonCode = "";
                };
                if (properties.qualifiedCode == undefined || properties.qualifiedCode == null) {
                    properties.qualifiedCode = "";
                };
                if (properties.IsBelongCantonOthers == undefined) {
                    properties.IsBelongCantonOthers = false;
                };
                var dataThis = this;
                var dataKey = "";
                switch (properties.dataTypeCode.toString()) {
                    case Code__DataType.Month:
                        dataKey = properties.dateTime.ToString("yyyy-MM-01");
                        break;
                    case Code__DataType.Real:
                        dataKey = "Real";
                        break;
                };
                dataKey = "_Data_" + dataKey + "_QualifiedCode_" + properties.qualifiedCode + "_" + properties.cantonCode + "_IsBelongCantonOthers_" + properties.IsBelongCantonOthers;
                if (dataThis[dataKey] == undefined) {
                    this.getData({
                        dataTypeCode: properties.dataTypeCode
                        , dateTime: properties.dateTime
                        , callBack: function (data) {
                            var MonitorSiteList = [];
                            for (var j = 0; j < data.ListMonitor.length; j++) {
                                if ((properties.cantonCode == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.cantonCode == data.ListMonitor[j].ParentCantonCode || properties.cantonCode == data.ListMonitor[j].MaxParentCantonCode || properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                    if (properties.qualifiedCode == "" || properties.qualifiedCode == data.ListMonitor[j].IsExcessive) {
                                        MonitorSiteList.push(data.ListMonitor[j]);
                                    };
                                }
                                else if (properties.cantonCode == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.cantonCode == data.ListMonitor[j].CantonCode) {
                                    if (properties.qualifiedCode == "" || properties.qualifiedCode == data.ListMonitor[j].IsExcessive) {
                                        MonitorSiteList.push(data.ListMonitor[j]);
                                    };
                                };
                            };
                            dataThis[dataKey] = MonitorSiteList;
                            if ($.isFunction(properties.callBack)) {
                                properties.callBack(dataThis[dataKey]);
                            };
                        }
                    });
                } else {
                    if ($.isFunction(properties.callBack)) {
                        properties.callBack(dataThis[dataKey]);
                    };
                };
                return dataThis[dataKey];
            }
            , getBussessCodeMonitorSiteList: function (properties) {
                if (properties.businessCode == undefined || properties.businessCode == null) {
                    properties.businessCode = "";
                };
                var dataThis = this;
                var dataKey = "";
                switch (properties.dataTypeCode.toString()) {
                    case Code__DataType.Month:
                        dataKey = properties.dateTime.ToString("yyyy-MM-01");
                        break;
                    case Code__DataType.Real:
                        dataKey = "Real";
                        break;
                };
                dataKey = "_Data_" + dataKey + "_BussessCode_" + properties.businessCode;
                if (dataThis[dataKey] == undefined) {
                    this.getData({
                        dataTypeCode: properties.dataTypeCode
                        , dateTime: properties.dateTime
                        , callBack: function (data) {
                            var MonitorSiteList = [];
                            for (var j = 0; j < data.ListMonitor.length; j++) {
                                if (properties.businessCode == data.ListMonitor[j].BusinessCode) {
                                    MonitorSiteList.push(data.ListMonitor[j]);
                                };
                            };
                            dataThis[dataKey] = MonitorSiteList;
                            if ($.isFunction(properties.callBack)) {
                                properties.callBack(dataThis[dataKey]);
                            };
                        }
                    });
                } else {
                    if ($.isFunction(properties.callBack)) {
                        properties.callBack(dataThis[dataKey]);
                    };
                };
                return dataThis[dataKey];
            }
            , getStatisticsMonitorSiteList: function (properties) {
                if (properties.selectCanton == undefined || properties.selectCanton == null) {
                    properties.selectCanton = "";
                };
                if (properties.IsBelongCantonOthers == undefined) {
                    properties.IsBelongCantonOthers = false;
                };
                var dataThis = this;
                var dataKey = "";
                switch (properties.dataTypeCode.toString()) {
                    case Code__DataType.Month:
                        dataKey = properties.dateTime.ToString("yyyy-MM-01");
                        break;
                    case Code__DataType.Real:
                        dataKey = "Real";
                        break;
                };
                dataKey = "_Data_" + dataKey + "_StatisticsCode_" + properties.selectCanton + "_IsBelongCantonOthers_" + properties.IsBelongCantonOthers;
                if (dataThis[dataKey] == undefined) {
                    this.getData({
                        dataTypeCode: properties.dataTypeCode
                        , dateTime: properties.dateTime
                        , callBack: function (data) {
                            var newdata = jQuery.extend(true, {}, data); //拷贝对象
                            newdata.EntityCount = newdata.ListMonitor.length;
                            //先加上其它的（如江苏省其它），QualitativeValue=0时再去掉
                            if (API.UserInfo.IsBelongManageCantonSame) {
                                newdata.ListCanton.push({ Code: API.UserInfo.UserBelongCantonCode, Name: API.UserInfo.UserBelongCantonName + UserBelongCantonNameBehindWord, QualitativeValue: 0 });
                            };
                            for (var i = 0; i < newdata.ListMonitor.length; i++) {
                                //类别
                                for (var j = 0; j < newdata.ListEnterpriseType.length; j++) {
                                    if (newdata.ListMonitor[i].EnterpriseType == newdata.ListEnterpriseType[j].Code) {
                                        if ((properties.selectCanton == API.UserInfo.UserBelongCantonCode && !properties.IsBelongCantonOthers) || properties.selectCanton == newdata.ListMonitor[i].ParentCantonCode || properties.selectCanton == newdata.ListMonitor[i].MaxParentCantonCode || properties.selectCanton == newdata.ListMonitor[i].CantonCode) {
                                            newdata.ListEnterpriseType[j].QualitativeValue += 1;
                                        }
                                        else if (properties.selectCanton == API.UserInfo.UserBelongCantonCode && properties.IsBelongCantonOthers && properties.selectCanton == newdata.ListMonitor[i].CantonCode) {
                                            newdata.ListEnterpriseType[j].QualitativeValue++;
                                        };
                                    };
                                };
                                //厂区
                                if (API.UserInfo.IsBelongManageCantonSame) {
                                    for (var j = 0; j < newdata.ListCanton.length; j++) {
                                        if (newdata.ListCanton[j].Code == newdata.ListMonitor[i].ParentCantonCode || newdata.ListCanton[j].Code == newdata.ListMonitor[i].MaxParentCantonCode || newdata.ListCanton[j].Code == newdata.ListMonitor[i].CantonCode) {
                                            if (API.UserInfo.UserBelongCantonCode == newdata.ListMonitor[i].CantonCode) {
                                                newdata.ListCanton[newdata.ListCanton.length - 1].QualitativeValue += 1;
                                            }
                                            else {
                                                if (j < newdata.ListCanton.length - 1) {
                                                    newdata.ListCanton[j].QualitativeValue += 1;
                                                };
                                            };
                                        };
                                    };
                                }
                                else {
                                    for (var j = 0; j < newdata.ListCanton.length; j++) {
                                        if (newdata.ListCanton[j].Code == newdata.ListMonitor[i].ParentCantonCode || newdata.ListCanton[j].Code == newdata.ListMonitor[i].MaxParentCantonCode || newdata.ListCanton[j].Code == newdata.ListMonitor[i].CantonCode) {
                                            newdata.ListCanton[j].QualitativeValue += 1;
                                        };
                                    };
                                };
                            };
                            if (newdata.ListCanton[newdata.ListCanton.length - 1].QualitativeValue == 0) {
                                newdata.ListCanton.pop();
                            }
                            newdata.ListCanton = newdata.ListCanton.sort(ArrayDesc);
                            dataThis[dataKey] = newdata;
                            if ($.isFunction(properties.callBack)) {
                                properties.callBack(dataThis[dataKey]);
                            };
                        }
                    });
                } else {
                    if ($.isFunction(properties.callBack)) {
                        properties.callBack(dataThis[dataKey]);
                    };
                };
                return dataThis[dataKey];
            }
        }
    }
    , YDZF: {
        Search__YDZF_MonitorSiteStatisticsInfo: {
            getData: function (properties) {
                var dataThis = this;
                var dataKey = "";
                var ydzf__Ticket = jExtension.Request("ydzf_Ticket");
                var IsByUser = true;
                if (fw.fwObject.FWObjectHelper.hasValue(ydzf__Ticket)) {
                    $.Page.WindowOpenTypeCode = Code__WindowOpenType.WindowOpen;
                };
                dataKey = "_Data_Month" + dataKey;
                if (dataThis[dataKey] == undefined) {
                    var successFunction = function (ResultData) {
                        if (ResultData != null && ResultData.Status == 1) {
                            dataThis[dataKey] = ResultData.Data;
                            if ($.isFunction(properties.callBack)) {
                                properties.callBack(dataThis[dataKey]);
                            };
                        };
                    };
                    switch (window.Module.RequestTypeCode) {
                        case window.Module.Code_RequestType.jQuery:
                            if (!fw.fwObject.FWObjectHelper.hasValue(ydzf__Ticket)) {
                                $.ajax($.Page.GetAjaxSettings({
                                    ServiceTypeCode: "YDZF"
                                    , MethodName: "GetTicketByUserName"
                                    , data: {
                                        ServiceName: "TaskManage"
                                        , MethodName: "GetTicketByUserName"
                                        , ParameterDataJsonString: jExtension.JsonToSubmitString({
                                            userName: $.Page.UserInfo.UserName
                                        })
                                    }
                                    , success: function (ResultData) {
                                        if (ResultData != null && ResultData.Status == 1) {
                                            ydzf__Ticket = ResultData.Data;
                                            window.ydzf__Ticket = ydzf__Ticket;
                                            $.ajax($.Page.GetAjaxSettings({
                                                ServiceTypeCode: "YDZF"
                                                , MethodName: "Search__InsepectCountByCanton"
                                                , data: {
                                                    ServiceName: "TaskManage"
                                                    , MethodName: "Search__InsepectCountByCanton"
                                                    , ParameterDataJsonString: jExtension.JsonToSubmitString({
                                                        Ticket: ydzf__Ticket
                                                        , ParameterData: {
                                                            IsByUser: IsByUser
                                                        }
                                                    })
                                                }
                                                , success: successFunction
                                                , error: window.Module.YDZF.Search__YDZF_MonitorSiteStatisticsInfo.getDataFailure
                                            }));
                                        };
                                    }
                                }));
                            }
                            else {
                                window.ydzf__Ticket = ydzf__Ticket;
                                $.ajax($.Page.GetAjaxSettings({
                                    ServiceTypeCode: "YDZF"
                                    , MethodName: "Search__InsepectCountByCanton"
                                    , data: {
                                        ServiceName: "TaskManage"
                                        , MethodName: "Search__InsepectCountByCanton"
                                        , ParameterDataJsonString: jExtension.JsonToSubmitString({
                                            Ticket: ydzf__Ticket
                                            , ParameterData: {
                                                IsByUser: IsByUser
                                            }
                                        })
                                    }
                                    , success: successFunction
                                    , error: window.Module.YDZF.Search__YDZF_MonitorSiteStatisticsInfo.getDataFailure
                                }));
                            }
                            break;
                        case window.Module.Code_RequestType.Ext:
                            Ext.data.JsonP.request($.Page.GetJsonpSettings({
                                params: {
                                    ServiceName: "YDZF",
                                    MethodName: 'Search__InsepectCountByCanton',
                                    ParameterDataJsonString: Ext.JSON.encode(
                                        {
                                            Ticket: $.page.ticket
                                            , ParameterData: {
                                                IsByUser: IsByUser
                                            }
                                        })
                                }
                                , success: successFunction
                                , failure: window.Module.YDZF.Search__YDZF_MonitorSiteStatisticsInfo.getDataFailure
                            }));
                            break;
                    };
                } else {
                    if ($.isFunction(properties.callBack)) {
                        properties.callBack(dataThis[dataKey]);
                    };
                };
                return dataThis[dataKey];
            }
            , //隐藏移动执法
            HideMapService: function () {
                $.LayersControl.SetLayerChecked({ Selector: divArcGISLayersControlJQ, LayerName: "jsJJ_CityNameMap", IsChecked: false });   //, IsTriggerHandler: false
                //$.LayersControl.SetLayerUnChecked({ Selector: divArcGISLayersControlJQ, LayerName: "jsJJ_CityNameMap" });
                API.CantonColorClear();
                API.SearchAndConcernUnbind();
                API.CantonStatisticsUnbind();
                API.ArcGISAPI.mapInfoWindowHide();
                API.ArcGISAPI.businessLayerHide();
                API.zoomToCanton(API.UserInfo.UserBelongCantonCode);

                //                $(".divFullExtent").bind("mouseup", function () {
                //                    //var a = 1;
                //                    API.CantonColorClear();
                //                    API.zoomToCanton(API.UserInfo.UserBelongCantonCode);
                //                    $.LayersControl.SetLayerChecked({ Selector: divArcGISLayersControlJQ, LayerName: "jsJJ_CityNameMap", IsChecked: false });
                //                });
                //$(".divFullExtent").click();
            }
            , getDataFailure: function () {

            }

            , getStatisticsMonitorSiteList: function (properties) {
                var dataThis = this;
                var dataKey = "";
                dataKey = "_Data_" + dataKey + "_YDZF";
                if (dataThis[dataKey] == undefined) {
                    this.getData({
                        callBack: function (Data) {
                            var EnterpriseList = [];
                            if (Data.ListMonitor.length > 20) {
                                EnterpriseList = Data.ListMonitor.slice(0, 20);
                            }
                            else {
                                EnterpriseList = Data.ListMonitor;
                            };
                            Data.EnterpriseList = EnterpriseList;
                            var CantonList = [];
                            var ListInspectCount = Data.ListInspectCount;
                            var ListCanton = Data.ListCanton;

                            for (var Ii = 0; Ii < ListInspectCount.length; Ii++) {
                                if (ListInspectCount[Ii].Code.length > 6) {
                                    ListInspectCount[Ii].Code = ListInspectCount[Ii].Code.substring(0, 6);
                                };
                                ListInspectCount[Ii].Color = Dictionary__CantonColor[Ii].Color;
                            };
                            Data.ListInspectCount = ListInspectCount;
                            for (var Li = 0; Li < ListCanton.length; Li++) {
                                if (ListCanton[Li].Code.length > 6) {
                                    ListCanton[Li].Code = ListCanton[Li].Code.substring(0, 6);
                                };
                                ListCanton[Li].Count = 0;
                                for (var m = 0; m < ListInspectCount.length; m++) {
                                    if (ListInspectCount[m].Code == ListCanton[Li].Code) {
                                        ListCanton[Li].Count = ListInspectCount[m].Count;
                                    };
                                };
                                if (ListCanton[Li].Name.indexOf("本级") > -1) {
                                    ListCanton[Li].IsBelongCantonOthers = true;
                                };
                            };
                            ListCanton = ListCanton.sort(ArrayDesc);
                            for (var i = 0; i < ListCanton.length; i++) {
                                if (ListCanton[i].Count == 0) {
                                    continue;
                                }
                                else {
                                    ListCanton[i].Color = Dictionary__CantonColor[i].Color;
                                };
                            };
                            Data.ListCanton = ListCanton;
                            dataThis[dataKey] = Data;
                            if ($.isFunction(properties.callBack)) {
                                properties.callBack(dataThis[dataKey]);
                            };
                        }
                    });
                }
                else {
                    if ($.isFunction(properties.callBack)) {
                        properties.callBack(dataThis[dataKey]);
                    };
                };
                return dataThis[dataKey];
            }
        }
    }
};

function OpenWindow__MonitorSiteHistoryData(Data) {
    var OpenSettings = {
        TitleHtml: Data.EnterpriseName,
        IsHtmlPage: true,
        Width: 1100,
        Url: $.page.webSiteRootUrl + "Web/Enterprise/MonitorSiteMain.htm",
        Data: $.extend({
            IsHideLogo: ($.Page.WindowOpenTypeCode == Code__WindowOpenType.WindowOpen ? 0 : 1),
            Ticket: $.page.ticket,
            DataTypeCode: '400'
        }, Data)
    };
    if (fw.fwObject.FWObjectHelper.hasValue(OpenSettings)) {
        if ($.Page.WindowOpenTypeCode == Code__WindowOpenType.WindowOpen) {
            jQueryExtension.Window.Open(OpenSettings);
        } else {
            fw.topWindow().jQueryExtension.UI.Open(OpenSettings);
        };
    };
};

//数组的倒序输出
function ArrayDesc(x, y) {
    if (fw.fwObject.FWObjectHelper.hasValue(x.QualitativeValue)) {
        if (x.QualitativeValue > y.QualitativeValue) {
            return -1;
        }
        else {
            return 1;
        };
    }
    else if (fw.fwObject.FWObjectHelper.hasValue(x.Count)) {
        if (x.Count > y.Count) {
            return -1;
        }
        else {
            return 1;
        };
    };
};

//数组的正序输出
function ArrayAsc(x, y) {
    if (fw.fwObject.FWObjectHelper.hasValue(x.QualitativeValue)) {
        if (x.QualitativeValue > y.QualitativeValue) {
            return 1;
        }
        else {
            return -1;
        };
    } else if (fw.fwObject.FWObjectHelper.hasValue(x.Count)) {
        if (x.Count > y.Count) {
            return 1;
        }
        else {
            return -1;
        };
    };
};
