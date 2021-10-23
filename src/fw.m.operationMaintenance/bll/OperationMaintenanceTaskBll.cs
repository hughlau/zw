using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwData;
using fw.fwDal;
using fw.m.Common;
using fw.m.sysBasicManage.data;
using fw.m.operationMaintenance.data.model;
using fw.m.operationMaintenance.data;
using fw.m.operationMaintenance.data.entity;
using fw.m.operationMaintenance.dal;
using fw.m.sysBasicManage.bll;
using fw.fwSession;
using fw.fwArcGIS;
using System.Data;
using fw.m.sysBasicManage.service;
using fw.m.sysManage.bll;
using fw.m.sysManage.data.model;
using System.Data.SqlClient;
using System.Diagnostics;
using log4net;
using Newtonsoft.Json;
using System.IO;
using System.Messaging;
using fw.m.basicInfo.data.entity;
using fw.m.basicInfo.dal;
using fw.m.basicInfo.bll;

namespace fw.m.operationMaintenance.bll
{

    public class OperationMaintenanceTaskBll
    {
        private static object logObject = new object();

        public static FWResult<FWPageData<MOperationMaintenanceTask>> queryPageMaintenanceTask(SysBasicManageUserInfo userInfo, FWPageParams pageParams, QueryTaskParams queryParams)
        {

            FWResult<FWPageData<MOperationMaintenanceTask>> result = new FWResult<FWPageData<MOperationMaintenanceTask>>();

            if (!string.IsNullOrEmpty(userInfo.operationMaintenancePersonCode))
            {
                queryParams.operationMaintenancePersonCode = userInfo.operationMaintenancePersonCode;
            }
            //Roger 2016/6/1 13:00:02 增加管辖区域
            if (userInfo.cantonCodeList == null || userInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            StringBuilder sqlbuilder = new StringBuilder();
            StringBuilder disStr = new StringBuilder();
            sqlbuilder.AppendFormat(@"select  * from (
SELECT distinct  monitorSite.cantonCode,canton.fullName cantonName,monitorSite.address
,monitorSite.longitude,monitorSite.latitude,be.equipmentName,be.equipmentNo
,TCMS.operationMaintenanceUnitCode,TCMS.operationMaintenanceUnitName
,MaintenanceTask.operationMaintenanceTaskCode,MaintenanceTask.operationMaintenanceTaskName
,MaintenanceTask.monitorSiteAlarmCode,MaintenanceTask.monitorSiteCode,monitorSite.monitorSiteName
,MaintenanceTask.faultTypeCode,faultType.name faultTypeName,MaintenanceTask.faultTime
,MaintenanceTask.taskTypeCode,taskType.name taskTypeName
,MaintenanceTask.prescribeRepairTime,MaintenanceTask.repairTime,'operationMaintenanceAir.htm' operationMaintenanceFormFileName
,MaintenanceTask.operationMaintenancePersonCode,MaintenancePerson.operationMaintenancePersonName
,ISNULL( MaintenanceTask.[status],1)[status],taskStatus.name taskStatusName,ISNULL(MaintenanceTask.isSolve,0) isSolve 
,ISNULL(MaintenanceTask.isGoSite,0)isGoSite,MaintenanceTask.opinion,MaintenanceTask.rem,MaintenanceTask.isDis
,MaintenanceTask.createrID,MaintenanceTask.createTime,MaintenanceTask.updaterID,MaintenanceTask.updateTime,MaintenanceTask.operationMaintenanceFormData,MaintenanceTask.remark
,MaintenanceTask.GPS,MaintenanceTask.imgName
FROM dbo.BLLOperationMaintenanceTask MaintenanceTask WITH(NOLOCK)
inner JOIN BLLMonitorSite monitorSite WITH(NOLOCK) ON monitorSite.monitorSiteCode = MaintenanceTask.monitorSiteCode
LEFT JOIN dbo.FWDictionary faultType WITH(NOLOCK) ON MaintenanceTask.faultTypeCode=faultType.code AND faultType.dictionaryTypeCode='BIZFaultType'
LEFT JOIN dbo.FWDictionary taskStatus WITH(NOLOCK) ON ISNULL( MaintenanceTask.[status],1)=taskStatus.code AND taskStatus.dictionaryTypeCode='BIZTaskStatus'
LEFT JOIN dbo.FWDictionary canton WITH(NOLOCK) ON monitorSite.cantonCode=canton.code AND canton.dictionaryTypeCode='BLLCanton'
LEFT JOIN dbo.FWDictionary taskType WITH(NOLOCK) ON MaintenanceTask.taskTypeCode=taskType.code AND taskType.dictionaryTypeCode='BIZTaskType'
LEFT JOIN BLLOperationMaintenancePerson MaintenancePerson WITH(NOLOCK) ON MaintenancePerson.operationMaintenancePersonCode = MaintenanceTask.operationMaintenancePersonCode

LEFT JOIN 
(
SELECT OMCS.monitorSiteCode,OMU.operationMaintenanceUnitCode,OMU.operationMaintenanceUnitName
  FROM  [dbo].[BLLOperationMaintenanceContract] OMC
  INNER JOIN  [dbo].[BLLOperationMaintenanceUnit] OMU  ON OMC.operationMaintenanceUnitCode=OMU.operationMaintenanceUnitCode
  INNER JOIN  [dbo].[BLLOperationMaintenanceContractMappingMonitorSite] OMCS ON OMC.[operationMaintenanceContractCode]= OMCS.[operationMaintenanceContractCode]
)  TCMS ON TCMS.monitorSiteCode = MaintenanceTask.monitorSiteCode
--LEFT JOIN dbo.BLLOperationMaintenanceUnit MaintenanceUnit WITH(NOLOCK) ON MaintenanceUnit.operationMaintenanceUnitCode = MaintenancePerson.operationMaintenanceUnitCode

left JOIN dbo.BLLEquipment be WITH(NOLOCK) ON be.equipmentCode = MaintenanceTask.equipmentCode 
WHERE ISNULL(MaintenanceTask.isDis,0)=0 and  be.moduleTypeCode= '1'
");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.keyword))
                {
                    sqlbuilder.AppendFormat(@" AND ( monitorSite.monitorSiteName like '%{0}%' OR be.equipmentNo like'%{0}%' or canton.fullName like'%{0}%' ) ", FWSqlCommandStaticHelper.checkParam(queryParams.keyword));
                }
                if (queryParams.dStart.HasValue && queryParams.dEnd.HasValue)
                {
                    sqlbuilder.AppendFormat(@" and (
(repairTime BETWEEN convert(datetime,'{0}') and  convert(datetime,'{1}'))   
or (faultTime BETWEEN convert(datetime,'{0}') and  convert(datetime,'{1}') ) 
or (faultTime <=  convert(datetime,'{0}') and repairTime >=  convert(datetime,'{1}') ) 
)", queryParams.dStart.Value.ToString("yyyy-MM-dd 00:00:00"), queryParams.dEnd.Value.ToString("yyyy-MM-dd 23:59:59"));
                }
                if (!string.IsNullOrEmpty(queryParams.faultType))
                {
                    sqlbuilder.AppendFormat(@" AND MaintenanceTask.faultTypeCode='{0}'", queryParams.faultType);
                }
                if (queryParams.isAlarm.HasValue && queryParams.isAlarm == 1)
                {
                    sqlbuilder.AppendFormat(@" AND MaintenanceTask.monitorSiteAlarmCode is not null ", queryParams.isAlarm);
                }
                else if (queryParams.isAlarm.HasValue && queryParams.isAlarm == 0)
                {
                    sqlbuilder.AppendFormat(@" AND MaintenanceTask.monitorSiteAlarmCode is null ");
                }
                //运维人员查询
                if (!string.IsNullOrEmpty(queryParams.TaskOMPersonCode))
                {
                    sqlbuilder.AppendFormat(@" AND  MaintenanceTask.operationMaintenancePersonCode ='{0}'   ", queryParams.TaskOMPersonCode);
                }

                if (!string.IsNullOrEmpty(queryParams.taskType))
                {
                    sqlbuilder.AppendFormat(@" AND MaintenanceTask.taskTypeCode='{0}'", queryParams.taskType);
                }
                #region 任务状态筛选
                //1 未接收 2  已接收  3 已退回  4 完成 
                //if (!string.IsNullOrEmpty(queryParams.taskStatus))
                //{
                //    sqlbuilder.AppendFormat(@" AND isnull(MaintenanceTask.[status],1)={0} ", queryParams.taskStatus); 
                //}

                if (!string.IsNullOrEmpty(queryParams.taskStatus))
                {   //app待接收列表，用虚拟的10代表任务状态为1,3,5（未接受、退回、拒接）
                    if (queryParams.taskStatus == "10")
                    {
                        sqlbuilder.AppendFormat(@" AND (ISNULL(MaintenanceTask.status,0) =1 or ISNULL(MaintenanceTask.status,0) =3 or ISNULL(MaintenanceTask.status,0) =5)", queryParams.isSolve);
                    }
                    else
                    {
                        sqlbuilder.AppendFormat(@" AND ISNULL(MaintenanceTask.status,0) ={0}", queryParams.taskStatus);
                    }
                }
                #endregion


                if (queryParams.isSolve.HasValue)
                {
                    sqlbuilder.AppendFormat(@" AND ISNULL(MaintenanceTask.isSolve,0) ={0}", queryParams.isSolve);
                }

                if (!string.IsNullOrEmpty(queryParams.cantonCode))
                {
                    //sqlbuilder.AppendFormat(@" and monitorSite.cantonCode in ( select cantoncode from [fn_getSubCanton_Dic]('{0}') ) ", FWSqlCommandStaticHelper.checkParam(queryParams.cantonCode));
                    sqlbuilder.AppendFormat(@" and monitorSite.cantonCode like '{0}%'", queryParams.cantonCode);
                }

                //设施故障统计中，按照现场设备编码统计运维任务  add by songshasha 2016-12-26
                if (!string.IsNullOrEmpty(queryParams.monitorSiteCode))
                {
                    sqlbuilder.AppendFormat(@" AND (MaintenanceTask.monitorSiteCode='{0}' or MaintenanceTask.monitorSiteCode is null)", queryParams.monitorSiteCode);
                }
                //本人负责的设施对应的运维任务以及所属运维单位负责的运维任务中没有分配运维人员的运维任务
                if (!string.IsNullOrEmpty(queryParams.operationMaintenancePersonCode))
                {
                    sqlbuilder.AppendFormat(@"
AND  EXISTS (
	SELECT t2.[monitorSiteCode] FROM  [dbo].[BLLOperationMaintenanceContract] t1
	INNER JOIN [dbo].[BLLOperationMaintenanceContractMappingMonitorSite] t2   ON t1.[operationMaintenanceContractCode]= t2.[operationMaintenanceContractCode] 
    INNER JOIN [dbo].[BLLOperationMaintenancePerson] t3 ON t3.[operationMaintenanceUnitCode]=t1.[operationMaintenanceUnitCode]
	WHERE  t2.[monitorSiteCode]=monitorSite.[monitorSiteCode]  AND t3.[operationMaintenancePersonCode]='{0}'
)  
AND  ( MaintenanceTask.operationMaintenancePersonCode IS NULL OR   MaintenanceTask.operationMaintenancePersonCode='{0}' ) 
", FWSqlCommandStaticHelper.checkParam(queryParams.operationMaintenancePersonCode));
                }
            }

            //Roger 2016/6/1 13:00:02 增加管辖区域
            sqlbuilder.AppendFormat(@" AND  ({0})  ", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", userInfo.cantonCodeList));

            sqlbuilder.Append(@" ) temp ");
            sqlbuilder.Append(@" order by ");
            if (pageParams.sortFieldList != null && pageParams.sortFieldList.Count > 0)
            {
                foreach (FWSortField fwSortField in pageParams.sortFieldList)
                {
                    disStr = new StringBuilder();
                    switch (fwSortField.fieldName)
                    {
                        case "faultTime":
                            fwSortField.fieldName = "[faultTime]";
                            break;
                        case "cantonName":
                            fwSortField.fieldName = "[cantonCode]";
                            break;
                        case "isSolve":
                            fwSortField.fieldName = "isSolve";
                            break;
                        case "prescribeRepairTime":
                            fwSortField.fieldName = "prescribeRepairTime";
                            break;
                        case "repairTime":
                            fwSortField.fieldName = "repairTime";
                            break;
                        case "distance":
                            if (queryParams != null && queryParams.latitude.HasValue && queryParams.longitude.HasValue)
                            {
                                disStr.AppendFormat(@"(SQUARE(longitude-" + queryParams.longitude + ")+SQUARE(latitude-" + queryParams.latitude + ")) {0},", fwSortField.sortType == FWSortType.Desc ? "desc" : "asc");
                            }
                            break;
                    }
                    if (disStr.Length > 0)
                    {
                        sqlbuilder.Append(disStr);
                    }
                    else
                    {
                        sqlbuilder.AppendFormat(@"{0} {1},", fwSortField.fieldName, fwSortField.sortType == FWSortType.Desc ? "desc" : "asc");
                    }
                }
                sqlbuilder.Remove(sqlbuilder.Length - 1, 1);
            }
            else
            {
                sqlbuilder.AppendFormat(" faultTime desc");
            }

            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MOperationMaintenanceTask>(fwPageProcedureParams);
                if (queryParams.latitude.HasValue && queryParams.longitude.HasValue && result.data.entityList != null && result.data.entityList.Count > 0)
                {
                    foreach (var i in result.data.entityList)
                    {
                        if (i.latitude.HasValue && i.longitude.HasValue)
                        {
                            i.distance = FWArcGISHelper.getDistance(queryParams.longitude.Value, queryParams.latitude.Value, i.longitude.Value, i.latitude.Value);
                        }
                    }
                }
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询监测点列表出错。错误在：【queryPageMaintenanceTask】" + ex.Message.ToString());
            }
            return result;
        }

        public static FWResult<FWPageData<MOperationMaintenanceTask>> queryPageBreakDownList(SysBasicManageUserInfo userInfo, FWPageParams pageParams, QueryTaskParams queryParams)
        {
            FWResult<FWPageData<MOperationMaintenanceTask>> result = new FWResult<FWPageData<MOperationMaintenanceTask>>();
            if (!string.IsNullOrEmpty(userInfo.operationMaintenancePersonCode))
            {
                queryParams.operationMaintenancePersonCode = userInfo.operationMaintenancePersonCode;
            }
            //Roger 2016/6/1 13:00:02 增加管辖区域
            if (userInfo.cantonCodeList == null || userInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            StringBuilder sqlbuilder = new StringBuilder();
            StringBuilder disStr = new StringBuilder();
            sqlbuilder.AppendFormat(@"select  * from (
SELECT distinct  monitorSite.cantonCode,canton.fullName cantonName,monitorSite.address
,monitorSite.longitude,monitorSite.latitude,be.equipmentName,be.equipmentNo
,TCMS.operationMaintenanceUnitCode,TCMS.operationMaintenanceUnitName
,MaintenanceTask.operationMaintenanceTaskCode,MaintenanceTask.operationMaintenanceTaskName
,MaintenanceTask.monitorSiteAlarmCode,MaintenanceTask.monitorSiteCode,monitorSite.monitorSiteName
,MaintenanceTask.faultTypeCode,faultType.name faultTypeName,MaintenanceTask.faultTime
,MaintenanceTask.taskTypeCode,taskType.name taskTypeName
,MaintenanceTask.prescribeRepairTime,MaintenanceTask.repairTime,ISNULL(faultType.fullCode,'operationMaintenanceNormal.htm') operationMaintenanceFormFileName
,MaintenanceTask.operationMaintenancePersonCode,MaintenancePerson.operationMaintenancePersonName
,ISNULL( MaintenanceTask.[status],1)[status],taskStatus.name taskStatusName,ISNULL(MaintenanceTask.isSolve,0) isSolve 
,ISNULL(MaintenanceTask.isGoSite,0)isGoSite,MaintenanceTask.opinion,MaintenanceTask.rem,MaintenanceTask.isDis
,MaintenanceTask.createrID,MaintenanceTask.createTime,MaintenanceTask.updaterID,MaintenanceTask.updateTime,MaintenanceTask.operationMaintenanceFormData,MaintenanceTask.remark
,MaintenanceTask.GPS
FROM dbo.BLLOperationMaintenanceTask MaintenanceTask WITH(NOLOCK)
inner JOIN BLLMonitorSite monitorSite WITH(NOLOCK) ON monitorSite.monitorSiteCode = MaintenanceTask.monitorSiteCode
LEFT JOIN dbo.FWDictionary faultType WITH(NOLOCK) ON MaintenanceTask.faultTypeCode=faultType.code AND faultType.dictionaryTypeCode='BIZFaultType'
LEFT JOIN dbo.FWDictionary taskStatus WITH(NOLOCK) ON ISNULL( MaintenanceTask.[status],1)=taskStatus.code AND taskStatus.dictionaryTypeCode='BIZTaskStatus'
LEFT JOIN dbo.FWDictionary canton WITH(NOLOCK) ON monitorSite.cantonCode=canton.code AND canton.dictionaryTypeCode='BLLCanton'
LEFT JOIN dbo.FWDictionary taskType WITH(NOLOCK) ON MaintenanceTask.taskTypeCode=taskType.code AND taskType.dictionaryTypeCode='BIZTaskType'
LEFT JOIN BLLOperationMaintenancePerson MaintenancePerson WITH(NOLOCK) ON MaintenancePerson.operationMaintenancePersonCode = MaintenanceTask.operationMaintenancePersonCode

LEFT JOIN 
(
SELECT OMCS.monitorSiteCode,OMU.operationMaintenanceUnitCode,OMU.operationMaintenanceUnitName
  FROM  [dbo].[BLLOperationMaintenanceContract] OMC
  INNER JOIN  [dbo].[BLLOperationMaintenanceUnit] OMU  ON OMC.operationMaintenanceUnitCode=OMU.operationMaintenanceUnitCode
  INNER JOIN  [dbo].[BLLOperationMaintenanceContractMappingMonitorSite] OMCS ON OMC.[operationMaintenanceContractCode]= OMCS.[operationMaintenanceContractCode]
)  TCMS ON TCMS.monitorSiteCode = MaintenanceTask.monitorSiteCode
--LEFT JOIN dbo.BLLOperationMaintenanceUnit MaintenanceUnit WITH(NOLOCK) ON MaintenanceUnit.operationMaintenanceUnitCode = MaintenancePerson.operationMaintenanceUnitCode

INNER JOIN dbo.BLLEquipment be WITH(NOLOCK) ON be.equipmentCode = MaintenanceTask.equipmentCode and   be.moduleTypeCode= '1'
WHERE ISNULL(MaintenanceTask.isDis,0)=0
");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.keyword))
                {
                    sqlbuilder.AppendFormat(@" AND ( monitorSite.monitorSiteName like '%{0}%' OR be.equipmentNo like'%{0}%' ) ", FWSqlCommandStaticHelper.checkParam(queryParams.keyword));
                }
                if (queryParams.dStart.HasValue && queryParams.dEnd.HasValue)
                {
                    sqlbuilder.AppendFormat(@" and faultTime BETWEEN convert(datetime,'{0}') and  convert(datetime,'{1}')", queryParams.dStart.Value.ToString("yyyy-MM-dd 00:00:00"), queryParams.dEnd.Value.ToString("yyyy-MM-dd 23:59:59"));
                }
                if (!string.IsNullOrEmpty(queryParams.faultType))
                {
                    sqlbuilder.AppendFormat(@" AND MaintenanceTask.faultTypeCode='{0}'", queryParams.faultType);
                }
                if (queryParams.isAlarm.HasValue && queryParams.isAlarm == 1)
                {
                    sqlbuilder.AppendFormat(@" AND MaintenanceTask.monitorSiteAlarmCode is not null ", queryParams.isAlarm);
                }
                else if (queryParams.isAlarm.HasValue && queryParams.isAlarm == 0)
                {
                    sqlbuilder.AppendFormat(@" AND MaintenanceTask.monitorSiteAlarmCode is null ");
                }
                //运维人员查询
                if (!string.IsNullOrEmpty(queryParams.TaskOMPersonCode))
                {
                    sqlbuilder.AppendFormat(@" AND  MaintenanceTask.operationMaintenancePersonCode ='{0}'   ", queryParams.TaskOMPersonCode);
                }

                if (!string.IsNullOrEmpty(queryParams.taskType))
                {
                    sqlbuilder.AppendFormat(@" AND MaintenanceTask.taskTypeCode='{0}'", queryParams.taskType);
                }
                #region 任务状态筛选
                //1 未接收 2  已接收  3 已退回  4 完成 
                if (!string.IsNullOrEmpty(queryParams.taskStatus))
                {
                    sqlbuilder.AppendFormat(@" AND isnull(MaintenanceTask.[status],1)={0} ", queryParams.taskStatus);
                }
                #endregion
                if (queryParams.isSolve.HasValue)
                {
                    sqlbuilder.AppendFormat(@" AND ISNULL(MaintenanceTask.isSolve,0) ={0}", queryParams.isSolve);
                }

                if (!string.IsNullOrEmpty(queryParams.cantonCode))
                {
                    sqlbuilder.AppendFormat(@" and monitorSite.cantonCode in ( select cantoncode from [fn_getSubCanton_Dic]('{0}') ) ", FWSqlCommandStaticHelper.checkParam(queryParams.cantonCode));
                }

                //设施故障统计中，按照现场设备编码统计运维任务  add by songshasha 2016-12-26
                if (!string.IsNullOrEmpty(queryParams.monitorSiteCode))
                {
                    sqlbuilder.AppendFormat(@" AND (MaintenanceTask.monitorSiteCode='{0}' or MaintenanceTask.monitorSiteCode is null)", queryParams.monitorSiteCode);
                }
                //本人负责的设施对应的运维任务以及所属运维单位负责的运维任务中没有分配运维人员的运维任务
                if (!string.IsNullOrEmpty(queryParams.operationMaintenancePersonCode))
                {
                    sqlbuilder.AppendFormat(@"
AND  EXISTS (
	SELECT t2.[monitorSiteCode] FROM  [dbo].[BLLOperationMaintenanceContract] t1
	INNER JOIN [dbo].[BLLOperationMaintenanceContractMappingMonitorSite] t2   ON t1.[operationMaintenanceContractCode]= t2.[operationMaintenanceContractCode] 
    INNER JOIN [dbo].[BLLOperationMaintenancePerson] t3 ON t3.[operationMaintenanceUnitCode]=t1.[operationMaintenanceUnitCode]
	WHERE  t2.[monitorSiteCode]=monitorSite.[monitorSiteCode]  AND t3.[operationMaintenancePersonCode]='{0}'
)  
AND  ( MaintenanceTask.operationMaintenancePersonCode IS NULL OR   MaintenanceTask.operationMaintenancePersonCode='{0}' ) 
", FWSqlCommandStaticHelper.checkParam(queryParams.operationMaintenancePersonCode));
                }
            }

            //Roger 2016/6/1 13:00:02 增加管辖区域
            sqlbuilder.AppendFormat(@" AND  ({0})  ", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", userInfo.cantonCodeList));

            sqlbuilder.Append(@" ) temp ");
            sqlbuilder.Append(@" order by ");
            if (pageParams.sortFieldList != null && pageParams.sortFieldList.Count > 0)
            {
                foreach (FWSortField fwSortField in pageParams.sortFieldList)
                {
                    disStr = new StringBuilder();
                    switch (fwSortField.fieldName)
                    {
                        case "faultTime":
                            fwSortField.fieldName = "[faultTime]";
                            break;
                        case "cantonName":
                            fwSortField.fieldName = "[cantonCode]";
                            break;
                        case "isSolve":
                            fwSortField.fieldName = "isSolve";
                            break;
                        case "prescribeRepairTime":
                            fwSortField.fieldName = "prescribeRepairTime";
                            break;
                        case "repairTime":
                            fwSortField.fieldName = "repairTime";
                            break;
                        case "distance":
                            if (queryParams != null && queryParams.latitude.HasValue && queryParams.longitude.HasValue)
                            {
                                disStr.AppendFormat(@"(SQUARE(longitude-" + queryParams.longitude + ")+SQUARE(latitude-" + queryParams.latitude + ")) {0},", fwSortField.sortType == FWSortType.Desc ? "desc" : "asc");
                            }
                            break;
                    }
                    if (disStr.Length > 0)
                    {
                        sqlbuilder.Append(disStr);
                    }
                    else
                    {
                        sqlbuilder.AppendFormat(@"{0} {1},", fwSortField.fieldName, fwSortField.sortType == FWSortType.Desc ? "desc" : "asc");
                    }
                }
                sqlbuilder.Remove(sqlbuilder.Length - 1, 1);
            }
            else
            {
                sqlbuilder.AppendFormat(" [prescribeRepairTime],isSolve");
            }

            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MOperationMaintenanceTask>(fwPageProcedureParams);
                if (queryParams.latitude.HasValue && queryParams.longitude.HasValue && result.data.entityList != null && result.data.entityList.Count > 0)
                {
                    foreach (var i in result.data.entityList)
                    {
                        if (i.latitude.HasValue && i.longitude.HasValue)
                        {
                            i.distance = FWArcGISHelper.getDistance(queryParams.longitude.Value, queryParams.latitude.Value, i.longitude.Value, i.latitude.Value);
                        }
                    }
                }
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询监测点列表出错。错误在：【queryPageMaintenanceTask】" + ex.Message.ToString());
            }
            return result;
        }

        public static FWResult<List<MOperationMaintenanceTask>> queryMaintenanceTask(IFWUserInfo userInfo, QueryTaskParams queryParams)
        {
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            if (!string.IsNullOrEmpty(basicUserInfo.operationMaintenancePersonCode))
            {
                queryParams.operationMaintenancePersonCode = basicUserInfo.operationMaintenancePersonCode;
            }
            FWResult<List<MOperationMaintenanceTask>> result = new FWResult<List<MOperationMaintenanceTask>>();


            //Roger 2016/6/1 13:00:02 增加管辖区域
            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@" SELECT 
monitorSite.cantonCode,canton.fullName cantonName,monitorSite.address
,monitorSite.longitude,monitorSite.latitude
,be.equipmentCode,be.equipmentName,be.equipmentNo
,MaintenanceUnit.operationMaintenanceUnitCode,MaintenanceUnit.operationMaintenanceUnitName
,MaintenanceTask.operationMaintenanceTaskCode,MaintenanceTask.operationMaintenanceTaskName
,MaintenanceTask.monitorSiteAlarmCode,MaintenanceTask.monitorSiteCode,monitorSite.monitorSiteName
,MaintenanceTask.faultTypeCode,faultType.name faultTypeName,MaintenanceTask.faultTime
,MaintenanceTask.taskTypeCode,taskType.name taskTypeName,operationMaintenanceFormData
,MaintenanceTask.prescribeRepairTime,MaintenanceTask.repairTime,'operationMaintenanceAir.htm' operationMaintenanceFormFileName
,MaintenanceTask.operationMaintenancePersonCode,MaintenancePerson.operationMaintenancePersonName
,ISNULL( MaintenanceTask.[status],1)[status],taskStatus.name taskStatusName,ISNULL(MaintenanceTask.isSolve,0) isSolve 
,ISNULL(MaintenanceTask.isGoSite,0)isGoSite,MaintenanceTask.opinion,MaintenanceTask.rem,MaintenanceTask.isDis
,MaintenanceTask.createrID,MaintenanceTask.createTime,MaintenanceTask.updaterID,MaintenanceTask.updateTime,MaintenanceTask.remark,MaintenanceTask.imgName,MaintenanceTask.GPS

FROM dbo.BLLOperationMaintenanceTask MaintenanceTask WITH(NOLOCK)
inner JOIN BLLMonitorSite monitorSite WITH(NOLOCK) ON monitorSite.monitorSiteCode = MaintenanceTask.monitorSiteCode
LEFT JOIN dbo.FWDictionary faultType WITH(NOLOCK) ON MaintenanceTask.faultTypeCode=faultType.code AND faultType.dictionaryTypeCode='BIZFaultType'
LEFT JOIN dbo.FWDictionary taskStatus WITH(NOLOCK) ON ISNULL( MaintenanceTask.[status],1)=taskStatus.code AND taskStatus.dictionaryTypeCode='BIZTaskStatus'
LEFT JOIN dbo.FWDictionary canton WITH(NOLOCK) ON monitorSite.cantonCode=canton.code AND canton.dictionaryTypeCode='BLLCanton'
LEFT JOIN dbo.FWDictionary taskType WITH(NOLOCK) ON MaintenanceTask.taskTypeCode=taskType.code AND taskType.dictionaryTypeCode='BIZTaskType'
LEFT JOIN BLLOperationMaintenancePerson MaintenancePerson WITH(NOLOCK) ON MaintenancePerson.operationMaintenancePersonCode = MaintenanceTask.operationMaintenancePersonCode
LEFT JOIN dbo.BLLOperationMaintenanceUnit MaintenanceUnit WITH(NOLOCK) ON MaintenanceUnit.operationMaintenanceUnitCode = MaintenancePerson.operationMaintenanceUnitCode
INNER JOIN dbo.BLLEquipment be WITH(NOLOCK) ON be.equipmentCode = MaintenanceTask.equipmentCode and   be.moduleTypeCode= '1'
WHERE ISNULL(MaintenanceTask.isDis,0)=0
");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.operationMaintenanceTaskCode))
                {
                    sbSql.AppendFormat(@" AND MaintenanceTask.operationMaintenanceTaskCode='{0}'", queryParams.operationMaintenanceTaskCode);
                }
                if (!string.IsNullOrEmpty(queryParams.monitorSiteAlarmCode))
                {
                    sbSql.AppendFormat(@" AND MaintenanceTask.monitorSiteAlarmCode='{0}'", queryParams.monitorSiteAlarmCode);
                }
                if (!string.IsNullOrEmpty(queryParams.operationMaintenancePersonCode))
                {
                    sbSql.AppendFormat(@" AND (MaintenanceTask.operationMaintenancePersonCode='{0}' or MaintenanceTask.operationMaintenancePersonCode is null)", queryParams.operationMaintenancePersonCode);
                }

            }

            //Roger 2016/6/1 13:00:02 增加管辖区域
            sbSql.AppendFormat(@" AND ({0})  ", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", basicUserInfo.cantonCodeList));

            sqlCmd.CommandText = sbSql.ToString();
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MOperationMaintenanceTask>(sqlCmd);
                result.status = FWResultStatus.Success;
            }
            catch
            {
                result.infoList.Add("查询出错。错误在【queryMaintenanceTask】");
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        public static FWResult<MOperationMaintenanceTask> queryMaintenanceTaskByAlarmCode(IFWUserInfo userInfo, QueryTaskParams queryParams)
        {
            FWResult<MOperationMaintenanceTask> result = new FWResult<MOperationMaintenanceTask>();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@"
SELECT MonitorSiteAlarm.id,MonitorSiteAlarm.monitorSiteAlarmCode
,MonitorSiteAlarm.monitorSiteAlarmName operationMaintenanceTaskName,monitorSite.cantonCode
,canton.name cantonName,MonitorSiteAlarm.monitorSiteCode,monitorSite.monitorSiteName
,MonitorSiteAlarm.alarmTypeCode faultTypeCode,alarmType.name faultTypeName,MonitorSiteAlarm.description rem
,MonitorSiteAlarm.alarmTime faultTime,be.equipmentCode,be.equipmentName
,MonitorSiteAlarm.isGenerateTask,MonitorSiteAlarm.isSolve,MonitorSiteAlarm.opinion
,tempTable.operationMaintenancePersonCode,tempTable.operationMaintenancePersonName
,tempTable.operationMaintenanceUnitCode,tempTable.operationMaintenanceUnitName
FROM dbo.BLLMonitorSiteAlarm MonitorSiteAlarm WITH(NOLOCK)
LEFT JOIN dbo.BLLMonitorSite monitorSite WITH(NOLOCK) ON MonitorSiteAlarm.monitorSiteCode=monitorSite.monitorSiteCode
LEFT JOIN dbo.FWDictionary alarmType WITH(NOLOCK) ON MonitorSiteAlarm.alarmTypeCode=alarmType.code AND alarmType.dictionaryTypeCode='BIZFaultType'
LEFT JOIN dbo.FWDictionary canton WITH(NOLOCK) ON monitorSite.cantonCode=canton.code AND canton.dictionaryTypeCode='BLLCanton'
LEFT JOIN(
SELECT PersonMappingMonitorSite.monitorSiteCode
,PersonMappingMonitorSite.operationMaintenancePersonCode,MaintenancePerson.operationMaintenancePersonName
,MaintenanceUnit.operationMaintenanceUnitCode,MaintenanceUnit.operationMaintenanceUnitName
,MaintenanceContract.operationMaintenanceContractName
FROM dbo.BLLOperationMaintenancePersonMappingMonitorSite PersonMappingMonitorSite WITH(NOLOCK) 
LEFT JOIN dbo.BLLOperationMaintenancePerson MaintenancePerson WITH(NOLOCK) ON MaintenancePerson.operationMaintenancePersonCode = PersonMappingMonitorSite.operationMaintenancePersonCode
LEFT JOIN dbo.BLLOperationMaintenanceUnit  MaintenanceUnit WITH(NOLOCK) ON MaintenancePerson.operationMaintenanceUnitCode=MaintenanceUnit.operationMaintenanceUnitCode
LEFT JOIN dbo.BLLOperationMaintenanceContract MaintenanceContract WITH(NOLOCK) ON MaintenanceContract.operationMaintenanceUnitCode = MaintenanceUnit.operationMaintenanceUnitCode
WHERE ISNULL(MaintenancePerson.isDis,0)=0 AND ISNULL(MaintenanceUnit.isDis,0)=0 AND ISNULL(MaintenanceContract.isDis,0)=0 
AND GETDATE() BETWEEN MaintenanceContract.effectiveTime AND MaintenanceContract.failTime
) tempTable ON tempTable.monitorSiteCode = MonitorSiteAlarm.monitorSiteCode
INNER JOIN dbo.BLLEquipment be WITH(NOLOCK) ON be.equipmentCode = MonitorSiteAlarm.equipmentCode and  be.moduleTypeCode= '1'
WHERE ISNULL(MonitorSiteAlarm.isDis,0)=0 ");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.monitorSiteAlarmCode))
                {
                    sbSql.AppendFormat(@" AND MonitorSiteAlarm.monitorSiteAlarmCode='{0}'", queryParams.monitorSiteAlarmCode);
                }
            }

            //Roger 2016/6/1 13:00:02 增加管辖区域
            sbSql.AppendFormat(@" AND  ({0})  ", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", basicUserInfo.cantonCodeList));

            sqlCmd.CommandText = sbSql.ToString();
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.query<MOperationMaintenanceTask>(sqlCmd);
                result.status = FWResultStatus.Success;
            }
            catch
            {
                result.infoList.Add("查询失败。");
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        public static FWResult<MOperationMaintenanceTaskStatistics> queryMaintenanceTaskStatistics(IFWUserInfo userInfo, QueryTaskParams queryParams)
        {
            if (queryParams == null) { queryParams = new QueryTaskParams(); }
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            if (!string.IsNullOrEmpty(basicUserInfo.operationMaintenancePersonCode))
            {
                queryParams.operationMaintenancePersonCode = basicUserInfo.operationMaintenancePersonCode;
            }

            FWResult<MOperationMaintenanceTaskStatistics> result = new FWResult<MOperationMaintenanceTaskStatistics>();

            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@"
select MaintenanceTask.operationMaintenanceTaskCode
,MaintenanceTask.operationMaintenancePersonCode 
,MaintenanceTask.[status] 
from dbo.BLLOperationMaintenanceTask MaintenanceTask WITH(NOLOCK)
inner JOIN BLLMonitorSite monitorSite WITH(NOLOCK) ON monitorSite.monitorSiteCode = MaintenanceTask.monitorSiteCode  
WHERE ISNULL(MaintenanceTask.isDis,0)=0    
AND  EXISTS (
SELECT t2.[monitorSiteCode] FROM  [dbo].[BLLOperationMaintenanceContract] t1
INNER JOIN [dbo].[BLLOperationMaintenanceContractMappingMonitorSite] t2   ON t1.[operationMaintenanceContractCode]= t2.[operationMaintenanceContractCode] 
INNER JOIN [dbo].[BLLOperationMaintenancePerson] t3 ON t3.[operationMaintenanceUnitCode]=t1.[operationMaintenanceUnitCode]
WHERE  t2.[monitorSiteCode]=monitorSite.[monitorSiteCode]  AND t3.[operationMaintenancePersonCode]='{0}'
)  
AND ( MaintenanceTask.operationMaintenancePersonCode IS NULL OR  MaintenanceTask.operationMaintenancePersonCode='{0}' )
", queryParams.operationMaintenancePersonCode);
            sqlCmd.CommandText = sbSql.ToString();
            try
            {
                var taskList = FWSqlEntityToFWCommandStaticHelper.queryList<MOperationMaintenanceTask>(sqlCmd);
                MOperationMaintenanceTaskStatistics taskStatistics = new MOperationMaintenanceTaskStatistics();
                if (taskList != null && taskList.Count > 0)
                {
                    taskStatistics.alreadyReceive = taskList.Where(p => p.status.Equals("2")).Count();  //已接收
                    taskStatistics.waitReceive = taskList.Where(p => p.status.Equals("1") || p.status.Equals("3") || p.status.Equals("5")).Count();  //待接收或退回或拒接
                    taskStatistics.finishReceive = taskList.Where(p => p.status.Equals("4")).Count();  //已完成
                }
                result.data = taskStatistics;
                result.status = FWResultStatus.Success;
            }
            catch
            {
                result.infoList.Add("查询失败,错误在【queryMaintenanceTaskStatistics】");
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        public static FWResult<bool> insertMaintenanceTask(IFWUserInfo userInfo, MOperationMaintenanceTask mEntity)
        {
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;

            FWResult<bool> result = new FWResult<bool>();
            List<IFWCommand> BaseCommandList = new List<IFWCommand>();

            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            fwSqlTransaction.BeginTransaction();
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();

            mEntity.operationMaintenanceTaskCode = Guid.NewGuid().ToString();
            mEntity.isDis = 0;
            mEntity.createrID = userInfo.userID;
            mEntity.createTime = DateTime.Now;
            mEntity.updaterID = mEntity.createrID;
            mEntity.updateTime = mEntity.createTime;
            if (string.IsNullOrEmpty(mEntity.status))
            {
                if (!string.IsNullOrEmpty(mEntity.operationMaintenancePersonCode))
                {
                    mEntity.status = DictionaryTypeCodeSettings.EnumReceiveStatusCode;
                }
                else
                {
                    mEntity.operationMaintenancePersonCode = null;
                    mEntity.status = DictionaryTypeCodeSettings.EnumWaitReceiveStatusCode;
                }
            }


            BLLOperationMaintenanceTask Entity = OperationMaintenanceBll.convertEntity<BLLOperationMaintenanceTask>(mEntity);
            BaseCommandList.Add(OperationMaintenanceTaskDal.insertMaintenanceTask(Entity));
            if (!string.IsNullOrEmpty(mEntity.monitorSiteAlarmCode))
            {
                sbSql.AppendFormat("update BLLMonitorSiteAlarm set isGenerateTask=1 where monitorSiteAlarmCode=@monitorSiteAlarmCode");
                sqlCmd.Parameters.AddWithValue("@monitorSiteAlarmCode", mEntity.monitorSiteAlarmCode);
                sqlCmd.CommandText = sbSql.ToString();
                BaseCommandList.Add(sqlCmd);
            }
            try
            {
                result.data = FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, BaseCommandList);
                result.status = FWResultStatus.Success;
                fwSqlTransaction.Commit();

                if (mEntity.status == DictionaryTypeCodeSettings.EnumReceiveStatusCode && !string.IsNullOrEmpty(mEntity.operationMaintenancePersonCode) && userInfo.userID != mEntity.operationMaintenancePersonCode)
                {
                    var omPerson = OperationMaintenancePersonBll.queryMOperationMaintenancePersonByPersonCode(userInfo, mEntity.operationMaintenancePersonCode);
                    if (omPerson.status == FWResultStatus.Success && omPerson.data != null && !string.IsNullOrEmpty(omPerson.data.userID))
                    {
                        var requestUserInfo = FWUserInfoBll.queryByMUserID(userInfo, omPerson.data.userID);
                        if (requestUserInfo.status == FWResultStatus.Success && requestUserInfo.data != null && !string.IsNullOrEmpty(requestUserInfo.data.mDeviceOperatingSystemCode) && !string.IsNullOrEmpty(requestUserInfo.data.mDeviceAlias))
                        {
                            Dictionary<string, object> protocol = new Dictionary<string, object>();
                            protocol["t"] = "运维任务";
                            protocol["c"] = mEntity.operationMaintenanceTaskName;
                            protocol["u"] = "18505127807@omPerson";
                            protocol["p"] = "personTask-" + DictionaryTypeCodeSettings.EnumReceiveStatusCode;
                            Dictionary<string, object> protocolData = new Dictionary<string, object>();
                            protocolData["operationMaintenanceTaskCode"] = mEntity.operationMaintenanceTaskCode;
                            protocolData["operationMaintenanceTaskName"] = mEntity.operationMaintenanceTaskName;
                            protocol["d"] = protocolData;

                            FWMessageBll.insertOrUpdateByMDataID(userInfo, new MFWMessage()
                            {
                                mMessageSendTypeCode = "11",
                                mDeviceOperatingSystemCode = requestUserInfo.data.mDeviceOperatingSystemCode,
                                mDeviceAlias = requestUserInfo.data.mDeviceAlias,
                                mMessageTitle = protocol["t"].ToString(),
                                mMessageContent = protocol["c"].ToString(),
                                mMessageProtocol = fw.fwJson.FWJsonHelper.serializeObject(protocol),
                                mExpireTime = mEntity.prescribeRepairTime.HasValue ? mEntity.prescribeRepairTime.Value : DateTime.Now.AddDays(1),
                            });
                        }
                    }
                }
            }
            catch
            {
                result.infoList.Add(" 任务生成失败。错误在【insertMaintenanceTask】");
                fwSqlTransaction.Rollback();
                fwSqlTransaction.Close();
                result.status = FWResultStatus.Failure;
                //return result;
            }

            try
            {
                if (!string.IsNullOrEmpty(mEntity.operationMaintenancePersonCode))
                {
                    //add by songshasha 2017-04-18  报警信息生成任务后，发送邮件、推送app消息              
                    QueryTaskParams param = new QueryTaskParams();
                    param.operationMaintenanceTaskCode = mEntity.operationMaintenanceTaskCode.ToString();
                    List<MOperationMaintenanceTask> maintenanceTask = queryMaintenanceTaskByGT(param);

                    StringBuilder selectUserMail = new StringBuilder();
                    selectUserMail.Append("select a.email,a.userID from FWUserInfo  a,[dbo].[BLLOperationMaintenancePerson] b where a.userID=b.userid and b.[operationMaintenancePersonCode]='" + mEntity.operationMaintenancePersonCode + "' ");
                    FWSqlCommand selectCmd = new FWSqlCommand();
                    selectCmd.CommandText = selectUserMail.ToString();
                    string userEmail = FWSqlCommandStaticHelper.ExecuteDataTable(selectCmd).Rows[0][0].ToString();
                    string userId = FWSqlCommandStaticHelper.ExecuteDataTable(selectCmd).Rows[0][1].ToString();
                    //GetuiServerApiSDK.PushMessageBll.BindClientId(userInfo,"43b12644fce52988ed3caffa6fa1aa9b");


                    //邮件发送
                    if (!string.IsNullOrEmpty(userEmail))
                    {
                        foreach (var item in maintenanceTask)
                        {
                            string title = "现场设备" + item.monitorSiteName + "发生" + item.taskTypeName + ",请及时处理";
                            string mailMessage = "现场设备" + item.monitorSiteName + "发生" + item.taskTypeName + ",位置:" + item.cantonName + ",任务详情：" + item.operationMaintenanceTaskName;
                            GetuiServerApiSDK.PushMessageBll.sendMail(userEmail, title, mailMessage);
                        }

                    }
                    if (!string.IsNullOrEmpty(userId))
                    {
                        // 个推 ，app消息推送
                        foreach (var item in maintenanceTask)
                        {
                            string message = fwJson.FWJsonHelper.serializeObject(item);
                            GetuiServerApiSDK.PushMessageBll.PushMessageToSingle(userId, message, "");
                        }
                    }
                }
            }
            catch (Exception e)
            {
                result.infoList.Add("任务生成成功，但app消息推送或邮件发送失败");
                result.status = FWResultStatus.Failure;
                //throw e;
            }



            return result;
        }

        public static FWResult<bool> updateMaintenanceTask(IFWUserInfo userInfo1, MOperationMaintenanceTask mEntity)
        {
            FWResult<bool> result = new FWResult<bool>();

            SysBasicManageUserInfo userInfo = (SysBasicManageUserInfo)userInfo1;
            if (mEntity.status == DictionaryTypeCodeSettings.EnumReceiveStatusCode)
            {
                if (String.IsNullOrEmpty(mEntity.operationMaintenancePersonCode))
                {
                    if (!string.IsNullOrEmpty(userInfo.operationMaintenancePersonCode))
                    {
                        mEntity.operationMaintenancePersonCode = userInfo.operationMaintenancePersonCode;
                    }
                }
                mEntity.receiveTime = DateTime.Now;


            }
            if (mEntity.status == DictionaryTypeCodeSettings.EnumFinishReceiveStatusCode)
            {
                mEntity.repairTime = DateTime.Now;
                mEntity.isSolve = 1;
            }
            //任务退回状态 
            if (mEntity.status == DictionaryTypeCodeSettings.EnumBackReceiveStatusCode)
            {
                mEntity.operationMaintenancePersonCode = null;  //默认设置为空
            }
            //任务拒接状态 
            if (mEntity.status == DictionaryTypeCodeSettings.EnumRefuseReceiveStatusCode)
            {
                mEntity.operationMaintenancePersonCode = null;  //默认设置为空
            }
            //
            if (mEntity.isSolve == 1)
            {
                mEntity.status = DictionaryTypeCodeSettings.EnumFinishReceiveStatusCode;
                //modify by songshasha 2017-02-13 运维任务反馈时，没有将任务状态赋值为完成时，先赋值任务修复时间，导致任务修复时间一直没被更新
                mEntity.repairTime = DateTime.Now;
                mEntity.isSolve = 1;
            }

            List<IFWCommand> BaseCommandList = new List<IFWCommand>();

            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            fwSqlTransaction.BeginTransaction();
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();

            mEntity.updaterID = userInfo.userID;
            mEntity.updateTime = DateTime.Now;

            BLLOperationMaintenanceTask Entity = OperationMaintenanceBll.convertEntity<BLLOperationMaintenanceTask>(mEntity);
            BaseCommandList.Add(OperationMaintenanceTaskDal.updateMaintenanceTask(Entity));

            try
            {

                //status在日常运维单中代表设备的状态，3代表供电故障，当供电故障时，将现场设备状态修改为3,3在设备状态中代表供电故障。。
                //供电故障改为报停设备
                if (!string.IsNullOrEmpty(mEntity.monitorSiteCode) && mEntity.rem == "3")
                {
                    sqlCmd.CommandText = "update BLLMonitorSiteRealtimeFactorData set dataState=13,updateTime='" + DateTime.Now + "',updaterID='" + userInfo.userID + "' where monitorSiteCode='" + mEntity.monitorSiteCode + "' and monitorFactorCode='000008';";

                    FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, sqlCmd);

                }


                result.data = FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, BaseCommandList);

                //Roger 报警生成的任务，如果任务解决，则报警任务设置为已经解决 2016/6/12 11:17:44
                if (Entity.isSolve == 1)
                {
                    //
                    var task =
                        MBaseBll.bllQuerry<BLLOperationMaintenanceTask>(
                            "select * from BLLOperationMaintenanceTask where operationMaintenanceTaskCode = '" +
                            Entity.operationMaintenanceTaskCode + "'", fwSqlTransaction);
                    //
                    BLLMonitorSiteAlarm alarm =
                        MBaseBll.bllQuerry<BLLMonitorSiteAlarm>(
                            "select * from BLLMonitorSiteAlarm where monitorSiteAlarmCode = '" +
                            task.monitorSiteAlarmCode +
                            "'", fwSqlTransaction);
                    if (alarm != null)
                    {
                        alarm.isSolve = (int)task.isSolve;
                        alarm.updaterID = task.updaterID;
                        alarm.updateTime = (DateTime)task.updateTime;
                        List<string> listWhere = new List<string>();
                        listWhere.Add("monitorSiteAlarmCode");
                        if (MBaseBll.baseUpdate(alarm, listWhere, fwSqlTransaction) != 1)
                        {
                            throw new Exception("更新出错！");
                        }
                    }
                }

                //Roger 添加对应零部件信息 2016/6/2 12:08:47
                string fromData = Entity.operationMaintenanceFormData;
                if (!string.IsNullOrEmpty(fromData))
                {
                    var listData = fromData.Replace("{", "").Replace("}", "").Replace("\"", "").Split(',');
                    var equipment = listData.Where(str => str.Contains("equipmentPart") || str.Contains("changeNum")).Select(str => str);
                    string equipCode = string.Empty;
                    string num = string.Empty;
                    foreach (var str in equipment)
                    {
                        var arr = str.Split(':');
                        if (str.Contains("equipmentPart")) equipCode = arr[1];
                        if (str.Contains("changeNum")) num = arr[1] ?? "1";
                    }
                    //
                    if (!string.IsNullOrEmpty(equipCode))
                    {
                        BLLOperationMaintenanceEquipmentPart omep = new BLLOperationMaintenanceEquipmentPart();
                        omep.OMEP_ID = MBaseBll.GetDBGuid();
                        omep.operationMaintenanceTaskCode = mEntity.operationMaintenanceTaskCode;
                        omep.partCode = equipCode;
                        omep.changeNum = string.IsNullOrEmpty(num) ? 0 : int.Parse(num);
                        omep.creater = userInfo.userID;
                        omep.createTime = DateTime.Now;
                        omep.updater = userInfo.userID;
                        omep.updateTime = DateTime.Now;
                        //
                        FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, FWSqlEntityToFWCommandStaticHelper.insert(omep));
                    }
                }
                //
                result.status = FWResultStatus.Success;
                fwSqlTransaction.Commit();

                var requestMEntityList = queryMaintenanceTask(userInfo1, new QueryTaskParams() { operationMaintenanceTaskCode = mEntity.operationMaintenanceTaskCode });
                if (requestMEntityList.status == FWResultStatus.Success && requestMEntityList.data != null && requestMEntityList.data.Count > 0)
                {
                    mEntity = requestMEntityList.data[0];
                }
                if (mEntity != null && mEntity.status == DictionaryTypeCodeSettings.EnumReceiveStatusCode && !string.IsNullOrEmpty(mEntity.operationMaintenancePersonCode) && userInfo.userID != mEntity.operationMaintenancePersonCode)
                {
                    var omPerson = OperationMaintenancePersonBll.queryMOperationMaintenancePersonByPersonCode(userInfo, mEntity.operationMaintenancePersonCode);
                    if (omPerson.status == FWResultStatus.Success && omPerson.data != null && !string.IsNullOrEmpty(omPerson.data.userID))
                    {
                        var requestUserInfo = FWUserInfoBll.queryByMUserID(userInfo, omPerson.data.userID);
                        if (requestUserInfo.status == FWResultStatus.Success && requestUserInfo.data != null && !string.IsNullOrEmpty(requestUserInfo.data.mDeviceOperatingSystemCode) && !string.IsNullOrEmpty(requestUserInfo.data.mDeviceAlias))
                        {
                            Dictionary<string, object> protocol = new Dictionary<string, object>();
                            protocol["t"] = "运维任务";
                            protocol["c"] = mEntity.operationMaintenanceTaskName;
                            protocol["u"] = requestUserInfo.data.mUserName;
                            protocol["p"] = "personTask-" + DictionaryTypeCodeSettings.EnumReceiveStatusCode;
                            Dictionary<string, object> protocolData = new Dictionary<string, object>();
                            protocolData["operationMaintenanceTaskCode"] = mEntity.operationMaintenanceTaskCode;
                            protocolData["operationMaintenanceTaskName"] = mEntity.operationMaintenanceTaskName;
                            protocol["d"] = protocolData;

                            FWMessageBll.insertOrUpdateByMDataID(userInfo, new MFWMessage()
                            {
                                mMessageSendTypeCode = "11",
                                mDeviceOperatingSystemCode = requestUserInfo.data.mDeviceOperatingSystemCode,
                                mDeviceAlias = requestUserInfo.data.mDeviceAlias,
                                mMessageTitle = protocol["t"].ToString(),
                                mMessageContent = protocol["c"].ToString(),
                                mMessageProtocol = fw.fwJson.FWJsonHelper.serializeObject(protocol),
                                mExpireTime = mEntity.prescribeRepairTime.HasValue ? mEntity.prescribeRepairTime.Value : DateTime.Now.AddDays(1),
                            });
                        }
                    }
                }
            }
            catch
            {
                result.infoList.Add("操作失败。错误在【updateMaintenanceTask】");
                fwSqlTransaction.Rollback();
                fwSqlTransaction.Close();
                result.status = FWResultStatus.Failure;
                return result;
            }

            return result;
        }

        public static FWResult<bool> insertPatrolMaintenanceTask(IFWUserInfo userInfo, MOperationMaintenanceTask mEntity)
        {
            //Roger 2016/6/1 13:00:02 增加管辖区域
            FWResult<bool> result = new FWResult<bool>();
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            //
            if (mEntity == null)
            {
                mEntity = new MOperationMaintenanceTask();
            }
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@"SELECT monitorSite.id,monitorSite.monitorSiteCode,monitorSite.monitorSiteName
,monitorSite.cantonCode,canton.fullName cantonName,monitorSite.operateTime
,monitorSite.treatmentAbility,monitorSite.householdsCount,monitorSite.longitude,monitorSite.latitude
,monitorSite.address,monitorSite.rem,monitorSite.isDis,monitorSite.createrID
,monitorSite.createTime,monitorSite.updaterID,monitorSite.updateTime
,monitorSite.PPCode
    ,monitorSite.moduleTypeCode
    ,monitorSite.SIMCard
 FROM dbo.BLLMonitorSite monitorSite
LEFT JOIN dbo.FWDictionary canton ON monitorSite.cantonCode=canton.code AND canton.dictionaryTypeCode='BLLCanton'
WHERE ISNULL(monitorSite.isDis,0)=0");
            if (!string.IsNullOrEmpty(mEntity.monitorSiteCode))
            {
                sbSql.AppendFormat(@" AND monitorSite.monitorSiteCode=@monitorSiteCode");
                sqlCmd.Parameters.AddWithValue("@monitorSiteCode", mEntity.monitorSiteCode);
            }

            //Roger 2016/6/1 13:00:02 增加管辖区域
            sbSql.AppendFormat(@" AND ({0})  ", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", basicUserInfo.cantonCodeList));


            sqlCmd.CommandText = sbSql.ToString();
            DataTable dt = FWSqlCommandStaticHelper.ExecuteDataTable(sqlCmd);
            if (dt != null && dt.Rows.Count > 0)
            {
                mEntity.monitorSiteName = dt.Rows[0]["monitorSiteName"].ToString();
                mEntity.cantonName = dt.Rows[0]["cantonName"].ToString();
            }
            mEntity.isSolve = 1;
            mEntity.isGoSite = 1;
            mEntity.repairTime = DateTime.Now;
            mEntity.operationMaintenanceTaskName = mEntity.cantonName + mEntity.monitorSiteName + "巡检任务";
            return insertMaintenanceTask(userInfo, mEntity);
        }

        public static FWResult<bool> generateTask(SysBasicManageUserInfo userInfo, List<MOperationMaintenanceTask> mEntityList)
        {
            FWResult<bool> result = new FWResult<bool>();
            List<IFWCommand> BaseCommandList = new List<IFWCommand>();

            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            fwSqlTransaction.BeginTransaction();
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            foreach (MOperationMaintenanceTask mEntity in mEntityList)
            {
                mEntity.operationMaintenanceTaskCode = Guid.NewGuid().ToString();
                mEntity.isDis = 0;
                mEntity.createrID = userInfo.userID;
                mEntity.createTime = DateTime.Now;
                mEntity.updaterID = mEntity.createrID;
                mEntity.updateTime = mEntity.createTime;

                BLLOperationMaintenanceTask Entity = OperationMaintenanceBll.convertEntity<BLLOperationMaintenanceTask>(mEntity);
                BaseCommandList.Add(OperationMaintenanceTaskDal.insertMaintenanceTask(Entity));

                sbSql.AppendFormat(@"
update BLLMonitorSiteAlarm set isGenerateTask=1 where monitorSiteAlarmCode=@monitorSiteAlarmCode");
                sqlCmd.Parameters.AddWithValue("@monitorSiteAlarmCode", mEntity.monitorSiteAlarmCode);
                sqlCmd.CommandText = sbSql.ToString();
                BaseCommandList.Add(sqlCmd);
            }
            try
            {
                result.data = FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, BaseCommandList);
                result.status = FWResultStatus.Success;
                fwSqlTransaction.Commit();
            }
            catch
            {
                result.infoList.Add("操作失败。错误在【generateTask】");
                fwSqlTransaction.Rollback();
                result.status = FWResultStatus.Failure;
                return result;
            }

            return result;
        }

        public static List<MMonitorSite> queryPersonMaintenanceTask(IFWUserInfo userInfo, QueryTaskParams queryParams)
        {
            FWResult<List<MMonitorSite>> result = new FWResult<List<MMonitorSite>>();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                return new List<MMonitorSite>();
            }

            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@" SELECT PersonMappingMonitorSite.monitorSiteCode,monitorSite.monitorSiteName
,monitorSite.cantonCode,canton1.name cantonName,monitorSite.address
,canton1.pCode parentCantonCode,canton2.name parentCantonName
FROM dbo.BLLOperationMaintenancePersonMappingMonitorSite PersonMappingMonitorSite WITH(NOLOCK)
INNER JOIN dbo.BLLMonitorSite monitorSite WITH(NOLOCK) ON monitorSite.monitorSiteCode = PersonMappingMonitorSite.monitorSiteCode
INNER JOIN  dbo.FWDictionary canton1 ON MonitorSite.cantonCode=canton1.code AND canton1.dictionaryTypeCode='BLLCanton' 
INNER JOIN dbo.FWDictionary canton2 ON canton2.code=canton1.[pCode] AND canton2.dictionaryTypeCode='BLLCanton'
INNER JOIN dbo.BLLOperationMaintenancePerson person WITH(NOLOCK) ON person.operationMaintenancePersonCode = PersonMappingMonitorSite.operationMaintenancePersonCode
WHERE 1=1");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.operationMaintenancePersonCode))
                {
                    sbSql.AppendFormat(@" AND PersonMappingMonitorSite.operationMaintenancePersonCode='{0}'", queryParams.operationMaintenancePersonCode);
                }
            }

            //Roger 2016/6/1 13:00:02 增加管辖区域
            sbSql.AppendFormat(@" AND ({0})  ", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", basicUserInfo.cantonCodeList));

            sqlCmd.CommandText = sbSql.ToString();
            return FWSqlEntityToFWCommandStaticHelper.queryList<MMonitorSite>(sqlCmd);
        }

        public static FWResult<FWPageData<MOperationMaintenanceTask>> queryPagePersonMaintenanceTask(SysBasicManageUserInfo userInfo, FWPageParams pageParams, QueryTaskParams queryParams)
        {
            FWResult<FWPageData<MOperationMaintenanceTask>> result = new FWResult<FWPageData<MOperationMaintenanceTask>>();
            if (!string.IsNullOrEmpty(userInfo.operationMaintenancePersonCode))
            {
                queryParams.operationMaintenancePersonCode = userInfo.operationMaintenancePersonCode;
            }
            //Roger 2016/6/1 13:00:02 增加管辖区域
            if (userInfo.cantonCodeList == null || userInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            StringBuilder sqlbuilder = new StringBuilder();
            StringBuilder disStr = new StringBuilder();
            sqlbuilder.AppendFormat(@"select  * from (
SELECT distinct monitorSite.cantonCode,canton.fullName cantonName,monitorSite.address
,monitorSite.longitude,monitorSite.latitude,be.equipmentName,be.equipmentNo
,TCMS.operationMaintenanceUnitCode,TCMS.operationMaintenanceUnitName
,MaintenanceTask.operationMaintenanceTaskCode,MaintenanceTask.operationMaintenanceTaskName
,MaintenanceTask.monitorSiteAlarmCode,MaintenanceTask.monitorSiteCode,monitorSite.monitorSiteName
,MaintenanceTask.faultTypeCode,faultType.name faultTypeName,MaintenanceTask.faultTime
,MaintenanceTask.taskTypeCode,taskType.name taskTypeName
,MaintenanceTask.prescribeRepairTime,MaintenanceTask.repairTime,ISNULL(faultType.fullCode,'operationMaintenanceNormal.htm') operationMaintenanceFormFileName
,MaintenanceTask.operationMaintenancePersonCode,MaintenancePerson.operationMaintenancePersonName
,ISNULL( MaintenanceTask.[status],1)[status],taskStatus.name taskStatusName,ISNULL(MaintenanceTask.isSolve,0) isSolve 
,ISNULL(MaintenanceTask.isGoSite,0)isGoSite,MaintenanceTask.opinion,MaintenanceTask.rem,MaintenanceTask.isDis
,MaintenanceTask.createrID,MaintenanceTask.createTime,MaintenanceTask.updaterID,MaintenanceTask.updateTime,MaintenanceTask.operationMaintenanceFormData,MaintenanceTask.remark
,MaintenanceTask.GPS
FROM dbo.BLLOperationMaintenanceTask MaintenanceTask WITH(NOLOCK)
inner JOIN BLLMonitorSite monitorSite WITH(NOLOCK) ON monitorSite.monitorSiteCode = MaintenanceTask.monitorSiteCode
LEFT JOIN dbo.FWDictionary faultType WITH(NOLOCK) ON MaintenanceTask.faultTypeCode=faultType.code AND faultType.dictionaryTypeCode='BIZFaultType'
LEFT JOIN dbo.FWDictionary taskStatus WITH(NOLOCK) ON ISNULL( MaintenanceTask.[status],1)=taskStatus.code AND taskStatus.dictionaryTypeCode='BIZTaskStatus'
LEFT JOIN dbo.FWDictionary canton WITH(NOLOCK) ON monitorSite.cantonCode=canton.code AND canton.dictionaryTypeCode='BLLCanton'
LEFT JOIN dbo.FWDictionary taskType WITH(NOLOCK) ON MaintenanceTask.taskTypeCode=taskType.code AND taskType.dictionaryTypeCode='BIZTaskType'
LEFT JOIN BLLOperationMaintenancePerson MaintenancePerson WITH(NOLOCK) ON MaintenancePerson.operationMaintenancePersonCode = MaintenanceTask.operationMaintenancePersonCode

LEFT JOIN 
(
SELECT OMCS.monitorSiteCode,OMU.operationMaintenanceUnitCode,OMU.operationMaintenanceUnitName
  FROM  [dbo].[BLLOperationMaintenanceContract] OMC
  INNER JOIN  [dbo].[BLLOperationMaintenanceUnit] OMU  ON OMC.operationMaintenanceUnitCode=OMU.operationMaintenanceUnitCode
  INNER JOIN  [dbo].[BLLOperationMaintenanceContractMappingMonitorSite] OMCS ON OMC.[operationMaintenanceContractCode]= OMCS.[operationMaintenanceContractCode]
)  TCMS ON TCMS.monitorSiteCode = MaintenanceTask.monitorSiteCode
--LEFT JOIN dbo.BLLOperationMaintenanceUnit MaintenanceUnit WITH(NOLOCK) ON MaintenanceUnit.operationMaintenanceUnitCode = MaintenancePerson.operationMaintenanceUnitCode

INNER JOIN dbo.BLLEquipment be WITH(NOLOCK) ON be.equipmentCode = MaintenanceTask.equipmentCode 
--and be.equipmentNo like '0008%'
WHERE ISNULL(MaintenanceTask.isDis,0)=0
");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.keyword))
                {
                    sqlbuilder.AppendFormat(@" AND ( monitorSite.monitorSiteName like '%{0}%' OR be.equipmentNo like'%{0}%' ) ", FWSqlCommandStaticHelper.checkParam(queryParams.keyword));
                }
                if (queryParams.dStart.HasValue && queryParams.dEnd.HasValue)
                {
                    sqlbuilder.AppendFormat(@" and (
(repairTime BETWEEN convert(datetime,'{0}') and  convert(datetime,'{1}'))   
or (faultTime BETWEEN convert(datetime,'{0}') and  convert(datetime,'{1}') ) 
or (faultTime <=  convert(datetime,'{0}') and repairTime >=  convert(datetime,'{1}') ) 
)", queryParams.dStart.Value.ToString("yyyy-MM-dd 00:00:00"), queryParams.dEnd.Value.ToString("yyyy-MM-dd 23:59:59"));
                }
                if (!string.IsNullOrEmpty(queryParams.faultType))
                {
                    sqlbuilder.AppendFormat(@" AND MaintenanceTask.faultTypeCode='{0}'", queryParams.faultType);
                }
                if (queryParams.isAlarm.HasValue && queryParams.isAlarm == 1)
                {
                    sqlbuilder.AppendFormat(@" AND MaintenanceTask.monitorSiteAlarmCode is not null ", queryParams.isAlarm);
                }
                else if (queryParams.isAlarm.HasValue && queryParams.isAlarm == 0)
                {
                    sqlbuilder.AppendFormat(@" AND MaintenanceTask.monitorSiteAlarmCode is null ");
                }
                //运维人员查询
                if (!string.IsNullOrEmpty(queryParams.TaskOMPersonCode))
                {
                    sqlbuilder.AppendFormat(@" AND  MaintenanceTask.operationMaintenancePersonCode ='{0}'   ", queryParams.TaskOMPersonCode);
                }

                if (!string.IsNullOrEmpty(queryParams.taskType))
                {
                    sqlbuilder.AppendFormat(@" AND MaintenanceTask.taskTypeCode='{0}'", queryParams.taskType);
                }
                #region 任务状态筛选
                //1 未接收 2  已接收  3 已退回  4 完成 
                if (!string.IsNullOrEmpty(queryParams.taskStatus))
                {
                    sqlbuilder.AppendFormat(@" AND isnull(MaintenanceTask.[status],1)={0} ", queryParams.taskStatus);
                }
                #endregion
                if (queryParams.isSolve.HasValue)
                {
                    sqlbuilder.AppendFormat(@" AND ISNULL(MaintenanceTask.isSolve,0) ={0}", queryParams.isSolve);
                }

                if (!string.IsNullOrEmpty(queryParams.cantonCode))
                {
                    sqlbuilder.AppendFormat(@" and monitorSite.cantonCode in ( select cantoncode from [fn_getSubCanton_Dic]('{0}') ) ", FWSqlCommandStaticHelper.checkParam(queryParams.cantonCode));
                }
                //本人负责的设施对应的运维任务以及所属运维单位负责的运维任务中没有分配运维人员的运维任务
                if (!string.IsNullOrEmpty(queryParams.operationMaintenancePersonCode))
                {
                    sqlbuilder.AppendFormat(@"
AND  EXISTS (
	SELECT t2.[monitorSiteCode] FROM  [dbo].[BLLOperationMaintenanceContract] t1
	INNER JOIN [dbo].[BLLOperationMaintenanceContractMappingMonitorSite] t2   ON t1.[operationMaintenanceContractCode]= t2.[operationMaintenanceContractCode] 
    INNER JOIN [dbo].[BLLOperationMaintenancePerson] t3 ON t3.[operationMaintenanceUnitCode]=t1.[operationMaintenanceUnitCode]
	WHERE  t2.[monitorSiteCode]=monitorSite.[monitorSiteCode]  AND t3.[operationMaintenancePersonCode]='{0}'
)  
AND  ( MaintenanceTask.operationMaintenancePersonCode='{0}' ) 
", FWSqlCommandStaticHelper.checkParam(queryParams.operationMaintenancePersonCode));
                }
            }

            //Roger 2016/6/1 13:00:02 增加管辖区域
            sqlbuilder.AppendFormat(@" AND  ({0})  ", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", userInfo.cantonCodeList));
            sqlbuilder.Append(@" ) temp ");
            sqlbuilder.Append(@" order by ");
            if (pageParams.sortFieldList != null && pageParams.sortFieldList.Count > 0)
            {
                foreach (FWSortField fwSortField in pageParams.sortFieldList)
                {
                    disStr = new StringBuilder();
                    switch (fwSortField.fieldName)
                    {
                        case "faultTime":
                            fwSortField.fieldName = "[faultTime]";
                            break;
                        case "cantonName":
                            fwSortField.fieldName = "[cantonCode]";
                            break;
                        case "isSolve":
                            fwSortField.fieldName = "isSolve";
                            break;
                        case "prescribeRepairTime":
                            fwSortField.fieldName = "prescribeRepairTime";
                            break;
                        case "repairTime":
                            fwSortField.fieldName = "repairTime";
                            break;
                        case "distance":
                            if (queryParams != null && queryParams.latitude.HasValue && queryParams.longitude.HasValue)
                            {
                                disStr.AppendFormat(@"(SQUARE(longitude-" + queryParams.longitude + ")+SQUARE(latitude-" + queryParams.latitude + ")) {0},", fwSortField.sortType == FWSortType.Desc ? "desc" : "asc");
                            }
                            break;
                    }
                    if (disStr.Length > 0)
                    {
                        sqlbuilder.Append(disStr);
                    }
                    else
                    {
                        sqlbuilder.AppendFormat(@"{0} {1},", fwSortField.fieldName, fwSortField.sortType == FWSortType.Desc ? "desc" : "asc");
                    }
                }
                sqlbuilder.Remove(sqlbuilder.Length - 1, 1);
            }
            else
            {
                sqlbuilder.AppendFormat(" [prescribeRepairTime],isSolve");
            }

            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MOperationMaintenanceTask>(fwPageProcedureParams);
                if (queryParams.latitude.HasValue && queryParams.longitude.HasValue && result.data.entityList != null && result.data.entityList.Count > 0)
                {
                    foreach (var i in result.data.entityList)
                    {
                        if (i.latitude.HasValue && i.longitude.HasValue)
                        {
                            i.distance = FWArcGISHelper.getDistance(queryParams.longitude.Value, queryParams.latitude.Value, i.longitude.Value, i.latitude.Value);
                        }
                    }
                }
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询监测点列表出错。错误在：【queryPageMaintenanceTask】" + ex.Message.ToString());
            }
            return result;
        }

        //查询更换零部件列表
        public static FWResult<FWPageData<QuerryMaintenanceEquipmentPart>> queryPageMaintenanceEquipmentPart(IFWUserInfo userInfo, FWPageParams pageParams, QuerryMaintenanceEquipmentPart queryParams)
        {
            //
            FWResult<FWPageData<QuerryMaintenanceEquipmentPart>> result = new FWResult<FWPageData<QuerryMaintenanceEquipmentPart>>();
            StringBuilder sqlbuilder = new StringBuilder();
            sqlbuilder.AppendFormat(@"SELECT ep.partName, omep.changeNum, omt.operationMaintenanceTaskName, omp.operationMaintenancePersonName, omep.createTime
                                         FROM dbo.BLLOperationMaintenanceEquipmentPart omep, dbo.BLLOperationMaintenanceTask omt, 
	                                          dbo.BLLOperationMaintenancePerson omp, dbo.BLLEquipmentPart ep
                                        WHERE omep.operationMaintenanceTaskCode = omt.operationMaintenanceTaskCode
                                          AND omt.operationMaintenancePersonCode = omp.operationMaintenancePersonCode
                                          AND omep.partCode = ep.partCode");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.keyword))
                {
                    sqlbuilder.AppendFormat(@" AND ep.partName like'%{0}%'", FWSqlCommandStaticHelper.checkParam(queryParams.keyword));
                }
            }
            sqlbuilder.Append(@" order by omep.createTime desc");
            //
            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<QuerryMaintenanceEquipmentPart>(fwPageProcedureParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询监测点列表出错。错误在：【queryPageMaintenanceEquipmentPart】" + ex.Message);
            }
            return result;
        }

        public static List<MOperationMaintenanceTask> queryMaintenanceTaskByGT(QueryTaskParams queryParams)
        {
            //SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            //if (!string.IsNullOrEmpty(basicUserInfo.operationMaintenancePersonCode))
            //{
            //    queryParams.operationMaintenancePersonCode = basicUserInfo.operationMaintenancePersonCode;
            //}
            //FWResult<List<MOperationMaintenanceTask>> result = new FWResult<List<MOperationMaintenanceTask>>();


            //Roger 2016/6/1 13:00:02 增加管辖区域
            //if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            //{
            //    result.status = FWResultStatus.Failure;
            //    result.infoList.Add(constCommon.cartonErr);
            //    return result;
            //}

            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@" SELECT 
monitorSite.cantonCode,canton.fullName cantonName,monitorSite.address
,monitorSite.longitude,monitorSite.latitude
,be.equipmentCode,be.equipmentName,be.equipmentNo
,MaintenanceUnit.operationMaintenanceUnitCode,MaintenanceUnit.operationMaintenanceUnitName
,MaintenanceTask.operationMaintenanceTaskCode,MaintenanceTask.operationMaintenanceTaskName
,MaintenanceTask.monitorSiteAlarmCode,MaintenanceTask.monitorSiteCode,monitorSite.monitorSiteName
,MaintenanceTask.faultTypeCode,faultType.name faultTypeName,MaintenanceTask.faultTime
,MaintenanceTask.taskTypeCode,taskType.name taskTypeName,operationMaintenanceFormData
,MaintenanceTask.prescribeRepairTime,MaintenanceTask.repairTime,faultType.fullCode operationMaintenanceFormFileName
,MaintenanceTask.operationMaintenancePersonCode,MaintenancePerson.operationMaintenancePersonName
,ISNULL( MaintenanceTask.[status],1)[status],taskStatus.name taskStatusName,ISNULL(MaintenanceTask.isSolve,0) isSolve 
,ISNULL(MaintenanceTask.isGoSite,0)isGoSite,MaintenanceTask.opinion,MaintenanceTask.rem,MaintenanceTask.isDis
,MaintenanceTask.createrID,MaintenanceTask.createTime,MaintenanceTask.updaterID,MaintenanceTask.updateTime,MaintenanceTask.remark

FROM dbo.BLLOperationMaintenanceTask MaintenanceTask WITH(NOLOCK)
inner JOIN BLLMonitorSite monitorSite WITH(NOLOCK) ON monitorSite.monitorSiteCode = MaintenanceTask.monitorSiteCode
LEFT JOIN dbo.FWDictionary faultType WITH(NOLOCK) ON MaintenanceTask.faultTypeCode=faultType.code AND faultType.dictionaryTypeCode='BIZFaultType'
LEFT JOIN dbo.FWDictionary taskStatus WITH(NOLOCK) ON ISNULL( MaintenanceTask.[status],1)=taskStatus.code AND taskStatus.dictionaryTypeCode='BIZTaskStatus'
LEFT JOIN dbo.FWDictionary canton WITH(NOLOCK) ON monitorSite.cantonCode=canton.code AND canton.dictionaryTypeCode='BLLCanton'
LEFT JOIN dbo.FWDictionary taskType WITH(NOLOCK) ON MaintenanceTask.taskTypeCode=taskType.code AND taskType.dictionaryTypeCode='BIZTaskType'
LEFT JOIN BLLOperationMaintenancePerson MaintenancePerson WITH(NOLOCK) ON MaintenancePerson.operationMaintenancePersonCode = MaintenanceTask.operationMaintenancePersonCode
LEFT JOIN dbo.BLLOperationMaintenanceUnit MaintenanceUnit WITH(NOLOCK) ON MaintenanceUnit.operationMaintenanceUnitCode = MaintenancePerson.operationMaintenanceUnitCode
INNER JOIN dbo.BLLEquipment be WITH(NOLOCK) ON be.equipmentCode = MaintenanceTask.equipmentCode and be.equipmentNo like '0008%'
WHERE ISNULL(MaintenanceTask.isDis,0)=0
");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.operationMaintenanceTaskCode))
                {
                    sbSql.AppendFormat(@" AND MaintenanceTask.operationMaintenanceTaskCode='{0}'", queryParams.operationMaintenanceTaskCode);
                }
                if (!string.IsNullOrEmpty(queryParams.monitorSiteAlarmCode))
                {
                    sbSql.AppendFormat(@" AND MaintenanceTask.monitorSiteAlarmCode='{0}'", queryParams.monitorSiteAlarmCode);
                }
                if (!string.IsNullOrEmpty(queryParams.operationMaintenancePersonCode))
                {
                    sbSql.AppendFormat(@" AND (MaintenanceTask.operationMaintenancePersonCode='{0}' or MaintenanceTask.operationMaintenancePersonCode is null)", queryParams.operationMaintenancePersonCode);
                }
            }

            //Roger 2016/6/1 13:00:02 增加管辖区域
            //sbSql.AppendFormat(@" AND ({0})  ", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", basicUserInfo.cantonCodeList));

            sqlCmd.CommandText = sbSql.ToString();
            //try
            //{
            //    result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MOperationMaintenanceTask>(sqlCmd);
            //    result.status = FWResultStatus.Success;
            //}
            //catch
            //{
            //    result.infoList.Add("查询出错。错误在【queryMaintenanceTask】");
            //    result.status = FWResultStatus.Failure;
            //}
            return FWSqlEntityToFWCommandStaticHelper.queryList<MOperationMaintenanceTask>(sqlCmd);
        }

        /// <summary>
        /// 通许故障任务的生成，通过window服务定时调用此方法  add by songshasha 2016-12-19
        /// </summary>
        /// <returns></returns>
        public static FWResult<bool> autoGenerateTask()
        {
            FWResult<bool> result = new FWResult<bool>();

            SqlCommand cmd = new SqlCommand()
            {
                CommandType = CommandType.Text,
                CommandText = "select b.equipmentNo,a.monitorValue,a.monitorTime from BLLMonitorSiteRealtimeFactorData a ,BLLEquipment b " +
                              "where DATEADD(day,2,a.monitorTime) < GETDATE () and a.monitorValue is not null and a.equipmentCode=b.equipmentCode "
            };

            DataSet ds = FWSqlCommandStaticHelper.ExecuteDataSet(cmd);

            for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
            {
                string ltuMac = ds.Tables[0].Rows[i][0].ToString();
                string monitorValue = ds.Tables[0].Rows[i][1].ToString();
                string createTime = ds.Tables[0].Rows[i][2].ToString();
                fw.m.operationMaintenance.data.model.MBllRealTimeData entity = new data.model.MBllRealTimeData();
                entity.ltuMac = ltuMac;
                entity.wKqbCurValue = monitorValue;
                entity.createDateTime = Convert.ToDateTime(createTime);
                result = generateTaskAndSendMessagebak(entity);
            }
            return result;

        }


        public static string queryEquipmentTypeCode(string equipmentNo)
        {

            string equipmentTypeCode = string.Empty;
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@" 
                SELECT a.equipmentTypeCode FROM  [dbo].[BLLEquipment] a,  [BLLMonitorSite] b    
                WHERE  a.monitorSiteCode=b.monitorSiteCode  and (a.[equipmentNo] ='{0}' and ISNULL(a.isDel,0)=0 ) ",
                FWSqlCommandStaticHelper.checkParam(equipmentNo));

            sqlCmd.CommandText = sbSql.ToString();
            try
            {
                DataTable dt = FWSqlCommandStaticHelper.ExecuteDataTable(sqlCmd);
                if (dt != null && dt.Rows.Count > 0 && dt.Rows[0]["equipmentTypeCode"] != null)
                {
                    equipmentTypeCode = dt.Rows[0]["equipmentTypeCode"].ToString();
                }


            }
            catch (Exception ex)
            {
                throw ex;
            }
            return equipmentTypeCode;
        }


        public void WriteLog(string sText)
        {

            string logFileAbsolutePath = "d:\\Log" + DateTime.Now.ToString("yyMMdd").ToString() + ".txt";

            FileStream fs = null;
            StreamWriter sw = null;
            try
            {

                if (!File.Exists(logFileAbsolutePath))
                {
                    string logFolderAbsolutePath = System.IO.Path.GetDirectoryName(logFileAbsolutePath);
                    if (!Directory.Exists(logFolderAbsolutePath))
                    {
                        Directory.CreateDirectory(logFolderAbsolutePath);
                    }
                    fs = File.Create(logFileAbsolutePath);
                }
                else
                {
                    FileInfo fi = new FileInfo(logFileAbsolutePath);
                    fs = new FileStream(logFileAbsolutePath, FileMode.Append, FileAccess.Write);
                }
                sw = new StreamWriter(fs, Encoding.GetEncoding("gb2312"));
                sw.WriteLine("-----" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "--------------------");
                sw.WriteLine("操作/异常内容：" + sText);
                sw.WriteLine();

                if (sw != null)
                {
                    sw.Close();
                }
                if (fs != null)
                {
                    fs.Close();
                }
            }
            catch
            {
                if (sw != null)
                {
                    sw.Close();
                }
                if (fs != null)
                {
                    fs.Close();
                }
            }

        }


        /// <summary>
        /// 处理云表实时数据
        /// </summary>
        /// <returns></returns>
        public static FWResult<bool> generateTaskAndSendMessage(JJMBllRealTimeData entity)
        {
            FWResult<bool> result = new FWResult<bool>();
            result.status = FWResultStatus.Success;
            string operationMaintenancePersonCode = "";
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            try
            {
                //事物开始
                fwSqlTransaction.BeginTransaction();

                for (int i = 0; i < entity.dataList.Count; i++)
                {
                    if (entity.dataList[i].deviceType == 0)
                    {
                        continue;
                    }

                    JJMBllRealTimeDataDevice deviceModel = entity.dataList[i];
                    string deviceData = deviceModel.deviceData;
                    JJMBllRealTimeDataDevice deviceModelStatus = entity.stateList.FirstOrDefault<JJMBllRealTimeDataDevice>(p => p.deviceId == deviceModel.deviceId && p.deviceType == 1);
                    if (deviceModelStatus == null)
                    {
                        string sText = "处理同步数据失败(无state信息),报文:" + JsonConvert.SerializeObject(entity);
                        string logpath = fwConfig.FWConfigHelper.getValue("Fail_LogPath");
                        WriteLog(sText, logpath);
                        continue;
                    }

                    JJMBLLRealTimeDataDeviceData_Monitor entityMonitor = JsonConvert.DeserializeObject<JJMBLLRealTimeDataDeviceData_Monitor>(deviceData);

                    /* --------------气泵报警开始----------------------*/
                    QueryTaskParams param = new QueryTaskParams();
                    Guid operationMaintenanceTaskCode = System.Guid.NewGuid();  //程序中生成运维任务的code

                    //处理数据
                    var isContains = RealTimeData._listMonitor.Select(s => s.equipmentNo).ToList().Contains(deviceModel.deviceId);
                    if (!isContains)
                        RealTimeData._listMonitor = GetMOnitorSiteCode();
                    dealEntity(entityMonitor, fwSqlTransaction);

                    /* --------------气泵报警结束----------------------*/


                    /* --------------水泵报警开始----------------------*/

                    string deviceDataStatus = deviceModelStatus.deviceData;
                    JJMBLLRealTimeDataDeviceData_Status entityStatus = JsonConvert.DeserializeObject<JJMBLLRealTimeDataDeviceData_Status>(deviceDataStatus);
                    QueryTaskParams paramWaterPump = new QueryTaskParams();
                    Guid operationMaintenanceTaskCodeWaterPump = System.Guid.NewGuid();  //程序中生成运维任务的code
                    string waterPumpAlarm = entityStatus.bit3.ToString();
                    string windPumpAlarm = entityStatus.bit4.ToString();
                    SqlParameter[] SqlParameterSWaterPump = {
                                             new SqlParameter("@ltuMac",entityStatus.deviceId),
                                             new SqlParameter("@waterPumpAlarm",waterPumpAlarm=="开"?1:0),
                                             new SqlParameter("@waterLowLine",entityStatus.bit1=="开"?1:0),
                                             new SqlParameter("@waterHighLine",entityStatus.bit2=="开"?1:0),
                                             new SqlParameter("@createDateTime",entityStatus.time) ,
                                             new SqlParameter("@operationMaintenanceTaskCode",operationMaintenanceTaskCodeWaterPump),
                                             new SqlParameter("@equipmentType","1"),
                                             new SqlParameter("@operationMaintenancePersonCode",SqlDbType.VarChar,36),
                                             new SqlParameter("@isGenerateTask",SqlDbType.Int,1),
                                             new SqlParameter("@userEmail",SqlDbType.VarChar,50),
                                             new SqlParameter("@windPumpAlarm",windPumpAlarm=="开"?1:0),
                                             new SqlParameter("@waterPumpValue",entityMonitor.data7)
                                           };
                    SqlParameterSWaterPump[7].Direction = ParameterDirection.Output;
                    SqlParameterSWaterPump[8].Direction = ParameterDirection.Output;
                    SqlParameterSWaterPump[9].Direction = ParameterDirection.Output;
                    SqlCommand cmdWaterPump = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = "rpt_InsertRealTimeWaterpumpData"
                    };
                    cmdWaterPump.Parameters.AddRange(SqlParameterSWaterPump);

                    DataSet dsWaterPump = FWSqlCommandStaticHelper.ExecuteDataSet(fwSqlTransaction.DbTransaction, cmdWaterPump);
                    operationMaintenancePersonCode = SqlParameterSWaterPump[7].Value.ToString();
                    int isGenerateTaskWaterPump = Convert.ToInt32(SqlParameterSWaterPump[8].Value.ToString());
                    string userEmailWaterPump = SqlParameterSWaterPump[9].Value.ToString();

                    /* --------------水泵报警结束----------------------*/
                }

                //事物提交
                fwSqlTransaction.Commit();

            }
            catch (Exception ex)
            {
                fwSqlTransaction.Rollback();
                string sText = "处理同步数据失败,报文:" + JsonConvert.SerializeObject(entity) + "" + Environment.NewLine + ex.Message;
                string logpath = fwConfig.FWConfigHelper.getValue("Fail_LogPath");
                WriteLog(sText, logpath);
                result.infoList.Add(ex.Message + ex.ToString());
                result.status = FWResultStatus.Failure;
            }
            finally
            {
                fwSqlTransaction.Close();
            }
            return result;

        }

        /// <summary>
        /// 处理慧联无限网关数据
        /// </summary>
        /// <returns></returns>
        public static FWResult<bool> generateHLWXGatewayMessage(HTTPRealTimeData entity)
        {
            FWResult<bool> result = new FWResult<bool>();
            BLLGatewayRealtimeData bLLGatewayRealtimeData = new BLLGatewayRealtimeData();
            try
            {
                BLLEquipment bLLEquipment = EquipmentBll.queryEquipmentByNo(entity.device_id).data;
                if (bLLEquipment != null)
                {
                    entity.data.time = entity.data.time.Replace("CST", "").Trim();
                    DateTime monitorTime = Convert.ToDateTime(entity.data.time);
                    BLLGatewayRealtimeData data = BLLGatewayRealtimeDataDal.queryEquipmentByNo(bLLEquipment.equipmentCode);
                    //如果不存在，插入数据
                    if (data == null)
                    {
                        BLLGatewayRealtimeData insertData = new BLLGatewayRealtimeData();
                        insertData.code = bLLEquipment.equipmentCode;
                        insertData.monitorTime = monitorTime;
                        insertData.dataState = 0;
                        insertData.lastMonitorTime = DateTime.Now;
                        BLLGatewayRealtimeDataDal.insert(insertData);
                    }
                    else//否则，修改网关上报时间
                    {
                        data.lastMonitorTime = data.monitorTime;
                        data.monitorTime = monitorTime;
                        data.dataState = 0;
                        BLLGatewayRealtimeDataDal.update(data);
                    }
                    result.status = FWResultStatus.Success;
                }
                else
                {
                    result.status = FWResultStatus.Failure;
                    result.infoList.Add("网关设备不存在！");
                }
            }
            catch (Exception ex)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(ex.Message);
            }
            return result;
        }

        /// <summary>
        /// 处理慧联无限实时数据
        /// </summary>
        /// <returns></returns>
        public static FWResult<bool> generateHLWXTaskAndSendMessage(HTTPRealTimeData entity)
        {
            FWResult<bool> result = new FWResult<bool>();
            result.status = FWResultStatus.Success;
            string operationMaintenancePersonCode = "";
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            try
            {
                //事物开始
                fwSqlTransaction.BeginTransaction();
                HTTPRealTimeData_DeviceMsg deviceModel = entity.data;

                /* --------------气泵报警开始----------------------*/
                QueryTaskParams param = new QueryTaskParams();
                Guid operationMaintenanceTaskCode = System.Guid.NewGuid();  //程序中生成运维任务的code
                //处理数据
                var isContains = RealTimeData._listMonitor.Select(s => s.equipmentNo).ToList().Contains(entity.device_id);
                if (!isContains)
                    RealTimeData._listMonitor = GetMOnitorSiteCode();
                dealHLWXEntity(deviceModel, fwSqlTransaction, entity.device_id);
                /* --------------气泵报警结束----------------------*/

                /* --------------水泵报警开始----------------------*/
                QueryTaskParams paramWaterPump = new QueryTaskParams();
                Guid operationMaintenanceTaskCodeWaterPump = System.Guid.NewGuid();  //程序中生成运维任务的code
                SqlParameter[] SqlParameterSWaterPump = {
                                             new SqlParameter("@ltuMac",entity.device_id),
                                             new SqlParameter("@waterPumpAlarm",deviceModel.water_pump_state),
                                             new SqlParameter("@waterLowLine",deviceModel.well_low_state),
                                             new SqlParameter("@waterHighLine",deviceModel.well_high_state),
                                             new SqlParameter("@createDateTime",ConvertLongToDateTime(deviceModel.collect_time)) ,
                                             new SqlParameter("@operationMaintenanceTaskCode",operationMaintenanceTaskCodeWaterPump),
                                             new SqlParameter("@equipmentType","1"),
                                             new SqlParameter("@operationMaintenancePersonCode",SqlDbType.VarChar,36),
                                             new SqlParameter("@isGenerateTask",SqlDbType.Int,1),
                                             new SqlParameter("@userEmail",SqlDbType.VarChar,50),
                                             new SqlParameter("@windPumpAlarm",deviceModel.off_machine_alarm),
                                             new SqlParameter("@drugAlarm",deviceModel.drug_level_state),
                                             new SqlParameter("@waterPumpValue",deviceModel.draught_fan_current)
                                           };
                SqlParameterSWaterPump[7].Direction = ParameterDirection.Output;
                SqlParameterSWaterPump[8].Direction = ParameterDirection.Output;
                SqlParameterSWaterPump[9].Direction = ParameterDirection.Output;
                SqlCommand cmdWaterPump = new SqlCommand()
                {
                    CommandType = CommandType.StoredProcedure,
                    CommandText = "rpt_InsertRealTimeWaterpumpData"
                };
                cmdWaterPump.Parameters.AddRange(SqlParameterSWaterPump);
                DataSet dsWaterPump = FWSqlCommandStaticHelper.ExecuteDataSet(fwSqlTransaction.DbTransaction, cmdWaterPump);

                /* --------------水泵报警结束----------------------*/

                /* --------------药泵报警开始----------------------*/
                if (entity.data.drug_level_state == 1)
                {
                    drugAlarm(fwSqlTransaction, entity);
                }
                /* --------------药泵报警结束----------------------*/

                //事物提交
                fwSqlTransaction.Commit();
            }
            catch (Exception ex)
            {
                fwSqlTransaction.Rollback();
                string sText = "处理同步数据失败,报文:" + JsonConvert.SerializeObject(entity) + "" + Environment.NewLine + ex.Message;
                string logpath = fwConfig.FWConfigHelper.getValue("Fail_LogPath");
                WriteLog(sText, logpath);
                result.infoList.Add(ex.Message + ex.ToString());
                result.status = FWResultStatus.Failure;
            }
            finally
            {
                fwSqlTransaction.Close();
            }
            return result;

        }

        public static void drugAlarm(FWSqlTransaction fwSqlTransaction, HTTPRealTimeData entity)
        {
            HTTPRealTimeData_DeviceMsg deviceModel = entity.data;
            QueryTaskParams paramWaterPump = new QueryTaskParams();
            Guid operationMaintenanceTaskCodeWaterPump = System.Guid.NewGuid();  //程序中生成运维任务的code
            SqlParameter[] SqlParameterSWaterPump = {
                                             new SqlParameter("@ltuMac",entity.device_id),
                                             new SqlParameter("@createDateTime",ConvertLongToDateTime(deviceModel.collect_time)) ,
                                             new SqlParameter("@operationMaintenanceTaskCode",operationMaintenanceTaskCodeWaterPump),
                                             new SqlParameter("@equipmentType","1"),
                                             new SqlParameter("@operationMaintenancePersonCode",SqlDbType.VarChar,36),
                                             new SqlParameter("@isGenerateTask",SqlDbType.Int,1),
                                             new SqlParameter("@userEmail",SqlDbType.VarChar,50),
                                             new SqlParameter("@drugLowAlarm",deviceModel.drug_level_state)
                                           };
            SqlParameterSWaterPump[4].Direction = ParameterDirection.Output;
            SqlParameterSWaterPump[5].Direction = ParameterDirection.Output;
            SqlParameterSWaterPump[6].Direction = ParameterDirection.Output;
            SqlCommand cmdWaterPump = new SqlCommand()
            {
                CommandType = CommandType.StoredProcedure,
                CommandText = "rpt_InsertRealTimeDrugpumpData"
            };
            cmdWaterPump.Parameters.AddRange(SqlParameterSWaterPump);
            DataSet dsWaterPump = FWSqlCommandStaticHelper.ExecuteDataSet(fwSqlTransaction.DbTransaction, cmdWaterPump);
        }

        /// <summary>
        /// 处理mqtt实时数据
        /// </summary>
        /// <returns></returns>
        public static FWResult<bool> generateMqttTaskAndSendMessage(MQTTBLLRealTimeData entity)
        {
            FWResult<bool> result = new FWResult<bool>();
            result.status = FWResultStatus.Success;
            string operationMaintenancePersonCode = "";
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            try
            {
                //事物开始
                fwSqlTransaction.BeginTransaction();



                /* --------------气泵报警开始----------------------*/
                QueryTaskParams param = new QueryTaskParams();
                Guid operationMaintenanceTaskCode = System.Guid.NewGuid();  //程序中生成运维任务的code

                //处理数据
                var isContains = RealTimeData._listMonitor.Select(s => s.equipmentNo).ToList().Contains(entity.EquipmentNo);
                if (!isContains)
                    RealTimeData._listMonitor = GetMOnitorSiteCode();
                dealMqttEntity(entity.MeterNum.ToString(), entity.ColDateTime, fwSqlTransaction, entity.EquipmentNo);

                /* --------------气泵报警结束----------------------*/


                /* --------------水泵报警开始----------------------*/

                QueryTaskParams paramWaterPump = new QueryTaskParams();
                Guid operationMaintenanceTaskCodeWaterPump = System.Guid.NewGuid();  //程序中生成运维任务的code
                SqlParameter[] SqlParameterSWaterPump = {
                                             new SqlParameter("@ltuMac",entity.EquipmentNo),
                                             new SqlParameter("@waterPumpAlarm",0),
                                             new SqlParameter("@waterLowLine",0),
                                             new SqlParameter("@waterHighLine",0),
                                             new SqlParameter("@createDateTime",entity.ColDateTime) ,
                                             new SqlParameter("@operationMaintenanceTaskCode",operationMaintenanceTaskCodeWaterPump),
                                             new SqlParameter("@equipmentType","1"),
                                             new SqlParameter("@operationMaintenancePersonCode",SqlDbType.VarChar,36),
                                             new SqlParameter("@isGenerateTask",SqlDbType.Int,1),
                                             new SqlParameter("@userEmail",SqlDbType.VarChar,50),
                                             new SqlParameter("@windPumpAlarm",0),
                                             new SqlParameter("@drugAlarm",0),
                                             new SqlParameter("@waterPumpValue",entity.MeterNum.ToString())
                                           };
                SqlParameterSWaterPump[7].Direction = ParameterDirection.Output;
                SqlParameterSWaterPump[8].Direction = ParameterDirection.Output;
                SqlParameterSWaterPump[9].Direction = ParameterDirection.Output;
                SqlCommand cmdWaterPump = new SqlCommand()
                {
                    CommandType = CommandType.StoredProcedure,
                    CommandText = "rpt_InsertRealTimeWaterpumpData"
                };
                cmdWaterPump.Parameters.AddRange(SqlParameterSWaterPump);

                DataSet dsWaterPump = FWSqlCommandStaticHelper.ExecuteDataSet(fwSqlTransaction.DbTransaction, cmdWaterPump);
                operationMaintenancePersonCode = SqlParameterSWaterPump[7].Value.ToString();
                int isGenerateTaskWaterPump = Convert.ToInt32(SqlParameterSWaterPump[8].Value.ToString());
                string userEmailWaterPump = SqlParameterSWaterPump[9].Value.ToString();

                /* --------------水泵报警结束----------------------*/

                //事物提交
                fwSqlTransaction.Commit();
            }
            catch (Exception ex)
            {
                fwSqlTransaction.Rollback();
                string sText = "处理同步数据失败,报文:" + JsonConvert.SerializeObject(entity) + "" + Environment.NewLine + ex.Message;
                string logpath = fwConfig.FWConfigHelper.getValue("Fail_LogPath");
                WriteLog(sText, logpath);
                result.infoList.Add(ex.Message + ex.ToString());
                result.status = FWResultStatus.Failure;
            }
            finally
            {
                fwSqlTransaction.Close();
            }
            return result;
        }

        /// <summary>
        /// 生成运维任务并推送app消息，发送邮件  add by songshasha 2016-11-28
        /// </summary>
        /// <param name="ltuMac"></param>
        /// <param name="monitorValue"></param>
        /// <param name="createTime"></param>
        /// <returns></returns>
        public static FWResult<bool> generateTaskAndSendMessagebak(fw.m.operationMaintenance.data.model.MBllRealTimeData entity)
        {




            FWResult<bool> result = new FWResult<bool>();
            result.status = FWResultStatus.Success;
            string message = "";
            string operationMaintenancePersonCode = "";
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            try
            {
                //事物开始
                fwSqlTransaction.BeginTransaction();




                /* --------------气泵报警开始----------------------*/
                QueryTaskParams param = new QueryTaskParams();
                Guid operationMaintenanceTaskCode = System.Guid.NewGuid();  //程序中生成运维任务的code

                //处理数据
                var isContains = RealTimeData._listMonitor.Select(s => s.equipmentNo).ToList().Contains(entity.ltuMac);
                if (!isContains)
                    RealTimeData._listMonitor = GetMOnitorSiteCode();
                dealEntity_bak(entity, fwSqlTransaction);




                //SqlParameter[] SqlParameterS = { 
                //                             new SqlParameter("@ltuMac",entity.ltuMac),
                //                             new SqlParameter("@wKqbCurValue",entity.wKqbCurValue),
                //                             new SqlParameter("@createDateTime",entity.createDateTime) ,
                //                             new SqlParameter("@operationMaintenanceTaskCode",operationMaintenanceTaskCode),
                //                             new SqlParameter("@operationMaintenancePersonCode",SqlDbType.VarChar,36),
                //                             new SqlParameter("@isGenerateTask",SqlDbType.Int,1),
                //                             new SqlParameter("@userEmail",SqlDbType.VarChar,50),
                //                             new SqlParameter("@isMonitorSiteExist",SqlDbType.VarChar,50),   
                //                           };
                //SqlParameterS[4].Direction = ParameterDirection.Output;
                //SqlParameterS[5].Direction = ParameterDirection.Output;
                //SqlParameterS[6].Direction = ParameterDirection.Output;
                //SqlParameterS[7].Direction = ParameterDirection.Output;
                //SqlCommand cmd = new SqlCommand()
                //{
                //    CommandType = CommandType.StoredProcedure,
                //    CommandText = "rpt_InsertRealTimeData"
                //};
                //cmd.Parameters.AddRange(SqlParameterS);
                //DataSet ds = FWSqlCommandStaticHelper.ExecuteDataSet(fwSqlTransaction.DbTransaction,cmd);
                //operationMaintenancePersonCode = SqlParameterS[4].Value.ToString();
                //int isGenerateTask = Convert.ToInt32(SqlParameterS[5].Value.ToString());
                //string userEmail = SqlParameterS[6].Value.ToString();
                //string isMonitorSiteExist = SqlParameterS[7].Value.ToString();

                //result.data = isMonitorSiteExist != "false";
                ////如果产生运维任务，则推送消息
                //if (isGenerateTask == 1)
                //{
                //    //app消息推送
                //    param.operationMaintenanceTaskCode = operationMaintenanceTaskCode.ToString();
                //    List<MOperationMaintenanceTask> maintenanceTask = queryMaintenanceTaskByGT(param);
                //    foreach (var item in maintenanceTask)
                //    {
                //        message = fwJson.FWJsonHelper.serializeObject(item);
                //        GetuiServerApiSDK.PushMessageBll.PushMessageToSingle(operationMaintenancePersonCode, message, "");
                //    }

                //    //邮件发送
                //    if (!string.IsNullOrEmpty(userEmail))
                //    {
                //        foreach (var item in maintenanceTask)
                //        {
                //            string title = "现场设备" + item.monitorSiteName + "发生" + item.taskTypeName + ",请及时处理";
                //            string mailMessage = "现场设备" + item.monitorSiteName + "发生" + item.taskTypeName + ",位置:" + item.cantonName + ",任务详情：" + item.operationMaintenanceTaskName;
                //            GetuiServerApiSDK.PushMessageBll.sendMail(userEmail, title, mailMessage);
                //        }

                //    }


                //}

                /* --------------气泵报警结束----------------------*/


                /* --------------水泵报警开始----------------------*/



                //if (string.IsNullOrEmpty(entity.byModeType))
                //{
                //    entity.byModeType = queryEquipmentTypeCode(entity.ltuMac);

                //}

                // modify by lxg 20180531
                entity.byModeType = queryEquipmentTypeCode(entity.ltuMac);

                if (entity.byModeType == "3" || entity.byModeType == "4" || entity.byModeType == "03" || entity.byModeType == "04")
                {
                    QueryTaskParams paramWaterPump = new QueryTaskParams();
                    Guid operationMaintenanceTaskCodeWaterPump = System.Guid.NewGuid();  //程序中生成运维任务的code

                    string waterPumpAlarm = "";
                    string windPumpAlarm = "";
                    if (entity.byModeType == "3" || entity.byModeType == "03")  //如果是08型，    byDI3代表水泵报警，byDI4代表气泵报警   
                    {
                        waterPumpAlarm = entity.byDI3.ToString();
                        windPumpAlarm = entity.byDI4.ToString();

                    }
                    if (entity.byModeType == "4" || entity.byModeType == "04")  //如果是09型，    byDI3代表第一个水泵报警，byDI4代表第二个水泵报警，目前似乎byDI4都没值，09型不检测风机报警
                    {
                        waterPumpAlarm = entity.byDI3.ToString();
                        windPumpAlarm = "0";
                        // waterPumpAlarm = entity.byDI4.ToString();

                    }

                    SqlParameter[] SqlParameterSWaterPump = {
                                             new SqlParameter("@ltuMac",entity.ltuMac),
                                             new SqlParameter("@waterPumpAlarm",waterPumpAlarm),
                                             new SqlParameter("@waterLowLine",entity.byDI1),
                                             new SqlParameter("@waterHighLine",entity.byDI2),
                                             new SqlParameter("@createDateTime",entity.createDateTime) ,
                                             new SqlParameter("@operationMaintenanceTaskCode",operationMaintenanceTaskCodeWaterPump),
                                             new SqlParameter("@equipmentType",entity.byModeType),
                                             new SqlParameter("@operationMaintenancePersonCode",SqlDbType.VarChar,36),
                                             new SqlParameter("@isGenerateTask",SqlDbType.Int,1),
                                             new SqlParameter("@userEmail",SqlDbType.VarChar,50),
                                             new SqlParameter("@windPumpAlarm",windPumpAlarm),
                                           
                                             //new SqlParameter("@waterPumpAlarm",entity.waterPumpAlarm),
                                             //new SqlParameter("@waterLowLine",entity.waterLowLine),
                                             //new SqlParameter("@waterHighLine",entity.waterHighLine),
                                           };
                    SqlParameterSWaterPump[7].Direction = ParameterDirection.Output;
                    SqlParameterSWaterPump[8].Direction = ParameterDirection.Output;
                    SqlParameterSWaterPump[9].Direction = ParameterDirection.Output;
                    SqlCommand cmdWaterPump = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = "rpt_InsertRealTimeWaterpumpData"
                    };
                    cmdWaterPump.Parameters.AddRange(SqlParameterSWaterPump);

                    DataSet dsWaterPump = FWSqlCommandStaticHelper.ExecuteDataSet(fwSqlTransaction.DbTransaction, cmdWaterPump);
                    operationMaintenancePersonCode = SqlParameterSWaterPump[7].Value.ToString();
                    int isGenerateTaskWaterPump = Convert.ToInt32(SqlParameterSWaterPump[8].Value.ToString());
                    string userEmailWaterPump = SqlParameterSWaterPump[9].Value.ToString();
                    //如果产生运维任务，则推送消息
                    //if (isGenerateTaskWaterPump == 1)
                    //{
                    //    //app消息推送
                    //    paramWaterPump.operationMaintenanceTaskCode = operationMaintenanceTaskCodeWaterPump.ToString();
                    //    List<MOperationMaintenanceTask> maintenanceTaskWaterPump = queryMaintenanceTaskByGT(paramWaterPump);
                    //    foreach (var item in maintenanceTaskWaterPump)
                    //    {
                    //        message = fwJson.FWJsonHelper.serializeObject(item);
                    //        GetuiServerApiSDK.PushMessageBll.PushMessageToSingle(operationMaintenancePersonCode, message, "");
                    //    }

                    //    //邮件发送
                    //    if (!string.IsNullOrEmpty(userEmail))
                    //    {
                    //        foreach (var item in maintenanceTaskWaterPump)
                    //        {
                    //            string title = "现场设备" + item.monitorSiteName + "发生" + item.taskTypeName + ",请及时处理";
                    //            string mailMessage = "现场设备" + item.monitorSiteName + "发生" + item.taskTypeName + ",位置:" + item.cantonName + ",任务详情：" + item.operationMaintenanceTaskName;
                    //            GetuiServerApiSDK.PushMessageBll.sendMail(userEmail, title, mailMessage);
                    //        }

                    //    }


                    //}

                    /* --------------水泵报警结束----------------------*/
                }

                //事物提交
                fwSqlTransaction.Commit();

            }
            catch (Exception ex)
            {
                fwSqlTransaction.Rollback();
                string sText = "receiveLtuData失败,ltuMac:" + entity.ltuMac + ",monitorTime:" + entity.createDateTime.ToString("G") + ",monitorValue:" + entity.wKqbCurValue + Environment.NewLine + ex.Message;
                string logpath = fwConfig.FWConfigHelper.getValue("Fail_LogPath");
                WriteLog(sText, logpath);
                result.infoList.Add(ex.Message + ex.ToString());
                result.status = FWResultStatus.Failure;
            }
            finally
            {
                fwSqlTransaction.Close();
            }
            return result;

        }

        public static DateTime ConvertLongToDateTime(long timeStamp)
        {
            DateTime dtStart = TimeZoneInfo.ConvertTime(new DateTime(1970, 1, 1, 8, 0, 0, 0), TimeZoneInfo.Local);
            long lTime = timeStamp * 10000;
            TimeSpan toNow = new TimeSpan(lTime);
            return dtStart.Add(toNow);
        }

        public static void dealEntity(JJMBLLRealTimeDataDeviceData_Monitor monitorModel, FWSqlTransaction transaction)
        {
            string deviceId = monitorModel.deviceId;
            string meterNum = string.IsNullOrEmpty(monitorModel.data6) ? "0" : monitorModel.data6;
            int fdatastate;
            var dataEntitys = RealTimeData._listMonitor.Where(m => m.equipmentNo.Equals(deviceId)).ToList();
            if (dataEntitys.Count > 0)
            {
                var item = dataEntitys[0];
                if (item.alarmUpperlimit > 0 && Convert.ToInt32(meterNum) > item.alarmUpperlimit)
                    fdatastate = 4;
                else if (item.alarmlowerlimit > 0 &&
                         Convert.ToInt32(meterNum) < item.alarmlowerlimit &&
                         Convert.ToInt32(meterNum) > 100)
                    fdatastate = 5;
                else fdatastate = Convert.ToInt32(meterNum) <= 100 ? 10 : 1;
                if (!string.IsNullOrEmpty(item.monitorSiteCode))
                {
                    //List<MBLLMonitorSiteRealtimeData> allFactorDataList = GetMonitorSiteRealtimeFactorData();
                    //var isExist = allFactorDataList.Any(data => data.equipmentCode == item.equipmentCode && data.monitorSiteCode == item.monitorSiteCode);

                    //保存气泵电流
                    var sb = new StringBuilder();
                    bool isAirExist = IsMonitorSiteRealtimeFactorDataExist(item.monitorSiteCode, item.equipmentCode, "000008");
                    if (isAirExist)
                    {
                        sb.AppendFormat(
                            @" update dbo.BLLMonitorSiteRealtimeFactorData set monitorTime='{6}',monitorValue='{0}',createTime='{1}',dataState={2} where monitorSiteCode='{3}' and monitorFactorCode='{4}' and equipmentCode='{5}';"
                            , meterNum, DateTime.Now, fdatastate, item.monitorSiteCode, "000008", item.equipmentCode, Convert.ToDateTime(monitorModel.time));
                    }
                    else
                    {
                        sb.AppendFormat(
                            @" insert into dbo.BLLMonitorSiteRealtimeFactorData(monitorSiteCode,monitorFactorCode,monitorTime,monitorValue,createTime,dataSource,dataState,equipmentCode) values('{0}','{1}','{2}','{3}','{4}',1,{5},'{6}');", item.monitorSiteCode, "000008", Convert.ToDateTime(monitorModel.time), meterNum, DateTime.Now, fdatastate, item.equipmentCode);
                    }
                    sb.AppendFormat(
                        @" insert into dbo.BLLMonitorSiteHisFactorData(monitorTime,monitorSiteCode,monitorFactorCode,monitorValue,createTime,dataSource,dataState,equipmentCode ) values('{0}','{1}','{2}','{3}','{4}',1,{5},'{6}');", Convert.ToDateTime(monitorModel.time), item.monitorSiteCode, "000008", meterNum, DateTime.Now, fdatastate, item.equipmentCode);
                    FWSqlCommand sqlCmd = new FWSqlCommand { CommandText = sb.ToString() };
                    FWSqlCommandStaticHelper.ExecuteNonQuery(transaction, sqlCmd);

                    //水泵电流
                    var sbWater = new StringBuilder();
                    string waterMeterNo = string.IsNullOrEmpty(monitorModel.data7) ? "0" : monitorModel.data7;
                    bool isWaterExist = IsMonitorSiteRealtimeFactorDataExist(item.monitorSiteCode, item.equipmentCode, "000009");
                    if (isWaterExist)
                    {
                        sbWater.AppendFormat(
                            @" update dbo.BLLMonitorSiteRealtimeFactorData set monitorTime='{6}',monitorValue='{0}',createTime='{1}',dataState={2} where monitorSiteCode='{3}' and monitorFactorCode='{4}' and equipmentCode='{5}';", waterMeterNo, DateTime.Now, "1", item.monitorSiteCode, "000009", item.equipmentCode, Convert.ToDateTime(monitorModel.time));
                    }
                    else
                    {
                        sbWater.AppendFormat(
                            @" insert into dbo.BLLMonitorSiteRealtimeFactorData(monitorSiteCode,monitorFactorCode,monitorTime,monitorValue,createTime,dataSource,dataState,equipmentCode) values('{0}','{1}','{2}','{3}','{4}',1,{5},'{6}');", item.monitorSiteCode, "000009", Convert.ToDateTime(monitorModel.time), waterMeterNo, DateTime.Now, "1", item.equipmentCode);
                    }
                    sbWater.AppendFormat(
                        @" insert into dbo.BLLMonitorSiteHisFactorData(monitorTime,monitorSiteCode,monitorFactorCode,monitorValue,createTime,dataSource,dataState,equipmentCode ) values('{0}','{1}','{2}','{3}','{4}',1,{5},'{6}');", Convert.ToDateTime(monitorModel.time), item.monitorSiteCode, "000009", waterMeterNo, DateTime.Now, "1", item.equipmentCode);
                    FWSqlCommand sqlCmdWater = new FWSqlCommand { CommandText = sbWater.ToString() };
                    FWSqlCommandStaticHelper.ExecuteNonQuery(transaction, sqlCmdWater);


                    SqlParameter[] SqlParameterS = {
                                             new SqlParameter("@monitorSiteCode",item.monitorSiteCode),
                                             new SqlParameter("@equipmentCode",item.equipmentCode),
                                             new SqlParameter("@AlarmIGCode","000008"),
                                             new SqlParameter("@AlamTime",DateTime.Now),
                                             new SqlParameter("@AlarmValue",meterNum) ,
                                             new SqlParameter("@fdatastate",fdatastate),
                                             new SqlParameter("@operationMaintenanceTaskCode",Guid.NewGuid().ToString()),
                                             new SqlParameter("@operationMaintenancePersonCodeGt",SqlDbType.VarChar,36),
                                             new SqlParameter("@isGenerateTaskGT",SqlDbType.Int,1),
                                             new SqlParameter("@userEmailGT",SqlDbType.VarChar,50)
                                           };
                    SqlParameterS[7].Direction = ParameterDirection.Output;
                    SqlParameterS[8].Direction = ParameterDirection.Output;
                    SqlParameterS[9].Direction = ParameterDirection.Output;
                    SqlCommand cmdRealtime = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = "CheckInsertAlarm"
                    };
                    cmdRealtime.Parameters.AddRange(SqlParameterS);

                    FWSqlCommandStaticHelper.ExecuteDataSet(cmdRealtime);

                    if (!isAirExist)
                        RealTimeData._listData = GetMonitorSiteRealtimeFactorData();
                }

            }

        }

