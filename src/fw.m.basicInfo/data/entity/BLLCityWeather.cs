using fw.fwDal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace fw.m.basicInfo.data.entity
{
    [DataContract]
    public class BLLCityWeather : FWEntityObject
    {
        private int _id;

        /// <summary>
        ///  主键
        /// </summary>
        [DataMember]
        public int id
        {
            get { return _id; }
            set { _id = changeValue("id", _id, value); }
        }

        private string _city;

        /// <summary>
        ///  城市名
        /// </summary>
        [DataMember]
        public string city
        {
            get { return _city; }
            set { _city = changeValue("city", _city, value); }
        }

        private string _cityId;

        /// <summary>
        ///  城市编码
        /// </summary>
        [DataMember]
        public string cityId
        {
            get { return _cityId; }
            set { _cityId = changeValue("cityId", _cityId, value); }
        }

        private string _temp1;

        /// <summary>
        ///  最低温度
        /// </summary>
        [DataMember]
        public string temp1
        {
            get { return _temp1; }
            set { _temp1 = changeValue("temp1", _temp1, value); }
        }

        private string _temp2;

        /// <summary>
        ///  最高温度
        /// </summary>
        [DataMember]
        public string temp2
        {
            get { return _temp2; }
            set { _temp2 = changeValue("temp2", _temp2, value); }
        }

        private string _temp;

        /// <summary>
        ///  当前温度
        /// </summary>
        [DataMember]
        public string temp
        {
            get { return _temp; }
            set { _temp = changeValue("temp", _temp, value); }
        }

        private string _weather;

        /// <summary>
        ///  天气
        /// </summary>
        [DataMember]
        public string weather
        {
            get { return _weather; }
            set { _weather = changeValue("weather", _weather, value); }
        }

        private int _year;

        /// <summary>
        ///  年
        /// </summary>
        [DataMember]
        public int year
        {
            get { return _year; }
            set { _year = changeValue("year", _year, value); }
        }

        private int _month;

        /// <summary>
        ///  月
        /// </summary>
        [DataMember]
        public int month
        {
            get { return _month; }
            set { _month = changeValue("month", _month, value); }
        }

        private int _day;

        /// <summary>
        ///  日
        /// </summary>
        [DataMember]
        public int day
        {
            get { return _day; }
            set { _day = changeValue("day", _day, value); }
        }

        private DateTime _createTime;

        /// <summary>
        ///  创建时间
        /// </summary>
        [DataMember]
        public DateTime createTime
        {
            get { return _createTime; }
            set { _createTime = changeValue("createTime", _createTime, value); }
        }

        
    }
}
