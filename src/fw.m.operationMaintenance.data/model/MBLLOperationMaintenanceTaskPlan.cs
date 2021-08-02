using System; 
using System.Collections.Generic; 
using System.Linq; 
using System.Text; 
using System.Runtime.Serialization;
using fw.fwDal; 

namespace fw.m.operationMaintenance.data.model 
{ 
    //MBLLOperationMaintenanceTaskPlan
    [DataContract] 
    public class MBLLOperationMaintenanceTaskPlan : FWEntityObject
    {   

        private Int64 _id;
        /// <summary>
        /// 
        /// 长度为8
        /// 不可为空
        /// </summary>
        [DataMember] 
        public Int64 id 
        {
            get { return _id; } 
            set { _id = changeValue("id",_id,value);  } 
        }

        private String _operationMaintenanceTaskPlanId;
        /// <summary>
        /// 
        /// 长度为36
        /// 不可为空
        /// </summary>
        [DataMember] 
        public String operationMaintenanceTaskPlanId 
        {
            get { return _operationMaintenanceTaskPlanId; } 
            set { _operationMaintenanceTaskPlanId = changeValue("operationMaintenanceTaskPlanId",_operationMaintenanceTaskPlanId,value);  } 
        }

        private String _operationMaintenanceTaskPlanName;
        /// <summary>
        /// 
        /// 长度为512
        /// 不可为空
        /// </summary>
        [DataMember] 
        public String operationMaintenanceTaskPlanName 
        {
            get { return _operationMaintenanceTaskPlanName; } 
            set { _operationMaintenanceTaskPlanName = changeValue("operationMaintenanceTaskPlanName",_operationMaintenanceTaskPlanName,value);  } 
        }

        private Int32 _planType;
        /// <summary>
        /// 
        /// 长度为4
        /// 不可为空
        /// </summary>
        [DataMember] 
        public Int32 planType 
        {
            get { return _planType; } 
            set { _planType = changeValue("planType",_planType,value);  } 
        }

        private Int32 _frequencyType;
        /// <summary>
        /// 
        /// 长度为4
        /// 不可为空
        /// </summary>
        [DataMember] 
        public Int32 frequencyType 
        {
            get { return _frequencyType; } 
            set { _frequencyType = changeValue("frequencyType",_frequencyType,value);  } 
        }

        private Int32? _startMonth;
        /// <summary>
        /// 
        /// 长度为4
        /// 可为空
        /// </summary>
        [DataMember] 
        public Int32? startMonth 
        {
            get { return _startMonth; } 
            set { _startMonth = changeValue("startMonth",_startMonth,value);  } 
        }

        private Int32? _startDay;
        /// <summary>
        /// 
        /// 长度为4
        /// 可为空
        /// </summary>
        [DataMember] 
        public Int32? startDay 
        {
            get { return _startDay; } 
            set { _startDay = changeValue("startDay",_startDay,value);  } 
        }

        private Int32? _endMonth;
        /// <summary>
        /// 
        /// 长度为4
        /// 可为空
        /// </summary>
        [DataMember] 
        public Int32? endMonth 
        {
            get { return _endMonth; } 
            set { _endMonth = changeValue("endMonth",_endMonth,value);  } 
        }

        private Int32? _endDay;
        /// <summary>
        /// 
        /// 长度为4
        /// 可为空
        /// </summary>
        [DataMember] 
        public Int32? endDay 
        {
            get { return _endDay; } 
            set { _endDay = changeValue("endDay",_endDay,value);  } 
        }

        private String _operationMaintenanceUnitCode;
        /// <summary>
        /// 
        /// 长度为36
        /// 不可为空
        /// </summary>
        [DataMember] 
        public String operationMaintenanceUnitCode 
        {
            get { return _operationMaintenanceUnitCode; } 
            set { _operationMaintenanceUnitCode = changeValue("operationMaintenanceUnitCode",_operationMaintenanceUnitCode,value);  } 
        }

        private String _operationMaintenancePersonCode;
        /// <summary>
        /// 
        /// 长度为36
        /// 不可为空
        /// </summary>
        [DataMember] 
        public String operationMaintenancePersonCode 
        {
            get { return _operationMaintenancePersonCode; } 
            set { _operationMaintenancePersonCode = changeValue("operationMaintenancePersonCode",_operationMaintenancePersonCode,value);  } 
        }

        private String _createrID;
        /// <summary>
        /// 
        /// 长度为36
        /// 不可为空
        /// </summary>
        [DataMember] 
        public String createrID 
        {
            get { return _createrID; } 
            set { _createrID = changeValue("createrID",_createrID,value);  } 
        }

        private DateTime _createTime;
        /// <summary>
        /// 
        /// 长度为8
        /// 不可为空
        /// </summary>
        [DataMember] 
        public DateTime createTime 
        {
            get { return _createTime; } 
            set { _createTime = changeValue("createTime",_createTime,value);  } 
        }

        private String _updaterID;
        /// <summary>
        /// 
        /// 长度为36
        /// 不可为空
        /// </summary>
        [DataMember] 
        public String updaterID 
        {
            get { return _updaterID; } 
            set { _updaterID = changeValue("updaterID",_updaterID,value);  } 
        }

        private DateTime _updateTime;
        /// <summary>
        /// 
        /// 长度为8
        /// 不可为空
        /// </summary>
        [DataMember] 
        public DateTime updateTime 
        {
            get { return _updateTime; } 
            set { _updateTime = changeValue("updateTime",_updateTime,value);  } 
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