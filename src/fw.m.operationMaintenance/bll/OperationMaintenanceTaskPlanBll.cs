using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwData;
using fw.fwDal;
using fw.m.Common;
using fw.m.basicInfo.data.entity;
using fw.m.sysBasicManage.data;
using fw.m.operationMaintenance.data.model;
using fw.m.operationMaintenance.data;
using fw.m.operationMaintenance.data.entity;
using fw.m.operationMaintenance.dal;
using fw.m.sysBasicManage.bll;
using fw.fwSession;
using fw.fwArcGIS;
using System.Data;
using fw.m.sysManage.bll;
using fw.m.sysManage.data.model;

namespace fw.m.operationMaintenance.bll
{
    public class OperationMaintenanceTaskPlanBll : MBaseBll
    {
        #region 计划保存

        //查看对应计划数据
        public static FWResult<FWPageData<QueryTaskPlan>> queryPageMaintenanceTaskPlan(IFWUserInfo userInfo, FWPageParams pageParams, QueryTaskPlan queryParams)
        {
            SysBasicManageUserInfo user = (SysBasicManageUserInfo)userInfo;
            //
            FWResult<FWPageData<QueryTaskPlan>> result = new FWResult<FWPageData<QueryTaskPlan>>();
            StringBuilder sqlbuilder = new StringBuilder();
            sqlbuilder.AppendFormat(@" 
select 
t.operationMaintenanceTaskPlanId
, t.operationMaintenanceTaskPlanName
, remark
,CASE planType WHEN 0 THEN '常规巡检' ELSE '' END planType
,d.operationMaintenanceUnitName
, n.operationMaintenancePersonName
,m.userName, t.createTime 
from BLLOperationMaintenanceTaskPlan t
LEFT JOIN  dbo.BLLOperationMaintenanceUnit d ON t.operationMaintenanceUnitCode = d.operationMaintenanceUnitCode
 LEFT JOIN dbo.BLLOperationMaintenancePerson n  ON  t.operationMaintenancePersonCode = n.operationMaintenancePersonCode
 LEFT JOIN dbo.FWUserLogin m  ON  t.createrID = m.userID
WHERE   ISNULL(t.isValid,0) = 1 ");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.keyword))
                {
                    sqlbuilder.AppendFormat(@" AND t.operationMaintenanceTaskPlanName like'%{0}%'", FWSqlCommandStaticHelper.checkParam(queryParams.keyword));
                }
                if (!string.IsNullOrEmpty(queryParams.operationMaintenanceUnitCode))
                {
                    sqlbuilder.AppendFormat(@" AND d.operationMaintenanceUnitCode='{0}'", queryParams.operationMaintenanceUnitCode);
                }
            } 
            sqlbuilder.Append(@" order by t.createTime desc");
            //
            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<QueryTaskPlan>(fwPageProcedureParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询监测点列表出错。错误在：【queryPageMaintenanceTaskPlan】" + ex.Message);
            }
            return result;
        }

