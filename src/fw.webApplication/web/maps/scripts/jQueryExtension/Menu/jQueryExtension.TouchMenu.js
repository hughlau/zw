$.TouchMenu = {
    BindSettings: function () {
        return {
            Level: null                                                            //Item标题
            , IsInherit: false
            , DataSourceField: null                                                //Item标题的图片
            , TitleFunction: function (Entity, ParentEntity) { return ""; }
            , ClickFunction: null
        };
    }
    , Item: function () {
        return {
            Title: null                                                            //Item标题
            , TitleImageUrl: null                                                  //Item标题的图片
            , Entity: {}
        };
    }
    , AddItemList: function (Properties) {
        if (!fw.fwObject.FWObjectHelper.hasValue(Properties)) {
            Properties = {}
        };
        var Settings = {
            Selector: null                                                        //Item控件选择器
            , Item: null                                                          //添加Item
            , ItemList: []                                                        //添加多个Item
            , IsSelected: true                                                    //是否选中
        };
        $.extend(Settings, Properties);

        if (Settings.Item != null) {
            Settings.ItemList.push(Settings.Item);
        };

        for (var i = 0; i < Settings.ItemList.length; i++) {
            var MenuSettings = $.TouchMenu.Item();
            $.extend(MenuSettings, Settings.ItemList[i]);
            Settings.ItemList[i] = MenuSettings;
        };

        if (Settings.ItemList.length > 0) {
            var SelectorJQ = $(Settings.Selector);
            SelectorJQ.each(function () {
                var ControlJQs = $(this).data("ControlJQs");
                for (var i = 0; i < Settings.ItemList.length; i++) {
                    var MustSelectedIndex;

                    var ItemHtml = "";
                    ItemHtml += "<li>";
                    ItemHtml += "    <div class=\"jQueryExtension_UI_Menu_Title\">";
                    ItemHtml += "        <span class=\"jQueryExtension_UI_Menu_Title_Default\"" + (Settings.IsShowStatus ? "" : "style=\"display:none;\"") + "></span>";
                    ItemHtml += "        <span class=\"jQueryExtension_UI_Menu_Title_Folder\"></span>";
                    ItemHtml += "        <a target=\"_blank\">" + Settings.ItemList[i].Title + "</a>";
                    ItemHtml += "    </div>";
                    ItemHtml += "    <ul class=\"jQueryExtension_UI_Menu_Content\" style=\"display:none;overflow:auto;\">";

                    ItemHtml += "<li class=\"jQueryExtension_UI_Menu_Content_List\">";
                    ItemHtml += "    <div class=\"jQueryExtension_UI_Menu_Content_ListTitle\">";
                    ItemHtml += "        <span></span>";
                    ItemHtml += "        <span></span>";
                    ItemHtml += "        <a target=\"_blank\">" + Settings.ItemList[i].Title + "</a>";
                    ItemHtml += "    </div>";
                    ItemHtml += "    <ul style=\"display:none;height:50px; overflow:auto;\">";
                    ItemHtml += "    </ul>";
                    ItemHtml += "</li>";

                    ItemHtml += "    </ul>";
                    ItemHtml += "</li>";
                    var ItemJQ = $(ItemHtml).appendTo(ControlJQs.MenuJQ);
                    var TitleJQ = $(">div:first", ItemJQ).unbind("click").bind("click", function () {
                        var divTitleJQ = $(this);
                        var liItemJQ = divTitleJQ.parent();
                        var ulContentJQ = $(">ul:first", liItemJQ)
                        //                                if (ulContentJQ.filter(":visible").length < 1) {

                        var ulParentContentJQ = liItemJQ.parent();
                        $(">li>div>.jQueryExtension_UI_Menu_Title_Close", ulParentContentJQ).removeClass("jQueryExtension_UI_Menu_Title_Close").addClass('jQueryExtension_UI_Menu_Title_Open');
                        $(">li>ul:visible", ulParentContentJQ).not(ulContentJQ).hide();
                        $(">.jQueryExtension_UI_Menu_Title_Default", divTitleJQ).addClass('jQueryExtension_UI_Menu_Title_Close');
                        ulContentJQ.show();

                        ControlJQs.MenuJQ.Menu_Init();
                        //                                };
                    });

                    $(">ul>li", ItemJQ).bind("click", function () {
                        $("li>ul>li", $(this).parent().parent().parent()).removeClass("jQueryExtension_UI_Menu_Content_ListSelected");
                        $(this).addClass('jQueryExtension_UI_Menu_Content_ListSelected');
                    });

                    TitleJQ.click();


                };

                ControlJQs.MenuJQ.Menu_Init();
            });
        };
    }
    , MenuClose: function (Properties) {
        var Settings = {
            Selector: null                                       //Item控件选择器
            , SelectedIndex: -1                                   //默认打开的菜单索引，支持多菜单打开，格式（0,1,2,3）
        };
        $.extend(Settings, Properties);
        var ControlJQs = $(Settings.Selector).data("ControlJQs");
        if (Settings.SelectedIndex > -1) {
            var ContentJQs = $(">li>ul", ControlJQs.MenuJQ);
            var SelectedContentJQ = ContentJQs.filter(":visible");
            var SelectedIndex = ContentJQs.index(SelectedContentJQ);

            $('>li', ControlJQs.MenuJQ).eq(Settings.SelectedIndex).remove();
            var ItemJQs = $('>li', ControlJQs.MenuJQ);

            SelectedIndex = SelectedIndex >= ItemJQs.length ? (ItemJQs.length - 1) : SelectedIndex;
            $.TouchMenu.Select({ Selector: ControlJQs.MenuJQ, SelectedIndex: SelectedIndex });
        };
    }
    , Select: function (properties) {
        var Settings = {
            Selector: null                                       //Item控件选择器
            , SelectedIndex: 0                                   //默认打开的菜单索引，支持多菜单打开，格式（0,1,2,3）
        };
        $.extend(Settings, properties);

        var ControlJQs = $(Settings.Selector).data("ControlJQs");
        var TitleJQs = $(">li>div", ControlJQs.MenuJQ);
        if (Settings.SelectedIndex > -1) {
            Settings.SelectedIndex = (Settings.SelectedIndex < 0 || Settings.SelectedIndex >= TitleJQs.length) ? 0 : Settings.SelectedIndex;
            var divTitleJQ = TitleJQs.eq(Settings.SelectedIndex);
            divTitleJQ.click();
            $(">a", divTitleJQ).click();
        };
    }
    , GetSelectedIndex: function (MenuSelector) {
        var ContentJQs = $(">li>ul", MenuSelector);
        var SelectedContentJQ = ContentJQs.filter(":visible");
        return ContentJQs.index(SelectedContentJQ);
    }
    , ResizeWidthHeight: function (Properties) {
        /// <summary>
        ///     改变控件宽度高度，并触发大小改变事件
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
        };
        $.extend(Settings, Properties);

        jQueryExtension.ResizeWidthHeight(Settings);
    }
};

