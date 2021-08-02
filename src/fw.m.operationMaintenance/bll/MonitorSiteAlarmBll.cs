using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwData;
using fw.m.Common;
using fw.m.sysBasicManage.bll;
using fw.m.sysBasicManage.data;
using fw.fwDal;
using fw.m.operationMaintenance.data.model;
using fw.m.operationMaintenance.data;
using fw.m.operationMaintenance.data.entity;
using fw.m.operationMaintenance.dal;
using fw.fwSession;
using fw.m.sysBasicManage.service;
using System.Data;
using System.Data.SqlClient;

namespace fw.m.operationMaintenance.bll
{
    /// <summary>
    /// 报警
    /// </summary>
    public class MonitorSiteAlarmBll
    {
        /// <summary>
        /// 分页查询净化槽报警
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="pageParams"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        public static FWResult<FWPageData<MMonitorSiteAlarm>> queryPageMonitorSiteAlarm(IFWUserInfo userInfo, FWPageParams pageParams, QueryMonitorSiteAlarmParams queryParams)
        {
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            SysBasicManageService service = new SysBasicManageService();
            FWResult<FWPageData<MMonitorSiteAlarm>> result = new FWResult<FWPageData<MMonitorSiteAlarm>>();

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
                    //queryParams.cantonCodeList = service.specialCantonCodeConvert(basicUserInfo.cantonCodeList,
                    // cantonCodeList, userInfo.userID);
                }
            }
            if (!string.IsNullOrEmpty(basicUserInfo.operationMaintenancePersonCode))
            {
                queryParams.operationMaintenancePersonCode = basicUserInfo.operationMaintenancePersonCode;
            }
            StringBuilder sqlbuilder = new StringBuilder();
            sqlbuilder.AppendFormat(@" select MonitorSiteAlarm.id,MonitorSiteAlarm.monitorSiteAlarmCode
                                        ,MonitorSiteAlarm.monitorSiteAlarmName,monitorSite.cantonCode,be.equipmentCode,be.equipmentName,be.equipmentNo
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
                                        LEFT JOIN dbo.FWDictionary alarmType WITH(NOLOCK) ON MonitorSiteAlarm.alarmTypeCode=alarmType.code AND alarmType.dictionaryTypeCode='BLL_AlarmType'
                                        LEFT JOIN dbo.FWDictionary canton WITH(NOLOCK) ON monitorSite.cantonCode=canton.code AND canton.dictionaryTypeCode='BLLCanton'
                                        LEFT JOIN dbo.BLLOperationMaintenanceTask task  WITH(NOLOCK) ON task.monitorSiteAlarmCode = MonitorSiteAlarm.monitorSiteAlarmCode
                                        left JOIN dbo.BLLEquipment be WITH(NOLOCK) ON be.equipmentCode = MonitorSiteAlarm.equipmentCode 
                                        WHERE   be.moduleTypeCode= '1' and ISNULL(MonitorSiteAlarm.isDis,0)=0
                                        ");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.keyword))
                {
                    sqlbuilder.AppendFormat(@" AND ( monitorSite.monitorSiteName like'%{0}%'  or be.equipmentNo  like'%{0}%' or canton.fullName like'%{0}%') ", FWSqlCommandStaticHelper.checkParam(queryParams.keyword));
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
                    sqlbuilder.AppendFormat(@" AND  ({0})  ", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", new List<string> { queryParams.cantonCode }));
                }
                if (!string.IsNullOrEmpty(queryParams.operationMaintenancePersonCode))
                {
                    sqlbuilder.AppendFormat(@" AND MonitorSiteAlarm.[monitorSiteCode]  IN ( SELECT  [monitorSiteCode] 
  FROM  [dbo].[BLLOperationMaintenancePersonMappingMonitorSite] WHERE  [operationMaintenancePersonCode] ='{0}' ) ", FWSqlCommandStaticHelper.checkParam(queryParams.operationMaintenancePersonCode));
                }
            }
            //Roger 2016/6/1 13:00:02 增加管辖区域
            sqlbuilder.AppendFormat(@" AND  ({0})  ", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", basicUserInfo.cantonCodeList));
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
                result.infoList.Add("查询监测点列表出错。错误在：【queryPageMonitorSiteAlarm】" + ex.Message.ToString());
            }
            return result;
        }

