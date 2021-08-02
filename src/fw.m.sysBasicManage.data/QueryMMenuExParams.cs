using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.sysBasicManage.data
{
    /// <summary>
    /// 菜单扩展查询实体
    /// </summary>
    [DataContract]
    public class QueryMMenuExParams
    {
        private string _menuCode;
        /// <summary>
        /// 菜单编码
        /// </summary>
        [DataMember]
        public string menuCode
        {
            get { return _menuCode; }
            set { _menuCode = value; }
        }


        private string _pMenuCode;
        /// <summary>
        /// 父级菜单编码
        /// </summary>
        [DataMember]
        public string pMenuCode
        {
            get { return _pMenuCode; }
            set { _pMenuCode = value; }
        }
    }
}
