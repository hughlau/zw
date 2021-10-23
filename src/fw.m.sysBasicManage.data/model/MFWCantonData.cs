using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.sysBasicManage.data.model
{
    [DataContract]
    public class MFWCantonData
    {
        /// <summary>
        /// dic编码
        /// </summary>
        [DataMember]
        public String dataID { get; set; }
        /// <summary>
        /// 编码
        /// </summary>
        [DataMember]
        public String code { get; set; }

        /// <summary>
        /// 父类编码
        /// </summary> 
        [DataMember]
        public String pCode { get; set; }

        /// <summary>
        /// 名称
        /// </summary>
        [DataMember]
        public String name { get; set; }

        /// <summary>
        /// 厂区等级
        /// </summary>
        [DataMember]
        public Int32? level { get; set; }

        /// <summary>
        /// 子级数据
        /// </summary>
        [DataMember]
        public List<MFWCantonData> childDataList { get; set; }

        /// <summary>
        /// 是否选择分配
        /// </summary>
        [DataMember]
        public bool isSelected { get; set; }


        /// <summary>
        /// 分配人员
        /// </summary>
        [DataMember]
        public string selectedUserId { get; set; }


        /// <summary>
        /// 经度
        /// </summary>
        [DataMember]
        public Double? posX { get; set; }

        /// <summary>
        /// 纬度
        /// </summary>
        [DataMember]
        public Double? posY { get; set; }
    }
}
