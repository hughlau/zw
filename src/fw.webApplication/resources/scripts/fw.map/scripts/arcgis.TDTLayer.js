dojo.declare("esri.layers.TianDiTuTiledMapServiceLayer_Image", esri.layers.TiledMapServiceLayer, {
    constructor: function () {
        this.spatialReference = new esri.SpatialReference({ wkid: 4326 });
        this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-180.0, -90.0, 180.0, 90.0, this.spatialReference));
        this.tileInfo = new esri.layers.TileInfo({
            "rows": 256,
            "cols": 256,
            "compressionQuality": 0,
            "origin": {
                "x": -180,
                "y": 90
            },
            "spatialReference": {
                "wkid": 4326
            },
            "lods": [
                    { "level": 1, "resolution": 0.703125, "scale": 295497593.05875003 }, /////天地图的level是从1开始的
                    {"level": 2, "resolution": 0.3515625, "scale": 147748796.52937502 },
                    { "level": 3, "resolution": 0.17578125, "scale": 73874398.264687508 },
                    { "level": 4, "resolution": 0.087890625, "scale": 36937199.132343754 },
                    { "level": 5, "resolution": 0.0439453125, "scale": 18468599.566171877 },
                    { "level": 6, "resolution": 0.02197265625, "scale": 9234299.7830859385 },
                      { "level": 7, "resolution": 0.010986328125, "scale": 4617149.8915429693 },
                      { "level": 8, "resolution": 0.0054931640625, "scale": 2308574.9457714846 },
                      { "level": 9, "resolution": 0.00274658203125, "scale": 1154287.4728857423 },
                      { "level": 10, "resolution": 0.001373291015625, "scale": 577143.73644287116 },
                      { "level": 11, "resolution": 0.0006866455078125, "scale": 288571.86822143558 },
                      { "level": 12, "resolution": 0.00034332275390625, "scale": 144285.93411071779 },
                      { "level": 13, "resolution": 0.000171661376953125, "scale": 72142.967055358895 },
                      { "level": 14, "resolution": 8.58306884765625e-005, "scale": 36071.483527679447 },
                      { "level": 15, "resolution": 4.291534423828125e-005, "scale": 18035.741763839724 },
                      { "level": 16, "resolution": 2.1457672119140625e-005, "scale": 9017.8708819198619 },
                      { "level": 17, "resolution": 1.0728836059570313e-005, "scale": 4508.9354409599309 },
                      { "level": 18, "resolution": 5.3644180297851563e-006, "scale": 2254.4677204799655 },
                                  { "level": 19, "resolution": 2.68220901489257815e-006, "scale": 1127.23386023998275 },
                                  { "level": 20, "resolution": 1.341104507446289075e-006, "scale": 563.616930119991375 }
            //                                  ,
            //                                  { "level": 21, "resolution": 6.705522537231445375e-007, "scale": 281.8084650599956875 }
                    ]
        });
        this.loaded = true;
        this.onLoad(this);
    },
    getTileUrl: function (level, row, col) {
        var ServerIndex = (row + col) % 8;
        return "http://t" + ServerIndex + ".tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + level.toString() + "&TILEROW=" + row.toString() + "&TILECOL=" + col.toString() + "&FORMAT=tiles&tk=b2d2119acdfd750f0d479f85621794bf";
    }
});
//////////天地图标注,只有点位标注
dojo.declare("esri.layers.TianDiTuTiledMapServiceLayer_PlaceName", esri.layers.TiledMapServiceLayer, {
    constructor: function () {
        this.spatialReference = new esri.SpatialReference({ wkid: 4326 });
        this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-180.0, -90.0, 180.0, 90.0, this.spatialReference));
        this.tileInfo = new esri.layers.TileInfo({
            "rows": 256,
            "cols": 256,
            "compressionQuality": 0,
            "origin": {
                "x": -180,
                "y": 90
            },
            "spatialReference": {
                "wkid": 4326
            },
            "lods": [
                      { "level": 1, "resolution": 0.703125, "scale": 295497593.05875003 },
                      { "level": 2, "resolution": 0.3515625, "scale": 147748796.52937502 },
                      { "level": 3, "resolution": 0.17578125, "scale": 73874398.264687508 },
                      { "level": 4, "resolution": 0.087890625, "scale": 36937199.132343754 },
                      { "level": 5, "resolution": 0.0439453125, "scale": 18468599.566171877 },
                      { "level": 6, "resolution": 0.02197265625, "scale": 9234299.7830859385 },
                      { "level": 7, "resolution": 0.010986328125, "scale": 4617149.8915429693 },
                      { "level": 8, "resolution": 0.0054931640625, "scale": 2308574.9457714846 },
                      { "level": 9, "resolution": 0.00274658203125, "scale": 1154287.4728857423 },
                      { "level": 10, "resolution": 0.001373291015625, "scale": 577143.73644287116 },
                      { "level": 11, "resolution": 0.0006866455078125, "scale": 288571.86822143558 },
                      { "level": 12, "resolution": 0.00034332275390625, "scale": 144285.93411071779 },
                      { "level": 13, "resolution": 0.000171661376953125, "scale": 72142.967055358895 },
                      { "level": 14, "resolution": 8.58306884765625e-005, "scale": 36071.483527679447 },
                      { "level": 15, "resolution": 4.291534423828125e-005, "scale": 18035.741763839724 },
                      { "level": 16, "resolution": 2.1457672119140625e-005, "scale": 9017.8708819198619 },
                      { "level": 17, "resolution": 1.0728836059570313e-005, "scale": 4508.9354409599309 },
                      { "level": 18, "resolution": 5.3644180297851563e-006, "scale": 2254.4677204799655 },
            { "level": 19, "resolution": 2.68220901489257815e-006, "scale": 1127.23386023998275 },
            { "level": 20, "resolution": 1.341104507446289075e-006, "scale": 563.616930119991375 }
            //,{ "level": 21, "resolution": 6.705522537231445375e-007, "scale": 281.8084650599956875 }
                    ]
        });
        this.loaded = true;
        this.onLoad(this);
    },
    getTileUrl: function (level, row, col) {
        var ServerIndex = (row + col) % 8;
        return "http://t" + ServerIndex + ".tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + level.toString() + "&TILEROW=" + row.toString() + "&TILECOL=" + col.toString() + "&FORMAT=tiles&tk=b2d2119acdfd750f0d479f85621794bf";

    }
});

