using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.m.basicInfo.data.model;
using fw.fwDal;
using fw.fwData;
using fw.fwSession;
using fw.m.sysBasicManage.bll;
using fw.m.basicInfo.dal;
using fw.m.basicInfo.data.entity;
using System.Data;

namespace fw.m.basicInfo.bll
{
    public class MBLLMonitorSiteMonitorFactorBll
    {


        #region F.现场设备 因子关系
        public static FWResult<bool> insertUpdateBasMonitorSiteMonitorFactor(T_Bas_MonitorSiteMonitorFactor entity, IFWTransaction transaction)
        {
            FWResult<bool> result = new FWResult<bool>();
            try
            {
                var dbresult = MBLLMonitorSiteMonitorFactorDal.insertUpdateBasMonitorSiteMonitorFactor(entity, transaction);
                result.data = (dbresult.dbResultStatus == FWDBResultStatus.Success);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Error;
            }
            return result;
        }
        #endregion

        /// <summary>
        /// 点位设备关联因子 信息
        /// </summary>
        /// <param name="monitorSiteCode"></param>
        /// <returns></returns>
        public static List<MBLLMonitorSiteMonitorFactor> queryMonitorSiteFactor(string monitorSiteCode)
        {
            List<MBLLMonitorSiteMonitorFactor> list = new List<MBLLMonitorSiteMonitorFactor>();
            list = FWSqlEntityToFWCommandStaticHelper.queryList<MBLLMonitorSiteMonitorFactor>(MBLLMonitorSiteMonitorFactorDal.queryMonitorSiteFactor(monitorSiteCode, string.Empty));
            return list;
        }



        /// <summary>
        /// 查询因子数据字典列表
        /// </summary>
        /// <returns>因子数据字典列表</returns>
        public static List<MBLLMonitorSiteMonitorFactor> queryFactorDictionaryList()
        {
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@" SELECT IGCode monitorFactorCode,IGName monitorFactorName FROM [View_Cod_AllYZ]");
            sqlCmd.CommandText = sbSql.ToString();
            return FWSqlEntityToFWCommandStaticHelper.queryList<MBLLMonitorSiteMonitorFactor>(sqlCmd);
        }


        /// <summary>
        /// 点位监测因子  
        /// </summary>
        /// <param name="monitorSiteCode"></param>
        /// <returns></returns>
        public static List<MBas_MonitorSiteMonitorFactor> queryBasMonitorSiteFactor(string monitorSiteCode)
        {
            List<MBas_MonitorSiteMonitorFactor> list = new List<MBas_MonitorSiteMonitorFactor>();
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@"
SELECT 
monitorFactor.monitorSiteCode
,monitorFactor.monitorFactorCode,allYZ.name monitorFactorName
,monitorFactor.standardUpperLimit,monitorFactor.standardLowerLimit
,monitorFactor.rem,monitorFactor.ix ,monitorFactor.isDis 
,monitorFactor.[alarmUpperLimit]
,monitorFactor.[alarmLowerLimit]
,monitorFactor.[channelNo]
,monitorFactor.[isSwitch]
FROM dbo.BLLMonitorSiteMonitorFactor monitorFactor
INNER JOIN dbo.FWDictionary allYZ ON monitorFactor.monitorFactorCode=allYZ.code and allYZ.dictionaryTypeCode='{0}'
WHERE 1=1 and isnull(monitorFactor.isDis,0)=0 ", DictionaryTypeCodeSettings.BLLMonitorFactor);
            if (!string.IsNullOrEmpty(monitorSiteCode))
            {
                sbSql.AppendFormat(@" AND monitorFactor.monitorSiteCode=@monitorSiteCode");
                sqlCmd.Parameters.AddWithValue("@monitorSiteCode", monitorSiteCode);
            }
            sqlCmd.CommandText = sbSql.ToString();
            list = FWSqlEntityToFWCommandStaticHelper.queryList<MBas_MonitorSiteMonitorFactor>(sqlCmd);
            return list;
        }
        /// <summary>
        /// 点位设备关联因子 信息
        /// </summary>
        /// <param name="monitorSiteCode"></param>
        /// <returns></returns>
        public static List<MBLLMonitorSiteMonitorFactor> queryMonitorSiteFactorALL(string monitorSiteCode)
        {
            List<MBLLMonitorSiteMonitorFactor> list = new List<MBLLMonitorSiteMonitorFactor>();
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@"
SELECT 
monitorFactor.[dataID]
,monitorFactor.monitorSiteCode
,monitorFactor.monitorFactorCode,allYZ.name monitorFactorName
,monitorFactor.standardUpperLimit,monitorFactor.standardLowerLimit
,monitorFactor.rem,monitorFactor.ix ,monitorFactor.isDis,monitorFactor.createrID
,monitorFactor.updaterID
,monitorFactor.[channelNo]
,monitorFactor.[isSwitch] 
,monitorFactor.[alarmUpperLimit]
,monitorFactor.[alarmLowerLimit]
,monitorFactor.equipmentCode
FROM dbo.BLLMonitorSiteMonitorFactor monitorFactor
INNER JOIN dbo.FWDictionary allYZ ON monitorFactor.monitorFactorCode=allYZ.code and allYZ.dictionaryTypeCode='{0}'
WHERE 1<>1 ", DictionaryTypeCodeSettings.BLLMonitorFactor);
            if (!string.IsNullOrEmpty(monitorSiteCode))
            {
                sbSql.AppendFormat(@" or  monitorFactor.monitorSiteCode=@monitorSiteCode");
                sqlCmd.Parameters.AddWithValue("@monitorSiteCode", monitorSiteCode);
            }
            sqlCmd.CommandText = sbSql.ToString();
            list = FWSqlEntityToFWCommandStaticHelper.queryList<MBLLMonitorSiteMonitorFactor>(sqlCmd);
            return list;
        }



