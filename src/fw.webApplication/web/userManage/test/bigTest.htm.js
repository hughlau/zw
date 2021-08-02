var dataSourceList = [];
var buttonAddJQ = null;
var buttonEditJQ = null;
var buttonDeleteJQ = null;
var buttonSearchJQ = null;
var buttonAddInfoJQ = null;
$.page.pageInit = function () {
   // console.log('Init S--' + Date.parse(new Date()) / 1000);
    $.page.dataSourceSettingsDictionary = {
        "cmbCanton": {
          //  dataSourceName: "sysBasicManage.getCantonDicData"
          //  , dataSourceParams: { }
        }
    };
    //console.log('Init E--' + Date.parse(new Date()) / 1000);
};
$.page.pageLoad = function () {
    loadDicList();
};


function loadDicList() {
    console.log('Load S--' + Date.parse(new Date()) / 1000);
    $.page.ajax($.page.getAjaxSettings({
        serviceType: "crossDomainCall"
        , serviceName: "sysBasicManage"
        , methodName: "getCantonDicData"
        , data: {
            ticket: $.page.ticket 
        }
        , success: function (resultData) {
            //判断加载数据成功
            if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
                resultData.data = fw.fwObject.FWObjectHelper.hasValue(resultData.data.columns) ? fw.fwDataTable.FWDataTableHelper.toEntityList(resultData.data) : resultData.data;
                $.page.idM.cantonNew.loadList(resultData.data);
                console.log('Load E--' + Date.parse(new Date()) / 1000);
             
            };
        }
    }));
};