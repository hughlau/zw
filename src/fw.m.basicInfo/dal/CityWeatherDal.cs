using fw.fwDal;
using fw.m.basicInfo.data.entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.basicInfo.dal
{
    public class CityWeatherDal
    {
        public static BLLCityWeather GetWeather(int year,int month,int day)
        {
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@"SELECT  [id]
                  ,[city]
                  ,[cityId]
                  ,[temp1]
                  ,[temp]
                  ,[temp2]
                  ,[weather]
                  ,[year]
                  ,[month]
                  ,[day]
                  ,[createTime]
              FROM [dbo].[BLLCityWeather] 
            WHERE  year={0} and month={1} and  day={2}",year,month,day);
            sqlCmd.CommandText = sbSql.ToString();
            return FWSqlEntityToFWCommandStaticHelper.query<BLLCityWeather>(sqlCmd);
        }

        public static IFWCommand insert(BLLCityWeather entity)
        {

                return FWSqlEntityToFWCommandStaticHelper.insert<BLLCityWeather>(entity);

        }
    }
}
