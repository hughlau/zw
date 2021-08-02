using fw.fwData;
using fw.m.basicInfo.dal;
using fw.m.basicInfo.data.entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.basicInfo.bll
{
    public class BLLReleaseNoteBll
    {
        public static FWResult<List<BLLReleaseNote>> queryAll(string type)
        {
            FWResult<List<BLLReleaseNote>> result = new FWResult<List<BLLReleaseNote>>();
            try
            {
                result.data = BLLReleaseNoteDal.queryAll(type);
                result.status = FWResultStatus.Success;
            }
            catch (Exception)
            {
                result.infoList.Add("获取数据失败");
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        public static FWResult<FWPageData<BLLReleaseNote>> queryPageData(string userId, FWPageParams pageParams)
        {
            FWResult<FWPageData<BLLReleaseNote>> result = new FWResult<FWPageData<BLLReleaseNote>>();
            try
            {
                result.data = BLLReleaseNoteDal.queryPageData(userId, pageParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception)
            {
                result.infoList.Add("获取数据失败");
                result.status = FWResultStatus.Failure;
            }
            return result;
        }
    }
}
