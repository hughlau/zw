using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.autoMonitor.data
{
    /// <summary>
    /// 自动监测查询
    /// </summary>
    [DataContract]
    public class QueryAutoMonitorParams
    {
        /// <summary>
        /// 监测点编码
        /// </summary>
        [DataMember]
        public string monitorSiteCode { get; set; }

        //设备
        [DataMember]
        public string equipmentCode { get; set; }

        /// <summary>
        /// 行政区
        /// </summary>
        [DataMember]
        public string cantonCode { get; set; }

        /// <summary>
        /// 行政区列表
        /// </summary>
        [DataMember]
        public List<string> cantonCodeList { get; set; }

        /// <summary>
        /// 开始日期
        /// </summary>
        [DataMember]
        public DateTime? dStart { get; set; }

        /// <summary>
        /// 结束日期
        /// </summary>
        [DataMember]
        public DateTime? dEnd { get; set; }

        /// <summary>
        /// 状态编码
        /// </summary>
        [DataMember]
        public string statusCode { get; set; }

        /// <summary>
        /// 状态编码
        /// </summary>
        [DataMember]
        public string windstatusCode { get; set; }


        /// <summary>
        /// 监测因子
        /// </summary>
        [DataMember]
        public string monitorFactorCode { get; set; }

        /// <summary>
        /// 因子编码
        /// </summary>
        [DataMember]
        public List<string> monitorFactorList { get; set; }



        /// <summary>
        /// 因子类型  -1 全部，0是监测因子，1是状态因子
        /// </summary>
        [DataMember]
        public int? FactorType { get; set; }

        /// <summary>
        ///纬度
        /// </summary>
        [DataMember]
        public double? latitude { get; set; }

        /// <summary>
        /// 经度
        /// </summary>
        [DataMember]
        public double? longitude { get; set; }

        /// <summary>
        /// /运维人员编码
        /// </summary>
        [DataMember]
        public string operationMaintenancePersonCode { get; set; }

        /// <summary>
        /// 因子类型  1 自动，2APP，3PC
        /// </summary>
        [DataMember]
        public int? dataSource { get; set; }

        /// <summary>
        /// 设备关键字
        /// </summary>
        [DataMember]
        public string equipmentKeyword { get; set; }


        private string _keyword;

        /// <summary>
        ///关键字
        /// </summary>
        [DataMember]
        public string keyword
        {
            get { return _keyword; }
            set { _keyword = value; }
        }

        /// <summary>
        /// 净化槽 设备设备关键字
        /// </summary>
        [DataMember]
        public string siteEquipmentKeyword { get; set; }

        /// <summary>
        /// 项目代号
        /// </summary>
        [DataMember]
        public string projectNo { get; set; }

    }
}
