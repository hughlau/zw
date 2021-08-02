definePackage("fw.fwData.FWTaskType");

var FWTaskType = fw.fwData.FWTaskType;

/**
*@class FWSortType 任务类型 框架内置
*/
FWTaskType = function () {
    /**  
    * @description 10-调用dll执行操作
    * @field  
    */
    this.Dll = 10;
    /**  
    * @description 11-调用Url执行操作
    * @field  
    */
    this.Url = 11;
    /**  
    * @description 12-调用Sql执行操作
    * @field  
    */
    this.Sql = 12;
};