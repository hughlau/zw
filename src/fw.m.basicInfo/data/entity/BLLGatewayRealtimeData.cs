using fw.fwDal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


/****************************************************************
*   Author：L
*   Time：2020/5/21 11:34:20
*   FrameVersion：4.6.1
*   Description：
*
*****************************************************************/

namespace fw.m.basicInfo.data.entity
{
    public class BLLGatewayRealtimeData : FWEntityObject
    {
        #region =============属性============

        private string _code;
        public string code
        {
            get { return _code; }
            set { _code = changeValue("code", _code, value); }
        }

        private DateTime _monitorTime;
        public DateTime monitorTime
        {
            get { return _monitorTime; }
            set { _monitorTime = changeValue("monitorTime", _monitorTime, value); }
        }

        private int _dataState;
        public int dataState
        {
            get { return _dataState; }
            set { _dataState = changeValue("dataState", _dataState, value); }
        }

        private DateTime _lastMonitorTime;
        public DateTime lastMonitorTime
        {
            get { return _lastMonitorTime; }
            set { _lastMonitorTime = changeValue("lastMonitorTime", _lastMonitorTime, value); }
        }

        #endregion

    }
}
