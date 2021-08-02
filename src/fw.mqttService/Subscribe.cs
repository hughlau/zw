using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;

namespace fw.mqttService
{
    partial class Subscribe : ServiceBase
    {
        public Subscribe()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            // TODO: 在此处添加代码以启动服务。
            WSMqttClient wSMqttClient = new WSMqttClient();
            Task.Run(async () => { await wSMqttClient.ConnectMqttServerAsync(); });
        }

        protected override void OnStop()
        {
            // TODO: 在此处添加代码以执行停止服务所需的关闭操作。
        }
    }
}
