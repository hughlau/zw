using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.sysBasicManage.data
{
    /// <summary>
    /// 行政区查询条件
    /// </summary>
    [DataContract]
    public class QueryCantonParams : QueryBasicManageParams
    {
        private string _parentCode;

        /// <summary>
        /// 父级编码
        /// </summary>
        [DataMember]
        public string parentCode
        {
            get { return _parentCode; }
            set { _parentCode = value; }
        }

        private string _Name;

        /// <summary>
        /// 名称
        /// </summary>
        [DataMember]
        public string name
        {
            get { return _Name; }
            set { _Name = value; }
        }

        private string _code;

        /// <summary>
        /// 编码
        /// </summary>
        [DataMember]
        public string code
        {
            get { return _code; }
            set { _code = value; }
        }
    }
}
