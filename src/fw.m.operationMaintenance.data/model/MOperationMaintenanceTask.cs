using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwDal;
using System.Runtime.Serialization;

namespace fw.m.operationMaintenance.data.model
{
    /// <summary>
    /// 运维人员运维任务
    /// </summary>
    [DataContract]
    public class MOperationMaintenanceTask : FWEntityObject
    {

        private long _id;

        /// <summary>
        /// ID
        /// </summary>
        [DataMember]
        public long id
        {
            get { return _id; }
            set { _id = value; }
        }

        private string _perationMaintenanceTaskCode;

        /// <summary>
        /// 用户ID
        /// </summary>
        [DataMember]
        public string operationMaintenanceTaskCode
        {
            get { return _perationMaintenanceTaskCode; }
            set { _perationMaintenanceTaskCode = changeValue("operationMaintenanceTaskCode", _perationMaintenanceTaskCode, value); }
        }

        private string _perationMaintenanceTaskName;

        /// <summary>
        /// operationMaintenanceTaskName
        /// </summary>
        [DataMember]
        public string operationMaintenanceTaskName
        {
            get { return _perationMaintenanceTaskName; }
            set { _perationMaintenanceTaskName = changeValue("operationMaintenanceTaskName", _perationMaintenanceTaskName, value); }
        }

        private string _monitorSiteAlarmCode;

        /// <summary>
        /// 用户ID
        /// </summary>
        [DataMember]
        public string monitorSiteAlarmCode
        {
            get { return _monitorSiteAlarmCode; }
            set { _monitorSiteAlarmCode = changeValue("monitorSiteAlarmCode", _monitorSiteAlarmCode, value); }
        }

        private string _cantonName;

        /// <summary>
        /// 厂区名称
        /// </summary>
        [DataMember]
        public string cantonName
        {
            get { return _cantonName; }
            set { _cantonName = value; }
        }

        private string _cantonCode;

        /// <summary>
        /// 厂区编码
        /// </summary>
        [DataMember]
        public string cantonCode
        {
            get { return _cantonCode; }
            set { _cantonCode = value; }
        }

        private string _address;

        /// <summary>
        /// 点位安装地点
        /// </summary>
        [DataMember]
        public string address
        {
            get { return _address; }
            set { _address = value; }
        }

        /// <summary>
        /// 经度
        /// </summary>
        [DataMember]
        public double? longitude
        {
            get { return _longitude; }
            set { _longitude = value; }
        }
        private double? _longitude;

        /// <summary>
        /// 维度
        /// </summary>
        [DataMember]
        public double? latitude
        {
            get { return _latitude; }
            set { _latitude = value; }
        }
        private double? _latitude;

        /// <summary>
        /// 点位安装地点
        /// </summary>
        [DataMember]
        public double? distance
        {
            get { return _distance; }
            set { _distance = value; }
        }
        private double? _distance;



        private string _operationMaintenanceUnitCode;

        /// <summary>
        /// 所属企业编码
        /// </summary>
        [DataMember]
        public string operationMaintenanceUnitCode
        {
            get { return _operationMaintenanceUnitCode; }
            set { _operationMaintenanceUnitCode = value; }
        }

        private string _operationMaintenanceUnitName;

        /// <summary>
        /// 所属企业名称
        /// </summary>
        [DataMember]
        public string operationMaintenanceUnitName
        {
            get { return _operationMaintenanceUnitName; }
            set { _operationMaintenanceUnitName = value; }
        }

        private string _monitorSiteCode;

        /// <summary>
        /// 设施点位编码
        /// </summary>
        [DataMember]
        public string monitorSiteCode
        {
            get { return _monitorSiteCode; }
            set { _monitorSiteCode = changeValue("monitorSiteCode", _monitorSiteCode, value); }
        }

        private string _monitorSiteName;

        /// <summary>
        /// 设施点位名称
        /// </summary>
        [DataMember]
        public string monitorSiteName
        {
            get { return _monitorSiteName; }
            set { _monitorSiteName = value; }
        }

        private string _faultTypeCode;

        /// <summary>
        /// 故障类型编码
        /// </summary>
        [DataMember]
        public string faultTypeCode
        {
            get { return _faultTypeCode; }
            set { _faultTypeCode = changeValue("faultTypeCode", _faultTypeCode, value); }
        }

        private string _faultTypeName;

        /// <summary>
        /// 故障类型名称
        /// </summary>
        [DataMember]
        public string faultTypeName
        {
            get { return _faultTypeName; }
            set { _faultTypeName = value; }
        }

        private string _taskTypeCode;

