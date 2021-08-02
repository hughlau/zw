using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


/****************************************************************
*   Author：L
*   Time：2021/1/26 11:25:03
*   FrameVersion：4.6.1
*   Description：
*
*****************************************************************/

namespace fw.winservice.mqtt.MQ
{
    public class RMQProducer
    {
        #region =============字段============



        #endregion

        #region =============属性============



        #endregion

        #region ===========构造函数==========



        #endregion

        #region =============方法============

        public static void Produce(string queue, string message)
        {
            try
            {
                var cf = new ConnectionFactory();
                cf.HostName = "127.0.0.1";
                cf.UserName = "guest";
                cf.Password = "guest";
                using (var connection = cf.CreateConnection())//连接服务器，即正在创建终结点。
                {
                    using (var channel = connection.CreateModel())
                    {
                        channel.QueueDeclare("ke", false, false, false, null);
                        var properties = channel.CreateBasicProperties();
                        properties.DeliveryMode = 2;
                        channel.BasicPublish("", queue, properties, Encoding.UTF8.GetBytes(message)); //生产消息
                        Console.WriteLine("send:"+message);
                    }
                }
            }
            catch (Exception ex)
            {
                
            }
        }

        public static void Consume()
        {
            try
            {
                var factory = new ConnectionFactory();
                factory.HostName = "127.0.0.1";
                factory.UserName = "guest";
                factory.Password = "guest";

                using (var connection = factory.CreateConnection())
                {
                    using (var channel = connection.CreateModel())
                    {
                        //channel.QueueDeclare("ke", false, false, false, null);
                        var consumer = new EventingBasicConsumer(channel);
                        channel.BasicConsume("ke", true, consumer);
                        consumer.Received += (model, ea) =>
                        {
                            var body = ea.Body.ToArray();
                            var message = Encoding.UTF8.GetString(body);
                            Console.WriteLine("receive:"+message);
                        };
                    }
                }
            }
            catch (Exception ex)
            {

            }
        }

        #endregion
    }
}
