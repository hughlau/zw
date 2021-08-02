using fw.winservice.mqtt.MQ;
using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;


/****************************************************************
*   Author：L
*   Time：2021/1/26 11:29:39
*   FrameVersion：4.6.1
*   Description：
*
*****************************************************************/

namespace fw.winservice.mqtt
{
    class Program
    {
        /// <summary>
        /// 应用程序的主入口点。
        /// </summary>
        static void Main()
        {
            RMQProducer.Produce("ke", "hello");
        }

        void start()
        {
            Thread thread1 = new Thread(new ThreadStart(RMQProducer.Consume));
            thread1.Start();

            Thread thread = new Thread(new ThreadStart(pro));
            thread.Start();
        }



        void pro()
        {
            while (true)
            {
                
                Thread.Sleep(3000);
            }
        }
    }
}
