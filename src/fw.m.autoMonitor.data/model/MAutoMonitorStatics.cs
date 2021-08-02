using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using fw.fwData;

namespace fw.m.autoMonitor.data.model
{
    /// <summary>
    /// 实时数据查询状态统计
    /// </summary>
    [DataContract]
    public class MAutoMonitorStatics
    {
        [DataMember]
        public string statusName { get; set; }

        /// <summary>
        /// 状态编码
        /// </summary>
        [DataMember]
        public string statusCode { get; set; }

        /// <summary>
        ///状态颜色
        /// </summary>
        [DataMember]
        public string color { get; set; }

        /// <summary>
        /// 设施点位数量
        /// </summary>
        [DataMember]
        public int? monitorSiteCount { get; set; }

        /// <summary>
        /// 因子列表
        /// </summary>
        [DataMember]
        public List<MMonitorSiteFactor> monitorSiteFactorList { get; set; }

        /// <summary>
        /// 实时数据列表
        /// </summary>
        [DataMember]
        public FWDataTable monitorSiteLatestDataList { get; set; }

        /// <summary>
        /// 总条数
        /// </summary>
        [DataMember]
        public int? recordCount { get; set; }

        /// <summary>
        /// 总页数
        /// </summary>
        [DataMember]
        public int? pageCount { get; set; }

        [DataMember]
        public FWDataTable equipmentCode { get; set; }

        [DataMember]
        public FWDataTable equipmentName { get; set; }


    }
}
