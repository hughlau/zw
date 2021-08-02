using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Google.ProtocolBuffers;
using com.gexin.rp.sdk.dto;
using com.igetui.api.openservice;
using com.igetui.api.openservice.igetui;
using com.igetui.api.openservice.igetui.template;
using com.igetui.api.openservice.payload;
using System.Net;
using fw.fwSession;
using fw.fwData;
using System.Net.Mail;

/**
 * 
 * 说明：
 *      此工程是一个测试工程，所用的相关.dll文件，都已经存在protobuffer文件里，需要加载到References里。
 *      工程中还有用到一个System.Web.Extensions文件，这个文件是用到Framework里V4.0版本的，
 *      一般路径如下：C:\Program Files\Reference Assemblies\Microsoft\Framework\.NETFramework\v4.0，
 *      或如下路径：C:\Program Files\Reference Assemblies\Microsoft\Framework\v3.5没有的也可以在protobuffer
 *      文件夹里找到。如再有问题，请直接联系技术客服，谢谢！
 *      GetuiServerApiSDK：此.dll文件为个推C#版本的SDK文件
 *      Google.ProtocolBuffers：此.dll文件为Google的数据交换格式文件
 *  注：
 *      新增一个连接超时时间设置，通过在环境变量--用户变量中增加名为：GETUI_TIMEOUT 的变量（修改环境变量，
       电脑重启后才能生效），值则是超时时间，如不设定，则默认为20秒。
 **/

namespace GetuiServerApiSDK
{
    public class PushMessageBll
    {
        //参数设置 <-----参数需要重新设置----->
        //http的域名
        private static String HOST = "http://sdk.open.api.igexin.com/apiex.htm";

        //https的域名
        //private static String HOST = "https://api.getui.com/apiex.htm";

        //定义常量, appId、appKey、masterSecret 采用本文档 "第二步 获取访问凭证 "中获得的应用配置
        private static String APPID = "o7RindfhfSALFJwgSpeeJ8";  //个推账户songshasha密码Songshasha123
        private static String APPKEY = "AFvXXM7P919QbXCBm8hEA5";
        private static String MASTERSECRET = "8eSBVw1wlq8fB0j9aSQgU4";
       // private static String CLIENTID = "895d125c1489cb75d6c4bdc967f5eec1";
        private static String CLIENTID = "";//ddf730f6cabfa02ebabf06e0c7fc8da0
        private static String DeviceToken = "";  //填写IOS系统的DeviceToken

        //static void Main(string[] args)
        //{
        //    //toList接口每个用户状态返回是否开启，可选
        //    Console.OutputEncoding = Encoding.GetEncoding(936);
        //    Environment.SetEnvironmentVariable("needDetails", "true");

        //    //下为消息推送的四种方式，单独使用时，请注释掉另外三种方法

        //    //对单个用户的推送

        //    PushMessageToSingle(ticket);

        //    //对指定列表用户推送
        //   // PushMessageToList();

        //    //对指定应用群推送
        //   // pushMessageToApp();

        //    //APN简化推送
        //   // apnPush();
        //}

