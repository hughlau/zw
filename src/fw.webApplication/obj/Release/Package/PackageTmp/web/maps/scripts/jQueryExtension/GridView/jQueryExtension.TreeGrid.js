$.TreeGrid = {
    Settings: null
    , GetTreeGridRowSelectedJQ: function (Properties) {
        var Settings = {
            Selector: null
        };
        $.extend(Settings, Properties);

        var JQ;
        if (fw.fwObject.FWObjectHelper.hasValue($(Settings.Selector))) {
            JQ = $(Settings.Selector).find("tr.jQueryExtension_UI_TreeGridView_TbodyBody_TrRowSelected");
        } else {
            JQ = $();
        };
        return JQ;
    }
    , GetSelectedEntity: function (Properties) {
        var Settings = {
            Selector: null
        };
        $.extend(Settings, Properties);
        var Entity = $.TreeGrid.GetTreeGridRowSelectedJQ({ Selector: Settings.Selector }).data("Entity");
        if (Entity == undefined) {
            Entity = null;
        };
        return Entity;
    }
    , ShowChildrenNode: function (_trid, _open) {
        showSubChildren = function (_trid) {
            var isOpen = $("#" + _trid, $.TreeGrid.Settings.Selector).attr("OpenState");
            if (isOpen == "Y") {
                var trs = $.TreeGrid.Settings.Selector.find("tr[pid=" + _trid + "]");
                trs.css("display", "");

                for (var i = 0; i < trs.length; i++) {
                    showSubChildren(trs[i].id);
                }
            }
        };
        if (_open == "N") { //隐藏子节点
            $("#" + _trid, $.TreeGrid.Settings.Selector).find("img[OpenState='Y']").attr("src", $.TreeGrid.Settings.FolderCloseIcon);
            $.TreeGrid.Settings.Selector.find("tr[id^=" + _trid + "_]").css("display", "none");
        } else { //显示子节点
            $("#" + _trid, $.TreeGrid.Settings.Selector).find("img[OpenState='Y']").attr("src", $.TreeGrid.Settings.FolderOpenIcon);
            showSubChildren(_trid);
        };
    }, ResizeWidthHeight: function (Properties) {
        var Settings = {
            Width: null
            , Height: null
            , IsMustResize: false
        };
        $.extend(Settings, Properties);
        if (fw.fwObject.FWObjectHelper.hasValue($.TreeGrid.Settings.Selector)) {
            var SelectorJQ = $.TreeGrid.Settings.Selector;
            SelectorJQ.each(function () {
                var IsResize = false;

                var TreeGridView_ScrollJQ = $("div.jQueryExtension_UI_TreeGridView", $.TreeGrid.Settings.Selector);
                var TreeGridView_DivHeader_ScrollJQ = $("div.jQueryExtension_UI_TreeGridView div.jQueryExtension_UI_TreeGridView_DivHead", $.TreeGrid.Settings.Selector);
                var TreeGridView_DivBody_ScrollJQ = $("div.jQueryExtension_UI_TreeGridView div.jQueryExtension_UI_TreeGridView_DivBody", $.TreeGrid.Settings.Selector);
                var TreeGridView_TableBody_ScrollJQ = $("div.jQueryExtension_UI_TreeGridView div.jQueryExtension_UI_TreeGridView_DivBody table.jQueryExtension_UI_TreeGridView_TableBody", $.TreeGrid.Settings.Selector);

                var divTreeGridViewPosition = jQueryExtension.Position(TreeGridView_ScrollJQ);
                if (!fw.fwObject.FWObjectHelper.hasValue(Settings.Width)) {
                    Settings.Width = fw.clientWidth() - 2 - divTreeGridViewPosition.AbsoluteLeft;
                };
                if (!fw.fwObject.FWObjectHelper.hasValue(Settings.Height)) {
                    Settings.Height = fw.clientHeight() - 2 - divTreeGridViewPosition.AbsoluteTop;
                };
                if (fw.fwObject.FWObjectHelper.hasValue(Settings.Width) && TreeGridView_ScrollJQ.width() != Settings.Width) {
                    SelectorJQ.width(Settings.Width);
                    IsResize = true;
                };
                if (fw.fwObject.FWObjectHelper.hasValue(Settings.Height) && TreeGridView_ScrollJQ.height() != Settings.Height) {
                    IsResize = true;
                };
                if (IsResize || Settings.IsMustResize) {
                    var HeadAndBodyHeight = Settings.Height;
                    var HeadHeight = TreeGridView_DivHeader_ScrollJQ.height() + 2;
                    var BodyHeight = HeadAndBodyHeight - HeadHeight;

                    TreeGridView_DivBody_ScrollJQ.height(HeadAndBodyHeight).css("overflow-x", "auto");
                    jQueryExtension.ResizeWidthHeight({
                        Selector: TreeGridView_DivBody_ScrollJQ
                            , Width: Settings.Width
                            , Height: BodyHeight
                            , IsMustResize: Settings.IsMustResize
                    });
                    if ($.browser.msie) {
                        if (jQueryExtension.ScrollLeft(TreeGridView_DivBody_ScrollJQ) > 0) {
                            //整个控件添加横向滚动条
                            if (TreeGridView_DivBody_ScrollJQ.width() - TreeGridView_TableBody_ScrollJQ.width() >= 17) {
                                TreeGridView_DivBody_ScrollJQ.css("overflow-x", "hidden");
                                jQueryExtension.ScrollLeft(TreeGridView_DivBody_ScrollJQ, 0);
                            } else {
                                TreeGridView_DivBody_ScrollJQ.css("overflow-x", "scroll");
                            };
                            TreeGridView_DivBody_ScrollJQ.scroll();
                        };
                    };
                };
            });
        };
    }
};

