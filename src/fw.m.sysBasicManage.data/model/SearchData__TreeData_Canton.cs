using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace fw.m.sysBasicManage.data.model
{
    /// <summary>
    /// 树形数据(行政区)
    /// </summary>
    [DataContract,Serializable]
    public class SearchData__TreeData_Canton
    {

        /// <summary>
        /// 编码
        /// </summary>
        [DataMember]
        public String Code
        {
            set { _Code = value; }
            get { return _Code; }
        }
        private String _Code;

        /// <summary>
        /// 父类编码
        /// </summary>
        private String _ParentCode;
        [DataMember]
        public String ParentCode
        {
            set { _ParentCode = value; }
            get { return _ParentCode; }
        }

        /// <summary>
        /// 名称
        /// </summary>
        [DataMember]
        public String Name
        {
            set { _Name = value; }
            get { return _Name; }
        }
        private String _Name;

        /// <summary>
        /// 子级数据
        /// </summary>
        [DataMember]
        public List<SearchData__TreeData_Canton> ChildTreeDataList
        {
            set { _ChildTreeDataList = value; }
            get { return _ChildTreeDataList; }
        }
        private List<SearchData__TreeData_Canton> _ChildTreeDataList = new List<SearchData__TreeData_Canton>();

        /// <summary>
        /// 行政区登级
        /// </summary>
        [DataMember]
        public Int32 Level
        {
            set { _Level = value; }
            get { return _Level; }
        }
        private Int32 _Level;

        /// <summary>
        ///经度
        /// </summary>
        private Double? _Longitude;
        [DataMember]
        public Double? Longitude
        {
            set { _Longitude = value; }
            get { return _Longitude; }
        }

        /// <summary>
        ///纬度
        /// </summary>
        private Double? _Latitude;
        [DataMember]
        public Double? Latitude
        {
            set { _Latitude = value; }
            get { return _Latitude; }
        }



    }
}
