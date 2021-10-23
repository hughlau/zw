using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.operationMaintenance.data
{
    /// <summary>
    /// 运维单位查询参数
    /// </summary>
    [DataContract, Serializable]
    public class QueryMBLLOperationMaintenanceUnitParams
    {
        /// <summary>
        /// 关键字
        /// </summary>
        [DataMember]
        public string keyword { get; set; }

        /// <summary>
        /// 厂区
        /// </summary>
        [DataMember]
        public string cantonCode { get; set; }
        /// <summary>
        /// 第三方登录· 用户名称
        /// </summary>
        [DataMember]
        public string userName_thirdService { get; set; }

        /// <summary>
        /// 运维单位编码
        /// </summary>
        [DataMember]
        public string operationMaintenanceUnitCode { get; set; }
    }
}
