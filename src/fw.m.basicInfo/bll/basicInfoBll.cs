using System;
using System.Collections.Generic;
using fw.fwData;
using fw.fwDal;

namespace fw.m.basicInfo.bll
{
    public class basicInfoBll
    {
        public static FWDictionary<string, string> getPropertyNameMapping(string entityName)
        {
            FWDictionary<string, string> propertyNameMapping = new FWDictionary<string, string>();
            if (!string.IsNullOrEmpty(entityName))
            {
                switch (entityName)
                {
                    #region MBLLMonitorSite
                    case "MBLLMonitorSite":
                        propertyNameMapping = new FWDictionary<String, String>() {
                            {"monitorSiteCode","monitorSiteCode"},
                            {"monitorSiteName","monitorSiteName"},
                            {"monitorSiteTypeCode","monitorSiteTypeCode"},
                            {"monitorSiteTypeCodeStr","monitorSiteTypeCodeStr"},
                            {"cantonCode","cantonCode"},
                            {"operateTime","operateTime"},
                            {"householdsCount","householdsCount"},
                            {"longitude","longitude"},
                            {"latitude","latitude"},
                            {"longitudeGps","longitudeGps"},
                            {"latitudeGps","latitudeGps"},
                            {"address","address"}, 
                            {"isDis","isDis"},
                            {"isDel","isDel"},
                            {"householdName","householdName"},
                            {"meterNo","meterNo"},
                            {"meterNum","meterNum"},
                             {"projectNo","projectNo"},
                            {"pumpTypeCode","pumpTypeCode"}, 
                            {"creater","creater"},
                            {"createTime","createTime"},
                            {"updater","updater"},
                            {"updateTime","updateTime"},
                            {"photoAddress","photoAddress"}
                        };
                        break;
                    #endregion

                    #region MBLLMonitorSiteMonitorFactor
                    case "MBLLMonitorSiteMonitorFactor":
                        propertyNameMapping = new FWDictionary<String, String>() {
                        {"id","id"},{"dataID","dataID"} ,{"monitorSiteCode","monitorSiteCode"}
                        ,{"monitorFactorCode","monitorFactorCode"},{"standardUpperLimit","standardUpperLimit"}
                        ,{"standardLowerLimit","standardLowerLimit"},{"ix","ix"}  
                        ,{"rem","rem"},{"isDis","isDis"} ,{"createrID","createrID"}
                       ,{"createTime","createTime"},{"updaterID","updaterID"},{"updateTime","updateTime"}
                       ,{"channelNo","channelNo"} ,{"isSwitch","isSwitch"} ,{"alarmUpperLimit","alarmUpperLimit"},
{"alarmLowerLimit","alarmLowerLimit"},{"equipmentCode","equipmentCode"}
                        };
                        break;
                    #endregion

                    #region MMonitorSiteAlarmItem
                    case "MMonitorSiteAlarmItem":
                        propertyNameMapping = new FWDictionary<string, string>() { 
                        {"dataID","dataID"}, {"monitorSiteCode","monitorSiteCode"}, {"alarmTypeCode","alarmTypeCode"}, {"ix","ix"}
                        ,{"createrID","createrID"}, {"createTime","createTime"}, {"updaterID","updaterID"}, {"updateTime","updateTime"}
                        };
                        break;
                    #endregion

                    #region MBLLEquipmentPart
                    case "MBLLEquipmentPart":
                        propertyNameMapping = new FWDictionary<string, string>() { 
                            {"partCode","partCode"},
                            {"partName","partName"},
                            {"partType","partType"},
                            {"partSpecification","partSpecification"},
                            {"ix","ix"},
                            {"isDel","isDel"},
                            {"creater","creater"},
                            {"createTime","createTime"},
                            {"updater","updater"},
                            {"updateTime","updateTime"},
                            {"recoverType","recoverType" }
                        };
                        break;
                    #endregion

                    #region MBLLEquipment
                    case "MBLLEquipment":
                        propertyNameMapping = new FWDictionary<string, string>() { 
                            {"equipmentCode","equipmentCode"},
                            {"equipmentNo","equipmentNo"},
                            {"equipmentName","equipmentName"},
                            {"cantonCode","cantonCode"},
                            {"equipmentTypeCode","equipmentTypeCode"},
                            {"moduleTypeCode","moduleTypeCode"},
                            {"acceptanceTime","acceptanceTime"}, 
                            {"isScrap","isScrap"},
                            {"isDel","isDel"},
                            {"creater","creater"},
                            {"createTime","createTime"},
                            {"updater","updater"},
                            {"updateTime","updateTime"},
                            {"monitorSiteCode","monitorSiteCode"},
                             {"remark","remark"},
                            {"supplier","supplier" },
                            {"supplierMark","supplierMark" }
                        };
                        break;
                    #endregion

                    #region MBLLEquipmentReCtrData
                    case "MBLLEquipmentReCtrData":
                        propertyNameMapping = new FWDictionary<string, string>() { 
                            {"ReCtrID","ReCtrID"},
                            {"ReCtrSampTime","ReCtrSampTime"},
                            {"equipmentNo","equipmentNo"},
                            {"Action","Action"},
                            {"ActTime","ActTime"},
                            {"ActResult","ActResult"}
                        };
                        break;
                    #endregion

                    #region MBLLProject
                    case "MBLLProject":
                        propertyNameMapping = new FWDictionary<String, String>() {
                            {"projectCode","projectCode"},
                            {"projectName","projectName"},
                             {"projectNo","projectNo"},
                            {"cantonCode","cantonCode"},
                            {"operateTime","operateTime"},
                            {"equipmentAmount","equipmentAmount"},
                            {"longitude","longitude"},
                            {"latitude","latitude"},
                            {"rem","rem"},
                            {"isDel","isDel"},
                            {"createrID","createrID"},
                            {"createTime","createTime"},
                            {"updaterID","updaterID"},
                            {"updateTime","updateTime"}
                        };
                        break;
                    #endregion

                    #region MBas_MonitorSiteMonitorFactor
                    case "MBas_MonitorSiteMonitorFactor":
                        propertyNameMapping = new FWDictionary<String, String>() {
                         {"monitorSiteCode","monitorSiteCode"}
                        ,{"monitorFactorCode","monitorFactorCode"},{"standardUpperLimit","standardUpperLimit"}
                        ,{"standardLowerLimit","standardLowerLimit"},{"ix","ix"}  
                        ,{"rem","rem"},{"isDis","isDis"},{"updateTime","updateTime"},
                       {"alarmUpperLimit","alarmUpperLimit"},
                    {"alarmLowerLimit","alarmLowerLimit"} ,{"channelNo","channelNo"} ,{"isSwitch","isSwitch"} 
                        };
                        break;
                    #endregion

                    #region MFWCarema

                    case "MFWCarema":
                        propertyNameMapping = new FWDictionary<String, String>
                        {
                            {"IPAddress","IPAddress"},
                            {"longitudeGps","longitudeGps"},
                            {"latitudeGps","latitudeGps"},
                            {"cameraName","cameraName"},
                            {"addressName","addressName"}
                        };
                        break;

                    #endregion

                    #region MBLLEquipmentChangeRecord

                    case "MBLLEquipmentChangeRecord":
                        propertyNameMapping = new FWDictionary<String, String>
                        {
                            {"equipmentNoOld","equipmentNoOld"},
                            {"equipmentNoChange","equipmentNoChange"},
                            {"changeTime","changeTime"},
                            {"changerId","changerId"},
                        };
                        break;
                    #endregion
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
    }
}
