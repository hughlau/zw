using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using fw.m.basicInfo.data.model;

namespace fw.m.basicInfo.data.data
{
    /// <summary>
    /// 行政区 统计
    /// </summary>
    [DataContract]
    public class Data_Canton
    {

        /// <summary>
        /// 子级数据
        /// </summary>
        [DataMember]
        public List<Data_Canton> childDataList { get; set; }

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
        /// 点位个数
        /// </summary>
        [DataMember]
        public int? monitorSiteAmount { get; set; }

        /// <summary>
        /// 实时状态统计
        /// </summary>
        [DataMember]
        public MonitorSiteRealtimeStatis realtimeStatusStatis { get; set; }


        /// <summary>
        /// 点位数据
        /// </summary>
        [DataMember]
        public List<MLazyTreeData> monitorsites { get; set; }

        /// <summary>
        /// 设备状态的参数
        /// </summary>
        [DataMember]
        public  List<SiteStatusData> siteStatusData { get; set; }
    }
}
