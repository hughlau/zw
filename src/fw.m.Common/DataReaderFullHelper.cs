using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Linq.Expressions;

namespace fw.m.Common
{
    /// <summary>  
    /// DataReader高性能读取帮肋类  
    /// </summary>  
    public class DataReaderFullHelper
    {
        /// <summary>  
        /// 读取DataReader填充数据  
        /// </summary>  
        /// <typeparam name="T">实体数据体</typeparam>  
        /// <param name="reader">IDataReader对像</param>  
        /// <param name="autoDisposeReader">是否在读取完成后自动释放DataReader</param>  
        /// <param name="IgnoreCase">指定匹配列表不区分大小写</param>  
        /// <returns></returns>  
        public List<T> FullListFromList<T>(IDataReader reader, bool autoDisposeReader = true, bool IgnoreCase = false) where T : new()
        {
            List<T> result = new List<T>();
            try
            {

                Dictionary<int, DataColumn> columnDics = new Dictionary<int, DataColumn>();
                //表达式字典委托   
                Dictionary<int, Action<T, IDataReader>> actionDics = new Dictionary<int, Action<T, IDataReader>>();
                //数据实体类型  
                Type entityType = typeof(T);
                var perDic = entityType.GetProperties().ToDictionary(p => IgnoreCase ? p.Name.ToLower() : p.Name);
                //生成表头  
                for (int i = 0; i < reader.FieldCount; i++)
                {
                    //获取列名  
                    string colName = reader.GetName(i);
                    DataColumn col = new DataColumn()
                    {
                        ColumnName = IgnoreCase ? colName.ToLower() : colName,
                        DataType = reader.GetFieldType(i),
                        Namespace = reader.GetDataTypeName(i)
                    };
                    //添加列  
                    columnDics.Add(i, col);
                    //如果包含列则进行添加  
                    if (perDic.ContainsKey(col.ColumnName))
                    {
                        //获取字典值  
                        var perty = perDic[col.ColumnName];
                        bool isnullable = IsNullableType(perty.PropertyType);
                        if (isnullable)
                        {
                            actionDics.Add(i, SetValueToEntity<T>(i, perty, col.DataType, isnullable));
                        }
                        else
                        {
                            actionDics.Add(i, SetValueToEntity<T>(i, col.ColumnName, col.DataType));
                        }
                    }
                }

                //查询读取项  
                while (reader.Read())
                {
                    T objT = new T();
                    //添加到集合  
                    result.Add(objT);

                    //填充属性值  
                    foreach (var item in actionDics)
                    {
                        //判断字段是否为null  
                        if (!reader.IsDBNull(item.Key))
                        {
                            //设置属性值  
                            item.Value(objT, reader);
                        }
                        else
                        {
                            //null处理  
                        }
                    }
                }
            }
            catch(Exception ex)
            {
 
            }
            finally
            {
                //释放dataReader  
                if (reader != null && autoDisposeReader)
                {
                    reader.Close();
                    reader.Dispose();
                }
            }
            return result;
        }


        #region 设置读取实体属性值
        /// <summary>  
        /// nullable类型  
        /// </summary>  
        private Type nullableType = typeof(Nullable<>);
        /// <summary>  
        /// 判断一个类型是否为  Nullable 值类型  
        /// </summary>  
        /// <param name="theType">值类型数据</param>  
        /// <returns>是ull</returns>  
        public bool IsNullableType(Type theType)
        {
            return (theType.IsGenericType && theType.
              GetGenericTypeDefinition().Equals
              (nullableType));
        }

