using System;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Plusoft.Web;
public partial class demo_data_AjaxService : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        new AjaxService(Request, Response);

        //Plusoft.BLL.PositionBLL bll = new Plusoft.BLL.PositionBLL();
        //Response.Write(Plusoft.Utilities.JSON.Encode(bll.GetList()));
    }
    

}