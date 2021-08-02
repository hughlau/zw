using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.operationMaintenance.data.model
{
    public class JJMBLLRealTimeDataDeviceData_Monitor
    {
        /// <summary>
        /// 网关或设备的名称
        /// </summary>
        public string name { get; set; }

        public string active { get; set; }

        /// <summary>
        /// 网关或设备的id
        /// </summary>
        public string deviceId { get; set; }

        public string time { get; set; }

        /// <summary>
        /// 时间戳
        /// </summary>
        public string data1 { get; set; }


        /// <summary>
        /// 污水监控模块ID地址
        /// </summary>
        public string data2 { get; set; }


        /// <summary>
        /// 最后掉电时间
        /// </summary>
        public string data3 { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string data4 { get; set; }

        /// <summary>
        /// 发射强度信号
        /// </summary>
        public string data5 { get; set; }

        /// <summary>
        /// 空气泵电流
        /// </summary>
        public string data6 { get; set; }

        /// <summary>
        /// 水泵电流
        /// </summary>
        public string data7 { get; set; }

        /// <summary>
        /// 模拟量采集1
        /// </summary>
        public string data8 { get; set; }
       
        /// <summary>
        /// 模拟量采集2
        /// </summary>
        public string data9 { get; set; }

        /// <summary>
        /// 终端版本号
        /// </summary>
        public string data11 { get; set; }

        /// <summary>
        /// 基站ID
        /// </summary>
        public string data12 { get; set; }

    }
}
