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
    , ItemWidth: function (properties) {
        if (typeof (properties) == "undefined") {
            properties = {};
        };
        var Settings = {
            ulJQ: null
        };
        $.extend(Settings, properties);
        var ItemWidth = 0;
        var Width = 0;
        Settings.ulJQ.find(">li>div>div>div>div.ContextMenuStripItemTextContent").each(function () {
            Width = $(this).width();
            if (Width > ItemWidth) {
                ItemWidth = Width;
            };
        });
        if (ItemWidth < 150) {
            ItemWidth = 150;
        };
        return ItemWidth;
    }
    , ItemHeight: function (properties) {
        if (typeof (properties) == "undefined") {
            properties = {};
        };
        var Settings = {
            ulJQ: null
        };
        $.extend(Settings, properties);
        var ItemHeight = 0;
        Settings.ulJQ.find(">li").each(function () {
            ItemHeight += $(this).height();
        });
        return ItemHeight;
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
                var liJQ = $("<li></li>").data("ContextMenuStripLevel", ContextMenuStripLevel).appendTo(ulJQ).bind("mouseover", function (e) {
                    var liJQ = $(this);
                    var ContextMenuStripLevel = liJQ.data("ContextMenuStripLevel");
                    var ulChildJQ = $(">ul", liJQ);
                    var liPosition = jQueryExtension.Position(liJQ);
                    var liBox = jQueryExtension.Box(liJQ);
                    var ItemWidth = $.ContextMenuStrip.ItemWidth({ ulJQ: ulChildJQ });
                    var ItemHeight = $.ContextMenuStrip.ItemHeight({ ulJQ: ulChildJQ });
                    var ClientWidth = fw.clientWidth();
                    var ClientHeight = fw.clientHeight();
                    var Left, Top;
                    if (ClientWidth - liPosition.AbsoluteLeft - liBox.Width() - 8 > ItemWidth) {
                        Left = liBox.Width() - 5;
                    } else {
                        Left = 5 - liBox.Width();
                    };
                    if (ClientHeight - liPosition.AbsoluteTop - 8 < ItemHeight) {
                        var Index = liJQ.parent().find(">li").index(liJQ);
                        Top = 0 - ItemHeight + (Index + 0) * liBox.Height();
                        ulChildJQ.css("top", Top + "px");
                    };
                    ulChildJQ.css({
                        "left": Left + "px"
                        //, "top": Top + "px"
                    });
                    $("ul.ContextMenuStripLevel" + ContextMenuStripLevel, ContextMenuStripSelectorJQ).not(ulChildJQ).hide();

                    ulChildJQ.width(ItemWidth).show();
                });
                Item.SelectorJQ = ContextMenuStripSelectorJQ.data("SelectorJQ");
                Item.TargetJQ = ContextMenuStripSelectorJQ.data("TargetJQ");
                liJQ.data("Item", Item).bind("click", function (e) {
                    var Item = $(this).data("Item");
                    if ($.isFunction(Item[Settings.ClickField])) {
                        Item[Settings.ClickField](e, Item);
                    };
                });

                var Html = "";
                Html += "<div class=\"jQE_Container_Absolute\">";
                Html += "   <div class=\"ContextMenuStripSelected\">";
                Html += "      <div class=\"ContextMenuStripSelected_Center\"></div>";
                Html += "      <div class=\"ContextMenuStripSelected_Right\"></div>";
                Html += "      <div class=\"ContextMenuStripSelected_Left\"></div>";
                Html += "   </div>";
                Html += "   <div class=\"ContextMenuStripItem\">";
                Html += "      <div class=\"ContextMenuStripItemText\"><div class=\"ContextMenuStripItemTextContent\">" + Item[Settings.TextField] + "</div></div>";
                if (Item[Settings.ItemsField] != null && Item[Settings.ItemsField].length > 0) {
                    Html += "      <div class=\"ContextMenuStripItems\"></div>";
                };
                if (fw.fwObject.FWObjectHelper.hasValue(Settings.CheckboxField)) {
                    if (Item[Settings.CheckboxField]) {
                        Html += "      <div class=\"ContextMenuStripItemIcon_Default Selected\"></div>";
                    } else {
                        Html += "      <div class=\"ContextMenuStripItemIcon_Default NotSelected\"></div>";
                    };
                } else {
                    Html += "      <div class=\"ContextMenuStripItemIcon_Default\"></div>";
                };
                Html += "   </div>";
                Html += "</div>";
                var divJQ = $(Html).appendTo(liJQ);
                if (Item[Settings.ItemsField] != null && Item[Settings.ItemsField].length > 0) {
                    var ulChildJQ = $("<ul class=\"ContextMenuStripLevel" + ContextMenuStripLevel + "\"></ul>").appendTo(liJQ);
                    $.ContextMenuStrip.AddItems({
                        Selector: ulChildJQ
                        , TextField: Settings.TextField
                        , ItemsField: Settings.ItemsField
                        , ClickField: Settings.ClickField
                        , CheckboxField: Settings.CheckboxField
                        , Items: Item[Settings.ItemsField]
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
            TextField: "Text"
            , ClickField: "Click"
            , ItemsField: "Items"
            , Items: [
                {
                    Name: "Name1"
                    , Text: "Text1"
                    , Click: function () { }
                    , Items: [
                        {
                            Name: "Name1.1"
                            , Text: "Text1.1"
                            , Click: function () { }
                            , Items: [
                                {
                                    Name: "Name1.1.1"
                                    , Text: "Text1.1.1"
                                    , Click: function () { }
                                }
                                , {
                                    Name: "Name1.1.2"
                                    , Text: "Text1.1.2"
                                    , Click: function () { }
                                }
                                , {
                                    Name: "Name1.1.3"
                                    , Text: "Text1.1.3"
                                    , Click: function () { }
                                }
                                , {
                                    Name: "Name1.1.4"
                                    , Text: "Text1.1.4"
                                    , Click: function () { }
                                }
                            ]
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
                , {
                    Name: "Name1"
                    , Text: "Text1"
                    , Click: function () { }
                    , Items: [
                        {
                            Name: "Name1.1"
                            , Text: "Text1.1"
                            , Click: function () { }
                            , Items: [
                                {
                                    Name: "Name1.1.1"
                                    , Text: "Text1.1.1"
                                    , Click: function () { }
                                }
                                , {
                                    Name: "Name1.1.2"
                                    , Text: "Text1.1.2"
                                    , Click: function () { }
                                }
                                , {
                                    Name: "Name1.1.3"
                                    , Text: "Text1.1.3"
                                    , Click: function () { }
                                }
                                , {
                                    Name: "Name1.1.4"
                                    , Text: "Text1.1.4"
                                    , Click: function () { }
                                }
                            ]
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
            ]
            , EventArray: [
                {
                    Type: "mousedown"
                    , Function: function (e, thisJQ) {
                        var EventReturn = undefined;
                        if (e.button == 2) {
                            EventReturn = {
                                Event: e
                                , Left: e.clientX
                                , Top: e.clientY
                                , Width: 0
                                , Height: 0
                            };
                        };
                        return EventReturn;
                    }
                }
                , {
                    Type: "click"
                    , Function: function (e, thisJQ) {
                        var EventReturn = undefined;
                        EventReturn = {
                            Event: e
                            , Left: e.clientX
                            , Top: e.clientY
                            , Width: thisJQ.width()
                            , Height: thisJQ.height()
                        };
                        return EventReturn;
                    }
                }
            ]
        };
        $.extend(Settings, properties);

        var UI_ContextMenuStripJQ = $("#jQueryExtension_UI_ContextMenuStrip");
        if (UI_ContextMenuStripJQ.length < 1) {
            UI_ContextMenuStripJQ = $("<div id=\"jQueryExtension_UI_ContextMenuStrip\" class=\"jQueryExtension_UI_ContextMenuStrip\"></div>").appendTo("body");
            $(document).bind("click", function () { UI_ContextMenuStripJQ.hide(); document.oncontextmenu = function () { return true; }; });
        };

        var EventFunction = function (EventReturn) {
            var e = EventReturn.Event;
            document.oncontextmenu = function () { return false; };
            var SelectorJQ = $(this);
            var TargetJQ = $(e.target);
            var Items;
            if ($.isFunction(Settings.Items)) {
                Items = Settings.Items({ SelectorJQ: SelectorJQ, TargetJQ: TargetJQ });
            } else {
                Items = Settings.Items;
            };
            UI_ContextMenuStripJQ.data("SelectorJQ", SelectorJQ).data("TargetJQ", TargetJQ).empty();
            var ulJQ = $("<ul></ul>").appendTo(UI_ContextMenuStripJQ);
            if (Items != null && Items.length > 0) {
                $.ContextMenuStrip.AddItems({
                    Selector: ulJQ
                    , TextField: Settings.TextField
                    , ItemsField: Settings.ItemsField
                    , ClickField: Settings.ClickField
                    , CheckboxField: Settings.CheckboxField
                    , Items: Items
                    , ContextMenuStripSelector: UI_ContextMenuStripJQ
                    , ContextMenuStripLevel: 0
                });
                var ItemWidth = $.ContextMenuStrip.ItemWidth({ ulJQ: ulJQ });
                ulJQ.width(ItemWidth).show();
            };
            var Left, Top;
            var ItemWidth = $.ContextMenuStrip.ItemWidth({ ulJQ: ulJQ });
            var ItemHeight = $.ContextMenuStrip.ItemHeight({ ulJQ: ulJQ });
            var ClientWidth = fw.clientWidth();
            var ClientHeight = fw.clientHeight();
            if (ClientWidth - EventReturn.Left - 8 > ItemWidth) {
                Left = EventReturn.Left + 2;
            } else {
                Left = EventReturn.Left - ItemWidth + EventReturn.Width;
            };
            if (ClientHeight - EventReturn.Top - 8 > ItemHeight) {
                Top = EventReturn.Top + 2;
            } else {
                Top = EventReturn.Top - ItemHeight + EventReturn.Height;
            };
            UI_ContextMenuStripJQ.css({
                left: Left + "px"
                , top: Top + "px"
            }).show();
            e.stopPropagation();
        };

        if (Settings.EventArray.length > 0) {
            for (var i = 0; i < Settings.EventArray.length; i++) {
                var Event = Settings.EventArray[i];
                var BindFunction = function (e) {
                    var EventReturn = Event.Function(e, $(this));
                    if (EventReturn != undefined) {
                        EventFunction(EventReturn);
                    };
                };
                this.unbind(Event.Type, BindFunction).bind(Event.Type, BindFunction);
            };
        };

        return this;
    }
});