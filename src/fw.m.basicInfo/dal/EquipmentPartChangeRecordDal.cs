using fw.fwDal;
using fw.fwData;
using fw.m.basicInfo.data;
using fw.m.basicInfo.data.entity;
using fw.m.basicInfo.data.model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.basicInfo.dal
{
    public class EquipmentPartChangeRecordDal
    {
        public static IFWDBResult inserOrUpdateBLLEquipmentByEquipmentCode(BLLEquipmentPartChangeRecord entity, IFWTransaction transaction)
        {
            if (transaction != null)
            {
                return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<BLLEquipmentPartChangeRecord>(transaction, entity, new List<string>() { "id" }, null);
            }
            else
            {
                return FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<BLLEquipmentPartChangeRecord>(entity, new List<string>() { "id" }, null);
            }
        }

        public static void UpdateIsDel(string mcode, IFWTransaction transaction)
        {
            StringBuilder sqlbuilder = new StringBuilder();
            sqlbuilder.Append(@"update BLLEquipmentPartChangeRecord set isDel=1 where monitorSiteCode='"+ mcode + "' ");
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sqlCmd.CommandText = sqlbuilder.ToString();
            FWSqlCommandStaticHelper.ExecuteNonQuery(transaction, sqlCmd);
        }

        public static FWResult<FWPageData<MBLLEquipmentPartChangeRecord>> queryPageEquipmentPartRecord(FWPageParams pageParams
            , QueryPartRecordParams queryParams)
        {
            FWResult<FWPageData<MBLLEquipmentPartChangeRecord>> result = new FWResult<FWPageData<MBLLEquipmentPartChangeRecord>>();

            StringBuilder sqlbuilder = new StringBuilder();
            sqlbuilder.AppendFormat(@"
            SELECT a.id
              ,a.monitorSiteCode
              ,a.partCode
              ,b.monitorSiteName
              ,c.partName
              ,f.name AS partType
              ,fr.name AS recoverTypeName
              ,d.userName
              ,a.changeTime
              FROM BLLEquipmentPartChangeRecord a
              INNER JOIN dbo.BLLMonitorSite b
              ON a.monitorSiteCode=b.monitorSiteCode
              INNER JOIN dbo.BLLEquipmentPart c
              ON a.partCode=c.partCode
              INNER JOIN dbo.FWDictionary f
              ON c.partType=f.code AND f.dictionaryTypeCode='BIZEQPartType'
                INNER JOIN dbo.FWDictionary fr
                ON c.recoverType=fr.code AND fr.dictionaryTypeCode='BIZEQPartRecover'
              INNER JOIN dbo.FWUserLogin d
              ON a.changeUserId=d.userID ");

            sqlbuilder.AppendFormat(@" WHERE ISNULL(a.isDel,0)=0 ");

            if (queryParams!=null)
            {
                if (!string.IsNullOrEmpty(queryParams.moniSiteCode))
                {
                    sqlbuilder.Append(" and b.monitorSiteName='" + FWSqlCommandStaticHelper.checkParam(queryParams.moniSiteCode)+"' ");
                }
                if (!string.IsNullOrEmpty(queryParams.partType))
                {
                    sqlbuilder.Append(" and c.partType=" + FWSqlCommandStaticHelper.checkParam(queryParams.partType) + " ");
                }
                if (!string.IsNullOrEmpty(queryParams.recoverType))
                {
                    sqlbuilder.Append(" and c.recoverType=" + FWSqlCommandStaticHelper.checkParam(queryParams.recoverType) + " ");
                }
                if (queryParams.dStart.HasValue && queryParams.dEnd.HasValue)
                {
                    sqlbuilder.AppendFormat(@" and a.createTime BETWEEN convert(datetime,'{0}') and  convert(datetime,'{1}')", queryParams.dStart.Value.ToString("yyyy-MM-dd 00:00:00"), queryParams.dEnd.Value.ToString("yyyy-MM-dd 23:59:59"));
                }
            }

            sqlbuilder.Append(@" order by a.createTime desc");


            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MBLLEquipmentPartChangeRecord>(fwPageProcedureParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询零部件列表出错。错误在：【queryPageEquipment】" + ex.Message.ToString());
                result.status = FWResultStatus.Error;
            }
            return result;
        }
    }

}
