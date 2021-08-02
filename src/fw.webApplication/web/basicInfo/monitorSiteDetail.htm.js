var cantonList = [
 { "CantanCode": "32058102", "CantanName": "海虞镇", "ID": 193, "ParentCantanCode": "321282", "PinYin": "HYZ,HaiYuZhen" }
, { "CantanCode": "32058103", "CantanName": "新港镇", "ID": 194, "ParentCantanCode": "321282", "PinYin": "XGZ,XinGangZhen" }
, { "CantanCode": "32058104", "CantanName": "古里镇", "ID": 195, "ParentCantanCode": "321282", "PinYin": "GLZ,GuLiZhen" }
, { "CantanCode": "32058105", "CantanName": "沙家浜镇", "ID": 196, "ParentCantanCode": "321282", "PinYin": "SJBZ,ShaJiaBangZhen" }
, { "CantanCode": "32058106", "CantanName": "支塘镇", "ID": 197, "ParentCantanCode": "321282", "PinYin": "ZTZ,ZhiTangZhen" }
, { "CantanCode": "32058107", "CantanName": "董浜镇", "ID": 198, "ParentCantanCode": "321282", "PinYin": "DBZ,DongBangZhen" }
, { "CantanCode": "32058110", "CantanName": "虞山镇", "ID": 191, "ParentCantanCode": "321282", "PinYin": "YSZ,YuShanZhen" }
, { "CantanCode": "32058111", "CantanName": "辛庄镇", "ID": 199, "ParentCantanCode": "321282", "PinYin": "XZZ,XinZhuangZhen" }
, { "CantanCode": "32058112", "CantanName": "尚湖镇", "ID": 200, "ParentCantanCode": "321282", "PinYin": "SHZ,ShangHuZhen" }
, { "CantanCode": "32058113", "CantanName": "虞山林场", "ID": 201, "ParentCantanCode": "321282", "PinYin": "YSLC,YuShanLinChang" }
, { "CantanCode": "32058192", "CantanName": "沿江经济开发区", "ID": 202, "ParentCantanCode": "321282", "PinYin": "YJJJKFQ,YanJiangJingJiKaiFaQiu" }
, { "CantanCode": "32058193", "CantanName": "东南经济开发区", "ID": 203, "ParentCantanCode": "321282", "PinYin": "DNJJKFQ,DongNanJingJiKaiFaQiu" }
, { "CantanCode": "32058194", "CantanName": "新材料产业园", "ID": 204, "ParentCantanCode": "321282", "PinYin": "XCLCYY,XinCaiLiaoChanYeYuan" }
, { "CantanCode": "32058195", "CantanName": "高新技术开发区", "ID": 205, "ParentCantanCode": "321282", "PinYin": "GXJSKFQ,GaoXinJiShuKaiFaQiu", "Prefix": null, "SearchCounts": null, "SpellCode": null}]
;
var divFormJQ = null;
var buttonSaveJQ = null;
var buttonCancelJQ = null;
var buttonViewHisJQ = null;
var buttonViewVideoJQ = null;

var action = null;
var monitorSiteCode = null;
var dataSourceList = [];

$.page.pageLoad = function () {  
    buttonSaveJQ = $("#buttonSave");
    buttonCancelJQ = $("#buttonConcel");
    buttonViewHisJQ = $("#buttonViewHis");
    buttonViewVideoJQ = $("#buttonViewVideo");

     
    buttonViewHisJQ.bind("click", function () {
        var data = { ticket: $.page.ticket, action: action, monitorSiteCode: monitorSiteCode };
        pageParams = { url: "web/basicInfoView/monitorSiteHis.htm", width: 800, height: 600, title: "运维记录" };
        $.pageCustomer.miniOpen(data, pageParams);
    });

    buttonViewVideoJQ.bind("click", function () {
        var data = { ticket: $.page.ticket, action: action, monitorSiteCode: monitorSiteCode };
        pageParams = { url: "web/basicInfoView/VideoInfo.htm", showMaxButton: true, width: 800, height: 600, title: "视频信息" };
        $.pageCustomer.miniOpen(data, pageParams);
    });

    $.page.idJQ.errorList.click(function() {
        var data = { ticket: $.page.ticket, action: action, monitorSiteCode: monitorSiteCode };
        pageParams = { url: "web/operationRecord/failureLoggingList.htm", showMaxButton: true, width: 800, height: 600, title: "故障记录" };
        $.pageCustomer.miniOpen(data, pageParams);
    });

}; 