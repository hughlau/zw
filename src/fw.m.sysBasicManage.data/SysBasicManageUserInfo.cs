using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.m.sysManage.data;
using System.Runtime.Serialization;

namespace fw.m.sysBasicManage.data
{
    [DataContract,Serializable]
    public class SysBasicManageUserInfo : SysManageUserInfo
    {
        public SysBasicManageUserInfo()
        {
        }

        public SysBasicManageUserInfo(SysManageUserInfo userInfo)
        {
            ticket = userInfo.ticket;
            thirdCode = userInfo.thirdCode;
            thirdUserName = userInfo.thirdUserName;
            thirdUniqueIdentifier = userInfo.thirdUniqueIdentifier;
            userID = userInfo.userID;
            userName = userInfo.userName;
            parentLoginUserInfoMD5 = userInfo.parentLoginUserInfoMD5;
            userInfoMD5 = userInfo.userInfoMD5;
            roleCodeList = userInfo.roleCodeList;
            functionCodeList = userInfo.functionCodeList;
            lastActionTime = userInfo.lastActionTime;
        }

        [DataMember]
        public string operationMaintenanceUnitName { get; set; }

        [DataMember]
        public string operationMaintenanceUnitCode { get; set; }

        [DataMember]
        public List<string> cantonCodeList { get; set; }

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
