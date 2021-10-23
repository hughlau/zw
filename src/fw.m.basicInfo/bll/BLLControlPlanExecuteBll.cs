using fw.fwDal;
using fw.fwData;
using fw.fwSession;
using fw.m.basicInfo.dal;
using fw.m.basicInfo.data.entity;
using fw.m.basicInfo.data.model;
using fw.m.Common;
using fw.m.sysManage.bll;
using fw.m.sysManage.data.entity;
using fw.m.sysManage.data.model;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace fw.m.basicInfo.bll
{
    public class BLLControlPlanExecuteBll
    {

        public static FWResult<FWPageData<MBLLControlPlanExecute>> queryPageData(string userId,string isExecute ,FWPageParams pageParams)
        {
            FWResult<FWPageData<MBLLControlPlanExecute>> result = new FWResult<FWPageData<MBLLControlPlanExecute>>();
            try
            {
                result.data = BLLControlPlanExecuteDal.queryPageData(userId, isExecute, pageParams);
                result.status = FWResultStatus.Success;
            }
            catch (Exception ex)
            {
                result.infoList.Add("查询失败");
                result.status = FWResultStatus.Failure;
            }
            return result;
        }


        /// <summary>
        /// 删除方案
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public static FWResult<bool> deletePlanExecute(List<MBLLControlPlanExecute> entity)
        {
            FWResult<bool> result = new FWResult<bool>();
            try
            {
                BLLControlPlanExecuteDal.deleteList(entity);
                result.status = FWResultStatus.Success;
                result.data = true;
            }
            catch (Exception ex)
            {
                result.infoList.Add("删除失败");
                result.status = FWResultStatus.Failure;
                result.data = false;
            }
            return result;
        }

        /// <summary>
        /// 现场调试
        /// </summary>
        /// <returns></returns>
        public static FWResult<string> controlTest(IFWUserInfo userInfo, string monitorSiteCode, string equipmentType, string controlCommand)
        {

            FWResult<string> result = new FWResult<string>();
            try
            {
                List<MBLLEquipment> bLLEquipments= EquipmentBll.queryEquipmentByMonitorSite(userInfo, monitorSiteCode).data;

                if (bLLEquipments.Count>0)
                {
                    MBLLEquipment mBLLEquipment = bLLEquipments[0];
                    string executeParams = "", resultMsg="设备供应商未提供！";
                    MessageResult messageResult = new MessageResult();
                    if (string.IsNullOrEmpty(mBLLEquipment.supplier))
                    {
                        messageResult.isSuccess = false;
                        messageResult.FailResult = resultMsg;
                    }
                    else if (mBLLEquipment.supplier.Trim()=="1")
                    {
                        messageResult = HlwxHttpDown(mBLLEquipment.equipmentNo, equipmentType, controlCommand, ref executeParams);
                    }
                    else if(mBLLEquipment.supplier.Trim() == "2")
                    {
                        messageResult = MqttDown(mBLLEquipment.equipmentNo,mBLLEquipment.supplierMark ,equipmentType, controlCommand, ref executeParams);
                    }
                    
                    

                    //记录结果
                    BLLControlPlanExecuteResult entity = new BLLControlPlanExecuteResult();
                    entity.code = Guid.NewGuid().ToString();
                    entity.executeCode = "现场调试";
                    entity.createTime = DateTime.Now;
                    entity.createUser = userInfo.userID;
                    entity.executeParams = executeParams;
                    entity.result = messageResult.ToSaveString();
                    BLLControlPlanExecuteResultDal.insert(entity);

                    result.status = FWResultStatus.Success;
                    result.data = messageResult.ToShowString();
                }
                else
                {
                    result.status = FWResultStatus.Success;
                    result.data = "设备不存在！";
                }
                
            }
            catch (Exception ex)
            {
                result.infoList.Add("执行失败！");
                result.status = FWResultStatus.Failure;
                result.data = "执行失败！";
            }
            return result;


        }

       

        public static FWResult<bool> insertPlanExecute(IFWUserInfo userInfo, string planCode)
        {
            FWResult<bool> result = new FWResult<bool>();
            FWSqlTransaction fwSqlTransaction = new FWSqlTransaction();
            try
            {
                BLLControlPlanDetail bLLControlPlanDetail= BLLControlPlanDetailDal.queryByPlanCode(planCode);
                if (null!=bLLControlPlanDetail)
                {
                    BLLControlPlanExecute planExecute = new BLLControlPlanExecute();
                    planExecute.code = Guid.NewGuid().ToString();
                    planExecute.planDetailCode = bLLControlPlanDetail.code;
                    planExecute.detail = "";
                    planExecute.createUserId = userInfo.userID;
                    planExecute.createTime = DateTime.Now;
                    
                    if (bLLControlPlanDetail.executeType==2)
                    {
                        DateTime dateTime = planExecute.createTime;
                        if (bLLControlPlanDetail.executeDelayHour!=null)
                        {
                            dateTime=dateTime.AddHours((int)bLLControlPlanDetail.executeDelayHour);
                        }
                        if (bLLControlPlanDetail.executeDelayMin != null)
                        {
                            dateTime = dateTime.AddMinutes((int)bLLControlPlanDetail.executeDelayMin);
                        }
                        if (bLLControlPlanDetail.executeDelaySec != null)
                        {
                            dateTime = dateTime.AddSeconds((int)bLLControlPlanDetail.executeDelaySec);
                        }
                        planExecute.executeTime = dateTime;
                        TimerControl(userInfo, planExecute);
                        BLLControlPlanExecuteDal.insert(planExecute);
                    }
                    else if (bLLControlPlanDetail.executeType==3 && bLLControlPlanDetail.executeTime!=null)
                    {
                        planExecute.executeTime = bLLControlPlanDetail.executeTime;
                        if (DateTime.Compare((DateTime)planExecute.executeTime,DateTime.Now)<=0)
                        {
                            result.status = FWResultStatus.Failure;
                            result.data = false;
                            result.infoList.Add("执行时间太小，无法执行。");
                            return result;
                        }
                        TimerControl(userInfo, planExecute);
                        BLLControlPlanExecuteDal.insert(planExecute);
                    }
                    else
                    {
                        planExecute.executeTime = DateTime.Now;
                        planExecute.isExecute = 0;
                        BLLControlPlanExecuteDal.insert(planExecute);
                        executeControl(bLLControlPlanDetail.code, planExecute.code);
                    }
                    
                }
                result.status = FWResultStatus.Success;
                result.data = true;
            }
            catch (Exception ex)
            {
                fwSqlTransaction.Rollback();
                result.status = FWResultStatus.Failure;
                result.data = false;
            }
            return result;
        }


        public static FWResult<BLLControlPlanExecute> query(string code)
        {
            FWResult<BLLControlPlanExecute> result = new FWResult<BLLControlPlanExecute>();
            try
            {
                result.data = BLLControlPlanExecuteDal.query(code);
                result.status = FWResultStatus.Success;
            }
            catch (Exception)
            {
                result.data = new BLLControlPlanExecute();
                result.status = FWResultStatus.Failure;
            }
            return result;
        }

        /// <summary>
        /// 执行反控
        /// </summary>
        /// <returns></returns>
        public static void executeControl(string planDetailCode,string planExecuteCode)
        {
            BLLControlPlanDetail bLLControlPlanDetail = BLLControlPlanDetailDal.query(planDetailCode);
            List<BLLEquipment> bLLEquipments= getEqumentNosByPlanDetailCode(bLLControlPlanDetail);
            if (bLLEquipments==null || bLLEquipments.Count==0)
            {
                return;
            }
            string httpParams = "";
            MessageResult hlwxMessageResult = new MessageResult();
            MessageResult mqttMessageResult = new MessageResult();
            List<BLLEquipment> hlwxEquipments=bLLEquipments.Where(p => p.supplier == "1").ToList();
            List<BLLEquipment> mqttEquipments = bLLEquipments.Where(p => p.supplier == "2").ToList();
            hlwxMessageResult = HlwxHttpDowns(bLLEquipments, bLLControlPlanDetail.equipmentType, bLLControlPlanDetail.controlCommand.ToString(),ref httpParams) ;
            mqttMessageResult = MqttDowns(mqttEquipments, bLLControlPlanDetail.equipmentType, bLLControlPlanDetail.controlCommand.ToString(), ref httpParams);

            
            //更改计划状态为已执行
            BLLControlPlanExecute planExecute = BLLControlPlanExecuteDal.query(planExecuteCode);
            planExecute.isExecute = 1;
            BLLControlPlanExecuteDal.update(planExecute);
            //记录执行结果
            BLLControlPlanExecuteResult entity = new BLLControlPlanExecuteResult();
            entity.code = Guid.NewGuid().ToString();
            entity.executeCode = planExecute.code;
            entity.createTime = DateTime.Now;
            entity.createUser = "sysadmin";
            entity.executeParams = httpParams;
            entity.result = hlwxMessageResult.ToSaveString()+","+mqttMessageResult.ToSaveString();
            BLLControlPlanExecuteResultDal.insert(entity);
        }

        public static void TimerControl(IFWUserInfo userInfo,BLLControlPlanExecute entity)
        {
            StringBuilder sbSql = new StringBuilder();
            FWSqlCommand sqlCmd = new FWSqlCommand();
            sbSql.AppendFormat(@"select * 
              FROM [dbo].[FWTimingTask]
            WHERE  timingTaskName='{0}'", entity.code);
            sqlCmd.CommandText = sbSql.ToString();
            FWTimingTask task = FWSqlEntityToFWCommandStaticHelper.query<FWTimingTask>(sqlCmd);
            if (task != null)
            {
                task.timingTime = entity.executeTime??DateTime.Now;
                task.updateTime = DateTime.Now;
                task.updaterID = userInfo.userID;
                task.timingTaskSettings = "{\"serviceName\":\"basicInfo\",\"methodName\":\"executeControl\",\"paramsJson\":\"{\\\"planDetailCode\\\":\\\"" + entity.planDetailCode+ "\\\",\\\"executeCode\\\":\\\""+entity.code+"\\\"}\"}";

                List<string> idPropertyNameList = new List<string> { "timingTaskCode" };
                FWSqlEntityToFWCommandStaticHelper.insertOrUpdate<FWTimingTask>(task, idPropertyNameList);

            }
            else
            {
                List<FWTimingTask> fWTimingTasks = new List<FWTimingTask>();
                FWTimingTask fWTimingTask = new FWTimingTask();
                fWTimingTask.timingTaskCode = Guid.NewGuid().ToString();
                fWTimingTask.timingTaskName = entity.code;
                fWTimingTask.timingTypeCode = "30";
                fWTimingTask.taskTypeCode = "10";
                fWTimingTask.timingTaskEntry = "fw.m.basicInfo";
                fWTimingTask.timingTime = entity.executeTime ?? DateTime.Now;
                fWTimingTask.timingSeconds = 60;
                fWTimingTask.lastSuccessExecuteTime = DateTime.Now;
                fWTimingTask.createTime = DateTime.Now;
                fWTimingTask.updateTime = DateTime.Now;
                fWTimingTask.createrID = userInfo.userID;
                fWTimingTask.updaterID = userInfo.userID;
                fWTimingTask.ix = 1;
                fWTimingTask.isDis = 0;

                fWTimingTask.timingTaskSettings = "{\"serviceName\":\"basicInfo\",\"methodName\":\"executeControl\",\"paramsJson\":\"{\\\"planDetailCode\\\":\\\""+entity.planDetailCode+"\\\",\\\"executeCode\\\":\\\"" + entity.code + "\\\"}\"}";

                fWTimingTasks.Add(fWTimingTask);
                FWTimingTaskBll.insert(userInfo, fWTimingTasks);
            }
            
            
            

            
        }

        /// <summary>
        /// 慧联无限下行命令
        /// </summary>
        /// <param name="equipmentNo">操作的设备号</param>
        /// <param name="equipmentType">1、风机；2水泵；3药泵</param>
        /// <param name="controlCommand">1、启动；2、停止</param>
        /// <returns></returns>
        public static MessageResult HlwxHttpDown(string equipmentNo,string equipmentType,string controlCommand,ref string httpParams)
        {

            HlwxDown_Command hlwxDown_Command = new HlwxDown_Command();
            hlwxDown_Command.clear = 0;
            hlwxDown_Command.schedule = 0;
            hlwxDown_Command.confirm = 1;
            hlwxDown_Command.service_id = "pump_switch_control";
            hlwxDown_Command.device_id = equipmentNo;

            string parameters = "";
            string[] et = equipmentType.Split(',');
            //风机命令
            if (et.Contains("1"))
            {
                parameters += ("\"draught_fan_control\":");
                if (controlCommand == "1")
                    parameters += ("1");
                else
                    parameters += ("0");
                parameters += (",");
            }
            //水泵命令
            if (et.Contains("2"))
            {
                parameters += ("\"water_pump_control\":");
                if (controlCommand == "1")
                    parameters += ("1");
                else
                    parameters += ("0");
                parameters += (",");
            }
            //药泵命令
            if (et.Contains("3"))
            {
                parameters += ("\"drug_pump_control\":");
                if (controlCommand == "1")
                    parameters += ("1");
                else
                    parameters += ("0");
                parameters += (",");
            }
            string strparameters = parameters.ToString();
            strparameters = strparameters.TrimEnd(',');
            hlwxDown_Command.parameter = "{" + strparameters + "}";
            string postJson = hlwxDown_Command.ToJson();
            httpParams = postJson;
            MessageResult resultMsg = LinkThingsHelper.doHttpPost(postJson);
            return resultMsg;
        }

        /// <summary>
        /// mqtt下行命令
        /// </summary>
        /// <param name="equipmentNo">操作的设备号</param>
        /// <param name="equipmentType">1、风机；2水泵；3药泵</param>
        /// <param name="controlCommand">1、启动；2、停止</param>
        /// <returns></returns>
        public static MessageResult MqttDown(string equipmentNo,string gatewayNo, string equipmentType, string controlCommand, ref string httpParams)
        {
            string topic = $"{gatewayNo}/2/{equipmentNo}/WriteDO";
            MqttDownData_Message mqttDownData = new MqttDownData_Message();
            mqttDownData.channel = 0;
            mqttDownData.state = controlCommand == "1" ? 1 : 0;
            string message = JsonConvert.SerializeObject(mqttDownData);
            MqttDownData mqttData = new MqttDownData();
            mqttData.topic = topic;
            mqttData.message = message;
            List<MqttDownData> datas = new List<MqttDownData>();
            datas.Add(mqttData);
            httpParams =topic+"~"+ message;
            MessageResult messageResult = new MessageResult();
            try
            {
                MqttPublicHelper mqttPublicHelper = new MqttPublicHelper(datas);
                messageResult.isSuccess = true;
            }
            catch (Exception ex)
            {
                messageResult.isSuccess = false;
                messageResult.FailResult = ex.Message;
            }
            return messageResult;
        }


        /// <summary>
        /// 慧联无限下行命令批量
        /// </summary>
        /// <param name="equipmentNo">操作的设备号</param>
        /// <param name="equipmentType">1、风机；2水泵；3药泵</param>
        /// <param name="controlCommand">1、启动；2、停止</param>
        /// <returns></returns>
        public static MessageResult HlwxHttpDowns(List<BLLEquipment> equipments, string equipmentType, string controlCommand, ref string httpParams)
        {
            return new MessageResult();
        }

        /// <summary>
        /// mqtt下行命令批量
        /// </summary>
        /// <param name="equipmentNo">操作的设备号</param>
        /// <param name="equipmentType">1、风机；2水泵；3药泵</param>
        /// <param name="controlCommand">1、启动；2、停止</param>
        /// <returns></returns>
        public static MessageResult MqttDowns(List<BLLEquipment> equipments, string equipmentType, string controlCommand, ref string httpParams)
        {
            List<MqttDownData> datas = new List<MqttDownData>();
            string topic = "", message="";
            for (int i = 0; i < equipments.Count; i++)
            {
                MqttDownData_Message mqttDownData = new MqttDownData_Message();
                mqttDownData.channel = 0;
                mqttDownData.state = controlCommand == "1" ? 1 : 0;
                message = JsonConvert.SerializeObject(mqttDownData);
                topic = $"{equipments[i].supplierMark}/2/{equipments[i].equipmentNo}/WriteDO";
                MqttDownData mqttData = new MqttDownData();
                mqttData.topic = topic;
                mqttData.message = message;
                datas.Add(mqttData);
                httpParams = topic + "~" + message+",";
            }
            MessageResult messageResult = new MessageResult();
            try
            {
                MqttPublicHelper mqttPublicHelper = new MqttPublicHelper(datas);
                messageResult.isSuccess = true;
            }
            catch (Exception ex) 
            {
                messageResult.isSuccess = false;
                messageResult.FailResult = ex.Message;
            }
            return messageResult;
        }


        public static List<BLLEquipment> getEqumentNosByPlanDetailCode(BLLControlPlanDetail bLLControlPlanDetail)
        {
            string sql = "", strparams = "";
            //现场设备
            if (bLLControlPlanDetail.monitorType==2)
            {
                string[] monitorSiteCodes = bLLControlPlanDetail.monitorTypeContent.Split(',');
                foreach (var item in monitorSiteCodes)
                {
                    if (!string.IsNullOrEmpty(item))
                    {
                        strparams += "'" + item + "',";
                    }
                }
                strparams=strparams.TrimEnd(',');
                sql = $"SELECT * FROM dbo.BLLEquipment where monitorSiteCode in({strparams})";
            }
            else//地区
            {
                string[] cantonCodes = bLLControlPlanDetail.monitorTypeContent.Split(',');
                foreach (var item in cantonCodes)
                {
                    if (!string.IsNullOrEmpty(item))
                    {
                        strparams += " cantonCode like '%" + item + "' OR ";
                    }
                }
                strparams = string.IsNullOrEmpty(strparams) ? "" : ("where " + strparams.Substring(0, strparams.Length - 3));
                sql = "SELECT * FROM dbo.BLLEquipment "+strparams;
            }
            try
            {
                FWSqlCommand sqlCmd = new FWSqlCommand();
                sqlCmd.CommandText = sql;
                
                List<BLLEquipment> strs = FWSqlEntityToFWCommandStaticHelper.queryList<BLLEquipment>(sqlCmd);
                return strs;
            }
            catch (Exception)
            {

                return null;
            }
            
        }
    }
}
