definePackage("fw.guid");

var guid = fw.guid;


/**  
* @fileOverview guid类  
* @version 1.0  
*/
/**  
* @author   
* @constructor guid  
* @description guid生成    
* @example  fw.guid();  
* @since version 0.1  
*/ 
guid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};
