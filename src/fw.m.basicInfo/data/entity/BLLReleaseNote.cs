using fw.fwDal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.basicInfo.data.entity
{
    [DataContract]
    public class BLLReleaseNote : FWEntityObject
    {
        private int _id;
        [DataMember]
        public int id
        {
            get { return _id; }
            set { _id = changeValue("id", _id, value); }
        }

        private int _type;
        /// <summary>
        /// 0、web更新说明；1、app更新说明
        /// </summary>
        [DataMember]
        public int type
        {
            get { return _type; }
            set { _type = changeValue("type", _type, value); }
        }
        private string _version;
        [DataMember]
        public string version
        {
            get { return _version; }
            set { _version = changeValue("version", _version, value); }
        }
        private string _description;
        [DataMember]
        public string description
        {
            get { return _description; }
            set { _description = changeValue("description", _description, value); }
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
