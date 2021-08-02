definePackage("fw.fwNumber.FWNumberHelper");

var FWNumberHelper = fw.fwNumber.FWNumberHelper;


/**
*@class FWNumberHelper 数字处理帮助类
*/
FWNumberHelper = function () {
    /**
    *数字格式化为数字类型
    *@param _Number 数字 
    *@return Number 数字
    */
    this.toNumber = function (_Number) { };
    /**
    *数字格式化为布尔类型
    *@param _Number  字
    *@return Boolean
    */
    this.toBoolean = function (_Number) { };
    /**
    *数字格式化为时间类型
    *@param _Number 数字 
    *@return DateTime
    */
    this.toDateTime = function (_Number) { };
    /**
    *数字格式化为字符串类型
    * @example 
    1: (333.2345).ToString("###.000")=333.234 - 数字格式化为字符串。
    2: (0.2365).ToString("#%")=24% - 数字格式化为字符串。
    *@param _Number 数字 
    *@param format - 用户格式化数字的字符串 
    *@return String
    */
    this.toString = function (_Number, format) { };
    /**
    *数字格式化为文件大小
    *@param value 数字 
    *@return String 带单位数字字符串
    */
    this.toFileSize = function (value) { };
    /**
    *数字格式化为年、月、天、时、分、秒
    *@param seconds 秒 
    *@return String 
    */
    this.toInTime = function (seconds) { };
    /**
    *小数位数
    *@param _Number 数字 
    *@return Number 
    */
    this.decimalDigits = function (_Number) { };
    /**
    *计算两数值之和
    *@param _Number1 数值1 
    *@param _Number2 数值1 
    *@return Number 
    */
    this.add = function (_Number1, _Number2) { };
    /**
    *计算两数值之差
    *@param _Number1 数值1 
    *@param _Number2 数值1 
    *@return Number 
    */
    this.subtr = function (_Number1, _Number2) { };
    /**
    *计算两数值相乘
    *@param _Number1 数值1 
    *@param _Number2 数值1 
    *@return Number 
    */
    this.mul = function (_Number1, _Number2) { };
    /**
    *计算两数值相除
    *@param _Number1 数值1 
    *@param _Number2 数值1 
    *@return Number 
    */
    this.div = function (_Number1, _Number2) { };
    /**
    *计算随机数
    *@param min 最小值 
    *@param max 最大值
    *@return Number 随机数
    */
    this.randomNumber = function (min, max) { };
};