using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.m.basicInfo.data.entity;
using fw.fwDal;
using fw.m.sysBasicManage.bll;

namespace fw.m.basicInfo.dal
{
    public class MBLLMonitorSiteMonitorFactorDal
    {
        public static IFWCommand insertMonitorSiteFactor(BLLMonitorSiteMonitorFactor mEntity)
        {
            return FWSqlEntityToFWCommandStaticHelper.insert<BLLMonitorSiteMonitorFactor>(mEntity);
        }


        public static IFWCommand updateMonitorSiteFactor(BLLMonitorSiteMonitorFactor mEntity)
        {
            return FWSqlEntityToFWCommandStaticHelper.update<BLLMonitorSiteMonitorFactor>(mEntity, "monitorSiteCode='"
                + mEntity.monitorSiteCode + "' AND  monitorFactorCode='"
                + mEntity.monitorFactorCode + "' and equipmentCode = '" + mEntity.equipmentCode + "'", null);
        }

        public static IFWCommand queryMonitorSiteFactor(string monitorSiteCode, string monitorFactorCode)
        {
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
//            sbSql.AppendFormat(@"SELECT monitorFactor.id,monitorFactor.dataID,monitorFactor.monitorSiteCode
//,monitorFactor.monitorFactorCode,allYZ.name monitorFactorName
//,monitorFactor.standardUpperLimit,monitorFactor.standardLowerLimit
//,monitorFactor.rem,monitorFactor.ix ,monitorFactor.isDis,monitorFactor.createrID
//,monitorFactor.createTime,monitorFactor.updaterID,monitorFactor.updateTime
//,monitorFactor.[channelNo]
//,monitorFactor.[isSwitch] 
//,monitorFactor.[alarmUpperLimit]
//,monitorFactor.[alarmLowerLimit]
//FROM dbo.BLLMonitorSiteMonitorFactor monitorFactor
//INNER JOIN dbo.FWDictionary allYZ ON monitorFactor.monitorFactorCode=allYZ.code and allYZ.dictionaryTypeCode='{0}'
//WHERE 1=1 and isnull(monitorFactor.isDis,0)=0 ", DictionaryTypeCodeSettings.BLLMonitorFactor);
            sbSql.AppendFormat(@"SELECT distinct monitorFactor.monitorSiteCode
,monitorFactor.monitorFactorCode,allYZ.name monitorFactorName
,monitorFactor.standardUpperLimit,monitorFactor.standardLowerLimit
,monitorFactor.rem,monitorFactor.ix ,monitorFactor.isDis,monitorFactor.createrID
,monitorFactor.updaterID
,monitorFactor.[channelNo]
,monitorFactor.[isSwitch] 
,monitorFactor.[alarmUpperLimit]
,monitorFactor.[alarmLowerLimit]
,monitorFactor.equipmentCode
FROM dbo.BLLMonitorSiteMonitorFactor monitorFactor
INNER JOIN dbo.FWDictionary allYZ ON monitorFactor.monitorFactorCode=allYZ.code and allYZ.dictionaryTypeCode='{0}'
WHERE 1=1 and isnull(monitorFactor.isDis,0)=0 ", DictionaryTypeCodeSettings.BLLMonitorFactor);
            if (!string.IsNullOrEmpty(monitorSiteCode))
            {
                sbSql.AppendFormat(@" AND monitorFactor.monitorSiteCode=@monitorSiteCode");
                sqlCmd.Parameters.AddWithValue("@monitorSiteCode", monitorSiteCode);
            }
            if (!string.IsNullOrEmpty(monitorFactorCode))
            {
                sbSql.AppendFormat(@" AND monitorFactor.monitorFactorCode=@monitorFactorCode");
                sqlCmd.Parameters.AddWithValue("@monitorFactorCode", monitorFactorCode);
            }
            sqlCmd.CommandText = sbSql.ToString();
            return sqlCmd;
        }

        public static IFWCommand insertBLLMonitorSiteHisFactorData(BLLMonitorSiteHisFactorData entity)
        {
            return FWSqlEntityToFWCommandStaticHelper.insert<BLLMonitorSiteHisFactorData>(entity);
        }

        public static IFWCommand updateBasMonitorSiteFactor(T_Bas_MonitorSiteMonitorFactor entity)
        {
            return FWSqlEntityToFWCommandStaticHelper.update<T_Bas_MonitorSiteMonitorFactor>(entity, "monitorSiteCode='"
                + entity.monitorSiteCode + "' AND  monitorFactorCode='"
                + entity.monitorFactorCode  + "'", null);
        }

        /// <summary>
        /// 清除净化槽/设备/因子的关联
        /// </summary>
        /// <param name="monitorSiteCode"></param>
        /// <param name="factorCodeList"></param>
        /// <returns></returns>
        public static IFWCommand clearSiteFactorRelation(string monitorSiteCode, List<string> factorCodeList)
        {
            FWSqlCommand sqlCmd_del = new FWSqlCommand();
            sqlCmd_del.CommandText = string.Format(@"
DELETE dbo.T_Bas_MonitorSiteMonitorFactor WHERE monitorSiteCode='{0}'  AND  [monitorFactorCode]  IN ({1});
DELETE dbo.BLLMonitorSiteRealtimeFactorData WHERE monitorSiteCode='{0}'  AND  [monitorFactorCode]  IN ({1});
DELETE dbo.BLLMonitorSiteMonitorFactor WHERE monitorSiteCode='{0}'  AND  [monitorFactorCode]  IN ({1}); ", FWSqlCommandStaticHelper.checkParam(monitorSiteCode), FWSqlCommandStaticHelper.joinToSqlString(factorCodeList));
            return sqlCmd_del;
        }

       

        public static IFWDBResult insertUpdateBasMonitorSiteMonitorFactor(T_Bas_MonitorSiteMonitorFactor entity, IFWTransaction transaction)
        {
            if (transaction != null)
            {
                return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<T_Bas_MonitorSiteMonitorFactor>(transaction, entity, new List<string>() { "monitorSiteCode", "monitorFactorCode" }, null);
            }
            else
            {
                return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<T_Bas_MonitorSiteMonitorFactor>(entity, new List<string>() { "monitorSiteCode", "monitorFactorCode" }, null);
            }
        }

    }
}