dojo.declare("esri.layers.TianDiTuTiledMapServiceLayer_Vector", esri.layers.TiledMapServiceLayer, {
    constructor: function () {
        this.spatialReference = new esri.SpatialReference({ wkid: 4326 });
        this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-180.0, -90.0, 180.0, 90.0, this.spatialReference));
        this.tileInfo = new esri.layers.TileInfo({
            "rows": 256,
            "cols": 256,
            "compressionQuality": 0,
            "origin": {
                "x": -180,
                "y": 90
            },
            "spatialReference": {
                "wkid": 4326
            },
            "lods": [
                    { "level": 1, "resolution": 0.703125, "scale": 295497593.05875003 },
                    { "level": 2, "resolution": 0.3515625, "scale": 147748796.52937502 },
                    { "level": 3, "resolution": 0.17578125, "scale": 73874398.264687508 },
                    { "level": 4, "resolution": 0.087890625, "scale": 36937199.132343754 },
                    { "level": 5, "resolution": 0.0439453125, "scale": 18468599.566171877 },
                    { "level": 6, "resolution": 0.02197265625, "scale": 9234299.7830859385 },
                      { "level": 7, "resolution": 0.010986328125, "scale": 4617149.8915429693 },
                      { "level": 8, "resolution": 0.0054931640625, "scale": 2308574.9457714846 },
                      { "level": 9, "resolution": 0.00274658203125, "scale": 1154287.4728857423 },
                      { "level": 10, "resolution": 0.001373291015625, "scale": 577143.73644287116 },
                      { "level": 11, "resolution": 0.0006866455078125, "scale": 288571.86822143558 },
                      { "level": 12, "resolution": 0.00034332275390625, "scale": 144285.93411071779 },
                      { "level": 13, "resolution": 0.000171661376953125, "scale": 72142.967055358895 },
                      { "level": 14, "resolution": 8.58306884765625e-005, "scale": 36071.483527679447 },
                      { "level": 15, "resolution": 4.291534423828125e-005, "scale": 18035.741763839724 },
                      { "level": 16, "resolution": 2.1457672119140625e-005, "scale": 9017.8708819198619 },
                      { "level": 17, "resolution": 1.0728836059570313e-005, "scale": 4508.9354409599309 },
                      { "level": 18, "resolution": 5.3644180297851563e-006, "scale": 2254.4677204799655 },
            { "level": 19, "resolution": 2.68220901489257815e-006, "scale": 1127.23386023998275 },
            { "level": 20, "resolution": 1.341104507446289075e-006, "scale": 563.616930119991375 }
            //,{ "level": 21, "resolution": 6.705522537231445375e-007, "scale": 281.8084650599956875 }
                    ]
        });
        this.loaded = true;
        this.onLoad(this);
    },
    getTileUrl: function (level, row, col) {
        var ServerIndex = (row + col) % 8;
        return "http://t" + ServerIndex + ".tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + level.toString() + "&TILEROW=" + row.toString() + "&TILECOL=" + col.toString() + "&FORMAT=tiles&tk=b2d2119acdfd750f0d479f85621794bf";
    }
});



////////同上面的天地图影像
dojo.declare("esri.layers.TianDiTuTiledMapServiceLayer_img_c", esri.layers.TiledMapServiceLayer, {
    constructor: function () {
        this.spatialReference = new esri.SpatialReference({ wkid: 4326 });
        this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-180.0, -90.0, 180.0, 90.0, this.spatialReference));
        this.tileInfo = new esri.layers.TileInfo({
            "rows": 256,
            "cols": 256,
            "compressionQuality": 0,
            "origin": {
                "x": -180,
                "y": 90
            },
            "spatialReference": {
                "wkid": 4326
            },
            "lods": [
            //{ "level": 1, "resolution": 0.703125, "scale": 295497593.05875003 },
            //{"level": 2, "resolution": 0.3515625, "scale": 147748796.52937502 },
            //{ "level": 3, "resolution": 0.17578125, "scale": 73874398.264687508 },
            //{ "level": 4, "resolution": 0.087890625, "scale": 36937199.132343754 },
            //{ "level": 5, "resolution": 0.0439453125, "scale": 18468599.566171877 },
            //{ "level": 6, "resolution": 0.02197265625, "scale": 9234299.7830859385 },
                      {"level": 7, "resolution": 0.010986328125, "scale": 4617149.8915429693 },
                      { "level": 8, "resolution": 0.0054931640625, "scale": 2308574.9457714846 },
                      { "level": 9, "resolution": 0.00274658203125, "scale": 1154287.4728857423 },
                      { "level": 10, "resolution": 0.001373291015625, "scale": 577143.73644287116 },
                      { "level": 11, "resolution": 0.0006866455078125, "scale": 288571.86822143558 },
                      { "level": 12, "resolution": 0.00034332275390625, "scale": 144285.93411071779 },
                      { "level": 13, "resolution": 0.000171661376953125, "scale": 72142.967055358895 },
                      { "level": 14, "resolution": 8.58306884765625e-005, "scale": 36071.483527679447 },
                      { "level": 15, "resolution": 4.291534423828125e-005, "scale": 18035.741763839724 },
                      { "level": 16, "resolution": 2.1457672119140625e-005, "scale": 9017.8708819198619 },
                      { "level": 17, "resolution": 1.0728836059570313e-005, "scale": 4508.9354409599309 },
                      { "level": 18, "resolution": 5.3644180297851563e-006, "scale": 2254.4677204799655 }
            //,
            //{ "level": 19, "resolution": 2.68220901489257815e-006, "scale": 1127.23386023998275 },
            //{ "level": 20, "resolution": 1.341104507446289075e-006, "scale": 563.616930119991375 },
            //{ "level": 21, "resolution": 6.705522537231445375e-007, "scale": 281.8084650599956875 }
                    ]
        });
        this.loaded = true;
        this.onLoad(this);
    },
    getTileUrl: function (level, row, col) {
        var ServerIndex = (row + col) % 8;
        return "http://t" + ServerIndex + ".tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + level.toString() + "&TILEROW=" + row.toString() + "&TILECOL=" + col.toString() + "&FORMAT=tiles&tk=b2d2119acdfd750f0d479f85621794bf";
    }
});

