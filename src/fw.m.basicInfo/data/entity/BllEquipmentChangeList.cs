using System;
using System.Runtime.Serialization;
using fw.fwDal;

namespace fw.m.basicInfo.data.entity
{
    //设备更换记录
    [DataContract]
    public class BllEquipmentChangeList : FWEntityObject
    {
        //更换前设备编码
        private string _equipmentNoOld;
        [DataMember]
        public string equipmentNoOld
        {
            get { return _equipmentNoOld; }
            set { _equipmentNoOld = changeValue("equipmentNoOld", _equipmentNoOld, value); }
        }

        //更换后设备编码
        private string _equipmentNoChange;
        [DataMember]
        public string equipmentNoChange
        {
            get { return _equipmentNoChange; }
            set { _equipmentNoChange = changeValue("equipmentNoChange", _equipmentNoChange, value); }
        }

        //更换时间
        private DateTime? _changeTime;
        [DataMember]
        public DateTime? changeTime
        {
            get { return _changeTime; }
            set { _changeTime = changeValue("changeTime", _changeTime, value); }
        }

        //更换者
        private string _changerId;
        [DataMember]
        public string changerId
        {
            get { return _changerId; }
            set { _changerId = changeValue("changerId", _changerId, value); }
        }
    }
}
