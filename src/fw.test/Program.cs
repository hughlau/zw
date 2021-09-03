using fw.m.Common;
using fw.m.Common.mq;
using System;
using System.Collections.Generic;

namespace fw.test
{
    class Program
    {
        static void Main(string[] args)
        {
            ActiveMQHelper activeMQHelper = new ActiveMQHelper();


            activeMQHelper.Init("tcp://localhost:61616/");
            activeMQHelper.SendMQMessage("hello");
        }
    }
}
