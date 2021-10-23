using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using fw.fwDal;
using fw.m.operationMaintenance.data.entity;
using fw.m.sysBasicManage.data.model;

namespace fw.m.operationMaintenance.data.model
{
    /// <summary>
    /// 运维单位
    /// </summary>
    [DataContract, Serializable]
    public class MBLLOperationMaintenanceUnit : FWEntityObject
    {
        private string _operationMaintenanceUnitCode;

        /// <summary>
        /// 单位编码
        /// </summary>
        [DataMember]
        public string operationMaintenanceUnitCode
        {
            get { return _operationMaintenanceUnitCode; }
            set { _operationMaintenanceUnitCode = changeValue("operationMaintenanceUnitCode", _operationMaintenanceUnitCode, value); }
        }

        private string _operationMaintenanceUnitName;

        /// <summary>
        /// 单位名称
        /// </summary>
        [DataMember]
        public string operationMaintenanceUnitName
        {
            get { return _operationMaintenanceUnitName; }
            set { _operationMaintenanceUnitName = changeValue("operationMaintenanceUnitName", _operationMaintenanceUnitName, value); }
        }

        private byte[] _photo;

        /// <summary>
        /// 照片
        /// </summary>
        [DataMember]
        public byte[] photo
        {
            get { return _photo; }
            set { _photo = changeValue("photo", _photo, value); }
        }

        private string _cantonCode;

        /// <summary>
        /// 厂区编码
        /// </summary>
        [DataMember]
        public string cantonCode
        {
            get { return _cantonCode; }
            set { _cantonCode = changeValue("cantonCode", _cantonCode, value); }
        }

        private string _organizationCode;

        /// <summary>
        /// 法人代码
        /// </summary>
        [DataMember]
        public string organizationCode
        {
            get { return _organizationCode; }
            set { _organizationCode = changeValue("organizationCode", _organizationCode, value); }
        }

        private string _legalPerson;

        /// <summary>
        /// 法人
        /// </summary>
        [DataMember]
        public string legalPerson
        {
            get { return _legalPerson; }
            set { _legalPerson = changeValue("legalPerson", _legalPerson, value); }
        }

        private string _contactPerson;

        /// <summary>
        /// 联系人
        /// </summary>
        [DataMember]
        public string contactPerson
        {
            get { return _contactPerson; }
            set { _contactPerson = changeValue("contactPerson", _contactPerson, value); }
        }

        private string _mobilePhone;

        /// <summary>
        /// 手机
        /// </summary>
        [DataMember]
        public string mobilePhone
        {
            get { return _mobilePhone; }
            set { _mobilePhone = changeValue("mobilePhone", _mobilePhone, value); }
        }

        private string _fax;

        /// <summary>
        /// 传真
        /// </summary>
        [DataMember]
        public string fax
        {
            get { return _fax; }
            set { _fax = changeValue("fax", _fax, value); }
        }

        private string _eMail;

        /// <summary>
        /// 邮件
        /// </summary>
        [DataMember]
        public string eMail
        {
            get { return _eMail; }
            set { _eMail = changeValue("eMail", _eMail, value); }
        }

        private string _zipCode;

        /// <summary>
        /// 邮编
        /// </summary>
        [DataMember]
        public string zipCode
        {
            get { return _zipCode; }
            set { _zipCode = changeValue("zipCode", _zipCode, value); }
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

        private string _rem;

        /// <summary>
        /// 备注
        /// </summary>
        [DataMember]
        public string rem
        {
            get { return _rem; }
            set { _rem = changeValue("rem", _rem, value); }
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

        private string _createrID;

        /// <summary>
        /// 添加人
        /// </summary>
        [DataMember]
        public string createrID
        {
            get { return _createrID; }
            set { _createrID = changeValue("createrID", _createrID, value); }
        }

        private DateTime? _createTime;

        /// <summary>
        /// 添加时间
        /// </summary>
        [DataMember]
        public DateTime? createTime
        {
            get { return _createTime; }
            set { _createTime = changeValue("createTime", _createTime, value); }
        }

        private string _updaterID;

        /// <summary>
        /// 更新人
        /// </summary>
        [DataMember]
        public string updaterID
        {
            get { return _updaterID; }
            set { _updaterID = changeValue("updaterID", _updaterID, value); }
        }

        private DateTime? _updateTime;

        /// <summary>
        /// 更新时间
        /// </summary>
        [DataMember]
        public DateTime? updateTime
        {
            get { return _updateTime; }
            set { _updateTime = changeValue("updateTime", _updateTime, value); }
        }

        private string _userID;

        /// <summary>
        ///  运维企业帐号编码
        /// </summary>
        [DataMember]
        public string userID
        {
            get { return _userID; }
            set { _userID = changeValue("userID", _userID, value); }
        }


        /// <summary>
        /// 运维单位人员信息
        /// </summary>
        [DataMember]
        public List<MBLLOperationMaintenancePerson> unitPersonList { get; set; }

        /// <summary>
        /// 厂区名称
        /// </summary>
        [DataMember]
        public string cantonName { get; set; }

        /// <summary>
        ///  用户登陆信息
        /// </summary>
        [DataMember]
        public MFWUserInfo mFWUserInfo { get; set; }

        private string _password;

        /// <summary>
        ///  帐户密码
        /// </summary>
        [DataMember]
        public string password
        {
            get { return _password; }
            set { _password = changeValue("password", _password, value); }
        }

        private string _photoUrl;

        /// <summary>
        ///  帐户密码
        /// </summary>
        [DataMember]
        public string photoUrl
        {
            get { return _photoUrl; }
            set { _photoUrl = changeValue("photoUrl", _photoUrl, value); }
        }

        private string _unitManagerID;
        [DataMember]
        public string unitManagerID
        {
            get { return _unitManagerID; }
            set { _unitManagerID = changeValue("unitManagerID", _unitManagerID, value); }
        }

        private string _unitManagerName;
        [DataMember]
        public string unitManagerName
        {
            get { return _unitManagerName; }
            set { _unitManagerName = changeValue("unitManagerName", _unitManagerName, value); }
        }
    }
}
