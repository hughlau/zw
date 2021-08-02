using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwDal;
using System.Runtime.Serialization;

namespace fw.m.sysBasicManage.data.model
{
    /// <summary>
    /// 问题咨询
    /// </summary>
    [DataContract]
    public class MProblem : FWEntityObject
    {
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
        /// 页面ID
        /// </summary>		
        private string _pageID;
        [DataMember]
        public string pageID
        {
            get { return _pageID; }
            set { _pageID = changeValue("pageID", _pageID, value); }
        }

        /// <summary>
        /// 菜单主键
        /// </summary>		
        private string _menuCode;
        [DataMember]
        public string menuCode
        {
            get { return _menuCode; }
            set { _menuCode = changeValue("menuCode", _menuCode, value); }
        }

        /// <summary>
        /// 问题标题
        /// </summary>		
        private string _problemTitle;
        [DataMember]
        public string problemTitle
        {
            get { return _problemTitle; }
            set { _problemTitle = changeValue("problemTitle", _problemTitle, value); }
        }

        /// <summary>
        /// 问题描述
        /// </summary>		
        private string _problemDescription;
        [DataMember]
        public string problemDescription
        {
            get { return _problemDescription; }
            set { _problemDescription = changeValue("problemDescription", _problemDescription, value); }
        }

        /// <summary>
        /// 提问用户主键
        /// </summary>		
        private string _askUserID;
        [DataMember]
        public string askUserID
        {
            get { return _askUserID; }
            set { _askUserID = changeValue("askUserID", _askUserID, value); }
        }
        /// <summary>
        /// 问题提问人
        /// </summary>
        private string _askUserName;
        [DataMember]
        public string askUserName
        {
            set { _askUserName = value; }
            get { return _askUserName; }
        }
        /// <summary>
        /// 企业主键
        /// </summary>
        [DataMember]
        public string askEnterpriseCode
        {
            set { _askEnterpriseCode = value; }
            get { return _askEnterpriseCode; }
        }
        private string _askEnterpriseCode;
        /// <summary>
        /// 企业名称
        /// </summary>
        [DataMember]
        public string askEnterpriseName
        {
            set { _askEnterpriseName = value; }
            get { return _askEnterpriseName; }
        }
        private string _askEnterpriseName;
        /// <summary>
        /// 提问时间
        /// </summary>		
        private DateTime? _askTime;
        [DataMember]
        public DateTime? askTime
        {
            get { return _askTime; }
            set { _askTime = changeValue("askTime", _askTime, value); }
        }
        /// <summary>
        /// 是否解决
        /// </summary>		
        private Int32? _isSolve;
        [DataMember]
        public Int32? isSolve
        {
            get { return _isSolve; }
            set { _isSolve = changeValue("isSolve", _isSolve, value); }
        }
        /// <summary>
        /// 对我有用
        /// </summary>		
        private Int32? _usefulForMeCount;
        [DataMember]
        public Int32? usefulForMeCount
        {
            get { return _usefulForMeCount; }
            set { _usefulForMeCount = changeValue("usefulForMeCount", _usefulForMeCount, value); }
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


        private bool _bHasPublish;

        /// <summary>
        /// 是否公布
        /// </summary>
        [DataMember]
        public bool bHasPublish
        {
            get { return _bHasPublish; }
            set { _bHasPublish = changeValue("bHasPublish", _bHasPublish, value); }
        }

        /// <summary>
        /// 问题回复列表
        /// </summary>		
        private List<MProblemReply> _problemReplyList;
        [DataMember]
        public List<MProblemReply> problemReplyList
        {
            get { return _problemReplyList; }
            set { _problemReplyList = value; }
        }


        /// <summary>
        /// 问题类型
        /// </summary>		
        private string _problemType;
        [DataMember]
        public string problemType
        {
            get { return _problemType; }
            set { _problemType = changeValue("problemType", _problemType, value); }
        }

        /// <summary>
        /// 问题类型名称
        /// </summary>		
        private string _problemTypeName;
        [DataMember]
        public string problemTypeName
        {
            get { return _problemTypeName; }
            set { _problemTypeName = changeValue("problemTypeName", _problemTypeName, value); }
        }



    }
}
