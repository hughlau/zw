definePackage("fw.fwConfig.FWConfigHelper");

var FWConfigHelper = fw.fwConfig.FWConfigHelper;


/**
*@class FWConfigHelper此类属性主要用于系统配置，使用时按需取值就行。
*/
FWConfigHelper = function () {
    /**  
    * @description {string} 数据公钥  
    * @field  
    */
    this.dataPublicKey = undefined;
    /**  
    * @description {string} 动态路径 
    * @field  
    */
    this.dynamicDirectory = undefined;
};
