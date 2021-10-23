using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwData;
using fw.m.Common;
using fw.m.basicInfo.data.model;
using fw.m.basicInfo.data;
using fw.fwDal;
using fw.m.sysBasicManage.data;
using fw.m.basicInfo.data.entity;
using fw.m.basicInfo.dal;
using System.Data;
using System.Data.SqlClient;
using System.Runtime.InteropServices;
using fw.fwDataTable;
using fw.fwSession;
using fw.m.sysBasicManage.bll;
using fw.m.sysBasicManage.service;
using fw.m.basicInfo.data.data;
using fw.m.sysManage.data.entity;
using System.Web;
using fw.fwOffice;
using fw.m.sysBasicManage.data.model;
using System.Diagnostics;

namespace fw.m.basicInfo.bll
{
    /// <summary>
    /// 现场设备管理 MBLLMonitorSite
    /// </summary>
    public class MBLLMonitorSiteBll
    {
        #region 现场设备-查询操作

        /// <summary>
        /// 现场设备 分页查询
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="pageParams"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        public static FWResult<FWPageData<MBLLMonitorSite>> queryPageMonitorSite(IFWUserInfo userInfo, FWPageParams pageParams, QueryBasicInfoParams queryParams)
        {
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            bool isOperationPerson = false;
            if (!string.IsNullOrEmpty(basicUserInfo.operationMaintenancePersonCode))
            {
                queryParams.operationMaintenancePersonCode = basicUserInfo.operationMaintenancePersonCode;
                isOperationPerson = true;
            }
            FWResult<FWPageData<MBLLMonitorSite>> result = new FWResult<FWPageData<MBLLMonitorSite>>();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            StringBuilder sqlbuilder = new StringBuilder();
            sqlbuilder.AppendFormat(@" select * from 
 (select distinct
  monitorSite.monitorSiteCode
  ,monitorSite.monitorSiteName
  ,canton.fullName cantonName
  ,st.name monitorSiteTypeName
  ,eq.equipmentNo
  ,eq.equipmentCode
  ,monitorSite.[longitudeGps]
  ,monitorSite.[latitudeGps]
  ,monitorSite.meterNo
 FROM dbo.BLLMonitorSite monitorSite WITH(NOLOCK)
LEFT JOIN dbo.FWDictionary st ON monitorSite.monitorSiteTypeCode=st.code AND st.dictionaryTypeCode='BLL_SiteType'
  LEFT JOIN dbo.FWDictionary canton WITH(NOLOCK) ON monitorSite.cantonCode=canton.code AND canton.dictionaryTypeCode='BLLCanton'
left JOIN dbo.BLLEquipment eq  WITH(NOLOCK) ON monitorSite.monitorSiteCode=eq.monitorSiteCode and eq.moduleTypeCode='1' ");
            if (isOperationPerson)
            {
                sqlbuilder.AppendFormat(@" inner join [dbo].[BLLOperationMaintenancePersonMappingMonitorSite] MPM WITH(NOLOCK) on monitorSite.monitorSiteCode=MPM.monitorSiteCode
and MPM.operationMaintenancePersonCode='{0}' ", queryParams.operationMaintenancePersonCode);
            }
            sqlbuilder.AppendFormat(@" WHERE  ISNULL(monitorSite.isDel,0)=0 ");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.keyword))
                {
                    sqlbuilder.AppendFormat(@" AND (monitorSite.monitorSiteName like'%{0}%' or eq.equipmentNo like '%{0}%' or canton.fullName like '%{0}%' or  monitorSite.householdName like'{0}%'  )",
                        FWSqlCommandStaticHelper.checkParam(queryParams.keyword));
                }
                if (queryParams.dStart.HasValue)
                {
                    sqlbuilder.AppendFormat(@" AND datediff(day,'{0}',monitorSite.operateTime)>=0  ", queryParams.dStart.Value);
                }
                if (queryParams.dEnd.HasValue)
                {
                    sqlbuilder.AppendFormat(@" AND   datediff(day,monitorSite.operateTime,'{0}')>=0   ", queryParams.dEnd.Value);
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

                if (!string.IsNullOrEmpty(queryParams.householdName))
                {
                    sqlbuilder.AppendFormat(@" AND monitorSite.householdName like'{0}%'",
                           FWSqlCommandStaticHelper.checkParam(queryParams.householdName));
                }

            }

            //Roger 2016/6/1 13:00:02 增加管辖区域
            sqlbuilder.AppendFormat(@" AND  ({0})  ", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", basicUserInfo.cantonCodeList));
            sqlbuilder.Append(@" ) temp order by cantonName desc ");

            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams
            {
                sql = sqlbuilder.ToString(),
                pageSize = pageParams.pageSize,
                pageIndex = pageParams.pageIndex
            };
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MBLLMonitorSite>(fwPageProcedureParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询监测点列表出错。错误在：【queryPageMonitorSite】" + ex.Message.ToString());
            }
            return result;
        }

        /// <summary>
        /// 现场设备 分页查询(修改时间倒序)
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="pageParams"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        public static FWResult<FWPageData<MBLLMonitorSite>> queryPageMonitorSiteByTime(IFWUserInfo userInfo, FWPageParams pageParams, QueryBasicInfoParams queryParams)
        {
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            bool isOperationPerson = false;
            if (!string.IsNullOrEmpty(basicUserInfo.operationMaintenancePersonCode))
            {
                queryParams.operationMaintenancePersonCode = basicUserInfo.operationMaintenancePersonCode;
                isOperationPerson = true;
            }
            FWResult<FWPageData<MBLLMonitorSite>> result = new FWResult<FWPageData<MBLLMonitorSite>>();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            StringBuilder sqlbuilder = new StringBuilder();
            sqlbuilder.AppendFormat(@" select * from 
 (select distinct
  monitorSite.monitorSiteCode
  ,monitorSite.monitorSiteName
  ,canton.fullName cantonName
  ,st.name monitorSiteTypeName
  ,eq.equipmentNo
  ,eq.equipmentCode
  ,monitorSite.[longitudeGps]
  ,monitorSite.[latitudeGps]
  ,monitorSite.meterNo
,monitorSite.updateTime
 FROM dbo.BLLMonitorSite monitorSite WITH(NOLOCK)
LEFT JOIN dbo.FWDictionary st ON monitorSite.monitorSiteTypeCode=st.code AND st.dictionaryTypeCode='BLL_SiteType'
  LEFT JOIN dbo.FWDictionary canton WITH(NOLOCK) ON monitorSite.cantonCode=canton.code AND canton.dictionaryTypeCode='BLLCanton'
left JOIN dbo.BLLEquipment eq  WITH(NOLOCK) ON monitorSite.monitorSiteCode=eq.monitorSiteCode and eq.moduleTypeCode='1' ");
            if (isOperationPerson)
            {
                sqlbuilder.AppendFormat(@" inner join [dbo].[BLLOperationMaintenancePersonMappingMonitorSite] MPM WITH(NOLOCK) on monitorSite.monitorSiteCode=MPM.monitorSiteCode
and MPM.operationMaintenancePersonCode='{0}' ", queryParams.operationMaintenancePersonCode);
            }
            sqlbuilder.AppendFormat(@" WHERE  ISNULL(monitorSite.isDel,0)=0 and monitorSite.longitudeGps is not null and monitorSite.latitudeGps is not null ");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.keyword))
                {
                    sqlbuilder.AppendFormat(@" AND (monitorSite.monitorSiteName like'%{0}%' or eq.equipmentNo like '%{0}%' or canton.fullName like '%{0}%' or  monitorSite.householdName like'{0}%'  )",
                        FWSqlCommandStaticHelper.checkParam(queryParams.keyword));
                }
                if (queryParams.dStart.HasValue)
                {
                    sqlbuilder.AppendFormat(@" AND datediff(day,'{0}',monitorSite.operateTime)>=0  ", queryParams.dStart.Value);
                }
                if (queryParams.dEnd.HasValue)
                {
                    sqlbuilder.AppendFormat(@" AND   datediff(day,monitorSite.operateTime,'{0}')>=0   ", queryParams.dEnd.Value);
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

                if (!string.IsNullOrEmpty(queryParams.householdName))
                {
                    sqlbuilder.AppendFormat(@" AND monitorSite.householdName like'{0}%'",
                           FWSqlCommandStaticHelper.checkParam(queryParams.householdName));
                }

            }

            //Roger 2016/6/1 13:00:02 增加管辖区域
            sqlbuilder.AppendFormat(@" AND  ({0})  ", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", basicUserInfo.cantonCodeList));
            sqlbuilder.Append(@" ) temp order by updateTime desc ");

            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams
            {
                sql = sqlbuilder.ToString(),
                pageSize = pageParams.pageSize,
                pageIndex = pageParams.pageIndex
            };
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MBLLMonitorSite>(fwPageProcedureParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询监测点列表出错。错误在：【queryPageMonitorSite】" + ex.Message.ToString());
            }
            return result;
        }

        public static FWResult<FWPageData<MBLLMonitorSite>> queryPageMonitorSiteByWeb(IFWUserInfo userInfo,
            FWPageParams pageParams, QueryBasicInfoParams queryParams)
        {
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;

            bool isOperationPerson = false;
            if (!string.IsNullOrEmpty(basicUserInfo.operationMaintenancePersonCode))
            {
                queryParams.operationMaintenancePersonCode = basicUserInfo.operationMaintenancePersonCode;
                isOperationPerson = true;
            }
            FWResult<FWPageData<MBLLMonitorSite>> result = new FWResult<FWPageData<MBLLMonitorSite>>();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            StringBuilder sqlbuilder = new StringBuilder();
            sqlbuilder.AppendFormat(@"select * from 
 (select distinct monitorSite.monitorSiteCode,monitorSite.monitorSiteName,monitorSite.cantonCode,canton.fullName cantonName,monitorSite.operateTime ,monitorSite.householdsCount,monitorSite.longitude,monitorSite.latitude,monitorSite.latitudeGps,monitorSite.longitudeGps,monitorSite.[address] ,monitorSite.isDis ,monitorSite.[householdName],monitorSite.[meterNo],monitorSite.[meterNum],monitorSite.[pumpTypeCode],monitorSite.monitorSiteTypeCode,st.name monitorSiteTypeName,pump.name pumpTypeName,monitorSite.[creater],monitorSite.createTime,monitorSite.[updater],monitorSite.updateTime ,eq.equipmentNo,eq.equipmentCode,eq.remark,eq.moduleTypeCode,moduleType.name moduleTypeName ,monitorSite.photoAddress 
 FROM dbo.BLLMonitorSite monitorSite WITH(NOLOCK)
LEFT JOIN dbo.FWDictionary pump WITH(NOLOCK) ON monitorSite.pumpTypeCode=pump.code AND pump.dictionaryTypeCode='BLL_PumpType'
LEFT JOIN dbo.FWDictionary canton WITH(NOLOCK) ON monitorSite.cantonCode=canton.code AND canton.dictionaryTypeCode='BLLCanton'
LEFT JOIN dbo.FWDictionary st WITH(NOLOCK) ON monitorSite.monitorSiteTypeCode=st.code AND st.dictionaryTypeCode='BLL_SiteType'
left JOIN dbo.BLLEquipment eq WITH(NOLOCK) ON monitorSite.monitorSiteCode=eq.monitorSiteCode  and eq.moduleTypeCode='1'
LEFT JOIN dbo.FWDictionary moduleType WITH(NOLOCK) ON eq.moduleTypeCode=moduleType.code 
AND moduleType.dictionaryTypeCode='BLLModuleType' ");
            if (isOperationPerson)
            {
                sqlbuilder.AppendFormat(@" inner join [dbo].[BLLOperationMaintenancePersonMappingMonitorSite] MPM WITH(NOLOCK) on monitorSite.monitorSiteCode=MPM.monitorSiteCode
and MPM.operationMaintenancePersonCode='{0}' ", queryParams.operationMaintenancePersonCode);
            }

            sqlbuilder.AppendFormat(@" WHERE  ISNULL(monitorSite.isDel,0)=0 ");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.keyword))
                {
                    sqlbuilder.AppendFormat(@" AND (monitorSite.monitorSiteName like'%{0}%' or eq.equipmentNo like '%{0}%' or canton.fullName like '%{0}%' or  monitorSite.householdName like'{0}%'  )",
                        FWSqlCommandStaticHelper.checkParam(queryParams.keyword));
                }
                if (queryParams.dStart.HasValue)
                {
                    sqlbuilder.AppendFormat(@" AND datediff(day,'{0}',monitorSite.operateTime)>=0  ", queryParams.dStart.Value);
                }
                if (queryParams.dEnd.HasValue)
                {
                    sqlbuilder.AppendFormat(@" AND   datediff(day,monitorSite.operateTime,'{0}')>=0   ", queryParams.dEnd.Value);
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

                if (!string.IsNullOrEmpty(queryParams.householdName))
                {
                    sqlbuilder.AppendFormat(@" AND monitorSite.householdName like'{0}%'",
                           FWSqlCommandStaticHelper.checkParam(queryParams.householdName));
                }

            }

            //Roger 2016/6/1 13:00:02 增加管辖区域
            sqlbuilder.AppendFormat(@" AND  ({0})  ", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", basicUserInfo.cantonCodeList));
            sqlbuilder.Append(@" ) temp order by");
            if (pageParams.sortFieldList != null && pageParams.sortFieldList.Count > 0)
            {
                foreach (FWSortField fwSortField in pageParams.sortFieldList)
                {
                    sqlbuilder.AppendFormat(@"{0} {1},", fwSortField.fieldName,
                        fwSortField.sortType == FWSortType.Desc ? "desc" : "asc");
                }
                sqlbuilder.Remove(sqlbuilder.Length - 1, 1);
            }
            else
            {
                sqlbuilder.AppendFormat(" updateTime desc ,cantonName desc");
            }
            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams
            {
                sql = sqlbuilder.ToString(),
                pageSize = pageParams.pageSize,
                pageIndex = pageParams.pageIndex
            };
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MBLLMonitorSite>(fwPageProcedureParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询监测点列表出错。错误在：【queryPageMonitorSite】" + ex.Message.ToString());
            }
            return result;
        }



        /// <summary>
        /// 现场设备 实体查询
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        public static FWResult<List<MBLLMonitorSite>> queryMonitorSite(SysBasicManageUserInfo userInfo, QueryBasicInfoParams queryParams)
        {
            FWResult<List<MBLLMonitorSite>> result = new FWResult<List<MBLLMonitorSite>>();

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
select 
monitorSite.monitorSiteCode
,monitorSite.monitorSiteName
,monitorSite.cantonCode
,canton.fullName cantonName
,monitorSite.operateTime 
,monitorSite.householdsCount
,monitorSite.longitude
,monitorSite.latitude
,monitorSite.latitudeGps
,monitorSite.longitudeGps
,monitorSite.[address] 
,monitorSite.isDis 
,monitorSite.[householdName]
,monitorSite.[meterNo]
,monitorSite.[meterNum]
,monitorSite.[pumpTypeCode]
,monitorSite.monitorSiteTypeCode
,st.name monitorSiteTypeName
,pump.name pumpTypeName
,monitorSite.[creater]
,monitorSite.createTime
,monitorSite.[updater]
,monitorSite.updateTime
,monitorSite.photoAddress
,be.remark
,be.moduleTypeCode
,moduleType.name moduleTypeName
,dt.dtumac
 FROM dbo.BLLMonitorSite monitorSite
left join BLLEquipment be on monitorSite.monitorSiteCode=be.monitorSiteCode
LEFT JOIN dbo.FWDictionary canton ON monitorSite.cantonCode=canton.code AND canton.dictionaryTypeCode='{0}'
LEFT JOIN dbo.FWDictionary pump ON monitorSite.pumpTypeCode=pump.code AND pump.dictionaryTypeCode='{1}' 
LEFT JOIN dbo.FWDictionary st ON monitorSite.monitorSiteTypeCode=st.code AND st.dictionaryTypeCode='{2}'
LEFT JOIN dbo.FWDictionary moduleType ON be.moduleTypeCode=moduleType.code AND moduleType.dictionaryTypeCode='{3}'
left join tbl_dtu_ltu dt on be.equipmentNo=dt.ltumac
WHERE ISNULL(monitorSite.isDel,0)=0 
", DictionaryTypeCodeSettings.BLLCanton, DictionaryTypeCodeSettings.BLLPumpType, DictionaryTypeCodeSettings.BLLSiteType, DictionaryTypeCodeSettings.BLLModuleType);
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.monitorSiteCode))
                {
                    sbSql.AppendFormat(@" AND monitorSite.monitorSiteCode='{0}'", queryParams.monitorSiteCode);
                }
                if (queryParams.monitorSiteCodeList != null && queryParams.monitorSiteCodeList.Count > 0)
                {
                    sbSql.AppendFormat(@" AND monitorSite.monitorSiteCode IN ({0})", FWSqlCommandStaticHelper.joinToSqlString(queryParams.monitorSiteCodeList));
                }
                if (!string.IsNullOrEmpty(queryParams.cantonCode))
                {
                    sbSql.AppendFormat(@" and monitorSite.cantonCode like '{0}%'  ", FWSqlCommandStaticHelper.checkParam(queryParams.cantonCode));
                }
            }

            //Roger 2016/6/1 13:00:02 增加管辖区域
            sbSql.AppendFormat(@" AND  ({0})  ", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", basicUserInfo.cantonCodeList));

            sqlCmd.CommandText = sbSql.ToString();
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MBLLMonitorSite>(sqlCmd);
                if (result.data != null && result.data.Count > 0)
                {
                    foreach (MBLLMonitorSite childEntity in result.data)
                    {
                        childEntity.monitorBasFactorList = MBLLMonitorSiteMonitorFactorBll.queryBasMonitorSiteFactor(childEntity.monitorSiteCode);
                        childEntity.monitorSiteAlarmList = MBLLMonitorSiteAlarmItemBll.queryMonitorSiteAlarmItem(childEntity.monitorSiteCode);
                        //
                        childEntity.equipmentList = EquipmentBll.queryEquipmentByMonitorSite(userInfo, childEntity.monitorSiteCode).data;

                    }
                }
                result.status = FWResultStatus.Success;
            }
            catch
            {
                result.infoList.Add("查询失败,错误在【queryMonitorSite】");
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        public static FWResult<MBLLMonitorSite> queryMonitorSiteInfo(SysBasicManageUserInfo userInfo, string monitorSiteCode)
        {
            FWResult<MBLLMonitorSite> result = new FWResult<MBLLMonitorSite>();
            if (string.IsNullOrEmpty(monitorSiteCode))
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add("现场设备主键不能为空！");
                return result;
            }

            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@"
select distinct
monitorSite.monitorSiteCode
,monitorSite.monitorSiteName
,monitorSite.cantonCode
,canton.fullName cantonName
,monitorSite.operateTime 
,monitorSite.householdsCount
,monitorSite.longitude
,monitorSite.latitude
,monitorSite.latitudeGps
,monitorSite.longitudeGps
,monitorSite.[address] 
,monitorSite.isDis 
,monitorSite.[householdName]
,monitorSite.[meterNo]
,monitorSite.[pumpTypeCode]
,monitorSite.monitorSiteTypeCode
,st.name monitorSiteTypeName
,pump.name pumpTypeName
,monitorSite.[creater]
,monitorSite.createTime
,monitorSite.[updater]
,monitorSite.updateTime 
,monitorSite.photoAddress
 FROM dbo.BLLMonitorSite monitorSite
LEFT JOIN dbo.FWDictionary canton ON monitorSite.cantonCode=canton.code AND canton.dictionaryTypeCode='{0}'
LEFT JOIN dbo.FWDictionary pump ON monitorSite.pumpTypeCode=pump.code AND pump.dictionaryTypeCode='{1}' 
LEFT JOIN dbo.FWDictionary st ON monitorSite.monitorSiteTypeCode=st.code AND st.dictionaryTypeCode='{2}'
WHERE ISNULL(monitorSite.isDel,0)=0  AND monitorSite.monitorSiteCode='{3}'
", DictionaryTypeCodeSettings.BLLCanton, DictionaryTypeCodeSettings.BLLPumpType, DictionaryTypeCodeSettings.BLLSiteType, FWSqlCommandStaticHelper.checkParam(monitorSiteCode));

            sqlCmd.CommandText = sbSql.ToString();
            try
            {
                MBLLMonitorSite siteEntiy = FWSqlEntityToFWCommandStaticHelper.query<MBLLMonitorSite>(sqlCmd);
                if (siteEntiy != null)
                {
                    siteEntiy.monitorBasFactorList = MBLLMonitorSiteMonitorFactorBll.queryBasMonitorSiteFactor(siteEntiy.monitorSiteCode);
                    siteEntiy.monitorSiteAlarmList = MBLLMonitorSiteAlarmItemBll.queryMonitorSiteAlarmItem(siteEntiy.monitorSiteCode);
                    siteEntiy.equipmentList = EquipmentBll.queryEquipmentByMonitorSite(userInfo, siteEntiy.monitorSiteCode).data;
                }
                result.data = siteEntiy;
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Failure;
            }
            return result;
        }


        /// <summary>
        /// 现场设备分配查询
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="pageParams"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        public static FWResult<FWPageData<MBLLMonitorSite>> queryPageMonitorSiteAllocator(IFWUserInfo userInfo, FWPageParams pageParams, QueryBasicInfoParams queryParams)
        {
            FWResult<FWPageData<MBLLMonitorSite>> result = new FWResult<FWPageData<MBLLMonitorSite>>();
            if (queryParams != null && string.IsNullOrEmpty(queryParams.operationMaintenanceContractCode))
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add("运维项目主键不能为空！");
                return result;
            }
            StringBuilder sqlbuilder = new StringBuilder();
            sqlbuilder.AppendFormat(@"
SELECT  * FROM (select  DISTINCT monitorSite.monitorSiteCode
,monitorSite.monitorSiteName
,monitorSite.cantonCode
,canton.fullName cantonName
,monitorSite.operateTime 
,monitorSite.householdsCount
,monitorSite.longitude
,monitorSite.latitude
,monitorSite.latitudeGps
,monitorSite.longitudeGps
,monitorSite.[address] 
,monitorSite.[householdName]
,monitorSite.[meterNo]
,monitorSite.[pumpTypeCode]
,monitorSite.monitorSiteTypeCode
,st.name monitorSiteTypeName
,pump.name pumpTypeName
,eq.equipmentNo
,map.operationMaintenanceContractCode
 FROM dbo.BLLMonitorSite monitorSite
LEFT JOIN dbo.FWDictionary pump ON monitorSite.pumpTypeCode=pump.code AND pump.dictionaryTypeCode='{1}'
LEFT JOIN dbo.FWDictionary canton ON monitorSite.cantonCode=canton.code AND canton.dictionaryTypeCode='{0}'
LEFT JOIN dbo.FWDictionary st ON monitorSite.monitorSiteTypeCode=st.code AND st.dictionaryTypeCode='{2}'
INNER JOIN dbo.BLLEquipment eq ON monitorSite.monitorSiteCode=eq.monitorSiteCode and  eq.moduleTypeCode= '1'
LEFT JOIN (
    SELECT [dataID]
      ,[operationMaintenanceContractCode]
      ,[monitorSiteCode] 
    FROM [dbo].[BLLOperationMaintenanceContractMappingMonitorSite]
    WHERE  operationMaintenanceContractCode='{3}'
) map ON monitorSite.monitorSiteCode=map.monitorSiteCode
WHERE ISNULL(monitorSite.isDel,0)=0 and ISNULL(monitorSite.isDis,0)=0
AND NOT EXISTS (  
	SELECT  *  FROM  [dbo].[BLLOperationMaintenanceContractMappingMonitorSite] cms
	where  cms.[monitorSiteCode]=monitorSite.[monitorSiteCode] AND operationMaintenanceContractCode<>'{3}'
) ",
       DictionaryTypeCodeSettings.BLLCanton,
       DictionaryTypeCodeSettings.BLLPumpType,
       DictionaryTypeCodeSettings.BLLSiteType,
    FWSqlCommandStaticHelper.checkParam(queryParams.operationMaintenanceContractCode));
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.keyword))
                {
                   sqlbuilder.AppendFormat(@" AND (monitorSite.monitorSiteName like'%{0}%' or canton.fullName like'%{0}%' or eq.equipmentNo like'%{0}%' )",
                    FWSqlCommandStaticHelper.checkParam(queryParams.keyword));
                }
                if (!string.IsNullOrEmpty(queryParams.cantonCode))
                {
                    sqlbuilder.AppendFormat(@" AND monitorSite.cantonCode like'{0}%'", FWSqlCommandStaticHelper.checkParam(queryParams.cantonCode));
                }
                //运维项目信息过滤  
                if (!string.IsNullOrEmpty(queryParams.allocatorStatusCode))
                {
                    if (queryParams.allocatorStatusCode.Equals("1"))
                    {
                        sqlbuilder.AppendFormat(@" AND map.operationMaintenanceContractCode is not null");
                    }
                    else if (queryParams.allocatorStatusCode.Equals("0"))
                    {
                        sqlbuilder.AppendFormat(@" AND map.operationMaintenanceContractCode is  null");
                    }
                }

            }
            sqlbuilder.Append(@" ) temp ");
            //modified by songshasha 2017-02-20 distinct 的时候删除order by （left join map表后返回的数据比左表多的问题解决）
            sqlbuilder.Append(@" order by ");
            if (pageParams.sortFieldList != null && pageParams.sortFieldList.Count > 0)
            {
                foreach (FWSortField fwSortField in pageParams.sortFieldList)
                {
                    switch (fwSortField.fieldName)
                    {
                        case "operateTime":
                            fwSortField.fieldName = "[operateTime]";
                            break;
                        case "cantonName":
                            fwSortField.fieldName = "[cantonCode]";
                            break;
                    }
                    sqlbuilder.AppendFormat(@"{0} {1},", fwSortField.fieldName,
                        fwSortField.sortType == FWSortType.Desc ? "desc" : "asc");
                }
                sqlbuilder.Remove(sqlbuilder.Length - 1, 1);
            }
            else
            {
                sqlbuilder.AppendFormat(" monitorSiteName");
            }


            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MBLLMonitorSite>(fwPageProcedureParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询监测点列表出错。错误在：【queryPageMonitorSite】" + ex.Message.ToString());
            }
            return result;
        }


        /// <summary>
        /// 运维人员 现场设备负责查询
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="pageParams"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        public static FWResult<FWPageData<MBLLMonitorSite>> queryPageMonitorSitePersonAllocator(IFWUserInfo userInfo, FWPageParams pageParams, QueryBasicInfoParams queryParams)
        {



            FWResult<FWPageData<MBLLMonitorSite>> result = new FWResult<FWPageData<MBLLMonitorSite>>();
            if (queryParams != null && string.IsNullOrEmpty(queryParams.operationMaintenancePersonCode))
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add("运维人员主键不能为空！");
                return result;
            }
            StringBuilder sqlbuilder = new StringBuilder();
            sqlbuilder.AppendFormat(@"
select 
monitorSite.monitorSiteCode
,monitorSite.monitorSiteName
,monitorSite.cantonCode
,canton.fullName cantonName
,monitorSite.operateTime 
,monitorSite.householdsCount
,monitorSite.longitude
,monitorSite.latitude
,monitorSite.latitudeGps
,monitorSite.longitudeGps
,monitorSite.[address] 
,monitorSite.[householdName]
,monitorSite.[meterNo]
,monitorSite.[pumpTypeCode]
,monitorSite.monitorSiteTypeCode
,st.name monitorSiteTypeName
,pump.name pumpTypeName
,eq.equipmentNo
,map.[operationMaintenancePersonCode]
 FROM dbo.BLLMonitorSite monitorSite
LEFT JOIN dbo.FWDictionary pump ON monitorSite.pumpTypeCode=pump.code AND pump.dictionaryTypeCode='{1}'
LEFT JOIN dbo.FWDictionary canton ON monitorSite.cantonCode=canton.code AND canton.dictionaryTypeCode='{0}'
LEFT JOIN dbo.FWDictionary st ON monitorSite.monitorSiteTypeCode=st.code AND st.dictionaryTypeCode='{2}'
INNER JOIN dbo.BLLEquipment eq ON monitorSite.monitorSiteCode=eq.monitorSiteCode  and   eq.moduleTypeCode= '1'
INNER JOIN (
    SELECT  DISTINCT 
    [operationMaintenancePersonCode]
    ,OMUS.[monitorSiteCode]
    FROM 
    [dbo].[BLLOperationMaintenanceContract] OMC 
    INNER JOIN  [dbo].[BLLOperationMaintenancePerson] OMU  
    ON OMU.operationMaintenanceUnitCode=OMC.operationMaintenanceUnitCode
    LEFT  JOIN [dbo].[BLLOperationMaintenanceContractMappingMonitorSite] OMUS  
    ON OMUS.[operationMaintenanceContractCode]=OMC.[operationMaintenanceContractCode]
    WHERE   [operationMaintenancePersonCode] ='{3}'
) TF ON monitorSite.[monitorSiteCode]=TF.[monitorSiteCode]
LEFT JOIN (
    SELECT  [dataID]
      ,[operationMaintenancePersonCode]
      ,[monitorSiteCode] 
  FROM  [dbo].[BLLOperationMaintenancePersonMappingMonitorSite]
    WHERE  operationMaintenancePersonCode='{3}'
) map ON monitorSite.monitorSiteCode=map.monitorSiteCode
WHERE ISNULL(monitorSite.isDel,0)=0 and ISNULL(monitorSite.isDis,0)=0
AND ( NOT EXISTS (  
	SELECT  *  FROM  [dbo].[BLLOperationMaintenancePersonMappingMonitorSite] cms
	where  cms.[monitorSiteCode]=monitorSite.[monitorSiteCode] AND operationMaintenancePersonCode<>'{3}'
) or 1=1) ",
       DictionaryTypeCodeSettings.BLLCanton,
       DictionaryTypeCodeSettings.BLLPumpType,
       DictionaryTypeCodeSettings.BLLSiteType,
    FWSqlCommandStaticHelper.checkParam(queryParams.operationMaintenancePersonCode));
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.keyword))
                {
                    sqlbuilder.AppendFormat(@" AND (monitorSite.monitorSiteName like'%{0}%'  or canton.fullName like'%{0}%' or eq.equipmentNo like'%{0}%' )",
                        FWSqlCommandStaticHelper.checkParam(queryParams.keyword));
                }
                if (!string.IsNullOrEmpty(queryParams.cantonCode))
                {
                    sqlbuilder.AppendFormat(@" AND monitorSite.cantonCode like'{0}%'", FWSqlCommandStaticHelper.checkParam(queryParams.cantonCode));
                }
                //运维项目信息过滤
                if (!string.IsNullOrEmpty(queryParams.allocatorStatusCode))
                {
                    if (queryParams.allocatorStatusCode.Equals("1"))
                    {
                        sqlbuilder.AppendFormat(@" AND map.operationMaintenancePersonCode is not null");
                    }
                    else if (queryParams.allocatorStatusCode.Equals("0"))
                    {
                        sqlbuilder.AppendFormat(@" AND map.operationMaintenancePersonCode is  null");
                    }
                }

            }


            sqlbuilder.Append(@" order by ");
            if (pageParams.sortFieldList != null && pageParams.sortFieldList.Count > 0)
            {
                foreach (FWSortField fwSortField in pageParams.sortFieldList)
                {
                    switch (fwSortField.fieldName)
                    {
                        case "operateTime":
                            fwSortField.fieldName = "monitorSite.[operateTime]";
                            break;
                        case "cantonName":
                            fwSortField.fieldName = "monitorSite.[cantonCode]";
                            break;
                    }
                    sqlbuilder.AppendFormat(@"{0} {1},", fwSortField.fieldName,
                        fwSortField.sortType == FWSortType.Desc ? "desc" : "asc");
                }
                sqlbuilder.Remove(sqlbuilder.Length - 1, 1);
            }
            else
            {
                sqlbuilder.AppendFormat(" monitorSite.updateTime desc , monitorSite.id desc");
            }
            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MBLLMonitorSite>(fwPageProcedureParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询监测点列表出错。错误在：【queryPageMonitorSite】" + ex.Message.ToString());
            }
            return result;
        }



        #endregion

        #region 现场设备-编码重复性校验
        /// <summary>
        /// 设备编号 重复验证
        /// </summary>
        /// <param name="mEntity"></param>
        /// <returns></returns>
        public static FWResult<bool> MBLLMonitorSiteNoCheck(MBLLMonitorSite mEntity)
        {
            FWResult<bool> result = new FWResult<bool>();
            if (mEntity == null || string.IsNullOrEmpty(mEntity.monitorSiteName))
            {
                result.data = false;
                result.status = FWResultStatus.Error;
                result.infoList.Add(" 参数内容有误！" + Environment.NewLine);
                return result;
            }
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            if (mEntity.action == "add")
            {

                sbSql.AppendFormat(@" 
SELECT *  FROM  [dbo].[BLLMonitorSite] a,FWDictionary  b
  where isnull(a.[isDel],0)=0  AND a.monitorSiteName= ISNULL(b.fullJC,'')+'" + FWSqlCommandStaticHelper.checkParam(mEntity.monitorSiteName) + "'");
                sbSql.AppendFormat(@" and monitorSiteCode<>'{0}' ", FWSqlCommandStaticHelper.checkParam(mEntity.monitorSiteCode));
                sbSql.AppendFormat(@" and a.cantonCode=b.code and a.cantonCode='{0}' ", FWSqlCommandStaticHelper.checkParam(mEntity.cantonCode));
            }
            else
            {
                sbSql.AppendFormat(@" 
SELECT *  FROM  [dbo].[BLLMonitorSite]
  where isnull([isDel],0)=0   AND [monitorSiteName]='{0}'  {1} ", FWSqlCommandStaticHelper.checkParam(mEntity.monitorSiteName),
             string.Format(@" and monitorSiteCode<>'{0}' ", FWSqlCommandStaticHelper.checkParam(mEntity.monitorSiteCode)));
            }
            //if (mEntity.action =="edit")
            //{

            //}
            //else if (mEntity.action =="add")
            //{

            //}
            try
            {
                fwSqlCommand.CommandText = sbSql.ToString();
                var entityList = FWSqlEntityToFWCommandStaticHelper.queryList<BLLEquipment>(fwSqlCommand);
                if (entityList != null && entityList.Count > 0)
                {
                    result.status = FWResultStatus.Failure;
                    //result.infoList.Add("该现场设备编码已存在！\n");
                }
                else
                {
                    result.status = FWResultStatus.Success;
                }

            }
            catch (Exception ex)
            {
                result.data = false;
                result.status = FWResultStatus.Error;
                result.infoList.Add(ex.Message);
            }

            return result;
        }
        #endregion

        #region 现场设备-新增/更新

        public static void defaultBLLMonitorSiteEntity(IFWUserInfo userInfo, MBLLMonitorSite entity)
        {
            if (entity != null)
            {
                if (string.IsNullOrEmpty(entity.monitorSiteCode))
                {
                    entity.monitorSiteCode = Guid.NewGuid().ToString();
                    entity.creater = userInfo.userID;
                    entity.createTime = DateTime.Now;
                    entity.isDis = entity.isDis.HasValue ? entity.isDis.Value : 0;
                    entity.isDel = entity.isDel.HasValue ? entity.isDel.Value : 0;
                }
                entity.updater = userInfo.userName;
                entity.updateTime = DateTime.Now;
            }
        }

        public static FWResult<bool> insertUpdateMBLLMonitorSite(SysBasicManageUserInfo userInfo, MBLLMonitorSite mEntity)
        {
            //mEntity.photoAddress = "ddd";

            FWResult<bool> result = new FWResult<bool>();
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            List<IFWCommand> BaseCommandList = new List<IFWCommand>();
            try
            {
                result.data = true;
                fwSqlTransaction.BeginTransaction();
                StringBuilder sbSql = new StringBuilder();
                FWSqlCommand sqlCmd = new FWSqlCommand();
                if (mEntity == null)
                {
                    throw new Exception("实体不能为空！");
                }

                #region 现场设备编码 重复性判断
                //songshasha modified by songshasha 2017-06-06 暂时取消现场设备编码重复性校验（18-1-23提交代码时，恢复校验）
                result = MBLLMonitorSiteBll.MBLLMonitorSiteNoCheck(mEntity);
                if (result.status != FWResultStatus.Success)
                {
                    throw new Exception(result.infoList.Aggregate((pre, next) => pre + ";" + next));
                }
                #endregion

                #region 现场设备 实体
                defaultBLLMonitorSiteEntity(userInfo, mEntity);
                if (!string.IsNullOrEmpty(mEntity.action) && mEntity.action.Equals("add"))
                {
                    mEntity.creater = userInfo.userID;
                    mEntity.createTime = DateTime.Now;
                }
                BLLMonitorSite siteEntity = basicInfoBll.convertEntity<BLLMonitorSite>(mEntity);
                result = insertUpdateBLLMonitorSite(userInfo, siteEntity, fwSqlTransaction);
                if (result.status != FWResultStatus.Success)
                {
                    throw new Exception("现场设备新增/更新失败！");
                }
                #endregion

                #region 报警项目

                if (mEntity.monitorSiteAlarmList != null && mEntity.monitorSiteAlarmList.Count > 0)
                {
                    BaseCommandList.AddRange(siteAlarmOPList(userInfo, mEntity, true));
                }
                #endregion

                #region 监测因子数据



                //设备监测因子详情
                var siteEqFactorMapping = MBLLMonitorSiteMonitorFactorBll.queryMonitorSiteFactorALL(mEntity.monitorSiteCode);
                var equipmentList = EquipmentBll.queryEquipmentByMonitorSite(userInfo, mEntity.monitorSiteCode).data;
                //监测因子 手机端数据不能为空
                if (mEntity.monitorBasFactorList != null && mEntity.monitorBasFactorList.Count > 0)
                {
                    //移除数据
                    List<string> factorCodeList = mEntity.monitorBasFactorList.Select(p => p.monitorFactorCode).ToList();
                    IFWCommand sqlCmd_del = MBLLMonitorSiteMonitorFactorDal.clearSiteFactorRelation(mEntity.monitorSiteCode, factorCodeList);
                    BaseCommandList.Add(sqlCmd_del);

                    #region 设备因子关系操作

                    if (equipmentList != null && equipmentList.Count > 0)
                    {
                        //遍历list 如果存在 更新 否则新增
                        foreach (var siteFactor in mEntity.monitorBasFactorList)
                        {
                            foreach (var equip in equipmentList)
                            {
                                //根据点位 设备编码  因子 来判断是否有数据 没有的话需要插入  有的话更新
                                //判断数据是否已经存在 
                                if (siteEqFactorMapping != null && siteEqFactorMapping.Count > 0)
                                {
                                    var oldList = siteEqFactorMapping.Where(p => p.equipmentCode.Equals(equip.equipmentCode) && p.monitorFactorCode.Equals(siteFactor.monitorFactorCode)).Select(p => p);
                                    if (oldList != null && oldList.Count() > 0)
                                    {
                                        //更新操作
                                        var siteEqFactorED = oldList.First();
                                        BLLMonitorSiteMonitorFactor upentity = setSiteMonitorFactor(userInfo, siteEqFactorED.dataID, mEntity.monitorSiteCode, equip.equipmentCode, siteFactor);
                                        BaseCommandList.Add(MBLLMonitorSiteMonitorFactorDal.updateMonitorSiteFactor(upentity));
                                        continue;
                                    }
                                }
                                #region 新增关联
                                BLLMonitorSiteMonitorFactor entity = setSiteMonitorFactor(userInfo, Guid.NewGuid().ToString(), mEntity.monitorSiteCode, equip.equipmentCode, siteFactor);
                                BaseCommandList.Add(MBLLMonitorSiteMonitorFactorDal.insertMonitorSiteFactor(entity));
                                //T_DAT_RealTime 增加对应关系
                                T_DAT_RealTime REntity = new T_DAT_RealTime();
                                REntity.PK_MCode = entity.dataID;
                                REntity.fdtmReal = new DateTime(1990, 1, 1);
                                REntity.fintStatis = 0;
                                REntity.fbitOver = false;
                                BaseCommandList.Add(MBLLMonitorSiteDal.inserDATRealTime(REntity));
                                #endregion
                            }
                        }
                    }
                    #endregion

                    //数据新增/更新
                    foreach (var MBasFactorEntity in mEntity.monitorBasFactorList)
                    {

                        T_Bas_MonitorSiteMonitorFactor BasFactorEntity = basicInfoBll.convertEntity<T_Bas_MonitorSiteMonitorFactor>(MBasFactorEntity);
                        BasFactorEntity.updateTime = DateTime.Now;
                        result = MBLLMonitorSiteMonitorFactorBll.insertUpdateBasMonitorSiteMonitorFactor(BasFactorEntity, fwSqlTransaction);
                        if (result.status != FWResultStatus.Success)
                        {
                            throw new Exception("现场设备 因子关系添加失败！");
                        }
                    }
                }
                #endregion
                if (BaseCommandList != null && BaseCommandList.Count > 0)
                {
                    result.data = FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, BaseCommandList);
                }
                result.status = FWResultStatus.Success;
                fwSqlTransaction.Commit();
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Error;
                fwSqlTransaction.Rollback();
                fwSqlTransaction.Close();
            }
            return result;
        }


        /// <summary>
        /// 监测点位 添加/更新
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="entity"></param>
        /// <param name="transaction"></param>
        /// <returns></returns>
        public static FWResult<bool> insertUpdateBLLMonitorSite(IFWUserInfo userInfo, BLLMonitorSite entity, IFWTransaction transaction)
        {
            FWResult<bool> result = new FWResult<bool>();
            try
            {
                var dbresult = MBLLMonitorSiteDal.inserOrUpdateMonitorSiteBySiteCode(entity, transaction);
                result.data = (dbresult.dbResultStatus == FWDBResultStatus.Success);
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

        #region 现场设备信息批量级联删除操作
        public static FWResult<bool> delMonitorSiteAndEquipmentByCascade(IFWUserInfo userInfo, List<string> monitorSiteCodeList)
        {

            FWResult<bool> result = new FWResult<bool>();
            if (monitorSiteCodeList == null || monitorSiteCodeList.Count <= 0)
            {
                result.data = false;
                result.status = FWResultStatus.Failure;
                result.infoList.Add("现场设备主键不能为空！");
                return result;
            }
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            fwSqlCommand.CommandText = string.Format(@" 
UPDATE  [dbo].[BLLEquipment] SET [isScrap]=0,[isDel]=1,[monitorSiteCode]=NULL  WHERE  [monitorSiteCode] in ({0}) ;
UPDATE  [dbo].[BLLMonitorSite] SET  [isDel]=1  WHERE  [monitorSiteCode]  in ({0}) ; 
DELETE  FROM [dbo].[BLLMonitorSiteAlarmItem] WHERE  [monitorSiteCode] in ({0}) ; 
DELETE  FROM [dbo].[BLLMonitorSiteRealtimeFactorData]  WHERE  [monitorSiteCode] in ({0}) ; 
DELETE  FROM [dbo].[BLLMonitorSiteMonitorFactor] WHERE  [monitorSiteCode] in ({0}) ; 
DELETE  FROM [dbo].[T_Bas_MonitorSiteMonitorFactor] WHERE  [monitorSiteCode] in ({0}) ;  ", FWSqlCommandStaticHelper.joinToSqlString(monitorSiteCodeList));
            try
            {
                result.data = FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlCommand) > 0;
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

        #region 现场设备-报警设置处理
        /// <summary>
        /// 报警项目操作
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="mEntity"></param>
        /// <param name="isdel"></param>
        /// <returns></returns>
        private static List<IFWCommand> siteAlarmOPList(SysBasicManageUserInfo userInfo, MBLLMonitorSite mEntity, bool isdel)
        {
            List<IFWCommand> BaseCommandList = new List<IFWCommand>();
            if (isdel)
            {
                BaseCommandList.Add(MBLLMonitorSiteAlarmItemDal.deleteMonitorSiteAlarm(mEntity.monitorSiteCode));
            }
            foreach (MMonitorSiteAlarmItem childEntity in mEntity.monitorSiteAlarmList)
            {
                childEntity.updaterID = userInfo.userID;
                childEntity.updateTime = DateTime.Now;
                if (string.IsNullOrEmpty(childEntity.dataID))
                {
                    childEntity.dataID = Guid.NewGuid().ToString();
                    childEntity.monitorSiteCode = mEntity.monitorSiteCode;
                    childEntity.createrID = userInfo.userID;
                    childEntity.createTime = DateTime.Now;

                    BLLMonitorSiteAlarmItem cEntity =
                        basicInfoBll.convertEntity<BLLMonitorSiteAlarmItem>(childEntity);
                    BaseCommandList.Add(MBLLMonitorSiteAlarmItemDal.insertMonitorSiteAlarm(cEntity));
                }
            }
            return BaseCommandList;
        }
        #endregion

        #region 现场设备-关联因子实体初始化
        /// <summary>
        /// 现场设备&因子关联实体
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="dataID">记录主键</param>
        /// <param name="monitorSiteCode">现场设备主键</param>
        /// <param name="equipmentCode">设备主键</param>
        /// <param name="BasFactorEntity">设置数据</param>
        /// <returns></returns>
        private static BLLMonitorSiteMonitorFactor setSiteMonitorFactor(SysBasicManageUserInfo userInfo, string dataID, string monitorSiteCode, string equipmentCode, MBas_MonitorSiteMonitorFactor BasFactorEntity)
        {
            BLLMonitorSiteMonitorFactor upentity = new BLLMonitorSiteMonitorFactor();
            upentity.dataID = dataID;
            upentity.monitorSiteCode = monitorSiteCode;
            upentity.equipmentCode = equipmentCode;
            upentity.monitorFactorCode = BasFactorEntity.monitorFactorCode;
            upentity.standardUpperLimit = BasFactorEntity.standardUpperLimit;
            upentity.standardLowerLimit = BasFactorEntity.standardLowerLimit;
            upentity.ix = BasFactorEntity.ix ?? 0;
            upentity.isDis = 0;
            upentity.channelNo = BasFactorEntity.channelNo;
            upentity.isSwitch = BasFactorEntity.isSwitch;
            upentity.createrID = userInfo.userID;
            upentity.createTime = DateTime.Now;
            upentity.updaterID = userInfo.userID;
            upentity.updateTime = DateTime.Now;
            upentity.alarmUpperLimit = BasFactorEntity.alarmUpperLimit;
            upentity.alarmLowerLimit = BasFactorEntity.alarmLowerLimit;
            return upentity;
        }
        #endregion

        #region 移动端方法

        #region 现场设备/设备-快速操作
        /// <summary>
        /// 现场设备/设备 单一操作
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="mEntity"></param>
        /// <returns></returns>
        public static FWResult<bool> quickAddEditMonitorSite(SysBasicManageUserInfo userInfo, MBLLMonitorSite mEntity)
        {
            FWResult<bool> result = new FWResult<bool>();
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            List<IFWCommand> BaseCommandList = new List<IFWCommand>();
            try
            {
                result.data = true;
                fwSqlTransaction.BeginTransaction();
                StringBuilder sbSql = new StringBuilder();
                FWSqlCommand sqlCmd = new FWSqlCommand();

                #region 参数 空/重复判断
                if (mEntity == null)
                {
                    throw new Exception("参数为空！");
                }
                if (mEntity.equipmentList == null || mEntity.equipmentList.Count != 1)
                {
                    throw new Exception("设备信息为空或异常！");
                }
                if (mEntity.monitorBasFactorList == null || mEntity.monitorBasFactorList.Count <= 0)
                {
                    throw new Exception("监测因子不能为空！");
                }

                #endregion

                var equipmentEntity = basicInfoBll.convertEntity<BLLEquipment>(mEntity.equipmentList[0]);

                #region  重复性判断
                //设备编码
                result = EquipmentBll.MBLLEquipmentNoCheck(equipmentEntity);
                if (result.status != FWResultStatus.Success)
                {
                    //throw new Exception(result.infoList.Aggregate((pre, next) => pre + ";" + next));
                    throw new Exception("该设备编码（ltu）已存在!");//输出信息一致
                }
                //现场设备编码

                //songshasha modified by songshasha 2017-06-06 暂时取消现场设备编码重复性校验（18-1-23提交代码时，恢复校验）
                result = MBLLMonitorSiteBll.MBLLMonitorSiteNoCheck(mEntity);
                if (result.status != FWResultStatus.Success)
                {
                    throw new Exception(result.infoList.Aggregate((pre, next) => pre + ";" + next));
                }


                //else
                //{
                //    throw new Exception(mEntity.cantonCode + mEntity.monitorSiteName + mEntity.monitorSiteCode);
                //}
                #endregion

                #region 现场设备 实体
                defaultBLLMonitorSiteEntity(userInfo, mEntity);
                if (!string.IsNullOrEmpty(mEntity.action) && mEntity.action.Equals("add"))
                {
                    mEntity.creater = userInfo.userID;
                    mEntity.createTime = DateTime.Now;
                }
                BLLMonitorSite siteEntity = basicInfoBll.convertEntity<BLLMonitorSite>(mEntity);
                result = insertUpdateBLLMonitorSite(userInfo, siteEntity, fwSqlTransaction);
                if (result.status != FWResultStatus.Success)
                {
                    throw new Exception("现场设备新增/更新失败！");
                }
                #endregion

                #region 报警项目
                if (mEntity.monitorSiteAlarmList != null && mEntity.monitorSiteAlarmList.Count > 0)
                {
                    BaseCommandList.AddRange(siteAlarmOPList(userInfo, mEntity, true));
                }
                #endregion

                // TODO 添加因子是否重复  是否与现有值重复判断
                #region 判断因子 是否重复
                //因子比较 新增 删除  更新 
                List<MBas_MonitorSiteMonitorFactor> addList = new List<MBas_MonitorSiteMonitorFactor>();
                List<MBas_MonitorSiteMonitorFactor> delList = new List<MBas_MonitorSiteMonitorFactor>();
                List<MBas_MonitorSiteMonitorFactor> editList = new List<MBas_MonitorSiteMonitorFactor>();

                //判断因子 是否重复
                //因子比较 新增 删除  更新 
                var siteFactorMapping = MBLLMonitorSiteMonitorFactorBll.queryBasMonitorSiteFactor(mEntity.monitorSiteCode);
                if (siteFactorMapping != null && siteFactorMapping.Count > 0)
                {
                    foreach (var sefm_old in siteFactorMapping)
                    {
                        int ishit = mEntity.monitorBasFactorList.Where(p => p.monitorFactorCode.Equals(sefm_old.monitorFactorCode)).Count();
                        if (ishit == 0)
                        {
                            delList.Add(sefm_old);
                        }
                        else
                        {
                            MBas_MonitorSiteMonitorFactor factor = mEntity.monitorBasFactorList.Where(p => p.monitorFactorCode.Equals(sefm_old.monitorFactorCode)).First();
                            editList.Add(factor);
                        }
                    }
                    ////没有编辑 那只有全部新增
                    //if (editList != null && editList.Count > 0)
                    //{
                    //    foreach (var editInfo in editList)
                    //    {
                    //        int ishit = mEntity.monitorBasFactorList.Where(p => p.monitorFactorCode.Equals(editInfo.monitorFactorCode)).Count();
                    //        if (ishit == 0)
                    //            addList.Add(editInfo);
                    //    }
                    //}
                    //else
                    //{
                    //    //全部新增
                    //    addList = mEntity.monitorBasFactorList;
                    //}

                }
                else
                {
                    //全部新增
                    // addList = mEntity.monitorBasFactorList;
                }

                foreach (var monitorBasFactor in mEntity.monitorBasFactorList)
                {
                    int ishit = siteFactorMapping.Where(p => p.monitorFactorCode.Equals(monitorBasFactor.monitorFactorCode)).Count();
                    if (ishit == 0)
                    {
                        addList.Add(monitorBasFactor);
                    }
                }

                #endregion
                #region 单个设备逻辑
                //设备新增操作  因子全部关系
                //设备更新操作  新增/删除/更新 
                var equipmentList = EquipmentBll.queryEquipmentByMonitorSite(userInfo, mEntity.monitorSiteCode).data;
                if (equipmentList != null && equipmentList.Count > 0)
                {
                    int isHas = equipmentList.Where(p => p.equipmentCode.Equals(equipmentEntity.equipmentCode)).Count();
                    if (isHas > 0)
                    {
                        //新增操作
                    }
                    else
                    {
                        //更新操作
                    }
                }
                else
                {
                    //新增操作

                }
                #region 设备新增/更新
                //获取原有设备信息 
                //设备相同只更新操作
                //不同则清空所有 数据 
                equipmentEntity.monitorSiteCode = mEntity.monitorSiteCode;
                result = EquipmentBll.inserOrUpdateBLLEquipment(userInfo, equipmentEntity, fwSqlTransaction);
                if (result.status != FWResultStatus.Success || result.data != true)
                {
                    throw new Exception("设备添加失败！");
                }
                #endregion
                #endregion
                #region 因子新增 删除 更新

                //移除数据
                if (delList != null && delList.Count > 0)
                {
                    List<string> factorCodeList = delList.Select(p => p.monitorFactorCode).ToList();
                    IFWCommand sqlCmd_del = MBLLMonitorSiteMonitorFactorDal.clearSiteFactorRelation(mEntity.monitorSiteCode, factorCodeList);
                    BaseCommandList.Add(sqlCmd_del);
                }

                if (editList != null && editList.Count > 0)
                {
                    var siteEqFactorConfig = MBLLMonitorSiteMonitorFactorBll.queryMonitorSiteFactorALL(mEntity.monitorSiteCode);
                    foreach (var siteFactor in editList)
                    {
                        var oldList = siteEqFactorConfig.Where(p => p.equipmentCode.Equals(equipmentEntity.equipmentCode) && p.monitorFactorCode.Equals(siteFactor.monitorFactorCode)).Select(p => p);
                        if (oldList != null && oldList.Count() > 0)
                        {
                            //更新操作
                            var siteEqFactorED = oldList.First();
                            BLLMonitorSiteMonitorFactor upentity = setSiteMonitorFactor(userInfo, siteEqFactorED.dataID, mEntity.monitorSiteCode, equipmentEntity.equipmentCode, siteFactor);
                            BaseCommandList.Add(MBLLMonitorSiteMonitorFactorDal.updateMonitorSiteFactor(upentity));
                            continue;
                        }
                    }

                }
                if (addList != null && addList.Count > 0)
                {
                    //数据新增/更新
                    foreach (var MBasFactorEntity in addList)
                    {

                        T_Bas_MonitorSiteMonitorFactor BasFactorEntity = basicInfoBll.convertEntity<T_Bas_MonitorSiteMonitorFactor>(MBasFactorEntity);
                        BasFactorEntity.updateTime = DateTime.Now;
                        result = MBLLMonitorSiteMonitorFactorBll.insertUpdateBasMonitorSiteMonitorFactor(BasFactorEntity, fwSqlTransaction);
                        if (result.status != FWResultStatus.Success)
                        {
                            throw new Exception("现场设备 因子关系添加失败！");
                        }
                        //新增数据
                        BLLMonitorSiteMonitorFactor entity = setSiteMonitorFactor(userInfo, Guid.NewGuid().ToString(), mEntity.monitorSiteCode, equipmentEntity.equipmentCode, MBasFactorEntity);
                        BaseCommandList.Add(MBLLMonitorSiteMonitorFactorDal.insertMonitorSiteFactor(entity));

                        //T_DAT_RealTime 增加对应关系
                        T_DAT_RealTime REntity = new T_DAT_RealTime();
                        REntity.PK_MCode = entity.dataID;
                        REntity.fdtmReal = new DateTime(1990, 1, 1);
                        REntity.fintStatis = 0;
                        REntity.fbitOver = false;
                        BaseCommandList.Add(MBLLMonitorSiteDal.inserDATRealTime(REntity));
                    }

                }

                #endregion
                if (BaseCommandList != null && BaseCommandList.Count > 0)
                {
                    result.data = FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, BaseCommandList);
                }
                result.status = FWResultStatus.Success;
                fwSqlTransaction.Commit();
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Error;
                fwSqlTransaction.Rollback();
                fwSqlTransaction.Close();
            }
            return result;
        }

        /// <summary>
        /// 现场设备/设备 删除
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="monitorSiteCode"></param>
        /// <returns></returns>
        public static FWResult<bool> quickDelMonitorSiteAndEquipment(IFWUserInfo userInfo, string monitorSiteCode)
        {

            FWResult<bool> result = new FWResult<bool>();
            if (string.IsNullOrEmpty(monitorSiteCode))
            {
                result.data = false;
                result.status = FWResultStatus.Failure;
                result.infoList.Add("现场设备主键不能为空！");
                return result;
            }
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            fwSqlCommand.CommandText = string.Format(@" 
UPDATE  [dbo].[BLLEquipment] SET [isScrap]=0,[isDel]=1,[monitorSiteCode]=NULL  WHERE  [monitorSiteCode]='{0}';
UPDATE  [dbo].[BLLMonitorSite] SET  [isDel]=1  WHERE  [monitorSiteCode]='{0}'; 
DELETE  FROM [dbo].[BLLMonitorSiteAlarmItem] WHERE  [monitorSiteCode]='{0}'; 
DELETE  FROM [dbo].[BLLMonitorSiteRealtimeFactorData]  WHERE  [monitorSiteCode]='{0}'; 
DELETE  FROM [dbo].[BLLMonitorSiteMonitorFactor] WHERE  [monitorSiteCode]='{0}'; 
DELETE  FROM [dbo].[T_Bas_MonitorSiteMonitorFactor] WHERE  [monitorSiteCode]='{0}';  ",
                FWSqlCommandStaticHelper.checkParam(monitorSiteCode));
            try
            {
                result.data = FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlCommand) > 0;
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

        #region 现场设备-点位纠偏
        public static FWResult<bool> quickSetPosition(SysBasicManageUserInfo userInfo, MBLLMonitorSite mEntity)
        {
            FWResult<bool> result = new FWResult<bool>();
            try
            {

                if (mEntity == null)
                {
                    throw new Exception("参数为空！");
                }
                if (string.IsNullOrEmpty(mEntity.monitorSiteCode))
                {
                    throw new Exception("现场设备主键不能为空！");
                }

                mEntity.updater = userInfo.userName;
                mEntity.updateTime = DateTime.Now;
                BLLMonitorSite siteEntity = basicInfoBll.convertEntity<BLLMonitorSite>(mEntity);
                result = insertUpdateBLLMonitorSite(userInfo, siteEntity, null);
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Error;
            }
            return result;
        }
        #endregion
        #endregion

        #region 现场设备设备关联操作
        public static FWResult<bool> AddEquipmentMonitorSiteRelation(SysBasicManageUserInfo userInfo, string equipmentCode, string monitorSiteCode)
        {
            FWResult<bool> result = new FWResult<bool>();
            List<IFWCommand> BaseCommandList = new List<IFWCommand>();
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            try
            {
                fwSqlTransaction.BeginTransaction();
                if (string.IsNullOrEmpty(equipmentCode) || string.IsNullOrEmpty(monitorSiteCode))
                {
                    throw new Exception("参数equipmentCode或monitorSiteCode不能为空！");
                }
                //获取点位因子 以及关联因子信息
                var siteEqFactorMapping = MBLLMonitorSiteMonitorFactorBll.queryMonitorSiteFactorALL(monitorSiteCode);
                var siteFactorMapping = MBLLMonitorSiteMonitorFactorBll.queryBasMonitorSiteFactor(monitorSiteCode);
                //不在限制因子监测数据 有系统动态判断
                //if (siteFactorMapping == null || siteFactorMapping.Count <= 0)
                //{
                //    result.infoList.Add(" 请先配置点位监测因子信息!");
                //    result.status = FWResultStatus.Failure;
                //    result.data = false;
                //    fwSqlTransaction.Rollback();
                //    return result;
                //}


                #region 设备与监测因子映射关系
                //List<BLLMonitorSiteMonitorFactor> toadd_siteEqFactor = new List<BLLMonitorSiteMonitorFactor>(); 
                //构建实体
                foreach (var siteFactor in siteFactorMapping)
                {
                    //判断数据是否已经存在 
                    if (siteEqFactorMapping != null && siteEqFactorMapping.Count > 0)
                    {
                        var oldList = siteEqFactorMapping.Where(p => p.equipmentCode.Equals(equipmentCode) && p.monitorFactorCode.Equals(siteFactor.monitorFactorCode)).Select(p => p);
                        if (oldList != null && oldList.Count() > 0)
                        {
                            //更新操作
                            var siteEqFactorED = oldList.First();
                            BLLMonitorSiteMonitorFactor upentity = new BLLMonitorSiteMonitorFactor();
                            upentity.dataID = siteEqFactorED.dataID;
                            upentity.monitorSiteCode = monitorSiteCode;
                            upentity.equipmentCode = equipmentCode;
                            upentity.monitorFactorCode = siteFactor.monitorFactorCode;
                            upentity.standardUpperLimit = siteFactor.standardUpperLimit;
                            upentity.standardLowerLimit = siteFactor.standardLowerLimit;
                            upentity.ix = siteFactor.ix ?? 0;
                            upentity.isDis = 0;
                            upentity.channelNo = siteFactor.channelNo;
                            upentity.isSwitch = siteFactor.isSwitch;
                            upentity.createrID = userInfo.userID;
                            upentity.createTime = DateTime.Now;
                            upentity.updaterID = userInfo.userID;
                            upentity.updateTime = DateTime.Now;
                            upentity.alarmUpperLimit = siteFactor.alarmUpperLimit;
                            upentity.alarmLowerLimit = siteFactor.alarmLowerLimit;
                            BaseCommandList.Add(MBLLMonitorSiteMonitorFactorDal.updateMonitorSiteFactor(upentity));
                            continue;
                        }
                    }

                    #region 新增关联
                    BLLMonitorSiteMonitorFactor entity = new BLLMonitorSiteMonitorFactor();
                    entity.dataID = Guid.NewGuid().ToString();
                    entity.monitorSiteCode = monitorSiteCode;
                    entity.equipmentCode = equipmentCode;
                    entity.monitorFactorCode = siteFactor.monitorFactorCode;
                    entity.standardUpperLimit = siteFactor.standardUpperLimit;
                    entity.standardLowerLimit = siteFactor.standardLowerLimit;
                    entity.ix = siteFactor.ix ?? 0;
                    entity.isDis = 0;
                    entity.channelNo = siteFactor.channelNo;
                    entity.isSwitch = siteFactor.isSwitch;
                    entity.createrID = userInfo.userID;
                    entity.createTime = DateTime.Now;
                    entity.updaterID = userInfo.userID;
                    entity.updateTime = DateTime.Now;
                    entity.alarmUpperLimit = siteFactor.alarmUpperLimit;
                    entity.alarmLowerLimit = siteFactor.alarmLowerLimit;
                    BaseCommandList.Add(MBLLMonitorSiteMonitorFactorDal.insertMonitorSiteFactor(entity));
                    #endregion


                }
                #endregion

                result.data = true;
                FWSqlCommand sqlCmdMonitorEquimentAPP = new FWSqlCommand();
                sqlCmdMonitorEquimentAPP.CommandText = string.Format("update dbo.BLLEquipment SET monitorSiteCode = '{0}',[updateTime]=GETDATE()  WHERE equipmentCode ='{1}' ", FWSqlCommandStaticHelper.checkParam(monitorSiteCode), FWSqlCommandStaticHelper.checkParam(equipmentCode));
                int upCount = FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, sqlCmdMonitorEquimentAPP);

                //手机端单个添加
                if (upCount != 1)
                {
                    throw new Exception("关联失败,设备表更新失败！");
                }
                if (BaseCommandList != null && BaseCommandList.Count > 0)
                {
                    result.data = FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, BaseCommandList);
                }
                result.status = FWResultStatus.Success;
                fwSqlTransaction.Commit();

            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Error;
                fwSqlTransaction.Rollback();
                fwSqlTransaction.Close();

            }
            return result;
        }

        public static FWResult<bool> RemoveEquipmentMonitorSiteRelation(SysBasicManageUserInfo userInfo, string equipmentCode, string monitorSiteCode)
        {
            FWResult<bool> result = new FWResult<bool>();
            try
            {
                if (string.IsNullOrEmpty(equipmentCode) || string.IsNullOrEmpty(monitorSiteCode))
                {
                    throw new Exception("参数equipmentCode或monitorSiteCode不能为空！");
                }
                FWSqlCommand sqlCmdMonitorEquimentAPP = new FWSqlCommand();
                sqlCmdMonitorEquimentAPP.CommandText = string.Format(@"
 update dbo.BLLEquipment SET monitorSiteCode =null,[updateTime]=GETDATE()  WHERE equipmentCode ='{1}'; 
delete [dbo].[BLLMonitorSiteMonitorFactor]   WHERE monitorSiteCode = '{0}'  AND  equipmentCode ='{1}';
delete  [dbo].[BLLMonitorSiteRealtimeFactorData] WHERE monitorSiteCode = '{0}'  AND  equipmentCode ='{1}';
", FWSqlCommandStaticHelper.checkParam(monitorSiteCode), FWSqlCommandStaticHelper.checkParam(equipmentCode));
                int upCount = FWSqlCommandStaticHelper.ExecuteNonQuery(sqlCmdMonitorEquimentAPP);

                //手机端单个添加
                if (upCount <= 0)
                {
                    throw new Exception("操作失败, 数据更新异常！");
                }
                result.data = true;
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


        #region 根据运维人员查询设施列表

        public static FWResult<FWPageData<MBLLMonitorSite>> queryPagePersonMappingMonitorSiteByPersonOrUnitCode(
            IFWUserInfo userInfo, FWPageParams pageParams, QueryBasicInfoParams queryParams)
        {
            FWResult<FWPageData<MBLLMonitorSite>> result = new FWResult<FWPageData<MBLLMonitorSite>>();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            StringBuilder sbSql = new StringBuilder();
            sbSql.Append(@"  					
SELECT 
t1.[monitorSiteCode]
,t1.[monitorSiteName] 
,t1.[cantonCode]
,t1.[operateTime]
,t1.[address] 
,t1.[householdsCount]
,t1.[longitude]
,t1.[latitude]
,t1.[rem]
,t1.[isDis] 
,t1.equipmentNo   
,eq.[equipmentCode] 
,eq.[equipmentName]
,eq.[cantonCode]
,eq.[equipmentType]
,eq.[treatmentAbility]   
FROM  [dbo].[BLLMonitorSite] t1
INNER JOIN   dbo.BLLOperationMaintenanceContractMappingMonitorSite  t2  ON t1.[monitorSiteCode]=t2.[monitorSiteCode]  
INNER JOIN   dbo.BLLOperationMaintenanceContract t3  ON t2.operationMaintenanceContractCode = t3.operationMaintenanceContractCode AND t3.[isDis]=0
INNER JOIN   dbo.BLLOperationMaintenanceUnit t4 ON t3.operationMaintenanceUnitCode=t4.operationMaintenanceUnitCode AND t4.[isDis]=0
INNER JOIN   dbo.BLLOperationMaintenancePerson  t5 ON t5.operationMaintenanceUnitCode=t4.operationMaintenanceUnitCode  AND t5.[isDis]=0
INNER JOIN dbo.BLLEquipment eq ON  t1.equipmentNo =eq.equipmentNo and   eq.moduleTypeCode= '1'
WHERE  isnull(t1.[isDel],0)=0   ");
            if (queryParams != null)
            {

                if (!string.IsNullOrEmpty(queryParams.operationMaintenancePersonCode))
                {
                    sbSql.AppendFormat(@" and t5.operationMaintenancePersonCode ='{0}'",
                        FWSqlCommandStaticHelper.checkParam(queryParams.operationMaintenancePersonCode));
                }
                if (!string.IsNullOrEmpty(queryParams.operationMaintenanceUnitCode))
                {
                    sbSql.AppendFormat(@" and t5.operationMaintenanceUnitCode ='{0}'",
                        FWSqlCommandStaticHelper.checkParam(queryParams.operationMaintenanceUnitCode));
                }
                // 运维点位分配   null:全部  1：未分配的点位 2：已分配的点位 
                if (queryParams.personSelectType.HasValue)
                {
                    sbSql.AppendFormat(@" AND  {0} exists (
		                    SELECT  [dataID]
		                      ,[operationMaintenancePersonCode]
		                      ,[monitorSiteCode] 
	                      FROM  [dbo].[BLLOperationMaintenancePersonMappingMonitorSite] tc WHERE tc.[monitorSiteCode]=t1.[monitorSiteCode]
                      )", queryParams.personSelectType == 1 ? "not" : "");
                }
            }

            //Roger 2016/6/1 13:00:02 增加管辖区域
            sbSql.AppendFormat(@" AND ({0})  ", SysBasicManageBll.CartonToStr("t1.cantonCode", basicUserInfo.cantonCodeList));

            sbSql.Append(@" order by ");
            if (pageParams.sortFieldList != null && pageParams.sortFieldList.Count > 0)
            {
                foreach (FWSortField fwSortField in pageParams.sortFieldList)
                {
                    switch (fwSortField.fieldName)
                    {
                        case "cantonCode":
                            fwSortField.fieldName = "t1.[cantonCode]";
                            break;
                    }
                    sbSql.AppendFormat(@"{0} {1},", fwSortField.fieldName,
                        fwSortField.sortType == FWSortType.Desc ? "desc" : "asc");
                }
                sbSql.Remove(sbSql.Length - 1, 1);
            }
            else
            {
                sbSql.Append(@"t1.[updateTime]  desc  ");
            }
            fwPageProcedureParams.sql = sbSql.ToString();
            result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MBLLMonitorSite>(fwPageProcedureParams);
            result.status = FWResultStatus.Success;
            return result;
        }

        #endregion

        #region 厂区查询
        internal static FWResult<List<MLazyTreeData>> queryCantonListForLazyTree(IFWUserInfo userInfo, string unitCode, string personCode)
        {
            FWResult<List<MLazyTreeData>> result = new FWResult<List<MLazyTreeData>>();

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
SELECT  t1.[monitorSiteCode]
,t1.[monitorSiteName] ,t1.address
,t1.[cantonCode]  
,cun.name  CantonName,cun.fullName  fullCantonName
,zhen.code  parentCantonCode
,zhen.name  parentCantonName
FROM  [dbo].[BLLMonitorSite] t1
   INNER JOIN dbo.FWDictionary cun ON t1.cantonCode=cun.code AND cun.dictionaryTypeCode='BLLCanton' 
   INNER JOIN dbo.FWDictionary zhen ON zhen.code=cun.[pCode] AND zhen.dictionaryTypeCode='BLLCanton'
   WHERE  isnull(t1.isDel,0)=0");

            //Roger 2016/6/1 13:00:02 增加管辖区域
            sbSql.AppendFormat(@" AND ({0})  ", SysBasicManageBll.CartonToStr("t1.cantonCode", basicUserInfo.cantonCodeList));

            sqlCmd.CommandText = sbSql.ToString();
            var list = FWSqlEntityToFWCommandStaticHelper.queryList<MBLLMonitorSite>(sqlCmd);


            if (list != null && list.Count > 0)
            {
                //320581
                var villageList = from l in list
                                  group l by new { l.cantonName, l.cantonCode, l.parentCantonCode }
                                      into g
                                      select new MLazyTreeData()
                                      {
                                          name = g.Key.cantonName,
                                          code = g.Key.cantonCode,
                                          pCode = g.Key.parentCantonCode,
                                          isLeaf = false,
                                          expanded = false,
                                          asyncLoad = false,
                                          dataLvl = 2

                                      };
                var townList = from l in list
                               group l by new { l.parentCantonCode, l.parentCantonName }
                                   into g
                                   select new MLazyTreeData()
                                   {
                                       name = g.Key.parentCantonName,
                                       code = g.Key.parentCantonCode,
                                       pCode = "321282",
                                       isLeaf = false,
                                       expanded = false,
                                       asyncLoad = false,
                                       dataLvl = 1

                                   };
                result.data = (from v in villageList select v).Union(from t in townList select t).ToList();
                result.status = FWResultStatus.Success;
            }

            //返回镇级 村级列表
            return result;
        }

        internal static FWResult<List<MBLLMonitorSite>> queryMonitorSiteListForLazyTree(IFWUserInfo userInfo, string unitCode, string personCode)
        {
            FWResult<List<MBLLMonitorSite>> result = new FWResult<List<MBLLMonitorSite>>();

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
            sbSql.AppendFormat(@"  SELECT  t1.[monitorSiteCode]
      ,t1.[monitorSiteName] ,t1.address
      ,t1.[cantonCode]  
      ,cun.name  CantonName,cun.fullName  fullCantonName
      ,zhen.code  parentCantonCode
      ,zhen.name  parentCantonName
,PersonMappingMonitorSite.operationMaintenancePersonCode,person.operationMaintenancePersonName
  FROM  [dbo].[BLLMonitorSite] t1
   INNER JOIN dbo.FWDictionary cun ON t1.cantonCode=cun.code AND cun.dictionaryTypeCode='BLLCanton' 
   INNER JOIN dbo.FWDictionary zhen ON zhen.code=cun.[pCode] AND zhen.dictionaryTypeCode='BLLCanton'
  LEFT JOIN dbo.BLLOperationMaintenancePersonMappingMonitorSite PersonMappingMonitorSite WITH(NOLOCK) ON t1.monitorSiteCode=PersonMappingMonitorSite.monitorSiteCode
  LEFT JOIN dbo.BLLOperationMaintenancePerson person WITH(NOLOCK) ON PersonMappingMonitorSite.operationMaintenancePersonCode=person.operationMaintenancePersonCode
   WHERE isnull(t1.isDel,0)=0");

            //Roger 2016/6/1 13:00:02 增加管辖区域
            sbSql.AppendFormat(@" AND ({0})  ", SysBasicManageBll.CartonToStr("t1.cantonCode", basicUserInfo.cantonCodeList));

            sqlCmd.CommandText = sbSql.ToString();
            var list = FWSqlEntityToFWCommandStaticHelper.queryList<MBLLMonitorSite>(sqlCmd);


            result.data = list;
            result.status = FWResultStatus.Success;
            return result;
        }

        //Roger 2016/6/1 13:00:02 增加管辖区域 没有User 
        public static FWResult<List<MLazyTreeData>> queryCantonListLazyTree()
        {
            FWResult<List<MLazyTreeData>> result = new FWResult<List<MLazyTreeData>>();
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@" SELECT  t1.[monitorSiteCode]
      ,t1.[monitorSiteName] 
      ,t1.[cantonCode]  
      ,cun.name  CantonName
      ,zhen.code  parentCantonCode
      ,zhen.name  parentCantonName
  FROM  [dbo].[BLLMonitorSite] t1
   INNER JOIN dbo.FWDictionary cun ON t1.cantonCode=cun.code AND cun.dictionaryTypeCode='BLLCanton' 
   INNER JOIN dbo.FWDictionary zhen ON zhen.code=cun.[pCode] AND zhen.dictionaryTypeCode='BLLCanton'
   WHERE isnull(t1.isDel,0)=0");
            sqlCmd.CommandText = sbSql.ToString();
            var list = FWSqlEntityToFWCommandStaticHelper.queryList<MBLLMonitorSite>(sqlCmd);


            if (list != null && list.Count > 0)
            {
                //320581
                var villageList = from l in list
                                  group l by new { l.cantonName, l.cantonCode, l.parentCantonCode }
                                      into g
                                      select new MLazyTreeData()
                                      {
                                          name = g.Key.cantonName,
                                          code = g.Key.cantonCode,
                                          pCode = g.Key.parentCantonCode,
                                          isLeaf = false,
                                          expanded = false,
                                          asyncLoad = false,
                                          dataLvl = 2

                                      };
                var townList = from l in list
                               group l by new { l.parentCantonCode, l.parentCantonName }
                                   into g
                                   select new MLazyTreeData()
                                   {
                                       name = g.Key.parentCantonName,
                                       code = g.Key.parentCantonCode,
                                       pCode = "321282",
                                       isLeaf = false,
                                       expanded = false,
                                       asyncLoad = false,
                                       dataLvl = 1

                                   };
                result.data = (from v in villageList select v).Union(from t in townList select t).ToList();
                result.status = FWResultStatus.Success;
            }

            //返回镇级 村级列表
            return result;
        }
        #endregion

        #region 运维合同选择设施点位

        public static FWResult<List<MLazyTreeData>> queryCantonListForContractLazyTree(SysBasicManageUserInfo userInfo,
            string unitCode, string personCode, QueryBasicInfoParams queryParams)
        {
            FWResult<List<MLazyTreeData>> result = new FWResult<List<MLazyTreeData>>();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            List<MBLLMonitorSite> list = new List<MBLLMonitorSite>();
            if (queryParams.action == "view")
            {
                list = queryMonitorSiteContractHasList(userInfo, queryParams);
            }
            else
            {
                list = queryMonitorSiteContractList(userInfo, queryParams);
            }

            if (list != null && list.Count > 0)
            {
                //320581
                var villageList = from l in list
                                  group l by new { l.cantonName, l.cantonCode, l.parentCantonCode }
                                      into g
                                      select new MLazyTreeData()
                                      {
                                          name = g.Key.cantonName,
                                          code = g.Key.cantonCode,
                                          pCode = g.Key.parentCantonCode,
                                          isLeaf = false,
                                          expanded = false,
                                          asyncLoad = false,
                                          dataLvl = 2

                                      };
                var townList = from l in list
                               group l by new { l.parentCantonCode, l.parentCantonName }
                                   into g
                                   select new MLazyTreeData()
                                   {
                                       name = g.Key.parentCantonName,
                                       code = g.Key.parentCantonCode,
                                       pCode = "321282",
                                       isLeaf = false,
                                       expanded = false,
                                       asyncLoad = false,
                                       dataLvl = 1

                                   };
                result.data = (from v in villageList select v).Union(from t in townList select t).ToList();
            }
            result.status = FWResultStatus.Success;
            //返回镇级 村级列表
            return result;
        }

        public static FWResult<List<MBLLMonitorSite>> queryMonitorSiteContractForLazyTree(
            SysBasicManageUserInfo userInfo, QueryBasicInfoParams queryParams)
        {
            FWResult<List<MBLLMonitorSite>> result = new FWResult<List<MBLLMonitorSite>>();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            try
            {
                if (queryParams.action == "view")
                {
                    result.data = queryMonitorSiteContractHasList(userInfo, queryParams);
                }
                else
                {
                    result.data = queryMonitorSiteContractList(userInfo, queryParams);
                }
                result.status = FWResultStatus.Success;

            }
            catch
            {
                result.infoList.Add("查询出错,错误在【queryMonitorSiteContractForLazyTree】");
            }
            return result;
        }

        public static List<MBLLMonitorSite> queryMonitorSiteContractList(SysBasicManageUserInfo userInfo,
            QueryBasicInfoParams queryParams)
        {
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            string html = "";
            string cantonStr = "";
            html = @"  SELECT DISTINCT * FROM(  SELECT MonitorSite.monitorSiteCode,MonitorSite.monitorSiteName
,MonitorSite.cantonCode,canton1.name cantonName,MonitorSite.address
,canton1.pCode parentCantonCode,canton2.name parentCantonName
 FROM dbo.BLLMonitorSite  MonitorSite WITH(NOLOCK)
 INNER JOIN dbo.FWDictionary canton1 ON MonitorSite.cantonCode=canton1.code AND canton1.dictionaryTypeCode='BLLCanton' 
INNER JOIN dbo.FWDictionary canton2 ON canton2.code=canton1.[pCode] AND canton2.dictionaryTypeCode='BLLCanton'
 WHERE isnull(MonitorSite.isDel,0)=0 and    MonitorSite.monitorSiteCode NOT IN
 (
SELECT ContractMappingMonitorSite.monitorSiteCode FROM  dbo.BLLOperationMaintenanceContractMappingMonitorSite ContractMappingMonitorSite WITH(NOLOCK) 
INNER JOIN dbo.BLLOperationMaintenanceContract  MaintenanceContract WITH(NOLOCK) ON MaintenanceContract.operationMaintenanceContractCode = ContractMappingMonitorSite.operationMaintenanceContractCode
WHERE  DATEDIFF(DAY,MaintenanceContract.failTime,GETDATE())<0
)
";
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.action) && queryParams.action == "edit")
                {
                    html += @"UNION ALL
SELECT ContractMappingMonitorSite.monitorSiteCode,monitorSite.monitorSiteName
,monitorSite.cantonCode,canton1.name cantonName,monitorSite.address
,canton1.pCode parentCantonCode,canton2.name parentCantonName
FROM  dbo.BLLOperationMaintenanceContractMappingMonitorSite ContractMappingMonitorSite WITH(NOLOCK)  
INNER JOIN dbo.BLLMonitorSite monitorSite WITH(NOLOCK) ON monitorSite.monitorSiteCode = ContractMappingMonitorSite.monitorSiteCode
INNER JOIN  dbo.FWDictionary canton1 ON MonitorSite.cantonCode=canton1.code AND canton1.dictionaryTypeCode='BLLCanton' 
INNER JOIN dbo.FWDictionary canton2 ON canton2.code=canton1.[pCode] AND canton2.dictionaryTypeCode='BLLCanton'
WHERE isnull(monitorSite.isDel,0)=0   AND ContractMappingMonitorSite.operationMaintenanceContractCode='" +
                            queryParams.operationMaintenanceContractCode + "'";
                }
                if (!string.IsNullOrEmpty(queryParams.cantonCode))
                {
                    cantonStr = " AND cantonCode in ( select cantoncode from [fn_getSubCanton_Dic]('" +
                                queryParams.cantonCode + "') ) ";
                }
            }
            html += @") a";
            html += @"
            WHERE 1=1 " + cantonStr;

            //Roger 2016/6/1 13:00:02 增加管辖区域
            SysBasicManageUserInfo basicUserInfo = userInfo;
            html += @" AND  (" + SysBasicManageBll.CartonToStr("cantonCode", basicUserInfo.cantonCodeList) + ")  ";


            sbSql.AppendFormat(html);
            sqlCmd.CommandText = sbSql.ToString();
            return FWSqlEntityToFWCommandStaticHelper.queryList<MBLLMonitorSite>(sqlCmd);
        }

        public static List<MBLLMonitorSite> queryMonitorSiteContractHasList(SysBasicManageUserInfo userInfo,
            QueryBasicInfoParams queryParams)
        {
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@"SELECT ContractMappingMonitorSite.monitorSiteCode,monitorSite.monitorSiteName,monitorSite.address
,monitorSite.cantonCode,canton1.name cantonName
,canton1.pCode parentCantonCode,canton2.name parentCantonName
FROM  dbo.BLLOperationMaintenanceContractMappingMonitorSite ContractMappingMonitorSite WITH(NOLOCK)  
INNER JOIN dbo.BLLMonitorSite monitorSite WITH(NOLOCK) ON monitorSite.monitorSiteCode = ContractMappingMonitorSite.monitorSiteCode
INNER JOIN  dbo.FWDictionary canton1 ON MonitorSite.cantonCode=canton1.code AND canton1.dictionaryTypeCode='BLLCanton' 
INNER JOIN dbo.FWDictionary canton2 ON canton2.code=canton1.[pCode] AND canton2.dictionaryTypeCode='BLLCanton'
WHERE isnull(monitorSite.isDel,0)=0 AND  ContractMappingMonitorSite.operationMaintenanceContractCode='" +
                               queryParams.operationMaintenanceContractCode + "'");

            //Roger 2016/6/1 13:00:02 增加管辖区域
            SysBasicManageUserInfo basicUserInfo = userInfo;
            sbSql.AppendFormat(@" AND  ({0})  ", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", basicUserInfo.cantonCodeList));

            sqlCmd.CommandText = sbSql.ToString();
            return FWSqlEntityToFWCommandStaticHelper.queryList<MBLLMonitorSite>(sqlCmd);
        }

        #endregion

        #region 运维人员选择设施点位

        public static FWResult<List<MLazyTreeData>> queryCantonListForPersonLazyTree(SysBasicManageUserInfo userInfo,
            QueryBasicInfoParams queryParams)
        {

            FWResult<List<MLazyTreeData>> result = new FWResult<List<MLazyTreeData>>();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            SysBasicManageUserInfo basicUserInfo = userInfo;
            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            List<MBLLMonitorSite> list = new List<MBLLMonitorSite>();

            if (queryParams.action == "view")
            {
                list = queryMonitorSitePersonHasList(userInfo, queryParams);
            }
            else
            {
                list = queryMonitorSitePersonList(userInfo, queryParams);
            }


            if (list != null && list.Count > 0)
            {
                //320581
                var villageList = from l in list
                                  group l by new { l.cantonName, l.cantonCode, l.parentCantonCode }
                                      into g
                                      select new MLazyTreeData()
                                      {
                                          name = g.Key.cantonName,
                                          code = g.Key.cantonCode,
                                          pCode = g.Key.parentCantonCode,
                                          isLeaf = false,
                                          expanded = false,
                                          asyncLoad = false,
                                          dataLvl = 2

                                      };
                var townList = from l in list
                               group l by new { l.parentCantonCode, l.parentCantonName }
                                   into g
                                   select new MLazyTreeData()
                                   {
                                       name = g.Key.parentCantonName,
                                       code = g.Key.parentCantonCode,
                                       pCode = "321282",
                                       isLeaf = false,
                                       expanded = false,
                                       asyncLoad = false,
                                       dataLvl = 1

                                   };
                result.data = (from v in villageList select v).Union(from t in townList select t).ToList();

            }
            result.status = FWResultStatus.Success;

            //返回镇级 村级列表
            return result;
        }

        public static FWResult<List<MBLLMonitorSite>> queryMonitorSitePersonForLazyTree(SysBasicManageUserInfo userInfo,
            QueryBasicInfoParams queryParams)
        {
            FWResult<List<MBLLMonitorSite>> result = new FWResult<List<MBLLMonitorSite>>();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            SysBasicManageUserInfo basicUserInfo = userInfo;
            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            try
            {
                if (queryParams.action == "view")
                {
                    result.data = queryMonitorSitePersonHasList(userInfo, queryParams);
                }
                else
                {
                    result.data = queryMonitorSitePersonList(userInfo, queryParams);
                }
                result.status = FWResultStatus.Success;
            }
            catch
            {
                result.infoList.Add("查询出错,错误在【queryMonitorSitePersonForLazyTree】");
            }
            return result;
        }

        public static List<MBLLMonitorSite> queryMonitorSitePersonList(SysBasicManageUserInfo userInfo,
            QueryBasicInfoParams queryParams)
        {
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            string UnitStr = "";
            string PersonStr = "";
            string cantonStr = "";
            string html = "";
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.operationMaintenanceUnitCode))
                {
                    UnitStr = "  AND MaintenanceContract.operationMaintenanceUnitCode='" +
                              queryParams.operationMaintenanceUnitCode + "'";
                }
                if (!string.IsNullOrEmpty(queryParams.operationMaintenancePersonCode))
                {
                    PersonStr = " AND PersonMappingMonitorSite.operationMaintenancePersonCode='" +
                                queryParams.operationMaintenancePersonCode + "'";
                }
            }
            html = @"  SELECT DISTINCT * FROM(  SELECT ContractMappingMonitorSite.monitorSiteCode,monitorSite.monitorSiteName
,MonitorSite.cantonCode,canton1.name cantonName,MonitorSite.address
,canton1.pCode parentCantonCode,canton2.name parentCantonName
 FROM dbo.BLLOperationMaintenanceContractMappingMonitorSite ContractMappingMonitorSite WITH(NOLOCK)
INNER JOIN dbo.BLLOperationMaintenanceContract MaintenanceContract WITH(NOLOCK)ON MaintenanceContract.operationMaintenanceContractCode = ContractMappingMonitorSite.operationMaintenanceContractCode
LEFT JOIN dbo.BLLMonitorSite monitorSite WITH(NOLOCK) ON monitorSite.monitorSiteCode = ContractMappingMonitorSite.monitorSiteCode
INNER JOIN  dbo.FWDictionary canton1 ON MonitorSite.cantonCode=canton1.code AND canton1.dictionaryTypeCode='BLLCanton' 
INNER JOIN dbo.FWDictionary canton2 ON canton2.code=canton1.[pCode] AND canton2.dictionaryTypeCode='BLLCanton'
WHERE isnull(monitorSite.isDel,0)=0  " + UnitStr;
            html += @"AND DATEDIFF(DAY,MaintenanceContract.failTime,GETDATE())<0
AND monitorSite.monitorSiteCode NOT IN(
SELECT PersonMappingMonitorSite.monitorSiteCode 
FROM dbo.BLLOperationMaintenancePersonMappingMonitorSite PersonMappingMonitorSite WITH(NOLOCK)
INNER JOIN dbo.BLLOperationMaintenancePerson person WITH(NOLOCK) ON person.operationMaintenancePersonCode = PersonMappingMonitorSite.operationMaintenancePersonCode
WHERE 1=1 )";
            //if (queryParams != null && !string.IsNullOrEmpty(queryParams.operationMaintenancePersonCode))
            //{
            //    html += @" AND operationMaintenancePersonCode='{1}'";
            //}
            //html += "";
            if (queryParams != null)
            {

                if (!string.IsNullOrEmpty(queryParams.action) && queryParams.action == "edit")
                {
                    html += @"
UNION ALL
SELECT PersonMappingMonitorSite.monitorSiteCode,monitorSite.monitorSiteName
,monitorSite.cantonCode,canton1.name cantonName,monitorSite.address
,canton1.pCode parentCantonCode,canton2.name parentCantonName
FROM dbo.BLLOperationMaintenancePersonMappingMonitorSite PersonMappingMonitorSite WITH(NOLOCK)
INNER JOIN dbo.BLLMonitorSite monitorSite WITH(NOLOCK) ON monitorSite.monitorSiteCode = PersonMappingMonitorSite.monitorSiteCode
INNER JOIN  dbo.FWDictionary canton1 ON MonitorSite.cantonCode=canton1.code AND canton1.dictionaryTypeCode='BLLCanton' 
INNER JOIN dbo.FWDictionary canton2 ON canton2.code=canton1.[pCode] AND canton2.dictionaryTypeCode='BLLCanton'
INNER JOIN dbo.BLLOperationMaintenancePerson person WITH(NOLOCK) ON person.operationMaintenancePersonCode = PersonMappingMonitorSite.operationMaintenancePersonCode
WHERE isnull(monitorSite.isDel,0)=0
";
                    if (!string.IsNullOrEmpty(queryParams.operationMaintenancePersonCode))
                    {
                        html += @" AND PersonMappingMonitorSite.operationMaintenancePersonCode='" +
                                queryParams.operationMaintenancePersonCode + "'";
                    }
                }
                if (!string.IsNullOrEmpty(queryParams.cantonCode))
                {
                    cantonStr = " AND cantonCode in ( select cantoncode from [fn_getSubCanton_Dic]('" +
                                queryParams.cantonCode + "') ) ";
                }
            }
            html += @") a WHERE 1=1 " + cantonStr;

            //Roger 2016/6/1 13:00:02 增加管辖区域
            SysBasicManageUserInfo basicUserInfo = userInfo;
            html += @" AND  (" + SysBasicManageBll.CartonToStr("cantonCode", basicUserInfo.cantonCodeList) + ")  ";


            sbSql.AppendFormat(html, queryParams.operationMaintenanceUnitCode,
                queryParams.operationMaintenancePersonCode);
            //sbSql.AppendFormat(html, queryParams.operationMaintenanceUnitCode, userInfo.userID);
            sqlCmd.CommandText = sbSql.ToString();
            return FWSqlEntityToFWCommandStaticHelper.queryList<MBLLMonitorSite>(sqlCmd);
        }

        public static List<MBLLMonitorSite> queryMonitorSitePersonHasList(IFWUserInfo userInfo,
            QueryBasicInfoParams queryParams)
        {
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            if (!string.IsNullOrEmpty(basicUserInfo.operationMaintenancePersonCode))
            {
                queryParams.operationMaintenancePersonCode = basicUserInfo.operationMaintenancePersonCode;
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
WHERE isnull(monitorSite.isDel,0)=0 ");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.operationMaintenancePersonCode))
                {
                    sbSql.AppendFormat(@" AND PersonMappingMonitorSite.operationMaintenancePersonCode='{0}'",
                        queryParams.operationMaintenancePersonCode);
                }

            }
            //Roger 2016/6/1 13:00:02 增加管辖区域
            sbSql.AppendFormat(@" AND ({0})  ", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", basicUserInfo.cantonCodeList));


            sqlCmd.CommandText = sbSql.ToString();
            return FWSqlEntityToFWCommandStaticHelper.queryList<MBLLMonitorSite>(sqlCmd);
        }

        #endregion

        #region 点位统计查询_地图统计

        public static FWResult<List<MLazyTreeData>> queryRealTimeMonitorSiteStatis(IFWUserInfo userInfo)
        {
            StringBuilder sbSql = new StringBuilder();
            List<MLazyTreeData> proc_dataList = new List<MLazyTreeData>();
            FWResult<List<MLazyTreeData>> result = new FWResult<List<MLazyTreeData>>();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            if (basicUserInfo == null || basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }


            #region 存储获取状态
            SqlParameter sParaRecordCount = new SqlParameter("@RecordCount", SqlDbType.BigInt);
            sParaRecordCount.Direction = ParameterDirection.Output;
            SqlParameter[] SqlParameterS = {  sParaRecordCount ,
                                             new SqlParameter("@pageSize",90000),
                                             new SqlParameter("@pageIndex",1),
                                             new SqlParameter("@cantonCodeList",string.Empty) ,//Roger 2016/6/1 13:00:02 增加管辖区域 需要斟酌一下是否需要
                                             new SqlParameter("@statusCode",string.Empty) ,
                                             new SqlParameter("@MonitorSiteName",string.Empty) ,   
                                             new SqlParameter("@IGCodeList",string.Empty) 
                                           };

            SqlCommand cmd = new SqlCommand()
            {
                CommandType = CommandType.StoredProcedure,
                CommandText = "rpt_MonitorStatus"
            };
            cmd.Parameters.AddRange(SqlParameterS);
            DataSet ds = FWSqlCommandStaticHelper.ExecuteDataSet(cmd);

            if (ds != null && ds.Tables[2] != null)
            {
                //处置方式统计
                if (ds.Tables[2].Rows.Count > 0)
                {
                    proc_dataList = FWDataTableHelper.toObjectList<MLazyTreeData>(ds.Tables[2]);
                }
            }

            #endregion

            #region 点位信息

            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@" 
SELECT     
t1.[cantonCode] 
,t3.[name]  cantonName  
,t3.[pCode] parentCantonCode 
,t4.[name] parentCantonName 
,t1.monitorSiteCode 
FROM        
dbo.BLLMonitorSite AS t1 
INNER JOIN  dbo.FWDictionary t3 ON  t1.[cantonCode]=t3.code AND T3.[dictionaryTypeCode]='BLLCanton' and t3.code<>'0'
INNER JOIN  dbo.FWDictionary t4 ON  t4.CODE=t3.Pcode AND T4.[dictionaryTypeCode]='BLLCanton'
WHERE  isnull(t1.isDel,0)=0 ");

            //Roger 2016/6/1 13:00:02 增加管辖区域
            sbSql.AppendFormat(@" AND ({0})  ", SysBasicManageBll.CartonToStr("t1.cantonCode", basicUserInfo.cantonCodeList));

            sqlCmd.CommandText = sbSql.ToString();


            var list = FWSqlEntityToFWCommandStaticHelper.queryList<MLazyTreeData>(sqlCmd);
            #endregion

            //合并数据
            if (list != null && list.Count > 0)
            {

                #region 数据整合 没有最新状态的默认为3 故障
                if (proc_dataList != null && proc_dataList.Count > 0)
                {
                    list = (from m in list
                            join p in proc_dataList on m.monitorSiteCode equals p.monitorSiteCode into temp
                            from tt in temp.DefaultIfEmpty()
                            select new MLazyTreeData()
                            {
                                cantonCode = m.cantonCode,
                                cantonName = m.cantonName,
                                parentCantonCode = m.parentCantonCode,
                                parentCantonName = m.parentCantonName,
                                siteStatus = (tt == null || string.IsNullOrEmpty(tt.statusCode)) ? "4" : tt.statusCode
                            }).ToList();
                }
                else
                {
                    list = list.Select(p => new MLazyTreeData()
                    {
                        cantonCode = p.cantonCode,
                        cantonName = p.cantonName,
                        parentCantonCode = p.parentCantonCode,
                        parentCantonName = p.parentCantonName,
                        siteStatus = "4"
                    }).ToList();
                }
                #endregion
                #region 村级别



                //320581
                //村级别
                var villageList = (from l in list
                                   group l by new { l.cantonCode }
                                       into g
                                       select new MLazyTreeData()
                                       {
                                           cantonCode = g.Key.cantonCode,
                                           monitorSiteAmount = g.Count(),
                                           realtimeStatusStatis = new MonitorSiteRealtimeStatis()
                                           {
                                               status_1 = g.Where(p => p.siteStatus.Equals("1")).Count(),
                                               status_2 = g.Where(p => p.siteStatus.Equals("2")).Count(),
                                               status_3 = g.Where(p => p.siteStatus.Equals("3")).Count(),
                                               status_4 = g.Where(p => p.siteStatus.Equals("4")).Count(),
                                               status_5 = g.Where(p => p.siteStatus.Equals("5")).Count(),
                                               status_9 = g.Where(p => p.siteStatus.Equals("9")).Count(),
                                               status_10 = g.Where(p => p.siteStatus.Equals("10")).Count(),
                                               status_13 = g.Where(p => p.siteStatus.Equals("13")).Count()
                                           }

                                       }).ToList();
                #endregion
                #region 镇级别
                //
                var townList = (from l in list
                                group l by new { l.parentCantonCode }
                                    into g
                                    select new MLazyTreeData()
                                    {
                                        cantonCode = g.Key.parentCantonCode,
                                        monitorSiteAmount = g.Count(),
                                        realtimeStatusStatis = new MonitorSiteRealtimeStatis()
                                        {
                                            status_1 = g.Where(p => p.siteStatus.Equals("1")).Count(),
                                            status_2 = g.Where(p => p.siteStatus.Equals("2")).Count(),
                                            status_3 = g.Where(p => p.siteStatus.Equals("3")).Count(),
                                            status_4 = g.Where(p => p.siteStatus.Equals("4")).Count(),
                                            status_5 = g.Where(p => p.siteStatus.Equals("5")).Count(),
                                            status_9 = g.Where(p => p.siteStatus.Equals("9")).Count(),
                                            status_13 = g.Where(p => p.siteStatus.Equals("13")).Count()
                                        }

                                    }).ToList();
                #endregion
                #region 项目所属顶级

                var city = new MLazyTreeData()
                {
                    cantonCode = "321282",
                    monitorSiteAmount = list.Count(),
                    realtimeStatusStatis = new MonitorSiteRealtimeStatis()
                    {
                        status_1 = list.Where(p => p.siteStatus.Equals("1")).Count(),
                        status_2 = list.Where(p => p.siteStatus.Equals("2")).Count(),
                        status_3 = list.Where(p => p.siteStatus.Equals("3")).Count(),
                        status_4 = list.Where(p => p.siteStatus.Equals("4")).Count(),
                        status_5 = list.Where(p => p.siteStatus.Equals("5")).Count(),
                        status_9 = list.Where(p => p.siteStatus.Equals("9")).Count(),
                        status_13 = list.Where(p => p.siteStatus.Equals("13")).Count()
                    }
                };
                var entityList = (from v in villageList select v).Union(from t in townList select t).ToList();
                entityList.Add(city);
                #endregion
                #region 将统计数据 关联到对应的厂区

                FWSqlCommand sqlCmd_cantonList = new FWSqlCommand();

                //Roger 2016/6/1 13:00:02 增加管辖区域
                sqlCmd_cantonList.CommandText = string.Format(@" 
SELECT     
t1.code [cantonCode] 
,t1.[name]  cantonName  
,t1.[pCode] parentCantonCode 
      ,t2.[longitude] posX
      ,t2.[latitude] posY 
,t1.level 
FROM        
dbo.FWDictionary t1   
INNER JOIN [dbo].[FWDictionary_BLLCanton]   T2 on t1.[dataID]=t2.[dataID]
WHERE t1.ISDIS=0 AND t1.[dictionaryTypeCode]='BLLCanton' and t1.code<>'0' 
and ({0})
order by code  ", SysBasicManageBll.CartonToStr("t1.code", basicUserInfo.cantonCodeList)); ;

                var cantonList = FWSqlEntityToFWCommandStaticHelper.queryList<MLazyTreeData>(sqlCmd_cantonList);

                var rList = (from canton in cantonList
                             join entity in entityList on canton.cantonCode equals entity.cantonCode into temp
                             from tt in temp.DefaultIfEmpty()
                             select new MLazyTreeData()
                             {
                                 cantonCode = canton.cantonCode,
                                 parentCantonCode = canton.parentCantonCode,
                                 cantonName = canton.cantonName,
                                 monitorSiteAmount = tt == null ? 0 : tt.monitorSiteAmount,
                                 posX = canton.posX,
                                 posY = canton.posY,
                                 level = canton.level,
                                 realtimeStatusStatis = tt != null
                                     ? tt.realtimeStatusStatis
                                     : new MonitorSiteRealtimeStatis()
                                     {
                                         status_4 = 0,
                                         status_1 = 0,
                                         status_2 = 0,
                                         status_3 = 0
                                     }
                             }).OrderBy(p => p.level).ToList();

                result.data = rList;
                result.status = FWResultStatus.Success;
                #endregion
            }
            //返回镇级 村级列表
            return result;
        }

        public static FWResult<List<Data_Canton>> queryRealMonitorSiteStatis(IFWUserInfo userInfo, string cantonCode)
        {
            FWResult<List<Data_Canton>> result = new FWResult<List<Data_Canton>>();
            List<MLazyTreeData> monitorsites = new List<MLazyTreeData>();
            #region  获取数据厂区数据
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            fwSqlCommand.CommandText = string.Format(@"   
SELECT  
t1.[code]   cantonCode
,t1.[pCode]   pCantonCode
,t1.[name]   cantonName  
,t2.longitude [posX]
,t2.latitude [posY]  
FROM  [dbo].[FWDictionary] t1 
LEFT JOIN FWDictionary_BLLCanton t2 ON t1.[dataID]=t2.[dataID]
WHERE  t1.[dictionaryTypeCode] = '{0}'  AND  ISNULL(T1.[isDis],0)=0 
AND t1.code like '{1}%'  order by code  ", DictionaryTypeCodeSettings.BLLCanton, FWSqlCommandStaticHelper.checkParam(cantonCode));
            #endregion

            #region 存储获取状态
            SqlParameter sParaRecordCount = new SqlParameter("@RecordCount", SqlDbType.BigInt);
            sParaRecordCount.Direction = ParameterDirection.Output;
            SqlParameter[] SqlParameterS = {  sParaRecordCount ,
                                             //new SqlParameter("@pageSize",90000),
                                             new SqlParameter("@pageSize",90000),
                                             new SqlParameter("@pageIndex",1),
                                             new SqlParameter("@cantonCodeList",string.Empty) ,//Roger 2016/6/1 13:00:02 增加管辖区域 需要斟酌一下是否需要
                                             new SqlParameter("@statusCode",string.Empty) ,
                                             new SqlParameter("@MonitorSiteName",string.Empty) ,   
                                             new SqlParameter("@IGCodeList",string.Empty) 
                                           };

            SqlCommand cmd = new SqlCommand()
            {
                CommandType = CommandType.StoredProcedure,
                CommandText = "rpt_MonitorStatus"
            };
            cmd.Parameters.AddRange(SqlParameterS);
            DataSet ds = FWSqlCommandStaticHelper.ExecuteDataSet(cmd);
            if (ds != null && ds.Tables[2] != null)
            {
                //处置方式统计
                if (ds.Tables[2].Rows.Count > 0)
                {
                    monitorsites = FWDataTableHelper.toObjectList<MLazyTreeData>(ds.Tables[2]);
                }
            }
            #endregion

            try
            {
                var cantonList = FWSqlEntityToFWCommandStaticHelper.queryList<Data_Canton>(fwSqlCommand);
                var cantonTreeList = fwList.FWListHelper<Data_Canton>.toTree(cantonList, "pCantonCode", "cantonCode", "childDataList", "BLLCanton");
                //获取种植历史记录
                monitorsiteDataTraversalSummary(cantonTreeList, monitorsites);

                // 将返回到前端的对象中的现场设备数据清空 add by songshasha 2016-11-21
                monitorsiteClean(cantonTreeList);
                result.data = cantonTreeList;
                //遍历获取
                result.status = FWResultStatus.Success;

            }
            catch (Exception ex)
            {

                result.data = null;
                result.status = FWResultStatus.Error;
                result.infoList.Add(ex.Message);
            }
            //获取数据

            return result;
        }

        public static FWResult<List<Data_Canton>> queryRealMonitorSiteStatisByLoginUserNew(IFWUserInfo userInfo, string cantonCode, string projectNo)
        {
            FWResult<List<Data_Canton>> result = new FWResult<List<Data_Canton>>();
            SysBasicManageUserInfo basicUserInfo = SysBasicManageBll.getUserInfo(userInfo);
            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                return result;
            }

            bool isOperationPerson = !string.IsNullOrEmpty(basicUserInfo.operationMaintenancePersonCode);

            List<MLazyTreeData> monitorsites = new List<MLazyTreeData>();

            //返回前台设备状态的属性
            List<SiteStatusData> siteStatusDatas = new List<SiteStatusData>();
            #region  获取数据厂区数据

            FWSqlCommand fwSqlCommand = new FWSqlCommand();

            fwSqlCommand.CommandText = string.Format(@"   
SELECT  
t1.[code]   cantonCode
,t1.[pCode]   pCantonCode
,t1.[name]   cantonName  
,t2.longitude [posX]
,t2.latitude [posY]  
FROM  [dbo].[FWDictionary] t1 
LEFT JOIN FWDictionary_BLLCanton t2 ON t1.[dataID]=t2.[dataID]
WHERE  t1.[dictionaryTypeCode] = '{0}'  AND  ISNULL(T1.[isDis],0)=0 
AND t1.code like '{1}%'  AND LEN(t1.code)<14  order by code  ", DictionaryTypeCodeSettings.BLLCanton, FWSqlCommandStaticHelper.checkParam(cantonCode));
            #endregion

            #region 存储获取状态



            string sqlStats = @"
select * from (
	SELECT  a.code AS statusCode,
        a.name AS statusName ,
        a1.color AS color ,
        ISNULL(monitorSiteCount,0) AS monitorSiteCount
FROM    ( SELECT    *
          FROM      FWDictionary
          WHERE     dictionaryTypeCode = '631'
                    AND isDis = 0
        ) a
        LEFT JOIN (
        SELECT COUNT(DISTINCT vs1.monitorSiteCode) AS monitorSiteCount ,statusCode
        FROM view_monitorStats vs1";
            if (isOperationPerson)
            {
                sqlStats += @" INNER JOIN [dbo].[BLLOperationMaintenancePersonMappingMonitorSite] BMPM
        ON vs1.monitorSiteCode=BMPM.monitorSiteCode AND BMPM.operationMaintenancePersonCode='" + basicUserInfo.operationMaintenancePersonCode+"'";
            }
        sqlStats+=@" where monitorFactorCode = '000008' ";
            if (!string.IsNullOrEmpty(projectNo))
            {
                sqlStats += " AND projectNo='" + projectNo + "' ";
            }
            sqlStats += String.Format(@" AND  ({0})  ", SysBasicManageBll.CartonToStr("cantonCode", basicUserInfo.cantonCodeList));
            sqlStats += @" GROUP BY statusCode)  b 
				ON  a.code = b.statusCode
        LEFT JOIN [FWDictionary_SiteStatus] a1 ON a.dataID = a1.dataID
WHERE   a.dictionaryTypeCode = '631'
        AND a.isDis = 0
    union all
    select '00','全部','#0066cc',count(1) from dbo.view_monitorStats u1";
            if (isOperationPerson)
            {
                sqlStats += @" INNER JOIN [dbo].[BLLOperationMaintenancePersonMappingMonitorSite] BMPM
        ON u1.monitorSiteCode=BMPM.monitorSiteCode AND BMPM.operationMaintenancePersonCode='" + basicUserInfo.operationMaintenancePersonCode + "'";
            }
            sqlStats += @" WHERE monitorFactorCode='000008' ";
            if (!string.IsNullOrEmpty(projectNo))
            {
                sqlStats+= " AND projectNo='"+ projectNo + "'";
            }
            sqlStats += String.Format(@" AND  ({0})  ", SysBasicManageBll.CartonToStr("cantonCode", basicUserInfo.cantonCodeList));
            sqlStats += ")a order by statusCode;";

            sqlStats += @"SELECT 
        a.cantonCode ,
        a.cantonName ,
        a.monitorSiteCode ,
        a.monitorSiteName ,
        a.equipmentCode ,
        a.equipmentNo ,
        a.equipmentName ,
        CAST(MAX(CASE WHEN a.monitorFactorCode = '000008' THEN a.statusCode
                 ELSE NULL
            END) AS VARCHAR(10)) AS statusCode ,
        MAX(CASE WHEN a.monitorFactorCode = '000008' THEN a.monitorDate
                 ELSE NULL
            END) AS [DateTime_000008] ,
        MAX(CASE WHEN a.monitorFactorCode = '000008' THEN a.monitorValue
                 ELSE NULL
            END) AS [Value_000008] ,
        MAX(CASE WHEN a.monitorFactorCode = '000008' THEN a.statusCode
                 ELSE NULL
            END) AS [statusCode_000008] ,
        MAX(CASE WHEN a.monitorFactorCode = '000008' THEN a.statusName
                 ELSE NULL
            END) AS [statusName_000008] ,
        MAX('无量纲') AS [Unit_000008] ,
        MAX(CASE WHEN a.monitorFactorCode = '000008' THEN a.color
                 ELSE NULL
            END) AS [color_000008] ,
        MAX(CASE WHEN a.monitorFactorCode = '000009' THEN a.monitorDate
                 ELSE NULL
            END) AS [DateTime_000009] ,
        MAX(CASE WHEN a.monitorFactorCode = '000009' THEN a.monitorValue
                 ELSE NULL
            END) AS [Value_000009] ,
        MAX(CASE WHEN a.monitorFactorCode = '000009' THEN a.statusCode
                 ELSE NULL
            END) AS [statusCode_000009] ,
        MAX(CASE WHEN a.monitorFactorCode = '000009' THEN a.statusName
                 ELSE NULL
            END) AS [statusName_000009] ,
        MAX('无量纲') AS [Unit_000009] ,
        MAX(CASE WHEN a.monitorFactorCode = '000009' THEN a.color
                 ELSE NULL
            END) AS [color_000009] ,
        MAX(b.longitude) AS longitude ,
        MAX(b.latitude) AS latitude
FROM    (SELECT u1.* FROM dbo.view_monitorStats u1  ";
            if (isOperationPerson)
            {
                sqlStats += @" INNER JOIN [dbo].[BLLOperationMaintenancePersonMappingMonitorSite] BMPM
        ON u1.monitorSiteCode=BMPM.monitorSiteCode AND BMPM.operationMaintenancePersonCode='" + basicUserInfo.operationMaintenancePersonCode + "'";
            }
            sqlStats += String.Format(@" WHERE ({0}) ) ", SysBasicManageBll.CartonToStr("cantonCode", basicUserInfo.cantonCodeList));
            sqlStats += @" a
        LEFT JOIN dbo.BLLMonitorSite b ON a.monitorSiteCode = b.monitorSiteCode";
            if (!string.IsNullOrEmpty(projectNo))
            {
                sqlStats += " WHERE a.projectNo='" + projectNo + "' ";
            }
            sqlStats += @" GROUP BY a.cantonCode ,
            a.cantonName ,
            a.monitorSiteCode ,
            a.monitorSiteName ,
            a.equipmentCode ,
            a.equipmentNo ,
            a.equipmentName 
    ORDER BY a.cantonCode ,
            a.monitorSiteCode;";

            SqlCommand cmd = new SqlCommand();
            cmd.CommandText = sqlStats;

            Stopwatch stopwatch = new Stopwatch();
            stopwatch.Start();
            DataSet ds = FWSqlCommandStaticHelper.ExecuteDataSet(cmd);

            stopwatch.Stop();

            long timeDs = stopwatch.ElapsedMilliseconds;
            stopwatch.Reset();


            if (ds != null && ds.Tables[1] != null)
            {
                //处置方式统计
                if (ds.Tables[1].Rows.Count > 0)
                {
                    monitorsites = FWDataTableHelper.toObjectList<MLazyTreeData>(ds.Tables[1]);
                }
            }

            //获取设备状态的信息（颜色，状态码，名称等）
            if (ds != null && ds.Tables[0] != null)
            {
                if (ds.Tables[0].Rows.Count > 0)
                {
                    siteStatusDatas = FWDataTableHelper.toObjectList<SiteStatusData>(ds.Tables[0])
                        .OrderBy(a => Convert.ToInt32(a.statusCode)).ToList();
                }

            }

            #endregion


            try
            {
                var cantonListB = FWSqlEntityToFWCommandStaticHelper.queryList<Data_Canton>(fwSqlCommand);
                stopwatch.Start();
                var cantonList= monitorsiteDataTraversalSummaryNew(cantonListB, monitorsites);
                var cantonTreeList = fwList.FWListHelper<Data_Canton>.toTree(cantonList, "pCantonCode", "cantonCode", "childDataList", "BLLCanton");
                if (cantonTreeList.Count > 0)
                {
                    var zhenlist = cantonTreeList[0].childDataList;
                    List<Data_Canton> zhenCanton = new List<Data_Canton>();
                    if (!basicUserInfo.cantonCodeList.Contains("321282"))
                    {
                        List<string> zhenStrs = basicUserInfo.cantonCodeList.Where(p => p.Length == 9).ToList();
                        List<string> cunStrs = basicUserInfo.cantonCodeList.Where(p => p.Length == 13).ToList();
                        foreach (var c in zhenStrs)
                        {
                            foreach (var zhenItem in zhenlist)
                            {
                                if (zhenItem.cantonCode == c)
                                {
                                    zhenCanton.Add(zhenItem);
                                }
                            } 
                        }
                        foreach (var zhenItem1 in zhenlist)
                        {
                            List<Data_Canton> cunCanton = new List<Data_Canton>();
                            foreach (var cun in cunStrs)
                            {
                                if (cun.IndexOf(zhenItem1.cantonCode) > -1)
                                {
                                    
                                    foreach (var pm in zhenItem1.childDataList)
                                    {
                                        if (pm.cantonCode == cun)
                                        {
                                            cunCanton.Add(pm);
                                            
                                        }
                                    }
                                    
                                }
                            }
                            if (cunCanton.Count>0)
                            {
                                zhenItem1.childDataList = cunCanton;
                                zhenCanton.Add(zhenItem1);
                            }

                        }
                        cantonTreeList[0].childDataList = zhenCanton;
                    }
                    

                    //foreach (var item in zhenlist)
                    //{
                    //    foreach (var c in basicUserInfo.cantonCodeList)
                    //    {
                    //        if (c == "321282") //此处需要修改为项目的code
                    //        {
                    //            isReplace = false;
                    //        }
                    //        if (c.IndexOf(item.cantonCode)>-1)
                    //        {
                    //            if (item.cantonCode!=c)
                    //            {
                    //                List<Data_Canton> cunCanton = new List<Data_Canton>();
                    //                foreach (var pm in item.childDataList)
                    //                {
                    //                    if (pm.cantonCode==c)
                    //                    {
                    //                        cunCanton.Add(pm);
                    //                    }
                    //                }
                    //                item.childDataList = cunCanton;
                    //            }
                    //            if (!zhenCanton.Contains(item))
                    //            {
                    //                zhenCanton.Add(item);
                    //            }
                    //        }
                    //    }
                    //}
                }
                
                stopwatch.Stop();
                long fss = stopwatch.ElapsedMilliseconds;

                monitorsiteClean(cantonTreeList);

                //将设备状态参数返回前台
                AddSiteStatusData(siteStatusDatas, cantonTreeList);

                result.data = cantonTreeList;

                //遍历获取
                result.status = FWResultStatus.Success;

            }
            catch (Exception ex)
            {

                result.data = null;
                result.status = FWResultStatus.Error;
                result.infoList.Add(ex.Message);
            }
            //获取数据

            return result;
        }

        public static FWResult<List<Data_Canton>> queryRealMonitorSiteStatisByLoginUser(IFWUserInfo userInfo, string cantonCode, string projectNo)
        {
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;

            FWResult<List<Data_Canton>> result = new FWResult<List<Data_Canton>>();
            List<MLazyTreeData> monitorsites = new List<MLazyTreeData>();

            //返回前台设备状态的属性
            List<SiteStatusData> siteStatusDatas = new List<SiteStatusData>();
            #region  获取数据厂区数据

            FWSqlCommand fwSqlCommand = new FWSqlCommand();

            fwSqlCommand.CommandText = string.Format(@"   
SELECT  
t1.[code]   cantonCode
,t1.[pCode]   pCantonCode
,t1.[name]   cantonName  
,t2.longitude [posX]
,t2.latitude [posY]  
FROM  [dbo].[FWDictionary] t1 
LEFT JOIN FWDictionary_BLLCanton t2 ON t1.[dataID]=t2.[dataID]
WHERE  t1.[dictionaryTypeCode] = '{0}'  AND  ISNULL(T1.[isDis],0)=0 
AND t1.code like '{1}%'  AND LEN(t1.code)<14  order by code  ", DictionaryTypeCodeSettings.BLLCanton, FWSqlCommandStaticHelper.checkParam(cantonCode));
            #endregion

            #region 存储获取状态
            SqlParameter sParaRecordCount = new SqlParameter("@RecordCount", SqlDbType.BigInt);
            sParaRecordCount.Direction = ParameterDirection.Output;
            SqlParameter[] SqlParameterS = {  sParaRecordCount ,
                                             new SqlParameter("@pageSize",90000),
                                             new SqlParameter("@pageIndex",1),
                                             new SqlParameter("@cantonCodeList",string.Empty) ,//Roger 2016/6/1 13:00:02 增加管辖区域 需要斟酌一下是否需要
                                             new SqlParameter("@statusCode",string.Empty) ,
                                             new SqlParameter("@MonitorSiteName",string.Empty) ,   
                                             new SqlParameter("@IGCodeList",string.Empty),
                                             new SqlParameter("@projectNo",projectNo) 
                                           };

            SqlCommand cmd = new SqlCommand()
            {
                CommandType = CommandType.StoredProcedure,
                CommandText = "rpt_MonitorStatus"
            };
            cmd.Parameters.AddRange(SqlParameterS);
            Stopwatch stopwatch = new Stopwatch();
            stopwatch.Start();
            DataSet ds = FWSqlCommandStaticHelper.ExecuteDataSet(cmd);
            stopwatch.Stop();
            long f = stopwatch.ElapsedMilliseconds;

            stopwatch.Reset();
            if (ds != null && ds.Tables[2] != null)
            {
                //处置方式统计
                if (ds.Tables[2].Rows.Count > 0)
                {
                    monitorsites = FWDataTableHelper.toObjectList<MLazyTreeData>(ds.Tables[2]);
                }
            }

            //获取设备状态的信息（颜色，状态码，名称等）
            if (ds != null && ds.Tables[0] != null)
            {
                if (ds.Tables[0].Rows.Count > 0)
                {
                    siteStatusDatas = FWDataTableHelper.toObjectList<SiteStatusData>(ds.Tables[0])
                        .OrderBy(a => Convert.ToInt32(a.statusCode)).ToList();
                }

            }

            #endregion


            try
            {
                var cantonList = FWSqlEntityToFWCommandStaticHelper.queryList<Data_Canton>(fwSqlCommand);
                var cantonTreeList = fwList.FWListHelper<Data_Canton>.toTree(cantonList, "pCantonCode", "cantonCode", "childDataList", "BLLCanton");
                if (cantonTreeList.Count > 0)
                {
                    var list = cantonTreeList[0].childDataList;
                    List<Data_Canton> trueCanton = new List<Data_Canton>();
                    bool isReplace = true;
                    foreach (var item in list)
                    {
                        foreach (var c in basicUserInfo.cantonCodeList)
                        {
                            if (c == "321282" || c == "340601" || c == "320200") //此处需要修改为项目的code
                            {
                                isReplace = false;
                            }
                            if (item.cantonCode == c)
                            {
                                trueCanton.Add(item);
                            }
                        }
                    }
                    if (isReplace)
                    {
                        cantonTreeList[0].childDataList = trueCanton;
                    }
                }
                stopwatch.Start();
                //获取种植历史记录
                monitorsiteDataTraversalSummary(cantonTreeList, monitorsites);
                stopwatch.Stop();
                long fss= stopwatch.ElapsedMilliseconds;

                monitorsiteClean(cantonTreeList);

                //将设备状态参数返回前台
                AddSiteStatusData(siteStatusDatas, cantonTreeList);

                result.data = cantonTreeList;

                //遍历获取
                result.status = FWResultStatus.Success;

            }
            catch (Exception ex)
            {

                result.data = null;
                result.status = FWResultStatus.Error;
                result.infoList.Add(ex.Message);
            }
            //获取数据

            return result;
        }

        //返回树都添加SiteStatusData add by lxg 20180401
        public static void AddSiteStatusData(List<SiteStatusData> ssd, List<Data_Canton> cantonTreeList)
        {
            foreach (var list in cantonTreeList)
            {
                list.siteStatusData = ssd;
                if (list.childDataList.Count >= 0)
                {
                    AddSiteStatusData(ssd, list.childDataList);
                }
            }
        }

        //将返回到前端的对象中的现场设备数据清空，前端不需要这些数据，冗余的数据会占用网络流量，造成界面加载慢  add by songshasha 2016-11-21
        private static List<Data_Canton> monitorsiteClean(List<Data_Canton> cantonList)
        {
            foreach (var item in cantonList)
            {
                if (item.childDataList != null && item.childDataList.Count > 0)
                {
                    item.childDataList = monitorsiteClean(item.childDataList);
                    item.monitorsites = null;
                }
                else
                {
                    item.monitorsites = null;

                }

            }
            return cantonList;

        }

        private static List<Data_Canton> monitorsiteDataTraversalSummaryNew(List<Data_Canton> cantonList, List<MLazyTreeData> monitorsites)
        {
            foreach (var item in cantonList)
            {
                var siteStatusList = monitorsites.Where(p => p.cantonCode.StartsWith(item.cantonCode)).ToList();
                siteStatusAmount(item, siteStatusList);

            }
            return cantonList;
        }

        private static List<Data_Canton> monitorsiteDataTraversalSummary(List<Data_Canton> cantonList, List<MLazyTreeData> monitorsites)
        {
            foreach (var item in cantonList)
            {
                if (item.childDataList != null && item.childDataList.Count > 0)
                {
                    item.childDataList = monitorsiteDataTraversalSummary(item.childDataList, monitorsites);
                    List<MLazyTreeData> siteStatusList = item.childDataList.SelectMany(b => b.monitorsites).ToList();
                    //当前节点级别的数据查询
                    List<MLazyTreeData> thisLvlsiteStatusList = monitorsites.Where(p => p.cantonCode.Equals(item.cantonCode)).ToList();
                    siteStatusList = siteStatusList.Concat(thisLvlsiteStatusList).ToList();
                    siteStatusAmount(item, siteStatusList);

                }
                else
                {
                    var siteStatusList = monitorsites.Where(p => p.cantonCode.StartsWith(item.cantonCode)).ToList();
                    siteStatusAmount(item, siteStatusList);
                }

            }
            return cantonList;
        }

        private static void siteStatusAmount(Data_Canton item, List<MLazyTreeData> siteStatusList)
        {
            item.monitorsites = siteStatusList;
            //汇总当前厂区数据
            item.monitorSiteAmount = getsiteStatusAmount(siteStatusList, string.Empty);
            item.realtimeStatusStatis = new MonitorSiteRealtimeStatis()
            {
                status_1 = getsiteStatusAmount(siteStatusList, "1"),
                status_2 = getsiteStatusAmount(siteStatusList, "2"),
                status_3 = getsiteStatusAmount(siteStatusList, "3"),
                status_4 = getsiteStatusAmount(siteStatusList, "4"),
                status_5 = getsiteStatusAmount(siteStatusList, "5"),
                status_9 = getsiteStatusAmount(siteStatusList, "9"),
                status_10 = getsiteStatusAmount(siteStatusList, "10"),
                status_13 = getsiteStatusAmount(siteStatusList, "13")
            };
        }
        private static int getsiteStatusAmount(List<MLazyTreeData> siteStatusList, string statusCode)
        {
            int result = 0;
            if (siteStatusList != null && siteStatusList.Count > 0)
            {
                if (!string.IsNullOrEmpty(statusCode))
                {
                    foreach (var item in siteStatusList)
                    {
                        if (null!=item && statusCode.Equals(item.statusCode))
                        {
                            result++;
                        }
                    }
                }
                else
                {
                    result = siteStatusList.Count();
                }
            }
            return result;
        }
        #endregion

        #region 获取树形厂区列表
        public static FWResult<List<Data_Canton>> queryMonitorSiteTree(IFWUserInfo userInfo)
        {
            FWResult<List<Data_Canton>> result = new FWResult<List<Data_Canton>>();
            List<MLazyTreeData> monitorsites = new List<MLazyTreeData>();
            #region  获取数据厂区数据
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            fwSqlCommand.CommandText = string.Format(@"   
SELECT  
t1.[code]   cantonCode
,t1.[pCode]   pCantonCode
,t1.[name]   cantonName  
,t2.longitude [posX]
,t2.latitude [posY]  
FROM  [dbo].[FWDictionary] t1 
LEFT JOIN FWDictionary_BLLCanton t2 ON t1.[dataID]=t2.[dataID]
WHERE  t1.[dictionaryTypeCode] = '{0}'  AND  ISNULL(T1.[isDis],0)=0  ", DictionaryTypeCodeSettings.BLLCanton);
            #endregion

            #region 存储获取状态
            SqlParameter sParaRecordCount = new SqlParameter("@RecordCount", SqlDbType.BigInt);
            sParaRecordCount.Direction = ParameterDirection.Output;
            SqlParameter[] SqlParameterS = {  sParaRecordCount ,
                                             new SqlParameter("@pageSize",90000),
                                             new SqlParameter("@pageIndex",1),
                                             new SqlParameter("@cantonCodeList",string.Empty) ,//Roger 2016/6/1 13:00:02 增加管辖区域 需要斟酌一下是否需要
                                             new SqlParameter("@statusCode",string.Empty) ,
                                             new SqlParameter("@MonitorSiteName",string.Empty) ,   
                                             new SqlParameter("@IGCodeList",string.Empty) 
                                           };

            SqlCommand cmd = new SqlCommand()
            {
                CommandType = CommandType.StoredProcedure,
                CommandText = "rpt_MonitorStatus"
            };
            cmd.Parameters.AddRange(SqlParameterS);
            DataSet ds = FWSqlCommandStaticHelper.ExecuteDataSet(cmd);

            if (ds != null && ds.Tables[2] != null)
            {
                //处置方式统计
                if (ds.Tables[2].Rows.Count > 0)
                {
                    monitorsites = FWDataTableHelper.toObjectList<MLazyTreeData>(ds.Tables[2]);
                }
            }
            #endregion

            try
            {
                var cantonList = FWSqlEntityToFWCommandStaticHelper.queryList<Data_Canton>(fwSqlCommand);
                var cantonTreeList = fwList.FWListHelper<Data_Canton>.toTree(cantonList, "pCantonCode", "cantonCode", "childDataList", "BLLCanton");
                //获取种植历史记录
                monitorsiteTreeDataTraversalSummary(cantonTreeList, monitorsites);
                result.data = cantonTreeList;
                //遍历获取
                result.status = FWResultStatus.Success;

            }
            catch (Exception ex)
            {

                result.data = null;
                result.status = FWResultStatus.Error;
                result.infoList.Add(ex.Message);
            }
            //获取数据


            return result;
        }
        private static void monitorsiteTreeDataTraversalSummary(List<Data_Canton> cantonList, List<MLazyTreeData> monitorsites)
        {
            foreach (var item in cantonList)
            {
                if (item.childDataList != null && item.childDataList.Count > 0)
                {
                    item.childDataList = monitorsiteDataTraversalSummary(item.childDataList, monitorsites);
                }
                else
                {
                    var siteStatusList = monitorsites.Where(p => p.cantonCode.Equals(item.cantonCode)).ToList();
                    item.monitorsites = siteStatusList;
                }
            }
        }


        #endregion


        //各镇设施故障数量统计  add by songshasha 2017-3-15
        public static FWResult<FWPageData<MBLLMonitorSiteState>> queryPageMonitorSiteState(IFWUserInfo userInfo,
           FWPageParams pageParams, string cantonCode, string projectNo, int isDetail)//isDetail 1:现场设备工作状态详情页，0：现场设备工作状态页面
        {

            FWResult<FWPageData<MBLLMonitorSiteState>> result = new FWResult<FWPageData<MBLLMonitorSiteState>>();
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;

            if (basicUserInfo == null || basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            bool isOperationPerson = !string.IsNullOrEmpty(basicUserInfo.operationMaintenancePersonCode);

            var dicCanton = getFirstLevelCanton();

            StringBuilder sqlbuilder = new StringBuilder();

            if (isDetail == 0)
            {
                sqlbuilder.AppendFormat(
                    @"select * from (select '{0}' cantonCode,'{1}' cantonName,'全部' dataState, '0' statusCode ,count(*) num from [dbo].[BLLEquipment] a,BLLMonitorSite b,[BLLMonitorSiteRealtimeFactorData] c", cantonCode, dicCanton[cantonCode]);
                if (isOperationPerson)
                {
                    sqlbuilder.AppendFormat(@" ,[dbo].[BLLOperationMaintenancePersonMappingMonitorSite] BMPM ");
                }
                sqlbuilder.AppendFormat(@" where a.isdel=0 and  a.moduleTypeCode= '1' and substring(a.cantonCode,1,6)='{0}' 
								and a.monitorSiteCode=b.monitorSiteCode and b.isdel=0 and a.monitorSiteCode=c.monitorSiteCode
                                 and a.equipmentCode = c.equipmentCode ", cantonCode);
                //增加登录用户所辖厂区数据的过滤
                sqlbuilder.AppendFormat(@" and ( {0} )", SysBasicManageBll.CartonToStr("a.cantonCode", basicUserInfo.cantonCodeList));
                //增加项目数据过滤
                if (!string.IsNullOrEmpty(projectNo))
                {
                    sqlbuilder.AppendFormat(@" and b.projectNo='{0}'", projectNo);

                }
                //运维人员只能看到点位
                if (isOperationPerson)
                {
                    sqlbuilder.AppendFormat(
                        @" and b.monitorSiteCode=BMPM.monitorSiteCode AND BMPM.operationMaintenancePersonCode='{0}' ", FWSqlCommandStaticHelper.checkParam(basicUserInfo.operationMaintenancePersonCode));
                }

                sqlbuilder.AppendFormat(
                    @"union select b.code cantonCode,b.name cantonName,'全部' dataState,'0' statusCode ,count(*) num from [dbo].[BLLEquipment] a,(select code,name from [dbo].[FWDictionary] where [dictionaryTypeCode]='BllCanton' and len(code)=9 and pcode='{0}' and isdis=0) b,[dbo].[BLLMonitorSiteRealtimeFactorData] c ,BLLMonitorSite d ",
                    cantonCode);
                if (isOperationPerson)
                {
                    sqlbuilder.AppendFormat(@" ,[dbo].[BLLOperationMaintenancePersonMappingMonitorSite] MPM ");
                }
                sqlbuilder.AppendFormat(
                    @"where  a.isdel=0 and  a.moduleTypeCode= '1' and substring(a.cantonCode,1,9)=b.code and  a.[equipmentCode]=c.[equipmentCode] and a.monitorSiteCode=c.monitorSiteCode and a.monitorSiteCode=d.monitorSiteCode and d.isdel=0 ");
                sqlbuilder.AppendFormat(@" and ( {0} )", SysBasicManageBll.CartonToStr("a.cantonCode", basicUserInfo.cantonCodeList));
                if (!string.IsNullOrEmpty(projectNo))
                {
                    sqlbuilder.AppendFormat(@" and d.projectNo='{0}'", projectNo);

                }
                //运维人员只能看到点位
                if (isOperationPerson)
                {
                    sqlbuilder.AppendFormat(
                        @" and d.monitorSiteCode=MPM.monitorSiteCode AND MPM.operationMaintenancePersonCode='{0}' ", FWSqlCommandStaticHelper.checkParam(basicUserInfo.operationMaintenancePersonCode));
                }
                sqlbuilder.AppendFormat(@"  group by b.code,b.name) temp ");

                sqlbuilder.Append(@" order by cantonCode ");
            }
            else if (isDetail == 1)
            {
                int cantonLen = cantonCode.Length;
                sqlbuilder.Append(@"select * from (select b.code cantonCode ,b.name cantonName,e.name dataState,count(*) num,c.dataState statusCode  from [dbo].[BLLEquipment] a,(
                                     select code,name from [dbo].[FWDictionary] where [dictionaryTypeCode]='BllCanton' ");
                if (cantonLen != 6)
                {
                    string pcode = cantonCode.Substring(0, 6);
                    sqlbuilder.Append(@" and pcode='"+pcode+"' ");
                }
                sqlbuilder.Append(
                    @"and isdis=0) b ,[dbo].[BLLMonitorSiteRealtimeFactorData] c,BLLMonitorSite d,[FWDictionary] e");
                if (isOperationPerson)
                {
                    sqlbuilder.AppendFormat(@" ,[dbo].[BLLOperationMaintenancePersonMappingMonitorSite] BMPM ");
                }
                sqlbuilder.Append(@" where  a.isdel=0 and  a.moduleTypeCode= '1' and c.dataState=e.code and e.[dictionaryTypeCode]='631' and substring(a.cantonCode,1," + cantonLen + ")=b.code  and a.monitorSiteCode=c.monitorSiteCode and  a.[equipmentCode]=c.[equipmentCode] and b.code='" + cantonCode + "'  and a.monitorSiteCode=d.monitorSiteCode and d.isdel=0  ");

                sqlbuilder.AppendFormat(@" and ({0})", SysBasicManageBll.CartonToStr("a.cantonCode", basicUserInfo.cantonCodeList));

                if (!string.IsNullOrEmpty(projectNo))
                {
                    sqlbuilder.AppendFormat(@" and d.projectNo='{0}'", projectNo);

                }

                //运维人员只能看到点位
                if (isOperationPerson)
                {
                    sqlbuilder.AppendFormat(
                        @" and d.monitorSiteCode=BMPM.monitorSiteCode AND BMPM.operationMaintenancePersonCode='{0}' ", FWSqlCommandStaticHelper.checkParam(basicUserInfo.operationMaintenancePersonCode));
                }

                sqlbuilder.AppendFormat(@"  group by b.code,b.name,e.name,c.dataState) temp   ");
                sqlbuilder.Append(@" order by cantonCode ");
            }

            var fwPageProcedureParams = new FWSqlPageProcedureParams
            {
                pageSize = pageParams.pageSize,
                pageIndex = pageParams.pageIndex,
                sql = sqlbuilder.ToString()
            };


            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MBLLMonitorSiteState>(fwPageProcedureParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询监测点列表出错。错误在：【queryPageMonitorSiteFailureStatistics】" + ex.Message.ToString());
            }
            return result;
        }

        //获取一级地区字典存在Dictionary中
        public static Dictionary<string, string> getFirstLevelCanton()
        {
            var dicCanton = new Dictionary<string, string>();
            var fwSqlCommand = new FWSqlCommand
            {
                CommandText = "select * from FWDictionary where pCode='BLLCanton'"
            };
            try
            {
                var result = FWSqlEntityToFWCommandStaticHelper.queryList<MFWCantonData>(fwSqlCommand);
                foreach (var item in result)
                {
                    dicCanton.Add(item.code,item.name);
                }
            }
            catch
            {
                // ignored
            }
            return dicCanton;
        }



        public class monitorSiteTypeInfo
        {

            public string monitorSiteTypeName;
            public int pumpType;
            public int monitorSiteType;
            public void setValue(string monitorSiteTypeName, int monitorSiteType, int pumpType)
            {
                this.monitorSiteTypeName = monitorSiteTypeName;
                this.pumpType = pumpType;
                this.monitorSiteType = monitorSiteType;

            }

        }


        public static List<monitorSiteTypeInfo> setMonitorSiteInfo()
        {
            //HCZ-50——10T、HCZ-25——5T、KJ-5或HJA-10——1T、KJ-10——2T
            //5吨10吨以上的是前提升   1吨2吨是后提升     1是数量 (现场设备一体化提升泵类型：1 无提升 2前提升 3后提升)
            List<monitorSiteTypeInfo> monitorSiteInfo = new List<MBLLMonitorSiteBll.monitorSiteTypeInfo>();
            monitorSiteTypeInfo monitorSite = new monitorSiteTypeInfo();
            monitorSite.setValue("HCZ-50", 10, 2);
            monitorSiteInfo.Add(monitorSite);

            monitorSiteTypeInfo monitorSite1 = new monitorSiteTypeInfo();
            monitorSite1.setValue("HCZ-25", 5, 2);
            monitorSiteInfo.Add(monitorSite1);

            monitorSiteTypeInfo monitorSite2 = new monitorSiteTypeInfo();
            monitorSite2.setValue("KJ-5", 1, 3);
            monitorSiteInfo.Add(monitorSite2);

            monitorSiteTypeInfo monitorSite3 = new monitorSiteTypeInfo();
            monitorSite3.setValue("HJA-10", 1, 3);
            monitorSiteInfo.Add(monitorSite3);

            monitorSiteTypeInfo monitorSite4 = new monitorSiteTypeInfo();
            monitorSite4.setValue("KJ-10", 2, 3);
            monitorSiteInfo.Add(monitorSite4);

            monitorSiteTypeInfo monitorSite5 = new monitorSiteTypeInfo();
            monitorSite5.setValue("HJA-50", 5, 2);
            monitorSiteInfo.Add(monitorSite5);


            monitorSiteTypeInfo monitorSite6 = new monitorSiteTypeInfo();
            monitorSite6.setValue("HJA-20", 2, 3);
            monitorSiteInfo.Add(monitorSite6);
            return monitorSiteInfo;
        }

        public static void getPumpType(string monitorType, string pump, out string pumpType, out string minitorSiteType)
        {

            //pumpType = "1"; //默认是无提升
            pumpType = "1";
            var monitorSite = monitorSiteInfo.Where(p => p.monitorSiteTypeName.Equals(monitorType)).ToList();
            minitorSiteType = monitorSite[0].monitorSiteType.ToString();
            if (!string.IsNullOrEmpty(pump))
            {
                pumpType = monitorSite[0].pumpType.ToString();
            }

        }

        /// <summary>
        /// Excel导入
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="filePath"></param> 
        /// <returns></returns>
        static List<monitorSiteTypeInfo> monitorSiteInfo = new List<monitorSiteTypeInfo>();
        public static FWResult<string> importMonitorSiteDataByExcel(IFWUserInfo userInfo, string filePath,string projectNo)
        {

            string message = "";
            FWResult<string> result = new FWResult<string>();
            try
            {
                string pumpType = string.Empty;
                string minitorSiteType = string.Empty;
                monitorSiteInfo = setMonitorSiteInfo();//根据现场设备型号自动判断提升井类型，提升井列如果有值，则认为是有提升，再根据现场设备型号判断提升井的类型

                #region 数据解析


                string fileAbsolutePath = HttpContext.Current.Server.MapPath(HttpContext.Current.Request.ApplicationPath + "/" + filePath);
                DataTable dt = FWExcelUtil.getDataTableFromExcel(1, 0, fileAbsolutePath);
                if (dt != null && dt.Rows.Count > 0)
                {
                    int zhenIx = 0;
                    int xingzhengcunIx = 0;
                    int zhilidianIx = 0;
                    int householdCountIx = 0;
                    int monitorNameIx = 0;
                    int householdNameIx = 0;
                    int monitorTypeIx = 0;
                    int meterNoIx = 0;
                    int meterNum = 0;
                    int pump = 0;
                    int monitorTypeStrIx = 0;//monitorType的完整名也存起来 add by lxg 20180418

                    //int qianpump = 0;
                    //int houpump = 0;

                    //获取字段的index
                    for (int i = 0; i < dt.Rows[0].ItemArray.Count(); i++)
                    {
                        switch (dt.Rows[0].ItemArray[i].ToString())
                        {
                            case "建制镇": zhenIx = i; break;
                            case "行政村": xingzhengcunIx = i; break;
                            case "治理点": zhilidianIx = i; break;
                            case "接管户": householdCountIx = i; break;
                            case "设备编号": monitorNameIx = i; break;
                            case "户主姓名": householdNameIx = i; break;
                            case "设备型号": monitorTypeIx = i; break;
                            case "电表编号": meterNoIx = i; break;
                            case "电表读数": meterNum = i; break;
                            case "提升井": pump = i; break;
                            case "设备型号名": monitorTypeStrIx = i; break;//monitorType的完整名也存起来

                            //case "前提升井": qianpump = i;break;
                            //case "后提升井": houpump = i;break;
                        }
                    }

                    string xingzhengcun = "";
                    string zirancun = "";



                    string sql = null;
                    //  update [wushui].[dbo].[BLLMonitorSite] set monitorSiteTypeCode='1' where monitorSiteName='ADBZ0GZC1101' and isDel=0 and projectNo='A'
                    for (int i = 1; i < dt.Rows.Count; i++)
                    {
                        string monitorType = dt.Rows[i][monitorTypeIx].ToString().Trim();
                        string monitorSiteName = dt.Rows[i][monitorNameIx].ToString().Trim();
                        switch (monitorType)
                        {
                            case "KJ-5" : monitorType = "1";break;
                            case "KJ-10": monitorType = "2"; break;
                            case "HCZ-25": monitorType = "5"; break;
                            case "HCZ-50": monitorType = "10"; break;
                            default:monitorType = "";break;
                        }
                        if (!string.IsNullOrEmpty(monitorType) && !string.IsNullOrEmpty(monitorSiteName))
                        {
                            sql +=
                                "update [wushui].[dbo].[BLLMonitorSite] set monitorSiteTypeCode='" + monitorType + "' where monitorSiteName='" + monitorSiteName + "' and isDel=0 and projectNo='A';" + System.Environment.NewLine;
                        }
                    }

                    sql += " ";

                    //string sql = "";
                    //for (int i = 1; i < dt.Rows.Count; i++)
                    //{                       
                    //    var monitorSiteName = dt.Rows[i][monitorNameIx].ToString().Trim();
                    //    var qianCode = dt.Rows[i][qianpump].ToString().Trim();
                    //    var houCode = dt.Rows[i][houpump].ToString().Trim();
                    //    if (!string.IsNullOrEmpty(monitorSiteName))
                    //    {
                    //        string code = "01";
                    //        if (!string.IsNullOrEmpty(qianCode))
                    //        {
                    //            code = "04";
                    //        }
                    //        if (!string.IsNullOrEmpty(houCode))
                    //        {
                    //            code = "03";
                    //        }
                    //        sql += "update [wushui].[dbo].[BLLEquipment]  set equipmentTypeCode='" + code +
                    //               "' from [wushui].[dbo].[BLLEquipment] a,[wushui].[dbo].[BLLMonitorSite] b where  a.monitorSiteCode=b.monitorSiteCode and b.projectNo='B' and b.monitorSiteName='" +
                    //               monitorSiteName + "';" + Environment.NewLine;
                    //    }
                    //}


                    for (int i = 1; i < dt.Rows.Count; i++)
                    {

                        try
                        {
                            if (string.IsNullOrEmpty(dt.Rows[i][zhenIx].ToString()))
                                continue;

                            getPumpType(dt.Rows[i][monitorTypeIx].ToString().Replace(" ", ""), dt.Rows[i][pump].ToString().Trim(), out pumpType, out  minitorSiteType);

                            MBLLMonitorSite entity = new MBLLMonitorSite();
                            entity.monitorSiteCode = Guid.NewGuid().ToString();
                            entity.projectNo = projectNo; 
                            entity.creater = userInfo.userID;
                            entity.createTime = DateTime.Now;
                            entity.householdName = dt.Rows[i][householdNameIx].ToString().Trim();
                            entity.householdsCount = dt.Rows[i][householdCountIx].ToString().Trim();
                            entity.isDel = 0;
                            entity.isDis = 0;
                            entity.meterNo = dt.Rows[i][meterNoIx].ToString().Trim();
                            if (!string.IsNullOrEmpty(dt.Rows[i][meterNum].ToString()))
                            {
                                entity.meterNum = Convert.ToDouble(dt.Rows[i][meterNum].ToString().Trim());
                            }

                            entity.monitorSiteName = dt.Rows[i][monitorNameIx].ToString().Trim();
                            entity.monitorSiteTypeCode = minitorSiteType;
                          // entity.monitorSiteTypeCode = dt.Rows[i][monitorTypeIx].ToString().Trim();  //去掉上行，添加这行，添加多个设备型号，Excel直接写设备TypeCode的和
                            //entity.monitorSiteTypeCodeStr = dt.Rows[i][monitorTypeStrIx].ToString().Trim(); //monitorType的完整名也存起来
                            entity.pumpTypeCode = pumpType;
                            //entity.pumpTypeCode = dt.Rows[i][pump].ToString();//string.IsNullOrEmpty(dt.Rows[i][pump].ToString()) ? "1" : "2";
                            entity.updater = userInfo.userID;
                            entity.updateTime = DateTime.Now;
                            entity.operateTime = DateTime.Now;
                            entity.cantonCode = "11";


                            xingzhengcun = dt.Rows[i][xingzhengcunIx].ToString().Trim() == "" ? xingzhengcun : dt.Rows[i][xingzhengcunIx].ToString().Trim();
                            zirancun = dt.Rows[i][zhilidianIx].ToString().Trim() == "" ? zirancun : dt.Rows[i][zhilidianIx].ToString().Trim();

                            entity.cantonName = dt.Rows[i][zhenIx].ToString().Trim() + "." + xingzhengcun + "." + zirancun;
                            string cantonCode = MBLLCantonCodeCheck(entity, i).data;
                            if (!string.IsNullOrEmpty(cantonCode))
                            {
                                entity.cantonCode = cantonCode;
                            }
                            else
                            {
                                message += "第" + (i + 2) + "行治理点不存在，导入失败;\r\n";
                                continue;
                            }


                            List<MBLLEquipment> equipmentList = new List<MBLLEquipment>();
                            MBLLEquipment equipment = new MBLLEquipment();

                            equipment.monitorSiteCode = entity.monitorSiteCode;
                            equipment.equipmentCode = Guid.NewGuid().ToString();
                            equipment.cantonCode = cantonCode;

                            equipment.isDel = 0;
                            equipment.isScrap = 0;
                            equipment.acceptanceTime = DateTime.Now;
                            equipment.creater = userInfo.userID;
                            equipment.createTime = DateTime.Now;
                            equipment.updater = userInfo.userID;
                            equipment.updateTime = DateTime.Now;
                            // equipment.equipmentName = "pre";
                            //equipment.equipmentTypeCode = "01";
                            //equipment.equipmentNo = "11";
                            equipmentList.Add(equipment);
                            entity.equipmentList = equipmentList;

                            List<MMonitorSiteAlarmItem> alarmList = new List<MMonitorSiteAlarmItem>();

                            for (int k = 1; k < 4; k++)
                            {
                                MMonitorSiteAlarmItem alarmItem = new MMonitorSiteAlarmItem();
                                alarmItem.monitorSiteCode = entity.monitorSiteCode;
                                alarmItem.alarmTypeCode = k.ToString();
                                alarmItem.createrID = userInfo.userID;
                                alarmItem.createTime = DateTime.Now;
                                alarmItem.updaterID = userInfo.userID;
                                alarmItem.updateTime = DateTime.Now;
                                alarmList.Add(alarmItem);
                            }

                            entity.monitorSiteAlarmList = alarmList;

                            List<MBas_MonitorSiteMonitorFactor> monitorFactorList = new List<MBas_MonitorSiteMonitorFactor>();
                            MBas_MonitorSiteMonitorFactor monitorFactor = new MBas_MonitorSiteMonitorFactor();
                            monitorFactor.monitorSiteCode = entity.monitorSiteCode;
                            //monitorFactor.equipmentCode = equipment.equipmentCode;
                            monitorFactor.alarmLowerLimit = 20;
                            monitorFactor.alarmUpperLimit = 500;
                            monitorFactor.channelNo = 1;
                            monitorFactor.isDis = 0;
                            monitorFactor.monitorFactorCode = "000008";
                            monitorFactor.standardLowerLimit = 100;
                            monitorFactor.standardUpperLimit = 200;

                            monitorFactor.updateTime = DateTime.Now;
                            monitorFactorList.Add(monitorFactor);

                            entity.monitorBasFactorList = monitorFactorList;

                            List<string> errorInfo = quickPreInitMonitorSite(userInfo, entity).infoList;

                            foreach (string item in errorInfo)
                            {
                                message += item;

                            }

                        }
                        catch (Exception e)
                        {
                            message += "第" + (i + 2) + "行导入失败" + e.Message + ";\r\n";
                            continue;
                        }


                    }
                }
                #endregion
            }
            catch (Exception ex)
            {

                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Failure;
                return result;
            }


            if (message != "")
            {

                result.infoList.Add(message);
                result.status = FWResultStatus.Failure;
                return result;
            }
            else
            {


                result.data = message;
                result.status = FWResultStatus.Success;
                return result;
            }
        }

        public static FWResult<string> updateMonitorSiteDataByExcel(IFWUserInfo userInfo, string filePath)
        {

            string message = "";
            FWResult<string> result = new FWResult<string>();
            try
            {
                string pumpType = string.Empty;
                string minitorSiteType = string.Empty;
                monitorSiteInfo = setMonitorSiteInfo();

                #region 数据解析


                string fileAbsolutePath = HttpContext.Current.Server.MapPath(HttpContext.Current.Request.ApplicationPath + "/" + filePath);
                DataTable dt = FWExcelUtil.getDataTableFromExcel(1, 0, fileAbsolutePath);
                if (dt != null && dt.Rows.Count > 0)
                {
                    int zhenIx = 0;
                    int xingzhengcunIx = 0;
                    int zhilidianIx = 0;
                    int householdCountIx = 0;
                    int monitorNameIx = 0;
                    int householdNameIx = 0;
                    int monitorTypeIx = 0;
                    int meterNoIx = 0;
                    int meterNum = 0;
                    int pump = 0;

                    //获取字段的index
                    for (int i = 0; i < dt.Rows[0].ItemArray.Count(); i++)
                    {
                        switch (dt.Rows[0].ItemArray[i].ToString())
                        {
                            case "建制镇": zhenIx = i; break;
                            case "行政村": xingzhengcunIx = i; break;
                            case "治理点": zhilidianIx = i; break;
                            case "接管户": householdCountIx = i; break;
                            case "设备编号": monitorNameIx = i; break;
                            case "户主姓名": householdNameIx = i; break;
                            case "设备型号": monitorTypeIx = i; break;
                            case "电表编号": meterNoIx = i; break;
                            case "电表读数": meterNum = i; break;
                            case "提升井": pump = i; break;
                        }
                    }


                    for (int i = 1; i < dt.Rows.Count; i++)
                    {

                        try
                        {

                            getPumpType(dt.Rows[i][monitorTypeIx].ToString().Replace(" ", ""), dt.Rows[i][pump].ToString().Trim(), out pumpType, out  minitorSiteType);

                            MBLLMonitorSite entity = new MBLLMonitorSite();
                            entity.monitorSiteCode = Guid.NewGuid().ToString();
                            entity.creater = userInfo.userID;
                            entity.createTime = DateTime.Now;
                            entity.householdName = dt.Rows[i][householdNameIx].ToString().Trim();
                            entity.householdsCount = dt.Rows[i][householdCountIx].ToString().Trim();
                            entity.isDel = 0;
                            entity.isDis = 0;
                            entity.meterNo = dt.Rows[i][meterNoIx].ToString().Trim();
                            if (!string.IsNullOrEmpty(dt.Rows[i][meterNum].ToString()))
                            {
                                entity.meterNum = Convert.ToDouble(dt.Rows[i][meterNum].ToString().Trim());
                            }

                            entity.monitorSiteName = dt.Rows[i][monitorNameIx].ToString().Trim();
                            entity.monitorSiteTypeCode = minitorSiteType;
                            entity.pumpTypeCode = pumpType;
                            entity.updater = userInfo.userID;
                            entity.updateTime = DateTime.Now;
                            // entity.operateTime = DateTime.Now;
                            entity.cantonName = dt.Rows[i][zhenIx].ToString().Trim() + "." + dt.Rows[i][xingzhengcunIx].ToString().Trim() + "." + dt.Rows[i][zhilidianIx].ToString().Trim();
                            string cantonCode = MBLLCantonCodeCheck(entity, i).data;
                            if (!string.IsNullOrEmpty(cantonCode))
                            {
                                entity.cantonCode = cantonCode;
                            }
                            else
                            {
                                message += "第" + i + 2 + "行治理点不存在，导入失败;\r\n";
                                continue;
                            }

                            FWResult<bool> resultCheck = new FWResult<bool>();
                            resultCheck = MBLLMonitorSiteBll.MBLLMonitorSiteNoCheck(entity);
                            if (resultCheck.status == FWResultStatus.Success)
                            {
                                BLLMonitorSite siteEntity = basicInfoBll.convertEntity<BLLMonitorSite>(entity);
                                // insertUpdateBLLMonitorSite(null, siteEntity, null);
                                MBLLMonitorSiteDal.inserOrUpdateMonitorSiteBySiteCode(siteEntity, null);
                            }

                            //foreach (string item in errorInfo)
                            //{
                            //    message += item;

                            //}

                        }
                        catch (Exception e)
                        {
                            message += "第" + i + 2 + "行导入失败" + e.Message + ";\r\n";
                            continue;

                        }


                    }
                }
                #endregion
            }
            catch (Exception ex)
            {

                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Failure;
                return result;
            }


            if (message != "")
            {

                result.infoList.Add(message);
                result.status = FWResultStatus.Failure;
                return result;
            }
            else
            {


                result.data = message;
                result.status = FWResultStatus.Success;
                return result;
            }
        }

        public static FWResult<string> MBLLCantonCodeCheck(MBLLMonitorSite mEntity, int i)//添加第几行参数有误
        {
            FWResult<string> result = new FWResult<string>();
            string cantonCode = "";
            FWSqlTransaction fwSqlTransaction1 = new FWSqlTransaction();
            if (mEntity == null || string.IsNullOrEmpty(mEntity.cantonName))
            {
                result.data = cantonCode;
                result.status = FWResultStatus.Error;
                result.infoList.Add("第" + i + 2 + "行参数内容有误！" + System.Environment.NewLine);
                return result;
            }
            try
            {
                StringBuilder sbSql = new StringBuilder();
                FWSqlCommand fwSqlCommand = new FWSqlCommand();

                fwSqlTransaction1.BeginTransaction();
                sbSql.AppendFormat(@" 
select code from [dbo].[FWDictionary] where fullName like '%{0}' and isDis=0 ", FWSqlCommandStaticHelper.checkParam(mEntity.cantonName));
                fwSqlCommand.CommandText = sbSql.ToString();
                cantonCode = FWSqlCommandStaticHelper.ExecuteDataSet(fwSqlTransaction1, fwSqlCommand).Tables[0].Rows[0][0].ToString();
                fwSqlTransaction1.Commit();
                result.data = cantonCode;
                result.status = FWResultStatus.Success;
                return result;
            }
            catch
            {
                fwSqlTransaction1.Rollback();
                fwSqlTransaction1.Close();
                result.data = cantonCode;
                result.status = FWResultStatus.Error;
                result.infoList.Add("第" + i + 2 + "行参数内容有误！" + System.Environment.NewLine);
                return result;
            }
        }

        public static FWResult<bool> quickPreInitMonitorSite(IFWUserInfo userInfo, MBLLMonitorSite mEntity)
        {
            FWResult<bool> result = new FWResult<bool>();
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            List<IFWCommand> BaseCommandList = new List<IFWCommand>();
            try
            {
                result.data = true;
                fwSqlTransaction.BeginTransaction();
                StringBuilder sbSql = new StringBuilder();
                FWSqlCommand sqlCmd = new FWSqlCommand();

                #region 参数 空/重复判断
                if (mEntity == null)
                {
                    // throw new Exception("参数为空！");
                }
                if (mEntity.equipmentList == null || mEntity.equipmentList.Count != 1)
                {
                    //throw new Exception("设备信息为空或异常！");
                }
                //if (mEntity.monitorBasFactorList == null || mEntity.monitorBasFactorList.Count <= 0)
                //{
                //    throw new Exception("监测因子不能为空！");
                //}

                #endregion

                var equipmentEntity = basicInfoBll.convertEntity<BLLEquipment>(mEntity.equipmentList[0]);

                #region  重复性判断

                //现场设备编码             
                result = MBLLMonitorSiteBll.MBLLMonitorSiteNoCheck(mEntity);
                if (result.status != FWResultStatus.Success)
                {
                    //result.infoList.Add(mEntity.monitorSiteName + "现场设备编码已存在");
                    throw new Exception(mEntity.monitorSiteName + "现场设备编码已存在;\r\n");
                }

                #endregion



                #region 现场设备 实体
                //defaultBLLMonitorSiteEntity(userInfo, mEntity);
                //if (!string.IsNullOrEmpty(mEntity.action) && mEntity.action.Equals("add"))
                //{
                //    mEntity.creater = userInfo.userID;
                //    mEntity.createTime = DateTime.Now;
                //}
                BLLMonitorSite siteEntity = basicInfoBll.convertEntity<BLLMonitorSite>(mEntity);
                result = insertUpdateBLLMonitorSite(userInfo, siteEntity, fwSqlTransaction);
                if (result.status != FWResultStatus.Success)
                {
                    // result.infoList.Add(mEntity.monitorSiteName + result .infoList[0].ToString ());

                    throw new Exception(mEntity.monitorSiteName + "现场设备新增/更新失败！" + result.infoList[0].ToString() + ";");
                }
                #endregion

                SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
                #region 报警项目
                if (mEntity.monitorSiteAlarmList != null && mEntity.monitorSiteAlarmList.Count > 0)
                {
                    BaseCommandList.AddRange(siteAlarmOPList(basicUserInfo, mEntity, false));
                }
                #endregion

                // TODO 添加因子是否重复  是否与现有值重复判断



                //获取原有设备信息 
                //设备相同只更新操作
                //不同则清空所有 数据 
                //equipmentEntity.monitorSiteCode = mEntity.monitorSiteCode;
                result = EquipmentBll.inserOrUpdateBLLEquipment(userInfo, equipmentEntity, null);
                if (result.status != FWResultStatus.Success || result.data != true)
                {
                    //result.infoList.Add("设备添加失败！" + result.infoList[0].ToString());
                    throw new Exception("设备添加失败！" + result.infoList[0].ToString() + ";");
                }




                #region 因子新增 删除 更新


                //数据新增/更新
                foreach (var MBasFactorEntity in mEntity.monitorBasFactorList)
                {

                    T_Bas_MonitorSiteMonitorFactor BasFactorEntity = basicInfoBll.convertEntity<T_Bas_MonitorSiteMonitorFactor>(MBasFactorEntity);
                    BasFactorEntity.updateTime = DateTime.Now;
                    result = MBLLMonitorSiteMonitorFactorBll.insertUpdateBasMonitorSiteMonitorFactor(BasFactorEntity, fwSqlTransaction);
                    if (result.status != FWResultStatus.Success)
                    {
                        //throw new Exception("现场设备 因子关系添加失败！");
                    }
                    //新增数据
                    BLLMonitorSiteMonitorFactor entity = setSiteMonitorFactor(basicUserInfo, Guid.NewGuid().ToString(), mEntity.monitorSiteCode, equipmentEntity.equipmentCode, MBasFactorEntity);
                    BaseCommandList.Add(MBLLMonitorSiteMonitorFactorDal.insertMonitorSiteFactor(entity));

                    //T_DAT_RealTime 增加对应关系
                    T_DAT_RealTime REntity = new T_DAT_RealTime();
                    REntity.PK_MCode = entity.dataID;
                    REntity.fdtmReal = new DateTime(1990, 1, 1);
                    REntity.fintStatis = 0;
                    REntity.fbitOver = false;
                    BaseCommandList.Add(MBLLMonitorSiteDal.inserDATRealTime(REntity));
                }




                #endregion
                if (BaseCommandList != null && BaseCommandList.Count > 0)
                {
                    result.data = FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, BaseCommandList);
                }
                result.status = FWResultStatus.Success;
                fwSqlTransaction.Commit();
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Error;
                fwSqlTransaction.Rollback();
                fwSqlTransaction.Close();
            }
            return result;
        }

        /// <summary>
        /// 查询设备运行情况
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="pageParams"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        public static FWResult<FWPageData<MBLLMonitorRunTime>> queryMonitorSiteRunTime(SysBasicManageUserInfo userInfo, FWPageParams pageParams, QueryBasicInfoParams queryParams)
        {
            FWResult<FWPageData<MBLLMonitorRunTime>> result = new FWResult<FWPageData<MBLLMonitorRunTime>>();


            StringBuilder sqlbuilder = new StringBuilder();
            StringBuilder disStr = new StringBuilder();
            sqlbuilder.Append(@" select * , convert(varchar(10), cast(onlineTime*1.0/(timeSpanAll)*100 as decimal(18,2)))+'%' onlineTimeRate,
convert(varchar(10), 100-cast(offlineTime*1.0/(case  when timeSpanAll-powerOffTime=0 then 1 else  timeSpanAll-powerOffTime end )*100 as decimal(18,2)))+'%' onlineTimeRatePower from 
(
select b.jianzhizhen ,b.xingzhengcun ,b.zirancun ,a.equipmentNo ,
   d.monitorSiteName ,d.householdName ,g.name datastate ,f.timeSpanAll ,f.offlineTime+f.powerOffTime offlineTimeAll,f.timeSpanAll-f.offlineTime-powerOffTime onlineTime
   ,f.offlineTime,f.powerOffTime
   from [dbo].[BLLEquipment] a
   ,[dbo].[FWDictionary] b
   ,[dbo].[BLLMonitorSiteRealtimeFactorData] c left join[FWDictionary] g on c.dataState=g.code and g.[dictionaryTypeCode]='631'
   ,BLLMonitorSite d
   ,BLLMonitorSiteMonitorFactor e
   ,(
    select temp.monitorSiteCode, 
   ISNULL(timeSpan,0)+ISNULL(timeSpanPart,0) offlineTime,datediff(hour,'" + queryParams.dStart + "','" + queryParams.dEnd + "') timeSpanAll, ISNULL(timeSpanPower,0)+ISNULL(timeSpanPartPower,0) powerOffTime ");

            sqlbuilder.Append(@" from (
    select monitorSiteCode,(select sum(timeSpan) from [BllOfflineTimeAnalysis] where offlineBeginTime between '" + queryParams.dStart + "' and '" + queryParams.dEnd + "'");
            sqlbuilder.Append(@" and offlineEndTime is not null and monitorSiteCode=a.monitorSiteCode and type='offline') timeSpan 
	,(select datediff(hour,case when offlineBeginTime<'" + queryParams.dStart + "' then '" + queryParams.dStart + "' else offlineBeginTime end  ,'" + queryParams.dEnd + "'  ) from BllOfflineTimeAnalysis ");
            sqlbuilder.Append(@" where  monitorSiteCode=a.monitorSiteCode and [offlineEndTime] is null and type='offline') timeSpanPart,
    (select sum(timeSpan) from [BllOfflineTimeAnalysis] where offlineBeginTime between '" + queryParams.dStart + "' and '" + queryParams.dEnd + "'");
            sqlbuilder.Append(@" and offlineEndTime is not null and monitorSiteCode=a.monitorSiteCode and type='powerOff') timeSpanPower 
	,(select datediff(hour,case when offlineBeginTime<'" + queryParams.dStart + "' then '" + queryParams.dStart + "' else offlineBeginTime end  ,'" + queryParams.dEnd + "'  ) from BllOfflineTimeAnalysis ");
            sqlbuilder.Append(@" where  monitorSiteCode=a.monitorSiteCode and [offlineEndTime] is null and type='powerOff' ) timeSpanPartPower
from [BLLMonitorSite] a) temp ) f ");

            sqlbuilder.Append(@"where  a.isdel=0 
           and a.[moduleTypeCode]=1   
           and d.cantonCode=b.code  
           and a.monitorSiteCode=d.monitorSiteCode
           and  a.[equipmentCode]=c.[equipmentCode]  
           and d.monitorSiteCode=e.monitorSiteCode
           and b.[dictionaryTypeCode]='BllCanton'  
           and d.monitorSiteCode=f.monitorSiteCode
           and c.dataState!=10");

            if (!string.IsNullOrEmpty(queryParams.projectNo))
            {
                sqlbuilder.AppendFormat(@" and d.projectNo='{0}'", queryParams.projectNo);

            }
            if (!string.IsNullOrEmpty(queryParams.keyword))
            {
                sqlbuilder.AppendFormat(@" AND (d.monitorSiteName like'%{0}%' or a.equipmentNo like '%{0}%' or b.fullName like '%{0}%' or  d.householdName like'{0}%'  )",
                    FWSqlCommandStaticHelper.checkParam(queryParams.keyword));
            }

            if (!string.IsNullOrEmpty(queryParams.cantonCode))
            {
                sqlbuilder.AppendFormat(@" and d.cantonCode like '%{0}%'", queryParams.cantonCode);
            }

            sqlbuilder.Append(@" ) tempAll order by monitorSiteName ");


            //and offlineBeginTime  between '" + queryParams.dStart + "' and '" + queryParams.dEnd + "'

            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MBLLMonitorRunTime>(fwPageProcedureParams);

                result.status = FWResultStatus.Success;
            }

            catch (Exception ex)
            {
                result.infoList.Add("设备运行情况统计出错。错误在：【queryMonitorSiteRunTime】" + ex.Message.ToString());
            }
            return result;
        }


        //报停设备改为正常
        public static FWResult<bool> updateReportEquipment(IFWUserInfo userInfo, List<MBLLMonitorSite> siteCodeList)
        {
            FWResult<bool> result = new FWResult<bool>();
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            if (basicUserInfo.userTypeCode != "10")
            {
                result.data = false;
                result.infoList.Add("请联系管理员进行此操作");
                return result;
            }
            var sb=new StringBuilder();
            var fwSqlTransaction = new FWSqlTransaction();
            try
            {
                fwSqlTransaction.BeginTransaction();
                foreach (var item in siteCodeList)
                {
                    if (!string.IsNullOrEmpty(item.equipmentCode) && !string.IsNullOrEmpty(item.monitorSiteCode))
                    {
                        sb.AppendFormat(
                            @"update [dbo].[BLLMonitorSiteRealtimeFactorData] set dataState=1,updateTime='{0}',updaterID='{1}' 
 where dataState=13 and monitorFactorCode='000008' and monitorSiteCode='{2}' and equipmentCode='{3}';",
                            DateTime.Now, userInfo.userID, item.monitorSiteCode, item.equipmentCode);
                    }
                }
                var sqlCmd = new FWSqlCommand {CommandText = sb.ToString()};
                FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, sqlCmd);
                result.data = true;
                fwSqlTransaction.Commit();
            }
            catch (Exception ex)
            {
                fwSqlTransaction.Rollback();
                result.data = false;
                result.infoList.Add(ex.Message);
            }
            finally
            {
                fwSqlTransaction.Close();
            }                     
            return result;
        }

        /// <summary>
        /// 查询设备掉线情况
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="pageParams"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        public static FWResult<FWPageData<MBLLMonitorRunTime>> queryMonitorSiteOffTime(SysBasicManageUserInfo userInfo, FWPageParams pageParams, QueryBasicInfoParams queryParams)
        {
            FWResult<FWPageData<MBLLMonitorRunTime>> result = new FWResult<FWPageData<MBLLMonitorRunTime>>();


            StringBuilder sqlbuilder = new StringBuilder();
            StringBuilder disStr = new StringBuilder();
            sqlbuilder.Append(@" select * from (select distinct d.jianzhizhen ,d.xingzhengcun ,d.zirancun ,b.equipmentNo,c.monitorSiteName ,c.householdName,a.offlineBeginTime,a.offlineEndTime,f.name datastate
	 from 	BllOfflineTimeAnalysis  a,BLLEquipment b,BLLMonitorSite c left join[FWDictionary] d on c.cantonCode=d.code and d.dictionaryTypeCode='BLLCanton'
    ,BLLMonitorSiteRealtimeFactorData e left join [FWDictionary] f on e.dataState=f.code and f.dictionaryTypeCode='631'
	where  a.monitorSiteCode=b.monitorSiteCode  AND e.monitorFactorCode='000008' 
	and b.monitorSiteCode=c.monitorSiteCode  and e.monitorSiteCode=c.monitorSiteCode and 
	( a.offlineBeginTime between '" + queryParams.dStart + "' and '" + queryParams.dEnd + "' or  a.offlineEndTime between  '" + queryParams.dStart + "' and '" + queryParams.dEnd + "' ) ");


            if (!string.IsNullOrEmpty(queryParams.projectNo))
            {
                sqlbuilder.AppendFormat(@" and c.projectNo='{0}'", queryParams.projectNo);

            }
            if (!string.IsNullOrEmpty(queryParams.keyword))
            {
                sqlbuilder.AppendFormat(@" AND (c.monitorSiteName like'%{0}%' or b.equipmentNo like '%{0}%' or d.fullName like '%{0}%' or  c.householdName like'{0}%'  )",
                    FWSqlCommandStaticHelper.checkParam(queryParams.keyword));
            }

            if (!string.IsNullOrEmpty(queryParams.cantonCode))
            {
                sqlbuilder.AppendFormat(@" and c.cantonCode like '%{0}%'", queryParams.cantonCode);
            }

            sqlbuilder.Append(@" ) temp order by monitorSiteName ");


            //and offlineBeginTime  between '" + queryParams.dStart + "' and '" + queryParams.dEnd + "'

            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MBLLMonitorRunTime>(fwPageProcedureParams);

                result.status = FWResultStatus.Success;
            }

            catch (Exception ex)
            {
                result.infoList.Add("设备掉线情况统计出错。错误在：【queryMonitorSiteOffTime】" + ex.Message.ToString());
            }
            return result;
        }

        public static FWResult<FWPageData<MBLLMonitorSiteState>> queryMonitorSiteStatis(IFWUserInfo userInfo, FWPageParams pageParams, string cantonCode, string projectNo, int isDetail)
        {
            FWResult<FWPageData<MBLLMonitorSiteState>> result = new FWResult<FWPageData<MBLLMonitorSiteState>>();
            SysBasicManageUserInfo info = (SysBasicManageUserInfo)userInfo;
            if (((info == null) || (info.cantonCodeList == null)) || (info.cantonCodeList.Count == 0))
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }
            bool flag = !string.IsNullOrEmpty(info.operationMaintenancePersonCode);
            Dictionary<string, string> dictionary = getFirstLevelCanton();
            StringBuilder builder = new StringBuilder();
            if (isDetail == 0)
            {
                builder.AppendFormat("select * from (select '{0}' cantonCode,'{1}' cantonName,'全部' dataState, '0' statusCode ,count(*) num from BLLMonitorSite b ", cantonCode, dictionary[cantonCode]);
                if (flag)
                {
                    builder.AppendFormat(" ,[dbo].[BLLOperationMaintenancePersonMappingMonitorSite] BMPM ", new object[0]);
                }
                builder.AppendFormat(" where b.isDel = 0 ", new object[0]);
                builder.AppendFormat(" and ( {0} )", SysBasicManageBll.CartonToStr("b.cantonCode", info.cantonCodeList));
                if (!string.IsNullOrEmpty(projectNo))
                {
                    builder.AppendFormat(" and b.projectNo='{0}'", projectNo);
                }
                if (flag)
                {
                    builder.AppendFormat(" and b.monitorSiteCode=BMPM.monitorSiteCode AND BMPM.operationMaintenancePersonCode='{0}' ", FWSqlCommandStaticHelper.checkParam(info.operationMaintenancePersonCode));
                }
                builder.AppendFormat("union select b.code cantonCode,b.name cantonName,'全部' dataState,'0' statusCode ,count(*) num from BLLMonitorSite d,(select code,name from [dbo].[FWDictionary] where [dictionaryTypeCode]='BllCanton' and len(code)=9 and pcode='{0}' and isdis=0) b ", cantonCode);
                if (flag)
                {
                    builder.AppendFormat(" ,[dbo].[BLLOperationMaintenancePersonMappingMonitorSite] MPM ", new object[0]);
                }
                builder.AppendFormat("where  substring(d.cantonCode,1,9)=b.code and d.isdel=0 ", new object[0]);
                builder.AppendFormat(" and ( {0} )", SysBasicManageBll.CartonToStr("d.cantonCode", info.cantonCodeList));
                if (!string.IsNullOrEmpty(projectNo))
                {
                    builder.AppendFormat(" and d.projectNo='{0}'", projectNo);
                }
                if (flag)
                {
                    builder.AppendFormat(" and d.monitorSiteCode=MPM.monitorSiteCode AND MPM.operationMaintenancePersonCode='{0}' ", FWSqlCommandStaticHelper.checkParam(info.operationMaintenancePersonCode));
                }
                builder.AppendFormat("  group by b.code,b.name) temp ", new object[0]);
                builder.Append(" order by cantonCode ");
            }
            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams
            {
                pageSize = pageParams.pageSize,
                pageIndex = pageParams.pageIndex,
                sql = builder.ToString()
            };
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MBLLMonitorSiteState>(fwPageProcedureParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception exception)
            {
                result.infoList.Add("查询监测点列表出错。错误在：【queryPageMonitorSiteFailureStatistics】" + exception.Message.ToString());
            }
            return result;
        }

    }
}