        /// <summary>
        /// 任务类型编码
        /// </summary>
        [DataMember]
        public string taskTypeCode
        {
            get { return _taskTypeCode; }
            set { _taskTypeCode = changeValue("taskTypeCode", _taskTypeCode, value); }
        }

        /// <summary>
        /// 任务类型名称
        /// </summary>
        [DataMember]
        public string taskTypeName { get; set; }

        private DateTime? _faultTime;

        /// <summary>
        /// faultTime
        /// </summary>
        [DataMember]
        public DateTime? faultTime
        {
            get { return _faultTime; }
            set { _faultTime = changeValue("faultTime", _faultTime, value); }
        }

        private DateTime? _prescribeRepairTime;

        /// <summary>
        /// prescribeRepairTime
        /// </summary>
        [DataMember]
        public DateTime? prescribeRepairTime
        {
            get { return _prescribeRepairTime; }
            set { _prescribeRepairTime = changeValue("prescribeRepairTime", _prescribeRepairTime, value); }
        }

        private DateTime? _repairTime;

        /// <summary>
        /// repairTime
        /// </summary>
        [DataMember]
        public DateTime? repairTime
        {
            get { return _repairTime; }
            set { _repairTime = changeValue("repairTime", _repairTime, value); }
        }

        private DateTime? _receiveTime;

        /// <summary>
        /// 任务接收时间
        /// </summary>
        [DataMember]
        public DateTime? receiveTime
        {
            get { return _receiveTime; }
            set { _receiveTime = changeValue("receiveTime", _receiveTime, value); }
        }
        private string _operationMaintenancePersonCode;

        /// <summary>
        /// 运维人员编码
        /// </summary>
        [DataMember]
        public string operationMaintenancePersonCode
        {
            get { return _operationMaintenancePersonCode; }
            set { _operationMaintenancePersonCode = changeValue("operationMaintenancePersonCode", _operationMaintenancePersonCode, value); }
        }

        private string _operationMaintenancePersonName;

        /// <summary>
        /// 运维人员名称
        /// </summary>
        [DataMember]
        public string operationMaintenancePersonName
        {
            get { return _operationMaintenancePersonName; }
            set { _operationMaintenancePersonName = value; }
        }

        private string _status;

        /// <summary>
        /// status
        /// </summary>
        [DataMember]
        public string status
        {
            get { return _status; }
            set { _status = changeValue("status", _status, value); }
        }

        private string _taskStatusName;

        /// <summary>
        /// 任务状态名称
        /// </summary>
        [DataMember]
        public string taskStatusName
        {
            get { return _taskStatusName; }
            set { _taskStatusName = value; }
        }

        private int? _isSolve;

        /// <summary>
        /// isSolve
        /// </summary>
        [DataMember]
        public int? isSolve
        {
            get { return _isSolve; }
            set { _isSolve = changeValue("isSolve", _isSolve, value); }
        }

        private int? _isGoSite;

        /// <summary>
        /// isGoSite
        /// </summary>
        [DataMember]
        public int? isGoSite
        {
            get { return _isGoSite; }
            set { _isGoSite = changeValue("isGoSite", _isGoSite, value); }
        }

        private string _opinion;

        /// <summary>
        /// opinion
        /// </summary>
        [DataMember]
        public string opinion
        {
            get { return _opinion; }
            set { _opinion = changeValue("opinion", _opinion, value); }
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
        /// isDis
        /// </summary>
        [DataMember]
        public int? isDis
        {
            get { return _isDis; }
            set { _isDis = changeValue("isDis", _isDis, value); }
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
        private string _operationMaintenanceFormFileName;

        /// <summary>
        /// 运维表单文件名
        /// </summary>
        [DataMember]
        public string operationMaintenanceFormFileName
        {
            get { return _operationMaintenanceFormFileName; }
            set { _operationMaintenanceFormFileName = changeValue("operationMaintenanceFormFileName", _operationMaintenanceFormFileName, value); }
        }

        private string _operationMaintenanceFormData;

        /// <summary>
        /// 表单数据
        /// </summary>
        [DataMember]
        public string operationMaintenanceFormData
        {
            get { return _operationMaintenanceFormData; }
            set { _operationMaintenanceFormData = changeValue("operationMaintenanceFormData", _operationMaintenanceFormData, value); }
        }

        /// <summary>
        /// 表单名称
        /// </summary>
        [DataMember]
        public string templateName { get; set; }

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


        [DataMember]
        public string equipmentName { get; set; }

        [DataMember]
        public string equipmentNo { get; set; }

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
