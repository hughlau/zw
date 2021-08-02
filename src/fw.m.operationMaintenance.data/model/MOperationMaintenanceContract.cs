using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwDal;
using System.Runtime.Serialization;

namespace fw.m.operationMaintenance.data.model
{
    /// <summary>
    /// 运维合同
    /// </summary>
    [DataContract]
    public class MOperationMaintenanceContract : FWEntityObject
    {
        private string _operationMaintenanceContractCode;

        /// <summary>
        ///项目主键
        /// </summary>
        [DataMember]
        public string operationMaintenanceContractCode
        {
            get { return _operationMaintenanceContractCode; }
            set { _operationMaintenanceContractCode = changeValue("operationMaintenanceContractCode", _operationMaintenanceContractCode, value); }
        }

        private string _contractNo;

        /// <summary>
        /// 项目编号
        /// </summary>
        [DataMember]
        public string contractNo
        {
            get { return _contractNo; }
            set { _contractNo = changeValue("contractNo", _contractNo, value); }
        }

        private string _operationMaintenanceContractName;

        /// <summary>
        /// 项目名称
        /// </summary>
        [DataMember]
        public string operationMaintenanceContractName
        {
            get { return _operationMaintenanceContractName; }
            set { _operationMaintenanceContractName = changeValue("operationMaintenanceContractName", _operationMaintenanceContractName, value); }
        }

        private DateTime? _effectiveTime;

        /// <summary>
        /// effectiveTime
        /// </summary>
        [DataMember]
        public DateTime? effectiveTime
        {
            get { return _effectiveTime; }
            set { _effectiveTime = changeValue("effectiveTime", _effectiveTime, value); }
        }

        private DateTime? _failTime;

        /// <summary>
        /// failTime
        /// </summary>
        [DataMember]
        public DateTime? failTime
        {
            get { return _failTime; }
            set { _failTime = changeValue("failTime", _failTime, value); }
        }

        private string _operationMaintenanceUnitCode;

        /// <summary>
        /// 用户ID
        /// </summary>
        [DataMember]
        public string operationMaintenanceUnitCode
        {
            get { return _operationMaintenanceUnitCode; }
            set { _operationMaintenanceUnitCode = changeValue("operationMaintenanceUnitCode", _operationMaintenanceUnitCode, value); }
        }

        private string _rem;

        /// <summary>
        /// rem
        /// </summary>
        [DataMember]
        public string rem
        {
            get { return _rem; }
            set { _rem = changeValue("rem", _rem, value); }
        }

        private int? _isDis;

        /// <summary>
        /// 启用禁用状态
        /// </summary>
        [DataMember]
        public int? isDis
        {
            get { return _isDis; }
            set { _isDis = changeValue("isDis", _isDis, value); }
        }

        private int? _isDel;

        /// <summary>
        /// 是否删除
        /// </summary>
        [DataMember]
        public int? isDel
        {
            get { return _isDel; }
            set { _isDel = changeValue("isDel", _isDel, value); }
        }

        private string _createrID;

        /// <summary>
        /// createrID
        /// </summary>
        [DataMember]
        public string createrID
        {
            get { return _createrID; }
            set { _createrID = changeValue("createrID", _createrID, value); }
        }

        private DateTime? _createTime;

        /// <summary>
        /// createTime
        /// </summary>
        [DataMember]
        public DateTime? createTime
        {
            get { return _createTime; }
            set { _createTime = changeValue("createTime", _createTime, value); }
        }

        private string _updaterID;

        /// <summary>
        /// updaterID
        /// </summary>
        [DataMember]
        public string updaterID
        {
            get { return _updaterID; }
            set { _updaterID = changeValue("updaterID", _updaterID, value); }
        }

        private DateTime? _updateTime;

        /// <summary>
        /// updateTime
        /// </summary>
        [DataMember]
        public DateTime? updateTime
        {
            get { return _updateTime; }
            set { _updateTime = changeValue("updateTime", _updateTime, value); }
        }

        private string _cantonCode;

        /// <summary>
        /// 行政区编码
        /// </summary>
        [DataMember]
        public string cantonCode
        {
            get { return _cantonCode; }
            set { _cantonCode = changeValue("cantonCode", _cantonCode, value); }
        }

        /// <summary>
        /// 行政区名称
        /// </summary>
        [DataMember]
        public string cantonName { get; set; }

        /// <summary>
        /// 运维单位
        /// </summary>
        [DataMember]
        public string operationMaintenanceUnitName { get; set; }
        
        /// <summary>
        /// 运维合同映射监测点列表
        /// </summary>
        [DataMember]
        public List<MOperationMaintenanceContractMappingMonitorSite> contractMappingMonitorSiteList { get; set; }

    }
}
