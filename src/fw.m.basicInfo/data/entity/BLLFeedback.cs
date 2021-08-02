using fw.fwDal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.basicInfo.data
{
    [DataContract]
    public class BLLFeedback : FWEntityObject
    {
        private int _id;
        [DataMember]
        public int id
        {
            get { return _id; }
            set { _id = changeValue("id", _id, value); }
        }
        private string _maintainer;
        [DataMember]
        public string maintainer
        {
            get { return _maintainer; }
            set { _maintainer = changeValue("maintainer", _maintainer, value); }
        }
        private string _detail;
        [DataMember]
        public string detail
        {
            get { return _detail; }
            set { _detail = changeValue("detail", _detail, value); }
        }
        private DateTime _createTime;
        [DataMember]
        public DateTime createTime
        {
            get { return _createTime; }
            set { _createTime = changeValue("createTime", _createTime, value); }
        }
        private string _createUser;
        [DataMember]
        public string createUser
        {
            get { return _createUser; }
            set { _createUser = changeValue("createUser", _createUser, value); }
        }
        private int _isDel;
        [DataMember]
        public int isDel
        {
            get { return _isDel; }
            set { _isDel = changeValue("isDel", _isDel, value); }
        }
    }
}
