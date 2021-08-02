using fw.fwDal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.operationMaintenance.data.model
{
    [DataContract]
    public class MBLLInoculationRecord: FWEntityObject
    {
        private string _code;
        [DataMember]
        public string code
        {
            get { return _code; }
            set { _code = changeValue("code", _code, value); }
        }

        private string _monitorSiteName;
        [DataMember]
        public string monitorSiteName
        {
            get { return _monitorSiteName; }
            set { _monitorSiteName = changeValue("monitorSiteName", _monitorSiteName, value); }
        }
        private DateTime _createTime;
        [DataMember]
        public DateTime createTime
        {
            get { return _createTime; }
            set { _createTime = changeValue("createTime", _createTime, value); }
        }

        private string _name;
        [DataMember]
        public string name
        {
            get { return _name; }
            set { _name = changeValue("name", _name, value); }
        }
        private string _jianzhizhen;
        [DataMember]
        public string jianzhizhen
        {
            get { return _jianzhizhen; }
            set { _jianzhizhen = changeValue("jianzhizhen", _jianzhizhen, value); }
        }
        private string _xingzhengcun;
        [DataMember]
        public string xingzhengcun
        {
            get { return _xingzhengcun; }
            set { _xingzhengcun = changeValue("xingzhengcun", _xingzhengcun, value); }
        }
        private string _zirancun;
        [DataMember]
        public string zirancun
        {
            get { return _zirancun; }
            set { _zirancun = changeValue("zirancun", _zirancun, value); }
        }
        private string _maintainers;
        [DataMember]
        public string maintainers
        {
            get { return _maintainers; }
            set { _maintainers = changeValue("maintainers", _maintainers, value); }
        }

        private string _typeId;
        [DataMember]
        public string typeId
        {
            get { return _typeId; }
            set { _typeId = changeValue("typeId", _typeId, value); }
        }
        private DateTime? _inoculationTime;
        [DataMember]
        public DateTime? inoculationTime
        {
            get { return _inoculationTime; }
            set { _inoculationTime = changeValue("inoculationTime", _inoculationTime, value); }
        }
    }
}
