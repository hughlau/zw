using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using fw.fwDal;

namespace fw.m.basicInfo.data.model
{
    /// <summary>
    /// 设备零部件
    /// </summary>
    [DataContract, Serializable]
    public class MBLLMonitorRunTime : FWEntityObject
    {

        private string _monitorSiteName;

        /// <summary>
        /// 设施点位名称
        /// </summary>
        [DataMember]
        public string monitorSiteName
        {
            get { return _monitorSiteName; }
            set { _monitorSiteName = changeValue("monitorSiteName", _monitorSiteName, value); }
        }


        private string _equipmentNo;

        /// <summary>
        /// 设备编码
        /// </summary>
        [DataMember]
        public string equipmentNo
        {
            get { return _equipmentNo; }
            set { _equipmentNo = changeValue("equipmentNo", _equipmentNo, value); }
        }

        private string _householdName;

        /// <summary>
        /// 户主名称
        /// </summary>
        [DataMember]
        public string householdName
        {
            get { return _householdName; }
            set { _householdName = changeValue("householdName", _householdName, value); }
        }
        private string _jianzhizhen;

        /// <summary>
        /// 建制镇
        /// </summary>
        [DataMember]
        public string jianzhizhen
        {
            get { return _jianzhizhen; }
            set { _jianzhizhen = changeValue("jianzhizhen", _jianzhizhen, value); }
        }

        private string _xingzhengcun;

        /// <summary>
        /// 行政村
        /// </summary>
        [DataMember]
        public string xingzhengcun
        {
            get { return _xingzhengcun; }
            set { _xingzhengcun = changeValue("xingzhengcun", _xingzhengcun, value); }
        }

        private string _zirancun;

        /// <summary>
        /// 自然村
        /// </summary>
        [DataMember]
        public string zirancun
        {
            get { return _zirancun; }
            set { _zirancun = changeValue("zirancun", _zirancun, value); }
        }

        private string _datastate;

        /// <summary>
        ///  设备当前状态
        /// </summary>
        [DataMember]
        public string datastate
        {
            get { return _datastate; }
            set { _datastate = changeValue("datastate", _datastate, value); }
        }

        private int _timeSpanAll;

        /// <summary>
        ///  查询区间总时间
        /// </summary>
        [DataMember]
        public int timeSpanAll
        {
            get { return _timeSpanAll; }
            set { _timeSpanAll = changeValue("timeSpanAll", _timeSpanAll, value); }
        }

        private int _offlineTime;

        /// <summary>
        ///  通许故障掉线时间
        /// </summary>
        [DataMember]
        public int offlineTime
        {
            get { return _offlineTime; }
            set { _offlineTime = changeValue("offlineTime", _offlineTime, value); }
        }

        private int _onlineTime;

        /// <summary>
        ///  设备在线时间
        /// </summary>
        [DataMember]
        public int onlineTime
        {
            get { return _onlineTime; }
            set { _onlineTime = changeValue("onlineTime", _onlineTime, value); }
        }

        private int _offlineTimeAll;

        /// <summary>
        ///  设备总掉线时间
        /// </summary>
        [DataMember]
        public int offlineTimeAll
        {
            get { return _offlineTimeAll; }
            set { _offlineTimeAll = changeValue("offlineTimeAll", _offlineTimeAll, value); }
        }


        private int _powerOffTime;

        /// <summary>
        ///  设备供电故障时间
        /// </summary>
        [DataMember]
        public int powerOffTime
        {
            get { return _powerOffTime; }
            set { _powerOffTime = changeValue("powerOffTime", _powerOffTime, value); }
        }

        private string _onlineTimeRate;

        /// <summary>
        ///  设备在线率
        /// </summary>
        [DataMember]
        public string onlineTimeRate
        {
            get { return _onlineTimeRate; }
            set { _onlineTimeRate = changeValue("onlineTimeRate", _onlineTimeRate, value); }
        }

        private string _onlineTimeRatePower;

        /// <summary>
        ///  排除供电故障设备在线率
        /// </summary>
        [DataMember]
        public string onlineTimeRatePower
        {
            get { return _onlineTimeRatePower; }
            set { _onlineTimeRatePower = changeValue("onlineTimeRatePower", _onlineTimeRatePower, value); }
        }

        private DateTime? _acceptanceTime;

        /// <summary>
        ///  验收时间
        /// </summary>
        [DataMember]
        public DateTime? acceptanceTime
        {
            get { return _acceptanceTime; }
            set { _acceptanceTime = changeValue("acceptanceTime", _acceptanceTime, value); }
        }

        private DateTime? _offlineBeginTime;

        /// <summary>
        ///  掉线开始时间
        /// </summary>
        [DataMember]
        public DateTime? offlineBeginTime
        {
            get { return _offlineBeginTime; }
            set { _offlineBeginTime = changeValue("offlineBeginTime", _offlineBeginTime, value); }
        }
        private DateTime? _offlineEndTime;

        /// <summary>
        ///  掉线恢复开始时间
        /// </summary>
        [DataMember]
        public DateTime? offlineEndTime
        {
            get { return _offlineEndTime; }
            set { _offlineEndTime = changeValue("offlineEndTime", _offlineEndTime, value); }
        }

    }
}
