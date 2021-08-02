definePackage("fw.fwFileUpload.fwFileUploadHelper");

var fwFileUploadHelper = fw.fwFileUpload.fwFileUploadHelper;


/**
*@class fwFileUploadHelper 上传文件帮助类
*/
fwFileUploadHelper = function () {

    /**  
    * @description 默认支持文件的类型(gif|bmp|jpg|jpeg|png)
    * @field  
    */
    this.imageExtensions = "gif|bmp|jpg|jpeg|png";
    /**  
    * @description 默认的文件类型(txt|doc|docx)
    * @field  
    */
    this.wordExtensions = "txt|doc|docx";
    /**
    *上传文件 
    *@param uploadInfoJQ - {Object jquery对象 用户在该标签中显示上传信息}
    *@param fileInfo - {Object fileInfo对象 文件信息{name="文件名",fileUrl="文件地址"}} 
    *@param enterClearCallback - {Object 按钮回调的方法}  
    *@return 
    */
    this.insertFileInfo = function (uploadInfoJQ, fileInfo, enterClearCallback) {};
};

