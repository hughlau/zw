using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.sysBasicManage.data.model
{
    [DataContract]
    public class MCantonTreeData
    {
        /// <summary>
        /// 编码
        /// </summary>
        [DataMember]
        public String code
        {
            set { _code = value; }
            get { return _code; }
        }
        private String _code;

        /// <summary>
        /// 父类编码
        /// </summary>
        private String _parentCode;
        [DataMember]
        public String parentCode
        {
            set { _parentCode = value; }
            get { return _parentCode; }
        }

        /// <summary>
        /// 名称
        /// </summary>
        [DataMember]
        public String name
        {
            set { _name = value; }
            get { return _name; }
        }
        private String _name;

        /// <summary>
        /// 子级数据
        /// </summary>
        [DataMember]
        public List<MCantonTreeData> childTreeDataList
        {
            set { _childTreeDataList = value; }
            get { return _childTreeDataList; }
        }
        private List<MCantonTreeData> _childTreeDataList = new List<MCantonTreeData>();

        /// <summary>
        /// 厂区登级
        /// </summary>
        [DataMember]
        public Int32 level
        {
            set { _level = value; }
            get { return _level; }
        }
        private Int32 _level;
    }
}
