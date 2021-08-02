using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.sysBasicManage.data.model
{

    [DataContract]
    public class MMobileInfo
    {
        /// <summary>
        /// 任务数量
        /// </summary>
        [DataMember]
        public int? taskAmount { get; set; }

        /// <summary>
        /// 消息数量
        /// </summary>
        [DataMember]
        public int? messageAmount { get; set; } 
    }
}
