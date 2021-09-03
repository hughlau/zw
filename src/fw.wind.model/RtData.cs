using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace fw.wind.model
{
    public class RtData
    {
        /// <summary>
        /// 风机状态
        /// </summary>
        public double status { get; set; }

        /// <summary>
        /// 电机a相电压
        /// </summary>
        public double djVolA { get; set; }

        /// <summary>
        /// 电机b相电压
        /// </summary>
        public double djVolB { get; set; }

        /// <summary>
        /// 电机c相电压
        /// </summary>
        public double djVolC { get; set; }

        /// <summary>
        /// 正转a相电压
        /// </summary>
        public double zzVolA { get; set; }

        /// <summary>
        /// 正转c相电压
        /// </summary>
        public double zzVolC { get; set; }

        /// <summary>
        /// 反转a相电压
        /// </summary>
        public double fzVolA { get; set; }

        /// <summary>
        /// 反转c相电压
        /// </summary>
        public double fzVolC { get; set; }

        /// <summary>
        /// 电机功率
        /// </summary>
        public double djgl { get; set; }

        /// <summary>
        /// I级震动X
        /// </summary>
        public double IzdX { get; set; }

        /// <summary>
        /// I级震动Y
        /// </summary>
        public double IzdY { get; set; }

        /// <summary>
        /// 正转柜状态
        /// </summary>
        public double zzgStatus { get; set; }

        /// <summary>
        /// 风机轴温1
        /// </summary>
        public double windTemperature1 { get; set; }

        /// <summary>
        /// 风机轴温2
        /// </summary>
        public double windTemperature2 { get; set; }

        /// <summary>
        /// 风机轴温3
        /// </summary>
        public double windTemperature3 { get; set; }

        /// <summary>
        /// 风机轴温4
        /// </summary>
        public double windTemperature4 { get; set; }

        /// <summary>
        /// 电机轴温1
        /// </summary>
        public double elecTemperature1 { get; set; }

        /// <summary>
        /// 电机轴温2
        /// </summary>
        public double elecTemperature2 { get; set; }

        /// <summary>
        /// 电机轴温3
        /// </summary>
        public double elecTemperature3 { get; set; }

        /// <summary>
        /// II级震动X
        /// </summary>
        public double IIzdX { get; set; }

        /// <summary>
        /// II级震动Y
        /// </summary>
        public double IIzdY { get; set; }

        /// <summary>
        /// 正转柜状态
        /// </summary>
        public double fzgStatus { get; set; }
    }
}
