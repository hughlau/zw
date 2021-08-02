using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Plusoft.DAL;
using System.Collections;

namespace Plusoft.BLL
{
    public class EducationalBLL
    {
        EducationalDAL dal = new EducationalDAL();

        public ArrayList GetList()
        {
            return dal.GetList();
        }
    }
}

