using fw.fwDal;
using fw.fwData;
using fw.m.basicInfo.data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.basicInfo.dal
{
    public class BLLFeedbackDal
    {
        public static int insert(BLLFeedback entity)
        {
            IFWCommand cmd= FWSqlEntityToFWCommandStaticHelper.insert<BLLFeedback>(entity);
            return FWSqlCommandStaticHelper.ExecuteNonQuery(cmd);
        }

        public static FWPageData<BLLFeedback> queryPageData(string userId, FWPageParams pageParams)
        {
            FWResult<FWPageData<BLLFeedback>> result = new FWResult<FWPageData<BLLFeedback>>();

            StringBuilder sqlbuilder = new StringBuilder();

            sqlbuilder.AppendFormat(@"
                SELECT  
	              [id]
                  ,[maintainer]
                  ,[detail]
                  ,[createTime]
                  ,[createUser]
                  ,[isDel]
                FROM [dbo].[BLLFeedback] where isDel=0");
            sqlbuilder.Append(@" order by createTime desc");

            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            return FWSqlEntityToFWCommandStaticHelper.queryPage<BLLFeedback>(fwPageProcedureParams);
        }

        public static int delete(BLLFeedback entity)
        {
            List<IFWParameter> fwParameterList = new List<IFWParameter>() {
                        new FWParameter("id", entity.id)
                    };
            IFWCommand cmd = FWSqlEntityToFWCommandStaticHelper.delete<BLLFeedback>(" id=@id"
                , fwParameterList);
            return FWSqlCommandStaticHelper.ExecuteNonQuery(cmd);
        }

        public static int deleteList(List<BLLFeedback> entity)
        {
            string ids = "";
            if (entity.Count>0)
            {
                for (int i = 0; i < entity.Count; i++)
                {
                    var item = entity[i];
                    ids += item.id + ",";
                }
                StringBuilder sbSql = new StringBuilder();
                ids =ids.TrimEnd(',');
                sbSql.AppendFormat(@" update BLLFeedback set isDel=1 where id in({0})",
                           FWSqlCommandStaticHelper.checkParam(ids));
                FWSqlCommand cmd = new FWSqlCommand();
                cmd.CommandText = sbSql.ToString();
                return FWSqlCommandStaticHelper.ExecuteNonQuery(cmd);
            }
            return 0;
        }
    }
}
