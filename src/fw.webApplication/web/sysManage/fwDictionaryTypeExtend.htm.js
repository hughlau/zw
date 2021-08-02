//页面初始化
$.page.pageInit = function () {
    //设置数据绑定
    $.page.dataSourceSettingsDictionary = {

    };
};

//页面加载
$.page.pageLoad = function () {
    //判断传入编码
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.mDataID)) {
        //查询信息
        query();
    };
};


//查询信息
function query() {
    //查询字典类型信息
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysManage"
        , methodName: "queryMFWDictionaryTypeByMDataID"
        , data: {
            ticket: $.page.ticket
            , mDataID: $.page.params.mDataID
        }
        , beforeSend: function () {
            mini.mask({
                el: document.body,
                cls: 'mini-mask-loading',
                html: '加载中...'
            });
        }
        , success: function (resultData) {
            //判断查询信息成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                //设置表单值
                if (!fw.fwObject.FWObjectHelper.hasValue(resultData.data.mExtendTableName)) {
                    resultData.data.mExtendTableName = resultData.data.mDictionaryTypeCode;
                };
                $.page.idM.editform.setData(resultData.data);

                datagrid1_Load();
            } else {
                mini.unmask(document.body);
                mini.alert("该数据不存在！", undefined, function () {
                    CloseWindow("cancel");
                });
            };
        }
    }));
};

function datagrid1_Load() {
    //开启datagrid数据加载锁屏
    $.page.idM.datagrid1.loading();
    //加载数据
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
                    , serviceName: "sysManage"
                    , methodName: "queryListMFWDictionaryExtendTableColumnByMDataID"
                    , data: {
                        ticket: $.page.ticket
                        , mDataID: $.page.params.mDataID
                    }
                    , success: function (resultData) {
                        //判断加载数据成功
                        if (resultData.status == fw.fwData.FWResultStatus.Success) {
                            if (resultData.data != null) {
                                //设置datagrid数据
                                $.page.idM.datagrid1.set({
                                    data: resultData.data
                                });
                            };
                            mini.unmask(document.body);
                        };
                    }
    }));
};

//单元格渲染事件
function datagrid1_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "mDataLen":
            html = e.value == 0 ? "" : e.value;
            break;
        default:
            break;
    };
    return html;
};

var ColumnDataType = [{ id: 'bigint', text: 'bigint' },
                   { id: 'binary', text: 'binary' },
                   { id: 'bit', text: 'bit' },
                   { id: 'char', text: 'char' },
                   { id: 'date', text: 'date' },
                   { id: 'datetime', text: 'datetime' },
                   { id: 'float', text: 'float' },
                   { id: 'image', text: 'image' },
                   { id: 'int', text: 'int' },
                   { id: 'money', text: 'money' },
                   { id: 'nchar', text: 'nchar' },
                   { id: 'ntext', text: 'ntext' },
                   { id: 'nvarchar', text: 'nvarchar' },
                   { id: 'nvarchar(MAX)', text: 'nvarchar(MAX)' },
                   { id: 'text', text: 'text' },
                   { id: 'tinyint', text: 'tinyint' },
                   { id: 'uniqueidentifier', text: 'uniqueidentifier' },
                   { id: 'varbinary', text: 'varbinary' },
                   { id: 'varbinary(MAX)', text: 'varbinary(MAX)' },
                   { id: 'varchar', text: 'varchar' },
                   { id: 'varchar(MAX)', text: 'varchar(MAX)' },
                   { id: 'xml', text: 'xml'}];

function IsCellEdit(mColumnType) {
    var data = {};
    var isCellEdit = true, cellValue = 1;
    switch (mColumnType) {
        case "binary":
            cellValue = 50;
            break;
        case "char":
            cellValue = 10;
            break;
        case "nchar":
            cellValue = 10;
            break;
        case "nvarchar":
            cellValue = 50;
            break;
        case "varbinary":
            cellValue = 50;
            break;
        case "varchar":
            cellValue = 50;
            break;
        default:
            isCellEdit = false;
            break;
    }
    data.isCellEdit = isCellEdit;
    data.cellValue = cellValue;
    return data;
};

function OnCellBeginEdit(e) {
    var record = e.record, field = e.field;
    if (field == "mDataLen" && record.mColumnType) {
        var cellEditObj = IsCellEdit(record.mColumnType);
        if (!cellEditObj.isCellEdit) {
            e.cancel = true; //如果无数据长度，则不允许编辑数据长度
        };
    };
};

function OnCellCommitEdit(e) {
    var grid = e.sender, record = e.record, field = e.field, value = e.value;
    if (field == "mColumnType" && value) {
        var cellEditObj = IsCellEdit(value);
        if (cellEditObj.isCellEdit) {
            grid.updateRow(record, { mDataLen: cellEditObj.cellValue });
        } else {
            grid.updateRow(record, { mDataLen: "" });
        };
    };
};