        #region 点位因子
        #region  现场设备 因子新增/更新
        public static FWResult<bool> inserOrUpdateMBasSiteFactor(IFWUserInfo userInfo, MBas_MonitorSiteMonitorFactor mEntity)
        {
            FWResult<bool> result = new FWResult<bool>();
            if (mEntity == null) return result;
            var entity = basicInfoBll.convertEntity<T_Bas_MonitorSiteMonitorFactor>(mEntity);
            if (mEntity.action.Equals("add"))
            {
                result = inserBasSiteFactor(userInfo, entity);

            }
            else if (mEntity.action.Equals("edit"))
            {

                result = updateBasSiteFactor(userInfo, entity, mEntity.preMonitorFactorCode);
            }
            else
            {
                result.infoList.Add("action 信息获取失败！");
            }
            return result;
            //return inserOrUpdateMBasSiteFactor(userInfo, basicInfoBll.convertEntity<T_Bas_MonitorSiteMonitorFactor>(mEntity) );
        }
        //新增
        public static FWResult<bool> inserBasSiteFactor(IFWUserInfo userInfo, T_Bas_MonitorSiteMonitorFactor entity)
        {
            FWResult<bool> result = new FWResult<bool>();
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            List<IFWCommand> BaseCommandList = new List<IFWCommand>();
            try
            {
                fwSqlTransaction.BeginTransaction();
                StringBuilder sbSql = new StringBuilder();
                FWSqlCommand sqlCmd = new FWSqlCommand();
                #region 验证重复性

                sbSql.AppendFormat(
                    @" SELECT 1 FROM dbo.BLLMonitorSiteMonitorFactor WHERE   monitorSiteCode=@monitorSiteCode AND monitorFactorCode=@monitorFactorCode ");
                sqlCmd.CommandText = sbSql.ToString();
                sqlCmd.Parameters.AddWithValue("@monitorSiteCode", entity.monitorSiteCode);
                sqlCmd.Parameters.AddWithValue("@monitorFactorCode", entity.monitorFactorCode);
                DataTable dt = FWSqlCommandStaticHelper.ExecuteDataTable(fwSqlTransaction, sqlCmd);
                if (dt != null && dt.Rows.Count > 0)
                {
                    throw new Exception("监测因子已经添加！");
                }

                #endregion

                BaseCommandList.Add(FWSqlEntityToFWCommandStaticHelper.insert<T_Bas_MonitorSiteMonitorFactor>(entity));
                var equipmentList = EquipmentBll.queryEquipmentByMonitorSite(userInfo, entity.monitorSiteCode).data;
                foreach (var equip in equipmentList)
                {
                    BLLMonitorSiteMonitorFactor addentity = new BLLMonitorSiteMonitorFactor();
                    addentity.dataID = Guid.NewGuid().ToString();
                    addentity.monitorSiteCode = entity.monitorSiteCode;
                    addentity.equipmentCode = equip.equipmentCode;
                    addentity.monitorFactorCode = entity.monitorFactorCode;
                    addentity.standardUpperLimit = entity.standardUpperLimit;
                    addentity.standardLowerLimit = entity.standardLowerLimit;
                    addentity.ix = entity.ix ?? 0;
                    addentity.isDis = 0;
                    addentity.channelNo = entity.channelNo;
                    addentity.isSwitch = entity.isSwitch;
                    addentity.createrID = userInfo.userID;
                    addentity.createTime = DateTime.Now;
                    addentity.updaterID = userInfo.userID;
                    addentity.updateTime = DateTime.Now;
                    addentity.alarmUpperLimit = entity.alarmUpperLimit;
                    addentity.alarmLowerLimit = entity.alarmLowerLimit;
                    BaseCommandList.Add(MBLLMonitorSiteMonitorFactorDal.insertMonitorSiteFactor(addentity));

                    //T_DAT_RealTime 增加对应关系
                    T_DAT_RealTime REntity = new T_DAT_RealTime();
                    REntity.PK_MCode = addentity.dataID;
                    REntity.fdtmReal = new DateTime(1990, 1, 1);
                    REntity.fintStatis = 0;
                    REntity.fbitOver = false;
                    BaseCommandList.Add(MBLLMonitorSiteDal.inserDATRealTime(REntity)); 
                }

                if (BaseCommandList != null && BaseCommandList.Count > 0)
                {
                    result.data = FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, BaseCommandList);
                }
                result.status = FWResultStatus.Success;
                fwSqlTransaction.Commit();
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Error;
                fwSqlTransaction.Rollback();
                fwSqlTransaction.Close();
            }
            return result;
        }
        public static FWResult<bool> updateBasSiteFactor(IFWUserInfo userInfo, T_Bas_MonitorSiteMonitorFactor entity, string preMonitorFactorCode)
        {
            FWResult<bool> result = new FWResult<bool>();
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            List<IFWCommand> BaseCommandList = new List<IFWCommand>();
            try
            {
                fwSqlTransaction.BeginTransaction();
                StringBuilder sbSql = new StringBuilder();
                FWSqlCommand sqlCmd = new FWSqlCommand();
                if (preMonitorFactorCode.Equals(entity.monitorFactorCode))
                {
                    //更新操作
                    BaseCommandList.Add(MBLLMonitorSiteMonitorFactorDal.updateBasMonitorSiteFactor(entity));
                    FWSqlCommand fwSqlCommand = new FWSqlCommand();
                    fwSqlCommand.CommandText = string.Format(@"
UPDATE  [dbo].[BLLMonitorSiteMonitorFactor] SET  
[standardUpperLimit] = {0},[standardLowerLimit] ={1},[updateTime] = getdate(),[channelNo] ={2},[alarmUpperLimit] = {3},[alarmLowerLimit] = {4}
 WHERE  monitorSiteCode='{5}' and  monitorFactorCode ='{6}'; 
", entity.standardUpperLimit, entity.standardLowerLimit, entity.channelNo, entity.alarmUpperLimit, entity.alarmLowerLimit,
FWSqlCommandStaticHelper.checkParam(entity.monitorSiteCode), FWSqlCommandStaticHelper.checkParam(entity.monitorFactorCode));
                    BaseCommandList.Add(fwSqlCommand);
                }
                else
                {
                    #region 新增操作
                    #region 验证重复性

                    sbSql.AppendFormat(
                        @" SELECT 1 FROM dbo.BLLMonitorSiteMonitorFactor WHERE   monitorSiteCode=@monitorSiteCode AND monitorFactorCode=@monitorFactorCode ");
                    sqlCmd.CommandText = sbSql.ToString();
                    sqlCmd.Parameters.AddWithValue("@monitorSiteCode", entity.monitorSiteCode);
                    sqlCmd.Parameters.AddWithValue("@monitorFactorCode", entity.monitorFactorCode);
                    DataTable dt = FWSqlCommandStaticHelper.ExecuteDataTable(fwSqlTransaction, sqlCmd);
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        throw new Exception("监测因子已经添加！");
                    }

                    #endregion
                    //原有因子数据删除操作
                    FWSqlCommand fwSqlCommand = new FWSqlCommand();
                    fwSqlCommand.CommandText = string.Format(@"
delete  [dbo].[T_Bas_MonitorSiteMonitorFactor]   WHERE monitorSiteCode='{0}' AND  monitorFactorCode ='{1}';
delete  [dbo].[BLLMonitorSiteMonitorFactor]   WHERE monitorSiteCode='{0}' AND  monitorFactorCode ='{1}';
delete  [dbo].[BLLMonitorSiteRealtimeFactorData] WHERE monitorSiteCode = '{0}'  AND  monitorFactorCode ='{1}';
", FWSqlCommandStaticHelper.checkParam(entity.monitorSiteCode), FWSqlCommandStaticHelper.checkParam(preMonitorFactorCode));
                    BaseCommandList.Add(fwSqlCommand);
                    BaseCommandList.Add(FWSqlEntityToFWCommandStaticHelper.insert<T_Bas_MonitorSiteMonitorFactor>(entity));
                    var equipmentList = EquipmentBll.queryEquipmentByMonitorSite(userInfo, entity.monitorSiteCode).data;
                    foreach (var equip in equipmentList)
                    {
                        BLLMonitorSiteMonitorFactor addentity = new BLLMonitorSiteMonitorFactor();
                        addentity.dataID = Guid.NewGuid().ToString();
                        addentity.monitorSiteCode = entity.monitorSiteCode;
                        addentity.equipmentCode = equip.equipmentCode;
                        addentity.monitorFactorCode = entity.monitorFactorCode;
                        addentity.standardUpperLimit = entity.standardUpperLimit;
                        addentity.standardLowerLimit = entity.standardLowerLimit;
                        addentity.ix = entity.ix ?? 0;
                        addentity.isDis = 0;
                        addentity.channelNo = entity.channelNo;
                        addentity.isSwitch = entity.isSwitch;
                        addentity.createrID = userInfo.userID;
                        addentity.createTime = DateTime.Now;
                        addentity.updaterID = userInfo.userID;
                        addentity.updateTime = DateTime.Now;
                        addentity.alarmUpperLimit = entity.alarmUpperLimit;
                        addentity.alarmLowerLimit = entity.alarmLowerLimit;
                        BaseCommandList.Add(MBLLMonitorSiteMonitorFactorDal.insertMonitorSiteFactor(addentity));
                    }
                    #endregion
                }


                if (BaseCommandList != null && BaseCommandList.Count > 0)
                {
                    result.data = FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, BaseCommandList);
                }
                result.status = FWResultStatus.Success;
                fwSqlTransaction.Commit();
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Error;
                fwSqlTransaction.Rollback();
                fwSqlTransaction.Close();
            }
            return result;
        }
        #endregion

        #region 现场设备 因子删除操作
        public static FWResult<bool> deleteMBasSiteFactorByFactorCodeList(IFWUserInfo userInfo, List<string> monitorFactorCodeList, string monitorSiteCode)
        {
            FWResult<bool> result = new FWResult<bool>();
            if (monitorFactorCodeList == null || monitorFactorCodeList.Count <= 0)
            {
                result.data = false;
                result.status = FWResultStatus.Failure;
                result.infoList.Add("参数 monitorFactorCodeList 不能为空！");
                return result;
            }
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            fwSqlCommand.CommandText = string.Format(@" 
delete  [dbo].[T_Bas_MonitorSiteMonitorFactor]   WHERE monitorSiteCode='{0}' AND  monitorFactorCode IN ( {1} );
delete  [dbo].[BLLMonitorSiteMonitorFactor]   WHERE monitorSiteCode='{0}' AND  monitorFactorCode IN ( {1} );
delete  [dbo].[BLLMonitorSiteRealtimeFactorData] WHERE monitorSiteCode = '{0}'  AND monitorFactorCode IN ( {1} ); ", FWSqlCommandStaticHelper.checkParam(monitorSiteCode), FWSqlCommandStaticHelper.joinToSqlString<string>(monitorFactorCodeList));

            try
            {
                result.data = FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlCommand) > 0;
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Error;
            }
            return result;
        }
        #endregion/// <summary>

        /// 查询点位因子列表
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="monitorSiteCode"></param>
        /// <returns></returns>
        public static FWResult<List<MBas_MonitorSiteMonitorFactor>> queryMonitorSiteFactorList(IFWUserInfo userInfo, string monitorSiteCode)
        {
            FWResult<List<MBas_MonitorSiteMonitorFactor>> result = new FWResult<List<MBas_MonitorSiteMonitorFactor>>();
            try
            {
                result.data = queryBasMonitorSiteFactor(monitorSiteCode);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        public static FWResult<MBas_MonitorSiteMonitorFactor> queryMBasSiteFactor(IFWUserInfo userInfo, string monitorSiteCode, string monitorFactorCode)
        {
            FWResult<MBas_MonitorSiteMonitorFactor> result = new FWResult<MBas_MonitorSiteMonitorFactor>();

            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@"
SELECT 
monitorFactor.monitorSiteCode
,monitorFactor.monitorFactorCode,allYZ.name monitorFactorName
,monitorFactor.standardUpperLimit,monitorFactor.standardLowerLimit
,monitorFactor.rem,monitorFactor.ix ,monitorFactor.isDis 
,monitorFactor.[alarmUpperLimit]
,monitorFactor.[alarmLowerLimit]
,monitorFactor.[channelNo]
,monitorFactor.[isSwitch]
FROM dbo.BLLMonitorSiteMonitorFactor monitorFactor
INNER JOIN dbo.FWDictionary allYZ ON monitorFactor.monitorFactorCode=allYZ.code and allYZ.dictionaryTypeCode='{0}'
WHERE 1=1 ", DictionaryTypeCodeSettings.BLLMonitorFactor);
            if (!string.IsNullOrEmpty(monitorFactorCode))
            {
                sbSql.AppendFormat(@" AND  monitorFactor.[monitorFactorCode] ='{0}' ", FWSqlCommandStaticHelper.checkParam(monitorFactorCode));
            }
            if (!string.IsNullOrEmpty(monitorSiteCode))
            {
                sbSql.AppendFormat(@" AND  monitorFactor.[monitorSiteCode] ='{0}' ", FWSqlCommandStaticHelper.checkParam(monitorSiteCode));
            }
            sqlCmd.CommandText = sbSql.ToString();
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.query<MBas_MonitorSiteMonitorFactor>(sqlCmd);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        #endregion

        #region 移动端 因子默认加载配置信息
        public static FWResult<List<MDicMonitorFactorEx>> queryMDicMonitorFactorExList(IFWUserInfo userInfo)
        {
            FWResult<List<MDicMonitorFactorEx>> result = new FWResult<List<MDicMonitorFactorEx>>();

            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@"
SELECT   
[dictionaryTypeCode] mdictionaryTypeCode
,[code] mcode
,[pCode] mpcode
,[name]  mname
,[ix]  mix
,[UName]
,[dataDesc]
,[isDefault]
,[channelNo]
,[alarmLowerLimit]
,[alarmUpperLimit]
,[standardUpperLimit]
,[standardLowerLimit]
  FROM  [dbo].[FWDictionary] a
  INNER JOIN   [dbo].[FWDictionary_BLLMonitorFactor] b ON a.[dataID]=b.[dataID]
  WHERE [dictionaryTypeCode]='BLLMonitorFactor'  AND isnull(a.isdis,0)=0 AND  isnull(B.[isDefault],0)=1  ");
            sqlCmd.CommandText = sbSql.ToString();
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MDicMonitorFactorEx>(sqlCmd);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        #endregion
    }
}
