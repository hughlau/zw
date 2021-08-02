$.DivToopTip = function (options, element) {
    if (arguments.length) {
        this._initial(options, element);
    }
}
$.DivToopTip.prototype = {
    options: {
        offsetLeft: 10,
        offsetTop: 10,
        html: '',
        header: 'Header',
        width: 200,
        container: window,
        headerStyle: ''
    },
    element: null,
    _initial: function (options, element) {
        this.options = $.extend({}, this.options, options);
        this.element = $(element);
        this._create();
    },
    show: function (options, position) {
        var me = this;
        var options = $.extend({}, this.options, options);
        position = $.extend({ left: 200, top: 200 }, position);
        var Html = [];
        var left, top;
        var jQueryExtension_ToolTip = $('#jQueryExtension_ToolTip');
        if (jQueryExtension_ToolTip.length) {
            jQueryExtension_ToolTip.remove();
        }
        left = position.left + options.offsetLeft;
        top = position.top + options.offsetTop;
        if (top + options.height > $(window).height()) {
            top = position.top - options.height - options.offsetTop;
        }
        if (left + options.width > $(window).width()) {
            left = position.left - options.width - options.offsetLeft;
        }
        Html.push('<div id="jQueryExtension_ToolTip" style="display:none;" class="jQueryExtension_ToolTip">');
        Html.push('<div class="jQueryExtension_ToolTip_Inner">');
        Html.push('<div style="' + options.headerStyle + '" class="jQueryExtension_ToolTip_Inner_Header">');
        Html.push('<div class="jQueryExtension_ToolTip_Inner_Header_Title">');
        Html.push(options.header);
        Html.push('</div>');
        Html.push('<div class="jQueryExtension_ToolTip_Header_Tool">');
        Html.push('<div class="jQueryExtension_Button_Close" title="关闭">×</div>');
        Html.push('</div>');
        Html.push('</div>');
        Html.push('<div class="jQueryExtension_ToolTip_Inner_Body">');
        Html.push(options.html);
        Html.push('</div>');
        Html.push('</div>');
        Html.push('</div>');
        var DivToopTip = $(Html.join(''));
        $('.jQueryExtension_Button_Close', DivToopTip).bind('click', function () {
            me.hide();
        });
        DivToopTip.css({
            'width': options.width + 'px'
        });
        options.container.$('body').append(DivToopTip);
        DivToopTip.offset({ left: left, top: top });
        DivToopTip.show();
    },
    hide: function () {
        $('#jQueryExtension_ToolTip').remove();
    },
    _create: function () {
        var options = this.options;
        this.element.hover(function () {
            var $this = $(this);
            var position = $this.offset();
            var Html = [];
            var left, top;
            var jQueryExtension_ToolTip = $('#jQueryExtension_ToolTip');
            if (jQueryExtension_ToolTip.length) {
                jQueryExtension_ToolTip.remove();
            }
            left = position.left + options.offsetLeft;
            top = position.top + options.offsetTop;
            if (top + options.height > $(window).height()) {
                top = position.top - options.height - options.offsetTop;
            }
            if (left + options.width > $(window).width()) {
                left = position.left - options.width - options.offsetLeft;
            }
            Html.push('<div id="jQueryExtension_ToolTip" style="display:none;" class="jQueryExtension_ToolTip">');
            Html.push('<div class="jQueryExtension_ToolTip_Outer">');
            Html.push('<div class="jQueryExtension_ToolTip_Outer_TopLeft"></div>');
            Html.push('<div class="jQueryExtension_ToolTip_Outer_TopRight"></div>');
            Html.push('<div class="jQueryExtension_ToolTip_Outer_BottomLeft"></div>');
            Html.push('<div class="jQueryExtension_ToolTip_Outer_BottomRight"></div>');
            Html.push('<div class="jQueryExtension_ToolTip_Outer_Left"></div>');
            Html.push('<div class="jQueryExtension_ToolTip_Outer_Right"></div>');
            Html.push('<div class="jQueryExtension_ToolTip_Outer_Top"></div>');
            Html.push('<div class="jQueryExtension_ToolTip_Outer_Bottom"></div>');
            Html.push('</div>');
            Html.push('<div class="jQueryExtension_ToolTip_Inner">');
            Html.push('<div style="' + options.headerStyle + '" class="jQueryExtension_ToolTip_Inner_Header">');
            Html.push('<div class="jQueryExtension_ToolTip_Inner_Header_Title">');
            Html.push(options.header);
            Html.push('</div>');
            Html.push('</div>');
            Html.push('<div class="jQueryExtension_ToolTip_Inner_Body">');
            Html.push(options.html);
            Html.push('</div>');
            Html.push('</div>');
            Html.push('</div>');
            var DivToopTip = $(Html.join(''));
            DivToopTip.css({
                width: options.width + 'px',
                height: options.height + 'px'
            });
            options.container.$('body').append(DivToopTip);
            DivToopTip.offset({ left: left, top: top });
            DivToopTip.show();

        }, function () {
            $('#jQueryExtension_ToolTip').remove();
        });
    }
}
$.fn.ToolTip = function (options) {
    var returnValue = this;
    var args = Array.prototype.slice.call(arguments, 1);
    var isMethodCall = typeof options == 'string';
    this.each(function () {
        if (isMethodCall) {
            var instance = $.data(this, 'ToolTip');
            if (instance) {
                instance[options].apply(instance, args);
            }
        } else {
            $.data(this, 'ToolTip', new $.DivToopTip(options, this));
        }
    });
    return returnValue;
}