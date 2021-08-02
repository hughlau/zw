//2017年10月9日 王洋改
//加载菜单
var  MenuTops ={
        MinScreenWidth:1000    //小屏幕宽度
        , MiddleScreenWidth:1500 //中屏幕宽度
        , BodyMenuContentWidth:202 ////设置BodyMenuContentWidth初始宽度       
        , MiddleSelectorJQLeft:610 //设置一级菜单在中高等宽度时的左边位置
        , SmallSelectorJQLeft:510 //设置一级菜单在低等宽度时的左边位置
        , MiddleSelectorJQRight:60//设置一级菜单在中高等宽度时的右边位置
        , SmallSelectorJQRight:40//设置一级菜单在低等宽度时的右边位置
        , isLeaveMenuFirst:true

    }
function LoadMenu() {
    //MenuListBind({ Selector: $("#divMenuSystem"), DataSelector: $("#divMenuSystem_1"), DataSource: MenuData, ModuleSelector: divModuleJQ, TopHeight: divLogoJQ.height(), BottomHeight: divFootJQ.height(), API: API });
    //动态菜单
    
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall",
        serviceName: "sysBasicManage",
        methodName: "getUserMenuBasicManage",
        data: {
            ticket: $.page.ticket,
            menuTypeCode: fw.m.sysManage.data.FWMenuTypeCode.WebMainMenu,
            isTreeData: 1
        },
        success: function (resultData) {

            if (resultData != null && resultData.status == 1 && resultData.data != null) {

                ModuleListBind({ Selector: divModuleListJQ, DataSelector: divModuleList2JQ, DataSource: resultData.data, ModuleSelector: divModuleJQ, TopHeight: divLogoJQ.height(), BottomHeight: divFootJQ.height(), API: API });

            };
        }
    }));
};

