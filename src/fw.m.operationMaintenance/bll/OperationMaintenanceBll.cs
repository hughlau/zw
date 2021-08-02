using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwDal;
using fw.fwData;
using fw.m.operationMaintenance.data.model;
using fw.m.sysBasicManage.bll;
using fw.fwSession;
using fw.fwList;
using fw.m.sysBasicManage.data;

namespace fw.m.operationMaintenance.bll
{
    public class OperationMaintenanceBll
    {
        #region 框架映射关系
        public static FWDictionary<string, string> getPropertyNameMapping(string entityName)
        {
            FWDictionary<string, string> propertyNameMapping = new FWDictionary<string, string>();
            if (!string.IsNullOrEmpty(entityName))
            {
                switch (entityName)
                {
                    #region BLLOperationMaintenanceUnit
                    case "MBLLOperationMaintenanceUnit":

                        propertyNameMapping = new FWDictionary<string, string>()
                                            {
                                                {"id","id"},
                                                {"operationMaintenanceUnitCode","operationMaintenanceUnitCode"},
                                                {"operationMaintenanceUnitName","operationMaintenanceUnitName"},
                                                {"photo","photo"},
                                                {"cantonCode","cantonCode"},
                                                {"organizationCode","organizationCode"},
                                                {"legalPerson","legalPerson"},
                                                {"contactPerson","contactPerson"},
                                                {"mobilePhone","mobilePhone"},
                                                {"fax","fax"},
                                                {"eMail","eMail"},
                                                {"zipCode","zipCode"},
                                                {"address","address"},
                                                {"rem","rem"},
                                                {"isDis","isDis"},
                                                {"createrID","createrID"},
                                                {"createTime","createTime"},
                                                {"updaterID","updaterID"},
                                                {"userID","userID"},
                                                {"password","password"},
                                                {"updateTime","updateTime"},// updateTime
                                                {"photoUrl","photoUrl"},
                                                {"unitManagerID","unitManagerID" }
                                            };
                        break;
                    #endregion

                    #region MOperationMaintenanceContract
                    case "MOperationMaintenanceContract":
                        propertyNameMapping = new FWDictionary<string, string>() { 
                        {"operationMaintenanceContractCode","operationMaintenanceContractCode"}
                        , {"operationMaintenanceContractName","operationMaintenanceContractName"}
                        , {"contractNo","contractNo"}
                        , {"effectiveTime","effectiveTime"}
                        , {"failTime","failTime"}
                        , {"operationMaintenanceUnitCode","operationMaintenanceUnitCode"}
                        ,{"rem","rem"}
                        ,{"isDel","isDel"}
                        ,{"isDis","isDis"}
                        ,{"createrID","createrID"}
                        ,{"createTime","createTime"}
                        ,{"updaterID","updaterID"}
                        ,{"updateTime","updateTime"}
                        ,{"cantonCode","cantonCode"}
                        };
                        break;
                    #endregion

                    #region BLLOperationMaintenancePerson
                    case "MBLLOperationMaintenancePerson":

                        propertyNameMapping = new FWDictionary<string, string>()
                           {
                               {"operationMaintenanceUnitCode","operationMaintenanceUnitCode"},
                               {"operationMaintenancePersonCode","operationMaintenancePersonCode"},
                               {"operationMaintenancePersonName","operationMaintenancePersonName"},
                               {"staffNo","staffNo"},
                               {"mobilePhone","mobilePhone"},
                               {"fax","fax"},
                               {"eMail","eMail"},
                               {"zipCode","zipCode"},
                               {"address","address"},
                               {"rem","rem"},
                               {"ix","ix"},
                               {"isDis","isDis"},
                               {"createrID","createrID"},
                               {"createTime","createTime"},
                               {"updaterID","updaterID"},
                               {"updateTime","updateTime"},
                               {"userID","userID"},
                               {"password","password"}
                           };

                        break;
                    #endregion

                    #region MOperationMaintenanceContractMappingMonitorSite
                    case "MOperationMaintenanceContractMappingMonitorSite":
                        propertyNameMapping = new FWDictionary<string, string>() {
                        {"dataID","dataID"}, {"operationMaintenanceContractCode","operationMaintenanceContractCode"}
                        , {"monitorSiteCode","monitorSiteCode"}, {"createrID","createrID"}
                        , {"createTime","createTime"}, {"updaterID","updaterID"}
                        , {"updateTime","updateTime"}
                        };
                        break;
                    #endregion

                    #region MMonitorSiteAlarm

                    case "MMonitorSiteAlarm":
                        propertyNameMapping = new FWDictionary<string, string>()
                        {
                             {"monitorSiteAlarmCode","monitorSiteAlarmCode"},{"monitorSiteAlarmName","monitorSiteAlarmName"}
                             ,{"monitorSiteCode","monitorSiteCode"},{"alarmTypeCode","alarmTypeCode"},{"description","description"}
                             ,{"alarmTime","alarmTime"} ,{"isGenerateTask","isGenerateTask"} ,{"isSolve","isSolve"} ,{"opinion","opinion"} 
                              ,{"rem","rem"},{"isDis","isDis"},{"createrID","createrID"},{"createTime","createTime"},{"updaterID","updaterID"},{"updateTime","updateTime"},{"equipmentCode","equipmentCode"}
                        };
                        break;

                    #endregion

                    #region MOperationMaintenanceTask

                    case "MOperationMaintenanceTask":

                        propertyNameMapping = new FWDictionary<string, string>()
                        {
                            {"operationMaintenanceTaskCode","operationMaintenanceTaskCode"},{"operationMaintenanceTaskName","operationMaintenanceTaskName"}
                            ,{"monitorSiteAlarmCode","monitorSiteAlarmCode"},{"monitorSiteCode","monitorSiteCode"},{"faultTypeCode","faultTypeCode"},{"taskTypeCode","taskTypeCode"}
                            ,{"faultTime","faultTime"},{"prescribeRepairTime","prescribeRepairTime"},{"operationMaintenanceFormFileName","operationMaintenanceFormFileName"},{"operationMaintenanceFormData","operationMaintenanceFormData"}
                            ,{"repairTime","repairTime"},{"operationMaintenancePersonCode","operationMaintenancePersonCode"},{"receiveTime","receiveTime"}
                            ,{"status","status"},{"isSolve","isSolve"},{"isGoSite","isGoSite"},{"opinion","opinion"}
                            ,{"rem","rem"},{"isDis","isDis"},{"createrID","createrID"},{"createTime","createTime"},{"updaterID","updaterID"},{"updateTime","updateTime"}
                            ,{"operationMaintenanceTaskExecId","operationMaintenanceTaskExecId"},{"equipmentCode","equipmentCode"},{"remark","remark"},{"GPS","GPS"},{"imgName","imgName"}
                        };
                        break;

                    case "MDailyMaintenanceTask":

                        propertyNameMapping = new FWDictionary<string, string>()
                        {
                            {"operationMaintenanceTaskCode","operationMaintenanceTaskCode"},{"operationMaintenanceTaskName","operationMaintenanceTaskName"},{"monitorSiteCode","monitorSiteCode"},{"operationMaintenanceFormData","operationMaintenanceFormData"}
                            ,{"operationMaintenancePersonCode","operationMaintenancePersonCode"},{"status","status"},{"isSolve","isSolve"},{"rem","rem"},{"isDis","isDis"},{"createrID","createrID"},{"createTime","createTime"},{"updaterID","updaterID"},{"updateTime","updateTime"}
                            ,{"equipmentCode","equipmentCode"},{"remark","remark"},{"GPS","GPS"},{"imgName","imgName"},{"meterNum","meterNum"},{"operationContent","operationContent"},{"operationContentID","operationContentID"},{"others","others"},{"maintainers","maintainers"}
                            ,{"inclusionRemoval_F","inclusionRemoval_F"},{"anaerobicFilter_F","anaerobicFilter_F"},{"settlingChamber_F","settlingChamber_F"},{"inclusionRemoval_D","inclusionRemoval_D"} ,{"anaerobicFilter_D","anaerobicFilter_D"} ,{"settlingChamber_D","settlingChamber_D"}
                            ,{"recorder","recorder"},{"recorder_imgName","recorder_imgName"},{"operationCleanRecordCode","operationCleanRecordCode"},{"responsibleParty","responsibleParty"},{"damagedContent","damagedContent"},{"isRecovery","isRecovery"},{"recoveryTime","recoveryTime"}
                            ,{"recoveryPeople","recoveryPeople"},{"recoveryPeopleId","recoveryPeopleId"},{"responsiblePartyId","responsiblePartyId"},{"damagedContentId","damagedContentId"},{"IRDetailId","IRDetailId"},{"IRDetail","IRDetail"}
                            ,{"xDoc","xDoc"},{"isNeedClean","isNeedClean"},{"isBackflow","isBackflow"},{"backFlowNote","backFlowNote"},{"cleanNote","cleanNote"},{"responsibleBody","responsibleBody"},{"damagedContentDetail","damagedContentDetail"},{"damagedItemDetails","damagedItemDetails"}
                            ,{"reviewer","reviewer"},{"reviewer_imgName","reviewer_imgName"},{ "water_COD","water_COD"},{ "water_BOD","water_BOD"},{ "water_TP","water_TP"},{"water_TN","water_TN" },{ "water_SS","water_SS"},{ "water_NH34","water_NH34"},{ "isInocation","isInocation"}};
                        break;

                    case "MBllRealTimeData":

                        propertyNameMapping = new FWDictionary<string, string>()
                        {
                            {"ltuMac","ltuMac"},{"wKqbCurValue","wKqbCurValue"}
                            
                        };
                        break;

                    case "MBLLOperationMaintenanceRecords":

                        propertyNameMapping = new FWDictionary<string, string>()
                        {
                            {"operationMaintenanceTaskCode","operationMaintenanceTaskCode"},
                            {"operationMaintenanceRecordCode","operationMaintenanceRecordCode"},
                            {"monitorSiteCode","monitorSiteCode"},
                            {"createTime","createTime"},
                            {"description","description"},
                            {"createrID","createrID"},
                            {"photoAddress","photoAddress"},
                            {"status","status"},
                            {"GPS","GPS"},
                            {"weather","weather"},
                            {"partsChangedList","partsChangedList"},
                            {"faultDetails","faultDetails"},
                            {"faultReason","faultReason"},
                            {"solveMethod","solveMethod"},
                            {"solveReasult","solveReasult"},
                            {"unsolveReason","unsolveReason"},
                            {"maintainSuggest","maintainSuggest"},
                            {"maintainers","maintainers"},
                            {"recorder","recorder"},
                            {"recorder_imgName","recorder_imgName"},
                            {"oprType","oprType"},
                            {"omTime","omTime"},
                            {"isdel","isdel"},
                            {"reportTime","reportTime" },
                            {"reviewer","reviewer" },
                            {"reviewer_imgName","reviewer_imgName" }
                        };
                        break;
                    case "MBllMonitorSiteCleanRecord":

                        propertyNameMapping = new FWDictionary<string, string>()
                        {
                            {"operationCleanRecordCode","operationCleanRecordCode"},
                            {"monitorSiteCode","monitorSiteCode"},
                             {"operationMaintenanceTaskCode","operationMaintenanceTaskCode"},
                            {"weather","weather"},
                            {"inclusionRemoval_F","inclusionRemoval_F"},
                            {"inclusionIsClean_F","inclusionIsClean_F"},
                            {"anaerobicFilter_F","anaerobicFilter_F"},
                            {"filterIsClean_F","filterIsClean_F"},
                            {"settlingChamber_F","settlingChamber_F"},
                            {"chamberIsClean_F","chamberIsClean_F"},
                            {"inclusionRemoval_D","inclusionRemoval_D"},
                            {"inclusionIsClean_D","inclusionIsClean_D"},
                            {"anaerobicFilter_D","anaerobicFilter_D"},
                            {"filterIsClean_D","filterIsClean_D"},
                            {"settlingChamber_D","settlingChamber_D"},
                            {"chamberIsClean_D","chamberIsClean_D"},
                            {"remark_F","remark_F"},
                            {"remark_D","remark_D"},
                            {"maintainers","maintainers"},
                            {"recorder","recorder"},
                            {"recorder_imgName","recorder_imgName"},
                            {"createTime","createTime"},
                            {"createrID","createrID"},
                            {"updaterID","updaterID"},
                            {"updateTime","updateTime"},
                            {"imgName","imgName"},
                            {"isdel","isdel"},
                            {"reviewer","reviewer" },
                            {"reviewer_imgName","reviewer_imgName" }
                        };
                        break;
                    #endregion

                    #region BLLOperationMaintenancePersonAlarmReceiveItem
                    case "MBLLOperationMaintenancePersonAlarmReceiveItem":
                        propertyNameMapping = new FWDictionary<string, string>()
                       {
                           {"id","id"},
                           {"dataID","dataID"},
                           {"operationMaintenancePersonCode","operationMaintenancePersonCode"},
                           {"alarmReceiveTypeCode","alarmReceiveTypeCode"},
                           {"ix","ix"},
                           {"createrID","createrID"},
                           {"createTime","createTime"},
                           {"updaterID","updaterID"},
                           {"mUpdateTime","updateTime"} 
                       };
                        break;
                    #endregion

                    #region BLLOperationMaintenancePersonMappingMonitorSite

                    case "MBLLOperationMaintenancePersonMappingMonitorSite":
                        propertyNameMapping = new FWDictionary<string, string>()
   {
       {"id","id"},
       {"dataID","dataID"},
       {"operationMaintenancePersonCode","operationMaintenancePersonCode"},
       {"monitorSiteCode","monitorSiteCode"},
       {"createrID","createrID"},
       {"createTime","createTime"},
       {"updaterID","updaterID"},
       {"updateTime","updateTime"}// updateTime
   };
                        break;
                    #endregion

                    #region MBLLMonitorSiteHisData
                    //
                    case "MBLLMonitorSiteHisData":
                        propertyNameMapping = new FWDictionary<string, string>()
                       {
                           
                           {"monitorTime","monitorTime"},
                           {"monitorSiteCode","monitorSiteCode"},
                           {"monitorFactorCode","monitorFactorCode"},
                           {"monitorValue","monitorValue"},
                           {"dataSource","dataSource"},
                           {"dataState","dataState"},
                           {"createTime","createTime"},
                           {"updaterID","updaterID"},
                           {"mUpdateTime","updateTime"}// updateTime
                       };
                        break;
                    #endregion

                    #region MBLLMonitorSiteRealtimeData
                    //BLLMonitorSiteRealtimeData
                    case "MBLLMonitorSiteRealtimeData":
                        propertyNameMapping = new FWDictionary<string, string>()
   {
 
       {"monitorSiteCode","monitorSiteCode"},
       {"monitorFactorCode","monitorFactorCode"},
       {"monitorTime","monitorTime"},
       {"monitorValue","monitorValue"},
       {"createTime","createTime"},
       {"dataSource","dataSource"},
       {"mDataState","dataState"},// dataState,
       {"equipmentCode","equipmentCode"}
       
   };
                        break;
                    #endregion

                    #region MBLLMonitorSiteRunningTimeData
                    //BLLMonitorSiteRunningTimeData
                    case "MBLLMonitorSiteRunningTimeData":
                        propertyNameMapping = new FWDictionary<string, string>()
   {
 
       {"monitorSiteCode","monitorSiteCode"},
       {"monitorSiteStartTime","monitorSiteStartTime"},
       {"monitorSiteStopTime","monitorSiteStopTime"},
       {"mInterval","interval"}// interval
   };
                        break;
                    #endregion

                    #region MBLLOperationMaintenanceFormTemplate
                    //BLLOperationMaintenanceFormTemplate
                    case "MBLLOperationMaintenanceFormTemplate":
                        propertyNameMapping = new FWDictionary<string, string>()
   {
 
       {"operationMaintenanceFormTemplateCode","operationMaintenanceFormTemplateCode"},
       {"operationMaintenanceTaskName","operationMaintenanceTaskName"},
       {"alarmTypeCode","alarmTypeCode"},
       {"operationMaintenanceFormFileName","operationMaintenanceFormFileName"},
       {"rem","rem"},
       {"isDis","isDis"},
       {"createrID","createrID"},
       {"createTime","createTime"},
       {"updaterID","updaterID"},
       {"mUpdateTime","updateTime"}// updateTime
   };
                        break;
                    #endregion

                    case "MBLLOperationMaintenanceTaskExec":
                        propertyNameMapping = new FWDictionary<String, String>() {
                            {"id","id"},
                            {"operationMaintenanceTaskExecId","operationMaintenanceTaskExecId"},
                            {"operationMaintenanceTaskPlanId","operationMaintenanceTaskPlanId"},
                            {"operationMaintenanceTaskExecName","operationMaintenanceTaskExecName"},
                            {"operationYear","operationYear"},
                            {"operationMonth","operationMonth"},
                            {"isValid","isValid"},
                            {"status","status"},
                            {"formTime","formTime"},
                            {"execTime","execTime"},
                            {"endTime","endTime"},
                            {"createrID","createrID"},
                            {"createTime","createTime"},
                            {"updaterID","updaterID"},
                            {"updateTime","updateTime"}
                        };
                        break;
                    case "MBLLOperationMaintenanceTaskPlan":
                        propertyNameMapping = new FWDictionary<String, String>() {
                            {"id","id"},
                            {"operationMaintenanceTaskPlanId","operationMaintenanceTaskPlanId"},
                            {"operationMaintenanceTaskPlanName","operationMaintenanceTaskPlanName"},
                            {"planType","planType"},
                            {"frequencyType","frequencyType"},
                            {"startMonth","startMonth"},
                            {"startDay","startDay"},
                            {"endMonth","endMonth"},
                            {"endDay","endDay"},
                            {"operationMaintenanceUnitCode","operationMaintenanceUnitCode"},
                            {"operationMaintenancePersonCode","operationMaintenancePersonCode"},
                            {"createrID","createrID"},
                            {"createTime","createTime"},
                            {"updaterID","updaterID"},
                            {"updateTime","updateTime"},
                            {"isValid","isValid"},
                            {"remark","remark"}
                        };
                        break;
                    case "MBLLOperationMaintenanceTaskPlanD":
                        propertyNameMapping = new FWDictionary<String, String>() {
                            {"id","id"},
                            {"operationMaintenanceTaskPlanDId","operationMaintenanceTaskPlanDId"},
                            {"operationMaintenanceTaskPlanId","operationMaintenanceTaskPlanId"},
                            {"monitorSiteCode","monitorSiteCode"},
                            {"isValid","isValid"},
                            {"createrID","createrID"},
                            {"createTime","createTime"},
                            {"updaterID","updaterID"},
                            {"updateTime","updateTime"}
                        };
                        break;
                    case "MBLLOperationMaintenanceEquipmentPart":
                        propertyNameMapping = new FWDictionary<String, String>() {
                            {"id","id"},
                            {"OMEP_ID","OMEP_ID"},
                            {"operationMaintenanceTaskCode","operationMaintenanceTaskCode"},
                            {"partCode","partCode"},
                            {"changeNum","changeNum"},
                            {"creater","creater"},
                            {"createTime","createTime"},
                            {"updater","updater"},
                            {"updateTime","updateTime"}
                        };
                        break;


                }
            }
            return propertyNameMapping;
        }

