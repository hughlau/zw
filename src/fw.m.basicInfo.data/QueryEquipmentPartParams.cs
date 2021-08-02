using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.basicInfo.data
{ 
    /// <summary>
    ///查询参数
    /// </summary>
    [DataContract]
    public class QueryEquipmentPartParams
    { 
        /// <summary>
        ///关键字
        /// </summary>
        [DataMember]
        public string keyWord { get; set; }

        /// <summary>
        ///零部件类型
        /// </summary>
        [DataMember]
        public string partType { get; set; }

        /// <summary>
        ///旧零件回收
        /// </summary>
        [DataMember]
        public string recoverType { get; set; }
    }
}
