//#region 去掉控件边框  
function labelModel(controlIds, isReadOnly) {
    controlIds = controlIds || [];
    var fields = $.page.idM.editform.getFields();
    for (var i = 0, l = fields.length; i < l; i++) {
        var c = fields[i];
        if (!fw.fwObject.FWObjectHelper.hasValue(c.style)) {
            c.style = "";
        };

        if (isReadOnly) {
            if (controlIds.indexOf(c.id) > -1) {
                if (c.setReadOnly) c.setReadOnly(true);     //只读  
                if (c.setIsValid) c.setIsValid(true);      //去除错误提示     
                if (c.addCls) c.addCls("asLabel");          //增加asLabel外观       
            }

        } else {
            if (controlIds.indexOf(c.id) == -1) {
                if (c.setReadOnly) c.setReadOnly(true);     //只读  
                if (c.setIsValid) c.setIsValid(true);      //去除错误提示     
                if (c.addCls) c.addCls("asLabel");          //增加asLabel外观       
            }
        }
    };
};
//#endregion