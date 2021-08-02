using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using fw.fwDal;

namespace fw.m.Common
{
    public class SQLOperator
    {
        public const string Equal = "=";
        public const string NotEquals = "<>";
        public const string Greater = ">";
        public const string GreaterEquals = ">=";
        public const string Less = "<";
        public const string LessEquals = "<=";
        public const string Like = "LIKE";
        public const string LikeLeft = "LIKELEFT";
        public const string LikeRight = "LIKERIGHT";
    }

    public class LogicalOperator
    {
        public const string AND = "AND";
        public const string OR = "OR";
        public const string NOT = "NOT";
    }

    /// <summary>
    /// 拼SQL条件用类
    /// </summary>
    public class MSqlForm
    {

        #region var

        private string _sqlString;

        private bool _fixFirstCondition;

        public bool FixFirstCondition
        {
            get { return _fixFirstCondition; }
            set { _fixFirstCondition = value; }
        }

        private string _whereString;

        private string _orderString;

        private string _groupByString;

        /// <summary>
        /// SQL语句
        /// </summary>
        public string SQLString
        {
            get
            {
                string whereString = _whereString.Trim();
                if (_fixFirstCondition && whereString.Length > 3)
                {
                    int first = whereString.IndexOf(" ");
                    whereString = whereString.Substring(first, whereString.Length - first);
                }
                if (whereString.Trim().Length > 0)
                    return _sqlString + " WHERE " + whereString + " " + _groupByString + " " + _orderString;
                else
                    return _sqlString + " " + _groupByString + " " + _orderString;
            }
        }

        private FWParameterCollection _parameters;

        /// <summary>
        /// 参数列表
        /// </summary>
        public FWParameterCollection Parameters
        {
            get { return _parameters; }
            set { _parameters = value; }
        }

        //
        public Dictionary<string, FWParameter> dicParameters;

        /// <summary>
        /// SQL
        /// </summary>
        /// <param name="sqlString"></param>
        public MSqlForm(string sqlString)
        {
            _whereString = "";
            _fixFirstCondition = true;
            _sqlString = sqlString;
            _parameters = new FWParameterCollection();
        }

        #endregion

        #region constructor

        /// <summary>
        /// SQL 与 参数
        /// </summary>
        /// <param name="sqlString"></param>
        /// <param name="parameters"></param>
        public MSqlForm(string sqlString, FWParameterCollection parameters)
            : this(sqlString)
        {
            _parameters = parameters;
        }

        /// <summary>
        /// SelectAll
        /// </summary>
        /// <param name="tableName"></param>
        /// <returns></returns>
        public static MSqlForm SelectAll(string tableName)
        {
            return new MSqlForm("SELECT * FROM " + tableName);
        }

        /// <summary>
        /// 根据实体生成关系为AND的条件
        /// </summary>
        /// <param name="entity"></param>
        public MSqlForm(FWEntityObject entity)
        {
            //
            _sqlString = "SELECT * FROM " + entity.GetType().Name; ;
            _whereString = "";
            _fixFirstCondition = true;
            _parameters = new FWParameterCollection();
            AddAndCondition(entity);
        }




        public void AddAndCondition(FWEntityObject entity)
        {
            PropertyInfo[] PropertyInfoArray = entity.GetType().GetProperties();
            //
            foreach (PropertyInfo pi in PropertyInfoArray)
            {
                if (pi.GetValue(entity, null) != null)
                {
                    if (pi.PropertyType.Name == "String" && ((string)pi.GetValue(entity, null)).Length == 0) continue;//若Hash里为string且值为空则不能构成条件
                    if (pi.PropertyType.Name == "DateTime" && ((DateTime)pi.GetValue(entity, null)) == DateTime.MinValue) continue;//最小时间舍弃
                    if (pi.Name == "id") continue;//id舍弃
                    AddAndCondition(pi.Name, pi.GetValue(entity, null));
                }
            }
        }

        #endregion

        #region base function

        public void AddCondition(string condition)
        {
            _whereString += " " + condition;
        }

