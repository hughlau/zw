using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Web;
using fw.fwData;
using fw.fwSession;
using fw.m.sysBasicManage.data.model;

namespace fw.m.sysBasicManage.data
{
    [ServiceContract]
    public interface ISysBasicManageService
    {

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        FWResult<string> test(string ticket);
         


        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        FWResult<MMobileInfo> queryMobileInfo(string ticket);
    }
}
