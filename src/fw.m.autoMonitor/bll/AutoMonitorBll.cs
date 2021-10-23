using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwData;
using fw.m.Common;
using fw.m.autoMonitor.data.model;
using fw.fwDal;
using fw.fwSession;
using fw.m.autoMonitor.data;
using System.Data.SqlClient;
using System.Data;
using fw.fwDataTable;
using fw.m.sysBasicManage.data;
using fw.m.sysBasicManage.bll;
using fw.fwOffice;
using fw.m.sysBasicManage.service;
using fw.fwArcGIS;
using System.Reflection;
using fw.fwFile;
using fw.fwService;
using System.Collections;

namespace fw.m.autoMonitor.bll
{
    public class AutoMonitorBll
    {

        #region 映射关系

        public static FWDictionary<string, string> getPropertyNameMapping(string entityName)
        {
            FWDictionary<string, string> propertyNameMapping = new FWDictionary<string, string>();
            if (!string.IsNullOrEmpty(entityName))
            {
                switch (entityName)
                {
                    #region BLLMonitorSiteRealtimeFactorData
                    case "MMonitorSiteFactor_Realtime":
                        propertyNameMapping = new FWDictionary<String, String>() {                         
                            {"monitorSiteCode","monitorSiteCode"}
                            ,{"monitorFactorCode","monitorFactorCode"},{"monitorTime","monitorTime"}
                            ,{"monitorValue","monitorValue"} ,{"dataSource","dataSource"},{"dataState","dataState"}
                           ,{"createTime","createTime"},{"createrID","createrID"},{"updaterID","updaterID"},{"updateTime","updateTime"}
                        };
                        break;
                    #endregion
                }
            }
            return propertyNameMapping;
        }

