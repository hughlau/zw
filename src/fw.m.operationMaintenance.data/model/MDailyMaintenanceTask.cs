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
    public class MDailyMaintenanceTask : FWEntityObject
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

        private string _operationMaintenanceTaskCode;

        /// <summary>
        /// 用户ID
        /// </summary>
        [DataMember]
        public string operationMaintenanceTaskCode
        {
            get { return _operationMaintenanceTaskCode; }
            set { _operationMaintenanceTaskCode = changeValue("operationMaintenanceTaskCode", _operationMaintenanceTaskCode, value); }
        }


        private string _operationCleanRecordCode;

        /// <summary>
        ///  清掏记录code
        /// </summary>
        [DataMember]
        public string operationCleanRecordCode
        {
            get { return _operationCleanRecordCode; }
            set { _operationCleanRecordCode = changeValue("operationCleanRecordCode", _operationCleanRecordCode, value); }
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

        private string _jianzhizhen;

        /// <summary>
        /// 建制镇
        /// </summary>
        [DataMember]
        public string jianzhizhen
        {
            get { return _jianzhizhen; }
            set { _jianzhizhen = changeValue("jianzhizhen", _jianzhizhen, value); }
        }

        private string _xingzhengcun;

        /// <summary>
        /// 行政村
        /// </summary>
        [DataMember]
        public string xingzhengcun
        {
            get { return _xingzhengcun; }
            set { _xingzhengcun = changeValue("xingzhengcun", _xingzhengcun, value); }
        }

        private string _zirancun;

        /// <summary>
        /// 自然村
        /// </summary>
        [DataMember]
        public string zirancun
        {
            get { return _zirancun; }
            set { _zirancun = changeValue("zirancun", _zirancun, value); }
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
        /// 现场设备编码
        /// </summary>
        [DataMember]
        public string monitorSiteCode
        {
            get { return _monitorSiteCode; }
            set { _monitorSiteCode = changeValue("monitorSiteCode", _monitorSiteCode, value); }
        }

        private string _monitorSiteName;

        /// <summary>
        /// 现场设备名称
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

        private int _status;

        /// <summary>
        /// status
        /// </summary>
        [DataMember]
        public int status
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
            set { _taskStatusName = changeValue("taskStatusName", _taskStatusName, value); }
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

        private string _meterNum;

        /// <summary>
        /// 电表读数
        /// </summary>
        [DataMember]
        public string meterNum
        {
            get { return _meterNum; }
            set { _meterNum = changeValue("meterNum", _meterNum, value); }
        }

        private string _lastMeterNum;
        //上一次电表读数
        [DataMember]
        public string lastMeterNum
        {
            get { return _lastMeterNum; }
            set { _lastMeterNum = changeValue("lastMeterNum", _lastMeterNum, value); }
        }

        private string _operationContent;

        /// <summary>
        /// 现场操作项集合
        /// </summary>
        [DataMember]
        public string operationContent
        {
            get { return _operationContent; }
            set { _operationContent = changeValue("operationContent", _operationContent, value); }
        }


        private string _operationContentID;

        /// <summary>
        /// 现场操作项ID集合
        /// </summary>
        [DataMember]
        public string operationContentID
        {
            get { return _operationContentID; }
            set { _operationContentID = changeValue("operationContentID", _operationContentID, value); }
        }

        private string _others;

        /// <summary>
        /// 现场操作项其它
        /// </summary>
        [DataMember]
        public string others
        {
            get { return _others; }
            set { _others = changeValue("others", _others, value); }
        }

        private string _maintainers;

        /// <summary>
        /// 巡检人员签到
        /// </summary>
        [DataMember]
        public string maintainers
        {
            get { return _maintainers; }
            set { _maintainers = changeValue("maintainers", _maintainers, value); }
        }

        private string _recorder;

        /// <summary>
        /// 记录人员签到
        /// </summary>
        [DataMember]
        public string recorder
        {
            get { return _recorder; }
            set { _recorder = changeValue("recorder", _recorder, value); }
        }

        private string _recorder_imgName;
        /// <summary>
        /// 记录人员签名图片
        /// </summary>
        [DataMember]
        public string recorder_imgName
        {
            get { return _recorder_imgName; }
            set { _recorder_imgName = changeValue("recorder_imgName", _recorder_imgName, value); }
        }

        private string _inclusionRemoval_F;

        /// <summary>
        /// 浮渣厚度项1
        /// </summary>
        [DataMember]
        public string inclusionRemoval_F
        {
            get { return _inclusionRemoval_F; }
            set { _inclusionRemoval_F = changeValue("inclusionRemoval_F", _inclusionRemoval_F, value); }
        }

        private string _anaerobicFilter_F;

        /// <summary>
        /// 浮渣厚度项2
        /// </summary>
        [DataMember]
        public string anaerobicFilter_F
        {
            get { return _anaerobicFilter_F; }
            set { _anaerobicFilter_F = changeValue("anaerobicFilter_F", _anaerobicFilter_F, value); }
        }

        private string _settlingChamber_F;

        /// <summary>
        /// 浮渣厚度项3
        /// </summary>
        [DataMember]
        public string settlingChamber_F
        {
            get { return _settlingChamber_F; }
            set { _settlingChamber_F = changeValue("settlingChamber_F", _settlingChamber_F, value); }
        }

        private string _inclusionRemoval_D;

        /// <summary>
        /// 底泥厚度项1
        /// </summary>
        [DataMember]
        public string inclusionRemoval_D
        {
            get { return _inclusionRemoval_D; }
            set { _inclusionRemoval_D = changeValue("inclusionRemoval_D", _inclusionRemoval_D, value); }
        }

        private string _anaerobicFilter_D;

        /// <summary>
        /// 底泥厚度项2
        /// </summary>
        [DataMember]
        public string anaerobicFilter_D
        {
            get { return _anaerobicFilter_D; }
            set { _anaerobicFilter_D = changeValue("anaerobicFilter_D", _anaerobicFilter_D, value); }
        }

        private string _settlingChamber_D;

        /// <summary>
        /// 底泥厚度项3
        /// </summary>
        [DataMember]
        public string settlingChamber_D
        {
            get { return _settlingChamber_D; }
            set { _settlingChamber_D = changeValue("settlingChamber_D", _settlingChamber_D, value); }
        }


        /// <summary>
        /// 责任方
        /// </summary>
        private string _responsibleParty;
        [DataMember]
        public string responsibleParty
        {
            get { return _responsibleParty; }
            set { _responsibleParty = changeValue("responsibleParty", _responsibleParty, value); }
        }
        /// <summary>
        /// 责任方Id
        /// </summary>
        private int? _responsiblePartyId;
        [DataMember]
        public int? responsiblePartyId
        {
            get { return _responsiblePartyId; }
            set { _responsiblePartyId = changeValue("responsiblePartyId", _responsiblePartyId, value); }
        }

        /// <summary>
        /// 损坏内容
        /// </summary>
        private string _damagedContent;
        [DataMember]
        public string damagedContent
        {
            get { return _damagedContent; }
            set { _damagedContent = changeValue("damagedContent", _damagedContent, value); }
        }
        /// <summary>
        /// 损坏内容Id
        /// </summary>
        private string _damagedContentId;
        [DataMember]
        public string damagedContentId
        {
            get { return _damagedContentId; }
            set { _damagedContentId = changeValue("damagedContentId", _damagedContentId, value); }
        }

        /// <summary>
        /// 是否恢复   1是   0否
        /// </summary>
        private int _isRecovery;
        [DataMember]
        public int isRecovery
        {
            get { return _isRecovery; }
            set { _isRecovery = changeValue("isRecovery", _isRecovery, value); }
        }

        /// <summary>
        /// 恢复时间
        /// </summary>
        private DateTime? _recoveryTime;
        [DataMember]
        public DateTime? recoveryTime
        {
            get { return _recoveryTime; }
            set { _recoveryTime = changeValue("recoveryTime", _recoveryTime, value); }
        }

        /// <summary>
        /// 恢复人
        /// </summary>
        private string _recoveryPeople;
        [DataMember]
        public string recoveryPeople
        {
            get { return _recoveryPeople; }
            set { _recoveryPeople = changeValue("recoveryPeople", _recoveryPeople, value); }
        }
        /// <summary>
        /// 恢复人Id
        /// </summary>
        private int? _recoveryPeopleId;
        [DataMember]
        public int? recoveryPeopleId
        {
            get { return _recoveryPeopleId; }
            set { _recoveryPeopleId = changeValue("recoveryPeopleId", _recoveryPeopleId, value); }
        }

        /// <summary>
        /// 巡检结果详细情况
        /// </summary>
        private string _IRDetail;

        [DataMember]
        public string IRDetail
        {
            get { return _IRDetail; }
            set { _IRDetail = changeValue("IRDetail", _IRDetail, value); }
        }

        /// <summary>
        /// 巡检结果详细情况Id
        /// </summary>
        private int? _IRDetailId;

        [DataMember]
        public int? IRDetailId
        {
            get { return _IRDetailId; }
            set { _IRDetailId = changeValue("IRDetailId", _IRDetailId, value); }
        }

        //xml数据
        private string _xDoc;
        [DataMember]
        public string xDoc
        {
            get { return _xDoc; }
            set { _xDoc = changeValue("xDoc", _xDoc, value); }
        }
        //是否需要清掏  1需要  0不需要
        private int _isNeedClean;
        [DataMember]
        public int isNeedClean
        {
            get { return _isNeedClean; }
            set { _isNeedClean = changeValue("isNeedClean", _isNeedClean, value); }
        }

        //是否倒灌 1是 0否
        private int _isBackflow;
        [DataMember]
        public int isBackflow
        {
            get { return _isBackflow; }
            set { _isBackflow = changeValue("isBackflow", _isBackflow, value); }
        }
        //倒灌备注
        private string _backFlowNote;
        [DataMember]
        public string backFlowNote
        {
            get { return _backFlowNote; }
            set { _backFlowNote = changeValue("backFlowNote", _backFlowNote, value); }
        }
        //清掏备注
        private string _cleanNote;
        [DataMember]
        public string cleanNote
        {
            get { return _cleanNote; }
            set { _cleanNote = changeValue("cleanNote", _cleanNote, value); }
        }
        //责任主体
        private string _responsibleBody;
        [DataMember]
        public string responsibleBody
        {
            get { return _responsibleBody; }
            set { _responsibleBody = changeValue("responsibleBody", _responsibleBody, value); }
        }
        //损坏内容详细
        private string _damagedContentDetail;
        [DataMember]
        public string damagedContentDetail
        {
            get { return _damagedContentDetail; }
            set { _damagedContentDetail = changeValue("damagedContentDetail", _damagedContentDetail, value); }
        }

        //损坏细项内容
        private string _damagedItemDetails;
        [DataMember]
        public string damagedItemDetails
        {
            get { return _damagedItemDetails; }
            set { _damagedItemDetails = changeValue("damagedItemDetails", _damagedItemDetails, value); }
        }

        //电表编号
        private string _meterNo;
        [DataMember]
        public string meterNo
        {
            get { return _meterNo; }
            set { _meterNo = changeValue("meterNo", _meterNo, value); }
        }

        //审阅人员签字
        private string _reviewer_imgName;
        [DataMember]
        public string reviewer_imgName {
            get { return _reviewer_imgName; }
            set { _reviewer_imgName = changeValue("reviewer_imgName", _reviewer_imgName, value); }
        }

        //审阅人员
        private string _reviewer;
        [DataMember]
        public string reviewer
        {
            get { return _reviewer; }
            set { _reviewer = changeValue("reviewer", _reviewer, value); }
        }

        private string _water_COD;
        [DataMember]
        public string water_COD
        {
            get { return _water_COD; }
            set { _water_COD = changeValue("water_COD", _water_COD, value); }
        }
        private string _water_BOD;
        [DataMember]
        public string water_BOD
        {
            get { return _water_BOD; }
            set { _water_BOD = changeValue("water_BOD", _water_BOD, value); }
        }
        private string _water_TP;
        [DataMember]
        public string water_TP
        {
            get { return _water_TP; }
            set { _water_TP = changeValue("water_TP", _water_TP, value); }
        }
        private string _water_TN;
        [DataMember]
        public string water_TN
        {
            get { return _water_TN; }
            set { _water_TN = changeValue("water_TN", _water_TN, value); }
        }
        private string _water_SS;
        [DataMember]
        public string water_SS
        {
            get { return _water_SS; }
            set { _water_SS = changeValue("water_SS", _water_SS, value); }
        }
        private string _water_NH34;
        [DataMember]
        public string water_NH34
        {
            get { return _water_NH34; }
            set { _water_NH34 = changeValue("water_NH34", _water_NH34, value); }
        }

        //是否需要接种  1需要  0不需要
        private int _isInocation;
        [DataMember]
        public int isInocation
        {
            get { return _isInocation; }
            set { _isInocation = changeValue("isInocation", _isInocation, value); }
        }
        

        //录入水质人
        private string _water_CreateUser;
        [DataMember]
        public string water_CreateUser
        {
            get { return _water_CreateUser; }
            set { _water_CreateUser = changeValue("water_CreateUser", _water_CreateUser, value); }
        }

        //录入水质时间
        private DateTime? _water_CreateTime;
        [DataMember]
        public DateTime? water_CreateTime
        {
            get { return _water_CreateTime; }
            set { _water_CreateTime = changeValue("water_CreateTime", _water_CreateTime, value); }
        }

        //修改水质时间
        private DateTime? _water_UpdateTime;
        [DataMember]
        public DateTime? water_UpdateTime
        {
            get { return _water_UpdateTime; }
            set { _water_UpdateTime = changeValue("water_UpdateTime", _water_UpdateTime, value); }
        }

        //修改水质人
        private string _water_UpdaterUser;
        [DataMember]
        public string water_UpdaterUser
        {
            get { return _water_UpdaterUser; }
            set { _water_UpdaterUser = changeValue("water_UpdaterUser", _water_UpdaterUser, value); }
        }

        //录入水质时间
        private DateTime? _water_time;
        [DataMember]
        public DateTime? water_time
        {
            get { return _water_time; }
            set { _water_time = changeValue("water_time", _water_time, value); }
        }
        
    }
}
