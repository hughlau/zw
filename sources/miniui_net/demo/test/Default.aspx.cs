using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

using Plusoft.BLL;
using Newtonsoft.Json;
using System.Collections;

public partial class demo_test_Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        EmployeeBLL employeeBLL = new EmployeeBLL();
        //ArrayList list = employeeBLL.GetList();
        //string json = JsonConvert.SerializeObject(list);
        //Response.Write(json);

        DepartmentBLL departmentBLL = new DepartmentBLL();
        ArrayList list2 = departmentBLL.GetList();
        string json2 = JsonConvert.SerializeObject(list2);
        //Response.Write(json2);


        //Hashtable o = new Hashtable();
        //o["name"] = "ddd";

        //string id = departmentBLL.Insert(o);
        //Response.Write(id);

        departmentBLL.Delete("e16c8d94-35c2-4074-9bf3-652bdfb778a7");

    }
}