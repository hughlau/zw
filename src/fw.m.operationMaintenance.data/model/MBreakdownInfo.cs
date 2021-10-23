using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.operationMaintenance.data.model
{

    /// <summary>
    /// 运维单位
    /// </summary>
    [DataContract, Serializable]
    public class MBreakdownInfo
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
        /// 设备主键
        /// </summary>
        [DataMember]
        public string equipmentCode { get; set; }

        /// <summary>
        /// 设备编码
        /// </summary>
        [DataMember]
        public string equipmentNo { get; set; }


        /// <summary>
        /// 报警主键
        /// </summary>
        [DataMember]
        public string monitorSiteAlarmCode { get; set; }



        /// <summary>
        /// 统计次数
        /// </summary>
        [DataMember]
        public int? breakdownCount { get; set; }

    }
}

