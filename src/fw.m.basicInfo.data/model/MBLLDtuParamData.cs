using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using fw.fwDal;

namespace fw.m.basicInfo.data.model
{
    [DataContract]
    public class MBLLDtuParamData : FWEntityObject
    {
        private string _dtuMac;

        /// <summary>
        ///  dtu Mac
        /// </summary>
        [DataMember]
        public string dtuMac
        {
            get { return _dtuMac; }
            set { _dtuMac = changeValue("dtuMac", _dtuMac, value); }
        }

        private double _realDataReportPeriod;
        /// <summary>
        ///  dtu Mac
        /// </summary>
        [DataMember]
        public double realDataReportPeriod
        {
            get { return _realDataReportPeriod; }
            set { _realDataReportPeriod = changeValue("realDataReportPeriod", _realDataReportPeriod, value); }
        }

        private string _alarmReportPeriod;
        /// <summary>
        ///  dtu Mac
        /// </summary>
        [DataMember]
        public string alarmReportPeriod
        {
            get { return _alarmReportPeriod; }
            set { _alarmReportPeriod = changeValue("alarmReportPeriod", _alarmReportPeriod, value); }
        }

        private DateTime? _createDatetime;

        /// <summary>
        ///  添加时间
        /// </summary>
        [DataMember]
        public DateTime? createDatetime
        {
            get { return _createDatetime; }
            set { _createDatetime = changeValue("createDatetime", _createDatetime, value); }
        }

    }
}