        public static void dealHLWXEntity(HTTPRealTimeData_DeviceMsg monitorModel, FWSqlTransaction transaction, string deviceId)
        {
            int fdatastate;
            string meterNum = monitorModel.draught_fan_current.ToString();
            var dataEntitys = RealTimeData._listMonitor.Where(m => m.equipmentNo.Equals(deviceId)).ToList();
            if (dataEntitys.Count > 0)
            {
                var item = dataEntitys[0];
                if (item.alarmUpperlimit > 0 && Convert.ToInt32(monitorModel.draught_fan_current) > item.alarmUpperlimit)
                    fdatastate = 4;
                else if (item.alarmlowerlimit > 0 &&
                         Convert.ToInt32(monitorModel.draught_fan_current) < item.alarmlowerlimit &&
                         Convert.ToInt32(monitorModel.draught_fan_current) > 100)
                    fdatastate = 5;
                else fdatastate = Convert.ToInt32(monitorModel.draught_fan_current) <= 100 ? 10 : 1;
                if (!string.IsNullOrEmpty(item.monitorSiteCode))
                {
                    //List<MBLLMonitorSiteRealtimeData> allFactorDataList = GetMonitorSiteRealtimeFactorData();
                    //var isExist = allFactorDataList.Any(data => data.equipmentCode == item.equipmentCode && data.monitorSiteCode == item.monitorSiteCode);

                    //保存气泵电流
                    var sb = new StringBuilder();
                    bool isAirExist = IsMonitorSiteRealtimeFactorDataExist(item.monitorSiteCode, item.equipmentCode, "000008");
                    if (isAirExist)
                    {
                        sb.AppendFormat(
                            @" update dbo.BLLMonitorSiteRealtimeFactorData set monitorTime='{6}',monitorValue='{0}',createTime='{1}',dataState={2},meterMaxAlarm={7},meterMinAlarm={8} 
                            where monitorSiteCode='{3}' and monitorFactorCode='{4}' and equipmentCode='{5}' ;"
                            , meterNum, DateTime.Now, fdatastate, item.monitorSiteCode, "000008", item.equipmentCode, ConvertLongToDateTime(monitorModel.collect_time)
                            , monitorModel.electricity_stolen_alarm, monitorModel.off_machine_alarm);
                    }
                    else
                    {
                        sb.AppendFormat(
                            @" insert into dbo.BLLMonitorSiteRealtimeFactorData(monitorSiteCode,monitorFactorCode,monitorTime,monitorValue,createTime,dataSource,dataState,equipmentCode,meterMaxAlarm, meterMinAlarm) 
                                values('{0}','{1}','{2}','{3}','{4}',1,{5},'{6}','{7}','{8}');"
                            , item.monitorSiteCode, "000008", ConvertLongToDateTime(monitorModel.collect_time), meterNum, DateTime.Now, fdatastate, item.equipmentCode
                            , monitorModel.electricity_stolen_alarm, monitorModel.off_machine_alarm);
                    }
                    sb.AppendFormat(
                        @" insert into dbo.BLLMonitorSiteHisFactorData(monitorTime,monitorSiteCode,monitorFactorCode,monitorValue,createTime,dataSource,dataState,equipmentCode,meterMaxAlarm, meterMinAlarm) 
                            values('{0}','{1}','{2}','{3}','{4}',1,{5},'{6}','{7}','{8}');"
                            , ConvertLongToDateTime(monitorModel.collect_time), item.monitorSiteCode, "000008", meterNum, DateTime.Now, fdatastate, item.equipmentCode
                            , monitorModel.electricity_stolen_alarm, monitorModel.off_machine_alarm);
                    FWSqlCommand sqlCmd = new FWSqlCommand { CommandText = sb.ToString() };
                    FWSqlCommandStaticHelper.ExecuteNonQuery(transaction, sqlCmd);

                    //水泵电流
                    //var sbWater = new StringBuilder();
                    //string waterMeterNo =  monitorModel.draught_fan_current.ToString();
                    //bool isWaterExist = IsMonitorSiteRealtimeFactorDataExist(item.monitorSiteCode, item.equipmentCode, "000009");
                    //if (isWaterExist)
                    //{
                    //    sbWater.AppendFormat(
                    //        @" update dbo.BLLMonitorSiteRealtimeFactorData set monitorTime='{6}',monitorValue='{0}',createTime='{1}',dataState={2} where monitorSiteCode='{3}' and monitorFactorCode='{4}' and equipmentCode='{5}';", waterMeterNo, DateTime.Now, "1", item.monitorSiteCode, "000009", item.equipmentCode, ConvertLongToDateTime(monitorModel.collect_time));
                    //}
                    //else
                    //{
                    //    sbWater.AppendFormat(
                    //        @" insert into dbo.BLLMonitorSiteRealtimeFactorData(monitorSiteCode,monitorFactorCode,monitorTime,monitorValue,createTime,dataSource,dataState,equipmentCode) values('{0}','{1}','{2}','{3}','{4}',1,{5},'{6}');", item.monitorSiteCode, "000009", ConvertLongToDateTime(monitorModel.collect_time), waterMeterNo, DateTime.Now, "1", item.equipmentCode);
                    //}
                    //sbWater.AppendFormat(
                    //    @" insert into dbo.BLLMonitorSiteHisFactorData(monitorTime,monitorSiteCode,monitorFactorCode,monitorValue,createTime,dataSource,dataState,equipmentCode ) values('{0}','{1}','{2}','{3}','{4}',1,{5},'{6}');", ConvertLongToDateTime(monitorModel.collect_time), item.monitorSiteCode, "000009", waterMeterNo, DateTime.Now, "1", item.equipmentCode);
                    //FWSqlCommand sqlCmdWater = new FWSqlCommand { CommandText = sbWater.ToString() };
                    //FWSqlCommandStaticHelper.ExecuteNonQuery(transaction, sqlCmdWater);


                    SqlParameter[] SqlParameterS = {
                                             new SqlParameter("@monitorSiteCode",item.monitorSiteCode),
                                             new SqlParameter("@equipmentCode",item.equipmentCode),
                                             new SqlParameter("@AlarmIGCode","000008"),
                                             new SqlParameter("@AlamTime",DateTime.Now),
                                             new SqlParameter("@AlarmValue",meterNum) ,
                                             new SqlParameter("@fdatastate",fdatastate),
                                             new SqlParameter("@operationMaintenanceTaskCode",Guid.NewGuid().ToString()),
                                             new SqlParameter("@operationMaintenancePersonCodeGt",SqlDbType.VarChar,36),
                                             new SqlParameter("@isGenerateTaskGT",SqlDbType.Int,1),
                                             new SqlParameter("@userEmailGT",SqlDbType.VarChar,50)
                                           };
                    SqlParameterS[7].Direction = ParameterDirection.Output;
                    SqlParameterS[8].Direction = ParameterDirection.Output;
                    SqlParameterS[9].Direction = ParameterDirection.Output;
                    SqlCommand cmdRealtime = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = "CheckInsertAlarm"
                    };
                    cmdRealtime.Parameters.AddRange(SqlParameterS);

                    FWSqlCommandStaticHelper.ExecuteDataSet(cmdRealtime);

                    if (!isAirExist)
                        RealTimeData._listData = GetMonitorSiteRealtimeFactorData();
                }

            }

        }

