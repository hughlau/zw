$.FormHelper = {
    FormValidate: function (GroupList, RangeSelectorJQ) {
        var IsOnClick = true;
        $('*[datavalidate]', RangeSelectorJQ).each(function () {
            var SelectorJQ = $(this);
            var DataValidateSettingsString = SelectorJQ.attr('datavalidate');
            var DataValidateSettings;
            eval("DataValidateSettings=" + DataValidateSettingsString);

            var IsHasGroup = false;
            for (var i = 0; i < GroupList.length; i++) {
                if (DataValidateSettings.GroupList != undefined) {
                    for (var j = 0; j < DataValidateSettings.GroupList.length; j++) {
                        if (DataValidateSettings.GroupList[j] == GroupList[i]) {
                            IsHasGroup = true;
                            break;
                        };
                    };
                };
                if (IsHasGroup) {
                    break;
                };
            };

            if (IsHasGroup) {
                if (!$.FormHelper.ElementValidate(SelectorJQ)) {
                    IsOnClick = false;
                };
            };
        });
        return IsOnClick;
    }
    , ElementValidate: function (Selector, IsRecursive) {
        IsRecursive = IsRecursive == undefined ? true : false;
        var IsPass = false;
        var IsOrConditionPass = false;
        var SelectorJQ = $(Selector);
        var e = SelectorJQ[0];
        var DataValidateSettingsString = SelectorJQ.attr('datavalidate');
        if (DataValidateSettingsString != undefined) {
            var DataValidateSettings;
            eval("DataValidateSettings=" + DataValidateSettingsString);

            var ValueString = SelectorJQ.val();
            if (fw.fwObject.FWObjectHelper.hasValue(DataValidateSettings.RegularExpression)) {
                var thisRegularExpression = new RegExp(DataValidateSettings.RegularExpression);
                if (thisRegularExpression.test(ValueString)) {
                    IsPass = true;
                } else {
                    if (DataValidateSettings.AllowNull != undefined && !fw.fwObject.FWObjectHelper.hasValue(ValueString)) {
                        IsPass = true;
                    } else {
                        IsPass = false;
                    };
                };
            } else {
                IsPass = true;
            };
            if (DataValidateSettings.OrCondition != undefined && $.isFunction(DataValidateSettings.OrCondition)) {
                IsOrConditionPass = DataValidateSettings.OrCondition();
            };
            if (IsPass && DataValidateSettings.MaxNumberSelector != undefined) {
                var MaxNumberSelectorJQ;
                if ($.isFunction(DataValidateSettings.MaxNumberSelector)) {
                    MaxNumberSelectorJQ = DataValidateSettings.MaxNumberSelector(e);
                } else {
                    MaxNumberSelectorJQ = $(DataValidateSettings.MaxNumberSelector);
                };
                var MaxNumberValue = MaxNumberSelectorJQ.val();
                if (fw.fwObject.FWObjectHelper.hasValue(MaxNumberValue)) {
                    if (jQueryExtension.IsNumber(ValueString) && jQueryExtension.IsNumber(MaxNumberValue)) {
                        IsPass = parseFloat(ValueString) <= parseFloat(MaxNumberValue);
                    };
                    if (IsRecursive) {
                        $.FormHelper.ElementValidate(MaxNumberSelectorJQ, false);
                    };

                };
            };
            if (IsPass && DataValidateSettings.MinNumberSelector != undefined) {
                var MinNumberSelectorJQ;
                if ($.isFunction(DataValidateSettings.MinNumberSelector)) {
                    MinNumberSelectorJQ = DataValidateSettings.MinNumberSelector(e);
                } else {
                    MinNumberSelectorJQ = $(DataValidateSettings.MinNumberSelector);
                };
                var MinNumberValue = MinNumberSelectorJQ.val();
                if (fw.fwObject.FWObjectHelper.hasValue(MinNumberValue)) {
                    if (jQueryExtension.IsNumber(MinNumberValue) && jQueryExtension.IsNumber(ValueString)) {
                        IsPass = parseFloat(MinNumberValue) <= parseFloat(ValueString);
                    };
                    if (IsRecursive) {
                        $.FormHelper.ElementValidate(MinNumberSelectorJQ, false);
                    };
                };
            };
            if (IsPass || IsOrConditionPass) {
                IsPass = true;
            };
            if (IsPass) {
                SelectorJQ.removeClass('FormValidateWrong').addClass('FormValidateRight');
            } else {
                SelectorJQ.removeClass('FormValidateRight').addClass('FormValidateWrong');
            };
        } else {
            IsPass = true;
        };
        return IsPass;
    }
    , ValidateOnClickBind: function (Selector, OnClickEvent) {
        var SelectorJQ = $(Selector);
        if (SelectorJQ.length > 0) {
            if (SelectorJQ.data("OnClickEventList") == undefined) {
                SelectorJQ.data("OnClickEventList", []);
            };
            if ($.isFunction(OnClickEvent)) {
                SelectorJQ.data("OnClickEventList").push(OnClickEvent);
            };
        };
    }
    , FormValidateReset: function (RangeSelector) {
        if (fw.fwObject.FWObjectHelper.hasValue(RangeSelector)) {
            $('*', RangeSelector).add(RangeSelector).removeClass('FormValidateWrong').removeClass('FormValidateRight');
        } else {
            $('*').removeClass('FormValidateWrong').removeClass('FormValidateRight');
        };
    }
    , GetJsonData: function (Class, RangeSelector) {
        var RangeSelectorJQ;
        if (RangeSelector == undefined) {
            RangeSelectorJQ = $("*");
        } else {
            RangeSelectorJQ = $(RangeSelector);
        };
        var JsonData = new Object();
        $("*[jsondata^='{Class:\'" + Class + "\'']", RangeSelectorJQ).each(function () {
            var JQ = $(this);
            var JsonDataSettings;
            eval("JsonDataSettings=" + JQ.attr('jsondata'));
            if ('/TD/DIV/SPAN/LABLE/'.indexOf(this.tagName) > -1) {
                JsonData[JsonDataSettings.Property] = JQ.html();
            } else if (this.tagName.toLowerCase() == "input" && JQ.is(":checkbox")) {
                JsonData[JsonDataSettings.Property] = JQ.is(":checked");
            } else {
                JsonData[JsonDataSettings.Property] = JQ.val();
            };
            var ValueString = (JsonData[JsonDataSettings.Property] != null ? JsonData[JsonDataSettings.Property] : '');
            if (JsonDataSettings.Type != undefined) {
                switch (JsonDataSettings.Type) {
                    case "DateTime":
                        ValueString = ValueString.ToDate().ToString("UTCDateTime");
                        break;
                    case "Boolean":
                        ValueString = ((ValueString == true || ValueString == "1") ? 1 : 0);
                        break;
                };
            };
            if (JsonDataSettings.IsEmptyToNull != undefined && (JsonDataSettings.IsEmptyToNull || JsonDataSettings.IsEmptyToNull.toLowerCase() == "true" || JsonDataSettings.IsEmptyToNull == "1")) {
                if (!fw.fwObject.FWObjectHelper.hasValue(ValueString)) {
                    ValueString = undefined;
                };
            };
            JsonData[JsonDataSettings.Property] = ValueString;
        });
        return JsonData;
    }
    , SetJsonData: function (Class, JsonData, RangeSelector) {
        var RangeSelectorJQ;
        if (RangeSelector == undefined) {
            RangeSelectorJQ = $("*");
        } else {
            RangeSelectorJQ = $(RangeSelector);
        };
        $.FormHelper.ClearJsonData(Class, RangeSelectorJQ);

        for (var Object in JsonData) {
            $("*[jsondata^='{Class:\'" + Class + "\',Property:\'" + Object + "\'']", RangeSelectorJQ).each(function () {
                var JQ = $(this);
                var JsonDataSettings;
                eval("JsonDataSettings=" + JQ.attr('jsondata'));
                var ValueString = JsonData[Object] != null ? JsonData[Object] : '';
                if (JsonDataSettings.Type != undefined) {
                    switch (JsonDataSettings.Type) {
                        case "DateTime":
                            JsonDataSettings.FormatString = JsonDataSettings.FormatString != undefined ? JsonDataSettings.FormatString : "yyyy-MM-dd HH:mm:ss";
                            ValueString = ValueString.ToDate().ToString(JsonDataSettings.FormatString);
                            break;
                        case "Boolean":
                            if (this.tagName.toLowerCase() != "select") {
                                ValueString = (ValueString == "1" || ValueString.toLowerCase == "true") ? "是" : "否";
                            };
                            break;
                    };
                } else if (JsonDataSettings.Convert != undefined && $.isFunction(JsonDataSettings.Convert)) {
                    ValueString = JsonDataSettings.Convert(ValueString);
                };
                if ('/TD/DIV/SPAN/LABLE/'.indexOf(this.tagName) > -1) {
                    switch (JsonDataSettings.Type) {
                        case "Url":
                            ValueString = "<a href=\"" + ValueString + "\" target=\"_blank\">" + ValueString + "</a>";
                            break;
                    };
                    JQ.html(ValueString);
                } else if (this.tagName == "IMG") {
                    JQ.attr("src", $.page.webSiteRootUrl + ValueString + "&RandomNumber=" + jExtension.RandomNumber(0, 999999999));
                } else if (this.tagName.toLowerCase() == "input" && JQ.is(":checkbox")) {
                    if (ValueString == "是" || ValueString.toString() == "1") {
                        JQ.attr("checked", "checked");
                    } else {
                        JQ.removeAttr("checked");
                    };
                } else {
                    JQ.val($.trim(ValueString));
                };
            });
        };
    }
    , ClearJsonData: function (Class, RangeSelector) {
        var RangeSelectorJQ;
        if (RangeSelector == undefined) {
            RangeSelectorJQ = $("*");
        } else {
            RangeSelectorJQ = $(RangeSelector);
        };
        $("*[jsondata^='{Class:\'" + Class + "\'']", RangeSelectorJQ).each(function () {
            if ('/TD/DIV/SPAN/LABLE/'.indexOf(this.tagName) > -1) {
                $(this).html('&nbsp;');
            } else {
                $(this).val('');
            };
        });
    }
    , ClearControl: function (Class, RangeSelector) {
        var RangeSelectorJQ;
        if (RangeSelector == undefined) {
            RangeSelectorJQ = $("*");
        } else {
            RangeSelectorJQ = $(RangeSelector);
        };
        $("*[jsondata^='{Class:\'" + Class + "\'']", RangeSelectorJQ).each(function () {
            switch (this.tagName) {
                case "SELECT":
                    $(this).replaceWith($('option:selected', this).html());
                    break;
            };
        });
    }

};

