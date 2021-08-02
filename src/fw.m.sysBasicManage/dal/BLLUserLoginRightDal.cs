using fw.fwDal;
using fw.m.basicInfo.data.entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.basicInfo.dal
{
    public class BLLUserLoginRightDal
    {
        public static BLLUserLoginRight query(string userId)
        {
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@"SELECT  [code]
                  ,[userId]
                  ,[loginRight]
                  ,[LoginTime]
                  ,[LoginLon]
                  ,[LoginLat]
                  ,[createUserId]
                  ,[createTime]
              FROM [dbo].[BLLUserLoginRight]
            WHERE  userId='{0}'", userId);
            sqlCmd.CommandText = sbSql.ToString();
            return FWSqlEntityToFWCommandStaticHelper.query<BLLUserLoginRight>(sqlCmd);
        }

        public static BLLUserLoginRight queryByMK(string code)
        {
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@"SELECT  [code]
                  ,[userId]
                  ,[loginRight]
                  ,[LoginTime]
                  ,[LoginLon]
                  ,[LoginLat]
                  ,[createUserId]
                  ,[createTime]
              FROM [dbo].[BLLUserLoginRight]
            WHERE  code='{0}'", code);
            sqlCmd.CommandText = sbSql.ToString();
            return FWSqlEntityToFWCommandStaticHelper.query<BLLUserLoginRight>(sqlCmd);
        }

        public static int insert(BLLUserLoginRight entity, IFWTransaction fWSqlTransaction)
        {
            IFWCommand cmd = FWSqlEntityToFWCommandStaticHelper.insert<BLLUserLoginRight>(entity);
            return FWSqlCommandStaticHelper.ExecuteNonQuery(fWSqlTransaction, cmd);
        }

        public static int update(BLLUserLoginRight entity)
        {
            IFWCommand cmd = FWSqlEntityToFWCommandStaticHelper.update<BLLUserLoginRight>(entity, "code='" + entity.code + "'", null);
            return FWSqlCommandStaticHelper.ExecuteNonQuery(cmd);
        }
    }
}
