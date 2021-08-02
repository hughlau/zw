using fw.fwDal;
using fw.fwData;
using fw.m.basicInfo.data.entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.basicInfo.dal
{
    public static class CollectionCategoryDal
    {
        public static FWPageData<BLLCollectionCategory> queryPageData(string userId, FWPageParams pageParams)
        {
            FWResult<FWPageData<BLLCollectionCategory>> result = new FWResult<FWPageData<BLLCollectionCategory>>();

            StringBuilder sqlbuilder = new StringBuilder();

            sqlbuilder.AppendFormat(@"
            SELECT [id]
                  ,[cateCode]
                  ,[cateName]
                  ,[userId]
                  ,[description]
                  ,[isDel]
                  ,[createTime]
              FROM BLLCollectionCategory ");
            sqlbuilder.AppendFormat(@" WHERE ISNULL(isDel,0)=0 and userId='{0}'"
            , FWSqlCommandStaticHelper.checkParam(userId));

            sqlbuilder.Append(@" order by createTime desc");

            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            return FWSqlEntityToFWCommandStaticHelper.queryPage<BLLCollectionCategory>(fwPageProcedureParams);
        }

        public static bool insert(BLLCollectionCategory entity) {
            try
            {
                IFWCommand cmd = FWSqlEntityToFWCommandStaticHelper.insert<BLLCollectionCategory>(entity);
                FWSqlCommandStaticHelper.ExecuteNonQuery(cmd);
                return true;
            }
            catch (Exception ex)
            {

                return false;
            }
        }

        public static IFWCommand updateByDictionaryTypeCode(BLLCollectionCategory entity)
        {
            List<IFWParameter> afterWhereSqlParams = new List<IFWParameter> {
                new FWParameter("@cateCode", entity.cateCode)
            };
            return FWSqlEntityToFWCommandStaticHelper.update<BLLCollectionCategory>(entity, "cateCode=@cateCode", afterWhereSqlParams);
        }

    }
}
