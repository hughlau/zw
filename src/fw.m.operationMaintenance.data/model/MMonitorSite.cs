using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.operationMaintenance.data.model
{
    /// <summary>
    /// 运维人员设施点位
    /// </summary>
    [DataContract]
    public class MMonitorSite
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
        /// 父级厂区编码
        /// </summary>
        [DataMember]
        public string parentCantonCode { get; set; }

        /// <summary>
        /// 父级厂区编码
        /// </summary>
        [DataMember]
        public string parentCantonName { get; set; }

        private double? _longitude;

        /// <summary>
        /// 经度
        /// </summary>
        [DataMember]
        public double? longitude
        {
            get { return _longitude; }
            set { _longitude = value; }
        }

        private double? _latitude;

        /// <summary>
        /// 维度
        /// </summary>
        [DataMember]
        public double? latitude
        {
            get { return _latitude; }
            set { _latitude = value; }
        }


        /// <summary>
        /// 是否选择
        /// </summary>
        [DataMember]
        public int? isSelected { get; set; }
    }
}
