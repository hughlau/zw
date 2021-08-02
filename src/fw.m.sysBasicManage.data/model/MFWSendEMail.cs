using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using fw.fwDal;

namespace fw.m.sysBasicManage.data.model
{
    /// <summary>
    /// 邮件发送
    /// </summary>
    [DataContract]
    public class MFWSendEMail : FWEntityObject
    {
        private int? _AutoID;

        /// <summary>
        /// 自动增长列
        /// </summary>
        [DataMember]
        public int? autoID
        {
            get { return _AutoID; }
            set { _AutoID = value; }
        }

        private string _toPersonEmail;

        /// <summary>
        /// 接收人邮箱
        /// </summary>
        [DataMember]
        public string toPersonEmail
        {
            get { return _toPersonEmail; }
            set { _toPersonEmail = changeValue("toPersonEmail", _toPersonEmail, value); }
        }
        private string _CCPersonMail;

        /// <summary>
        /// 
        /// </summary>
        [DataMember]
        public string ccPersonMail
        {
            get { return _CCPersonMail; }
            set { _CCPersonMail = changeValue("ccPersonMail", _CCPersonMail, value); }
        }

        private DateTime? _SendDate;

        /// <summary>
        /// 发送日期
        /// </summary>
        [DataMember]
        public DateTime? sendDate
        {
            get { return _SendDate; }
            set { _SendDate = changeValue("sendDate", _SendDate, value); }
        }
        private DateTime? _ValidTime;

        /// <summary>
        /// 有效日期
        /// </summary>
        [DataMember]
        public DateTime? validTime
        {
            get { return _ValidTime; }
            set { _ValidTime = changeValue("validTime", _ValidTime, value); }
        }
        private string _Sender;

        /// <summary>
        /// 发送人
        /// </summary>
        [DataMember]
        public string sender
        {
            get { return _Sender; }
            set { _Sender = changeValue("sender", _Sender, value); }
        }

        private string _SenderName;

        /// <summary>
        /// 发件人名称
        /// </summary>
        [DataMember]
        public string senderName
        {
            get { return _SenderName; }
            set { _SenderName = value; }
        }

        private string _message;

        /// <summary>
        /// 信息
        /// </summary>
        [DataMember]
        public string message
        {
            get { return _message; }
            set { _message = changeValue("message", _message, value); }
        }

        private int? _bHaveSend;

        /// <summary>
        /// 是否发送
        /// </summary>
        [DataMember]
        public int? bHaveSend
        {
            get { return _bHaveSend; }
            set { _bHaveSend = changeValue("bHaveSend", _bHaveSend, value); }
        }

        private string _Title;

        /// <summary>
        /// 标题
        /// </summary>
        [DataMember]
        public string title
        {
            get { return _Title; }
            set { _Title = changeValue("title", _Title, value); }
        }
        private string _BCCPersonMail;

        /// <summary>
        /// 
        /// </summary>
        [DataMember]
        public string bccPersonMail
        {
            get { return _BCCPersonMail; }
            set { _BCCPersonMail = changeValue("bccPersonMail", _BCCPersonMail, value); }
        }
    }
}
