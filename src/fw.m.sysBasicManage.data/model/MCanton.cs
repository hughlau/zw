using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using fw.fwDal;

namespace fw.m.sysBasicManage.data.model
{
    /// <summary>
    /// 行政区
    /// </summary>
    [DataContract]
    public class MCanton : FWEntityObject
    {
        private string _cantonCode;

        /// <summary>
        /// 行政区编码
        /// </summary>
        [DataMember]
        public string cantonCode
        {
            get { return _cantonCode; }
            set { _cantonCode = changeValue("cantonCode", _cantonCode, value); }
        }

        private string _cantonName;

        /// <summary>
        /// 行政区名称
        /// </summary>
        [DataMember]
        public string cantonName
        {
            get { return _cantonName; }
            set { _cantonName = changeValue("cantonName", _cantonCode, value); }
        }

        private string _parentCantonCode;

        /// <summary>
        /// 父级行政区编码
        /// </summary>
        [DataMember]
        public string parentCantonCode
        {
            get { return _parentCantonCode; }
            set { _parentCantonCode = changeValue("parentCantonCode", _parentCantonCode, value); }
        }
        private string _parentCantonName;

        ///// <summary>
        ///// 父级行政区名称
        ///// </summary>
        //[DataMember]
        //public string parentCantonName
        //{
        //    get { return _parentCantonName; }
        //    set { _parentCantonName = value; }
        //}

        //private List<MCanton> _childList;

        ///// <summary>
        ///// 子集行政区列表
        ///// </summary>
        //[DataMember]
        //public List<MCanton> childList
        //{
        //    get { return _childList; }
        //    set { _childList = value; }
        //}

        //private int? _cantonLevel;

        ///// <summary>
        ///// 行政区级别
        ///// </summary>
        //[DataMember]
        //public int? cantonLevel
        //{
        //    get { return _cantonLevel; }
        //    set { _cantonLevel = changeValue("cantonLevel", _cantonLevel, value); }
        //}

        //private string _cantonLevelName;

        ///// <summary>
        ///// 行政区级别名称
        ///// </summary>
        //[DataMember]
        //public string cantonLevelName
        //{
        //    get { return _cantonLevelName; }
        //    set { _cantonLevelName = value; }
        //}

        //private decimal? _centerX;

        ///// <summary>
        ///// 经度
        ///// </summary>
        //[DataMember]
        //public decimal? centerX
        //{
        //    get { return _centerX; }
        //    set { _centerX = changeValue("centerX", _centerX, value); }
        //}

        //private decimal? _centerY;

        ///// <summary>
        ///// 纬度
        ///// </summary>
        //[DataMember]
        //public decimal? centerY
        //{
        //    get { return _centerY; }
        //    set { _centerY = changeValue("centerY", _centerY, value); }
        //}

        //private string _helpCode;

        ///// <summary>
        ///// 帮助码
        ///// </summary>
        //[DataMember]
        //public string helpCode
        //{
        //    get { return _helpCode; }
        //    set { _helpCode = changeValue("helpCode", _helpCode, value); }
        //}

        //private string _spellCode;

        ///// <summary>
        ///// 拼写编码
        ///// </summary>
        //[DataMember]
        //public string spellCode
        //{
        //    get { return _spellCode; }
        //    set { _spellCode = changeValue("spellCode", _spellCode, value); }
        //}

        //private string _ucPinYin;

        ///// <summary>
        ///// 拼音
        ///// </summary>
        //[DataMember]
        //public string ucPinYin
        //{
        //    get { return _ucPinYin; }
        //    set { _ucPinYin = changeValue("ucPinYin", _ucPinYin, value); }
        //}

        //private int? _id;

        ///// <summary>
        ///// 自动增长列编号
        ///// </summary>
        //[DataMember]
        //public int? id
        //{
        //    get { return _id; }
        //    set { _id = changeValue("id", _id, value); }
        //}

        //private bool? _isLeaf;

        ///// <summary>
        ///// 是否含有子集
        ///// </summary>
        //[DataMember]
        //public bool? isLeaf
        //{
        //    get { return _isLeaf; }
        //    set { _isLeaf = value; }
        //}

        //private bool? _expanded;

        ///// <summary>
        ///// 否默认展开
        ///// </summary>
        //[DataMember]
        //public bool? expanded
        //{
        //    get { return _expanded; }
        //    set { _expanded = value; }
        //}
    }
}
