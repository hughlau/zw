dojo.require("dojox.lang.functional");
dojo.require("dojox.lang.functional.lambda");
dojo.require("dojox.lang.functional.curry");
dojo.require("dojox.lang.functional.fold");
var ClusterGraphic = null;
var ClusterGraphicSet = [];
var ClusterPoint = [];
var text = 0;
dojo.declare('esri.ux.layers.ClusterLayer', esri.layers.GraphicsLayer, {


    constructor: function (options) {
        //basic esri.layers.GraphicsLayer option(s)
        this.displayOnPan = options.displayOnPan || false;

        //set the map
        //TODO: find a way to not pass in the map as a config option.
        this._map = options.map;


        //base connections to update clusters during user/map interaction
        dojo.connect(this._map, 'onZoomStart', dojo.hitch(this, this.handleMapZoomStart));
        dojo.connect(this._map, 'onExtentChange', dojo.hitch(this, this.handleMapExtentChange));

        //        dojo.connect(ArcGIS_Map.infoWindow, "onMouseLeave", function () {
        //            ArcGIS_Map.infoWindow.hide();
        //        });
        //may or may not be needed. not sure
        //this.spatialReference = new esri.SpatialReference({ wkid: 102100 });
        this.spatialReference = options.map.spatialReference;
        //        this.initialExtent = (
        //    			this.fullExtent = new esri.geometry.Extent(-20037507.0671618, -19971868.8804086, 20037507.0671618, 19971868.8804086, this.spatialReference)
        //    		);
        this.initialExtent = options.map.extent;
        //this could be moved to sit within a function
        this.levelPointTileSpace = [];

        //holds all the features for this cluster layer
        this._features = [];
        this._settings = options.LayerService;
        //set incoming features
        //this will throw an error if the features WKID is not in below list.  
        //projected: 102100, 102113
        //geographic: 4326, 4269, 4267
        //TODO: add more supported WKIDs?  read what the map WKID is and only allow that?
        //TODO: throw error and NOT continue to add layer to map.  right now, if error is thrown, an empty graphics layer will be added to the map
        try {
            if (options.features.length > 0) {
                this.setFeatures(options.features);
            };
        } catch (ex) {
            alert(ex);
        }

        //connects for cluster layer itself that handles the loading and mouse events on the graphics
        dojo.connect(this, 'onLoad', this.handleLayerLoaded);
        dojo.connect(this, 'onMouseOver', this.handleMouseOver);
        dojo.connect(this, 'onMouseOut', this.handleMouseOut);

        //BUG:Chrome中Click事件不是每次点击都执行的
        //dojo.connect(this, 'onClick', this.handleClick);
        dojo.connect(this, 'onMouseDown', this.handleClick);
        //default symbol bank for clusters and single graphics
        //TODO: allow for user supplied symbol bank to override.  just use an ESRI renderer somehow?

        this._ClusterItemList = options.LayerService.ClusterItemList;

        this.symbolBank = {};
        try {

            this.setsymbolBank(this._ClusterItemList);

        }
        catch (ex) {
            this.symbolBank = {
                "single": new esri.symbol.SimpleMarkerSymbol(
                            esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
                            10,
                            new esri.symbol.SimpleLineSymbol(
                                    esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                                    new dojo.Color([0, 0, 0, 1]),
                                    1
                                ),
                            new dojo.Color([255, 215, 0, 1])),
                "less16": new esri.symbol.SimpleMarkerSymbol(
                            esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
                            20,
                            new esri.symbol.SimpleLineSymbol(
                                    esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                                    new dojo.Color([0, 0, 0, 1]),
                                    1
                                ),
                            new dojo.Color([255, 215, 0, 1])),
                "less30": new esri.symbol.SimpleMarkerSymbol(
                            esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
                            30,
                            new esri.symbol.SimpleLineSymbol(
                                    esri.symbol.SimpleLineSymbol.STYLE_NULL,
                                    new dojo.Color([0, 0, 0, 0]),
                                    1
                                ),
                            new dojo.Color([100, 149, 237, .85])),
                "less50": new esri.symbol.SimpleMarkerSymbol(
                            esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
                            30,
                            new esri.symbol.SimpleLineSymbol(
                                    esri.symbol.SimpleLineSymbol.STYLE_NULL,
                                    new dojo.Color([0, 0, 0, 0]),
                                    1
                                ),
                            new dojo.Color([65, 105, 225, .85])),
                "over50": new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 45,
                       new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_NULL,
                       new dojo.Color([0, 0, 0]), 0),
                       new dojo.Color([255, 69, 0, 0.65]))
            };
        }

        //how far away the flare will be from the center of the cluster in pixels - Number
        this._flareDistanceFromCenter = options.flareDistanceFromCenter || 20;

        //the number of flare graphics to limit the cluster to - Number
        this._flareLimit = options.flareLimit || 20;

        //info template for all single graphics and flare graphics - esri.InfoTemplate
        this._infoTemplate = options.infoWindow.template || null;

        //info window width - Number
        this._infoWindowWidth = options.infoWindow.width || 150;

        //info window height - Number
        this._infoWindowHeight = options.infoWindow.height || 100;

        //following the basics of creating a custom layer
        this.loaded = true;
        this.onLoad(this);
    },


    //clear all graphics when zoom starts
    handleMapZoomStart: function () {
        this.clear();
    },

    //re-cluster on extent change
    //TODO: maybe only use features that fall within current extent?  Add that as an option?
    handleMapExtentChange: function (extent, delta, leveChange, lod) {
        this.clusterFeatures();
    },

    //this function may not be needed exactly as is below.  somehow, the attributes need to be mapped to the points.
    setFeatures: function (features) {
        this._features = [];
        var wkid = features[0].geometry.spatialReference.wkid;
        //if (wkid != 102100) {
        if (1 != 1) {
            if (wkid == 4326 || wkid == 4269 || wkid == 4267) {
                dojo.forEach(features, function (feature) {
                    point = esri.geometry.geographicToWebMercator(feature.geometry);
                    point.attributes = feature.attributes;

                    this._features.push(point);
                }, this);
            } else {
                throw 'Input Spatial Reference Must Be in Either WKID: 102110 or WKID: 4326';
                return;
            }
        } else {
            dojo.forEach(features, function (feature) {
                point = feature.geometry;
                point.attributes = feature.attributes;
                //                var f = parseInt(Math.random() * 100000000 + 1) / 100000000 / 100000000;
                //                point.x += f;
                //                point.y += f;
                this._features.push(point);

            }, this);
        }
    },

    setsymbolBank: function (arClusterItemList) {
        this.symbolBank = {};
        dojo.forEach(arClusterItemList, function (ClusterItem) {
            this.symbolBank[ClusterItem.Key] = new esri.symbol.SimpleMarkerSymbol(
                                        esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
                                        ClusterItem.Size,
                                        new esri.symbol.SimpleLineSymbol(
                                                esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                                                new dojo.Color([0, 0, 0, 1]),
                                                1
                                            ),
                                        new dojo.Color(ClusterItem.Color));
            //            this.symbolBank[ClusterItem.Key] = new esri.symbol.PictureMarkerSymbol($.page.webSiteRootUrl + "Web/maps/Images/symbols/污水处理设施.png", ClusterItem.Size, ClusterItem.Size);
        }, this);

        //       this.symbolBank = {
        //            "single": new esri.symbol.SimpleMarkerSymbol(
        //                            esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
        //                            10,
        //                            new esri.symbol.SimpleLineSymbol(
        //                                    esri.symbol.SimpleLineSymbol.STYLE_SOLID,
        //                                    new dojo.Color([0, 0, 0, 1]),
        //                                    1
        //                                ),
        //                            new dojo.Color([255, 215, 0, 1])),
        //            "less16": new esri.symbol.SimpleMarkerSymbol(
        //                            esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
        //                            20,
        //                            new esri.symbol.SimpleLineSymbol(
        //                                    esri.symbol.SimpleLineSymbol.STYLE_SOLID,
        //                                    new dojo.Color([0, 0, 0, 1]),
        //                                    1
        //                                ),
        //                            new dojo.Color([255, 215, 0, 1])),
        //            "less30": new esri.symbol.SimpleMarkerSymbol(
        //                            esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
        //                            30,
        //                            new esri.symbol.SimpleLineSymbol(
        //                                    esri.symbol.SimpleLineSymbol.STYLE_NULL,
        //                                    new dojo.Color([0, 0, 0, 0]),
        //                                    1
        //                                ),
        //                            new dojo.Color([100, 149, 237, .85])),
        //            "less50": new esri.symbol.SimpleMarkerSymbol(
        //                            esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
        //                            30,
        //                            new esri.symbol.SimpleLineSymbol(
        //                                    esri.symbol.SimpleLineSymbol.STYLE_NULL,
        //                                    new dojo.Color([0, 0, 0, 0]),
        //                                    1
        //                                ),
        //                            new dojo.Color([65, 105, 225, .85])),
        //            "over50": new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 45,
        //                       new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_NULL,
        //                       new dojo.Color([0, 0, 0]), 0),
        //                       new dojo.Color([255, 69, 0, 0.65]))
        //        };
    },

    //fires when cluster layer is loaded, but not added to map yet.
    handleLayerLoaded: function (lyr) {
        this.clusterFeatures();
    },
    handleClick: function (evt) {
        var graphic = null;
        ClusterPoint = [];
        if (!fw.fwObject.FWObjectHelper.hasValue(evt.graphic)) {
            evt.graphic = evt;
            graphic = evt.graphic;
        }
        else { graphic = evt.graphic; }
        if (!fw.fwObject.FWObjectHelper.hasValue(graphic.symbol)) {
            return;
        }
        else {
            if (graphic.symbol.type == 'textsymbol' || graphic.symbol.type == 'simplelinesymbol') {
                if (graphic.attributes) {
                    if (graphic.attributes.baseGraphic && graphic.attributes.baseGraphic.task) {
                        graphic.attributes.baseGraphic.task.cancel();
                    }
                }
                return;
            }
        }


        graphic.clusterGraphics = [];

        var cSize = graphic.attributes.clusterSize;
        var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0, 1]), 1);

        //polyline used to "tie" flare to cluster
        //set up initially with the center pt of the cluster as the first point and a dummy point @ 0,0 for a placeholder
        var map = ArcGIS_Map;
        var line = new esri.geometry.Polyline(map.spatialReference);
        line.addPath([graphic.geometry, new esri.geometry.Point(0, 0)]);

        //polyline graphic
        var lineGraphic = new esri.Graphic(line, lineSymbol);

        //creating a circle to evenly distribute our flare graphics around
        if (cSize > 0) {  //cSize > 1 may not be needed
            //takes the number of points (flares) for the cluster

            var numPoints = graphic.attributes.clusterSize;

            //takes the pixel distance from the center of the graphic to flare out the graphics
            var bufferDistance = cL.getPixelDistanceFromCenter(graphic.geometry);

            //center of cluster graphic
            var centerPoint = graphic.geometry;

            //variables used to plot points evenly around the cluster
            var dblSinus, dblCosinus, x, y, pt, ptGraphic, p, l;

            for (var i = 0; i < numPoints; i++) {
                dblSinus = Math.sin((Math.PI * 2.0) * (i / numPoints));
                dblCosinus = Math.cos((Math.PI * 2.0) * (i / numPoints));

                x = centerPoint.x + bufferDistance * dblCosinus;
                y = centerPoint.y + bufferDistance * dblSinus;

                //constructing the flare graphic point
                pt = new esri.geometry.Point(x, y, map.spatialReference);

                ptGraphic = new esri.Graphic(pt, cL.symbolBank.single, dojo.mixin(graphic.attributes[i], { baseGraphic: graphic }), cL._infoTemplate);
                //try to always bring flare graphic to front of everything else
                p = cL.add(ptGraphic);
                // p.getDojoShape().moveToFront();
                //reset our 0,0 placeholder point in line to the actual point of the recently created flare graphic
                line.setPoint(0, 1, pt);
                lineGraphic = new esri.Graphic(line, lineSymbol, { baseGraphic: graphic });

                //try to always have connector line behind everything else
                l = cL.add(lineGraphic);
                l.getDojoShape().moveToBack();
                //store flare graphic and connector graphic
                graphic.clusterGraphics.push(p);
                graphic.clusterGraphics.push(l);
                ClusterPoint.push(ptGraphic);
            }
            //set "clustered" flag
            graphic.attributes.clustered = true;
        }
        else {
            var divJQ = null;
            var Width = 300;
            var divJQ = $("<div class=\"divMapInfoWindowContent\"></div>").width(Width).appendTo("body");
            var divInfoJQ = $("<div class=\"divInfo\"></div>").appendTo(divJQ);

            //            var Settings = this._settings;
            //            if (fw.fwObject.FWObjectHelper.hasValue(Settings.InfoWindowSettings)
            //                        && fw.fwObject.FWObjectHelper.hasValue(Settings.InfoWindowSettings.FieldArray)) {
            var BodyHtml = "";
            //                var bShowDetail = false;
            //                if (fw.fwObject.FWObjectHelper.hasValue(Settings.InfoWindowSettings.DetailUrl)
            //                            && Settings.InfoWindowSettings.DetailUrl != "") {
            //                    bShowDetail = true;
            //                }
            //                var ParameterS = "";
            //                for (var i = 0; i < Settings.InfoWindowSettings.FieldArray.length; i++) {
            //                    var Entity = Settings.InfoWindowSettings.FieldArray[i];
            //                    if (fw.fwObject.FWObjectHelper.hasValue(Entity.IsTitle) && Entity.IsTitle) {
            //                        TitleHtml += "<b>" + graphic.attributes[Entity.FieldName] + "</b>";
            //                    }
            //                    if (fw.fwObject.FWObjectHelper.hasValue(Entity.IsShow) && Entity.IsShow) {
            //                        var sTitle = Entity.FieldName;
            //                        if (fw.fwObject.FWObjectHelper.hasValue(Entity.ShowName) && Entity.ShowName != "") {
            //                            sTitle = Entity.ShowName;
            //                        }

            //                        //BodyHtml += "<tr><td>" + sTitle + ":  </td><td>" + graphic.attributes[Entity.FieldName] + "</td></tr>";

            //                    }
            //                    if (bShowDetail) {
            //                        if (fw.fwObject.FWObjectHelper.hasValue(Entity.IsParameter) && Entity.IsParameter) {
            //                            var sTitle = graphic.attributes[Entity.FieldName];
            //                            if (fw.fwObject.FWObjectHelper.hasValue(Entity.ParameterName) && Entity.ParameterName != "") {
            //                                sTitle = graphic.attributes[Entity.ParameterName];
            //                            }
            //                            if (ParameterS == "") {
            //                                ParameterS = "?" + sTitle + "=" + Entity.FieldName;
            //                            } else {
            //                                ParameterS += "&" + sTitle + "=" + Entity.FieldName;
            //                            }
            //                        }
            //                    }
            //                }
            BodyHtml += "<table><tr><td>设施编号:  32058101400</td><td>状态：正常</td></tr>";
            BodyHtml += "<tr><td>安装地点：董浜镇 新民村</td><td><div id='divDetailInfo' class=\"divDetailInfo\" style='margin:5px;'></div></td></tr></table>";
            var BodyHtml2 = "";
            BodyHtml2 += "<table><tr><td colspan='2'><div class='jQueryExtension_UI_GridView'  style='background:#000000;' ><div class='jQueryExtension_UI_GridView_DivBody'><table id='GridView_TableBody_Scroll__2015825145753588100000015' class='jQueryExtension_UI_GridView_TableBody' cellspacing='1' style='background:#a0a1a3;' cellpadding='1' border='1'><thead id='GridView_TheadHead_Scroll__2015825145753588100000015' class='jQueryExtension_UI_GridView_TheadHead'><tr style='background:#fff;' id='GridView_TrHead_Scroll__2015825145753588100000015' class='jQueryExtension_UI_GridView_TrHead' style='height: 28px; background-position: 0px 0%;'><th class='jQueryExtension_UI_GridView_TrHead_ThHead'><div class='jQueryExtension_UI_GridView_TrHead_ThHead_DivHead' style='width: 90px; text-align: center;'><a>监测因子</a></div><div class='jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnSet jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnSetHover jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnSet_ColumnSet'></div><div class='jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnResize'></div></th><th class='jQueryExtension_UI_GridView_TrHead_ThHead'><div class='jQueryExtension_UI_GridView_TrHead_ThHead_DivHead' style='width: 50px; text-align: center;'><a>状态</a></div><div class='jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnSet'></div><div class='jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnResize'></div></th><th class='jQueryExtension_UI_GridView_TrHead_ThHead'><div class='jQueryExtension_UI_GridView_TrHead_ThHead_DivHead' style='width: 100px; text-align: center;'><a>数值</a></div><div class='jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnSet'></div><div class='jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnResize'></div></th><th class='jQueryExtension_UI_GridView_TrHead_ThHead'><div class='jQueryExtension_UI_GridView_TrHead_ThHead_DivHead' style='width: 80px; text-align: center;'><a>监测时间</a></div><div class='jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnSet'></div><div class='jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnResize'></div></th></tr></thead><tbody id='GridView_TbodyBody_Scroll__2015825145753588100000015' class='jQueryExtension_UI_GridView_TbodyBody'><tr style='background:#fff;' class='jQueryExtension_UI_GridView_TbodyBody_TrRow jQueryExtension_UI_GridView_TbodyBody_TrRowOdd' style='height: 29px;'><td class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow'><div class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRow' style='width: 90px; text-align: center;'><div title='编号：CSDBZ_S0001'>COD</div></div></td><td class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow'><div class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRow' style='width: 50px; text-align: center;'><div style='width:60px;height:20px;background-color:#ffff00;'></div></div></td><td class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow'><div class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRow' style='width: 100px; text-align: center;'><div title='上限阈值：25000,下限阈值：0'>10mg/l</div></div></td><td class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow'><div class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRow' style='width: 80px; text-align: center;'><a><div class='classNumber divMonitorTime div-131Days' title='2015-04-16 03:37:54' style='float:center;text-align:center;'>2015-04-16</div></a></div></td></tr><tr style='background:#fff;' class='jQueryExtension_UI_GridView_TbodyBody_TrRow jQueryExtension_UI_GridView_TbodyBody_TrRowAlternating' style='height: 29px;'><td class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow'><div class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRow' style='width: 90px; text-align: center;'><div title='编号：CSDBZ_S0002'>温度</div></div></td><td class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow'><div class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRow' style='width: 50px; text-align: center;'><div style='width:60px;height:20px;background-color:#ffff00;'></div></div></td><td class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow'><div class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRow' style='width: 100px; text-align: center;'><div title='上限阈值：35,下限阈值：5'>50℃</div></div></td><td class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow'><div class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRow' style='width: 80px; text-align: center;'><a><div class='classNumber divMonitorTime div-130Days' title='2015-04-17 12:43:35' style='float:center;text-align:center;'>2015-04-17</div></a></div></td></tr><tr style='background:#fff;' class='jQueryExtension_UI_GridView_TbodyBody_TrRow jQueryExtension_UI_GridView_TbodyBody_TrRowOdd' style='height: 29px;'><td class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow'><div class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRow' style='width: 90px; text-align: center;'><div title='编号：CSDBZ_S0003'>BOD</div></div></td><td class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow'><div class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRow' style='width: 50px; text-align: center;'><div style='width:60px;height:20px;background-color:#ffff00;'></div></div></td><td class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow'><div class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRow' style='width: 100px; text-align: center;'><div title='上限阈值：80,下限阈值：15'>10mg/l</div></div></td><td class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow'><div class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRow' style='width: 80px; text-align: center;'><a><div class='classNumber divMonitorTime div-130Days' title='2015-04-17 12:43:39' style='float:center;text-align:center;'>2015-04-17</div></a></div></td></tr><tr style='background:#fff;' class='jQueryExtension_UI_GridView_TbodyBody_TrRow jQueryExtension_UI_GridView_TbodyBody_TrRowAlternating' style='height: 29px;'><td class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow'><div class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRow' style='width: 90px; text-align: center;'><div title='编号：CSDBZ_S0004'>PH</div></div></td><td class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow'><div class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRow' style='width: 50px; text-align: center;'><div style='width:60px;height:20px;background-color:#ffff00;'></div></div></td><td class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow'><div class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRow' style='width: 100px; text-align: center;'><div title='上限阈值：2000,下限阈值：1'>7</div></div></td><td class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow'><div class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRow' style='width: 80px; text-align: center;'><a><div class='classNumber divMonitorTime div-130Days' title='2015-04-17 12:43:44' style='float:center;text-align:center;'>2015-04-17</div></a></div></td></tr><tr style='background:#fff;' class='jQueryExtension_UI_GridView_TbodyBody_TrRow jQueryExtension_UI_GridView_TbodyBody_TrRowOdd' style='height: 29px;'><td class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow'><div class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRow' style='width: 90px; text-align: center;'><div title='编号：CSDBZ_S0005'>SS</div></div></td><td class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow'><div class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRow' style='width: 50px; text-align: center;'><div style='width:60px;height:20px;background-color:#ffff00;'></div></div></td><td class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow'><div class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRow' style='width: 100px; text-align: center;'><div title='上限阈值：40,下限阈值：0'>240mg/l</div></div></td><td class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow'><div class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRow' style='width: 80px; text-align: center;'><a><div class='classNumber divMonitorTime div-130Days' title='2015-04-17 12:43:48' style='float:center;text-align:center;'>2015-04-17</div></a></div></td></tr><tr style='background:#fff;' class='jQueryExtension_UI_GridView_TbodyBody_TrRow jQueryExtension_UI_GridView_TbodyBody_TrRowAlternating' style='height: 29px;'><td class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow'><div class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRow' style='width: 90px; text-align: center;'><div title='编号：CSDBZ_S0009'>电导率</div></div></td><td class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow'><div class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRow' style='width: 50px; text-align: center;'><div style='width:60px;height:20px;background-color:#ffff00;'></div></div></td><td class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow'><div class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRow' style='width: 100px; text-align: center;'><div title='上限阈值：40,下限阈值：0'>2μS/cm</div></div></td><td class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow'><div class='jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRow' style='width: 80px; text-align: center;'><a><div class='classNumber divMonitorTime div-131Days' title='2015-04-16 03:38:15' style='float:center;text-align:center;'>2015-04-16</div></a></div></td></tr></tbody></table></div></div></td></tr>";

            //                var sUrl = GetAbsoluteUrl(Settings.InfoWindowSettings.DetailUrl, $.page.webSiteRootUrl) + ParameterS;



            $(BodyHtml).appendTo(divInfoJQ);
            var divDetailInfoJQ = $(".divDetailInfo");
            divDetailInfoJQ.click(function () {
                mini.open({
                    url: window.webSiteRootUrl + "web/basicInfo/monitorSiteDetail.htm",
                    title: ("设施点位详情信息"), width: 1000, height: 500,
                    allowResize: true
                });
            });
            var Settings2 = {
                Title: "梅李镇污水处理设施-01",
                domNode: divJQ[0],
                Width: divJQ.outerWidth() + 20,
                Height: divJQ.outerHeight() + 10,
                evt: graphic
            };

            API.ArcGISAPI.mapInfoWindowShow(Settings2);
            API.ArcGISAPI.zoomToPoint({ PosX: graphic.geometry.x, PosY: graphic.geometry.y, ZoomLevel: 0 });
            //            }



        }
        ;
    },
    //fires when any graphic (clustered or single) is moused over
    handleMouseOver: function (evt) {
        var graphic = evt.graphic;
        if (graphic.symbol.type == 'textsymbol' || graphic.symbol.type == 'simplelinesymbol') {
            if (graphic.attributes) {
                if (graphic.attributes.baseGraphic && graphic.attributes.baseGraphic.task) {
                    graphic.attributes.baseGraphic.task.cancel();
                }
            }
            return;
        }
        if (graphic.attributes.isCluster) { //cluster mouse over
            if (graphic.attributes.clustered) {
                if (graphic.task) {
                    graphic.task.cancel();
                }
                return;
            }
        } else { //single marker or cluster flare mouse over
            if (graphic.attributes.baseGraphic && fw.fwObject.FWObjectHelper.hasValue(graphic.attributes.baseGraphic.task)) { //cluster flare
                graphic.attributes.baseGraphic.task.cancel();
            }
            //  this.showInfoWindow(graphic);
            return;
        }

        graphic.clusterGraphics = [];

        var cSize = graphic.attributes.clusterSize;
        var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0, 1]), 1);

        //polyline used to "tie" flare to cluster
        //set up initially with the center pt of the cluster as the first point and a dummy point @ 0,0 for a placeholder
        var line = new esri.geometry.Polyline();
        line.addPath([graphic.geometry, new esri.geometry.Point(0, 0)]);

        //polyline graphic
        var lineGraphic = new esri.Graphic(line, lineSymbol);

        //creating a circle to evenly distribute our flare graphics around
        if (cSize > 1 && cSize <= this._flareLimit) {  //cSize > 1 may not be needed
            //takes the number of points (flares) for the cluster
            var numPoints = graphic.attributes.clusterSize;

            //takes the pixel distance from the center of the graphic to flare out the graphics
            var bufferDistance = this.getPixelDistanceFromCenter(graphic.geometry);

            //center of cluster graphic
            var centerPoint = graphic.geometry;

            //variables used to plot points evenly around the cluster
            var dblSinus, dblCosinus, x, y, pt, ptGraphic, p, l;

            for (var i = 0; i < numPoints; i++) {
                dblSinus = Math.sin((Math.PI * 2.0) * (i / numPoints));
                dblCosinus = Math.cos((Math.PI * 2.0) * (i / numPoints));

                x = centerPoint.x + bufferDistance * dblCosinus;
                y = centerPoint.y + bufferDistance * dblSinus;

                //constructing the flare graphic point
                pt = new esri.geometry.Point(x, y, this._map.spatialReference)
                ptGraphic = new esri.Graphic(pt, this.symbolBank.single, dojo.mixin(graphic.attributes[i], { baseGraphic: graphic }), this._infoTemplate);

                //try to always bring flare graphic to front of everything else
                p = this.add(ptGraphic);
                p.getDojoShape().moveToFront();

                //reset our 0,0 placeholder point in line to the actual point of the recently created flare graphic
                line.setPoint(0, 1, pt);
                lineGraphic = new esri.Graphic(line, lineSymbol, { baseGraphic: graphic });

                //try to always have connector line behind everything else
                l = this.add(lineGraphic);
                l.getDojoShape().moveToBack();

                //store flare graphic and connector graphic
                graphic.clusterGraphics.push(p);
                graphic.clusterGraphics.push(l);
            }
            //set "clustered" flag
            graphic.attributes.clustered = true;
        }
    },

    //helper method to figure out the distance in real world coordinates starting from a center pt and using a pixel distance
    getPixelDistanceFromCenter: function (centerGeom) {
        var distance = this._flareDistanceFromCenter;  //pixel distance from center
        var screenGeom = esri.geometry.toScreenGeometry(this._map.extent, this._map.width, this._map.height, centerGeom);
        screenGeom.x = screenGeom.x + distance;
        screenGeom.y = screenGeom.y + distance;
        var newDistance = esri.geometry.toMapGeometry(this._map.extent, this._map.width, this._map.height, screenGeom);
        var length = esri.geometry.getLength(centerGeom, newDistance);
        return length;
    },

    //fires when any cluster graphic (flare or individual) is moused out of
    //this utilizes the DelayedTask from ExtJS's library.  If anyone wants to re-write using Dojo, by all means...
    handleMouseOut: function (evt) {
        var graphic = evt.graphic,
            task;

        if (graphic.symbol.type == 'textsymbol') {
            return;
        }

        if (graphic.attributes.isCluster) {
            task = new DelayedTask(function (g) {
                this.removeFlareGraphics(g.clusterGraphics);
                delete g.clusterGraphics;
                g.attributes.clustered = false;
            }, this, [graphic]);
            task.delay(800);
            graphic.task = task;
        } else {
            if (graphic.attributes.baseGraphic) { //cluster flare
                task = new DelayedTask(function (g) {
                    this.removeFlareGraphics(g.attributes.baseGraphic.clusterGraphics);
                    delete g.attributes.baseGraphic.clusterGraphics;
                    g.attributes.baseGraphic.attributes.clustered = false;
                }, this, [graphic]);
                task.delay(800);
                graphic.attributes.baseGraphic.task = task;
            }
            if (ArcGIS_Map.infoWindow.isShowing) {
                // dojo.connect(ArcGIS_Map.infoWindow, "onMouseOut", function () { ArcGIS_Map.infoWindow.hide(); }); 

                //ArcGIS_Map.infoWindow.hide();
            }
        }
    },

    //removes the flare graphics from the map when a cluster graphic is moused out
    removeFlareGraphics: function (graphics) {
        if (graphics && graphics.length) {
            for (var i = 0; i < graphics.length; i++) {
                this.remove(graphics[i]);
            }
        }
    },

    //shows info window for specified graphic
    showInfoWindow: function (graphic) {
        //        if (ArcGIS_Map.infoWindow.isShowing) {
        //            ArcGIS_Map.infoWindow.hide();
        //        }

        //        ArcGIS_Map.infoWindow.setContent(graphic.getContent());
        //        ArcGIS_Map.infoWindow.setTitle(graphic.getTitle());
        //        ArcGIS_Map.infoWindow.resize(this._infoWindowWidth, this._infoWindowHeight);
        //        var graphicCenterSP = esri.geometry.toScreenGeometry(this._map.extent, this._map.width, this._map.height, graphic.geometry);
        //        ArcGIS_Map.infoWindow.show(graphicCenterSP, ArcGIS_Map.getInfoWindowAnchor(graphicCenterSP));
        SelPointfeature = graphic;
        var content = graphic.getContent();
        dialog.setContent(content);
        dojo.style(dialog.domNode, "opacity", 0.85);
        var graphicCenterSP = esri.geometry.toScreenGeometry(this._map.extent, this._map.width, this._map.height, graphic.geometry);
        //dijit.popup.open({ popup: dialog, x: graphic.pageX - graphic.offsetX, y: graphic.pageY - graphic.offsetY });
        dijit.popup.open({ popup: dialog, x: graphicCenterSP.x - 10, y: graphicCenterSP.y - 10 });
    },

    GetsymbolBankSys: function (pointCount) {
        if (this._ClusterItemList == null || this._ClusterItemList == undefined) return null;
        for (var i = 0; i < this._ClusterItemList.length; i++) {
            var ClusterItem = this._ClusterItemList[i];
            if (pointCount >= ClusterItem.MinValue && pointCount <= ClusterItem.MaxValue) {
                return this.symbolBank[ClusterItem.Key];
                break;
            }
        }

    },
    //core clustering function
    //right now, the clustering algorithim is based on the baseMap's tiling scheme (layerIds[0]).  as the comment says below, this can probably be substituted with an origin, array of grid pixel resolution & grid pixel size.
    //could probably be cleaned up and compacted a bit more.
    clusterFeatures: function (redraw) {
        ClusterGraphicSet = [];
        this.clear();
        var df = dojox.lang.functional,
            map = (this._map == null ? ArcGIS_Map : this._map),
            level = map.getLevel() + 2,
            extent = map.extent;

        var tileInfo = map.getLayer(map.layerIds[0]).tileInfo;  //get current tiling scheme.  This restriction can be removed.  the only thing required is origin, array of grid pixel resolution, & grid pixel size

        var toTileSpaceF = df.lambda("point, tileWidth,tileHeight,oPoint "
            + "-> [Math.floor((oPoint.y - point.y)/tileHeight),Math.floor((point.x-oPoint.x)/tileWidth), point]");  //lambda function to map points to tile space
        if (level >= tileInfo.lods.length)
            level = tileInfo.lods.length - 1;
        var levelResolution = tileInfo.lods[level].resolution;
        var width = levelResolution * tileInfo.width;
        var height = levelResolution * tileInfo.height;

        var toTileSpace = df.partial(toTileSpaceF, df.arg, width, height, tileInfo.origin);  //predefine width, height, origin point for toTileSpaceF function
        var extentTileCords = df.map([new esri.geometry.Point(extent.xmin, extent.ymin), new esri.geometry.Point(extent.xmax, extent.ymax)], toTileSpace);  //map extent corners to tile sapce
        var minRowIdx = extentTileCords[1][0];
        var maxRowIdx = extentTileCords[0][0];
        var minColIdx = extentTileCords[0][1];
        var maxColIdx = extentTileCords[1][1];

        //points to tiles
        if (!this.levelPointTileSpace[level] || redraw) {
            var pointsTileSpace = df.map(this._features, toTileSpace);  //map all points to tilespace
            var tileSpaceArray = [];
            dojo.forEach(pointsTileSpace, function (tilePoint, ptIndex) {  //swizel points[row,col,point] to row[col[points[]]]
                if (tileSpaceArray[tilePoint[0]]) {
                    var y = tileSpaceArray[tilePoint[0]];
                    if (y[tilePoint[1]]) {
                        y[tilePoint[1]].push(tilePoint[2]);
                    } else {
                        y[tilePoint[1]] = tilePoint[1];
                        y[tilePoint[1]] = [tilePoint[2]];
                    }
                } else {
                    var y = tileSpaceArray[tilePoint[0]] = [];
                    y[tilePoint[1]] = tilePoint[1];
                    y[tilePoint[1]] = [tilePoint[2]];
                }
            });
            this.levelPointTileSpace[level] = tileSpaceArray;  //once this has been computed store this in a level array
        }
        var tileCenterPointF = df.lambda("cPt,nextPt->{x:(cPt.x+nextPt.x)/2,y:(cPt.y+nextPt.y)/2}");

        dojo.forEach(this.levelPointTileSpace[level], function (row, rowIndex) {
            if ((rowIndex >= minRowIdx) & (rowIndex <= maxRowIdx)) {
                dojo.forEach(row, function (col, colIndex) {
                    if (col) {
                        if ((colIndex >= minColIdx) & (colIndex <= maxColIdx)) {
                            var pointsToBeAdded = [];
                            if (col.length >= 2) { //clustered graphic

                                var tileCenterPoint = df.reduce(col, tileCenterPointF);

                                var sym = this.GetsymbolBankSys(col.length);
                                //                                if (col.length <= 15) {
                                //                                    sym = this.symbolBank.less16;
                                //                                } else if (col.length > 15 && col.length <= 30) {
                                //                                    sym = this.symbolBank.less30;
                                //                                } else if (col.length > 30 && col.length <= 50) {
                                //                                    sym = this.symbolBank.less50;
                                //                                } else {
                                //                                    sym = this.symbolBank.over50;
                                //                                }

                                //get attributes for info window
                                var atts = dojo.map(col, function (item) {
                                    return item.attributes;
                                });

                                //mixin attributes w/ other properties
                                var graphicAtts = dojo.mixin(atts, { isCluster: true, clusterSize: col.length });

                                //add cluster to map
                                this.add(new esri.Graphic(new esri.geometry.Point(tileCenterPoint.x, tileCenterPoint.y), sym, graphicAtts));
                                //********
                                ClusterGraphic = new esri.Graphic(new esri.geometry.Point(tileCenterPoint.x, tileCenterPoint.y), sym, graphicAtts);
                                ClusterGraphicSet.push(ClusterGraphic);
                                //********
                                //initial testing w/ IE8 shows that TextSymbols are not displayed for some reason
                                //this may be an isolated issue.  more testing needed.
                                //it should work fine for IE7, FF, Chrome
                                this.add(new esri.Graphic(new esri.geometry.Point(tileCenterPoint.x, tileCenterPoint.y), new esri.symbol.TextSymbol(col.length).setOffset(0, -5)));

                            } else { //single graphic
                                dojo.forEach(col, function (point) {
                                    //                                    this.add(new esri.Graphic(point, this.symbolBank.single, dojo.mixin(point.attributes, { isCluster: false }), this._infoTemplate));
                                    var symbol = null;

                                    var status = point.attributes["状态"];
                                    symbol = new esri.symbol.PictureMarkerSymbol($.page.webSiteRootUrl + "Web/maps/Images/symbols/污水处理设施" + status + ".png", 30, 30);
                                    this.add(new esri.Graphic(point, symbol, dojo.mixin(point.attributes, { isCluster: false }), this._infoTemplate));
                                }, this);
                            }
                        }
                    }
                }, this);
            }
        }, this);
    }
});