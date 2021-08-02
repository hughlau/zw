
//页面加载
$.page.pageLoad = function () {

    var treeRootData = [{ code: "sln", pCode: "-fw-", name: "解决方案", "folder": 1, "isLeaf": false, "expanded": true, "asyncLoad": false}];
    $.page.idM.tree1.loadData(treeRootData);
    $.page.idM.tree1.collapseNode($.page.idM.tree1.getChildNodes($.page.idM.tree1.getRootNode())[0]);
};


function onNodeSelect(e) {
    var node = e.node;
    var isLeaf = e.isLeaf;
    if (isLeaf) {
        showTab(node);
    };
};

function showTab(node) {
    var id = "tab$" + node.mMetadataToken;
    var tab = $.page.idM.mainTabs.getTab(id);
    if (!tab) {
        tab = {};
        tab._nodeid = node._id;
        tab.name = id;
        tab.title = node.name;
        tab.showCloseButton = true;

        var data = {
            ticket: $.page.ticket
        };
        //这里拼接了url，实际项目，应该从后台直接获得完整的url地址
        if (node.mObjType != "") {
            data.mMetadataToken = node.mMetadataToken;
            node.url = $.page.webSiteRootUrl + "web/sysManage/fwType.htm"
        }
        tab.url = fw.fwUrl.FWUrlHelper.addParams(node.url, data);

        $.page.idM.mainTabs.addTab(tab);
    }
    $.page.idM.mainTabs.activeTab(tab);
};


//树右键菜单打开之前
function onBeforeOpen(e) {
    var selectedNode = $.page.idM.tree1.getSelectedNode();
    if (fw.fwObject.FWObjectHelper.hasValue(selectedNode)) {
        var treeMenuM = e.sender;
        var openItem = mini.getbyName("open", treeMenuM);
        openItem.hide();
//        var addItem = mini.getbyName("add", treeMenuM);
//        addItem.hide();
        var addModuleItem = mini.getbyName("addModule", treeMenuM);
        addModuleItem.hide();
        var addProjectItem = mini.getbyName("addProject", treeMenuM);
        addProjectItem.hide();
        var addFolderItem = mini.getbyName("addFolder", treeMenuM);
        addFolderItem.hide();
        var addTableItem = mini.getbyName("addTable", treeMenuM);
        addTableItem.hide();
        var addClassItem = mini.getbyName("addClass", treeMenuM);
        addClassItem.hide();
        var addDefaultFolderItem = mini.getbyName("addDefaultFolder", treeMenuM);
        addDefaultFolderItem.hide();
        var cutItem = mini.getbyName("cut", treeMenuM);
        cutItem.hide();
        var copyItem = mini.getbyName("copy", treeMenuM);
        copyItem.hide();
        var deleteItem = mini.getbyName("delete", treeMenuM);
        deleteItem.hide();
        var editItem = mini.getbyName("edit", treeMenuM);
        editItem.hide();

        var selectedNode = $.page.idM.tree1.getSelectedNode();
        if (selectedNode._level == 0) {
            //根目录
            openItem.show();
            //            addItem.show();
            addModuleItem.show();
            addProjectItem.show();
        } else if (selectedNode._level == 1) {
            //根目录
            openItem.show();
            //            addItem.show();
            addFolderItem.show();
            addClassItem.show();
            addDefaultFolderItem.show();
            //editItem.show();
        } else if (selectedNode._level > 1) {
            //根目录
            openItem.show();
            if (!$.page.idM.tree1.isLeaf(selectedNode)) {
                //                addItem.show();
                addFolderItem.show();
                if (selectedNode.name.toLowerCase().indexOf("fw.m.") == 0 && selectedNode.name.toLowerCase().lastIndexOf(".data.entity") == (selectedNode.name.length - 12)) {
                    addTableItem.show();
                };
                addClassItem.show();
                var childNodes = $.page.idM.tree1.getChildNodes(selectedNode);
                if (childNodes.length < 1) {
                    editItem.show();
                };
            } else {
//                addItem.hide();
                editItem.show();
            };
        };
    } else {
        e.cancel = true;
        return;
    };

    //    var menu = e.sender;
    //    var ff = $.page.treeMenuM;

    //    var node = $.page.idM.tree1.getSelectedNode();
    //    if (!node) {
    //        e.cancel = true;
    //        return;
    //    };
    //    //    if (node && node.text == "Base") {
    //    //        e.cancel = true;
    //    //        //阻止浏览器默认右键菜单
    //    //        e.htmlEvent.preventDefault();
    //    //        return;
    //    //    }

    //    if (node.code == "sln") {
    //        alert("根节点菜单！");
    //    } else {
    //    };

    //    ////////////////////////////////
    //    var editItem = mini.getbyName("edit", menu);
    //    var removeItem = mini.getbyName("remove", menu);
    //    editItem.show();
    //    removeItem.enable();

    //    if (node.id == "forms") {
    //        editItem.hide();
    //    }
    //    if (node.id == "lists") {
    //        removeItem.disable();
    //    }
}

