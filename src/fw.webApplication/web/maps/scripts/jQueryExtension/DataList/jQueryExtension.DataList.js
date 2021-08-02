$.DataList = {
    MaxPageSize: 1000
    , Settings: function () {
        return {
            Selector: null
            , IsShowHead: false                                     //是否显示头部
            , IsShowFoot: true                                      //是否显示分页
            , IsFillBodyRow: true                                   //是否填满数据行
            , AllowRowSelected: true                                //是否允许选中行
            , AllowSelectedFirstRow: true                           //是否允许选中第一行                

            , RecordCount: -1                                       //总记录条数
            , PageSize: -1                                          //每页显示的记录条数
            , PageNow: 1                                            //当前页数
            , DataSource: []                                        //DataList的数据源

            , CallMethodName: null                                  //DataList绑定的方法调用名称
            , Height: null                                          //数据表高度
            , RowWidth: "300px"
            , RowHeight: "80px"
            //头部的Html
            , BodyRowFunction: function (Entity, Settings) {
                var ObjectList = [];
                ObjectList.push($());
                return ObjectList;
            }                                                  //分页的Html
            , OnSelectedIndexChanging: function (Entity, NewSelectedIndex) { }
            , OnPageIndexChanging: function (NewPageIndex) { }
            , OnDataBound: function (ControlData) { }

        };
    }
    , FillBodyRowFunction: function (Properties) {
        var Settings = {
            Selector: null                                       //DataList控件选择器
        };
        $.extend(Settings, Properties);
        var ControlData = $(Settings.Selector).data("ControlData");
        var ObjectList = [];
        ObjectList.push($());
        return ObjectList;
    }                                                    //数据的Html
    , FootFunction: function (Properties) {
        var Settings = {
            Selector: null                                       //DataList控件选择器
        };
        $.extend(Settings, Properties);
        var ControlData = $(Settings.Selector).data("ControlData");
        ControlData.PageSize = ControlData.Settings.PageSize;
        ControlData.PageNow = ControlData.Settings.PageNow;
        var PageCount = ControlData.Settings.RecordCount % ControlData.PageSize == 0 ? parseInt(ControlData.Settings.RecordCount / ControlData.PageSize) : parseInt(ControlData.Settings.RecordCount / ControlData.PageSize) + 1;
        if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
            ControlData.ControlJQs.DataList_FootLeft_aRecordCountJQ.html(ControlData.Settings.RecordCount);
            ControlData.ControlJQs.DataList_FootLeft_aPageSizeJQ.html(ControlData.PageSize);
            ControlData.ControlJQs.DataList_FootLeft_aPageNowJQ.html(ControlData.PageNow);

            ControlData.ControlJQs.DataList_FootRight_LiFirstPageJQ.removeClass("jQueryExtension_UI_DataList_FootRight_liPageChange").removeData("NewPageIndex");
            ControlData.ControlJQs.DataList_FootRight_LiPageUpJQ.removeClass("jQueryExtension_UI_DataList_FootRight_liPageChange").removeData("NewPageIndex");
            ControlData.ControlJQs.DataList_FootRight_LiPageDownJQ.removeClass("jQueryExtension_UI_DataList_FootRight_liPageChange").removeData("NewPageIndex");
            ControlData.ControlJQs.DataList_FootRight_LiLastPageJQ.removeClass("jQueryExtension_UI_DataList_FootRight_liPageChange").removeData("NewPageIndex");

            if (PageCount > 1) {
                if (ControlData.PageNow == 1) {
                    ControlData.ControlJQs.DataList_FootRight_LiPageDownJQ.addClass("jQueryExtension_UI_DataList_FootRight_liPageChange").data("NewPageIndex", ControlData.PageNow + 1);
                    ControlData.ControlJQs.DataList_FootRight_LiLastPageJQ.addClass("jQueryExtension_UI_DataList_FootRight_liPageChange").data("NewPageIndex", PageCount);
                } else if (ControlData.PageNow == PageCount) {
                    ControlData.ControlJQs.DataList_FootRight_LiFirstPageJQ.addClass("jQueryExtension_UI_DataList_FootRight_liPageChange").data("NewPageIndex", 1);
                    ControlData.ControlJQs.DataList_FootRight_LiPageUpJQ.addClass("jQueryExtension_UI_DataList_FootRight_liPageChange").data("NewPageIndex", ControlData.PageNow - 1);
                } else {
                    ControlData.ControlJQs.DataList_FootRight_LiFirstPageJQ.addClass("jQueryExtension_UI_DataList_FootRight_liPageChange").data("NewPageIndex", 1);
                    ControlData.ControlJQs.DataList_FootRight_LiPageUpJQ.addClass("jQueryExtension_UI_DataList_FootRight_liPageChange").data("NewPageIndex", ControlData.PageNow - 1);
                    ControlData.ControlJQs.DataList_FootRight_LiPageDownJQ.addClass("jQueryExtension_UI_DataList_FootRight_liPageChange").data("NewPageIndex", ControlData.PageNow + 1);
                    ControlData.ControlJQs.DataList_FootRight_LiLastPageJQ.addClass("jQueryExtension_UI_DataList_FootRight_liPageChange").data("NewPageIndex", PageCount);
                };
            };
        };
    }
    , GetLiRowSelectedJQ: function (Properties) {
        var Settings = {
            Selector: null                                       //DataList控件选择器
        };
        $.extend(Settings, Properties);

        var JQ;
        var ControlData = $(Settings.Selector).data("ControlData");
        if (fw.fwObject.FWObjectHelper.hasValue(ControlData.ControlJQs.DataList_TbodyBody_TrRow_ArrowJQ)) {
            JQ = ControlData.ControlJQs.DataList_TbodyBody_TrRow_ArrowJQ.filter("tr.jQueryExtension_UI_DataList_TbodyBody_TrRowSelected");
        } else {
            JQ = $();
        };
        return JQ;
    }
     , GetSelectedEntity: function (Properties) {
         var Settings = {
             Selector: null                                       //DataList控件选择器
         };
         $.extend(Settings, Properties);

         var Entity = $.DataList.GetTrRowSelectedJQ({ Selector: Settings.Selector }).data("Entity");
         if (Entity == undefined) {
             Entity = null;
         };
         return Entity;
     }
     , MoveTrRowSelected: function (DataListSelector, Direction) {
         var TrRowSelectedJQ = $("tr.jQueryExtension_UI_DataList_TbodyBody_TrRowSelected", DataListSelector);
         if (Direction == -1) {
             TrRowSelectedJQ.prev().before(TrRowSelectedJQ);
         } else {
             TrRowSelectedJQ.next().after(TrRowSelectedJQ);
         };
     }
     , GetTrRowJQs: function (DataListSelector) {
         var ControlJQs = $(DataListSelector).data("ControlJQs");
         if (fw.fwObject.FWObjectHelper.hasValue(ControlJQs)) {
             return $(">tr.jQueryExtension_UI_DataList_TbodyBody_TrRow:not(.jQueryExtension_UI_DataList_TbodyBody_TrFillRow)", ControlData.ControlJQs.DataList_TbodyBodyJQ);
         } else {
             return null;
         };
     }
     , GetPageSize: function (Properties) {
         var Settings = {
             Selector: null                                       //DataList控件选择器
             , PageSize: 20                                     //分页大小
         };
         $.extend(Settings, Properties);

         Settings.PageSize = Settings.PageSize > $.DataList.MaxPageSize ? $.DataList.MaxPageSize : Settings.PageSize;
         var ControlData = $(Settings.Selector).data("ControlData");
         if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
             if (!fw.fwObject.FWObjectHelper.hasValue(ControlData.PageSize)) {
                 ControlData.PageSize = Settings.PageSize;
             } else {
                 Settings.PageSize = ControlData.PageSize;
             };
         };
         return Settings.PageSize;
     }
     , Select: function (Properties) {
         var Settings = {
             Selector: null                                       //DataList控件选择器
            , SelectedIndex: -1                                   //选中行号
         };
         $.extend(Settings, Properties);

         var ControlData = $(Settings.Selector).data("ControlData");
         $(">tr:eq(" + Settings.SelectedIndex + ")", ControlData.ControlJQs.DataList_TbodyBody_ArrowJQ).click();
     }
     , Empty: function (Properties) {
         var Settings = {
             Selector: null                                       //DataList控件选择器
         };
         $.extend(Settings, Properties);

         $(Settings.Selector).removeData("ControlData").removeData("ColumnList").removeData("DataListChart").removeData("OnPageIndexChanging").empty();
     }
     , ClearDataSource: function (Properties) {
         var Settings = {
             Selector: null                                       //DataList控件选择器
             , PageSize: 20
         };
         $.extend(Settings, Properties);

         var SelectorJQ = $(Settings.Selector);
         var ControlData = SelectorJQ.data("ControlData");
         if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
             ControlData.Settings.RecordCount = 0;
             ControlData.Settings.PageSize = Settings.PageSize
             ControlData.Settings.PageNow = 0;
             ControlData.Settings.DataSource = [];
             SelectorJQ.DataList(ControlData.Settings);
         };
     }
     , Refresh: function (Properties) {
         var Settings = {
             Selector: null                                       //DataList控件选择器
         };
         $.extend(Settings, Properties);

         var ControlData = $(Settings.Selector).data("ControlData");
         ControlData.ControlJQs.DataList_trFoot_tdFootLeft_spanFootRefreshJQ.click();
     }
     , ResizeWidthHeight: function (Properties) {
         /// <summary>
         ///     改变指定元素宽度高度，并触发大小改变事件
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
            , IsMustResize: false
         };
         $.extend(Settings, Properties);

         if (fw.fwObject.FWObjectHelper.hasValue(Settings.Selector)) {
             var SelectorJQ = $(Settings.Selector);
             SelectorJQ.each(function () {
                 var ControlData = $(this).data("ControlData");
                 if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                     var IsResize = false;

                     if (fw.fwObject.FWObjectHelper.hasValue(Settings.Width) && ControlData.ControlJQs.DataListJQ.width() != Settings.Width) {
                         SelectorJQ.width(Settings.Width);
                         IsResize = true;
                     };
                     if (fw.fwObject.FWObjectHelper.hasValue(Settings.Height) && ControlData.ControlJQs.DataListJQ.height() != Settings.Height) {
                         IsResize = true;
                     };
                     if (IsResize || Settings.IsMustResize) {
                         ControlData.IsResize = true;
                         var FootHeight = ControlData.ControlJQs.DataList_DivFootJQ.is(":hidden") ? 0 : ControlData.ControlJQs.DataList_DivFootJQ.height() + 2;
                         var HeadAndBodyHeight = Settings.Height - FootHeight;
                         var HeadHeight = ControlData.ControlJQs.DataList_DivHeadJQ.is(":hidden") ? 0 : ControlData.ControlJQs.DataList_DivHeadJQ.height() + 2;
                         var BodyHeight = HeadAndBodyHeight - HeadHeight - 0;

                         ControlData.ControlJQs.DataList_DivBodyJQ.height(BodyHeight);
                         jQueryExtension.ResizeWidthHeight({
                             Selector: ControlData.ControlJQs.DataList_DivBodyJQ.css("overflow", "auto")
                            , Width: Settings.Width
                            , Height: BodyHeight
                            , IsMustResize: Settings.IsMustResize
                         });

                         //                         if ($.browser.msie) {
                         //                             if (jQueryExtension.ScrollLeft(ControlData.ControlJQs.DataList_DivBody_ScrollJQ) > 0) {
                         //                                 if (ControlData.ControlJQs.DataList_DivBody_ScrollJQ.width() - ControlData.ControlJQs.DataList_TableBody_ScrollJQ.width() >= 17) {
                         //                                     ControlData.ControlJQs.DataList_DivBody_ScrollJQ.css("overflow-x", "hidden");
                         //                                     jQueryExtension.ScrollLeft(ControlData.ControlJQs.DataList_DivBody_ScrollJQ, 0);
                         //                                 } else {
                         //                                     ControlData.ControlJQs.DataList_DivBody_ScrollJQ.css("overflow-x", "auto");
                         //                                 };
                         //                                 ControlData.ControlJQs.DataList_DivBody_ScrollJQ.scroll();
                         //                                 ControlData.ControlJQs.DataList_DivBody_ScrollJQ.scroll();
                         //                             };
                         //                         };

                         //                         ControlData.ControlJQs.DataList_trFoot_tdFootRightJQ.show();
                         //                         if (ControlData.ControlJQs.DataList_DivFootJQ.width() < ControlData.ControlJQs.DataList_TableFootJQ.width()) {
                         //                             ControlData.ControlJQs.DataList_trFoot_tdFootRightJQ.hide();
                         //                         };

                     };
                 };
             });
         };
     }

};


