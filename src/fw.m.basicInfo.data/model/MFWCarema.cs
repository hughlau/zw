using System.Runtime.Serialization;
using fw.fwDal;

namespace fw.m.basicInfo.data.model
{
    /// <summary>
    /// 摄像头
    /// </summary>
    [DataContract]
   public class MFWCarema: FWEntityObject
    {
        //id
        private long _id;
        [DataMember]
        public long id
        {
            get { return _id; }
            set { _id = value; }
        }

        //ip地址
        private string _IPAddress;
        [DataMember]
        public string IPAddress
        {
            get { return _IPAddress; }
            set { _IPAddress = changeValue("IPAddress", _IPAddress, value); }
        }

        //经度
        private double? _longitudeGps;
        [DataMember]
        public double? longitudeGps
        {
            get { return _longitudeGps; }
            set { _longitudeGps = changeValue("longitudeGps", _longitudeGps, value); }
        }

        //纬度
        private double? _latitudeGps;
        [DataMember]
        public double? latitudeGps
        {
            get { return _latitudeGps; }
            set { _latitudeGps = changeValue("latitudeGps", _latitudeGps, value); }
        }

        //摄像头名称
        private string _cameraName;
        [DataMember]
        public string cameraName
        {
            get { return _cameraName; }
            set { _cameraName = changeValue("cameraName", _cameraName, value); }
        }

        //摄像头地址名称
        private string _addressName;
        [DataMember]
        public string addressName
        {
            get { return _addressName; }
            set { _addressName = changeValue("addressName", _addressName, value); }
        }

    }
}
