using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Xml;
using fw.fwDal;
using fw.fwData;
using fw.fwSession;
using fw.m.operationMaintenance.dal;
using fw.m.operationMaintenance.data.entity;
using fw.m.operationMaintenance.data.model;

namespace fw.m.operationMaintenance.bll
{
    /// <summary>
    ///  设施分配
    /// </summary>
    public class MonitorAllocatorBll
    {

        #region 项目所属设施分配
        /// <summary>
        /// 项目所属设施分配-添加
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="operationMaintenanceContractCode"></param>
        /// <param name="insertCodeList"></param>
        /// <returns></returns>
        public static FWResult<bool> contractMonitorAddAllocator(IFWUserInfo userInfo, string operationMaintenanceContractCode, List<string> insertCodeList)
        {
            FWResult<bool> result = new FWResult<bool>();
            if (string.IsNullOrEmpty(operationMaintenanceContractCode) || insertCodeList == null || insertCodeList.Count <= 0)
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
                    MOperationMaintenanceContractMappingMonitorSite ContractMappingMonitorSite = new MOperationMaintenanceContractMappingMonitorSite();
                    ContractMappingMonitorSite.updaterID = userInfo.userID;
                    ContractMappingMonitorSite.updateTime = DateTime.Now;
                    ContractMappingMonitorSite.monitorSiteCode = insertCodeList[i];
                    ContractMappingMonitorSite.operationMaintenanceContractCode = operationMaintenanceContractCode;
                    ContractMappingMonitorSite.dataID = Guid.NewGuid().ToString();
                    ContractMappingMonitorSite.createrID = userInfo.userID;
                    ContractMappingMonitorSite.createTime = DateTime.Now;

                    BLLOperationMaintenanceContractMappingMonitorSite cEntity = OperationMaintenanceBll.convertEntity<BLLOperationMaintenanceContractMappingMonitorSite>(ContractMappingMonitorSite);
                    BaseCommandList.Add(OperationMaintenanceContractDal.insertContractMappingMonitorSite(cEntity));
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
                result.infoList.Add("项目分配设施失败！");
                result.status = FWResultStatus.Failure;
                return result;
            }
            return result;
        }


        /// <summary>
        /// 项目所属设施分配-批量删除
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="operationMaintenanceContractCode"></param>
        /// <param name="delCodeList"></param>
        /// <returns></returns>
        public static FWResult<bool> contractMonitorDelAllocatorList(IFWUserInfo userInfo, string operationMaintenanceContractCode, List<string> delCodeList)
        {
            FWResult<bool> result = new FWResult<bool>();
            if (string.IsNullOrEmpty(operationMaintenanceContractCode) || delCodeList == null || delCodeList.Count <= 0)
            {
                result.infoList.Add("参数内容不能为空！");
                return result;
            }

            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            fwSqlCommand.CommandText = string.Format(@" 
            DELETE  FROM [dbo].[BLLOperationMaintenanceContractMappingMonitorSite] WHERE  operationMaintenanceContractCode='{0}' 
            and [monitorSiteCode] in ({1}) ;DELETE FROM  BLLOperationMaintenancePersonMappingMonitorSite  WHERE monitorSiteCode in ({1})  ", FWSqlCommandStaticHelper.checkParam(operationMaintenanceContractCode),
                                                 FWSqlCommandStaticHelper.joinToSqlString(delCodeList));

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

        public static FWResult<bool> contractMonitorDelAllocator(IFWUserInfo userInfo, MOperationMaintenanceContractMappingMonitorSite entity)
        {
            FWResult<bool> result = new FWResult<bool>();
            if (entity == null || string.IsNullOrEmpty(entity.operationMaintenanceContractCode) || string.IsNullOrEmpty(entity.monitorSiteCode))
            {
                result.infoList.Add("参数内容不能为空！");
                return result;
            }
            try
            {
                FWSqlCommand fwSqlCommand = new FWSqlCommand();
                fwSqlCommand.CommandText = string.Format(@" DELETE FROM BLLOperationMaintenanceContractMappingMonitorSite  WHERE operationMaintenanceContractCode='{0}' AND monitorSiteCode='{1}';
DELETE FROM  BLLOperationMaintenancePersonMappingMonitorSite  WHERE monitorSiteCode='{1}' ",
                    FWSqlCommandStaticHelper.checkParam(entity.operationMaintenanceContractCode), FWSqlCommandStaticHelper.checkParam(entity.monitorSiteCode));
                int rCount = FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlCommand);
                result.data = (rCount >= 1);
                result.status = FWResultStatus.Success;

            }
            catch (FWException ex)
            {
                result.data = false;
                result.status = FWResultStatus.Error;
                result.infoList.Add(ex.Message);
            }
            return result;
        }

