using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace fw.m.basicInfo.data.model
{
    [DataContract]
    public class HlwxDown_Command
    {
        [DataMember]
        public string device_id { get; set; }

        [DataMember]
        public string service_id { get; set; }

        [DataMember]
        public string parameter { get; set; }

        [DataMember]
        public int clear { get; set; }

        [DataMember]
        public int schedule { get; set; }

        [DataMember]
        public int confirm { get; set; }

        public string ToJson (){
            string json= "{\"device_id\":\""+device_id+ "\",\"service_id\":\""+ service_id + "\",\"clear\":"
                +clear+ ",\"schedule\":"+schedule+ ",\"confirm\":"+confirm+ ",\"parameter\":"+parameter+"}";
            return json;
        }
    }

    public class HlwxDown_Result
    {
        public string msg { get; set; }

        public string code { get; set; }

        public string request_id { get; set; }
    }
}
