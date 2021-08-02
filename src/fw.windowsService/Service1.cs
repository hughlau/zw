using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading;
using System.Timers;
using fw.fwConfig;

namespace fw.windowsService
{
    partial class Service1 : ServiceBase
    {
        private System.Timers.Timer ResolveTimer;
        private Thread threadStatus; 
        public Service1()
        {
            InitializeComponent();
        }
         
        

        protected override void OnStart(string[] args)
        {
            try
            {
                //log.WriteLog("PlantPlanService服务启动！");
                CreateTimers();
            }
            catch (Exception e)
            {
               // log.WriteLog(e.Message);
            }
        }
         
        protected override void OnStop()
        {
            // TODO: 在此处添加代码以执行停止服务所需的关闭操作。
        }

        private void CreateTimers()
        {
            Int64 CreateDataSpan = 60000;
            string ResolveInterval = FWConfigHelper.getValue("Timer_WDF");
            CreateDataSpan = !String.IsNullOrEmpty(ResolveInterval) ? Int64.Parse(ResolveInterval) * 60 * 1000 : CreateDataSpan;

            ResolveTimer = new System.Timers.Timer(CreateDataSpan);
            ResolveTimer.Elapsed += new System.Timers.ElapsedEventHandler(ResolveTimer_Elapsed);
            ResolveTimer.Enabled = true;
        }
        private void ResolveTimer_Elapsed(object source, ElapsedEventArgs e)
        {
            try
            {
                if (threadStatus == null)
                {

                    //ThreadStart threadStart = new ThreadStart(new PlantPlanTask().DoWork);
                    //threadStatus = new Thread(threadStart);
                    //threadStatus.Start();
                    //log.WriteLog("线程启动！");
                }
                else
                {
                    if (threadStatus.IsAlive)
                    {
                        threadStatus.Abort();
                    }
                    //ThreadStart threadStart = new ThreadStart(new PlantPlanTask().DoWork);
                    //threadStatus = new Thread(threadStart);
                    //threadStatus.Start();
                    //log.WriteLog("线程启动！");
                }

            }
            catch (Exception ex)
            {
               // log.WriteLog(ex.Message);
            }
        }
    }
}
