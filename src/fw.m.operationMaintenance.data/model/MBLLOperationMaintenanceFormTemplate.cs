using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using fw.fwDal;

namespace fw.m.operationMaintenance.data.entity
{
    /// <summary>
    /// 运维模版管理
    /// </summary>
    [DataContract]
    public class MBLLOperationMaintenanceFormTemplate : FWEntityObject
    {
        private string _operationMaintenanceFormTemplateCode;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public string operationMaintenanceFormTemplateCode
        {
            get { return _operationMaintenanceFormTemplateCode; }
            set { _operationMaintenanceFormTemplateCode = changeValue("operationMaintenanceFormTemplateCode", _operationMaintenanceFormTemplateCode, value); }
        }

        private string _operationMaintenanceTaskName;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public string operationMaintenanceTaskName
        {
            get { return _operationMaintenanceTaskName; }
            set { _operationMaintenanceTaskName = changeValue("operationMaintenanceTaskName", _operationMaintenanceTaskName, value); }
        }

        private string _alarmTypeCode;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public string alarmTypeCode
        {
            get { return _alarmTypeCode; }
            set { _alarmTypeCode = changeValue("alarmTypeCode", _alarmTypeCode, value); }
        }

        


        private string _alarmTypeName;

        /// <summary>
        ///  警告名称
        /// </summary>
        [DataMember]
        public string alarmTypeName
        {
            get { return _alarmTypeName; }
            set { _alarmTypeName = changeValue("alarmTypeName", _alarmTypeName, value); }
        }

        private string _operationMaintenanceFormFileName;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public string operationMaintenanceFormFileName
        {
            get { return _operationMaintenanceFormFileName; }
            set { _operationMaintenanceFormFileName = changeValue("operationMaintenanceFormFileName", _operationMaintenanceFormFileName, value); }
        }

        private string _rem;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public string rem
        {
            get { return _rem; }
            set { _rem = changeValue("rem", _rem, value); }
        }

        private int _isDis;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public int isDis
        {
            get { return _isDis; }
            set { _isDis = changeValue("isDis", _isDis, value); }
        }

        private string _createrID;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public string createrID
        {
            get { return _createrID; }
            set { _createrID = changeValue("createrID", _createrID, value); }
        }

        private DateTime _createTime;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public DateTime createTime
        {
            get { return _createTime; }
            set { _createTime = changeValue("createTime", _createTime, value); }
        }

        private string _updaterID;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public string updaterID
        {
            get { return _updaterID; }
            set { _updaterID = changeValue("updaterID", _updaterID, value); }
        }

        private DateTime _updateTime;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public DateTime updateTime
        {
            get { return _updateTime; }
            set { _updateTime = changeValue("updateTime", _updateTime, value); }
        }
    }
}
