using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using fw.fwDal;

namespace fw.m.autoMonitor.data.model
{
    /// <summary>
    /// 监测点实时数据信息
    /// </summary>
    [DataContract]
    public class MMonitorSiteFactor_Realtime : FWEntityObject
    {
        private string _monitorSiteCode;

        /// <summary>
        /// 监测点
        /// </summary>
        [DataMember]
        public string monitorSiteCode
        {
            get { return _monitorSiteCode; }
            set { _monitorSiteCode = changeValue("monitorSiteCode", _monitorSiteCode, value); }
        }

        /// <summary>
        /// 设施点位名称
        /// </summary>
        [DataMember]
        public string monitorSiteName { get; set; }

        private string _monitorFactorCode;

        /// <summary>
        /// 监测因子
        /// </summary>
        [DataMember]
        public string monitorFactorCode
        {
            get { return _monitorFactorCode; }
            set { _monitorFactorCode = changeValue("monitorFactorCode", _monitorFactorCode, value); }
        }

        /// <summary>
        /// 因子名称
        /// </summary>
        [DataMember]
        public string monitorFactorName { get; set; }

        private DateTime? _monitorTime;

        /// <summary>
        /// 监测时间
        /// </summary>
        [DataMember]
        public DateTime? monitorTime
        {
            get { return _monitorTime; }
            set { _monitorTime = changeValue("monitorTime", _monitorTime, value); }
        }
        private double? _monitorValue;

        /// <summary>
        /// 监测值
        /// </summary>
        [DataMember]
        public double? monitorValue
        {
            get { return _monitorValue; }
            set { _monitorValue = changeValue("monitorValue", _monitorValue, value); }
        }

        /// <summary>
        /// 单位
        /// </summary>
        [DataMember]
        public string monitorUnit { get; set; }

        private int? _dataSource;

        /// <summary>
        /// 数据来源
        /// </summary>
        [DataMember]
        public int? dataSource
        {
            get { return _dataSource; }
            set { _dataSource = changeValue("dataSource", _dataSource, value); }
        }

        /// <summary>
        /// 数据来源
        /// </summary>
        [DataMember]
        public string dataSourceName { get; set; }

        private int? _dataState;

        /// <summary>
        /// 数据状态
        /// </summary>
        [DataMember]
        public int? dataState
        {
            get { return _dataState; }
            set { _dataState = changeValue("dataState", _dataState, value); }
        }

        /// <summary>
        /// 数据状态名称
        /// </summary>
        [DataMember]
        public string dataStateName { get; set; }

        private string _createrID;

        /// <summary>
        /// 创建人
        /// </summary>
        [DataMember]
        public string createrID
        {
            get { return _createrID; }
            set { _createrID = changeValue("createrID", _createrID, value); }
        }

        private string _updaterID;

        /// <summary>
        /// 修改人
        /// </summary>
        [DataMember]
        public string updaterID
        {
            get { return _updaterID; }
            set { _updaterID = changeValue("updaterID", _updaterID, value); }
        }

        private DateTime? _updateTime;

        /// <summary>
        /// 更新时间
        /// </summary>
        [DataMember]
        public DateTime? updateTime
        {
            get { return _updateTime; }
            set { _updateTime = changeValue("updateTime", _updateTime, value); }
        }

        /// <summary>
        /// 设备编号
        /// </summary>
        [DataMember]
        public string equipmentNo { get; set; }

        private string _equipmentCode;

        /// <summary>
        /// 监测点
        /// </summary>
        [DataMember]
        public string equipmentCode
        {
            get { return _equipmentCode; }
            set { _equipmentCode = changeValue("equipmentCode", _equipmentCode, value); }
        }

        private string _waterPumpState;

        /// <summary>
        /// 监测点
        /// </summary>
        [DataMember]
        public string waterPumpState
        {
            get { return _waterPumpState; }
            set { _waterPumpState = changeValue("waterPumpState", _waterPumpState, value); }
        }

        private string _windPumpState;

        /// <summary>
        /// 监测点
        /// </summary>
        [DataMember]
        public string windPumpState
        {
            get { return _windPumpState; }
            set { _windPumpState = changeValue("windPumpState", _windPumpState, value); }
        }

        private string _drugState;
        /// <summary>
        /// 药液状态
        /// </summary>
        [DataMember]
        public string drugState
        {
            get { return _drugState; }
            set { _drugState = changeValue("drugState", _drugState, value); }
        }


        private string _drugPumpState;

        /// <summary>
        /// 药泵状态
        /// </summary>
        [DataMember]
        public string drugPumpState
        {
            get { return _drugPumpState; }
            set { _drugPumpState = changeValue("drugPumpState", _drugPumpState, value); }
        }

        private string _waterLowState;

        /// <summary>
        /// 监测点
        /// </summary>
        [DataMember]
        public string waterLowState
        {
            get { return _waterLowState; }
            set { _waterLowState = changeValue("waterLowState", _waterLowState, value); }
        }

        private string _waterHighState;

        /// <summary>
        /// 监测点
        /// </summary>
        [DataMember]
        public string waterHighState
        {
            get { return _waterHighState; }
            set { _waterHighState = changeValue("waterHighState", _waterHighState, value); }
        }

          private string _monitorSiteTypeName;

        /// <summary>
        /// 监测点
        /// </summary>
        [DataMember]
        public string monitorSiteTypeName
        {
            get { return _monitorSiteTypeName; }
            set { _monitorSiteTypeName = changeValue("monitorSiteTypeName", _monitorSiteTypeName, value); }
        }

        private string _equipmentTypeName;

        /// <summary>
        /// 监测点
        /// </summary>
        [DataMember]
        public string equipmentTypeName
        {
            get { return _equipmentTypeName; }
            set { _equipmentTypeName = changeValue("equipmentTypeName", _equipmentTypeName, value); }
        }

        private string _householdName;

        /// <summary>
        /// 监测点
        /// </summary>
        [DataMember]
        public string householdName
        {
            get { return _householdName; }
            set { _householdName = changeValue("householdName", _householdName, value); }
        }

        private string _cantonName;

        /// <summary>
        /// 监测点
        /// </summary>
        [DataMember]
        public string cantonName
        {
            get { return _cantonName; }
            set { _cantonName = changeValue("cantonName", _cantonName, value); }
        }


        private string _cantonCode;

        /// <summary>
        /// 监测点
        /// </summary>
        [DataMember]
        public string cantonCode
        {
            get { return _cantonCode; }
            set { _cantonCode = changeValue("cantonCode", _cantonCode, value); }
        }


        private string _faultTimeInterval;

        /// <summary>
        /// 监测点
        /// </summary>
        [DataMember]
        public string faultTimeInterval
        {
            get { return _faultTimeInterval; }
            set { _faultTimeInterval = changeValue("faultTimeInterval", _faultTimeInterval, value); }
        }

        private string _faultTimeTotal;

        /// <summary>
        /// 监测点
        /// </summary>
        [DataMember]
        public string faultTimeTotal
        {
            get { return _faultTimeTotal; }
            set { _faultTimeTotal = changeValue("faultTimeTotal", _faultTimeTotal, value); }
        }
    }
}
