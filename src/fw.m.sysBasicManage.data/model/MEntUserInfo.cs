using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using fw.fwDal;

namespace fw.m.sysBasicManage.data.model
{
    /// <summary>
    /// 用户注册信息
    /// </summary>
    [DataContract]
    public class MEntUserInfo : FWEntityObject
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

        /// <summary>
        /// 用户ID
        /// </summary>		
        private string _userID;
        [DataMember]
        public string userID
        {
            get { return _userID; }
            set { _userID = changeValue("userID", _userID, value); }
        }

        private string _parentUserID;

        /// <summary>
        /// 父级用户编码
        /// </summary>
        [DataMember]
        public string parentUserID
        {
            get { return _parentUserID; }
            set { _parentUserID = value; }
        }

        private string _userName;

        /// <summary>
        /// 用户名称
        /// </summary>
        [DataMember]
        public string userName
        {
            get { return _userName; }
            set { _userName = changeValue("userName", _userName, value); }
        }

        private string _userChineseName;

        /// <summary>
        /// 中文名称
        /// </summary>
        [DataMember]
        public string userChineseName
        {
            get { return _userChineseName; }
            set { _userChineseName = changeValue("userChineseName", _userChineseName, value); }
        }

        string _password;

        /// <summary>
        /// 密码
        /// </summary>
        [DataMember]
        public string password
        {
            get { return _password; }
            set { _password = changeValue("password", _password, value); }
        }

        private string _userType;

        /// <summary>
        /// 用户类型
        /// </summary>
        [DataMember]
        public string userType
        {
            get { return _userType; }
            set { _userType = changeValue("userType", _userType, value); }
        }

        /// <summary>
        /// 身份证号码
        /// </summary>		
        private string _IDNumber;
        [DataMember]
        public string idNumber
        {
            get { return _IDNumber; }
            set { _IDNumber = changeValue("idNumber", _IDNumber, value); }
        }
        /// <summary>
        /// 企业主键
        /// </summary>
        [DataMember]
        public string enterpriseCode
        {
            set { _enterpriseCode = changeValue("enterpriseCode", _enterpriseCode, value); }
            get { return _enterpriseCode; }
        }
        private string _enterpriseCode;

        /// <summary>
        /// 企业名称
        /// </summary>
        [DataMember]
        public string enterpriseName
        {
            set { _enterpriseName = value; }
            get { return _enterpriseName; }
        }
        private string _enterpriseName;

        private string _positionCode;

        /// <summary>
        /// 邮政编码
        /// </summary>
        [DataMember]
        public string positionCode
        {
            get { return _positionCode; }
            set { _positionCode = changeValue("positionCode", _positionCode, value); }
        }

        private string _mobile;

        /// <summary>
        /// 手机号码
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
        /// 数据来源
        /// </summary>
        [DataMember]
        public string dataMode
        {
            get { return _dataMode; }
            set { _dataMode = changeValue("dataMode", _dataMode, value); }
        }

        private int? _isAdmin;

        /// <summary>
        /// 是否管理员
        /// </summary>		
        [DataMember]
        public int? isAdmin
        {
            get { return _isAdmin; }
            set { _isAdmin = changeValue("isAdmin", _isAdmin, value); }
        }

        private int? _isFreeze;

        /// <summary>
        /// 是否冻结
        /// </summary>
        [DataMember]
        public int? isFreeze
        {
            get { return _isFreeze; }
            set { _isFreeze = changeValue("isFreeze", _isFreeze, value); }
        }

        private string _fileType;

        /// <summary>
        /// 文件类型
        /// </summary>
        [DataMember]
        public string fileType
        {
            get { return _fileType; }
            set { _fileType = changeValue("fileType", _fileType, value); }
        }

        private string _filePath;

        /// <summary>
        /// 文件名称
        /// </summary>
        [DataMember]
        public string filePath
        {
            get { return _filePath; }
            set { _filePath = changeValue("filePath", _filePath, value); }
        }

        private string _fileName;

        /// <summary>
        /// 文件名称
        /// </summary>
        [DataMember]
        public string fileName
        {
            get { return _fileName; }
            set { _fileName = changeValue("fileName", _fileName, value); }
        }


        private string _userPhotoPath;

        /// <summary>
        /// 用户照片名称
        /// </summary>
        [DataMember]
        public string userPhotoPath
        {
            get { return _userPhotoPath; }
            set { _userPhotoPath = changeValue("userPhotoPath", _userPhotoPath, value); }
        }

        private string _IDNumberImgPath;
        /// <summary>
        /// 身份证
        /// </summary>	
        [DataMember]
        public string IDNumberImgPath
        {
            get { return _IDNumberImgPath; }
            set { _IDNumberImgPath = changeValue("IDNumberImgPath", _IDNumberImgPath, value); }
        }

        private int? _userCount;

        /// <summary>
        /// 用户数量
        /// </summary>
        [DataMember]
        public int? userCount
        {
            get { return _userCount; }
            set { _userCount = value; }
        }

        private string _keyNumber;

        /// <summary>
        /// 自动登录key编码
        /// </summary>
        [DataMember]
        public string keyNumber
        {
            get { return _keyNumber; }
            set { _keyNumber = changeValue("keyNumber", _keyNumber, value); }
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

        private string _verifyUserID;
        /// <summary>
        /// 审核人
        /// </summary>	
        [DataMember]
        public string verifyUserID
        {
            get { return _verifyUserID; }
            set { _verifyUserID = changeValue("verifyUserID", _verifyUserID, value); }
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
