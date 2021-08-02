using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using fw.fwConfig;
using fw.fwDal;
using fw.fwData;
using fw.fwSafe;
using fw.fwSession;
using fw.m.Common;
using fw.m.operationMaintenance.dal;
using fw.m.operationMaintenance.data;
using fw.m.operationMaintenance.data.entity;
using fw.m.operationMaintenance.data.model;
using fw.m.sysBasicManage.bll;
using fw.m.sysManage.bll;
using fw.m.sysManage.dal;
using fw.m.sysManage.data.entity;
using fw.m.userLogin.data.model;
using fw.m.sysBasicManage.data;
using fw.m.userLogin.bll;
using fw.m.userLogin.data.entity;

namespace fw.m.operationMaintenance.bll
{
    /// <summary>
    /// 运维单位 业务逻辑
    /// </summary>
    public class OperationMaintenanceUnitBll
    {

        public static void defaultEntity(IFWUserInfo userInfo, BLLOperationMaintenanceUnit entity)
        {
            if (entity != null)
            {
                if (string.IsNullOrEmpty(entity.operationMaintenanceUnitCode))
                {
                    entity.createrID = userInfo.userID;
                    entity.createTime = DateTime.Now;
                }
                entity.updaterID = userInfo.userID;
                entity.updateTime = DateTime.Now;
            }
        }

        #region 运维单位新增

        ///
        public static FWResult<bool> inserOrUpdateByMOperationMaintenanceUnitCode(IFWUserInfo userInfo, MBLLOperationMaintenanceUnit mEntity)
        {
            //事务开启
            FWResult<bool> result = new FWResult<bool>();

            List<IFWCommand> BaseCommandList = new List<IFWCommand>();
            //操作类型
            var actionType = "update";
            if (string.IsNullOrEmpty(mEntity.operationMaintenanceUnitCode))
            {
                mEntity.operationMaintenanceUnitCode = Guid.NewGuid().ToString();
                mEntity.createrID = userInfo.userID;
                mEntity.createTime = DateTime.Now;
                mEntity.isDis = 0;
                actionType = "insert";
            }

            #region 判断 法人代码 是否唯一
            //StringBuilder sbSql = new StringBuilder();
            //FWSqlCommand sqlCmd = new FWSqlCommand();
            //sbSql.Append(@" SELECT  1  FROM  [dbo].[BLLOperationMaintenanceUnit] WHERE [isDis]=0 AND [organizationCode]=@organizationCode ");
            //if (actionType == "update")
            //{
            //    sbSql.AppendFormat(@" AND [operationMaintenanceUnitCode] <>@operationMaintenanceUnitCode ");
            //}
            //sqlCmd.CommandText = sbSql.ToString();
            //sqlCmd.Parameters.AddWithValue("@organizationCode", mEntity.organizationCode);
            //if (actionType == "update")
            //{
            //    sqlCmd.Parameters.AddWithValue("@operationMaintenanceUnitCode", mEntity.operationMaintenanceUnitCode);
            //}
            //DataTable dt = FWSqlCommandStaticHelper.ExecuteDataTable(sqlCmd);
            //if (dt != null && dt.Rows.Count > 0)
            //{
            //    result.infoList.Add("warning:法人代码已经存在");
            //    result.status = FWResultStatus.Failure;
            //    return result;
            //}
            #endregion
            #region 判断 单位名称 是否唯一
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.Append(@" SELECT  1  FROM  [dbo].[BLLOperationMaintenanceUnit] WHERE [isDis]=0 AND [operationMaintenanceUnitName]=@operationMaintenanceUnitName ");
            if (actionType == "update")
            {
                sbSql.AppendFormat(@" AND [operationMaintenanceUnitCode] <>@operationMaintenanceUnitCode ");
            }
            sqlCmd.CommandText = sbSql.ToString();
            sqlCmd.Parameters.AddWithValue("@operationMaintenanceUnitName", mEntity.operationMaintenanceUnitName);
            if (actionType == "update")
            {
                sqlCmd.Parameters.AddWithValue("@operationMaintenanceUnitCode", mEntity.operationMaintenanceUnitCode);
            }
            DataTable dt = FWSqlCommandStaticHelper.ExecuteDataTable(sqlCmd);
            if (dt != null && dt.Rows.Count > 0)
            {
                result.infoList.Add("warning:同名单位已经存在");
                result.status = FWResultStatus.Failure;
                return result;
            }
            #endregion

            try
            { 
                var unitEntity = OperationMaintenanceBll.convertEntity<BLLOperationMaintenanceUnit>(mEntity);
                defaultEntity(userInfo, unitEntity);
                result.data = OperationMaintenanceUnitDal.inserOrUpdateByOperationMaintenanceUnitCode(unitEntity,null); 
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("ex:" + ex.Message);
                result.status = FWResultStatus.Error; 
            }
            return result;


        }
        public static FWResult<bool> inserOrUpdateByOperationMaintenanceUnitCode(IFWUserInfo userInfo, BLLOperationMaintenanceUnit entity, IFWTransaction transaction)
        {
            FWResult<bool> result = new FWResult<bool>();
            defaultEntity(userInfo, entity);
            entity.isDis = entity.isDis.HasValue ? entity.isDis : 0;
            result.data = OperationMaintenanceUnitDal.inserOrUpdateByOperationMaintenanceUnitCode(entity, transaction);
            result.status = FWResultStatus.Success;
            return result;
        }
        #endregion

