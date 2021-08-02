using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Plusoft.DAL;
using System.Collections;

namespace Plusoft.BLL
{
    public class PositionBLL
    {
        PositionDAL dal = new PositionDAL();

        public ArrayList GetList()
        {
            return dal.GetList();
        }

        public ArrayList GetPositionsByDepartmenId(string departmentId)
        {
            return dal.GetPositionsByDepartmenId(departmentId);
        }
    }
}

