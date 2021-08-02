definePackage("fw.fwData.FWDataType");

var FWDataType = fw.fwData.FWDataType;

/**
*@class FWDataType
*/
FWDataType = function () {
    /**  
    * @description {String} String  
    * @field  
    */
    this.String = "String";
    /**  
    * @description {Int16} tinyint  
    * @field  
    */
    this.Int16 = "tinyint";
    /**  
    * @description {int} int  
    * @field  
    */
    this.Int32 = "int";
    /**  
    * @description {bigint} bigint  
    * @field  
    */
    this.Int64 = "bigint";
    /**  
    * @description {Single} Single  
    * @field  
    */
    this.Single = "Single";
    /**  
    * @description {Double} Double  
    * @field  
    */
    this.Double = "Double";
    /**  
    * @description {decimal} decimal  
    * @field  
    */
    this.Decimal = "decimal";
    /**  
    * @description {bit} bit  
    * @field  
    */
    this.Boolean = "bit";
    /**  
    * @description {datetime} datetime  
    * @field  
    */
    this.DateTime = "datetime";
};