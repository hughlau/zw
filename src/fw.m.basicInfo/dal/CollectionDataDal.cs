using fw.fwDal;
using fw.fwData;
using fw.m.basicInfo.data;
using fw.m.basicInfo.data.entity;
using fw.m.basicInfo.data.model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.basicInfo.dal
{
    public class CollectionDataDal
    {
        public static FWPageData<MBLLCollectionData> queryPageData(string userId,FWPageParams pageParams
            , QueryCollectionDataParams queryParams)
        {
            FWResult<FWPageData<MBLLCollectionData>> result = new FWResult<FWPageData<MBLLCollectionData>>();

            StringBuilder sqlbuilder = new StringBuilder();
            sqlbuilder.AppendFormat(@"
            SELECT a.[dataId]
                  ,a.[cateCode]
                  ,b.cateName
                  ,a.[monitorSiteCode]
                  ,c.monitorSiteName
                  ,a.[createTime]
              FROM [jjwstest].[dbo].[BLLCollectionData] a
              INNER JOIN BLLCollectionCategory b
              ON a.cateCode=b.cateCode
              INNER JOIN dbo.BLLMonitorSite c
              ON a.monitorSiteCode=c.monitorSiteCode ");
            sqlbuilder.AppendFormat(@" WHERE ISNULL(a.isDel,0)=0 ");
            sqlbuilder.Append(" and a.userId='" + FWSqlCommandStaticHelper.checkParam(userId) + "' ");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.monitorSiteName))
                {
                    sqlbuilder.Append(" and c.monitorSiteName='" + FWSqlCommandStaticHelper.checkParam(queryParams.monitorSiteName) + "' ");
                }
                if (!string.IsNullOrEmpty(queryParams.cateCode))
                {
                    sqlbuilder.Append(" and a.cateCode='" + FWSqlCommandStaticHelper.checkParam(queryParams.cateCode) + "' ");
                }
            }
            sqlbuilder.Append(@" order by a.createTime desc");

            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            return FWSqlEntityToFWCommandStaticHelper.queryPage<MBLLCollectionData>(fwPageProcedureParams);
        }

        public static bool insert(BLLCollectionData entity)
        {
            try
            {
                IFWCommand cmd = FWSqlEntityToFWCommandStaticHelper.insert<BLLCollectionData>(entity);
                FWSqlCommandStaticHelper.ExecuteNonQuery(cmd);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        /// <summary>
        /// 是否在分类中
        /// </summary>
        /// <param name="cateCode"></param>
        /// <param name="monitorSiteCode"></param>
        /// <returns></returns>
        public static bool isExistInCate(string cateCode,string monitorSiteCode)
        {
            string sql =
                @"SELECT [id]
                  ,[dataId]
                  ,[cateCode]
                  ,[monitorSiteCode]
                  ,[userId]
                  ,[isDel]
                  ,[createTime] FROM [dbo].[BLLCollectionData] WITH(NOLOCK)";
            sql += " where monitorSiteCode=@monitorSiteCode and cateCode=@cateCode and isDel=0";
            FWSqlCommand sqlCmd = new FWSqlCommand { CommandText = sql };
            sqlCmd.Parameters.AddWithValue("@monitorSiteCode", monitorSiteCode);
            sqlCmd.Parameters.AddWithValue("@cateCode", cateCode);

            try
            {
                var result = FWSqlEntityToFWCommandStaticHelper.queryList<BLLCollectionData>(sqlCmd);
                if (result != null && result.Count > 0)
                {
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
