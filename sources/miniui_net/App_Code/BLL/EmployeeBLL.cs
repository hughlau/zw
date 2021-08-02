using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Plusoft.DAL;
using System.Collections;
using Plusoft.Utilities;

namespace Plusoft.BLL
{
    public class EmployeeBLL
    {
        EmployeeDAL dal = new EmployeeDAL();

        public string Insert(Hashtable entity)
        {
            return dal.Insert(entity);
        }

        public bool Update(Hashtable entity)
        {
            return dal.Update(entity);
        }

        public bool Delete(string id)
        {
            return dal.Delete(id);
        }

        public Hashtable GetEntity(string id)
        {
            return dal.GetEntity(id);
        }

        public ArrayList GetList()
        {
            return dal.GetList();
        }

        public ArrayList SearchEmployees(String key, int pageIndex, int pageSize, ArrayList sortFields = null)
        {
            return dal.Search(key, pageIndex, pageSize, sortFields);           
        }

        public ArrayList SearchEmployees(String key, int pageIndex, int pageSize, String sortField, String sortOrder)
        {
            return dal.Search(key, pageIndex, pageSize, sortField, sortOrder);
        }

        public Hashtable SearchEmployeesResult(String key, int pageIndex, int pageSize, ArrayList sortFields)
        {
            ArrayList data = SearchEmployees(key, pageIndex, pageSize, sortFields);
            int total = SearchEmployeesTotal(key);

            Hashtable result = new Hashtable();
            result["data"] = data;
            result["total"] = total;
            return result;
        }

        public int SearchEmployeesTotal(String key)
        {
            if (key == null) key = "";
            return dal.GetCount("name like '%" + key + "%'");
        }

        public Hashtable SearchEmployeesResult(String key, int pageIndex, int pageSize, String sortField, String sortOrder)
        {
            ArrayList data = SearchEmployees(key, pageIndex, pageSize, sortField, sortOrder);
            int total = SearchEmployeesTotal(key);

            Hashtable result = new Hashtable();
            result["data"] = data;
            result["total"] = total;

            //汇总信息：年龄（minAge, maxAge, avgAge）
            Hashtable ageInfo = DapperHelper.QuerySingle("select min(age) as minAge, max(age) as maxAge, avg(age) as avgAge from t_employee", null);
            result["minAge"] = ageInfo["minAge"];
            result["maxAge"] = ageInfo["maxAge"];
            result["avgAge"] = ageInfo["avgAge"];

            return result;
        }


        //这里演示了Dapper的事务如何使用。
        public bool SaveEmployees(ArrayList data)
        {
            using (var conn = DapperHelper.GetConnection())
            {
                conn.Open();
                var trans = conn.BeginTransaction();
                
                try
                {
                    for (int i = 0, l = data.Count; i < l; i++)
                    {
                        Hashtable o = (Hashtable)data[i];

                        String id = o["id"] != null ? o["id"].ToString() : "";
                        //根据记录状态，进行不同的增加、删除、修改操作
                        String state = o["_state"] != null ? o["_state"].ToString() : "";

                        if (state == "added" || id == "")           //新增：id为空，或_state为added
                        {
                            o["createtime"] = DateTime.Now;
                            dal.Insert(o, trans);
                        }
                        else if (state == "removed" || state == "deleted")
                        {
                            dal.Delete(id, trans);
                        }
                        else if (state == "modified" || state == "") //更新：_state为空或modified
                        {
                            dal.Update(o, trans);
                        }

                        //if (i == 2) throw new Exception("aaa");

                    }

                    trans.Commit();
                }
                catch (Exception ex)
                {                    
                    trans.Rollback();
                    return false;
                }
                return true;
            }
        }


        public ArrayList GetEmployeesByDeptId(String deptId, int pageIndex, int pageSize)
        {
            return dal.GetListByDepartmentId(deptId, pageIndex, pageSize);
        }

        public int GetEmployeesByDeptIdTotal(String deptId)
        {
            return dal.GetCount("dept_id ='" + deptId + "'");
        }

        public Hashtable GetEmployeesByDeptIdResult(String deptId, int pageIndex, int pageSize)
        {
            ArrayList data = GetEmployeesByDeptId(deptId, pageIndex, pageSize);
            int total = GetEmployeesByDeptIdTotal(deptId);

            Hashtable result = new Hashtable();
            result["data"] = data;
            result["total"] = total;
            return result;
        }

    }
}

