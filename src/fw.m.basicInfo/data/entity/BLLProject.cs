using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.fwDal;

namespace fw.m.basicInfo.data.entity
{
    public class BLLProject : FWEntityObject
    {
        private string _projectCode;

        /// <summary>
        /// 项目编码
        /// </summary>
        public string projectCode
        {
            get { return _projectCode; }
            set { _projectCode = changeValue("projectCode", _projectCode, value); }
        }

        private string _projectName;

        /// <summary>
        /// 项目名称
        /// </summary>
        public string projectName
        {
            get { return _projectName; }
            set { _projectName = changeValue("projectName", _projectName, value); }
        }

        private string _projectNo;

        /// <summary>
        ///项目代号
        /// </summary>
       
        public string projectNo
        {
            get { return _projectNo; }
            set { _projectNo = changeValue("projectNo", _projectNo, value); }
        }


        private string _cantonCode;

        /// <summary>
        /// 厂区编码
        /// </summary>
        public string cantonCode
        {
            get { return _cantonCode; }
            set { _cantonCode = changeValue("cantonCode", _cantonCode, value); }
        }


        private DateTime? _operateTime;

        /// <summary>
        /// 投运时间
        /// </summary>
        public DateTime? operateTime
        {
            get { return _operateTime; }
            set { _operateTime = changeValue("operateTime", _operateTime, value); }
        }


        private int? _equipmentAmount;

        /// <summary>
        /// 设备个数
        /// </summary>
        public int? equipmentAmount
        {
            get { return _equipmentAmount; }
            set { _equipmentAmount = changeValue("equipmentAmount", _equipmentAmount, value); }
        }

        private double? _longitude;

        /// <summary>
        /// 经度
        /// </summary>
        public double? longitude
        {
            get { return _longitude; }
            set { _longitude = changeValue("longitude", _longitude, value); }
        }

        private double? _latitude;

        /// <summary>
        /// 维度
        /// </summary>
        public double? latitude
        {
            get { return _latitude; }
            set { _latitude = changeValue("latitude", _latitude, value); }
        }
        private string _rem;

        /// <summary>
        /// 备注
        /// </summary>
        public string rem
        {
            get { return _rem; }
            set { _rem = changeValue("rem", _rem, value); }
        }

        private int? _isDel;

        /// <summary>
        ///  是否删除
        /// </summary>
        public int? isDel
        {
            get { return _isDel; }
            set { _isDel = changeValue("isDel", _isDel, value); }
        }


        private string _createrID;

        /// <summary>
        /// 创建人
        /// </summary>
        public string createrID
        {
            get { return _createrID; }
            set { _createrID = changeValue("createrID", _createrID, value); }
        }

        private DateTime? _createTime;

        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime? createTime
        {
            get { return _createTime; }
            set { _createTime = changeValue("createTime", _createTime, value); }
        }

        private string _updaterID;

        /// <summary>
        /// 更新人
        /// </summary>
        public string updaterID
        {
            get { return _updaterID; }
            set { _updaterID = changeValue("updaterID", _updaterID, value); }
        }

        private DateTime? _updateTime;

        /// <summary>
        /// 更新时间
        /// </summary>
        public DateTime? updateTime
        {
            get { return _updateTime; }
            set { _updateTime = changeValue("updateTime", _updateTime, value); }
        }
    }
}
