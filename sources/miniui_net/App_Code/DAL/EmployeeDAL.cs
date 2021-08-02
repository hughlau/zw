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
    public class EmployeeDAL
    {
        string selectSql = @"select a.*, b.name dept_name, c.name position_name, d.name educational_name 
                         from t_employee a 
                         left join t_department b
                         on a.dept_id = b.id
                         left join t_position c
                         on a.position = c.id
                         left join t_educational d
                         on a.educational = d.id ";

        public string Insert(Hashtable entity, IDbTransaction trans = null)
        {
            string id = Guid.NewGuid().ToString();
            entity["id"] = id;

            entity["createtime"] = DateTime.Now;

            string sql = "insert into t_employee (id, loginname, name, age, birthday, dept_id, position, gender, married, salary, educational, country, city, remarks, school, createtime, email) "
                        + "values (@id, @loginname, @name, @age, @birthday, @dept_id, @position, @gender, @married, @salary, @educational, @country, @city, @remarks, @school, @createtime, @email)";
            
            DapperHelper.Execute(sql, entity, trans);
            return id;
        }

        public bool Update(Hashtable entity, IDbTransaction trans = null)
        {
            //这里先获取数据库旧有对象，然后更新。
            string id = Convert.ToString(entity["id"]);
            Hashtable old = GetEntity(id);
            if (old == null) return false;
            //将新的数据拷贝到旧对象上
            foreach (DictionaryEntry de in entity)
            {
                old[de.Key] = de.Value;
            }
            entity = old;

            //更新操作
            string sql = @"update t_employee set 
                                loginname = @loginname, name = @name, age = @age, birthday = @birthday, 
                                dept_id = @dept_id, position = @position, gender = @gender, married = @married, 
                                salary = @salary, educational = @educational, country = @country, city = @city, 
                                remarks = @remarks, school = @school, createtime = @createtime, email = @email
                           where id = @id";

            int result = DapperHelper.Execute(sql, entity, trans);
            return result > 0;
        }

        public bool Delete(string id, IDbTransaction trans = null)
        {
            string sql = "delete from t_employee where id = @id";          
            int result = DapperHelper.Execute(sql, new { id = id }, trans);
            return result > 0;
        }

        public Hashtable GetEntity(string id)
        {
            string sql = selectSql + " where a.id = @id";
            return DapperHelper.QuerySingle(sql, new { id = id });
        }

        public ArrayList GetList()
        {
            string sql = selectSql;
            return DapperHelper.Query(sql);
        }

        public ArrayList Search(String key, int pageIndex, int pageSize, String sortField, String sortOrder)
        {
            ArrayList sortFields = new ArrayList();
            if (String.IsNullOrEmpty(sortField) == false)
            {
                Hashtable p = new Hashtable();
                p["field"] = sortField;
                p["dir"] = sortOrder;
                sortFields.Add(p);
            }

            return Search(key, pageIndex, pageSize, sortFields);
        }

        public ArrayList Search(String key, int pageIndex, int pageSize, ArrayList sortFields)
        {
            if (key == null) key = "";

            String sql = selectSql + "\nwhere a.name like '%" + key + "%'";

            if (sortFields != null && sortFields.Count > 0)
            {
                sql += DapperHelper.CreateOrderSql(sortFields, "a.");
            }
            else
            {
                sql += "\norder by a.createtime desc";
            }

            return DapperHelper.QueryPage(sql, null, pageIndex, pageSize);
        }

        public virtual int GetCount(String where = "")
        {
            String sql = "select count(1) from t_employee";
            if (!String.IsNullOrEmpty(where))
            {
                sql += " where " + where;
            }

            return DapperHelper.ExecuteScalar<int>(sql);
        }

        public ArrayList GetListByDepartmentId(String departmentId, int pageIndex, int pageSize)
        {
            String sql = selectSql + "where a.dept_id = @id";
            return DapperHelper.QueryPage(sql, new { id = departmentId }, pageIndex, pageSize);
        }	

    }
}