using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwDal;
using fw.m.basicInfo.data.entity;

namespace fw.m.basicInfo.dal
{
    public class MBLLProjectDal
    {
        public static IFWCommand insertProject(BLLProject mEntity)
        {
            return FWSqlEntityToFWCommandStaticHelper.insert<BLLProject>(mEntity);
        }

        public static IFWCommand updateProject(BLLProject mEntity)
        {
            return FWSqlEntityToFWCommandStaticHelper.update<BLLProject>(mEntity, "projectCode='"
                + mEntity.projectCode + "'", null);
        }
    }
}