        public static T convertEntity<T>(Object obj)
        {
            return FWEntityObject.convertEntity<T>(obj, getPropertyNameMapping(obj.GetType().Name));
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

        public static FWResult<List<MAutoMonitorStatics>> queryAutoMonitorStatics(IFWUserInfo userInfo, FWPageParams pageParams, QueryAutoMonitorParams queryParams)
        {
            FWResult<List<MAutoMonitorStatics>> result = new FWResult<List<MAutoMonitorStatics>> { };

            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            SysBasicManageService service = new SysBasicManageService();
            List<string> cantonCodeList = new List<string>();
            if (queryParams == null)
            {
                queryParams = new QueryAutoMonitorParams();
            }
            if (!string.IsNullOrEmpty(queryParams.cantonCode))
            {
                string[] cantonStrList = queryParams.cantonCode.Split('&');
                foreach (string str in cantonStrList)
                {
                    cantonCodeList.Add(str);
                }
            }
            if (!string.IsNullOrEmpty(basicUserInfo.operationMaintenancePersonCode))
            {
                queryParams.operationMaintenancePersonCode = basicUserInfo.operationMaintenancePersonCode;
            }



            #region 存储过程参数设置
            FWSqlCommandHelper cmdHelper = new FWSqlCommandHelper();
            SqlCommand cmd = new SqlCommand()
            {
                CommandType = CommandType.StoredProcedure,
                CommandText = @"rpt_MonitorStatus"
            };
            var pageIndex = 0;
            SqlParameter sParaRecordCount = new SqlParameter("@RecordCount", SqlDbType.BigInt);
            sParaRecordCount.Direction = ParameterDirection.Output;
            SqlParameter[] SqlParameterS = {  sParaRecordCount ,
                                             new SqlParameter("@pageSize",pageParams.pageSize),
                                             new SqlParameter("@pageIndex",pageParams.pageIndex),
                                             new SqlParameter("@cantonCodeList", SysBasicManageBll.joinToSqlString(cantonCodeList)),
                                             new SqlParameter("@MonitorSiteCode",queryParams.monitorSiteCode) ,
                                             new SqlParameter("@statusCode",queryParams.statusCode) ,
                                             new SqlParameter("@MonitorSiteName",string.Empty) ,   
                                             new SqlParameter("@posX",queryParams.longitude) ,
                                             new SqlParameter("@posY",queryParams.latitude) ,   
                                             new SqlParameter("@omPerson",queryParams.operationMaintenancePersonCode),
                                             new SqlParameter("@dStart",string.Empty), 
                                             new SqlParameter("@dEnd",string.Empty),
                                             new SqlParameter("@equipmentNoOrName",queryParams.equipmentKeyword),
                                             new SqlParameter("@userid",userInfo.userID),   //存储过程rpt_MonitorStatus增加userid参数，根据登录用户查询其管辖的厂区，根据厂区加载数据  songshasha 2016-11-11
                                             new SqlParameter("@projectNo", queryParams.projectNo) 
                                           };
            cmd.Parameters.AddRange(SqlParameterS);
            DataSet ds = FWSqlCommandStaticHelper.ExecuteDataSet(cmd);
            #endregion

            FWPageData<MAutoMonitorStatics> pageData = new FWPageData<MAutoMonitorStatics>();
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                result.data = FWDataTableHelper.toObjectList<MAutoMonitorStatics>(ds.Tables[0]);
                if (result.data != null && ds.Tables[2] != null && ds.Tables[2].Rows.Count > 0)
                {
                    if (queryParams.latitude.HasValue && queryParams.longitude.HasValue)
                    {
                        ds.Tables[2].Columns.Add("distance");
                        foreach (DataRow rows in ds.Tables[2].Rows)
                        {
                            if (!string.IsNullOrEmpty(rows["longitude"].ToString()) && !string.IsNullOrEmpty(rows["latitude"].ToString()))
                            {
                                rows["distance"] = FWArcGISHelper.getDistance(queryParams.longitude.Value, queryParams.latitude.Value, double.Parse(rows["longitude"].ToString()), double.Parse(rows["latitude"].ToString()));
                            }
                        }
                    }
                    FWDataTable monitorSiteLatestDataList = new FWDataTable(ds.Tables[2]);
                    result.data[0].monitorSiteLatestDataList = monitorSiteLatestDataList;
                }

                if (result.data != null && ds.Tables[3] != null && ds.Tables[3].Rows.Count > 0)
                {
                    DataTable table = ds.Tables[3];
                    result.data[0].pageCount = int.Parse(table.Rows[0]["pagecounts"].ToString());
                    result.data[0].recordCount = int.Parse(table.Rows[0]["RecordCount"].ToString());
                }

                //监测因子
                if (result.data != null && ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
                {
                    List<MMonitorSiteFactor> monitorSiteFactorList = FWDataTableHelper.toObjectList<MMonitorSiteFactor>(ds.Tables[1]);
                    result.data[0].monitorSiteFactorList = monitorSiteFactorList;
                }
                //string sql = @"SELECT monitorFactor.monitorFactorCode
                //            , allYZ.name monitorFactorName
                //            FROM dbo.BLLMonitorSiteMonitorFactor monitorFactor
                //            INNER JOIN dbo.FWDictionary allYZ
                //            ON monitorFactor.monitorFactorCode = allYZ.code
                //            AND allYZ.dictionaryTypeCode = 'BLLMonitorFactor'
                //            WHERE 1 = 1 and isnull(monitorFactor.isDis,0)= 0
                //            AND monitorFactor.monitorSiteCode = '"+ queryParams.monitorSiteCode+"'";
                //FWSqlCommand sqlcmd = new FWSqlCommand();
                //sqlcmd.CommandText = sql;
                //DataTable dtFactor= FWSqlCommandStaticHelper.ExecuteDataTable(sqlcmd);
                //if (null!= dtFactor && dtFactor.Rows.Count>0)
                //{
                //    List<MMonitorSiteFactor> monitorSiteFactorList = FWDataTableHelper.toObjectList<MMonitorSiteFactor>(dtFactor);
                //    result.data[0].monitorSiteFactorList = monitorSiteFactorList;
                //}
            }
            result.status = FWResultStatus.Success;
            return result;
        }

        public static FWResult<FWDataTable> exportAutoMonitorStatics(IFWUserInfo userInfo, FWPageParams pageParams, QueryAutoMonitorParams queryParams)
        {
            FWResult<List<MAutoMonitorStatics>> result1 = new FWResult<List<MAutoMonitorStatics>> { };
            DataTable dtable = new DataTable();
            FWResult<FWDataTable> fwdtable = new FWResult<FWDataTable>();

            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            SysBasicManageService service = new SysBasicManageService();
            List<string> cantonCodeList = new List<string>();
            if (queryParams == null)
            {
                queryParams = new QueryAutoMonitorParams();
            }
            if (!string.IsNullOrEmpty(queryParams.cantonCode))
            {
                cantonCodeList.Add(queryParams.cantonCode);
            }
            if (!string.IsNullOrEmpty(basicUserInfo.operationMaintenancePersonCode))
            {
                queryParams.operationMaintenancePersonCode = basicUserInfo.operationMaintenancePersonCode;
            }
          
            #region 存储过程参数设置
            FWSqlCommandHelper cmdHelper = new FWSqlCommandHelper();
            SqlCommand cmd = new SqlCommand()
            {
                CommandType = CommandType.StoredProcedure,
                CommandText = @"rpt_MonitorStatus"
            };
            var pageIndex = 0;
            SqlParameter sParaRecordCount = new SqlParameter("@RecordCount", SqlDbType.BigInt);
            sParaRecordCount.Direction = ParameterDirection.Output;
            SqlParameter[] SqlParameterS = {  sParaRecordCount ,
                                             new SqlParameter("@pageSize",pageParams.pageSize),
                                             new SqlParameter("@pageIndex",pageParams.pageIndex),
                                             new SqlParameter("@cantonCodeList", SysBasicManageBll.joinToSqlString(cantonCodeList)),
                                             new SqlParameter("@MonitorSiteCode",queryParams.monitorSiteCode) ,
                                             new SqlParameter("@statusCode",queryParams.statusCode) ,
                                             new SqlParameter("@MonitorSiteName",string.Empty) ,   
                                             new SqlParameter("@posX",queryParams.longitude) ,
                                             new SqlParameter("@posY",queryParams.latitude) ,   
                                             new SqlParameter("@omPerson",queryParams.operationMaintenancePersonCode),
                                             new SqlParameter("@dStart",string.Empty), 
                                             new SqlParameter("@dEnd",string.Empty),
                                             new SqlParameter("@equipmentNoOrName",queryParams.equipmentKeyword),
                                             new SqlParameter("@projectNo",queryParams.projectNo) ,
                                             new SqlParameter("@userid",userInfo.userID)   //存储过程rpt_MonitorStatus增加userid参数，根据登录用户查询其管辖的厂区，根据厂区加载数据  songshasha 2016-11-11
                                           };
            cmd.Parameters.AddRange(SqlParameterS);
            DataSet ds = FWSqlCommandStaticHelper.ExecuteDataSet(cmd);
            #endregion

            FWPageData<MAutoMonitorStatics> pageData = new FWPageData<MAutoMonitorStatics>();
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                result1.data = FWDataTableHelper.toObjectList<MAutoMonitorStatics>(ds.Tables[0]);
                if (result1.data != null && ds.Tables[2] != null && ds.Tables[2].Rows.Count > 0)
                {
                    if (queryParams.latitude.HasValue && queryParams.longitude.HasValue)
                    {
                        ds.Tables[2].Columns.Add("distance");
                        foreach (DataRow rows in ds.Tables[2].Rows)
                        {
                            if (!string.IsNullOrEmpty(rows["longitude"].ToString()) && !string.IsNullOrEmpty(rows["latitude"].ToString()))
                            {
                                rows["distance"] = FWArcGISHelper.getDistance(queryParams.longitude.Value, queryParams.latitude.Value, double.Parse(rows["longitude"].ToString()), double.Parse(rows["latitude"].ToString()));
                            }
                        }
                    }
                    FWDataTable monitorSiteLatestDataList = new FWDataTable(ds.Tables[2]);
                    dtable = ds.Tables[2];//赋值
     
                    result1.data[0].monitorSiteLatestDataList = monitorSiteLatestDataList;
                }
                if (result1.data != null && ds.Tables[3] != null && ds.Tables[3].Rows.Count > 0)
                {
                    DataTable table = ds.Tables[3];
                    result1.data[0].pageCount = int.Parse(table.Rows[0]["pagecounts"].ToString());
                    result1.data[0].recordCount = int.Parse(table.Rows[0]["RecordCount"].ToString());
                }
                //监测因子
                if (result1.data != null && ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
                {
                    List<MMonitorSiteFactor> monitorSiteFactorList = FWDataTableHelper.toObjectList<MMonitorSiteFactor>(ds.Tables[1]);
                    result1.data[0].monitorSiteFactorList = monitorSiteFactorList;
                }
            }
            for (int i = 0; i < result1.data[0].monitorSiteFactorList.Count; i++)
            {
                dtable.Columns.Add(result1.data[0].monitorSiteFactorList[i].monitorFactorName);
                foreach (DataRow dr in dtable.Rows)
                {
                    if (!string.IsNullOrEmpty(dr["Value_" + result1.data[0].monitorSiteFactorList[i].monitorFactorCode].ToString()))
                    {
                        dr[result1.data[0].monitorSiteFactorList[i].monitorFactorName] =
    dr["Value_" + result1.data[0].monitorSiteFactorList[i].monitorFactorCode].ToString()
    + "---" + dr["DateTime_" + result1.data[0].monitorSiteFactorList[i].monitorFactorCode].ToString()
    + "---" + dr["statusName_" + result1.data[0].monitorSiteFactorList[i].monitorFactorCode].ToString();
                    }
                }
            }
            fwdtable.status = FWResultStatus.Success;
            fwdtable.data = new FWDataTable(dtable);
            return fwdtable;
        }


        public static FWResult<List<MMonitorSiteFactor>> queryFactorList(IFWUserInfo userInfo, QueryAutoMonitorParams queryParams)
        {
            FWResult<List<MMonitorSiteFactor>> result = new FWResult<List<MMonitorSiteFactor>> { };
            #region 存储过程参数设置
            FWSqlCommandHelper cmdHelper = new FWSqlCommandHelper();
            SqlCommand cmd = new SqlCommand()
            {
                CommandType = CommandType.StoredProcedure,
                CommandText = @"GetSiteIGList"
            };
            SqlCommand command = new SqlCommand();
            SqlParameter[] SqlParameterS = {  
                    new SqlParameter("@MonitorSiteCode", queryParams.monitorSiteCode),
                    new SqlParameter("@bReturnStateIG", queryParams.FactorType)
                                           };
            cmd.Parameters.AddRange(SqlParameterS);
            DataSet ds = FWSqlCommandStaticHelper.ExecuteDataSet(cmd);
            #endregion

            List<MMonitorSiteFactor> list = new List<MMonitorSiteFactor>();
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                list = FWDataTableHelper.toObjectList<MMonitorSiteFactor>(ds.Tables[0]);
            }
            result.data = list;
            result.status = FWResultStatus.Success;
            return result;
        }