//分页DataList
$.fn.extend({
    DataList_Init: function (Properties) {
        if (!fw.fwObject.FWObjectHelper.hasValue(Properties)) { Properties = {}; };
        var Settings = $.DataList.Settings();
        $.extend(Settings, Properties);

        this.each(function () {
            var DataListJQ = $(this);
            var ControlData = DataListJQ.data("ControlData");

            //判断DataList有没缓存数据，有表示已经加载控件，无表示控件第一次加载
            if (!fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                ControlData = {
                    Settings: Settings
                    , ScrollLeft: 0
                    , ScrollTop: 0
                    , IsResize: false
                };
                DataListJQ.data("ControlData", ControlData);

                var WindowGuid = fw.guid();
                var Html = "";
                Html += "<div class=\"jQueryExtension_UI_DataList_Head\">";
                Html += "    <ul class=\"jQueryExtension_UI_DataList_Head\">";
                Html += "    </ul>";
                Html += "</div>";
                Html += "<div class=\"jQueryExtension_UI_DataList_Body\">";
                Html += "    <ul class=\"jQueryExtension_UI_DataList_Body\"></ul>";
                Html += "</div>";
                Html += "<div class=\"jQueryExtension_UI_DataList_Foot\">";
                Html += "    <ul class=\"jQueryExtension_UI_DataList_FootLeft\">";
                Html += "        <li><div><span>共</span><a class=\"jQueryExtension_UI_DataList_FootLeft_RecordCount\">0</a><span>条记录，每页</span><a class=\"jQueryExtension_UI_DataList_FootLeft_PageSize\">0</a><span>条，当前第</span><a class=\"jQueryExtension_UI_DataList_FootLeft_PageNow\">0</a><span>页</span></div></li>";
                Html += "    </ul>";
                Html += "    <ul class=\"jQueryExtension_UI_DataList_FootRight\">";
                Html += "        <li class=\"jQueryExtension_UI_DataList_FootRight_Refresh\"><div>刷 新</div></li>";
                Html += "        <li class=\"jQueryExtension_UI_DataList_FootRight_FirstPage\"><div>首 页</div></li>";
                Html += "        <li class=\"jQueryExtension_UI_DataList_FootRight_PageUp\"><div>上一页</div></li>";
                Html += "        <li class=\"jQueryExtension_UI_DataList_FootRight_PageDown\"><div>下一页</div></li>";
                Html += "        <li class=\"jQueryExtension_UI_DataList_FootRight_LastPage\"><div>末 页</div></li>";
                Html += "    </ul>";
                Html += "</div>";
                Html += "<div class=\"jQueryExtension_UI_DataList_DivLoading\"></div>";
                $(Html).appendTo(DataListJQ);

                ControlData.PageNow = 1;
                ControlData.SelectedIndex = 0;

                ControlData.ControlJQs = {
                    IsInit: true
                    , WindowGuid: WindowGuid
                    , DataListJQ: DataListJQ.data("WindowGuid", WindowGuid).addClass('jQueryExtension_UI_DataList')
                };
                ControlData.ControlJQs.DataList_DivHeadJQ = $(">div.jQueryExtension_UI_DataList_Head", ControlData.ControlJQs.DataListJQ);
                ControlData.ControlJQs.DataList_UlHeadJQ = $(">ul.jQueryExtension_UI_DataList_Head", ControlData.ControlJQs.DataList_DivHeadJQ);
                ControlData.ControlJQs.DataList_DivBodyJQ = $(">div.jQueryExtension_UI_DataList_Body", ControlData.ControlJQs.DataListJQ);
                ControlData.ControlJQs.DataList_UlBodyJQ = $(">ul.jQueryExtension_UI_DataList_Body", ControlData.ControlJQs.DataList_DivBodyJQ);
                ControlData.ControlJQs.DataList_DivFootJQ = $(">div.jQueryExtension_UI_DataList_Foot", ControlData.ControlJQs.DataListJQ);
                ControlData.ControlJQs.DataList_UlFootLeftJQ = $(">ul.jQueryExtension_UI_DataList_FootLeft", ControlData.ControlJQs.DataList_DivFootJQ);
                ControlData.ControlJQs.DataList_FootLeft_aRecordCountJQ = $(">li>div>a.jQueryExtension_UI_DataList_FootLeft_RecordCount", ControlData.ControlJQs.DataList_UlFootLeftJQ);
                ControlData.ControlJQs.DataList_FootLeft_aPageSizeJQ = $(">li>div>a.jQueryExtension_UI_DataList_FootLeft_PageSize", ControlData.ControlJQs.DataList_UlFootLeftJQ);
                ControlData.ControlJQs.DataList_FootLeft_aPageNowJQ = $(">li>div>a.jQueryExtension_UI_DataList_FootLeft_PageNow", ControlData.ControlJQs.DataList_UlFootLeftJQ);
                ControlData.ControlJQs.DataList_UlFootRightJQ = $(">ul.jQueryExtension_UI_DataList_FootRight", ControlData.ControlJQs.DataList_DivFootJQ);
                ControlData.ControlJQs.DataList_FootRight_LiRefreshJQ = $(">li.jQueryExtension_UI_DataList_FootRight_Refresh", ControlData.ControlJQs.DataList_UlFootRightJQ);
                ControlData.ControlJQs.DataList_FootRight_LiFirstPageJQ = $(">li.jQueryExtension_UI_DataList_FootRight_FirstPage", ControlData.ControlJQs.DataList_UlFootRightJQ);
                ControlData.ControlJQs.DataList_FootRight_LiPageUpJQ = $(">li.jQueryExtension_UI_DataList_FootRight_PageUp", ControlData.ControlJQs.DataList_UlFootRightJQ);
                ControlData.ControlJQs.DataList_FootRight_LiPageDownJQ = $(">li.jQueryExtension_UI_DataList_FootRight_PageDown", ControlData.ControlJQs.DataList_UlFootRightJQ);
                ControlData.ControlJQs.DataList_FootRight_LiLastPageJQ = $(">li.jQueryExtension_UI_DataList_FootRight_LastPage", ControlData.ControlJQs.DataList_UlFootRightJQ);
                ControlData.ControlJQs.DataList_DivLoadingJQ = $(">div.jQueryExtension_UI_DataList_DivLoading", ControlData.ControlJQs.DataListJQ);

                //左下角刷新事件绑定
                ControlData.ControlJQs.DataList_FootRight_LiRefreshJQ.bind("click", function () {
                    if ($.isFunction(ControlData.Settings.OnPageIndexChanging)) {
                        ControlData.Settings.OnPageIndexChanging(ControlData.PageNow);
                    };
                });

                //首页 上一页 下一页 末页 事件绑定
                ControlData.ControlJQs.DataList_FootRight_LiFirstPageJQ.add(ControlData.ControlJQs.DataList_FootRight_LiPageUpJQ).add(ControlData.ControlJQs.DataList_FootRight_LiPageDownJQ).add(ControlData.ControlJQs.DataList_FootRight_LiLastPageJQ).bind("click", function () {
                    var NewPageIndex = $(this).data("NewPageIndex");
                    if (NewPageIndex != undefined) {
                        if ($.isFunction(ControlData.Settings.OnPageIndexChanging)) {
                            ControlData.Settings.OnPageIndexChanging(NewPageIndex);
                        };
                    };
                });

            } else {
                ControlData.ControlJQs.IsInit = false;
                ControlData.Settings.RecordCount = Settings.RecordCount;
                ControlData.Settings.PageSize = Settings.PageSize;
                ControlData.Settings.PageNow = Settings.PageNow;
                ControlData.Settings.DataSource = Settings.DataSource;
            };


            //如果指定了空间高度，则触发控件Resize事件，重置控件 表头 数据表 表尾 布局
            if (fw.fwObject.FWObjectHelper.hasValue(Settings.Height)) {
                $.DataList.ResizeWidthHeight({
                    Selector: ControlData.ControlJQs.DataListJQ
                    , IsShowHead: Settings.IsShowHead
                    , IsShowFoot: Settings.IsShowFoot
                    , Height: Settings.Height
                });
            };

            ControlData.ControlJQs.DataList_UlBodyJQ.empty();
            //是否进行空数据填充
            if (ControlData.Settings.IsFillBodyRow) {
                var LiRowJQ = $("<li class=\"jQueryExtension_UI_DataList_Body_LiFillRow\"><div></div></li>");

                for (var i = 0; i < ControlData.PageSize; i++) {
                    LiRowJQ.clone().appendTo(ControlData.ControlJQs.DataList_UlBodyJQ);
                };
            };

            //打开加载锁定屏
            if ($.browser.msie && $.browser.version == "6.0") {
                $("select", ControlData.ControlJQs.DataListJQ).hide();
                ControlData.ControlJQs.DataList_DivLoadingJQ.css("background-color", "transparent").height(ControlData.ControlJQs.DataListJQ.height()).show();
            } else {
                ControlData.ControlJQs.DataList_DivLoadingJQ.css("background-color", "Black").css("opacity", 0.2).show();
            };
        });
    }
    , DataList_Loading: function () {
        this.each(function () {
            var ControlData = $(this).data("ControlData");
            ControlData.ControlJQs.DataList_DivLoadingJQ.show();
        });
    }
    , DataList: function (Properties) {
        if (!fw.fwObject.FWObjectHelper.hasValue(Properties)) { Properties = {}; };
        var Settings = $.DataList.Settings();
        $.extend(Settings, Properties);

        var SelectorJQ = this;
        if (SelectorJQ.length > 0) {
            //初始化控件
            SelectorJQ.DataList_Init(Settings);

            SelectorJQ.each(function () {
                var DataListJQ = $(this);
                var ControlData = DataListJQ.data("ControlData");
                if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {


                    var DataListHeight = ControlData.ControlJQs.DataListJQ.height();

                    //是否显示表头
                    if (!ControlData.Settings.IsShowHead) {
                        ControlData.ControlJQs.DataList_DivHeadJQ.hide();
                    } else {
                        ControlData.ControlJQs.DataList_DivHeadJQ.show();
                    };

                    //是否显示分页
                    if (!ControlData.Settings.IsShowFoot || ControlData.Settings.RecordCount == -1) {
                        ControlData.ControlJQs.DataList_DivFootJQ.hide();
                    } else {
                        ControlData.ControlJQs.DataList_DivFootJQ.show();
                    };

                    //辅助开发者取消全选框选中
                    $(":checkbox", ControlData.ControlJQs.DataList_DivHeadJQ).removeAttr("checked");

                    //清空数据
                    ControlData.ControlJQs.DataList_UlBodyJQ.empty();

                    if (ControlData.Settings.PageNow == 0) {
                        ControlData.Settings.PageNow = ControlData.PageNow;
                    } else {
                        ControlData.PageNow = ControlData.Settings.PageNow;
                    };

                    if (!fw.fwObject.FWObjectHelper.hasValue(ControlData.Settings.DataSource)) {
                        ControlData.Settings.DataSource = [];
                    };

                    //根据分页信息，计算数据表填入的数据
                    var LiRowFrom = 0;
                    var LiRowTo = 0;
                    var LiRowFillTo = 0;
                    if (ControlData.Settings.RecordCount == -1) {
                        ControlData.Settings.RecordCount = ControlData.Settings.DataSource.length;
                        if (ControlData.Settings.PageSize == -1) { ControlData.Settings.PageSize = ControlData.Settings.RecordCount; };
                        LiRowFrom = ControlData.Settings.PageSize * (ControlData.Settings.PageNow - 1);
                        LiRowTo = (ControlData.Settings.PageSize * ControlData.Settings.PageNow) > (ControlData.Settings.RecordCount - 1) ? ControlData.Settings.RecordCount : (ControlData.Settings.PageSize * ControlData.Settings.PageNow);
                        LiRowFillTo = ControlData.Settings.PageSize * ControlData.Settings.PageNow - LiRowTo;
                    } else {
                        LiRowTo = ControlData.Settings.DataSource.length;
                        LiRowFillTo = ControlData.Settings.PageSize - LiRowTo;
                    };

                    var LiRowLastJQ;
                    for (var i = LiRowFrom; i < LiRowTo; i++) {
                        var Entity = ControlData.Settings.DataSource[i];
                        var ObjectList = ControlData.Settings.BodyRowFunction(Entity, ControlData.Settings, i);

                        var LiRowJQ = $("<li></li>").appendTo(ControlData.ControlJQs.DataList_UlBodyJQ).data("Entity", Entity).css({ "width": ControlData.Settings.RowWidth, "height": ControlData.Settings.RowHeight });
                        var divJQ = $("<div></div>").appendTo(LiRowJQ);
                        for (var j = 0; j < ObjectList.length; j++) {
                            var InnerJQ = ObjectList[j];
                            if (!fw.fwObject.FWObjectHelper.hasValue(InnerJQ)) {
                                $("<a>&nbsp;</a>").appendTo(divJQ);
                            } else {
                                if (InnerJQ instanceof jQuery) {
                                    $(InnerJQ).appendTo(divJQ);
                                } else if (typeof (InnerJQ) == "string") {
                                    $("<a>" + InnerJQ + "</a>").appendTo(divJQ);
                                } else if (typeof (InnerJQ) == "number") {
                                    $("<a>" + InnerJQ + "</a>").appendTo(divJQ);
                                } else if (typeof (InnerJQ) == "object") {
                                    $("<a>&nbsp;</a>").appendTo(divJQ);
                                } else {
                                    $("<a>&nbsp;</a>").appendTo(divJQ);
                                };
                            };
                        };
                    };

                    //是否进行空数据填充
                    if (ControlData.Settings.IsFillBodyRow) {
                        var LiRowJQ = $("<li class=\"jQueryExtension_UI_DataList_Body_LiFillRow\"><div></div></li>").css({ "width": ControlData.Settings.RowWidth, "height": ControlData.Settings.RowHeight });

                        for (var i = 0; i < LiRowFillTo; i++) {
                            LiRowJQ.clone().appendTo(ControlData.ControlJQs.DataList_UlBodyJQ);
                        };
                    };


                    //重新生成分页
                    $.DataList.FootFunction({ Selector: ControlData.ControlJQs.DataListJQ });

                    ControlData.ControlJQs.DataList_UlBody_LiRowJQ = $(">li", ControlData.ControlJQs.DataList_UlBodyJQ);
                    var liRowJQ = ControlData.ControlJQs.DataList_UlBody_LiRowJQ.filter(":not(.jQueryExtension_UI_DataList_Body_LiFillRow)");

                    //----------------选中行事件处理（开始）----------------
                    //如果允许选中行，绑定行事件
                    if (ControlData.Settings.AllowRowSelected && ControlData.ControlJQs.DataList_UlBody_LiRowJQ.length > 0) {
                        liRowJQ.css("cursor", "pointer").bind("click", function (e) {
                            var liJQ = $(this);
                            ControlData.ControlJQs.DataList_UlBody_LiRowJQ.filter(".jQueryExtension_UI_DataList_Body_LiSelected").removeClass("jQueryExtension_UI_DataList_Body_LiSelected");
                            liJQ.addClass('jQueryExtension_UI_DataList_Body_LiSelected');
                            var SelectedIndex = ControlData.ControlJQs.DataList_UlBody_LiRowJQ.index(liJQ);
                            ControlData.SelectedIndex = SelectedIndex;

                            if ($.isFunction(ControlData.Settings.OnSelectedIndexChanging)) {
                                ControlData.Settings.OnSelectedIndexChanging(liJQ.data("Entity"), SelectedIndex);
                            };
                        });
                    };

                    //如果允许选中行，则默认选中的一行
                    if (ControlData.Settings.AllowRowSelected && ControlData.Settings.AllowSelectedFirstRow && ControlData.ControlJQs.DataList_UlBody_LiRowJQ.length > 0) {
                        ControlData.SelectedIndex = ControlData.SelectedIndex < liRowJQ.length ? ControlData.SelectedIndex : (liRowJQ.length - 1);
                        ControlData.SelectedIndex = ControlData.SelectedIndex < 0 ? 0 : ControlData.SelectedIndex;
                        var liJQ = ControlData.ControlJQs.DataList_UlBody_LiRowJQ.eq(ControlData.SelectedIndex);
                        liJQ.click();
                    };
                    //----------------选中行事件处理（结束）----------------

                    //如果指定了空间高度，则触发控件Resize事件，重置控件 表头 数据表 表尾 布局
                    if (ControlData.IsResize) {
                        $.DataList.ResizeWidthHeight({
                            Selector: ControlData.ControlJQs.DataListJQ
                            , Height: DataListHeight
                            , IsMustResize: true
                        });
                    };

                    //----------------数据绑定完成后事件（开始）----------------
                    if ($.isFunction(ControlData.Settings.OnDataBound)) {
                        ControlData.Settings.OnDataBound(ControlData);
                    };
                    //----------------数据绑定完成后事件（结束）----------------

                    //关闭加载锁定层
                    ControlData.ControlJQs.DataList_DivLoadingJQ.hide();
                    if ($.browser.msie && $.browser.version == "6.0") { $("select", ControlData.ControlJQs.DataListJQ).show(); };

                    //                    ControlData.ControlJQs.DataList_DivBody_ScrollJQ.scroll();
                };

                if (ControlData.Settings.DataSource.length < 1) {
                    if ($.isFunction(ControlData.Settings.OnSelectedIndexChanging)) {
                        ControlData.Settings.OnSelectedIndexChanging(null, -1);
                    };
                };
            });
        };
        return this;
    }
});