using fw.fwDal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.basicInfo.data.model
{
    [DataContract, Serializable]
    public class MBLLCollectionData : FWEntityObject
    {
        private string _dataId;
        [DataMember]
        public string dataId
        {
            get { return _dataId; }
            set { _dataId = changeValue("dataId", _dataId, value); }
        }

        private string _cateCode;
        [DataMember]
        public string cateCode
        {
            get { return _cateCode; }
            set { _cateCode = changeValue("cateCode", _cateCode, value); }
        }

        private string _cateName;
        [DataMember]
        public string cateName
        {
            get { return _cateName; }
            set { _cateName = changeValue("cateName", _cateName, value); }
        }

        private string _monitorSiteCode;
        [DataMember]
        public string monitorSiteCode
        {
            get { return _monitorSiteCode; }
            set { _monitorSiteCode = changeValue("monitorSiteCode", _monitorSiteCode, value); }
        }

        private string _monitorSiteName;
        [DataMember]
        public string monitorSiteName
        {
            get { return _monitorSiteName; }
            set { _monitorSiteName = changeValue("monitorSiteName", _monitorSiteName, value); }
        }

        private DateTime _createTime;
        [DataMember]
        public DateTime createTime
        {
            get { return _createTime; }
            set { _createTime = changeValue("createTime", _createTime, value); }
        }
    }
}
