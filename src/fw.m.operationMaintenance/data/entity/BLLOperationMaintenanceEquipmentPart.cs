using System; 
using System.Collections.Generic; 
using System.Linq; 
using System.Text; 
using System.Runtime.Serialization;
using fw.fwDal; 

namespace fw.m.operationMaintenance.data.entity 
{ 
    //BLLOperationMaintenanceEquipmentPart
    [DataContract] 
    public class BLLOperationMaintenanceEquipmentPart : FWEntityObject
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

        private String _OMEP_ID;
        /// <summary>
        /// 
        /// ����Ϊ36
        /// ����Ϊ��
        /// </summary>
        [DataMember]
        public String OMEP_ID
        {
            get { return _OMEP_ID; }
            set { _OMEP_ID = changeValue("OMEP_ID", _OMEP_ID, value); }
        }

        private String _operationMaintenanceTaskCode;
        /// <summary>
        /// 
        /// ����Ϊ36
        /// ����Ϊ��
        /// </summary>
        [DataMember] 
        public String operationMaintenanceTaskCode 
        {
            get { return _operationMaintenanceTaskCode; } 
            set { _operationMaintenanceTaskCode = changeValue("operationMaintenanceTaskCode",_operationMaintenanceTaskCode,value);  } 
        }

        private String _partCode;
        /// <summary>
        /// 
        /// ����Ϊ36
        /// ����Ϊ��
        /// </summary>
        [DataMember] 
        public String partCode 
        {
            get { return _partCode; } 
            set { _partCode = changeValue("partCode",_partCode,value);  } 
        }

        private Int32? _changeNum;
        /// <summary>
        /// 
        /// ����Ϊ4
        /// ��Ϊ��
        /// </summary>
        [DataMember] 
        public Int32? changeNum 
        {
            get { return _changeNum; } 
            set { _changeNum = changeValue("changeNum",_changeNum,value);  } 
        }

        private String _creater;
        /// <summary>
        /// 
        /// ����Ϊ36
        /// ����Ϊ��
        /// </summary>
        [DataMember] 
        public String creater 
        {
            get { return _creater; } 
            set { _creater = changeValue("creater",_creater,value);  } 
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

        private String _updater;
        /// <summary>
        /// 
        /// ����Ϊ36
        /// ����Ϊ��
        /// </summary>
        [DataMember] 
        public String updater 
        {
            get { return _updater; } 
            set { _updater = changeValue("updater",_updater,value);  } 
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