        public static FWResult<FWPageData<MMonitorSiteLatestData>> queryMonitorSiteLatestData(IFWUserInfo userInfo, FWPageParams pageParams, QueryAutoMonitorParams queryParams)
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

            FWResult<FWPageData<MMonitorSiteLatestData>> result = new FWResult<FWPageData<MMonitorSiteLatestData>> { };

            //Roger 2016/6/1 13:00:02 增加管辖区域
            //if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            //{
            //    result.status = FWResultStatus.Failure;
            //    result.infoList.Add(constCommon.cartonErr);
            //    return result;
            //}

            #region 存储过程参数设置
            FWSqlCommandHelper cmdHelper = new FWSqlCommandHelper();
            SqlCommand cmd = new SqlCommand()
            {
                CommandType = CommandType.StoredProcedure,
                CommandText = @"rpt_MonitorHisDataQuery"
            };
            SqlCommand command = new SqlCommand();
            int recordCount = 0;
            SqlParameter[] SqlParameterS = {   new SqlParameter("@RecordCount",recordCount),	
                    new SqlParameter("@pageSize",pageParams.pageSize),
                    new SqlParameter("@pageIndex", pageParams.pageIndex),
                    new SqlParameter("@dStart", queryParams.dStart),
                    new SqlParameter("@dEnd", queryParams.dEnd),
                    new SqlParameter("@MonitorSiteCode", queryParams.monitorSiteCode),
                    new SqlParameter("@EquipmentCode", queryParams.equipmentCode),
                    new SqlParameter("@IGCodeList", SysBasicManageBll.joinToSqlString(queryParams.monitorFactorList)),
                    new SqlParameter("@cantonCodeList",SysBasicManageBll.joinToSqlString(queryParams.cantonCodeList))
                                           };
            cmd.Parameters.AddRange(SqlParameterS);
            DataSet ds = FWSqlCommandStaticHelper.ExecuteDataSet(cmd);
            #endregion

