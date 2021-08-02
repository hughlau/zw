using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using fw.fwDal;

namespace fw.m.operationMaintenance.data.entity
{
    public class BLLOperationMaintenanceContract : FWEntityObject
    {


        private string _operationMaintenanceContractCode;

        /// <summary>
        ///项目主键
        /// </summary>
        public string operationMaintenanceContractCode
        {
            get { return _operationMaintenanceContractCode; }
            set { _operationMaintenanceContractCode = changeValue("operationMaintenanceContractCode", _operationMaintenanceContractCode, value); }
        }

        private string _contractNo;

        /// <summary>
        /// 项目编号
        /// </summary>
        public string contractNo
        {
            get { return _contractNo; }
            set { _contractNo = changeValue("contractNo", _contractNo, value); }
        }

        private string _operationMaintenanceContractName;

        /// <summary>
        /// 项目名称
        /// </summary>
        public string operationMaintenanceContractName
        {
            get { return _operationMaintenanceContractName; }
            set { _operationMaintenanceContractName = changeValue("operationMaintenanceContractName", _operationMaintenanceContractName, value); }
        }

        private DateTime? _effectiveTime;

        /// <summary>
        /// effectiveTime
        /// </summary>
        public DateTime? effectiveTime
        {
            get { return _effectiveTime; }
            set { _effectiveTime = changeValue("effectiveTime", _effectiveTime, value); }
        }

        private DateTime? _failTime;

        /// <summary>
        /// failTime
        /// </summary>
        public DateTime? failTime
        {
            get { return _failTime; }
            set { _failTime = changeValue("failTime", _failTime, value); }
        }

        private string _operationMaintenanceUnitCode;

        /// <summary>
        /// 用户ID
        /// </summary>
        public string operationMaintenanceUnitCode
        {
            get { return _operationMaintenanceUnitCode; }
            set { _operationMaintenanceUnitCode = changeValue("operationMaintenanceUnitCode", _operationMaintenanceUnitCode, value); }
        }

        private string _rem;

        /// <summary>
        /// rem
        /// </summary>
        public string rem
        {
            get { return _rem; }
            set { _rem = changeValue("rem", _rem, value); }
        }

        private int? _isDis;

        /// <summary>
        /// 启用禁用状态
        /// </summary>
        public int? isDis
        {
            get { return _isDis; }
            set { _isDis = changeValue("isDis", _isDis, value); }
        }

        private int? _isDel;

        /// <summary>
        /// 是否删除
        /// </summary>
        public int? isDel
        {
            get { return _isDel; }
            set { _isDel = changeValue("isDel", _isDel, value); }
        }

        private string _createrID;

        /// <summary>
        /// createrID
        /// </summary>
        public string createrID
        {
            get { return _createrID; }
            set { _createrID = changeValue("createrID", _createrID, value); }
        }

        private DateTime? _createTime;

        /// <summary>
        /// createTime
        /// </summary>
        public DateTime? createTime
        {
            get { return _createTime; }
            set { _createTime = changeValue("createTime", _createTime, value); }
        }

        private string _updaterID;

        /// <summary>
        /// updaterID
        /// </summary>
        public string updaterID
        {
            get { return _updaterID; }
            set { _updaterID = changeValue("updaterID", _updaterID, value); }
        }

        private DateTime? _updateTime;

        /// <summary>
        /// updateTime
        /// </summary>
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
    }
}
