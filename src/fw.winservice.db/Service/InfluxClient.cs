using InfluxDB.Client;
using InfluxDB.Client.Api.Domain;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


/****************************************************************
*   Author：L
*   Time：2021/1/26 13:42:33
*   FrameVersion：4.6.1
*   Description：
*
*****************************************************************/

namespace fw.winservice.db.Service
{
    public class InfluxClient
    {
        public static string conurl = ConfigurationManager.AppSettings["Influx_Connection"].ToString();
        public static string database = ConfigurationManager.AppSettings["Influx_db"].ToString();
        public static string retentionPolicy = ConfigurationManager.AppSettings["Influx_policy"].ToString();
        public static string uid = ConfigurationManager.AppSettings["Influx_uid"].ToString();
        public static string pwd = ConfigurationManager.AppSettings["Influx_pwd"].ToString();

        public static void Write<T>(List<T> flux_Datas)
        {
            var client = InfluxDBClientFactory.CreateV1(conurl,
                uid,
                pwd.ToCharArray(),
                database,
                retentionPolicy);
            using (var writeApi = client.GetWriteApi())
            {
                writeApi.WriteMeasurements<T>(WritePrecision.Ms, flux_Datas);
            }
            client.Dispose();
        }


        /// <summary>
        /// 读取上一次有效数据
        /// </summary>
        /// <param name="compNo"></param>
        /// <param name="mNo"></param>
        /// <param name="jldNo"></param>
        /// <param name="q"></param>
        /// <returns></returns>
        public static async Task<decimal> ReadLastY(string compNo, string mNo, string jldNo, string q)
        {
            decimal back = 0;
            try
            {
                var client = InfluxDBClientFactory.CreateV1(conurl,
                    uid,
                    pwd.ToCharArray(),
                    database,
                    retentionPolicy);
                var query = $"from(bucket: \"{database}/{retentionPolicy}\")  |> range(start: -240h)  |> filter(fn: (r) =>r._measurement == \"mdata\" and r.CompNo==\"{compNo}\" and r.mNo==\"{mNo}\" and r.jldNo==\"{jldNo}\" and r.q==\"{q}\")  |> sort(columns:[\"time\"],desc:true)  |> limit(n:1)";
                var fluxDatas = await client.GetQueryApi().QueryAsync(query);
                client.Dispose();
                if (fluxDatas != null && fluxDatas.Count > 0)
                {
                    for (int i = 0; i < fluxDatas.Count; i++)
                    {
                        if (fluxDatas[i].Records[0].GetField() == "v")
                        {
                            decimal.TryParse(fluxDatas[i].Records[0].GetValue() == null ? "" : fluxDatas[i].Records[0].GetValue().ToString(), out back);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                //LogHelper.Default.WriteInfo("写入influx失败:" + ex.Message);
            }
            return back;
        }

        /// <summary>
        /// 读取上一次数据
        /// </summary>
        /// <param name="compNo"></param>
        /// <param name="mNo"></param>
        /// <param name="jldNo"></param>
        /// <param name="q"></param>
        /// <returns></returns>
        public static async Task<string> ReadLast(string compNo, string mNo, string jldNo)
        {
            string back = "";
            try
            {
                var client = InfluxDBClientFactory.CreateV1(conurl,
                    uid,
                    pwd.ToCharArray(),
                    database,
                    retentionPolicy);
                var query = $"from(bucket: \"{database}/{retentionPolicy}\")  |> range(start: -240h)  |> filter(fn: (r) =>r._measurement == \"mdata\" and r.CompNo==\"{compNo}\" and r.mNo==\"{mNo}\" and r.jldNo==\"{jldNo}\" )  |> sort(columns:[\"time\"],desc:true)  |> limit(n:1)";
                var fluxDatas = await client.GetQueryApi().QueryAsync(query);
                client.Dispose();
                if (fluxDatas != null && fluxDatas.Count > 0)
                {
                    for (int i = 0; i < fluxDatas.Count; i++)
                    {
                        if (fluxDatas[i].Records[0].GetField() == "d")
                        {
                            back = fluxDatas[i].Records[0].GetValue().ToString();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                //LogHelper.Default.WriteError($"Methor(InfluxClient.ReadLast);Error({ex.Message})");
                //throw;
            }
            return back;
        }
    }
}
