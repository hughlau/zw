using fw.fwCache;
using fw.fwDal;
using fw.m.sysManage.bll;
using fw.m.sysManage.data.model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Timers;
using System.Web;

/****************************************************************
*   Author：L
*   Time：2020/5/13 10:32:51
*   FrameVersion：4.6.1
*   Description：
*
*****************************************************************/

namespace fw.webApplication.handler
{
    public class TimingTaskHandler
    {
        #region =============属性============
        public static readonly string timingTaskCachePoolName = "BusTimingTask";
        private static readonly object locker = new object();
        public static bool isCache = false;
        public static bool IsStart = false;

        #endregion

        #region ===========构造函数==========



        #endregion

        #region ===========基本方法==========

        private static void _TimingTaskStart_Elapsed(object sender, ElapsedEventArgs e)
        {
            List<MFWTimingTask> list = new List<MFWTimingTask>();
            string key = "mFWTimingTaskList";
            lock (locker)
            {
                FWSqlCommand fwcmd = new FWSqlCommand
                {
                    CommandText = "\r\n                SELECT\r\n\t                tb1.[timingTaskCode] [mTimingTaskCode]\r\n\t                ,tb1.[timingTaskName] [mTimingTaskName]\r\n\t                ,tb1.[timingTypeCode] [mTimingTypeCode]\r\n\t                ,tb1.[taskTypeCode] [mTaskTypeCode]\r\n\t                ,tb1.[timingTaskEntry] [mTimingTaskEntry]\r\n\t                ,tb1.[timingTaskSettings] [mTimingTaskSettings]\r\n\t                ,tb1.[timingTime] [mTimingTime]\r\n\t                ,tb1.[timingSeconds] [mTimingSeconds]\r\n\t                ,tb1.[lastSuccessExecuteTime] [mLastSuccessExecuteTime]\r\n\t                ,tb1.[rem] [mRem]\r\n\t                ,tb1.[ix] [mIx]\r\n\t                ,tb1.[isDis] [mIsDis]\r\n                FROM\r\n\t                [FWTimingTask] tb1"
                };
                list = FWSqlEntityToFWCommandStaticHelper.queryList<MFWTimingTask>(fwcmd);
                FWCacheData<List<MFWTimingTask>> data = new FWCacheData<List<MFWTimingTask>>
                {
                    description = "定时任务列表",
                    data = list,
                    timeout = double.MaxValue
                };
                FWCacheHelper<List<MFWTimingTask>>.set(timingTaskCachePoolName, key, data);
            }
            list = FWCacheHelper<List<MFWTimingTask>>.get(timingTaskCachePoolName, key).data;
            foreach (MFWTimingTask task in list)
            {
                TimeSpan span;
                if ((task == null) || (task.mIsDis != 0))
                {
                    continue;
                }
                bool flag = false;
                switch (task.mTimingTypeCode)
                {
                    case "10":
                        task.mTimingTime = task.mTimingTime.AddYears(DateTime.Now.Year - task.mTimingTime.Year);
                        if (task.mTimingTime.Day > 0x1b)
                        {
                            task.mTimingTime = GetYearMonthLastDateTime(task.mTimingTime);
                        }
                        if ((DateTime.Now >= task.mTimingTime) && (task.mLastSuccessExecuteTime < task.mTimingTime))
                        {
                            flag = true;
                        }
                        break;

                    case "11":
                        task.mTimingTime = task.mTimingTime.AddMonths(((DateTime.Now.Year - task.mTimingTime.Year) * 12) + (DateTime.Now.Month - task.mTimingTime.Month));
                        if (task.mTimingTime.Day > 0x1b)
                        {
                            task.mTimingTime = GetYearMonthLastDateTime(task.mTimingTime);
                        }
                        if ((DateTime.Now >= task.mTimingTime) && (task.mLastSuccessExecuteTime < task.mTimingTime))
                        {
                            flag = true;
                        }
                        break;

                    case "12":
                        span = (TimeSpan)(DateTime.Now - task.mTimingTime);
                        task.mTimingTime = task.mTimingTime.AddDays((double)Convert.ToInt32(span.TotalDays));
                        if ((DateTime.Now >= task.mTimingTime) && (task.mLastSuccessExecuteTime < task.mTimingTime))
                        {
                            flag = true;
                        }
                        break;

                    case "13":
                        span = (TimeSpan)(DateTime.Now - task.mTimingTime);
                        task.mTimingTime = task.mTimingTime.AddHours((double)Convert.ToInt32(span.TotalHours));
                        if ((DateTime.Now >= task.mTimingTime) && (task.mLastSuccessExecuteTime < task.mTimingTime))
                        {
                            flag = true;
                        }
                        break;

                    case "20":
                        span = (TimeSpan)(DateTime.Now - task.mLastSuccessExecuteTime);
                        if (span.TotalSeconds >= task.mTimingSeconds)
                        {
                            flag = true;
                        }
                        break;

                    case "30":
                        if ((DateTime.Now >= task.mTimingTime) && (task.mLastSuccessExecuteTime < task.mTimingTime))
                        {
                            flag = true;
                        }
                        break;

                    case "40":
                        {
                            int num = Convert.ToInt32(DateTime.Now.DayOfWeek);
                            num = (num > 0) ? num : 7;
                            int num2 = num - task.mTimingSeconds;
                            span = (TimeSpan)(DateTime.Now.Date - task.mTimingTime.Date);
                            task.mTimingTime = task.mTimingTime.AddDays((double)(span.Days - num2));
                            if ((DateTime.Now >= task.mTimingTime) && (task.mLastSuccessExecuteTime < task.mTimingTime))
                            {
                                flag = true;
                            }
                            break;
                        }
                    default:
                        flag = false;
                        break;
                }
                if (flag)
                {
                    TimingTaskThread thread = new TimingTaskThread
                    {
                        mFWTimingTask = task
                    };
                    ThreadStart start = new ThreadStart(thread.execute);
                    new Thread(start).Start();
                }
            }
        }

        #endregion

        #region =============方法============

        public static DateTime GetYearMonthLastDateTime(DateTime _DateTime)
        {
            int num = DateTime.DaysInMonth(_DateTime.Year, _DateTime.Month);
            return _DateTime.AddDays((double)(num - _DateTime.Day));
        }

        public static void start()
        {
            if (!IsStart)
            {
                System.Timers.Timer timer = new System.Timers.Timer();
                timer.Elapsed += new ElapsedEventHandler(_TimingTaskStart_Elapsed);
                timer.Interval = 10000.0;
                timer.Enabled = true;
                IsStart = true;
            }
        }

        #endregion
    }
}