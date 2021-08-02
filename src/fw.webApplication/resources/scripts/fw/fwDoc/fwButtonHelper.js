definePackage("fw.fwButton.FWButtonHelper");

var FWButtonHelper = fw.fwButton.FWButtonHelper;


/**
*@class FWButtonHelper
*/
FWButtonHelper = function () {
    /**
    *添加等待图标提示 
    *@param idM - {要添加等待图标提示的dom对象} 
    *@return 
    */
    this.addWait = function (idM) {
        if (fw.fwObject.FWObjectHelper.hasValue(idM)) {
            var defaultIconCls = idM.defaultIconCls;
            if (!fw.fwObject.FWObjectHelper.hasValue(defaultIconCls)) {
                defaultIconCls = idM.getIconCls();
                idM.defaultIconCls = defaultIconCls;
            };
            idM.set({
                enabled: false,
                iconCls: "icon-wait"
            });
        };
    };
    /**
    *移除等待图标提示
    *@param idM - {要移除等待图标提示的dom对象} 
    *@return 
    */
    this.removeWait = function (idM) {
        if (fw.fwObject.FWObjectHelper.hasValue(idM)) {
            var defaultIconCls = idM.defaultIconCls;
            if (fw.fwObject.FWObjectHelper.hasValue(defaultIconCls)) {
                idM.set({
                    enabled: true,
                    iconCls: defaultIconCls
                });
            } else {
                idM.set({
                    enabled: true,
                    iconCls: ""
                });
            };
        };
    };
};
