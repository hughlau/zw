using fw.fwConfig;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace fw.m.Common
{
    /// <summary>
    ///慧联无限下行
    /// </summary>
    public class LinkThingsUtil
    {
        public string url= FWConfigHelper.getValue("url");
        public string apiSecret = FWConfigHelper.getValue("secret");
        public string apiKey = FWConfigHelper.getValue("key");
        public string nonce;
        public string timestamp;
        public string signature;
        public string union;

        public LinkThingsUtil()
        {
            update();
        }

        public LinkThingsUtil(string apiKey, string apiSecret)
        {
            this.apiKey = apiKey;
            this.apiSecret = apiSecret;
        }

        public string getSig()
        {
            return Sha1Sign(union);
        }

        public static string Sha1Sign(string data)
        {
            byte[] temp1 = Encoding.UTF8.GetBytes(data);
            SHA1CryptoServiceProvider sha = new SHA1CryptoServiceProvider();
            byte[] temp2 = sha.ComputeHash(temp1);
            sha.Clear();                  
            var output = BitConverter.ToString(temp2);
            output = output.Replace("-", "");
            output = output.ToLower();
            return output;
        }

        private string nonceGen()
        {
            ArrayList list = new ArrayList();
            string str = "0,1,2,3,4,5,6,7,8,9";
            list.AddRange(str.Split(','));
            string randomContent = "";
            Random rd = new Random();
            int nuM = 8;
            for (int i = 0; i < nuM; i++)
            {
                randomContent += list[rd.Next(0, 10)];
            }
            return randomContent;
        }
        public void update()
        {
            nonce = nonceGen();
            timestamp = new DateTimeOffset(DateTime.UtcNow).ToUnixTimeMilliseconds().ToString();
            union = nonce + timestamp + apiSecret;
        }
        public String getApiSecret() { return apiSecret; }
        public void setApiSecret(String apiSecret) { this.apiSecret = apiSecret; }
        public String getApiKey() { return apiKey; }
        public void setApiKey(String apiKey) { this.apiKey = apiKey; }
        public String getNonce() { return nonce; }
        public void setNonce(String nonce) { this.nonce = nonce; }
        public String getTimestamp() { return timestamp; }
        public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
    }
}
