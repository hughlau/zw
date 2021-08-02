using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwData;
using fw.m.Common;
using fw.m.autoMonitor.data.model;
using fw.fwSession;
using fw.m.autoMonitor.data;
using fw.m.sysBasicManage.bll;
using fw.m.sysBasicManage.data;
using fw.fwDal;
using System.Data;
using fw.m.autoMonitor.data.entity;
using fw.m.autoMonitor.dal;
using fw.m.sysBasicManage.service;

namespace fw.m.autoMonitor.bll
{
    public class MonitorSiteRealtimeBll
    {
        public static FWResult<FWPageData<MMonitorSiteFactor_Realtime>> queryPageFactor_Realtime(IFWUserInfo userInfo, FWPageParams pageParams, QueryAutoMonitorParams queryParams)
        {
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            SysBasicManageService service = new SysBasicManageService();

            List<string> cantonCodeList = new List<string>();
            if (!string.IsNullOrEmpty(queryParams.cantonCode))
            {
                cantonCodeList.Add(queryParams.cantonCode);
            }
            if (basicUserInfo.cantonCodeList != null && basicUserInfo.cantonCodeList.Count > 0)
            {
                queryParams.cantonCodeList = service.specialCantonCodeConvert(basicUserInfo.cantonCodeList,
                   cantonCodeList, userInfo.userID);
            }

            FWResult<FWPageData<MMonitorSiteFactor_Realtime>> result = new FWResult<FWPageData<MMonitorSiteFactor_Realtime>>();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            StringBuilder sqlbuilder = new StringBuilder();
            sqlbuilder.AppendFormat(@"SELECT FactorData.id,FactorData.monitorSiteCode,monitorSite.monitorSiteName
,FactorData.monitorFactorCode,dicFactor.name monitorFactorName
,FactorData.monitorTime,FactorData.monitorValue,FactorData.dataSource,dicSource.name dataSourceName
,FactorData.dataState,dicState.name dataStateName
FROM dbo.BLLMonitorSiteRealtimeFactorData FactorData  WITH(NOLOCK)
INNER JOIN dbo.BLLMonitorSite monitorSite WITH(NOLOCK) ON monitorSite.monitorSiteCode = FactorData.monitorSiteCode
INNER JOIN dbo.BLLMonitorSiteMonitorFactor MonitorFactor WITH(NOLOCK) ON MonitorFactor.monitorSiteCode = FactorData.monitorSiteCode
 AND FactorData.monitorFactorCode = MonitorFactor.monitorFactorCode
LEFT JOIN dbo.FWDictionary dicFactor WITH(NOLOCK) ON FactorData.monitorFactorCode=dicFactor.code AND dicFactor.pCode='BLLMonitorFactor'
LEFT JOIN dbo.FWDictionary dicState WITH(NOLOCK) ON FactorData.dataState=dicState.code AND dicState.pCode='631'
LEFT JOIN dbo.FWDictionary dicSource WITH(NOLOCK) ON FactorData.dataSource=dicSource.code AND dicSource.pCode='632'
WHERE ISNULL(monitorSite.isDis,0)=0  AND ISNULL(MonitorFactor.isDis,0)=0
");

            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.monitorSiteCode))
                {
                    sqlbuilder.AppendFormat(@" AND FactorData.monitorSiteCode='{0}'", queryParams.monitorSiteCode);
                }
                if (!string.IsNullOrEmpty(queryParams.monitorFactorCode))
                {
                    sqlbuilder.AppendFormat(@" AND monitorSite.monitorFactorCode='{0}'", queryParams.monitorFactorCode);
                }
                if (queryParams.dStart.HasValue)
                {
                    sqlbuilder.AppendFormat(@" AND FactorData.monitorTime>='{0}'", queryParams.dStart);
                }
                if (queryParams.dEnd.HasValue)
                {
                    sqlbuilder.AppendFormat(@" AND FactorData.monitorTime<='{0}'", queryParams.dEnd);
                }
                //if (queryParams.cantonCodeList != null && queryParams.cantonCodeList.Count > 0)
                //{
                //    sqlbuilder.AppendFormat(@" AND monitorSite.cantonCode in({0})", FWSqlCommandStaticHelper.joinToSqlString(queryParams.cantonCodeList));
                //}
            }

