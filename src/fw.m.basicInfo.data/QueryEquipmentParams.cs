using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.basicInfo.data
{
    /// <summary>
    ///查询参数
    /// </summary>
    [DataContract]
    public class QueryEquipmentParams
    {
        /// <summary>
        ///关键字
        /// </summary>
        [DataMember]
        public string keyWord { get; set; }

        /// <summary>
        ///状态
        /// </summary>
        [DataMember]
        public string equipmentStatusCode { get; set; }

        //点位
        [DataMember]
        public string monitorSiteCode { get; set; }

        //设备类型
        [DataMember]
        public string equipmentTypeCode { get; set; }



        /// <summary>
        ///行政区编码
        /// </summary>
        [DataMember]
        public string cantonCode { get; set; }

        /// <summary>
        ///项目代号
        /// </summary>
        [DataMember]
        public string projectNo { get; set; }


        /// <summary>
        ///行政区编码
        /// </summary>
        [DataMember]
        public List<string> cantonCodeList { get; set; }

 
        /// <summary>
        /// 设备编码列表
        /// </summary>
        [DataMember]
        public List<string> equipmentNoList { get; set; }

       

        

        //0-否
        [DataMember]
        public string noBelongSite { get; set; }

        /// <summary>
        /// 反控动作
        /// </summary>
        [DataMember]
        public string Action { get; set; }

        /// <summary>
        /// 反控结果
        /// </summary>
        [DataMember]
        public string ActResult { get; set; }
    }
}
