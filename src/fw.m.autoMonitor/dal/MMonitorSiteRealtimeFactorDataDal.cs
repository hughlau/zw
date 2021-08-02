using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwDal;
using fw.m.autoMonitor.data.entity;

namespace fw.m.autoMonitor.dal
{
    public class MMonitorSiteRealtimeFactorDataDal
    {
        public static IFWCommand insertRealtimeFactorData(BLLMonitorSiteRealtimeFactorData mEntity)
        {
            return FWSqlEntityToFWCommandStaticHelper.insert<BLLMonitorSiteRealtimeFactorData>(mEntity);
        }

        public static IFWCommand updateRealtimeFactorData(BLLMonitorSiteRealtimeFactorData mEntity)
        {
            return FWSqlEntityToFWCommandStaticHelper.update<BLLMonitorSiteRealtimeFactorData>(mEntity, "monitorSiteCode='"
                + mEntity.monitorSiteCode + "' AND monitorFactorCode='" + mEntity.monitorFactorCode + "' AND monitorTime='" + mEntity.monitorTime + "'", null);
        }
    }
}
