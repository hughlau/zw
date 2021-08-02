using System; 
using System.Collections.Generic; 
using System.Linq; 
using System.Text; 
using System.Runtime.Serialization;
using fw.fwDal; 

namespace fw.m.operationMaintenance.data.model 
{ 
    //MBLLOperationMaintenanceTaskPlanD
    [DataContract] 
    public class MBLLOperationMaintenanceTaskPlanD : FWEntityObject
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

        private String _operationMaintenanceTaskPlanDId;
        /// <summary>
        /// 
        /// 长度为36
        /// 不可为空
        /// </summary>
        [DataMember] 
        public String operationMaintenanceTaskPlanDId 
        {
            get { return _operationMaintenanceTaskPlanDId; } 
            set { _operationMaintenanceTaskPlanDId = changeValue("operationMaintenanceTaskPlanDId",_operationMaintenanceTaskPlanDId,value);  } 
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

        private String _monitorSiteCode;
        /// <summary>
        /// 
        /// 长度为36
        /// 不可为空
        /// </summary>
        [DataMember] 
        public String monitorSiteCode 
        {
            get { return _monitorSiteCode; } 
            set { _monitorSiteCode = changeValue("monitorSiteCode",_monitorSiteCode,value);  } 
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