using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.m.sysManage.data;
using System.Runtime.Serialization;
using fw.fwData;

namespace fw.m.sysBasicManage.data
{
    [DataContract, Serializable]
    public class PageUserInfo
    {
        [DataMember]
        public string ticket { get; set; }

        [DataMember]
        public string userID { get; set; }

        [DataMember]
        public string userName { get; set; }

        [DataMember]
        public string deviceAlias { get; set; }

        [DataMember]
        public string thirdCode { get; set; }

        [DataMember]
        public string thirdUserName { get; set; }

        [DataMember]
        public string thirdUniqueIdentifier { get; set; }

        [DataMember]
        public DateTime lastActionTime { get; set; }

        [DataMember]
        public FWHashSet<string> roleCodeList { get; set; }

        [DataMember]
        public string operationMaintenanceUnitName { get; set; }

        [DataMember]
        public string operationMaintenanceUnitCode { get; set; }

        /// <summary>
        ///  运维人员主键
        /// </summary>
        [DataMember]
        public string operationMaintenancePersonCode { get; set; }
        /// <summary>
        ///  运维人员姓名
        /// </summary>
        [DataMember]
        public string operationMaintenancePersonName { get; set; }

        [DataMember]
        public string userTypeCode { get; set; }

        [DataMember]
        public string userTypeName { get; set; }
    }
}
