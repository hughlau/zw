using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.operationMaintenance.data.model
{
    /// <summary>
    /// 
    /// </summary>
    public class MBLLOperationMaintenancePersonLocation
    {

        /// <summary>
        ///  运维单位code
        /// </summary>
        [DataMember]
        public string operationMaintenanceUnitCode { get; set; }

        /// <summary>
        ///  运维单位名称
        /// </summary>
        [DataMember]
        public string operationMaintenanceUnitName { get; set; }

        /// <summary>
        ///  运维人员code
        /// </summary>
        [DataMember]
        public string operationMaintenancePersonCode { get; set; }

        /// <summary>
        ///  运维人员姓名
        /// </summary>
        [DataMember]
        public string operationMaintenancePersonName { get; set; }

        /// <summary>
        /// 经度
        /// </summary>
        [DataMember]
        public double? longitude { get; set; }
        /// <summary>
        /// 纬度
        /// </summary>
        [DataMember]
        public double? latitude { get; set; }
        /// <summary>
        /// 最近执行时间
        /// </summary>
        [DataMember]
        public DateTime? lastActionTime { get; set; }


        /// <summary>
        /// 时间间隔  min
        /// </summary>
        [DataMember]
        public int? timespan { get; set; }

        
    }
}
