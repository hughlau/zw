using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using fw.fwDal;

namespace fw.m.operationMaintenance.data.entity
{
    /// <summary>
    /// 治理设施运行时间表
    /// </summary>
    [DataContract]
    public class BLLMonitorSiteRunningTimeData : FWEntityObject
    {



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

        private DateTime? _monitorSiteStartTime;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public DateTime? monitorSiteStartTime
        {
            get { return _monitorSiteStartTime; }
            set { _monitorSiteStartTime = changeValue("monitorSiteStartTime", _monitorSiteStartTime, value); }
        }

        private DateTime? _monitorSiteStopTime;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public DateTime? monitorSiteStopTime
        {
            get { return _monitorSiteStopTime; }
            set { _monitorSiteStopTime = changeValue("monitorSiteStopTime", _monitorSiteStopTime, value); }
        }

        private int? _interval;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public int? interval
        {
            get { return _interval; }
            set { _interval = changeValue("interval", _interval, value); }
        }

    }
}
