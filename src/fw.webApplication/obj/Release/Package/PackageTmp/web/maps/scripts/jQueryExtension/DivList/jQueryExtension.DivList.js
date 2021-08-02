$.DivList = {
    Settings: function () {
        return {
            Selector: null
            , SelectedIndex: 0
        };
    }
     , GetSelectedEntity: function (Properties) {
         var Settings = {
             Selector: null                                       //DivList控件选择器
         };
         $.extend(Settings, Properties);

         var Entity = $.DivList.GetTrRowSelectedJQ({ Selector: Settings.Selector }).data("Entity");
         if (Entity == undefined) {
             Entity = null;
         };
         return Entity;
     }
     , Select: function (Properties) {
         var Settings = {
             Selector: null                                       //DivList控件选择器
            , SelectedIndex: -1                                   //选中行号
         };
         $.extend(Settings, Properties);

         var ControlData = $(Settings.Selector).data("ControlData");
         $(">tr:eq(" + Settings.SelectedIndex + ")", ControlData.ControlJQs.DivList_TbodyBody_ArrowJQ).click();
     }
     , Empty: function (Properties) {
         var Settings = {
             Selector: null                                       //DivList控件选择器
         };
         $.extend(Settings, Properties);

         $(Settings.Selector).removeData("ControlData").removeData("ColumnList").removeData("DivListChart").removeData("OnPageIndexChanging").empty();
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

                     if (fw.fwObject.FWObjectHelper.hasValue(Settings.Width) && ControlData.ControlJQs.DivListJQ.width() != Settings.Width) {
                         SelectorJQ.width(Settings.Width);
                         IsResize = true;
                     };
                     if (fw.fwObject.FWObjectHelper.hasValue(Settings.Height) && ControlData.ControlJQs.DivListJQ.height() != Settings.Height) {
                         IsResize = true;
                     };
                     if (IsResize || Settings.IsMustResize) {
                         ControlData.IsResize = true;


                         var BodyWidth = ControlData.ControlJQs.DivList_DivBodyJQ.width();
                         ControlData.ControlJQs.DivList_UlBodyJQ.width(BodyWidth * ControlData.ControlJQs.DivList_UlBody_LiJQ.length);
                         ControlData.ControlJQs.DivList_UlBody_LiJQ.width(BodyWidth);

                         var BodyHeight = Settings.Height;
                         if (ControlData.ControlJQs.ControlTypeCode == "DivList_FixedHead") {
                             var HeadHeight = ControlData.ControlJQs.DivList_DivHeadJQ.is(":hidden") ? 0 : ControlData.ControlJQs.DivList_DivHeadJQ.height() + 2;
                             BodyHeight -= HeadHeight;
                         } else {
                             ControlData.ControlJQs.DivList_DivHeadJQ.css("margin-top", (0 - BodyHeight) + "px");
                         };
                         ControlData.ControlJQs.DivList_DivBodyJQ.height(BodyHeight);
                         ControlData.ControlJQs.DivList_UlBody_DivJQ.height(BodyHeight);

                         jQueryExtension.ResizeWidthHeight({
                             Selector: ControlData.ControlJQs.DivList_UlBody_DivJQ
                            , Width: Settings.Width
                            , Height: BodyHeight
                            , IsMustResize: Settings.IsMustResize
                         });

                     };
                 };
             });
         };
     }

};


