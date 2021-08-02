using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.operationMaintenance.data.model
{
    /// <summary>
    /// 运维任务统计
    /// </summary>
    [DataContract]
    public class MOperationMaintenanceTaskStatistics
    {

        /// <summary>
        /// 待接收
        /// </summary>
        [DataMember]
        public int? waitReceive { get; set; }

        /// <summary>
        /// 已接收
        /// </summary>
        [DataMember]
        public int? alreadyReceive { get; set; }

        /// <summary>
        /// 完成
        /// </summary>
        [DataMember]
        public int? finishReceive { get; set; }

        /// <summary>
        /// 退回任务 废弃
        /// </summary>
        [DataMember]
        public int? backReceive { get; set; }
    }
}
