using System;
using System.Collections.Generic;
using System.Text;
using fw.fwDal;
using fw.fwData;
using fw.fwFile;
using fw.fwList;
using fw.fwSession;
using fw.m.sysBasicManage.dal;
using fw.m.sysBasicManage.data.model;
using fw.m.sysManage.bll;
using fw.m.userLogin.data.model;
using System.Data;
using System.Linq;
using fw.fwSafe;
using fw.m.sysBasicManage.data;
using fw.m.sysManage.data;
using fw.m.sysManage.data.entity;
using fw.m.userLogin.data;
using fw.m.basicInfo.bll;
using fw.m.basicInfo.data.entity;
using fw.m.userLogin.data.entity;

namespace fw.m.sysBasicManage.bll
{
    public class FWUserInfoBll
    {
        public static void defaultEntity(IFWUserInfo userInfo, fw.m.sysBasicManage.data.entity.FWUserInfo entity)
        {
            if (entity != null)
            {
                entity.createrID = userInfo.userID;
                entity.createTime = DateTime.Now;
                entity.updaterID = userInfo.userID;
                entity.updateTime = DateTime.Now;

                if (FWEntityObject.isChangeProperty(entity, "longitude") && FWEntityObject.isChangeProperty(entity, "latitude"))
                {
                    entity.lastLocationTime = DateTime.Now;
                }
            }
        }

        public static FWResult<bool> insertOrUpdateByUserID(IFWUserInfo userInfo, fw.m.sysBasicManage.data.entity.FWUserInfo entity, IFWTransaction transaction)
        {
            FWResult<bool> result = new FWResult<bool>();
            defaultEntity(userInfo, entity);
            IFWDBResult fwDBResult = FWUserInfoDal.insertOrUpdateByUserID(entity, transaction);
            if (fwDBResult.dbResultStatus == FWDBResultStatus.Success)
            {
                result.data = true;
                result.status = FWResultStatus.Success;
            }
            return result;
        }

        public static FWResult<bool> insertOrUpdateByMUserID(IFWUserInfo userInfo, MFWUserInfo mEntity, IFWTransaction transaction)
        {
            FWResult<bool> result = new FWResult<bool>();
            result = FWUserLoginBll.insertOrUpdateByMUserID(userInfo, (MFWUserLogin)mEntity, transaction);
            if (result.status == FWResultStatus.Success && result.data)
            {
                fw.m.sysBasicManage.data.entity.FWUserInfo entity = SysBasicManageBll.convertEntity<fw.m.sysBasicManage.data.entity.FWUserInfo>(mEntity);
                BLLUserLoginRight right = new BLLUserLoginRight();
                right.userId = mEntity.mUserID;
                right.loginRight = mEntity.loginRight;
                BLLUserLoginRightBll.insertOrUpdate(userInfo.userID,right,transaction);
                if (!string.IsNullOrEmpty(mEntity.mPhotoAction))
                {
                    FWDBAction mPhotoAction = (FWDBAction)(Convert.ToInt32(mEntity.mPhotoAction));
                    switch (mPhotoAction)
                    {
                        case FWDBAction.Update:
                            entity.photo = FWFileHelper.getFileByteArray(System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, mEntity.mPhotoRelativePath));
                            break;
                        case FWDBAction.Delete:
                            entity.photo = null;
                            break;
                    }
                }
                result = insertOrUpdateByUserID(userInfo, entity, transaction);
            }
            return result;
        }

        public static FWResult<bool> insertOrUpdateByMUserID(IFWUserInfo userInfo, MFWUserInfo mEntity)
        {
            FWResult<bool> result = new FWResult<bool>();
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            try
            {
                fwSqlTransaction.BeginTransaction();
                result = insertOrUpdateByMUserID(userInfo, mEntity, fwSqlTransaction);
                if (result.status == FWResultStatus.Success && result.data)
                {
                    fwSqlTransaction.Commit();
                }
                else
                {
                    fwSqlTransaction.Rollback();
                    result.infoList.AddRange(result.infoList);
                }

            }
            catch (FWException ex)
            {
                fwSqlTransaction.Rollback();
                result.infoList.Add(ex.ToString());
            }
            finally
            {
                fwSqlTransaction.Close();
            }
            return result;
        }