        #region 运维单位查询
        /// <summary>
        /// 运维单位
        /// </summary>
        /// <param name="userInfo">用户信息</param>
        /// <param name="mOperationMaintenanceUnitCode">运维单位code</param>
        /// <returns>运维单位实体</returns>
        public static FWResult<MBLLOperationMaintenanceUnit> queryByMOperationMaintenanceUnitCode(IFWUserInfo userInfo, string mOperationMaintenanceUnitCode)
        {
            FWResult<MBLLOperationMaintenanceUnit> result = new FWResult<MBLLOperationMaintenanceUnit>();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            fwSqlCommand.CommandText = @" 
SELECT  t1.[operationMaintenanceUnitCode],t1.[operationMaintenanceUnitName],t1.[photo],t1.[cantonCode]
,t1.[organizationCode],t1.[legalPerson],t1.[contactPerson],t1.[mobilePhone]
,t1.[fax],t1.[eMail],t1.[zipCode],t1.[address],t1.[rem],t1.[isDis],t1.[createrID]
,t1.[createTime],t1.[updaterID],t1.[updateTime] ,t1.userID ,t1.[password],t1.[photoUrl],t1.unitManagerID,t2.userName AS unitManagerName
FROM  [dbo].[BLLOperationMaintenanceUnit] t1
INNER JOIN dbo.FWUserLogin t2
ON t1.unitManagerID=t2.userID
where 1=1 and t1.[operationMaintenanceUnitCode]=@operationMaintenanceUnitCode";
            fwSqlCommand.Parameters.AddWithValue("operationMaintenanceUnitCode", mOperationMaintenanceUnitCode);

            //Roger 2016/6/1 13:00:02 增加管辖区域
            fwSqlCommand.CommandText += " and (" + SysBasicManageBll.CartonToStr("t1.cantonCode", basicUserInfo.cantonCodeList) + ")";


            result.data = FWSqlEntityToFWCommandStaticHelper.query<MBLLOperationMaintenanceUnit>(fwSqlCommand);
            result.status = FWResultStatus.Success;
            return result;
        }


        /// <summary>
        /// 运维单位
        /// </summary>
        /// <param name="userInfo">用户信息</param>
        /// <param name="mOperationMaintenanceUnitCode">运维单位code</param>
        /// <returns>运维单位实体</returns>
        public static FWResult<List<MBLLOperationMaintenanceUnit>> queryOperationMaintenanceUnit(IFWUserInfo userInfo, string mOperationMaintenanceUnitCode)
        {
            FWResult<List<MBLLOperationMaintenanceUnit>> result = new FWResult<List<MBLLOperationMaintenanceUnit>>();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            fwSqlCommand.CommandText = @" 
SELECT  t1.[operationMaintenanceUnitCode],t1.[operationMaintenanceUnitName], t1.[cantonCode],t1.[organizationCode],t1.[legalPerson],t1.[contactPerson],t1.[mobilePhone],t1.[fax],t1.[eMail],t1.[zipCode],t1.[address],t1.[rem],t1.[isDis],t1.[createrID],t1.[createTime],t1.[updaterID],t1.[updateTime] ,t1.userID ,t1.[password]
FROM  [dbo].[BLLOperationMaintenanceUnit] t1
where 1=1 ";
            if (!string.IsNullOrEmpty(mOperationMaintenanceUnitCode))
            {
                fwSqlCommand.CommandText += " and t1.[operationMaintenanceUnitCode]=@operationMaintenanceUnitCode";
                fwSqlCommand.Parameters.AddWithValue("operationMaintenanceUnitCode", mOperationMaintenanceUnitCode);
            }

            //Roger 2016/6/1 13:00:02 增加管辖区域
            fwSqlCommand.CommandText += " and (" + SysBasicManageBll.CartonToStr("t1.cantonCode", basicUserInfo.cantonCodeList) + ")";


            result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MBLLOperationMaintenanceUnit>(fwSqlCommand);
            result.status = FWResultStatus.Success;
            return result;
        }


