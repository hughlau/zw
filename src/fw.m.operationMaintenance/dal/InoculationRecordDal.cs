using fw.fwDal;
using fw.fwData;
using fw.m.operationMaintenance.data;
using fw.m.operationMaintenance.data.entity;
using fw.m.operationMaintenance.data.model;
using fw.m.sysBasicManage.bll;
using fw.m.sysBasicManage.data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.operationMaintenance.dal
{
    public class InoculationRecordDal
    {
        public static IFWDBResult inserOrUpdateInoculation(BLLInoculationRecord entity, IFWTransaction transaction)
        {
            
            if (transaction != null)
            {
                return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<BLLInoculationRecord>(transaction, entity, new List<string>() { "code" }, null);
            }
            else
            {
                return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<BLLInoculationRecord>(entity, new List<string>() { "code" }, null);
            }
        }

        public static FWPageData<MBLLInoculationRecord> queryByPage(SysBasicManageUserInfo basicUserInfo
            , FWPageParams pageParams, QueryInoculationTaskParams queryParams)
        {
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.Append(@" select * from (
                                SELECT  monitorSite.monitorSiteName ,
                                        a.createTime ,
                                        a.inoculationTime ,
                                        c.jianzhizhen ,
                                        c.xingzhengcun ,
                                        c.zirancun ,
                                        a.maintainers
                                        ,dbo.GetFWDicName(a.typeId,'BLLInoculationType') name
                                        ,a.code
                                FROM    dbo.BLLInoculationRecord a
                                        INNER JOIN dbo.BLLMonitorSite monitorSite ON a.monitorSiteCode = monitorSite.monitorSiteCode
                                        INNER JOIN dbo.FWDictionary c ON monitorSite.cantonCode = c.code
                                        INNER JOIN dbo.BLLEquipment d ON monitorSite.monitorSiteCode=d.monitorSiteCode
                                WHERE   a.isDel = 0
                                ");
            stringBuilder.AppendFormat(@" AND a.stats ={0} ", FWSqlCommandStaticHelper.checkParam(queryParams.stats));
            if (!string.IsNullOrEmpty(queryParams.keyword))
            {
                stringBuilder.AppendFormat(@" AND ( monitorSite.monitorSiteName like '%{0}%' OR d.equipmentNo like'%{0}%' or c.fullName like'%{0}%' ) ", FWSqlCommandStaticHelper.checkParam(queryParams.keyword));
            }
            if (queryParams.dStart.HasValue && queryParams.dEnd.HasValue)
            {
                stringBuilder.AppendFormat(@" and (
                (a.createTime BETWEEN convert(datetime,'{0}') and  convert(datetime,'{1}'))   
                )", queryParams.dStart.Value.ToString("yyyy-MM-dd 00:00:00"), queryParams.dEnd.Value.ToString("yyyy-MM-dd 23:59:59"));
            }
            stringBuilder.AppendFormat(@" AND ({0})  ", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", basicUserInfo.cantonCodeList));
            stringBuilder.Append(@") temp order by createTime desc");
            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = stringBuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            return FWSqlEntityToFWCommandStaticHelper.queryPage<MBLLInoculationRecord>(fwPageProcedureParams);
        }

        public static FWPageData<MBLLInoculationRecord> queryStaticByPage(SysBasicManageUserInfo basicUserInfo
            , FWPageParams pageParams, QueryInoculationTaskParams queryParams)
        {
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.Append(@"  SELECT * FROM(SELECT f.name
                                    ,monitorSite.monitorSiteName
                                    ,c.code
                                    ,c.monitorSiteCode
                                    ,c.stats
                                    ,c.isDel
                                    ,c.createTime
                                    ,c.updateTime
                                    ,c.inoculationUserId
                                    ,c.inoculationTime
                                    ,c.maintainers FROM (
                                    SELECT A.*, B.value FROM
                                    (
                                      SELECT *, ntypeId = CONVERT(xml,'<root><v>' + REPLACE(typeId, ',', '</v><v>') + '</v></root>') FROM dbo.BLLInoculationRecord
                                    ) A OUTER APPLY
                                    (
                                      SELECT value = N.v.value('.', 'varchar(36)') FROM A.ntypeId.nodes('/root/v') N(v)
                                    ) B
                                    ) as c
                                    INNER JOIN dbo.BLLMonitorSite monitorSite ON c.monitorSiteCode = monitorSite.monitorSiteCode
                                    INNER JOIN dbo.BLLEquipment d ON monitorSite.monitorSiteCode=d.monitorSiteCode
                                    LEFT JOIN dbo.FWDictionary f
                                    ON c.value=f.code 
                                    WHERE  f.dictionaryTypeCode='BLLInoculationType' AND ISNULL(c.isDel,0)=0 AND c.stats =1 ");

            if (!string.IsNullOrEmpty(queryParams.typeId))
            {
                stringBuilder.AppendFormat(@" AND c.value='{0}' ", FWSqlCommandStaticHelper.checkParam(queryParams.typeId));
            }
            if (!string.IsNullOrEmpty(queryParams.keyword))
            {
                stringBuilder.AppendFormat(@" AND ( monitorSite.monitorSiteName like '%{0}%' OR d.equipmentNo like'%{0}%' or f.fullName like'%{0}%' ) ", FWSqlCommandStaticHelper.checkParam(queryParams.keyword));
            }
            if (queryParams.dStart.HasValue && queryParams.dEnd.HasValue)
            {
                stringBuilder.AppendFormat(@" and (
                (c.inoculationTime BETWEEN convert(datetime,'{0}') and  convert(datetime,'{1}'))   
                )", queryParams.dStart.Value.ToString("yyyy-MM-dd 00:00:00"), queryParams.dEnd.Value.ToString("yyyy-MM-dd 23:59:59"));
            }
            stringBuilder.AppendFormat(@" AND ({0})  ", SysBasicManageBll.CartonToStr("monitorSite.cantonCode", basicUserInfo.cantonCodeList));
            stringBuilder.Append(@") temp order by inoculationTime desc");
            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = stringBuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            return FWSqlEntityToFWCommandStaticHelper.queryPage<MBLLInoculationRecord>(fwPageProcedureParams);
        }

        public static void deleteInoculations(string codes)
        {
            string sql = @"update BLLInoculationRecord set isDel=1 where code in (" + codes + ")";
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            fwSqlCommand.CommandText = sql;
            FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlCommand);
        }

        public static MBLLInoculationRecord queryByCode(string code)
        {
            FWSqlCommand fWCommand = new FWSqlCommand();
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.Append(@"
                        SELECT  monitorSite.monitorSiteName ,
                                a.createTime ,
                                a.inoculationTime ,
                                fd.name ,
                                c.jianzhizhen ,
                                c.xingzhengcun ,
                                c.zirancun ,
                                a.maintainers
                                ,a.code,a.typeId
                        FROM  dbo.BLLInoculationRecord a
                        INNER JOIN dbo.BLLMonitorSite monitorSite ON a.monitorSiteCode = monitorSite.monitorSiteCode
                        left JOIN dbo.FWDictionary fd ON fd.dictionaryTypeCode = 'BLLInoculationType'
                                                            AND a.typeId = fd.code
                        INNER JOIN dbo.FWDictionary c ON monitorSite.cantonCode = c.code
                        INNER JOIN dbo.BLLEquipment d ON monitorSite.monitorSiteCode=d.monitorSiteCode");
            stringBuilder.AppendFormat(@" where a.code = '{0}'", FWSqlCommandStaticHelper.checkParam(code));
            fWCommand.CommandText = stringBuilder.ToString();
            return FWSqlEntityToFWCommandStaticHelper.query<MBLLInoculationRecord>(fWCommand);
        }
    }
}
