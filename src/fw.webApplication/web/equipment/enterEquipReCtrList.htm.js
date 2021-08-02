var pageParams = {};

//页面初始化
$.page.pageInit = function () {
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.WDFCode)) {
        pageParams.WDFCode = $.page.params.WDFCode;
    };
    if (fw.fwObject.FWObjectHelper.hasValue($.page.params.equipmentNoList)) {
        pageParams.equipmentNoList = $.page.params.equipmentNoList.split(',');
    };
    //pageParams.WDFCode = "0001";
};
//页面加载
$.page.pageLoad = function () {
    datagrid1_Load();
};

function datagrid1_Load() {
    $.page.idM.datagrid1.loading();
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "basicInfo"
        , methodName: "queryPageEquipReCtr"
        , data: {
            ticket: $.page.ticket,
            queryParams: pageParams
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                //设置datagrid数据
                $.page.idM.datagrid1.set({ data: resultData.data });
            }
            else //Roger 2016/6/1 13:00:02 增加管辖区域
            {
                var erroInfo = resultData.infoList.join("<br>");
                $.page.showTips({ content: "操作失败!<br>" + erroInfo, state: "danger" });
            };
        }
    }));
};

//单元格渲染事件
function datagrid1_Renderer(e) {
    var html = "";
    switch (e.field) {
        case "operation":
            html = "<a class=\"rowequipmentNo\" rowequipmentNo=\"" + e.record.equipmentNo + "\" rowequipmentTypeCode=\"" + e.record.equipmentTypeCode + "\" href='javascript:void(0);'onclick='deleteOption()'>删除</a>";
            break;

        case "ReCtrSampTime":
            html = moment().format('YYYY-MM-DD H:mm:ss');
            break;
        default:
            break;
    };
    return html;
};

function deleteOption() {
    var rows = $.page.idM.datagrid1.getSelecteds();
    if (rows.length > 0) {
        $.page.idM.datagrid1.removeRows(rows, true);
    };
};

function enterClick() {
    //var rows = $.page.idM.datagrid1.getSelecteds();
    var enterEntity = $("a.rowequipmentNo");
    var equipmentNo = $.map(enterEntity, function (value, i) {
        return $(value).attr("rowequipmentNo");
    }).join(",");

    var equipmentTypeCode = $.map(enterEntity, function (value, i) {
        return $(value).attr("rowequipmentTypeCode");
    }).join(",");
    var url = fw.fwUrl.FWUrlHelper.addParams(fw.fwUrl.FWUrlHelper.getAbsoluteUrl("web/equipment/EquipReCtrSetting.htm", $.page.webSiteRootUrl), { equipmentNoList: equipmentNo, equipmentTypeCode: equipmentTypeCode });
    //,moduleTypeCode: moduleTypeCode
    mini.open({
        url: url
        , width: 600
        , height: 400
            , title: "反控设置"
            , showMaxButton: true
    });
};

//获取选中项对象集合
function getSelectedEntityList() {

};