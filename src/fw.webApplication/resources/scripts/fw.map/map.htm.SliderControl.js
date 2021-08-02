//左下角滑动控件
function SlideControlBind(properties) {
    if (typeof (properties) == "undefined") {
        properties = {};
    };
    var Settings = {
        Selector: null
        , OnChange: null
        , API: null
        , BusinessEvent: null//指定业务模块
    };
    $.extend(Settings, properties);

    $(Settings.Selector).each(function () {
        var SliderControlJQ = $(this);
        var ControlData = SliderControlJQ.data("ControlData");

        //判断Scroll有没缓存数据，有表示已经加载控件，无表示控件第一次加载
        if (!fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
            ControlData = {
                IsTouch: jQueryExtension.IsTouch()
                , IsTouchModel: (fw.fwObject.FWObjectHelper.hasValue(fw.fwCookie.FWCookieHelper("IsTouchModel")) && (fw.fwCookie.FWCookieHelper("IsTouchModel").toLowerCase() == "true" || fw.fwCookie.FWCookieHelper("IsTouchModel").toLowerCase() == "1"))
                , ControlJQs: {}
            };
            if (ControlData.IsTouch) {
                ControlData.IsTouchModel = true;
            };
            SliderControlJQ.addClass("divCantonStatistics").data("ControlData", ControlData).empty();

            var Html = "";
            Html += "<table id=\"SilderControlTable\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
            //修改内容右下角的内容 王洋20171010
            Html += "    <tr  class='firstTr'>";
            Html += "        <td class='firstLeft' style='width:24px;background-color:#eceff4;border-right:1px solid #cad6e2'>";
            Html += "            <div  class='tdCantonStatisticsHide' >";
            Html += "            </div>";
            Html += "        </td>";
            Html += "        <td class='secondLeft'>";
            Html += "            <div class=\"divCantonStatisticsContainer\">";
            Html += "                <div class=\"divCantonStatisticsTitle\">";
            Html += "                    <table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"width: 100%;line-height:40px; height:40px;\">";
            Html += "                        <tr>";
            Html += "                            <td class=\"tdCantonStatisticsHide\"></td>";
            Html += "                            <td style=\"display: none;\">";
            Html += "                                <div class=\"divConcernCantonList\">";
            Html += "                                    <ul class=\"ulConcernCantonList\"></ul>";
            Html += "                                </div>";
            Html += "                            </td>";
            Html += "                            <td>";
            Html += "                                <div class=\"divConditionExtension\"></div>";
            Html += "                            </td>";
            Html += "                        </tr>";
            Html += "                    </table>";
            Html += "                </div>";
            Html += "                <div class=\"divCantonStatisticsList\"></div>";
            Html += "            </div>";
            Html += "        </td>";
            Html += "        <td class=\"tdCantonStatisticsToggle ToLeft\">";
            Html += "            <div class=\"divCantonStatisticsToggle\"></div>";
            Html += "        </td>";
            Html += "    </tr>";
            Html += "</table>";
            $(Html).appendTo(SliderControlJQ);

            //ControlData.IsTouch = true;
            ControlData.ControlJQs.SliderControlJQ = SliderControlJQ;
            ControlData.ControlJQs.SelectorJQ = SliderControlJQ;
            ControlData.ControlJQs.SliderControlContainerJQ = $("#SilderControlTable div.divCantonStatisticsContainer", ControlData.ControlJQs.SelectorJQ);
            ControlData.ControlJQs.SliderControlTitleJQ = $(">div.divCantonStatisticsTitle", ControlData.ControlJQs.SliderControlContainerJQ);
            ////add by wangyang 2017-09-21 选择器
            ControlData.ControlJQs.SliderControlFirstLeft = $(".firstLeft", ControlData.ControlJQs.SelectorJQ);
            ControlData.ControlJQs.SliderControFirstTr = $(".firstTr", ControlData.ControlJQs.SelectorJQ);
            ControlData.ControlJQs.SliderControlHideJQ = $(".firstLeft>div.tdCantonStatisticsHide", ControlData.ControlJQs.SelectorJQ);           
            //ControlData.ControlJQs.CantonCodeJQ = $("select.selectCantonCode", ControlData.ControlJQs.CantonStatisticsTitleJQ);
            ControlData.ControlJQs.ConcernCantonListJQ = $("ul.ulConcernCantonList", ControlData.ControlJQs.SliderControlContainerJQ);
            ControlData.ControlJQs.ConditionExtensionJQ = $("div.divConditionExtension", ControlData.ControlJQs.SliderControlContainerJQ);
            ControlData.ControlJQs.SliderControlListJQ = $(">div.divCantonStatisticsList", ControlData.ControlJQs.SliderControlContainerJQ);
            ControlData.ControlJQs.SliderControlToggleJQ = $("td.tdCantonStatisticsToggle", ControlData.ControlJQs.SelectorJQ);
            ////add by wangyang 2017-09-21 
            ControlData.ControlJQs.SliderControFirstTr.children().css('vertical-align','top');
            var CriticalWidth = 0;           
            //=====控件显示/隐藏操作 开始=====
            Settings.API.SliderControlContentHide = function () {
                ControlData.ControlJQs.SliderControlContainerJQ.hide();
            };
                var firstTdWidth=ControlData.ControlJQs.SliderControlFirstLeft.width()
                //add by wangyang 2017-09-21 
                var SliderControlHeight="160px";
                ControlData.ControlJQs.SliderControlFirstLeft.css('vertical-align','top')
                Settings.API.SliderControlSlideDown = function () {
                var CurrentWidth = ControlData.ControlJQs.SliderControlContainerJQ.width();
                
                var MaxWidth = ControlData.ControlJQs.SliderControlContainerJQ.css("width", "auto").width();
                //alert("Down" + CurrentWidth);
                if (CurrentWidth < MaxWidth) {
                    //ControlData.ControlJQs.CantonCodeJQ.show();

                    //                    ControlData.ControlJQs.SliderControlContainerJQ.width(CriticalWidth).show().animate({ width: MaxWidth + "px" }, 300, function () {
                    //                        ControlData.ControlJQs.SliderControlContainerJQ.css("width", "auto");
                    //                        ControlData.ControlJQs.SliderControlToggleJQ.addClass("ToLeft"); 
                    //                        ControlData.Settings.ConcernCantonResizeFunction(); });
                    ControlData.ControlJQs.SliderControlContainerJQ.width(CriticalWidth).show();
                    ControlData.ControlJQs.SliderControlContainerJQ.width(CriticalWidth).show();
                    //add by wangyang 2017-09-21 展开左下角列表         
                    ControlData.ControlJQs.SliderControlContainerJQ.css("width", "auto");
                    ControlData.ControlJQs.SliderControlToggleJQ.addClass("ToLeft");
                    ControlData.ControlJQs.SliderControlJQ.css({"height":160+'px','top':'','bottom':0,'left':'-1px'});
                    ControlData.ControlJQs.SliderControlFirstLeft.show().animate({ 'width': firstTdWidth + "px"},300).height('160px');
                    ControlData.ControlJQs.SliderControlHideJQ.show();
                    ControlData.ControlJQs.ConditionExtensionJQ.show();
                    ControlData.ControlJQs.SliderControlListJQ.show();

                };
            };
            Settings.API.SliderControlSlideUp = function () {
                var CurrentWidth = ControlData.ControlJQs.SliderControlContainerJQ.width();
                //alert("Up" + CurrentWidth);
                if (CurrentWidth > CriticalWidth) {


                    // ControlData.ControlJQs.CantonCodeJQ.hide();animate({height:0},300).hide()
          
                    ControlData.ControlJQs.SliderControlContainerJQ.show().animate({ width: CriticalWidth + "px" }, 300, function () { ControlData.ControlJQs.SliderControlToggleJQ.removeClass("ToLeft"); });
                    ControlData.ControlJQs.SliderControlFirstLeft.outerWidth(CriticalWidth).show().height('40px');
                    ControlData.ControlJQs.SliderControlHideJQ.hide();
                    ControlData.ControlJQs.SliderControlListJQ.hide();
                    ControlData.ControlJQs.ConditionExtensionJQ.hide();

                    //add by wangyang 2017-09-21 
                    ControlData.ControlJQs.SliderControlJQ.css({"height":'40px','top':'','bottom':'120px','left':'-1px'});
                    ControlData.ControlJQs.SliderControlToggleJQ.removeClass("ToLeft");
                    //ControlData.Settings.ConcernCantonResizeFunction();
                };
            };

            Settings.API.SliderControlSlideToggle = function () {
                var CurrentWidth = ControlData.ControlJQs.SliderControlContainerJQ.width();
                if (CurrentWidth == CriticalWidth) {
                    Settings.API.SliderControlSlideDown();
                } else {
                    Settings.API.SliderControlSlideUp();
                };                 
            };
            Settings.API.SliderControlShow = function () {
                ControlData.ControlJQs.SliderControlJQ.show();
            };
            Settings.API.SliderControlHide = function () {
                ControlData.ControlJQs.SliderControlJQ.hide();
            };
            Settings.API.SliderControlToggle = function () {
                if (divSliderControlListJQ.is(":hidden")) {
                    Settings.API.SliderControlShow();
                } else {
                    Settings.API.SliderControlHide();
                };
            };
            //=====控件显示/隐藏操作 结束=====


            Settings.API.SliderControlUnbind = function () {
                var ControlData = API._divSliderControlJQ.data("ControlData");

                if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                    ControlData.ControlJQs.SliderControlListJQ.empty();
                    //ControlData.ControlJQs.CantonCodeJQ.val(ControlData.ControlJQs.CantonCodeJQ[0][0].value);
                    ControlData.Settings.OnChange = null;
                    ControlData.ControlJQs.ConditionExtensionJQ.empty();

                    //API.SliderControlSlideUp();
                    API.SliderControlHide();
                };
            };
            Settings.API.SliderControlConditionExtensionJQ = ControlData.ControlJQs.ConditionExtensionJQ;

            Settings.API.SliderControlListBind = function (Properties) {
                var Settings = {
                    ConditionExtensionInit: function () { }
                    , OnChange: function (e) { }
                };
                $.extend(Settings, Properties);

                var ControlData = API._divSliderControlJQ.data("ControlData");
                if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                    API.SliderControlUnbind();

                    ControlData.Settings.ConditionExtensionInit = Settings.ConditionExtensionInit;
                    ControlData.Settings.ConditionExtensionInit();

                    ControlData.Settings.OnChange = Settings.OnChange;
                    // ControlData.ControlJQs.CantonCodeJQ.change();

                    API.SliderControlShow();
                };
            };


            Settings.API.SliderControlChange = function (Properties) {
                var Settings = {
                    CantonCode: null
                };
                $.extend(Settings, Properties);

                var ControlData = API._divSliderControlJQ.data("ControlData");
                if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                    //                    if (Settings.CantonCode == null) {
                    //                        Settings.CantonCode = ControlData.ControlJQs.CantonCodeJQ.val();
                    //                    };
                    //                    ControlData.ControlJQs.CantonCodeJQ.val(Settings.CantonCode)
                    //                    ControlData.ControlJQs.CantonCodeJQ.change();

                    API.SliderControlShow();
                };
            };

            //按钮模块内容绑定
            Settings.API.SliderControlAdd = function (Properties) {
                var Settings = {
                    TextFieldName: "Text"
                    , IconUrlFieldName: "IconUrl"
                    , ColorFieldName: "Color"
                    , DataSource: []
                    , TemplateFunction: function (Entity, Index) { return Entity[this.TextFieldName]; }
                    , RowOnClick: function (Entity) { }
                };
                $.extend(Settings, Properties);

                var ControlData = API._divSliderControlJQ.data("ControlData");
                if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {

                    if ($.isFunction(Settings.BusinessEvent)) {
                        Settings.titleJQ = ControlData.ControlJQs.ConditionExtensionJQ;
                        Settings.contentJQ = ControlData.ControlJQs.SliderControlListJQ;
                        Settings.BusinessEvent(Settings);
                    };
                    ControlData.Settings.ConcernCantonResizeFunction();
                };
            };
            //点击收缩按钮后的状态变化
            ControlData.ControlJQs.SliderControlHideJQ.bind("click", function () {
                ControlData.ControlJQs.SliderControlToggleJQ.click();
            });
            ControlData.ControlJQs.SliderControlToggleJQ.bind("click", function () { 
                Settings.API.SliderControlSlideToggle(); 
            });

        };
        ControlData.Settings = Settings;

        ControlData.Settings.ConcernCantonResizeFunction = function () {
            //ControlData.ControlJQs.ConcernCantonListJQ.width(0);
            //ControlData.ControlJQs.ConcernCantonListJQ.width(ControlData.ControlJQs.SliderControlTitleJQ.width() - ControlData.ControlJQs.CantonCodeJQ.width() - 16);
            //ControlData.ControlJQs.ConcernCantonListJQ.width(ControlData.ControlJQs.SliderControlTitleJQ.width() - 16);
        };

        if (ControlData.Settings.DataSource == undefined || ControlData.Settings.DataSource == null) {
            ControlData.Settings.DataSource = [];
        };
        ControlData.ControlJQs.ConcernCantonListJQ.empty();
        ControlData.Settings.API.SliderControlSlideUp();
        ControlData.Settings.API.SliderControlHide();
    });
    return this;
};