/////////天地图标注，不光有点位的标注，还包括道路河流等要素
dojo.declare("esri.layers.TianDiTuTiledMapServiceLayer_cia_c", esri.layers.TiledMapServiceLayer, {
    constructor: function () {
        this.spatialReference = new esri.SpatialReference({ wkid: 4326 });
        this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-180.0, -90.0, 180.0, 90.0, this.spatialReference));
        this.tileInfo = new esri.layers.TileInfo({
            "rows": 256,
            "cols": 256,
            "compressionQuality": 0,
            "origin": {
                "x": -180,
                "y": 90
            },
            "spatialReference": {
                "wkid": 4326
            },
            "lods": [
            //{ "level": 1, "resolution": 0.703125, "scale": 295497593.05875003 },
            //{"level": 2, "resolution": 0.3515625, "scale": 147748796.52937502 },
            //{ "level": 3, "resolution": 0.17578125, "scale": 73874398.264687508 },
            //{ "level": 4, "resolution": 0.087890625, "scale": 36937199.132343754 },
            //{ "level": 5, "resolution": 0.0439453125, "scale": 18468599.566171877 },
            //{ "level": 6, "resolution": 0.02197265625, "scale": 9234299.7830859385 },
                      {"level": 7, "resolution": 0.010986328125, "scale": 4617149.8915429693 },
                      { "level": 8, "resolution": 0.0054931640625, "scale": 2308574.9457714846 },
                      { "level": 9, "resolution": 0.00274658203125, "scale": 1154287.4728857423 },
                      { "level": 10, "resolution": 0.001373291015625, "scale": 577143.73644287116 },
                      { "level": 11, "resolution": 0.0006866455078125, "scale": 288571.86822143558 },
                      { "level": 12, "resolution": 0.00034332275390625, "scale": 144285.93411071779 },
                      { "level": 13, "resolution": 0.000171661376953125, "scale": 72142.967055358895 },
                      { "level": 14, "resolution": 8.58306884765625e-005, "scale": 36071.483527679447 },
                      { "level": 15, "resolution": 4.291534423828125e-005, "scale": 18035.741763839724 },
                      { "level": 16, "resolution": 2.1457672119140625e-005, "scale": 9017.8708819198619 },
                      { "level": 17, "resolution": 1.0728836059570313e-005, "scale": 4508.9354409599309 },
                      { "level": 18, "resolution": 5.3644180297851563e-006, "scale": 2254.4677204799655 }
            // ,
            //{ "level": 19, "resolution": 2.68220901489257815e-006, "scale": 1127.23386023998275 },
            //{ "level": 20, "resolution": 1.341104507446289075e-006, "scale": 563.616930119991375 },
            //{ "level": 21, "resolution": 6.705522537231445375e-007, "scale": 281.8084650599956875 }
                    ]
        });
        this.loaded = true;
        this.onLoad(this);
    },
    getTileUrl: function (level, row, col) {
        var ServerIndex = (row + col) % 8;
        return "http://t" + ServerIndex + ".tianditu.gov.cn/cia_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + level.toString() + "&TILEROW=" + row.toString() + "&TILECOL=" + col.toString() + "&FORMAT=tiles&tk=b2d2119acdfd750f0d479f85621794bf";
    }
});
///////////同上面的天地图矢量图
dojo.declare("esri.layers.TianDiTuTiledMapServiceLayer_vec_c", esri.layers.TiledMapServiceLayer, {
    constructor: function () {
        this.spatialReference = new esri.SpatialReference({ wkid: 4326 });
        this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-180.0, -90.0, 180.0, 90.0, this.spatialReference));
        this.tileInfo = new esri.layers.TileInfo({
            "rows": 256,
            "cols": 256,
            "compressionQuality": 0,
            "origin": {
                "x": -180,
                "y": 90
            },
            "spatialReference": {
                "wkid": 4326
            },
            "lods": [
            //{"level": 1, "resolution": 0.703125, "scale": 295497593.05875003 },
            //{"level": 2, "resolution": 0.3515625, "scale": 147748796.52937502 },
            //{ "level": 3, "resolution": 0.17578125, "scale": 73874398.264687508 },
            //{ "level": 4, "resolution": 0.087890625, "scale": 36937199.132343754 },
            //{ "level": 5, "resolution": 0.0439453125, "scale": 18468599.566171877 },
            //{ "level": 6, "resolution": 0.02197265625, "scale": 9234299.7830859385 },
                      {"level": 7, "resolution": 0.010986328125, "scale": 4617149.8915429693 },
                      { "level": 8, "resolution": 0.0054931640625, "scale": 2308574.9457714846 },
                      { "level": 9, "resolution": 0.00274658203125, "scale": 1154287.4728857423 },
                      { "level": 10, "resolution": 0.001373291015625, "scale": 577143.73644287116 },
                      { "level": 11, "resolution": 0.0006866455078125, "scale": 288571.86822143558 },
                      { "level": 12, "resolution": 0.00034332275390625, "scale": 144285.93411071779 },
                      { "level": 13, "resolution": 0.000171661376953125, "scale": 72142.967055358895 },
                      { "level": 14, "resolution": 8.58306884765625e-005, "scale": 36071.483527679447 },
                      { "level": 15, "resolution": 4.291534423828125e-005, "scale": 18035.741763839724 },
                      { "level": 16, "resolution": 2.1457672119140625e-005, "scale": 9017.8708819198619 },
                      { "level": 17, "resolution": 1.0728836059570313e-005, "scale": 4508.9354409599309 },
                      { "level": 18, "resolution": 5.3644180297851563e-006, "scale": 2254.4677204799655 }
            //,
            //{ "level": 19, "resolution": 2.68220901489257815e-006, "scale": 1127.23386023998275 },
            //{ "level": 20, "resolution": 1.341104507446289075e-006, "scale": 563.616930119991375 },
            //{ "level": 21, "resolution": 6.705522537231445375e-007, "scale": 281.8084650599956875 }
                    ]
        });
        this.loaded = true;
        this.onLoad(this);
    },
    getTileUrl: function (level, row, col) {
        var ServerIndex = (row + col) % 8;
        return "http://t" + ServerIndex + ".tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + level.toString() + "&TILEROW=" + row.toString() + "&TILECOL=" + col.toString() + "&FORMAT=tiles&tk=b2d2119acdfd750f0d479f85621794bf";
    },
    onError: function (error) {
        var imgURL = error.message.replace("无法加载切片: ", "");
        for (var i in this._tiles) {
            var imgJS = this._tiles[i];
            if (imgJS.src == imgURL) {
                imgJS.src = "http://www.tianditu.com/images/openlayers/img/vec404.png";
                imgJS.style.visibility = "visible";
            };
        };
    }
});
///////同上面的天地图的PlaceName
dojo.declare("esri.layers.TianDiTuTiledMapServiceLayer_cva_c", esri.layers.TiledMapServiceLayer, {
    constructor: function () {
        this.spatialReference = new esri.SpatialReference({ wkid: 4326 });
        this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-180.0, -90.0, 180.0, 90.0, this.spatialReference));
        this.tileInfo = new esri.layers.TileInfo({
            "rows": 256,
            "cols": 256,
            "compressionQuality": 0,
            "origin": {
                "x": -180,
                "y": 90
            },
            "spatialReference": {
                "wkid": 4326
            },
            "lods": [
            //{ "level": 1, "resolution": 0.703125, "scale": 295497593.05875003 },
            //{"level": 2, "resolution": 0.3515625, "scale": 147748796.52937502 },
            //{ "level": 3, "resolution": 0.17578125, "scale": 73874398.264687508 },
            //{ "level": 4, "resolution": 0.087890625, "scale": 36937199.132343754 },
            //{ "level": 5, "resolution": 0.0439453125, "scale": 18468599.566171877 },
            //{ "level": 6, "resolution": 0.02197265625, "scale": 9234299.7830859385 },
                      {"level": 7, "resolution": 0.010986328125, "scale": 4617149.8915429693 },
                      { "level": 8, "resolution": 0.0054931640625, "scale": 2308574.9457714846 },
                      { "level": 9, "resolution": 0.00274658203125, "scale": 1154287.4728857423 },
                      { "level": 10, "resolution": 0.001373291015625, "scale": 577143.73644287116 },
                      { "level": 11, "resolution": 0.0006866455078125, "scale": 288571.86822143558 },
                      { "level": 12, "resolution": 0.00034332275390625, "scale": 144285.93411071779 },
                      { "level": 13, "resolution": 0.000171661376953125, "scale": 72142.967055358895 },
                      { "level": 14, "resolution": 8.58306884765625e-005, "scale": 36071.483527679447 },
                      { "level": 15, "resolution": 4.291534423828125e-005, "scale": 18035.741763839724 },
                      { "level": 16, "resolution": 2.1457672119140625e-005, "scale": 9017.8708819198619 },
                      { "level": 17, "resolution": 1.0728836059570313e-005, "scale": 4508.9354409599309 },
                      { "level": 18, "resolution": 5.3644180297851563e-006, "scale": 2254.4677204799655 }
            //,
            //{ "level": 19, "resolution": 2.68220901489257815e-006, "scale": 1127.23386023998275 },
            //{ "level": 20, "resolution": 1.341104507446289075e-006, "scale": 563.616930119991375 },
            //{ "level": 21, "resolution": 6.705522537231445375e-007, "scale": 281.8084650599956875 }
                    ]
        });
        this.loaded = true;
        this.onLoad(this);
    },
    getTileUrl: function (level, row, col) {
        var ServerIndex = (row + col) % 8;
        return "http://t" + ServerIndex + ".tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + level.toString() + "&TILEROW=" + row.toString() + "&TILECOL=" + col.toString() + "&FORMAT=tiles&tk=b2d2119acdfd750f0d479f85621794bf";
    }
    //    ,
    //    onError: function (error) {
    //        var imgURL = error.message.replace("无法加载切片: ", "");
    //        for (var i in this._tiles) {
    //            var imgJS = this._tiles[i];
    //            if (imgJS.src == imgURL) {
    //                ArcGIS_LayersErrorImagesJSArray.push(imgJS);
    //                //imgJS.src = "http://www.tianditu.com/images/openlayers/img/vec404.png";
    //                //imgJS.style.visibility = "visible";
    //            };
    //        };
    //        ArcGIS_LayersErrorImagesReload();
    //    }
});
var ArcGIS_LayersErrorImagesJSArray = [];
var ArcGIS_LayersErrorImagesSetTimeoutFunction = null;
var ArcGIS_LayersErrorImagesReload = function () {
    clearTimeout(ArcGIS_LayersErrorImagesSetTimeoutFunction);
    ArcGIS_LayersErrorImagesSetTimeoutFunction = setTimeout(function () {
        for (var i = 0; i < ArcGIS_LayersErrorImagesJSArray.length; i++) {
            var imgJS = ArcGIS_LayersErrorImagesJSArray[i];
            imgJS.src = "http://www.tianditu.com/images/openlayers/img/vec404.png";
            imgJS.style.visibility = "visible";
            $(imgJS).css("visibility", "visible");
        };
        ArcGIS_LayersErrorImagesJSArray = [];
    }, 5000);
};
////////// 天地图的地形图
dojo.declare("esri.layers.TianDiTuTiledMapServiceLayer_ter_c", esri.layers.TiledMapServiceLayer, {
    constructor: function () {
        this.spatialReference = new esri.SpatialReference({ wkid: 4326 });
        this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-180.0, -90.0, 180.0, 90.0, this.spatialReference));
        this.tileInfo = new esri.layers.TileInfo({
            "rows": 256,
            "cols": 256,
            "compressionQuality": 0,
            "origin": {
                "x": -180,
                "y": 90
            },
            "spatialReference": {
                "wkid": 4326
            },
            "lods": [
            //{ "level": 1, "resolution": 0.703125, "scale": 295497593.05875003 },
            //{"level": 2, "resolution": 0.3515625, "scale": 147748796.52937502 },
            //{ "level": 3, "resolution": 0.17578125, "scale": 73874398.264687508 },
            //{ "level": 4, "resolution": 0.087890625, "scale": 36937199.132343754 },
            //{ "level": 5, "resolution": 0.0439453125, "scale": 18468599.566171877 },
            //{ "level": 6, "resolution": 0.02197265625, "scale": 9234299.7830859385 },
                      {"level": 7, "resolution": 0.010986328125, "scale": 4617149.8915429693 },
                      { "level": 8, "resolution": 0.0054931640625, "scale": 2308574.9457714846 },
                      { "level": 9, "resolution": 0.00274658203125, "scale": 1154287.4728857423 },
                      { "level": 10, "resolution": 0.001373291015625, "scale": 577143.73644287116 },
                      { "level": 11, "resolution": 0.0006866455078125, "scale": 288571.86822143558 },
                      { "level": 12, "resolution": 0.00034332275390625, "scale": 144285.93411071779 },
                      { "level": 13, "resolution": 0.000171661376953125, "scale": 72142.967055358895 },
                      { "level": 14, "resolution": 8.58306884765625e-005, "scale": 36071.483527679447 },
                      { "level": 15, "resolution": 4.291534423828125e-005, "scale": 18035.741763839724 },
                      { "level": 16, "resolution": 2.1457672119140625e-005, "scale": 9017.8708819198619 },
                      { "level": 17, "resolution": 1.0728836059570313e-005, "scale": 4508.9354409599309 },
                      { "level": 18, "resolution": 5.3644180297851563e-006, "scale": 2254.4677204799655 }
            //,
            //{ "level": 19, "resolution": 2.68220901489257815e-006, "scale": 1127.23386023998275 },
            //{ "level": 20, "resolution": 1.341104507446289075e-006, "scale": 563.616930119991375 },
            //{ "level": 21, "resolution": 6.705522537231445375e-007, "scale": 281.8084650599956875 }
                    ]
        });
        this.loaded = true;
        this.onLoad(this);
    },
    getTileUrl: function (level, row, col) {
        var ServerIndex = (row + col) % 8;
        return "http://t" + ServerIndex + ".tianditu.gov.cn/ter_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + level.toString() + "&TILEROW=" + row.toString() + "&TILECOL=" + col.toString() + "&FORMAT=tiles&tk=b2d2119acdfd750f0d479f85621794bf";
    }
});
//////电子地图标注，包括道路要素
dojo.declare("esri.layers.TianDiTuTiledMapServiceLayer_cta_c", esri.layers.TiledMapServiceLayer, {
    constructor: function () {
        this.spatialReference = new esri.SpatialReference({ wkid: 4326 });
        this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-180.0, -90.0, 180.0, 90.0, this.spatialReference));
        this.tileInfo = new esri.layers.TileInfo({
            "rows": 256,
            "cols": 256,
            "compressionQuality": 0,
            "origin": {
                "x": -180,
                "y": 90
            },
            "spatialReference": {
                "wkid": 4326
            },
            "lods": [
            //{ "level": 1, "resolution": 0.703125, "scale": 295497593.05875003 },
            //{"level": 2, "resolution": 0.3515625, "scale": 147748796.52937502 },
            //{ "level": 3, "resolution": 0.17578125, "scale": 73874398.264687508 },
            //{ "level": 4, "resolution": 0.087890625, "scale": 36937199.132343754 },
            //{ "level": 5, "resolution": 0.0439453125, "scale": 18468599.566171877 },
            //{ "level": 6, "resolution": 0.02197265625, "scale": 9234299.7830859385 },
                      {"level": 7, "resolution": 0.010986328125, "scale": 4617149.8915429693 },
                      { "level": 8, "resolution": 0.0054931640625, "scale": 2308574.9457714846 },
                      { "level": 9, "resolution": 0.00274658203125, "scale": 1154287.4728857423 },
                      { "level": 10, "resolution": 0.001373291015625, "scale": 577143.73644287116 },
                      { "level": 11, "resolution": 0.0006866455078125, "scale": 288571.86822143558 },
                      { "level": 12, "resolution": 0.00034332275390625, "scale": 144285.93411071779 },
                      { "level": 13, "resolution": 0.000171661376953125, "scale": 72142.967055358895 },
                      { "level": 14, "resolution": 8.58306884765625e-005, "scale": 36071.483527679447 },
                      { "level": 15, "resolution": 4.291534423828125e-005, "scale": 18035.741763839724 },
                      { "level": 16, "resolution": 2.1457672119140625e-005, "scale": 9017.8708819198619 },
                      { "level": 17, "resolution": 1.0728836059570313e-005, "scale": 4508.9354409599309 },
                      { "level": 18, "resolution": 5.3644180297851563e-006, "scale": 2254.4677204799655 }
            //,
            //{ "level": 19, "resolution": 2.68220901489257815e-006, "scale": 1127.23386023998275 },
            //{ "level": 20, "resolution": 1.341104507446289075e-006, "scale": 563.616930119991375 },
            //{ "level": 21, "resolution": 6.705522537231445375e-007, "scale": 281.8084650599956875 }
                    ]
        });
        this.loaded = true;
        this.onLoad(this);
    },
    getTileUrl: function (level, row, col) {
        var ServerIndex = (row + col) % 8;
        return "http://t" + ServerIndex + ".tianditu.gov.cn/cta_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + level.toString() + "&TILEROW=" + row.toString() + "&TILECOL=" + col.toString() + "&FORMAT=tiles&tk=b2d2119acdfd750f0d479f85621794bf";
    }
});













