using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwDal;
using System.Runtime.Serialization;

namespace fw.m.operationMaintenance.data.model
{
    /// <summary>
    /// 报警信息
    /// </summary>
    [DataContract]
    public class MMonitorSiteAlarm : FWEntityObject
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

        private string _monitorSiteAlarmName;

        /// <summary>
        /// monitorSiteAlarmName
        /// </summary>
        [DataMember]
        public string monitorSiteAlarmName
        {
            get { return _monitorSiteAlarmName; }
            set { _monitorSiteAlarmName = changeValue("monitorSiteAlarmName", _monitorSiteAlarmName, value); }
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

        private string _monitorSiteName;

        /// <summary>
        ///设施点位名称 
        /// </summary>
        [DataMember]
        public string monitorSiteName
        {
            get { return _monitorSiteName; }
            set { _monitorSiteName = value; }
        }

        private string _alarmTypeCode;

        /// <summary>
        /// alarmTypeCode
        /// </summary>
        [DataMember]
        public string alarmTypeCode
        {
            get { return _alarmTypeCode; }
            set { _alarmTypeCode = changeValue("alarmTypeCode", _alarmTypeCode, value); }
        }

        private string _alarmTypeName;

        /// <summary>
        /// 报警类型名称
        /// </summary>
        [DataMember]
        public string alarmTypeName
        {
            get { return _alarmTypeName; }
            set { _alarmTypeName = value; }
        }

        private string _description;

        /// <summary>
        /// description
        /// </summary>
        [DataMember]
        public string description
        {
            get { return _description; }
            set { _description = changeValue("description", _description, value); }
        }

        private DateTime _alarmTime;

        /// <summary>
        /// alarmTime
        /// </summary>
        [DataMember]
        public DateTime alarmTime
        {
            get { return _alarmTime; }
            set { _alarmTime = changeValue("alarmTime", _alarmTime, value); }
        }

        private int _isGenerateTask;

        /// <summary>
        /// isGenerateTask
        /// </summary>
        [DataMember]
        public int isGenerateTask
        {
            get { return _isGenerateTask; }
            set { _isGenerateTask = changeValue("isGenerateTask", _isGenerateTask, value); }
        }

        private int _isSolve;

        /// <summary>
        /// isSolve
        /// </summary>
        [DataMember]
        public int isSolve
        {
            get { return _isSolve; }
            set { _isSolve = changeValue("isSolve", _isSolve, value); }
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

        private int _isDis;

        /// <summary>
        /// isDis
        /// </summary>
        [DataMember]
        public int isDis
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

        private DateTime _createTime;

        /// <summary>
        /// createTime
        /// </summary>
        [DataMember]
        public DateTime createTime
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

        private DateTime _updateTime;

        /// <summary>
        /// updateTime
        /// </summary>
        [DataMember]
        public DateTime updateTime
        {
            get { return _updateTime; }
            set { _updateTime = changeValue("updateTime", _updateTime, value); }
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
    }
}
