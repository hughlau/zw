using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using fw.fwDal;

namespace fw.m.sysBasicManage.data.model
{
    /// <summary>
    /// 运维单位 实体对象
    /// </summary>
    public class MBLLOperationMaintenanceUnitPerson:FWEntityObject
    {
        
        /// <summary>
        /// 单位编码
        /// </summary>
        [DataMember]
        public string operationMaintenanceUnitCode  { get; set; }

        
        /// <summary>
        /// 单位名称
        /// </summary>
        [DataMember]
        public string operationMaintenanceUnitName { get; set; }


        /// <summary>
        ///  运维人员code
        /// </summary>
        [DataMember]
        public string operationMaintenancePersonCode { get; set; }  
        /// <summary>
        ///  运维人员姓名
        /// </summary>
        [DataMember]
        public string operationMaintenancePersonName { get; set; }

        /// <summary>
        /// 行政区编码
        /// </summary>
        [DataMember]
        public string cantonCode { get; set; }
        /// <summary>
        /// 法人代码
        /// </summary>
        [DataMember]
        public string organizationCode { get; set; }

        /// <summary>
        /// 法人
        /// </summary>
        [DataMember]
        public string legalPerson { get; set; }

        /// <summary>
        /// 联系人
        /// </summary>
        [DataMember]
        public string contactPerson { get; set; }

        /// <summary>
        /// 手机
        /// </summary>
        [DataMember]
        public string mobilePhone { get; set; }

        /// <summary>
        /// 传真
        /// </summary>
        [DataMember]
        public string fax { get; set; }

        /// <summary>
        /// 邮件
        /// </summary>
        [DataMember]
        public string eMail { get; set; }

        /// <summary>
        /// 邮编
        /// </summary>
        [DataMember]
        public string zipCode { get; set; }

        /// <summary>
        /// 地址
        /// </summary>
        [DataMember]
        public string address { get; set; }

        /// <summary>
        /// 备注
        /// </summary>
        [DataMember]
        public string rem { get; set; }

        /// <summary>
        /// 是否停用
        /// </summary>
        [DataMember]
        public int? isDis { get; set; }
    }
}
