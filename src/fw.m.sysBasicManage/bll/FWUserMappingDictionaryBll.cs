using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwDal;
using fw.fwData;
using fw.fwSession;
using fw.m.sysBasicManage.dal;
using fw.m.sysBasicManage.data;
using fw.m.sysBasicManage.data.entity;
using fw.m.sysBasicManage.data.model;
using fw.m.sysManage.dal;
using fw.m.sysManage.data;
using fw.m.sysManage.data.entity;
using fw.m.sysManage.data.model;

namespace fw.m.sysBasicManage.bll
{
    public class FWUserMappingDictionaryBll
    {

        public static FWResult<List<MFWDictionary>> queryMDictionaryList(IFWUserInfo userInfo, string pCode)
        {
            FWResult<List<MFWDictionary>> result = new FWResult<List<MFWDictionary>>() { };
            FWSqlCommand cmd = new FWSqlCommand()
            {
                CommandText = @"
                                SELECT dataID as mDataId,
                                       code as mCode,
                                       pCode as mpCode,
                                       name as mName,
                                       ix as mIx,
                                       [level] as mLevel,
                                       [fullCode] as  mFullCode,
                                       [fullName] as mFullName
                                  FROM FWDictionary
                                 where dictionaryTypeCode = @dictionaryTypeCode
                                 and isnull(isDis,0) = 0 order by ix
                                ",
            };
            cmd.Parameters.AddWithValue("dictionaryTypeCode", pCode);
            result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MFWDictionary>(cmd);
            result.status = FWResultStatus.Success;
            return result;
        }

