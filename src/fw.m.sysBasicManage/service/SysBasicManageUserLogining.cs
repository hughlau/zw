using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwConfig;
using fw.m.userLogin.data;
using fw.fwData;
using fw.fwReflection;
using fw.m.userLogin.data.entity;
using fw.fwSession;
using fw.m.sysBasicManage.data;
using fw.m.sysManage.data;
using fw.m.sysBasicManage.bll;
using fw.m.sysBasicManage.data.model;
using fw.m.sysManage.bll;
using fw.m.sysManage.data.entity;
using fw.fwDal;

namespace fw.m.sysBasicManage.service
{
    public class SysBasicManageUserLogining : IUserLogining
    {

        public FWResult<bool> insertUser(IFWUserInfo userInfo, FWUserLogin entity, IFWTransaction transaction)
        {
            FWResult<bool> result = new FWResult<bool>();
            SysManageUserInfo sysManageUserInfo = new SysManageUserInfo((UserInfo)userInfo);

            var userRole = SysManageBll.insertUserDefaultRoleCode;
            if (entity.userTypeCode == DictionaryTypeCodeSettings.EnumUnitTypeCode)
            {
                userRole = FWConfigHelper.getValue("defaultOMUnitUserRoleCode");
            }
            else if (entity.userTypeCode == DictionaryTypeCodeSettings.EnumPersonTypeCode)
            {
                userRole = FWConfigHelper.getValue("defaultOMUnitPersonRoleCode");
            }

            //添加默认角色
            FWResult<bool> request = FWUserMappingRoleBll.insert(userInfo, new FWUserMappingRole()
            {
                userID = entity.userID,
                roleCode = userRole
            }, transaction);
            if (request.status == FWResultStatus.Success && request.data)
            {
                result.data = true;
                result.status = FWResultStatus.Success;
            }
            else
            {
                result.data = false;
                result.infoList.AddRange(request.infoList);
            }
            return result;
        }

        public FWResult<IFWUserInfo> logining(IFWUserInfo userInfo)
        {
            FWResult<IFWUserInfo> result = new FWResult<IFWUserInfo>();
            SysBasicManageUserInfo sysBasicManageUserInfo = new SysBasicManageUserInfo((SysManageUserInfo)userInfo);

            //用户类型【11政府，12运维企业，13，运维人员】
            MFWUserInfo userEntity = SysBasicManageBll.queryByMUserID(userInfo.userID);
            if (userEntity != null)
            {
                sysBasicManageUserInfo.userTypeCode = userEntity.mUserTypeCode;
                sysBasicManageUserInfo.userTypeName = userEntity.mUserTypeName;
            }

            //获取用户分配的行政区列表
            sysBasicManageUserInfo.cantonCodeList = SysBasicManageBll.queryCantonList(userInfo.userID);
            //if (sysBasicManageUserInfo.userTypeCode == DictionaryTypeCodeSettings.EnumUnitTypeCode)
            //{
            //    //运维单位信息
            //    MBLLOperationMaintenanceUnitPerson OMEntity = SysBasicManageBll.queryMOperationMaintenanceUnit(userInfo.userID);
            //    if (OMEntity != null)
            //    {
            //        //运维企业（名称、编码）  运维人员（运维人员编码、运维人员名称）
            //        sysBasicManageUserInfo.operationMaintenanceUnitCode = OMEntity.operationMaintenanceUnitCode;
            //        sysBasicManageUserInfo.operationMaintenanceUnitName = OMEntity.operationMaintenanceUnitName;
            //    }
            //}
            if (sysBasicManageUserInfo.roleCodeList.Contains("managerRole"))
            {
                //运维单位信息
                MBLLOperationMaintenanceUnitPerson OMEntity = SysBasicManageBll.queryMOperationMaintenanceUnit(userInfo.userID);
                if (OMEntity != null)
                {
                    //运维企业（名称、编码）  运维人员（运维人员编码、运维人员名称）
                    sysBasicManageUserInfo.operationMaintenanceUnitCode = OMEntity.operationMaintenanceUnitCode;
                    sysBasicManageUserInfo.operationMaintenanceUnitName = OMEntity.operationMaintenanceUnitName;
                }
            }
            if (sysBasicManageUserInfo.userTypeCode == DictionaryTypeCodeSettings.EnumPersonTypeCode)
            {
                MBLLOperationMaintenanceUnitPerson OMPersonEntity = SysBasicManageBll.queryMOperationMaintenancePerson(userInfo.userID);
                if (OMPersonEntity != null)
                {
                    //若为运维企业 运维人员不加载
                    sysBasicManageUserInfo.operationMaintenancePersonName = OMPersonEntity.operationMaintenancePersonName;
                    sysBasicManageUserInfo.operationMaintenancePersonCode = OMPersonEntity.operationMaintenancePersonCode;
                }
            }
            result.data = sysBasicManageUserInfo;
            result.status = FWResultStatus.Success;
            return result;
        }



    }
}
