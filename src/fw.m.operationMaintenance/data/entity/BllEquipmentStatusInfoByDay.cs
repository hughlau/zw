using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwDal;
using System.Runtime.Serialization;

namespace fw.m.operationMaintenance.data.entity
{
    [DataContract]
    public class BllEquipmentStatusInfoByDay : FWEntityObject
    {
        private string _cantonCode;

        /// <summary>
        /// 行政区编码
        /// </summary>
        [DataMember]
        public string cantonCode
        {
            get { return _cantonCode; }
            set { _cantonCode = changeValue("cantonCode", _cantonCode, value); }
        }
        private string _cantonName;

        /// <summary>
        /// 行政区编码
        /// </summary>
        [DataMember]
        public string cantonName
        {
            get { return _cantonName; }
            set { _cantonName = changeValue("cantonName", _cantonName, value); }
        }

        private int? _normalNum;

        /// <summary>
        ///  正常数量
        /// </summary>
        [DataMember]
        public int? normalNum
        {
            get { return _normalNum; }
            set { _normalNum = changeValue("normalNum", _normalNum, value); }
        }


        private int? _offLineNum;

        /// <summary>
        ///  正常数量
        /// </summary>
        [DataMember]
        public int? offLineNum
        {
            get { return _offLineNum; }
            set { _offLineNum = changeValue("offLineNum", _offLineNum, value); }
        }

        private int? _electricFault;

        /// <summary>
        ///  正常数量
        /// </summary>
        [DataMember]
        public int? electricFault
        {
            get { return _electricFault; }
            set { _electricFault = changeValue("electricFault", _electricFault, value); }
        }

        private int? _blockNum;

        /// <summary>
        ///  正常数量
        /// </summary>
        [DataMember]
        public int? blockNum
        {
            get { return _blockNum; }
            set { _blockNum = changeValue("blockNum", _blockNum, value); }
        }
        private int? _blowByNum;

        /// <summary>
        ///  正常数量
        /// </summary>
        [DataMember]
        public int? blowByNum
        {
            get { return _blowByNum; }
            set { _blowByNum = changeValue("blowByNum", _blowByNum, value); }
        }

        private string _createTimeFormat;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public string createTimeFormat
        {
            get { return _createTimeFormat; }
            set { _createTimeFormat = changeValue("createTimeFormat", _createTimeFormat, value); }
        }
    }
}
