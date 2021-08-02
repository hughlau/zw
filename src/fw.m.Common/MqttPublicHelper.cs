using MQTTnet;
using MQTTnet.Core;
using MQTTnet.Core.Client;
using MQTTnet.Core.Protocol;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.Common
{
    public class MqttPublicHelper
    {
        private static MqttClient mqttClient = null;
        private string IP = fwConfig.FWConfigHelper.getValue("IP");
        private int Port = int.Parse(fwConfig.FWConfigHelper.getValue("Port"));
        private string username = fwConfig.FWConfigHelper.getValue("UserName");
        private string password = fwConfig.FWConfigHelper.getValue("Password");
        private static List<MqttDownData> _mqttDownDatas = new List<MqttDownData>();

        public MqttPublicHelper(List<MqttDownData> mqttDownDatas)
        {
            _mqttDownDatas = mqttDownDatas;
            connect();
        }



        /// <summary>
        /// 连接服务器
        /// </summary>
        /// <returns></returns>
        public void connect()
        {
            if (mqttClient == null)
            {
                mqttClient = new MqttClientFactory().CreateMqttClient() as MqttClient;
                mqttClient.Connected += MqttClient_Connected;
                mqttClient.Disconnected += MqttClient_Disconnected;
                //MqttNetTrace.TraceMessagePublished += MqttNetTrace_TraceMessagePublished;
            }
            var options = new MqttClientTcpOptions
            {
                Server = IP,
                Port = Port,
                ClientId = Guid.NewGuid().ToString().Substring(0, 5),
                CleanSession = true
            };
            if (!string.IsNullOrEmpty(username))
            {
                options.UserName = username;
            }
            if (!string.IsNullOrEmpty(password))
            {
                options.Password = password;
            }
            if (!mqttClient.IsConnected)
            {
                mqttClient.ConnectAsync(options);
            }
        }

       

        /// <summary>
        /// 服务器连接成功
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void MqttClient_Connected(object sender, EventArgs e)
        {
            Publish(_mqttDownDatas);
        }

        /// <summary>
        /// 断开服务器连接
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void MqttClient_Disconnected(object sender, EventArgs e)
        {

        }

        
        /// <summary>
        /// 发布主题
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void Publish(List<MqttDownData> mqttDownDatas)
        {
            for (int i = 0; i < mqttDownDatas.Count; i++)
            {
                string topic = mqttDownDatas[i].topic.ToString();
                string inputString = mqttDownDatas[i].message.ToString();
                var appMsg = new MqttApplicationMessage(topic, Encoding.UTF8.GetBytes(inputString), MqttQualityOfServiceLevel.AtMostOnce, false);
                mqttClient.PublishAsync(appMsg);
            }
            mqttClient.DisconnectAsync();
        }



      

    }
}
