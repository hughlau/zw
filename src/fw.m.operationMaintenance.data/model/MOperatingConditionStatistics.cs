using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.operationMaintenance.data.model
{

    /// <summary>
    /// 运维情况任务统计
    /// </summary>
    [DataContract]
    public class MOperatingConditionStatistics
    {

        /// <summary>
        /// 行政区编码
        /// </summary>
        [DataMember]
        public string cantonCode { get; set; }

        /// <summary>
        /// 行政区名称
        /// </summary>
        [DataMember]
        public string cantonName { get; set; }

        /// <summary>
        /// 行政区登级
        /// </summary>
        [DataMember]
        public Int32 level { get; set; }

        

         /// <summary>
        /// 父级行政区编码
        /// </summary>
        [DataMember]
        public string PCantoncode { get; set; } 

        /// <summary>
        /// 父级行政区编码
        /// </summary>
        [DataMember]
        public string parentCantonCode { get; set; } 

        /// <summary>
        /// 设备个数
        /// </summary>
        [DataMember]
        public int? deviceAmount { get; set; }
        

        /// <summary>
        /// 考核天数
        /// </summary>
        [DataMember]
        public int? khDay_SUM { get; set; }
        /// <summary>
        /// 运行天数
        /// </summary>
        [DataMember]
        public int? actDay_SUM { get; set; }
        /// <summary>
        /// 因子监测记录
        /// </summary>
        [DataMember]
        public int? actCount_SUM { get; set; }
        /// <summary>
        /// 超标记录
        /// </summary>
        [DataMember]
        public int? overCount_SUM { get; set; }
        /// <summary>
        /// 运维记录
        /// </summary>
        [DataMember]
        public int? omCount_SUM { get; set; }
        /// <summary>
        /// 异常记录
        /// </summary>
        [DataMember]
        public int? errCount_SUM { get; set; }
    }
}
