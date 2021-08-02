using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwDal;
using fw.m.basicInfo.data.entity;

namespace fw.m.basicInfo.dal
{
    public class MBLLMonitorSiteDal
    {
        public static IFWCommand insertMonitorSite(BLLMonitorSite mEntity)
        {
            return FWSqlEntityToFWCommandStaticHelper.insert<BLLMonitorSite>(mEntity);
        }

        public static IFWCommand updateMonitorSite(BLLMonitorSite mEntity)
        {
            return FWSqlEntityToFWCommandStaticHelper.update<BLLMonitorSite>(mEntity, "monitorSiteCode='" 
                + mEntity.monitorSiteCode + "'", null);
        }

        public static IFWDBResult inserOrUpdateMonitorSiteBySiteCode(BLLMonitorSite entity, IFWTransaction transaction)
        {
            if (transaction != null)
            {
                return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<BLLMonitorSite>(transaction, entity, new List<string>() { "monitorSiteCode" }, null);
            }
            else
            {
                return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<BLLMonitorSite>(entity, new List<string>() { "monitorSiteCode" }, null);
            }
        }

        public static IFWDBResult inserOrUpdateMonitorSiteByName(BLLMonitorSite entity, IFWTransaction transaction)
        {
            if (transaction != null)
            {
                return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<BLLMonitorSite>(transaction, entity, new List<string>() { "monitorSiteName" }, null);
            }
            else
            {
                return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<BLLMonitorSite>(entity, new List<string>() { "monitorSiteName" }, null);
            }
        }

 
         public static IFWCommand inserDATRealTime(T_DAT_RealTime entity)
        {
            return FWSqlEntityToFWCommandStaticHelper.insert<T_DAT_RealTime>(entity);
        }

    }
}
