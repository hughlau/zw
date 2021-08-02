using System; 
using System.Collections.Generic; 
using System.Linq; 
using System.Text; 
using System.Runtime.Serialization;
using fw.fwDal; 

namespace fw.m.operationMaintenance.data.model 
{ 
    //MBLLOperationMaintenanceTaskExec
    [DataContract] 
    public class MBLLOperationMaintenanceTaskExec : FWEntityObject
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

        private String _operationMaintenanceTaskExecId;
        /// <summary>
        /// 
        /// 长度为36
        /// 不可为空
        /// </summary>
        [DataMember] 
        public String operationMaintenanceTaskExecId 
        {
            get { return _operationMaintenanceTaskExecId; } 
            set { _operationMaintenanceTaskExecId = changeValue("operationMaintenanceTaskExecId",_operationMaintenanceTaskExecId,value);  } 
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

        private String _operationMaintenanceTaskExecName;
        /// <summary>
        /// 
        /// 长度为512
        /// 可为空
        /// </summary>
        [DataMember] 
        public String operationMaintenanceTaskExecName 
        {
            get { return _operationMaintenanceTaskExecName; } 
            set { _operationMaintenanceTaskExecName = changeValue("operationMaintenanceTaskExecName",_operationMaintenanceTaskExecName,value);  } 
        }

        private Int32? _operationYear;
        /// <summary>
        /// 
        /// 长度为4
        /// 可为空
        /// </summary>
        [DataMember] 
        public Int32? operationYear 
        {
            get { return _operationYear; } 
            set { _operationYear = changeValue("operationYear",_operationYear,value);  } 
        }

        private Int32? _operationMonth;
        /// <summary>
        /// 
        /// 长度为4
        /// 可为空
        /// </summary>
        [DataMember] 
        public Int32? operationMonth 
        {
            get { return _operationMonth; } 
            set { _operationMonth = changeValue("operationMonth",_operationMonth,value);  } 
        }

        private Int32? _isValid;
        /// <summary>
        /// 
        /// 长度为4
        /// 可为空
        /// </summary>
        [DataMember] 
        public Int32? isValid 
        {
            get { return _isValid; } 
            set { _isValid = changeValue("isValid",_isValid,value);  } 
        }

        private Int32? _status;
        /// <summary>
        /// 
        /// 长度为4
        /// 可为空
        /// </summary>
        [DataMember] 
        public Int32? status 
        {
            get { return _status; } 
            set { _status = changeValue("status",_status,value);  } 
        }

        private DateTime? _formTime;
        /// <summary>
        /// 
        /// 长度为8
        /// 可为空
        /// </summary>
        [DataMember] 
        public DateTime? formTime 
        {
            get { return _formTime; } 
            set { _formTime = changeValue("formTime",_formTime,value);  } 
        }

        private DateTime? _execTime;
        /// <summary>
        /// 
        /// 长度为8
        /// 可为空
        /// </summary>
        [DataMember] 
        public DateTime? execTime 
        {
            get { return _execTime; } 
            set { _execTime = changeValue("execTime",_execTime,value);  } 
        }

        private DateTime _endTime;
        /// <summary>
        /// 
        /// 长度为8
        /// 不可为空
        /// </summary>
        [DataMember] 
        public DateTime endTime 
        {
            get { return _endTime; } 
            set { _endTime = changeValue("endTime",_endTime,value);  } 
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

    }
}