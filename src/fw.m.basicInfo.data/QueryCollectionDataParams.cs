using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.basicInfo.data
{
    [DataContract, Serializable]
    public class QueryCollectionDataParams
    {
        [DataMember]
        public string cateCode { get; set; }

        [DataMember]
        public string monitorSiteName { get; set; }
    }
}
