using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.sysBasicManage.data.model
{
    /// <summary>
    /// 企业注册审核信息
    /// </summary>
    [DataContract]
    public class MEnterpriseRegisterInfo : MBaseEnterprsie
    {

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
        /// 文件类型
        /// </summary>		 
        [DataMember]
        public string FileType { get; set; }
        /// <summary>
        /// FilePath
        /// </summary>		 
        [DataMember]
        public string FilePath { get; set; }


        /// <summary>
        /// 创建时间
        /// </summary>		
        private DateTime? _createtime;
        [DataMember]
        public DateTime? createtime
        {
            get { return _createtime; }
            set { _createtime = value; }
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
        /// 审核时间
        /// </summary>		
        private DateTime? _verifyTime;
        [DataMember]
        public DateTime? verifyTime
        {
            get { return _verifyTime; }
            set { _verifyTime = value; }
        }
        /// <summary>
        /// 审核用户ID  管理员
        /// </summary>		
        private string _verifyUserID;
        [DataMember]
        public string verifyUserID
        {
            get { return _verifyUserID; }
            set { _verifyUserID = value; }
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
