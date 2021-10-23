using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwSession;
using fw.m.sysBasicManage.data;
using fw.m.sysManage.data;
using fw.m.userLogin.data.entity;
using fw.fwDal;
using fw.fwData;
using fw.m.sysBasicManage.data.model;
using fw.m.sysManage.bll;
using fw.m.sysManage.data.model;
using fw.m.userLogin.bll;
using System.Data;
using fw.fwList;
using fw.fwSafe;
using fw.fwJson;
using fw.fwFile;
using fw.fwReflection;
using fw.m.userLogin.data;
using fw.m.userLogin.data.model;

namespace fw.m.sysBasicManage.bll
{
    public class SysBasicManageBll
    {
        #region 映射关系

        public static FWDictionary<string, string> getPropertyNameMapping(string entityName)
        {
            FWDictionary<string, string> propertyNameMapping = new FWDictionary<string, string>();
            if (!string.IsNullOrEmpty(entityName))
            {
                switch (entityName)
                {
                    case "MFWUserInfo":
                        #region MFWUserInfo
                        propertyNameMapping = new FWDictionary<String, String>() {
                            {"mUserID","userID"},
                            {"mChineseName","chineseName"},                            
                            {"mPhoto","photo"},
                            {"mPhotoFileFingerprint","photoFileFingerprint"},
                            {"mGender","gender"},
                            {"mEthnic","ethnic"},
                            {"mBirthdayTypeCode","birthdayTypeCode"},
                            {"mBirthday","birthday"},
                            {"mIdentificationCard","identificationCard"},
                            {"mZipCode","zipCode"},
                            {"mAddress","address"},
                            {"mMobilePhone","mobilePhone"},
                            {"mFax","fax"},
                            {"mEMail","eMail"},
                            {"mDeviceOperatingSystemCode","deviceOperatingSystemCode"},
                            {"mDeviceAlias","deviceAlias"},
                            {"mLongitude","longitude"},
                            {"mLatitude","latitude"},
                            {"mLastLocationTime","lastLocationTime"},
                            {"cantonCode","cantonCode"}
                        };
                        #endregion
                        break;
                    case "MMenuEx":
                        #region MMenuEx
                        propertyNameMapping = new FWDictionary<string, string>() {
                        {"AutoID","AutoID"},{"pageID","pageID"},{"menuCode","menuCode"},{"keyWords","keyWords"}
                        ,{"funDescription","funDescription"},{"instructions","instructions"},{"questions","questions"}
                        ,{"attachmentName","attachmentName"},{"attachmentURL","attachmentURL"},{"keysParamsJson","keysParamsJson"}
                        ,{"keysReturnJson","keysReturnJson"},{"frequency","frequency"},{"isDelete","isDelete"},{"inputMan","inputMan"}
                        ,{"inputTime","inputTime"},{"updaterMan","updaterMan"},{"updateTime","updateTime"},{"showType","showType"},{"openMeans","openMeans"}
                        };
                        #endregion
                        break;
                    case "MFWUserMappingDictionary":
                        #region FWUserMappingDictionary

                        propertyNameMapping = new FWDictionary<string, string>()
   {
       {"id","id"},
       {"dataID","dataID"},
       {"userID","userID"},
       {"dictionaryDataID","dictionaryDataID"},
       {"createrID","createrID"},
       {"createTime","createTime"},
       {"updaterID","updaterID"},
       {"mUpdateTime","updateTime"}// updateTime
   };
                        #endregion
                        break;
                }
            }
            return propertyNameMapping;
        }
        public static T convertEntity<T>(Object obj)
        {
            return FWEntityObject.convertEntity<T>(obj, SysBasicManageBll.getPropertyNameMapping(obj.GetType().Name));
        }
        public static List<T> convertEntityList<T>(List<Object> objList)
        {
            List<T> tList = new List<T>();
            foreach (var obj in objList)
            {
                tList.Add(convertEntity<T>(obj));
            }
            return tList;
        }

        #endregion

        #region 用户信息扩展  前台

        public static object getPageUserInfo(SysManageUserInfo userInfo)
        {
            SysBasicManageUserInfo sysBasicManageUserInfo = new SysBasicManageUserInfo(userInfo);
            PageUserInfo pageUserInfo = new PageUserInfo();
            pageUserInfo.ticket = sysBasicManageUserInfo.ticket;
            pageUserInfo.userID = userInfo.userID;
            pageUserInfo.userName = sysBasicManageUserInfo.userName;
            pageUserInfo.lastActionTime = userInfo.lastActionTime;
            pageUserInfo.deviceAlias = FWMD5Helper.encrypt(userInfo.userID);

            //pageUserInfo.functionCodeList = userInfo.functionCodeList;
            pageUserInfo.roleCodeList = userInfo.roleCodeList;

