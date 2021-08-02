using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.operationMaintenance.data
{
    [DataContract]
    public class QueryTaskPlanMain
    {
        [DataMember]
        public string operationMaintenanceTaskPlanId { get; set; }

        [DataMember]
        public string operationMaintenanceTaskPlanName { get; set; }

        [DataMember]
        public Int32 frequencyType { get; set; }

        [DataMember]
        public Int32 startDay1 { get; set; }
        [DataMember]
        public Int32 endDay1 { get; set; }

        [DataMember]
        public Int32 startMonth { get; set; }
        [DataMember]
        public Int32 startDay2 { get; set; }
        [DataMember]
        public Int32 endMonth { get; set; }
        [DataMember]
        public Int32 endDay2 { get; set; }

        [DataMember]
        public string operationMaintenanceUnitCode { get; set; }

        [DataMember]
        public string operationMaintenancePersonCode { get; set; }

        [DataMember]
        public Int32 planType { get; set; }
       
        

        
       
        
        
        


    }
}
