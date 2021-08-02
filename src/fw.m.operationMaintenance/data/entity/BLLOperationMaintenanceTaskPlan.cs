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
	public class BLLOperationMaintenanceTaskPlan : FWEntityObject
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
				
		private string _operationMaintenanceTaskPlanName;
		
		/// <summary>
		///  
        /// </summary>
		[DataMember]
        public string operationMaintenanceTaskPlanName
        {
            get{ return _operationMaintenanceTaskPlanName; }
            set{ _operationMaintenanceTaskPlanName = changeValue("operationMaintenanceTaskPlanName",_operationMaintenanceTaskPlanName,value); }
        }        
				
		private int _planType;
		
		/// <summary>
		///  
        /// </summary>
		[DataMember]
        public int planType
        {
            get{ return _planType; }
            set{ _planType = changeValue("planType",_planType,value); }
        }        
				
		private int _frequencyType;
		
		/// <summary>
		///  
        /// </summary>
		[DataMember]
        public int frequencyType
        {
            get{ return _frequencyType; }
            set{ _frequencyType = changeValue("frequencyType",_frequencyType,value); }
        }        
				
		private int _startMonth;
		
		/// <summary>
		///  
        /// </summary>
		[DataMember]
        public int startMonth
        {
            get{ return _startMonth; }
            set{ _startMonth = changeValue("startMonth",_startMonth,value); }
        }        
				
		private int _startDay;
		
		/// <summary>
		///  
        /// </summary>
		[DataMember]
        public int startDay
        {
            get{ return _startDay; }
            set{ _startDay = changeValue("startDay",_startDay,value); }
        }        
				
		private int _endMonth;
		
		/// <summary>
		///  
        /// </summary>
		[DataMember]
        public int endMonth
        {
            get{ return _endMonth; }
            set{ _endMonth = changeValue("endMonth",_endMonth,value); }
        }        
				
		private int _endDay;
		
		/// <summary>
		///  
        /// </summary>
		[DataMember]
        public int endDay
        {
            get{ return _endDay; }
            set{ _endDay = changeValue("endDay",_endDay,value); }
        }        
				
		private string _operationMaintenanceUnitCode;
		
		/// <summary>
		///  
        /// </summary>
		[DataMember]
        public string operationMaintenanceUnitCode
        {
            get{ return _operationMaintenanceUnitCode; }
            set{ _operationMaintenanceUnitCode = changeValue("operationMaintenanceUnitCode",_operationMaintenanceUnitCode,value); }
        }        
				
		private string _operationMaintenancePersonCode;
		
		/// <summary>
		///  
        /// </summary>
		[DataMember]
        public string operationMaintenancePersonCode
        {
            get{ return _operationMaintenancePersonCode; }
            set{ _operationMaintenancePersonCode = changeValue("operationMaintenancePersonCode",_operationMaintenancePersonCode,value); }
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

        private int _isValid;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public int isValid
        {
            get { return _isValid; }
            set { _isValid = changeValue("isValid", _isValid, value); }
        }

        private string _remark;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public string remark
        {
            get { return _remark; }
            set { _remark = changeValue("remark", _remark, value); }
        } 
	}
}