dojo.declare("esri.layers.GoogleTiledMapServiceLayer_Image", esri.layers.TiledMapServiceLayer, {
    constructor: function () {
        //var LodsJsonString = GetLodsJsonString(0, 156543.033928, 591657527.591555, 19);
        //var LodsJsonString = GetLodsJsonString(0, 0.703125, 295497593.05875003, 19);
        this.spatialReference = new esri.SpatialReference({ wkid: 4326 });
        this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-180.0, -180.0, 180.0, 180.0, this.spatialReference));
        this.tileInfo = new esri.layers.TileInfo({
            "rows": 256,
            "cols": 256,
            "compressionQuality": 0,
            "origin": {
                "x": -180,
                "y": 90
            },
            "spatialReference": {
                "wkid": this.spatialReference.wkid
            },
            "lods": [
                { "level": 0, "resolution": 0.703125, "scale": 295497593.05875003 }
                , { "level": 1, "resolution": 0.3515625, "scale": 147748796.52937502 }
                , { "level": 2, "resolution": 0.17578125, "scale": 73874398.26468751 }
                , { "level": 3, "resolution": 0.087890625, "scale": 36937199.132343754 }
                , { "level": 4, "resolution": 0.0439453125, "scale": 18468599.566171877 }
                , { "level": 5, "resolution": 0.02197265625, "scale": 9234299.783085938 }
                , { "level": 6, "resolution": 0.010986328125, "scale": 4617149.891542969 }
                , { "level": 7, "resolution": 0.0054931640625, "scale": 2308574.9457714846 }
                , { "level": 8, "resolution": 0.00274658203125, "scale": 1154287.4728857423 }
                , { "level": 9, "resolution": 0.001373291015625, "scale": 577143.7364428712 }
                , { "level": 10, "resolution": 0.0006866455078125, "scale": 288571.8682214356 }
                , { "level": 11, "resolution": 0.00034332275390625, "scale": 144285.9341107178 }
                , { "level": 12, "resolution": 0.000171661376953125, "scale": 72142.9670553589 }
                , { "level": 13, "resolution": 0.0000858306884765625, "scale": 36071.48352767945 }
                , { "level": 14, "resolution": 0.00004291534423828125, "scale": 18035.741763839723 }
                , { "level": 15, "resolution": 0.000021457672119140625, "scale": 9017.870881919861 }
                , { "level": 16, "resolution": 0.000010728836059570312, "scale": 4508.935440959931 }
                , { "level": 17, "resolution": 0.000005364418029785156, "scale": 2254.4677204799654 }
                , { "level": 18, "resolution": 0.000002682209014892578, "scale": 1127.2338602399827 }
                , { "level": 19, "resolution": 0.000001341104507446289, "scale": 563.6169301199914 }
            ]
        });

        //江西
        this.tileInfo.height = 227;
        this.tileInfo.origin.y = 125.86;

        //江苏
        // this.tileInfo.height = 227;
        //this.tileInfo.origin.y = 125.8;

        this.loaded = true;
        this.onLoad(this);
    },
    getTileUrl: function (level, row, col) {
        var _Url = null;
        var ServerIndex = (row + col) % 4;
        if (level > 19) {
            //20-X
            _Url = null;
        }
        else {
            //0-19
            //http://mt2.google.cn/vt/lyrs=s@121&hl=zh-CN&gl=CN&src=app&x=102&y=52&z=7&s=Galile
            //http://mt2.google.cn/vt/lyrs=s@123&hl=zh-CN&gl=CN&src=app&x=102&y=52&z=7&s=Galile
            _Url = "http://mt" + ServerIndex + ".google.cn/vt/lyrs=s@" + GoogleTiledImagelyrs + "&hl=zh-CN&gl=CN&src=app&s=Ga";
        };
        var url = null;
        if (_Url != null) {
            url = _Url + "&x=" + col.toString() + "&y=" + row.toString() + "&z=" + level.toString();
        }
        return url;
    }
});



