using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.operationMaintenance.data
{
    /// <summary>
    /// 运维项目查询类
    /// </summary>
    [DataContract]
    public class QueryContractParams
    {
        /// <summary>
        /// 关键字
        /// </summary>
        [DataMember]
        public string keyword { get; set; }


        /// <summary>
        /// 厂区编码
        /// </summary>
        [DataMember]
        public string cantonCode { get; set; }

        /// <summary>
        /// 运维合同编码
        /// </summary>
        [DataMember]
        public string operationMaintenanceContractCode { get; set; }

        /// <summary>
        /// 运维单位编码
        /// </summary>
        [DataMember]
        public string operationMaintenanceUnitCode { get; set; }

        
        /// <summary>
        /// 运维单位编码
        /// </summary>
        [DataMember]
        public DateTime? startDate { get; set; }
        
    }
}
