$.DateTime = {
    LanguageSettings: function (LanguageType) {
        switch (LanguageType) {
            default:
                return {
                    MonthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
                    , MonthShortNames: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
                    , DayNames: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
                    , DayShortNames: ['一', '二', '三', '四', '五', '六', '日']
                };
        };
    }
    , Settings: function (LanguageType) {
        var LanguageSettings = $.DateTime.LanguageSettings(LanguageType);
        var Settings = {
            Selector: null                                                                                //用于筛选的选择器
            , Type: "DateTime"                                                                            //控件类型        日期时间DateTime       日期Date        时间Time
            , DateTimeFormat: null                                                                        //输出日期类型
            , MinDateTime: function () { return (new Date()).AddYear(-5).ToString("yyyy-MM-dd"); }        //控件最小时间
            , MaxDateTime: function () { return (new Date()).AddYear(5).ToString("yyyy-MM-dd"); }         //控件最大时间
            , SelectedDateTime: (new Date()).ToString("yyyy-MM-dd")                                       //已经被选中的时间
            , SelectedDateTimeFunction: function (ControlData) {
                var SelectedDateTime = "";
                if (!fw.fwObject.FWObjectHelper.hasValue(SelectedDateTime)) {
                    SelectedDateTime = $(ControlData.Settings.Selector).val();
                };
                if (!fw.fwObject.FWObjectHelper.hasValue(SelectedDateTime)) {
                    SelectedDateTime = $(ControlData.Settings.Selector).html();
                };
                if (!fw.fwObject.FWObjectHelper.hasValue(SelectedDateTime)) {
                    SelectedDateTime = (new Date()).ToString("yyyy-MM-dd");
                };
                return SelectedDateTime;
            }
            , YearMonthNow: (new Date()).ToString("yyyy-MM-dd")                                        //当前月选中的时间
            , EmptyCallBack: function () { }
            , NowCallBack: function () { }
            , EnterCallBack: function () { }
            , IsHasEmpty: true
            , IsHasNow: true
        };
        $.extend(Settings, LanguageSettings);
        return Settings;
    }
    , MMddhhmmssmsFormat: function (MMddhhmmssmsValue, MMddhhmmssmsType) {
        switch (MMddhhmmssmsType) {
            case "ms":
                return MMddhhmmssmsValue > 99 ? MMddhhmmssmsValue : (MMddhhmmssmsValue > 9 ? "0" + MMddhhmmssmsValue : "00" + MMddhhmmssmsValue);
            default:
                return MMddhhmmssmsValue = MMddhhmmssmsValue > 9 ? MMddhhmmssmsValue : "0" + MMddhhmmssmsValue;
        }
    }
    , DateTimeChange: function () {
        var ControlData = $("#jQueryExtension_UI_DateTime").data("ControlData");
        var Settings = ControlData.Settings;

        var DateTimeNow = new Date();
        var MinDateTime = Settings.MinDateTime().ToDate();
        var MaxDateTime = Settings.MaxDateTime();
        if (!fw.fwObject.FWObjectHelper.hasValue(MaxDateTime)) {
            MaxDateTime = new Date();
        } else {
            MaxDateTime = MaxDateTime.ToDate();
        };
        var SelectedDateTime = Settings.SelectedDateTime.ToDate();
        var YearMonthNow = Settings.YearMonthNow.ToDate();
        if (YearMonthNow == null) {
            if (SelectedDateTime == null) {
                YearMonthNow = DateTimeNow;
            } else {
                YearMonthNow = SelectedDateTime;
            };
        };
        YearMonthNow = YearMonthNow < MinDateTime ? MinDateTime : YearMonthNow;
        YearMonthNow = YearMonthNow > MaxDateTime ? MaxDateTime : YearMonthNow;

        var MinDateTimeYear = MinDateTime.getFullYear();
        var MinDateTimeMonth = MinDateTime.getMonth();
        var MinDateTimeDay = MinDateTime.getDate();
        var MaxDateTimeYear = MaxDateTime.getFullYear();
        var MaxDateTimeMonth = MaxDateTime.getMonth();
        var MaxDateTimeDay = MaxDateTime.getDate();
        var YearMonthNowYear = YearMonthNow.getFullYear();
        var YearMonthNowMonth = YearMonthNow.getMonth();

        //--------------------生成年份（开始）--------------------//
        var Html = "";
        var YearFrom = MinDateTimeYear;
        var YearTo = MaxDateTimeYear;
        do {
            Html += "<option value=\"" + YearFrom + "\"" + (YearFrom == YearMonthNowYear ? " selected=\"selected\"" : "") + ">" + YearFrom + "</option>";
            YearFrom++;
        }
        while (YearFrom <= YearTo)
        ControlData.ControlJQs.DateTime_SelectYearJQ.html(Html);
        //--------------------生成年份（结束）--------------------//

        //--------------------生成月份（开始）--------------------//
        Html = "";
        var MonthFrom, MonthTo;
        if (MaxDateTimeYear == MinDateTimeYear) {
            MonthFrom = MinDateTimeMonth + 1;
            MonthTo = MaxDateTimeMonth + 1;
        } else if (YearMonthNowYear == MinDateTimeYear) {
            MonthFrom = MinDateTimeMonth + 1;
            MonthTo = Settings.MonthShortNames.length;
        } else if (YearMonthNowYear == MaxDateTimeYear) {
            MonthFrom = 1;
            MonthTo = MaxDateTimeMonth + 1;
        } else {
            MonthFrom = 1;
            MonthTo = Settings.MonthShortNames.length;
        };
        for (var i = MonthFrom; i <= MonthTo; i++) {
            Html += "<option value=\"" + $.DateTime.MMddhhmmssmsFormat(i, "MM") + "\"" + ((i - 1) == YearMonthNowMonth ? " selected=\"selected\"" : "") + ">" + Settings.MonthShortNames[i - 1] + "</option>";
        };
        ControlData.ControlJQs.DateTime_SelectMonthJQ.html(Html);
        //--------------------生成月份（结束）--------------------//

        //--------------------生成天（开始）--------------------//
        var DayFrom, DayTo;
        var Day;
        var FirstDayWeek = new Date(YearMonthNowYear, YearMonthNowMonth, 1).getDay();
        FirstDayWeek = FirstDayWeek == 0 ? 7 : FirstDayWeek;
        var MaxDay = new Date(YearMonthNowYear, (YearMonthNowMonth + 1), 0).getDate();
        if (MaxDateTimeYear == MinDateTimeYear && MaxDateTimeMonth == MinDateTimeMonth) {
            Day = MinDateTimeDay;
            DayFrom = FirstDayWeek - 1 + MinDateTimeDay;
            DayTo = MaxDateTimeDay;
        } else if (YearMonthNowYear == MinDateTimeYear && YearMonthNowMonth == MinDateTimeMonth) {
            Day = MinDateTimeDay;
            DayFrom = FirstDayWeek - 1 + MinDateTimeDay;
            DayTo = MaxDay;
        } else if (YearMonthNowYear == MaxDateTimeYear && YearMonthNowMonth == MaxDateTimeMonth) {
            Day = 1;
            DayFrom = FirstDayWeek - 1;
            DayTo = MaxDateTimeDay;
        } else {
            Day = 1;
            DayFrom = FirstDayWeek - 1;
            DayTo = MaxDay;
        };
        $(">tr>td>div", ControlData.ControlJQs.DateTime_TbodyDayJQ).html('').removeClass("jQueryExtension_UI_DateTime_TbodyDay_Day jQueryExtension_UI_DateTime_TbodyDay_NowDay jQueryExtension_UI_DateTime_TbodyDay_SelectedDay").removeAttr("title").each(function (i) {
            var tdJQ = $(this);
            if (i >= DayFrom && Day <= DayTo) {
                var YearMonthNowDate = YearMonthNowYear + "-" + $.DateTime.MMddhhmmssmsFormat((YearMonthNowMonth + 1), "MM") + "-" + $.DateTime.MMddhhmmssmsFormat(Day, "dd");
                tdJQ.addClass("jQueryExtension_UI_DateTime_TbodyDay_Day").attr("title", YearMonthNowDate).html(Day);
                if (DateTimeNow.getFullYear() == YearMonthNowYear && DateTimeNow.getMonth() == YearMonthNowMonth && DateTimeNow.getDate() == Day) {
                    tdJQ.addClass("jQueryExtension_UI_DateTime_TbodyDay_NowDay").attr("title", "今天：" + YearMonthNowDate);
                };
                if (Settings.Type != 'Time' && fw.fwObject.FWObjectHelper.hasValue(SelectedDateTime) && SelectedDateTime.getFullYear() == YearMonthNowYear && SelectedDateTime.getMonth() == YearMonthNowMonth && SelectedDateTime.getDate() == Day) {
                    tdJQ.removeClass("jQueryExtension_UI_DateTime_TbodyDay_NowDay").addClass("jQueryExtension_UI_DateTime_TbodyDay_SelectedDay");
                };
                Day++;
            };
        });
        //--------------------生成天（结束）--------------------//

        ControlData.ControlJQs.DateTime_SelectHourJQ.val("00");
        ControlData.ControlJQs.DateTime_SelectMinuteJQ.val("00");
        ControlData.ControlJQs.DateTime_SelectSecondJQ.val("00");
        if (fw.fwObject.FWObjectHelper.hasValue(SelectedDateTime)) {
            ControlData.ControlJQs.DateTime_SelectHourJQ.val($.DateTime.MMddhhmmssmsFormat(SelectedDateTime.getHours(), "HH"));
            ControlData.ControlJQs.DateTime_SelectMinuteJQ.val($.DateTime.MMddhhmmssmsFormat(SelectedDateTime.getMinutes(), "mm"));
            ControlData.ControlJQs.DateTime_SelectSecondJQ.val($.DateTime.MMddhhmmssmsFormat(SelectedDateTime.getSeconds(), "ss"));
        };

    }
};