function onExpand(sender, node) {
    if (!sender.node.asyncLoad) {
        $.page.idM.tree1.selectNode(sender.node);
        onRefresh();
    };
};
function onRefresh() {
    var selectedNode = $.page.idM.tree1.getSelectedNode();
    if (fw.fwObject.FWObjectHelper.hasValue(selectedNode)) {
        $.page.idM.tree1.removeNodes($.page.idM.tree1.getChildNodes(selectedNode));
        var rootNode = $.page.idM.tree1.getRootNode();
        if (selectedNode.pCode == "-fw-") {
            $.page.ajax($.page.getAjaxSettings({
                serviceType: "crossDomainCall"
                , serviceName: "sysManage"
                , methodName: "getModuleList"
                , data: {
                    ticket: $.page.ticket
                }
                , success: function (resultData) {
                    //判断加载数据成功
                    if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                        var entityList = resultData.data;
                        var entity;
                        for (var i = 0; i < entityList.length; i++) {
                            entity = entityList[i];
                            var childNodes = $.page.idM.tree1.getChildNodes(selectedNode);
                            var isHas = false;
                            for (var j = 0; j < childNodes.length; j++) {
                                if (!isHas && childNodes[j].name == entity.mName) {
                                    isHas = true;
                                };
                                $.page.idM.tree1.collapseNode(childNodes[j]);
                                childNodes[j].asyncLoad = false;
                            };
                            if (!isHas) {
                                var newNode = { code: entity.mModuleVersionId, pCode: selectedNode.code, name: entity.mName, "folder": 1, "isLeaf": false, "expanded": true, "asyncLoad": false };
                                $.extend(newNode, entity);
                                $.page.idM.tree1.addNode(newNode, "add", selectedNode);
                                $.page.idM.tree1.collapseNode(newNode);
                                selectedNode.asyncLoad = true;
                            };
                        };
                    };
                }
            }));
        } else {
            var solutionNode = $.page.idM.tree1.getChildNodes(rootNode)[0];
            var moduleNode = null;
            var parentNode = $.page.idM.tree1.getParentNode(selectedNode);
            var mNamespace = selectedNode.name;
            do {
                if (parentNode == solutionNode) {
                    moduleNode = selectedNode;
                } else {
                    moduleNode = parentNode;
                    mNamespace = parentNode.name + "." + mNamespace;
                };
                parentNode = $.page.idM.tree1.getParentNode(moduleNode);
            } while (parentNode != solutionNode);
            if (moduleNode != null) {
                $.page.ajax($.page.getAjaxSettings({
                    serviceType: "crossDomainCall"
                    , serviceName: "sysManage"
                    , methodName: "getTypeList"
                    , data: {
                        ticket: $.page.ticket
                        , mModuleName: moduleNode.name
                        , mNamespace: mNamespace
                    }
                    , success: function (resultData) {
                        //判断加载数据成功
                        if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                            var entityList = resultData.data;
                            var entity;
                            for (var i = 0; i < entityList.length; i++) {
                                entity = entityList[i];
                                var childNodes = $.page.idM.tree1.getChildNodes(selectedNode);
                                if (!fw.fwObject.FWObjectHelper.hasValue(entity.mMetadataToken)) {
                                    var name = entity.mNamespace.replace(mNamespace + ".", "").split(".")[0];
                                    var isHas = false;
                                    for (var j = 0; j < childNodes.length; j++) {
                                        if (!isHas && childNodes[j].name == name) {
                                            isHas = true;
                                        };
                                        $.page.idM.tree1.collapseNode(childNodes[j]);
                                        childNodes[j].asyncLoad = false;
                                    };
                                    if (!isHas) {
                                        var newNode = { code: entity.mModuleVersionId, pCode: selectedNode.code, name: name, "folder": 1, "isLeaf": false, "expanded": true, "asyncLoad": false };
                                        $.extend(newNode, entity);
                                        $.page.idM.tree1.addNode(newNode, "add", selectedNode);
                                        $.page.idM.tree1.collapseNode(newNode);
                                        newNode.data = entity;
                                        selectedNode.asyncLoad = true;
                                    };
                                } else {
                                    var isHas = false;
                                    for (var j = 0; j < childNodes.length; j++) {
                                        if (childNodes[j].name == fw.fwString.FWStringHelper.toHtml(entity.mName, ["<", ">"])) {
                                            isHas = true;
                                            break;
                                        };
                                    };
                                    if (!isHas) {
                                        var newNode = { code: entity.mModuleVersionId, pCode: selectedNode.code, name: fw.fwString.FWStringHelper.toHtml(entity.mName, ["<", ">"]), "folder": 0, "isLeaf": true, "expanded": true, "asyncLoad": false };
                                        $.extend(newNode, entity);
                                        $.page.idM.tree1.addNode(newNode, "add", selectedNode);
                                        $.page.idM.tree1.collapseNode(newNode);
                                        selectedNode.asyncLoad = true;
                                    };
                                };
                            };
                            if (fw.fwObject.FWObjectHelper.hasValue(e) && fw.fwObject.FWObjectHelper.hasValue(e.callBack) && $.isFunction(e.callBack)) {
                                e.callBack();
                            };
                        };
                    }
                }));
                $.page.idM.tree1.expandNode(selectedNode);
            };
        };
    };
};
function onRefreshType(oldMMetadataToken, newMName) {
    $.page.idM.tree1.findNodes(function (node) {
        if (fw.fwObject.FWObjectHelper.hasValue(node.mMetadataToken) && node.mMetadataToken == oldMMetadataToken) {
            var selectedNode = $.page.idM.tree1.getParentNode(node);
            $.page.idM.tree1.selectNode(selectedNode);
            onRefresh({
                selectedNode: selectedNode
                , callBack: function () {
                    var childNodes = $.page.idM.tree1.getChildNodes(selectedNode);
                    for (var j = 0; j < childNodes.length; j++) {
                        if (childNodes[j].name == newMName) {
                            onNodeSelect({ node: childNodes[j], isLeaf: true });
                        };
                    };
                }
            });
        };
    });
};

