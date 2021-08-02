using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.ServiceModel.Activation;
using System.ServiceModel;
using fw.m.sysManage.aop;
using fw.m.operationMaintenance.data;
using fw.fwData;
using fw.m.operationMaintenance.bll;
using fw.m.operationMaintenance.data.entity;
using fw.m.operationMaintenance.data.model;
using fw.m.sysBasicManage.service;
using fw.m.sysBasicManage.data;
using fw.m.sysBasicManage.bll;
using fw.m.sysManage.data;
using GetuiServerApiSDK;
using System.Net.Mail;

namespace fw.m.operationMaintenance.service
{
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.PerCall, ConcurrencyMode = ConcurrencyMode.Multiple)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    [FWContextAttribute]
    public class OperationMaintenanceService : FWContextBoundObject, IOperationMaintenanceService
    {
        #region 服务测试
        public FWResult<string> test(string ticket)
        {

            return new FWResult<string>() { data = "服务调用成功：" + ticket, status = FWResultStatus.Success };
        }
        #endregion

        #region 运维合同  OperationMaintenanceContract
        /// <summary>
        /// 运维合同 新增更新
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="mEntity"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> inserOrUpdateMOperationMaintenanceContract(string ticket, MOperationMaintenanceContract mEntity)
        {
            return OperationMaintenanceContractBll.inserOrUpdateMOperationMaintenanceContract(userInfo, mEntity);
        }
        /// <summary>
        /// 删除操作
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="contractCodeList"></param>
        /// <returns></returns>
         [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> deleteMContractByCodeList(string ticket, List<string> contractCodeList)
        {
            return OperationMaintenanceContractBll.deleteMContractByCodeList(userInfo, contractCodeList);
        }

        /// <summary>
        /// 查询运维合同列表
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="pageParams">分页参数</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>运维合同列表（分页）</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<MOperationMaintenanceContract>> queryPageOperationMaintenanceContract(string ticket, FWPageParams pageParams, QueryContractParams queryParams)
        {
            return OperationMaintenanceContractBll.queryPageMaintenanceContract(userInfo, pageParams, queryParams);
        }

        /// <summary>
        /// 查询运维合同列表
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>运维合同列表</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MOperationMaintenanceContract>> queryOperationMaintenanceContract(string ticket, QueryContractParams queryParams)
        {
            return OperationMaintenanceContractBll.queryMaintenanceContract(userInfo, queryParams);
        }
        #endregion

        #region 运维单位  OperationMaintenanceUnitBll

        /// <summary>
        /// 增加或者更新运维单位
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="mEntity">对象集合</param>
        /// <returns>是否成功</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> inserOrUpdateByMOperationMaintenanceUnitCode(string ticket, MBLLOperationMaintenanceUnit mEntity)
        {
            return OperationMaintenanceUnitBll.inserOrUpdateByMOperationMaintenanceUnitCode(userInfo, mEntity);
        }

        /// <summary>
        /// 运维单位
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="mOperationMaintenanceUnitCode">运维单位code</param>
        /// <returns>运维单位实体</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<MBLLOperationMaintenanceUnit> queryByMOperationMaintenanceUnitCode(string ticket, string mOperationMaintenanceUnitCode)
        {
            return OperationMaintenanceUnitBll.queryByMOperationMaintenanceUnitCode(userInfo, mOperationMaintenanceUnitCode);
        }

        //
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MBLLOperationMaintenanceUnit>> queryOperationMaintenanceUnit(string ticket, string mOperationMaintenanceUnitCode)
        {
            return OperationMaintenanceUnitBll.queryOperationMaintenanceUnit(userInfo, mOperationMaintenanceUnitCode);
        }
        /// <summary>
        /// 查询运维企业数据字典列表
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>运维企业数据字典列表</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MBLLOperationMaintenanceUnit>> queryMaintenanceUnitDictionaryList(string ticket, QueryContractParams queryParams)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return OperationMaintenanceUnitBll.queryMaintenanceUnitDictionaryList(request.data, queryParams);
            }
            else
            {
                return new FWResult<List<MBLLOperationMaintenanceUnit>>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            }
        }

        /// <summary>
        /// 运维单位分页查询
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="pageParams">分页参数</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>运维单位实体实体</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<MBLLOperationMaintenanceUnit>> queryPageOperationMaintenanceUnit(
            string ticket, FWPageParams pageParams, QueryMBLLOperationMaintenanceUnitParams queryParams)
        {
            return OperationMaintenanceUnitBll.queryPageOperationMaintenanceUnit(userInfo, pageParams, queryParams);
        }

        /// <summary>
        /// 修改运维单位状态
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="mEntity"></param>
        /// <param name="mOperationMaintenanceUnitCodeList">单位编码</param>
        /// <returns>操作是否成功</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> updateMBLLOperationMaintenanceUnitByMCodeList(string ticket, MBLLOperationMaintenanceUnit mEntity, List<string> mOperationMaintenanceUnitCodeList)
        {
            return OperationMaintenanceUnitBll.updateBLLOperationMaintenanceUnitByCodeList(userInfo, mEntity, mOperationMaintenanceUnitCodeList);
        }

        /// <summary>
        /// 删除运维单位
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="mOperationMaintenanceUnitCodeList">单位编码</param>
        /// <returns>操作是否成功</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> deleteMBLLOperationMaintenanceUnitByMCodeList(string ticket, List<string> mOperationMaintenanceUnitCodeList)
        {
            return OperationMaintenanceUnitBll.deleteBLLOperationMaintenanceUnitByCodeList(userInfo, mOperationMaintenanceUnitCodeList);
        }
        #endregion

        #region M-ing 运维人员  OperationMaintenancePerson
        /// <summary>
        /// 增加或者更新运维人员
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="mEntity">对象集合</param>
        /// <returns>是否成功</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> inserOrUpdateMOperationMaintenancePersonByPersonCode(string ticket, MBLLOperationMaintenancePerson mEntity)
        {
            return OperationMaintenancePersonBll.inserOrUpdateMOperationMaintenancePersonByPersonCode(userInfo, mEntity);
        }

        /// <summary>
        /// 运维人员
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="mOperationMaintenanceUnitCode">运维单位code</param>
        /// <returns>运维单位实体</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<MBLLOperationMaintenancePerson> queryMOperationMaintenancePersonByPersonCode(string ticket, string mOperationMaintenancePersonCode)
        {
            return OperationMaintenancePersonBll.queryMOperationMaintenancePersonByPersonCode(userInfo, mOperationMaintenancePersonCode);
        }

        /// <summary>
        /// 查询运维人员列表
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>运维人员列表</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MBLLOperationMaintenancePerson>> queryMaintenancePersonDictionaryList(string ticket, QueryMBLLOperationMaintenancePersonParams queryParams)
        {
            return OperationMaintenancePersonBll.queryMaintenancePersonDictionaryList(userInfo, queryParams);
        }

        /// <summary>
        /// 运维人员分页查询
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="pageParams">分页参数</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>运维单位实体实体</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<MBLLOperationMaintenancePerson>> queryPageMOperationMaintenancePerson(
            string ticket, FWPageParams pageParams, QueryMBLLOperationMaintenancePersonParams queryParams)
        {
            return OperationMaintenancePersonBll.queryPageMOperationMaintenancePerson(userInfo, pageParams, queryParams);
        }

        /// <summary>
        /// 修改运维单位状态
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="mEntity"></param>
        /// <param name="mOperationMaintenanceUnitCodeList">单位编码</param>
        /// <returns>操作是否成功</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> updateMBLLOperationMaintenancePersonByMCodeList(string ticket, MBLLOperationMaintenancePerson mEntity, List<string> mOperationMaintenancePersonCodeList)
        {
            return OperationMaintenancePersonBll.updateBLLOperationMaintenanceUnitByCodeList(userInfo, mEntity, mOperationMaintenancePersonCodeList);
        }

        /// <summary>
        /// 删除运维单位
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="mOperationMaintenanceUnitCodeList">单位编码</param>
        /// <returns>操作是否成功</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> deleteMBLLOperationMaintenancePersonByMCodeList(string ticket, List<string> mOperationMaintenancePersonCodeList)
        {
            return OperationMaintenancePersonBll.deleteMBLLOperationMaintenancePersonByMCodeList(userInfo, mOperationMaintenancePersonCodeList);
        }
        /// <summary>
        /// 运维单位列表
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="mOperationMaintenanceUnitCode">运维单位code</param>
        /// <returns>运维单位实体</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MBLLOperationMaintenancePerson>> queryMOperationMaintenancePersonList(string ticket, QueryMBLLOperationMaintenancePersonParams queryParams)
        {
            FWResult<List<MBLLOperationMaintenancePerson>> result = new FWResult<List<MBLLOperationMaintenancePerson>>();

            result = OperationMaintenancePersonBll.queryMOperationMaintenancePersonList(userInfo, queryParams);
            result.status = FWResultStatus.Success;
            return result;
        }


        /// <summary>
        /// 获取运维人员最新经纬度
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MBLLOperationMaintenancePersonLocation>> getMBLLOperationMaintenancePersonLocationList(string ticket, string keyWord, int? topNum)
        {
            return OperationMaintenancePersonBll.getMBLLOperationMaintenancePersonLocationList(userInfo, keyWord, topNum);
        }
        /// <summary>
        /// 更新运维人员最新经纬度
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="longitude">经度</param>
        /// <param name="latitude">纬度</param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> updateMBLLOperationMaintenancePersonLocation(string ticket, double longitude, double latitude)
        {
            return OperationMaintenancePersonBll.updateMBLLOperationMaintenancePersonLocation(userInfo, longitude, latitude);
        }
        /// <summary>
        /// 运维用户分配账号
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="userID"></param>
        /// <param name="operationMaintenancePersonCode"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> operationsUserAllocation(string ticket, string userID, string operationMaintenancePersonCode)
        {
            return OperationMaintenancePersonBll.operationsUserAllocation(userInfo, userID, operationMaintenancePersonCode);
        }

        /// <summary>
        /// 运维用户解绑账号
        /// </summary> 
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> operationsUserUnAllocation(string ticket, string userID)
        {
            return OperationMaintenancePersonBll.operationsUserUnAllocation(userInfo, userID);
        } 
        #endregion

        #region 运维任务  OperationMaintenanceTask

        /// <summary>
        /// 运维任务列表查询（分页）
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="pageParams">分页参数</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>任务列表（分页）</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<MOperationMaintenanceTask>> queryPageMaintenanceTask(string ticket, FWPageParams pageParams, QueryTaskParams queryParams)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            { 
                return OperationMaintenanceTaskBll.queryPageMaintenanceTask(request.data, pageParams, queryParams);
            }
            else
            {
                return new FWResult<FWPageData<MOperationMaintenanceTask>>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            } 
        }

        /// <summary>
        /// 故障明细（分页）
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="pageParams">分页参数</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>任务列表（分页）</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<MOperationMaintenanceTask>> queryPageBreakDownList(string ticket, FWPageParams pageParams, QueryTaskParams queryParams)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return OperationMaintenanceTaskBll.queryPageBreakDownList(request.data, pageParams, queryParams);
            }
            else
            {
                return new FWResult<FWPageData<MOperationMaintenanceTask>>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            }
        }


        /// <summary>
        /// 运维人员所负责的运维任务列表查询（分页）
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="pageParams">分页参数</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>任务列表（分页）</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<MOperationMaintenanceTask>> queryPagePersonMaintenanceTask(string ticket, FWPageParams pageParams, QueryTaskParams queryParams)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return OperationMaintenanceTaskBll.queryPagePersonMaintenanceTask(request.data, pageParams, queryParams);
            }
            else
            {
                return new FWResult<FWPageData<MOperationMaintenanceTask>>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            }
        }


        /// <summary>
        /// 查询运维任务列表
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>任务列表</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MOperationMaintenanceTask>> queryMaintenanceTask(string ticket, QueryTaskParams queryParams)
        {
            return OperationMaintenanceTaskBll.queryMaintenanceTask(userInfo, queryParams);
        }

        /// <summary>
        /// 根据报警编码展示运维任务
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>报警编码展示运维任务信息</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<MOperationMaintenanceTask> queryMaintenanceTaskByAlarmCode(string ticket, QueryTaskParams queryParams)
        {
            return OperationMaintenanceTaskBll.queryMaintenanceTaskByAlarmCode(userInfo, queryParams);
        }

        /// <summary>
        /// 统计运维任务状态
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>统计结果</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<MOperationMaintenanceTaskStatistics> queryMaintenanceTaskStatistics(string ticket, QueryTaskParams queryParams)
        {
            return OperationMaintenanceTaskBll.queryMaintenanceTaskStatistics(userInfo, queryParams);

        }

        /// <summary>
        /// 增加运维任务
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="mEntity">保存实体</param>
        /// <returns>保存结果（true或false）</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> insertMaintenanceTask(string ticket, MOperationMaintenanceTask mEntity)
        {
            return OperationMaintenanceTaskBll.insertMaintenanceTask(userInfo, mEntity);
        }

        /// <summary>
        /// 修改运维任务
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="mEntity">保存实体</param>
        /// <returns>保存结果（true或false）</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> updateMaintenanceTask(string ticket, MOperationMaintenanceTask mEntity)
        {
            return OperationMaintenanceTaskBll.updateMaintenanceTask(userInfo, mEntity);
        }

        public FWResult<bool> deleteOpMaintenanceTask(string ticket, List<MOperationMaintenanceTask> mEntity)
        {
            FWResult<bool> result = new FWResult<bool>();
            try
            {
                for (int i = 0; i < mEntity.Count; i++)
                {
                    updateMaintenanceTask(ticket, mEntity[i]);
                }
                result.status = FWResultStatus.Success;
                result.data = true;
            }
            catch
            {
                result.infoList.Add("服务接口报错");
            }
            return result;
        }

        /// <summary>
        /// 批量生成任务
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="mEntityList">保存实体列表</param>
        /// <returns>生成结果（true或false）</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> generateTask(string ticket, List<MOperationMaintenanceTask> mEntityList)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return OperationMaintenanceTaskBll.generateTask(request.data, mEntityList);
            }
            else
            {
                return new FWResult<bool>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            }
        }

        /// <summary>
        /// 增加巡检任务
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="mEntity">保存实体</param>
        /// <returns>保存结果（true或false）</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> insertPatrolMaintenanceTask(string ticket, MOperationMaintenanceTask mEntity)
        {
            return OperationMaintenanceTaskBll.insertPatrolMaintenanceTask(userInfo, mEntity);
        }
        #endregion

        #region 报警信息 BLLMonitorSiteAlarm

        /// <summary>
        /// 查询报警信息列表（分页）
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="pageParams">分页参数</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>报警信息列表（分页）</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<MMonitorSiteAlarm>> queryPageMonitorSiteAlarm(string ticket, FWPageParams pageParams, QueryMonitorSiteAlarmParams queryParams)
        {
            return MonitorSiteAlarmBll.queryPageMonitorSiteAlarm(userInfo, pageParams, queryParams);
        }

        /// <summary>
        /// 查询报警信息列表
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>报警信息列表</returns>
        [FWAttribute(isVerifyRight = 1, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MMonitorSiteAlarm>> queryMonitorSiteAlarm(string ticket, QueryMonitorSiteAlarmParams queryParams)
        {

            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return MonitorSiteAlarmBll.queryMonitorSiteAlarm(request.data, queryParams);
            }
            else
            {
                return new FWResult<List<MMonitorSiteAlarm>>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            }
        }

        /// <summary>
        /// 更新报警信息
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="mEntity">保存实体</param>
        /// <returns>更新结果（true或false）</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> updateMonitorSiteAlarm(string ticket, MMonitorSiteAlarm mEntity)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return MonitorSiteAlarmBll.updateMonitorSiteAlarm(request.data, mEntity);
            }
            else
            {
                return new FWResult<bool>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            }
        }
        #endregion

        #region 运维维护点位 BLLOperationMaintenancePersonMappingMonitorSite

        /// <summary>
        /// 产询当前人员已分配的设施信息
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="pageParams"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MBLLOperationMaintenancePersonMappingMonitorSite>> queryPagePersonMappingMonitorSiteByPersonOrUnitCode(string ticket, QueryMBLLOperationMaintenancePersonMappingMonitorSiteParams queryParams)
        {
            return OperationMaintenancePersonMappingMonitorSiteBll.queryPagePersonMappingMonitorSiteByPersonOrUnitCode(userInfo, queryParams);
        }
        #endregion

        #region 运维模版  [BLLOperationMaintenanceFormTemplate]
        /// <summary>
        /// 查询运维模版列表
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="keyWord">关键字</param>
        /// <returns>运维模版列表</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MBLLOperationMaintenanceFormTemplate>> queryMBLLOperationMaintenanceFormTemplateList(string ticket, string keyWord)
        {
            return OperationMaintenanceFormTemplateBll.queryMBLLOperationMaintenanceFormTemplateList(userInfo, keyWord);
        }
        #endregion

        #region 查询统计


        /// <summary>
        /// 查询报警信息列表（分页）
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="pageParams">分页参数</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>报警信息列表（分页）</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<MMonitorSiteAlarm>> queryPageMonitorSiteFailureStatistics(string ticket, FWPageParams pageParams, QueryMonitorSiteAlarmParams queryParams)
        {
            return OperationMaintenanceStatisticsBll.queryPageMonitorSiteFailureStatistics(userInfo, pageParams, queryParams);
        }



        /// <summary>
        /// 设备正常/超标统计率
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="cantonCode"></param>
        /// <param name="beginTime"></param>
        /// <param name="endTime"></param>
        /// <param name="storedProcedureName"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWDataTable> queryMonitorSiteRateStatistics(string ticket, string cantonCode, DateTime? beginTime, DateTime? endTime, string storedProcedureName)
        {
            if (!beginTime.HasValue || !endTime.HasValue)
            {
                List<string> info = new List<string>();
                info.Add("时间参数不能为空！");
                return new FWResult<FWDataTable>()
                {
                    data = null,
                    status = FWResultStatus.Failure,
                    infoList = info
                };
            }
            return OperationMaintenanceStatisticsBll.queryMonitorSiteRateStatistics(userInfo, cantonCode, (DateTime)beginTime, (DateTime)endTime, storedProcedureName);
        }


        /// <summary>
        /// 运行情况统计
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="cantonCode"></param>
        /// <param name="beginTime"></param>
        /// <param name="endTime"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MOperatingConditionStatistics>> queryOperatingConditionStatistics(string ticket, string cantonCode, DateTime? beginTime, DateTime? endTime)
        {
            if (!beginTime.HasValue || !endTime.HasValue)
            {
                List<string> info = new List<string>();
                info.Add("时间参数不能为空！");
                return new FWResult<List<MOperatingConditionStatistics>>()
                {
                    data = null,
                    status = FWResultStatus.Failure,
                    infoList = info
                };
            }
            return OperationMaintenanceStatisticsBll.queryOperatingConditionStatistics(userInfo, cantonCode, (DateTime)beginTime, (DateTime)endTime);
        }


        #endregion

        #region 第三方登陆信息查询
        /// <summary>
        /// 运维单位 第三方登陆信息查询
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<MBLLOperationMaintenanceUnit> queryOperationMaintenanceUnitList(string ticket, QueryMBLLOperationMaintenanceUnitParams queryParams)
        {
            return OperationMaintenanceUnitBll.queryOperationMaintenanceUnitList(userInfo, queryParams);
        }

        /// <summary>
        /// 运维人员  第三方登陆信息查询
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<MBLLOperationMaintenancePerson> queryMaintenancePersonList(string ticket, QueryMBLLOperationMaintenancePersonParams queryParams)
        {
            return OperationMaintenancePersonBll.queryMaintenancePersonList(userInfo, queryParams);
        }

        #endregion

        #region 运维任务计划

        //任务计划查询
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<QueryTaskPlan>> queryPageMaintenanceTaskPlan(string ticket, FWPageParams pageParams, QueryTaskPlan queryParams)
        {
            return OperationMaintenanceTaskPlanBll.queryPageMaintenanceTaskPlan(userInfo, pageParams, queryParams);
        }

        //保存计划
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> saveTaskPlan(string ticket, MBLLOperationMaintenanceTaskPlan mEntity)
        {
            return OperationMaintenanceTaskPlanBll.saveTaskPlan(userInfo, mEntity);
        }

        //更新计划
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> updateTaskPlan(string ticket, MBLLOperationMaintenanceTaskPlan mEntity)
        {
            return OperationMaintenanceTaskPlanBll.updateTaskPlan(userInfo, mEntity);
        }

        //删除计划
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> deleteTaskPlan(string ticket, string pTaskPlanId)
        {
            return OperationMaintenanceTaskPlanBll.deleteTaskPlan(userInfo, pTaskPlanId);
        }

        //单个数据信息查询
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<QueryTaskPlanMain> queryTaskPlan(string ticket, string taskPlanCode)
        {
            return OperationMaintenanceTaskPlanBll.queryTaskPlan(userInfo, taskPlanCode);
        }

        #endregion

        #region 报表查看

        //零部件更换
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<QuerryMaintenanceEquipmentPart>> queryPageMaintenanceEquipmentPart(string ticket, FWPageParams pageParams, QuerryMaintenanceEquipmentPart queryParams)
        {
            return OperationMaintenanceTaskBll.queryPageMaintenanceEquipmentPart(userInfo, pageParams, queryParams);
        }

        #endregion

        #region 监测点位行政区级别加载
        public FWResult<List<MCantonData>> queryMonitorSiteTree(string ticket, string personCode, string contractCode, string action)
        {
            return OperationMaintenanceBll.queryMonitorSiteTree(userInfo, personCode, contractCode, action);
        }
        #endregion

        #region 项目所属设施分配
        public FWResult<bool> contractMonitorAddAllocator(string ticket, string operationMaintenanceContractCode, List<string> siteCodeList)
        {
            return MonitorAllocatorBll.contractMonitorAddAllocator(userInfo, operationMaintenanceContractCode, siteCodeList);
        }

        public FWResult<bool> contractMonitorDelAllocatorList(string ticket, string operationMaintenanceContractCode, List<string> delCodeList)
        {
            return MonitorAllocatorBll.contractMonitorDelAllocatorList(userInfo, operationMaintenanceContractCode, delCodeList);
        }  

        public FWResult<bool> contractMonitorDelAllocator(string ticket, MOperationMaintenanceContractMappingMonitorSite entity)
        {
            return MonitorAllocatorBll.contractMonitorDelAllocator(userInfo, entity);
        }

        #endregion

        #region 人员负责设施分配

        public FWResult<bool> personMonitorAddAllocator(string ticket, string operationMaintenancePersonCode, List<string> siteCodeList)
        {
            return MonitorAllocatorBll.personMonitorAddAllocator(userInfo, operationMaintenancePersonCode, siteCodeList);
        }

        public FWResult<bool> personMonitorDelAllocatorList(string ticket, string operationMaintenancePersonCode, List<string> delCodeList)
        {
            return MonitorAllocatorBll.personMonitorDelAllocatorList(userInfo, operationMaintenancePersonCode, delCodeList);
        }

        public FWResult<bool> personMonitorDelAllocator(string ticket, MBLLOperationMaintenancePersonMappingMonitorSite entity)
        {
            return MonitorAllocatorBll.personMonitorDelAllocator(userInfo, entity);
        }

        #endregion

        #region 故障率统计

        public FWResult<FWPageData<MBreakdownInfo>> queryPageMonitorSiteStatus(string ticket, FWPageParams pageParams, QueryMonitorSiteAlarmParams queryParams)
        {
            return OperationMaintenanceStatisticsBll.queryPageMonitorSiteStatus(userInfo, pageParams, queryParams);
        }

        #endregion

        #region 运维人员绩效统计

        public FWResult<FWPageData<MPersonTaskAnalysis>> queryPagePersonTaskStatus(string ticket, FWPageParams pageParams, QueryMonitorSiteAlarmParams queryParams)
        {
            return OperationMaintenanceStatisticsBll.queryPagePersonTaskStatus(userInfo, pageParams, queryParams);
        }


        public FWResult<FWPageData<MOperatorAssessment>> queryPagePersonTaskAssessment(string ticket, FWPageParams pageParams, QueryTaskParams queryParams)
        {
            return OperationMaintenanceStatisticsBll.queryPagePersonTaskAssessment(userInfo, pageParams, queryParams);
        }
        #endregion

        #region 个推相关

        //绑定登录用户id和个推clientid    add by songshasha 2016-11-23
        public FWResult<bool> BindCIdToUserId(string ticket, string clientId)
        {
                      
           return  PushMessageBll.BindClientId(userInfo, clientId);
            
        }
        //推送信息 songshasha 2016-11-23
        public FWResult<bool> sendMessage(string userID, string taskMessage, string url)
        {

            return PushMessageBll.PushMessageToSingle(userID, taskMessage, url);
        
        }
        #endregion

        #region 数据上行
        /// <summary>
        /// 和数据采集平台集成，接受数据采集平台推送的实时数据(已废弃)
        /// </summary>
        /// <param name="mEntity"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> receiveLtuData(fw.m.operationMaintenance.data.model.MBllRealTimeData mEntity)
        {
            return OperationMaintenanceTaskBll.receiveLtuData(mEntity);
        }

        /// <summary>
        /// Http上行接口
        /// </summary>
        /// <param name="mEntity"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> receiveSyncDataA(HTTPRealTimeData mEntity)
        {
            return OperationMaintenanceTaskBll.saveHLWXSyncData(mEntity);
        }

        /// <summary>
        /// 返回上行数据时间戳（已废弃）
        /// </summary>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 1, isFunction = 0)]
        public FWResult<IList<string>> getSyncDataA()
        {
            return OperationMaintenanceTaskBll.getSyncTimespan();
        }

        /// <summary>
        /// 测试备份
        /// </summary>
        /// <param name="mEntity"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> receiveSyncDataB(JJMBllRealTimeData mEntity)
        {
            return OperationMaintenanceTaskBll.saveSyncData(mEntity);
        }

        /// <summary>
        /// 测试备份
        /// </summary>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 1, isFunction = 0)]
        public FWResult<IList<string>> getSyncDataB()
        {
            return OperationMaintenanceTaskBll.getSyncTimespan();
        }

        /// <summary>
        /// 删除队列数据（已废弃）
        /// </summary>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> deleteQueue()
        {
            FWResult<bool> result = new FWResult<bool>();
            QueueManger.Deletequeue(RealTimeData._queuepath);
            return result;
        }

        /// <summary>
        /// 测试（已废弃）
        /// </summary>
        /// <param name="mEntitys"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<FWResult<bool>>> receiveLtuDatas(List<data.model.MBllRealTimeData> mEntitys)
        {
            var list = new List<FWResult<bool>>();
            if (mEntitys != null)
            {
                foreach (var mEntity in mEntitys)
                {
                    list.Add(receiveLtuData(mEntity));
                }
            }
            var result = new FWResult<List<FWResult<bool>>>
            {
                data = list,
                status = FWResultStatus.Success
            };
            return result;
        }
        #endregion

        #region 日常运维任务

        /// <summary>
        /// 增加或更新日常运维任务
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="mEntity">保存实体</param>
        /// <returns>保存结果（true或false）</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> insertOrUpdateDailyMaintenanceTask(string ticket, MDailyMaintenanceTask mEntity)
        {
            FWResult<bool> result = new FWResult<bool>();
            try
            {
                result = OperationMaintenanceTaskBll.insertOrUpdateDailyMaintenanceTask(userInfo, mEntity);
            }
            catch
            {
                result.infoList.Add("服务接口报错");
            }
            return result;
        }


        /// <summary>
        /// 删除运维任务
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="mEntity"></param>
        /// <returns></returns>
        public FWResult<bool> deleteMaintenanceTask(string ticket, List<MDailyMaintenanceTask> mEntity)
        {
            FWResult<bool> result = new FWResult<bool>();
            try
            {
                for (int i = 0; i < mEntity.Count; i++)
                {
                    insertOrUpdateDailyMaintenanceTask(ticket, mEntity[i]);
                }
                result.status = FWResultStatus.Success;
                result.data = true;
            }
            catch
            {
                result.infoList.Add("服务接口报错");
            }
            return result;
        }

        /// <summary>
        /// 日常运维任务列表查询（分页）
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="pageParams">分页参数</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>任务列表（分页）</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<MDailyMaintenanceTask>> queryPageDailyMaintenanceTask(string ticket, FWPageParams pageParams, QueryTaskParams queryParams)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return OperationMaintenanceTaskBll.queryPageDailyMaintenanceTask(request.data, pageParams, queryParams);
            }
            else
            {
                return new FWResult<FWPageData<MDailyMaintenanceTask>>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            }
        }


        /// <summary>
        /// 查询日常运维任务
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>任务</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MDailyMaintenanceTask>> queryDailyMaintenanceTask(string ticket, QueryTaskParams queryParams)
        {
            return OperationMaintenanceTaskBll.queryDailyMaintenanceTask(userInfo, queryParams);
        }

        public FWResult<bool> multiApplyMaintainanceTask(string ticket, string siteCodeList)
        {
            return OperationMaintenanceTaskBll.multiApplyMaintainanceTask(userInfo, siteCodeList);
        }


        /// <summary>
        /// 设备日运行情况统计（分页）
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="pageParams">分页参数</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>任务列表（分页）</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<MBllEquipmentStatusInfoByDay>> queryPageEquipmentStatusInfoByDay(string ticket, FWPageParams pageParams, QueryTaskParams queryParams)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return OperationMaintenanceStatisticsBll.queryPageEquipmentStatusInfoByDay(request.data, pageParams, queryParams);
            }
            else
            {
                return new FWResult<FWPageData<MBllEquipmentStatusInfoByDay>>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            }
        }


        /// <summary>
        /// 运行异常设备列表，按日统计
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="pageParams">分页参数</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>任务列表（分页）</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<MBLLMonitorSiteHisData>> queryPageEquipmentFaultList(string ticket, FWPageParams pageParams, QueryTaskParams queryParams)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return OperationMaintenanceStatisticsBll.queryPageEquipmentFaultList(request.data, pageParams, queryParams);
            }
            else
            {
                return new FWResult<FWPageData<MBLLMonitorSiteHisData>>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            }
        }


        /// <summary>
        /// 增加或更新日常运维任务
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="mEntity">保存实体</param>
        /// <returns>保存结果（true或false）</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> insertOrUpdateMaintenanceRecord(string ticket, MBLLOperationMaintenanceRecords mEntity)
        {
            return OperationMaintenanceTaskBll.insertOrUpdateMaintenanceRecord(userInfo, mEntity);
        }

        public FWResult<bool> deleteMaintenanceRecord(string ticket, List<MBLLOperationMaintenanceRecords> mEntity)
        {
            FWResult<bool> result = new FWResult<bool>();
            try
            {
                for (int i = 0; i < mEntity.Count; i++)
                {
                    insertOrUpdateMaintenanceRecord(ticket, mEntity[i]);
                }
                result.status = FWResultStatus.Success;
                result.data = true;
            }
            catch
            {
                result.infoList.Add("服务接口报错");
            }
            return result;
        }

        /// <summary>
        /// 运维记录列表查询（分页）
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="pageParams">分页参数</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>记录列表（分页）</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<MBLLOperationMaintenanceRecords>> queryPageMaintenanceRecords(string ticket, FWPageParams pageParams, QueryTaskParams queryParams)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return OperationMaintenanceTaskBll.queryPageMaintenanceRecords(request.data, pageParams, queryParams);
            }
            else
            {
                return new FWResult<FWPageData<MBLLOperationMaintenanceRecords>>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            }
        }

        /// <summary>
        /// 查询日常运维任务
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>任务</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MBLLOperationMaintenanceRecords>> queryMaintenanceRecord(string ticket, QueryTaskParams queryParams)
        {
            return OperationMaintenanceTaskBll.queryMaintenanceRecord(userInfo, queryParams);
        }

        /// <summary>
        /// 删除运维任务
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="mEntity"></param>
        /// <returns></returns>
        public FWResult<bool> deleteMaintenanceCleanRecord(string ticket, List<MBllMonitorSiteCleanRecord> mEntity)
        {
            FWResult<bool> result = new FWResult<bool>();
            try
            {
                for (int i = 0; i < mEntity.Count; i++)
                {
                    insertOrUpdateMaintenanceCleanRecord(ticket, mEntity[i]);
                }
                result.status = FWResultStatus.Success;
                result.data = true;
            }
            catch
            {
                result.infoList.Add("服务接口报错");
            }
            return result;
        }

        /// <summary>
        /// web端日常运维
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="pageParams"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<MDailyMaintenanceTask>> queryPageDailyMaintenanceTaskByWeb(string ticket, FWPageParams pageParams, QueryTaskParams queryParams)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return OperationMaintenanceTaskBll.queryPageDailyMaintenanceTaskByWeb(request.data, pageParams, queryParams);
            }
            else
            {
                return new FWResult<FWPageData<MDailyMaintenanceTask>>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            }
        }


        #endregion

        #region 清掏任务

        /// <summary>
        /// 查询清掏任务
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>任务</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MBllMonitorSiteCleanRecord>> queryMaintenanceCleanRecord(string ticket, QueryTaskParams queryParams)
        {
            return OperationMaintenanceTaskBll.queryMaintenanceCleanRecord(userInfo, queryParams);
        }

        /// <summary>
        /// 查询清掏任务
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>任务</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<MBllMonitorSiteCleanRecord>> queryPageMaintenanceCleanRecords(string ticket, FWPageParams pageParams, QueryTaskParams queryParams)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return OperationMaintenanceTaskBll.queryPageMaintenanceCleanRecords(request.data, pageParams, queryParams);
            }
            else
            {
                return new FWResult<FWPageData<MBllMonitorSiteCleanRecord>>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            }
        }

        /// <summary>
        /// 增加或更新清掏任务
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="mEntity">保存实体</param>
        /// <returns>保存结果（true或false）</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> insertOrUpdateMaintenanceCleanRecord(string ticket, MBllMonitorSiteCleanRecord mEntity)
        {
            return OperationMaintenanceTaskBll.insertOrUpdateMaintenanceCleanRecord(userInfo, mEntity);
        }


        #endregion

        #region 水质信息
        /// <summary>
        /// 查询水质信息
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="pageParams"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<MDailyMaintenanceTask>> queryPageDailyWaterQuality(string ticket, FWPageParams pageParams, QueryTaskParams queryParams)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return OperationMaintenanceTaskBll.queryPageDailyWaterQuality(request.data, pageParams, queryParams);
            }
            else
            {
                return new FWResult<FWPageData<MDailyMaintenanceTask>>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            }
        }


        /// <summary>
        /// 增加或更新水质信息
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="mEntity"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> insertOrUpdateWaterQuality(string ticket, MDailyMaintenanceTask mEntity)
        {
            FWResult<bool> result = new FWResult<bool>();
            result = OperationMaintenanceTaskBll.insertOrUpdateWaterQuality(userInfo, mEntity);
            return result;
        } 
        #endregion

        #region 接种管理

        [FWAttribute(isVerifyRight = 1, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<MBLLInoculationRecord>> queryInoculationByPage(string ticket,FWPageParams pageParams,QueryInoculationTaskParams queryParams)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return InoculationRecordBll.queryPage(request.data, pageParams, queryParams);
            }
            else
            {
                return new FWResult<FWPageData<MBLLInoculationRecord>>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            }
        }

        [FWAttribute(isVerifyRight = 1, isWriteLog = 0, isFunction = 0)]
        public FWResult<MBLLInoculationRecord> queryInoculationByCode(string ticket,string code)
        {
            return InoculationRecordBll.queryByCode(code);
        }

        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> insertOrUpdateInoculationRecord(string ticket, BLLInoculationRecord mEntity)
        {
            return InoculationRecordBll.insertOrUpdateInoculationRecord(userInfo, mEntity);
        }
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> deleteInoculation(string ticket,string codes)
        {
            codes = codes.TrimEnd(',');
            return InoculationRecordBll.deleteInoculation(ticket,codes);
        }

        [FWAttribute(isVerifyRight = 1, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<MBLLInoculationRecord>> queryInoculationStaticByPage(string ticket, FWPageParams pageParams, QueryInoculationTaskParams queryParams)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return InoculationRecordBll.queryStaticPage(request.data, pageParams, queryParams);
            }
            else
            {
                return new FWResult<FWPageData<MBLLInoculationRecord>>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            }
        }
        #endregion


        
    }
}