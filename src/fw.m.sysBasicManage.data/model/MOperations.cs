using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.sysBasicManage.data.model
{
    [DataContract]
    public class MOperations
    {

        [DataMember]
        public String operationMaintenancePersonCode { get; set; }

        [DataMember]
        public String operationMaintenancePersonName { get; set; }

        [DataMember]
        public String userID { get; set; }

    }
}
