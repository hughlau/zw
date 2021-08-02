using fw.fwDal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.operationMaintenance.data.entity
{
    [DataContract]
    public class BLLInoculationRecord : FWEntityObject
    {
        private string _code;
        [DataMember]
        public string code
        {
            get { return _code; }
            set { _code = changeValue("code", _code, value); }
        }
        private string _monitorSiteCode;
        [DataMember]
        public string monitorSiteCode
        {
            get { return _monitorSiteCode; }
            set { _monitorSiteCode = changeValue("monitorSiteCode", _monitorSiteCode, value); }
        }

        private string _typeId;
        [DataMember]
        public string typeId
        {
            get { return _typeId; }
            set { _typeId = changeValue("typeId", _typeId, value); }
        }
        private int _stats;
        [DataMember]
        public int stats
        {
            get { return _stats; }
            set { _stats = changeValue("stats", _stats, value); }
        }

        private int _isDel;
        [DataMember]
        public int isDel
        {
            get { return _isDel; }
            set { _isDel = changeValue("isDel", _isDel, value); }
        }

        private DateTime _createTime;
        [DataMember]
        public DateTime createTime
        {
            get { return _createTime; }
            set { _createTime = changeValue("createTime", _createTime, value); }
        }

        private string _createUserId;
        [DataMember]
        public string createUserId
        {
            get { return _createUserId; }
            set { _createUserId = changeValue("createUserId", _createUserId, value); }
        }

        private DateTime _updateTime;
        [DataMember]
        public DateTime updateTime
        {
            get { return _updateTime; }
            set { _updateTime = changeValue("updateTime", _updateTime, value); }
        }

        private string _updateUserId;
        [DataMember]
        public string updateUserId
        {
            get { return _updateUserId; }
            set { _updateUserId = changeValue("updateUserId", _updateUserId, value); }
        }

        private DateTime? _inoculationTime;
        [DataMember]
        public DateTime? inoculationTime
        {
            get { return _inoculationTime; }
            set { _inoculationTime = changeValue("inoculationTime", _inoculationTime, value); }
        }

        private string _inoculationUserId;
        [DataMember]
        public string inoculationUserId
        {
            get { return _inoculationUserId; }
            set { _inoculationUserId = changeValue("inoculationUserId", _inoculationUserId, value); }
        }

        private string _maintainers;
        [DataMember]
        public string maintainers
        {
            get { return _maintainers; }
            set { _maintainers = changeValue("maintainers", _maintainers, value); }
        }
    }
}
