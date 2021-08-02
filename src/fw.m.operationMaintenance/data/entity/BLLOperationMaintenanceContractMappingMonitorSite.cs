using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwDal;

namespace fw.m.operationMaintenance.data.entity
{
    public class BLLOperationMaintenanceContractMappingMonitorSite : FWEntityObject
    {
        private long? _id;

        /// <summary>
        /// id
        /// </summary>

        public long? id
        {
            get { return _id; }
            set { _id = value; }
        }

        private string _dataID;

        /// <summary>
        /// dataID
        /// </summary>

        public string dataID
        {
            get { return _dataID; }
            set { _dataID = changeValue("dataID", _dataID, value); }
        }

        private string _operationMaintenanceContractCode;

        /// <summary>
        /// 用户ID
        /// </summary>

        public string operationMaintenanceContractCode
        {
            get { return _operationMaintenanceContractCode; }
            set { _operationMaintenanceContractCode = changeValue("operationMaintenanceContractCode", _operationMaintenanceContractCode, value); }
        }

        private string _monitorSiteCode;

        /// <summary>
        /// 用户ID
        /// </summary>

        public string monitorSiteCode
        {
            get { return _monitorSiteCode; }
            set { _monitorSiteCode = changeValue("monitorSiteCode", _monitorSiteCode, value); }
        }

        private string _createrID;

        /// <summary>
        /// createrID
        /// </summary>

        public string createrID
        {
            get { return _createrID; }
            set { _createrID = changeValue("createrID", _createrID, value); }
        }

        private DateTime? _createTime;

        /// <summary>
        /// createTime
        /// </summary>

        public DateTime? createTime
        {
            get { return _createTime; }
            set { _createTime = changeValue("createTime", _createTime, value); }
        }

        private string _updaterID;

        /// <summary>
        /// updaterID
        /// </summary>

        public string updaterID
        {
            get { return _updaterID; }
            set { _updaterID = changeValue("updaterID", _updaterID, value); }
        }

        private DateTime? _updateTime;

        /// <summary>
        /// updateTime
        /// </summary>

        public DateTime? updateTime
        {
            get { return _updateTime; }
            set { _updateTime = changeValue("updateTime", _updateTime, value); }
        }
    }
}
