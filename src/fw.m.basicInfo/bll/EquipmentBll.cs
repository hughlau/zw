using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using fw.m.Common;
using fw.m.basicInfo.data.model;
using fw.fwData;
using fw.fwSession;
using fw.m.basicInfo.data;
using fw.m.basicInfo.data.entity;
using fw.fwDal;
using fw.m.basicInfo.dal;
using fw.m.sysBasicManage.bll;
using fw.m.sysBasicManage.data;
using fw.m.sysBasicManage.service;
using System.Net;
using System.IO;
using System.Configuration;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Data;
using fw.fwDataTable;
using fw.fwSafe;

namespace fw.m.basicInfo.bll
{
    /// <summary>
    /// 设备及零部件
    /// </summary>
    public class EquipmentBll
    {
        #region 1零部件模块




        #region 零部件查询
        public static FWResult<FWPageData<MBLLEquipmentPart>> queryPageEquipmentPart(IFWUserInfo userInfo, FWPageParams pageParams, QueryEquipmentPartParams queryParams)
        {
            FWResult<FWPageData<MBLLEquipmentPart>> result = new FWResult<FWPageData<MBLLEquipmentPart>>();
            StringBuilder sqlbuilder = new StringBuilder();
            sqlbuilder.AppendFormat(@"
SELECT 
ep.[partCode]
,ep.[partName]
,ep.[partType]
,pt.name  partTypeName
,ep.recoverType
,pt1.name recoverTypeName
,ep.[partSpecification]
,ep.[ix]
,ep.[isDel]
,ep.[creater]
,ep.[createTime]
,ep.[updater]
,ep.[updateTime]
FROM [dbo].[BLLEquipmentPart] ep
LEFT JOIN dbo.FWDictionary pt ON ep.partType=pt.code AND pt.dictionaryTypeCode='{0}'
LEFT JOIN dbo.FWDictionary pt1 ON ep.recoverType=pt1.code AND pt1.dictionaryTypeCode='{1}'
WHERE ISNULL(ep.isDel,0)=0  ", DictionaryTypeCodeSettings.BIZEQPartType, DictionaryTypeCodeSettings.BIZEQPartRecover);
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.keyWord))
                {
                    sqlbuilder.AppendFormat(@" AND  ep.[partName] like '%{0}%' ", FWSqlCommandStaticHelper.checkParam(queryParams.keyWord));
                }
                if (!string.IsNullOrEmpty(queryParams.partType))
                {
                    sqlbuilder.AppendFormat(@" AND  ep.[partType] ='{0}' ", FWSqlCommandStaticHelper.checkParam(queryParams.partType));
                }
                if (!string.IsNullOrEmpty(queryParams.recoverType))
                {
                    sqlbuilder.AppendFormat(@" AND  ep.[recoverType] ='{0}' ", FWSqlCommandStaticHelper.checkParam(queryParams.recoverType));
                }
            }
            sqlbuilder.Append(@" order by ");
            if (pageParams.sortFieldList != null && pageParams.sortFieldList.Count > 0)
            {
                foreach (FWSortField fwSortField in pageParams.sortFieldList)
                {
                    switch (fwSortField.fieldName)
                    {
                        case "operateTime":
                            fwSortField.fieldName = "monitorSite.[operateTime]";
                            break;
                        case "cantonName":
                            fwSortField.fieldName = "monitorSite.[cantonCode]";
                            break;
                    }
                    sqlbuilder.AppendFormat(@"{0} {1},", fwSortField.fieldName,
                        fwSortField.sortType == FWSortType.Desc ? "desc" : "asc");
                }
                sqlbuilder.Remove(sqlbuilder.Length - 1, 1);
            }
            else
            {
                sqlbuilder.AppendFormat(" ep.[ix],ep.[updateTime] desc  ");
            }
            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MBLLEquipmentPart>(fwPageProcedureParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询零部件列表出错。错误在：【queryPageEquipmentPart】" + ex.Message.ToString());
                result.status = FWResultStatus.Error;
            }
            return result;
        }

        public static FWResult<MBLLEquipmentPart> queryEquipmentPart(IFWUserInfo userInfo, string partCode)
        {
            FWResult<MBLLEquipmentPart> result = new FWResult<MBLLEquipmentPart>();

            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@"
SELECT 
ep.[partCode]
,ep.[partName]
,ep.[partType]
,pt.name  partTypeName
,ep.[partSpecification]
,ep.[ix]
,ep.[isDel]
,ep.[creater]
,ep.[createTime]
,ep.[updater]
,ep.[updateTime]
FROM [dbo].[BLLEquipmentPart] ep
LEFT JOIN dbo.FWDictionary pt ON ep.partType=pt.code AND pt.dictionaryTypeCode='{0}'
WHERE 1<>1  ", DictionaryTypeCodeSettings.BIZEQPartType);
            if (!string.IsNullOrEmpty(partCode))
            {
                sbSql.AppendFormat(@" or  ep.[partCode] ='{0}' ", FWSqlCommandStaticHelper.checkParam(partCode));
            }
            sqlCmd.CommandText = sbSql.ToString();
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.query<MBLLEquipmentPart>(sqlCmd);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        public static FWResult<List<MBLLEquipmentPart>> queryEquipmentPartAll()
        {
            FWResult<List<MBLLEquipmentPart>> result = new FWResult<List<MBLLEquipmentPart>>();

            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@"
SELECT 
ep.[partCode]
,ep.[partName]
,ep.[partType]
,pt.name  partTypeName
,ep.[partSpecification]
,ep.[ix]
,ep.[isDel]
,ep.[creater]
,ep.[createTime]
,ep.[updater]
,ep.[updateTime]
FROM [dbo].[BLLEquipmentPart] ep
LEFT JOIN dbo.FWDictionary pt ON ep.partType=pt.code AND pt.dictionaryTypeCode='{0}'
WHERE ISNULL(ep.isDel,0)=0 
   ", DictionaryTypeCodeSettings.BIZEQPartType);

            sqlCmd.CommandText = sbSql.ToString();
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MBLLEquipmentPart>(sqlCmd);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        public static FWResult<BLLEquipment> queryEquipmentByNo(string equipmentNo)
        {
            FWResult<BLLEquipment> result = new FWResult<BLLEquipment>();
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat($"select * from BLLEquipment where  equipmentNo='{equipmentNo}'");
            
            sqlCmd.CommandText = sbSql.ToString();
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.query<BLLEquipment>(sqlCmd);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        #endregion

        #region  零部件新增/更新
        public static void defaultEquipmentPartEntity(IFWUserInfo userInfo, BLLEquipmentPart entity)
        {
            if (entity != null)
            {
                if (string.IsNullOrEmpty(entity.partCode))
                {
                    entity.creater = userInfo.userName;
                    entity.createTime = DateTime.Now;
                    entity.partCode = Guid.NewGuid().ToString();
                }
                entity.updater = userInfo.userName;
                entity.updateTime = DateTime.Now;
            }
        }
        public static FWResult<bool> inserOrUpdateMBLLEquipmentPart(IFWUserInfo userInfo, MBLLEquipmentPart mEntity)
        {
            return inserOrUpdateBLLEquipmentPart(userInfo, basicInfoBll.convertEntity<BLLEquipmentPart>(mEntity), null);
        }
        public static FWResult<bool> inserOrUpdateBLLEquipmentPart(IFWUserInfo userInfo, BLLEquipmentPart entity, IFWTransaction transaction)
        {
            FWResult<bool> result = new FWResult<bool>();
            defaultEquipmentPartEntity(userInfo, entity);
            entity.isDel = entity.isDel.HasValue ? entity.isDel : 0;
            try
            {
                var dbresult = EquipmentDal.inserOrUpdateBLLEquipmentPartByPartCode(entity, transaction);
                result.data = (dbresult.dbResultStatus == FWDBResultStatus.Success);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Error;
            }
            return result;
        }
        #endregion

        #region 零部件删除
        public static FWResult<bool> deleteMEquipmentPartByPartCodeList(IFWUserInfo userInfo, List<string> partCodeList)
        {
            FWResult<bool> result = new FWResult<bool>();
            if (partCodeList == null || partCodeList.Count <= 0)
            {
                result.data = false;
                result.status = FWResultStatus.Failure;
                result.infoList.Add("参数 partCodeList 不能为空！");
                return result;
            }
            var cmdList = EquipmentDal.deleteMEquipmentPartByPartCode(partCodeList);
            try
            {
                result.data = FWSqlCommandStaticHelper.ExecuteNonQuery(cmdList) > 0;
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Error;
            }
            return result;
        }
        #endregion

        #region 移动端
        /// <summary>
        /// 查询所有零部件
        /// </summary>
        /// <param name="userInfo"></param>
        /// <returns></returns>
        public static FWResult<List<MBLLEquipmentPart>> queryEquipmentPartForMobile(IFWUserInfo userInfo)
        {
            FWResult<List<MBLLEquipmentPart>> result = new FWResult<List<MBLLEquipmentPart>>();

            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@"
SELECT 
ep.[partCode]
,ep.[partName]
,ep.[partType]
,pt.name  partTypeName
,ep.[partSpecification]
,ep.[ix]
,ep.[isDel]
,ep.[creater]
,ep.[createTime]
,ep.[updater]
,ep.[updateTime]
FROM [dbo].[BLLEquipmentPart] ep
LEFT JOIN dbo.FWDictionary pt ON ep.partType=pt.code AND pt.dictionaryTypeCode='{0}'
WHERE 1=1 and isDel = 0  ", DictionaryTypeCodeSettings.BIZEQPartType);
            sqlCmd.CommandText = sbSql.ToString();
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MBLLEquipmentPart>(sqlCmd);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Failure;
            }
            return result;
        }
        #endregion

        #endregion

        #region 2设备模块

        #region 设备查询
        /// <summary>
        /// 分页
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="pageParams"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        public static FWResult<FWPageData<MBLLEquipment>> queryPageEquipment(IFWUserInfo userInfo, FWPageParams pageParams, QueryEquipmentParams queryParams)
        {
            FWResult<FWPageData<MBLLEquipment>> result = new FWResult<FWPageData<MBLLEquipment>>();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            SysBasicManageService service = new SysBasicManageService();
            if (basicUserInfo == null || basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            StringBuilder sqlbuilder = new StringBuilder();
            sqlbuilder.AppendFormat(@"
SELECT  
 eq.[equipmentCode]
,eq.[equipmentNo]
,eq.[equipmentName]
,eq.[cantonCode]
,canton.fullname cantonName
,eq.[equipmentTypeCode]
,eqt.name equipmentTypeName  
,eq.isScrap
,eq.[isDel]
,eq.[creater]
,eq.[createTime]
,eq.[updater]
,eq.[updateTime]
,ms.monitorSiteCode
,ms.monitorSiteName
,dics.name equipmentStatusName
,eqs.equipmentStatusCode
,eq.acceptanceTime
,moduletype.code moduleTypeCode
,moduletype.name as moduleTypeName
,eq.remark
FROM  [dbo].[BLLEquipment] eq 
INNER JOIN
(
SELECT  [equipmentCode],
CASE  WHEN ISNULL([isScrap],0)=1 THEN -1  
WHEN  [monitorSiteCode] IS NULL THEN 0
ELSE  1 END  equipmentStatusCode  FROM  [dbo].[BLLEquipment]
) eqs ON eq.equipmentCode=eqs.equipmentCode
LEFT JOIN dbo.FWDictionary  eqt  ON convert(varchar,eq.equipmentTypeCode)=eqt.code AND eqt.dictionaryTypeCode='{0}'
LEFT JOIN dbo.FWDictionary canton ON eq.cantonCode=canton.code AND canton.dictionaryTypeCode='{1}'
LEFT JOIN dbo.FWDictionary  dics  ON convert(varchar,eqs.equipmentStatusCode)=dics.code AND dics.dictionaryTypeCode='{2}'
LEFT JOIN dbo.FWDictionary moduletype ON eq.moduleTypeCode=moduletype.code AND moduletype.dictionaryTypeCode='{3}'
LEFT JOIN dbo.BLLMonitorSite ms  ON ms.monitorSiteCode=eq.monitorSiteCode ", DictionaryTypeCodeSettings.BLLEquipmentType, DictionaryTypeCodeSettings.BLLCanton, DictionaryTypeCodeSettings.BLLEquipmentStatus,DictionaryTypeCodeSettings.BLLModuleType);
          
            sqlbuilder.AppendFormat(@" WHERE  ISNULL(eq.isDel,0)=0 ");
            if (!string.IsNullOrEmpty(queryParams.projectNo))
            {
                sqlbuilder.AppendFormat(@" and ms.projectNo= '{0}'",
                    FWSqlCommandStaticHelper.checkParam(queryParams.projectNo));
            }
            
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.keyWord))
                {
                    sqlbuilder.AppendFormat(@" AND    (eq.[equipmentNo] like '%{0}%'  or ms.monitorSiteName like '%{0}%' or canton.fullname like '%{0}%' )   ", FWSqlCommandStaticHelper.checkParam(queryParams.keyWord));
                }
                if (!string.IsNullOrEmpty(queryParams.equipmentStatusCode))
                {
                    sqlbuilder.AppendFormat(@" AND  eqs.equipmentStatusCode='{0}'  ", FWSqlCommandStaticHelper.checkParam(queryParams.equipmentStatusCode));
                }
                if (!string.IsNullOrEmpty(queryParams.equipmentTypeCode))
                {
                    sqlbuilder.AppendFormat(@" AND  eq.[equipmentTypeCode]='{0}'  ", FWSqlCommandStaticHelper.checkParam(queryParams.equipmentTypeCode));
                }

                if (!string.IsNullOrEmpty(queryParams.cantonCode))
                {
                    var listCarton = new List<string> { queryParams.cantonCode };
                    sqlbuilder.AppendFormat(@" AND  ({0})  ", SysBasicManageBll.CartonToStr("eq.cantonCode", listCarton));
                }
                if (!String.IsNullOrEmpty(queryParams.noBelongSite))
                {
                    if (queryParams.noBelongSite.Equals("0"))
                    {
                        sqlbuilder.AppendFormat(@" and ((eq.monitorSiteCode is null or eq.monitorSiteCode = '')");
                        if (!String.IsNullOrEmpty(queryParams.monitorSiteCode))
                        {
                            sqlbuilder.AppendFormat(@" or (eq.monitorSiteCode = '" + queryParams.monitorSiteCode + "')");
                        }
                        sqlbuilder.AppendFormat(")");
                    }
                }
                
              


            }

            //Roger 2016/6/1 13:00:02 增加管辖区域
            sqlbuilder.AppendFormat(@" AND ({0})  ", SysBasicManageBll.CartonToStr("eq.cantonCode", basicUserInfo.cantonCodeList));


            sqlbuilder.Append(@" order by ");
            if (pageParams.sortFieldList != null && pageParams.sortFieldList.Count > 0)
            {
                foreach (FWSortField fwSortField in pageParams.sortFieldList)
                {
                    switch (fwSortField.fieldName)
                    {
                        
                        case "cantonName":
                            fwSortField.fieldName = "canton.name";
                            break;
                    }
                    sqlbuilder.AppendFormat(@"{0} {1},", fwSortField.fieldName,
                        fwSortField.sortType == FWSortType.Desc ? "desc" : "asc");
                }
                sqlbuilder.Remove(sqlbuilder.Length - 1, 1);
            }
            else
            {
                sqlbuilder.AppendFormat("  eq.[updateTime] desc, eq.[equipmentNo] ");
            }

            //sqlbuilder.Append(@" order by eq.[updateTime] desc, eq.[equipmentNo]  ");
            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MBLLEquipment>(fwPageProcedureParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询零部件列表出错。错误在：【queryPageEquipment】" + ex.Message.ToString());
                result.status = FWResultStatus.Error;
            }
            return result;
        }
        /// <summary>
        /// 实体
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="equipmentCode"></param>
        /// <returns></returns>
        public static FWResult<MBLLEquipment> queryEquipment(IFWUserInfo userInfo, string equipmentCode)
        {

            //string encryptPwd = FWMD5Helper.encrypt("changshu01");
            FWResult<MBLLEquipment> result = new FWResult<MBLLEquipment>();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@" 
SELECT  
 eq.[equipmentCode]
,eq.[equipmentNo]
,eq.[equipmentName]
,eq.[cantonCode]
,canton.name cantonName
,eq.[equipmentTypeCode]
,eqt.name equipmentTypeName  
,eq.isScrap
,eq.[isDel]
,eq.[creater]
,eq.[createTime]
,eq.[updater]
,eq.[updateTime]
,ms.monitorSiteCode
,ms.monitorSiteName 
,eq.acceptanceTime
,eq.remark
,moduletype.code as moduleTypeCode
,moduletype.name as moduleTypeName
FROM  [dbo].[BLLEquipment] eq  
LEFT JOIN dbo.FWDictionary  eqt  ON convert(varchar,eq.equipmentTypeCode)=eqt.code AND eqt.dictionaryTypeCode='{0}'
LEFT JOIN dbo.FWDictionary canton ON eq.cantonCode=canton.code AND canton.dictionaryTypeCode='{1}' 
LEFT JOIN dbo.FWDictionary moduletype ON eq.moduleTypeCode=moduletype.code AND moduletype.dictionaryTypeCode='{2}'
LEFT JOIN dbo.BLLMonitorSite ms  ON ms.monitorSiteCode=eq.monitorSiteCode 
WHERE  1<>1    ", DictionaryTypeCodeSettings.BLLEquipmentType, DictionaryTypeCodeSettings.BLLCanton, DictionaryTypeCodeSettings.BLLModuleType);
            if (!string.IsNullOrEmpty(equipmentCode))
            {
                //sbSql.AppendFormat(@" or  (eq.[equipmentCode] ='{0}' and ({1})) ", FWSqlCommandStaticHelper.checkParam(equipmentCode), SysBasicManageBll.CartonToStr("eq.cantonCode", basicUserInfo.cantonCodeList));
                //行政区过滤 暂时移除
                sbSql.AppendFormat(@" or  (eq.[equipmentCode] ='{0}' and ISNULL(eq.isDel,0)=0 ) ", FWSqlCommandStaticHelper.checkParam(equipmentCode));
            }
            sqlCmd.CommandText = sbSql.ToString();
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.query<MBLLEquipment>(sqlCmd);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        /// <summary>
        /// 列表
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="monitorSiteCode"></param>
        /// <returns></returns>
        public static FWResult<List<MBLLEquipment>> queryEquipmentByMonitorSite(IFWUserInfo userInfo, string monitorSiteCode)
        {
            FWResult<List<MBLLEquipment>> result = new FWResult<List<MBLLEquipment>>();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@"
SELECT  
 eq.[equipmentCode]
,eq.[equipmentNo]
,eq.[equipmentName]
,eq.[cantonCode]
,canton.name cantonName
,eq.[equipmentTypeCode]
,eqt.name equipmentTypeName  
,eq.isScrap
,eq.[isDel]
,eq.[creater]
,eq.[createTime]
,eq.[updater]
,eq.[updateTime]
,ms.monitorSiteCode
,ms.monitorSiteName
,dics.name equipmentStatusName
,eqs.equipmentStatusCode
,eq.acceptanceTime
,eq.supplier
,eq.supplierMark
FROM  [dbo].[BLLEquipment] eq  WITH (NOLOCK) 
INNER JOIN
(
SELECT  [equipmentCode],
CASE  WHEN ISNULL([isScrap],0)=1 THEN -1  
WHEN  [monitorSiteCode] IS NULL THEN 0
ELSE  1 END  equipmentStatusCode  FROM  [dbo].[BLLEquipment] WITH (NOLOCK) 
) eqs ON eq.equipmentCode=eqs.equipmentCode
left JOIN dbo.FWDictionary  eqt  ON eq.equipmentTypeCode=eqt.code AND eqt.dictionaryTypeCode='{0}'
inner JOIN dbo.FWDictionary canton ON eq.cantonCode=canton.code AND canton.dictionaryTypeCode='{1}'
inner JOIN dbo.FWDictionary  dics  ON eqs.equipmentStatusCode=dics.code AND dics.dictionaryTypeCode='{2}' 
LEFT JOIN dbo.BLLMonitorSite  ms WITH (NOLOCK)   ON ms.monitorSiteCode=eq.monitorSiteCode
WHERE  ISNULL(eq.isDel,0)=0 ", DictionaryTypeCodeSettings.BLLEquipmentType, DictionaryTypeCodeSettings.BLLCanton, DictionaryTypeCodeSettings.BLLEquipmentStatus);
            if (!string.IsNullOrEmpty(monitorSiteCode))
            {
                sbSql.AppendFormat(@" and  (eq.[monitorSiteCode] ='{0}' and ({1})) ", FWSqlCommandStaticHelper.checkParam(monitorSiteCode), SysBasicManageBll.CartonToStr("eq.cantonCode", basicUserInfo.cantonCodeList));
            }
            sqlCmd.CommandText = sbSql.ToString();
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MBLLEquipment>(sqlCmd);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        #endregion

        #region  新增/更新
        public static void defaultEquipmentEntity(IFWUserInfo userInfo, BLLEquipment entity)
        {
            if (entity != null)
            {
                if (string.IsNullOrEmpty(entity.equipmentCode))
                {
                    entity.equipmentCode = Guid.NewGuid().ToString();
                    entity.creater = userInfo.userName;
                    entity.createTime = DateTime.Now;
                }
                entity.updater = userInfo.userName;
                entity.updateTime = DateTime.Now;
            }
        }
        public static FWResult<bool> inserOrUpdateMBLLEquipment(IFWUserInfo userInfo, MBLLEquipment mEntity)
        {
            return inserOrUpdateBLLEquipment(userInfo, basicInfoBll.convertEntity<BLLEquipment>(mEntity), null);
        }
        public static FWResult<bool> inserOrUpdateBLLEquipment(IFWUserInfo userInfo, BLLEquipment entity, IFWTransaction transaction)
        {
            FWResult<bool> result = new FWResult<bool>();
            #region 重复 验证

            //判断设备编码 是否重复
            result = MBLLEquipmentNoCheck(entity);
            if (result.status != FWResultStatus.Success)
            {
                //throw new Exception(result.infoList.Aggregate((pre, next) => pre + ";" + next));
                return result;
            }

            #endregion

            defaultEquipmentEntity(userInfo, entity);
            entity.isDel = entity.isDel.HasValue ? entity.isDel : 0;
            entity.isScrap = entity.isScrap.HasValue ? entity.isScrap : 0;
            try
            {
                var dbresult = EquipmentDal.inserOrUpdateBLLEquipmentByEquipmentCode(entity, transaction);
                result.data = (dbresult.dbResultStatus == FWDBResultStatus.Success);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Error;
            }
            return result;
        }

        /// <summary>
        /// 更新状态 
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="entity"></param>
        /// <param name="equipmentCodeList"></param>
        /// <returns></returns>
        public static FWResult<bool> updateMBLLEquipmentByEquipmentCodeList(IFWUserInfo userInfo, BLLEquipment entity, List<string> equipmentCodeList)
        {
            FWResult<bool> result = new FWResult<bool>();
            if (equipmentCodeList == null || equipmentCodeList.Count <= 0)
            {
                result.data = false;
                result.status = FWResultStatus.Failure;
                result.infoList.Add("参数 equipmentCodeList 不能为空！");
                return result;
            }
            var cmdList = EquipmentDal.updateMBLLEquipmentByEquipmentCodeList(entity, equipmentCodeList);
            try
            {
                result.data = FWSqlCommandStaticHelper.ExecuteNonQuery(cmdList) > 0;
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Error;
            }
            return result;
        }
        #endregion

        #region 设备
        public static FWResult<bool> deleteMEquipmentByCodeList(IFWUserInfo userInfo, List<string> equipmentCodeList)
        {
            FWResult<bool> result = new FWResult<bool>();
            if (equipmentCodeList == null || equipmentCodeList.Count <= 0)
            {
                result.data = false;
                result.status = FWResultStatus.Failure;
                result.infoList.Add("参数 equipmentCodeList 不能为空！");
                return result;
            }
            var cmdList = EquipmentDal.deleteMEquipmentByPartCode(equipmentCodeList);
            try
            {
                result.data = FWSqlCommandStaticHelper.ExecuteNonQuery(cmdList) > 0;
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Error;
            }
            return result;
        }
        #endregion

        #region 移动端
        public static FWResult<MBLLEquipment> queryEquipmentForMobile(IFWUserInfo userInfo, string equipmentCode)
        {

            FWResult<MBLLEquipment> result = new FWResult<MBLLEquipment>();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            SysBasicManageService service = new SysBasicManageService();
            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }


            if (string.IsNullOrEmpty(equipmentCode))
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add("参数equipmentCode不能为空！");
                return result;
            }
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@"
SELECT  
 eq.[equipmentCode]
,eq.[equipmentNo]
,eq.[equipmentName]
,eq.[cantonCode]
,canton.name cantonName
,eq.[equipmentTypeCode]
,eqt.name equipmentTypeName  
,eq.isScrap
,eq.[isDel]
,eq.[creater]
,eq.[createTime]
,eq.[updater]
,eq.[updateTime]
,ms.monitorSiteCode
,ms.monitorSiteName
,dics.name equipmentStatusName
,eqs.equipmentStatusCode
,eq.acceptanceTime
FROM  [dbo].[BLLEquipment] eq  WITH (NOLOCK) 
INNER JOIN
(
SELECT  [equipmentCode],
CASE  WHEN ISNULL([isScrap],0)=1 THEN -1  
WHEN  [monitorSiteCode] IS NULL THEN 0
ELSE  1 END  equipmentStatusCode  FROM  [dbo].[BLLEquipment] WITH (NOLOCK) 
) eqs ON eq.equipmentCode=eqs.equipmentCode
LEFT JOIN dbo.FWDictionary  eqt  ON convert(varchar,eq.equipmentTypeCode)=eqt.code AND eqt.dictionaryTypeCode='{0}'
LEFT JOIN dbo.FWDictionary canton ON eq.cantonCode=canton.code AND canton.dictionaryTypeCode='{1}'
LEFT JOIN dbo.FWDictionary  dics  ON convert(varchar,eqs.equipmentStatusCode)=dics.code AND dics.dictionaryTypeCode='{2}'
LEFT JOIN dbo.BLLMonitorSite  ms WITH (NOLOCK)   ON ms.monitorSiteCode=eq.monitorSiteCode  
WHERE  ISNULL(eq.isDel,0)=0 and  eq.moduleTypeCode= '1' AND eq.equipmentCode='{3}'  ", DictionaryTypeCodeSettings.BLLEquipmentType, DictionaryTypeCodeSettings.BLLCanton, DictionaryTypeCodeSettings.BLLEquipmentStatus, FWSqlCommandStaticHelper.checkParam(equipmentCode));

            //Roger 2016/6/1 13:00:02 增加管辖区域
            //sbSql.AppendFormat(@" AND ({0})  ", SysBasicManageBll.CartonToStr("eq.cantonCode", basicUserInfo.cantonCodeList));

            sqlCmd.CommandText = sbSql.ToString();
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.query<MBLLEquipment>(sqlCmd);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add(ex.Message);
                result.status = FWResultStatus.Failure;
            }
            return result;
        }
        #endregion
 
        #endregion

        #region 数据验证
        /// <summary>
        /// 设备编码  重复验证
        /// </summary>
        /// <param name="mEntity"></param>
        /// <returns></returns>
        public static FWResult<bool> MBLLEquipmentNoCheck(BLLEquipment mEntity)
        {
            FWResult<bool> result = new FWResult<bool>();
            //if (mEntity == null || string.IsNullOrEmpty(mEntity.equipmentNo))
            //{
            //    result.data = false;
            //    result.status = FWResultStatus.Error;
            //    result.infoList.Add("设备编码不能为空！");
            //    return result;
            //}
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            sbSql.AppendFormat(@" 
SELECT *  FROM  [dbo].[BLLEquipment]
  where isnull([isDel],0)=0   AND [equipmentNo]='{0}'  {1} ", FWSqlCommandStaticHelper.checkParam(mEntity.equipmentNo),
                     string.IsNullOrEmpty(mEntity.equipmentCode) ? "" : string.Format(@" and equipmentCode<>'{0}' ", FWSqlCommandStaticHelper.checkParam(mEntity.equipmentCode)));


            try
            {
                fwSqlCommand.CommandText = sbSql.ToString();
                var entityList = FWSqlEntityToFWCommandStaticHelper.queryList<BLLEquipment>(fwSqlCommand);
                if (entityList != null && entityList.Count > 0)
                {
                    result.status = FWResultStatus.Failure;
                    result.infoList.Add("设备编码已存在！");
                }
                else
                {
                    result.status = FWResultStatus.Success;
                }

            }
            catch (Exception ex)
            {
                result.data = false;
                result.status = FWResultStatus.Error;
                result.infoList.Add(ex.Message);
            }

            return result;
        }
        #endregion

        #region 风机设备列表查询
        public static FWResult<List<MBLLEquipment>> queryPageEquipReCtr(IFWUserInfo userInfo, QueryEquipmentParams queryParams)
        {
            FWResult<List<MBLLEquipment>> result = new FWResult<List<MBLLEquipment>>();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            SysBasicManageService service = new SysBasicManageService();
            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            StringBuilder sqlbuilder = new StringBuilder();
            sqlbuilder.AppendFormat(@"
SELECT  
 eq.[equipmentCode]
,eq.[equipmentNo]
,eq.[equipmentName]
,eq.[cantonCode]
,canton.name cantonName
,eq.[equipmentTypeCode]
,eqt.name equipmentTypeName  
,eq.isScrap
,eq.[isDel]
,eq.[creater]
,eq.[createTime]
,eq.[updater]
,eq.[updateTime]
,ms.monitorSiteCode
,ms.monitorSiteName
,dics.name equipmentStatusName
,eqs.equipmentStatusCode
,eq.acceptanceTime
FROM  [dbo].[BLLEquipment] eq 
INNER JOIN
(
SELECT  [equipmentCode],
CASE  WHEN ISNULL([isScrap],0)=1 THEN -1  
WHEN  [monitorSiteCode] IS NULL THEN 0
ELSE  1 END  equipmentStatusCode  FROM  [dbo].[BLLEquipment]
) eqs ON eq.equipmentCode=eqs.equipmentCode
LEFT JOIN dbo.FWDictionary  eqt  ON convert(varchar,eq.equipmentTypeCode)=eqt.code AND eqt.dictionaryTypeCode='{0}'
LEFT JOIN dbo.FWDictionary canton ON eq.cantonCode=canton.code AND canton.dictionaryTypeCode='{1}'
LEFT JOIN dbo.FWDictionary  dics  ON convert(varchar,eqs.equipmentStatusCode)=dics.code AND dics.dictionaryTypeCode='{2}'
LEFT JOIN dbo.BLLMonitorSite ms  ON ms.monitorSiteCode=eq.monitorSiteCode
WHERE  ISNULL(eq.isDel,0)=0  and   eq.moduleTypeCode= '1' ", DictionaryTypeCodeSettings.BLLEquipmentType, DictionaryTypeCodeSettings.BLLCanton, DictionaryTypeCodeSettings.BLLEquipmentStatus);
            if (queryParams != null)
            {
                if (queryParams.equipmentNoList != null)
                {
                    if (queryParams.equipmentNoList.Count > 0)
                    { 
                        sqlbuilder.AppendFormat(@" and eq.equipmentNo in ({0})", queryParams.equipmentNoList.Select(p=>string.Format("'{0}'",p)).Aggregate((p,next)=>p+","+next));
                    }
                }
            } 
 
            //Roger 2016/6/1 13:00:02 增加管辖区域
            sqlbuilder.AppendFormat(@" AND ({0})  ", SysBasicManageBll.CartonToStr("eq.cantonCode", basicUserInfo.cantonCodeList));

            sqlbuilder.AppendFormat(@"ORDER BY eq.equipmentNo"); 
            FWSqlCommand fwSqlCommand = new FWSqlCommand();
            fwSqlCommand.CommandText = sqlbuilder.ToString();
            result.data = FWSqlEntityToFWCommandStaticHelper.queryList<MBLLEquipment>(fwSqlCommand);
            if (result.data != null)
            {
                result.status = FWResultStatus.Success;
            }
            return result;
        }
        //设置反控

        public static void defaultEntityReCtr(IFWUserInfo userInfo, BLLEquipmentReCtrData entity)
        {
            if (string.IsNullOrEmpty(entity.ReCtrID))
            {
                entity.ReCtrID = Guid.NewGuid().ToString();
            }
            if (!entity.ReCtrSampTime.HasValue)
            {
                entity.ReCtrSampTime = DateTime.Now;
            }
        }
      public static FWResult<bool> InsertOrUpdateEquipReCtrList(IFWUserInfo userInfo, List<MBLLEquipmentReCtrData> mEntityList)
        {
            FWResult<bool> result = new FWResult<bool>();
            FWResult<bool> resultSingle = new FWResult<bool>();
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            try
            {
               // fwSqlTransaction.BeginTransaction();
                if (mEntityList == null)
                {
                    return new FWResult<bool>()
                    {
                        status = FWResultStatus.Error
                    };
                }
                foreach (MBLLEquipmentReCtrData entity in mEntityList)
                {
                   resultSingle = InsertEquipReCtr(userInfo, entity);
                    if(resultSingle .status ==FWResultStatus .Failure)
                    {
                        result.status = FWResultStatus.Failure;
                        result.infoList.Add(entity .equipmentNo.ToString ()+"反控失败");
                    }
                }
              
               // fwSqlTransaction.Commit();
                //result.data = true;
                //result.status = FWResultStatus.Success;
            }
            catch (FWException ex)
            {
                fwSqlTransaction.Rollback();
                result.status = FWResultStatus.Error;
                result.infoList.Add(ex.ToString());
            }
            return result;
        }


        /// <summary>
        /// dtu参数设置 sss 2016-9-21
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="mEntityList"></param>
        /// <returns></returns>
        public static FWResult<bool> SetDtuParamList(IFWUserInfo userInfo, List<MBLLDtuParamData> mEntityList)
        {
            FWResult<bool> result = new FWResult<bool>();
            FWResult<bool> resultSingle = new FWResult<bool>();
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            try
            {
                fwSqlTransaction.BeginTransaction();
                if (mEntityList == null)
                {
                    return new FWResult<bool>()
                    {
                        status = FWResultStatus.Error
                    };
                }
                foreach (MBLLDtuParamData entity in mEntityList)
                {
                    resultSingle = SetDtuParam(userInfo, entity);
                    if (resultSingle.status == FWResultStatus.Failure)
                    {
                        result.infoList.Add(entity.dtuMac + "数据上报时间间隔设置失败");
                    }
                }
                fwSqlTransaction.Commit();
                result.data = true;
                result.status = FWResultStatus.Success;
            }
            catch (FWException ex)
            {
                fwSqlTransaction.Rollback();
                result.status = FWResultStatus.Error;
                result.infoList.Add(ex.ToString());
            }
            return result;
        }
         /// <summary>
        /// 风机反控和平台对接  sss 2016-9-21
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="mEntity"></param>
        /// <returns></returns>
        public static FWResult<bool> InsertEquipReCtr(IFWUserInfo userInfo, MBLLEquipmentReCtrData mEntity)
        {

           
            FWResult<bool> result = new FWResult<bool>();
            try
            {
                string cmd = "0x00";//空气泵控制命令格式：0x00：打开；0x01：关闭，默认打开
                if (mEntity.Action ==0)
                {
                    cmd = "0x01";
                }
                //目前支持类型：ZL-DCJ-06
                //if (mEntity.equipmentType == "0" || mEntity.equipmentType == "1")
                //{
                    string thirdServiceUrl = ConfigurationManager.AppSettings["thirdServiceUrl"];
                    //String url = thirdServiceUrl+"readRealLTUData?ltuMac=00000000001E&ltuType=0";
                    string cmdOpenType = "0x00"; //设置气泵打开方式为手动,才能反控设备
                    String urlOpenTypeSet = thirdServiceUrl + "pumpConfigCmd1?ltuMac=" + mEntity.equipmentNo + "&ltuType=" + mEntity.equipmentType + "&cmd=" + cmdOpenType;
                    System.Net.HttpWebRequest myRequestOpenTypeSet = (HttpWebRequest)HttpWebRequest.Create(urlOpenTypeSet);
                    myRequestOpenTypeSet.Method = "POST";
                    myRequestOpenTypeSet.ContentType = "text/xml;charset=utf-8";
                  //  HttpWebResponse myResponseOpenTypeSet = (HttpWebResponse)myRequestOpenTypeSet.GetResponse();
                    using (HttpWebResponse myResponseOpenTypeSet = (HttpWebResponse)myRequestOpenTypeSet.GetResponse())
                    {
                        StreamReader mysr = new StreamReader(myResponseOpenTypeSet.GetResponseStream(), Encoding.UTF8);
                        string responseResult = mysr.ReadToEnd();
                        Newtonsoft.Json.Linq.JObject obj = Newtonsoft.Json.Linq.JObject.Parse(responseResult);
                        //判断返回的结果  {"code":0,"message":"成功"}
                        string thirdResult = obj["message"].ToString();
                        if (thirdResult.Equals("成功"))
                        {



                        }
                        else
                        {
                            result.status = FWResultStatus.Failure;                         
                            return result;
                        }
                    }




                    String url = thirdServiceUrl + "pumpControlCmd2?ltuMac="+mEntity .equipmentNo+"&ltuType=" + mEntity.equipmentType+ "&cmd=" + cmd;
                    System.Net.HttpWebRequest myRequest = (HttpWebRequest)HttpWebRequest.Create(url);
                    myRequest.Method = "POST";
                    myRequest.ContentType = "text/xml;charset=utf-8";
                    using (HttpWebResponse myResponse = (HttpWebResponse)myRequest.GetResponse())
                    {
                        StreamReader mysr = new StreamReader(myResponse.GetResponseStream(), Encoding.UTF8);
                        string responseResult = mysr.ReadToEnd();
                        Newtonsoft.Json.Linq.JObject obj = Newtonsoft.Json.Linq.JObject.Parse(responseResult);
                        //判断返回的结果  {"code":0,"message":"成功"}
                        string thirdResult = obj["message"].ToString();
                        if (thirdResult.Equals("成功"))
                        {
                            try
                            {
                                if (mEntity == null)
                                {
                                    return new FWResult<bool>()
                                    {
                                        status = FWResultStatus.Failure
                                    };
                                }
                                BLLEquipmentReCtrData Entity = basicInfoBll.convertEntity<BLLEquipmentReCtrData>(mEntity);
                                defaultEntityReCtr(userInfo, Entity);

                                IFWDBResult fwdbResultReCtr = FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<BLLEquipmentReCtrData>(Entity, new List<string>() { "ReCtrID" });
                                if (fwdbResultReCtr.dbResultStatus == FWDBResultStatus.Success)
                                {
                                    result.data = true;
                                    result.status = FWResultStatus.Success;
                                   
                                }
                            }
                            catch (FWException ex)
                            {
                                result.status = FWResultStatus.Failure;
                                result.infoList.Add(ex.ToString());
                            }

                        }
                        else
                        {
                            result.status = FWResultStatus.Failure;
                        }

                    }

                //}
                //else
                //{
                //    result.status = FWResultStatus.Error;
                //    result.infoList.Add("此类型设备暂时不支持反控");
                
                //}
               
            }
            catch (Exception ex)
            {

            }         
            return result;
        }

        /// <summary>
        /// dtu列表信息  sss 2016-9-14  (SQL语句包含嵌套关系的，使用以下方法中的分页功能)
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="pageParams"></param>
        /// <returns></returns>
        public static FWResult<FWPageData<MBLLDtuParamData>> queryPageDtuData(IFWUserInfo userInfo, FWPageParams pageParams, QueryEquipmentParams queryParams)
        {
            FWResult<FWPageData<MBLLDtuParamData>> result = new FWResult<FWPageData<MBLLDtuParamData>>();

            #region 查询
            StringBuilder sbSql = new StringBuilder();
            StringBuilder afterFromBeforeOrderBySql = new StringBuilder();
            StringBuilder strBySql = new StringBuilder();
            sbSql.AppendFormat(@"
	        tb1.[dtuMac] [dtuMac],tb1.realDataReportPeriod,tb1.createDatetime ");

            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            FWSqlPageProcedureParams fwSqlPageProcedureParams = (FWSqlPageProcedureParams)fwPageProcedureParams;
            afterFromBeforeOrderBySql.Append(@" (
  	select distinct a.dtumac,case when b.realDataReportPeriod is null then 3600 else b.realDataReportPeriod end as realDataReportPeriod,
b.createDatetime from tbl_dtu_ltu  a
 left join 
 (
  select * from
( select *, ROW_NUMBER() over(partition by dtuMac order by createDatetime desc) as rowNum
from tbl_config_dtu_cache
) ranked where ranked.rowNum <= 1
 ) b on a.dtumac=b.dtuMac) tb1");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.keyWord))
                {
                    afterFromBeforeOrderBySql.AppendFormat(@" where   tb1.dtuMac like '%{0}%'   ", FWSqlCommandStaticHelper.checkParam(queryParams.keyWord));
                }
            }



            fwPageProcedureParams.searchField = sbSql.ToString();
            fwPageProcedureParams.afterFromBeforeOrderBySql = afterFromBeforeOrderBySql.ToString();
            fwSqlPageProcedureParams.orderByField = "  tb1.[dtuMac]  ";
            SqlParameter[] SqlParameterS = {
					new SqlParameter("@outRecordCount", SqlDbType.BigInt),
					new SqlParameter("@outPageSize", SqlDbType.BigInt),
					new SqlParameter("@outPageIndex", SqlDbType.BigInt),
                    new SqlParameter("@pageSize", SqlDbType.BigInt),
					new SqlParameter("@pageIndex", SqlDbType.BigInt),
					new SqlParameter("@searchField", SqlDbType.VarChar,5000),
					new SqlParameter("@afterFromBeforeOrderBySqlString", SqlDbType.VarChar,8000),
                    new SqlParameter("@orderByField", SqlDbType.VarChar,200)};
            SqlParameterS[0].Direction = ParameterDirection.Output;
            SqlParameterS[1].Direction = ParameterDirection.Output;
            SqlParameterS[2].Direction = ParameterDirection.Output;
            SqlParameterS[3].Value = pageParams.pageSize;
            SqlParameterS[4].Value = pageParams.pageIndex;
            SqlParameterS[5].Value = fwSqlPageProcedureParams.searchField.Trim();
            SqlParameterS[6].Value = fwSqlPageProcedureParams.afterFromBeforeOrderBySql;
            SqlParameterS[7].Value = fwSqlPageProcedureParams.orderByField;

            SqlCommand cmd = new SqlCommand()
            {
                CommandType = CommandType.StoredProcedure,
                CommandText = "fw_PageProcedure"
            };
            cmd.Parameters.AddRange(SqlParameterS);
            DataSet ds = FWSqlCommandStaticHelper.ExecuteDataSet(cmd);

            FWPageData<MBLLDtuParamData> EntityList = new FWPageData<MBLLDtuParamData>();
            if (ds != null && ds.Tables[0] != null)
            {
                EntityList.entityList = FWDataTableHelper.toObjectList<MBLLDtuParamData>(ds.Tables[0]);
            }
            EntityList.recordCount = string.IsNullOrEmpty(SqlParameterS[0].Value.ToString()) ? 0 : (Int64)Convert.ToInt32(SqlParameterS[0].Value.ToString());
            EntityList.pageSize = (Int64)Convert.ToInt32(SqlParameterS[1].Value.ToString());
            EntityList.pageIndex = (Int64)Convert.ToInt32(SqlParameterS[2].Value.ToString());
            #endregion
            result.data = EntityList;
            result.status = FWResultStatus.Success;
            return result;
        }

        /// <summary>
        ///  dtu参数设置 sss 2016-9-21
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="mEntity"></param>
        /// <returns></returns>
        public static FWResult<bool> SetDtuParam(IFWUserInfo userInfo, MBLLDtuParamData mEntity)
        {


            FWResult<bool> result = new FWResult<bool>();
            try
            {
                string thirdServiceUrl = ConfigurationManager.AppSettings["thirdServiceUrl"];
                //String url = thirdServiceUrl+"readRealLTUData?ltuMac=00000000001E&ltuType=0";
                String url = thirdServiceUrl + "reportTimeConfig?dtuMac="+mEntity.dtuMac+"&realDataReportPeriod="+mEntity.realDataReportPeriod;
                System.Net.HttpWebRequest myRequest = (HttpWebRequest)HttpWebRequest.Create(url);
                myRequest.Method = "POST";
                myRequest.ContentType = "text/xml;charset=utf-8";
                using (HttpWebResponse myResponse = (HttpWebResponse)myRequest.GetResponse())
                {
                    StreamReader mysr = new StreamReader(myResponse.GetResponseStream(), Encoding.UTF8);
                    string responseResult = mysr.ReadToEnd();
                    Newtonsoft.Json.Linq.JObject obj = Newtonsoft.Json.Linq.JObject.Parse(responseResult);
                    //判断返回的结果  {"code":0,"message":"成功"}
                    string thirdResult = obj["message"].ToString();
                    if (thirdResult.Equals("成功"))
                    {

                        result.data = true;
                        result.status = FWResultStatus.Success;
                    }
                    else
                    {                  
                       result.status = FWResultStatus.Failure;
                    
                    }
                }

            }
            catch (Exception ex)
            {
            }
            return result;
        }

        /// <summary>
        /// 反控历史列表查询
        /// </summary>
        /// <param name="userInfo"></param>
        /// <param name="pageParams"></param>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        public static FWResult<FWPageData<MBLLEquipmentReCtrData>> queryPageEquipmentReCtrData(IFWUserInfo userInfo, FWPageParams pageParams, QueryEquipmentParams queryParams)
        {
            FWResult<FWPageData<MBLLEquipmentReCtrData>> result = new FWResult<FWPageData<MBLLEquipmentReCtrData>>();

            //Roger 2016/6/1 13:00:02 增加管辖区域
            SysBasicManageUserInfo basicUserInfo = (SysBasicManageUserInfo)userInfo;
            SysBasicManageService service = new SysBasicManageService();
            if (basicUserInfo.cantonCodeList == null || basicUserInfo.cantonCodeList.Count == 0)
            {
                result.status = FWResultStatus.Failure;
                result.infoList.Add(constCommon.cartonErr);
                return result;
            }

            StringBuilder sqlbuilder = new StringBuilder();
            sqlbuilder.AppendFormat(@"
select [id]
      ,[ReCtrID]
      ,[ReCtrSampTime]
      ,[equipmentNo]
      ,[Action]
      ,[ActTime]
      ,[ActResult]
  FROM dbo.BLLEquipmentReCtrData d where 1 = 1 ");
            if (queryParams != null)
            {
                if (!string.IsNullOrEmpty(queryParams.keyWord))
                {
                    sqlbuilder.AppendFormat(@" AND equipmentNo like'%{0}%'",
                        FWSqlCommandStaticHelper.checkParam(queryParams.keyWord));
                }
            }

            //Roger 2016/6/1 13:00:02 增加管辖区域
            sqlbuilder.AppendFormat(@" AND EXISTS(SELECT 1 FROM BLLEquipment t WHERE t.equipmentNo = d.equipmentNo AND ({0}))  ", SysBasicManageBll.CartonToStr("t.cantonCode", basicUserInfo.cantonCodeList));

            sqlbuilder.Append(@" order by ReCtrSampTime desc ");
            FWSqlPageProcedureParams fwPageProcedureParams = new FWSqlPageProcedureParams();
            fwPageProcedureParams.sql = sqlbuilder.ToString();
            fwPageProcedureParams.pageSize = pageParams.pageSize;
            fwPageProcedureParams.pageIndex = pageParams.pageIndex;
            try
            {
                result.data = FWSqlEntityToFWCommandStaticHelper.queryPage<MBLLEquipmentReCtrData>(fwPageProcedureParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询反控历史列表出错。错误在：【queryPageEquipmentReCtrData】" + ex.Message.ToString());
            }
            return result;
        }
        #endregion

    }
} 