            //Roger 2016/6/1 13:00:02 增加管辖区域
            sqlbuilder.AppendFormat(@" AND ({0})  ", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", basicUserInfo.cantonCodeList));

            sqlbuilder.Append(@" order by ");
            if (pageParams.sortFieldList != null && pageParams.sortFieldList.Count > 0)
            {
                foreach (FWSortField fwSortField in pageParams.sortFieldList)
                {
                    switch (fwSortField.fieldName)
                    {
                        case "monitorTime":
                            fwSortField.fieldName = "FactorData.monitorTime";
                            break;
                        case "monitorSiteName":
                            fwSortField.fieldName = "FactorData.monitorSiteCode";
                            break;
                        case "monitorFactorName":
                            fwSortField.fieldName = "FactorData.monitorFactorCode";
                            break;
                    }
                    sqlbuilder.AppendFormat(@"{0} {1},", fwSortField.fieldName,
                        fwSortField.sortType == FWSortType.Desc ? "desc" : "asc");
                }
                sqlbuilder.Remove(sqlbuilder.Length - 1, 1);
            }
            else
            {
                sqlbuilder.AppendFormat(" FactorData.monitorSiteCode,FactorData.monitorFactorCode,FactorData.monitorTime");
            }
            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MMonitorSiteFactor_Realtime>(fwPageProcedureParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询监测点列表出错。错误在：【queryPageFactor_Realtime】" + ex.Message.ToString());
            }
            return result;
        }

