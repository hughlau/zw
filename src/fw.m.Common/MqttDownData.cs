using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace fw.m.Common
{
    public class MqttDownData
    {
        public string topic { get; set; }

        public string message { get; set; }
    }

    public class MqttDownData_Message
    {
        public int channel { get; set; }

        public int state { get; set; }
    }
}
