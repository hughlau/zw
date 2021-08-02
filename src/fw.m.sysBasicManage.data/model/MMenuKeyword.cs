using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.sysBasicManage.data.model
{
    /// <summary>
    /// 菜单关键字
    /// </summary>
    [DataContract]
    public class MMenuKeyword
    {

        /// <summary>
        /// 关键字编码
        /// </summary>
        [DataMember]
        public string keywordCode
        {
            get { return _keywordCode; }
            set { _keywordCode = value; }
        }

        private string _keywordCode;

        /// <summary>
        /// 关键字名称
        /// </summary>
        [DataMember]
        public string keywordName
        {
            get { return _keywordName; }
            set { _keywordName = value; }
        }

        private string _keywordName;
    }
}
