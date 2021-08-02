using fw.fwConfig;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using Newtonsoft.Json.Linq;

namespace fw.m.Common
{
    public class ThirdServiceHelper
    {
        public static bool checkLoginCity(float lon,float lat)
        {
            string cityValue= FWConfigHelper.getValue("tainditu_login_value");
            string tiandituKey= FWConfigHelper.getValue("tianditu_key");
            string weatherUrl = FWConfigHelper.getValue("tianditu_point_url");
            string poi= "{%27lon%27:"+lon+",%27lat%27:"+ lat + ",%27ver%27:1}";
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.AppendFormat(weatherUrl, poi, tiandituKey);
            var request = (HttpWebRequest)WebRequest.Create(stringBuilder.ToString());
            var response = request.GetResponse();
            string responseJson = "";
            using (StreamReader reader = new StreamReader(response.GetResponseStream(), Encoding.UTF8))
            {
                responseJson = reader.ReadToEnd();
            }

            JObject respObject = JObject.Parse(responseJson);

            if (null != respObject["msg"] && respObject["msg"].ToString()=="ok")
            {
                JToken result = respObject["result"];
                JToken addressComponent = result["addressComponent"];
                if (null!=addressComponent["county"] && addressComponent["county"].ToString()== cityValue)
                {
                    return true;
                }
            }
            return false;
        }
    }
}
