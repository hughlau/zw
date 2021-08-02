using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.operationMaintenance.data
{
    public class QuerryMaintenanceEquipmentPart
    {
        [DataMember]
        public string keyword { get; set; }

        [DataMember]
        public string partName { get; set; }

        [DataMember]
        public Int32 changeNum { get; set; }

        [DataMember]
        public string operationMaintenanceTaskName { get; set; }

        [DataMember]
        public string operationMaintenancePersonName { get; set; }

        [DataMember]
        public DateTime createTime { get; set; }

    }
}
