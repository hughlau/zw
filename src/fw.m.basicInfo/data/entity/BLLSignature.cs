using fw.fwDal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.basicInfo.data.entity
{
    [DataContract]
    public class BLLSignature : FWEntityObject
    {
        private int _id;

        /// <summary>
        ///  主键
        /// </summary>
        [DataMember]
        public int id
        {
            get { return _id; }
            set { _id = changeValue("id", _id, value); }
        }

        private string _userId;

        /// <summary>
        ///  用户id
        /// </summary>
        [DataMember]
        public string userId
        {
            get { return _userId; }
            set { _userId = changeValue("userId", _userId, value); }
        }

        private string _title;

        /// <summary>
        ///  标题
        /// </summary>
        [DataMember]
        public string title
        {
            get { return _title; }
            set { _title = changeValue("title", _title, value); }
        }

        private string _imgName;

        /// <summary>
        ///  图片
        /// </summary>
        [DataMember]
        public string imgName
        {
            get { return _imgName; }
            set { _imgName = changeValue("imgName", _imgName, value); }
        }

        private int _isDefault;

        /// <summary>
        ///  默认
        /// </summary>
        [DataMember]
        public int isDefault
        {
            get { return _isDefault; }
            set { _isDefault = changeValue("isDefault", _isDefault, value); }
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
    }
}
