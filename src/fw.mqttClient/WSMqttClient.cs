using fw.fwConfig;
using fw.m.operationMaintenance.bll;
using fw.m.operationMaintenance.data.model;
using fw.mqttClient;
using MQTTnet;
using MQTTnet.Core;
using MQTTnet.Core.Client;
using MQTTnet.Core.Diagnostics;
using MQTTnet.Core.Packets;
using MQTTnet.Core.Protocol;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace fw.mqttService
{
    public class WSMqttClient
    {
        private MqttClient mqttClient = null;
        private string topics = fwConfig.FWConfigHelper.getValue("Topics");
        private string path = fwConfig.FWConfigHelper.getValue("LogPath");
        private string IP = fwConfig.FWConfigHelper.getValue("IP");
        private int Port = int.Parse(fwConfig.FWConfigHelper.getValue("Port"));
        private string username= fwConfig.FWConfigHelper.getValue("UserName");
        private string password= fwConfig.FWConfigHelper.getValue("Password");
       

        /// <summary>
        /// 连接服务器
        /// </summary>
        /// <returns></returns>
        public async Task ConnectMqttServerAsync()
        {
           
            if (mqttClient == null)
            {
                mqttClient = new MqttClientFactory().CreateMqttClient() as MqttClient;
                mqttClient.ApplicationMessageReceived += MqttClient_ApplicationMessageReceived;
                mqttClient.Connected += MqttClient_Connected;
                mqttClient.Disconnected += MqttClient_Disconnected;
                //MqttNetTrace.TraceMessagePublished += MqttNetTrace_TraceMessagePublished;
            }

            try
            {
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

                await mqttClient.ConnectAsync(options);

            }
            catch (Exception ex)
            {
                WriteLog(ex.Message);
            }
        }

        public void WriteLog(string sText)
        {
            string logFileAbsolutePath = "";
            if (path.EndsWith("\\"))
                logFileAbsolutePath = path + "Log" + DateTime.Now.ToString("yyMMdd").ToString() + ".txt";
            else
                logFileAbsolutePath = path + "\\" + "Log" + DateTime.Now.ToString("yyMMdd").ToString() + ".txt";



            FileStream fs = null;
            StreamWriter sw = null;
            try
            {

                if (!File.Exists(logFileAbsolutePath))
                {
                    string logFolderAbsolutePath = System.IO.Path.GetDirectoryName(logFileAbsolutePath);
                    if (!Directory.Exists(logFolderAbsolutePath))
                    {
                        Directory.CreateDirectory(logFolderAbsolutePath);
                    }
                    fs = File.Create(logFileAbsolutePath);
                }
                else
                {
                    FileInfo fi = new FileInfo(logFileAbsolutePath);
                    fs = new FileStream(logFileAbsolutePath, FileMode.Append, FileAccess.Write);
                }
                sw = new StreamWriter(fs, Encoding.GetEncoding("gb2312"));
                sw.WriteLine("-----" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "--------------------");
                sw.WriteLine("主题/内容：" + sText);
                sw.WriteLine();

                if (sw != null)
                {
                    sw.Close();
                }
                if (fs != null)
                {
                    fs.Close();
                }
            }
            catch
            {
                if (sw != null)
                {
                    sw.Close();
                }
                if (fs != null)
                {
                    fs.Close();
                }
            }

        }

        /// <summary>
        /// 服务器连接成功
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void MqttClient_Connected(object sender, EventArgs e)
        {
            WriteLog("服务器连接成功！");
            Subscribe();
        }

        /// <summary>
        /// 断开服务器连接
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void MqttClient_Disconnected(object sender, EventArgs e)
        {
            WriteLog("断开服务器连接！");
        }

        /// <summary>
        /// 接收到消息
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void MqttClient_ApplicationMessageReceived(object sender, MqttApplicationMessageReceivedEventArgs e)
        {
            MQTTBLLRealTimeData mQTTBLLRealTimeData = new MQTTBLLRealTimeData();
            mQTTBLLRealTimeData.Topic = e.ApplicationMessage.Topic;
            mQTTBLLRealTimeData.Message = Encoding.UTF8.GetString(e.ApplicationMessage.Payload);
            MqttQueue.insertMqttQueue(mQTTBLLRealTimeData);
            WriteLog($">>{e.ApplicationMessage.Topic}  {Encoding.UTF8.GetString(e.ApplicationMessage.Payload)}{Environment.NewLine}");
        }

        /// <summary>
        /// 订阅消息
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Subscribe()
        {
            if (!mqttClient.IsConnected)
            {
                return;
            }

            IList<TopicFilter> topicFilters = new List<TopicFilter>();
            if (!string.IsNullOrEmpty(topics))
            {
                string[] arrTopics = topics.Split(',');
                for (int i = 0; i < arrTopics.Length; i++)
                {
                    if (!string.IsNullOrEmpty(arrTopics[i]))
                    {
                        topicFilters.Add(new TopicFilter(arrTopics[i], MqttQualityOfServiceLevel.AtMostOnce));
                    }
                }
            }
            string logMsg = $"主题[{topics}]";
            try
            {
                mqttClient.SubscribeAsync(topicFilters);
                logMsg += "订阅成功！";
            }
            catch (Exception ex)
            {
                logMsg += $"订阅失败！{ex.Message}";
            }
            finally
            {
                WriteLog(logMsg);
            }
            
        }

        /// <summary>
        /// 发布主题
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Publish(string topic, string inputString)
        {
            string logMsg = "";
            try
            {
                var appMsg = new MqttApplicationMessage(topic, Encoding.UTF8.GetBytes(inputString), MqttQualityOfServiceLevel.AtMostOnce, false);
                mqttClient.PublishAsync(appMsg);
                logMsg = "发布成功！";
            }
            catch (Exception ex)
            {
                logMsg = $"发布失败！{ex.Message}";
            }
            finally
            {
                WriteLog(logMsg);
            }              
        }



        private void MqttNetTrace_TraceMessagePublished(object sender, MqttNetTraceMessagePublishedEventArgs e)
        {
            string currentTrack=$">> 线程ID：{e.ThreadId} 来源：{e.Source} 跟踪级别：{e.Level} 消息: {e.Message}";

            if (e.Exception != null)
            {
                WriteLog(currentTrack);
            }
        }
        
    }
}
