definePackage("fw.fwObject.FWObjectHelper");

var FWObjectHelper = fw.fwObject.FWObjectHelper;


/**
*@class FWObjectHelper 对象处理帮助类
*/
FWObjectHelper = function () {
    /**
    *判断一个对象是否有值
    *@param anyType - {任意类型对象} 
    *@return Boolean
    */
    this.hasValue = function (anyType) { };
    /**
    *判断一个对象是否为数组
    *@param anyType - {任意类型对象} 
    *@return Boolean
    */
    this.isArray = function (anyType) { };
    /**
    *判断一个对象是否为对象
    *@param anyType - {任意类型对象} 
    *@return Boolean
    */
    this.isObject = function (anyType) { };
    /**
    *判断一个对象是否为字符串对象
    *@param anyType - {任意类型对象} 
    *@return Boolean
    */
    this.isString = function (anyType) { };
    /**
    *将一个对象格式化为字符串对象
    *@param value - {对象} 
    *@param format 用户格式化字符串对象
    *@return String
    */
    this.toString = function (value, format) { };
    /**
    *将一个数字或字符串格式化为时间对象
    *@param value - {数字或字符串}     
    *@return DateTime
    */
    this.toDateTime = function (value) { };
    /**
    *将一个值转换为布尔类型 只有Boolean、Number、String类型能转换，其他默认为false
    *@param value - {需转换对象}     
    *@return Boolean 
    */
    this.toBoolean = function (value) { };
    /**
    *将一个值转换为数字类型 只有Boolean、Number、String类型能转换
    *@param value - {需转换对象}    
    *@param format 用户格式化字符串对象 
    *@return Number 
    */
    this.toNumber = function (value, format) { };
    /**
    *将一个对象转换为数组
    *@param value - {需转换对象}    
    *@param separator 分隔符
    *@return Array 
    */
    this.toArray = function (value, separator) { };
    /**
    *将空字符串转换为null 
    *@param value - {需转换对象}    
    *@param propertyArray 内容数组
    *@return Object 返回转换后对象 
    */
    this.emptyToNull = function (value, propertyArray) { };
};