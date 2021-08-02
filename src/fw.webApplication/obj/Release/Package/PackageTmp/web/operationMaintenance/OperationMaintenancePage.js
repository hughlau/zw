$.OperationMaintenancePage = {
    enumSelect: {
        singleSelect: "single"
    , moreSelect: "more"
    }
, getSelectedEntity: function () {
    //获取选中项对象
    var entity = $.page.idM.datagrid1.getSelected();
    //判断对象没有值
    if (!fw.fwObject.FWObjectHelper.hasValue(entity)) {
        mini.alert("请选择一项！");
        entity = undefined;
        return;
    };
    return entity;
}, getSelectedEntityList: function () {
    //获取选中项对象
    var entity = $.page.idM.datagrid1.getSelecteds();
    //判断对象没有值
    if (!fw.fwObject.FWObjectHelper.hasValue(entity)) {
        mini.alert("请选择一项！");
        entity = undefined;
        return;
    };
    return entity;
},mouseOut: function()
{
    $("#divImage").hide();
}, mouseOver:function(obj,direction) {
    //获取标签id
    $("#divImage").show();
    $("#imgbig").remove();
    var image = $('<img id="imgbig">');
    image.attr("src", $(obj).attr("src"));
    $("#divImage").append(image);
    var rate;
    var rateW = 500 / image.width();
    var rateH = 500 / image.height();

    rate = rateW < rateH ? rateW : rateH;
    //$("#image1")[0].height = image.height() * rate;
    //$("#image1")[0].width = image.width() * rate;
    // $("#imgbig").hide();
    //alert(image.height()*rate);
    $("#imgbig").attr({ width: image.width() * rate, height: image.height() * rate });
    var left = $(obj).offset().left + 80;
    $("#divImage").css("left", left + "px");

    }, mouseOverToLeft: function (obj) {
        //获取标签id
        $("#divImage").show();
        $("#imgbig").remove();
        var image = $('<img id="imgbig">');
        image.attr("src", $(obj).attr("src"));
        $("#divImage").append(image);
        var rate;
        var rateW = 500 / image.width();
        var rateH = 500 / image.height();

        rate = rateW < rateH ? rateW : rateH;
        //$("#image1")[0].height = image.height() * rate;
        //$("#image1")[0].width = image.width() * rate;
        // $("#imgbig").hide();
        //alert(image.height()*rate);
    $("#imgbig").attr({ width: image.width() * rate, height: image.height() * rate });
    var left = $(obj).offset().left - $(obj).width()*2;
        $("#divImage").css("left", left + "px");

    }
    , showImg: function (imgName) {
    var html = '';
    if (imgName != null && imgName.length > 0) {
        var monitorImgList = [];
        monitorImgList = imgName.split("_");
        // monitorImgList = fw.fwJson.FWJsonHelper.deserializeObject("ddd");
         html = '<table><tr>';
        if (fw.fwObject.FWObjectHelper.hasValue(monitorImgList)) {
            for (var i = 0; i < monitorImgList.length; i++) {
                var entity = monitorImgList[i];
                var entityIsNull = typeof entity == "undefined" || entity == null || entity == "";
                if (!entityIsNull) {
                    entity = fw.fwUrl.FWUrlHelper.getAbsoluteUrl(entity, 'upload/')
                    var src = fw.fwUrl.FWUrlHelper.getAbsoluteUrl(entity, $.page.webSiteRootUrl);
                    html += '<td><img class="hoverCls"  style="width: 60px; height: 60px" src=' + src + ' id=' + monitorImgList[i] + ' onmouseover="$.OperationMaintenancePage.mouseOver(this)" ></img></td>';
                }

            };
        }

        html += '</tr></table>';

    }
    return html;

    }
    , showSignImg: function (imgName) {
        var html = '';
        if (imgName != null && imgName.length > 0) {
            var monitorImgList = [];
            monitorImgList = imgName.split("_");
            // monitorImgList = fw.fwJson.FWJsonHelper.deserializeObject("ddd");
            html = '<table><tr>';
            if (fw.fwObject.FWObjectHelper.hasValue(monitorImgList)) {
                for (var i = 0; i < monitorImgList.length; i++) {
                    var entity = monitorImgList[i];
                    var entityIsNull = typeof entity == "undefined" || entity == null || entity == "";
                    if (!entityIsNull) {
                        entity = fw.fwUrl.FWUrlHelper.getAbsoluteUrl(entity, 'upload/')
                        var src = fw.fwUrl.FWUrlHelper.getAbsoluteUrl(entity, $.page.webSiteRootUrl);
                        html += '<td><img class="hoverCls"  style="height: 60px" src=' + src + ' id=' + monitorImgList[i] + ' onmouseover="$.OperationMaintenancePage.mouseOverToLeft(this)" ></img></td>';
                    }

                };
            }

            html += '</tr></table>';

        }
        return html;

    }//
, treeRootData: [{ code: "320581", pCode: "-fw-", name: "常熟市", "folder": 1, dataLvl: 0, "isLeaf": false, "expanded": true, "asyncLoad": false}]
 , ShowFunction: function (ActionType, FormSelectorJQ) {
     var buttonCancelJQ = $(".buttonCancel", FormSelectorJQ);
     var buttonEditJQ = $(".buttonEdit", FormSelectorJQ);
     var buttonSaveJQ = $(".buttonSave", FormSelectorJQ);

     var ViewControlJQ = $(".ViewControl", FormSelectorJQ);
     var EditControlJQ = $(".EditControl", FormSelectorJQ);

     switch (ActionType) {
         case "Add":
         case "Edit":
             buttonCancelJQ.show();
             buttonEditJQ.hide();
             buttonSaveJQ.show();

             ViewControlJQ.hide();
             EditControlJQ.show();
             break;
         default:
             buttonCancelJQ.hide();
             buttonEditJQ.show();
             buttonSaveJQ.hide();

             ViewControlJQ.show();
             EditControlJQ.hide();
             break;
     };
 }
 , isSolveList: [{ name: "已解决", code: "1" }, { name: "未解决", code: "0"}]
 , isGenerateTask: [{ name: "是", code: "1" }, { name: "否", code: "0"}]
, SelectGridSource: [{ name: "消毒液", code: "1" }, { name: "压力机", code: "2" }, { name: "PH计", code: "2" }
]
, OperationTaskList: [{ ID: 1, cantonCode: "320581", cantonName: "虞山镇", monitorSiteName: "虞山镇污水处理设施-01", monitorSiteCode: "3205810101", operateEntName: "中国中车股份有限公司", posX: "120.9328", posY: "31.7242", address: "常熟市通港工业园华联路58号", errInfo: "断电引发风机故障", errDate: "2015-8-31", regDate: "2015-9-1", isLater: "否", isDeal: "是", taskStatus: "已接收", alarmCode: 1 }
, { ID: 2, cantonCode: "320581", cantonName: "虞山镇", monitorSiteName: "虞山镇污水处理设施-01", monitorSiteCode: "3205810101", operateEntName: "中国中车股份有限公司", posX: "120.9328", posY: "31.7242", address: "常熟市通港工业园华联路58号", errInfo: "断电引发通讯故障报警", errDate: "2015-8-31", regDate: "2015-9-1", isLater: "否", isDeal: "是", taskStatus: "已接收", alarmCode: 2 }
, { ID: 3, cantonCode: "320581", cantonName: "虞山镇", monitorSiteName: "虞山镇污水处理设施-01", monitorSiteCode: "3205810101", operateEntName: "中国中车股份有限公司", posX: "120.9328", posY: "31.7242", address: "常熟市通港工业园华联路58号", errInfo: "断电引发通讯故障报警", errDate: "2015-8-31", regDate: "2015-9-1", isLater: "否", isDeal: "是", taskStatus: "已接收", alarmCode: null }
, { ID: 4, cantonCode: "320581", cantonName: "虞山镇", monitorSiteName: "虞山镇污水处理设施-01", monitorSiteCode: "3205810101", operateEntName: "中国中车股份有限公司", posX: "120.9328", posY: "31.7242", address: "常熟市通港工业园华联路58号", errInfo: "断电引发通讯故障报警", errDate: "2015-8-31", regDate: "2015-9-1", isLater: "是", isDeal: "否", taskStatus: "待接收", alarmCode: null }
, { ID: 5, cantonCode: "320581", cantonName: "虞山镇", monitorSiteName: "虞山镇污水处理设施-01", monitorSiteCode: "3205810101", operateEntName: "中国中车股份有限公司", posX: "120.9328", posY: "31.7242", address: "常熟市通港工业园华联路58号", errInfo: "风机故障报警", errDate: "2015-8-31", regDate: "2015-9-5", isLater: "是", isDeal: "否", taskStatus: "待接收", alarmCode: null }
]
, monitorSiteList: [
 { cantonCode: "320581", pCantonCode: "320581", cantonName: "虞山镇", monitorSiteName: "虞山镇污水处理设施-01", monitorSiteCode: "3205810101", model: "华控HK-4-I电流变送器", address: "常熟市通港工业园华联路58号", startDate: "2014-01-01", operationPerson: "曾欲健", posX: "120.9328", posY: "31.7242", useCount: 80, handleAbility: "能处理100家一下的污水" }
, { cantonCode: "320581", cantonName: "虞山镇", pCantonCode: "320581", monitorSiteName: "虞山镇污水处理设施-02", monitorSiteCode: "3205810202", model: "华控HK-4-I电流变送器", address: "常熟市虞山镇（王市）通江路120号", startDate: "2014-01-01", operationPerson: "张浩", posX: "119.9328", posY: "31.7242", useCount: 80, handleAbility: "能处理100家一下的污水" }
, { cantonCode: "320581", cantonName: "虞山镇", pCantonCode: "320581", monitorSiteName: "虞山镇污水处理设施-03", monitorSiteCode: "3205810301", model: "华控HK-4-I电流变送器", address: "常熟市碧溪镇东张中心大道50号", startDate: "2014-01-01", operationPerson: "孙洋东", posX: "117.9328", posY: "31.7242", useCount: 130, handleAbility: "能处理150家一下的污水" }
, { cantonCode: "320581", cantonName: "虞山镇", pCantonCode: "320581", monitorSiteName: "虞山镇污水处理设施-04", monitorSiteCode: "3205810202", model: "华控HK-4-I电流变送器", address: "常熟市虞山镇通江路168", startDate: "2014-01-01", operationPerson: "王鹤锦", posX: "116.9328", posY: "36.7242", useCount: 40, handleAbility: "能处理50家一下的污水" }
, { cantonCode: "320581", cantonName: "虞山镇", pCantonCode: "320581", monitorSiteName: "虞山镇污水处理设施-05", monitorSiteCode: "3205810103", model: "北环科", address: "常熟市虞山镇通港开发区泰光路118号", startDate: "2014-01-01", operationPerson: "刘可可", posX: "119.9328", posY: "39.7242", useCount: 80, handleAbility: "能处理100家一下的污水" }
, { cantonCode: "320581", cantonName: "虞山镇", pCantonCode: "320581", monitorSiteName: "虞山镇污水处理设施-06", monitorSiteCode: "3205810302", model: "北环科", address: "江苏省常熟市碧溪新区碧溪东路50号", startDate: "2014-01-01", operationPerson: "王文迪", posX: "118.9328", posY: "38.7242", useCount: 80, handleAbility: "能处理100家一下的污水" }
]
, ProjectList: [{ ID: 1, "AllotPersonDesc": "", "ContractEffective": "2015-08-01", "ContractLimit": 12, "ContractMoney": 62.18, "InputDate": "2015-08-01", "InputMan": "yzhb", "IsDelete": null, "IsDistribute": 1, "IsOvertime": 0, "IsUpload": null, "LastUpdateTime": "Date(1422255080120+0800)", "LastUpdateUTCTime": null, "OperAndMaintenanceCode": "73654934-001", "OperAndMaintenanceName": "中国中车股份有限公司", "OperandMaintenanceContentDesc": "", "OwnerName": "", "ProjectCode": "1a02f64f-9e00-4f61-a428-803ba4aaca5b", "ProjectName": "常熟市污水处理设施第三方运维项目", "ProjectScopeOfManage": "", "ProjectTypeCode": "01,02,03", "ProjectTypeName": "废水,废气,污水处理厂", "RecordPeople": "yzhb", "RecordPeopleName": "yzhb" }
    , { ID: 2, "AllotPersonDesc": "", "ContractEffective": "2015-01-01", "ContractLimit": 10, "ContractMoney": 10, "InputDate": "2015-01-01", "InputMan": "xzhb", "IsDelete": null, "IsDistribute": 1, "IsOvertime": 2, "IsUpload": null, "LastUpdateTime": "Date(1411522862087+0800)", "LastUpdateUTCTime": null, "OperAndMaintenanceCode": "73494670-001", "OperAndMaintenanceName": "中国中车股份有限公司", "OperandMaintenanceContentDesc": "", "OwnerName": "", "ProjectCode": "7459f3c6-46cd-41e5-988a-193934c27a53", "ProjectName": "2014徐州市社会化运维工程（气包）2", "ProjectScopeOfManage": "", "ProjectTypeCode": "02", "ProjectTypeName": "废气", "RecordPeople": "xzhb", "RecordPeopleName": "xzhb" }
    //, { ID: 3, "AllotPersonDesc": "", "ContractEffective": "2014-06-13", "ContractLimit": 12, "ContractMoney": 10, "InputDate": "2014-01-01", "InputMan": "xzhb", "IsDelete": null, "IsDistribute": 1, "IsOvertime": 1, "IsUpload": null, "LastUpdateTime": "Date(1411522800853+0800)", "LastUpdateUTCTime": null, "OperAndMaintenanceCode": "79985285—001", "OperAndMaintenanceName": "中国中车股份有限公司", "OperandMaintenanceContentDesc": "", "OwnerName": "", "ProjectCode": "6021231a-ac94-40f4-b54a-c083fb3ab293", "ProjectName": "2014徐州市社会化运维工程（气包）1", "ProjectScopeOfManage": "", "ProjectTypeCode": "02", "ProjectTypeName": "废气", "RecordPeople": "xzhb", "RecordPeopleName": "xzhb" }
    //, { ID: 4, "AllotPersonDesc": "", "ContractEffective": "2014-06-13", "ContractLimit": 2, "ContractMoney": 27.5, "InputDate": "2014-01-01", "InputMan": "yzhb", "IsDelete": null, "IsDistribute": 1, "IsOvertime": 1, "IsUpload": null, "LastUpdateTime": "Date(1410749978053+0800)", "LastUpdateUTCTime": null, "OperAndMaintenanceCode": "73654934-001", "OperAndMaintenanceName": "中国中车股份有限公司", "OperandMaintenanceContentDesc": "", "OwnerName": "", "ProjectCode": "e2a99ccc-522a-4910-9c01-d636e28bd767", "ProjectName": "扬州废水污染源扩大第三方运维项目2", "ProjectScopeOfManage": "", "ProjectTypeCode": "01,03", "ProjectTypeName": "废水,污水处理厂", "RecordPeople": "yzhb", "RecordPeopleName": "yzhb" }
    //, { ID: 5, "AllotPersonDesc": "", "ContractEffective": "2014-06-13", "ContractLimit": 2, "ContractMoney": 37.6, "InputDate": "2014-06-13", "InputMan": "yzhb", "IsDelete": null, "IsDistribute": 1, "IsOvertime": 1, "IsUpload": null, "LastUpdateTime": "Date(1410750020210+0800)", "LastUpdateUTCTime": null, "OperAndMaintenanceCode": "73626176-001", "OperAndMaintenanceName": "中国中车股份有限公司", "OperandMaintenanceContentDesc": "", "OwnerName": "", "ProjectCode": "88cd39f6-c6ff-455e-ac1f-ecf3e0fd7de7", "ProjectName": "扬州污染源自动监控系统运维项目2", "ProjectScopeOfManage": "", "ProjectTypeCode": "01,03", "ProjectTypeName": "废水,污水处理厂", "RecordPeople": "yzhb", "RecordPeopleName": "yzhb" }
    //, { ID: 6, "AllotPersonDesc": "", "ContractEffective": "2014-06-13", "ContractLimit": 12, "ContractMoney": 10, "InputDate": "2014-06-13", "InputMan": "xzhb", "IsDelete": null, "IsDistribute": 1, "IsOvertime": 1, "IsUpload": null, "LastUpdateTime": "Date(1410338852617+0800)", "LastUpdateUTCTime": null, "OperAndMaintenanceCode": "77702491-001", "OperAndMaintenanceName": "中国中车股份有限公司", "OperandMaintenanceContentDesc": "", "OwnerName": "", "ProjectCode": "4ef15cae-42fb-4edd-800e-327eb73b4592", "ProjectName": "2014徐州市社会化运维工程（水包）2", "ProjectScopeOfManage": "", "ProjectTypeCode": "01,03", "ProjectTypeName": "废水,污水处理厂", "RecordPeople": "xzhb", "RecordPeopleName": "xzhb" }
    //, { ID: 7, "AllotPersonDesc": "", "ContractEffective": "2014-06-13", "ContractLimit": 12, "ContractMoney": 10, "InputDate": "2014-06-13", "InputMan": "xzhb", "IsDelete": null, "IsDistribute": 1, "IsOvertime": 1, "IsUpload": null, "LastUpdateTime": "Date(1410336837930+0800)", "LastUpdateUTCTime": null, "OperAndMaintenanceCode": "73069821-001", "OperAndMaintenanceName": "徐州利源科技有限公司", "OperandMaintenanceContentDesc": "", "OwnerName": "", "ProjectCode": "422f98f2-62b0-449b-94e5-5a7ae75d8aa2", "ProjectName": "2014徐州市社会化运维工程（水包）1", "ProjectScopeOfManage": "", "ProjectTypeCode": "01,03", "ProjectTypeName": "废水,污水处理厂", "RecordPeople": "xzhb", "RecordPeopleName": "xzhb" }
    //, { ID: 8, "AllotPersonDesc": "", "ContractEffective": "2014-01-01", "ContractLimit": 12, "ContractMoney": 11.9, "InputDate": "2014-01-01", "InputMan": "zjhb", "IsDelete": null, "IsDistribute": 1, "IsOvertime": 1, "IsUpload": null, "LastUpdateTime": "Date(1404969416933+0800)", "LastUpdateUTCTime": null, "OperAndMaintenanceCode": "73626176-001", "OperAndMaintenanceName": "宇星科技发展（深圳）有限公司", "OperandMaintenanceContentDesc": "", "OwnerName": "", "ProjectCode": "426ea401-df52-473e-b93f-ea70361ad28f", "ProjectName": "镇江市句容运维项目2014", "ProjectScopeOfManage": "", "ProjectTypeCode": "02,03", "ProjectTypeName": "废气,污水处理厂", "RecordPeople": "zjhb", "RecordPeopleName": "zjhb" }
    //, { ID: 9, "AllotPersonDesc": "", "ContractEffective": "2014-01-01", "ContractLimit": 12, "ContractMoney": 4.6, "InputDate": "2014-01-01", "InputMan": "zjhb", "IsDelete": null, "IsDistribute": 1, "IsOvertime": 1, "IsUpload": null, "LastUpdateTime": "Date(1404969386867+0800)", "LastUpdateUTCTime": null, "OperAndMaintenanceCode": "73626176-001", "OperAndMaintenanceName": "宇星科技发展（深圳）有限公司", "OperandMaintenanceContentDesc": "", "OwnerName": "", "ProjectCode": "1d7d0a0b-e597-41d0-bf9d-6b333fc4625b", "ProjectName": "镇江市扬中运维项目2014", "ProjectScopeOfManage": "", "ProjectTypeCode": "03", "ProjectTypeName": "污水处理厂", "RecordPeople": "zjhb", "RecordPeopleName": "zjhb" }
    //, { ID: 10, "AllotPersonDesc": "", "ContractEffective": "2014-01-01", "ContractLimit": 12, "ContractMoney": 6.7, "InputDate": "2014-01-01", "InputMan": "zjhb", "IsDelete": null, "IsDistribute": 1, "IsOvertime": 1, "IsUpload": null, "LastUpdateTime": "Date(1404969348330+0800)", "LastUpdateUTCTime": null, "OperAndMaintenanceCode": "73626176-001", "OperAndMaintenanceName": "宇星科技发展（深圳）有限公司", "OperandMaintenanceContentDesc": "", "OwnerName": "", "ProjectCode": "d0ef3dad-51d2-4ce8-9645-39d9acfd5de3", "ProjectName": "镇江市丹阳运维项目2014", "ProjectScopeOfManage": "", "ProjectTypeCode": "01,02", "ProjectTypeName": "废水,废气", "RecordPeople": "zjhb", "RecordPeopleName": "zjhb" }
    //, { ID: 11, "AllotPersonDesc": "", "ContractEffective": "2014-01-01", "ContractLimit": 12, "ContractMoney": 16.6, "InputDate": "2014-01-01", "InputMan": "zjhb", "IsDelete": null, "IsDistribute": 1, "IsOvertime": 1, "IsUpload": null, "LastUpdateTime": "Date(1404969273697+0800)", "LastUpdateUTCTime": null, "OperAndMaintenanceCode": "73626176-001", "OperAndMaintenanceName": "宇星科技发展（深圳）有限公司", "OperandMaintenanceContentDesc": "", "OwnerName": "", "ProjectCode": "b7f05eca-ecb9-4fc7-9023-ed5738b79db6", "ProjectName": "镇江市丹徒区运维项目2014", "ProjectScopeOfManage": "", "ProjectTypeCode": "01,02,03", "ProjectTypeName": "废水,废气,污水处理厂", "RecordPeople": "zjhb", "RecordPeopleName": "zjhb" }
    //, { ID: 12, "AllotPersonDesc": "", "ContractEffective": "2014-01-01", "ContractLimit": 12, "ContractMoney": 30.6, "InputDate": "2014-01-01", "InputMan": "zjhb", "IsDelete": null, "IsDistribute": 1, "IsOvertime": 1, "IsUpload": null, "LastUpdateTime": "Date(1404969237053+0800)", "LastUpdateUTCTime": null, "OperAndMaintenanceCode": "73626176-001", "OperAndMaintenanceName": "宇星科技发展（深圳）有限公司", "OperandMaintenanceContentDesc": "", "OwnerName": "", "ProjectCode": "63d21544-da6d-4ece-bad4-19dc8581ae80", "ProjectName": "镇江市大港新区运维项目2014", "ProjectScopeOfManage": "", "ProjectTypeCode": "01,02,03", "ProjectTypeName": "废水,废气,污水处理厂", "RecordPeople": "zjhb", "RecordPeopleName": "zjhb" }
    //, { ID: 13, "AllotPersonDesc": "", "ContractEffective": "2014-01-01", "ContractLimit": 12, "ContractMoney": 3.2, "InputDate": "2014-01-01", "InputMan": "zjhb", "IsDelete": null, "IsDistribute": 1, "IsOvertime": 1, "IsUpload": null, "LastUpdateTime": "Date(1404969197563+0800)", "LastUpdateUTCTime": null, "OperAndMaintenanceCode": "73626176-001", "OperAndMaintenanceName": "宇星科技发展（深圳）有限公司", "OperandMaintenanceContentDesc": "", "OwnerName": "", "ProjectCode": "2fb276f5-c9cf-4cf8-942f-13427bcf9a9f", "ProjectName": "镇江市润州区运维项目2014", "ProjectScopeOfManage": "", "ProjectTypeCode": "03", "ProjectTypeName": "污水处理厂", "RecordPeople": "zjhb", "RecordPeopleName": "zjhb" }
    //, { ID: 14, "AllotPersonDesc": "", "ContractEffective": "2014-01-01", "ContractLimit": 12, "ContractMoney": 27.7, "InputDate": "2014-01-01", "InputMan": "zjhb", "IsDelete": null, "IsDistribute": 1, "IsOvertime": 1, "IsUpload": null, "LastUpdateTime": "Date(1404968394007+0800)", "LastUpdateUTCTime": null, "OperAndMaintenanceCode": "73626176-001", "OperAndMaintenanceName": "宇星科技发展（深圳）有限公司", "OperandMaintenanceContentDesc": "", "OwnerName": "", "ProjectCode": "2076ebdc-8389-4b71-9038-a709847f0e25", "ProjectName": "镇江市京口区运维项目2014", "ProjectScopeOfManage": "", "ProjectTypeCode": "01,02,03", "ProjectTypeName": "废水,废气,污水处理厂", "RecordPeople": "zjhb", "RecordPeopleName": "zjhb" }
    //, { ID: 15, "AllotPersonDesc": "", "ContractEffective": "2014-01-01", "ContractLimit": 36, "ContractMoney": 76.35, "InputDate": "2014-09-13", "InputMan": "lyghb", "IsDelete": null, "IsDistribute": 1, "IsOvertime": 0, "IsUpload": null, "LastUpdateTime": "Date(1404890239447+0800)", "LastUpdateUTCTime": null, "OperAndMaintenanceCode": "79373525-001", "OperAndMaintenanceName": "南京杰思尔设备工程有限公司", "OperandMaintenanceContentDesc": "", "OwnerName": "", "ProjectCode": "ce65babe-6a67-4f23-9f84-7551c8c3e8fe", "ProjectName": "江苏新海发电有限公司", "ProjectScopeOfManage": "", "ProjectTypeCode": "02", "ProjectTypeName": "废气", "RecordPeople": "lyghb", "RecordPeopleName": "lyghb" }
]
, contacterList: [{ ID: 1, "AppointmentCardCode": null, "AuthorizeDate": null, "Discipline": null, "Educationallevel": null, "EducationallevelName": null, "FK_GroupCode": null, "FK_OMEnterpriseCode": null, "FintUpload": 1, "Gender": "1", "GenderName": "男", "IdentificationCard": null, "IsAppointmentCard": 0, "IsDelete": 0, "IsFreeze": 0, "LastUpdateTime": "Date(1392627499930+0800)", "LoginName": "zll", "LoginPassword": "12345", "MobileTelephone": "18913169980", "OfficePhone": "", "OperAndMaintenanceCode": "73494670-001", "OperAndMaintenanceContacterCode": "13769057-00101010", "OperAndMaintenanceContacterImage": null, "OperAndMaintenanceContacterName": "左磊", Email: "zuol@shencai.cc", "OperAndMaintenanceContacterPath": null, "OperAndMaintenanceGroupCode": null, "OperAndMaintenanceGroupName": null, "OperAndMaintenanceName": "苏州市环境保护有限公司", "PassWord": null, "PersonMobile": null, "PersonName": null, "PersonPhoto": null, "PersonTel": null, "RecordPeople": "13769057-001", "RecordPeopleName": "苏州市环境保护有限公司", "RoleOfCompany": "1", "RoleOfCompanyName": "运维工程师", "WorkSeniority": null, "bz": null, isReceiveAlarm: 1, ReceiveType: 1 }
, { ID: 2, "AppointmentCardCode": "ZDJC-10100072", "AuthorizeDate": "Date(1291132800000+0800)", "Discipline": null, "Educationallevel": "3", "EducationallevelName": "本科", "FK_GroupCode": null, "FK_OMEnterpriseCode": null, "FintUpload": 1, "Gender": "1", "GenderName": "男", "IdentificationCard": null, "IsAppointmentCard": 1, "IsDelete": 0, "IsFreeze": 0, "LastUpdateTime": "Date(1375396884273+0800)", "LoginName": "chenh", "LoginPassword": "12345", "MobileTelephone": "15722633894", "OfficePhone": "69153853", "OperAndMaintenanceCode": "73494670-001", "OperAndMaintenanceContacterCode": "13769057-00101007", "OperAndMaintenanceContacterImage": null, "OperAndMaintenanceContacterName": "陈昊", Email: "chenh@shencai.cc", "OperAndMaintenanceContacterPath": null, "OperAndMaintenanceGroupCode": "13769057-00102003", "OperAndMaintenanceGroupName": "水维护", "OperAndMaintenanceName": "苏州市环境保护有限公司", "PassWord": null, "PersonMobile": null, "PersonName": null, "PersonPhoto": null, "PersonTel": null, "RecordPeople": "13769057-001", "RecordPeopleName": "苏州市环境保护有限公司", "RoleOfCompany": "1", "RoleOfCompanyName": "运维工程师", "WorkSeniority": 4, "bz": null, isReceiveAlarm: 1, ReceiveType: 2 }
, { ID: 3, "AppointmentCardCode": null, "AuthorizeDate": null, "AuthorizeOrg": "", "Discipline": null, "EducationallevelName": null, "FK_GroupCode": null, "FK_OMEnterpriseCode": null, "FintUpload": 1, "Gender": "1", "GenderName": "男", "IdentificationCard": null, "IsAppointmentCard": 0, "IsDelete": 0, "IsFreeze": 0, "LastUpdateTime": "Date(1361861241390+0800)", "LoginName": "wq", "LoginPassword": "wq123456", "MobileTelephone": "", "OfficePhone": "", "OperAndMaintenanceCode": "73494670-001", "OperAndMaintenanceContacterCode": "13769057-00101009", "OperAndMaintenanceContacterName": " 王强", Email: "wq@shencai.cc", "OperAndMaintenanceGroupCode": "13769057-00102001", "OperAndMaintenanceGroupName": "机动维修", "OperAndMaintenanceName": "苏州市环境保护有限公司", "PassWord": null, "PersonMobile": null, "PersonName": null, "PersonPhoto": null, "PersonTel": null, "RecordPeople": "13769057-001", "RecordPeopleName": "苏州市环境保护有限公司", "RoleOfCompany": "3", "RoleOfCompanyName": "管理员", "WorkSeniority": null, "bz": "", isReceiveAlarm: 1, ReceiveType: 1 }
    , { ID: 4, "AppointmentCardCode": "ZDJC-08100018", "AuthorizeDate": "Date(1228060800000+0800)", "Discipline": null, "Educationallevel": "4", "EducationallevelName": "专科", "FK_GroupCode": null, "FK_OMEnterpriseCode": null, "FintUpload": 1, "Gender": "1", "GenderName": "男", "IdentificationCard": null, "IsAppointmentCard": 1, "IsDelete": 0, "IsFreeze": 0, "LastUpdateTime": "Date(1360038039137+0800)", "LoginName": "hujm", "LoginPassword": "12345", "MobileTelephone": "13814885884", "OfficePhone": "69153853", "OperAndMaintenanceCode": "73494670-001", "OperAndMaintenanceContacterCode": "13769057-00101002", "OperAndMaintenanceContacterImage": null, "OperAndMaintenanceContacterName": "胡建敏", Email: "hum@shencai.cc", "OperAndMaintenanceGroupCode": "13769057-00102003", "OperAndMaintenanceGroupName": "水维护", "OperAndMaintenanceName": "江苏锐泉环保技术有限公司", "PassWord": null, "PersonMobile": null, "PersonName": null, "PersonPhoto": null, "PersonTel": null, "RecordPeople": "13769057-001", "RecordPeopleName": "苏州市环境保护有限公司", "RoleOfCompany": "1", "RoleOfCompanyName": "运维工程师", "WorkSeniority": 8, "bz": "", isReceiveAlarm: 1, ReceiveType: 2 }
    , { ID: 5, "AppointmentCardCode": "ZDJC-08100014", "AuthorizeDate": "Date(1228060800000+0800)", "Discipline": null, "Educationallevel": "4", "EducationallevelName": "专科", "FK_GroupCode": null, "FK_OMEnterpriseCode": null, "FintUpload": 1, "Gender": "1", "GenderName": "男", "IdentificationCard": null, "IsAppointmentCard": 1, "IsDelete": 0, "IsFreeze": 0, "LastUpdateTime": "Date(1359893139937+0800)", "LoginName": "moxw", "LoginPassword": "12345", "MobileTelephone": "", "OfficePhone": "69153853", "OperAndMaintenanceCode": "73494670-001", "OperAndMaintenanceContacterCode": "13769057-00101003", "OperAndMaintenanceContacterImage": null, "OperAndMaintenanceContacterName": "莫显文", Email: "moxw@shencai.cc", "OperAndMaintenanceGroupCode": "13769057-00102003", "OperAndMaintenanceGroupName": "水维护", "OperAndMaintenanceName": "江苏锐泉环保技术有限公司", "PassWord": null, "PersonMobile": null, "PersonName": null, "PersonPhoto": null, "PersonTel": null, "RecordPeople": "13769057-001", "RecordPeopleName": "苏州市环境保护有限公司", "RoleOfCompany": "1", "RoleOfCompanyName": "运维工程师", "WorkSeniority": 10, "bz": "", isReceiveAlarm: 1, ReceiveType: 1 }
    //, { ID: 6, "AppointmentCardCode": "ZDJC-10100073", "AuthorizeDate": "Date(1291219200000+0800)", "Discipline": null, "Educationallevel": "4", "EducationallevelName": "专科", "FK_GroupCode": null, "FK_OMEnterpriseCode": null, "FintUpload": 1, "Gender": "1", "GenderName": "男", "IdentificationCard": null, "IsAppointmentCard": 1, "IsDelete": 0, "IsFreeze": 0, "LastUpdateTime": "Date(1359621999610+0800)", "LoginName": "yinjs", "LoginPassword": "12345", "MobileTelephone": "15195682816", "OfficePhone": "69153853", "OperAndMaintenanceCode": "13769057-001", "OperAndMaintenanceContacterCode": "13769057-00101008", "OperAndMaintenanceContacterImage": null, "OperAndMaintenanceContacterName": "殷劲松", "OperAndMaintenanceGroupCode": "13769057-00102003", "OperAndMaintenanceGroupName": "水维护", "OperAndMaintenanceName": "苏州市环境保护有限公司", "PassWord": null, "PersonMobile": null, "PersonName": null, "PersonPhoto": null, "PersonTel": null,   "RecordPeople": "13769057-001", "RecordPeopleName": "苏州市环境保护有限公司", "RoleOfCompany": "1", "RoleOfCompanyName": "运维工程师", "WorkSeniority": 4, "bz": "" }
    //, { ID: 7, "AppointmentCardCode": "ZDJC-12100024", "AuthorizeDate": "Date(1338480000000+0800)", "Discipline": null, "Educationallevel": "4", "EducationallevelName": "专科", "FK_GroupCode": null, "FK_OMEnterpriseCode": null, "FintUpload": 1, "Gender": "1", "GenderName": "男", "IdentificationCard": null, "IsAppointmentCard": 1, "IsDelete": 0, "IsFreeze": 0, "LastUpdateTime": "Date(1359621876433+0800)", "LoginName": "panxh", "LoginPassword": "12345", "MobileTelephone": "", "OfficePhone": "69153853", "OperAndMaintenanceCode": "13769057-001", "OperAndMaintenanceContacterCode": "13769057-00101006", "OperAndMaintenanceContacterImage": null, "OperAndMaintenanceContacterName": "潘宪华", "OperAndMaintenanceGroupCode": "13769057-00102002", "OperAndMaintenanceGroupName": "烟气维护", "OperAndMaintenanceName": "苏州市环境保护有限公司", "PassWord": null, "PersonMobile": null, "PersonName": null, "PersonPhoto": null, "PersonTel": null,   "RecordPeople": "13769057-001", "RecordPeopleName": "苏州市环境保护有限公司", "RoleOfCompany": "1", "RoleOfCompanyName": "运维工程师", "WorkSeniority": 4, "bz": "" }
    //, { ID: 8, "AppointmentCardCode": "ZDJC-12100023", "AuthorizeDate": "Date(1301587200000+0800)",  "Discipline": null, "Educationallevel": "4", "EducationallevelName": "专科", "FK_GroupCode": null, "FK_OMEnterpriseCode": null, "FintUpload": 1, "Gender": "1", "GenderName": "男", "IdentificationCard": null, "IsAppointmentCard": 1, "IsDelete": 0, "IsFreeze": 0, "LastUpdateTime": "Date(1359621811927+0800)", "LoginName": "wuxx", "LoginPassword": "12345", "MobileTelephone": "", "OfficePhone": "69153853", "OperAndMaintenanceCode": "13769057-001", "OperAndMaintenanceContacterCode": "13769057-00101005", "OperAndMaintenanceContacterImage": null, "OperAndMaintenanceContacterName": "吴小星", "OperAndMaintenanceContacterPath": null, "OperAndMaintenanceContacterUrl": "WebOperationMaintenanceOperAndMaintenanceAttachment.ashx?TableName=T_OM_MaintenancePerson&ColumnName=PersonPhoto&PK_Column=PK_OperateMaintenancePerson&AttachmentID=13769057-00101005", "OperAndMaintenanceGroupCode": "13769057-00102002", "OperAndMaintenanceGroupName": "烟气维护", "OperAndMaintenanceName": "苏州市环境保护有限公司", "PassWord": null, "PersonMobile": null, "PersonName": null, "PersonPhoto": null, "PersonTel": null,   "RecordPeople": "13769057-001", "RecordPeopleName": "苏州市环境保护有限公司", "RoleOfCompany": "1", "RoleOfCompanyName": "运维工程师", "WorkSeniority": 4, "bz": "" }
    //, { ID: 9, "AppointmentCardCode": "ZDJC-08100068", "AuthorizeDate": "Date(1291132800000+0800)",  "Discipline": null, "Educationallevel": "4", "EducationallevelName": "专科", "FK_GroupCode": null, "FK_OMEnterpriseCode": null, "FintUpload": 1, "Gender": "1", "GenderName": "男", "IdentificationCard": null, "IsAppointmentCard": 1, "IsDelete": 0, "IsFreeze": 0, "LastUpdateTime": "Date(1359621735923+0800)", "LoginName": "chends", "LoginPassword": "12345", "MobileTelephone": "13812912262", "OfficePhone": "69153853", "OperAndMaintenanceCode": "13769057-001", "OperAndMaintenanceContacterCode": "13769057-00101004", "OperAndMaintenanceContacterImage": null, "OperAndMaintenanceContacterName": "陈东生", "OperAndMaintenanceContacterPath": null, "OperAndMaintenanceContacterUrl": "WebOperationMaintenanceOperAndMaintenanceAttachment.ashx?TableName=T_OM_MaintenancePerson&ColumnName=PersonPhoto&PK_Column=PK_OperateMaintenancePerson&AttachmentID=13769057-00101004", "OperAndMaintenanceGroupCode": "13769057-00102002", "OperAndMaintenanceGroupName": "烟气维护", "OperAndMaintenanceName": "苏州市环境保护有限公司", "PassWord": null, "PersonMobile": null, "PersonName": null, "PersonPhoto": null, "PersonTel": null,   "RecordPeople": "13769057-001", "RecordPeopleName": "苏州市环境保护有限公司", "RoleOfCompany": "1", "RoleOfCompanyName": "运维工程师", "WorkSeniority": 4, "bz": "" }
    //, { ID: 10, "AppointmentCardCode": "ZDJC-08100029", "AuthorizeDate": "Date(1228060800000+0800)",  "Discipline": null, "Educationallevel": "4", "EducationallevelName": "专科", "FK_GroupCode": null, "FK_OMEnterpriseCode": null, "FintUpload": 1, "Gender": "1", "GenderName": "男", "IdentificationCard": null, "IsAppointmentCard": 1, "IsDelete": 0, "IsFreeze": 0, "LastUpdateTime": "Date(1359620816680+0800)", "LoginName": "shenmh", "LoginPassword": "12345", "MobileTelephone": "10914010108", "OfficePhone": "69153853", "OperAndMaintenanceCode": "13769057-001", "OperAndMaintenanceContacterCode": "13769057-00101001", "OperAndMaintenanceContacterImage": null, "OperAndMaintenanceContacterName": "沈明辉", "OperAndMaintenanceContacterPath": null, "OperAndMaintenanceContacterUrl": "WebOperationMaintenanceOperAndMaintenanceAttachment.ashx?TableName=T_OM_MaintenancePerson&ColumnName=PersonPhoto&PK_Column=PK_OperateMaintenancePerson&AttachmentID=13769057-00101001", "OperAndMaintenanceGroupCode": null, "OperAndMaintenanceGroupName": null, "OperAndMaintenanceName": "苏州市环境保护有限公司", "PassWord": null, "PersonMobile": null, "PersonName": null, "PersonPhoto": null, "PersonTel": null,   "RecordPeople": "13769057-001", "RecordPeopleName": "苏州市环境保护有限公司", "RoleOfCompany": "1", "RoleOfCompanyName": "运维工程师", "WorkSeniority": 7, "bz": "" }
]
, MaintenanceFrequency: [
{ ID: 1, "cantonName": "虞山镇", monitorSiteName: "虞山镇污水处理设施-01", monitorSiteCode: "3205810101", projectID: 1, projectName: "常熟市污水处理设施第三方运维项目", monthInspectsCount: fw.fwNumber.FWNumberHelper.randomNumber(1, 30), frequencyTypeName: "日", frequencyCount: fw.fwNumber.FWNumberHelper.randomNumber(1, 30) }
, { ID: 2, "cantonName": "虞山镇", monitorSiteName: "虞山镇污水处理设施-02", monitorSiteCode: "3205810202", projectID: 1, projectName: "常熟市污水处理设施第三方运维项目", monthInspectsCount: fw.fwNumber.FWNumberHelper.randomNumber(1, 30), frequencyTypeName: "周", frequencyCount: fw.fwNumber.FWNumberHelper.randomNumber(1, 30) }
, { ID: 3, "cantonName": "虞山镇", monitorSiteName: "虞山镇污水处理设施-03", monitorSiteCode: "3205810301", projectID: 1, projectName: "常熟市污水处理设施第三方运维项目", monthInspectsCount: fw.fwNumber.FWNumberHelper.randomNumber(1, 30), frequencyTypeName: "月", frequencyCount: fw.fwNumber.FWNumberHelper.randomNumber(1, 30) }
, { ID: 4, "cantonName": "虞山镇", monitorSiteName: "虞山镇污水处理设施-04", monitorSiteCode: "3205810302", projectID: 1, projectName: "常熟市污水处理设施第三方运维项目", monthInspectsCount: fw.fwNumber.FWNumberHelper.randomNumber(1, 30), frequencyTypeName: "年", frequencyCount: fw.fwNumber.FWNumberHelper.randomNumber(1, 30) }
, { ID: 5, "cantonName": "虞山镇", monitorSiteName: "虞山镇污水处理设施-05", monitorSiteCode: "3205810103", projectID: 1, projectName: "常熟市污水处理设施第三方运维项目", monthInspectsCount: fw.fwNumber.FWNumberHelper.randomNumber(1, 30), frequencyTypeName: "季度", frequencyCount: fw.fwNumber.FWNumberHelper.randomNumber(1, 30) }
, { ID: 6, "cantonName": "虞山镇", monitorSiteName: "虞山镇污水处理设施-06", monitorSiteCode: "3205810402", projectID: 1, projectName: "常熟市污水处理设施第三方运维项目", monthInspectsCount: fw.fwNumber.FWNumberHelper.randomNumber(1, 30), frequencyTypeName: "月", frequencyCount: fw.fwNumber.FWNumberHelper.randomNumber(1, 30) }
]
, FrequencyList: [{ name: "日", code: "day" }, { name: "周", code: "week" }, { name: "月", code: "month" }, { name: "季度", code: "quarter" }, { name: "年", code: "month"}]
, taskUserList: [{ name: "左磊", code: 1 }, { name: "陈昊", code: 2 }, { name: "王强", code: 3}]
, OrganizationList: [
{ "CantonCode": "320581", "CantonName": "常熟市", "CertificatePersonNumber": null, "Contacter": "张浩", "ContacterList": null, "DieAdresse": "展业路18号", "Email": "mail.shencai.cc", "FaxNumber": "1234567", "IsDelete": 0, "IsOffice": 0, "IsUpload": null, "IsbUpload": null, "LabPersonNumber": null, "LastUpdateTime": "Date(1410396378943+0800)", "LastUpdateUTCTime": null, "LegalPersonCode": "73494670-0", "LegalRepresentative": "钱江", "OMPersonNumber": null, "OMProperties": ["02"], "OperAndMaintenanceCode": "73494670-001", "OperAndMaintenanceImage": null, "OperAndMaintenanceName": "中国中车股份有限公司", "OperAndMaintenancePath": null, "OperAndMaintenanceUrl": null, "ParentOperAndMaintenanceCode": null, "ParentOperAndMaintenanceName": null, "Password": "12345", "Phone": "18111811501", "PostalCode": "", "ReagentSources": "", "RecordPeople": "xzhb", "RecordPeopleName": "徐州市", "Remark": null, "StandardLiquidSource": "", "TechnicalPerNumber": null, "WaterDealWay": null, "WaterDealWayName": null, OperationMaintenceCount: 5, MainEquipment: 2 }
, { "CantonCode": "320300", "CantonName": "徐州市", "CertificatePersonNumber": null, "Contacter": "", "ContacterList": null, "DieAdresse": "", "Email": "", "FaxNumber": "", "IsDelete": 0, "IsOffice": 0, "IsUpload": null, "IsbUpload": null, "LabPersonNumber": null, "LastUpdateTime": "Date(1410396290837+0800)", "LastUpdateUTCTime": null, "LegalPersonCode": "77702491-7", "LegalRepresentative": "吴庆国", "OMPersonNumber": null, "OMProperties": ["03"], "OperAndMaintenanceCode": "77702491-001", "OperAndMaintenanceImage": null, "OperAndMaintenanceName": "中国中车股份有限公司运维单位", "OperAndMaintenancePath": null, "OperAndMaintenanceUrl": null, "ParentOperAndMaintenanceCode": null, "ParentOperAndMaintenanceName": null, "Password": "12345", "Phone": "", "PostalCode": "", "ReagentSources": "", "RecordPeople": "xzhb", "RecordPeopleName": "徐州市", "Remark": null, "StandardLiquidSource": "", "TechnicalPerNumber": null, "WaterDealWay": null, "WaterDealWayName": null, OperationMaintenceCount: 5, MainEquipment: 2 }
    //, { "CantonCode": "320300", "CantonName": "徐州市", "CertificatePersonNumber": null, "Contacter": "胡经理", "ContacterList": null, "DieAdresse": "", "Email": "", "FaxNumber": "", "IsDelete": 0, "IsOffice": 0, "IsUpload": null, "IsbUpload": null, "LabPersonNumber": null, "LastUpdateTime": "Date(1404730692683+0800)", "LastUpdateUTCTime": null, "LegalPersonCode": "79985285—1", "LegalRepresentative": "敖小强", "OMPersonNumber": null, "OMProperties": ["02"], "OperAndMaintenanceCode": "79985285—001", "OperAndMaintenanceImage": null, "OperAndMaintenanceName": "北京雪迪龙科技股份有限公司", "OperAndMaintenancePath": null, "OperAndMaintenanceUrl": null, "ParentOperAndMaintenanceCode": null, "ParentOperAndMaintenanceName": null, "Password": "sdl000", "Phone": "1381121990", "PostalCode": "", "ReagentSources": "", "RecordPeople": "xzhb", "RecordPeopleName": "徐州市", "Remark": null, "StandardLiquidSource": "", "TechnicalPerNumber": null, "WaterDealWay": null, "WaterDealWayName": null }
    //, { "CantonCode": "320323", "CantonName": "铜山区", "CertificatePersonNumber": null, "Contacter": "", "ContacterList": null, "DieAdresse": "", "Email": "", "FaxNumber": "", "IsDelete": 0, "IsOffice": 0, "IsUpload": null, "IsbUpload": null, "LabPersonNumber": null, "LastUpdateTime": "Date(1396507779197+0800)", "LastUpdateUTCTime": null, "LegalPersonCode": "83475434-3", "LegalRepresentative": "赵岫华", "OMPersonNumber": null, "OMProperties": null, "OperAndMaintenanceCode": "83475434-001", "OperAndMaintenanceImage": null, "OperAndMaintenanceName": "国华徐州发电有限公司", "OperAndMaintenancePath": null, "OperAndMaintenanceUrl": null, "ParentOperAndMaintenanceCode": null, "ParentOperAndMaintenanceName": null, "Password": "12345", "Phone": "", "PostalCode": "", "ReagentSources": "", "RecordPeople": "tsxhb", "RecordPeopleName": "监控中心", "Remark": null, "StandardLiquidSource": "", "TechnicalPerNumber": null, "WaterDealWay": null, "WaterDealWayName": null }
    //, { "CantonCode": "320323", "CantonName": "铜山区", "CertificatePersonNumber": null, "Contacter": "", "ContacterList": null, "DieAdresse": "", "Email": "", "FaxNumber": "", "IsDelete": 0, "IsOffice": 0, "IsUpload": null, "IsbUpload": null, "LabPersonNumber": null, "LastUpdateTime": "Date(1396507703057+0800)", "LastUpdateUTCTime": null, "LegalPersonCode": "74484932-2", "LegalRepresentative": "王玉军", "OMPersonNumber": null, "OMProperties": null, "OperAndMaintenanceCode": "74484932-001", "OperAndMaintenanceImage": null, "OperAndMaintenanceName": "徐州华鑫发电有限公司", "OperAndMaintenancePath": null, "OperAndMaintenanceUrl": null, "ParentOperAndMaintenanceCode": null, "ParentOperAndMaintenanceName": null, "Password": "12345", "Phone": "", "PostalCode": "", "ReagentSources": "", "RecordPeople": "tsxhb", "RecordPeopleName": "监控中心", "Remark": null, "StandardLiquidSource": "", "TechnicalPerNumber": null, "WaterDealWay": null, "WaterDealWayName": null }
    //, { "CantonCode": "320323", "CantonName": "铜山区", "CertificatePersonNumber": null, "Contacter": "", "ContacterList": null, "DieAdresse": "", "Email": "", "FaxNumber": "", "IsDelete": 0, "IsOffice": 0, "IsUpload": null, "IsbUpload": null, "LabPersonNumber": null, "LastUpdateTime": "Date(1396507557010+0800)", "LastUpdateUTCTime": null, "LegalPersonCode": "60800341-0", "LegalRepresentative": "王帅廷", "OMPersonNumber": null, "OMProperties": null, "OperAndMaintenanceCode": "60800341-001", "OperAndMaintenanceImage": null, "OperAndMaintenanceName": "徐州华润电力有限公司", "OperAndMaintenancePath": null, "OperAndMaintenanceUrl": null, "ParentOperAndMaintenanceCode": null, "ParentOperAndMaintenanceName": null, "Password": "12345", "Phone": "", "PostalCode": "", "ReagentSources": "", "RecordPeople": "tsxhb", "RecordPeopleName": "监控中心", "Remark": null, "StandardLiquidSource": "", "TechnicalPerNumber": null, "WaterDealWay": null, "WaterDealWayName": null }
    //, { "CantonCode": "320323", "CantonName": "铜山区", "CertificatePersonNumber": null, "Contacter": "", "ContacterList": null, "DieAdresse": "", "Email": "", "FaxNumber": "", "IsDelete": 0, "IsOffice": 0, "IsUpload": null, "IsbUpload": null, "LabPersonNumber": null, "LastUpdateTime": "Date(1396507405040+0800)", "LastUpdateUTCTime": null, "LegalPersonCode": "76652446-5", "LegalRepresentative": "刘彬", "OMPersonNumber": null, "OMProperties": null, "OperAndMaintenanceCode": "76652446-001", "OperAndMaintenanceImage": null, "OperAndMaintenanceName": "淮海中联水泥有限公司", "OperAndMaintenancePath": null, "OperAndMaintenanceUrl": null, "ParentOperAndMaintenanceCode": null, "ParentOperAndMaintenanceName": null, "Password": "12345", "Phone": "", "PostalCode": "", "ReagentSources": "", "RecordPeople": "tsxhb", "RecordPeopleName": "监控中心", "Remark": null, "StandardLiquidSource": "", "TechnicalPerNumber": null, "WaterDealWay": null, "WaterDealWayName": null }
    //, { "CantonCode": "320323", "CantonName": "铜山区", "CertificatePersonNumber": null, "Contacter": "", "ContacterList": null, "DieAdresse": "", "Email": "", "FaxNumber": "", "IsDelete": 0, "IsOffice": 0, "IsUpload": null, "IsbUpload": null, "LabPersonNumber": null, "LastUpdateTime": "Date(1396507299773+0800)", "LastUpdateUTCTime": null, "LegalPersonCode": "79905977-4", "LegalRepresentative": "KENNEY.LIN", "OMPersonNumber": null, "OMProperties": null, "OperAndMaintenanceCode": "79905977-001", "OperAndMaintenanceImage": null, "OperAndMaintenanceName": "徐州伟天化工有限公司", "OperAndMaintenancePath": null, "OperAndMaintenanceUrl": null, "ParentOperAndMaintenanceCode": null, "ParentOperAndMaintenanceName": null, "Password": "12345", "Phone": "", "PostalCode": "", "ReagentSources": "", "RecordPeople": "tsxhb", "RecordPeopleName": "监控中心", "Remark": null, "StandardLiquidSource": "", "TechnicalPerNumber": null, "WaterDealWay": null, "WaterDealWayName": null }
    //, { "CantonCode": "320323", "CantonName": "铜山区", "CertificatePersonNumber": null, "Contacter": "", "ContacterList": null, "DieAdresse": "", "Email": "", "FaxNumber": "", "IsDelete": 0, "IsOffice": 0, "IsUpload": null, "IsbUpload": null, "LabPersonNumber": null, "LastUpdateTime": "Date(1396506997260+0800)", "LastUpdateUTCTime": null, "LegalPersonCode": "13647338-4", "LegalRepresentative": "仇明武", "OMPersonNumber": null, "OMProperties": null, "OperAndMaintenanceCode": "13647338-001", "OperAndMaintenanceImage": null, "OperAndMaintenanceName": "铜山县新汇热电有限公司", "OperAndMaintenancePath": null, "OperAndMaintenanceUrl": null, "ParentOperAndMaintenanceCode": null, "ParentOperAndMaintenanceName": null, "Password": "12345", "Phone": "", "PostalCode": "", "ReagentSources": "", "RecordPeople": "tsxhb", "RecordPeopleName": "监控中心", "Remark": null, "StandardLiquidSource": "", "TechnicalPerNumber": null, "WaterDealWay": null, "WaterDealWayName": null }
    //, { "CantonCode": "320323", "CantonName": "铜山区", "CertificatePersonNumber": null, "Contacter": "", "ContacterList": null, "DieAdresse": "", "Email": "", "FaxNumber": "", "IsDelete": 0, "IsOffice": 0, "IsUpload": null, "IsbUpload": null, "LabPersonNumber": null, "LastUpdateTime": "Date(1396427116367+0800)", "LastUpdateUTCTime": null, "LegalPersonCode": "75323770-7", "LegalRepresentative": "王爱钦", "OMPersonNumber": null, "OMProperties": null, "OperAndMaintenanceCode": "75323770-001", "OperAndMaintenanceImage": null, "OperAndMaintenanceName": "徐州东南钢铁工业有限公司", "OperAndMaintenancePath": null, "OperAndMaintenanceUrl": null, "ParentOperAndMaintenanceCode": null, "ParentOperAndMaintenanceName": null, "Password": "12345", "Phone": "", "PostalCode": "", "ReagentSources": "", "RecordPeople": "tsxhb", "RecordPeopleName": "监控中心", "Remark": null, "StandardLiquidSource": "", "TechnicalPerNumber": null, "WaterDealWay": null, "WaterDealWayName": null }
]
, cantonCodeList: [
{ "CantanCode": "320581", "CantanName": "常熟市", "ID": 193, "ParentCantanCode": "", "PinYin": "HYZ,HaiYuZhen" }
 , { "CantanCode": "32058102", "CantanName": "海虞镇", "ID": 193, "ParentCantanCode": "320581", "PinYin": "HYZ,HaiYuZhen" }
, { "CantanCode": "32058103", "CantanName": "新港镇", "ID": 194, "ParentCantanCode": "320581", "PinYin": "XGZ,XinGangZhen" }
, { "CantanCode": "32058104", "CantanName": "古里镇", "ID": 195, "ParentCantanCode": "320581", "PinYin": "GLZ,GuLiZhen" }
, { "CantanCode": "32058105", "CantanName": "沙家浜镇", "ID": 196, "ParentCantanCode": "320581", "PinYin": "SJBZ,ShaJiaBangZhen" }
, { "CantanCode": "32058106", "CantanName": "支塘镇", "ID": 197, "ParentCantanCode": "320581", "PinYin": "ZTZ,ZhiTangZhen" }
, { "CantanCode": "32058107", "CantanName": "董浜镇", "ID": 198, "ParentCantanCode": "320581", "PinYin": "DBZ,DongBangZhen" }
, { "CantanCode": "32058110", "CantanName": "虞山镇", "ID": 191, "ParentCantanCode": "320581", "PinYin": "YSZ,YuShanZhen" }
, { "CantanCode": "32058111", "CantanName": "辛庄镇", "ID": 199, "ParentCantanCode": "320581", "PinYin": "XZZ,XinZhuangZhen" }
, { "CantanCode": "32058112", "CantanName": "尚湖镇", "ID": 200, "ParentCantanCode": "320581", "PinYin": "SHZ,ShangHuZhen" }
, { "CantanCode": "32058113", "CantanName": "虞山林场", "ID": 201, "ParentCantanCode": "320581", "PinYin": "YSLC,YuShanLinChang" }
, { "CantanCode": "32058192", "CantanName": "沿江经济开发区", "ID": 202, "ParentCantanCode": "320581", "PinYin": "YJJJKFQ,YanJiangJingJiKaiFaQiu" }
, { "CantanCode": "32058193", "CantanName": "东南经济开发区", "ID": 203, "ParentCantanCode": "320581", "PinYin": "DNJJKFQ,DongNanJingJiKaiFaQiu" }
, { "CantanCode": "32058194", "CantanName": "新材料产业园", "ID": 204, "ParentCantanCode": "320581", "PinYin": "XCLCYY,XinCaiLiaoChanYeYuan" }
, { "CantanCode": "32058195", "CantanName": "高新技术开发区", "ID": 205, "ParentCantanCode": "320581", "PinYin": "GXJSKFQ,GaoXinJiShuKaiFaQiu", "Prefix": null, "SearchCounts": null, "SpellCode": null}]
, OperationMaintenceList: [
{ ID: 1, cantonName: "虞山镇", OperAndMaintenanceName: "中国中车股份有限公司", StopDate: "2015-09-13", monitorSiteName: "虞山镇污水处理设施-01", OperationMaintenanceDate: "2015-09-14", FormTypeName: "设施运维情况", OperAndMaintenanceContacterName: " 王强", EndDate: "2015-09-14 18:00", remark: "现场问题已解决", Description: "淤泥多导致管道堵塞" }
, { ID: 2, cantonName: "虞山镇", OperAndMaintenanceName: "中国中车股份有限公司", StopDate: "2015-09-12", monitorSiteName: "虞山镇污水处理设施-02", OperationMaintenanceDate: "2015-09-13", FormTypeName: "设施运维情况", OperAndMaintenanceContacterName: " 王强", EndDate: "2015-09-13 18:00", remark: "现场问题已解决", Description: "停电" }
, { ID: 3, cantonName: "虞山镇", OperAndMaintenanceName: "中国中车股份有限公司", StopDate: "2015-09-11", monitorSiteName: "虞山镇污水处理设施-03", OperationMaintenanceDate: "2015-09-12", FormTypeName: "设施运维情况", OperAndMaintenanceContacterName: " 王强", EndDate: "2015-09-12 18:00", remark: "现场问题已解决", Description: "淤泥多导致管道堵塞" }
, { ID: 4, cantonName: "虞山镇", OperAndMaintenanceName: "中国中车股份有限公司", StopDate: "2015-09-10", monitorSiteName: "虞山镇污水处理设施-04", OperationMaintenanceDate: "2015-09-11", FormTypeName: "设施运维情况", OperAndMaintenanceContacterName: " 王强", EndDate: "2015-09-11 18:00", remark: "现场问题已解决", Description: "淤泥多导致管道堵塞" }
, { ID: 5, cantonName: "虞山镇", OperAndMaintenanceName: "中国中车股份有限公司", StopDate: "2015-09-09", monitorSiteName: "虞山镇污水处理设施-05", OperationMaintenanceDate: "2015-09-10", FormTypeName: "设施运维情况", OperAndMaintenanceContacterName: " 王强", EndDate: "2015-09-10 18:00", remark: "现场问题已解决", Description: "淤泥多导致管道堵塞" }
, { ID: 6, cantonName: "虞山镇", OperAndMaintenanceName: "中国中车股份有限公司", StopDate: "2015-09-08", monitorSiteName: "虞山镇污水处理设施-05", OperationMaintenanceDate: "2015-09-09", FormTypeName: "设施运维情况", OperAndMaintenanceContacterName: " 王强", EndDate: "2015-09-09 18:00", remark: "现场问题已解决", Description: "淤泥多导致管道堵塞" }
]
, AlarmList: [{ id: 1, cantonName: "虞山镇", monitorSiteName: "虞山镇污水处理设施-01", operationName: "中国中车股份有限公司", alarmTypeName: "通讯故障报警", startDate: "2015-8-31", endDate: "2015-9-1", reason: "断电", isPublish: "是", isDeal: "否", isOverDate: "是", taskID: 1 }
, { id: 2, cantonName: "虞山镇", monitorSiteName: "虞山镇污水处理设施-02", operationName: "中国中车股份有限公司", alarmTypeName: "风机故障报警", startDate: "2015-8-31", endDate: "2015-9-25", reason: "断电", isPublish: "是", isDeal: "是", isOverDate: "否", taskID: 2 }
, { id: 3, cantonName: "虞山镇", monitorSiteName: "虞山镇污水处理设施-03", operationName: "中国中车股份有限公司", alarmTypeName: "风机故障报警", startDate: "2015-8-31", endDate: "2015-9-25", reason: "断电", isPublish: "否", isDeal: "否", isOverDate: "否" }
, { id: 5, cantonName: "虞山镇", monitorSiteName: "虞山镇污水处理设施-04", operationName: "中国中车股份有限公司", alarmTypeName: "通讯故障报警", startDate: "2015-8-1", endDate: "2015-9-21", reason: "设备故障", isPublish: "否", isDeal: "否", isOverDate: "否" }
]
, ContacterOperationTaskList: [
{ ID: 1, cantonCode: "320581", cantonName: "虞山镇", monitorSiteName: "虞山镇污水处理设施-01", monitorSiteCode: "3205810101", operateEntName: "中国中车股份有限公司", posX: "120.9328", posY: "31.7242", address: "常熟市通港工业园华联路58号", errInfo: "断电引发风机故障", errDate: "2015-8-31", regDate: "2015-9-1", isLater: "否", isDeal: "是" }
, { ID: 2, cantonCode: "320581", cantonName: "虞山镇", monitorSiteName: "虞山镇污水处理设施-01", monitorSiteCode: "3205810101", operateEntName: "中国中车股份有限公司", posX: "120.9328", posY: "31.7242", address: "常熟市通港工业园华联路58号", errInfo: "断电引发通讯故障报警", errDate: "2015-8-31", regDate: "2015-9-1", isLater: "否", isDeal: "是" }
, { ID: 3, cantonCode: "320581", cantonName: "虞山镇", monitorSiteName: "虞山镇污水处理设施-01", monitorSiteCode: "3205810101", operateEntName: "中国中车股份有限公司", posX: "120.9328", posY: "31.7242", address: "常熟市通港工业园华联路58号", errInfo: "断电引发通讯故障报警", errDate: "2015-8-31", regDate: "2015-9-1", isLater: "否", isDeal: "是" }
, { ID: 4, cantonCode: "320581", cantonName: "虞山镇", monitorSiteName: "虞山镇污水处理设施-01", monitorSiteCode: "3205810101", operateEntName: "中国中车股份有限公司", posX: "120.9328", posY: "31.7242", address: "常熟市通港工业园华联路58号", errInfo: "断电引发通讯故障报警", errDate: "2015-8-31", regDate: "2015-9-1", isLater: "是", isDeal: "否" }
, { ID: 5, cantonCode: "320581", cantonName: "虞山镇", monitorSiteName: "虞山镇污水处理设施-01", monitorSiteCode: "3205810101", operateEntName: "中国中车股份有限公司", posX: "120.9328", posY: "31.7242", address: "常熟市通港工业园华联路58号", errInfo: "风机故障报警", errDate: "2015-8-31", regDate: "2015-9-5", isLater: "是", isDeal: "否" }

]


};