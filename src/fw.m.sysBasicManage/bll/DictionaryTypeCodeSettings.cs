using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.sysBasicManage.bll
{
    public class DictionaryTypeCodeSettings
    {
        #region 数据字典 FWDictionary

        /// <summary>
        /// 定时类型
        /// </summary>
        public const string BLLWaterFactor = "BLLWaterFactor";

        /// <summary>
        /// 报警接收类类型
        /// </summary>
        public const string BLLAlarmReceiveType = "BIZAlarmReceiveType";
        /// <summary>
        /// 常熟行政区化
        /// </summary>
        public const string BLLCanton = "BLLCanton";
        /// <summary>
        /// 设备状态
        /// </summary>
        public const string BLLEQStatus = "BIZEQStatus";
        /// <summary>
        /// 故障类型
        /// </summary>
        public const string BLLFaultType = "BIZFaultType";
        /// <summary>
        /// 是否生成任务
        /// </summary>
        public const string BLLIsGenerateTask = "BIZIsGenerateTask";
        /// <summary>
        /// 是否解决
        /// </summary>
        public const string BLLIsSolve = "BIZIsSolve";
        /// <summary>
        /// 任务状态
        /// </summary>
        public const string BLLTaskStatus = "BIZTaskStatus";
        /// <summary>
        /// 是否
        /// </summary>
        public const string BLLYesOrNo = "BIZYesOrNo";
        /// <summary>
        /// 监测因子
        /// </summary>
        public const string BLLMonitorFactor = "BLLMonitorFactor";

        /// <summary>
        /// 模块类型
        /// </summary>
        public const string BLLModuleType = "BLLModuleType";

        /// <summary>
        /// 数据状态
        /// </summary>
        public  const  string Code631="631";

        #endregion

        #region 任务状态 BLLOperationMaintenanceTask

        /// <summary>
        /// 待接收任务
        /// </summary>
        public const string EnumWaitReceiveStatusCode = "1";

        /// <summary>
        /// 接收任务
        /// </summary>
        public const string EnumReceiveStatusCode = "2";

        /// <summary>
        /// 退回任务编码
        /// </summary>
        public const string EnumBackReceiveStatusCode = "3";

        /// <summary>
        /// 完成任务
        /// </summary>
        public const string EnumFinishReceiveStatusCode = "4";

        /// <summary>
        /// 拒接任务
        /// </summary>
        public const string EnumRefuseReceiveStatusCode = "5";

        #endregion

        #region 用户类型 FWUserLogin

        public const string EnumUnitTypeCode = "omUnit";
        public const string EnumPersonTypeCode = "omPerson";

        #endregion

        #region 设备及零部件
        /// <summary>
        /// 设备零部件类型
        /// </summary>
        public const string BIZEQPartType = "BIZEQPartType";

        public const string BIZEQPartRecover = "BIZEQPartRecover";

        /// <summary>
        /// 设备类型
        /// </summary>
        public const string BLLEquipmentType = "BLL_EquipmentType";

        /// <summary>
        /// 设备状态   
        /// </summary>
        public const string BLLEquipmentStatus = "BLL_EquipmentStatus";


        /// <summary>
        /// 一体化提升泵   
        /// </summary>
        public const string BLLPumpType = "BLL_PumpType";
         

        /// <summary>
        /// 净化槽型号
        /// </summary>
        public const string BLLSiteType = "BLL_SiteType";

        #endregion
    }
}
