using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.basicInfo.data
{
    [DataContract]
    public class QuerySignatureParams
    {
        [DataMember]
        public string userId { get; set; }

        [DataMember]
        public string title { get; set; }
    }
}