        public static FWResult<bool> insertOrUpdateByUserID(IFWUserInfo userInfo, List<fw.m.sysBasicManage.data.entity.FWUserInfo> entityList)
        {
            FWResult<bool> result = new FWResult<bool>();
            if (entityList != null && entityList.Count > 0)
            {
                foreach (fw.m.sysBasicManage.data.entity.FWUserInfo entity in entityList)
                {
                    defaultEntity(userInfo, entity);
                }
            }
            var entityListClone = fwJson.FWJsonHelper.copyObject<List<fw.m.sysBasicManage.data.entity.FWUserInfo>>(entityList);
            List<IFWDBResult> fwDBResultList = FWUserInfoDal.insertOrUpdateByUserID(entityList);
            if (fwDBResultList != null && fwDBResultList.Count > 0)
            {
                result.data = true;
                //IUserInfoing userInfoing = FWReflectionHelper.createInstance<IUserInfoing>("fw.m.sysManage", "fw.m.sysManage.service", "SysManageUserInfoing");
                //if (userInfoing != null)
                //{
                //    bool isSuccess = true;
                //    IFWDBResult fwDBResult;
                //    for (int i = 0; i < fwDBResultList.Count; i++)
                //    {
                //        fwDBResult = fwDBResultList[i];
                //        FWResult<bool> resultInsertUser = userInfoing.insertUser(userInfo, entityList[i]);
                //        if (fwDBResult.dbAction == FWDBAction.Insert && resultInsertUser.status == FWResultStatus.Success && resultInsertUser.data && isSuccess)
                //        {
                //            isSuccess = false;
                //        }
                //    }
                //    result.data = isSuccess;
                //}
            }
            if (result.data)
            {
                result.status = FWResultStatus.Success;
            }
            return result;
        }

        public static FWResult<bool> insertOrUpdateByMUserID(IFWUserInfo userInfo, List<MFWUserInfo> mEntityList)
        {
            return insertOrUpdateByUserID(userInfo, SysBasicManageBll.convertEntityList<fw.m.sysBasicManage.data.entity.FWUserInfo>(FWListHelper<MFWUserInfo>.toObjectList(mEntityList)));
        }

        public static FWResult<bool> insertOrUpdateByUserID(List<fw.m.sysBasicManage.data.entity.FWUserInfo> entityList)
        {
            FWResult<bool> result = new FWResult<bool>();
            if (entityList != null && entityList.Count > 0)
            {
                foreach (fw.m.sysBasicManage.data.entity.FWUserInfo entity in entityList)
                {
                    if (string.IsNullOrEmpty(entity.userID))
                    {
                        entity.createrID = "sysAdmin";
                        entity.createTime = DateTime.Now;
                    }
                    entity.updaterID = "sysAdmin";
                    entity.updateTime = DateTime.Now;
                }
            }
            List<IFWDBResult> fwDBResultList = FWUserInfoDal.insertOrUpdateByUserID(entityList);
            if (result.data)
            {
                result.status = FWResultStatus.Success;
            }
            return result;
        }

        public static FWResult<bool> insertOrUpdateByMUserID(List<MFWUserInfo> mEntityList)
        {
            return insertOrUpdateByUserID(SysBasicManageBll.convertEntityList<fw.m.sysBasicManage.data.entity.FWUserInfo>(FWListHelper<MFWUserInfo>.toObjectList(mEntityList)));
        }

