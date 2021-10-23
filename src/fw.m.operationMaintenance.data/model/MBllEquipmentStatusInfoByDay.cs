using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using fw.fwDal;

namespace fw.m.operationMaintenance.data.model
{
   [DataContract]
    public class MBllEquipmentStatusInfoByDay : FWEntityObject
    {

        private string _cantonCode;

        /// <summary>
        /// 厂区编码
        /// </summary>
       [DataMember]
       public string cantonCode
        {
            get { return _cantonCode; }
            set { _cantonCode = changeValue("cantonCode", _cantonCode, value); }
        }

       private string _projectNo;

       /// <summary>
       /// 项目代号
       /// </summary>
       [DataMember]
       public string projectNo
       {
           get { return _projectNo; }
           set { _projectNo = changeValue("projectNo", _projectNo, value); }
       }

        private string _cantonName;

        /// <summary>
        /// 厂区编码
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

        private int? _testNum;

        /// <summary>
        ///  正常数量
        /// </summary>
        [DataMember]
        public int? testNum
        {
            get { return _testNum; }
            set { _testNum = changeValue("testNum", _testNum, value); }
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
