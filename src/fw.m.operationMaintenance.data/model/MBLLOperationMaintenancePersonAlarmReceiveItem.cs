using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using fw.fwDal;

namespace fw.m.operationMaintenance.data.model
{
    /// <summary>
    /// 运维人员接警项目
    /// </summary>
    [DataContract]
    public class MBLLOperationMaintenancePersonAlarmReceiveItem : FWEntityObject
    {
        private string _dataID;

        /// <summary>
        ///  主键
        /// </summary>
        [DataMember]
        public string dataID
        {
            get { return _dataID; }
            set { _dataID = changeValue("dataID", _dataID, value); }
        }

        private string _operationMaintenancePersonCode;

        /// <summary>
        ///  运维人员编码
        /// </summary>
        [DataMember]
        public string operationMaintenancePersonCode
        {
            get { return _operationMaintenancePersonCode; }
            set { _operationMaintenancePersonCode = changeValue("operationMaintenancePersonCode", _operationMaintenancePersonCode, value); }
        }

        private string _alarmReceiveTypeCode;

        /// <summary>
        ///  报警接收类型编码
        /// </summary>
        [DataMember]
        public string alarmReceiveTypeCode
        {
            get { return _alarmReceiveTypeCode; }
            set { _alarmReceiveTypeCode = changeValue("alarmReceiveTypeCode", _alarmReceiveTypeCode, value); }
        }

        private int _ix;

        /// <summary>
        ///  顺序
        /// </summary>
        [DataMember]
        public int ix
        {
            get { return _ix; }
            set { _ix = changeValue("ix", _ix, value); }
        }

        private string _createrID;

        /// <summary>
        ///  添加人
        /// </summary>
        [DataMember]
        public string createrID
        {
            get { return _createrID; }
            set { _createrID = changeValue("createrID", _createrID, value); }
        }

        private DateTime? _createTime;

        /// <summary>
        ///  添加时间
        /// </summary>
        [DataMember]
        public DateTime? createTime
        {
            get { return _createTime; }
            set { _createTime = changeValue("createTime", _createTime, value); }
        }

        private string _updaterID;

        /// <summary>
        ///  更新人
        /// </summary>
        [DataMember]
        public string updaterID
        {
            get { return _updaterID; }
            set { _updaterID = changeValue("updaterID", _updaterID, value); }
        }

        private DateTime? _updateTime;

        /// <summary>
        ///  更新时间
        /// </summary>
        [DataMember]
        public DateTime? updateTime
        {
            get { return _updateTime; }
            set { _updateTime = changeValue("updateTime", _updateTime, value); }
        }
    }
}
