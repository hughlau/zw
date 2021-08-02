using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using fw.fwDal;
using fw.fwData;
using fw.fwSession;
using fw.m.Common;
using fw.m.operationMaintenance.dal;
using fw.m.operationMaintenance.data;
using fw.m.operationMaintenance.data.entity;
using fw.m.operationMaintenance.data.model;
using fw.m.sysBasicManage.bll;
using fw.m.sysBasicManage.data;

namespace fw.m.operationMaintenance.bll
{
    public class OperationMaintenancePersonMappingMonitorSiteBll
    {
        /// <summary>
        /// 查询运维人员及单位
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        public static FWResult<List<MBLLOperationMaintenancePersonMappingMonitorSite>> queryPagePersonMappingMonitorSiteByPersonOrUnitCode(fwSession.IFWUserInfo userInfo, QueryMBLLOperationMaintenancePersonMappingMonitorSiteParams queryParams)
        {
            FWResult<List<MBLLOperationMaintenancePersonMappingMonitorSite>> result = new FWResult<List<MBLLOperationMaintenancePersonMappingMonitorSite>>();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo) userInfo;
            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            StringBuilder sbSql = new StringBuilder();
            sbSql.Append(@"  					
SELECT t1.[monitorSiteCode]
      ,t1.[monitorSiteName] 
      ,t1.[cantonCode]   
      ,t4.name cantonName
  FROM  [dbo].[BLLMonitorSite] t1
  INNER JOIN   dbo.BLLOperationMaintenancePersonMappingMonitorSite  t2  ON t1.[monitorSiteCode]=t2.[monitorSiteCode]  
  INNER JOIN   dbo.BLLOperationMaintenancePerson t3  ON t2.operationMaintenancePersonCode = t3.operationMaintenancePersonCode AND t3.[isDis]=0 
  LEFT JOIN dbo.FWDictionary t4 ON t1.cantonCode=t4.code AND t4.dictionaryTypeCode='BLLCanton' 
WHERE 1=1 ");
            if (queryParams != null)
            {

                if (!string.IsNullOrEmpty(queryParams.operationMaintenancePersonCode))
                {
                    sbSql.AppendFormat(@" and t3.operationMaintenancePersonCode ='{0}'", FWSqlCommandStaticHelper.checkParam(queryParams.operationMaintenancePersonCode));
                }
                if (!string.IsNullOrEmpty(queryParams.operationMaintenanceUnitCode))
                {
                    sbSql.AppendFormat(@" and t3.operationMaintenanceUnitCode ='{0}'", FWSqlCommandStaticHelper.checkParam(queryParams.operationMaintenanceUnitCode));
                } 
            }

            //Roger 2016/6/1 13:00:02 增加管辖区域
            sbSql.AppendFormat(@" AND  ({0})  ", SysBasicManageBll.CartonToStr("t1.cantonCode", basicUserInfo.cantonCodeList));
            
            sbSql.Append(@" order by t1.[id] asc ");
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sqlCmd.CommandText = sbSql.ToString();
            result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MBLLOperationMaintenancePersonMappingMonitorSite>(sqlCmd);
            result.status = FWResultStatus.Success;
            return result;
        }

    }
}
