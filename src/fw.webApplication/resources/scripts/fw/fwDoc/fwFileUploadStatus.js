definePackage("fw.fwData.FWFileUploadStatus");

var FWFileUploadStatus = fw.fwData.FWFileUploadStatus;


/**
*@class FWFileUploadStatus此类属性主要用于上传状态配置
*/
FWFileUploadStatus = function () {
    /**  
    * @description {Analysing} 分析中  
    * @field  
    */
    this.Analysing = 0;

    /**  
    * @description {Uploading} 上传  
    * @field  
    */
    this.Uploading = 1;

    /**  
    * @description {Pause} 暂停  
    * @field  
    */
    this.Pause = 2;
    /**  
    * @description {Finished} 完成  
    * @field  
    */
    this.Finished = 3;
};