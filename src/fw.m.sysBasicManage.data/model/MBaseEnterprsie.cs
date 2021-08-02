using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.sysBasicManage.data.model
{
    /// <summary>
    /// 企业信息表
    /// </summary>
    [DataContract]
    public class MBaseEnterprsie : MEnterprise
    {
        private int? _id;

        /// <summary>
        /// 自动增长列
        /// </summary>
        [DataMember]
        public int? id
        {
            get { return _id; }
            set { _id = value; }
        }

        private string _cantonCode;
        /// <summary>
        /// 行政区编码
        /// </summary>
        [DataMember]
        public string cantonCode
        {
            set { _cantonCode = changeValue("cantonCode", _cantonCode, value); }
            get { return _cantonCode; }
        }

        private string _cantonName;
        /// <summary>
        /// 行政区 名称
        /// </summary>	
        [DataMember]
        public string cantonName
        {
            get { return _cantonName; }
            set { _cantonName = value; }
        }
        

        private string _bossIDNumber;
        /// <summary>
        /// 法人身份证
        /// </summary>	
        [DataMember]
        public string bossIDNumber
        {
            get { return _bossIDNumber; }
            set { _bossIDNumber = changeValue("bossIDNumber", _bossIDNumber, value); }
        }

        private string _address;

        /// <summary>
        /// 工商注册地址
        /// </summary>	
        [DataMember]
        public string address
        {
            get { return _address; }
            set { _address = changeValue("address", _address, value); }
        }

        private string _bossIDImagePath;

        /// <summary>
        /// 组织机构代码证件
        /// </summary>	
        [DataMember]
        public string bossIDImagePath
        {
            get { return _bossIDImagePath; }
            set { _bossIDImagePath = changeValue("bossIDImagePath", _bossIDImagePath, value); }
        }


        private string _registrationNoImagePath;
        /// <summary>
        /// 组织机构代码证件
        /// </summary>	
        [DataMember]
        public string registrationNoImagePath
        {
            get { return _registrationNoImagePath; }
            set { _registrationNoImagePath = changeValue("registrationNoImagePath", _registrationNoImagePath, value); }
        }


        private string _mobile;
        /// <summary>
        /// 移动电话
        /// </summary>	
        [DataMember]
        public string mobile
        {
            get { return _mobile; }
            set { _mobile = changeValue("mobile", _mobile, value); }
        }

        private string _mobileCode;
        /// <summary>
        /// 移动电话 验证码
        /// </summary>	
        [DataMember]
        public string mobileCode
        {
            get { return _mobileCode; }
            set { _mobileCode = changeValue("mobileCode", _mobileCode, value); }
        }

        private Int32? _mIsPassed;
        /// <summary>
        /// 移动电话 验证码 是否通过 -1验证不通过 0-可以验证 1-验证通过  2-过期作废
        /// </summary>	
        [DataMember]
        public Int32? mIsPassed
        {
            get { return _mIsPassed; }
            set { _mIsPassed = changeValue("mIsPassed", _mIsPassed, value); }
        }
        private string _eMail;
        /// <summary>
        /// 电子邮箱
        /// </summary>	
        [DataMember]
        public string eMail
        {
            get { return _eMail; }
            set { _eMail = changeValue("eMail", _eMail, value); }
        }

        private string _eMailCode;
        /// <summary>
        /// 电子邮箱 验证码
        /// </summary>	
        [DataMember]
        public string eMailCode
        {
            get { return _eMailCode; }
            set { _eMailCode = changeValue("eMailCode", _eMailCode, value); }
        }

        private Int32? _eIsPassed;
        /// <summary>
        /// 电子邮箱 验证码 是否通过 -1验证不通过 0-可以验证 1-验证通过  2-过期作废
        /// </summary>	
        [DataMember]
        public Int32? eIsPassed
        {
            get { return _eIsPassed; }
            set { _eIsPassed = changeValue("eIsPassed", _eIsPassed, value); }
        }

        private string _dataMode;

        /// <summary>
        /// 数据来源（1下发2用户注册）
        /// </summary>
        [DataMember]
        public string dataMode
        {
            get { return _dataMode; }
            set { _dataMode = changeValue("dataMode", _dataMode, value); }
        }

        private string _dataModeName;

        /// <summary>
        /// 数据来源名称（1下发2用户注册）
        /// </summary>
        [DataMember]
        public string dataModeName
        {
            get { return _dataModeName; }
            set { _dataModeName = value; }
        }

        private int? _userCount;

        /// <summary>
        /// 用户数量
        /// </summary>
        [DataMember]
        public int? userCount
        {
            get { return _userCount; }
            set { _userCount = changeValue("userCount", _userCount, value); }
        }

        #region 基础字段

        private int? _isDelete;

        /// <summary>
        /// 删除状态
        /// </summary>
        [DataMember]
        public int? isDelete
        {
            get { return _isDelete; }
            set { _isDelete = changeValue("isDelete", _isDelete, value); }
        }

        private string _recordPeople;

        /// <summary>
        /// 记录创建人
        /// </summary>
        [DataMember]
        public string recordPeople
        {
            get { return _recordPeople; }
            set { _recordPeople = changeValue("recordPeople", _recordPeople, value); }
        }

        private DateTime? _recordTime;

        /// <summary>
        /// 记录创建时间
        /// </summary>
        [DataMember]
        public DateTime? recordTime
        {
            get { return _recordTime; }
            set { _recordTime = changeValue("recordTime", _recordTime, value); }
        }

        private string _lastUpdatePeople;

        /// <summary>
        /// 最后更新人
        /// </summary>
        [DataMember]
        public string lastUpdatePeople
        {
            get { return _lastUpdatePeople; }
            set { _lastUpdatePeople = changeValue("lastUpdatePeople", _lastUpdatePeople, value); }
        }

        private DateTime? _lastUpdateTime;

        /// <summary>
        /// 最后更新时间
        /// </summary>
        [DataMember]
        public DateTime? lastUpdateTime
        {
            get { return _lastUpdateTime; }
            set { _lastUpdateTime = changeValue("lastUpdateTime", _lastUpdateTime, value); }
        }

        #endregion

        #region 审核信息

        private int? _isVerify;
        /// <summary>
        /// 审核状态
        /// </summary>	
        [DataMember]
        public int? isVerify
        {
            get { return _isVerify; }
            set { _isVerify = changeValue("isVerify", _isVerify, value); }
        }

        private string _verifyName;
        /// <summary>
        /// 审核状态 名称
        /// </summary>	
        [DataMember]
        public string verifyName
        {
            get { return _verifyName; }
            set { _verifyName = value; }
        }

        private DateTime? _verifyDate;
        /// <summary>
        /// 审核 时间
        /// </summary>	
        [DataMember]
        public DateTime? verifyDate
        {
            get { return _verifyDate; }
            set { _verifyDate = changeValue("verifyDate", _verifyDate, value); }
        }

        private string _verifyUserName;
        /// <summary>
        /// 审核人
        /// </summary>	
        [DataMember]
        public string verifyUserName
        {
            get { return _verifyUserName; }
            set { _verifyUserName = changeValue("verifyUserName", _verifyUserName, value); }
        }

        private string _verifyComment;
        /// <summary>
        /// 审核意见
        /// </summary>	
        [DataMember]
        public string verifyComment
        {
            get { return _verifyComment; }
            set { _verifyComment = changeValue("verifyComment", _verifyComment, value); }
        }
        #endregion

    }
}