//日期控件
$.fn.extend({
    DateTime_Init: function (Properties) {
    }
    , DateTime: function (Properties) {
        if (!fw.fwObject.FWObjectHelper.hasValue(Properties)) {
            Properties = {};
        };
        var Settings = $.DateTime.Settings();
        $.extend(Settings, Properties);

        if (this.length > 0) {
            this.each(function () {
                $(this).blur();

                var ControlData = null;
                var DateTimeJQ = $("#jQueryExtension_UI_DateTime");
                if (DateTimeJQ.length < 1) {

                    var Html = "<table id=\"jQueryExtension_UI_DateTime\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">";
                    Html += "    <thead id=\"jQueryExtension_UI_DateTime_TheadYearMonth\">";
                    Html += "        <tr>";
                    Html += "            <th colspan=\"7\">";
                    Html += "                <table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\">";
                    Html += "                    <tbody>";
                    Html += "                        <tr>";
                    Html += "                            <td><div id=\"jQueryExtension_UI_DateTime_DivSubtractMonth\" title=\"上一月\"><<</div></td>";
                    Html += "                            <td><select id=\"jQueryExtension_UI_DateTime_SelectYear\" title=\"年份\"></select></td>";
                    Html += "                            <td><select id=\"jQueryExtension_UI_DateTime_SelectMonth\" title=\"月份\"></select></td>";
                    Html += "                            <td><div id=\"jQueryExtension_UI_DateTime_DivAddMonth\" title=\"下一月\">>></div></td>";
                    Html += "                        </tr>";
                    Html += "                    </tbody>";
                    Html += "                </table>";
                    Html += "            </th>";
                    Html += "        </tr>";
                    Html += "        <tr id=\"jQueryExtension_UI_DateTime_TrWeek\"><th><div>一</div></th><th><div>二</div></th><th><div>三</div></th><th><div>四</div></th><th><div>五</div></th><th><div>六</div></th><th><div>日</div></th></tr>";
                    Html += "    </thead>";
                    Html += "    <tbody id=\"jQueryExtension_UI_DateTime_TbodyDay\" class=\"jQueryExtension_UI_DateTime_TbodyDay\">";
                    Html += "        <tr><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td></tr>";
                    Html += "        <tr><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td></tr>";
                    Html += "        <tr><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td></tr>";
                    Html += "        <tr><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td></tr>";
                    Html += "        <tr><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td></tr>";
                    Html += "        <tr><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td></tr>";
                    Html += "    </tbody>";
                    Html += "    <tfoot id=\"jQueryExtension_UI_DateTime_TfootTime\" class=\"jQueryExtension_UI_DateTime_TfootTime\">";
                    Html += "        <tr>";
                    Html += "            <th colspan=\"7\">";
                    Html += "                <table id=\"jQueryExtension_UI_DateTime_Tfoot_TableTime\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\">";
                    Html += "                    <tr>";
                    Html += "                        <td><select id=\"jQueryExtension_UI_DateTime_SelectHour\" title=\"时\"></select></td>";
                    Html += "                        <td><select id=\"jQueryExtension_UI_DateTime_SelectMinute\" title=\"分\"></select></td>";
                    Html += "                        <td><select id=\"jQueryExtension_UI_DateTime_SelectSecond\" title=\"秒\"></select></td>";
                    Html += "                    </tr>";
                    Html += "                </table>";
                    Html += "                <table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\">";
                    Html += "                    <tr>";
                    Html += "                        <td><div id=\"jQueryExtension_UI_DateTime_Empty\" title=\"清空\">清空</div></td>";
                    Html += "                        <td><div id=\"jQueryExtension_UI_DateTime_Now\" title=\"现在\">现在</div></td>";
                    Html += "                        <td><div id=\"jQueryExtension_UI_DateTime_Enter\" title=\"确定\">确定</div></td>";
                    Html += "                    </tr>";
                    Html += "                </table>";
                    Html += "            </th>";
                    Html += "        </tr>";
                    Html += "    </tfoot>";
                    Html += "</table>";
                    $(Html).appendTo("body");
                    DateTimeJQ = $("#jQueryExtension_UI_DateTime");

                    var ControlData = {};
                    DateTimeJQ.data("ControlData", ControlData);

                    ControlData.ControlJQs = {
                        IsInit: true
                        , DateTimeJQ: DateTimeJQ
                        , DateTime_TheadYearMonthJQ: $("#jQueryExtension_UI_DateTime_TheadYearMonth")
                        , DateTime_SelectYearJQ: $("#jQueryExtension_UI_DateTime_SelectYear")
                        , DateTime_SelectMonthJQ: $("#jQueryExtension_UI_DateTime_SelectMonth")
                        , DateTime_DivSubtractMonthJQ: $("#jQueryExtension_UI_DateTime_DivSubtractMonth")
                        , DateTime_DivAddMonthJQ: $("#jQueryExtension_UI_DateTime_DivAddMonth")
                        , DateTime_TrWeekJQ: $("#jQueryExtension_UI_DateTime_TrWeek")
                        , DateTime_TbodyDayJQ: $("#jQueryExtension_UI_DateTime_TbodyDay")
                        , DateTime_TfootTimeJQ: $("#jQueryExtension_UI_DateTime_TfootTime")
                        , DateTime_Tfoot_TableTimeJQ: $("#jQueryExtension_UI_DateTime_Tfoot_TableTime")
                        , DateTime_SelectHourJQ: $("#jQueryExtension_UI_DateTime_SelectHour")
                        , DateTime_SelectMinuteJQ: $("#jQueryExtension_UI_DateTime_SelectMinute")
                        , DateTime_SelectSecondJQ: $("#jQueryExtension_UI_DateTime_SelectSecond")
                        , DateTime_EmptyJQ: $("#jQueryExtension_UI_DateTime_Empty")
                        , DateTime_NowJQ: $("#jQueryExtension_UI_DateTime_Now")
                        , DateTime_EnterJQ: $("#jQueryExtension_UI_DateTime_Enter")
                    };

                    Html = "";
                    for (var i = 0; i < 24; i++) {
                        var hh = $.DateTime.MMddhhmmssmsFormat(i, "HH");
                        if (hh == "00") {
                            Html += "<option value=\"00\">时</option>";
                        } else {
                            Html += "<option value=\"" + hh + "\">" + hh + "</option>";
                        };
                    };
                    ControlData.ControlJQs.DateTime_SelectHourJQ.html(Html);

                    Html = "";
                    for (var i = 0; i < 60; i++) {
                        var mm = $.DateTime.MMddhhmmssmsFormat(i, "HH");
                        if (mm == "00") {
                            Html += "<option value=\"00\">分</option>";
                        } else {
                            Html += "<option value=\"" + mm + "\">" + mm + "</option>";
                        };
                    };
                    ControlData.ControlJQs.DateTime_SelectMinuteJQ.html(Html);

                    Html = "";
                    for (var i = 0; i < 60; i++) {
                        var ss = $.DateTime.MMddhhmmssmsFormat(i, "HH");
                        if (ss == "00") {
                            Html += "<option value=\"00\">秒</option>";
                        } else {
                            Html += "<option value=\"" + ss + "\">" + ss + "</option>";
                        };
                    };
                    ControlData.ControlJQs.DateTime_SelectSecondJQ.html(Html);

                    //--------------------控件上按钮事件绑定（开始）--------------------//
                    //关闭按钮
                    //                divJQueryWindowCloseJQ.bind("click", function () {
                    //                    //让控件获得焦点再次失去焦点用来出发DataValidate数据验证
                    //                    SelectorJQ.blur();
                    //                    $.Window.Document.Unlock({
                    //                        IsFlash: false
                    //                        , Selector: tableJQueryWindowDateTimeJQ
                    //                        , CloseType: "hide"
                    //                    });
                    //                });



                    //清空按钮
                    ControlData.ControlJQs.DateTime_EmptyJQ.bind("click", function () {
                        $(ControlData.Settings.Selector).val("");
                        ControlData.ControlJQs.DateTimeJQ.hide();
                    });

                    //现在按钮
                    ControlData.ControlJQs.DateTime_NowJQ.bind("click", function () {
                        var DateTimeNow = new Date();
                        var SelectorValue = DateTimeNow.ToString(ControlData.Settings.DateTimeFormat);
                        var SelectorSettings = ControlData.Settings;
                        $(ControlData.Settings.Selector).val(SelectorValue);
                        ControlData.ControlJQs.DateTimeJQ.hide();
                        $(SelectorSettings.Selector).change().triggerHandler('datetimechange', SelectedDateTime);
                    });

                    //确定按钮
                    ControlData.ControlJQs.DateTime_EnterJQ.bind("click", function () {
                        var Year = ControlData.ControlJQs.DateTime_SelectYearJQ.val();
                        var Month = ControlData.ControlJQs.DateTime_SelectMonthJQ.val();
                        var Day = $(">tr>td>div.jQueryExtension_UI_DateTime_TbodyDay_SelectedDay", ControlData.ControlJQs.DateTime_TbodyDayJQ).html();
                        var SelectorSettings = ControlData.Settings;
                        switch (SelectorSettings.Type) {
                            case "DateTime":
                                if (!fw.fwObject.FWObjectHelper.hasValue(Day)) {
                                    alert('请选择日期！');
                                    return;
                                };
                                break;
                            case "Date":
                                if (!fw.fwObject.FWObjectHelper.hasValue(Day)) {
                                    alert('请选择日期！');
                                    return;
                                };
                                break;
                            case "Time":
                                Day = "01";
                                break;
                        };
                        var SelectedDateTime = Year + "-" + Month + "-" + $.DateTime.MMddhhmmssmsFormat(parseFloat(Day), "dd") + " " + ControlData.ControlJQs.DateTime_SelectHourJQ.val() + ":" + ControlData.ControlJQs.DateTime_SelectMinuteJQ.val() + ":" + ControlData.ControlJQs.DateTime_SelectSecondJQ.val();
                        SelectedDateTime = SelectedDateTime.ToDate();
                        if (fw.fwObject.FWObjectHelper.hasValue(SelectedDateTime)) {
                            $(SelectorSettings.Selector).val(SelectedDateTime.ToString(SelectorSettings.DateTimeFormat));
                            $(SelectorSettings.Selector).change().triggerHandler('datetimechange', SelectedDateTime);
                            ControlData.ControlJQs.DateTimeJQ.hide();
                        };
                    });
                    //--------------------控件上按钮事件绑定（结束）--------------------//

                    //--------------------日期控件上事件绑定（开始）--------------------//        
                    //年份发生变化
                    ControlData.ControlJQs.DateTime_SelectYearJQ.bind("change", function () {
                        var Year = ControlData.ControlJQs.DateTime_SelectYearJQ.val();
                        var Month = ControlData.ControlJQs.DateTime_SelectMonthJQ.val();
                        ControlData.Settings.YearMonthNow = Year + "-" + Month + "-01";
                        $.DateTime.DateTimeChange();
                    });

                    //月份发生变化
                    ControlData.ControlJQs.DateTime_SelectMonthJQ.bind("change", function () {
                        var Year = ControlData.ControlJQs.DateTime_SelectYearJQ.val();
                        var Month = ControlData.ControlJQs.DateTime_SelectMonthJQ.val();
                        ControlData.Settings.YearMonthNow = Year + "-" + Month + "-01";
                        $.DateTime.DateTimeChange();
                    });

                    //月份减少一个月发生变化（可能带动年份变化）
                    ControlData.ControlJQs.DateTime_DivSubtractMonthJQ.bind("click", function () {
                        var Year = parseFloat(ControlData.ControlJQs.DateTime_SelectYearJQ.val());
                        var Month = parseFloat(ControlData.ControlJQs.DateTime_SelectMonthJQ.val()) - 1;
                        if (Month < 1) {
                            Year -= 1;
                            Month = 12;
                        };
                        ControlData.Settings.YearMonthNow = Year + "-" + Month + "-01";
                        $.DateTime.DateTimeChange();
                    });

                    //月份增加一个月发生变化（可能带动年份变化）
                    ControlData.ControlJQs.DateTime_DivAddMonthJQ.bind("click", function () {
                        var Year = parseFloat(ControlData.ControlJQs.DateTime_SelectYearJQ.val());
                        var Month = parseFloat(ControlData.ControlJQs.DateTime_SelectMonthJQ.val()) + 1;
                        if (Month > 12) {
                            Year += 1;
                            Month = 1;
                        };
                        ControlData.Settings.YearMonthNow = Year + "-" + Month + "-01";
                        $.DateTime.DateTimeChange();
                    });


                    ControlData.ControlJQs.DateTime_TbodyDayJQ.bind("click", function (e) {
                        var Object = e.target;
                        if (Object.tagName == "DIV") {
                            var Day = Object.innerHTML.replace(/&nbsp;/g, "");
                            if (Day.length > 0) {
                                var Year = ControlData.ControlJQs.DateTime_SelectYearJQ.val();
                                var Month = ControlData.ControlJQs.DateTime_SelectMonthJQ.val();
                                $(">tr>td>div.jQueryExtension_UI_DateTime_TbodyDay_SelectedDay", ControlData.ControlJQs.DateTime_TbodyDayJQ).removeClass("jQueryExtension_UI_DateTime_TbodyDay_SelectedDay");
                                $(Object).addClass("jQueryExtension_UI_DateTime_TbodyDay_SelectedDay");
                                var SelectedDateTime = Year + "-" + Month + "-" + $.DateTime.MMddhhmmssmsFormat(parseFloat(Day), "dd");
                                SelectorSettings = ControlData.Settings;
                                SelectorSettings.SelectedDateTime = SelectedDateTime;
                                if (SelectorSettings.Type == "Date") {
                                    $(SelectorSettings.Selector).val(SelectedDateTime.ToString(SelectorSettings.DateTimeFormat));
                                    ControlData.ControlJQs.DateTimeJQ.hide();
                                    $(SelectorSettings.Selector).change().triggerHandler('datetimechange', SelectedDateTime);
                                };
                            };
                        };
                    });
                    //--------------------日期控件上事件绑定（结束）--------------------//

                };

                ControlData = DateTimeJQ.data("ControlData");
                ControlData.Settings = Settings;
                if (Settings.IsHasEmpty) {
                    ControlData.ControlJQs.DateTime_EmptyJQ.show();
                } else {
                    ControlData.ControlJQs.DateTime_EmptyJQ.hide();
                };
                if (Settings.IsHasNow) {
                    ControlData.ControlJQs.DateTime_NowJQ.show();
                } else {
                    ControlData.ControlJQs.DateTime_NowJQ.hide();
                };
                Settings.Selector = this;

                //加载星期
                $(">th>div", ControlData.ControlJQs.DateTime_TrWeekJQ).each(function (i) {
                    $(this).html(Settings.DayShortNames[i]);
                });

                var MinDateTime = Settings.MinDateTime().ToDate();
                var MaxDateTime = Settings.MaxDateTime();
                if (!fw.fwObject.FWObjectHelper.hasValue(MaxDateTime)) {
                    MaxDateTime = new Date();
                } else {
                    MaxDateTime = MaxDateTime.ToDate();
                };
                if (!fw.fwObject.FWObjectHelper.hasValue(MinDateTime)) {
                    alert("请填写开始日期时间！");
                    return;
                    //                throw "属性 MinDateTime方法与MaxDateTime方法 必须返回日期型！";
                } else if (MaxDateTime == null) {
                    alert("请填写结束日期时间！");
                    return;
                } else if (MaxDateTime < MinDateTime) {
                    alert("开始日期时间不能大于结束日期时间！");
                    return;
                    //                throw "属性 MaxDateTime方法返回日期 必须大于 MinDateTime方法返回日期！";
                } else {
                    ControlData.ControlJQs.DateTimeJQ.show();
                };

                var SelectedDateTime = "";
                if (!fw.fwObject.FWObjectHelper.hasValue(SelectedDateTime)) {
                    if ($.isFunction(Settings.SelectedDateTimeFunction)) {
                        SelectedDateTime = Settings.SelectedDateTimeFunction(ControlData);
                    };
                };
                if (!fw.fwObject.FWObjectHelper.hasValue(SelectedDateTime)) {
                    SelectedDateTime = $(Settings.Selector).val();
                };
                if (!fw.fwObject.FWObjectHelper.hasValue(SelectedDateTime)) {
                    SelectedDateTime = $(Settings.Selector).html();
                };
                switch (Settings.Type) {
                    case "DateTime":
                        ControlData.ControlJQs.DateTime_TheadYearMonthJQ.show();
                        ControlData.ControlJQs.DateTime_TbodyDayJQ.show();
                        ControlData.ControlJQs.DateTime_Tfoot_TableTimeJQ.show();
                        if (!fw.fwObject.FWObjectHelper.hasValue(Settings.DateTimeFormat)) {
                            Settings.DateTimeFormat = "yyyy-MM-dd HH:mm:ss";
                        };
                        if (SelectedDateTime.length > 0) {
                            Settings.SelectedDateTime = SelectedDateTime;
                        };
                        break;
                    case "Date":
                        ControlData.ControlJQs.DateTime_TheadYearMonthJQ.show();
                        ControlData.ControlJQs.DateTime_TbodyDayJQ.show();
                        ControlData.ControlJQs.DateTime_Tfoot_TableTimeJQ.hide();
                        if (!fw.fwObject.FWObjectHelper.hasValue(Settings.DateTimeFormat)) {
                            Settings.DateTimeFormat = "yyyy-MM-dd";
                        };
                        if (SelectedDateTime.length > 0) {
                            Settings.SelectedDateTime = SelectedDateTime;
                        };
                        break;
                    case "Time":
                        ControlData.ControlJQs.DateTime_TheadYearMonthJQ.hide();
                        ControlData.ControlJQs.DateTime_TbodyDayJQ.hide();
                        ControlData.ControlJQs.DateTime_Tfoot_TableTimeJQ.show();
                        if (!fw.fwObject.FWObjectHelper.hasValue(Settings.DateTimeFormat)) {
                            Settings.DateTimeFormat = "HH:mm:ss";
                        };
                        if (SelectedDateTime.length > 0) {
                            Settings.SelectedDateTime = "2008-08-08 " + SelectedDateTime;
                        };
                        break;
                };

                Settings.YearMonthNow = SelectedDateTime;
                $.DateTime.DateTimeChange();



                var DateTimeControlLeft = 0;
                var DateTimeControlTop = 0;
                var ControlPosition = jQueryExtension.Position(this);
                var ControlBox = jQueryExtension.Box(this);
                var ControlHeight = ControlBox.Height(jQueryExtension.Data.BoxInternalStructure.Border);
                var DateTimeControlBox = jQueryExtension.Box(ControlData.ControlJQs.DateTimeJQ);
                DateTimeControlLeft = ControlPosition.AbsoluteLeft;
                DateTimeControlHeight = DateTimeControlBox.Height(jQueryExtension.Data.BoxInternalStructure.Border);
                var ClientHeight = fw.clientHeight();

                var TopHeight = ControlPosition.AbsoluteTop;
                var BottomHeight = ClientHeight - ControlPosition.AbsoluteTop + ControlHeight + 1;
                if (BottomHeight < DateTimeControlHeight && BottomHeight < TopHeight) {
                    DateTimeControlTop = TopHeight - DateTimeControlHeight - 1;
                } else {
                    DateTimeControlTop = TopHeight + ControlHeight + 1
                };

                ControlData.ControlJQs.DateTimeJQ.css({
                    "left": DateTimeControlLeft + "px"
                    , "top": DateTimeControlTop + "px"
                });

            });
        };

        return this;
    }
});