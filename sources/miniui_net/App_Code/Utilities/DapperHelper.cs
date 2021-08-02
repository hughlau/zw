using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data.SqlClient;
using System.Data;
using MySql.Data.MySqlClient;
using Dapper;
using System.Configuration;
using System.Collections;
using System.Text.RegularExpressions;

using System.Reflection;
//using System.Data.OracleClient;

namespace Plusoft.Utilities
{
    /*
     *  对Dapper做了支持Hashtable/ArrayList的操作封装。（好处是：不用定义实体类）
     *  支持 MySql, SqlServer, Oracle 
     */
    public class DapperHelper
    {
        private static ConnectionStringSettings connSettings = ConfigurationManager.ConnectionStrings["database"];

        public static bool IsMySql
        {
            get
            {
                return connSettings.ProviderName.IndexOf("MySql") != -1;
            }
        }

        public static bool IsSqlServer
        {
            get
            {
                return connSettings.ProviderName == "System.Data.SqlClient";
            }
        }

        public static bool IsOracle
        {
            get
            {
                return connSettings.ProviderName.IndexOf("Oracle") != -1;
            }
        }

        public static IDbConnection GetConnection()
        {
            IDbConnection conn = null;
            if (IsSqlServer)
            {
                conn = new SqlConnection(connSettings.ConnectionString);
            }
            else if (IsMySql)
            {
                conn = new MySqlConnection(connSettings.ConnectionString);
            }
            else if (IsOracle)
            {
                //conn = new OracleConnection(connSettings.ConnectionString);
            }
            return conn;
        }
      

        private static Hashtable ToHashtable(object param)
        {
            if (param == null) return null;
            if (param.GetType() == typeof(Hashtable)) return (Hashtable)param;           

            Hashtable hash = new Hashtable();
            foreach (PropertyInfo item in param.GetType().GetProperties())
            {
                hash[item.Name] = item.GetValue(param, null);
            }
            return hash;
        }

        private static object ConvertParameters(ref string sql, object param){
            Hashtable ht = ToHashtable(param);
            if (ht!= null)
            {
                Hashtable ht_low = new Hashtable();
                foreach (string key in ht.Keys)
                {
                    ht_low[key.ToLower()] = ht[key];
                }

                DynamicParameters pars = new DynamicParameters();
                param = pars;

                MatchCollection ms = Regex.Matches(sql, @"@\w+");

                if (IsOracle)
                {
                    int i = 1;

                    List<String> keys = new List<string>();
                    foreach (Match m in ms)
                    {
                        string key = m.Value;
                        keys.Add(key);
                    }

                    keys = keys.OrderByDescending(str => str.Length).ToList();  //字符串数组，从长到短排列

                    foreach (String key in keys)
                    {
                        Object value = ht_low[key.ToLower().Substring(1)];

                        string newKey = "P" + i++;
                        sql = sql.Replace(key, ":"+newKey);        //ORACLE做一下参数名替换，因为ORACLE对参数名约束比较严格，容易出错

                        pars.Add(newKey, value);
                    }
                }
                else
                {
                    foreach (Match m in ms)
                    {
                        string key = m.Value.ToLower();
                        Object value = ht_low[key.Substring(1)];
                        pars.Add(key, value);
                    }
                }
                
            }
            return param;
        }

        public static int Execute(string sql, object param = null, IDbTransaction trans = null)
        {            
            IDbConnection conn = trans == null ? GetConnection() : trans.Connection;
            if (trans == null)
            {
                conn.Open();
            }
            param = ConvertParameters(ref sql, param);
            int result = conn.Execute(sql, param, trans);
            if (trans == null)
            {
                conn.Close();
            }
            return result;
        }

        public static T ExecuteScalar<T>(string sql, object param = null, IDbTransaction trans = null)
        {
            IDbConnection conn = trans == null ? GetConnection() : trans.Connection;
            if (trans == null)
            {
                conn.Open();
            }
            param = ConvertParameters(ref sql, param);
            T result = conn.ExecuteScalar<T>(sql, param, trans);
            if (trans == null)
            {
                conn.Close();
            }
            return result;
        }

