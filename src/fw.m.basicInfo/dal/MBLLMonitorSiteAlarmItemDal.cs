using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwDal;
using fw.m.basicInfo.data.entity;

namespace fw.m.basicInfo.dal
{
    public class MBLLMonitorSiteAlarmItemDal
    {

        public static IFWCommand insertMonitorSiteAlarm(BLLMonitorSiteAlarmItem mEntity)
        {
            return FWSqlEntityToFWCommandStaticHelper.insert<BLLMonitorSiteAlarmItem>(mEntity);
        }

        public static IFWCommand updateMonitorSiteAlarm(BLLMonitorSiteAlarmItem mEntity)
        {
            return FWSqlEntityToFWCommandStaticHelper.update<BLLMonitorSiteAlarmItem>(mEntity, "monitorSiteCode='"
                + mEntity.monitorSiteCode + "'", null);
        }

        public static IFWCommand deleteMonitorSiteAlarm(string monitorSiteCode)
        {
            return FWSqlEntityToFWCommandStaticHelper.delete("BLLMonitorSiteAlarmItem", "monitorSiteCode='"
                + monitorSiteCode + "' ", null);
        }
    }
}
