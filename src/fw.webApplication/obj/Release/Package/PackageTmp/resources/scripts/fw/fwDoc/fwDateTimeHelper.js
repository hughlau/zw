definePackage("fw.fwDateTime.FWDateTimeHelper");

var FWDateTimeHelper = fw.fwDateTime.FWDateTimeHelper;


/**
*@class FWBooleanHelper类是一个Boolean帮助类
*/
FWDateTimeHelper = function () {
    /**
    *返回增加(n)年的时间
    *@param DateTime - {日期对象} 
    *@param y - {int 年} 
    *@return DateTime
    */
    this.addYears = function (_DateTime, y) {
        if (Object.prototype.toString.apply(_DateTime) == "[object Date]" && Object.prototype.toString.apply(value) == "[object Number]") {
            _DateTime = new Date((_DateTime.getFullYear() + value), _DateTime.getMonth(), _DateTime.getDate(), _DateTime.getHours(), _DateTime.getMinutes(), _DateTime.getSeconds());
        };
        return _DateTime;
    };
    /**
    *返回增加(m)月份的时间
    *@param DateTime - {日期对象} 
    *@param m - {int 月份} 
    *@return DateTime
    */
    this.addMonths = function (_DateTime, m) {
        if (Object.prototype.toString.apply(_DateTime) == "[object Date]" && Object.prototype.toString.apply(value) == "[object Number]") {
            _DateTime = new Date(_DateTime.getFullYear(), (_DateTime.getMonth()) + value, _DateTime.getDate(), _DateTime.getHours(), _DateTime.getMinutes(), _DateTime.getSeconds());
        };
        return _DateTime;
    };
    /**
    *返回增加(w)周的时间
    *@param DateTime - {日期对象} 
    *@param w - {w 周} 
    *@return DateTime
    */
    this.addWeeks = function (_DateTime, w) {
        if (Object.prototype.toString.apply(_DateTime) == "[object Date]" && Object.prototype.toString.apply(value) == "[object Number]") {
            _DateTime = new Date(Date.parse(_DateTime) + (86400000 * 7 * value));
        };
        return _DateTime;
    };
    /**
    *返回增加(d)天的时间
    *@param DateTime - {日期对象} 
    *@param d - {int 天数} 
    *@return DateTime
    */
    this.addDays = function (_DateTime, d) {
        if (Object.prototype.toString.apply(_DateTime) == "[object Date]" && Object.prototype.toString.apply(value) == "[object Number]") {
            _DateTime = new Date(Date.parse(_DateTime) + (86400000 * value));
        };
        return _DateTime;
    };
    /**
    *返回增加(h)小时的时间
    *@param DateTime - {日期对象} 
    *@param h - {int 小时} 
    *@return DateTime
    */
    this.addHours = function (_DateTime, h) {
        if (Object.prototype.toString.apply(_DateTime) == "[object Date]" && Object.prototype.toString.apply(value) == "[object Number]") {
            _DateTime = new Date(Date.parse(_DateTime) + (3600000 * value));
        };
        return _DateTime;
    };
    /**
    *返回增加(min)分钟的时间
    *@param DateTime - {日期对象} 
    *@param minute - {int 分钟} 
    *@return DateTime
    */
    this.addMinutes = function (_DateTime, min) {
        if (Object.prototype.toString.apply(_DateTime) == "[object Date]" && Object.prototype.toString.apply(value) == "[object Number]") {
            _DateTime = new Date(Date.parse(_DateTime) + (60000 * value));
        };
        return _DateTime;
    };
    /**
    *返回增加(s)秒的时间
    *@param DateTime - {日期对象} 
    *@param second - {int 秒} 
    *@return DateTime
    */
    this.addSeconds = function (_DateTime, s) {
        if (Object.prototype.toString.apply(_DateTime) == "[object Date]" && Object.prototype.toString.apply(value) == "[object Number]") {
            _DateTime = new Date(Date.parse(_DateTime) + (1000 * value));
        };
        return _DateTime;
    };
    /**
    *将日期转换为字符串对象
    *@param DateTime - {日期对象} 
    *@param format - {string 日期格式对象 默认(yyyy-MM-dd HH:mm:ss)} 
    *@return string DateTime字符串
    */
    this.toString = function (_DateTime, format) {
        var result = null;
        if (!fw.fwObject.FWObjectHelper.hasValue(format)) {
            format = "yyyy-MM-dd HH:mm:ss";
        };
        if (format == "UTCDateTime") {
            result = "/Date(" + (TL.DateTime.AddHours(_DateTime, -8) - TL.ToDateTime("1970-01-01")) + "+0800)/";
        } else {
            var o = {
                "M+": _DateTime.getMonth() + 1, //月份
                "d+": _DateTime.getDate(), //日
                "h+": _DateTime.getHours() % 12 == 0 ? 12 : _DateTime.getHours() % 12, //12小时
                "H+": _DateTime.getHours(), //24小时
                "m+": _DateTime.getMinutes(), //分
                "s+": _DateTime.getSeconds(), //秒
                "q+": Math.floor((_DateTime.getMonth() + 3) / 3), //季度
                "S": _DateTime.getMilliseconds() //毫秒
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
    };
    /**
    *将2个日期转换为倒计时字符串对象
    *@param startTime - {开始日期} 
    *@param endTime - {结束日期} 
    *@return string 
    */
    this.toInTime = function (startTime, endTime) {
        var seconds = Math.abs(parseInt((endTime - startTime) / 1000, 10));
        return fw.fwNumber.FWNumberHelper.toInTime(seconds);
    };
};