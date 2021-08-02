using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwData;
using fw.m.autoMonitor.data.model;
using fw.fwDal;
using fw.fwSession;
using fw.m.autoMonitor.data;
using System.Data.SqlClient;
using System.Data;
using fw.fwDataTable;
using fw.m.sysBasicManage.data;

namespace fw.m.autoMonitor.bll
{
    public class AutoMonitorBll
    {
        public static FWResult<List<MAutoMonitorStatics>> queryAutoMonitorStatics(IFWUserInfo userInfo, QueryAutoMonitorParams queryParams)
        {
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            //if (basicUserInfo.cantonCodeList != null && basicUserInfo.cantonCodeList.Count > 0)
            //{
            //    queryParams.cantonCodeList = basicUserInfo.cantonCodeList;
            //}

            FWResult<List<MAutoMonitorStatics>> result = new FWResult<List<MAutoMonitorStatics>> { };
            #region 存储过程参数设置
            FWSqlCommandHelper cmdHelper = new FWSqlCommandHelper();
            SqlCommand cmd = new SqlCommand()
            {
                CommandType = CommandType.StoredProcedure,
                CommandText = @"rpt_MonitorRealDataQuery_s"
            };
            SqlCommand command = new SqlCommand();
            SqlParameter[] SqlParameterS = { 
                                             new SqlParameter("@cantonCodeList",new FWSqlCommandHelper().joinToSqlString(queryParams.cantonCodeList))
                                           };
            cmd.Parameters.AddRange(SqlParameterS);
            DataSet ds = FWSqlCommandStaticHelper.ExecuteDataSet(cmd);
            #endregion

            FWPageData<MAutoMonitorStatics> pageData = new FWPageData<MAutoMonitorStatics>();
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                result.data = FWDataTableHelper.toObjectList<MAutoMonitorStatics>(ds.Tables[0]);
                if (result.data != null && ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
                {
                    FWDataTable monitorSiteLatestDataList = new FWDataTable(ds.Tables[1]);
                    result.data[0].monitorSiteLatestDataList = monitorSiteLatestDataList;
                }
                if (result.data != null && ds.Tables[2] != null && ds.Tables[2].Rows.Count > 0)
                {
                    List<MMonitorSiteFactor> monitorSiteFactorList = FWDataTableHelper.toObjectList<MMonitorSiteFactor>(ds.Tables[2]);
                    result.data[0].monitorSiteFactorList = monitorSiteFactorList;
                }
            }
            result.status = FWResultStatus.Success;
            return result;
        }

        public static FWResult<FWPageData<MMonitorSiteLatestData>> queryMonitorSiteLatestData(IFWUserInfo userInfo,FWPageParams pageParams, QueryAutoMonitorParams queryParams)
        {
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            if (basicUserInfo.cantonCodeList != null && basicUserInfo.cantonCodeList.Count > 0)
            {
                queryParams.cantonCodeList = basicUserInfo.cantonCodeList;
            }

            FWResult<FWPageData<MMonitorSiteLatestData>> result = new FWResult<FWPageData<MMonitorSiteLatestData>> { };
            #region 存储过程参数设置
            FWSqlCommandHelper cmdHelper = new FWSqlCommandHelper();
            SqlCommand cmd = new SqlCommand()
            {
                CommandType = CommandType.StoredProcedure,
                CommandText = @"rpt_MonitorRealDataQuery"
            };
            SqlCommand command = new SqlCommand();
            int recordCount = 0;
            SqlParameter[] SqlParameterS = {   new SqlParameter("@RecordCount",recordCount),	
                    new SqlParameter("@pageSize",pageParams.pageSize),
                    new SqlParameter("@pageIndex", pageParams.pageIndex),
                    new SqlParameter("@dStart", queryParams.dStart),
                    new SqlParameter("@dEnd", queryParams.dEnd),
                    new SqlParameter("@MonitorSiteCode", queryParams.monitorSiteCode),
                    new SqlParameter("@cantonCodeList",new FWSqlCommandHelper().joinToSqlString(queryParams.cantonCodeList))
                                           };
            cmd.Parameters.AddRange(SqlParameterS);
            DataSet ds = FWSqlCommandStaticHelper.ExecuteDataSet(cmd);
            #endregion

            FWPageData<MMonitorSiteLatestData> pageData = new FWPageData<MMonitorSiteLatestData>();
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                pageData.entityList = FWDataTableHelper.toObjectList<MMonitorSiteLatestData>(ds.Tables[0]);
            }
            pageData.recordCount = string.IsNullOrEmpty(SqlParameterS[0].Value.ToString()) ? 0 : (Int64)Convert.ToInt32(SqlParameterS[0].Value.ToString());
            pageData.pageSize = pageParams.pageSize;
            pageData.pageIndex = pageParams.pageIndex;
            result.data = pageData;
            result.status = FWResultStatus.Success;
            return result;
        }
    }
}
