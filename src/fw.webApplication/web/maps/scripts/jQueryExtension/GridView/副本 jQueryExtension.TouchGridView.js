$.GridView = {
    ColumnMinWidth: 100
    , MaxPageSize: 1000
    , LineHeight: 26
    , Column: function () {
        return {
            HeadText: ''                                             //列表头文本
            , DataField: ''                                          //列绑定字段名称
            , MeasurementUnit: ''                                    //如果是数值字段，这里就存放计量单位
            , Color: ''                                              //颜色 用于显示效果
            , Width: $.GridView.ColumnMinWidth                       //列宽度
            , HeadAlignment: 'center'                                //列的对齐方式 left|center|right
            , BodyAlignment: 'center'                                //列的对齐方式 left|center|right
            , Format: function (Value, Entity) { return Value }      //数据格式化
            , IsShow: true                                           //是否显示该列
            , IsLock: false                                          //是否锁定该列
            , LockType: "left"                                       //锁定类型 left|right
            , SortType: undefined                                    //Asc-递增 Desc-递减 "Inherit"-默认
            , ChildColumnList: []                                    //子表头数组
            , GetTopColumn: function () {
                var TopColumn = null;
                if (this.ParentColumn == null) {
                    TopColumn = this;
                } else {
                    var ParentColumn = this;
                    do {
                        ParentColumn = ParentColumn.ParentColumn;
                    }
                    while (ParentColumn.ParentColumn != null)
                    TopColumn = ParentColumn;
                };
                return TopColumn;
            }
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

            , ScrollBarWidth: 17                                    //滚动条宽度
            , CallMethodName: null                                  //GridView绑定的方法调用名称
            , ColumnList: []                                        //GridView的列对象数组
            , Height: null                                          //数据表高度
            , LoadingDelay: 1000                                    //加载延时，当加载时间小于该时间时，锁定会延时到该时间消失
            , BodyRowFunction: function (Entity, Index, ControlData) {
                var ObjectList = [];
                for (var i = 0; i < Settings.ColumnList.length; i++) {
                    if (Settings.ColumnList[i].Format == undefined) {
                        ObjectList.push(Entity[Settings.ColumnList[i].DataField]);
                    } else {
                        ObjectList.push(Settings.ColumnList[i].Format(Entity[Settings.ColumnList[i].DataField], Entity));
                    };
                };
                return ObjectList;
            }
            , OnSelectedIndexChanging: function (NewEntity, NewSelectedIndex, OldEntity, OldSelectedIndex, ControlData) { }
            , OnPageIndexChanging: function (NewPageIndex, ControlData) { }
            , OnDataBound: function (ControlData) { }
        };
    }
    , FillBodyRowFunction: function (Properties) {
        var Settings = {
            Selector: null                                       //GridView控件选择器
            , FillRowCount: null
            , RowIndex: 1
        };
        $.extend(Settings, Properties);
        var ControlData = $(Settings.Selector).data("ControlData");
        if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
            if (!fw.fwObject.FWObjectHelper.hasValue(Settings.FillRowCount)) {
                Settings.FillRowCount = ControlData.Settings.PageSize;
            };
            var FillFunction = function (ColumnList, ObjectList, TrRow_ArrowJQ, TrRow_LockLeftJQ, TrRow_ScrollJQ, TrRow_LockRightJQ) {
                for (var j = 0; j < ColumnList.length; j++) {
                    var Column = ColumnList[j];
                    if (Column.ChildColumnList.length > 0) {
                        FillFunction(Column.ChildColumnList, ObjectList, TrRow_ArrowJQ, TrRow_LockLeftJQ, TrRow_ScrollJQ, TrRow_LockRightJQ);
                    } else {
                        var TdRowJQ = $("<td></td>");
                        var TopColumn = Column.GetTopColumn();
                        if (TopColumn.IsLock) {
                            if (TopColumn.LockType.toLowerCase() == "right") {
                                TdRowJQ.appendTo(TrRow_LockRightJQ);
                            } else {
                                TdRowJQ.appendTo(TrRow_LockLeftJQ);
                            };
                        } else {
                            TdRowJQ.appendTo(TrRow_ScrollJQ);
                        };
                        if (!Column.IsShow) {
                            TdRowJQ.hide();
                        };
                        $("<div>&nbsp;</div>").css({ "width": Column.Width + "px", "text-align": Column.BodyAlignment }).appendTo(TdRowJQ);
                    };
                };
            };
            for (var i = 0; i < Settings.FillRowCount; i++) {
                var TrRow_ArrowJQ = $("<tr class=\"trFillRow\"><td><div class=\"jQE_UI_GridView_Arrow_Select\">" + (Settings.RowIndex++) + "</div></td></tr>").data("Entity", null).appendTo(ControlData.ControlJQs.TbodyBodyArrowJQ);
                var TrRow_LockLeftJQ = $("<tr class=\"trFillRow\"></tr>").appendTo(ControlData.ControlJQs.TbodyBodyLockLeftJQ);
                var TrRow_ScrollJQ = $("<tr class=\"trFillRow\"></tr>").appendTo(ControlData.ControlJQs.TbodyBodyScrollJQ);
                var TrRow_LockRightJQ = $("<tr class=\"trFillRow\"></tr>").appendTo(ControlData.ControlJQs.TbodyBodyLockRightJQ);
                FillFunction(ControlData.SortColumnList, null, TrRow_ArrowJQ, TrRow_LockLeftJQ, TrRow_ScrollJQ, TrRow_LockRightJQ);
            };
        };
    }
    , FootFunction: function (Properties) {
        var Settings = {
            Selector: null                                       //GridView控件选择器
        };
        $.extend(Settings, Properties);
        var ControlData = $(Settings.Selector).data("ControlData");
        if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
            ControlData.PageSize = ControlData.Settings.PageSize;
            ControlData.PageNow = ControlData.Settings.PageNow;
            var PageCount = ControlData.Settings.RecordCount % ControlData.PageSize == 0 ? parseInt(ControlData.Settings.RecordCount / ControlData.PageSize) : parseInt(ControlData.Settings.RecordCount / ControlData.PageSize) + 1;
            if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                ControlData.ControlJQs.Foot1_RecordCountJQ.html(ControlData.Settings.RecordCount);
                ControlData.ControlJQs.Foot1_PageSizeJQ.val(ControlData.PageSize).css("min-width", "36px").width(ControlData.PageSize.toString().length * 8);
                ControlData.ControlJQs.Foot1_PageCountJQ.html(PageCount);
                ControlData.ControlJQs.Foot1_PageNowJQ.val(ControlData.PageNow).css("min-width", "36px").width(PageCount.toString().length * 8);
                ControlData.ControlJQs.Foot1_FirstPageJQ.removeClass("aPageChange").removeData("NewPageIndex");
                ControlData.ControlJQs.Foot1_PageUpJQ.removeClass("aPageChange").removeData("NewPageIndex");
                ControlData.ControlJQs.Foot1_PageDownJQ.removeClass("aPageChange").removeData("NewPageIndex");
                ControlData.ControlJQs.Foot1_LastPageJQ.removeClass("aPageChange").removeData("NewPageIndex");
                if (PageCount > 1) {
                    if (ControlData.PageNow == 1) {
                        ControlData.ControlJQs.Foot1_PageDownJQ.addClass("aPageChange").data("NewPageIndex", ControlData.PageNow + 1);
                        ControlData.ControlJQs.Foot1_LastPageJQ.addClass("aPageChange").data("NewPageIndex", PageCount);
                    } else if (ControlData.PageNow == PageCount) {
                        ControlData.ControlJQs.Foot1_FirstPageJQ.addClass("aPageChange").data("NewPageIndex", 1);
                        ControlData.ControlJQs.Foot1_PageUpJQ.addClass("aPageChange").data("NewPageIndex", ControlData.PageNow - 1);
                    } else {
                        ControlData.ControlJQs.Foot1_FirstPageJQ.addClass("aPageChange").data("NewPageIndex", 1);
                        ControlData.ControlJQs.Foot1_PageUpJQ.addClass("aPageChange").data("NewPageIndex", ControlData.PageNow - 1);
                        ControlData.ControlJQs.Foot1_PageDownJQ.addClass("aPageChange").data("NewPageIndex", ControlData.PageNow + 1);
                        ControlData.ControlJQs.Foot1_LastPageJQ.addClass("aPageChange").data("NewPageIndex", PageCount);
                    };
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
        if (fw.fwObject.FWObjectHelper.hasValue(ControlData.ControlJQs.TrRowArrowJQ)) {
            JQ = ControlData.ControlJQs.TrRowArrowJQ.filter("tr.trSelected");
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
         var TrRowSelectedJQ = $("tr.trSelected", GridViewSelector);
         if (Direction == -1) {
             TrRowSelectedJQ.prev().before(TrRowSelectedJQ);
         } else {
             TrRowSelectedJQ.next().after(TrRowSelectedJQ);
         };
     }
     , GetTrRowJQs: function (GridViewSelector) {
         var ControlJQs = $(GridViewSelector).data("ControlJQs");
         if (fw.fwObject.FWObjectHelper.hasValue(ControlJQs)) {
             return $(">tr.jQueryExtension_UI_GridView_TbodyBody_TrRow:not(.trFillRow)", ControlData.ControlJQs.GridView_TbodyBodyJQ);
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
                             $(">tr>th:nth-child(" + Index + ")", ControlData.ControlJQs.GridView_TbodyHead_LockJQ).show();
                             $(">tr>td:nth-child(" + Index + ")", ControlData.ControlJQs.GridView_TbodyBody_LockJQ).show();
                         } else {
                             Index -= LockThCount;
                             $(">tr>th:nth-child(" + Index + ")", ControlData.ControlJQs.GridView_TbodyHead_ScrollJQ).show();
                             $(">tr>td:nth-child(" + Index + ")", ControlData.ControlJQs.GridView_TbodyBody_ScrollJQ).show();
                         };
                     } else {
                         if (Entity.IsLock) {
                             $(">tr>th:nth-child(" + Index + ")", ControlData.ControlJQs.GridView_TbodyHead_LockJQ).hide();
                             $(">tr>td:nth-child(" + Index + ")", ControlData.ControlJQs.GridView_TbodyBody_LockJQ).hide();
                         } else {
                             Index -= LockThCount;
                             $(">tr>th:nth-child(" + Index + ")", ControlData.ControlJQs.GridView_TbodyHead_ScrollJQ).hide();
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
             BodyFromJQ = ControlData.ControlJQs.TrRowLockLeftJQ;
         } else {
             IndexFrom = $(">th>div.jQueryExtension_UI_GridView_TrHead_ThHead_DivHead", ControlData.ControlJQs.GridView_TrHead_ScrollJQ).index(Settings.DragJQ);
             HeadFromJQ = ControlData.ControlJQs.GridView_TrHead_ScrollJQ;
             BodyFromJQ = ControlData.ControlJQs.TrRowScrollJQ;
         };

         if (ColumnTo == "Lock") {
             IndexTo = $(">th>div.jQueryExtension_UI_GridView_TrHead_ThHead_DivHead", ControlData.ControlJQs.GridView_TrHead_LockJQ).index(Settings.DropToJQ);
             HeadToJQ = ControlData.ControlJQs.GridView_TrHead_LockJQ;
             BodyToJQ = ControlData.ControlJQs.TrRowLockLeftJQ;
         } else {
             IndexTo = $(">th>div.jQueryExtension_UI_GridView_TrHead_ThHead_DivHead", ControlData.ControlJQs.GridView_TrHead_ScrollJQ).index(Settings.DropToJQ);
             HeadToJQ = ControlData.ControlJQs.GridView_TrHead_ScrollJQ;
             BodyToJQ = ControlData.ControlJQs.TrRowScrollJQ;
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
     , Select: function (Properties) {
         var Settings = {
             Selector: null                                       //GridView控件选择器
            , SelectedIndex: -1                                   //选中行号
         };
         $.extend(Settings, Properties);
         var ControlData = $(Settings.Selector).data("ControlData");
         if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
             ControlData.ControlJQs.TrDataRowArrowJQ.eq(Settings.SelectedIndex).click();
         };
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
         var ControlData = $(Settings.Selector).data("ControlData");
         if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
             ControlData.Settings.RecordCount = 0;
             ControlData.Settings.PageSize = Settings.PageSize
             ControlData.Settings.PageNow = 0;
             ControlData.Settings.DataSource = [];
             ControlData.ControlJQs.GridViewJQ.GridView(ControlData.Settings);
         };
     }
     , Refresh: function (Properties) {
         var Settings = {
             Selector: null                                       //GridView控件选择器
         };
         $.extend(Settings, Properties);
         var ControlData = $(Settings.Selector).data("ControlData");
         if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
             ControlData.ControlJQs.Foot1_RefreshJQ.click();
         };
     }
     , GetHeadHeight: function (Properties) {
         var Settings = {
             Selector: null                                       //GridView控件选择器
         };
         $.extend(Settings, Properties);
         var HeadHeight = 0;
         var ControlData = $(Settings.Selector).data("ControlData");
         if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
             var Height;
             for (var i = 0; i < ControlData.ControlJQs.HeadTableJQ.length; i++) {
                 Height = $(ControlData.ControlJQs.HeadTableJQ[i]).height();
                 if (Height > HeadHeight) {
                     HeadHeight = Height;
                 };
             };
         };
         return HeadHeight;
     }
     , UpdateLayout: function (Properties) {
         var Settings = {
             Selector: null                                       //GridView控件选择器
         };
         $.extend(Settings, Properties);
         var ControlData = $(Settings.Selector).data("ControlData");
         if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
             var ArrowWidth = ControlData.ControlJQs.TableHeadArrowJQ.width();
             var LockLeftWidth = ControlData.ControlJQs.TableHeadLockLeftJQ.width();
             var LockRightWidth = ControlData.ControlJQs.TableHeadLockRightJQ.width();

             ControlData.ControlJQs.DivLockLeftJQ.css("left", ArrowWidth + "px");
             ControlData.ControlJQs.DivScrollJQ.css({ "left": (ArrowWidth + LockLeftWidth) + "px", "right": (LockRightWidth - ControlData.Settings.ScrollBarWidth - 2) + "px" });
             ControlData.ControlJQs.DivLockRightTouchScrollJQ.width(LockRightWidth - 2);

             var HeadHeight = $.GridView.GetHeadHeight({ Selector: ControlData.ControlJQs.GridViewJQ });
             ControlData.ControlJQs.HeadTableJQ.height(HeadHeight);
             ControlData.ControlJQs.DivHeadJQ.height(HeadHeight - 1);
             ControlData.ControlJQs.DivBodyJQ.css("top", HeadHeight + "px");
         };
     }
     , UpdateRowHeight: function (Properties) {
         var Settings = {
             Selector: null                                       //GridView控件选择器
         };
         $.extend(Settings, Properties);
         var ControlData = $(Settings.Selector).data("ControlData");
         if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
             var IsTableContourFunction = function () {
                 var IsContour = true;
                 var Height = $(ControlData.ControlJQs.BodyTableJQ[0]).height();
                 for (var i = 1; i < ControlData.ControlJQs.BodyTableJQ.length; i++) {
                     if (Height != $(ControlData.ControlJQs.BodyTableJQ[i]).height()) {
                         IsContour = false;
                         break;
                     };
                 };
                 return IsContour;
             };
             if (!IsTableContourFunction()) {
                 for (var i = 0; i < ControlData.ControlJQs.TrRowArrowJQ.length; i++) {
                     if (i == 0 || !IsTableContourFunction()) {
                         var TrRowArrowJQ = ControlData.ControlJQs.TrRowArrowJQ.eq(i);
                         var TrRowLockLeftJQ = ControlData.ControlJQs.TrRowLockLeftJQ.eq(i);
                         var TrRowScrollJQ = ControlData.ControlJQs.TrRowScrollJQ.eq(i);
                         var TrRowLockRightJQ = ControlData.ControlJQs.TrRowLockRightJQ.eq(i);
                         var IsContour = true;
                         var MaxHeight = TrRowArrowJQ.height();
                         var Height;
                         Height = TrRowLockLeftJQ.height(); if (Height > MaxHeight) { MaxHeight = Height; IsContour = false; };
                         Height = TrRowScrollJQ.height(); if (Height > MaxHeight) { MaxHeight = Height; IsContour = false; };
                         Height = TrRowLockRightJQ.height(); if (Height > MaxHeight) { MaxHeight = Height; IsContour = false; };
                         if (!IsContour) {
                             TrRowArrowJQ.height(MaxHeight);
                             TrRowLockLeftJQ.height(MaxHeight);
                             TrRowScrollJQ.height(MaxHeight);
                             TrRowLockRightJQ.height(MaxHeight);
                         };
                     } else {
                         break;
                     };
                 };
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

         jQueryExtension.ResizeWidthHeight(Settings);

         return;
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
                    IsTouch: jQueryExtension.IsTouch()
                    , IsTouchModel: (fw.fwObject.FWObjectHelper.hasValue(fw.fwCookie.FWCookieHelper("IsTouchModel"))&&(fw.fwCookie.FWCookieHelper("IsTouchModel").toLowerCase() == "true" || fw.fwCookie.FWCookieHelper("IsTouchModel").toLowerCase() == "1"))
                    , ScrollLeft: 0
                    , ScrollTop: 0
                    , ControlJQs: {
                        IsInit: true
                    }
                    , IsResize: false
                };
                if (ControlData.IsTouch) {
                    ControlData.IsTouchModel = true;
                };
                GridViewJQ.data("ControlData", ControlData);
                if (GridViewJQ.css("position").toLowerCase() != "absolute") {
                    GridViewJQ.css("position", "relative");
                };

                //如果指定了空间高度
                if (fw.fwObject.FWObjectHelper.hasValue(Settings.Height)) { GridViewJQ.height(Settings.Height); };

                var WindowGuid = fw.guid();
                $.GridView.DivGridView_ContentRandomNumber = "GridView_TableBody_Scroll__" + WindowGuid;
                $.GridView.DivGridView_IndexRandomNumber = "GridView_TableBody_Lock__" + WindowGuid;
                var Html = "";
                Html += "<div class=\"jQE_Container_Absolute\">";
                Html += "    <div class=\"jQE_UI_GridView_Head\">";
                Html += "        <div class=\"jQE_UI_GridView_Arrow\" style=\"overflow:hidden;\">";
                Html += "            <table class=\"jQE_UI_GridView_HeadTable\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
                Html += "                <tbody></tbody>";
                Html += "            </table>";
                Html += "        </div>";
                Html += "        <div class=\"jQE_UI_GridView_LockLeft\" style=\"overflow:hidden;\">";
                Html += "            <table class=\"jQE_UI_GridView_HeadTable\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
                Html += "                <tbody></tbody>";
                Html += "            </table>";
                Html += "        </div>";
                Html += "        <div class=\"jQE_UI_GridView_Scroll\" style=\"overflow:hidden;\">";
                Html += "            <table class=\"jQE_UI_GridView_HeadTable\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
                Html += "                <tbody></tbody>";
                Html += "            </table>";
                Html += "        </div>";
                Html += "        <div class=\"jQE_UI_GridView_LockRight\" style=\"overflow:hidden;\">";
                Html += "            <table class=\"jQE_UI_GridView_HeadTable\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
                Html += "                <tbody></tbody>";
                Html += "            </table>";
                Html += "        </div>";
                Html += "        <div class=\"jQE_UI_GridView_ScrollBar\" style=\"overflow:hidden;\">";
                Html += "        </div>";
                Html += "    </div>";
                Html += "    <div class=\"jQE_UI_GridView_Body\">";
                Html += "        <div class=\"jQE_UI_GridView_Arrow ArrowTouchScroll\" style=\"position: absolute;overflow:hidden;\">";
                Html += "            <table class=\"jQE_UI_GridView_BodyTable\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
                Html += "                <tbody></tbody>";
                Html += "            </table>";
                Html += "            <div class=\"ScrollBarFill-x\"></div>";
                Html += "        </div>";
                Html += "        <div class=\"jQE_UI_GridView_LockLeft LockLeftTouchScroll\" style=\"position: absolute;overflow:hidden;\">";
                Html += "            <table class=\"jQE_UI_GridView_BodyTable\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
                Html += "                <tbody></tbody>";
                Html += "            </table>";
                Html += "            <div class=\"ScrollBarFill-x\"></div>";
                Html += "        </div>";
                Html += "        <div class=\"jQE_UI_GridView_Scroll ScrollTouchScroll\" style=\"position: absolute;overflow:hidden;\">";
                Html += "            <table class=\"jQE_UI_GridView_BodyTable\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
                Html += "                <tbody></tbody>";
                Html += "            </table>";
                Html += "        </div>";
                Html += "        <div class=\"jQE_UI_GridView_LockRight LockRightTouchScroll\" style=\"position: absolute;overflow:hidden;\">";
                Html += "            <table class=\"jQE_UI_GridView_BodyTable\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
                Html += "                <tbody></tbody>";
                Html += "            </table>";
                Html += "            <div class=\"ScrollBarFill-x\"></div>";
                Html += "        </div>";
                Html += "    </div>";
                Html += "    <div class=\"jQE_UI_GridView_Foot\">";
                Html += "        <div class=\"jQE_UI_GridView_Foot1\">";
                Html += "            <div class=\"jQE_UI_GridView_Foot1Left\"><a class=\"jQE_UI_GridView_Foot1_Refresh\" title=\"刷新\">&nbsp;</a><span>共</span><a class=\"jQE_UI_GridView_Foot1_RecordCount\">0</a><span>条记录,每页</span><input class=\"jQE_UI_GridView_Foot1_PageSize\" type=\"text\" value=\"0\"onfocus=\"select();\" /><span>条,转到</span><input class=\"jQE_UI_GridView_Foot1_PageNow\" type=\"text\" value=\"0\"onfocus=\"select();\" />/<a class=\"jQE_UI_GridView_Foot1_PageCount\">0</a><span>页</span></div>";
                Html += "            <div class=\"jQE_UI_GridView_Foot1Right\"><a class=\"jQE_UI_GridView_Foot1_FirstPage\">首  页</a><a class=\"jQE_UI_GridView_Foot1_PageUp\">上一页</a><a class=\"jQE_UI_GridView_Foot1_PageDown\">下一页</a><a class=\"jQE_UI_GridView_Foot1_LastPage\">末  页</a></div>";
                Html += "        </div>";
                Html += "        <div class=\"jQE_UI_GridView_Foot2\"></div>";
                Html += "    </div>";
                Html += "    <div class=\"jQE_Container_Loading\">";
                Html += "        <div class=\"jQE_Container_Background\"></div>";
                Html += "        <div class=\"jQE_Container_Compatible\"></div>";
                Html += "        <div class=\"jQE_Container_Content\"></div>";
                Html += "    </div>";
                Html += "</div>";
                $(Html).appendTo(GridViewJQ);

                ControlData.PageNow = 1;
                ControlData.SelectedIndex = 0;

                ControlData.ControlJQs.DivArrowTouchScrollJQ = $("div.ArrowTouchScroll", GridViewJQ);
                ControlData.ControlJQs.DivArrowTouchScrollJQ.TouchScroll_Init({
                    YScrollBar: true
                    , ScrollFunction: function (TouchScrollControlData) {
                        if (!TouchScrollControlData.IsTouchModel || TouchScrollControlData.IsMouseDown) {
                            var ScrollTop = TouchScrollControlData.ControlJQs.ContentJQ.scrollTop();
                            $.TouchScroll.ScrollTop({ Selector: ControlData.ControlJQs.DivScrollTouchScrollJQ, ScrollTop: ScrollTop });
                            ScrollTop = $.TouchScroll.ScrollTop({ Selector: ControlData.ControlJQs.DivScrollTouchScrollJQ });

                            $.TouchScroll.ScrollTop({ Selector: ControlData.ControlJQs.DivArrowTouchScrollJQ, ScrollTop: ScrollTop });
                            $.TouchScroll.ScrollTop({ Selector: ControlData.ControlJQs.DivLockLeftTouchScrollJQ, ScrollTop: ScrollTop });
                            $.TouchScroll.ScrollTop({ Selector: ControlData.ControlJQs.DivLockRightTouchScrollJQ, ScrollTop: ScrollTop });
                        };
                    }
                });
                var ArrowTouchScrollControlData = ControlData.ControlJQs.DivArrowTouchScrollJQ.data("ControlData");
                $("<table class=\"jQE_UI_GridView_BodyTable\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tbody></tbody></table>").appendTo(ArrowTouchScrollControlData.ControlJQs.ContentJQ);
                if (!ControlData.IsTouchModel) { $("<div class=\"ScrollBarFill-x\" style=\"height:" + Settings.ScrollBarWidth + "px\"></div>").appendTo(ArrowTouchScrollControlData.ControlJQs.ContentJQ); };

                ControlData.ControlJQs.DivLockLeftTouchScrollJQ = $("div.LockLeftTouchScroll", GridViewJQ);
                ControlData.ControlJQs.DivLockLeftTouchScrollJQ.TouchScroll_Init({
                    YScrollBar: true
                    , ScrollFunction: function (TouchScrollControlData) {
                        if (!TouchScrollControlData.IsTouchModel || TouchScrollControlData.IsMouseDown) {
                            var ScrollTop = TouchScrollControlData.ControlJQs.ContentJQ.scrollTop();
                            $.TouchScroll.ScrollTop({ Selector: ControlData.ControlJQs.DivScrollTouchScrollJQ, ScrollTop: ScrollTop });
                            ScrollTop = $.TouchScroll.ScrollTop({ Selector: ControlData.ControlJQs.DivScrollTouchScrollJQ });

                            $.TouchScroll.ScrollTop({ Selector: ControlData.ControlJQs.DivArrowTouchScrollJQ, ScrollTop: ScrollTop });
                            $.TouchScroll.ScrollTop({ Selector: ControlData.ControlJQs.DivLockLeftTouchScrollJQ, ScrollTop: ScrollTop });
                            $.TouchScroll.ScrollTop({ Selector: ControlData.ControlJQs.DivLockRightTouchScrollJQ, ScrollTop: ScrollTop });
                        };
                    }
                });
                var LockLeftTouchScrollControlData = ControlData.ControlJQs.DivLockLeftTouchScrollJQ.data("ControlData");
                $("<table class=\"jQE_UI_GridView_BodyTable\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tbody></tbody></table>").appendTo(LockLeftTouchScrollControlData.ControlJQs.ContentJQ);
                if (!ControlData.IsTouchModel) { $("<div class=\"ScrollBarFill-x\" style=\"height:" + Settings.ScrollBarWidth + "px\"></div>").appendTo(LockLeftTouchScrollControlData.ControlJQs.ContentJQ); };

                ControlData.ControlJQs.DivScrollTouchScrollJQ = $("div.ScrollTouchScroll", GridViewJQ);
                ControlData.ControlJQs.DivScrollTouchScrollJQ.TouchScroll_Init({
                    XScrollBar: true
                    , ScrollFunction: function (TouchScrollControlData) {
                        if (!TouchScrollControlData.IsTouchModel || TouchScrollControlData.IsMouseDown) {
                            var ScrollTop = TouchScrollControlData.ControlJQs.ContentJQ.scrollTop();
                            //$.TouchScroll.ScrollTop({ Selector: ControlData.ControlJQs.DivScrollTouchScrollJQ, ScrollTop: ScrollTop });

                            $.TouchScroll.ScrollTop({ Selector: ControlData.ControlJQs.DivArrowTouchScrollJQ, ScrollTop: ScrollTop });
                            $.TouchScroll.ScrollTop({ Selector: ControlData.ControlJQs.DivLockLeftTouchScrollJQ, ScrollTop: ScrollTop });
                            $.TouchScroll.ScrollTop({ Selector: ControlData.ControlJQs.DivLockRightTouchScrollJQ, ScrollTop: ScrollTop });
                        };
                        var ScrollLeft = TouchScrollControlData.ControlJQs.ContentJQ.scrollLeft();
                        ControlData.ControlJQs.DivHeadScrollJQ.scrollLeft(ScrollLeft);
                    }
                });
                var ScrollTouchScrollControlData = ControlData.ControlJQs.DivScrollTouchScrollJQ.data("ControlData");
                $("<table class=\"jQE_UI_GridView_BodyTable\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tbody></tbody></table>").appendTo(ScrollTouchScrollControlData.ControlJQs.ContentJQ);

                ControlData.ControlJQs.DivLockRightTouchScrollJQ = $("div.LockRightTouchScroll", GridViewJQ);
                ControlData.ControlJQs.DivLockRightTouchScrollJQ.TouchScroll_Init({
                    YScrollBar: true
                    , ScrollFunction: function (TouchScrollControlData) {
                        if (!TouchScrollControlData.IsTouchModel || TouchScrollControlData.IsMouseDown) {
                            var ScrollTop = TouchScrollControlData.ControlJQs.ContentJQ.scrollTop();
                            $.TouchScroll.ScrollTop({ Selector: ControlData.ControlJQs.DivScrollTouchScrollJQ, ScrollTop: ScrollTop });
                            ScrollTop = $.TouchScroll.ScrollTop({ Selector: ControlData.ControlJQs.DivScrollTouchScrollJQ });

                            $.TouchScroll.ScrollTop({ Selector: ControlData.ControlJQs.DivArrowTouchScrollJQ, ScrollTop: ScrollTop });
                            $.TouchScroll.ScrollTop({ Selector: ControlData.ControlJQs.DivLockLeftTouchScrollJQ, ScrollTop: ScrollTop });
                            $.TouchScroll.ScrollTop({ Selector: ControlData.ControlJQs.DivLockRightTouchScrollJQ, ScrollTop: ScrollTop });
                        };
                    }
                });
                var LockRightTouchScrollControlData = ControlData.ControlJQs.DivLockRightTouchScrollJQ.data("ControlData");
                $("<table class=\"jQE_UI_GridView_BodyTable\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tbody></tbody></table>").appendTo(LockRightTouchScrollControlData.ControlJQs.ContentJQ);
                if (!ControlData.IsTouchModel) { $("<div class=\"ScrollBarFill-x\" style=\"height:" + Settings.ScrollBarWidth + "px\"></div>").appendTo(LockRightTouchScrollControlData.ControlJQs.ContentJQ); };

                if (ControlData.IsTouchModel) {
                    setInterval(function () {
                        var ScrollTop = $.TouchScroll.ScrollTop({ Selector: ControlData.ControlJQs.DivScrollTouchScrollJQ });
                        $.TouchScroll.ScrollTop({ Selector: ControlData.ControlJQs.DivArrowTouchScrollJQ, ScrollTop: ScrollTop });
                        $.TouchScroll.ScrollTop({ Selector: ControlData.ControlJQs.DivLockLeftTouchScrollJQ, ScrollTop: ScrollTop });
                        $.TouchScroll.ScrollTop({ Selector: ControlData.ControlJQs.DivLockRightTouchScrollJQ, ScrollTop: ScrollTop });
                    }, 1000);
                };

                ControlData.ControlJQs.GridViewJQ = GridViewJQ.data("WindowGuid", WindowGuid).addClass('jQE_UI_GridView');
                ControlData.ControlJQs.SelectorJQ = ControlData.ControlJQs.GridViewJQ;
                ControlData.ControlJQs.AbsoluteJQ = $(">div.jQE_Container_Absolute", ControlData.ControlJQs.SelectorJQ).css({ "top": "-1px", "bottom": "-1px" });
                ControlData.ControlJQs.LoadingJQ = $(">div.jQE_Container_Loading", ControlData.ControlJQs.AbsoluteJQ);

                ControlData.ControlJQs.DivHeadJQ = $(">div.jQE_UI_GridView_Head", ControlData.ControlJQs.AbsoluteJQ);
                ControlData.ControlJQs.HeadTableJQ = $(">div>table.jQE_UI_GridView_HeadTable", ControlData.ControlJQs.DivHeadJQ);
                ControlData.ControlJQs.DivHeadArrowJQ = $(">div.jQE_UI_GridView_Arrow", ControlData.ControlJQs.DivHeadJQ);
                ControlData.ControlJQs.TableHeadArrowJQ = $(">table:first", ControlData.ControlJQs.DivHeadArrowJQ);
                ControlData.ControlJQs.TbodyHeadArrowJQ = $(">tbody:first", ControlData.ControlJQs.TableHeadArrowJQ);
                ControlData.ControlJQs.DivHeadLockLeftJQ = $(">div.jQE_UI_GridView_LockLeft", ControlData.ControlJQs.DivHeadJQ);
                ControlData.ControlJQs.TableHeadLockLeftJQ = $(">table:first", ControlData.ControlJQs.DivHeadLockLeftJQ);
                ControlData.ControlJQs.TbodyHeadLockLeftJQ = $(">tbody:first", ControlData.ControlJQs.TableHeadLockLeftJQ);
                ControlData.ControlJQs.DivHeadScrollJQ = $(">div.jQE_UI_GridView_Scroll", ControlData.ControlJQs.DivHeadJQ);
                ControlData.ControlJQs.TableHeadScrollJQ = $(">table:first", ControlData.ControlJQs.DivHeadScrollJQ);
                ControlData.ControlJQs.TbodyHeadScrollJQ = $(">tbody:first", ControlData.ControlJQs.TableHeadScrollJQ);
                ControlData.ControlJQs.DivHeadLockRightJQ = $(">div.jQE_UI_GridView_LockRight", ControlData.ControlJQs.DivHeadJQ);
                ControlData.ControlJQs.TableHeadLockRightJQ = $(">table:first", ControlData.ControlJQs.DivHeadLockRightJQ);
                ControlData.ControlJQs.TbodyHeadLockRightJQ = $(">tbody:first", ControlData.ControlJQs.TableHeadLockRightJQ);
                ControlData.ControlJQs.DivHeadScrollBarJQ = $(">div.jQE_UI_GridView_ScrollBar", ControlData.ControlJQs.DivHeadJQ);
                ControlData.ControlJQs.ColumnSetJQ = $("div.jQE_UI_GridView_Arrow_ColumnSet", ControlData.ControlJQs.HeadJQ);

                ControlData.ControlJQs.DivBodyJQ = $(">div.jQE_UI_GridView_Body", ControlData.ControlJQs.AbsoluteJQ);
                ControlData.ControlJQs.BodyTableJQ = $(">table.jQE_UI_GridView_BodyTable", ArrowTouchScrollControlData.ControlJQs.ContentJQ).add($(">table.jQE_UI_GridView_BodyTable", LockLeftTouchScrollControlData.ControlJQs.ContentJQ)).add($(">table.jQE_UI_GridView_BodyTable", ScrollTouchScrollControlData.ControlJQs.ContentJQ)).add($(">table.jQE_UI_GridView_BodyTable", LockRightTouchScrollControlData.ControlJQs.ContentJQ));
                ControlData.ControlJQs.DivBodyArrowJQ = $(">div.jQE_UI_GridView_Arrow", ControlData.ControlJQs.DivBodyJQ);
                ControlData.ControlJQs.TbodyBodyArrowJQ = $("tbody", ControlData.ControlJQs.DivBodyArrowJQ);
                ControlData.ControlJQs.DivBodyLockLeftJQ = $(">div.jQE_UI_GridView_LockLeft", ControlData.ControlJQs.DivBodyJQ);
                ControlData.ControlJQs.TbodyBodyLockLeftJQ = $("tbody", ControlData.ControlJQs.DivBodyLockLeftJQ);
                ControlData.ControlJQs.DivBodyScrollJQ = $(">div.jQE_UI_GridView_Scroll", ControlData.ControlJQs.DivBodyJQ);
                ControlData.ControlJQs.TbodyBodyScrollJQ = $("tbody", ControlData.ControlJQs.DivBodyScrollJQ);
                ControlData.ControlJQs.DivBodyLockRightJQ = $(">div.jQE_UI_GridView_LockRight", ControlData.ControlJQs.DivBodyJQ);
                ControlData.ControlJQs.TbodyBodyLockRightJQ = $("tbody", ControlData.ControlJQs.DivBodyLockRightJQ);

                ControlData.ControlJQs.DivArrowJQ = ControlData.ControlJQs.DivHeadArrowJQ.add(ControlData.ControlJQs.DivBodyArrowJQ);
                ControlData.ControlJQs.DivLockLeftJQ = ControlData.ControlJQs.DivHeadLockLeftJQ.add(ControlData.ControlJQs.DivBodyLockLeftJQ);
                ControlData.ControlJQs.DivScrollJQ = ControlData.ControlJQs.DivHeadScrollJQ.add(ControlData.ControlJQs.DivBodyScrollJQ);
                ControlData.ControlJQs.DivLockRightJQ = ControlData.ControlJQs.DivHeadLockRightJQ.add(ControlData.ControlJQs.DivBodyLockRightJQ);
                ControlData.ControlJQs.DivDataScrollJQ = $(">div.DataScroll", ControlData.ControlJQs.DivBodyJQ);

                ControlData.ControlJQs.DivFootJQ = $(">div.jQE_UI_GridView_Foot", ControlData.ControlJQs.AbsoluteJQ);
                //分页样式1
                ControlData.ControlJQs.DivFoot1JQ = $(">div.jQE_UI_GridView_Foot1", ControlData.ControlJQs.DivFootJQ);
                ControlData.ControlJQs.Foot1_RefreshJQ = $("a.jQE_UI_GridView_Foot1_Refresh", ControlData.ControlJQs.DivFoot1JQ);
                ControlData.ControlJQs.Foot1_RecordCountJQ = $("a.jQE_UI_GridView_Foot1_RecordCount", ControlData.ControlJQs.DivFoot1JQ);
                ControlData.ControlJQs.Foot1_PageSizeJQ = $("input.jQE_UI_GridView_Foot1_PageSize", ControlData.ControlJQs.DivFoot1JQ);
                ControlData.ControlJQs.Foot1_PageNowJQ = $("input.jQE_UI_GridView_Foot1_PageNow", ControlData.ControlJQs.DivFoot1JQ);
                ControlData.ControlJQs.Foot1_PageCountJQ = $("a.jQE_UI_GridView_Foot1_PageCount", ControlData.ControlJQs.DivFoot1JQ);
                ControlData.ControlJQs.Foot1_FirstPageJQ = $("a.jQE_UI_GridView_Foot1_FirstPage", ControlData.ControlJQs.DivFoot1JQ);
                ControlData.ControlJQs.Foot1_PageUpJQ = $("a.jQE_UI_GridView_Foot1_PageUp", ControlData.ControlJQs.DivFoot1JQ);
                ControlData.ControlJQs.Foot1_PageDownJQ = $("a.jQE_UI_GridView_Foot1_PageDown", ControlData.ControlJQs.DivFoot1JQ);
                ControlData.ControlJQs.Foot1_LastPageJQ = $("a.jQE_UI_GridView_Foot1_LastPage", ControlData.ControlJQs.DivFoot1JQ);

                ControlData.ControlJQs.DivHeadScrollBarJQ.width(Settings.ScrollBarWidth + 1);

                //左下角刷新事件绑定
                ControlData.ControlJQs.Foot1_RefreshJQ.bind("click", function () {
                    if ($.isFunction(ControlData.Settings.OnPageIndexChanging)) {
                        ControlData.Settings.OnPageIndexChanging(ControlData.PageNow);
                    };
                });

                //绑定左下角分页大小发生变化事件
                ControlData.ControlJQs.Foot1_PageSizeJQ.bind("blur", function () {
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
                ControlData.ControlJQs.Foot1_PageNowJQ.bind("blur", function () {
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

                //首页 上一页 下一页 末页 事件绑定
                ControlData.ControlJQs.Foot1_FirstPageJQ
                .add(ControlData.ControlJQs.Foot1_PageUpJQ)
                .add(ControlData.ControlJQs.Foot1_PageDownJQ)
                .add(ControlData.ControlJQs.Foot1_LastPageJQ).bind("click", function () {
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
                ControlData.ControlJQs.DivHeadJQ.hide();
            } else {
                ControlData.ControlJQs.DivHeadJQ.show();
            };

            //是否显示分页
            if (!Settings.IsShowFoot) {
                ControlData.ControlJQs.DivFootJQ.hide();
            } else {
                ControlData.ControlJQs.DivFootJQ.show();
            };

            //是否开启箭头
            if (Settings.IsShowSelectedArrowhead) {
                ControlData.ControlJQs.DivArrowJQ.show();
            } else {
                ControlData.ControlJQs.DivArrowJQ.hide();
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
                //保持原有列设置，复制原有列到排序列
                ControlData.SortColumnList = jExtension.JsonCopy(ControlData.Settings.ColumnList);

                //排序列设置初始化
                var ColumnSettingsInit = function (ColumnList) {
                    var Index = 0;
                    var Init = function (ColumnList, ParentColumn) {
                        for (var i = 0; i < ColumnList.length; i++) {
                            var Column = ColumnList[i];
                            var ColumnSettings = $.GridView.Column();
                            $.extend(ColumnSettings, Column);
                            if (!fw.fwObject.FWObjectHelper.hasValue(ColumnSettings.Width)) { ColumnSettings.Width = $.GridView.ColumnMinWidth; };
                            ColumnSettings.Width = parseInt(ColumnSettings.Width);
                            ColumnList[i] = ColumnSettings;
                            ColumnList[i].ParentColumn = ParentColumn;
                            if (ColumnList[i].ChildColumnList.length > 0) {
                                Init(ColumnList[i].ChildColumnList, ColumnList[i]);
                            } else {
                                ColumnList[i].Index = Index++;
                            };
                        };
                    };
                    Init(ColumnList, null);
                };
                ColumnSettingsInit(ControlData.SortColumnList);

                //重组锁定列的位置（把锁定列靠左锁定，靠右锁定）
                var LockLeftColumnList = [];
                var ScrollColumnList = [];
                var LockRightColumnList = [];
                for (var i = 0; i < ControlData.SortColumnList.length; i++) {
                    var Column = ControlData.SortColumnList[i];
                    if (Column.IsLock) {
                        if (Column.LockType.toLowerCase() == "right") {
                            LockRightColumnList.push(Column);
                        } else {
                            LockLeftColumnList.push(Column);
                        };
                    } else {
                        ScrollColumnList.push(Column);
                    };
                };
                ControlData.SortColumnList = [];
                for (var i = 0; i < LockLeftColumnList.length; i++) { ControlData.SortColumnList.push(LockLeftColumnList[i]); };
                for (var i = 0; i < ScrollColumnList.length; i++) { ControlData.SortColumnList.push(ScrollColumnList[i]); };
                for (var i = 0; i < LockRightColumnList.length; i++) { ControlData.SortColumnList.push(LockRightColumnList[i]); };

                ControlData.ControlJQs.TbodyHeadArrowJQ.empty();
                ControlData.ControlJQs.TbodyHeadLockLeftJQ.empty();
                ControlData.ControlJQs.TbodyHeadScrollJQ.empty();
                ControlData.ControlJQs.TbodyHeadLockRightJQ.empty();

                //循环生成表头
                var GetMaxLevel = function (Column) { var MaxLevelFunction = function (Column, MaxLevel) { if (Column.ChildColumnList.length > 0) { var NextLevel = MaxLevel + 1; for (var i = 0; i < Column.ChildColumnList.length; i++) { var Level = MaxLevelFunction(Column.ChildColumnList[i], NextLevel); if (Level > MaxLevel) { MaxLevel = Level; }; }; }; return MaxLevel; }; return MaxLevelFunction(Column, 1); };
                var GetAllMaxLevel = function () { var AllMaxLevel = 0; for (var i = 0; i < ControlData.SortColumnList.length; i++) { var MaxLevel = GetMaxLevel(ControlData.SortColumnList[i]); if (MaxLevel > AllMaxLevel) { AllMaxLevel = MaxLevel; }; }; return AllMaxLevel; };
                var AllMaxLevel = GetAllMaxLevel();
                for (var i = 0; i < AllMaxLevel; i++) {
                    $("<tr></tr>").appendTo(ControlData.ControlJQs.TbodyHeadArrowJQ);
                    $("<tr></tr>").appendTo(ControlData.ControlJQs.TbodyHeadLockLeftJQ);
                    $("<tr></tr>").appendTo(ControlData.ControlJQs.TbodyHeadScrollJQ);
                    $("<tr></tr>").appendTo(ControlData.ControlJQs.TbodyHeadLockRightJQ);
                };
                var GetColspan = function (Column) { var Colspan = 0; var ColspanFunction = function (Column) { if (Column.ChildColumnList.length > 0) { for (var i = 0; i < Column.ChildColumnList.length; i++) { ColspanFunction(Column.ChildColumnList[i]); }; } else { Colspan++; }; }; ColspanFunction(Column); return Colspan; };
                var GetColumnText = function (Column) {
                    var InnerHtml = Column.HeadText;
                    if (fw.fwObject.FWObjectHelper.hasValue(Column.MeasurementUnit)) {
                        InnerHtml += "(" + Column.MeasurementUnit + ")";
                    };
                    return InnerHtml;
                };
                var HeadFunction = function (TbodyHeadJQ, Column) {
                    var Function = function (Column, Index) {
                        var thJQ;
                        var Colspan = GetColspan(Column);
                        if (Column.ChildColumnList.length > 0) {
                            thJQ = $("<th colspan=\"" + Colspan + "\"></th>").appendTo($(">tr:eq(" + Index + ")", TbodyHeadJQ));
                            for (var i = 0; i < Column.ChildColumnList.length; i++) {
                                Function(Column.ChildColumnList[i], (Index + 1));
                            };
                        } else {
                            thJQ = $("<th colspan=\"" + Colspan + "\" rowspan=\"" + (AllMaxLevel - Index) + "\"></th>").appendTo($(">tr:eq(" + Index + ")", TbodyHeadJQ));
                        };
                        var divJQ = $("<div></div>").appendTo(thJQ).css({ "width": Column.Width + "px", "text-align": Column.HeadAlignment }).data("Entity", Column);
                        divJQ.html(GetColumnText(Column));
                    };
                    Function(Column, 0);
                }; ;
                $("<th rowspan=\"" + AllMaxLevel + "\"><div class=\"jQE_UI_GridView_Arrow_Select Set\" title=\"设置\">&nbsp;</div></th>").appendTo($(">tr:eq(0)", ControlData.ControlJQs.TbodyHeadArrowJQ));
                for (var i = 0; i < LockLeftColumnList.length; i++) { HeadFunction(ControlData.ControlJQs.TbodyHeadLockLeftJQ, LockLeftColumnList[i]); };
                for (var i = 0; i < ScrollColumnList.length; i++) { HeadFunction(ControlData.ControlJQs.TbodyHeadScrollJQ, ScrollColumnList[i]); };
                var thJQ = $("<th rowspan=\"" + AllMaxLevel + "\"><div style=\"width:" + ControlData.Settings.ScrollBarWidth + "px\">&nbsp;</div></th>").appendTo($(">tr:eq(0)", ControlData.ControlJQs.TbodyHeadScrollJQ));
                for (var i = 0; i < LockRightColumnList.length; i++) { HeadFunction(ControlData.ControlJQs.TbodyHeadLockRightJQ, LockRightColumnList[i]); };
                var thJQ = $("<th rowspan=\"" + AllMaxLevel + "\"><div style=\"width:" + ControlData.Settings.ScrollBarWidth + "px\">&nbsp;</div></th>").appendTo($(">tr:eq(0)", ControlData.ControlJQs.TbodyHeadLockRightJQ));

                $.TouchScroll.DataBind({ Selector: ControlData.ControlJQs.DivArrowTouchScrollJQ });
                $.TouchScroll.DataBind({ Selector: ControlData.ControlJQs.DivLockLeftTouchScrollJQ });
                $.TouchScroll.DataBind({ Selector: ControlData.ControlJQs.DivScrollTouchScrollJQ });
                $.TouchScroll.DataBind({ Selector: ControlData.ControlJQs.DivLockRightTouchScrollJQ });

                //重置表左中右布局
                $.GridView.UpdateLayout({ Selector: ControlData.ControlJQs.GridViewJQ });
            };

            ControlData.ControlJQs.TbodyBodyArrowJQ.empty();
            ControlData.ControlJQs.TbodyBodyLockLeftJQ.empty();
            ControlData.ControlJQs.TbodyBodyScrollJQ.empty();
            ControlData.ControlJQs.TbodyBodyLockRightJQ.empty();
            //根据分页大小填满空数据行
            if (ControlData.Settings.IsFillBodyRow) {
                $.GridView.FillBodyRowFunction({ Selector: ControlData.ControlJQs.GridViewJQ, FillRowCount: null });
            };

            //打开加载锁定屏
            ControlData.ControlJQs.GridViewJQ.GridView_Loading();
        });
        return this;
    }
    , GridView_Loading: function () {
        this.each(function () {
            var ControlData = $(this).data("ControlData");
            if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                ControlData.ControlJQs.LoadingJQ.show();
                ControlData.RequestStartTime = new Date();
            };
        });
        return this;
    }
    , GridView: function (Properties) {
        if (!fw.fwObject.FWObjectHelper.hasValue(Properties)) { Properties = {}; };
        var Settings = $.GridView.Settings();
        $.extend(Settings, Properties);

        this.each(function () {
            var GridViewJQ = $(this);
            //初始化控件
            GridViewJQ.GridView_Init(Settings);

            var ControlData = GridViewJQ.data("ControlData");
            if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                ControlData.ControlJQs.TbodyBodyArrowJQ.empty();
                ControlData.ControlJQs.TbodyBodyLockLeftJQ.empty();
                ControlData.ControlJQs.TbodyBodyScrollJQ.empty();
                ControlData.ControlJQs.TbodyBodyLockRightJQ.empty();

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
                var RowIndex = 1;
                var AddDataFunction = function (ColumnList, ObjectList, TrRow_ArrowJQ, TrRow_LockLeftJQ, TrRow_ScrollJQ, TrRow_LockRightJQ) {
                    for (var j = 0; j < ColumnList.length; j++) {
                        var Column = ColumnList[j];
                        if (Column.ChildColumnList.length > 0) {
                            AddDataFunction(Column.ChildColumnList, ObjectList, TrRow_ArrowJQ, TrRow_LockLeftJQ, TrRow_ScrollJQ, TrRow_LockRightJQ);
                        } else {
                            var TdRowJQ = $("<td></td>");
                            var TopColumn = Column.GetTopColumn();
                            if (TopColumn.IsLock) {
                                if (TopColumn.LockType.toLowerCase() == "right") {
                                    TdRowJQ.appendTo(TrRow_LockRightJQ);
                                } else {
                                    TdRowJQ.appendTo(TrRow_LockLeftJQ);
                                };
                            } else {
                                TdRowJQ.appendTo(TrRow_ScrollJQ);
                            };
                            if (!Column.IsShow) {
                                TdRowJQ.hide();
                            };
                            var TdRow_DivRowJQ = $("<div></div>").css({ "width": Column.Width + "px", "text-align": Column.BodyAlignment }).appendTo(TdRowJQ);
                            var InnerJQ = ObjectList[Column.Index];
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
                };
                for (var i = TrRowFrom; i < TrRowTo; i++) {
                    var Entity = ControlData.Settings.DataSource[i];
                    var ObjectList = ControlData.Settings.BodyRowFunction(Entity, RowIndex - 1, ControlData);
                    var TrRow_ArrowJQ = $("<tr><td><div class=\"jQE_UI_GridView_Arrow_Select\">" + (RowIndex++) + "</div></td></tr>").data("Entity", Entity).appendTo(ControlData.ControlJQs.TbodyBodyArrowJQ);
                    var TrRow_LockLeftJQ = $("<tr></tr>").appendTo(ControlData.ControlJQs.TbodyBodyLockLeftJQ);
                    var TrRow_ScrollJQ = $("<tr></tr>").appendTo(ControlData.ControlJQs.TbodyBodyScrollJQ);
                    var TrRow_LockRightJQ = $("<tr></tr>").appendTo(ControlData.ControlJQs.TbodyBodyLockRightJQ);
                    AddDataFunction(ControlData.SortColumnList, ObjectList, TrRow_ArrowJQ, TrRow_LockLeftJQ, TrRow_ScrollJQ, TrRow_LockRightJQ);

                    //                    $("<td><div class=\"ScrollBarFill-y\" style=\"width:" + ControlData.Settings.ScrollBarWidth + "px\">&nbsp;</div></td>").appendTo(TrRow_LockRightJQ);

                };

                TrRowFillTo = 1;
                //是否进行空数据填充
                if (ControlData.Settings.IsFillBodyRow && TrRowFillTo > 0) {
                    $.GridView.FillBodyRowFunction({ Selector: ControlData.ControlJQs.GridViewJQ, FillRowCount: TrRowFillTo, RowIndex: RowIndex });
                };

                $.TouchScroll.DataBind({ Selector: ControlData.ControlJQs.DivArrowTouchScrollJQ });
                $.TouchScroll.DataBind({ Selector: ControlData.ControlJQs.DivLockLeftTouchScrollJQ });
                $.TouchScroll.DataBind({ Selector: ControlData.ControlJQs.DivScrollTouchScrollJQ });
                $.TouchScroll.DataBind({ Selector: ControlData.ControlJQs.DivLockRightTouchScrollJQ });

                //重新生成分页
                $.GridView.FootFunction({ Selector: ControlData.ControlJQs.GridViewJQ });

                //----------------整理GridView样式（开始）----------------

                //表格隔行变色
                ControlData.ControlJQs.TrRowArrowJQ = $(">tr", ControlData.ControlJQs.TbodyBodyArrowJQ).each(function (i) { if (i % 2 == 0) { $(this).addClass('trOdd'); } else { $(this).addClass('trAlternating'); }; });
                ControlData.ControlJQs.TrRowLockLeftJQ = $(">tr", ControlData.ControlJQs.TbodyBodyLockLeftJQ).each(function (i) { if (i % 2 == 0) { $(this).addClass('trOdd'); } else { $(this).addClass('trAlternating'); }; });
                ControlData.ControlJQs.TrRowScrollJQ = $(">tr", ControlData.ControlJQs.TbodyBodyScrollJQ).each(function (i) { if (i % 2 == 0) { $(this).addClass('trOdd'); } else { $(this).addClass('trAlternating'); }; });
                ControlData.ControlJQs.TrRowLockRightJQ = $(">tr", ControlData.ControlJQs.TbodyBodyLockRightJQ).each(function (i) { if (i % 2 == 0) { $(this).addClass('trOdd'); } else { $(this).addClass('trAlternating'); }; });

                //整理数据行的高度
                $.GridView.UpdateRowHeight({ Selector: ControlData.ControlJQs.GridViewJQ });

                ControlData.ControlJQs.TrDataRowArrowJQ = ControlData.ControlJQs.TrRowArrowJQ.filter(":not(.trFillRow)");
                ControlData.ControlJQs.TrDataRowLockLeftJQ = ControlData.ControlJQs.TrRowLockLeftJQ.filter(":not(.trFillRow)");
                ControlData.ControlJQs.TrDataRowScrollJQ = ControlData.ControlJQs.TrRowScrollJQ.filter(":not(.trFillRow)");
                ControlData.ControlJQs.TrDataRowLockRightJQ = ControlData.ControlJQs.TrRowLockRightJQ.filter(":not(.trFillRow)");

                var MouseOverFunction = function (Index) { ControlData.ControlJQs.TrDataRowLockLeftJQ.eq(Index).addClass('trHover'); ControlData.ControlJQs.TrDataRowScrollJQ.eq(Index).addClass('trHover'); ControlData.ControlJQs.TrDataRowLockRightJQ.eq(Index).addClass('trHover'); };
                var MouseOutFunction = function (Index) { ControlData.ControlJQs.TrDataRowLockLeftJQ.eq(Index).removeClass('trHover'); ControlData.ControlJQs.TrDataRowScrollJQ.eq(Index).removeClass('trHover'); ControlData.ControlJQs.TrDataRowLockRightJQ.eq(Index).removeClass('trHover'); };
                //鼠标进过样式变化
                ControlData.ControlJQs.TrDataRowLockLeftJQ.hover(function () { MouseOverFunction(ControlData.ControlJQs.TrDataRowLockLeftJQ.index(this)); }, function () { MouseOutFunction(ControlData.ControlJQs.TrDataRowLockLeftJQ.index(this)); });
                ControlData.ControlJQs.TrDataRowScrollJQ.hover(function () { MouseOverFunction(ControlData.ControlJQs.TrDataRowScrollJQ.index(this)); }, function () { MouseOutFunction(ControlData.ControlJQs.TrDataRowScrollJQ.index(this)); });
                ControlData.ControlJQs.TrDataRowLockRightJQ.hover(function () { MouseOverFunction(ControlData.ControlJQs.TrDataRowLockRightJQ.index(this)); }, function () { MouseOutFunction(ControlData.ControlJQs.TrDataRowLockRightJQ.index(this)); });

                //----------------整理GridView样式（结束）----------------



                //----------------选中行事件处理（开始）----------------
                //如果允许选中行，绑定行事件
                if (ControlData.Settings.AllowRowSelected && ControlData.ControlJQs.TrDataRowArrowJQ.length > 0) {
                    ControlData.ControlJQs.TrDataRowArrowJQ.bind("click", function (e) {
                        var trOldJQ = $(">tr.trSelected:first", ControlData.ControlJQs.TbodyBodyArrowJQ);
                        var OldSelectedIndex = -1;
                        var OldEntity = null;
                        if (trOldJQ.length > 0) {
                            OldSelectedIndex = ControlData.ControlJQs.TrDataRowArrowJQ.index(trOldJQ);
                            OldEntity = trOldJQ.data("Entity");
                        };

                        var trNewJQ = $(this);
                        var NewSelectedIndex = ControlData.ControlJQs.TrRowArrowJQ.index(trNewJQ);
                        var NewEntity = trNewJQ.data("Entity");
                        ControlData.SelectedIndex = NewSelectedIndex;

                        if (NewSelectedIndex != OldSelectedIndex) {
                            var trAllOldJQ = trOldJQ.add(ControlData.ControlJQs.TrDataRowLockLeftJQ.eq(OldSelectedIndex)).add(ControlData.ControlJQs.TrDataRowScrollJQ.eq(OldSelectedIndex)).add(ControlData.ControlJQs.TrDataRowLockRightJQ.eq(OldSelectedIndex));
                            trAllOldJQ.removeClass("trSelected");
                            $("tr.trSelected", trAllOldJQ).removeClass("trSelected");
                            $("div.Arrowhead", trAllOldJQ).removeClass("Arrowhead");
                        };

                        var trAllNewJQ = trNewJQ.add(ControlData.ControlJQs.TrDataRowLockLeftJQ.eq(NewSelectedIndex)).add(ControlData.ControlJQs.TrDataRowScrollJQ.eq(NewSelectedIndex)).add(ControlData.ControlJQs.TrDataRowLockRightJQ.eq(NewSelectedIndex));
                        trAllNewJQ.addClass('trSelected');
                        $(">td>div:first", trNewJQ).addClass('Arrowhead');

                        if ($.isFunction(ControlData.Settings.OnSelectedIndexChanging)) {
                            ControlData.Settings.OnSelectedIndexChanging(NewEntity, NewSelectedIndex, OldEntity, OldSelectedIndex, ControlData);
                        };
                    });

                    ControlData.ControlJQs.TrDataRowLockLeftJQ.bind("click", function (e) {
                        var SelectedIndex = ControlData.ControlJQs.TrDataRowLockLeftJQ.index(this);
                        $.GridView.Select({ Selector: ControlData.ControlJQs.GridViewJQ, SelectedIndex: SelectedIndex });
                    });

                    ControlData.ControlJQs.TrDataRowScrollJQ.bind("click", function (e) {
                        var SelectedIndex = ControlData.ControlJQs.TrDataRowScrollJQ.index(this);
                        $.GridView.Select({ Selector: ControlData.ControlJQs.GridViewJQ, SelectedIndex: SelectedIndex });
                    });

                    ControlData.ControlJQs.TrDataRowLockRightJQ.bind("click", function (e) {
                        var SelectedIndex = ControlData.ControlJQs.TrDataRowLockRightJQ.index(this);
                        $.GridView.Select({ Selector: ControlData.ControlJQs.GridViewJQ, SelectedIndex: SelectedIndex });
                    });
                };

                //如果允许选中行，则默认选中的一行
                if (ControlData.Settings.AllowRowSelected && ControlData.Settings.AllowSelectedFirstRow && ControlData.ControlJQs.TrDataRowArrowJQ.length > 0) {
                    ControlData.SelectedIndex = ControlData.SelectedIndex < ControlData.ControlJQs.TrDataRowArrowJQ.length ? ControlData.SelectedIndex : (ControlData.ControlJQs.TrDataRowArrowJQ.length - 1);
                    ControlData.SelectedIndex = ControlData.SelectedIndex < 0 ? 0 : ControlData.SelectedIndex;
                    var trJQ = ControlData.ControlJQs.TrRowArrowJQ.eq(ControlData.SelectedIndex);
                    trJQ.click();
                };
                //----------------选中行事件处理（结束）----------------



                //----------------数据绑定完成后事件（开始）----------------
                if ($.isFunction(ControlData.Settings.OnDataBound)) {
                    ControlData.Settings.OnDataBound(ControlData);
                };
                //----------------数据绑定完成后事件（结束）----------------

                //                //通过滚动条让数据对齐
                //                var TouchScrollControlData = ControlData.ControlJQs.DivTouchScrollJQ.data("ControlData");
                //                TouchScrollControlData.ControlJQs.ContentJQ.scroll();

                //关闭加载锁定层
                ControlData.RequestEndTime = new Date();
                var RemainTime = ControlData.Settings.LoadingDelay - (ControlData.RequestEndTime - ControlData.RequestStartTime);
                setTimeout(function () { ControlData.ControlJQs.LoadingJQ.hide(); }, RemainTime);

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