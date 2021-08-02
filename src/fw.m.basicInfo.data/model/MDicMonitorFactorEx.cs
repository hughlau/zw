using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using fw.m.sysManage.data.model;

namespace fw.m.basicInfo.data.model
{
      [DataContract]
    public class MDicMonitorFactorEx : MFWDictionary
    { 
        [DataMember]
        public string UName { get; set; }
        [DataMember]
        public string dataDesc { get; set; }
        [DataMember]
        public Int32? isDefault { get; set; }
        [DataMember]
        public Int32? channelNo { get; set; }
        [DataMember]
        public Double? alarmLowerLimit { get; set; }
        [DataMember]
        public Double? alarmUpperLimit { get; set; }
        [DataMember]
        public Double? standardUpperLimit { get; set; }
        [DataMember]
        public Double? standardLowerLimit { get; set; }
    }
}
