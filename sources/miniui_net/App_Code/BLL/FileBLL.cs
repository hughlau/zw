using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Plusoft.DAL;
using System.Collections;

namespace Plusoft.BLL
{
    public class FileBLL
    {
        FileDAL dal = new FileDAL();

        public string Insert(Hashtable entity)
        {
            return dal.Insert(entity);
        }

        public bool Update(Hashtable entity)
        {
            return dal.Update(entity);
        }

        public bool Delete(string id)
        {
            return dal.Delete(id);
        }

        public Hashtable GetEntity(string id)
        {
            return dal.GetEntity(id);
        }

        public ArrayList GetList()
        {
            return dal.GetList();
        }
    }
}