dojo.declare("esri.layers.GoogleTiledMapServiceLayer_Vector", esri.layers.TiledMapServiceLayer, {
    constructor: function () {
        //var LodsJsonString = GetLodsJsonString(0, 156543.033928, 591657527.591555, 19);
        //var LodsJsonString = GetLodsJsonString(0, 0.703125, 295497593.05875003, 19);
        this.spatialReference = new esri.SpatialReference({ wkid: 4326 });
        this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-180.0, -180.0, 180.0, 180.0, this.spatialReference));
        this.tileInfo = new esri.layers.TileInfo({
            "rows": 256,
            "cols": 256,
            "compressionQuality": 0,
            "origin": {
                "x": -180,
                "y": 90
            },
            "spatialReference": {
                "wkid": this.spatialReference.wkid
            },
            "lods": [
                { "level": 0, "resolution": 0.703125, "scale": 295497593.05875003 }
                , { "level": 1, "resolution": 0.3515625, "scale": 147748796.52937502 }
                , { "level": 2, "resolution": 0.17578125, "scale": 73874398.26468751 }
                , { "level": 3, "resolution": 0.087890625, "scale": 36937199.132343754 }
                , { "level": 4, "resolution": 0.0439453125, "scale": 18468599.566171877 }
                , { "level": 5, "resolution": 0.02197265625, "scale": 9234299.783085938 }
                , { "level": 6, "resolution": 0.010986328125, "scale": 4617149.891542969 }
                , { "level": 7, "resolution": 0.0054931640625, "scale": 2308574.9457714846 }
                , { "level": 8, "resolution": 0.00274658203125, "scale": 1154287.4728857423 }
                , { "level": 9, "resolution": 0.001373291015625, "scale": 577143.7364428712 }
                , { "level": 10, "resolution": 0.0006866455078125, "scale": 288571.8682214356 }
                , { "level": 11, "resolution": 0.00034332275390625, "scale": 144285.9341107178 }
                , { "level": 12, "resolution": 0.000171661376953125, "scale": 72142.9670553589 }
                , { "level": 13, "resolution": 0.0000858306884765625, "scale": 36071.48352767945 }
                , { "level": 14, "resolution": 0.00004291534423828125, "scale": 18035.741763839723 }
                , { "level": 15, "resolution": 0.000021457672119140625, "scale": 9017.870881919861 }
                , { "level": 16, "resolution": 0.000010728836059570312, "scale": 4508.935440959931 }
                , { "level": 17, "resolution": 0.000005364418029785156, "scale": 2254.4677204799654 }
                , { "level": 18, "resolution": 0.000002682209014892578, "scale": 1127.2338602399827 }
                , { "level": 19, "resolution": 0.000001341104507446289, "scale": 563.6169301199914 }
            ]
        });

        //江西
        this.tileInfo.height = 227;
        this.tileInfo.origin.y = 125.86;

        //江苏
        //                this.tileInfo.height = 227;
        //                this.tileInfo.origin.y = 125.8;

        this.loaded = true;
        this.onLoad(this);
    },
    getTileUrl: function (level, row, col) {
        var _Url = null;
        var ServerIndex = (row + col) % 4;
        if (level > 19) {
            //20-X
            _Url = null;
        }
        else {
            //0-19
            //http://mt3.google.cn/vt/lyrs=m@199000000&hl=zh-CN&gl=CN&src=app&x=859&y=418&z=10&s=Gal
            //http://mt2.google.cn/vt/lyrs=m@203000000&hl=zh-CN&gl=CN&src=app&x=106&y=54&z=7&s=Gali
            _Url = "http://mt" + ServerIndex + ".google.cn/vt/lyrs=m@" + GoogleTiledVectorlyrs + "&hl=zh-CN&gl=CN&src=app";
        };
        var url = null;
        if (_Url != null) {
            url = _Url + "&x=" + col.toString() + "&y=" + row.toString() + "&z=" + level.toString();
        };
        if (url != null) {
            url = url + "&s=Gal";
        };
        return url;
    }
});





