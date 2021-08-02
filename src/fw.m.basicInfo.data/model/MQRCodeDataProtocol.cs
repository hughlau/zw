using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using fw.fwDal;

namespace fw.m.basicInfo.data.model
{
    /// <summary>
    /// 二维码内容协议
    /// </summary>
    [DataContract]
    public class MQRCodeDataProtocol : FWEntityObject
    {
        /// <summary>
        /// infoProtocol
        /// </summary>
        [DataMember]
        public string p { get; set; }

        /// <summary>
        /// infoData
        /// </summary>
        [DataMember]
        public object d { get; set; }
    }
}
