using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwDal;
using fw.m.sysBasicManage.data.entity;
using fw.m.sysManage.data.entity;
using fw.m.sysBasicManage.bll;

namespace fw.m.sysBasicManage.dal
{
   public class FWUserMappingDictionaryDal
    {
        public static void defaultEntity(FWUserMappingDictionary entity)
        {
            if (entity != null)
            {
                if (string.IsNullOrEmpty(entity.dataID))
                {
                    entity.dataID = Guid.NewGuid().ToString();
                }
            }
        }

        /// <summary>
        /// 确认 菜单编码加上角色编码的唯一性
        /// </summary>
        /// <param name="dataID">字典编码</param>
        /// <param name="userID">角色编码</param>
        /// <returns></returns>
        public static IFWCommand primaryKeyValidate(string userID, string dataID)
        {
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            StringBuilder sb = new StringBuilder();
            sb.Append(@"select count(1) from FWUserMappingDictionary where (userID=@userID and dataID=@dataID)");
            fwSqlCommand.Parameters.AddWithValue("userID", userID);
            fwSqlCommand.Parameters.AddWithValue("dataID", dataID);
            fwSqlCommand.CommandText = sb.ToString();
            return fwSqlCommand;
        }

        public static IFWCommand insert(FWUserMappingDictionary entity)
        {
            IFWCommand fwCommand = null;
            if (entity != null)
            {
                defaultEntity(entity);
                fwCommand = FWSqlEntityToFWCommandStaticHelper.insert<FWUserMappingDictionary>(entity);
            }
            return fwCommand;
        }

        public static List<IFWCommand> insert(List<FWUserMappingDictionary> entityList)
        {
            List<IFWCommand> fwCommandList = new List<IFWCommand>();
            if (entityList != null && entityList.Count > 0)
            {
                foreach (FWUserMappingDictionary entity in entityList)
                {
                    fwCommandList.Add(insert(entity));
                }
            }
            return fwCommandList;
        }

        public static bool insertOrUpdateByUserIDdataID(FWUserMappingDictionary entity)
        {
            defaultEntity(entity);
            return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<FWUserMappingDictionary>(entity, new List<string>() { "userID", "dataID" }).dbResultStatus == FWDBResultStatus.Success;
        }

        public static IFWCommand deleteByUserIDdataID(string userID, string dictionaryDataID)
        {
            List<IFWParameter> afterWhereSqlParams = new List<IFWParameter>();
            afterWhereSqlParams.Add(new FWParameter("userID", userID));
            afterWhereSqlParams.Add(new FWParameter("dictionaryDataID", dictionaryDataID));
            return FWSqlEntityToFWCommandStaticHelper.delete<FWUserMappingDictionary>("userID=@userID and dictionaryDataID=@dictionaryDataID", afterWhereSqlParams);
        }

        public static IFWCommand deleteByUserID(string userID)
        {
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            StringBuilder sb = new StringBuilder();
            sb.AppendFormat(@"DELETE FROM  FWUserMappingDictionary WHERE dictionaryDataID IN (SELECT  [dataID]  FROM  [dbo].[FWDictionary] WHERE [dictionaryTypeCode]='{0}' AND isnull([isDis],0)=0) AND userID=@userID", DictionaryTypeCodeSettings.BLLCanton);
            fwSqlCommand.Parameters.AddWithValue("userID", userID);
            fwSqlCommand.CommandText = sb.ToString();
            return fwSqlCommand;
        }
    }
}
