using fw.fwConfig;
using fw.fwDal;
using fw.fwData;
using fw.fwFile;
using fw.fwHttpContext;
using fw.fwJson;
using fw.fwSafe;
using fw.fwService;
using fw.fwSession;
using fw.fwUrl;
using fw.m.basePage.service;
using fw.m.operationMaintenance.bll;
using fw.m.sysManage.data;
using fw.m.userLogin.service;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;

namespace fw.webApplication.handler
{
    public class WSModuleHelper : IHttpModule
    {
        // Methods
        private void context_BeginRequest(object sender, EventArgs e)
        {
            HttpContext context = ((HttpApplication)sender).Context;
            string virtualDirectory = FWUrlHelper.getVirtualDirectory();
            string str2 = FWUrlHelper.getWebSiteRootUrl(virtualDirectory);
            string str4 = context.Request.Url.AbsoluteUri.ToLower();
            if (!string.IsNullOrEmpty(FWConfigHelper.dynamicDirectory))
            {
                string str5 = str2 + FWConfigHelper.dynamicDirectory + "/";
                if (str4.StartsWith(str5.ToLower()))
                {
                    int index = str4.IndexOf("?");
                    if (index < 0)
                    {
                        index = str4.Length;
                    }
                    str4 = (str2 + FWSafeHelper.decrypt(context.Request.Url.AbsoluteUri.Substring(str5.Length, index - str5.Length), FWConfigHelper.dynamicDirectory)).ToLower();
                }
            }
            if (str4.StartsWith((str2 + "appSettings").ToLower()))
            {
                string s = "";
                FWDictionary<string, string> dictionary = new FWDictionary<string, string>
                {
                    ["webSiteRootUrl"] = str2,
                    ["dataPublicKey"] = FWConfigHelper.dataPublicKey,
                    ["dynamicDirectory"] = FWConfigHelper.dynamicDirectory
                };
                DateTime now = DateTime.Now;
                if (str4.StartsWith((str2 + "appSettings/javaScript").ToLower()))
                {
                    dictionary["serverTime"] = "@serverTime";
                    s = FWJsonHelper.serializeObject(dictionary).Replace("\"@serverTime\"", string.Concat(new object[] { "new Date(", now.Year, ",", now.Month - 1, ",", now.Day, ",", now.Hour, ",", now.Minute, ",", now.Second, ",", now.Millisecond, ")" }));
                    s = "window.appSettings=" + s + ";";
                }
                else
                {
                    dictionary["serverTime"] = now.ToString("yyyy-MM-dd HH:mm:ss");
                    s = FWJsonHelper.serializeObject(dictionary);
                }
                context.Response.Write(s);
                context.ApplicationInstance.CompleteRequest();
            }
            else
            {
                string str7;
                string str8;
                string str9;
                string data;
                string str11;
                string str12;
                FWDictionary<string, string> dictionary2;
                BasePageService service;
                if (str4.StartsWith((str2 + "service/json/call/fs").ToLower()))
                {
                    str7 = null;
                    str11 = null;
                    str12 = null;
                    dictionary2 = FWHttpContextHelper.getParams(context, "");
                    str8 = dictionary2["serviceName"];
                    str9 = dictionary2["methodName"];
                    if (dictionary2.ContainsKey("bigDataKey"))
                    {
                        str11 = dictionary2["bigDataKey"];
                    }
                    if (string.IsNullOrEmpty(str11))
                    {
                        data = dictionary2["paramsJson"];
                    }
                    else
                    {
                        service = new BasePageService();
                        data = service.getBigData(null, str11).data;
                    }
                    str12 = FWHttpContextHelper.request(context, "jsoncallback", string.Empty);
                    str7 = FWServiceHelper.jsonCall(str8, str9, data, str12, "");
                    context.Response.Write(str7);
                    context.ApplicationInstance.CompleteRequest();
                }
                else if (str4.StartsWith((str2 + "service/json/call").ToLower()))
                {
                    str7 = null;
                    str11 = null;
                    str12 = null;
                    dictionary2 = FWHttpContextHelper.getParams(context);
                    str8 = dictionary2["serviceName"];
                    str9 = dictionary2["methodName"];
                    if (dictionary2.ContainsKey("bigDataKey"))
                    {
                        str11 = dictionary2["bigDataKey"];
                    }
                    if (string.IsNullOrEmpty(str11))
                    {
                        data = dictionary2["paramsJson"];
                    }
                    else
                    {
                        service = new BasePageService();
                        data = FWSafeHelper.decrypt(service.getBigData(null, str11).data);
                    }
                    Dictionary<string, object> keyValuePairs = FWJsonHelper.deserializeObject<Dictionary<string, object>>(data);
                    bool userExpire = false;
                    if (null!= keyValuePairs && keyValuePairs.Keys.Contains("ticket") && keyValuePairs["ticket"]!=null)
                    {
                        userExpire=isUserExpire(keyValuePairs["ticket"].ToString());
                    }
                    if (userExpire)
                    {
                        string userExpireInfo = "{\"useTime\":0,\"data\":false,\"infoList\":[\"relogin\"],\"sqlInfoList\":[],\"status\":1}";
                        context.Response.Write(userExpireInfo);
                        context.ApplicationInstance.CompleteRequest();
                    }
                    else
                    {
                        str12 = FWHttpContextHelper.request(context, "jsoncallback", string.Empty);
                        str7 = FWServiceHelper.jsonCall(str8, str9, data, str12);
                        context.Response.Write(str7);
                        context.ApplicationInstance.CompleteRequest();
                    }
                }
                else if (str4.StartsWith((str2 + "service/dbFile").ToLower()))
                {
                    dictionary2 = FWHttpContextHelper.getParams(context);
                    string str13 = FWConfigHelper.webSiteRelativePath + FWUrlHelper.getPath(FWConfigHelper.getValue("uploadFolderPath"));
                    string path = HttpContext.Current.Server.MapPath(HttpContext.Current.Request.ApplicationPath + "/" + str13);
                    string str15 = null;
                    if (dictionary2.ContainsKey("fileFingerprint"))
                    {
                        str15 = dictionary2["fileFingerprint"];
                        str15 = FWSafeHelper.decrypt(str15, "DEFAULT_ENCRYPT_KEY");
                        DirectoryInfo info = new DirectoryInfo(path);
                        if (info.Exists)
                        {
                            FileInfo[] files = info.GetFiles();
                            if ((files != null) && (files.Length > 0))
                            {
                                foreach (FileInfo info2 in files)
                                {
                                    if (info2.Name == (str15 + info2.Extension))
                                    {
                                        context.Server.Execute("~/" + str13 + info2.Name);
                                        context.ApplicationInstance.CompleteRequest();
                                        return;
                                    }
                                }
                            }
                        }
                    }
                    if (dictionary2.ContainsKey("dbFileId"))
                    {
                        string str16 = dictionary2["dbFileId"];
                        string str17 = FWSafeHelper.decrypt(str16, "DEFAULT_ENCRYPT_KEY");
                        FWSqlCommand command = new FWSqlCommand
                        {
                            CommandText = str17
                        };
                        DataTable table = FWSqlCommandStaticHelper.ExecuteDataTable(command);
                        if (((table.Rows.Count > 0) && (table.Columns.Count > 0)) && (table.Rows[0][0] != DBNull.Value))
                        {
                            byte[] byteArray = (byte[])table.Rows[0][0];
                            FWFileInfo info3 = FWFileHelper.getFileInfoByByteArray(byteArray);
                            if (info3 != null)
                            {
                                if (string.IsNullOrEmpty(str15) || string.IsNullOrEmpty(info3.extension))
                                {
                                    context.Response.BinaryWrite(byteArray);
                                }
                                else
                                {
                                    info3.name = str15 + info3.extension;
                                    if (!Directory.Exists(path))
                                    {
                                        Directory.CreateDirectory(path);
                                    }
                                    File.WriteAllBytes(path + info3.name, byteArray);
                                    context.Server.Execute("~/" + str13 + info3.name);
                                }
                            }
                        }
                    }
                    context.ApplicationInstance.CompleteRequest();
                }
                else if (str4.StartsWith((str2 + "service/file").ToLower()))
                {
                    string str18 = context.Request[FWSafeHelper.encrypt("fileUrl", FWConfigHelper.dataPublicKey)];
                    string str19 = context.Request[FWSafeHelper.encrypt("fileName", FWConfigHelper.dataPublicKey)];
                    if (string.IsNullOrEmpty(str18) || string.IsNullOrEmpty(str19))
                    {
                        context.Response.Write("导出失败，请确认文件名fileName、文件路径fileUrl是否为空");
                        context.ApplicationInstance.CompleteRequest();
                    }
                    else if (!string.IsNullOrEmpty(str18) && !string.IsNullOrEmpty(str19))
                    {
                        str18 = FWSafeHelper.decrypt(str18);
                        str19 = FWSafeHelper.decrypt(str19);
                        if (str18.ToLower().StartsWith(str2.ToLower()))
                        {
                            FileInfo info4 = new FileInfo(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, str18.Remove(0, str2.Length)));
                            if (info4.Exists)
                            {
                                byte[] buffer = new byte[0x19000L];
                                context.Response.Clear();
                                FileStream stream = info4.OpenRead();
                                long length = stream.Length;
                                context.Response.ContentType = "application/octet-stream";
                                context.Response.AddHeader("Content-Disposition", "attachment; filename=" + FWUrlHelper.encode(str19));
                                while ((length > 0L) && context.Response.IsClientConnected)
                                {
                                    int count = stream.Read(buffer, 0, Convert.ToInt32((long)0x19000L));
                                    context.Response.OutputStream.Write(buffer, 0, count);
                                    context.Response.Flush();
                                    length -= count;
                                }
                                if (length <= 0L)
                                {
                                }
                                context.Response.Close();
                            }
                            context.ApplicationInstance.CompleteRequest();
                        }
                    }
                }
                else
                {
                    string path = context.Request.Path;
                    if (path.Contains("jsonService.svc"))
                    {
                        MemoryStream memoryStream = new MemoryStream();
                        context.Request.InputStream.CopyTo(memoryStream);
                        context.Request.InputStream.Position = 0;
                        memoryStream.Position = 0;
                        using (StreamReader inputStream = new StreamReader(memoryStream))
                        {
                            string log= inputStream.ReadToEnd();
                            string sText = "接收报文:" + log + "" + Environment.NewLine;
                            string logpath = fwConfig.FWConfigHelper.getValue("HLWX_LogPath");
                            OperationMaintenanceTaskBll.WriteLog(sText, logpath);
                        }
                    }
                    if (!string.IsNullOrEmpty(virtualDirectory))
                    {
                        path = path.Remove(0, virtualDirectory.Length + 1);
                    }
                    switch (path.ToLower())
                    {
                        case "/web/userlogin/identityauthenticate":
                            context.Server.Execute("~/web/userLogin/identityAuthenticate.aspx");
                            context.ApplicationInstance.CompleteRequest();
                            break;

                        case "/web/userlogin/login":
                            context.Server.Execute("~/web/userLogin/login.aspx");
                            context.ApplicationInstance.CompleteRequest();
                            break;

                        case "/web/userlogin/logout":
                            context.Server.Execute("~/web/userLogin/logout.aspx");
                            context.ApplicationInstance.CompleteRequest();
                            break;

                        case "/web/userlogin/updatepassword":
                            context.Server.Execute("~/web/userLogin/updatePassword.aspx");
                            context.ApplicationInstance.CompleteRequest();
                            break;
                    }
                }
            }
        }

        /// <summary>
        /// 验证用户是否过期
        /// </summary>
        /// <param name="userticket"></param>
        /// <returns></returns>
        public bool isUserExpire(string userticket)
        {
            UserLoginService service = new UserLoginService();
            IFWUserInfo info = FWSessionHelper.getUserInfoByTicket(userticket);
            if (info != null)
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        private void context_EndRequest(object sender, EventArgs e)
        {
        }

        public void Dispose()
        {
        }

        public void Init(HttpApplication context)
        {
            context.BeginRequest += new EventHandler(this.context_BeginRequest);
            context.EndRequest += new EventHandler(this.context_EndRequest);
        }
    }




}