using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using fw.fwDal;

namespace fw.m.sysBasicManage.data.entity
{
    [DataContract]
    public class FWUserMappingDictionary : FWEntityObject
    {




        private string _dataID;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public string dataID
        {
            get { return _dataID; }
            set { _dataID = changeValue("dataID", _dataID, value); }
        }

        private string _userID;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public string userID
        {
            get { return _userID; }
            set { _userID = changeValue("userID", _userID, value); }
        }

        private string _dictionaryDataID;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public string dictionaryDataID
        {
            get { return _dictionaryDataID; }
            set { _dictionaryDataID = changeValue("dictionaryDataID", _dictionaryDataID, value); }
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

        private DateTime? _createTime;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public DateTime? createTime
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

        private DateTime? _updateTime;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public DateTime? updateTime
        {
            get { return _updateTime; }
            set { _updateTime = changeValue("updateTime", _updateTime, value); }
        }

    }
}
