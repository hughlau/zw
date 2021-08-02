using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwDal;
using System.Runtime.Serialization;
namespace fw.m.operationMaintenance.data.entity
{
    public class BLLOperationMaintenanceRecords : FWEntityObject
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


        private string _operationMaintenanceRecordCode;

        /// <summary>
        /// 用户ID
        /// </summary>
        [DataMember]
        public string operationMaintenanceRecordCode
        {
            get { return _operationMaintenanceRecordCode; }
            set { _operationMaintenanceRecordCode = changeValue("operationMaintenanceRecordCode", _operationMaintenanceRecordCode, value); }
        }

        private string _monitorSiteCode;

        /// <summary>
        /// 用户ID
        /// </summary>
        [DataMember]
        public string monitorSiteCode
        {
            get { return _monitorSiteCode; }
            set { _monitorSiteCode = changeValue("monitorSiteCode", _monitorSiteCode, value); }
        }


        private string _description;

        /// <summary>
        /// operationMaintenanceTaskName
        /// </summary>
       [DataMember]
        public string description
        {
            get { return _description; }
            set { _description = changeValue("description", _description, value); }
        }

        private string _photoAddress;

        /// <summary>
        /// 用户ID
        /// </summary>
       [DataMember]
        public string photoAddress
        {
            get { return _photoAddress; }
            set { _photoAddress = changeValue("photoAddress", _photoAddress, value); }
        }


        private string _createrID;

        /// <summary>
        /// 用户ID
        /// </summary>
       [DataMember]
        public string createrID
        {
            get { return _createrID; }
            set { _createrID = changeValue("createrID", _createrID, value); }
        }


        private DateTime? _createTime;

        /// <summary>
        /// faultTime
        /// </summary>
       [DataMember]
        public DateTime? createTime
        {
            get { return _createTime; }
            set { _createTime = changeValue("createTime", _createTime, value); }
        }



        private int? _status;

        /// <summary>
        /// isSolve
        /// </summary>
       [DataMember]
        public int? status
        {
            get { return _status; }
            set { _status = changeValue("status", _status, value); }
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


        private int _weather;

        /// <summary>
        ///  天气
        /// </summary>
        [DataMember]
        public int weather
        {
            get { return _weather; }
            set { _weather = changeValue("weather", _weather, value); }
        }

        private string _partsChangedList;

        /// <summary>
        ///  替换件
        /// </summary>
        [DataMember]
        public string partsChangedList
        {
            get { return _partsChangedList; }
            set { _partsChangedList = changeValue("partsChangedList", _partsChangedList, value); }
        }

        private string _faultDetails;

        /// <summary>
        ///  故障现象
        /// </summary>
        [DataMember]
        public string faultDetails
        {
            get { return _faultDetails; }
            set { _faultDetails = changeValue("faultDetails", _faultDetails, value); }
        }

        private string _faultReason;

        /// <summary>
        ///  故障原因
        /// </summary>
        [DataMember]
        public string faultReason
        {
            get { return _faultReason; }
            set { _faultReason = changeValue("faultReason", _faultReason, value); }
        }

        private string _solveMethod;

        /// <summary>
        ///  处理方法
        /// </summary>
        [DataMember]
        public string solveMethod
        {
            get { return _solveMethod; }
            set { _solveMethod = changeValue("solveMethod", _solveMethod, value); }
        }

        private int _solveReasult;

        /// <summary>
        ///  处理结果
        /// </summary>
        [DataMember]
        public int solveReasult
        {
            get { return _solveReasult; }
            set { _solveReasult = changeValue("solveReasult", _solveReasult, value); }
        }

        private string _unsolveReason;

        /// <summary>
        ///  维修未果的原因
        /// </summary>
        [DataMember]
        public string unsolveReason
        {
            get { return _unsolveReason; }
            set { _unsolveReason = changeValue("unsolveReason", _unsolveReason, value); }
        }

        private string _maintainSuggest;

        /// <summary>
        ///  维修建议
        /// </summary>
        [DataMember]
        public string maintainSuggest
        {
            get { return _maintainSuggest; }
            set { _maintainSuggest = changeValue("maintainSuggest", _maintainSuggest, value); }
        }

        private string _maintainers;

        /// <summary>
        /// 维修人员
        /// </summary>
        [DataMember]
        public string maintainers
        {
            get { return _maintainers; }
            set { _maintainers = changeValue("maintainers", _maintainers, value); }
        }

        private string _recorder;

        /// <summary>
        /// 记录人
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

        private DateTime? _reportTime;

        /// <summary>
        /// 报修时间
        /// </summary>
        [DataMember]
        public DateTime? reportTime
        {
            get { return _reportTime; }
            set { _reportTime = changeValue("reportTime", _reportTime, value); }
        }

        //类型  0 维修计划  1维修历史记录
        private string _oprType;
        [DataMember]
        public string oprType
        {
            get { return _oprType; }
            set { _oprType = changeValue("oprType", _oprType, value); }
        }

        //运维时间 
        private DateTime? _omTime;
        [DataMember]
        public DateTime? omTime
        {
            get { return _omTime; }
            set { _omTime = changeValue("omTime", _omTime, value); }
        }

        //
        private int _isdel;
        [DataMember]
        public int isdel
        {
            get { return _isdel; }
            set { _isdel = changeValue("isdel", _isdel, value); }
        }

        private string _reviewer;
        /// <summary>
        /// 审阅人
        /// </summary>
        public string reviewer
        {
            get { return _reviewer; }
            set { _reviewer = changeValue("reviewer", _reviewer, value); }
        }

        private string _reviewer_imgName;
        /// <summary>
        /// 审阅人签名
        /// </summary>
        public string reviewer_imgName
        {
            get { return _reviewer_imgName; }
            set { _reviewer_imgName = changeValue("reviewer_imgName", _reviewer_imgName, value); }
        }
    }
}
