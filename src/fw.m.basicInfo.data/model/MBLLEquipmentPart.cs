using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using fw.fwDal;

namespace fw.m.basicInfo.data.model
{
   
    /// <summary>
    /// 设备零部件
    /// </summary>
    [DataContract]
    public class MBLLEquipmentPart : FWEntityObject
    {

        private string _partCode;

        /// <summary>
        ///  零部件主键
        /// </summary>
        [DataMember]
        public string partCode
        {
            get { return _partCode; }
            set { _partCode = changeValue("partCode", _partCode, value); }
        }

        private string _partName;

        /// <summary>
        ///  零部件名称
        /// </summary>
        [DataMember]
        public string partName
        {
            get { return _partName; }
            set { _partName = changeValue("partName", _partName, value); }
        }

        private string _partType;

        /// <summary>
        ///  零部件类型
        /// </summary>
        [DataMember]
        public string partType
        {
            get { return _partType; }
            set { _partType = changeValue("partType", _partType, value); }
        }

        private string _partSpecification;

        /// <summary>
        ///  零部件规格型号
        /// </summary>
        [DataMember]
        public string partSpecification
        {
            get { return _partSpecification; }
            set { _partSpecification = changeValue("partSpecification", _partSpecification, value); }
        }

        private int? _ix;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public int? ix
        {
            get { return _ix; }
            set { _ix = changeValue("ix", _ix, value); }
        }

        private int? _isDel;

        /// <summary>
        ///  是否删除
        /// </summary>
        [DataMember]
        public int? isDel
        {
            get { return _isDel; }
            set { _isDel = changeValue("isDel", _isDel, value); }
        }

        private string _creater;

        /// <summary>
        ///  添加人
        /// </summary>
        [DataMember]
        public string creater
        {
            get { return _creater; }
            set { _creater = changeValue("creater", _creater, value); }
        }

        private DateTime? _createTime;

        /// <summary>
        ///  添加时间
        /// </summary>
        [DataMember]
        public DateTime? createTime
        {
            get { return _createTime; }
            set { _createTime = changeValue("createTime", _createTime, value); }
        }

        private string _updater;

        /// <summary>
        ///  更新人
        /// </summary>
        [DataMember]
        public string updater
        {
            get { return _updater; }
            set { _updater = changeValue("updater", _updater, value); }
        }

        private DateTime? _updateTime;

        /// <summary>
        ///  更新时间
        /// </summary>
        [DataMember]
        public DateTime? updateTime
        {
            get { return _updateTime; }
            set { _updateTime = changeValue("updateTime", _updateTime, value); }
        }

        private string _partTypeName;

        /// <summary>
        ///  零部件类型名称
        /// </summary>
        [DataMember]
        public string partTypeName
        {
            get { return _partTypeName; }
            set { _partTypeName = changeValue("partTypeName", _partTypeName, value); }
        }

        private string _recoverType;
        /// <summary>
        ///  旧零件回收
        /// </summary>
        [DataMember]
        public string recoverType
        {
            get { return _recoverType; }
            set { _recoverType = changeValue("recoverType", _recoverType, value); }
        }

        private string _recoverTypeName;
        /// <summary>
        ///  旧零件回收名称
        /// </summary>
        [DataMember]
        public string recoverTypeName
        {
            get { return _recoverTypeName; }
            set { _recoverTypeName = changeValue("recoverTypeName", _recoverTypeName, value); }
        }
    }
}
