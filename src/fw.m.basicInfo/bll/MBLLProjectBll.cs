using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwData;
using fw.m.Common;
using fw.m.basicInfo.data.model;
using fw.m.basicInfo.data;
using fw.fwDal;
using fw.m.sysBasicManage.data;
using fw.m.basicInfo.data.entity;
using fw.m.basicInfo.dal;
using System.Data;
using System.Data.SqlClient;
using System.Runtime.InteropServices;
using fw.fwDataTable;
using fw.fwSession;
using fw.m.sysBasicManage.bll;
using fw.m.sysBasicManage.service;

namespace fw.m.basicInfo.bll
{
    public class MBLLProjectBll
    {
        #region 监测点位项目 新增/更新
        public static FWResult<bool> insertBLLProject(SysBasicManageUserInfo userInfo, MBLLProject mEntity)
        {
            FWResult<bool> result = new FWResult<bool>();
            List<IFWCommand> BaseCommandList = new List<IFWCommand>();

            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            fwSqlTransaction.BeginTransaction();

            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();

            mEntity.projectCode = Guid.NewGuid().ToString();
            mEntity.isDel = mEntity.isDel.HasValue ? mEntity.isDel : 0;
            mEntity.createrID = userInfo.userID;
            mEntity.createTime = DateTime.Now;
            mEntity.updaterID = mEntity.createrID;
            mEntity.updateTime = mEntity.createTime;

            #region 验证重复性

            sbSql.AppendFormat(
                @" SELECT 1 FROM dbo.BLLProject WHERE cantonCode=@cantonCode AND projectCode<>@projectCode AND projectName=@projectName
 AND ISNULL(isDel,0)=0");
            sqlCmd.CommandText = sbSql.ToString();
            sqlCmd.Parameters.AddWithValue("@cantonCode", mEntity.cantonCode);
            sqlCmd.Parameters.AddWithValue("@projectCode", mEntity.projectCode);
            sqlCmd.Parameters.AddWithValue("@projectName", mEntity.projectName);
            DataTable dt = FWSqlCommandStaticHelper.ExecuteDataTable(fwSqlTransaction, sqlCmd);
            if (dt != null && dt.Rows.Count > 0)
            {
                result.infoList.Add("监测点名称已经存在");
                fwSqlTransaction.Rollback();
                return result;
            }

            #endregion

            BLLProject Entity = basicInfoBll.convertEntity<BLLProject>(mEntity);
            BaseCommandList.Add(MBLLProjectDal.insertProject(Entity));
            try
            {
                result.data = FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, BaseCommandList);
                result.status = FWResultStatus.Success;
                fwSqlTransaction.Commit();
            }
            catch
            {
                result.infoList.Add("操作失败。错误在【insertBLLProject】");
                result.status = FWResultStatus.Failure;
                return result;
            }
            return result;
        }

