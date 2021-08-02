using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using fw.fwDal;

namespace fw.m.operationMaintenance.data.entity
{
    public class BLLOperationMaintenanceTask : FWEntityObject
    {

        private long _id;

        /// <summary>
        /// ID
        /// </summary>

        public long id
        {
            get { return _id; }
            set { _id = value; }
        }

        private string _perationMaintenanceTaskCode;

        /// <summary>
        /// 用户ID
        /// </summary>

        public string operationMaintenanceTaskCode
        {
            get { return _perationMaintenanceTaskCode; }
            set { _perationMaintenanceTaskCode = changeValue("operationMaintenanceTaskCode", _perationMaintenanceTaskCode, value); }
        }

        private string _perationMaintenanceTaskName;

        /// <summary>
        /// operationMaintenanceTaskName
        /// </summary>

        public string operationMaintenanceTaskName
        {
            get { return _perationMaintenanceTaskName; }
            set { _perationMaintenanceTaskName = changeValue("operationMaintenanceTaskName", _perationMaintenanceTaskName, value); }
        }

        private string _monitorSiteAlarmCode;

        /// <summary>
        /// 用户ID
        /// </summary>

        public string monitorSiteAlarmCode
        {
            get { return _monitorSiteAlarmCode; }
            set { _monitorSiteAlarmCode = changeValue("monitorSiteAlarmCode", _monitorSiteAlarmCode, value); }
        }

        private string _monitorSiteCode;

        /// <summary>
        /// 用户ID
        /// </summary>

        public string monitorSiteCode
        {
            get { return _monitorSiteCode; }
            set { _monitorSiteCode = changeValue("monitorSiteCode", _monitorSiteCode, value); }
        }

        private string _faultTypeCode;

        /// <summary>
        /// faultTypeCode
        /// </summary>

        public string faultTypeCode
        {
            get { return _faultTypeCode; }
            set { _faultTypeCode = changeValue("faultTypeCode", _faultTypeCode, value); }
        }
        
        private string _taskTypeCode;

        /// <summary>
        /// 任务类型编码
        /// </summary>
        public string taskTypeCode
        {
            get { return _taskTypeCode; }
            set { _taskTypeCode = changeValue("taskTypeCode", _taskTypeCode, value); }
        }

        private DateTime? _faultTime;

        /// <summary>
        /// faultTime
        /// </summary>

        public DateTime? faultTime
        {
            get { return _faultTime; }
            set { _faultTime = changeValue("faultTime", _faultTime, value); }
        }

        private DateTime? _prescribeRepairTime;

        /// <summary>
        /// prescribeRepairTime
        /// </summary>

        public DateTime? prescribeRepairTime
        {
            get { return _prescribeRepairTime; }
            set { _prescribeRepairTime = changeValue("prescribeRepairTime", _prescribeRepairTime, value); }
        }

        private DateTime? _repairTime;

        /// <summary>
        /// repairTime
        /// </summary>

        public DateTime? repairTime
        {
            get { return _repairTime; }
            set { _repairTime = changeValue("repairTime", _repairTime, value); }
        }

        private DateTime? _receiveTime;

        /// <summary>
        /// 任务接收时间
        /// </summary>
        public DateTime? receiveTime
        {
            get { return _receiveTime; }
            set { _receiveTime = changeValue("receiveTime", _receiveTime, value); }
        }

        private string _operationMaintenancePersonCode;

        /// <summary>
        /// 用户ID
        /// </summary>

        public string operationMaintenancePersonCode
        {
            get { return _operationMaintenancePersonCode; }
            set { _operationMaintenancePersonCode = changeValue("operationMaintenancePersonCode", _operationMaintenancePersonCode, value); }
        }

        private string _status;

        /// <summary>
        /// status
        /// </summary>

        public string status
        {
            get { return _status; }
            set { _status = changeValue("status", _status, value); }
        }

        private int? _isSolve;

        /// <summary>
        /// isSolve
        /// </summary>

        public int? isSolve
        {
            get { return _isSolve; }
            set { _isSolve = changeValue("isSolve", _isSolve, value); }
        }

        private int? _isGoSite;

        /// <summary>
        /// isGoSite
        /// </summary>

        public int? isGoSite
        {
            get { return _isGoSite; }
            set { _isGoSite = changeValue("isGoSite", _isGoSite, value); }
        }

        private string _opinion;

        /// <summary>
        /// opinion
        /// </summary>

        public string opinion
        {
            get { return _opinion; }
            set { _opinion = changeValue("opinion", _opinion, value); }
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
        /// isDis
        /// </summary>

        public int? isDis
        {
            get { return _isDis; }
            set { _isDis = changeValue("isDis", _isDis, value); }
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

        private string _operationMaintenanceFormFileName;

        /// <summary>
        /// 运维表单文件名
        /// </summary>
        public string operationMaintenanceFormFileName
        {
            get { return _operationMaintenanceFormFileName; }
            set { _operationMaintenanceFormFileName = changeValue("operationMaintenanceFormFileName", _operationMaintenanceFormFileName, value); }
        }

        private string _operationMaintenanceFormData;

        /// <summary>
        /// 表单数据
        /// </summary>
        public string operationMaintenanceFormData
        {
            get { return _operationMaintenanceFormData; }
            set { _operationMaintenanceFormData = changeValue("operationMaintenanceFormData", _operationMaintenanceFormData, value); }
        }

        private string _operationMaintenanceTaskExecId;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public string operationMaintenanceTaskExecId
        {
            get { return _operationMaintenanceTaskExecId; }
            set { _operationMaintenanceTaskExecId = changeValue("operationMaintenanceTaskExecId", _operationMaintenanceTaskExecId, value); }
        }

        private string _equipmentCode;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public string equipmentCode
        {
            get { return _equipmentCode; }
            set { _equipmentCode = changeValue("equipmentCode", _equipmentCode, value); }
        }

        private string _remark;
        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public string remark
        {
            get { return _remark; }
            set { _remark = changeValue("remark", _remark, value); }
        }

        private string _GPS;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public string GPS
        {
            get { return _GPS; }
            set { _GPS = changeValue("GPS", _GPS, value); }
        }

        private string _imgName;

        /// <summary>
        /// 运维现场图片名称
        /// </summary>
        [DataMember]
        public string imgName
        {
            get { return _imgName; }
            set { _imgName = changeValue("imgName", _imgName, value); }
        }
    }
}