        /// <summary>  
        /// 返回null  
        /// </summary>  
        /// <typeparam name="T">值类型</typeparam>  
        /// <param name="par">值数据</param>  
        /// <returns></returns>  
        public static Func<T, Nullable<T>> ValueAction<T>() where T : struct
        {
            Func<T, Nullable<T>> fun = val => new Nullable<T>(val);
            return fun;
        }
        /// <summary>  
        /// 获取指定索引的数据并且返回调用委托  
        /// </summary>  
        /// <typeparam name="T">实体类类型</typeparam>  
        /// <typeparam name="T1">结果类型</typeparam>  
        /// <param name="index">当前对应在DataReader中的索引</param>  
        /// <param name="ProPertyName">对应实体类属性名</param>  
        /// <param name="FieldType">字段类型</param>  
        /// <returns>返回通过调用的委托</returns>  
        public Action<T, IDataRecord> SetValueToEntity<T>(int index, string ProPertyName, Type FieldType)
        {
            Type datareader = typeof(IDataRecord);

            IDataReader a;

            var Mdthods = datareader.GetMethods().Where(p => p.ReturnType == FieldType && p.Name.StartsWith("Get") && p.GetParameters().Where(n => n.ParameterType == typeof(int)).Count() == 1);
            //处理GetString方法  
            if (FieldType == typeof(string))
            {
                Mdthods = new System.Reflection.MethodInfo[] { datareader.GetMethod("GetString") };
            }
            //获取调用方法  
            System.Reflection.MethodInfo Method = null;
            if (Mdthods.Count() > 0)
            {
                Method = Mdthods.FirstOrDefault();
            }
            else
            {
                throw new EntryPointNotFoundException("没有从DataReader找到合适的取值方法");
            }
            ParameterExpression e = Expression.Parameter(typeof(T), "e");
            ParameterExpression r = Expression.Parameter(datareader, "r");
            //常数表达式  
            ConstantExpression i = Expression.Constant(index);
            MemberExpression ep = Expression.PropertyOrField(e, ProPertyName);
            MethodCallExpression call = Expression.Call(r, Method, i);



            //instance.Property = value 这名话是重点  
            BinaryExpression assignExpression = Expression.Assign(ep, call);
            var ex = Expression.Lambda(assignExpression, e, r);

            Expression<Action<T, IDataRecord>> resultEx = Expression.Lambda<Action<T, IDataRecord>>(assignExpression, e, r);
            Action<T, IDataRecord> result = resultEx.Compile();

            return result;
        }

        /// <summary>  
        /// 获取指定索引的数据并且返回调用委托,用于处理Nullable值类型值  
        /// </summary>  
        /// <typeparam name="T">实体类类型</typeparam>  
        /// <typeparam name="T1">结果类型</typeparam>  
        /// <param name="index">当前对应在DataReader中的索引</param>  
        /// <param name="ProPertyName">对应实体类属性名</param>  
        /// <param name="FieldType">字段类型</param>  
        /// <param name="isNnullable">是否null值</param>  
        /// <returns>返回通过调用的委托</returns>  
        public Action<T, IDataRecord> SetValueToEntity<T>(int index, System.Reflection.PropertyInfo ProPerty, Type FieldType, bool isNnullable)
        {

            Action<T, IDataRecord> result;
            //不是nullable正常返回  
            if (!isNnullable)
            {
                result = SetValueToEntity<T>(index, ProPerty.Name, FieldType);
            }
            else
            {
                //是 nullable 需要重新计算  
                Type datareader = typeof(IDataRecord);
                //获取值类型  
                var types = ProPerty.PropertyType.GetGenericArguments();
                Type valType = null;
                if (types.Length > 0)
                {
                    valType = types[0];
                }
                //这个方法是获取值的功能  
                var Mdthods = datareader.GetMethods().Where(p => p.ReturnType == valType && p.Name.StartsWith("Get") && p.GetParameters().Where(n => n.ParameterType == typeof(int)).Count() == 1);
                //处理GetString方法  
                if (FieldType == typeof(string))
                {
                    Mdthods = new System.Reflection.MethodInfo[] { datareader.GetMethod("GetString") };
                }
                //获取调用方法  
                System.Reflection.MethodInfo Method = null;
                if (Mdthods.Count() > 0)
                {
                    Method = Mdthods.FirstOrDefault();
                }
                else
                {
                    throw new EntryPointNotFoundException("没有从DataReader找到合适的取值方法");
                }
                //处理表达式  
                ParameterExpression e = Expression.Parameter(typeof(T), "e");
                ParameterExpression r = Expression.Parameter(datareader, "r");
                //常数表达式  
                ConstantExpression i = Expression.Constant(index);
                MemberExpression ep = Expression.PropertyOrField(e, ProPerty.Name);
                //调用dataReader的取值方法  
                MethodCallExpression call = Expression.Call(r, Method, i);

                #region Nullable
                //Nullable处理  
                var meth = GetType().GetMethod("ValueAction");
                var genthod = meth.MakeGenericMethod(valType);
                //调用方法生成委托  
                Delegate thod = (Delegate)genthod.Invoke(null, null);
                //将委托邦定到表达式树 new Nullable<int>(121);  
                MethodCallExpression callNullable = Expression.Call(thod.Method, call);
                #endregion


                //处理值  
                BinaryExpression assignExpression = Expression.Assign(ep, callNullable);
                var ex = Expression.Lambda(assignExpression, e, r);
                Expression<Action<T, IDataRecord>> resultEx = Expression.Lambda<Action<T, IDataRecord>>(assignExpression, e, r);
                result = resultEx.Compile();
            }


            return result;
        }

