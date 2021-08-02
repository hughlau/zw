(function (window, undefined) {

    var 
        _TL = window.TL
    ;

    TL = {
        VirtualDirectory: ""
        , WebSiteRootDirectoryURL: ""
        , IsUndefinedOrNullOrEmpty: function (AnyType, IsIncludeString) {
            var Is = false;
            if (AnyType != undefined && AnyType != null) {
                switch (Object.prototype.toString.apply(AnyType)) {
                    case "[object String]":
                        AnyType = TL.String.Trim(AnyType.toLocaleLowerCase());
                        Is = (AnyType == "undefined" || AnyType == "null" || AnyType.length < 1);
                        break;
                    case "[object Number]":
                        break;
                    case "[object Boolean]":
                        break;
                    case "[object Object]":
                        Is = $.isEmptyObject(AnyType);
                        break;
                    case "[object Array]":
                        Is = (AnyType.length < 1);
                        break;
                };
            } else {
                Is = true;
            };
            return Is;
        }
        , AlertNewline: "\n"
        , GetValue: function (Object, thisObj, argArray) {
            var result;
            if ($.isFunction(Object)) {
                if (TL.IsUndefinedOrNullOrEmpty(argArray)) {
                    argArray = thisObj;
                };
                if (!$.isArray(argArray)) {
                    argArray = [argArray];
                };
                result = Object.apply(thisObj, argArray);
            } else {
                result = Object;
            };
            return result;
        }
        , SetOuterWidth: function (Selector, OuterWidth) {
            $(Selector).each(function () {
                var thisJQ = $(this);
                thisJQ.width(OuterWidth - (thisJQ.outerWidth() - thisJQ.width()));
            });
        }
        , SetOuterHeight: function (Selector, OuterHeight) {
            $(Selector).each(function () {
                var thisJQ = $(this);
                thisJQ.height(OuterHeight - (thisJQ.outerHeight() - thisJQ.height()));
            });
        }
        , GetExcludeContentWidth: function (Selector) {
            var SelectorJQ = $(Selector);
            return SelectorJQ.outerWidth() - SelectorJQ.width();
        }
        , GetExcludeContentHeight: function (Selector) {
            var SelectorJQ = $(Selector);
            return SelectorJQ.outerHeight() - SelectorJQ.height();
        }
        , GetBorderColor: function (Selector) {
            var SelectorJQ = $(Selector);
            return SelectorJQ.css("border-top-color") || SelectorJQ.css("border-right-color") || SelectorJQ.css("border-bottom-color") || SelectorJQ.css("border-left-color");
        }
        , Boolean: {
            ToBoolean: function (_Boolean) {
                return _Boolean;
            }
            , ToNumber: function (_Boolean) {
                return _Boolean ? 1 : 0;
            }
        }
        , Number: {
            ToNumber: function (_Number) {
                return _Number;
            }
            , ToBoolean: function (_Number) {
                return _Number == 1;
            }
            , ToDateTime: function (_Number) {
                /// <summary>
                ///     1: ("2008-08-08 08:08:08").ToDate() - 字符转化为日期型。
                /// </summary>
                ///	<returns type="date" />
                var DateString = TL.String.Trim(value.toString());

                if (DateString.indexOf("/Date(") == 0 && DateString.lastIndexOf(")/") == DateString.length - 2) {
                    return eval('new ' + DateString.replace(/\//g, ''));
                };

                var Results = DateString.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) *$/);
                if (Results && Results.length > 3) {
                    return new Date(parseFloat(Results[1]), parseFloat(Results[2]) - 1, parseFloat(Results[3]));
                };
                Results = DateString.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2}) *$/);
                if (Results && Results.length > 6) {
                    return new Date(parseFloat(Results[1]), parseFloat(Results[2]) - 1, parseFloat(Results[3]), parseFloat(Results[4]), parseFloat(Results[5]), parseFloat(Results[6]));
                };
                Results = DateString.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2})\.(\d{1,9}) *$/);
                if (Results && Results.length > 7) {
                    return new Date(parseFloat(Results[1]), parseFloat(Results[2]) - 1, parseFloat(Results[3]), parseFloat(Results[4]), parseFloat(Results[5]), parseFloat(Results[6]), parseFloat(Results[7]));
                };
                return "";
            }
            , ToString: function (_Number, format) {
                var result = null;
                if (TL.IsUndefinedOrNullOrEmpty(format)) {
                    result = _Number.toString();
                };
                if (format == "UTCDateTime") {
                    ///  /Date(1311821221173+0800)/
                    result = "/Date(" + (TL.DateTime.AddHours(_DateTime, -8) - TL.ToDateTime("1970-01-01")) + "+0800)/";
                } else {
                    var o = {
                        "M+": _DateTime.getMonth() + 1,                                        //月份         
                        "d+": _DateTime.getDate(),                                             //日         
                        "h+": _DateTime.getHours() % 12 == 0 ? 12 : _DateTime.getHours() % 12, //12小时         
                        "H+": _DateTime.getHours(),                                            //24小时         
                        "m+": _DateTime.getMinutes(),                                          //分         
                        "s+": _DateTime.getSeconds(),                                          //秒         
                        "q+": Math.floor((_DateTime.getMonth() + 3) / 3),                      //季度         
                        "S": _DateTime.getMilliseconds()                                       //毫秒         
                    };
                    var week = {
                        "0": "/u65e5",
                        "1": "/u4e00",
                        "2": "/u4e8c",
                        "3": "/u4e09",
                        "4": "/u56db",
                        "5": "/u4e94",
                        "6": "/u516d"
                    };
                    if (/(y+)/.test(format)) {
                        format = format.replace(RegExp.$1, (_DateTime.getFullYear() + "").substr(4 - RegExp.$1.length));
                    };
                    if (/(E+)/.test(format)) {
                        format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
                    };
                    for (var k in o) {
                        if (new RegExp("(" + k + ")").test(format)) {
                            format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                        };
                    };
                    result = format;
                };
                return result;
            }
            , DecimalDigits: function (_Number) {
                var NumberString = _Number.toString();
                var DecimalPointIndex = NumberString.indexOf(".");
                if (DecimalPointIndex > -1) {
                    return NumberString.length - NumberString.indexOf(".") - 1;
                } else {
                    return 0;
                };
            }
            , Add: function (_Number1, _Number2) {
                var r1, r2, m;
                try {
                    r1 = _Number1.toString().split(".")[1].length;
                }
                catch (e) {
                    r1 = 0;
                }
                try {
                    r2 = _Number2.toString().split(".")[1].length;
                }
                catch (e) {
                    r2 = 0;
                }
                m = Math.pow(10, Math.max(r1, r2));
                return (_Number1 * m + _Number2 * m) / m;
            }
            //减
                , Subtr: function (_Number1, _Number2) {
                    var r1, r2, m, n;
                    try {
                        r1 = _Number1.toString().split(".")[1].length;
                    }
                    catch (e) {
                        r1 = 0;
                    }
                    try {
                        r2 = _Number2.toString().split(".")[1].length;
                    }
                    catch (e) {
                        r2 = 0;
                    }
                    m = Math.pow(10, Math.max(r1, r2));
                    //last modify by deeka
                    //动态控制精度长度
                    n = (r1 >= r2) ? r1 : r2;
                    return ((_Number1 * m - _Number2 * m) / m).toFixed(n);
                }
            //乘
                , Mul: function (_Number1, _Number2) {
                    var m = 0, s1 = _Number1.toString(), s2 = _Number2.toString();
                    try {
                        m += s1.split(".")[1].length;
                    }
                    catch (e) {
                    }
                    try {
                        m += s2.split(".")[1].length;
                    }
                    catch (e) {
                    }
                    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
                }
            //除
                , Div: function (_Number1, _Number2) {
                    var t1 = 0, t2 = 0, r1, r2;
                    try {
                        t1 = _Number1.toString().split(".")[1].length;
                    }
                    catch (e) {
                    }
                    try {
                        t2 = _Number2.toString().split(".")[1].length;
                    }
                    catch (e) {
                    }
                    with (Math) {
                        r1 = Number(_Number1.toString().replace(".", ""));
                        r2 = Number(_Number2.toString().replace(".", ""));
                        return (r1 / r2) * pow(10, t2 - t1);
                    }
                }
            //            , Plus: function (_NumberA, _NumberB, _NumberFormat) {
            //                var DecimalDigits = TL.Number.DecimalDigits(_NumberFormat);
            //                _NumberA = parseInt(_NumberA * Math.pow(10, DecimalDigits), 10);
            //                _NumberB = parseInt(_NumberB * Math.pow(10, DecimalDigits), 10);
            //                return (_NumberA + _NumberB) / Math.pow(10, DecimalDigits);
            //            }
            //            , Less: function (_NumberA, _NumberB, _NumberFormat) {
            //                return TL.Number.Plus(_NumberA, 0 - _NumberB, _NumberFormat);
            //            }
        }
        , String: {
            ToString: function (_String) {
                return _String;
            }
            , ToBoolean: function (_String) {
                _String = TL.String.Trim(_String).toLowerCase();
                return _String == "true";
            }
            , ToNumber: function (_String) {
                if ($.isNumeric(_String)) {
                    _String = parseFloat(_String);
                } else {
                    _String = null;
                };
                return _String;
            }
            , Trim: function (value) {
                return value.toString().replace(/^\s*|\s$/g, '');
            }
            , ReplaceAll: function (String, StringReplace, StringReplaceTo) {
                /// <summary>
                ///     替换字符串中所有需要替换的字符串
                ///      1: " 字符串 ".Trim() 结果为 "字符串"
                /// </summary>
                /// <param name="StringReplace" type="string">
                ///     想要替换的字符串
                /// </param>
                /// <param name="StringReplaceTo" type="string">
                ///     用于替换的字符串
                /// </param>
                ///	<returns type="string"></returns>
                var _RegExp = new RegExp(StringReplace.replace(/([\(\)\[\]\{\}\^\$\+\-\*\?\.\"\'\|\/\\])/g, "\\$1"), "ig");
                return String.replace(_RegExp, StringReplaceTo);
            }
            , ToDateTime: function (value) {
                /// <summary>
                ///     1: ("2008-08-08 08:08:08").ToDate() - 字符转化为日期型。
                /// </summary>
                ///	<returns type="date" />
                var DateString = TL.String.Trim(value.toString());

                if (DateString.indexOf("/Date(") == 0 && DateString.lastIndexOf(")/") == DateString.length - 2) {
                    return eval('new ' + DateString.replace(/\//g, ''));
                };

                var Results = DateString.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) *$/);
                if (Results && Results.length > 3) {
                    return new Date(parseFloat(Results[1]), parseFloat(Results[2]) - 1, parseFloat(Results[3]));
                };
                Results = DateString.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2}) *$/);
                if (Results && Results.length > 6) {
                    return new Date(parseFloat(Results[1]), parseFloat(Results[2]) - 1, parseFloat(Results[3]), parseFloat(Results[4]), parseFloat(Results[5]), parseFloat(Results[6]));
                };
                Results = DateString.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2})\.(\d{1,9}) *$/);
                if (Results && Results.length > 7) {
                    return new Date(parseFloat(Results[1]), parseFloat(Results[2]) - 1, parseFloat(Results[3]), parseFloat(Results[4]), parseFloat(Results[5]), parseFloat(Results[6]), parseFloat(Results[7]));
                };
                return "";
            }
        }
        , DateTime: {
            AddYears: function (_DateTime, value) {
                /// <summary>
                ///     日期加 n年
                /// </summary>
                /// <param name="AddYearNumber" type="Int">
                ///     需要加的年数
                /// </param>
                ///	<returns type="date|string" />
                if (Object.prototype.toString.apply(_DateTime) == "[object Date]" && Object.prototype.toString.apply(value) == "[object Number]") {
                    _DateTime = new Date((_DateTime.getFullYear() + AddYearNumber), _DateTime.getMonth(), _DateTime.getDate(), _DateTime.getHours(), _DateTime.getMinutes(), _DateTime.getSeconds());
                };
                return _DateTime;
            }
            , AddMonths: function (_DateTime, value) {
                /// <summary>
                ///     日期加 n月
                /// </summary>
                /// <param name="value" type="Int">
                ///     需要加的月数
                /// </param>
                ///	<returns type="date|string" />
                if (Object.prototype.toString.apply(_DateTime) == "[object Date]" && Object.prototype.toString.apply(value) == "[object Number]") {
                    _DateTime = new Date(_DateTime.getFullYear(), (_DateTime.getMonth()) + value, _DateTime.getDate(), _DateTime.getHours(), _DateTime.getMinutes(), _DateTime.getSeconds());
                };
                return _DateTime;
            }
            , AddWeeks: function (_DateTime, value) {
                /// <summary>
                ///     日期加 n月
                /// </summary>
                /// <param name="AddWeekNumber" type="Int">
                ///     需要加的月数
                /// </param>
                ///	<returns type="date|string" />
                if (Object.prototype.toString.apply(_DateTime) == "[object Date]" && Object.prototype.toString.apply(value) == "[object Number]") {
                    _DateTime = new Date(Date.parse(_DateTime) + (86400000 * 7 * value));
                };
                return _DateTime;
            }
            , AddDays: function (_DateTime, value) {
                /// <summary>
                ///     日期加 n日
                /// </summary>
                /// <param name="AddDayNumber" type="Int">
                ///     需要加的日数
                /// </param>
                ///	<returns type="date|string" />
                if (Object.prototype.toString.apply(_DateTime) == "[object Date]" && Object.prototype.toString.apply(value) == "[object Number]") {
                    _DateTime = new Date(Date.parse(_DateTime) + (86400000 * value));
                };
                return _DateTime;
            }
            , AddHours: function (_DateTime, value) {
                /// <summary>
                ///     日期加 n小时
                /// </summary>
                /// <param name="AddHourNumber" type="Int">
                ///     需要加的小时数
                /// </param>
                ///	<returns type="date|string" />
                if (Object.prototype.toString.apply(_DateTime) == "[object Date]" && Object.prototype.toString.apply(value) == "[object Number]") {
                    _DateTime = new Date(Date.parse(_DateTime) + (3600000 * value));
                };
                return _DateTime;
            }
            , AddMinutes: function (_DateTime, value) {
                /// <summary>
                ///     日期加 n分钟
                /// </summary>
                /// <param name="AddMinuteNumber" type="Int">
                ///     需要加的分钟数
                /// </param>
                ///	<returns type="date|string" />
                if (Object.prototype.toString.apply(_DateTime) == "[object Date]" && Object.prototype.toString.apply(value) == "[object Number]") {
                    _DateTime = new Date(Date.parse(_DateTime) + (60000 * value));
                };
                return _DateTime;
            }
            , AddSeconds: function (_DateTime, value) {
                /// <summary>
                ///     日期加 n秒
                /// </summary>
                /// <param name="AddSecondNumber" type="Int">
                ///     需要加的秒数
                /// </param>
                ///	<returns type="date|string" />
                if (Object.prototype.toString.apply(_DateTime) == "[object Date]" && Object.prototype.toString.apply(value) == "[object Number]") {
                    _DateTime = new Date(Date.parse(_DateTime) + (1000 * value));
                };
                return _DateTime;
            }
            , ToString: function (_DateTime, format) {
                var result = null;
                if (TL.IsUndefinedOrNullOrEmpty(format)) {
                    format = "yyyy-MM-dd HH:mm:ss";
                };
                if (format == "UTCDateTime") {
                    ///  /Date(1311821221173+0800)/
                    result = "/Date(" + (TL.DateTime.AddHours(_DateTime, -8) - TL.ToDateTime("1970-01-01")) + "+0800)/";
                } else {
                    var o = {
                        "M+": _DateTime.getMonth() + 1,                                        //月份         
                        "d+": _DateTime.getDate(),                                             //日         
                        "h+": _DateTime.getHours() % 12 == 0 ? 12 : _DateTime.getHours() % 12, //12小时         
                        "H+": _DateTime.getHours(),                                            //24小时         
                        "m+": _DateTime.getMinutes(),                                          //分         
                        "s+": _DateTime.getSeconds(),                                          //秒         
                        "q+": Math.floor((_DateTime.getMonth() + 3) / 3),                      //季度         
                        "S": _DateTime.getMilliseconds()                                       //毫秒         
                    };
                    var week = {
                        "0": "/u65e5",
                        "1": "/u4e00",
                        "2": "/u4e8c",
                        "3": "/u4e09",
                        "4": "/u56db",
                        "5": "/u4e94",
                        "6": "/u516d"
                    };
                    if (/(y+)/.test(format)) {
                        format = format.replace(RegExp.$1, (_DateTime.getFullYear() + "").substr(4 - RegExp.$1.length));
                    };
                    if (/(E+)/.test(format)) {
                        format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
                    };
                    for (var k in o) {
                        if (new RegExp("(" + k + ")").test(format)) {
                            format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                        };
                    };
                    result = format;
                };
                return result;
            }
        }
        , ToString: function (value, format) {
            var result = null;
            if (!TL.IsUndefinedOrNullOrEmpty(value)) {
                switch (Object.prototype.toString.apply(value)) {
                    case "[object Date]":
                        result = TL.DateTime.ToString(value, format);
                        break;
                    case "[object Number]":
                        result = TL.Number.ToString(value, format);
                        break;
                    case "[object Boolean]":
                        result = TL.Number.ToString(value, format);
                        break;
                    default:
                        result = TL.JsonToString(value);
                        break;
                };
            } else {
                result = null;
            };
            return result;
        }
        , ToDateTime: function (value) {
            var result = null;
            if (!TL.IsUndefinedOrNullOrEmpty(value)) {
                switch (Object.prototype.toString.apply(value)) {
                    case "[object String]":
                        result = TL.String.ToDateTime(value);
                        break;
                    case "[object Number]":
                        result = TL.Number.ToDateTime(value);
                        break;
                    default:
                        result = value;
                        break;
                };
            } else {
                result = null;
            };
            return result;
        }
        , ToBoolean: function (value) {
            var result = false;
            if (!TL.IsUndefinedOrNullOrEmpty(value)) {
                switch (Object.prototype.toString.apply(value)) {
                    case "[object Boolean]":
                        result = TL.Boolean.ToBoolean(value);
                        break;
                    case "[object Number]":
                        result = TL.Number.ToBoolean(value);
                        break;
                    case "[object String]":
                        result = TL.String.ToBoolean(value);
                        break;
                    default:
                        result = false;
                        break;
                };
            } else {
                result = false;
            };
            return result;
        }
        , ToNumber: function (value) {
            var result = null;
            if (!TL.IsUndefinedOrNullOrEmpty(value)) {
                switch (Object.prototype.toString.apply(value)) {
                    case "[object Boolean]":
                        result = TL.Boolean.ToNumber(value);
                        break;
                    case "[object Number]":
                        result = TL.Number.ToNumber(value);
                        break;
                    case "[object String]":
                        result = TL.String.ToNumber(value);
                        break;
                };
            };
            return result;
        }
        , URL: {
            Parser: function (Url) {
                var UrlInfo = null;
                if (Url != undefined && Url != null) {
                    var Regex = /^((\w+):\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/;
                    var RegexArray = Regex.exec(Url);
                    if (RegexArray != undefined && RegexArray != null && RegexArray.length) {
                        UrlInfo = {};
                        var FieldChineseNameArray = ["地址", "", "协议", "", "用户名", "密码", "主机", "端口", "路径", "查询字符串", "锚点"];
                        var FieldNameArray = ["Url", "", "ProtocolName", "UsernamePassword", "Username", "Password", "Hostname", "Port", "Pathname", "QueryString", "Fragment"];
                        for (var i = 0; i < RegexArray.length; i++) {
                            UrlInfo[FieldNameArray[i]] = RegexArray[i];
                        };
                        if (UrlInfo.UsernamePassword == undefined || UrlInfo.UsernamePassword == null) {
                            UrlInfo.UsernamePassword = "";
                        };
                        UrlInfo.Protocol = UrlInfo.ProtocolName + ":";
                        UrlInfo.Host = UrlInfo.Hostname + ":" + UrlInfo.Port;
                        UrlInfo.Hash = "#" + UrlInfo.Fragment;
                        UrlInfo.Search = "?" + UrlInfo.QueryString;
                    };
                };
                return UrlInfo;
            }
            , GetData: function (Url) {
                var Data = {};
                if (Url == undefined) {
                    Url = window.location.href;
                };
                var UrlInfo = TL.URL.Parser(Url);
                if (!TL.IsUndefinedOrNullOrEmpty(UrlInfo.QueryString)) {
                    var KeyValueArrayStringArray = UrlInfo.QueryString.split('&');
                    for (var i = 0; i < KeyValueArrayStringArray.length; i++) {
                        var KeyValueArrayString = KeyValueArrayStringArray[i];
                        if (!TL.IsUndefinedOrNullOrEmpty(KeyValueArrayString)) {
                            var KeyValueArray = KeyValueArrayString.split('=');
                            if (KeyValueArray.length > 1) {
                                Data[KeyValueArray[0]] = decodeURIComponent(KeyValueArray[KeyValueArray.length - 1]);
                            };
                        };
                    };
                };
                return Data;
            }
            , AddData: function (Url, AddData) {
                if (Url == undefined) {
                    Url = window.location.href;
                };
                var Data = TL.URL.GetData(Url);
                $.extend(Data, AddData);
                var Index = Url.indexOf("?");
                if (Index > -1) {
                    Url = Url.substring(0, Index);
                };
                var Parameters = TL.String.ReplaceAll($.param(Data), "+", "%20");
                if (Parameters.length > 0) {
                    Url += ("?" + Parameters);
                };
                return Url;
            }
        }
        , _Guid: 1
        , Guid: function () {
            return TL._Guid++;
        }
        , Event: function (Name, Event) {
            if (!TL.IsUndefinedOrNullOrEmpty(Name)) {
                if (!TL.IsUndefinedOrNullOrEmpty(Event)) {
                    $(window).data("TLEvent_" + Name, Event);
                } else {
                    return $(window).data("TLEvent_" + Name);
                };
            };
        }
        , RemoveEvent: function (Name) {
            if (!TL.IsUndefinedOrNullOrEmpty(Name)) {
                $(window).removeData("TLEvent_" + Name);
            };
        }
        , PopupOpen: function (Properties) {
            var WindowWidth = $(window).width();
            var WindowHeight = $(window).height();
            var Settings = {
                Selector: null
                , Guid: null
                , Top: WindowHeight / 2 - 100
                , Left: WindowWidth / 2 - 150
                , Width: 300
                , Height: 200

            };
            if (TL.IsUndefinedOrNullOrEmpty(Properties)) {
                Properties = {}
            };
            $.extend(Settings, Properties);
            var PopupJQ = null;
            var CreatePopup = function (Guid) {
                var divJQ = $("<div class=\"TL_Popup\" style=\"position: absolute;\"></div>").appendTo("body").hide();
                divJQ.data("HideFunction", function (Event) {
                    var Element = Event.target;
                    while (Element) {
                        if ($(Element).is(PopupJQ)) {
                            Event.stopPropagation();
                            return;
                        };
                        Element = Element.parentElement;
                    };
                    if (!PopupJQ.data("IsFirstOpen")) {
                        TL.PopupClose(Settings.Guid);
                    } else {
                        PopupJQ.data("IsFirstOpen", false);
                    };
                });
                return divJQ;
            };

            if (!TL.IsUndefinedOrNullOrEmpty(Settings.Guid)) {
                PopupJQ = TL["_Popup_" + Settings.Guid];
                if (PopupJQ == undefined) {
                    PopupJQ = CreatePopup(Settings.Guid);
                    TL["_Popup_" + Settings.Guid] = PopupJQ;
                };
            } else {
                if (TL["_Popup_"] == undefined) {
                    TL["_Popup_"] = CreatePopup();
                };
                PopupJQ = TL["_Popup_"];
            };
            PopupJQ.css({ top: "999999999px", left: "999999999px" }).show();

            $(document).on("click", PopupJQ.data("HideFunction"));
            PopupJQ.data("IsFirstOpen", true);

            var SelectorJQ = $(Settings.Selector);
            if (SelectorJQ.length > 0) {
                var OuterWidth = SelectorJQ.outerWidth();
                var OuterHeight = SelectorJQ.outerHeight();
                var Offset = SelectorJQ.offset();
                var PopupMaxWidth = WindowWidth;
                var PopupMaxHeight = (WindowHeight - OuterHeight - 1) / 2;
                if (Settings.Width < 0) {
                    Settings.Width = OuterWidth - TL.GetExcludeContentWidth(PopupJQ);
                };
                if (Settings.Width > PopupMaxWidth) {
                    Settings.Width = PopupMaxWidth - TL.GetExcludeContentWidth(PopupJQ);
                };
                if (Settings.Height < 0) {
                    Settings.Height = 200;
                };
                if (Settings.Height > PopupMaxHeight) {
                    Settings.Height = PopupMaxHeight;
                };
                if (WindowWidth - Offset.left > Settings.Width) {
                    //右边的空间够显示弹出框
                    Settings.Left = Offset.left;
                } else {
                    //右边的空间不够显示弹出框,在左边显示
                    Settings.Left = Offset.left - (Settings.Width - (WindowWidth - Offset.left)) - (TL.GetExcludeContentWidth(PopupJQ) + 1) / 2 - 1;
                };
                if (WindowHeight - Offset.top - OuterHeight > Settings.Height) {
                    //下面的空间够显示弹出框
                    Settings.Top = Offset.top + OuterHeight + 1;
                } else {
                    //下面的空间不够显示弹出框,在上面显示
                    Settings.Top = Offset.top - Settings.Height - (TL.GetExcludeContentHeight(PopupJQ) + 1) / 2 - 1;
                };
            };
            PopupJQ.css({
                top: Settings.Top + "px"
                , left: Settings.Left + "px"
                , width: Settings.Width + "px"
                , height: Settings.Height + "px"
            });
            return PopupJQ;
        }
        , PopupClose: function (Guid) {
            var PopupJQ = $();
            if (!TL.IsUndefinedOrNullOrEmpty(Guid)) {
                PopupJQ = $(TL["_Popup_" + Guid]);
            } else {
                PopupJQ = $(TL["_Popup_"]);
            };
            PopupJQ.hide();
            $(document).off("click", PopupJQ.data("HideFunction"));
            return PopupJQ;
        }
        , IsPopupOpened: function (Guid) {
            var IsOpened = false;
            if (!TL.IsUndefinedOrNullOrEmpty(Guid)) {
                if (TL["_Popup_" + Guid] != undefined) {
                    IsOpened = TL["_Popup_" + Guid].is(":visible");
                };
            } else {
                if (TL["_Popup_"] != undefined) {
                    IsOpened = TL["_Popup_"].is(":visible");
                };
            };
            return IsOpened;
        }
        , Debug: {
            ShowDateTime: function () {
                var divJQ = $("#divDebug_ShowDateTime");
                if (divJQ.length < 1) {
                    divJQ = $("<div id=\"divDebug_ShowDateTime\"></div>").prependTo("body");
                };
                divJQ.html(TL.ToString(new Date()));
            }
            , AddInfo: function (str) {
                var divJQ = $("#divDebug_AddInfo");
                if (divJQ.length < 1) {
                    divJQ = $("<div id=\"divDebug_AddInfo\"></div>").prependTo("body");
                    TL.Layout.Init({
                        Selector: divJQ
                        , HorizontalAlignment: TL.Data.HorizontalAlignment.Left
                        , VerticalAlignment: TL.Data.VerticalAlignment.Stretch
                        , Top: 0
                        , Bottom: 0
                        , Left: 0
                        , Width: 150
                        , IsForeverLayout: true
                    });
                };
                $("<div>" + str + "</div>").appendTo(divJQ);
            }
        }
        , _ResizeDelay: 0
        , Data: {
            // 摘要:
            //     指示应在哪里将元素显示在与父元素的已分配布局槽相对的水平轴上。
            HorizontalAlignment: {
                // 摘要:
                //     与父元素布局槽的左侧对齐的元素。
                Left: 0,
                //
                // 摘要:
                //     与父元素布局槽的中心对齐的元素。
                Center: 1,
                //
                // 摘要:
                //     与父元素布局槽的右侧对齐的元素。
                Right: 2,
                //
                // 摘要:
                //     拉伸以填充整个父元素布局槽的元素。
                Stretch: 3
            }
            // 摘要:
            //     描述如何在父级布局槽内垂直地定位或拉伸子元素。
            , VerticalAlignment: {
                // 摘要:
                //     元素与父级布局槽的顶端对齐。
                Top: 0,
                //
                // 摘要:
                //     元素与父级布局槽的中心对齐。
                Center: 1,
                //
                // 摘要:
                //     元素与父级布局槽的底端对齐。
                Bottom: 2,
                //
                // 摘要:
                //     元素被拉伸以填充整个父元素的布局槽。
                Stretch: 3
            }
            // 摘要:
            //     描述iframe标签的滚动条状态。
            , IframeScrolling: {
                // 摘要:
                //     无滚动条。
                No: "no",
                //
                // 摘要:
                //     有滚动条。
                Yes: "yes"
            }
            // 摘要:
            //     元素被关闭显示时采用的类型。
            , CloseType: {
                //
                // 摘要:
                //     永久移除。
                Remove: 0
                // 摘要:
                //     隐藏。
                , Hidden: 1
            }
            // 摘要:
            //     设备类型
            , DeviceType: {
                //
                // 摘要:
                //     台式电脑。
                PC: "PC",
                //
                // 摘要:
                //     iPhone。
                iPhone: "iPhone",
                //
                // 摘要:
                //     iPad。
                iPad: "iPad"
            }
            // 摘要:
            //     数据的排序方式。
            , SortType: {
                //
                // 摘要:
                //     默认。
                Inherit: "-1",
                //
                // 摘要:
                //     顺序。
                Asc: "0",
                //
                // 摘要:
                //     倒序。
                Desc: "1"
            }
            // 摘要:
            //     指定控件或控件元素的方向。
            , Orientation: {
                // 摘要:
                //     水平放置控件或元素。
                Horizontal: 0,
                //
                // 摘要:
                //     垂直放置控件或元素。
                Vertical: 1
            }
            // 摘要:
            //     指定 System.Windows.Forms.SplitContainer.Panel1 或 System.Windows.Forms.SplitContainer.Panel2
            //     是固定的，或者两个面板都不是固定的。
            , FixedPanel: {
                // 摘要:
                //     指定 System.Windows.Forms.SplitContainer.Panel1 和 System.Windows.Forms.SplitContainer.Panel2
                //     都不是固定的。System.Windows.Forms.Control.Resize 事件对这两个面板都会有影响。
                None: 0,
                //
                // 摘要:
                //     指定 System.Windows.Forms.SplitContainer.Panel1 是固定的。System.Windows.Forms.Control.Resize
                //     事件只影响 System.Windows.Forms.SplitContainer.Panel2。
                Panel1: 1,
                //
                // 摘要:
                //     Specifies that System.Windows.Forms.SplitContainer.Panel2 is fixed.System.Windows.Forms.Control.Resize
                //     事件只影响 System.Windows.Forms.SplitContainer.Panel1。
                Panel2: 2
            }
            // 摘要:
            //     浏览器所有的产品。
            , BrowserProductNames: {
                // 摘要:
                //     QQ
                QQBrowser: "QQBrowser",
                // 摘要:
                //     Safari、Chrome、360
                Safari: "Safari",
                // 摘要:
                //     Firefox
                Firefox: "Firefox",
                // 摘要:
                //     IE
                MSIE: "MSIE"
            }
            // 摘要:
            //     提供有关浏览器的常规信息，例如名称、版本和操作系统。
            , BrowserInformation: {
                // 摘要:
                //     获取当前浏览器所基于的浏览器技术的版本。
                //
                // 返回结果:
                //     基础浏览器技术的版本。
                Version: {}
                //
                // 摘要:
                //     获取一个值，该值指示浏览器是否支持 Cookie。
                //
                // 返回结果:
                //     如果浏览器支持 Cookie，则为 true；否则为 false。
                , CookiesEnabled: true
                //
                // 摘要:
                //     获取当前浏览器所基于的浏览器技术的名称。
                //
                // 返回结果:
                //     基础浏览器技术的名称。
                , Name: null
                //
                // 摘要:
                //     获取浏览器操作系统的名称。
                //
                // 返回结果:
                //     运行浏览器的操作系统的名称。
                , Platform: null
                //
                // 摘要:
                //     获取浏览器的产品名称。
                //
                // 返回结果:
                //     浏览器的产品名称。
                , ProductName: null
                //
                // 摘要:
                //     获取浏览器的产品版本号。
                //
                // 返回结果:
                //     浏览器的产品版本号。
                , ProductVersion: null
                //
                // 摘要:
                //     获取浏览器的用户代理字符串。
                //
                // 返回结果:
                //     标识浏览器的用户代理字符串。
                , UserAgent: null
            }
            // 摘要:
            //     指定定义哪个鼠标按钮曾按下的常数。
            , MouseButtons: {
                // 摘要:
                //     未曾按下鼠标按钮。
                None: 0,
                //
                // 摘要:
                //     鼠标左按钮曾按下。
                Left: 1,
                //
                // 摘要:
                //     鼠标右按钮曾按下。
                Right: 2,
                //
                // 摘要:
                //     鼠标中按钮曾按下。
                Middle: 4,
                //
                // 摘要:
                //     第 1 个 XButton 曾按下。
                XButton1: 5,
                //
                // 摘要:
                //     第 2 个 XButton 曾按下。
                XButton2: 6
            }
        }
    };

    window.TL = TL;

    TL.Data.BrowserInformation.CookiesEnabled = window.navigator.cookieEnabled;
    TL.Data.BrowserInformation.Name = window.navigator.appName;
    TL.Data.BrowserInformation.Platform = window.navigator.platform;
    TL.Data.BrowserInformation.UserAgent = window.navigator.userAgent;
    if (window.navigator.userAgent.indexOf("QQBrowser") > -1) {
        TL.Data.BrowserInformation.ProductName = TL.Data.BrowserProductNames.QQBrowser;
        TL.Data.BrowserInformation.ProductVersion = "8.0";
    } else if (window.navigator.userAgent.indexOf("Safari") > -1) {
        TL.Data.BrowserInformation.ProductName = TL.Data.BrowserProductNames.Safari;
        TL.Data.BrowserInformation.ProductVersion = "8.0";
    } else if (window.navigator.userAgent.indexOf("Firefox") > -1) {
        TL.Data.BrowserInformation.ProductName = TL.Data.BrowserProductNames.Firefox;
        TL.Data.BrowserInformation.ProductVersion = "8.0";
    } else if (window.navigator.userAgent.indexOf("MSIE") > -1) {
        TL.Data.BrowserInformation.ProductName = TL.Data.BrowserProductNames.MSIE;
        TL.Data.BrowserInformation.ProductVersion = "8.0";
    } else {
        var alertString = "";
        alertString += "出错：[80FD5CB2-3887-45CB-94B7-0FBE41FAEA9B]";
        alertString += TL.AlertNewline;
        alertString += "文件：TL.Min.js";
        alertString += TL.AlertNewline;
        alertString += "建议添加对该浏览器的判断";
        alertString += TL.AlertNewline;
        alertString += TL.Data.BrowserInformation.UserAgent;
        alert(alertString);
    };

    //根据浏览器的类型以及版本，设置该浏览器对鼠标按钮常数
    switch (TL.Data.BrowserInformation.ProductName) {
        case TL.Data.BrowserProductNames.QQBrowser:
            TL.Data.MouseButtons.Left = 0;
            TL.Data.MouseButtons.Right = 2;
            TL.Data.MouseButtons.Center = 1;
            break;
        case TL.Data.BrowserProductNames.Safari:
            TL.Data.MouseButtons.Left = 0;
            TL.Data.MouseButtons.Right = 2;
            TL.Data.MouseButtons.Center = 1;
            break;
        case TL.Data.BrowserProductNames.Firefox:
            TL.Data.MouseButtons.Left = 0;
            TL.Data.MouseButtons.Right = 2;
            TL.Data.MouseButtons.Center = 1;
            break;
        case TL.Data.BrowserProductNames.MSIE:
            TL.Data.MouseButtons.Left = 1;
            TL.Data.MouseButtons.Right = 2;
            TL.Data.MouseButtons.Center = 4;
            break;
        default:
            var alertString = "";
            alertString += "出错：[198A7D9A-1C70-4513-B353-3366A1824B35]";
            alertString += TL.AlertNewline;
            alertString += "文件：TL.Min.js";
            alertString += TL.AlertNewline;
            alertString += "建议添加对该浏览器的鼠标按钮常数的设置";
            alertString += TL.AlertNewline;
            alert(alertString);
            break;
    };

    if (window.VirtualDirectory != undefined) {
        TL.VirtualDirectory = window.VirtualDirectory;
    };

    if (window.WebSiteRootDirectoryURL != undefined) {
        TL.WebSiteRootDirectoryURL = window.WebSiteRootDirectoryURL;
    } else {
        //TL.WebSiteRootDirectoryURL = window.location.protocol + "//" + window.location.host + "/" + (TL.IsUndefinedOrNullOrEmpty(TL.VirtualDirectory) ? "" : (TL.VirtualDirectory + "/"));
        //TL.WebSiteRootDirectoryURL = TL.String.ReplaceAll(window.location.href, window.location.pathname, "/");
        //TL.WebSiteRootDirectoryURL = "D:\\我的项目\\TLUI1\\Project\\TL.WebApplication\\";
        TL.WebSiteRootDirectoryURL = window.location.href.substring(0, window.location.href.toLowerCase().indexOf("/web/")) + "/";
    };

    var ScriptNameArray = [
        "ContextMenuStrip"
        , "DataGridView"
        , "Form"
        , "Json"
        , "Layout"
        , "Menu"
        , "Pager"
        , "SplitContainer"
        , "TabControl"
        , "Toolbar"
        , "TreeView"
        , "Window"
    ];
    //document.write("<link href=\"" + TL.WebSiteRootDirectoryURL + "Web/Styles/Default/TL/TL.Min.css\" rel=\"stylesheet\" type=\"text/css\" />");
    for (var i in ScriptNameArray) {
        var ScriptName = ScriptNameArray[i];
        document.write("<link href=\"" + TL.WebSiteRootDirectoryURL + "Resources/Styles/Default/TL/" + ScriptName + "/TL." + ScriptName + ".Min.css\" rel=\"stylesheet\" type=\"text/css\" />");
        document.write("<script src=\"" + TL.WebSiteRootDirectoryURL + "Resources/Scripts/TL/" + ScriptName + "/TL." + ScriptName + ".Min.js\" type=\"text/javascript\"></script>");
    };

})(window);

