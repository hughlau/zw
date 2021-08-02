definePackage("fw.fwSafe.FWSafeHelper");

var FWSafeHelper = fw.fwSafe.FWSafeHelper;


/**
*@class FWSafeHelper 安全处理帮助类
*/
FWSafeHelper = function () {    
    /**
    *加密
    *@param value - {待加密对象} 
    *@param key - {加密密钥 可以为空}
    *@return String 加密后字符串
    */
    this.encrypt = function (value, key) { };
    /**
    *解密
    *@param value - {待解密对象} 
    *@param key - {解密密钥}
    *@return String 解密后字符串
    */
    this.decrypt = function (value, key) { };
};