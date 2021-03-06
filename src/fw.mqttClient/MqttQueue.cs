using fw.fwConfig;
using fw.m.operationMaintenance.bll;
using fw.m.operationMaintenance.data.model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Messaging;
using System.Text;
using System.Threading.Tasks;

namespace fw.mqttClient
{
    public class MqttQueue
    {
        //实时队列
        public static string queuepath = FWConfigHelper.getValue("mqtt_msmqPath");

        //计算队列
        public static string calculatequeue= FWConfigHelper.getValue("mqtt_msmqcalPath");
        public static bool insertMqttQueue(MQTTBLLRealTimeData entity)
        {

            //如果不存在就创建队列
            if (!QueueManger.IsQueueExist(queuepath))
            {
                QueueManger.Createqueue(queuepath, true);
            }
            //将接受的数据发送给消息队列
            bool flag = QueueManger.SendMessage(entity, queuepath, new MessageQueueTransaction());
            return flag;
        }

        /// <summary>
        /// 插入计算队列
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public static bool insertMqttCalculateQueue(MQTTBLLRealTimeData entity)
        {

            //如果不存在就创建队列
            if (!QueueManger.IsQueueExist(queuepath))
            {
                QueueManger.Createqueue(queuepath, true);
            }
            //将接受的数据发送给消息队列
            bool flag = QueueManger.SendMessage(entity, queuepath, new MessageQueueTransaction());
            return flag;
        }
    }
}