        //
        private string PrepareParameter(string parameterName)
        {
            string parameter = "@" + parameterName;
            if (dicParameters == null) dicParameters = new Dictionary<string, FWParameter>();
            if (dicParameters.ContainsKey(parameter))
            {
                parameter += Guid.NewGuid().ToString().Substring(0, 4);
            }
            if (dicParameters.ContainsKey(parameter))
            {
                parameter += Guid.NewGuid().ToString().Substring(0, 4);
            }
            return parameter;
        }

        public void AddCondition(string logicalOperator, string left, string preParameter, string parameterName,
                                 string sqlOperator, object parameterValue, string right)
        {
            string parameter = PrepareParameter(parameterName);
            if (preParameter.Length > 0)
            {
                parameterName = preParameter + "." + parameterName;
            }
            if (_whereString.Trim().Length > 0 && _whereString.Trim()[_whereString.Trim().Length - 1] == '(')
            {
                _whereString += " " + " " + left + " " + parameterName + " ";
            }
            else
            {
                _whereString += " " + logicalOperator + " " + left + " " + parameterName + " ";
            }
            switch (sqlOperator.ToUpper())
            {
                case SQLOperator.Like:
                    _whereString += SQLOperator.Like;
                    parameterValue = "%" + parameterValue.ToString() + "%";
                    break;
                case SQLOperator.LikeLeft:
                    _whereString += SQLOperator.Like;
                    parameterValue = "%" + parameterValue.ToString();
                    break;
                case SQLOperator.LikeRight:
                    _whereString += SQLOperator.Like;
                    parameterValue = parameterValue.ToString() + "%";
                    break;
                default:
                    _whereString += sqlOperator.ToUpper();
                    break;
            }
            _whereString += " " + parameter + " " + right;
            _parameters.AddWithValue(parameter, parameterValue);
            dicParameters.Add(parameter, new FWParameter(parameter, parameterValue));
        }



        #endregion

        #region and

        public void AddAndCondition(string left, string preParameter, string parameterName, string sqlOperator,
                                    object parameterValue, string right)
        {
            AddCondition(LogicalOperator.AND, left, preParameter, parameterName, sqlOperator, parameterValue, right);
        }

        public void AddAndCondition(string preParameter, string parameterName, string sqlOperator, object parameterValue)
        {
            AddAndCondition("", preParameter, parameterName, sqlOperator, parameterValue, "");
        }

        public void AddAndCondition(string parameterName, string sqlOperator, object parameterValue)
        {
            AddAndCondition("", "", parameterName, sqlOperator, parameterValue, "");
        }

        public void AddAndCondition(string parameterName, object parameterValue)
        {
            AddAndCondition("", "", parameterName, "=", parameterValue, "");
        }



        #endregion

        #region OR

        public void AddORCondition(string left, string preParameter, string parameterName, string sqlOperator,
                                   object parameterValue, string right)
        {
            AddCondition(LogicalOperator.OR, left, preParameter, parameterName, sqlOperator, parameterValue, right);
        }

        public void AddORCondition(string parameterName, string sqlOperator, object parameterValue)
        {
            AddORCondition("", "", parameterName, sqlOperator, parameterValue, "");
        }

        public void AddORCondition(string parameterName, object parameterValue)
        {
            AddORCondition("", "", parameterName, "=", parameterValue, "");
        }


        #endregion

        #region NOT

        public void AddNOTCondition(string left, string preParameter, string parameterName, string sqlOperator,
                                    object parameterValue, string right)
        {
            AddCondition(LogicalOperator.NOT, left, preParameter, parameterName, sqlOperator, parameterValue, right);
        }

        public void AddNOTCondition(string parameterName, string sqlOperator, object parameterValue)
        {
            AddNOTCondition("", "", parameterName, sqlOperator, parameterValue, "");
        }

        public void AddNOTCondition(string parameterName, object parameterValue)
        {
            AddNOTCondition("", "", parameterName, "=", parameterValue, "");
        }



        #endregion


        public void AppendOrder(string orderString)
        {
            _orderString = orderString;
        }

        public void AppendGroupBy(string groupByString)
        {
            _groupByString = groupByString;
        }
    }
}

