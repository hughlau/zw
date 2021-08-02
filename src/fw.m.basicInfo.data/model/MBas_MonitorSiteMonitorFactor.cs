using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using fw.fwDal;

namespace fw.m.basicInfo.data.model
{

    /// <summary>
    /// 监测因子
    /// </summary>
    [DataContract]
    public class MBas_MonitorSiteMonitorFactor : FWEntityObject
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

        private string _monitorSiteName;

        /// <summary>
        /// 设施点位名称
        /// </summary>
        [DataMember]
        public string monitorSiteName
        {
            get { return _monitorSiteName; }
            set { _monitorSiteName = value; }
        }

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

        private string _monitorFactorName;

        /// <summary>
        /// 监测因子
        /// </summary>
        [DataMember]
        public string monitorFactorName
        {
            get { return _monitorFactorName; }
            set { _monitorFactorName = value; }
        }

        private double? _standardUpperLimit;

        /// <summary>
        /// 标准值上限
        /// </summary>
        [DataMember]
        public double? standardUpperLimit
        {
            get { return _standardUpperLimit; }
            set { _standardUpperLimit = changeValue("standardUpperLimit", _standardUpperLimit, value); }
        }

        private double? _standardLowerLimit;

        /// <summary>
        /// 标准值下限
        /// </summary>
        [DataMember]
        public double? standardLowerLimit
        {
            get { return _standardLowerLimit; }
            set { _standardLowerLimit = changeValue("standardLowerLimit", _standardLowerLimit, value); }
        }

        private int? _ix;

        /// <summary>
        /// 排序字段
        /// </summary>
        [DataMember]
        public int? ix
        {
            get { return _ix; }
            set { _ix = changeValue("ix", _ix, value); }
        }

        private string _rem;

        /// <summary>
        /// 备注
        /// </summary>
        [DataMember]
        public string rem
        {
            get { return _rem; }
            set { _rem = changeValue("rem", _rem, value); }
        }

        private int? _isDis;

        /// <summary>
        /// 是否停用
        /// </summary>
        [DataMember]
        public int? isDis
        {
            get { return _isDis; }
            set { _isDis = changeValue("isDis", _isDis, value); }
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
         
        private double? _alarmLowerLimit;

        /// <summary>
        ///  报警下限
        /// </summary>
        [DataMember]
        public double? alarmLowerLimit
        {
            get { return _alarmLowerLimit; }
            set { _alarmLowerLimit = changeValue("alarmLowerLimit", _alarmLowerLimit, value); }
        }


        private double? _alarmUpperLimit;

        /// <summary>
        ///  报警上限
        /// </summary>
        [DataMember]
        public double? alarmUpperLimit
        {
            get { return _alarmUpperLimit; }
            set { _alarmUpperLimit = changeValue("alarmUpperLimit", _alarmUpperLimit, value); }
        }
        private int? _channelNo;

        /// <summary>
        ///  通道号
        /// </summary>
        [DataMember]
        public int? channelNo
        {
            get { return _channelNo; }
            set { _channelNo = changeValue("channelNo", _channelNo, value); }
        }

        private int? _isSwitch;

        /// <summary>
        ///  是否开关量
        /// </summary>
        [DataMember]
        public int? isSwitch
        {
            get { return _isSwitch; }
            set { _isSwitch = changeValue("isSwitch", _isSwitch, value); }
        }

        [DataMember]
        public string action { get; set; }

        [DataMember]
        public string preMonitorFactorCode { get; set; }
    }
}