        public static Hashtable QuerySingle(string sql, object param = null, IDbTransaction trans = null)
        {
            IDbConnection conn = trans == null ? GetConnection() : trans.Connection;
            if (trans == null)
            {
                conn.Open();
            }

            param = ConvertParameters(ref sql, param);
            IDataReader reader = conn.ExecuteReader(sql, param);

            //IDataReader reader = conn.ExecuteReader("select * from plus_project where UID_ = :uid1", new { uid1 = 1 });

            //IDataReader reader = conn.ExecuteReader("select * from plus_project where UID_ = ?", new { UIDA = 1 });

            ArrayList list = DataReaderToArrayList(reader);
            if (trans == null)
            {
                conn.Close();
            }
            return list.Count == 0 ? null : (Hashtable)list[0];
        }

        public static ArrayList Query(string sql, object param = null, IDbTransaction trans = null)
        {
            IDbConnection conn = trans == null ? GetConnection() : trans.Connection;
            if (trans == null)
            {
                conn.Open();
            }
            param = ConvertParameters(ref sql, param);
            IDataReader reader = conn.ExecuteReader(sql, param);
            ArrayList list = DataReaderToArrayList(reader);
            if (trans == null)
            {
                conn.Close();
            }
            return list;
        
        }

        public static ArrayList QueryPage(string sql, object param, int pageIndex, int pageSize)
        {
            if (IsMySql)
            {
                sql += "\nlimit " + pageIndex * pageSize + "," + pageSize;
                return Query(sql, param);
            }
            else
            {
                //! 非mysql暂用内存分页，不可取，实际开发中应自己编写分页SQL。
                ArrayList dataAll = Query(sql, param);
                //return data.GetRange(pageIndex, pageSize);  
                
                ArrayList data = new ArrayList();
                int start = pageIndex * pageSize, end = start + pageSize;

                for (int i = 0, l = dataAll.Count; i < l; i++)
                {
                    Hashtable record = (Hashtable)dataAll[i];
                    if (record == null) continue;
                    if (start <= i && i < end)
                    {
                        data.Add(record);
                    }
                }
                return data;

            }

            //sqlserver 2012
            //select * from 表 OFFSET PageIndex*pagenum ROWS FETCH next pagenum rows only
        }

        private static ArrayList DataReaderToArrayList(IDataReader reader)
        {
            DataTable table = new DataTable();
            table.Load(reader);
            reader.Close();
            return DataTableToArrayList(table);
        }

        private static ArrayList DataTableToArrayList(DataTable data)
        {
            ArrayList array = new ArrayList();
            for (int i = 0; i < data.Rows.Count; i++)
            {
                DataRow row = data.Rows[i];

                Hashtable record = new Hashtable();
                for (int j = 0; j < data.Columns.Count; j++)
                {
                    object cellValue = row[j];
                    if (cellValue.GetType() == typeof(DBNull))
                    {
                        cellValue = null;
                    }
                    record[data.Columns[j].ColumnName] = cellValue;
                }
                array.Add(record);
            }
            return array;
        }

        public static String CreateOrderSql(ArrayList sortFields, String namePrefix)
        {
            if (namePrefix == null) namePrefix = "";

            String sql = "";
            if (sortFields != null && sortFields.Count > 0)
            {
                for (int i = 0; i < sortFields.Count; i++)
                {
                    Hashtable record = (Hashtable)sortFields[i];
                    String sortField = (String)record["field"];
                    String sortOrder = (String)record["dir"];

                    if (String.IsNullOrEmpty(sortOrder)) sortOrder = "asc";

                    if (i == 0)
                    {
                        sql += " order by " + namePrefix + sortField + " " + sortOrder;
                    }
                    else
                    {
                        sql += ", " + namePrefix + sortField + " " + sortOrder;
                    }
                }
            }
            return sql;
        }
    }
}