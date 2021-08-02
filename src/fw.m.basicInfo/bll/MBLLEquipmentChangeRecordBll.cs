using System;
using System.Text;
using fw.fwDal;
using fw.fwData;
using fw.m.basicInfo.data;
using fw.m.basicInfo.data.entity;
using fw.m.sysBasicManage.data;

namespace fw.m.basicInfo.bll
{
    public class MBLLEquipmentChangeRecordBll
    {
        public static FWResult<FWPageData<BllEquipmentChangeList>> queryPageEquipmentChangeRecord(
            SysBasicManageUserInfo userInfo, FWPageParams pageParams, QueryTaskParams queryParams)
        {
            var result = new FWResult<FWPageData<BllEquipmentChangeList>>();
            var sqlbuilder = new StringBuilder();
            sqlbuilder.Append(
                @"SELECT [equipmentNoOld],[equipmentNoChange],[changeTime],[changerId] FROM [dbo].[BllEquipmentChangeList] where 1=1 ");
            if (!string.IsNullOrEmpty(queryParams.keywordOld))
            {
                sqlbuilder.AppendFormat(@" and equipmentNoOld like '{0}%'", queryParams.keywordOld);
            }
            if (!string.IsNullOrEmpty(queryParams.keywordChange))
            {
                sqlbuilder.AppendFormat(@" and equipmentNoChange like '{0}%'", queryParams.keywordChange);
            }
            if (queryParams.dStart.HasValue && queryParams.dEnd.HasValue)
            {
                sqlbuilder.AppendFormat(@" and changeTime BETWEEN convert(datetime,'{0}') and  convert(datetime,'{1}')",
                    queryParams.dStart.Value.ToString("yyyy-MM-dd 00:00:00"),
                    queryParams.dEnd.Value.ToString("yyyy-MM-dd 23:59:59"));
            }
            sqlbuilder.Append(" order by changeTime desc");

            var fwPageProcedureParams = new FWSqlPageProcedureParams
            {
                sql = sqlbuilder.ToString(),
                pageSize = pageParams.pageSize,
                pageIndex = pageParams.pageIndex
            };
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<BllEquipmentChangeList>(fwPageProcedureParams);
                result.status = FWResultStatus.Success;
            }

            catch (Exception ex)
            {
                result.infoList.Add("设备更换记录出错。错误在：【queryPageEquipmentChangeRecord】" + ex.Message);
            }
            return result;
        }

    }
}