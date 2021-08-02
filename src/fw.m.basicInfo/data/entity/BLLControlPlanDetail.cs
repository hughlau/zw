using fw.fwDal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.basicInfo.data.entity
{
    [DataContract]
    public class BLLControlPlanDetail : FWEntityObject
    {
        private string _code;
        [DataMember]
        public string code
        {
            get { return _code; }
            set { _code = changeValue("code", _code, value); }
        }

        private string _planCode;
        [DataMember]
        public string planCode
        {
            get { return _planCode; }
            set { _planCode = changeValue("planCode", _planCode, value); }
        }
        private int _monitorType ;
        [DataMember]
        public int monitorType
        {
            get { return _monitorType; }
            set { _monitorType = changeValue("monitorType", _monitorType, value); }
        }
        private string _monitorTypeContent ;
        [DataMember]
        public string monitorTypeContent
        {
            get { return _monitorTypeContent; }
            set { _monitorTypeContent = changeValue("monitorTypeContent", _monitorTypeContent, value); }
        }
        private string _equipmentType ;
        [DataMember]
        public string equipmentType
        {
            get { return _equipmentType; }
            set { _equipmentType = changeValue("equipmentType", _equipmentType, value); }
        }
        private int _controlCommand ;
        [DataMember]
        public int controlCommand
        {
            get { return _controlCommand; }
            set { _controlCommand = changeValue("controlCommand", _controlCommand, value); }
        }
        private int _executeType ;
        [DataMember]
        public int executeType
        {
            get { return _executeType; }
            set { _executeType = changeValue("executeType", _executeType, value); }
        }
        private int? _executeDelayHour ;
        [DataMember]
        public int? executeDelayHour
        {
            get { return _executeDelayHour; }
            set { _executeDelayHour = changeValue("executeDelayHour", _executeDelayHour, value); }
        }
        private int? _executeDelayMin ;
        [DataMember]
        public int? executeDelayMin
        {
            get { return _executeDelayMin; }
            set { _executeDelayMin = changeValue("executeDelayMin", _executeDelayMin, value); }
        }
        private int? _executeDelaySec ;
        [DataMember]
        public int? executeDelaySec
        {
            get { return _executeDelaySec; }
            set { _executeDelaySec = changeValue("executeDelaySec", _executeDelaySec, value); }
        }
        private DateTime? _executeTime ;
        [DataMember]
        public DateTime? executeTime
        {
            get { return _executeTime; }
            set { _executeTime = changeValue("executeTime", _executeTime, value); }
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
        private DateTime _updateTime ;
        [DataMember]
        public DateTime updateTime
        {
            get { return _updateTime; }
            set { _updateTime = changeValue("updateTime", _updateTime, value); }
        }
        private string _updateUserId ;
        [DataMember]
        public string updateUserId
        {
            get { return _updateUserId; }
            set { _updateUserId = changeValue("updateUserId", _updateUserId, value); }
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
