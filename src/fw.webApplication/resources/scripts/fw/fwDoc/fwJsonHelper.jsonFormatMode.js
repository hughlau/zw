definePackage("fw.fwJson.FWJsonHelper.JsonFormatMode");

var JsonFormatMode = fw.fwJson.FWJsonHelper.JsonFormatMode;

/**
*@class JsonFormatMode json格式化类型 框架内置
*/
JsonFormatMode = function () {
    /**  
    * @description  Json字符串（单行）  
    * @field  
    */
    this.ToString = 0;
    /**  
    * @description  Json字符串（有换行符的格式化）  
    * @field  
    */
    this.ToFormatString = 1;
    /**  
    * @description  HTML字符串  
    * @field  
    */
    this.ToHTML = 2;
    /**  
    * @description  XML字符串  
    * @field  
    */
    this.ToXML = 3;
};