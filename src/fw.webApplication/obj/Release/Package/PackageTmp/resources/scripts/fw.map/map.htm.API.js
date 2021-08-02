var API = {
    /// <summary>
    ///     显示模块选择
    /// </summary>
    ModuleListShow: function () { }
    /// <summary>
    ///     隐藏模块选择
    /// </summary>
    ,
    ModuleListHide: function () { }
    /// <summary>
    ///     模块选择显示切换（显示时隐藏、隐藏时显示）
    /// </summary>
    ,
    ModuleListToggle: function () { }


    /// <summary>
    ///     模块菜单向下滑动增大
    /// </summary>
    ,
    ModuleSlideDown: function () { }
    /// <summary>
    ///     模块菜单向下滑动减小
    /// </summary>
    ,
    ModuleSlideUp: function () { }
    /// <summary>
    ///     模块菜单滑动切换（增大时减小、减小时增大）
    /// </summary>
    ,
    ModuleSlideToggle: function () { }
    /// <summary>
    ///     显示模块菜单
    /// </summary>
    ,
    ModuleShow: function () { }
    /// <summary>
    ///     隐藏模块菜单
    /// </summary>
    ,
    ModuleHide: function () { }
    /// <summary>
    ///     模块菜单显示切换（显示时隐藏、隐藏时显示）
    /// </summary>
    ,
    ModuleToggle: function () { }


    /// <summary>
    ///     查询与关注向下滑动增大
    /// </summary>
    ,
    SearchAndConcernSlideDown: function () { }
    /// <summary>
    ///     查询与关注向下滑动减小
    /// </summary>
    ,
    SearchAndConcernSlideUp: function () { }
    /// <summary>
    ///     查询与关注滑动切换（增大时减小、减小时增大）
    /// </summary>
    ,
    SearchAndConcernSlideToggle: function () { }
    /// <summary>
    ///     显示查询与关注
    /// </summary>
    ,
    SearchAndConcernShow: function () { }
    /// <summary>
    ///     隐藏查询与关注
    /// </summary>
    ,
    SearchAndConcernHide: function () { }
    /// <summary>
    ///     查询与关注显示切换（显示时隐藏、隐藏时显示）
    /// </summary>
    ,
    SearchAndConcernToggle: function () { }
    /// <summary>
    ///     隐藏查询与关注搜索结果
    /// </summary>
    ,
    SearchAndConcernContentHide: function () { }
    /// <summary>
    ///     搜索和关注取消绑定（关闭）
    /// </summary>
    ,
    SearchAndConcernUnbind: function () { }
    /// <summary>
    ///     搜索和关注取消绑定（打开）
    /// </summary>
    ,
    SearchAndConcernBind: function (Properties) {
        var Settings = {
            ConcernButtonOnClick: function (e) { },
            SearchButtonOnClick: function (e) { },
            HintValue: null
        };
    }
    /// <summary>
    ///     搜索和关注结果内容绑定
    /// </summary>
    ,
    SearchAndConcernContentBind: function (Properties) {
        var Settings = {
            TextFieldName: "Text",
            IconUrlFieldName: "IconUrl",
            DataSource: [],
            TemplateFunction: function (Entity, Index) { return Entity[this.TextFieldName]; },
            RowOnClick: function (Entity) { }
        };
    }


    /// <summary>
    ///  显示鼠标右击菜单
    /// </summary>
    ,
    MouseFollowShow: function () { }
    /// <summary>
    /// 隐藏鼠标右击菜单
    /// </summary>
    ,
    MouseFollowHide: function () { }
    /// <summary>
    /// 鼠标右击菜单切换（显示时隐藏、隐藏时显示）
    /// </summary>
    ,
    MouseFollowToggle: function () { }
    /// <summary>
    /// 绑定右击弹出菜单
    /// </summary>
    ,
    MouseFollowContentBind: function (Properties) {
        var Settings = {
            EventX: 0,
            EventY: 0,
            TextFieldName: "Text",
            IconUrlFieldName: "IconUrl",
            DataSource: [],
            TemplateFunction: function (Entity, Index) { return Entity[this.TextFieldName]; },
            RowOnClick: function (Entity) { }
        };
    }


    /// <summary>
    ///     行政区统计触发改变事件
    /// </summary>
    ,
    CantonStatisticsChange: function () { }
    /// <summary>
    ///     行政区统计向下滑动增大
    /// </summary>
    ,
    CantonStatisticsSlideDown: function () { }
    /// <summary>
    ///     行政区统计向下滑动减小
    /// </summary>
    ,
    CantonStatisticsSlideUp: function () { }
    /// <summary>
    ///     行政区统计滑动切换（增大时减小、减小时增大）
    /// </summary>
    ,
    CantonStatisticsSlideToggle: function () { }
    /// <summary>
    ///     显示行政区统计
    /// </summary>
    ,
    CantonStatisticsShow: function () { }
    /// <summary>
    ///     隐藏行政区统计
    /// </summary>
    ,
    CantonStatisticsHide: function () { }
    /// <summary>
    ///     行政区统计显示切换（显示时隐藏、隐藏时显示）
    /// </summary>
    ,
    CantonStatisticsToggle: function () { }
    /// <summary>
    ///     行政区域统计取消绑定（关闭）
    /// </summary>
    ,
    CantonStatisticsUnbind: function () { }
    /// <summary>
    ///     行政区域统计取消绑定（打开）
    /// </summary>
    ,
    CantonStatisticsBind: function (Properties) {
        var Settings = {
            OnChange: function (e) { }
        };
    }
    /// <summary>
    ///     行政区域统计结果内容绑定
    /// </summary>
    ,
    CantonStatisticsAdd: function (Properties) {
        var Settings = {
            TextFieldName: "Text",
            IconUrlFieldName: "IconUrl",
            ColorFieldName: "Color",
            DataSource: [],
            TemplateFunction: function (Entity, Index) { return Entity[this.TextFieldName]; },
            RowOnClick: function (Entity) { }
        };
    }


    /// <summary>
    ///     显示数据交换状态页面
    /// </summary>
    ,
    DataSynchronizationStatusShow: function () { }
    /// <summary>
    ///     隐藏数据交换状态页面
    /// </summary>
    ,
    DataSynchronizationStatusHide: function () { }
    /// <summary>
    ///     数据交换状态页面显示切换（显示时隐藏、隐藏时显示）
    /// </summary>
    ,
    DataSynchronizationStatusToggle: function () { }


    /// <summary>
    ///     弹出窗口的方法
    /// </summary>
    ,
    Open: function (Properties) {
        var Settings = {
            TitleHtml: "",
            IsHtmlPage: true,
            Url: null,
            Name: null,
            Data: {},
            Top: 80,
            Right: 20,
            Bottom: 20,
            Left: 20,
            IsLock: false
        };
    }
    /// <summary>
    ///     打开锁定层
    /// </summary>
    ,
    Lock: function (Properties) {
        var Settings = {
            IsLock: true,
            IsAddLoadingFlash: true,
            Opacity: 0.6,
            Selector: null
        };
    }
    /// <summary>
    ///     关闭锁定层
    /// </summary>
    ,
    Unlock: function (Properties) {
        var Settings = {
            Selector: null
        };
    },
    ArcGISAPI: {
        /// <summary>
        ///     ArcGIS是否加载完成
        /// </summary>
        IsArcGISLoaded: false
        /// <summary>
        ///     ArcGIS所在的窗口
        /// </summary>
        ,
        ArcGISWindow: null
        /// <summary>
        ///  ArcGIS地图对象
        /// </summary>
        ,
        ArcGISMap: null,
        DefaultData: {
            //江苏范围126.250013053125 113.044446646875 36.402484123125 29.481097404375
            //125.16236656875 114.13209313125 36.4409362715625 29.4426452559375
            Extent_JS_1984: {
                XMin: 113.044446646875,
                YMin: 29.481097404375,
                XMax: 126.250013053125,
                YMax: 36.402484123125,
                wkid: 4326
            },
            Renderer_XZQ: {
                "type": "simple",
                "symbol":
                {
                    "type": "esriSFS",
                    "style": "esriSFSNull",
                    "color": [
                        235,
                        208,
                        247,
                        255
                    ],
                    "outline":
                    {
                        "type": "esriSLS",
                        "style": "esriSLSSolid",
                        "color": [
                            255,
                            255,
                            0,
                            255
                        ],
                        "width": 3
                    }
                },
                "label": "",
                "description": ""
            },
            MapService_JS: "http://192.168.253.51/ArcGIS/rest/services/JSMap/MapServer/7",
            MapService_JS_City: "http://192.168.253.51/ArcGIS/rest/services/JSMap/MapServer/6",
            MapService_JS_Area: "http://192.168.253.51/ArcGIS/rest/services/JSMap/MapServer/5"
        },
        initMap: function (Properties) {
            var Settings = {
                displayGraphicsOnPan: true,
                DefaultExtent: {
                    XMin: 0,
                    YMin: 0,
                    XMax: 0,
                    YMax: 0,
                    wkid: 0
                },
                logo: false,
                slider: false,
                onLoaded: function (evt) {
                }
            };

        },
        /**************************************************************************
        //基本操作
        ***************************************************************************/
        //==========坐标==========
        //获取点位屏幕坐标
        getPointAnchor: function (graphic) {
        },
        //获取线面的中心点位置
        getPolygonCenter: function (geometry) {

        },
        //获取线面的范围
        getPolygonExtent: function (geometry) {

        },
        //将坐标转换为JSON格式
        getLastDrawGeometryJson: function () {

        },
        //经纬度转墨卡托
        lonLat2Mercator: function (lonLat) {

        },
        //墨卡托转经纬度
        mercator2lonLat: function (mercator) {

        },
        //地图点位坐标转换 
        pointConvert: function (Properties) {
            var Settings = {
                MapCoordinateTypeCode: ArcGIS_MapCoordinateTypeCode,
                PointCoordinateTypeCode: ArcGIS_PointCoordinateTypeCode,
                Point: null,
                IsConvertBack: false
            };
        },
        //ArcGIS地图范围坐标转换
        extentConvert: function (Properties) {
            var Settings = {
                MapCoordinateTypeCode: ArcGIS_MapCoordinateTypeCode//地理坐标代码
                ,
                PointCoordinateTypeCode: ArcGIS_PointCoordinateTypeCode//平面坐标代码
                ,
                Extent: null//范围
                ,
                IsConvertBack: false//是否转换
            };
        },
        //获取当前屏幕地图范围
        getMapExtent: function (properties) {
            var settings = {
                onChangeEvent: function () { //地图范围改变触发事件
                }
            };

        }
        //==========缩放与平移(定位)==========
        ,
        addPointAndzoomToPoint: function (Properties) {
            var Settings = {
                posX: 0,
                posY: 0,
                LayerName: "",
                zoomLevel: 10,
                reorderIndex: 2,
                symbolstate: "",
                callback: function () {
                }
            };
        }
        //定位到某一个点
        ,
        zoomToPoint: function (Properties) {
            var Settings = {
                PosX: 0//经度X值，默认0，可选参数
                ,
                PosY: 0//纬度Y值，默认0，可选参数
                ,
                Geometry: null//图形地理位置对象
                ,
                LayerName: ""//业务图层名称
                ,
                LayerKeyFieldName: ""//图层关键字段名称
                ,
                BusinessCode: ""//业务编码
                ,
                ZoomScale: 0//缩放比例，默认0，可选参数
                ,
                ZoomLevel: 13//缩放级别，默认0，可选参数
                ,
                FlashTime: ""//动画时间，默认10000毫秒
                ,
                bFlash: true//是否显示闪烁
                ,
                flashSize: 40//闪烁图片大小
                ,
                reorderIndex: 2//闪烁图层显示顺序
            };

        },
        //定位到某一个点坐标
        zoomToPointGeo: function (geometry) {
        },
        //定位到某一个线或面（中心点）
        zoomToPolygon: function (geometry, zoomLevel, onCompletedEvent) {
        },
        //根据传的像素值返回点的区域
        pointToExtent: function (map, point, toleranceInPixel) {

        },
        //设置地图切换到某一个区域
        mapChangeExtent: function (newExtent) {

        },
        //根据坐标定位到某个区域
        zoomToPosition: function (xmin, ymin, xmax, ymax) {

        },
        //地图偏移一定的像素
        mapMovePixel: function (Properties) {
            var Settings = {
                xPixels: 0,
                yPixels: 0,
                byDefaultExtend: false
            };
        },
        //回到地图初始范围
        zoomToFullExtent: function () {
        },
        //返回地图初始范围值
        getFullExtent: function () {
        },
        //缩放到行政区 
        zoomToCanton: function (Properties) {
            var Settings = {
                CantonCode: "",
                CantonMapServiceUrl: "",
                JosnSimpleRenderer: "",
                Expression: "",
                ShowmaxScale: 0 //图层显示最大Scale
                ,
                ShowminScale: 0  //图层显示最小Scale
                ,
                setx: 0,
                sety: 0
            };
        },
        //放大到一定区域
        zoomToExtent: function (extend, xPixels, yPixels) {

        },
        //放大到区域
        zoomAndQueryToPolygon: function (Layer, sUrl, sWhere, callback, setx, sety) {

        },
        //获取地图范围信息,主要要于返回切片图层的切片信息
        getMapExtentSetting: function () {

        },
        //设置地图缩放到第几级别
        setZoom: function (level) {

        },
        /**************************************************************************
        //图层
        ***************************************************************************/
        //==========底图服务==========
        //加载底图，一般加载切片图、动态地图等
        addMapService: function (Properties) {

            //添加地图
            var Settings = {
                MapServiceLayerType: "esri.layers.ArcGISDynamicMapServiceLayer" //地图服务类型
                ,
                ServiceUrl: "" //地图服务地址
                ,
                opacity: 1 //透明度
                ,
                LayerName: ""//地图名称
                ,
                ChildLayerId: null//显示的子图层编号
                ,
                showAttribution: false//是否显示属性
                ,
                DefaultVisible: true//是否显示图层
                ,
                InfoWindowSettings: null//消息窗对象
                ,
                Callback: function () {
                    //加载完成后回调函数
                },
                Legend: null//图例数组
                ,
                IsSymbolHLClear: true//是否清除高亮显示的图形
            };
        },
        //删除底图服务
        removeMapService: function (Properties) {
            var Settings = {
                LayerName: ""
            };

        },
        //切换底图服务
        modiMapService: function (Properties) { //修改地图服务地址
            //添加地图
            var Settings = {
                MapServiceLayerType: "esri.layers.ArcGISDynamicMapServiceLayer" //地图服务类型
                ,
                MapServiceUrl: ""//地图服务地址
                ,
                LayerName: ""//图层名称
            };

        },
        //创建地图服务图层
        createLayer: function (MapServiceLayerType, MapServiceUrl, Options) {

        },
        //验证矢量图层是否存在
        checkExistMSLayer: function (layerName) {

        },
        //==========动态2D地图服务==========
        //根据图层编号加载地图服务
        addMSLayerByLayerId: function (properties) {
            var Settings = {
                IsVisible: true//图层是否可见
                ,
                LayerName: ""//图层名称
                ,
                ChildLayerId: ""//子图层编号
                ,
                MapServiceLayerType: Code__MapServiceLayerType.DynamicMapService//地图服务类型
                ,
                MapServiceUrl: ""//地图服务地址
                ,
                ReorderLayerIndex: ""//排序
                ,
                Opacity: 0.8//图层透明度
                ,
                onClickEvent: function () {
                    //图层点击事件
                }
            };

        },
        //隐藏上述地图服务
        hideMSLayer: function (properties) {
            var Settings = {
                IsVisible: false//是否可见
                ,
                LayerName: ""//图层名称
            };

        },
        //创建聚类函数
        createClusterLayer: function (properties) {
            var Settings = {
                ServiceUrl: ""//图层服务地址
                ,
                LayerName: ""//图层编号
                ,
                IsBusinessLayer: true//是否业务图层
                ,
                LayerTitle: ""//图层名称
                ,
                where: ""//查询条件
                ,
                FlareLimit: 50//有限个数
                ,
                FlareDistanceFromCenter: 50//限制距离
                ,
                InfoWindowSettings: {
                    //消息窗对象
                    FieldArray: []
                },
                ClusterItemList: []//聚合条件图形
            };
        },
        //移除图层
        //非业务图层，目前包括Draw图层、聚类图层
        removeElementLayer: function (properties) {
            var settings = {
                LayerName: ""
            };
        },
        //==========要素服务==========
        //添加业务图层
        businessLayerShow: function (Properties) {
            var Settings = {
                LayerName: ""//业务图层名称LayerName
                ,
                LayerNameArray: null//业务图层名称数组
                ,
                LayerServiceUrl: ""//地图服务地址
                ,
                LayerServiceUrlArray: null//地图服务地址数组
                ,
                LayerType: Code__MapLayerTypeCode.Point //图层类型，一般有点图层、线图层和面图层，默认Code__MapLayerTypeCode.Point
                ,
                Symbol: null//图层渲染样式
                ,
                GraphicList: null //自定义graphics列表
                ,
                showLayeAttribution: false//是否显示图层属性
                ,
                ShowmaxScale: 0 //图层显示最大Scale
                ,
                ShowminScale: 0 //图层显示最小Scale
                ,
                displayOnPan: true//图形在移动期间是否显示
                ,
                isBusinessLayer: true//是否为业务图层
                ,
                isRendererByType: false //是否根据特殊渲染器渲染
                ,
                isFromDB: false //是否是从数据库获取点
                ,
                symbolArray: null//渲染器参数
                ,
                Where: ""//渲染过滤条件
                ,
                BindInfoTemplate: false//绑定InfoTemplate
                ,
                InfoTemplate: {
                    //提示框
                    TitleHtml: "",
                    ContentHtml: "",
                    ContentFunction: function () {
                    }
                },
                IsCallback: false//是否回调
                ,
                Callback: function () {
                    //回调函数，返回图层对象
                },
                onClickEvent: function () { //点击事件
                }
            };
        },
        //移除业务图层
        businessLayerRemove: function (Properties) {
            //移除业务图层
            var Settings = {
                LayerName: ""//业务图层名称LayerName
        , LayerNameArray: null//业务图层名称数组
        , Callback: function () {//加载完成后触发事件
        }
            };

        }
    ,
        //隐藏关闭业务图层
        businessLayerHide: function (Properties) {
            //隐藏关闭业务图层
            var Settings = {
                LayerName: ""//业务图层名称LayerName
        , LayerNameArray: null//业务图层名称数组
            };
        }
    ,
        //给要素图层添加过滤条件
        setFeatureLayerDefinition: function (properties) {
            var settings = {
                Layer: null,
                LayerName: "",
                Where: ""//过滤条件
            };

        }
    ,
        //加载业务图层，统一加载模板(树结构用)
        showDynamicLayer: function (Properties) {
            var Settings = {
                "LayerName": "Enterprise_FS"
            , "LayerTitle": ""
            , "LayerType": Code__MapLayerTypeCode.Point
            , "ServiceUrl": ""
            , "showLayeAttribution": false
            , "ShowmaxScale": 0   //图层显示最大Scale 72142.967055358895
            , "ShowminScale": 0//图层显示最小Scale 288571.86822143558
            , "displayOnPan": true
            , "RendererTypeCode": Code__RendererTypeCode.SimpleRenderer
            , "JosnRenderer": ""
            , "SymbolUrl": ""
            , "SymbolUrlArray": null//根据条件来显示Symbol
            , "SymbolColor": "#F70909"
            , "SymbolBorderColor": ""
            , "SymbolBorderWidth": ""
            , "SymbolFillColor": ""
            , "SymbolWidth": 20
            , "SymbolHeight": 20
            , "InfoWindowSettings": null
            , "IsSymbolHLClear": true
            };

        }
    ,
        //检查某个图层是否在数组ArcGIS_DynamicElementLayer中
        checkExistDynamicLayer: function (Properties) {
            var Settings = {
                LayerName: ""//图层名称
            };

        },
        //移除某个图层的graphic
        removeGraphic: function (properties) {
            var Settings = {
                LayerName: ""//图层名称
          , LayerNameArray: []//图层名称数组
          , Graphic: null//图形对象
          , Callback: function () {//回调函数
          }
            };

        },
        //图层重新渲染(旧版本) 
        setLayerRenderer: function (Properties) {//设置图层Renderer
            var Settings = {
                BusinessLayerTypeCode: ""
          , RendererTypeCode: Code__RendererTypeCode.SimpleRenderer
          , JosnRenderer: ""
          , MoveFirst: false
          , isBusinessLayer: true
            };
        }
    ,
        //以不同方式对图层进行渲染
        rendererLayerByType: function (properties) {
            var Settings = {
                LayerName: ""//图层名称
            , LayerServiceUrl: ""//图层服务地址
            , RenderType: ""//渲染方式
            , Where: ""//渲染条件
            , Symbol: null//符号对象
            , SymbolArray: null//符号对象集合
            };

        },
        //添加单个或列表图形到某个图层
        addGraphicToLayer: function (Properties) {
            var Settings = {
                GraphicList: []//坐标数组列表
            , GeometryList: []//图形数组列表
            , LayerName: ""//图层名称
           , Layer: null//图层对象
           , Symbol: null//图形对象
           , Symbol_W: 20//图片宽度
           , iHeight: 20//图片高度
           , ReorderLayerIndex: null//排序
           , Callback: function () {
               //回调函数
           }
            };
        }
    ,
        // 清空某个图层
        clearGraphicsLayer: function (Properties) {
            var Settings = {
                LayerName: ""//图层名称
            };
        }
    ,
        addDivLabelLayer: function (Properties) {
           
        }
    ,
        removeDivLabelLayer: function (Properties) {
           
        }
    ,
        //==========统计图服务==========
        //添加统计图
        addDivLayer: function (Properties) {
            var Settings = {
                DivLayerName: "" //图层名称
            , EntityList: null//数据源
            , TemplateFunction: function (Entity, SymbolJQ) {
                //加载完成后执行
            }
            , XFieldName: "X" //"X"
            , YFieldName: "Y"//"Y"
            , HideLevel: 0//当地图级别等于或低于该数值时隐藏
            };
        },
        //获取统计图
        getDivLayerJQ: function (Properties) {
            var Settings = {
                DivLayerName: null
            };
        },
        //更新统计图
        refreshDivLayers: function () {

        },
        //移除统计图 
        removeDivLayer: function (Properties) {
            var Settings = {
                DivLayerName: null
            };

        }
    ,
        //==========栅格图层服务==========
        // 添加栅格图层服务
        showRasterLayer: function (Properties) {
            var Settings = {
                MapServicesUrl: ""
           , LayerIndex: 0
           , opacity: 1
            };

        }
    ,
        //移除栅格图层
        rasterLayerClear: function () {

        }
    ,
        /**************************************************************************
        //弹出窗
        ***************************************************************************/
        //修改弹框大小
        mapInfoWindowResize: function (Properties) {
            var Settings = {
                Width: 0
           , Height: 0
            };

        }
    ,
        // 显示地图弹框
        mapInfoWindowShow: function (Properties) {
            var Settings = {
                Title: ""
            , domNode: null
            , Html: ""
            , Width: 0
            , Height: 0
            , evt: null
            };
            $.extend(Settings, Properties);


        }
    ,
        //隐藏地图弹框
        mapInfoWindowHide: function (Properties) {

        }
    ,
        /**************************************************************************
        //符号
        ***************************************************************************/
        //修改symbol样式
        customSetSymbol: function (Properties) {
            var Settings = {
                Layer: null//图层对象
            , LayerName: ""//图层名称，不为空将修改整个图层
            , Graphic: null//单个图形对象
            , Symbol: null//图形样式
            };

        }
    ,
        //设置业务点位显示图标
        setBusinessLayersymbol: function (Properties) {//设置业务点位显示图标
            var Settings = {
                GraphicList: []
          , LayerKeyFieldName: "CODE"
          , KeyFieldName: "CODE"
          , BusinessLayerTypeCode: ""
          , CantonCode: ""
            };

        }
    ,
        /**************************************************************************
        //其它
        ***************************************************************************/
        //清除闪烁图层
        clearflashLayer: function () {

        }
    ,
        //多点闪烁，动点是个gif图片
        flashPointList: function (Properties) {
            var Settings = {
                LayerName: ""//图层名称
            , BusinessCodeList: []//数据源关键字列表
            , AttrKey: ""//属性列名
            , FlashTime: 10000 //动画时间，默认10000毫秒，可选 
            , OffsetX: 0//偏移X
            , OffsetY: 0//偏移Y
            };

        }
    ,
        //改变地图容器大小后，地图刷新
        mapResize: function () {

        }
    ,
        //改变图层的显示顺序
        reOrderLayer: function (Properties) {
            var Settings = {
                LayerName: ""//图层名称
           , Layer: null//图层对象
           , ReorderLayerIndex: null//排序  
            };

        }
    ,
        //根据图层编号获取矢量图层索引
        getLayerIndex: function (mapId) {

        }
    ,
        /*************************************************************************
        //查询
        **************************************************************************/
        //QueryTask从已有的Geometry中搜索,并创建图层
        taskQueryByGeometry: function (properties) {
            var settings = {
                geometry: null
              , layerName: ""
              , layerServicesUrl: ""
              , onCompletedEvent: function (evt) {
                  //evt返回featureList
              }
            };

        }
    ,
        //QueryTask查询，不创建图层，返回features对象
        taskQueryReturnFeatures: function (properties) {
            var settings = {
                layerUrl: ""//图层服务地址
            , where: ""//查询条件
            , geometry: null//空间查询图形
            , spatialRelationship: this.SpatialRel.CONTAINS//空间查询类别
            , onCompletedEvent: function () {
                //完成回调事件
            }
            };

        }
    ,
        //IdentifyQuery空间查询
        taskIdentify: function (properties) {
            var settings = {
                geometry: null//空间查询对象
            , layerUrl: ""//图层服务地址
            , layerIds: ""//查询子图层编号
            , tolerance: 1//允许像素容差
            , onCompletedEvent: function () {
                //查询完成回调函数
            }
            };

        }
    ,
        //FindTask属性查询
        taskFind: function (properties) {
            var settings = {
                layerUrl: ""//图层服务地址
            , layerIds: ""//查询子图层编号
            , searchFields: ""//查询属性列名
            , searchText: ""//查询关键字
            , onCompletedEvent: function () {
                //完成回调事件
            }
            };

        }
    ,
        //获取图层上所有图像信息（属性、图形）
        getLayerFields: function (Properties) {
            var Settings = {
                MapServicesUrl: ""
          , Callback: function (e) {

          }
            };

        }
    ,
        //生成缓冲区
        geometryBuffer: function (Properties) {
            var Settings = {
                geometry: null//几何图形的经纬度值
           , wkid: 4326//生成缓冲区的坐标系代码102100
           , distances: [1]//缓冲区距离
           , unit: esri.tasks.GeometryService.UNIT_KILOMETER//缓冲区单位
           , symbol: ""//样式
           , callback: function () {
               //加载完成后触发
           }
            };

        }
    ,
        /*************************************************************************
        //绘图
        **************************************************************************/
        //画图工具
        setMapDrawTool: function (Properties) {


        }
    ,
        //画指定的几何图形
        drawByGeometry: function (Properties) {
            var Settings = {
                GeometryType: ""
              , GeometryJson: null
              , symbolJson: null
              , ShowText: ""
              , TextSymbolJson: null
              , LayerName: ""
            };

        }
    ,
        //清除指定画的几何图形
        clearDrawByGeometryLayer: function () {

        }
    ,
        //清除地图绘制图形
        clearMapDrawGraphics: function () {

        }
    },
    SkylineAPI: {
        //地图所在的窗体
        Window: window
        //地图的SGWorld对象
        ,
        SGWorld: undefined
        //是否安装了Skyline
        ,
        IsInstalledSkyline: false,
        Load: function (Properties) {
            /// <summary>
            ///     加载地图
            /// </summary>
            /// <param name="Properties" type="object">
            ///     一组用于默认配置的键/值对
            ///      1: FlyFilePath: null                                                      - Fly文件地址
            ///      2: DefaultPosition: {}                                                    - 默认定位信息Position
            ///      3: onLoadFinished:  function () { }                                       - 事件（加载完成）
            ///      4: onSGWorldMessage: function (MessageID, SourceObjectID) { }             - 事件（元素被点击）
            ///      5: onFrame: function () { }                                               - 事件（地图渲染每一帧）
            ///      6: onLButtonDown: function (Flags, X, Y) { }                              - 事件（鼠标左键按下）
            ///      7: onLButtonUp: function (Flags, X, Y) { }                                - 事件（鼠标左键松开）
            ///      8: onRButtonDown: function (Flags, X, Y) { }                              - 事件（鼠标右键按下）
            ///      9: onRButtonUp: function (Flags, X, Y) { }                                - 事件（鼠标右键松开）
            /// </param>
            ///	<returns></returns>
            var Settings = {
                FlyFilePath: null,
                DefaultPosition: { "X": 119.13715436896848, "Y": 28.701529569831063, "Altitude": 612251.6091826819, "AltitudeType": 0, "Yaw": 3.410605131648481e-13, "Pitch": 307.81007410729677, "Roll": 0, "Distance": 0 },
                onLoadFinished: function () { },
                onSGWorldMessage: function (MessageID, SourceObjectID) { },
                onFrame: function () { },
                onLButtonDown: function (Flags, X, Y) { },
                onLButtonUp: function (Flags, X, Y) { },
                onRButtonDown: function (Flags, X, Y) { },
                onRButtonUp: function (Flags, X, Y) { }
            };
        },
        JsonToString: function (JsonObject, IsUseCustomFormat) {
            /// <summary>
            ///     Json对象转化为字符串
            /// </summary>
            /// <param name="JsonObject" type="object">
            ///     Json对象
            /// </param>
            /// <param name="IsUseCustomFormat" type="bool">
            ///     是否使用用户自定义格式
            /// </param>
            ///	<returns></returns>
        },
        JsonStringToJson: function (JsonString, CatchValue) {
            /// <summary>
            ///     字符串转化为Json对象
            /// </summary>
            /// <param name="JsonString" type="string">
            ///     字符串
            /// </param>
            /// <param name="CatchValue" type="object">
            ///     如果转换失败，返回的值
            /// </param>
            ///	<returns></returns>
        },
        ObjectToPosition: function (Properties) {
            /// <summary>
            ///     普通对象转化为IPosition61对象
            /// </summary>
            /// <param name="Properties" type="object">
            ///     一组用于默认配置的键/值对
            ///      1: X: 0                                                                   - 经度
            ///      2: Y: 0                                                                   - 纬度
            ///      3: Altitude: 0                                                            - 高度(海拔)
            ///      4: AltitudeType: 0                                                        - 高度类型 0-相对高度 1-相对支点高度 2-相对地面高度 3-绝对高度 999-默认值
            ///      5: Yaw: 0                                                                 - 水平方向 向右旋转角度
            ///      6: Pitch: 0                                                               - 垂直方向 向上旋转角度
            ///      7: Roll: 0                                                                - 垂直方向 向右旋转角度
            ///      8: Distance: 0                                                            - 距离
            /// </param>
            ///	<returns></returns>
            var Settings = {
                X: 0,
                Y: 0,
                Altitude: 0,
                AltitudeType: 0,
                Yaw: 0,
                Pitch: 0,
                Roll: 0,
                Distance: 0
            };
        },
        PositionToObject: function (Properties) {
            /// <summary>
            ///     IPosition61对象转化为普通对象
            /// </summary>
            /// <param name="Properties" type="IPosition61">
            ///     IPosition61对象
            /// </param>
            ///	<returns></returns>
        },
        AddAltitude: function (Properties) {
            /// <summary>
            ///     提升Skyline对象的高度
            /// </summary>
            /// <param name="Properties" type="object">
            ///     一组用于默认配置的键/值对
            ///      1: PathName: null                                                         - 对象在Skyline ProjectTree树的路径 （\\目录1\\目录2）
            ///      2: ObjectID: null                                                         - 对象的ID
            ///      3: ItemID: null                                                           - 对象在Skyline ProjectTree树中的ID
            ///      4: Altitude: 0                                                            - 想提升的高度(海拔)值 （例如+100或-100）
            /// </param>
            ///	<returns></returns>
            var Settings = {
                PathName: null,
                ObjectID: null,
                ItemID: null,
                Altitude: 0
            };
        },
        ProjectTree: {
            FindItem: function (Properties) {
                /// <summary>
                ///     查询项
                /// </summary>
                /// <param name="Properties" type="object">
                ///     一组用于默认配置的键/值对
                ///      1: PathName: null                                                         - 对象在Skyline ProjectTree树的路径 （\\目录1\\目录2）
                /// </param>
                ///	<returns></returns>
                var Settings = {
                    PathName: null
                };
            },
            DeleteItem: function (Properties) {
                /// <summary>
                ///     删除项
                /// </summary>
                /// <param name="Properties" type="object">
                ///     一组用于默认配置的键/值对
                ///      1: PathName: null                                                         - 对象在Skyline ProjectTree树的路径 （\\目录1\\目录2）
                ///      2: ObjectID: null                                                         - 对象的ID
                ///      3: ItemID: null                                                           - 对象在Skyline ProjectTree树中的ID
                /// </param>
                ///	<returns></returns>
                var Settings = {
                    PathName: null,
                    ObjectID: null,
                    ItemID: null
                };
            },
            GetObject: function (Properties) {
                /// <summary>
                ///     获取项的Object对象
                /// </summary>
                /// <param name="Properties" type="object">
                ///     一组用于默认配置的键/值对
                ///      1: PathName: null                                                         - 对象在Skyline ProjectTree树的路径 （\\目录1\\目录2）
                ///      2: ObjectID: null                                                         - 对象的ID
                ///      3: ItemID: null                                                           - 对象在Skyline ProjectTree树中的ID
                /// </param>
                ///	<returns></returns>
                var Settings = {
                    PathName: null,
                    ObjectID: null,
                    ItemID: null
                };
            },
            GetOrCreateGroup: function (Properties) {
                /// <summary>
                ///     以创建组的方式获取一个组的项
                /// </summary>
                /// <param name="Properties" type="object">
                ///     一组用于默认配置的键/值对
                ///      1: GroupPathName: null                                                    - 组在Skyline ProjectTree树的路径 （\\目录1\\目录2）
                /// </param>
                ///	<returns></returns>
                var Settings = {
                    GroupPathName: null
                };
            }
        },
        Creator: {
            CreateLabel: function (Properties) {
                /// <summary>
                ///     创建ITerrainLabel61对象
                /// </summary>
                /// <param name="Properties" type="object">
                ///     一组用于默认配置的键/值对
                ///      1: Position: null                                                        - IPosition61对象
                ///      2: Text: null                                                            - 文字
                ///      3: ImageFileName: nu                                                     - 图片的地址
                ///      4: LabelStyle: null                                                      - ILabelStyle61对象
                ///      5: GroupID: null                                                         - 组ID
                ///      6: Description: null                                                     - 描述
                /// </param>
                ///	<returns></returns>
                var Settings = {
                    Position: null,
                    Text: null,
                    ImageFileName: null,
                    LabelStyle: null,
                    GroupID: null,
                    Description: null
                };
            },
            CreateModel: function (Properties) {
                /// <summary>
                ///     创建ITerrainModel61对象
                /// </summary>
                /// <param name="Properties" type="object">
                ///     一组用于默认配置的键/值对
                ///      1: Position: null                                                        - IPosition61对象
                ///      2: FileName: null                                                        - 模型的地址
                ///      3: Scale: nu                                                             - 模型的比例
                ///      4: ModelType: null                                                       - 模型的类型 0-普通 1-动画 2-保留
                ///      5: GroupID: null                                                         - 组ID
                ///      6: Description: null                                                     - 描述
                /// </param>
                ///	<returns></returns>
                var Settings = {
                    Position: null,
                    FileName: null,
                    Scale: null,
                    ModelType: null,
                    GroupID: null,
                    Description: null
                };
            }
        },
        DynamicLayers: {
            //图层的组名
            LayerPathName: "DynamicLayers",
            CreateLabel: function (Properties) {
                /// <summary>
                ///     创建ITerrainLabel61对象图层组
                /// </summary>
                /// <param name="Properties" type="object">
                ///     一组用于默认配置的键/值对
                ///      1: DataSource: [{ X: 119, Y: 30 }, { X: 120, Y: 31 }, { X: 121, Y: 32}]  - 数据源
                ///      2: XFieldName: "X"                                                       - 经度字段名
                ///      3: YFieldName: "Y"                                                       - 纬度字段名
                ///      4: AltitudeFieldName: "Altitude"                                         - 高度（海拔）字段名
                ///      5: AltitudeDefaultValue: 10                                              - 高度（海拔）默认值
                ///      6: AltitudeTypeFieldName: "AltitudeType"                                 - 高度类型字段名
                ///      7: AltitudeTypeDefaultValue: 0                                           - 高度类型 0-相对高度 1-相对支点高度 2-相对地面高度 3-绝对高度 999-默认值
                ///      8: TextFieldName: "Text"                                                 - 文字字段名
                ///      9: ImageFileName: "http://online.sccnn.com/icon/813/greyscale_003.gif"   - 图片地址
                ///     10: MaxViewingHeight: 200000                                              - 最大可见高度
                ///     11: MinViewingHeight: 0                                                   - 最小可见高度
                ///     12: ClientDataName: "Entity"                                              - 数据名
                ///     13: LayerName: "Label"                                                    - 图层名称
                ///     14: OnClick: function (Entity, Object) { alert(Entity.X); }               - 事件（点击）
                /// </param>
                ///	<returns></returns>
                var Settings = {
                    DataSource: [{ X: 119, Y: 30 }, { X: 120, Y: 31 }, { X: 121, Y: 32}],
                    XFieldName: "X",
                    YFieldName: "Y",
                    AltitudeFieldName: "Altitude",
                    AltitudeDefaultValue: 10,
                    AltitudeTypeFieldName: "AltitudeType",
                    AltitudeTypeDefaultValue: 0,
                    TextFieldName: "Text",
                    ImageFileName: "http://online.sccnn.com/icon/813/greyscale_003.gif",
                    MaxViewingHeight: 200000,
                    MinViewingHeight: 0,
                    ClientDataName: "Entity",
                    LayerName: "Label",
                    OnClick: function (Entity, Object) { alert(Entity.X); }
                };
            },
            CreateModel: function (Properties) {
                /// <summary>
                ///     创建ITerrainModel61对象图层组
                /// </summary>
                /// <param name="Properties" type="object">
                ///     一组用于默认配置的键/值对
                ///      1: DataSource: [{ X: 119, Y: 30 }, { X: 120, Y: 31 }, { X: 121, Y: 32}]  - 数据源
                ///      2: XFieldName: "X"                                                       - 经度字段名
                ///      3: YFieldName: "Y"                                                       - 纬度字段名
                ///      4: AltitudeFieldName: "Altitude"                                         - 高度（海拔）字段名
                ///      5: AltitudeDefaultValue: 10                                              - 高度（海拔）默认值
                ///      6: AltitudeTypeFieldName: "AltitudeType"                                 - 高度类型字段名
                ///      7: AltitudeTypeDefaultValue: 0                                           - 高度类型 0-相对高度 1-相对支点高度 2-相对地面高度 3-绝对高度 999-默认值
                ///      8: YawFieldName: "Yaw"                                                   - 水平方向 向右旋转角度 字段名
                ///      9: YawDefaultValue: 0                                                    - 水平方向 向右旋转角度 默认值
                ///     10: PitchFieldName: "Pitch"                                               - 垂直方向 向上旋转角度 字段名
                ///     11: PitchDefaultValue: 0                                                  - 垂直方向 向上旋转角度 默认值
                ///     12: RollFieldName: "Roll"                                                 - 垂直方向 向右旋转角度 字段名
                ///     13: RollDefaultValue: 0                                                   - 垂直方向 向右旋转角度 默认值
                ///     14: FileNameFieldName: "FileUrl"                                          - 模型的地址字段名
                ///     15: ScaleFieldName: "Scale"                                               - 模型比例字段名
                ///     16: ScaleDefaultValue: 300                                                - 模型比例默认值
                ///     17: DescriptionFieldName: "Description"                                   - 模型描述字段名
                ///     18: MaxViewingHeight: 200000                                              - 最大可见高度
                ///     19: MinViewingHeight: 0                                                   - 最小可见高度
                ///     20: ClientDataName: "Entity"                                              - 数据名
                ///     21: LayerName: "Label"                                                    - 图层名称
                ///     22: OnClick: function (Entity, Object) { alert(Entity.X); }               - 事件（点击）
                /// </param>
                ///	<returns></returns>
                var Settings = {
                    DataSource: [{ X: 119, Y: 30, FileUrl: $.page.webSiteRootUrl + "Web/Maps/Skyline/Models/guolf.xpl" }, { X: 120, Y: 31, FileUrl: $.page.webSiteRootUrl + "Web/Maps/Skyline/Models/guolf.xpl" }, { X: 121, Y: 32, FileUrl: $.page.webSiteRootUrl + "Web/Maps/Skyline/Models/guolf.xpl"}],
                    XFieldName: "X",
                    YFieldName: "Y",
                    AltitudeFieldName: "Altitude",
                    AltitudeDefaultValue: 0,
                    AltitudeTypeFieldName: "AltitudeType",
                    AltitudeTypeDefaultValue: 0,
                    YawFieldName: "Yaw",
                    YawDefaultValue: 0,
                    PitchFieldName: "Pitch",
                    PitchDefaultValue: 0,
                    RollFieldName: "Roll",
                    RollDefaultValue: 0,
                    FileNameFieldName: "FileUrl",
                    ScaleFieldName: "Scale",
                    ScaleDefaultValue: 300,
                    DescriptionFieldName: "Description",
                    MaxViewingHeight: 200000,
                    MinViewingHeight: 0,
                    ClientDataName: "Entity",
                    LayerName: "Model",
                    OnClick: function (Entity, Object) { alert(Entity.X); }
                };
            },
            LayerFlash: function (Properties) {
                /// <summary>
                ///     图层闪烁
                /// </summary>
                /// <param name="Properties" type="object">
                ///     一组用于默认配置的键/值对
                ///      1: LayerName: "Label"                                                    - 图层名称
                /// </param>
                ///	<returns></returns>
                var Settings = {
                    LayerName: "Label"
                };
            },
            LayerStop: function (Properties) {
                /// <summary>
                ///     图层停止闪烁
                /// </summary>
                /// <param name="Properties" type="object">
                ///     一组用于默认配置的键/值对
                ///      1: LayerName: "Label"                                                    - 图层名称
                ///      2: IsShow: true                                                          - 图层停止闪烁后的显示状态
                /// </param>
                ///	<returns></returns>
                var Settings = {
                    LayerName: "Label",
                    IsShow: true
                };
            }
        },
        Navigate: {
            GetPosition: function (Properties) {
                /// <summary>
                ///     获得当前视野的IPosition61对象
                /// </summary>
                /// <param name="Properties" type="object">
                ///     一组用于默认配置的键/值对
                ///      1: AltitudeType: 0                                                       - 高度类型 0-相对高度 1-相对支点高度 2-相对地面高度 3-绝对高度 999-默认值
                /// </param>
                ///	<returns></returns>
                var Settings = {
                    AltitudeType: 0
                };
            },
            SetPosition: function (Properties) {
                /// <summary>
                ///     设置当前地图的视野
                /// </summary>
                /// <param name="Properties" type="object">
                ///     IPosition61对象
                /// </param>
                ///	<returns></returns>
            },
            ZoomIn: function (Properties) {
                /// <summary>
                ///     地图放大
                /// </summary>
                /// <param name="Properties" type="object">
                ///     一组用于默认配置的键/值对
                ///      1: delta: 0                                                              - 摄像机靠近地球的距离
                /// </param>
                ///	<returns></returns>
                var Settings = {
                    delta: 0
                };
            },
            ZoomOut: function (Properties) {
                /// <summary>
                ///     地图缩小
                /// </summary>
                /// <param name="Properties" type="object">
                ///     一组用于默认配置的键/值对
                ///      1: delta: 0                                                              - 摄像机离开地球的距离
                /// </param>
                ///	<returns></returns>
                var Settings = {
                    delta: 0
                };
            },
            ZoomTo: function (Properties) {
                /// <summary>
                ///     摄像机的变焦操作
                /// </summary>
                /// <param name="Properties" type="object">
                ///     一组用于默认配置的键/值对
                ///      1: distanceFromPOI: 0                                                    - 摄像机距离地球的距离
                ///      2: Flags: 0                                                              - 变焦级别
                /// </param>
                ///	<returns></returns>
                var Settings = {
                    distanceFromPOI: 0,
                    Flags: 0
                };
            },
            FlyTo: function (Properties) {
                /// <summary>
                ///     飞行的执行项
                /// </summary>
                /// <param name="Properties" type="object">
                ///     一组用于默认配置的键/值对
                ///      1: PathName: null                                                         - 对象在Skyline ProjectTree树的路径 （\\目录1\\目录2）
                ///      2: ObjectID: null                                                         - 对象的ID
                ///      3: ItemID: null                                                           - 对象在Skyline ProjectTree树中的ID
                ///      4: target: null                                                           - 飞行到的目标，支持 ID Object IPosition61对象
                ///      5: Pattern: null                                                          - 飞行的方式
                /// </param>
                ///	<returns></returns>
                var Settings = {
                    PathName: null,
                    ObjectID: null,
                    ItemID: null,
                    target: null,
                    Pattern: 0
                };
            },
            GoDefaultPosition: function (Properties) {
                /// <summary>
                ///     飞行到打开地图时的默认位置
                /// </summary>
                /// <param name="Properties" type="object">
                ///     一组用于默认配置的键/值对
                ///      1: Pattern: null                                                          - 飞行的方式
                /// </param>
                ///	<returns></returns>
                var Settings = {
                    Pattern: 0
                };
            }
        },
        Charts: {
            GetCircleVertices: function (Properties) {
                /// <summary>
                ///     获得一个圆的坐标集合
                /// </summary>
                /// <param name="Properties" type="object">
                ///     一组用于默认配置的键/值对
                ///      1: Radius: 20000                                                          - 圆的半径20000米
                ///      2: Point: { X: 120, Y: 31}                                                - 圆中心点的坐标 
                ///      3: Accuracy: 0                                                            - 圆的精度0-100等分 1-1000等分 2-10000等分
                /// </param>
                ///	<returns></returns>
                var Settings = {
                    Radius: 20000,
                    Point: { X: 120, Y: 31 },
                    Accuracy: 0
                };
            }
            //图表的组名
            ,
            ChartPathName: "SkylineChart",
            Clear: function () {
                /// <summary>
                ///     清除图表
                /// </summary>
                ///	<returns></returns>
            },
            Chart: function (Properties) {
                /// <summary>
                ///     画图
                /// </summary>
                /// <param name="Properties" type="object">
                ///     一组用于默认配置的键/值对
                ///      1: chart:  { "type": "column" }                                           - 图标的类型 column pie image
                /// </param>
                ///	<returns></returns>
                var ChartOptions;
                //柱状图参数
                ChartOptions = {
                    "chart": { "type": "column" },
                    "xAxis": { "categories": ["苏州市", "无锡市", "常州市"] },
                    "categoriesPointDictionary": { "苏州市": { X: 120.4500, Y: 31.1500 }, "无锡市": { X: 119.9500, Y: 31.3500 }, "常州市": { X: 119.9500, Y: 31.7900} },
                    "series": [{ "name": "1类", "data": [1, 2, 3, 4] }, { "name": "2类", "data": [5, 6, 7, 8] }, { "name": "3类", "data": [8, 7, 6, 5] }, { "name": "4类", "data": [4, 3, 2, 1]}],
                    Width: 8000 //柱状图的长度       
                    ,
                    Depth: 8000 //柱状图的宽度
                    ,
                    HeightFunction: function (value) {
                        if (value != null) {
                            return value * 2000;
                        }
                    } //柱状图的高度根据值决定（等比放大）
                    ,
                    Altitude: 2000 //柱状图距离地面的绝对高度
                    ,
                    ColorArray: $.Page.ColorArray //柱状图的颜色
                    ,
                    ChartName: "Temporary" //柱状图的名称
                    ,
                    MeasurementUnit: "" //柱状图的单位
                    ,
                    SpacingFunction: function (Width) { return Width * 0.1; } //柱状图的间距根据宽度决定
                    ,
                    ToolTipTextFunction: function (Entity) { //柱状图的文字显示
                        if (Entity != null) {
                            return Entity.name + "：" + Entity.value + " " + Entity.MeasurementUnit + "\r\n比例：" + Math.round(Entity.value / Entity.Total * 10000) / 100 + "%";
                        };
                    },
                    MaxVisibilityDistance: 2000000 //柱状图最大可见距离
                    ,
                    MinVisibilityDistance: 0 //柱状图最小可见距离
                    ,
                    MaxViewingHeight: 100000 //柱状图文字最大可见距离
                    ,
                    MinViewingHeight: 0 //柱状图文字最小可见距离
                };
                //饼图参数
                ChartOptions = {
                    "chart": { "type": "pie" },
                    "xAxis": { "categories": ["苏州市", "无锡市", "常州市"] },
                    "categoriesPointDictionary": { "苏州市": { X: 120.4500, Y: 31.1500 }, "无锡市": { X: 119.9500, Y: 31.3500 }, "常州市": { X: 119.9500, Y: 31.7900} },
                    "series": [{ "name": "1类", "data": [1, 2, 3, 4] }, { "name": "2类", "data": [5, 6, 7, 8] }, { "name": "3类", "data": [8, 7, 6, 5] }, { "name": "4类", "data": [4, 3, 2, 1]}],
                    Radius: 20000 //饼图的半径20000米                    
                    ,
                    Accuracy: 0 //饼图的精度0-100等分 1-1000等分 2-10000等分
                    ,
                    Height: 2000 //饼图的高度2000米
                    ,
                    Altitude: 2000 //饼图距离地面的绝对高度
                    ,
                    ColorArray: $.Page.ColorArray //饼图的颜色
                    ,
                    ChartName: "Temporary" //饼图的名称
                    ,
                    MeasurementUnit: "" //饼图的单位
                    ,
                    ToolTipTextFunction: function (Entity) { //柱状图的文字显示
                        if (Entity != null) {
                            return Entity.name + "：" + Entity.value + " " + Entity.MeasurementUnit + "\r\n比例：" + Math.round(Entity.value / Entity.Total * 10000) / 100 + "%";
                        };
                    },
                    MaxVisibilityDistance: 2000000 //饼图最大可见距离
                    ,
                    MinVisibilityDistance: 0 //饼图最小可见距离
                    ,
                    MaxViewingHeight: 100000 //饼图文字最大可见距离
                    ,
                    MinViewingHeight: 0 //饼图文字最小可见距离
                };
                //面积图参数
                ChartOptions = {
                    "chart": { "type": "image" },
                    ChartName: "Temporary" //面积图名称
                    ,
                    Extent: {
                        //面积图范围
                        XMin: 112.8324354312448,
                        YMin: 29.711810295,
                        XMax: 126.0380018374948,
                        YMax: 36.63319701375,
                        wkid: 4326
                    } //面积图图片地址
                    ,
                    Url: "http://192.168.253.11/ArcGIS/rest/services/RasterLayer/MapServer/export?dpi=96&transparent=true&format=png8&layers=show%3A0&bbox=112.8324354312448%2C29.711810295%2C126.0380018374948%2C36.63319701375&bboxSR=4326&imageSR=4326&size=1202%2C630&f=image"
                };
            }
        },
        Flight: {
            //飞行的组名
            FlightPathName: "DynamicFlight",
            Clear: function () {
                /// <summary>
                ///     清除飞行
                /// </summary>
                ///	<returns></returns>
            },
            PlaneStart: function (Properties) {
                /// <summary>
                ///     开始飞行
                /// </summary>
                /// <param name="Properties" type="object">
                ///     一组用于默认配置的键/值对
                ///      1: PathName: null                                                         - 对象在Skyline ProjectTree树的路径 （\\目录1\\目录2）
                ///      2: ObjectID: null                                                         - 对象的ID
                ///      3: ItemID: null                                                           - 对象在Skyline ProjectTree树中的ID
                ///      3: Altitude: 0                                                            - 高度(海拔)
                ///      4: Speed: 360                                                             - 飞行速度
                ///      5: Yaw: 0                                                                 - 水平方向 向右旋转角度
                ///      6: Pitch: 0                                                               - 垂直方向 向上旋转角度
                ///      7: Roll: 0                                                                - 垂直方向 向右旋转角度
                ///      8: CameraDeltaYaw: 0                                                      - 摄像机倾斜和飞机倾斜之间的偏移距
                ///      9: CameraDeltaPitch: 0                                                    - 摄像机和飞机之间的偏移量
                ///     10: MotionStyle: 1                                                         - 对象的运动特性 0-俯仰和滚动由地形决定 1-机头始终执行一个航点 2-倾斜-30度翻滚为0 3-俯仰和滚动为0
                ///     11: ObjectType: 3                                                          - 对象的类型
                ///     12: FileNameOrText: ""                                                     - 文件地址或者文本
                ///     13: ScaleFactor: 1                                                         - 物体的尺寸
                ///     14: AltitudeType: 0                                                        - 高度类型 0-相对高度 1-相对支点高度 2-相对地面高度 3-绝对高度 999-默认值
                ///     15: Description: ""                                                        - 描述
                /// </param>
                ///	<returns></returns>
                var Settings = {
                    PathName: null,
                    ObjectID: null,
                    ItemID: null,
                    Altitude: 0,
                    Speed: 360,
                    Yaw: 0,
                    Pitch: 0,
                    Roll: 0,
                    CameraDeltaYaw: 0,
                    CameraDeltaPitch: 0,
                    MotionStyle: 1,
                    ObjectType: 3,
                    FileNameOrText: "",
                    ScaleFactor: 1,
                    AltitudeType: 0,
                    Description: ""
                };
            },
            PlanePause: function () {
                /// <summary>
                ///     暂停飞行
                /// </summary>
                ///	<returns></returns>
            },
            PlaneContinue: function () {
                /// <summary>
                ///     继续飞行
                /// </summary>
                ///	<returns></returns>
            }
        }
    }
};

