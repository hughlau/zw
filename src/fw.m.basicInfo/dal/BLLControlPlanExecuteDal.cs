using fw.fwDal;
using fw.fwData;
using fw.m.basicInfo.data.entity;
using fw.m.basicInfo.data.model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.basicInfo.dal
{
    public class BLLControlPlanExecuteDal
    {
        public static int deleteList(List<MBLLControlPlanExecute> entity)
        {
            string ids = "";
            if (entity.Count > 0)
            {
                for (int i = 0; i < entity.Count; i++)
                {
                    var item = entity[i];
                    ids += "'" + item.code + "',";
                }
                StringBuilder sbSql = new StringBuilder();
                ids = ids.TrimEnd(',');
                sbSql.AppendFormat(@" update BLLControlPlanExecute set isDel=1 where code in({0}); 
                                delete from FWTimingTask where timingTaskName in ({0});", ids);
                FWSqlCommand cmd = new FWSqlCommand();
                cmd.CommandText = sbSql.ToString();
                return FWSqlCommandStaticHelper.ExecuteNonQuery(cmd);
            }
            return 0;
        }

        public static int insert(BLLControlPlanExecute entity)
        {
            IFWCommand cmd = FWSqlEntityToFWCommandStaticHelper.insert<BLLControlPlanExecute>(entity);
            return FWSqlCommandStaticHelper.ExecuteNonQuery(cmd);
        }

        public static int insert(BLLControlPlanExecute entity, FWSqlTransaction fWSqlTransaction)
        {
            IFWCommand cmd = FWSqlEntityToFWCommandStaticHelper.insert<BLLControlPlanExecute>(entity);
            return FWSqlCommandStaticHelper.ExecuteNonQuery(fWSqlTransaction, cmd);
        }

        public static int update(BLLControlPlanExecute entity)
        {
            IFWCommand cmd = FWSqlEntityToFWCommandStaticHelper.update<BLLControlPlanExecute>(entity, "code='" + entity.code + "'", null);
            return FWSqlCommandStaticHelper.ExecuteNonQuery(cmd);
        }

        public static BLLControlPlanExecute query(string code)
        {
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@"SELECT  code
                  ,[detail]
                  ,[planDetailCode]
                  ,[executeTime]
                  ,[isExecute]
                  ,[createUserId]
                  ,[createTime]
                  ,[isDel]
              FROM [dbo].[BLLControlPlanExecute]
            WHERE  isdel=0 and code='{0}'", code);
            sqlCmd.CommandText = sbSql.ToString();
            return FWSqlEntityToFWCommandStaticHelper.query<BLLControlPlanExecute>(sqlCmd);
        }


        public static FWPageData<MBLLControlPlanExecute> queryPageData(string userId,string isExecute ,FWPageParams pageParams)
        {
            FWResult<FWPageData<MBLLControlPlanExecute>> result = new FWResult<FWPageData<MBLLControlPlanExecute>>();

            StringBuilder sqlbuilder = new StringBuilder();

            sqlbuilder.AppendFormat(@"
                SELECT  a.code
                  ,a.[detail]
                  ,a.[planDetailCode]
                  ,a.[executeTime]
                  ,a.[isExecute]
                  ,a.[createUserId]
                  ,a.[createTime]
                  ,a.[isDel]
                  ,c.name as planDetailName
                FROM [dbo].[BLLControlPlanExecute] a
                INNER JOIN dbo.BLLControlPlanDetail b
                ON a.planDetailCode=b.code
                      INNER JOIN dbo.BLLControlPlan c
                      ON b.planCode=c.code
                WHERE a.[isDel]=0 and isExecute={0}",isExecute);

            sqlbuilder.Append(@" order by a.createTime desc");

            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            return FWSqlEntityToFWCommandStaticHelper.queryPage<MBLLControlPlanExecute>(fwPageProcedureParams);
        }
    }
}
