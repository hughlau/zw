using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization; 

namespace fw.m.operationMaintenance.data.model
{
    /// <summary>
    /// 厂区 统计
    /// </summary>
    [DataContract]
    public class MCantonData
    {

        /// <summary>
        /// 子级数据
        /// </summary>
        [DataMember]
        public List<MCantonData> childDataList { get; set; }

        /// <summary>
        /// 编码
        /// </summary>
        [DataMember]
        public String cantonCode { get; set; }

        /// <summary>
        /// 名称
        /// </summary>
        [DataMember]
        public String cantonName { get; set; }

        /// <summary>
        /// 父类编码
        /// </summary> 
        [DataMember]
        public String pCantonCode { get; set; }

        /// <summary>
        /// 父类名称
        /// </summary> 
        [DataMember]
        public String pCantonName { get; set; }

        /// <summary>
        /// 经度
        /// </summary>
        [DataMember]
        public Double? posX { get; set; }


        /// <summary>
        /// 纬度
        /// </summary>
        [DataMember]
        public Double? posY { get; set; }

        /// <summary>
        /// 点位信息
        /// </summary>
        [DataMember]
        public List<MMonitorSite> monitorsites { get; set; }
    }
}
