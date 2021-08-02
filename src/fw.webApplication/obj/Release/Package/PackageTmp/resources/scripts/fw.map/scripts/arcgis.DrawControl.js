$.fn.extend({
    DrawControl: function (Properties) {
        var Settings = {
            ArcGISWindow: null
            , ArcGISMap: null
        };
        $.extend(Settings, Properties);

        var SelectorJQ = $(this);
        if (fw.fwObject.FWObjectHelper.hasValue(Settings.ArcGISWindow) && fw.fwObject.FWObjectHelper.hasValue(Settings.ArcGISMap)) {

            SelectorJQ.each(function () {
                var DrawControlJQ = $(this);
                var ControlData = DrawControlJQ.data("ControlData");
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
                    DrawControlJQ.empty().data("ControlData", ControlData);
                    if (DrawControlJQ.css("position").toLowerCase() != "absolute") {
                        DrawControlJQ.css("position", "relative");
                    };
                    var imgUrl = fw.fwUrl.FWUrlHelper.getAbsoluteUrl('resources/scripts/fw.map/themes/' + skin + '/images/', $.page.webSiteRootUrl);
                    var Html = "";
                    Html += "<div class=\"jQE_Container_Absolute\">";
                    Html += "<div class=\"title\">";
                    Html += "<div class=\"title_tit\">画图</div>";
                    Html += "<div class=\"title_close\"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>"
                    Html += "</div>"
                    Html += "<div id=\"DrawBtn\" class=\"serbtn\">";
                    Html += "<ul>";
                    Html += "<li><a href=\"javascript:void(0)\" id=\"aDrawPoint\" title=\"取点位经纬度\"><img src='" + imgUrl + "jingweidu.png'></a></li>";
                    Html += "<li><a href=\"javascript:void(0)\" id=\"aDrawPolyline\" title=\"画线\"><img src='" + imgUrl + "juli.png'></a></li>";
                    Html += "<li><a href=\"javascript:void(0)\" id=\"aDrawClear\" title=\"清空\" ><img src='" + imgUrl + "qingkong.png'></a></li>";
                    Html += "<li><a href=\"javascript:void(0)\" id=\"aDrawCopy\" title=\"复制\" ><img src='" + imgUrl + "cop.png'></a></li>";
                    //                    Html += "<li><a href=\"javascript:void(0)\" id=\"aDrawQuery\" title=\"查询\" ><img src=\"/resources/scripts/fw.map/themes/default/images/Search.png\"></a></li><br />";
                    //                    Html += "<li id=\"aLayerUrl\" style=\"display:none;\">图层地址:<input type=\"text\" id=\"LayerUrl\" style=\"width: 120px; height: 20px;text-align: left\" /></li><br />";
                    //                    Html += "<li id=\"aQueryLayer\" style=\"display:none;\">查询条件:<input type=\"text\" id=\"QueryWhere\" style=\"width: 80px; height: 20px;text-align:left\" /><button id=\"LayerQuery\" style=\"width: 60px\">查询</button></li>";
                    Html += "</ul>";
                    Html += "</div>";
                    Html += "<div  id=\"DrawResult\" class=\"jQE_Container_Content\" style=\"overflow-y:auto; overflow-x: hidden;height:160px\">"
                    Html += "</div>";
                    $(Html).appendTo(DrawControlJQ);

                    ControlData.ControlJQs.DrawControlJQ = DrawControlJQ.addClass('divArcGISDrawControl');
                    ControlData.ControlJQs.CloseJQ = $("div.title_close", ControlData.ControlJQs.DrawControlJQ);
                    ControlData.ControlJQs.PointJQ = $("#aDrawPoint");
                    ControlData.ControlJQs.JWDJQ = $("#aDrawPolyline");
                    ControlData.ControlJQs.ClearJQ = $("#aDrawClear");
                    ControlData.ControlJQs.CopyJQ = $("#aDrawCopy");
                    ControlData.ControlJQs.DrawQueryJQ = $("#aDrawQuery");
                    ControlData.ControlJQs.DivReultJQ = $("#DrawResult", ControlData.ControlJQs.DrawControlJQ);
                    //                    ControlData.ControlJQs.QueryLayerJQ = $("#aQueryLayer");
                    //                    ControlData.ControlJQs.LayerUrlJQ = $("#aLayerUrl");
                    //                    ControlData.ControlJQs.LayerQueryJQ = $("#LayerQuery");
                    //输入图层查询经纬度条件
                    var divState = false;
                    var CopyData = { Data: null, type: null };
                    ControlData.ControlJQs.DrawQueryJQ.bind("click", function () {
                        if (!divState) {
                            ControlData.ControlJQs.QueryLayerJQ.show();
                            ControlData.ControlJQs.LayerUrlJQ.show();
                            $("#DrawBtn").addClass("serbtn1");
                            $("#DrawResult").height("110px");
                            divState = true;
                        }
                        else {
                            ControlData.ControlJQs.QueryLayerJQ.hide();
                            ControlData.ControlJQs.LayerUrlJQ.hide();
                            $("#DrawBtn").removeClass("serbtn1").addClass("serbtn");
                            $("#DrawResult").height("160px");
                            divState = false;
                        }


                    });
                    //图层查询经纬度
                    //                    ControlData.ControlJQs.LayerQueryJQ.bind("click", function () {
                    //                        var LayerUrl = $("#LayerUrl").val();
                    //                        var QueryWhere = $("#QueryWhere").val();
                    //                        ControlData.ControlJQs.QueryLayerJQ.hide();
                    //                        ControlData.ControlJQs.LayerUrlJQ.hide();
                    //                        $("#DrawBtn").removeClass("serbtn1").addClass("serbtn");
                    //                        $("#DrawResult").height("160px");
                    //                        divState = false;
                    //                        if (!fw.fwObject.FWObjectHelper.hasValue(LayerUrl))
                    //                        { return; }
                    //                        CopyData = { Data: null, type: null };
                    //                        ControlData.ControlJQs.DivReultJQ.empty();
                    //                        var Settings = {
                    //                            QueryWhere: QueryWhere,
                    //                            LayerUrl: LayerUrl,
                    //                            Callback: function (results) {
                    //                                var ResultText = "X,Y<br/>";
                    //                                switch (results.geometryType) {
                    //                                    case "esriGeometryPolygon":
                    //                                        for (var i = 0; i < results.features.length; i++) {
                    //                                            var feature = results.features[i];
                    //                                            ResultText += i + "<br/>";
                    //                                            for (var k = 0; k < feature.geometry.rings.length; k++) {
                    //                                                var ring = feature.geometry.rings[k];
                    //                                                for (var j = 0; j < ring.length; j++) {
                    //                                                    ResultText += dojo.number.format(ring[j][0], { places: 6 }) + "," + dojo.number.format(ring[j][1], { places: 6 }) + "<br/>";
                    //                                                    ControlData.ControlJQs.DivReultJQ.html(ResultText);
                    //                                                }
                    //                                            }
                    //                                        }
                    //                                        CopyData.type = "POLYGON";
                    //                                        CopyData.Data = results;
                    //                                        CopyData.LayerUrl = true;
                    //                                        break;
                    //                                    case "esriGeometryPolyline":
                    //                                        for (var i = 0; i < results.features.length; i++) {
                    //                                            var feature = results.features[i];
                    //                                            ResultText += i + "<br/>";
                    //                                            for (var k = 0; k < feature.geometry.paths.length; k++) {
                    //                                                var path = feature.geometry.paths[k];
                    //                                                for (var j = 0; j < path.length; j++) {
                    //                                                    ResultText += dojo.number.format(path[j][0], { places: 6 }) + "," + dojo.number.format(path[j][1], { places: 6 }) + "<br/>";
                    //                                                    ControlData.ControlJQs.DivReultJQ.html(ResultText);
                    //                                                }
                    //                                            }
                    //                                        }
                    //                                        CopyData.type = "POLYLINE";
                    //                                        CopyData.Data = results;
                    //                                        CopyData.LayerUrl = true;
                    //                                        break;
                    //                                    case "esriGeometryPoint":
                    //                                        for (var i = 0; i < results.features.length; i++) {
                    //                                            var feature = results.features[i];
                    //                                            ResultText += dojo.number.format(feature.geometry.x, { places: 6 }) + "," + dojo.number.format(feature.geometry.y, { places: 6 }) + "<br/>";
                    //                                            ControlData.ControlJQs.DivReultJQ.html(ResultText);
                    //                                        }
                    //                                        CopyData.type = "POINT";
                    //                                        CopyData.Data = results;
                    //                                        CopyData.LayerUrl = true;
                    //                                        break;
                    //                                }
                    //                            }
                    //                        };
                    //                        QueryLayer(Settings);
                    //                    });
                    //复制
                    ControlData.ControlJQs.CopyJQ.bind("click", function () {
                        var CopyResult = "";
                        switch (CopyData.type) {
                            case "POINT":
                                if (CopyData.LayerUrl) {
                                    for (var i = 0; i < CopyData.Data.features.length; i++) {
                                        var feature = CopyData.Data.features[i];
                                        CopyResult += dojo.number.format(feature.geometry.x, { places: 6 }) + "," + dojo.number.format(feature.geometry.y, { places: 6 }) + "\r\n";
                                    }
                                }
                                else
                                { CopyResult = dojo.number.format(CopyData.Data.geometry.x, { places: 6 }) + "," + dojo.number.format(CopyData.Data.geometry.y, { places: 6 }); }
                                break;
                            case "POLYLINE":
                                CopyResult += "X,Y" + "\r\n";
                                if (CopyData.LayerUrl) {
                                    for (var i = 0; i < CopyData.Data.features.length; i++) {
                                        var feature = CopyData.Data.features[i];
                                        CopyResult += i + "\r\n";
                                        for (var k = 0; k < feature.geometry.paths.length; k++) {
                                            var path = feature.geometry.paths[k];
                                            for (var j = 0; j < path.length; j++) {
                                                CopyResult += dojo.number.format(path[j][0], { places: 6 }) + "," + dojo.number.format(path[j][1], { places: 6 }) + "\r\n";
                                            }
                                        }
                                    }
                                }
                                else {
                                    for (var i = 0; i < CopyData.Data.ResultText.length; i++) {
                                        CopyResult += CopyData.Data.ResultText[i] + "\r\n";
                                    };
                                }
                                break;
                            case "POLYGON":
                                CopyResult += "X,Y" + "\r\n";
                                if (CopyData.LayerUrl) {
                                    for (var i = 0; i < CopyData.Data.features.length; i++) {
                                        var feature = CopyData.Data.features[i];
                                        CopyResult += i + "\r\n";
                                        for (var k = 0; k < feature.geometry.rings.length; k++) {
                                            var ring = feature.geometry.rings[k];
                                            for (var j = 0; j < ring.length; j++) {
                                                CopyResult += dojo.number.format(ring[j][0], { places: 6 }) + "," + dojo.number.format(ring[j][1], { places: 6 }) + "\r\n";
                                            }
                                        }
                                    }
                                }
                                else {
                                }
                                break;
                        }

                        API.Copy(CopyResult);
                    });
                    //关闭
                    ControlData.ControlJQs.CloseJQ.bind("click", function (e) {
                        if (fw.fwObject.FWObjectHelper.hasValue(Settings.ArcGISWindow)) {
                            Settings.ArcGISWindow.ArcGISAPI.clearMapDrawGraphics();
                        }
                        ControlData.ControlJQs.DivReultJQ.empty();
                        ControlData.ControlJQs.DrawControlJQ.hide();
                    });
                    //清除
                    ControlData.ControlJQs.ClearJQ.bind("click", function (e) {
                        var IsClear = confirm("确定清空！");
                        if (IsClear) {
                            if (fw.fwObject.FWObjectHelper.hasValue(Settings.ArcGISWindow)) {

                                Settings.ArcGISWindow.ArcGISAPI.clearMapDrawGraphics();
                            }
                            ControlData.ControlJQs.DivReultJQ.empty();
                        }

                    });
                    //画点取经纬度
                    ControlData.ControlJQs.PointJQ.bind("click", function (e) {
                        if (fw.fwObject.FWObjectHelper.hasValue(Settings.ArcGISWindow)) {
                            // Settings.ArcGISWindow.ArcGISAPI.ClearMapDrawGraphics();
                            ControlData.ControlJQs.DivReultJQ.empty();
                        }
                        var Settings1 = {
                            MapDrawToolCode: "POINT"
                                    , CalcLength: "1"
                                    , ShowText: true
                                    , onCompletedEvent: function (data) {
                                        CopyData.Data = data;
                                        CopyData.type = "POINT";
                                        CopyData.LayerUrl = false;
                                        var ResultText = dojo.number.format(data.geometry.x, { places: 6 }) + "," + dojo.number.format(data.geometry.y, { places: 6 });
                                        ControlData.ControlJQs.DivReultJQ.html(ResultText);

                                    }
                        };
                        if (fw.fwObject.FWObjectHelper.hasValue(Settings.ArcGISWindow))
                            Settings.ArcGISWindow.ArcGISAPI.setMapDrawTool(Settings1);
                    });
                    //画线取经纬度
                    ControlData.ControlJQs.JWDJQ.bind("click", function (e) {
                        if (fw.fwObject.FWObjectHelper.hasValue(Settings.ArcGISWindow)) {
                            // Settings.ArcGISWindow.ArcGISAPI.ClearMapDrawGraphics();
                            ControlData.ControlJQs.DivReultJQ.empty();
                        }
                        var Settings1 = {
                            MapDrawToolCode: "POLYLINE"
                                    , CalcLength: "2"
                                    , ShowText: false
                                    , onCompletedEvent: function (data) {

                                        CopyData.Data = data;
                                        CopyData.type = "POLYLINE";
                                        CopyData.LayerUrl = false;
                                        var ResultText = "X,Y<br/>";
                                        for (var i = 0; i < data.ResultText.length; i++) {
                                            ResultText += data.ResultText[i] + "<br/>";
                                            ControlData.ControlJQs.DivReultJQ.html(ResultText);
                                        }
                                    }
                        };
                        if (fw.fwObject.FWObjectHelper.hasValue(Settings.ArcGISWindow))
                            Settings.ArcGISWindow.ArcGISAPI.setMapDrawTool(Settings1);
                    });

                } else {
                    ControlData.ControlJQs.IsInit = false;
                };
                DrawControlJQ.show();
            });

        };
        return SelectorJQ;
    }
});