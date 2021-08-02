using fw.fwDal;
using fw.fwData;
using fw.m.basicInfo.data.entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.basicInfo.dal
{
    public class BLLReleaseNoteDal
    {
        public static List<BLLReleaseNote> queryAll(string type)
        {
            FWResult<FWPageData<BLLReleaseNote>> result = new FWResult<FWPageData<BLLReleaseNote>>();

            StringBuilder sqlbuilder = new StringBuilder();

            sqlbuilder.Append(@"
                SELECT  
	               [Id]
                  ,[type]
                  ,[version]
                  ,[description]
                  ,[createTime]
                FROM [jjdevelop].[dbo].[BLLReleaseNote] where type="+type);
            sqlbuilder.Append(@" order by createTime asc");
            FWSqlCommand cmd = new FWSqlCommand();
            cmd.CommandText = sqlbuilder.ToString();
            return FWSqlEntityToFWCommandStaticHelper.queryList<BLLReleaseNote>(cmd);
        }

        public static FWPageData<BLLReleaseNote> queryPageData(string userId, FWPageParams pageParams)
        {
            FWResult<FWPageData<BLLReleaseNote>> result = new FWResult<FWPageData<BLLReleaseNote>>();

            StringBuilder sqlbuilder = new StringBuilder();

            sqlbuilder.AppendFormat(@"
                SELECT  
	               [Id]
                  ,[type]
                  ,[version]
                  ,[description]
                  ,[createTime]
                FROM [dbo].[BLLReleaseNote] ");
            sqlbuilder.Append(@" order by createTime desc");

            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            return FWSqlEntityToFWCommandStaticHelper.queryPage<BLLReleaseNote>(fwPageProcedureParams);
        }
    }
}
