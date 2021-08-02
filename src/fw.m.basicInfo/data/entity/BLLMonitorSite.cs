using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwDal;
using System.Runtime.Serialization;

namespace fw.m.basicInfo.data.entity
{

    public class BLLMonitorSite : FWEntityObject
    {
        private string _monitorSiteCode;

        /// <summary>
        /// 监测点
        /// </summary>
        [DataMember]
        public string monitorSiteCode
        {
            get { return _monitorSiteCode; }
            set { _monitorSiteCode = changeValue("monitorSiteCode", _monitorSiteCode, value); }
        }

        private string _monitorSiteName;

        /// <summary>
        /// 设施点位名称
        /// </summary>
        [DataMember]
        public string monitorSiteName
        {
            get { return _monitorSiteName; }
            set { _monitorSiteName = changeValue("monitorSiteName", _monitorSiteName, value); }
        }

        private string _monitorSiteTypeCode;

        /// <summary>
        ///  净化槽型号
        /// </summary>
        [DataMember]
        public string monitorSiteTypeCode
        {
            get { return _monitorSiteTypeCode; }
            set { _monitorSiteTypeCode = changeValue("monitorSiteTypeCode", _monitorSiteTypeCode, value); }
        }

        private string _monitorSiteTypeCodeStr;
        /// <summary>
        ///  净化槽型号Str
        /// </summary>
        [DataMember]
        public string monitorSiteTypeCodeStr
        {
            get { return _monitorSiteTypeCodeStr; }
            set { _monitorSiteTypeCodeStr = changeValue("monitorSiteTypeCodeStr", _monitorSiteTypeCodeStr, value); }
        }

        private string _cantonCode;

        /// <summary>
        /// 行政区编码
        /// </summary>
        [DataMember]
        public string cantonCode
        {
            get { return _cantonCode; }
            set { _cantonCode = changeValue("cantonCode", _cantonCode, value); }
        }



        private DateTime? _operateTime;

        /// <summary>
        /// 投运时间
        /// </summary>
        [DataMember]
        public DateTime? operateTime
        {
            get { return _operateTime; }
            set { _operateTime = changeValue("operateTime", _operateTime, value); }
        }

        private string _address;

        /// <summary>
        /// 地址
        /// </summary>
        [DataMember]
        public string address
        {
            get { return _address; }
            set { _address = changeValue("address", _address, value); }
        }
        private string _treatmentAbility;

        /// <summary>
        /// 处理能力
        /// </summary>
        [DataMember]
        public string treatmentAbility
        {
            get { return _treatmentAbility; }
            set { _treatmentAbility = changeValue("treatmentAbility", _treatmentAbility, value); }
        }

        private string _householdsCount;

        /// <summary>
        /// 户数
        /// </summary>
        [DataMember]
        public string householdsCount
        {
            get { return _householdsCount; }
            set { _householdsCount = changeValue("householdsCount", _householdsCount, value); }
        }


        private string _householdName;

        /// <summary>
        /// 户主名称
        /// </summary>
        [DataMember]
        public string householdName
        {
            get { return _householdName; }
            set { _householdName = changeValue("householdName", _householdName, value); }
        }

        private string _meterNo;

        /// <summary>
        /// 电表号
        /// </summary>
        [DataMember]
        public string meterNo
        {
            get { return _meterNo; }
            set { _meterNo = changeValue("meterNo", _meterNo, value); }
        }

        private double _meterNum;

        /// <summary>
        /// 电表读数
        /// </summary>
        [DataMember]
        public double meterNum
        {
            get { return _meterNum; }
            set { _meterNum = changeValue("meterNum", _meterNum, value); }
        }
        private string _pumpTypeCode;

        /// <summary>
        /// 一体化提升泵
        /// </summary>
        [DataMember]
        public string pumpTypeCode
        {
            get { return _pumpTypeCode; }
            set { _pumpTypeCode = changeValue("pumpTypeCode", _pumpTypeCode, value); }
        }


        private double? _longitude;

        /// <summary>
        /// 经度
        /// </summary>
        [DataMember]
        public double? longitude
        {
            get { return _longitude; }
            set { _longitude = changeValue("longitude", _longitude, value); }
        }

        private double? _latitude;

        /// <summary>
        /// 维度
        /// </summary>
        [DataMember]
        public double? latitude
        {
            get { return _latitude; }
            set { _latitude = changeValue("latitude", _latitude, value); }
        }

        private double? _longitudeGps;

        /// <summary>
        /// 经度
        /// </summary>
        [DataMember]
        public double? longitudeGps
        {
            get { return _longitudeGps; }
            set { _longitudeGps = changeValue("longitudeGps", _longitude, value); }
        }

        private double? _latitudeGps;

        /// <summary>
        /// 维度
        /// </summary>
        [DataMember]
        public double? latitudeGps
        {
            get { return _latitudeGps; }
            set { _latitudeGps = changeValue("latitudeGps", _latitude, value); }
        }

        private int? _isDis;

        /// <summary>
        /// 是否停用
        /// </summary>
        [DataMember]
        public int? isDis
        {
            get { return _isDis; }
            set { _isDis = changeValue("isDis", _isDis, value); }
        }

        private int? _isDel;

        /// <summary>
        ///  是否删除
        /// </summary>
        [DataMember]
        public int? isDel
        {
            get { return _isDel; }
            set { _isDel = changeValue("isDel", _isDel, value); }
        }

        private string _projectNo;

        /// <summary>
        /// 项目代号
        /// </summary>
        [DataMember]
        public string projectNo
        {
            get { return _projectNo; }
            set { _projectNo = changeValue("projectNo", _projectNo, value); }
        }

        private string _creater;

        /// <summary>
        ///  添加人
        /// </summary>
        [DataMember]
        public string creater
        {
            get { return _creater; }
            set { _creater = changeValue("creater", _creater, value); }
        }

        private DateTime? _createTime;

        /// <summary>
        ///  添加时间
        /// </summary>
        [DataMember]
        public DateTime? createTime
        {
            get { return _createTime; }
            set { _createTime = changeValue("createTime", _createTime, value); }
        }

        private string _updater;

        /// <summary>
        ///  更新人
        /// </summary>
        [DataMember]
        public string updater
        {
            get { return _updater; }
            set { _updater = changeValue("updater", _updater, value); }
        }

        private DateTime? _updateTime;

        /// <summary>
        ///  更新时间
        /// </summary>
        [DataMember]
        public DateTime? updateTime
        {
            get { return _updateTime; }
            set { _updateTime = changeValue("updateTime", _updateTime, value); }
        }

      

        private string _photoAddress;

        /// <summary>
        /// 净化槽图片地址
        /// </summary>
        [DataMember]
        public string photoAddress
        {
            get { return _photoAddress; }
            set { _photoAddress = changeValue("photoAddress", _photoAddress, value); }
        }
    }
}
