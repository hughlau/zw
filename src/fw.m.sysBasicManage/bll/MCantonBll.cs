using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwData;
using fw.m.sysBasicManage.data.model;
using fw.fwCache;
using fw.fwDal;
using fw.m.sysBasicManage.data;
using System.Data;
using fw.fwSession;
using fw.m.sysManage.data.model;

namespace fw.m.sysBasicManage.bll
{
    public class MCantonBll
    {
        /// <summary>
        /// 获取行政区列表
        /// </summary>
        /// <param name="userInfo">用户信息</param>
        /// <param name="xxCode">XXCode编码</param>
        /// <returns>行政区列表</returns>
        public static FWResult<FWDataTable> queryCantonList(IFWUserInfo userInfo, string cantonCode)
        {
            FWResult<FWDataTable> result = new FWResult<FWDataTable>() { };
            if (string.IsNullOrEmpty(cantonCode))
            {
                cantonCode = "100000";
            }
            FWSqlCommand cmd = new FWSqlCommand()
            {
                CommandText = @"
                               SELECT code code,pCode pCode,name [name],0 AS leve 
FROM dbo.FWDictionary
WHERE pCode=@cantonCode AND dictionaryTypeCode='BLLCanton'
order by leve, pCode
                                ",
            };
            cmd.Parameters.AddWithValue("cantonCode", cantonCode);
            DataTable dtbl = FWSqlCommandStaticHelper.ExecuteDataTable(cmd);
            dtbl.TableName = "FWDictionary";
            result.data = new FWDataTable(dtbl);
            result.status = FWResultStatus.Success;
            return result;
        }

        /// <summary>
        /// 用户管辖行政区规范化
        /// </summary>
        /// <param name="cantonCodeList">用户管辖行政区</param>
        /// <param name="paramsCantonCodeList">传入参数行政区</param>
        /// <param name="userID">用户编号</param>
        /// <returns>用户管辖行政区列表</returns>
        public static List<String> specialCantonCodeConvert(List<String> cantonCodeList, List<String> paramsCantonCodeList, String userID)
        {
            cantonCodeList = (cantonCodeList != null && cantonCodeList.Count > 0) ? cantonCodeList : searchUserCanton(userID);
            if (cantonCodeList != null && cantonCodeList.Count > 0 && paramsCantonCodeList != null && paramsCantonCodeList.Count > 0)
            {
                paramsCantonCodeList = search__ChildCantonCodeList(paramsCantonCodeList).Where(e => cantonCodeList.Contains(e)).ToList();
            }
            else
            {
                paramsCantonCodeList = cantonCodeList;
            }
            return paramsCantonCodeList;
        }

