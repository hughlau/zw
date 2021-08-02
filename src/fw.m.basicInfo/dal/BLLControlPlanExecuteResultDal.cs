using fw.fwDal;
using fw.m.basicInfo.data.entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.basicInfo.dal
{
    public class BLLControlPlanExecuteResultDal
    {
        public static int insert(BLLControlPlanExecuteResult entity)
        {
            IFWCommand cmd = FWSqlEntityToFWCommandStaticHelper.insert<BLLControlPlanExecuteResult>(entity);
            return FWSqlCommandStaticHelper.ExecuteNonQuery(cmd);
        }

        public static int insert(BLLControlPlanExecuteResult entity, FWSqlTransaction fWSqlTransaction)
        {
            IFWCommand cmd = FWSqlEntityToFWCommandStaticHelper.insert<BLLControlPlanExecuteResult>(entity);
            return FWSqlCommandStaticHelper.ExecuteNonQuery(fWSqlTransaction, cmd);
        }

        public static BLLControlPlanExecuteResult query(string code)
        {
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@"SELECT  [code]
              ,[executeCode]
              ,[executeParams]
              ,[result]
              ,[createTime]
              FROM [dbo].[BLLControlPlanExecuteResult]
            WHERE  code='{0}'", code);
            sqlCmd.CommandText = sbSql.ToString();
            return FWSqlEntityToFWCommandStaticHelper.query<BLLControlPlanExecuteResult>(sqlCmd);
        }
    }
}