//插入新增行
function insertRow() {
    var newRow = { name: "New Row" };
    newRow.mIsNull = "0";
    newRow.mIsDis = "0"
    $.page.idM.datagrid1.addRow(newRow, 0);
    $.page.idM.datagrid1.beginEditCell(newRow, "mColumnName");
};

//删除选中项
function del(mDataIDList) {
    //获得选中项编码集合
    if (!fw.fwObject.FWObjectHelper.hasValue(mDataIDList)) {
        var rows = $.page.idM.datagrid1.getSelecteds();
        if (rows.length > 0) {
            mDataIDList = [];
            var entity;
            for (var i = 0; i < rows.length; i++) {
                entity = rows[i];
                if (fw.fwObject.FWObjectHelper.hasValue(entity.mDataID)) {
                    mDataIDList.push(entity.mDataID);
                } else {
                    $.page.idM.datagrid1.removeRows([rows[i]], true);
                };
            };
            if (mDataIDList.length < 1) {
                mDataIDList = undefined;
            };
        } else {
            mini.alert("请选择一项！");
        };
    };
    //判断选中了项
    if (mDataIDList) {
        mini.confirm("确定删除记录？", "确定？",
            function (action) {
                if (action == "ok") {
                    //删除
                    $.page.ajax($.page.getAjaxSettings({
                        serviceType: "crossDomainCall"
                        , serviceName: "sysManage"
                        , methodName: "deleteMFWDictionaryExtendTableColumnByMDataIDList"
                        , data: {
                            ticket: $.page.ticket
                            , mDataID: $.page.params.mDataID
                            , mDataIDList: mDataIDList
                        }
                        , beforeSend: function () {
                            fw.fwButton.fwButtonHelper.addWait($.page.idM.del);
                        }
                        , success: function (resultData) {
                            //判断删除成功
                            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                                //datagrid加载数据
                                datagrid1_Load();
                            };
                        }
                        , complete: function () {
                            fw.fwButton.fwButtonHelper.removeWait($.page.idM.del);
                        }
                    }));
                };
            }
        );
    };
};

function buttonSave() {
    //表单验证
    $.page.idM.editform.validate();
    if ($.page.idM.editform.isValid() == false) {
        return;
    };
    //获取表单数据
    var data = fw.fwObject.FWObjectHelper.emptyToNull($.page.idM.editform.getData());
    //设置编码
    data.mDataID = $.page.params.mDataID;

    //验证
    $.page.idM.datagrid1.validate();
    if ($.page.idM.datagrid1.isValid() == false) {
        //alert("请校验输入单元格内容");
        var error = $.page.idM.datagrid1.getCellErrors()[0];
        $.page.idM.datagrid1.beginEditCell(error.record, error.column);
        return;
    };
    var mEntityList = $.page.idM.datagrid1.getChanges();
    mEntityList = fw.fwObject.FWObjectHelper.emptyToNull(mEntityList);

    $.page.idM.datagrid1.loading("保存中，请稍后......");
    //插入或者更新
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
            , serviceName: "sysManage"
            , methodName: "insertOrUpdateMFWDictionaryTypeExtendListByMDataID"
            , data: {
                ticket: $.page.ticket
                , mEntity: data
                , mEntityList: mEntityList
            }
            , beforeSend: function () {
                fw.fwButton.fwButtonHelper.addWait($.page.idM.insertOrUpdate);
            }
            , success: function (resultData) {
                //判断插入或者更新成功
                if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data) {
                    mini.alert("保存成功！", null, function () {
                        //用户可能继续添加列，此处不做关闭窗口操作
                        //关闭窗口
                        //CloseWindow("insertOrUpdate");
                    });
                } else {
                    if (fw.fwObject.FWObjectHelper.hasValue(resultData.infoList[0])) {
                        mini.alert("保存失败！（" + resultData.infoList[0] + "）");
                    } else {
                        mini.alert("保存失败！");
                    };
                };
            }
            , error: function (a, b, c) {

            }
            , complete: function () {
                fw.fwButton.fwButtonHelper.removeWait($.page.idM.insertOrUpdate);
                $.page.idM.datagrid1.unmask();
            }
    }));
};

//关闭窗口
function CloseWindow(action) {
    //判断数据被修改
    if (action == "close" && $.page.idM.editform.isChanged()) {
        if (confirm("数据被修改了，是否先保存？")) {
            return false;
        };
    };
    if (window.CloseOwnerWindow) {
        return window.CloseOwnerWindow(action);
    } else {
        window.close();
    };
};

//取消
function onCancel() {
    //关闭窗口
    CloseWindow("cancel");
};