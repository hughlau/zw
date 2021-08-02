String.prototype.Trim = function () {
    /// <summary>
    ///     1: (" sdfd ").Trim() - 字符串去空格。
    /// </summary>
    ///	<returns type="string" />
    return this.replace(/(^\s*)|(\s*$)/g, "");
    return this.replace(/^\s*|\s*$/g, '');
};
String.prototype.Remove00 = function (InString) {
    var OutString = InString;

    while (OutString.length >= 2 && OutString.substr(OutString.length - 2, 2) == "00") {
        OutString = OutString.substr(0, OutString.length - 2);
    }
    return OutString;
};

String.prototype.ReplaceAll = function (StringReplace, StringReplaceTo) {
    var _RegExp = new RegExp(StringReplace.replace(/([\(\)\[\]\{\}\^\$\+\-\*\?\.\"\'\|\/\\])/g, "\\$1"), "ig");
    return this.replace(_RegExp, StringReplaceTo);
};
String.prototype.ToString = function (FormatString) {
    /// <summary>
    ///     1: (" sdfd ").ToString() - 直接返回字符串。
    /// </summary>
    ///	<returns type="string" />
    if (FormatString != undefined) {
        if (FormatString == "UTCDateTime") {
            return null;
        };
    };
    return this;
};
String.prototype.isInChinese = function () {
    /// <summary>
    ///     是否包含汉字
    /// </summary>
    ///	<returns type="boolean" />
    return (this.length != this.replace(/[^\x00-\xff]/g, "**").length);
};
String.prototype.IntervalDays = function () {
    /// <summary>
    ///     1: Date.ToString("yyyy-MM-dd") - 日期格式化为字符串。
    /// </summary>
    /// <param name="FormatString" type="string">
    ///     用户格式化日期的字符串 yyyy-MM-dd HH:mm:ss
    /// </param>
    ///	<returns type="string" />
    return "";
};
String.prototype.NumberToSubOrSupNumber = function () {
    /// <summary>
    ///     1: ("SO2 ").NumberToSubOrSupNumber() - 将字符串里的数字转化成上下标的形式。
    /// </summary>
    ///	<returns type="string" />
    var ValueString = this.Trim();

    //类似1,2-二氯丙烷则不转化
    var array = ValueString.split('-');
    if (array.length > 1 && array[1].substring(0, 1).isInChinese()) {
        return ValueString;
    };

    var s = "";
    var Result = "";

    for (var i = 0; i < ValueString.length; i++) {
        var char = ValueString.substring(i, i + 1);
        if (char == "/") {
            Result += char;
            continue;
        }
        if (char == "-") {   //"-"后的数字不转化
            Result += ValueString.substring(i, ValueString.length);
            return Result;
        }
        if (!isNaN(char + "0")) {
            s += char;
            if (i < ValueString.length - 1 && ValueString.substring(i + 1, i + 2) != "-")
                continue;
        };
        if (s.length > 0 && !isNaN(s)) {
            if (ValueString.indexOf("/") > -1 && i > ValueString.indexOf("/")) {
                Result += "<sup>" + s + "</sup>";
            } else {
                Result += "<sub>" + s + "</sub>";
            };
            s = "";
            if (isNaN(char + "0")) {
                Result += char;
            };
        } else {
            Result += char;
        };
    };
    return Result;
};
String.prototype.ToJsonString = function () {
    /// <summary>
    ///     1: ("sdf'dfs ").ToJsonString() - 替换字符串里的一些特殊字符，使其符合Json字符串格式。
    /// </summary>
    ///	<returns type="string" />
    return this.replace(/'/g, "\\'");
};

String.prototype.ToList = function (Separator) {
    /// <summary>
    ///     1: ("sdf'dfs ").ToJsonString() - 替换字符串里的一些特殊字符，使其符合Json字符串格式。
    /// </summary>
    ///	<returns type="string" />
    if (Separator == undefined) {
        Separator = ",";
    };
    var ValueString = this.Trim();
    if (ValueString.length > 0) {
        return ValueString.split(Separator);
    } else {
        return undefined;
    };
};

String.prototype.ToNumber = function () {
    /// <summary>
    ///     1: ("sdf'dfs ").ToJsonString() - 替换字符串里的一些特殊字符，使其符合Json字符串格式。
    /// </summary>
    ///	<returns type="string" />
    var NumberValue = Number(this);
    if (isNaN(NumberValue)) {
        NumberValue = this;
    };
    return NumberValue;
};

String.prototype.ToBoolean = function (DefaultValue) {
    /// <summary>
    ///     1: ("sdf'dfs ").ToJsonString() - 替换字符串里的一些特殊字符，使其符合Json字符串格式。
    /// </summary>
    ///	<returns type="string" />
    var BooleanString = this.Trim().toLowerCase();
    var BooleanValue;
    switch (BooleanString) {
        case "true":
            BooleanValue = true;
            break;
        case "1":
            BooleanValue = true;
            break;
        case "false":
            BooleanValue = false;
            break;
        case "0":
            BooleanValue = false;
            break;
        default:
            BooleanValue = DefaultValue;
            break;
    };
    return BooleanValue;
};

String.prototype.DealWithSpecialCharacters = function () {
    /// <summary>
    ///     1: ("%'").DealWithSpecialCharacters() - 替换字符串里的一些特殊字符，符合SQL查询。
    /// </summary>
    ///	<returns type="string" />
    var ResultValue = this;
    if (ResultValue != null && ResultValue != "") {
        ResultValue = ResultValue.Trim()
        ResultValue = ResultValue.replace(/\[/g, "[[]");
        ResultValue = ResultValue.replace(/\%/g, "[%]");
        ResultValue = ResultValue.replace(/\_/g, "[_]");
        //ResultValue = ResultValue.replace(/\^/g, "[^]"); 这个不需要处理
    }
    return ResultValue;
};

String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}

Array.prototype.indexOf = function (val, fn) {
    if ($.isFunction(fn)) {
        for (var i = 0; i < this.length; i++) {
            if (fn.call(this, this[i], val)) {
                return i;
            };
        };
    } else {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) {
                return i;
            };
        };
    }
    return -1;
};
Array.prototype.remove = function (obj) {
    var index = this.indexOf(obj);
    if (index > -1) {
        this.splice(index, 1);
    };
};
Array.prototype.Contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        };
    };
    return false;
};
Array.prototype.Search = function (fn) {
    for (var prop in this) {
        if (fn.call(this, this[prop])) {
            return this[prop];
        }
    }
    return null
};
Array.prototype.Clone = function () {
    var newArray = [];
    for (var property in this) {
        newArray[property] = $.isArray(this[property]) ? this[property].Clone() : this[property];
    };
    return newArray;
};

Number.prototype.ToNumber = function () {
    return this;
};

Number.prototype.ToString = function (FormatString) {
    /// <summary>
    ///     1: (333.2345).ToString("###.000")=333.234 - 数字格式化为字符串。
    ///     2: (0.2365).ToString("#%")=24% - 数字格式化为字符串。
    /// </summary>
    /// <param name="FormatString" type="string">
    ///     用户格式化数字的字符串
    /// </param>
    ///	<returns type="string" />
    NumberValue = this;
    var re = /%/;
    if (re.test(FormatString)) {
        NumberValue = NumberValue * 100;
    };

    var patterns = FormatString.split(".");
    var numbers = (NumberValue + "").split(".");
    var lpatterns = patterns[0].split("");
    var lpatternsbak = patterns[0].split("");

    var lkeep = "";
    var rkeep = "";

    //小数点后大于样式长度进行四舍五入
    if (numbers[1]) {
        var rnumbers = numbers[1].split("");
        var count = 0;
        if (patterns[1]) {
            var rpatterns = patterns[1].split("");
            for (var i = 0; i < rpatterns.length; i++) {
                if (rpatterns[i] == "#" || rpatterns[i] == "0") {
                    count++;
                };
            };
        };
        if (rnumbers.length > count) {
            numbers = (NumberValue.toFixed(count) + "").split(".");
        };

    };
    var lnumbers = numbers[0].split("");

    //得到左侧要替换的部分 
    var lplaces = [];
    for (var i = 0; i < lpatterns.length; i++) {
        var parternchar = lpatterns[i];
        if (parternchar == "#" || parternchar == "0") {
            lplaces.push(i);
        };
    };

    //替换左侧，左侧有数字才要替换，以避免v = .99型的数字而产生错误 
    if (lnumbers[0] && lnumbers[0].length > 0) {
        var numberIndex = lnumbers.length - 1;
        var replaced = 0;
        for (var i = lplaces.length - 1; i >= 0; i--) {
            replaced++;    //被替换的字符数量 
            var place = lplaces[i];
            lpatterns[place] = lnumbers[numberIndex];
            if (numberIndex == 0) {
                break;
            };
            numberIndex--;
        };

        //处理以#为第一个格式（#前可能有非0的其他串也在此范围）的格式串，对于以#开头的格式串，将不会截取数字串，要补齐 
        var lstartIdx = lplaces[0];

        //补漏
        var nlen = lnumbers.length;
        var plen = lplaces.length;
        if (nlen > plen) {
            lpatternsbak.splice(lstartIdx, 0, "#");
        };

        if (lpatternsbak[lstartIdx] == "#") {
            if (lnumbers.length > replaced) {
                var idx = lnumbers.length - replaced;
                for (var i = 0; i < idx; i++) {
                    lkeep += lnumbers[i];
                };
                lpatterns[lstartIdx] = lkeep + lpatterns[lstartIdx];
            };
        };
    };

    //替换右侧 
    if (patterns[1] && patterns[1].length > 0) {
        var rpatterns = patterns[1].split("");
        if (numbers[1] && numbers[1].length > 0) {
            var rnumbers = numbers[1].split("");

            //得到右侧将要替换的部分 
            var rplaces = [];
            for (var i = 0; i < rpatterns.length; i++) {
                var parternchar = rpatterns[i];
                if (parternchar == "#" || parternchar == "0") {
                    rplaces.push(i);
                };
            };

            var replaced = 0;
            for (var i = 0; i < rplaces.length; i++) {
                replaced++;    //被替换的字符数量 
                var place = rplaces[i];
                rpatterns[place] = rnumbers[i];
                if (i == rnumbers.length - 1) {
                    break;
                };
            };

        };
    };

    for (var i = 0; i < lpatterns.length; i++) {
        if (lpatterns[i] == "#") {
            lpatterns[i] = "";
        };
    };

    var result = lpatterns.join("");
    if (patterns[1]) {
        for (var i = 0; i < rpatterns.length; i++) {
            if (rpatterns[i] == "#") {
                rpatterns[i] = "";
            };
        };
        result += "." + rpatterns.join("");
    };

    //第一位不能为,号 
    if (result.substring(0, 1) == ",") {
        result = result.substring(1);
    };

    //最后一位也不能为,号 
    if (result.substring(result.length - 1) == ",") {
        result = result.substring(0, result.length);
    };

    if (result == FormatString) {
        result = "";
    };

    return result;
};

Number.prototype.ToBoolean = function (DefaultValue) {
    /// <summary>
    ///     1: ("sdf'dfs ").ToJsonString() - 替换字符串里的一些特殊字符，使其符合Json字符串格式。
    /// </summary>
    ///	<returns type="string" />
    var BooleanValue;
    switch (Number) {
        case 1:
            BooleanValue = true;
            break;
        case 0:
            BooleanValue = true;
            break;
        default:
            BooleanValue = DefaultValue;
            break;
    };
    return BooleanValue;
};

String.prototype.ToDate = function () {
    /// <summary>
    ///     1: ("2008-08-08 08:08:08").ToDate() - 字符转化为日期型。
    /// </summary>
    ///	<returns type="date" />
    var DateString = this.toString().Trim();

    if (DateString.indexOf("/Date(") == 0 && DateString.lastIndexOf(")/") == DateString.length - 2) {
        return eval('new ' + DateString.replace(/\//g, ''));
    };

    var Results = DateString.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) *$/);
    if (Results && Results.length > 3) {
        return new Date(parseFloat(Results[1]), parseFloat(Results[2]) - 1, parseFloat(Results[3]));
    };
    var Results = DateString.match(/^ *(\d{4})\/(\d{1,2})\/(\d{1,2}) *$/);
    if (Results && Results.length > 3) {
        return new Date(parseFloat(Results[1]), parseFloat(Results[2]) - 1, parseFloat(Results[3]));
    };
    Results = DateString.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2}) *$/);
    if (Results && Results.length > 6) {
        return new Date(parseFloat(Results[1]), parseFloat(Results[2]) - 1, parseFloat(Results[3]), parseFloat(Results[4]), parseFloat(Results[5]), parseFloat(Results[6]));
    };
    Results = DateString.match(/^ *(\d{4})\/(\d{1,2})\/(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2}) *$/);
    if (Results && Results.length > 6) {
        return new Date(parseFloat(Results[1]), parseFloat(Results[2]) - 1, parseFloat(Results[3]), parseFloat(Results[4]), parseFloat(Results[5]), parseFloat(Results[6]));
    };
    Results = DateString.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2})\.(\d{1,9}) *$/);
    if (Results && Results.length > 7) {
        return new Date(parseFloat(Results[1]), parseFloat(Results[2]) - 1, parseFloat(Results[3]), parseFloat(Results[4]), parseFloat(Results[5]), parseFloat(Results[6]), parseFloat(Results[7]));
    };
    Results = DateString.match(/^ *(\d{4})\/(\d{1,2})\/(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2})\.(\d{1,9}) *$/);
    if (Results && Results.length > 7) {
        return new Date(parseFloat(Results[1]), parseFloat(Results[2]) - 1, parseFloat(Results[3]), parseFloat(Results[4]), parseFloat(Results[5]), parseFloat(Results[6]), parseFloat(Results[7]));
    };
    return "";
};
Date.IntervalDays = function (FromDateString, ToDateString) {
    var FromDate = FromDateString.ToString("yyyy-MM-dd").ToDate();
    var ToDate = ToDateString.ToString("yyyy-MM-dd").ToDate();
    return parseInt((ToDate - FromDate) / 86400000);
};
Date.prototype.ToString = function (FormatString) {
    /// <summary>
    ///     1: Date.ToString("yyyy-MM-dd") - 日期格式化为字符串。
    /// </summary>
    /// <param name="FormatString" type="string">
    ///     用户格式化日期的字符串 yyyy-MM-dd HH:mm:ss
    /// </param>
    ///	<returns type="string" />
    if (typeof this == "string") {
        return "";
    };
    if (FormatString == undefined) {
        FormatString = "yyyy-MM-dd HH:mm:ss";
    };

    if (FormatString == "UTCDateTime") {
        ///  /Date(1311821221173+0800)/
        return "/Date(" + (this.AddHour(-8) - "1970-01-01".ToDate()) + "+0800)/";
    };

    var yyyy = this.getFullYear();
    var MM = this.getMonth() + 1;
    if (MM < 1) {
        MM = 12;
        yyyy -= 1;
    };
    var yy = yyyy.toString().substring(2, 4);
    MM = MM > 9 ? MM : "0" + MM;
    var dd = this.getDate();
    dd = dd > 9 ? dd : "0" + dd;
    var HH = this.getHours();
    HH = HH > 9 ? HH : "0" + HH;
    var mm = this.getMinutes();
    mm = mm > 9 ? mm : "0" + mm;
    var ss = this.getSeconds();
    ss = ss > 9 ? ss : "0" + ss;
    var ms = 000;
    ms = ms > 99 ? ms : (ms > 9 ? "0" + ms : "00" + ms);
    return FormatString.replace(/yyyy/g, yyyy).replace(/yy/g, yy).replace(/MM/g, MM).replace(/dd/g, dd).replace(/HH/g, HH).replace(/mm/g, mm).replace(/ss/g, ss).replace(/ms/g, ms);
};
Date.prototype.ToUTCDateTime = function () {
    /// <summary>
    ///     1: Date.ToUTCDateTime() - 日期格式化为UTC时间。
    /// </summary>
    ///	<returns type="Int64" />
    return (this - "1970-01-01".ToDate());
};
Date.prototype.IntervalDays = function () {
    /// <summary>
    ///     1: Date.ToString("yyyy-MM-dd") - 日期格式化为字符串。
    /// </summary>
    /// <param name="FormatString" type="string">
    ///     用户格式化日期的字符串 yyyy-MM-dd HH:mm:ss
    /// </param>
    ///	<returns type="string" />
    return parseInt((this.ToString("yyyy-MM-dd").ToDate() - (new Date()).ToString("yyyy-MM-dd").ToDate()) / 86400000);
};
Date.prototype.AddYear = function (AddYearNumber) {
    /// <summary>
    ///     日期加 n年
    /// </summary>
    /// <param name="AddYearNumber" type="Int">
    ///     需要加的年数
    /// </param>
    ///	<returns type="date|string" />
    if (typeof AddYearNumber == 'number') {
        return new Date((this.getFullYear() + AddYearNumber), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds());
    };
    return "";
};
Date.prototype.AddMonth = function (AddMonthNumber) {
    /// <summary>
    ///     日期加 n月
    /// </summary>
    /// <param name="AddMonthNumber" type="Int">
    ///     需要加的月数
    /// </param>
    ///	<returns type="date|string" />
    if (typeof AddMonthNumber == 'number') {
        return new Date(this.getFullYear(), (this.getMonth()) + AddMonthNumber, this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds());
    };
    return "";
};
Date.prototype.AddWeek = function (AddWeekNumber) {
    /// <summary>
    ///     日期加 n月
    /// </summary>
    /// <param name="AddWeekNumber" type="Int">
    ///     需要加的月数
    /// </param>
    ///	<returns type="date|string" />
    if (typeof AddWeekNumber == 'number') {
        return new Date(Date.parse(this) + (86400000 * 7 * AddWeekNumber));
    };
    return "";
};
Date.prototype.AddDay = function (AddDayNumber) {
    /// <summary>
    ///     日期加 n日
    /// </summary>
    /// <param name="AddDayNumber" type="Int">
    ///     需要加的日数
    /// </param>
    ///	<returns type="date|string" />
    if (typeof AddDayNumber == 'number') {
        return new Date(Date.parse(this) + (86400000 * AddDayNumber));
    };
    return "";
};
Date.prototype.AddHour = function (AddHourNumber) {
    /// <summary>
    ///     日期加 n小时
    /// </summary>
    /// <param name="AddHourNumber" type="Int">
    ///     需要加的小时数
    /// </param>
    ///	<returns type="date|string" />
    if (typeof AddHourNumber == 'number') {
        return new Date(Date.parse(this) + (3600000 * AddHourNumber));
    };
    return "";
};
Date.prototype.AddMinute = function (AddMinuteNumber) {
    /// <summary>
    ///     日期加 n分钟
    /// </summary>
    /// <param name="AddMinuteNumber" type="Int">
    ///     需要加的分钟数
    /// </param>
    ///	<returns type="date|string" />
    if (typeof AddMinuteNumber == 'number') {
        return new Date(Date.parse(this) + (60000 * AddMinuteNumber));
    };
    return "";
};
Date.prototype.AddSecond = function (AddSecondNumber) {
    /// <summary>
    ///     日期加 n秒
    /// </summary>
    /// <param name="AddSecondNumber" type="Int">
    ///     需要加的秒数
    /// </param>
    ///	<returns type="date|string" />
    if (typeof AddSecondNumber == 'number') {
        return new Date(Date.parse(this) + (1000 * AddSecondNumber));
    };
    return "";
};

Date.prototype.ToBoolean = function (DefaultValue) {
    /// <summary>
    ///     1: ("sdf'dfs ").ToJsonString() - 替换字符串里的一些特殊字符，使其符合Json字符串格式。
    /// </summary>
    ///	<returns type="string" />
    return DefaultValue;
};

Boolean.prototype.ToBoolean = function (DefaultValue) {
    /// <summary>
    ///     1: ("sdf'dfs ").ToJsonString() - 替换字符串里的一些特殊字符，使其符合Json字符串格式。
    /// </summary>
    ///	<returns type="string" />
    return this.toString().ToBoolean();
};

