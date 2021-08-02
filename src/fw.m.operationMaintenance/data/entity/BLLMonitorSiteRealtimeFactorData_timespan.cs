using fw.fwDal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.operationMaintenance.data.entity
{
    public class BLLMonitorSiteRealtimeFactorData_timespan : FWEntityObject
    {

        private string _DataTimespan;
        public string DataTimespan
        {
            get { return _DataTimespan; }
            set { _DataTimespan = changeValue("DataTimespan", _DataTimespan, value); }
        }

        private int _DataListNum;
        public int DataListNum
        {
            get { return _DataListNum; }
            set { _DataListNum = changeValue("DataListNum", _DataListNum, value); }
        }

        private int _StateListNum;
        public int StateListNum
        {
            get { return _StateListNum; }
            set { _StateListNum = changeValue("StateListNum", _StateListNum, value); }
        }


    }
}