        public static FWResult<bool> PushMessageToSingle(string userId, string taskMessage, string url)
        {
          
            
            
            FWResult<bool> result = new FWResult<bool>();
                 
            Environment.SetEnvironmentVariable("needDetails", "true");
            IGtPush push = new IGtPush(HOST, APPKEY, MASTERSECRET);
            //消息模版：TransmissionTemplate:透传模板
            TransmissionTemplate template = TransmissionTemplate(taskMessage,url);
            //NotificationTemplate template = NotificationTemplate(taskMessage);


            // 单推消息模型
            SingleMessage message = new SingleMessage();
            message.IsOffline = true;                         // 用户当前不在线时，是否离线存储,可选
            message.OfflineExpireTime = 1000 * 3600 * 12;            // 离线有效时间，单位为毫秒，可选
            message.Data = template;
            //判断是否客户端是否wifi环境下推送，2为4G/3G/2G，1为在WIFI环境下，0为不限制环境
            //message.PushNetWorkType = 1;  

            com.igetui.api.openservice.igetui.Target target = new com.igetui.api.openservice.igetui.Target();
            target.appId = APPID;
            Newtonsoft.Json.Linq.JObject obj=null;
            try
            {
            //修改为运维任务对应的clientid 
            CLIENTID = queryClientId(userId);
           
             //判断返回的结果  {"code":0,"message":"成功"}
             obj = Newtonsoft.Json.Linq.JObject.Parse(CLIENTID);

            if (obj["result"].ToString() == "NoCidList")
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add("没有找到任务负责人对应的clientid，推送终止");

            }
            else
            {
                CLIENTID = obj["cidlist"].ToString().Replace("\n", "").Replace(" ", "").Replace("\t", "").Replace("\r", "");
                CLIENTID = CLIENTID.Substring(2, CLIENTID.Length - 2);
                CLIENTID = CLIENTID.Substring(0, CLIENTID.Length - 2);
                result.infoList.Add("clentid为"+CLIENTID);
                target.clientId = CLIENTID;
               // target.clientId = "164b1c8403a3059228d30f42dda30036";
                String pushResult = push.pushMessageToSingle(message, target);
                Newtonsoft.Json.Linq.JObject obj1 = Newtonsoft.Json.Linq.JObject.Parse(pushResult);
                //判断返回的结果  {"code":0,"message":"成功"}
                // string taskid = obj1["taskId"].ToString().Replace("\n", "").Replace(" ", "").Replace("\t", "").Replace("\r", ""); 
                // String ret = push.getPushResult(taskid);             
                //result.infoList.Add(obj1.ToString ());
                result.status = FWResultStatus.Success;
            }             
            }
            catch (RequestException e)
            {
                String requestId = e.RequestId;
                //发送失败后的重发
                String pushResult = push.pushMessageToSingle(message, target, requestId);               
                result.status= FWResultStatus.Failure;
                
            }
            return result;
        }

        //PushMessageToList接口测试代码
        //private static void PushMessageToList()
        //{
        //    // 推送主类（方式1，不可与方式2共存）
        //    IGtPush push = new IGtPush(HOST, APPKEY, MASTERSECRET);
        //    // 推送主类（方式2，不可与方式1共存）此方式可通过获取服务端地址列表判断最快域名后进行消息推送，每10分钟检查一次最快域名
        //    //IGtPush push = new IGtPush("",APPKEY,MASTERSECRET);
        //    ListMessage message = new ListMessage();

        //    NotificationTemplate template = NotificationTemplateDemo();
        //    // 用户当前不在线时，是否离线存储,可选
        //    message.IsOffline = false;
        //    // 离线有效时间，单位为毫秒，可选
        //    message.OfflineExpireTime = 1000 * 3600 * 12;
        //    message.Data = template;
        //    message.PushNetWorkType = 0;        //判断是否客户端是否wifi环境下推送，1为在WIFI环境下，0为不限制网络环境。
        //    //设置接收者
        //    List<com.igetui.api.openservice.igetui.Target> targetList = new List<com.igetui.api.openservice.igetui.Target>();
        //    com.igetui.api.openservice.igetui.Target target1 = new com.igetui.api.openservice.igetui.Target();
        //    target1.appId = APPID;
        //    target1.clientId = CLIENTID;

        //    // 如需要，可以设置多个接收者
        //    //com.igetui.api.openservice.igetui.Target target2 = new com.igetui.api.openservice.igetui.Target();
        //    //target2.AppId = APPID;
        //    //target2.ClientId = "ddf730f6cabfa02ebabf06e0c7fc8da0";

        //    targetList.Add(target1);
        //    //targetList.Add(target2);

        //    String contentId = push.getContentId(message);
        //    String pushResult = push.pushMessageToList(contentId, targetList);
        //    System.Console.WriteLine("-----------------------------------------------");
        //    System.Console.WriteLine("服务端返回结果:" + pushResult);
        //}


        //pushMessageToApp接口测试代码
        //private static void pushMessageToApp()
        //{
        //    // 推送主类（方式1，不可与方式2共存）
        //    IGtPush push = new IGtPush(HOST, APPKEY, MASTERSECRET);
        //    // 推送主类（方式2，不可与方式1共存）此方式可通过获取服务端地址列表判断最快域名后进行消息推送，每10分钟检查一次最快域名
        //    //IGtPush push = new IGtPush("",APPKEY,MASTERSECRET);

