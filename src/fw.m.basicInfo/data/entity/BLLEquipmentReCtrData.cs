using System; 
using System.Collections.Generic; 
using System.Linq; 
using System.Text; 
using System.Runtime.Serialization;
using fw.fwDal;

namespace fw.m.basicInfo.data.entity
{ 
    //BLLEquipmentReCtrData
    [DataContract] 
    public class BLLEquipmentReCtrData : FWEntityObject
    {   

        private Int64? _id;
        /// <summary>
        /// 
        /// 长度为8
        /// 不可为空
        /// </summary>
        [DataMember] 
        public Int64? id 
        {
            get { return _id; } 
            set { _id = changeValue("id",_id,value);  } 
        }

        private String _ReCtrID;
        /// <summary>
        /// 
        /// 长度为36
        /// 不可为空
        /// </summary>
        [DataMember] 
        public String ReCtrID 
        {
            get { return _ReCtrID; } 
            set { _ReCtrID = changeValue("ReCtrID",_ReCtrID,value);  } 
        }

        private DateTime? _ReCtrSampTime;
        /// <summary>
        /// 
        /// 长度为8
        /// 可为空
        /// </summary>
        [DataMember] 
        public DateTime? ReCtrSampTime 
        {
            get { return _ReCtrSampTime; } 
            set { _ReCtrSampTime = changeValue("ReCtrSampTime",_ReCtrSampTime,value);  } 
        }

        private String _equipmentNo;
        /// <summary>
        /// 
        /// 长度为50
        /// 可为空
        /// </summary>
        [DataMember] 
        public String equipmentNo 
        {
            get { return _equipmentNo; } 
            set { _equipmentNo = changeValue("equipmentNo",_equipmentNo,value);  } 
        }

        private int? _Action;
        /// <summary>
        /// 
        /// 长度为2
        /// 可为空
        /// </summary>
        [DataMember]
        public int? Action 
        {
            get { return _Action; } 
            set { _Action = changeValue("Action",_Action,value);  } 
        }

        private Int32? _ActTime;
        /// <summary>
        /// 
        /// 长度为4
        /// 可为空
        /// </summary>
        [DataMember] 
        public Int32? ActTime 
        {
            get { return _ActTime; } 
            set { _ActTime = changeValue("ActTime",_ActTime,value);  } 
        }

        private int? _ActResult;
        /// <summary>
        /// 
        /// 长度为2
        /// 可为空
        /// </summary>
        [DataMember]
        public int? ActResult 
        {
            get { return _ActResult; } 
            set { _ActResult = changeValue("ActResult",_ActResult,value);  } 
        }

    }
}