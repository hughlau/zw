using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.operationMaintenance.data.model
{
    public class JJMBLLRealTimeDataDeviceData_Status
    {
        public string name { get; set; }

        public string deviceId { get; set; }

        public string time { get; set; }

        /// <summary>
        /// CRC检测
        /// </summary>
        public string crc { get; set; }

        /// <summary>
        /// 低液位反馈
        /// </summary>
        public string bit1
        {
            get;set;
        }

        /// <summary>
        /// 高液位反馈
        /// </summary>
        public string bit2 { get; set; }

        /// <summary>
        /// 水泵接点反馈
        /// </summary>
        public string bit3 { get; set; }

        /// <summary>
        /// 气泵接点反馈
        /// </summary>
        public string bit4 { get; set; }

        /// <summary>
        /// 气泵开关状态
        /// </summary>
        public string bit5 { get; set; }

        /// <summary>
        /// 水泵开关状态
        /// </summary>
        public string bit6 { get; set; }

        /// <summary>
        /// 高水位报警
        /// </summary>
        public string bit7 { get; set; }

        /// <summary>
        /// 电流超过2.5A报警
        /// </summary>
        public string bit8 { get; set; }
    }
}
