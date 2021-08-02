using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace fw.m.Common
{
    /// <summary>
    /// 慧联无限下行命令
    /// </summary>
    public class LinkThingsHelper
    {
        public static MessageResult doHttpPost(string postData)
        {
            LinkThingsUtil linkThingsUtil = new LinkThingsUtil();
            MessageResult messageResult = new MessageResult();
            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(linkThingsUtil.url);
                SetHeaderValue(request.Headers, "Content-Type", "application/json");
                SetHeaderValue(request.Headers, "api-key", linkThingsUtil.apiKey);
                SetHeaderValue(request.Headers, "Nonce", linkThingsUtil.nonce);
                SetHeaderValue(request.Headers, "Timestamp", linkThingsUtil.timestamp);
                SetHeaderValue(request.Headers, "Signature", linkThingsUtil.getSig());
                request.Method = "POST";
                request.Timeout = 300000;

                byte[] bytes = Encoding.UTF8.GetBytes(postData);
                request.ContentLength = bytes.Length;
                Stream writer = request.GetRequestStream();
                writer.Write(bytes, 0, bytes.Length);
                writer.Close();

                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                StreamReader reader = new StreamReader(response.GetResponseStream() ?? throw new InvalidOperationException(), Encoding.UTF8);
                string result = reader.ReadToEnd();
                response.Close();
                messageResult.isSuccess = true;
                messageResult.SuccessResult=result;
                return messageResult;
            }
            catch (Exception ex)
            {
                messageResult.isSuccess = false;
                messageResult.FailResult=ex.Message;
                return messageResult;
            }
        }

        


        public static void SetHeaderValue(WebHeaderCollection header, string name, string value)
        {
            var property =
                typeof(WebHeaderCollection).GetProperty("InnerCollection",
                    BindingFlags.Instance | BindingFlags.NonPublic);
            if (property != null)
            {
                if (property.GetValue(header, null) is NameValueCollection collection) collection[name] = value;
            }
        }
    }
}
