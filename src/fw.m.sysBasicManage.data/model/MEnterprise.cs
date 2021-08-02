using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using fw.fwDal;

namespace fw.m.sysBasicManage.data.model
{

    /// <summary>
    /// 企业信息  基类  用于用户对象
    /// </summary>
    [DataContract]
    public class MEnterprise : FWEntityObject
    {
        private string _enterpriseCode;
        /// <summary>
        /// 企业主键
        /// </summary>
        [DataMember]
        public string enterpriseCode
        {
            set { _enterpriseCode = changeValue("enterpriseCode", _enterpriseCode, value); }
            get { return _enterpriseCode; }
        }

        private string _cantonCode;
        /// <summary>
        /// 企业主键
        /// </summary>
        [DataMember]
        public string cantonCode
        {
            set { _cantonCode = changeValue("cantonCode", _cantonCode, value); }
            get { return _cantonCode; }
        }

        private string _boss;
        /// <summary>
        /// 企业主键
        /// </summary>
        [DataMember]
        public string boss
        {
            set { _boss = changeValue("boss", _boss, value); }
            get { return _boss; }
        }

        private string _enterpriseName;
        /// <summary>
        /// 企业名称
        /// </summary>
        [DataMember]
        public string enterpriseName
        {
            set { _enterpriseName = changeValue("enterpriseName", _enterpriseName, value); }
            get { return _enterpriseName; }
        }

        private string _bossID;
        /// <summary>
        /// 组织结构代码
        /// </summary>
        [DataMember]
        public string bossID
        {
            set { _bossID = changeValue("bossID", _bossID, value); }
            get { return _bossID; }
        }

        private string _registrationNo;
        /// <summary>
        /// 营业执照注册号
        /// </summary>
        [DataMember]
        public string registrationNo
        {
            set { _registrationNo = changeValue("registrationNo", _registrationNo, value); }
            get { return _registrationNo; }
        }

        private string _registrationAddress;
        /// <summary>
        /// 营业执照注册地址
        /// </summary>
        [DataMember]
        public string registrationAddress
        {
            set { _registrationAddress = changeValue("registrationAddress", _registrationAddress, value); }
            get { return _registrationAddress; }
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

        private int? _isCanRegister;

        /// <summary>
        /// 是否可以注册
        /// </summary>
        [DataMember]
        public int? isCanRegister
        {
            get { return _isCanRegister; }
            set { _isCanRegister = value; }
        }


        private int? _isHasAdmin;
        /// <summary>
        /// 是否已注册管理员 0 没有 1 有
        /// </summary>
        [DataMember]
        public int? isHasAdmin
        {
            get { return _isHasAdmin; }
            set { _isHasAdmin = value; }
        }


        private int? _verifyResult;
        /// <summary>
        /// 是否审核通过    2 通过  1正在审核  
        /// </summary>
        [DataMember]
        public int? verifyResult
        {
            get { return _verifyResult; }
            set { _verifyResult = value; }
        } 

    }
}