        //保存计划
        public static FWResult<bool> saveTaskPlan(IFWUserInfo userInfo, MBLLOperationMaintenanceTaskPlan mEntity)
        {
            //
            FWResult<bool> fwResult = new FWResult<bool>();
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            var BllEntity = OperationMaintenanceBll.convertEntity<BLLOperationMaintenanceTaskPlan>(mEntity);
            //
            try
            {
                //保存数据主表
                DateTime opTime = GetDBDate();
                string taskPlanCode = GetDBGuid();
                //事务开始
                fwSqlTransaction.BeginTransaction();
                //
                BLLOperationMaintenancePerson person =
                    bllQuerry<BLLOperationMaintenancePerson>(
                        "select * from BLLOperationMaintenancePerson where operationMaintenancePersonCode = '" +
                        BllEntity.operationMaintenancePersonCode + "'");
                //获取定义流程信息
                switch (BllEntity.frequencyType)
                {
                    case 0:
                        BllEntity.remark = "每月" + BllEntity.startDay + "号至" + BllEntity.endDay + "号";
                        break;
                    case 1:
                        BllEntity.remark = "每年" + BllEntity.startMonth + "月" + BllEntity.startDay + "号至" + BllEntity.endMonth + "月" + BllEntity.endDay + "号";
                        break;
                }
                BllEntity.operationMaintenanceUnitCode = person.operationMaintenanceUnitCode;
                BllEntity.operationMaintenanceTaskPlanId = taskPlanCode;
                BllEntity.createrID = userInfo.userID;
                BllEntity.createTime = opTime;
                BllEntity.updaterID = userInfo.userID;
                BllEntity.updateTime = opTime;
                //
                var dealResult = baseInsert(BllEntity, fwSqlTransaction);
                if (dealResult != 1)
                {
                    fwSqlTransaction.Rollback();
                    fwSqlTransaction.Close();
                    //
                    fwResult.data = false;
                    fwResult.infoList.Add("保存主数据失败！");
                    fwResult.status = FWResultStatus.Error;
                    return fwResult;
                }
                //获取人员对应的点
                List<BLLOperationMaintenancePersonMappingMonitorSite> listPersonSite =
                    bllListQuerry<BLLOperationMaintenancePersonMappingMonitorSite>(
                        "select * from BLLOperationMaintenancePersonMappingMonitorSite where operationMaintenancePersonCode = '" +
                        BllEntity.operationMaintenancePersonCode + "'");
                List<BLLOperationMaintenanceTaskPlanD> listTaskPlanD = new List<BLLOperationMaintenanceTaskPlanD>();
                foreach (BLLOperationMaintenancePersonMappingMonitorSite personSite in listPersonSite)
                {
                    BLLOperationMaintenanceTaskPlanD entity = new BLLOperationMaintenanceTaskPlanD();
                    entity.operationMaintenanceTaskPlanDId = GetDBGuid();
                    entity.operationMaintenanceTaskPlanId = taskPlanCode;
                    entity.monitorSiteCode = personSite.monitorSiteCode;
                    entity.isValid = 1;
                    entity.createrID = userInfo.userID;
                    entity.createTime = opTime;
                    entity.updaterID = userInfo.userID;
                    entity.updateTime = opTime;
                    //
                    listTaskPlanD.Add(entity);
                }
                dealResult = baseListInsert(listTaskPlanD, fwSqlTransaction);
                if (dealResult != 1)
                {
                    fwSqlTransaction.Rollback();
                    fwSqlTransaction.Close();
                    //
                    fwResult.data = false;
                    fwResult.infoList.Add("明细数据保存失败！");
                    fwResult.status = FWResultStatus.Error;
                    return fwResult;
                }
                //
                fwSqlTransaction.Commit();
                fwSqlTransaction.Close();
                //
                fwResult.data = true;
                fwResult.infoList.Add("保存成功！");
                fwResult.status = FWResultStatus.Success;
                return fwResult;
            }
            catch (Exception ex)
            {
                fwSqlTransaction.Rollback();
                fwSqlTransaction.Close();
                //
                fwResult.data = false;
                fwResult.infoList.Add(ex.Message);
                fwResult.status = FWResultStatus.Failure;
                return fwResult;
            }
        }

