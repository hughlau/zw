using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.sysBasicManage.data.model
{
    /// <summary>
    /// 问题统计
    /// </summary>
    [DataContract]
    public class MProblemStatistics
    {


        /// <summary>
        /// 所有数量
        /// </summary>
        [DataMember]
        public int totalAmount
        {
            set { _totalAmount = value; }
            get { return _totalAmount; }
        }
        private int _totalAmount;

        /// <summary>
        /// 已解决问题
        /// </summary>
        [DataMember]
        public int solvedAmount
        {
            set { _solvedAmount = value; }
            get { return _solvedAmount; }
        }
        private int _solvedAmount;


        /// <summary>
        /// 未解决问题
        /// </summary>
        [DataMember]
        public int unSolvedAmount
        {
            set { _unSolvedAmount = value; }
            get { return _unSolvedAmount; }
        }
        private int _unSolvedAmount;


        /// <summary>
        /// 已回复数量
        /// </summary>
        [DataMember]
        public int replyAmount
        {
            set { _replyAmount = value; }
            get { return _replyAmount; }
        }
        private int _replyAmount;


        /// <summary>
        /// 未回复数量
        /// </summary>
        [DataMember]
        public int unReplyAmount
        {
            set { _unReplyAmount = value; }
            get { return _unReplyAmount; }
        }
        private int _unReplyAmount;
    }
}
