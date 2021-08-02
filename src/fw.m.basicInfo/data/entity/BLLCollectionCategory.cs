using fw.fwDal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.basicInfo.data.entity
{
    [DataContract,Serializable]
    public class BLLCollectionCategory : FWEntityObject
    {
        private int? _id;
        [DataMember]
        public int? id {
            get { return _id; }
            set { _id = changeValue("id", _id, value); }
        }


        private string _cateCode;
        /// <summary>
        /// 主键
        /// </summary>
        [DataMember]
        public string cateCode {
            get { return _cateCode; }
            set { _cateCode = changeValue("cateCode", _cateCode, value); }
        }

        private string _cateName;
        /// <summary>
        /// 分类名
        /// </summary>
        [DataMember]
        public string cateName {
            get { return _cateName; }
            set { _cateName = changeValue("cateName", _cateName, value); }
        }

        private string _userId;
        [DataMember]
        public string userId
        {
            get { return _userId; }
            set { _userId = changeValue("userId", _userId, value); }
        }

        private string _description;
        [DataMember]
        public string description {
            get { return _description; }
            set { _description = changeValue("description", _description, value); }
        }


        private int _isDel;
        [DataMember]
        public int isDel
        {
            get { return _isDel; }
            set { _isDel = changeValue("isDel", _isDel, value); }
        }


        private DateTime? _createTime;
        [DataMember]
        public DateTime? createTime {
            get { return _createTime; }
            set { _createTime = changeValue("createTime", _createTime, value); }
        }
    }
}
