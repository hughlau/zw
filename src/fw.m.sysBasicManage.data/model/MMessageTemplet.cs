using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.sysBasicManage.data.model
{
    /// <summary>
    /// 消息信息模板
    /// </summary>
    public class MMessageTemplet
    {

        /// <summary>
        /// 消息名称
        /// </summary>		
        private string _messageName;
        [DataMember]
        public string messageName
        {
            get { return _messageName; }
            set { _messageName = value; }
        }

        /// <summary>
        /// 消息类型
        /// </summary>		
        private string _messageType;
        [DataMember]
        public string messageType
        {
            get { return _messageType; }
            set { _messageType = value; }
        }

        /// <summary>
        /// 短信内容格式
        /// </summary>		
        private string _smsFormart;
        [DataMember]
        public string smsFormart
        {
            get { return _smsFormart; }
            set { _smsFormart = value; }
        }

        /// <summary>
        /// 邮件内容格式
        /// </summary>		
        private string _emailFormart;
        [DataMember]
        public string emailFormart
        {
            get { return _emailFormart; }
            set { _emailFormart = value; }
        }

        /// <summary>
        /// 备注
        /// </summary>		
        private string _remark;
        [DataMember]
        public string remark
        {
            get { return _remark; }
            set { _remark = value; }
        }


    }
}
