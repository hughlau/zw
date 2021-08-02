using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwDal;
using fw.m.operationMaintenance.data.entity;
using fw.m.userLogin.data.entity;

namespace fw.m.operationMaintenance.dal
{
    public class OperationMaintenancePersonDal
    {
        public static void defaultEntity(BLLOperationMaintenancePerson entity)
        {
            if (entity != null)
            {
                if (string.IsNullOrEmpty(entity.operationMaintenancePersonCode))
                {
                    entity.operationMaintenancePersonCode = Guid.NewGuid().ToString();
                } 
            }
        }

        public static IFWDBResult inserOrUpdateOperationMaintenanceByPersonCode(BLLOperationMaintenancePerson entity, IFWTransaction transaction)
        {
            defaultEntity(entity); 
            if (transaction != null)
            {
                return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<BLLOperationMaintenancePerson>(transaction, entity, new List<string>() { "operationMaintenancePersonCode" }, null);
            }
            else
            {
                return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<BLLOperationMaintenancePerson>(entity, new List<string>() { "operationMaintenancePersonCode" }, null);
            }
 
        }

        public static IFWCommand deleteBLLOperationMaintenancePersonByCodeList(List<string> operationMaintenancePersonCodeList)
        {
            return FWSqlEntityToFWCommandStaticHelper.delete<BLLOperationMaintenancePerson>("operationMaintenancePersonCode in (" + FWSqlCommandStaticHelper.joinToSqlString<string>(operationMaintenancePersonCodeList) + ")", null);
        }

        public static IFWCommand updateBLLOperationMaintenancePersonByCodeList(BLLOperationMaintenancePerson entity, List<string> operationMaintenancePersonCodeList)
        {
            return FWSqlEntityToFWCommandStaticHelper.update<BLLOperationMaintenancePerson>(entity, "operationMaintenancePersonCode in (" + FWSqlCommandStaticHelper.joinToSqlString<string>(operationMaintenancePersonCodeList) + ")", null);
        }

        public static IFWCommand inserOperationMaintenancePerson(BLLOperationMaintenancePerson entity)
        {
            return FWSqlEntityToFWCommandStaticHelper.insert<BLLOperationMaintenancePerson>(entity);
        }


        public static IFWCommand updateOperationMaintenancePerson(BLLOperationMaintenancePerson entity)
        {
            return FWSqlEntityToFWCommandStaticHelper.update<BLLOperationMaintenancePerson>(entity,
                string.Format(@"operationMaintenancePersonCode ='{0}' ", entity.operationMaintenancePersonCode), null);
        }

        #region 报警接收项

        public static IFWCommand deleteOperationMaintenancePersonAlarmReceiveItemByPersonCode(List<string> operationMaintenancePersonCodeList)
        {
            return FWSqlEntityToFWCommandStaticHelper.delete<BLLOperationMaintenancePersonAlarmReceiveItem>("operationMaintenancePersonCode in (" + FWSqlCommandStaticHelper.joinToSqlString<string>(operationMaintenancePersonCodeList) + ")", null);
        }

        public static IFWCommand inserOperationMaintenancePersonAlarmReceiveItem(BLLOperationMaintenancePersonAlarmReceiveItem entity)
        {
            return FWSqlEntityToFWCommandStaticHelper.insert<BLLOperationMaintenancePersonAlarmReceiveItem>(entity);
        } 
        #endregion


        public static IFWDBResult insertOrUpdateByUserID(FWUserLogin entity, IFWTransaction transaction)
        {
            //defaultEntity(entity);
            if (transaction != null)
            {
                return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<FWUserLogin>(transaction, entity, new List<string>() { "userID" }, new List<string>() { "userName" });
            }
            else
            {
                return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<FWUserLogin>(entity, new List<string>() { "userID" }, new List<string>() { "userName" });
            }
        }
    }
}
