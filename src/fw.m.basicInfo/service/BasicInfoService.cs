using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.ServiceModel.Activation;
using System.ServiceModel;
using fw.m.sysManage.aop;
using fw.fwData;
using fw.fwSafe;
using fw.fwService;
using fw.fwUrl;
using fw.m.sysBasicManage.service;
using fw.m.sysBasicManage.data;
using fw.m.basicInfo.data;
using fw.m.basicInfo.data.model;
using fw.m.basicInfo.bll;
using fw.m.userLogin.data;
using fw.m.basicInfo.data.data;
using fw.m.basicInfo.data.entity;
using System.ServiceModel.Web;
using System.ComponentModel;
using System.IO;
using System.Net;
using fw.fwConfig;
using System.Web.UI.WebControls;
using Newtonsoft.Json;
using System.Drawing.Imaging;
using System.Drawing;
using fw.m.sysManage.data.model;
using fw.m.userLogin.bll;
using fw.fwSession;
using fw.m.sysBasicManage.bll;
using fw.m.Common;

namespace fw.m.basicInfo.service
{
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.PerCall, ConcurrencyMode = ConcurrencyMode.Multiple)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    [FWContextAttribute]
    public class BasicInfoService : FWContextBoundObject, IBasicInfoService
    {
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<string> test(string ticket)
        {
            return new FWResult<string>() { data = "服务调用成功：" + ticket, status = FWResultStatus.Success };
        }

        [FWAttribute(isVerifyRight = 0, isWriteLog = 1, isFunction = 0)]
        public FWResult<List<MBLLMonitorSiteMonitorFactor>> queryFactorDictionaryList(string ticket)
        {
            FWResult<List<MBLLMonitorSiteMonitorFactor>> result = new FWResult<List<MBLLMonitorSiteMonitorFactor>>();
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                result.data = MBLLMonitorSiteMonitorFactorBll.queryFactorDictionaryList();
                result.status = FWResultStatus.Success;
                return result;
            }
            else
            {
                return new FWResult<List<MBLLMonitorSiteMonitorFactor>>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            }
        }

        /// <summary>
        /// 监测污染物
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="mEntity"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 1, isFunction = 0)]
        public FWResult<List<MBLLMonitorSiteMonitorFactor>> queryMonitorSiteFactor(string ticket,
            QueryBasicInfoParams mEntity)
        {
            FWResult<List<MBLLMonitorSiteMonitorFactor>> result = new FWResult<List<MBLLMonitorSiteMonitorFactor>>();
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                result.data = MBLLMonitorSiteMonitorFactorBll.queryMonitorSiteFactor(mEntity.monitorSiteCode);
                result.status = FWResultStatus.Success;
                return result;
            }
            else
            {
                return new FWResult<List<MBLLMonitorSiteMonitorFactor>>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            }
        }


        #region 根据运维人员查询设施列表

        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<MBLLMonitorSite>> queryPagePersonMappingMonitorSiteByPersonOrUnitCode(string ticket,
            FWPageParams pageParams, QueryBasicInfoParams queryParams)
        {
            return MBLLMonitorSiteBll.queryPagePersonMappingMonitorSiteByPersonOrUnitCode(userInfo, pageParams,
                queryParams);
        }

        #endregion

        #region 树形懒加载方法

        [FWAttribute(isVerifyRight = 0, isWriteLog = 1, isFunction = 0)]
        public FWResult<List<MLazyTreeData>> queryCantonListForLazyTree(string ticket, string unitCode,
            string personCode)
        {
            return MBLLMonitorSiteBll.queryCantonListForLazyTree(userInfo, unitCode, personCode);
        }

        [FWAttribute(isVerifyRight = 0, isWriteLog = 1, isFunction = 0)]
        public FWResult<List<MBLLMonitorSite>> queryMonitorSiteListForLazyTree(string ticket, string unitCode,
            string personCode)
        {
            return MBLLMonitorSiteBll.queryMonitorSiteListForLazyTree(userInfo, unitCode, personCode);
        }

        #endregion

        #region 查询运维合同设施点位列表

        /// <summary>
        /// 查询厂区信息
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="unitCode">单位编码</param>
        /// <param name="personCode">人员编码</param>
        /// <returns>厂区信息</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MLazyTreeData>> queryCantonListForContractLazyTree(string ticket, string unitCode,
            string personCode, QueryBasicInfoParams queryParams)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return MBLLMonitorSiteBll.queryCantonListForContractLazyTree(request.data, unitCode, personCode,
                    queryParams);
            }
            else
            {
                return new FWResult<List<MLazyTreeData>>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            }
        }

        /// <summary>
        /// 查询未关联合同的点位列表
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>分页参数</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MBLLMonitorSite>> queryMonitorSiteContractForLazyTree(string ticket,
            QueryBasicInfoParams queryParams)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return MBLLMonitorSiteBll.queryMonitorSiteContractForLazyTree(request.data, queryParams);
            }
            else
            {
                return new FWResult<List<MBLLMonitorSite>>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            }
        }

        #endregion

        #region 查询运维人员设施点位列表

        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MLazyTreeData>> queryCantonListForPersonLazyTree(string ticket,
            QueryBasicInfoParams queryParams)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {

                queryParams.operationMaintenanceUnitCode = request.data.operationMaintenanceUnitCode;
                if (string.IsNullOrEmpty(queryParams.operationMaintenancePersonCode))
                {
                    queryParams.operationMaintenancePersonCode = request.data.operationMaintenancePersonCode;
                }
                return MBLLMonitorSiteBll.queryCantonListForPersonLazyTree(request.data, queryParams);
            }
            else
            {
                return new FWResult<List<MLazyTreeData>>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            }
        }

        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MBLLMonitorSite>> queryMonitorSitePersonForLazyTree(string ticket,
            QueryBasicInfoParams queryParams)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                if (string.IsNullOrEmpty(queryParams.operationMaintenancePersonCode))
                {
                    queryParams.operationMaintenancePersonCode = request.data.operationMaintenancePersonCode;
                }
                return MBLLMonitorSiteBll.queryMonitorSitePersonForLazyTree(request.data, queryParams);
            }
            else
            {
                return new FWResult<List<MBLLMonitorSite>>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            }
        }

        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MBLLMonitorSite>> queryMonitorSitePersonHasList(string ticket,
            QueryBasicInfoParams queryParams)
        {
            FWResult<List<MBLLMonitorSite>> result = new FWResult<List<MBLLMonitorSite>>();
            result.data = MBLLMonitorSiteBll.queryMonitorSitePersonHasList(userInfo, queryParams);
            result.status = FWResultStatus.Success;
            return result;
        }

        #endregion

        #region 点位统计查询_地图统计

        [FWAttribute(isVerifyRight = 1, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MLazyTreeData>> queryRealTimeMonitorSiteStatis(string ticket)
        {
            return MBLLMonitorSiteBll.queryRealTimeMonitorSiteStatis(userInfo);
        }
        [FWAttribute(isVerifyRight = 1, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<Data_Canton>> queryRealMonitorSiteStatisByLoginUser(string ticket, string cantonCode,
            string projectNo)
        {
            //MBLLMonitorSiteBll.CheckSignalWrong();
            
            return MBLLMonitorSiteBll.queryRealMonitorSiteStatisByLoginUserNew(userInfo, cantonCode, projectNo);
        }

        #endregion

        #region 获取设施点位二维码

        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MBLLMonitorSite>> queryMonitorQRcodeList(string ticket, List<string> monitorSiteCodeList)
        {
            FWResult<List<MBLLMonitorSite>> result = new FWResult<List<MBLLMonitorSite>>();
            if (monitorSiteCodeList != null && monitorSiteCodeList.Count > 0)
            {


                result = MBLLMonitorSiteBll.queryMonitorSite(null, new QueryBasicInfoParams()
                {
                    monitorSiteCodeList = monitorSiteCodeList
                });
                if (result != null && result.data != null && result.data.Count > 0)
                {
                    foreach (var monitorSite in result.data)
                    {


                        //生成二维码 
                        string quickResponseCodeFolderRelativePath = "web/temporaryFolder/quickResponseCode/";
                        string quickResponseCodeImageFullName = monitorSite.monitorSiteCode + ".png";

                        Dictionary<string, string> paramsDictionary = new Dictionary<string, string>();
                        paramsDictionary["monitorSiteCode"] = monitorSite.monitorSiteCode;
                        // paramsDictionary["monitorSiteName"] = monitorSite.monitorSiteName;
                        MQRCodeDataProtocol fwCallParams = new MQRCodeDataProtocol()
                        {
                            p = "msInfo",
                            d = paramsDictionary
                        };
                        Debug.Write(fw.fwJson.FWJsonHelper.serializeObject(fwCallParams));
                        quickResponseCodeImageFullName = FWQuickResponseCodeHelper.getQuickResponseCodeImageFullName(
                            fw.fwJson.FWJsonHelper.serializeObject(fwCallParams), quickResponseCodeFolderRelativePath,
                            quickResponseCodeImageFullName);



                        if (!String.IsNullOrEmpty(quickResponseCodeImageFullName))
                        {
                            QuickResponseCodeInfo quickResponseCodeInfo = new QuickResponseCodeInfo()
                            {
                                imageFullName = quickResponseCodeImageFullName,
                                imageUrl = FWUrlHelper.getWebSiteRootUrl() + quickResponseCodeFolderRelativePath +
                                           quickResponseCodeImageFullName,
                            };
                            monitorSite.quickResponseCodeInfo = quickResponseCodeInfo;
                        }
                        else
                        {
                            result.infoList.Add("验证码生成失败!");
                        }
                    }
                }
            }
            else
            {
                result.data = null;
                result.status = FWResultStatus.Failure;
                result.infoList.Add("请传入设施主键！");

            }
            return result;
        }

        #endregion

        #region 风机设备反控

        /// <summary>
        /// 查询风机设备列表
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="pageParams"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MBLLEquipment>> queryPageEquipReCtr(string ticket, QueryEquipmentParams queryParams)
        {
            return EquipmentBll.queryPageEquipReCtr(userInfo, queryParams);
        }

        /// <summary>
        /// 设置反控
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="mEntityList"></param>
        /// <returns></returns>
        public FWResult<bool> InsertOrUpdateEquipReCtrList(string ticket, List<MBLLEquipmentReCtrData> mEntityList)
        {
            return EquipmentBll.InsertOrUpdateEquipReCtrList(userInfo, mEntityList);
        }

        /// <summary>
        /// 反控历史列表查询
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 1, isFunction = 0)]
        public FWResult<FWPageData<MBLLEquipmentReCtrData>> queryPageEquipmentReCtrData(string ticket,
            FWPageParams pageParams, QueryEquipmentParams queryParams)
        {
            return EquipmentBll.queryPageEquipmentReCtrData(userInfo, pageParams, queryParams);
        }

        /// <summary>
        /// dru列表查询 sss 2016-9-21
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 1, isFunction = 0)]
        public FWResult<FWPageData<MBLLDtuParamData>> queryPageDtuData(string ticket, FWPageParams pageParams,
            QueryEquipmentParams queryParams)
        {
            return EquipmentBll.queryPageDtuData(userInfo, pageParams, queryParams);
        }

        /// <summary>
        /// DTU参数设置 sss 2016-9-21
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="mEntityList"></param>
        /// <returns></returns>
        public FWResult<bool> SetDtuParamList(string ticket, List<MBLLDtuParamData> mEntityList)
        {
            return EquipmentBll.SetDtuParamList(userInfo, mEntityList);
        }

        #endregion

        #region 监测点位项目

        /// <summary>
        /// 查询监测点项目列表（分页）
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="pageParams">分页参数</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>查询监测点项目列表（分页）</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 1, isFunction = 0)]
        public FWResult<FWPageData<MBLLProject>> queryPageProject(string ticket, FWPageParams pageParams,
            QueryBasicInfoParams queryParams)
        {
            return MBLLProjectBll.queryPageProject(userInfo, pageParams, queryParams);
        }


        /// <summary>
        /// 增加监测点位项目信息
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="mEntity">保存实体</param>
        /// <returns>保存结果</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 1, isFunction = 0)]
        public FWResult<bool> insertBLLProject(string ticket, MBLLProject mEntity)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return MBLLProjectBll.insertBLLProject(request.data, mEntity);
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
        /// 修改监测点项目信息
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="mEntity">保存实体</param>
        /// <returns>保存结果</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 1, isFunction = 0)]
        public FWResult<bool> updateBLLProject(string ticket, MBLLProject mEntity)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return MBLLProjectBll.updateBLLProject(request.data, mEntity);
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
        /// 查询监测点项目信息
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>查询监测点项目信息</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 1, isFunction = 0)]
        public FWResult<List<MBLLProject>> queryProject(string ticket, QueryBasicInfoParams queryParams)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return MBLLProjectBll.queryProject(request.data, queryParams);
            }
            else
            {
                return new FWResult<List<MBLLProject>>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            }
        }

        #endregion

        #region 实时监测 图层 2016.6.6

        public FWResult<List<Data_Canton>> queryRealMonitorSiteStatis(string ticket, string cantonCode)
        {
            return MBLLMonitorSiteBll.queryRealMonitorSiteStatis(userInfo, cantonCode);
        }

        #endregion


        #region 点位加载方法  2016.6.8

        public FWResult<List<Data_Canton>> queryMonitorSiteTree(string ticket)
        {
            return MBLLMonitorSiteBll.queryMonitorSiteTree(userInfo);
        }

        #endregion

        #region 点位 设备关联操作

        public FWResult<bool> AddEquipmentMonitorSiteRelation(string ticket, string equipmentCode,
            string monitorSiteCode)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return MBLLMonitorSiteBll.AddEquipmentMonitorSiteRelation(request.data, equipmentCode, monitorSiteCode);
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

        public FWResult<bool> RemoveEquipmentMonitorSiteRelation(string ticket, string equipmentCode,
            string monitorSiteCode)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return MBLLMonitorSiteBll.RemoveEquipmentMonitorSiteRelation(request.data, equipmentCode,
                    monitorSiteCode);
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

        public FWResult<bool> insertUpdateBLLMonitorSite(string ticket, MBLLMonitorSite mEntity)
        {

            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return MBLLMonitorSiteBll.insertUpdateMBLLMonitorSite(request.data, mEntity);
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

        #region 点位因子

        public FWResult<List<MBas_MonitorSiteMonitorFactor>> queryMonitorSiteFactorList(string ticket,
            string monitorSiteCode)
        {
            return MBLLMonitorSiteMonitorFactorBll.queryMonitorSiteFactorList(userInfo, monitorSiteCode);
        }

        public FWResult<MBas_MonitorSiteMonitorFactor> queryMBasSiteFactor(string ticket, string monitorSiteCode,
            string monitorFactorCode)
        {
            return MBLLMonitorSiteMonitorFactorBll.queryMBasSiteFactor(userInfo, monitorSiteCode, monitorFactorCode);
        }

        public FWResult<bool> deleteMBasSiteFactorByFactorCodeList(string ticket, List<string> monitorFactorCodeList,
            string monitorSiteCode)
        {
            return MBLLMonitorSiteMonitorFactorBll.deleteMBasSiteFactorByFactorCodeList(userInfo, monitorFactorCodeList,
                monitorSiteCode);
        }

        public FWResult<bool> inserOrUpdateMBasSiteFactor(string ticket, MBas_MonitorSiteMonitorFactor mEntity)
        {
            return MBLLMonitorSiteMonitorFactorBll.inserOrUpdateMBasSiteFactor(userInfo, mEntity);
        }

        #endregion



        public FWResult<List<MDicMonitorFactorEx>> queryMDicMonitorFactorExList(string ticket)
        {
            return MBLLMonitorSiteMonitorFactorBll.queryMDicMonitorFactorExList(userInfo);
        }



        #region 移动端服务

        /// <summary>
        /// 查询所有零部件
        /// </summary>
        /// <param name="ticket"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MBLLEquipmentPart>> queryEquipmentPartForMobile(string ticket)
        {
            return EquipmentBll.queryEquipmentPartForMobile(userInfo);
        }

        /// <summary>
        /// 手机端获取 设备信息
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="equipmentCode"></param>
        /// <returns></returns>
        public FWResult<MBLLEquipment> queryEquipmentForMobile(string ticket, string equipmentCode)
        {
            return EquipmentBll.queryEquipmentForMobile(userInfo, equipmentCode);
        }


        public FWResult<bool> quickAddEditMonitorSite(string ticket, MBLLMonitorSite mEntity)
        {

            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return MBLLMonitorSiteBll.quickAddEditMonitorSite(request.data, mEntity);
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

        public FWResult<bool> quickDelMonitorSiteAndEquipment(string ticket, string monitorSiteCode)
        {

            return MBLLMonitorSiteBll.quickDelMonitorSiteAndEquipment(userInfo, monitorSiteCode);
        }


        public FWResult<bool> quickSetPosition(string ticket, MBLLMonitorSite mEntity)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return MBLLMonitorSiteBll.quickSetPosition(request.data, mEntity);
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

        #region  M.零部件模块

        /// <summary>
        /// 设备零部件新增修改
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="mEntity"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> inserOrUpdateMBLLEquipmentPart(string ticket, MBLLEquipmentPart mEntity)
        {
            return EquipmentBll.inserOrUpdateMBLLEquipmentPart(userInfo, mEntity);
        }

        /// <summary>
        /// 查询设备零件实体
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="partCode"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<MBLLEquipmentPart> queryEquipmentPart(string ticket, string partCode)
        {
            return EquipmentBll.queryEquipmentPart(userInfo, partCode);
        }

        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MBLLEquipmentPart>> queryEquipmentPartAll()
        {
            return EquipmentBll.queryEquipmentPartAll();
        }

        /// <summary>
        /// 查询设备列表
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="pageParams"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<MBLLEquipmentPart>> queryPageEquipmentPart(string ticket, FWPageParams pageParams,
            QueryEquipmentPartParams queryParams)
        {
            return EquipmentBll.queryPageEquipmentPart(userInfo, pageParams, queryParams);
        }

        /// <summary>
        /// 删除设备零部件
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="partCodeList"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> deleteMEquipmentPartByPartCodeList(string ticket, List<string> partCodeList)
        {
            return EquipmentBll.deleteMEquipmentPartByPartCodeList(userInfo, partCodeList);
        }

        #endregion

        #region M.设备模块

        /// <summary>
        /// 设备新增修改
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="mEntity"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> inserOrUpdateMBLLEquipment(string ticket, MBLLEquipment mEntity)
        {
            return EquipmentBll.inserOrUpdateMBLLEquipment(userInfo, mEntity);
        }

        /// <summary>
        /// 设备实体
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="equipmentCode"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<MBLLEquipment> queryEquipment(string ticket, string equipmentCode)
        {
            return EquipmentBll.queryEquipment(userInfo, equipmentCode);
        }

        /// <summary>
        /// 通过点位查询 设备
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="monitorSiteCode"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MBLLEquipment>> queryEquipmentByMonitorSite(string ticket, string monitorSiteCode)
        {
            return EquipmentBll.queryEquipmentByMonitorSite(userInfo, monitorSiteCode);
        }


        /// <summary>
        /// 查询设备列表
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="pageParams"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<MBLLEquipment>> queryPageEquipment(string ticket, FWPageParams pageParams,
            QueryEquipmentParams queryParams)
        {
            return EquipmentBll.queryPageEquipment(userInfo, pageParams, queryParams);
        }


        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> updateMBLLEquipmentByEquipmentCodeList(string ticket, BLLEquipment entity,
            List<string> equipmentCodeList)
        {
            return EquipmentBll.updateMBLLEquipmentByEquipmentCodeList(userInfo, entity, equipmentCodeList);
        }

        /// <summary>
        /// 删除设备
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="equipmentCodeList"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> deleteMEquipmentByCodeList(string ticket, List<string> equipmentCodeList)
        {
            return EquipmentBll.deleteMEquipmentByCodeList(userInfo, equipmentCodeList);
        }

        #endregion

        #region M.现场设备状态

        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<MBLLMonitorSite>> queryPageMonitorSiteStatus(string ticket, FWPageParams pageParams,
            QueryBasicInfoParams queryParams)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return MonitorDataAndStatusBll.queryPageMonitorSiteStatus(request.data, pageParams, queryParams);
            }
            else
            {
                return new FWResult<FWPageData<MBLLMonitorSite>>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            }
        }

        #endregion

        #region M.手动录入数据

        /// <summary>
        /// 手机端数据录入
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> importDataByMobile(string ticket, MBLLFactorData mEntity)
        {
            return MonitorDataAndStatusBll.importDataByMobile(userInfo, mEntity);
        }

        /// <summary>
        /// Excel 批量数据导入
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> importDataByExcel(string ticket, string filePath)
        {
            FWResult<bool> result = new FWResult<bool>();
            if (string.IsNullOrEmpty(filePath.Trim()))
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add("Excel文件路径不能为空！");
                return result;
            }
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> userRequest = service.getUserInfo(userInfo);
            if (userRequest != null && userRequest.data != null)
            {
                result = MonitorDataAndStatusBll.importDataByExcel(userRequest.data, filePath);
            }
            else
            {
                result.infoList = userRequest.infoList;
                result.status = userRequest.status;
            }
            return result;
        }

        #endregion

        #region M.现场设备查询

        /// <summary>
        /// 查询现场设备列表（分页）
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="pageParams">分页参数</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>设施点位列表（分页）</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 1, isFunction = 0)]
        public FWResult<FWPageData<MBLLMonitorSite>> queryPageMonitorSite(string ticket, FWPageParams pageParams,
            QueryBasicInfoParams queryParams)
        {
            return MBLLMonitorSiteBll.queryPageMonitorSite(userInfo, pageParams, queryParams);
        }

        /// <summary>
        /// 查询现场设备列表（分页）(修改时间倒序)
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="pageParams">分页参数</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>设施点位列表（分页）</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 1, isFunction = 0)]
        public FWResult<FWPageData<MBLLMonitorSite>> queryPageMonitorSiteByTime(string ticket, FWPageParams pageParams,
            QueryBasicInfoParams queryParams)
        {
            return MBLLMonitorSiteBll.queryPageMonitorSiteByTime(userInfo, pageParams, queryParams);
        }

        [FWAttribute(isVerifyRight = 0, isWriteLog = 1, isFunction = 0)]
        public FWResult<FWPageData<MBLLMonitorSite>> queryPageMonitorSiteByWeb(string ticket, FWPageParams pageParams,
            QueryBasicInfoParams queryParams)
        {
            return MBLLMonitorSiteBll.queryPageMonitorSiteByWeb(userInfo, pageParams, queryParams);
        }


        /// <summary>
        /// 查询现场设备列表
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>查询设施点位列表</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 1, isFunction = 0)]
        public FWResult<List<MBLLMonitorSite>> queryMonitorSite(string ticket, QueryBasicInfoParams queryParams)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return MBLLMonitorSiteBll.queryMonitorSite(request.data, queryParams);
            }
            else
            {
                return new FWResult<List<MBLLMonitorSite>>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            }
        }

        /// <summary>
        /// 现场设备实体查询
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="monitorSiteCode"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 1, isFunction = 0)]
        public FWResult<MBLLMonitorSite> queryMonitorSiteInfo(string ticket, string monitorSiteCode)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return MBLLMonitorSiteBll.queryMonitorSiteInfo(request.data, monitorSiteCode);
            }
            else
            {
                return new FWResult<MBLLMonitorSite>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            }

        }

        /// <summary>
        /// 现场设备分配列表（分页）
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="pageParams">分页参数</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>设施点位列表（分页）</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 1, isFunction = 0)]
        public FWResult<FWPageData<MBLLMonitorSite>> queryPageMonitorSiteAllocator(string ticket,
            FWPageParams pageParams, QueryBasicInfoParams queryParams)
        {
            return MBLLMonitorSiteBll.queryPageMonitorSiteAllocator(userInfo, pageParams, queryParams);
        }

        /// <summary>
        /// 现场设备人员负责分配列表（分页）
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="pageParams">分页参数</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>设施点位列表（分页）</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 1, isFunction = 0)]
        public FWResult<FWPageData<MBLLMonitorSite>> queryPageMonitorSitePersonAllocator(string ticket,
            FWPageParams pageParams, QueryBasicInfoParams queryParams)
        {
            return MBLLMonitorSiteBll.queryPageMonitorSitePersonAllocator(userInfo, pageParams, queryParams);
        }

        #endregion

        #region 地图现场设备查询-状态


        /// <summary>
        /// 列表查询
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="keyWord"></param>
        /// <param name="topNum"></param>
        /// <param name="cantonCode"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MBLLMonitorSite>> queryMonitorSiteEasy(string ticket, string keyWord, int? topNum,
            string cantonCode)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return MonitorDataAndStatusBll.queryMonitorSiteEasy(request.data, keyWord, topNum, cantonCode);
            }
            else
            {
                return new FWResult<List<MBLLMonitorSite>>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            }
        }

        /// <summary>
        /// 地图图层设施实时点位
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="cantonCode"></param>
        /// <param name="statusCode"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MBLLMonitorSite>> queryMonitorSiteRealtimeStatusList(string ticket, string cantonCode,
            string statusCode)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                QueryBasicInfoParams queryParams = new QueryBasicInfoParams()
                {
                    cantonCode = cantonCode,
                    statusCode = statusCode
                };
                return MonitorDataAndStatusBll.queryMonitorSiteStatusListJizhan(request.data, queryParams);
            }
            else
            {
                return new FWResult<List<MBLLMonitorSite>>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            }
        }

        #endregion

        #region 现场设备信息批量级联删除操作

        /// <summary>
        /// 现场设备信息批量级联删除操作
        /// </summary>
        /// <param name="ticket">登录凭证</param>
        /// <param name="monitorSiteCodeList">现场设备主键列表</param>
        /// <returns></returns>
        public FWResult<bool> delMonitorSiteAndEquipmentByCascade(string ticket, List<string> monitorSiteCodeList)
        {
            return MBLLMonitorSiteBll.delMonitorSiteAndEquipmentByCascade(userInfo, monitorSiteCodeList);
        }

        #endregion

        #region app设备管理图片上传功能

        //删除图片以及其对应的缩略图 add by songshasha 2016-11-24
        public FWResult<bool> deleteImg(string imgName)
        {
            FWResult<bool> result = new FWResult<bool>();
            string serverPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "upload");
            try
            {
                string dirpath = string.Format("{0}/{1}", serverPath, imgName);
                File.Delete(dirpath);
                string dirpathThum = string.Format("{0}/{1}", serverPath,
                    imgName.Split('.')[0] + "_thum." + imgName.Split('.')[1]);
                File.Delete(dirpathThum);
                result.data = true;
                result.status = FWResultStatus.Success;
            }

            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        //上传文件（包含图片）  add by songshasha 2016-11-24
        public FWResult<bool> UploadImg(string imgName, string photoAddress)
        {
            string serverPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "upload");
            FWResult<bool> result = new FWResult<bool>();
            try
            {

                byte[] buffer = new byte[0x1000];
                // buffer = Convert.FromBase64String(photoAddress.Replace("data:image/png;base64,", ""));
                buffer = Convert.FromBase64String(photoAddress);
                string fileName = string.Empty;
                fileName = imgName;
                //将图片保存到服务器目录下
                string dirpath = string.Format("{0}/{1}", serverPath, fileName);
                Stream destination = new FileStream(dirpath, FileMode.OpenOrCreate, FileAccess.Write);
                destination.Write(buffer, 0, buffer.Length);
                destination.Close();
                //生成图片压缩后的缩略图
                Bitmap bmp = new Bitmap(dirpath);
                string dirpathThum = string.Format("{0}/{1}", serverPath,
                    fileName.Split('.')[0] + "_thum." + fileName.Split('.')[1]);
                compressImg(bmp, dirpathThum, 5);
                result.data = true;
                result.status = FWResultStatus.Success;

            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Failure;

            }
            return result;

        }

        /// <summary>  
        /// 上传文件  
        /// </summary>  
        /// <param name="source">数据源</param>  
        /// <param name="path">路径</param>  
        private static void UploadFile(MemoryStream source, string path)
        {

            Stream destination = new FileStream(path, FileMode.OpenOrCreate, FileAccess.Write);
            byte[] buffer = new byte[0x1000];
            int numRead;
            while ((numRead = source.Read(buffer, 0, buffer.Length)) > 0)
            {
                destination.Write(buffer, 0, numRead);
            }
            source.Close();
            destination.Close();
        }

        //获取图片服务器路径，不包含文件名，请将文件名补充到url后再发送请求  add by songshasha 2016-11-24
        public string getImgUploadPath()
        {
            string uploadPath = FWConfigHelper.webSiteRelativePath + FWConfigHelper.getValue("uploadFolderPath");
            return uploadPath;
        }

        //压缩图片  add by songshasha 2016-12-07
        public static bool compressImg(System.Drawing.Bitmap iSource, string outPath, int flag)
        {
            //System.Drawing.Bitmap a=new System.Drawing.Bitmap ();
            ImageFormat tFormat = iSource.RawFormat;

            EncoderParameters ep = new EncoderParameters();

            long[] qy = new long[1];

            qy[0] = flag;

            EncoderParameter eParam = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, qy);

            ep.Param[0] = eParam;

            try
            {

                ImageCodecInfo[] arrayICI = ImageCodecInfo.GetImageDecoders();

                ImageCodecInfo jpegICIinfo = null;

                for (int x = 0; x < arrayICI.Length; x++)
                {

                    if (arrayICI[x].FormatDescription.Equals("JPEG"))
                    {

                        jpegICIinfo = arrayICI[x];

                        break;

                    }

                }

                if (jpegICIinfo != null)

                    iSource.Save(outPath, jpegICIinfo, ep);

                else

                    iSource.Save(outPath, tFormat);

                return true;

            }

            catch
            {

                return false;

            }
            finally
            {

                iSource.Dispose();
            }

        }

        #endregion

        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> updateMBLLMonitorSiteHisFactorData(string ticket, List<string> mEntity)
        {
            return MonitorDataAndStatusBll.updateMBLLMonitorSiteHisFactorData(userInfo, mEntity);
        }


        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<MBLLMonitorSiteState>> queryPageMonitorSiteState(string ticket,
            FWPageParams pageParams, string cantonCode, string projectNo, int isDetail)
        {
            return MBLLMonitorSiteBll.queryPageMonitorSiteState(userInfo, pageParams, cantonCode, projectNo, isDetail);
        }


        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<MBLLMonitorSiteState>> queryMonitorSiteStatis(string ticket,
            FWPageParams pageParams, string cantonCode, string projectNo, int isDetail)
        {
            return MBLLMonitorSiteBll.queryMonitorSiteStatis(userInfo, pageParams, cantonCode, projectNo, isDetail);
        }

        public FWResult<bool> quickPreInitMonitorSite(SysBasicManageUserInfo userInfo, MBLLMonitorSite mEntity)
        {
            return MBLLMonitorSiteBll.quickPreInitMonitorSite(userInfo, mEntity);

        }

        public FWResult<string> importMonitorSiteDataByExcel(string ticket, string filePath,string projectNo)
        {
            return MBLLMonitorSiteBll.importMonitorSiteDataByExcel(userInfo, filePath, projectNo);
        }

        public FWResult<string> updateMonitorSiteDataByExcel(string ticket, string filePath)
        {
            return MBLLMonitorSiteBll.updateMonitorSiteDataByExcel(userInfo, filePath);
        }

        public FWResult<FWPageData<MBLLMonitorRunTime>> queryMonitorSiteRunTime(string ticket, FWPageParams pageParams,
            QueryBasicInfoParams queryParams)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return MBLLMonitorSiteBll.queryMonitorSiteRunTime(request.data, pageParams, queryParams);
            }
            else
            {
                return new FWResult<FWPageData<MBLLMonitorRunTime>>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            }


        }
        [FWAttribute(isVerifyRight = 1, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<MBLLMonitorRunTime>> queryMonitorSiteOffTime(string ticket, FWPageParams pageParams,
          QueryBasicInfoParams queryParams)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return MBLLMonitorSiteBll.queryMonitorSiteOffTime(request.data, pageParams, queryParams);
            }
            else
            {
                return new FWResult<FWPageData<MBLLMonitorRunTime>>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            }


        }

        //查询设备更换记录表
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<BllEquipmentChangeList>> queryPageEquipmentChangeRecord(string ticket, FWPageParams pageParams, QueryTaskParams queryParams)
        {
            var request = new SysBasicManageService().getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return MBLLEquipmentChangeRecordBll.queryPageEquipmentChangeRecord(request.data, pageParams, queryParams);
            }
            return new FWResult<FWPageData<BllEquipmentChangeList>>
            {
                infoList = request.infoList,
                status = request.status
            };
        }

        //查询摄像头
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<MFWCarema>> queryPageCamera(string ticket, FWPageParams pageParams, QueryTaskParams queryParams)
        {
            var request = new SysBasicManageService().getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return MFWCaremaBll.QueryPageCamera(request.data, pageParams, queryParams);
            }
            return new FWResult<FWPageData<MFWCarema>>
            {
                infoList = request.infoList,
                status = request.status
            };
        }

        //新增或更新摄像机
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> insertOrUpdateCaremaById(string ticket, MFWCarema mEntity)
        {
            var result = new FWResult<bool>();
            try
            {
                result = MFWCaremaBll.InsertOrUpdateCaremaById(new SysBasicManageService().getUserInfo(userInfo).data, mEntity);
            }
            catch
            {
                result.infoList.Add("服务接口报错");
            }
            return result;
        }

        // 摄像机批量级联删除操作
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> delCameraByIdCascade(string ticket, List<long> cameraIdList)
        {
            var result = new FWResult<bool>();
            try
            {
                result = MFWCaremaBll.DelCameraByIdCascade(new SysBasicManageService().getUserInfo(userInfo).data, cameraIdList);
            }
            catch
            {
                result.infoList.Add("服务接口报错");
            }
            return result;
        }

        //报停设备改为正常
        public FWResult<bool> updateReportEquipment(string ticket, List<MBLLMonitorSite> siteCodeList)
        {
            var result = new FWResult<bool>();
            try
            {
                result = MBLLMonitorSiteBll.updateReportEquipment(userInfo, siteCodeList);
            }
            catch
            {
                result.data = false;
                result.infoList.Add("服务接口报错");
            }
            return result;
        }

        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<string> queryApkVersion()
        {
            FWResult<string> result = new FWResult<string>();
            try
            {
                string apkversion = FWConfigHelper.getValue("apk_version");

                result.data = apkversion;
                result.status = FWResultStatus.Success;
                result.infoList.Add("apk_version");
                return result;
            }
            catch (Exception)
            {
                result.data = "服务接口报错";
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        #region 签名

        [FWAttribute(isVerifyRight = 1, isWriteLog = 1, isFunction = 0)]
        public FWResult<BLLSignature> querySignature(string ticket, int id)
        {
            FWResult<BLLSignature> result = new FWResult<BLLSignature>();
            try
            {
                BLLSignature model= SignatureBLL.querySignature(id);

                result.data = model;
                result.status = FWResultStatus.Success;
                return result;
            }
            catch (Exception)
            {
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        [FWAttribute(isVerifyRight = 1, isWriteLog = 1, isFunction = 0)]
        public FWResult<List<BLLSignature>> querySignatures(string ticket)
        {
            FWResult<List<BLLSignature>> result = new FWResult<List<BLLSignature>>();
            try
            {
                List<BLLSignature> models = SignatureBLL.querySignatures(userInfo.userID);

                result.data = models;
                result.status = FWResultStatus.Success;
                return result;
            }
            catch (Exception ex)
            {
                result.status = FWResultStatus.Failure;
            }
            return result;
        }


        [FWAttribute(isVerifyRight = 1, isWriteLog = 1, isFunction = 0)]
        public FWResult<FWPageData<BLLSignature>> queryPageSignature(string ticket, FWPageParams pageParams,
           QuerySignatureParams queryParams)
        {
            queryParams.userId = userInfo.userID;
            return SignatureBLL.queryPage(pageParams, queryParams);
        }

        [FWAttribute(isVerifyRight = 1, isWriteLog = 1, isFunction = 0)]
        public FWResult<bool> deleteSignature(string ticket, List<BLLSignature> mEntity)
        {
            FWResult<bool> result = new FWResult<bool>();
            try
            {
                bool deleteresult= SignatureBLL.delete(mEntity);
                result.status = FWResultStatus.Success;
                result.data = deleteresult;
                if (!deleteresult)
                {
                    result.status = FWResultStatus.Failure;
                }   
            }
            catch (Exception ex)
            {
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        [FWAttribute(isVerifyRight = 1, isWriteLog = 1, isFunction = 0)]
        public FWResult<bool> addSignature(string ticket, BLLSignature mEntity)
        {
            FWResult<bool> result = new FWResult<bool>();
            try
            {
                mEntity.userId = userInfo.userID;
                bool deleteresult = SignatureBLL.add(mEntity);
                result.status = FWResultStatus.Success;
                result.data = deleteresult;
                if (!deleteresult)
                {
                    result.status = FWResultStatus.Failure;
                }
            }
            catch (Exception)
            {
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        [FWAttribute(isVerifyRight = 1, isWriteLog = 1, isFunction = 0)]
        public FWResult<bool> setDefaultSignature(string ticket, BLLSignature mEntity)
        {
            FWResult<bool> result = new FWResult<bool>();
            try
            {
                bool exeresult = SignatureBLL.setDefault(userInfo.userID, mEntity);
                result.status = FWResultStatus.Success;
                result.data = exeresult;
                if (!exeresult)
                {
                    result.status = FWResultStatus.Failure;
                }
            }
            catch (Exception)
            {
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        [FWAttribute(isVerifyRight = 1, isWriteLog = 1, isFunction = 0)]
        public FWResult<BLLSignature> getDefaultSignature(string ticket)
        {
            FWResult<BLLSignature> result = new FWResult<BLLSignature>();
            try
            {
                BLLSignature exeresult = SignatureBLL.getDefault(userInfo.userID);
                result.status = FWResultStatus.Success;
                result.data = exeresult;
            }
            catch (Exception)
            {
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        #endregion


        #region 零部件更换

        [FWAttribute(isVerifyRight = 1, isWriteLog = 1, isFunction = 0)]
        public FWResult<FWPageData<MBLLEquipmentPartChangeRecord>> queryPagePartRecord(string ticket
            , FWPageParams pageParams, QueryPartRecordParams queryParams)
        {
            return EquipmentPartChangeRecordBLL.queryPage(pageParams, queryParams);
        }
        //

        #endregion


        #region 我的收藏

        [FWAttribute(isVerifyRight = 1, isWriteLog = 1, isFunction = 0)]
        public FWResult<FWPageData<MBLLCollectionData>> queryPageCollectionData(string ticket
            , FWPageParams pageParams, QueryCollectionDataParams queryParams)
        {
            return CollectionDataBll.queryPageData(userInfo.userID,pageParams, queryParams);
        }

        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<MBLLMonitorSite>> queryPageCollectionMonitorSiteStatus(string ticket, FWPageParams pageParams,
            QueryCollectionBasicInfoParams queryParams)
        {
            SysBasicManageService service = new SysBasicManageService();
            FWResult<SysBasicManageUserInfo> request = service.getUserInfo(userInfo);
            if (request != null && request.data != null)
            {
                return CollectionDataBll.queryPageMonitorSiteStatus(request.data, pageParams, queryParams);
            }
            else
            {
                return new FWResult<FWPageData<MBLLMonitorSite>>()
                {
                    infoList = request.infoList,
                    status = request.status
                };
            }
        }

        [FWAttribute(isVerifyRight = 1, isWriteLog = 1, isFunction = 0)]
        public FWResult<bool> insertOrUpdateByCateCode(string ticket, BLLCollectionCategory mEntity)
        {
            return CollectionCategoryBll.insertOrUpdateByCateCode(userInfo, mEntity);
        }

        [FWAttribute(isVerifyRight = 1, isWriteLog = 1, isFunction = 0)]
        public FWResult<bool> insertCateData(string ticket, BLLCollectionData mEntity)
        {
            return CollectionDataBll.insertCateCode(userInfo, mEntity);
        }

        [FWAttribute(isVerifyRight = 1, isWriteLog = 1, isFunction = 0)]
        public FWResult<FWPageData<BLLCollectionCategory>> queryPageCollectionCate(string ticket
            , FWPageParams pageParams)
        {
            return CollectionCategoryBll.queryPageData(userInfo.userID,pageParams);
        }

        [FWAttribute(isVerifyRight = 1, isWriteLog = 1, isFunction = 0)]
        public FWResult<bool> deleteCollectionData(string ticket, List<BLLCollectionData> mEntity)
        {
            return CollectionDataBll.delete(userInfo, mEntity);
        }

        [FWAttribute(isVerifyRight = 1, isWriteLog = 1, isFunction = 0)]
        public FWResult<bool> deleteCollectionCate(string ticket, List<BLLCollectionCategory> mEntity)
        {
            return CollectionCategoryBll.delete(userInfo, mEntity);
        }

        #endregion


        #region 系统更新、app反馈


        public FWResult<List<BLLReleaseNote>> queryAllReleaseNote(string ticket,string type)
        {
            return BLLReleaseNoteBll.queryAll(type);
        }

        public FWResult<bool> insertFeedback(string ticket, BLLFeedback mEntity)
        {
            return BLLFeedbackBll.insert(userInfo,mEntity);
        }

        public FWResult<bool> deleteFeedback(string ticket,List<BLLFeedback> mEntity)
        {
            return BLLFeedbackBll.deleteList(mEntity);
        }

        public FWResult<FWPageData<BLLFeedback>> queryPageFeedback(string ticket,FWPageParams pageParams)
        {
            return BLLFeedbackBll.queryPageData(userInfo.userID,pageParams);
        }
        #endregion


        #region 反控

        /// <summary>
        /// 反控方案
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="pageParams"></param>
        /// <returns></returns>
        public FWResult<FWPageData<BLLControlPlan>> queryControlPlan(string ticket, string name,FWPageParams pageParams)
        {
            return BLLControlPlanBll.queryPageData(userInfo, name, pageParams);
        }

        /// <summary>
        /// 添加反控方案
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="name"></param>
        /// <param name="mEntity"></param>
        /// <returns></returns>
        public FWResult<bool> insertControlPlan(string ticket, MBLLControlPlanAndDetail mEntity)
        {
            return BLLControlPlanBll.insertPlanAndDetail(userInfo, mEntity);
        }

        /// <summary>
        /// 修改反控方案
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="mEntity"></param>
        /// <returns></returns>
        public FWResult<bool> updateControlPlan(string ticket, MBLLControlPlanAndDetail mEntity)
        {
            return BLLControlPlanBll.updatePlanAndDetail(userInfo, mEntity);
        }

        /// <summary>
        /// 删除反控方案
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="mEntity"></param>
        /// <returns></returns>
        public FWResult<bool> deleteControlPlans(string ticket, List<BLLControlPlan> mEntity)
        {
            return BLLControlPlanBll.deletePlanAndDetail(mEntity);
        }

        /// <summary>
        /// 查询反控方案
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="name"></param>
        /// <param name="mEntity"></param>
        /// <returns></returns>
        public FWResult<MBLLControlPlanAndDetail> queryControlPlanDetail(string ticket, string code)
        {
            return BLLControlPlanBll.query(code);
        }

        /// <summary>
        /// 查询反控执行计划
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="pageParams"></param>
        /// <returns></returns>
        public FWResult<FWPageData<MBLLControlPlanExecute>> queryPageControlPlanExecute(string ticket, string isExecute,FWPageParams pageParams)
        {
            return BLLControlPlanExecuteBll.queryPageData(userInfo.userID,isExecute, pageParams);
        }

        /// <summary>
        /// 新增反控执行计划
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="mEntity"></param>
        /// <returns></returns>
        public FWResult<bool> insertControlPlanExecute(string ticket, string planCode)
        {
            return BLLControlPlanExecuteBll.insertPlanExecute(userInfo, planCode);
        }

        /// <summary>
        /// 删除反控执行计划
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="mEntity"></param>
        /// <returns></returns>
        public FWResult<bool> insertControlPlanExecutes(string ticket, List<MBLLControlPlanExecute> mEntity)
        {
            return BLLControlPlanExecuteBll.deletePlanExecute(mEntity);
        }

        /// <summary>
        /// 现场调试
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="monitorSiteCode"></param>
        /// <param name="equipmentType"></param>
        /// <param name="controlCommand"></param>
        /// <returns></returns>
        public FWResult<string> controlTest(string ticket, string monitorSiteCode, string equipmentType, string controlCommand)
        {
            return BLLControlPlanExecuteBll.controlTest(userInfo, monitorSiteCode, equipmentType, controlCommand);
        }

        /// <summary>
        /// 定时执行反控
        /// </summary>
        /// <returns></returns>
        public FWResult<bool> executeControl(string planDetailCode,string executeCode)
        {
            FWResult<bool> result = new FWResult<bool>();
            result.data = true;
            BLLControlPlanExecuteBll.executeControl(planDetailCode, executeCode);
            return result;
        }

        #endregion

        #region 登录

        public FWResult<UserLoginInfo> login(string thirdCode, string userName, string password, string parameters)
        {
            FWResult<UserLoginInfo> userLoginInfo = UserLoginBll.thirdLogin(thirdCode, userName, password, parameters);
            if (userLoginInfo.data!=null)
            {
                bool isNextCheck = needCheckUserLoginRight(userLoginInfo.data.ticket);
                if (isNextCheck)
                {
                    userLoginInfo.data.isLogin = false;
                }
            }
            return userLoginInfo;
        }



        /// <summary>
        /// 是否需要验证登录权限
        /// 1、靖江市内
        /// 2、指定时间距离
        /// 3、无限制
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="mEntity"></param>
        /// <returns></returns>
        public bool needCheckUserLoginRight(string ticket)
        {
            IFWUserInfo fWUserInfo= FWSessionHelper.getUserInfoByTicket(ticket);
            BLLUserLoginRight right = BLLUserLoginRightBll.query(fWUserInfo.userID);
            int curUserLoginRight = 1;
            //需要验证
            if (null!= right)
            {
                curUserLoginRight = right.loginRight;
            }
            if (curUserLoginRight!=3)
            {
                return true;
            }
            return false;
        }

        /// <summary>
        /// 验证登录权限
        /// </summary>
        /// <param name="ticket"></param>
        /// <returns></returns>
        public FWResult<bool> checkUserLoginRight(string ticket,string lon,string lat)
        {
            FWResult<bool> result = new FWResult<bool>();
            float fLon=0, fLat=0;
            if (float.TryParse(lon,out fLon) && float.TryParse(lat,out fLat))
            {
                return BLLUserLoginRightBll.checkUserLogin(userInfo.userID, fLon, fLat);
            }
            else
            {
                result.status = FWResultStatus.Failure;
                result.data = false;
                result.infoList.Add("该账户在当前位置无登录权限");
                return result;
            }
        }

        /// <summary>
        /// 验证反控权限
        /// </summary>
        /// <param name="ticket"></param>
        /// <returns></returns>
        public FWResult<bool> checkUserControlRight(string ticket)
        {
            FWResult<bool> result = new FWResult<bool>();
            FWResult < List < MFWMenu >> fWResult= SysBasicManageBll.getUserMenuBasicManage(userInfo, "webMainMenu", string.Empty, 0);
            if (fWResult.data.Exists(p=>p.mMenuName== "反控管理"))
            {
                result.status = FWResultStatus.Success;
                result.data = true;
                return result;
            }
            else
            {
                result.status = FWResultStatus.Success;
                result.data = false;
                return result;
            }
        }


        #endregion
    }
}