        /// <summary>
        /// 查询报警信息
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        public static FWResult<List<MMonitorSiteAlarm>> queryMonitorSiteAlarm(SysBasicManageUserInfo userInfo, QueryMonitorSiteAlarmParams queryParams)
        {
            FWResult<List<MMonitorSiteAlarm>> result = new FWResult<List<MMonitorSiteAlarm>>();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            SysBasicManageUserInfo basicUserInfo = userInfo;
            if (!string.IsNullOrEmpty(basicUserInfo.operationMaintenancePersonCode))
            {
                queryParams.operationMaintenancePersonCode = basicUserInfo.operationMaintenancePersonCode;
            }
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@"  select top 100 MonitorSiteAlarm.id,MonitorSiteAlarm.monitorSiteAlarmCode
                                ,MonitorSiteAlarm.monitorSiteAlarmName,monitorSite.cantonCode,be.equipmentCode,be.equipmentName,be.equipmentNo
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
                                INNER JOIN dbo.BLLEquipment be WITH(NOLOCK) ON be.equipmentCode = MonitorSiteAlarm.equipmentCode and   be.moduleTypeCode= '1'
                                WHERE ISNULL(MonitorSiteAlarm.isDis,0)=0
                                ");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.monitorSiteAlarmCode))
                {
                    sbSql.AppendFormat(@" AND MonitorSiteAlarm.monitorSiteAlarmCode='{0}'", queryParams.monitorSiteAlarmCode);
                }
                else
                {
                    sbSql.AppendFormat(@" AND MonitorSiteAlarm.monitorSiteAlarmCode<>'{0}'", "3");
                }
                if (!string.IsNullOrEmpty(queryParams.operationMaintenancePersonCode))
                {
                    sbSql.AppendFormat(@" AND MonitorSiteAlarm.[monitorSiteCode]  IN ( SELECT  [monitorSiteCode] 
  FROM  [dbo].[BLLOperationMaintenancePersonMappingMonitorSite] WHERE  [operationMaintenancePersonCode] ='{0}' ) ", FWSqlCommandStaticHelper.checkParam(queryParams.operationMaintenancePersonCode));
                }
                if (queryParams.isHome.HasValue && queryParams.isHome.Value.Equals(true))
                {
                    sbSql.AppendFormat(@" AND  datediff(day,'{0}',MonitorSiteAlarm.alarmTime)>=0  ", DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd"));
                    sbSql.AppendFormat(@" AND   datediff(day,MonitorSiteAlarm.alarmTime,'{0}')>=0   ", DateTime.Now.ToString("yyyy-MM-dd"));
                    sbSql.AppendFormat(@" AND  ISNULL(task.isSolve,0)=0   ");
                }
            }

            //Roger 2016/6/1 13:00:02 增加管辖区域 
            sbSql.AppendFormat(@" order by  MonitorSiteAlarm.alarmTime desc ");
            sqlCmd.CommandText = sbSql.ToString();
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MMonitorSiteAlarm>(sqlCmd);
                result.status = FWResultStatus.Success;
            }
            catch
            {
                result.infoList.Add("查询出错。错误在【queryMonitorSiteAlarm】");
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        /// <summary>
        /// 修改报警信息
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="mEntity"></param>
        /// <returns></returns>
        public static FWResult<bool> updateMonitorSiteAlarm(SysBasicManageUserInfo userInfo, MMonitorSiteAlarm mEntity)
        {
            FWResult<bool> result = new FWResult<bool>();
            List<IFWCommand> BaseCommandList = new List<IFWCommand>();

            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            fwSqlTransaction.BeginTransaction();
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();

            mEntity.updaterID = userInfo.userID;
            mEntity.updateTime = DateTime.Now;

            BLLMonitorSiteAlarm Entity = OperationMaintenanceBll.convertEntity<BLLMonitorSiteAlarm>(mEntity);
            BaseCommandList.Add(OperationMaintenanceTaskDal.updateMonitorSiteAlarm(Entity));

            try
            {
                result.data = FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, BaseCommandList);
                result.status = FWResultStatus.Success;
                fwSqlTransaction.Commit();
            }
            catch
            {
                result.infoList.Add("操作失败。错误在【insertMaintenanceTask】");
                result.status = FWResultStatus.Failure;
                return result;
            }

            return result;
        }
    }
}
