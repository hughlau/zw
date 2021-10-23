using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.autoMonitor.data.model
{
    /// <summary>
    /// 监测数据查询
    /// </summary>
    [DataContract]
    public class MMonitorSiteLatestData
    {
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
        /// 设施点位名称
        /// </summary>
        [DataMember]
        public string monitorSiteName { get; set; }

        /// <summary>
        /// 设施点位编码
        /// </summary>
        [DataMember]
        public string monitorSiteCode { get; set; }

        /// <summary>
        /// 因子名称
        /// </summary>
        [DataMember]
        public string monitorFactorName { get; set; }
        /// <summary>
        /// 因子编码
        /// </summary>
        [DataMember]
        public string monitorFactorCode { get; set; }

        /// <summary>
        /// 监测时间
        /// </summary>
        [DataMember]
        public DateTime? monitorDate { get; set; }

        /// <summary>
        /// 监测值
        /// </summary>
        [DataMember]
        public double? monitorValue { get; set; }

        [DataMember]
        public string statusName { get; set; }

        /// <summary>
        /// 状态编码
        /// </summary>
        [DataMember]
        public int? statusCode { get; set; }

        /// <summary>
        /// 单位名称
        /// </summary>
        [DataMember]
        public string unitName { get; set; }

    }
}