        //查询计划
        public static FWResult<QueryTaskPlanMain> queryTaskPlan(IFWUserInfo userInfo, string taskPlanCode)
        {
            SysBasicManageUserInfo user = (SysBasicManageUserInfo) userInfo;
            //
            FWResult<QueryTaskPlanMain> result = new FWResult<QueryTaskPlanMain>();
            StringBuilder sqlbuilder = new StringBuilder();
            sqlbuilder.AppendFormat(@"SELECT operationMaintenanceTaskPlanId, operationMaintenanceTaskPlanName, frequencyType, 
		                                    startDay startDay1, endDay endDay1, startMonth, startDay startDay2, endMonth, endDay endDay2,
		                                    operationMaintenanceUnitCode, operationMaintenancePersonCode, planType
                                      FROM dbo.BLLOperationMaintenanceTaskPlan 
                                     WHERE isValid = 1 ");
            if (!string.IsNullOrEmpty(taskPlanCode))
            {
                sqlbuilder.AppendFormat(@" and operationMaintenanceTaskPlanId = '{0}'", taskPlanCode);
            } 
            try
            {
                result.data = bllQuerry<QueryTaskPlanMain>(sqlbuilder.ToString());
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询监测点列表出错。错误在：【queryTaskPlan】" + ex.Message);
            }
            return result;
        }

        //更新
        public static FWResult<bool> updateTaskPlan(IFWUserInfo userInfo, MBLLOperationMaintenanceTaskPlan mEntity)
        {
            //
            FWResult<bool> fwResult = new FWResult<bool>();
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            var BllEntity = OperationMaintenanceBll.convertEntity<BLLOperationMaintenanceTaskPlan>(mEntity);
            //
            try
            {
                //保存数据主表
                DateTime opTime = GetDBDate();
                //事务开始
                fwSqlTransaction.BeginTransaction();
                //
                BLLOperationMaintenancePerson person =
                    bllQuerry<BLLOperationMaintenancePerson>(
                        "select * from BLLOperationMaintenancePerson where operationMaintenancePersonCode = '" +
                        BllEntity.operationMaintenancePersonCode + "'");
                //获取定义流程信息
                switch (BllEntity.frequencyType)
                {
                    case 0:
                        BllEntity.remark = "每月" + BllEntity.startDay + "号至" + BllEntity.endDay + "号";
                        break;
                    case 1:
                        BllEntity.remark = "每年" + BllEntity.startMonth + "月" + BllEntity.startDay + "号至" +
                                           BllEntity.endMonth + "月" + BllEntity.endDay + "号";
                        break;
                }
                BllEntity.operationMaintenanceUnitCode = person.operationMaintenanceUnitCode;
                BllEntity.updaterID = userInfo.userID;
                BllEntity.updateTime = opTime;
                //
                var dicWhere = new Dictionary<string, string>();
                dicWhere.Add("operationMaintenanceTaskPlanId", BllEntity.operationMaintenanceTaskPlanId);
                var dealResult = baseUpdate(BllEntity, dicWhere, fwSqlTransaction);
                if (dealResult != 1)
                {
                    fwSqlTransaction.Rollback();
                    fwSqlTransaction.Close();
                    //
                    fwResult.data = false;
                    fwResult.infoList.Add("更新主数据失败！");
                    fwResult.status = FWResultStatus.Error;
                    return fwResult;
                }
                //
                fwSqlTransaction.Commit();
                fwSqlTransaction.Close();
                //
                fwResult.data = true;
                fwResult.infoList.Add("更新成功！");
                fwResult.status = FWResultStatus.Success;
                return fwResult;
            }
            catch (Exception ex)
            {
                fwSqlTransaction.Rollback();
                fwSqlTransaction.Close();
                //
                fwResult.data = false;
                fwResult.infoList.Add(ex.Message);
                fwResult.status = FWResultStatus.Failure;
                return fwResult;
            }
        }

        //删除
        public static FWResult<bool> deleteTaskPlan(IFWUserInfo userInfo, string pTaskPlanId)
        {
            //
            FWResult<bool> fwResult = new FWResult<bool>();
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            //
            try
            {
                //保存数据主表
                DateTime opTime = GetDBDate();
                //事务开始
                fwSqlTransaction.BeginTransaction();
                var BllEntity =
                        bllQuerry<BLLOperationMaintenanceTaskPlan>(
                            "select * from BLLOperationMaintenanceTaskPlan where operationMaintenanceTaskPlanId = '" +
                            pTaskPlanId + "'");
                BllEntity.isValid = 0;
                BllEntity.updaterID = userInfo.userID;
                BllEntity.updateTime = opTime;
                //
                var dicWhere = new Dictionary<string, string>();
                dicWhere.Add("operationMaintenanceTaskPlanId", BllEntity.operationMaintenanceTaskPlanId);
                var dealResult = baseUpdate(BllEntity, dicWhere, fwSqlTransaction);
                if (dealResult != 1)
                {
                    fwSqlTransaction.Rollback();
                    fwSqlTransaction.Close();
                    //
                    fwResult.data = false;
                    fwResult.infoList.Add("删除主数据失败！");
                    fwResult.status = FWResultStatus.Error;
                    return fwResult;
                }
                //
                fwSqlTransaction.Commit();
                fwSqlTransaction.Close();
                //
                fwResult.data = true;
                fwResult.infoList.Add("更新成功！");
                fwResult.status = FWResultStatus.Success;
                return fwResult;
            }
            catch (Exception ex)
            {
                fwSqlTransaction.Rollback();
                fwSqlTransaction.Close();
                //
                fwResult.data = false;
                fwResult.infoList.Add(ex.Message);
                fwResult.status = FWResultStatus.Failure;
                return fwResult;
            }
        }

        #endregion

        #region 计划定时执行

        static DateTime nowTime = GetDBDate();
        static int thisYear = int.Parse(nowTime.Date.ToString("yyyy"));
        static int thisMonth = int.Parse(nowTime.Date.ToString("yyyyMM"));
        static int thisDay = int.Parse(nowTime.Date.ToString("yyyyMMdd"));
        static int nextYear = int.Parse(nowTime.AddYears(1).Date.ToString("yyyy"));
        static int nextMonth = int.Parse(nowTime.AddMonths(1).Date.ToString("yyyyMM"));
        static int nextDay = int.Parse(nowTime.AddDays(1).Date.ToString("yyyyMMdd"));
        
        //计划生成
        public static void taskPlanExec(int days)
        {
            try
            {
                //获取所有有效的计划
                List<BLLOperationMaintenanceTaskPlan> listTaskPlan =
                    bllListQuerry<BLLOperationMaintenanceTaskPlan>(
                        "select * from BLLOperationMaintenanceTaskPlan where isvalid=1 order by createTime");
                //获取所有的执行计划
                List<BLLOperationMaintenanceTaskExec> listTaskPlanExec =
                    bllListQuerry<BLLOperationMaintenanceTaskExec>(
                        "select * from BLLOperationMaintenanceTaskExec where isvalid=1 order by createTime");
                //
                foreach (BLLOperationMaintenanceTaskPlan entity in listTaskPlan)
                {
                    //
                    if (nowTime.Date.AddDays(days) >= new DateTime(nowTime.Year, nowTime.AddMonths(1).Month, 1))
                    {
                        var hasExec =
                            listTaskPlanExec.AsEnumerable()
                                            .Where(
                                                exec =>
                                                exec.operationMaintenanceTaskPlanId ==
                                                entity.operationMaintenanceTaskPlanId &&
                                                (exec.operationMonth.Equals(nextMonth) ||
                                                 exec.operationYear.Equals(nextYear)))
                                            .Select(exec => exec);
                        if (!hasExec.Any())
                        {
                            fromTaskExec(entity);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //
        public static void fromTaskExec(BLLOperationMaintenanceTaskPlan entity)
        {
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            DateTime startDate=new DateTime();
            DateTime endDate=new DateTime();
            try
            {
                fwSqlTransaction.BeginTransaction();
                //主表
                var taskExecId = GetDBGuid();
                BLLOperationMaintenanceTaskExec taskExec = new BLLOperationMaintenanceTaskExec();
                taskExec.operationMaintenanceTaskExecId = taskExecId;
                taskExec.operationMaintenanceTaskPlanId = entity.operationMaintenanceTaskPlanId;
                taskExec.isValid = 1;
                taskExec.status = 0;
                taskExec.formTime = nowTime;
                taskExec.createrID = "DDP";
                taskExec.createTime = nowTime;
                taskExec.updaterID = "DDP";
                taskExec.updateTime = nowTime;
                //判断设定月份的最后一天日期 是否超过实际月份的情况
                int lastDay = DateTime.DaysInMonth(nowTime.Year, nowTime.Month);
                entity.endDay=(entity.endDay>lastDay)?lastDay:entity.endDay;

                //区分的
                if (entity.frequencyType == 0)
                {
                    taskExec.operationMaintenanceTaskExecName = entity.operationMaintenanceTaskPlanName + "_" + nextMonth;
                    taskExec.operationMonth = nextMonth;
                    startDate = new DateTime(thisYear, int.Parse(nowTime.AddMonths(1).Date.ToString("MM")), entity.startDay);
                    endDate = new DateTime(thisYear, int.Parse(nowTime.AddMonths(1).Date.ToString("MM")), entity.endDay);
                }
                else if (entity.frequencyType == 1)
                {
                    taskExec.operationMaintenanceTaskExecName = entity.operationMaintenanceTaskPlanName + "_" + nextYear;
                    taskExec.operationYear = nextYear;
                    startDate = new DateTime(nextYear, entity.startMonth, entity.startDay);
                    endDate = new DateTime(nextYear, entity.endMonth, entity.endDay);
                }
                var result = baseInsert(taskExec);
                if (result != 1)
                {
                    fwSqlTransaction.Rollback();
                    fwSqlTransaction.Close();
                    throw new Exception("保存主表失败！(" + result + ")" );
                }
                //明细
                var listPlanD =
                    bllListQuerry<BLLOperationMaintenanceTaskPlanD>(
                        "select * from BLLOperationMaintenanceTaskPlanD where operationMaintenanceTaskPlanId = '" +
                        entity.operationMaintenanceTaskPlanId + "'");
                var dicSites = bllListQuerry<BLLMonitorSite>("SELECT * FROM dbo.BLLMonitorSite").ToDictionary(site=>site.monitorSiteCode);
                var listExexD = new List<BLLOperationMaintenanceTask>();
                foreach (BLLOperationMaintenanceTaskPlanD planD in listPlanD)
                {
                    BLLOperationMaintenanceTask taskEntity=new BLLOperationMaintenanceTask();
                    taskEntity.operationMaintenanceTaskCode = GetDBGuid();
                    taskEntity.operationMaintenanceTaskName =  taskExec.operationMaintenanceTaskExecName+ "_" + dicSites[planD.monitorSiteCode].monitorSiteName ;
                    taskEntity.monitorSiteCode = planD.monitorSiteCode;
                   // taskEntity.monitorSiteCode =dicSites[planD.monitorSiteCode].;
                    taskEntity.faultTime = startDate;
                    taskEntity.prescribeRepairTime = endDate;
                    taskEntity.operationMaintenancePersonCode = entity.operationMaintenancePersonCode;
                    taskEntity.taskTypeCode = "1";
                    taskEntity.status = "2";
                    taskEntity.isSolve = 0;
                    taskEntity.isDis = 0;
                    taskEntity.createrID = "DDP";
                    taskEntity.createTime = nowTime;
                    taskEntity.updaterID = "DDP";
                    taskEntity.updateTime = nowTime;
                    taskEntity.operationMaintenanceTaskExecId = taskExecId;
                    listExexD.Add(taskEntity);
                }
                result = baseListInsert(listExexD);
                if (result != 1)
                {
                    fwSqlTransaction.Rollback();
                    fwSqlTransaction.Close();
                    throw new Exception("保存明细数据失败！(" + result + ")");
                }
                //
                fwSqlTransaction.Commit();
                fwSqlTransaction.Close();
            }
            catch (Exception ex)
            {
                fwSqlTransaction.Rollback();
                fwSqlTransaction.Close();
                throw ex;
            }
        }

        #endregion
    }
}
