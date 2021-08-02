using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using fw.fwDal;

namespace fw.m.basicInfo.data.entity
{
    [DataContract]
    public class BLLEquipment : FWEntityObject
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
        ///  设备所属行政区
        /// </summary>
        [DataMember]
        public string cantonCode
        {
            get { return _cantonCode; }
            set { _cantonCode = changeValue("cantonCode", _cantonCode, value); }
        }

        private string _equipmentTypeCode;

        /// <summary>
        ///  设备型号
        /// </summary>
        [DataMember]
        public string equipmentTypeCode
        {
            get { return _equipmentTypeCode; }
            set { _equipmentTypeCode = changeValue("equipmentTypeCode", _equipmentTypeCode, value); }
        }


        private int _moduleTypeCode;

        /// <summary>
        ///  模块类型
        /// </summary>
        [DataMember]
        public int moduleTypeCode
        {
            get { return _moduleTypeCode; }
            set { _moduleTypeCode = changeValue("moduleTypeCode", _moduleTypeCode, value); }
        }

        private string _remark;

        /// <summary>
        ///  设备备注（用于保存lora对应的集中器编码）
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

        private string _supplier;
        /// <summary>
        ///  供应商
        /// </summary>
        [DataMember]
        public string supplier
        {
            get { return _supplier; }
            set { _supplier = changeValue("supplier", _supplier, value); }
        }

        private string _supplierMark;
        /// <summary>
        ///  供应商参数
        /// </summary>
        [DataMember]
        public string supplierMark
        {
            get { return _supplierMark; }
            set { _supplierMark = changeValue("supplierMark", _supplierMark, value); }
        }
    }
}
