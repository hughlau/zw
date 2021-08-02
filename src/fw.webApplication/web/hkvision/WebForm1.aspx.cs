using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace fw.webApplication.web.hkvision
{
    public partial class WebForm1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
          // bool  m_bInitSDK = AlarmCSharpDemo.CHCNetSDK.NET_DVR_Init();
            string encryptPwd = fw.fwSafe.FWMD5Helper.encrypt("123123");
        }
    }
}