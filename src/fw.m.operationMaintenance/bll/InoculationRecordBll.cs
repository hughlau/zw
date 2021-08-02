using fw.fwDal;
using fw.fwData;
using fw.fwSession;
using fw.m.Common;
using fw.m.operationMaintenance.dal;
using fw.m.operationMaintenance.data;
using fw.m.operationMaintenance.data.entity;
using fw.m.operationMaintenance.data.model;
using fw.m.sysBasicManage.data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.operationMaintenance.bll
{
    public class InoculationRecordBll
    {
        /// <summary>
        /// 分页查询接种任务
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="pageParams"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        public static FWResult<FWPageData<MBLLInoculationRecord>> queryPage(SysBasicManageUserInfo userInfo
            , FWPageParams pageParams, QueryInoculationTaskParams queryParams)
        {
            FWResult<FWPageData<MBLLInoculationRecord>> result = new FWResult<FWPageData<MBLLInoculationRecord>>();
            if (!string.IsNullOrEmpty(userInfo.operationMaintenancePersonCode))
            {
                queryParams.operationMaintenancePersonCode = userInfo.operationMaintenancePersonCode;
            }
            if (userInfo.cantonCodeList == null || userInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }
            try
            {
                FWPageData<MBLLInoculationRecord> fWPageData = InoculationRecordDal.queryByPage(userInfo, pageParams, queryParams);
                result.data = fWPageData;
                result.status = FWResultStatus.Success;
            }
            catch (Exception)
            {
                result.infoList.Add("查询出错。错误在【qqueryByPage】");
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        /// <summary>
        /// 分页查询接种任务
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="pageParams"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        public static FWResult<FWPageData<MBLLInoculationRecord>> queryStaticPage(SysBasicManageUserInfo userInfo
            , FWPageParams pageParams, QueryInoculationTaskParams queryParams)
        {
            FWResult<FWPageData<MBLLInoculationRecord>> result = new FWResult<FWPageData<MBLLInoculationRecord>>();
            if (!string.IsNullOrEmpty(userInfo.operationMaintenancePersonCode))
            {
                queryParams.operationMaintenancePersonCode = userInfo.operationMaintenancePersonCode;
            }
            if (userInfo.cantonCodeList == null || userInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }
            try
            {
                FWPageData<MBLLInoculationRecord> fWPageData = InoculationRecordDal.queryStaticByPage(userInfo, pageParams, queryParams);
                result.data = fWPageData;
                result.status = FWResultStatus.Success;
            }
            catch (Exception)
            {
                result.infoList.Add("查询出错。错误在【qqueryByPage】");
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        /// <summary>
        /// 新增、修改接种任务（非事务）
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="entity"></param>
        /// <returns></returns>
        public static FWResult<bool> insertOrUpdateInoculationRecord(IFWUserInfo userInfo,BLLInoculationRecord entity)
        {
            FWResult<bool> result = new FWResult<bool>();
            if (string.IsNullOrEmpty(entity.code))
            {
                entity.code = Guid.NewGuid().ToString();
            }
            try
            {
                entity.updateTime = DateTime.Now;
                entity.updateUserId = userInfo.userID;
                IFWDBResult fWDBResult = InoculationRecordDal.inserOrUpdateInoculation(entity,null);
                result.data = fWDBResult.dbResultStatus == FWDBResultStatus.Success;
                result.status = result.data ? FWResultStatus.Success : FWResultStatus.Failure;
            }
            catch (Exception)
            {
                result.infoList.Add("操作失败");
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        /// <summary>
        /// 新增、修改接种任务（事务）
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="entity"></param>
        /// <param name="transaction"></param>
        /// <returns></returns>
        public static FWResult<bool> insertOrUpdateInoculationRecord(IFWUserInfo userInfo, BLLInoculationRecord entity, IFWTransaction transaction)
        {
            FWResult<bool> result = new FWResult<bool>();
            if (string.IsNullOrEmpty(entity.code))
            {
                entity.code = Guid.NewGuid().ToString();
            }
            try
            {
                entity.updateTime = DateTime.Now;
                entity.updateUserId = userInfo.userID;
                IFWDBResult fWDBResult = InoculationRecordDal.inserOrUpdateInoculation(entity, transaction);
                result.data = fWDBResult.dbResultStatus == FWDBResultStatus.Success;
                result.status = result.data ? FWResultStatus.Success : FWResultStatus.Failure;
            }
            catch (Exception)
            {
                result.infoList.Add("操作失败");
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        /// <summary>
        /// 删除接种任务
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="codes">主键集合</param>
        /// <returns></returns>
        public static FWResult<bool> deleteInoculation(string ticket, string codes)
        {
            FWResult<bool> result = new FWResult<bool>();
            try
            {
                InoculationRecordDal.deleteInoculations(codes);
                result.data = true;
                result.status = FWResultStatus.Success;
            }
            catch (Exception)
            {
                result.infoList.Add("操作失败");
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        /// <summary>
        /// 按主键查询接种任务
        /// </summary>
        /// <param name="code"></param>
        /// <returns></returns>
        public static FWResult<MBLLInoculationRecord> queryByCode(string code)
        {
            FWResult<MBLLInoculationRecord> result = new FWResult<MBLLInoculationRecord>();
            try
            {
                result.data = InoculationRecordDal.queryByCode(code);
                result.status = FWResultStatus.Success;
            }
            catch (Exception)
            {
                result.infoList.Add("操作失败");
                result.status = FWResultStatus.Failure;
            }
            return result;
        }
    }
}
