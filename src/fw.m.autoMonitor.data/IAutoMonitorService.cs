using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Web;
using fw.fwData;
using fw.m.autoMonitor.data.model;

namespace fw.m.autoMonitor.data
{
    public interface IAutoMonitorService
    {
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        FWResult<string> test(string ticket);

        /// <summary>
        /// 查询因子列表
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>因子列表</returns>
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        FWResult<List<MMonitorSiteFactor>> queryFactorList(string ticket, QueryAutoMonitorParams queryParams);

        /// <summary>
        /// 查询监测数据统计、监测数据列表、因子列表
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>监测数据统计、监测数据列表、因子列表</returns>
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        FWResult<List<MAutoMonitorStatics>> queryAutoMonitorStatics(string ticket,FWPageParams pageParams, QueryAutoMonitorParams queryParams);

        /// <summary>
        /// 查询实时数据信息列表
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="pageParams">分页参数</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>实时数据信息列表</returns>
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        FWResult<FWPageData<MMonitorSiteLatestData>> queryMonitorSiteLatestData(string ticket, FWPageParams pageParams, QueryAutoMonitorParams queryParams);

        /// <summary>
        /// 查询自动监测数据列表（实时）
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="pageParams">分页参数</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>自动监测数据列表</returns>
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        FWResult<FWPageData<MMonitorSiteFactor_Realtime>> queryPageFactor_Realtime(string ticket, FWPageParams pageParams, QueryAutoMonitorParams queryParams);

        /// <summary>
        /// 增加或者修改自动监测数据（实时）
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="mEntityList">保存实体</param>
        /// <returns>保存结果（true或false）</returns>
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        FWResult<bool> insertOrUpdateMonitorSiteFactor_Realtime(string ticket, List<MMonitorSiteFactor_Realtime> mEntityList);

        /// <summary>
        /// 读取Excel
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="filePath">地址</param>
        /// <returns>读取列表</returns>
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        FWResult<List<MMonitorSiteFactor_Realtime>> SearchDataByOffice(string ticket, string filePath);
    }
}
