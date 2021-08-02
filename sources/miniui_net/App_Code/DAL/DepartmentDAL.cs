using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using MySql.Data.MySqlClient;
using Dapper;
using Newtonsoft.Json;
using Plusoft.Utilities;
using System.Data;
using System.Collections;

namespace Plusoft.DAL
{
    public class DepartmentDAL
    {
        public string Insert(Hashtable entity, IDbTransaction trans = null)
        {
            string id = Guid.NewGuid().ToString();
            entity["id"] = id;

            string sql = "insert into t_department (id, name, manager, manager_name) "
                        + "values (@id, @name, @manager, @manager_name)";

            DapperHelper.Execute(sql, entity);
            return id;
        }

        public bool Update(Hashtable entity, IDbTransaction trans = null)
        {
            string sql = @"update t_department set 
                                name = @name, manager = @manager, manager_name = @manager_name
                           where id = @id";

            int result = DapperHelper.Execute(sql, entity, trans);
            return result > 0;
        }

        public bool Delete(string id, IDbTransaction trans = null)
        {
            string sql = "delete from t_department where id = @id";          
            int result = DapperHelper.Execute(sql, new { id = id }, trans);
            return result > 0;
        }

        public Hashtable GetEntity(string id)
        {
            string sql = "select * from t_department where id = @id";
            return DapperHelper.QuerySingle(sql, new { id = id });
        }

        public ArrayList GetList()
        {
            string sql = "select * from t_department";
            return DapperHelper.Query(sql);      
        }

    }
}