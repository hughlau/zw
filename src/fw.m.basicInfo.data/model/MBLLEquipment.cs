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
    [DataContract, Serializable]
    public class MBLLEquipment : FWEntityObject
    {

        private string _equipmentCode;

        /// <summary>
        ///  设备主键
        /// </summary>
        [DataMember]
        public string equipmentCode
        {
            get { return _equipmentCode; }
            set { _equipmentCode = changeValue("equipmentCode", _equipmentCode, value); }
        }

        private string _equipmentNo;

        /// <summary>
        ///  设备编号
        /// </summary>
        [DataMember]
        public string equipmentNo
        {
            get { return _equipmentNo; }
            set { _equipmentNo = changeValue("equipmentNo", _equipmentNo, value); }
        }

        private string _equipmentName;

        /// <summary>
        ///  设备名称
        /// </summary>
        [DataMember]
        public string equipmentName
        {
            get { return _equipmentName; }
            set { _equipmentName = changeValue("equipmentName", _equipmentName, value); }
        }

        private string _cantonCode;

        /// <summary>
        ///  设备所属厂区
        /// </summary>
        [DataMember]
        public string cantonCode
        {
            get { return _cantonCode; }
            set { _cantonCode = changeValue("cantonCode", _cantonCode, value); }
        }

        private string _equipmentTypeCode;

        /// <summary>
        ///  设备类型
        /// </summary>
        [DataMember]
        public string equipmentTypeCode
        {
            get { return _equipmentTypeCode; }
            set { _equipmentTypeCode = changeValue("equipmentTypeCode", _equipmentTypeCode, value); }
        }

        private string _moduleTypeCode;

        /// <summary>
        ///  设备类型
        /// </summary>
        [DataMember]
        public string moduleTypeCode
        {
            get { return _moduleTypeCode; }
            set { _moduleTypeCode = changeValue("moduleTypeCode", _moduleTypeCode, value); }
        }

     
        private string _remark;

        /// <summary>
        ///  设备类型
        /// </summary>
        [DataMember]
        public string remark
        {
            get { return _remark; }
            set { _remark = changeValue("remark", _remark, value); }
        }

        private DateTime? _acceptanceTime;

        /// <summary>
        ///  验收时间
        /// </summary>
        [DataMember]
        public DateTime? acceptanceTime
        {
            get { return _acceptanceTime; }
            set { _acceptanceTime = changeValue("acceptanceTime", _acceptanceTime, value); }
        }


        private int? _isScrap;

        /// <summary>
        ///  是否报废
        /// </summary>
        [DataMember]
        public int? isScrap
        {
            get { return _isScrap; }
            set { _isScrap = changeValue("isScrap", _isScrap, value); }
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


        /// <summary>
        ///  厂区名称
        /// </summary>
        [DataMember]
        public string cantonName { get; set; }


        private string _monitorSiteCode;
        /// <summary>
        ///  站点主键
        /// </summary>
        [DataMember]
        public string monitorSiteCode
        {
            get { return _monitorSiteCode; }
            set { _monitorSiteCode = changeValue("monitorSiteCode", _monitorSiteCode, value); }
        }


        /// <summary>
        ///  设备类型名称
        /// </summary>
        [DataMember]
        public string equipmentTypeName { get; set; }

        /// <summary>
        ///  模块类型名称
        /// </summary>
        [DataMember]
        public string moduleTypeName { get; set; }
        /// <summary>
        ///  站点名称
        /// </summary>
        [DataMember]
        public string monitorSiteName { get; set; }

        /// <summary>
        ///  设备状态编码
        /// </summary>
        [DataMember]
        public int? equipmentStatusCode { get; set; }

        /// <summary>
        ///  设备状态名称
        /// </summary>
        [DataMember]
        public string equipmentStatusName { get; set; }

        /// <summary>
        /// 设备供应商（1：慧联无限；2：mqtt）
        /// </summary>
        [DataMember]
        public string supplier { get; set; }

        /// <summary>
        /// 供应商自定义参数
        /// </summary>
        [DataMember]
        public string supplierMark { get; set; }
    }
}