            //用户类型【11政府，12运维企业，13，运维人员】
            MFWUserInfo userEntity = SysBasicManageBll.queryByMUserID(userInfo.userID);
            if (userEntity != null)
            {
                pageUserInfo.userTypeCode = userEntity.mUserTypeCode;
                pageUserInfo.userTypeName = userEntity.mUserTypeName;
            }

            //获取用户分配的厂区列表
            sysBasicManageUserInfo.cantonCodeList = SysBasicManageBll.queryCantonList(userInfo.userID);
            //if (pageUserInfo.userTypeCode == DictionaryTypeCodeSettings.EnumUnitTypeCode)
            //{
            //    //运维单位信息
            //    MBLLOperationMaintenanceUnitPerson OMEntity = SysBasicManageBll.queryMOperationMaintenanceUnit(userInfo.userID);
            //    if (OMEntity != null)
            //    {
            //        //运维企业（名称、编码）  运维人员（运维人员编码、运维人员名称）
            //        pageUserInfo.operationMaintenanceUnitCode = OMEntity.operationMaintenanceUnitCode;
            //        pageUserInfo.operationMaintenanceUnitName = OMEntity.operationMaintenanceUnitName;
            //    }
            //}
            if (pageUserInfo.roleCodeList.Contains("managerRole"))
            {
                //运维单位信息
                MBLLOperationMaintenanceUnitPerson OMEntity = SysBasicManageBll.queryMOperationMaintenanceUnit(userInfo.userID);
                if (OMEntity != null)
                {
                    //运维企业（名称、编码）  运维人员（运维人员编码、运维人员名称）
                    pageUserInfo.operationMaintenanceUnitCode = OMEntity.operationMaintenanceUnitCode;
                    pageUserInfo.operationMaintenanceUnitName = OMEntity.operationMaintenanceUnitName;
                }
            }
            if (pageUserInfo.userTypeCode == DictionaryTypeCodeSettings.EnumPersonTypeCode)
            {
                MBLLOperationMaintenanceUnitPerson OMPersonEntity = SysBasicManageBll.queryMOperationMaintenancePerson(userInfo.userID);
                if (OMPersonEntity != null)
                {
                    //若为运维企业 运维人员不加载
                    pageUserInfo.operationMaintenancePersonName = OMPersonEntity.operationMaintenancePersonName;
                    pageUserInfo.operationMaintenancePersonCode = OMPersonEntity.operationMaintenancePersonCode;
                }
            }
            return pageUserInfo;
        }

        public static FWResult<bool> sendMessage(IFWUserInfo userInfo, List<string> mUserIDList, List<string> mMessageSendTypeCodeList, Message entity)
        {
            FWResult<bool> result = new FWResult<bool>();
            if (mUserIDList != null && mUserIDList.Count > 0 && mMessageSendTypeCodeList != null && mMessageSendTypeCodeList.Count > 0 && entity != null)
            {
                MFWUserInfo mFWUserInfo;
                MFWMessage mFWMessage;
                Dictionary<string, object> messageProtocol;
                string mMessageProtocol;
                foreach (string mUserID in mUserIDList)
                {
                    FWResult<MFWUserInfo> requestMFWUserInfo = FWUserInfoBll.queryByMUserID(userInfo, mUserID);
                    if (requestMFWUserInfo.status == FWResultStatus.Success && requestMFWUserInfo.data != null)
                    {
                        mFWUserInfo = requestMFWUserInfo.data;
                        foreach (string mMessageSendTypeCode in mMessageSendTypeCodeList)
                        {
                            mFWMessage = new MFWMessage();
                            messageProtocol = new Dictionary<string, object>();
                            messageProtocol["t"] = entity.title;
                            messageProtocol["c"] = entity.content;
                            messageProtocol["u"] = mFWUserInfo.mUserName;
                            messageProtocol["p"] = entity.protocol;
                            if (FWJsonHelper.isJson(entity.dataJson))
                            {
                                messageProtocol["d"] = FWJsonHelper.deserializeObject(entity.dataJson, typeof(Dictionary<string, object>));
                            }
                            else
                            {
                                messageProtocol["d"] = entity.dataJson;
                            }
                            mMessageProtocol = FWJsonHelper.serializeObject(messageProtocol);
                            switch (mMessageSendTypeCode)
                            {
                                case FWMessageSendTypeCode.SMS:
                                    if (!string.IsNullOrEmpty(mFWUserInfo.mMobilePhone))
                                    {
                                        mFWMessage.mMessageSendTypeCode = FWMessageSendTypeCode.SMS;
                                        mFWMessage.mDeviceAlias = mFWUserInfo.mMobilePhone;
                                        mFWMessage.mMessageTitle = entity.title;
                                        if (string.IsNullOrEmpty(entity.content))
                                        {
                                            mFWMessage.mMessageContent = entity.title;
                                        }
                                        else
                                        {
                                            mFWMessage.mMessageContent = entity.content;
                                        }
                                        mFWMessage.mMessageProtocol = mMessageProtocol;
                                        mFWMessage.mExpireTime = DateTime.Now.AddHours(4);
                                        FWMessageBll.insertOrUpdateByMDataID(userInfo, mFWMessage);
                                    }
                                    break;
                                case FWMessageSendTypeCode.Push:
                                    if (!string.IsNullOrEmpty(mFWUserInfo.mDeviceAlias))
                                    {
                                        mFWMessage.mMessageSendTypeCode = FWMessageSendTypeCode.Push;
                                        mFWMessage.mDeviceOperatingSystemCode = mFWUserInfo.mDeviceOperatingSystemCode;
                                        mFWMessage.mDeviceAlias = mFWUserInfo.mDeviceAlias;
                                        mFWMessage.mMessageTitle = entity.title;
                                        if (string.IsNullOrEmpty(entity.content))
                                        {
                                            mFWMessage.mMessageContent = entity.title;
                                        }
                                        else
                                        {
                                            mFWMessage.mMessageContent = entity.content;
                                        }
                                        mFWMessage.mMessageProtocol = mMessageProtocol;
                                        mFWMessage.mExpireTime = DateTime.Now.AddHours(4);
                                        FWMessageBll.insertOrUpdateByMDataID(userInfo, mFWMessage);
                                    }
                                    break;
                                case FWMessageSendTypeCode.EMail:
                                    break;
                            }
                        }
                    }
                }
            }
            result.data = true;
            result.status = FWResultStatus.Success;
            return result;
        }


