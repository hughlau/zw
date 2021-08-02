using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.sysBasicManage.data.model
{
    /// <summary>
    /// 用户附属信息实体类
    /// </summary>
    [DataContract]
    public class MSystemUserInfo
    {
        private string _dictionaryCode;

        [DataMember]
        public string dictionaryCode
        {
            get { return _dictionaryCode; }
            set { _dictionaryCode = value; }
        }

        private string _dictionaryName;

        /// <summary>
        /// 字典名称
        /// </summary>
        [DataMember]
        public string dictionaryName
        {
            get { return _dictionaryName; }
            set { _dictionaryName = value; }
        }

        private string _parentDictionaryCode;

        /// <summary>
        /// 父级编码
        /// </summary>
        [DataMember]
        public string parentDictionaryCode
        {
            get { return _parentDictionaryCode; }
            set { _parentDictionaryCode = value; }
        }

        private string _userCode;

        /// <summary>
        ///用户编码
        /// </summary>
        [DataMember]
        public string userCode
        {
            get { return _userCode; }
            set { _userCode = value; }
        }
    }
}
