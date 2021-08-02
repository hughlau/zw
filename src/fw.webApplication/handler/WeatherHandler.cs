using fw.m.basicInfo.bll;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Timers;
using System.Web;

namespace fw.webApplication.handler
{
    public class WeatherHandler
    {
        public readonly static WeatherHandler instance = new WeatherHandler();
        private WeatherHandler() { }

        public static bool IsStart = false;

        public void Start()//启动
        {
            Thread thread = new Thread(threadStart);
            thread.IsBackground = true;
            thread.Start();
        }

        private void threadStart()
        {
            if (!IsStart)
            {
                System.Timers.Timer timer = new System.Timers.Timer();
                timer.Elapsed += new ElapsedEventHandler(WeatherTimer_Elapsed);
                timer.Interval = 600000.0;
                timer.Enabled = true;
                IsStart = true;
            }

        }

        private void WeatherTimer_Elapsed(object source, ElapsedEventArgs e)
        {
            try
            {
                CityWeatherBLL.CheckWeather();

            }
            catch (Exception ee)
            {
                ;

            }

        }

    }
}