        #endregion


        #region 人员负责设施分配
        /// <summary>
        /// 运维人员所属设施分配-添加
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="operationMaintenanceContractCode"></param>
        /// <param name="insertCodeList"></param>
        /// <returns></returns>
        public static FWResult<bool> personMonitorAddAllocator(IFWUserInfo userInfo, string operationMaintenancePersonCode, List<string> insertCodeList)
        {
            FWResult<bool> result = new FWResult<bool>();
            if (string.IsNullOrEmpty(operationMaintenancePersonCode) || insertCodeList == null || insertCodeList.Count <= 0)
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
                    MBLLOperationMaintenancePersonMappingMonitorSite ContractMappingMonitorSite = new MBLLOperationMaintenancePersonMappingMonitorSite();
                    ContractMappingMonitorSite.updaterID = userInfo.userID;
                    ContractMappingMonitorSite.updateTime = DateTime.Now;
                    ContractMappingMonitorSite.monitorSiteCode = insertCodeList[i];
                    ContractMappingMonitorSite.operationMaintenancePersonCode = operationMaintenancePersonCode;
                    ContractMappingMonitorSite.dataID = Guid.NewGuid().ToString();
                    ContractMappingMonitorSite.createrID = userInfo.userID;
                    ContractMappingMonitorSite.createTime = DateTime.Now;

                    BLLOperationMaintenancePersonMappingMonitorSite cEntity = OperationMaintenanceBll.convertEntity<BLLOperationMaintenancePersonMappingMonitorSite>(ContractMappingMonitorSite);
                    BaseCommandList.Add(FWSqlEntityToFWCommandStaticHelper.insert<BLLOperationMaintenancePersonMappingMonitorSite>(cEntity));
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
                result.infoList.Add("人员分配设施失败！");
                result.status = FWResultStatus.Failure;
                return result;
            }
            return result;
        }

        /// <summary>
        /// 运维人员所属设施分配-批量删除
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="operationMaintenanceContractCode"></param>
        /// <param name="delCodeList"></param>
        /// <returns></returns>
        public static FWResult<bool> personMonitorDelAllocatorList(IFWUserInfo userInfo, string operationMaintenancePersonCode, List<string> delCodeList)
        {
            FWResult<bool> result = new FWResult<bool>();
            if (string.IsNullOrEmpty(operationMaintenancePersonCode) || delCodeList == null || delCodeList.Count <= 0)
            {
                result.infoList.Add("参数内容不能为空！");
                return result;
            }
                    
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            fwSqlCommand.CommandText = string.Format(@" 
            DELETE  FROM [dbo].[BLLOperationMaintenancePersonMappingMonitorSite] WHERE  operationMaintenancePersonCode='{0}' 
            and [monitorSiteCode] in ({1}) ;  ", FWSqlCommandStaticHelper.checkParam(operationMaintenancePersonCode), 
                                                 FWSqlCommandStaticHelper.joinToSqlString(delCodeList));
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

        /// <summary>
        /// 运维人员所属设施分配-删除
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="entity"></param>
        /// <returns></returns>
        public static FWResult<bool> personMonitorDelAllocator(IFWUserInfo userInfo, MBLLOperationMaintenancePersonMappingMonitorSite entity)
        {
            FWResult<bool> result = new FWResult<bool>();
            if (entity == null || string.IsNullOrEmpty(entity.operationMaintenancePersonCode) || string.IsNullOrEmpty(entity.monitorSiteCode))
            {
                result.infoList.Add("参数内容不能为空！");
                return result;
            }
            try
            {
                IFWCommand cmd = FWSqlEntityToFWCommandStaticHelper.delete<BLLOperationMaintenancePersonMappingMonitorSite>(
                    String.Format(" operationMaintenancePersonCode='{0}'  AND  monitorSiteCode='{1}' ",
                    FWSqlCommandStaticHelper.checkParam(entity.operationMaintenancePersonCode)
                    , FWSqlCommandStaticHelper.checkParam(entity.monitorSiteCode)), null);
                int rCount = FWSqlCommandStaticHelper.ExecuteNonQuery(cmd);
                result.data = (rCount == 1);
                result.status = FWResultStatus.Success;

            }
            catch (FWException ex)
            {
                result.data = false;
                result.status = FWResultStatus.Error;
                result.infoList.Add(ex.Message);
            }
            return result;
        }

        #endregion
    }
}
