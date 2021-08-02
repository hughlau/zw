using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;


/****************************************************************
*   Author：L
*   Time：2020/5/18 12:04:14
*   FrameVersion：4.6.1
*   Description：
*
*****************************************************************/

namespace fw.m.sysBasicManage.data.model
{
    [Serializable,DataContract]
    public class MFWUserLogin_New
    {
        #region =============属性============

        [DataMember]
        public string MUserID { get; set; }
        [DataMember]
        public string MUserName { get; set; }
        [DataMember]
        public string MPassword { get; set; }
        [DataMember]
        public string MUserTypeCode { get; set; }
        [DataMember]
        public string MUserTypeName { get; set; }
        [DataMember]
        public string MOpUnit { get; set; }
        [DataMember]
        public string MOpUnitName { get; set; }
        [DataMember]
        public int MIsDistribute { get; set; }
        [DataMember]
        public int MIsDis { get; set; }


        #endregion


    }
}
