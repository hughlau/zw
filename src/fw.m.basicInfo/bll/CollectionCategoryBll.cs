using fw.fwDal;
using fw.fwData;
using fw.fwSession;
using fw.m.basicInfo.dal;
using fw.m.basicInfo.data.entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.basicInfo.bll
{
    public class CollectionCategoryBll
    {
        public static FWResult<FWPageData<BLLCollectionCategory>> queryPageData(string userId, FWPageParams pageParams)
        {

            var result = new FWResult<FWPageData<BLLCollectionCategory>>();
            try
            {
                result.data = CollectionCategoryDal.queryPageData(userId, pageParams);
                result.status = FWResultStatus.Success;
            }

            catch (Exception ex)
            {
                result.infoList.Add("获取数据出错。" + ex.Message);
            }
            return result;
        }

        public static FWResult<bool> insertOrUpdateByCateCode(IFWUserInfo userInfo, BLLCollectionCategory entity)
        {
            FWResult<bool> result = new FWResult<bool>();
            if (entity != null)
            {
                if (string.IsNullOrEmpty(entity.cateCode))
                {
                    entity.userId = userInfo.userID;
                    entity.cateCode = Guid.NewGuid().ToString();
                }
            }
            result.data = CollectionCategoryDal.insert(entity);
            result.status = FWResultStatus.Success;
            return result;
        }


        public static FWResult<bool> delete(IFWUserInfo userInfo, List<BLLCollectionCategory> entityList)
        {
            FWResult<bool> result = new FWResult<bool>();
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            List<IFWCommand> fWCommands = new List<IFWCommand>();
            fwSqlTransaction.BeginTransaction();
            try
            {
                foreach (var entity in entityList)
                {
                    List<IFWParameter> fwParameterList = new List<IFWParameter>() {
                        new FWParameter("cateCode", entity.cateCode)
                    };
                    IFWCommand cmd = FWSqlEntityToFWCommandStaticHelper.delete<BLLCollectionCategory>(" cateCode=@cateCode"
                        , fwParameterList);
                    fWCommands.Add(cmd);

                    IFWCommand cmddata = FWSqlEntityToFWCommandStaticHelper.delete<BLLCollectionData>(" cateCode=@cateCode"
                        , fwParameterList);
                    fWCommands.Add(cmddata);
                }
                FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, fWCommands);
                fwSqlTransaction.Commit();
                result.data = true;
                result.status = FWResultStatus.Success;
            }
            catch (Exception)
            {
                fwSqlTransaction.Rollback();
                result.status = FWResultStatus.Failure;
            }

            return result;
        }

    }
}
