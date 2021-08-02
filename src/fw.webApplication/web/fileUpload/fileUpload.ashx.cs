using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using fw.fwConfig;
using fw.m.sysManage.bll;
using fw.m.sysManage.data;

namespace fw.webApplication.web.fileUpload
{
    /// <summary>
    /// fileUpload 的摘要说明
    /// </summary>
    public class fileUpload : IHttpHandler
    {

        /// <summary>
        /// 上传文件的文件夹路径
        /// </summary>
        public static string UploadFolderPath
        {
            get
            {
                return FWConfigHelper.webSiteRelativePath + FWConfigHelper.getValue("uploadFolderPath");
            }
        }
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            HttpPostedFile file = context.Request.Files["FileData"];
            if (file != null)
            {
                if (!string.IsNullOrEmpty(file.FileName))
                {
                    JavaScriptSerializer javaScriptSerializer = new JavaScriptSerializer();
                    string fileExtension = System.IO.Path.GetExtension(file.FileName).ToLower();
                    string uploadFolderAbsolutePath = HttpContext.Current.Server.MapPath(HttpContext.Current.Request.ApplicationPath + "/" + UploadFolderPath + "/");
                    string newFileName = context.Request.Params["name"];
                    string uploadFileAbsolutePath = uploadFolderAbsolutePath + newFileName;
                    if (!Directory.Exists(uploadFolderAbsolutePath))
                    {
                        Directory.CreateDirectory(uploadFolderAbsolutePath);
                    }
                    file.SaveAs(uploadFileAbsolutePath);
                   
                }

            }

        }
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}