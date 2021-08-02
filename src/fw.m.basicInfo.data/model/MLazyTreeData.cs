using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using fw.fwDal;

namespace fw.m.basicInfo.data.model
{

    /// <summary>
    /// 监测点信息
    /// </summary>
    [DataContract]
    public class MLazyTreeData : FWEntityObject
    {
        //code: "sln", pCode: "-fw-", name: "解决方案", "folder": 1, "isLeaf": false, "expanded": true, "asyncLoad": false}
        [DataMember]
        public string code { get; set; }
        [DataMember]
        public string pCode { get; set; }
        [DataMember]
        public string name { get; set; }
        [DataMember]
        public int? folder { get; set; }
        [DataMember]
        public bool isLeaf { get; set; }
        [DataMember]
        public bool expanded { get; set; }
        [DataMember]
        public bool asyncLoad { get; set; }

        /// <summary>
        /// 1镇  2 村 3点位
        /// </summary>
        [DataMember]
        public int? dataLvl { get; set; }

        /// <summary>
        /// 监测点
        /// </summary>
        [DataMember]
        public string monitorSiteCode { get; set; }
        /// <summary>
        /// 设施点位名称
        /// </summary>
        [DataMember]
        public string monitorSiteName { get; set; }

        /// <summary>
        /// 行政区编码
        /// </summary>
        [DataMember]
        public string cantonCode { get; set; }
        /// <summary>
        /// 行政区名称
        /// </summary>
        [DataMember]
        public string cantonName { get; set; }
        /// <summary>
        /// 父级行政区编码
        /// </summary>
        [DataMember]
        public string parentCantonCode { get; set; }
        /// <summary>
        /// 父级行政区名称
        /// </summary>
        [DataMember]
        public string parentCantonName { get; set; }

        /// <summary>
        /// 行政区全称
        /// </summary>
        [DataMember]
        public string fullCantonName { get; set; }

        /// <summary>
        /// 地址
        /// </summary>
        [DataMember]
        public string address { get; set; }

        [DataMember]
        public int? monitorSiteAmount { get; set; }

        [DataMember]
        public MonitorSiteRealtimeStatis realtimeStatusStatis { get; set; }

        /// <summary>
        /// 经度
        /// </summary>
        [DataMember]
        public double? posX { get; set; }

        /// <summary>
        /// 纬度
        /// </summary>
        [DataMember]
        public double? posY { get; set; }

        /// <summary>
        /// 节点状态
        /// </summary>
        [DataMember]
        public string siteStatus { get; set; }

        /// <summary>
        /// 级别
        /// </summary>
        [DataMember]
        public int? level { get; set; }



        #region 存储过程

        [DataMember]
        public string OnlineState { get; set; }
        [DataMember]
        public string LowPState { get; set; }
        [DataMember]
        public string HighPState { get; set; }
        [DataMember]
        public DateTime? OnlinemonitorTime { get; set; }
        [DataMember]
        public DateTime? LowPmonitorTime { get; set; }
        [DataMember]
        public DateTime? HighPmonitorTime { get; set; }
        [DataMember]
        public string statusCode { get; set; }

        #endregion

    }


    [DataContract]
    public class MonitorSiteRealtimeStatis
    {
        ///// <summary>
        ///// 
        ///// </summary>
        //[DataMember]
        //public int? status_0 { get; set; }

        /// <summary>
        /// 状态1 正常 
        /// </summary>
        [DataMember]
        public int? status_1 { get; set; }
        /// <summary>
        ///状态2 水质超标 停用
        /// </summary>
        [DataMember]
        public int? status_2 { get; set; }
        /// <summary>
        /// 状态3 风机故障 停用
        /// </summary>
        [DataMember]
        public int? status_3 { get; set; }
        /// <summary>
        /// 状态4 设备漏气
        /// </summary>
        [DataMember]
        public int? status_4 { get; set; }

        /// <summary>
        /// 状态5 设备堵塞
        /// </summary>
        [DataMember]
        public int? status_5 { get; set; }

        /// <summary>
        /// 状态9 通讯故障
        /// </summary>
        [DataMember]
        public int? status_9 { get; set; }

        /// <summary>
        /// 状态10 调试中
        /// </summary>
        [DataMember]
        public int? status_10 { get; set; }

        /// <summary>
        /// 状态13 报停设备
        /// </summary>
        [DataMember]
        public int? status_13 { get; set; }
    }


    /// <summary>
    /// 设备状态
    /// </summary>
    [DataContract]
    public class SiteStatusData : FWEntityObject
    {
        //设备状态名称
        [DataMember]
        public string statusName { get; set; }

        //设备状态颜色
        [DataMember]
        public string color { get; set; }

        //设备状态码
        [DataMember]
        public string statusCode { get; set; }
        [DataMember]

        //数量
        public int? monitorSiteCount { get; set; }
    }
}
