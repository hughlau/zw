(function () {
    function Load_jQuery() {
        if (window.$ == undefined) {
            loadScript(window.ScriptUrl + "jquery.min.js", Load_jQueryExtension);
        } else {
            Load_jQueryExtension();
        };
    };
    function Load_jQueryExtension() {
        if (window.$E == undefined) {
            loadLink(window.LinkUrl + "jQueryExtension/jQueryExtension.css", function () {
                loadScript(window.ScriptUrl + "jQueryExtension/jQueryExtension.js", Load_jQueryExtension_GridView);
            });
        } else {
            Load_jQueryExtension_GridView();
        };
    };
    function Load_jQueryExtension_GridView() {
        if ($.GridView == undefined) {
            loadLink(window.LinkUrl + "jQueryExtension/GridView/jQueryExtension_GridView.css", function () {
                ControlLoad();
            });
        };
    };


    var ControlLoad = function () {
        $.GridView = {
            ColumnMinWidth: 100
            , MaxPageSize: 1000
            , LineHeight: 26
            , Column: function () {
                return {
                    HeadText: ''                                             //列表头文本
                    , ColumnText: ''                                         //列名称
                    , DataField: ''                                          //列绑定字段名称
                    , MeasurementUnit: ''                                    //如果是数值字段，这里就存放计量单位
                    , Width: $.GridView.ColumnMinWidth                       //列宽度
                    , HeadAlignment: 'center'                                //列的对齐方式 left|center|right
                    , BodyAlignment: 'center'                                //列的对齐方式 left|center|right
                    , Format: function (Value, Entity) { return Value }      //数据格式化
                    , IsShow: true                                           //是否显示该列
                    , IsLock: false                                          //是否锁定该列
                    , SortType: undefined                                   //Asc-递增 Desc-递减 "Inherit"-默认
                };
            }
            , Settings: function () {
                return {
                    Selector: null
                    , IsShowHead: true                                      //是否显示头部
                    , IsShowFoot: true                                      //是否显示分页
                    , IsShowSelectedArrowhead: true                         //是否显示选中箭头
                    , IsFillBodyRow: true                                   //是否填满数据行
                    , AllowRowSelected: true                                //是否允许选中行
                    , AllowSelectedFirstRow: true                           //是否允许选中第一行                

                    , RecordCount: -1                                       //总记录条数
                    , PageSize: -1                                          //每页显示的记录条数
                    , PageNow: 1                                            //当前页数
                    , DataSource: []                                        //GridView的数据源

                    , CallMethodName: null                                  //GridView绑定的方法调用名称
                    , ColumnList: []                                           //GridView的列对象数组
                    , Height: null                                          //数据表高度
                    //头部的Html
                    , BodyRowFunction: function (Entity, Settings) {
                        var ObjectList = [];
                        for (var i = 0; i < Settings.ColumnList.length; i++) {
                            if (Settings.ColumnList[i].Format == undefined) {
                                ObjectList.push(Entity[Settings.ColumnList[i].DataField]);
                            } else {
                                ObjectList.push(Settings.ColumnList[i].Format(Entity[Settings.ColumnList[i].DataField], Entity));
                            };
                        };
                        return ObjectList;
                    }                                                  //分页的Html
                    , OnSelectedIndexChanging: function (Entity, NewSelectedIndex) { }
                    , OnPageIndexChanging: function (NewPageIndex) { }
                    , OnDataBound: function (ControlData) { }



                    , Chart__TargetElement: undefined                                                //见图表控件VisifireChart参数 TargetElement
                    , Chart__XapPath: undefined                                                      //见图表控件VisifireChart参数 XapPath
                    , Chart__X_DataFieldList: undefined                                                  //见图表控件VisifireChart参数 X_DataField
                    , Chart__Y_DataFieldList: undefined                                              //见图表控件VisifireChart参数 Y_DataFieldList
                    , Chart_Series_DataSeries_RenderAsList: ["Spline", "Line", "StepLine", "Column", "StackedColumn", "StackedColumn100", "Bar", "StackedBar", "StackedBar100", "Area", "Pie", "Doughnut", "Radar", "StreamLineFunnel", "Pyramid", "Bubble", "Point"]                                     //见图表控件VisifireChart参数 Chart_Series_DataSeries_RenderAs
                    , Chart_View3D: true                                                             //见图表控件VisifireChart参数 Chart_View3D
                    , Chart_Titles_Text: function (Y_DataFieldList) { return "统计图"; }             //见图表控件VisifireChart参数 Chart_Titles_Text
                    , Chart_AxesX_Axis_Title: "X轴"                                                  //见图表控件VisifireChart参数 Chart_AxesX_Axis_Title
                    , Chart_AxesY_Axis_Title: function (Y_DataFieldList) { return "Y轴"; }           //见图表控件VisifireChart参数 Chart_AxesY_Axis_Title
                    , Chart__preLoad: function (args, ChartSettings) {
                        var ControlJQs = $(ChartSettings.GridViewSelector).data("ControlJQs");
                        var DataColumnList = ControlData.ControlJQs.GridViewJQ.data("ColumnList");

                        var chart = args[0];

                        for (var i = 0; i < chart.Series.length; i++) {
                            chart.Series[i].MouseEnter = function (sender, eventArgs) {
                                var xIndex = -1;
                                for (var j = 0; j < DataColumnList.length; j++) {
                                    if (DataColumnList[j].IsShow && DataColumnList[j].HeadText == sender.LegendText) {
                                        xIndex = j + 1;
                                        break;
                                    };
                                };
                                var yIndex = -1;
                                for (var j = 0; j < ChartSettings.DataSource.length; j++) {
                                    if (ChartSettings.DataSource[j][ChartSettings.X_DataField.DataField] == sender.AxisXLabel || ChartSettings.DataSource[j][ChartSettings.X_DataField.DataField] == sender.XValue) {
                                        yIndex = j;
                                    };
                                };

                                if (yIndex > -1 && xIndex > -1) {
                                    var TrRowJQs = $.GridView.GetTrRowJQs(ControlData.ControlJQs.GridViewJQ);
                                    $("td.jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRowSelected", TrRowJQs).removeClass("jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRowSelected");
                                    TrRowJQs.eq(yIndex).click().find("td:eq(" + xIndex + ")").addClass("jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRowSelected");
                                };

                                var SerieIndex = -1;
                                for (var j = 0; j < ChartSettings.Y_DataFieldList.length; j++) {
                                    if (ChartSettings.Y_DataFieldList[j].IsShow && ChartSettings.Y_DataFieldList[j].HeadText == sender.LegendText) {
                                        SerieIndex = j;
                                        break;
                                    };
                                };
                                if (SerieIndex > -1) {
                                    var Serie = ControlData.ControlJQs.GridViewJQ.data("GridViewChart").Series[SerieIndex];
                                    var DataPoints = Serie.DataPoints;
                                    for (var j = 0; j < DataPoints.length; j++) {
                                        if (j == yIndex) {
                                            DataPoints[j].SetPropertyFromJs("MarkerEnabled", "true");
                                            DataPoints[j].SetPropertyFromJs("MarkerScale", "3");
                                            DataPoints[j].SetPropertyFromJs("Selected", "true");
                                        } else {
                                            DataPoints[j].SetPropertyFromJs("MarkerScale", Serie.MarkerScale);
                                            DataPoints[j].SetPropertyFromJs("MarkerEnabled", Serie.MarkerEnabled);
                                        };
                                    };
                                };
                            };
                        };
                    }
                    , Chart__loaded: function (args, ChartSettings) {
                        $(ChartSettings.GridViewSelector).data("GridViewChart", args[0]);
                    }

                };
            }
            , DivGridView_ContentRandomNumber: null
            , DivGridView_IndexRandomNumber: null
            , HeadFunction: function (Properties) {
                var Settings = {
                    Selector: null                                       //GridView控件选择器
                };
                $.extend(Settings, Properties);
                var ControlData = $(Settings.Selector).data("ControlData");

                var ObjectList = [];
                for (var i = 0; i < ControlData.SortColumnList.length; i++) {
                    var InnerHtml = ControlData.SortColumnList[i].HeadText;
                    if (fw.fwObject.FWObjectHelper.hasValue(ControlData.SortColumnList[i].MeasurementUnit)) {
                        InnerHtml += "(" + ControlData.SortColumnList[i].MeasurementUnit + ")";
                    };
                    ObjectList.push(InnerHtml);
                };
                return ObjectList;
            }
            , FillBodyRowFunction: function (Properties) {
                var Settings = {
                    Selector: null                                       //GridView控件选择器
                };
                $.extend(Settings, Properties);
                var ControlData = $(Settings.Selector).data("ControlData");
                var ObjectList = [];
                for (var i = 0; i < ControlData.SortColumnList.length; i++) {
                    var TdRowJQ = $("<td class=\"jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow\"></td>");
                    var TdRow_DivRowJQ = $("<div class=\"jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRow\"><a>&nbsp;</a></div>").appendTo(TdRowJQ).css({
                        "width": ControlData.SortColumnList[j].Width
                        , "text-align": ControlData.SortColumnList[j].BodyAlignment
                    });
                    ObjectList.push(TdRowJQ);
                };
                return ObjectList;
            }                                                    //数据的Html
            , FootFunction: function (Properties) {
                var Settings = {
                    Selector: null                                       //GridView控件选择器
                };
                $.extend(Settings, Properties);
                var ControlData = $(Settings.Selector).data("ControlData");
                ControlData.PageSize = ControlData.Settings.PageSize;
                ControlData.PageNow = ControlData.Settings.PageNow;
                var PageCount = ControlData.Settings.RecordCount % ControlData.PageSize == 0 ? parseInt(ControlData.Settings.RecordCount / ControlData.PageSize) : parseInt(ControlData.Settings.RecordCount / ControlData.PageSize) + 1;
                if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                    ControlData.ControlJQs.GridView_trFoot_tdFootLeft_aFootRecordCountJQ.html(ControlData.Settings.RecordCount);
                    ControlData.ControlJQs.GridView_trFoot_tdFootLeft_inputFootPageSizeJQ.val(ControlData.PageSize).width(ControlData.PageSize.toString().length * 6);
                    ControlData.ControlJQs.GridView_trFoot_tdFootLeft_aFootPageSizeJQ.html(ControlData.PageSize);

                    ControlData.ControlJQs.GridView_trFoot_tdFootLeft_aFootPageCountJQ.html(PageCount);
                    ControlData.ControlJQs.GridView_trFoot_tdFootLeft_inputFootPageNowJQ.val(ControlData.PageNow).width(PageCount.toString().length * 6);
                    //            var optionHtml = "";
                    //            for (var i = 1; i <= PageCount; i++) {
                    //                var selectedHtml = Settings.PageNow == i ? " selected=\"selected\"" : "";
                    //                optionHtml += ("<option value=\"" + i + "\"" + selectedHtml + ">" + i + "/" + PageCount + "</option>");
                    //            };
                    //            ControlData.ControlJQs.GridView_trFoot_tdFootLeft_selectFootPageNowJQ.html(optionHtml);

                    ControlData.ControlJQs.GridView_trFoot_tdFootRight_aFootFirstPageJQ.removeClass("jQueryExtension_UI_GridView_trFoot_tdFootRight_aPageChange").removeData("NewPageIndex");
                    ControlData.ControlJQs.GridView_trFoot_tdFootRight_aFootPageUpJQ.removeClass("jQueryExtension_UI_GridView_trFoot_tdFootRight_aPageChange").removeData("NewPageIndex");
                    ControlData.ControlJQs.GridView_trFoot_tdFootRight_aFootPageDownJQ.removeClass("jQueryExtension_UI_GridView_trFoot_tdFootRight_aPageChange").removeData("NewPageIndex");
                    ControlData.ControlJQs.GridView_trFoot_tdFootRight_aFootLastPageJQ.removeClass("jQueryExtension_UI_GridView_trFoot_tdFootRight_aPageChange").removeData("NewPageIndex");
                    if (PageCount > 1) {
                        if (ControlData.PageNow == 1) {
                            ControlData.ControlJQs.GridView_trFoot_tdFootRight_aFootPageDownJQ.addClass("jQueryExtension_UI_GridView_trFoot_tdFootRight_aPageChange").data("NewPageIndex", ControlData.PageNow + 1);
                            ControlData.ControlJQs.GridView_trFoot_tdFootRight_aFootLastPageJQ.addClass("jQueryExtension_UI_GridView_trFoot_tdFootRight_aPageChange").data("NewPageIndex", PageCount);
                        } else if (ControlData.PageNow == PageCount) {
                            ControlData.ControlJQs.GridView_trFoot_tdFootRight_aFootFirstPageJQ.addClass("jQueryExtension_UI_GridView_trFoot_tdFootRight_aPageChange").data("NewPageIndex", 1);
                            ControlData.ControlJQs.GridView_trFoot_tdFootRight_aFootPageUpJQ.addClass("jQueryExtension_UI_GridView_trFoot_tdFootRight_aPageChange").data("NewPageIndex", ControlData.PageNow - 1);
                        } else {
                            ControlData.ControlJQs.GridView_trFoot_tdFootRight_aFootFirstPageJQ.addClass("jQueryExtension_UI_GridView_trFoot_tdFootRight_aPageChange").data("NewPageIndex", 1);
                            ControlData.ControlJQs.GridView_trFoot_tdFootRight_aFootPageUpJQ.addClass("jQueryExtension_UI_GridView_trFoot_tdFootRight_aPageChange").data("NewPageIndex", ControlData.PageNow - 1);
                            ControlData.ControlJQs.GridView_trFoot_tdFootRight_aFootPageDownJQ.addClass("jQueryExtension_UI_GridView_trFoot_tdFootRight_aPageChange").data("NewPageIndex", ControlData.PageNow + 1);
                            ControlData.ControlJQs.GridView_trFoot_tdFootRight_aFootLastPageJQ.addClass("jQueryExtension_UI_GridView_trFoot_tdFootRight_aPageChange").data("NewPageIndex", PageCount);
                        };
                    };
                };
            }
            , GetTrRowSelectedJQ: function (Properties) {
                var Settings = {
                    Selector: null                                       //GridView控件选择器
                };
                $.extend(Settings, Properties);

                var JQ;
                var ControlData = $(Settings.Selector).data("ControlData");
                if (fw.fwObject.FWObjectHelper.hasValue(ControlData.ControlJQs.GridView_TbodyBody_TrRow_ArrowJQ)) {
                    JQ = ControlData.ControlJQs.GridView_TbodyBody_TrRow_ArrowJQ.filter("tr.jQueryExtension_UI_GridView_TbodyBody_TrRowSelected");
                } else {
                    JQ = $();
                };
                return JQ;
            }
             , GetSelectedEntity: function (Properties) {
                 var Settings = {
                     Selector: null                                       //GridView控件选择器
                 };
                 $.extend(Settings, Properties);

                 var Entity = $.GridView.GetTrRowSelectedJQ({ Selector: Settings.Selector }).data("Entity");
                 if (Entity == undefined) {
                     Entity = null;
                 };
                 return Entity;
             }
             , MoveTrRowSelected: function (GridViewSelector, Direction) {
                 var TrRowSelectedJQ = $("tr.jQueryExtension_UI_GridView_TbodyBody_TrRowSelected", GridViewSelector);
                 if (Direction == -1) {
                     TrRowSelectedJQ.prev().before(TrRowSelectedJQ);
                 } else {
                     TrRowSelectedJQ.next().after(TrRowSelectedJQ);
                 };
             }
             , GetTrRowJQs: function (GridViewSelector) {
                 var ControlJQs = $(GridViewSelector).data("ControlJQs");
                 if (fw.fwObject.FWObjectHelper.hasValue(ControlJQs)) {
                     return $(">tr.jQueryExtension_UI_GridView_TbodyBody_TrRow:not(.jQueryExtension_UI_GridView_TbodyBody_TrFillRow)", ControlData.ControlJQs.GridView_TbodyBodyJQ);
                 } else {
                     return null;
                 };
             }
             , GetPageSize: function (Properties) {
                 var Settings = {
                     Selector: null                                       //GridView控件选择器
                     , PageSize: 20                                     //分页大小
                 };
                 $.extend(Settings, Properties);

                 Settings.PageSize = Settings.PageSize > $.GridView.MaxPageSize ? $.GridView.MaxPageSize : Settings.PageSize;
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
             , GetSortFieldList: function (Properties) {
                 var Settings = {
                     Selector: null                                       //GridView控件选择器
                 };
                 $.extend(Settings, Properties);

                 var ControlData = $(Settings.Selector).data("ControlData");
                 var SortColumnList = ControlData.SortColumnList;
                 var SortFieldList = [];
                 if (fw.fwObject.FWObjectHelper.hasValue(SortColumnList)) {
                     for (var i = 0; i < SortColumnList.length; i++) {
                         if (SortColumnList[i].SortType != undefined) {
                             switch (SortColumnList[i].SortType.toLowerCase()) {
                                 case "asc":
                                     SortFieldList.push({
                                         FieldName: SortColumnList[i].DataField
                                        , SortType: 0
                                     });
                                     break;
                                 case "desc":
                                     SortFieldList.push({
                                         FieldName: SortColumnList[i].DataField
                                        , SortType: 1
                                     });
                                     break;
                                 default: //"Inherit"
                                     SortFieldList.push({
                                         FieldName: SortColumnList[i].DataField
                                        , SortType: -1
                                     });
                                     break;
                             };
                         };
                     };
                 };
                 return SortFieldList;
             }
             , ColumnSet: function (Properties) {
                 var Settings = {
                     Selector: null                                       //GridView控件选择器
                     , ClickSelector: null                                       //Click控件选择器
                 };
                 $.extend(Settings, Properties);

                 var ControlData = $(Settings.Selector).data("ControlData");

                 var ColumnSetData = $("#jQueryExtension_UI_GridView_DivTableColumnSet").data("ControlData");
                 if (!fw.fwObject.FWObjectHelper.hasValue(ColumnSetData)) {
                     ColumnSetData = {};
                     var Html = "";
                     Html += "<div id=\"jQueryExtension_UI_GridView_DivTableColumnSet\" class=\"jQueryExtension_UI_GridView_DivTableColumnSet\">";
                     Html += "<div id=\"jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet\"  class=\"jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet\">";
                     Html += "<ul id=\"jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_Left\" class=\"jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_Left\">";
                     Html += "<li title=\"锁定\" id=\"jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_LockOrUnlock\" class=\"jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_LockOrUnlock\"></li>";
                     Html += "</ul>";
                     Html += "<ul id=\"jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_Right\" class=\"jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_Right\">";
                     Html += "<li title=\"正序\" id=\"jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_SortType_Asc\" class=\"jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_SortType_Asc\"></li>";
                     Html += "<li title=\"倒序\" id=\"jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_SortType_Desc\" class=\"jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_SortType_Desc\"></li>";
                     Html += "<li title=\"默认\" id=\"jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_SortType_Inherit\" class=\"jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_SortType_Inherit\"></li>";
                     Html += "</ul>";
                     Html += "</div>";
                     Html += "<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"width:100%\">";
                     Html += "<tbody id=\"jQueryExtension_UI_GridView_DivTableColumnSet_TbodyColumnSet\"></tbody>";
                     Html += "</table>";
                     Html += "</div>";
                     var GridView_DivTableColumnSetJQ = $(Html).appendTo("body");
                     ColumnSetData.ControlJQs = {
                         GridView_DivTableColumnSetJQ: GridView_DivTableColumnSetJQ
                         , GridView_DivTableColumnSet_SingleColumnSetJQ: $("#jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet")
                         , GridView_DivTableColumnSet_SingleColumnSet_LeftJQ: $("#jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_Left")
                         , GridView_DivTableColumnSet_SingleColumnSet_LockOrUnlockJQ: $("#jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_LockOrUnlock")
                         , GridView_DivTableColumnSet_SingleColumnSet_RightJQ: $("#jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_Right")
                         , GridView_DivTableColumnSet_SingleColumnSet_SortType_AscJQ: $("#jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_SortType_Asc")
                         , GridView_DivTableColumnSet_SingleColumnSet_SortType_DescJQ: $("#jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_SortType_Desc")
                         , GridView_DivTableColumnSet_SingleColumnSet_SortType_InheritJQ: $("#jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_SortType_Inherit")
                         , GridView_DivTableColumnSet_TbodyColumnSetJQ: $("#jQueryExtension_UI_GridView_DivTableColumnSet_TbodyColumnSet")
                     };

                     ColumnSetData.ControlJQs.GridView_DivTableColumnSet_SingleColumnSet_LockOrUnlockJQ.bind("click", function () {
                         var ColumnEntity = ColumnSetData.Settings.GridView_TrHead_ThHead_DivHeadJQ.data("Entity");
                         var ControlData = ColumnSetData.Settings.SelectorJQ.data("ControlData");
                         var DropToJQ;
                         var MoveDirection;
                         if (ColumnEntity.IsLock) {
                             //                 alert("锁定->不锁定！");
                             DropToJQ = $(">th>div.jQueryExtension_UI_GridView_TrHead_ThHead_DivHead:first", ControlData.ControlJQs.GridView_TrHead_ScrollJQ);
                             MoveDirection = "Left";
                         } else {
                             //                 alert("没锁定-》锁定！");
                             DropToJQ = $(">th>div.jQueryExtension_UI_GridView_TrHead_ThHead_DivHead:last", ControlData.ControlJQs.GridView_TrHead_LockJQ);
                             MoveDirection = "Right";
                         };
                         $.GridView.ColumnMove({
                             Selector: ControlData.ControlJQs.GridViewJQ
                            , DragJQ: ColumnSetData.Settings.GridView_TrHead_ThHead_DivHeadJQ
                            , DropToJQ: DropToJQ
                            , MoveDirection: MoveDirection
                         });
                         GridView_DivTableColumnSetJQ.hide();
                     });

                     ColumnSetData.ControlJQs.GridView_DivTableColumnSet_SingleColumnSet_SortType_AscJQ.bind("click", function () {
                         var ColumnEntity = ColumnSetData.Settings.GridView_TrHead_ThHead_DivHeadJQ.data("Entity");
                         if (ColumnEntity.SortType != "Asc") {
                             $(this).parent().find(">li").removeClass("jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_SortType_DescSelected jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_SortType_InheritSelected");
                             $(this).addClass("jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_SortType_AscSelected");
                             ColumnSetData.Settings.ClickSelectorJQ.removeClass("jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnSet_SortType_Desc jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnSet_SortType_Inherit").addClass("jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnSet_SortType_Asc");
                             ColumnEntity.SortType = "Asc";
                             $.GridView.Refresh({ Selector: ControlData.ControlJQs.GridViewJQ });
                             GridView_DivTableColumnSetJQ.hide();
                         };
                     });
                     ColumnSetData.ControlJQs.GridView_DivTableColumnSet_SingleColumnSet_SortType_DescJQ.bind("click", function () {
                         var ColumnEntity = ColumnSetData.Settings.GridView_TrHead_ThHead_DivHeadJQ.data("Entity");
                         if (ColumnEntity.SortType != "Desc") {
                             $(this).parent().find(">li").removeClass("jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_SortType_AscSelected jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_SortType_InheritSelected");
                             $(this).addClass("jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_SortType_DescSelected");
                             ColumnSetData.Settings.ClickSelectorJQ.removeClass("jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnSet_SortType_Asc jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnSet_SortType_Inherit").addClass("jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnSet_SortType_Desc");
                             ColumnEntity.SortType = "Desc";
                             $.GridView.Refresh({ Selector: ControlData.ControlJQs.GridViewJQ });
                             GridView_DivTableColumnSetJQ.hide();
                         };
                     });
                     ColumnSetData.ControlJQs.GridView_DivTableColumnSet_SingleColumnSet_SortType_InheritJQ.bind("click", function () {
                         var ColumnEntity = ColumnSetData.Settings.GridView_TrHead_ThHead_DivHeadJQ.data("Entity");
                         if (ColumnEntity.SortType != "Inherit") {
                             $(this).parent().find(">li").removeClass("jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_SortType_AscSelected jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_SortType_DescSelected");
                             $(this).addClass("jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_SortType_InheritSelected");
                             ColumnSetData.Settings.ClickSelectorJQ.removeClass("jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnSet_SortType_Asc jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnSet_SortType_Desc").addClass("jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnSet_SortType_Inherit");
                             ColumnEntity.SortType = "Inherit";
                             $.GridView.Refresh({ Selector: ControlData.ControlJQs.GridViewJQ });
                             GridView_DivTableColumnSetJQ.hide();
                         };
                     });


                     GridView_DivTableColumnSetJQ.data("ControlData", ColumnSetData);
                 };

                 var ClickSelectorJQ = $(Settings.ClickSelector);
                 var ClickSelectorPrevJQ = ClickSelectorJQ.prev();
                 var ColumnEntity = ClickSelectorPrevJQ.data("Entity");
                 ColumnSetData.Settings = {
                     SelectorJQ: ControlData.ControlJQs.GridViewJQ
                     , ClickSelectorJQ: ClickSelectorJQ
                     , GridView_TrHead_ThHead_DivHeadJQ: ClickSelectorPrevJQ
                 };
                 if (ColumnEntity == undefined || ColumnEntity.DataField == undefined || ColumnEntity.HeadText == undefined) {
                     ColumnSetData.ControlJQs.GridView_DivTableColumnSet_SingleColumnSetJQ.hide();
                 } else {
                     ColumnSetData.ControlJQs.GridView_DivTableColumnSet_SingleColumnSetJQ.show();

                     if (ColumnEntity.IsLock) {
                         ColumnSetData.ControlJQs.GridView_DivTableColumnSet_SingleColumnSet_LockOrUnlockJQ.attr("title", "解锁").removeClass("jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_Lock").addClass("jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_Unlock");
                     } else {
                         ColumnSetData.ControlJQs.GridView_DivTableColumnSet_SingleColumnSet_LockOrUnlockJQ.attr("title", "锁定").removeClass("jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_Unlock").addClass("jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_Lock");
                     };

                     if (ColumnEntity.SortType == undefined) {
                         ColumnSetData.ControlJQs.GridView_DivTableColumnSet_SingleColumnSet_RightJQ.hide();
                     } else {
                         ColumnSetData.ControlJQs.GridView_DivTableColumnSet_SingleColumnSet_RightJQ.show();
                         switch (ColumnEntity.SortType) {
                             case "Asc":
                                 ColumnSetData.ControlJQs.GridView_DivTableColumnSet_SingleColumnSet_SortType_AscJQ.addClass("jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_SortType_AscSelected");
                                 break;
                             case "Desc":
                                 ColumnSetData.ControlJQs.GridView_DivTableColumnSet_SingleColumnSet_SortType_DescJQ.addClass("jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_SortType_DescSelected");
                                 break;
                             case "Inherit":
                                 ColumnSetData.ControlJQs.GridView_DivTableColumnSet_SingleColumnSet_SortType_InheritJQ.addClass("jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_SortType_InheritSelected");
                                 break;
                         };
                     };
                 };

                 ColumnSetData.ControlJQs.GridView_DivTableColumnSet_TbodyColumnSetJQ.empty();
                 for (var i = 0; i < ControlData.SortColumnList.length; i++) {
                     var TrJQ = $("<tr></tr>").data("Entity", ControlData.SortColumnList[i]).appendTo(ColumnSetData.ControlJQs.GridView_DivTableColumnSet_TbodyColumnSetJQ);
                     var Td0JQ = $("<td></td>").appendTo(TrJQ);
                     var Div0JQ = $("<div style=\"width: 20px; text-align: center;\"></div>").appendTo(Td0JQ);
                     $("<input type=\"checkbox\" class=\"GridView_TrHead_ThTableColumnSet_divTableColumnSet_IsShow\" " + (ControlData.SortColumnList[i].IsShow ? "checked=\"checked\"" : "") + " />").bind("click", function () {
                         var ControlData = ColumnSetData.Settings.SelectorJQ.data("ControlData");
                         var Entity = $(this).parent().parent().parent().data("Entity");
                         var CheckboxJQ = $("input.GridView_TrHead_ThTableColumnSet_divTableColumnSet_IsShow", ControlData.ControlJQs.GridView_DivTableColumnSetJQ);
                         var CheckedCheckboxJQ = CheckboxJQ.filter(":checked");
                         if (CheckedCheckboxJQ.length < 1) {
                             $(this).attr("checked", "checked");
                             Entity.IsShow = true;
                         } else {
                             Entity.IsShow = $(this).is(":checked");
                             var Index = CheckboxJQ.index(this) + 1;
                             var LockThCount = $(">th", ControlData.ControlJQs.GridView_TrHead_LockJQ).length;
                             if (Entity.IsShow) {
                                 if (Entity.IsLock) {
                                     $(">tr>th:nth-child(" + Index + ")", ControlData.ControlJQs.GridView_TheadHead_LockJQ).show();
                                     $(">tr>td:nth-child(" + Index + ")", ControlData.ControlJQs.GridView_TbodyBody_LockJQ).show();
                                 } else {
                                     Index -= LockThCount;
                                     $(">tr>th:nth-child(" + Index + ")", ControlData.ControlJQs.GridView_TheadHead_ScrollJQ).show();
                                     $(">tr>td:nth-child(" + Index + ")", ControlData.ControlJQs.GridView_TbodyBody_ScrollJQ).show();
                                 };
                             } else {
                                 if (Entity.IsLock) {
                                     $(">tr>th:nth-child(" + Index + ")", ControlData.ControlJQs.GridView_TheadHead_LockJQ).hide();
                                     $(">tr>td:nth-child(" + Index + ")", ControlData.ControlJQs.GridView_TbodyBody_LockJQ).hide();
                                 } else {
                                     Index -= LockThCount;
                                     $(">tr>th:nth-child(" + Index + ")", ControlData.ControlJQs.GridView_TheadHead_ScrollJQ).hide();
                                     $(">tr>td:nth-child(" + Index + ")", ControlData.ControlJQs.GridView_TbodyBody_ScrollJQ).hide();
                                 };
                             };
                             jQueryExtension.ScrollTop(ControlData.ControlJQs.GridView_DivBody_LockJQ, jQueryExtension.ScrollTop(ControlData.ControlJQs.GridView_DivBody_ArrowJQ));
                             jQueryExtension.ScrollTop(ControlData.ControlJQs.GridView_DivBody_ScrollJQ, jQueryExtension.ScrollTop(ControlData.ControlJQs.GridView_DivBody_ArrowJQ));

                             $.GridView.UpdateSortColumnList({ Selector: ControlData.ControlJQs.GridViewJQ });
                             $.GridView.UpdateLayout({ Selector: ControlData.ControlJQs.GridViewJQ });
                         };
                     }).appendTo(Div0JQ);
                     var Td1JQ = $("<td><div style=\"width: 125px; padding-left: 5px;\">" + ControlData.SortColumnList[i].ColumnText + "</div></td>").appendTo(TrJQ);
                     //$(">div>*", Td1JQ).remove();
                     if ($('>div>table', Td1JQ).length > 0) {
                         Td1JQ.html($('>div>table tr:eq(0)', Td1JQ).text());
                     } else {
                         Td1JQ.html(Td1JQ.text());
                     }
                 };

                 //         var Chart_Series_DataSeries_RenderAsList = ControlData.ControlJQs.GridViewJQ.data("Chart_Series_DataSeries_RenderAsList");
                 //         var Div_Chart__X_DataFieldJQ = $("<div class=\"jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet\"></div>").appendTo(GridView_DivTableColumnSetJQ);
                 //         var Ul_Left_Chart__X_DataFieldJQ = $("<ul class=\"jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_Left\"></ul>").appendTo(Div_Chart__X_DataFieldJQ);
                 //         var SelectChartTypeJQ = $("<li style=\"width:auto;\"><select id=\"Select1\"></select></li>").appendTo(Ul_Left_Chart__X_DataFieldJQ).find(">select");
                 //         for (var i = 0; i < Chart_Series_DataSeries_RenderAsList.length; i++) {
                 //             switch (Chart_Series_DataSeries_RenderAsList[i]) {
                 //                 case "Spline":
                 //                     $("<option value=\"Spline\">曲线图</option>").appendTo(SelectChartTypeJQ);
                 //                     break;
                 //                 case "Line":
                 //                     $("<option value=\"Line\">折线图</option>").appendTo(SelectChartTypeJQ);
                 //                     break;
                 //                 case "StepLine":
                 //                     $("<option value=\"StepLine\">步骤图</option>").appendTo(SelectChartTypeJQ);
                 //                     break;
                 //                 case "Column":
                 //                     $("<option value=\"Column\">柱状图</option>").appendTo(SelectChartTypeJQ);
                 //                     break;
                 //                 case "StackedColumn":
                 //                     $("<option value=\"StackedColumn\">堆积图</option>").appendTo(SelectChartTypeJQ);
                 //                     break;
                 //                 case "StackedColumn100":
                 //                     $("<option value=\"StackedColumn100\">堆积图100%</option>").appendTo(SelectChartTypeJQ);
                 //                     break;
                 //                 case "Bar":
                 //                     $("<option value=\"Bar\">柱状图横</option>").appendTo(SelectChartTypeJQ);
                 //                     break;
                 //                 case "StackedBar":
                 //                     $("<option value=\"StackedBar\">堆积图横</option>").appendTo(SelectChartTypeJQ);
                 //                     break;
                 //                 case "StackedBar100":
                 //                     $("<option value=\"StackedBar100\">堆积图100%横</option>").appendTo(SelectChartTypeJQ);
                 //                     break;
                 //                 case "Area":
                 //                     $("<option value=\"Area\">面积图</option>").appendTo(SelectChartTypeJQ);
                 //                     break;
                 //                 case "Pie":
                 //                     $("<option value=\"Pie\">饼图</option>").appendTo(SelectChartTypeJQ);
                 //                     break;
                 //                 case "Doughnut":
                 //                     $("<option value=\"Doughnut\">环形图</option>").appendTo(SelectChartTypeJQ);
                 //                     break;
                 //                 case "Radar":
                 //                     $("<option value=\"Radar\">雷达图</option>").appendTo(SelectChartTypeJQ);
                 //                     break;
                 //                 case "StreamLineFunnel":
                 //                     $("<option value=\"StreamLineFunnel\">漏斗图</option>").appendTo(SelectChartTypeJQ);
                 //                     break;
                 //                 case "Pyramid":
                 //                     $("<option value=\"Pyramid\">金字塔图</option>").appendTo(SelectChartTypeJQ);
                 //                     break;
                 //                 case "Bubble":
                 //                     $("<option value=\"Bubble\">气泡图</option>").appendTo(SelectChartTypeJQ);
                 //                     break;
                 //                 case "Point":
                 //                     $("<option value=\"Point\">点图</option>").appendTo(SelectChartTypeJQ);
                 //                     break;
                 //             };
                 //         };
                 //         var Ul_Right_Chart__X_DataFieldJQ = $("<ul class=\"jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_Right\"></ul>").appendTo(Div_Chart__X_DataFieldJQ);
                 //         $("<li style=\"width:auto;\"><input type=\"checkbox\" />是否3D</li>").appendTo(Ul_Right_Chart__X_DataFieldJQ).find(">input:checkbox").bind("click", function () {
                 //             alert("dss");
                 //         });


                 //         var Chart__X_DataFieldList = ControlData.ControlJQs.GridViewJQ.data("Chart__X_DataFieldList");
                 //         var Div_Chart__X_DataFieldJQ = $("<div class=\"jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet\"></div>").appendTo(GridView_DivTableColumnSetJQ);
                 //         var Ul_Left_Chart__X_DataFieldJQ = $("<ul class=\"jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_Left\"></ul>").appendTo(Div_Chart__X_DataFieldJQ);
                 //         var Li_Left_Chart__X_DataFieldJQ = $("<li style=\"width:auto;\">统计图X轴</li>").appendTo(Ul_Left_Chart__X_DataFieldJQ);
                 //         var TableJQ = $("<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"width:100%\"></table>").appendTo(GridView_DivTableColumnSetJQ);
                 //         var TBodyJQ = $("<tbody></tbody>").appendTo(TableJQ);
                 //         for (var i = 0; i < Chart__X_DataFieldList.length; i++) {
                 //             var TrJQ = $("<tr></tr>").data("Entity", Chart__X_DataFieldList[i]).appendTo(TBodyJQ);
                 //             var Td0JQ = $("<td></td>").appendTo(TrJQ);
                 //             var Div0JQ = $("<div></div>").appendTo(Td0JQ);
                 //             $("<input type=\"radio\" name=\"radioChart__X_DataField" + ControlData.ControlJQs.WindowGuid + "\" " + (Chart__X_DataFieldList[i].IsUsedToChart ? "checked=\"checked\"" : "") + " />").bind("click", function () {
                 //                 var Entity = $(this).parent().parent().parent().data("Entity");
                 //                 Entity.IsUsedToChart = $(this).is(":checked");

                 //                 //                 ControlData.ControlJQs.GridViewJQ.removeData("GridViewChart");
                 //             }).appendTo(Div0JQ);
                 //             var Td1JQ = $("<td><div>" + Chart__X_DataFieldList[i].HeadText + "</div></td>").appendTo(TrJQ);
                 //             $(">div>*", Td1JQ).remove();
                 //         };


                 //         var Chart__Y_DataFieldList = ControlData.ControlJQs.GridViewJQ.data("Chart__Y_DataFieldList");
                 //         var Div_Chart__Y_DataFieldJQ = $("<div class=\"jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet\"></div>").appendTo(GridView_DivTableColumnSetJQ);
                 //         var Ul_Left_Chart__Y_DataFieldJQ = $("<ul class=\"jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_Left\"></ul>").appendTo(Div_Chart__Y_DataFieldJQ);
                 //         var Li_Left_Chart__Y_DataFieldJQ = $("<li style=\"width:auto;\">统计图Y轴</li>").appendTo(Ul_Left_Chart__Y_DataFieldJQ);
                 //         var Ul_Right_Chart__Y_DataFieldJQ = $("<ul class=\"jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_Right\"></ul>").appendTo(Div_Chart__Y_DataFieldJQ);
                 //         $("<li title=\"向上\" class=\"jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_SortType_Asc " + (ColumnEntity.SortType == "Asc" ? "jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_SortType_AscSelected" : "") + "\"></li>").appendTo(Ul_Right_Chart__Y_DataFieldJQ).bind("click", function () {
                 //             var TbodyJQ = $(">tbody:first", $(this).parent().parent().next());
                 //             var TrJQs = $(">tr", TbodyJQ);
                 //             var TrJQ = TrJQs.filter(".jQueryExtension_UI_GridView_DivTableColumnSet_TrSelected");
                 //             if (TrJQ.length > 0) {
                 //                 var Index = TrJQs.index(TrJQ);
                 //                 var TrPrevJQ = TrJQ.prev();
                 //                 if (TrPrevJQ.length > 0) {
                 //                     TrPrevJQ.before(TrJQ);
                 //                     //                     $(">tr", ControlData.ControlJQs.GridView_TheadHeadJQ).each(function () {
                 //                     //                         $(">th:nth-child(" + (Index + 1) + ")", this).before($(">th:nth-child(" + (Index + 2) + ")", this));
                 //                     //                     });
                 //                     //                     $(">tr", ControlData.ControlJQs.GridView_TbodyBodyJQ).each(function () {
                 //                     //                         $(">td:nth-child(" + (Index + 1) + ")", this).before($(">td:nth-child(" + (Index + 2) + ")", this));
                 //                     //                     });

                 //                     //                     ColumnList = [];
                 //                     //                     $(">tr", TbodyJQ).each(function () {
                 //                     //                         ColumnList.push($(this).data("Entity"));
                 //                     //                     });
                 //                     //                     ControlData.ControlJQs.GridViewJQ.data("ColumnList", ColumnList);
                 //                 };
                 //             };
                 //         });
                 //         $("<li title=\"向下\" class=\"jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_SortType_Desc " + (ColumnEntity.SortType == "Desc" ? "jQueryExtension_UI_GridView_DivTableColumnSet_SingleColumnSet_SortType_DescSelected" : "") + "\"></li>").appendTo(Ul_Right_Chart__Y_DataFieldJQ).bind("click", function () {
                 //             var TbodyJQ = $(">tbody:first", $(this).parent().parent().next());
                 //             var TrJQs = $(">tr", TbodyJQ);
                 //             var TrJQ = TrJQs.filter(".jQueryExtension_UI_GridView_DivTableColumnSet_TrSelected");
                 //             if (TrJQ.length > 0) {
                 //                 var Index = TrJQs.index(TrJQ);
                 //                 var TrNextJQ = TrJQ.next();
                 //                 if (TrNextJQ.length > 0) {
                 //                     TrNextJQ.after(TrJQ);
                 //                     //                     $(">tr", ControlData.ControlJQs.GridView_TheadHeadJQ).each(function () {
                 //                     //                         $(">th:nth-child(" + (Index + 3) + ")", this).after($(">th:nth-child(" + (Index + 2) + ")", this));
                 //                     //                     });
                 //                     //                     $(">tr", ControlData.ControlJQs.GridView_TbodyBodyJQ).each(function () {
                 //                     //                         $(">td:nth-child(" + (Index + 3) + ")", this).after($(">td:nth-child(" + (Index + 2) + ")", this));
                 //                     //                     });

                 //                     //                     ColumnList = [];
                 //                     //                     $(">tr", TbodyJQ).each(function () {
                 //                     //                         ColumnList.push($(this).data("Entity"));
                 //                     //                     });
                 //                     //                     ControlData.ControlJQs.GridViewJQ.data("ColumnList", ColumnList);
                 //                 };
                 //             };
                 //         });
                 //         var TableJQ = $("<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"width:100%\"></table>").appendTo(GridView_DivTableColumnSetJQ);
                 //         var TBodyJQ = $("<tbody></tbody>").appendTo(TableJQ);
                 //         for (var i = 0; i < Chart__Y_DataFieldList.length; i++) {
                 //             var TrJQ = $("<tr></tr>").data("Entity", Chart__Y_DataFieldList[i]).appendTo(TBodyJQ).bind("click", function () {
                 //                 $(">tr", $(this).parent()).removeClass("jQueryExtension_UI_GridView_DivTableColumnSet_TrSelected");
                 //                 $(this).addClass("jQueryExtension_UI_GridView_DivTableColumnSet_TrSelected");
                 //             });
                 //             var Td0JQ = $("<td></td>").appendTo(TrJQ);
                 //             var Div0JQ = $("<div></div>").appendTo(Td0JQ);
                 //             $("<input type=\"checkbox\" " + (Chart__Y_DataFieldList[i].IsUsedToChart ? "checked=\"checked\"" : "") + " />").bind("click", function () {
                 //                 var Entity = $(this).parent().parent().parent().data("Entity");
                 //                 Entity.IsUsedToChart = $(this).is(":checked");

                 //                 //                 ControlData.ControlJQs.GridViewJQ.removeData("GridViewChart");
                 //             }).appendTo(Div0JQ);
                 //             var Td1JQ = $("<td><div>" + Chart__Y_DataFieldList[i].HeadText + "</div></td>").appendTo(TrJQ);
                 //             $(">div>*", Td1JQ).remove();
                 //         };


                 //                    var TFootJQ = $("<tfoot></tfoot>").appendTo(TableJQ);
                 //                    var TFoot_TrJQ = $("<tr></tr>").appendTo(TFootJQ);
                 //                    var TFoot_Tr_TdJQ = $("<td colspan=\"99\"></td>").appendTo(TFoot_TrJQ);
                 //                    var TFoot_Tr_Td_DivJQ = $("<div></div>");
                 //                    TFoot_Tr_Td_DivJQ.appendTo(TFoot_Tr_TdJQ);
                 //                    var TFoot_Tr_Td_Div_UlJQ = $("<ul></ul>");
                 //                    TFoot_Tr_Td_Div_UlJQ.appendTo(TFoot_Tr_Td_DivJQ);
                 //                    var TFoot_Tr_Td_Div_Ul_Li0JQ = $("<li class=\"jQueryExtension_UI_GridView_DivChartSet_ChartType\"><select style=\"width:99%\"></select></li>").appendTo(TFoot_Tr_Td_Div_UlJQ);
                 //                    var TFoot_Tr_Td_Div_Ul_Li0_Select0JQ = $(">select", TFoot_Tr_Td_Div_Ul_Li0JQ).bind("change", function () {
                 //                        ControlData.ControlJQs.GridViewJQ.data("Chart_Series_DataSeries_RenderAs", $(this).val());
                 //                        ControlData.ControlJQs.GridViewJQ.removeData("GridViewChart");
                 //                    });
                 //                    for (var i = 0; i < Settings.Chart_Series_DataSeries_RenderAsList.length; i++) {
                 //                        switch (Settings.Chart_Series_DataSeries_RenderAsList[i]) {
                 //                            case "Spline":
                 //                                $("<option value=\"Spline\">曲线图</option>").appendTo(TFoot_Tr_Td_Div_Ul_Li0_Select0JQ);
                 //                                break;
                 //                            case "Line":
                 //                                $("<option value=\"Line\">折线图</option>").appendTo(TFoot_Tr_Td_Div_Ul_Li0_Select0JQ);
                 //                                break;
                 //                            case "StepLine":
                 //                                $("<option value=\"StepLine\">步骤图</option>").appendTo(TFoot_Tr_Td_Div_Ul_Li0_Select0JQ);
                 //                                break;
                 //                            case "Column":
                 //                                $("<option value=\"Column\">柱状图</option>").appendTo(TFoot_Tr_Td_Div_Ul_Li0_Select0JQ);
                 //                                break;
                 //                            case "StackedColumn":
                 //                                $("<option value=\"StackedColumn\">堆积图</option>").appendTo(TFoot_Tr_Td_Div_Ul_Li0_Select0JQ);
                 //                                break;
                 //                            case "StackedColumn100":
                 //                                $("<option value=\"StackedColumn100\">堆积图100%</option>").appendTo(TFoot_Tr_Td_Div_Ul_Li0_Select0JQ);
                 //                                break;
                 //                            case "Bar":
                 //                                $("<option value=\"Bar\">柱状图横</option>").appendTo(TFoot_Tr_Td_Div_Ul_Li0_Select0JQ);
                 //                                break;
                 //                            case "StackedBar":
                 //                                $("<option value=\"StackedBar\">堆积图横</option>").appendTo(TFoot_Tr_Td_Div_Ul_Li0_Select0JQ);
                 //                                break;
                 //                            case "StackedBar100":
                 //                                $("<option value=\"StackedBar100\">堆积图100%横</option>").appendTo(TFoot_Tr_Td_Div_Ul_Li0_Select0JQ);
                 //                                break;
                 //                            case "Area":
                 //                                $("<option value=\"Area\">面积图</option>").appendTo(TFoot_Tr_Td_Div_Ul_Li0_Select0JQ);
                 //                                break;
                 //                            case "Pie":
                 //                                $("<option value=\"Pie\">饼图</option>").appendTo(TFoot_Tr_Td_Div_Ul_Li0_Select0JQ);
                 //                                break;
                 //                            case "Doughnut":
                 //                                $("<option value=\"Doughnut\">环形图</option>").appendTo(TFoot_Tr_Td_Div_Ul_Li0_Select0JQ);
                 //                                break;
                 //                            case "Radar":
                 //                                $("<option value=\"Radar\">雷达图</option>").appendTo(TFoot_Tr_Td_Div_Ul_Li0_Select0JQ);
                 //                                break;
                 //                            case "StreamLineFunnel":
                 //                                $("<option value=\"StreamLineFunnel\">漏斗图</option>").appendTo(TFoot_Tr_Td_Div_Ul_Li0_Select0JQ);
                 //                                break;
                 //                            case "Pyramid":
                 //                                $("<option value=\"Pyramid\">金字塔图</option>").appendTo(TFoot_Tr_Td_Div_Ul_Li0_Select0JQ);
                 //                                break;
                 //                            case "Bubble":
                 //                                $("<option value=\"Bubble\">气泡图</option>").appendTo(TFoot_Tr_Td_Div_Ul_Li0_Select0JQ);
                 //                                break;
                 //                            case "Point":
                 //                                $("<option value=\"Point\">点图</option>").appendTo(TFoot_Tr_Td_Div_Ul_Li0_Select0JQ);
                 //                                break;
                 //                        };
                 //                    };
                 //                    if (ControlData.ControlJQs.GridViewJQ.data("Chart_Series_DataSeries_RenderAs") == undefined) {
                 //                        var OptionFirst = $(">option:first", TFoot_Tr_Td_Div_Ul_Li0_Select0JQ);
                 //                        if (OptionFirst.length > 0) {
                 //                            ControlData.ControlJQs.GridViewJQ.data("Chart_Series_DataSeries_RenderAs", OptionFirst.val());
                 //                            TFoot_Tr_Td_Div_Ul_Li0_Select0JQ.val(ControlData.ControlJQs.GridViewJQ.data("Chart_Series_DataSeries_RenderAs"));
                 //                        };
                 //                    } else {
                 //                        TFoot_Tr_Td_Div_Ul_Li0_Select0JQ.val(ControlData.ControlJQs.GridViewJQ.data("Chart_Series_DataSeries_RenderAs"));
                 //                    };
                 //                    var TFoot_Tr_Td_Div_Ul_Li1JQ = $("<li class=\"jQueryExtension_UI_GridView_DivChartSet_Is3D\"><input type=\"checkbox\" /><span>3D?</span></li>").appendTo(TFoot_Tr_Td_Div_UlJQ);
                 //                    var TFoot_Tr_Td_Div_Ul_Li1_input0JQ = $(">input:checkbox", TFoot_Tr_Td_Div_Ul_Li1JQ).bind("click", function () {
                 //                        ControlData.ControlJQs.GridViewJQ.data("Chart_View3D", ($(this).filter(":checked").length > 0 ? true : false));
                 //                        ControlData.ControlJQs.GridViewJQ.removeData("GridViewChart");
                 //                    });
                 //                    if (ControlData.ControlJQs.GridViewJQ.data("Chart_View3D") == undefined) {
                 //                        ControlData.ControlJQs.GridViewJQ.data("Chart_View3D", Settings.Chart_View3D);
                 //                    };
                 //                    if (ControlData.ControlJQs.GridViewJQ.data("Chart_View3D")) {
                 //                        TFoot_Tr_Td_Div_Ul_Li1_input0JQ.attr("checked", "checked");
                 //                    } else {
                 //                        TFoot_Tr_Td_Div_Ul_Li1_input0JQ.removeAttr("checked");
                 //                    };

                 //                    $("<li title=\"刷新统计图\">刷新</li>").bind("click", function () {
                 //                        var ControlJQs = $(Settings.Selector).data("ControlJQs");

                 //                        if (ControlData.ControlJQs.GridViewJQ.data("Chart_Series_DataSeries_RenderAs") != undefined) {
                 //                            Settings.Chart_Series_DataSeries_RenderAs = ControlData.ControlJQs.GridViewJQ.data("Chart_Series_DataSeries_RenderAs");
                 //                        } else {
                 //                            if (Settings.Chart_Series_DataSeries_RenderAsList != undefined && Settings.Chart_Series_DataSeries_RenderAsList.length > 0) {
                 //                                ControlData.ControlJQs.GridViewJQ.data("Chart_Series_DataSeries_RenderAs", Settings.Chart_Series_DataSeries_RenderAsList[0]);
                 //                                Settings.Chart_Series_DataSeries_RenderAs = ControlData.ControlJQs.GridViewJQ.data("Chart_Series_DataSeries_RenderAs");
                 //                            };
                 //                        };
                 //                        if (ControlData.ControlJQs.GridViewJQ.data("Chart_View3D") != undefined) {
                 //                            Settings.Chart_View3D = ControlData.ControlJQs.GridViewJQ.data("Chart_View3D");
                 //                        } else {
                 //                            ControlData.ControlJQs.GridViewJQ.data("Chart_View3D", Settings.Chart_View3D);
                 //                        };
                 //                        if (Settings.Chart__TargetElement != undefined && Settings.Chart__XapPath != undefined && Settings.Chart__X_DataField != undefined && Settings.Chart__Y_DataFieldList != undefined && Settings.Chart__Y_AllDataFieldList != undefined && Settings.Chart_Series_DataSeries_RenderAsList != undefined) {
                 //                            var ColumnList = ControlData.ControlJQs.GridViewJQ.data("ColumnList");

                 //                            Settings.DataSource = [];
                 //                            $.GridView.GetTrRowJQs(ControlData.ControlJQs.GridViewJQ).each(function () {
                 //                                Settings.DataSource.push($(this).data("Entity"));
                 //                            });

                 //                            var ChartSettings = {
                 //                                TargetElement: Settings.Chart__TargetElement
                 //                                , XapPath: Settings.Chart__XapPath
                 //                                , X_DataField: Settings.Chart__X_DataField
                 //                                , Y_DataFieldList: []
                 //                                , Y_AllDataFieldList: Settings.Chart__Y_AllDataFieldList
                 //                                , DataSource: Settings.DataSource
                 //                                , GridViewSelector: Settings.Selector
                 //                                , Chart_Series_DataSeries_RenderAs: Settings.Chart_Series_DataSeries_RenderAs
                 //                                , Chart_View3D: Settings.Chart_View3D
                 //                                , Chart_Titles_Text: Settings.Chart_Titles_Text
                 //                                , Chart_AxesX_Axis_Title: Settings.Chart_AxesX_Axis_Title
                 //                                , Chart_AxesY_Axis_Title: Settings.Chart_AxesY_Axis_Title
                 //                                , preLoad: Settings.Chart__preLoad
                 //                                , loaded: Settings.Chart__loaded
                 //                            };
                 //                            for (var i = 0; i < ColumnList.length; i++) {
                 //                                if (ColumnList[i].IsShow) {
                 //                                    var IsHas = false;
                 //                                    for (var j = 0; j < ChartSettings.Y_AllDataFieldList.length; j++) {
                 //                                        if (ChartSettings.Y_AllDataFieldList[j].DataField == ColumnList[i].DataField) {
                 //                                            IsHas = true;
                 //                                            break;
                 //                                        };
                 //                                    };
                 //                                    if (IsHas) {
                 //                                        //                                ChartSettings.Y_DataFieldList.push({ HeadText: ColumnList[i].HeadText, DataField: ColumnList[i].DataField });
                 //                                        ChartSettings.Y_DataFieldList.push(ColumnList[i]);
                 //                                    };
                 //                                };
                 //                            };
                 //                            Settings.Chart__Y_DataFieldList = ChartSettings.Y_DataFieldList;

                 //                            VisifireChart(ChartSettings);
                 //                        };
















                 //                    }).appendTo(TFoot_Tr_Td_Div_UlJQ);


                 var FocusObjectJQ = ColumnSetData.ControlJQs.GridView_DivTableColumnSetJQ;
                 var mousedownFunction = function (e) {
                     var ObjectJQ = $(e.target);
                     if (FocusObjectJQ != undefined && FocusObjectJQ.find('*').andSelf().index(ObjectJQ) > -1) {
                         //                                        inputTextJQ.val('继续焦点');
                     } else {
                         //                                        inputTextJQ.val('失去焦点');
                         $(document).unbind('mousedown', mousedownFunction);
                         ColumnSetData.ControlJQs.GridView_DivTableColumnSetJQ.hide();
                         FocusObjectJQ = undefined;
                     }
                 };
                 $(document).unbind('mousedown', mousedownFunction).bind('mousedown', mousedownFunction);


                 var ClickSelectorPosition = jQueryExtension.Position(ClickSelectorJQ);
                 var ClickSelectorBox = jQueryExtension.Box(ClickSelectorJQ);
                 ColumnSetData.ControlJQs.GridView_DivTableColumnSetJQ.css({
                     "left": ClickSelectorPosition.AbsoluteLeft + "px"
                    , "top": (ClickSelectorPosition.AbsoluteTop + ClickSelectorBox.Height()) + "px"
                 }).show();
                 //                });
                 //                for (var i = 0; i < Settings.ColumnList.length; i++) {
                 //                    var GridView_TrHead_ThHead_DivHeadJQ = $("<div class=\"jQueryExtension_UI_GridView_TrHead_ThHead_DivHead\"></div>");
                 //                    var GridView_TrHead_ThHeadJQ = $("<th class=\"jQueryExtension_UI_GridView_TrHead_ThHead\"></th>");
                 //                    GridView_TrHead_ThHead_DivHeadJQ.appendTo(GridView_TrHead_ThHeadJQ);
                 //                    GridView_TrHead_ThHeadJQ.appendTo(GridView_TrHeadJQ);
                 //                    GridView_TrHead_ThHead_DivHeadJQ.html(!fw.fwObject.FWObjectHelper.hasValue(Settings.ColumnList[i].HeadText) ? Settings.ColumnList[i].DataField : Settings.ColumnList[i].HeadText).css({
                 //                        "width": Settings.ColumnList[i].Width
                 //                        , "text-align": Settings.ColumnList[i].HeadAlignment
                 //                    });
                 //                };
                 //                ControlData.ControlJQs.GridView_TrHeadJQ = GridView_TrHeadJQ;
                 //                ControlData.ControlJQs.GridView_TrHead_ThTableColumnSetJQ = GridView_TrHead_ThTableColumnSetJQ;
                 //                ControlData.ControlJQs.GridView_TrHead_ThTableColumnSet_divTableColumnSetJQ = GridView_TrHead_ThTableColumnSet_divTableColumnSetJQ;

                 //                //                jQueryExtension.UI.Drag({
                 //                //                    Selector: $(">th", GridView_TrHeadJQ)
                 //                //            , Handler: null
                 //                //            , BorderWidth: 1
                 //                //            , MoveCondition: function () { return true }
                 //                //            , InSelector: ControlData.ControlJQs.GridView
                 //                //            , IsCanMoveOut: false
                 //                //            , IsNeedSelfMove: true
                 //                //            , CallBack: function () { }
                 //                //                });
                 //                return GridView_TrHeadJQ;

             }
             , ColumnMove: function (Properties) {
                 var Settings = {
                     Selector: null                                       //GridView控件选择器
                     , DragJQ: null
                     , DropToJQ: null
                     , MoveDirection: "Left"
                 };
                 $.extend(Settings, Properties);

                 var ControlData = $(Settings.Selector).data("ControlData");

                 var DragEntity = Settings.DragJQ.data("Entity");
                 var DropToEntity = Settings.DropToJQ.data("Entity");
                 var ColumnFrom = DragEntity.IsLock ? "Lock" : "Scroll";
                 var ColumnTo;
                 if (DropToEntity == undefined) {
                     ColumnTo = DragEntity.IsLock ? "Scroll" : "Lock";
                 } else {
                     ColumnTo = DropToEntity.IsLock ? "Lock" : "Scroll";
                 };


                 var IndexFrom;
                 var IndexTo;
                 var HeadFromJQ;
                 var HeadToJQ;
                 var BodyFromJQ;
                 var BodyToJQ;

                 if (ColumnFrom == "Lock") {
                     IndexFrom = $(">th>div.jQueryExtension_UI_GridView_TrHead_ThHead_DivHead", ControlData.ControlJQs.GridView_TrHead_LockJQ).index(Settings.DragJQ);
                     HeadFromJQ = ControlData.ControlJQs.GridView_TrHead_LockJQ;
                     BodyFromJQ = ControlData.ControlJQs.GridView_TbodyBody_TrRow_LockJQ;
                 } else {
                     IndexFrom = $(">th>div.jQueryExtension_UI_GridView_TrHead_ThHead_DivHead", ControlData.ControlJQs.GridView_TrHead_ScrollJQ).index(Settings.DragJQ);
                     HeadFromJQ = ControlData.ControlJQs.GridView_TrHead_ScrollJQ;
                     BodyFromJQ = ControlData.ControlJQs.GridView_TbodyBody_TrRow_ScrollJQ;
                 };

                 if (ColumnTo == "Lock") {
                     IndexTo = $(">th>div.jQueryExtension_UI_GridView_TrHead_ThHead_DivHead", ControlData.ControlJQs.GridView_TrHead_LockJQ).index(Settings.DropToJQ);
                     HeadToJQ = ControlData.ControlJQs.GridView_TrHead_LockJQ;
                     BodyToJQ = ControlData.ControlJQs.GridView_TbodyBody_TrRow_LockJQ;
                 } else {
                     IndexTo = $(">th>div.jQueryExtension_UI_GridView_TrHead_ThHead_DivHead", ControlData.ControlJQs.GridView_TrHead_ScrollJQ).index(Settings.DropToJQ);
                     HeadToJQ = ControlData.ControlJQs.GridView_TrHead_ScrollJQ;
                     BodyToJQ = ControlData.ControlJQs.GridView_TbodyBody_TrRow_ScrollJQ;
                 };

                 for (var i = 0; i < HeadFromJQ.length; i++) {
                     if (DropToEntity == undefined) {
                         $(">th:nth-child(" + (IndexFrom + 1) + ")", HeadFromJQ[i]).appendTo(HeadToJQ[i]);
                     } else {
                         if (Settings.MoveDirection == "Left") {
                             $(">th:nth-child(" + (IndexTo + 1) + ")", HeadToJQ[i]).before($(">th:nth-child(" + (IndexFrom + 1) + ")", HeadFromJQ[i]));
                         } else {
                             $(">th:nth-child(" + (IndexTo + 1) + ")", HeadToJQ[i]).after($(">th:nth-child(" + (IndexFrom + 1) + ")", HeadFromJQ[i]));
                         };
                     }
                 };
                 for (var i = 0; i < BodyFromJQ.length; i++) {
                     if (DropToEntity == undefined) {
                         $(">td:nth-child(" + (IndexFrom + 1) + ")", BodyFromJQ[i]).appendTo(BodyToJQ[i]);
                     } else {
                         if (Settings.MoveDirection == "Left") {
                             $(">td:nth-child(" + (IndexTo + 1) + ")", BodyToJQ[i]).before($(">td:nth-child(" + (IndexFrom + 1) + ")", BodyFromJQ[i]));
                         } else {
                             $(">td:nth-child(" + (IndexTo + 1) + ")", BodyToJQ[i]).after($(">td:nth-child(" + (IndexFrom + 1) + ")", BodyFromJQ[i]));
                         };
                     };
                 };
                 DragEntity.IsLock = ColumnTo == "Lock" ? true : false;

                 $.GridView.UpdateSortColumnList({ Selector: ControlData.ControlJQs.GridViewJQ });

                 $.GridView.UpdateLayout({ Selector: ControlData.ControlJQs.GridViewJQ });
                 $("#Text1").val(Settings.DropToJQ.text() + "|" + Settings.MoveDirection + "|" + IndexFrom + "|" + IndexTo);
             }
             , Select: function (Properties) {
                 var Settings = {
                     Selector: null                                       //GridView控件选择器
                    , SelectedIndex: -1                                   //选中行号
                 };
                 $.extend(Settings, Properties);

                 var ControlData = $(Settings.Selector).data("ControlData");
                 $(">tr:eq(" + Settings.SelectedIndex + ")", ControlData.ControlJQs.GridView_TbodyBody_ArrowJQ).click();
             }
             , Empty: function (Properties) {
                 var Settings = {
                     Selector: null                                       //GridView控件选择器
                 };
                 $.extend(Settings, Properties);

                 $(Settings.Selector).removeData("ControlData").removeData("ColumnList").removeData("GridViewChart").removeData("OnPageIndexChanging").empty();
             }
             , ClearDataSource: function (Properties) {
                 var Settings = {
                     Selector: null                                       //GridView控件选择器
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
                     SelectorJQ.GridView(ControlData.Settings);
                 };
             }
             , Refresh: function (Properties) {
                 var Settings = {
                     Selector: null                                       //GridView控件选择器
                 };
                 $.extend(Settings, Properties);

                 var ControlData = $(Settings.Selector).data("ControlData");
                 ControlData.ControlJQs.GridView_trFoot_tdFootLeft_spanFootRefreshJQ.click();
             }
             , UpdateSortColumnList: function (Properties) {
                 var Settings = {
                     Selector: null                                       //GridView控件选择器
                 };
                 $.extend(Settings, Properties);

                 var ControlData = $(Settings.Selector).data("ControlData");

                 var SortColumnList = [];
                 $(">th>div.jQueryExtension_UI_GridView_TrHead_ThHead_DivHead", ControlData.ControlJQs.GridView_TrHead_LockJQ).each(function () {
                     var Column = $(this).data("Entity");
                     SortColumnList.push(Column);
                 });
                 $(">th>div.jQueryExtension_UI_GridView_TrHead_ThHead_DivHead", ControlData.ControlJQs.GridView_TrHead_ScrollJQ).each(function () {
                     var Column = $(this).data("Entity");
                     SortColumnList.push(Column);
                 });
                 ControlData.SortColumnList = SortColumnList;
             }
             , UpdateLayout: function (Properties) {
                 var Settings = {
                     Selector: null                                       //GridView控件选择器
                 };
                 $.extend(Settings, Properties);

                 var ControlData = $(Settings.Selector).data("ControlData");
                 ControlData.ControlJQs.GridView_DivHeadAndBodyContainer_LockJQ.show();
                 ControlData.ControlJQs.GridView_DivHeadAndBodyContainer_ScrollJQ.show();

                 var Head_ArrowWidth = ControlData.ControlJQs.GridView_DivHeadAndBodyContainer_ArrowJQ.is(":hidden") ? 0 : ControlData.ControlJQs.GridView_TableHead_ArrowJQ.width();
                 var Head_LockWidth = ControlData.ControlJQs.GridView_DivHeadAndBodyContainer_ScrollJQ.is(":hidden") ? 0 : ControlData.ControlJQs.GridView_TableHead_LockJQ.width();
                 ControlData.ControlJQs.GridView_DivHeadAndBodyContainer_LockJQ.css("left", Head_ArrowWidth + "px");
                 ControlData.ControlJQs.GridView_DivHeadAndBodyContainer_ScrollJQ.css("left", (Head_ArrowWidth + Head_LockWidth) + "px");

                 var GridViewWidth = ControlData.ControlJQs.GridViewJQ.width();
                 if (GridViewWidth < Head_ArrowWidth) {
                     ControlData.ControlJQs.GridView_DivHeadAndBodyContainer_ScrollJQ.hide();
                     ControlData.ControlJQs.GridView_DivHeadAndBodyContainer_LockJQ.hide();
                 } else if (GridViewWidth < (Head_ArrowWidth + Head_LockWidth)) {
                     ControlData.ControlJQs.GridView_DivHeadAndBodyContainer_ScrollJQ.hide();
                 };

                 if ($.browser.msie && $.browser.version == "6.0") {
                     var GridViewWidth = ControlData.ControlJQs.GridViewJQ.width();
                     ControlData.ControlJQs.GridView_DivHeadAndBodyContainer_LockJQ.width(GridViewWidth - Head_ArrowWidth);
                     ControlData.ControlJQs.GridView_DivHeadAndBodyContainer_ScrollJQ.width(GridViewWidth - Head_ArrowWidth - Head_LockWidth);
                 };
             }
             , UpdateRowHeight: function (Properties) {
                 var Settings = {
                     Selector: null                                       //GridView控件选择器
                 };
                 $.extend(Settings, Properties);

                 var ControlData = $(Settings.Selector).data("ControlData");

                 var TableBody_ArrowHeight = ControlData.ControlJQs.GridView_TableBody_ArrowJQ.height();
                 var TableBody_LockHeight = ControlData.ControlJQs.GridView_TableBody_LockJQ.height();
                 var TableBody_ScrollHeight = ControlData.ControlJQs.GridView_TableBody_ScrollJQ.height();
                 if (TableBody_ArrowHeight != TableBody_LockHeight || TableBody_ArrowHeight != TableBody_LockHeight) {
                     for (var i = 0; i < ControlData.ControlJQs.GridView_TbodyBody_TrRow_ArrowJQ.length; i++) {
                         var Tr_ArrowJQ = ControlData.ControlJQs.GridView_TbodyBody_TrRow_ArrowJQ.eq(i);
                         var Tr_LockJQ = ControlData.ControlJQs.GridView_TbodyBody_TrRow_LockJQ.eq(i);
                         var Tr_ScrollJQ = ControlData.ControlJQs.GridView_TbodyBody_TrRow_ScrollJQ.eq(i);
                         var Tr_ArrowHeight = Tr_ArrowJQ.height();
                         var Tr_LockHeight = Tr_LockJQ.height();
                         var Tr_ScrollHeight = Tr_ScrollJQ.height();
                         var Tr_Height = Tr_ArrowHeight;
                         if (Tr_LockHeight > Tr_Height) {
                             Tr_Height = Tr_LockHeight;
                         };
                         if (Tr_ScrollHeight > Tr_Height) {
                             Tr_Height = Tr_ScrollHeight;
                         };

                         if ($.browser.msie) {
                             Tr_Height -= 1;
                         };
                         Tr_ArrowJQ.height(Tr_Height);
                         Tr_LockJQ.height(Tr_Height);
                         Tr_ScrollJQ.height(Tr_Height);

                     };
                 };
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

                             if (fw.fwObject.FWObjectHelper.hasValue(Settings.Width) && ControlData.ControlJQs.GridViewJQ.width() != Settings.Width) {
                                 SelectorJQ.width(Settings.Width);
                                 IsResize = true;
                             };
                             if (fw.fwObject.FWObjectHelper.hasValue(Settings.Height) && ControlData.ControlJQs.GridViewJQ.height() != Settings.Height) {
                                 IsResize = true;
                             };
                             if (IsResize || Settings.IsMustResize) {
                                 ControlData.IsResize = true;
                                 var FootHeight = ControlData.ControlJQs.GridView_DivFootJQ.is(":hidden") ? 0 : ControlData.ControlJQs.GridView_DivFootJQ.height() + 2;
                                 var HeadAndBodyHeight = Settings.Height - FootHeight;
                                 var HeadHeight = ControlData.ControlJQs.GridView_DivHead_ScrollJQ.is(":hidden") ? 0 : ControlData.ControlJQs.GridView_DivHead_ScrollJQ.height() + 2;
                                 var BodyHeight = HeadAndBodyHeight - HeadHeight - 0;

                                 ControlData.ControlJQs.GridView_DivHeadAndBodyJQ.height(HeadAndBodyHeight);

                                 ControlData.ControlJQs.GridView_DivBody_ArrowJQ.css("overflow", "hidden").height(BodyHeight);
                                 ControlData.ControlJQs.GridView_DivBody_LockJQ.height(BodyHeight);
                                 jQueryExtension.ResizeWidthHeight({
                                     Selector: ControlData.ControlJQs.GridView_DivBody_ScrollJQ.css("overflow", "auto")
                                    , Width: Settings.Width
                                    , Height: BodyHeight
                                    , IsMustResize: Settings.IsMustResize
                                 });

                                 if ($.browser.msie) {
                                     if (jQueryExtension.ScrollLeft(ControlData.ControlJQs.GridView_DivBody_ScrollJQ) > 0) {
                                         if (ControlData.ControlJQs.GridView_DivBody_ScrollJQ.width() - ControlData.ControlJQs.GridView_TableBody_ScrollJQ.width() >= 17) {
                                             ControlData.ControlJQs.GridView_DivBody_ScrollJQ.css("overflow-x", "hidden");
                                             jQueryExtension.ScrollLeft(ControlData.ControlJQs.GridView_DivBody_ScrollJQ, 0);
                                         } else {
                                             ControlData.ControlJQs.GridView_DivBody_ScrollJQ.css("overflow-x", "auto");
                                         };
                                         ControlData.ControlJQs.GridView_DivBody_ScrollJQ.scroll();
                                         ControlData.ControlJQs.GridView_DivBody_ScrollJQ.scroll();
                                     };
                                 };

                                 ControlData.ControlJQs.GridView_trFoot_tdFootRightJQ.show();
                                 if (ControlData.ControlJQs.GridView_DivFootJQ.width() < ControlData.ControlJQs.GridView_TableFootJQ.width()) {
                                     ControlData.ControlJQs.GridView_trFoot_tdFootRightJQ.hide();
                                 };

                             };
                         };
                     });
                 };
             }

        };


        //分页GridView
        $.fn.extend({
            GridView_Init: function (Properties) {
                if (!fw.fwObject.FWObjectHelper.hasValue(Properties)) { Properties = {}; };
                var Settings = $.GridView.Settings();
                $.extend(Settings, Properties);

                this.each(function () {
                    var GridViewJQ = $(this);
                    var ControlData = GridViewJQ.data("ControlData");

                    //判断GridView有没缓存数据，有表示已经加载控件，无表示控件第一次加载
                    if (!fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                        ControlData = {
                            ScrollLeft: 0
                            , ScrollTop: 0
                            , IsResize: false
                        };
                        GridViewJQ.data("ControlData", ControlData);

                        var WindowGuid = fw.guid();
                        $.GridView.DivGridView_ContentRandomNumber = "GridView_TableBody_Scroll__" + WindowGuid;
                        $.GridView.DivGridView_IndexRandomNumber = "GridView_TableBody_Lock__" + WindowGuid;
                        var Html = "";
                        Html += "<div id=\"GridView_DivHeadAndBody__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_DivHeadAndBody\">";
                        Html += "<div id=\"GridView_DivHeadAndBodyContainer_Arrow__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_DivHeadAndBodyContainer\" style=\"position: absolute; left: 0px; right: 0px;\">";
                        Html += "<div id=\"GridView_DivHead_Arrow__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_DivHead ArrowLeftBorder\">";
                        Html += "<div id=\"GridView_DivHeadContainer_Arrow__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_DivHeadContainer\" style=\"margin: 0px 0px;\">";
                        Html += "<table id=\"GridView_TableHead_Arrow__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_TableHead\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">";
                        Html += "<thead id=\"GridView_TheadHead_Arrow__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_TheadHead\">";
                        Html += "<tr id=\"GridView_TrHead_Arrow__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_TrHead\">";
                        Html += "<th id=\"GridView_TrHead_ThTableColumnSet__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_TrHead_ThTableColumnSet\">";
                        Html += "<div id=\"GridView_TrHead_ThTableColumnSet_divTableColumnSet__" + WindowGuid + "\" title=\"设置\" class=\"jQueryExtension_UI_GridView_TrHead_ThTableColumnSet_divTableColumnSet\">&nbsp;</div>";
                        Html += "</th>";
                        Html += "</tr>";
                        Html += "</thead>";
                        Html += "</table>";
                        Html += "</div>";
                        Html += "</div>";
                        Html += "<div id=\"GridView_DivBody_Arrow__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_DivBody ArrowLeftBorder\">";
                        Html += "<table id=\"GridView_TableBody_Arrow__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_TableBody\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">";
                        Html += "<tbody id=\"GridView_TbodyBody_Arrow__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_TbodyBody\"></tbody>";
                        Html += "</table>";
                        Html += "<div style=\"height:17px;\"></div>";
                        Html += "</div>";
                        Html += "</div>";
                        Html += "<div id=\"GridView_DivHeadAndBodyContainer_Lock__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_DivHeadAndBodyContainer\" style=\"position: absolute; left: 21px; right: 0px;\">";
                        Html += "<div id=\"GridView_DivHead_Lock__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_DivHead\">";
                        Html += "<div id=\"GridView_DivHeadContainer_Lock__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_DivHeadContainer\" style=\"margin: 0px 0px;\">";
                        Html += "<table id=\"GridView_TableHead_Lock__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_TableHead\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">";
                        Html += "<thead id=\"GridView_TheadHead_Lock__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_TheadHead\">";
                        Html += "<tr id=\"GridView_TrHead_Lock__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_TrHead\"></tr>";
                        Html += "</thead>";
                        Html += "</table>";
                        Html += "</div>";
                        Html += "</div>";
                        Html += "<div id=\"GridView_DivBody_Lock__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_DivBody ArrowRightBorder\" style=\"overflow-x: hidden;\">";
                        Html += "<table id=\"GridView_TableBody_Lock__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_TableBody\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">";
                        Html += "<tbody id=\"GridView_TbodyBody_Lock__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_TbodyBody\"></tbody>";
                        Html += "</table>";
                        Html += "<div style=\"height:17px;\"></div>";
                        Html += "</div>";
                        Html += "</div>";
                        Html += "<div id=\"GridView_DivHeadAndBodyContainer_Scroll__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_DivHeadAndBodyContainer\" style=\"position: absolute; left: 421px; right: 0px;\">";
                        Html += "<div id=\"GridView_DivHead_Scroll__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_DivHead\">";
                        Html += "<div id=\"GridView_DivHeadContainer_Scroll__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_DivHeadContainer\" style=\"margin: 0px 0px; " + ($.browser.msie ? "padding-right: 34px;" : "padding-right: 17px;") + "\">";
                        Html += "<table id=\"GridView_TableHead_Scroll__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_TableHead\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">";
                        Html += "<thead id=\"GridView_TheadHead_Scroll__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_TheadHead\">";
                        Html += "<tr id=\"GridView_TrHead_Scroll__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_TrHead\"></tr>";
                        Html += "</thead>";
                        Html += "</table>";
                        Html += "</div>";
                        Html += "</div>";
                        Html += "<div id=\"GridView_DivBody_Scroll__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_DivBody\">";
                        Html += "<table id=\"GridView_TableBody_Scroll__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_TableBody\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">";
                        Html += "<tbody id=\"GridView_TbodyBody_Scroll__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_TbodyBody\"></tbody>";
                        Html += "</table>";
                        Html += "</div>";
                        Html += "</div>";
                        Html += "<div id=\"GridView_DivColumnResizeRange__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_DivColumnResizeRange\"></div>";
                        Html += "<div id=\"GridView_DivColumnResize_Left__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_DivColumnResize_Left\"></div>";
                        Html += "<div id=\"GridView_DivColumnResize_Right__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_DivColumnResize_Right\"></div>";
                        Html += "</div>";
                        Html += "<div id=\"GridView_DivFoot__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_DivFoot\">";
                        Html += "<table id=\"GridView_TableFoot__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_TableFoot\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">";
                        Html += "<tfoot id=\"GridView_TfootFoot__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_TfootFoot\">";
                        Html += "<tr class=\"jQueryExtension_UI_GridView_trFoot\">";
                        Html += "<td class=\"jQueryExtension_UI_GridView_trFoot_tdFootLeft\"><span id=\"GridView_trFoot_tdFootLeft_spanFootRefresh__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_trFoot_tdFootLeft_spanFootRefresh\" title=\"刷新\">&nbsp;</span><span>共</span><a id=\"GridView_trFoot_tdFootLeft_aFootRecordCount__" + WindowGuid + "\">0</a><span>条记录,每页</span><input id=\"GridView_trFoot_tdFootLeft_inputFootPageSize__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_trFoot_tdFootLeft_inputFootPageSize\" type=\"text\" value=\"0\"onfocus=\"select();\" /><a id=\"GridView_trFoot_tdFootLeft_aFootPageSize__" + WindowGuid + "\" style=\"display:none;\">0</a><span>条,转到</span><input id=\"GridView_trFoot_tdFootLeft_inputFootPageNow__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_trFoot_tdFootLeft_inputFootPageNow\" type=\"text\" value=\"0\"onfocus=\"select();\" />/<a id=\"GridView_trFoot_tdFootLeft_aFootPageCount__" + WindowGuid + "\">0</a><select id=\"GridView_trFoot_tdFootLeft_selectFootPageNow__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_trFoot_tdFootLeft_selectFootPageNow\" style=\"display:none;\"><option value=\"0\">0/0</option></select><span>页</span></td>";
                        Html += "<td class=\"jQueryExtension_UI_GridView_trFoot_tdFootCenter\"><div id=\"GridView_trFoot_tdFootCenter_DivFootLoading__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_trFoot_tdFootCenter_DivFootLoading\"></div></td>";
                        Html += "<td id=\"GridView_trFoot_tdFootRight__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_trFoot_tdFootRight\"><a id=\"GridView_trFoot_tdFootRight_aFootFirstPage__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_trFoot_tdFootRight_aFootFirstPage\">首  页</a><a id=\"GridView_trFoot_tdFootRight_aFootPageUp__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_trFoot_tdFootRight_aFootPageUp\">上一页</a><a id=\"GridView_trFoot_tdFootRight_aFootPageDown__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_trFoot_tdFootRight_aFootPageDown\">下一页</a><a id=\"GridView_trFoot_tdFootRight_aFootLastPage__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_trFoot_tdFootRight_aFootLastPage\">末  页</a></td>";
                        Html += "</tr>";
                        Html += "</tfoot>";
                        Html += "</table>";
                        Html += "</div>";
                        Html += "<div id=\"GridView_DivBodyLoading__" + WindowGuid + "\" class=\"jQueryExtension_UI_GridView_DivBodyLoading\"></div>";
                        $(Html).appendTo(GridViewJQ);

                        ControlData.PageNow = 1;
                        ControlData.SelectedIndex = 0;

                        ControlData.ControlJQs = {
                            IsInit: true
                            , WindowGuid: WindowGuid
                            , GridViewJQ: GridViewJQ.data("WindowGuid", WindowGuid).addClass('jQueryExtension_UI_GridView')
                            , GridView_DivHeadAndBodyJQ: $("#GridView_DivHeadAndBody__" + WindowGuid)
                            , GridView_DivHeadAndBodyContainer_ArrowJQ: $("#GridView_DivHeadAndBodyContainer_Arrow__" + WindowGuid)
                            , GridView_DivHead_ArrowJQ: $("#GridView_DivHead_Arrow__" + WindowGuid)
                            , GridView_DivHeadContainer_ArrowJQ: $("#GridView_DivHeadContainer_Arrow__" + WindowGuid)
                            , GridView_TableHead_ArrowJQ: $("#GridView_TableHead_Arrow__" + WindowGuid)
                            , GridView_TheadHead_ArrowJQ: $("#GridView_TheadHead_Arrow__" + WindowGuid)
                            , GridView_TrHead_ArrowJQ: $("#GridView_TrHead_Arrow__" + WindowGuid)
                            , GridView_TrHead_ThTableColumnSet_divTableColumnSetJQ: $("#GridView_TrHead_ThTableColumnSet_divTableColumnSet__" + WindowGuid)
                            , GridView_DivBody_ArrowJQ: $("#GridView_DivBody_Arrow__" + WindowGuid)
                            , GridView_TableBody_ArrowJQ: $("#GridView_TableBody_Arrow__" + WindowGuid)
                            , GridView_TbodyBody_ArrowJQ: $("#GridView_TbodyBody_Arrow__" + WindowGuid)
                            , GridView_TbodyBody_TrRow_ArrowJQ: undefined
                            , GridView_DivHeadAndBodyContainer_LockJQ: $("#GridView_DivHeadAndBodyContainer_Lock__" + WindowGuid)
                            , GridView_DivHead_LockJQ: $("#GridView_DivHead_Lock__" + WindowGuid)
                            , GridView_DivHeadContainer_LockJQ: $("#GridView_DivHeadContainer_Lock__" + WindowGuid)
                            , GridView_TableHead_LockJQ: $("#GridView_TableHead_Lock__" + WindowGuid)
                            , GridView_TheadHead_LockJQ: $("#GridView_TheadHead_Lock__" + WindowGuid)
                            , GridView_TrHead_LockJQ: $("#GridView_TrHead_Lock__" + WindowGuid)
                            , GridView_DivBody_LockJQ: $("#GridView_DivBody_Lock__" + WindowGuid)
                            , GridView_TableBody_LockJQ: $("#GridView_TableBody_Lock__" + WindowGuid)
                            , GridView_TbodyBody_LockJQ: $("#GridView_TbodyBody_Lock__" + WindowGuid)
                            , GridView_TbodyBody_TrRow_LockJQ: undefined
                            , GridView_DivHeadAndBodyContainer_ScrollJQ: $("#GridView_DivHeadAndBodyContainer_Scroll__" + WindowGuid)
                            , GridView_DivHead_ScrollJQ: $("#GridView_DivHead_Scroll__" + WindowGuid)
                            , GridView_DivHeadContainer_ScrollJQ: $("#GridView_DivHeadContainer_Scroll__" + WindowGuid)
                            , GridView_TableHead_ScrollJQ: $("#GridView_TableHead_Scroll__" + WindowGuid)
                            , GridView_TheadHead_ScrollJQ: $("#GridView_TheadHead_Scroll__" + WindowGuid)
                            , GridView_TrHead_ScrollJQ: $("#GridView_TrHead_Scroll__" + WindowGuid)
                            , GridView_DivBody_ScrollJQ: $("#GridView_DivBody_Scroll__" + WindowGuid)
                            , GridView_TableBody_ScrollJQ: $("#GridView_TableBody_Scroll__" + WindowGuid)
                            , GridView_TbodyBody_ScrollJQ: $("#GridView_TbodyBody_Scroll__" + WindowGuid)
                            , GridView_TbodyBody_TrRow_ScrollJQ: undefined
                            , GridView_DivColumnResizeRangeJQ: $("#GridView_DivColumnResizeRange__" + WindowGuid)
                            , GridView_DivColumnResize_LeftJQ: $("#GridView_DivColumnResize_Left__" + WindowGuid)
                            , GridView_DivColumnResize_RightJQ: $("#GridView_DivColumnResize_Right__" + WindowGuid)
                            , GridView_DivFootJQ: $("#GridView_DivFoot__" + WindowGuid)
                            , GridView_TableFootJQ: $("#GridView_TableFoot__" + WindowGuid)
                            , GridView_TfootFootJQ: $("#GridView_TfootFoot__" + WindowGuid)
                            , GridView_trFoot_tdFootLeft_spanFootRefreshJQ: $("#GridView_trFoot_tdFootLeft_spanFootRefresh__" + WindowGuid)
                            , GridView_trFoot_tdFootLeft_aFootRecordCountJQ: $("#GridView_trFoot_tdFootLeft_aFootRecordCount__" + WindowGuid)
                            , GridView_trFoot_tdFootLeft_inputFootPageSizeJQ: $("#GridView_trFoot_tdFootLeft_inputFootPageSize__" + WindowGuid)
                            , GridView_trFoot_tdFootLeft_aFootPageSizeJQ: $("#GridView_trFoot_tdFootLeft_aFootPageSize__" + WindowGuid)
                            , GridView_trFoot_tdFootLeft_inputFootPageNowJQ: $("#GridView_trFoot_tdFootLeft_inputFootPageNow__" + WindowGuid)
                            , GridView_trFoot_tdFootLeft_aFootPageCountJQ: $("#GridView_trFoot_tdFootLeft_aFootPageCount__" + WindowGuid)
                            , GridView_trFoot_tdFootLeft_selectFootPageNowJQ: $("#GridView_trFoot_tdFootLeft_selectFootPageNow__" + WindowGuid)
                            , GridView_trFoot_tdFootRightJQ: $("#GridView_trFoot_tdFootRight__" + WindowGuid)
                            , GridView_trFoot_tdFootRight_aFootFirstPageJQ: $("#GridView_trFoot_tdFootRight_aFootFirstPage__" + WindowGuid)
                            , GridView_trFoot_tdFootRight_aFootPageUpJQ: $("#GridView_trFoot_tdFootRight_aFootPageUp__" + WindowGuid)
                            , GridView_trFoot_tdFootRight_aFootPageDownJQ: $("#GridView_trFoot_tdFootRight_aFootPageDown__" + WindowGuid)
                            , GridView_trFoot_tdFootRight_aFootLastPageJQ: $("#GridView_trFoot_tdFootRight_aFootLastPage__" + WindowGuid)
                            , GridView_trFoot_tdFootCenter_DivFootLoadingJQ: $("#GridView_trFoot_tdFootCenter_DivFootLoading__" + WindowGuid)
                            , GridView_DivBodyLoadingJQ: $("#GridView_DivBodyLoading__" + WindowGuid)
                        };

                        //添加设置按钮事件
                        ControlData.ControlJQs.GridView_TrHead_ThTableColumnSet_divTableColumnSetJQ.bind("click", function () {
                            $.GridView.ColumnSet({ Selector: ControlData.ControlJQs.GridViewJQ, ClickSelector: this });
                        });

                        //当锁定区域滚动条滚动时 同步箭头区域和滚动区域滚动条
                        ControlData.ControlJQs.GridView_DivBody_LockJQ.bind("scroll", function () {
                            jQueryExtension.ScrollTop(ControlData.ControlJQs.GridView_DivBody_ScrollJQ, jQueryExtension.ScrollTop(ControlData.ControlJQs.GridView_DivBody_LockJQ));
                            jQueryExtension.ScrollTop(ControlData.ControlJQs.GridView_DivBody_ArrowJQ, jQueryExtension.ScrollTop(ControlData.ControlJQs.GridView_DivBody_ScrollJQ));
                            jQueryExtension.ScrollTop(ControlData.ControlJQs.GridView_DivBody_LockJQ, jQueryExtension.ScrollTop(ControlData.ControlJQs.GridView_DivBody_ScrollJQ));
                        });

                        //当滚动区域滚动条滚动时 同步箭头区域和锁定区域滚动条
                        ControlData.ControlJQs.GridView_DivBody_ScrollJQ.bind("scroll", function () {
                            var ScrollLeft = jQueryExtension.ScrollLeft(ControlData.ControlJQs.GridView_DivBody_ScrollJQ);
                            jQueryExtension.ScrollLeft(ControlData.ControlJQs.GridView_DivHead_ScrollJQ, ScrollLeft);

                            var ScrollTop = jQueryExtension.ScrollTop(ControlData.ControlJQs.GridView_DivBody_ScrollJQ);
                            jQueryExtension.ScrollTop(ControlData.ControlJQs.GridView_DivBody_ArrowJQ, ScrollTop);
                            jQueryExtension.ScrollTop(ControlData.ControlJQs.GridView_DivBody_LockJQ, ScrollTop);
                            ControlData.ScrollLeft = ScrollLeft;
                            ControlData.ScrollTop = ScrollTop;
                        });

                        //左下角刷新事件绑定
                        ControlData.ControlJQs.GridView_trFoot_tdFootLeft_spanFootRefreshJQ.bind("click", function () {
                            if ($.isFunction(ControlData.Settings.OnPageIndexChanging)) {
                                ControlData.Settings.OnPageIndexChanging(ControlData.PageNow);
                            };
                        });

                        //绑定左下角分页大小发生变化事件
                        ControlData.ControlJQs.GridView_trFoot_tdFootLeft_inputFootPageSizeJQ.bind("blur", function () {
                            var ValueString = $(this).val();
                            if (!isNaN(ValueString) && parseInt(ValueString) != ControlData.PageSize) {
                                if (parseInt(ValueString) > $.GridView.MaxPageSize) {
                                    $(this).val($.GridView.MaxPageSize);
                                };
                                if ($.isFunction(ControlData.Settings.OnPageIndexChanging)) {
                                    ControlData.PageSize = parseInt(ValueString);
                                    ControlData.Settings.OnPageIndexChanging(ControlData.PageNow);
                                };
                            } else {
                                $(this).val(ControlData.PageSize);
                            };
                        }).bind("keypress", function (e) {
                            var key = e.which;
                            if (key == 13) {
                                $(this).blur();
                            };
                        });

                        //绑定左下角页发生变化事件
                        ControlData.ControlJQs.GridView_trFoot_tdFootLeft_inputFootPageNowJQ.bind("blur", function () {
                            var ValueString = $(this).val();
                            if (!isNaN(ValueString) && parseInt(ValueString) != ControlData.PageNow) {
                                if ($.isFunction(ControlData.Settings.OnPageIndexChanging)) {
                                    ControlData.PageNow = parseInt(ValueString);
                                    ControlData.Settings.OnPageIndexChanging(ControlData.PageNow);
                                };
                            } else {
                                $(this).val(ControlData.PageNow);
                            };
                        }).bind("keypress", function (e) {
                            var key = e.which;
                            if (key == 13) {
                                $(this).blur();
                            };
                        });
                        ControlData.ControlJQs.GridView_trFoot_tdFootLeft_selectFootPageNowJQ.bind("change", function () {
                            if ($.isFunction(ControlData.ControlJQs.GridViewJQ.data("OnPageIndexChanging"))) {
                                ControlData.ControlJQs.GridViewJQ.data("OnPageIndexChanging")($(this).val());
                            };
                        });

                        //首页 上一页 下一页 末页 事件绑定
                        ControlData.ControlJQs.GridView_trFoot_tdFootRight_aFootFirstPageJQ.add(ControlData.ControlJQs.GridView_trFoot_tdFootRight_aFootPageUpJQ).add(ControlData.ControlJQs.GridView_trFoot_tdFootRight_aFootPageDownJQ).add(ControlData.ControlJQs.GridView_trFoot_tdFootRight_aFootLastPageJQ).bind("click", function () {
                            var NewPageIndex = $(this).data("NewPageIndex");
                            if (NewPageIndex != undefined) {
                                if ($.isFunction(ControlData.Settings.OnPageIndexChanging)) {
                                    ControlData.Settings.OnPageIndexChanging(NewPageIndex);
                                };
                            };
                        });


                    } else {
                        ControlData.ControlJQs.IsInit = false;
                    };

                    //是否显示表头
                    if (!Settings.IsShowHead) {
                        ControlData.ControlJQs.GridView_DivHead_ArrowJQ.hide();
                        ControlData.ControlJQs.GridView_DivHead_LockJQ.hide();
                        ControlData.ControlJQs.GridView_DivHead_ScrollJQ.hide();
                    } else {
                        ControlData.ControlJQs.GridView_DivHead_ArrowJQ.show();
                        ControlData.ControlJQs.GridView_DivHead_LockJQ.show();
                        ControlData.ControlJQs.GridView_DivHead_ScrollJQ.show();
                    };

                    //是否显示分页
                    if (!Settings.IsShowFoot) {
                        ControlData.ControlJQs.GridView_DivFootJQ.hide();
                    } else {
                        ControlData.ControlJQs.GridView_DivFootJQ.show();
                    };

                    //是否开启箭头
                    if (Settings.IsShowSelectedArrowhead) {
                        ControlData.ControlJQs.GridView_DivHeadAndBodyContainer_ArrowJQ.show();
                    } else {
                        ControlData.ControlJQs.GridView_DivHeadAndBodyContainer_ArrowJQ.hide();
                    };

                    //获取当前列信息，并与这次绑定列信息进行比较，看表头有没发生变化
                    var OldColumnList = !fw.fwObject.FWObjectHelper.hasValue(ControlData.Settings) ? undefined : ControlData.Settings.ColumnList;
                    var IsColumnListChange = false;
                    IsColumnListChange = !fw.fwObject.FWObjectHelper.hasValue(Settings.ColumnList) ? true : false;
                    IsColumnListChange = !fw.fwObject.FWObjectHelper.hasValue(OldColumnList) ? true : false;
                    if (!IsColumnListChange) {
                        if (OldColumnList.length == Settings.ColumnList.length) {
                            for (var i = 0; i < OldColumnList.length; i++) {
                                var IsHas = false;
                                for (var j = 0; j < Settings.ColumnList.length; j++) {
                                    if (OldColumnList[i].HeadText == Settings.ColumnList[j].HeadText && OldColumnList[i].DataField == Settings.ColumnList[j].DataField) {
                                        IsHas = true;
                                        break;
                                    };
                                };
                                if (!IsHas) {
                                    IsColumnListChange = true;
                                    break;
                                };
                            };
                        } else {
                            IsColumnListChange = true;
                        };
                    };
                    IsColumnListChange = IsColumnListChange ? IsColumnListChange : (Settings.IsShowSelectedArrowhead != ControlData.Settings.IsShowSelectedArrowhead);

                    //当Settings发生变化，替换缓存Settings
                    if (ControlData.Settings == undefined) {
                        ControlData.Settings = Settings;
                    } else {
                        $.extend(ControlData.Settings, Settings);
                    };

                    //如果表头发生变化，重新初始化表头
                    if (IsColumnListChange) {
                        ControlData.SortColumnList = [];
                        for (var i = 0; i < ControlData.Settings.ColumnList.length; i++) {
                            var ColumnSettings = $.GridView.Column();
                            $.extend(ColumnSettings, ControlData.Settings.ColumnList[i]);
                            if (!fw.fwObject.FWObjectHelper.hasValue(ControlData.Settings.ColumnList[i].ColumnText)) { ColumnSettings.ColumnText = ColumnSettings.HeadText; };
                            if (!fw.fwObject.FWObjectHelper.hasValue(ControlData.Settings.ColumnList[i].Width)) { ColumnSettings.Width = $.GridView.ColumnMinWidth; };
                            ColumnSettings.Index = i;
                            ControlData.SortColumnList.push(ColumnSettings);
                        };
                        var ColumnCount = ControlData.SortColumnList.length;
                        for (var i = 0; i < ColumnCount; i++) {
                            if (!ControlData.SortColumnList[i].IsLock) {
                                ControlData.SortColumnList.push(ControlData.SortColumnList[i]);
                                ControlData.SortColumnList.splice(i, 1);
                                i--;
                                ColumnCount--;
                            };
                        };
                        if (ControlData.SortColumnList.length > 0 && ControlData.SortColumnList[ControlData.SortColumnList.length - 1].IsLock) {
                            ControlData.SortColumnList[ControlData.SortColumnList.length - 1].IsLock = false;
                        };

                        var ObjectList = $.GridView.HeadFunction({ Selector: ControlData.ControlJQs.GridViewJQ });

                        ControlData.ControlJQs.GridView_TrHead_LockJQ.empty();
                        ControlData.ControlJQs.GridView_TrHead_ScrollJQ.empty();

                        //循环生成表头
                        for (var i = 0; i < ControlData.SortColumnList.length; i++) {
                            var IsHeadTable = false;
                            var HeadTableJQ;
                            var GridView_TrHead_ThHeadJQ = $("<th class=\"jQueryExtension_UI_GridView_TrHead_ThHead\"></th>").appendTo(ControlData.SortColumnList[i].IsLock ? ControlData.ControlJQs.GridView_TrHead_LockJQ : ControlData.ControlJQs.GridView_TrHead_ScrollJQ);
                            if (!ControlData.SortColumnList[i].IsShow) {
                                GridView_TrHead_ThHeadJQ.hide();
                            };
                            var GridView_TrHead_ThHead_DivHeadJQ = $("<div class=\"jQueryExtension_UI_GridView_TrHead_ThHead_DivHead\"></div>").appendTo(GridView_TrHead_ThHeadJQ).css({
                                "width": ControlData.SortColumnList[i].Width
                                , "text-align": ControlData.SortColumnList[i].HeadAlignment
                            }).data("Entity", ControlData.SortColumnList[i]);
                            var InnerJQ = ObjectList[i];
                            if (!fw.fwObject.FWObjectHelper.hasValue(InnerJQ)) {
                                $("<a>&nbsp;</a>").appendTo(GridView_TrHead_ThHead_DivHeadJQ);
                            } else {
                                if (InnerJQ instanceof jQuery) {
                                    $(InnerJQ).appendTo(GridView_TrHead_ThHead_DivHeadJQ);
                                } else if (typeof (InnerJQ) == "string") {
                                    if (InnerJQ.indexOf("<table") == 0) {
                                        HeadTableJQ = $(InnerJQ).appendTo(GridView_TrHead_ThHead_DivHeadJQ);
                                        IsHeadTable = true;
                                    } else {
                                        $("<a>" + InnerJQ + "</a>").appendTo(GridView_TrHead_ThHead_DivHeadJQ);
                                    };
                                } else if (typeof (InnerJQ) == "number") {
                                    $("<a>" + InnerJQ + "</a>").appendTo(GridView_TrHead_ThHead_DivHeadJQ);
                                } else if (typeof (InnerJQ) == "object") {
                                    $("<a>&nbsp;</a>").appendTo(GridView_TrHead_ThHead_DivHeadJQ);
                                } else {
                                    $("<a>&nbsp;</a>").appendTo(GridView_TrHead_ThHead_DivHeadJQ);
                                };
                            };

                            var SortType = ControlData.SortColumnList[i].SortType;
                            var GridView_TrHead_ThHead_DivColumnSetJQ = $("<div class=\"jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnSet" + (SortType == undefined ? "" : " jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnSet_SortType_" + SortType) + "\"></div>").appendTo(GridView_TrHead_ThHeadJQ).bind("click", function () { $.GridView.ColumnSet({ Selector: ControlData.ControlJQs.GridViewJQ, ClickSelector: this }); });

                            //添加表头鼠标经过事件触发样式变化
                            if (SortType == undefined) {
                                GridView_TrHead_ThHeadJQ.hover(
                                    function () {
                                        $(">div.jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnSet", this).addClass('jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnSetHover jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnSet_ColumnSet');
                                    }
                                    , function () {
                                        $(">div.jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnSet", this).removeClass('jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnSetHover jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnSet_ColumnSet');
                                    }
                                );
                            } else {
                                GridView_TrHead_ThHeadJQ.hover(
                                    function () {
                                        $(">div.jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnSet", this).addClass('jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnSetHover');
                                    }
                                    , function () {
                                        $(">div.jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnSet", this).removeClass('jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnSetHover');
                                    }
                                );
                            };

                            if (!IsHeadTable) {
                                $("<div class=\"jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnResize\"></div>").appendTo(GridView_TrHead_ThHeadJQ);
                            } else {
                                var HeadTableWidth = HeadTableJQ.width();
                                GridView_TrHead_ThHead_DivHeadJQ.width(HeadTableWidth);
                                ControlData.SortColumnList[i].Width = HeadTableWidth;

                                var HeadTableHeight = HeadTableJQ.height();
                                var DivColumnSetHeight = GridView_TrHead_ThHead_DivColumnSetJQ.height();
                                if (HeadTableHeight > DivColumnSetHeight) {
                                    GridView_TrHead_ThHead_DivColumnSetJQ.css("margin-top", (0 - DivColumnSetHeight - (HeadTableHeight - DivColumnSetHeight) / 2) + "px");
                                };
                            };
                        };

                        ControlData.ControlJQs.GridView_TrHead_ArrowJQ.height(0);
                        ControlData.ControlJQs.GridView_TrHead_LockJQ.height(0);
                        ControlData.ControlJQs.GridView_TrHead_ScrollJQ.height(0);
                        var TrHead_ArrowHeight = ControlData.ControlJQs.GridView_TrHead_ArrowJQ.height();
                        var TrHead_LockHeight = ControlData.ControlJQs.GridView_TrHead_LockJQ.height();
                        var TrHead_ScrollHeight = ControlData.ControlJQs.GridView_TrHead_ScrollJQ.height();
                        var TrHeadHeight = TrHead_ArrowHeight;
                        if (TrHead_LockHeight > TrHeadHeight) {
                            TrHeadHeight = TrHead_LockHeight;
                        };
                        if (TrHead_ScrollHeight > TrHeadHeight) {
                            TrHeadHeight = TrHead_ScrollHeight;
                        };
                        ControlData.ControlJQs.GridView_TrHead_ArrowJQ.height(TrHeadHeight);
                        ControlData.ControlJQs.GridView_TrHead_LockJQ.height(TrHeadHeight);
                        ControlData.ControlJQs.GridView_TrHead_ScrollJQ.height(TrHeadHeight);
                        ControlData.ControlJQs.GridView_DivHead_ScrollJQ.height(TrHeadHeight);

                        if (TrHeadHeight > parseInt(ControlData.ControlJQs.GridView_TrHead_ArrowJQ.css("line-height"))) {
                            ControlData.ControlJQs.GridView_DivHead_ArrowJQ.css("background-position", "0px bottom");
                            ControlData.ControlJQs.GridView_DivHead_LockJQ.css("background-position", "0px bottom");
                            ControlData.ControlJQs.GridView_DivHead_ScrollJQ.css("background-position", "0px bottom");

                            ControlData.ControlJQs.GridView_TrHead_ArrowJQ.css("background-position", "0px bottom");
                            ControlData.ControlJQs.GridView_TrHead_LockJQ.css("background-position", "0px bottom");
                            ControlData.ControlJQs.GridView_TrHead_ScrollJQ.css("background-position", "0px bottom");
                        } else {
                            ControlData.ControlJQs.GridView_DivHead_ArrowJQ.css("background-position", "0px top");
                            ControlData.ControlJQs.GridView_DivHead_LockJQ.css("background-position", "0px top");
                            ControlData.ControlJQs.GridView_DivHead_ScrollJQ.css("background-position", "0px top");

                            ControlData.ControlJQs.GridView_TrHead_ArrowJQ.css("background-position", "0px top");
                            ControlData.ControlJQs.GridView_TrHead_LockJQ.css("background-position", "0px top");
                            ControlData.ControlJQs.GridView_TrHead_ScrollJQ.css("background-position", "0px top");
                        };

                        //表头实现列位置可以拖动
                        var DivHeadJQ = $(">th>div.jQueryExtension_UI_GridView_TrHead_ThHead_DivHead", ControlData.ControlJQs.GridView_TrHead_LockJQ.add(ControlData.ControlJQs.GridView_TrHead_ScrollJQ));
                        DivHeadJQ.each(function () {
                            var DragJQ = $(this);
                            var HandSelectorJQ = DragJQ;
                            var Settings_MouseDownMillisecond = 200;
                            var MouseDownMillisecond = 0;
                            var MouseDownTimeFunction = null;
                            var HandlerJS = null;
                            var documentJQ = $(document);
                            var MouseMoveTimeFunction = null;
                            var MouseUpTimeFunction = null;

                            if (Settings_MouseDownMillisecond <= MouseDownMillisecond) {
                                HandSelectorJQ.bind("mouseover", function (e) {
                                    if ($.isFunction(Settings.MoveCondition) && Settings.MoveCondition()) {
                                        if (HandSelectorJQ.data("CursorStyle") == undefined) {
                                            HandSelectorJQ.data("CursorStyle", HandSelectorJQ.css("cursor"));
                                        };
                                        HandSelectorJQ.css({ "cursor": "move" });
                                    } else {
                                        if (HandSelectorJQ.data("CursorStyle") != undefined) {
                                            HandSelectorJQ.css("cursor", HandSelectorJQ.data("CursorStyle"));
                                        };
                                    };
                                })
                            };
                            HandSelectorJQ.bind("mousedown", function (e) {
                                MouseMoveTimeFunction = function () {
                                    documentJQ.unbind("mousemove", MouseMoveTimeFunction);
                                    documentJQ.unbind("mouseup", MouseUpTimeFunction);
                                    if (MouseDownTimeFunction != null) {
                                        clearInterval(MouseDownTimeFunction);
                                    };
                                    $("#MouseMoveTimeFunction").html($("#MouseMoveTimeFunction").html() + "1");
                                };
                                documentJQ.bind("mousemove", MouseMoveTimeFunction);
                                MouseUpTimeFunction = function () {
                                    documentJQ.unbind("mousemove", MouseMoveTimeFunction);
                                    documentJQ.unbind("mouseup", MouseUpTimeFunction);
                                    if (HandSelectorJQ.data("CursorStyle") != undefined) {
                                        HandSelectorJQ.css("cursor", HandSelectorJQ.data("CursorStyle"));
                                    };
                                    if (MouseDownTimeFunction != null) {
                                        clearInterval(MouseDownTimeFunction);
                                    };
                                    $("#MouseUpTimeFunction").html($("#MouseUpTimeFunction").html() + "1");
                                };
                                documentJQ.bind("mouseup", MouseUpTimeFunction);

                                MouseDownMillisecond = 0;
                                HandlerJS = this;
                                var DragFunction = function () {
                                    var IsMouseLeftDown = false;
                                    if ($.browser.msie) {
                                        IsMouseLeftDown = (e.button == "1");
                                    } else {
                                        IsMouseLeftDown = (e.button == "0");
                                    };

                                    if ($.DragAndDrop.IsCanDrag && IsMouseLeftDown) {
                                        $.DragAndDrop.IsCanDrag = false;

                                        var HandJQ = $(HandlerJS).css({
                                            "cursor": "move"
                                        });
                                        var DragJQ = HandJQ;
                                        var DragDivJQ = false;
                                        var DragCloneJQ = false;
                                        var DropToJQ = false;
                                        var MoveDirection = "Left";
                                        var LastDropToJQ = false;
                                        var DragHintTopJQ = $("#GridView_DragHintTop");
                                        var DragHintBottomJQ = $("#GridView_DragHintBottom");

                                        //获取鼠标相对拖动元素左上角位置
                                        var DragPosition = jQueryExtension.Position(DragJQ);
                                        var DragBox = jQueryExtension.Box(DragJQ);
                                        var MouseRelativeTop = e.pageY - DragPosition.AbsoluteTop;
                                        var MouseRelativeLeft = e.pageX - DragPosition.AbsoluteLeft;

                                        //--------------------创建一个模拟拖动的层,并克隆一份拖动对象放在内部（开始）--------------------//
                                        var DragDivJQ = $("<div class=\"jQueryExtension_UI_GridView_ColumnDrag\">" + DragJQ.data("Entity").ColumnText + "</div>").css({
                                            "position": "absolute"
                                    , "zIndex": DragPosition.zIndex + 1
                                    , "left": DragPosition.AbsoluteLeft + "px"
                                    , "top": DragPosition.AbsoluteTop + "px"
                                        }).appendTo("body");
                                        var DragDivBox = jQueryExtension.Box(DragDivJQ);
                                        DragDivJQ.width(DragBox.Width() - DragDivBox.BorderLeft - DragDivBox.PaddingLeft - DragDivBox.PaddingRight - DragDivBox.BorderRight);
                                        DragDivJQ.height(parseInt(DragJQ.css("line-height")) - DragDivBox.BorderTop - DragDivBox.PaddingTop - DragDivBox.PaddingBottom - DragDivBox.BorderBottom);
                                        //                        DragCloneJQ = DragJQ.clone();
                                        //                        DragCloneJQ.appendTo(DragDivJQ);
                                        //--------------------创建一个模拟拖动的层,并克隆一份拖动对象放在内部（结束）--------------------//


                                        //设置鼠标的移动是基于document对象的移动
                                        var Object = $(document);
                                        //开启Capture监控
                                        if ($.browser.msie) {
                                            HandlerJS.setCapture();
                                        } else {
                                            window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                                        };

                                        var ErrorLeft = 5;
                                        var DragDivPosition = jQueryExtension.Position(DragDivJQ);
                                        var DragDivBox = jQueryExtension.Box(DragDivJQ);
                                        var DragDivWidth = DragDivBox.Width(jQueryExtension.Data.BoxInternalStructure.Border);
                                        var DragDivHeight = DragDivBox.Height(jQueryExtension.Data.BoxInternalStructure.Border);
                                        var MinTop, MinLeft, MaxTop, MaxLeft;
                                        var InSelectorTop = 0;
                                        var InSelectorLeft = 0;
                                        var InSelectorWidth = 0;
                                        var InSelectorHeight = 0;
                                        var InSelectorJQ = ControlData.ControlJQs.GridViewJQ;
                                        if (InSelectorJQ[0].nodeType == 9) {
                                            InSelectorWidth = InSelectorJQ.width();
                                            InSelectorHeight = InSelectorJQ.height();
                                        } else {
                                            var InSelectorPosition = jQueryExtension.Position(InSelectorJQ);
                                            var InSelectorBox = jQueryExtension.Box(InSelectorJQ);
                                            InSelectorTop = InSelectorPosition.AbsoluteTop;
                                            InSelectorLeft = InSelectorPosition.AbsoluteLeft;
                                            InSelectorWidth = InSelectorBox.Width(jQueryExtension.Data.BoxInternalStructure.Border);
                                            InSelectorHeight = InSelectorBox.Height(jQueryExtension.Data.BoxInternalStructure.Border);
                                        };
                                        MinTop = InSelectorTop;
                                        MinLeft = InSelectorLeft;
                                        MaxTop = InSelectorTop + InSelectorHeight - DragDivWidth;
                                        MaxLeft = InSelectorLeft + InSelectorWidth - DragDivHeight;
                                        var LastTop = DragDivPosition.AbsoluteTop;
                                        var LastLeft = DragDivPosition.AbsoluteLeft;

                                        //鼠标移动执行事件
                                        var mousemove = function (e) {
                                            //计算模拟拖动结果的层的Top值
                                            var DragDivTop = e.pageY - MouseRelativeTop;
                                            //计算模拟拖动结果的层的Left值
                                            var DragDivLeft = e.pageX - MouseRelativeLeft;
                                            //当限制拖动范围时,判断是否在限制元素内
                                            if ((MinTop > DragDivTop || DragDivTop > MaxTop || MinLeft > DragDivLeft || DragDivLeft > MaxLeft)) {
                                                //当不允许标签移除窗体的时候计算Top和Left值
                                                if (DragDivTop < MinTop && DragDivTop - LastTop < 0) {
                                                    DragDivTop = LastTop > MinTop ? MinTop : LastTop;
                                                };
                                                if (DragDivTop > MaxTop && DragDivTop - LastTop > 0) {
                                                    DragDivTop = LastTop < MaxTop ? MaxTop : LastTop;
                                                };
                                                if (DragDivLeft < MinLeft && DragDivLeft - LastLeft < 0) {
                                                    DragDivLeft = LastLeft > MinLeft ? MinLeft : LastLeft;
                                                };
                                                if (DragDivLeft > MaxLeft && DragDivLeft - LastLeft > 0) {
                                                    DragDivLeft = LastLeft < MaxLeft ? MaxLeft : LastLeft;
                                                };
                                            };
                                            MoveDirection = DragDivLeft - LastLeft >= 0 ? "Right" : "Left";
                                            LastTop = DragDivTop;
                                            LastLeft = DragDivLeft;

                                            DragDivJQ.css({
                                                "left": LastLeft + "px"
                                        , "top": LastTop + "px"
                                            });
                                            //--------------------鼠标移动过程中创建的模拟拖动层跟随移动（开始）--------------------//

                                            //--------------------判断是否在允许插入的元素上（开始）--------------------//
                                            DropToJQ = false;
                                            for (var i = 0; i < DivHeadJQ.length; i++) {
                                                var DivJQ = $(DivHeadJQ[i]);
                                                var ObjectPosition = jQueryExtension.Position(DivJQ);
                                                var ObjectBox = jQueryExtension.Box(DivJQ);
                                                if (ObjectPosition.AbsoluteLeft < e.pageX && e.pageX < (ObjectPosition.AbsoluteLeft + ObjectBox.Width())
                                            && ObjectPosition.AbsoluteTop < e.pageY && e.pageY < ObjectPosition.AbsoluteTop + ObjectBox.Height()) {
                                                    DropToJQ = DivJQ;
                                                    LastDropToJQ = DivJQ;
                                                    break;
                                                };
                                            };


                                            if (DragHintTopJQ.length < 1) {
                                                DragHintTopJQ = $("<div id=\"GridView_DragHintTop\" class=\"GridView_DragHintTop\" style=\"position: absolute; display: none;\"></div>").appendTo("body");
                                            };
                                            DragHintTopJQ.hide();
                                            if (DragHintBottomJQ.length < 1) {
                                                DragHintBottomJQ = $("<div id=\"GridView_DragHintBottom\" class=\"GridView_DragHintBottom\" style=\"position: absolute; display: none;\"></div>").appendTo("body");
                                            };
                                            DragHintBottomJQ.hide();
                                            if (DropToJQ) {
                                                var DropToEntity = DropToJQ.data("Entity");
                                                DragDivJQ.removeClass("jQueryExtension_UI_GridView_ColumnDrag_Lock jQueryExtension_UI_GridView_ColumnDrag_Unlock").addClass(DropToEntity.IsLock ? "jQueryExtension_UI_GridView_ColumnDrag_Lock" : "jQueryExtension_UI_GridView_ColumnDrag_Unlock");

                                                //鼠标在目标上
                                                if (!(DragJQ.parent().prev().find(">div.jQueryExtension_UI_GridView_TrHead_ThHead_DivHead").is(DropToJQ) && MoveDirection == "Right") && !DropToJQ.is(DragJQ) && !(DragJQ.parent().next().find(">div.jQueryExtension_UI_GridView_TrHead_ThHead_DivHead").is(DropToJQ) && MoveDirection == "Left")) {
                                                    var DropToPosition = jQueryExtension.Position(DropToJQ.parent());
                                                    var DropToBox = jQueryExtension.Box(DropToJQ.parent());
                                                    var DragHintTopBox = jQueryExtension.Box(DragHintTopJQ);
                                                    var DragHintTop_Left;
                                                    var DragHintTop_Top;
                                                    if (MoveDirection == "Left") {
                                                        DragHintTop_Left = DropToPosition.AbsoluteLeft - DragHintTopBox.Width() / 2;
                                                        DragHintTop_Top = DropToPosition.AbsoluteTop - DragHintTopBox.Height();
                                                    } else {
                                                        DragHintTop_Left = DropToPosition.AbsoluteLeft + DropToBox.Width() - ErrorLeft;
                                                        DragHintTop_Top = DropToPosition.AbsoluteTop - DragHintTopBox.Height();
                                                    };
                                                    DragHintTopJQ.css({
                                                        "left": DragHintTop_Left + "px"
                                                , "top": DragHintTop_Top + "px"
                                                    });

                                                    var DragHintBottomBox = jQueryExtension.Box(DragHintBottomJQ);
                                                    var DragHintBottom_Left;
                                                    var DragHintBottom_Top;
                                                    if (MoveDirection == "Left") {
                                                        DragHintBottom_Left = DropToPosition.AbsoluteLeft - DragHintBottomBox.Width() / 2;
                                                        DragHintBottom_Top = DropToPosition.AbsoluteTop + DropToBox.Height();
                                                    } else {
                                                        DragHintBottom_Left = DropToPosition.AbsoluteLeft + DropToBox.Width() - ErrorLeft;
                                                        DragHintBottom_Top = DropToPosition.AbsoluteTop + DropToBox.Height();
                                                    };
                                                    DragHintBottomJQ.css({
                                                        "left": DragHintBottom_Left + "px"
                                                , "top": DragHintBottom_Top + "px"
                                                    });

                                                    DragHintTopJQ.show();
                                                    DragHintBottomJQ.show();
                                                } else {
                                                    DropToJQ = false;
                                                };
                                            } else {
                                                //鼠标在目标外
                                                DragHintTopJQ.hide();
                                                DragHintBottomJQ.hide();
                                                LastDropToJQ = false;
                                            };
                                            //--------------------判断是否在允许插入的元素上（结束）--------------------//


                                        };

                                        //鼠标松开执行事件
                                        var mouseup = function (e) {
                                            Object.unbind("mousemove", mousemove);
                                            Object.unbind("mouseup", mouseup);
                                            if ($.browser.msie) {
                                                HandlerJS.releaseCapture();
                                            } else {
                                                window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                                            };

                                            $.DragAndDrop.IsCanDrag = true;
                                            DragDivJQ.remove();
                                            DragHintTopJQ.hide();
                                            DragHintBottomJQ.hide();
                                            DragJQ.css({
                                                "cursor": "default"
                                            });

                                            if (DropToJQ) {
                                                $.GridView.ColumnMove({
                                                    Selector: ControlData.ControlJQs.GridViewJQ
                                             , DragJQ: DragJQ
                                             , DropToJQ: DropToJQ
                                             , MoveDirection: MoveDirection
                                                });
                                            };

                                            DragJQ.mouseout();
                                        };

                                        //绑定鼠标移动和松开事件
                                        Object.bind('mousemove', mousemove).bind('mouseup', mouseup);
                                    };
                                };

                                if (Settings_MouseDownMillisecond <= MouseDownMillisecond) {
                                    DragFunction();
                                } else {
                                    MouseDownTimeFunction = setInterval(function () {
                                        MouseDownMillisecond += 100;
                                        if (Settings_MouseDownMillisecond <= MouseDownMillisecond) {
                                            clearInterval(MouseDownTimeFunction);

                                            DragFunction();
                                        };
                                        $("#MouseDownTimeFunction").html(MouseDownMillisecond);
                                    }, 100);
                                };

                            });

                        });

                        //表头实现拖动改变列宽度
                        $(">th>div.jQueryExtension_UI_GridView_TrHead_ThHead_DivColumnResize", ControlData.ControlJQs.GridView_TrHead_LockJQ.add(ControlData.ControlJQs.GridView_TrHead_ScrollJQ)).bind("mousedown", function (e) {
                            var IsMouseLeftDown = false;
                            if ($.browser.msie) {
                                IsMouseLeftDown = (e.button == "1");
                            } else {
                                IsMouseLeftDown = (e.button == "0");
                            };
                            if ($.DragAndDrop.IsCanDrag && IsMouseLeftDown) {
                                $.DragAndDrop.IsCanDrag = false;

                                var HandJQ = $(this);
                                var DragJQ = HandJQ.prev().prev();
                                var DropToJQ = false;

                                //获取鼠标相对拖动元素左上角位置
                                var HandPosition = jQueryExtension.Position(HandJQ);
                                var DragPosition = jQueryExtension.Position(DragJQ);
                                var DragBox = jQueryExtension.Box(DragJQ);
                                var MouseRelativeLeft = e.pageX - HandPosition.AbsoluteLeft - HandJQ.width();

                                var ErrorLeft = 10;
                                if ($.browser.msie && $.browser.version == "6.0") { ErrorLeft = 20 };
                                var Height = ControlData.ControlJQs.GridView_DivHeadAndBodyJQ.height()
                                ControlData.ControlJQs.GridView_DivColumnResize_LeftJQ.css({
                                    "left": (DragPosition.AbsoluteLeft - ErrorLeft) + "px"
                                    , "top": "0px"
                                    , "height": Height + "px"
                                }).show();
                                ControlData.ControlJQs.GridView_DivColumnResizeRangeJQ.css({
                                    "left": (DragPosition.AbsoluteLeft - ErrorLeft + 22) + "px"
                                    , "top": "0px"
                                    , "width": (ControlData.ControlJQs.GridView_DivHeadAndBodyJQ.width() - DragPosition.AbsoluteLeft - 22 - 17) + "px"
                                    , "height": Height + "px"
                                }).show();


                                //设置鼠标的移动是基于document对象的移动
                                var Object = $(document);
                                //开启Capture监控
                                if ($.browser.msie) {
                                    this.setCapture();
                                } else {
                                    window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                                };

                                var MinTop, MinLeft, MaxTop, MaxLeft;
                                var InSelectorTop = 0;
                                var InSelectorLeft = 0;
                                var InSelectorWidth = 0;
                                var InSelectorHeight = 0;
                                var InSelectorJQ = ControlData.ControlJQs.GridView_DivColumnResizeRangeJQ;
                                if (InSelectorJQ[0].nodeType == 9) {
                                    InSelectorWidth = InSelectorJQ.width();
                                    InSelectorHeight = InSelectorJQ.height();
                                } else {
                                    var InSelectorPosition = jQueryExtension.Position(InSelectorJQ);
                                    var InSelectorBox = jQueryExtension.Box(InSelectorJQ);
                                    InSelectorTop = InSelectorPosition.AbsoluteTop;
                                    InSelectorLeft = InSelectorPosition.AbsoluteLeft;
                                    InSelectorWidth = InSelectorBox.Width(jQueryExtension.Data.BoxInternalStructure.Border);
                                    InSelectorHeight = InSelectorBox.Height(jQueryExtension.Data.BoxInternalStructure.Border);
                                };
                                MinTop = InSelectorTop;
                                MinLeft = InSelectorLeft;
                                MaxTop = InSelectorTop + InSelectorHeight;
                                MaxLeft = InSelectorLeft + InSelectorWidth;
                                var LastTop = DragPosition.AbsoluteTop;
                                var LastLeft = DragPosition.AbsoluteLeft + DragBox.Width();

                                if ($.browser.msie && $.browser.version == "6.0") {
                                    ControlData.ControlJQs.GridView_DivColumnResize_RightJQ.css({
                                        "left": (LastLeft - ErrorLeft) + "px"
                                        , "top": "0px"
                                        , "height": Height + "px"
                                    }).show();
                                } else {
                                    ControlData.ControlJQs.GridView_DivColumnResize_RightJQ.css({
                                        "left": (LastLeft - ErrorLeft) + "px"
                                        , "top": "0px"
                                        , "height": Height + "px"
                                    }).show();
                                };

                                //鼠标移动执行事件
                                var mousemove = function (e) {
                                    DropToJQ = false;
                                    //计算模拟拖动结果的层的Top值
                                    var DragDivTop = e.pageY;
                                    //计算模拟拖动结果的层的Left值
                                    var DragDivLeft = e.pageX;
                                    //当限制拖动范围时,判断是否在限制元素内
                                    if ((MinTop > DragDivTop || DragDivTop > MaxTop || MinLeft > DragDivLeft || DragDivLeft > MaxLeft)) {
                                        //当不允许标签移除窗体的时候计算Top和Left值
                                        if (DragDivTop < MinTop && DragDivTop - LastTop < 0) {
                                            DragDivTop = LastTop > MinTop ? MinTop : LastTop;
                                        };
                                        if (DragDivTop > MaxTop && DragDivTop - LastTop > 0) {
                                            DragDivTop = LastTop < MaxTop ? MaxTop : LastTop;
                                        };
                                        if (DragDivLeft < MinLeft && DragDivLeft - LastLeft < 0) {
                                            DragDivLeft = LastLeft > MinLeft ? MinLeft : LastLeft;
                                        };
                                        if (DragDivLeft > MaxLeft && DragDivLeft - LastLeft > 0) {
                                            DragDivLeft = LastLeft < MaxLeft ? MaxLeft : LastLeft;
                                        };
                                        DropToJQ = false;
                                    } else {
                                        DropToJQ = true;
                                    };
                                    MoveDirection = DragDivLeft - LastLeft >= 0 ? "Right" : "Left";
                                    LastTop = DragDivTop;
                                    LastLeft = DragDivLeft;

                                    if (DropToJQ) {
                                        ControlData.ControlJQs.GridView_DivColumnResize_RightJQ.css({
                                            "left": (LastLeft - MouseRelativeLeft - ErrorLeft) + "px"
                                        }).show();
                                    } else {
                                        ControlData.ControlJQs.GridView_DivColumnResize_RightJQ.hide();
                                    };
                                };

                                //鼠标松开执行事件
                                var mouseup = function (e) {
                                    Object.unbind("mousemove", mousemove);
                                    Object.unbind("mouseup", mouseup);
                                    if ($.browser.msie) {
                                        this.releaseCapture();
                                    } else {
                                        window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                                    };

                                    if (DropToJQ) {
                                        var GridView_DivColumnResize_LeftPosition = jQueryExtension.Position(ControlData.ControlJQs.GridView_DivColumnResize_LeftJQ);
                                        var GridView_DivColumnResize_RightPosition = jQueryExtension.Position(ControlData.ControlJQs.GridView_DivColumnResize_RightJQ);
                                        var Width = GridView_DivColumnResize_RightPosition.AbsoluteLeft - GridView_DivColumnResize_LeftPosition.AbsoluteLeft - 1;
                                        var DragEntity = DragJQ.data("Entity");
                                        if (DragEntity.Width != Width) {
                                            DragJQ.width(Width);
                                            DragEntity.Width = Width;

                                            var Index;
                                            var BodyJQ
                                            if (DragEntity.IsLock) {
                                                Index = $(">th>div.jQueryExtension_UI_GridView_TrHead_ThHead_DivHead", ControlData.ControlJQs.GridView_TrHead_LockJQ).index(DragJQ);
                                                BodyJQ = ControlData.ControlJQs.GridView_TbodyBody_TrRow_LockJQ;
                                            } else {
                                                Index = $(">th>div.jQueryExtension_UI_GridView_TrHead_ThHead_DivHead", ControlData.ControlJQs.GridView_TrHead_ScrollJQ).index(DragJQ);
                                                BodyJQ = ControlData.ControlJQs.GridView_TbodyBody_TrRow_ScrollJQ;
                                            };

                                            $(">td:nth-child(" + (Index + 1) + ")>div", BodyJQ).width(Width);

                                            $.GridView.UpdateLayout({ Selector: ControlData.ControlJQs.GridViewJQ });
                                        };
                                    };

                                    $.DragAndDrop.IsCanDrag = true;
                                    ControlData.ControlJQs.GridView_DivColumnResize_LeftJQ.hide();
                                    ControlData.ControlJQs.GridView_DivColumnResize_RightJQ.hide();
                                    ControlData.ControlJQs.GridView_DivColumnResizeRangeJQ.hide();

                                    DragJQ.mouseout();
                                };

                                //绑定鼠标移动和松开事件
                                Object.bind('mousemove', mousemove).bind('mouseup', mouseup);
                            };
                        });

                        //如果指定了空间高度，则触发控件Resize事件，重置控件 表头 数据表 表尾 布局
                        if (fw.fwObject.FWObjectHelper.hasValue(Settings.Height)) {
                            $.GridView.ResizeWidthHeight({
                                Selector: ControlData.ControlJQs.GridViewJQ
                            , IsShowHead: Settings.IsShowHead
                            , IsShowFoot: Settings.IsShowFoot
                            , Height: Settings.Height
                            });
                        };

                        //重置表左中右布局
                        $.GridView.UpdateLayout({ Selector: ControlData.ControlJQs.GridViewJQ });

                        ControlData.ControlJQs.GridView_TbodyBody_ArrowJQ.empty();
                        ControlData.ControlJQs.GridView_TbodyBody_LockJQ.empty();
                        ControlData.ControlJQs.GridView_TbodyBody_ScrollJQ.empty();
                        //根据分页大小填满空数据行
                        if (ControlData.Settings.IsFillBodyRow) {
                            var TrRow_ArrowJQ = $("<tr class=\"jQueryExtension_UI_GridView_TbodyBody_TrRow jQueryExtension_UI_GridView_TbodyBody_TrFillRow\"><td class=\"jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow\"><div class=\"jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRowArrowhead\">&nbsp;</div></td></tr>").data("Entity", null);
                            var TrRow_LockJQ = $("<tr class=\"jQueryExtension_UI_GridView_TbodyBody_TrRow jQueryExtension_UI_GridView_TbodyBody_TrFillRow\"></tr>");
                            var TrRow_ScrollJQ = $("<tr class=\"jQueryExtension_UI_GridView_TbodyBody_TrRow jQueryExtension_UI_GridView_TbodyBody_TrFillRow\"></tr>");
                            for (var i = 0; i < ControlData.SortColumnList.length; i++) {
                                var TdRowJQ = $("<td class=\"jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow\"></td>").appendTo(ControlData.SortColumnList[i].IsLock ? TrRow_LockJQ : TrRow_ScrollJQ);
                                if (!ControlData.SortColumnList[i].IsShow) {
                                    TdRowJQ.hide();
                                };
                                $("<div class=\"jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRow\"><a>&nbsp;</a></div>").appendTo(TdRowJQ).css({
                                    "width": ControlData.SortColumnList[i].Width
                                    , "text-align": ControlData.SortColumnList[i].BodyAlignment
                                });
                            };

                            for (var i = 0; i < ControlData.PageSize; i++) {
                                TrRow_ArrowJQ.clone().appendTo(ControlData.ControlJQs.GridView_TbodyBody_ArrowJQ);
                                TrRow_LockJQ.clone().appendTo(ControlData.ControlJQs.GridView_TbodyBody_LockJQ);
                                TrRow_ScrollJQ.clone().appendTo(ControlData.ControlJQs.GridView_TbodyBody_ScrollJQ);
                            };
                        };
                    };

                    //IE Buy表头不显示
                    if ($.browser.msie) {
                        ControlData.ControlJQs.GridView_DivHead_ScrollJQ.appendTo(ControlData.ControlJQs.GridView_DivHeadAndBodyContainer_ScrollJQ);
                        ControlData.ControlJQs.GridView_DivBody_ScrollJQ.appendTo(ControlData.ControlJQs.GridView_DivHeadAndBodyContainer_ScrollJQ);
                    };

                    //打开加载锁定屏
                    ControlData.ControlJQs.GridView_trFoot_tdFootCenter_DivFootLoadingJQ.show();
                    if ($.browser.msie && $.browser.version == "6.0") {
                        $("select", ControlData.ControlJQs.GridViewJQ).hide();
                        ControlData.ControlJQs.GridView_DivBodyLoadingJQ.css("background-color", "transparent").height(ControlData.ControlJQs.GridViewJQ.height()).show();
                    } else {
                        ControlData.ControlJQs.GridView_DivBodyLoadingJQ.css("background-color", "Black").css("opacity", 0.2).show();
                    };
                });
            }
            , GridView_Loading: function () {
                this.each(function () {
                    var ControlData = $(this).data("ControlData");
                    ControlData.ControlJQs.GridView_DivBodyLoadingJQ.show();
                });
            }
            , GridView: function (Properties) {
                $("#jQueryExtension_UI_GridView_DivTableColumnSet").hide();

                if (!fw.fwObject.FWObjectHelper.hasValue(Properties)) { Properties = {}; };
                var Settings = $.GridView.Settings();
                $.extend(Settings, Properties);

                this.each(function () {
                    var GridViewJQ = $(this);
                    //初始化控件
                    GridViewJQ.GridView_Init(Settings);

                    var ControlData = GridViewJQ.data("ControlData");
                    if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                        //如果集成图表控件 整理图表控件X轴
                        if (fw.fwObject.FWObjectHelper.hasValue(ControlData.Settings.Chart__X_DataFieldList)) {
                            var Chart__X_DataFieldList = [];
                            var IsHasX = false;
                            for (var i = 0; i < ControlData.Settings.Chart__X_DataFieldList.length; i++) {
                                for (var j = 0; j < ControlData.Settings.ColumnList.length; j++) {
                                    if (ControlData.Settings.ColumnList[j].DataField == ControlData.Settings.Chart__X_DataFieldList[i].DataField) {
                                        ControlData.Settings.Chart__X_DataFieldList[i].IsUsedToChart = ControlData.Settings.Chart__X_DataFieldList[i].IsUsedToChart == undefined ? false : ControlData.Settings.Chart__X_DataFieldList[i].IsUsedToChart;
                                        Chart__X_DataFieldList.push(ControlData.Settings.Chart__X_DataFieldList[i]);
                                        if (!IsHasX && ControlData.Settings.Chart__X_DataFieldList[i].IsUsedToChart) {
                                            IsHasX = true;
                                        };
                                        break;
                                    };
                                };
                            };
                            if (!IsHasX && Chart__X_DataFieldList.length > 0) {
                                Chart__X_DataFieldList[0].IsUsedToChart = true;
                            };
                            ControlData.Settings.Chart__X_DataFieldList = Chart__X_DataFieldList;
                        };
                        //如果集成图表控件 整理图表控件Y轴
                        if (fw.fwObject.FWObjectHelper.hasValue(ControlData.Settings.Chart__Y_DataFieldList)) {
                            var Chart__Y_DataFieldList = [];
                            for (var i = 0; i < ControlData.Settings.Chart__Y_DataFieldList.length; i++) {
                                for (var j = 0; j < ControlData.Settings.ColumnList.length; j++) {
                                    if (ControlData.Settings.ColumnList[j].DataField == ControlData.Settings.Chart__Y_DataFieldList[i].DataField) {
                                        ControlData.Settings.Chart__Y_DataFieldList[i].IsUsedToChart = ControlData.Settings.Chart__Y_DataFieldList[i].IsUsedToChart == undefined ? true : false;
                                        Chart__Y_DataFieldList.push(ControlData.Settings.Chart__Y_DataFieldList[i]);
                                        break;
                                    };
                                };
                            };
                            ControlData.Settings.Chart__Y_DataFieldList = Chart__Y_DataFieldList;
                        };

                        var GridViewHeight = ControlData.ControlJQs.GridViewJQ.height();

                        //是否显示表头
                        if (!ControlData.Settings.IsShowHead) {
                            ControlData.ControlJQs.GridView_DivHead_ArrowJQ.hide();
                            ControlData.ControlJQs.GridView_DivHead_LockJQ.hide();
                            ControlData.ControlJQs.GridView_DivHead_ScrollJQ.hide();
                        } else {
                            ControlData.ControlJQs.GridView_DivHead_ArrowJQ.show();
                            ControlData.ControlJQs.GridView_DivHead_LockJQ.show();
                            ControlData.ControlJQs.GridView_DivHead_ScrollJQ.show();
                        };

                        //是否显示分页
                        if (!ControlData.Settings.IsShowFoot || ControlData.Settings.RecordCount == -1) {
                            ControlData.ControlJQs.GridView_DivFootJQ.hide();
                        } else {
                            ControlData.ControlJQs.GridView_DivFootJQ.show();
                        };

                        //辅助开发者取消全选框选中
                        $(":checkbox", ControlData.ControlJQs.GridView_TheadHead_LockJQ).removeAttr("checked");
                        $(":checkbox", ControlData.ControlJQs.GridView_TheadHead_ScrollJQ).removeAttr("checked");

                        ControlData.ControlJQs.GridView_TbodyBody_ArrowJQ.empty();
                        ControlData.ControlJQs.GridView_TbodyBody_LockJQ.empty();
                        ControlData.ControlJQs.GridView_TbodyBody_ScrollJQ.empty();

                        if (ControlData.Settings.PageNow == 0) {
                            ControlData.Settings.PageNow = ControlData.PageNow;
                        } else {
                            ControlData.PageNow = ControlData.Settings.PageNow;
                        };

                        if (!fw.fwObject.FWObjectHelper.hasValue(ControlData.Settings.DataSource)) {
                            ControlData.Settings.DataSource = [];
                        };

                        //根据分页信息，计算数据表填入的数据
                        var TrRowFrom = 0;
                        var TrRowTo = 0;
                        var TrRowFillTo = 0;
                        if (ControlData.Settings.RecordCount == -1) {
                            ControlData.Settings.RecordCount = ControlData.Settings.DataSource.length;
                            if (ControlData.Settings.PageSize == -1) { ControlData.Settings.PageSize = ControlData.Settings.RecordCount; };
                            TrRowFrom = ControlData.Settings.PageSize * (ControlData.Settings.PageNow - 1);
                            TrRowTo = (ControlData.Settings.PageSize * ControlData.Settings.PageNow) > (ControlData.Settings.RecordCount - 1) ? ControlData.Settings.RecordCount : (ControlData.Settings.PageSize * ControlData.Settings.PageNow);
                            TrRowFillTo = ControlData.Settings.PageSize * ControlData.Settings.PageNow - TrRowTo;
                        } else {
                            TrRowTo = ControlData.Settings.DataSource.length;
                            TrRowFillTo = ControlData.Settings.PageSize - TrRowTo;
                        };

                        var TrRowLastJQ;
                        for (var i = TrRowFrom; i < TrRowTo; i++) {
                            var Entity = ControlData.Settings.DataSource[i];
                            var ObjectList = ControlData.Settings.BodyRowFunction(Entity, ControlData.Settings, i);

                            var TrRow_ArrowJQ = $("<tr class=\"jQueryExtension_UI_GridView_TbodyBody_TrRow\"><td class=\"jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow\"><div class=\"jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRowArrowhead\">&nbsp;</div></td></tr>").data("Entity", Entity).appendTo(ControlData.ControlJQs.GridView_TbodyBody_ArrowJQ);

                            var TrRow_LockJQ = $("<tr class=\"jQueryExtension_UI_GridView_TbodyBody_TrRow\"></tr>").appendTo(ControlData.ControlJQs.GridView_TbodyBody_LockJQ);
                            var TrRow_ScrollJQ = $("<tr class=\"jQueryExtension_UI_GridView_TbodyBody_TrRow\"></tr>").appendTo(ControlData.ControlJQs.GridView_TbodyBody_ScrollJQ);
                            for (var j = 0; j < ControlData.SortColumnList.length; j++) {
                                var TdRowJQ = $("<td class=\"jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow\"></td>");
                                TdRowJQ.appendTo(ControlData.SortColumnList[j].IsLock ? TrRow_LockJQ : TrRow_ScrollJQ);
                                if (!ControlData.SortColumnList[j].IsShow) {
                                    TdRowJQ.hide();
                                };
                                var TdRow_DivRowJQ = $("<div class=\"jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRow\"></div>").css({
                                    "width": ControlData.SortColumnList[j].Width
                                    , "text-align": ControlData.SortColumnList[j].BodyAlignment
                                }).appendTo(TdRowJQ);
                                var InnerJQ = ObjectList[ControlData.SortColumnList[j].Index];
                                if (!fw.fwObject.FWObjectHelper.hasValue(InnerJQ)) {
                                    $("<a>&nbsp;</a>").appendTo(TdRow_DivRowJQ);
                                } else {
                                    if (InnerJQ instanceof jQuery) {
                                        $(InnerJQ).appendTo(TdRow_DivRowJQ);
                                    } else if (typeof (InnerJQ) == "string") {
                                        $("<a>" + InnerJQ + "</a>").appendTo(TdRow_DivRowJQ);
                                    } else if (typeof (InnerJQ) == "number") {
                                        $("<a>" + InnerJQ + "</a>").appendTo(TdRow_DivRowJQ);
                                    } else if (typeof (InnerJQ) == "object") {
                                        $("<a>&nbsp;</a>").appendTo(TdRow_DivRowJQ);
                                    } else {
                                        $("<a>&nbsp;</a>").appendTo(TdRow_DivRowJQ);
                                    };
                                };
                            };
                        };

                        //是否进行空数据填充
                        if (ControlData.Settings.IsFillBodyRow) {
                            var TrRow_ArrowJQ = $("<tr class=\"jQueryExtension_UI_GridView_TbodyBody_TrRow jQueryExtension_UI_GridView_TbodyBody_TrFillRow\"><td class=\"jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow\"><div class=\"jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRowArrowhead\">&nbsp;</div></td></tr>").data("Entity", null);

                            var TrRow_LockJQ = $("<tr class=\"jQueryExtension_UI_GridView_TbodyBody_TrRow jQueryExtension_UI_GridView_TbodyBody_TrFillRow\"></tr>");
                            var TrRow_ScrollJQ = $("<tr class=\"jQueryExtension_UI_GridView_TbodyBody_TrRow jQueryExtension_UI_GridView_TbodyBody_TrFillRow\"></tr>");

                            for (var j = 0; j < ControlData.SortColumnList.length; j++) {
                                var TdRowJQ = $("<td class=\"jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow\"></td>").appendTo(ControlData.SortColumnList[j].IsLock ? TrRow_LockJQ : TrRow_ScrollJQ);
                                if (!ControlData.SortColumnList[j].IsShow) {
                                    TdRowJQ.hide();
                                };
                                $("<div class=\"jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRow\"><a>&nbsp;</a></div>").appendTo(TdRowJQ).css({
                                    "width": ControlData.SortColumnList[j].Width
                                        , "text-align": ControlData.SortColumnList[j].BodyAlignment
                                });
                            };

                            for (var i = 0; i < TrRowFillTo; i++) {
                                TrRow_ArrowJQ.clone().appendTo(ControlData.ControlJQs.GridView_TbodyBody_ArrowJQ);
                                TrRow_LockJQ.clone().appendTo(ControlData.ControlJQs.GridView_TbodyBody_LockJQ);
                                TrRow_ScrollJQ.clone().appendTo(ControlData.ControlJQs.GridView_TbodyBody_ScrollJQ);
                            };
                        };


                        //重新生成分页
                        $.GridView.FootFunction({ Selector: ControlData.ControlJQs.GridViewJQ });

                        //----------------整理GridView样式（开始）----------------



                        //表格隔行变色
                        ControlData.ControlJQs.GridView_TbodyBody_TrRow_ArrowJQ = $(">tr", ControlData.ControlJQs.GridView_TbodyBody_ArrowJQ).each(function (i) {
                            if (i % 2 == 0) {
                                $(this).addClass('jQueryExtension_UI_GridView_TbodyBody_TrRowOdd');
                            } else {
                                $(this).addClass('jQueryExtension_UI_GridView_TbodyBody_TrRowAlternating');
                            };
                        });
                        ControlData.ControlJQs.GridView_TbodyBody_TrRow_LockJQ = $(">tr", ControlData.ControlJQs.GridView_TbodyBody_LockJQ).each(function (i) {
                            if (i % 2 == 0) {
                                $(this).addClass('jQueryExtension_UI_GridView_TbodyBody_TrRowOdd');
                            } else {
                                $(this).addClass('jQueryExtension_UI_GridView_TbodyBody_TrRowAlternating');
                            };
                        });
                        ControlData.ControlJQs.GridView_TbodyBody_TrRow_ScrollJQ = $(">tr", ControlData.ControlJQs.GridView_TbodyBody_ScrollJQ).each(function (i) {
                            if (i % 2 == 0) {
                                $(this).addClass('jQueryExtension_UI_GridView_TbodyBody_TrRowOdd');
                            } else {
                                $(this).addClass('jQueryExtension_UI_GridView_TbodyBody_TrRowAlternating');
                            };
                        });

                        //整理数据行的高度
                        $.GridView.UpdateRowHeight({ Selector: ControlData.ControlJQs.GridViewJQ });
                        jQueryExtension.ScrollLeft(ControlData.ControlJQs.GridView_DivHead_ScrollJQ, ControlData.ScrollLeft);
                        jQueryExtension.ScrollTop(ControlData.ControlJQs.GridView_DivHead_LockJQ, ControlData.ScrollTop);
                        jQueryExtension.ScrollTop(ControlData.ControlJQs.GridView_DivHead_ScrollJQ, ControlData.ScrollTop);

                        var trDataRow_ArrowJQ = ControlData.ControlJQs.GridView_TbodyBody_TrRow_ArrowJQ.filter(":not(.jQueryExtension_UI_GridView_TbodyBody_TrFillRow)");
                        var trDataRow_LockJQ = ControlData.ControlJQs.GridView_TbodyBody_TrRow_LockJQ.filter(":not(.jQueryExtension_UI_GridView_TbodyBody_TrFillRow)");
                        var trDataRow_ScrollJQ = ControlData.ControlJQs.GridView_TbodyBody_TrRow_ScrollJQ.filter(":not(.jQueryExtension_UI_GridView_TbodyBody_TrFillRow)");

                        //鼠标进过样式变化
                        trDataRow_LockJQ.hover(
                            function () {
                                $(this).addClass('jQueryExtension_UI_GridView_TbodyBody_TrRowHover');
                                var OverIndex = ControlData.ControlJQs.GridView_TbodyBody_TrRow_LockJQ.index(this);
                                ControlData.ControlJQs.GridView_TbodyBody_TrRow_ScrollJQ.eq(OverIndex).addClass('jQueryExtension_UI_GridView_TbodyBody_TrRowHover');
                            }
                            , function () {
                                $(this).removeClass('jQueryExtension_UI_GridView_TbodyBody_TrRowHover');
                                var OverIndex = ControlData.ControlJQs.GridView_TbodyBody_TrRow_LockJQ.index(this);
                                ControlData.ControlJQs.GridView_TbodyBody_TrRow_ScrollJQ.eq(OverIndex).removeClass('jQueryExtension_UI_GridView_TbodyBody_TrRowHover');
                            }
                        );
                        trDataRow_ScrollJQ.hover(
                            function () {
                                $(this).addClass('jQueryExtension_UI_GridView_TbodyBody_TrRowHover');
                                var OverIndex = ControlData.ControlJQs.GridView_TbodyBody_TrRow_ScrollJQ.index(this);
                                ControlData.ControlJQs.GridView_TbodyBody_TrRow_LockJQ.eq(OverIndex).addClass('jQueryExtension_UI_GridView_TbodyBody_TrRowHover');
                            }
                            , function () {
                                $(this).removeClass('jQueryExtension_UI_GridView_TbodyBody_TrRowHover');
                                var OverIndex = ControlData.ControlJQs.GridView_TbodyBody_TrRow_ScrollJQ.index(this);
                                ControlData.ControlJQs.GridView_TbodyBody_TrRow_LockJQ.eq(OverIndex).removeClass('jQueryExtension_UI_GridView_TbodyBody_TrRowHover');
                            }
                        );

                        //是否开启箭头
                        if (ControlData.Settings.IsShowSelectedArrowhead) {
                            ControlData.ControlJQs.GridView_DivHeadAndBodyContainer_ArrowJQ.show();
                            var BorderDefaultColor = ControlData.ControlJQs.GridView_DivBody_LockJQ.data("BorderDefaultColor");
                            if (BorderDefaultColor != undefined) {
                                ControlData.ControlJQs.GridView_DivHead_LockJQ.css("border-left-color", BorderDefaultColor);
                                ControlData.ControlJQs.GridView_DivBody_LockJQ.css("border-left-color", BorderDefaultColor);
                            };
                        } else {
                            ControlData.ControlJQs.GridView_DivHeadAndBodyContainer_ArrowJQ.hide();
                            var BorderDefaultColor = ControlData.ControlJQs.GridView_DivBody_LockJQ.data("BorderDefaultColor");
                            if (BorderDefaultColor == undefined) {
                                ControlData.ControlJQs.GridView_DivBody_LockJQ.data("BorderDefaultColor", ControlData.ControlJQs.GridView_DivBody_LockJQ.css("border-left-color"));
                            };
                            var BorderColor = ControlData.ControlJQs.GridView_DivBody_ArrowJQ.css("border-left-color");
                            ControlData.ControlJQs.GridView_DivHead_LockJQ.css("border-left-color", BorderColor);
                            ControlData.ControlJQs.GridView_DivBody_LockJQ.css("border-left-color", BorderColor);
                        };


                        //----------------整理GridView样式（结束）----------------



                        //----------------选中行事件处理（开始）----------------
                        //如果允许选中行，绑定行事件
                        if (ControlData.Settings.AllowRowSelected && ControlData.ControlJQs.GridView_TbodyBody_TrRow_ArrowJQ.length > 0) {
                            trDataRow_ArrowJQ.bind("click", function (e) {
                                var trJQ = $(this);
                                $("tr.jQueryExtension_UI_GridView_TbodyBody_TrRowSelected", ControlData.ControlJQs.GridView_DivHeadAndBodyJQ).removeClass("jQueryExtension_UI_GridView_TbodyBody_TrRowSelected");
                                $("div.jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRowArrowheadSelected", ControlData.ControlJQs.GridView_DivHeadAndBodyJQ).removeClass("jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRowArrowheadSelected");
                                trJQ.addClass('jQueryExtension_UI_GridView_TbodyBody_TrRowSelected');
                                $("div.jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRowArrowhead:first", trJQ).addClass('jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRowArrowheadSelected');
                                var SelectedIndex = ControlData.ControlJQs.GridView_TbodyBody_TrRow_ArrowJQ.index(trJQ);
                                ControlData.SelectedIndex = SelectedIndex;

                                ControlData.ControlJQs.GridView_TbodyBody_TrRow_LockJQ.eq(SelectedIndex).addClass('jQueryExtension_UI_GridView_TbodyBody_TrRowSelected');
                                ControlData.ControlJQs.GridView_TbodyBody_TrRow_ScrollJQ.eq(SelectedIndex).addClass('jQueryExtension_UI_GridView_TbodyBody_TrRowSelected');

                                var trRowTop = trJQ.height() * SelectedIndex;
                                if (trRowTop < jQueryExtension.ScrollTop(ControlData.ControlJQs.GridView_DivBody_ScrollJQ) || trRowTop > (jQueryExtension.ScrollTop(ControlData.ControlJQs.GridView_DivBody_ScrollJQ) + ControlData.ControlJQs.GridView_DivBody_ScrollJQ.height())) {
                                    jQueryExtension.ScrollTop(ControlData.ControlJQs.GridView_DivBody_ScrollJQ, trRowTop);
                                };

                                if ($.isFunction(ControlData.Settings.OnSelectedIndexChanging)) {
                                    ControlData.Settings.OnSelectedIndexChanging(trJQ.data("Entity"), SelectedIndex);
                                };
                            });


                            trDataRow_LockJQ.bind("click", function (e) {
                                var SelectedIndex = ControlData.ControlJQs.GridView_TbodyBody_TrRow_LockJQ.index(this);
                                $.GridView.Select({ Selector: ControlData.ControlJQs.GridViewJQ, SelectedIndex: SelectedIndex });
                            });

                            trDataRow_ScrollJQ.bind("click", function (e) {
                                var SelectedIndex = ControlData.ControlJQs.GridView_TbodyBody_TrRow_ScrollJQ.index(this);
                                $.GridView.Select({ Selector: ControlData.ControlJQs.GridViewJQ, SelectedIndex: SelectedIndex });
                            });



                            //                    trRowJQ.filter(":not(.jQueryExtension_UI_GridView_TbodyBody_TrFillRow)").bind("click", function (e) {
                            //                        var trJQ = $(this);
                            //                        $("tr.jQueryExtension_UI_GridView_TbodyBody_TrRowSelected", ControlData.ControlJQs.GridView_TbodyBodyJQ).not($("tr.jQueryExtension_UI_GridView_TbodyBody_TrRowSelected", trJQ)).removeClass("jQueryExtension_UI_GridView_TbodyBody_TrRowSelected");
                            //                        $("div.jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRowArrowheadSelected", ControlData.ControlJQs.GridView_TbodyBodyJQ).not($("div.jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRowArrowheadSelected", trJQ)).removeClass("jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRowArrowheadSelected");
                            //                        trJQ.addClass('jQueryExtension_UI_GridView_TbodyBody_TrRowSelected');
                            //                        $("div.jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRowArrowhead:first", trJQ).addClass('jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRow_DivRowArrowheadSelected');
                            //                        var SelectedIndex = trRowJQ.index(trJQ);
                            //                        ControlData.ControlJQs.GridViewJQ.data("SelectedIndex", SelectedIndex);

                            //                        if ($.isFunction(Settings.OnSelectedIndexChanging)) {
                            //                            Settings.OnSelectedIndexChanging(trRowJQ.data("Entity"), SelectedIndex);
                            //                        };

                            //                        var trRowTop = trJQ.height() * SelectedIndex;
                            //                        if (trRowTop < jQueryExtension.ScrollTop(ControlData.ControlJQs.GridView_DivBodyJQ) || trRowTop > (jQueryExtension.ScrollTop(ControlData.ControlJQs.GridView_DivBodyJQ) + ControlData.ControlJQs.GridView_DivBodyJQ.height())) {
                            //                            jQueryExtension.ScrollTop(ControlData.ControlJQs.GridView_DivBodyJQ, trRowTop);
                            //                        };

                            //                        if (ControlData.ControlJQs.GridViewJQ.data("GridViewChart") != undefined && !$(e.target).is(trJQ)) {
                            //                            var ClickTdJQ = $(e.target);
                            //                            while (!ClickTdJQ.parent().is(trJQ)) {
                            //                                ClickTdJQ = ClickTdJQ.parent();
                            //                            };
                            //                            if (ClickTdJQ.length > 0) {
                            //                                var SelectedTdIndex = $(">td", trJQ).index(ClickTdJQ);
                            //                                var SerieIndex = -1;
                            //                                var DataField = ControlData.ControlJQs.GridViewJQ.data("ColumnList")[SelectedTdIndex - 1].DataField;
                            //                                for (var i = 0; i < Settings.Chart__Y_DataFieldList.length; i++) {
                            //                                    if (Settings.Chart__Y_DataFieldList[i].IsShow && Settings.Chart__Y_DataFieldList[i].DataField == DataField) {
                            //                                        SerieIndex = i;
                            //                                        break;
                            //                                    };
                            //                                };
                            //                                if (SerieIndex > -1) {
                            //                                    $("td.jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRowSelected", trRowJQ).removeClass("jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRowSelected");
                            //                                    ClickTdJQ.addClass("jQueryExtension_UI_GridView_TbodyBody_TrRow_TdRowSelected");
                            //                                    var Serie = ControlData.ControlJQs.GridViewJQ.data("GridViewChart").Series[SerieIndex];
                            //                                    for (var i = 0; i < Serie.DataPoints.length; i++) {
                            //                                        if (i == SelectedIndex) {
                            //                                            Serie.DataPoints[i].SetPropertyFromJs("MarkerEnabled", "true");
                            //                                            Serie.DataPoints[i].SetPropertyFromJs("MarkerScale", "3");
                            //                                            Serie.DataPoints[i].SetPropertyFromJs("Selected", "true");
                            //                                        } else {
                            //                                            Serie.DataPoints[i].SetPropertyFromJs("MarkerScale", Serie.MarkerScale);
                            //                                            Serie.DataPoints[i].SetPropertyFromJs("MarkerEnabled", Serie.MarkerEnabled);
                            //                                        };
                            //                                    };
                            //                                };
                            //                            };
                            //                        };
                            //                    });
                        };

                        //如果允许选中行，则默认选中的一行
                        if (ControlData.Settings.AllowRowSelected && ControlData.Settings.AllowSelectedFirstRow && ControlData.ControlJQs.GridView_TbodyBody_TrRow_ArrowJQ.length > 0) {
                            ControlData.SelectedIndex = ControlData.SelectedIndex < trDataRow_ArrowJQ.length ? ControlData.SelectedIndex : (trDataRow_ArrowJQ.length - 1);
                            ControlData.SelectedIndex = ControlData.SelectedIndex < 0 ? 0 : ControlData.SelectedIndex;
                            var trJQ = ControlData.ControlJQs.GridView_TbodyBody_TrRow_ArrowJQ.eq(ControlData.SelectedIndex);
                            trJQ.click();
                        };
                        //----------------选中行事件处理（结束）----------------

                        //如果指定了空间高度，则触发控件Resize事件，重置控件 表头 数据表 表尾 布局
                        //                if (ControlData.IsResize) {
                        //                    $.GridView.ResizeWidthHeight({
                        //                        Selector: ControlData.ControlJQs.GridViewJQ
                        //                        , Height: GridViewHeight
                        //                        , IsMustResize: true
                        //                    });
                        //                };

                        //----------------数据绑定完成后事件（开始）----------------
                        if ($.isFunction(ControlData.Settings.OnDataBound)) {
                            ControlData.Settings.OnDataBound(ControlData);


                            //                    if (ControlData.ControlJQs.GridViewJQ.data("Chart_Series_DataSeries_RenderAs") != undefined) {
                            //                        Settings.Chart_Series_DataSeries_RenderAs = ControlData.ControlJQs.GridViewJQ.data("Chart_Series_DataSeries_RenderAs");
                            //                    } else {
                            //                        if (Settings.Chart_Series_DataSeries_RenderAsList != undefined && Settings.Chart_Series_DataSeries_RenderAsList.length > 0) {
                            //                            ControlData.ControlJQs.GridViewJQ.data("Chart_Series_DataSeries_RenderAs", Settings.Chart_Series_DataSeries_RenderAsList[0]);
                            //                            Settings.Chart_Series_DataSeries_RenderAs = ControlData.ControlJQs.GridViewJQ.data("Chart_Series_DataSeries_RenderAs");
                            //                        };
                            //                    };
                            //                    if (ControlData.ControlJQs.GridViewJQ.data("Chart_View3D") != undefined) {
                            //                        Settings.Chart_View3D = ControlData.ControlJQs.GridViewJQ.data("Chart_View3D");
                            //                    } else {
                            //                        ControlData.ControlJQs.GridViewJQ.data("Chart_View3D", Settings.Chart_View3D);
                            //                    };
                            //                    if (Settings.Chart__TargetElement != undefined && Settings.Chart__XapPath != undefined && Settings.Chart__X_DataField != undefined && Settings.Chart__Y_DataFieldList != undefined && Settings.Chart__Y_AllDataFieldList != undefined && Settings.Chart_Series_DataSeries_RenderAsList != undefined) {
                            //                        var ControlJQs = $(Settings.Selector).data("ControlJQs");
                            //                        var ColumnList = ControlData.ControlJQs.GridViewJQ.data("ColumnList");
                            //                        var ChartSettings = {
                            //                            TargetElement: Settings.Chart__TargetElement
                            //                            , XapPath: Settings.Chart__XapPath
                            //                            , X_DataField: Settings.Chart__X_DataField
                            //                            , Y_DataFieldList: Settings.Chart__Y_DataFieldList
                            //                            , Y_AllDataFieldList: Settings.Chart__Y_AllDataFieldList
                            //                            , DataSource: Settings.DataSource
                            //                            , GridViewSelector: Settings.Selector
                            //                            , Chart_Series_DataSeries_RenderAs: Settings.Chart_Series_DataSeries_RenderAs
                            //                            , Chart_View3D: Settings.Chart_View3D
                            //                            , Chart_Titles_Text: Settings.Chart_Titles_Text
                            //                            , Chart_AxesX_Axis_Title: Settings.Chart_AxesX_Axis_Title
                            //                            , Chart_AxesY_Axis_Title: Settings.Chart_AxesY_Axis_Title
                            //                            , preLoad: Settings.Chart__preLoad
                            //                            , loaded: Settings.Chart__loaded
                            //                        };
                            //                        for (var i = 0; i < ColumnList.length; i++) {
                            //                            if (ColumnList[i].IsShow) {
                            //                                var IsHas = false;
                            //                                for (var j = 0; j < ChartSettings.Y_AllDataFieldList.length; j++) {
                            //                                    if (ChartSettings.Y_AllDataFieldList[j].DataField == ColumnList[i].DataField) {
                            //                                        IsHas = true;
                            //                                        break;
                            //                                    };
                            //                                };
                            //                                if (IsHas) {
                            //                                    //                                ChartSettings.Y_DataFieldList.push({ HeadText: ColumnList[i].HeadText, DataField: ColumnList[i].DataField });
                            //                                    ChartSettings.Y_DataFieldList.push(ColumnList[i]);
                            //                                };
                            //                            };
                            //                        };
                            //                        Settings.Chart__Y_DataFieldList = ChartSettings.Y_DataFieldList;

                            //                        VisifireChart(ChartSettings);
                            //                    };
                        };
                        //----------------数据绑定完成后事件（结束）----------------

                        //关闭加载锁定层
                        ControlData.ControlJQs.GridView_trFoot_tdFootCenter_DivFootLoadingJQ.hide();
                        ControlData.ControlJQs.GridView_DivBodyLoadingJQ.hide();
                        if ($.browser.msie && $.browser.version == "6.0") { $("select", ControlData.ControlJQs.GridViewJQ).show(); };

                        ControlData.ControlJQs.GridView_DivBody_ScrollJQ.scroll();
                    };

                    if (ControlData.Settings.DataSource.length < 1) {
                        if ($.isFunction(ControlData.Settings.OnSelectedIndexChanging)) {
                            ControlData.Settings.OnSelectedIndexChanging(null, -1);
                        };
                    };
                });
                return this;
            }
        });
    };

    //    window.webSiteRootUrl = "http://localhost:7750/";
    //    window.LinkUrl = "http://localhost:7750/Web/Styles/";
    //    window.ScriptUrl = "http://localhost:7750/Web/Scripts/";
    if (window.ScriptCache == undefined) { window.ScriptCache = false; };
    function getDC() { return (new Date() - new Date(1970, 01, 01)); };
    function loadMeta(name, content, callback) { var meta = document.createElement("meta"); meta.setAttribute("name", name); meta.setAttribute("content", content); window.HeadJS.appendChild(meta); callback(); };
    function loadLink(href, callback) { var link = document.createElement("link"); if (!window.ScriptCache) { href += ((href.indexOf("?") == -1) ? "?" : "&") + "_dc=" + getDC(); }; link.setAttribute("href", href); link.setAttribute("rel", "stylesheet"); link.type = "text/css"; window.HeadJS.appendChild(link); callback(); };
    if (window.HeadJS == undefined) { window.HeadJS = document.getElementsByTagName("head")[0]; };
    function loadScript(url, callback) { var script = document.createElement("script"); if (script.readyState) { script.onreadystatechange = function () { if (script.readyState == "loaded" || script.readyState == "complete") { script.onreadystatechange = null; callback(); }; }; } else { script.onload = function () { callback(); }; }; if (!window.ScriptCache) { url += ((url.indexOf("?") == -1) ? "?" : "&") + "_dc=" + getDC(); }; script.src = url; script.type = "text/javascript"; script.setAttribute("charset", "gb2312"); window.HeadJS.appendChild(script); };
    Load_jQuery();
})();


