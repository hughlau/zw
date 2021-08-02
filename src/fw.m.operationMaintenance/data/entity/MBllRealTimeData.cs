using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwDal;
using System.Runtime.Serialization;

namespace fw.m.operationMaintenance.data.entity
{
    public class MBllRealTimeData : FWEntityObject
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

    }
}