        /// <summary>  
        /// 获取指定索引的数据并且返回调用委托  
        /// </summary>  
        /// <typeparam name="T">实体类类型</typeparam>  
        /// <typeparam name="T1">结果类型</typeparam>  
        /// <param name="index">当前对应在DataReader中的索引</param>  
        /// <param name="ProPertyName">对应实体类属性名</param>  
        /// <param name="canreturn">是否有返回值</param>  
        /// <returns>返回通过调用的委托</returns>  
        public Func<T, IDataReader, T1> SetValueToEntity<T, T1>(int index, string ProPertyName)
        {
            Type datareader = typeof(IDataRecord);
            var Mdthods = datareader.GetMethods().Where(p => p.ReturnType == typeof(T1));
            //获取调用方法  
            System.Reflection.MethodInfo Method = null;
            if (Mdthods.Count() > 0)
            {
                Method = Mdthods.FirstOrDefault();
            }
            else
            {
                throw new EntryPointNotFoundException("没有从DataReader找到合适的取值方法");
            }
            ParameterExpression e = Expression.Parameter(typeof(T), "e");
            ParameterExpression r = Expression.Parameter(datareader, "r");
            //常数表达式  
            ConstantExpression i = Expression.Constant(index);
            MemberExpression ep = Expression.PropertyOrField(e, ProPertyName);
            MethodCallExpression call = Expression.Call(r, Method, i);



            //instance.Property = value 这句话是重点  
            BinaryExpression assignExpression = Expression.Assign(ep, call);
            var ex = Expression.Lambda(assignExpression, e, r);

            Expression<Func<T, IDataRecord, T1>> resultEx = Expression.Lambda<Func<T, IDataRecord, T1>>(assignExpression, e, r);
            Func<T, IDataRecord, T1> result = resultEx.Compile();

            return result;
        }