        //    AppMessage message = new AppMessage();

        //    // 设置群推接口的推送速度，单位为条/秒，仅对pushMessageToApp（对指定应用群推接口）有效
        //    message.Speed = 100;

        //    TransmissionTemplate template = TransmissionTemplate();

        //    // 用户当前不在线时，是否离线存储,可选
        //    message.IsOffline = true;
        //    // 离线有效时间，单位为毫秒，可选  
        //    message.OfflineExpireTime = 1000 * 3600 * 12;
        //    message.Data = template;
        //    //message.PushNetWorkType = 0;        //判断是否客户端是否wifi环境下推送，1为在WIFI环境下，0为不限制网络环境。
        //    List<String> appIdList = new List<string>();
        //    appIdList.Add(APPID);

        //    //通知接收者的手机操作系统类型
        //    List<String> phoneTypeList = new List<string>();
        //    phoneTypeList.Add("ANDROID");
        //    //phoneTypeList.Add("IOS");
        //    //通知接收者所在省份
        //    List<String> provinceList = new List<string>();
        //    //provinceList.Add("浙江");
        //    //provinceList.Add("上海");
        //    //provinceList.Add("北京");

        //    List<String> tagList = new List<string>();
        //    //tagList.Add("开心");

        //    message.AppIdList = appIdList;
        //    message.PhoneTypeList = phoneTypeList;
        //    message.ProvinceList = provinceList;
        //    message.TagList = tagList;


        //    String pushResult = push.pushMessageToApp(message);
        //    System.Console.WriteLine("-----------------------------------------------");
        //    System.Console.WriteLine("服务端返回结果：" + pushResult);
        //}

        
        //static void apnPush()
        //{
        //    //APN高级推送
        //    IGtPush push = new IGtPush(HOST, APPKEY, MASTERSECRET);
        //    APNTemplate template = new APNTemplate();
        //    APNPayload apnpayload = new APNPayload();
        //    DictionaryAlertMsg alertMsg = new DictionaryAlertMsg();
        //    alertMsg.Body = "";
        //    alertMsg.ActionLocKey = "";
        //    alertMsg.LocKey = "";
        //    alertMsg.addLocArg("");
        //    alertMsg.LaunchImage = "";
        //    //IOS8.2支持字段
        //    alertMsg.Title = "";
        //    alertMsg.TitleLocKey = "";
        //    alertMsg.addTitleLocArg("");

        //    apnpayload.AlertMsg = alertMsg;
        //    apnpayload.Badge = 10;
        //    apnpayload.ContentAvailable = 1;
        //    apnpayload.Category = "";
        //    apnpayload.Sound = "";
        //    apnpayload.addCustomMsg("", "");
        //    template.setAPNInfo(apnpayload);


        //    /*单个用户推送接口*/
        //    //SingleMessage Singlemessage = new SingleMessage();
        //    //Singlemessage.Data = template;
        //    //String pushResult = push.pushAPNMessageToSingle(APPID, DeviceToken, Singlemessage);
        //    //Console.Out.WriteLine(pushResult);

        //    /*多个用户推送接口*/
        //    ListMessage listmessage = new ListMessage();
        //    listmessage.Data = template;
        //    String contentId = push.getAPNContentId(APPID, listmessage);
        //    //Console.Out.WriteLine(contentId);
        //    List<String> devicetokenlist = new List<string>();
        //    devicetokenlist.Add(DeviceToken);
        //    String ret = push.pushAPNMessageToList(APPID, contentId, devicetokenlist);
        //    Console.Out.WriteLine(ret);
        //}
        

        //通知透传模板动作内容
        public static NotificationTemplate NotificationTemplate(string taskMessage)
        {
            NotificationTemplate template = new NotificationTemplate();
            template.AppId = APPID;
            template.AppKey = APPKEY;
            //通知栏标题
            template.Title = "您有一条运维任务到达，请及时处理";
            //通知栏内容     
            template.Text = taskMessage;
            //通知栏显示本地图片
            template.Logo = "";
            //通知栏显示网络图标
            template.LogoURL = "";
            //应用启动类型，1：强制应用启动  2：等待应用启动
            template.TransmissionType = "2";
            //透传内容  
            template.TransmissionContent = "";
            //接收到消息是否响铃，true：响铃 false：不响铃   
            template.IsRing = false;
            //接收到消息是否震动，true：震动 false：不震动   
            template.IsVibrate = true;
            //接收到消息是否可清除，true：可清除 false：不可清除    
            template.IsClearable = true;
            //设置通知定时展示时间，结束时间与开始时间相差需大于6分钟，消息推送后，客户端将在指定时间差内展示消息（误差6分钟）
           // String begin = "2015-03-06 14:36:10";
           // String end = "2015-03-06 14:46:20";
           // template.setDuration(begin, end);

            return template;
        }

