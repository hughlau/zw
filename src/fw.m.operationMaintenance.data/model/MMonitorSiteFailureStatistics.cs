using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.operationMaintenance.data.model
{
    /// <summary>
    /// 设施故障统计 
    /// </summary>
    [DataContract]
    public class MMonitorSiteFailureStatistics
    {
        [DataMember]
        public string monitorSiteCode { get; set; }

        /// <summary>
        /// 名称
        /// </summary>
        [DataMember]
        public string monitorSiteName { get; set; }

        /// <summary>
        /// 厂区编码
        /// </summary>
        [DataMember]
        public string cantonCode { get; set; }

        /// <summary>
        /// 厂区名称
        /// </summary>
        [DataMember]
        public string cantonName { get; set; }



        /// <summary>
        /// 故障次数总计
        /// </summary>
        [DataMember]
        public int failureCount { get; set; }


        /// <summary>
        /// 故障时间总计
        /// </summary>
        [DataMember]
        public int failureTimeCount { get; set; }
        
    }
}
