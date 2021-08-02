using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using fw.fwDal;

namespace fw.m.basicInfo.data.entity
{
    [DataContract]
    public class T_DAT_RealTime : FWEntityObject
    {


        private string _PK_MCode;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public string PK_MCode
        {
            get { return _PK_MCode; }
            set { _PK_MCode = changeValue("PK_MCode", _PK_MCode, value); }
        }

        private DateTime? _fdtmReal;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public DateTime? fdtmReal
        {
            get { return _fdtmReal; }
            set { _fdtmReal = changeValue("fdtmReal", _fdtmReal, value); }
        }

        private double? _Value;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public double? Value
        {
            get { return _Value; }
            set { _Value = changeValue("Value", _Value, value); }
        }

        private int? _fintStatis;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public int? fintStatis
        {
            get { return _fintStatis; }
            set { _fintStatis = changeValue("fintStatis", _fintStatis, value); }
        }

        private bool? _fbitOver;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public bool? fbitOver
        {
            get { return _fbitOver; }
            set { _fbitOver = changeValue("fbitOver", _fbitOver, value); }
        }

    }
}
