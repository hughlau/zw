using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using fw.fwDal;
using fw.fwData;
using fw.m.sysManage.data.entity;

namespace fw.m.Common
{
    public class MBaseBll
    {
        //获取对应值
        public static List<FWDictionary> GetDicByCode(string pCode, string isDel = "0")
        {
            string andCondition = isDel == "0" ? " and isDis = '0'" : " and 1=1";
            return bllListQuerry<FWDictionary>("select * from FWDictionary where pCode = '" + pCode + "'" + andCondition);
        }
        
        //entity
        public static T bllQuerry<T>(FWEntityObject model)
        {
            //
            FWSqlCommand sqlCmd = new FWSqlCommand();
            MSqlForm msf = new MSqlForm(model);
            string sbSql = msf.SQLString;
            sqlCmd.CommandText = sbSql;
            sqlCmd.Parameters = msf.Parameters;
            //
            return FWSqlEntityToFWCommandStaticHelper.query<T>(sqlCmd);
        }

        //list
        public static List<T> bllListQuerry<T>(FWEntityObject model)
        {
            //
            FWSqlCommand sqlCmd = new FWSqlCommand();
            MSqlForm msf = new MSqlForm(model);
            string sbSql = msf.SQLString;
            sqlCmd.CommandText = sbSql;
            sqlCmd.Parameters = msf.Parameters;
            //
            return FWSqlEntityToFWCommandStaticHelper.queryList<T>(sqlCmd);
        }

        //sql
        public static T bllQuerry<T>(string sql)
        {
            //
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sqlCmd.CommandText = sql;
            return FWSqlEntityToFWCommandStaticHelper.query<T>(sqlCmd);
        }

        //list
        public static List<T> bllListQuerry<T>(string sql)
        {
            //
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sqlCmd.CommandText = sql;
            return FWSqlEntityToFWCommandStaticHelper.queryList<T>(sqlCmd);
        }

        //sql datatable
        public static DataTable DataTableBySql(string sql)
        {
            //
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sqlCmd.CommandText = sql;
            return FWSqlCommandStaticHelper.ExecuteDataTable(sqlCmd);
        }



        public static T bllQuerry<T>(FWEntityObject model, FWSqlTransaction fwSqlTransaction)
        {
            //
            FWSqlCommand sqlCmd = new FWSqlCommand();
            MSqlForm msf = new MSqlForm(model);
            string sbSql = msf.SQLString;
            sqlCmd.CommandText = sbSql;
            sqlCmd.Parameters = msf.Parameters;
            //
            return FWSqlEntityToFWCommandStaticHelper.query<T>(fwSqlTransaction, sqlCmd);
        }

        //list
        public static List<T> bllListQuerry<T>(FWEntityObject model, FWSqlTransaction fwSqlTransaction)
        {
            //
            FWSqlCommand sqlCmd = new FWSqlCommand();
            MSqlForm msf = new MSqlForm(model);
            string sbSql = msf.SQLString;
            sqlCmd.CommandText = sbSql;
            sqlCmd.Parameters = msf.Parameters;
            //
            return FWSqlEntityToFWCommandStaticHelper.queryList<T>(fwSqlTransaction, sqlCmd);
        }

        //sql
        public static T bllQuerry<T>(string sql, FWSqlTransaction fwSqlTransaction)
        {
            //
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sqlCmd.CommandText = sql;
            return FWSqlEntityToFWCommandStaticHelper.query<T>(fwSqlTransaction, sqlCmd);
        }

        //list
        public static List<T> bllListQuerry<T>(string sql, FWSqlTransaction fwSqlTransaction)
        {
            //
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sqlCmd.CommandText = sql;
            return FWSqlEntityToFWCommandStaticHelper.queryList<T>(fwSqlTransaction, sqlCmd);
        }

        //sql datatable
        public static DataTable DataTableBySql(string sql, FWSqlTransaction fwSqlTransaction)
        {
            //
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sqlCmd.CommandText = sql;
            return FWSqlCommandStaticHelper.ExecuteDataTable(fwSqlTransaction, sqlCmd);
        }

        //更新,实在是木有办法才采用两个实体的方式，其实这样很是不好
        public static int baseUpdate(FWEntityObject updEntity, FWEntityObject whereEntity)
        {
            string sqlString = string.Empty;
            sqlString = "UPDATE " + updEntity.GetType().Name + " SET " + ParseUpdateSQL(updEntity, constCommon.ParameterPrefix, ",") + " WHERE " + ParseUpdateSQL(whereEntity, constCommon.ParameterPrefix, " AND ");
            MSqlForm msf = new MSqlForm(updEntity);
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sqlCmd.CommandText = sqlString;
            sqlCmd.Parameters = msf.Parameters;
            return FWSqlCommandStaticHelper.ExecuteNonQuery(sqlCmd);
        }
        
