using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.m.sysManage.data;
using fw.fwData;
using fw.m.sysManage.bll;
using fw.m.sysManage.data.entity;
using fw.fwDal;
using fw.m.sysManage.aop;
using fw.m.sysManage.data.model;
using fw.m.sysBasicManage.data;
using System.ServiceModel.Activation;
using System.ServiceModel;
using fw.m.sysBasicManage.data.model;
using fw.m.sysBasicManage.bll;
using fw.fwSession;
using fw.m.userLogin.data.entity;
using fw.m.basicInfo.bll;

namespace fw.m.sysBasicManage.service
{
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.PerCall, ConcurrencyMode = ConcurrencyMode.Multiple)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    [FWContextAttribute]
    public class SysBasicManageService : FWContextBoundObject, ISysBasicManageService
    {
        public FWResult<string> test(string ticket)
        {
            return new FWResult<string>() { data = "服务调用成功：" + ticket, status = FWResultStatus.Success };
        }

        #region MFWUserInfo
        public FWResult<bool> insertOrUpdateMFWUserInfoByMUserID(string ticket, MFWUserInfo mEntity)
        {
            return FWUserInfoBll.insertOrUpdateByMUserID(userInfo, mEntity);
        }

        public FWResult<bool> insertOrUpdateMFWUserInfoListByMUserID(string ticket, List<MFWUserInfo> mEntityList)
        {
            return FWUserInfoBll.insertOrUpdateByMUserID(userInfo, mEntityList);
        }

        public FWResult<bool> updateMFWUserInfoByTicket(string ticket, MFWUserInfo mEntity)
        {
            mEntity.mUserID = userInfo.userID;
            return FWUserInfoBll.insertOrUpdateByMUserID(userInfo, mEntity);
        }

        public FWResult<MFWUserInfo> queryMFWUserInfoByMUserID(string ticket, string mUserID)
        {
            return FWUserInfoBll.queryByMUserID(userInfo, mUserID);
        }

        public FWResult<MFWUserInfo> queryMFWUserInfoByTicket(string ticket)
        {
            return queryMFWUserInfoByMUserID(ticket, userInfo.userID);
        }

        [FWAttribute(isVerifyRight = 1, isWriteLog = 1, isFunction = 1)]
        public FWResult<List<Contact>> queryListContact(string ticket, int orgFullNameLevel)
        {
            return FWUserInfoBll.queryListContact(userInfo, orgFullNameLevel);
        }

        public FWResult<FWPageData<MFWUserInfo>> queryPageMFWUserInfo(string ticket, FWPageParams pageParams, QueryPageMFWUserInfoParams queryParams)
        {
            return FWUserInfoBll.queryPage(userInfo, pageParams, queryParams);
        }

        /// <summary>
        /// 密码重置
        /// </summary>
        /// <param name="mUserIDList"></param>
        /// <returns></returns>
        public FWResult<string> ResetUserPwdByMUserIDList(string ticket, List<string> mUserNameList)
        {
            return FWUserInfoBll.ResetUserPwdByMUserIDList(userInfo, mUserNameList);
        }


        #endregion

        public FWResult<bool> sendMessage(string ticket, List<string> mUserIDList, List<string> mMessageSendTypeCodeList, Message entity)
        {
            return SysBasicManageBll.sendMessage(userInfo, mUserIDList, mMessageSendTypeCodeList, entity);
        }








        #region 扩展用户信息

        /// <summary>
        ///扩展用户信息
        /// </summary>
        /// <param name="ticket">用户信息</param>
        /// <returns>扩展用户信息</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<SysBasicManageUserInfo> getUserInfo(IFWUserInfo userInfo)
        {
            FWResult<SysBasicManageUserInfo> result = new FWResult<SysBasicManageUserInfo>();
            if (userInfo != null)
            {
                result.data = SysBasicManageBll.getUserInfo(userInfo);
            }
            result.status = FWResultStatus.Success;
            return result;
        }

        #endregion

        #region 菜单扩展
        /// <summary>
        /// 获取用户菜单信息可扩展表
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="menuTypeCode"></param>
        /// <param name="isTreeData"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MFWMenu>> getUserMenuBasicManage(String ticket, string menuTypeCode, int? isTreeData)
        {
            return SysBasicManageBll.getUserMenuBasicManage(userInfo, menuTypeCode, string.Empty, isTreeData);
        }

        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MFWMenu>> queryMenuList(string ticket, string keyword)
        {
            FWResult<List<MFWMenu>> result = new FWResult<List<MFWMenu>>();
            var rlt = fw.m.sysManage.bll.SysManageBll.getUserMenu(userInfo, "mainMenu", 1);
            result.data = rlt.data[0].mFWMenuList[1].mFWMenuList;
            result.status = FWResultStatus.Success;
            return result;
        }

        #endregion

        #region 菜单扩展信息
        /// <summary>
        /// 插入或更新菜单扩展信息
        /// </summary>
        /// <param name="ticket">登入凭证</param>
        /// <param name="mEntity">操作实体</param>
        /// <returns>执行结果</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> insertOrUpdateMMenuExByMenuCode(string ticket, MMenuEx mEntity)
        {
            return MMenuExBll.insertOrUpdateMMenuExByMenuCode(userInfo, mEntity);
        }

        /// <summary>
        /// 删除菜单扩展信息
        /// </summary>
        /// <param name="ticket">登入凭证</param>
        /// <param name="mMenuCodeList">菜单主键列表</param>
        /// <returns>操作结果状态</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> deleteMMenuExByMenuCode(string ticket, List<string> mMenuCodeList)
        {
            return MMenuExBll.deleteMMenuExByMenuCode(userInfo, mMenuCodeList);
        }

        /// <summary>
        /// 查询菜单扩展信息
        /// </summary>
        /// <param name="ticket">登入凭证</param>
        /// <param name="mMenuCode">菜单主键</param>
        /// <returns>菜单扩展信息实体</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<MMenuEx> queryMMenuEx(string ticket, string mMenuCode)
        {
            return MMenuExBll.queryMMenuEx(userInfo, mMenuCode);
        }

        /// <summary>
        /// 查询菜单扩展信息列表
        /// </summary>
        /// <param name="ticket">登入凭证</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>菜单扩展信息实体列表</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MMenuEx>> queryMMenuExList(string ticket, QueryMMenuExParams queryParams)
        {
            return MMenuExBll.queryMMenuExList(userInfo, queryParams);
        }

        /// <summary>
        /// 分页查询菜单扩展信息
        /// </summary>
        /// <param name="ticket">登入凭证</param>
        /// <param name="pageParams">分页参数</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns>菜单扩展信息分页列表</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWPageData<MMenuEx>> queryPageMMenuEx(string ticket, FWPageParams pageParams, QueryMMenuExParams queryParams)
        {
            return MMenuExBll.queryPageMMenuEx(userInfo, pageParams, queryParams);
        }

        #endregion

        #region 行政区
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MCantonTreeData>> queryCantonList(string ticket, string keyWord, List<string> notLevelList)
        {
            return SysBasicManageBll.querySubCantonList(null, null, keyWord, notLevelList);
        }


        /// <summary>
        /// 根据父级行政区 获取列表
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="parentCantonCode"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MCanton>> querySubCantonListByParentCantonCode(string ticket, string parentCantonCode)
        {
            return SysBasicManageBll.querySubCantonListByParentCantonCode(userInfo, parentCantonCode);
        }

        /// <summary>
        /// 根据层级进行行政区过滤 返回节点数据
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="userID"></param>
        /// <param name="patentCantonCode"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MFWCantonData>> queryCantonListFilter(string ticket, string userID)
        {
            return MCantonBll.queryCantonListFilter(userInfo, userID);
        }

        #endregion


        #region 用户行政区相关方法 
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MFWUserMappingDictionary>> queryFWUserMappingCantonCodeList(string ticket,
            string userID)
        {
            return FWUserMappingDictionaryBll.queryFWUserMappingCantonCodeList(userInfo, userID);
        }
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> updateFWUserMappingCantonCodeListByMUserID(string ticket, string userID,
            List<string> insertMDictionaryDataIDList)
        {
            return FWUserMappingDictionaryBll.updateFWUserMappingCantonCodeListByMUserID(userInfo, userID, insertMDictionaryDataIDList);
        }


        /// <summary>
        /// 加载指定行政区及其子行政区方法
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="cantonCode"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MFWCantonData>> queryCantonListByTwoLvl(string ticket, string cantonCode)
        {
            return MCantonBll.queryCantonListByTwoLvl(userInfo, cantonCode);
        }

        /// <summary>
        /// 加载指定行政区及其子行政区方法
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="cantonCode"></param>
        /// <returns></returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MFWCantonData>> queryCantonListByThreeLvl(string ticket, string cantonCode)
        {
            return MCantonBll.queryCantonListByThreeLvl(userInfo, cantonCode);
        }


        #endregion

        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MFWUserMappingDictionary>> queryListFWUserMappingDictionary(string ticket,
            QueryListMFWUserMappingDictionaryParams queryParams)
        {
            return FWUserMappingDictionaryBll.queryList(userInfo, queryParams);
        }

        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<bool> updateByMUserIDListInsertMDictionaryDataIDListDeleteMDictionaryDataIDList(
            string ticket, List<string> mUserIDList, List<string> insertMDictionaryDataIDList,
            List<string> deleteMDictionaryDataIDList)
        {
            return FWUserMappingDictionaryBll.updateByMUserIDListInsertMDictionaryDataIDListDeleteMDictionaryDataIDList(userInfo, mUserIDList, insertMDictionaryDataIDList, deleteMDictionaryDataIDList);
        }

        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MFWDictionary>> queryMDictionaryList(string ticket, string pCode)
        {
            return FWUserMappingDictionaryBll.queryMDictionaryList(userInfo, pCode);
        }


        #region 行政区帮助方法

        /// <summary>
        /// 根据传入的行政区列表用户所属行政区
        /// </summary>
        /// <param name="cantonCodeList">userInfo.cantonCodeList</param>
        /// <param name="paramsCantonCodeList">传入参数</param>
        /// <param name="userID">用户编码</param>
        /// <returns>用户所属行政区</returns>
        public List<String> specialCantonCodeConvert(List<String> cantonCodeList, List<String> paramsCantonCodeList, String userID)
        {
            return MCantonBll.specialCantonCodeConvert(cantonCodeList, paramsCantonCodeList, userID);
        }

        #endregion
         
        #region 手机端数量记录
        public FWResult<MMobileInfo> queryMobileInfo(string ticket)
        {
            return SysBasicManageBll.queryMobileInfo(userInfo);
        }

        #endregion

        #region 行政区字典查询方法
        /// <summary>
        /// 获取树的数据集合（包括子集）
        /// </summary>
        /// <param name="ticket">凭证</param>
        /// <param name="pCode">父级编码</param>
        /// <returns>返回值</returns>
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<FWDataTable> getCantonDicData(string ticket, string pCode)
        {
            return MCantonBll.getCantonDicData(userInfo,pCode);
        }

        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<List<MFWDictionary>> getCantonDicDataByMobile(string ticket, string pCode)
        {
            return MCantonBll.getCantonDicDataByMobile(userInfo, pCode);
        }
        #endregion

        #region 多个typeCode查询字典
        [FWAttribute(isVerifyRight = 0, isWriteLog = 0, isFunction = 0)]
        public FWResult<Dictionary<String, List<MFWDictionary>>> queryListMFWDictionaryByTypecodes(string ticket, string mDictionaryTypeCode)
        {
            string[] mdtc = mDictionaryTypeCode.Split(',');
            return SysBasicManageBll.queryListMFWDictionaryByTypecodes(userInfo,mdtc);
        }
        #endregion

        /// <summary>
        /// 查询运维单位管理员
        /// </summary>
        /// <returns></returns>
        public FWResult<List<FWUserLogin>> queryUnitManager(string ticket)
        {
            return FWUserInfoBll.queryUnitManagerList();
        }

        public FWResult<bool> deleteMFWUserRoleByMDataIDList(string ticket, List<string> mDataIDList)
        {
            FWResult<bool> fWResult = new FWResult<bool>();
            if (FWUserInfoBll.isContainSystemRole(mDataIDList))
            {
                fWResult.data = false;
                fWResult.infoList.Add("包含系统角色，不能删除！");
                return fWResult;
            }
            else
            {
                try
                {
                    FWUserRoleBll.deleteByMDataIDList(base.userInfo, mDataIDList);
                    fWResult.data = true;
                }
                catch (Exception ex)
                {
                    fWResult.data = false;
                    fWResult.infoList.Add("该角色正在使用，无法删除！");
                    return fWResult;
                }
                return fWResult;
            }
        }
        
    }
}
