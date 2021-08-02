definePackage("fw.fwSelect.fwSelectHelper");

var FWSelectHelper = fw.fwSelect.fwSelectHelper;


/**
*@class fwSelectHelper select 标签 绑定帮助类
*/
FWSelectHelper = function () {
    /**
    *绑定月份
    *@param idM 控件ID 
    *@param valuefield 值域
    *@param textfield 文本域
    */
    this.bindMonth = function (idM, valuefield, textfield) { };
    /**
    *绑定星期
    *@param idM 控件ID 
    */
    this.bindWeek = function (idM) { };
    /**
    *绑定日
    *@param idM 控件ID 
    */
    this.bindDay = function (idM) { };
    /**
    *绑定小时
    *@param idM 控件ID 
    */
    this.bindHour = function (idM) { };
    /**
    *绑定分钟
    *@param idM 控件ID 
    */
    this.bindMinute = function (idM) { };
    /**
    *绑定秒
    *@param idM 控件ID 
    */
    this.bindSecond = function (idM) { };
};