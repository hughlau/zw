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
        /// ����Ϊ8
        /// ����Ϊ��
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
        /// ����Ϊ36
        /// ����Ϊ��
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
        /// ����Ϊ36
        /// ����Ϊ��
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
        /// ����Ϊ36
        /// ����Ϊ��
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
        /// ����Ϊ4
        /// ��Ϊ��
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
        /// ����Ϊ36
        /// ����Ϊ��
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
        /// ����Ϊ8
        /// ����Ϊ��
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
        /// ����Ϊ36
        /// ����Ϊ��
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
        /// ����Ϊ8
        /// ����Ϊ��
        /// </summary>
        [DataMember] 
        public DateTime updateTime 
        {
            get { return _updateTime; } 
            set { _updateTime = changeValue("updateTime",_updateTime,value);  } 
        }

    }
}