//加载菜单
function LoadMenu() {
    //MenuListBind({ Selector: $("#divMenuSystem"), DataSelector: $("#divMenuSystem_1"), DataSource: MenuData, ModuleSelector: divModuleJQ, TopHeight: divLogoJQ.height(), BottomHeight: divFootJQ.height(), API: API });
    //动态菜单
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall",
        serviceName: "sysBasicManage",
        methodName: "getUserMenuBasicManage",
        data: {
            ticket: $.page.ticket,
            menuTypeCode: fw.m.sysManage.data.FWMenuTypeCode.WebMainMenu,
            isTreeData: 1
        },
        success: function (resultData) {

            if (resultData != null && resultData.status == 1 && resultData.data != null) {

                ModuleListBind({ Selector: divModuleListJQ, DataSelector: divModuleList2JQ, DataSource: resultData.data, ModuleSelector: divModuleJQ, TopHeight: divLogoJQ.height(), BottomHeight: divFootJQ.height(), API: API });
          
            };
        }
    }));
};

function ModuleListBind(Properties) {
    if (typeof (Properties) == "undefined") {
        Properties = {};
    };
    var Settings = {
        Selector: null
        , DataSelector: null
        , DataSource: []                                    //各个Item的属性
        , TopHeight: 80
        , BottomHeight: 60
        , ModuleSelector: null
        , API: null
    };
    $.extend(Settings, Properties);
    var SelectorJQ = $(Settings.Selector);
    var DataSelectorJQ = $(Settings.DataSelector);
    var DataSource = Settings.DataSource;
    var SelectBlockJQ = null;
    var SelectDataBlockJQ = null;
    if (DataSource != null && DataSource.length > 0) {

        //SelectorJQ.hide();
        DataSelectorJQ.hide();
        SelectorJQ.empty();
        DataSelectorJQ.empty();
        var html = "";
        html += "<div class=\"TitleMenu\">";
        html += "   <div class=\"TitleMenuContent\">";
        html += "   系统导航</div>";
        html += "</div>";
        html += "<div id=\"divBodyMenu\" class=\"BodyMenu\" style='overflow-x:hidden;'>";
        for (var i = 0; i < DataSource.length; i += 2) {
            var Entity = DataSource[i];
            html += "<div class=\"BodyContentHeight\">";
            if (Entity) {
                html += "<div class=\"BodyContentBlock\" id=\"BodyContentBlock" + Entity.mMenuCode + "\" >";
                html += "   <img class=\"BodyContentImageLeft\" src=\"" + API.GetAbsoluteUrl(Entity.mIconUrl, Settings.API.webSiteRootUrl) + "\" />";
                html += "   <div class=\"BodyContentImageFontLeft\">";
                html += "<span name='" + Entity.mTitle + "'>" + Entity.mTitle + "</span>";
                html += "   </div>";
                html += "</div>";
            }
            if (DataSource[i + 1]) {
                html += "<div class=\"BodyContentBlock\" id=\"BodyContentBlock" + DataSource[i + 1].mMenuCode + "\" >";
                html += "   <img class=\"BodyContentImageLeft\" src=\"" + API.GetAbsoluteUrl(DataSource[i + 1].mIconUrl, Settings.API.webSiteRootUrl) + "\" />";
                html += "   <div class=\"BodyContentImageFontLeft\">";
                html += "<span name='" + DataSource[i + 1].mTitle + "'>" + DataSource[i + 1].mTitle + "</span>"; 
                html += "   </div>";
                html += "</div>";
            }
            html += "</div>";
        };
        html += "</div>";
        $(html).appendTo(SelectorJQ);
        var ClientHeight = fw.clientHeight() - 185;
        var BodyMenuHeight = Math.round(parseFloat(DataSource.length / 2)) * $(".BodyContentHeight").height() + 10;
        if (ClientHeight >= BodyMenuHeight) {
            $("#divBodyMenu").height(BodyMenuHeight);
            $("#divBodyMenu").css("overflow-y", "hidden");
        } else {
            $("#divBodyMenu").height(ClientHeight);
            $("#divBodyMenu").css("overflow-y", "scroll");
        };
        $(".BodyContentBlock", SelectorJQ).each(function (e) {
            var thisJQ = $(this);
            var id = thisJQ.attr("id").substring(16);
            for (var i = 0; i < DataSource.length; i++) {
                var Entity = DataSource[i];
                if (id == Entity.mMenuCode) {
                    thisJQ.data("Entity", Entity);
                    thisJQ.bind("click", function () {
                        SelectBlockJQ = thisJQ;
                        var Entity = thisJQ.data("Entity");
                        Entity.OnFocusIn = jExtension.ToFunction(Entity.mOnFocusInScriptCode);
                        Entity.OnFocusOut = jExtension.ToFunction(Entity.mOnFocusOutScriptCode);
                        if ($.isFunction(Entity.OnFocusOut)) {
                            Entity.OnFocusOut({ currentTarget: this });

                        };

                        //菜单进入触发器
                        if ($.isFunction(Entity.OnFocusIn)) {
                            Entity.OnFocusIn(e);
                            //API.LogoShow();
                        } else if (fw.fwObject.FWObjectHelper.hasValue(Entity.mUrl)) {
                            var Data = jExtension.JsonStringToJson(Entity.mUrlParamsJson, {});
                            Data.Ticket = $.page.ticket;
                        };

                        if (Entity.mFWMenuList != null && Entity.mFWMenuList.length > 0) {
                            SelectorJQ.hide();
                            $("#divMenuLeft").css("right", "-10px");
                            SelectorJQ.animate({ right: "-220px" }, "fast", function () {
                                SelectorJQ.hide();
                                DataSelectorJQ.show();
                                DataSelectorJQ.css("right", "0");
                                $("#divMenuLeft").css("right", "195px");
                            });
                            var divMenuJQ = DataSelectorJQ;
                            divMenuJQ.empty();
                            var childHtml = "";
                            childHtml += "<div class=\"TitleMenu_1\">";
                            childHtml += "  <div class=\"TitleMenu_1Content\">";
                            childHtml += "    返回主菜单";
                            childHtml += "  </div>";
                            childHtml += "</div>";
                            childHtml += "<div class=\"\">";
                            childHtml += "  <div class=\"BodyMenuTitle\">";
                            childHtml += "      <image class=\"BodyMenuTitleIcon\" />";
                            childHtml += "      " + Entity.mTitle;
                            childHtml += "  </div>";
                            childHtml += "  <div class=\"BodyMenuContent\" style=\"overflow-x:hidden;\">";
                            childHtml += "      <ul>";
                            for (var i = 0; i < Entity.mFWMenuList.length; i++) {
                                var ChileEntity = Entity.mFWMenuList[i];
                                //ChileEntity
                                childHtml += "      <li class=\"BodyMenuContentLi\" id =\"li" + ChileEntity.mMenuCode + "\">";
                                childHtml += "          <div class=\"BodyMenuContentLiDiv\">";
                                childHtml += "              <div class=\"BodyMenuContentLiIcon\">";
                                childHtml += "              </div>";
                                childHtml += "  <span name='" + ChileEntity.mMenuName + "'>" + ChileEntity.mMenuName + "</span>";
                               // childHtml += "              " + ChileEntity.mMenuName;
                                childHtml += "          </div>";
                                childHtml += "      </li>";
                            };
                            childHtml += "  </div>";
                            childHtml += "</div>";
                            $(childHtml).appendTo(divMenuJQ);
                            var BodyMenuContentHeight = $(".BodyMenuContent").height();
                            var CountHeihgt = Entity.mFWMenuList.length * 44;
                            if (CountHeihgt > BodyMenuContentHeight) {
                                BodyMenuContentHeight = CountHeihgt;
                            };
                            var BodyMenuContentClientHeight = fw.clientHeight() - 230;
                            if (BodyMenuContentClientHeight >= BodyMenuContentHeight) {
                                $(".BodyMenuContent").height(BodyMenuContentHeight);
                                $(".BodyMenuContent").css("overflow-y", "hidden");
                            }
                            else {
                                $(".BodyMenuContent").height(BodyMenuContentClientHeight);
                                $(".BodyMenuContent").css("overflow-y", "scroll");
                            };
                            $(".BodyMenuTitleIcon").attr("src", API.GetAbsoluteUrl(Entity.mIconUrl, Settings.API.webSiteRootUrl));
                            $(".TitleMenu_1Content").bind("click", function () {

                                //by MHQ
                               // HomeInit();
                                if (SelectBlockJQ != null && SelectBlockJQ.length > 0) {
                                    var EntityBlock = SelectBlockJQ.data("Entity");
                                    if (EntityBlock != null && $.isFunction(EntityBlock.OnFocusOut)) {
                                        EntityBlock.OnFocusOut({ currentTarget: this });
                                    };
                                };
                                if (SelectDataBlockJQ != null && SelectDataBlockJQ.length > 0) {
                                    var EntityDataBlock = SelectDataBlockJQ.data("Entity");
                                    if (EntityDataBlock != null && $.isFunction(EntityDataBlock.OnFocusOut)) {
                                        EntityDataBlock.OnFocusOut({ currentTarget: this });
                                    };
                                };
                                $("#divMenuLeft").css("right", "-10px");
                                DataSelectorJQ.animate({ right: "-220px" }, "normal", function () {
                                    DataSelectorJQ.hide();
                                    SelectorJQ.show();
                                    SelectorJQ.css("right", "0");
                                    $("#divMenuLeft").css("right", "195px");
                                });
                            });
                            $("li", divMenuJQ).each(function () {
                                var thisJQ = $(this);
                                var thisID = thisJQ.attr("id").substring(2);
                                for (var i = 0; i < Entity.mFWMenuList.length; i++) {
                                    Entity.mFWMenuList[i].OnFocusIn = jExtension.ToFunction(Entity.mFWMenuList[i].mOnFocusInScriptCode);
                                    Entity.mFWMenuList[i].OnFocusOut = jExtension.ToFunction(Entity.mFWMenuList[i].mOnFocusOutScriptCode);
                                    if (thisID == Entity.mFWMenuList[i].mMenuCode) {
                                        var ChileEntity = Entity.mFWMenuList[i];
                                        thisJQ.data("Entity", ChileEntity);
                                        thisJQ.bind("click", function () {
                                            //Settings.API.ModuleSlideToggle();
                                            var thisJQ = $(this);
                                            if ($("#divMenuLeft").length > 0) {
                                                //by MHQ
                                                //默认菜单收缩
                                                //$("#divMenuLeft").click();  
                                            };
                                            if (SelectDataBlockJQ != null && SelectDataBlockJQ.length > 0) {
                                                var thisEntity = SelectDataBlockJQ.data("Entity");
                                                if (thisEntity != null && $.isFunction(thisEntity.OnFocusOut)) {
                                                    thisEntity.OnFocusOut({ currentTarget: this });
                                                };
                                                $(">div", SelectDataBlockJQ).removeClass("BodyMenuContentLiHover").addClass("BodyMenuContentLiDiv");
                                            };

                                            SelectDataBlockJQ = thisJQ;
                                            var ChileEntity = thisJQ.data("Entity");
                                            $(">div", $(this)).removeClass("BodyMenuContentLiDiv").addClass("BodyMenuContentLiHover");
                                            //菜单进入触发器

                                            if ($.isFunction(ChileEntity.OnFocusIn)) {
                                                ChileEntity.OnFocusIn(e);
                                            } else if (fw.fwObject.FWObjectHelper.hasValue(ChileEntity.mUrl)) {
                                                var Data = jExtension.JsonStringToJson(ChileEntity.mUrlParamsJson, {});
                                                Data.Ticket = $.page.ticket;
                                                var OpenSettings = {
                                                    mTitle: ChileEntity.mTitle
                                                    , Url: API.GetAbsoluteUrl(ChileEntity.mUrl, API.webSiteRootUrl)
                                                    , Data: Data
                                                };
                                                if (fw.fwObject.FWObjectHelper.hasValue(ChileEntity.mLayoutHorizontalAlignment)) {
                                                    OpenSettings.HorizontalAlignment = ChileEntity.mLayoutHorizontalAlignment;
                                                };
                                                if (fw.fwObject.FWObjectHelper.hasValue(ChileEntity.mLayoutLeft)) {
                                                    OpenSettings.Left = ChileEntity.mLayoutLeft;
                                                };
                                                if (fw.fwObject.FWObjectHelper.hasValue(ChileEntity.mLayoutRight)) {
                                                    OpenSettings.Right = ChileEntity.mLayoutRight;
                                                };
                                                if (fw.fwObject.FWObjectHelper.hasValue(ChileEntity.mLayoutWidth)) {
                                                    OpenSettings.Width = ChileEntity.mLayoutWidth;
                                                };
                                                if (fw.fwObject.FWObjectHelper.hasValue(ChileEntity.mLayoutVerticalAlignment)) {
                                                    OpenSettings.VerticalAlignment = ChileEntity.mLayoutVerticalAlignment;
                                                };
                                                if (fw.fwObject.FWObjectHelper.hasValue(ChileEntity.mLayoutTop)) {
                                                    OpenSettings.Top = ChileEntity.mLayoutTop;
                                                };
                                                if (fw.fwObject.FWObjectHelper.hasValue(ChileEntity.mLayoutBottom)) {
                                                    OpenSettings.Bottom = ChileEntity.mLayoutBottom;
                                                };
                                                if (fw.fwObject.FWObjectHelper.hasValue(ChileEntity.mLayoutHeight)) {
                                                    OpenSettings.Height = ChileEntity.mLayoutHeight;
                                                };
                                                if (fw.fwObject.FWObjectHelper.hasValue(OpenSettings.Width)) {
                                                    if (OpenSettings.Width > jQueryExtension.ScreenWidth()) {
                                                        OpenSettings.Width = jQueryExtension.ScreenWidth() - 22;
                                                    };
                                                };
                                                if (fw.fwObject.FWObjectHelper.hasValue(OpenSettings.Height)) {
                                                    if (OpenSettings.Height > jQueryExtension.ScreenHeight()) {
                                                        OpenSettings.Height = jQueryExtension.ScreenHeight() - 22;
                                                    };
                                                };
                                                if (ChileEntity.mOpenTypeCode == "10") {
                                                    API.Open(OpenSettings);
                                                } else {
                                                    jQueryExtension.Window.Open(OpenSettings);
                                                };
                                            };
                                        });
                                    };
                                };
                            });
                        };
                    });
                };
            };
        });


        //菜单单击事件
        var IsContent = false;
        $("#divMenuLeft").bind("click", function () {
            if ($(this).css("right") == "-10px") {
                var ishave_1 = $("#divMenuSystem_1").html() != "" ? true : false;
                if ($("#divMenuSystem").css("display") == "none" && !IsContent || !ishave_1) {
                    $("#divMenuSystem").animate({ right: "0" }, "normal", function () {
                        $("#divMenuLeft").css("right", "195px");
                        $("#divMenuSystem").show();
                    });
                }
                else {
                    $("#divMenuSystem_1").animate({ right: "0" }, "normal", function () {
                        $("#divMenuLeft").css("right", "195px");
                        $("#divMenuSystem_1").show();
                    });
                }
            } else {
                $("#divMenuLeft").css("right", "-10px");
                if ($("#divMenuSystem").css("display") != "none") {
                    $("#divMenuSystem").animate({ right: "-195px" }, "normal", function () {
                        $("#divMenuSystem").hide();
                        $("#divMenuSystem_1").hide();
                    });
                }
                else {
                    $("#divMenuSystem_1").animate({ right: "-195px" }, "normal", function () {
                        $("#divMenuSystem_1").hide();
                        $("#divMenuSystem").hide();
                        IsContent = true;
                    });
                }
            };
            ResizeFunction(true);
        });

        $("#divMenuLeft").show();
    };
};