//添加模块
function addModule(e) {
    mini.prompt("请输入模块名称：", "请输入",
            function (action, value) {
                if (action == "ok") {
                    var selectedNode = $.page.idM.tree1.getSelectedNode();
                    if (fw.fwObject.FWObjectHelper.hasValue(selectedNode)) {
                        $.page.idM.tree1.expandNode(selectedNode);
                        var childNodes = $.page.idM.tree1.getChildNodes(selectedNode);
                        var isHasModule = false;
                        var isHasModuleData = false;
                        for (var i = 0; i < childNodes.length; i++) {
                            node = childNodes[i];
                            if (node.name.toLowerCase() == ("fw.m." + value).toLowerCase()) {
                                isHasModule = true;
                            } else if (node.name.toLowerCase() == ("fw.m." + value + ".data").toLowerCase()) {
                                isHasModuleData = true;
                            };
                        };
                        if (!isHasModule) {
                            var name = "fw.m." + value;
                            var code = name;
                            var newNode = { code: code, pCode: selectedNode.code, name: name, "folder": 1, "isLeaf": false, "expanded": true, "asyncLoad": false };
                            $.page.idM.tree1.addNode(newNode, "add", selectedNode);
                            addDefaultFolder(newNode);
                        };
                        if (!isHasModuleData) {
                            var name = "fw.m." + value + ".data";
                            var code = name;
                            var newNode = { code: code, pCode: selectedNode.code, name: name, "folder": 1, "isLeaf": false, "expanded": true, "asyncLoad": false };
                            $.page.idM.tree1.addNode(newNode, "add", selectedNode);
                            addDefaultFolder(newNode);
                        };
                    };
                    //alert("确定");
                } else {
                    //alert("取消");
                }
            }
        );
};