        /// <summary>
        /// 获取用户管辖行政区
        /// </summary>
        /// <param name="userID">用户编码</param>
        /// <returns>用户管辖行政区</returns>
        public static List<String> searchUserCanton(String userID)
        {
            List<String> list = new List<string>();
            StringBuilder sb = new StringBuilder();
            sb.Append(@"SELECT DISTINCT a.code Code,a.name Name,a.pCode ParentCode 
FROM dbo.FWDictionary a
INNER JOIN(
SELECT dic1.userID,dic2.code Code,dic1.dictionaryDataID,dic2.pCode ParentCode
 FROM dbo.FWUserMappingDictionary dic1
LEFT JOIN dbo.FWDictionary dic2 ON dic1.dictionaryDataID=dic2.dataID
AND dic2.dictionaryTypeCode='BLLCanton'
WHERE userID=@userID
) b ON a.code LIKE dbo.RemoveCode00(b.ParentCode)+'%'
WHERE dictionaryTypeCode='BLLCanton'
ORDER BY a.Code");
            FWSqlCommand cmd = new FWSqlCommand();
            cmd.CommandText = sb.ToString();
            cmd.Parameters.AddWithValue("@UserID", userID);

            DataTable dt = FWSqlCommandStaticHelper.ExecuteDataTable(cmd);
            if (dt != null && dt.Rows.Count > 0)
            {
                foreach (DataRow item in dt.Rows)
                {
                    list.Add(item["Code"].ToString());
                }
            }
            return list;
        }

        /// <summary>
        /// 获取子级行政区列表
        /// </summary>
        /// <param name="CantonCodeList"></param>
        /// <returns></returns>
        public static List<String> search__ChildCantonCodeList(List<String> CantonCodeList)
        {
            List<String> StringList = null;
            if (CantonCodeList != null && CantonCodeList.Count > 0)
            {
                StringList = new List<string>();
                foreach (String CantonCode in CantonCodeList)
                {
                    StringList.Add(CantonCode);
                    var List = fw.fwList.FWListHelper<MCanton>.getChildCodeList(queryCantonList(null).data, "parentCantonCode", "cantonCode", "childList", CantonCode);
                    if (List != null && List.Count > 0)
                    {
                        StringList.AddRange(List);
                    }
                }
            }
            return StringList;
        }
        /// <summary>
        /// 查询行政区列表
        /// </summary>
        /// <returns>行政区列表</returns>
        public static FWResult<List<MCanton>> queryCantonList(IFWUserInfo userInfo, QueryCantonParams queryParams)
        {
            FWResult<List<MCanton>> result = new FWResult<List<MCanton>>();
            StringBuilder sb = new StringBuilder();
            List<MCanton> EntityList = new List<MCanton>();
            #region 查询语句
            sb.AppendFormat(@"SELECT t1.code AS cantonCode,t1.name cantonName,t1.pCode AS parentCantonCode
,t2.name AS parentCantonName 
,isLeaf = CAST((SELECT CASE WHEN EXISTS( SELECT 1 FROM dbo.FWDictionary WHERE code=t1.pCode  and level>3 AND dictionaryTypeCode='BLLCanton')THEN 0 ELSE 1 END) AS BIT)
 FROM dbo.FWDictionary t1 WITH(NOLOCK)
 LEFT JOIN FWDictionary t2 WITH(NOLOCK) ON t1.pCode=t2.code and t2.dictionaryTypeCode='BLLCanton'
 WHERE 1=1  AND t1.dictionaryTypeCode='BLLCanton' ");
            FWSqlCommand cmd = new FWSqlCommand();
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.code))
                {
                    sb.AppendFormat(@" AND t1.code=@cantonCode");
                    cmd.Parameters.AddWithValue("@cantonCode", queryParams.code);
                }
                if (!string.IsNullOrEmpty(queryParams.parentCode))
                {
                    sb.AppendFormat(@" AND t1.pCode =@parentCode");
                    cmd.Parameters.AddWithValue("@parentCode", queryParams.parentCode);
                }
            }
            sb.AppendFormat(@" ORDER BY t1.code DESC");
            cmd.CommandText = sb.ToString();
            EntityList = FWSqlEntityToFWCommandStaticHelper.queryList<MCanton>(cmd);
            #endregion
            result.data = EntityList;
            result.status = FWResultStatus.Success;
            return result;
        }