dojo.declare("esri.layers.GoogleTiledMapServiceLayer_Terrain", esri.layers.TiledMapServiceLayer, {
    constructor: function () {
        //var LodsJsonString = GetLodsJsonString(0, 156543.033928, 591657527.591555, 19);
        //var LodsJsonString = GetLodsJsonString(0, 0.703125, 295497593.05875003, 19);
        this.spatialReference = new esri.SpatialReference({ wkid: 4326 });
        this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-180.0, -180.0, 180.0, 180.0, this.spatialReference));
        this.tileInfo = new esri.layers.TileInfo({
            "rows": 256,
            "cols": 256,
            "compressionQuality": 0,
            "origin": {
                "x": -180,
                "y": 90
            },
            "spatialReference": {
                "wkid": this.spatialReference.wkid
            },
            "lods": [
                { "level": 0, "resolution": 0.703125, "scale": 295497593.05875003 }
                , { "level": 1, "resolution": 0.3515625, "scale": 147748796.52937502 }
                , { "level": 2, "resolution": 0.17578125, "scale": 73874398.26468751 }
                , { "level": 3, "resolution": 0.087890625, "scale": 36937199.132343754 }
                , { "level": 4, "resolution": 0.0439453125, "scale": 18468599.566171877 }
                , { "level": 5, "resolution": 0.02197265625, "scale": 9234299.783085938 }
                , { "level": 6, "resolution": 0.010986328125, "scale": 4617149.891542969 }
                , { "level": 7, "resolution": 0.0054931640625, "scale": 2308574.9457714846 }
                , { "level": 8, "resolution": 0.00274658203125, "scale": 1154287.4728857423 }
                , { "level": 9, "resolution": 0.001373291015625, "scale": 577143.7364428712 }
                , { "level": 10, "resolution": 0.0006866455078125, "scale": 288571.8682214356 }
                , { "level": 11, "resolution": 0.00034332275390625, "scale": 144285.9341107178 }
                , { "level": 12, "resolution": 0.000171661376953125, "scale": 72142.9670553589 }
                , { "level": 13, "resolution": 0.0000858306884765625, "scale": 36071.48352767945 }
                , { "level": 14, "resolution": 0.00004291534423828125, "scale": 18035.741763839723 }
                , { "level": 15, "resolution": 0.000021457672119140625, "scale": 9017.870881919861 }
                , { "level": 16, "resolution": 0.000010728836059570312, "scale": 4508.935440959931 }
                , { "level": 17, "resolution": 0.000005364418029785156, "scale": 2254.4677204799654 }
                , { "level": 18, "resolution": 0.000002682209014892578, "scale": 1127.2338602399827 }
                , { "level": 19, "resolution": 0.000001341104507446289, "scale": 563.6169301199914 }
            ]
        });

        //江西
        this.tileInfo.height = 227;
        this.tileInfo.origin.y = 125.86;

        //江苏
        //                this.tileInfo.height = 227;
        //                this.tileInfo.origin.y = 125.8;

        this.loaded = true;
        this.onLoad(this);
    },
    getTileUrl: function (level, row, col) {
        var _Url = null;
        var ServerIndex = (row + col) % 4;
        if (level > 15) {
            //20-X
            // _Url = null;
            _Url = "http://mt" + ServerIndex + ".google.cn/vt/lyrs=s@121&hl=zh-CN&gl=CN&src=app&s=Ga";
        }
        else {
            //0-19
            //http://mt2.google.cn/vt/lyrs=t@129,r@199000000&hl=zh-CN&gl=CN&src=app&x=1712&y=837&z=11&s=Galil
            _Url = "http://mt" + ServerIndex + ".google.cn/vt/lyrs=t@129,r@199000000&hl=zh-CN&gl=CN&src=app";
        };
        var url = null;
        if (_Url != null) {
            url = _Url + "&x=" + col.toString() + "&y=" + row.toString() + "&z=" + level.toString();
        };
        if (url != null) {
            url = url + "&s=Galil";
        };
        return url;
    }
});





dojo.declare("esri.layers.BaiDuTiledMapServiceLayer_Image", esri.layers.TiledMapServiceLayer, {
    constructor: function () {
        //var LodsJsonString = GetLodsJsonString(0, 156543.033928, 591657527.591555, 19);
        //var LodsJsonString = GetLodsJsonString(0, 0.17578125, 73874398.26468751, 19);
        this.spatialReference = new esri.SpatialReference({ wkid: 4326 });
        this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-180.0, -180.0, 180.0, 180.0, this.spatialReference));
        this.tileInfo = new esri.layers.TileInfo({
            "rows": 256,
            "cols": 256,
            "compressionQuality": 0,
            "origin": {
                "x": -180,
                "y": 90
            },
            "spatialReference": {
                "wkid": this.spatialReference.wkid
            },
            "lods": [
                { "level": 0, "resolution": 0.703125, "scale": 295497593.05875003 }
                , { "level": 1, "resolution": 0.3515625, "scale": 147748796.52937502 }
                , { "level": 2, "resolution": 0.17578125, "scale": 73874398.26468751 }
                , { "level": 3, "resolution": 0.087890625, "scale": 36937199.132343754 }
                , { "level": 4, "resolution": 0.0439453125, "scale": 18468599.566171877 }
                , { "level": 5, "resolution": 0.02197265625, "scale": 9234299.783085938 }
                , { "level": 6, "resolution": 0.010986328125, "scale": 4617149.891542969 }
                , { "level": 7, "resolution": 0.0054931640625, "scale": 2308574.9457714846 }
                , { "level": 8, "resolution": 0.00274658203125, "scale": 1154287.4728857423 }
                , { "level": 9, "resolution": 0.001373291015625, "scale": 577143.7364428712 }
                , { "level": 10, "resolution": 0.0006866455078125, "scale": 288571.8682214356 }
                , { "level": 11, "resolution": 0.00034332275390625, "scale": 144285.9341107178 }
                , { "level": 12, "resolution": 0.000171661376953125, "scale": 72142.9670553589 }
                , { "level": 13, "resolution": 0.0000858306884765625, "scale": 36071.48352767945 }
                , { "level": 14, "resolution": 0.00004291534423828125, "scale": 18035.741763839723 }
                , { "level": 15, "resolution": 0.000021457672119140625, "scale": 9017.870881919861 }
                , { "level": 16, "resolution": 0.000010728836059570312, "scale": 4508.935440959931 }
                , { "level": 17, "resolution": 0.000005364418029785156, "scale": 2254.4677204799654 }
                , { "level": 18, "resolution": 0.000002682209014892578, "scale": 1127.2338602399827 }
                , { "level": 19, "resolution": 0.000001341104507446289, "scale": 563.6169301199914 }
            ]
        });
        this.loaded = true;
        this.onLoad(this);
    },
    getTileUrl: function (level, row, col) {
        var _Url = null;
        var ServerIndex = (row + col) % 8 + 1;
        if (level > 19) {
            //20-X
            _Url = null;
        }
        else {
            //0-19
            //http://q2.baidu.com/it/u=x=0;y=M1;z=4;v=009;type=sate&fm=46
            _Url = "http://q" + ServerIndex + ".baidu.com/it/u=";
        };
        var url = null;
        if (_Url != null) {
            //            level += 1;
            url = _Url + "x=" + col.toString() + ";y=" + row.toString() + ";z=" + level.toString();
        };
        if (url != null) {
            url = url + ";v=009;type=sate&fm=46";
        };
        return url;
    }
});

