using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.operationMaintenance.data
{

    public class QueryMBLLOperationMaintenancePersonMappingMonitorSiteParams
    {
        /// <summary>
        /// 关键字
        /// </summary>
        public string keyword { get; set; }

        /// <summary>
        /// 运维人员
        /// </summary>
        public string operationMaintenancePersonCode { get; set; }


        /// <summary>
        /// 运维企业
        /// </summary>
        public string operationMaintenanceUnitCode { get; set; }
    }
}
