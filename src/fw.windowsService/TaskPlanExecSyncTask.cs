using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.m.operationMaintenance.bll;

namespace fw.windowsService
{
    public class TaskPlanExecSyncTask
    {
        UserLog log = new UserLog();
        //
        public void DoWork()
        {
            try
            {
                int days = int.Parse(fwConfig.FWConfigHelper.getValue("DaysBefore"));
                OperationMaintenanceTaskPlanBll.taskPlanExec(days);
                OperationMaintenanceTaskBll.autoGenerateTask();
                log.WriteLog("执行完毕");
            }
            catch (Exception ex)
            {
                log.WriteLog(ex.Message);
            }
        }
    }
}