dojo.declare("esri.layers.BaiDuTiledMapServiceLayer_Vector", esri.layers.TiledMapServiceLayer, {
    constructor: function () {
        var LodsJsonString = GetLodsJsonString(0, 156543.033928, 591657527.591555, 19);
        //var LodsJsonString = GetLodsJsonString(0, 0.17578125, 73874398.26468751, 19);
        this.spatialReference = new esri.SpatialReference({ wkid: 102100 });
        this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-20037508.3427892, -20037508.3427892, 20037508.3427892, 20037508.3427892, this.spatialReference));
        this.tileInfo = new esri.layers.TileInfo({
            "rows": 256,
            "cols": 256,
            "compressionQuality": 0,
            "origin": {
                "x": -20037508.3427892,
                "y": 20037508.3427892
            },
            "spatialReference": {
                "wkid": this.spatialReference.wkid
            },
            "lods": [
                { "level": 0, "resolution": 156543.033928, "scale": 591657527.591555 }
, { "level": 1, "resolution": 78271.516964, "scale": 295828763.7957775 }
, { "level": 2, "resolution": 39135.758482, "scale": 147914381.89788875 }
, { "level": 3, "resolution": 19567.879241, "scale": 73957190.94894437 }
, { "level": 4, "resolution": 9783.9396205, "scale": 36978595.47447219 }
, { "level": 5, "resolution": 4891.96981025, "scale": 18489297.737236093 }
, { "level": 6, "resolution": 2445.984905125, "scale": 9244648.868618046 }
, { "level": 7, "resolution": 1222.9924525625, "scale": 4622324.434309023 }
, { "level": 8, "resolution": 611.49622628125, "scale": 2311162.2171545117 }
, { "level": 9, "resolution": 305.748113140625, "scale": 1155581.1085772558 }
, { "level": 10, "resolution": 152.8740565703125, "scale": 577790.5542886279 }
, { "level": 11, "resolution": 76.43702828515624, "scale": 288895.27714431396 }
, { "level": 12, "resolution": 38.21851414257812, "scale": 144447.63857215698 }
, { "level": 13, "resolution": 19.10925707128906, "scale": 72223.81928607849 }
, { "level": 14, "resolution": 9.55462853564453, "scale": 36111.909643039245 }
, { "level": 15, "resolution": 4.777314267822265, "scale": 18055.954821519622 }
, { "level": 16, "resolution": 2.3886571339111326, "scale": 9027.977410759811 }
, { "level": 17, "resolution": 1.1943285669555663, "scale": 4513.988705379906 }
, { "level": 18, "resolution": 0.5971642834777832, "scale": 2256.994352689953 }
, { "level": 19, "resolution": 0.2985821417388916, "scale": 1128.4971763449764 }
            ]
        });
        this.loaded = true;
        this.onLoad(this);
    },
    getTileUrl: function (level, row, col) {
        var _Url = null;
        var ServerIndex = (row + col) % 8 + 1;
        if (level > 19) {
            //20-X
            _Url = null;
        }
        else {
            //0-19
            //http://q8.baidu.com/it/u=x=52517;y=14253;z=18;v=014;type=web&fm=44            
            _Url = "http://q" + ServerIndex + ".baidu.com/it/u=";
        };
        var url = null;
        if (_Url != null) {
            url = _Url + "x=" + col.toString() + ";y=" + row.toString() + ";z=" + level.toString();
        };
        if (url != null) {
            url = url + ";v=014;type=web&fm=44";
        };
        url = "http://q" + ServerIndex + ".baidu.com/it/u=x=" + col.toString() + ";y=" + row.toString() + ";z=" + level.toString() + ";v=009;type=web&fm=44";
        return url;
    }
});

//////////////南京天地图1:1000的级别
dojo.declare("esri.layers.TianDiTuTiledMapServiceLayer_NJDLG_DT_18_20N", esri.layers.TiledMapServiceLayer, {
    constructor: function () {
        this.spatialReference = new esri.SpatialReference({ wkid: 4326 });
        this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-180.0, -90.0, 180.0, 90.0, this.spatialReference));
        this.tileInfo = new esri.layers.TileInfo({
            "rows": 256,
            "cols": 256,
            "compressionQuality": 0,
            "origin": {
                "x": -180,
                "y": 90
            },
            "spatialReference": {
                "wkid": 4326
            },
            "lods": [
                                  { "level": 1, "resolution": 0.703125, "scale": 295497593.05875003 },
                                  { "level": 2, "resolution": 0.3515625, "scale": 147748796.52937502 },
                                  { "level": 3, "resolution": 0.17578125, "scale": 73874398.264687508 },
                                  { "level": 4, "resolution": 0.087890625, "scale": 36937199.132343754 },
                                  { "level": 5, "resolution": 0.0439453125, "scale": 18468599.566171877 },
                                  { "level": 6, "resolution": 0.02197265625, "scale": 9234299.7830859385 },
                      { "level": 7, "resolution": 0.010986328125, "scale": 4617149.8915429693 },
                      { "level": 8, "resolution": 0.0054931640625, "scale": 2308574.9457714846 },
                      { "level": 9, "resolution": 0.00274658203125, "scale": 1154287.4728857423 },
                      { "level": 10, "resolution": 0.001373291015625, "scale": 577143.73644287116 },
                      { "level": 11, "resolution": 0.0006866455078125, "scale": 288571.86822143558 },
                      { "level": 12, "resolution": 0.00034332275390625, "scale": 144285.93411071779 },
                      { "level": 13, "resolution": 0.000171661376953125, "scale": 72142.967055358895 },
                      { "level": 14, "resolution": 8.58306884765625e-005, "scale": 36071.483527679447 },
                      { "level": 15, "resolution": 4.291534423828125e-005, "scale": 18035.741763839724 },
                      { "level": 16, "resolution": 2.1457672119140625e-005, "scale": 9017.8708819198619 },
                      { "level": 17, "resolution": 1.0728836059570313e-005, "scale": 4508.9354409599309 },
                      { "level": 18, "resolution": 5.3644180297851563e-006, "scale": 2254.4677204799655 }
                                  ,
                                  { "level": 19, "resolution": 2.68220901489257815e-006, "scale": 1127.23386023998275 },
                                  { "level": 20, "resolution": 1.341104507446289075e-006, "scale": 563.616930119991375 }
            //,{ "level": 21, "resolution": 6.705522537231445375e-007, "scale": 281.8084650599956875 }
                    ]
        });
        this.loaded = true;
        this.onLoad(this);
    },
    getTileUrl: function (level, row, col) {
        var ServerIndex = (row + col) % 8;
        return "http://58.213.23.212:9000/NJDLG_DT_18_20N/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=DATA84.NJDLG_DT_18_20NE&STYLE=DATA84.NJDLG_DT_18_20NE&TILEMATRIXSET=Matrix_0&TILEMATRIX=" + level.toString() + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=image%2Ftile";
    }
});

