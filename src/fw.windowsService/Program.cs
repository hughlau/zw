using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading;

namespace fw.windowsService
{
    static class Program
    {
        /// <summary>
        /// 应用程序的主入口点。
        /// </summary>
        static void Main()
        {
            new TaskPlanExecSyncTask().DoWork();
            return;
            //ServiceBase[] ServicesToRun;
            //ServicesToRun = new ServiceBase[] 
            //{  
            //    new TaskPlanExecSync()
            //};
            //ServiceBase.Run(ServicesToRun); 
        }
    }
}
