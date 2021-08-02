//页面初始化
$.page.pageInit = function () { };

//页面加载
$.page.pageLoad = function () {
    var extensionStore =
            [
                { "k": "2", "v": "Excel2007(2010)" },
                { "k": "1", "v": "Excel2003" },
                { "k": "0", "v": "csv格式逗号分割" }
            ];
    $.page.idM.extensionType.load(extensionStore, "k", "v");
    $.page.idM.extensionType.setValue("2");
};

function getData() {
    return $.page.idM.extensionType.getValue();
};


function closeWindow(action) {
    if (window.CloseOwnerWindow) {
        return window.CloseOwnerWindow(action);
    }
    else {window.close(); };
};

function onOk() {
    closeWindow("ok");
};
function onCancel() {
    closeWindow("cancel");
};










