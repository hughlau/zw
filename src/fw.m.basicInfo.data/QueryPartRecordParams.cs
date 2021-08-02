using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.basicInfo.data
{
    [DataContract]
    public class QueryPartRecordParams
    {
        [DataMember]
        public string partType { get; set; }

        [DataMember]
        public string recoverType { get; set; }

        [DataMember]
        public string moniSiteCode { get; set; }

        [DataMember]
        public DateTime? dStart { get; set; }

        [DataMember]
        public DateTime? dEnd { get; set; }
    }
}
