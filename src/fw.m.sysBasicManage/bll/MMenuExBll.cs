using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwData;
using fw.fwSession;
using fw.m.sysBasicManage.data.model;
using fw.fwDal;
using fw.m.sysBasicManage.dal;
using System.Data.SqlClient;
using System.Data;
using fw.fwDataTable;
using fw.m.sysBasicManage.data.entity;
using fw.fwCache;

namespace fw.m.sysBasicManage.bll
{
    public class MMenuExBll
    {


        #region 实体转换

        public static T convertEntity<T>(Object obj)
        {
            return FWEntityObject.convertEntity<T>(obj, SysBasicManageBll.getPropertyNameMapping(obj.GetType().Name));
        }

        public static List<T> convertEntityList<T>(List<Object> objList)
        {
            List<T> tList = new List<T>();
            foreach (var obj in objList)
            {
                tList.Add(convertEntity<T>(obj));
            }
            return tList;
        }
        #endregion

        //新增或更新
        public static FWResult<bool> insertOrUpdateMMenuExByMenuCode(IFWUserInfo userInfo, MMenuEx mEntity)
        {
            return insertOrUpdateMMenuExByMenuCode(userInfo, MMenuExBll.convertEntity<T_Sys_MenuExInfo>(mEntity));
        }

        public static FWResult<bool> insertOrUpdateMMenuExByMenuCode(IFWUserInfo userInfo, T_Sys_MenuExInfo mEntity)
        {
            FWResult<bool> result = new FWResult<bool>();
            if (mEntity != null && !string.IsNullOrEmpty(mEntity.menuCode))
            {
                mEntity.isDelete = 0;
                mEntity.inputMan = userInfo.userID;
                mEntity.updaterMan = userInfo.userID;
                mEntity.inputTime = DateTime.Now;
                mEntity.updateTime = DateTime.Now;
                //mEntity.attachmentURL = string.IsNullOrEmpty(mEntity.attachmentURL) ? string.Empty : mEntity.attachmentURL;
                //var menuEntity = queryMMenuEx(userInfo, mEntity.menuCode).data;
                //新增 更新 直接操作 无需判断
                result.data = MMenuExDal.insertOrUpdateMMenuExByMenuCode(mEntity);

                #region 清除关键字缓存

                try
                {
                    FWCacheHelper<List<MMenuKeyword>>.remove("queryMenuKeywords");
                }
                catch (Exception)
                {
                }
                
                #endregion

                if (result.data == true)
                {
                    result.status = FWResultStatus.Success;
                }
            }
            else
            {
                result.data = false;
                result.status = FWResultStatus.Failure;
            }
            return result;
        }


