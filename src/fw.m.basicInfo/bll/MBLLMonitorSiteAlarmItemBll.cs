using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwDal;
using fw.m.basicInfo.data.model;
using fw.m.sysBasicManage.bll;

namespace fw.m.basicInfo.bll
{
    public class MBLLMonitorSiteAlarmItemBll
    {

        public static List<MMonitorSiteAlarmItem> queryMonitorSiteAlarmItem(string monitorSiteCode)
        {
            List<MMonitorSiteAlarmItem> list = new List<MMonitorSiteAlarmItem>();
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@" SELECT AlarmItem.id,AlarmItem.dataID,AlarmItem.monitorSiteCode
,AlarmItem.alarmTypeCode,alarmType.name alarmTypeName,AlarmItem.ix
 FROM BLLMonitorSiteAlarmItem alarmItem WITH(NOLOCK)
 LEFT JOIN dbo.FWDictionary alarmType WITH(NOLOCK) ON alarmItem.alarmTypeCode=alarmType.code AND alarmType.dictionaryTypeCode='{0}'
where 1=1 
", DictionaryTypeCodeSettings.BLLFaultType);
            if (!string.IsNullOrEmpty(monitorSiteCode))
            {
                sbSql.AppendFormat(@" AND alarmItem.monitorSiteCode=@monitorSiteCode");
                sqlCmd.Parameters.AddWithValue("@monitorSiteCode", monitorSiteCode);
            }
            sqlCmd.CommandText = sbSql.ToString();
            list = FWSqlEntityToFWCommandStaticHelper.queryList<MMonitorSiteAlarmItem>(sqlCmd);
            return list;
        }



    }
}
