using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.sysBasicManage.data
{
    /// <summary>
    /// 系统管理基础查询类
    /// </summary>
    [DataContract]
    public class QueryBasicManageParams
    {
        private string _keyword;

        /// <summary>
        /// 关键字
        /// </summary>
        [DataMember]
        public string keyword
        {
            get { return _keyword; }
            set { _keyword = value; }
        }

        private string _pkCode;

        /// <summary>
        /// 主键
        /// </summary>
        [DataMember]
        public string pkCode
        {
            get { return _pkCode; }
            set { _pkCode = value; }
        }

        private string _typeCode;

        /// <summary>
        /// 类型编码(label代表标签)
        /// </summary>
        [DataMember]
        public string typeCode
        {
            get { return _typeCode; }
            set { _typeCode = value; }
        }

        private string _cantonCode;

        /// <summary>
        /// 行政区编码
        /// </summary>
        [DataMember]
        public string cantonCode
        {
            get { return _cantonCode; }
            set { _cantonCode = value; }
        }

        private List<string> _cantonCodeList;

        /// <summary>
        /// 行政区列表
        /// </summary>
        [DataMember]
        public List<string> cantonCodeList
        {
            get { return _cantonCodeList; }
            set { _cantonCodeList = value; }
        }

        private string _enterpriseCode;

        /// <summary>
        /// 企业编码
        /// </summary>
        [DataMember]
        public string enterpriseCode
        {
            get { return _enterpriseCode; }
            set { _enterpriseCode = value; }
        }
    }
}
