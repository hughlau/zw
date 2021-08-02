using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwDal;
using fw.m.sysBasicManage.data.model;
using fw.m.sysBasicManage.data.entity;

namespace fw.m.sysBasicManage.dal
{
    public class MMenuExDal
    {
        public static bool insertOrUpdateMMenuExByMenuCode(T_Sys_MenuExInfo entity)
        {
            return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<T_Sys_MenuExInfo>(entity, new List<string>() { "menuCode" }).dbResultStatus == FWDBResultStatus.Success;
        }

        public static IFWCommand deleteMMenuExByMenuCode(List<string> mMenuCodeList)
        {
            return FWSqlEntityToFWCommandStaticHelper.delete<T_Sys_MenuExInfo>("menuCode in (" + FWSqlCommandStaticHelper.joinToSqlString<string>(mMenuCodeList) + ")", null);
        }
    }
}