        #endregion

        #region 用户信息扩展  后台
        /// <summary>
        /// 后台页面用户加载信息
        /// </summary>
        /// <param name="userInfo"></param>
        /// <returns></returns>
        public static SysBasicManageUserInfo getUserInfo(IFWUserInfo userInfo)
        {
            SysBasicManageUserInfo _userInfo = new SysBasicManageUserInfo();
            _userInfo.ticket = userInfo.ticket;
            _userInfo.userID = userInfo.userID;
            _userInfo.userName = userInfo.userName;
            _userInfo.lastActionTime = userInfo.lastActionTime;
            _userInfo.userInfoMD5 = userInfo.userInfoMD5;
            _userInfo.parentLoginUserInfoMD5 = userInfo.parentLoginUserInfoMD5;

            //_userInfo.roleCodeList = userInfo;

            //获取用户分配的厂区列表
            _userInfo.cantonCodeList = queryCantonList(userInfo.userID);
            //用户类型【10 管理员；omPerson  运维人员】
            MFWUserInfo userEntity = queryByMUserID(userInfo.userID);
            if (userEntity != null)
            {
                _userInfo.userTypeCode = userEntity.mUserTypeCode;
                _userInfo.userTypeName = userEntity.mUserTypeName;
            }
            if (_userInfo.userTypeCode == DictionaryTypeCodeSettings.EnumPersonTypeCode)
            {
                MBLLOperationMaintenanceUnitPerson OMPersonEntity = queryMOperationMaintenancePerson(userInfo.userID);
                if (OMPersonEntity != null)
                {
                    _userInfo.operationMaintenancePersonName = OMPersonEntity.operationMaintenancePersonName;
                    _userInfo.operationMaintenancePersonCode = OMPersonEntity.operationMaintenancePersonCode;
                }
            }
            return _userInfo;
        }

        #endregion

        #region 用户信息
        public static MFWUserInfo queryByMUserID(string mUserID)
        {
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            fwSqlCommand.CommandText = @" 
SELECT top 1
	tb2.[userID] [mUserID]
	,tb2.[userName] [mUserName]
    ,tb2.[userTypeCode] [mUserTypeCode]
	,tb2.[canBindDeviceCount] [mCanBindDeviceCount]
	,tb2.[isDis] [mIsDis]
    ,tb2.password  mPassword
	,tb1.[chineseName] [mChineseName]
    ,tb1.[gender] [mGender]
	,tb1.[ethnic] [mEthnic]
	,tb1.[birthdayTypeCode] [mBirthdayTypeCode]
	,tb1.[birthday] [mBirthday]
    ,tb1.[identificationCard] [mIdentificationCard]
	,tb1.[address] [mAddress]
	,tb1.[mobilePhone] [mMobilePhone]
	,tb1.[eMail] [mEMail]
FROM 
    [dbo].[FWUserLogin] tb2
    left join [dbo].[FWUserInfo] tb1 on tb1.[userID]=tb2.[userID]
where 1=1 
    and tb2.[UserID]=@UserID
            ";
            fwSqlCommand.Parameters.AddWithValue("UserID", mUserID);
            return FWSqlEntityToFWCommandStaticHelper.query<MFWUserInfo>(fwSqlCommand);
        }
        #endregion

