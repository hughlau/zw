using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace fw.m.sysBasicManage.data.model
{
    /// <summary>
    /// 第三方系统信息
    /// </summary>
    public class MApp
    {

        /// <summary>
        /// 数据主键
        /// </summary>		
        private string _dataID;
        [DataMember]
        public string dataID
        {
            get { return _dataID; }
            set { _dataID = value; }
        }
        /// <summary>
        /// 系统编码
        /// </summary>		
        private string _appCode;
        [DataMember]
        public string appCode
        {
            get { return _appCode; }
            set { _appCode = value; }
        }
        /// <summary>
        /// 系统名称
        /// </summary>		
        private string _appName;
        [DataMember]
        public string appName
        {
            get { return _appName; }
            set { _appName = value; }
        }
        /// <summary>
        /// 系统登录地址
        /// </summary>		
        private string _appRootDirectory;
        [DataMember]
        public string appRootDirectory
        {
            get { return _appRootDirectory; }
            set { _appRootDirectory = value; }
        }

        /// <summary>
        /// 系统用户名
        /// </summary>		
        private string _appAccountName;
        [DataMember]
        public string appAccountName
        {
            get { return _appAccountName; }
            set { _appAccountName = value; }
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

        /// <summary>
        /// 是否禁用
        /// </summary>		
        private Int32? _isDis;
        [DataMember]
        public Int32? isDis
        {
            get { return _isDis; }
            set { _isDis = value; }
        }

        /// <summary>
        /// 创建人主键
        /// </summary>		
        private string _createrID;
        [DataMember]
        public string createrID
        {
            get { return _createrID; }
            set { _createrID = value; }
        }
        /// <summary>
        /// 创建时间
        /// </summary>		
        private DateTime? _createTime;
        [DataMember]
        public DateTime? createTime
        {
            get { return _createTime; }
            set { _createTime = value; }
        }
        /// <summary>
        /// 更新人主键
        /// </summary>		
        private string _updaterID;
        [DataMember]
        public string updaterID
        {
            get { return _updaterID; }
            set { _updaterID = value; }
        }
        /// <summary>
        /// 更新时间
        /// </summary>		
        private DateTime? _updateTime;
        [DataMember]
        public DateTime? updateTime
        {
            get { return _updateTime; }
            set { _updateTime = value; }
        }


    }
}
