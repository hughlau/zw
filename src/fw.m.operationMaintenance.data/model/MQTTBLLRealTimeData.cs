using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.operationMaintenance.data.model
{
    public class MQTTBLLRealTimeData
    {
        private string _Topic;
        public string Topic {
            get { return _Topic; }
            set {
                _Topic = value;

                string[] paths = _Topic.Split('/');
                if (paths[2] == "gateway")
                {
                    EquipmentNo = paths[0];
                }
                else
                {
                    EquipmentNo = paths[2];
                }
            }
        }

        private string _Message;
        public string Message {
            get {
                return _Message;
            }
            set {
                _Message = value;

                JObject jObj = JObject.Parse(_Message);
                JToken jToken = jObj["Current1"];
                if (jToken!=null)
                {
                    string cur1 = jToken == null ? "0" : jToken.ToString();
                    int outIn = 0;
                    int.TryParse(cur1, out outIn);
                    outIn = outIn * 10;
                    MeterNum = outIn;
                }

                if (jObj["Date"]!=null)
                {
                    string cdatetime = "20" + jObj["Date"].ToString();
                    ColDateTime = Convert.ToDateTime(cdatetime);
                }
            }
        }

        /// <summary>
        /// 设备编码
        /// </summary>
        public string EquipmentNo { get; set; }

        /// <summary>
        /// 电流值
        /// </summary>
        public int MeterNum{ get; set; }

        /// <summary>
        /// 采集时间
        /// </summary>
        public DateTime ColDateTime { get; set; }

    }
}
