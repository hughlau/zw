using fw.fwConfig;
using fw.fwLog;
using fw.m.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace fw.mqttClient
{
    public class MSMQJobConsumer
    {
        ThreadOperating thread = null;
        ThreadOperating threadCal = null;
        public void Start()
        {
            thread = new ThreadOperating(ThreadQueueStart);
            thread.Start();

            threadCal = new ThreadOperating(ThreadCalQueueStart);
            threadCal.Start();

            Thread.Sleep(1000);

            ThreadOperating threadCheck = new ThreadOperating(CheckThread);
            threadCheck.Start();
        }

        public void CheckThread()
        {
            while (true)
            {
                Thread.Sleep(1000);
                //以下为检查线程是否正常运行，如果异常退出再次启动
                if (thread != null && thread.Running == false)
                {
                    thread.Abort();
                    thread = new ThreadOperating(ThreadQueueStart);
                    thread.Start();
                }

                if (threadCal != null && threadCal.Running == false)
                {
                    threadCal.Abort();
                    threadCal = new ThreadOperating(ThreadCalQueueStart);
                    threadCal.Start();
                }
            }
        }

        void ThreadQueueStart()
        {
            try
            {
                while (MSMQManager.IsQueueExist(FWConfigHelper.getValue("mqtt_msmqPath")))
                {
                    if (MSMQManager.IsHaveMessage(FWConfigHelper.getValue("mqtt_msmqPath")))
                    {
                        Consume();
                    }
                    else
                    {
                        Thread.Sleep(3000);
                    }
                }
            }
            catch (Exception ex)
            {
                FWLogHelper.writeLog($"Methor(ThreadStart);Error({ex.Message})");
            }
        }

        void ThreadCalQueueStart()
        {
            try
            {
                while (MSMQManager.IsQueueExist(FWConfigHelper.getValue("mqtt_msmqcalPath")))
                {
                    if (MSMQManager.IsHaveMessage(FWConfigHelper.getValue("mqtt_msmqcalPath")))
                    {
                        ConsumeCal();
                    }
                    else
                    {
                        Thread.Sleep(3000);
                    }
                }
            }
            catch (Exception ex)
            {
                FWLogHelper.writeLog($"Methor(ThreadStart);Error({ex.Message})");
            }
        }

        public void Consume() 
        { 
        
        }

        public void ConsumeCal()
        {

        }
    }
}
