using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.autoMonitor.data.model
{
    /// <summary>
    /// 因子信息
    /// </summary>
    [DataContract]
    public class MMonitorSiteFactor
    {
        /// <summary>
        /// 因子编码
        /// </summary>
        [DataMember]
        public string monitorFactorCode { get; set; }

        /// <summary>
        /// 因子名称
        /// </summary>
        [DataMember]
        public string monitorFactorName { get; set; }
    }
}
