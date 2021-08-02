definePackage("fw.fwJson.FWJsonHelper");

var FWJsonHelper = fw.fwJson.FWJsonHelper;


/**
*@class FWJsonHelper   json对象转换类
*/
FWJsonHelper = function () {
    /**
    *把对象序列化为Json字符串
    *@param value - {对象} 
    *@param IsUseCustomFormat - {是否使用自定义格式化} 
    *@patam FormatMode Json格式化类型
    *@return String Json字符串
    */
    this.serializeObject = function (value, IsUseCustomFormat, FormatMode) { };
    /**
    *Json字符串反序列化为对象
    *@param value 对象Json字符串
    *@param CatchValue 反序列化失败时，返回的值    
    *@return Object - {对象}
    */
    this.deserializeObject = function (value, CatchValue) { };
    /**
    *对象复制
    *@param value - {对象}   
    *@return Object - {对象}
    */
    this.copyObject = function (value) { };
};