$.fn.extend({
    TreeGrid: function (properties) {
        /// <summary>
        /// 树形
        /// Properties属性值：
        //            Width: null,
        //            Height: null,
        //            FolderColumnIndex: "1",                     //文件夹添加列
        //            OpenIndex: "1",                             //默认打开层级
        //            IsOpenAll: 1,                                //默认全部打开
        //            ItemClick: function () { },                 //单选事件
        //            CallBack: function () { },                  //绑定后回调时间
        //            Columns: [],                                //数据源 [{ HeaderText: "",ColumnText:"", HeadAlignment: "center", BodyAlignment: "center", Width: "20"}]
        //            DataSource: []                              //数据源 [{ 属性: "", ChildTreeDataList: [] } ]
        /// </summary>
        /// <param name="Properties">属性</param>
        if (typeof (properties) == "undefined") {
            properties = {};
        };
        var Settings = {
            Selector: null,
            Width: null,
            Height: null,
            FolderColumnIndex: 1,                       //文件夹添加列
            OpenIndex: 1,                               //默认打开层级
            IsOpenAll: 1,                               //默认打开层级
            ItemClick: function () { },                 //单选事件
            CallBack: function () { },                  //绑定后回调时间
            Columns: [],                                //数据源
            DataSource: []                              //数据源
        };
        $.extend(Settings, properties);
        Settings.Selector = this;
        $.TreeGrid.Settings = Settings;
        var JQueryTreeGridJQ = Settings.Selector;
        var ControlJQs = JQueryTreeGridJQ.data("ControlJQs");
        /* 判断控件是否已经加载 开始*/
//        if (!fw.fwObject.FWObjectHelper.hasValue(ControlJQs)) {
            /* 控件初始化 开始*/
            JQueryTreeGridJQ.empty();
            var WindowGuid = fw.guid();
            var Html = "";
            Html += "<div id=\"jQueryExtension_UI_TreeGridView_" + WindowGuid + "\" class=\"jQueryExtension_UI_TreeGridView\">";
            Html += "<div id=\"jQueryExtension_UI_TreeGridView_DivHead_" + WindowGuid + "\" class=\"jQueryExtension_UI_TreeGridView_DivHead\">";
            Html += "<table id=\"jQueryExtension_UI_TreeGridView_TableHead_" + WindowGuid + "\"  cellspacing=0 cellpadding=0 border=\"0\"   class='jQueryExtension_UI_TreeGridView_TableHead'>";
            Html += "<thead class=\"jQueryExtension_UI_TreeGridView_TheadHead\">";
            Html += "<tr id=\"jQueryExtension_UI_TreeGridView_TrHead" + WindowGuid + "\" class=\"jQueryExtension_UI_TreeGridView_TrHead\">";
            Html += "</tr>"
            Html += "</thead>";
            Html += "</table>";
            Html += "</div>";
            Html += "<div id=\"jQueryExtension_UI_TreeGridView_DivBody_" + WindowGuid + "\" class=\"jQueryExtension_UI_TreeGridView_DivBody\" >";
            Html += "<table id=\"jQueryExtension_UI_TreeGridView_Table_" + WindowGuid + "\" cellspacing=0 cellpadding=0 border=\"0\"  class='jQueryExtension_UI_TreeGridView_TableBody'>";
            Html += "<tbody id=\"jQueryExtension_UI_TreeGridView_TableBody_" + WindowGuid + "\" class=\"jQueryExtension_UI_TreeGridView_TableBody\"></tbody>";
            Html += "</table>";
            Html += "</div>";
            Html += "<div id=\"jQueryExtension_UI_TreeGridView_ResizeRange__" + WindowGuid + "\" class=\"jQueryExtension_UI_TreeGridView_DivColumnResizeRange\"></div>";
            Html += "<div id=\"jQueryExtension_UI_TreeGridView__Left__" + WindowGuid + "\" class=\"jQueryExtension_UI_TreeGridView_DivColumnResize_Left\"></div>";
            Html += "<div id=\"jQueryExtension_UI_TreeGridView__Right__" + WindowGuid + "\" class=\"jQueryExtension_UI_TreeGridView_DivColumnResize_Right\"></div>";
            Html += "<div id=\"jQueryExtension_UI_TreeGridView_DivBodyLoading__" + WindowGuid + "\" class=\"jQueryExtension_UI_TreeGridView_DivBodyLoading\"></div>";
            Html += "</div>";
            $(Html).appendTo(JQueryTreeGridJQ).data("Columns", Settings.Columns);

            ControlJQs = {
                IsInit: true
             , WindowGuid: WindowGuid
             , TreeGridViewJQ: $("#jQueryExtension_UI_TreeGridView_" + WindowGuid)
             , TreeGridView_DivHeadJQ: $("#jQueryExtension_UI_TreeGridView_DivHead_" + WindowGuid)
             , TreeGridView_TableHeadJQ: $("#jQueryExtension_UI_TreeGridView_TableHead_" + WindowGuid)
             , TreeGridView_TrHeadJQ: $("#jQueryExtension_UI_TreeGridView_TrHead" + WindowGuid)
             , TreeGridView_DivBodyJQ: $("#jQueryExtension_UI_TreeGridView_DivBody_" + WindowGuid)
             , TreeGridView_TableJQ: $("#jQueryExtension_UI_TreeGridView_Table_" + WindowGuid)
             , TreeGridView_TableBodyJQ: $("#jQueryExtension_UI_TreeGridView_TableBody_" + WindowGuid)
             , TreeGridView_ResizeRangeJQ: $("#jQueryExtension_UI_TreeGridView_ResizeRange__" + WindowGuid)
             , TreeGridView__LeftJQ: $("#jQueryExtension_UI_TreeGridView__Left__" + WindowGuid)
             , TreeGridView__RightJQ: $("#jQueryExtension_UI_TreeGridView__Right__" + WindowGuid)
             , TreeGridView_DivBodyLoadingJQ: $("#jQueryExtension_UI_TreeGridView_DivBodyLoading__" + WindowGuid)
            };
            JQueryTreeGridJQ.data("ControlJQs", ControlJQs);

            /* 控件初始化 结束 */
//        }
        /* 判断控件是否已经加载 结束*/

        /* 控件形状校正 开始*/
        $.TreeGrid.ResizeWidthHeight({
            Width: Settings.Width,
            Height: Settings.Height
        });
        /* 控件形状校正 结束*/

        /* 初始化表头 开始*/
        ControlJQs.TreeGridView_TrHeadJQ.empty();
        for (i = 0; i < Settings.Columns.length; i++) {
            var Column = Settings.Columns[i];
            var TreeGridView_TrHead_ThHeadJQ = $("<th class=\"jQueryExtension_UI_TreeGridView_Column_" + i + " jQueryExtension_UI_TreeGridView_TrHead_ThHead\"></th>").appendTo(ControlJQs.TreeGridView_TrHeadJQ).attr({
                "ColumnText": Column.ColumnText
            });
            var TreeGridView_TrHead_ThHead_DivHeadJQ = $("<div class=\"jQueryExtension_UI_TreeGrid-cell\"></div>").appendTo(TreeGridView_TrHead_ThHeadJQ).css({
                "width": (Column.Width || "0")
                 , "text-align": Column.HeadAlignment
            }).data("Entity", Column);
            !fw.fwObject.FWObjectHelper.hasValue(Column.HeaderText) ? $("<a>&nbsp;</a>").appendTo(TreeGridView_TrHead_ThHead_DivHeadJQ) : $("<a>" + Column.HeaderText + "</a>").appendTo(TreeGridView_TrHead_ThHead_DivHeadJQ);
        }
        /* 初始化表头 结束*/

        /* 加载层开启 开始*/
        if ($.browser.msie && $.browser.version == "6.0") {
            ControlJQs.TreeGridView_DivBodyLoadingJQ.css("background-color", "transparent").show();
        } else {
            ControlJQs.TreeGridView_DivBodyLoadingJQ.css("background-color", "Black").css("opacity", 0.2).show();
        };
        /* 加载层开启 结束*/

        /* 加载数据源 开始*/
        var rownum = 0;
        var displayrownum = 0;
        GetBodyData = function (_rows, _cols, _level, _pid) {
            var folderColumnIndex = Settings.FolderColumnIndex;
            var expandLayer = Settings.OpenIndex;
            for (var i = 0; i < _rows.length; i++) {
                var id = _pid + "_" + i;
                var row = _rows[i];
                var IsCanOpen = "N";
                var OpenState = "N";
                var IsDisplay = false;
                var tdclassName = (rownum == 0 ? " jQueryExtension_UI_TreeGridView_TbodyBody_TrRowSelected" : "");
                if (row && row.ChildTreeDataList && row.ChildTreeDataList.length > 0) {
                    IsCanOpen = "Y";
                };
                if (Settings.IsOpenAll == 1 || _level <= expandLayer) {
                    OpenState = "Y";
                };
                if (Settings.IsOpenAll == 1 || _level <= expandLayer + 1) {
                    IsDisplay = true;
                };
                var TreeGridView__TbodyBody_TrRowJQ = $("<tr id=\"TR" + id + "\" pid=\"" + ((_pid == "") ? "" : ("TR" + _pid)) + "\" IsCanOpen=\"" + IsCanOpen + "\" OpenState=\"" + OpenState + "\" rowIndex=\"" + rownum++ + "\" class=\"jQueryExtension_UI_TreeGridVieww_TbodyBody_TrRow jQueryExtension_UI_TreeGridView_TbodyBody_TrRowAlternating " + tdclassName + "\" ></tr>").appendTo(ControlJQs.TreeGridView_TableBodyJQ).data("Entity", row);

                for (var j = 0; j < _cols.length; j++) {
                    var col = _cols[j];
                    var TreeGridView__TbodyBody_TrRow_TdJQ = $("<td class=\"jQueryExtension_UI_TreeGridView_Column_" + j + " jQueryExtension_UI_TreeGridView_TbodyBody_TrRow_TdRow\" ></td>").appendTo(TreeGridView__TbodyBody_TrRowJQ).bind("click", function () {
                        $("div.jQueryExtension_UI_TreeGridView_DivBody table.jQueryExtension_UI_TreeGridView_TableBody tr.jQueryExtension_UI_TreeGridView_TbodyBody_TrRowSelected", JQueryTreeGridJQ).removeClass("jQueryExtension_UI_TreeGridView_TbodyBody_TrRowSelected");
                        $(this).parent().addClass("jQueryExtension_UI_TreeGridView_TbodyBody_TrRowSelected");
                        if ($.isFunction(Settings.ItemClick)) {
                            Settings.ItemClick();
                        };
                    });
                    var TreeGridView__TbodyBody_TrRow_Td_DivJQ = $("<div class=\"jQueryExtension_UI_TreeGrid-cell\"></div>").appendTo(TreeGridView__TbodyBody_TrRow_TdJQ).css({
                        "width": (col.Width || "0")
                        , "text-align": col.BodyAlignment
                    }).data("Entity", col);
                    //缩进
                    if (j == folderColumnIndex) {
                        $("<span class=\"jQueryExtension_UI_Tree-indent \" ></span>").appendTo(TreeGridView__TbodyBody_TrRow_Td_DivJQ);
                        for (var indent = 0; indent < _level; indent++) {
                            $("<span class=\"jQueryExtension_UI_Tree-indent \" ></span>").appendTo(TreeGridView__TbodyBody_TrRow_Td_DivJQ);
                        };
                        //可以打开
                        if (IsCanOpen == "Y") {
                            $("<span IsCanOpen=\"" + IsCanOpen + "\"  trid=\"" + "TR" + id + "\" class=\"jQueryExtension_UI_Tree-hit " + (OpenState == "Y" ? "jQueryExtension_UI_Tree-expanded" : "jQueryExtension_UI_Tree-collapsed ") + "\" ></span>").appendTo(TreeGridView__TbodyBody_TrRow_Td_DivJQ);
                            $("<span class=\" jQueryExtension_UI_Tree-folder " + (OpenState == "Y" ? "jQueryExtension_UI_Tree-folder-open" : "jQueryExtension_UI_Tree-folder ") + "\" ></span>").appendTo(TreeGridView__TbodyBody_TrRow_Td_DivJQ);

                        } else {
                            $("<span IsCanOpen=\"" + IsCanOpen + "\" class=\"jQueryExtension_UI_Tree-indent \" ></span>").appendTo(TreeGridView__TbodyBody_TrRow_Td_DivJQ);
                            $("<span IsCanOpen=\"" + IsCanOpen + "\" class=\"jQueryExtension_UI_Tree-file\" ></span>").appendTo(TreeGridView__TbodyBody_TrRow_Td_DivJQ);
                        }
                    };

                    $("<span class=\"jQueryExtension_UI_Tree-title\">" + (row[col.ColumnText] || "") + "</span>").appendTo(TreeGridView__TbodyBody_TrRow_Td_DivJQ).attr({
                        "title": (row[col.ColumnText] || "")
                    });
                }

                IsDisplay ? TreeGridView__TbodyBody_TrRowJQ.show() : TreeGridView__TbodyBody_TrRowJQ.hide();
                //递归显示下级数据
                if (row.ChildTreeDataList && row.ChildTreeDataList.length > 0) {
                    GetBodyData(row.ChildTreeDataList, _cols, _level + 1, id);
                }
            }
        };
        GetBodyData(Settings.DataSource, Settings.Columns, 0, "")
        /* 加载数据源 结束*/


        /* 事件绑定 展开/收缩 开始*/
        JQueryTreeGridJQ.find("span[IsCanOpen='Y']").bind("click", function () {
            var trid = $(this).attr("trid");
            var JQ = $("#" + trid, JQueryTreeGridJQ);
            var isOpen = JQ.attr("OpenState");
            if (isOpen == "Y") {
                $(this).removeClass("jQueryExtension_UI_Tree-expanded").addClass("jQueryExtension_UI_Tree-collapsed");
                $(this).next().removeClass("jQueryExtension_UI_Tree-folder-open");
                isOpen = "N";
            } else {
                $(this).removeClass("jQueryExtension_UI_Tree-collapsed").addClass("jQueryExtension_UI_Tree-expanded");
                $(this).next().addClass("jQueryExtension_UI_Tree-folder-open");
                isOpen = "Y";
            };
            JQ.attr("OpenState", isOpen);
            $("div.jQueryExtension_UI_TreeGridView_DivBody table.jQueryExtension_UI_TreeGridView_TableBody tr.jQueryExtension_UI_TreeGridView_TbodyBody_TrRowSelected", JQueryTreeGridJQ).removeClass("jQueryExtension_UI_TreeGridView_TbodyBody_TrRowSelected");
            JQ.addClass("jQueryExtension_UI_TreeGridView_TbodyBody_TrRowSelected");
            $.TreeGrid.ShowChildrenNode(trid, isOpen);
            if (fw.fwObject.FWObjectHelper.hasValue(Settings.Height)) {
                $.TreeGrid.ResizeWidthHeight({
                    Width: Settings.Width,
                    Height: Settings.Height
                });
            };
        });
        /* 事件绑定 展开/收缩 结束*/

        /* 事件绑定 鼠标滑过 开始*/
        JQueryTreeGridJQ.find("div.jQueryExtension_UI_TreeGridView_DivBody table.jQueryExtension_UI_TreeGridView_TableBody tr").each(function () {
            $(this).hover(
            function () {
                $(this).addClass("jQueryExtension_UI_GridView_TreeGridView_TrRowHover");
            }
            , function () {
                $(this).removeClass("jQueryExtension_UI_GridView_TreeGridView_TrRowHover");
            }
        );
        });
        /* 事件绑定 鼠标滑过 结束*/

        /* 事件绑定 横向滚动 Head Body联动 开始*/
        $("div.jQueryExtension_UI_TreeGridView div.jQueryExtension_UI_TreeGridView_DivBody", Settings.Selector).bind("scroll", function () {
            var ScrollLeft = jQueryExtension.ScrollLeft($(this));
            jQueryExtension.ScrollLeft($("div.jQueryExtension_UI_TreeGridView div.jQueryExtension_UI_TreeGridView_DivHead", Settings.Selector), ScrollLeft);
        });
        /* 事件绑定 横向滚动 Head Body联动 结束*/

        /* 事件绑定 回调函数 开始*/
        if ($.isFunction(Settings.CallBack)) {
            Settings.CallBack();
        };
        /* 事件绑定 回调函数 结束*/

        /* 事件绑定 加载层关闭 开始*/
        ControlJQs.TreeGridView_DivBodyLoadingJQ.hide();
        /* 事件绑定 加载层关闭 结束*/
    }
});