        //透传模板动作内容
        public static TransmissionTemplate TransmissionTemplate(string taskMessage, string url)
        {
            TransmissionTemplate template = new TransmissionTemplate();
            template.AppId = APPID;
            template.AppKey = APPKEY;
            //应用启动类型，1：强制应用启动 2：等待应用启动
            template.TransmissionType = "2";
            //透传内容 修改为实际的内容 
        
            template.TransmissionContent = taskMessage;
            
            //设置通知定时展示时间，结束时间与开始时间相差需大于6分钟，消息推送后，客户端将在指定时间差内展示消息（误差6分钟）
            String begin = System.DateTime.Now.ToString();
            String end = System.DateTime.Now.AddDays(2).ToString();
            //template.setDuration(begin, end);

            return template;
        }

        //网页模板内容
        //public static LinkTemplate LinkTemplateDemo()
        //{
        //    LinkTemplate template = new LinkTemplate();
        //    template.AppId = APPID;
        //    template.AppKey = APPKEY;
        //    //通知栏标题
        //    template.Title = "请填写通知标题";
        //    //通知栏内容 
        //    template.Text = "请填写通知内容";
        //    //通知栏显示本地图片 
        //    template.Logo = "";
        //    //通知栏显示网络图标，如无法读取，则显示本地默认图标，可为空
        //    template.LogoURL = "";
        //    //打开的链接地址    
        //    template.Url = "http://www.baidu.com";
        //    //接收到消息是否响铃，true：响铃 false：不响铃   
        //    template.IsRing = true;
        //    //接收到消息是否震动，true：震动 false：不震动   
        //    template.IsVibrate = true;
        //    //接收到消息是否可清除，true：可清除 false：不可清除
        //    template.IsClearable = true;
        //    return template;
        //}

        //通知栏弹框下载模板
        //public static NotyPopLoadTemplate NotyPopLoadTemplateDemo()
        //{
        //    NotyPopLoadTemplate template = new NotyPopLoadTemplate();
        //    template.AppId = APPID;
        //    template.AppKey = APPKEY;
        //    //通知栏标题
        //    template.NotyTitle = "请填写通知标题";
        //    //通知栏内容
        //    template.NotyContent = "请填写通知内容";
        //    //通知栏显示本地图片
        //    template.NotyIcon = "icon.png";
        //    //通知栏显示网络图标
        //    template.LogoURL = "http://www-igexin.qiniudn.com/wp-content/uploads/2013/08/logo_getui1.png";
        //    //弹框显示标题
        //    template.PopTitle = "弹框标题";
        //    //弹框显示内容    
        //    template.PopContent = "弹框内容";
        //    //弹框显示图片    
        //    template.PopImage = "";
        //    //弹框左边按钮显示文本    
        //    template.PopButton1 = "下载";
        //    //弹框右边按钮显示文本    
        //    template.PopButton2 = "取消";
        //    //通知栏显示下载标题
        //    template.LoadTitle = "下载标题";
        //    //通知栏显示下载图标,可为空 
        //    template.LoadIcon = "file://push.png";
        //    //下载地址，不可为空
        //    template.LoadUrl = "http://www.appchina.com/market/d/425201/cop.baidu_0/com.gexin.im.apk ";
        //    //应用安装完成后，是否自动启动
        //    template.IsActived = true;
        //    //下载应用完成后，是否弹出安装界面，true：弹出安装界面，false：手动点击弹出安装界面 
        //    template.IsAutoInstall = true;
        //    //接收到消息是否响铃，true：响铃 false：不响铃
        //    template.IsBelled = true;
        //    //接收到消息是否震动，true：震动 false：不震动   
        //    template.IsVibrationed = true;
        //    //接收到消息是否可清除，true：可清除 false：不可清除    
        //    template.IsCleared = true;
        //    return template;
        //}

