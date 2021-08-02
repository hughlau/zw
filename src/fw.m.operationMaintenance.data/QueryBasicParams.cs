using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.operationMaintenance.data
{
 
    /// <summary>
    ///查询参数
    /// </summary>
    [DataContract, Serializable]
    public class QueryBasicParams
    {
 

        /// <summary>
        ///关键字
        /// </summary>
        [DataMember]
        public string keyword { get; set; } 

        /// <summary>
        /// 行政区编码
        /// </summary>
        [DataMember]
        public string cantonCode  { get; set; }  
         

        /// <summary>
        /// 开始日期
        /// </summary>
        [DataMember]
        public DateTime? dStart { get; set; }

        /// <summary>
        /// 结束日期
        /// </summary>
        [DataMember]
        public DateTime? dEnd { get; set; }

         
    }
}
