using fw.fwDal;
using fw.m.basicInfo.data.entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


/****************************************************************
*   Author：L
*   Time：2020/5/21 11:32:56
*   FrameVersion：4.6.1
*   Description：
*
*****************************************************************/

namespace fw.m.basicInfo.dal
{
    public class BLLGatewayRealtimeDataDal
    {
        #region =============属性============



        #endregion

        #region ===========构造函数==========



        #endregion

        #region ===========基本方法==========



        #endregion

        #region =============方法============

        public static BLLGatewayRealtimeData queryEquipmentByNo(string equipmentCode)
        {
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat($"select * from BLLGatewayRealtimeData where code='{equipmentCode}'");
            sqlCmd.CommandText = sbSql.ToString();
            try
            {
                BLLGatewayRealtimeData bLLGatewayRealtimeData = FWSqlEntityToFWCommandStaticHelper.query<BLLGatewayRealtimeData>(sqlCmd);
                return bLLGatewayRealtimeData;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public static bool insert(BLLGatewayRealtimeData data)
        {
            IFWCommand cmd = FWSqlEntityToFWCommandStaticHelper.insert<BLLGatewayRealtimeData>(data);
            return FWSqlCommandStaticHelper.ExecuteNonQuery(cmd)>0?true:false;
        }

        public static bool update(BLLGatewayRealtimeData data)
        {
            IFWCommand cmd = FWSqlEntityToFWCommandStaticHelper.update<BLLGatewayRealtimeData>(data, "code='" + data.code + "'", null);
            return FWSqlCommandStaticHelper.ExecuteNonQuery(cmd) > 0 ? true : false;
        }

        #endregion
    }
}
