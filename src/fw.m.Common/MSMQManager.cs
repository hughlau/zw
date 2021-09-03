using System;
using System.Collections.Generic;
using System.Linq;
using System.Messaging;
using System.Text;
using System.Threading.Tasks;

namespace fw.m.Common
{
    public class MSMQManager
    {
        private static object LockObject = new object();
        // 创建MSMQ队列
        public static void Createqueue(string queuePath, bool transactional = false)
        {
            try
            {
                //判断队列是否存在
                if (!MessageQueue.Exists(queuePath))
                {
                    lock (LockObject)
                    {
                        MessageQueue.Create(queuePath, transactional);
                    }
                }
            }
            catch (MessageQueueException e)
            {
                // ignored
            }
        }

        //删除队列
        public static void Deletequeue(string queuePath)
        {
            try
            {
                //判断队列是否存在
                if (MessageQueue.Exists(queuePath))
                {
                    lock (LockObject)
                    {
                        MessageQueue.Delete(queuePath);
                    }
                }
            }
            catch (MessageQueueException e)
            {
                // ignored
            }
        }

        //接收消息
        public static T ReceiveMessage<T>(MessageQueue mq, MessageQueueTransaction tran = null)
        {
            try
            {
                mq.Formatter = new XmlMessageFormatter(new Type[] { typeof(T) });
                //从队列中接收消息
                var myMessage = tran == null ? mq.Receive(TimeSpan.FromSeconds(1)) : mq.Receive(TimeSpan.FromSeconds(1), tran);
                if (myMessage != null) return (T)myMessage.Body; //获取消息的内容
            }
            catch (Exception e)
            {
                // ignored
            }
            return default(T);
        }
        private static object messageLock = new object();
        //发送消息
        public static void SendMessage<T>(T target, string queuePath, MessageQueueTransaction tran = null)
        {
            //连接到本地的队列
            var mq = new MessageQueue(queuePath);
            var message = new Message
            {
                Body = target,
                Formatter = new XmlMessageFormatter(new Type[] { typeof(T) })
            };
            //发送消息到队列中
            if (tran == null)
            {
                //非事务性队列
                mq.Send(message);
            }
            else
            {
                //事务性队列
                tran.Begin();
                mq.Send(message, tran);
                tran.Commit();
            }
        }

        //采用Peek方法接收消息
        public static T ReceiveMessageByPeek<T>(string queuePath)
        {
            //连接到本地队列
            var mq = new MessageQueue(queuePath) { Formatter = new XmlMessageFormatter(new Type[] { typeof(T) }) };
            try
            {
                //从队列中接收消息
                var myMessage = mq.Peek();
                if (myMessage != null) return (T)myMessage.Body; //获取消息的内容
            }
            catch (MessageQueueException e)
            {
                // ignored
            }
            catch (InvalidCastException e)
            {
                // ignored
            }
            return default(T);
        }

        //获取队列中的所有消息
        public static List<T> GetAllMessage<T>(string queuePath)
        {
            var mq = new MessageQueue(queuePath) { Formatter = new XmlMessageFormatter(new Type[] { typeof(T) }) };
            try
            {
                var msgArr = mq.GetAllMessages();
                var list = new List<T>();
                msgArr.ToList().ForEach(o => { list.Add((T)o.Body); });
                return list;
            }
            catch (Exception e)
            {
                // ignored
            }
            return null;
        }

        public static int GetAllCount<T>(string queuePath)
        {
            var mq = new MessageQueue(queuePath) { Formatter = new XmlMessageFormatter(new Type[] { typeof(T) }) };
            try
            {
                var msgArr = mq.GetAllMessages();
                var list = new List<T>();
                msgArr.ToList().ForEach(o => { list.Add((T)o.Body); });
                return list.Count;
            }
            catch (Exception e)
            {
                // ignored
            }
            return 0;
        }

        //队列中是否还有消息
        public static bool IsHaveMessage(string queuePath)
        {
            var mq = new MessageQueue(queuePath);
            var enum2 = mq.GetMessageEnumerator2();
            return enum2.MoveNext();
        }

        public static bool IsQueueExist(string path)
        {
            return MessageQueue.Exists(path);
        }
    }
}
