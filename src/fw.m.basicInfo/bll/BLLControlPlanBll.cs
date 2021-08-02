using fw.fwDal;
using fw.fwData;
using fw.fwSession;
using fw.m.basicInfo.dal;
using fw.m.basicInfo.data;
using fw.m.basicInfo.data.entity;
using fw.m.basicInfo.data.model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.basicInfo.bll
{
    public class BLLControlPlanBll
    {

        public static FWResult<FWPageData<BLLControlPlan>> queryPageData(IFWUserInfo userinfo,string name, FWPageParams pageParams)
        {
            FWResult<FWPageData<BLLControlPlan>> result = new FWResult<FWPageData<BLLControlPlan>>();
            try
            {
                result.data = ControlPlanDal.queryPageData(userinfo.userID, name, pageParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询失败");
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

       
        /// <summary>
        /// 删除方案
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public static FWResult<bool> deletePlanAndDetail(List<BLLControlPlan> entity)
        {
            FWResult<bool> result = new FWResult<bool>();
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            try
            {
                fwSqlTransaction.BeginTransaction();
                ControlPlanDal.deleteList(entity, fwSqlTransaction);
                var planCodes = entity.Select(a => a.code).ToArray<string>();
                BLLControlPlanDetailDal.deleteByPlanCodes(planCodes, fwSqlTransaction);
                fwSqlTransaction.Commit();
                result.status = FWResultStatus.Success;
                result.data = true;
            }
            catch (Exception ex)
            {
                result.infoList.Add("删除失败");
                result.status = FWResultStatus.Failure;
                result.data = false;
            }
            return result;
        }

        public static FWResult<bool> insertPlanAndDetail(IFWUserInfo userInfo,MBLLControlPlanAndDetail mEntity)
        {
            FWResult<bool> result = new FWResult<bool>();
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            try
            {
                BLLControlPlan bLLControlPlan = new BLLControlPlan();
                bLLControlPlan.code = Guid.NewGuid().ToString();
                bLLControlPlan.name = mEntity.name;
                bLLControlPlan.detail = mEntity.detail;
                bLLControlPlan.createUserId = userInfo.userID;

                BLLControlPlanDetail bLLControlPlanDetail = new BLLControlPlanDetail();
                bLLControlPlanDetail.code = Guid.NewGuid().ToString();
                bLLControlPlanDetail.planCode = bLLControlPlan.code;
                bLLControlPlanDetail.monitorType = mEntity.monitorType;
                bLLControlPlanDetail.monitorTypeContent = mEntity.monitorTypeContent;
                bLLControlPlanDetail.equipmentType = mEntity.equipmentType;
                bLLControlPlanDetail.controlCommand = mEntity.controlCommand;
                bLLControlPlanDetail.executeType = mEntity.executeType;
                bLLControlPlanDetail.executeDelayHour = mEntity.executeDelayHour;
                bLLControlPlanDetail.executeDelayMin = mEntity.executeDelayMin;
                bLLControlPlanDetail.executeDelaySec = mEntity.executeDelaySec;
                bLLControlPlanDetail.executeTime = mEntity.executeTime;
                bLLControlPlanDetail.createUserId = userInfo.userID;

                fwSqlTransaction.BeginTransaction();
                ControlPlanDal.insert(bLLControlPlan, fwSqlTransaction);
                BLLControlPlanDetailDal.insert(bLLControlPlanDetail, fwSqlTransaction);
                fwSqlTransaction.Commit();
                result.status = FWResultStatus.Success;
                result.data = true;
            }
            catch (Exception ex)
            {
                fwSqlTransaction.Rollback();
                result.status = FWResultStatus.Failure;
                result.data = false;
            }
            return result;
        }

        public static FWResult<bool> updatePlanAndDetail(IFWUserInfo userInfo, MBLLControlPlanAndDetail mEntity)
        {
            FWResult<bool> result = new FWResult<bool>();
            try
            {
                BLLControlPlan bLLControlPlan = ControlPlanDal.query(mEntity.planCode);
                bLLControlPlan.name = mEntity.name;
                bLLControlPlan.detail = mEntity.detail;
                bLLControlPlan.updateUserId = userInfo.userID;
                bLLControlPlan.updateTime = DateTime.Now;
               

                BLLControlPlanDetail bLLControlPlanDetail = BLLControlPlanDetailDal.queryByPlanCode(mEntity.planCode);
                bLLControlPlanDetail.monitorType = mEntity.monitorType;
                bLLControlPlanDetail.monitorTypeContent = mEntity.monitorTypeContent;
                bLLControlPlanDetail.equipmentType = mEntity.equipmentType;
                bLLControlPlanDetail.controlCommand = mEntity.controlCommand;
                bLLControlPlanDetail.executeType = mEntity.executeType;
                bLLControlPlanDetail.executeDelayHour = mEntity.executeDelayHour;
                bLLControlPlanDetail.executeDelayMin = mEntity.executeDelayMin;
                bLLControlPlanDetail.executeDelaySec = mEntity.executeDelaySec;
                bLLControlPlanDetail.executeTime = mEntity.executeTime;
                bLLControlPlanDetail.updateTime = DateTime.Now;
                bLLControlPlanDetail.updateUserId = userInfo.userID;

                ControlPlanDal.update(bLLControlPlan);
                BLLControlPlanDetailDal.update(bLLControlPlanDetail);

                result.status = FWResultStatus.Success;
                result.data = true;
            }
            catch (Exception ex)
            {
                result.status = FWResultStatus.Failure;
                result.data = false;
            }
            return result;
        }

        public static FWResult<MBLLControlPlanAndDetail> query(string code)
        {
            FWResult<MBLLControlPlanAndDetail> result = new FWResult<MBLLControlPlanAndDetail>();
            try
            {
                StringBuilder sbSql = new StringBuilder();
                FWSqlCommand sqlCmd = new FWSqlCommand();
                sbSql.AppendFormat(@"  SELECT 
                  a.code AS planCode
                  ,b.code AS planDetailCode
                  ,a.name
                  ,a.detail
                  ,b.monitorType
                  ,b.monitorTypeContent
                  ,CASE WHEN b.monitorType=1 THEN dbo.GetFWDicName(b.monitorTypeContent,'BLLCanton') ELSE
                    dbo.GetMonitorName(b.monitorTypeContent) END AS monitorTypeContentNames
                  ,b.equipmentType
                  ,b.controlCommand
                  ,b.executeType
                  ,b.executeDelayHour
                  ,b.executeDelayMin
                  ,b.executeDelaySec
                  ,b.executeTime
                   FROM dbo.BLLControlPlan a
                  INNER JOIN dbo.BLLControlPlanDetail b
                  ON a.code=b.planCode
                WHERE  a.isdel=0 and b.isDel=0 and a.code='{0}'", code);
                sqlCmd.CommandText = sbSql.ToString();
                result.data= FWSqlEntityToFWCommandStaticHelper.query<MBLLControlPlanAndDetail>(sqlCmd);
                result.status = FWResultStatus.Success;
            }
            catch (Exception)
            {
                result.data = new MBLLControlPlanAndDetail();
                result.status = FWResultStatus.Failure;
            }
            return result;
        }
    }
}
