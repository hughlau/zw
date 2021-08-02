using fw.fwData;
using fw.fwSession;
using fw.m.basicInfo.dal;
using fw.m.basicInfo.data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.basicInfo.bll
{
    public class BLLFeedbackBll
    {
        public static FWResult<bool> insert(IFWUserInfo userInfo, BLLFeedback entity) {
            FWResult<bool> result = new FWResult<bool>();
            try
            {
                entity.createTime = DateTime.Now;
                entity.isDel = 0;
                entity.createUser = userInfo.userID;
                result.data = BLLFeedbackDal.insert(entity)>0?true:false;
                result.status = result.data?FWResultStatus.Success:FWResultStatus.Failure;
            }
            catch (Exception)
            {
                result.infoList.Add("新增失败");
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        public static FWResult<FWPageData<BLLFeedback>> queryPageData(string userId, FWPageParams pageParams)
        {
            FWResult<FWPageData<BLLFeedback>> result = new FWResult<FWPageData<BLLFeedback>>();
            try
            {
                result.data = BLLFeedbackDal.queryPageData(userId, pageParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception)
            {
                result.infoList.Add("查询失败");
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        public static FWResult<bool> delete(BLLFeedback entity)
        {
            FWResult<bool> result = new FWResult<bool>();
            try
            {
                result.data = BLLFeedbackDal.delete(entity) > 0 ? true : false;
                result.status = result.data ? FWResultStatus.Success : FWResultStatus.Failure;
            }
            catch (Exception)
            {
                result.infoList.Add("删除失败");
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        public static FWResult<bool> deleteList(List<BLLFeedback> entity)
        {
            FWResult<bool> result = new FWResult<bool>();
            try
            {
                result.data = BLLFeedbackDal.deleteList(entity) > 0 ? true : false;
                result.status = result.data ? FWResultStatus.Success : FWResultStatus.Failure;
            }
            catch (Exception)
            {
                result.infoList.Add("删除失败");
                result.status = FWResultStatus.Failure;
            }
            return result;
        }
    }
}