        #region 所属运维单位
        public static MBLLOperationMaintenanceUnitPerson queryMOperationMaintenanceUnit(string userID)
        {

            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            StringBuilder sbSql = new StringBuilder();
            sbSql.AppendFormat(@"");
            fwSqlCommand.CommandText = @" SELECT unit.operationMaintenanceUnitCode,unit.operationMaintenanceUnitName 
FROM dbo.BLLOperationMaintenanceUnit unit WITH(NOLOCK) 
WHERE  ISNULL(unit.isDis,0)=0
AND unit.unitManagerID=@userID";
            fwSqlCommand.Parameters.AddWithValue("@userID", userID);
            var entity = FWSqlEntityToFWCommandStaticHelper.query<MBLLOperationMaintenanceUnitPerson>(fwSqlCommand);
            return entity;
        }
        #endregion

        #region 运维人员

        public static MBLLOperationMaintenanceUnitPerson queryMOperationMaintenancePerson(string userID)
        {

            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            StringBuilder sbSql = new StringBuilder();
            sbSql.AppendFormat(@"");
            fwSqlCommand.CommandText = @" 
SELECT person.operationMaintenancePersonCode,person.operationMaintenancePersonName
,unit.operationMaintenanceUnitCode,unit.operationMaintenanceUnitName 
FROM dbo.BLLOperationMaintenancePerson person WITH(NOLOCK)
INNER JOIN dbo.BLLOperationMaintenanceUnit unit WITH(NOLOCK) ON unit.operationMaintenanceUnitCode = person.operationMaintenanceUnitCode
WHERE ISNULL(person.isDis,0)=0 AND ISNULL(unit.isDis,0)=0
AND person.userID=@userID";
            fwSqlCommand.Parameters.AddWithValue("@userID", userID);
            var entity = FWSqlEntityToFWCommandStaticHelper.query<MBLLOperationMaintenanceUnitPerson>(fwSqlCommand);
            return entity;
        }
        #endregion

