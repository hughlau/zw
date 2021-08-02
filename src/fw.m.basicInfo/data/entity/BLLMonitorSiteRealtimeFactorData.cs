
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using fw.fwDal;

namespace fw.m.basicInfo.data.entity
{

    [DataContract]
    public class BLLMonitorSiteRealtimeFactorData : FWEntityObject
    {


        private DateTime? _monitorTime;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public DateTime? monitorTime
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


        private string _equipmentCode;

        /// <summary>
        ///  设备主键
        /// </summary>
        [DataMember]
        public string equipmentCode
        {
            get { return _equipmentCode; }
            set { _equipmentCode = changeValue("equipmentCode", _equipmentCode, value); }
        }
    }
}
