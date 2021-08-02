using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwData;
using fw.m.operationMaintenance.data.model;
using fw.m.sysBasicManage.data;
using fw.m.operationMaintenance.data;
using fw.fwDal;
using System.Data;
using fw.m.operationMaintenance.data.entity;
using fw.m.operationMaintenance.dal;
using fw.fwConfig;
using fw.fwSession;
using fw.m.sysBasicManage.bll;

namespace fw.m.operationMaintenance.bll
{
    public class OperationMaintenanceContractBll
    {
        #region 查询运维项目
        /// <summary>
        /// 查询运维项目
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="pageParams"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        public static FWResult<FWPageData<MOperationMaintenanceContract>> queryPageMaintenanceContract(IFWUserInfo userInfo, FWPageParams pageParams, QueryContractParams queryParams)
        {
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            if (!string.IsNullOrEmpty(basicUserInfo.operationMaintenanceUnitCode))
            {
                queryParams.operationMaintenanceUnitCode = basicUserInfo.operationMaintenanceUnitCode;
            }

            FWResult<FWPageData<MOperationMaintenanceContract>> result = new FWResult<FWPageData<MOperationMaintenanceContract>>();
            StringBuilder sqlbuilder = new StringBuilder();
            sqlbuilder.AppendFormat(@"
SELECT MaintenanceContract.id
,MaintenanceContract.operationMaintenanceContractCode
,MaintenanceContract.operationMaintenanceContractName
,MaintenanceContract.[contractNo]
,MaintenanceContract.[cantonCode]
,MaintenanceContract.effectiveTime
,MaintenanceContract.failTime
,MaintenanceContract.operationMaintenanceUnitCode
,MaintenanceUnit.operationMaintenanceUnitName 
,MaintenanceContract.rem
,MaintenanceContract.isDis
,MaintenanceContract.createrID
,MaintenanceContract.createTime
,MaintenanceContract.updaterID
,MaintenanceContract.updateTime
,canton.name cantonName
 FROM dbo.BLLOperationMaintenanceContract  MaintenanceContract  
 LEFT JOIN dbo.BLLOperationMaintenanceUnit MaintenanceUnit   ON MaintenanceContract.operationMaintenanceUnitCode=MaintenanceUnit.operationMaintenanceUnitCode
LEFT JOIN dbo.FWDictionary canton ON MaintenanceContract.cantonCode=canton.code AND canton.dictionaryTypeCode='{0}'
 WHERE ISNULL(MaintenanceContract.isDel,0)=0 AND ISNULL(MaintenanceUnit.isDis,0)=0  ", DictionaryTypeCodeSettings.BLLCanton);
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.keyword))
                {
                    sqlbuilder.AppendFormat(@" AND ( MaintenanceContract.operationMaintenanceContractName like'%{0}%' or MaintenanceContract.contractNo like'%{0}%' )", FWSqlCommandStaticHelper.checkParam(queryParams.keyword));
                }
                if (!string.IsNullOrEmpty(queryParams.operationMaintenanceUnitCode))
                {
                    sqlbuilder.AppendFormat(@" AND MaintenanceContract.operationMaintenanceUnitCode='{0}'", FWSqlCommandStaticHelper.checkParam(queryParams.operationMaintenanceUnitCode));
                }
                if (!string.IsNullOrEmpty(queryParams.cantonCode))
                {
                    sqlbuilder.AppendFormat(@" AND MaintenanceContract.[cantonCode] like '{0}%'", FWSqlCommandStaticHelper.checkParam(queryParams.cantonCode));
                }
            }
            sqlbuilder.AppendFormat(" order by contractNo ");
            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MOperationMaintenanceContract>(fwPageProcedureParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message.ToString());
                result.status = FWResultStatus.Error;
            }
            return result;
        }

        /// <summary>
        /// 查询运维项目
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        public static FWResult<List<MOperationMaintenanceContract>> queryMaintenanceContract(IFWUserInfo userInfo, QueryContractParams queryParams)
        {
            FWResult<List<MOperationMaintenanceContract>> result = new FWResult<List<MOperationMaintenanceContract>>();
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@"
SELECT MaintenanceContract.id
,MaintenanceContract.operationMaintenanceContractCode
,MaintenanceContract.operationMaintenanceContractName
,MaintenanceContract.[contractNo]
,MaintenanceContract.[cantonCode]
,MaintenanceContract.effectiveTime
,MaintenanceContract.failTime
,MaintenanceContract.operationMaintenanceUnitCode
,MaintenanceUnit.operationMaintenanceUnitName 
,MaintenanceContract.rem
,MaintenanceContract.isDis
,MaintenanceContract.createrID
,MaintenanceContract.createTime
,MaintenanceContract.updaterID
,MaintenanceContract.updateTime
,canton.name cantonName
 FROM dbo.BLLOperationMaintenanceContract  MaintenanceContract  
 LEFT JOIN dbo.BLLOperationMaintenanceUnit MaintenanceUnit   ON MaintenanceContract.operationMaintenanceUnitCode=MaintenanceUnit.operationMaintenanceUnitCode
LEFT JOIN dbo.FWDictionary canton ON MaintenanceContract.cantonCode=canton.code AND canton.dictionaryTypeCode='{0}'
 WHERE ISNULL(MaintenanceContract.isDel,0)=0 AND ISNULL(MaintenanceUnit.isDis,0)=0  ", DictionaryTypeCodeSettings.BLLCanton);
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.operationMaintenanceContractCode))
                {
                    sbSql.AppendFormat(@" AND MaintenanceContract.operationMaintenanceContractCode='{0}'", queryParams.operationMaintenanceContractCode);
                }
            }
            sqlCmd.CommandText = sbSql.ToString();
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MOperationMaintenanceContract>(sqlCmd);
                if (result.data != null && result.data.Count > 0)
                {
                    foreach (MOperationMaintenanceContract MaintenanceContract in result.data)
                    {
                        MaintenanceContract.contractMappingMonitorSiteList = queryContractMappingMonitorSiteList(MaintenanceContract.operationMaintenanceContractCode);
                    }
                }
                result.status = FWResultStatus.Success;
            }
            catch
            {
                result.infoList.Add("查询出错。错误在【queryMaintenanceContract】");
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        /// <summary>
        /// 查询运维项目
        /// </summary>
        /// <param name="operationMaintenanceContractCode"></param>
        /// <returns></returns>
        public static List<MOperationMaintenanceContractMappingMonitorSite> queryContractMappingMonitorSiteList(string operationMaintenanceContractCode)
        {
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@"  SELECT  monitorSite.monitorSiteName,monitorSite.cantonCode,dictionary.name cantonName
 ,ContractMappingMonitorSite.dataID,ContractMappingMonitorSite.operationMaintenanceContractCode
 ,ContractMappingMonitorSite.monitorSiteCode,ContractMappingMonitorSite.createrID
 ,ContractMappingMonitorSite.createTime,ContractMappingMonitorSite.updaterID,ContractMappingMonitorSite.updateTime 
 FROM dbo.BLLOperationMaintenanceContractMappingMonitorSite ContractMappingMonitorSite
 LEFT JOIN dbo.BLLMonitorSite monitorSite ON monitorSite.monitorSiteCode = ContractMappingMonitorSite.monitorSiteCode
 LEFT JOIN dbo.FWDictionary dictionary ON monitorSite.cantonCode=dictionary.code AND dictionary.dictionaryTypeCode='BLLCanton'
where 1=1 ");
            if (!string.IsNullOrEmpty(operationMaintenanceContractCode))
            {
                sbSql.AppendFormat(@" and operationMaintenanceContractCode=@operationMaintenanceContractCode");
                sqlCmd.Parameters.AddWithValue("@operationMaintenanceContractCode", operationMaintenanceContractCode);
            }
            sbSql.AppendFormat(@"  ORDER BY monitorSite.cantonCode");
            sqlCmd.CommandText = sbSql.ToString();
            return FWSqlEntityToFWCommandStaticHelper.queryList<MOperationMaintenanceContractMappingMonitorSite>(sqlCmd);
        }

        #endregion

        #region 项目新增/修改

        public static FWResult<bool> inserOrUpdateMOperationMaintenanceContract(IFWUserInfo userInfo, MOperationMaintenanceContract mEntity)
        {
            FWResult<bool> result = new FWResult<bool>();
            try
            {
                if (mEntity != null)
                {
                    if (string.IsNullOrEmpty(mEntity.operationMaintenanceContractCode))
                    {
                        mEntity.operationMaintenanceContractCode = Guid.NewGuid().ToString();
                        mEntity.isDis = 0;
                        mEntity.createrID = userInfo.userID;
                        mEntity.createTime = DateTime.Now;
                    }
                    mEntity.updaterID = userInfo.userID;
                    mEntity.updateTime = DateTime.Now;
                }
                result = inserOrUpdateOperationMaintenanceContract(userInfo, OperationMaintenanceBll.convertEntity<BLLOperationMaintenanceContract>(mEntity), null);
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Error;
            }
            return result;
        }
        public static FWResult<bool> inserOrUpdateOperationMaintenanceContract(IFWUserInfo userInfo, BLLOperationMaintenanceContract entity, IFWTransaction transaction)
        {
            FWResult<bool> result = new FWResult<bool>();
            var dbresult = OperationMaintenanceContractDal.inserOrUpdateOperationMaintenanceContract(entity, transaction);
            result.data = (dbresult.dbResultStatus == FWDBResultStatus.Success);
            result.status = FWResultStatus.Success;
            return result;
        }

        #endregion

        #region 项目删除

        public static FWResult<bool> deleteMContractByCodeList(IFWUserInfo userInfo, List<string> contractCodeList)
        {
            FWResult<bool> result = new FWResult<bool>();
            if (contractCodeList == null || contractCodeList.Count <= 0)
            {
                result.data = false;
                result.status = FWResultStatus.Failure;
                result.infoList.Add("参数 contractCodeList 不能为空！");
                return result;
            }
            var cmdList = OperationMaintenanceContractDal.deleteMContractByCodeList(contractCodeList);
            try
            {
                result.data = FWSqlCommandStaticHelper.ExecuteNonQuery(cmdList) > 0;
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

    }
}
