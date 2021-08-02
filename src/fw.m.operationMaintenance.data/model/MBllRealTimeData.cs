using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using fw.fwDal;

namespace fw.m.operationMaintenance.data.model
{
    [DataContract]
     public class MBllRealTimeData: FWEntityObject
    {

        private DateTime _createDateTime;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public DateTime createDateTime
        {
            get { return _createDateTime; }
            set { _createDateTime = changeValue("createDateTime", _createDateTime, value); }
        }

        private string _wKqbCurValue;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public string wKqbCurValue
        {
            get { return _wKqbCurValue; }
            set { _wKqbCurValue = changeValue("wKqbCurValue", _wKqbCurValue, value); }
        }

        private string _ltuMac;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public string ltuMac
        {
            get { return _ltuMac; }
            set { _ltuMac = changeValue("ltuMac", _ltuMac, value); }
        }


        private string _byModeType;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public string byModeType
        {
            get { return _byModeType; }
            set { _byModeType = changeValue("byModeType", _byModeType, value); }
        }

        private int _byDI3;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public int byDI3
        {
            get { return _byDI3; }
            set { _byDI3 = changeValue("byDI3", _byDI3, value); }
        }

        private int _byDI1;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public int byDI1
        {
            get { return _byDI1; }
            set { _byDI1 = changeValue("byDI1", _byDI1, value); }
        }

        private int _byDI2;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public int byDI2
        {
            get { return _byDI2; }
            set { _byDI2 = changeValue("byDI2", _byDI2, value); }
        }

        private int _byDI4;

        /// <summary>
        ///  
        /// </summary>
        [DataMember]
        public int byDI4
        {
            get { return _byDI4; }
            set { _byDI4 = changeValue("byDI4", _byDI4, value); }
        }

    }
}