//添加项目
function onAddProject(e) {
    var selectedNode = $.page.idM.tree1.getSelectedNode();
    if (fw.fwObject.FWObjectHelper.hasValue(selectedNode)) {
        $.page.idM.tree1.expandNode(selectedNode);
        var childNodes = $.page.idM.tree1.getChildNodes(selectedNode);
        var newFolderIndex = 1;
        if (fw.fwObject.FWObjectHelper.hasValue(childNodes)) {
            var isHas = false;
            do {
                var node;
                for (var i = 0; i < childNodes.length; i++) {
                    node = childNodes[i];
                    if (node.name.toLowerCase() == ("newFolder" + newFolderIndex).toLowerCase()) {
                        isHas = true;
                        newFolderIndex++;
                        break;
                    };
                };
                isHas = !isHas;
            } while (!isHas)
        };
        var name = "newFolder" + newFolderIndex;
        var code = name;
        var newNode = { code: code, pCode: selectedNode.code, name: name, "folder": 1, "isLeaf": false, "expanded": true, "asyncLoad": false };
        $.page.idM.tree1.addNode(newNode, "add", selectedNode);
    };
};

//添加文件夹
function onAddFolder(e) {
    var selectedNode = $.page.idM.tree1.getSelectedNode();
    if (fw.fwObject.FWObjectHelper.hasValue(selectedNode)) {
        $.page.idM.tree1.expandNode(selectedNode);
        var childNodes = $.page.idM.tree1.getChildNodes(selectedNode);
        var newFolderIndex = 1;
        if (fw.fwObject.FWObjectHelper.hasValue(childNodes)) {
            var isHas = false;
            do {
                var node;
                for (var i = 0; i < childNodes.length; i++) {
                    node = childNodes[i];
                    if (node.name.toLowerCase() == ("newFolder" + newFolderIndex).toLowerCase()) {
                        isHas = true;
                        newFolderIndex++;
                        break;
                    };
                };
                isHas = !isHas;
            } while (!isHas)
        };
        var name = "newFolder" + newFolderIndex;
        var code = selectedNode.code + "." + name;
        var newNode = { code: code, pCode: selectedNode.code, name: name, "folder": 1, "isLeaf": false, "expanded": true, "asyncLoad": false };
        $.page.idM.tree1.addNode(newNode, "add", selectedNode);
    };
};

