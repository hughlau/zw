using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;
using fw.fwDal;
using fw.fwSafe;
using fw.fwList;
using fw.fwConfig;
using fw.m.sysBasicManage.data.entity;


namespace fw.m.sysBasicManage.dal
{
    public class FWUserInfoDal
    {

        public static void defaultEntity(FWUserInfo entity)
        {
            if (entity != null)
            {
                if (string.IsNullOrEmpty(entity.userID))
                {
                    //entity.userID = Guid.NewGuid().ToString();
                    //if (string.IsNullOrEmpty(entity.password))
                    //{
                    //    entity.password = defaultPassword;
                    //}
                    //entity.isDis = entity.isDis;
                }
            }
        }

        public static IFWDBResult insertOrUpdateByUserID(FWUserInfo entity, IFWTransaction transaction)
        {
            defaultEntity(entity);
            if (transaction != null)
            {
                return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<FWUserInfo>(transaction, entity, new List<string>() { "userID" });
            }
            else
            {
                return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<FWUserInfo>(entity, new List<string>() { "userID" });
            }
        }

        public static List<IFWDBResult> insertOrUpdateByUserID(List<FWUserInfo> entityList)
        {
            if (entityList != null && entityList.Count > 0)
            {
                foreach (FWUserInfo entity in entityList)
                {
                    defaultEntity(entity);
                }
            }
            return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<FWUserInfo>(entityList, new List<string>() { "userID" }, new List<string>() { "userName" });
        }

        public static List<IFWCommand> updateByUserID(FWUserInfo entity)
        {
            List<IFWCommand> fwCommandList = new List<IFWCommand>();
            List<IFWParameter> fwParameterList = new List<IFWParameter>() {
                new FWParameter("userID", entity.userID)
            };
            fwCommandList.Add(FWSqlEntityToFWCommandStaticHelper.update(entity, "userID=@userID", fwParameterList));
            return fwCommandList;
        }

        public static IFWCommand deleteByUserID(string userID)
        {
            return FWSqlEntityToFWCommandStaticHelper.delete<FWUserInfo>("userID=@userID", new List<IFWParameter>() { new FWParameter("@userID", userID) });
        }

    }
}
