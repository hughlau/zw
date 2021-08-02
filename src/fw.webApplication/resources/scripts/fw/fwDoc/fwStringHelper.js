definePackage("fw.fwString.FWStringHelper");

var FWStringHelper = fw.fwString.FWStringHelper;


/**
*@class FWValidateCodeHelper 验证码处理帮助类
*/
FWStringHelper = function () {
    /**  
    * @description 默认的空字符格式 ""  
    * @field  
    */
    this.empty = "";
    /**
    *转化为字符串
    *@param value - {待转换对象} 
    *@return String 字符串
    */
    this.toString = function (_String) { };
    /**
    *转化为bool
    *@param value - {待转换对象} 
    *@return bool 
    */
    this.toBoolean = function (_String) { };
    /**
    *转化为Number
    *@param value - {待转换对象} 
    *@return Number 
    */
    this.toNumber = function (_String) { };
    /**
    *去除空格
    *@return Number 
    */
    this.trim = function (value) { };
    /**
    *转化为移除固定长度的字符串
    *@param value - {原始字符串} 
    *@param startIndex - {开始的索引} 
    *@param count - {移除的长度} 
    *@return 新的字符串 
    */
    this.remove = function (value, startIndex, count) { };
    /**
    *插入字符串
    *@param value - {原始字符串} 
    *@param startIndex - {开始的索引} 
    *@param insertValue - {插入的字符串} 
    *@return 新的字符串 
    */
    this.insert = function (value, startIndex, insertValue) { };
    /**
    *获取字符串的base64byte格式
    *@return 新的字符串 
    */
    this.getBase64Bytes = function (value) { };
    /**
    *替换字符串
    *@param value - {原始字符串} 
    *@param startIndex - {要替换的字符串} 
    *@param insertValue - {替换后的字符串} 
    *@return 新的字符串 
    */
    this.replaceAll = function (value, StringReplace, StringReplaceTo) { };
    this.toDateTime = function (value) { };
    this.toArray = function (value, separator) { };
    /**
    *转化为url参数格式
    *@param value - {待转换对象} 
    *@return String url字符串
    */
    this.serializeWindowName = function (value) { };
    /**
    *url参数解析为对象
    *@param value - {url参数} 
    *@return String 转换对象
    */
    this.deserializeWindowName = function (value) {
        return fw.fwUrl.FWUrlHelper.encode(value);
    };
    /**
    * html格式转义【具体参见方法详细】
    *@param value - {原始值} 
    *@param symbolArray - {格式对应数组} 
    *@return String 转换对象
    */
    this.toHtml = function (value, symbolArray) {

        var replaceArray = [
						["&", "&amp;"], ["<", "&lt;"], [">", "&gt;"], ["\"", "&quot;"], ["'", "&apos;"], [" ", "&nbsp;"]
					];
        var symbolDictionary = {};
        for (var i = 0; i < replaceArray.length; i++) {
            symbolDictionary[replaceArray[i][0]] = replaceArray[i][1];
        };
        replaceArray = fw.fwObject.FWObjectHelper.toArray(symbolArray, ",");
        for (var i = 0; i < replaceArray.length; i++) {
            value = fw.fwString.FWStringHelper.replaceAll(value, replaceArray[i], symbolDictionary[replaceArray[i]]);
        };
        return value;
    };
    /**
    *把字符串转换为Base64格式字符串
    *@param value - {字符串} 
    *@return String 转换后的字符串
    */
    this.toBase64String = function (str) { };
    /**
    *把Base64格式字符串换为正常字符串
    *@param value - {字符串} 
    *@return String 转换对象
    */
    this.formBase64String = function (str) { };
};