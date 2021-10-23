using System;
using System.Collections.Generic;
using fw.fwDal;
using System.Runtime.Serialization;
using fw.m.userLogin.data.entity;

namespace fw.m.sysBasicManage.data.entity
{
    /// <summary>
    /// 实体类用户登录 (属性说明自动提取数据库字段的描述信息)
    /// </summary>
    [DataContract,Serializable]
    public class FWUserInfo : FWUserLogin
    {
        /// <summary>
        /// 用户ID
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String userID
        {
            set { _userID = changeValue("userID", _userID, value); }
            get { return _userID; }
        }
        private String _userID;

        /// <summary>
        /// 用户名称
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String chineseName
        {
            set { _chineseName = changeValue("chineseName", _chineseName, value); }
            get { return _chineseName; }
        }
        private String _chineseName;

        /// <summary>
        /// 用户名称
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String photoFileFingerprint
        {
            set { _photoFileFingerprint = changeValue("photoFileFingerprint", _photoFileFingerprint, value); }
            get { return _photoFileFingerprint; }
        }
        private String _photoFileFingerprint;

        /// <summary>
        /// 用户名称
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public byte[] photo
        {
            set { _photo = changeValue("photo", _photo, value); }
            get { return _photo; }
        }
        private byte[] _photo;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String gender
        {
            set { _gender = changeValue("gender", _gender, value); }
            get { return _gender; }
        }
        private String _gender;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String ethnic
        {
            set { _ethnic = changeValue("ethnic", _ethnic, value); }
            get { return _ethnic; }
        }
        private String _ethnic;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String birthdayTypeCode
        {
            set { _birthdayTypeCode = changeValue("birthdayTypeCode", _birthdayTypeCode, value); }
            get { return _birthdayTypeCode; }
        }
        private String _birthdayTypeCode;

        /// <summary>
        /// 是否启用
        /// 长度为 10
        /// 不能为空
        /// </summary>
        [DataMember]
        public DateTime? birthday
        {
            set { _birthday = changeValue("birthday", _birthday, value); }
            get { return _birthday; }
        }
        private DateTime? _birthday;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String identificationCard
        {
            set { _identificationCard = changeValue("identificationCard", _identificationCard, value); }
            get { return _identificationCard; }
        }
        private String _identificationCard;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String zipCode
        {
            set { _zipCode = changeValue("zipCode", _zipCode, value); }
            get { return _zipCode; }
        }
        private String _zipCode;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String address
        {
            set { _address = changeValue("address", _address, value); }
            get { return _address; }
        }
        private String _address;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String mobilePhone
        {
            set { _mobilePhone = changeValue("mobilePhone", _mobilePhone, value); }
            get { return _mobilePhone; }
        }
        private String _mobilePhone;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String fax
        {
            set { _fax = changeValue("fax", _fax, value); }
            get { return _fax; }
        }
        private String _fax;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String eMail
        {
            set { _eMail = changeValue("eMail", _eMail, value); }
            get { return _eMail; }
        }
        private String _eMail;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String deviceOperatingSystemCode
        {
            set { _deviceOperatingSystemCode = changeValue("deviceOperatingSystemCode", _deviceOperatingSystemCode, value); }
            get { return _deviceOperatingSystemCode; }
        }
        private String _deviceOperatingSystemCode;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String deviceAlias
        {
            set { _deviceAlias = changeValue("deviceAlias", _deviceAlias, value); }
            get { return _deviceAlias; }
        }
        private String _deviceAlias;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public float? longitude
        {
            set { _longitude = changeValue("longitude", _longitude, value); }
            get { return _longitude; }
        }
        private float? _longitude;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public float? latitude
        {
            set { _latitude = changeValue("latitude", _latitude, value); }
            get { return _latitude; }
        }
        private float? _latitude;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public DateTime? lastLocationTime
        {
            set { _lastLocationTime = changeValue("lastLocationTime", _lastLocationTime, value); }
            get { return _lastLocationTime; }
        }
        private DateTime? _lastLocationTime;

        /// <summary>
        /// 添加人
        /// </summary>
        [DataMember]
        public String createrID
        {
            set { _createrID = changeValue("createrID", _createrID, value); }
            get { return _createrID; }
        }
        private String _createrID;

        /// <summary>
        /// 添加时间
        /// </summary>
        [DataMember]
        public DateTime createTime
        {
            set { _createTime = changeValue("createTime", _createTime, value); }
            get { return _createTime; }
        }
        private DateTime _createTime;

        /// <summary>
        /// 更新人
        /// </summary>
        [DataMember]
        public String updaterID
        {
            set { _updaterID = changeValue("updaterID", _updaterID, value); }
            get { return _updaterID; }
        }
        private String _updaterID;

        /// <summary>
        /// 更新人
        /// </summary>
        [DataMember]
        public DateTime updateTime
        {
            set { _updateTime = changeValue("updateTime", _updateTime, value); }
            get { return _updateTime; }
        }
        private DateTime _updateTime;

        /// <summary>
        ///   厂区
        /// </summary>
        [DataMember]
        public String cantonCode
        {
            set { _cantonCode = changeValue("cantonCode", _cantonCode, value); }
            get { return _cantonCode; }
        }
        private String _cantonCode;
    }
}