        public static T convertEntity<T>(Object obj)
        {
            return FWEntityObject.convertEntity<T>(obj, getPropertyNameMapping(obj.GetType().Name));
        }

        public static List<T> convertEntityList<T>(List<Object> objList)
        {
            List<T> tList = new List<T>();
            foreach (var obj in objList)
            {
                tList.Add(convertEntity<T>(obj));
            }
            return tList;

        }
        #endregion

        #region 监测点位行政区级别加载

        /// <summary>
        /// 传入顶级行政区codelist  
        /// </summary>
        /// <param name="cantonCodeList"></param>
        /// <returns></returns>
        public static List<MCantonData> getCantonTreeList(List<string> cantonCodeList)
        {
            List<MCantonData> result = new List<MCantonData>();
            StringBuilder sb = new StringBuilder();
            #region  获取数据行政区数据

            sb.AppendFormat(@"   
SELECT  
t1.[code]   cantonCode
,t1.[pCode]   pCantonCode
,t1.[name]   cantonName  
,t2.longitude [posX]
,t2.latitude [posY]  
FROM  [dbo].[FWDictionary] t1 
LEFT JOIN FWDictionary_BLLCanton t2 ON t1.[dataID]=t2.[dataID]
WHERE  t1.[dictionaryTypeCode] = '{0}'  AND  ISNULL(T1.[isDis],0)=0  ", DictionaryTypeCodeSettings.BLLCanton);
            if (cantonCodeList != null && cantonCodeList.Count > 0)
            {
                sb.AppendFormat(" and ({0})  ", SysBasicManageBll.CartonToStr(" t1.code", cantonCodeList));
            }
            sb.AppendFormat(" order by code");
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            fwSqlCommand.CommandText = sb.ToString();
            #endregion
            try
            {
                result = FWSqlEntityToFWCommandStaticHelper.queryList<MCantonData>(fwSqlCommand);
            }
            catch (Exception ex)
            {

                result = null;
            }
            return result;
        }
        #endregion

        #region 获取树形行政区列表
        public static FWResult<List<MCantonData>> queryMonitorSiteTree(IFWUserInfo userInfo, string personCode, string contractCode, string action)
        {
            FWResult<List<MCantonData>> result = new FWResult<List<MCantonData>>();
            List<MMonitorSite> monitorsites = new List<MMonitorSite>();
            try
            {
                var cantonList = getCantonTreeList(null);
                if (string.IsNullOrEmpty(personCode) && string.IsNullOrEmpty(contractCode))
                {
                    //获取所有 或者企业所有
                    monitorsites = queryMonitorSiteForSelect(userInfo, action);
                }
                else if (!string.IsNullOrEmpty(personCode))
                {
                    monitorsites = queryPersonMonitorSite(userInfo, personCode, action);
                }
                else if (!string.IsNullOrEmpty(contractCode))
                {
                    monitorsites = queryContractMonitorSite(userInfo, contractCode, action);
                }
                var cantonTreeList = FWListHelper<MCantonData>.toTree(cantonList, "pCantonCode", "cantonCode", "childDataList", "BLLCanton");
                //获取种植历史记录
                monitorsiteTreeDataTraversalSummary(cantonTreeList, monitorsites);
                result.data = cantonTreeList;
                //遍历获取
                result.status = FWResultStatus.Success;

            }
            catch (Exception ex)
            {

                result.data = null;
                result.status = FWResultStatus.Error;
                result.infoList.Add(ex.Message);
            }
            //获取数据


            return result;
        }
        private static void monitorsiteTreeDataTraversalSummary(List<MCantonData> cantonList, List<MMonitorSite> monitorsites)
        {
            foreach (var item in cantonList)
            {
                if (item.childDataList != null && item.childDataList.Count > 0)
                {
                    monitorsiteTreeDataTraversalSummary(item.childDataList, monitorsites);
                }
                else
                {
                    var siteStatusList = monitorsites.Where(p => p.cantonCode.Equals(item.cantonCode)).ToList();
                    item.monitorsites = siteStatusList;
                }
            }
        }

        #endregion

        #region 监测点位列表获取

        //获取数据 
        public static List<MMonitorSite> queryPersonMonitorSite(IFWUserInfo userInfo, string personCode, string action)
        {
            List<MMonitorSite> result = new List<MMonitorSite>();

            //条件判断 逻辑过滤

            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            if (string.IsNullOrEmpty(personCode))
            {
                sbSql.AppendFormat(@" SELECT 
t1.[monitorSiteCode]
,t1.[monitorSiteName]
,t1.[equipmentNo]
,t1.[cantonCode]
,t1.[operateTime]
,t1.[address]
,t1.[householdsCount]
,t1.[longitude]
,t1.[latitude]  
,0 isSelected
FROM  [dbo].[BLLMonitorSite]  t1  
WHERE ISNULL(t1.isDel,0)=0 ", FWSqlCommandStaticHelper.checkParam(personCode));
            }
            else
            {
                sbSql.AppendFormat(@" SELECT 
t1.[monitorSiteCode]
,t1.[monitorSiteName]
,t1.[equipmentNo]
,t1.[cantonCode]
,t1.[operateTime]
,t1.[address]
,t1.[householdsCount]
,t1.[longitude]
,t1.[latitude]  
,case when  t2.[dataID] IS NULL then 0
ELSE 1 END isSelected
FROM  [dbo].[BLLMonitorSite]  t1
LEFT JOIN   dbo.BLLOperationMaintenancePersonMappingMonitorSite t2 
ON t1.[monitorSiteCode]=t2.[monitorSiteCode]   and t2.operationMaintenancePersonCode='{0}'
WHERE ISNULL(t1.isDel,0)=0 ", FWSqlCommandStaticHelper.checkParam(personCode));
            }

            sqlCmd.CommandText = sbSql.ToString();

            try
            {
                result = FWSqlEntityToFWCommandStaticHelper.queryList<MMonitorSite>(sqlCmd);
            }
            catch (Exception ex)
            {

                result = null;
            }
            return result;
        }
        public static List<MMonitorSite> queryContractMonitorSite(IFWUserInfo userInfo, string contractCode, string action)
        {
            List<MMonitorSite> result = new List<MMonitorSite>();

            //条件判断 逻辑过滤

            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            //新合同 加载所有剩余点位
            if (string.IsNullOrEmpty(contractCode))
            {
                sbSql.AppendFormat(@" 
SELECT 
t1.[monitorSiteCode]
,t1.[monitorSiteName]
,t1.[equipmentNo]
,t1.[cantonCode]
,t1.[operateTime]
,t1.[address]
,t1.[householdsCount]
,t1.[longitude]
,t1.[latitude]  
,0 isSelected
FROM  [dbo].[BLLMonitorSite]  t1  
WHERE ISNULL(t1.isDel,0)=0 
AND NOT EXISTS (  
	SELECT  *  FROM  [dbo].[BLLOperationMaintenanceContractMappingMonitorSite] cms
	where  cms.[monitorSiteCode]=t1.[monitorSiteCode]
)
");
            }
            else
            {
                sbSql.AppendFormat(@" SELECT 
t1.[monitorSiteCode]
,t1.[monitorSiteName]
,t1.[equipmentNo]
,t1.[cantonCode]
,t1.[operateTime]
,t1.[address]
,t1.[householdsCount]
,t1.[longitude]
,t1.[latitude]  
,case when  t2.[dataID] IS NULL then 0
ELSE 1 END isSelected
FROM  [dbo].[BLLMonitorSite]  t1
LEFT JOIN   dbo.BLLOperationMaintenanceContractMappingMonitorSite t2 
ON t1.[monitorSiteCode]=t2.[monitorSiteCode]   and t2.operationMaintenanceContractCode='{0}'
WHERE ISNULL(t1.isDel,0)=0 ", FWSqlCommandStaticHelper.checkParam(contractCode));
                if ( !string.IsNullOrEmpty(action) && action.Equals("view"))
                {
                    sbSql.AppendFormat(@" and  t2.[dataID] IS not NULL ");
                }
                else
                {
                    sbSql.AppendFormat(@"   
AND NOT EXISTS (  
	SELECT  *  FROM  [dbo].[BLLOperationMaintenanceContractMappingMonitorSite] cms
	where  cms.[monitorSiteCode]=t1.[monitorSiteCode]  AND cms.[operationMaintenanceContractCode]<>'{0}'
)   ", FWSqlCommandStaticHelper.checkParam(contractCode) );
                }
            }
            sqlCmd.CommandText = sbSql.ToString();
            try
            {
                result = FWSqlEntityToFWCommandStaticHelper.queryList<MMonitorSite>(sqlCmd);
            }
            catch (Exception ex)
            {

                result = null;
            }
            return result;
        }


        public static List<MMonitorSite> queryMonitorSiteForSelect(IFWUserInfo userInfo, string action)
        {
            List<MMonitorSite> result = new List<MMonitorSite>();

            //条件判断 逻辑过滤

            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@" 
SELECT 
monitorSite.[monitorSiteCode]
,monitorSite.[monitorSiteName]
,monitorSite.[equipmentNo]
,monitorSite.[cantonCode]
,monitorSite.[operateTime]
,monitorSite.[address]
,monitorSite.[householdsCount]
,monitorSite.[longitude]
,monitorSite.[latitude]   
FROM  [dbo].[BLLMonitorSite]  monitorSite  
WHERE ISNULL(monitorSite.isDel,0)=0  

");
            if (!string.IsNullOrEmpty(action) && action.Equals("all"))
            {

            }
            else
            {
                //系统过滤  合同分配的不显示 用于合同选择
                sbSql.AppendFormat(@" AND  NOT  EXISTS (
	SELECT t2.[monitorSiteCode] FROM  [dbo].[BLLOperationMaintenanceContract] t1
	INNER JOIN [dbo].[BLLOperationMaintenanceContractMappingMonitorSite] t2  
	ON t1.[operationMaintenanceContractCode]= t2.[operationMaintenanceContractCode]
	WHERE  t2.[monitorSiteCode]=monitorSite.[monitorSiteCode]   AND ISNULL(T1.ISDIS,0)=0
)  ");
            }

            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            //企业点位过滤  2016.6.21
            if (!string.IsNullOrEmpty(basicUserInfo.operationMaintenanceUnitCode))
            {
                sbSql.AppendFormat(@" AND  EXISTS (
	SELECT t2.[monitorSiteCode] FROM  [dbo].[BLLOperationMaintenanceContract] t1
	INNER JOIN [dbo].[BLLOperationMaintenanceContractMappingMonitorSite] t2  
	ON t1.[operationMaintenanceContractCode]= t2.[operationMaintenanceContractCode]
	WHERE  t2.[monitorSiteCode]=monitorSite.[monitorSiteCode]  AND t1.operationMaintenanceUnitCode='{0}'
)  ", FWSqlCommandStaticHelper.checkParam(basicUserInfo.operationMaintenanceUnitCode));
            }
            sqlCmd.CommandText = sbSql.ToString();



            try
            {
                result = FWSqlEntityToFWCommandStaticHelper.queryList<MMonitorSite>(sqlCmd);
            }
            catch (Exception ex)
            {

                result = null;
            }
            return result;
        }
        #endregion

    }
}
