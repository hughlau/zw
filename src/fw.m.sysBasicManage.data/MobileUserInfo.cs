using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.m.sysManage.data;
using System.Runtime.Serialization;
using fw.fwData;

namespace fw.m.sysBasicManage.data
{
    [Serializable]
    [DataContract]
    public class MobileUserInfo
    {
        [DataMember]
        public string ticket { get; set; }

        [DataMember]
        public string userID { get; set; }

        [DataMember]
        public string userName { get; set; } 

        [DataMember]
        public string thirdCode { get; set; } 

        [DataMember]
        public string userTypeCode { get; set; }
         
    }
}
