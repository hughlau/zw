definePackage("fw.fwUrl.FWUrlHelper");

var FWUrlHelper = fw.fwUrl.FWUrlHelper;


/**
*@class FWUrlHelper Url处理帮助类
*/
FWUrlHelper = function () {
    /**
    *分析一个Url
    *@param Url Url 字符串
    *@return Object 返回Url信息对象
    */
    this.parser = function (Url) { };
    /**
    *获取Url域
    *@param value Url字符串
    *@return String 返回Url域
    */
    this.getDomain = function (value) { };
    /**
    *Url编码
    *@param value Url字符串
    *@return String 返回编码后字符串
    */
    this.encode = function (value) { };
    /**
    *Url解码
    *@param value Url编码字符串
    *@return String 返回解码后字符串
    */
    this.decode = function (value) { };
    /**
    *获取Url参数
    *@param url Url字符串
    *@param c Url问号分隔符
    *@param decryptKey Url解密密钥
    *@return Object 返回Url参数对象
    */
    this.getParams = function (url, c, decryptKey) { };
    /**
    *Url参数添加
    *@param url Url字符串
    *@param data - {Url参数对象}
    *@param c Url问号分隔符
    *@param encryptKey Url加密密钥
    *@return String 返回添加参数后Url字符串
    */
    this.addParams = function (url, data, c, encryptKey) { };
    /**
    *获取绝对Url
    *@param url Url字符串
    *@param webSiteRootUrl 站点根目录Url
    *@return String 返回绝对Url字符串
    */
    this.getAbsoluteUrl = function (url, webSiteRootUrl) { };
};