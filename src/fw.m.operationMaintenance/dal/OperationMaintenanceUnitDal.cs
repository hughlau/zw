using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwDal;
using fw.m.operationMaintenance.data.entity;
using fw.m.sysManage.data.entity;

namespace fw.m.operationMaintenance.dal
{
    public class OperationMaintenanceUnitDal
    {
        public static void defaultEntity(BLLOperationMaintenanceUnit entity)
        {
            if (entity != null)
            {
                if (string.IsNullOrEmpty(entity.operationMaintenanceUnitCode))
                {
                    entity.operationMaintenanceUnitCode = Guid.NewGuid().ToString();
                }
            }
        }

        public static bool inserOrUpdateByOperationMaintenanceUnitCode(BLLOperationMaintenanceUnit entity, IFWTransaction transaction)
        {
            defaultEntity(entity);
            if (transaction!=null)
            {
                return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<BLLOperationMaintenanceUnit>(transaction,entity, new List<string>() { "operationMaintenanceUnitCode" }).dbResultStatus == FWDBResultStatus.Success; 
            }
            else
            {
                return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<BLLOperationMaintenanceUnit>(entity, new List<string>() { "operationMaintenanceUnitCode" }).dbResultStatus == FWDBResultStatus.Success; 
            }
            
        }

        public static IFWCommand deleteBLLOperationMaintenanceUnitByCodeList(List<string> operationMaintenanceUnitCodeList)
        {
            return FWSqlEntityToFWCommandStaticHelper.delete<BLLOperationMaintenanceUnit>("operationMaintenanceUnitCode in (" + FWSqlCommandStaticHelper.joinToSqlString<string>(operationMaintenanceUnitCodeList) + ")", null);
        } 

        public static IFWCommand updateBLLOperationMaintenanceUnitByCodeList(BLLOperationMaintenanceUnit entity, List<string> operationMaintenanceUnitCodeList)
        {
            return FWSqlEntityToFWCommandStaticHelper.update<BLLOperationMaintenanceUnit>(entity, "operationMaintenanceUnitCode in (" + FWSqlCommandStaticHelper.joinToSqlString<string>(operationMaintenanceUnitCodeList) + ")", null);
        }
    }
}
