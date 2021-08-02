using System.Collections.Generic;
using System.Messaging;
using fw.fwConfig;
using fw.m.operationMaintenance.bll;
using fw.m.operationMaintenance.data.entity;

namespace fw.m.operationMaintenance.data
{
    public class RealTimeData
    {
        public static List<MBLLMonitorSiteRealtimeData> _listData =
            OperationMaintenanceTaskBll.GetMonitorSiteRealtimeFactorData();

        public static List<MonitorSiteByLtc> _listMonitor = OperationMaintenanceTaskBll.GetMOnitorSiteCode();

        public static string _queuepath = FWConfigHelper.getValue("hlwx_msmqPath");

        public static string _mqttQueuepath= FWConfigHelper.getValue("mqtt_msmqPath");

        public static bool _isDealData = false;

        public static MessageQueue _mq = new MessageQueue(_queuepath);

        public static MessageQueue _mqttmq = new MessageQueue(_mqttQueuepath);

    }
}