        //带事务的更新
        public static int baseUpdate(FWEntityObject updEntity, Dictionary<string, string> dicWhere, FWSqlTransaction fwSqlTransaction)
        {
            string sqlString = string.Empty;
            sqlString = "UPDATE " + updEntity.GetType().Name + " SET " + ParseUpdateSQL(updEntity, constCommon.ParameterPrefix, ",") + " WHERE 1 = 1 ";
            //
            if (dicWhere.Count == 0)
            {
                return -99;
            }
            //
            foreach (KeyValuePair<string, string> dic in dicWhere)
            {
                sqlString += " and " + dic.Key + " = '" + dic.Value + "' ";
            }
            //
            MSqlForm msf = new MSqlForm(updEntity);
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sqlCmd.CommandText = sqlString;
            sqlCmd.Parameters = msf.Parameters;
            return FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, sqlCmd);
        }

        //带事务的更新
        public static int baseUpdate(FWEntityObject updEntity, List<string> listWhere, FWSqlTransaction fwSqlTransaction)
        {
            string sqlString = string.Empty;
            sqlString = "UPDATE " + updEntity.GetType().Name + " SET " + ParseUpdateSQL(updEntity, constCommon.ParameterPrefix, ",") + " WHERE 1 = 1 ";
            //
            if (listWhere.Count == 0)
            {
                return -99;
            }
            //
            foreach (string str in listWhere)
            {
                sqlString += " and " + str + " = @" + str;
            }
            //
            MSqlForm msf = new MSqlForm(updEntity);
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sqlCmd.CommandText = sqlString;
            sqlCmd.Parameters = msf.Parameters;
            return FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, sqlCmd);
        }

        //带事务的更新
        public static int baseUpdate(FWEntityObject updEntity, FWEntityObject whereEntity, FWSqlTransaction fwSqlTransaction)
        {
            string sqlString = string.Empty;
            sqlString = "UPDATE " + updEntity.GetType().Name + " SET " + ParseUpdateSQL(updEntity, constCommon.ParameterPrefix, ",") + " WHERE " + ParseUpdateSQL(whereEntity, constCommon.ParameterPrefix, " AND ");
            //
            MSqlForm msf = new MSqlForm(updEntity);
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sqlCmd.CommandText = sqlString;
            sqlCmd.Parameters = msf.Parameters;
            return FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, sqlCmd);
        }

        //insert
        public static int baseInsert<T>(T insertEntity)
        {
            IFWCommand sqlCmd = FWSqlEntityToFWCommandStaticHelper.insert(insertEntity);
            return FWSqlCommandStaticHelper.ExecuteNonQuery(sqlCmd);
        }

        //insert
        public static int baseInsert<T>(T insertEntity, FWSqlTransaction fwSqlTransaction)
        {
            IFWCommand sqlCmd = FWSqlEntityToFWCommandStaticHelper.insert(insertEntity);
            return FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, sqlCmd);
        }

        //
        public static int baseListInsert<T>(List<T> insertListEntity, FWSqlTransaction fwSqlTransaction)
        {
            //
            foreach (T entity in insertListEntity)
            {
                IFWCommand sqlCmd = FWSqlEntityToFWCommandStaticHelper.insert(entity);
                int result = FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, sqlCmd);
                if (result != 1)
                {
                    return -1;
                }
            }
            //
            return 1;
        }

        //
        public static int baseListInsert<T>(List<T> insertListEntity)
        {
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            //
            fwSqlTransaction.BeginTransaction();
            //
            foreach (T entity in insertListEntity)
            {
                IFWCommand sqlCmd = FWSqlEntityToFWCommandStaticHelper.insert(entity);
                int result = FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, sqlCmd);
                if (result != 1)
                {
                    fwSqlTransaction.Rollback();
                    fwSqlTransaction.Close();
                    return -1;
                }
            }
            //
            fwSqlTransaction.Commit();
            fwSqlTransaction.Close();
            return 1;
        }

        //获取数据库时间
        public static DateTime GetDBDate()
        {
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sqlCmd.CommandText = "select getdate()";
            return (DateTime)FWSqlCommandStaticHelper.ExecuteDataTable(sqlCmd).Rows[0][0];
        }

        //获取数据库时间
        public static string GetDBGuid()
        {
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sqlCmd.CommandText = "select newid()";
            return FWSqlCommandStaticHelper.ExecuteDataTable(sqlCmd).Rows[0][0].ToString();
        }

        //实体转换
        public static DataRow EntityToDataRow<T>(T entity, DataTable dt)
        {
            DataRow dr = dt.NewRow();
            //
            PropertyInfo[] PropertyInfoArray = entity.GetType().GetProperties();
            //
            foreach (PropertyInfo pi in PropertyInfoArray)
            {
                dr[pi.Name] = pi.GetValue(entity, null);
            }
            //
            return dr;
        }

        //实体转换
        public static DataTable EntityToDataTable<T>(List<T> listEntity)
        {
            DataTable dt = new DataTable();
            //
            PropertyInfo[] PropertyInfoArray = listEntity[0].GetType().GetProperties();
            //列
            foreach (PropertyInfo pi in PropertyInfoArray)
            {
                dt.Columns.Add(pi.Name);
            }
            //
            foreach (T entity in listEntity)
            {
                dt.Rows.Add(EntityToDataRow(entity, dt));
            }
            //
            return dt;
        }

        //实体转换
        public static DataTable EntityToDataTable<T>(T entity)
        {
            DataTable dt = new DataTable();
            //
            PropertyInfo[] PropertyInfoArray = entity.GetType().GetProperties();
            //列
            foreach (PropertyInfo pi in PropertyInfoArray)
            {
                dt.Columns.Add(pi.Name);
            }
            //
            dt.Rows.Add(EntityToDataRow(entity, dt));
            //
            return dt;
        }

        //
        public static Dictionary<string, T> EntityToDic<T>(string keyName, List<T> listEntity) where T : new()
        {
            Type entityType = (new T()).GetType();
            PropertyInfo propertyInfo = entityType.GetProperty(keyName);
            //
            Dictionary<string, T> dic = new Dictionary<string, T>();
            //
            foreach (T entity in listEntity)
            {
                var keyValue = propertyInfo.GetValue(entity, null);
                if (!dic.ContainsKey(keyValue.ToString()))
                {
                    dic.Add(keyValue.ToString(), entity);
                }
            }
            return dic;
        }

        //组装Update语句
        private static string ParseUpdateSQL(FWEntityObject entity, string pre, string sep)
        {
            string result = string.Empty;
            PropertyInfo[] PropertyInfoArray = entity.GetType().GetProperties();
            //
            foreach (PropertyInfo pi in PropertyInfoArray)
            {
                if (pi.GetValue(entity, null) != null)
                {
                    if (pi.PropertyType.Name == "String" && ((string)pi.GetValue(entity, null)).Length == 0) continue; //若Hash里为string且值为空则不能构成条件
                    if (pi.PropertyType.Name == "DateTime" && ((DateTime)pi.GetValue(entity, null)) == DateTime.MinValue) continue; //最小时间舍弃
                    if (pi.Name == "id") continue; //id舍弃
                    //
                    result += pi.Name + "=" + pre + pi.Name + sep;
                }
            }
            //
            if (result.Length > 2)
                result = result.Substring(0, result.Length - sep.Length);
            return result;
        }

        #region business

        //获取编号
        public static string GetProcessCode(string prefix)
        {
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sqlCmd.CommandText = @"SELECT '" + prefix +
                                 @"' + RIGHT('00000000'+ CONVERT(varchar(100),CONVERT(INT,SUBSTRING(ISNULL(MAX(processNumber),'" + prefix +
                                 @"' +'00000000' ),LEN('" +
                                 prefix + @"')+1,LEN(ISNULL(MAX(processNumber),'" + prefix +
                                 @"' +'00000000' ))-LEN('" + prefix +
                                 @"'))) + 1), 8) FROM T_Bsn_ExecProcessMain where processNumber like '" + prefix + "%'";
            return FWSqlCommandStaticHelper.ExecuteDataTable(sqlCmd).Rows[0][0].ToString();
        }

        //返回step
        public static T GetProcessStep<T>(int StepCode, string processId)
        {
            return
                bllQuerry<T>("SELECT * FROM dbo.T_Bsn_ProcessStep WHERE processId = '" + processId +
                             "' AND stepCode = '" + StepCode + "'");
        }

        #endregion
    }
}
