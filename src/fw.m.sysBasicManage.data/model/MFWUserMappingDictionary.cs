using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using fw.fwDal;

namespace fw.m.sysBasicManage.data.model
{

    /// <summary>
    /// 角色字典对应表
    /// </summary> 
    [DataContract, Serializable]
    public class MFWUserMappingDictionary : FWEntityObject
    {
 
         
        /// <summary>
        /// 变主键
        /// </summary>
        [DataMember]
        public string mDataID
        {
            get { return _mDataID; }
            set { _mDataID = changeValue("mDataID", _mDataID, value); }
        }
        private string _mDataID;

        /// <summary>
        /// 角色编号
        /// </summary>
        [DataMember]
        public string mUserID
        {
            get { return _mUserID; }
            set { _mUserID = changeValue("mUserID", _mUserID, value); }
        }
        private string _mUserID;

        /// <summary>
        /// 字典表主键
        /// </summary>
        [DataMember]
        public String mDictionaryDataID
        {
            set { _mDictionaryDataID = changeValue("mDictionaryDataID", mDictionaryDataID, value); }
            get { return _mDictionaryDataID; }
        }
        private String _mDictionaryDataID;

    }
}
