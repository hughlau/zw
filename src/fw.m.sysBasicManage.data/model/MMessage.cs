using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using fw.fwDal;

namespace fw.m.sysBasicManage.data.model
{
    /// <summary>
    /// 消息信息
    /// </summary>
    public class MMessage : FWEntityObject
    {
        /// <summary>
        /// 消息主键
        /// </summary>		
        private string _messageCode;
        [DataMember]
        public string messageCode
        {
            get { return _messageCode; }
            set { _messageCode = changeValue("messageCode", _messageCode, value); }
        }
        /// <summary>
        /// 消息标题
        /// </summary>		
        private string _messageTitle;
        [DataMember]
        public string messageTitle
        {
            get { return _messageTitle; }
            set { _messageTitle = changeValue("messageTitle", _messageTitle, value); }
        }
        /// <summary>
        /// 消息发送时间
        /// </summary>		
        private DateTime? _messageTime;
        [DataMember]
        public DateTime? messageTime
        {
            get { return _messageTime; }
            set { _messageTime = changeValue("messageTime", _messageTime, value); }
        }
        /// <summary>
        /// 消息内容
        /// </summary>		
        private string _messageContent;
        [DataMember]
        public string messageContent
        {
            get { return _messageContent; }
            set { _messageContent = changeValue("messageContent", _messageContent, value); }
        }
        /// <summary>
        /// 消息类型
        /// </summary>		
        private string _messageType;
        [DataMember]
        public string messageType
        {
            get { return _messageType; }
            set { _messageType = changeValue("messageType", _messageType, value); }
        }

        /// <summary>
        /// 消息类型名称
        /// </summary>		
        private string _messageTypeName;
        [DataMember]
        public string messageTypeName
        {
            get { return _messageTypeName; }
            set { _messageTypeName = changeValue("messageTypeName", _messageTypeName, value); }
        }


        /// <summary>
        /// 消息接收人
        /// </summary>		
        private string _receiveUserID;
        [DataMember]
        public string receiveUserID
        {
            get { return _receiveUserID; }
            set { _receiveUserID = changeValue("receiveUserID", _receiveUserID, value); }
        }
        /// <summary>
        /// 消息接收人中文名
        /// </summary>		
        private string _userChineseName;
        [DataMember]
        public string userChineseName
        {
            get { return _userChineseName; }
            set { _userChineseName = changeValue("userChineseName", _userChineseName, value); }
        }

        /// <summary>
        /// 是否已读
        /// </summary>		
        private Int32? _isRead;
        [DataMember]
        public Int32? isRead
        {
            get { return _isRead; }
            set { _isRead = changeValue("isRead", _isRead, value); }
        }


        /// <summary>
        /// 父级消息编码
        /// </summary>		
        private string _pMessageCode;
        [DataMember]
        public string pMessageCode
        {
            get { return _pMessageCode; }
            set { _pMessageCode = changeValue("pMessageCode", _pMessageCode, value); }
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
        /// 创建时间
        /// </summary>		
        private DateTime? _createtime;
        [DataMember]
        public DateTime? createtime
        {
            get { return _createtime; }
            set { _createtime = changeValue("createtime", _createtime, value); }
        }

    }
}
