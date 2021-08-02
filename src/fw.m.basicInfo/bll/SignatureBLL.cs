using fw.fwDal;
using fw.fwData;
using fw.m.basicInfo.dal;
using fw.m.basicInfo.data;
using fw.m.basicInfo.data.entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.basicInfo.bll
{
    public class SignatureBLL
    {
        public static FWResult<FWPageData<BLLSignature>> queryPage(FWPageParams pageParams, QuerySignatureParams queryParams)
        {
            FWResult<FWPageData<BLLSignature>> result = new FWResult<FWPageData<BLLSignature>>();
            try
            {
                result.data = SignatureDal.queryPage(pageParams, queryParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询签名错误");
            }
            return result;
        }

        public static BLLSignature querySignature(int id)
        {
            return SignatureDal.GetSignature(" id="+id);
        }

        public static List<BLLSignature> querySignatures(string userId)
        {
            return SignatureDal.GetSignatures(userId);
        }

        public static bool add(BLLSignature entity)
        {
            return SignatureDal.insert(entity);
        }

        public static BLLSignature getDefault(string userId)
        {
            return SignatureDal.GetSignature("userId='"+userId+"' and isDefault=1 ");
        }

        public static bool setDefault(string userId,BLLSignature entity)
        {
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            List<IFWCommand> BaseCommandList = new List<IFWCommand>();
            try
            {
                fwSqlTransaction.BeginTransaction();
                StringBuilder sbSql = new StringBuilder();
                FWSqlCommand sqlCmd = new FWSqlCommand();
                sbSql.AppendFormat(@"update BLLSignature set isDefault=0 WHERE  userId='{0}';
                  update BLLSignature set isDefault=1  WHERE  id={1}", userId, entity.id);
                sqlCmd.CommandText = sbSql.ToString();
                BaseCommandList.Add(sqlCmd);
                FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, BaseCommandList);
                fwSqlTransaction.Commit();
                return true;
            }
            catch (Exception)
            {
                fwSqlTransaction.Rollback();
                return false;
            }
           
        }

        public static bool delete(List<BLLSignature> entitys)
        {
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            List<IFWCommand> BaseCommandList = new List<IFWCommand>();
            for (int i = 0; i < entitys.Count; i++)
            {
                BaseCommandList.Add(SignatureDal.delete(entitys[i].id));
            }
            try
            {
                fwSqlTransaction.BeginTransaction();
                FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, BaseCommandList);
                fwSqlTransaction.Commit();
                return true;
            }
            catch (Exception ex)
            {
                fwSqlTransaction.Rollback();
                return false;
            }
        }
    }
}