$.fn.extend({
    FormValidate: function (options) {
        var FormValidateJQ = $("#jQueryExtension_UI_FormValidate");
        var FormValidate_CenterJQ = $("#jQueryExtension_UI_FormValidate_Center");
        if (FormValidateJQ.length < 1) {
            var Html = "<table id=\"jQueryExtension_UI_FormValidate\" class=\"jQueryExtension_UI_FormValidate\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">";
            Html += "    <tbody>";
            Html += "        <tr>";
            Html += "            <td class=\"jQueryExtension_UI_FormValidate_Left\"></td>";
            Html += "            <td id=\"jQueryExtension_UI_FormValidate_Center\" class=\"jQueryExtension_UI_FormValidate_Center\"></td>";
            Html += "            <td class=\"jQueryExtension_UI_FormValidate_Right\"></td>";
            Html += "        </tr>";
            Html += "    </tbody>";
            Html += "</table>";
            $(Html).hide().appendTo($("body")).data("IsTip", 0);

            FormValidateJQ = $("#jQueryExtension_UI_FormValidate");
            FormValidate_CenterJQ = $("#jQueryExtension_UI_FormValidate_Center");
        };

        this.each(function () {
            var SelectorJQ = $(this);
            var DataValidateSettingsString = SelectorJQ.attr('datavalidate');
            if (DataValidateSettingsString != undefined) {
                var DataValidateSettings;
                eval("DataValidateSettings=" + DataValidateSettingsString);

                if (this.type == "submit" || this.type == "button") {
                    $(this).unbind("hover").bind("hover", function (e) {
                        FormValidateJQ.hide();
                    });
                };

                if (DataValidateSettings.ValidateSelector != undefined) {
                    switch (this.type) {
                        case "checkbox":
                            $(this).bind("change", function () {
                                $.FormHelper.ElementValidate(DataValidateSettings.ValidateSelector, false);
                            });
                            break;
                        default:
                            break;
                    };
                };

                if (DataValidateSettings.RegularExpression != undefined) {
                    SelectorJQ.unbind("focus").bind("focus", function () {
                        SelectorJQ.removeClass('FormValidateWrong');
                        if (DataValidateSettings.Tip != undefined) {
                            var TipString = "";
                            var e = SelectorJQ[0];
                            if ($.isFunction(DataValidateSettings.Tip)) {
                                TipString = DataValidateSettings.Tip(e);
                            } else {
                                TipString = DataValidateSettings.Tip;
                            };
                            FormValidate_CenterJQ.html(TipString);
                            if (FormValidateJQ.data("IsTip") == 0) {
                                FormValidateJQ.data("IsTip", 1);
                            };
                            var SelectorPosition = jQueryExtension.Position(SelectorJQ);
                            var SelectorBox = jQueryExtension.Box(SelectorJQ);
                            var Left;
                            var Top;
                            //                            DataValidateSettings.TipDirection = jQueryExtension.Data.Direction.Left;
                            switch (DataValidateSettings.TipDirection) {
                                case jQueryExtension.Data.Direction.Left:
                                    Left = SelectorPosition.AbsoluteLeft - FormValidateJQ.width();
                                    Top = SelectorPosition.AbsoluteTop - (FormValidateJQ.height() - SelectorBox.Height(jQueryExtension.Data.BoxInternalStructure.Border)) / 2;
                                    break;
                                case jQueryExtension.Data.Direction.Top:
                                    Left = SelectorPosition.AbsoluteLeft - (FormValidateJQ.width() - SelectorBox.Width(jQueryExtension.Data.BoxInternalStructure.Border)) / 2;
                                    Top = SelectorPosition.AbsoluteTop - FormValidateJQ.height();
                                    break;
                                case jQueryExtension.Data.Direction.Right:
                                    Left = SelectorPosition.AbsoluteLeft + SelectorBox.Width(jQueryExtension.Data.BoxInternalStructure.Border);
                                    Top = SelectorPosition.AbsoluteTop - (FormValidateJQ.height() - SelectorBox.Height(jQueryExtension.Data.BoxInternalStructure.Border)) / 2;
                                    break;
                                //                                case "Bottom":                                                                                                                                                         
                                //                                    break;                                                                                                                                                         
                                default:
                                    Left = SelectorPosition.AbsoluteLeft - (FormValidateJQ.width() - SelectorBox.Width(jQueryExtension.Data.BoxInternalStructure.Border)) / 2;
                                    Top = SelectorPosition.AbsoluteTop + SelectorBox.Height(jQueryExtension.Data.BoxInternalStructure.Border);
                                    break;
                            };
                            FormValidateJQ.css({
                                "left": Left + "px"
                                , "top": Top + "px"
                            }).fadeIn("fast");
                        };
                    });
                    SelectorJQ.unbind("blur").bind("blur", function () {
                        if (DataValidateSettings.Tip != undefined) {
                            FormValidateJQ.data("IsTip", "0");
                            FormValidateJQ.hide();
                        };

                        $.FormHelper.ElementValidate(SelectorJQ);
                    });
                };

                if (DataValidateSettings.IsValidate != undefined && fw.fwObject.FWObjectHelper.hasValue(DataValidateSettings.GroupList)) {
                    var OnClickString = SelectorJQ.attr("onclick");
                    if (fw.fwObject.FWObjectHelper.hasValue(OnClickString)) {
                        $.FormHelper.ValidateOnClickBind(SelectorJQ, function () { eval(OnClickString); });
                        SelectorJQ.removeAttr("onclick")
                    };
                    SelectorJQ.unbind("click").bind("click", function () {
                        var OnClickSelectorDataValidateSettingsString = SelectorJQ.attr('datavalidate');
                        var OnClickSelectorDataValidateSettings;
                        eval("OnClickSelectorDataValidateSettings=" + OnClickSelectorDataValidateSettingsString);
                        var RangeSelectorJQ;
                        if (OnClickSelectorDataValidateSettings.RangeSelector == undefined) {
                            RangeSelectorJQ = $("*");
                        } else {
                            if ($.isFunction(OnClickSelectorDataValidateSettings.RangeSelector)) {
                                RangeSelectorJQ = OnClickSelectorDataValidateSettings.RangeSelector(this);
                            } else {
                                RangeSelectorJQ = $(OnClickSelectorDataValidateSettings.RangeSelector);
                            };
                        };

                        if ($.FormHelper.FormValidate(OnClickSelectorDataValidateSettings.GroupList, RangeSelectorJQ)) {
                            var OnClickEventList = SelectorJQ.data("OnClickEventList");
                            if (fw.fwObject.FWObjectHelper.hasValue(OnClickEventList)) {
                                for (var i = 0; i < OnClickEventList.length; i++) {
                                    OnClickEventList[i]();
                                };
                            };
                        };
                    });
                };

            };
        });
        return this;
    }

});


//$(window).load(function () {
//    $('*').FormValidate();
//});