//添加表（数据库）
function onAddTable(e) {
    var data = {
        ticket: $.page.ticket
        , selectType: "n"
        , selectCallback: "addTable"
    }; 
    var pageUrl = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/sysManage/fwTableList.htm", $.page.webSiteRootUrl), data); 
        
    mini.open({
        url: pageUrl
        , title: "数据库表"
        , width: 768
        , height: 512
        , onload: function () {
            //var iframe = this.getIFrameEl();
            //iframe.contentWindow;
        }
        , ondestroy: function (action) {
            //            datagrid1_Load();
        }
    });
};
function addTable(tableArray) {
    if (fw.fwObject.FWObjectHelper.hasValue(tableArray)) {
        var selectedNode = $.page.idM.tree1.getSelectedNode();
        if (fw.fwObject.FWObjectHelper.hasValue(selectedNode)) {
            $.page.idM.tree1.expandNode(selectedNode);
            var firstNode = null;
            for (var j = 0; j < tableArray.length; j++) {
                var table = tableArray[j];
                if (!fw.fwObject.FWObjectHelper.hasValue(table.mapName)) {
                    table.mapName = table.name;
                };
                var childNodes = $.page.idM.tree1.getChildNodes(selectedNode);
                var isHas = false;
                if (fw.fwObject.FWObjectHelper.hasValue(childNodes)) {
                    var node;
                    for (var i = 0; i < childNodes.length; i++) {
                        node = childNodes[i];
                        if (node.name.toLowerCase() == table.mapName.toLowerCase()) {
                            isHas = true;
                            break;
                        };
                    };
                };
                if (!isHas) {
                    var name = table.mapName;
                    var code = selectedNode.code + "." + name;
                    var newNode = { code: name, pCode: selectedNode.code, name: name, "folder": 0, "isLeaf": true, "expanded": true, "asyncLoad": false, url: "fwType.htm?mapName=" + name };
                    $.page.idM.tree1.addNode(newNode, "add", selectedNode);
                    if (firstNode == null) {
                        firstNode = newNode;
                    };
                };
            };
            if (firstNode != null) {
                $.page.idM.tree1.selectNode(firstNode);
            };
        };
    };
};


//添加类
function onAddClass(e) {
    var selectedNode = $.page.idM.tree1.getSelectedNode();
    if (fw.fwObject.FWObjectHelper.hasValue(selectedNode)) {
        $.page.idM.tree1.expandNode(selectedNode);
        var childNodes = $.page.idM.tree1.getChildNodes(selectedNode);
        var classIndex = 1;
        if (fw.fwObject.FWObjectHelper.hasValue(childNodes)) {
            var isHas = false;
            do {
                var node;
                for (var i = 0; i < childNodes.length; i++) {
                    node = childNodes[i];
                    if (node.name.toLowerCase() == ("class" + classIndex).toLowerCase()) {
                        isHas = true;
                        classIndex++;
                        break;
                    };
                };
                isHas = !isHas;
            } while (!isHas)
        };
        var name = "class" + classIndex;
        var code = selectedNode.code + "." + name;
        var newNode = { code: name, pCode: selectedNode.code, name: name, "folder": 0, "isLeaf": true, "expanded": true, "asyncLoad": false };
        $.page.idM.tree1.addNode(newNode, "add", selectedNode);
    };
};

