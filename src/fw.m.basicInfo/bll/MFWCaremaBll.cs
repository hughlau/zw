using System;
using System.Collections.Generic;
using System.Text;
using fw.fwDal;
using fw.fwData;
using fw.m.basicInfo.data;
using fw.m.basicInfo.data.model;
using fw.m.sysBasicManage.data;

namespace fw.m.basicInfo.bll
{
    public class MFWCaremaBll
    {
        //查询摄像机
        public static FWResult<FWPageData<MFWCarema>> QueryPageCamera(SysBasicManageUserInfo userInfo,
            FWPageParams pageParams, QueryTaskParams queryParams)
        {
            var result = new FWResult<FWPageData<MFWCarema>>();
            var sqlbuilder = new StringBuilder();
            sqlbuilder.Append(
                @"SELECT [id],[IPAddress],[longitudeGps],[latitudeGps],[cameraName],[addressName] FROM [dbo].[FWCamera] where 1=1");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.IPAddress))
                {
                    sqlbuilder.AppendFormat(@" and IPAddress like '%{0}%'", queryParams.IPAddress);
                }
                if (!string.IsNullOrEmpty(queryParams.addressName))
                {
                    sqlbuilder.AppendFormat(@" and addressName like '%{0}%'", queryParams.addressName);
                }
                if (!string.IsNullOrEmpty(queryParams.cameraName))
                {
                    sqlbuilder.AppendFormat(@" and cameraName like '%{0}%'", queryParams.cameraName);
                }
                if (queryParams.id.HasValue)
                {
                    sqlbuilder.AppendFormat(@" and id={0}", queryParams.id.Value);
                }
            } 
            sqlbuilder.Append(" order by [id],[IPAddress],[cameraName]");

            var fwPageProcedureParams = new FWSqlPageProcedureParams
            {
                sql = sqlbuilder.ToString(),
                pageSize = pageParams.pageSize,
                pageIndex = pageParams.pageIndex
            };
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MFWCarema>(fwPageProcedureParams);
                result.status = FWResultStatus.Success;
            }

            catch (Exception ex)
            {
                result.infoList.Add("查询摄像机出错。错误在：【queryPageCamera】" + ex.Message);
            }
            return result;
        }

        //新增或更新摄像机
        public static FWResult<bool> InsertOrUpdateCaremaById(SysBasicManageUserInfo userInfo, MFWCarema mEntity)
        {
            var result = new FWResult<bool>();
            var fwSqlTransaction = new FWSqlTransaction();
            try
            {
                fwSqlTransaction.BeginTransaction();
                var sqlbuilder = new StringBuilder();
                if (mEntity.id == -1)
                {
                    sqlbuilder.AppendFormat(
                        @"insert into [dbo].[FWCamera] ([IPAddress],[longitudeGps],[latitudeGps],[cameraName],[addressName]) values('{0}','{1}','{2}','{3}','{4}')",
                        mEntity.IPAddress, mEntity.longitudeGps, mEntity.latitudeGps, mEntity.cameraName,mEntity.addressName);
                }
                else
                {
                    sqlbuilder.AppendFormat(
                        @"update [dbo].[FWCamera] set IPAddress='{0}',longitudeGps='{1}',latitudeGps='{2}',cameraName='{3}',addressName='{4}' where id={5};",
                        mEntity.IPAddress, mEntity.longitudeGps, mEntity.latitudeGps, mEntity.cameraName,
                        mEntity.addressName, mEntity.id);
                }
                var sqlCmd = new FWSqlCommand {CommandText = sqlbuilder.ToString()};
                FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlTransaction, sqlCmd);

                result.status = FWResultStatus.Success;
                fwSqlTransaction.Commit();
            }
            catch (Exception e)
            {
                result.infoList.Add(" 新增或更新摄像机失败。错误在【InsertOrUpdateCaremaById】" + e.Message);
                fwSqlTransaction.Rollback();
                fwSqlTransaction.Close();
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        // 摄像机批量级联删除操作
        public static FWResult<bool> DelCameraByIdCascade(SysBasicManageUserInfo userInfo, List<long> cameraIdList)
        {
            var result = new FWResult<bool>();
            if (cameraIdList.Count <= 0)
            {
                result.data = false;
                result.status = FWResultStatus.Failure;
                result.infoList.Add("未选择要删除的摄像机！");
                return result;
            }

            var fwSqlCommand = new FWSqlCommand
            {
                CommandText = string.Format(@"DELETE FROM [dbo].[FWCamera] WHERE  [id] in ({0})",
                    FWSqlCommandStaticHelper.joinToSqlString(cameraIdList))
            };

            try
            {
                result.data = FWSqlCommandStaticHelper.ExecuteNonQuery(fwSqlCommand) > 0;
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Error;
            }
            return result;
        }

    }
}
