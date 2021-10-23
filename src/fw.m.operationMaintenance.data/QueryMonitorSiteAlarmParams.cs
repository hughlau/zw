using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.operationMaintenance.data
{
    /// <summary>
    /// 报警信息查询
    /// </summary>
    [DataContract]
    public class QueryMonitorSiteAlarmParams
    {
        /// <summary>
        /// 关键字
        /// </summary>
        [DataMember]
        public string keyword { get; set; }

        /// <summary>
        /// 报警编码
        /// </summary>
        [DataMember]
        public string monitorSiteAlarmCode { get; set; }

        /// <summary>
        /// 监测点编码
        /// </summary>
        [DataMember]
        public string monitorSiteCode { get; set; }

        /// <summary>
        /// 报警类型
        /// </summary>
        [DataMember]
        public string faultType { get; set; }

        /// <summary>
        /// 解决状态
        /// </summary>
        [DataMember]
        public int? isSolve { get; set; }

        /// <summary>
        /// 是否生成任务
        /// </summary>
        [DataMember]
        public int? isGenerateTask { get; set; }

        /// <summary>
        /// 厂区编码
        /// </summary>
        [DataMember]
        public string cantonCode { get; set; }

        /// <summary>
        /// 厂区列表
        /// </summary>
        [DataMember]
        public List<string> cantonCodeList { get; set; }

        private DateTime? _dStart;

        /// <summary>
        /// 开始日期
        /// </summary>
        [DataMember]
        public DateTime? dStart
        {
            get { return _dStart; }
            set { _dStart = value; }
        }

        private DateTime? _dEnd;

        /// <summary>
        /// 结束日期
        /// </summary>
        [DataMember]
        public DateTime? dEnd
        {
            get { return _dEnd; }
            set { _dEnd = value; }
        }

        /// <summary>
        /// 运维人员  用于报警信息过滤
        /// </summary>
        [DataMember]
        public string operationMaintenancePersonCode { get; set; }


        /// <summary>
        ///首页数据
        /// </summary>
        [DataMember]
        public bool? isHome { get; set; }
    }
}