        #region 获取用户厂区列表
        public static List<string> queryCantonList(string userID)
        {

            FWSqlCommand cmd = new FWSqlCommand();
            cmd.CommandText = string.Format(@"
SELECT 
t1.dataID as mDataId,
t1.code as mCode,
t1.pCode as mpCode,
t1.name as mName,
t1.ix as mIx,
t1.[level] as mLevel,
t1.[fullCode] as  mFullCode,
t1.[fullName] as mFullName
FROM FWDictionary t1
INNER JOIN  [dbo].[FWUserMappingDictionary] t2 ON t1.dataID=t2.[dictionaryDataID]
where t1.dictionaryTypeCode = @dictionaryTypeCode AND t2.userID=@userID
order by ix");

            cmd.Parameters.AddWithValue("dictionaryTypeCode", DictionaryTypeCodeSettings.BLLCanton);
            cmd.Parameters.AddWithValue("userID", userID);
            List<MFWDictionary> entityList = FWSqlEntityToFWCommandStaticHelper.queryList<MFWDictionary>(cmd);

            List<string> cantonList = new List<string>();
            if (entityList != null)
            {
                cantonList = entityList.Select(p => p.mCode).ToList();
            }
            return cantonList;
        }

        #endregion

        #region 菜单扩展

        public static FWResult<List<MFWMenu>> queryList(IFWUserInfo userInfo, string mMenuTypeCode, string pMenuCode, Int32? isDis)
        {
            FWResult<List<MFWMenu>> result = new FWResult<List<MFWMenu>>() { };
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            #region SQL语句

            StringBuilder sqlcmd = new StringBuilder();
            sqlcmd.Append(@"SELECT
tb1.[menuTypeCode] [mMenuTypeCode]
--,tb3.[name] [mMenuTypeName]
,tb1.[pMenuCode] [mPMenuCode]
,tb1.[menuCode] [mMenuCode]
,tb1.[menuName] [mMenuName]
,case when tb1.[icon] is null then null else '1' end mIconUrl
,tb1.[iconFileFingerprint] [mIconFileFingerprint]
,tb1.[title] [mTitle]
,tb1.[isHtmlPage] [mIsHtmlPage]
,tb1.[windowName] [mWindowName]
,tb1.[url] [mUrl]
,tb1.[urlParamsJson] [mUrlParamsJson]
,tb1.[openTypeCode] [mOpenTypeCode]
--,tb5.[name] [mOpenTypeName]
,tb1.[layoutHorizontalAlignment] [mLayoutHorizontalAlignment]
,tb1.[layoutVerticalAlignment] [mLayoutVerticalAlignment]
,tb1.[layoutTop] [mLayoutTop]
,tb1.[layoutRight] [mLayoutRight]
,tb1.[layoutBottom] [mLayoutBottom]
,tb1.[layoutLeft] [mLayoutLeft]
,tb1.[layoutWidth] [mLayoutWidth]
,tb1.[layoutHeight] [mLayoutHeight]
,tb1.[infoNumber] [mInfoNumber]
,tb1.[onFocusInScriptCode] [mOnFocusInScriptCode]
,tb1.[onFocusOutScriptCode] [mOnFocusOutScriptCode]
,tb1.[ix] [mIx]
,tb1.[isDis] [mIsDis]
,menuInfo.openMeans             
FROM [dbo].[FWMenu] tb1
LEFT JOIN dbo.T_Sys_MenuExInfo menuInfo ON menuInfo.menuCode = tb1.menuCode
left join [dbo].[FWDictionary] tb3 on tb3.[pCode]='FWMenuType' and tb1.[menuTypeCode]=tb3.[code]
left join [dbo].[FWDictionary] tb5 on tb5.[pCode]='FWOpenType' and tb1.[openTypeCode]=tb5.[code] 
WHERE ISNULL(menuInfo.isDelete,0)=0 
and tb1.[menuTypeCode]=@menuTypeCode ");
            if (isDis != null)
            {
                sqlcmd.AppendFormat(" and tb1.isDis={0}", isDis);
            }
            if (!string.IsNullOrEmpty(pMenuCode))
            {
                sqlcmd.AppendFormat(" and tb1.pMenuCode='{0}' ", pMenuCode);
            }
            sqlcmd.Append(" order by tb1.ix");
            #endregion
            fwSqlCommand.CommandText = sqlcmd.ToString();
            fwSqlCommand.Parameters.AddWithValue("@menuTypeCode", mMenuTypeCode);
            result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MFWMenu>(fwSqlCommand);
            if (result.data != null && result.data.Count > 0)
            {
                foreach (var entity in result.data)
                {
                    if (!string.IsNullOrEmpty(entity.mIconUrl))
                    {
                        entity.mIconUrl = FWFileHelper.getDbFileUrl("select [icon] from [FWMenu] where [menuCode]='" + FWSqlCommandStaticHelper.checkParam(entity.mMenuCode) + "'", entity.mIconFileFingerprint);
                    }
                }
            }
            result.status = FWResultStatus.Success;
            return result;
        }

        /// <summary>
        /// 加载用户菜单
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="menuTypeCode">菜单类型</param>
        /// <param name="pMenuCode">父级菜单编码</param>
        /// <param name="isTreeData">是否返回树形</param>
        /// <returns></returns>
        public static FWResult<List<MFWMenu>> getUserMenuBasicManage(IFWUserInfo userInfo, string menuTypeCode, string pMenuCode, int? isTreeData)
        {
            FWResult<List<MFWMenu>> result = new FWResult<List<MFWMenu>>()
            {
                data = new List<MFWMenu>()
            };
            if (!isTreeData.HasValue)
            {
                isTreeData = 0;
            }
            SysManageUserInfo sysManageUserInfo = (SysManageUserInfo)userInfo;
            if (sysManageUserInfo != null)
            {

                result.data = new List<MFWMenu>();
                if (sysManageUserInfo.userID == UserLoginBll.sysAdminUserID)
                {
                    result = queryList(sysManageUserInfo, menuTypeCode, string.Empty, 0);
                }
                else
                {
                    /********************************************************************
                    *by zhangh 2015.03.11
                    *用户菜单 =（FWUserMappingMenu ∩ FWRoleMappingMenu ∩ FWMenuMappingFunction）                     
                    ********************************************************************/

                    /* FWRoleMappingMenu */
                    FWResult<List<MFWRoleMappingMenu>> requestMFWRoleMappingMenuList = FWRoleMappingMenuBll.queryList(userInfo, new QueryListMFWRoleMappingMenuParams()
                    {
                        mRoleCodeList = sysManageUserInfo.roleCodeList.ToList()
                    });

                    /* FWUserMappingMenu */
                    FWResult<List<MFWUserMappingMenu>> requestMFWUserMappingMenuList = FWUserMappingMenuBll.queryList(userInfo, new QueryListMFWUserMappingMenuParams()
                    {
                        mUserIDList = new List<string>() { sysManageUserInfo.userID }
                    });


                    FWHashSet<string> menuCodeList = new FWHashSet<string>();

                    /* 并集 用户角色菜单 */
                    if (requestMFWRoleMappingMenuList.status == FWResultStatus.Success && requestMFWRoleMappingMenuList.data != null && requestMFWRoleMappingMenuList.data.Count > 0)
                    {
                        foreach (var i in requestMFWRoleMappingMenuList.data)
                        {
                            menuCodeList.Add(i.mMenuCode);
                        }
                    }
                    /* 并集 用户菜单 */
                    if (requestMFWUserMappingMenuList.status == FWResultStatus.Success && requestMFWUserMappingMenuList.data != null && requestMFWUserMappingMenuList.data.Count > 0)
                    {
                        foreach (var i in requestMFWUserMappingMenuList.data)
                        {
                            menuCodeList.Add(i.mMenuCode);
                        }
                    }

                    /* FWMenuMappingFunction */
                    if (sysManageUserInfo.functionCodeList.Count > 0)
                    {
                        FWResult<List<MFWMenuMappingFunction>> requestMFWMenuMappingFunctionList = FWMenuMappingFunctionBll.queryList(userInfo, new QueryListMFWMenuMappingFunctionParams()
                        {
                            mFunctionCodeList = sysManageUserInfo.functionCodeList.ToList()
                        });
                        /* 并集 用户菜功能单 */
                        if (requestMFWMenuMappingFunctionList.status == FWResultStatus.Success && requestMFWMenuMappingFunctionList.data != null && requestMFWMenuMappingFunctionList.data.Count > 0)
                        {
                            var funcMenuList = requestMFWMenuMappingFunctionList.data.Select(p => p.mMenuCode).Distinct().ToList<string>();
                            foreach (var mMenuCode in funcMenuList)
                            {
                                menuCodeList.Add(mMenuCode);
                            }
                        }
                    }

                    /* 获取用户更多菜单 */
                    FWResult<List<MFWMenu>> requestMFWMenuList = queryList(userInfo, menuTypeCode, string.Empty, 0);
                    if (requestMFWMenuList.status == FWResultStatus.Success && requestMFWMenuList.data != null && requestMFWMenuList.data.Count > 0)
                    {
                        foreach (var i in requestMFWMenuList.data)
                        {
                            if (menuCodeList.Contains(i.mMenuCode))
                            {
                                result.data.Add(i);
                            }
                        }
                    }
                    result.status = FWResultStatus.Success;
                }
                if (result.status == FWResultStatus.Success && isTreeData.Value == 1)
                {
                    result.data = fwList.FWListHelper<MFWMenu>.toTree(result.data, "mPMenuCode", "mMenuCode", "mFWMenuList", "-fw-");
                }
            }
            return result;
        }
        #endregion

        #region 获取厂区树形菜单
        // 获取子集厂区
        /// </summary>
        /// <param name="userInfo">用户信息</param>
        /// <param name="xxCode">XXCode编码</param>
        /// <returns>子集厂区</returns>
        public static FWResult<List<MCantonTreeData>> querySubCantonList(IFWUserInfo userInfo, String CantonCode, string keyWord, List<string> notLevelList)
        {
            FWResult<List<MCantonTreeData>> result = new FWResult<List<MCantonTreeData>>() { };
            /* 判读厂区级别 */
            if (String.IsNullOrEmpty(CantonCode))
            {
                CantonCode = "321282";
            }
            List<MCantonTreeData> EntityList = new List<MCantonTreeData>();
            String CacheKey = fw.fwSafe.FWMD5Helper.encrypt(string.Format("subCantonList_{0}", CantonCode));
            FWSqlCommand cmd = new FWSqlCommand();
            StringBuilder sb = new StringBuilder();
            sb.AppendFormat(@" select cantonCode code,Deep level,pCantonCode parentCode,cantonName [name]
                                from [dbo].[fn_getSubCanton]('{0}') where 1=1 ", CantonCode);
            if (!string.IsNullOrEmpty(keyWord))
            {
                sb.AppendFormat(@" and (cantonCode like '{0}%' OR  cantonName like '%{0}%' )   ", keyWord);
            }
            if (notLevelList != null && notLevelList.Count > 0)
            {
                sb.AppendFormat(@" and Deep not in ( {0} )   ", FWSqlCommandStaticHelper.joinToSqlString(notLevelList));
            }
            cmd.CommandText = sb.ToString();
            EntityList = FWSqlEntityToFWCommandStaticHelper.queryList<MCantonTreeData>(cmd);
            //}
            result.data = EntityList;
            result.status = FWResultStatus.Success;
            return result;
        }

        public static List<String> specialCantonCodeConvert(List<String> cantonCodeList, List<String> paramsCantonCodeList, String userID)
        {
            if (cantonCodeList != null && cantonCodeList.Count > 0 && paramsCantonCodeList != null && paramsCantonCodeList.Count > 0)
            {
                paramsCantonCodeList = search__ChildCantonCodeList(paramsCantonCodeList).Where(e => cantonCodeList.Contains(e)).ToList();
            }
            else
            {
                paramsCantonCodeList = cantonCodeList;
            }
            return paramsCantonCodeList;
        }

        /// <summary>
        /// 获取子级厂区列表
        /// </summary>
        /// <param name="CantonCodeList">用户所属厂区</param>
        /// <returns>厂区列表</returns>
        public static List<String> search__ChildCantonCodeList(List<String> CantonCodeList)
        {
            List<String> StringList = null;
            if (CantonCodeList != null && CantonCodeList.Count > 0)
            {
                StringList = new List<string>();
                foreach (String CantonCode in CantonCodeList)
                {
                    StringList.Add(CantonCode);
                    FWResult<List<MCantonTreeData>> childList = querySubCantonList(null, CantonCode, "", null);
                    List<string> newList = new List<string>();
                    for (int i = 0; i < childList.data.Count; i++)
                    {
                        newList.Add(childList.data[i].code);
                    }
                    if (newList != null && newList.Count > 0)
                    {
                        StringList.AddRange(newList);
                    }
                }
            }
            return StringList;
        }

        public static string joinToSqlString<T>(string column, List<T> tList)
        {
            StringBuilder sb = new StringBuilder();
            if (tList != null && tList.Count > 0)
            {
                string tString;
                bool isNumber = typeof(T) == typeof(Int32) || typeof(T) == typeof(Int64) || typeof(T) == typeof(Int16) || typeof(T) == typeof(float) || typeof(T) == typeof(double) || typeof(T) == typeof(decimal);
                foreach (T t in tList)
                {
                    tString = t.ToString();
                    if (!String.IsNullOrEmpty(tString))
                    {
                        tString = FWSqlCommandStaticHelper.checkParam(tString);
                        if (isNumber)
                        {
                            sb.Append(" " + column + " like'dbo.RemoveCode00('{0}')%' or" + "");
                        }
                    }
                }
                sb.Remove(sb.Length - 2, 1);

            }
            return sb.ToString();
        }


        //列用法
        public static string CartonToStr(string column, List<string> tList)
        {
            StringBuilder sb = new StringBuilder();
            if (tList != null && tList.Count > 0)
            {
                foreach (string str in tList)
                {
                    if (!string.IsNullOrEmpty(str))
                    {
                        var strCarton = str;
                        if (str.Length > 9 && str.Substring(str.Length - 3, 3).Equals("000")) strCarton = str.Substring(0, 9);
                        sb.AppendFormat(" " + column + " like '{0}%' or" + "", strCarton);
                    }
                }
                //
                if (sb.ToString().Length > 0) sb.Remove(sb.Length - 2, 2);
            }
            return sb.ToString();
        }

        public static string CartonToStr(string column, string cantonStr)
        {
            StringBuilder sb = new StringBuilder();
            if (!String.IsNullOrEmpty(cantonStr))
            {
                string[] cList = cantonStr.Split('&');
                foreach (string str in cList)
                {
                    if (!string.IsNullOrEmpty(str))
                    {
                        var strCarton = str;
                        if (str.Length > 9 && str.Substring(str.Length - 3, 3).Equals("000")) strCarton = str.Substring(0, 9);
                        sb.AppendFormat(" " + column + " like '{0}%' or" + "", strCarton);
                    }
                }
                //
                if (sb.ToString().Length > 0) sb.Remove(sb.Length - 2, 2);
            }
            return "(" + sb.ToString() + ")";
        }

        #endregion

        public static string joinToSqlString<T>(List<T> tList)
        {
            StringBuilder sb = new StringBuilder();
            if (tList != null && tList.Count > 0)
            {
                string tString;
                bool isNumber = typeof(T) == typeof(Int32) || typeof(T) == typeof(Int64) || typeof(T) == typeof(Int16) || typeof(T) == typeof(float) || typeof(T) == typeof(double) || typeof(T) == typeof(decimal);
                foreach (T t in tList)
                {
                    tString = t.ToString();
                    if (!String.IsNullOrEmpty(tString))
                    {
                        tString = FWSqlCommandStaticHelper.checkParam(tString);
                        if (isNumber)
                        {
                            sb.Append(tString + ",");
                        }
                        else
                        {
                            sb.Append(tString + ",");
                        }
                    }
                }
                if (sb.Length > 1)
                {
                    sb.Remove(sb.Length - 1, 1);
                }
            }
            return sb.ToString();
        }

        internal static FWResult<List<MCanton>> querySubCantonListByParentCantonCode(IFWUserInfo userInfo, string parentCantonCode)
        {
            FWResult<List<MCanton>> result = new FWResult<List<MCanton>>() { };
            FWSqlCommand cmd = new FWSqlCommand();
            StringBuilder sb = new StringBuilder();
            sb.AppendFormat(@" SELECT  [code]  cantonCode
      ,[pCode]   parentCantonCode
      ,[name]  cantonName
      ,[ix] 
  FROM  [dbo].[FWDictionary]
  WHERE [dictionaryTypeCode]=  'BLLCanton'  AND [isDis]=0  AND  pcode=@parentCantonCode
ORDER BY [code]");
            if (!string.IsNullOrEmpty(parentCantonCode))
            {
                cmd.Parameters.AddWithValue("@parentCantonCode", FWSqlCommandStaticHelper.checkParam(parentCantonCode));
            }
            cmd.CommandText = sb.ToString();
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MCanton>(cmd);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.data = null;
                result.status = FWResultStatus.Failure;
                result.infoList.Add("异常：" + ex.Message);
            }

            return result;
        }


        #region 手机端数量记录
        public static FWResult<MMobileInfo> queryMobileInfo(IFWUserInfo userInfo)
        {
            FWResult<MMobileInfo> result = new FWResult<MMobileInfo>();
            if (userInfo == null || string.IsNullOrEmpty(userInfo.userID))
            {
                result.data = null;
                result.status = FWResultStatus.Error;
                result.infoList.Add("tiket 无效！");
                return result;
            }
            StringBuilder sbSql = new StringBuilder();
            sbSql.AppendFormat(@" 
select count(tt1.[taskCode]) taskAmount,sum(tt2.messageAmount) messageAmount
from 
(
SELECT  tpt.[taskCode],tpt.[planCode],tpt.[rentCode],tpt.[cultureCode],tpt.[taskType],tpt.[sampFrom],tpt.[sampTo]
,tpt.[rem],tpt.[isFinish],tpt.[operatorTime],tpt.[isDis],tpt.[taskOperator]
FROM  [dbo].[T_Dat_Plant_Task] tpt
WHERE  isnull(tpt.isdis,0)=0  AND isnull(tpt.[isFinish],0)=0
AND tpt.taskOperator IS NOT NULL AND tpt.taskOperator='{0}'
union 
SELECT  tpt.[taskCode],tpt.[planCode],tpt.[rentCode],tpt.[cultureCode],tpt.[taskType],tpt.[sampFrom],tpt.[sampTo]
,tpt.[rem],tpt.[isFinish],tpt.[operatorTime],tpt.[isDis],tpt.[taskOperator]
FROM  [dbo].[T_Dat_Plant_Task] tpt
INNER JOIN dbo.[T_Bas_FarmerLand_Rent] tfr  ON   tpt.[rentCode]=tfr.[rentCode]
INNER JOIN dbo.T_Bas_Farmer  tf   ON   tfr.[farmerCode]=tf.[farmerCode]
WHERE  isnull(tpt.isdis,0)=0  AND isnull(tpt.[isFinish],0)=0
AND tpt.taskOperator IS NULL AND tf.[userID]='{0}'
) tt1 ,
(SELECT count(1) messageAmount
FROM  [dbo].[T_Dat_Message] t1 
LEFT JOIN dbo.FWDictionary  t2  ON  t2.dictionaryTypeCode='BLLMessageType' and  t2.code=t1.[messageTypeCode] 
LEFT JOIN  dbo.T_Dat_Message_Recived t3 ON t1.[messageCode]=t3.[messageCode]
where 1=1 AND ISNULL(t1.[isDel],0)=0 AND t3.[userID] is null   AND t3.[userID] ='{0}' ) tt2
 
", userInfo.userID);
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sqlCmd.CommandText = sbSql.ToString();
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.query<MMobileInfo>(sqlCmd);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.data = null;
                result.status = FWResultStatus.Error;
            }
            return result;
        }
        #endregion

        #region 多个typeCode查询字典
        public static FWResult<Dictionary<String,List<MFWDictionary>>> queryListMFWDictionaryByTypecodes(IFWUserInfo userInfo, string[] mDictionaryTypeCode)
        {
            StringBuilder sqlBuilder = new StringBuilder();
            sqlBuilder.AppendFormat(
                @"SELECT tb1.[dataID] [mDataID],tb1.[dictionaryTypeCode] [mDictionaryTypeCode],tb3.[dictionaryTypeName] [mDictionaryTypeName],tb1.[code] [mCode],tb1.[pCode] [mPCode],tb1.[name] [mName],tb1.[level] [mLevel],tb1.[fullCode] [mFullCode],tb1.[fullName] [mFullName],tb1.[ix] [mIx],tb1.[isDis] [mIsDis] FROM [FWDictionary] tb1 left join [FWDictionaryType] tb3 on tb3.[dictionaryTypeCode]=tb1.[dictionaryTypeCode] where (tb1.[dictionaryTypeCode]='{0}'", mDictionaryTypeCode[0]);
            if (mDictionaryTypeCode.Length > 1)
            {
                for (int i = 1; i < mDictionaryTypeCode.Length; i++)
                {
                    sqlBuilder.AppendFormat(@" or tb1.[dictionaryTypeCode]='{0}'", mDictionaryTypeCode[i]);
                }
            }
            sqlBuilder.AppendFormat(@" ) and tb1.isDis='0' order by tb1.dictionaryTypeCode,tb1.ix");

            FWSqlCommand cmd = new FWSqlCommand { CommandText = sqlBuilder.ToString() };

            Dictionary<string, List<MFWDictionary>> model = new Dictionary<string, List<MFWDictionary>>();

            List<MFWDictionary> entity = FWSqlEntityToFWCommandStaticHelper.queryList<MFWDictionary>(cmd);
            foreach (var typeCode in mDictionaryTypeCode)
            {
                model.Add(typeCode,entity.Where(m =>string.Equals(m.mDictionaryTypeCode, typeCode, StringComparison.CurrentCultureIgnoreCase)).ToList());
            }

            FWResult<Dictionary<String, List<MFWDictionary>>> fwResult = new FWResult<Dictionary<String, List<MFWDictionary>>>
            {
                data = model,
                status = FWResultStatus.Success
            };

            return fwResult;
        }

        #endregion


    }
}
