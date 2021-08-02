function SearchAndConcernInit(Properties) {
    if (typeof (Properties) == "undefined") {
        Properties = {};
    };
    var Settings = {
        Selector: null
        , Top: 80
        , Right: 210
        , Width: 180
        , API: null
    };
    $.extend(Settings, Properties);

    $(Settings.Selector).each(function () {
        var SearchAndConcernJQ = $(this);
        var ControlData = SearchAndConcernJQ.data("ControlData");

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
            SearchAndConcernJQ.addClass("divSearchAndConcern").data("ControlData", ControlData).empty();
            if (SearchAndConcernJQ.css("position").toLowerCase() != "absolute") {
                SearchAndConcernJQ.css("position", "relative");
            };

            var Html = "";
            Html += "<div class=\"divSearchAndConcernTitle\">";
            Html += "    <div class=\"divSearchAndConcernContainer\">";
            Html += "        <div class=\"divSearchButton\">搜索</div>";
            Html += "        <div class=\"divConcernButton\">关注</div>";
            Html += "    </div>";
            //Html += "    <div class=\"divSearchAndConcernImage\"><img alt=\"\" src=\"\" onerror=\"this.src='" + Settings.API.webSiteRootUrl + "web/Styles/Home/Images/imgSearchAndConcernDefaultImage.png'\" /></div>";
            Html += "</div>";
            Html += "<div class=\"divKeyword\"><input class=\"inputKeyword\" type=\"text\" /></div>";
            Html += "<div class=\"divSearchAndConcernContent\" style=\"height:300px;\"></div>";
            $(Html).appendTo(SearchAndConcernJQ);

            //ControlData.IsTouch = true;
            ControlData.ControlJQs.SearchAndConcernJQ = SearchAndConcernJQ;
            ControlData.ControlJQs.SelectorJQ = SearchAndConcernJQ;
            ControlData.ControlJQs.SearchAndConcernTitleJQ = $(">div.divSearchAndConcernTitle", ControlData.ControlJQs.SelectorJQ);
            ControlData.ControlJQs.SearchAndConcernContainerJQ = $(">div.divSearchAndConcernContainer", ControlData.ControlJQs.SearchAndConcernTitleJQ);
            ControlData.ControlJQs.SearchButtonJQ = $(">div.divSearchButton", ControlData.ControlJQs.SearchAndConcernContainerJQ);
            ControlData.ControlJQs.ConcernButtonJQ = $(">div.divConcernButton", ControlData.ControlJQs.SearchAndConcernContainerJQ);
            ControlData.ControlJQs.SearchAndConcernImageContainerJQ = $(">div.divSearchAndConcernImage", ControlData.ControlJQs.SearchAndConcernTitleJQ).hide();
            ControlData.ControlJQs.SearchAndConcernImageJQ = $(">img", ControlData.ControlJQs.SearchAndConcernImageContainerJQ);
            ControlData.ControlJQs.KeywordContainerJQ = $(">div.divKeyword", ControlData.ControlJQs.SelectorJQ).hide();
            ControlData.ControlJQs.KeywordJQ = $(">input.inputKeyword", ControlData.ControlJQs.KeywordContainerJQ)
            ControlData.ControlJQs.SearchAndConcernContentJQ = $(">div.divSearchAndConcernContent", ControlData.ControlJQs.SelectorJQ);

            var MarginTop = ControlData.ControlJQs.SearchAndConcernImageContainerJQ.height() / 2;
            var Height = ControlData.ControlJQs.SearchAndConcernContainerJQ.height() + MarginTop;
            jQueryExtension.UI.Layout({
                Selector: ControlData.ControlJQs.SearchAndConcernJQ
                , HorizontalAlignment: jQueryExtension.Data.HorizontalAlignment.Right
                , VerticalAlignment: jQueryExtension.Data.VerticalAlignment.Top
                , Top: Settings.Top - MarginTop
                , Right: Settings.Right
                , Bottom: 0
                , Left: 0
                , Width: Settings.Width
                , MinWidth: -1
                , Height: Height
                , MinHeight: -1
                , IsEventResize: true
                , CallBack: function () { }
                , IsForeverLayout: true
            });
            ControlData.ControlJQs.SearchAndConcernTitleJQ.height(Height);
            ControlData.ControlJQs.SearchAndConcernContainerJQ.css("margin-top", MarginTop + "px");
            ControlData.ControlJQs.SearchAndConcernImageContainerJQ.css({ "margin-top": (0 - Height) + "px", "margin-right": (MarginTop / 2) + "px" });

            ControlData.ControlJQs.SearchAndConcernContentJQ.TouchScroll_Init();
            var SearchAndConcernContentTouchScrollControlData = ControlData.ControlJQs.SearchAndConcernContentJQ.data("ControlData");
            ControlData.ControlJQs.SearchAndConcernContentContentJQ = SearchAndConcernContentTouchScrollControlData.ControlJQs.ContentJQ;

            Settings.API.SearchAndConcernContentHide = function () {
                ControlData.ControlJQs.SearchAndConcernContentJQ.hide();
                ControlData.ControlJQs.KeywordContainerJQ.hide();
            };
            Settings.API.SearchAndConcernSlideDown = function () {
                ControlData.ControlJQs.SearchAndConcernContentJQ.slideDown();
            };
            Settings.API.SearchAndConcernSlideUp = function () {
                ControlData.ControlJQs.KeywordContainerJQ.slideUp();
                ControlData.ControlJQs.SearchAndConcernContentJQ.slideUp();
            };
            Settings.API.SearchAndConcernSlideToggle = function () {
                if (ControlData.ControlJQs.SearchAndConcernContentJQ.is(":hidden")) {
                    Settings.API.SearchAndConcernSlideDown();
                } else {
                    Settings.API.SearchAndConcernSlideUp();
                };
            };
            //ControlData.ControlJQs.SearchButtonJQ.bind("click", function () {
            //    Settings.API.SearchAndConcernSlideToggle();
            //});
            //ControlData.ControlJQs.ConcernButtonJQ.bind("click", function () {
            //    Settings.API.SearchAndConcernSlideToggle();
            //});
            ControlData.ControlJQs.KeywordJQ.bind("keyup", function (e) {
                var key = e.which;
                if (key == 13) {
                    ControlData.ControlJQs.SearchAndConcernContentJQ.removeData("TypeCode");
                    ControlData.ControlJQs.SearchButtonJQ.click();
                };
            }).bind("focus", function () {
                var thisJQ = $(this);
                var Keyword = $.trim(thisJQ.val());
                var HintValue = thisJQ.attr("HintValue");
                var HintValueColor = thisJQ.attr("HintValueColor");
                var DefaultColor = thisJQ.attr("DefaultColor");
                if (Keyword == HintValue) {
                    thisJQ.val("").css("color", DefaultColor);
                };
            }).bind("blur", function () {
                var thisJQ = $(this);
                var Keyword = $.trim(thisJQ.val());
                var HintValue = thisJQ.attr("HintValue");
                var HintValueColor = thisJQ.attr("HintValueColor");
                var DefaultColor = thisJQ.attr("DefaultColor");
                if (Keyword == "" || Keyword == HintValue) {
                    thisJQ.val(HintValue).css("color", HintValueColor);
                };
            });
            Settings.API.SearchAndConcernShow = function () {
                ControlData.ControlJQs.SearchAndConcernJQ.show();
            };
            Settings.API.SearchAndConcernHide = function () {
                ControlData.ControlJQs.SearchAndConcernJQ.hide();
            };
            Settings.API.SearchAndConcernToggle = function () {
                if (divSearchAndConcernListJQ.is(":hidden")) {
                    Settings.API.SearchAndConcernShow();
                } else {
                    Settings.API.SearchAndConcernHide();
                };
            };
            /// <summary>
            ///     搜索和关注取消绑定（关闭）
            /// </summary>
            Settings.API.SearchAndConcernUnbind = function () {
                var ControlData = API._divSearchAndConcernJQ.data("ControlData");
                if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                    ControlData.ControlJQs.ConcernButtonJQ.unbind("click");
                    ControlData.ControlJQs.SearchButtonJQ.unbind("click");
                    ControlData.ControlJQs.SearchAndConcernContentJQ.removeData("TypeCode");
                    API.SearchAndConcernContentHide();
                    API.SearchAndConcernHide();
                };
            };

            Settings.API.SearchAndConcern__ConcernHide = function () {
                ControlData.ControlJQs.ConcernButtonJQ.hide();
            };
            /// <summary>
            ///     搜索和关注取消绑定（打开）
            /// </summary>
            Settings.API.SearchAndConcernBind = function (Properties) {
                var Settings = {
                    ConcernButtonOnClick: function (e) { }
            , SearchButtonOnClick: function (e) { }
            , HintValue: null
                };
                $.extend(Settings, Properties);

                var ControlData = API._divSearchAndConcernJQ.data("ControlData");
                if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                    API.SearchAndConcernUnbind();

                    var HintValueColor = "Gray";
                    var DefaultColor = "White";
                    if (skin == "blue") {
                        DefaultColor = "Black";
                    }
                    ControlData.ControlJQs.KeywordJQ.val(Settings.HintValue).attr("HintValue", Settings.HintValue).attr("DefaultColor", DefaultColor).attr("HintValueColor", HintValueColor).css("color", HintValueColor);

                    ControlData.ControlJQs.ConcernButtonJQ.unbind("click").bind("click", function (e) {
                        if (ControlData.ControlJQs.SearchAndConcernContentJQ.is(":hidden")) {
                            ControlData.ControlJQs.SearchAndConcernContentJQ.removeData("TypeCode");
                        };
                        ControlData.ControlJQs.KeywordContainerJQ.slideUp();
                        var TypeCode = ControlData.ControlJQs.SearchAndConcernContentJQ.data("TypeCode");
                        if (TypeCode != "Concern") {
                            API.SearchAndConcernSlideDown();
                            ControlData.ControlJQs.SearchAndConcernContentJQ.TouchScroll_Loading();
                            Settings.ConcernButtonOnClick(e);
                            ControlData.ControlJQs.SearchAndConcernContentJQ.data("TypeCode", "Concern");
                        } else {
                            API.SearchAndConcernSlideUp();
                            ControlData.ControlJQs.SearchAndConcernContentJQ.removeData("TypeCode");
                        };
                    });

                    ControlData.ControlJQs.SearchButtonJQ.unbind("click").bind("click", function (e) {
                        if (ControlData.ControlJQs.SearchAndConcernContentJQ.is(":hidden")) {
                            ControlData.ControlJQs.SearchAndConcernContentJQ.removeData("TypeCode");
                        };
                        var TypeCode = ControlData.ControlJQs.SearchAndConcernContentJQ.data("TypeCode");
                        if (TypeCode != "Search") {
                            ControlData.ControlJQs.KeywordContainerJQ.slideDown();
                            API.SearchAndConcernSlideDown();
                            // ControlData.ControlJQs.SearchAndConcernContentJQ.TouchScroll_Loading();
                            var Keyword = $.trim(ControlData.ControlJQs.KeywordJQ.val());
                            Settings.SearchButtonOnClick(e, Keyword);
                            ControlData.ControlJQs.SearchAndConcernContentJQ.data("TypeCode", "Search");
                        } else {
                            API.SearchAndConcernSlideUp();
                            ControlData.ControlJQs.SearchAndConcernContentJQ.removeData("TypeCode");
                        };
                    });

                    API.SearchAndConcernShow();
                };
            };
            /// <summary>
            ///     搜索和关注结果内容绑定
            /// </summary>
            Settings.API.SearchAndConcernContentBind = function (Properties) {
                var Settings = {
                    TextFieldName: "Text"
            , IconUrlFieldName: "IconUrl"
            , DataSource: []
            , TemplateFunction: function (Entity, Index) { return Entity[this.TextFieldName]; }
            , RowOnClick: function (Entity) { }
                };
                $.extend(Settings, Properties);

                var ControlData = API._divSearchAndConcernJQ.data("ControlData");
                if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                    ControlData.ControlJQs.SearchAndConcernContentJQ.TouchScroll({
                        DataSourceFunction: function (SearchAndConcernContentTouchScrollControlData) {
                            SearchAndConcernContentTouchScrollControlData.ControlJQs.ContentJQ.empty();
                            var ulSearchAndConcernContentJQ = $("<ul class=\"ulSearchAndConcernContent\"></ul>").appendTo(SearchAndConcernContentTouchScrollControlData.ControlJQs.ContentJQ);
                            for (var i = 0; i < Settings.DataSource.length; i++) {
                                var Entity = Settings.DataSource[i];
                                var Text = Settings.TemplateFunction(Entity, i);
                                var IconUrl = Entity[Settings.IconUrlFieldName];
                                var liJQ = $("<li title=\"" + Text + "\"><div><img alt=\"" + Text + "\" src=\"" + IconUrl + "\" onerror=\"this.src='" + API.webSiteRootUrl + "resources/scripts/fw.map/themes/" + skin + "/images/imgModuleMenuDefaultImage.png'\" />" + Text + "</div></li>").data("Entity", Entity).appendTo(ulSearchAndConcernContentJQ).bind("click", function () {
                                    var thisJQ = $(this);
                                    Settings.RowOnClick(thisJQ.data("Entity"));
                                });
                            };
                        }
                    });
                };
            };
        };
        ControlData.Settings = Settings;

        ControlData.Settings.API.SearchAndConcernContentHide();
        ControlData.Settings.API.SearchAndConcernHide();
    });
    return this;
};