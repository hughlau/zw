using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using fw.fwDal;

namespace fw.m.sysBasicManage.data.entity
{
    /// <summary>
    /// 行政区信息
    /// </summary>
    [DataContract]
    public class T_Sys_MenuExInfo : FWEntityObject
    {
        private Int64? _AutoID;
        /// <summary>
        /// id
        /// </summary>
        [DataMember]
        public Int64? AutoID
        {
            get { return _AutoID; }
            set { _AutoID = changeValue("AutoID", _AutoID, value); }
        }

        private string _pageID;
        /// <summary>
        /// 页面编码
        /// </summary>
        [DataMember]
        public string pageID
        {
            get { return _pageID; }
            set { _pageID = changeValue("pageID", _pageID, value); }
        }
        private string _menuCode;
        /// <summary>
        /// 页面编码
        /// </summary>
        [DataMember]
        public string menuCode
        {
            get { return _menuCode; }
            set { _menuCode = changeValue("menuCode", _menuCode, value); }
        }

        private string _keyWords;
        /// <summary>
        /// 页面编码
        /// </summary>
        [DataMember]
        public string keyWords
        {
            get { return _keyWords; }
            set { _keyWords = changeValue("keyWords", _keyWords, value); }
        }
        private string _funDescription;
        /// <summary>
        /// 功能描述
        /// </summary>
        [DataMember]
        public string funDescription
        {
            get { return _funDescription; }
            set { _funDescription = changeValue("funDescription", _funDescription, value); }
        }
        private string _instructions;
        /// <summary>
        /// 操作说明
        /// </summary>
        [DataMember]
        public string instructions
        {
            get { return _instructions; }
            set { _instructions = changeValue("instructions", _instructions, value); }
        }
        private string _questions;
        /// <summary>
        /// 操作说明
        /// </summary>
        [DataMember]
        public string questions
        {
            get { return _questions; }
            set { _questions = changeValue("questions", _questions, value); }
        }
        private string _attachmentName;
        /// <summary>
        /// 附件名称
        /// </summary>
        [DataMember]
        public string attachmentName
        {
            get { return _attachmentName; }
            set { _attachmentName = changeValue("attachmentName", _attachmentName, value); }
        }
        private string _attachmentURL;
        /// <summary>
        /// 附件下载地址
        /// </summary>
        [DataMember]
        public string attachmentURL
        {
            get { return _attachmentURL; }
            set { _attachmentURL = changeValue("attachmentURL", _attachmentURL, value); }
        }
        private string _keysParamsJson;
        /// <summary>
        /// 调用参数
        /// </summary>
        [DataMember]
        public string keysParamsJson
        {
            get { return _keysParamsJson; }
            set { _keysParamsJson = changeValue("keysParamsJson", _keysParamsJson, value); }
        }
        private string _keysReturnJson;
        /// <summary>
        /// 调用参数 返回结果格式
        /// </summary>
        [DataMember]
        public string keysReturnJson
        {
            get { return _keysReturnJson; }
            set { _keysReturnJson = changeValue("keysReturnJson", _keysReturnJson, value); }
        }
        private Int32? _frequency;
        /// <summary>
        /// 调阅频次
        /// </summary>
        [DataMember]
        public Int32? frequency
        {
            get { return _frequency; }
            set { _frequency = changeValue("frequency", _frequency, value); }
        }
        private Int32? _isDelete;
        /// <summary>
        /// 调阅频次
        /// </summary>
        [DataMember]
        public Int32? isDelete
        {
            get { return _isDelete; }
            set { _isDelete = changeValue("isDelete", _isDelete, value); }
        }
        private Int32? _showType;
        /// <summary>
        /// 显示方式
        /// </summary>
        [DataMember]
        public Int32? showType
        {
            get { return _showType; }
            set { _showType = changeValue("showType", _showType, value); }
        }

        /// <summary>
        /// 创建人
        /// </summary>
        [DataMember]
        public String inputMan
        {
            set { _inputMan = this.changeValue("inputMan", _inputMan, value); }
            get { return _inputMan; }
        }
        private String _inputMan;

        /// <summary>
        /// 创建时间
        /// </summary>
        [DataMember]
        public DateTime inputTime
        {
            set { _inputTime = this.changeValue("inputTime", _inputTime, value); }
            get { return _inputTime; }
        }
        private DateTime _inputTime;

        /// <summary>
        /// 更新人
        /// </summary>
        [DataMember]
        public String updaterMan
        {
            set { _updaterMan = this.changeValue("updaterMan", _updaterMan, value); }
            get { return _updaterMan; }
        }
        private String _updaterMan;

        /// <summary>
        /// 更新时间
        /// </summary>
        [DataMember]
        public DateTime updateTime
        {
            set { _updateTime = this.changeValue("updateTime", _updateTime, value); }
            get { return _updateTime; }
        }
        private DateTime _updateTime;

        private int? _openMeans;
        /// <summary>
        /// 显示方式
        /// </summary>
        public int? openMeans
        {
            get { return _openMeans; }
            set { _openMeans = changeValue("openMeans", _openMeans, value); }
        }
    }
}
