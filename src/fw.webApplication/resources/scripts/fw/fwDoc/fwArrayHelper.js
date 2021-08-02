definePackage("fw.fwArrayHelper.FWArrayHelper");

var FWArrayHelper = fw.fwArray.FWArrayHelper;


/**
*@class fwArrayHelper类是一个数组操作帮助类
*/
FWArrayHelper = function () {
    /**
    *往array中添加对象. 
    *@param value - {array数组对象} 
    *@param item - {要添加的对象} 
    *@return 添加后的数组对象
    */
    this.add = function (value, item) {};
    /**
    *往array中添加数组对象. 
    *@param value - {array数组对象} 
    *@param itemArray - {要添加的数组对象} 
    *@return 添加后的数组对象
    */
    this.addRange = function (value, itemArray) { };
    /**
    *对array排序Asc. 
    *@param func - {排序函数名称} 
    *@return 排序后的数组对象
    */
    this.orderByAsc = function (func) { };
    /**
    *对array排序Desc. 
    *@param func - {排序函数名称 } 
    *@return 排序后的数组对象
    */
    this.orderByDesc = function (func) { };
    /**
    *判断对象是否在数组对象中 
    *@param obj - {数组对象} 
    *@return boolean - {存在true,默认false}
    */
    this.contains = function (obj) { };
    /**
    *获取对象所在的数组中的index
    *@param Object - {数组对象} 
    *@return int - {index}
    */
    this.indexOf = function (Object) { };
    /**
    *对数组对象去重
    *@return 去掉重复元素的数组对象
    */
    this.distinct = function () { };
    /**
    *复制数组对象
    *@return 复制的数组对象
    */
    this.clone = function () { };
    /**
    *移除数组对象中的某个对象
    *@param obj - {要移除的对象} 
    *@return 移除后的数组对象
    */
    this.remove = function (obj) { };
};
