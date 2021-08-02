// //图例控件
// $.fn.extend({
//     LegendControl: function (properties) {
//         var Settings = {
//             ArcGISWindow: null
//                , ArcGISMap: null
//                , width: 180
//                , isColumn: false //是否以多列形式显示
//                , legend: null   //图例列表
//         };
//         $.extend(Settings, properties);
//         var GridViewSettings = null;
//         var SelectorJQ = $(this);
//         SelectorJQ.empty();
//         if (fw.fwObject.FWObjectHelper.hasValue(Settings.ArcGISWindow) && fw.fwObject.FWObjectHelper.hasValue(Settings.ArcGISMap)) {
//             SelectorJQ.each(function () {
//                 var LegendControlJQ = $(this);
//                 var ControlData = null;
//                 //判断SearchControl有没缓存数据，有表示已经加载控件，无表示控件第一次加载
//                 if (!fw.fwObject.FWObjectHelper.hasValue(ControlData)) {
//                     ControlData = {
//                         IsTouch: jQueryExtension.IsTouch()
//                             , IsTouchModel: (fw.fwObject.FWObjectHelper.hasValue(fw.fwCookie.FWCookieHelper("IsTouchModel")) && (fw.fwCookie.FWCookieHelper("IsTouchModel").toLowerCase() == "true" || fw.fwCookie.FWCookieHelper("IsTouchModel").toLowerCase() == "1"))
//                             , ScrollLeft: 0
//                             , ScrollTop: 0
//                             , ControlJQs: {
//                                 IsInit: true
//                             }
//                             , IsResize: false
//                             , MapCurrentLevel: -1
//                     };
//                     if (ControlData.IsTouch) {
//                         ControlData.IsTouchModel = true;
//                     };
//                     LegendControlJQ.empty().data("ControlData", ControlData);
//                     if (LegendControlJQ.css("position").toLowerCase() != "absolute") {
//                         LegendControlJQ.css("position", "relative");
//                     };

//                     var imgUrl = fw.fwUrl.FWUrlHelper.getAbsoluteUrl('resources/scripts/fw.map/themes/' + skin + '/images/tic2.png', $.page.webSiteRootUrl);
//                     var Html = "";
//                     Html += " <div id=\"ControlLegend\" style=\"width: 100% !important;\">";
//                     Html += " <div class=\"windowimg_xx\" style=\"width: 100% !important;\">";
//                     Html += "<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
//                     Html += " <tr><td width=\"30px\" align=\"center\" valign=\"middle\"><img src=\"" + imgUrl + "\" width=\"16\" height=\"16\" /></td>";
//                     Html += "<td style=\"width: 180px !important;\" class=\"windowimg_xx_name\">图例</td>";
//                     Html += "<td><div class=\"title_hide\" id=\"t1_hide\" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></td>";
//                     Html += "<td><div class=\"title_Add\" id=\"t1_toggle\" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></td> </tr>";
//                     Html += "</table>";
//                     Html += "</div>";
//                     Html += "<div id=\"ControlLevel\" class=\"list\" >";
//                     Html += "<ul>";

//                     for (var i = 0; i < Settings.legend.length; i++) {

//                         var item = Settings.legend[i];

//                         if (fw.fwObject.FWObjectHelper.hasValue(item.color)) {
//                             if (fw.fwObject.FWObjectHelper.hasValue(item.size)) {
//                                 var height = item.size + 6;
//                                 var cy = height / 2;
//                                 Html += "<li id=\"controlLevel1\" controllevel='1'><svg width='35' height='" + height + "' version='1.1'><circle cx='20' cy='" + cy + "' r='" + item.size / 2 + "' stroke=\"black\" stroke-width=\"1\" fill='" + item.color + "'/></svg>&nbsp;&nbsp;" + item.name + "</li>";
//                             } else {
//                                 Html += "<li id=\"controlLevel1\" controllevel='1'><a href=\"javascript:void(0)\" style=\"text-decoration: none;vertical-align:bottom;line-height:26px;\"><span class=\"Icon\" style=\"background-color:" + item.color + ";border:1px solid #eee;\"></span>&nbsp;&nbsp;" + item.name + "</a></li>";
//                             }
//                             ;
//                         }
//                         else if (fw.fwObject.FWObjectHelper.hasValue(item.image)) {
//                             if (Settings.isOpenClick) {
//                                 Html += "<li id=\"controlLevel1\" controllevel='1' controlname=\"" + item.name + "\"><a href='javascript:void(0);' style=\"text-decoration: none;vertical-align:bottom;line-height:26px;\"><img  src=\"" + item.image + "\" style='width:20px;height:20px;vertical-align:middle;' />&nbsp;&nbsp;" + item.name + "</a></li>";
//                             } else {
//                                 Html += "<li id=\"controlLevel1\" controllevel='1' controlname=\"" + item.name + "\"><img  src=\"" + item.image + "\" style='width:20px;height:20px;vertical-align:middle;' />&nbsp;&nbsp;" + item.name + "</li>";
//                               }; 
//                         }
//                         else {
//                             Html += "<li id=\"controlLevel1\" controllevel='0'  controlname=\"" + item.name + "\" style='width:100%;'><b style='cursor:pointer;'>&nbsp;&nbsp;" + item.name + "</b></li>";
//                         }
//                         ;
//                     }
//                     ;
//                     Html += "</ul>";
//                     Html += "</div>";
//                     Html += "</div>";
//                     LegendControlJQ.empty();
//                     $(Html).appendTo(LegendControlJQ);
//                     ControlData.ControlJQs.LegendControlJQ = LegendControlJQ;
//                     ControlData.ControlJQs.ToggleJQ = $(".title_Add", ControlData.ControlJQs.LegendControlJQ);
//                     ControlData.ControlJQs.HideJQ = $(".title_hide", ControlData.ControlJQs.LegendControlJQ);
//                     //关闭
//                     ControlData.ControlJQs.HideJQ.bind("click", function (e) {
//                         ControlData.ControlJQs.LegendControlJQ.hide();
//                     });
//                     //收缩
//                     ControlData.ControlJQs.ToggleJQ.bind("click", function (e) {
//                         // ControlData.ControlJQs.LegendControlJQ.hide();
//                         var thisJQ = $(this);
//                         if (thisJQ.is(".title_Add")) {
//                             thisJQ.removeClass("title_Add");
//                             thisJQ.addClass("title_Close");
//                         } else {
//                             thisJQ.addClass("title_Add");
//                             thisJQ.removeClass("title_Close");
//                         };
//                         $("#ControlLevel").toggle();
//                     });
//                     if (Settings.isColumn) {
//                         $("#divLegendControl #ControlLevel ul li").css("float", "left");
//                     };
//                     if (fw.fwObject.FWObjectHelper.hasValue(Settings.width)) {
//                         ControlData.ControlJQs.LegendControlJQ.css("width", Settings.width);
//                     }
//                     ;
//                 } else {
//                     ControlData.ControlJQs.IsInit = false;
//                 };

//                 LegendControlJQ.show();

//             });

//         };
//         return SelectorJQ;
//     }
// });
