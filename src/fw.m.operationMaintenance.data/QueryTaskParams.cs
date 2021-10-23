using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.operationMaintenance.data
{
    /// <summary>
    /// 运维任务查询参数
    /// </summary>
    [DataContract]
    public class QueryTaskParams
    {

        /// <summary>
        /// 关键字
        /// </summary>
        [DataMember]
        public string keyword { get; set; }

        /// <summary>
        /// 运维任务编码
        /// </summary>
        [DataMember]
        public string operationMaintenanceTaskCode { get; set; }

        /// <summary>
        /// 报警编码
        /// </summary>
        [DataMember]
        public string monitorSiteAlarmCode { get; set; }

        /// <summary>
        /// 任务类型
        /// </summary>
        [DataMember]
        public string faultType { get; set; }

        /// <summary>
        /// 是否报警生成
        /// </summary>
        [DataMember]
        public int? isAlarm { get; set; }

        /// <summary>
        /// 是否解决
        /// </summary>
        [DataMember]
        public int? isSolve { get; set; }

        /// <summary>
        /// 任务状态
        /// </summary>
        [DataMember]
        public string taskStatus { get; set; }

        private DateTime? _dStart;

        /// <summary>
        /// 开始日期
        /// </summary>
        [DataMember]
        public DateTime? dStart
        {
            get { return _dStart; }
            set { _dStart = value; }
        }

        private DateTime? _dEnd;

        /// <summary>
        /// 结束日期
        /// </summary>
        [DataMember]
        public DateTime? dEnd
        {
            get { return _dEnd; }
            set { _dEnd = value; }
        }

       /// <summary>
       /// 运维人员编码
       /// </summary>
        [DataMember]
        public string operationMaintenancePersonCode { get; set; }


        /// <summary>
        /// 运维单位编码
        /// </summary>
        [DataMember]
        public string operationMaintenanceUnitCode { get; set; }

        /// <summary>
        /// 厂区编码
        /// </summary>
        [DataMember]
        public string cantonCode { get; set; }

        /// <summary>
        /// 经度
        /// </summary>
        [DataMember]
        public float? longitude { get; set; }

        /// <summary>
        /// 纬度
        /// </summary>
        [DataMember]
        public float? latitude { get; set; }


        /// <summary>
        /// 任务类型  巡检任务 报警任务
        /// </summary>
        [DataMember]
        public string taskType { get; set; }

        /// <summary>
        /// 运维人员主键
        /// </summary>
        [DataMember]
        public string TaskOMPersonCode { get; set; }

        /// <summary>
        /// 运维人员任务过滤 
        /// 1 只是自己的任务
        /// 2 自己能接收的任务
        /// </summary>
        [DataMember]
        public string  isFilterType { get; set; }

        /// <summary>
        ///现场设备编码
        /// </summary>
        [DataMember]
        public string monitorSiteCode { get; set; }

        /// <summary>
        /// 运维记录编码
        /// </summary>
        [DataMember]
        public string operationMaintenanceRecordCode { get; set; }

        /// <summary>
        /// 清掏记录编码
        /// </summary>
        [DataMember]
        public string operationCleanRecordCode { get; set; }

        /// <summary>
        /// 清掏记录状态
        /// </summary>
        [DataMember]
        public string isCleaned { get; set; }

        /// <summary>
        /// 责任方
        /// </summary>
        [DataMember]
        public int? responsiblePartyId { get; set; }

        /// <summary>
        /// 损坏内容
        /// </summary>
        [DataMember]
        public  string damagedContentId { get; set; }

        /// <summary>
        /// 恢复方
        /// </summary>
        [DataMember]
        public int? recoveryPeopleId { get; set; }

        //项目编号
        [DataMember]
        public string projectNo { get; set; }

        //巡检结果
        [DataMember]
        public  string inspectionStatus { get; set; }

        //维修任务类型 0 维修计划  1维修历史记录
        [DataMember]
        public string oprType { get; set; }
    }
}
