using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading;
using System.Timers;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;
using fw.m.basicInfo.bll;
using fw.m.Common;
using fw.m.Common.mq;
using fw.m.operationMaintenance.bll;
using fw.webApplication.handler;

namespace fw.webApplication
{
    public class Global : System.Web.HttpApplication
    {
        public static bool isde=false;
        protected void Application_Start(object sender, EventArgs e)
        {

            QueueInfoHandler.instance.Start();
            TimingTaskHandler.start();
            WeatherHandler.instance.Start();


        }

        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {

        }

        protected void Application_Error(object sender, EventArgs e)
        {

            //Exception ex = Server.GetLastError();
            ////实际发生的异常
            //Exception iex = ex.InnerException;
            //string errorMsg = String.Empty;
            //string particular = String.Empty;
            //if (iex != null)
            //{
            //    errorMsg = iex.Message;
            //    particular = iex.StackTrace;
            //}
            //else
            //{
            //    errorMsg = ex.Message;
            //    particular = ex.StackTrace;
            //}
            //HttpContext.Current.Response.Write("用户过期，请重新登录！");
            //Server.ClearError();
        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {

        }
    }
}