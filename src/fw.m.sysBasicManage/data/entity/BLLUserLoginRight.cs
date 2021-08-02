using fw.fwDal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.basicInfo.data.entity
{
    public class BLLUserLoginRight : FWEntityObject
    {
        private string _code{get;set;}
        [DataMember]
        public string code
        {
            get { return _code; }
            set { _code = changeValue("code", _code, value); }
        }


        private string _userId{get;set;}
        [DataMember]
        public string userId
        {
            get { return _userId; }
            set { _userId = changeValue("userId", _userId, value); }
        }

        private int _loginRight{get;set;}
        [DataMember]
        public int loginRight
        {
            get { return _loginRight; }
            set { _loginRight = changeValue("loginRight", _loginRight, value); }
        }

        private DateTime? _LoginTime{get;set;}
        /// <summary>
        /// 登录权限：1、靖江市内；2、与上一次登录位置距离/时间；3、无控制
        /// </summary>
        [DataMember]
        public DateTime? LoginTime
        {
            get { return _LoginTime; }
            set { _LoginTime = changeValue("LoginTime", _LoginTime, value); }
        }

        private float? _LoginLon{get;set;}
        /// <summary>
        /// 登录经度
        /// </summary>
        [DataMember]
        public float? LoginLon
        {
            get { return _LoginLon; }
            set { _LoginLon = changeValue("LoginLon", _LoginLon, value); }
        }

        private float? _LoginLat {get;set;}
        /// <summary>
        /// 登录纬度
        /// </summary>
        [DataMember]
        public float? LoginLat
        {
            get { return _LoginLat; }
            set { _LoginLat = changeValue("LoginLat", _LoginLat, value); }
        }

        private string _createUserId{get;set;}
        [DataMember]
        public string createUserId
        {
            get { return _createUserId; }
            set { _createUserId = changeValue("createUserId", _createUserId, value); }
        }

        private DateTime _createTime{get;set;}
        [DataMember]
        public DateTime createTime
        {
            get { return _createTime; }
            set { _createTime = changeValue("createTime", _createTime, value); }
        }

        private string _updateUserId { get; set; }
        [DataMember]
        public string updateUserId
        {
            get { return _updateUserId; }
            set { _updateUserId = changeValue("updateUserId", _updateUserId, value); }
        }

        private DateTime _updateTime { get; set; }
        [DataMember]
        public DateTime updateTime
        {
            get { return _updateTime; }
            set { _updateTime = changeValue("updateTime", _updateTime, value); }
        }
    }
}
