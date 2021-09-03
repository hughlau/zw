using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace fw.m.Common
{
    public class ThreadOperating
    {
        Thread thread;
        public bool Running
        {
            get;
            private set;
        }
        /// <summary>
        /// 停止时的异常信息。
        /// </summary>
        public Exception Exception { get; private set; }
        public ThreadOperating(ThreadStart start, bool isHigh = false)
        {
            Running = false;
            thread = new Thread(delegate ()
            {
                try
                {
                    start();
                }
                catch (Exception ex)
                {
                    Running = false;
                    if (ex is ThreadAbortException)
                        return;
                    WriteLog(ex);
                    //throw ex;
                }
                Running = false;
            });
            if (isHigh)
            {
                thread.Priority = ThreadPriority.Highest;
            }
            thread.IsBackground = true;
        }
        public ThreadOperating(ParameterizedThreadStart start)
        {
            Running = false;
            thread = new Thread(delegate (object obj)
            {
                try
                {
                    start(obj);
                }
                catch (Exception ex)
                {
                    //Running = false;
                    //if (ex is ThreadAbortException)
                    //    return;
                    //WriteLog(ex);
                    throw ex;
                }
                Running = false;
            });
            thread.IsBackground = true;
        }
        void WriteLog(Exception ex)
        {
            this.Exception = ex;
            //Log4Helper.Error("ThreadOperating类运行错误", ex);
        }
        public void Start()
        {
            thread.Start();
            Running = true;
        }
        public void Start(object parameter)
        {
            thread.Start(parameter);
            Running = true;
        }
        public void Abort()
        {
            Running = false;
            try
            {
                thread.Abort();
            }
            catch { }
        }
    }
}
