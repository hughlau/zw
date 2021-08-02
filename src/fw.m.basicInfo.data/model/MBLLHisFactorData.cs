using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.basicInfo.data.model
{

    [DataContract, Serializable]
    public class MBLLFactorData
    {

        [DataMember]
        public DateTime? monitorTime { get; set; }
        [DataMember]
        public string monitorSiteCode { get; set; }
        [DataMember]
        public string monitorFactorCode { get; set; }
        [DataMember]
        public string equipmentCode { get; set; }

        [DataMember]
        public double? monitorValue { get; set; }
        [DataMember]
        public int? dataSource { get; set; }
        [DataMember]
        public int? dataState { get; set; }
    }
}