//添加默认文件夹
function addDefaultFolder(node) {
    $.page.idM.tree1.expandNode(node);
    var code = node.code;
    if (code.toLowerCase().indexOf("fw.m.") == 0) {
        if (code.toLowerCase().lastIndexOf(".data") == (code.length - 5)) {
            //data
            var childNodes = $.page.idM.tree1.getChildNodes(node);
            var isHasEntity = false;
            var isHasModule = false;
            for (var i = 0; i < childNodes.length; i++) {
                node = childNodes[i];
                if (node.name.toLowerCase() == "entity") {
                    isHasEntity = true;
                };
                if (node.name.toLowerCase() == "module") {
                    isHasModule = true;
                };
            };
            if (!isHasEntity) {
                var name = "entity";
                var code = node.code + "." + name;
                var newNode = { code: code, pCode: node.code, name: name, "folder": 1, "isLeaf": false, "expanded": true, "asyncLoad": false };
                $.page.idM.tree1.addNode(newNode, "add", node);
            };
            if (!isHasModule) {
                var name = "module";
                var code = node.code + "." + name;
                var newNode = { code: code, pCode: node.code, name: name, "folder": 1, "isLeaf": false, "expanded": true, "asyncLoad": false };
                $.page.idM.tree1.addNode(newNode, "add", node);
            };
        } else {
            var childNodes = $.page.idM.tree1.getChildNodes(node);
            var isHasBLL = false;
            var isHasDAL = false;
            var isHasData = false;
            var isHasService = false;
            for (var i = 0; i < childNodes.length; i++) {
                node = childNodes[i];
                if (node.name.toLowerCase() == "bll") {
                    isHasBLL = true;
                };
                if (node.name.toLowerCase() == "dal") {
                    isHasDAL = true;
                };
                if (node.name.toLowerCase() == "data") {
                    isHasData = true;
                };
                if (node.name.toLowerCase() == "service") {
                    isHasService = true;
                };
            };
            if (!isHasBLL) {
                var name = "bll";
                var code = node.code + "." + name;
                var newNode = { code: code, pCode: node.code, name: name, "folder": 1, "isLeaf": false, "expanded": true, "asyncLoad": false };
                $.page.idM.tree1.addNode(newNode, "add", node);
            };
            if (!isHasDAL) {
                var name = "dal";
                var code = node.code + "." + name;
                var newNode = { code: code, pCode: node.code, name: name, "folder": 1, "isLeaf": false, "expanded": true, "asyncLoad": false };
                $.page.idM.tree1.addNode(newNode, "add", node);
            };
            if (!isHasData) {
                var name = "data";
                var code = node.code + "." + name;
                var newNode = { code: code, pCode: node.code, name: name, "folder": 1, "isLeaf": false, "expanded": true, "asyncLoad": false };
                $.page.idM.tree1.addNode(newNode, "add", node);
            };
            if (!isHasService) {
                var name = "service";
                var code = node.code + "." + name;
                var newNode = { code: code, pCode: node.code, name: name, "folder": 1, "isLeaf": false, "expanded": true, "asyncLoad": false };
                $.page.idM.tree1.addNode(newNode, "add", node);
            };
        };
    };
};
//添加默认文件夹
function onAddDefaultFolder(e) {
    var selectedNode = $.page.idM.tree1.getSelectedNode();
    if (fw.fwObject.FWObjectHelper.hasValue(selectedNode)) {
        addDefaultFolder(selectedNode);
    };
};

//点击菜单修改
function onEdit(e) {
    var selectedNode = $.page.idM.tree1.getSelectedNode();
    if (fw.fwObject.FWObjectHelper.hasValue(selectedNode)) {
        $.page.idM.tree1.beginEdit(selectedNode);
    };
};
//树形修改完成
function onEndEdit(e) {
    var selectedNode = $.page.idM.tree1.getSelectedNode();
    if (fw.fwObject.FWObjectHelper.hasValue(selectedNode)) {
        var parentNode = $.page.idM.tree1.getParentNode(selectedNode);
        if (parentNode.code != "sln") {
            selectedNode.code = parentNode.code + selectedNode.name;
        } else {
            selectedNode.code = selectedNode.name
        };
    };
}










































function onAddBefore(e) {
    var tree = mini.get("tree1");
    var node = tree.getSelectedNode();

    var newNode = {};
    tree.addNode(newNode, "before", node);
}
function onAddAfter(e) {
    var tree = mini.get("tree1");
    var node = tree.getSelectedNode();

    var newNode = {};
    tree.addNode(newNode, "after", node);
}
function onAddNode(e) {
    var tree = mini.get("tree1");
    var node = tree.getSelectedNode();

    var newNode = {};
    tree.addNode(newNode, "add", node);
}

