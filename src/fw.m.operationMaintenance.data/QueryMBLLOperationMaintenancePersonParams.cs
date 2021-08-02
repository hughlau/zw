using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.operationMaintenance.data
{
    [DataContract, Serializable]
    public class QueryMBLLOperationMaintenancePersonParams
    {
        /// <summary>
        /// 关键字
        /// </summary>
        [DataMember]
        public string keyword { get; set; }

        /// <summary>
        /// 运维人员
        /// </summary>
        [DataMember]
        public string operationMaintenancePersonCode { get; set; }


        /// <summary>
        /// 运维企业
        /// </summary>
        [DataMember]
        public string operationMaintenanceUnitCode { get; set; }

        /// <summary>
        /// 第三方登录· 用户名称
        /// </summary>
        [DataMember]
        public string userName_thirdService { get; set; }

        /// <summary>
        /// 监测点位
        /// </summary>
        [DataMember]
        public string monitorSiteCode { get; set; }

        /// <summary>
        /// 页面类型
        /// </summary>
        [DataMember]
        public string pageType { get; set; }
    }
}
