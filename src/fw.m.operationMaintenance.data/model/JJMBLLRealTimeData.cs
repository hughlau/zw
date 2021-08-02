using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using fw.fwDal;

namespace fw.m.operationMaintenance.data.model
{
    [DataContract]
    public class JJMBllRealTimeData
    {
        [DataMember]
        public List<JJMBllRealTimeDataDevice> dataList { get; set; }

        [DataMember]
        public List<JJMBllRealTimeDataDevice> stateList { get; set; }

        [DataMember]
        public string time { get; set; }


        public override string ToString()
        {
            return "时间戳：" + this.time + "，dataList：" + (this.dataList == null ? "" : this.dataList.Count.ToString())
                    + "，stateList：" + (this.stateList == null ? "" : this.stateList.Count.ToString());
        }
    }
}
