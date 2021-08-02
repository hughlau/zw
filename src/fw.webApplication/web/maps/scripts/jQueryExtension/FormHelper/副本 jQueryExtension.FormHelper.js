$.FormHelper = {
    FormValidate: function (obj, ButtonName) {
        var strGroup = $(obj).attr("group");
        var Isonclick = true;
        $('*[reg]').each(function () {
            if ($(this).attr("group").indexOf(strGroup) > -1) {
                if ($(this).attr('allownull') != undefined) {
                    if (this.value != "") {
                        var thisReg = new RegExp($(this).attr('reg'));
                        if (!thisReg.test(this.value)) {
                            $(this).removeClass('FormValidateRight').addClass('FormValidateWrong');
                            Isonclick = false;
                        };
                    };
                } else {
                    var thisReg = new RegExp($(this).attr('reg'));
                    if (!thisReg.test(this.value)) {
                        $(this).removeClass('FormValidateRight').addClass('FormValidateWrong');
                        Isonclick = false;
                    };
                };
            };
        });
        if (Isonclick && ButtonName != "") {
            $("#" + ButtonName + "").click();
        };
        return Isonclick;
    }
    , FormValidateReset: function (Selector) {
        if (fw.fwObject.FWObjectHelper.hasValue(Selector)) {
            $('*', Selector).add(Selector).removeClass('FormValidateWrong').removeClass('FormValidateRight');
        } else {
            $('*').removeClass('FormValidateWrong').removeClass('FormValidateRight');
        };
    }
    , GetJsonData: function (Class, SelectorJQ) {
        if (SelectorJQ == undefined) {
            SelectorJQ = $("*");
        };
        var JsonData = new Object();
        $("*[jsondata^='{Class:\'" + Class + "\'']", SelectorJQ).each(function () {
            var JQ = $(this);
            var JsonDataSettings;
            eval("JsonDataSettings=" + JQ.attr('jsondata'));
            JsonData[JsonDataSettings.Property] = JQ.val();
        });
        return JsonData;
    }
    , ClearValue: function (Class, SelectorJQ) {
        if (SelectorJQ == undefined) {
            SelectorJQ = $("*");
        };
        $("*[jsondata^='{Class:\'" + Class + "\'']", SelectorJQ).each(function () {
            if ('/TD/DIV/SPAN/LABLE/'.indexOf(this.tagName) > -1) {
                $(this).html('');
            } else {
                $(this).val('');
            };
        });
    }
    , SetValue: function (Class, JsonData, SelectorJQ) {
        $.Page.ClearValue(Class, SelectorJQ);
        if (SelectorJQ == undefined) {
            SelectorJQ = $("*");
        };
        for (var Object in JsonData) {
            $("*[jsondata^='{Class:\'" + Class + "\',Property:\'" + Object + "\'}']", SelectorJQ).each(function () {
                var ValueString = JsonData[Object] != null ? JsonData[Object] : '';
                if ('/TD/DIV/SPAN/LABLE/'.indexOf(this.tagName) > -1) {
                    $(this).html(ValueString);
                } else if (this.tagName == "IMG") {
                    $(this).attr("src", ValueString);
                } else {
                    $(this).val(ValueString);
                };
            });
        };
    }
    , ClearControl: function (Class, SelectorJQ) {
        if (SelectorJQ == undefined) {
            SelectorJQ = $("*");
        };
        $("*[jsondata^='{Class:\'" + Class + "\'']", SelectorJQ).each(function () {
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

        //设置鼠标的移动是基于document对象的移动
        var Object = $(document);

        var mousemove = function (e) {
            if (FormValidateJQ.data("IsTip") == 1) {
                var ClientWidth = fw.clientWidth();
                var ClientHeight = fw.clientHeight();
                var Width = FormValidateJQ.width();
                var Height = FormValidateJQ.height();
                var Left = e.pageX;
                var Top = e.pageY;
                var Add = 10;
                if ((e.pageX + Add + Width) > ClientWidth) {
                    Left = e.pageX - Add - Width;
                } else {
                    Left = e.pageX + Add;
                };
                if ((e.pageY + Add + Height) > ClientHeight) {
                    Top = e.pageY - Add - Height;
                } else {
                    Top = e.pageY + Add;
                };
                FormValidateJQ.css({
                    "left": Left + "px"
                    , "top": Top + "px"
                });
            };
        };

        //绑定鼠标移动和松开事件
        Object.bind('mousemove', mousemove);

        this.each(function () {
            if (this.type == "submit" || this.type == "button") {
                $(this).hover(function (e) {
                    FormValidateJQ.hide();
                });
            };
            if ($(this).attr('tip') != undefined) {
                $(this).hover(function (e) {
                    FormValidate_CenterJQ.html($(this).attr('tip'));
                    if (FormValidateJQ.data("IsTip") == 0) {
                        FormValidateJQ.data("IsTip", 1);
                    };
                    FormValidateJQ.fadeIn("fast");
                }, function () {
                    FormValidateJQ.data("IsTip", "0");
                    FormValidateJQ.hide();
                });
            };

            if ($(this).attr('reg') != undefined) {
                $(this).focus(function () {
                    $(this).removeClass('FormValidateWrong');
                });
                $(this).blur(function () {
                    if ($(this).attr('allownull') != undefined) {
                        if (this.value == "")
                        { $(this).removeClass('FormValidateWrong').addClass('FormValidateRight'); return }
                    }
                    var thisReg = new RegExp($(this).attr('reg'));
                    if (thisReg.test(this.value)) {
                        $(this).removeClass('FormValidateWrong').addClass('FormValidateRight');
                    } else {
                        $(this).removeClass('FormValidateRight').addClass('FormValidateWrong');
                    };
                    if ($(this).attr('toupper') == 'true') {
                        this.value = this.value.toUpperCase();
                    };
                });
            };

            if ($(this).attr("isvalidate") != undefined && $(this).attr("group") != undefined) {
                var onclickTemp = $(this).attr("onclick");
                var ButtonName = "";
                if (onclickTemp != null) {
                    ButtonName = $(this).attr("id") + "onclickTemp";
                    if (document.getElementById(ButtonName) == null) {
                        $("body").append("<input id=\"" + ButtonName + "\" type=\"hidden\" />");
                    };
                    $("#" + ButtonName + "").bind("click", onclickTemp);
                    $(this).attr("onclick", "");
                };
                $(this).bind("click", function () {
                    return $.FormHelper.FormValidate(this, ButtonName);
                });
            };
        });
    }

});


//$(window).load(function () {
//    $('*').FormValidate();
//});

