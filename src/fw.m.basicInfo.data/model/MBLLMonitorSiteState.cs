using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.basicInfo.data.model
{
    [DataContract, Serializable]
    public class MBLLMonitorSiteState
    {
       [ DataMember]
        public string cantonCode{ get; set; }

        [DataMember]
        public string cantonName{ get; set; }

        [DataMember]
        public string dataState{ get; set; }


        [DataMember]
        public int statusCode { get; set; }

        [DataMember]
        public int num{ get; set; }



    }

}
