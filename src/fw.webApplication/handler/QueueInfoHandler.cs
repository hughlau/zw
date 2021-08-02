using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading;
using fw.m.operationMaintenance.bll;
using fw.m.operationMaintenance.data;
using System.Messaging;
using fw.m.operationMaintenance.data.model;

namespace fw.webApplication.handler
{
    public class QueueInfoHandler
    {
        public readonly static QueueInfoHandler instance = new QueueInfoHandler();
        private QueueInfoHandler(){}

        public void Start()//启动
        {
            Thread thread = new Thread(threadStart);
            thread.IsBackground = true;
            thread.Start();

            Thread mqttThread = new Thread(mqttThreadStart);
            mqttThread.IsBackground = true;
            mqttThread.Start();

        }

        private void threadStart()
        {
            try
            {
                while (QueueManger.IsQueueExist(RealTimeData._queuepath))
                {
                    if (QueueManger.IsHaveMessage(RealTimeData._queuepath))
                    {
                        ScanQueue();

                    }
                    else
                    {
                        Thread.Sleep(3000);
                    }
                }
            }
            catch (Exception ex)
            {
                string logPath = fwConfig.FWConfigHelper.getValue("Queue_LogPath");
                OperationMaintenanceTaskBll.WriteLog(ex.Message, logPath);
            }
            
        }
 
        private void mqttThreadStart()
        {
            try
            {
                while (QueueManger.IsQueueExist(RealTimeData._mqttQueuepath))
                {
                    if (QueueManger.IsHaveMessage(RealTimeData._mqttQueuepath))
                    {
                        ScanMqttqueue();

                    }
                    else
                    {
                        Thread.Sleep(3000);
                    }
                }
            }
            catch (Exception ex)
            {
                string logPath = fwConfig.FWConfigHelper.getValue("Queue_LogPath");
                OperationMaintenanceTaskBll.WriteLog(ex.Message, logPath);
            }
        }


        private void ScanQueue()
        {
            var mq = new MessageQueue(RealTimeData._queuepath);
            while (QueueManger.IsHaveMessage(RealTimeData._queuepath))
            {
                HTTPRealTimeData model = QueueManger.ReceiveMessage<HTTPRealTimeData>(mq);
                if (model.device_category==DeviceCate.device)
                {
                    OperationMaintenanceTaskBll.generateHLWXTaskAndSendMessage(model);
                }
                else if(model.device_category==DeviceCate.gateWay)
                {
                    OperationMaintenanceTaskBll.generateHLWXGatewayMessage(model);
                }
            }
        }

        private void ScanMqttqueue()
        {
            var mq = new MessageQueue(RealTimeData._mqttQueuepath);
            while (QueueManger.IsHaveMessage(RealTimeData._mqttQueuepath))
            {
                MQTTBLLRealTimeData model = QueueManger.ReceiveMessage<MQTTBLLRealTimeData>(mq);
                OperationMaintenanceTaskBll.generateMqttTaskAndSendMessage(model);
            }
        }
    }
}