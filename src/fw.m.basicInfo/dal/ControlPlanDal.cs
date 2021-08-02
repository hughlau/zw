using fw.fwDal;
using fw.fwData;
using fw.m.basicInfo.data.entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.basicInfo.dal
{
    public class ControlPlanDal
    {
        public static BLLControlPlan query(string code)
        {
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@"SELECT  [code]
                  ,[name]
                  ,[createTime]
                  ,[createUserId]
                  ,[updateTime]
                  ,[updateUserId]
                  ,[detail]
                  ,[isDel]
              FROM [dbo].[BLLControlPlan]
            WHERE  isdel=0 and code='{0}'", code);
            sqlCmd.CommandText = sbSql.ToString();
            return FWSqlEntityToFWCommandStaticHelper.query<BLLControlPlan>(sqlCmd);
        }


        public static FWPageData<BLLControlPlan> queryPageData(string userId,string name, FWPageParams pageParams)
        {
            FWResult<FWPageData<BLLControlPlan>> result = new FWResult<FWPageData<BLLControlPlan>>();

            StringBuilder sqlbuilder = new StringBuilder();

            sqlbuilder.AppendFormat(@"
                SELECT  [code]
                  ,[name]
                  ,[createTime]
                  ,[createUserId]
                  ,[updateTime]
                  ,[updateUserId]
                  ,[detail]
                  ,[isDel]
              FROM [dbo].[BLLControlPlan]
              WHERE [isDel]=0");
            if (!string.IsNullOrEmpty(name))
            {
                sqlbuilder.AppendFormat(" and name like '%{0}%'", FWSqlCommandStaticHelper.checkParam(name));
            }
            sqlbuilder.Append(@" order by createTime desc");

            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            return FWSqlEntityToFWCommandStaticHelper.queryPage<BLLControlPlan>(fwPageProcedureParams);
        }

        public static int deleteList(List<BLLControlPlan> entity,FWSqlTransaction fWSqlTransaction)
        {
            string ids = "";
            if (entity.Count > 0)
            {
                for (int i = 0; i < entity.Count; i++)
                {
                    var item = entity[i];
                    ids += "'"+item.code + "',";
                }
                StringBuilder sbSql = new StringBuilder();
                ids = ids.TrimEnd(',');
                sbSql.AppendFormat(@" update BLLControlPlan set isDel=1 where code in({0});",
                           ids);
                FWSqlCommand cmd = new FWSqlCommand();
                cmd.CommandText = sbSql.ToString();
                return FWSqlCommandStaticHelper.ExecuteNonQuery(fWSqlTransaction,cmd);
            }
            return 0;
        }

        public static int insert(BLLControlPlan entity)
        {
            IFWCommand cmd = FWSqlEntityToFWCommandStaticHelper.insert<BLLControlPlan>(entity);
            return FWSqlCommandStaticHelper.ExecuteNonQuery(cmd);
        }

        public static int insert(BLLControlPlan entity,FWSqlTransaction fWSqlTransaction)
        {
            IFWCommand cmd = FWSqlEntityToFWCommandStaticHelper.insert<BLLControlPlan>(entity);
            return FWSqlCommandStaticHelper.ExecuteNonQuery(fWSqlTransaction,cmd);
        }

        public static int update(BLLControlPlan entity)
        {
            IFWCommand cmd = FWSqlEntityToFWCommandStaticHelper.update<BLLControlPlan>(entity, "code='"+ entity.code + "'",null);
            return FWSqlCommandStaticHelper.ExecuteNonQuery(cmd);
        }
    }
}
