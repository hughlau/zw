using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwDal;

namespace fw.m.autoMonitor.data.entity
{
    //设施点位实时数据信息
    public class BLLMonitorSiteRealtimeFactorData : FWEntityObject
    {
        private long? _id;

        /// <summary>
        /// id
        /// </summary>
        public long? id
        {
            get { return _id; }
            set { _id = value; }
        }

        private string _monitorSiteCode;

        /// <summary>
        /// 用户ID
        /// </summary>
        public string monitorSiteCode
        {
            get { return _monitorSiteCode; }
            set { _monitorSiteCode = changeValue("monitorSiteCode", _monitorSiteCode, value); }
        }

        private string _monitorFactorCode;

        /// <summary>
        /// 用户ID
        /// </summary>
        public string monitorFactorCode
        {
            get { return _monitorFactorCode; }
            set { _monitorFactorCode = changeValue("monitorFactorCode", _monitorFactorCode, value); }
        }

        private DateTime? _monitorTime;

        /// <summary>
        /// monitorTime
        /// </summary>
        public DateTime? monitorTime
        {
            get { return _monitorTime; }
            set { _monitorTime = changeValue("monitorTime", _monitorTime, value); }
        }

        private double? _monitorValue;

        /// <summary>
        /// monitorValue
        /// </summary>
        public double? monitorValue
        {
            get { return _monitorValue; }
            set { _monitorValue = changeValue("monitorValue", _monitorValue, value); }
        }

        private DateTime? _createTime;

        /// <summary>
        /// createTime
        /// </summary>
        public DateTime? createTime
        {
            get { return _createTime; }
            set { _createTime = changeValue("createTime", _createTime, value); }
        }

        private int? _dataSource;

        /// <summary>
        /// dataSource
        /// </summary>
        public int? dataSource
        {
            get { return _dataSource; }
            set { _dataSource = changeValue("dataSource", _dataSource, value); }
        }

        private int? _dataState;

        /// <summary>
        /// dataState
        /// </summary>
        public int? dataState
        {
            get { return _dataState; }
            set { _dataState = changeValue("dataState", _dataState, value); }
        }

        private string _createrID;

        /// <summary>
        /// 创建人
        /// </summary>
        public string createrID
        {
            get { return _createrID; }
            set { _createrID = changeValue("createrID", _createrID, value); }
        }

        private string _updaterID;

        /// <summary>
        /// 修改人
        /// </summary>
        public string updaterID
        {
            get { return _updaterID; }
            set { _updaterID = changeValue("updaterID", _updaterID, value); }
        }

        private DateTime? _updateTime;

        /// <summary>
        /// 更新时间
        /// </summary>
        public DateTime? updateTime
        {
            get { return _updateTime; }
            set { _updateTime = changeValue("updateTime", _updateTime, value); }
        }
    }
}