            FWPageData<MMonitorSiteLatestData> pageData = new FWPageData<MMonitorSiteLatestData>();
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                pageData.entityList = FWDataTableHelper.toObjectList<MMonitorSiteLatestData>(ds.Tables[0]);
            }
            if (ds != null && ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
            {
                pageData.recordCount = int.Parse(ds.Tables[1].Rows[0][0].ToString());
            }
            pageData.pageSize = pageParams.pageSize;
            pageData.pageIndex = pageParams.pageIndex;
            result.data = pageData;
            result.status = FWResultStatus.Success;
            return result;
        }

        public static List<MMonitorSiteFactor_Realtime> SearchDataByOffice(string filePath)
        {
            List<MMonitorSiteFactor_Realtime> list = new List<MMonitorSiteFactor_Realtime>();
            DataTable dt = FWExcelUtil.getDataTableFromExcel(1, 0, filePath);
            if (dt != null && dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    if (string.IsNullOrEmpty(row[0].ToString()))
                    {
                        continue;
                    }
                    MMonitorSiteFactor_Realtime model = new MMonitorSiteFactor_Realtime();

                    if (!string.IsNullOrEmpty(row[0].ToString()))
                    {
                        model.monitorTime = DateTime.Parse(row[0].ToString());
                    }
                    if (!string.IsNullOrEmpty(row[1].ToString()))
                    {
                        model.monitorValue = double.Parse(row[1].ToString());
                    }
                    //if (!string.IsNullOrEmpty(row[2].ToString()))
                    //{
                    //    model.PollutantEmissions = double.Parse(row[2].ToString());
                    //}
                    list.Add(model);
                }
            }
            return list;
        }

        public static FWResult<FWFileInfo> export(FWCallParams dataSourceSettings, FWDataTable tableSettings)
        {
            FWResult<FWFileInfo> res = new FWResult<FWFileInfo>();
            object entityList = null;
            PropertyInfo pi = null;
            if (tableSettings.columns == null || tableSettings.columns.Count == 0)
            {
                res.infoList.Add("导出的列对象columnsArray为空");
            }
            object result = FWServiceHelper.call(dataSourceSettings);
            if (result.GetType().FullName.Contains("System.Data.DataTable"))
            {
                pi = result.GetType().GetProperty("data");
                DataTable tempDt = null;
                if (pi != null)
                {
                    entityList = pi.GetValue(result, null);
                    if (entityList != null)
                    {
                        tempDt = (DataTable)entityList;
                        if (tempDt != null && tempDt.Rows.Count > 0)
                        {
                            res = fw.m.common.bll.CommonBll.export(tempDt, tableSettings);
                        }
                        else
                        {
                            res.infoList.Add("查询结果为空");

                        }
                    }
                }
            }
            return res;
        }
    }
}
