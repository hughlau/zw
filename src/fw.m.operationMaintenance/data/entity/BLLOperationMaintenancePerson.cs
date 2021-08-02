using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using fw.fwDal;

namespace fw.m.operationMaintenance.data.entity
{
    /// <summary>
    /// 运维人员
    /// </summary>
    [DataContract]
    public class BLLOperationMaintenancePerson : FWEntityObject
    {
        private string _operationMaintenanceUnitCode;

        /// <summary>
        ///  运维单位code
        /// </summary>
        [DataMember]
        public string operationMaintenanceUnitCode
        {
            get { return _operationMaintenanceUnitCode; }
            set { _operationMaintenanceUnitCode = changeValue("operationMaintenanceUnitCode", _operationMaintenanceUnitCode, value); }
        }

        private string _operationMaintenancePersonCode;

        /// <summary>
        ///  运维人员code
        /// </summary>
        [DataMember]
        public string operationMaintenancePersonCode
        {
            get { return _operationMaintenancePersonCode; }
            set { _operationMaintenancePersonCode = changeValue("operationMaintenancePersonCode", _operationMaintenancePersonCode, value); }
        }

        private string _operationMaintenancePersonName;

        /// <summary>
        ///  运维人员姓名
        /// </summary>
        [DataMember]
        public string operationMaintenancePersonName
        {
            get { return _operationMaintenancePersonName; }
            set { _operationMaintenancePersonName = changeValue("operationMaintenancePersonName", _operationMaintenancePersonName, value); }
        }

        private string _staffNo;

        /// <summary>
        ///  工号
        /// </summary>
        [DataMember]
        public string staffNo
        {
            get { return _staffNo; }
            set { _staffNo = changeValue("staffNo", _staffNo, value); }
        }


        private string _mobilePhone;

        /// <summary>
        ///  手机
        /// </summary>
        [DataMember]
        public string mobilePhone
        {
            get { return _mobilePhone; }
            set { _mobilePhone = changeValue("mobilePhone", _mobilePhone, value); }
        }

        private string _fax;

        /// <summary>
        ///  传真
        /// </summary>
        [DataMember]
        public string fax
        {
            get { return _fax; }
            set { _fax = changeValue("fax", _fax, value); }
        }

        private string _eMail;

        /// <summary>
        ///  邮件
        /// </summary>
        [DataMember]
        public string eMail
        {
            get { return _eMail; }
            set { _eMail = changeValue("eMail", _eMail, value); }
        }

        private string _zipCode;

        /// <summary>
        ///  邮政编码
        /// </summary>
        [DataMember]
        public string zipCode
        {
            get { return _zipCode; }
            set { _zipCode = changeValue("zipCode", _zipCode, value); }
        }

        private string _address;

        /// <summary>
        ///  地址
        /// </summary>
        [DataMember]
        public string address
        {
            get { return _address; }
            set { _address = changeValue("address", _address, value); }
        }

        private string _rem;

        /// <summary>
        ///  备注
        /// </summary>
        [DataMember]
        public string rem
        {
            get { return _rem; }
            set { _rem = changeValue("rem", _rem, value); }
        }

        private int _ix;

        /// <summary>
        ///  顺序
        /// </summary>
        [DataMember]
        public int ix
        {
            get { return _ix; }
            set { _ix = changeValue("ix", _ix, value); }
        }

        private int _isDis;

        /// <summary>
        ///  是否停用
        /// </summary>
        [DataMember]
        public int isDis
        {
            get { return _isDis; }
            set { _isDis = changeValue("isDis", _isDis, value); }
        }

        private string _createrID;

        /// <summary>
        ///  添加人
        /// </summary>
        [DataMember]
        public string createrID
        {
            get { return _createrID; }
            set { _createrID = changeValue("createrID", _createrID, value); }
        }

        private DateTime _createTime;

        /// <summary>
        ///  添加时间
        /// </summary>
        [DataMember]
        public DateTime createTime
        {
            get { return _createTime; }
            set { _createTime = changeValue("createTime", _createTime, value); }
        }

        private string _updaterID;

        /// <summary>
        ///  更新人
        /// </summary>
        [DataMember]
        public string updaterID
        {
            get { return _updaterID; }
            set { _updaterID = changeValue("updaterID", _updaterID, value); }
        }

        private DateTime _updateTime;

        /// <summary>
        ///  更新时间
        /// </summary>
        [DataMember]
        public DateTime updateTime
        {
            get { return _updateTime; }
            set { _updateTime = changeValue("updateTime", _updateTime, value); }
        }

        private string _userID;

        /// <summary>
        ///  运维用户帐号编码
        /// </summary>
        [DataMember]
        public string userID
        {
            get { return _userID; }
            set { _userID = changeValue("userID", _userID, value); }
        }

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
    }
}
