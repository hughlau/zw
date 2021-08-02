using fw.fwDal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.basicInfo.data.entity
{
    [DataContract]
    public class BLLControlPlanExecute : FWEntityObject
    {
        private string _code;
        [DataMember]
        public string code
        {
            get { return _code; }
            set { _code = changeValue("code", _code, value); }
        }

        private string _planDetailCode;
        [DataMember]
        public string planDetailCode
        {
            get { return _planDetailCode; }
            set { _planDetailCode = changeValue("planDetailCode", _planDetailCode, value); }
        }
        private string _detail;
        [DataMember]
        public string detail
        {
            get { return _detail; }
            set { _detail = changeValue("detail", _detail, value); }
        }

        private DateTime? _executeTime;
        [DataMember]
        public DateTime? executeTime
        {
            get { return _executeTime; }
            set { _executeTime = changeValue("executeTime", _executeTime, value); }
        }
        
        private int _isExecute;
        [DataMember]
        public int isExecute
        {
            get { return _isExecute; }
            set { _isExecute = changeValue("isExecute", _isExecute, value); }
        }
        
        private DateTime _createTime ;
        [DataMember]
        public DateTime createTime
        {
            get { return _createTime; }
            set { _createTime = changeValue("createTime", _createTime, value); }
        }
        private string _createUserId ;
        [DataMember]
        public string createUserId
        {
            get { return _createUserId; }
            set { _createUserId = changeValue("createUserId", _createUserId, value); }
        }
       
        private int _isDel ;
        [DataMember]
        public int isDel
        {
            get { return _isDel; }
            set { _isDel = changeValue("isDel", _isDel, value); }
        }

       
    }
}
