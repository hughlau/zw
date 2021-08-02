using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.operationMaintenance.data.model
{
    [DataContract]
    public class MOperatorAssessment
    {
        [DataMember]
        public String operationMaintenancePersonCode { get; set; }
        [DataMember]
        public String operationMaintenancePersonName { get; set; }
        [DataMember]
        public int SolvedCommTask { get; set; }
        [DataMember]
        public int noSolveCommTask { get; set; }
        [DataMember]
        public int SolvedAlarmTask { get; set; }
        [DataMember]
        public int noSolveAlarmTask { get; set; }
        [DataMember]
        public int SolvedCommTaskAverageTime { get; set; }
        [DataMember]
        public int SolvedAlarmTaskAverageTime { get; set; }
    }
}
