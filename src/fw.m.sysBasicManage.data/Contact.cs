using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.sysBasicManage.data
{
    [DataContract, Serializable]
    public class Contact
    {
        /// <summary>
        /// 用户名称
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String userID
        {
            set { _userID = value; }
            get { return _userID; }
        }
        private String _userID;

        /// <summary>
        /// 用户名称
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String userName
        {
            set { _userName = value; }
            get { return _userName; }
        }
        private String _userName;

        /// <summary>
        /// 用户名称
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String photoUrl
        {
            set { _photoUrl = value; }
            get { return _photoUrl; }
        }
        private String _photoUrl;

        /// <summary>
        /// 用户名称
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String photoFileFingerprint
        {
            set { _photoFileFingerprint = value; }
            get { return _photoFileFingerprint; }
        }
        private String _photoFileFingerprint;     

        /// <summary>
        /// 用户名称
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String orgName
        {
            set { _orgName = value; }
            get { return _orgName; }
        }
        private String _orgName;

        /// <summary>
        /// 用户名称
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String orgFullName
        {
            set { _orgFullName = value; }
            get { return _orgFullName; }
        }
        private String _orgFullName;


    }
}