//分页DivList
$.fn.extend({
    DivList_Init: function (Properties) {
        if (!fw.fwObject.FWObjectHelper.hasValue(Properties)) { Properties = {}; };
        var Settings = $.DivList.Settings();
        $.extend(Settings, Properties);

        this.each(function () {
            var DivListJQ = $(this);
            var ControlData = DivListJQ.data("ControlData");

            //判断DivList有没缓存数据，有表示已经加载控件，无表示控件第一次加载
            if (!fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                ControlData = {
                    Settings: Settings
                    , ScrollLeft: 0
                    , ScrollTop: 0
                    , IsResize: false
                };
                DivListJQ.data("ControlData", ControlData);

                var WindowGuid = fw.guid();

                ControlData.PageNow = 1;
                ControlData.SelectedIndex = 0;

                ControlData.ControlJQs = {
                    IsInit: true
                    , WindowGuid: WindowGuid
                    , DivListJQ: DivListJQ.data("WindowGuid", WindowGuid).addClass('jQueryExtension_UI_DivList')
                };
                ControlData.ControlJQs.DivList_DivHeadJQ = $(">div.jQueryExtension_UI_DivList_Head", ControlData.ControlJQs.DivListJQ);
                ControlData.ControlJQs.DivList_UlHeadJQ = $(">ul:first", ControlData.ControlJQs.DivList_DivHeadJQ);
                ControlData.ControlJQs.DivList_UlHead_LiJQ = $(">li", ControlData.ControlJQs.DivList_UlHeadJQ);
                ControlData.ControlJQs.DivList_DivBodyJQ = $(">div.jQueryExtension_UI_DivList_Body", ControlData.ControlJQs.DivListJQ);
                ControlData.ControlJQs.DivList_UlBodyJQ = $(">ul:first", ControlData.ControlJQs.DivList_DivBodyJQ);
                ControlData.ControlJQs.DivList_UlBody_LiJQ = $(">li", ControlData.ControlJQs.DivList_UlBodyJQ);
                ControlData.ControlJQs.DivList_UlBody_DivJQ = $(">div", ControlData.ControlJQs.DivList_UlBody_LiJQ);

                ControlData.ControlJQs.ControlTypeCode = $(">div:first", ControlData.ControlJQs.DivListJQ).hasClass("jQueryExtension_UI_DivList_Head") ? "DivList_FixedHead" : "DivList_CustomHead";

                ControlData.ControlJQs.DivList_UlHead_LiJQ.bind("click", function () {
                    ControlData.ControlJQs.DivList_UlHead_LiJQ.removeClass("jQueryExtension_UI_DivList_Head_LiSelected");
                    var thisJQ = $(this).addClass("jQueryExtension_UI_DivList_Head_LiSelected");
                    var Index = ControlData.ControlJQs.DivList_UlHead_LiJQ.index(thisJQ);
                    ControlData.ControlJQs.DivList_UlBodyJQ.animate({
                        "margin-left": ((0 - ControlData.ControlJQs.DivList_DivBodyJQ.width()) * Index) + "px"
                    }, Settings.Speed, function () {
                    });
                });

            } else {
                ControlData.ControlJQs.IsInit = false;
            };

            //如果指定了空间高度，则触发控件Resize事件，重置控件 表头 数据表 表尾 布局
            if (fw.fwObject.FWObjectHelper.hasValue(Settings.Height)) {
                $.DivList.ResizeWidthHeight({
                    Selector: ControlData.ControlJQs.DivListJQ
                    , Height: Settings.Height
                    , IsMustResize: true
                });
            };


        });
    }
    , DivList_Loading: function () {
        this.each(function () {
            var ControlData = $(this).data("ControlData");
            ControlData.ControlJQs.DivList_DivLoadingJQ.show();
        });
    }
    , DivList: function (Properties) {
        if (!fw.fwObject.FWObjectHelper.hasValue(Properties)) { Properties = {}; };
        var Settings = $.DivList.Settings();
        $.extend(Settings, Properties);

        var SelectorJQ = this;
        if (SelectorJQ.length > 0) {
            //初始化控件
            SelectorJQ.DivList_Init(Settings);

            SelectorJQ.each(function () {
                var DivListJQ = $(this);
                var ControlData = DivListJQ.data("ControlData");
                if (fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
                    ControlData.ControlJQs.DivList_UlHead_LiJQ.eq(Settings.SelectedIndex).click();
                };
            });
        };
        return this;
    }
});