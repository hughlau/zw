using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.sysBasicManage.data
{
    /// <summary>
    /// 
    /// </summary>
   [DataContract,Serializable]
    public class Message
    {
       
        /// <summary>
        /// ClassName
        /// 长度为 200
        /// 可为空
        /// </summary>
        [DataMember]
        public String title
        {
            set { _title = value; }
            get { return _title; }
        }
        private String _title;

        /// <summary>
        /// 用户名称
        /// 长度为 50
        /// 可为空
        /// </summary>
        [DataMember]
        public String content
        {
            set { _content = value; }
            get { return _content; }
        }
        private String _content;

        /// <summary>
        /// 添加时间
        /// </summary>
        [DataMember]
        public String protocol
        {
            set { _protocol = value; }
            get { return _protocol; }
        }
        private String _protocol;

        [DataMember]
        public String dataJson
        {
            set { _dataJson = value; }
            get { return _dataJson; }
        }
        private String _dataJson;

    }
}
