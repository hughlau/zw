using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.m.sysManage.aop;
using System.ServiceModel;
using System.ServiceModel.Activation;
using fw.m.autoMonitor.data;
using fw.fwData;
using fw.m.autoMonitor.data.model;
using fw.m.autoMonitor.bll;
using fw.fwFile;
using System.Data;
using fw.fwService;

namespace fw.m.autoMonitor.service
{
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.PerCall, ConcurrencyMode = ConcurrencyMode.Multiple)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    [FWContextAttribute]
    public class AutoMonitorService : FWContextBoundObject, IAutoMonitorService
    {
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<string> test(string ticket)
        {
            return new FWResult<string>() { data = "服务调用成功：" + ticket, status = FWResultStatus.Success };
        }

        /// <summary>
        /// 查询监测数据统计、监测数据列表、因子列表
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>监测数据统计、监测数据列表、因子列表</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MAutoMonitorStatics>> queryAutoMonitorStatics(string ticket, FWPageParams pageParams, QueryAutoMonitorParams queryParams)
        {
            return AutoMonitorBll.queryAutoMonitorStatics(userInfo, pageParams, queryParams);
        }



        /// <summary>
        /// 导出监测数据统计、监测数据列表、因子列表
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>监测数据统计、监测数据列表、因子列表</returns>
        public FWResult<FWDataTable> exportAutoMonitorStatics(string ticket, FWPageParams pageParams, QueryAutoMonitorParams queryParams)
        {
            return AutoMonitorBll.exportAutoMonitorStatics(userInfo, pageParams, queryParams);
        }

        /// <summary>
        /// 数据导出
        /// </summary>
        /// <param name="tempDt"></param>
        /// <param name="tableSettings"></param>
        /// <returns></returns>
        public FWResult<FWFileInfo> export(FWCallParams dataSourceSettings, FWDataTable tableSettings)
        {
            return AutoMonitorBll.export(dataSourceSettings, tableSettings);
        }


        /// <summary>
        /// 查询因子列表
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>因子列表</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MMonitorSiteFactor>> queryFactorList(string ticket, QueryAutoMonitorParams queryParams)
        {
            return AutoMonitorBll.queryFactorList(userInfo, queryParams);

        }

        /// <summary>
        /// 查询实时数据信息列表
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="pageParams">分页参数</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>实时数据信息列表</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<MMonitorSiteLatestData>> queryMonitorSiteLatestData(string ticket, FWPageParams pageParams, QueryAutoMonitorParams queryParams)
        {
            return AutoMonitorBll.queryMonitorSiteLatestData(userInfo, pageParams, queryParams);
        }


        /// <summary>
        /// 增加或者修改自动监测数据（实时）
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="mEntityList">保存实体</param>
        /// <returns>保存结果（true或false）</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> insertOrUpdateMonitorSiteFactor_Realtime(string ticket, List<MMonitorSiteFactor_Realtime> mEntityList)
        {
            return MonitorSiteRealtimeBll.insertOrUpdateMonitorSiteFactor_Realtime(userInfo, mEntityList);
        }

        /// <summary>
        /// 查询自动监测数据列表（实时）
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="pageParams">分页参数</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>自动监测数据列表</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<MMonitorSiteFactor_Realtime>> queryPageFactor_Realtime(string ticket, FWPageParams pageParams, QueryAutoMonitorParams queryParams)
        {
            return MonitorSiteRealtimeBll.queryPageFactor_Realtime(userInfo, pageParams, queryParams);
        }

        /// <summary>
        /// 读取Excel
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="filePath">地址</param>
        /// <returns>读取列表</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MMonitorSiteFactor_Realtime>> SearchDataByOffice(string ticket, string filePath)
        {
            FWResult<List<MMonitorSiteFactor_Realtime>> result = new FWResult<List<MMonitorSiteFactor_Realtime>>();
            if (!string.IsNullOrEmpty(filePath))
            {
                String dataTemp = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, filePath.Replace("/", "\\"));
                result.data = AutoMonitorBll.SearchDataByOffice(dataTemp);
                result.status = FWResultStatus.Success;
            }
            else
            {
                result.infoList.Add("请选择数据导入文件！");
                result.status = FWResultStatus.Failure;
            }
            return result;
        }


        /// <summary>
        /// 历史数据查询
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="pageParams"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        public   FWResult<FWPageData<MMonitorSiteFactor_Realtime>> queryPageFactorHisData(string ticket, FWPageParams pageParams, QueryAutoMonitorParams queryParams)
        {
            return MonitorSiteRealtimeBll.queryPageFactorHisData(userInfo, pageParams, queryParams);
        }


        public FWResult<FWPageData<MMonitorSiteFactor_Realtime>> queryMonitorWaterPumpStatus(string ticket, FWPageParams pageParams, QueryAutoMonitorParams queryParams)
        {
            return MonitorSiteRealtimeBll.queryMonitorWaterPumpStatus(userInfo, pageParams, queryParams);
        }

        public FWResult<FWPageData<MMonitorSiteFactor_Realtime>> queryMonitorDrugStatus(string ticket, FWPageParams pageParams, QueryAutoMonitorParams queryParams)
        {
            return MonitorSiteRealtimeBll.queryMonitorDrugStatus(userInfo, pageParams, queryParams);
        }

        public FWResult<FWPageData<MMonitorSiteFactor_Realtime>> queryMonitorWaterPumpHisStatus(string ticket, FWPageParams pageParams, QueryAutoMonitorParams queryParams)
        {
            return MonitorSiteRealtimeBll.queryMonitorWaterPumpHisStatus(userInfo, pageParams, queryParams);
        }

        public FWResult<FWPageData<MMonitorSiteFactor_Realtime>> queryMonitorDrugHisStatus(string ticket, FWPageParams pageParams, QueryAutoMonitorParams queryParams)
        {
            return MonitorSiteRealtimeBll.queryMonitorDrugHisStatus(userInfo, pageParams, queryParams);
        }
    }
}
