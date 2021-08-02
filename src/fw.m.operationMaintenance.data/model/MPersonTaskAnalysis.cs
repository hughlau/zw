using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.operationMaintenance.data.model
{
    [DataContract, Serializable]
    public class MPersonTaskAnalysis
    {
        [DataMember]
        public string operationMaintenancePersonCode { get; set; }

        [DataMember]
        public string operationMaintenancePersonName { get; set; }

        [DataMember]
        public int 常规任务未解决数量 { get; set; }

        [DataMember]
        public int 常规任务已解决数量 { get; set; }

        [DataMember]
        public int 报警任务未解决数量 { get; set; }

        [DataMember]
        public int 报警任务已解决数量 { get; set; }

        [DataMember]      
        public int 常规任务总数量 { get; set; }

        [DataMember]
        public int 报警任务总数量 { get; set; }

        [DataMember]
        public int 任务总量 { get; set; }

    }
}