        /// <summary>
        /// 查询行政区列表
        /// </summary>
        /// <returns>行政区列表</returns>
        public static FWResult<List<MCanton>> queryCantonList(QueryCantonParams queryParams)
        {
            FWResult<List<MCanton>> result = new FWResult<List<MCanton>>();
            StringBuilder sb = new StringBuilder();
            List<MCanton> EntityList = new List<MCanton>();
            #region 查询语句
            sb.AppendFormat(@"SELECT t1.code AS cantonCode,t1.name cantonName,t1.pCode AS parentCantonCode
,t2.name AS parentCantonName
,isLeaf = CAST((SELECT CASE WHEN EXISTS( SELECT 1 FROM dbo.FWDictionary WHERE code=t1.pCode  and level>3 AND dictionaryTypeCode='BLLCanton')THEN 0 ELSE 1 END) AS BIT)
 FROM dbo.FWDictionary t1 WITH(NOLOCK)
 LEFT JOIN dbo.FWDictionary t2 WITH(NOLOCK) ON t1.pCode=t2.code AND t2.dictionaryTypeCode='BLLCanton'
 WHERE 1=1  AND t1.dictionaryTypeCode='BLLCanton' ");
            FWSqlCommand cmd = new FWSqlCommand();
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.code))
                {
                    sb.AppendFormat(@" AND t1.code=@cantonCode");
                    cmd.Parameters.AddWithValue("@cantonCode", queryParams.code);
                }
                if (!string.IsNullOrEmpty(queryParams.parentCode))
                {
                    sb.AppendFormat(@" AND t1.PCode =@parentCode");
                    cmd.Parameters.AddWithValue("@parentCode", queryParams.parentCode);
                }
            }
            sb.AppendFormat(@" ORDER BY t1.code DESC");
            cmd.CommandText = sb.ToString();
            EntityList = FWSqlEntityToFWCommandStaticHelper.queryList<MCanton>(cmd);
            #endregion
            result.data = EntityList;
            result.status = FWResultStatus.Success;
            return result;
        }


        public static FWResult<List<MFWCantonData>> queryCantonListFilter(IFWUserInfo userInfo, string userID)
        {
            FWResult<List<MFWCantonData>> result = new FWResult<List<MFWCantonData>>() { };
            if (string.IsNullOrEmpty(userID))
            {
                result.data = null;
                result.status = FWResultStatus.Failure;
                result.infoList.Add("参数 userID 不能为空！");
                return result;
            }
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            fwSqlCommand.CommandText = string.Format(@"  
  
SELECT 
t1.[dataID]
,t1.[dictionaryTypeCode]
,t1.[code]  
,t1.[pCode]  
,t1.[name]  
,t1.[level] 
,t1.[fullCode]
,t1.[fullName]
,t1.[ix] 
,t2.userid  selectedUserId
FROM  [dbo].[FWDictionary] t1
LEFT JOIN 
( select  * from [dbo].[FWUserMappingDictionary]  where userID ='{1}'  ) t2   ON t1.[dataID]=t2.dictionaryDataID  AND isnull(t1.isdis,0)=0
WHERE  t1.[dictionaryTypeCode] = '{0}'
 ", DictionaryTypeCodeSettings.BLLCanton, FWSqlCommandStaticHelper.checkParam(userID));

            try
            {
                var cantonList = FWSqlEntityToFWCommandStaticHelper.queryList<MFWCantonData>(fwSqlCommand);
                if (cantonList != null)
                {
                    Action<MFWCantonData> action = new Action<MFWCantonData>(userIsSelected);
                    cantonList.ForEach(action);
                }

                var cantonTreeList = fwList.FWListHelper<MFWCantonData>.toTree(cantonList, "pCode", "code", "childDataList", "BLLCanton");
                result.data = getCantonByLvl(cantonTreeList);
                result.status = FWResultStatus.Success;

            }
            catch (Exception ex)
            {

                result.data = null;
                result.status = FWResultStatus.Error;
                result.infoList.Add(ex.Message);
            }
            return result;
        }



        public static void userIsSelected(MFWCantonData entity)
        {
            if (entity != null)
            {
                entity.isSelected = !string.IsNullOrEmpty(entity.selectedUserId);
            }
        }
        public static List<MFWCantonData> getCantonByLvl(List<MFWCantonData> cantonList)
        {
            List<MFWCantonData> result = new List<MFWCantonData>();
            if (cantonList != null && cantonList.Count > 0)
            {
                foreach (var canton in cantonList)
                {
                    if (canton.isSelected)
                    {
                        result.Add(canton);
                    }
                    else
                    {
                        var childCantonDataList = getCantonByLvl(canton.childDataList);
                        if (childCantonDataList != null && childCantonDataList.Count > 0)
                        {
                            result = result.Concat(childCantonDataList).ToList();
                        }
                    }
                }
            }
            return result;
        }

        /// <summary>
        /// 默认返回2级数据
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="cantonCode"></param>
        /// <returns></returns>
        public static FWResult<List<MFWCantonData>> queryCantonListByTwoLvl(IFWUserInfo userInfo, string cantonCode)
        {
            FWResult<List<MFWCantonData>> result = new FWResult<List<MFWCantonData>>() { };
            FWSqlCommand fwSqlCommand = new FWSqlCommand();

            string lvl_sql = " AND [level]<=2 ";
            string code_sql = string.Empty;
            if (!string.IsNullOrEmpty(cantonCode))
            {
                lvl_sql = string.Format(" AND [level]<=(select top 1 [level]+1 FROM  [dbo].[FWDictionary]  where code='{0}') ", cantonCode);
                code_sql = string.Format(" AND  [code]  LIKE '{0}%' ", cantonCode);
            }
            fwSqlCommand.CommandText = string.Format(@"  
SELECT 
t1.[dataID]
,t1.[dictionaryTypeCode]
,t1.[code]  
,t1.[pCode]  
,t1.[name]  
,t1.[level] 
,t1.[fullCode]
,t1.[fullName]
,t1.[ix] 
FROM  [dbo].[FWDictionary] t1
WHERE  t1.[dictionaryTypeCode] = '{0}'
AND ISNULL(t1.isDis,0)=0 
{1}  {2}
 ", DictionaryTypeCodeSettings.BLLCanton, lvl_sql, code_sql);
            fwSqlCommand.CommandText += " order by t1.code ,t1.ix  ";
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MFWCantonData>(fwSqlCommand);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {

                result.data = null;
                result.status = FWResultStatus.Error;
                result.infoList.Add(ex.Message);
            }
            return result;
        }

        /// <summary>
        /// 默认返回3级数据
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="cantonCode"></param>
        /// <returns></returns>
        public static FWResult<List<MFWCantonData>> queryCantonListByThreeLvl(IFWUserInfo userInfo, string cantonCode)
        {
            FWResult<List<MFWCantonData>> result = new FWResult<List<MFWCantonData>>() { };
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            string lvl_sql = " AND [level]<=3 ";
            string code_sql = string.Empty;
            string canton_sql = string.Empty;
            if (!string.IsNullOrEmpty(cantonCode))
            {
                lvl_sql = string.Format(" AND [level]<=(select top 1 [level]+1 FROM  [dbo].[FWDictionary]  where code='{0}') ", cantonCode);
                code_sql = string.Format(" AND  [code]  LIKE '{0}%' ", cantonCode);
            }
            if (basicUserInfo.roleCodeList.Contains("managerRole") && basicUserInfo.cantonCodeList.Count>0)
            {
                StringBuilder cantonBuilder = new StringBuilder();
                for (int i = 0; i < basicUserInfo.cantonCodeList.Count; i++)
                {
                    cantonBuilder.Append(string.Format(" OR  [code]  LIKE '{0}%' ", basicUserInfo.cantonCodeList[i]));
                }
                canton_sql = " AND ( "+cantonBuilder.ToString().Substring(3)+ ")";
            }
            fwSqlCommand.CommandText = string.Format(@"  
SELECT 
t1.[dataID]
,t1.[dictionaryTypeCode]
,t1.[code]  
,t1.[pCode]  
,t1.[name]  
,t1.[level] 
,t1.[fullCode]
,t1.[fullName]
,t1.[ix] 
FROM  [dbo].[FWDictionary] t1
WHERE  t1.[dictionaryTypeCode] = '{0}'
AND ISNULL(t1.isDis,0)=0 
{1}  {2} {3}
 ", DictionaryTypeCodeSettings.BLLCanton, lvl_sql, code_sql,canton_sql);
            fwSqlCommand.CommandText += " order by t1.code ,t1.ix  ";
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MFWCantonData>(fwSqlCommand);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {

                result.data = null;
                result.status = FWResultStatus.Error;
                result.infoList.Add(ex.Message);
            }
            return result;
        }

        public static FWResult<List<MFWCantonData>> queryCantonListTwoLvlByUserID(IFWUserInfo userInfo, bool isTwoLvl)
        {
            FWResult<List<MFWCantonData>> result = new FWResult<List<MFWCantonData>>() { };
            if (userInfo == null || string.IsNullOrEmpty(userInfo.userID))
            {
                result.data = null;
                result.status = FWResultStatus.Failure;
                result.infoList.Add("参数 userID 不能为空！");
                return result;
            }
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            fwSqlCommand.CommandText = string.Format(@"  
  
SELECT 
t1.[dataID]
,t1.[dictionaryTypeCode]
,t1.[code]  
,t1.[pCode]  
,t1.[name]  
,t1.[level] 
,t1.[fullCode]
,t1.[fullName]
,t1.[ix] 
,t2.userid  selectedUserId
FROM  [dbo].[FWDictionary] t1
LEFT JOIN 
( select  * from [dbo].[FWUserMappingDictionary]  where userID ='{1}'  ) t2   ON t1.[dataID]=t2.dictionaryDataID  AND isnull(t1.isdis,0)=0
WHERE  t1.[dictionaryTypeCode] = '{0}'
 ", DictionaryTypeCodeSettings.BLLCanton, FWSqlCommandStaticHelper.checkParam(userInfo.userID));

            try
            {
                var cantonList = FWSqlEntityToFWCommandStaticHelper.queryList<MFWCantonData>(fwSqlCommand);
                if (cantonList != null)
                {
                    Action<MFWCantonData> action = new Action<MFWCantonData>(userIsSelected);
                    cantonList.ForEach(action);
                }

                var cantonTreeList = fwList.FWListHelper<MFWCantonData>.toTree(cantonList, "pCode", "code", "childDataList", "BLLCanton");
                //已分配的行政区列表
                var cantonSelectedList = getCantonByLvl(cantonTreeList);
                if (cantonSelectedList != null && cantonSelectedList.Count > 0)
                {
                    var fLvl = cantonSelectedList.Select(p => p.level).Max();
                    string lvlFilterSql = string.Empty;
                    if (isTwoLvl)
                    {
                        lvlFilterSql = string.Format(" AND ( t1.[level]>={0} AND t1.[level]<={1} ) ", fLvl, fLvl + 1);
                    }
                    FWSqlCommand sqlCommand = new FWSqlCommand();
                    sqlCommand.CommandText = string.Format(@"  
SELECT 
t1.[dataID]
,t1.[dictionaryTypeCode]
,t1.[code]  
,t1.[pCode]  
,t1.[name]  
,t1.[level] 
,t1.[fullCode]
,t1.[fullName]
,t1.[ix] 
FROM  [dbo].[FWDictionary] t1
WHERE  t1.[dictionaryTypeCode] = '{0}'
AND ISNULL(t1.isDis,0)=0 
{1} AND ( {2} )  
 ", DictionaryTypeCodeSettings.BLLCanton, lvlFilterSql, getCantonCodeFilterSql(cantonSelectedList.Select(p => p.code).ToList(), "t1.code"));
                    result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MFWCantonData>(sqlCommand);
                }
                result.status = FWResultStatus.Success;

            }
            catch (Exception ex)
            {

                result.data = null;
                result.status = FWResultStatus.Error;
                result.infoList.Add(ex.Message);
            }
            return result;
        }

        #region 获取用户行政区中心坐标点
        public static MFWCantonData getCantonPosXY(string userID)
        {
            MFWCantonData result = new MFWCantonData();
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            if (!string.IsNullOrEmpty(userID))
            {
                fwSqlCommand.CommandText = string.Format(@"  
SELECT 
code 
,[level]
,cast([posX] as decimal(18,6)) [posX]
,cast([posY] as decimal(18,6)) [posY]
  FROM  [dbo].[FWDictionary] t1  INNER JOIN [dbo].[FWDictionary_BLLCanton] t2 ON t1.[dataID]=t2.[dataID] 
 INNER JOIN  dbo.FWUserInfo t3 ON t1.code=t3.cantonCode
 WHERE  t3.[userID]='{0}'     ", FWSqlCommandStaticHelper.checkParam(userID));

                try
                {
                    result = FWSqlEntityToFWCommandStaticHelper.query<MFWCantonData>(fwSqlCommand);
                }
                catch (Exception ex)
                {

                    result = null;
                }
            }
            return result;
        }
        #endregion

        //行政区过滤
        public static string getCantonCodeFilterSql(List<string> cantonCodeList, string conditionField)
        {
            string result = string.Empty;
            if (!string.IsNullOrEmpty(conditionField) && cantonCodeList != null && cantonCodeList.Count > 0)
            {
                result = cantonCodeList.Where(p => !string.IsNullOrEmpty(p))
                     .Select(
                         p => string.Format(" {0} like '{1}%' ", conditionField, FWSqlCommandStaticHelper.checkParam(p)))
                     .Aggregate((sqlSentence, next) => sqlSentence + " or  " + next);
            }
            else
            {
                result = " 1<>1 ";
            }
            return result;
        }

        #region 获取行政区字典列表
        public static FWResult<FWDataTable> getCantonDicData(IFWUserInfo userInfo, string pCode)
        {
            if (string.IsNullOrEmpty(pCode))
                pCode = "BLLCanton";     
            var cantonCacheData = FWCacheHelper<FWDataTable>.getData(pCode);
            if (cantonCacheData != null)
                return new FWResult<FWDataTable>
                {
                    data = cantonCacheData,
                    status = FWResultStatus.Success
                };
            var listCantonCode = getFirstLevelCanton();

            foreach (var cantonCode in listCantonCode)
            {
                var sb=new StringBuilder();
                //修改sql语句，查询更快
                sb.AppendFormat(@"SELECT tb1.code,tb1.pCode,tb1.name,tb1.[level]-1 leve,tb1.[ix] 
                FROM [FWDictionary] tb1 left join [FWDictionaryType] tb3 
                on tb3.[dictionaryTypeCode]=tb1.[dictionaryTypeCode] 
                where tb1.[dictionaryTypeCode]='BLLCanton' and (tb1.pCode like '{0}%' or tb1.code='{0}') 
                and tb1.isDis=0 order by tb1.code", cantonCode);
                var cmd = new FWSqlCommand {CommandText = sb.ToString()};
                var dtbl = FWSqlCommandStaticHelper.ExecuteDataTable(cmd);
                dtbl.TableName = "FWDictionary";
                cantonCacheData = new FWDataTable(dtbl);
                FWCacheHelper<FWDataTable>.set(cantonCode, new FWCacheData<FWDataTable>
                {
                    description = cantonCode + "行政区字典信息",
                    data = cantonCacheData
                });
            }

            var cmdBllCanton = new FWSqlCommand
            {
                CommandText =
                    @"SELECT tb1.code,tb1.pCode,tb1.name,tb1.[level]-1 leve,tb1.[ix] FROM [FWDictionary] tb1 
                    left join [FWDictionaryType] tb3 
                    on tb3.[dictionaryTypeCode]=tb1.[dictionaryTypeCode] 
                    where tb1.[dictionaryTypeCode]='BLLCanton' and tb1.isDis=0 order by tb1.code"
            };
            var dataTable = FWSqlCommandStaticHelper.ExecuteDataTable(cmdBllCanton);
            dataTable.TableName = "FWDictionary";
            cantonCacheData = new FWDataTable(dataTable);
            FWCacheHelper<FWDataTable>.set("BLLCanton", new FWCacheData<FWDataTable>
            {
                description ="BLLCanton行政区字典信息",
                data = cantonCacheData
            });

            return new FWResult<FWDataTable>
            {
                data = FWCacheHelper<FWDataTable>.getData(pCode),
                status = FWResultStatus.Success
            };
        }
        #endregion

        //获取第一级市code集合
        public static List<string> getFirstLevelCanton()
        {
            var listCantonCode = new List<string>();
            var sql = new FWSqlCommand
            {
                CommandText = "select * from FWDictionary where pCode='BLLCanton' and isDis=0"
            };
            var firstLevelCanton = FWSqlEntityToFWCommandStaticHelper.queryList<MFWCantonData>(sql);
            listCantonCode.AddRange(firstLevelCanton.Select(item => item.code));
            return listCantonCode;
        }

        #region 手机端获取行政区字典列表

        public static FWResult<List<MFWDictionary>> getCantonDicDataByMobile(IFWUserInfo userInfo, string pCode)
        {
            FWResult<List<MFWDictionary>> result = new FWResult<List<MFWDictionary>>();
            if (string.IsNullOrEmpty(pCode))
                pCode = "BLLCanton";
            var cantonCacheData = FWCacheHelper<List<MFWDictionary>>.getData(pCode+"Mobile");
            if (cantonCacheData != null)
            {
                result.data = cantonCacheData;
                result.status = FWResultStatus.Success;
                return result;
            }

            var listCode = getFirstLevelCanton();
            foreach (var code in listCode)
            {
                var sb = new StringBuilder();
                sb.AppendFormat(@"SELECT tb1.[dataID] [mDataID] ,tb1.[dictionaryTypeCode] [mDictionaryTypeCode] ,
                tb3.[dictionaryTypeName] [mDictionaryTypeName] ,tb1.[code] [mCode] ,tb1.[pCode] [mPCode] ,tb1.[name] [mName] ,
                tb1.[level] [mLevel] ,tb1.[fullCode] [mFullCode] ,tb1.[fullName] [mFullName] ,tb1.[ix] [mIx] ,
                tb1.[isDis] [mIsDis] FROM [FWDictionary] tb1 left join [FWDictionaryType] tb3 
                on tb3.[dictionaryTypeCode]=tb1.[dictionaryTypeCode] where tb1.[dictionaryTypeCode]='BLLCanton' 
                and (tb1.pCode like '{0}%' or tb1.code='{0}') and tb1.isDis=0 order by tb1.ix", code);
                var fwSqlCommand = new FWSqlCommand { CommandText = sb.ToString() };
                var cantonData = FWSqlEntityToFWCommandStaticHelper.queryList<MFWDictionary>(fwSqlCommand);
                FWCacheHelper<List<MFWDictionary>>.set(code + "Mobile", new FWCacheData<List<MFWDictionary>>
                {
                    description = code + "行政区字典信息",
                    data = cantonData
                });
            }

            var stringBuilder = new StringBuilder();
            stringBuilder.AppendFormat(@"SELECT tb1.[dataID] [mDataID] ,tb1.[dictionaryTypeCode] [mDictionaryTypeCode] ,
            tb3.[dictionaryTypeName] [mDictionaryTypeName] ,tb1.[code] [mCode] ,tb1.[pCode] [mPCode] ,tb1.[name] [mName] ,
            tb1.[level] [mLevel] ,tb1.[fullCode] [mFullCode] ,tb1.[fullName] [mFullName] ,tb1.[ix] [mIx] ,
            tb1.[isDis] [mIsDis] FROM [FWDictionary] tb1 left join [FWDictionaryType] tb3 
            on tb3.[dictionaryTypeCode]=tb1.[dictionaryTypeCode] 
            where tb1.[dictionaryTypeCode]='BLLCanton' and tb1.isDis=0 order by tb1.ix");

            var cmd = new FWSqlCommand { CommandText = stringBuilder.ToString() };
            var bllCantonData= FWSqlEntityToFWCommandStaticHelper.queryList<MFWDictionary>(cmd);
            FWCacheHelper<List<MFWDictionary>>.set("BLLCanton" + "Mobile", new FWCacheData<List<MFWDictionary>>
            {
                description = "BLLCanton行政区字典信息",
                data = bllCantonData
            });
            result.data = FWCacheHelper<List<MFWDictionary>>.getData(pCode + "Mobile"); ;
            result.status = FWResultStatus.Success;
            return result;
        }
        #endregion
    }
}
