using fw.fwDal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.basicInfo.data.entity
{
    public class BLLEquipmentPartChangeRecord : FWEntityObject
    {
        private int _id;

        public int id
        {
            get { return _id; }
            set { _id = changeValue("id", _id, value); }
        }

        private string _monitorSiteCode;


        public string monitorSiteCode
        {
            get { return _monitorSiteCode; }
            set { _monitorSiteCode = changeValue("monitorSiteCode", _monitorSiteCode, value); }
        }

        private string _partCode;

        public string partCode
        {
            get { return _partCode; }
            set { _partCode = changeValue("partCode", _partCode, value); }
        }

        private string _changeUserId;

        public string changeUserId
        {
            get { return _changeUserId; }
            set { _changeUserId = changeValue("changeUserId", _changeUserId, value); }
        }

        private DateTime _changeTime;

        public DateTime changeTime
        {
            get { return _changeTime; }
            set { _changeTime = changeValue("changeTime", _changeTime, value); }
        }

        private DateTime _createTime;

        public DateTime createTime
        {
            get { return _createTime; }
            set { _createTime = changeValue("createTime", _createTime, value); }
        }

        private int _isDel;

        public int isDel
        {
            get { return _isDel; }
            set { _isDel = changeValue("isDel", _isDel, value); }
        }

        public string _changeRecordCode;
        public string changeRecordCode
        {
            get { return _changeRecordCode; }
            set { _changeRecordCode = changeValue("changeRecordCode", _changeRecordCode, value); }
        }
    }
}
