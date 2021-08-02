using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.operationMaintenance.data
{
    [DataContract]
    public class QueryInoculationTaskParams
    {


        /// <summary>
        /// 运维任务编码
        /// </summary>
        [DataMember]
        public string code { get; set; }

        /// <summary>
        /// 报警编码
        /// </summary>
        [DataMember]
        public string monitorSiteCode { get; set; }

        /// <summary>
        /// 任务类型
        /// </summary>
        [DataMember]
        public string keyword { get; set; }



        /// <summary>
        /// 是否解决
        /// </summary>
        [DataMember]
        public string stats { get; set; }


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
        /// 运维人员编码
        /// </summary>
        [DataMember]
        public string operationMaintenancePersonCode { get; set; }

        [DataMember]
        public string typeId { get; set; }
    }
}