        /// <summary>  
        /// 获取设置DataRead与实体类指定列的表达式  
        /// </summary>  
        /// <typeparam name="T">实体类类型</typeparam>  
        /// <typeparam name="T1">结果类型</typeparam>  
        /// <param name="index">当前对应在DataReader中的索引</param>  
        /// <param name="ProPertyName">对应实体类属性名</param>  
        /// <param name="DataReaderGetValueMethodName">调用DataReader中获取值的方法名如:GetString</param>  
        /// <returns>返回通过调用的委托</returns>  
        public Func<T, IDataReader, T1> SetValueToEntity<T, T1>(int index, string ProPertyName, string DataReaderGetValueMethodName)
        {
            ParameterExpression e = Expression.Parameter(typeof(T), "e");
            ParameterExpression r = Expression.Parameter(typeof(IDataRecord), "r");
            //常数表达式  
            ConstantExpression i = Expression.Constant(index);
            MemberExpression ep = Expression.PropertyOrField(e, ProPertyName);
            MethodCallExpression call = Expression.Call(r, typeof(IDataRecord).GetMethod(DataReaderGetValueMethodName, new Type[] { typeof(int) }), i);
            //instance.Property = value 这名话是重点  
            BinaryExpression assignExpression = Expression.Assign(ep, call);
            var ex = Expression.Lambda(assignExpression, e, r);

            Expression<Func<T, IDataRecord, T1>> resultEx = Expression.Lambda<Func<T, IDataRecord, T1>>(assignExpression, e, r);
            Func<T, IDataRecord, T1> result = resultEx.Compile();

            return result;
        }

        /// <summary>  
        /// 获取设置属性值的委托  
        /// </summary>  
        /// <typeparam name="T">当关类型名</typeparam>  
        /// <typeparam name="T1">返回值</typeparam>  
        /// <param name="index">索引</param>  
        /// <param name="Entity">实体对像</param>  
        /// <param name="ProPertyName">属性名</param>  
        /// <param name="DataReaderGetValueMethodName">DataReader获取值方法名 如:"GetString"</param>  
        /// <returns></returns>  


        public Func<T, IDataRecord, int, T1> SetPropertyValue<T, T1>(int index, T Entity, string ProPertyName, string DataReaderGetValueMethodName)
        {


            //(e, r, index) => (e.bookname = r.GetString(index))  
            ParameterExpression e = Expression.Parameter(typeof(T), "e");
            ParameterExpression r = Expression.Parameter(typeof(IDataRecord), "r");
            ParameterExpression i = Expression.Parameter(typeof(int), "index");
            MemberExpression ep = Expression.PropertyOrField(e, ProPertyName);
            MethodCallExpression call = Expression.Call(r, typeof(IDataRecord).GetMethod(DataReaderGetValueMethodName, new Type[] { typeof(int) }), i);

            //instance.Property = value 这名话是重点  
            BinaryExpression assignExpression = Expression.Assign(ep, call);

            var ex = Expression.Lambda(assignExpression, e, r, i);

            Expression<Func<T, IDataRecord, int, T1>> resultEx = Expression.Lambda<Func<T, IDataRecord, int, T1>>(assignExpression, e, r, i);

            Func<T, IDataRecord, int, T1> result = resultEx.Compile();


            return result;



        }

        /// <summary>  
        ///
        /// sdd = sdd.Where(s => s.SKUCoding.Split('-').Contains(t));  
        /// </summary>  
        /// <typeparam name="T"></typeparam>  
        /// <param name="entity"></param>  
        /// <param name="propertyname"></param>  
        /// <param name="value"></param>  
        /// <returns></returns>  
        private IEnumerable<T> SearchTcontains<T>(IQueryable<T> entity, string propertyname, string value)// where T : EntityObject  
        {
            //   NorthwindEntities en = new NorthwindEntities();  
            ParameterExpression pe = Expression.Parameter(typeof(T), "c");
            MemberExpression me = Expression.Property(pe, "CustomerID");
            ConstantExpression ce = Expression.Constant(value);
            Expression right = Expression.Call(
            me,
                //  
            typeof(string).GetMethod("Contains", new Type[] { typeof(string) }),
            ce);
            Expression<Func<T, bool>> p = Expression.Lambda<Func<T, bool>>(right, pe);

            //  IEnumerable<T> ems = en.CreateQuery<T>(Plural<T>()).Where(p);  
            // return ems as IEnumerable<T>;  
            return null;

        }
        #endregion
    }  
}
