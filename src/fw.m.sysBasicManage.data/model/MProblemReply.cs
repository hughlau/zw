using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using fw.fwDal;

namespace fw.m.sysBasicManage.data.model
{
    /// <summary>
    /// 问题咨询回复
    /// </summary>
    [DataContract]
    public class MProblemReply : FWEntityObject
    {
        /// <summary>
        /// 问题回复主键
        /// </summary>		
        private string _problemReplyCode;
        [DataMember]
        public string problemReplyCode
        {
            get { return _problemReplyCode; }
            set { _problemReplyCode = changeValue("problemReplyCode", _problemReplyCode, value); }
        }
        /// <summary>
        /// 问题主键
        /// </summary>		
        private string _problemCode;
        [DataMember]
        public string problemCode
        {
            get { return _problemCode; }
            set { _problemCode = changeValue("problemCode", _problemCode, value); }
        }
        /// <summary>
        /// 回复内容
        /// </summary>		
        private string _replyContent;
        [DataMember]
        public string replyContent
        {
            get { return _replyContent; }
            set { _replyContent = changeValue("replyContent", _replyContent, value); }
        }
        /// <summary>
        /// 回复用户主键
        /// </summary>		
        private string _replyUserID;
        [DataMember]
        public string replyUserID
        {
            get { return _replyUserID; }
            set { _replyUserID = changeValue("replyUserID", _replyUserID, value); }
        }

        /// <summary>
        /// 回复时间
        /// </summary>		
        private DateTime? _replyTime;
        [DataMember]
        public DateTime? replyTime
        {
            get { return _replyTime; }
            set { _replyTime = changeValue("replyTime", _replyTime, value); }
        }
        /// <summary>
        /// 回复顺序
        /// </summary>		
        private Int32? _sequence;
        [DataMember]
        public Int32? sequence
        {
            get { return _sequence; }
            set { _sequence = changeValue("sequence", _sequence, value); }
        }

        /// <summary>
        /// 问题回复人
        /// </summary>
        private string _replyUserName;
        [DataMember]
        public string replyUserName
        {
            get { return _replyUserName; }
            set { _replyUserName = changeValue("replyUserName", _replyUserName, value); }
        }

        /// <summary>
        /// 问题回复人企业主键
        /// </summary>
        [DataMember]
        public string replyEnterpriseCode
        {
            set { _replyEnterpriseCode = value; }
            get { return _replyEnterpriseCode; }
        }
        private string _replyEnterpriseCode;

        /// <summary>
        /// 问题回复人企业名称
        /// </summary>
        [DataMember]
        public string replyEnterpriseName
        {
            set { _replyEnterpriseName = value; }
            get { return _replyEnterpriseName; }
        }
        private string _replyEnterpriseName;



        /// <summary>
        /// 父级问题回复主键
        /// </summary>		
        private string _pProblemReplyCode;
        [DataMember]
        public string pProblemReplyCode
        {
            get { return _pProblemReplyCode; }
            set { _pProblemReplyCode = changeValue("pProblemReplyCode", _pProblemReplyCode, value); }
        }


        /// <summary>
        /// 创建时间
        /// </summary>		
        private DateTime? _createtime;
        [DataMember]
        public DateTime? createtime
        {
            get { return _createtime; }
            set { _createtime = changeValue("createtime", _createtime, value); }
        }
        /// <summary>
        /// 修改人,姓名名称
        /// </summary>		
        private string _editby;
        [DataMember]
        public string editby
        {
            get { return _editby; }
            set { _editby = changeValue("editby", _editby, value); }
        }
        /// <summary>
        /// 修改时间
        /// </summary>		
        private DateTime? _edittime;
        [DataMember]
        public DateTime? edittime
        {
            get { return _edittime; }
            set { _edittime = changeValue("edittime", _edittime, value); }
        }
        /// <summary>
        /// 创建人
        /// </summary>		
        private string _createby;
        [DataMember]
        public string createby
        {
            get { return _createby; }
            set { _createby = changeValue("createby", _createby, value); }
        }
        /// <summary>
        /// 删除标记
        /// </summary>		
        private Int32? _deleteflag;
        [DataMember]
        public Int32? deleteflag
        {
            get { return _deleteflag; }
            set { _deleteflag = changeValue("deleteflag", _deleteflag, value); }
        }
    }
}