        #region 个推相关

        //绑定登录用户id和个推clientid    add by songshasha 2016-11-23  app 调用的时候传入ticket clientId
        public static fw.fwData.FWResult<bool> BindClientId(IFWUserInfo userInfo, string clientId)
        {
            sendMail("1127850073@qq.com", clientId, userInfo.userID+userInfo .userName+"/appid:"+APPID);
            FWResult<bool> result = new FWResult<bool>();
            try
            {
               
                IGtPush push = new IGtPush(HOST, APPKEY, MASTERSECRET);
                //string a = push.queryClientId(APPID, userInfo.userID.Replace("-", ""));
                //if (push.queryClientId(APPID, userInfo.userID.Replace("-", "")) == "{\"result\":\"NoCidList\"}")
                //{
                    String ret = push.bindAlias(APPID, userInfo.userID.Replace("-", ""), clientId);
                    Newtonsoft.Json.Linq.JObject obj = Newtonsoft.Json.Linq.JObject.Parse(ret);
                    //判断返回的结果  {"code":0,"message":"成功"}
                    string thirdResult = obj["result"].ToString();
                    if (thirdResult.Equals("ok"))
                    {

                        result.data = true;
                        
                        result.status = FWResultStatus.Success;
                    }
                    else
                    {
                        result.data = false;
                        result.status = FWResultStatus.Failure;

                    }
                    result.infoList.Add(ret);

                //}
                //else
                //{
                //    result.status = FWResultStatus.Success;
                //    result.infoList.Add("已经绑定id，不会重复绑定");
                //}
            }
            catch (Exception ex)
            {
                result.data = false;
                result.status = FWResultStatus.Failure;
                result.infoList.Add(ex.Message+ex.ToString());
            }
            result.infoList.Add("clientId为"+clientId);       
          return result;
        }

        //查询任务负责人userID绑定的个推clientid（任务没有指定运行人员的时候，默认都推送给系统管理员）    add by songshasha 2016-11-23
        public static String queryClientId(string userID)
        {
              
            //userid是运维人员表中的code，还需要查询到其绑定的用户的code
             IGtPush push = new IGtPush(HOST, APPKEY, MASTERSECRET);
             String clentId="";
             if (userID == "" || userID == null)
             {
                 clentId = push.queryClientId(APPID, "1d7935a7-f808-4cb8-bdde-c9dcbd9465f9".Replace("-","")); //任务没有指定运行人员的时候，默认都推送给系统管理员
             }
             else
             {
                 clentId = push.queryClientId(APPID, userID.Replace("-", ""));
             }
            return clentId;
        }

        #endregion 


        //发送邮件 add by songshasha 2016-12-07
        public static void sendMail(string userEmail,string title,string message)
        {
            System.Net.Mail.MailMessage msg = new System.Net.Mail.MailMessage();
            msg.To.Add(userEmail);
            msg.From = new MailAddress("yeyuruge@163.com", "sysadmin", System.Text.Encoding.UTF8);
            /* 上面3个参数分别是发件人地址（可以随便写），发件人姓名，编码*/
            msg.Subject = title;//邮件标题    
            msg.SubjectEncoding = System.Text.Encoding.UTF8;//邮件标题编码    
            msg.Body = message;//邮件内容    
            msg.BodyEncoding = System.Text.Encoding.UTF8;//邮件内容编码    
            msg.IsBodyHtml = false;//是否是HTML邮件    
            msg.Priority = MailPriority.High;//邮件优先级    
            SmtpClient client = new SmtpClient();
            client.Credentials = new System.Net.NetworkCredential("yeyurugewww@163.com", "shasha");
            //上述写你的GMail邮箱和密码    
            client.Port = 25;//Gmail使用的端口    
            client.Host = "smtp.163.com";
            client.EnableSsl = true;//经过ssl加密    
            object userState = msg;
            try
            {   //暂时不发送邮件 modify by songshasha 2017-11-28
               // client.SendAsync(msg, userState);

                //简单一点儿可以client.Send(msg);    

            }
            catch (System.Net.Mail.SmtpException ex)
            {

            }
            finally
            { }
        }

    }
}
