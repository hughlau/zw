using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using fw.m.userLogin.data.model;

namespace fw.m.sysBasicManage.data.model
{
    /// <summary>
    /// 系统日志表扩展
    /// </summary>
    [DataContract]
    public class MFWSystemLogEx:MFWSystemLog
    { 

         private String _mBllModuleNameEx;

         /// <summary>
         /// 模块名扩展
         /// </summary>
         [DataMember]
         public String mBllModuleNameEx
         {
             get { return _mBllModuleNameEx; }
             set { _mBllModuleNameEx = value; }
         }


         private String _mFunctionNameEx;

         /// <summary>
         /// 功能名扩展
         /// </summary>
         [DataMember]
         public String mFunctionNameEx
         {
             get { return _mFunctionNameEx; }
             set { _mFunctionNameEx = value; }
         }

         private String _mStatusNameEx;

         /// <summary>
         /// 执行状态名称
         /// </summary>
         [DataMember]
         public String mStatusNameEx
         {
             get { return _mStatusNameEx; }
             set { _mStatusNameEx = value; }
         }
    }
}
