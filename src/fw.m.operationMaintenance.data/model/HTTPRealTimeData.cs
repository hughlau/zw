using fw.fwDal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace fw.m.operationMaintenance.data.model
{
    [DataContract]
    public class HTTPRealTimeData
    {
        #region 数据报文
        [DataMember]
        public string device_id { get; set; }

        [DataMember]
        public string device_unit { get; set; }

        [DataMember]
        public string device_category { get; set; }

        [DataMember]
        public string version { get; set; }

        [DataMember]
        public HTTPRealTimeData_DeviceMsg data { get; set; } 
        #endregion
    }


    [DataContract]
    public class HTTPRealTimeData_DeviceMsg
    {
        #region 设备
        [DataMember]
        public int drug_level_state { get; set; }
        [DataMember]
        public int water_pump_state { get; set; }
        [DataMember]
        public int well_low_state { get; set; }
        [DataMember]
        public int well_high_state { get; set; }
        [DataMember]
        public int off_machine_alarm { get; set; }
        [DataMember]
        public int electricity_stolen_alarm { get; set; }
        [DataMember]
        public double draught_fan_current { get; set; }
        [DataMember]
        public double transformer_current_1 { get; set; }
        [DataMember]
        public double transformer_current_2 { get; set; }
        [DataMember]
        public long collect_time { get; set; }
        [DataMember]
        public long storage_time { get; set; } 
        #endregion

        #region 网关
        [DataMember]
        public string msgtype { get; set; }

        [DataMember]
        public string time { get; set; }

        [DataMember]
        public string gwEUI { get; set; }
        #endregion
    }

    public class DeviceCate
    {
        public static string gateWay = "网关";
        public static string device = "中车DTU采集器";
    }
}
