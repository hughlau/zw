using fw.fwDal;
using fw.fwData;
using fw.fwSession;
using fw.m.basicInfo.dal;
using fw.m.basicInfo.data;
using fw.m.basicInfo.data.entity;
using fw.m.basicInfo.data.model;
using fw.m.Common;
using fw.m.sysBasicManage.bll;
using fw.m.sysBasicManage.data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.basicInfo.bll
{
    public class CollectionDataBll
    {
        public static FWResult<FWPageData<MBLLCollectionData>> queryPageData(string userId, FWPageParams pageParams
            , QueryCollectionDataParams queryParams)
        {

            var result = new FWResult<FWPageData<MBLLCollectionData>>();
            try
            {
                result.data = CollectionDataDal.queryPageData(userId, pageParams, queryParams);
                result.status = FWResultStatus.Success;
            }

            catch (Exception ex)
            {
                result.infoList.Add("获取数据失败" + ex.Message);
            }
            return result;
        }

        public static FWResult<FWPageData<MBLLMonitorSite>> queryPageMonitorSiteStatus(SysBasicManageUserInfo userInfo,
            FWPageParams pageParams, QueryCollectionBasicInfoParams queryParams)
        {
            FWResult<FWPageData<MBLLMonitorSite>> result = new FWResult<FWPageData<MBLLMonitorSite>>();
            FWPageData<MBLLMonitorSite> pageData = new FWPageData<MBLLMonitorSite>();
            List<MBLLMonitorSite> siteLsit = new List<MBLLMonitorSite>();
            var siteListRequest = queryMonitorSiteStatusList(userInfo, queryParams);
            if (siteListRequest != null && siteListRequest.status == FWResultStatus.Success)
            {
                siteLsit = siteListRequest.data;
            }
            else
            {
                result.infoList.Concat(siteListRequest.infoList);
                result.status = siteListRequest.status;
                return result;
            }

            try
            {
                pageData.pageSize = pageParams.pageSize;
                pageData.pageIndex = pageParams.pageIndex;
                int rangeNum = (int)pageParams.pageSize * (int)(pageParams.pageIndex - 1);
                pageData.recordCount = 0;
                //合并数据
                if (siteLsit != null && siteLsit.Count > 0)
                {
                    pageData.recordCount = siteLsit.Count();
                    pageData.entityList = siteLsit.OrderBy(p => p.cantonCode).OrderBy(p => p.monitorSiteName).Skip(rangeNum).Take((int)pageParams.pageSize).ToList();
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

        /// <summary>
        /// 现场设备状态列表
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="cantonCode"></param>
        /// <param name="statusCode"></param>
        /// <param name="keyWord"></param>
        /// <returns></returns>
        public static FWResult<List<MBLLMonitorSite>> queryMonitorSiteStatusList(SysBasicManageUserInfo userInfo
            , QueryCollectionBasicInfoParams queryParams)
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
                var list = queryMonitorSiteList(userInfo, queryParams);

                result.data = list;
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.data = null;
                result.status = FWResultStatus.Error;
                result.infoList.Add(ex.Message);
            }
            return result;
        }

        //查询已经关联设备的现场设备列表
        public static List<MBLLMonitorSite> queryMonitorSiteList(SysBasicManageUserInfo userInfo
            , QueryCollectionBasicInfoParams queryParams)
        {
            List<MBLLMonitorSite> result = new List<MBLLMonitorSite>();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;

            bool isOperationPerson = !string.IsNullOrEmpty(basicUserInfo.operationMaintenancePersonCode);

            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
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
,monitorSite.longitudeGPS
,monitorSite.latitudeGPS
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
,monitorSite.updateTime 
,eq.equipmentCode
,eq.[equipmentNo]
,ds.name as statusCode
,eq.remark
,dss.color as color
,cd.dataId as updater
 FROM dbo.BLLMonitorSite monitorSite
 INNER JOIN dbo.BLLCollectionData cd
 ON monitorSite.monitorSiteCode=cd.monitorSiteCode AND cd.cateCode='{4}' AND cd.userId='{5}'
left join dbo.BLLMonitorSiteRealtimeFactorData factorData on factorData.monitorFactorCode='000008' and monitorSite.monitorSiteCode=factorData.monitorSiteCode
LEFT JOIN dbo.FWDictionary canton ON monitorSite.cantonCode=canton.code AND canton.dictionaryTypeCode='{0}'
LEFT JOIN dbo.FWDictionary pump ON monitorSite.pumpTypeCode=pump.code AND pump.dictionaryTypeCode='{1}' 
LEFT JOIN dbo.FWDictionary st ON monitorSite.monitorSiteTypeCode=st.code AND st.dictionaryTypeCode='{2}'
left JOIN [dbo].[BLLEquipment] eq ON monitorSite.monitorSiteCode=eq.monitorSiteCode 
left join dbo.FWDictionary ds on ds.dictionaryTypeCode='{3}' and factorData.dataState=ds.code
left join [dbo].[FWDictionary_SiteStatus] dss on dss.dataID=ds.dataID 
", DictionaryTypeCodeSettings.BLLCanton, DictionaryTypeCodeSettings.BLLPumpType
, DictionaryTypeCodeSettings.BLLSiteType, DictionaryTypeCodeSettings.Code631
, queryParams.cateCode,userInfo.userID);

            if (isOperationPerson)
            {
                sbSql.AppendFormat(@" inner join [dbo].[BLLOperationMaintenancePersonMappingMonitorSite] MPM WITH(NOLOCK) on monitorSite.monitorSiteCode=MPM.monitorSiteCode
and MPM.operationMaintenancePersonCode='{0}' ", basicUserInfo.operationMaintenancePersonCode);
            }

            sbSql.AppendFormat(@" WHERE  ISNULL(eq.isDel,0)=0  and ISNULL(monitorSite.isDel,0)=0 ");

            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.equipmentType))
                {
                    if (queryParams.equipmentType == "ltu")
                    {
                        sbSql.AppendFormat(@" and  eq.moduleTypeCode= '1'");
                    }
                    else
                    {
                        sbSql.AppendFormat(@" and  eq.moduleTypeCode= '2' and eq.remark is not null ");
                    }

                }
                else
                {
                    sbSql.AppendFormat(@" and  eq.moduleTypeCode= '1' ");
                }

                if (!string.IsNullOrEmpty(queryParams.monitorSiteCode))
                {
                    sbSql.AppendFormat(@" AND monitorSite.monitorSiteCode='{0}'", queryParams.monitorSiteCode);
                }
                if (!string.IsNullOrEmpty(queryParams.keyword))
                {
                    sbSql.AppendFormat(@" AND ( monitorSite.monitorSiteName like '%{0}%' or eq.[equipmentNo] like '%{0}%' or canton.fullName like '%{0}%')  ", FWSqlCommandStaticHelper.checkParam(queryParams.keyword));
                }
                if (queryParams.monitorSiteCodeList != null && queryParams.monitorSiteCodeList.Count > 0)
                {
                    sbSql.AppendFormat(@" AND monitorSite.monitorSiteCode IN ({0})", FWSqlCommandStaticHelper.joinToSqlString(queryParams.monitorSiteCodeList));
                }

                if (!string.IsNullOrEmpty(queryParams.projectNo))
                {
                    sbSql.AppendFormat(@" and monitorSite.projectNo= '{0}'",
                        FWSqlCommandStaticHelper.checkParam(queryParams.projectNo));
                }

                if (!string.IsNullOrEmpty(queryParams.cantonCode))
                {
                    sbSql.AppendFormat(@" and monitorSite.cantonCode like '{0}%' ", queryParams.cantonCode);
                }
                if (!string.IsNullOrEmpty(queryParams.householdName))
                {
                    sbSql.AppendFormat(@" AND monitorSite.householdName like'{0}%'",
                           FWSqlCommandStaticHelper.checkParam(queryParams.householdName));
                }
                if (!string.IsNullOrEmpty(queryParams.statusCode))
                {
                    sbSql.AppendFormat(@" AND  factorData.dataState = '{0}'  ", FWSqlCommandStaticHelper.checkParam(queryParams.statusCode));
                }
            }

            //Roger 2016/6/1 13:00:02 增加管辖区域
            //modify by lzc 20170120
            sbSql.AppendFormat(@" AND  ({0})  ", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", basicUserInfo.cantonCodeList));

            sqlCmd.CommandText = sbSql.ToString();
            result = FWSqlEntityToFWCommandStaticHelper.queryList<MBLLMonitorSite>(sqlCmd);
            return result;
        }


        public static FWResult<bool> insertCateCode(IFWUserInfo userInfo, BLLCollectionData entity)
        {
            FWResult<bool> result = new FWResult<bool>();
            if (entity != null)
            {
                entity.userId = userInfo.userID;
                entity.dataId = Guid.NewGuid().ToString();
            }
            bool isExist= CollectionDataDal.isExistInCate(entity.cateCode, entity.monitorSiteCode);
            if (!isExist)
            {
                result.data = CollectionDataDal.insert(entity);
                result.status = FWResultStatus.Success;
            }
            else
            {
                result.data = false;
                result.status = FWResultStatus.Failure;
                result.infoList.Add("现场设备已经被收藏");
            }
            return result;
        }

        public static FWResult<bool> delete(IFWUserInfo userInfo, List<BLLCollectionData> entityList)
        {
            FWResult<bool> result = new FWResult<bool>();
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            fwSqlTransaction.BeginTransaction();
            try
            {
                foreach (var entity in entityList)
                {
                    List<IFWParameter> fwParameterList = new List<IFWParameter>() {
                        new FWParameter("dataId", entity.dataId)
                    };
                    IFWCommand cmd = FWSqlEntityToFWCommandStaticHelper.delete<BLLCollectionData>(" dataId=@dataId"
                        , fwParameterList);
                    FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, cmd); 
                }

                fwSqlTransaction.Commit();
                result.data = true;
                result.status = FWResultStatus.Success;
            }
            catch (Exception)
            {
                fwSqlTransaction.Rollback();
                result.status = FWResultStatus.Failure;
            }
            
            return result;
        }
    }
}
