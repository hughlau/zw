using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Web;
using fw.fwData;
using fw.m.basicInfo.data.model;

namespace fw.m.basicInfo.data
{
    /// <summary>
    /// 基础信息
    /// </summary>
    [ServiceContract]
    public interface IBasicInfoService
    {

        [OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        [WebGet(UriTemplate = "/test/{ticket}", BodyStyle = WebMessageBodyStyle.Bare, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        FWResult<string> test(string ticket);


        #region 根据设备编号 获取设备信息/监测点位信息

        #endregion
        #region 设备
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        FWResult<MBLLEquipment> queryEquipmentForMobile(string ticket, string equipmentNo);


        /// <summary>
        /// 设备新增
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="mEntity"></param>
        /// <returns></returns>
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        FWResult<bool> inserOrUpdateMBLLEquipment(string ticket, MBLLEquipment mEntity);

        /// <summary>
        /// 设备信息查询
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="equipmentCode"></param>
        /// <returns></returns>
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
          FWResult<FWPageData<MBLLEquipment>> queryPageEquipment(string ticket, FWPageParams pageParams, QueryEquipmentParams queryParams);

        #endregion
      


        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        FWResult<List<MBLLMonitorSite>> queryMonitorSite(string ticket, QueryBasicInfoParams queryParams);

        //查询所有零部件
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        FWResult<List<MBLLEquipmentPart>> queryEquipmentPartForMobile(string ticket);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        FWResult<bool> importDataByMobile(string ticket, MBLLFactorData mEntity);



    }
}