        public static FWResult<bool> updateBLLProject(SysBasicManageUserInfo userInfo, MBLLProject mEntity)
        {
            FWResult<bool> result = new FWResult<bool>();
            List<IFWCommand> BaseCommandList = new List<IFWCommand>();

            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            fwSqlTransaction.BeginTransaction();

            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();

            #region 验证重复性

            if (mEntity != null && !string.IsNullOrEmpty(mEntity.cantonCode) && !string.IsNullOrEmpty(mEntity.projectName) && !string.IsNullOrEmpty(mEntity.projectCode))
            {
                sbSql.AppendFormat(
                    @" SELECT 1 FROM dbo.BLLProject WHERE projectCode<>@projectCode  AND ISNULL(isDel,0)=0");
                if (!string.IsNullOrEmpty(mEntity.cantonCode))
                {
                    sbSql.AppendFormat(@" AND cantonCode=@cantonCode");
                    sqlCmd.Parameters.AddWithValue("@cantonCode", mEntity.cantonCode);
                }
                if (!string.IsNullOrEmpty(mEntity.projectName))
                {
                    sbSql.AppendFormat(@" AND projectName=@projectName");
                    sqlCmd.Parameters.AddWithValue("@projectName", mEntity.projectName);
                }
                sqlCmd.Parameters.AddWithValue("@projectCode", mEntity.projectCode);
                sqlCmd.CommandText = sbSql.ToString();
                DataTable dt = FWSqlCommandStaticHelper.ExecuteDataTable(fwSqlTransaction, sqlCmd);
                if (dt != null && dt.Rows.Count > 0)
                {
                    result.infoList.Add("监测点名称已经存在");
                    fwSqlTransaction.Rollback();
                    return result;
                }
            }
            #endregion

            mEntity.updaterID = userInfo.userID;
            mEntity.updateTime = DateTime.Now;

            BLLProject Entity = basicInfoBll.convertEntity<BLLProject>(mEntity);
            BaseCommandList.Add(MBLLProjectDal.updateProject(Entity));

            try
            {
                result.data = FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, BaseCommandList);
                result.status = FWResultStatus.Success;
                fwSqlTransaction.Commit();
            }
            catch
            {
                result.infoList.Add("操作失败。错误在【updateProject】");
                result.status = FWResultStatus.Failure;
                fwSqlTransaction.Rollback();
                fwSqlTransaction.Close();
                return result;
            }
            return result;
        }
        #endregion

