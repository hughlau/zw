using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using fw.fwDal;

namespace fw.m.operationMaintenance.data.entity
{
   public class BllMonitorSiteCleanRecord: FWEntityObject
    {

       private string _operationCleanRecordCode;
         
       [DataMember]
       public string operationCleanRecordCode
        {
            get { return _operationCleanRecordCode; }
            set { _operationCleanRecordCode = changeValue("operationCleanRecordCode", _operationCleanRecordCode, value);  }
        }

       private string _operationMaintenanceTaskCode;

       /// <summary>
       /// 用户ID
       /// </summary>
         [DataMember]
       public string operationMaintenanceTaskCode
       {
           get { return _operationMaintenanceTaskCode; }
           set { _operationMaintenanceTaskCode = changeValue("operationMaintenanceTaskCode", _operationMaintenanceTaskCode, value); }
       }

       private string _monitorSiteCode;

       /// <summary>
       /// 监测点
       /// </summary>
       [DataMember]
       public string monitorSiteCode
       {
           get { return _monitorSiteCode; }
           set { _monitorSiteCode = changeValue("monitorSiteCode", _monitorSiteCode, value); }
       }


       private string _imgName;

       /// <summary>
       /// 运维现场图片名称
       /// </summary>
       [DataMember]
       public string imgName
       {
           get { return _imgName; }
           set { _imgName = changeValue("imgName", _imgName, value); }
       }

       private string _maintainers;

       /// <summary>
       /// 清掏人员
       /// </summary>
       [DataMember]
       public string maintainers
       {
           get { return _maintainers; }
           set { _maintainers = changeValue("maintainers", _maintainers, value); }
       }

       private string _recorder;
       /// <summary>
       /// 记录人员
       /// </summary>
       [DataMember]
       public string recorder
       {
           get { return _recorder; }
           set { _recorder = changeValue("recorder", _recorder, value); }
       }

       private string _recorder_imgName;
       /// <summary>
       /// 记录人员签名图片
       /// </summary>
       [DataMember]
       public string recorder_imgName
       {
           get { return _recorder_imgName; }
           set { _recorder_imgName = changeValue("recorder_imgName", _recorder_imgName, value); }
       }

       private int _weather;
       /// <summary>
       /// 记录人员
       /// </summary>
       [DataMember]
       public int weather
       {
           get { return _weather; }
           set { _weather = changeValue("weather", _weather, value); }
       }
       private string _inclusionRemoval_F;

       /// <summary>
       /// 浮渣厚度项1
       /// </summary>
       [DataMember]
       public string inclusionRemoval_F
       {
           get { return _inclusionRemoval_F; }
           set { _inclusionRemoval_F = changeValue("inclusionRemoval_F", _inclusionRemoval_F, value); }
       }

       private int _inclusionIsClean_F;

       /// <summary>
       /// 浮渣是否清掏1
       /// </summary>
       [DataMember]
       public int inclusionIsClean_F
       {
           get { return _inclusionIsClean_F; }
           set { _inclusionIsClean_F = changeValue("inclusionIsClean_F", _inclusionIsClean_F, value); }
       }

       private string _anaerobicFilter_F;

       /// <summary>
       /// 浮渣厚度项2
       /// </summary>
       [DataMember]
       public string anaerobicFilter_F
       {
           get { return _anaerobicFilter_F; }
           set { _anaerobicFilter_F = changeValue("anaerobicFilter_F", _anaerobicFilter_F, value); }
       }

       private int _filterIsClean_F;

       /// <summary>
       /// 浮渣是否清掏2
       /// </summary>
       [DataMember]
       public int filterIsClean_F
       {
           get { return _filterIsClean_F; }
           set { _filterIsClean_F = changeValue("filterIsClean_F", _filterIsClean_F, value); }
       }


       private string _settlingChamber_F;

       /// <summary>
       /// 浮渣厚度项3
       /// </summary>
       [DataMember]
       public string settlingChamber_F
       {
           get { return _settlingChamber_F; }
           set { _settlingChamber_F = changeValue("settlingChamber_F", _settlingChamber_F, value); }
       }

       private int _chamberIsClean_F;

       /// <summary>
       /// 浮渣是否清掏3
       /// </summary>
       [DataMember]
       public int chamberIsClean_F
       {
           get { return _chamberIsClean_F; }
           set { _chamberIsClean_F = changeValue("chamberIsClean_F", _chamberIsClean_F, value); }
       }

