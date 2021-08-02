using fw.fwDal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.basicInfo.data.model
{
    [DataContract, Serializable]
    public class MBLLControlPlanAndDetail : FWEntityObject
    {
        private string _planCode;
        [DataMember]
        public string planCode
        {
            get { return _planCode; }
            set { _planCode = changeValue("planCode", _planCode, value); }
        }

        private string _planDetailCode;
        [DataMember]
        public string planDetailCode
        {
            get { return _planDetailCode; }
            set { _planDetailCode = changeValue("planDetailCode", _planDetailCode, value); }
        }

        private string _name;
        [DataMember]
        public string name
        {
            get { return _name; }
            set { _name = changeValue("name", _name, value); }
        }

        private string _detail;
        [DataMember]
        public string detail
        {
            get { return _detail; }
            set { _detail = changeValue("detail", _detail, value); }
        }

        private int _monitorType;
        [DataMember]
        public int monitorType
        {
            get { return _monitorType; }
            set { _monitorType = changeValue("monitorType", _monitorType, value); }
        }

        private string _monitorTypeContent;
        [DataMember]
        public string monitorTypeContent
        {
            get { return _monitorTypeContent; }
            set { _monitorTypeContent = changeValue("monitorTypeContent", _monitorTypeContent, value); }
        }

        private string _monitorTypeContentNames;
        [DataMember]
        public string monitorTypeContentNames
        {
            get { return _monitorTypeContentNames; }
            set { _monitorTypeContentNames = changeValue("monitorTypeContentNames", _monitorTypeContentNames, value); }
        }

        private string _equipmentType;
        [DataMember]
        public string equipmentType
        {
            get { return _equipmentType; }
            set { _equipmentType = changeValue("equipmentType", _equipmentType, value); }
        }

        private int _controlCommand;
        [DataMember]
        public int controlCommand
        {
            get { return _controlCommand; }
            set { _controlCommand = changeValue("controlCommand", _controlCommand, value); }
        }

        private int _executeType;
        [DataMember]
        public int executeType
        {
            get { return _executeType; }
            set { _executeType = changeValue("executeType", _executeType, value); }
        }

        private int? _executeDelayHour;
        [DataMember]
        public int? executeDelayHour
        {
            get { return _executeDelayHour; }
            set { _executeDelayHour = changeValue("executeDelayHour", _executeDelayHour, value); }
        }

        private int? _executeDelayMin;
        [DataMember]
        public int? executeDelayMin
        {
            get { return _executeDelayMin; }
            set { _executeDelayMin = changeValue("executeDelayMin", _executeDelayMin, value); }
        }

        private int? _executeDelaySec;
        [DataMember]
        public int? executeDelaySec
        {
            get { return _executeDelaySec; }
            set { _executeDelaySec = changeValue("executeDelaySec", _executeDelaySec, value); }
        }

        private DateTime? _executeTime;
        [DataMember]
        public DateTime? executeTime
        {
            get { return _executeTime; }
            set { _executeTime = changeValue("executeTime", _executeTime, value); }
        }
    }
}
