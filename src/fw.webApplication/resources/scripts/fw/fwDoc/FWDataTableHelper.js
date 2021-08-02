definePackage("fw.fwDataTable.FWDataTableHelper");

var FWDataTableHelper = fw.fwDataTable.FWDataTableHelper;


/**
*@class FWDataTableHelper使用操作类(主要用于json对象和系统内置的datatale转换【非标准转换】,为了减少网络传输，框架做了部分优化)
*/
FWDataTableHelper = function () {
    /**
    *转换为EntityList对象 
    *@param fwdtbl - {resultData.data}  
    *@example  fw.fwDataTable.FWDataTableHelper.toEntityList(resultData.data);
    *@return array entityList
    */
    this.toEntityList = function (fwdtbl) {
        var entityList;
        if (fw.fwObject.FWObjectHelper.hasValue(fwdtbl)) {
            entityList = [];
            var entity;
            for (var i = 0; i < fwdtbl.rows.length; i++) {
                entity = {};
                for (var j = 0; j < fwdtbl.columns.length; j++) {
                    entity[fwdtbl.columns[j].columnName] = fwdtbl.rows[i][j]
                };
                entityList.push(entity);
            };
        };
        return entityList;
    };
    /**
    *转换为FWDataTable对象 
    *@param entityList - {标准对象数组}  
    *@example  fw.fwDataTable.FWDataTableHelper.toFWDataTable(entityList);
    *@return obj fwdtbl {包含【columns{array}rows{array}】}
    */
    this.toFWDataTable = function (entityList) {
        var fwdtbl = null;
        if (fw.fwObject.FWObjectHelper.hasValue(entityList)) {
            var getColumns = function (obj) {
                var columns = [];
                for (var columnName in obj) {
                    columns.push({
                        columnName: columnName
                    });
                };
                return columns;
            };
            var columns;
            var rows = [];
            var row;
            switch (Object.prototype.toString.apply(entityList)) {
                case "[object Object]":
                    columns = getColumns(entityList);
                    row = [];
                    for (var i = 0; i < columns.length; i++) {
                        row.push(entityList[columns[i].columnName]);
                    };
                    rows.push(row);
                    break;
                case "[object Array]":
                    columns = getColumns(entityList[0]);
                    for (var j = 0; j < entityList.length; j++) {
                        row = [];
                        for (var i = 0; i < columns.length; i++) {
                            row.push(entityList[j][columns[i].columnName]);
                        };
                        rows.push(row);
                    };
                    break;
            };
            fwdtbl = {
                columns: columns,
                rows: rows
            };
        };
        return fwdtbl;
    };
};
