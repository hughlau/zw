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
    public class PositionDAL
    {        
        public ArrayList GetList()
        {
            string sql = "select * from t_position";
            return DapperHelper.Query(sql);      
        }

        public ArrayList GetPositionsByDepartmenId(string departmentId)
        {
            String sql = "select * from t_position where dept_id = '" + departmentId + "'";
            return DapperHelper.Query(sql); 
        }
    }
}