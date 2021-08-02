using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwData;
using fw.m.basicInfo.data.model;
using fw.m.basicInfo.data;
using fw.m.sysBasicManage.data;
using fw.m.Common;
using fw.fwDal;
using fw.m.sysBasicManage.bll;
using fw.fwSession;
using System.Data.SqlClient;
using System.Data;
using fw.fwDataTable;
using fw.m.basicInfo.dal;
using fw.m.basicInfo.data.entity;
using System.Web;
using fw.fwOffice;
using fw.m.sysManage.data.model;
using Newtonsoft.Json;


namespace fw.m.basicInfo.bll
{
    /// <summary>
    /// 设施监测数据 状态服务
    /// </summary>
    public class MonitorDataAndStatusBll
    {
        #region 基础数据查询

        /// <summary>
        /// 调用存储获取 净化槽状态
        /// </summary>
        /// <returns></returns>
        private static List<MLazyTreeData> getMonitorStatus_Proc()
        {
            List<MLazyTreeData> result = new List<MLazyTreeData>();

            SqlParameter sParaRecordCount = new SqlParameter("@RecordCount", SqlDbType.BigInt);
            sParaRecordCount.Direction = ParameterDirection.Output;
            SqlParameter[] SqlParameterS = {  sParaRecordCount ,
                                             new SqlParameter("@pageSize",9999999),
                                             new SqlParameter("@pageIndex",1),
                                             new SqlParameter("@cantonCodeList",string.Empty) ,//默认展示所有数据
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
                    result = FWDataTableHelper.toObjectList<MLazyTreeData>(ds.Tables[2]);
                }
            }
            return result;
        }

        //查询已经关联设备的净化槽列表
        public static List<MBLLMonitorSite> queryMonitorSiteListJizhan(SysBasicManageUserInfo userInfo, QueryBasicInfoParams queryParams)
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
select 
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
,monitorSite.[updater]
,monitorSite.updateTime 
,eq.equipmentCode
,eq.[equipmentNo]
,CASE WHEN eq.moduleTypeCode=1 THEN ds.name ELSE CAST(brd.dataState AS VARCHAR(128)) END  as statusCode
,eq.remark
,dss.color as color
,eq.moduleTypeCode
 FROM dbo.BLLMonitorSite monitorSite
left join dbo.BLLMonitorSiteRealtimeFactorData factorData 
on factorData.monitorFactorCode='000008' and monitorSite.monitorSiteCode=factorData.monitorSiteCode
LEFT JOIN dbo.FWDictionary canton ON monitorSite.cantonCode=canton.code AND canton.dictionaryTypeCode='{0}'
LEFT JOIN dbo.FWDictionary pump ON monitorSite.pumpTypeCode=pump.code AND pump.dictionaryTypeCode='{1}' 
LEFT JOIN dbo.FWDictionary st ON monitorSite.monitorSiteTypeCode=st.code AND st.dictionaryTypeCode='{2}'
left JOIN [dbo].[BLLEquipment] eq ON monitorSite.monitorSiteCode=eq.monitorSiteCode 
left join dbo.FWDictionary ds on ds.dictionaryTypeCode='{3}' and factorData.dataState=ds.code
left join [dbo].[FWDictionary_SiteStatus] dss on dss.dataID=ds.dataID 
LEFT JOIN dbo.BLLGatewayRealtimeData brd ON eq.equipmentCode=brd.code 
", DictionaryTypeCodeSettings.BLLCanton, DictionaryTypeCodeSettings.BLLPumpType, DictionaryTypeCodeSettings.BLLSiteType, DictionaryTypeCodeSettings.Code631);

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