function onRemoveNode(e) {
    var tree = mini.get("tree1");
    var node = tree.getSelectedNode();

    if (node) {
        if (confirm("确定删除选中节点?")) {
            tree.removeNode(node);
        }
    }
}
function onMoveNode(e) {
    var tree = mini.get("tree1");
    var node = tree.getSelectedNode();

    alert("moveNode");
}

















function onBeforeExpand(e) {
    var tree = e.sender;
    var nowNode = e.node;
    var level = tree.getLevel(nowNode);

    var root = tree.getRootNode();
    tree.cascadeChild(root, function (node) {
        if (tree.isExpandedNode(node)) {
            var level2 = tree.getLevel(node);
            if (node != nowNode && !tree.isAncestor(node, nowNode) && level == level2) {
                tree.collapseNode(node, true);
            }
        }
    });

}


function GetParams(url, c) {
    if (!url) url = location.href;
    if (!c) c = "?";
    url = url.split(c)[1];
    var params = {};
    if (url) {
        var us = url.split("&");
        for (var i = 0, l = us.length; i < l; i++) {
            var ps = us[i].split("=");
            params[ps[0]] = decodeURIComponent(ps[1]);
        }
    }
    return params;
}

function onIFrameLoad() {
    if (!CanSet) return;
    var mainTabs = mini.get("mainTabs");
    if (mainTabs) {
        mainTabs.setActiveIndex(0);
    }
    //url#src=...html
    var iframe = document.getElementById("mainframe");
    var src = "";
    try {
        var url = iframe.contentWindow.location.href;
        var ss = url.split("/");
        var s1 = ss[ss.length - 2];
        if (s1 != "demo") {
            src = s1 + "/" + ss[ss.length - 1];
        } else {
            src = ss[ss.length - 1];
        }
    } catch (e) {
    }
    if (src && src != "overview.html") {

        window.location.hash = "src=" + src;

    }
}
function onTabsActiveChanged(e) {
    //    var tabs = e.sender;
    //    var tab = tabs.getActiveTab();
    //    if (tab && tab._nodeid) {

    //        var node = tree.getNode(tab._nodeid);
    //        if (node && !tree.isSelectedNode(node)) {
    //            tree.selectNode(node);
    //        }
    //    }
}

function onSkinChange(skin) {
    mini.Cookie.set('miniuiSkin', skin);
    //mini.Cookie.set('miniuiSkin', skin, 100);//100天过期的话，可以保持皮肤切换
    window.location.reload()
}
function AddCSSLink(id, url, doc) {
    doc = doc || document;
    var link = doc.createElement("link");
    link.id = id;
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute("href", url);

    var heads = doc.getElementsByTagName("head");
    if (heads.length)
        heads[0].appendChild(link);
    else
        doc.documentElement.appendChild(link);
}

var CanSet = false;
$(function () {
    var skin = mini.Cookie.get("miniuiSkin");
    if (skin) {
        var selectSkin = document.getElementById("selectSkin");
        selectSkin.value = skin;
    }

    var frame = document.getElementById("mainframe");
    var demoTree = mini.get("demoTree");

    setTimeout(function () {
        var url = window.location.href;

        var params = GetParams(location.href, "#");
        if (params.ui) {
            var url = URLS[params.ui];
            if (url) {
                frame.src = url;
            }
        } else if (params.app) {

            var node = demoTree.getNode(params.app);
            if (node) {
                demoTree.expandNode(node);
                demoTree.selectNode(node);

                var url = URLS[params.app];
                if (url) {
                    frame.src = url;
                }
            }

        } else if (params.src) {
            document.title = params.src;
            frame.src = params.src;
            //            setTimeout(function () {
            //                if (frame.src != params.src) {
            //                    frame.src = params.src;
            //                }
            //            }, 100);
        }
        CanSet = true;
    }, 10);
});
var URLS = {
    crud: "datagrid/rowedit.html",
    "master-detail": "datagrid/detailform.html",
    validator: "form/validation.html",
    layout: "layout/sysLayout1.html",
    tree: "tree/tree.html"
};