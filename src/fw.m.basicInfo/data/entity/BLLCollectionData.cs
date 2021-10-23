using fw.fwDal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.basicInfo.data.entity
{
    [DataContract, Serializable]
    public class BLLCollectionData : FWEntityObject
    {
        private int _id;
        [DataMember]
        public int id
        {
            get { return _id; }
            set { _id = changeValue("id", _id, value); }
        }

        private string _cateCode;
        [DataMember]
        public string cateCode
        {
            get { return _cateCode; }
            set { _cateCode = changeValue("cateCode", _cateCode, value); }
        }

        private string _dataId;
        /// <summary>
        /// 主键
        /// </summary>
        [DataMember]
        public string dataId
        {
            get { return _dataId; }
            set { _dataId = changeValue("dataId", _dataId, value); }
        }

        private string _monitorSiteCode;
        /// <summary>
        /// 现场设备主键
        /// </summary>
        [DataMember]
        public string monitorSiteCode
        {
            get { return _monitorSiteCode; }
            set { _monitorSiteCode = changeValue("monitorSiteCode", _monitorSiteCode, value); }
        }

        private string _userId;
        /// <summary>
        /// 用户id
        /// </summary>
        [DataMember]
        public string userId
        {
            get { return _userId; }
            set { _userId = changeValue("userId", _userId, value); }
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
    }
}