        public static FWResult<FWPageData<MBLLOperationMaintenanceUnit>> queryPageOperationMaintenanceUnit(IFWUserInfo userInfo, FWPageParams pageParams, QueryMBLLOperationMaintenanceUnitParams queryParams)
        {
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            if (!string.IsNullOrEmpty(basicUserInfo.operationMaintenanceUnitCode))
            {
                queryParams.operationMaintenanceUnitCode = basicUserInfo.operationMaintenanceUnitCode;
            }

            FWResult<FWPageData<MBLLOperationMaintenanceUnit>> result = new FWResult<FWPageData<MBLLOperationMaintenanceUnit>>();

            //Roger 2016/6/1 13:00:02 增加管辖区域
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
SELECT  t1.[operationMaintenanceUnitCode],t1.[operationMaintenanceUnitName],t1.[photo],t1.[cantonCode],t1.[organizationCode],t1.[legalPerson],t1.[contactPerson],t1.[mobilePhone],t1.[fax],t1.[eMail],t1.[zipCode],t1.[address],t1.[rem],t1.[isDis],t1.[createrID],t1.[createTime],t1.[updaterID],t1.[updateTime],t2.[name] cantonName ,t1.userID,t1.[password]
FROM  [dbo].[BLLOperationMaintenanceUnit] t1 
LEFT JOIN  [dbo].[FWDictionary] t2  ON t1.cantonCode=t2.[code] AND    t2.[dictionaryTypeCode]='BLLCanton'  AND t2.isdis=0
where t1.[isDis]=0  ");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.keyword))
                {
                    sbSql.AppendFormat(@" and t1.operationMaintenanceUnitName like '%{0}%'", FWSqlCommandStaticHelper.checkParam(queryParams.keyword));
                }
                if (!string.IsNullOrEmpty(queryParams.cantonCode))
                {
                    sbSql.AppendFormat(@" and t1.cantonCode in ( select cantoncode from [fn_getSubCanton_Dic]('{0}') ) ", FWSqlCommandStaticHelper.checkParam(queryParams.cantonCode));
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
                        case "organizationCode":
                            fwSortField.fieldName = "t1.[organizationCode]";
                            break;
                    }
                    sbSql.AppendFormat(@"{0} {1},", fwSortField.fieldName, fwSortField.sortType == FWSortType.Desc ? "desc" : "asc");
                }
                sbSql.Remove(sbSql.Length - 1, 1);
            }
            else
            {
                sbSql.Append(@"t1.[createTime] desc ");
            }
            fwPageProcedureParams.sql = sbSql.ToString();
            result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MBLLOperationMaintenanceUnit>(fwPageProcedureParams);
            result.status = FWResultStatus.Success;
            return result;
        }

        public static FWResult<List<MBLLOperationMaintenanceUnit>> queryMaintenanceUnitDictionaryList(SysBasicManageUserInfo userInfo, QueryContractParams queryParams)
        {
            FWResult<List<MBLLOperationMaintenanceUnit>> result = new FWResult<List<MBLLOperationMaintenanceUnit>>();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            SysBasicManageUserInfo basicUserInfo = userInfo;
            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@"SELECT operationMaintenanceUnitCode,operationMaintenanceUnitName,cantonCode,canton.name,MaintenanceUnit.[password]
 FROM dbo.BLLOperationMaintenanceUnit MaintenanceUnit WITH(NOLOCK)
 LEFT JOIN dbo.FWDictionary canton ON MaintenanceUnit.cantonCode=canton.code AND canton.pCode='CantonCode'
where isnull(MaintenanceUnit.isDis,0)=0 ");

            //Roger 2016/6/1 13:00:02 增加管辖区域
            sbSql.AppendFormat(@" AND ({0})  ", SysBasicManageBll.CartonToStr("cantonCode", basicUserInfo.cantonCodeList));


            sqlCmd.CommandText = sbSql.ToString();
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MBLLOperationMaintenanceUnit>(sqlCmd);
                result.status = FWResultStatus.Success;
            }
            catch
            {
                result.infoList.Add("查询失败。错误在【queryMaintenanceUnitDictionaryList】");
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        #endregion

        #region 物理删除

        public static FWResult<bool> deleteBLLOperationMaintenanceUnitByCodeList(IFWUserInfo userInfo, List<string> operationMaintenanceUnitCodeList)
        {
            FWResult<bool> result = new FWResult<bool>();
            List<IFWCommand> fwCommandList = new List<IFWCommand>();
            fwCommandList.Add(OperationMaintenanceUnitDal.deleteBLLOperationMaintenanceUnitByCodeList(operationMaintenanceUnitCodeList));
            result.data = FWSqlCommandStaticHelper.ExecuteNonQuery(fwCommandList);
            result.status = FWResultStatus.Success;
            return result;
        }
        #endregion

        #region 更新状态
        public static FWResult<bool> updateBLLOperationMaintenanceUnitByCodeList(IFWUserInfo userInfo, MBLLOperationMaintenanceUnit mEntity, List<string> operationMaintenanceUnitCodeList)
        {
            FWResult<bool> result = new FWResult<bool>();
            List<IFWCommand> fwCommandList = new List<IFWCommand>();
            fwCommandList.Add(OperationMaintenanceUnitDal.updateBLLOperationMaintenanceUnitByCodeList(OperationMaintenanceBll.convertEntity<BLLOperationMaintenanceUnit>(mEntity), operationMaintenanceUnitCodeList));
            result.data = FWSqlCommandStaticHelper.ExecuteNonQuery(fwCommandList);
            result.status = FWResultStatus.Success;
            return result;
        }

        #endregion

        #region 第三方登陆


        public static FWResult<MBLLOperationMaintenanceUnit> queryOperationMaintenanceUnitList(IFWUserInfo userInfo, QueryMBLLOperationMaintenanceUnitParams queryParams)
        {
            FWResult<MBLLOperationMaintenanceUnit> result = new FWResult<MBLLOperationMaintenanceUnit>();
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            StringBuilder sbSql = new StringBuilder();
            sbSql.AppendFormat(@" 
SELECT 
t1.[operationMaintenanceUnitCode]
,t1.[operationMaintenanceUnitName]
,t1.[photo]
,t1.[cantonCode]
,t1.[organizationCode]
,t1.[legalPerson]
,t1.[contactPerson]
,t1.[mobilePhone]
,t1.[fax]
,t1.[eMail]
,t1.[zipCode]
,t1.[address]
,t1.[rem]
,t1.[isDis] 
,t1.[userID]
,t2.userName 
FROM  [dbo].[BLLOperationMaintenanceUnit] t1
INNER JOIN dbo.FWUserLogin t2 ON t1.userID=t2.userID AND t2.isDis=0
where isnull(t1.[isDis],0)=0 ");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.userName_thirdService))
                {
                    sbSql.AppendFormat(@" AND  t1.[organizationCode]=@userName_thirdService ");
                    fwSqlCommand.Parameters.AddWithValue("@userName_thirdService", queryParams.userName_thirdService);
                }

            }
            fwSqlCommand.CommandText = sbSql.ToString();
            var entityList = FWSqlEntityToFWCommandStaticHelper.queryList<MBLLOperationMaintenanceUnit>(fwSqlCommand);
            if (entityList == null || entityList.Count < 1)
            {
                result.data = null;
                result.status = FWResultStatus.Failure;
                result.infoList.Add("登录信息无效！");
            }
            else if (entityList.Count > 1)
            {
                result.data = null;
                result.status = FWResultStatus.Failure;
                result.infoList.Add("登录信息重复，请联系管理员！");
            }
            else
            {
                result.data = entityList[0];
                result.status = FWResultStatus.Success;
            }
            return result;
        }

        #endregion

    }
}
