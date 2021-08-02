using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace fw.m.Common
{
    public class MessageResult
    {
        public bool isSuccess { get; set; }

        public string SuccessResult { get; set; }

        public string FailResult { get; set; }

        public string ToSaveString()
        {
            if (isSuccess)
            {
                return (string.IsNullOrEmpty(SuccessResult) ? "成功！" : SuccessResult);
            }
            else
            {
                return (string.IsNullOrEmpty(FailResult) ? "失败！" : FailResult);
            }
            
        }

        public string ToShowString()
        {
            if (isSuccess)
            {
                return (string.IsNullOrEmpty(SuccessResult) ? "成功！" : SuccessResult);
            }
            else
            {
                return (string.IsNullOrEmpty(FailResult) ? "失败！" : FailResult);
            }

        }
    }
}
