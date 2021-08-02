using fw.fwDal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.basicInfo.data.entity
{
    [DataContract]
    public class BLLControlPlan : FWEntityObject
    {
        private string _code;

        /// <summary>
        ///  主键
        /// </summary>
        [DataMember]
        public string code
        {
            get { return _code; }
            set { _code = changeValue("code", _code, value); }
        }

        private string _name;

        /// <summary>
        ///  方案名
        /// </summary>
        [DataMember]
        public string name
        {
            get { return _name; }
            set { _name = changeValue("name", _name, value); }
        }

        private string _detail;

        /// <summary>
        ///  方案描述
        /// </summary>
        [DataMember]
        public string detail
        {
            get { return _detail; }
            set { _detail = changeValue("detail", _detail, value); }
        }


        private int _isDel;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public int isDel
        {
            get { return _isDel; }
            set { _isDel = changeValue("isDel", _isDel, value); }
        }

        private DateTime _createTime;

        /// <summary>
        ///  创建时间
        /// </summary>
        [DataMember]
        public DateTime createTime
        {
            get { return _createTime; }
            set { _createTime = changeValue("createTime", _createTime, value); }
        }

        private DateTime _updateTime;

        /// <summary>
        ///  修改时间
        /// </summary>
        [DataMember]
        public DateTime updateTime
        {
            get { return _updateTime; }
            set { _updateTime = changeValue("updateTime", _updateTime, value); }
        }

        private string _createUserId;
        [DataMember]
        public string createUserId
        {
            get { return _createUserId; }
            set { _createUserId = changeValue("createUserId", _createUserId, value); }
        }

        private string _updateUserId;
        public string updateUserId
        {
            get { return _updateUserId; }
            set { _updateUserId = changeValue("updateUserId", _updateUserId, value); }
        }
    }
}
