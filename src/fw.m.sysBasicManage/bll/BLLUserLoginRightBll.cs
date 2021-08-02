using fw.fwDal;
using fw.fwData;
using fw.m.basicInfo.dal;
using fw.m.basicInfo.data.entity;
using fw.m.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.basicInfo.bll
{
    public class BLLUserLoginRightBll
    {
        /// <summary>
        /// 查询用户的登录权限
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public static BLLUserLoginRight query(string userId)
        {
            return BLLUserLoginRightDal.query(userId);
        }


        public static BLLUserLoginRight queryByMK(string code)
        {
            return BLLUserLoginRightDal.queryByMK(code);
        }


        public static int insert(BLLUserLoginRight entity, IFWTransaction fWSqlTransaction)
        {
            return BLLUserLoginRightDal.insert(entity, fWSqlTransaction);
        }

        public static void insertOrUpdate(string userId,BLLUserLoginRight entity, IFWTransaction fWSqlTransaction)
        {
            BLLUserLoginRight right= BLLUserLoginRightDal.query(entity.userId);
            if (null!=right && !string.IsNullOrEmpty(right.code))
            {
                BLLUserLoginRight bLLUserLoginRight = queryByMK(right.code);
                bLLUserLoginRight.updateTime = DateTime.Now;
                bLLUserLoginRight.updateUserId = userId;
                bLLUserLoginRight.loginRight = entity.loginRight;
                BLLUserLoginRightDal.update(bLLUserLoginRight);
            }
            else
            {
                entity.code = Guid.NewGuid().ToString();
                insert(entity, fWSqlTransaction);
            }
        }



        public static FWResult<bool> checkUserLogin(string userId,float lon, float lat)
        {
            FWResult<bool> result = new FWResult<bool>();
            bool back = false;
            try
            {
                BLLUserLoginRight right = query(userId);
                if (right==null)
                {
                    right = new BLLUserLoginRight();
                    right.loginRight = 1;
                }
                if (right.loginRight == 1)
                {
                    back=ThirdServiceHelper.checkLoginCity(lon, lat);
                }
                else if(right.loginRight==2)
                {
                    if (right.LoginLon==null || right.LoginLat==null || right.LoginTime==null)
                    {
                        back = true;
                    }
                    else
                    {
                        back = BusinessHelper.checkLoginDistance(right.LoginLon ?? 0, right.LoginLat ?? 0, (DateTime)right.LoginTime, lon, lat);
                    }
                }
                result.status = FWResultStatus.Success;
                result.data = back;
            }
            catch (Exception)
            {
                result.status = FWResultStatus.Failure;
                result.data = false;
            }
            return result;
        }
    }
}