        public static FWResult<List<Contact>> queryListContact(IFWUserInfo userInfo, int orgFullNameLevel)
        {

            FWResult<List<Contact>> result = new FWResult<List<Contact>>();

            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            fwSqlCommand.CommandText = @"
--declare @FWOrganization varchar(36)='FWOrganization'
--declare @isDis varchar(36)='0'
--declare @userTypeCode varchar(36)='11'

SELECT
	tb1.[userID] [userID]
	,case when tb2.[chineseName] is null then tb1.[userName] else tb2.[chineseName] end [userName]
	,case when tb2.[photo] is null then null else '1' end photoUrl
    ,tb2.photoFileFingerprint
	,tb3.[name] [orgName]
	,tb3.[fullName] [orgFullName]
FROM
	[FWUserLogin] tb1
	left join [FWUserInfo] tb2 on tb1.[userID]=tb2.[userID]
	left join [FWDictionary] tb3 on tb3.[dictionaryTypeCode]=@FWOrganization and tb2.[orgCode]=tb3.[code]
WHERE
	tb1.[isDis]=@isDis
	and tb1.[userTypeCode]=@userTypeCode
order by
    tb3.[code]
    ,tb1.[userName]
            ";
            fwSqlCommand.Parameters.AddWithValue("@FWOrganization", fw.m.sysBasicManage.data.FWDictionaryTypeCode.FWOrganization);
            fwSqlCommand.Parameters.AddWithValue("@isDis", FWIsDisCode.Enable);
            fwSqlCommand.Parameters.AddWithValue("@userTypeCode", FWUserTypeCode.Nor);
            result.data = FWSqlEntityToFWCommandStaticHelper.queryList<Contact>(fwSqlCommand);
            if (result.data != null && result.data.Count > 0)
            {
                string[] orgNameArray;
                StringBuilder sbOrgFullName;
                int level;
                foreach (var entity in result.data)
                {
                    if (!string.IsNullOrEmpty(entity.orgFullName))
                    {
                        orgNameArray = entity.orgFullName.Split('.');
                        level = orgNameArray.Length > orgFullNameLevel ? orgFullNameLevel : orgNameArray.Length;
                        sbOrgFullName = new StringBuilder();
                        for (int i = 0; i < level; i++)
                        {
                            sbOrgFullName.AppendFormat("{0}.", orgNameArray[i]);
                        }
                        if (sbOrgFullName.Length > 0)
                        {
                            sbOrgFullName.Remove(sbOrgFullName.Length - 1, 1);
                        }
                        entity.orgFullName = sbOrgFullName.ToString();
                    }
                    if (!string.IsNullOrEmpty(entity.photoUrl))
                    {
                        entity.photoUrl = FWFileHelper.getDbFileUrl("select [photo] from [dbo].[FWUserInfo] where [UserID]='" + FWSqlCommandStaticHelper.checkParam(entity.userID) + "'", entity.photoFileFingerprint);
                    }
                }
            }
            result.status = FWResultStatus.Success;
            return result;
        }

        public static FWResult<MFWUserInfo> queryByMUserID(IFWUserInfo userInfo, string mUserID)
        {
            FWResult<MFWUserInfo> result = new FWResult<MFWUserInfo>();
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            fwSqlCommand.CommandText = string.Format(@"
--declare @mUserID varchar(36)='2a116ed0-733b-4267-a1d6-26d58c5144d7'

SELECT top 1
	tb2.[userID] [mUserID]
    ,tb2.[userName] [mUserName]
    ,tb2.[userTypeCode] [mUserTypeCode]
    ,tb3.[userTypeName] [mUserTypeName]
    ,tb3.[isDistribute] [mIsDistribute]
    ,tb2.[canBindDeviceCount] [mCanBindDeviceCount]
    ,tb2.[isDis] [mIsDis]
    ,tb8.[name] [mIsDisName]
	,tb1.[chineseName] [mChineseName]
    ,case when tb1.[photo] is null then null else '1' end mPhotoUrl
	,tb1.[photoFileFingerprint] [mPhotoFileFingerprint]
	,tb1.[gender] [mGender]
	,tb4.[name] [mGenderName]
	,tb1.[ethnic] [mEthnic]
	,tb5.[name] [mEthnicName]
	,tb1.[birthdayTypeCode] [mBirthdayTypeCode]
	,tb6.[name] [mBirthdayTypeName]
	,CONVERT(date, tb1.[birthday], 23) [mBirthday]
	,tb1.[address] [mAddress]
	,tb1.[zipCode] [mZipCode]
	,tb1.[identificationCard] [mIdentificationCard]
	,tb1.[mobilePhone] [mMobilePhone]
	,tb1.[eMail] [mEMail]
	,tb1.[fax] [mFax]
	,tb1.[longitude] [mLongitude]
	,tb1.[latitude] [mLatitude]
	,tb1.[lastLocationTime] [mLastLocationTime]
	,tb1.[deviceOperatingSystemCode] [mDeviceOperatingSystemCode]
	,tb7.[name] [mDeviceOperatingSystemName]
	,tb1.[deviceAlias] [mDeviceAlias]
    ,tb1.cantonCode
    ,ISNULL(tb9.loginRight,1) AS loginRight
FROM
    [FWUserLogin] tb2
    LEFT JOIN [FWUserInfo] tb1 on tb2.[userID]=tb1.[userID]
    LEFT JOIN FWUserType tb3 ON tb3.userTypeCode = tb2.userTypeCode
    LEFT JOIN FWDictionary tb4 ON tb4.dictionaryTypeCode='{0}' and tb4.code = tb1.gender
    LEFT JOIN FWDictionary tb5 ON tb5.dictionaryTypeCode='{1}' and tb5.code = tb1.[ethnic]
    LEFT JOIN FWDictionary tb6 ON tb6.dictionaryTypeCode='{2}' and tb6.code = tb1.[birthdayTypeCode]
    LEFT JOIN FWDictionary tb7 ON tb7.dictionaryTypeCode='{3}' and tb7.code = tb1.[deviceOperatingSystemCode]
    LEFT JOIN FWDictionary tb8 ON tb7.dictionaryTypeCode='{4}' and tb8.code = tb2.[isDis]
    LEFT JOIN dbo.BLLUserLoginRight tb9 ON tb9.userId=tb2.userID
where 1=1 
    and tb2.[UserID]=@UserID
            ", FWSqlCommandStaticHelper.checkParam(fw.m.sysBasicManage.data.FWDictionaryTypeCode.FWGender)
                , FWSqlCommandStaticHelper.checkParam(fw.m.sysBasicManage.data.FWDictionaryTypeCode.FWEthnic)
                , FWSqlCommandStaticHelper.checkParam(fw.m.sysBasicManage.data.FWDictionaryTypeCode.FWDateType)
                , FWSqlCommandStaticHelper.checkParam(fw.m.sysBasicManage.data.FWDictionaryTypeCode.FWDeviceOperatingSystem)
                , FWSqlCommandStaticHelper.checkParam(fw.m.sysManage.data.FWDictionaryTypeCode.FWIsDis));
            fwSqlCommand.Parameters.AddWithValue("UserID", mUserID);
            result.data = FWSqlEntityToFWCommandStaticHelper.query<MFWUserInfo>(fwSqlCommand);
            if (!string.IsNullOrEmpty(result.data.mPhotoUrl))
            {
                result.data.mPhotoUrl = FWFileHelper.getDbFileUrl("select [photo] from [FWUserInfo] where [UserID]='" + FWSqlCommandStaticHelper.checkParam(result.data.mUserID) + "'", result.data.mPhotoFileFingerprint);
            }
            result.status = FWResultStatus.Success;
            return result;
        }

