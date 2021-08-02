using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwDal;
using System.Runtime.Serialization;
namespace fw.m.operationMaintenance.data.entity
{
    // 
    [DataContract]
    public class BLLOperationMaintenanceTaskExec : FWEntityObject
    {


        private long _id;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public long id
        {
            get { return _id; }
            set { _id = changeValue("id", _id, value); }
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

        private string _operationMaintenanceTaskPlanId;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public string operationMaintenanceTaskPlanId
        {
            get { return _operationMaintenanceTaskPlanId; }
            set { _operationMaintenanceTaskPlanId = changeValue("operationMaintenanceTaskPlanId", _operationMaintenanceTaskPlanId, value); }
        }

        private string _operationMaintenanceTaskExecName;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public string operationMaintenanceTaskExecName
        {
            get { return _operationMaintenanceTaskExecName; }
            set { _operationMaintenanceTaskExecName = changeValue("operationMaintenanceTaskExecName", _operationMaintenanceTaskExecName, value); }
        }

        private int _operationYear;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public int operationYear
        {
            get { return _operationYear; }
            set { _operationYear = changeValue("operationYear", _operationYear, value); }
        }

        private int _operationMonth;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public int operationMonth
        {
            get { return _operationMonth; }
            set { _operationMonth = changeValue("operationMonth", _operationMonth, value); }
        }

        private int _isValid;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public int isValid
        {
            get { return _isValid; }
            set { _isValid = changeValue("isValid", _isValid, value); }
        }

        private int _status;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public int status
        {
            get { return _status; }
            set { _status = changeValue("status", _status, value); }
        }

        private DateTime _formTime;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public DateTime formTime
        {
            get { return _formTime; }
            set { _formTime = changeValue("formTime", _formTime, value); }
        }

        private DateTime _execTime;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public DateTime execTime
        {
            get { return _execTime; }
            set { _execTime = changeValue("execTime", _execTime, value); }
        }

        private DateTime _endTime;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public DateTime endTime
        {
            get { return _endTime; }
            set { _endTime = changeValue("endTime", _endTime, value); }
        }

        private string _createrID;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public string createrID
        {
            get { return _createrID; }
            set { _createrID = changeValue("createrID", _createrID, value); }
        }

        private DateTime _createTime;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public DateTime createTime
        {
            get { return _createTime; }
            set { _createTime = changeValue("createTime", _createTime, value); }
        }

        private string _updaterID;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public string updaterID
        {
            get { return _updaterID; }
            set { _updaterID = changeValue("updaterID", _updaterID, value); }
        }

        private DateTime _updateTime;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public DateTime updateTime
        {
            get { return _updateTime; }
            set { _updateTime = changeValue("updateTime", _updateTime, value); }
        }

    }
}