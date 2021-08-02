using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.sysBasicManage.data
{
    public class QueryPageMFWUserInfoParams
    {
        /// <summary>
        /// 关键字
        /// </summary>
        [DataMember]
        public string keyword { get; set; }
         
        [DataMember]
        public string mChineseName { get; set; }

        [DataMember]
        public string mOrgCode { get; set; }


        [DataMember]
        public string userTypeCode { get; set; }

    }
}
