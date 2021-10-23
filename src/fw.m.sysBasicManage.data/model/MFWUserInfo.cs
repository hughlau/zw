using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using fw.fwDal;
using fw.m.userLogin.data.model;

namespace fw.m.sysBasicManage.data.model
{
    /// <summary>
    /// 实体类用户登录 (属性说明自动提取数据库字段的描述信息)
    /// </summary>
   [DataContract,Serializable]
    public class MFWUserInfo : MFWUserLogin
    {
 

        /// <summary>
        /// 用户名称
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String mChineseName
        {
            set { _mChineseName = changeValue("mChineseName", _mChineseName, value); }
            get { return _mChineseName; }
        }
        private String _mChineseName;

        /// <summary>
        /// 用户名称
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String mPhotoRelativePath
        {
            set { _mPhotoRelativePath = changeValue("mPhotoRelativePath", _mPhotoRelativePath, value); }
            get { return _mPhotoRelativePath; }
        }
        private String _mPhotoRelativePath;

        /// <summary>
        /// 用户名称
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String mPhotoAction
        {
            set { _mPhotoAction = changeValue("mPhotoAction", _mPhotoAction, value); }
            get { return _mPhotoAction; }
        }
        private String _mPhotoAction;

        /// <summary>
        /// 用户名称
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String mPhotoFileFingerprint
        {
            set { _mPhotoFileFingerprint = changeValue("mPhotoFileFingerprint", _mPhotoFileFingerprint, value); }
            get { return _mPhotoFileFingerprint; }
        }
        private String _mPhotoFileFingerprint;

        /// <summary>
        /// 用户名称
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String mPhotoUrl
        {
            set { _mPhotoUrl = changeValue("mPhotoUrl", _mPhotoUrl, value); }
            get { return _mPhotoUrl; }
        }
        private String _mPhotoUrl;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String mGender
        {
            set { _mGender = changeValue("mGender", _mGender, value); }
            get { return _mGender; }
        }
        private String _mGender;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String mGenderName
        {
            set { _mGenderName = value; }
            get { return _mGenderName; }
        }
        private String _mGenderName;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String mEthnic
        {
            set { _mEthnic = changeValue("mEthnic", _mEthnic, value); }
            get { return _mEthnic; }
        }
        private String _mEthnic;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String mEthnicName
        {
            set { _mEthnicName = value; }
            get { return _mEthnicName; }
        }
        private String _mEthnicName;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String mBirthdayTypeCode
        {
            set { _mBirthdayTypeCode = changeValue("mBirthdayTypeCode", _mBirthdayTypeCode, value); }
            get { return _mBirthdayTypeCode; }
        }
        private String _mBirthdayTypeCode;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String mBirthdayTypeName
        {
            set { _mBirthdayTypeName = value; }
            get { return _mBirthdayTypeName; }
        }
        private String _mBirthdayTypeName;

        /// <summary>
        /// 是否启用
        /// 长度为 10
        /// 不能为空
        /// </summary>
        [DataMember]
        public DateTime? mBirthday
        {
            set { _mBirthday = changeValue("mBirthday", _mBirthday, value); }
            get { return _mBirthday; }
        }
        private DateTime? _mBirthday;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String mIdentificationCard
        {
            set { _mIdentificationCard = changeValue("mIdentificationCard", _mIdentificationCard, value); }
            get { return _mIdentificationCard; }
        }
        private String _mIdentificationCard;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String mZipCode
        {
            set { _mZipCode = changeValue("mZipCode", _mZipCode, value); }
            get { return _mZipCode; }
        }
        private String _mZipCode;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String mAddress
        {
            set { _mAddress = changeValue("mAddress", _mAddress, value); }
            get { return _mAddress; }
        }
        private String _mAddress;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String mMobilePhone
        {
            set { _mMobilePhone = changeValue("mMobilePhone", _mMobilePhone, value); }
            get { return _mMobilePhone; }
        }
        private String _mMobilePhone;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String mFax
        {
            set { _mFax = changeValue("mFax", _mFax, value); }
            get { return _mFax; }
        }
        private String _mFax;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String mEMail
        {
            set { _mEMail = changeValue("mEMail", _mEMail, value); }
            get { return _mEMail; }
        }
        private String _mEMail;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String mDeviceOperatingSystemCode
        {
            set { _mDeviceOperatingSystemCode = changeValue("mDeviceOperatingSystemCode", _mDeviceOperatingSystemCode, value); }
            get { return _mDeviceOperatingSystemCode; }
        }
        private String _mDeviceOperatingSystemCode;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String mDeviceOperatingSystemName
        {
            set { _mDeviceOperatingSystemName = value; }
            get { return _mDeviceOperatingSystemName; }
        }
        private String _mDeviceOperatingSystemName;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public String mDeviceAlias
        {
            set { _mDeviceAlias = changeValue("mDeviceAlias", _mDeviceAlias, value); }
            get { return _mDeviceAlias; }
        }
        private String _mDeviceAlias;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public float? mLongitude
        {
            set { _mLongitude = changeValue("mLongitude", _mLongitude, value); }
            get { return _mLongitude; }
        }
        private float? _mLongitude;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public float? mLatitude
        {
            set { _mLatitude = changeValue("mLatitude", _mLatitude, value); }
            get { return _mLatitude; }
        }
        private float? _mLatitude;

        /// <summary>
        /// 用户密码
        /// 长度为 50
        /// 不能为空
        /// </summary>
        [DataMember]
        public DateTime? mLastLocationTime
        {
            set { _mLastLocationTime = changeValue("mLastLocationTime", _mLastLocationTime, value); }
            get { return _mLastLocationTime; }
        }
        private DateTime? _mLastLocationTime;


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


        [DataMember]
        public String operationMaintenancePersonCode { get; set; }

        [DataMember]
        public String operationMaintenancePersonName { get; set; }

        [DataMember]
        public int loginRight { get; set; }
    }
}
