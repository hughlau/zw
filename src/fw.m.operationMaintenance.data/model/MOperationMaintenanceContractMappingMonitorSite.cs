using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using fw.fwDal;

namespace fw.m.operationMaintenance.data.model
{

    /// <summary>
    /// 运维合同映射监测点
    /// </summary>
    [DataContract]
    public class MOperationMaintenanceContractMappingMonitorSite : FWEntityObject
    {
        private long? _id;

        /// <summary>
        /// id
        /// </summary>
        [DataMember]
        public long? id
        {
            get { return _id; }
            set { _id = value; }
        }

        private string _cantonCode;

        /// <summary>
        /// 厂区编码
        /// </summary>
        [DataMember]
        public string cantonCode
        {
            get { return _cantonCode; }
            set { _cantonCode = value; }
        }

        private string _cantonName;

        /// <summary>
        /// 厂区名称
        /// </summary>
        [DataMember]
        public string cantonName
        {
            get { return _cantonName; }
            set { _cantonName = value; }
        }

        private string _monitorSiteName;

        /// <summary>
        /// </summary>
        [DataMember]
        public string monitorSiteName
        {
            get { return _monitorSiteName; }
            set { _monitorSiteName = value; }
        }

        private string _dataID;

        /// <summary>
        /// dataID
        /// </summary>
        [DataMember]
        public string dataID
        {
            get { return _dataID; }
            set { _dataID = changeValue("dataID", _dataID, value); }
        }

        private string _operationMaintenanceContractCode;

        /// <summary>
        /// 用户ID
        /// </summary>
        [DataMember]
        public string operationMaintenanceContractCode
        {
            get { return _operationMaintenanceContractCode; }
            set { _operationMaintenanceContractCode = changeValue("operationMaintenanceContractCode", _operationMaintenanceContractCode, value); }
        }

        private string _monitorSiteCode;

        /// <summary>
        /// 用户ID
        /// </summary>
        [DataMember]
        public string monitorSiteCode
        {
            get { return _monitorSiteCode; }
            set { _monitorSiteCode = changeValue("monitorSiteCode", _monitorSiteCode, value); }
        }

        private string _createrID;

        /// <summary>
        /// createrID
        /// </summary>
        [DataMember]
        public string createrID
        {
            get { return _createrID; }
            set { _createrID = changeValue("createrID", _createrID, value); }
        }

        private DateTime? _createTime;

        /// <summary>
        /// createTime
        /// </summary>
        [DataMember]
        public DateTime? createTime
        {
            get { return _createTime; }
            set { _createTime = changeValue("createTime", _createTime, value); }
        }

        private string _updaterID;

        /// <summary>
        /// updaterID
        /// </summary>
        [DataMember]
        public string updaterID
        {
            get { return _updaterID; }
            set { _updaterID = changeValue("updaterID", _updaterID, value); }
        }

        private DateTime? _updateTime;

        /// <summary>
        /// updateTime
        /// </summary>
        [DataMember]
        public DateTime? updateTime
        {
            get { return _updateTime; }
            set { _updateTime = changeValue("updateTime", _updateTime, value); }
        }
        private int? _isDis;

        /// <summary>
        /// 删除状态
        /// </summary>
        [DataMember]
        public int? isDis
        {
            get { return _isDis; }
            set { _isDis = value; }
        }
    }
}
