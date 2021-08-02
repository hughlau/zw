using fw.fwData;
using fw.m.basicInfo.dal;
using fw.m.basicInfo.data;
using fw.m.basicInfo.data.model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.basicInfo.bll
{
    public class EquipmentPartChangeRecordBLL
    {
        public static FWResult<FWPageData<MBLLEquipmentPartChangeRecord>> queryPage(FWPageParams pageParams
            , QueryPartRecordParams queryParams)
        {
            return EquipmentPartChangeRecordDal.queryPageEquipmentPartRecord(pageParams, queryParams);
        }

       
    }
}
