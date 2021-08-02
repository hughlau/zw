definePackage("fw.fwData.FWResultStatus");

var FWResultStatus = fw.fwData.FWResultStatus;


/**
*@class FWConfigHelper此类属性主要用于系统配置，使用时按需取值就行。
*/
FWResultStatus = function () {
    /**  
    * @description  错误  
    * @field  
    */
    this.Error = -3;

    /**  
    * @description 没有权限
    * @field  
    */
    this.NoRight = -2;

    /**  
    * @description 登入超时（未登入）
    * @field  
    */
    this.LoginOut = -1;

    /**  
    * @description 失败  
    * @field  
    */
    this.Failure = 0;

    /**  
    * @description 成功  
    * @field  
    */
    this.Success = 1;
    /**  
    * @description 频繁操作  
    * @field  
    */
    this.Frequently = 2;
};