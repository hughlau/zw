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
    public class FileDAL
    {
        public string Insert(Hashtable entity, IDbTransaction trans = null)
        {
            string id = Guid.NewGuid().ToString();
            entity["id"] = id;

            string sql = "insert into plus_file (id, name, type, size, url, pid, createdate, updatedate, folder, num) "
                        + "values (@id, @name, @type, @size, @url, @pid, @createdate, @updatedate, @folder, @num)";

            DapperHelper.Execute(sql, entity);
            return id;
        }

        public bool Update(Hashtable entity, IDbTransaction trans = null)
        {
            string sql = @"update plus_file set 
                                name = @name, type = @type, size = @size,
                                url = @url, pid = @pid, createdate = @createdate,
                                updatedate = @updatedate, folder = @folder, num = @num
                           where id = @id";

            int result = DapperHelper.Execute(sql, entity, trans);
            return result > 0;
        }

        public bool Delete(string id, IDbTransaction trans = null)
        {
            string sql = "delete from plus_file where id = @id";          
            int result = DapperHelper.Execute(sql, new { id = id }, trans);
            return result > 0;
        }

        public Hashtable GetEntity(string id)
        {
            string sql = "select * from plus_file where id = @id";
            return DapperHelper.QuerySingle(sql, new { id = id });
        }

        public ArrayList GetList()
        {
            string sql = "select * from plus_file";
            return DapperHelper.Query(sql);      
        }

    }
}