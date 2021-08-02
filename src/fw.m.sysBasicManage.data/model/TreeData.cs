using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.sysBasicManage.data.model
{
    /// <summary>
    /// 返回名字，编码实体类
    /// </summary>
    [DataContract]
    public class TreeData
    {
        /// <summary>
        /// 编码
        /// </summary>
        [DataMember]
        public String Code
        {
            set { _code = value; }
            get { return _code; }
        }
        private String _code;

        /// <summary>
        /// 名称
        /// </summary>
        [DataMember]
        public String Name
        {
            set { _name = value; }
            get { return _name; }
        }
        private String _name;


        /// <summary>
        /// 子级
        /// </summary>
        [DataMember]
        public List<TreeData> ChildTreeDataList { get; set; }
    }
}
