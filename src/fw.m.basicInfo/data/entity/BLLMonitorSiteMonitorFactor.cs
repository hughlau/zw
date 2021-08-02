using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using fw.fwDal;

namespace fw.m.basicInfo.data.entity
{
    public class BLLMonitorSiteMonitorFactor : FWEntityObject
    {
        private long _id;

        /// <summary>
        /// 自动增长列
        /// </summary>

        public long id
        {
            get { return _id; }
            set { _id = value; }
        }
        private string _dataID;

        /// <summary>
        /// 数据ID
        /// </summary>
        public string dataID
        {
            get { return _dataID; }
            set { _dataID = changeValue("dataID", _dataID, value); }
        }


        private string _equipmentCode;

        /// <summary>
        /// 设备
        /// </summary>
        [DataMember]
        public string equipmentCode
        {
            get { return _equipmentCode; }
            set { _equipmentCode = changeValue("equipmentCode", _equipmentCode, value); }
        }

        private string _monitorSiteCode;

        /// <summary>
        /// 监测点
        /// </summary>

        public string monitorSiteCode
        {
            get { return _monitorSiteCode; }
            set { _monitorSiteCode = changeValue("monitorSiteCode", _monitorSiteCode, value); }
        }

        private string _monitorFactorCode;

        /// <summary>
        /// 监测因子
        /// </summary>
        public string monitorFactorCode
        {
            get { return _monitorFactorCode; }
            set { _monitorFactorCode = changeValue("monitorFactorCode", _monitorFactorCode, value); }
        }

        private double? _standardUpperLimit;

        /// <summary>
        /// 标准值上限
        /// </summary>

        public double? standardUpperLimit
        {
            get { return _standardUpperLimit; }
            set { _standardUpperLimit = changeValue("standardUpperLimit", _standardUpperLimit, value); }
        }

        private double? _standardLowerLimit;

        /// <summary>
        /// 标准值下限
        /// </summary>

        public double? standardLowerLimit
        {
            get { return _standardLowerLimit; }
            set { _standardLowerLimit = changeValue("standardLowerLimit", _standardLowerLimit, value); }
        }

        private int? _ix;

        /// <summary>
        /// 排序字段
        /// </summary>
        public int? ix
        {
            get { return _ix; }
            set { _ix = changeValue("ix", _ix, value); }
        }

        private string _rem;

        /// <summary>
        /// 备注
        /// </summary>

        public string rem
        {
            get { return _rem; }
            set { _rem = changeValue("rem", _rem, value); }
        }

        private int? _isDis;

        /// <summary>
        /// 是否停用
        /// </summary>

        public int? isDis
        {
            get { return _isDis; }
            set { _isDis = changeValue("isDis", _isDis, value); }
        }
        private string _createrID;

        /// <summary>
        /// 创建人
        /// </summary>

        public string createrID
        {
            get { return _createrID; }
            set { _createrID = changeValue("createrID", _createrID, value); }
        }

        private DateTime? _createTime;

        /// <summary>
        /// 创建时间
        /// </summary>

        public DateTime? createTime
        {
            get { return _createTime; }
            set { _createTime = changeValue("createTime", _createTime, value); }
        }

        private string _updaterID;

        /// <summary>
        /// 更新人
        /// </summary>

        public string updaterID
        {
            get { return _updaterID; }
            set { _updaterID = changeValue("updaterID", _updaterID, value); }
        }

        private DateTime? _updateTime;

        /// <summary>
        /// 更新时间
        /// </summary>

        public DateTime? updateTime
        {
            get { return _updateTime; }
            set { _updateTime = changeValue("updateTime", _updateTime, value); }
        }
        private int? _channelNo;

        /// <summary>
        ///  通道号
        /// </summary> 
        public int? channelNo
        {
            get { return _channelNo; }
            set { _channelNo = changeValue("channelNo", _channelNo, value); }
        }

        private int? _isSwitch;

        /// <summary>
        ///  是否开关量
        /// </summary> 
        public int? isSwitch
        {
            get { return _isSwitch; }
            set { _isSwitch = changeValue("isSwitch", _isSwitch, value); }
        }

        private double? _alarmLowerLimit;

        /// <summary>
        ///  报警下限
        /// </summary> 
        public double? alarmLowerLimit
        {
            get { return _alarmLowerLimit; }
            set { _alarmLowerLimit = changeValue("alarmLowerLimit", _alarmLowerLimit, value); }
        }


        private double? _alarmUpperLimit;

        /// <summary>
        ///  报警上限
        /// </summary> 
        public double? alarmUpperLimit
        {
            get { return _alarmUpperLimit; }
            set { _alarmUpperLimit = changeValue("alarmUpperLimit", _alarmUpperLimit, value); }
        }
    }
}