dojo.declare("esri.layers.TianDiTuTiledMapServiceLayer_NJDLG_ZJ_18_20N", esri.layers.TiledMapServiceLayer, {
    constructor: function () {
        this.spatialReference = new esri.SpatialReference({ wkid: 4326 });
        this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-180.0, -90.0, 180.0, 90.0, this.spatialReference));
        this.tileInfo = new esri.layers.TileInfo({
            "rows": 256,
            "cols": 256,
            "compressionQuality": 0,
            "origin": {
                "x": -180,
                "y": 90
            },
            "spatialReference": {
                "wkid": 4326
            },
            "lods": [
                                  { "level": 1, "resolution": 0.703125, "scale": 295497593.05875003 },
                                  { "level": 2, "resolution": 0.3515625, "scale": 147748796.52937502 },
                                  { "level": 3, "resolution": 0.17578125, "scale": 73874398.264687508 },
                                  { "level": 4, "resolution": 0.087890625, "scale": 36937199.132343754 },
                                  { "level": 5, "resolution": 0.0439453125, "scale": 18468599.566171877 },
                                  { "level": 6, "resolution": 0.02197265625, "scale": 9234299.7830859385 },
                      { "level": 7, "resolution": 0.010986328125, "scale": 4617149.8915429693 },
                      { "level": 8, "resolution": 0.0054931640625, "scale": 2308574.9457714846 },
                      { "level": 9, "resolution": 0.00274658203125, "scale": 1154287.4728857423 },
                      { "level": 10, "resolution": 0.001373291015625, "scale": 577143.73644287116 },
                      { "level": 11, "resolution": 0.0006866455078125, "scale": 288571.86822143558 },
                      { "level": 12, "resolution": 0.00034332275390625, "scale": 144285.93411071779 },
                      { "level": 13, "resolution": 0.000171661376953125, "scale": 72142.967055358895 },
                      { "level": 14, "resolution": 8.58306884765625e-005, "scale": 36071.483527679447 },
                      { "level": 15, "resolution": 4.291534423828125e-005, "scale": 18035.741763839724 },
                      { "level": 16, "resolution": 2.1457672119140625e-005, "scale": 9017.8708819198619 },
                      { "level": 17, "resolution": 1.0728836059570313e-005, "scale": 4508.9354409599309 },
                      { "level": 18, "resolution": 5.3644180297851563e-006, "scale": 2254.4677204799655 }
                                  ,
                                  { "level": 19, "resolution": 2.68220901489257815e-006, "scale": 1127.23386023998275 },
                                  { "level": 20, "resolution": 1.341104507446289075e-006, "scale": 563.616930119991375 }
            //,{ "level": 21, "resolution": 6.705522537231445375e-007, "scale": 281.8084650599956875 }
                    ]
        });
        this.loaded = true;
        this.onLoad(this);
    },
    getTileUrl: function (level, row, col) {
        var ServerIndex = (row + col) % 8;
        return "http://58.213.23.212:9000/NJDLG_ZJ_18_20N/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=DATA84.NJDLG_ZJ_18_20NE&STYLE=DATA84.NJDLG_ZJ_18_20NE&TILEMATRIXSET=Matrix_0&TILEMATRIX=" + level.toString() + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=image%2Ftile";
    }
});
dojo.declare("esri.layers.TianDiTuTiledMapServiceLayer_NJDOM_DT_18_19_N", esri.layers.TiledMapServiceLayer, {
    constructor: function () {
        this.spatialReference = new esri.SpatialReference({ wkid: 4326 });
        this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-180.0, -90.0, 180.0, 90.0, this.spatialReference));
        this.tileInfo = new esri.layers.TileInfo({
            "rows": 256,
            "cols": 256,
            "compressionQuality": 0,
            "origin": {
                "x": -180,
                "y": 90
            },
            "spatialReference": {
                "wkid": 4326
            },
            "lods": [
                                  { "level": 1, "resolution": 0.703125, "scale": 295497593.05875003 },
                                  { "level": 2, "resolution": 0.3515625, "scale": 147748796.52937502 },
                                  { "level": 3, "resolution": 0.17578125, "scale": 73874398.264687508 },
                                  { "level": 4, "resolution": 0.087890625, "scale": 36937199.132343754 },
                                  { "level": 5, "resolution": 0.0439453125, "scale": 18468599.566171877 },
                                  { "level": 6, "resolution": 0.02197265625, "scale": 9234299.7830859385 },
                      { "level": 7, "resolution": 0.010986328125, "scale": 4617149.8915429693 },
                      { "level": 8, "resolution": 0.0054931640625, "scale": 2308574.9457714846 },
                      { "level": 9, "resolution": 0.00274658203125, "scale": 1154287.4728857423 },
                      { "level": 10, "resolution": 0.001373291015625, "scale": 577143.73644287116 },
                      { "level": 11, "resolution": 0.0006866455078125, "scale": 288571.86822143558 },
                      { "level": 12, "resolution": 0.00034332275390625, "scale": 144285.93411071779 },
                      { "level": 13, "resolution": 0.000171661376953125, "scale": 72142.967055358895 },
                      { "level": 14, "resolution": 8.58306884765625e-005, "scale": 36071.483527679447 },
                      { "level": 15, "resolution": 4.291534423828125e-005, "scale": 18035.741763839724 },
                      { "level": 16, "resolution": 2.1457672119140625e-005, "scale": 9017.8708819198619 },
                      { "level": 17, "resolution": 1.0728836059570313e-005, "scale": 4508.9354409599309 },
                      { "level": 18, "resolution": 5.3644180297851563e-006, "scale": 2254.4677204799655 }
                                  ,
                                  { "level": 19, "resolution": 2.68220901489257815e-006, "scale": 1127.23386023998275 },
                                  { "level": 20, "resolution": 1.341104507446289075e-006, "scale": 563.616930119991375 }
            //,{ "level": 21, "resolution": 6.705522537231445375e-007, "scale": 281.8084650599956875 }
                    ]
        });
        this.loaded = true;
        this.onLoad(this);
    },
    getTileUrl: function (level, row, col) {
        var ServerIndex = (row + col) % 8;
        return "http://58.213.23.212:9000/NJDOM_DT_18_19_N/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=DATA84.NJDOM_DT_18_19_N&STYLE=DATA84.NJDOM_DT_18_19_N&TILEMATRIXSET=Matrix_0&TILEMATRIX=" + level.toString() + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=image%2Ftile";
    }
});
dojo.declare("esri.layers.TianDiTuTiledMapServiceLayer_NJDOM_ZJ_18_19_N", esri.layers.TiledMapServiceLayer, {
    constructor: function () {
        this.spatialReference = new esri.SpatialReference({ wkid: 4326 });
        this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-180.0, -90.0, 180.0, 90.0, this.spatialReference));
        this.tileInfo = new esri.layers.TileInfo({
            "rows": 256,
            "cols": 256,
            "compressionQuality": 0,
            "origin": {
                "x": -180,
                "y": 90
            },
            "spatialReference": {
                "wkid": 4326
            },
            "lods": [
                                  { "level": 1, "resolution": 0.703125, "scale": 295497593.05875003 },
                                  { "level": 2, "resolution": 0.3515625, "scale": 147748796.52937502 },
                                  { "level": 3, "resolution": 0.17578125, "scale": 73874398.264687508 },
                                  { "level": 4, "resolution": 0.087890625, "scale": 36937199.132343754 },
                                  { "level": 5, "resolution": 0.0439453125, "scale": 18468599.566171877 },
                                  { "level": 6, "resolution": 0.02197265625, "scale": 9234299.7830859385 },
                      { "level": 7, "resolution": 0.010986328125, "scale": 4617149.8915429693 },
                      { "level": 8, "resolution": 0.0054931640625, "scale": 2308574.9457714846 },
                      { "level": 9, "resolution": 0.00274658203125, "scale": 1154287.4728857423 },
                      { "level": 10, "resolution": 0.001373291015625, "scale": 577143.73644287116 },
                      { "level": 11, "resolution": 0.0006866455078125, "scale": 288571.86822143558 },
                      { "level": 12, "resolution": 0.00034332275390625, "scale": 144285.93411071779 },
                      { "level": 13, "resolution": 0.000171661376953125, "scale": 72142.967055358895 },
                      { "level": 14, "resolution": 8.58306884765625e-005, "scale": 36071.483527679447 },
                      { "level": 15, "resolution": 4.291534423828125e-005, "scale": 18035.741763839724 },
                      { "level": 16, "resolution": 2.1457672119140625e-005, "scale": 9017.8708819198619 },
                      { "level": 17, "resolution": 1.0728836059570313e-005, "scale": 4508.9354409599309 },
                      { "level": 18, "resolution": 5.3644180297851563e-006, "scale": 2254.4677204799655 }
                                  ,
                                  { "level": 19, "resolution": 2.68220901489257815e-006, "scale": 1127.23386023998275 },
                                  { "level": 20, "resolution": 1.341104507446289075e-006, "scale": 563.616930119991375 }
            //,{ "level": 21, "resolution": 6.705522537231445375e-007, "scale": 281.8084650599956875 }
                    ]
        });
        this.loaded = true;
        this.onLoad(this);
    },
    getTileUrl: function (level, row, col) {
        var ServerIndex = (row + col) % 8;
        return "http://58.213.23.212:9000/NJDOM_ZJ_18_19_N/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=DATA84.NJDOM_ZJ_18_19_N&STYLE=DATA84.NJDOM_ZJ_18_19_N&TILEMATRIXSET=Matrix_0&TILEMATRIX=" + level.toString() + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=image%2Ftile";
    }
});