        public static void dealMqttEntity(string meterNum, DateTime coldateTime, FWSqlTransaction transaction, string deviceId)
        {
            int fdatastate;
            var dataEntitys = RealTimeData._listMonitor.Where(m => m.equipmentNo.ToUpper().Equals(deviceId.ToUpper())).ToList();
            if (dataEntitys.Count > 0)
            {
                var item = dataEntitys[0];
                if (item.alarmUpperlimit > 0 && Convert.ToInt32(meterNum) > item.alarmUpperlimit)
                    fdatastate = 4;
                else if (item.alarmlowerlimit > 0 &&
                         Convert.ToInt32(meterNum) < item.alarmlowerlimit &&
                         Convert.ToInt32(meterNum) > 100)
                    fdatastate = 5;
                else fdatastate = Convert.ToInt32(meterNum) <= 10 ? 10 : 1;
                if (!string.IsNullOrEmpty(item.monitorSiteCode))
                {
                    //List<MBLLMonitorSiteRealtimeData> allFactorDataList = GetMonitorSiteRealtimeFactorData();
                    //var isExist = allFactorDataList.Any(data => data.equipmentCode == item.equipmentCode && data.monitorSiteCode == item.monitorSiteCode);

                    //保存气泵电流
                    var sb = new StringBuilder();
                    bool isAirExist = IsMonitorSiteRealtimeFactorDataExist(item.monitorSiteCode, item.equipmentCode, "000008");
                    if (isAirExist)
                    {
                        sb.AppendFormat(
                            @" update dbo.BLLMonitorSiteRealtimeFactorData set monitorTime='{6}',monitorValue='{0}',createTime='{1}',dataState={2} where monitorSiteCode='{3}' and monitorFactorCode='{4}' and equipmentCode='{5}';", meterNum, DateTime.Now, fdatastate, item.monitorSiteCode, "000008", item.equipmentCode, coldateTime);
                    }
                    else
                    {
                        sb.AppendFormat(
                            @" insert into dbo.BLLMonitorSiteRealtimeFactorData(monitorSiteCode,monitorFactorCode,monitorTime,monitorValue,createTime,dataSource,dataState,equipmentCode) values('{0}','{1}','{2}','{3}','{4}',1,{5},'{6}');", item.monitorSiteCode, "000008", coldateTime, meterNum, DateTime.Now, fdatastate, item.equipmentCode);
                    }
                    sb.AppendFormat(
                        @" insert into dbo.BLLMonitorSiteHisFactorData(monitorTime,monitorSiteCode,monitorFactorCode,monitorValue,createTime,dataSource,dataState,equipmentCode ) values('{0}','{1}','{2}','{3}','{4}',1,{5},'{6}');", coldateTime, item.monitorSiteCode, "000008", meterNum, DateTime.Now, fdatastate, item.equipmentCode);
                    FWSqlCommand sqlCmd = new FWSqlCommand { CommandText = sb.ToString() };
                    FWSqlCommandStaticHelper.ExecuteNonQuery(transaction, sqlCmd);

                    //水泵电流
                    //var sbWater = new StringBuilder();
                    //string waterMeterNo = meterNum;
                    //bool isWaterExist = IsMonitorSiteRealtimeFactorDataExist(item.monitorSiteCode, item.equipmentCode, "000009");
                    //if (isWaterExist)
                    //{
                    //    sbWater.AppendFormat(
                    //        @" update dbo.BLLMonitorSiteRealtimeFactorData set monitorTime='{6}',monitorValue='{0}',createTime='{1}',dataState={2} where monitorSiteCode='{3}' and monitorFactorCode='{4}' and equipmentCode='{5}';", waterMeterNo, DateTime.Now, "1", item.monitorSiteCode, "000009", item.equipmentCode, coldateTime);
                    //}
                    //else
                    //{
                    //    sbWater.AppendFormat(
                    //        @" insert into dbo.BLLMonitorSiteRealtimeFactorData(monitorSiteCode,monitorFactorCode,monitorTime,monitorValue,createTime,dataSource,dataState,equipmentCode) values('{0}','{1}','{2}','{3}','{4}',1,{5},'{6}');", item.monitorSiteCode, "000009", coldateTime, waterMeterNo, DateTime.Now, "1", item.equipmentCode);
                    //}
                    //sbWater.AppendFormat(
                    //    @" insert into dbo.BLLMonitorSiteHisFactorData(monitorTime,monitorSiteCode,monitorFactorCode,monitorValue,createTime,dataSource,dataState,equipmentCode ) values('{0}','{1}','{2}','{3}','{4}',1,{5},'{6}');", coldateTime, item.monitorSiteCode, "000009", waterMeterNo, DateTime.Now, "1", item.equipmentCode);
                    //FWSqlCommand sqlCmdWater = new FWSqlCommand { CommandText = sbWater.ToString() };
                    //FWSqlCommandStaticHelper.ExecuteNonQuery(transaction, sqlCmdWater);


                    SqlParameter[] SqlParameterS = {
                                             new SqlParameter("@monitorSiteCode",item.monitorSiteCode),
                                             new SqlParameter("@equipmentCode",item.equipmentCode),
                                             new SqlParameter("@AlarmIGCode","000008"),
                                             new SqlParameter("@AlamTime",DateTime.Now),
                                             new SqlParameter("@AlarmValue",meterNum) ,
                                             new SqlParameter("@fdatastate",fdatastate),
                                             new SqlParameter("@operationMaintenanceTaskCode",Guid.NewGuid().ToString()),
                                             new SqlParameter("@operationMaintenancePersonCodeGt",SqlDbType.VarChar,36),
                                             new SqlParameter("@isGenerateTaskGT",SqlDbType.Int,1),
                                             new SqlParameter("@userEmailGT",SqlDbType.VarChar,50)
                                           };
                    SqlParameterS[7].Direction = ParameterDirection.Output;
                    SqlParameterS[8].Direction = ParameterDirection.Output;
                    SqlParameterS[9].Direction = ParameterDirection.Output;
                    SqlCommand cmdRealtime = new SqlCommand()
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandText = "CheckInsertAlarm"
                    };
                    cmdRealtime.Parameters.AddRange(SqlParameterS);

                    FWSqlCommandStaticHelper.ExecuteDataSet(cmdRealtime);

                    if (!isAirExist)
                        RealTimeData._listData = GetMonitorSiteRealtimeFactorData();
                }

            }

        }

        //处理数据
        public static void dealEntity_bak(data.model.MBllRealTimeData entity, FWSqlTransaction transaction)
        {
            int fdatastate;
            var dataEntitys = RealTimeData._listMonitor.Where(m => m.equipmentNo.Equals(entity.ltuMac)).ToList();
            if (dataEntitys.Count > 0)
            {
                var item = dataEntitys[0];
                if (item.alarmUpperlimit > 0 && Convert.ToInt32(entity.wKqbCurValue) > item.alarmUpperlimit)
                    fdatastate = 4;
                else if (item.alarmlowerlimit > 0 &&
                         Convert.ToInt32(entity.wKqbCurValue) < item.alarmlowerlimit &&
                         Convert.ToInt32(entity.wKqbCurValue) > 100)
                    fdatastate = 5;
                else fdatastate = Convert.ToInt32(entity.wKqbCurValue) <= 100 ? 10 : 1;
                if (!string.IsNullOrEmpty(item.monitorSiteCode))
                {
                    var isExist = RealTimeData._listData.Any(data => data.equipmentCode == item.equipmentCode && data.monitorSiteCode == item.monitorSiteCode);

                    var sb = new StringBuilder();
                    if (isExist)
                    {
                        sb.AppendFormat(
                            @" update dbo.BLLMonitorSiteRealtimeFactorData set monitorTime='{6}',monitorValue='{0}',createTime='{1}',dataState={2} where monitorSiteCode='{3}' and monitorFactorCode='{4}' and equipmentCode='{5}';", entity.wKqbCurValue, DateTime.Now, fdatastate, item.monitorSiteCode, "000008", item.equipmentCode, entity.createDateTime);
                    }
                    else
                    {
                        sb.AppendFormat(
                            @" insert into dbo.BLLMonitorSiteRealtimeFactorData(monitorSiteCode,monitorFactorCode,monitorTime,monitorValue,createTime,dataSource,dataState,equipmentCode) values('{0}','{1}','{2}','{3}','{4}',1,{5},'{6}');", item.monitorSiteCode, "000008", entity.createDateTime, entity.wKqbCurValue, DateTime.Now, fdatastate, item.equipmentCode);
                    }
                    sb.AppendFormat(
                        @" insert into dbo.BLLMonitorSiteHisFactorData(monitorTime,monitorSiteCode,monitorFactorCode,monitorValue,createTime,dataSource,dataState,equipmentCode ) values('{0}','{1}','{2}','{3}','{4}',1,{5},'{6}');", entity.createDateTime, item.monitorSiteCode, "000008", entity.wKqbCurValue, DateTime.Now, fdatastate, item.equipmentCode);
                    FWSqlCommand sqlCmd = new FWSqlCommand { CommandText = sb.ToString() };
                    FWSqlCommandStaticHelper.ExecuteNonQuery(transaction, sqlCmd);
                    if (!isExist)
                        RealTimeData._listData = GetMonitorSiteRealtimeFactorData();
                }

            }

        }

        //添加日志
        public static void WriteLog(string sText, string path)
        {
            lock (logObject)
            {
                string logFileAbsolutePath = path + DateTime.Now.ToString("yyMMdd") + ".txt";

                FileStream fs = null;
                StreamWriter sw = null;
                try
                {

                    if (!File.Exists(logFileAbsolutePath))
                    {
                        string logFolderAbsolutePath = System.IO.Path.GetDirectoryName(logFileAbsolutePath);
                        if (!Directory.Exists(logFolderAbsolutePath))
                        {
                            Directory.CreateDirectory(logFolderAbsolutePath);
                        }
                        fs = File.Create(logFileAbsolutePath);
                    }
                    else
                    {
                        FileInfo fi = new FileInfo(logFileAbsolutePath);
                        fs = new FileStream(logFileAbsolutePath, FileMode.Append, FileAccess.Write);
                    }
                    sw = new StreamWriter(fs, Encoding.GetEncoding("gb2312"));
                    sw.WriteLine("-----" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "--------------------");
                    sw.WriteLine(sText);
                    sw.WriteLine();

                    if (sw != null)
                    {
                        sw.Close();
                    }
                    if (fs != null)
                    {
                        fs.Close();
                    }
                }
                catch (Exception ex)
                {
                    if (sw != null)
                    {
                        sw.Close();
                    }
                    if (fs != null)
                    {
                        fs.Close();
                    }
                }
            }


        }

        //实时表数据
        public static List<MBLLMonitorSiteRealtimeData> GetMonitorSiteRealtimeFactorData()
        {
            string sql =
                 "SELECT [id],[monitorSiteCode],[equipmentCode],[monitorFactorCode],[monitorTime],[monitorValue],[createTime],[dataSource],[dataState],[createrID],[updaterID],[updateTime] FROM [dbo].[BLLMonitorSiteRealtimeFactorData]";
            FWSqlCommand sqlCmd = new FWSqlCommand { CommandText = sql };
            var result = FWSqlEntityToFWCommandStaticHelper.queryList<MBLLMonitorSiteRealtimeData>(sqlCmd);
            return result;
        }

        public static bool IsMonitorSiteRealtimeFactorDataExist(string monitorSiteCode, string equimentNo, string factorCode)
        {
            string sql =
                 "SELECT [id],[monitorSiteCode],[equipmentCode],[monitorFactorCode],[monitorTime],[monitorValue],[createTime],[dataSource],[dataState],[createrID],[updaterID],[updateTime] FROM [dbo].[BLLMonitorSiteRealtimeFactorData] WITH(NOLOCK)";
            sql += " where monitorSiteCode=@monitorSiteCode and equipmentCode=@equipmentCode and monitorFactorCode=@monitorFactorCode";
            FWSqlCommand sqlCmd = new FWSqlCommand { CommandText = sql };
            sqlCmd.Parameters.AddWithValue("@monitorSiteCode", monitorSiteCode);
            sqlCmd.Parameters.AddWithValue("@equipmentCode", equimentNo);
            sqlCmd.Parameters.AddWithValue("@monitorFactorCode", factorCode);
            var result = FWSqlEntityToFWCommandStaticHelper.queryList<MBLLMonitorSiteRealtimeData>(sqlCmd);
            if (result != null && result.Count > 0)
            {
                return true;
            }
            return false;
        }

        //所有现场设备
        public static List<MonitorSiteByLtc> GetMOnitorSiteCode()
        {
            var result = new List<MonitorSiteByLtc>();
            string sql =
                "select DISTINCT d.equipmentCode,b.monitorSiteCode,c.alarmUpperlimit,c.alarmlowerlimit,d.[equipmentNo] from BLLMonitorSite b WITH(NOLOCK) ,BLLMonitorSiteMonitorFactor c WITH(NOLOCK),BLLEquipment d WITH(NOLOCK) where c.monitorFactorCode ='000008'and c.equipmentCode=d.equipmentCode and b.monitorSiteCode=c.monitorSiteCode and c.isDis=0 and b.isDel=0 ";
            FWSqlCommand sqlCmd = new FWSqlCommand { CommandText = sql };
            var dt = FWSqlCommandStaticHelper.ExecuteDataTable(sqlCmd);
            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    MonitorSiteByLtc ms = new MonitorSiteByLtc();
                    ms.equipmentCode = dt.Rows[i].ItemArray[0].ToString();
                    ms.monitorSiteCode = dt.Rows[i].ItemArray[1].ToString();
                    ms.alarmUpperlimit = Convert.ToInt32(dt.Rows[i].ItemArray[2].ToString());
                    ms.alarmlowerlimit = Convert.ToInt32(dt.Rows[i].ItemArray[3].ToString());
                    ms.equipmentNo = dt.Rows[i].ItemArray[4].ToString();
                    result.Add(ms);
                }
            }
            return result;
        }

        //和数据采集平台集成，接受数据采集平台推送的实时数据 add by songshasha 2016-11-28
        public static FWResult<bool> receiveLtuData(fw.m.operationMaintenance.data.model.MBllRealTimeData entity)
        {
            WriteLog("接收成功,ltuMac:" + entity.ltuMac + ",monitorTime:" + entity.createDateTime.ToString("G") + ",monitorValue:" + entity.wKqbCurValue, "d:\\Log\\AllLog");
            FWResult<bool> result = new FWResult<bool>();
            //try
            //{
            //    //队列名称
            //    string queuepath = RealTimeData._queuepath;
            //    //如果不存在就创建队列
            //    QueueManger.Createqueue(queuepath, true);
            //    //将接受的数据发送给消息队列
            //    bool flag = QueueManger.SendMessage(entity, queuepath, new MessageQueueTransaction());
            //    result.data = flag;
            //    result.status = flag ? FWResultStatus.Success : FWResultStatus.Failure;
            //    //从消息队列中处理数据
            //    //DealData();
            //}
            //catch (Exception e)
            //{
            //    result.data = false;
            //    result.status = FWResultStatus.Failure;
            //    result.infoList.Add(e.Message);
            //}
            result = generateTaskAndSendMessagebak(entity);
            return result;
        }



        public static FWResult<bool> saveSyncData(JJMBllRealTimeData entity)
        {

            FWResult<bool> result = new FWResult<bool>();
            try
            {
                //WriteLog("接收成功," + entity.ToString(), "d:\\Log\\AllLog");
                IFWCommand fWCommand = OperationMaintenanceTaskDal.insertRealTimeDataTimespan(entity);
                FWSqlCommandStaticHelper.ExecuteNonQuery(fWCommand);
                //队列名称
                string queuepath = RealTimeData._queuepath;
                //如果不存在就创建队列
                QueueManger.Createqueue(queuepath, true);
                //将接受的数据发送给消息队列
                bool flag = QueueManger.SendMessage(entity, queuepath, new MessageQueueTransaction());
                result.data = flag;
                result.status = flag ? FWResultStatus.Success : FWResultStatus.Failure;
                //从消息队列中处理数据
                //DealData();
            }
            catch (Exception e)
            {
                result.data = false;
                result.status = FWResultStatus.Failure;
                result.infoList.Add(e.Message);
            }
            //result = generateTaskAndSendMessage(entity);
            return result;
        }


        public static FWResult<bool> saveHLWXSyncData(HTTPRealTimeData entity)
        {

            FWResult<bool> result = new FWResult<bool>();
            try
            {
                //队列名称
                string queuepath = RealTimeData._queuepath;
                //如果不存在就创建队列
                QueueManger.Createqueue(queuepath, true);
                //将接受的数据发送给消息队列
                bool flag = QueueManger.SendMessage(entity, queuepath, new MessageQueueTransaction());
                result.data = flag;
                result.status = flag ? FWResultStatus.Success : FWResultStatus.Failure;
            }
            catch (Exception e)
            {
                result.data = false;
                result.status = FWResultStatus.Failure;
                result.infoList.Add(e.Message);
            }
            //result = generateTaskAndSendMessage(entity);
            return result;
        }

        public static FWResult<IList<string>> getSyncTimespan()
        {
            FWResult<IList<string>> result = new FWResult<IList<string>>();
            IList<string> lst = new List<string>();
            try
            {
                lst = OperationMaintenanceTaskDal.getRealTimeDataTimespanByDay();
                result.data = lst;
                result.status = FWResultStatus.Success;
            }
            catch (Exception e)
            {
                result.data = lst;
                result.status = FWResultStatus.Failure;
                result.infoList.Add(e.Message);
            }
            return result;
        }

        ////处理消息队列中数据
        //public static void DealData()
        //{
        //    //获取消息队列
        //    var mq = new MessageQueue(RealTimeData._queuepath);
        //    //如果不在处理则处理数据
        //    if (!RealTimeData._isDealData)
        //    {
        //        //在处理数据
        //        RealTimeData._isDealData = true;
        //        while (true)
        //        {
        //            try
        //            {
        //                //从消息队列取出数据
        //                var m = QueueManger.ReceiveMessage<data.model.MBllRealTimeData>(mq, new MessageQueueTransaction());

        //                //Test
        //                //m.ltuMac = RealTimeData._listMonitor[Convert.ToInt32(m.ltuMac)].equipmentNo;

        //                //处理设备数据
        //                generateTaskAndSendMessage(m);
        //                //消息列队里没有数据了则不处理数据
        //                if (!QueueManger.IsHaveMessage(RealTimeData._queuepath))
        //                {
        //                    //不在处理数据
        //                    RealTimeData._isDealData = false;
        //                    break;
        //                }
        //            }
        //            catch (Exception e)
        //            {
        //                // ignored
        //            }
        //        }
        //    }
        //}

        ////处理消息队列中数据
        //public static void DealQueueMessage()
        //{
        //    //获取消息队列
        //    var mq = new MessageQueue(RealTimeData._queuepath);
        //    while (true)
        //    {
        //        try
        //        {
        //            //从消息队列取出数据
        //            var m = QueueManger.ReceiveMessage<data.model.MBllRealTimeData>(mq, new MessageQueueTransaction());
        //            if (m != null)
        //            {
        //                //m.ltuMac = RealTimeData._listMonitor[Convert.ToInt32(m.ltuMac)].equipmentNo;
        //                //处理设备数据
        //                generateTaskAndSendMessage(m);
        //            }
        //        }
        //        catch (Exception e)
        //        {
        //            // ignored
        //        }
        //    }
        //}

        /// <summary>
        /// 新增或更新日常巡检任务
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="mEntity"></param>
        /// <returns></returns>
        public static FWResult<bool> insertOrUpdateDailyMaintenanceTask(IFWUserInfo userInfo, MDailyMaintenanceTask mEntity)
        {
            FWResult<bool> result = new FWResult<bool>();

            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            List<IFWCommand> BaseCommandList = new List<IFWCommand>();
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            try
            {
                fwSqlTransaction.BeginTransaction();
                StringBuilder sbSql = new StringBuilder();
                FWSqlCommand sqlCmd = new FWSqlCommand();
                if (string.IsNullOrEmpty(mEntity.operationMaintenanceTaskCode))
                {
                    mEntity.operationMaintenanceTaskCode = Guid.NewGuid().ToString();
                    mEntity.isDis = 0;
                    mEntity.createrID = userInfo.userID;
                    mEntity.createTime = DateTime.Now;
                    mEntity.updaterID = userInfo.userID;
                    mEntity.updateTime = DateTime.Now;
                }
                else
                {
                    mEntity.updaterID = userInfo.userID;
                    mEntity.updateTime = DateTime.Now;
                }


                if (!string.IsNullOrEmpty(basicUserInfo.operationMaintenancePersonCode))
                {
                    mEntity.operationMaintenancePersonCode = basicUserInfo.operationMaintenancePersonCode;
                }

                //bool isGenerateCleanPlan = false;
                ////判断污泥和浮渣厚度，如果高于设定的高度，则生成清掏任务
                //if (!string.IsNullOrEmpty(mEntity.inclusionRemoval_F) && Convert.ToDouble(mEntity.inclusionRemoval_F) > 20)
                //{
                //    isGenerateCleanPlan = true;

                //}
                //if (!string.IsNullOrEmpty(mEntity.inclusionRemoval_D) && Convert.ToDouble(mEntity.inclusionRemoval_D) > 50)
                //{
                //    isGenerateCleanPlan = true;

                //}
                //if (!string.IsNullOrEmpty(mEntity.inclusionRemoval_D) && Convert.ToDouble(mEntity.anaerobicFilter_D) > 25)
                //{
                //    isGenerateCleanPlan = true;

                //}
                //if (!string.IsNullOrEmpty(mEntity.inclusionRemoval_D) && Convert.ToDouble(mEntity.settlingChamber_D) > 30)
                //{
                //    isGenerateCleanPlan = true;

                //}

                BllMonitorSiteCleanRecord cleanRecord = new BllMonitorSiteCleanRecord();
                if (mEntity.isNeedClean == 1)
                {
                    if (!string.IsNullOrEmpty(mEntity.operationCleanRecordCode))
                    {
                        cleanRecord.operationCleanRecordCode = mEntity.operationCleanRecordCode;
                        //cleanRecord.updaterID = userInfo.userName;
                        //cleanRecord.updateTime = DateTime.Now;
                    }
                    else
                    {
                        cleanRecord.operationCleanRecordCode = Guid.NewGuid().ToString();
                        cleanRecord.createrID = userInfo.userName;
                        cleanRecord.createTime = DateTime.Now;
                    }


                    cleanRecord.anaerobicFilter_D = mEntity.anaerobicFilter_D;
                    cleanRecord.anaerobicFilter_F = mEntity.anaerobicFilter_F;
                    cleanRecord.settlingChamber_D = mEntity.settlingChamber_D;
                    cleanRecord.settlingChamber_F = mEntity.settlingChamber_F;
                    cleanRecord.inclusionRemoval_D = mEntity.inclusionRemoval_D;
                    cleanRecord.inclusionRemoval_F = mEntity.inclusionRemoval_F;
                    cleanRecord.monitorSiteCode = mEntity.monitorSiteCode;
                    cleanRecord.operationMaintenanceTaskCode = mEntity.operationMaintenanceTaskCode;

                }

                mEntity.xDoc = "<?xml version=\"1.0\"?>" + mEntity.xDoc;
                //mEntity.damagedContentId = mEntity.damagedContentId;
                BLLDailyMaintenanceTask Entity = OperationMaintenanceBll.convertEntity<BLLDailyMaintenanceTask>(mEntity);

                if (mEntity.isNeedClean == 1)
                {
                    OperationMaintenanceTaskDal.insertOrUpdateMaintenanceCleanRecord(cleanRecord, fwSqlTransaction);
                    Entity.operationCleanRecordCode = cleanRecord.operationCleanRecordCode;
                }
                if (mEntity.isNeedClean == 0 && !string.IsNullOrEmpty(mEntity.operationCleanRecordCode))
                {
                    Entity.operationCleanRecordCode = null;
                    cleanRecord.operationCleanRecordCode = mEntity.operationCleanRecordCode;
                    cleanRecord.isdel = 1;
                    OperationMaintenanceTaskDal.insertOrUpdateMaintenanceCleanRecord(cleanRecord, fwSqlTransaction);
                }

                #region 生成接种任务

                BLLInoculationRecord inoculationRecord = new BLLInoculationRecord();
                if (mEntity.isInocation == 1)
                {
                    inoculationRecord.code = Guid.NewGuid().ToString();
                    inoculationRecord.createUserId = userInfo.userID;
                    inoculationRecord.createTime = DateTime.Now;
                    inoculationRecord.monitorSiteCode = mEntity.monitorSiteCode;
                    inoculationRecord.typeId = "";
                    InoculationRecordBll.insertOrUpdateInoculationRecord(userInfo, inoculationRecord, fwSqlTransaction);
                }

                #endregion

                ////责任人 恢复人 损坏内容为其他时更新字典表  
                //if (!string.IsNullOrEmpty(mEntity.responsibleParty) && !mEntity.responsiblePartyId.HasValue)
                //{
                //    GetCodeAndName("BLLresponsibleParty", mEntity.responsibleParty, Entity, fwSqlTransaction);
                //}
                if (!mEntity.recoveryPeopleId.HasValue && !string.IsNullOrEmpty(mEntity.recoveryPeople))
                {
                    GetCodeAndName("BLLrecoveryPeople", mEntity.recoveryPeople, Entity, fwSqlTransaction);
                }
                //if (!mEntity.damagedContentId.HasValue && !string.IsNullOrEmpty(mEntity.damagedContent))
                //{
                //    GetCodeAndName("BLLdamagedContent", mEntity.damagedContent, Entity, fwSqlTransaction);
                //}
                if (!mEntity.IRDetailId.HasValue && !string.IsNullOrEmpty(mEntity.IRDetail))
                {
                    GetCodeAndName("BLLIRDetail", mEntity.IRDetail, Entity, fwSqlTransaction);
                }

                //生成维修计划
                if (mEntity.status == 3 || mEntity.status == 2)
                {
                    MBLLOperationMaintenanceRecords momRecord = new MBLLOperationMaintenanceRecords
                    {
                        monitorSiteName = mEntity.monitorSiteName,
                        monitorSiteCode = mEntity.monitorSiteCode,
                        description = "0",
                        photoAddress = mEntity.imgName,
                        weather = 1,
                        GPS = mEntity.GPS,
                        jianzhizhen = mEntity.jianzhizhen,
                        xingzhengcun = mEntity.xingzhengcun,
                        zirancun = mEntity.zirancun,
                        operationMaintenanceTaskCode = mEntity.operationMaintenanceTaskCode,
                        solveReasult = mEntity.status == 3 ? 0 : 1,
                        maintainers = mEntity.status == 3 ? "" : mEntity.maintainers,
                        recorder_imgName = mEntity.recorder_imgName,
                        recorder = mEntity.recorder,
                        reportTime = DateTime.Now,
                        oprType = mEntity.status == 3 ? "0" : "1",
                        omTime = mEntity.status == 3 ? new DateTime?() : DateTime.Now,
                        faultDetails = !string.IsNullOrEmpty(mEntity.remark)
                            ? mEntity.remark
                            : !string.IsNullOrEmpty(mEntity.others) ? mEntity.others : mEntity.damagedContentDetail
                    };
                    sqlCmd.CommandText =
                        "select [operationMaintenanceRecordCode]  FROM [dbo].[BLLOperationMaintenanceRecords]  where [operationMaintenanceTaskCode]='" + mEntity.operationMaintenanceTaskCode + "' and monitorSiteCode='" + mEntity.monitorSiteCode + "'";
                    var dt = FWSqlCommandStaticHelper.ExecuteDataTable(sqlCmd);
                    if (dt.Rows.Count > 0)
                    {
                        momRecord.operationMaintenanceRecordCode = dt.Rows[0].ItemArray[0].ToString();
                    }
                    insertOrUpdateMaintenanceRecord(userInfo, momRecord);

                }

                //当设备的状态为供电故障，更新为设备报停
                if (mEntity.rem == "3" || mEntity.status == 5)
                {
                    sqlCmd.CommandText = "update BLLMonitorSiteRealtimeFactorData set dataState=13,updateTime='" + DateTime.Now + "',updaterID='" + userInfo.userID + "' where monitorSiteCode='" + mEntity.monitorSiteCode + "' and monitorFactorCode='000008';";
                    FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, sqlCmd);
                    if (mEntity.rem == "3")
                    {
                        Entity.damagedContentId = Entity.damagedContentId ?? "2"; //电气设备损坏
                    }
                }

                var dbresult = OperationMaintenanceTaskDal.insertOrUpdateDailyMaintenanceTask(Entity, fwSqlTransaction);
                result.data = (dbresult.dbResultStatus == FWDBResultStatus.Success);
                ////status在日常运维单中代表设备的状态，3代表供电故障，当供电故障时，将现场设备状态修改为3,3在设备状态中代表供电故障,5表示设备报停，将现场设备状态修改为13
                //if (mEntity.rem == "3" && mEntity.status != 5)
                //{
                //    sqlCmd.CommandText = "update BLLMonitorSiteRealtimeFactorData set dataState=3,updateTime='" + DateTime.Now + "',updaterID='" + userInfo.userID + "' where monitorSiteCode='" + mEntity.monitorSiteCode + "' and monitorFactorCode='000008' ";
                //    FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, sqlCmd);
                //}
                //if (mEntity.status == 5)
                //{
                //    sqlCmd.CommandText = "update BLLMonitorSiteRealtimeFactorData set dataState=13,updateTime='" + DateTime.Now + "',updaterID='" + userInfo.userID + "' where monitorSiteCode='" + mEntity.monitorSiteCode + "' and monitorFactorCode='000008' ";
                //    FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, sqlCmd);
                //}

                result.status = FWResultStatus.Success;
                fwSqlTransaction.Commit();
            }
            catch (Exception e)
            {
                result.infoList.Add(" 任务生成失败。错误在【insertDailyMaintenanceTask】" + e.Message);
                fwSqlTransaction.Rollback();
                fwSqlTransaction.Close();
                result.status = FWResultStatus.Failure;
                //return result;
            }

            return result;
        }


        /// <summary>
        /// 新增或更新录入水质信息
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="mEntity"></param>
        /// <returns></returns>
        public static FWResult<bool> insertOrUpdateWaterQuality(IFWUserInfo userInfo, MDailyMaintenanceTask mEntity)
        {
            FWResult<bool> result = new FWResult<bool>();

            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            List<IFWCommand> BaseCommandList = new List<IFWCommand>();
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            try
            {
                fwSqlTransaction.BeginTransaction();
                string sql = @"select [id]
                  ,[operationMaintenanceTaskCode]
                  ,[operationMaintenanceTaskName]
                  ,[monitorSiteCode]
                  ,[equipmentCode]
                  ,[operationMaintenancePersonCode]
                  ,[isSolve]
                  ,[opinion]
                  ,[rem]
                  ,[isDis]
                  ,[createrID]
                  ,[createTime]
                  ,[updaterID]
                  ,[updateTime]
                  ,[operationMaintenanceFormFileName]
                  ,[operationMaintenanceFormData]
                  ,[remark]
                  ,[GPS]
                  ,[imgName]
                  ,[status]
                  ,[meterNum]
                  ,[operationContent]
                  ,[inclusionRemoval_F]
                  ,[anaerobicFilter_F]
                  ,[settlingChamber_F]
                  ,[inclusionRemoval_D]
                  ,[anaerobicFilter_D]
                  ,[settlingChamber_D]
                  ,[operationContentID]
                  ,[others]
                  ,[maintainers]
                  ,[recorder]
                  ,[operationCleanRecordCode]
                  ,[recorder_imgName]
                  ,[isRecovery]
                  ,[recoveryTime]
                  ,[recoveryPeopleId]
                  ,[responsiblePartyId]
                  ,[damagedContentId]
                  ,[IRDetailId]
                  ,[xDoc]
                  ,[isNeedClean]
                  ,[isBackflow]
                  ,[backFlowNote]
                  ,[cleanNote]
                  ,[responsibleBody]
                  ,[damagedContentDetail]
                  ,[damagedItemDetails]
                  ,[reviewer_imgName]
                  ,[reviewer]
                  ,[water_COD]
                  ,[water_BOD]
                  ,[water_TP]
                  ,[water_TN]
                  ,[water_SS]
                  ,[water_NH34]
                  ,[isInocation]
                  ,[water_CreateUser]
                  ,[water_CreateTime]
                  ,[water_UpdateTime]
                  ,[water_UpdaterUser] from BLLDailyMaintenanceTask where operationMaintenanceTaskCode=@code";
                FWSqlCommand sqlCmd = new FWSqlCommand { CommandText = sql };
                sqlCmd.Parameters.AddWithValue("code", mEntity.operationMaintenanceTaskCode);
                List<BLLDailyMaintenanceTask> resultList = FWSqlEntityToFWCommandStaticHelper.queryList<BLLDailyMaintenanceTask>(sqlCmd);
                if (resultList.Count > 0)
                {
                    BLLDailyMaintenanceTask mDailyMaintenanceTask = resultList[0];
                    mDailyMaintenanceTask.water_BOD = mEntity.water_BOD;
                    mDailyMaintenanceTask.water_COD = mEntity.water_COD;
                    mDailyMaintenanceTask.water_TN = mEntity.water_TN;
                    mDailyMaintenanceTask.water_TP = mEntity.water_TP;
                    mDailyMaintenanceTask.water_SS = mEntity.water_SS;
                    mDailyMaintenanceTask.water_NH34 = mEntity.water_NH34;
                    if (!string.IsNullOrEmpty(mDailyMaintenanceTask.water_CreateUser)
                        && null != mDailyMaintenanceTask.water_CreateTime)
                    {
                        mDailyMaintenanceTask.water_UpdateTime = DateTime.Now;
                        mDailyMaintenanceTask.water_UpdaterUser = userInfo.userID;
                    }
                    else
                    {
                        mDailyMaintenanceTask.water_CreateUser = userInfo.userID;
                        mDailyMaintenanceTask.water_CreateTime = DateTime.Now;
                    }
                    var dbresult = OperationMaintenanceTaskDal.insertOrUpdateDailyMaintenanceTask(mDailyMaintenanceTask, fwSqlTransaction);
                    fwSqlTransaction.Commit();
                    result.data = (dbresult.dbResultStatus == FWDBResultStatus.Success);
                    result.status = FWResultStatus.Success;
                }
                else
                {
                    fwSqlTransaction.Rollback();
                    result.status = FWResultStatus.Failure;
                    return result;
                }
            }
            catch (Exception e)
            {
                result.infoList.Add("水质填报失败！");
                result.status = FWResultStatus.Failure;
            }
            return result;
        }


        //web端日常运维
        public static FWResult<FWPageData<MDailyMaintenanceTask>> queryPageDailyMaintenanceTaskByWeb(
            SysBasicManageUserInfo userInfo, FWPageParams pageParams, QueryTaskParams queryParams
            )
        {
            FWResult<FWPageData<MDailyMaintenanceTask>> result = new FWResult<FWPageData<MDailyMaintenanceTask>>();

            bool isOperationPerson = !string.IsNullOrEmpty(userInfo.operationMaintenancePersonCode);

            string operationPersonAdmin = null;
            if ((userInfo.userName == "CSHTADMIN" || userInfo.userName == "CSCZADMIN") && userInfo.userTypeCode == "10")
            {
                isOperationPerson = false;
                operationPersonAdmin = userInfo.userName.Substring(0, 4);
            }

            StringBuilder sqlbuilder = new StringBuilder();
            StringBuilder disStr = new StringBuilder();
            sqlbuilder.AppendFormat(@"select * from (
SELECT distinct  
canton.jianzhizhen
,canton.xingzhengcun
,canton.zirancun
,monitorSite.monitorSiteName
,MaintenanceTask.[maintainers]
,MaintenanceTask.updateTime
,MaintenanceTask.createTime
,taskStatus.name taskStatusName
,MaintenanceTask.[operationContent]
,dicRecoveryPeople.name recoveryPeople
,dicResponsibleParty.name responsibleParty
,MaintenanceTask.meterNum
,MaintenanceTask.remark
,MaintenanceTask.imgName
,MaintenanceTask.GPS
,MaintenanceTask.operationMaintenanceTaskCode
,MaintenanceTask.monitorSiteCode
,MaintenanceTask.operationMaintenanceFormData
,MaintenanceTask.damagedContentId
,MaintenanceTask.[createrID]
,MaintenanceTask.[damagedItemDetails]
,MaintenanceTask.xDoc.value('(property/structureNote)[1]','varchar(max)')+' '+MaintenanceTask.xDoc.value('(property/eControlSystemNote)[1]','varchar(max)')+' '+MaintenanceTask.xDoc.value('(property/waterPipeNote)[1]','varchar(max)')+' '+MaintenanceTask.xDoc.value('(property/PurificateTankNote)[1]','varchar(max)')+' '+MaintenanceTask.xDoc.value('(property/liftEqNote)[1]','varchar(max)') operationMaintenanceTaskName
,MaintenanceTask.reviewer_imgName,MaintenanceTask.reviewer
FROM");
            if (isOperationPerson)
            {
                sqlbuilder.AppendFormat(@" [dbo].[BLLOperationMaintenancePersonMappingMonitorSite] MPM WITH(NOLOCK),");
            }
            sqlbuilder.AppendFormat(@" dbo.BLLDailyMaintenanceTask MaintenanceTask WITH(NOLOCK)
inner JOIN BLLMonitorSite monitorSite WITH(NOLOCK) ON monitorSite.monitorSiteCode = MaintenanceTask.monitorSiteCode
LEFT JOIN dbo.FWDictionary canton WITH(NOLOCK) ON monitorSite.cantonCode=canton.code AND canton.dictionaryTypeCode='BLLCanton'
LEFT JOIN dbo.FWUserLogin userInfo WITH(NOLOCK) on MaintenanceTask.updaterID = userInfo.userID and userInfo.isDis=0
LEFT JOIN dbo.FWDictionary taskStatus WITH(NOLOCK) ON MaintenanceTask.status=taskStatus.code AND taskStatus.dictionaryTypeCode='BLLInspectionResult'
LEFT JOIN dbo.FWDictionary dicResponsibleParty WITH(NOLOCK) ON cast(MaintenanceTask.responsiblePartyId as varchar)=dicResponsibleParty.code and dicResponsibleParty.dictionaryTypeCode='BLLresponsibleParty'
LEFT JOIN dbo.FWDictionary dicRecoveryPeople WITH(NOLOCK) ON cast(MaintenanceTask.recoveryPeopleId as varchar)=dicRecoveryPeople.code and
dicRecoveryPeople.dictionaryTypeCode='BLLrecoveryPeople'
LEFT JOIN dbo.FWDictionary dicIRDetail WITH(NOLOCK) ON cast(MaintenanceTask.IRDetailId as varchar)=dicIRDetail.code and
dicIRDetail.dictionaryTypeCode='BLLIRDetail'
left JOIN dbo.BLLEquipment be WITH(NOLOCK) ON be.equipmentCode = MaintenanceTask.equipmentCode 
WHERE ISNULL(MaintenanceTask.isDis,0)=0 ");
            if (isOperationPerson)
            {
                sqlbuilder.AppendFormat(@" and monitorSite.monitorSiteCode=MPM.monitorSiteCode
 and MaintenanceTask.updaterID= (select a.userID from [dbo].[FWUserLogin] a,[dbo].[BLLOperationMaintenancePerson] b
 where b.operationMaintenancePersonCode='{0}' and a.userID=b.userID) ",
                    FWSqlCommandStaticHelper.checkParam(userInfo.operationMaintenancePersonCode));


            }

            if (!string.IsNullOrEmpty(operationPersonAdmin))
            {
                sqlbuilder.AppendFormat(@"AND userInfo.userName like '{0}%'", operationPersonAdmin);
            }

            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.keyword))
                {
                    sqlbuilder.AppendFormat(@" AND ( monitorSite.monitorSiteName like '%{0}%' OR be.equipmentNo like'%{0}%' or canton.fullName like'%{0}%' or MaintenanceTask.operationMaintenanceTaskName like'%{0}%' ) ", FWSqlCommandStaticHelper.checkParam(queryParams.keyword));
                }
                if (queryParams.dStart.HasValue && queryParams.dEnd.HasValue)
                {
                    sqlbuilder.AppendFormat(@" and (
(MaintenanceTask.createTime BETWEEN convert(datetime,'{0}') and  convert(datetime,'{1}'))   
--or (MaintenanceTask.updateTime BETWEEN convert(datetime,'{0}') and  convert(datetime,'{1}') ) 
)", queryParams.dStart.Value.ToString("yyyy-MM-dd 00:00:00"), queryParams.dEnd.Value.ToString("yyyy-MM-dd 23:59:59"));
                }

                if (queryParams.isSolve.HasValue)
                {
                    sqlbuilder.AppendFormat(@" AND ISNULL(MaintenanceTask.isSolve,0) ={0}", queryParams.isSolve);
                }

                //分项目，add by lxg 20180521
                if (!string.IsNullOrEmpty(queryParams.projectNo))
                {
                    sqlbuilder.AppendFormat(@" and monitorSite.projectNo='{0}'", queryParams.projectNo);
                }

                if (!string.IsNullOrEmpty(queryParams.cantonCode))
                {
                    sqlbuilder.AppendFormat(@" and monitorSite.cantonCode like '{0}%' ", FWSqlCommandStaticHelper.checkParam(queryParams.cantonCode));
                }

                //查询增加责任方，损坏内容，恢复人  add by lxg 20180321
                if (queryParams.responsiblePartyId.HasValue)
                {
                    sqlbuilder.AppendFormat(@" and MaintenanceTask.responsiblePartyId={0}",
                        queryParams.responsiblePartyId.Value);
                }
                if (!string.IsNullOrEmpty(queryParams.damagedContentId))
                {
                    sqlbuilder.AppendFormat(@" and MaintenanceTask.damagedContentId like '%{0}%'", queryParams.damagedContentId);
                }
                if (queryParams.recoveryPeopleId.HasValue)
                {
                    sqlbuilder.AppendFormat(@" and MaintenanceTask.recoveryPeopleId={0}", queryParams.recoveryPeopleId);
                }
                //过滤巡检状态 add by lxg 20180713
                if (!string.IsNullOrEmpty(queryParams.inspectionStatus))
                {
                    sqlbuilder.AppendFormat(@" and MaintenanceTask.status='{0}'", queryParams.inspectionStatus);
                }

            }

            if (userInfo.cantonCodeList.Count > 0)
            {
                sqlbuilder.AppendFormat(@" AND ({0}) ", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", userInfo.cantonCodeList));
            }
            sqlbuilder.Append(@" ) temp order by updateTime desc");

            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MDailyMaintenanceTask>(fwPageProcedureParams);

                string damagedContentSql =
                    "SELECT code,name FROM [dbo].[FWDictionary] where dictionaryTypeCode='BLLdamagedContent' and isDis=0 ";
                var dicDC = FWSqlCommandStaticHelper.ExecuteDataTable(
                    new FWSqlCommand { CommandText = damagedContentSql });
                Dictionary<string, string> dic = new Dictionary<string, string>();
                foreach (DataRow item in dicDC.Rows)
                {
                    dic.Add(item[0].ToString(), item[1].ToString());
                }

                //获取上一次电表读数  损坏内容               
                foreach (var item in result.data.entityList)
                {
                    StringBuilder sb = new StringBuilder();
                    sb.AppendFormat(@"SELECT TOP 1 meterNum FROM [dbo].[BLLDailyMaintenanceTask] where createTime<'{0}' and monitorSiteCode='{1}' order by createTime desc", item.createTime, item.monitorSiteCode);
                    FWSqlCommand cmd = new FWSqlCommand { CommandText = sb.ToString() };
                    var dt = FWSqlCommandStaticHelper.ExecuteDataTable(cmd);
                    if (dt.Rows.Count > 0)
                    {
                        item.lastMeterNum = dt.Rows[0][0].ToString();
                    }
                    if (!string.IsNullOrEmpty(item.damagedContentId))
                    {
                        var conIDs = item.damagedContentId.Split('、');
                        foreach (var itemId in conIDs)
                        {
                            if (dic.Keys.Contains(itemId))
                            {
                                item.damagedContent += dic[itemId] + " ";
                            }
                        }
                    }
                }

                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询日常运维列表出错。错误在：【queryPageDailyMaintenanceTask】" + ex.Message.ToString());
            }
            return result;
        }

        public static FWResult<FWPageData<MDailyMaintenanceTask>> queryPageDailyWaterQuality1(
           SysBasicManageUserInfo userInfo, FWPageParams pageParams, QueryTaskParams queryParams
           )
        {

            #region 业务SQL
            bool isOperationPerson = !string.IsNullOrEmpty(userInfo.operationMaintenancePersonCode);
            StringBuilder sqlbuilder = new StringBuilder();
            StringBuilder disStr = new StringBuilder();
            sqlbuilder.AppendFormat(@"
                SELECT distinct  
                canton.jianzhizhen
                ,canton.xingzhengcun
                ,canton.zirancun
                ,monitorSite.monitorSiteName
                ,MaintenanceTask.maintainers
                ,MaintenanceTask.updateTime
                ,MaintenanceTask.createTime
                ,MaintenanceTask.remark
                ,MaintenanceTask.imgName
                ,MaintenanceTask.GPS
                ,MaintenanceTask.operationMaintenanceTaskCode
                ,MaintenanceTask.monitorSiteCode
                ,MaintenanceTask.createrID
                ,MaintenanceTask.water_BOD
                ,MaintenanceTask.water_COD
                ,MaintenanceTask.water_TP
                ,MaintenanceTask.water_TN
                ,MaintenanceTask.water_SS
                ,MaintenanceTask.water_NH34
                ,CASE WHEN MaintenanceTask.water_UpdateTime IS NULL THEN MaintenanceTask.water_CreateTime ELSE MaintenanceTask.water_UpdateTime END AS water_time
                FROM ");
            if (isOperationPerson)
            {
                sqlbuilder.AppendFormat(@" [dbo].[BLLOperationMaintenancePersonMappingMonitorSite] MPM WITH(NOLOCK),");
            }
            sqlbuilder.AppendFormat(@" dbo.BLLDailyMaintenanceTask MaintenanceTask WITH(NOLOCK)
                INNER JOIN BLLMonitorSite monitorSite WITH(NOLOCK) ON monitorSite.monitorSiteCode = MaintenanceTask.monitorSiteCode
                LEFT JOIN dbo.FWDictionary canton WITH(NOLOCK) ON monitorSite.cantonCode=canton.code AND canton.dictionaryTypeCode='BLLCanton'
                LEFT JOIN dbo.BLLEquipment be WITH(NOLOCK) ON be.equipmentCode = MaintenanceTask.equipmentCode 
                WHERE ISNULL(MaintenanceTask.isDis,0)=0 ");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.keyword))
                {
                    sqlbuilder.AppendFormat(@" AND ( monitorSite.monitorSiteName like '%{0}%' 
                        OR be.equipmentNo like'%{0}%' 
                        OR canton.fullName like'%{0}%' ) "
                        , FWSqlCommandStaticHelper.checkParam(queryParams.keyword));
                }
                if (queryParams.dStart.HasValue && queryParams.dEnd.HasValue)
                {
                    sqlbuilder.AppendFormat(@" AND ((MaintenanceTask.createTime BETWEEN convert(datetime,'{0}') and  convert(datetime,'{1}')))"
                        , FWSqlCommandStaticHelper.checkParam(queryParams.dStart.Value.ToString("yyyy-MM-dd 00:00:00"))
                        , FWSqlCommandStaticHelper.checkParam(queryParams.dEnd.Value.ToString("yyyy-MM-dd 23:59:59")));
                }
                if (!string.IsNullOrEmpty(queryParams.projectNo))
                {
                    sqlbuilder.AppendFormat(@" and monitorSite.projectNo='{0}'", FWSqlCommandStaticHelper.checkParam(queryParams.projectNo));
                }
                if (!string.IsNullOrEmpty(queryParams.cantonCode))
                {
                    sqlbuilder.AppendFormat(@" and monitorSite.cantonCode like '{0}%' ", FWSqlCommandStaticHelper.checkParam(queryParams.cantonCode));
                }
            }
            if (userInfo.cantonCodeList.Count > 0)
            {
                sqlbuilder.AppendFormat(@" AND ({0}) ", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", userInfo.cantonCodeList));
            }
            sqlbuilder.Append(@" ) temp order by updateTime desc");
            #endregion

            #region 数据结果
            FWResult<FWPageData<MDailyMaintenanceTask>> result = new FWResult<FWPageData<MDailyMaintenanceTask>>();
            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MDailyMaintenanceTask>(fwPageProcedureParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add("查询水质列表出错。错误在：【queryPageDailyMaintenanceTask】" + ex.Message.ToString());
            }
            return result; 
            #endregion
        }

        public static FWResult<FWPageData<MDailyMaintenanceTask>> queryPageDailyWaterQuality(
            SysBasicManageUserInfo userInfo, FWPageParams pageParams, QueryTaskParams queryParams
            )
        {
            FWResult<FWPageData<MDailyMaintenanceTask>> result = new FWResult<FWPageData<MDailyMaintenanceTask>>();

            bool isOperationPerson = !string.IsNullOrEmpty(userInfo.operationMaintenancePersonCode);

            string operationPersonAdmin = null;

            StringBuilder sqlbuilder = new StringBuilder();
            StringBuilder disStr = new StringBuilder();
            sqlbuilder.AppendFormat(@"select * from (
            SELECT distinct  
            canton.jianzhizhen
            ,canton.xingzhengcun
            ,canton.zirancun
            ,monitorSite.monitorSiteName
            ,MaintenanceTask.[maintainers]
            ,MaintenanceTask.updateTime
            ,MaintenanceTask.createTime
            ,taskStatus.name taskStatusName
            ,MaintenanceTask.[operationContent]
            ,dicRecoveryPeople.name recoveryPeople
            ,dicResponsibleParty.name responsibleParty
            ,MaintenanceTask.meterNum
            ,MaintenanceTask.remark
            ,MaintenanceTask.imgName
            ,MaintenanceTask.GPS
            ,MaintenanceTask.operationMaintenanceTaskCode
            ,MaintenanceTask.monitorSiteCode
            ,MaintenanceTask.operationMaintenanceFormData
            ,MaintenanceTask.damagedContentId
            ,MaintenanceTask.[createrID]
            ,MaintenanceTask.[damagedItemDetails]
            ,MaintenanceTask.water_BOD
            ,MaintenanceTask.water_COD
            ,MaintenanceTask.water_TP
            ,MaintenanceTask.water_TN
            ,MaintenanceTask.water_SS
            ,MaintenanceTask.water_NH34
            ,CASE WHEN MaintenanceTask.water_UpdateTime IS NULL THEN MaintenanceTask.water_CreateTime ELSE MaintenanceTask.water_UpdateTime END AS water_time
            FROM");
            if (isOperationPerson)
            {
                sqlbuilder.AppendFormat(@" [dbo].[BLLOperationMaintenancePersonMappingMonitorSite] MPM WITH(NOLOCK),");
            }
            sqlbuilder.AppendFormat(@" dbo.BLLDailyMaintenanceTask MaintenanceTask WITH(NOLOCK)
                INNER JOIN BLLMonitorSite monitorSite WITH(NOLOCK) ON monitorSite.monitorSiteCode = MaintenanceTask.monitorSiteCode
                LEFT JOIN dbo.FWDictionary canton WITH(NOLOCK) ON monitorSite.cantonCode=canton.code AND canton.dictionaryTypeCode='BLLCanton'
                LEFT JOIN dbo.FWUserLogin userInfo WITH(NOLOCK) on MaintenanceTask.updaterID = userInfo.userID and userInfo.isDis=0
                LEFT JOIN dbo.FWDictionary taskStatus WITH(NOLOCK) ON MaintenanceTask.status=taskStatus.code AND taskStatus.dictionaryTypeCode='BLLInspectionResult'
                LEFT JOIN dbo.FWDictionary dicResponsibleParty WITH(NOLOCK) ON cast(MaintenanceTask.responsiblePartyId as varchar)=dicResponsibleParty.code and dicResponsibleParty.dictionaryTypeCode='BLLresponsibleParty'
                LEFT JOIN dbo.FWDictionary dicRecoveryPeople WITH(NOLOCK) ON cast(MaintenanceTask.recoveryPeopleId as varchar)=dicRecoveryPeople.code and
                dicRecoveryPeople.dictionaryTypeCode='BLLrecoveryPeople'
                LEFT JOIN dbo.FWDictionary dicIRDetail WITH(NOLOCK) ON cast(MaintenanceTask.IRDetailId as varchar)=dicIRDetail.code and
                dicIRDetail.dictionaryTypeCode='BLLIRDetail'
                left JOIN dbo.BLLEquipment be WITH(NOLOCK) ON be.equipmentCode = MaintenanceTask.equipmentCode 
                WHERE ISNULL(MaintenanceTask.isDis,0)=0 ");
            if (isOperationPerson)
            {
                sqlbuilder.AppendFormat(@" and monitorSite.monitorSiteCode=MPM.monitorSiteCode
                     and MaintenanceTask.updaterID= (select a.userID from [dbo].[FWUserLogin] a,[dbo].[BLLOperationMaintenancePerson] b
                     where b.operationMaintenancePersonCode='{0}' and a.userID=b.userID) ",
                FWSqlCommandStaticHelper.checkParam(userInfo.operationMaintenancePersonCode));
            }
            if (!string.IsNullOrEmpty(operationPersonAdmin))
            {
                sqlbuilder.AppendFormat(@"AND userInfo.userName like '{0}%'", operationPersonAdmin);
            }
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.keyword))
                {
                    sqlbuilder.AppendFormat(@" AND ( monitorSite.monitorSiteName like '%{0}%' OR be.equipmentNo like'%{0}%' or canton.fullName like'%{0}%' or MaintenanceTask.operationMaintenanceTaskName like'%{0}%' ) "
                        , FWSqlCommandStaticHelper.checkParam(queryParams.keyword));
                }
                if (queryParams.dStart.HasValue && queryParams.dEnd.HasValue)
                {
                    sqlbuilder.AppendFormat(@" AND (
                    (MaintenanceTask.createTime BETWEEN convert(datetime,'{0}') and  convert(datetime,'{1}'))   
                    --or (MaintenanceTask.updateTime BETWEEN convert(datetime,'{0}') and  convert(datetime,'{1}') ) 
                    )", queryParams.dStart.Value.ToString("yyyy-MM-dd 00:00:00"), queryParams.dEnd.Value.ToString("yyyy-MM-dd 23:59:59"));
                }

                if (queryParams.isSolve.HasValue)
                {
                    sqlbuilder.AppendFormat(@" AND ISNULL(MaintenanceTask.isSolve,0) ={0}", queryParams.isSolve);
                }
                if (!string.IsNullOrEmpty(queryParams.projectNo))
                {
                    sqlbuilder.AppendFormat(@" and monitorSite.projectNo='{0}'", queryParams.projectNo);
                }

                if (!string.IsNullOrEmpty(queryParams.cantonCode))
                {
                    sqlbuilder.AppendFormat(@" and monitorSite.cantonCode like '{0}%' ", FWSqlCommandStaticHelper.checkParam(queryParams.cantonCode));
                }
                if (queryParams.responsiblePartyId.HasValue)
                {
                    sqlbuilder.AppendFormat(@" and MaintenanceTask.responsiblePartyId={0}",
                        queryParams.responsiblePartyId.Value);
                }
                if (!string.IsNullOrEmpty(queryParams.damagedContentId))
                {
                    sqlbuilder.AppendFormat(@" and MaintenanceTask.damagedContentId like '%{0}%'", queryParams.damagedContentId);
                }
                if (queryParams.recoveryPeopleId.HasValue)
                {
                    sqlbuilder.AppendFormat(@" and MaintenanceTask.recoveryPeopleId={0}", queryParams.recoveryPeopleId);
                }
                if (!string.IsNullOrEmpty(queryParams.inspectionStatus))
                {
                    sqlbuilder.AppendFormat(@" and MaintenanceTask.status='{0}'", queryParams.inspectionStatus);
                }
            }
            if (userInfo.cantonCodeList.Count > 0)
            {
                sqlbuilder.AppendFormat(@" AND ({0}) ", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", userInfo.cantonCodeList));
            }
            sqlbuilder.Append(@" ) temp order by updateTime desc");

            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MDailyMaintenanceTask>(fwPageProcedureParams);

                string damagedContentSql =
                    "SELECT code,name FROM [dbo].[FWDictionary] where dictionaryTypeCode='BLLdamagedContent' and isDis=0 ";
                var dicDC = FWSqlCommandStaticHelper.ExecuteDataTable(
                    new FWSqlCommand { CommandText = damagedContentSql });
                Dictionary<string, string> dic = new Dictionary<string, string>();
                foreach (DataRow item in dicDC.Rows)
                {
                    dic.Add(item[0].ToString(), item[1].ToString());
                }           
                foreach (var item in result.data.entityList)
                {
                    StringBuilder sb = new StringBuilder();
                    sb.AppendFormat(@"SELECT TOP 1 meterNum FROM [dbo].[BLLDailyMaintenanceTask] where createTime<'{0}' and monitorSiteCode='{1}' order by createTime desc", item.createTime, item.monitorSiteCode);
                    FWSqlCommand cmd = new FWSqlCommand { CommandText = sb.ToString() };
                    var dt = FWSqlCommandStaticHelper.ExecuteDataTable(cmd);
                    if (dt.Rows.Count > 0)
                    {
                        item.lastMeterNum = dt.Rows[0][0].ToString();
                    }
                    if (!string.IsNullOrEmpty(item.damagedContentId))
                    {
                        var conIDs = item.damagedContentId.Split('、');
                        foreach (var itemId in conIDs)
                        {
                            if (dic.Keys.Contains(itemId))
                            {
                                item.damagedContent += dic[itemId] + " ";
                            }
                        }
                    }
                }

                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询日常运维列表出错。错误在：【queryPageDailyMaintenanceTask】" + ex.Message.ToString());
            }
            return result;
        }

        public static FWResult<FWPageData<MDailyMaintenanceTask>> queryPageDailyMaintenanceTask(SysBasicManageUserInfo userInfo, FWPageParams pageParams, QueryTaskParams queryParams)
        {
            FWResult<FWPageData<MDailyMaintenanceTask>> result = new FWResult<FWPageData<MDailyMaintenanceTask>>();

            bool isOperationPerson = !string.IsNullOrEmpty(userInfo.operationMaintenancePersonCode);

            string operationPersonAdmin = null;
            if ((userInfo.userName == "CSHTAdmin" || userInfo.userName == "CSCZAdmin") && userInfo.userTypeCode == "10")
            {
                isOperationPerson = false;
                operationPersonAdmin = userInfo.userName.Substring(0, 4);
            }

            StringBuilder sqlbuilder = new StringBuilder();
            StringBuilder disStr = new StringBuilder();
            sqlbuilder.AppendFormat(@"select * from (
SELECT distinct  
MaintenanceTask.operationMaintenanceTaskCode
,MaintenanceTask.operationMaintenanceTaskName
,monitorSite.monitorSiteName
,MaintenanceTask.createTime
,MaintenanceTask.updateTime
,userInfo.userName operationMaintenancePersonName
,taskStatus.name taskStatusName
FROM ");
            if (isOperationPerson)
            {
                sqlbuilder.AppendFormat(@" [dbo].[BLLOperationMaintenancePersonMappingMonitorSite] MPM WITH(NOLOCK),");
            }
            sqlbuilder.AppendFormat(@" dbo.BLLDailyMaintenanceTask MaintenanceTask WITH(NOLOCK)
inner JOIN BLLMonitorSite monitorSite WITH(NOLOCK) ON monitorSite.monitorSiteCode = MaintenanceTask.monitorSiteCode
LEFT JOIN dbo.FWUserLogin userInfo WITH(NOLOCK) on MaintenanceTask.updaterID = userInfo.userID and userInfo.isDis=0
LEFT JOIN dbo.FWDictionary taskStatus WITH(NOLOCK) ON MaintenanceTask.status=taskStatus.code AND taskStatus.dictionaryTypeCode='BLLInspectionResult'
left JOIN dbo.BLLEquipment be WITH(NOLOCK) ON be.equipmentCode = MaintenanceTask.equipmentCode 
WHERE ISNULL(MaintenanceTask.isDis,0)=0 ");
            if (isOperationPerson)
            {
                sqlbuilder.AppendFormat(@" and monitorSite.monitorSiteCode=MPM.monitorSiteCode
 and MaintenanceTask.updaterID= (select a.userID from [dbo].[FWUserLogin] a,[dbo].[BLLOperationMaintenancePerson] b
 where b.operationMaintenancePersonCode='{0}' and a.userID=b.userID) ",
                    FWSqlCommandStaticHelper.checkParam(userInfo.operationMaintenancePersonCode));
            }

            if (!string.IsNullOrEmpty(operationPersonAdmin))
            {
                sqlbuilder.AppendFormat(@"AND userInfo.userName like '{0}%'", operationPersonAdmin);
            }

            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.keyword))
                {
                    sqlbuilder.AppendFormat(@" and (monitorSite.monitorSiteName like '%{0}%' or be.equipmentNo like '%{0}%')",
                        queryParams.keyword.Trim());
                }
                //分项目，add by lxg 20180521
                if (!string.IsNullOrEmpty(queryParams.projectNo))
                {
                    sqlbuilder.AppendFormat(@" and monitorSite.projectNo='{0}'", queryParams.projectNo);
                }

                if (!string.IsNullOrEmpty(queryParams.cantonCode))
                {
                    sqlbuilder.AppendFormat(@" and monitorSite.cantonCode like '{0}%' ", FWSqlCommandStaticHelper.checkParam(queryParams.cantonCode));
                }
            }
            if (userInfo.cantonCodeList.Count > 0)
            {
                sqlbuilder.AppendFormat(@" AND ({0}) ", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", userInfo.cantonCodeList));
            }
            sqlbuilder.Append(@" ) temp order by createTime desc");

            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MDailyMaintenanceTask>(fwPageProcedureParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询日常运维列表出错。错误在：【queryPageDailyMaintenanceTask】" + ex.Message.ToString());
            }
            return result;
        }

        public static FWResult<List<MDailyMaintenanceTask>> queryDailyMaintenanceTask(IFWUserInfo userInfo, QueryTaskParams queryParams)
        {
            FWResult<List<MDailyMaintenanceTask>> result = new FWResult<List<MDailyMaintenanceTask>>();

            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            bool isOperationPerson = !string.IsNullOrEmpty(basicUserInfo.operationMaintenancePersonCode);

            StringBuilder sqlbuilder = new StringBuilder();

            sqlbuilder.AppendFormat(@"SELECT   monitorSite.cantonCode
,canton.fullName cantonName
,be.equipmentName,be.equipmentNo
,MaintenanceTask.operationMaintenanceTaskCode
,MaintenanceTask.operationMaintenanceTaskName
,MaintenanceTask.monitorSiteCode
,monitorSite.monitorSiteName
,ISNULL(MaintenanceTask.isSolve,0) isSolve 
,MaintenanceTask.rem,MaintenanceTask.isDis
,MaintenanceTask.createrID
,MaintenanceTask.createTime
,MaintenanceTask.updaterID
,MaintenanceTask.updateTime
,MaintenanceTask.operationMaintenanceFormData
,MaintenanceTask.remark
,MaintenanceTask.GPS
,MaintenanceTask.imgName
,userInfo.userName operationMaintenancePersonName
,MaintenanceTask.meterNum
,MaintenanceTask.status
,taskStatus.name taskStatusName
,MaintenanceTask.operationContent+MaintenanceTask.others operationContentAll
,MaintenanceTask.[operationContent]
,MaintenanceTask.[inclusionRemoval_F]
,MaintenanceTask.[anaerobicFilter_F]
,MaintenanceTask.[settlingChamber_F]
,MaintenanceTask.[inclusionRemoval_D]
,MaintenanceTask.[anaerobicFilter_D]
,MaintenanceTask.[settlingChamber_D]
,MaintenanceTask.[operationContentID]
,MaintenanceTask.[others]
,MaintenanceTask.[maintainers]
,MaintenanceTask.[operationCleanRecordCode]
,MaintenanceTask.[recorder]
,MaintenanceTask.[recorder_imgName]
,MaintenanceTask.responsiblePartyId
,dicResponsibleParty.name responsibleParty
,MaintenanceTask.damagedContentId
,dicDamagedContent.name damagedContent
,MaintenanceTask.isRecovery
,MaintenanceTask.recoveryTime
,MaintenanceTask.recoveryPeopleId
,dicRecoveryPeople.name recoveryPeople
,MaintenanceTask.IRDetailId
,dicIRDetail.name IRDetail
,MaintenanceTask.xDoc
,MaintenanceTask.isNeedClean
,MaintenanceTask.isBackflow
,MaintenanceTask.backFlowNote
,MaintenanceTask.cleanNote
,MaintenanceTask.responsibleBody
,MaintenanceTask.damagedContentDetail
,MaintenanceTask.meterNum
,monitorSite.meterNo
,MaintenanceTask.reviewer_imgName
,MaintenanceTask.reviewer
,MaintenanceTask.water_COD
,MaintenanceTask.water_BOD
,MaintenanceTask.water_TP
,MaintenanceTask.water_TN
,MaintenanceTask.water_SS
,MaintenanceTask.water_NH34
,MaintenanceTask.isInocation
FROM dbo.BLLDailyMaintenanceTask MaintenanceTask WITH(NOLOCK)
inner JOIN BLLMonitorSite monitorSite WITH(NOLOCK) ON monitorSite.monitorSiteCode = MaintenanceTask.monitorSiteCode
LEFT JOIN dbo.FWDictionary canton WITH(NOLOCK) ON monitorSite.cantonCode=canton.code AND canton.dictionaryTypeCode='BLLCanton'
LEFT JOIN dbo.FWUserLogin userInfo WITH(NOLOCK) on MaintenanceTask.updaterID = userInfo.userID and userInfo.isDis=0
LEFT JOIN dbo.FWDictionary taskStatus WITH(NOLOCK) ON MaintenanceTask.status=taskStatus.code AND taskStatus.dictionaryTypeCode='BLLInspectionResult'
LEFT JOIN dbo.FWDictionary dicResponsibleParty WITH(NOLOCK) ON cast(MaintenanceTask.responsiblePartyId as varchar)=dicResponsibleParty.code and
dicResponsibleParty.dictionaryTypeCode='BLLresponsibleParty'
LEFT JOIN dbo.FWDictionary dicDamagedContent WITH(NOLOCK) ON cast(MaintenanceTask.damagedContentId as varchar)=dicDamagedContent.code and
dicDamagedContent.dictionaryTypeCode='BLLdamagedContent'
LEFT JOIN dbo.FWDictionary dicRecoveryPeople WITH(NOLOCK) ON cast(MaintenanceTask.recoveryPeopleId as varchar)=dicRecoveryPeople.code and
dicRecoveryPeople.dictionaryTypeCode='BLLrecoveryPeople'
LEFT JOIN dbo.FWDictionary dicIRDetail WITH(NOLOCK) ON cast(MaintenanceTask.IRDetailId as varchar)=dicIRDetail.code and
dicIRDetail.dictionaryTypeCode='BLLIRDetail'
left JOIN dbo.BLLEquipment be WITH(NOLOCK) ON be.equipmentCode = MaintenanceTask.equipmentCode 
");
            if (isOperationPerson)
            {
                sqlbuilder.AppendFormat(@" inner join [dbo].[BLLOperationMaintenancePersonMappingMonitorSite] MPM WITH(NOLOCK) on monitorSite.monitorSiteCode=MPM.monitorSiteCode
and MPM.operationMaintenancePersonCode='{0}' ", basicUserInfo.operationMaintenancePersonCode);
            }
            sqlbuilder.AppendFormat(@" WHERE ISNULL(MaintenanceTask.isDis,0)=0 ");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.operationMaintenanceTaskCode))
                {
                    sqlbuilder.AppendFormat(@" AND MaintenanceTask.operationMaintenanceTaskCode='{0}' ", queryParams.operationMaintenanceTaskCode);
                }
            }

            sqlbuilder.AppendFormat(@" AND ({0})", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", basicUserInfo.cantonCodeList));

            FWSqlCommand sqlCmd = new FWSqlCommand { CommandText = sqlbuilder.ToString() };
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MDailyMaintenanceTask>(sqlCmd);

                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询日常运维表单出错。错误在：【queryDailyMaintenanceTask】" + ex.Message.ToString());
            }
            return result;
        }

        /// <summary>
        /// 批量接受报警运维任务
        /// </summary>
        /// <param name="userInfo"></param>      
        /// <param name="insertCodeList">任务code</param>
        /// <returns></returns>
        public static FWResult<bool> multiApplyMaintainanceTask(IFWUserInfo userInfo, string codeList)
        {
            SysBasicManageUserInfo userInfo1 = (SysBasicManageUserInfo)userInfo;
            FWResult<bool> result = new FWResult<bool>();
            //string jsonArrayText1 = "[{'operationMaintenanceTaskCode':'a1','b':'b1'},{'operationMaintenanceTaskCode':'a2','b':'b2'}]";
            Newtonsoft.Json.Linq.JArray insertCodeList = (Newtonsoft.Json.Linq.JArray)JsonConvert.DeserializeObject(codeList);

            if (insertCodeList == null || insertCodeList.Count <= 0)
            {
                result.infoList.Add("参数内容不能为空！");
                return result;
            }
            List<IFWCommand> BaseCommandList = new List<IFWCommand>();
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            fwSqlTransaction.BeginTransaction();
            if (insertCodeList != null && insertCodeList.Count > 0)
            {
                for (int i = 0; i < insertCodeList.Count; i++)
                {
                    string operationMaintenanceTaskCode = insertCodeList[i]["operationMaintenanceTaskCode"].ToString();
                    MOperationMaintenanceTask operationMaintenanceTask = new MOperationMaintenanceTask();
                    operationMaintenanceTask.updaterID = userInfo.userID;
                    operationMaintenanceTask.updateTime = DateTime.Now;
                    operationMaintenanceTask.status = "2";
                    operationMaintenanceTask.operationMaintenanceTaskCode = operationMaintenanceTaskCode;
                    if (!string.IsNullOrEmpty(userInfo1.operationMaintenancePersonCode))
                    {
                        operationMaintenanceTask.operationMaintenancePersonCode = userInfo1.operationMaintenancePersonCode;
                    }
                    BLLOperationMaintenanceTask Entity = OperationMaintenanceBll.convertEntity<BLLOperationMaintenanceTask>(operationMaintenanceTask);
                    BaseCommandList.Add(OperationMaintenanceTaskDal.updateMaintenanceTask(Entity));
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
                result.infoList.Add("批量接受运维任务失败！");
                result.status = FWResultStatus.Failure;
                return result;
            }
            return result;
        }

        /// <summary>
        ///  新增或更新维修记录
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="mEntity"></param>
        /// <returns></returns>
        public static FWResult<bool> insertOrUpdateMaintenanceRecord(IFWUserInfo userInfo, MBLLOperationMaintenanceRecords mEntity)
        {
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            FWResult<bool> result = new FWResult<bool>();
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            fwSqlTransaction.BeginTransaction();
            FWSqlCommand sqlCmd = new FWSqlCommand();

            mEntity.operationMaintenanceRecordCode = mEntity.operationMaintenanceRecordCode ?? Guid.NewGuid().ToString();
            mEntity.createrID = userInfo.userName;
            mEntity.createTime = DateTime.Now;
            if (mEntity.omTime == null && (mEntity.oprType == "1" || mEntity.solveReasult == 1))
                mEntity.omTime = DateTime.Now;
            if (mEntity.solveReasult == 1)
            {
                mEntity.oprType = "1";
                if (mEntity.reportTime == null)
                {
                    mEntity.reportTime = DateTime.Now;
                }
            }
            #region 2020年4月22日11:56:5  修改 问题：创建一条未修复的数据是，产生两条数据

            //var entity = OperationMaintenanceBll.convertEntity<BLLOperationMaintenanceRecords>(mEntity);

            //BLLOperationMaintenanceRecords entityHis = new BLLOperationMaintenanceRecords();
            //if (mEntity.solveReasult == 0 && mEntity.oprType == "0" && mEntity.description != "0")
            //{
            //    entity.maintainers = "";
            //    entityHis = toNewBLLOperationMaintenanceRecords(userInfo, mEntity);
            //}
            //if (mEntity.solveReasult == 0 && mEntity.oprType == "1")
            //{
            //    entity.oprType = "0";
            //    entity.maintainers = "";
            //    entityHis = toNewBLLOperationMaintenanceRecords(userInfo, mEntity);
            //}

            if (mEntity.solveReasult == 0 && mEntity.oprType == "0" && mEntity.description != "0")
            {
                mEntity.maintainers = "";
            }
            if (mEntity.solveReasult == 0 && mEntity.oprType == "1")
            {
                mEntity.oprType = "0";
                mEntity.maintainers = "";
            }
            var entity = OperationMaintenanceBll.convertEntity<BLLOperationMaintenanceRecords>(mEntity);
            #endregion


            try
            {
                var dbresult = OperationMaintenanceTaskDal.insertOrUpdateMaintenanceRecord(entity, fwSqlTransaction);
                #region 2020年4月22日11:56:5  修改 问题：创建一条未修复的数据是，产生两条数据
                //if (!string.IsNullOrEmpty(entityHis.operationMaintenanceRecordCode) && dbresult.dbResultStatus == FWDBResultStatus.Success)
                //{
                //    dbresult = OperationMaintenanceTaskDal.insertOrUpdateMaintenanceRecord(entityHis, fwSqlTransaction);
                //}
                #endregion
                result.data = dbresult.dbResultStatus == FWDBResultStatus.Success;
                //status为处理状态，1供电故障已修复，2现场设备运行故障已修复，3模块运行故障已修复，4结案
                if (mEntity.status == 1 && mEntity.solveReasult == 1)
                {
                    sqlCmd.CommandText = "update BLLMonitorSiteRealtimeFactorData set dataState=1,updateTime='" + DateTime.Now + "',updaterID='" + userInfo.userID + "' where monitorSiteCode='" + mEntity.monitorSiteCode + "' and monitorFactorCode='000008' ";
                    FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, sqlCmd);
                }
                if (entity.solveReasult == 1)
                {
                    EquipmentPartChangeRecordDal.UpdateIsDel(entity.monitorSiteCode, fwSqlTransaction);
                    if (!string.IsNullOrEmpty(entity.partsChangedList))
                    {
                        string[] partCodes = entity.partsChangedList.Split(',');

                        foreach (var partCode in partCodes)
                        {
                            BLLEquipmentPartChangeRecord partChangeRecord = new BLLEquipmentPartChangeRecord();
                            partChangeRecord.changeTime = DateTime.Now;
                            partChangeRecord.createTime = DateTime.Now;
                            partChangeRecord.changeUserId = userInfo.userID;
                            partChangeRecord.changeRecordCode = Guid.NewGuid().ToString();
                            partChangeRecord.monitorSiteCode = entity.monitorSiteCode;
                            partChangeRecord.partCode = partCode;
                            EquipmentPartChangeRecordDal.inserOrUpdateBLLEquipmentByEquipmentCode(partChangeRecord, fwSqlTransaction);
                        }
                    }
                }
                result.status = FWResultStatus.Success;
                fwSqlTransaction.Commit();
            }
            catch (Exception e)
            {
                result.infoList.Add("维修记录添加失败。错误在【insertOrUpdateDailyMaintenanceRecord】" + e.Message.ToString());
                fwSqlTransaction.Rollback();
                fwSqlTransaction.Close();
                result.status = FWResultStatus.Failure;
            }

            return result;
        }

        public static BLLOperationMaintenanceRecords toNewBLLOperationMaintenanceRecords(IFWUserInfo userInfo,
            MBLLOperationMaintenanceRecords mEntity)
        {
            var entityHis = OperationMaintenanceBll.convertEntity<BLLOperationMaintenanceRecords>(mEntity); ;
            entityHis.omTime = DateTime.Now;
            entityHis.oprType = "1";
            entityHis.operationMaintenanceRecordCode = Guid.NewGuid().ToString();
            entityHis.operationMaintenanceTaskCode = "";
            var queryParams =
                new QueryTaskParams { operationMaintenanceRecordCode = mEntity.operationMaintenanceRecordCode };
            var e = queryMaintenanceRecord(userInfo, queryParams).data;
            if (e.Count > 0)
            {
                entityHis.monitorSiteCode = e[0].monitorSiteCode;
            }
            return entityHis;
        }
        /// <summary>
        /// 查询多条维修记录
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="pageParams"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        public static FWResult<FWPageData<MBLLOperationMaintenanceRecords>> queryPageMaintenanceRecords(SysBasicManageUserInfo userInfo, FWPageParams pageParams, QueryTaskParams queryParams)
        {
            FWResult<FWPageData<MBLLOperationMaintenanceRecords>> result = new FWResult<FWPageData<MBLLOperationMaintenanceRecords>>();

            bool isOperationPerson = !string.IsNullOrEmpty(userInfo.operationMaintenancePersonCode);

            string operationPersonAdmin = null;
            if ((userInfo.userName == "CSHTAdmin" || userInfo.userName == "CSCZAdmin") && userInfo.userTypeCode == "10")
            {
                isOperationPerson = false;
                operationPersonAdmin = userInfo.userName.Substring(0, 4);
            }

            StringBuilder sqlbuilder = new StringBuilder();
            StringBuilder disStr = new StringBuilder();
            sqlbuilder.AppendFormat(@"SELECT a.[createTime]
      ,a.[photoAddress]
      ,a.[status]
      ,a.[GPS]
      , b.name recordStatusName
      ,[operationMaintenanceRecordCode]
      ,[weather]
      ,[partsChangedList]
      ,[faultDetails]
      ,[faultReason]
      ,[solveMethod]
      ,solveReasult
      ,CASE a.weather WHEN 1 THEN '晴' WHEN 2 THEN '多云' WHEN 3 THEN '雨' ELSE '' END weatherName
      ,case  [solveReasult] when 1 then '已修复' when 0 then '未修复' end solveReasultName
      ,[unsolveReason]
      ,[maintainSuggest]
      ,a.[maintainers]
      ,a.[recorder]
      ,a.[recorder_imgName]
      ,c.monitorSiteName,monitorSiteTypeCode+'T' monitorSiteTypeCode
	  , case when a.reportTime is null then a.createTime else a.reportTime end as reportTime
      ,e.jianzhizhen
      ,e.xingzhengcun
      ,e.zirancun
      ,a.omTime
      ,a.reviewer_imgName,a.reviewer
       FROM");
            if (isOperationPerson)
            {
                sqlbuilder.AppendFormat(@" [dbo].[BLLOperationMaintenancePersonMappingMonitorSite] MPM,");
            }
            sqlbuilder.Append(@" [dbo].[BLLOperationMaintenanceRecords] a 
       left join BLLMonitorSite c  on  a.monitorSiteCode=c.monitorSiteCode
       left join BLLEquipment eq  on  a.monitorSiteCode=eq.monitorSiteCode
	   left join fwdictionary b on a.status=b.code and b.[dictionaryTypeCode]='BllInspectionDealResult'
       left join [dbo].[BLLDailyMaintenanceTask] d on a.[operationMaintenanceTaskCode]=d.[operationMaintenanceTaskCode]
       left join fwdictionary e on c.cantonCode=e.code and e.[dictionaryTypeCode]='BllCanton'
       where a.isdel=0 and c.isdel=0 ");
            if (!string.IsNullOrEmpty(queryParams.keyword))
            {
                sqlbuilder.AppendFormat(@" AND (c.monitorSiteName like'%{0}%'  or e.fullName like'%{0}%' or eq.equipmentNo like'%{0}%' )",
                    FWSqlCommandStaticHelper.checkParam(queryParams.keyword));
            }
            if (isOperationPerson)
            {
                sqlbuilder.AppendFormat(@" and c.monitorSiteCode=MPM.monitorSiteCode 
 and MPM.operationMaintenancePersonCode='{0}'", FWSqlCommandStaticHelper.checkParam(userInfo.operationMaintenancePersonCode));
            }
            if (!string.IsNullOrEmpty(operationPersonAdmin))
            {
                sqlbuilder.AppendFormat(@"AND a.createrID like '{0}%'", operationPersonAdmin);
            }
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.operationMaintenanceTaskCode))
                {
                    sqlbuilder.AppendFormat(@" and a.[operationMaintenanceTaskCode]='{0}' ", queryParams.operationMaintenanceTaskCode);
                }
            }
            if (!string.IsNullOrEmpty(queryParams.projectNo))
            {
                sqlbuilder.AppendFormat(@" and c.projectNo='{0}'", queryParams.projectNo);
            }
            if (!string.IsNullOrEmpty(queryParams.cantonCode))
            {
                sqlbuilder.AppendFormat(@" and c.cantonCode like '{0}%'", queryParams.cantonCode);
            }
            if (queryParams.dStart.HasValue && queryParams.dEnd.HasValue)
            {
                sqlbuilder.AppendFormat(@" and a.createTime BETWEEN convert(datetime,'{0}') and  convert(datetime,'{1}')", queryParams.dStart.Value.ToString("yyyy-MM-dd 00:00:00"), queryParams.dEnd.Value.ToString("yyyy-MM-dd 23:59:59"));
            }
            if (!string.IsNullOrEmpty(queryParams.oprType))
            {
                sqlbuilder.AppendFormat(@" and (a.[oprType]='{0}' )", queryParams.oprType);
            }

            if (userInfo.cantonCodeList.Count > 0)
            {
                sqlbuilder.AppendFormat(@" AND ({0}) ", SysBasicManageBll.CartonToStr("c.cantonCode", userInfo.cantonCodeList));
            }

            sqlbuilder.Append(" order by a.createTime desc");


            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MBLLOperationMaintenanceRecords>(fwPageProcedureParams);

                result.status = FWResultStatus.Success;
            }

            catch (Exception ex)
            {
                result.infoList.Add("查询运维记录列表出错。错误在：【queryPageMaintenanceRecords】" + ex.Message.ToString());
            }
            return result;
        }

        /// <summary>
        /// 查询单条维修记录
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        public static FWResult<List<MBLLOperationMaintenanceRecords>> queryMaintenanceRecord(IFWUserInfo userInfo, QueryTaskParams queryParams)
        {
            FWResult<List<MBLLOperationMaintenanceRecords>> result = new FWResult<List<MBLLOperationMaintenanceRecords>>();


            StringBuilder sqlbuilder = new StringBuilder();
            StringBuilder disStr = new StringBuilder();
            sqlbuilder.Append(@"SELECT a.[createTime]
       ,a.monitorSiteCode
      ,a.[photoAddress]
      ,a.[status]
      ,a.[GPS]
      , b.name recordStatusName
      ,[operationMaintenanceRecordCode]
      ,[weather]
      ,[partsChangedList]
      ,[faultDetails]
      ,[faultReason]
      ,[solveMethod]
      ,solveReasult
      ,case  [solveReasult] when 1 then '已修复' when 0 then '未修复' end solveReasultName
      ,[unsolveReason]
      ,[maintainSuggest]
      ,a.[maintainers]
      ,a.[recorder]
      ,a.[recorder_imgName]
      ,a.[oprType]
      ,a.[omTime]
      ,c.monitorSiteName,monitorSiteTypeCode+'T' monitorSiteTypeCode
	  ,d.createTime reportTime
      ,a.reviewer_imgName,a.reviewer
       FROM [dbo].[BLLOperationMaintenanceRecords] a left join [dbo].[BLLDailyMaintenanceTask] d on a.[operationMaintenanceTaskCode]=d.[operationMaintenanceTaskCode]
	   left join fwdictionary b on a.status=b.code and b.[dictionaryTypeCode]='BllInspectionDealResult'
	  , BLLMonitorSite c
       where 	a.isdel=0 and   a.monitorSiteCode=c.monitorSiteCode ");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.operationMaintenanceRecordCode))
                {
                    sqlbuilder.AppendFormat(@" and a.[operationMaintenanceRecordCode]='{0}' ", queryParams.operationMaintenanceRecordCode);
                }
            }
            sqlbuilder.Append(" order by a.createTime");


            FWSqlCommand sqlCmd = new FWSqlCommand();
            sqlCmd.CommandText = sqlbuilder.ToString();
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MBLLOperationMaintenanceRecords>(sqlCmd);

                result.status = FWResultStatus.Success;
            }

            catch (Exception ex)
            {
                result.infoList.Add("查询运维记录列表出错。错误在：【queryMaintenanceRecord】" + ex.Message.ToString());
            }
            return result;
        }

        /// <summary>
        /// 新增或更新清掏任务
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="mEntity"></param>
        /// <returns></returns>
        public static FWResult<bool> insertOrUpdateMaintenanceCleanRecord(IFWUserInfo userInfo, MBllMonitorSiteCleanRecord mEntity)
        {
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;

            FWResult<bool> result = new FWResult<bool>();
            List<IFWCommand> BaseCommandList = new List<IFWCommand>();

            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            fwSqlTransaction.BeginTransaction();
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            if (string.IsNullOrEmpty(mEntity.operationCleanRecordCode))
            {
                mEntity.operationCleanRecordCode = Guid.NewGuid().ToString();
                mEntity.createrID = userInfo.userName;
                mEntity.createTime = DateTime.Now;
                //mEntity.maintainers = null;
                mEntity.updaterID = userInfo.userName;
                mEntity.updateTime = DateTime.Now;
            }
            else
            {
                mEntity.updaterID = userInfo.userName;
                mEntity.updateTime = DateTime.Now;
            }

            BllMonitorSiteCleanRecord Entity = OperationMaintenanceBll.convertEntity<BllMonitorSiteCleanRecord>(mEntity);
            try
            {
                var dbresult = OperationMaintenanceTaskDal.insertOrUpdateMaintenanceCleanRecord(Entity, fwSqlTransaction);
                result.data = (dbresult.dbResultStatus == FWDBResultStatus.Success);
                result.status = FWResultStatus.Success;
                fwSqlTransaction.Commit();
            }
            catch (Exception e)
            {
                result.infoList.Add("清掏记录添加失败。错误在【insertOrUpdateMaintenanceCleanRecord】" + e.Message.ToString());
                fwSqlTransaction.Rollback();
                fwSqlTransaction.Close();
                result.status = FWResultStatus.Failure;
                //return result;
            }

            return result;
        }
        /// <summary>
        ///  查询单条清掏任务
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        public static FWResult<List<MBllMonitorSiteCleanRecord>> queryMaintenanceCleanRecord(IFWUserInfo userInfo, QueryTaskParams queryParams)
        {
            FWResult<List<MBllMonitorSiteCleanRecord>> result = new FWResult<List<MBllMonitorSiteCleanRecord>>();


            StringBuilder sqlbuilder = new StringBuilder();
            StringBuilder disStr = new StringBuilder();
            sqlbuilder.Append(@"SELECT a.[operationCleanRecordCode]
      ,[weather]
      ,a.[inclusionRemoval_F]
      ,a.[inclusionIsClean_F]
      ,[anaerobicFilter_F]
      ,[filterIsClean_F]
      ,[settlingChamber_F]
      ,[chamberIsClean_F]
      ,[remark_F]
      ,[inclusionRemoval_D]
      ,[inclusionIsClean_D]
      ,[anaerobicFilter_D]
      ,[filterIsClean_D]
      ,[settlingChamber_D]
      ,[chamberIsClean_D]
      ,[remark_D]
      ,[maintainers]
      ,[recorder]
      ,[recorder_imgName]
      ,a.[createTime],a.monitorSiteCode
      ,c.fullName cantonName,b.monitorSiteName
      ,imgName
  FROM BllMonitorSiteCleanRecord a,[dbo].[BLLMonitorSite] b,FWDictionary c
  where a.isdel=0 and a.monitorSiteCode=b.monitorSiteCode and b.cantonCode=c.code ");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.operationCleanRecordCode))
                {
                    sqlbuilder.AppendFormat(@" and a.operationCleanRecordCode='{0}' ", queryParams.operationCleanRecordCode);
                }

                //if (!string.IsNullOrEmpty(queryParams.keyword))
                //{
                //    sqlbuilder.AppendFormat(@" and (b.monitorSiteName like '%{0}%' or c.fullName like '%{0}%') ", queryParams.keyword);
                //}


            }
            //sqlbuilder.Append(" order by createTime desc");


            FWSqlCommand sqlCmd = new FWSqlCommand();
            sqlCmd.CommandText = sqlbuilder.ToString();
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MBllMonitorSiteCleanRecord>(sqlCmd);

                result.status = FWResultStatus.Success;
            }

            catch (Exception ex)
            {
                result.infoList.Add("查询运维记录列表出错。错误在：【queryMaintenanceCleanRecord】" + ex.Message.ToString());
            }
            return result;
        }

        /// <summary>
        /// 查询多条清掏任务
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="pageParams"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        public static FWResult<FWPageData<MBllMonitorSiteCleanRecord>> queryPageMaintenanceCleanRecords(SysBasicManageUserInfo userInfo, FWPageParams pageParams, QueryTaskParams queryParams)
        {
            FWResult<FWPageData<MBllMonitorSiteCleanRecord>> result = new FWResult<FWPageData<MBllMonitorSiteCleanRecord>>();

            bool isOperationPerson = !string.IsNullOrEmpty(userInfo.operationMaintenancePersonCode);

            string contractNo = null;
            if ((userInfo.userName == "CSHTAdmin" || userInfo.userName == "CSCZAdmin") && userInfo.userTypeCode == "10")
            {
                isOperationPerson = false;
                contractNo = userInfo.userName == "CSHTAdmin" ? "Y0001" : "Y0002";
            }

            StringBuilder sqlbuilder = new StringBuilder();
            StringBuilder disStr = new StringBuilder();
            sqlbuilder.AppendFormat(@"SELECT a.[operationCleanRecordCode]     
      ,[maintainers]
      ,[recorder]
      ,[recorder_imgName]
      ,a.[createTime]
      ,a.[updateTime]
      ,a.monitorSiteCode
      ,c.fullName cantonName
      ,b.monitorSiteName
      ,imgName
      ,c.jianzhizhen
      ,c.xingzhengcun
      ,c.zirancun
      ,b.householdsCount
	  ,b.householdName
,a.inclusionRemoval_F
	,a.anaerobicFilter_F
  ,a.settlingChamber_F
  ,a.remark_F
  ,inclusionRemoval_D
  ,a.anaerobicFilter_D
  ,a.settlingChamber_D,a.remark_D
,a.inclusionIsClean_F
  ,a.filterIsClean_F
  ,a.chamberIsClean_F
  ,a.inclusionIsClean_D
  ,a.filterIsClean_D
  ,a.chamberIsClean_D
,a.reviewer_imgName,a.reviewer
  FROM");
            if (!string.IsNullOrEmpty(contractNo))
            {
                sqlbuilder.AppendFormat(
                    @" [dbo].[BLLOperationMaintenanceContractMappingMonitorSite] d,[dbo].[BLLOperationMaintenanceContract] e,");
            }

            if (isOperationPerson)
            {
                sqlbuilder.AppendFormat(@" [dbo].[BLLOperationMaintenancePersonMappingMonitorSite] MPM,");
            }

            sqlbuilder.Append(@" [dbo].[BllMonitorSiteCleanRecord] a,[dbo].[BLLMonitorSite] b,FWDictionary c
  where a.isdel=0 and a.monitorSiteCode=b.monitorSiteCode and b.cantonCode=c.code ");

            if (!string.IsNullOrEmpty(contractNo))
            {
                sqlbuilder.AppendFormat(
                    @" and a.monitorSiteCode=d.monitorSiteCode and d.[operationMaintenanceContractCode]=e.[operationMaintenanceContractCode] and e.[contractNo]='{0}' ", contractNo);
            }

            if (isOperationPerson)
            {
                sqlbuilder.AppendFormat(
                    @" and b.monitorSiteCode=MPM.monitorSiteCode and MPM.operationMaintenancePersonCode='{0}'",
                    FWSqlCommandStaticHelper.checkParam(userInfo.operationMaintenancePersonCode));
            }
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.operationCleanRecordCode))
                {
                    sqlbuilder.AppendFormat(@" and a.operationCleanRecordCode='{0}' ", queryParams.operationCleanRecordCode);
                }

                if (!string.IsNullOrEmpty(queryParams.keyword))
                {
                    sqlbuilder.AppendFormat(@" and (b.monitorSiteName like '%{0}%' or c.fullName like '%{0}%') ", queryParams.keyword);
                }
                if (!string.IsNullOrEmpty(queryParams.cantonCode))
                {
                    sqlbuilder.AppendFormat(@" and b.cantonCode like '%{0}%'", queryParams.cantonCode);
                }
                //过滤项目 add  by lxg 20180716
                if (!string.IsNullOrEmpty(queryParams.projectNo))
                {
                    sqlbuilder.AppendFormat(@" and b.projectNo='{0}'", queryParams.projectNo);
                }

                if (userInfo.cantonCodeList.Count > 0)
                {
                    sqlbuilder.AppendFormat(@" AND ({0}) ", SysBasicManageBll.CartonToStr("b.cantonCode", userInfo.cantonCodeList));
                }

                if (!string.IsNullOrEmpty(queryParams.isCleaned))
                {
                    if (queryParams.isCleaned == "1")  //已清掏
                    {
                        sqlbuilder.AppendFormat(@" and a.maintainers is not null ", queryParams.isCleaned);
                        if (queryParams.dStart.HasValue && queryParams.dEnd.HasValue)
                        {
                            sqlbuilder.AppendFormat(@" and a.updateTime BETWEEN convert(datetime,'{0}') and  convert(datetime,'{1}')", queryParams.dStart.Value.ToString("yyyy-MM-dd 00:00:00"), queryParams.dEnd.Value.ToString("yyyy-MM-dd 23:59:59"));

                        }
                        sqlbuilder.Append(" order by a.updateTime desc");
                    }
                    else  //根据巡检记录生成了清掏任务，但未清掏，或是新增了清掏任务
                    {
                        sqlbuilder.AppendFormat(@" and a.maintainers is  null ", queryParams.isCleaned);
                        if (queryParams.dStart.HasValue && queryParams.dEnd.HasValue)
                        {
                            sqlbuilder.AppendFormat(@" and a.createTime BETWEEN convert(datetime,'{0}') and  convert(datetime,'{1}')", queryParams.dStart.Value.ToString("yyyy-MM-dd 00:00:00"), queryParams.dEnd.Value.ToString("yyyy-MM-dd 23:59:59"));

                        }
                        sqlbuilder.Append(" order by a.createTime desc");
                    }
                }
                else
                {
                    sqlbuilder.Append(" order by a.createTime desc");
                }



            }



            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MBllMonitorSiteCleanRecord>(fwPageProcedureParams);

                result.status = FWResultStatus.Success;
            }

            catch (Exception ex)
            {
                result.infoList.Add("查询清掏记录列表出错。错误在：【queryPageMaintenanceCleanRecords】" + ex.Message.ToString());
            }
            return result;
        }

        //字典表中责任人，损坏内容，恢复人,巡检结果详细情况Id的code，name,是其他就更新
        public static void GetCodeAndName(string typeCode, string name, BLLDailyMaintenanceTask Entity, FWSqlTransaction fwSqlTransaction)
        {
            SqlCommand cmd = new SqlCommand
            {
                CommandText = "select code,name from [dbo].[FWDictionary] where [dictionaryTypeCode]='" + typeCode + "'"
            };
            DataSet ds = FWSqlCommandStaticHelper.ExecuteDataSet(cmd);
            var codeandName = ds.Tables[0].AsEnumerable().ToDictionary(key => key.Field<string>("code"),
                value => value.Field<string>("name"));

            if (codeandName.Values.Contains(name.Trim()))
            {
                int id = Convert.ToInt32(codeandName
                    .FirstOrDefault(m => m.Value == name.Trim()).Key);
                updateId(Entity, typeCode, id);
            }
            else
            {
                int[] keys = Array.ConvertAll(codeandName.Keys.ToArray(), int.Parse);
                //更新字典表
                StringBuilder sqlbuilder = new StringBuilder();
                sqlbuilder.AppendFormat(
                    @"INSERT INTO [dbo].[FWDictionary] (dataID,dictionaryTypeCode,code,pCode,name,ix,isDis,createrID,createTime,updaterID,updateTime,level,fullCode,fullName)
  values('{0}','{8}','{1}','{8}','{2}',{3},0,'{4}','{5}','{6}','{7}',1,'{1}','{2}')",
                    Guid.NewGuid().ToString(), keys.Max() + 1, name, keys.Max() + 1, Entity.createrID, Entity.createTime, Entity.updaterID, Entity.updateTime, typeCode);
                FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, new FWSqlCommand { CommandText = sqlbuilder.ToString() });
                updateId(Entity, typeCode, keys.Max() + 1);
            }
        }


        //将运维表中责任人id，损坏内容id，恢复人id,巡检结果详细情况Id更新  
        public static void updateId(BLLDailyMaintenanceTask Entity, string typeCode, int id)
        {
            switch (typeCode)
            {
                //case "BLLresponsibleParty": Entity.responsiblePartyId = id; break;
                //case "BLLdamagedContent": Entity.damagedContentId = id; break;
                case "BLLrecoveryPeople": Entity.recoveryPeopleId = id; break;
                case "BLLIRDetail": Entity.IRDetailId = id; break;
            }
        }

        public static FWResult<bool> InsertMyData()
        {
            FWResult<bool> result = new FWResult<bool>();

            FWSqlCommand sqlCmd = new FWSqlCommand();

            string path = @"E:\sqlBulk\sqlBulkNew.txt";
            int index = 1;
            string isql =
                " insert into [dbo].[BLLMonitorSiteHisFactorData] ([monitorTime],[monitorSiteCode],[equipmentCode],[monitorFactorCode],[monitorValue],[dataSource],[dataState],[createTime]) values ";
            using (StreamReader sr = new StreamReader(path, Encoding.Default))
            {
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = sr.ReadLine()) != null)
                {
                    if (index % 1000 == 0)
                    {
                        sqlCmd.CommandText = sb.ToString();
                        try
                        {
                            FWSqlCommandStaticHelper.ExecuteNonQuery(sqlCmd);
                            sb = new StringBuilder();
                        }
                        catch (Exception e)
                        {
                            sb = new StringBuilder();
                        }

                    }
                    var dataLine = line.Split(',');
                    sb.AppendFormat(isql);
                    sb.AppendFormat(@" ('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}');", dataLine[1], dataLine[2],
                        dataLine[3], dataLine[4], dataLine[5], dataLine[6], dataLine[7], dataLine[8]);

                    index++;
                }
            }

            return result;
        }


    }
}
