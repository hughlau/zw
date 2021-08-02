using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace fw.windowsService
{
    public class UserLog
    {
        string Path = "";
        string service_name = "";
        public UserLog()
        {
            Path = GetRegistryPath();
        }
        public string GetRegistryPath()
        {
            string path = fwConfig.FWConfigHelper.getValue("LogPath");

            if (String.IsNullOrEmpty(path))
            {
                path = "C:\\SCKJ";
            }
            return path;
        }

        public void WriteLog(string sText)
        {
            if (Path == "")
                Path = GetRegistryPath();
            string logFileAbsolutePath = "";
            if (Path.EndsWith("\\"))
                logFileAbsolutePath = Path + "Log" + DateTime.Now.ToString("yyMMdd").ToString() + ".txt";
            else
                logFileAbsolutePath = Path + "\\" + "Log" + DateTime.Now.ToString("yyMMdd").ToString() + ".txt";



            FileStream fs = null;
            StreamWriter sw = null;
            try
            {

                if (!File.Exists(logFileAbsolutePath))
                {
                    string logFolderAbsolutePath = System.IO.Path.GetDirectoryName(logFileAbsolutePath);
                    if (!Directory.Exists(logFolderAbsolutePath))
                    {
                        Directory.CreateDirectory(logFolderAbsolutePath);
                    }
                    fs = File.Create(logFileAbsolutePath);
                }
                else
                {
                    FileInfo fi = new FileInfo(logFileAbsolutePath);
                    fs = new FileStream(logFileAbsolutePath, FileMode.Append, FileAccess.Write);
                }
                sw = new StreamWriter(fs, Encoding.GetEncoding("gb2312"));
                sw.WriteLine("-----"+DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")+"--------------------");
                sw.WriteLine("操作/异常内容："+sText);
                sw.WriteLine();

                if (sw != null)
                {
                    sw.Close();
                }
                if (fs != null)
                {
                    fs.Close();
                }
            }
            catch
            {
                if (sw != null)
                {
                    sw.Close();
                }
                if (fs != null)
                {
                    fs.Close();
                }
            }

        }
         
    }
}