        //物理删除
        public static FWResult<bool> deleteMMenuExByMenuCode(IFWUserInfo userInfo, List<string> mMenuCodeList)
        {
            FWResult<bool> result = new FWResult<bool>();
            var cmdList = MMenuExDal.deleteMMenuExByMenuCode(mMenuCodeList);
            result.data = FWSqlCommandStaticHelper.ExecuteNonQuery(cmdList) > 0;
            #region 清除关键字缓存

            try
            {
                FWCacheHelper<List<MMenuKeyword>>.remove("queryMenuKeywords");
            }
            catch (Exception)
            {
            }

            #endregion
            if (result.data == true)
            {
                result.status = FWResultStatus.Success;
            }
            return result;
        }
        public static FWResult<MMenuEx> queryMMenuEx(IFWUserInfo userInfo, string mMenuCode)
        {
            FWResult<MMenuEx> result = new FWResult<MMenuEx>();
            FWSqlCommand cmd = new FWSqlCommand();
            cmd.CommandText = string.Format(@"
SELECT tb1.[menuTypeCode] [mMenuTypeCode],tb3.[name] [mMenuTypeName]
,tb1.[pMenuCode] [mPMenuCode],tb1.[menuCode] [mMenuCode]
,tb1.[menuName] [mMenuName],tb1.[iconUrl] [mIconUrl]
,tb1.[title] [mTitle],tb1.[isHtmlPage] [mIsHtmlPage]
--,tb1.[windowName] [mWindowName]
,tb1.[url] [mUrl]
,tb1.[urlParamsJson] [mUrlParamsJson]
,tb1.[openTypeCode] [mOpenTypeCode]
,tb5.[name] [mOpenTypeName]
--,tb1.[layoutHorizontalAlignment] [mLayoutHorizontalAlignment]
--,tb1.[layoutVerticalAlignment] [mLayoutVerticalAlignment]
--,tb1.[layoutTop] [mLayoutTop]
--,tb1.[layoutRight] [mLayoutRight]
--,tb1.[layoutBottom] [mLayoutBottom]
--,tb1.[layoutLeft] [mLayoutLeft]
,tb1.[layoutWidth] [mLayoutWidth],tb1.[layoutHeight] [mLayoutHeight]
--,tb1.[infoNumber] [mInfoNumber]
--,tb1.[onFocusInScriptCode] [mOnFocusInScriptCode]
--,tb1.[onFocusOutScriptCode] [mOnFocusOutScriptCode]
,tb1.[ix] [mIx],tb1.[isDis] [mIsDis],menuInfo.openMeans             
FROM [dbo].[FWMenu] tb1
LEFT JOIN dbo.T_Sys_MenuExInfo menuInfo ON menuInfo.menuCode = tb1.menuCode
left join [dbo].[FWDictionary] tb3 on tb3.[pCode]='FWMenuType' and tb1.[menuTypeCode]=tb3.[code]
left join [dbo].[FWDictionary] tb5 on tb5.[pCode]='FWOpenType' and tb1.[openTypeCode]=tb5.[code] 
WHERE ISNULL(menuInfo.isDelete,0)=0 and isnull(menuInfo.isDelete,0)=0 and  tb1.menuCode='{0}'  ", mMenuCode);
            result.data = FWSqlEntityToFWCommandStaticHelper.query<MMenuEx>(cmd);
            if (result.data != null)
            {
                result.status = FWResultStatus.Success;
            }
            return result;
        }
        public static FWResult<List<MMenuEx>> queryMMenuExList(IFWUserInfo userInfo, data.QueryMMenuExParams queryParams)
        {
            FWResult<List<MMenuEx>> result = new FWResult<List<MMenuEx>>();

            #region sql拼接
            StringBuilder sb = new StringBuilder();
            sb.Append(@"
            SELECT 
	        tb1.[menuTypeCode] [mMenuTypeCode]
	        ,tb3.[name] [mMenuTypeName]
	        ,tb1.[pMenuCode] [mPMenuCode]
	        ,tb1.[menuCode] [mMenuCode]
	        ,tb1.[menuName] [mMenuName]
	        ,tb1.[iconUrl] [mIconUrl]
	        ,tb1.[title] [mTitle]
	        ,tb1.[isHtmlPage] [mIsHtmlPage]
	        --,tb1.[windowName] [mWindowName]
	        ,tb1.[url] [mUrl]
	        ,tb1.[urlParamsJson] [mUrlParamsJson]
	        ,tb1.[openTypeCode] [mOpenTypeCode]
	        ,tb5.[name] [mOpenTypeName]
	        --,tb1.[layoutHorizontalAlignment] [mLayoutHorizontalAlignment]
	        --,tb1.[layoutVerticalAlignment] [mLayoutVerticalAlignment]
	        --,tb1.[layoutTop] [mLayoutTop]
	        --,tb1.[layoutRight] [mLayoutRight]
	        --,tb1.[layoutBottom] [mLayoutBottom]
	        --,tb1.[layoutLeft] [mLayoutLeft]
	        ,tb1.[layoutWidth] [mLayoutWidth]
	        ,tb1.[layoutHeight] [mLayoutHeight]
	        --,tb1.[infoNumber] [mInfoNumber]
	        --,tb1.[onFocusInScriptCode] [mOnFocusInScriptCode]
	        --,tb1.[onFocusOutScriptCode] [mOnFocusOutScriptCode]
	        ,tb1.[ix] [mIx]
	        ,tb1.[isDis] [mIsDis]
            ,tb2.pageID
            ,tb2.menuCode
            ,tb2.keyWords
            ,tb2.funDescription
            ,tb2.instructions
            ,tb2.questions
            ,tb2.attachmentName
            ,tb2.attachmentURL
            ,tb2.keysParamsJson
            ,tb2.keysReturnJson
            ,tb2.frequency
            ,tb2.isDelete
            ,tb2.showType
        FROM [dbo].[FWMenu] tb1
            INNER  JOIN [dbo].[T_Sys_MenuExInfo] tb2 ON  tb1.[menuCode]=tb2.[menuCode]  --内联
	        left join [dbo].[FWDictionary] tb3 on tb3.[pCode]='FWMenuType' and tb1.[menuTypeCode]=tb3.[code]
	        left join [dbo].[FWDictionary] tb5 on tb5.[pCode]='FWOpenType' and tb1.[openTypeCode]=tb5.[code] 
            WHERE 1=1  ");

            if (queryParams != null)
            {
                //根据父级菜单编码 查询
                if (!string.IsNullOrEmpty(queryParams.pMenuCode))
                {
                    sb.AppendFormat(" AND tb1.[pMenuCode] ='{0}' ", queryParams.pMenuCode);
                }

            }

            #endregion
            sb.Append("order by  tb1.ix ");


            FWSqlCommand cmd = new FWSqlCommand();
            cmd.CommandText = sb.ToString();
            result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MMenuEx>(cmd);
            if (result.data != null)
            {
                result.status = FWResultStatus.Success;
            }
            return result;
        }
        public static FWResult<FWPageData<MMenuEx>> queryPageMMenuEx(IFWUserInfo userInfo, FWPageParams pageParams, data.QueryMMenuExParams queryParams)
        {
            FWResult<FWPageData<MMenuEx>> result = new FWResult<FWPageData<MMenuEx>>();

            #region 查询
            StringBuilder sbSql = new StringBuilder();
            StringBuilder afterFromBeforeOrderBySql = new StringBuilder();
            StringBuilder strBySql = new StringBuilder();
            sbSql.AppendFormat(@"
	        tb1.[menuTypeCode] [mMenuTypeCode]
	        ,tb3.[name] [mMenuTypeName]
	        ,tb1.[pMenuCode] [mPMenuCode]
	        ,tb1.[menuCode] [mMenuCode]
	        ,tb1.[menuName] [mMenuName]
	        ,tb1.[iconUrl] [mIconUrl]
	        ,tb1.[title] [mTitle]
	        ,tb1.[isHtmlPage] [mIsHtmlPage]
	        --,tb1.[windowName] [mWindowName]
	        ,tb1.[url] [mUrl]
	        ,tb1.[urlParamsJson] [mUrlParamsJson]
	        ,tb1.[openTypeCode] [mOpenTypeCode]
	        ,tb5.[name] [mOpenTypeName]
	        --,tb1.[layoutHorizontalAlignment] [mLayoutHorizontalAlignment]
	        --,tb1.[layoutVerticalAlignment] [mLayoutVerticalAlignment]
	        --,tb1.[layoutTop] [mLayoutTop]
	        --,tb1.[layoutRight] [mLayoutRight]
	        --,tb1.[layoutBottom] [mLayoutBottom]
	        --,tb1.[layoutLeft] [mLayoutLeft]
	        ,tb1.[layoutWidth] [mLayoutWidth]
	        ,tb1.[layoutHeight] [mLayoutHeight]
	        --,tb1.[infoNumber] [mInfoNumber]
	        --,tb1.[onFocusInScriptCode] [mOnFocusInScriptCode]
	        --,tb1.[onFocusOutScriptCode] [mOnFocusOutScriptCode]
	        ,tb1.[ix] [mIx]
	        ,tb1.[isDis] [mIsDis]
            ,tb2.pageID
            ,tb2.menuCode
            ,tb2.keyWords
            ,tb2.funDescription
            ,tb2.instructions
            ,tb2.questions
            ,tb2.attachmentName
            ,tb2.attachmentURL
            ,tb2.keysParamsJson
            ,tb2.keysReturnJson
            ,tb2.frequency
            ,tb2.isDelete
            ,tb2.showType ");

            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            FWSqlPageProcedureParams fwSqlPageProcedureParams = (FWSqlPageProcedureParams)fwPageProcedureParams;
            afterFromBeforeOrderBySql.Append(@" [dbo].[FWMenu] tb1
            INNER  JOIN [dbo].[T_Sys_MenuExInfo] tb2 ON  tb1.[menuCode]=tb2.[menuCode]  --内联
	        left join [dbo].[FWDictionary] tb3 on tb3.[pCode]='FWMenuType' and tb1.[menuTypeCode]=tb3.[code]
	        left join [dbo].[FWDictionary] tb5 on tb5.[pCode]='FWOpenType' and tb1.[openTypeCode]=tb5.[code]  WHERE 1=1 ");



            fwPageProcedureParams.searchField = sbSql.ToString();
            fwPageProcedureParams.afterFromBeforeOrderBySql = afterFromBeforeOrderBySql.ToString();
            fwSqlPageProcedureParams.orderByField = "  tb1.[menuCode]  ";
            SqlParameter[] SqlParameterS = {
					new SqlParameter("@outRecordCount", SqlDbType.BigInt),
					new SqlParameter("@outPageSize", SqlDbType.BigInt),
					new SqlParameter("@outPageIndex", SqlDbType.BigInt),
                    new SqlParameter("@pageSize", SqlDbType.BigInt),
					new SqlParameter("@pageIndex", SqlDbType.BigInt),
					new SqlParameter("@searchField", SqlDbType.VarChar,5000),
					new SqlParameter("@afterFromBeforeOrderBySqlString", SqlDbType.VarChar,8000),
                    new SqlParameter("@orderByField", SqlDbType.VarChar,200)};
            SqlParameterS[0].Direction = ParameterDirection.Output;
            SqlParameterS[1].Direction = ParameterDirection.Output;
            SqlParameterS[2].Direction = ParameterDirection.Output;
            SqlParameterS[3].Value = pageParams.pageSize;
            SqlParameterS[4].Value = pageParams.pageIndex;
            SqlParameterS[5].Value = fwSqlPageProcedureParams.searchField.Trim();
            SqlParameterS[6].Value = fwSqlPageProcedureParams.afterFromBeforeOrderBySql;
            SqlParameterS[7].Value = fwSqlPageProcedureParams.orderByField;

            SqlCommand cmd = new SqlCommand()
            {
                CommandType = CommandType.StoredProcedure,
                CommandText = "fw_PageProcedure"
            };
            cmd.Parameters.AddRange(SqlParameterS);
            DataSet ds = FWSqlCommandStaticHelper.ExecuteDataSet(cmd);

            FWPageData<MMenuEx> EntityList = new FWPageData<MMenuEx>();
            if (ds != null && ds.Tables[0] != null)
            {
                EntityList.entityList = FWDataTableHelper.toObjectList<MMenuEx>(ds.Tables[0]);
            }
            EntityList.recordCount = string.IsNullOrEmpty(SqlParameterS[0].Value.ToString()) ? 0 : (Int64)Convert.ToInt32(SqlParameterS[0].Value.ToString());
            EntityList.pageSize = (Int64)Convert.ToInt32(SqlParameterS[1].Value.ToString());
            EntityList.pageIndex = (Int64)Convert.ToInt32(SqlParameterS[2].Value.ToString());
            #endregion
            result.data = EntityList;
            result.status = FWResultStatus.Success;
            return result;
        }

         //报表菜单
        public static FWResult<List<MMenuEx>> queryMenuListDynamicAccount(IFWUserInfo userInfo, List<string> keyWordList)
        {
            FWResult<List<MMenuEx>> result = new FWResult<List<MMenuEx>>();


            #region sql拼接
            StringBuilder sb = new StringBuilder();
            sb.Append(@"
            SELECT 
	        tb1.[menuTypeCode] [mMenuTypeCode]
	        ,tb3.[name] [mMenuTypeName]
	        ,tb1.[pMenuCode] [mPMenuCode]
	        ,tb1.[menuCode] [mMenuCode]
	        ,tb1.[menuName] [mMenuName]
	        ,tb1.[iconUrl] [mIconUrl]
	        ,tb1.[title] [mTitle]
	        ,tb1.[isHtmlPage] [mIsHtmlPage]
	        ,tb1.[url] [mUrl]
	        ,tb1.[urlParamsJson] [mUrlParamsJson]
	        ,tb1.[openTypeCode] [mOpenTypeCode]
	        ,tb5.[name] [mOpenTypeName]
	        ,tb1.[layoutWidth] [mLayoutWidth]
	        ,tb1.[layoutHeight] [mLayoutHeight]
	        ,tb1.[ix] [mIx]
	        ,tb1.[isDis] [mIsDis]
            ,tb2.pageID
            ,tb2.menuCode
            ,tb2.keyWords
            ,tb2.funDescription
            ,tb2.instructions
            ,tb2.questions
            ,tb2.attachmentName
            ,tb2.attachmentURL
            ,tb2.keysParamsJson
            ,tb2.keysReturnJson
            ,tb2.frequency
            ,tb2.isDelete
            ,tb2.showType
        FROM [dbo].[FWMenu] tb1
            LEFT  JOIN [dbo].[T_Sys_MenuExInfo] tb2 ON  tb1.[menuCode]=tb2.[menuCode]  --内联
	        left join [dbo].[FWDictionary] tb3 on tb3.[pCode]='FWMenuType' and tb1.[menuTypeCode]=tb3.[code]
	        left join [dbo].[FWDictionary] tb5 on tb5.[pCode]='FWOpenType' and tb1.[openTypeCode]=tb5.[code] 
            WHERE    tb1.menutypecode='mainMenu'  AND tb1.isDis=0 and  pMenuCode='57ffe776-b1a8-4c42-86c0-2ebf5bf0596b'");
            FWSqlCommand cmd = new FWSqlCommand();
            cmd.CommandText = sb.ToString();
            var pmenuList = FWSqlEntityToFWCommandStaticHelper.queryList<MMenuEx>(cmd);
            #endregion


            #region sql拼接
            StringBuilder sb_chid = new StringBuilder();
            sb_chid.Append(@"
            SELECT 
	        tb1.[menuTypeCode] [mMenuTypeCode]
	        ,tb3.[name] [mMenuTypeName]
	        ,tb1.[pMenuCode] [mPMenuCode]
	        ,tb1.[menuCode] [mMenuCode]
	        ,tb1.[menuName] [mMenuName]
	        ,tb1.[iconUrl] [mIconUrl]
	        ,tb1.[title] [mTitle]
	        ,tb1.[isHtmlPage] [mIsHtmlPage]
	        ,tb1.[url] [mUrl]
	        ,tb1.[urlParamsJson] [mUrlParamsJson]
	        ,tb1.[openTypeCode] [mOpenTypeCode]
	        ,tb5.[name] [mOpenTypeName]
	        ,tb1.[layoutWidth] [mLayoutWidth]
	        ,tb1.[layoutHeight] [mLayoutHeight]
	        ,tb1.[ix] [mIx]
	        ,tb1.[isDis] [mIsDis]
            ,tb2.pageID
            ,tb2.menuCode
            ,tb2.keyWords
            ,tb2.funDescription
            ,tb2.instructions
            ,tb2.questions
            ,tb2.attachmentName
            ,tb2.attachmentURL
            ,tb2.keysParamsJson
            ,tb2.keysReturnJson
            ,tb2.frequency
            ,tb2.isDelete
            ,tb2.showType
        FROM [dbo].[FWMenu] tb1
            LEFT  JOIN [dbo].[T_Sys_MenuExInfo] tb2 ON  tb1.[menuCode]=tb2.[menuCode]  --内联
	        left join [dbo].[FWDictionary] tb3 on tb3.[pCode]='FWMenuType' and tb1.[menuTypeCode]=tb3.[code]
	        left join [dbo].[FWDictionary] tb5 on tb5.[pCode]='FWOpenType' and tb1.[openTypeCode]=tb5.[code] 
            WHERE    tb1.menutypecode='mainMenu'  AND tb1.isDis=0 and  pMenuCode in 
  ('3b0aa24c-53a5-43c6-8657-8238d6d9cf58',
  '51dde0cf-8a3c-4bee-8783-cb0278f3fa58','7b095b76-2453-4354-abf4-b9dab84f45dd',
  '92a0b577-a496-4f69-9dc5-dc8b72462245','e5dc1f11-2270-486b-9e41-631f7042b61e',
  'f1817752-2a87-4643-9780-53504a72a019') ");
            if (keyWordList != null && keyWordList.Count > 0)
            {
                sb_chid.AppendFormat(" and   tb2.keyWords is not null   and ( ");
                for (int i = 0; i < keyWordList.Count; i++)
                {
                    sb_chid.AppendFormat(" tb2.keyWords like '%{0}%' ", keyWordList[i]);
                    if (i != keyWordList.Count - 1)
                    {
                        sb_chid.Append(" or ");
                    }
                }
                sb_chid.AppendFormat(" ) ");
            }
            FWSqlCommand cmdChildList = new FWSqlCommand();
            cmdChildList.CommandText = sb_chid.ToString();
            var menuChidList = FWSqlEntityToFWCommandStaticHelper.queryList<MMenuEx>(cmdChildList);
            #endregion
            List<MMenuEx> menuList = pmenuList.Concat(menuChidList).ToList();

            result.data = fwList.FWListHelper<MMenuEx>.toTree(menuList, "mPMenuCode", "mMenuCode", "mFWMenuExInfoList", "57ffe776-b1a8-4c42-86c0-2ebf5bf0596b");
            //result.data = 
            if (result.data != null)
            {
                result.status = FWResultStatus.Success;
            }
            return result;
        }


         //固废系统
        public static FWResult<List<MMenuEx>> queryMenuList4ThirdSys(IFWUserInfo userInfo, List<string> keyWordList)
        {
            FWResult<List<MMenuEx>> result = new FWResult<List<MMenuEx>>();


            #region sql拼接
            StringBuilder sb = new StringBuilder();
            sb.Append(@"
            SELECT 
	        tb1.[menuTypeCode] [mMenuTypeCode]
	        ,tb3.[name] [mMenuTypeName]
	        ,tb1.[pMenuCode] [mPMenuCode]
	        ,tb1.[menuCode] [mMenuCode]
	        ,tb1.[menuName] [mMenuName]
	        ,tb1.[iconUrl] [mIconUrl]
	        ,tb1.[title] [mTitle]
	        ,tb1.[isHtmlPage] [mIsHtmlPage]
	        ,tb1.[url] [mUrl]
	        ,tb1.[urlParamsJson] [mUrlParamsJson]
	        ,tb1.[openTypeCode] [mOpenTypeCode]
	        ,tb5.[name] [mOpenTypeName]
	        ,tb1.[layoutWidth] [mLayoutWidth]
	        ,tb1.[layoutHeight] [mLayoutHeight]
	        ,tb1.[ix] [mIx]
	        ,tb1.[isDis] [mIsDis]
            ,tb2.pageID
            ,tb2.menuCode
            ,tb2.keyWords
            ,tb2.funDescription
            ,tb2.instructions
            ,tb2.questions
            ,tb2.attachmentName
            ,tb2.attachmentURL
            ,tb2.keysParamsJson
            ,tb2.keysReturnJson
            ,tb2.frequency
            ,tb2.isDelete
            ,tb2.showType
        FROM [dbo].[FWMenu] tb1
            LEFT  JOIN [dbo].[T_Sys_MenuExInfo] tb2 ON  tb1.[menuCode]=tb2.[menuCode]  --内联
	        left join [dbo].[FWDictionary] tb3 on tb3.[pCode]='FWMenuType' and tb1.[menuTypeCode]=tb3.[code]
	        left join [dbo].[FWDictionary] tb5 on tb5.[pCode]='FWOpenType' and tb1.[openTypeCode]=tb5.[code] 
            WHERE    tb1.menutypecode='mainMenu'  AND tb1.isDis=0 and  pMenuCode='1adfd073-cdfe-4995-b1e6-c470e313c22d'");
            FWSqlCommand cmd = new FWSqlCommand();
            cmd.CommandText = sb.ToString();
            var pmenuList = FWSqlEntityToFWCommandStaticHelper.queryList<MMenuEx>(cmd);
            #endregion


            #region sql拼接
            StringBuilder sb_chid = new StringBuilder();
            sb_chid.Append(@"
            SELECT 
	        tb1.[menuTypeCode] [mMenuTypeCode]
	        ,tb3.[name] [mMenuTypeName]
	        ,tb1.[pMenuCode] [mPMenuCode]
	        ,tb1.[menuCode] [mMenuCode]
	        ,tb1.[menuName] [mMenuName]
	        ,tb1.[iconUrl] [mIconUrl]
	        ,tb1.[title] [mTitle]
	        ,tb1.[isHtmlPage] [mIsHtmlPage]
	        ,tb1.[url] [mUrl]
	        ,tb1.[urlParamsJson] [mUrlParamsJson]
	        ,tb1.[openTypeCode] [mOpenTypeCode]
	        ,tb5.[name] [mOpenTypeName]
	        ,tb1.[layoutWidth] [mLayoutWidth]
	        ,tb1.[layoutHeight] [mLayoutHeight]
	        ,tb1.[ix] [mIx]
	        ,tb1.[isDis] [mIsDis]
            ,tb2.pageID
            ,tb2.menuCode
            ,tb2.keyWords
            ,tb2.funDescription
            ,tb2.instructions
            ,tb2.questions
            ,tb2.attachmentName
            ,tb2.attachmentURL
            ,tb2.keysParamsJson
            ,tb2.keysReturnJson
            ,tb2.frequency
            ,tb2.isDelete
            ,tb2.showType
        FROM [dbo].[FWMenu] tb1
            LEFT  JOIN [dbo].[T_Sys_MenuExInfo] tb2 ON  tb1.[menuCode]=tb2.[menuCode]  --内联
	        left join [dbo].[FWDictionary] tb3 on tb3.[pCode]='FWMenuType' and tb1.[menuTypeCode]=tb3.[code]
	        left join [dbo].[FWDictionary] tb5 on tb5.[pCode]='FWOpenType' and tb1.[openTypeCode]=tb5.[code] 
            WHERE    tb1.menutypecode='mainMenu'  AND tb1.isDis=0 and  pMenuCode in 
  (
'9cae4dd4-4d88-4169-8ec6-9e3eaa3958ac',
'e775a621-6b11-4eb6-a060-1a4a6ca1800a',
'2b8cc0c8-0e35-4463-8803-9bf71fe3d6c4',
'c777d674-c988-44b1-b7af-33f782248878',
'5bf38072-be84-4417-9f76-3ea54b029393',
'e1c6c430-5743-42d4-82f2-68bc901946fd',
'567eaf8e-e0b6-4983-a7a0-b8cbf5ea9734',
'04f80a6f-62a0-4b65-8868-ea97f106452a',
'4e762793-dc10-4d22-aeb1-4e1815e05c4c'
) ");
            if (keyWordList != null && keyWordList.Count > 0)
            {
                sb_chid.AppendFormat(" and   tb2.keyWords is not null   and ( ");
                for (int i = 0; i < keyWordList.Count; i++)
                {
                    sb_chid.AppendFormat(" tb2.keyWords like '%{0}%' ", keyWordList[i]);
                    if (i != keyWordList.Count - 1)
                    {
                        sb_chid.Append(" or ");
                    }
                }
                sb_chid.AppendFormat(" ) ");
            }
            FWSqlCommand cmdChildList = new FWSqlCommand();
            cmdChildList.CommandText = sb_chid.ToString();
            var menuChidList = FWSqlEntityToFWCommandStaticHelper.queryList<MMenuEx>(cmdChildList);
            #endregion
            List<MMenuEx> menuList = pmenuList.Concat(menuChidList).ToList();

            result.data = fwList.FWListHelper<MMenuEx>.toTree(menuList, "mPMenuCode", "mMenuCode", "mFWMenuExInfoList", "1adfd073-cdfe-4995-b1e6-c470e313c22d");
            //result.data = 
            if (result.data != null)
            {
                result.status = FWResultStatus.Success;
            }
            return result;
        }
    }
}
