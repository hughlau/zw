using fw.fwDal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.basicInfo.data.entity
{
    [DataContract]
    public class BLLControlPlanExecuteResult : FWEntityObject
    {
        private string _code;
        [DataMember]
        public string code
        {
            get { return _code; }
            set { _code = changeValue("code", _code, value); }
        }

        private string _executeCode;
        [DataMember]
        public string executeCode
        {
            get { return _executeCode; }
            set { _executeCode = changeValue("executeCode", _executeCode, value); }
        }

        private string _executeParams;
        [DataMember]
        public string executeParams
        {
            get { return _executeParams; }
            set { _executeParams = changeValue("executeParams", _executeParams, value); }
        }

        private string _result;
        [DataMember]
        public string result
        {
            get { return _result; }
            set { _result = changeValue("result", _result, value); }
        }

        private DateTime _createTime;
        [DataMember]
        public DateTime createTime
        {
            get { return _createTime; }
            set { _createTime = changeValue("createTime", _createTime, value); }
        }

        private string _createUser;
        [DataMember]
        public string createUser
        {
            get { return _createUser; }
            set { _createUser = changeValue("createUser", _createUser, value); }
        }
    }
}
