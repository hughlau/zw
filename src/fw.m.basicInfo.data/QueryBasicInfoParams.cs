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
    [DataContract, Serializable]
    public class QueryBasicInfoParams
    {
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

        private string _monitorSiteCode;

        /// <summary>
        /// 设施点位编码
        /// </summary>
        [DataMember]
        public string monitorSiteCode
        {
            get { return _monitorSiteCode; }
            set { _monitorSiteCode = value; }
        }

        private string _cantonCode;

        /// <summary>
        /// 行政区编码
        /// </summary>
        [DataMember]
        public string cantonCode
        {
            get { return _cantonCode; }
            set { _cantonCode = value; }
        }

        private string _householdName;

        /// <summary>
        /// 行政区编码
        /// </summary>
        [DataMember]
        public string householdName
        {
            get { return _householdName; }
            set { _householdName = value; }
        }
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
        /// 运维人员
        /// </summary>
        [DataMember]
        public string operationMaintenancePersonCode { get; set; }

        /// <summary>
        /// 运维单位
        /// </summary>
        [DataMember]
        public string operationMaintenanceUnitCode { get; set; }

        /// <summary>
        /// 运维点位分配
        /// null:全部
        /// 1：未分配的点位
        /// 2：已分配的点位
        /// </summary>
        [DataMember]
        public int? personSelectType { get; set; }

        /// <summary>
        /// 操作方式
        /// </summary>
        [DataMember]
        public string action { get; set; }

        /// <summary>
        /// 运维合同编码
        /// </summary>
        [DataMember]
        public string operationMaintenanceContractCode { get; set; }

        /// <summary>
        /// 点位状态
        /// </summary>
        [DataMember]
        public List<string> monitorSiteStatusList { get; set; }

        /// <summary>
        /// 监测设施主键列表
        /// </summary>
        [DataMember]
        public List<string> monitorSiteCodeList { get; set; }

        /// <summary>
        /// 监测点项目Code
        /// </summary>
        [DataMember]
        public string projectCode { get; set; }


        /// <summary>
        /// 项目代号
        /// </summary>
        [DataMember]
        public string projectNo { get; set; }

        /// <summary>
        /// 净化槽设施  状态编码 
        /// 1	正常
        /// 4	设备漏气
        /// 5	设备堵塞
        /// 9	通讯故障 
        /// </summary>
        [DataMember]
        public string statusCode { get; set; }

       

        /// <summary>
        /// 是否进行用户过滤
        /// </summary>
        [DataMember]
        public bool? isUserFilter { get; set; }

        /// <summary>
        /// 分配状态  0 未分配 1已分配
        /// </summary>
        [DataMember]
        public string allocatorStatusCode { get; set; }
        ///// <summary>
        ///// 运维项目过滤 用户设施点位列表展示分配
        ///// </summary>
        // [DataMember]
        //public bool? isContractFilter { get; set; }

        private string _equipmentType;

        /// <summary>
        /// 行政区编码
        /// </summary>
        [DataMember]
        public string equipmentType
        {
            get { return _equipmentType; }
            set { _equipmentType = value; }
        }
    }
}
