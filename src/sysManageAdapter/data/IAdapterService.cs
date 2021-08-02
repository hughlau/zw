using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Web;
using fw.fwData;
using fw.fwSession;

namespace fw.m.sysManageAdapter.data
{
    [ServiceContract]
    public interface IAdapterService
    {
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        fw.fwData.FWResult<FWDataTable> getTree(string ticket, string pCode);
    }
}
