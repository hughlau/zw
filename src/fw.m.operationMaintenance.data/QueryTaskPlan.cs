using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.operationMaintenance.data
{
    [DataContract]
    public class QueryTaskPlan
    {
        [DataMember]
        public string keyword { get; set; }

        [DataMember]
        public string operationMaintenanceTaskPlanId { get; set; }

        [DataMember]
        public string operationMaintenanceTaskPlanName { get; set; }

        [DataMember]
        public string planType { get; set; }

        [DataMember]
        public string remark{ get; set; }

        [DataMember]
        public string operationMaintenanceUnitName { get; set; }

        [DataMember]
        public string operationMaintenanceUnitCode { get; set; }
        
        [DataMember]
        public string operationMaintenancePersonName { get; set; }

        [DataMember]
        public string userName { get; set; }

        [DataMember]
        public DateTime createTime { get; set; }

    }
}
