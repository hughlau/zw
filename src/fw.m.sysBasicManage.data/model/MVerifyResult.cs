using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.sysBasicManage.data.model
{
   /// <summary>
    /// 审核结果
    /// </summary>
    [DataContract]
    public  class  MVerifyResult
    {
        /// <summary>
        /// 企业主键
        /// </summary>
        [DataMember]
        public string enterpriseCode
        {
            set { _enterpriseCode = value; }
            get { return _enterpriseCode; }
        }
        private string _enterpriseCode;

        /// <summary>
        /// 企业历史主键
        /// </summary>
        [DataMember]
        public string enterpriseHisCode
        {
            set { _enterpriseHisCode = value; }
            get { return _enterpriseHisCode; }
        }
        private string _enterpriseHisCode;



        /// <summary>
        /// 用户主键
        /// </summary>
        private string _userID;
        [DataMember]
        public string userID
        {
            set { _userID = value; }
            get { return _userID; }
        }

        /// <summary>
        /// 用户历史主键
        /// </summary>
        private string _userHisCode;
        [DataMember]
        public string userHisCode
        {
            set { _userHisCode = value; }
            get { return _userHisCode; }
        }


        /// <summary>
        /// 审核状态
        /// </summary>		
        private int? _isVerify;
        [DataMember]
        public int? isVerify
        {
            get { return _isVerify; }
            set { _isVerify = value; }
        }
        

        /// <summary>
        /// 审核备注
        /// </summary>		
        private string _verifyComment;
        [DataMember]
        public string verifyComment
        {
            get { return _verifyComment; }
            set { _verifyComment = value; }
        }
    }
}
