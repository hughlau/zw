using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Web;
using fw.fwData;
using fw.m.operationMaintenance.data.entity;
using fw.m.operationMaintenance.data.model;

namespace fw.m.operationMaintenance.data
{
    [ServiceContract]
    public interface IOperationMaintenanceService
    {
        #region 服务测试
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        FWResult<string> test(string ticket);
        #endregion

        #region 运维人员查询
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        FWResult<MBLLOperationMaintenancePerson> queryMaintenancePersonList(string ticket,QueryMBLLOperationMaintenancePersonParams queryParams);
        #endregion

        #region 运维单位查询
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        FWResult<MBLLOperationMaintenanceUnit> queryOperationMaintenanceUnitList(string ticket,
          QueryMBLLOperationMaintenanceUnitParams queryParams);


        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest,RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        FWResult<List<MBLLOperationMaintenanceUnit>> queryOperationMaintenanceUnit(string ticket,string mOperationMaintenanceUnitCode);

        #endregion


        #region 运维任务计划

        //运维计划
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        FWResult<FWPageData<QueryTaskPlan>> queryPageMaintenanceTaskPlan(string ticket, FWPageParams pageParams, QueryTaskPlan queryParams);

        //保存计划
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        FWResult<bool> saveTaskPlan(string ticket, MBLLOperationMaintenanceTaskPlan mEntity);

        //更新计划
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        FWResult<bool> updateTaskPlan(string ticket, MBLLOperationMaintenanceTaskPlan mEntity);

        //删除计划
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        FWResult<bool> deleteTaskPlan(string ticket, string pTaskPlanId);

        //单个数据信息查询
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        FWResult<QueryTaskPlanMain> queryTaskPlan(string ticket, string taskPlanCode);


        #endregion


        #region 报表查看

        //零部件更换
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        FWResult<FWPageData<QuerryMaintenanceEquipmentPart>> queryPageMaintenanceEquipmentPart(string ticket, FWPageParams pageParams, QuerryMaintenanceEquipmentPart queryParams);

        #endregion

        #region 数据推送

        [OperationContract]
        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, UriTemplate = "dataSync")]
        FWResult<bool> receiveSyncDataA(fw.m.operationMaintenance.data.model.HTTPRealTimeData mEntity);

        [OperationContract]
        [WebInvoke(Method = "GET",ResponseFormat = WebMessageFormat.Json, UriTemplate = "dataCheck")]
        FWResult<IList<string>> getSyncDataA();

        [OperationContract]
        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, UriTemplate = "dataSyncB")]
        FWResult<bool> receiveSyncDataB(fw.m.operationMaintenance.data.model.JJMBllRealTimeData mEntity);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "dataCheckB")]
        FWResult<IList<string>> getSyncDataB();

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "dq")]
        FWResult<bool> deleteQueue();
        #endregion
    }
}