        public static FWResult<List<MFWUserMappingDictionary>> queryList(IFWUserInfo userInfo, QueryListMFWUserMappingDictionaryParams queryParams)
        {
            FWResult<List<MFWUserMappingDictionary>> result = new FWResult<List<MFWUserMappingDictionary>>() { };
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            StringBuilder sbSql = new StringBuilder();
            var sql_joindic = string.Empty;
            if (queryParams != null && !string.IsNullOrEmpty(queryParams.mDictionaryTypeCode))
            {
                sql_joindic = string.Format(@" INNER JOIN dbo.FWDictionary tb2 ON tb1.[dictionaryDataID]=tb2.[dataID] 
AND dictionaryTypeCode='{0}' ", FWSqlCommandStaticHelper.checkParam(queryParams.mDictionaryTypeCode));
            }

            sbSql.Append(@"
SELECT
    tb1.[dataID] [mDataID]
    ,tb1.[userID] [mUserID]
    ,tb1.[dictionaryDataID] [mDictionaryDataID]
FROM
");
            sbSql.AppendFormat(@"
    [dbo].[FWUserMappingDictionary] tb1 {0} where 1<>1", sql_joindic);
            if (queryParams != null)
            {
                if (queryParams.mUserIDList != null && queryParams.mUserIDList.Count > 0)
                {
                    sbSql.Append("or (");
                    sbSql.AppendFormat(@"(tb1.[userID]='{0}')", FWSqlCommandStaticHelper.checkParam(queryParams.mUserIDList[0]));
                    for (int i = 1; i < queryParams.mUserIDList.Count; i++)
                    {
                        sbSql.AppendFormat(@" or (tb1.[userID]='{0}')", FWSqlCommandStaticHelper.checkParam(queryParams.mUserIDList[i]));
                    }
                    sbSql.Append(")");
                };
            }
            fwSqlCommand.CommandText = sbSql.ToString();
            result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MFWUserMappingDictionary>(fwSqlCommand);
            result.status = FWResultStatus.Success;
            return result;
        }

        public static FWResult<bool> updateByMUserIDListInsertMDictionaryDataIDListDeleteMDictionaryDataIDList(IFWUserInfo userInfo, List<string> mUserIDList, List<string> insertMDictionaryDataIDList, List<string> deleteMDictionaryDataIDList)
        {
            FWResult<bool> result = new FWResult<bool>();
            try
            {
                List<FWUserMappingDictionary> insertEntityList = new List<FWUserMappingDictionary>();
                List<FWUserMappingDictionary> deleteEntityList = new List<FWUserMappingDictionary>();
                foreach (string userID in mUserIDList)
                {
                    if (insertMDictionaryDataIDList != null && insertMDictionaryDataIDList.Count > 0)
                    {
                        foreach (string dictionaryDataID in insertMDictionaryDataIDList)
                        {
                            if (!string.IsNullOrEmpty(userID))
                            {
                                insertEntityList.Add(new FWUserMappingDictionary()
                                {
                                    userID = userID,
                                    dictionaryDataID = dictionaryDataID,
                                });
                            }
                        }
                    }
                    if (deleteMDictionaryDataIDList != null && deleteMDictionaryDataIDList.Count > 0)
                    {
                        foreach (string dictionaryDataID in deleteMDictionaryDataIDList)
                        {
                            if (!string.IsNullOrEmpty(userID))
                            {
                                deleteEntityList.Add(new FWUserMappingDictionary()
                                {
                                    userID = userID,
                                    dictionaryDataID = dictionaryDataID,
                                });
                            }
                        }
                    }
                }
                FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
                fwSqlTransaction.BeginTransaction();
                if (deleteEntityList != null && deleteEntityList.Count > 0)
                {
                    foreach (FWUserMappingDictionary deleteEntity in deleteEntityList)
                    {
                        FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, FWUserMappingDictionaryDal.deleteByUserIDdataID(deleteEntity.userID, deleteEntity.dictionaryDataID));
                    }
                }
                foreach (FWUserMappingDictionary insertEntity in insertEntityList)
                {
                    if (FWSqlCommandStaticHelper.ExecuteScalar(fwSqlTransaction, FWUserMappingDictionaryDal.primaryKeyValidate(insertEntity.userID, insertEntity.dictionaryDataID)) < 1)
                    {
                        insertEntity.createrID = userInfo.userID;
                        insertEntity.createTime = DateTime.Now;
                        insertEntity.updaterID = userInfo.userID;
                        insertEntity.updateTime = DateTime.Now;
                        FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, FWUserMappingDictionaryDal.insert(insertEntity));
                    }
                }
                fwSqlTransaction.Commit();
                result.data = true;
                result.status = FWResultStatus.Success;
            }
            catch (FWException ex)
            {
                result.data = false;
                result.status = FWResultStatus.Failure;
                result.infoList.Add(ex.Message);
            }

            return result;
        }

        #region 用户行政区分配  CRUD

        public static FWResult<List<MFWUserMappingDictionary>> queryFWUserMappingCantonCodeList(IFWUserInfo userInfo, string userID)
        {
            FWResult<List<MFWUserMappingDictionary>> result = new FWResult<List<MFWUserMappingDictionary>>() { };
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            StringBuilder sbSql = new StringBuilder();
            sbSql.AppendFormat(@"
SELECT
    tb1.[dataID] [mDataID]
    ,tb1.[userID] [mUserID]
    ,tb1.[dictionaryDataID] [mDictionaryDataID]
    ,tb2.code cantonCode
FROM
[dbo].[FWUserMappingDictionary] tb1  INNER JOIN dbo.FWDictionary tb2 ON tb1.[dictionaryDataID]=tb2.[dataID] 
AND dictionaryTypeCode='{0}'
WHERE 1<>1  
", DictionaryTypeCodeSettings.BLLCanton);

            if (!string.IsNullOrEmpty(userID))
            {
                sbSql.AppendFormat(@" or  tb1.[userID]='{0}' ", FWSqlCommandStaticHelper.checkParam(userID));
            }
            fwSqlCommand.CommandText = sbSql.ToString();
            result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MFWUserMappingDictionary>(fwSqlCommand);
            result.status = FWResultStatus.Success;
            return result;
        }


        public static FWResult<bool> updateFWUserMappingCantonCodeListByMUserID(IFWUserInfo userInfo, string userID, List<string> insertMDictionaryDataIDList)
        {
           
            FWResult<bool> result = new FWResult<bool>();
            if (string.IsNullOrEmpty(userID))
            {
                result.data = false;
                result.status = FWResultStatus.Failure;
                result.infoList.Add("参数 userID 不能为空！");
                return result;
            }
            List<FWUserMappingDictionary> insertEntityList = new List<FWUserMappingDictionary>();
            if (insertMDictionaryDataIDList != null && insertMDictionaryDataIDList.Count > 0)
            {
                foreach (string dictionaryDataID in insertMDictionaryDataIDList)
                {
                    if (!string.IsNullOrEmpty(userID))
                    {
                        insertEntityList.Add(new FWUserMappingDictionary()
                        {
                            userID = userID,
                            dictionaryDataID = dictionaryDataID,
                        });
                    }
                }
            }

            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            fwSqlTransaction.BeginTransaction();
            try
            {
                FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, FWUserMappingDictionaryDal.deleteByUserID(userID));
                foreach (FWUserMappingDictionary insertEntity in insertEntityList)
                {
                    insertEntity.createrID = userInfo.userID;
                    insertEntity.createTime = DateTime.Now;
                    insertEntity.updaterID = userInfo.userID;
                    insertEntity.updateTime = DateTime.Now;
                    FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, FWUserMappingDictionaryDal.insert(insertEntity));
                }
                fwSqlTransaction.Commit();
                result.data = true;
                result.status = FWResultStatus.Success;
            }
            catch (FWException ex)
            {
                fwSqlTransaction.Rollback();
                result.data = false;
                result.status = FWResultStatus.Failure;
                result.infoList.Add(ex.Message);
            }

            return result;
        }
        #endregion
    }
}
