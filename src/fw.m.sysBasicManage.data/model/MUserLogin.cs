using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.sysBasicManage.data.model
{
    /// <summary>
    /// 用户登录
    /// </summary>
    [DataContract]
    public class MUserLogin
    {
        /// <summary>
        /// 用户主键
        /// </summary>
        [DataMember]
        public string mUserID { get; set; }
        /// <summary>
        /// 用户名
        /// </summary>
        [DataMember]
        public string mUserName { get; set; }
        /// <summary>
        /// 用户名
        /// </summary>
        [DataMember]
        public string mChineseName { get; set; }
        /// <summary>
        /// 用户类型编码
        /// </summary>
        [DataMember]
        public string UserTypeCode { get; set; }
        /// <summary>
        /// 用户类型编码
        /// </summary>
        [DataMember]
        public string UserTypeName { get; set; }
    }
}
