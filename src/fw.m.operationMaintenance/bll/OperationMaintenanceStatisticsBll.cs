using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using fw.fwDal;
using fw.fwData;
using fw.fwDataTable;
using fw.m.Common;
using fw.m.operationMaintenance.data;
using fw.m.operationMaintenance.data.model;
using fw.m.sysBasicManage.bll;
using fw.m.sysBasicManage.data;
using fw.m.sysBasicManage.service;
using fw.fwSession;
using fw.fwList;

namespace fw.m.operationMaintenance.bll
{
    public class OperationMaintenanceStatisticsBll
    {

        public static FWResult<FWPageData<MMonitorSiteAlarm>> queryPageMonitorSiteFailureStatistics(IFWUserInfo userInfo, FWPageParams pageParams, QueryMonitorSiteAlarmParams queryParams)
        {
            FWResult<FWPageData<MMonitorSiteAlarm>> result = new FWResult<FWPageData<MMonitorSiteAlarm>>();
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            SysBasicManageService service = new SysBasicManageService();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            List<string> cantonCodeList = new List<string>();
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.cantonCode))
                {
                    cantonCodeList.Add(queryParams.cantonCode);
                }
                if (basicUserInfo.cantonCodeList != null && basicUserInfo.cantonCodeList.Count > 0)
                {
                    queryParams.cantonCodeList = service.specialCantonCodeConvert(basicUserInfo.cantonCodeList,
                       cantonCodeList, userInfo.userID);
                }
            }

            StringBuilder sqlbuilder = new StringBuilder();
            sqlbuilder.AppendFormat(@" select MonitorSiteAlarm.id,MonitorSiteAlarm.monitorSiteAlarmCode
,MonitorSiteAlarm.monitorSiteAlarmName,monitorSite.cantonCode
,canton.fullName cantonName,MonitorSiteAlarm.monitorSiteCode,monitorSite.monitorSiteName
,MonitorSiteAlarm.alarmTypeCode,alarmType.name alarmTypeName,MonitorSiteAlarm.description,MonitorSiteAlarm.alarmTime
,MonitorSiteAlarm.isGenerateTask,MonitorSiteAlarm.opinion
,CASE WHEN (MonitorSiteAlarm.isGenerateTask=1) THEN 
ISNULL(task.isSolve,0)
else MonitorSiteAlarm.isSolve END isSolve
,MonitorSiteAlarm.rem,MonitorSiteAlarm.isDis,MonitorSiteAlarm.createrID,MonitorSiteAlarm.createTime
,MonitorSiteAlarm.updaterID,MonitorSiteAlarm.updateTime
FROM dbo.BLLMonitorSiteAlarm MonitorSiteAlarm WITH(NOLOCK)
LEFT JOIN dbo.BLLMonitorSite monitorSite WITH(NOLOCK) ON MonitorSiteAlarm.monitorSiteCode=monitorSite.monitorSiteCode
LEFT JOIN dbo.FWDictionary alarmType WITH(NOLOCK) ON MonitorSiteAlarm.alarmTypeCode=alarmType.code AND alarmType.dictionaryTypeCode='BIZFaultType'
LEFT JOIN dbo.FWDictionary canton WITH(NOLOCK) ON monitorSite.cantonCode=canton.code AND canton.dictionaryTypeCode='BLLCanton'
LEFT JOIN dbo.BLLOperationMaintenanceTask task  WITH(NOLOCK) ON task.monitorSiteAlarmCode = MonitorSiteAlarm.monitorSiteAlarmCode
WHERE ISNULL(MonitorSiteAlarm.isDis,0)=0
");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.keyword))
                {
                    sqlbuilder.AppendFormat(@" AND MonitorSiteAlarm.monitorSiteName like'%{0}%'", FWSqlCommandStaticHelper.checkParam(queryParams.keyword));
                }
                if (!string.IsNullOrEmpty(queryParams.monitorSiteCode))
                {
                    sqlbuilder.AppendFormat(@" AND MonitorSiteAlarm.monitorSiteCode='{0}'", queryParams.monitorSiteCode);
                }
                if (queryParams.dStart.HasValue)
                {
                    sqlbuilder.AppendFormat(@" and MonitorSiteAlarm.alarmTime>='{0}'", queryParams.dStart.Value.ToString("yyyy-MM-dd 00:00:00"));
                }
                if (queryParams.dEnd.HasValue)
                {
                    sqlbuilder.AppendFormat(@" and MonitorSiteAlarm.alarmTime<='{0}'", queryParams.dEnd.Value.ToString("yyyy-MM-dd 23:59:59"));
                }
                if (!string.IsNullOrEmpty(queryParams.faultType))
                {
                    sqlbuilder.AppendFormat(@" AND MonitorSiteAlarm.alarmTypeCode='{0}'", queryParams.faultType);
                }
                if (queryParams.isSolve.HasValue)
                {
                    sqlbuilder.AppendFormat(@" AND isnull(MonitorSiteAlarm.isSolve,0)={0}", queryParams.isSolve);
                }
                if (queryParams.isGenerateTask.HasValue)
                {
                    sqlbuilder.AppendFormat(@" AND isnull(MonitorSiteAlarm.isGenerateTask,0)={0}", queryParams.isGenerateTask);
                }
                if (!string.IsNullOrEmpty(queryParams.cantonCode))
                {
                    sqlbuilder.AppendFormat(@" and monitorSite.cantonCode in ({0}) ", FWSqlCommandStaticHelper.joinToSqlString(queryParams.cantonCodeList));
                }
            }
            sqlbuilder.Append(@" order by ");
            if (pageParams.sortFieldList != null && pageParams.sortFieldList.Count > 0)
            {
                foreach (FWSortField fwSortField in pageParams.sortFieldList)
                {
                    switch (fwSortField.fieldName)
                    {
                        case "alarmTime":
                            fwSortField.fieldName = "MonitorSiteAlarm.[alarmTime]";
                            break;
                        case "cantonName":
                            fwSortField.fieldName = "monitorSite.[cantonCode]";
                            break;
                        case "isSolve":
                            fwSortField.fieldName = "MonitorSiteAlarm.isSolve";
                            break;
                    }
                    sqlbuilder.AppendFormat(@"{0} {1},", fwSortField.fieldName, fwSortField.sortType == FWSortType.Desc ? "desc" : "asc");
                }
                sqlbuilder.Remove(sqlbuilder.Length - 1, 1);
            }
            else
            {
                sqlbuilder.AppendFormat(" MonitorSiteAlarm.[alarmTime],MonitorSiteAlarm.isSolve");
            }
            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MMonitorSiteAlarm>(fwPageProcedureParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询监测点列表出错。错误在：【queryPageMonitorSiteFailureStatistics】" + ex.Message.ToString());
            }
            return result;
        }


        /// <summary>
        /// 设备正常/超标统计率
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="cantonCode"></param>
        /// <param name="beginTime"></param>
        /// <param name="endTime"></param>
        /// <param name="storedProcedureName"></param>
        /// <returns></returns>
        public static FWResult<FWDataTable> queryMonitorSiteRateStatistics(IFWUserInfo userInfo, string cantonCode, DateTime beginTime, DateTime endTime, string storedProcedureName)
        {

            #region 存储获取状态
            SqlParameter[] SqlParameterS_city = {   
                                             new SqlParameter("@dStart",beginTime.ToString("yyyy-MM-dd")),
                                             new SqlParameter("@dEnd",endTime.ToString("yyyy-MM-dd")),
                                             new SqlParameter("@CantonCode",cantonCode) ,
                                             new SqlParameter("@KeyWord",string.Empty) ,
                                             new SqlParameter("@GroupBy","1")  
                                           };
            SqlParameter[] SqlParameterS_town = {   
                                              new SqlParameter("@dStart",beginTime.ToString("yyyy-MM-dd")),
                                             new SqlParameter("@dEnd",endTime.ToString("yyyy-MM-dd")),
                                             new SqlParameter("@CantonCode",cantonCode) ,
                                             new SqlParameter("@KeyWord",string.Empty) ,
                                             new SqlParameter("@GroupBy","2")  
                                           };
            SqlParameter[] SqlParameterS_village = {   
                                              new SqlParameter("@dStart",beginTime.ToString("yyyy-MM-dd")),
                                             new SqlParameter("@dEnd",endTime.ToString("yyyy-MM-dd")),
                                             new SqlParameter("@CantonCode",cantonCode) ,
                                             new SqlParameter("@KeyWord",string.Empty) ,
                                             new SqlParameter("@GroupBy","3")  
                                           };

            SqlCommand cmd_city = new SqlCommand()
            {
                CommandType = CommandType.StoredProcedure,
                CommandText = storedProcedureName
            };
            cmd_city.Parameters.AddRange(SqlParameterS_city);
            SqlCommand cmd_town = new SqlCommand()
            {
                CommandType = CommandType.StoredProcedure,
                CommandText = storedProcedureName
            };
            cmd_town.Parameters.AddRange(SqlParameterS_town);
            SqlCommand cmd_village = new SqlCommand()
            {
                CommandType = CommandType.StoredProcedure,
                CommandText = storedProcedureName
            };
            cmd_village.Parameters.AddRange(SqlParameterS_village);
            DataSet ds_city = FWSqlCommandStaticHelper.ExecuteDataSet(cmd_city);
            DataSet ds_town = FWSqlCommandStaticHelper.ExecuteDataSet(cmd_town);
            DataSet ds_village = FWSqlCommandStaticHelper.ExecuteDataSet(cmd_village);

            DataTable dt_city = new DataTable();
            DataTable dt_town = new DataTable();
            DataTable dt_village = new DataTable();

            if (ds_city != null && ds_city.Tables[0] != null)
            {
                dt_city = ds_city.Tables[0];
            }
            if (ds_town != null && ds_town.Tables[0] != null)
            {
                dt_town = ds_town.Tables[0];
            }
            if (ds_village != null && ds_village.Tables[0] != null)
            {
                dt_village = ds_village.Tables[0];
            }

            DataTable newDataTable = dt_city.Copy();

            //添加DataTable2的数据
            foreach (DataRow dr in dt_town.Rows)
            {
                newDataTable.ImportRow(dr);
            }
            foreach (DataRow dr in dt_village.Rows)
            {
                newDataTable.ImportRow(dr);
            }

            FWResult<FWDataTable> result = new FWResult<FWDataTable>();
            result.data = new FWDataTable(newDataTable);
            #endregion
            result.status = FWResultStatus.Success;
            return result;
        }

        /// <summary>
        /// 运行情况统计  
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="cantonCode"></param>
        /// <param name="dateTime"></param>
        /// <param name="dateTime_2"></param>
        /// <returns></returns>
        public static FWResult<List<MOperatingConditionStatistics>> queryOperatingConditionStatistics(IFWUserInfo userInfo, string cantonCode,
            DateTime beginTime, DateTime endTime)
        {
            FWResult<List<MOperatingConditionStatistics>> result = new FWResult<List<MOperatingConditionStatistics>>();
            //Roger 2016/6/1 13:00:02 增加管辖区域
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }
            #region 设施数据

            List<string> cantonCodeList = new List<string>();
            cantonCodeList.Add(cantonCode);
            var pCantonCode = "BLLCanton";
            var cantonList = OperationMaintenanceBll.getCantonTreeList(cantonCodeList);
            //if (cantonList != null && cantonList.Count > 0)
            //{
            //    pCantonCode = cantonList.Where(p => p.pCantonCode.Equals(cantonCode)).Select(p => p.pCantonCode).First();
            //}
            //var cantonTreeList = FWListHelper<MCantonData>.toTree(cantonList, "pCantonCode", "cantonCode", "childDataList", pCantonCode);

            //monitorsiteOperatingConditionTreeDataTraversalSummary(cantonTreeList, List<MMonitorSite> monitorsites)
            #endregion
            #region 点位数据
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            StringBuilder sbSql = new StringBuilder();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            sbSql.AppendFormat(@" 

  SELECT  
	t1.CantonCode  
	,t1.[PCantoncode]   parentCantonCode
	,sum(t1.KHDay)		KHDay_SUM
	,sum(t1.ActDay)		ActDay_SUM
	,sum(t1.ActCount)	ActCount_SUM
	,sum(t1.OverCount)	OverCount_SUM
	,sum(t1.OMCount)	OMCount_SUM
	,sum(t1.ErrCount)	ErrCount_SUM 
	FROM  [dbo].[T_KH_SiteRun_Day] t1
	WHERE  1=1 and ({2})
	AND datediff(day,'{0}',dDate)>=0   --开始时间
	AND datediff(day,dDate,'{1}')>=0   --结束时间
	GROUP BY  T1.CantonCode,T1.[PCantoncode]     ", beginTime, endTime, SysBasicManageBll.CartonToStr("t1.cantonCode", basicUserInfo.cantonCodeList));

            fwSqlCommand.CommandText = sbSql.ToString();
            var OCList = FWSqlEntityToFWCommandStaticHelper.queryList<MOperatingConditionStatistics>(fwSqlCommand);

            #endregion
            if (OCList != null && OCList.Count > 0)
            {

                List<MOperatingConditionStatistics> dataList = new List<MOperatingConditionStatistics>();
                foreach (var item in cantonList)
                {
                    var ocFilter = OCList.Where(p => p.parentCantonCode.Contains(item.cantonCode));
                    var entity = new MOperatingConditionStatistics()
                             {
                                 cantonCode = item.cantonCode,
                                 cantonName = item.cantonName,
                                 parentCantonCode = item.pCantonCode,
                                 khDay_SUM = ocFilter.Sum(p => p.khDay_SUM),
                                 actCount_SUM = ocFilter.Sum(p => p.actCount_SUM),
                                 actDay_SUM = ocFilter.Sum(p => p.actDay_SUM),
                                 overCount_SUM = ocFilter.Sum(p => p.overCount_SUM),
                                 omCount_SUM = ocFilter.Sum(p => p.omCount_SUM),
                                 errCount_SUM = ocFilter.Sum(p => p.errCount_SUM),
                             };
                    dataList.Add(entity);
                }
                result.data = dataList;
            }
            result.status = FWResultStatus.Success;
            return result;
        }


        #region 设施故障统计 -先用报警记录计算
        //查询已经关联设备的现场设备列表 
        public static List<MMonitorSiteAlarm> queryBreakdownList(IFWUserInfo userInfo, QueryMonitorSiteAlarmParams queryParams)
        {
            List<MMonitorSiteAlarm> result = new List<MMonitorSiteAlarm>();
            StringBuilder sqlbuilder = new StringBuilder();
//            sqlbuilder.AppendFormat(@" 
//select MonitorSiteAlarm.id,MonitorSiteAlarm.monitorSiteAlarmCode
//,MonitorSiteAlarm.monitorSiteAlarmName,monitorSite.cantonCode,be.equipmentCode,be.equipmentName,be.equipmentNo
//,canton.fullName cantonName,MonitorSiteAlarm.monitorSiteCode,monitorSite.monitorSiteName
//,MonitorSiteAlarm.alarmTypeCode,alarmType.name alarmTypeName,MonitorSiteAlarm.description,MonitorSiteAlarm.alarmTime
//,MonitorSiteAlarm.isGenerateTask,MonitorSiteAlarm.opinion
//,CASE WHEN (MonitorSiteAlarm.isGenerateTask=1) THEN 
//ISNULL(task.isSolve,0)
//else MonitorSiteAlarm.isSolve END isSolve
//,MonitorSiteAlarm.rem,MonitorSiteAlarm.isDis,MonitorSiteAlarm.createrID,MonitorSiteAlarm.createTime
//,MonitorSiteAlarm.updaterID,MonitorSiteAlarm.updateTime
//FROM dbo.BLLMonitorSiteAlarm MonitorSiteAlarm WITH(NOLOCK)
//LEFT JOIN dbo.BLLMonitorSite monitorSite WITH(NOLOCK) ON MonitorSiteAlarm.monitorSiteCode=monitorSite.monitorSiteCode
//LEFT JOIN dbo.FWDictionary alarmType WITH(NOLOCK) ON MonitorSiteAlarm.alarmTypeCode=alarmType.code AND alarmType.dictionaryTypeCode='BIZFaultType'
//LEFT JOIN dbo.FWDictionary canton WITH(NOLOCK) ON monitorSite.cantonCode=canton.code AND canton.dictionaryTypeCode='BLLCanton'
//LEFT JOIN dbo.BLLOperationMaintenanceTask task  WITH(NOLOCK) ON task.monitorSiteAlarmCode = MonitorSiteAlarm.monitorSiteAlarmCode
//LEFT JOIN dbo.BLLEquipment be WITH(NOLOCK) ON be.equipmentCode = MonitorSiteAlarm.equipmentCode
//WHERE ISNULL(MonitorSiteAlarm.isDis,0)=0
//");

            sqlbuilder.AppendFormat(@"  select task.equipmentCode,task.isSolve,task.monitorSiteAlarmCode,task.monitorSiteCode,monitorSite.cantonCode,be.equipmentCode,be.equipmentName,be.equipmentNo
,canton.fullName cantonName,monitorSite.monitorSiteName,alarmType.name alarmTypeName from BLLOperationMaintenanceTask task 
 LEFT JOIN dbo.BLLMonitorSite monitorSite WITH(NOLOCK) ON task.monitorSiteCode=monitorSite.monitorSiteCode
LEFT JOIN dbo.FWDictionary alarmType WITH(NOLOCK) ON task.faultTypeCode=alarmType.code AND alarmType.dictionaryTypeCode='BIZFaultType'
LEFT JOIN dbo.FWDictionary canton WITH(NOLOCK) ON monitorSite.cantonCode=canton.code AND canton.dictionaryTypeCode='BLLCanton'
left JOIN dbo.BLLEquipment be WITH(NOLOCK) ON be.equipmentCode = task.equipmentCode
 where task.isDis=0  and   be.moduleTypeCode= '1'
");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.keyword))
                {
                    sqlbuilder.AppendFormat(@" AND ( monitorSite.monitorSiteName like'%{0}%' OR be.equipmentNo LIKE '%{0}%' or canton.fullName LIKE '%{0}%') ", FWSqlCommandStaticHelper.checkParam(queryParams.keyword));
                }
                if (!string.IsNullOrEmpty(queryParams.monitorSiteCode))
                {
                   // sqlbuilder.AppendFormat(@" AND MonitorSiteAlarm.monitorSiteCode='{0}'", queryParams.monitorSiteCode);
                    sqlbuilder.AppendFormat(@" AND task.monitorSiteCode='{0}'", queryParams.monitorSiteCode);
                }
                //if (queryParams.dStart.HasValue)
                //{
                //    sqlbuilder.AppendFormat(@" and task.createTime>='{0}'", queryParams.dStart.Value.ToString("yyyy-MM-dd 00:00:00"));
                //}
                //if (queryParams.dEnd.HasValue)
                //{
                //    sqlbuilder.AppendFormat(@" and task.createTime<='{0}'", queryParams.dEnd.Value.ToString("yyyy-MM-dd 23:59:59"));
                //}

                if (queryParams.dStart.HasValue && queryParams.dEnd.HasValue)
                {
                    sqlbuilder.AppendFormat(@" and task.faultTime BETWEEN convert(datetime,'{0}') and  convert(datetime,'{1}')", queryParams.dStart.Value.ToString("yyyy-MM-dd 00:00:00"), queryParams.dEnd.Value.ToString("yyyy-MM-dd 23:59:59"));
                }
                if (!string.IsNullOrEmpty(queryParams.cantonCode))
                {
                    //sqlbuilder.AppendFormat(@" AND  monitorSite.cantonCode like '{0}%' ", FWSqlCommandStaticHelper.checkParam(queryParams.cantonCode));
                    //modify by lzc 20170120
                    sqlbuilder.AppendFormat(@" and {0} ", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", queryParams.cantonCode));
                }
            }
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            fwSqlCommand.CommandText = sqlbuilder.ToString();
            result = FWSqlEntityToFWCommandStaticHelper.queryList<MMonitorSiteAlarm>(fwSqlCommand);
            return result;
        }

        public static FWResult<FWPageData<MBreakdownInfo>> queryPageMonitorSiteStatus(IFWUserInfo userInfo,
             FWPageParams pageParams, QueryMonitorSiteAlarmParams queryParams)
        {
            FWResult<FWPageData<MBreakdownInfo>> result = new FWResult<FWPageData<MBreakdownInfo>>();
            FWPageData<MBreakdownInfo> pageData = new FWPageData<MBreakdownInfo>();
            List<MBreakdownInfo> bdList = new List<MBreakdownInfo>();

            try
            {
                List<MMonitorSiteAlarm> siteLsit = queryBreakdownList(userInfo, queryParams);
                if (siteLsit != null && siteLsit.Count > 0)
                {
                    bdList = (from l in siteLsit
                              group l by new { l.monitorSiteCode, l.monitorSiteName, l.equipmentNo, l.cantonName } into g
                             
                              select new MBreakdownInfo
                              {
                                  monitorSiteCode = g.Key.monitorSiteCode,
                                  monitorSiteName = g.Key.monitorSiteName,
                                  equipmentNo = g.Key.equipmentNo,
                                  cantonName = g.Key.cantonName,
                                  breakdownCount = g.Count()
                              }).ToList();
                } 
                pageData.pageSize = pageParams.pageSize;
                pageData.pageIndex = pageParams.pageIndex;
                int rangeNum = (int)pageParams.pageSize * (int)(pageParams.pageIndex - 1);
                pageData.recordCount = 0;
                //合并数据
                if (bdList != null && bdList.Count > 0)
                {
                    pageData.recordCount = bdList.Count();
                    pageData.entityList = bdList.OrderBy(p => p.cantonCode).OrderBy(p => p.monitorSiteName).Skip(rangeNum).Take((int)pageParams.pageSize).ToList();
                }
                result.data = pageData;
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {

                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Error;
            }
            return result;
        }

        #endregion

        /// <summary>
        /// 运维任务绩效统计  add by songshasha 2016-12-15
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="pageParams"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        public static FWResult<FWPageData<MPersonTaskAnalysis>> queryPagePersonTaskStatus(IFWUserInfo userInfo,
           FWPageParams pageParams, QueryMonitorSiteAlarmParams queryParams)
        {
            FWResult<FWPageData<MPersonTaskAnalysis>> result = new FWResult<FWPageData<MPersonTaskAnalysis>>();
            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            StringBuilder sqlbuilder = new StringBuilder();
            sqlbuilder.Append("select p.operationMaintenancePersonCode,p.operationMaintenancePersonName,");
            sqlbuilder.Append(" isnull(a.常规任务未解决数量,0) 常规任务未解决数量,");
            sqlbuilder.Append(" isnull(a.常规任务已解决数量,0)  常规任务已解决数量,");
            sqlbuilder.Append(" isnull(a.常规任务总数量,0)  常规任务总数量,");
            sqlbuilder.Append(" isnull(b.报警任务未解决数量,0)  报警任务未解决数量,");
            sqlbuilder.Append(" isnull(b.报警任务已解决数量,0) 报警任务已解决数量,");
            sqlbuilder.Append(" isnull(b.报警任务总数量,0)  报警任务总数量,");
            sqlbuilder.Append(" isnull(a.常规任务总数量,0)+isnull(b.报警任务总数量,0) 任务总量");
            sqlbuilder.Append(" from BLLOperationMaintenancePerson p left join (");
            sqlbuilder.Append(" select operationMaintenancePersonCode,max(case isSolve when 1 then 数量 else 0 end) 常规任务已解决数量,");
            sqlbuilder.Append(" max(case isnull(isSolve,0) when 0  then 数量 else 0 end) 常规任务未解决数量 ,sum(数量) 常规任务总数量");
            sqlbuilder.Append(" from (");
            sqlbuilder.Append(" select count(*)  数量,isSolve,operationMaintenancePersonCode from BLLOperationMaintenanceTask where taskTypeCode =1 ");
            if (queryParams != null)
            {
                if (queryParams.dStart.HasValue && queryParams.dEnd.HasValue)
                {
                    sqlbuilder.AppendFormat(@" and (
(repairTime BETWEEN convert(datetime,'{0}') and  convert(datetime,'{1}'))   
or (faultTime BETWEEN convert(datetime,'{0}') and  convert(datetime,'{1}') ) 
or (faultTime <=  convert(datetime,'{0}') and repairTime >=  convert(datetime,'{1}') ) 
)", queryParams.dStart.Value.ToString("yyyy-MM-dd 00:00:00"), queryParams.dEnd.Value.ToString("yyyy-MM-dd 23:59:59"));
                }

            }
            // sqlbuilder.Append("and createTime between '2016-12-01' and '2016-12-12'");
            sqlbuilder.Append(" group by isSolve,operationMaintenancePersonCode ");
            sqlbuilder.Append(" ) temp group by operationMaintenancePersonCode ) a");
            sqlbuilder.Append(" on p.operationMaintenancePersonCode=a.operationMaintenancePersonCode");
            sqlbuilder.Append(" left join (select operationMaintenancePersonCode,max(case isSolve when 1 then 数量 else 0 end) 报警任务已解决数量,");
            sqlbuilder.Append(" max(case isnull(isSolve,0) when 0 then 数量 else 0 end) 报警任务未解决数量,sum(数量) 报警任务总数量 from (");
            sqlbuilder.Append(" select count(*)  数量,isSolve,operationMaintenancePersonCode from BLLOperationMaintenanceTask where taskTypeCode =2 ");
            if (queryParams != null)
            {
                if (queryParams.dStart.HasValue && queryParams.dEnd.HasValue)
                {
                    sqlbuilder.AppendFormat(@" and (
(repairTime BETWEEN convert(datetime,'{0}') and  convert(datetime,'{1}'))   
or (faultTime BETWEEN convert(datetime,'{0}') and  convert(datetime,'{1}') ) 
or (faultTime <=  convert(datetime,'{0}') and repairTime >=  convert(datetime,'{1}') ) 
)", queryParams.dStart.Value.ToString("yyyy-MM-dd 00:00:00"), queryParams.dEnd.Value.ToString("yyyy-MM-dd 23:59:59"));
                }
              
            }
            sqlbuilder.Append(" group by isSolve,operationMaintenancePersonCode ) temp group by operationMaintenancePersonCode ) b");
            sqlbuilder.Append(" on p.operationMaintenancePersonCode=b.operationMaintenancePersonCode");
            sqlbuilder.Append(" where  p.operationMaintenancePersonCode is not null and p.isDel=0 and p.isDis=0 order by 任务总量 desc");
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MPersonTaskAnalysis>(fwPageProcedureParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询监测点列表出错。错误在：【queryPageMonitorSiteFailureStatistics】" + ex.Message.ToString());
            }
            return result;
        }

        public static FWResult<FWPageData<MOperatorAssessment>> queryPagePersonTaskAssessment(IFWUserInfo userInfo,
            FWPageParams pageParams, QueryTaskParams queryParams)
        {
            FWResult<FWPageData<MOperatorAssessment>> result = new FWResult<FWPageData<MOperatorAssessment>>();
            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            StringBuilder sqlbuilder = new StringBuilder();
            sqlbuilder.Append(@"SELECT *
,CASE WHEN tab1.SolvedCommTask!=0 THEN tab1.commTaskSolvedTime/tab1.SolvedCommTask ELSE 0 END AS SolvedCommTaskAverageTime
,CASE WHEN tab1.SolvedAlarmTask!=0 THEN tab1.alarmTaskSolvedTime/tab1.SolvedAlarmTask ELSE 0 END AS SolvedAlarmTaskAverageTime
FROM ");
            sqlbuilder.Append(@"(SELECT tab.operationMaintenancePersonName,tab.operationMaintenancePersonCode,
SUM(CASE WHEN tab.name!='报警任务' AND tab.isSolve=0 THEN tab.amount ELSE 0 END) AS noSolveCommTask,
SUM(CASE WHEN tab.name!='报警任务' AND tab.isSolve=1 THEN tab.amount ELSE 0 END) AS SolvedCommTask,
SUM(CASE WHEN tab.name='报警任务' AND tab.isSolve=0 THEN tab.amount ELSE 0 END) AS noSolveAlarmTask,
SUM(CASE WHEN tab.name='报警任务' AND tab.isSolve=1 THEN tab.amount ELSE 0 END) AS SolvedAlarmTask,
SUM(CASE WHEN tab.name!='报警任务' AND tab.isSolve=1 THEN DATEDIFF(HOUR,tab.faultTime,tab.repairTime) ELSE 0 END) AS commTaskSolvedTime,
SUM(CASE WHEN tab.name='报警任务' AND tab.isSolve=1 THEN DATEDIFF(HOUR,tab.faultTime,tab.repairTime) ELSE 0 END) AS alarmTaskSolvedTime FROM ");
            sqlbuilder.Append(@"(SELECT 1 AS amount,
person.operationMaintenancePersonCode,person.operationMaintenancePersonName,
taskType.name,
ISNULL(task.isSolve,0) isSolve,
--ISNULL(task.receiveTime,task.faultTime) AS faultTime,task.repairTime
task.faultTime,task.repairTime
FROM dbo.BLLOperationMaintenanceTask task WITH(NOLOCK)
INNER JOIN BLLOperationMaintenancePerson person WITH(NOLOCK) ON person.operationMaintenancePersonCode = task.operationMaintenancePersonCode
LEFT JOIN dbo.FWDictionary taskType WITH(NOLOCK) ON task.taskTypeCode=taskType.code AND taskType.dictionaryTypeCode='BIZTaskType' where 1=1 ");
            if (queryParams != null)
            {
                if (queryParams.dStart.HasValue && queryParams.dEnd.HasValue)
                {
                    sqlbuilder.AppendFormat(@" and (
(repairTime BETWEEN convert(datetime,'{0}') and  convert(datetime,'{1}'))   
or (faultTime BETWEEN convert(datetime,'{0}') and  convert(datetime,'{1}') ) 
or (faultTime <=  convert(datetime,'{0}') and repairTime >=  convert(datetime,'{1}') ) 
)", queryParams.dStart.Value.ToString("yyyy-MM-dd 00:00:00"), queryParams.dEnd.Value.ToString("yyyy-MM-dd 23:59:59"));
                }
                //运维人员查询
                if (!string.IsNullOrEmpty(queryParams.TaskOMPersonCode))
                {
                    sqlbuilder.AppendFormat(@" AND person.operationMaintenancePersonCode ='{0}' ", queryParams.TaskOMPersonCode);
                }
            }
            sqlbuilder.Append(@") AS tab
GROUP BY tab.operationMaintenancePersonName, tab.operationMaintenancePersonCode) AS tab1");
            sqlbuilder.Append(@" order by tab1.SolvedCommTask desc");
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MOperatorAssessment>(fwPageProcedureParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询监测点列表出错。错误在：【queryPagePersonTaskAssessment】" + ex.Message.ToString());
            }
            return result;
        }

        /// <summary>
        /// 设备运行情况日统计  add by songshasha 2017-10-12
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="pageParams"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        public static FWResult<FWPageData<MBllEquipmentStatusInfoByDay>> queryPageEquipmentStatusInfoByDay(IFWUserInfo userInfo,
            FWPageParams pageParams, QueryTaskParams queryParams)
        {
            FWResult<FWPageData<MBllEquipmentStatusInfoByDay>> result = new FWResult<FWPageData<MBllEquipmentStatusInfoByDay>>();
            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            StringBuilder sqlbuilder = new StringBuilder();
            sqlbuilder.Append(@"select  [cantonCode],projectNo
      ,[normalNum]
      ,[offLineNum]
      ,[electricFault]
      ,[blockNum]
      ,[blowByNum]
      ,[testNum]
      , CONVERT(varchar(100), a.createTime, 102) createTimeFormat,b.name cantonName from [dbo].[BllEquipmentStatusInfoByDay] a,[dbo].[FWDictionary] b where a.cantonCode=b.code and b.isDis=0 ");
            if (queryParams != null)
            {
                if (queryParams.dStart.HasValue && queryParams.dEnd.HasValue)
                {
                    sqlbuilder.AppendFormat(@" and a.createTime BETWEEN convert(datetime,'{0}') and  convert(datetime,'{1}')" , queryParams.dStart.Value.ToString("yyyy-MM-dd 00:00:00"), queryParams.dEnd.Value.ToString("yyyy-MM-dd 23:59:59"));
                }

                if (!string.IsNullOrEmpty(queryParams.cantonCode))
                {
                    sqlbuilder.AppendFormat(@" and a.cantonCode='{0}'", queryParams.cantonCode);
                }
            }

            sqlbuilder.Append(" order by a.createTime  ");
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MBllEquipmentStatusInfoByDay>(fwPageProcedureParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询设备日运行情况出错。错误在：【queryPageEquipmentStatusInfoByDay】" + ex.Message.ToString());
            }
            return result;


            
        }

        /// <summary>
        /// 运行异常设备列表，按日统计
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="pageParams"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        public static FWResult<FWPageData<MBLLMonitorSiteHisData>> queryPageEquipmentFaultList(IFWUserInfo userInfo,
            FWPageParams pageParams, QueryTaskParams queryParams)
        {
            FWResult<FWPageData<MBLLMonitorSiteHisData>> result = new FWResult<FWPageData<MBLLMonitorSiteHisData>>();
            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            StringBuilder sqlbuilder = new StringBuilder();
            sqlbuilder.Append(@"select  CONVERT(varchar(100), temp.createTime, 102) createTimeFormat, fullName cantonCode,monitorSiteName monitorSiteCode ,monitorFactorName  monitorFactorCode
,monitorTime,monitorValue,dataStateName  from
(
SELECT FactorData.[createTime], monitorSite.cantonCode,dicCanton.fullName,FactorData.monitorSiteCode,monitorSite.monitorSiteName
,FactorData.monitorFactorCode,dicFactor.name monitorFactorName
,FactorData.monitorTime,FactorData.monitorValue,FactorData.dataState,dicState.name dataStateName
FROM [dbo].[BLLMonitorSiteHisFaultData] FactorData  WITH(NOLOCK)
INNER JOIN dbo.BLLMonitorSite monitorSite WITH(NOLOCK) ON monitorSite.monitorSiteCode = FactorData.monitorSiteCode
INNER JOIN dbo.BLLMonitorSiteMonitorFactor MonitorFactor WITH(NOLOCK) ON MonitorFactor.monitorSiteCode = FactorData.monitorSiteCode
 AND FactorData.monitorFactorCode = MonitorFactor.monitorFactorCode
LEFT JOIN dbo.FWDictionary dicFactor WITH(NOLOCK) ON FactorData.monitorFactorCode=dicFactor.code AND dicFactor.pCode='BLLMonitorFactor'
LEFT JOIN dbo.FWDictionary dicState WITH(NOLOCK) ON FactorData.dataState=dicState.code AND dicState.pCode='631'
LEFT JOIN dbo.FWDictionary dicCanton WITH(NOLOCK) ON monitorSite.cantonCode=dicCanton.code 
WHERE ISNULL(monitorSite.isDis,0)=0  AND ISNULL(MonitorFactor.isDis,0)=0 ");
            if (queryParams != null)
            {
                if (queryParams.dStart.HasValue && queryParams.dEnd.HasValue)
                {
                    sqlbuilder.AppendFormat(@" and FactorData.createTime BETWEEN convert(datetime,'{0}') and  convert(datetime,'{1}')", queryParams.dStart.Value.ToString("yyyy-MM-dd 00:00:00"), queryParams.dEnd.Value.ToString("yyyy-MM-dd 23:59:59"));
                }

                if (!string.IsNullOrEmpty(queryParams.keyword))
                {
                    DateTime  date = Convert.ToDateTime(  DateTime.Now.AddDays(-1).ToShortDateString());
                    sqlbuilder.AppendFormat(@" and FactorData.monitorTime BETWEEN convert(datetime,'{0}') and  convert(datetime,'{1}')", date.ToString("yyyy-MM-dd 00:00:00"), DateTime.Now.ToString("yyyy-MM-dd 23:59:59"));
                }

                if (!string.IsNullOrEmpty(queryParams.cantonCode))
                {
                    sqlbuilder.AppendFormat(@" and monitorSite.cantonCode like '{0}%'", FWSqlCommandStaticHelper.checkParam(queryParams.cantonCode));
                }

                if (!string.IsNullOrEmpty(queryParams.faultType))
                {
                    sqlbuilder.AppendFormat(@" and FactorData.dataState = '{0}'", FWSqlCommandStaticHelper.checkParam(queryParams.faultType));
                }
            }

            sqlbuilder.Append(" ) temp  order by createTime,cantonCode,dataStateName  ");
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MBLLMonitorSiteHisData>(fwPageProcedureParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询设备日运行情况出错。错误在：【queryPageEquipmentFaultList】" + ex.Message.ToString());
            }
            return result;
        }

    }
}