        #region 监测点项目 数据查询
        public static FWResult<FWPageData<MBLLProject>> queryPageProject(IFWUserInfo userInfo, FWPageParams pageParams, QueryBasicInfoParams queryParams)
        {
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            SysBasicManageService service = new SysBasicManageService();
            List<string> cantonCodeList = new List<string>();
            if (!string.IsNullOrEmpty(queryParams.cantonCode))
            {
                cantonCodeList.Add(queryParams.cantonCode);
            }
            //if (basicUserInfo.cantonCodeList != null && basicUserInfo.cantonCodeList.Count > 0)
            //{
            //    queryParams.cantonCodeList = service.specialCantonCodeConvert(basicUserInfo.cantonCodeList,
            //       cantonCodeList, userInfo.userID);
            //}
            FWResult<FWPageData<MBLLProject>> result = new FWResult<FWPageData<MBLLProject>>();

            //Roger 增加管辖区域
            //if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            //{
            //    result.status = FWResultStatus.Failure;
            //    result.infoList.Add(constCommon.cartonErr);
            //    return result;
            //}

            StringBuilder sqlbuilder = new StringBuilder();
            sqlbuilder.AppendFormat(@"
select project.projectCode
,project.projectName
,project.projectNo
,project.cantonCode
,canton.fullName cantonName
,project.operateTime 
,project.equipmentAmount
,project.longitude
,project.latitude
,project.rem
,project.createrID
,project.createTime
,project.updaterID
,project.updateTime 
 FROM dbo.BLLProject project
LEFT JOIN dbo.FWDictionary canton ON project.cantonCode=canton.code AND canton.dictionaryTypeCode='{0}'
WHERE ISNULL(project.isDel,0)=0", DictionaryTypeCodeSettings.BLLCanton);


            //临时增加
            if (basicUserInfo.userTypeCode == "10" && basicUserInfo.userName == "changshux" &&
                basicUserInfo.roleCodeList.ToList()[0] == "managerRole")
            {
                sqlbuilder.AppendFormat(@" AND project.projectNo='X' ");
            }

            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.keyword))
                {
                    sqlbuilder.AppendFormat(@" AND project.projectName like'%{0}%'",
                        FWSqlCommandStaticHelper.checkParam(queryParams.keyword));
                }
                if (queryParams.dStart.HasValue)
                {
                    sqlbuilder.AppendFormat(@" AND project.operateTime>='{0}'", queryParams.dStart.Value.ToString("yyyy-MM-dd 00:00:00"));
                }
                if (queryParams.dEnd.HasValue)
                {
                    sqlbuilder.AppendFormat(@" AND project.operateTime<='{0}'", queryParams.dEnd.Value.ToString("yyyy-MM-dd 23:59:59"));
                }
                if (queryParams.cantonCodeList != null && queryParams.cantonCodeList.Count > 0)
                {
                    sqlbuilder.AppendFormat(@" AND project.cantonCode in ({0}) ", new FWSqlCommandHelper().joinToSqlString(queryParams.cantonCodeList));
                }
            }

            //  运维人员增加管辖区域
            if (basicUserInfo.userTypeCode == "omPerson")
            {
                var list = new List<string>();
                if (basicUserInfo.cantonCodeList != null && basicUserInfo.cantonCodeList.Count > 0)
                {
                    foreach (var item in basicUserInfo.cantonCodeList)
                    {
                        if (!list.Contains(item.Substring(0, 6)))
                        {
                            list.Add(item.Substring(0, 6));
                        }       
                    }
                }
                else
                {
                    list.Add("000000");
                }               
                sqlbuilder.AppendFormat(@" AND  project.cantonCode in ({0})  ", FWSqlCommandStaticHelper.joinToSqlString(list));
            }
            

            sqlbuilder.Append(@" order by ");
            if (pageParams.sortFieldList != null && pageParams.sortFieldList.Count > 0)
            {
                foreach (FWSortField fwSortField in pageParams.sortFieldList)
                {
                    switch (fwSortField.fieldName)
                    {
                        case "operateTime":
                            fwSortField.fieldName = "project.[operateTime]";
                            break;
                        case "cantonName":
                            fwSortField.fieldName = "project.[cantonCode]";
                            break;
                    }
                    sqlbuilder.AppendFormat(@"{0} {1},", fwSortField.fieldName,
                        fwSortField.sortType == FWSortType.Desc ? "desc" : "asc");
                }
                sqlbuilder.Remove(sqlbuilder.Length - 1, 1);
            }
            else
            {
                sqlbuilder.AppendFormat(" project.operateTime");
            }
            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MBLLProject>(fwPageProcedureParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询监测点项目列表出错。错误在：【queryPageProject】" + ex.Message.ToString());
            }
            return result;
        }

        public static FWResult<List<MBLLProject>> queryProject(SysBasicManageUserInfo userInfo, QueryBasicInfoParams queryParams)
        {
            FWResult<List<MBLLProject>> result = new FWResult<List<MBLLProject>>();
            //Roger增加管辖区域
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            //if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            //{
            //    result.status = FWResultStatus.Failure;
            //    result.infoList.Add(constCommon.cartonErr);
            //    return result;
            //}

            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@"
select project.projectCode
,project.projectName
,project.projectNo
,project.cantonCode
,canton.fullName cantonName
,project.operateTime 
,project.equipmentAmount
,project.longitude
,project.latitude
,project.rem
,project.createrID
,project.createTime
,project.updaterID
,project.updateTime 
 FROM dbo.BLLProject project
LEFT JOIN dbo.FWDictionary canton ON project.cantonCode=canton.code AND canton.dictionaryTypeCode='{0}'
WHERE ISNULL(project.isDel,0)=0
", DictionaryTypeCodeSettings.BLLCanton);
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.projectCode))
                {
                    sbSql.AppendFormat(@" AND project.projectCode='{0}'", FWSqlCommandStaticHelper.checkParam(queryParams.projectCode));
                }
                if (!string.IsNullOrEmpty(queryParams.cantonCode))
                {
                    sbSql.AppendFormat(@" AND project.cantonCode LIKE '{0}%' ", FWSqlCommandStaticHelper.checkParam(queryParams.cantonCode));
                }
            }

            //Roger增加管辖区域
            //sbSql.AppendFormat(@" AND  project.cantonCode in ({0})  ", FWSqlCommandStaticHelper.joinToSqlString(basicUserInfo.cantonCodeList));

            sqlCmd.CommandText = sbSql.ToString();
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MBLLProject>(sqlCmd);
                result.status = FWResultStatus.Success;
            }
            catch
            {
                result.infoList.Add("查询失败,错误在【queryProject】");
                result.status = FWResultStatus.Failure;
            }
            return result;
        }
        #endregion
    }
}
