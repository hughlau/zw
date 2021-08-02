using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwDal;
using fw.m.operationMaintenance.bll;
using fw.m.operationMaintenance.data.entity;
using fw.m.operationMaintenance.data.model;

namespace fw.m.operationMaintenance.dal
{
    public class OperationMaintenanceTaskDal
    {
        public static IFWCommand insertMaintenanceTask(BLLOperationMaintenanceTask mEntity)
        {
            return FWSqlEntityToFWCommandStaticHelper.insert<BLLOperationMaintenanceTask>(mEntity);
        }

        public static IFWCommand updateMaintenanceTask(BLLOperationMaintenanceTask mEntity)
        {
            return FWSqlEntityToFWCommandStaticHelper.update<BLLOperationMaintenanceTask>(mEntity, "operationMaintenanceTaskCode='"
                + mEntity.operationMaintenanceTaskCode + "'", null);
        }

        public static IFWCommand updateMonitorSiteAlarm(BLLMonitorSiteAlarm mEntity)
        {
            return FWSqlEntityToFWCommandStaticHelper.update<BLLMonitorSiteAlarm>(mEntity, "monitorSiteAlarmCode='"
                + mEntity.monitorSiteAlarmCode + "'", null);
        }

        public static IFWDBResult insertOrUpdateDailyMaintenanceTask(BLLDailyMaintenanceTask entity, IFWTransaction transaction)
        {
          
            if (transaction != null)
            {
                return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<BLLDailyMaintenanceTask>(transaction, entity, new List<string>() { "operationMaintenanceTaskCode" }, null);
            }
            else
            {
                return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<BLLDailyMaintenanceTask>(entity, new List<string>() { "operationMaintenanceTaskCode" }, null);
            }

        }

        public static IFWDBResult insertOrUpdateMaintenanceRecord(BLLOperationMaintenanceRecords entity, IFWTransaction transaction)
        {

            if (transaction != null)
            {
                return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<BLLOperationMaintenanceRecords>(transaction, entity, new List<string>() { "operationMaintenanceRecordCode" }, null);
            }
            else
            {
                return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<BLLOperationMaintenanceRecords>(entity, new List<string>() { "operationMaintenanceRecordCode" }, null);
            }

        }

        public static IFWDBResult insertOrUpdateMaintenanceCleanRecord(BllMonitorSiteCleanRecord entity, IFWTransaction transaction)
        {

            if (transaction != null)
            {
                return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<BllMonitorSiteCleanRecord>(transaction, entity, new List<string>() { "operationCleanRecordCode" }, null);
            }
            else
            {
                return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<BllMonitorSiteCleanRecord>(entity, new List<string>() { "operationCleanRecordCode" }, null);
            }

        }

        public static IFWCommand insertRealTimeDataTimespan(JJMBllRealTimeData mEntity)
        {
            BLLMonitorSiteRealtimeFactorData_timespan model = new BLLMonitorSiteRealtimeFactorData_timespan();
            model.DataListNum = mEntity.dataList == null ? 0 : mEntity.dataList.Count;
            model.StateListNum = mEntity.dataList == null ? 0 : mEntity.dataList.Count;
            model.DataTimespan = mEntity.time;
            return FWSqlEntityToFWCommandStaticHelper.insert<BLLMonitorSiteRealtimeFactorData_timespan>(model);

        }

        /// <summary>
        /// 获取当天所有接受到报文的时间戳
        /// </summary>
        /// <returns></returns>
        public static IList<string> getRealTimeDataTimespanByDay()
        {
            IList<string> lstTimespan = new List<string>();
            string sql =
                "select DataTimespan from BLLMonitorSiteRealtimeFactorData_timespan  WITH(NOLOCK) where DateDiff(dd,CreateTime,getdate())=0";
            FWSqlCommand sqlCmd = new FWSqlCommand { CommandText = sql };
            var dt = FWSqlCommandStaticHelper.ExecuteDataTable(sqlCmd);
            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    lstTimespan.Add(dt.Rows[i].ItemArray[0].ToString());
                }
            }
            return lstTimespan;
        }
    }
}
