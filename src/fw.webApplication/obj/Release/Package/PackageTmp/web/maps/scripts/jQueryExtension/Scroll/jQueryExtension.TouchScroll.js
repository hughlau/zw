$.TouchScroll = {
    Settings: function () {
        return {
            Selector: null                                                                                 //Scroll控件选择器
            , YScrollBar: true                                                                             //是否显示Y轴滚动条
            , XScrollBar: false                                                                             //是否显示X轴滚动条
            , PreventDefault: true                                                                         //阻止上级滚动联动
            , ScrollAccelerateCoefficient: 0.1                                                             //滚动加速系数 鼠标移动的距离/所用的时间(毫秒) 越大越不容易触发滑动加速
            , ScrollFramesCoefficient: 40                                                                  //滚动帧数系数 动画次数 越大滚动距离越大
            , ScrollAddCoefficient: 5                                                                     //滚动增量系数 每次滚动增加量 越大滚动距离越大
            , DataSourceDelay: 300                                                                         //数据加载延时（解决在控件呈现之前 获得控件高度为0）
            , DataSourceFunction: function (ControlData) {                                                 //增加数据的函数
                //for (var i = 0; i < 50; i++) {
                //    $("<div>" + i + "</div>").appendTo(ControlData.ControlJQs.ContentJQ);
                //};
            }
            , ScrollFunction: function (ControlData) {
            }
            , ScrollBarWidth: 17                                    //滚动条宽度
        };
    }
    , ScrollTop: function (Properties) {
        var Settings = {
            Selector: null                                       //Scroll控件选择器
            , ScrollTop: null
        };
        $.extend(Settings, Properties);
        var ControlData = $(Settings.Selector).data("ControlData");
        if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
            if (fw.fwObject.FWObjectHelper.hasValue(Settings.ScrollTop)) {
                ControlData.ControlJQs.ContentJQ.scrollTop(Settings.ScrollTop);
            } else {
                return ControlData.ControlJQs.ContentJQ.scrollTop();
            };
        };
    }
    , ScrollBarInit: function (Properties) {
        var Settings = {
            Selector: null                                       //Scroll控件选择器
        };
        $.extend(Settings, Properties);
        var ControlData = $(Settings.Selector).data("ControlData");
        if (fw.fwObject.FWObjectHelper.hasValue(ControlData) && (ControlData.IsTouch || ControlData.IsTouchModel)) {
            if (ControlData.Settings.YScrollBar) {
                //计算滚动条形状的高度 计算公式：控件高度/(内容高度/控件高度)
                var YHeight = ControlData.ControlJQs.YScrollJQ.height();
                var BarHeight = YHeight / ((ControlData.ControlJQs.ContentJS.scrollHeight + ControlData.Settings.ScrollBarWidth) / ControlData.ControlJQs.ContentJQ.height());
                YHeight -= ControlData.YScrollBarDefaultTop * 2;
                if (BarHeight > YHeight) { BarHeight = YHeight };
                ControlData.ControlJQs.YScrollBarJQ.height(BarHeight);
                ControlData.ControlJQs.YScrollJQ.show();
            } else {
                ControlData.ControlJQs.YScrollJQ.hide();
            };

            if (ControlData.Settings.XScrollBar) {
                var XWidth = ControlData.ControlJQs.XScrollJQ.width();
                var BarWidth = XWidth / ((ControlData.ControlJQs.ContentJS.scrollWidth + ControlData.Settings.ScrollBarWidth) / ControlData.ControlJQs.ContentJQ.width());
                XWidth -= ControlData.XScrollBarDefaultLeft * 2;
                if (BarWidth > XWidth) { BarWidth = XWidth };
                ControlData.ControlJQs.XScrollBarJQ.width(BarWidth);
                ControlData.ControlJQs.XScrollJQ.show();
            } else {
                ControlData.ControlJQs.XScrollJQ.hide();
            };
        };
    }
    , GetContentJQ: function (Properties) {
        var Settings = {
            Selector: null                                       //Scroll控件选择器
        };
        $.extend(Settings, Properties);
        var ControlData = $(Settings.Selector).data("ControlData");
        var ContentJQ = $();
        if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
            ControlData = ControlData.ControlJQs.ContentJQ;
        };
        return ContentJQ;
    }
    , DataBind: function (Properties) {
        var Settings = {
            Selector: null                                       //Scroll控件选择器
        };
        $.extend(Settings, Properties);
        var ControlData = $(Settings.Selector).data("ControlData");
        if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
            $.TouchScroll.ScrollBarInit({ Selector: ControlData.ControlJQs.SelectorJQ });
            //IE6.0显示Bug
            if ($.browser.msie && $.browser.version == "6.0") {
                ControlData.ControlJQs.SelectorJQ.hide();
                ControlData.ControlJQs.SelectorJQ.show();
            };
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

        jQueryExtension.ResizeWidthHeight(Settings);
        $.TouchScroll.ScrollBarInit({ Selector: Settings.Selector });
    }
};
//分页TouchScroll
$.fn.extend({
    TouchScroll_Init: function (Properties) {
        if (!fw.fwObject.FWObjectHelper.hasValue(Properties)) { Properties = {}; };
        var Settings = $.TouchScroll.Settings();
        $.extend(Settings, Properties);

        this.each(function () {
            var TouchScrollJQ = $(this);
            var ControlData = TouchScrollJQ.data("ControlData");

            //判断Scroll有没缓存数据，有表示已经加载控件，无表示控件第一次加载
            if (!fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                ControlData = {
                    IsTouch: jQueryExtension.IsTouch()
                    , IsTouchModel: (fw.fwObject.FWObjectHelper.hasValue(fw.fwCookie.FWCookieHelper("IsTouchModel"))&&(fw.fwCookie.FWCookieHelper("IsTouchModel").toLowerCase() == "true" || fw.fwCookie.FWCookieHelper("IsTouchModel").toLowerCase() == "1"))
                    , ControlJQs: {}
                    , IsScroll: false
                    , IsMouseDown: false
                };
                if (ControlData.IsTouch) {
                    ControlData.IsTouchModel = true;
                };
                TouchScrollJQ.data("ControlData", ControlData).empty();
                if (TouchScrollJQ.css("position").toLowerCase() != "absolute") {
                    TouchScrollJQ.css("position", "relative");
                };

                var Html = "";
                Html += "<div class=\"jQE_Container_Absolute\">";
                Html += "    <div class=\"jQE_Container_Background\"></div>";
                Html += "    <div class=\"jQE_Container_Compatible\"></div>";
                Html += "    <div class=\"jQE_Container_Content\">";
                Html += "        <div class=\"jQE_Container_Background\"></div>";
                Html += "        <div class=\"jQE_Container_Compatible\"></div>";
                Html += "        <div class=\"jQE_Container_Content\">";
                //内容
                Html += "        </div>";
                Html += "    </div>";
                Html += "    <div class=\"jQE_Container_Scroll_Y\">";
                Html += "        <div class=\"jQE_Container_Background\"></div>";
                Html += "        <div class=\"jQE_Container_Compatible\"></div>";
                Html += "        <div class=\"jQE_Container_Content\">";
                Html += "            <div class=\"jQE_Container_ScrollBar\"></div>";
                Html += "        </div>";
                Html += "    </div>";
                Html += "    <div class=\"jQE_Container_Scroll_X\">";
                Html += "        <div class=\"jQE_Container_Background\"></div>";
                Html += "        <div class=\"jQE_Container_Compatible\"></div>";
                Html += "        <div class=\"jQE_Container_Content\">";
                Html += "            <div class=\"jQE_Container_ScrollBar\"></div>";
                Html += "        </div>";
                Html += "    </div>";
                Html += "    <div class=\"jQE_Container_Loading\">";
                Html += "        <div class=\"jQE_Container_Background\"></div>";
                Html += "        <div class=\"jQE_Container_Compatible\"></div>";
                Html += "        <div class=\"jQE_Container_Content\"></div>";
                Html += "    </div>";
                Html += "</div>";
                $(Html).appendTo(TouchScrollJQ);

                //ControlData.IsTouch = true;
                ControlData.ControlJQs.TouchScrollJQ = TouchScrollJQ.addClass('jQE_UI_TouchScroll');
                ControlData.ControlJQs.SelectorJQ = TouchScrollJQ;
                ControlData.ControlJQs.AbsoluteJQ = $(">div.jQE_Container_Absolute", ControlData.ControlJQs.SelectorJQ);
                ControlData.ControlJQs.LoadingJQ = $(">div.jQE_Container_Loading", ControlData.ControlJQs.AbsoluteJQ);
                ControlData.ControlJQs.ContentJQ = $(">div.jQE_Container_Content>div.jQE_Container_Content", ControlData.ControlJQs.AbsoluteJQ).css("overflow-y", ((!ControlData.IsTouchModel && Settings.YScrollBar) ? "auto" : "hidden")).css("overflow-x", ((!ControlData.IsTouchModel && Settings.XScrollBar) ? "auto" : "hidden")).bind("selectstart", function () { return false; });
                ControlData.ControlJQs.ContentJS = ControlData.ControlJQs.ContentJQ[0];
                ControlData.ControlJQs.YScrollJQ = $(">div.jQE_Container_Scroll_Y", ControlData.ControlJQs.AbsoluteJQ);
                ControlData.ControlJQs.YScrollBarJQ = $(">div.jQE_Container_Content>div.jQE_Container_ScrollBar", ControlData.ControlJQs.YScrollJQ);
                ControlData.YScrollBarDefaultTop = parseInt(ControlData.ControlJQs.YScrollBarJQ.width() / 2);
                ControlData.ControlJQs.YScrollBarJQ.css("top", ControlData.YScrollBarDefaultTop + "px");
                ControlData.ControlJQs.XScrollJQ = $(">div.jQE_Container_Scroll_X", ControlData.ControlJQs.AbsoluteJQ);
                ControlData.ControlJQs.XScrollBarJQ = $(">div.jQE_Container_Content>div.jQE_Container_ScrollBar", ControlData.ControlJQs.XScrollJQ);
                ControlData.XScrollBarDefaultLeft = parseInt(ControlData.ControlJQs.XScrollBarJQ.height() / 2);
                ControlData.ControlJQs.XScrollBarJQ.css("left", ControlData.XScrollBarDefaultLeft + "px");

                ControlData.Settings = Settings;

                $.TouchScroll.ScrollBarInit({ Selector: ControlData.ControlJQs.SelectorJQ });

                var eventModel = function () {
                    var Entity = {};
                    Entity.eSlide = eSlide;
                    Entity.eStart = eStart;
                    Entity.eLastMove = eLastMove;
                    Entity.eEnd = eEnd;
                    if (Entity.eLastMove.ClientX != null) {
                        Entity.LastMoveX = Entity.eEnd.ClientX - Entity.eLastMove.ClientX;
                        Entity.LastMoveY = Entity.eEnd.ClientY - Entity.eLastMove.ClientY;
                        Entity.LastMoveTime = Entity.eEnd.Time - Entity.eLastMove.Time;
                        Entity.LastHorizontalMoveDirection = "Center";
                        if (Entity.LastMoveX > 0) { Entity.LastHorizontalMoveDirection = "Left"; } else if (Entity.LastMoveX < 0) { Entity.LastHorizontalMoveDirection = "Right"; };
                        Entity.LastVerticalMoveDirection = "Middle";
                        if (Entity.LastMoveY > 0) { Entity.LastVerticalMoveDirection = "Top"; } else if (Entity.LastMoveY < 0) { Entity.LastVerticalMoveDirection = "Bottom"; };
                        Entity.LastMoveXCoefficient = Math.abs(Entity.LastMoveX) / Entity.LastMoveTime;
                        Entity.IsLastMoveXAccelerate = Entity.LastMoveXCoefficient > ControlData.Settings.ScrollAccelerateCoefficient;
                        Entity.LastMoveYCoefficient = Math.abs(Entity.LastMoveY) / Entity.LastMoveTime;
                        Entity.IsLastMoveYAccelerate = Entity.LastMoveYCoefficient > ControlData.Settings.ScrollAccelerateCoefficient;
                        Entity.IsLastMoveAccelerate = Entity.IsLastMoveXAccelerate || Entity.IsLastMoveYAccelerate;
                    };

                    var Html = "";
                    Html += "eSlide.IsMouseDown=" + Entity.eSlide.IsMouseDown + ",";
                    Html += "eStart.ClientX=" + Entity.eStart.ClientX + ",";
                    Html += "eStart.ClientY=" + Entity.eStart.ClientY + ",";
                    Html += "eLastMove.ClientX=" + Entity.eLastMove.ClientX + ",";
                    Html += "eLastMove.ClientY=" + Entity.eLastMove.ClientY + ",";
                    Html += "eEnd.ClientX=" + Entity.eEnd.ClientX + ",";
                    Html += "eEnd.ClientY=" + Entity.eEnd.ClientY + ",";
                    Html += "<br/>";
                    if (Entity.eLastMove.ClientX != null) {
                        Html += "LastMoveX=" + Entity.LastMoveX + ",";
                        Html += "LastMoveY=" + Entity.LastMoveY + ",";
                        Html += "LastMoveTime=" + Entity.LastMoveTime + ",";
                        Html += "LastHorizontalMoveDirection=" + Entity.LastHorizontalMoveDirection + ",";
                        Html += "LastVerticalMoveDirection=" + Entity.LastVerticalMoveDirection + ",";
                        Html += "LastMoveYCoefficient=" + Entity.LastMoveYCoefficient + ",";
                    };
                    Html += "<br/>";
                    Html += ControlData.ControlJQs.ContentJQ.height() + "," + ControlData.ControlJQs.ContentJQ.height() + "," + ControlData.ControlJQs.ContentJQ.scrollTop() + "," + ControlData.ControlJQs.ContentJQ[0].scrollHeight;
                    //                $("#divShowMove").html(Html);

                    return Entity;
                };

                var setIntervalFunction = null;
                var eStart, eLastMove, eEnd;
                var eSlide = { IsMouseDown: false };
                var mousedownFunction = function (e) {
                    //停止滚动动画
                    clearInterval(setIntervalFunction);

                    //开启Capture监控
                    if (window.captureEvents) {
                        window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                    } else if (ControlData.ControlJQs.ContentJS.setCapture) {
                        ControlData.ControlJQs.ContentJS.setCapture();
                    };

                    //初始化移动参数
                    eSlide = {
                        IsMouseDown: false                                                                 //是否鼠标按下
                        , IsMouseDownMove: false                                                           //是否鼠标按下拖动
                        , ScrollTop: 0                                                                     //当前滚动条距离顶部的高度
                        , ScrollLeft: 0                                                                    //当前滚动条距离左部的宽度
                    };
                    eStart = {
                        ClientX: null
                        , ClientY: null
                        , Time: null
                    };
                    eLastMove = {
                        ClientX: null
                        , ClientY: null
                        , Time: null
                    };
                    eEnd = {
                        ClientX: null
                        , ClientY: null
                        , Time: null
                    };

                    eSlide.IsMouseDown = true;
                    ControlData.IsMouseDown = eSlide.IsMouseDown;
                    ControlData.IsScroll = true;
                    eSlide.ScrollTop = ControlData.ControlJQs.ContentJQ.scrollTop();
                    eSlide.ScrollLeft = ControlData.ControlJQs.ContentJQ.scrollLeft();
                    if (ControlData.IsTouch) {
                        eStart.ClientX = event.changedTouches[0].clientX;
                        eStart.ClientY = event.changedTouches[0].clientY;
                    } else {
                        eStart.ClientX = e.clientX;
                        eStart.ClientY = e.clientY;
                    };
                    eStart.Time = new Date();

                    //停止事件传播（防止冒泡）
                    e.cancelBubble = false;
                    e.stopPropagation();
                };
                if (ControlData.IsTouchModel) {
                    if (ControlData.IsTouch) {
                        ControlData.ControlJQs.ContentJQ.bind("touchstart", mousedownFunction);
                    } else {
                        ControlData.ControlJQs.ContentJQ.bind("mousedown", mousedownFunction);
                    };
                };

                var mousemoveFunction = function (e) {
                    if (eSlide.IsMouseDown) {
                        if (!eSlide.IsMouseDownMove) {
                            eLastMove.ClientX = eStart.ClientX;
                            eLastMove.ClientY = eStart.ClientY;
                            eLastMove.Time = eStart.Time;
                        };
                        eLastMove.ClientX = eEnd.ClientX;
                        eLastMove.ClientY = eEnd.ClientY;
                        eLastMove.Time = eEnd.Time;
                        if (ControlData.IsTouch) {
                            eEnd.ClientX = event.changedTouches[0].clientX;
                            eEnd.ClientY = event.changedTouches[0].clientY;
                        } else {
                            eEnd.ClientX = e.clientX;
                            eEnd.ClientY = e.clientY;
                        };
                        eEnd.Time = new Date();

                        //鼠标按下拖动过
                        if (eSlide.IsMouseDownMove) {
                        } else {
                            if (ControlData.Settings.PreventDefault) {
                                //阻止默认动作 (这样就不会带动上级滚动条滚动)
                                e.preventDefault();
                            };
                        };

                        if (!ControlData.IsTouch) {
                            if (ControlData.Settings.YScrollBar) {
                                var MoveY = eEnd.ClientY - eStart.ClientY;
                                ControlData.ControlJQs.ContentJQ.scrollTop(eSlide.ScrollTop - MoveY);
                            };
                            if (ControlData.Settings.XScrollBar) {
                                var MoveX = eEnd.ClientX - eStart.ClientX;
                                ControlData.ControlJQs.ContentJQ.scrollLeft(eSlide.ScrollLeft - MoveX);
                            };
                        };

                        eSlide.IsMouseDownMove = true;

                        //停止事件传播（防止冒泡）
                        e.cancelBubble = false;
                        e.stopPropagation();
                    };
                };
                if (ControlData.IsTouchModel) {
                    if (ControlData.IsTouch) {
                        ControlData.ControlJQs.ContentJQ.bind("touchmove", mousemoveFunction);
                    } else {
                        ControlData.ControlJQs.ContentJQ.bind("mousemove", mousemoveFunction);
                    };
                };

                var mouseupFunction = function (e) {
                    if (eSlide.IsMouseDown) {
                        //停止滚动动画
                        clearInterval(setIntervalFunction);

                        //关闭Capture监控
                        if (window.captureEvents) {
                            window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                        } else if (ControlData.ControlJQs.ContentJS.setCapture) {
                            ControlData.ControlJQs.ContentJS.releaseCapture();
                        };

                        eSlide.IsMouseDown = false;
                        ControlData.IsMouseDown = eSlide.IsMouseDown;
                        eEnd.Time = new Date();

                        if (ControlData.Settings.YScrollBar || ControlData.Settings.XScrollBar) {
                            var EventModel = eventModel();                                                 //事件模型
                            var Frames = 0;                                                                //帧数
                            var YFrames = 0;                                                               //Y轴帧数
                            var XFrames = 0;                                                               //X轴帧数
                            var AddY = 0;                                                                  //Y轴增加量
                            var AddX = 0;                                                                  //X轴增加量
                            if (ControlData.Settings.YScrollBar && EventModel.IsLastMoveYAccelerate) {
                                YFrames = parseInt(EventModel.LastMoveYCoefficient * ControlData.Settings.ScrollFramesCoefficient);
                                Frames = YFrames;
                                AddY = parseInt(EventModel.LastMoveYCoefficient * ControlData.Settings.ScrollAddCoefficient) + 1;
                                if (EventModel.LastVerticalMoveDirection == "Top") {
                                    AddY = 0 - AddY;
                                } else if (EventModel.LastVerticalMoveDirection == "Bottom") {
                                    AddY = AddY;
                                };
                            };
                            if (ControlData.Settings.XScrollBar && EventModel.IsLastMoveXAccelerate) {
                                XFrames = parseInt(EventModel.LastMoveXCoefficient * ControlData.Settings.ScrollFramesCoefficient);
                                if (Frames < XFrames) {
                                    Frames = XFrames;
                                };
                                AddX = parseInt(EventModel.LastMoveXCoefficient * ControlData.Settings.ScrollAddCoefficient) + 1;
                                if (EventModel.LastHorizontalMoveDirection == "Left") {
                                    AddX = 0 - AddX;
                                } else if (EventModel.LastHorizontalMoveDirection == "Right") {
                                    AddX = AddX;
                                };
                            };
                            if (EventModel.IsLastMoveYAccelerate || EventModel.IsLastMoveXAccelerate) {
                                var LastScrollTop = ControlData.ControlJQs.ContentJQ.scrollTop();          //最后一次滚动条距离顶部的距离
                                var LastScrollLeft = ControlData.ControlJQs.ContentJQ.scrollLeft();        //最后一次滚动条距离左部的距离
                                var RemainFrames = Frames;                                                 //剩余的帧数
                                var CompleteFrames = 0;                                                    //完成的帧数
                                var NextAddY = AddY;                                                       //下一次Y轴增加量
                                var NextAddX = AddX;                                                       //下一次X轴增加量
                                setIntervalFunction = setInterval(function () {
                                    var NowScrollTop = 0;
                                    var NowScrollLeft = 0;
                                    if (ControlData.Settings.YScrollBar) {
                                        if (CompleteFrames % parseInt(Frames / AddY, 10) == 0) {
                                            if (NextAddY > 0) { NextAddY--; } else if (NextAddY < 0) { NextAddY++ };
                                        };
                                        ControlData.ControlJQs.ContentJQ.scrollTop(ControlData.ControlJQs.ContentJQ.scrollTop() + NextAddY);
                                        NowScrollTop = ControlData.ControlJQs.ContentJQ.scrollTop();
                                    };
                                    if (ControlData.Settings.XScrollBar) {
                                        if (CompleteFrames % parseInt(Frames / AddX, 10) == 0) {
                                            if (NextAddX > 0) { NextAddX--; } else if (NextAddX < 0) { NextAddX++ };
                                        };
                                        ControlData.ControlJQs.ContentJQ.scrollLeft(ControlData.ControlJQs.ContentJQ.scrollLeft() + NextAddX);
                                        NowScrollLeft = ControlData.ControlJQs.ContentJQ.scrollLeft();
                                    };
                                    if (RemainFrames > 0 && (NextAddY != 0 || NextAddX != 0)) {
                                        LastScrollTop = NowScrollTop;
                                        LastScrollLeft = NowScrollLeft;
                                        RemainFrames--;
                                        CompleteFrames++;
                                    } else {
                                        //停止滚动动画
                                        clearInterval(setIntervalFunction);
                                    };
                                }, 10);
                            };
                        };

                        //鼠标按下拖动过
                        if (eSlide.IsMouseDownMove) {
                            ControlData.IsScroll = true;
                            //拖动过程中防止触发操作，比如内部有链接<a href="http://www.baidu.com">百度</a>，就是防止拖动中打开页面
                            ControlData.ControlJQs.ContentJQ.unbind("click").bind('click', function () {
                                //阻止默认动作
                                e.preventDefault();
                                //停止事件传播（防止冒泡）
                                e.cancelBubble = false;
                                e.stopPropagation();
                            });
                        } else {
                            ControlData.IsScroll = false;
                            ControlData.ControlJQs.ContentJQ.unbind("click");
                        };

                    } else {
                        ControlData.ControlJQs.ContentJQ.unbind("click");
                    };
                };
                if (ControlData.IsTouchModel) {
                    if (ControlData.IsTouch) {
                        ControlData.ControlJQs.ContentJQ.bind("touchend", mouseupFunction);
                    } else {
                        ControlData.ControlJQs.ContentJQ.bind("mouseup", mouseupFunction);
                    };
                };

                if ($.isFunction(ControlData.Settings.ScrollFunction)) {
                    ControlData.ControlJQs.ContentJQ.bind("scroll", function () {
                        ControlData.Settings.ScrollFunction(ControlData);
                    });
                };

                if (ControlData.IsTouch || ControlData.IsTouchModel) {
                    ControlData.ControlJQs.ContentJQ.bind("scroll", function () {
                        if (ControlData.Settings.YScrollBar) {
                            //计算滚动条距离顶部高度 计算公式：(滚动条距离顶部高度/(滚动条高度-控件高度))*(滚动条容器高度-滚动条形状的高度)
                            var Top = (ControlData.ControlJQs.ContentJQ.scrollTop() / (ControlData.ControlJQs.ContentJS.scrollHeight - ControlData.ControlJQs.SelectorJQ.height())) * (ControlData.ControlJQs.YScrollJQ.height() - ControlData.ControlJQs.YScrollBarJQ.height());
                            Top -= ControlData.YScrollBarDefaultTop; if (Top < ControlData.YScrollBarDefaultTop) { Top = ControlData.YScrollBarDefaultTop; }
                            ControlData.ControlJQs.YScrollBarJQ.css("top", Top + "px");
                        };
                        if (ControlData.Settings.XScrollBar) {
                            //计算滚动条距离顶部高度 计算公式：(滚动条距离顶部高度/(滚动条高度-控件高度))*(滚动条容器高度-滚动条形状的高度)
                            var Left = (ControlData.ControlJQs.ContentJQ.scrollLeft() / (ControlData.ControlJQs.ContentJS.scrollWidth - ControlData.ControlJQs.SelectorJQ.width())) * (ControlData.ControlJQs.XScrollJQ.width() - ControlData.ControlJQs.XScrollBarJQ.width());
                            Left -= ControlData.XScrollBarDefaultLeft; if (Left < ControlData.XScrollBarDefaultLeft) { Left = ControlData.XScrollBarDefaultLeft; }
                            ControlData.ControlJQs.XScrollBarJQ.css("left", Left + "px");
                        };
                    });
                };

            };
        });
        return this;
    }
    , TouchScroll_Loading: function () {
        this.each(function () {
            var ControlData = $(this).data("ControlData");
            if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                ControlData.ControlJQs.LoadingJQ.show();
            };
        });
        return this;
    }
    , TouchScroll: function (Properties) {
        if (!fw.fwObject.FWObjectHelper.hasValue(Properties)) { Properties = {}; };
        var Settings = $.TouchScroll.Settings();
        $.extend(Settings, Properties);

        this.each(function () {
            var TouchScrollJQ = $(this);
            //初始化控件
            TouchScrollJQ.TouchScroll_Init(Settings);

            var ControlData = TouchScrollJQ.data("ControlData");
            if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                ControlData.Settings.DataSourceFunction = Settings.DataSourceFunction;
                if ($.isFunction(ControlData.Settings.DataSourceFunction)) {
                    setTimeout(function () {
                        ControlData.Settings.DataSourceFunction(ControlData);

                        //                            alert("建议使用IE7以上的浏览器浏览");

                        $.TouchScroll.DataBind({ Selector: ControlData.ControlJQs.SelectorJQ });
                        ControlData.ControlJQs.LoadingJQ.hide();
                    }, ControlData.Settings.DataSourceDelay);
                };
            };
        });

        return this;
    }
});