//function MenuListBind(Properties) {
//    if (typeof (Properties) == "undefined") {
//        Properties = {};
//    };
//    var Settings = {
//        Selector: null
//        , DataSelector: null
//        , DataSource: []                                    //各个Item的属性
//        , TopHeight: 80
//        , BottomHeight: 60
//        , ModuleSelector: null
//        , API: null
//    };
//    $.extend(Settings, Properties);
//    var SelectorJQ = $(Settings.Selector);
//    var DataSelectorJQ = $(Settings.DataSelector);
//    var DataSource = Settings.DataSource;
//    var SelectBlockJQ = null;
//    var SelectDataBlockJQ = null;
//    if (DataSource != null && DataSource.length > 0) {
//        //SelectorJQ.hide();
//        DataSelectorJQ.hide();
//        SelectorJQ.empty();
//        DataSelectorJQ.empty();
//        var html = "";
//        html += "<div class=\"TitleMenu\">";
//        html += "   <div class=\"TitleMenuContent\">";
//        html += "   系统导航</div>";
//        html += "</div>";
//        html += "<div id=\"divBodyMenu\" class=\"BodyMenu\" style='overflow-x:hidden;'>";
//        for (var i = 0; i < DataSource.length; i += 2) {
//            var Entity = DataSource[i];
//            html += "<div class=\"BodyContentHeight\">";
//            if (Entity) {
//                html += "<div class=\"BodyContentBlock\" id=\"BodyContentBlock" + Entity.MenuCode + "\" >";
//                html += "   <img class=\"BodyContentImageLeft\" src=\"" + API.GetAbsoluteUrl(Entity.IconUrl, Settings.API.webSiteRootUrl) + "\" />";
//                html += "   <div class=\"BodyContentImageFontLeft\">";
//                html += Entity.TitleHtml;
//                html += "   </div>";
//                html += "</div>";
//            }
//            if (DataSource[i + 1]) {
//                html += "<div class=\"BodyContentBlock\" id=\"BodyContentBlock" + DataSource[i + 1].MenuCode + "\" >";
//                html += "   <img class=\"BodyContentImageLeft\" src=\"" + API.GetAbsoluteUrl(DataSource[i + 1].IconUrl, Settings.API.webSiteRootUrl) + "\" />";
//                html += "   <div class=\"BodyContentImageFontLeft\">";
//                html += DataSource[i + 1].TitleHtml;
//                html += "   </div>";
//                html += "</div>";
//            }
//            html += "</div>";
//        };
//        html += "</div>";
//        $(html).appendTo(SelectorJQ);
//        var ClientHeight = fw.clientHeight() - 185;
//        var BodyMenuHeight = Math.round(parseFloat(DataSource.length / 2)) * $(".BodyContentHeight").height() + 10;
//        if (ClientHeight >= BodyMenuHeight) {
//            $("#divBodyMenu").height(BodyMenuHeight);
//            $("#divBodyMenu").css("overflow-y", "hidden");
//        } else {
//            $("#divBodyMenu").height(ClientHeight);
//            $("#divBodyMenu").css("overflow-y", "scroll");
//        };
//        $(".BodyContentBlock", SelectorJQ).each(function (e) {
//            var thisJQ = $(this);
//            var id = thisJQ.attr("id").substring(16);
//            for (var i = 0; i < DataSource.length; i++) {
//                var Entity = DataSource[i];
//                if (id == Entity.MenuCode) {
//                    thisJQ.data("Entity", Entity);
//                    thisJQ.bind("click", function () {
//                        SelectBlockJQ = thisJQ;
//                        var Entity = thisJQ.data("Entity");
//                        Entity.OnFocusIn = jExtension.ToFunction(Entity.OnFocusInJAVAScriptCode);
//                        Entity.OnFocusOut = jExtension.ToFunction(Entity.OnFocusOutJAVAScriptCode);
//                        if ($.isFunction(Entity.OnFocusOut)) {
//                            Entity.OnFocusOut({ currentTarget: this });
//                        };
//                        //菜单进入触发器
//                        if ($.isFunction(Entity.OnFocusIn)) {
//                            Entity.OnFocusIn(e);
//                            //API.LogoShow();
//                        } else if (fw.fwObject.FWObjectHelper.hasValue(Entity.Url)) {
//                            var Data = jExtension.JsonStringToJson(Entity.UrlParametersJsonString, {});
//                            Data.Ticket = $.page.ticket;
//                        };
//                        if (Entity.ChildMenuList != null && Entity.ChildMenuList.length > 0) {
//                            SelectorJQ.hide();
//                            $("#divMenuLeft").css("right", "-10px");
//                            SelectorJQ.animate({ right: "-220px" }, "fast", function () {
//                                SelectorJQ.hide();
//                                DataSelectorJQ.show();
//                                DataSelectorJQ.css("right", "0");
//                                $("#divMenuLeft").css("right", "195px");
//                            });
//                            var divMenuJQ = DataSelectorJQ;
//                            divMenuJQ.empty();
//                            var childHtml = "";
//                            childHtml += "<div class=\"TitleMenu_1\">";
//                            childHtml += "  <div class=\"TitleMenu_1Content\">";
//                            childHtml += "    返回主菜单";
//                            childHtml += "  </div>";
//                            childHtml += "</div>";
//                            childHtml += "<div class=\"\">";
//                            childHtml += "  <div class=\"BodyMenuTitle\">";
//                            childHtml += "      <image class=\"BodyMenuTitleIcon\" />";
//                            childHtml += "      " + Entity.TitleHtml;
//                            childHtml += "  </div>";
//                            childHtml += "  <div class=\"BodyMenuContent\" style=\"overflow-x:hidden;\">";
//                            childHtml += "      <ul>";
//                            for (var i = 0; i < Entity.ChildMenuList.length; i++) {
//                                var ChileEntity = Entity.ChildMenuList[i];
//                                //ChileEntity
//                                childHtml += "      <li class=\"BodyMenuContentLi\" id =\"li" + ChileEntity.MenuCode + "\">";
//                                childHtml += "          <div class=\"BodyMenuContentLiDiv\">";
//                                childHtml += "              <div class=\"BodyMenuContentLiIcon\">";
//                                childHtml += "              </div>";
//                                childHtml += "              <span name='" + ChileEntity.MenuName + "'>" + ChileEntity.MenuName+"</span>";
//                                childHtml += "          </div>";
//                                childHtml += "      </li>";
//                            };
//                            childHtml += "  </div>";
//                            childHtml += "</div>";
//                            $(childHtml).appendTo(divMenuJQ);
//                            var BodyMenuContentHeight = $(".BodyMenuContent").height();
//                            var CountHeihgt = Entity.ChildMenuList.length * 44;
//                            if (CountHeihgt > BodyMenuContentHeight) {
//                                BodyMenuContentHeight = CountHeihgt;
//                            };
//                            var BodyMenuContentClientHeight = fw.clientHeight() - 230;
//                            if (BodyMenuContentClientHeight >= BodyMenuContentHeight) {
//                                $(".BodyMenuContent").height(BodyMenuContentHeight);
//                                $(".BodyMenuContent").css("overflow-y", "hidden");
//                            }
//                            else {
//                                $(".BodyMenuContent").height(BodyMenuContentClientHeight);
//                                $(".BodyMenuContent").css("overflow-y", "scroll");
//                            };
//                            $(".BodyMenuTitleIcon").attr("src", API.GetAbsoluteUrl(Entity.IconUrl, Settings.API.webSiteRootUrl));
//                            $(".TitleMenu_1Content").bind("click", function () {
//                                //by MHQ
//                               // HomeInit();
//                                if (SelectBlockJQ != null && SelectBlockJQ.length > 0) {
//                                    var EntityBlock = SelectBlockJQ.data("Entity");
//                                    if (EntityBlock != null && $.isFunction(EntityBlock.OnFocusOut)) {
//                                        EntityBlock.OnFocusOut({ currentTarget: this });
//                                    };
//                                };
//                                if (SelectDataBlockJQ != null && SelectDataBlockJQ.length > 0) {
//                                    var EntityDataBlock = SelectDataBlockJQ.data("Entity");
//                                    if (EntityDataBlock != null && $.isFunction(EntityDataBlock.OnFocusOut)) {
//                                        EntityDataBlock.OnFocusOut({ currentTarget: this });
//                                    };
//                                };
//                                $("#divMenuLeft").css("right", "-10px");
//                                DataSelectorJQ.animate({ right: "-220px" }, "normal", function () {
//                                    DataSelectorJQ.hide();
//                                    SelectorJQ.show();
//                                    SelectorJQ.css("right", "0");
//                                    $("#divMenuLeft").css("right", "195px");
//                                });
//                            });
//                            $("li", divMenuJQ).each(function () {
//                                var thisJQ = $(this);
//                                var thisID = thisJQ.attr("id").substring(2);
//                                for (var i = 0; i < Entity.ChildMenuList.length; i++) {
//                                    Entity.ChildMenuList[i].OnFocusIn = jExtension.ToFunction(Entity.ChildMenuList[i].OnFocusInJAVAScriptCode);
//                                    Entity.ChildMenuList[i].OnFocusOut = jExtension.ToFunction(Entity.ChildMenuList[i].OnFocusOutJAVAScriptCode);
//                                    if (thisID == Entity.ChildMenuList[i].MenuCode) {
//                                        var ChileEntity = Entity.ChildMenuList[i];
//                                        thisJQ.data("Entity", ChileEntity);
//                                        thisJQ.bind("click", function () {
//                                            //Settings.API.ModuleSlideToggle();
//                                            var thisJQ = $(this);
//                                            if ($("#divMenuLeft").length > 0) {
//                                                //by MHQ
//                                                $("#divMenuLeft").click();
//                                            };
//                                            if (SelectDataBlockJQ != null && SelectDataBlockJQ.length > 0) {
//                                                var thisEntity = SelectDataBlockJQ.data("Entity");
//                                                if (thisEntity != null && $.isFunction(thisEntity.OnFocusOut)) {
//                                                    thisEntity.OnFocusOut({ currentTarget: this });
//                                                };
//                                                $(">div", SelectDataBlockJQ).removeClass("BodyMenuContentLiHover").addClass("BodyMenuContentLiDiv");
//                                            };
//                                            SelectDataBlockJQ = thisJQ;
//                                            var ChileEntity = thisJQ.data("Entity");
//                                            $(">div", $(this)).removeClass("BodyMenuContentLiDiv").addClass("BodyMenuContentLiHover");
//                                            //菜单进入触发器
//                                            if ($.isFunction(ChileEntity.OnFocusIn)) {
//                                                ChileEntity.OnFocusIn(e);
//                                            } else if (fw.fwObject.FWObjectHelper.hasValue(ChileEntity.Url)) {
//                                                var Data = jExtension.JsonStringToJson(ChileEntity.UrlParametersJsonString, {});
//                                                Data.Ticket = $.page.ticket;
//                                                var OpenSettings = {
//                                                    TitleHtml: ChileEntity.TitleHtml
//                                                                            , Url: API.GetAbsoluteUrl(ChileEntity.Url, API.WebSiteRootUrl)
//                                                                            , Data: Data
//                                                };
//                                                if (fw.fwObject.FWObjectHelper.hasValue(ChileEntity.Layout_HorizontalAlignment)) {
//                                                    OpenSettings.HorizontalAlignment = ChileEntity.Layout_HorizontalAlignment;
//                                                };
//                                                if (fw.fwObject.FWObjectHelper.hasValue(ChileEntity.Layout_Left)) {
//                                                    OpenSettings.Left = ChileEntity.Layout_Left;
//                                                };
//                                                if (fw.fwObject.FWObjectHelper.hasValue(ChileEntity.Layout_Right)) {
//                                                    OpenSettings.Right = ChileEntity.Layout_Right;
//                                                };
//                                                if (fw.fwObject.FWObjectHelper.hasValue(ChileEntity.Layout_Width)) {
//                                                    OpenSettings.Width = ChileEntity.Layout_Width;
//                                                };
//                                                if (fw.fwObject.FWObjectHelper.hasValue(ChileEntity.Layout_VerticalAlignment)) {
//                                                    OpenSettings.VerticalAlignment = ChileEntity.Layout_VerticalAlignment;
//                                                };
//                                                if (fw.fwObject.FWObjectHelper.hasValue(ChileEntity.Layout_Top)) {
//                                                    OpenSettings.Top = ChileEntity.Layout_Top;
//                                                };
//                                                if (fw.fwObject.FWObjectHelper.hasValue(ChileEntity.Layout_Bottom)) {
//                                                    OpenSettings.Bottom = ChileEntity.Layout_Bottom;
//                                                };
//                                                if (fw.fwObject.FWObjectHelper.hasValue(ChileEntity.Layout_Height)) {
//                                                    OpenSettings.Height = ChileEntity.Layout_Height;
//                                                };
//                                                if (fw.fwObject.FWObjectHelper.hasValue(OpenSettings.Width)) {
//                                                    if (OpenSettings.Width > jQueryExtension.ScreenWidth()) {
//                                                        OpenSettings.Width = jQueryExtension.ScreenWidth() - 22;
//                                                    };
//                                                };
//                                                if (fw.fwObject.FWObjectHelper.hasValue(OpenSettings.Height)) {
//                                                    if (OpenSettings.Height > jQueryExtension.ScreenHeight()) {
//                                                        OpenSettings.Height = jQueryExtension.ScreenHeight() - 22;
//                                                    };
//                                                };
//                                                if (ChileEntity.OpenTypeCode == "10") {
//                                                    API.Open(OpenSettings);
//                                                } else {
//                                                    jQueryExtension.Window.Open(OpenSettings);
//                                                };
//                                            };
//                                        });
//                                    };
//                                };
//                            });
//                        };
//                    });
//                };
//            };
//        });
//    };
//};