        //查询已经关联设备的净化槽列表
        public static List<MBLLMonitorSite> queryMonitorSiteList(SysBasicManageUserInfo userInfo, QueryBasicInfoParams queryParams)
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
select 
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
,monitorSite.[updater]
,monitorSite.updateTime 
,eq.equipmentCode
,eq.[equipmentNo]
,ds.name as statusCode
,eq.remark
,dss.color as color
 FROM dbo.BLLMonitorSite monitorSite
left join dbo.BLLMonitorSiteRealtimeFactorData factorData 
on factorData.monitorFactorCode='000008' and monitorSite.monitorSiteCode=factorData.monitorSiteCode
LEFT JOIN dbo.FWDictionary canton ON monitorSite.cantonCode=canton.code AND canton.dictionaryTypeCode='{0}'
LEFT JOIN dbo.FWDictionary pump ON monitorSite.pumpTypeCode=pump.code AND pump.dictionaryTypeCode='{1}' 
LEFT JOIN dbo.FWDictionary st ON monitorSite.monitorSiteTypeCode=st.code AND st.dictionaryTypeCode='{2}'
left JOIN [dbo].[BLLEquipment] eq ON monitorSite.monitorSiteCode=eq.monitorSiteCode 
left join dbo.FWDictionary ds on ds.dictionaryTypeCode='{3}' and factorData.dataState=ds.code
left join [dbo].[FWDictionary_SiteStatus] dss on dss.dataID=ds.dataID 
", DictionaryTypeCodeSettings.BLLCanton, DictionaryTypeCodeSettings.BLLPumpType, DictionaryTypeCodeSettings.BLLSiteType,DictionaryTypeCodeSettings.Code631);

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

        #endregion

        #region 净化槽状态查询


        /// <summary>
        /// 净化槽状态列表
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="cantonCode"></param>
        /// <param name="statusCode"></param>
        /// <param name="keyWord"></param>
        /// <returns></returns>
        public static FWResult<List<MBLLMonitorSite>> queryMonitorSiteStatusList(SysBasicManageUserInfo userInfo, QueryBasicInfoParams queryParams)
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
                //List<MLazyTreeData> proc_dataList = getMonitorStatus_Proc();
                var list = queryMonitorSiteList(userInfo, queryParams);
                //result.data = null;
                ////数据状态合并
                //if (list != null && list.Count > 0)
                //{

                //    foreach (var item in list)
                //    {
                //        if (proc_dataList != null && proc_dataList.Count > 0)
                //        {
                //            var hitList = proc_dataList.Where(p => p.monitorSiteCode.Equals(item.monitorSiteCode)).ToList();
                //            if (hitList != null && hitList.Count > 0)
                //            {
                //                item.statusCode = hitList.First().statusCode;
                //            }
                //            else
                //            {
                //                item.statusCode = "9"; //9 通讯故障
                //            }
                //        }
                //        else
                //        {
                //            item.statusCode = "9"; //9 通讯故障
                //        }
                //    }
                //    //状态过滤
                //    if (queryParams != null && !string.IsNullOrEmpty(queryParams.statusCode))
                //    {
                //        list = list.Where(p => p.statusCode == queryParams.statusCode).ToList();
                //    }
                //    result.data = list;
                //}
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


        /// <summary>
        /// 净化槽状态列表(包括基站)
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="cantonCode"></param>
        /// <param name="statusCode"></param>
        /// <param name="keyWord"></param>
        /// <returns></returns>
        public static FWResult<List<MBLLMonitorSite>> queryMonitorSiteStatusListJizhan(SysBasicManageUserInfo userInfo, QueryBasicInfoParams queryParams)
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
                var list = queryMonitorSiteListJizhan(userInfo, queryParams);
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

