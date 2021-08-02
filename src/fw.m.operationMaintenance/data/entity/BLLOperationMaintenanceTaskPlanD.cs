using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwDal;
using System.Runtime.Serialization;
namespace fw.m.operationMaintenance.data.entity
{
	 	// 
		[DataContract]
	public class BLLOperationMaintenanceTaskPlanD : FWEntityObject
	{
   		     
      			
		private long _id;
		
		/// <summary>
		///  
        /// </summary>
		[DataMember]
        public long id
        {
            get{ return _id; }
            set{ _id = changeValue("id",_id,value); }
        }        
				
		private string _operationMaintenanceTaskPlanDId;
		
		/// <summary>
		///  
        /// </summary>
		[DataMember]
        public string operationMaintenanceTaskPlanDId
        {
            get{ return _operationMaintenanceTaskPlanDId; }
            set{ _operationMaintenanceTaskPlanDId = changeValue("operationMaintenanceTaskPlanDId",_operationMaintenanceTaskPlanDId,value); }
        }        
				
		private string _operationMaintenanceTaskPlanId;
		
		/// <summary>
		///  
        /// </summary>
		[DataMember]
        public string operationMaintenanceTaskPlanId
        {
            get{ return _operationMaintenanceTaskPlanId; }
            set{ _operationMaintenanceTaskPlanId = changeValue("operationMaintenanceTaskPlanId",_operationMaintenanceTaskPlanId,value); }
        }        
				
		private string _monitorSiteCode;
		
		/// <summary>
		///  
        /// </summary>
		[DataMember]
        public string monitorSiteCode
        {
            get{ return _monitorSiteCode; }
            set{ _monitorSiteCode = changeValue("monitorSiteCode",_monitorSiteCode,value); }
        }        
				
		private int _isValid;
		
		/// <summary>
		///  
        /// </summary>
		[DataMember]
        public int isValid
        {
            get{ return _isValid; }
            set{ _isValid = changeValue("isValid",_isValid,value); }
        }        
				
		private string _createrID;
		
		/// <summary>
		///  
        /// </summary>
		[DataMember]
        public string createrID
        {
            get{ return _createrID; }
            set{ _createrID = changeValue("createrID",_createrID,value); }
        }        
				
		private DateTime _createTime;
		
		/// <summary>
		///  
        /// </summary>
		[DataMember]
        public DateTime createTime
        {
            get{ return _createTime; }
            set{ _createTime = changeValue("createTime",_createTime,value); }
        }        
				
		private string _updaterID;
		
		/// <summary>
		///  
        /// </summary>
		[DataMember]
        public string updaterID
        {
            get{ return _updaterID; }
            set{ _updaterID = changeValue("updaterID",_updaterID,value); }
        }        
				
		private DateTime _updateTime;
		
		/// <summary>
		///  
        /// </summary>
		[DataMember]
        public DateTime updateTime
        {
            get{ return _updateTime; }
            set{ _updateTime = changeValue("updateTime",_updateTime,value); }
        }        
		   
	}
}