function ModuleListBind(Properties) {
    if (typeof (Properties) == "undefined") {
        Properties = {};
    };
    var Settings = {
        Selector: null
        , DataSelector: null
        , DataSource: []                                    //各个Item的属性
        , TopHeight: 80
        , BottomHeight: 60
        , ModuleSelector: null
        , API: null
    };
    
    $.extend(Settings, Properties);

    //一级菜单元素
    var SelectorJQ = $(Settings.Selector);
    //二级菜单元素
    var DataSelectorJQ = $(Settings.DataSelector);
    var DataSource = Settings.DataSource;
    var SelectBlockJQ = null;
    var SelectDataBlockJQ = null;
    var isLeaveMenu=true;
    var that_a=''
    if (DataSource != null && DataSource.length > 0) {

        //SelectorJQ.hide();
        // DataSelectorJQ.hide();
        SelectorJQ.empty();
        DataSelectorJQ.empty();
        var html = "";

        html += "<div id=\"divBodyMenu\" class=\"BodyMenu\" style='overflow-x:hidden;'>";
        for (var i = 0; i < DataSource.length; i++) {
            var Entity = DataSource[i];
            html += "<div class=\"BodyContentHeight\">";
            if (Entity) {               
                html += "<div class=\"BodyContentBlock\" id=\"BodyContentBlock" + Entity.mMenuCode + "\" >";
                // html += "   <img class=\"BodyContentImageLeft\" src=\"" + API.GetAbsoluteUrl(Entity.mIconUrl, Settings.API.webSiteRootUrl) + "\" />";
                html += "   <div class=\"BodyContentImageFontLeft\">";
                html += "<span name='" + Entity.mTitle + "'>" + Entity.mTitle + "</span>";
                html += "   </div>";
                html += "</div>";
            }                   
            html += "</div>";
        };
        html += "</div>";
        //判断屏幕尺寸在1500px以上时 
        if($(window).width()>=MenuTops.MiddleScreenWidth){
           // $菜单所占用的宽度固定900px    .children()$(window).width()-MenuTops.MiddleSelectorJQLeft-MenuTops.MiddleSelectorJQRight
           SelectorJQ.width('900px') 
       }else if($(window).width()>=MenuTops.MinScreenWidth){
        SelectorJQ.css("left",MenuTops.SmallSelectorJQLeft)
        DataSelectorJQ.css('margin-left',SelectorJQ.css("left"))
        SelectorJQ.width($(window).width()-parseFloat(SelectorJQ.css("left"))-MenuTops.SmallSelectorJQRight) 
        $('#divQuit').css('right',"5px")
        $('#divDataSynchronizationStatus').css('right',"0px")

       }
       $(html).appendTo(SelectorJQ);
       $('#divMenuSystem_1').show() 
        $(".BodyContentBlock", SelectorJQ).each(function (index,e) {

            var thisJQ = $(this);
            thisJQ.data("index1", index);

            thisJQ.parent().width(thisJQ.parent().parent().width()/$('.BodyContentHeight').length)
            var id = thisJQ.attr("id").substring(16);
            for (var i = 0; i < DataSource.length; i++) {
                var Entity = DataSource[i];
                if (id == Entity.mMenuCode) {
                    thisJQ.data("Entity", Entity);
                    this.index=index;

                    
                    //王洋部分修改
                    
                    thisJQ.on("mouseenter", function (e) {
                        if($(window).width()<MenuTops.MiddleScreenWidth){
        
                         SelectorJQ.find('.BodyContentImageFontLeft').children().width('80px');
                         SelectorJQ.css("left",MenuTops.SmallSelectorJQLeft)
                         DataSelectorJQ.css('margin-left',SelectorJQ.css("left"))
                         SelectorJQ.width($(window).width()-parseFloat(SelectorJQ.css("left"))-MenuTops.SmallSelectorJQRight) 
                        }

                        e.stopPropagation()
                        //加背景颜色 其他的去掉背景颜色
                        $(this).find($('span')).addClass('BodyContentCheck').parent().parent().parent().siblings().find($('span')).removeClass('BodyContentCheck')
                        
                        
                        var thisWidth=thisJQ.width()                        
                        var leftMinCha=(MenuTops.BodyMenuContentWidth-($(".BodyContentHeight").width()))/2

                        //设置二级菜单位置 相对于1级菜单$('.BodyMenuContent').width()
                        DataSelectorJQ.css("left",thisWidth*thisJQ.data("index1")-leftMinCha)
                        
                        SelectBlockJQ = thisJQ;
                        var Entity = thisJQ.data("Entity");

                        Entity.OnFocusIn = jExtension.ToFunction(Entity.mOnFocusInScriptCode);
                        Entity.OnFocusOut = jExtension.ToFunction(Entity.mOnFocusOutScriptCode);

                        if ($.isFunction(Entity.OnFocusOut)) {
                            Entity.OnFocusOut({ currentTarget: this });

                        };

                        //菜单进入触发器
                        if ($.isFunction(Entity.OnFocusIn)) {
                            console.log($.isFunction(Entity.OnFocusIn))
                            Entity.OnFocusIn(e);
                            //API.LogoShow();
                        } else if (fw.fwObject.FWObjectHelper.hasValue(Entity.mUrl)) {
                            console.log('走了elseif',$.isFunction(Entity.OnFocusIn))
                            var Data = jExtension.JsonStringToJson(Entity.mUrlParamsJson, {});
                            Data.Ticket = $.page.ticket;
                        };

                        if (Entity.mFWMenuList != null && Entity.mFWMenuList.length > 0) {

                            var divMenuJQ = DataSelectorJQ;
                            divMenuJQ.empty();
                            var childHtml = "";

                            childHtml += "  <div class=\"BodyMenuContent\">";
                            childHtml +="<span class=\"BodyMenuContentTriangle\"></span>"
                            childHtml += "      <ul>";
                            for (var i = 0; i < Entity.mFWMenuList.length; i++) {
                                var ChileEntity = Entity.mFWMenuList[i];
                                //ChileEntity
                                childHtml += "      <li class=\"BodyMenuContentLi\" id =\"li" + ChileEntity.mMenuCode + "\">";
                                childHtml += "          <div class=\"BodyMenuContentLiDiv\">";
                                childHtml += "              <div class=\"BodyMenuContentLiDesignationDtrip\">";
                                childHtml += "              </div>";
                                childHtml += "              <div class=\"BodyMenuContentLiIcon\">";
                                childHtml += "              </div>";
                                childHtml += "  <span name='" + ChileEntity.mMenuName + "'>" + ChileEntity.mMenuName + "</span>";
                               // childHtml += "              " + ChileEntity.mMenuName;
                                // childHtml += "          </div>";
                                childHtml += "      </li>";
                            };
                            childHtml += "  </div>";
                            childHtml += "</div>";
                            $(childHtml).appendTo(divMenuJQ);
                            DataSelectorJQ.find($('.BodyMenuContentLi:odd')).css({'background-color':"#f9fafc"}) 

                            // $('#divMenuSystem_1').width( $('.BodyContentHeight').width())
                            DataSelectorJQ.show()
                            $("li", divMenuJQ).each(function () {
                                var thisJQ = $(this);
                                var thisID = thisJQ.attr("id").substring(2);
                                for (var i = 0; i < Entity.mFWMenuList.length; i++) {
                                    Entity.mFWMenuList[i].OnFocusIn = jExtension.ToFunction(Entity.mFWMenuList[i].mOnFocusInScriptCode);
                                    Entity.mFWMenuList[i].OnFocusOut = jExtension.ToFunction(Entity.mFWMenuList[i].mOnFocusOutScriptCode);
                                    if (thisID == Entity.mFWMenuList[i].mMenuCode) {

                                        var ChileEntity = Entity.mFWMenuList[i];
                                        thisJQ.data("Entity", ChileEntity);
                                        thisJQ.on("mouseenter", function (ev) {

                                            //防止事件重复触发
                                            var ev=ev||window.event;
                                            if(!isMouseLeaveOrEnter(ev,this)){
                                                return false;
                                            }
                                            //Settings.API.ModuleSlideToggle();
                                            var thisJQ = $(this);
                                            if ($("#divMenuLeft").length > 0) {
                                                //by MHQ
                                                //默认菜单收缩
                                                //$("#divMenuLeft").click();  
                                            };
                                            if (SelectDataBlockJQ != null && SelectDataBlockJQ.length > 0) {
                                                // 汪洋改 注释 2017年10月9日 
                                                // var thisEntity = SelectDataBlockJQ.data("Entity");                                              
                                                // if (thisEntity != null && $.isFunction(thisEntity.OnFocusOut)) {
                                                //     thisEntity.OnFocusOut({ currentTarget: this });
                                                // };
                                                $(">div", SelectDataBlockJQ).removeClass("BodyMenuContentLiHover").addClass("BodyMenuContentLiDiv");
                                            };
                                            isLeaveMenu=true;
                                            // console.log(this)
                                            SelectDataBlockJQ = thisJQ;
                                            var ChileEntity = thisJQ.data("Entity");
                                            $(">div", $(this)).removeClass("BodyMenuContentLiDiv").addClass("BodyMenuContentLiHover");                                            
                                            //点击进入触发菜单
                                            that_a=this
                                            $(this).on('click',function(e){
                                                if(this==that_a){
                                                    e.stopPropagation()
                                                    if ($.isFunction(ChileEntity.OnFocusIn)) {
                                                        isLeaveMenu=false;
                                                        ChileEntity.OnFocusIn(e);
                                                        //打开新窗口默认的定位高度为10px
                                                        $('body .divPopUpFrameBox').css("top",'10px');
                                                    } else if (fw.fwObject.FWObjectHelper.hasValue(ChileEntity.mUrl)) {
                                                        var Data = jExtension.JsonStringToJson(ChileEntity.mUrlParamsJson, {});
                                                        Data.Ticket = $.page.ticket;
                                                        var OpenSettings = {
                                                            mTitle: ChileEntity.mTitle
                                                            , Url: API.GetAbsoluteUrl(ChileEntity.mUrl, API.webSiteRootUrl)
                                                            , Data: Data
                                                        };

                                                        if (fw.fwObject.FWObjectHelper.hasValue(ChileEntity.mLayoutHorizontalAlignment)) {
                                                            OpenSettings.HorizontalAlignment = ChileEntity.mLayoutHorizontalAlignment;
                                                        };
                                                        if (fw.fwObject.FWObjectHelper.hasValue(ChileEntity.mLayoutLeft)) {
                                                            OpenSettings.Left = ChileEntity.mLayoutLeft;
                                                        };
                                                        if (fw.fwObject.FWObjectHelper.hasValue(ChileEntity.mLayoutRight)) {
                                                            OpenSettings.Right = ChileEntity.mLayoutRight;
                                                        };
                                                        if (fw.fwObject.FWObjectHelper.hasValue(ChileEntity.mLayoutWidth)) {
                                                            OpenSettings.Width = ChileEntity.mLayoutWidth;
                                                        };
                                                        if (fw.fwObject.FWObjectHelper.hasValue(ChileEntity.mLayoutVerticalAlignment)) {
                                                            OpenSettings.VerticalAlignment = ChileEntity.mLayoutVerticalAlignment;
                                                        };
                                                        if (fw.fwObject.FWObjectHelper.hasValue(ChileEntity.mLayoutTop)) {
                                                            OpenSettings.Top = ChileEntity.mLayoutTop;
                                                        };
                                                        if (fw.fwObject.FWObjectHelper.hasValue(ChileEntity.mLayoutBottom)) {
                                                            OpenSettings.Bottom = ChileEntity.mLayoutBottom;
                                                        };
                                                        if (fw.fwObject.FWObjectHelper.hasValue(ChileEntity.mLayoutHeight)) {
                                                            OpenSettings.Height = ChileEntity.mLayoutHeight;
                                                        };
                                                        if (fw.fwObject.FWObjectHelper.hasValue(OpenSettings.Width)) {
                                                            if (OpenSettings.Width > jQueryExtension.ScreenWidth()) {
                                                                OpenSettings.Width = jQueryExtension.ScreenWidth() - 22;
                                                            };
                                                        };
                                                        if (fw.fwObject.FWObjectHelper.hasValue(OpenSettings.Height)) {
                                                            if (OpenSettings.Height > jQueryExtension.ScreenHeight()) {
                                                                OpenSettings.Height = jQueryExtension.ScreenHeight() - 22;
                                                            };
                                                        };
                                                        if (ChileEntity.mOpenTypeCode == "10") {
                                                            isLeaveMenu=false;
                                                            API.Open(OpenSettings);
                                                            //打开新窗口默认的定位高度为80px
                                                            $('body .mini-window-drag ').css('top',"80px")
                                                        } else {
                                                            jQueryExtension.Window.Open(OpenSettings);
                                                        };
                                                    };
                                                }
                                                that_a="";//将中间条件that_a 置为空
                                            })
                                        });
                                    };
                                };
                            });
                        };
                    });
                    DataSelectorJQ.on("mouseover", function () {
                        MenuTops.isLeaveMenuFirst=false;
                        DataSelectorJQ.show();
                    }); 
                    //鼠标离开二级时 消失
                    DataSelectorJQ.on("mouseleave", function () {
                        if(isLeaveMenu){
                        DataSelectorJQ.hide();
                        thisJQ.find($('span')).removeClass('BodyContentCheck') 
                        };
                    }); 
                };
            };
            //点击时显示隐藏二级目录
            thisJQ.on('click',function(){
                 DataSelectorJQ.hide();
                thisJQ.find($('span')).toggleClass('BodyContentCheck')
                if(thisJQ.find($('span')).hasClass('BodyContentCheck')){
                    thisJQ.mouseenter();
                };    
            })
            $('#SystemTitle,#divQuit').on('mouseenter',function(){
                   DataSelectorJQ.mouseleave()   
            })
        });
    };
};
// 防止onmouse函数重复触发
function isMouseLeaveOrEnter(e, handler) {    
  var reltg=e.relatedTarget?e.relatedTarget:e.type=='mouseout'?e.toElement:e.fromElement;    
  while (reltg && reltg != handler){
     reltg = reltg.parentNode; 
 }       
 return (reltg != handler);    
} 
