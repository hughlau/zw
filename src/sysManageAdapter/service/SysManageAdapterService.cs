using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.m.sysManage.data;
using fw.fwData;
using fw.m.sysManage.bll;
using fw.m.sysManage.data.entity;
using fw.fwDal;
using fw.m.sysManage.aop;
using fw.m.sysManage.data.model;
using fw.m.sysManageAdapter.data;
using System.ServiceModel.Activation;
using System.ServiceModel;

using fw.fwSession;
using fw.m.sysManage.service;
using fw.m.sysBasicManage.data;
using fw.m.sysBasicManage.service;
using fw.m.sysManageAdapter.bll;

namespace fw.m.sysManageAdapter.service
{
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.PerCall, ConcurrencyMode = ConcurrencyMode.Multiple)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    [FWContextAttribute]
    public class SysManageAdapterService : FWContextBoundObject, IAdapterService
    {
        public FWResult<FWDataTable> getTree(string ticket, string pCode)
        {
            return SysManageAdapterBll.getTree(userInfo, pCode);
        }
    }
}
