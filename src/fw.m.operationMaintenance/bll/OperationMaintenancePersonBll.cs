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
using fw.m.sysBasicManage.data;
using fw.m.sysBasicManage.data.model;
using fw.m.sysBasicManage.service;
using fw.m.sysManage.bll;
using fw.m.sysManage.dal;
using fw.m.sysManage.data;
using fw.m.sysManage.data.entity;
using fw.m.userLogin.data.model;
using fw.m.userLogin.bll;
using fw.m.userLogin.data.entity;

namespace fw.m.operationMaintenance.bll
{
    /// <summary>
    /// 运维人员 业务逻辑
    /// </summary>
    public class OperationMaintenancePersonBll
    {
        public static void defaultEntity(IFWUserInfo userInfo, BLLOperationMaintenancePerson entity)
        {
            if (entity != null)
            {
                if (string.IsNullOrEmpty(entity.operationMaintenancePersonCode))
                {
                    entity.createrID = userInfo.userID;
                    entity.createTime = DateTime.Now;
                }
                entity.updaterID = userInfo.userID;
                entity.updateTime = DateTime.Now;
            }
        }

        #region M.运维人员新增/更新
        public static FWResult<bool> inserOrUpdateMOperationMaintenancePersonByPersonCode(IFWUserInfo userInfo, MBLLOperationMaintenancePerson mEntity)
        {

            FWResult<bool> result = new FWResult<bool>();

            List<IFWCommand> BaseCommandList = new List<IFWCommand>();
            //操作类型
            var actionType = "update";
            if (string.IsNullOrEmpty(mEntity.operationMaintenancePersonCode))
            {
                mEntity.operationMaintenancePersonCode = Guid.NewGuid().ToString();
                actionType = "insert";
                mEntity.createrID = userInfo.userID;
                mEntity.createTime = DateTime.Now;
            }
            

            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            fwSqlTransaction.BeginTransaction();
            try
            {
                #region 运维人员数据 
                var personEntity = OperationMaintenanceBll.convertEntity<BLLOperationMaintenancePerson>(mEntity);
                defaultEntity(userInfo, personEntity);
                var dbresult = OperationMaintenancePersonDal.inserOrUpdateOperationMaintenanceByPersonCode(personEntity, fwSqlTransaction);
                result.data = (dbresult.dbResultStatus == FWDBResultStatus.Success);
                #endregion 
                #region 接警项目

                //更新的话 先删除
                if (actionType == "update")
                {
                    var personCodeList = new List<string>();
                    personCodeList.Add(mEntity.operationMaintenancePersonCode);
                    BaseCommandList.Add(OperationMaintenancePersonDal.deleteOperationMaintenancePersonAlarmReceiveItemByPersonCode(
                        personCodeList));
                }
                if (mEntity.alarmReceiveTypeCodeList != null && mEntity.alarmReceiveTypeCodeList.Count > 0)
                {
                    foreach (var code in mEntity.alarmReceiveTypeCodeList)
                    {
                        var entity = new BLLOperationMaintenancePersonAlarmReceiveItem()
                        {
                            dataID = Guid.NewGuid().ToString(),
                            operationMaintenancePersonCode = mEntity.operationMaintenancePersonCode,
                            alarmReceiveTypeCode = code,
                            ix = 1,
                            createrID = userInfo.userID,
                            createTime = DateTime.Now,
                            updaterID = userInfo.userID,
                            updateTime = DateTime.Now
                        };
                        BaseCommandList.Add(OperationMaintenancePersonDal.inserOperationMaintenancePersonAlarmReceiveItem(entity));
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
                fwSqlTransaction.Rollback();
                result.infoList.Add("ex:" + ex.Message);
                result.status = FWResultStatus.Error;
                return result;
            }
            return result;

        }

        /// <summary>
        /// 更新运维人员位置
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="longitude"></param>
        /// <param name="latitude"></param>
        /// <returns></returns>
        public static FWResult<bool> updateMBLLOperationMaintenancePersonLocation(IFWUserInfo userInfo, double longitude, double latitude)
        {
            FWResult<bool> result = new FWResult<bool>();
            SysBasicManageUserInfo userSysInfo = SysBasicManageBll.getUserInfo(userInfo);
            //企业角色  默认自己单位人员
            if (userSysInfo != null && !string.IsNullOrEmpty(userSysInfo.operationMaintenancePersonCode))
            {
                FWSqlCommand fwSqlCommand = new FWSqlCommand();
                StringBuilder sbSql = new StringBuilder();
                sbSql.AppendFormat(@" 
UPDATE  [dbo].[BLLOperationMaintenancePerson]
   SET  [longitude] = @longitude
      ,[latitude] = @latitude
      ,[lastActionTime] =getDate()
  WHERE  userID=@userID ");
                fwSqlCommand.Parameters.AddWithValue("@longitude", longitude);
                fwSqlCommand.Parameters.AddWithValue("@latitude", latitude);
                fwSqlCommand.Parameters.AddWithValue("@userID", userInfo.userID);
                fwSqlCommand.CommandText = sbSql.ToString();
                try
                {
                    var resultCount = FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlCommand);
                    result.data = resultCount > 0;
                    result.status = result.data ? FWResultStatus.Success : FWResultStatus.Failure;

                }
                catch (Exception ex)
                {
                    result.data = false;
                    result.status = FWResultStatus.Failure;
                    result.infoList.Add("异常信息：" + ex.Message);
                }
            }
            else
            {
                result.data = false;
                result.status = FWResultStatus.Failure;
                result.infoList.Add("用户不是运维人员！");
            }

            return result;
        }
        #endregion

        #region 运维用户分配账号

        #region 分配用户
        public static FWResult<bool> operationsUserAllocation(IFWUserInfo userInfo, string userID, string operationMaintenancePersonCode)
        {
            FWResult<bool> result = new FWResult<bool>();
            try
            {
                //判断USERID 是否已经分配
                //设备编码
                result = MuserIDForPersonCheck(userID);
                if (result.status != FWResultStatus.Success)
                {
                    throw new Exception(result.infoList.Aggregate((pre, next) => pre + ";" + next));
                    //throw new Exception("该现场设备编码已存在!");//输出信息一致
                }

                FWSqlCommand fwSqlCommand = new FWSqlCommand();
                fwSqlCommand.CommandText = string.Format(@" UPDATE  [dbo].[BLLOperationMaintenancePerson] SET [userID]='{0}' WHERE operationMaintenancePersonCode = '{1}' ",
                    FWSqlCommandStaticHelper.checkParam(userID), FWSqlCommandStaticHelper.checkParam(operationMaintenancePersonCode));  

                result.data = (FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlCommand)==1);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Error; 
            }
            return result;
            return result;
        }
        public static FWResult<bool> operationsUserUnAllocation(IFWUserInfo userInfo, string userID )
        {
            FWResult<bool> result = new FWResult<bool>();
            try
            {
                
                FWSqlCommand fwSqlCommand = new FWSqlCommand();
                fwSqlCommand.CommandText = string.Format(@" UPDATE  [dbo].[BLLOperationMaintenancePerson] SET [userID]=null WHERE userID = '{0}' ",
                    FWSqlCommandStaticHelper.checkParam(userID) );

                result.data = (FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlCommand) == 1);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Error;
            }
            return result;
            return result;
        }