var jExtension = {
    RandomString: function (Count, ValueString) {
        if (ValueString == undefined || ValueString == null) {
            ValueString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        };
        var CharArray = ValueString.split('');
        if (CharArray.length < Count) {
            Count = CharArray.length;
        };
        ValueString = "";
        for (var i = 0; i < Count; i++) {
            ValueString += CharArray[jExtension.RandomNumber(0, CharArray.length - 1)];
        };
        return ValueString;
    }
    , RandomItem: function (ItemList) {
        var ValueString = "";
        if (ItemList.length > 0) {
            ValueString = ItemList[jExtension.RandomNumber(0, ItemList.length - 1)];
        };
        return ValueString;
    }
    , RandomNumber: function (IntMin, IntMax) {
        return parseInt(Math.random() * (IntMax - IntMin + 1) + IntMin);
    }
    , VirtualDirectory: ''
    , GetwebSiteRootUrl: function () {
        var Root = window.location.protocol + "//" + window.location.host + "/";
        VirtualDirectory = jExtension.VirtualDirectory.replace(/\\/g, "/");
        if (VirtualDirectory != undefined && VirtualDirectory != null && VirtualDirectory.length > 0) {
            var FromatVirtualDirectory = function (VirtualDirectory) {
                var StringS = VirtualDirectory.split('');
                if (StringS[0] == "/") {
                    return FromatVirtualDirectory(VirtualDirectory.substring(1));
                } else if (StringS[StringS.length - 1] == "/") {
                    return FromatVirtualDirectory(VirtualDirectory.substring(0, StringS.length - 2));
                } else {
                    return VirtualDirectory;
                };
            };
            VirtualDirectory = FromatVirtualDirectory(VirtualDirectory);
            return Root + VirtualDirectory + "/";
        } else {
            return Root;
        };
    }
    , Request: function (ParameterName) {
        var ParameterValue = "";
        var Url = window.location.href;
        var IndexOfString = "?";
        var LastIndex = Url.lastIndexOf(IndexOfString);
        if (LastIndex > -1) {
            var ParametersString = Url.substring(LastIndex + IndexOfString.length).replace(/(^\s*)|(\s*$)/g, "");
            var ParameterS = ParametersString.split('&');
            for (var i = 0; i < ParameterS.length; i++) {
                var Parameter = ParameterS[i].split('=');
                if (Parameter[0] == ParameterName) {
                    try {
                        ParameterValue = decodeURIComponent(Parameter[1]);
                    } catch (ex) {
                        ParameterValue = "";
                    };
                    break;
                };
            };
        };
        return ParameterValue;
    }
    , GetAbsoluteUrl: function (Url, webSiteRootUrl) {
        if (Url != undefined && Url != null && Url.toString().Trim().length > 0) {
            if (Url.toString().toLowerCase().indexOf("http") > -1) {
            } else if (Url.toString().toLowerCase().indexOf(":") == 0) {
                var UrlInfo = jExtension.UrlParser(webSiteRootUrl);
                Url = UrlInfo.Protocol + "//" + UrlInfo.UsernamePassword + UrlInfo.Hostname + Url;
            } else {
                Url = webSiteRootUrl + Url;
            };
        };
        return Url;
    }
    , GetUrlParameterData: function (Url) {
        var ParameterData = {};
        if (Url == undefined) {
            Url = window.location.href;
        };
        var IndexOfString = "?";
        var LastIndex = Url.lastIndexOf(IndexOfString);
        if (LastIndex > -1) {
            var ParametersString = Url.substring(LastIndex + IndexOfString.length).replace(/(^\s*)|(\s*$)/g, "");
            var ParameterS = ParametersString.split('&');
            for (var i = 0; i < ParameterS.length; i++) {
                var Parameter = ParameterS[i].split('=');
                ParameterData[Parameter[0]] = decodeURIComponent(Parameter[1]);
            };
        };
        return ParameterData;
    }
    , AddUrlParameterData: function (Url, AddParameterData) {
        var ParameterData = jExtension.GetUrlParameterData(Url);
        $.extend(ParameterData, AddParameterData);
        if (!fw.fwObject.FWObjectHelper.hasValue(Url)) {
            Url = "";
        };
        var Index = Url.indexOf("?");
        if (Index > -1) {
            Url = Url.substring(0, Index);
        };
        var Parameters = $.param(ParameterData).ReplaceAll("+", "%20");
        if (Parameters.length > 0) {
            Url += ("?" + Parameters);
        };
        return Url;

        var Parameters = $.param(AddParameterData).ReplaceAll("+", "%20");
        if (Parameters.length > 0) {
            if (Url.indexOf("?") > -1) {
                Url += ("&" + Parameters);
            } else {
                Url += ("?" + Parameters);
            };
        };
        return Url;
    }
    , UrlEncode: function (Url, AddParameterData) {
        var ParameterData = {};
        var IndexOfString = "?";
        var LastIndex = Url.lastIndexOf(IndexOfString);
        if (LastIndex > -1) {
            var ParametersString = Url.substring(LastIndex + IndexOfString.length).replace(/(^\s*)|(\s*$)/g, "");
            var ParameterS = ParametersString.split('&');
            for (var i = 0; i < ParameterS.length; i++) {
                var Parameter = ParameterS[i].split('=');
                ParameterData[Parameter[0]] = decodeURIComponent(Parameter[1]);
            };
            Url = Url.substr(0, LastIndex);
        };
        if (!fw.fwObject.FWObjectHelper.hasValue(AddParameterData)) {
            AddParameterData = {};
        };
        $.extend(AddParameterData, ParameterData);
        return jExtension.AddUrlParameterData(Url, AddParameterData);
    }
    , WindowNameEncode: function (WindowName) {
        if (WindowName != undefined && WindowName != null) {
            WindowName = WindowName.replace(/\./g, "_");
        };
        return WindowName;
    }
    , GetFileName: function (FilePath) {
        var FileName = null;
        var LastPointIndex = FilePath.lastIndexOf(".");
        if (LastPointIndex > 0) {
            for (var i = (LastPointIndex - 1); i > -1; i--) {
                if ("/\\".indexOf(FilePath.substr(i, 1)) > -1) {
                    i++;
                    FileName = FilePath.substr(i, FilePath.length - i)
                    break;
                };
            };
        };
        return FileName;
    }
    , GetFileExtension: function (FilePath) {
        var FileExtension = null;
        var LastPointIndex = FilePath.lastIndexOf(".");
        if (LastPointIndex > 0) {
            FileExtension = FilePath.substr(LastPointIndex + 1, FilePath.length - 1)
        };
        return FileExtension;
    }
    , ContrastObject: function (ObjectA, ObjectB) {
        var PropertyNameList = [];
        for (var PropertyName in ObjectA) {
            if (ObjectB[PropertyName] != ObjectA[PropertyName]) {
                PropertyNameList.push(PropertyName);
            };
        };
        return PropertyNameList;
    }
    , JsonToString: function (JsonObject, IsUseCustomFormat) {
        /// <summary>
        ///     对象转化为Json字符串
        /// </summary>
        ///	<returns type="String" />

        switch (Object.prototype.toString.apply(JsonObject)) {
            case "[object String]":
                if (IsUseCustomFormat && JsonObject.indexOf("/Date(") > -1) {
                    return "\"" + JsonObject.ToDate().ToString("yyyy-MM-dd HH:mm:ss") + "\"";
                } else if (JsonObject.indexOf("/Date(") == 0 && JsonObject.lastIndexOf(")/") == (JsonObject.length - 2) && JsonObject.length == 21) {
                    return "\"" + JsonObject.replace(/\//g, "\\/") + "\"";
                } else {
                    return "\"" + JsonObject.replace(/(\\|\")/g, "\\$1").replace(/\n|\r|\t/g, function () { var a = arguments[0]; return (a == "\n") ? "\\n" : (a == "\r") ? "\\r" : (a == "\t") ? "\\t" : "" }) + "\"";
                };
            case "[object Number]":
                return JsonObject;
            case "[object Boolean]":
                return JsonObject;
            case "[object Object]":
                if (JsonObject == undefined || JsonObject == null) {
                    return null;
                } else {
                    var JsonS = [];
                    for (var i in JsonObject) {
                        JsonS.push("\"" + i + "\":" + jExtension.JsonToString(JsonObject[i]));
                    };
                    return '{' + JsonS.join(',') + '}';
                };
            case "[object Array]":
                var JsonS = [];
                for (var i = 0; i < JsonObject.length; i++) {
                    JsonS.push(jExtension.JsonToString(JsonObject[i]));
                };
                return "[" + JsonS.join(',') + "]";
            case "[object Null]":
                return null;
            case "[object Undefined]":
                return null;
            case "[object DOMWindow]":
                return null;
            case "[object global]":
                return null;
            case "[object Function]":
                return JsonObject.toString();
            default:
                alert(JsonObject.toString() + "JsonToString发现未知类型！" + Object.prototype.toString.apply(JsonObject));
                break;
        };
    }
    , JsonToSubmitString: function (JsonObject, IsUseCustomFormat) {
        /// <summary>
        ///     对象转化为Json字符串
        /// </summary>
        ///	<returns type="Object" />

        return jExtension.JsonToString(JsonObject, IsUseCustomFormat);
    }
    //    , JsonToXml: function (JsonObject, NodeName) {
    //        /// <summary>
    //        ///     对象转化为Json字符串
    //        /// </summary>
    //        ///	<returns type="Object" />
    //        var JsonS = [];
    //        var Format = function (Object, ChildNodeName) {
    //            if (Object != null && typeof Object == 'object') {
    //                return jExtension.JsonToXml(Object, ChildNodeName);
    //            };
    //            if (/^(string|number)$/.test(typeof Object)) {
    //                if (/^(string)$/.test(typeof Object) && Object.indexOf("/Date(") > -1) {
    //                    return "<" + ChildNodeName + ">" + Object.ToDate().ToString("yyyy-MM-dd HH:mm:ss") + "</" + ChildNodeName + ">";
    //                } else {
    //                    return "<" + ChildNodeName + ">" + Object + "</" + ChildNodeName + ">";
    //                };
    //            } else {
    //                return "<" + ChildNodeName + ">" + Object + "</" + ChildNodeName + ">";
    //            };
    //        };
    //        if (/^(object)$/.test(typeof JsonObject)) {
    //            if (JsonObject.length == undefined) {
    //                for (var i in JsonObject) {
    //                    JsonS.push(Format(JsonObject[i], i));
    //                };
    //                return "<" + NodeName + ">" + JsonS.join('') + "</" + NodeName + ">";
    //            } else {
    //                for (var i = 0; i < JsonObject.length; i++) {
    //                    JsonS.push(jExtension.JsonToXml(JsonObject[i], i));
    //                };
    //                return "<" + NodeName + ">" + JsonS.join('') + "</" + NodeName + ">";
    //            };
    //        } else {
    //            return "<" + NodeName + ">" + JsonObject + "</" + NodeName + ">";
    //        };
    //    }
    //    , JsonToTree: function (JsonObject, NodeName) {
    //        /// <summary>
    //        ///     对象转化为Json字符串
    //        /// </summary>
    //        ///	<returns type="Object" />
    //        var JsonS = [];
    //        var Format = function (Object, ChildNodeName) {
    //            if (Object != null && typeof Object == 'object') {
    //                return jExtension.JsonToTree(Object, ChildNodeName);
    //            };
    //            if (/^(string|number)$/.test(typeof Object)) {
    //                if (/^(string)$/.test(typeof Object) && Object.indexOf("/Date(") > -1) {
    //                    return "<li><div><a>" + ChildNodeName + ":" + Object.ToDate().ToString("yyyy-MM-dd HH:mm:ss") + "</a></div></li>";
    //                } else {
    //                    return "<li><div><a>" + ChildNodeName + ":" + Object + "</a></div></li>";
    //                };
    //            } else {
    //                return "<li><div><a>" + ChildNodeName + ":" + Object + "</a></div></li>";
    //            };
    //        };
    //        if (/^(object)$/.test(typeof JsonObject)) {
    //            if (JsonObject.length == undefined) {
    //                for (var i in JsonObject) {
    //                    JsonS.push(Format(JsonObject[i], i));
    //                };
    //                return "<li><div><a>" + NodeName + ":" + JsonS.join('') + "</a></div></li>";
    //            } else {
    //                for (var i = 0; i < JsonObject.length; i++) {
    //                    JsonS.push(jExtension.JsonToTree(JsonObject[i], i));
    //                };
    //                return "<li><div><a>" + NodeName + ":" + JsonS.join('') + "</a></div></li>";
    //            };
    //        } else {
    //            return "<li><div><a>" + NodeName + ":" + JsonObject + "</a></div></li>";
    //        };
    //    }
    //    , JsonToFormatString: function (JsonObject, Index) {
    //        /// <summary>
    //        ///     对象转化为Json字符串
    //        /// </summary>
    //        ///	<returns type="Object" />
    //        var Space1 = "";
    //        var Space2 = "";
    //        if (Index == undefined) {
    //            Index = 0;
    //        };
    //        for (var i = 0; i < Index; i++) {
    //            Space1 += "    ";
    //        };
    //        Index += 1;
    //        for (var i = 0; i < Index; i++) {
    //            Space2 += "    ";
    //        };
    //        Index += 1;
    //        var JsonS = [];
    //        var Format = function (Object, _Index) {
    //            if (Object != null && typeof Object == 'object') {
    //                return jExtension.JsonToFormatString(Object, _Index);
    //            };
    //            if (/^(string|number)$/.test(typeof Object)) {
    //                if (/^(string)$/.test(typeof Object) && Object.indexOf("/Date(") > -1) {
    //                    //                    return "\"" + Object.ToDate().ToString("yyyy-MM-dd HH:mm:ss") + "\"";
    //                    return "\"" + Object + "\"";
    //                } else {
    //                    return "\"" + Object + "\"";
    //                };
    //            } else {
    //                return Object;
    //            };
    //        };
    //        if (/^(object)$/.test(typeof JsonObject)) {
    //            if (JsonObject.length == undefined) {
    //                for (var i in JsonObject) {
    //                    if (JsonObject[i] != null && /^(object)$/.test(typeof JsonObject[i])) {
    //                        JsonS.push("\"" + i + "\":\n" + Format(JsonObject[i], Index));
    //                    } else {
    //                        JsonS.push("\"" + i + "\":" + Format(JsonObject[i], Index));
    //                    };
    //                };
    //                return Space1 + '{\n' + Space2 + JsonS.join('\n' + Space2 + ',') + '\n' + Space1 + '}';
    //            } else {
    //                for (var i = 0; i < JsonObject.length; i++) {
    //                    JsonS.push(jExtension.JsonToFormatString(JsonObject[i], Index - 1).Trim());
    //                };
    //                return Space1 + "[\n" + Space2 + JsonS.join('\n' + Space2 + ',') + "\n" + Space1 + "]";
    //            };
    //        } else {
    //            return Format(JsonObject);
    //        };
    //    }
    , JsonToFormatString: function (JsonObject, IsUseCustomFormat, Index) {
        /// <summary>
        ///     对象转化为Json字符串
        /// </summary>
        ///	<returns type="Object" />

        var Space = "";
        var SpaceChild = "";
        if (Index == undefined) {
            Index = 0;
        };
        for (var i = 0; i < Index; i++) {
            Space += "    ";
        };
        Index += 1;
        for (var i = 0; i < Index; i++) {
            SpaceChild += "    ";
        };
        Index += 1;

        switch (Object.prototype.toString.apply(JsonObject)) {
            case "[object String]":
                if (Index == 2) {
                    return JsonObject;
                } else {
                    if (IsUseCustomFormat && JsonObject.indexOf("/Date(") > -1) {
                        return "\"" + JsonObject.ToDate().ToString("yyyy-MM-dd HH:mm:ss") + "\"";
                    } else {
                        return "\"" + JsonObject.replace(/(\\|\")/g, "\\$1").replace(/\n|\r|\t/g, function () { var a = arguments[0]; return (a == "\n") ? "\\n" : (a == "\r") ? "\\r" : (a == "\t") ? "\\t" : "" }) + "\"";
                    };
                };
            case "[object Number]":
                return JsonObject;
            case "[object Boolean]":
                return JsonObject;
            case "[object Object]":
                if (JsonObject == undefined || JsonObject == null) {
                    return null;
                } else {
                    var JsonS = [];
                    for (var i in JsonObject) {
                        if (JsonObject[i] != undefined && JsonObject[i] != null && Object.prototype.toString.apply(JsonObject[i]) != "[object Null]" && Object.prototype.toString.apply(JsonObject[i]) != "[object Undefined]" && (Object.prototype.toString.apply(JsonObject[i]) == "[object Object]" || Object.prototype.toString.apply(JsonObject[i]) == "[object Array]")) {
                            JsonS.push("\"" + i + "\":\n" + jExtension.JsonToFormatString(JsonObject[i], IsUseCustomFormat, Index));
                        } else {
                            JsonS.push("\"" + i + "\":" + jExtension.JsonToFormatString(JsonObject[i], IsUseCustomFormat, Index));
                        };
                    };
                    return Space + '{\n' + SpaceChild + JsonS.join('\n' + SpaceChild + ',') + '\n' + Space + '}';
                };
            case "[object Array]":
                var JsonS = [];
                for (var i = 0; i < JsonObject.length; i++) {
                    if (JsonObject[i] != undefined) {
                        JsonS.push(jExtension.JsonToFormatString(JsonObject[i], IsUseCustomFormat, (Index - 1)).Trim());
                    };
                };
                return Space + "[\n" + SpaceChild + JsonS.join('\n' + SpaceChild + ',') + "\n" + Space + "]";
            case "[object Null]":
                return null;
            case "[object Undefined]":
                return null;
            case "[object DOMWindow]":
                return null;
            case "[object global]":
                return null;
            case "[object Function]":
                return JsonObject.toString();
            default:
                alert("JsonToString发现未知类型！" + Object.prototype.toString.apply(JsonObject));
                break;
        };
    }
    , JsonCopy: function (JsonObject) {
        var JsonString = jExtension.JsonToString(JsonObject);
        var JsonObjectCopy = jExtension.JsonStringToJson(JsonString);
        return JsonObjectCopy;
    }
    , JsonStringToJson: function (JsonString, CatchValue) {
        var JsonObject;
        if (CatchValue != undefined && (JsonString == undefined || JsonString == null)) {
            JsonString = CatchValue;
        };
        try {
            JsonObject = eval("(" + JsonString + ")");
        } catch (ex) {
            JsonObject = JsonString;
        };
        return JsonObject;
    }
    //var HorizontalData = [
    //      { a: "a0", b: "b0", c: "c0", d: "d0" },
    //      { a: "a0", b: "b1", c: "c1", d: "d1" },
    //      { a: "a0", b: "b2", c: "c2", d: "d2" },
    //      { a: "a1", b: "b1", c: "c3", d: "d3" },
    //      { a: "a1", b: "b2", c: "c4", d: "d4" },
    //      { a: "a1", b: "b3", c: "c5", d: "d5" },
    //      { a: "a2", b: "b2", c: "c6", d: "d6" },
    //      { a: "a2", b: "b3", c: "c7", d: "d7" },
    //      { a: "a2", b: "b4", c: "c8", d: "d8" }
    //  ];
    //  var HorizontalDataReturn = [
    //      { "a": "a0", "b0_c": "c0", "b0_d": "d0", "b1_c": "c1", "b1_d": "d1", "b2_c": "c2", "b2_d": "d2", "b3_c": null, "b3_d": null, "b4_c": null, "b4_d": null }
    //      , { "a": "a1", "b0_c": null, "b0_d": null, "b1_c": "c3", "b1_d": "d3", "b2_c": "c4", "b2_d": "d4", "b3_c": "c5", "b3_d": "d5", "b4_c": null, "b4_d": null }
    //      , { "a": "a2", "b0_c": null, "b0_d": null, "b1_c": null, "b1_d": null, "b2_c": "c6", "b2_d": "d6", "b3_c": "c7", "b3_d": "d7", "b4_c": "c8", "b4_d": "d8" }
    //  ];
    //jExtension.JsonToHorizontal(HorizontalData, "a", "b", "c");
    //转横表
    , JsonToHorizontal: function (JsonObject, AlignmentFieldName, MemberFieldName, ValueFieldNameArray) {
        var ReturnObject = [];
        if (Object.prototype.toString.apply(JsonObject) == "[object Array]") {
            var AFNEntity = {};
            var MFNEntity = {};
            var Entity;
            for (var i = 0; i < JsonObject.length; i++) {
                Entity = JsonObject[i];
                AFNEntity[Entity[AlignmentFieldName]] = true;
                MFNEntity[Entity[MemberFieldName]] = true;
            };
            var AFNArray = [];
            for (var i in AFNEntity) {
                if (AFNEntity[i]) {
                    AFNArray.push(i)
                };
            };
            for (var i = 0; i < AFNArray.length; i++) {
                var AFV = AFNArray[i];
                AFNEntity[AFV] = i;
                Entity = {};
                Entity[AlignmentFieldName] = AFV;
                for (var j in MFNEntity) {
                    if (ValueFieldNameArray.length > 0) {
                        for (var k = 0; k < ValueFieldNameArray.length; k++) {
                            var ValueFieldName = ValueFieldNameArray[k];
                            Entity[j + "_" + ValueFieldName] = null;
                        };
                    } else {
                        Entity[j] = null;
                    };
                };
                ReturnObject.push(Entity);
            };
            for (var i = 0; i < JsonObject.length; i++) {
                Entity = JsonObject[i];
                if (ValueFieldNameArray.length > 0) {
                    for (var k = 0; k < ValueFieldNameArray.length; k++) {
                        var ValueFieldName = ValueFieldNameArray[k];
                        ReturnObject[AFNEntity[Entity[AlignmentFieldName]]][Entity[MemberFieldName] + "_" + ValueFieldName] = Entity[ValueFieldName];
                    };
                } else {
                    ReturnObject[AFNEntity[Entity[AlignmentFieldName]]][Entity[MemberFieldName]] = Entity[ValueFieldName];
                };
            };
        };
        return ReturnObject;
    }
    , EntityListToDictionary: function (EntityList, KeyFieldName) {
        var Dictionary = {};
        if (EntityList != null && EntityList.length > 0) {
            for (var i = 0; i < EntityList.length; i++) {
                var Entity = EntityList[i];
                Dictionary[Entity[KeyFieldName]] = Entity;
            };
        };
        return Dictionary;
    }
    , EntityListDistinct: function (EntityList, FieldName) {
        var FieldValueArray = [];
        var FieldValueDictionary = {};
        if (EntityList != null && EntityList.length > 0) {
            for (var i = 0; i < EntityList.length; i++) {
                var FieldValue = EntityList[i][FieldName];
                if (FieldValueDictionary[FieldValue] == undefined) {
                    FieldValueDictionary[FieldValue] = EntityList[i];
                    FieldValueArray.push(FieldValue);
                };
            };
        };
        return FieldValueArray
    }
    , EntityListConversionRange: function (EntityList, FieldEntityList, KeyFieldName, MinValueFieldName, MaxValueFieldName, RangeValueFunction) {
        if (RangeValueFunction == undefined) {
            RangeValueFunction = function (Key) {
                return Key + "_RangeValue";
            };
        };
        if (EntityList != null && EntityList.length > 0) {
            for (var i = 0; i < EntityList.length; i++) {
                var Entity = EntityList[i];
                for (var j = 0; j < FieldEntityList.length; j++) {
                    var FieldEntity = FieldEntityList[j];
                    var Key = FieldEntity[KeyFieldName];
                    var Value = Entity[Key];
                    if (Value != null && !isNaN(Value)) {
                        if (FieldEntity.MinValue == undefined) {
                            FieldEntity.MinValue = Value;
                        };
                        if (FieldEntity.MaxValue == undefined) {
                            FieldEntity.MaxValue = Value;
                        };
                        if (Value < FieldEntity.MinValue) {
                            FieldEntity.MinValue = Value;
                        } else if (Value > FieldEntity.MaxValue) {
                            FieldEntity.MaxValue = Value;
                        };
                    };
                };
            };
            for (var i = 0; i < FieldEntityList.length; i++) {
                var FieldEntity = FieldEntityList[i];
                var Key = FieldEntity[KeyFieldName];
                var ConvertValue = null;
                if (FieldEntity.MaxValue == FieldEntity.MinValue) {
                    ConvertValue = FieldEntity[MaxValueFieldName] - FieldEntity[MinValueFieldName];
                } else {
                    ConvertValue = (FieldEntity[MaxValueFieldName] - FieldEntity[MinValueFieldName]) / (FieldEntity.MaxValue - FieldEntity.MinValue);
                };
                FieldEntity["ConvertValue"] = ConvertValue;
                for (var j = 0; j < EntityList.length; j++) {
                    var Entity = EntityList[j];
                    var Value = Entity[Key];
                    if (Value != null && !isNaN(Value)) {
                        Entity[RangeValueFunction(Key)] = (Value - FieldEntity.MinValue) * ConvertValue + FieldEntity[MinValueFieldName];
                    }
                };
            };
        };
        return FieldEntityList;
    }
    , GetTextWidth: function (Text, EveryWordWidth, MinWidth, MaxWidth) {
    }
    , ToFunction: function (_function) {
        var Return;
        if (_function != undefined) {
            if ($.isFunction(_function)) {
                Return = _function;
            } else {
                _function = $.trim(_function.toString());
                if (_function.indexOf("function") == 0) {
                    eval("Return=" + _function);
                } else {
                    Return = function (e) {
                        eval(_function);
                    };
                };
            };
        };
        return Return;
    }
    , ToJson: function (_json) {
        var Return;
        if (_json != undefined) {
            if ($.isPlainObject(_json)) {
                Return = _json;
            } else {
                _json = $.trim(_json.toString());
                Return = jExtension.JsonStringToJson(_json);
            };
        };
        return Return;
    }
};

function WindowResize() {
    $(window).resize();
};


$.fn.WindowResize = function (ResizeFunction) {
    var Version = '1.1';
    var WindowResize = { Fired: false, Width: 0 };
    function ResizeOnce() {
        if ($.browser.msie) {
            if (!WindowResize.Fired) {
                WindowResize.Fired = true;
            } else {
                Version = parseInt($.browser.version, 10);
                WindowResize.Fired = false;
                if (Version < 7) {
                    return false;
                } else if (Version == 7) {
                    var Width = $(window).width();
                    if (Width != WindowResize.Width) {
                        WindowResize.Width = Width;
                        return false;
                    };
                };
            };
        };
        return true;
    };

    function HandleWindowResize(e) {
        if (ResizeOnce()) {
            return ResizeFunction.apply(this, [e]);
        };
    };

    this.each(function () {
        if (this == window) {
            $(this).bind("resize", HandleWindowResize);
        } else {
            $(this).bind("resize", ResizeFunction);
        };
    });

    return this;
};


var jQueryExtension = {
    WindowGuid: function () {
        /// <summary>
        /// 1: jQueryExtension.WindowGuid() - 把时间的年、月、日、时、分、秒、毫秒 以字符串相加 最后在与jQuery提供的($.event.guid++)相加 当做Guid用。
        /// </summary>
        /// <returns type="String"）</returns>
        var DateTime = new Date();
        var Year = DateTime.getFullYear();
        var Month = DateTime.getMonth();
        if (Month < 1) {
            Month = 12;
            Year -= 1;
        };
        Month += 1;
        var Day = DateTime.getDate();
        var Hours = DateTime.getHours();
        var Minutes = DateTime.getMinutes();
        var Seconds = DateTime.getSeconds();
        var Milliseconds = DateTime.getMilliseconds();
        return "" + Year + Month + Day + Hours + Minutes + Seconds + Milliseconds + parseInt($.event.guid++)
    }
    , IsUndefinedOrNullOrEmpty: function (AnyType, IsIncludeString) {
        if (AnyType == undefined) {
            return true;
        };
        if (AnyType == null) {
            return true;
        };

        if (typeof (AnyType) == "string") {
            if (AnyType.toLocaleLowerCase() == "undefined") {
                return true;
            };
            if (AnyType.toLocaleLowerCase() == "null") {
                return true;
            };
            return AnyType.length < 1
        };
        if (typeof (AnyType) == "number") {
            return false;
        };
        if (AnyType instanceof jQuery) {
            return AnyType.length < 1
        };
        if (typeof (AnyType) == "object") {
            if ($.isArray(AnyType)) {
                return AnyType.length < 1
            };
            if ($.isEmptyObject(AnyType)) {
                return true;
            };
        };
        return false;
    }
    , IsNumber: function (AnyType) {
        if (!fw.fwObject.FWObjectHelper.hasValue(AnyType)) {
            return false;
        } else {
            return !isNaN(AnyType.toString());
        };
    }
    , Event: function (Name, Event) {
        if (Event != undefined) {
            $(window).data("jQueryExtension_Event_" + Name, Event);
        } else {
            return $(window).data("jQueryExtension_Event_" + Name);
        };
    }
    , RemoveEvent: function (Name) {
        $(window).removeData("jQueryExtension_Event_" + Name);
    }
    , GetDeviceType: function () {
        var DeviceType = jQueryExtension.Data.DeviceType.PC;
        if (navigator.userAgent.match(/iPad/i)) {
            DeviceType = jQueryExtension.Data.DeviceType.iPad;
        };
        if (navigator.userAgent.match(/iPhone/i)) {
            DeviceType = jQueryExtension.Data.DeviceType.iPhone;
        };
        return DeviceType;
    }
    , Cookie: function (CookieName, CookieValue, Properties) {
        /// <summary>
        //      1: jQueryExtension.Cookie('CookieName', 'CookieValue') - 设置Cookie
        //      2: jQueryExtension.Cookie('CookieName', 'CookieValue', { Expires: 7 }) - 设置带时间的Cookie
        //      3: jQueryExtension.Cookie('CookieName') - 获得Cookie
        //      4: jQueryExtension.Cookie('CookieName', '', { expires: -1 }) - 删除Cookie
        //      5: jQueryExtension.Cookie('CookieName', null) - 删除Cookie
        /// </summary>
        /// <param name="CookieName" type="String">
        ///      1: CookieName: null - Cookie名称。
        /// </param>
        /// <param name="CookieValue" type="String">
        ///      1: CookieValue: null - Cookie值。
        /// </param>
        /// <param name="Properties" type="Options">
        ///     一组用于默认配置的键/值对。
        ///      1: Expires: '' - 有效期（天数）。
        ///      2: Path: '' - 路径。
        ///      3: Domain: '' - 域名。
        ///      4: Secure: '' - 安全性。
        /// </param>
        ///	<returns type="String" />
        if (typeof CookieValue != 'undefined') {
            var Settings = {
                Expires: ''
                , Path: ''
                , Domain: ''
                , Secure: ''
            };
            $.extend(Settings, Properties);

            if (CookieValue == null) {
                CookieValue = '';
                Settings.Expires = -1;
            };

            var Expires = '';
            if (Settings.Expires && (typeof Settings.Expires == 'number' || Settings.Expires.toUTCString)) {
                var DateTime;
                if (typeof Settings.Expires == 'number') {
                    DateTime = new Date();
                    DateTime.setTime(DateTime.getTime() + (Settings.Expires * 24 * 60 * 60 * 1000));
                } else {
                    DateTime = Settings.Expires;
                };
                Expires = '; expires=' + DateTime.toUTCString();
            };
            var Path = Settings.Path ? '; path=' + (Settings.Path) : '';
            var Domain = Settings.Domain ? '; domain=' + (Settings.Domain) : '';
            var Secure = Settings.Secure ? '; secure' + (Settings.Secure) : '';
            document.cookie = [CookieName, '=', encodeURIComponent(CookieValue), Expires, Path, Domain, Secure].join('');
        } else {
            var tempCookieValue = '';
            if (document.cookie && document.cookie != '') {
                var Cookies = document.cookie.split(';');
                for (var i = 0; i < Cookies.length; i++) {
                    var Cookie = jQuery.trim(Cookies[i]);
                    if (Cookie.substring(0, CookieName.length + 1) == (CookieName + '=')) {
                        tempCookieValue = decodeURIComponent(Cookie.substring(CookieName.length + 1));
                        break;
                    };
                };
            };
            return tempCookieValue;
        };
    }
    , IsFlash: function () {
        /// <summary>
        ///     1: jQueryExtension.IsFlash() - 整个框架的默认 是否以flash效果展示。
        /// </summary>
        /// <returns type="Boolean"）</returns>
        var IsFlash = $.trim(jQueryExtension.Cookie("IsjQueryExtensionFlash")).toLowerCase();
        if (IsFlash != "1" && IsFlash != "true") {
            IsFlash = false;
        };
        return !!IsFlash;
    }
    , IsTouch: function () {
        /// <summary>
        ///     1: jQueryExtension.IsFlash() - 整个框架的默认 是否以flash效果展示。
        /// </summary>
        /// <returns type="Boolean"）</returns>
        return (typeof Touch == 'object');
    }
    , ScreenWidth: function () {
        /// <summary>
        ///       1: 显示器分辨率宽度。
        /// </summary>
        /// <returns type="Int"）</returns>
        return window.screen.width;
    }
    , ScreenHeight: function () {
        /// <summary>
        ///       1: 显示器分辨率高度。
        /// </summary>
        /// <returns type="Int"）</returns>
        return window.screen.height;
    }
    , AvailWidth: function () {
        /// <summary>
        ///      1: 显示器可用工作区宽度=显示器分辨率宽度-左边任务栏宽度。
        /// </summary>
        /// <returns type="Int"）</returns>
        return window.screen.availWidth;
    }
    , AvailHeight: function () {
        /// <summary>
        ///      1: 显示器可用工作区高度=显示器分辨率高度-下边任务栏高度。
        /// </summary>
        /// <returns type="Int"）</returns>
        return window.screen.availHeight;
    }
    , ShowWidth: function (Selector) {
        var SelectorJQ = $(Selector);
        if (SelectorJQ.is(":hidden")) {
            return 0;
        } else {
            return SelectorJQ.width();
        };
    }
    , ShowHeight: function (Selector) {
        var SelectorJQ = $(Selector);
        if (SelectorJQ.is(":hidden")) {
            return 0;
        } else {
            return SelectorJQ.height();
        };
    }
    , ResizeWidthHeight: function (Properties) {
        /// <summary>
        ///     改变指定元素宽度高度，并触发大小改变事件
        /// </summary>
        /// <param name="Properties" type="Options">
        ///     一组用于默认配置的键/值对。
        ///      1: IsFlash: jQueryExtension.IsFlash() - 是否以flash效果展示。
        ///      2: Speed: jQueryExtension.Data.Settings.Speed - 动画完成的速度（毫秒）。
        ///      3: Frequency: jQueryExtension.Data.Settings.Frequency - 动画帧的频率（毫秒）。
        ///      4: Selector: null - （选择器）需要改变宽度高度的元素
        ///      5: Width: null - 宽度值
        ///      6: Height: null - 高度值
        /// </param>
        var Settings = {
            IsFlash: jQueryExtension.IsFlash()
            , Speed: jQueryExtension.Data.Settings.Speed
            , Frequency: jQueryExtension.Data.Settings.Frequency
            , Selector: null
            , Width: null
            , Height: null
            , IsMustResize: false
        };
        $.extend(Settings, Properties);

        if (fw.fwObject.FWObjectHelper.hasValue(Settings.Selector)) {
            var SelectorJQ = $(Settings.Selector);
            SelectorJQ.each(function () {
                var IsResize = false;

                //                var LayoutSettings = SelectorJQ.data("LayoutSettings");
                //                if (LayoutSettings == undefined || LayoutSettings.VerticalAlignment != jQueryExtension.Data.VerticalAlignment.Stretch) {
                //                    SelectorJQ.triggerHandler("jQueryExtension_Event_Resize");
                //                };

                if (Settings.IsMustResize || (fw.fwObject.FWObjectHelper.hasValue(Settings.Width) && SelectorJQ.width() != Settings.Width)) {
                    SelectorJQ.width(Settings.Width);
                    IsResize = true;
                };
                if (Settings.IsMustResize || (fw.fwObject.FWObjectHelper.hasValue(Settings.Height) && SelectorJQ.height() != Settings.Height)) {
                    SelectorJQ.height(Settings.Height);
                    IsResize = true;
                };
                if (IsResize || Settings.IsMustResize) {
                    SelectorJQ.triggerHandler("jQueryExtension_Event_Resize");
                    //                    if (($.browser.msie && ($.browser.version == "6.0" || $.browser.version == "7.0"))) {
                    //                        var IframeWindow = SelectorJQ[0].contentWindow;
                    //                        try {
                    //                            if (fw.fwObject.FWObjectHelper.hasValue(IframeWindow) && $.isFunction(IframeWindow.WindowResize)) {
                    //                                IframeWindow.WindowResize();
                    //                            };
                    //                        } catch (ex) {
                    //                            //跨域会报错
                    //                        };
                    //                    };
                };
            });
        };
    }
    , ClientWidth: function () {
        /// <summary>
        ///     1: jQueryExtension.Window.Document.ClientWidth() - 页面可见范围宽度。
        /// </summary>
        /// <returns type="Int"）</returns>
        return parseInt(document.compatMode == "CSS1Compat" ? document.documentElement.clientWidth : document.body.clientWidth);
    }
    , ClientHeight: function () {
        /// <summary>
        ///     1: jQueryExtension.Window.Document.ClientHeight() - 页面可见范围高度。
        /// </summary>
        /// <returns type="Int"）</returns>
        return parseInt(document.compatMode == "CSS1Compat" ? document.documentElement.clientHeight : document.body.clientHeight);
    }
    , ScrollLeft: function (Selector, ScrollLeft) {
        /// <summary>
        ///     1: jQueryExtension.Window.Document.ScrollLeft(ScrollLeft) - 页面 x轴 滚动条高度。
        /// </summary>
        /// <param name="ScrollLeft" type="Int">
        ///      1: ScrollLeft - 需要设置的 x轴 滚动条高度。
        /// </param>
        /// <returns type="Int"）</returns>
        var SelectorJQ = $(Selector);
        if (ScrollLeft == undefined) {
            return SelectorJQ.scrollLeft();
        } else {
            SelectorJQ.scrollLeft(ScrollLeft);
            return jQueryExtension.ScrollLeft(SelectorJQ);
        };
    }
    , ScrollWidth: function (Selector) {
        /// <summary>
        ///     1: jQueryExtension.Window.Document.ScrollWidth(ScrollLeft) - 页面 x轴 滚动条高度。
        /// </summary>
        /// <param name="ScrollLeft" type="Int">
        ///      1: ScrollLeft - 需要设置的 x轴 滚动条高度。
        /// </param>
        /// <returns type="Int"）</returns>
        var SelectorJQ = $(Selector);
        if (SelectorJQ.length < 1) {
            return 0;
        };
        return SelectorJQ[0].scrollWidth;
    }
    , ScrollTop: function (Selector, ScrollTop) {
        /// <summary>
        ///     1: jQueryExtension.Window.Document.ScrollTop(ScrollTop) - 页面 x轴 滚动条高度。
        /// </summary>
        /// <param name="ScrollLeft" type="Int">
        ///      1: ScrollLeft - 需要设置的 y轴 滚动条高度。
        /// </param>
        /// <returns type="Int"）</returns>
        var SelectorJQ = $(Selector);
        if (ScrollTop == undefined) {
            return SelectorJQ.scrollTop();
        } else {
            SelectorJQ.scrollTop(ScrollTop);
            return jQueryExtension.ScrollTop(SelectorJQ);
        };
    }
    , ScrollHeight: function (Selector) {
        /// <summary>
        ///     1: jQueryExtension.Window.Document.ScrollWidth(ScrollLeft) - 页面 x轴 滚动条高度。
        /// </summary>
        /// <param name="ScrollLeft" type="Int">
        ///      1: ScrollLeft - 需要设置的 x轴 滚动条高度。
        /// </param>
        /// <returns type="Int"）</returns>
        var SelectorJQ = $(Selector);
        if (SelectorJQ.length < 1) {
            return 0;
        };
        return SelectorJQ[0].scrollHeight;
    }
    , LayoutSettings: function (Selector) {
        var SelectorJQ = $(Selector);
        if (SelectorJQ.length > 0) {
            var LayoutSettings = SelectorJQ.data("LayoutSettings");
            if (LayoutSettings == undefined) {
                LayoutSettings = {};
                var style = SelectorJQ[0].style;
                switch (style.position) {
                    case jQueryExtension.Data.Position.Absolute:
                        if (style.width == "") {
                            LayoutSettings.HorizontalAlignment = jQueryExtension.Data.HorizontalAlignment.Stretch;
                        } else {
                            if (style.right != "") {
                                LayoutSettings.HorizontalAlignment = jQueryExtension.Data.HorizontalAlignment.Right;
                            } else {
                                LayoutSettings.HorizontalAlignment = jQueryExtension.Data.HorizontalAlignment.Left;
                            };
                        };
                        if (style.height == "") {
                            LayoutSettings.VerticalAlignment = jQueryExtension.Data.VerticalAlignment.Stretch;
                        } else {
                            if (style.bottom != "") {
                                LayoutSettings.VerticalAlignment = jQueryExtension.Data.VerticalAlignment.Bottom;
                            } else {
                                LayoutSettings.VerticalAlignment = jQueryExtension.Data.VerticalAlignment.Top;
                            };
                        };
                        break;
                    default:
                        LayoutSettings.HorizontalAlignment = jQueryExtension.Data.HorizontalAlignment.Left;
                        LayoutSettings.VerticalAlignment = jQueryExtension.Data.VerticalAlignment.Top;
                        break;
                };
                SelectorJQ.data("LayoutSettings", LayoutSettings)
            };
            return LayoutSettings;
        } else {
            jQueryExtension.Throw("方法(jQueryExtension.Alignment)中选择器" + SelectorJQ.selector + "");
        };
    }
    , Position: function (Selector) {
        /// <summary>
        ///     1: jQueryExtension.Window.Document.Element.Position(Properties) - 获得用于该元素具体的定位信息。
        /// </summary>
        /// <param name="Properties" type="Options">
        ///     一组用于默认配置的键/值对。
        ///      1: Selector: null - （选择器）需要获取定位信息的元素。
        /// </param>
        ///	<returns type="object" />
        var SelectorJQ = $(Selector);
        var Position = {};

        if (SelectorJQ.length > 0) {
            var position = SelectorJQ.position();
            Position.RelativeTop = position.top;
            Position.RelativeLeft = position.left;

            var offset = SelectorJQ.offset();
            Position.AbsoluteTop = offset.top;
            Position.AbsoluteLeft = offset.left;

            Position.zIndex = SelectorJQ.css("zIndex");
        };

        return Position;
    }
    , Box: function (Selector) {
        ///	<summary>
        ///		获得用于该元素具体的盒子模型信息
        ///
        /// Properties属性值：
        ///                   Selector: ""                       //用于筛选的选择器
        ///	</summary>
        /// <param name="Properties">属性</param>
        ///<returns type="object"）</returns>
        var SelectorJQ = $(Selector);
        var Box = {};

        var MarginTop = SelectorJQ.css("margin-top");
        var MarginRight = SelectorJQ.css("margin-right");
        var MarginBottom = SelectorJQ.css("margin-bottom");
        var MarginLeft = SelectorJQ.css("margin-left");
        MarginTop = MarginTop == "auto" ? 0 : parseInt(MarginTop);
        MarginRight = MarginRight == "auto" ? 0 : parseInt(MarginRight);
        MarginBottom = MarginBottom == "auto" ? 0 : parseInt(MarginBottom);
        MarginLeft = MarginLeft == "auto" ? 0 : parseInt(MarginLeft);
        Box.MarginTop = MarginTop;
        Box.MarginRight = MarginRight;
        Box.MarginBottom = MarginBottom;
        Box.MarginLeft = MarginLeft;

        var BorderTop = SelectorJQ.css("border-top-width");
        var BorderRight = SelectorJQ.css("border-right-width");
        var BorderBottom = SelectorJQ.css("border-bottom-width");
        var BorderLeft = SelectorJQ.css("border-left-width");
        BorderTop = BorderTop == "medium" ? 0 : parseInt(BorderTop);
        BorderRight = BorderRight == "medium" ? 0 : parseInt(BorderRight);
        BorderBottom = BorderBottom == "medium" ? 0 : parseInt(BorderBottom);
        BorderLeft = BorderLeft == "medium" ? 0 : parseInt(BorderLeft);
        Box.BorderTop = BorderTop;
        Box.BorderRight = BorderRight;
        Box.BorderBottom = BorderBottom;
        Box.BorderLeft = BorderLeft;

        Box.PaddingTop = parseInt(SelectorJQ.css("padding-top"));
        Box.PaddingRight = parseInt(SelectorJQ.css("padding-right"));
        Box.PaddingBottom = parseInt(SelectorJQ.css("padding-bottom"));
        Box.PaddingLeft = parseInt(SelectorJQ.css("padding-left"));

        Box.Width = function (BoxInternalStructure) {
            var Width = SelectorJQ.width();
            switch (BoxInternalStructure) {
                case jQueryExtension.Data.BoxInternalStructure.Margin:
                    Width = Width + Box.PaddingRight + Box.PaddingLeft + Box.BorderRight + Box.BorderLeft + Box.MarginRight + Box.MarginLeft;
                    break;
                case jQueryExtension.Data.BoxInternalStructure.Border:
                    Width = Width + Box.PaddingRight + Box.PaddingLeft + Box.BorderRight + Box.BorderLeft;
                    break;
                case jQueryExtension.Data.BoxInternalStructure.Padding:
                    Width = Width + Box.PaddingRight + Box.PaddingLeft;
                    break;
                default:
                    break;
            };
            return Width;
        };
        Box.Height = function (BoxInternalStructure) {
            var Height = SelectorJQ.height();
            switch (BoxInternalStructure) {
                case jQueryExtension.Data.BoxInternalStructure.Margin:
                    Height = Height + Box.PaddingTop + Box.PaddingBottom + Box.BorderTop + Box.BorderBottom + Box.MarginTop + Box.MarginBottom;
                    break;
                case jQueryExtension.Data.BoxInternalStructure.Border:
                    Height = Height + Box.PaddingTop + Box.PaddingBottom + Box.BorderTop + Box.BorderBottom;
                    break;
                case jQueryExtension.Data.BoxInternalStructure.Padding:
                    Height = Height + Box.PaddingTop + Box.PaddingBottom;
                    break;
                default:
                    break;
            };
            return Height;
        };

        Box.zIndex = SelectorJQ.css("zIndex");

        return Box;
    }

    , Throw: function (Message) {
        //            jQueryExtension.Alert({ TitleHtml: "程序异常", ContentHtml: Message });
        alert(Message);
    }
    //移除字符串最后位字符
    , ToStringWithOutEndChar: function (str, character) {
        var result = "";
        if (str.substring(str.length - 1, str.length) == character) {
            result = str.substring(0, str.length - 1);
        } else {
            result = str;
        }
        return result;
    }
    //处理为空数据以新字符串形式返回
    , IsUndefinedOrNullOrEmptyReturnChar: function (param, char) {
        if (this.IsUndefinedOrNullOrEmpty(param)) {
            return char;
        }
    }
    //绑定鼠标左击事件实现地图对象的拖动
    //obj1:点击的对象;obj2:移动的对象
    , mapTargetMoveHandle: function (obj1, obj2) {

        //要求鼠标在移动对象上时不能移动
        $(obj2).bind("mouseover", function (event) {
            isValited2 = false;
        });
        $(obj2).bind("mouseout", function (event) {
            isValited2 = true;
        });

        $("#divArcGISMap_infowindow").bind("mouseover", function (event) {
            isValited = false;
        });
        $("#divArcGISMap_infowindow").bind("mouseout", function (event) {
            isValited = true;
        });
        $(obj1).bind("mousedown", function (event) {
            if (isValited && isValited2) {
                /* 获取需要拖动节点的坐标 */
                // var offset_x = $(this)[0].offsetLeft; //x坐标
                //var offset_y = $(this)[0].offsetTop; //y坐标
                var offset_x = $(obj2)[0].offsetLeft; //x坐标
                var offset_y = $(obj2)[0].offsetTop; //y坐标
                /* 获取当前鼠标的坐标 */
                var mouse_x = event.pageX;
                var mouse_y = event.pageY;

                /* 绑定拖动事件 */
                /* 由于拖动时，可能鼠标会移出元素，所以应该使用全局（document）元素 */
                $(document).bind("mousemove", function (ev) {
                    /* 计算鼠标移动了的位置 */
                    var _x = ev.pageX - mouse_x;
                    var _y = ev.pageY - mouse_y;

                    /* 设置移动后的元素坐标 */
                    var now_x = (offset_x + _x) + "px";
                    var now_y = (offset_y + _y) + "px";
                    /* 改变目标元素的位置 */
                    $(obj2).css({
                        top: now_y,
                        left: now_x
                    });


                });
            }
            ;
        });
        /* 当鼠标左键松开，接触事件绑定 */
        $(document).bind("mouseup", function () {
            $(this).unbind("mousemove");
        });
    }
    //绑定鼠标左击事件实现对象的拖动
    //obj1:点击的对象;obj2:移动的对象
    //注意：obj1对象的样式需要 z-index:9999;position:absolute;cursor:default
, targetMoveHandle: function (obj1, obj2) {
    $(obj1).bind("mousedown", function (event) {
        /* 获取需要拖动节点的坐标 */
        // var offset_x = $(this)[0].offsetLeft; //x坐标
        //var offset_y = $(this)[0].offsetTop; //y坐标
        var offset_x = $(obj2)[0].offsetLeft; //x坐标
        var offset_y = $(obj2)[0].offsetTop; //y坐标
        /* 获取当前鼠标的坐标 */
        var mouse_x = event.pageX;
        var mouse_y = event.pageY;
        /* 绑定拖动事件 */
        /* 由于拖动时，可能鼠标会移出元素，所以应该使用全局（document）元素 */
        $(document).bind("mousemove", function (ev) {
            /* 计算鼠标移动了的位置 */
            var _x = ev.pageX - mouse_x;
            var _y = ev.pageY - mouse_y;

            /* 设置移动后的元素坐标 */
            var now_x = (offset_x + _x) + "px";
            var now_y = (offset_y + _y) + "px";

            //到达顶端不可以继续移动 add by lxg 20180508
            if (offset_y + _y < 0)
                now_y = 0;

            /* 改变目标元素的位置 */
            $(obj2).css({
                top: now_y,
                left: now_x
            });
        });
    });
    /* 当鼠标左键松开，接触事件绑定 */
    $(document).bind("mouseup", function () {
        $(this).unbind("mousemove");
    });
}
};


jQueryExtension.Data = {
    // 摘要:
    //     指示应在哪里将元素显示在与父元素的已分配布局槽相对的水平轴上。
    Settings: {
        // 摘要:
        //     与父元素布局槽的左侧对齐的元素。
        Speed: 500,
        //
        // 摘要:
        //     与父元素布局槽的中心对齐的元素。
        Frequency: 10,
        //
        // 摘要:
        //     与父元素布局槽的右侧对齐的元素。
        BorderFuzzyPixel: 10,
        //
        // 摘要:
        //     拉伸以填充整个父元素布局槽的元素。
        Radius: 10
    }
    // 摘要:
    //     指示应在哪里将元素显示在与父元素的已分配布局槽相对的水平轴上。
    , HorizontalAlignment: {
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

        // 摘要:
        //     原始值。
        Inherit: "Inherit",
        // 摘要:
        //     隐藏。
        Hidden: "Hidden",
        //
        // 摘要:
        //     永久移除。
        Remove: "Remove"
    }
    // 摘要:
    //     元素被关闭显示时采用的类型。
    , BoxInternalStructure: {
        // 摘要:
        //     原始值。
        Content: "Content",
        // 摘要:
        //     隐藏。
        Padding: "Padding",
        //
        // 摘要:
        //     永久移除。
        Border: "Border",
        //
        // 摘要:
        //     永久移除。
        Margin: "Margin"
    }
    , Position: {
        Absolute: "absolute"
    }
    , Direction: {
        //
        // 摘要:
        //     永久移除。
        LeftTop: "LeftTop",
        //
        // 摘要:
        //     隐藏。
        Top: "Top",
        //
        // 摘要:
        //     永久移除。
        RightTop: "RightTop",
        //
        // 摘要:
        //     永久移除。
        Right: "Right",
        //
        // 摘要:
        //     永久移除。
        RightBottom: "RightBottom",
        //
        // 摘要:
        //     永久移除。
        Bottom: "Bottom",
        //
        // 摘要:
        //     永久移除。
        LeftBottom: "LeftBottom",
        //
        // 摘要:
        //     永久移除。
        Left: "Left"
    }
    , DeviceType: {
        //
        // 摘要:
        //     永久移除。
        PC: "PC",
        //
        // 摘要:
        //     隐藏。
        iPhone: "iPhone",
        //
        // 摘要:
        //     永久移除。
        iPad: "iPad"
    }
    , SortType: {
        //
        // 摘要:
        //     永久移除。
        Inherit: "-1",
        //
        // 摘要:
        //     隐藏。
        Asc: "0",
        //
        // 摘要:
        //     永久移除。
        Desc: "1"
    }
};

jQueryExtension.Window = {
    Maximize: function () {
        /// <summary>
        ///     1: 模拟窗口最大化打开。
        /// </summary>
        var WindowWidth, WindowHeight;
        if ($.browser.msie) {
            WindowWidth = jQueryExtension.AvailWidth() + 8;
            WindowHeight = jQueryExtension.AvailHeight() + 8;
            window.moveTo(-4, -4);
        } else {
            WindowWidth = jQueryExtension.AvailWidth();
            WindowHeight = jQueryExtension.AvailHeight();
            window.moveTo(0, 0);
        }
        window.resizeTo(WindowWidth, WindowHeight);
    }
    , TopWindow: function () {
        return window.top;
    }
    , Init: function (Properties) {
        /// <summary>
        ///     1: 窗体初始化。
        /// </summary>
        /// <param name="Properties" type="Options">
        ///     一组用于默认配置的键/值对。
        ///      1: IsFlash: jQueryExtension.IsFlash()                                     - 是否以flash效果展示。
        ///      2: Speed: jQueryExtension.Data.Settings.Speed                             - 动画完成的速度（毫秒）。
        ///      3: Frequency: jQueryExtension.Data.Settings.Frequency                     - 动画帧的频率（毫秒）。
        ///      4: HorizontalAlignment: jQueryExtension.Data.HorizontalAlignment.Stretch  - 水平方向的对齐方式。
        ///      5: VerticalAlignment: jQueryExtension.Data.VerticalAlignment.Stretch      - 垂直方向的对齐方式。
        ///      6: Top: 0                                                                 - 距离顶部的距离。
        ///      7: Right: 0                                                               - 距离右边的距离。
        ///      8: Bottom: 0                                                              - 距离底部的距离。
        ///      9: Left: 0                                                                - 距离左边的距离。
        ///     10: Width: -1                                                              - 宽度。
        ///     11: MinWidth: -1                                                           - 最小宽度。
        ///     12: Height: -1                                                             - 高度。
        ///     13: MinHeight: -1                                                          - 最小高度。
        /// </param>
        var Settings = {
            HorizontalAlignment: jQueryExtension.Data.HorizontalAlignment.Stretch
            , VerticalAlignment: jQueryExtension.Data.VerticalAlignment.Stretch
            , Top: 0
            , Right: 0
            , Bottom: 0
            , Left: 0
            , Width: -1
            , MinWidth: -1
            , Height: -1
            , MinHeight: -1
        };
        $.extend(Settings, Properties);

        var Width = 0, Height = 0, Top = 0, Left = 0;
        Width = Settings.Width < Settings.MinWidth ? Settings.MinWidth : Settings.Width;
        Height = Settings.Height < Settings.MinHeight ? Settings.MinHeight : Settings.Height;
        if (Width >= 0 && Settings.HorizontalAlignment == jQueryExtension.Data.HorizontalAlignment.Stretch) {
            Settings.HorizontalAlignment = jQueryExtension.Data.HorizontalAlignment.Center;
        };
        if (Height >= 0 && Settings.VerticalAlignment == jQueryExtension.Data.VerticalAlignment.Stretch) {
            Settings.VerticalAlignment = jQueryExtension.Data.VerticalAlignment.Center;
        };
        Width = Width < 0 ? 0 : Width;
        Height = Height < 0 ? 0 : Height;

        //计算距离上边的距离
        if (Settings.VerticalAlignment == jQueryExtension.Data.VerticalAlignment.Stretch) {
            Height = jQueryExtension.AvailHeight() - Settings.Top - Settings.Bottom;
            Top = Settings.Top;
        };
        if (Settings.VerticalAlignment == jQueryExtension.Data.VerticalAlignment.Top) {
            Top = Settings.Top;
        };
        if (Settings.VerticalAlignment == jQueryExtension.Data.VerticalAlignment.Bottom) {
            var MaxBottom = jQueryExtension.AvailHeight() - Height;
            Top = Settings.Bottom > MaxBottom ? 0 : (MaxBottom - Settings.Bottom);
        };
        if (Settings.VerticalAlignment == jQueryExtension.Data.VerticalAlignment.Center) {
            Top = (jQueryExtension.AvailHeight() - Height) / 2;
        };

        //计算距离左边的距离
        if (Settings.HorizontalAlignment == jQueryExtension.Data.HorizontalAlignment.Stretch) {
            Width = jQueryExtension.AvailWidth() - Settings.Left - Settings.Right;
            Left = Settings.Left;
        };
        if (Settings.HorizontalAlignment == jQueryExtension.Data.HorizontalAlignment.Left) {
            Left = Settings.Left;
        };
        if (Settings.HorizontalAlignment == jQueryExtension.Data.HorizontalAlignment.Right) {
            var MaxRight = jQueryExtension.AvailWidth() - Width;
            Left = Settings.Right > MaxRight ? 0 : (MaxRight - Settings.Right);
        };
        if (Settings.HorizontalAlignment == jQueryExtension.Data.HorizontalAlignment.Center) {
            Left = (jQueryExtension.AvailWidth() - Width) / 2;
        };

        window.moveTo(Left, Top);
        window.resizeTo(Width, Height);
    }
    , Open: function (Properties) {
        /// <summary>
        ///     1: 打开窗体。
        /// </summary>
        /// <param name="Properties" type="Options">
        ///     一组用于默认配置的键/值对。
        ///      1: IsFlash: jQueryExtension.IsFlash()                                     - 是否以flash效果展示。
        ///      2: Speed: jQueryExtension.Data.Settings.Speed                             - 动画完成的速度（毫秒）。
        ///      3: Frequency: jQueryExtension.Data.Settings.Frequency                     - 动画帧的频率（毫秒）。
        ///      4: IsRelative: false
        ///      5: Url: null
        ///      6: Name: "_blank"
        ///      6: Data: {}
        ///      7: HorizontalAlignment: jQueryExtension.Data.HorizontalAlignment.Stretch  - 水平方向的对齐方式。
        ///      8: VerticalAlignment: jQueryExtension.Data.VerticalAlignment.Stretch      - 垂直方向的对齐方式。
        ///      9: Top: 0                                                                 - 距离顶部的距离。
        ///     10: Right: 0                                                               - 距离右边的距离。
        ///     11: Bottom: 0                                                              - 距离底部的距离。
        ///     12: Left: 0                                                                - 距离左边的距离。
        ///     13: Width: -1                                                              - 宽度。
        ///     14: MinWidth: -1                                                           - 最小宽度。
        ///     15: Height: -1                                                             - 高度。
        ///     16: MinHeight: -1                                                          - 最小高度。
        ///     17: Fullscreen: false                                                      - 是否使用全屏模式显示浏览器
        ///     18: Location: false                                                        - 是否显示地址字段
        ///     19: Menubar: false                                                         - 是否显示菜单栏
        ///     20: Resizable: true                                                        - 是否窗口可以通过它的边界进行大小缩放控制
        ///     21: Scrollbars: true                                                       - 是否显示滚动条
        ///     22: Status: false                                                          - 是否添加状态栏
        ///     23: Titlebar: false                                                        - 是否显示标题栏
        ///     24: Toolbar: false                                                         - 是否显示浏览器的工具栏
        ///     25: Replace: false                                                         - 是否替换浏览历史中的当前条目
        ///     26: IsCloseWindow: false                                                   - 是否关闭当前窗口
        /// </param>
        var Settings = {
            IsFlash: jQueryExtension.IsFlash()
            , Speed: jQueryExtension.Data.Settings.Speed
            , Frequency: jQueryExtension.Data.Settings.Frequency
            , IsRelative: false
            , Url: null
            , Name: "_blank"
            , Data: {}
            , HorizontalAlignment: jQueryExtension.Data.HorizontalAlignment.Stretch
            , VerticalAlignment: jQueryExtension.Data.VerticalAlignment.Stretch
            , Top: 0
            , Right: 0
            , Bottom: 0
            , Left: 0
            , Width: -1
            , MinWidth: -1
            , Height: -1
            , MinHeight: -1
            , Fullscreen: false
            , Location: false
            , Menubar: false
            , Resizable: true
            , Scrollbars: true
            , Status: false
            , Titlebar: false
            , Toolbar: false
            , Replace: false
            , IsCloseWindow: false
        };
        $.extend(Settings, Properties);

        if (Settings.Url == null) {
            throw "Url地址不能为空";
        } else {
            var Parameters = $.param(Settings.Data).ReplaceAll("+", "%20");
            if (Parameters.length > 0) {
                if (Settings.Url.indexOf("?") > -1) {
                    Settings.Url += ("&" + Parameters);
                } else {
                    Settings.Url += ("?" + Parameters);
                };
            };
        };

        var WindowOpener;
        if (Settings.Fullscreen) {
            WindowOpener = window.open(Settings.Url, "", "fullscreen=yes,location=no,menubar=no,resizable=no,scrollbars=no,status=no,toolbar=no,titlebar=no");
            if (Settings.IsCloseWindow) {
                window.opener = null;
                window.open("", "_self");
                window.close();
            };
            WindowOpener.focus();
            return WindowOpener;
        };

        var Width = 0, Height = 0, Top = 0, Left = 0;
        Width = Settings.Width < Settings.MinWidth ? Settings.MinWidth : Settings.Width;
        Height = Settings.Height < Settings.MinHeight ? Settings.MinHeight : Settings.Height;
        if (Width >= 0 && Settings.HorizontalAlignment == jQueryExtension.Data.HorizontalAlignment.Stretch) {
            Settings.HorizontalAlignment = jQueryExtension.Data.HorizontalAlignment.Center;
        };
        if (Height >= 0 && Settings.VerticalAlignment == jQueryExtension.Data.VerticalAlignment.Stretch) {
            Settings.VerticalAlignment = jQueryExtension.Data.VerticalAlignment.Center;
        };
        Width = Width < 0 ? 0 : Width;
        Height = Height < 0 ? 0 : Height;

        //计算距离上边的距离
        if (Settings.VerticalAlignment == jQueryExtension.Data.VerticalAlignment.Stretch) {
            Height = jQueryExtension.AvailHeight() - Settings.Top - Settings.Bottom;
            Top = Settings.Top;
        };
        if (Settings.VerticalAlignment == jQueryExtension.Data.VerticalAlignment.Top) {
            Top = Settings.Top;
        };
        if (Settings.VerticalAlignment == jQueryExtension.Data.VerticalAlignment.Bottom) {
            var MaxBottom = jQueryExtension.AvailHeight() - Height;
            Top = Settings.Bottom > MaxBottom ? 0 : (MaxBottom - Settings.Bottom);
        };
        if (Settings.VerticalAlignment == jQueryExtension.Data.VerticalAlignment.Center) {
            Top = (jQueryExtension.AvailHeight() - Height) / 2;
        };

        //计算距离左边的距离
        if (Settings.HorizontalAlignment == jQueryExtension.Data.HorizontalAlignment.Stretch) {
            Width = jQueryExtension.AvailWidth() - Settings.Left - Settings.Right;
            Left = Settings.Left;
        };
        if (Settings.HorizontalAlignment == jQueryExtension.Data.HorizontalAlignment.Left) {
            Left = Settings.Left;
        };
        if (Settings.HorizontalAlignment == jQueryExtension.Data.HorizontalAlignment.Right) {
            var MaxRight = jQueryExtension.AvailWidth() - Width;
            Left = Settings.Right > MaxRight ? 0 : (MaxRight - Settings.Right);
        };
        if (Settings.HorizontalAlignment == jQueryExtension.Data.HorizontalAlignment.Center) {
            Left = (jQueryExtension.AvailWidth() - Width) / 2;
        };

        var Features = "";
        if (Settings.Location) {
            Features += ",location=yes";
        };
        if (Settings.Menubar) {
            Features += ",menubar=yes";
        };
        Features += ",resizable=" + (Settings.Resizable ? "yes" : "no");
        Features += ",scrollbars=" + (Settings.Scrollbars ? "yes" : "no");
        if (Settings.Status) {
            Features += ",status=yes";
        };
        if (Settings.Titlebar) {
            Features += ",titlebar=yes";
        };
        if (Settings.Toolbar) {
            Features += ",toolbar=yes";
        };
        if (Settings.IsRelative && $.browser.msie) {
            Left += window.screenLeft;
            Top += window.screenTop;
        };
        if ($.browser.msie) {
            Width = Width - 20;
            Height = Height - 42;
        } else {
            Width = Width - 20;
            Height = Height - 66;
        };
        Features += ",left=" + Left;
        Features += ",top=" + Top;
        Features += ",width=" + Width;
        Features += ",height=" + Height;
        WindowOpener = window.open(Settings.Url, Settings.Name, Features, Settings.Replace);
        if (Settings.IsCloseWindow) {
            window.opener = null;
            window.open("", "_self");
            window.close();
        };
        return WindowOpener;
    }

    , Close: function (Properties) {
        /// <summary>
        ///     1: 关闭窗体。
        /// </summary>
        /// <param name="Properties" type="Options">
        ///     一组用于默认配置的键/值对。
        ///      1: IsFlash: jQueryExtension.IsFlash()                                     - 是否以flash效果展示。
        ///      2: Speed: jQueryExtension.Data.Settings.Speed                             - 动画完成的速度（毫秒）。
        ///      3: Frequency: jQueryExtension.Data.Settings.Frequency                     - 动画帧的频率（毫秒）。
        /// </param>
        var Settings = {
            IsFlash: jQueryExtension.IsFlash()
            , Speed: jQueryExtension.Data.Settings.Speed
            , Frequency: jQueryExtension.Data.Settings.Frequency
        };
        $.extend(Settings, Properties);

        window.open("", "_self");
        window.close();
    }
    , Submit: function (Properties) {
        /// <summary>
        ///     打开页面时，动态创建表单提交
        /// </summary>
        /// <param name="Properties" type="Options">
        ///     一组用于默认配置的键/值对。
        ///      1: IsFlash: jQueryExtension.IsFlash() - 是否以flash效果展示。
        ///      2: Speed: jQueryExtension.Data.Settings.Speed - 动画完成的速度（毫秒）。
        ///      3: Frequency: jQueryExtension.Data.Settings.Frequency - 动画帧的频率（毫秒）。
        ///      4: IsHtmlPage: false - 是否是Html页面
        ///      5: Url: null - Form的Action属性，打开页面的URL地址
        ///      6: Name: "_blank" - Form的Target属性
        ///      7: Data: {} - 提交数据的键/值对
        /// </param>
        var Settings = {
            IsFlash: jQueryExtension.IsFlash()
            , Speed: jQueryExtension.Data.Settings.Speed
            , Frequency: jQueryExtension.Data.Settings.Frequency
            , IsHtmlPage: false
            , Url: null
            , Name: "_blank"
            , Data: {}
        };
        $.extend(Settings, Properties);

        if (Settings.Url == null || $.trim(Settings.Url).length < 1) {
            throw "Url地址不能为空";
        };

        Settings.Name = jExtension.WindowNameEncode(Settings.Name);

        if (Settings.IsHtmlPage) {
            var Parameters = $.param(Settings.Data).ReplaceAll("+", "%20");
            if (Parameters.length > 0) {
                if (Settings.Url.indexOf("?") > -1) {
                    Settings.Url += ("&" + Parameters);
                } else {
                    Settings.Url += ("?" + Parameters);
                };
            };
            window.open(Settings.Url, Settings.Name);
        } else {
            var Html = "<form method=\"post\" action=\"" + Settings.Url + "\" target=\"" + Settings.Name + "\">";
            for (var Object in Settings.Data) {
                Html += "<input type=\"hidden\" name=\"" + Object + "\" value=\"" + Settings.Data[Object] + "\" />";
            };
            Html += "</form>";
            $(Html).appendTo("body").submit().remove();
        };
    }
};

jQueryExtension.UI = {
    Layout: function (Properties) {
        /// <summary>
        ///     1: jQueryExtension.UI.Layout(Properties) - 布局。
        /// </summary>
        /// <param name="Properties" type="Options">
        ///     一组用于默认配置的键/值对。
        ///      1: IsFlash: jQueryExtension.IsFlash()                                     - 是否以flash效果展示。
        ///      2: Speed: jQueryExtension.Data.Settings.Speed                             - 动画完成的速度（毫秒）。
        ///      3: Frequency: jQueryExtension.Data.Settings.Frequency                     - 动画帧的频率（毫秒）。
        ///      4: Selector: null                                                         - （选择器）需要布局的元素。
        ///      5: HorizontalAlignment: jQueryExtension.Data.HorizontalAlignment.Stretch  - 水平方向的对齐方式。
        ///      6: VerticalAlignment: jQueryExtension.Data.VerticalAlignment.Stretch      - 垂直方向的对齐方式。
        ///      7: Top: 0                                                                 - 距离顶部的距离。
        ///      8: Right: 0                                                               - 距离右边的距离。
        ///      9: Bottom: 0                                                              - 距离底部的距离。
        ///     10: Left: 0                                                                - 距离左边的距离。
        ///     11: Width: -1                                                              - 宽度。
        ///     12: MinWidth: -1                                                           - 最小宽度。
        ///     13: Height: -1                                                             - 高度。
        ///     14: MinHeight: -1                                                          - 最小高度。
        ///     15: IsEventResize: false                                                   - 是否添加jQueryExtension_Event_Resize事件。
        ///     16: CallBack: function () { }                                              - 布局完成后的回调事件。
        ///     17: IsForeverLayout: false                                                 - 布局完成后的回调事件。
        ///     18: InSelector: document                                                   - 元素只能在规定的元素之内移动。
        ///     19: IsCanMoveOut: false                                                    - 是否能够移出规定的元素。
        /// </param>
        var Settings = {
            IsFlash: jQueryExtension.IsFlash()
            , Speed: jQueryExtension.Data.Settings.Speed
            , Frequency: jQueryExtension.Data.Settings.Frequency
            , Selector: null
            , HorizontalAlignment: jQueryExtension.Data.HorizontalAlignment.Stretch
            , VerticalAlignment: jQueryExtension.Data.VerticalAlignment.Stretch
            , Top: 0
            , Right: 0
            , Bottom: 0
            , Left: 0
            , Width: -1
            , MinWidth: -1
            , Height: -1
            , MinHeight: -1
            , IsEventResize: false
            , IsForeverLayout: false
            , InSelector: document
            , IsCanMoveOut: false
            , CallBack: function () { }
        };
        $.extend(Settings, Properties);

        var SelectorJQs = $(Settings.Selector);
        SelectorJQs.each(function () {
            var SelectorJQ = $(this);

            var WindowGuid = SelectorJQ.data("WindowGuid");
            if (WindowGuid == undefined) {
                WindowGuid = jQueryExtension.WindowGuid();
                SelectorJQ.data("WindowGuid", WindowGuid);
            };

            SelectorJQ.data("LayoutSettings", Settings);

            var jQueryExtension_Event_ResizeFunction = function (IsMustResize) {
                if (SelectorJQ.length > 0) {
                    SelectorJQ.css({ "position": "absolute" });
                    var LayoutSettings = SelectorJQ.data("LayoutSettings");
                    if (LayoutSettings == undefined) { return; };
                    var Width = 0, Height = 0, Top = 0, Left = 0;
                    Width = LayoutSettings.Width;
                    Height = LayoutSettings.Height;
                    //                    Width = LayoutSettings.Width < LayoutSettings.MinWidth ? LayoutSettings.MinWidth : LayoutSettings.Width;
                    //                    Height = LayoutSettings.Height < LayoutSettings.MinHeight ? LayoutSettings.MinHeight : LayoutSettings.Height;
                    if (Width >= 0 && LayoutSettings.HorizontalAlignment == jQueryExtension.Data.HorizontalAlignment.Stretch) {
                        LayoutSettings.HorizontalAlignment = jQueryExtension.Data.HorizontalAlignment.Center;
                    };
                    if (Height >= 0 && LayoutSettings.VerticalAlignment == jQueryExtension.Data.VerticalAlignment.Stretch) {
                        LayoutSettings.VerticalAlignment = jQueryExtension.Data.VerticalAlignment.Center;
                    };
                    Width = Width < 0 ? 0 : Width;
                    Height = Height < 0 ? 0 : Height;

                    //计算距离上边的距离
                    if (LayoutSettings.VerticalAlignment == jQueryExtension.Data.VerticalAlignment.Stretch) {
                        Height = jQueryExtension.ClientHeight() - LayoutSettings.Top - LayoutSettings.Bottom;
                        Top = LayoutSettings.Top;
                    };
                    if (LayoutSettings.VerticalAlignment == jQueryExtension.Data.VerticalAlignment.Top) {
                        Top = LayoutSettings.Top;
                    };
                    if (LayoutSettings.VerticalAlignment == jQueryExtension.Data.VerticalAlignment.Bottom) {
                        var MaxBottom = jQueryExtension.ClientHeight() - Height;
                        Top = LayoutSettings.Bottom > MaxBottom ? 0 : (MaxBottom - LayoutSettings.Bottom);
                    };
                    if (LayoutSettings.VerticalAlignment == jQueryExtension.Data.VerticalAlignment.Center) {
                        Top = (jQueryExtension.ClientHeight() - Height) / 2;
                    };

                    //计算距离左边的距离
                    if (LayoutSettings.HorizontalAlignment == jQueryExtension.Data.HorizontalAlignment.Stretch) {
                        Width = jQueryExtension.ClientWidth() - LayoutSettings.Left - LayoutSettings.Right;
                        Left = LayoutSettings.Left;
                    };
                    if (LayoutSettings.HorizontalAlignment == jQueryExtension.Data.HorizontalAlignment.Left) {
                        Left = LayoutSettings.Left;
                    };
                    if (LayoutSettings.HorizontalAlignment == jQueryExtension.Data.HorizontalAlignment.Right) {
                        var MaxRight = jQueryExtension.ClientWidth() - Width;
                        Left = LayoutSettings.Right > MaxRight ? 0 : (MaxRight - LayoutSettings.Right);
                    };
                    if (LayoutSettings.HorizontalAlignment == jQueryExtension.Data.HorizontalAlignment.Center) {
                        Left = (jQueryExtension.ClientWidth() - Width) / 2;
                    };

                    if (!LayoutSettings.IsCanMoveOut) {
                        var MinTop, MinLeft, MaxTop, MaxLeft;
                        var InSelectorTop = 0;
                        var InSelectorLeft = 0;
                        var InSelectorWidth = 0;
                        var InSelectorHeight = 0;
                        var InSelectorJQ = $(LayoutSettings.InSelector);
                        if (InSelectorJQ[0].nodeType == 9) {
                            InSelectorWidth = InSelectorJQ.width();
                            InSelectorHeight = InSelectorJQ.height();
                        } else {
                            var InSelectorPosition = jQueryExtension.Position(InSelectorJQ);
                            var InSelectorBox = jQueryExtension.Box(InSelectorJQ);
                            InSelectorTop = InSelectorPosition.AbsoluteTop;
                            InSelectorLeft = InSelectorPosition.AbsoluteLeft;
                            InSelectorWidth = InSelectorBox.Width(jQueryExtension.Data.BoxInternalStructure.Border);
                            InSelectorHeight = InSelectorBox.Height(jQueryExtension.Data.BoxInternalStructure.Border);
                        };
                        MinTop = InSelectorTop;
                        MinLeft = InSelectorLeft;
                        MaxTop = InSelectorTop + InSelectorHeight - Height;
                        MaxLeft = InSelectorLeft + InSelectorWidth - Width;
                        if (MaxLeft < MinLeft) {
                            MaxLeft = MinLeft;
                        };
                        if (MaxTop < MinTop) {
                            MaxTop = MinTop;
                        };

                        var MarginTop = parseInt(SelectorJQ.css("margin-top"));
                        var MarginLeft = parseInt(SelectorJQ.css("margin-left"));
                        if (Top < MinTop) {
                            Top = MinTop;
                        };
                        if (MarginTop < 0 && MarginTop + Top < 0) {
                            SelectorJQ.css("margin-top", (-Top) + "px");
                        };
                        if (Top > MaxTop) {
                            Top = MaxTop;
                        };
                        if (MarginTop > 0 && MarginTop - Top > 0) {
                            SelectorJQ.css("margin-top", Top + "px");
                        };
                        if (Left < MinLeft) {
                            Left = MinLeft;
                        };
                        if (MarginLeft < 0 && MarginLeft + Left < 0) {
                            SelectorJQ.css("margin-left", (-Left) + "px");
                        };
                        if (Left > MaxLeft) {
                            Left = MaxLeft;
                        };
                        if (MarginLeft > 0 && MarginLeft - Left > 0) {
                            SelectorJQ.css("margin-left", Left + "px");
                        };
                    };

                    Width = Width >= LayoutSettings.MinWidth ? Width : LayoutSettings.MinWidth;
                    Height = Height >= LayoutSettings.MinHeight ? Height : LayoutSettings.MinHeight;
                    SelectorJQ.animate({ "null": "null" }, 1).animate(
                    {
                        "top": (jQueryExtension.ScrollTop(window) + Top) + "px"
                        , "left": (jQueryExtension.ScrollLeft(window) + Left) + "px"
                        , "width": Width + "px"
                        , "height": Height + "px"
                    }
                    , LayoutSettings.IsFlash ? LayoutSettings.Speed : 0
                    , function () {
                        if (LayoutSettings.IsEventResize) { SelectorJQ.triggerHandler("jQueryExtension_Event_Resize"); };
                        if ($.isFunction(LayoutSettings.CallBack)) { LayoutSettings.CallBack({ Selector: SelectorJQ }); };
                    }
                );
                    var queues = SelectorJQ.queue();
                    if (queues[queues.length - 1] != "inprogress") {
                        SelectorJQ.clearQueue("Layout").queue("Layout", queues.pop());
                        SelectorJQ.dequeue("Layout");
                    };
                } else {
                    $(window).unbind("scroll", jQueryExtension.Event(WindowGuid));
                    $(window).unbind("resize", jQueryExtension.Event(WindowGuid));
                    jQueryExtension.RemoveEvent(WindowGuid);
                };
            };

            if (jQueryExtension.Event(WindowGuid) != undefined) {
                $(window).unbind("scroll", jQueryExtension.Event(WindowGuid));
                $(window).unbind("resize", jQueryExtension.Event(WindowGuid));
                jQueryExtension.RemoveEvent(WindowGuid);
            };

            if (Settings.IsForeverLayout) {
                jQueryExtension.Event(WindowGuid, jQueryExtension_Event_ResizeFunction);
                var LastClientWidth = -1;
                var LastClientHeight = -1;
                $(window).bind("resize", function () {
                    var ClientWidth = jQueryExtension.ClientWidth();
                    var ClientHeight = jQueryExtension.ClientHeight();
                    if (ClientWidth != LastClientWidth || ClientHeight != LastClientHeight) {
                        LastClientWidth = ClientWidth;
                        LastClientHeight = ClientHeight;
                        var EventFunction = jQueryExtension.Event(WindowGuid);
                        if (EventFunction) {
                            EventFunction();
                        };
                    };
                });
                //                $(window).bind("resize", jQueryExtension.Event(WindowGuid));
                $(window).bind("scroll", jQueryExtension.Event(WindowGuid));
            };

            jQueryExtension_Event_ResizeFunction(true);
        });
    }
    , IsCanDrag: true
    , Drag: function (Properties) {
        /// <summary>
        ///     让一个元素可以在页面上拖动。
        /// </summary>
        /// <param name="Properties" type="Options">
        ///     一组用于默认配置的键/值对。
        ///      1: IsFlash: jQueryExtension.IsFlash()                                     - 是否以flash效果展示。
        ///      2: Speed: jQueryExtension.Data.Settings.Speed                             - 动画完成的速度（毫秒）。
        ///      3: Frequency: jQueryExtension.Data.Settings.Frequency                     - 动画帧的频率（毫秒）。
        ///      4: Selector: null                                                         - （选择器）需要拖动的元素。
        ///      5: Handler: null                                                          - （选择器）用于引起拖动的元素。
        ///      6: BorderWidth: 1                                                         - 拖动框的边框宽度。
        ///      7: MoveCondition: function () { return true }                             - 能够移动的条件。
        ///      8: InSelector: document                                                   - 元素只能在规定的元素之内移动。
        ///      9: IsCanMoveOut: false                                                    - 是否能够移出规定的元素。            
        ///     10: IsNeedSelfMove: true                                                   - 是否需要自身完成拖动。
        ///     11: CallBack: function () { }                                              - 拖动完成后的回调事件。
        /// </param>
        var Settings = {
            IsFlash: jQueryExtension.IsFlash()
            , Speed: jQueryExtension.Data.Settings.Speed
            , Frequency: jQueryExtension.Data.Settings.Frequency
            , Selector: null
            , Handler: null
            , BorderWidth: 1
            , MoveCondition: function () { return true }
            , InSelector: document
            , IsCanMoveOut: false
            , IsNeedSelfMove: false
            , MouseDownMillisecond: 0
            , CallBack: function () { }
        };
        $.extend(Settings, Properties);

        if (!Settings.IsFlash) {
            Settings.Speed = 0;
        };
        if (Settings.IsNeedSelfMove) {
            Settings.BorderWidth = 0;
        };

        var SelectorJQs = $(Settings.Selector);
        SelectorJQs.each(function () {
            var SelectorJQ = $(this);
            var HandlerJQ = $(Settings.Handler);
            if (HandlerJQ.length < 1) {
                HandlerJQ = SelectorJQ;
            };

            var MouseDownMillisecond = 0;
            var MouseDownTimeFunction = null;
            var HandlerJS = null;
            var documentJQ = $(document);
            var MouseMoveTimeFunction = null;
            var MouseUpTimeFunction = null;

            if (Settings.MouseDownMillisecond <= MouseDownMillisecond) {
                HandlerJQ.bind("mouseover", function (e) {
                    if ($.isFunction(Settings.MoveCondition) && Settings.MoveCondition()) {
                        if (HandlerJQ.data("CursorStyle") == undefined) {
                            HandlerJQ.data("CursorStyle", HandlerJQ.css("cursor"));
                        };
                        HandlerJQ.css({ "cursor": "move" });
                    } else {
                        if (HandlerJQ.data("CursorStyle") != undefined) {
                            HandlerJQ.css("cursor", HandlerJQ.data("CursorStyle"));
                        };
                    };
                })
            };
            HandlerJQ.bind("mousedown", function (e) {
                MouseMoveTimeFunction = function () {
                    documentJQ.unbind("mousemove", MouseMoveTimeFunction);
                    documentJQ.unbind("mouseup", MouseUpTimeFunction);
                    if (MouseDownTimeFunction != null) {
                        clearInterval(MouseDownTimeFunction);
                    };
                };
                documentJQ.bind("mousemove", MouseMoveTimeFunction);
                MouseUpTimeFunction = function () {
                    documentJQ.unbind("mousemove", MouseMoveTimeFunction);
                    documentJQ.unbind("mouseup", MouseUpTimeFunction);
                    if (HandlerJQ.data("CursorStyle") != undefined) {
                        HandlerJQ.css("cursor", HandlerJQ.data("CursorStyle"));
                    };
                    if (MouseDownTimeFunction != null) {
                        clearInterval(MouseDownTimeFunction);
                    };
                };
                documentJQ.bind("mouseup", MouseUpTimeFunction);

                MouseDownMillisecond = 0;
                HandlerJS = this;

                var DragFunction = function () {
                    //判断是否按下鼠标左键
                    var IsMouseLeftDown = false;
                    if ($.browser.msie) {
                        IsMouseLeftDown = (e.button == "1");
                    } else {
                        IsMouseLeftDown = (e.button == "0");
                    };
                    if (!IsMouseLeftDown) { return; };
                    if (jQueryExtension.UI.IsCanDrag && IsMouseLeftDown && $.isFunction(Settings.MoveCondition) && Settings.MoveCondition()) {
                        if (HandlerJQ.data("CursorStyle") == undefined) {
                            HandlerJQ.data("CursorStyle", HandlerJQ.css("cursor"));
                        };
                        //                        HandlerJQ.css({ "cursor": "move" });

                        jQueryExtension.UI.IsCanDrag = false;
                        var SelectorPosition = jQueryExtension.Position(SelectorJQ);
                        var SelectorBox = jQueryExtension.Box(SelectorJQ);
                        var SelectorWidth = SelectorBox.Width(jQueryExtension.Data.BoxInternalStructure.Border);
                        var SelectorHeight = SelectorBox.Height(jQueryExtension.Data.BoxInternalStructure.Border);
                        //获取标签的对齐方式
                        var LayoutSettings = jQueryExtension.LayoutSettings(SelectorJQ);
                        //获取鼠标按下时距离标签顶部的距离
                        var MouseRelativeTop = e.pageY - SelectorPosition.AbsoluteTop;
                        //获取鼠标按下时距离标签左边的距离
                        var MouseRelativeLeft = e.pageX - SelectorPosition.AbsoluteLeft;
                        //创建一个隔离层，让拖动层拖动时不会触发其他标签
                        var jQueryExtension_UI_Window_DragFlexLockJQ = $("<div></div>").css({ "position": "absolute", "zIndex": SelectorPosition.zIndex + 1, "top": "0px", "right": "0px", "bottom": "0px", "left": "0px", "background-color": "White", "opacity": 0.0 }).appendTo("body");
                        //创建一个模拟拖动结果的层
                        var jQueryExtension_UI_Window_DragFlexJQ = $("<div></div>").css({ "position": "absolute", "zIndex": SelectorPosition.zIndex + 2, "left": SelectorPosition.AbsoluteLeft + "px", "top": SelectorPosition.AbsoluteTop + "px", "width": SelectorWidth - 2 * Settings.BorderWidth + "px", "height": SelectorHeight - 2 * Settings.BorderWidth + "px", "border": Settings.BorderWidth + "px dashed #000000" }).appendTo("body");
                        //设置鼠标的移动是基于document对象的移动

                        //开启Capture监控
                        if ($.browser.msie) {
                            HandlerJS.setCapture();
                        } else if ($.browser.mozilla) {
                            window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                        };
                        var MinTop, MinLeft, MaxTop, MaxLeft;
                        if (!Settings.IsCanMoveOut) {
                            var InSelectorTop = 0;
                            var InSelectorLeft = 0;
                            var InSelectorWidth = 0;
                            var InSelectorHeight = 0;
                            var InSelectorJQ = $(Settings.InSelector);
                            if (InSelectorJQ[0].nodeType == 9) {
                                InSelectorWidth = InSelectorJQ.width();
                                InSelectorHeight = InSelectorJQ.height();
                            } else {
                                var InSelectorPosition = jQueryExtension.Position(InSelectorJQ);
                                var InSelectorBox = jQueryExtension.Box(InSelectorJQ);
                                InSelectorTop = InSelectorPosition.AbsoluteTop;
                                InSelectorLeft = InSelectorPosition.AbsoluteLeft;
                                InSelectorWidth = InSelectorBox.Width(jQueryExtension.Data.BoxInternalStructure.Border);
                                InSelectorHeight = InSelectorBox.Height(jQueryExtension.Data.BoxInternalStructure.Border);
                            };
                            MinTop = InSelectorTop;
                            MinLeft = InSelectorLeft;
                            MaxTop = InSelectorTop + InSelectorHeight - SelectorHeight;
                            MaxLeft = InSelectorLeft + InSelectorWidth - SelectorWidth;
                        };
                        var LastTop = SelectorPosition.AbsoluteTop;
                        var LastLeft = SelectorPosition.AbsoluteLeft;
                        //鼠标移动执行事件
                        var mousemoveFunction = function (e) {
                            //计算模拟拖动结果的层的Top值
                            var DragFlexTop = e.pageY - MouseRelativeTop;
                            //计算模拟拖动结果的层的Left值
                            var DragFlexLeft = e.pageX - MouseRelativeLeft;
                            //当限制拖动范围时,判断是否在限制元素内
                            if (!Settings.IsCanMoveOut && (MinTop > DragFlexTop || DragFlexTop > MaxTop || MinLeft > DragFlexLeft || DragFlexLeft > MaxLeft)) {
                                //当不允许标签移除窗体的时候计算Top和Left值
                                if (DragFlexTop < MinTop && DragFlexTop - LastTop < 0) {
                                    DragFlexTop = LastTop > MinTop ? MinTop : LastTop;
                                };
                                if (DragFlexTop > MaxTop && DragFlexTop - LastTop > 0) {
                                    DragFlexTop = LastTop < MaxTop ? MaxTop : LastTop;
                                };
                                if (DragFlexLeft < MinLeft && DragFlexLeft - LastLeft < 0) {
                                    DragFlexLeft = LastLeft > MinLeft ? MinLeft : LastLeft;
                                };
                                if (DragFlexLeft > MaxLeft && DragFlexLeft - LastLeft > 0) {
                                    DragFlexLeft = LastLeft < MaxLeft ? MaxLeft : LastLeft;
                                };
                            };
                            LastTop = DragFlexTop;
                            LastLeft = DragFlexLeft;
                            jQueryExtension_UI_Window_DragFlexJQ.css({
                                "left": LastLeft + "px"
                            , "top": LastTop + "px"
                            });

                            if (Settings.IsNeedSelfMove) {
                                var RelativeY = LastTop - SelectorPosition.AbsoluteTop;
                                var RelativeX = LastLeft - SelectorPosition.AbsoluteLeft;
                                var cssSettings = {};
                                cssSettings["margin-top"] = (SelectorBox.MarginTop + RelativeY) + "px";
                                cssSettings["margin-left"] = (SelectorBox.MarginLeft + RelativeX) + "px";
                                SelectorJQ.css(cssSettings);

                                if ($.isFunction(Settings.CallBack)) {
                                    Settings.CallBack({ X: (SelectorBox.MarginLeft + RelativeX), Y: (SelectorBox.MarginTop + RelativeY) });
                                };
                            };
                        };

                        //鼠标松开执行事件
                        var mouseupFunction = function (e) {
                            if (HandlerJQ.data("CursorStyle") != undefined) {
                                HandlerJQ.css("cursor", HandlerJQ.data("CursorStyle"));
                            };
                            documentJQ.unbind("mousemove", mousemoveFunction);
                            documentJQ.unbind("mouseup", mouseupFunction);
                            if ($.browser.msie) {
                                HandlerJS.releaseCapture();
                            } else if ($.browser.mozilla) {
                                window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                            };

                            var DragFlexPosition = jQueryExtension.Position(jQueryExtension_UI_Window_DragFlexJQ);
                            jQueryExtension_UI_Window_DragFlexJQ.remove();
                            jQueryExtension_UI_Window_DragFlexLockJQ.remove();

                            if (!Settings.IsNeedSelfMove) {
                                var RelativeY = DragFlexPosition.AbsoluteTop - SelectorPosition.AbsoluteTop;
                                var RelativeX = DragFlexPosition.AbsoluteLeft - SelectorPosition.AbsoluteLeft;
                                var cssSettings = {};
                                //                            switch (LayoutSettings.HorizontalAlignment) {
                                //                                case jQueryExtension.Data.HorizontalAlignment.Stretch:
                                //                                    cssSettings["margin-right"] = (SelectorBox.MarginRight - RelativeX) + "px";
                                //                                    cssSettings["margin-left"] = (SelectorBox.MarginLeft + RelativeX) + "px";
                                //                                    break;
                                //                                case jQueryExtension.Data.HorizontalAlignment.Right:
                                //                                    cssSettings["margin-right"] = (SelectorBox.MarginRight - RelativeX) + "px";
                                //                                    break;
                                //                                default:
                                //                                    cssSettings["margin-left"] = (SelectorBox.MarginLeft + RelativeX) + "px";
                                //                                    break;
                                //                            };
                                //                            switch (LayoutSettings.VerticalAlignment) {
                                //                                case jQueryExtension.Data.VerticalAlignment.Stretch:
                                //                                    cssSettings["margin-top"] = (SelectorBox.MarginTop + RelativeY) + "px";
                                //                                    cssSettings["margin-bottom"] = (SelectorBox.MarginBottom - RelativeY) + "px";
                                //                                    break;
                                //                                case jQueryExtension.Data.VerticalAlignment.Bottom:
                                //                                    cssSettings["margin-bottom"] = (SelectorBox.MarginBottom - RelativeY) + "px";
                                //                                    break;
                                //                                default:
                                //                                    cssSettings["margin-top"] = (SelectorBox.MarginTop + RelativeY) + "px";
                                //                                    break;
                                //                            };

                                cssSettings["margin-top"] = (SelectorBox.MarginTop + RelativeY) + "px";
                                cssSettings["margin-left"] = (SelectorBox.MarginLeft + RelativeX) + "px";
                                SelectorJQ.animate({ "null": "null" }, 1).animate(
                                    cssSettings
                                    , Settings.Speed
                                    , function () { jQueryExtension.UI.IsCanDrag = true; if ($.isFunction(Settings.CallBack)) { Settings.CallBack({ X: (SelectorBox.MarginLeft + RelativeX), Y: (SelectorBox.MarginTop + RelativeY) }); }; }
                                );
                                var queues = SelectorJQ.queue();
                                if (queues[queues.length - 1] != "inprogress") {
                                    SelectorJQ.clearQueue("Drag").queue("Drag", queues.pop());
                                    SelectorJQ.dequeue("Drag");
                                };
                            } else {
                                jQueryExtension.UI.IsCanDrag = true;
                            };
                        };

                        //绑定鼠标移动和松开事件MouseUpTimeFunction
                        documentJQ.unbind('mousemove', MouseMoveTimeFunction).bind('mousemove', mousemoveFunction).unbind('mouseup', MouseUpTimeFunction).bind('mouseup', mouseupFunction);
                    };
                };

                if (Settings.MouseDownMillisecond <= MouseDownMillisecond) {
                    DragFunction();
                } else {
                    MouseDownTimeFunction = setInterval(function () {
                        MouseDownMillisecond += 100;
                        if (Settings.MouseDownMillisecond <= MouseDownMillisecond) {
                            clearInterval(MouseDownTimeFunction);

                            DragFunction();
                        };
                    }, 100);
                };
            });
        });
    }
    , IsCanResize: true
    , Resize: function (Properties) {
        /// <summary>
        ///     元素通过拖动的方式改变大小。
        /// </summary>
        /// <param name="Properties" type="Options">
        ///     一组用于默认配置的键/值对。
        ///      1: IsFlash: jQueryExtension.IsFlash()                                     - 是否以flash效果展示。
        ///      2: Speed: jQueryExtension.Data.Settings.Speed                             - 动画完成的速度（毫秒）。
        ///      3: Frequency: jQueryExtension.Data.Settings.Frequency                     - 动画帧的频率（毫秒）。
        ///      4: Selector: null                                                         - （选择器）需要改变大小的元素。
        ///      5: Handler: null                                                          - （选择器）用于引起改变大小的元素。
        ///      6: Direction: jQueryExtension.Data.Direction.RightBottom                  - 拖动的方向。
        ///      7: BorderWidth: 1                                                         - 拖动框的边框宽度。
        ///      8: MinWidth: 200                                                          - 最小宽度。
        ///      9: MinHeight: 100                                                         - 最小高度。
        ///     10: MoveCondition: function() { return true }                              - 能够移动的条件。
        ///     11: InSelector: document                                                   - 元素只能在规定的元素之内移动。
        ///     12: IsCanMoveOut: false                                                    - 是否能够移出窗体左上角。            
        ///     13: OnMouseDown: function () { }                                           - 鼠标按下。
        ///     14: IsNeedSelfResize: function () { }                                      - 是否需要自动改变大小，如果false则自己在CallBack事件中完成。
        ///     15: CallBack: function () { }                                              - 大小改变后的回调事件。
        /// </param>
        var Settings = {
            IsFlash: jQueryExtension.IsFlash()
            , Speed: jQueryExtension.Data.Settings.Speed
            , Frequency: jQueryExtension.Data.Settings.Frequency
            , Selector: null
            , Handler: null
            , Direction: jQueryExtension.Data.Direction.RightBottom
            , BorderWidth: 1
            , MinWidth: 200
            , MinHeight: 100
            , MoveCondition: function () { return true }
            , InSelector: document
            , OnMouseDown: function () { }
            , IsCanMoveOut: false
            , IsNeedSelfResize: function () { }
            , CallBack: function () { }
        };
        $.extend(Settings, Properties);

        if (!Settings.IsFlash) {
            Settings.Speed = 0;
        };

        var SelectorJQs = $(Settings.Selector);
        SelectorJQs.each(function () {
            var SelectorJQ = $(this);
            var HandlerJQ = $(Settings.Handler);
            if (HandlerJQ.length < 1) {
                HandlerJQ = SelectorJQ;
            };

            HandlerJQ.bind("mouseover", function (e) {
                if ($.isFunction(Settings.MoveCondition) && Settings.MoveCondition()) {
                    var cursor;
                    switch (Settings.Direction) { case jQueryExtension.Data.Direction.Top: cursor = "n-resize"; break; case jQueryExtension.Data.Direction.Bottom: cursor = "n-resize"; break; case jQueryExtension.Data.Direction.Left: cursor = "w-resize"; break; case jQueryExtension.Data.Direction.Right: cursor = "w-resize"; break; case jQueryExtension.Data.Direction.LeftTop: cursor = "nw-resize"; break; case jQueryExtension.Data.Direction.LeftBottom: cursor = "ne-resize"; break; case jQueryExtension.Data.Direction.RightTop: cursor = "ne-resize"; break; case jQueryExtension.Data.Direction.RightBottom: cursor = "nw-resize"; break; };
                    $(this).css({ "cursor": cursor });
                } else {
                    $(this).css({ "cursor": "Default" });
                };
            }).bind("mousedown", function (e) {
                var IsMouseLeftDown = false;
                if ($.browser.msie) {
                    IsMouseLeftDown = (e.button == "1");
                } else {
                    IsMouseLeftDown = (e.button == "0");
                };
                if (jQueryExtension.UI.IsCanResize && IsMouseLeftDown && $.isFunction(Settings.MoveCondition) && Settings.MoveCondition()) {
                    jQueryExtension.UI.IsCanResize = false;
                    var SelectorPosition = jQueryExtension.Position(SelectorJQ);
                    var SelectorBox = jQueryExtension.Box(SelectorJQ);
                    var SelectorWidth = SelectorBox.Width(jQueryExtension.Data.BoxInternalStructure.Border);
                    var SelectorHeight = SelectorBox.Height(jQueryExtension.Data.BoxInternalStructure.Border);
                    //获取标签的对齐方式
                    var LayoutSettings = jQueryExtension.LayoutSettings(SelectorJQ);
                    //获取鼠标按下时距离标签左边以及顶部的距离
                    var MouseRelativeLeft, MouseRelativeTop;
                    switch (Settings.Direction) { case jQueryExtension.Data.Direction.Top: MouseRelativeTop = e.pageY - (SelectorPosition.AbsoluteTop); break; case jQueryExtension.Data.Direction.Bottom: MouseRelativeTop = e.pageY - (SelectorPosition.AbsoluteTop + SelectorBox.Height(jQueryExtension.Data.BoxInternalStructure.Border)); break; case jQueryExtension.Data.Direction.Left: MouseRelativeLeft = e.pageX - SelectorPosition.AbsoluteLeft; break; case jQueryExtension.Data.Direction.Right: MouseRelativeLeft = e.pageX - (SelectorPosition.AbsoluteLeft + SelectorBox.Width(jQueryExtension.Data.BoxInternalStructure.Border)); break; case jQueryExtension.Data.Direction.LeftTop: MouseRelativeLeft = e.pageX - SelectorPosition.AbsoluteLeft; MouseRelativeTop = e.pageY - (SelectorPosition.AbsoluteTop); break; case jQueryExtension.Data.Direction.LeftBottom: MouseRelativeLeft = e.pageX - SelectorPosition.AbsoluteLeft; MouseRelativeTop = e.pageY - (SelectorPosition.AbsoluteTop + SelectorBox.Height(jQueryExtension.Data.BoxInternalStructure.Border)); break; case jQueryExtension.Data.Direction.RightTop: MouseRelativeLeft = e.pageX - (SelectorPosition.AbsoluteLeft + SelectorBox.Width(jQueryExtension.Data.BoxInternalStructure.Border)); MouseRelativeTop = e.pageY - (SelectorPosition.AbsoluteTop); break; case jQueryExtension.Data.Direction.RightBottom: MouseRelativeLeft = e.pageX - (SelectorPosition.AbsoluteLeft + SelectorBox.Width(jQueryExtension.Data.BoxInternalStructure.Border)); MouseRelativeTop = e.pageY - (SelectorPosition.AbsoluteTop + SelectorBox.Height(jQueryExtension.Data.BoxInternalStructure.Border)); break; };

                    //创建一个隔离层，让拖动层拖动时不会触发其他标签
                    var jQueryExtension_UI_Window_ResizeFlexLockJQ = $("<div></div>").css({ "position": "absolute", "zIndex": SelectorPosition.zIndex + 1, "top": "0px", "right": "0px", "bottom": "0px", "left": "0px", "background-color": "White", "opacity": 0.0 }).appendTo("body");
                    //创建一个模拟拖动结果的层
                    var jQueryExtension_UI_Window_ResizeFlexJQ = $("<div></div>").css({ "position": "absolute", "zIndex": SelectorPosition.zIndex + 2, "left": SelectorPosition.AbsoluteLeft + "px", "top": SelectorPosition.AbsoluteTop + "px", "width": SelectorWidth - 2 * Settings.BorderWidth + "px", "height": SelectorHeight - 2 * Settings.BorderWidth + "px", "border": Settings.BorderWidth + "px dashed #000000" }).appendTo("body");
                    //设置鼠标的移动是基于document对象的移动
                    var documentJQ = $(document);

                    //开启Capture监控
                    if ($.browser.msie) {
                        this.setCapture();
                    } else if ($.browser.mozilla) {
                        window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                    };

                    //                                                var LastTop = SelectorPosition.AbsoluteTop;
                    //                        var LastLeft = SelectorPosition.AbsoluteLeft;
                    //                        //鼠标移动执行事件
                    //                        var mousemoveFunction = function (e) {
                    //                            //计算模拟拖动结果的层的Top值
                    //                            var DragFlexTop = e.pageY - MouseRelativeTop;
                    //                            //计算模拟拖动结果的层的Left值
                    //                            var DragFlexLeft = e.pageX - MouseRelativeLeft;
                    //                            //当限制拖动范围时,判断是否在限制元素内
                    //                            if (!Settings.IsCanMoveOut && (MinTop > DragFlexTop || DragFlexTop > MaxTop || MinLeft > DragFlexLeft || DragFlexLeft > MaxLeft)) {
                    //                                //当不允许标签移除窗体的时候计算Top和Left值
                    //                                if (DragFlexTop < MinTop && DragFlexTop - LastTop < 0) {
                    //                                    DragFlexTop = LastTop > MinTop ? MinTop : LastTop;
                    //                                };
                    //                                if (DragFlexTop > MaxTop && DragFlexTop - LastTop > 0) {
                    //                                    DragFlexTop = LastTop < MaxTop ? MaxTop : LastTop;
                    //                                };
                    //                                if (DragFlexLeft < MinLeft && DragFlexLeft - LastLeft < 0) {
                    //                                    DragFlexLeft = LastLeft > MinLeft ? MinLeft : LastLeft;
                    //                                };
                    //                                if (DragFlexLeft > MaxLeft && DragFlexLeft - LastLeft > 0) {
                    //                                    DragFlexLeft = LastLeft < MaxLeft ? MaxLeft : LastLeft;
                    //                                };
                    //                            };
                    //                            LastTop = DragFlexTop;
                    //                            LastLeft = DragFlexLeft;

                    var LastTop = SelectorPosition.AbsoluteTop;
                    var LastLeft = SelectorPosition.AbsoluteLeft;
                    //鼠标移动执行事件
                    var mousemoveFunction = function (e) {
                        var ResizeFlexPosition = jQueryExtension.Position(jQueryExtension_UI_Window_ResizeFlexJQ);
                        var ResizeFlexBox = jQueryExtension.Box(jQueryExtension_UI_Window_ResizeFlexJQ);
                        var ResizeFlexLeft = ResizeFlexPosition.AbsoluteLeft;
                        var ResizeFlexTop = ResizeFlexPosition.AbsoluteTop;
                        var ResizeFlexWidth = ResizeFlexBox.Width(jQueryExtension.Data.BoxInternalStructure.Border);
                        var ResizeFlexHeight = ResizeFlexBox.Height(jQueryExtension.Data.BoxInternalStructure.Border);
                        switch (Settings.Direction) {
                            case jQueryExtension.Data.Direction.LeftTop:
                                ResizeFlexLeft = e.clientX - MouseRelativeLeft;
                                ResizeFlexTop = e.clientY - MouseRelativeTop;
                                ResizeFlexWidth = SelectorWidth + (SelectorPosition.AbsoluteLeft - ResizeFlexLeft);
                                ResizeFlexHeight = SelectorHeight + (SelectorPosition.AbsoluteTop - ResizeFlexTop);
                                break;
                            case jQueryExtension.Data.Direction.Top:
                                ResizeFlexTop = e.clientY - MouseRelativeTop;
                                ResizeFlexHeight = SelectorHeight + (SelectorPosition.AbsoluteTop - ResizeFlexTop);
                                break;
                            case jQueryExtension.Data.Direction.RightTop:
                                ResizeFlexTop = e.clientY - MouseRelativeTop;
                                ResizeFlexWidth = e.clientX - ResizeFlexPosition.AbsoluteLeft - MouseRelativeLeft;
                                ResizeFlexHeight = SelectorHeight + (SelectorPosition.AbsoluteTop - ResizeFlexTop);
                                break;
                            case jQueryExtension.Data.Direction.Right:
                                ResizeFlexWidth = e.clientX - ResizeFlexPosition.AbsoluteLeft - MouseRelativeLeft;
                                break;
                            case jQueryExtension.Data.Direction.RightBottom:
                                ResizeFlexWidth = e.clientX - ResizeFlexPosition.AbsoluteLeft - MouseRelativeLeft;
                                ResizeFlexHeight = e.clientY - ResizeFlexPosition.AbsoluteTop - MouseRelativeTop;
                                break;
                            case jQueryExtension.Data.Direction.Bottom:
                                ResizeFlexHeight = e.clientY - ResizeFlexPosition.AbsoluteTop - MouseRelativeTop;
                                break;
                            case jQueryExtension.Data.Direction.LeftBottom:
                                ResizeFlexLeft = e.clientX - MouseRelativeLeft;
                                ResizeFlexWidth = SelectorWidth + (SelectorPosition.AbsoluteLeft - ResizeFlexLeft);
                                ResizeFlexHeight = e.clientY - ResizeFlexPosition.AbsoluteTop - MouseRelativeTop;
                                break;
                            case jQueryExtension.Data.Direction.Left:
                                ResizeFlexLeft = e.clientX - MouseRelativeLeft;
                                ResizeFlexWidth = SelectorWidth + (SelectorPosition.AbsoluteLeft - ResizeFlexLeft);
                                break;
                        };
                        ResizeFlexWidth -= 2 * Settings.BorderWidth;
                        ResizeFlexHeight -= 2 * Settings.BorderWidth;
                        if (ResizeFlexWidth >= Settings.MinWidth && ResizeFlexHeight >= Settings.MinHeight) {
                            var cssSettings = {};
                            switch (Settings.Direction) {
                                case jQueryExtension.Data.Direction.LeftTop:
                                    cssSettings.left = (ResizeFlexLeft > 0 ? ResizeFlexLeft : 0) + "px";
                                    cssSettings.top = (ResizeFlexTop > 0 ? ResizeFlexTop : 0) + "px";
                                    cssSettings.width = ResizeFlexWidth + "px";
                                    cssSettings.height = ResizeFlexHeight + "px";
                                    break;
                                case jQueryExtension.Data.Direction.Top:
                                    cssSettings.top = ResizeFlexTop + "px";
                                    cssSettings.height = ResizeFlexHeight + "px";
                                    break;
                                case jQueryExtension.Data.Direction.RightTop:
                                    cssSettings.top = ResizeFlexTop + "px";
                                    cssSettings.width = ResizeFlexWidth + "px";
                                    cssSettings.height = ResizeFlexHeight + "px";
                                    break;
                                case jQueryExtension.Data.Direction.Right:
                                    cssSettings.left = ResizeFlexLeft + "px";
                                    cssSettings.width = ResizeFlexWidth + "px";
                                    break;
                                case jQueryExtension.Data.Direction.RightBottom:
                                    cssSettings.width = ResizeFlexWidth + "px";
                                    cssSettings.height = ResizeFlexHeight + "px";
                                    break;
                                case jQueryExtension.Data.Direction.Bottom:
                                    cssSettings.top = ResizeFlexTop + "px";
                                    cssSettings.height = ResizeFlexHeight + "px";
                                    break;
                                case jQueryExtension.Data.Direction.LeftBottom:
                                    cssSettings.left = ResizeFlexLeft + "px";
                                    cssSettings.width = ResizeFlexWidth + "px";
                                    cssSettings.height = ResizeFlexHeight + "px";
                                    break;
                                case jQueryExtension.Data.Direction.Left:
                                    cssSettings.left = ResizeFlexLeft + "px";
                                    cssSettings.width = ResizeFlexWidth + "px";
                                    break;
                            };
                            jQueryExtension_UI_Window_ResizeFlexJQ.css(cssSettings);
                        };
                    };

                    //鼠标松开执行事件
                    var mouseupFunction = function (e) {
                        documentJQ.unbind("mousemove", mousemoveFunction);
                        documentJQ.unbind("mouseup", mouseupFunction);
                        if ($.browser.msie) {
                            this.releaseCapture();
                        } else if ($.browser.mozilla) {
                            window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                        };
                        var ResizeFlexPosition = jQueryExtension.Position(jQueryExtension_UI_Window_ResizeFlexJQ);
                        var ResizeFlexBox = jQueryExtension.Box(jQueryExtension_UI_Window_ResizeFlexJQ);
                        jQueryExtension_UI_Window_ResizeFlexJQ.remove();
                        jQueryExtension_UI_Window_ResizeFlexLockJQ.remove();

                        var ResizeFlexWidth = ResizeFlexBox.Width(jQueryExtension.Data.BoxInternalStructure.Border);
                        var ResizeFlexHeight = ResizeFlexBox.Height(jQueryExtension.Data.BoxInternalStructure.Border);
                        var RelativeY = ResizeFlexPosition.AbsoluteTop - SelectorPosition.AbsoluteTop;
                        var RelativeX = ResizeFlexPosition.AbsoluteLeft - SelectorPosition.AbsoluteLeft;
                        var RelativeWidth = ResizeFlexWidth - SelectorWidth;
                        var RelativeHeight = ResizeFlexHeight - SelectorHeight;

                        if (RelativeY != 0 || RelativeX != 0 || RelativeWidth != 0 || RelativeHeight != 0) {
                            var cssSettings = {};
                            cssSettings["left"] = (ResizeFlexPosition.AbsoluteLeft - SelectorBox.MarginLeft) + "px";
                            cssSettings["width"] = ResizeFlexWidth + "px";
                            cssSettings["top"] = (ResizeFlexPosition.AbsoluteTop - SelectorBox.MarginTop) + "px";
                            cssSettings["height"] = ResizeFlexHeight + "px";

                            SelectorJQ.animate(
                            cssSettings
                            , Settings.Speed
                            , function () { SelectorJQ.triggerHandler("jQueryExtension_Event_Resize"); jQueryExtension.UI.IsCanResize = true; if ($.isFunction(Settings.CallBack)) { Settings.CallBack(); }; }
                        );
                        } else {
                            jQueryExtension.UI.IsCanResize = true;
                        };
                    };

                    //绑定鼠标移动和松开事件
                    documentJQ.bind('mousemove', mousemoveFunction).bind('mouseup', mouseupFunction);
                };
            });
        });
    }
    , Lock: function (Properties) {
        /// <summary>
        ///     1: jQueryExtension.UI.Lock(Properties) - 关机锁屏效果。
        /// </summary>
        /// <param name="Properties" type="Options">
        ///     一组用于默认配置的键/值对。
        ///      1: IsFlash: jQueryExtension.IsFlash()                                     - 是否以flash效果展示。
        ///      2: Speed: jQueryExtension.Data.Settings.Speed                             - 动画完成的速度（毫秒）。
        ///      3: Frequency: jQueryExtension.Data.Settings.Frequency                     - 动画帧的频率（毫秒）。
        ///      4: IsLock: true                                                           - 是否开启 关机锁屏效果。
        ///      5: IsAddLoadingFlash: false                                               - 是否添加页面加载动画。
        ///      6: Opacity: 0.3                                                           - 关机锁屏效果 透明度。
        ///      7: Selector: null                                                         - （选择器）用于 创建在锁屏层上的元素。
        ///      8: CallBack: function () { }                                              - 锁定完成回调事件。
        ///      9: CloseType: jQueryExtension.Data.CloseType.Hidden                       - 关闭类型。
        ///     10: CloseSelector: null                                                    -（选择器）用于关闭创建在锁屏层上的元素以及锁屏层。
        ///     11: CloseCallBack: function () { }                                         - 关闭完成回调事件。
        /// </param>
        var Settings = {
            IsFlash: jQueryExtension.IsFlash()
            , Speed: jQueryExtension.Data.Settings.Speed
            , Frequency: jQueryExtension.Data.Settings.Frequency
            , IsLock: true
            , IsAddLoadingFlash: false
            , Opacity: 0.3
            , Selector: null
            , CallBack: function () { }
            , CloseType: jQueryExtension.Data.CloseType.Hidden
            , CloseSelector: null
            , CloseCallBack: function () { }
        };
        $.extend(Settings, Properties);

        //--------------------锁定层上面的显示层的显示位置（开始）--------------------//
        if (!Settings.IsFlash) {
            Settings.Speed = 0;
        };

        var jQueryExtension_UI_LockJQ = $("#jQueryExtension_UI_Lock");
        var SelectorJQ = $(Settings.Selector);
        var IsFirstLock = false;

        if (Settings.IsLock && SelectorJQ.length > 0) {
            SelectorJQ.addClass("jQueryExtension_UI_NeedLock").css({
                "zIndex": 5001
                , "display": "none"
            });
        };

        //--------------------创建锁定层（开始）--------------------//
        if (Settings.IsLock) {
            if (jQueryExtension_UI_LockJQ.length < 1) {
                $("<div id=\"jQueryExtension_UI_Lock\" class=\"jQueryExtension_UI_Lock\"></div>").css({
                    "z-index": 5000
                    , "opacity": 0.0
                }).appendTo("body");
                IsFirstLock = true;
                jQueryExtension_UI_LockJQ = $("#jQueryExtension_UI_Lock");

                //锁定层最大化到可见范围
                jQueryExtension.UI.Layout({
                    IsFlash: false
                    , Speed: Settings.Speed
                    , Frequency: Settings.Frequency
                    , Selector: jQueryExtension_UI_LockJQ
                    , HorizontalAlignment: jQueryExtension.Data.HorizontalAlignment.Stretch
                    , VerticalAlignment: jQueryExtension.Data.VerticalAlignment.Stretch
                    , Top: 0
                    , Right: 0
                    , Bottom: 0
                    , Left: 0
                    , IsEventResize: false
                    , CallBack: function () { }
                    , IsForeverLayout: true
                    , InSelector: document
                    , IsCanMoveOut: false
                });
            };

            if (Settings.IsAddLoadingFlash) {
                jQueryExtension_UI_LockJQ.addClass("jQueryExtension_UI_LockLoading");
            } else {
                jQueryExtension_UI_LockJQ.removeClass("jQueryExtension_UI_LockLoading");
            };
        };

        var CloseSelectorJQ = $(Settings.CloseSelector);
        var CallBackFunction = function (Speed) {
            if (CloseSelectorJQ.length > 0) {
                CloseSelectorJQ.attr("title", "关闭").css("cursor", "pointer").unbind("click").bind("click", function () {
                    CloseSelectorJQ.unbind("click");
                    jQueryExtension.UI.Unlock({
                        IsFlash: Settings.IsFlash
                        , Speed: Settings.Speed
                        , Frequency: Settings.Frequency
                        , IsLock: Settings.IsLock
                        , Selector: jQueryExtension_UI_WindowJQ
                        , CloseType: Settings.CloseType
                        , CallBack: function () {
                            if ($.isFunction(Settings.CloseCallBack)) {
                                Settings.CloseCallBack();
                            };
                        }
                    });
                });
            };
            if (SelectorJQ.length > 0) {
                SelectorJQ.fadeIn(Speed, function () { if ($.isFunction(Settings.CallBack)) { Settings.CallBack(); }; });
            } else {
                if ($.isFunction(Settings.CallBack)) { Settings.CallBack(); };
            };
        };

        var jQueryExtension_UI_LockVisibleJQ = jQueryExtension_UI_LockJQ.filter(":visible");
        if ((jQueryExtension_UI_LockVisibleJQ.length < 1 || IsFirstLock) && Settings.IsLock) {
            //--------------------锁定层动画效果（开始）--------------------//
            jQueryExtension_UI_LockJQ.fadeTo(parseInt(Settings.Speed / (SelectorJQ.length > 0 ? 2 : 1)), Settings.Opacity, function () { CallBackFunction(parseInt(Settings.Speed / (SelectorJQ.length > 0 ? 2 : 1))); });
            //--------------------锁定层动画效果（结束）--------------------//
        } else {
            CallBackFunction(parseInt(Settings.Speed / (SelectorJQ.length > 0 ? 2 : 1)));
        };
    }
, Unlock: function (Properties) {
    /// <summary>
    ///     1: jQueryExtension.UI.Unlock(Properties) - 取消关机锁屏效果。
    /// </summary>
    /// <param name="Properties" type="Options">
    ///     一组用于默认配置的键/值对。
    ///      1: IsFlash: jQueryExtension.IsFlash()                                     - 是否以flash效果展示。
    ///      2: Speed: jQueryExtension.Data.Settings.Speed                             - 动画完成的速度（毫秒）。
    ///      3: Frequency: jQueryExtension.Data.Settings.Frequency                     - 动画帧的频率（毫秒）。
    ///      4: Selector: null                                                         - （选择器）取消关机锁屏效果是所要隐藏的元素。
    ///      5: CloseType: jQueryExtension.Data.CloseType.Hidden                       - 关闭类型。
    ///      6: CallBack: function () { }                                              - 回调事件
    /// </param>
    var Settings = {
        IsFlash: jQueryExtension.IsFlash()
        , Speed: jQueryExtension.Data.Settings.Speed
        , Frequency: jQueryExtension.Data.Settings.Frequency
        , Selector: null
        , CloseType: jQueryExtension.Data.CloseType.Hidden
        , Init: function () { }
        , CallBack: function () { }
    };
    $.extend(Settings, Properties);

    if (!Settings.IsFlash) {
        Settings.Speed = 0;
    };

    var jQueryExtension_UI_LockJQ = $("#jQueryExtension_UI_Lock");
    var SelectorJQ = $(Settings.Selector);

    var CallBackFunction = function (Speed) {
        if ($(".jQueryExtension_UI_NeedLock:visible").length < 1) {
            jQueryExtension_UI_LockJQ.fadeTo(Speed, 0.0, function () {
                jQueryExtension_UI_LockJQ.hide();
                if ($.isFunction(Settings.CallBack)) {
                    Settings.CallBack();
                };
            });
        };
    };

    if (SelectorJQ.length > 0) {
        if (Settings.Speed == 0) {
            SelectorJQ.hide();
            if (Settings.CloseType != jQueryExtension.Data.CloseType.Hidden) {
                SelectorJQ.remove();
            };
            CallBackFunction(Settings.Speed);
        } else {
            var ObjectLockJQ = $(".jQueryExtension_UI_NeedLock:visible").not(SelectorJQ);
            SelectorJQ.fadeOut(parseInt(Settings.Speed / (ObjectLockJQ.length < 1 ? 2 : 1)), function () {
                if (Settings.CloseType != jQueryExtension.Data.CloseType.Hidden) {
                    SelectorJQ.remove();
                };
                CallBackFunction(parseInt(Settings.Speed / (ObjectLockJQ.length < 1 ? 2 : 1)));
            });
        };
    } else {
        CallBackFunction(Settings.Speed);
    };
}

, WindowInit: function (Properties) {
    /// <summary>
    ///     1: jQueryExtension.UI.WindowInit(Properties) - 取消关机锁屏效果。
    /// </summary>
    /// <param name="Properties" type="Options">
    ///     一组用于默认配置的键/值对。
    ///      1: IsFlash: jQueryExtension.IsFlash()                                     - 是否以flash效果展示。
    ///      2: Speed: jQueryExtension.Data.Settings.Speed                             - 动画完成的速度（毫秒）。
    ///      3: Frequency: jQueryExtension.Data.Settings.Frequency                     - 动画帧的频率（毫秒）。
    ///      4: WindowGuid: WindowGuid                                                             - 窗体的WindowGuid编号。
    ///      5: WindowStyles: "jQueryExtension_UI_WindowOpen"                          - 窗体的主样式。
    ///      6: BorderFuzzyPixel: jQueryExtension.Data.Settings.BorderFuzzyPixel       - 窗体的描边像素。
    ///      7: Radius: jQueryExtension.Data.Settings.Radius                           - 窗体的圆角像素。
    ///      8: HorizontalAlignment: jQueryExtension.Data.HorizontalAlignment.Stretch  - 水平方向的对齐方式。
    ///      9: VerticalAlignment: jQueryExtension.Data.VerticalAlignment.Stretch      - 垂直方向的对齐方式。
    ///     10: Top: 0                                                                 - 距离顶部的距离。
    ///     11: Right: 0                                                               - 距离右边的距离。
    ///     12: Bottom: 0                                                              - 距离底部的距离。
    ///     13: Left: 0                                                                - 距离左边的距离。
    ///     14: Width: -1                                                              - 宽度。
    ///     15: MinWidth: -1                                                           - 最小宽度。
    ///     16: Height: -1                                                             - 高度。
    ///     17: MinHeight: -1                                                          - 最小高度。
    ///     18: ResizeDirectionS: [jQueryExtension.Data.Direction.Right, jQueryExtension.Data.Direction.RightBottom, jQueryExtension.Data.Direction.Bottom] - 窗口放大允许拖动的方向。
    ///     19: IsResizeWithSelector: false                                            - Width,Height用于内部计算窗体大小。
    ///     20: IsEventResize: false                                                   - 是否添加jQueryExtension_Event_Resize事件。

    ///     21: IsHasHead: true                                                        - 是否有头部。
    ///     22: HeadHeight: 25                                                         - 头部高度。
    ///     23: IsHasFoot: false                                                       - 是否有脚部。
    ///     24: FootHeight: 25                                                         - 脚部高度。
    ///     25: IsHasMin: true                                                         - 是否允许最小化。
    ///     26: IsHasMax: true                                                         - 是否允许最大化。
    ///     27: IsHasClose: true                                                       - 是否允许关闭。
    ///     28: IsLock: false                                                          - 是否开启锁屏效果。
    /// </param>
    var Settings = {
        IsFlash: jQueryExtension.IsFlash()
        , Speed: jQueryExtension.Data.Settings.Speed
        , Frequency: jQueryExtension.Data.Settings.Frequency
        , CurrentWindow: window
        , OpenWindow: window
        , WindowGuid: WindowGuid
        , WindowStyles: "jQueryExtension_UI_WindowOpen"
        , HorizontalAlignment: jQueryExtension.Data.HorizontalAlignment.Stretch
        , VerticalAlignment: jQueryExtension.Data.VerticalAlignment.Stretch
        , Top: 0
        , Right: 0
        , Bottom: 0
        , Left: 0
        , Width: -1
        , MinWidth: -1
        , Height: -1
        , MinHeight: -1
        , ResizeDirectionS: [jQueryExtension.Data.Direction.LeftTop, jQueryExtension.Data.Direction.Top, jQueryExtension.Data.Direction.RightTop, jQueryExtension.Data.Direction.Right, jQueryExtension.Data.Direction.RightBottom, jQueryExtension.Data.Direction.Bottom, jQueryExtension.Data.Direction.LeftBottom, jQueryExtension.Data.Direction.Left]
        , InSelector: null
        , IsResizeWithSelector: false
        , IsForeverLayout: false
        , ZIndex: null

        , IsBodyHasBackground: true
        , IsHasHead: true
        , IsHasMin: true
        , IsHasMax: true
        , IsHasClose: true
        , CloseType: jQueryExtension.Data.CloseType.Remove
        , IsLock: false
        , IsDrag: true
        , IsResize: true
    };
    $.extend(Settings, Properties);

    var ControlJQs;
    var WindowGuid = Settings.WindowGuid;
    var WindowJQ = $("#Window__" + WindowGuid);
    if (WindowJQ.length < 1) {
        var InSelectorJQ = $(Settings.InSelector);
        if (InSelectorJQ.length < 1) {
            InSelectorJQ = $("body");
        };

        var Html = "";
        Html += "<div id=\"Window__" + WindowGuid + "\" class=\"jQueryExtension_UI_Window\">";
        Html += "    <div id=\"Window_Outer__" + WindowGuid + "\" class=\"jQueryExtension_UI_Window_Outer\">";
        Html += "        <div class=\"jQueryExtension_UI_Window_Inner\">";
        Html += "            <div class=\"jQueryExtension_UI_Window_Resize\">";
        Html += "                <div class=\"jQueryExtension_UI_Window_Resize_Center\"></div>";
        Html += "                <div id=\"Window_Resize_LeftTop__" + WindowGuid + "\" class=\"jQueryExtension_UI_Window_Resize_LeftTop\"></div>";
        Html += "                <div id=\"Window_Resize_Top__" + WindowGuid + "\" class=\"jQueryExtension_UI_Window_Resize_Top\"></div>";
        Html += "                <div id=\"Window_Resize_RightTop__" + WindowGuid + "\" class=\"jQueryExtension_UI_Window_Resize_RightTop\"></div>";
        Html += "                <div id=\"Window_Resize_Right__" + WindowGuid + "\" class=\"jQueryExtension_UI_Window_Resize_Right\"></div>";
        Html += "                <div id=\"Window_Resize_RightBottom__" + WindowGuid + "\" class=\"jQueryExtension_UI_Window_Resize_RightBottom\"></div>";
        Html += "                <div id=\"Window_Resize_Bottom__" + WindowGuid + "\" class=\"jQueryExtension_UI_Window_Resize_Bottom\"></div>";
        Html += "                <div id=\"Window_Resize_LeftBottom__" + WindowGuid + "\" class=\"jQueryExtension_UI_Window_Resize_LeftBottom\"></div>";
        Html += "                <div id=\"Window_Resize_Left__" + WindowGuid + "\" class=\"jQueryExtension_UI_Window_Resize_Left\"></div>";
        Html += "            </div>";
        Html += "            <div class=\"jQueryExtension_UI_Window_Content\">";
        Html += "                <div id=\"Window_Content_Head__" + WindowGuid + "\" class=\"jQueryExtension_UI_Window_Content_Head\">";
        Html += "                    <div class=\"jQueryExtension_UI_Window_Content_Head_Tools\">";
        Html += "                        <div id=\"Window_Content_Head_Tools_Close__" + WindowGuid + "\" class=\"jQueryExtension_UI_Window_Content_Head_Tools_Close\" title=\"关闭\"></div>";
        Html += "                        <div id=\"Window_Content_Head_Tools_MaxExit__" + WindowGuid + "\" class=\"jQueryExtension_UI_Window_Content_Head_Tools_MaxExit\" title=\"向下还原\"></div>";
        Html += "                        <div id=\"Window_Content_Head_Tools_Max__" + WindowGuid + "\" class=\"jQueryExtension_UI_Window_Content_Head_Tools_Max\" title=\"最大化\"></div>";
        Html += "                        <div id=\"Window_Content_Head_Tools_Min__" + WindowGuid + "\" class=\"jQueryExtension_UI_Window_Content_Head_Tools_Min\" title=\"最小化\"></div>";
        Html += "                        <div id=\"Window_Content_Head_Tools_FullScreenExit__" + WindowGuid + "\" class=\"jQueryExtension_UI_Window_Content_Head_Tools_FullScreenExit\" title=\"退出全屏\"></div>";
        Html += "                        <div id=\"Window_Content_Head_Tools_FullScreen__" + WindowGuid + "\" class=\"jQueryExtension_UI_Window_Content_Head_Tools_FullScreen\" title=\"全屏\"></div>";
        Html += "                    </div>";
        Html += "                    <div id=\"Window_Content_Head_Title__" + WindowGuid + "\" class=\"jQueryExtension_UI_Window_Content_Head_Title" + (Settings.TitleImageStyles == undefined ? "" : (" " + Settings.TitleImageStyles)) + "\"></div>";
        Html += "                </div>";
        Html += "                <div id=\"Window_Content_Body__" + WindowGuid + "\" class=\"jQueryExtension_UI_Window_Content_Body\"></div>";
        Html += "            </div>";
        Html += "        </div>";
        Html += "    </div>";
        Html += "</div>";
        $(Html).appendTo(InSelectorJQ);

        WindowJQ = $("#Window__" + WindowGuid).data("WindowGuid", WindowGuid).data("OpenWindow", Settings.OpenWindow);

        ControlJQs = {
            IsInit: true
            , WindowJQ: WindowJQ
            , Window_OuterJQ: $("#Window_Outer__" + WindowGuid).css("overflow", "hidden")
            , Window_Content_HeadJQ: $("#Window_Content_Head__" + WindowGuid)
            , Window_Content_Head_TitleJQ: $("#Window_Content_Head_Title__" + WindowGuid)
            , Window_Content_BodyJQ: $("#Window_Content_Body__" + WindowGuid).css("overflow", "hidden")
            , Window_Content_Head_Tools_CloseJQ: $("#Window_Content_Head_Tools_Close__" + WindowGuid)
            , Window_Content_Head_Tools_MaxExitJQ: $("#Window_Content_Head_Tools_MaxExit__" + WindowGuid)
            , Window_Content_Head_Tools_MaxJQ: $("#Window_Content_Head_Tools_Max__" + WindowGuid)
            , Window_Content_Head_Tools_MinJQ: $("#Window_Content_Head_Tools_Min__" + WindowGuid)
            , Window_Content_Head_Tools_FullScreenExitJQ: $("#Window_Content_Head_Tools_FullScreenExit__" + WindowGuid)
            , Window_Content_Head_Tools_FullScreenJQ: $("#Window_Content_Head_Tools_FullScreen__" + WindowGuid)

            , Window_Resize_LeftTopJQ: $("#Window_Resize_LeftTop__" + WindowGuid)
            , Window_Resize_TopJQ: $("#Window_Resize_Top__" + WindowGuid)
            , Window_Resize_RightTopJQ: $("#Window_Resize_RightTop__" + WindowGuid)
            , Window_Resize_RightJQ: $("#Window_Resize_Right__" + WindowGuid)
            , Window_Resize_RightBottomJQ: $("#Window_Resize_RightBottom__" + WindowGuid)
            , Window_Resize_BottomJQ: $("#Window_Resize_Bottom__" + WindowGuid)
            , Window_Resize_LeftBottomJQ: $("#Window_Resize_LeftBottom__" + WindowGuid)
            , Window_Resize_LeftJQ: $("#Window_Resize_Left__" + WindowGuid)
        };
        WindowJQ.data("ControlJQs", ControlJQs);

        if (!Settings.IsBodyHasBackground) {
            ControlJQs.Window_Content_BodyJQ.css({ "border": "0px solid #5d9acf", "background-color": "transparent" });
        };

        if (!fw.fwObject.FWObjectHelper.hasValue(Settings.ZIndex)) {
            ControlJQs.WindowJQ.css("zIndex", "4000").bind("mousedown", function () {
                var zIndex = parseInt($(this).css("zIndex"));
                if (zIndex < 5000) {
                    $("div.jQueryExtension_UI_Window").each(function () {
                        if (parseInt($(this).css("zIndex")) < 5000) {
                            $(this).css("zIndex", "4000");
                        };
                    });
                    $(this).css("zIndex", "4001");
                };
            });
        } else {
            ControlJQs.WindowJQ.css("zIndex", Settings.ZIndex);
        };

        if (Settings.IsDrag) {
            jQueryExtension.UI.Drag({
                IsFlash: Settings.IsFlash
            , Speed: Settings.Speed
            , Frequency: Settings.Frequency
            , Selector: ControlJQs.WindowJQ
            , Handler: ControlJQs.Window_Content_Head_TitleJQ
            , MouseDownMillisecond: 100
            });
        };

        if (Settings.IsResize && Settings.ResizeDirectionS.length > 0) {
            var ResizeSettings = {
                IsFlash: false
                , Speed: Settings.Speed
                , Frequency: Settings.Frequency
                , WindowGuid: WindowGuid
                , Selector: ControlJQs.WindowJQ
                , MinWidth: Settings.MinWidth
                , MinHeight: Settings.MinHeight
                , MoveCondition: function () { return Settings.IsResize }
                , IsNeedSelfResize: true
                , CallBack: function () { }
            };
            for (var i in jQueryExtension.Data.Direction) {
                for (var j = 0; j < Settings.ResizeDirectionS.length; j++) {
                    if (Settings.ResizeDirectionS[j] == jQueryExtension.Data.Direction[i]) {
                        var Handler = undefined;
                        var Direction = jQueryExtension.Data.Direction[i];
                        switch (Direction) {
                            case jQueryExtension.Data.Direction.LeftTop:
                                Handler = ControlJQs.Window_Resize_LeftTopJQ;
                                break;
                            case jQueryExtension.Data.Direction.Top:
                                Handler = ControlJQs.Window_Resize_TopJQ;
                                break;
                            case jQueryExtension.Data.Direction.RightTop:
                                Handler = ControlJQs.Window_Resize_RightTopJQ;
                                break;
                            case jQueryExtension.Data.Direction.Right:
                                Handler = ControlJQs.Window_Resize_RightJQ;
                                break;
                            case jQueryExtension.Data.Direction.RightBottom:
                                Handler = ControlJQs.Window_Resize_RightBottomJQ;
                                break;
                            case jQueryExtension.Data.Direction.Bottom:
                                Handler = ControlJQs.Window_Resize_BottomJQ;
                                break;
                            case jQueryExtension.Data.Direction.LeftBottom:
                                Handler = ControlJQs.Window_Resize_LeftBottomJQ;
                                break;
                            case jQueryExtension.Data.Direction.Left:
                                Handler = ControlJQs.Window_Resize_LeftJQ;
                                break;
                                Handler = undefined;
                            default: break;
                        };
                        if (fw.fwObject.FWObjectHelper.hasValue(Handler)) {
                            ResizeSettings.Handler = Handler;
                            ResizeSettings.Direction = Direction;
                            jQueryExtension.UI.Resize(ResizeSettings);
                        };
                        break;
                    };
                };
            };
        };

        if (!Settings.IsHasHead) { ControlJQs.Window_Content_HeadJQ.hide(); };

        if (!Settings.IsHasMin) { ControlJQs.Window_Content_Head_Tools_MinJQ.hide(); };

        if (!Settings.IsHasMax) { ControlJQs.Window_Content_Head_Tools_MaxJQ.hide(); };

        ControlJQs.Window_Content_Head_Tools_CloseJQ.unbind('click').bind("click", function () {
            jQueryExtension.UI.Unlock({
                IsFlash: Settings.IsFlash
                    , Speed: Settings.Speed
                    , Frequency: Settings.Frequency
                    , IsLock: Settings.IsLock
                    , Selector: ControlJQs.WindowJQ
                    , CloseType: Settings.CloseType
                    , CallBack: function () {
                        if ($.isFunction(Settings.CloseCallBack)) {
                            Settings.CloseCallBack();
                        };
                    }
            });
        });
        if (!Settings.IsHasClose) { ControlJQs.Window_Content_Head_Tools_CloseJQ.hide(); };

        if (Settings.IsResizeWithSelector) {
            if (Settings.Width >= 0) {
                Settings.Width = Settings.Width + ControlJQs.Window_Resize_LeftJQ.width() + ControlJQs.Window_Resize_RightJQ.width();
            };
            if (Settings.Height >= 0) {
                var HeadHeight = ControlJQs.Window_Content_HeadJQ.filter(":visible").length > 0 ? ControlJQs.Window_Content_HeadJQ.height() : 0;
                Settings.Height = Settings.Height + ControlJQs.Window_Resize_TopJQ.height() + HeadHeight + ControlJQs.Window_Resize_BottomJQ.height();
            };
        };

        var jQueryExtension_Event_ResizeFunction = function () {
            var Width = ControlJQs.WindowJQ.width() - ControlJQs.Window_Resize_LeftJQ.width() - ControlJQs.Window_Resize_RightJQ.width();
            var Height = ControlJQs.WindowJQ.height() - ControlJQs.Window_Resize_TopJQ.height() - ControlJQs.Window_Resize_BottomJQ.height();
            ControlJQs.Window_OuterJQ.width(Width);
            ControlJQs.Window_OuterJQ.height(Height);
            var IsHeadVisible = ControlJQs.Window_Content_HeadJQ.filter(":visible").length > 0 ? true : false;
            var HeadHeight = IsHeadVisible ? ControlJQs.Window_Content_HeadJQ.height() : 0;
            jQueryExtension.ResizeWidthHeight({
                Selector: ControlJQs.Window_Content_BodyJQ
                , Width: Width
                , Height: Height - HeadHeight - (Settings.IsBodyHasBackground ? 2 : 0) - (($.browser.msie && $.browser.version == "6.0") ? 2 : 0)
            });
            ControlJQs.Window_Content_BodyJQ.triggerHandler("jQueryExtension_Event_Resize");
        };
        WindowJQ.bind("jQueryExtension_Event_Resize", jQueryExtension_Event_ResizeFunction);

        jQueryExtension.UI.Layout({
            IsFlash: Settings.IsFlash
            , Speed: Settings.Speed
            , Frequency: Settings.Frequency
            , Selector: ControlJQs.WindowJQ
            , HorizontalAlignment: Settings.HorizontalAlignment
            , VerticalAlignment: Settings.VerticalAlignment
            , Top: Settings.Top
            , Right: Settings.Right
            , Bottom: Settings.Bottom
            , Left: Settings.Left
            , Width: Settings.Width
            , MinWidth: Settings.MinWidth
            , Height: Settings.Height
            , MinHeight: Settings.MinHeight
            , IsEventResize: true
            , IsForeverLayout: Settings.IsForeverLayout
            , CallBack: function () {
                //            jQueryExtension_Event_ResizeFunction();
                jQueryExtension.UI.Lock({
                    IsFlash: jQueryExtension.IsFlash()
                    , Speed: jQueryExtension.Data.Settings.Speed
                    , Frequency: jQueryExtension.Data.Settings.Frequency
                    , IsLock: Settings.IsLock
                    , IsAddLoadingFlash: false
                    , Selector: ControlJQs.WindowJQ
                    , CallBack: function () { }
                    , CloseType: jQueryExtension.Data.CloseType.Hidden
                    , CloseSelector: null
                    , CloseCallBack: function () { }
                });
            }
        });
    } else {
        ControlJQs = WindowJQ.data("ControlJQs");
        ControlJQs.IsInit = false;
    };

    return ControlJQs;
}
, Alert: function (Properties) {
    var Settings = {
        IsFlash: jQueryExtension.IsFlash()
            , Speed: jQueryExtension.Data.Settings.Speed
            , Frequency: jQueryExtension.Data.Settings.Frequency
            , CurrentWindow: window
            , OpenWindow: window
            , ContentHtml: null
            , EnterCallBack: function (WindowCloseFunction) { WindowCloseFunction(); }
    };
    $.extend(Settings, Properties);

    if (fw.fwObject.FWObjectHelper.hasValue(Settings.ContentHtml)) {
        Settings.TitleImageStyles = "jQueryExtension_UI_Window_Title_Image";
        Settings.TitleHtml = "系统提示：";
        Settings.HorizontalAlignment = jQueryExtension.Data.HorizontalAlignment.Stretch;
        Settings.VerticalAlignment = jQueryExtension.Data.VerticalAlignment.Stretch;
        Settings.Top = 0;
        Settings.Right = 0;
        Settings.Bottom = 0;
        Settings.Left = 0;
        Settings.Width = 400;
        Settings.MinWidth = 250;
        Settings.Height = 250;
        Settings.MinHeight = 170;
        Settings.IsResizeWithSelector = false;
        Settings.IsForeverLayout = true;

        Settings.IsBodyHasBackground = false;
        Settings.IsHasHead = true;
        Settings.IsHasFullScreen = false;
        Settings.IsHasMin = false;
        Settings.IsHasMax = false;
        Settings.IsHasClose = true;
        Settings.CloseType = jQueryExtension.Data.CloseType.Remove;
        Settings.IsLock = true;
        Settings.IsDrag = true;
        Settings.IsResize = true;

        var WindowGuid = jQueryExtension.WindowGuid();

        var ControlJQs = jQueryExtension.UI.WindowInit({
            IsFlash: Settings.IsFlash
            , Speed: Settings.Speed
            , Frequency: Settings.Frequency
            , CurrentWindow: Settings.CurrentWindow
            , OpenWindow: Settings.OpenWindow
            , IsLock: Settings.IsLock
            , WindowGuid: WindowGuid
            , WindowStyles: "jQueryExtension_UI_WindowOpen"
            , HorizontalAlignment: Settings.HorizontalAlignment
            , VerticalAlignment: Settings.VerticalAlignment
            , Top: Settings.Top
            , Right: Settings.Right
            , Bottom: Settings.Bottom
            , Left: Settings.Left
            , Width: Settings.Width
            , MinWidth: Settings.MinWidth
            , Height: Settings.Height
            , MinHeight: Settings.MinHeight
            , IsResizeWithSelector: Settings.IsResizeWithSelector
            , IsForeverLayout: Settings.IsForeverLayout

            , IsBodyHasBackground: Settings.IsBodyHasBackground
            , IsHasHead: Settings.IsHasHead
            , IsHasFullScreen: Settings.IsHasFullScreen
            , IsHasMin: Settings.IsHasMin
            , IsHasMax: Settings.IsHasMax
            , IsHasClose: Settings.IsHasClose
            , IsLock: Settings.IsLock
            , IsDrag: Settings.IsDrag
            , IsResize: Settings.IsResize
        });

        ControlJQs.Window_Content_Head_TitleJQ.html(Settings.TitleHtml);

        if (ControlJQs.IsInit) {
            var Window_Content_Body_AlertImageJQ = $("<div class=\"jQueryExtension_UI_Window_Content_Body_AlertImage\"></div>").appendTo(ControlJQs.Window_Content_BodyJQ);
            var Window_Content_Body_ContentJQ = $("<div class=\"jQueryExtension_UI_Window_Content_Body_Content\">" + Settings.ContentHtml + "</div>").appendTo(ControlJQs.Window_Content_BodyJQ);
            var Window_Content_Body_FunctionJQ = $("<div class=\"jQueryExtension_UI_Window_Content_Body_Function\"></div>").appendTo(ControlJQs.Window_Content_BodyJQ);
            var Window_Content_Body_Function_EnterJQ = $("<div class=\"jQueryExtension_UI_Window_Content_Body_Function_Enter\">确定</div>").appendTo(Window_Content_Body_FunctionJQ).bind("click", function () {
                if ($.isFunction(Settings.EnterCallBack)) {
                    var WindowCloseFunction = function () { ControlJQs.Window_Content_Head_Tools_CloseJQ.click(); };
                    Settings.EnterCallBack(WindowCloseFunction);
                } else {
                    ControlJQs.Window_Content_Head_Tools_CloseJQ.click();
                };
            });
            var Window_Content_Body_Function_EnterHelperJQ = $("<input type=\"text\" value=\"\" style=\"position: absolute; left: -10000px; top: -10000px; width: 0px; height: 0px;\" />").appendTo(Window_Content_Body_FunctionJQ).focus().bind("keyup", function (e) {
                if (e.which == 13) {
                    Window_Content_Body_Function_EnterJQ.click();
                };
            });
            ControlJQs.Window_Content_BodyJQ.bind("jQueryExtension_Event_Resize", function () {
                var BodyBox = jQueryExtension.Box(ControlJQs.Window_Content_BodyJQ);
                var AlertImageWidth = Window_Content_Body_AlertImageJQ.width();
                var AlertImageHeight = Window_Content_Body_AlertImageJQ.height();
                Window_Content_Body_AlertImageJQ.css({
                    "margin-left": AlertImageWidth / 2 + "px"
                    , "margin-top": AlertImageWidth / 2 + "px"
                });
                Window_Content_Body_ContentJQ.css({
                    "padding-left": (AlertImageWidth + AlertImageWidth) + "px"
                    , "padding-right": AlertImageWidth / 2 + "px"
                    , "margin-top": -AlertImageHeight + "px"
                });
                Window_Content_Body_ContentJQ.height(ControlJQs.Window_Content_BodyJQ.height() - Window_Content_Body_FunctionJQ.height() - AlertImageWidth / 2);
            }).triggerHandler("jQueryExtension_Event_Resize");
        };
    };
}
, Confirm: function (Properties) {
    var Settings = {
        IsFlash: jQueryExtension.IsFlash()
            , Speed: jQueryExtension.Data.Settings.Speed
            , Frequency: jQueryExtension.Data.Settings.Frequency
            , CurrentWindow: window
            , OpenWindow: window
            , ContentHtml: null
            , EnterCallBack: function (WindowCloseFunction) { WindowCloseFunction(); }
            , CancelCallBack: function (WindowCloseFunction) { WindowCloseFunction(); }
    };
    $.extend(Settings, Properties);

    if (fw.fwObject.FWObjectHelper.hasValue(Settings.ContentHtml)) {
        Settings.TitleImageStyles = "jQueryExtension_UI_Window_Title_Image";
        Settings.TitleHtml = "请选择：";
        Settings.HorizontalAlignment = jQueryExtension.Data.HorizontalAlignment.Stretch;
        Settings.VerticalAlignment = jQueryExtension.Data.VerticalAlignment.Stretch;
        Settings.Top = 0;
        Settings.Right = 0;
        Settings.Bottom = 0;
        Settings.Left = 0;
        Settings.Width = 400;
        Settings.MinWidth = 250;
        Settings.Height = 300;
        Settings.MinHeight = 170;
        Settings.IsResizeWithSelector = false;
        Settings.IsForeverLayout = true;

        Settings.IsBodyHasBackground = false;
        Settings.IsHasHead = true;
        Settings.IsHasFullScreen = false;
        Settings.IsHasMin = false;
        Settings.IsHasMax = false;
        Settings.IsHasClose = true;
        Settings.CloseType = jQueryExtension.Data.CloseType.Remove;
        Settings.IsLock = true;
        Settings.IsDrag = true;
        Settings.IsResize = true;

        var WindowGuid = jQueryExtension.WindowGuid();

        var ControlJQs = jQueryExtension.UI.WindowInit({
            IsFlash: Settings.IsFlash
            , Speed: Settings.Speed
            , Frequency: Settings.Frequency
            , CurrentWindow: Settings.CurrentWindow
            , OpenWindow: Settings.OpenWindow
            , IsLock: Settings.IsLock
            , WindowGuid: WindowGuid
            , WindowStyles: "jQueryExtension_UI_WindowOpen"
            , HorizontalAlignment: Settings.HorizontalAlignment
            , VerticalAlignment: Settings.VerticalAlignment
            , Top: Settings.Top
            , Right: Settings.Right
            , Bottom: Settings.Bottom
            , Left: Settings.Left
            , Width: Settings.Width
            , MinWidth: Settings.MinWidth
            , Height: Settings.Height
            , MinHeight: Settings.MinHeight
            , IsResizeWithSelector: Settings.IsResizeWithSelector
            , IsForeverLayout: Settings.IsForeverLayout

            , IsBodyHasBackground: Settings.IsBodyHasBackground
            , IsHasHead: Settings.IsHasHead
            , IsHasFullScreen: Settings.IsHasFullScreen
            , IsHasMin: Settings.IsHasMin
            , IsHasMax: Settings.IsHasMax
            , IsHasClose: Settings.IsHasClose
            , IsLock: Settings.IsLock
            , IsDrag: Settings.IsDrag
            , IsResize: Settings.IsResize
        });

        ControlJQs.Window_Content_Head_TitleJQ.html(Settings.TitleHtml);

        if (ControlJQs.IsInit) {
            var Window_Content_Body_AlertImageJQ = $("<div class=\"jQueryExtension_UI_Window_Content_Body_ConfirmImage\"></div>").appendTo(ControlJQs.Window_Content_BodyJQ);
            var Window_Content_Body_ContentJQ = $("<div class=\"jQueryExtension_UI_Window_Content_Body_Content\">" + Settings.ContentHtml + "</div>").appendTo(ControlJQs.Window_Content_BodyJQ);
            var Window_Content_Body_FunctionJQ = $("<div class=\"jQueryExtension_UI_Window_Content_Body_Function\"></div>").appendTo(ControlJQs.Window_Content_BodyJQ);
            var Window_Content_Body_Function_CancelJQ = $("<div class=\"jQueryExtension_UI_Window_Content_Body_Function_Cancel\">取消</div>").appendTo(Window_Content_Body_FunctionJQ).bind("click", function () {
                if ($.isFunction(Settings.CancelCallBack)) {
                    var WindowCloseFunction = function () { ControlJQs.Window_Content_Head_Tools_CloseJQ.click(); };
                    Settings.CancelCallBack(WindowCloseFunction);
                } else {
                    ControlJQs.Window_Content_Head_Tools_CloseJQ.click();
                };
            });
            var Window_Content_Body_Function_EnterHelperJQ = $("<input type=\"text\" value=\"\" style=\"position: absolute; left: -10000px; top: -10000px; width: 0px; height: 0px;\" />").appendTo(Window_Content_Body_FunctionJQ).focus().bind("keyup", function (e) {
                if (e.which == 13) {
                    Window_Content_Body_Function_EnterJQ.click();
                };
            });
            var Window_Content_Body_Function_EnterJQ = $("<div class=\"jQueryExtension_UI_Window_Content_Body_Function_Enter\">确定</div>").appendTo(Window_Content_Body_FunctionJQ).bind("click", function () {
                if ($.isFunction(Settings.EnterCallBack)) {
                    var WindowCloseFunction = function () { ControlJQs.Window_Content_Head_Tools_CloseJQ.click(); };
                    Settings.EnterCallBack(WindowCloseFunction);
                } else {
                    ControlJQs.Window_Content_Head_Tools_CloseJQ.click();
                };
            });
            ControlJQs.Window_Content_BodyJQ.bind("jQueryExtension_Event_Resize", function () {
                var BodyBox = jQueryExtension.Box(ControlJQs.Window_Content_BodyJQ);
                var AlertImageWidth = Window_Content_Body_AlertImageJQ.width();
                var AlertImageHeight = Window_Content_Body_AlertImageJQ.height();
                Window_Content_Body_AlertImageJQ.css({
                    "margin-left": AlertImageWidth / 2 + "px"
                    , "margin-top": AlertImageWidth / 2 + "px"
                });
                Window_Content_Body_ContentJQ.css({
                    "padding-left": (AlertImageWidth + AlertImageWidth) + "px"
                    , "padding-right": AlertImageWidth / 2 + "px"
                    , "margin-top": -AlertImageHeight + "px"
                });
                Window_Content_Body_ContentJQ.height(ControlJQs.Window_Content_BodyJQ.height() - Window_Content_Body_FunctionJQ.height() - AlertImageWidth / 2);
            }).triggerHandler("jQueryExtension_Event_Resize");
        };

    };
}
, Open: function (Properties) {
    var Settings = {
        IsFlash: jQueryExtension.IsFlash()
            , Speed: jQueryExtension.Data.Settings.Speed
            , Frequency: jQueryExtension.Data.Settings.Frequency
            , CurrentWindow: window
            , OpenWindow: window
            , TitleImageStyles: "jQueryExtension_UI_Window_Title_Image"
            , TitleHtml: ""
            , IsHtmlPage: false
            , Url: null
            , Name: null
            , Data: {}
            , Scrolling: jQueryExtension.Data.IframeScrolling.Yes
            , HorizontalAlignment: jQueryExtension.Data.HorizontalAlignment.Stretch
            , VerticalAlignment: jQueryExtension.Data.VerticalAlignment.Stretch
            , Top: 0
            , Right: 0
            , Bottom: 0
            , Left: 0
            , Width: -1
            , MinWidth: 250
            , Height: -1
            , MinHeight: 47
            , InSelector: null
            , IsResizeWithSelector: false
            , IsForeverLayout: false

            , IsHasHead: true
            , IsHasFullScreen: false
            , IsHasMin: true
            , IsHasMax: true
            , IsHasClose: true
            , CloseType: jQueryExtension.Data.CloseType.Inherit
            , IsLock: true
            , IsDrag: true
            , IsResize: true
    };
    $.extend(Settings, Properties);

    Settings.IsHasMin = false;
    Settings.IsHasMax = false;
    Settings.IsDrag = true;
    Settings.IsResize = false;

    Settings.Name = jExtension.WindowNameEncode(Settings.Name);

    var WindowGuid;
    if (!fw.fwObject.FWObjectHelper.hasValue(Settings.Name)) {
        WindowGuid = jQueryExtension.WindowGuid();
    } else {
        WindowGuid = Settings.Name;
    };

    var ControlJQs = jQueryExtension.UI.WindowInit({
        IsFlash: Settings.IsFlash
            , Speed: Settings.Speed
            , Frequency: Settings.Frequency
            , CurrentWindow: Settings.CurrentWindow
            , OpenWindow: Settings.OpenWindow
            , TitleImageStyles: Settings.TitleImageStyles
            , IsLock: Settings.IsLock
            , WindowGuid: WindowGuid
            , WindowStyles: "jQueryExtension_UI_WindowOpen"
            , HorizontalAlignment: Settings.HorizontalAlignment
            , VerticalAlignment: Settings.VerticalAlignment
            , Top: Settings.Top
            , Right: Settings.Right
            , Bottom: Settings.Bottom
            , Left: Settings.Left
            , Width: Settings.Width
            , MinWidth: Settings.MinWidth
            , Height: Settings.Height
            , MinHeight: Settings.MinHeight
            , InSelector: Settings.InSelector
            , IsResizeWithSelector: Settings.IsResizeWithSelector
            , IsForeverLayout: Settings.IsForeverLayout

            , IsHasHead: Settings.IsHasHead
            , IsHasFullScreen: Settings.IsHasFullScreen
            , IsHasMin: Settings.IsHasMin
            , IsHasMax: Settings.IsHasMax
            , IsHasClose: Settings.IsHasClose
            , CloseType: Settings.CloseType
            , IsLock: Settings.IsLock
            , IsDrag: Settings.IsDrag
            , IsResize: Settings.IsResize
    });

    if (ControlJQs.IsInit) {
        ControlJQs.Window_Content_Body_IframeJQ = $("<iframe id=\"Window_Content_Body_Iframe__" + WindowGuid + "\" name=\"jQueryExtension_UI_Window_Content_Body_Iframe__" + WindowGuid + "\" frameborder=\"0\" scrolling=\"" + Settings.Scrolling + "\" style=\"width: 100%; height: 100%; height: 500px;\"></iframe>").appendTo(ControlJQs.Window_Content_BodyJQ);
        ControlJQs.Window_Content_BodyJQ.bind("jQueryExtension_Event_Resize", function () {
            var IframeBox = jQueryExtension.Box(ControlJQs.Window_Content_Body_IframeJQ);
            ControlJQs.Window_Content_Body_IframeJQ.width(ControlJQs.Window_Content_BodyJQ.width() - IframeBox.MarginLeft - IframeBox.BorderLeft - IframeBox.MarginRight - IframeBox.BorderRight);
            ControlJQs.Window_Content_Body_IframeJQ.height(ControlJQs.Window_Content_BodyJQ.height() - IframeBox.MarginTop - IframeBox.BorderTop - IframeBox.MarginBottom - IframeBox.BorderBottom);
            if (($.browser.msie && ($.browser.version == "6.0" || $.browser.version == "7.0"))) {
                var IframeWindow = ControlJQs.Window_Content_Body_IframeJQ[0].contentWindow;
                if (fw.fwObject.FWObjectHelper.hasValue(IframeWindow) && $.isFunction(IframeWindow.WindowResize)) {
                    IframeWindow.WindowResize();
                };
            };
        }).triggerHandler("jQueryExtension_Event_Resize");
    };

    ControlJQs.Window_Content_Head_TitleJQ.html(Settings.TitleHtml);
    jQueryExtension.Window.Submit({
        IsFlash: Settings.IsFlash
            , Speed: Settings.Speed
            , Frequency: Settings.Frequency
            , IsHtmlPage: Settings.IsHtmlPage
            , Url: Settings.Url
            , Name: "jQueryExtension_UI_Window_Content_Body_Iframe__" + WindowGuid
            , Data: Settings.Data
    });
    //        ControlJQs.WindowJQ.show();
}
, OpenClose: function (Properties) {
    var Settings = {
        CallBack: null
    };
    $.extend(Settings, Properties);

    if ($.isFunction(Settings.CallBack)) {
        Settings.CallBack();
    };

    var iframeID = window.name;
    var Window_Content_Head_Tools_CloseID = iframeID.replace("jQueryExtension_UI_Window_Content_Body_Iframe__", "Window_Content_Head_Tools_Close__");
    window.parent.$("#" + Window_Content_Head_Tools_CloseID).click();
}
, OpenWindow: function (Properties) {
    var Settings = {
        CallBack: null
    };
    $.extend(Settings, Properties);

    if ($.isFunction(Settings.CallBack)) {
        Settings.CallBack();
    };

    var iframeID = window.name;
    var WindowID = iframeID.replace("jQueryExtension_UI_Window_Content_Body_Iframe__", "Window__");
    return window.parent.$("#" + WindowID).data("OpenWindow");
}
    , Info: function (Properties) {
        var Settings = {
            IsFlash: jQueryExtension.IsFlash()
            , Speed: jQueryExtension.Data.Settings.Speed
            , Frequency: jQueryExtension.Data.Settings.Frequency
            , TitleImageStyles: "jQueryExtension_UI_Window_Title_Image"
            , TitleHtml: "信息"
            , Selector: null
            , ContentHtml: null
            , HorizontalAlignment: jQueryExtension.Data.HorizontalAlignment.Stretch
            , VerticalAlignment: jQueryExtension.Data.VerticalAlignment.Stretch
            , Top: 0
            , Right: 0
            , Bottom: 0
            , Left: 0
            , Width: -1
            , MinWidth: 250
            , Height: -1
            , MinHeight: 47
            , IsUseSelectorWidthHeight: false
            , IsResizeWithSelector: false
            , IsForeverLayout: false
            , ZIndex: null

            , IsBodyHasBackground: true
            , IsHasHead: true
            , IsHasFullScreen: false
            , IsHasMin: true
            , IsHasMax: true
            , IsHasClose: true
            , IsLock: false
            , IsDrag: true
            , IsResize: true
            , CloseType: jQueryExtension.Data.CloseType.Hidden
            , CloseTime: 0
        };
        $.extend(Settings, Properties);

        var SelectorJQ;
        var WindowGuid;
        var WindowJQ;
        var Window_Content_BodyJQ;

        if (fw.fwObject.FWObjectHelper.hasValue(Settings.Selector)) {
            SelectorJQ = $(Settings.Selector);
            WindowGuid = SelectorJQ.data("WindowGuid");
            if (!fw.fwObject.FWObjectHelper.hasValue(WindowGuid)) {
                WindowGuid = jQueryExtension.WindowGuid();
            };
            if (SelectorJQ.length > 0 && fw.fwObject.FWObjectHelper.hasValue(WindowGuid)) {
                if (Settings.IsUseSelectorWidthHeight) {
                    Settings.Width = SelectorJQ.width();
                    Settings.Height = SelectorJQ.height();
                };
                Settings.IsResizeWithSelector = true;
                var ControlJQs = jQueryExtension.UI.WindowInit({
                    IsFlash: Settings.IsFlash
                    , Speed: Settings.Speed
                    , Frequency: Settings.Frequency
                    , IsLock: Settings.IsLock
                    , WindowGuid: WindowGuid
                    , WindowStyles: "jQueryExtension_UI_WindowOpen"
                    , TitleImageStyles: Settings.TitleImageStyles
                    , HorizontalAlignment: Settings.HorizontalAlignment
                    , VerticalAlignment: Settings.VerticalAlignment
                    , Top: Settings.Top
                    , Right: Settings.Right
                    , Bottom: Settings.Bottom
                    , Left: Settings.Left
                    , Width: Settings.Width
                    , MinWidth: Settings.MinWidth
                    , Height: Settings.Height
                    , MinHeight: Settings.MinHeight
                    , IsResizeWithSelector: Settings.IsResizeWithSelector
                    , IsForeverLayout: Settings.IsForeverLayout
                    , ZIndex: Settings.ZIndex

                    , IsBodyHasBackground: Settings.IsBodyHasBackground
                    , IsHasHead: Settings.IsHasHead
                    , IsHasFullScreen: Settings.IsHasFullScreen
                    , IsHasMin: Settings.IsHasMin
                    , IsHasMax: Settings.IsHasMax
                    , IsHasClose: Settings.IsHasClose
                    , IsLock: Settings.IsLock
                    , IsDrag: Settings.IsDrag
                    , IsResize: Settings.IsResize
                    , CloseType: Settings.CloseType
                });
                if (ControlJQs.IsInit) {
                    if (fw.fwObject.FWObjectHelper.hasValue(Settings.ZIndex)) {
                        ControlJQs.WindowJQ.css("z-index", Settings.ZIndex);
                    };
                    ControlJQs.WindowJQ.insertBefore(SelectorJQ);
                    SelectorJQ.appendTo(ControlJQs.Window_Content_BodyJQ).data("WindowGuid", WindowGuid).show();
                    ControlJQs.Window_Content_BodyJQ.bind("jQueryExtension_Event_Resize", function () {
                        var BodyBox = jQueryExtension.Box(ControlJQs.Window_Content_BodyJQ);
                        var SelectorBox = jQueryExtension.Box(SelectorJQ);
                        SelectorJQ.width(ControlJQs.Window_Content_BodyJQ.width() - SelectorBox.MarginLeft - SelectorBox.BorderLeft - SelectorBox.MarginRight - SelectorBox.BorderRight);
                        SelectorJQ.height(ControlJQs.Window_Content_BodyJQ.height() - SelectorBox.MarginTop - SelectorBox.BorderTop - SelectorBox.MarginBottom - SelectorBox.BorderBottom);
                        SelectorJQ.triggerHandler("jQueryExtension_Event_Resize");
                    }).triggerHandler("jQueryExtension_Event_Resize");
                    ControlJQs.Window_Content_Head_TitleJQ.html(Settings.TitleHtml);
                } else {
                    jQueryExtension.UI.Lock({
                        IsFlash: Settings.IsFlash
                        , Speed: Settings.Speed
                        , Frequency: Settings.Frequency
                        , IsLock: Settings.IsLock
                        , IsAddLoadingFlash: false
                        , Selector: ControlJQs.WindowJQ
                        , CallBack: function () { }
                        , CloseType: Settings.CloseType
                        , CloseSelector: null
                        , CloseCallBack: function () { }
                    });
                };
            };
        } else if (fw.fwObject.FWObjectHelper.hasValue(Settings.ContentHtml)) {
            SelectorJQ = $("<div style=\"overflow: auto;\">" + Settings.ContentHtml + "</div>").appendTo("body");
            Settings.ContentHtml == null;
            Settings.Selector = SelectorJQ;
            Settings.IsUseSelectorWidthHeight = false;
            Settings.CloseType = jQueryExtension.Data.CloseType.Remove;
            jQueryExtension.UI.Info(Settings);
        };
    }
    , InfoClose: function (Properties) {
        var Settings = {
            Selector: null
        };
        $.extend(Settings, Properties);

        if (fw.fwObject.FWObjectHelper.hasValue(Settings.Selector)) {
            var WindowGuid = $(Settings.Selector).data("WindowGuid");
            if (fw.fwObject.FWObjectHelper.hasValue(WindowGuid)) {
                $("#Window_Content_Head_Tools_Close__" + WindowGuid).click();
            };
        };
    }


};

jQueryExtension.ControlHelper = {};
jQueryExtension.ControlHelper.CheckBox = {
    CheckAll: function (Properties) {
        /// <summary>
        /// 让与指定CheckBox有相同name的CheckBox全部选中与不选中
        ///
        /// Properties属性值：
        ///                   Selector: null                   //用于筛选的选择器
        /// </summary>
        /// <param name="Properties">属性</param>
        var Settings = {
            Selector: null
        };
        $.extend(Settings, Properties);

        var checkboxJQ = $(Settings.Selector);
        if (fw.fwObject.FWObjectHelper.hasValue(checkboxJQ.attr("checked"))) {
            $("input:checkbox[name='" + checkboxJQ.attr("name") + "']").attr("checked", checkboxJQ.attr("checked"));
        } else {
            $("input:checkbox[name='" + checkboxJQ.attr("name") + "']").removeAttr("checked");
        };
    }

    , GetCheckedValueList: function (Properties) {
        /// <summary>
        /// 获得与指定CheckBox有相同name的CheckBox的值的，该值通过ValueFormat设置具体格式
        ///
        /// Properties属性值：
        ///                   Selector: null                   //用于筛选的选择器
        ///                   ValueFormat: "'[V]'"             //获得选中CheckBox的值的格式 其中[V]表示值
        /// </summary>
        /// <param name="Properties">属性</param>
        var Settings = {
            Selector: null
        };
        $.extend(Settings, Properties);

        var checkboxJQ = $(Settings.Selector);
        var ValueList = [];
        $("input:checkbox[name='" + checkboxJQ.attr("name") + "']:checked").not(checkboxJQ).each(function () {
            ValueList.push($(this).val());
        });
        return ValueList;
    }

    , GetCheckedEntityList: function (Properties) {
        /// <summary>
        /// 获得与指定CheckBox有相同name的CheckBox的值的，该值通过ValueFormat设置具体格式
        ///
        /// Properties属性值：
        ///                   Selector: null                   //用于筛选的选择器
        ///                   ValueFormat: "'[V]'"             //获得选中CheckBox的值的格式 其中[V]表示值
        /// </summary>
        /// <param name="Properties">属性</param>
        var Settings = {
            Selector: null
        };
        $.extend(Settings, Properties);

        var checkboxJQ = $(Settings.Selector);
        var ValueList = [];
        $("input:checkbox[name='" + checkboxJQ.attr("name") + "']:checked").not(checkboxJQ).each(function () {
            ValueList.push($(this).data("Entity"));
        });
        return ValueList;
    }
    , GetAllEntityList: function (Properties) {
        /// <summary>
        /// 获得与指定CheckBox有相同name的CheckBox的值的，该值通过ValueFormat设置具体格式
        ///
        /// Properties属性值：
        ///                   Selector: null                   //用于筛选的选择器
        ///                   ValueFormat: "'[V]'"             //获得选中CheckBox的值的格式 其中[V]表示值
        /// </summary>
        /// <param name="Properties">属性</param>
        var Settings = {
            Selector: null
        };
        $.extend(Settings, Properties);

        var checkboxJQ = $(Settings.Selector);
        var ValueList = [];
        $("input:checkbox[name='" + checkboxJQ.attr("name") + "']").not(checkboxJQ).each(function () {
            var checkboxJQ = $(this);
            var Entity = checkboxJQ.data("Entity");
            Entity.CheckBoxChecked = checkboxJQ.filter(":checked").length;
            ValueList.push(Entity);
        });
        return ValueList;
    }
};
jQueryExtension.ControlHelper.Select = {
    DataBind: function (Properties) {
        /// <summary>
        /// 绑定Select下拉控件
        ///
        /// Properties属性值：
        ///                   Selector: null                     //用于筛选的选择器
        ///                   DataSource: []                     //Select控件的数据源
        ///                   DataTextField: 'Text'              //绑定的Text的字段名
        ///                   DataValueField: 'Value'            //绑定的Value的字段名
        ///                   FirstItemList: []                  //与DataSource相同类型的对象数组，绑定在DataSource之前
        ///                   LastItemList: []                   //与DataSource相同类型的对象数组，绑定在DataSource之后
        /// </summary>
        /// <param name="Properties">属性</param>
        var Settings = {
            Selector: null
            , DataSource: []
            , DataTextField: 'Name'
            , DataValueField: 'Code'
            , FirstItemList: []
            , LastItemList: []
        };
        $.extend(Settings, Properties);

        var selectJQ = $(Settings.Selector).data("ControlData", { Settings: Settings });
        //        var Html = '';
        //        for (var i = 0; i < Settings.FirstItemList.length; i++) {
        //            Html += "<option value='" + Settings.FirstItemList[i][Settings.DataValueField] + "'>" + Settings.FirstItemList[i][Settings.DataTextField] + "</option>";
        //        };

        //        var GetOptionHtml = function (Entity, Index) {
        //            if (Index == undefined) {
        //                Index = 0;
        //            };
        //            var Space = "";
        //            for (var i = 0; i < Index; i++) {
        //                Space += "　　";
        //            };
        //            var OptionHtml = "<option value='" + $.trim(Entity[Settings.DataValueField]) + "'>" + Space + Entity[Settings.DataTextField] + "</option>";
        //            if (Entity.ChildTreeDataList != null && Entity.ChildTreeDataList.length > 0) {
        //                Index += 1;
        //                for (var j = 0; j < Entity.ChildTreeDataList.length; j++) {
        //                    OptionHtml += GetOptionHtml(Entity.ChildTreeDataList[j], Index);
        //                };
        //            };
        //            return OptionHtml;
        //        };

        //        for (var i = 0; i < Settings.DataSource.length; i++) {
        //            Html += GetOptionHtml(Settings.DataSource[i], 0);
        //        };
        //        for (var i = 0; i < Settings.LastItemList.length; i++) {
        //            Html += "<option value='" + Settings.LastItemList[i][Settings.DataValueField] + "'>" + Settings.LastItemList[i][Settings.DataTextField] + "</option>";
        //        };
        //        selectJQ.html(Html);
        for (var i = 0; i < Settings.FirstItemList.length; i++) {
            var Entity = Settings.FirstItemList[i];
            $("<option value='" + Entity[Settings.DataValueField] + "'>" + Entity[Settings.DataTextField] + "</option>").data("Entity", Entity).appendTo(selectJQ);
        };

        var AddOption = function (Entity, Index) {
            if (Index == undefined) {
                Index = 0;
            };
            var Space = "";
            for (var i = 0; i < Index; i++) {
                Space += "　　";
            };
            $("<option value='" + $.trim(Entity[Settings.DataValueField]) + "' title='" + Entity[Settings.DataTextField] + "'>" + Space + Entity[Settings.DataTextField] + "</option>").data("Entity", Entity).appendTo(selectJQ);
            if (Entity.ChildTreeDataList != null && Entity.ChildTreeDataList.length > 0) {
                Index += 1;
                for (var j = 0; j < Entity.ChildTreeDataList.length; j++) {
                    AddOption(Entity.ChildTreeDataList[j], Index);
                };
            };
        };

        for (var i = 0; i < Settings.DataSource.length; i++) {
            AddOption(Settings.DataSource[i], 0);
        };
        for (var i = 0; i < Settings.LastItemList.length; i++) {
            var Entity = Settings.FirstItemList[i];
            $("<option value='" + Entity[Settings.DataValueField] + "'>" + Entity[Settings.DataTextField] + "</option>").data("Entity", Entity).appendTo(selectJQ);
        };
    }
};
jQueryExtension.ControlHelper.Input = {
    DataBind: function (Properties) {
        /// <summary>
        /// 将Input绑定成Select下拉类型
        ///
        /// Properties属性值：
        ///                   Selector: null                     //用于筛选的选择器
        ///                   DataSource: []                     //Select控件的数据源
        ///                   DataTextField: 'Text'              //绑定的Text的字段名
        ///                   DataValueField: 'Value'            //绑定的Value的字段名
        ///                   FirstItemList: []                  //与DataSource相同类型的对象数组，绑定在DataSource之前
        ///                   LastItemList: []                   //与DataSource相同类型的对象数组，绑定在DataSource之后
        /// </summary>
        /// <param name="Properties">属性</param>
        var Settings = {
            Selector: null
            , Data: []
            , DataTextField: 'Text'
            , DataValueField: 'Value'
            , FirstItemList: []
            , LastItemList: []
        };
        $.extend(Settings, Properties);

        var FocusObjectJQ;

        var inputValueJQ = $(Settings.Selector);

        var DateTimeGuid = $.Window.DateTimeGuid();
        var inputTextID = "input" + DateTimeGuid;
        var divID = "div" + DateTimeGuid;
        inputValueJQ.data('data', Settings.DataSource).data('inputtextid', inputTextID).data('divid', divID);

        var inputTextJQ = $('#' + inputTextID);
        if (inputTextJQ.length < 1) {
            var inputTextHtml = "<input id=\"" + inputTextID + "\" type=\"text\" />";
            inputValueJQ.before(inputTextHtml);
            inputTextJQ = $('#' + inputTextID);
            inputTextJQ.attr('class', inputValueJQ.attr('class')).attr('style', inputValueJQ.attr('style'));
            inputValueJQ.hide();
        };

        var divJQ = $('#' + divID);
        if (divJQ.length < 1) {
            var divHtml = "<div id=\"" + divID + "\" class=\"divInputSelect\"><ul>";
            for (var i = 0; i < Settings.FirstItemList.length; i++) {
                divHtml += "<li selectvalue=\"" + Settings.FirstItemList[i][Settings.DataValueField] + "\">" + Settings.FirstItemList[i][Settings.DataTextField] + "</li>";
            };
            for (var i = 0; i < Settings.DataSource.length; i++) {
                divHtml += "<li selectvalue=\"" + Settings.DataSource[i][Settings.DataValueField] + "\">" + Settings.DataSource[i][Settings.DataTextField] + "</li>";
            };
            for (var i = 0; i < Settings.LastItemList.length; i++) {
                divHtml += "<li selectvalue=\"" + Settings.LastItemList[i][Settings.DataValueField] + "\">" + Settings.LastItemList[i][Settings.DataTextField] + "</li>";
            };
            divHtml += "</ul></div>";
            $(divHtml).appendTo('body').hide();
            divJQ = $('#' + divID);
            divJQ.bind('click', function (e) {
                if (e.target.tagName == 'LI') {
                    var liJQ = $(e.target);
                    inputValueJQ.val(liJQ.attr('selectvalue'));
                    inputTextJQ.val(liJQ.html());
                    divJQ.hide();
                    FocusObjectJQ = undefined;
                    //                        alert(inputValueJQ.val());
                };
            });
        };
        var mousedownFunction = function (e) {
            var ObjectJQ = $(e.target);
            //                inputTextJQ.val(e.target.tagName);
            if (FocusObjectJQ != undefined && FocusObjectJQ.find('*').andSelf().index(ObjectJQ) > -1) {
                //                                        inputTextJQ.val('继续焦点');
            } else {
                //                                        inputTextJQ.val('失去焦点');
                $(document).unbind('mousedown', mousedownFunction);
                divJQ.hide();
                FocusObjectJQ = undefined;
            }
        };
        inputTextJQ.bind('focus', function () {
            this.blur();
            FocusObjectJQ = divJQ;
            var inputPosition = jQueryExtension.Position({ Selector: inputTextJQ });
            var divPosition = jQueryExtension.Position({ Selector: divJQ });

            var divLeft = inputPosition.AbsoluteLeft;
            var divTop = inputPosition.AbsoluteTop + inputPosition.AbsoluteHeight;
            var divWidth = divPosition.RelativeWidth > inputPosition.AbsoluteWidth ? divPosition.RelativeWidth : (inputPosition.AbsoluteWidth - 2);
            divJQ.css({
                "left": divLeft + "px"
                    , "top": (divTop + 1) + "px"
                    , "width": divWidth + "px"
            });
            divJQ.show();
            $(document).unbind('mousedown', mousedownFunction).bind('mousedown', mousedownFunction);
        });
    }
};

window.jQueryExtension.Data = window.$E_Data = jQueryExtension.Data;
window.jQueryExtension = window.$E = jQueryExtension;


$.DragAndDrop = {
    IsCanDrag: true
    , DragAndDrop: function (properties) {
        var Settings = {
            HandSelector: null                                       //抓起的对象
            , DragJQ: function (Result) { return Result.HandJQ; }     //抓起对象对应的拖动对象
            , DropToSelector: null                                   //用于筛选的选择器
            , IsCanMoveOut: false                                    //是否能够移出窗体左上角
            , IsClone: true                                          //是否复制对象跟随鼠标
            , MouseDownMillisecond: 0
            , MouseDown: function (Result) { }                        //鼠标按下（开始拖动时）触发的事件
            , CloneFinish: function (Result) { }                      //当IsClone为true 复制对象跟随鼠标完成时
            , MouseMove: function (Result) { }                        //鼠标移动（拖动过程中）触发的事件
            , MouseOver: function (Result) { }                        //鼠标在DropToSelector上触发的事件
            , MouseOut: function (Result) { }                         //鼠标离开DropToSelector上触发的事件
            , MouseUp: function (Result) { }                          //鼠标松开（拖动结束）触发的事件

            //几个事件的参数
            //Result.HandJQ         抓起的对象
            //Result.DragJQ         拖动的对象
            //Result.DragDivJQ      跟随鼠标的拖动层
            //Result.DragCloneJQ    跟随鼠标的拖动层中的对象（拖动对象的克隆）
            //Result.DropToJQ       拖动到的对象
        };
        $.extend(Settings, properties);

        if (!Settings.IsFlash) {
            Settings.Speed = 0;
        };

        var DragJQs = Settings.DragJQ();
        DragJQs.each(function () {
            var DragJQ = $(this);
            var HandSelectorJQ = $(Settings.HandSelector);
            if (HandSelectorJQ.length < 1) {
                HandSelectorJQ = DragJQ;
            };
            //            var DropToSelectorJQ = $(Settings.DropToSelector);
            var DropToSelectorJQ = null;

            var MouseDownMillisecond = 0;
            var MouseDownTimeFunction = null;
            var HandlerJS = null;
            var documentJQ = $(document);
            var MouseMoveTimeFunction = null;
            var MouseUpTimeFunction = null;

            if (Settings.MouseDownMillisecond <= MouseDownMillisecond) {
                HandSelectorJQ.bind("mouseover", function (e) {
                    if ($.isFunction(Settings.MoveCondition) && Settings.MoveCondition()) {
                        if (HandSelectorJQ.data("CursorStyle") == undefined) {
                            HandSelectorJQ.data("CursorStyle", HandSelectorJQ.css("cursor"));
                        };
                        HandSelectorJQ.css({ "cursor": "move" });
                    } else {
                        if (HandSelectorJQ.data("CursorStyle") != undefined) {
                            HandSelectorJQ.css("cursor", HandSelectorJQ.data("CursorStyle"));
                        };
                    };
                })
            };

            HandSelectorJQ.bind("mousedown", function (e) {
                MouseMoveTimeFunction = function () {
                    documentJQ.unbind("mousemove", MouseMoveTimeFunction);
                    documentJQ.unbind("mouseup", MouseUpTimeFunction);
                    if (MouseDownTimeFunction != null) {
                        clearInterval(MouseDownTimeFunction);
                    };
                };
                documentJQ.bind("mousemove", MouseMoveTimeFunction);
                MouseUpTimeFunction = function () {
                    documentJQ.unbind("mousemove", MouseMoveTimeFunction);
                    documentJQ.unbind("mouseup", MouseUpTimeFunction);
                    if (HandSelectorJQ.data("CursorStyle") != undefined) {
                        HandSelectorJQ.css("cursor", HandSelectorJQ.data("CursorStyle"));
                    };
                    if (MouseDownTimeFunction != null) {
                        clearInterval(MouseDownTimeFunction);
                    };
                };
                documentJQ.bind("mouseup", MouseUpTimeFunction);

                MouseDownMillisecond = 0;
                HandlerJS = this;
                var DragFunction = function () {
                    var IsMouseLeftDown = false;
                    if ($.browser.msie) {
                        IsMouseLeftDown = (e.button == "1");
                    } else {
                        IsMouseLeftDown = (e.button == "0");
                    };
                    if ($.DragAndDrop.IsCanDrag && IsMouseLeftDown) {
                        $.DragAndDrop.IsCanDrag = false;

                        var HandJQ = $(HandlerJS);
                        if ($.isFunction(Settings.DropToSelector)) {
                            DropToSelectorJQ = Settings.DropToSelector();
                        } else {
                            DropToSelectorJQ = $(Settings.DropToSelector);
                        };

                        var DragDivJQ = false;
                        var DragCloneJQ = false;
                        var DropToJQ = false;
                        var LastDropToJQ = false;

                        if ($.isFunction(Settings.MouseDown)) {
                            var ResultSettings = {
                                DragJQ: DragJQ
                                , DragDivJQ: DragDivJQ
                            };
                            Settings.MouseDown(ResultSettings);
                        };

                        if (Settings.IsClone) {
                            //获取鼠标相对拖动元素左上角位置
                            var DragPosition = jQueryExtension.Position(DragJQ);
                            var DragBox = jQueryExtension.Box(DragJQ);
                            var AddX = e.clientX - (DragPosition.AbsoluteLeft - jQueryExtension.ScrollLeft());
                            var AddY = e.clientY - (DragPosition.AbsoluteTop - jQueryExtension.ScrollTop());

                            //--------------------创建一个模拟拖动的层,并克隆一份拖动对象放在内部（开始）--------------------//
                            var Guid = jQueryExtension.WindowGuid();
                            $("<div id=\"jQueryDragAndDrop" + Guid + "\"></div>").css({
                                "position": "absolute"
                                , "zIndex": DragPosition.zIndex + 1
                                , "left": DragPosition.AbsoluteLeft + "px"
                                , "top": DragPosition.AbsoluteTop + "px"
                                , "width": DragBox.Width(jQueryExtension.Data.BoxInternalStructure.Border) + "px"
                                , "height": DragBox.Height(jQueryExtension.Data.BoxInternalStructure.Border) + "px"
                            }).appendTo("body");
                            var DragDivJQ = $("#jQueryDragAndDrop" + Guid);
                            var DragCloneJQ = DragJQ.clone();
                            DragCloneJQ.appendTo(DragDivJQ);
                            DragDivJQ.fadeTo(300, 0.6);
                            //--------------------创建一个模拟拖动的层,并克隆一份拖动对象放在内部（结束）--------------------//

                            if ($.isFunction(Settings.CloneFinish)) {
                                var ResultSettings = {
                                    DragJQ: DragJQ
                                    , DragCloneJQ: DragCloneJQ
                                    , DragDivJQ: DragDivJQ
                                };
                                Settings.CloneFinish(ResultSettings);
                            };
                        };

                        //设置鼠标的移动是基于document对象的移动
                        //                    var Object = $(document);
                        //开启Capture监控
                        if ($.browser.msie) {
                            HandlerJS.setCapture();
                        } else {
                            window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                        };

                        //鼠标移动执行事件
                        var mousemove = function (e) {
                            //--------------------页面有滚动条时，拖动到上下左右 1/5处 滚动条自动滚动（开始）--------------------//
                            var ClientWidth = jQueryExtension.ClientWidth();
                            var ClientHeight = jQueryExtension.ClientHeight();
                            var ScrollLeft = jQueryExtension.ScrollLeft();
                            var ScrollTop = jQueryExtension.ScrollTop();
                            if ((e.pageX - ScrollLeft) < (ClientWidth / 5)) {
                                jQueryExtension.ScrollLeft(ScrollLeft - 10);
                            } else if (ScrollLeft + ClientWidth - e.pageX < (ClientWidth / 5)) {
                                jQueryExtension.ScrollLeft(ScrollLeft + 10);
                            };
                            if ((e.pageY - ScrollTop) < (ClientHeight / 5)) {
                                jQueryExtension.ScrollTop(ScrollTop - 10);
                            } else if (ScrollTop + ClientHeight - e.pageY < (ClientHeight / 5)) {
                                jQueryExtension.ScrollTop(ScrollTop + 10);
                            };
                            //--------------------页面有滚动条时，拖动到上下左右 1/5处 滚动条自动滚动（结束）--------------------//


                            //--------------------鼠标移动过程中创建的模拟拖动层跟随移动（开始）--------------------//
                            if (Settings.IsClone) {
                                var divLeft = e.pageX - AddX;
                                var divTop = e.pageY - AddY;
                                if (!Settings.IsCanMoveOut) {
                                    divLeft = divLeft < 0 ? 0 : divLeft;
                                    divTop = divTop < 0 ? 0 : divTop;
                                };
                                DragDivJQ.css({
                                    "left": divLeft + "px"
                                    , "top": divTop + "px"
                                });
                            };
                            //--------------------鼠标移动过程中创建的模拟拖动层跟随移动（开始）--------------------//

                            //--------------------判断是否在允许插入的元素上（开始）--------------------//
                            DropToJQ = false;
                            DropToSelectorJQ.each(function () {
                                var ObjectPosition = jQueryExtension.Position(this);
                                var ObjectBox = jQueryExtension.Box(this);
                                if (ObjectPosition.AbsoluteLeft < e.pageX && e.pageX < (ObjectPosition.AbsoluteLeft + ObjectBox.Width(jQueryExtension.Data.BoxInternalStructure.Border))
                                    && ObjectPosition.AbsoluteTop < e.pageY && e.pageY < ObjectPosition.AbsoluteTop + ObjectBox.Height(jQueryExtension.Data.BoxInternalStructure.Border)) {
                                    DropToJQ = $(this);
                                    LastDropToJQ = $(this);
                                };
                            });

                            if (DropToJQ) {
                                if ($.isFunction(Settings.MouseOver)) {
                                    var ResultSettings = {
                                        HandJQ: HandJQ
                                        , DragJQ: DragJQ
                                        , DragCloneJQ: DragCloneJQ
                                        , DragDivJQ: DragDivJQ
                                        , DropToJQ: DropToJQ
                                    };
                                    Settings.MouseOver(ResultSettings);
                                };
                            } else {
                                if ($.isFunction(Settings.MouseOut)) {
                                    var ResultSettings = {
                                        HandJQ: HandJQ
                                        , DragJQ: DragJQ
                                        , DragCloneJQ: DragCloneJQ
                                        , DragDivJQ: DragDivJQ
                                        , DropToJQ: LastDropToJQ
                                    };
                                    Settings.MouseOut(ResultSettings);
                                };
                                LastDropToJQ = false;
                            };
                            //--------------------判断是否在允许插入的元素上（结束）--------------------//

                            if ($.isFunction(Settings.MouseMove)) {
                                var ResultSettings = {
                                    HandJQ: HandJQ
                            , DragJQ: DragJQ
                            , DragCloneJQ: DragCloneJQ
                            , DragDivJQ: DragDivJQ
                            , DropToJQ: DropToJQ
                                };
                                Settings.MouseMove(ResultSettings);
                            };

                        };

                        //鼠标松开执行事件
                        var mouseup = function (e) {
                            documentJQ.unbind("mousemove", mousemove);
                            documentJQ.unbind("mouseup", mouseup);
                            if ($.browser.msie) {
                                HandlerJS.releaseCapture();
                            } else if ($.browser.mozilla) {
                                window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                            };

                            if ($.isFunction(Settings.MouseUp)) {
                                var ResultSettings = {
                                    HandJQ: HandJQ
                            , DragJQ: DragJQ
                            , DragCloneJQ: DragCloneJQ
                            , DragDivJQ: DragDivJQ
                            , DropToJQ: DropToJQ
                                };
                                Settings.MouseUp(ResultSettings);
                            };

                            $.DragAndDrop.IsCanDrag = true;
                        }

                        //绑定鼠标移动和松开事件
                        documentJQ.bind('mousemove', mousemove).bind('mouseup', mouseup);
                    };
                };

                if (Settings.MouseDownMillisecond <= MouseDownMillisecond) {
                    DragFunction();
                } else {
                    MouseDownTimeFunction = setInterval(function () {
                        MouseDownMillisecond += 100;
                        if (Settings.MouseDownMillisecond <= MouseDownMillisecond) {
                            clearInterval(MouseDownTimeFunction);

                            DragFunction();
                        };
                    }, 100);
                };

            });
        });
    }
};



//jquery扩展左右滑动效果
jQuery.fn.slideLeftHide = function (speed, callback) { this.animate({ width: "hide", paddingLeft: "hide", paddingRight: "hide", marginLeft: "hide", marginRight: "hide" }, speed, callback); };
jQuery.fn.slideLeftShow = function (speed, callback) { this.animate({ width: "show", paddingLeft: "show", paddingRight: "show", marginLeft: "show", marginRight: "show" }, speed, callback); };