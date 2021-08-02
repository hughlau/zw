using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwDal;
using fw.m.basicInfo.data.entity;

namespace fw.m.basicInfo.dal
{
    public class EquipmentDal
    {
        public static IFWDBResult inserOrUpdateBLLEquipmentPartByPartCode(BLLEquipmentPart entity, IFWTransaction transaction)
        {
            if (transaction != null)
            {
                return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<BLLEquipmentPart>(transaction, entity, new List<string>() { "partCode" }, null);
            }
            else
            {
                return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<BLLEquipmentPart>(entity, new List<string>() { "partCode" }, null);
            } 
        }
        
        public static IFWCommand deleteMEquipmentPartByPartCode(List<string> partCodeList)
        {
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            fwSqlCommand.CommandText = string.Format(@" UPDATE  [dbo].[BLLEquipmentPart] SET [isDel]=1 WHERE partCode IN ( {0} ) ",
                FWSqlCommandStaticHelper.joinToSqlString<string>(partCodeList));
            return fwSqlCommand;
        }

        public static IFWDBResult inserOrUpdateBLLEquipmentByEquipmentCode(BLLEquipment entity, IFWTransaction transaction)
        {
            if (transaction != null)
            {
                return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<BLLEquipment>(transaction, entity, new List<string>() { "equipmentCode" }, null);
            }
            else
            {
                return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<BLLEquipment>(entity, new List<string>() { "equipmentCode" }, null);
            } 
        }

        public static IFWCommand deleteMEquipmentByPartCode(List<string> equipmentCodeList)
        {
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            fwSqlCommand.CommandText = string.Format(@" UPDATE  [dbo].[BLLEquipment] SET [isDel]=1 WHERE equipmentCode IN ( {0} ) ",
                FWSqlCommandStaticHelper.joinToSqlString<string>(equipmentCodeList));
            return fwSqlCommand;
        } 
        public static IFWCommand updateMBLLEquipmentByEquipmentCodeList(BLLEquipment entity,List<string> equipmentCodeList)
        {
            return FWSqlEntityToFWCommandStaticHelper.update(entity, string.Format("  equipmentCode in ({0}) ", FWSqlCommandStaticHelper.joinToSqlString<string>(equipmentCodeList)), null);
        }
    }
}
