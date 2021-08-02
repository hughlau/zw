using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwDal;
using fw.m.operationMaintenance.data.entity;

namespace fw.m.operationMaintenance.dal
{
    public class OperationMaintenancePersonMappingMonitorSiteDal
    {

        #region 人员分配点位

        public static IFWCommand deleteOperationMaintenancePersonMappingMonitorSiteByMonitorSiteCode(List<string> monitorSiteCodeCodeList)
        {
            return FWSqlEntityToFWCommandStaticHelper.delete<BLLOperationMaintenancePersonMappingMonitorSite>("monitorSiteCode in (" + FWSqlCommandStaticHelper.joinToSqlString<string>(monitorSiteCodeCodeList) + ")", null);
        }

        public static IFWCommand insertOperationMaintenancePersonMappingMonitorSite(BLLOperationMaintenancePersonMappingMonitorSite entity)
        {
            return FWSqlEntityToFWCommandStaticHelper.insert<BLLOperationMaintenancePersonMappingMonitorSite>(entity);
        }
        #endregion
    }
}
