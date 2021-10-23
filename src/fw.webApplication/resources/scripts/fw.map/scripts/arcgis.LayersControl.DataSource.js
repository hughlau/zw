var LayersControlDataSource = [
    {
        "LayerTypeName": "GeographicInformation"
        , "LayerTypeTitle": "地理信息"
        , "Width": null
        , "Layers":
            [
                //{
                //    "LayerName": "ImageMap"
                //    , "LayerTitle": "天地图底图"
                //    , "Layers":
                //        [
                             {
                                "MapServiceLayerType": "esri.layers.TianDiTuTiledMapServiceLayer_Vector"
                                , "LayerName": "TDT_DZ"
                                , "LayerTitle": "天地图矢量"
                                , "ServiceUrl": ""
                                , "InfoWindowSettings":
                                    {
                                        "FieldArray":
                                            [

                                            ]
                                    }
                                , "LayerType": "Map"
                                , "SymbolUrl": ""
                                , "SymbolColor": "#F70909"
                                , "SymbolWidth": "20"
                                , "SymbolHeight": "20"
                                , "SymbolBorderColor": ""
                                , "SymbolFillColor": ""
                                , "opacity": "1"
                                , "layerIndex": ""
                                , "ShowminScale": "0"
                                , "ShowmaxScale": "0"
                                 , callback: function (Layer) {
                                     changeLayerIndex(Layer);
                                 }
                            }
                            , {
                                "MapServiceLayerType": "esri.layers.TianDiTuTiledMapServiceLayer_PlaceName"
                                , "LayerName": "TDT_PlaceName"
                                , "LayerTitle": "天地图矢量标注"
                                , "ServiceUrl": ""
                                , "InfoWindowSettings":
                                    {
                                        "FieldArray":
                                            [

                                            ]
                                    }
                                , "LayerType": "Map"
                                , "SymbolUrl": ""
                                , "SymbolColor": "#F70909"
                                , "SymbolWidth": "20"
                                , "SymbolHeight": "20"
                                , "SymbolBorderColor": ""
                                , "SymbolFillColor": ""
                                , "opacity": "1"
                                , "layerIndex": ""
                                , "ShowminScale": "0"
                                , "ShowmaxScale": "0"
                                 , callback: function (Layer) {
                                     changeLayerIndex(Layer);
                                 }
                            }
                , {
                    "MapServiceLayerType": "esri.layers.TianDiTuTiledMapServiceLayer_Image"
                    , "LayerName": "TDT_Img"
                    , "LayerTitle": "天地图影像"
                    , "ServiceUrl": ""
                    , "InfoWindowSettings":
                    {
                        "FieldArray":
                            [

                            ]
                    }
                    , "LayerType": "Map"
                    , "SymbolUrl": ""
                    , "SymbolColor": "#F70909"
                    , "SymbolWidth": "20"
                    , "SymbolHeight": "20"
                    , "SymbolBorderColor": ""
                    , "SymbolFillColor": ""
                    , "opacity": "1"
                    , "layerIndex": ""
                    , "ShowminScale": "0"
                    , "ShowmaxScale": "0"
                    , callback: function (Layer) {
                        changeLayerIndex(Layer);
                    }
                }
                , {
                    "MapServiceLayerType": "esri.layers.TianDiTuTiledMapServiceLayer_cia_c"
                    , "LayerName": "TDT_YX"
                    , "LayerTitle": "天地图影像标注"
                    , "ServiceUrl": ""
                    , "InfoWindowSettings":
                    {
                        "FieldArray":
                            [

                            ]
                    }
                    , "LayerType": "Map"
                    , "SymbolUrl": ""
                    , "SymbolColor": "#F70909"
                    , "SymbolWidth": "20"
                    , "SymbolHeight": "20"
                    , "SymbolBorderColor": ""
                    , "SymbolFillColor": ""
                    , "opacity": "1"
                    , "layerIndex": ""
                    , "ShowminScale": "0"
                    , "ShowmaxScale": "0"
                    , callback: function (Layer) {
                        changeLayerIndex(Layer);
                    }
                }
                
                //        ]
                //}
                //, {
                //    "LayerName": "ImageMap"
                //    , "LayerTitle": "省厅底图"
                //    , "Layers":
                //        [
                //            {
                //                "MapServiceLayerType": "esri.layers.ArcGISTiledMapServiceLayer"
                //                , "LayerName": "ST_Img"
                //                , "LayerTitle": "省厅影像图"
                //                , "ServiceUrl": ST_ImgLayerUrl
                //                , "InfoWindowSettings":
                //                    {
                //                        "FieldArray":
                //                            [

                //                            ]
                //                    }
                //                , "LayerType": "Map"
                //                , "SymbolUrl": ""
                //                , "SymbolColor": "#F70909"
                //                , "SymbolWidth": "20"
                //                , "SymbolHeight": "20"
                //                , "SymbolBorderColor": ""
                //                , "SymbolFillColor": ""
                //                , "opacity": "1"
                //                , "layerIndex": ""
                //                , "ShowminScale": "0"
                //                , "ShowmaxScale": "0"
                //                , callback: function (Layer) {
                //                    changeLayerIndex(Layer);
                //                }
                //            }
                //            , {
                //                "MapServiceLayerType": "esri.layers.ArcGISTiledMapServiceLayer"
                //                , "LayerName": "ST_DZ"
                //                , "LayerTitle": "省厅电子地图"
                //                , "ServiceUrl": ST_DXLayerUrl
                //                , "InfoWindowSettings":
                //                    {
                //                        "FieldArray":
                //                            [

                //                            ]
                //                    }
                //                , "LayerType": "Map"
                //                , "SymbolUrl": ""
                //                , "SymbolColor": "#F70909"
                //                , "SymbolWidth": "20"
                //                , "SymbolHeight": "20"
                //                , "SymbolBorderColor": ""
                //                , "SymbolFillColor": ""
                //                , "opacity": "1"
                //                , "layerIndex": ""
                //                , "ShowminScale": "0"
                //                , "ShowmaxScale": "0"
                //                , callback: function (Layer) {
                //                    changeLayerIndex(Layer);
                //                }
                //            }
                //        ]
                //}
        //                , {
        //                    "LayerTitle": "边界"
        //                    , "LayerName": "边界"
        //                    , "ServiceUrl": ""
        //                    , "Layers":
        //                        [
        //                            {
        //                                "LayerTitle": "边界"
        //                                , "LayerName": "BJ"
        //                                , "ServiceUrl": BJLayerUrl
        //                                , "InfoWindowSettings":
        //                                    {
        //                                        "FieldArray":
        //                                            [

        //                                            ]
        //                                    }
        //                                , "LayerType": "Map"
        //                                , "MapServiceLayerType": "esri.layers.ArcGISTiledMapServiceLayer"
        //                                , "SymbolUrl": ""
        //                                , "SymbolColor": "#F70909"
        //                                , "SymbolWidth": "20"
        //                                , "SymbolHeight": "20"
        //                                , "SymbolBorderColor": ""
        //                                , "SymbolFillColor": ""
        //                                , "opacity": "1"
        //                                , "layerIndex": "99"
        //                                , "ShowminScale": "0"
        //                                , "ShowmaxScale": "0"
        //                            }
        //                    , {
        //                        "LayerTitle": "厂区划"
        //                                , "LayerName": "Canton"
        //                                , "ServiceUrl": CantonLayerUrl
        //                                , "InfoWindowSettings":
        //                                    {
        //                                        "FieldArray":
        //                                            [

        //                                            ]
        //                                    }
        //                                , "LayerType": "Map"
        //                                , "MapServiceLayerType": "esri.layers.ArcGISTiledMapServiceLayer"
        //                                , "SymbolUrl": ""
        //                                , "SymbolColor": "#F70909"
        //                                , "SymbolWidth": "20"
        //                                , "SymbolHeight": "20"
        //                                , "SymbolBorderColor": ""
        //                                , "SymbolFillColor": ""
        //                                , "opacity": "1"
        //                                , "layerIndex": "99"
        //                                , "ShowminScale": "0"
        //                                , "ShowmaxScale": "0"
        //                    }
        //                        ]
        //                }
            ]
    }
//    , {
//        "LayerTypeName": "EnvironmentalInformation"
//        , "LayerTypeTitle": "环境信息"
//        , "Width": null
//        , "Layers":
//            [
//                {
//                    "LayerName": "CLSS"
//                    , "LayerTitle": "处理设施"
//                    , "ServiceUrl":""// WSPointLayerUrl+"/0"
//                    , "InfoWindowSettings":
//                        {
//                            "FieldArray":
//                                [
//                                    {
//                                        "FieldName": "sitename"
//                                        , "IsTitle": true
//                                        , "IsShow": false
//                                        , "ShowName": ""
//                                        , "IsParameter": false
//                                        , "ParameterName": ""
//                                    }
//                                    , {
//                                        "FieldName": "Name"
//                                        , "IsTitle": false
//                                        , "IsShow": true
//                                        , "ShowName": "镇"
//                                        , "IsParameter": false
//                                        , "ParameterName": ""
//                                    }
//                                     , {
//                                         "FieldName": "CantonName"
//                                        , "IsTitle": false
//                                        , "IsShow": true
//                                        , "ShowName": "村"
//                                        , "IsParameter": false
//                                        , "ParameterName": ""
//                                     }
//                                ]
//                            , "DetailUrl": ""
//                        }
//                    , "LayerType": "Point"
//                    , "MapServiceLayerType": ""
//                    , "SymbolUrl": "Web/maps/Images/symbols/污水处理设施 (6).png"
//                    , "SymbolColor": "#3E8FC9"
//                    , "SymbolWidth": "30"
//                    , "SymbolHeight": "30"
//                    , "SymbolBorderColor": "#4EA5E4"
//                    , "SymbolFillColor": ""
//                    , "SymbolBorderWidth": "2"
//                    , "opacity": "1"
//                    , "layerIndex": "99"
//                    , "ShowminScale": "0"
//                    , "ShowmaxScale": "0"

//                }
//              
//            ]
//    }
];


var changeLayerIndex = function (Layer) {
    for (var i = 0; i < ArcGIS_Map.layerIds.length; i++) {
        if (ArcGIS_Map.layerIds[i] == "BJ") {
            ArcGIS_Map.reorderLayer(Layer, i);
            break;
        };
    };
}