        public static FWResult<bool> insertOrUpdateMonitorSiteFactor_Realtime(IFWUserInfo userInfo, List<MMonitorSiteFactor_Realtime> mEntityList)
        {
            FWResult<bool> result = new FWResult<bool>();
            List<IFWCommand> BaseCommandList = new List<IFWCommand>();

            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            fwSqlTransaction.BeginTransaction();

            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            if (mEntityList != null && mEntityList.Count > 0)
            {
                foreach (MMonitorSiteFactor_Realtime mEntity in mEntityList)
                {

                    BLLMonitorSiteRealtimeFactorData _Entity = AutoMonitorBll.convertEntity<BLLMonitorSiteRealtimeFactorData>(mEntity);
                    _Entity.createrID = userInfo.userID;
                    _Entity.createTime = DateTime.Now;
                    _Entity.updaterID = _Entity.createrID;
                    _Entity.updateTime = _Entity.createTime;

                    _Entity.createTime = DateTime.Now;
                    sbSql.AppendFormat(@"SELECT * FROM dbo.BLLMonitorSiteRealtimeFactorData FactorData
WHERE FactorData.monitorSiteCode=@monitorSiteCode AND FactorData.monitorFactorCode=@monitorFactorCode
AND FactorData.monitorTime=@monitorTime");
                    sqlCmd.Parameters.AddWithValue("@monitorSiteCode", mEntity.monitorSiteCode);
                    sqlCmd.Parameters.AddWithValue("@monitorFactorCode", mEntity.monitorFactorCode);
                    sqlCmd.Parameters.AddWithValue("@monitorTime", mEntity.monitorTime);
                    sqlCmd.CommandText = sbSql.ToString();
                    DataTable dt = FWSqlCommandStaticHelper.ExecuteDataTable(fwSqlTransaction, sqlCmd);
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        BaseCommandList.Add(MMonitorSiteRealtimeFactorDataDal.updateRealtimeFactorData(_Entity));
                    }
                    else
                    {
                        BaseCommandList.Add(MMonitorSiteRealtimeFactorDataDal.insertRealtimeFactorData(_Entity));
                    }
                    sbSql = new StringBuilder();
                    sqlCmd = new FWSqlCommand();
                }
            }
            try
            {
                result.data = FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, BaseCommandList);
                result.status = FWResultStatus.Success;
                fwSqlTransaction.Commit();
            }
            catch
            {
                result.infoList.Add("操作失败。错误在【insertOrUpdateMonitorSiteFactor_Realtime】");
                result.status = FWResultStatus.Failure;
                fwSqlTransaction.Rollback();
                fwSqlTransaction.Close();
                return result;
            }
            return result;
        }

        public static FWResult<FWPageData<MMonitorSiteFactor_Realtime>> queryPageFactorHisData (IFWUserInfo userInfo, FWPageParams pageParams, QueryAutoMonitorParams queryParams)
        {
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            SysBasicManageService service = new SysBasicManageService();

            List<string> cantonCodeList = new List<string>();
            if (!string.IsNullOrEmpty(queryParams.cantonCode))
            {
                cantonCodeList.Add(queryParams.cantonCode);
            }
            if (basicUserInfo.cantonCodeList != null && basicUserInfo.cantonCodeList.Count > 0)
            {
                queryParams.cantonCodeList = service.specialCantonCodeConvert(basicUserInfo.cantonCodeList,
                   cantonCodeList, userInfo.userID);
            }

            FWResult<FWPageData<MMonitorSiteFactor_Realtime>> result = new FWResult<FWPageData<MMonitorSiteFactor_Realtime>>();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            StringBuilder sqlbuilder = new StringBuilder();
            sqlbuilder.AppendFormat(@"SELECT FactorData.id,FactorData.monitorSiteCode,monitorSite.monitorSiteName
,FactorData.monitorFactorCode,dicFactor.name monitorFactorName
,FactorData.monitorTime,FactorData.monitorValue,FactorData.dataSource,dicSource.name dataSourceName
,FactorData.dataState,dicState.name dataStateName
,eq.[equipmentNo],eq.[equipmentCode]
FROM dbo.BLLMonitorSiteHisFactorData FactorData  WITH(NOLOCK)
INNER JOIN dbo.BLLMonitorSite monitorSite WITH(NOLOCK) ON monitorSite.monitorSiteCode = FactorData.monitorSiteCode
INNER JOIN [dbo].[BLLEquipment] eq WITH(NOLOCK) ON FactorData.[equipmentCode] = eq.[equipmentCode] 
INNER JOIN dbo.BLLMonitorSiteMonitorFactor MonitorFactor WITH(NOLOCK) ON MonitorFactor.monitorSiteCode = FactorData.monitorSiteCode AND FactorData.monitorFactorCode = MonitorFactor.monitorFactorCode
LEFT JOIN dbo.FWDictionary dicFactor WITH(NOLOCK) ON FactorData.monitorFactorCode=dicFactor.code AND dicFactor.pCode='BLLMonitorFactor'
LEFT JOIN dbo.FWDictionary dicState WITH(NOLOCK) ON cast(FactorData.dataState as varchar(36))=dicState.code AND dicState.pCode='631'
LEFT JOIN dbo.FWDictionary dicSource WITH(NOLOCK) ON cast(FactorData.dataSource as varchar(36))=dicSource.code AND dicSource.pCode='632'
WHERE  ISNULL(monitorSite.isDis,0)=0  AND ISNULL(MonitorFactor.isDis,0)=0 and eq.moduleTypeCode= '1'
");

            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.monitorSiteCode))
                {
                    sqlbuilder.AppendFormat(@" AND FactorData.monitorSiteCode='{0}'", queryParams.monitorSiteCode);
                }
                if (!string.IsNullOrEmpty(queryParams.monitorFactorCode))
                {
                    sqlbuilder.AppendFormat(@" AND FactorData.monitorFactorCode='{0}'", queryParams.monitorFactorCode);
                }

                if (queryParams.dStart.HasValue)
                {
                    sqlbuilder.AppendFormat(@" and FactorData.monitorTime>'{0}'", queryParams.dStart.Value);
                    //sqlbuilder.AppendFormat(@" AND datediff(day,'{0}',FactorData.monitorTime)>=0  ", queryParams.dStart.Value);
                }
                if (queryParams.dEnd.HasValue)
                {
                    sqlbuilder.AppendFormat(@" and FactorData.monitorTime<'{0}'", queryParams.dEnd.Value.AddDays(1));
                    //sqlbuilder.AppendFormat(@" AND   datediff(day,FactorData.monitorTime,'{0}')>=0   ", queryParams.dEnd.Value);
                } 
                //if (queryParams.cantonCodeList != null && queryParams.cantonCodeList.Count > 0)
                //{
                //    sqlbuilder.AppendFormat(@" AND monitorSite.cantonCode in({0})", FWSqlCommandStaticHelper.joinToSqlString(queryParams.cantonCodeList));
                //}
                if (queryParams.dataSource.HasValue)
                {
                    sqlbuilder.AppendFormat(@" AND FactorData.dataSource ={0} ", queryParams.dataSource.Value);
                }
            }

            //Roger 2016/6/1 13:00:02 增加管辖区域
            sqlbuilder.AppendFormat(@" AND ({0})  ", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", basicUserInfo.cantonCodeList));

            sqlbuilder.Append(@" order by ");
            if (pageParams.sortFieldList != null && pageParams.sortFieldList.Count > 0)
            {
                foreach (FWSortField fwSortField in pageParams.sortFieldList)
                {
                    switch (fwSortField.fieldName)
                    {
                        case "monitorTime":
                            fwSortField.fieldName = "FactorData.monitorTime";
                            break;
                        case "monitorSiteName":
                            fwSortField.fieldName = "FactorData.monitorSiteCode";
                            break;
                        case "monitorFactorName":
                            fwSortField.fieldName = "FactorData.monitorFactorCode";
                            break;
                    }
                    sqlbuilder.AppendFormat(@"{0} {1},", fwSortField.fieldName,
                        fwSortField.sortType == FWSortType.Desc ? "desc" : "asc");
                }
                sqlbuilder.Remove(sqlbuilder.Length - 1, 1);
            }
            else
            {
                sqlbuilder.AppendFormat(" FactorData.monitorTime DESC ,FactorData.monitorSiteCode,FactorData.monitorFactorCode");
            }
            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MMonitorSiteFactor_Realtime>(fwPageProcedureParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询监测点列表出错。错误在：【queryPageFactor_Realtime】" + ex.Message.ToString());
            }
            return result;
        }
        public static FWResult<FWPageData<MMonitorSiteFactor_Realtime>> queryMonitorWaterPumpStatus(IFWUserInfo userInfo, FWPageParams pageParams, QueryAutoMonitorParams queryParams)
        {
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            SysBasicManageService service = new SysBasicManageService();

            bool isOperationPerson = !string.IsNullOrEmpty(basicUserInfo.operationMaintenancePersonCode);

            FWResult<FWPageData<MMonitorSiteFactor_Realtime>> result = new FWResult<FWPageData<MMonitorSiteFactor_Realtime>>();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            StringBuilder sqlbuilder = new StringBuilder();

            sqlbuilder.AppendFormat(@"select * from (
SELECT distinct monitorSite.monitorSiteCode
,monitorSite.cantonCode
,dicState.fullName cantonName
,monitorSite.monitorSiteName
,eq.equipmentNo,
monitorSite.householdName
,dicSource.name equipmentTypeName
,case FactorData.waterPumpAlarm when 0 then '正常' when 9 then '通讯故障' when 1 then '报警' end waterPumpState
,case FactorData.windPumpAlarm when 0 then '正常' when 1 then '报警' when 9 then '通讯故障' end windPumpState
,case FactorData.drugAlarm when 0 then '正常' when 1 then '报警' ELSE '无' end drugState
,case FactorData.drugPumpAlarm when 0 then '正常' when 1 then '异常' ELSE '无' end drugPumpState
,case FactorData.waterLowLine when 1 then '是' else '否' end waterLowState 
, case FactorData.waterHighLine when 1 then '是' else '否' end waterHighState,FactorData.monitorTime
,dicMonitorSiteType.name monitorSiteTypeName
,case waterPumpAlarm when 1 then op.faultTimeInterval else null end faultTimeInterval 
,case waterPumpAlarm when 1 then op.faultTimeTotal else null end faultTimeTotal
FROM dbo.BLLMonitorSiteByWaterpumpData FactorData  WITH(NOLOCK)
INNER JOIN dbo.BLLMonitorSite monitorSite WITH(NOLOCK) ON monitorSite.monitorSiteCode = FactorData.monitorSiteCode
INNER JOIN [dbo].[BLLEquipment] eq WITH(NOLOCK) ON FactorData.[equipmentCode] = eq.[equipmentCode] and eq.moduleTypeCode= '1'
left join [dbo].[BLLOperationMaintenanceTask] op on FactorData.monitorSiteCode=op.monitorSiteCode and (issolve is null or issolve=0)
LEFT JOIN dbo.FWDictionary dicFactor WITH(NOLOCK) ON FactorData.monitorFactorCode=dicFactor.code AND dicFactor.pCode='BLLMonitorFactor'
LEFT JOIN dbo.FWDictionary dicState WITH(NOLOCK) ON monitorSite.cantonCode=dicState.code
LEFT JOIN dbo.FWDictionary dicSource WITH(NOLOCK) ON eq.equipmentTypeCode=dicSource.code AND dicSource.pCode='BLL_EquipmentType'
LEFT JOIN dbo.FWDictionary dicMonitorSiteType WITH(NOLOCK) ON monitorSite.monitorSiteTypeCode=dicMonitorSiteType.code AND dicMonitorSiteType.pCode='BLL_SiteType' ");
            if (isOperationPerson)
            {
                sqlbuilder.AppendFormat(@" inner join [dbo].[BLLOperationMaintenancePersonMappingMonitorSite] MPM WITH(NOLOCK) on monitorSite.monitorSiteCode=MPM.monitorSiteCode
and MPM.operationMaintenancePersonCode='{0}' ", basicUserInfo.operationMaintenancePersonCode);
            }

            sqlbuilder.AppendFormat(@" WHERE ISNULL(monitorSite.isDis,0)=0  and ISNULL(monitorSite.isDel,0)=0 ");

            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.keyword))
                {
                    sqlbuilder.AppendFormat(@" AND (monitorSite.monitorSiteName like'%{0}%' or eq.equipmentNo like '%{0}%' or dicState.fullName like '%{0}%' 
or  monitorSite.householdName like'{0}%'  )", queryParams.keyword);
                }
                if (!string.IsNullOrEmpty(queryParams.statusCode))
                {
                    sqlbuilder.AppendFormat(@" AND FactorData.waterPumpAlarm='{0}'", queryParams.statusCode);
                }
                if (!string.IsNullOrEmpty(queryParams.windstatusCode))
                {
                    sqlbuilder.AppendFormat(@" AND FactorData.windPumpAlarm='{0}'", queryParams.windstatusCode);
                }
                if (!string.IsNullOrEmpty(queryParams.projectNo))
                {
                    sqlbuilder.AppendFormat(@" and monitorSite.projectNo= '{0}'",
                        FWSqlCommandStaticHelper.checkParam(queryParams.projectNo));
                }

                if (!string.IsNullOrEmpty(queryParams.cantonCode))
                {
                    sqlbuilder.AppendFormat(@" AND monitorSite.cantonCode like'{0}%'",
                        FWSqlCommandStaticHelper.checkParam(queryParams.cantonCode));
                }
       
                
            }

            //Roger 2016/6/1 13:00:02 增加管辖区域
            sqlbuilder.AppendFormat(@" AND ({0}) ) temp ", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", basicUserInfo.cantonCodeList));

            sqlbuilder.Append(@" order by ");
            if (pageParams.sortFieldList != null && pageParams.sortFieldList.Count > 0)
            {
                foreach (FWSortField fwSortField in pageParams.sortFieldList)
                {
                    switch (fwSortField.fieldName)
                    {
                        case "monitorTime":
                            fwSortField.fieldName = "monitorTime";
                            break;
                        case "monitorSiteName":
                            fwSortField.fieldName = "monitorSiteCode";
                            break;
                        case "monitorSiteTypeName":
                            fwSortField.fieldName = "monitorSiteTypeName";
                            break;
                        case "equipmentTypeName":
                            fwSortField.fieldName = "equipmentTypeName";
                            break;                                      

                    }
                    sqlbuilder.AppendFormat(@"{0} {1},", fwSortField.fieldName,
                        fwSortField.sortType == FWSortType.Desc ? "desc" : "asc");
                }
                sqlbuilder.Remove(sqlbuilder.Length - 1, 1);
            }
            else
            {
                sqlbuilder.AppendFormat(" cantonName ");
            }
            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MMonitorSiteFactor_Realtime>(fwPageProcedureParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询监测点列表出错。错误在：【queryMonitorWaterPumpStatus】" + ex.Message.ToString());
            }
            return result;
        }

        public static FWResult<FWPageData<MMonitorSiteFactor_Realtime>> queryMonitorWaterPumpHisStatus(IFWUserInfo userInfo, FWPageParams pageParams, QueryAutoMonitorParams queryParams)
        {
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            SysBasicManageService service = new SysBasicManageService();

            List<string> cantonCodeList = new List<string>();
            //if (!string.IsNullOrEmpty(queryParams.cantonCode))
            //{
            //    cantonCodeList.Add(queryParams.cantonCode);
            //}
            //if (basicUserInfo.cantonCodeList != null && basicUserInfo.cantonCodeList.Count > 0)
            //{
            //    queryParams.cantonCodeList = service.specialCantonCodeConvert(basicUserInfo.cantonCodeList,
            //       cantonCodeList, userInfo.userID);
            //}

            FWResult<FWPageData<MMonitorSiteFactor_Realtime>> result = new FWResult<FWPageData<MMonitorSiteFactor_Realtime>>();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            StringBuilder sqlbuilder = new StringBuilder();
            sqlbuilder.AppendFormat(@"SELECT monitorSite.monitorSiteCode,dicState.fullName cantonName,monitorSite.monitorSiteName,eq.equipmentNo,
monitorSite.householdName,dicSource.name monitorSiteTypeName,case FactorData.waterPumpAlarm when 0 then '正常' else '报警' end waterPumpState,
case FactorData.waterLowLine when 1 then '是' else '否' end waterLowState , case FactorData.waterHighLine when 1 then '是' else '否' end waterHighState,FactorData.monitorTime
FROM dbo.[BLLMonitorSiteByWaterpumpHisData] FactorData  WITH(NOLOCK)
INNER JOIN dbo.BLLMonitorSite monitorSite WITH(NOLOCK) ON monitorSite.monitorSiteCode = FactorData.monitorSiteCode
INNER JOIN [dbo].[BLLEquipment] eq WITH(NOLOCK) ON FactorData.[equipmentCode] = eq.[equipmentCode] 
--INNER JOIN dbo.BLLMonitorSiteMonitorFactor MonitorFactor WITH(NOLOCK) ON MonitorFactor.monitorSiteCode = FactorData.monitorSiteCode 
--AND FactorData.monitorFactorCode = MonitorFactor.monitorFactorCode
LEFT JOIN dbo.FWDictionary dicFactor WITH(NOLOCK) ON FactorData.monitorFactorCode=dicFactor.code AND dicFactor.pCode='BLLMonitorFactor'
LEFT JOIN dbo.FWDictionary dicState WITH(NOLOCK) ON monitorSite.cantonCode=dicState.code
LEFT JOIN dbo.FWDictionary dicSource WITH(NOLOCK) ON eq.equipmentTypeCode=dicSource.code AND dicSource.pCode='BLL_EquipmentType'
WHERE ISNULL(monitorSite.isDis,0)=0  
--AND ISNULL(MonitorFactor.isDis,0)=0 
and   eq.moduleTypeCode= '1'
");

            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.equipmentKeyword))
                {
                    sqlbuilder.AppendFormat(@" AND (monitorSite.monitorSiteName like'%{0}%' or eq.equipmentNo like '%{0}%' or dicState.fullName like '%{0}%' 
or  monitorSite.householdName like'{0}%'  )", queryParams.equipmentKeyword);
                }
                if (!string.IsNullOrEmpty(queryParams.monitorSiteCode))
                {
                    sqlbuilder.AppendFormat(@" AND monitorSite.monitorSiteCode ='{0}'", queryParams.monitorSiteCode);
                }
                if (!string.IsNullOrEmpty(queryParams.statusCode))
                {
                    sqlbuilder.AppendFormat(@" AND FactorData.waterPumpAlarm='{0}'", queryParams.statusCode);
                }

                if (queryParams.dStart.HasValue)
                {
                    sqlbuilder.AppendFormat(@" AND datediff(day,'{0}',FactorData.monitorTime)>=0  ", queryParams.dStart.Value);
                }
                if (queryParams.dEnd.HasValue)
                {
                    sqlbuilder.AppendFormat(@" AND   datediff(day,FactorData.monitorTime,'{0}')>=0   ", queryParams.dEnd.Value);
                } 
                //if (queryParams.cantonCodeList != null && queryParams.cantonCodeList.Count > 0)
                //{
                //    sqlbuilder.AppendFormat(@" AND monitorSite.cantonCode in({0})", FWSqlCommandStaticHelper.joinToSqlString(queryParams.cantonCodeList));
                //}

            }

            //Roger 2016/6/1 13:00:02 增加管辖区域
            sqlbuilder.AppendFormat(@" AND ({0})  ", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", basicUserInfo.cantonCodeList));

            sqlbuilder.Append(@" order by ");
            if (pageParams.sortFieldList != null && pageParams.sortFieldList.Count > 0)
            {
                foreach (FWSortField fwSortField in pageParams.sortFieldList)
                {
                    switch (fwSortField.fieldName)
                    {
                        case "monitorTime":
                            fwSortField.fieldName = "FactorData.monitorTime";
                            break;
                        case "monitorSiteName":
                            fwSortField.fieldName = "FactorData.monitorSiteCode";
                            break;
                        case "monitorFactorName":
                            fwSortField.fieldName = "FactorData.monitorFactorCode";
                            break;
                    }
                    sqlbuilder.AppendFormat(@"{0} {1},", fwSortField.fieldName,
                        fwSortField.sortType == FWSortType.Desc ? "desc" : "asc");
                }
                sqlbuilder.Remove(sqlbuilder.Length - 1, 1);
            }
            else
            {
                sqlbuilder.AppendFormat(" FactorData.monitorTime DESC ,FactorData.monitorSiteCode,FactorData.monitorFactorCode");
            }
            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MMonitorSiteFactor_Realtime>(fwPageProcedureParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询监测点列表出错。错误在：【queryMonitorWaterPumpStatus】" + ex.Message.ToString());
            }
            return result;
        }

        public static FWResult<FWPageData<MMonitorSiteFactor_Realtime>> queryMonitorDrugStatus(IFWUserInfo userInfo, FWPageParams pageParams, QueryAutoMonitorParams queryParams)
        {
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            SysBasicManageService service = new SysBasicManageService();

            bool isOperationPerson = !string.IsNullOrEmpty(basicUserInfo.operationMaintenancePersonCode);

            FWResult<FWPageData<MMonitorSiteFactor_Realtime>> result = new FWResult<FWPageData<MMonitorSiteFactor_Realtime>>();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            StringBuilder sqlbuilder = new StringBuilder();

            sqlbuilder.AppendFormat(@"select * from (
SELECT distinct monitorSite.monitorSiteCode
,monitorSite.cantonCode
,dicState.fullName cantonName
,monitorSite.monitorSiteName
,eq.equipmentNo,
monitorSite.householdName
,dicSource.name equipmentTypeName
,case FactorData.drugLowLine when 1 then '低药液' ELSE '正常' END AS drugState
,FactorData.monitorTime
,CASE FactorData.drugLowLine
    WHEN 1 THEN op.faultTimeInterval
    ELSE NULL
END faultTimeInterval ,
CASE FactorData.drugLowLine
    WHEN 1 THEN op.faultTimeTotal
    ELSE NULL
END faultTimeTotal
FROM dbo.BLLMonitorSiteByDrugpumpData FactorData  WITH(NOLOCK)
INNER JOIN dbo.BLLMonitorSite monitorSite WITH(NOLOCK) ON monitorSite.monitorSiteCode = FactorData.monitorSiteCode
INNER JOIN [dbo].[BLLEquipment] eq WITH(NOLOCK) ON FactorData.[equipmentCode] = eq.[equipmentCode] and eq.moduleTypeCode= '1'
left join [dbo].[BLLOperationMaintenanceTask] op on FactorData.monitorSiteCode=op.monitorSiteCode and (issolve is null or issolve=0) AND op.faultTypeCode='6'
LEFT JOIN dbo.FWDictionary dicFactor WITH(NOLOCK) ON FactorData.monitorFactorCode=dicFactor.code AND dicFactor.pCode='BLLMonitorFactor'
LEFT JOIN dbo.FWDictionary dicState WITH(NOLOCK) ON monitorSite.cantonCode=dicState.code
LEFT JOIN dbo.FWDictionary dicSource WITH(NOLOCK) ON eq.equipmentTypeCode=dicSource.code AND dicSource.pCode='BLL_EquipmentType'
LEFT JOIN dbo.FWDictionary dicMonitorSiteType WITH(NOLOCK) ON monitorSite.monitorSiteTypeCode=dicMonitorSiteType.code AND dicMonitorSiteType.pCode='BLL_SiteType' ");
            if (isOperationPerson)
            {
                sqlbuilder.AppendFormat(@" inner join [dbo].[BLLOperationMaintenancePersonMappingMonitorSite] MPM WITH(NOLOCK) on monitorSite.monitorSiteCode=MPM.monitorSiteCode
and MPM.operationMaintenancePersonCode='{0}' ", basicUserInfo.operationMaintenancePersonCode);
            }

            sqlbuilder.AppendFormat(@" WHERE ISNULL(monitorSite.isDis,0)=0  and ISNULL(monitorSite.isDel,0)=0 ");

            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.keyword))
                {
                    sqlbuilder.AppendFormat(@" AND (monitorSite.monitorSiteName like'%{0}%' or eq.equipmentNo like '%{0}%' or dicState.fullName like '%{0}%' 
or  monitorSite.householdName like'{0}%'  )", queryParams.keyword);
                }
                if (!string.IsNullOrEmpty(queryParams.statusCode))
                {
                    sqlbuilder.AppendFormat(@" AND FactorData.drugPumpAlarm='{0}'", queryParams.statusCode);
                }
                
                if (!string.IsNullOrEmpty(queryParams.projectNo))
                {
                    sqlbuilder.AppendFormat(@" and monitorSite.projectNo= '{0}'",
                        FWSqlCommandStaticHelper.checkParam(queryParams.projectNo));
                }

                if (!string.IsNullOrEmpty(queryParams.cantonCode))
                {
                    sqlbuilder.AppendFormat(@" AND monitorSite.cantonCode like'{0}%'",
                        FWSqlCommandStaticHelper.checkParam(queryParams.cantonCode));
                }


            }

            //Roger 2016/6/1 13:00:02 增加管辖区域
            sqlbuilder.AppendFormat(@" AND ({0}) ) temp ", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", basicUserInfo.cantonCodeList));

            sqlbuilder.Append(@" order by ");
            if (pageParams.sortFieldList != null && pageParams.sortFieldList.Count > 0)
            {
                foreach (FWSortField fwSortField in pageParams.sortFieldList)
                {
                    switch (fwSortField.fieldName)
                    {
                        case "monitorTime":
                            fwSortField.fieldName = "monitorTime";
                            break;
                        case "monitorSiteName":
                            fwSortField.fieldName = "monitorSiteCode";
                            break;
                        case "monitorSiteTypeName":
                            fwSortField.fieldName = "monitorSiteTypeName";
                            break;
                        case "equipmentTypeName":
                            fwSortField.fieldName = "equipmentTypeName";
                            break;

                    }
                    sqlbuilder.AppendFormat(@"{0} {1},", fwSortField.fieldName,
                        fwSortField.sortType == FWSortType.Desc ? "desc" : "asc");
                }
                sqlbuilder.Remove(sqlbuilder.Length - 1, 1);
            }
            else
            {
                sqlbuilder.AppendFormat(" cantonName ");
            }
            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MMonitorSiteFactor_Realtime>(fwPageProcedureParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询监测点列表出错。错误在：【queryMonitorWaterPumpStatus】" + ex.Message.ToString());
            }
            return result;
        }

        public static FWResult<FWPageData<MMonitorSiteFactor_Realtime>> queryMonitorDrugHisStatus(IFWUserInfo userInfo, FWPageParams pageParams, QueryAutoMonitorParams queryParams)
        {
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            SysBasicManageService service = new SysBasicManageService();

            List<string> cantonCodeList = new List<string>();
            FWResult<FWPageData<MMonitorSiteFactor_Realtime>> result = new FWResult<FWPageData<MMonitorSiteFactor_Realtime>>();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            StringBuilder sqlbuilder = new StringBuilder();
            sqlbuilder.AppendFormat(@" SELECT monitorSite.monitorSiteCode,dicState.fullName cantonName,monitorSite.monitorSiteName,eq.equipmentNo,
monitorSite.householdName,dicSource.name monitorSiteTypeName,
CASE FactorData.drugAlarm
          WHEN 0 THEN '正常'
          WHEN 1 THEN '报警'
          ELSE '无'
        END drugState ,
        CASE FactorData.drugPumpAlarm
          WHEN 0 THEN '正常'
          WHEN 1 THEN '异常'
          ELSE '无'
        END drugPumpState 
,FactorData.monitorTime
FROM dbo.[BLLMonitorSiteByWaterpumpHisData] FactorData  WITH(NOLOCK)
INNER JOIN dbo.BLLMonitorSite monitorSite WITH(NOLOCK) ON monitorSite.monitorSiteCode = FactorData.monitorSiteCode
INNER JOIN [dbo].[BLLEquipment] eq WITH(NOLOCK) ON FactorData.[equipmentCode] = eq.[equipmentCode] 
--INNER JOIN dbo.BLLMonitorSiteMonitorFactor MonitorFactor WITH(NOLOCK) ON MonitorFactor.monitorSiteCode = FactorData.monitorSiteCode 
--AND FactorData.monitorFactorCode = MonitorFactor.monitorFactorCode
LEFT JOIN dbo.FWDictionary dicFactor WITH(NOLOCK) ON FactorData.monitorFactorCode=dicFactor.code AND dicFactor.pCode='BLLMonitorFactor'
LEFT JOIN dbo.FWDictionary dicState WITH(NOLOCK) ON monitorSite.cantonCode=dicState.code
LEFT JOIN dbo.FWDictionary dicSource WITH(NOLOCK) ON eq.equipmentTypeCode=dicSource.code AND dicSource.pCode='BLL_EquipmentType'
WHERE ISNULL(monitorSite.isDis,0)=0  
--AND ISNULL(MonitorFactor.isDis,0)=0 
and   eq.moduleTypeCode= '1'
");

            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.equipmentKeyword))
                {
                    sqlbuilder.AppendFormat(@" AND (monitorSite.monitorSiteName like'%{0}%' or eq.equipmentNo like '%{0}%' or dicState.fullName like '%{0}%' 
or  monitorSite.householdName like'{0}%'  )", queryParams.equipmentKeyword);
                }
                if (!string.IsNullOrEmpty(queryParams.monitorSiteCode))
                {
                    sqlbuilder.AppendFormat(@" AND monitorSite.monitorSiteCode ='{0}'", queryParams.monitorSiteCode);
                }
                if (!string.IsNullOrEmpty(queryParams.statusCode))
                {
                    sqlbuilder.AppendFormat(@" AND FactorData.waterPumpAlarm='{0}'", queryParams.statusCode);
                }

                if (queryParams.dStart.HasValue)
                {
                    sqlbuilder.AppendFormat(@" AND datediff(day,'{0}',FactorData.monitorTime)>=0  ", queryParams.dStart.Value);
                }
                if (queryParams.dEnd.HasValue)
                {
                    sqlbuilder.AppendFormat(@" AND   datediff(day,FactorData.monitorTime,'{0}')>=0   ", queryParams.dEnd.Value);
                }
                //if (queryParams.cantonCodeList != null && queryParams.cantonCodeList.Count > 0)
                //{
                //    sqlbuilder.AppendFormat(@" AND monitorSite.cantonCode in({0})", FWSqlCommandStaticHelper.joinToSqlString(queryParams.cantonCodeList));
                //}

            }

            //Roger 2016/6/1 13:00:02 增加管辖区域
            sqlbuilder.AppendFormat(@" AND ({0})  ", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", basicUserInfo.cantonCodeList));

            sqlbuilder.Append(@" order by ");
            if (pageParams.sortFieldList != null && pageParams.sortFieldList.Count > 0)
            {
                foreach (FWSortField fwSortField in pageParams.sortFieldList)
                {
                    switch (fwSortField.fieldName)
                    {
                        case "monitorTime":
                            fwSortField.fieldName = "FactorData.monitorTime";
                            break;
                        case "monitorSiteName":
                            fwSortField.fieldName = "FactorData.monitorSiteCode";
                            break;
                        case "monitorFactorName":
                            fwSortField.fieldName = "FactorData.monitorFactorCode";
                            break;
                    }
                    sqlbuilder.AppendFormat(@"{0} {1},", fwSortField.fieldName,
                        fwSortField.sortType == FWSortType.Desc ? "desc" : "asc");
                }
                sqlbuilder.Remove(sqlbuilder.Length - 1, 1);
            }
            else
            {
                sqlbuilder.AppendFormat(" FactorData.monitorTime DESC ,FactorData.monitorSiteCode,FactorData.monitorFactorCode");
            }
            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MMonitorSiteFactor_Realtime>(fwPageProcedureParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询监测点列表出错。错误在：【queryMonitorWaterPumpStatus】" + ex.Message.ToString());
            }
            return result;
        }
    }
}
