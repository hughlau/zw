using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwDal;
using System.Data;

namespace fw.windowsService
{
   public class CommSettings
    {
       public static String querySettingsBypropertyName(string propertyName)
       {
           string propertyValue = "";
           FWSqlCommand fwSqlCommand = new FWSqlCommand();
           fwSqlCommand.CommandText = string.Format(@"SELECT  propertyValue FROM  dbo.T_Sys_Settings where propertyName='{0}'", propertyName);
           DataTable dt = FWSqlCommandStaticHelper.ExecuteDataTable(fwSqlCommand);
           if (dt != null && dt.Rows.Count > 0 && dt.Rows[0]["propertyValue"]!=null)
           {
               propertyValue = dt.Rows[0]["propertyValue"].ToString();
           }
           return propertyValue;
       }


       public static bool saveSettingspropertyNameAndValue(string propertyName, string propertyValue)
       {
          
           FWSqlCommand fwSqlCommand = new FWSqlCommand();
           fwSqlCommand.CommandText = string.Format(@" update T_Sys_Settings set propertyValue='{1}' where   propertyName='{0}'", propertyName, propertyValue);
           return FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlCommand)>0;
          
       }
    }
}
