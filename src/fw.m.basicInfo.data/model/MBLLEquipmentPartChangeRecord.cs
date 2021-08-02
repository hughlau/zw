using fw.fwDal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.basicInfo.data.model
{
    [DataContract, Serializable]
    public class MBLLEquipmentPartChangeRecord : FWEntityObject
    {
        private int _id;
        [DataMember]
        public int id
        {
            get { return _id; }
            set { _id = changeValue("id", _id, value); }
        }

        private string _monitorSiteCode;
        [DataMember]
        public string monitorSiteCode
        {
            get { return _monitorSiteCode; }
            set { _monitorSiteCode = changeValue("monitorSiteCode", _monitorSiteCode, value); }
        }

        private string _partCode;
        [DataMember]
        public string partCode
        {
            get { return _partCode; }
            set { _partCode = changeValue("partCode", _partCode, value); }
        }

        private string _monitorSiteName;
        [DataMember]
        public string monitorSiteName
        {
            get { return _monitorSiteName; }
            set { _monitorSiteName = changeValue("monitorSiteName", _monitorSiteName, value); }
        }

        private string _partName;
        [DataMember]
        public string partName
        {
            get { return _partName; }
            set { _partName = changeValue("partName", _partName, value); }
        }
        private string _partType;
        [DataMember]
        public string partType
        {
            get { return _partType; }
            set { _partType = changeValue("partType", _partType, value); }
        }
        private string _userName;
        [DataMember]
        public string userName
        {
            get { return _userName; }
            set { _userName = changeValue("userName", _userName, value); }
        }
        private DateTime _changeTime;
        [DataMember]
        public DateTime changeTime
        {
            get { return _changeTime; }
            set { _changeTime = changeValue("changeTime", _changeTime, value); }
        }

        private string _recoverTypeName;
        [DataMember]
        public string recoverTypeName
        {
            get { return _recoverTypeName; }
            set { _recoverTypeName = changeValue("recoverTypeName", _recoverTypeName, value); }
        }
    }
}
