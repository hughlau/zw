using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwDal;
using fw.m.operationMaintenance.data.entity;

namespace fw.m.operationMaintenance.dal
{
    public class OperationMaintenanceContractDal
    {

        public static IFWCommand deleteMContractByCodeList(List<string> contractCodeCodeList)
        {
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            fwSqlCommand.CommandText = string.Format(@" UPDATE  [dbo].[BLLOperationMaintenanceContract] SET [isDel]=1 WHERE operationMaintenanceContractCode IN ( {0} ) ;
                                                        delete from [BLLOperationMaintenanceContractMappingMonitorSite] where operationMaintenanceContractCode IN ( {0} );",
                FWSqlCommandStaticHelper.joinToSqlString<string>(contractCodeCodeList));
            return fwSqlCommand;
        } 

        public static IFWDBResult inserOrUpdateOperationMaintenanceContract(BLLOperationMaintenanceContract entity, IFWTransaction transaction)
        {
            if (transaction != null)
            {
                return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<BLLOperationMaintenanceContract>(transaction, entity, new List<string>() { "operationMaintenanceContractCode" }, null);
            }
            else
            {
                return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<BLLOperationMaintenanceContract>(entity, new List<string>() { "operationMaintenanceContractCode" }, null);
            }
        }



        public static IFWCommand insertMaintenanceContract(BLLOperationMaintenanceContract mEntity)
        {
            return FWSqlEntityToFWCommandStaticHelper.insert<BLLOperationMaintenanceContract>(mEntity);
        }

        public static IFWCommand updateMaintenanceContract(BLLOperationMaintenanceContract mEntity)
        {
            return FWSqlEntityToFWCommandStaticHelper.update<BLLOperationMaintenanceContract>(mEntity, "operationMaintenanceContractCode='"
                + mEntity.operationMaintenanceContractCode + "'", null);
        }

        public static IFWCommand insertContractMappingMonitorSite(BLLOperationMaintenanceContractMappingMonitorSite mEntity)
        {
            return FWSqlEntityToFWCommandStaticHelper.insert<BLLOperationMaintenanceContractMappingMonitorSite>(mEntity);
        }

        public static IFWCommand deleteContractMappingMonitorSite(string operationMaintenanceContractCode, string monitorSiteCode)
        {
            return FWSqlEntityToFWCommandStaticHelper.delete("BLLOperationMaintenanceContractMappingMonitorSite", "operationMaintenanceContractCode='"
                + operationMaintenanceContractCode + "' AND monitorSiteCode='" + monitorSiteCode + "'", null);
        }
    }
}
