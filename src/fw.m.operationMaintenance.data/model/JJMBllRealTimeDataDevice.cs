using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using fw.fwDal;

namespace fw.m.operationMaintenance.data.model
{
    [DataContract]
    public class JJMBllRealTimeDataDevice : FWEntityObject
    {
        [DataMember]
        public string deviceData { get; set; }

        [DataMember]
        public string deviceId { get; set; }
        
        [DataMember]
        public int deviceType { get; set; }
        
        [DataMember]
        public string name { get; set; }
       

    }
}
