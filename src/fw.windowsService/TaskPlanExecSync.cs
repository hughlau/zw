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

namespace fw.windowsService
{
    public partial class TaskPlanExecSync : ServiceBase
    {
        UserLog log = new UserLog();
        private System.Timers.Timer ResolveTimer;
        private System.Timers.Timer ResolveTaskTimer;
        private Thread threadStatus;
        //
        public TaskPlanExecSync()
        {
            InitializeComponent();
        }
        //
        protected override void OnStart(string[] args)
        {
            try
            {
                log.WriteLog("TaskPlanExecSync服务启动！");
                CreateTimers();
            }
            catch (Exception e)
            {
                log.WriteLog(e.Message);
            }
        }

        //
        private void CreateTimers()
        {
            //默认一分钟一次check
            ResolveTimer = new System.Timers.Timer(180000);
            ResolveTimer.Elapsed += ResolveTimer_Elapsed;
            ResolveTimer.Enabled = true;
        }

        //
        private void ResolveTaskTimer_Elapsed(object source, ElapsedEventArgs e)
        {
            try
            {
                //
                if (threadStatus == null)
                {
                    ThreadStart threadStart = new TaskPlanExecSyncTask().DoWork;
                    threadStatus = new Thread(threadStart);
                    threadStatus.Start();
                    log.WriteLog("线程启动！");
                }
                else
                {
                    if (threadStatus.IsAlive)
                    {
                        threadStatus.Abort();
                    }
                    ThreadStart threadStart = new TaskPlanExecSyncTask().DoWork;
                    threadStatus = new Thread(threadStart);
                    threadStatus.Start();
                    log.WriteLog("线程启动！");
                }
            }
            catch (Exception ex)
            {
                log.WriteLog(ex.Message);
            }
        }

        //
        private void ResolveTimer_Elapsed(object source, ElapsedEventArgs e)
        {
            try
            {
                //固定时间点开始执行
                if (DateTime.Now.Date >= DateTime.Parse(fwConfig.FWConfigHelper.getValue("TaskPlanStartTime")))
                {
                    Int64 CreateDataSpan = 60000;
                    string ResolveInterval = fwConfig.FWConfigHelper.getValue("TimerTaskPlan");
                    CreateDataSpan = !String.IsNullOrEmpty(ResolveInterval) ? Int64.Parse(ResolveInterval) * 60 * 1000 : CreateDataSpan;

                    //新的定时器生成
                    ResolveTaskTimer = new System.Timers.Timer(CreateDataSpan);
                    ResolveTaskTimer.Elapsed += ResolveTaskTimer_Elapsed;
                    ResolveTaskTimer.Enabled = true;

                    //
                    ResolveTimer.Stop();
                    ResolveTimer.Dispose();
                    //任务执行开始
                    log.WriteLog("重新设置同步频率成功！新频率：" + ResolveInterval);
                }
            }
            catch (Exception ex)
            {
                log.WriteLog(ex.Message);
            }
        }
    }
}
