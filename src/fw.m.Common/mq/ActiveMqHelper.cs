using Apache.NMS;
using Apache.NMS.ActiveMQ;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace fw.m.Common.mq
{
    public class ActiveMqHelper
    {
        private IConnectionFactory factory;
        public void InitProducer()
        {
            try
            {
                //初始化工厂，这里默认的URL是不需要修改的
                factory = new ConnectionFactory("tcp://localhost:61616");

            }
            catch
            {
                lbMessage.Text = "初始化失败!!";
            }
        }
    }
}
