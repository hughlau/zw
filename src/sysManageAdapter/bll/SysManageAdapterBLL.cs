using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.m.sysManage.data;
using fw.fwData;
using fw.m.sysManage.bll;
using fw.m.sysManage.data.entity;
using fw.fwDal;
using fw.m.sysManage.aop;
using fw.m.sysManage.data.model;
using fw.m.sysManageAdapter.data;
using System.ServiceModel.Activation;
using System.ServiceModel;
using System.Data;
using fw.fwSession;
using fw.m.sysManage.service;
using fw.m.sysBasicManage.data;
using fw.m.sysBasicManage.service;

namespace fw.m.sysManageAdapter.bll
{
    
    public class SysManageAdapterBll
    {
        public static FWResult<FWDataTable> getTree(IFWUserInfo userInfo, string pCode)
        {
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            var cantonList = basicUserInfo.cantonCodeList; 
            SysManageService MS = new SysManageService();
            string strMerge = "";
            foreach (string canton in cantonList)
            {
                //strMerge += ("'"+canton+"'" + ",");
                strMerge += (canton + "&");
                if (canton == "321282")
                {
                    return MS.getTree("", "BLLCanton");
                }
            }

            DataTable dtAll = MS.getTree("", "BLLCanton").data.toDataTable();
            DataTable table = dtAll.Clone();
           
            string ccode= strMerge.Substring(0, strMerge.Length - 1);
            if (cantonList.Count != 1)
            {
                DataRow dr = table.NewRow();
                dr["code"] = ccode;
                dr["pCode"] = "BLLCanton";
                dr["name"] = "全部";
                dr["leve"] = "0";
                dr["ix"] = "1";
                table.Rows.Add(dr);
            }
            foreach(string canton in cantonList)
            {
                var prows = dtAll.Select("code='" + canton + "'");
                foreach (DataRow row in prows)  // 将查询的结果添加到dt中； 
                {
                    if (cantonList.Count != 1)
                    {
                        row["pCode"] = ccode;
                    }
                    table.Rows.Add(row.ItemArray);
                }
                var rows = dtAll.Select("pCode='" + canton + "'");
                foreach (DataRow row in rows)  // 将查询的结果添加到dt中； 
                {
                    table.Rows.Add(row.ItemArray);
                }
            }

            FWResult<FWDataTable> result=new FWResult<FWDataTable>();
            FWDataTable fdt=new FWDataTable();
            table = table.DefaultView.ToTable(true,"code","pCode","name","leve","ix");
            fdt.loadDataTable(table);
            result.data=fdt;
            result.status = FWResultStatus.Success;
            return result;
        }
    }
}
