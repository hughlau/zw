$.TreeView = {
    Flex: function (ico, father, Settings, type) {
        /// <summary>
        /// 缩放操作 
        /// </summary>
        /// <param name="Object">鼠标点击的对象</param>
        /// <param name="ParentObject">鼠标点击对象的父级对象</param>
        /// <param name="Settings">$().Menu(Settings)的属性</param>
        /// <param name="type">状态 隐藏（hide） 显示（show） 反操作（） </param>
        var list = $('>ul,>ol', father);
        var ln = ico.filter('.spanJQueryTreeViewNone').parent();
        var ic = ico.not('.spanJQueryTreeViewNone');
        var fl = $('>.divJQueryTreeViewFolder', father);
        if (type == 'hide') {
            ln.addClass('liJQueryTreeViewLastNodeClose');
            ic.addClass('spanJQueryTreeViewClose');
            list.hide(Settings.Speed);
        }
        else if (type == 'show') {
            ln.removeClass('liJQueryTreeViewLastNodeClose');
            ic.removeClass('spanJQueryTreeViewClose');
            list.show(Settings.Speed);
        }
        else {
            ln.toggleClass('liJQueryTreeViewLastNodeClose');
            ic.toggleClass('spanJQueryTreeViewClose');
            list.toggle(Settings.Speed);
        }
    }
    , GetDivAttributeValue: function (Settings, AttributeName) {
        return $("div.Selected", Settings.Selector).attr(AttributeName);
    }
};

