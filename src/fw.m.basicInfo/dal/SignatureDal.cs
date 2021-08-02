using fw.fwDal;
using fw.fwData;
using fw.m.basicInfo.data;
using fw.m.basicInfo.data.entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.basicInfo.dal
{
    public class SignatureDal
    {
        public static BLLSignature GetSignature(string where)
        {
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.Append(@"SELECT  [id]
              ,[userId]
              ,[title]
              ,[imgName]
              ,[isDefault]
              ,[createTime]
                FROM [dbo].[BLLSignature]
            WHERE  "+where);
            sqlCmd.CommandText = sbSql.ToString();
            return FWSqlEntityToFWCommandStaticHelper.query<BLLSignature>(sqlCmd);

        }

        public static List<BLLSignature> GetSignatures(string userId)
        {
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@"SELECT  
              [title]
              ,[imgName] FROM [dbo].[BLLSignature]
            WHERE  userId='{0}'", userId);
            sqlCmd.CommandText = sbSql.ToString();
            return FWSqlEntityToFWCommandStaticHelper.queryList<BLLSignature>(sqlCmd);

        }

        public static bool insert(BLLSignature entity)
        {
            List<IFWCommand> BaseCommandList = new List<IFWCommand>();
            IFWCommand cmd= FWSqlEntityToFWCommandStaticHelper.insert<BLLSignature>(entity);
            BaseCommandList.Add(cmd);
            return  FWSqlCommandStaticHelper.ExecuteNonQuery(BaseCommandList);
        }

        public static bool update(BLLSignature entity)
        {
            List<IFWCommand> BaseCommandList = new List<IFWCommand>();
            IFWCommand cmd = FWSqlEntityToFWCommandStaticHelper.update<BLLSignature>(entity," id="+entity.id,null);
            BaseCommandList.Add(cmd);
            return FWSqlCommandStaticHelper.ExecuteNonQuery(BaseCommandList);
        }

        public static IFWCommand delete(int id)
        {
            return FWSqlEntityToFWCommandStaticHelper.delete("BLLSignature", " id="+ id,null );
        }

        public static FWPageData<BLLSignature> queryPage(FWPageParams pageParams, QuerySignatureParams queryParams)
        {
            FWResult<FWPageData<BLLSignature>> result = new FWResult<FWPageData<BLLSignature>>();

            StringBuilder sqlbuilder = new StringBuilder();
            sqlbuilder.Append(@"select * from BLLSignature where 1=1 ");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.userId))
                {
                    sqlbuilder.Append(@" AND userId='"+ queryParams.userId + "' ");
                }
                if (!string.IsNullOrEmpty(queryParams.title))
                {
                    sqlbuilder.Append(@" AND title like '%" + queryParams.title + "%' ");
                }
            }
            string af = sqlbuilder.ToString()+" order by createTime desc";
            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = af;
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;

            return FWSqlEntityToFWCommandStaticHelper.queryPage<BLLSignature>(fwPageProcedureParams);

        }
    }
}