        /// <summary>
        /// 地图快速搜索
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="keyWord"></param>
        /// <param name="topNum"></param>
        /// <param name="cantonCode"></param>
        /// <returns></returns>
        public static FWResult<List<MBLLMonitorSite>> queryMonitorSiteEasy(SysBasicManageUserInfo userInfo, string keyWord, int? topNum, string cantonCode)
        {
            FWResult<List<MBLLMonitorSite>> result = new FWResult<List<MBLLMonitorSite>>();
            

            try
            {
                QueryBasicInfoParams queryParams = new QueryBasicInfoParams()
                {
                    keyword = keyWord,                   
                    cantonCode = cantonCode
                };
                List<MBLLMonitorSite> siteLsit = new List<MBLLMonitorSite>();
                var siteListRequest = queryMonitorSiteStatusList(userInfo, queryParams);
                if (siteListRequest != null && siteListRequest.status == FWResultStatus.Success)
                {
                    siteLsit = siteListRequest.data;
                }
                //数据状态合并
                if (siteLsit != null && siteLsit.Count > 0)
                {

                    siteLsit = siteLsit.OrderBy(p => p.monitorSiteName).Take(topNum.HasValue ? topNum.Value : 10).ToList();
                }
                result.data = siteLsit;
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

        public static FWResult<FWPageData<MBLLMonitorSite>> queryPageMonitorSiteStatus(SysBasicManageUserInfo userInfo,
            FWPageParams pageParams, QueryBasicInfoParams queryParams)
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
 
        #endregion

        #region 监测数据 Excel导入/手动添加


        public static FWResult<bool> importDataByMobile(IFWUserInfo userInfo, MBLLFactorData mEntity)
        {
            FWResult<bool> result = new FWResult<bool>();
            BLLMonitorSiteHisFactorData entity = new BLLMonitorSiteHisFactorData();
            MBLLMonitorSiteMonitorFactor factorSetting = FWSqlEntityToFWCommandStaticHelper.query<MBLLMonitorSiteMonitorFactor>(MBLLMonitorSiteMonitorFactorDal.queryMonitorSiteFactor(mEntity.monitorSiteCode, mEntity.monitorFactorCode));
            entity.monitorSiteCode = mEntity.monitorSiteCode;
            entity.monitorFactorCode = mEntity.monitorFactorCode;
            entity.monitorValue = mEntity.monitorValue;
            entity.monitorTime = mEntity.monitorTime;
            entity.equipmentCode = mEntity.equipmentCode;
            entity.dataSource = 2;
            //4  设备漏气
            //5  设备堵塞
            if (mEntity.monitorValue > factorSetting.alarmUpperLimit)
            {
                entity.dataState = 5;
            }
            else if (mEntity.monitorValue < factorSetting.alarmLowerLimit)
            {
                entity.dataState = 4;
            }

            entity.createTime = DateTime.Now;
            try
            {
                var resultAmount = FWSqlCommandStaticHelper.ExecuteNonQuery(MBLLMonitorSiteMonitorFactorDal.insertBLLMonitorSiteHisFactorData(entity));
                result.data = resultAmount > 0;
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
        /// Excel导入
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="filePath"></param> 
        /// <returns></returns>
        public static FWResult<bool> importDataByExcel(SysBasicManageUserInfo userInfo, string filePath)
        {
            var monitorSiteCode = "";
            FWResult<bool> result = new FWResult<bool>();
            List<BLLMonitorSiteHisFactorData> list = new List<BLLMonitorSiteHisFactorData>();
            try
            {
                #region 系统数据获取
                //因子具体设置  用于状态判断
                List<MBLLMonitorSiteMonitorFactor> factorSettings = FWSqlEntityToFWCommandStaticHelper.queryList<MBLLMonitorSiteMonitorFactor>(MBLLMonitorSiteMonitorFactorDal.queryMonitorSiteFactor(string.Empty, string.Empty));
                if (factorSettings == null || factorSettings.Count <= 0)
                {
                    throw new Exception("系统净化槽因子配置信息获取失败！");
                }
                //监测因子
                List<MFWDictionary> dicList = new List<MFWDictionary>();
                var factorResp = FWUserMappingDictionaryBll.queryMDictionaryList(null, DictionaryTypeCodeSettings.BLLMonitorFactor);
                if (factorResp != null && factorResp.status == FWResultStatus.Success && factorResp.data != null && factorResp.data.Count > 0)
                {
                    dicList = factorResp.data;
                }
                else
                {
                    throw new Exception("系统监测因子数据获取失败！");
                }
                //净化槽数据
                List<MBLLMonitorSite> siteList = queryMonitorSiteList(userInfo, null);
                if (siteList == null || siteList.Count <= 0)
                {
                    throw new Exception("系统净化槽/设备信息获取失败！");
                }
                #endregion
                #region 数据解析


                string fileAbsolutePath = HttpContext.Current.Server.MapPath(HttpContext.Current.Request.ApplicationPath + "/" + filePath);
                DataTable dt = FWExcelUtil.getDataTableFromExcel(1, 0, fileAbsolutePath);
                if (dt != null && dt.Rows.Count > 0)
                {
                    int monitorSiteNameIx = 0;
                    int equipmentNoIx = 0;
                    int monitorFactorNameIx = 0;
                    int monitorTimeIx = 0;
                    int monitorValueIx = 0;
                    int ix = 0;
                    foreach (DataRow row in dt.Rows)
                    {
                        
                        if (ix == 0)
                        {
                            ix++;
                            //获取字段的index
                            for (int i = 0; i < row.ItemArray.Count(); i++)
                            {
                                switch (row.ItemArray[i].ToString())
                                {
                                    case "monitorSiteName": monitorSiteNameIx = i; break;
                                    case "equipmentNo": equipmentNoIx = i; break;
                                    case "monitorFactorName": monitorFactorNameIx = i; break;
                                    case "monitorTime": monitorTimeIx = i; break;
                                    case "monitorValue": monitorValueIx = i; break;
                                }
                            }
                            continue;
                        }
                        BLLMonitorSiteHisFactorData entity = new BLLMonitorSiteHisFactorData();

                        entity.createTime = DateTime.Now;
                        entity.dataSource = 3;//PC导入

                        if (string.IsNullOrEmpty(row[monitorSiteNameIx].ToString()) || string.IsNullOrEmpty(row[equipmentNoIx].ToString())
                            || string.IsNullOrEmpty(row[monitorFactorNameIx].ToString()) || string.IsNullOrEmpty(row[monitorTimeIx].ToString()) || string.IsNullOrEmpty(row[monitorValueIx].ToString()))
                        {
                            //字段数据如果为空 该行记录不操作
                            continue;
                        }
                        #region 与系统数据进行匹配

                        //根据净化槽编号 设备编号 获取主键
                        var isHit = siteEquipmentCheck(row[monitorSiteNameIx].ToString(), row[equipmentNoIx].ToString(), entity, siteList);
                        if (!isHit)
                        {
                            throw new Exception(string.Format("系统找不到对应的净化槽编号[{0}]与设备编号[{1}]信息！", row[monitorSiteNameIx], row[equipmentNoIx]));
                        }

                        if (!string.IsNullOrEmpty(row[monitorFactorNameIx].ToString()))
                        {

                            var hitList = dicList.Where(p => p.mName.Equals(row[monitorFactorNameIx].ToString()));
                            if (hitList != null && hitList.Count() == 1)
                            {
                                var factorDic = hitList.First();
                                entity.monitorFactorCode = factorDic.mCode;
                            }
                            else
                            {
                                throw new Exception(string.Format("系统找不到对应的监测因子[{0}]信息！", row[monitorFactorNameIx]));
                            }
                        }

                        #endregion

                        if (!string.IsNullOrEmpty(row[monitorTimeIx].ToString()))
                        {
                            entity.monitorTime = DateTime.Parse(row[monitorTimeIx].ToString());
                        }

                        if (!string.IsNullOrEmpty(row[monitorValueIx].ToString()))
                        {
                            entity.monitorValue = double.Parse(row[monitorValueIx].ToString());
                        }

                        #region 数据状态判断

                        MBLLMonitorSiteMonitorFactor factorSetting = factorSettings.Where(p => p.monitorFactorCode.Equals(entity.monitorFactorCode)).First();
                        if (entity.monitorValue > factorSetting.alarmUpperLimit)
                        {
                            entity.dataState = 5;
                        }
                        else if (entity.monitorValue < factorSetting.alarmLowerLimit)
                        {
                            entity.dataState = 4;
                        }
                        else
                        {
                            entity.dataState = 1;
                        }

                        #endregion

                        list.Add(entity); 
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





            List<IFWCommand> BaseCommandList = new List<IFWCommand>();
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            fwSqlTransaction.BeginTransaction();
            try
            {
                foreach (var item in list)
                {
                    BaseCommandList.Add(MBLLMonitorSiteMonitorFactorDal.insertBLLMonitorSiteHisFactorData(item));
                }
                //FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<BLLMonitorSiteRealtimeFactorData>(fwSqlTransaction, list, new List<string>() { "monitorSiteCode", "monitorFactorCode", "monitorTime" });
                result.data = (FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<BLLMonitorSiteHisFactorData>(fwSqlTransaction, list, new List<string>() { "monitorSiteCode", "monitorFactorCode", "monitorTime" }).Count > 0);
                result.status = FWResultStatus.Success;
                fwSqlTransaction.Commit();
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Failure;
                fwSqlTransaction.Rollback();
                fwSqlTransaction.Close();
            }
            return result;
        }

        /// <summary>
        /// 设备净化槽编号匹配
        /// </summary>
        /// <param name="monitorSiteName"></param>
        /// <param name="equipmentNo"></param>
        /// <param name="entity"></param>
        /// <param name="siteList"></param>
        /// <returns></returns>
        public static bool siteEquipmentCheck(string monitorSiteName, string equipmentNo, BLLMonitorSiteHisFactorData entity, List<MBLLMonitorSite> siteList)
        {
            bool result = false;
            var hitList = siteList.Where(p => p.monitorSiteName.Equals(monitorSiteName) && p.equipmentNo.Equals(equipmentNo));
            if (hitList != null && hitList.Count() >= 1)
            {
                var siteEquipment = hitList.First();
                entity.equipmentCode = siteEquipment.equipmentCode;
                entity.monitorSiteCode = siteEquipment.monitorSiteCode;
                result = true;
            }
            return result;
        }

        /// <summary>
        /// 历史监测数据新增或修改（监测数据导入后允许修改） add by songshasha 2016-12-09
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="insertEntity"></param>
        /// <returns></returns>
        public static FWResult<bool> updateMBLLMonitorSiteHisFactorData(IFWUserInfo userInfo, List<string> insertEntity)
        {
            FWResult<bool> result = new FWResult<bool>();
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            List<BLLMonitorSiteHisFactorData> insertEntityList = new List<BLLMonitorSiteHisFactorData>();
            if (insertEntity != null && insertEntity.Count > 0)
            {
                foreach (var item in insertEntity)
                {
                    BLLMonitorSiteHisFactorData entity = JsonConvert.DeserializeObject<BLLMonitorSiteHisFactorData>(item);
                    entity.createTime = System.DateTime.Now;
                    insertEntityList.Add(entity);
                }

            }
            try
            {

                fwSqlTransaction.BeginTransaction();
                FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<BLLMonitorSiteHisFactorData>(fwSqlTransaction, insertEntityList, new List<string>() { "monitorSiteCode", "equipmentCode", "monitorFactorCode", "monitorTime" }, null);
                result.data = true;
                result.status = FWResultStatus.Success;
                fwSqlTransaction.Commit();
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Failure;
                fwSqlTransaction.Rollback();
                fwSqlTransaction.Close();
            }
            return result;
        }

        #endregion

    }
}
