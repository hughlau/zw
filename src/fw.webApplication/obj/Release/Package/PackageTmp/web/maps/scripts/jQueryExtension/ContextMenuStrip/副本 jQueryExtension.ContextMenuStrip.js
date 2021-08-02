$.ContextMenuStrip = {
    Hide: function (properties) {
        if (typeof (properties) == "undefined") {
            properties = {};
        };
        var Settings = {
            Selector: null
        };
        $.extend(Settings, properties);

        var ContextMenuStripSelectorJQ = $(Settings.Selector);
        ContextMenuStripSelectorJQ.hide();
        document.oncontextmenu = function () { return true; };
    }
        , AddItems: function (properties) {
            if (typeof (properties) == "undefined") {
                properties = {};
            };
            var Settings = {
                Selector: null
                , Item: null
                , Items: []
                , ContextMenuStripSelector: null
                , ContextMenuStripLevel: 0
            };
            $.extend(Settings, properties);

            if ($.isFunction(Settings.Item)) {
                Settings.Item = Settings.Item();
            };
            if ($.isFunction(Settings.Items)) {
                Settings.Items = Settings.Items();
            };
            if (Settings.Item != null) {
                Settings.Items.push(Settings.Item);
            };

            var ContextMenuStripSelectorJQ = $(Settings.ContextMenuStripSelector);
            $(Settings.Selector).each(function () {
                var ulJQ = $(this);
                for (var i = 0; i < Settings.Items.length; i++) {
                    var Item = Settings.Items[i];
                    var ContextMenuStripLevel = Settings.ContextMenuStripLevel + 1;
                    var liJQ = $("<li></li>").data("ContextMenuStripLevel", ContextMenuStripLevel).appendTo(ulJQ).bind("mouseover", function () {
                        var liJQ = $(this);
                        var ContextMenuStripLevel = liJQ.data("ContextMenuStripLevel");
                        var ulChildJQ = $(">ul", liJQ);
                        var liWidth = liJQ.width();
                        var liHeight = liJQ.height();
                        ulChildJQ.css({
                            "left": liWidth + "px"
                            , "top": (-1 - liHeight) + "px"
                        });
                        $("ul.ContextMenuStripLevel" + ContextMenuStripLevel, ContextMenuStripSelectorJQ).not(ulChildJQ).hide();
                        ulChildJQ.show();
                    });
                    Item.SelectorJQ = ContextMenuStripSelectorJQ.data("SelectorJQ");
                    Item.TargetJQ = ContextMenuStripSelectorJQ.data("TargetJQ");
                    liJQ.data("Item", Item).bind("click", function () {
                        var Item = $(this).data("Item");
                        if ($.isFunction(Item.Click)) {
                            Item.Click(Item);
                            $.ContextMenuStrip.Hide({ Selector: ContextMenuStripSelectorJQ });
                            return false;
                        };
                    });

                    var Html = "";
                    Html += "<div>";
                    Html += "   <div class=\"ContextMenuStripSelected_Center\"></div>";
                    Html += "   <div class=\"ContextMenuStripSelected_Right\"></div>";
                    Html += "   <div class=\"ContextMenuStripSelected_Left\"></div>";
                    if (Item.Items != null && Item.Items.length > 0) {
                        Html += "   <div class=\"ContextMenuStripItems\"></div>";
                    };
                    Html += "   <div class=\"ContextMenuStripItemIcon_Default\"></div>";
                    Html += "   <div class=\"ContextMenuStripItemText\"><a>" + Item.Text + "</a></div>";
                    Html += "</div>";
                    var divJQ = $(Html).appendTo(liJQ);
                    if (Item.Items != null && Item.Items.length > 0) {
                        var ulChildJQ = $("<ul class=\"ContextMenuStripLevel" + ContextMenuStripLevel + "\"></ul>").appendTo(liJQ);
                        $.ContextMenuStrip.AddItems({
                            Selector: ulChildJQ
                            , Items: Item.Items
                            , ContextMenuStripSelector: ContextMenuStripSelectorJQ
                            , ContextMenuStripLevel: ContextMenuStripLevel
                        });
                    };
                };
            });
        }
};


$.fn.extend({
    ContextMenuStrip: function (properties) {
        if (typeof (properties) == "undefined") {
            properties = {};
        };
        var Settings = {
            Items: [
                    {
                        Name: "Name1"
                        , Text: "Text1111111111111111111111111111111111111111111"
                        , Click: function () { }
                        , Items: [
                            {
                                Name: "Name1.1"
                                , Text: "Text1.1"
                                , Click: function () { }
                            }
                            , {
                                Name: "Name1.2"
                                , Text: "Text1.2"
                                , Click: function () { }
                            }
                            , {
                                Name: "Name1.3"
                                , Text: "Text1.3"
                                , Click: function () { }
                            }
                            , {
                                Name: "Name1.4"
                                , Text: "Text1.4"
                                , Click: function () { }
                            }
                        ]
                    }
                    , {
                        Name: "Name2"
                        , Text: "Text2"
                        , Click: function () { }
                    }
                ]
        };
        $.extend(Settings, properties);

        var UI_ContextMenuStripJQ = $("#jQueryExtension_UI_ContextMenuStrip");
        if (UI_ContextMenuStripJQ.length < 1) {
            UI_ContextMenuStripJQ = $("<div id=\"jQueryExtension_UI_ContextMenuStrip\" class=\"jQueryExtension_UI_ContextMenuStrip\"></div>").appendTo("body");
            $(document).bind("click", function () { UI_ContextMenuStripJQ.hide(); document.oncontextmenu = function () { return true; }; });
        };

        var mousedownFunction = function (e) {
            if (e.button == 2) {
                document.oncontextmenu = function () { return false; };
                var SelectorJQ = $(this);
                var TargetJQ = $(e.target);
                var Items;
                if ($.isFunction(Settings.Items)) {
                    Items = Settings.Items({ SelectorJQ: SelectorJQ, TargetJQ: TargetJQ });
                } else {
                    Items = Settings.Items;
                };
                UI_ContextMenuStripJQ.data("SelectorJQ", SelectorJQ).data("TargetJQ", TargetJQ).show().empty().css({
                    left: e.clientX + "px"
                    , top: e.clientY + "px"
                });
                var ulJQ = $("<ul></ul>").appendTo(UI_ContextMenuStripJQ).show();
                if (Items != null && Items.length > 0) {
                    $.ContextMenuStrip.AddItems({
                        Selector: ulJQ
                            , Items: Items
                            , ContextMenuStripSelector: UI_ContextMenuStripJQ
                            , ContextMenuStripLevel: 0
                    });
                };
            };
            e.stopPropagation();
        };

        this.unbind("mousedown", mousedownFunction).bind("mousedown", mousedownFunction);

        return this;
    }
});