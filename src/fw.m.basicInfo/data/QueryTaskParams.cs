using System;
using System.Runtime.Serialization;

namespace fw.m.basicInfo.data
{
    //设备更换记录表查询参数
    [DataContract]
    public class QueryTaskParams
    {
        //更换前设备编码
        [DataMember]
        public string keywordOld { get; set; }

        //更换后设备编码
        [DataMember]
        public string keywordChange { get; set; }

        //时间范围前
        private DateTime? _dStart;
        [DataMember]
        public DateTime? dStart
        {
            get { return _dStart; }
            set { _dStart = value; }
        }

        //时间范围后
        private DateTime? _dEnd;
        [DataMember]
        public DateTime? dEnd
        {
            get { return _dEnd; }
            set { _dEnd = value; }
        }

        //摄像机名称
        [DataMember]
        public string cameraName { get; set; }
        //摄像机ip
        [DataMember]
        public string IPAddress { get; set; }
        //摄像机地址名称
        [DataMember]
        public string addressName { get; set; }
        //摄像机id
        [DataMember]
        public  int? id { get; set; }
    }
}