//分页Menu
$.fn.extend({
    TouchMenu_Init: function (Properties) {
        if (!fw.fwObject.FWObjectHelper.hasValue(Properties)) {
            Properties = {}
        };
        var Settings = {};
        $.extend(Settings, Properties);

        var SelectorJQ = this;
        SelectorJQ.each(function () {
            var ControlJQs;
            var MenuJQ = $(this);
            var WindowGuid = MenuJQ.data("WindowGuid");
            if (!fw.fwObject.FWObjectHelper.hasValue(WindowGuid)) {
                WindowGuid = fw.guid();

                ControlJQs = {
                    IsInit: true
                    , MenuJQ: MenuJQ.data("WindowGuid", WindowGuid).addClass('jQueryExtension_UI_Menu').data('SelectedIndex', -1)
                };

                ControlJQs.MenuJQ.bind("jQueryExtension_Event_Resize", function () {
                    var MenuBox = jQueryExtension.Box(ControlJQs.MenuJQ);
                    var ItemJQs = $(">li>div:first-child", ControlJQs.MenuJQ);
                    var ItemListHeight = 0;
                    ItemJQs.each(function () {
                        var ItemBox = jQueryExtension.Box(this);
                        ItemListHeight += ItemBox.Height(jQueryExtension.Data.BoxInternalStructure.Border);
                    });

                    $(">li>ul:visible", ControlJQs.MenuJQ).height(MenuBox.Height(jQueryExtension.Data.BoxInternalStructure.Border) - MenuBox.PaddingTop - ItemListHeight - MenuBox.PaddingBottom - 2);

                });

                MenuJQ.data("ControlJQs", ControlJQs);
            } else {
                ControlJQs = MenuJQ.data("ControlJQs");
                ControlJQs.IsInit = false;
            };
            MenuJQ.triggerHandler("jQueryExtension_Event_Resize");
        });
    }
    , TouchMenu: function (properties) {
        if (typeof (properties) == "undefined") {
            properties = {};
        };
        var Settings = {
            IsFlash: jQueryExtension.IsFlash()
            , Speed: jQueryExtension.Data.Settings.Speed
            , Frequency: jQueryExtension.Data.Settings.Frequency
            , SelectedIndex: -1                                //默认打开的菜单索引，支持多菜单打开，格式（1,2,3）
            , Height: null
            , DataSource: []                                    //各个Item的属性
            , BindSettingsList: []
            , IsAddSelectedStyle: true                          //是否添加选中样式
            , IsShowStatus: true
        };
        $.extend(Settings, properties);

        if (this.length > 0) {
            if (!Settings.IsFlash) {
                Settings.Speed = 0;
            };

            var BindSettingsList = [];
            for (var i = 0; i < Settings.BindSettingsList.length; i++) {
                for (var j = 0; j < Settings.BindSettingsList.length; j++) {
                    if (Settings.BindSettingsList[j].Level == i) {
                        BindSettingsList.push(Settings.BindSettingsList[j]);
                    };
                };
            };
            for (var i = 0; i < BindSettingsList.length; i++) {
                if (i > 0 && BindSettingsList[i].IsInherit) {
                    BindSettingsList[i] = BindSettingsList[i - 1];
                };
            };


            if (BindSettingsList.length > 0) {
                this.TouchMenu_Init(Settings);
                this.each(function () {
                    var ControlJQs = $(this).data("ControlJQs");

                    if (fw.fwObject.FWObjectHelper.hasValue(ControlJQs)) {
                        var BuildTree = function (ParentJQ, Level, EntityList, ParentEntity) {
                            for (var i = 0; i < EntityList.length; i++) {
                                if (Level == 0) {
                                    var liJQ = $("<li></li>");
                                    var Menu_TitleJQ = $("<div class=\"jQueryExtension_UI_Menu_Title\"></div>");
                                    Menu_TitleJQ.appendTo(liJQ);
                                    var Menu_Title_DefaultJQ = $("<span class=\"jQueryExtension_UI_Menu_Title_Default\"" + (Settings.IsShowStatus ? "" : "style=\"display:none;\"") + "></span>");
                                    Menu_Title_DefaultJQ.appendTo(Menu_TitleJQ);
                                    var Menu_Title_FolderJQ = $("<span class=\"jQueryExtension_UI_Menu_Title_Folder\"></span>");
                                    Menu_Title_FolderJQ.appendTo(Menu_TitleJQ);
                                    var aJQ = $("<a target=\"_blank\"></a>");
                                    var InnerJQ = BindSettingsList[Level].TitleFunction(EntityList[i], ParentEntity);
                                    if (!fw.fwObject.FWObjectHelper.hasValue(InnerJQ)) {
                                        aJQ.html("&nbsp;");
                                    } else {
                                        if (InnerJQ instanceof jQuery) {
                                            $(InnerJQ).appendTo(aJQ);
                                        } else {
                                            aJQ.html(InnerJQ.toString());
                                        };
                                    };
                                    aJQ.appendTo(Menu_TitleJQ).data("Entity", EntityList[i]).data("DefaultIndex", i);
                                    if ($.isFunction(BindSettingsList[Level].ClickFunction)) {
                                        aJQ.bind("click", function () {
                                            BindSettingsList[Level].ClickFunction(this);
                                        });
                                    };
                                    if (BindSettingsList[Level] != undefined && EntityList[i][BindSettingsList[Level].DataSourceField] != undefined && EntityList[i][BindSettingsList[Level].DataSourceField].length > 0) {
                                        var Menu_ContentJQ = $("<ul class=\"jQueryExtension_UI_Menu_Content\" style=\"display:none;overflow:auto;\"></ul>");
                                        Menu_ContentJQ.appendTo(liJQ);
                                        BuildTree(Menu_ContentJQ, (Level + 1), EntityList[i][BindSettingsList[Level].DataSourceField], EntityList[i]);
                                    };
                                    liJQ.appendTo(ParentJQ);
                                } else if (Level == 1) {
                                    var Menu_Content_ListJQ = $("<li class=\"jQueryExtension_UI_Menu_Content_List " + (!Settings.IsAddSelectedStyle ? "jQueryExtension_UI_Menu_Content_ListNoHover" : "") + "\"></li>");
                                    var Menu_Content_ListTitleJQ = $("<div class=\"jQueryExtension_UI_Menu_Content_ListTitle\"></div>");
                                    Menu_Content_ListTitleJQ.appendTo(Menu_Content_ListJQ);
                                    var Menu_Content_Title_DefaultJQ = $("<span></span>");
                                    Menu_Content_Title_DefaultJQ.appendTo(Menu_Content_ListTitleJQ);
                                    var Menu_Content_Title_FolderJQ = $("<span></span>");
                                    Menu_Content_Title_FolderJQ.appendTo(Menu_Content_ListTitleJQ);
                                    var Menu_Content_List_aJQ = $("<a target=\"_blank\"></a>");
                                    var InnerJQ = BindSettingsList[Level].TitleFunction(EntityList[i], ParentEntity);
                                    if (!fw.fwObject.FWObjectHelper.hasValue(InnerJQ)) {
                                        Menu_Content_List_aJQ.html("&nbsp;");
                                    } else {
                                        if (InnerJQ instanceof jQuery) {
                                            $(InnerJQ).appendTo(Menu_Content_List_aJQ);
                                        } else {
                                            Menu_Content_List_aJQ.html(InnerJQ.toString());
                                        };
                                    };
                                    Menu_Content_List_aJQ.appendTo(Menu_Content_ListTitleJQ).data("Entity", EntityList[i]);
                                    if ($.isFunction(BindSettingsList[Level].ClickFunction)) {
                                        Menu_Content_List_aJQ.bind("click", function () {
                                            BindSettingsList[Level].ClickFunction(this);
                                        });
                                    };
                                    if (BindSettingsList[Level] != undefined && EntityList[i][BindSettingsList[Level].DataSourceField] != undefined && EntityList[i][BindSettingsList[Level].DataSourceField].length > 0) {
                                        var Menu_Content_ContentJQ = $("<ul class=\"jQueryExtension_UI_Menu_Content\" style=\"display:none;overflow:auto;\"></ul>");
                                        Menu_Content_ContentJQ.appendTo(Menu_Content_ListJQ);
                                        BuildTree(Menu_Content_ContentJQ, (Level + 1), EntityList[i][BindSettingsList[Level].DataSourceField], EntityList[i]);
                                    };
                                    Menu_Content_ListJQ.appendTo(ParentJQ)
                                };
                            };
                        };
                        BuildTree(ControlJQs.MenuJQ, 0, Settings.DataSource);

                        var TitleJQ = $(">li>div", ControlJQs.MenuJQ).unbind("click").bind("click", function () {
                            var divTitleJQ = $(this);
                            var liItemJQ = divTitleJQ.parent();
                            var ulContentJQ = $(">ul:first", liItemJQ)
                            //                                if (ulContentJQ.filter(":visible").length < 1) {

                            var ulParentContentJQ = liItemJQ.parent();
                            $(">li>div>.jQueryExtension_UI_Menu_Title_Close", ulParentContentJQ).removeClass("jQueryExtension_UI_Menu_Title_Close").addClass('jQueryExtension_UI_Menu_Title_Open');
                            $(">li>ul:visible", ulParentContentJQ).not(ulContentJQ).hide();
                            $(">.jQueryExtension_UI_Menu_Title_Default", divTitleJQ).addClass('jQueryExtension_UI_Menu_Title_Close');
                            ulContentJQ.show();

                            ControlJQs.MenuJQ.TouchMenu_Init();
                            //                                };
                        });

                        $(">li>ul>li", ControlJQs.MenuJQ).bind("click", function () {
                            $("li>ul>li", $(this).parent().parent().parent()).removeClass("jQueryExtension_UI_Menu_Content_ListSelected");
                            if (Settings.IsAddSelectedStyle) {
                                $(this).addClass('jQueryExtension_UI_Menu_Content_ListSelected');
                            };
                        });

                        $.TouchMenu.Select({ Selector: ControlJQs.MenuJQ, SelectedIndex: Settings.SelectedIndex });

                        if (fw.fwObject.FWObjectHelper.hasValue(Settings.Height)) {
                            $.TouchMenu.ResizeWidthHeight({
                                Selector: ControlJQs.MenuJQ
                                , Height: Settings.Height
                            });
                        };
                    };
                });
            };
        };


    }
});