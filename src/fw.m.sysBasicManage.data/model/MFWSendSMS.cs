using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using fw.fwDal;

namespace fw.m.sysBasicManage.data.model
{       /// <summary>
    /// 短信发送历史
    /// </summary>
    [DataContract]
    public class MFWSendSMS : FWEntityObject
    {
        private string _EnterpriseName;

        /// <summary>
        /// 企业名称
        /// </summary>
        [DataMember]
        public string EnterpriseName
        {
            get { return _EnterpriseName; }
            set { _EnterpriseName = value; }
        }

        private int? _autoID;

        /// <summary>
        /// 主键
        /// </summary>
        [DataMember]
        public int? autoID
        {
            get { return _autoID; }
            set { _autoID = value; }
        }
        /// <summary>
        /// 发送类型编码
        /// </summary>
        private String _SendTypeCode;
        [DataMember]
        public String sendTypeCode
        {
            set { _SendTypeCode = changeValue("sendTypeCode", _SendTypeCode, value); }
            get { return _SendTypeCode; }
        }
        /// <summary>
        /// 发送类型名称
        /// </summary>
        private String _SendTypeName;
        [DataMember]
        public String sendTypeName
        {
            set { _SendTypeName = value; }
            get { return _SendTypeName; }
        }

        private String _SMSTypeName;
        /// <summary>
        /// 短信类型
        /// </summary>
        [DataMember]
        public String sMSTypeName
        {
            set { _SMSTypeName = value; }
            get { return _SMSTypeName; }
        }
        private String _SMSTypeCode;
        /// <summary>
        /// 短信类型名称
        /// </summary>
        [DataMember]
        public String sMSTypeCode
        {
            set { _SMSTypeCode = changeValue("sMSTypeCode", _SMSTypeCode, value); }
            get { return _SMSTypeCode; }
        }
        private String _SMSNumber;
        /// <summary>
        /// 短信号码
        /// </summary>
        [DataMember]
        public String sMSNumber
        {
            set { _SMSNumber = changeValue("sMSNumber", _SMSNumber, value); }
            get { return _SMSNumber; }
        }
        private String _SMSMessage;
        /// <summary>
        /// 短信信息
        /// </summary>
        [DataMember]
        public String sMSMessage
        {
            set { _SMSMessage = changeValue("sMSMessage", _SMSMessage, value); }
            get { return _SMSMessage; }
        }

        private DateTime? _SMSDateTime;
        /// <summary>
        ///发送时间
        /// </summary>
        [DataMember]
        public DateTime? sMSDateTime
        {
            set { _SMSDateTime = changeValue("sMSDateTime", _SMSDateTime, value); }
            get { return _SMSDateTime; }
        }

        private String _SMSSenderID;
        /// <summary>
        /// 发信人
        /// </summary>
        [DataMember]
        public String sMSSenderID
        {
            set { _SMSSenderID = changeValue("sMSSenderID", _SMSSenderID, value); }
            get { return _SMSSenderID; }
        }
        private String _SMSSenderName;
        /// <summary>
        /// 发信人名称
        /// </summary>
        [DataMember]
        public String sMSSenderName
        {
            set { _SMSSenderName = value; }
            get { return _SMSSenderName; }
        }
        private String _ReceiveDepart;
        [DataMember]
        /// <summary>
        /// 接收单位
        /// </summary>
        public String receiveDepart
        {
            set { _ReceiveDepart = changeValue("receiveDepart", _ReceiveDepart, value); }
            get { return _ReceiveDepart; }
        }
        private String _ReceiverTypeCode;
        /// <summary>
        /// 接收人类型
        /// </summary>
        [DataMember]
        public String receiverTypeCode
        {
            set { _ReceiverTypeCode = changeValue("receiverTypeCode", _ReceiverTypeCode, value); }
            get { return _ReceiverTypeCode; }
        }
        private String _ReceiverTypeName;
        /// <summary>
        /// 接收人类型名称
        /// </summary>
        [DataMember]
        public String receiverTypeName
        {
            set { _ReceiverTypeName = value; }
            get { return _ReceiverTypeName; }
        }

        private String _ReceiverName;
        /// <summary>
        /// 接收人名称
        /// </summary>
        [DataMember]
        public String receiverName
        {
            set { _ReceiverName = changeValue("receiverName", _ReceiverName, value); }
            get { return _ReceiverName; }
        }


        private string _receiverUserID;

        /// <summary>
        /// 接收人编码
        /// </summary>
        [DataMember]
        public string receiverUserID
        {
            get { return _receiverUserID; }
            set { _receiverUserID = value; }
        }
        private Int32? _IsSuccess;
        /// <summary>
        /// 是否成功
        /// </summary>
        [DataMember]
        public Int32? isSuccess
        {
            set { _IsSuccess = changeValue("isSuccess", _IsSuccess, value); }
            get { return _IsSuccess; }
        }

        private String _IsSuccessName;
        /// <summary>
        /// 是否成功名称
        /// </summary>
        [DataMember]
        public String isSuccessName
        {
            set { _IsSuccessName = value; }
            get { return _IsSuccessName; }
        }

        private DateTime? _ValidTime;
        /// <summary>
        /// 有效时间
        /// </summary>
        [DataMember]
        public DateTime? validTime
        {
            set { _ValidTime = changeValue("validTime", _ValidTime, value); }
            get { return _ValidTime; }
        }
    }
}