        #endregion

        /// <summary>
        /// 判断USERID 是否已经分配
        /// </summary>
        /// <param name="mEntity"></param>
        /// <returns></returns>
        public static FWResult<bool> MuserIDForPersonCheck(string userID)
        {
            FWResult<bool> result = new FWResult<bool>();
            if (string.IsNullOrEmpty(userID))
            {
                result.data = false;
                result.status = FWResultStatus.Error;
                result.infoList.Add("userID不能为空！");
                return result;
            }
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            sbSql.AppendFormat(@" 
SELECT *  FROM  [dbo].[BLLOperationMaintenancePerson]
  where isnull([isDel],0)=0   AND [userID]='{0}'   ", FWSqlCommandStaticHelper.checkParam(userID) );


            try
            {
                fwSqlCommand.CommandText = sbSql.ToString();
                var entityList = FWSqlEntityToFWCommandStaticHelper.queryList<BLLOperationMaintenancePerson>(fwSqlCommand);
                if (entityList != null && entityList.Count > 0)
                {
                    result.status = FWResultStatus.Failure;
                    result.infoList.Add("账号已分配其他人员！");
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

        #region 运维人员查询
        /// <summary>
        /// 运维单位
        /// </summary>
        /// <param name="userInfo">用户信息</param>
        /// <param name="mOperationMaintenanceUnitCode">运维单位code</param>
        /// <returns>运维单位实体</returns>
        public static FWResult<MBLLOperationMaintenancePerson> queryMOperationMaintenancePersonByPersonCode(IFWUserInfo userInfo, string mOperationMaintenancePersonCode)
        {
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            if (!string.IsNullOrEmpty(basicUserInfo.operationMaintenancePersonCode))
            {
                mOperationMaintenancePersonCode = basicUserInfo.operationMaintenancePersonCode;
            }
            FWResult<MBLLOperationMaintenancePerson> result = new FWResult<MBLLOperationMaintenancePerson>();
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            fwSqlCommand.CommandText = @" 
SELECT 
t1.[operationMaintenanceUnitCode]
,t1.[operationMaintenancePersonCode]
,t1.[operationMaintenancePersonName]
,t1.[staffNo]
,t1.[mobilePhone]
,t1.[fax]
,t1.[eMail]
,t1.[zipCode]
,t1.[address]
,t1.[rem]
,t1.[ix]
,t1.[isDis]
,t1.[createrID]
,t1.[createTime]
,t1.[updaterID]
,t1.[updateTime]
,t1.[password]
,t2.[operationMaintenanceUnitName]
,t1.userID
FROM  [dbo].[BLLOperationMaintenancePerson] t1
LEFT JOIN [dbo].[BLLOperationMaintenanceUnit] t2 ON t1.operationMaintenanceUnitCode=t2.operationMaintenanceUnitCode 
where 1=1 and  t1.[isDis]=0 and t1.[operationMaintenancePersonCode]=@operationMaintenancePersonCode";
            fwSqlCommand.Parameters.AddWithValue("operationMaintenancePersonCode", mOperationMaintenancePersonCode);

            var entity = new MBLLOperationMaintenancePerson();
            entity = FWSqlEntityToFWCommandStaticHelper.query<MBLLOperationMaintenancePerson>(fwSqlCommand);
            var request = queryMOperationMaintenancePersonAlarmReceiveTypeCodeList(userInfo, mOperationMaintenancePersonCode);
            if (request != null && request.status == FWResultStatus.Success && request.data.Count > 0)
            {
                entity.alarmReceiveTypeCodeList = request.data.Select(p => p.alarmReceiveTypeCode).ToList<string>();
            }
            result.data = entity;
            result.status = FWResultStatus.Success;
            return result;
        }

        public static FWResult<FWPageData<MBLLOperationMaintenancePerson>> queryPageMOperationMaintenancePerson(IFWUserInfo userInfo, FWPageParams pageParams, QueryMBLLOperationMaintenancePersonParams queryParams)
        {

            FWResult<FWPageData<MBLLOperationMaintenancePerson>> result = new FWResult<FWPageData<MBLLOperationMaintenancePerson>>();
            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            StringBuilder sbSql = new StringBuilder();
            sbSql.Append(@"  					
SELECT 
t1.[operationMaintenanceUnitCode]
,t1.[operationMaintenancePersonCode]
,t1.[operationMaintenancePersonName]
,t1.staffNo
,t1.[mobilePhone]
,t1.[fax]
,t1.[eMail]
,t1.[zipCode]
,t1.[address]
,t1.[rem]
,t1.[ix]
,t1.[isDis]
,t1.[createrID]
,t1.[createTime]
,t1.[updaterID]
,t1.[updateTime]
,t1.[password]
,t2.[operationMaintenanceUnitName]
,t1.UserID
FROM  [dbo].[BLLOperationMaintenancePerson] t1
LEFT JOIN [dbo].[BLLOperationMaintenanceUnit] t2 ON t1.operationMaintenanceUnitCode=t2.operationMaintenanceUnitCode
where 1=1 AND t1.[isDis]=0 ");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.keyword))
                {
                    sbSql.AppendFormat(@" and ( t1.operationMaintenancePersonName like '%{0}%' OR t1.staffNo like '%{0}%' ) ", FWSqlCommandStaticHelper.checkParam(queryParams.keyword));
                }
                if (!string.IsNullOrEmpty(queryParams.operationMaintenanceUnitCode))
                {
                    sbSql.AppendFormat(@" and t1.operationMaintenanceUnitCode ='{0}'", FWSqlCommandStaticHelper.checkParam(queryParams.operationMaintenanceUnitCode));
                }
                //任务选择人员时  根据monitorSiteCode 对人员进行过滤
                if (!string.IsNullOrEmpty(queryParams.monitorSiteCode))
                {
                    sbSql.AppendFormat(@"
and t1.[operationMaintenancePersonCode] IN (
SELECT  OMP.[operationMaintenancePersonCode]
  FROM  [dbo].[BLLOperationMaintenanceContract] OMC
  INNER JOIN  [dbo].[BLLOperationMaintenanceContractMappingMonitorSite] OMCS ON OMC.[operationMaintenanceContractCode]= OMCS.[operationMaintenanceContractCode]
  INNER JOIN  [dbo].[BLLOperationMaintenanceUnit] OMU  ON OMC.operationMaintenanceUnitCode=OMU.operationMaintenanceUnitCode
  INNER JOIN  [dbo].[BLLOperationMaintenancePerson] OMP ON OMU.operationMaintenanceUnitCode=OMP.operationMaintenanceUnitCode
  WHERE OMCS.monitorSiteCode  = '{0}'
) ", FWSqlCommandStaticHelper.checkParam(queryParams.monitorSiteCode));
                }

                //分配用户时   根据userid 进行过滤
                if (!string.IsNullOrEmpty(queryParams.pageType) && queryParams.pageType.Equals("userAllocation"))
                {
                    sbSql.AppendFormat(@" AND  t1.[userID] IS NULL  ");
                }
            }

            sbSql.Append(@" order by ");
            if (pageParams.sortFieldList != null && pageParams.sortFieldList.Count > 0)
            {
                foreach (FWSortField fwSortField in pageParams.sortFieldList)
                {
                    switch (fwSortField.fieldName)
                    {
                        case "ix":
                            fwSortField.fieldName = "t1.[ix]";
                            break;
                    }
                    sbSql.AppendFormat(@"{0} {1},", fwSortField.fieldName, fwSortField.sortType == FWSortType.Desc ? "desc" : "asc");
                }
                sbSql.Remove(sbSql.Length - 1, 1);
            }
            else
            {
                sbSql.Append(@"t1.[ix] asc ");
            }
            fwPageProcedureParams.sql = sbSql.ToString();
            result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MBLLOperationMaintenancePerson>(fwPageProcedureParams);
            result.status = FWResultStatus.Success;
            return result;
        }

        public static FWResult<List<MBLLOperationMaintenancePerson>> queryMaintenancePersonDictionaryList(IFWUserInfo userInfo, QueryMBLLOperationMaintenancePersonParams queryParams)
        {
            FWResult<List<MBLLOperationMaintenancePerson>> result = new FWResult<List<MBLLOperationMaintenancePerson>>();
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo; 
            if (!string.IsNullOrEmpty(basicUserInfo.operationMaintenanceUnitCode))
            {
                queryParams.operationMaintenanceUnitCode = basicUserInfo.operationMaintenanceUnitCode;
            }
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            StringBuilder sbSql = new StringBuilder();
            sbSql.AppendFormat(@" 
SELECT 
t1.[operationMaintenanceUnitCode]
,t1.[operationMaintenancePersonCode]
,t1.[operationMaintenancePersonName]
,t1.[staffNo]
,t1.[mobilePhone]
,t1.[fax]
,t1.[eMail]
,t1.[zipCode]
,t1.[address]
,t1.[rem]
,t1.[ix]
,t1.[isDis]
,t1.[createrID]
,t1.[createTime]
,t1.[updaterID]
,t1.[updateTime]
,t1.[password]  
FROM  [dbo].[BLLOperationMaintenancePerson] t1
where isnull(t1.[isDis],0)=0 ");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.operationMaintenancePersonCode))
                {
                    sbSql.AppendFormat(@" AND t1.operationMaintenancePersonCode=@operationMaintenancePersonCode");
                    fwSqlCommand.Parameters.AddWithValue("@operationMaintenancePersonCode", queryParams.operationMaintenancePersonCode);
                } 
                if (!string.IsNullOrEmpty(queryParams.operationMaintenanceUnitCode))
                {
                    sbSql.AppendFormat(@" AND t1.operationMaintenanceUnitCode=@operationMaintenanceUnitCode");
                    fwSqlCommand.Parameters.AddWithValue("@operationMaintenanceUnitCode", queryParams.operationMaintenanceUnitCode);
                }
                if (!string.IsNullOrEmpty(queryParams.keyword))
                {
                    sbSql.AppendFormat(@" AND t1.operationMaintenancePersonName like'%{0}%'", FWSqlCommandStaticHelper.checkParam(queryParams.keyword));
                }
                //企业点位过滤  2016.6.21
                if (!string.IsNullOrEmpty(queryParams.monitorSiteCode))
                {
                    sbSql.AppendFormat(@" AND  t1.operationMaintenanceUnitCode in  (
SELECT 
c.operationMaintenanceUnitCode
FROM  [dbo].[BLLOperationMaintenanceContractMappingMonitorSite]  cms
INNER JOIN dbo.BLLOperationMaintenanceContract  c ON cms.[operationMaintenanceContractCode]=c.[operationMaintenanceContractCode]
where   isnull(c.isdis,0)=0  and  cms.monitorSiteCode='{0}'
)  ", FWSqlCommandStaticHelper.checkParam(queryParams.monitorSiteCode));
                }
            }
            sbSql.AppendFormat(" order by t1.operationMaintenancePersonName");
            fwSqlCommand.CommandText = sbSql.ToString();
            result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MBLLOperationMaintenancePerson>(fwSqlCommand);
            result.status = FWResultStatus.Success;
            return result;
        }

        #endregion

        #region 物理删除
        public static FWResult<bool> deleteMBLLOperationMaintenancePersonByMCodeList(IFWUserInfo userInfo, List<string> operationMaintenancePersonCodeList)
        {
            FWResult<bool> result = new FWResult<bool>();
            List<IFWCommand> fwCommandList = new List<IFWCommand>();
            fwCommandList.Add(OperationMaintenancePersonDal.deleteBLLOperationMaintenancePersonByCodeList(operationMaintenancePersonCodeList));
            result.data = FWSqlCommandStaticHelper.ExecuteNonQuery(fwCommandList);
            result.status = FWResultStatus.Success;
            return result;
        }
        #endregion

        #region 更新状态
        public static FWResult<bool> updateBLLOperationMaintenanceUnitByCodeList(IFWUserInfo userInfo, MBLLOperationMaintenancePerson mEntity, List<string> operationMaintenancePersonCodeList)
        {
            FWResult<bool> result = new FWResult<bool>();
            List<IFWCommand> fwCommandList = new List<IFWCommand>();
            fwCommandList.Add(OperationMaintenancePersonDal.updateBLLOperationMaintenancePersonByCodeList(OperationMaintenanceBll.convertEntity<BLLOperationMaintenancePerson>(mEntity), operationMaintenancePersonCodeList));
            result.data = FWSqlCommandStaticHelper.ExecuteNonQuery(fwCommandList);
            result.status = FWResultStatus.Success;
            return result;
        }

        #endregion

        #region 运维人员接警项目



        #region 接警项目查询
        #endregion
        public static FWResult<List<MBLLOperationMaintenancePersonAlarmReceiveItem>> queryMOperationMaintenancePersonAlarmReceiveTypeCodeList(IFWUserInfo userInfo, string operationMaintenancePersonCode)
        {
            FWResult<List<MBLLOperationMaintenancePersonAlarmReceiveItem>> result = new FWResult<List<MBLLOperationMaintenancePersonAlarmReceiveItem>>();
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            StringBuilder sqlStringBuilder = new StringBuilder();
            sqlStringBuilder.Append(@"  
SELECT  [dataID]
      ,[operationMaintenancePersonCode]
      ,[alarmReceiveTypeCode]
      ,[ix]
      ,[createrID]
      ,[createTime]
      ,[updaterID]
      ,[updateTime]
FROM  [dbo].[BLLOperationMaintenancePersonAlarmReceiveItem]  WHERE 1<>1  ");
            if (!string.IsNullOrEmpty(operationMaintenancePersonCode))
            {
                sqlStringBuilder.AppendFormat(@" or [operationMaintenancePersonCode] ='{0}'",
                    FWSqlCommandStaticHelper.checkParam(operationMaintenancePersonCode));
            }
            fwSqlCommand.CommandText = sqlStringBuilder.ToString();
            result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MBLLOperationMaintenancePersonAlarmReceiveItem>(fwSqlCommand);
            result.status = FWResultStatus.Success;
            return result;
        }
        #endregion

        #region 第三方登陆


        public static FWResult<MBLLOperationMaintenancePerson> queryMaintenancePersonList(IFWUserInfo userInfo, QueryMBLLOperationMaintenancePersonParams queryParams)
        {
            FWResult<MBLLOperationMaintenancePerson> result = new FWResult<MBLLOperationMaintenancePerson>();
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            StringBuilder sbSql = new StringBuilder();
            sbSql.AppendFormat(@" 
SELECT 
t1.[operationMaintenanceUnitCode]
,t1.[operationMaintenancePersonCode]
,t1.[operationMaintenancePersonName]
,t1.[staffNo]
,t1.[mobilePhone]
,t1.[fax]
,t1.[eMail]
,t1.[zipCode]
,t1.[address]
,t1.[rem]
,t1.[ix]
,t1.[isDis] 
,t2.userID
,t2.userName 
FROM  [dbo].[BLLOperationMaintenancePerson] t1
INNER JOIN dbo.FWUserLogin t2 ON t1.userID=t2.userID AND t2.isDis=0
where isnull(t1.[isDis],0)=0 ");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.userName_thirdService))
                {
                    sbSql.AppendFormat(@" AND  t1.[mobilePhone]=@userName_thirdService ");
                    fwSqlCommand.Parameters.AddWithValue("@userName_thirdService", queryParams.userName_thirdService);
                }

            }
            fwSqlCommand.CommandText = sbSql.ToString();
            var entityList = FWSqlEntityToFWCommandStaticHelper.queryList<MBLLOperationMaintenancePerson>(fwSqlCommand);
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

        #region 查询运维人员
        /// <summary>
        /// 查询运维人员
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="keyWord"></param>
        /// <param name="topNum"></param>
        /// <returns></returns>
        public static FWResult<List<MBLLOperationMaintenancePersonLocation>> getMBLLOperationMaintenancePersonLocationList(IFWUserInfo userInfo, string keyWord, int? topNum)
        {
            //如果管理员  全部展示  先不厂区过滤 
            SysBasicManageUserInfo userSysInfo = SysBasicManageBll.getUserInfo(userInfo);
            FWResult<List<MBLLOperationMaintenancePersonLocation>> result = new FWResult<List<MBLLOperationMaintenancePersonLocation>>();

            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            StringBuilder sbSql = new StringBuilder();
            sbSql.AppendFormat(@" 
SELECT top {0} t1.[operationMaintenanceUnitCode]
      ,t1.[operationMaintenancePersonCode]
      ,t1.[operationMaintenancePersonName] 
      ,t2.operationMaintenanceUnitName
      ,t1.[longitude]
      ,t1.[latitude]
      ,t1.[lastActionTime]
    ,DATEDIFF(minute,[lastActionTime],getdate())  timespan
  FROM  [dbo].[BLLOperationMaintenancePerson] t1
  LEFT JOIN  dbo.BLLOperationMaintenanceUnit t2 ON t1.[operationMaintenanceUnitCode]=t2.[operationMaintenanceUnitCode]
  WHERE t1.isDis=0 AND (t1.[longitude] IS NOT NULL AND t1.[latitude] is not null) 
  ", topNum.HasValue ? (int)topNum : 10);
            if (!string.IsNullOrEmpty(keyWord))
            {
                sbSql.AppendFormat(@"  and t1.[operationMaintenancePersonName]  like '%{0}%' ",
                    FWSqlCommandStaticHelper.checkParam(keyWord));
            }
            //企业角色  默认自己单位人员
            if (userSysInfo != null && !string.IsNullOrEmpty(userSysInfo.operationMaintenanceUnitCode))
            {
                sbSql.AppendFormat(@" AND  t1.[operationMaintenanceUnitCode]='{0}' ",
                    FWSqlCommandStaticHelper.checkParam(userSysInfo.operationMaintenanceUnitCode));
            }
            sbSql.AppendFormat(" ORDER BY t1.[lastActionTime] DESC ");

            fwSqlCommand.CommandText = sbSql.ToString();
            var entityList = FWSqlEntityToFWCommandStaticHelper.queryList<MBLLOperationMaintenancePersonLocation>(fwSqlCommand);
            if (entityList != null)
            {
                result.data = entityList;
                result.status = FWResultStatus.Success;
            }
            else
            {
                result.data = null;
                result.status = FWResultStatus.Failure;
                result.infoList.Add("无法获取查询结果！");
            }

            return result;

        }

        /// <summary>
        /// 查询运维人员
        /// </summary>
        /// <param name="sysBasicManageUserInfo"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        public static FWResult<List<MBLLOperationMaintenancePerson>> queryMOperationMaintenancePersonList(IFWUserInfo sysBasicManageUserInfo, QueryMBLLOperationMaintenancePersonParams queryParams)
        {
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)sysBasicManageUserInfo;
            if (!string.IsNullOrEmpty(basicUserInfo.operationMaintenanceUnitCode))
            {
                queryParams.operationMaintenanceUnitCode = basicUserInfo.operationMaintenanceUnitCode;
            }
            if (!string.IsNullOrEmpty(basicUserInfo.operationMaintenancePersonCode))
            {
                queryParams.operationMaintenancePersonCode = basicUserInfo.operationMaintenancePersonCode;
            }
            FWResult<List<MBLLOperationMaintenancePerson>> result = new FWResult<List<MBLLOperationMaintenancePerson>>();
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            StringBuilder sqlStringBuilder = new StringBuilder();
            sqlStringBuilder.Append(@" 
SELECT 
t1.[operationMaintenanceUnitCode]
,t1.[operationMaintenancePersonCode]
,t1.[operationMaintenancePersonName]
,t1.[staffNo]
,t1.[mobilePhone]
,t1.[fax]
,t1.[eMail]
,t1.[zipCode]
,t1.[address]
,t1.[rem]
,t1.[ix]
,t1.[isDis]
,t1.[createrID]
,t1.[createTime]
,t1.[updaterID]
,t1.[updateTime] 
,'query' dataStatusTag
FROM  [dbo].[BLLOperationMaintenancePerson] t1
where 1<>1 ");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.operationMaintenanceUnitCode))
                {
                    sqlStringBuilder.AppendFormat(@" or operationMaintenanceUnitCode ='{0}'",
                        FWSqlCommandStaticHelper.checkParam(queryParams.operationMaintenanceUnitCode));
                }
            }
            fwSqlCommand.CommandText = sqlStringBuilder.ToString();
            result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MBLLOperationMaintenancePerson>(fwSqlCommand);
            result.status = FWResultStatus.Success;
            return result;
        }

        #endregion

    }
}