$.fn.extend({
    TreeView: function (properties) {
        /// <summary>
        /// 树形
        /// Properties属性值：
        ///                   IsFlash: false                          //是否以flash效果展示
        ///                   MenuSelector: null                      //树形所在的菜单选择器
        ///                   Speed: 500                              //动画时间
        ///                   IsCollapse: true                        //是否允许折叠 
        ///                   NodeEvent: true                         //响应分枝整行的事件
        ///                   NodeUnique: true                        //同级节点下是否互斥
        ///                   IsCloseAll: true                        //是否树形默认关闭所有
        ///                   OpenIndex: "1"                          //默认打开的菜单索引，支持多菜单打开，格式（1,2,3）
        ///                   IsShowFolder: true                      //文件夹图标支持
        ///                   IsShowFile: true                        //文件图标支持
        ///                   IsLine: true 		                      //是否有连接线
        ///                   SelectType: null                        //选种类型 All所有  Child只有子节点  null不支持选中
        ///                   CallBack: function() { }                //回调事件  
        /// </summary>
        /// <param name="Properties">属性</param>
        if (typeof (properties) == "undefined") {
            properties = {};
        };
        var Settings = {
            IsFlash: jQueryExtension.IsFlash()
            , MenuSelector: null
            , Speed: 500
            , IsCollapse: true
            , NodeEvent: true
            , NodeUnique: true
            , IsCloseAll: true
            , OpenIndex: "1"
            , IsShowFolder: true
            , IsShowFile: true
            , IsLine: true
            , SelectType: null
            , CallBack: function () { }
        };
        $.extend(Settings, properties);

        if (!Settings.IsFlash) {
            Settings.Speed = 0;
        };

        var JQueryTreeViewJQ = this;

        $("*[class]", JQueryTreeViewJQ).removeAttr("class");
        //        .removeClass("liLastNode")
        //        .removeClass("NoLineJQueryTreeView")
        //        .removeClass("divJQueryTreeViewList")
        //        .removeClass("divJQueryTreeViewFolder")
        //        .removeClass("divJQueryTreeViewFile")
        //        .removeClass("liJQueryTreeViewNode")
        //        .removeClass("spanJQueryTreeViewClose")
        //        .removeClass("spanJQueryTreeViewNone")
        //        .removeClass("liJQueryTreeViewLastNodeClose")
        //        .removeClass("spanJQueryTreeViewDefault");

        JQueryTreeViewJQ.addClass('JQueryTreeView');

        //设置结尾的分枝
        $('li:last-child', JQueryTreeViewJQ).addClass('liLastNode');

        //是否启用连节线
        if (!Settings.IsLine) {
            JQueryTreeViewJQ.addClass('NoLineJQueryTreeView');
        }

        //设置菜单图片
        $('li>div', JQueryTreeViewJQ).each(function () {
            var URL = $(this).attr("src");
            if (URL != undefined) {
                $(this).css({
                    "padding-left": "16px"
                    , "background-image": "url(" + URL + ")"
                });
            };
        });

        //取节点
        var Nodes = $('li:has(ul,ol)', JQueryTreeViewJQ);

        if (Settings.IsCloseAll) {
            //是否树形默认关闭所有
            $(">div:first", Nodes).next().hide();
            Settings.OpenIndex = $.trim(Settings.OpenIndex);
            if (Settings.OpenIndex.length > 0) {
                var Indexs = Settings.OpenIndex.split(",");
                for (var i = 0; i < Indexs.length; i++) {
                    $(">li:eq(" + parseInt(Indexs[i] - 1) + ")>div:first", JQueryTreeViewJQ).next().show();
                };
            };
        };


        //获得没有子节点的节点的div，即 最底层节点
        var divJQueryTreeViewListJQ = $('li:not(:has(ul,ol))>:first-child', JQueryTreeViewJQ);
        if (Settings.MenuSelector == null) {
            Settings.MenuSelector = JQueryTreeViewJQ;
        };
        //添加最底层节点点击事件
        switch (Settings.SelectType) {
            case "All":
                $('li>:first-child', JQueryTreeViewJQ).addClass('divJQueryTreeViewList').bind("click", function () {
                    $(".Selected", Settings.MenuSelector).removeClass("Selected");
                    $(this).addClass('Selected');
                });
                break;
            case "Child":
                divJQueryTreeViewListJQ.addClass('divJQueryTreeViewList').bind("click", function () {
                    $(".Selected", Settings.MenuSelector).removeClass("Selected");
                    $(this).addClass('Selected');
                });
                break;
        };

        //默认文件夹图标支持
        if (Settings.IsShowFolder) {
            $('>:first-child', Nodes).addClass('divJQueryTreeViewFolder');
        };

        //默认文件图标支持
        if (Settings.IsShowFile) {
            divJQueryTreeViewListJQ.addClass('divJQueryTreeViewFile');
        };

        if (Settings.IsCollapse) {
            //设置带图标的li的连节线
            Nodes.addClass('liJQueryTreeViewNode').filter(':last-child').attr('class', 'liJQueryTreeViewLastNodeDefault');

            //在节点中加入默认加减
            Nodes.css('cursor', 'pointer').prepend('<span class="spanJQueryTreeViewDefault"></span>').find('>ul,>ol').filter(':hidden').parent().find('>.spanJQueryTreeViewDefault').addClass('spanJQueryTreeViewClose');
            $('>.spanJQueryTreeViewDefault', Nodes.filter(':last-child')).addClass('spanJQueryTreeViewNone');
            $('>ul,>ol', Nodes.filter(':last-child')).filter(':hidden').parent().addClass('liJQueryTreeViewLastNodeClose');

            //绑定标题行的点击事件
            if (Settings.NodeEvent) {
                Nodes.find('>:nth-child(2)').click(function () {
                    //                    alert("dsds");
                    $(this).parent().find('>.spanJQueryTreeViewDefault').trigger('click');
                });
            };

            //绑定默认事件
            $('>.spanJQueryTreeViewDefault', Nodes).click(function () {
                var f = $(this).parent(); //当前节点
                if (Settings.NodeUnique && $('>ul,>ol', f).is(':hidden')) {	//同级互斥
                    var ff = $('>li:has(ul,ol)', f.parent()).not(f); //排除当前节点的同级节点集合
                    $.TreeView.Flex($('>:first-child', ff), ff, Settings, 'hide');
                }
                $.TreeView.Flex($(this), f, Settings);
            });
        };

        if ($.isFunction(Settings.CallBack)) {
            Settings.CallBack();
        };

    }
});