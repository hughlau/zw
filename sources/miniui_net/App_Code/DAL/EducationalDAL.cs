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
    public class EducationalDAL
    {        
        public ArrayList GetList()
        {
            string sql = "select * from t_educational";
            return DapperHelper.Query(sql);      
        }
    }
}