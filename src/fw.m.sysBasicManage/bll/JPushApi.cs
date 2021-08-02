using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using cn.jpush.api;
using cn.jpush.api.common;
using cn.jpush.api.common.resp;
using cn.jpush.api.push.mode;
using cn.jpush.api.push.notification;

namespace fw.m.sysBasicManage.bll
{
    public class JPushApi
    {
        public static String TITLE = "Test from C# v3 sdk";
        public static String ALERT = "Test from  C# v3 sdk - alert";
        public static String MSG_CONTENT = "Test from C# v3 sdk - msgContent";
        public static String REGISTRATION_ID = "0900e8d85ef";
        public static String TAG = "tag_api";
        public static String app_key = fw.fwConfig.FWConfigHelper.getValue("app_key");
        public static String master_secret = fw.fwConfig.FWConfigHelper.getValue("master_secret");
        //public static String app_key = "997f28c1cea5a9f17d82079a";
        //public static String master_secret = "47d264a3c02a6a5a4a256a45";

        public static string JPublish(string userid, string content)
        {
            List<string> useridList = new List<string>();
            useridList.Add(userid);
            return JPublish(useridList, content);
        }

        public static string JPublish(List<string> userid, string content)
        {
            string retStr = "";
            fwLog.FWLogHelper.writeLog("*****开始发送******");
            JPushClient client = new JPushClient(app_key, master_secret);
            //PushPayload payload = PushObject_All_All_Alert();
            try
            {

                PushPayload pushPayload = new PushPayload();
                pushPayload.platform = Platform.all();
                pushPayload.audience = Audience.all();  // 推送所有目标	
                //pushPayload.audience = Audience.s_tag("wang", "junju");//推送给多个标签（只要任意一个标签满足）
                //pushPayload.audience = Audience.s_alias("4314", "892", "4531");//推送给多个别名	
                //pushPayload.audience = Audience.s_alias("wangjunju");
                //pushPayload.audience = Audience.s_registrationId("060c291c633");
                //pushPayload.notification = new Notification().setAlert(content);
                Dictionary<string,object> d=new Dictionary<string, object>();
                d["u"] = "18505127807@omPerson";
                if (content == "1")
                {
                    d["p"] = "personTask-1";
                }
                else
                {
                    d["p"] = "444";
                }
                d["d"] = null;
                string v = fw.fwJson.FWJsonHelper.serializeObject(d);
                pushPayload.notification = new Notification()
                               .setAlert(ALERT)
                               .setAndroid(new AndroidNotification()
                                             .AddExtra("fwMessage", v)).setIos(new IosNotification().AddExtra("fwMessage", v));


                var result = client.SendPush(pushPayload);
                System.Threading.Thread.Sleep(10000);
                /*如需查询上次推送结果执行下面的代码*/
                var apiResult = client.getReceivedApi(result.msg_id.ToString());
                var apiResultv3 = client.getReceivedApi_v3(result.msg_id.ToString());

                retStr = "发送成功";
            }
            catch (APIRequestException e)
            {
                retStr += "Error response from JPush server. Should review and fix it. ";
                retStr += "HTTP Status: " + e.Status;
                retStr += "Error Code: " + e.ErrorCode;
                retStr += "Error Message: " + e.ErrorCode;

                fwLog.FWLogHelper.writeLog(retStr);
            }
            catch (APIConnectionException e)
            {
                fwLog.FWLogHelper.writeLog(e.Message);
                retStr += e.Message;
            }
            fwLog.FWLogHelper.writeLog("*****结束发送******");
            return retStr;
        }
        public static PushPayload PushObject_All_All_Alert()
        {
            PushPayload pushPayload = new PushPayload();
            pushPayload.platform = Platform.all();
            pushPayload.audience = Audience.all();
            pushPayload.notification = new Notification().setAlert(ALERT);
            return pushPayload;
        }
        public static PushPayload PushObject_all_alias_alert()
        {

            PushPayload pushPayload = new PushPayload();
            pushPayload.platform = Platform.android();
            pushPayload.audience = Audience.s_alias("alias1");
            pushPayload.notification = new Notification().setAlert(ALERT);
            return pushPayload;

        }
        public static PushPayload PushObject_Android_Tag_AlertWithTitle()
        {
            PushPayload pushPayload = new PushPayload();

            pushPayload.platform = Platform.android();
            pushPayload.audience = Audience.s_tag("tag1");
            pushPayload.notification = Notification.android(ALERT, TITLE);

            return pushPayload;
        }
        public static PushPayload PushObject_android_and_ios()
        {
            PushPayload pushPayload = new PushPayload();
            pushPayload.platform = Platform.android_ios();
            var audience = Audience.s_tag("tag1");
            pushPayload.audience = audience;
            var notification = new Notification().setAlert("alert content");
            notification.AndroidNotification = new AndroidNotification().setTitle("Android Title");
            notification.IosNotification = new IosNotification();
            notification.IosNotification.incrBadge(1);
            notification.IosNotification.AddExtra("extra_key", "extra_value");

            pushPayload.notification = notification.Check();


            return pushPayload;
        }
        public static PushPayload PushObject_ios_tagAnd_alertWithExtrasAndMessage()
        {
            PushPayload pushPayload = new PushPayload();
            pushPayload.platform = Platform.android_ios();
            pushPayload.audience = Audience.s_tag_and("tag1", "tag_all");
            var notification = new Notification();
            notification.IosNotification = new IosNotification().setAlert(ALERT).setBadge(5).setSound("happy").AddExtra("from", "JPush");

            pushPayload.notification = notification;
            pushPayload.message = Message.content(MSG_CONTENT);
            return pushPayload;

        }
        public static PushPayload PushObject_ios_audienceMore_messageWithExtras()
        {

            var pushPayload = new PushPayload();
            pushPayload.platform = Platform.android_ios();
            pushPayload.audience = Audience.s_tag("tag1", "tag2");
            pushPayload.message = Message.content(MSG_CONTENT).AddExtras("from", "JPush");
            return pushPayload;

        }
    }
}
