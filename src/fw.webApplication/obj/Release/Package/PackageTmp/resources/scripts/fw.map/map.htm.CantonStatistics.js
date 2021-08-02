function CantonStatisticsBind(Properties) {
    if (typeof (Properties) == "undefined") {
        Properties = {};
    };
    var Settings = {
        Selector: null
        , OnChange: null
        , API: null
    };
    $.extend(Settings, Properties);

    $(Settings.Selector).each(function () {
        var CantonStatisticsJQ = $(this);
        var ControlData = CantonStatisticsJQ.data("ControlData");

        //判断Scroll有没缓存数据，有表示已经加载控件，无表示控件第一次加载
        if (!fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
            ControlData = {
                IsTouch: jQueryExtension.IsTouch()
                , IsTouchModel: (fw.fwObject.FWObjectHelper.hasValue(fw.fwCookie.FWCookieHelper("IsTouchModel"))&&(fw.fwCookie.FWCookieHelper("IsTouchModel").toLowerCase() == "true" || fw.fwCookie.FWCookieHelper("IsTouchModel").toLowerCase() == "1"))
                , ControlJQs: {}
            };
            if (ControlData.IsTouch) {
                ControlData.IsTouchModel = true;
            };
            CantonStatisticsJQ.addClass("divCantonStatistics").data("ControlData", ControlData).empty();

            var Html = "";
            Html += "<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
            Html += "    <tr>";
            Html += "        <td>";
            Html += "            <div class=\"divCantonStatisticsContainer\">";
            Html += "                <div class=\"divCantonStatisticsTitle\">";
            Html += "                    <table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"width: 100%; height:100%;\">";
            Html += "                        <tr>";
            Html += "                            <td class=\"tdCantonStatisticsHide\"></td>";
            Html += "                            <td style=\"width: 10px;\">";
            Html += "                                <select class=\"selectCantonCode\" databind=\"{SearchCondition:{ControlLabel:'UserCanton',Parameters:[2]},Settings:{FirstItemList:[]}}\" jsondata=\"{Class:'SearchCondition',Property:'CantonCode'}\"></select>";
            Html += "                            </td>";
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
            $(Html).appendTo(CantonStatisticsJQ);

            //ControlData.IsTouch = true;
            ControlData.ControlJQs.CantonStatisticsJQ = CantonStatisticsJQ;
            ControlData.ControlJQs.SelectorJQ = CantonStatisticsJQ;
            ControlData.ControlJQs.CantonStatisticsContainerJQ = $("div.divCantonStatisticsContainer", ControlData.ControlJQs.SelectorJQ);
            ControlData.ControlJQs.CantonStatisticsTitleJQ = $(">div.divCantonStatisticsTitle", ControlData.ControlJQs.CantonStatisticsContainerJQ);
            ControlData.ControlJQs.CantonStatisticsHideJQ = $("td.tdCantonStatisticsHide", ControlData.ControlJQs.CantonStatisticsContainerJQ);
            ControlData.ControlJQs.CantonCodeJQ = $("select.selectCantonCode", ControlData.ControlJQs.CantonStatisticsTitleJQ);
            ControlData.ControlJQs.ConcernCantonListJQ = $("ul.ulConcernCantonList", ControlData.ControlJQs.CantonStatisticsContainerJQ);
            ControlData.ControlJQs.ConditionExtensionJQ = $("div.divConditionExtension", ControlData.ControlJQs.CantonStatisticsContainerJQ);
            ControlData.ControlJQs.CantonStatisticsListJQ = $(">div.divCantonStatisticsList", ControlData.ControlJQs.CantonStatisticsContainerJQ);
            ControlData.ControlJQs.CantonStatisticsToggleJQ = $("td.tdCantonStatisticsToggle", ControlData.ControlJQs.SelectorJQ);

            var CriticalWidth = 1;
            Settings.API.CantonStatisticsContentHide = function () {
                ControlData.ControlJQs.CantonStatisticsContainerJQ.hide();
            };
            Settings.API.CantonStatisticsSlideDown = function () {
                var CurrentWidth = ControlData.ControlJQs.CantonStatisticsContainerJQ.width();
                var MaxWidth = ControlData.ControlJQs.CantonStatisticsContainerJQ.css("width", "auto").width();
                if (CurrentWidth < MaxWidth) {
                    ControlData.ControlJQs.CantonCodeJQ.show();
                    ControlData.ControlJQs.CantonStatisticsHideJQ.show();
                    ControlData.ControlJQs.CantonStatisticsContainerJQ.width(CriticalWidth).show().animate({ width: MaxWidth + "px" }, 300, function () { ControlData.ControlJQs.CantonStatisticsContainerJQ.css("width", "auto"); ControlData.ControlJQs.CantonStatisticsToggleJQ.addClass("ToLeft"); ControlData.Settings.ConcernCantonResizeFunction(); });
                };
            };
            Settings.API.CantonStatisticsSlideUp = function () {
                var CurrentWidth = ControlData.ControlJQs.CantonStatisticsContainerJQ.width();
                if (CurrentWidth > CriticalWidth) {
                    ControlData.ControlJQs.CantonCodeJQ.hide();
                    ControlData.ControlJQs.CantonStatisticsHideJQ.hide();
                    ControlData.ControlJQs.CantonStatisticsContainerJQ.show().animate({ width: CriticalWidth + "px" }, 300, function () { ControlData.ControlJQs.CantonStatisticsToggleJQ.removeClass("ToLeft"); });
                };
            };
            Settings.API.CantonStatisticsSlideToggle = function () {
                var CurrentWidth = ControlData.ControlJQs.CantonStatisticsContainerJQ.width();
                if (CurrentWidth == CriticalWidth) {
                    Settings.API.CantonStatisticsSlideDown();
                } else {
                    Settings.API.CantonStatisticsSlideUp();
                };
            };
            Settings.API.CantonStatisticsShow = function () {
                ControlData.ControlJQs.CantonStatisticsJQ.show();
            };
            Settings.API.CantonStatisticsHide = function () {
                ControlData.ControlJQs.CantonStatisticsJQ.hide();
            };
            Settings.API.CantonStatisticsToggle = function () {
                if (divCantonStatisticsListJQ.is(":hidden")) {
                    Settings.API.CantonStatisticsShow();
                } else {
                    Settings.API.CantonStatisticsHide();
                };
            };
            /// <summary>
            ///     行政区域统计取消绑定（关闭）
            /// </summary>
            Settings.API.CantonStatisticsUnbind = function () {
                var ControlData = API._divCantonStatisticsJQ.data("ControlData");
                if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                    ControlData.ControlJQs.CantonStatisticsListJQ.empty();
                    ControlData.ControlJQs.CantonCodeJQ.val(ControlData.ControlJQs.CantonCodeJQ[0][0].value);
                    ControlData.Settings.OnChange = null;
                    ControlData.ControlJQs.ConditionExtensionJQ.empty();

                    API.CantonStatisticsSlideUp();
                    API.CantonStatisticsHide();
                };
            };
            Settings.API.CantonStatisticsConditionExtensionJQ = ControlData.ControlJQs.ConditionExtensionJQ;
            /// <summary>
            ///     行政区域统计取消绑定（打开）
            /// </summary>
            Settings.API.CantonStatisticsBind = function (Properties) {
                var Settings = {
                    ConditionExtensionInit: function () { }
                    , OnChange: function (e) { }
                };
                $.extend(Settings, Properties);

                var ControlData = API._divCantonStatisticsJQ.data("ControlData");
                if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                    API.CantonStatisticsUnbind();

                    ControlData.Settings.ConditionExtensionInit = Settings.ConditionExtensionInit;
                    ControlData.Settings.ConditionExtensionInit();

                    ControlData.Settings.OnChange = Settings.OnChange;
                    ControlData.ControlJQs.CantonCodeJQ.change();

                    API.CantonStatisticsShow();
                };
            };

            /// <summary>
            ///     行政区改变事件
            /// </summary>
            Settings.API.CantonStatisticsChange = function (Properties) {
                var Settings = {
                    CantonCode: null
                };
                $.extend(Settings, Properties);

                var ControlData = API._divCantonStatisticsJQ.data("ControlData");
                if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                    if (Settings.CantonCode == null) {
                        Settings.CantonCode = ControlData.ControlJQs.CantonCodeJQ.val();
                    };
                    ControlData.ControlJQs.CantonCodeJQ.val(Settings.CantonCode)
                    ControlData.ControlJQs.CantonCodeJQ.change();

                    API.CantonStatisticsShow();
                };
            };

            /// <summary>
            ///     行政区域统计结果内容绑定
            /// </summary>
            Settings.API.CantonStatisticsAdd = function (Properties) {
                var Settings = {
                    TextFieldName: "Text"
                    , IconUrlFieldName: "IconUrl"
                    , ColorFieldName: "Color"
                    , DataSource: []
                    , TemplateFunction: function (Entity, Index) { return Entity[this.TextFieldName]; }
                    , RowOnClick: function (Entity) { }
                };
                $.extend(Settings, Properties);

                var ControlData = API._divCantonStatisticsJQ.data("ControlData");
                if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                    var ulCantonStatisticsListJQ = $("<ul class=\"ulCantonStatisticsList\"></ul>").appendTo(ControlData.ControlJQs.CantonStatisticsListJQ);
                    for (var i = 0; i < Settings.DataSource.length; i++) {
                        var Entity = Settings.DataSource[i];
                        var Text = Settings.TemplateFunction(Entity, i);
                        var IconUrl = Entity[Settings.IconUrlFieldName];
                        var Color = Entity[Settings.ColorFieldName];
                        var liJQ = $("<li></li>").data("Entity", Entity).appendTo(ulCantonStatisticsListJQ).bind("click", function () {
                            var thisJQ = $(this);
                            Settings.RowOnClick(thisJQ.data("Entity"));
                        });
                        var aJQ = $("<a></a>").appendTo(liJQ);
                        var spanJQ = $("<span></span>").appendTo(aJQ);
                        var spanJQ = $("<span></span>").appendTo(spanJQ);
                        if (fw.fwObject.FWObjectHelper.hasValue(IconUrl) || fw.fwObject.FWObjectHelper.hasValue(Color)) {
                            var spanIconJQ = $("<span class=\"Icon\" style=\"background-color: " + Color + "\"></span>").appendTo(spanJQ);
                            if (fw.fwObject.FWObjectHelper.hasValue(IconUrl)) {
                                $("<img alt=\"\" src=\"" + IconUrl + "\" onerror=\"$(this).remove();\" />").appendTo(spanIconJQ);
                            };
                        };
                        $("<span>" + Text + "</span>").appendTo(spanJQ);
                    };
                    ControlData.Settings.ConcernCantonResizeFunction();
                };
            };

            ControlData.ControlJQs.CantonStatisticsHideJQ.bind("click", function () {
                ControlData.ControlJQs.CantonStatisticsToggleJQ.click();
            });
            ControlData.ControlJQs.CantonStatisticsToggleJQ.bind("click", function () { Settings.API.CantonStatisticsSlideToggle(); });
            ControlData.ControlJQs.CantonCodeJQ.bind("change", function (e) {
                ControlData.ControlJQs.CantonStatisticsListJQ.empty();
                var Value = $(this).val();
                var Level = "1";
                var ParentEntity = $(this).data("ControlData").Settings.DataSource[0];
                if (Value == ParentEntity.Code) {
                    Level = ParentEntity.Level;
                } else {
                    for (var i = 0; i < ParentEntity.ChildTreeDataList.length; i++) {
                        if (Value == ParentEntity.ChildTreeDataList[i].Code) {
                            Level = ParentEntity.ChildTreeDataList[i].Level;
                            break;
                        }
                    }
                }

                if ($.isFunction(ControlData.Settings.OnChange)) {
                    ControlData.Settings.OnChange.apply(this, [e]);
                };
            });

        };
        ControlData.Settings = Settings;

        ControlData.Settings.ConcernCantonResizeFunction = function () {
            ControlData.ControlJQs.ConcernCantonListJQ.width(0);
            ControlData.ControlJQs.ConcernCantonListJQ.width(ControlData.ControlJQs.CantonStatisticsTitleJQ.width() - ControlData.ControlJQs.CantonCodeJQ.width() - 16);
        };

        if (ControlData.Settings.DataSource == undefined || ControlData.Settings.DataSource == null) {
            ControlData.Settings.DataSource = [];
        };
        ControlData.ControlJQs.ConcernCantonListJQ.empty();
        //for (var i = 0; i < ControlData.Settings.DataSource.length; i++) {
        //    var Entity = ControlData.Settings.DataSource[i];
        //    $("<li>" + Entity.Name + "</li>").appendTo(ControlData.ControlJQs.ConcernCantonListJQ).data("Entity", Entity).bind("click", function () {
        //        var Entity = $(this).data("Entity");
        //        ControlData.ControlJQs.CantonCodeJQ.val(Entity.Code).change();
        //    });
        //};

        ControlData.Settings.API.CantonStatisticsSlideUp();
        ControlData.Settings.API.CantonStatisticsHide();
    });
    return this;
};