using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwDal;
using fw.fwData;
using fw.fwSession;
using fw.m.operationMaintenance.data.entity;

namespace fw.m.operationMaintenance.bll
{
    public class OperationMaintenanceFormTemplateBll
    {
        /// <summary>
        /// 查询运维模板
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="keyWord"></param>
        /// <returns></returns>
        public static FWResult<List<MBLLOperationMaintenanceFormTemplate>> queryMBLLOperationMaintenanceFormTemplateList(IFWUserInfo userInfo, string keyWord)
        {
            FWResult<List<MBLLOperationMaintenanceFormTemplate>> result = new FWResult<List<MBLLOperationMaintenanceFormTemplate>>();
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            StringBuilder sqlStringBuilder = new StringBuilder();
            sqlStringBuilder.AppendFormat(@" 
with tb as (
	select * from [dbo].[FWDictionary] where ISDIS=0 and [dictionaryTypeCode] = 'BIZFaultType'
)
SELECT 
t2.[operationMaintenanceFormTemplateCode]
,t2.[operationMaintenanceTaskName]
,tb.code [alarmTypeCode]
,tb.[name] [alarmTypeName]
,t2.[operationMaintenanceFormFileName]
,t2.[rem]
,t2.[isDis]
,t2.[createrID]
,t2.[createTime]
,t2.[updaterID]
,t2.[updateTime]
FROM  tb  LEFT  JOIN  [dbo].[BLLOperationMaintenanceFormTemplate] t2 
ON tb.code =t2.[alarmTypeCode]  AND isnull(t2.ISDIS,0)=0
WHERE 1<>1 ");
            if (!string.IsNullOrEmpty(keyWord))
            {
                //sqlStringBuilder.AppendFormat(@" or operationMaintenanceUnitCode ='{0}'",
                //    FWSqlCommandStaticHelper.checkParam(queryParams.operationMaintenanceUnitCode));
            }
            fwSqlCommand.CommandText = sqlStringBuilder.ToString();
            result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MBLLOperationMaintenanceFormTemplate>(fwSqlCommand);
            result.status = FWResultStatus.Success;
            return result;
        }
    }
}
