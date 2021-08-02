using fw.fwConfig;
using fw.fwDal;
using fw.m.basicInfo.dal;
using fw.m.basicInfo.data.entity;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;

namespace fw.m.basicInfo.bll
{
    public class CityWeatherBLL
    {
        public static void CheckWeather()
        {
            BLLCityWeather dbModel = CityWeatherDal.GetWeather(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day);
            if (null != dbModel)
            {
                return;
            }
            string weatherUrl = FWConfigHelper.getValue("weather_url");
            var request = (HttpWebRequest)WebRequest.Create(weatherUrl);
            var response = request.GetResponse();
            string responseJson = "";
            using (StreamReader reader = new StreamReader(response.GetResponseStream(), Encoding.UTF8))
            {
                responseJson = reader.ReadToEnd();
            }

            JObject respObject= JObject.Parse(responseJson);

            if (null!=respObject)
            {
                BLLCityWeather model = new BLLCityWeather();
                model.city = respObject["city"].ToString();
                model.cityId = "101191205";
                model.weather = respObject["wea"]==null?"": respObject["wea"].ToString();
                model.temp = respObject["tem"] == null ? "" : respObject["tem"].ToString();
                model.temp1 = respObject["tem1"] == null ? "" : respObject["tem1"].ToString();
                model.temp2 = respObject["tem2"] == null ? "" : respObject["tem2"].ToString();
                string date = respObject["date"] == null ? "" : respObject["date"].ToString();
                if (!string.IsNullOrEmpty(date))
                {
                    DateTime dt = Convert.ToDateTime(date);
                    model.year = dt.Year;
                    model.month = dt.Month;
                    model.day = dt.Day;
                    try
                    {
                        IFWCommand cmd = CityWeatherDal.insert(model);
                        FWSqlCommandStaticHelper.ExecuteNonQuery(cmd);
                    }
                    catch (Exception ex)
                    {

                    }
                }
            }
            
        }


    }
}
