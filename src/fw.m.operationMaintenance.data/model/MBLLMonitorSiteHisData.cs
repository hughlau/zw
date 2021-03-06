using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using fw.fwDal;

namespace fw.m.operationMaintenance.data.model
{

    /// <summary>
    /// 监测历史数据
    /// </summary>
    [DataContract]
    public class MBLLMonitorSiteHisData : FWEntityObject
    {

        private string _cantonCode;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public string cantonCode
        {
            get { return _cantonCode; }
            set { _cantonCode = changeValue("cantonCode", _cantonCode, value); }
        }

        private DateTime _monitorTime;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public DateTime monitorTime
        {
            get { return _monitorTime; }
            set { _monitorTime = changeValue("monitorTime", _monitorTime, value); }
        }

        private string _monitorSiteCode;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public string monitorSiteCode
        {
            get { return _monitorSiteCode; }
            set { _monitorSiteCode = changeValue("monitorSiteCode", _monitorSiteCode, value); }
        }

        private string _monitorFactorCode;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public string monitorFactorCode
        {
            get { return _monitorFactorCode; }
            set { _monitorFactorCode = changeValue("monitorFactorCode", _monitorFactorCode, value); }
        }

        private double? _monitorValue;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public double? monitorValue
        {
            get { return _monitorValue; }
            set { _monitorValue = changeValue("monitorValue", _monitorValue, value); }
        }

        private int? _dataSource;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public int? dataSource
        {
            get { return _dataSource; }
            set { _dataSource = changeValue("dataSource", _dataSource, value); }
        }

        private int? _dataState;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public int? dataState
        {
            get { return _dataState; }
            set { _dataState = changeValue("dataState", _dataState, value); }
        }

        private string _dataStateName;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public string dataStateName
        {
            get { return _dataStateName; }
            set { _dataStateName = changeValue("dataStateName", _dataStateName, value); }
        }

        private DateTime? _createTime;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public DateTime? createTime
        {
            get { return _createTime; }
            set { _createTime = changeValue("createTime", _createTime, value); }
        }

        private string _createTimeFormat;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public string createTimeFormat
        {
            get { return _createTimeFormat; }
            set { _createTimeFormat = changeValue("createTimeFormat", _createTimeFormat, value); }
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

        private DateTime? _updateTime;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public DateTime? updateTime
        {
            get { return _updateTime; }
            set { _updateTime = changeValue("updateTime", _updateTime, value); }
        }
    }
}
