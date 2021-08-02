
$.LayersControl = {
    _DefaultShowLayerNameArray: []
        , _DefaultLayerTypes: []
        , LayerSettings: function () {
            return {
                ParentLayerName: null
                , LayerName: null
                , LayerTitle: null
                , OnClick: null
                , OnComplete: null
                , Layers: []
            };
        }
        , LayerTypeSettings: function () {
            return {
                LayerTypeName: null
                , LayerTypeTitle: null
                , Width: 100
                , Layers: []
            };
        }
        , AddLayerTypes: function (Properties) {
            var Settings = {
                Selector: null
                , LayerType: null
                , LayerTypes: []
            };
            $.extend(Settings, Properties);

            if (!fw.fwObject.FWObjectHelper.hasValue(Settings.LayerTypes)) {
                Settings.LayerTypes = [];
            };
            if (fw.fwObject.FWObjectHelper.hasValue(Settings.LayerType)) {
                Settings.LayerTypes.push(Settings.LayerType);
            };

            for (var i = 0; i < Settings.LayerTypes.length; i++) {
                var LayerTypeSettings = $.LayersControl.LayerTypeSettings();
                $.extend(LayerTypeSettings, Settings.LayerTypes[i]);
                if (!fw.fwObject.FWObjectHelper.hasValue(LayerTypeSettings.LayerTypeName)) {
                    LayerTypeSettings.LayerTypeName = LayerTypeSettings.LayerTypeTitle;
                };
                Settings.LayerTypes[i] = LayerTypeSettings;
            };

            var SelectorJQ = $(Settings.Selector); //divArcGISLayersControl
            SelectorJQ.each(function () {
                var ControlData = $(this).data("ControlData");
                if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                    for (var i = 0; i < Settings.LayerTypes.length; i++) {
                        var LayerType = Settings.LayerTypes[i];
                        var liJQ = ControlData.ControlJQs.LiLayersTypeJQ.filter("[layertypename='" + LayerType.LayerTypeName + "']");
                        if (liJQ.length < 1) {
                            liJQ = $("<li layertypename=" + LayerType.LayerTypeName + ">" + LayerType.LayerTypeTitle + "</li>").appendTo(ControlData.ControlJQs.UlLayersTypeJQ);
                            var ulJQ = $("<ul layertypename=" + LayerType.LayerTypeName + "></ul>").addClass("ulLayersContent").data("ControlData", ControlData).appendTo(ControlData.ControlJQs.DivLayersContentJQ);
                            if (fw.fwObject.FWObjectHelper.hasValue(LayerType.Width)) {
                                ulJQ.width(LayerType.Width);
                            };

                            ControlData.ControlJQs.LiLayersTypeJQ = $(">li", ControlData.ControlJQs.UlLayersTypeJQ);
                            ControlData.ControlJQs.UlLayersContentJQ = $("ul.ulLayersContent", ControlData.ControlJQs.DivLayersContentJQ);
                            ControlData.ControlJQs.LiLayersTypeJQ.unbind("click").bind("click", function () {
                                ControlData.ControlJQs.UlLayersContentJQ.hide();
                                var thisJQ = $(this);
                                var Index = ControlData.ControlJQs.LiLayersTypeJQ.removeClass("Selected").index(thisJQ);
                                thisJQ.addClass("Selected");
                                ControlData.ControlJQs.UlLayersContentJQ.eq(Index).show();
                            });

                            var SelectedIndex = $.LayersControl.GetSelectedIndex({ Selector: this });
                            if (ControlData.ControlJQs.LiLayersTypeJQ.length > 0) {
                                if (SelectedIndex < 0) {
                                    SelectedIndex = 0;
                                }; if ((ControlData.ControlJQs.LiLayersTypeJQ.length - 1) < SelectedIndex) {
                                    SelectedIndex = ControlData.ControlJQs.LiLayersTypeJQ.length - 1;
                                };
                            } else {
                                SelectedIndex = -1;
                            };
                            ControlData.ControlJQs.LiLayersTypeJQ.eq(SelectedIndex).click();
                        };

                        if (fw.fwObject.FWObjectHelper.hasValue(LayerType.Layers)) {
                            $.LayersControl.AddLayers({
                                Selector: this
                                , LayerTypeName: LayerType.LayerTypeName
                                , Layers: LayerType.Layers
                            });
                        };
                    };
                };
            });
            return SelectorJQ;
        }
        , AddLayers: function (Properties) {
            var Settings = {
                Selector: null
                , LayerTypeName: null
                , LayerTypeTitle: null
                , Layer: null
                , Layers: []
            };
            $.extend(Settings, Properties);

            if (!fw.fwObject.FWObjectHelper.hasValue(Settings.Layers)) {
                Settings.Layers = [];
            };
            if (fw.fwObject.FWObjectHelper.hasValue(Settings.Layer)) {
                Settings.Layers.push(Settings.Layer);
            };

            for (var i = 0; i < Settings.Layers.length; i++) {
                var LayerSettings = $.LayersControl.LayerSettings();
                $.extend(LayerSettings, Settings.Layers[i]);
                if (!fw.fwObject.FWObjectHelper.hasValue(LayerSettings.LayerName)) {
                    LayerSettings.LayerName = LayerSettings.LayerTitle;
                };
                Settings.Layers[i] = LayerSettings;
            };

            var LayersContentJQ = $.LayersControl.GetLayersContentJQ(Settings);
            //这个if没进
            if (LayersContentJQ.length < 1) {
                $.LayersControl.AddLayerTypes({ Selector: Settings.Selector, LayerType: { LayerTypeName: Settings.LayerTypeName, LayerTypeTitle: Settings.LayerTypeTitle} });
                LayersContentJQ = $.LayersControl.GetLayersContentJQ(Settings);
            };
            if (LayersContentJQ.length > 0) {
                for (var i = 0; i < Settings.Layers.length; i++) {
                    var Layer = Settings.Layers[i];
                    var liJQ = $("li[layername='" + Layer.LayerName + "']", LayersContentJQ);
                    if (liJQ.length < 1) {
                        var ulJQ = null;
                        if (!fw.fwObject.FWObjectHelper.hasValue(Layer.ParentLayerName)) {
                            ulJQ = LayersContentJQ;
                        } else {
                            var ParentLiJQ = $("li[layername='" + Layer.ParentLayerName + "']", LayersContentJQ);
                            if (ParentLiJQ.length > 0) {
                                ulJQ = $(">ul", ParentLiJQ);
                                if (ulJQ.length < 1) {
                                    ulJQ = $("<ul></ul>").data("ControlData", LayersContentJQ.data("ControlData")).appendTo(ParentLiJQ);
                                };
                            };
                        };
                        if (ulJQ.length > 0) {
                            liJQ = $("<li title=" + Layer.LayerTitle + " layername=" + Layer.LayerName + "><div" + (!fw.fwObject.FWObjectHelper.hasValue(Layer.ImageUrl) ? " " : " src1=\"" + Layer.ImageUrl + "\"") + "><label class=\"labelCheckbox\"><input type=\"checkbox\" style=\"height:17px;\" />" + Layer.LayerTitle + "</label></div></li>").appendTo(ulJQ);
                        };
                    };

                    if (!fw.fwObject.FWObjectHelper.hasValue(Layer.OnClick)) {
                        Layer.OnClick = function (e, data, OnComplete) {
                            if ($(e.currentTarget).is(":checked")) {
                                if (fw.fwObject.FWObjectHelper.hasValue(data.Layer.LayerType)
                                && data.Layer.LayerType == "Map") {
                                    try {
                                        data.ArcGISWindow.ArcGISAPI.addMapService(data.Layer);
                                    } catch (ex) { };
                                } else {
                                    try {
                                        data.ArcGISWindow.ArcGISAPI.showDynamicLayer(data.Layer);
                                    } catch (ex) { };
                                };
                            } else {
                                if (fw.fwObject.FWObjectHelper.hasValue(data.Layer.LayerType)
                                && data.Layer.LayerType == "Map") {
                                    try {
                                        data.ArcGISWindow.ArcGISAPI.removeMapService(data.Layer);
                                    } catch (ex) { };
                                } else {
                                    try {
                                        data.ArcGISWindow.ArcGISAPI.businessLayerHide(data.Layer);
                                    } catch (ex) { };
                                };
                            };
                        };
                    };
                    $(">div>label>input:checkbox", liJQ).data("Layer", Layer).data("OnClick", Layer.OnClick).data("OnComplete", Layer.OnComplete).unbind("click").bind("click", function (e) {
                        var thisJQ = $(this);
                        if ($.isFunction(thisJQ.data("OnClick"))) {
                            var Layer = thisJQ.data("Layer");
                            var ControlData = thisJQ.parent().parent().parent().parent().data("ControlData");
                            thisJQ.data("OnClick")(e, { ArcGISWindow: ControlData.Settings.ArcGISWindow, ArcGISMap: ControlData.Settings.ArcGISMap, Layer: Layer }, thisJQ.data("OnComplete"));
                        };
                        var IsChecked = thisJQ.is(":checked");
                        var ChildCheckboxJQ = thisJQ.parent().parent().parent().find(">ul>li>div>label>input:checkbox");
                        if (IsChecked) { ChildCheckboxJQ.attr("checked", "checked"); } else { ChildCheckboxJQ.removeAttr("checked"); };
                        ChildCheckboxJQ.each(function () {
                            $(this).triggerHandler("click");
                        });
                    });

                    if (fw.fwObject.FWObjectHelper.hasValue(Layer.Layers)) {
                        for (var j = 0; j < Layer.Layers.length; j++) {
                            Layer.Layers[j].ParentLayerName = Layer.LayerName;
                        };
                        $.LayersControl.AddLayers({
                            Selector: Settings.Selector
                            , LayerTypeName: Settings.LayerTypeName
                            , LayerTypeTitle: Settings.LayerTypeTitle
                            , Layers: Layer.Layers
                        });
                    };
                };
                LayersContentJQ.TreeView({
                    IsShowFolder: false
                    , IsShowFile: false
                    , NodeEvent: false
                    , NodeUnique: false
                    , IsCloseAll: false
                });
            };

        }
        , GetSelectedIndex: function (Properties) {
            var Settings = {
                Selector: null
            };
            $.extend(Settings, Properties);
            var SelectedIndex = -1;
            var ControlData = $(Settings.Selector).data("ControlData");
            if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                var LiLayersTypeJQ = ControlData.ControlJQs.LiLayersTypeJQ.filter(".Selected");
                SelectedIndex = ControlData.ControlJQs.LiLayersTypeJQ.index(LiLayersTypeJQ);
            };
            return SelectedIndex;
        }
        , GetLayersContentJQ: function (Properties) {
            var Settings = {
                Selector: null
                , LayerTypeName: null
            };
            $.extend(Settings, Properties);

            return $("ul[layertypename='" + Settings.LayerTypeName + "']", Settings.Selector);
        }
        , Empty: function (Properties) {
            var Settings = {
                Selector: null
            };
            $.extend(Settings, Properties);

            $(Settings.Selector).removeData("ControlData").empty().LayersControl();
        }
        , SetLayerEvent: function (Properties) {
            var Settings = {
                Selector: null
                , LayerName: null
                , OnClick: null
                , OnComplete: null
            };
            $.extend(Settings, Properties);

            var liJQ = $("li[layername='" + Settings.LayerName + "']", Settings.Selector);
            if ($.isFunction(Settings.OnClick)) {
                $(">div>label>input:checkbox", liJQ).data("OnClick", Settings.OnClick).data("OnComplete", Settings.OnComplete).unbind("click").bind("click", function (e) {
                    var thisJQ = $(this);
                    if ($.isFunction(thisJQ.data("OnClick"))) {
                        var Layer = thisJQ.data("Layer");
                        var ControlData = thisJQ.parent().parent().parent().parent().data("ControlData");
                        thisJQ.data("OnClick")(e, { ArcGISWindow: ControlData.Settings.ArcGISWindow, ArcGISMap: ControlData.Settings.ArcGISMap, Layer: Layer }, thisJQ.data("OnComplete"));
                    };
                    var IsChecked = thisJQ.is(":checked");
                    var ChildCheckboxJQ = thisJQ.parent().parent().parent().find(">ul>li>div>label>input:checkbox");
                    if (IsChecked) { ChildCheckboxJQ.attr("checked", "checked"); } else { ChildCheckboxJQ.removeAttr("checked"); };
                    ChildCheckboxJQ.triggerHandler("click");
                });
            };
        }
        , RemoveLayers: function (Properties) {
            var Settings = {
                Selector: null
                , LayerNameArray: null
            };
            $.extend(Settings, Properties);

            if (fw.fwObject.FWObjectHelper.hasValue(Settings.LayerNameArray)) {
                $(Settings.Selector).each(function () {
                    var ControlData = $(this).data("ControlData");
                    if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                        $(">li", ControlData.ControlJQs.UlLayersContentJQ).each(function () {
                            var liJQ = $(this);
                            if (Settings.LayerNameArray.Contains(liJQ.attr("layername"))) {
                                liJQ.remove();
                            };
                        });
                        ControlData.ControlJQs.UlLayersContentJQ.each(function (i) {
                            var ulJQ = $(this);
                            var liJQ = $(">li:first", ulJQ);
                            if (liJQ.length < 1) {
                                ControlData.ControlJQs.LiLayersTypeJQ.eq(i).remove();
                                ulJQ.remove();
                            };
                        });
                        ControlData.ControlJQs.LiLayersTypeJQ = $(">li", ControlData.ControlJQs.UlLayersTypeJQ);
                        ControlData.ControlJQs.UlLayersContentJQ = $("ul.ulLayersContent", ControlData.ControlJQs.DivLayersContentJQ);

                        ControlData.ControlJQs.UlLayersContentJQ.TreeView({
                            IsShowFolder: false
                            , IsShowFile: false
                            , NodeEvent: false
                            , NodeUnique: false
                            , IsCloseAll: false
                        });

                        var SelectedIndex = $.LayersControl.GetSelectedIndex({ Selector: this });
                        if (ControlData.ControlJQs.LiLayersTypeJQ.length > 0) {
                            if (SelectedIndex < 0) {
                                SelectedIndex = 0;
                            }; if ((ControlData.ControlJQs.LiLayersTypeJQ.length - 1) < SelectedIndex) {
                                SelectedIndex = ControlData.ControlJQs.LiLayersTypeJQ.length - 1;
                            };
                        } else {
                            SelectedIndex = -1;
                        };
                        ControlData.ControlJQs.LiLayersTypeJQ.eq(SelectedIndex).click();
                    };
                });
            };
        }
        , RemoveOtherLayers: function (Properties) {
            var Settings = {
                Selector: null
                , LayerNameArray: null
            };
            $.extend(Settings, Properties);

            if (fw.fwObject.FWObjectHelper.hasValue(Settings.LayerNameArray)) {
                $(Settings.Selector).each(function () {
                    var ControlData = $(this).data("ControlData");
                    if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                        $("li", ControlData.ControlJQs.UlLayersContentJQ).each(function () {
                            var liJQ = $(this);
                            if (!Settings.LayerNameArray.Contains(liJQ.attr("layername"))) {
                                liJQ.remove();
                            };
                        });
                        ControlData.ControlJQs.UlLayersContentJQ.each(function (i) {
                            var ulJQ = $(this);
                            var liJQ = $(">li:first", ulJQ);
                            if (liJQ.length < 1) {
                                ControlData.ControlJQs.LiLayersTypeJQ.eq(i).remove();
                                ulJQ.remove();
                            };
                        });
                        ControlData.ControlJQs.LiLayersTypeJQ = $(">li", ControlData.ControlJQs.UlLayersTypeJQ);
                        ControlData.ControlJQs.UlLayersContentJQ = $("ul.ulLayersContent", ControlData.ControlJQs.DivLayersContentJQ);

                        ControlData.ControlJQs.UlLayersContentJQ.TreeView({
                            IsShowFolder: false
                            , IsShowFile: false
                            , NodeEvent: false
                            , NodeUnique: false
                            , IsCloseAll: false
                        });

                        var SelectedIndex = $.LayersControl.GetSelectedIndex({ Selector: this });
                        if (ControlData.ControlJQs.LiLayersTypeJQ.length > 0) {
                            if (SelectedIndex < 0) {
                                SelectedIndex = 0;
                            }; if ((ControlData.ControlJQs.LiLayersTypeJQ.length - 1) < SelectedIndex) {
                                SelectedIndex = ControlData.ControlJQs.LiLayersTypeJQ.length - 1;
                            };
                        } else {
                            SelectedIndex = -1;
                        };
                        ControlData.ControlJQs.LiLayersTypeJQ.eq(SelectedIndex).click();
                    };
                });
            };
        }
        , SetLayerChecked: function (Properties) {
            var Settings = {
                Selector: null
                , LayerName: null
                , IsChecked: true
                , IsTriggerHandler: true
            };
            $.extend(Settings, Properties);

            if (fw.fwObject.FWObjectHelper.hasValue(Settings.LayerName)) {
                $(Settings.Selector).each(function () {
                    var ControlData = $(this).data("ControlData");
                    if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                        var checkboxJQ = $("li[layername='" + Settings.LayerName + "']>div>label>input:checkbox", ControlData.ControlJQs.UlLayersContentJQ);
                        if (Settings.IsChecked) {
                            checkboxJQ.attr("checked", "checked");
                        } else {
                            checkboxJQ.removeAttr("checked");
                        };
                        if (Settings.IsTriggerHandler) {
                            checkboxJQ.triggerHandler("click");
                        };
                    };
                });
            };
        }
        , GetLayerSettings: function (Properties) {
            var Settings = {
                Selector: null
                , LayerName: null
            };
            $.extend(Settings, Properties);

            var LayerSettings = null;
            if (fw.fwObject.FWObjectHelper.hasValue(Settings.LayerName)) {
                $(Settings.Selector).each(function () {
                    var ControlData = $(this).data("ControlData");
                    if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                        LayerSettings = $("li[layername='" + Settings.LayerName + "']>div>label>input:checkbox", ControlData.ControlJQs.UlLayersContentJQ).data("Layer");
                    };
                });
            };
            return LayerSettings;
        }
};
$.fn.extend({
    LayersControl: function (Properties) {
        var Settings = {
            ArcGISWindow: null
                    , ArcGISMap: null
                    , LayerTypes: $.LayersControl._DefaultLayerTypes
                    , ShowLayerNameArray: null
        };
        $.extend(Settings, Properties); //此处的Properities是从首页中的
        //divArcGISLayersControlJQ.LayersControl({ArcGISWindow：API.ArcGISAPI.ArcGISWindow
        // , ArcGISMap: API.ArcGISAPI.ArcGISMap
        //  });传过来的
        //此处Settings的值已有
        if (!fw.fwObject.FWObjectHelper.hasValue(Settings.ShowLayerNameArray)) {
            Settings.ShowLayerNameArray = $.LayersControl._DefaultShowLayerNameArray;
        };

        this.each(function () {
            var LayersControlJQ = $(this); //LayersControlJQ=$("#divArcGISLayersControl")
            var ControlData = LayersControlJQ.data("ControlData");

            //判断LayersControl有没缓存数据，有表示已经加载控件，无表示控件第一次加载
            if (!fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                ControlData = {
                    IsTouch: jQueryExtension.IsTouch()
                            , IsTouchModel: (fw.fwObject.FWObjectHelper.hasValue(fw.fwCookie.FWCookieHelper("IsTouchModel"))&&(fw.fwCookie.FWCookieHelper("IsTouchModel").toLowerCase() == "true" || fw.fwCookie.FWCookieHelper("IsTouchModel").toLowerCase() == "1"))
                            , ControlJQs: {
                                IsInit: true
                            }
                            , IsResize: false
                };
                if (ControlData.IsTouch) {
                    ControlData.IsTouchModel = true;
                };
                LayersControlJQ.data("ControlData", ControlData).empty();
                if (LayersControlJQ.css("position").toLowerCase() != "absolute") {
                    LayersControlJQ.css("position", "relative");
                };

                var WindowGuid = fw.guid();
                var Html = "";
                Html += "<div class=\"jQE_Container_Absolute\">";
                Html += "    <div class=\"divLayers\">";
                Html += "        <div class=\"divLayersImage\" title='图层'></div>";
                Html += "    </div>";
                Html += "    <div class=\"divLayersMenu divArcGISControl\">";
                Html += "        <table class=\"tableLayersMenu\">";
                Html += "            <tr>";
                Html += "                <td style=\"vertical-align: top;\">";
                Html += "                    <div class=\"divLayersType\">";
                Html += "                        <ul class=\"ulLayersType\"></ul>";
                Html += "                    </div>";
                Html += "                </td>";
                Html += "                <td class=\"tdCenter\"></td>";
                Html += "                <td style=\"vertical-align: top;\">";
                Html += "                    <div class=\"divLayersContent\"></div>";
                Html += "                </td>";
                Html += "            </tr>";
                Html += "        </table>";
                Html += "    </div>";
                Html += "</div>";
                $(Html).appendTo(LayersControlJQ); 

                ControlData.ControlJQs.LayersControlJQ = LayersControlJQ.addClass('divArcGISLayersControl');
                ControlData.ControlJQs.LayersJQ = $("div.divLayers", ControlData.ControlJQs.LayersControlJQ);
                ControlData.ControlJQs.LayersImageJQ = $("div.divLayersImage", ControlData.ControlJQs.LayersJQ);

                ControlData.ControlJQs.LayersMenuJQ = $("div.divLayersMenu", ControlData.ControlJQs.LayersControlJQ);
                ControlData.ControlJQs.DivLayersTypeJQ = $("div.divLayersType", ControlData.ControlJQs.LayersMenuJQ);
                ControlData.ControlJQs.UlLayersTypeJQ = $("ul.ulLayersType", ControlData.ControlJQs.DivLayersTypeJQ);
                ControlData.ControlJQs.LiLayersTypeJQ = $(">li", ControlData.ControlJQs.UlLayersTypeJQ);
                ControlData.ControlJQs.DivLayersContentJQ = $("div.divLayersContent", ControlData.ControlJQs.LayersMenuJQ);
                ControlData.ControlJQs.UlLayersContentJQ = $("ul.ulLayersContent", ControlData.ControlJQs.DivLayersContentJQ);

                ControlData.ControlJQs.LayersImageJQ.bind("click", function () {
                    if (ControlData.ControlJQs.LayersMenuJQ.is(":hidden")) {
                        $("div.divArcGISControl").hide();
                        ControlData.ControlJQs.LayersMenuJQ.show();
                    } else {
                        ControlData.ControlJQs.LayersMenuJQ.hide();
                    };
                });
            } else {
                ControlData.ControlJQs.IsInit = false;
            };
            //此处是关键，ControlData.Settings取值
            ControlData.Settings = Settings;
            //此处开始传AddLayerTypes的Properity的参数
            $.LayersControl.AddLayerTypes({
                Selector: LayersControlJQ
                        , LayerTypes: Settings.LayerTypes
            });

            $.LayersControl.RemoveOtherLayers({
                Selector: LayersControlJQ
                        , LayerNameArray: Settings.ShowLayerNameArray
            });

        });
        return this;
    }
        , SearchLayerShow: function (Properties) {
            var Settings = {
                ArcGISWindow: null
            , ArcGISMap: null
            , Title: null
            , BussinessType: null
            , EntityList: null
            };
            $.extend(Settings, Properties);
            var GridViewSettings = null;
            var GridViewSettingsEnt = null;
            var SelectorJQ = $(this);
            if (fw.fwObject.FWObjectHelper.hasValue(Settings.ArcGISWindow) && fw.fwObject.FWObjectHelper.hasValue(Settings.ArcGISMap)) {
                SelectorJQ.each(function () {
                    var SearchPollutantCantonJQ = $(this);
                    var ControlData = SearchPollutantCantonJQ.data("ControlData");
                    //判断SearchPollutantCanton有没缓存数据，有表示已经加载控件，无表示控件第一次加载
                    if (!fw.fwObject.FWObjectHelper.hasValue(ControlData) || Settings.BussinessType != ControlData.BussinessType) {
                        ControlData = {
                            IsTouch: jQueryExtension.IsTouch()
                            , IsTouchModel: (fw.fwObject.FWObjectHelper.hasValue(fw.fwCookie.FWCookieHelper("IsTouchModel"))&&(fw.fwCookie.FWCookieHelper("IsTouchModel").toLowerCase() == "true" || fw.fwCookie.FWCookieHelper("IsTouchModel").toLowerCase() == "1"))
                            , ScrollLeft: 0
                            , ScrollTop: 0
                            , ControlJQs: {
                                IsInit: true
                            }
                            , IsResize: false
                            , MapCurrentLevel: -1
                            , BussinessType: Settings.BussinessType
                        };
                        if (ControlData.IsTouch) {
                            ControlData.IsTouchModel = true;
                        };
                        SearchPollutantCantonJQ.empty().data("ControlData", ControlData);

                        if (SearchPollutantCantonJQ.css("position").toLowerCase() != "absolute") {
                            SearchPollutantCantonJQ.css("position", "relative");

                        };
                        var Html = "";
                        Html += "<div class=\"jQE_Container_Absolute\">";
                        Html += "<div class=\"title\">";
                        Html += "<div class=\"title_tit\">" + Settings.Title + "</div>";
                        Html += "<div class=\"title_close\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>";
                        Html += "</div>";


                        Html += "<div  style=\"height:30px;line-height:30px;\"><span >&nbsp&nbsp名称：</span><input id=\"SearchDataTxt\" type=\"text\" style=\"width:100px;\"/>";
                        Html += "&nbsp<button id=\"SearchDataBtn\" style=\"height:25px;line-height:20px;width:50px;\">搜索</button></div>";

                        Html += "<div id=\"SearchLayerSeachResult\"></div>";
                        Html += "</div>";

                        $(Html).appendTo(SearchPollutantCantonJQ);

                        ControlData.ControlJQs.SearchPollutantCantonJQ = SearchPollutantCantonJQ;
                        ControlData.ControlJQs.CloseJQ = $("div.title_close", ControlData.ControlJQs.SearchPollutantCantonJQ);
                        ControlData.ControlJQs.SearchLayerSeachResultJQ = $("#SearchLayerSeachResult");
                        ControlData.ControlJQs.selectSearchLayerFactorJQ = $("#selectSearchLayerFactor");
                        ControlData.ControlJQs.ComplexSelectDateJQ = $("#Complex_selectDate");
                        ControlData.ControlJQs.SearchDataTxtJQ = $("#SearchDataTxt");
                        ControlData.ControlJQs.SearchDataBtnJQ = $("#SearchDataBtn");

                        var GridViewSettingsEnt = null;
                        //搜索
                        ControlData.ControlJQs.SearchDataBtnJQ.bind("click", function (e) {
                            var thisJQ = ControlData.ControlJQs.SearchDataTxtJQ;
                            var KeyWord = $.trim(thisJQ.val());
                            var SelectEntityLst = [];
                            if (!fw.fwObject.FWObjectHelper.hasValue(thisJQ.data("EntityList"))) {
                                thisJQ.data("EntityList", Settings.EntityList);
                                SearchDataEntityList = Settings.EntityList;
                            };
                            if (KeyWord == "") {
                                SelectEntityLst = SearchDataEntityList;

                            } else {
                                for (var i = 0; i < SearchDataEntityList.length; i++) {
                                    if (fw.fwObject.FWObjectHelper.hasValue(SearchDataEntityList[i].Name)) {
                                        if (SearchDataEntityList[i].Name.indexOf($.trim(KeyWord)) >= 0) {
                                            SelectEntityLst.push(SearchDataEntityList[i]);
                                        };
                                    }
                                };
                            };
                            Settings.EntityList = SelectEntityLst;
                            GridVeiwEnt(Settings.BussinessType);
                        });
                        //关闭
                        ControlData.ControlJQs.CloseJQ.bind("click", function (e) {
                            if (fw.fwObject.FWObjectHelper.hasValue(Settings.ArcGISWindow)) {
                                Settings.ArcGISWindow.ArcGISAPI.clearMapDrawGraphics();
                            }
                            ControlData.ControlJQs.SearchPollutantCantonJQ.hide();
                        });




                    } else {

                        ControlData.ControlJQs.IsInit = false;
                    };
                    if (Settings.EntityList != null) {
                        GridVeiwEnt(Settings.BussinessType);
                    }
                    SearchPollutantCantonJQ.show();
                    function GridVeiwEnt(BusessType) {
                        var url = $.page.webSiteRootUrl;
                        switch (BusessType) {
                            case "ImportantEnt":
                                url += "";
                                GridViewSettingsEnt = {
                                    IsShowSelectedArrowhead: false,
                                    AllowSelectedFirstRow: false,
                                    IsShowFoot: false,
                                    ColumnList: [
                                         { HeadText: "企业名称", DataField: 'QYMC', Width: 120, IsLock: false }
                                     , { HeadText: "类别", DataField: 'HYLBMC', Width: 120, IsLock: false }
                              , { HeadText: "COD排放量", DataField: 'COD_t_', Width: 120, IsLock: false }
                               , { HeadText: "氨氮排放量", DataField: 'NH3_N_t_', Width: 80, IsLock: false }
                               , { HeadText: "总氮排放量", DataField: 'TN_t_', Width: 100, IsLock: false }
                                , { HeadText: "总磷排放量", DataField: 'TP_t_', Width: 100, IsLock: false }
                              ]
                            , BodyRowFunction: function (Entity) {
                                var Objects = [];

                                var divJQ = $("<div></div>");
                                $("<a></a>").html(Entity.QYMC).addClass("classLink").bind("click", function () {

                                    var Settings1 = {
                                        PosX: 0
                                    , PosY: 0
                                    , LayerName: "ImportantEnt"
                                    , BusinessCode: Entity.QYMC
                                    , LayerKeyFieldName: "QYMC"
                                    , ZoomScale: 0
                                    , ZoomLevel: ZoomLevel
                                    , FlashTime: 10000 //毫秒
                                    };
                                    ArcGISAPI.zoomToPoint(Settings1);
                                }).appendTo(divJQ);

                                Objects.push(divJQ);
                                Objects.push(Entity.HYLBMC);
                                Objects.push(Entity.COD_t_);
                                Objects.push(Entity.NH3_N_t_);
                                Objects.push(Entity.TN_t_);
                                Objects.push(Entity.TP_t_);
                                return Objects;


                            }
                            , OnDataBound: function () {
                                $.GridView.ResizeWidthHeight({
                                    Selector: ControlData.ControlJQs.SearchLayerSeachResultJQ
                                   , Width: null
                                   , Height: 150
                                });
                            }
                             , OnSelectedIndexChanging: function (Entity, NewSelectedIndex) {

                             }
                                };
                                break;
                        }
                        ControlData.ControlJQs.SearchLayerSeachResultJQ.GridView_Init(GridViewSettingsEnt);
                        GridViewSettingsEnt.DataSource = Settings.EntityList;
                        ControlData.ControlJQs.SearchLayerSeachResultJQ.GridView(GridViewSettingsEnt);
                    }
                });
            };
            return SelectorJQ;
        }
    //弹出框(加载页面)
         , PopUpFrameBoxShow: function (Properties) {
             var Settings = {
                 ArcGISWindow: null
            , ArcGISMap: null
            , Title: null
            , BussinessType: null
            , EntityList: null
             };
             $.extend(Settings, Properties);
             var SelectorJQ = $(this);
             if (fw.fwObject.FWObjectHelper.hasValue(Settings.ArcGISWindow) && fw.fwObject.FWObjectHelper.hasValue(Settings.ArcGISMap)) {
                 SelectorJQ.each(function () {
                     var PopUpBoxJQ = $(this);
                     var ControlData = PopUpBoxJQ.data("ControlData");
                     //判断SearchPollutantCanton有没缓存数据，有表示已经加载控件，无表示控件第一次加载

                     ControlData = {
                         IsTouch: jQueryExtension.IsTouch(),
                         IsTouchModel: (fw.fwObject.FWObjectHelper.hasValue(fw.fwCookie.FWCookieHelper("IsTouchModel"))&&(fw.fwCookie.FWCookieHelper("IsTouchModel").toLowerCase() == "true" || fw.fwCookie.FWCookieHelper("IsTouchModel").toLowerCase() == "1")),
                         ScrollLeft: 0,
                         ScrollTop: 0,
                         ControlJQs: {
                             IsInit: true
                         },
                         IsResize: false,
                         MapCurrentLevel: -1
                     };
                     if (ControlData.IsTouch) {
                         ControlData.IsTouchModel = true;
                     }
                     ;
                     PopUpBoxJQ.empty().data("ControlData", ControlData);

                     if (PopUpBoxJQ.css("position").toLowerCase() != "absolute") {
                         PopUpBoxJQ.css("position", "relative");

                     }
                     ;
                     //大小与位置
                     PopUpBoxJQ.width(Settings.Width);
                     PopUpBoxJQ.height(Settings.Height);
                     for (var key in Settings.Position) {
                         PopUpBoxJQ.css(key, Settings.Position[key]);
                     }


                     var Html = "";
                     Html += "<div id=\"jQE_Container_Absolute_" + Settings.Title + "\">";
                     Html += "<div class=\"title\">";
                     Html += "<div class=\"title_tit\">" + Settings.Title + "</div>";

                     Html += "<div title='关闭' class=\"title_close\"></div>";
                     if(Settings.Title=="污水处理净化槽列表"){
                        Html += "<div title='最小化' class=\"title_min\"></div>";
                     }                     
                     Html += "</div>";
                     Html += "<div><iframe  id=\"myFrameJQ_" + Settings.Title + "\" width=\"100%\" ></iframe></div>";
                     Html += "</div>";



                     $(Html).appendTo(PopUpBoxJQ);

                     ControlData.ControlJQs.PopUpBoxJQ = PopUpBoxJQ;
                     ControlData.ControlJQs.DragJQ = $("#jQE_Container_Absolute_" + Settings.Title);
                     ControlData.ControlJQs.CloseJQ = $("div.title_close", ControlData.ControlJQs.PopUpBoxJQ);
                     ControlData.ControlJQs.MinJQ = $("div.title_min", ControlData.ControlJQs.PopUpBoxJQ);
                     ControlData.ControlJQs.SearchJQ = $("#divPopUpFrameBoxSearch");
                     ControlData.ControlJQs.FrameJQ = $("#myFrameJQ_" + Settings.Title);
                     ControlData.ControlJQs.SmallToolsControls = $(".smallToolsControls");
                     ////add by wangyang 20171020 
                     if(Settings.Title=="工程列表"){
                        $('#divPopUpFrameBox').css('top','')
                     }   
                     //绑定鼠标拖动
                     jQueryExtension.targetMoveHandle(ControlData.ControlJQs.DragJQ, ControlData.ControlJQs.PopUpBoxJQ);


                     //关闭
                     ControlData.ControlJQs.CloseJQ.bind("click", function (e) {
                         if (fw.fwObject.FWObjectHelper.hasValue(Settings.ArcGISWindow)) {
                             Settings.ArcGISWindow.ArcGISAPI.clearMapDrawGraphics();
                         }
                         //add by wangyang 20171020 
                        if(Settings.Title=="工程列表"){
                            isHomeInitShow = true;
                        }  
                         ControlData.ControlJQs.PopUpBoxJQ.hide();
                         
                     });

                     //最小化
                     ControlData.ControlJQs.MinJQ.bind("click", function () {
                         ControlData.ControlJQs.PopUpBoxJQ.slideLeftHide(300, function () {
                             if(ControlData.ControlJQs.SearchJQ[0].style.display=='none'){
                             ControlData.ControlJQs.SmallToolsControls.width(parseFloat(ControlData.ControlJQs.SmallToolsControls.width())+40+'px');
                             ControlData.ControlJQs.SearchJQ.show();  
                             }
                             
                         });
                     });

                     //搜索
                     // ControlData.ControlJQs.SearchJQ.bind("click", function () {
                     //     ControlData.ControlJQs.PopUpBoxJQ.slideLeftShow(300, function () {  
                     //     var  a=  parseFloat(ControlData.ControlJQs.SmallToolsControls.width())-40  
                     //     ControlData.ControlJQs.SearchJQ.hide();
                     //     if(ControlData.ControlJQs.SearchJQ.is(":hidden")){
                     //         ControlData.ControlJQs.SmallToolsControls.width(a)

                     //     }                      
                             
                     //     });
                     // });
                     ControlData.ControlJQs.SearchJQ[0].onclick=function(){
                        ControlData.ControlJQs.PopUpBoxJQ.slideLeftShow(300, function () {  
                            var  a=  parseFloat(ControlData.ControlJQs.SmallToolsControls.width())-40 
                            ControlData.ControlJQs.SearchJQ.hide();
                            if(ControlData.ControlJQs.SearchJQ.is(":hidden")){
                                ControlData.ControlJQs.SmallToolsControls.width(a)
                            }  

                        });
                     }
                     //搜索的鼠标移入 
                     ControlData.ControlJQs.SearchJQ.on('mouseenter',function(){
                         ControlData.ControlJQs.SearchJQ.css('background-image','url(/resources/scripts/fw.map/themes/blue/images/search_hover.png)')     
                     })
                     ControlData.ControlJQs.SearchJQ.on('mouseleave',function(){
                         ControlData.ControlJQs.SearchJQ.css('background-image','url(/resources/scripts/fw.map/themes/blue/images/search.png)')     
                     })
                     //加载页面
                     var param = "";
                     if (fw.fwObject.FWObjectHelper.hasValue(Settings.Data)) {
                         param = "?";
                         for (var key in Settings.Data) {
                             param += key + "=" + Settings.Data[key] + "&";
                         }
                         ;
                         param = jQueryExtension.ToStringWithOutEndChar(param, "&");
                     }
                     ;
                     if (fw.fwObject.FWObjectHelper.hasValue(param)) {
                         ControlData.ControlJQs.FrameJQ.attr("src", Settings.Url + param);
                     } else {
                         ControlData.ControlJQs.FrameJQ.attr("src", Settings.Url);
                     }
                     ;


                     ControlData.ControlJQs.FrameJQ.height(Settings.Height - 30);


                     PopUpBoxJQ.show();

                 });
             }
             ;
             return SelectorJQ;
         }
});

$.LayersControl._DefaultLayerTypes = LayersControlDataSource;