       private string _inclusionRemoval_D;

       /// <summary>
       /// 底泥厚度项1
       /// </summary>
       [DataMember]
       public string inclusionRemoval_D
       {
           get { return _inclusionRemoval_D; }
           set { _inclusionRemoval_D = changeValue("inclusionRemoval_D", _inclusionRemoval_D, value); }
       }

       private int _inclusionIsClean_D;

       /// <summary>
       /// 底泥是否清掏1
       /// </summary>
       [DataMember]
       public int inclusionIsClean_D
       {
           get { return _inclusionIsClean_D; }
           set { _inclusionIsClean_D = changeValue("inclusionIsClean_D", _inclusionIsClean_D, value); }
       }


       private string _anaerobicFilter_D;

       /// <summary>
       /// 底泥厚度项2
       /// </summary>
       [DataMember]
       public string anaerobicFilter_D
       {
           get { return _anaerobicFilter_D; }
           set { _anaerobicFilter_D = changeValue("anaerobicFilter_D", _anaerobicFilter_D, value); }
       }

       private int _filterIsClean_D;

       /// <summary>
       /// 底泥是否清掏2
       /// </summary>
       [DataMember]
       public int filterIsClean_D
       {
           get { return _filterIsClean_D; }
           set { _filterIsClean_D = changeValue("filterIsClean_D", _filterIsClean_D, value); }
       }



       private string _settlingChamber_D;

       /// <summary>
       /// 底泥厚度项3
       /// </summary>
       [DataMember]
       public string settlingChamber_D
       {
           get { return _settlingChamber_D; }
           set { _settlingChamber_D = changeValue("settlingChamber_D", _settlingChamber_D, value); }
       }


       private int _chamberIsClean_D;

       /// <summary>
       /// 底泥是否清掏2
       /// </summary>
       [DataMember]
       public int chamberIsClean_D
       {
           get { return _chamberIsClean_D; }
           set { _chamberIsClean_D = changeValue("chamberIsClean_D", _chamberIsClean_D, value); }
       }

       private string _remark_F;

       /// <summary>
       /// 底泥厚度项3
       /// </summary>
       [DataMember]
       public string remark_F
       {
           get { return _remark_F; }
           set { _remark_F = changeValue("remark_F", _remark_F, value); }
       }

       private string _remark_D;

       /// <summary>
       /// 底泥厚度项3
       /// </summary>
       [DataMember]
       public string remark_D
       {
           get { return _remark_D; }
           set { _remark_D = changeValue("remark_D", _remark_D, value); }
       }


       private string _createrID;

       /// <summary>
       /// createrID
       /// </summary>
       [DataMember]
       public string createrID
       {
           get { return _createrID; }
           set { _createrID = changeValue("createrID", _createrID, value); }
       }

       private DateTime? _createTime;

       /// <summary>
       /// createTime
       /// </summary>
       [DataMember]
       public DateTime? createTime
       {
           get { return _createTime; }
           set { _createTime = changeValue("createTime", _createTime, value); }
       }

       private string _updaterID;

       /// <summary>
       /// updaterID
       /// </summary>
       [DataMember]
       public string updaterID
       {
           get { return _updaterID; }
           set { _updaterID = changeValue("updaterID", _updaterID, value); }
       }

       private DateTime? _updateTime;

       /// <summary>
       /// updateTime
       /// </summary>
       [DataMember]
       public DateTime? updateTime
       {
           get { return _updateTime; }
           set { _updateTime = changeValue("updateTime", _updateTime, value); }
       }


       private int _isdel;

       /// <summary>
       /// 是否删除
       /// </summary>
       [DataMember]
       public int isdel
       {
           get { return _isdel; }
           set { _isdel = changeValue("isdel", _isdel, value); }
       }

        private string _reviewer;
        /// <summary>
        /// 审阅人
        /// </summary>
        public string reviewer
        {
            get { return _reviewer; }
            set { _reviewer = changeValue("reviewer", _reviewer, value); }
        }

        private string _reviewer_imgName;
        /// <summary>
        /// 审阅人签名
        /// </summary>
        public string reviewer_imgName
        {
            get { return _reviewer_imgName; }
            set { _reviewer_imgName = changeValue("reviewer_imgName", _reviewer_imgName, value); }
        }
    }
}