        public static FWResult<fw.m.sysBasicManage.data.entity.FWUserInfo> queryByUserName(IFWUserInfo userInfo, string userName)
        {
            FWResult<fw.m.sysBasicManage.data.entity.FWUserInfo> result = new FWResult<fw.m.sysBasicManage.data.entity.FWUserInfo>();
            List<IFWParameter> fwParameterList = new List<IFWParameter>() { 
                new FWParameter("userName", userName),
            };
            result.data = FWSqlEntityToFWCommandStaticHelper.query<fw.m.sysBasicManage.data.entity.FWUserInfo>("userName=@userName", fwParameterList);
            result.status = FWResultStatus.Success;
            return result;
        }

        public static FWResult<FWPageData<MFWUserInfo>> queryPage(IFWUserInfo userInfo, FWPageParams pageParams, QueryPageMFWUserInfoParams queryParams)
        {
            FWResult<FWPageData<MFWUserInfo>> result = new FWResult<FWPageData<MFWUserInfo>>();
            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            StringBuilder sbSql = new StringBuilder();
            sbSql.AppendFormat(@"  					
SELECT
	tb2.[userID] [mUserID]
    ,tb2.[userName] [mUserName]
    ,tb2.[userTypeCode] [mUserTypeCode]
    ,tb3.[userTypeName] [mUserTypeName]
    ,tb3.[isDistribute] [mIsDistribute]
    ,tb2.[canBindDeviceCount] [mCanBindDeviceCount]
    ,tb2.[isDis] [mIsDis]
    ,tb8.[name] [mIsDisName]
	,tb1.[chineseName] [mChineseName]
	,tb1.[photoFileFingerprint] [mPhotoFileFingerprint]
	,tb1.[gender] [mGender]
	,tb4.[name] [mGenderName]
	,tb1.[ethnic] [mEthnic]
	,tb5.[name] [mEthnicName]
	,tb1.[birthdayTypeCode] [mBirthdayTypeCode]
	,tb6.[name] [mBirthdayTypeName]
	,CONVERT(date, tb1.[birthday], 23) [mBirthday]
	,tb1.[address] [mAddress]
	,tb1.[zipCode] [mZipCode]
	,tb1.[identificationCard] [mIdentificationCard]
	,tb1.[mobilePhone] [mMobilePhone]
	,tb1.[eMail] [mEMail]
	,tb1.[fax] [mFax]
	,tb1.[longitude] [mLongitude]
	,tb1.[latitude] [mLatitude]
	,tb1.[lastLocationTime] [mLastLocationTime]
	,tb1.[deviceOperatingSystemCode] [mDeviceOperatingSystemCode]
	,tb7.[name] [mDeviceOperatingSystemName]
	,tb1.[deviceAlias] [mDeviceAlias]
FROM
    [FWUserLogin] tb2
    LEFT JOIN [FWUserInfo] tb1 on tb2.[userID]=tb1.[userID]
    LEFT JOIN FWUserType tb3 ON tb3.userTypeCode = tb2.userTypeCode
    LEFT JOIN FWDictionary tb4 ON tb4.dictionaryTypeCode='{0}' and tb4.code = tb1.gender
    LEFT JOIN FWDictionary tb5 ON tb5.dictionaryTypeCode='{1}' and tb5.code = tb1.[ethnic]
    LEFT JOIN FWDictionary tb6 ON tb6.dictionaryTypeCode='{2}' and tb6.code = tb1.[birthdayTypeCode]
    LEFT JOIN FWDictionary tb7 ON tb7.dictionaryTypeCode='{3}' and tb7.code = tb1.[deviceOperatingSystemCode]
    LEFT JOIN FWDictionary tb8 ON tb7.dictionaryTypeCode='{4}' and tb8.code = tb2.[isDis]
WHERE
    1=1 "
                , FWSqlCommandStaticHelper.checkParam(fw.m.sysBasicManage.data.FWDictionaryTypeCode.FWGender)
                , FWSqlCommandStaticHelper.checkParam(fw.m.sysBasicManage.data.FWDictionaryTypeCode.FWEthnic)
                , FWSqlCommandStaticHelper.checkParam(fw.m.sysBasicManage.data.FWDictionaryTypeCode.FWDateType)
                , FWSqlCommandStaticHelper.checkParam(fw.m.sysBasicManage.data.FWDictionaryTypeCode.FWDeviceOperatingSystem)
                , FWSqlCommandStaticHelper.checkParam(fw.m.sysManage.data.FWDictionaryTypeCode.FWIsDis));
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.keyword))
                {
                    sbSql.AppendFormat(@" and tb2.[userName] like '%{0}%'", FWSqlCommandStaticHelper.checkParam(queryParams.keyword));
                }

                if (!string.IsNullOrEmpty(queryParams.userTypeCode))
                {
                    sbSql.AppendFormat(@" and tb2.[userTypeCode] = '{0}' ", FWSqlCommandStaticHelper.checkParam(queryParams.userTypeCode));
                }
            }
            sbSql.Append(@" order by ");
            if (pageParams.sortFieldList != null && pageParams.sortFieldList.Count > 0)
            {
                foreach (FWSortField fwSortField in pageParams.sortFieldList)
                {
                    switch (fwSortField.fieldName)
                    {
                        case "mUserName":
                            fwSortField.fieldName = "tb2.[userName]";
                            break;
                        case "mChineseName":
                            fwSortField.fieldName = "tb1.[chineseName]";
                            break;
                        case "mGender":
                            fwSortField.fieldName = "tb1.[gender]";
                            break;
                        case "mEMail":
                            fwSortField.fieldName = "tb1.[eMail]";
                            break;
                        case "mMobilePhone":
                            fwSortField.fieldName = "tb1.[mobilePhone]";
                            break;
                        case "mIsDis":
                            fwSortField.fieldName = "tb2.[isDis]";
                            break;
                    }
                    sbSql.AppendFormat(@"{0} {1},", fwSortField.fieldName, fwSortField.sortType == FWSortType.Desc ? "desc" : "asc");
                }
                sbSql.Remove(sbSql.Length - 1, 1);
            }
            else
            {
                sbSql.Append(@"tb2.[createTime] desc ");
            }
            fwPageProcedureParams.sql = sbSql.ToString();
            result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MFWUserInfo>(fwPageProcedureParams);

            //获取用户角色信息
            //运维人员分配
            if (result.data.entityList != null && result.data.entityList.Count > 0)
            {
                FWSqlCommand fwSqlCommand = new FWSqlCommand();
                fwSqlCommand.CommandText = string.Format(@" 
                SELECT  [operationMaintenancePersonCode],[operationMaintenancePersonName]  ,userID   FROM  [dbo].[BLLOperationMaintenancePerson]  WHERE ISNULL([isDel],0)=0 AND   userID IS NOT NULL   ");
                var personList = FWSqlEntityToFWCommandStaticHelper.queryList<MOperations>(fwSqlCommand);
                if (personList != null && personList.Count > 0)
                {
                    foreach (var userinfo in result.data.entityList)
                    {
                        var hitList = personList.Where(p => p.userID.Equals(userinfo.mUserID)).ToList();
                        if (hitList != null && hitList.Count > 0)
                        {
                            userinfo.operationMaintenancePersonCode = hitList.First().operationMaintenancePersonCode;
                            userinfo.operationMaintenancePersonName = hitList.First().operationMaintenancePersonName;
                        }
                    }
                }
            }
            result.status = FWResultStatus.Success;
            return result;
        }

        public static FWResult<bool> updateByUserID(IFWUserInfo userInfo, fw.m.sysBasicManage.data.entity.FWUserInfo entity)
        {
            FWResult<bool> result = new FWResult<bool>();
            List<IFWCommand> commandList = new List<IFWCommand>();
            commandList.AddRange(FWUserInfoDal.updateByUserID(entity));
            result.data = FWSqlCommandStaticHelper.ExecuteNonQuery(commandList);
            result.status = FWResultStatus.Success;
            return result;
        }

        public static FWResult<bool> deleteByUserID(IFWUserInfo userInfo, string userID)
        {
            FWResult<bool> result = new FWResult<bool>();
            List<IFWCommand> commandList = new List<IFWCommand>();
            commandList.Add(FWUserInfoDal.deleteByUserID(userID));
            result.data = FWSqlCommandStaticHelper.ExecuteNonQuery(commandList);
            result.status = FWResultStatus.Success;
            return result;
        }

        public static FWResult<List<MFWUserInfo>> queryMFWUserInfoList(string appCode, string userTypeCode)
        {
            FWResult<List<MFWUserInfo>> result = new FWResult<List<MFWUserInfo>>();
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            StringBuilder sbSql = new StringBuilder();
            sbSql.Append(@"SELECT a.userID AS mUserID,a.userName AS mUserName,a.isDis AS mIsDis
            FROM dbo.FWUserInfo a
            WHERE (NOT EXISTS(SELECT 1 FROM dbo.FWAppUser b WHERE b.userID=a.userID AND b.appCode=@appCode AND b.isAdd=1))
            AND a.userTypeCode=@userTypeCode");

            fwSqlCommand.Parameters.AddWithValue("@userTypeCode", userTypeCode);
            fwSqlCommand.Parameters.AddWithValue("@appCode", appCode);
            fwSqlCommand.CommandText = sbSql.ToString();
            result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MFWUserInfo>(fwSqlCommand);
            result.status = FWResultStatus.Success;
            return result;
        }

        public static FWResult<List<MFWUserInfo>> queryMFWUserInfoAllList()
        {
            FWResult<List<MFWUserInfo>> result = new FWResult<List<MFWUserInfo>>();
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            StringBuilder sbSql = new StringBuilder();
            sbSql.Append(@"SELECT userID AS mUserID,userName AS mUserName,isDis AS mIsDis
            FROM dbo.FWUserInfo");

            fwSqlCommand.CommandText = sbSql.ToString();
            result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MFWUserInfo>(fwSqlCommand);
            result.status = FWResultStatus.Success;
            return result;
        }

        public static FWResult<List<MFWUserInfo>> queryMFWUserInfoAllList(string userTypeCode)
        {
            FWResult<List<MFWUserInfo>> result = new FWResult<List<MFWUserInfo>>();
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            StringBuilder sbSql = new StringBuilder();
            sbSql.Append(@"SELECT userID AS mUserID,userName AS mUserName,isDis AS mIsDis
            FROM dbo.FWUserInfo
            WHERE userTypeCode=@userTypeCode");

            fwSqlCommand.Parameters.AddWithValue("@userTypeCode", userTypeCode);
            fwSqlCommand.CommandText = sbSql.ToString();
            result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MFWUserInfo>(fwSqlCommand);
            result.status = FWResultStatus.Success;
            return result;
        }

        public static FWResult<List<MFWUserInfo>> getMFWUserInfoListByUserName(string userName)
        {
            FWResult<List<MFWUserInfo>> result = new FWResult<List<MFWUserInfo>>();
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            StringBuilder sbSql = new StringBuilder();
            sbSql.Append(@"SELECT userID AS mUserID,userName AS mUserName,isDis AS mIsDis
            FROM dbo.FWUserInfo
            WHERE userName=@userName");

            fwSqlCommand.Parameters.AddWithValue("@userName", userName);
            fwSqlCommand.CommandText = sbSql.ToString();
            result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MFWUserInfo>(fwSqlCommand);
            result.status = FWResultStatus.Success;
            return result;
        }

        public static FWResult<string> ResetUserPwdByMUserIDList(IFWUserInfo userInfo, List<string> mUserNameList)
        {
            FWResult<string> result = new FWResult<string>();
            try
            {
                Random random = new Random();
                string pwd = "";
                for (int i = 0; i < 6; i++)
                {
                    pwd += random.Next(0, 9);
                }
                string encryptPwd = FWMD5Helper.encrypt(pwd);
                FWSqlCommand fwSqlCommand = new FWSqlCommand();
                StringBuilder sbSql = new StringBuilder();
                sbSql.Append(@"UPDATE [dbo].[FWUserLogin] SET [password]=@pwd,[updaterID]=@updaterID,[updateTime]=GETDATE() WHERE userName IN(" + FWSqlCommandStaticHelper.joinToSqlString(mUserNameList) + ")");
                fwSqlCommand.Parameters.AddWithValue("@pwd", encryptPwd);
                //fwSqlCommand.Parameters.AddWithValue("@userName", FWSqlCommandStaticHelper.joinToSqlString(mUserNameList));
                fwSqlCommand.Parameters.AddWithValue("@updaterID", userInfo.userID);
                fwSqlCommand.CommandText = sbSql.ToString();
                bool booleReslut = FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlCommand) > 0;
                result.data = pwd;
                result.status = booleReslut ? FWResultStatus.Success : FWResultStatus.Failure;
            }
            catch (Exception ex)
            {
                result.sqlInfoList.Add(ex.Message);
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        public static FWResult<List<FWUserLogin>> queryUnitManagerList()
        {
            FWResult<List<FWUserLogin>> result = new FWResult<List<FWUserLogin>>();
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            StringBuilder sbSql = new StringBuilder();
            sbSql.Append(@"SELECT  t1.userID,t1.userName,
                            CASE WHEN LEN(t3.operationMaintenanceUnitCode)>0 THEN 1
                            ELSE 0 END AS isDis
                            FROM    dbo.FWUserLogin t1
                                    INNER JOIN ( SELECT DISTINCT
                                                        userID
                                                 FROM   dbo.FWUserMappingRole
                                                 WHERE  roleCode = 'managerRole'
                                               ) t2 ON t1.userID = t2.userID
                             LEFT JOIN dbo.BLLOperationMaintenanceUnit t3
                             ON t1.userID=t3.unitManagerID
                            WHERE   t1.isDis = 0;");

            fwSqlCommand.CommandText = sbSql.ToString();
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryList<FWUserLogin>(fwSqlCommand);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.data = new List<FWUserLogin>();
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        /// <summary>
        /// 预设角色
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        public static bool isContainSystemRole(List<string> ids)
        {
            FWResult<List<FWUserRole>> result = new FWResult<List<FWUserRole>>();
            if (ids==null || ids.Count==0)
            {
                return false;
            }
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            StringBuilder sbSql = new StringBuilder();
            StringBuilder sbWhere = new StringBuilder();
            for (int i = 0; i < ids.Count; i++)
            {
                sbWhere.Append("'"+ids[i]+"',");
            }
            
            sbSql.Append(@"SELECT * FROM dbo.FWUserRole where dataID in("+sbWhere.ToString().TrimEnd(',')+")");

            fwSqlCommand.CommandText = sbSql.ToString();
            List<FWUserRole> listRoles= FWSqlEntityToFWCommandStaticHelper.queryList<FWUserRole>(fwSqlCommand);
            List<FWUserRole> existList= listRoles.Where(p => p.roleCode.Equals("sysAdminRole") || p.roleCode.Equals("managerRole") 
                || p.roleCode.Equals("govAdminRole") || p.roleCode.Equals("omPersonRole")).ToList();
            if (existList.Count>0)
            {
                return true;
            }
            return false;
        }
    }
}
