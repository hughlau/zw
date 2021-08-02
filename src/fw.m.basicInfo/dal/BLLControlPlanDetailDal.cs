using fw.fwDal;
using fw.m.basicInfo.data.entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.basicInfo.dal
{
    public class BLLControlPlanDetailDal
    {
        public static BLLControlPlanDetail query(string code)
        {
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@"SELECT  [code]
                  ,[planCode]
                  ,[monitorType]
                  ,[monitorTypeContent]
                  ,[equipmentType]
                  ,[controlCommand]
                  ,[executeType]
                  ,[executeDelayHour]
                  ,[executeDelayMin]
                  ,[executeDelaySec]
                  ,[executeTime]
                  ,[createTime]
                  ,[createUserId]
                  ,[updateTime]
                  ,[updateUserId]
                  ,[isDel]
              FROM [dbo].[BLLControlPlanDetail]
            WHERE  isdel=0 and code='{0}'", code);
            sqlCmd.CommandText = sbSql.ToString();
            return FWSqlEntityToFWCommandStaticHelper.query<BLLControlPlanDetail>(sqlCmd);
        }

        public static BLLControlPlanDetail queryByPlanCode(string code)
        {
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@"SELECT  [code]
                  ,[planCode]
                  ,[monitorType]
                  ,[monitorTypeContent]
                  ,[equipmentType]
                  ,[controlCommand]
                  ,[executeType]
                  ,[executeDelayHour]
                  ,[executeDelayMin]
                  ,[executeDelaySec]
                  ,[executeTime]
                  ,[createTime]
                  ,[createUserId]
                  ,[updateTime]
                  ,[updateUserId]
                  ,[isDel]
              FROM [dbo].[BLLControlPlanDetail]
            WHERE  isdel=0 and planCode='{0}'", code);
            sqlCmd.CommandText = sbSql.ToString();
            return FWSqlEntityToFWCommandStaticHelper.query<BLLControlPlanDetail>(sqlCmd);
        }


        public static int deleteList(List<BLLControlPlanDetail> entity)
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
                sbSql.AppendFormat(@" update BLLControlPlanDetail set isDel=1 where code in({0})",ids);
                FWSqlCommand cmd = new FWSqlCommand();
                cmd.CommandText = sbSql.ToString();
                return FWSqlCommandStaticHelper.ExecuteNonQuery(cmd);
            }
            return 0;
        }

        public static int deleteByPlanCodes(string[] planCodes,FWSqlTransaction fWSqlTransaction)
        {
            string ids = "";
            if (planCodes.Length > 0)
            {
                for (int i = 0; i < planCodes.Length; i++)
                {
                    var item = planCodes[i];
                    ids += "'" + item + "',";
                }
                StringBuilder sbSql = new StringBuilder();
                ids = ids.TrimEnd(',');
                sbSql.AppendFormat(@" update BLLControlPlanDetail set isDel=1 where planCode in({0})", ids);
                FWSqlCommand cmd = new FWSqlCommand();
                cmd.CommandText = sbSql.ToString();
                return FWSqlCommandStaticHelper.ExecuteNonQuery(fWSqlTransaction,cmd);
            }
            return 0;
        }

        public static int insert(BLLControlPlanDetail entity)
        {
            IFWCommand cmd = FWSqlEntityToFWCommandStaticHelper.insert<BLLControlPlanDetail>(entity);
            return FWSqlCommandStaticHelper.ExecuteNonQuery(cmd);
        }

        public static int insert(BLLControlPlanDetail entity,FWSqlTransaction fWSqlTransaction)
        {
            IFWCommand cmd = FWSqlEntityToFWCommandStaticHelper.insert<BLLControlPlanDetail>(entity);
            return FWSqlCommandStaticHelper.ExecuteNonQuery(fWSqlTransaction,cmd);
        }

        public static int update(BLLControlPlanDetail entity)
        {
            IFWCommand cmd = FWSqlEntityToFWCommandStaticHelper.update<BLLControlPlanDetail>(entity, "code='"+entity.code+"'", null);
            return FWSqlCommandStaticHelper.ExecuteNonQuery(cmd);
        }
    }
}
