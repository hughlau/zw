$.fn.extend({
    LocatePointControl: function (Properties) {
        var Settings = {
            ArcGISWindow: null
            , ArcGISMap: null
        };
        $.extend(Settings, Properties);

        var SelectorJQ = $(this);
        if (fw.fwObject.FWObjectHelper.hasValue(Settings.ArcGISWindow) && fw.fwObject.FWObjectHelper.hasValue(Settings.ArcGISMap)) {

            SelectorJQ.each(function () {
                var SearchPointJQ = $(this);
                var ControlData = SearchPointJQ.data("ControlData");
                //判断MeasureControl有没缓存数据，有表示已经加载控件，无表示控件第一次加载
                if (!fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
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
                    };
                    if (ControlData.IsTouch) {
                        ControlData.IsTouchModel = true;
                    };
                    SearchPointJQ.empty().data("ControlData", ControlData);
                    if (SearchPointJQ.css("position").toLowerCase() != "absolute") {
                        SearchPointJQ.css("position", "relative");
                    };
                    var Html = "";
                    var background_color = "#666";
                    var border_color = "#000";
                    if (skin) {
                        background_color = "#5797D5";
                        border_color = "#E6E6E6";
                    }
                    Html += "<div class=\"jQE_Container_Absolute\">";
                    Html += "<div class=\"title\">";
                    Html += "<div class=\"title_tit\">定位</div>";
                    Html += "<div class=\"title_close\"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>"
                    Html += "</div>"
                    Html += "<div  id=\"SearchPoint\" class=\"jQE_Container_Content\" style=\" height:60px;text-align:center\">"
                    Html += "<div style='padding:10px 0 10px 0;'> 经度:<input id=\"PosX\" type=\"text\" style='width:80px;border:1px solid #5797d5;height:18px;'/>&nbsp;&nbsp;纬度:<input id=\"PosY\" type=\"text\" style='width:80px;border:1px solid #5797d5; height:18px;'/></div>";
                    Html += "<div ><input id=\"LocatePoint\" type=\"button\" style=\"border:1px solid  " + border_color + ";color:#fff;height:22px;cursor:pointer;border-radius:3px;width:50px; background:" + background_color + "\"  value=\"定位\" /><input id=\"ClearPoint\" type=\"button\" style=\"border:1px solid " + border_color + ";color:#fff;height:22px;cursor:pointer;border-radius:3px;width:50px; margin-left:20px;background:" + background_color + "\" value=\"清空\" /></div>";
                    Html += "</div>";
                    $(Html).appendTo(SearchPointJQ);

                    ControlData.ControlJQs.SearchPointJQ = SearchPointJQ.addClass('divArcGISLocateControl');
                    ControlData.ControlJQs.CloseJQ = $("div.title_close", ControlData.ControlJQs.SearchPointJQ);
                    ControlData.ControlJQs.LocatePointJQ = $("#LocatePoint", ControlData.ControlJQs.SearchPointJQ);
                    ControlData.ControlJQs.ClearPointJQ = $("#ClearPoint", ControlData.ControlJQs.SearchPointJQ)
                    //关闭
                    ControlData.ControlJQs.CloseJQ.bind("click", function (e) {
                        if (fw.fwObject.FWObjectHelper.hasValue(Settings.ArcGISWindow)) {
                            Settings.ArcGISWindow.ArcGISAPI.clearMapDrawGraphics();
                        }
                        ControlData.ControlJQs.SearchPointJQ.hide();
                    });
                    //定位
                    ControlData.ControlJQs.LocatePointJQ.bind("click", function () {
                        var PosX = $("#PosX").val();
                        var PosY = $("#PosY").val();
                        if (LocatePointLayer == null) {
                            LocatePointLayer = ArcGISAPI.getOrCreateLayer({ LayerName: "LocatePointLayer " });
                        }
                        //   LocatePointLayer.clear();
                        var symbol = new esri.symbol.PictureMarkerSymbol($.page.webSiteRootUrl + 'resources/scripts/fw.map/themes/default/images/LocatePoint.png', 24, 24);
                        var mapPoint = new esri.geometry.Point(PosX, PosY);
                        LocatePointLayer.add(new esri.Graphic(mapPoint, symbol));
                        ArcGIS_Map.setLevel(ZoomLevel + 2);
                        ArcGIS_Map.centerAt(mapPoint);
                    })
                    //清空
                    ControlData.ControlJQs.ClearPointJQ.bind("click", function () {
                        $("#PosX").val("");
                        $("#PosY").val("");
                        if (LocatePointLayer != null) {
                            LocatePointLayer.clear();
                        }

                    })

                } else {
                    ControlData.ControlJQs.IsInit = false;
                };
                SearchPointJQ.show();
            });

        };
        return SelectorJQ;
    }
});